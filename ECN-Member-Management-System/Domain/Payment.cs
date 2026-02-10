
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Domain
{


public class Payment
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    public decimal PaymentAmount { get; set; }
    
    public DateTime PaymentDate { get; set; } = DateTime.Today;

    [Required]
    public PaymentType PaymentType { get; set; }

    [Required]
    public PaymentRecurringType PaymentRecurringType { get; set; }

    // Foreign key
    public string MemberId { get; set; } = null!;

    [JsonIgnore]
    public Member Member { get; set; } = null!;

    public ICollection<MemberFile> MemberFiles { get; set; } = new List<MemberFile>();
}



public enum PaymentType
{
    Cash,
    CreditCard,
    BankTransfer, 
    Check,
    ReceiptAttached // Corrected spelling from 'reciptAttached'
}

public enum PaymentRecurringType
{
    Annual,       // Payments made once a year
    Monthly,      // Payments made every month
    Quarterly,    // Payments made every three months
    Incident,     // Emergency or one-time payments due to unforeseen situations
    Membership,   // Membership payments
    Miscellaneous // Corrected spelling from 'Mislaneous'
}

 
}