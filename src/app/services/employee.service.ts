import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Employee } from '../models/employee.model';

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateEmployeeRequest {
  name: string;
  email: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiUrl = `${environment.apiUrl}/Employees`;

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  createEmployee(
    request: CreateEmployeeRequest
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      this.apiUrl,
      request
    );
  }

  updateEmployee(
    id: number,
    request: UpdateEmployeeRequest
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  deactivateEmployee(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${id}`
    );
  }

hardDeleteEmployee(id: number): Observable<{ message: string }> {
  return this.http.delete<{ message: string }>(
    `${this.apiUrl}/hard-delete/${id}`
  );
}
}