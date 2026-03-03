namespace Application.Dtos
{
    public class MemberDto
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string MiddleName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string ReceiverId { get; set; } = string.Empty;
        // public string RegisterDate { get; set; } = string.Empty;
        public string RegisterDate { get; set; } = DateTime.Today.ToString("MM/dd/yyyy");
       // public DateTime RegisterDate { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsAdmin { get; set; }

        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        // Form POST only - these are bound from form data in the controller
        public string AddressesJson { get; set; } = string.Empty;
        public string FamilyMembersJson { get; set; } = string.Empty;
        public string PaymentsJson { get; set; } = string.Empty;
        public string IncidentsJson { get; set; } = string.Empty;

        public decimal? InitialPaymentAmount { get; set; }
         public string InitialPaymentReference { get; set; }

        // GET only
        public List<AddressDto> Addresses { get; set; } = new();
        public List<FamilyMemberDto> FamilyMembers { get; set; } = new();
        public List<PaymentDto> Payments { get; set; } = new();
        public List<IncidentDto> Incidents { get; set; } = new();
        public List<MemberFileDto> MemberFiles { get; set; } = new();
    }
}