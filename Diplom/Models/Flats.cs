using System.ComponentModel.DataAnnotations;
namespace Diplom.Models;
public class Flats
{
    [Key] [Required] 
    public int Id { get; set; }
    public int? Price { get; set; }
    public string? Address { get; set; }
    public string? Type { get; set; }
    public string? Picture { get; set; }
    public int? RoomCount { get; set; }
    public float? ApartmentArea { get; set; }
    public string? Floor { get; set; }
    public bool? Animals { get; set; }
    public bool? Kids { get; set; }
    public bool? Furniture { get; set; }
    public string? Description { get; set; }
    public bool? Owner { get; set; }
    public string? District { get; set; }
    public int? UtilityBills { get; set; }
    public int? Percent { get; set; }
    public int? PrepaymentMonths { get; set; }
    public float? Longitude { get; set; }
    public float? Latitude { get; set; }
    public int Userid { get; set; }
    public User User { get; set; }
}
