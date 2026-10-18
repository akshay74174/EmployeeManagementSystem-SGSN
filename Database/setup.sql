IF DB_ID(N'EmployeeManagementDB') IS NULL
BEGIN
    CREATE DATABASE EmployeeManagementDB;
END
GO

USE EmployeeManagementDB;
GO

IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users
    (
        UserId INT IDENTITY(1,1) NOT NULL,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(256) NOT NULL,
        PasswordHash NVARCHAR(500) NOT NULL,
        Role NVARCHAR(20) NOT NULL,
        IsActive BIT NOT NULL
            CONSTRAINT DF_Users_IsActive DEFAULT (1),
        CreatedAt DATETIME2(0) NOT NULL
            CONSTRAINT DF_Users_CreatedAt DEFAULT (SYSDATETIME()),
        UpdatedAt DATETIME2(0) NULL,
        LastLoginAt DATETIME2(0) NULL,

        CONSTRAINT PK_Users
            PRIMARY KEY CLUSTERED (UserId),

        CONSTRAINT UQ_Users_Email
            UNIQUE (Email),

        CONSTRAINT CK_Users_Name_NotEmpty
            CHECK (LEN(LTRIM(RTRIM(Name))) > 0),

        CONSTRAINT CK_Users_Role
            CHECK (Role IN ('Admin', 'Employee'))
    );
END
GO