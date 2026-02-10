using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Application.Dtos;
using Domain;
using Application.Core;
using Persistence;

namespace Application.MediatR
{
    public class UploadFile
    {
        public class Command : IRequest<Result<List<MemberFileDto>>>
        {
            public List<IFormFile> Files { get; set; } = new();
            public string MemberId { get; set; } = string.Empty;
            public string PaymentId { get; set; }
            public string FileDescription { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<List<MemberFileDto>>>
        {
            private readonly AppDbContext _dbContext;

            public Handler(AppDbContext dbContext)
            {
                _dbContext = dbContext;
            }

            public async Task<Result<List<MemberFileDto>>> Handle(
                Command request,
                CancellationToken cancellationToken)
            {
                if (request.Files == null || !request.Files.Any())
                    return Result<List<MemberFileDto>>.Failure("No files uploaded.");

                var member = await _dbContext.Members
                    .Include(m => m.MemberFiles)
                    .FirstOrDefaultAsync(m => m.Id == request.MemberId, cancellationToken);

                if (member == null)
                    return Result<List<MemberFileDto>>.Failure("Member not found.");

                // Allow multiple files per payment - just add new files without deleting existing ones
                // Users can delete specific files using the delete button if needed
                if (!string.IsNullOrWhiteSpace(request.PaymentId))
                {
                    var existingFilesCount = await _dbContext.MemberFiles
                        .Where(f => f.MemberId == request.MemberId && f.PaymentId == request.PaymentId)
                        .CountAsync(cancellationToken);

                    Console.WriteLine($"UploadFile: Payment {request.PaymentId} currently has {existingFilesCount} existing file(s). Adding new file(s) without deleting existing ones.");
                }

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
                var uploadedFiles = new List<MemberFile>();

                foreach (var formFile in request.Files)
                {
                    if (formFile.Length == 0)
                        continue;

                    var extension = Path.GetExtension(formFile.FileName).ToLowerInvariant();
                    if (!allowedExtensions.Contains(extension))
                        return Result<List<MemberFileDto>>
                            .Failure($"Invalid file type: {formFile.FileName}");

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
                        PaymentId = request.PaymentId, // This should match the payment.id exactly
                        FileDescription = request.FileDescription
                    };

                    Console.WriteLine($"UploadFile: Adding file: {memberFile.FileName} (ID: {memberFile.Id}, PaymentId: '{memberFile.PaymentId ?? "null"}') for member: {member.Id}");

                    _dbContext.MemberFiles.Add(memberFile);
                    uploadedFiles.Add(memberFile);
                }

                await _dbContext.SaveChangesAsync(cancellationToken);

                // ✅ METADATA-ONLY DTOs (NO ImageData)
                var dtoList = uploadedFiles.Select(f => new MemberFileDto
                {
                    Id = f.Id.ToString(),
                    FileName = f.FileName,
                    Size = f.Size,
                    MemberId = f.MemberId,
                    PaymentId = f.PaymentId,
                    FileDescription = f.FileDescription,
                    FileType = Path.GetExtension(f.FileName),
                    DownloadUrl = $"/api/members/file/{f.Id}"
                }).ToList();

                return Result<List<MemberFileDto>>.Success(dtoList);
            }
        }
    }
}
