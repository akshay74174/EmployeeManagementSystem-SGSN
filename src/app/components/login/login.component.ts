import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    if (this.isLoading) {
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        if (response.role === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (response.role === 'Employee') {
          this.router.navigate(['/employee/dashboard']);
        } else {
          this.authService.logout();
          this.errorMessage = 'Your account has an unsupported role.';
        }
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password, or your account is inactive.';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to the server. Please check that the API is running.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }

        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}