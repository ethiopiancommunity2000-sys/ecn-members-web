


using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Domain
{
    public class Address
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string ZipCode { get; set; }

        // Foreign key
        [Required]
        public string MemberId { get; set; } = null!;
        // Navigation property
            [JsonIgnore]
        public Member Member { get; set; } = null!;

    }
}





