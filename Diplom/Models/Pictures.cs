using System.ComponentModel.DataAnnotations;

namespace Diplom.Models;

public class Pictures
{
    [Key][Required]
    public int Id { get; set; }
        
    public string Picture { get; set; }

    public Flats Flat { get; set; }

    public int Flatid { get; set; }
}