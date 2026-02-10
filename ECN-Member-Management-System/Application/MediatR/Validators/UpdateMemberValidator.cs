using Application.MediatR;
using FluentValidation;

namespace Application.MediatR.Validators
{
    public class UpdateMemberValidator : AbstractValidator<Update.Command>
    {
        public UpdateMemberValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Member ID is required.");

            RuleFor(x => x.MemberDto)
                .NotNull().WithMessage("MemberDto is required.");

            When(x => x.MemberDto != null, () =>
            {
                RuleFor(x => x.MemberDto.Email)
                    .NotEmpty().WithMessage("Email is required.")
                    .EmailAddress().WithMessage("Email must be a valid email address.");

                RuleFor(x => x.MemberDto.FirstName)
                    .NotEmpty().WithMessage("First name is required.")
                    .MaximumLength(100).WithMessage("First name must not exceed 100 characters.");

                RuleFor(x => x.MemberDto.LastName)
                    .NotEmpty().WithMessage("Last name is required.")
                    .MaximumLength(100).WithMessage("Last name must not exceed 100 characters.");
            });
        }
    }
}

