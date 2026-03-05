using Application.Dtos;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Application.MediatR
{
    public class CreateMember
    {
        public class Command : IRequest<Result<string>>
        {
            public MemberDto MemberDto { get; set; } = null!;
            public List<IFormFile> Files { get; set; } = new();
        }

        public class Handler : IRequestHandler<Command, Result<string>>
        {
            private readonly IMapper _mapper;
            private readonly UserManager<Member> _userManager;

            public Handler(IMapper mapper, UserManager<Member> userManager)
            {
                _mapper = mapper;
                _userManager = userManager;
            }

            public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
            {
                var dto = request.MemberDto;
                if (dto == null)
                    return Result<string>.Failure("MemberDto cannot be null.");

                // Validate Email
                if (string.IsNullOrWhiteSpace(dto.Email))
                    return Result<string>.Failure("Email is required.");

                if (await _userManager.FindByEmailAsync(dto.Email) != null)
                    return Result<string>.Failure("Email already exists.");

                    

                // Map basic fields
                var member = _mapper.Map<Member>(dto);
                //11
               // member.Id = Guid.NewGuid().ToString();

             //   member.RegisterDate = DateTime.UtcNow.ToString();

                member.RegisterDate = DateTime.UtcNow.ToString("MM/dd/yyyy");

                
                
                // Explicitly set ReceiverId (AutoMapper's ForAllMembers condition may skip it if empty)
                // This ensures ReceiverId is always set, even if it's null
                if (!string.IsNullOrWhiteSpace(dto.ReceiverId))
                {
                    member.ReceiverId = dto.ReceiverId.Trim();
                }
                else
                {
                    member.ReceiverId = null;
                }


                // Use provided UserName if available, otherwise auto-generate
                if (!string.IsNullOrWhiteSpace(dto.UserName))
                {
                    // Check if provided username is already taken
                    if (await _userManager.FindByNameAsync(dto.UserName) != null)
                    {
                        return Result<string>.Failure($"Username '{dto.UserName}' is already taken.");
                    }
                    member.UserName = dto.UserName;
                }
                else
                {
                    // Auto-generate username if not provided
                    var first = (dto.FirstName ?? "").Trim();
                    var last = (dto.LastName ?? "").Trim();
                    string baseUsername = string.IsNullOrWhiteSpace(first) && string.IsNullOrWhiteSpace(last)
                        ? "member"
                        : $"{first}_{last}".Replace(" ", "_");
                    string uniqueUsername = baseUsername;
                    int suffix = 1;
                    while (await _userManager.FindByNameAsync(uniqueUsername) != null)
                    {
                        uniqueUsername = $"{baseUsername}_{suffix}";
                        suffix++;
                    }
                    member.UserName = uniqueUsername;
                }

                // Map nested collections (invalid JSON returns empty list)
                try
                {
                    member.Addresses = JsonConvert.DeserializeObject<List<AddressDto>>(dto.AddressesJson ?? "[]")?
                        .Select(a => _mapper.Map<Address>(a)).ToList() ?? new List<Address>();

                    member.FamilyMembers = JsonConvert.DeserializeObject<List<FamilyMemberDto>>(dto.FamilyMembersJson ?? "[]")?
                        .Select(f => _mapper.Map<FamilyMember>(f)).ToList() ?? new List<FamilyMember>();

                    // Filter out empty payments (where PaymentType is null/empty) before mapping
                    var paymentDtos = JsonConvert.DeserializeObject<List<PaymentDto>>(dto.PaymentsJson ?? "[]")
                        ?? new List<PaymentDto>();

                    member.Payments = paymentDtos
                        .Where(p => !string.IsNullOrWhiteSpace(p.PaymentType))
                        .Select(p => _mapper.Map<Payment>(p))
                        .ToList();

                    // Filter out empty incidents (where IncidentType is null/empty) before mapping
                    var incidentDtos = JsonConvert.DeserializeObject<List<IncidentDto>>(dto.IncidentsJson ?? "[]")
                        ?? new List<IncidentDto>();

                    member.Incidents = incidentDtos
                        .Where(i => !string.IsNullOrWhiteSpace(i.IncidentType))
                        .Select(i => _mapper.Map<Incident>(i))
                        .ToList();
                }
                catch (JsonException ex)
                {
                    return Result<string>.Failure($"Invalid JSON in member data: {ex.Message}");
                }

                // Initialize MemberFiles
                member.MemberFiles = new List<MemberFile>();

               
               Payment initialPayment = null;

                // Prefer explicit InitialPaymentAmount if provided
                if (dto.InitialPaymentAmount.HasValue && dto.InitialPaymentAmount > 0)
                {
                    initialPayment = new Payment
                    {
                        // Id will default to a new Guid if not set
                        PaymentAmount = dto.InitialPaymentAmount.Value,
                        PaymentDate = DateTime.UtcNow,
                        PaymentType = PaymentType.Cash,
                        PaymentRecurringType = PaymentRecurringType.Membership
                    };

                    member.Payments.Add(initialPayment);
                }
    
                // Otherwise, if there are any payments from the form,
                // treat the first one as the "primary" payment for initial receipts
                else if (member.Payments != null && member.Payments.Any())
                {
                    initialPayment = member.Payments.FirstOrDefault();
                }

                // Handle uploaded files
                foreach (var file in request.Files)
                {
                    if (file.Length == 0) continue;

                    using var ms = new MemoryStream();
                    await file.CopyToAsync(ms, cancellationToken);

                    member.MemberFiles.Add(new MemberFile
                        {
                            Id = Guid.NewGuid(),
                            FileName = file.FileName,
                            Size = (int)file.Length,
                            ImageData = ms.ToArray(),
                            ContentType = file.ContentType ?? "application/octet-stream",
                            MemberId = member.Id,
                            PaymentId = initialPayment?.Id   
                        });
                }

                // Optional flags
                // New members are active by default unless explicitly set to false
                member.IsActive = dto.IsActive ?? true;
                member.IsAdmin = dto.IsAdmin ?? false;

                // Create member; no password from member — use temporary default (member can change later)
                var password = string.IsNullOrWhiteSpace(dto.Password) ? "Default@123" : dto.Password;
                var result = await _userManager.CreateAsync(member, password);

                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    return Result<string>.Failure(errors);
                }

                // Note: Sign-in is handled at the controller/API level if needed
                // Removed SignInManager dependency to keep Application layer framework-agnostic

                return Result<string>.Success(member.Id);
            }
        }
    }
}
