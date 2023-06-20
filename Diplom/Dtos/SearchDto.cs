namespace Diplom.Dtos;

public class SearchDto
{
    public string? PriceFrom { get; set; }
    public string? PriceUpTo { get; set; }
    public string? Address { get; set; }
    public string? Type { get; set; }
    public string? RoomCount { get; set; }
    public bool? Animals { get; set; }
    public bool? Kids { get; set; }
    public bool? Furniture { get; set; }
}