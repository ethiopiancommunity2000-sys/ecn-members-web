using Application.Dtos;
using Application.Core;
using AutoMapper;
using MediatR;
using Persistence;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace Application.MediatR
{
   public class MemberDetails
{
    public class Query : IRequest<Result<MemberDto>>
    {
        public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<MemberDto>>
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public Handler(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<MemberDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var member = await _context.Members
                .Include(m => m.Addresses)
                .Include(m => m.FamilyMembers)
                .Include(m => m.Payments)
                .Include(m => m.Incidents)
                .Include(m => m.MemberFiles)
                .FirstOrDefaultAsync(m => m.Id == request.Id.ToString(), cancellationToken);

            if (member == null)
                return Result<MemberDto>.Failure("Member not found");

            var dto = _mapper.Map<MemberDto>(member);

            // 🔒 FORCE files exactly like GetMemberList
            var files = await _context.MemberFiles
                .Where(f => f.MemberId == member.Id)
                .ToListAsync(cancellationToken);

            dto.MemberFiles = _mapper.Map<List<MemberFileDto>>(files)
                               ?? new List<MemberFileDto>();

            return Result<MemberDto>.Success(dto);
        }
    }
}

}