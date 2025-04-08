using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DesafioFullStackHaus.Server.Migrations
{
    /// <inheritdoc />
    public partial class CreateAcao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Causas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Causas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Hierarquias",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hierarquias", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Acoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descricao = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Responsavel = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PrazoConclusao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    HierarquiaId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Acoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Acoes_Hierarquias_HierarquiaId",
                        column: x => x.HierarquiaId,
                        principalTable: "Hierarquias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AcaoCausa",
                columns: table => new
                {
                    AcaoId = table.Column<int>(type: "int", nullable: false),
                    CausaId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AcaoCausa", x => new { x.AcaoId, x.CausaId });
                    table.ForeignKey(
                        name: "FK_AcaoCausa_Acoes_AcaoId",
                        column: x => x.AcaoId,
                        principalTable: "Acoes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AcaoCausa_Causas_CausaId",
                        column: x => x.CausaId,
                        principalTable: "Causas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Causas",
                columns: new[] { "Id", "Nome" },
                values: new object[,]
                {
                    { 1, "Falha no treinamento" },
                    { 2, "Falha na mão de obra" },
                    { 3, "Falha na disponibilidade" }
                });

            migrationBuilder.InsertData(
                table: "Hierarquias",
                columns: new[] { "Id", "Nome" },
                values: new object[,]
                {
                    { 1, "Eliminação" },
                    { 2, "Substituição" },
                    { 3, "EPI" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AcaoCausa_CausaId",
                table: "AcaoCausa",
                column: "CausaId");

            migrationBuilder.CreateIndex(
                name: "IX_Acoes_HierarquiaId",
                table: "Acoes",
                column: "HierarquiaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AcaoCausa");

            migrationBuilder.DropTable(
                name: "Acoes");

            migrationBuilder.DropTable(
                name: "Causas");

            migrationBuilder.DropTable(
                name: "Hierarquias");
        }
    }
}
