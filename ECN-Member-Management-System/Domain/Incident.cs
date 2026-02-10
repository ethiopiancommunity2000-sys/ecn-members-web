
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Domain
{

  public class Incident
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public int EventNumber { get; set; }

    public IncidentType IncidentType { get; set; } // Enum

    public string IncidentDescription { get; set; } = string.Empty;

    public DateTime IncidentDate { get; set; } = DateTime.MinValue; // Use MinValue instead of Today to avoid defaulting to today's date

    // Foreign key
    [Required]
    public string MemberId { get; set; } = null!;

    // Navigation property
    [JsonIgnore]
    public Member Member { get; set; } = null!;
}


    public enum IncidentType
    {
        AccidentalDeath ,
        NaturalDeath
    }
// 
}