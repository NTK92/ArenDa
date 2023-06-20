using System.Net;
using Diplom.Data;
using Diplom.Dtos;
using Diplom.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Diplom.Controllers
{
    [Route("/flat")]
    [ApiController]
    public class FlatController : ControllerBase
    {
        private readonly DataContext _context;

        public FlatController(DataContext context)
        {
            _context = context;
        }

        //get /user
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Flats>>> GetFlats()
        {
            return await _context.Flats.ToListAsync();
        }
        
        //get /user/byid
        [HttpGet("byid")]
        public async Task<ActionResult<IEnumerable<Flats>>> GetFlatsByLastId()
        {
            return await _context.Flats
                .OrderByDescending(i => i.Id)
                .Take(5)
                .ToListAsync();
        }

        //get /user/1
        [HttpGet("{id}")]
        public async Task<ActionResult<Flats>> GetFlat(int id)
        {
            var flat = await _context.Flats.FindAsync(id);
            if (flat == null)
            {
                return NotFound();
            }

            return flat;
        }
        
        [HttpGet("pictures/{id}")]
        public async Task<ActionResult<IEnumerable<Pictures>>> GetFlatPictures(int id)
        {
            var pictures = await _context.Pictures.Where(p => p.Flatid == id).ToListAsync();
            if (pictures == null)
            {
                return NotFound();
            }

            return pictures;
        }
        
        //get product/userid/1
        [HttpGet("userid/{id}")]
        public async Task<ActionResult> GetProductUserId(int id)
        {
            var prod = await _context.Flats.FindAsync(id);
            if (prod == null)
            {
                return NotFound();
            }
            
            var user = await _context.Users.FindAsync(prod.Userid);
            if (user != null)
            {
                var resultDto = new {id = user.Id, name = user.Name, PhoneMobile = user.PhoneMobile};
                return new JsonResult(resultDto);
            }
            else
            {
                return BadRequest();
            }
        }
        
        [HttpPost("search")]
        public async Task<ActionResult<IEnumerable<Flats>>> Search(SearchDto searchDto)
        {
            var flats = from f in _context.Flats
                select f;
            if (!String.IsNullOrEmpty(searchDto.Address))
            {
                flats = flats.Where(s => s.Address!.ToLower().Contains(searchDto.Address.ToLower()));
                flats = flats.Where(s => s.District!.ToLower().Contains(searchDto.Address.ToLower()));
            }
                

            if (searchDto.Animals == true)
                flats = flats.Where(s => s.Animals == searchDto.Animals);
            
            if (searchDto.Kids == true)
                flats = flats.Where(s => s.Kids == searchDto.Kids);
            
            if (searchDto.Furniture == true)
                flats = flats.Where(s => s.Furniture == searchDto.Furniture);

            if (!String.IsNullOrEmpty(searchDto.Type))
                flats = flats.Where(s => s.Type!.Contains(searchDto.Type));

            if (searchDto.RoomCount != null & searchDto.RoomCount != "")
            {
                var roomCount = Int32.Parse(searchDto.RoomCount!);
                if (roomCount > 3)
                    flats = flats.Where(s => s.RoomCount > 3);
                else
                    flats = flats.Where(s => s.RoomCount == roomCount);
            }

            var priceFrom = 0;
            if (searchDto.PriceFrom == null | searchDto.PriceFrom == "")
                priceFrom = 0;
            else
                priceFrom = Int32.Parse(searchDto.PriceFrom!);
            if (searchDto.PriceUpTo != null & searchDto.PriceUpTo != "")
            {
                var priceUpTo = Int32.Parse(searchDto.PriceUpTo!);
                flats = flats.Where(s =>  priceFrom <= s.Price && s.Price <= priceUpTo);
            }

            return await flats.ToListAsync();
        }
        
        [HttpPost("searching")]
        public async Task<ActionResult<IEnumerable<Flats>>> Search()
        {
            var flats = from f in _context.Flats
                select f;
            
            string strPriceFrom = Request.Query.FirstOrDefault(p => p.Key == "priceFrom").Value!;
            int priceFrom,priceUpTo;
            if (strPriceFrom != null)
                priceFrom = Int32.Parse(strPriceFrom!);
            else
                priceFrom = 0;
            string strPriceUpTo = Request.Query.FirstOrDefault(p => p.Key == "priceUpTo").Value!;
            if (strPriceUpTo != null)
                priceUpTo = Int32.Parse(strPriceUpTo!);
            else
                priceUpTo = Int32.MaxValue;
            flats = flats.Where(s =>  priceFrom <= s.Price && s.Price <= priceUpTo);
            
            string strRoomCount = Request.Query.FirstOrDefault(p => p.Key == "roomCount").Value!;
            if (strRoomCount != null)
            {
                int roomCount = Int32.Parse(strRoomCount!);
                if (roomCount > 3)
                    flats = flats.Where(s => s.RoomCount > 3);
                else
                    flats = flats.Where(s => s.RoomCount == roomCount);
            }
            
            string strType = Request.Query.FirstOrDefault(p => p.Key == "type").Value!;
            if (strType != null)
            {
                flats = flats.Where(s => s.Type!.Contains(strType));
            }
            
            string strAddress = Request.Query.FirstOrDefault(p => p.Key == "address").Value!;
            if (strAddress != null)
            {
                if (strAddress.Contains(","))
                {
                    var address = strAddress.Split(",");
                    foreach (var word in address)
                    {
                        flats = flats.Where(s => s.Address!.ToLower().Contains(word.ToLower()) ||
                                                 s.District!.ToLower().Contains(word.ToLower()) );
                    }
                }
                else if (strAddress.Contains(" "))
                {
                    var address = strAddress.Split(" ");
                    foreach (var word in address)
                    {
                        flats = flats.Where(s => s.Address!.ToLower().Contains(word.ToLower()) ||
                                                 s.District!.ToLower().Contains(word.ToLower()) );
                    }
                }
                else
                {
                    flats = flats.Where(s => s.Address!.ToLower().Contains(strAddress.ToLower()) ||
                                             s.District!.ToLower().Contains(strAddress.ToLower()) );
                }
            }
            
            string strAnimals = Request.Query.FirstOrDefault(p => p.Key == "animals").Value!;
            if (strAnimals == "true")
            {
                bool animals = Boolean.Parse(strAnimals);
                flats = flats.Where(s => s.Animals == animals);
            }
            
            string strKids = Request.Query.FirstOrDefault(p => p.Key == "kids").Value!;
            if (strKids == "true")
            {
                bool kids = Boolean.Parse(strKids);
                flats = flats.Where(s => s.Kids == kids);
            }
            
            string strFurniture = Request.Query.FirstOrDefault(p => p.Key == "furniture").Value!;
            if (strFurniture == "true")
            {
                bool furniture = Boolean.Parse(strFurniture);
                flats = flats.Where(s => s.Furniture == furniture);
            }
            
            string strOwner = Request.Query.FirstOrDefault(p => p.Key == "owner").Value!;
            if (strOwner == "true")
            {
                bool owner = Boolean.Parse(strOwner);
                flats = flats.Where(s => s.Owner == owner);
            }

            return await flats.ToListAsync();
        }
    }
}
