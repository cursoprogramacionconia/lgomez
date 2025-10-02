SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

IF OBJECT_ID(N'dbo.Consulta', N'U') IS NOT NULL
    DROP TABLE dbo.Consulta;
IF OBJECT_ID(N'dbo.Usuario', N'U') IS NOT NULL
    DROP TABLE dbo.Usuario;
IF OBJECT_ID(N'dbo.Paciente', N'U') IS NOT NULL
    DROP TABLE dbo.Paciente;
IF OBJECT_ID(N'dbo.Medicos', N'U') IS NOT NULL
    DROP TABLE dbo.Medicos;
GO

CREATE TABLE dbo.Medicos (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Medicos_Id DEFAULT NEWSEQUENTIALID(),
    primer_nombre NVARCHAR(100) NOT NULL,
    segundo_nombre NVARCHAR(100) NULL,
    apellido_paterno NVARCHAR(100) NOT NULL,
    apellido_materno NVARCHAR(100) NOT NULL,
    cedula NVARCHAR(50) NOT NULL,
    telefono NVARCHAR(20) NULL,
    especialidad NVARCHAR(150) NOT NULL,
    email NVARCHAR(254) NOT NULL,
    activo BIT NOT NULL CONSTRAINT DF_Medicos_Activo DEFAULT (1),
    fecha_creacion DATETIME2(0) NOT NULL CONSTRAINT DF_Medicos_FechaCreacion DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT PK_Medicos PRIMARY KEY CLUSTERED (id),
    CONSTRAINT UQ_Medicos_Cedula UNIQUE (cedula),
    CONSTRAINT UQ_Medicos_Email UNIQUE (email)
);
GO

CREATE TABLE dbo.Paciente (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Paciente_Id DEFAULT NEWSEQUENTIALID(),
    primer_nombre NVARCHAR(100) NOT NULL,
    segundo_nombre NVARCHAR(100) NULL,
    apellido_paterno NVARCHAR(100) NOT NULL,
    apellido_materno NVARCHAR(100) NOT NULL,
    telefono NVARCHAR(20) NULL,
    activo BIT NOT NULL CONSTRAINT DF_Paciente_Activo DEFAULT (1),
    fecha_creacion DATETIME2(0) NOT NULL CONSTRAINT DF_Paciente_FechaCreacion DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT PK_Paciente PRIMARY KEY CLUSTERED (id)
);
GO

CREATE TABLE dbo.Usuario (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Usuario_Id DEFAULT NEWSEQUENTIALID(),
    correo NVARCHAR(254) NOT NULL,
    password NVARCHAR(200) NOT NULL,
    nombre_completo NVARCHAR(200) NOT NULL,
    id_medico UNIQUEIDENTIFIER NULL,
    activo BIT NOT NULL CONSTRAINT DF_Usuario_Activo DEFAULT (1),
    fecha_creacion DATETIME2(0) NOT NULL CONSTRAINT DF_Usuario_FechaCreacion DEFAULT (SYSUTCDATETIME()),
    CONSTRAINT PK_Usuario PRIMARY KEY CLUSTERED (id),
    CONSTRAINT UQ_Usuario_Correo UNIQUE (correo),
    CONSTRAINT FK_Usuario_Medico FOREIGN KEY (id_medico) REFERENCES dbo.Medicos (id)
);
GO

CREATE TABLE dbo.Consulta (
    id UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_Consulta_Id DEFAULT NEWSEQUENTIALID(),
    id_medico UNIQUEIDENTIFIER NOT NULL,
    id_paciente UNIQUEIDENTIFIER NOT NULL,
    sintomas NVARCHAR(MAX) NULL,
    recomendaciones NVARCHAR(MAX) NULL,
    diagnostico NVARCHAR(MAX) NULL,
    CONSTRAINT PK_Consulta PRIMARY KEY CLUSTERED (id),
    CONSTRAINT FK_Consulta_Medico FOREIGN KEY (id_medico) REFERENCES dbo.Medicos (id),
    CONSTRAINT FK_Consulta_Paciente FOREIGN KEY (id_paciente) REFERENCES dbo.Paciente (id)
);
GO
