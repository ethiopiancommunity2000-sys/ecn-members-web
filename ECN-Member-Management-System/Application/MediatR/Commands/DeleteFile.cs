using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.MediatR
{
    public class DeleteFile
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid FileId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly AppDbContext _context;

            public Handler(AppDbContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                Console.WriteLine($"DeleteFile.Handler: Looking for file with ID: {request.FileId}");

                var file = await _context.MemberFiles
                    .FirstOrDefaultAsync(f => f.Id == request.FileId, cancellationToken);

                if (file == null)
                {
                    Console.WriteLine($"DeleteFile.Handler: File not found with ID: {request.FileId}");
                    return Result<Unit>.Failure("File not found.");
                }

                Console.WriteLine($"DeleteFile.Handler: Found file: {file.FileName} (ID: {file.Id}, MemberId: {file.MemberId})");

                _context.MemberFiles.Remove(file);
                var success = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (!success)
                {
                    Console.WriteLine($"DeleteFile.Handler: SaveChangesAsync returned 0, file not deleted");
                    return Result<Unit>.Failure("Failed to delete file.");
                }

                Console.WriteLine($"DeleteFile.Handler: Successfully deleted file: {file.FileName}");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}

