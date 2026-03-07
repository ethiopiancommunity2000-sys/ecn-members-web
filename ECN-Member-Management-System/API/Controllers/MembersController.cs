using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Dtos;
using Application.MediatR;
using Application.MediatR.Queries;
using FluentValidation;
using Persistence;
using System.Security.Claims;


namespace API.Controllers
{
    public class MembersController : BaseApiController
    {
        private AppDbContext _context { get; }

        public MembersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
       // [Authorize]
        public async Task<ActionResult<List<MemberDto>>> GetMembers()
        {
            var result = await Mediator.Send(new GetMemberList.Query());
            return HandleResult(result);
        }



        [HttpGet("{id}")]
        public async Task<IActionResult> GetMember(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id) || !Guid.TryParse(id, out var guidId))
                {
                    return BadRequest("Invalid member ID format.");
                }

                var result = await Mediator.Send(new MemberDetails.Query { Id = guidId });
                return HandleResult(result);
            }
            catch (ValidationException ex)
            {
                return HandleValidationException(ex);
            }
        }


        [HttpPost]
      //  [Authorize]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] CreateMember.Command command)
        {
            try
            {
                var result = await Mediator.Send(command);
                return HandleResult(result);
            }
            catch (ValidationException ex)
            {
                return HandleValidationException(ex);
            }
        }

        [HttpPut("{id}")]
       // [Authorize]
        [Consumes("multipart/form-data", "application/json")]
        public async Task<IActionResult> Edit(
            string id,
            [FromForm] MemberDto member,
            [FromForm] List<IFormFile> files = null,
            [FromForm] string fileDescription = null,
            [FromForm] string paymentId = null)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    return BadRequest("Member ID is required.");
                }

                if (member == null)
                {
                    return BadRequest("Member data is required.");
                }


                var result = await Mediator.Send(
                    new Update.Command(id, member, files, fileDescription, paymentId)
                );

                // Log the response to verify MemberFiles are included
                if (result != null && result.IsSuccess && result.Value != null)
                {
                    Console.WriteLine($"Update response - MemberFiles count: {result.Value.MemberFiles?.Count ?? 0}");
                    if (result.Value.MemberFiles != null && result.Value.MemberFiles.Any())
                    {
                        foreach (var file in result.Value.MemberFiles)
                        {
                            Console.WriteLine($"  - File in response: {file.FileName} (ID: {file.Id}, PaymentId: {file.PaymentId ?? "null"})");
                        }
                    }
                    else
                    {
                        Console.WriteLine("WARNING: Update response has NO MemberFiles!");
                    }
                }

                return HandleResult(result);
            }
            catch (ValidationException ex)
            {
                return HandleValidationException(ex);
            }
        }









        [HttpDelete("{id}")]
      //  [Authorize]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    return BadRequest("Member ID is required.");
                }

                var result = await Mediator.Send(new Delete.Command { Id = id });
                return HandleResult(result);
            }
            catch (ValidationException ex)
            {
                return HandleValidationException(ex);
            }
        }

        // uploads files
        [HttpPost("uploads/{memberId}")]
     //   [Authorize]
        public async Task<IActionResult> UploadFiles(
            [FromRoute] string memberId,
            [FromForm] List<IFormFile> files,
            [FromForm] string fileDescription,
            [FromForm] string paymentId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(memberId))
                {
                    return BadRequest("Member ID is required.");
                }

                // Basic validation - detailed validation is done in the handler
                if (files == null || !files.Any())
                {
                    return BadRequest("No files uploaded.");
                }

                var result = await Mediator.Send(new UploadFile.Command
                {
                    MemberId = memberId,
                    Files = files,
                    FileDescription = fileDescription,
                    PaymentId = paymentId
                });

                return HandleResult(result);
            }
            catch (ValidationException ex)
            {
                return HandleValidationException(ex);
            }
        }



        [HttpGet("files/{memberId}")]
     //   [Authorize]
        public async Task<IActionResult> GetFiles(string memberId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(memberId) || !Guid.TryParse(memberId, out var guidId))
                {
                    return BadRequest("Invalid member ID format.");
                }

                var result = await Mediator.Send(new GetMembeFiles.Query
                {
                    Id = guidId
                });

                return HandleResult(result);
            }
            catch (ValidationException ex)
            {
                return HandleValidationException(ex);
            }
        }

      //  [Authorize]
        [HttpGet("file/{id}")]
        public IActionResult GetMemberFile(Guid id)
        {
            // Find the file by ID
            var file = _context.MemberFiles
                .FirstOrDefault(f => f.Id == id);

            if (file == null)
                return NotFound();

            // Optional: Verify user has access to this file's member
            // For now, if user is authenticated, they can view any file
            // You can add more specific authorization logic here if needed

            Response.Headers["Cache-Control"] = "no-store";

            return File(
                file.ImageData,
                file.ContentType ?? "application/octet-stream",
                file.FileName
            );
        }

     //   [Authorize]
        [HttpDelete("file/{id}")]
        public async Task<IActionResult> DeleteFile(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    Console.WriteLine("DeleteFile: Invalid file ID (empty)");
                    return BadRequest("File ID is required.");
                }

                if (!Guid.TryParse(id, out var fileIdGuid))
                {
                    Console.WriteLine($"DeleteFile: Invalid file ID format: {id}");
                    return BadRequest("Invalid file ID format.");
                }

                Console.WriteLine($"DeleteFile: Attempting to delete file with ID: {fileIdGuid}");

                var result = await Mediator.Send(new DeleteFile.Command { FileId = fileIdGuid });
                
                if (result.IsSuccess)
                {
                    Console.WriteLine($"DeleteFile: Successfully deleted file with ID: {fileIdGuid}");
                    // Return 204 No Content for successful delete
                    return NoContent();
                }
                else
                {
                    Console.WriteLine($"DeleteFile: Failed to delete file with ID: {fileIdGuid}. Error: {result.Error}");
                    return BadRequest(result.Error);
                }
            }
            catch (ValidationException ex)
            {
                Console.WriteLine($"DeleteFile: Validation exception: {ex.Message}");
                return HandleValidationException(ex);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"DeleteFile: Exception: {ex.Message}");
                Console.WriteLine($"DeleteFile: Stack trace: {ex.StackTrace}");
                return StatusCode(500, $"An error occurred while deleting the file: {ex.Message}");
            }
        }






    }
}


