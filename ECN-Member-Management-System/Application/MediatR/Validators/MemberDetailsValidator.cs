using Application.MediatR.Queries;
using FluentValidation;

namespace Application.MediatR.Validators
{
    public class MemberDetailsValidator : AbstractValidator<MemberDetails.Query>
    {
        public MemberDetailsValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Member ID is required.");
        }
    }
}

