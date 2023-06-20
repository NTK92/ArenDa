using System.ComponentModel.DataAnnotations;
namespace Diplom.Models;
public class Message
{
    [Key][Required]
    public int Id { get; set; }
        
    public string Text { get; set; }

    public DateTime Time { get; set; }

    public User User { get; set; }

    public int Userid { get; set; }
        
    public int Receiverid { get; set; }
        
    public int Flatid { get; set; }

    public Flats Flat { get; set; }
}
