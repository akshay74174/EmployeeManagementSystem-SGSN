using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementAPI.DTOs
{
    public class CreateEmployeeDto
    {
        [Required(ErrorMessage = "Name is required*.")]
        [StringLength(100, MinimumLength = 2,
           ErrorMessage = "Name must be between 2 and 100 characters.")]
        [RegularExpression(@".*\S.*",
           ErrorMessage = "Name cannot contain only whitespace.")]
        public string Name { get; set; } = string.Empty;


        [Required(ErrorMessage = "Email is required*.")]
        [EmailAddress(ErrorMessage = "Enter a valid email address.")]
        [StringLength(256,
            ErrorMessage = "Email cannot exceed 256 characters.")]
        public string Email { get; set; } = string.Empty;


        [Required(ErrorMessage = "Password is required* .")]
        [StringLength(128, MinimumLength = 4,
            ErrorMessage = "Password must be between 4 and 128 characters.")]
        public string Password { get; set; } = string.Empty;
    }
}
