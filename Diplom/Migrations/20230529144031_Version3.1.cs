using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Diplom.Migrations
{
    /// <inheritdoc />
    public partial class Version31 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Allowed",
                table: "Flats",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "Latitude",
                table: "Flats",
                type: "real",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "Longitude",
                table: "Flats",
                type: "real",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Allowed",
                table: "Flats");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Flats");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Flats");
        }
    }
}
