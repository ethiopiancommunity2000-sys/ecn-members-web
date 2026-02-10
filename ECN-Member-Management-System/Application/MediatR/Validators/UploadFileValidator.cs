using Application.MediatR;
using FluentValidation;

namespace Application.MediatR.Validators
{
    public class UploadFileValidator : AbstractValidator<UploadFile.Command>
    {
        public UploadFileValidator()
        {
            RuleFor(x => x.MemberId)
                .NotEmpty().WithMessage("Member ID is required.");

            RuleFor(x => x.Files)
                .NotEmpty().WithMessage("At least one file is required.");

            RuleForEach(x => x.Files)
                .Must(file => file.Length > 0).WithMessage("File cannot be empty.")
                .Must(file => file.Length <= 10 * 1024 * 1024).WithMessage("File size must not exceed 10MB.")
                .Must(file =>
                {
                    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
                    return allowedExtensions.Contains(extension);
                }).WithMessage("File type must be .jpg, .jpeg, .png, or .pdf.");
        }
    }
}

