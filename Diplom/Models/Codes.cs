using System.ComponentModel.DataAnnotations;

namespace Diplom.Models;

public class Codes {
    [Key][Required]
    public int Id { get; set; }
        
    public string Code { get; set; }

    public DateTime Time { get; set; }

    public User User { get; set; }

    public int Userid { get; set; }
    
}