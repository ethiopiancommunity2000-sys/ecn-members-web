using MediatR;
using Application.Core;
using Application.Dtos;
using Persistence;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;
using System.Linq;

namespace Application.MediatR
{
    public class GetMemberList
    {
        //public class Query : IRequest<Result<List<MemberDto>>>
        public class Query : IRequest<Result<List<MemberDto>>>
        {
            // Add the missing type definition
        }
    public class Handler : IRequestHandler<Query, Result<List<MemberDto>>>
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        public Handler(AppDbContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }
        public async Task<Result<List<MemberDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
            // Load members without MemberFiles to avoid loading binary ImageData (we attach file metadata only below)
        var members = await _context.Members
        .Include(m => m.Payments)
        .Include(m => m.Addresses)
        .Include(m => m.FamilyMembers)
        .Include(m => m.Incidents)
        .ToListAsync(cancellationToken);

    var memberDtos = _mapper.Map<List<MemberDto>>(members);

    // Load file metadata only (exclude ImageData) to avoid large payloads and timeouts
    var allMemberFileMetas = await _context.MemberFiles
        .Select(f => new { f.Id, f.FileName, f.Size, f.MemberId, f.FileDescription, f.PaymentId })
        .ToListAsync(cancellationToken);

    var filesByMemberId = allMemberFileMetas
        .GroupBy(f => f.MemberId)
        .ToDictionary(g => g.Key, g => g.ToList());

    foreach (var memberDto in memberDtos)
    {
        if (filesByMemberId.TryGetValue(memberDto.Id, out var metas))
        {
            memberDto.MemberFiles = metas.Select(f => new MemberFileDto
            {
                Id = f.Id.ToString(),
                FileName = f.FileName,
                Size = f.Size,
                MemberId = f.MemberId,
                FileDescription = f.FileDescription ?? string.Empty,
                PaymentId = f.PaymentId ?? string.Empty,
                FileType = Path.GetExtension(f.FileName),
                DownloadUrl = $"/api/members/file/{f.Id}"
            }).ToList();
        }
        else
        {
            memberDto.MemberFiles = new List<MemberFileDto>();
        }
    }

    return Result<List<MemberDto>>.Success(memberDtos);
        }
    }
    }


}