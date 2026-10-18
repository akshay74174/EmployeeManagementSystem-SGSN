using EmployeeManagementAPI.Data;
using EmployeeManagementAPI.DTOs;
using EmployeeManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementAPI.Services
{
    public class EmployeeService
    {
        private readonly ApplicationDbContext _context;
        private readonly PasswordService _passwordService;

        public EmployeeService(
            ApplicationDbContext context,
            PasswordService passwordService)
        {
            _context = context;
            _passwordService = passwordService;
        }

        public async Task<List<EmployeeProfileDto>> GetAllEmployeesAsync()
        {
            return await _context.Users
                .Where(u => u.Role == "Employee")
                .Select(u => new EmployeeProfileDto
                {
                    UserId = u.UserId,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    LastLoginAt = u.LastLoginAt
                })
                .ToListAsync();
        }

        public async Task<EmployeeProfileDto?> GetEmployeeByIdAsync(int id)
        {
            return await _context.Users
                .Where(u => u.UserId == id && u.Role == "Employee" && u.IsActive)
                .Select(u => new EmployeeProfileDto
                {
                    UserId = u.UserId,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    LastLoginAt = u.LastLoginAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task<(bool Success, string Message)> CreateEmployeeAsync(
            CreateEmployeeDto request)
        {
            var email = request.Email.Trim();

            var emailExists = await _context.Users
                .AnyAsync(u => u.Email == email);

            if (emailExists)
            {
                return (false, "An account with this email already exists.");
            }

            var employee = new User
            {
                Name = request.Name.Trim(),
                Email = email,
                Role = "Employee",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            employee.PasswordHash = _passwordService.HashPassword(
                employee,
                request.Password);

            _context.Users.Add(employee);

            await _context.SaveChangesAsync();

            return (true, "Employee created successfully.");
        }

        public async Task<(bool Success, string Message)> DeleteEmployeeAsync(int id)
        {
            var employee = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == id && u.Role == "Employee");

            if (employee == null)
            {
                return (false, "Employee not found.");
            }

            if (!employee.IsActive)
            {
                return (false, "Employee is already inactive.");
            }

            employee.IsActive = false;
            employee.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return (true, "Employee deactivated successfully.");
        }

        public async Task<(bool Success, string Message)> HardDeleteEmployeeAsync(int id)
        {
            var employee = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == id && u.Role == "Employee");

            if (employee == null)
            {
                return (false, "Employee not found.");
            }

            _context.Users.Remove(employee);

            await _context.SaveChangesAsync();

            return (true, "Employee permanently deleted.");
        }

        public async Task<(bool Success, string Message)> UpdateEmployeeAsync(
    int id,
    UpdateEmployeeDto request)
        {
            var employee = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == id && u.Role == "Employee");

            if (employee == null)
            {
                return (false, "Employee not found.");
            }

            var email = request.Email.Trim();

            var emailExists = await _context.Users.AnyAsync(u =>
                u.Email == email && u.UserId != id);

            if (emailExists)
            {
                return (false, "This email is already used by another account.");
            }

            employee.Name = request.Name.Trim();
            employee.Email = email;
            employee.IsActive = request.IsActive;
            employee.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return (true, "Employee updated successfully.");
        }
    }
}