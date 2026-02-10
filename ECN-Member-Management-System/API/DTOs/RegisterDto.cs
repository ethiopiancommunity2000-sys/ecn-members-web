using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        /*
        (?=.*\\d)   --- include number
        (?=.*[a-z]) --- include a to z
        (?=.*[A-Z]) --- include A to Z
        {4,8}       --- charactors must be b/n 4 and 8
        */
        [Required]
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$", ErrorMessage = "Password must be complex")]
        public string Password { get; set; }

        [Required]
        public string DisplayName { get; set; }

        [Required]
        public string Username { get; set; }
         [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}