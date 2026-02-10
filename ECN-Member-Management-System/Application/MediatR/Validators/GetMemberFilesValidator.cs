using Application.MediatR.Queries;
using FluentValidation;

namespace Application.MediatR.Validators
{
    public class GetMemberFilesValidator : AbstractValidator<GetMembeFiles.Query>
    {
        public GetMemberFilesValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Member ID is required.");
        }
    }
}

