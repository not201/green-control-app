using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GreenControl.Migrations
{
    /// <inheritdoc />
    public partial class GastosIngresosConParcela : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ParcelaId",
                table: "Ingresos",
                type: "NUMBER(10)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParcelaId",
                table: "Gastos",
                type: "NUMBER(10)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ingresos_ParcelaId",
                table: "Ingresos",
                column: "ParcelaId");

            migrationBuilder.CreateIndex(
                name: "IX_Gastos_ParcelaId",
                table: "Gastos",
                column: "ParcelaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Gastos_Parcelas_ParcelaId",
                table: "Gastos",
                column: "ParcelaId",
                principalTable: "Parcelas",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Ingresos_Parcelas_ParcelaId",
                table: "Ingresos",
                column: "ParcelaId",
                principalTable: "Parcelas",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Gastos_Parcelas_ParcelaId",
                table: "Gastos");

            migrationBuilder.DropForeignKey(
                name: "FK_Ingresos_Parcelas_ParcelaId",
                table: "Ingresos");

            migrationBuilder.DropIndex(
                name: "IX_Ingresos_ParcelaId",
                table: "Ingresos");

            migrationBuilder.DropIndex(
                name: "IX_Gastos_ParcelaId",
                table: "Gastos");

            migrationBuilder.DropColumn(
                name: "ParcelaId",
                table: "Ingresos");

            migrationBuilder.DropColumn(
                name: "ParcelaId",
                table: "Gastos");
        }
    }
}
