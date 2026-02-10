using Application.Core;
using AutoMapper;
using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;

namespace Application.MediatR
{
    public class Delete
    {


        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
            // Add the missing type definition
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly AppDbContext _context;
            private readonly IMapper _mapper;
            public Handler(AppDbContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrWhiteSpace(request.Id))
                {
                    return Result<Unit>.Failure("Member ID is required.");
                }
                
                var member = await _context.Members
                   //ProjectTo  === using AutoMapper.QueryableExtensions;
                   //.ProjectTo<Member>(_mapper.ConfigurationProvider)
                   .FirstOrDefaultAsync(m => m.Id == request.Id, cancellationToken: cancellationToken);
                if (member == null) return Result<Unit>.Failure("No member found");
                _context.Members.Remove(member);
                var success = await _context.SaveChangesAsync(cancellationToken) > 0;
                if (!success) return Result<Unit>.Failure("Failed to delete member");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}