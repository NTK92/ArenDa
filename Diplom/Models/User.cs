using System.ComponentModel.DataAnnotations;

namespace Diplom.Models
{
    public class User
    {
        [Key]
        [Required]
        public int Id { get; set; }

        //[Required(ErrorMessage = "Не указан логин")]

        [Required]
        public string? Login { get; set; }

        //[Required(ErrorMessage = "Не указан пароль")]
        [Required]
        public string? Password { get; set; }

        public string? Name { get; set; }

        public string? PhoneMobile { get; set; }

        public bool? TwoFactor { get; set; }

        public ICollection<Flats>? Flats { get; set; }
    }
}
