using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Dtos;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.MediatR.Queries
{
   public class GetMember
{
    public class Query : IRequest<Result<MemberDto>>
    {
        public string Id { get; set; }
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
                .FirstOrDefaultAsync(m => m.Id == request.Id, cancellationToken);

            if (member == null)
                return Result<MemberDto>.Failure("Member not found");

            var dto = _mapper.Map<MemberDto>(member);

            // *** FORCE MemberFiles (same as list)
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