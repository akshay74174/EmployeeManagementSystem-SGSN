using EmployeeManagementAPI.DTOs;
using EmployeeManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly EmployeeService _employeeService;

        public EmployeesController(EmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpDelete("hard-delete/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> HardDeleteEmployee(int id)
        {
            var result = await _employeeService.HardDeleteEmployeeAsync(id);

            if (!result.Success)
            {
                return NotFound(new { message = result.Message });
            }

            return Ok(new { message = result.Message });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateEmployee(CreateEmployeeDto request)
        {
            var result = await _employeeService.CreateEmployeeAsync(request);

            if (!result.Success)
            {
                return Conflict(new { message = result.Message });
            }

            return Ok(new { message = result.Message });
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await _employeeService.GetAllEmployeesAsync();

            return Ok(employees);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var isAdmin = User.IsInRole("Admin");

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!isAdmin &&
                (!int.TryParse(currentUserId, out var userId) || userId != id))
            {
                return Forbid();
            }

            var employee = await _employeeService.GetEmployeeByIdAsync(id);

            if (employee == null)
            {
                return NotFound(new { message = "Employee not found." });
            }

            return Ok(employee);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var result = await _employeeService.DeleteEmployeeAsync(id);

            if (!result.Success)
            {
                return NotFound(new { message = result.Message });
            }

            return Ok(new { message = result.Message });
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEmployee(
    int id,
    UpdateEmployeeDto request)
        {
            var result = await _employeeService.UpdateEmployeeAsync(id, request);

            if (!result.Success)
            {
                if (result.Message == "Employee not found.")
                {
                    return NotFound(new { message = result.Message });
                }

                return Conflict(new { message = result.Message });
            }

            return Ok(new { message = result.Message });
        }


    }
}