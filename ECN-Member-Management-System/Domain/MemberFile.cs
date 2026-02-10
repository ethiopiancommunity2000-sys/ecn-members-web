


using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain
{
    public class MemberFile
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(255)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    public int Size { get; set; } // bytes

    [Required]
    public byte[] ImageData { get; set; } = Array.Empty<byte>(); // binary only

    [Required]
    [MaxLength(100)]
    public string ContentType { get; set; } = "application/octet-stream"; // ✅ ADD THIS

    public string FileDescription { get; set; }

    public string PaymentId { get; set; }
    public Payment Payment { get; set; }

    [Required]
    public string MemberId { get; set; } = string.Empty;
    public Member Member { get; set; } = null!;
}
}



  
  

