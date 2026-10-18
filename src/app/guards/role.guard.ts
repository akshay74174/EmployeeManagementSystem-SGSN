import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();
  const expectedRole = route.data['role'];

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  if (user.role === expectedRole) {
    return true;
  }

  if (user.role === 'Admin') {
    return router.createUrlTree(['/admin/dashboard']);
  }

  if (user.role === 'Employee') {
    return router.createUrlTree(['/employee/dashboard']);
  }

  return router.createUrlTree(['/login']);
};