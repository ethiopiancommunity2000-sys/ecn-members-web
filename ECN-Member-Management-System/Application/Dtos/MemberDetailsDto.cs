

namespace Application.Dtos
{

    // The New Dto for Details
        public class MemberDetailsDto
{
    public string Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string PhoneNumber { get; set; }
    public bool IsActive { get; set; }
    public bool IsAdmin { get; set; }
    public string RegisterDate { get; set; }
    public string Bio { get; set; }

    public List<AddressDto> Addresses { get; set; }
    public List<FamilyMemberDto> FamilyMembers { get; set; }
    public List<PaymentDto> Payments { get; set; }
    public List<IncidentDto> Incidents { get; set; }
    public List<MemberFileDto> MemberFiles { get; set; }
}

}