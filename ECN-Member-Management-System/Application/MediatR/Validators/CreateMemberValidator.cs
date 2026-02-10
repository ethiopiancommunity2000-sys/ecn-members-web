using Application.Dtos;
using Application.MediatR;
using FluentValidation;

namespace Application.MediatR.Validators
{
    public class CreateMemberValidator : AbstractValidator<CreateMember.Command>
    {
        public CreateMemberValidator()
        {
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

                RuleFor(x => x.MemberDto.PhoneNumber)
                    .MaximumLength(20).WithMessage("Phone number must not exceed 20 characters.");

                RuleForEach(x => x.Files)
                    .Must(file => file.Length > 0).WithMessage("File cannot be empty.")
                    .Must(file => file.Length <= 10 * 1024 * 1024).WithMessage("File size must not exceed 10MB.")
                    .Must(file =>
                    {
                        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
                        return allowedExtensions.Contains(extension);
                    }).WithMessage("File type must be .jpg, .jpeg, .png, or .pdf.");
            });
        }
    }
}

