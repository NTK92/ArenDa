using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Diplom.Migrations
{
    /// <inheritdoc />
    public partial class Version21 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Flats_users_userid",
                table: "Flats");

            migrationBuilder.DropForeignKey(
                name: "FK_messages_Flats_flatid",
                table: "messages");

            migrationBuilder.DropForeignKey(
                name: "FK_messages_users_userid",
                table: "messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_users",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_messages",
                table: "messages");

            migrationBuilder.RenameTable(
                name: "users",
                newName: "Users");

            migrationBuilder.RenameTable(
                name: "messages",
                newName: "Messages");

            migrationBuilder.RenameColumn(
                name: "password",
                table: "Users",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Users",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "login",
                table: "Users",
                newName: "Login");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "phone_mobile",
                table: "Users",
                newName: "PhoneMobile");

            migrationBuilder.RenameColumn(
                name: "userid",
                table: "Messages",
                newName: "Userid");

            migrationBuilder.RenameColumn(
                name: "time",
                table: "Messages",
                newName: "Time");

            migrationBuilder.RenameColumn(
                name: "text",
                table: "Messages",
                newName: "Text");

            migrationBuilder.RenameColumn(
                name: "receiverid",
                table: "Messages",
                newName: "Receiverid");

            migrationBuilder.RenameColumn(
                name: "flatid",
                table: "Messages",
                newName: "Flatid");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Messages",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_messages_userid",
                table: "Messages",
                newName: "IX_Messages_Userid");

            migrationBuilder.RenameIndex(
                name: "IX_messages_flatid",
                table: "Messages",
                newName: "IX_Messages_Flatid");

            migrationBuilder.RenameColumn(
                name: "userid",
                table: "Flats",
                newName: "Userid");

            migrationBuilder.RenameColumn(
                name: "type",
                table: "Flats",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "roomCount",
                table: "Flats",
                newName: "RoomCount");

            migrationBuilder.RenameColumn(
                name: "price",
                table: "Flats",
                newName: "Price");

            migrationBuilder.RenameColumn(
                name: "picture",
                table: "Flats",
                newName: "Picture");

            migrationBuilder.RenameColumn(
                name: "kids",
                table: "Flats",
                newName: "Kids");

            migrationBuilder.RenameColumn(
                name: "furniture",
                table: "Flats",
                newName: "Furniture");

            migrationBuilder.RenameColumn(
                name: "floor",
                table: "Flats",
                newName: "Floor");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "Flats",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "apartmentArea",
                table: "Flats",
                newName: "ApartmentArea");

            migrationBuilder.RenameColumn(
                name: "animals",
                table: "Flats",
                newName: "Animals");

            migrationBuilder.RenameColumn(
                name: "address",
                table: "Flats",
                newName: "Address");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Flats",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_Flats_userid",
                table: "Flats",
                newName: "IX_Flats_Userid");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Time",
                table: "Messages",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Messages",
                table: "Messages",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Flats_Users_Userid",
                table: "Flats",
                column: "Userid",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Flats_Flatid",
                table: "Messages",
                column: "Flatid",
                principalTable: "Flats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Users_Userid",
                table: "Messages",
                column: "Userid",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Flats_Users_Userid",
                table: "Flats");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Flats_Flatid",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Users_Userid",
                table: "Messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Messages",
                table: "Messages");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "users");

            migrationBuilder.RenameTable(
                name: "Messages",
                newName: "messages");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "users",
                newName: "password");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "users",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Login",
                table: "users",
                newName: "login");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "users",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "PhoneMobile",
                table: "users",
                newName: "phone_mobile");

            migrationBuilder.RenameColumn(
                name: "Userid",
                table: "messages",
                newName: "userid");

            migrationBuilder.RenameColumn(
                name: "Time",
                table: "messages",
                newName: "time");

            migrationBuilder.RenameColumn(
                name: "Text",
                table: "messages",
                newName: "text");

            migrationBuilder.RenameColumn(
                name: "Receiverid",
                table: "messages",
                newName: "receiverid");

            migrationBuilder.RenameColumn(
                name: "Flatid",
                table: "messages",
                newName: "flatid");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "messages",
                newName: "id");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_Userid",
                table: "messages",
                newName: "IX_messages_userid");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_Flatid",
                table: "messages",
                newName: "IX_messages_flatid");

            migrationBuilder.RenameColumn(
                name: "Userid",
                table: "Flats",
                newName: "userid");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Flats",
                newName: "type");

            migrationBuilder.RenameColumn(
                name: "RoomCount",
                table: "Flats",
                newName: "roomCount");

            migrationBuilder.RenameColumn(
                name: "Price",
                table: "Flats",
                newName: "price");

            migrationBuilder.RenameColumn(
                name: "Picture",
                table: "Flats",
                newName: "picture");

            migrationBuilder.RenameColumn(
                name: "Kids",
                table: "Flats",
                newName: "kids");

            migrationBuilder.RenameColumn(
                name: "Furniture",
                table: "Flats",
                newName: "furniture");

            migrationBuilder.RenameColumn(
                name: "Floor",
                table: "Flats",
                newName: "floor");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Flats",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "ApartmentArea",
                table: "Flats",
                newName: "apartmentArea");

            migrationBuilder.RenameColumn(
                name: "Animals",
                table: "Flats",
                newName: "animals");

            migrationBuilder.RenameColumn(
                name: "Address",
                table: "Flats",
                newName: "address");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Flats",
                newName: "id");

            migrationBuilder.RenameIndex(
                name: "IX_Flats_Userid",
                table: "Flats",
                newName: "IX_Flats_userid");

            migrationBuilder.AlterColumn<DateTime>(
                name: "time",
                table: "messages",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AddPrimaryKey(
                name: "PK_users",
                table: "users",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_messages",
                table: "messages",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_Flats_users_userid",
                table: "Flats",
                column: "userid",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_messages_Flats_flatid",
                table: "messages",
                column: "flatid",
                principalTable: "Flats",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_messages_users_userid",
                table: "messages",
                column: "userid",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
