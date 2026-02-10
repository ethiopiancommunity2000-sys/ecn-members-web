using Application.Core;
using Application.Dtos;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.MediatR.Queries
{
    // Get list of files for a member
  public class GetMembeFiles
{
    
    private static string GetContentType(string fileName)
{
    return Path.GetExtension(fileName).ToLowerInvariant() switch
    {
        ".png" => "image/png",
        ".jpg" => "image/jpeg",
        ".jpeg" => "image/jpeg",
        ".pdf" => "application/pdf",
        _ => "application/octet-stream"
    };
}
    public class Query : IRequest<Result<List<MemberFileDto>>>
        {
            public required Guid Id { get; set; }
        }

    public class Handler : IRequestHandler<Query, Result<List<MemberFileDto>>>
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public Handler(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<List<MemberFileDto>>> Handle(
            Query request,
            CancellationToken cancellationToken)
        {
            var files = await _context.MemberFiles
                .AsNoTracking()
                .Where(f => f.MemberId == request.Id.ToString())   // ✅ FIXED
                    // (if available)
                .ToListAsync(cancellationToken);

            var dtos = _mapper.Map<List<MemberFileDto>>(files);

                foreach (var file in dtos)
                {
                    GetContentType(file.DownloadUrl.ToLower());
                 }

            return Result<List<MemberFileDto>>.Success(dtos);
        }
    }
}

}
