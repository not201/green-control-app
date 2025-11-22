using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenControl.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Nombre = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: false),
                    Apellido = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: true),
                    Telefono = table.Column<string>(type: "NVARCHAR2(20)", maxLength: 20, nullable: false),
                    Correo = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: false),
                    Contrasena = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false, defaultValueSql: "SYSDATE")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Cultivos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Nombre = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: false),
                    Especie = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: false),
                    UsuarioId = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cultivos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cultivos_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Gastos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Fecha = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    Monto = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Concepto = table.Column<string>(type: "NVARCHAR2(200)", maxLength: 200, nullable: false),
                    NotaAdicional = table.Column<string>(type: "NVARCHAR2(500)", maxLength: 500, nullable: true),
                    UsuarioId = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Gastos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Gastos_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Ingresos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Fecha = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    Monto = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Concepto = table.Column<string>(type: "NVARCHAR2(200)", maxLength: 200, nullable: false),
                    NotaAdicional = table.Column<string>(type: "NVARCHAR2(500)", maxLength: 500, nullable: true),
                    UsuarioId = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ingresos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ingresos_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notificaciones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Titulo = table.Column<string>(type: "NVARCHAR2(150)", maxLength: 150, nullable: false),
                    Descripcion = table.Column<string>(type: "NVARCHAR2(500)", maxLength: 500, nullable: false),
                    FechaEnvio = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    FechaLeido = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: true),
                    UsuarioId = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notificaciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notificaciones_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Parcelas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Area = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Ubicacion = table.Column<string>(type: "NVARCHAR2(200)", maxLength: 200, nullable: false),
                    NombreParcela = table.Column<string>(type: "NVARCHAR2(100)", maxLength: 100, nullable: false),
                    TipoSuelo = table.Column<string>(type: "NVARCHAR2(50)", maxLength: 50, nullable: true),
                    PhSuelo = table.Column<decimal>(type: "decimal(3,1)", nullable: true),
                    UsuarioId = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Parcelas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Parcelas_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Siembras",
                columns: table => new
                {
                    Id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    ParcelaId = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    CultivoId = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    FechaInicio = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    FechaFinal = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: true),
                    FechaGerminacion = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: true),
                    FechaFloracion = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Siembras", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Siembras_Cultivos_CultivoId",
                        column: x => x.CultivoId,
                        principalTable: "Cultivos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Siembras_Parcelas_ParcelaId",
                        column: x => x.ParcelaId,
                        principalTable: "Parcelas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tareas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    FechaProgramada = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: false),
                    FechaFinalizacion = table.Column<DateTime>(type: "TIMESTAMP(7)", nullable: true),
                    Nombre = table.Column<string>(type: "NVARCHAR2(150)", maxLength: 150, nullable: false),
                    Descripcion = table.Column<string>(type: "NVARCHAR2(500)", maxLength: 500, nullable: false),
                    ParcelaId = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tareas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tareas_Parcelas_ParcelaId",
                        column: x => x.ParcelaId,
                        principalTable: "Parcelas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cultivos_UsuarioId",
                table: "Cultivos",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Gastos_UsuarioId",
                table: "Gastos",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Ingresos_UsuarioId",
                table: "Ingresos",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Notificaciones_UsuarioId",
                table: "Notificaciones",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Parcelas_UsuarioId",
                table: "Parcelas",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Siembras_CultivoId",
                table: "Siembras",
                column: "CultivoId");

            migrationBuilder.CreateIndex(
                name: "IX_Siembras_ParcelaId",
                table: "Siembras",
                column: "ParcelaId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tareas_ParcelaId",
                table: "Tareas",
                column: "ParcelaId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Correo",
                table: "Usuarios",
                column: "Correo",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Gastos");

            migrationBuilder.DropTable(
                name: "Ingresos");

            migrationBuilder.DropTable(
                name: "Notificaciones");

            migrationBuilder.DropTable(
                name: "Siembras");

            migrationBuilder.DropTable(
                name: "Tareas");

            migrationBuilder.DropTable(
                name: "Cultivos");

            migrationBuilder.DropTable(
                name: "Parcelas");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
