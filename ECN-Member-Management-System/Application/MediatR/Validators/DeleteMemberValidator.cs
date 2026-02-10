using Application.MediatR;
using FluentValidation;

namespace Application.MediatR.Validators
{
    public class DeleteMemberValidator : AbstractValidator<Delete.Command>
    {
        public DeleteMemberValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Member ID is required.");
        }
    }
}

