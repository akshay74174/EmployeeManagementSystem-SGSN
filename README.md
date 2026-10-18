# Employee Management System

A role-based Employee Management System developed using ASP.NET Core Web API (.NET 8), Angular 17, and Microsoft SQL Server.

The application provides secure authentication, employee management, JWT-based authorization, and role-based access control for Admin and Employee users.

## 1. Technologies Used

### Backend
- ASP.NET Core Web API (.NET 8)
- C#
- Entity Framework Core
- JWT Authentication
- ASP.NET Core Identity PasswordHasher
- Swagger / OpenAPI

### Frontend
- Angular 17
- TypeScript
- HTML5
- CSS3
- Angular Router
- HTTP Interceptors

### Database
- Microsoft SQL Server / SQL Server Express
- SQL Server Management Studio (SSMS)

### Development Tools
- Visual Studio 2022
- Visual Studio Code
- Git and GitHub
- Swagger
- Postman

## 2. Features

### Admin Features
- Login using email and password.
- Create employee accounts with name, email, and initial password.
- View all employee accounts.
- View individual employee profiles.
- Update employee information.
- Deactivate and reactivate employee accounts.
- Permanently delete employee accounts.

### Employee Features
- Log in using credentials provided by the Admin.
- View their own profile.
- Cannot view another employee's profile.
- Cannot create or manage employee accounts.
- Cannot access Admin-only functionality.

### Security Features
- JWT-based authentication.
- Passwords stored as hashes instead of plaintext.
- Role-based authorization.
- Protected API endpoints.
- Employees can access only their own profiles.
- Invalid credentials are rejected.
- Requests without a valid authentication token are rejected.

## 3. Project Structure

```text
EmployeeManagementUI/
├── EmployeeManagementAPI/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   └── EmployeesController.cs
│   ├── Data/
│   │   └── ApplicationDbContext.cs
│   ├── DTOs/
│   ├── Models/
│   │   └── User.cs
│   ├── Properties/
│   ├── Services/
│   │   ├── AuthService.cs
│   │   ├── EmployeeService.cs
│   │   ├── JwtService.cs
│   │   └── PasswordService.cs
│   ├── Program.cs
│   ├── appsettings.json
│   └── EmployeeManagementAPI.csproj
├── Database/
│   └── setup.sql
├── src/
│   ├── app/
│   └── environments/
├── angular.json
├── package.json
└── README.md
```

## 4. Prerequisites

Install the following software before running the application:

- .NET 8 SDK
- Node.js and npm
- Angular CLI 17
- Microsoft SQL Server or SQL Server Express
- SQL Server Management Studio (SSMS)
- Visual Studio 2022 or Visual Studio Code
- Git

## 5. Database Setup

The application uses a SQL Server database named:

`EmployeeManagementDB`

### Step 1: Create the Database

1. Open SQL Server Management Studio.
2. Connect to your SQL Server instance.
3. Open `Database/setup.sql`.
4. Execute the script.

The script creates the database and the `dbo.Users` table if they do not already exist.

### Step 2: Configure the Connection String

Open:

`EmployeeManagementAPI/appsettings.json`

Update the connection string to match your SQL Server instance.

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=EmployeeManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Replace `YOUR_SERVER_NAME` with your SQL Server instance name.

Ensure the connection-string key matches the key used in `Program.cs`.

### Step 3: Configure JWT Authentication

Configure the JWT signing key using .NET User Secrets or an environment variable.

The JWT issuer and audience must match the values configured in the application.

Do not commit production secrets to GitHub.

### Step 4: Initialize the Admin Account

The database setup script creates the database and table but does not automatically insert an Admin account.

The initial Admin record must contain:
- A valid name.
- A unique email address.
- A password hash generated using the application's `PasswordService`.
- The role `Admin`.
- An active account status.

Use the application's ASP.NET Core Identity `PasswordHasher<User>` implementation to generate the password hash.

Do not store plaintext passwords in the `PasswordHash` column.

After the initial Admin account is created, log in and use the Admin interface to create additional Employee accounts.

## 6. Sample Login Credentials

The following demo credentials were used to test the application.

### Admin Account

| Field | Value |
|---|---|
| Email | `admin@example.com` |
| Password | `Admin@123` |
| Role | Admin |

### Employee Account 1

| Field | Value |
|---|---|
| Email | `amit.test@example.com` |
| Password | `Amit@123` |
| Role | Employee |

### Employee Account 2

| Field | Value |
|---|---|
| Email | `priya.test@example.com` |
| Password | `Priya@123` |
| Role | Employee |

**Important:** These credentials work only if the corresponding accounts exist in the database with the correct password hashes and active status. The database setup script does not automatically seed these demo accounts.

The initial Admin account must be created before logging in on a newly configured database. After logging in, the Admin can create Employee accounts.

These credentials are for assignment demonstration only. Do not use them in a production environment.

## 7. Backend Setup

Open a terminal in the repository root.

Navigate to the backend directory:

```powershell
cd EmployeeManagementAPI
```

Restore the dependencies:

```powershell
dotnet restore
```

Build the application:

```powershell
dotnet build
```

Run the API:

```powershell
dotnet run
```

The API will start using the project's launch settings and configuration.

### Swagger

Open the HTTPS Swagger URL displayed in the terminal.

For the current local development configuration, the URL is:

`https://localhost:7221/swagger/index.html`

Use Swagger to test authentication and employee-management endpoints.

## 8. Frontend Setup

Open a separate terminal in the repository root.

Install frontend dependencies:

```powershell
npm install
```

Start the Angular development server:

```powershell
npx ng serve
```

Open the application:

`http://localhost:4200`

Ensure the backend is running before testing login and employee-management functionality.

### Configure the API URL

Open:

`src/environments/environment.ts`

Ensure the API URL matches the backend URL.

Example:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7221/api'
};
```

If the backend uses a different URL or port, update the configuration accordingly.

## 9. API Endpoints

Base URL:

`https://localhost:7221/api`

### Authentication

| HTTP Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/Auth/login` | Authenticate a user and obtain a JWT | Public |

### Employee Management

| HTTP Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/Employees` | Retrieve the employee list | Admin |
| GET | `/Employees/{id}` | Retrieve an employee profile | Admin or the same employee |
| POST | `/Employees` | Create an employee account | Admin |
| PUT | `/Employees/{id}` | Update employee information | Admin |
| DELETE | `/Employees/{id}` | Deactivate an employee account | Admin |
| DELETE | `/Employees/hard-delete/{id}` | Permanently delete an employee account | Admin |

Protected endpoints require a valid JWT access token.

In Swagger, click **Authorize** and provide the token according to the Swagger authentication configuration.

## 10. Authentication and Authorization

### Login Process

1. The user submits an email address and password.
2. The backend retrieves the account using the email address.
3. The password is verified against the stored password hash.
4. If the credentials are valid and the account is active, the API generates a JWT.
5. The frontend uses the token for protected API requests.
6. The backend validates the token and checks authorization requirements.

### Admin Permissions

- Create employee accounts.
- View all employees.
- View individual employee profiles.
- Update employee information.
- Deactivate or reactivate employee accounts.
- Permanently delete employee accounts.

### Employee Permissions

- View their own profile.
- Cannot view other employees' profiles.
- Cannot create or manage employee accounts.
- Cannot access Admin-only endpoints.

## 11. Testing

Use Swagger, Postman, or the Angular interface to verify the application.

| Test Case | Expected Result |
|---|---|
| Admin login with valid credentials | Successful login |
| Employee login with valid credentials | Successful login |
| Login with an incorrect password | HTTP 401 Unauthorized |
| Admin creates an employee | Successful creation |
| Admin retrieves the employee list | HTTP 200 OK |
| Employee retrieves their own profile | HTTP 200 OK |
| Employee retrieves another employee's profile | HTTP 403 Forbidden |
| Employee attempts to create an employee | HTTP 403 Forbidden |
| Employee attempts to retrieve the employee list | HTTP 403 Forbidden |
| Request without a valid token | HTTP 401 Unauthorized |
| Request with an invalid token | HTTP 401 Unauthorized |
| Employee attempts to update an employee account | HTTP 403 Forbidden |

## 12. Important Notes

- The database setup script creates the database and table but does not seed user accounts.
- Configure the SQL Server connection string before running the backend on another machine.
- Configure the JWT signing key securely.
- Keep the frontend API URL synchronized with the backend URL.
- Both backend and frontend must be running for the complete application to work.
- Employee access restrictions are enforced by backend authorization, not only by frontend navigation.
- Demo credentials should not be used in production.

## 13. Author

Developed as an Employee Management System practical assignment.

**Technologies:** ASP.NET Core Web API (.NET 8), Angular 17, and Microsoft SQL Server.