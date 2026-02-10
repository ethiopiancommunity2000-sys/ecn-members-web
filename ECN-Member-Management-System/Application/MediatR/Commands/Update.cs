using Application.Core;
using Application.Dtos;
using Application.Utilities;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Persistence;
using System.IO;
using System.Linq;

namespace Application.MediatR
{
    /// <summary>
    /// Updates a Member and related entities.
    /// File replacement is handled EXCLUSIVELY by UploadFile.
    /// </summary>
    public class Update
    {
        // ============================
        // Command
        // ============================
        public class Command : IRequest<Result<MemberDto>>
        {
            public string Id { get; }
            public MemberDto MemberDto { get; }
            public List<IFormFile> Files { get; set; }
            public string FileDescription { get; set; }
            public string PaymentId { get; set; }

            public Command(string id, MemberDto memberDto, List<IFormFile> files = null, string fileDescription = null, string paymentId = null)
            {
                Id = id ?? throw new ArgumentNullException(nameof(id));
                MemberDto = memberDto ?? throw new ArgumentNullException(nameof(memberDto));
                Files = files ?? new List<IFormFile>();
                FileDescription = fileDescription;
                PaymentId = paymentId;
            }
        }

        // ============================
        // Handler
        // ============================
        public class Handler : IRequestHandler<Command, Result<MemberDto>>
        {
            private readonly AppDbContext _context;
            private readonly IMapper _mapper;

            public Handler(AppDbContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<MemberDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                // ============================
                // Load Member (tracked)
                // ============================
                var member = await _context.Members
                    .Include(m => m.Addresses)
                    .Include(m => m.FamilyMembers)
                    .Include(m => m.Payments)
                    .Include(m => m.Incidents)
                    .Include(m => m.MemberFiles)
                    .FirstOrDefaultAsync(m => m.Id == request.Id, cancellationToken);

                if (member == null)
                    return Result<MemberDto>.Failure("Member not found.");

                // ======================================================
                // 🔒 CRITICAL FIX: NEVER allow MemberFiles from DTO
                // ======================================================
                request.MemberDto.MemberFiles = null;
                
                // ======================================================
                // PRESERVE MemberFiles count for verification
                // ======================================================
                var initialMemberFilesCount = member.MemberFiles?.Count ?? 0;
                Console.WriteLine($"Starting update - Member has {initialMemberFilesCount} MemberFile(s)");

                // ============================
                // Deserialize FormData JSON
                // ============================
                if (!string.IsNullOrWhiteSpace(request.MemberDto.AddressesJson))
                    request.MemberDto.Addresses =
                        JsonConvert.DeserializeObject<List<AddressDto>>(request.MemberDto.AddressesJson) ?? new();

                if (!string.IsNullOrWhiteSpace(request.MemberDto.FamilyMembersJson))
                    request.MemberDto.FamilyMembers =
                        JsonConvert.DeserializeObject<List<FamilyMemberDto>>(request.MemberDto.FamilyMembersJson) ?? new();

                if (!string.IsNullOrWhiteSpace(request.MemberDto.PaymentsJson))
                    request.MemberDto.Payments =
                        JsonConvert.DeserializeObject<List<PaymentDto>>(request.MemberDto.PaymentsJson) ?? new();

                if (!string.IsNullOrWhiteSpace(request.MemberDto.IncidentsJson))
                    request.MemberDto.Incidents =
                        JsonConvert.DeserializeObject<List<IncidentDto>>(request.MemberDto.IncidentsJson) ?? new();

                // ============================
                // Map scalar fields ONLY
                // ============================
                _mapper.Map(request.MemberDto, member);

                // Explicitly set ReceiverId (AutoMapper's ForAllMembers condition may skip it if empty)
                if (!string.IsNullOrWhiteSpace(request.MemberDto.ReceiverId))
                {
                    member.ReceiverId = request.MemberDto.ReceiverId.Trim();
                }
                else
                {
                    member.ReceiverId = null;
                }

                // ============================
                // Addresses
                // ============================
                if (request.MemberDto.Addresses != null)
                {
                    EntityUpdater.UpdateMemberNavigation(
                        member.Addresses,
                        request.MemberDto.Addresses,
                        _mapper,
                        id => id);

                    foreach (var a in member.Addresses)
                        a.MemberId ??= member.Id;
                }

                // ============================
                // Family Members
                // ============================
                if (request.MemberDto.FamilyMembers != null)
                {
                    EntityUpdater.UpdateMemberNavigation(
                        member.FamilyMembers,
                        request.MemberDto.FamilyMembers,
                        _mapper,
                        id => id);

                    foreach (var f in member.FamilyMembers)
                        f.MemberId ??= member.Id;
                }

                // ============================
                // Payments (preserve IDs to maintain MemberFiles references)
                // ============================
                if (request.MemberDto.Payments != null)
                {
                    // Store existing payment data BEFORE update - key by unique combination of amount, date, and type
                    var existingPaymentsByKey = member.Payments.ToDictionary(
                        p => $"{p.PaymentAmount}|{p.PaymentDate:yyyy-MM-dd}|{p.PaymentType}|{p.PaymentRecurringType}",
                        p => p.Id.ToString());
                    
                    // Also store by ID for quick lookup
                    var existingPaymentsById = member.Payments.ToDictionary(p => p.Id.ToString(), p => p);
                    var existingDates = member.Payments.ToDictionary(p => p.Id.ToString(), p => p.PaymentDate);
                    var existingAmounts = member.Payments.ToDictionary(p => p.Id.ToString(), p => p.PaymentAmount);

                    // Create mapping of DTO ID to payment key (amount|date|type) BEFORE update
                    var dtoIdToPaymentKey = new Dictionary<string, string>();
                    foreach (var dto in request.MemberDto.Payments)
                    {
                        if (!string.IsNullOrWhiteSpace(dto.Id))
                        {
                            var paymentKey = $"{dto.Amount}|{dto.PaymentDate}|{dto.PaymentType}|{dto.PaymentRecurringType}";
                            dtoIdToPaymentKey[dto.Id] = paymentKey;
                        }
                    }

                    EntityUpdater.UpdateMemberNavigation(
                        member.Payments,
                        request.MemberDto.Payments,
                        _mapper,
                        id => id);

                    // After update, match payments and update MemberFiles if IDs changed
                    var paymentIdMapping = new Dictionary<string, string>(); // oldId -> newId
                    
                    foreach (var dto in request.MemberDto.Payments)
                    {
                        if (string.IsNullOrWhiteSpace(dto.Id)) continue;
                        
                        if (!Guid.TryParse(dto.Id, out var originalPaymentId)) continue;
                        
                        // Create payment key from DTO
                        var paymentKey = $"{dto.Amount}|{dto.PaymentDate}|{dto.PaymentType}|{dto.PaymentRecurringType}";
                        
                        // Parse payment date
                        DateTime paymentDate = DateTime.MinValue;
                        if (!string.IsNullOrWhiteSpace(dto.PaymentDate))
                        {
                            DateTime.TryParse(dto.PaymentDate, out paymentDate);
                        }
                        
                        // Find the payment that matches this DTO by amount, date, and type
                        var matchingPayment = member.Payments.FirstOrDefault(p => 
                            Math.Abs(p.PaymentAmount - dto.Amount) < 0.01m &&
                            (paymentDate == DateTime.MinValue || p.PaymentDate.Date == paymentDate.Date) &&
                            p.PaymentType.ToString() == dto.PaymentType &&
                            p.PaymentRecurringType.ToString() == dto.PaymentRecurringType);
                        
                        if (matchingPayment != null)
                        {
                            // If the payment ID changed, we need to update MemberFiles
                            if (matchingPayment.Id.ToString() != dto.Id)
                            {
                                paymentIdMapping[dto.Id] = matchingPayment.Id.ToString();
                                Console.WriteLine($"Payment ID changed: {dto.Id} -> {matchingPayment.Id} (Key: {paymentKey})");
                            }
                            else
                            {
                                Console.WriteLine($"Payment ID preserved: {dto.Id}");
                            }
                        }
                        else
                        {
                            Console.WriteLine($"Warning: Could not find matching payment for DTO ID: {dto.Id} (Key: {paymentKey})");
                        }
                    }

                    // Update all MemberFiles that reference old payment IDs
                    if (paymentIdMapping.Any())
                    {
                        foreach (var kvp in paymentIdMapping)
                        {
                            var filesToUpdate = await _context.MemberFiles
                                .Where(f => f.MemberId == member.Id && f.PaymentId == kvp.Key)
                                .ToListAsync(cancellationToken);
                            
                            foreach (var file in filesToUpdate)
                            {
                                Console.WriteLine($"Updating MemberFile {file.Id} PaymentId from {kvp.Key} to {kvp.Value}");
                                file.PaymentId = kvp.Value;
                                // Explicitly mark as modified to ensure EF Core tracks the change
                                _context.Entry(file).Property(f => f.PaymentId).IsModified = true;
                            }
                        }
                    }
                    
                    // Ensure all MemberFiles are tracked and will be included in the response
                    // Load all files for this member to ensure they're in the navigation property
                    var allMemberFiles = await _context.MemberFiles
                        .Where(f => f.MemberId == member.Id)
                        .ToListAsync(cancellationToken);
                    
                    Console.WriteLine($"Found {allMemberFiles.Count} total MemberFiles for member {member.Id}");
                    
                    // Ensure the navigation property is populated
                    if (member.MemberFiles == null)
                    {
                        member.MemberFiles = new List<MemberFile>();
                    }
                    
                    // Add any files that aren't already in the navigation property
                    foreach (var file in allMemberFiles)
                    {
                        if (!member.MemberFiles.Any(f => f.Id == file.Id))
                        {
                            member.MemberFiles.Add(file);
                        }
                    }
                    
                    Console.WriteLine($"Member.MemberFiles collection now has {member.MemberFiles.Count} file(s)");

                    // Preserve dates and amounts for existing payments
                    foreach (var p in member.Payments)
                    {
                        p.MemberId ??= member.Id;

                        var paymentKey = p.Id.ToString();
                        if (existingDates.TryGetValue(paymentKey, out var d))
                        {
                            if (p.PaymentDate == DateTime.MinValue)
                                p.PaymentDate = d;
                        }

                        if (existingAmounts.TryGetValue(paymentKey, out var a))
                        {
                            if (p.PaymentAmount == 0 && a > 0)
                                p.PaymentAmount = a;
                        }
                    }
                }

                // ============================
                // Incidents
                // ============================
                if (request.MemberDto.Incidents != null)
                {
                    var existingDates = member.Incidents.ToDictionary(i => i.Id, i => i.IncidentDate);

                    EntityUpdater.UpdateMemberNavigation(
                        member.Incidents,
                        request.MemberDto.Incidents,
                        _mapper,
                        id => id);

                    foreach (var i in member.Incidents)
                    {
                        i.MemberId ??= member.Id;

                        if (i.IncidentDate == DateTime.MinValue &&
                            existingDates.TryGetValue(i.Id, out var d))
                            i.IncidentDate = d;
                    }
                }

                // ============================
                // Handle file uploads if any
                // ============================
                if (request.Files != null && request.Files.Any())
                {
                    // Allow multiple files per payment - just add new files without deleting existing ones
                    // Users can delete specific files using the delete button if needed
                    if (!string.IsNullOrWhiteSpace(request.PaymentId))
                    {
                        Console.WriteLine($"Adding new file(s) for PaymentId: '{request.PaymentId}' for member: {member.Id}");
                        
                        // Check existing files for this payment (for logging only)
                        var existingFilesForPayment = await _context.MemberFiles
                            .Where(f => f.MemberId == member.Id && f.PaymentId == request.PaymentId)
                            .CountAsync(cancellationToken);
                        
                        Console.WriteLine($"Payment '{request.PaymentId}' currently has {existingFilesForPayment} existing file(s). Adding new file(s) without deleting existing ones.");
                    }
                    else
                    {
                        Console.WriteLine("No PaymentId provided - files will be added without a payment association");
                    }

                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
                    const long maxFileSize = 10 * 1024 * 1024; // 10 MB

                    foreach (var formFile in request.Files)
                    {
                        if (formFile.Length == 0) continue;

                        var extension = Path.GetExtension(formFile.FileName).ToLowerInvariant();
                        if (!allowedExtensions.Contains(extension))
                            continue; // Skip invalid files

                        if (formFile.Length > maxFileSize)
                            continue; // Skip oversized files

                        byte[] fileBytes;
                        using (var ms = new MemoryStream())
                        {
                            await formFile.CopyToAsync(ms, cancellationToken);
                            fileBytes = ms.ToArray();
                        }

                        var memberFile = new MemberFile
                        {
                            Id = Guid.NewGuid(),
                            FileName = formFile.FileName,
                            Size = (int)formFile.Length,
                            ImageData = fileBytes,
                            ContentType = formFile.ContentType ?? "application/octet-stream",
                            MemberId = member.Id,
                            Member = member,
                            PaymentId = request.PaymentId, // This should match the payment.id exactly
                            FileDescription = request.FileDescription
                        };

                        // Explicitly add to context to ensure EF Core tracks it
                        _context.MemberFiles.Add(memberFile);
                        // Also add to navigation property for consistency
                        member.MemberFiles.Add(memberFile);
                        
                        Console.WriteLine($"Added new file: {memberFile.FileName} (ID: {memberFile.Id}, PaymentId: '{memberFile.PaymentId ?? "null"}') for member: {member.Id}");
                    }
                }

                // ============================
                // Save (NO Update(member))
                // ============================
                try
                {
                    await _context.SaveChangesAsync(cancellationToken);
                    Console.WriteLine("Successfully saved all changes to database");

                    // Reload clean state with all includes to ensure MemberFiles are fresh
                    // Detach all related entities to ensure clean reload
                    _context.Entry(member).State = EntityState.Detached;
                    foreach (var address in member.Addresses)
                        _context.Entry(address).State = EntityState.Detached;
                    foreach (var familyMember in member.FamilyMembers)
                        _context.Entry(familyMember).State = EntityState.Detached;
                    foreach (var payment in member.Payments)
                        _context.Entry(payment).State = EntityState.Detached;
                    foreach (var incident in member.Incidents)
                        _context.Entry(incident).State = EntityState.Detached;
                    foreach (var file in member.MemberFiles)
                        _context.Entry(file).State = EntityState.Detached;
                    
                    // Reload with explicit includes
                    var updated = await _context.Members
                        .Include(m => m.Addresses)
                        .Include(m => m.FamilyMembers)
                        .Include(m => m.Payments)
                        .Include(m => m.Incidents)
                        .Include(m => m.MemberFiles)
                        .FirstAsync(m => m.Id == request.Id, cancellationToken);

                    // ALWAYS explicitly load MemberFiles using EF Core's explicit loading
                    // This ensures the navigation property is properly populated and tracked
                    await _context.Entry(updated)
                        .Collection(m => m.MemberFiles)
                        .LoadAsync(cancellationToken);
                    
                    Console.WriteLine($"Explicitly loaded MemberFiles - collection has {updated.MemberFiles?.Count ?? 0} file(s)");
                    
                    // Double-check by querying directly to verify files exist in DB
                    var filesCountInDb = await _context.MemberFiles
                        .Where(f => f.MemberId == request.Id)
                        .CountAsync(cancellationToken);
                    
                    Console.WriteLine($"Database has {filesCountInDb} MemberFile(s) for member {request.Id}");
                    
                    // If Include() didn't work but files exist, manually load them
                    if ((updated.MemberFiles == null || !updated.MemberFiles.Any()) && filesCountInDb > 0)
                    {
                        Console.WriteLine("WARNING: Include() didn't load MemberFiles, manually loading...");
                        var allMemberFiles = await _context.MemberFiles
                            .Where(f => f.MemberId == request.Id)
                            .ToListAsync(cancellationToken);
                        
                        // Attach files to the member's navigation property
                        if (updated.MemberFiles == null)
                        {
                            updated.MemberFiles = new List<MemberFile>();
                        }
                        
                        foreach (var file in allMemberFiles)
                        {
                            // Check if file is already in collection
                            if (!updated.MemberFiles.Any(f => f.Id == file.Id))
                            {
                                updated.MemberFiles.Add(file);
                            }
                        }
                        
                        Console.WriteLine($"Manually loaded {allMemberFiles.Count} file(s) into MemberFiles collection");
                    }
                    
                    // Log each file for debugging
                    if (updated.MemberFiles != null && updated.MemberFiles.Any())
                    {
                        foreach (var file in updated.MemberFiles)
                        {
                            Console.WriteLine($"  - File: {file.FileName} (ID: {file.Id}, PaymentId: {file.PaymentId ?? "null"})");
                        }
                    }
                    
                    var dto = _mapper.Map<MemberDto>(updated);
                    
                    // CRITICAL: ALWAYS manually ensure MemberFiles are in the DTO
                    // This guarantees they're included regardless of AutoMapper or Include() issues
                    var allFilesForDto = await _context.MemberFiles
                        .Where(f => f.MemberId == request.Id)
                        .ToListAsync(cancellationToken);
                    
                    Console.WriteLine($"Final verification: Database has {allFilesForDto.Count} MemberFile(s) for member {request.Id}");
                    
                    if (allFilesForDto.Any())
                    {
                        // Always manually map files to ensure they're in the DTO
                        var fileDtos = _mapper.Map<List<MemberFileDto>>(allFilesForDto);
                        dto.MemberFiles = fileDtos ?? new List<MemberFileDto>();
                        
                        
                        // Log each file in the final DTO
                        foreach (var fileDto in dto.MemberFiles)
                        {
                            Console.WriteLine($"  - DTO File: {fileDto.FileName} (ID: {fileDto.Id}, PaymentId: {fileDto.PaymentId ?? "null"})");
                        }
                    }
                    else
                    {
                        // No files in DB, ensure DTO has empty list
                        dto.MemberFiles = new List<MemberFileDto>();
                    }
                    
                    return Result<MemberDto>.Success(dto);
                }
                catch (Exception ex)
                {
                   
                    return Result<MemberDto>.Failure($"Update failed: {ex.Message}");
                }
            }
        }
    }
}
