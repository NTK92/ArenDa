using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Diplom.Migrations
{
    /// <inheritdoc />
    public partial class Version3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "TwoFactor",
                table: "Users",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "District",
                table: "Flats",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Owner",
                table: "Flats",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Percent",
                table: "Flats",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PrepaymentMonths",
                table: "Flats",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UtilityBills",
                table: "Flats",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Statuses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Commentary = table.Column<string>(type: "text", nullable: true),
                    Flatid = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Statuses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Statuses_Flats_Flatid",
                        column: x => x.Flatid,
                        principalTable: "Flats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Statuses_Flatid",
                table: "Statuses",
                column: "Flatid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Statuses");

            migrationBuilder.DropColumn(
                name: "TwoFactor",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "District",
                table: "Flats");

            migrationBuilder.DropColumn(
                name: "Owner",
                table: "Flats");

            migrationBuilder.DropColumn(
                name: "Percent",
                table: "Flats");

            migrationBuilder.DropColumn(
                name: "PrepaymentMonths",
                table: "Flats");

            migrationBuilder.DropColumn(
                name: "UtilityBills",
                table: "Flats");
        }
    }
}
