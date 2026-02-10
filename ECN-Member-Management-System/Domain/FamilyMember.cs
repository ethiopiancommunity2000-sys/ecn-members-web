using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Domain
{
    public class FamilyMember
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [Display(Name = "First Name")]
        public string MemberFamilyFirstName { get; set; }

        [Display(Name = "Middle Name")]
        public string MemberFamilyMiddleName { get; set; }

        [Display(Name = "Last Name")]
        public string MemberFamilyLastName { get; set; }
        public string Relationship { get; set; }


        // Foreign key
        [Required]
        public string MemberId { get; set; } = null!;
        // Navigation property
        [JsonIgnore]
        public Member Member { get; set; } = null!;
    }
}



