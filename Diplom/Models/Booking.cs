using System.ComponentModel.DataAnnotations;

namespace Diplom.Models;

public class Booking
{
    [Key][Required]
    public int Id { get; set; }
        
    public User User { get; set; }

    public int Userid { get; set; }
    
    public Flats Flat { get; set; }

    public int Flatid { get; set; }

    public DateTime Date { get; set; }

    public bool? Allowed { get; set; }
}