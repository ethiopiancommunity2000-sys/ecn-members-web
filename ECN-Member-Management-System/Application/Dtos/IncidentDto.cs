using System;
using System.Text.Json.Serialization;

namespace Application.Dtos
{
    public class IncidentDto
    {
     public string Id { get; set; } = Guid.NewGuid().ToString();
    public string IncidentType { get; set; } = null!;
    public string IncidentDescription { get; set; }
    //public DateTime IncidentDate { get; set; }
    
    [JsonPropertyName("paymentDate")]
    public string PaymentDate { get; set; } 
    
    public int EventNumber { get; set; }
    
    [JsonPropertyName("incidentDate")]
    public string IncidentDate { get; set; }  
    }
}