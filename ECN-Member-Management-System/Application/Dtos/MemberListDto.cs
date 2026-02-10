 
namespace Application.Dtos
{
     // The New Dto for List
    public class MemberListDto
{
    public string Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string PhoneNumber { get; set; }
    public required string RegisterDate { get; set; }
    public bool IsActive { get; set; }
    public bool IsAdmin { get; set; }
}

}

