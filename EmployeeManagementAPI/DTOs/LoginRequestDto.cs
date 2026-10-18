using System.ComponentModel.DataAnnotations;
namespace EmployeeManagementAPI.DTOs
{
    public class LoginRequestDto
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Enter a valid email address.")]
        [StringLength(256, ErrorMessage = "Email cannot exceed 256 characters.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(128, MinimumLength = 1,
            ErrorMessage = "Password cannot exceed 128 characters.")]
        public string Password { get; set; } = string.Empty;
    }
}
