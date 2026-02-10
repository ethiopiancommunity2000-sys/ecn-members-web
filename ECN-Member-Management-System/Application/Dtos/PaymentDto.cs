 
namespace Application.Dtos
{
    public class PaymentDto
    {
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public decimal Amount { get; set; }
    // public DateTime PaymentDate { get; set; }
    public string PaymentDate { get; set; }  
    public string PaymentType { get; set; } 
    public string PaymentRecurringType { get; set; } 
    }
}

 
