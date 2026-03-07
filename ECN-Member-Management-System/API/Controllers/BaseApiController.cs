using Application.Core;
using Application.Dtos;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;
        public MemberDto MemberDto { get; set; } = null!;
        //     protected IMediator[] Mediator => _mediator??= (IMediator[])(HttpContext.RequestServices.GetServices<IMediator>());
        //! other way of dependency injection to get the services like DataContext === Imediator as the ff
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>()!;


        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result == null) return NotFound();
            if (result.IsSuccess && result.Value != null)
            {
                return Ok(result.Value);
            }
            if (result.IsSuccess && result.Value == null)
            {
                return NotFound();
            }
            return BadRequest(result.Error);
        }

        protected ActionResult HandleValidationException(ValidationException ex)
        {
            var errors = ex.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray()
                );

            return BadRequest(new { errors });
        }


        public async Task<IActionResult> UploadReceipts(List<IFormFile> files, string memberId)
        {
            if (files == null || !files.Any())
                return BadRequest("No files uploaded.");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };

            var memberFiles = new List<MemberFile>();

            foreach (var file in files)
            {
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension))
                    continue; // skip invalid files, or return error

                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);

                memberFiles.Add(new MemberFile
                {
                    Id = Guid.NewGuid(),
                    FileName = file.FileName,
                    Size = (int)file.Length,
                    ImageData = ms.ToArray(),
                    MemberId = memberId
                });
            }

            // Save to DB
           // DbContext.MemberFiles.AddRange(memberFiles);
          //  await _context.SaveChangesAsync();

            return Ok(new { message = $"{memberFiles.Count} file(s) uploaded successfully." });
        }



    }
}