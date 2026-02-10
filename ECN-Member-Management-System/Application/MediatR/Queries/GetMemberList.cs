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
            // ! b/c =>ProjectTo<MemberDto> cannot execute Convert.ToBase64String -
            //!  -in SQL. EF Core ignores it, so Base64FileData ends up null. that is why we dont't use ProjectTo()<>
                var id = string.Empty;
        //   var members = await _context.Members
             //ProjectTo  === using AutoMapper.QueryableExtensions; //! this work as the same as .ProjectTo<>
        //        .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
        //        .ToListAsync(cancellationToken);
        var members = await _context.Members
        .Include(m => m.MemberFiles)
        .Include(m => m.Payments)
        .Include(m => m.Addresses)
        .Include(m => m.FamilyMembers)
        .Include(m => m.Incidents)
        .ToListAsync(cancellationToken);

    var memberDtos = _mapper.Map<List<MemberDto>>(members);

    // CRITICAL: Ensure all MemberFiles are included in each member's DTO
    // Query all MemberFiles once and group by MemberId for efficiency
    var allMemberFiles = await _context.MemberFiles
        .ToListAsync(cancellationToken);
    
    var filesByMemberId = allMemberFiles
        .GroupBy(f => f.MemberId)
        .ToDictionary(g => g.Key, g => g.ToList());

    // Ensure each member DTO has its MemberFiles
    foreach (var memberDto in memberDtos)
    {
        if (filesByMemberId.TryGetValue(memberDto.Id, out var files))
        {
            var fileDtos = _mapper.Map<List<MemberFileDto>>(files);
            memberDto.MemberFiles = fileDtos ?? new List<MemberFileDto>();
        }
        else
        {
            memberDto.MemberFiles = new List<MemberFileDto>();
        }
    }

    Console.WriteLine($"GetMemberList: Returned {memberDtos.Count} members, total {allMemberFiles.Count} files across all members");

    return Result<List<MemberDto>>.Success(memberDtos);
        }
    }
    }


}