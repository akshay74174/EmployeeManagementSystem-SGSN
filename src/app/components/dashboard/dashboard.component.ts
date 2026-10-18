import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
 imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user = this.authService.getUser();

  employees: Employee[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showAddForm = false;
  showProfileModal = false;

  newEmployee = {
    name: '',
    email: '',
    password: ''
  };

  showEditForm = false;
editingEmployeeId: number | null = null;

editEmployee = {
  name: '',
  email: '',
  isActive: true
};

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.user?.role === 'Admin') {
      this.loadEmployees();
    }
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
          return;
        }

        if (error.status === 403) {
          this.errorMessage = 'You are not authorized to view employees.';
          return;
        }

        this.errorMessage = 'Unable to load employees. Please try again.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openAddForm(): void {
    this.newEmployee = {
      name: '',
      email: '',
      password: ''
    };

    this.showAddForm = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelAddForm(): void {
    this.showAddForm = false;
  }

  addEmployee(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.employeeService.createEmployee(this.newEmployee).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.showAddForm = false;

        this.newEmployee = {
          name: '',
          email: '',
          password: ''
        };

        this.loadEmployees();
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorMessage =
            error.error?.message || 'An account with this email already exists.';
        } else if (error.status === 400) {
          this.errorMessage =
            'Please check the employee details and try again.';
        } else if (error.status === 401 || error.status === 403) {
          this.errorMessage =
            'You are not authorized to create employees. Please log in as Admin.';
        } else {
          this.errorMessage = 'Unable to create the employee. Please try again.';
        }
      }
    });
  }

  openEditForm(employee: Employee): void {
  this.editingEmployeeId = employee.userId;

  this.editEmployee = {
    name: employee.name,
    email: employee.email,
    isActive: employee.isActive
  };

  this.showEditForm = true;
  this.showAddForm = false;
  this.errorMessage = '';
  this.successMessage = '';
}

cancelEditForm(): void {
  this.showEditForm = false;
  this.editingEmployeeId = null;
}

saveEmployeeChanges(): void {
  if (this.editingEmployeeId === null) {
    return;
  }

  this.errorMessage = '';
  this.successMessage = '';

  this.employeeService.updateEmployee(
    this.editingEmployeeId,
    this.editEmployee
  ).subscribe({
    next: (response) => {
      this.successMessage = response.message;
      this.showEditForm = false;
      this.editingEmployeeId = null;

      this.loadEmployees();
    },
    error: (error) => {
      if (error.status === 409) {
        this.errorMessage =
          error.error?.message || 'This email is already in use.';
      } else if (error.status === 404) {
        this.errorMessage = 'Employee not found.';
      } else if (error.status === 401 || error.status === 403) {
        this.errorMessage = 'You are not authorized to update employees.';
      } else {
        this.errorMessage = 'Unable to update employee. Please try again.';
      }
    }
  });
}

deactivateEmployee(employee: Employee): void {
  const confirmed = window.confirm(
    `Are you sure you want to deactivate ${employee.name}?`
  );

  if (!confirmed) {
    return;
  }

  this.errorMessage = '';
  this.successMessage = '';

  this.employeeService.deactivateEmployee(employee.userId).subscribe({
    next: (response) => {
      this.successMessage = response.message;
      this.loadEmployees();
    },
    error: (error) => {
      if (error.status === 404) {
        this.errorMessage = 'Employee not found.';
      } else if (error.status === 401 || error.status === 403) {
        this.errorMessage = 'You are not authorized to deactivate employees.';
      } else {
        this.errorMessage = 'Unable to deactivate employee. Please try again.';
      }
    }
  });
}

get totalEmployees(): number {
  return this.employees.length;
}

get activeEmployees(): number {
  return this.employees.filter(employee => employee.isActive).length;
}

get inactiveEmployees(): number {
  return this.employees.filter(employee => !employee.isActive).length;
}

openProfileModal(): void {
  this.showProfileModal = true;
}

closeProfileModal(): void {
  this.showProfileModal = false;
}

hardDeleteEmployee(employee: Employee): void {
  const confirmed = window.confirm(
    `Are you sure you want to permanently delete ${employee.name}? This action cannot be undone.`
  );

  if (!confirmed) {
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';
  this.successMessage = '';

  this.employeeService.hardDeleteEmployee(employee.userId).subscribe({
    next: (response: any) => {
      this.isLoading = false;
      this.successMessage = response.message || 'Employee permanently deleted.';
      this.loadEmployees();
    },
    error: (error) => {
      this.isLoading = false;
      this.errorMessage =
        error.error?.message || 'Unable to permanently delete employee.';
    }
  });
}
}