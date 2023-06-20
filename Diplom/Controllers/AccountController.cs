using System.Net;
using System.Security.Claims;
using Diplom.Data;
using Diplom.Dtos;
using Diplom.Helpers;
using Diplom.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

namespace Diplom.Controllers
{
    [Route("/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _context;
        private IWebHostEnvironment _env;
        private FileSaver _fileSaver;

        public AccountController(DataContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
            _fileSaver = new FileSaver(_env);
        }
        
        //get account/1/flats
        [HttpGet("{id}/flats")]
        public async Task<IEnumerable<Flats>> GetProductsById(int id)
        {
            var flats = await _context.Flats
                .Where(p => p.Userid == id)
                .ToListAsync();
            return flats;
        } 
        
        
        //put account/modify
        [HttpPut("modify")]
        public async Task<IActionResult> PutUser(User userModify)
        {
            /*if (id != prod.id){ return BadRequest(); }*/
            var userDto = new
            {
                id = userModify.Id,
                name = userModify.Name,
                mobile = userModify.PhoneMobile
            };
            var usr = await _context.Users.FindAsync(userDto.id);
            if (usr != null)
            {
                if ((userDto.name != "") & (userDto.mobile != ""))
                {
                    usr.Name = userDto.name;
                    usr.PhoneMobile = userDto.mobile;
                }
                else if ((userDto.name != "") & (userDto.mobile == ""))
                {
                    usr.Name = userDto.name;
                }
                else if ((userDto.name == "") & (userDto.mobile != ""))
                {
                    usr.PhoneMobile = userDto.mobile;
                }

                _context.Entry(usr).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            return Ok();
        }
        
        //put account/1/newname/newmobile
        [HttpPut("{id}/{name}/{mobile}")]
        public async Task<IActionResult> PutUser(int id, string name, string mobile)
        {
            /*if (id != prod.id){ return BadRequest(); }*/

            var usr = await _context.Users.FindAsync(id);
            if (usr != null)
            {
                usr.Name = name;
                usr.PhoneMobile = mobile;
                _context.Entry(usr).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();
            return NoContent();
            
            /* try{await _context.SaveChangesAsync();}
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id)){return NotFound();}
                else{throw;}
            }*/
        }
        
        //put account/1/same_name/newmobile
        [HttpPut("{id}/same_name/{mobile}")]
        public async Task<IActionResult> PutUserMobile(int id, string mobile)
        {
            var usr = await _context.Users.FindAsync(id);
            if (usr != null)
            {
                usr.PhoneMobile = mobile;
                _context.Entry(usr).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
        
        //put account/1/newname/same_mobile
        [HttpPut("{id}/{name}/same_mobile")]
        public async Task<IActionResult> PutUserName(int id, string name)
        {
            var usr = await _context.Users.FindAsync(id);
            if (usr != null)
            {
                usr.Name = name;
                _context.Entry(usr).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
        
        //post account/add_new_flat
        [HttpPost("addNewFlat")]
        public async Task<ActionResult<Flats>> PostFlat(FlatDto flatDto)
        {
            var usr = _context.Users.FirstOrDefault(u => u.Id == flatDto.Userid);
            if (usr == null)
            {
                return BadRequest(new { error = "Пользователь не найден"});
            }

            var newFlat = new Flats
            {
                Id = flatDto.Id,
                Price = flatDto.Price,
                Picture = flatDto.Picture,
                Address = flatDto.Address,
                Type = flatDto.Type,
                RoomCount = flatDto.RoomCount,
                ApartmentArea = flatDto.ApartmentArea,
                Floor = flatDto.Floor,
                Animals = flatDto.Animals,
                Kids = flatDto.Kids,
                Furniture = flatDto.Furniture,
                Description = flatDto.Description,
                District = flatDto.District,
                Owner = flatDto.Owner,
                UtilityBills = flatDto.UtilityBills,
                Percent = flatDto.Percent,
                PrepaymentMonths = flatDto.PrepaymentMonths,
                Longitude = flatDto.Longitude,
                Latitude = flatDto.Latitude,
                Userid = flatDto.Userid,
                User = usr
            };
            _context.Flats.Add(newFlat);
            await _context.SaveChangesAsync();

            foreach (var pic in flatDto.Pictures)
            {
                _context.Pictures.Add(new Pictures
                {
                    Picture = pic,
                    Flatid = newFlat.Id,
                    Flat = newFlat
                });
            }
            await _context.SaveChangesAsync();
            return Ok();
            
        }
        
        //delete account/flat/1
        [HttpDelete("flat/{id}")]
        public async Task<IActionResult> DeleteFlat(int id)
        {
            var flat = await _context.Flats.FindAsync(id);
            if (flat == null)
            {
                return NotFound();
            }

            _context.Flats.Remove(flat);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        //delete account/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var usr = await _context.Users.FindAsync(id);
            if (usr == null)
            {
                return NotFound();
            }

            _context.Users.Remove(usr);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        
        /*[HttpPost("add_flat_picture")]
        public async Task<IActionResult> UploadFlatPicture([FromForm] IFormFile file)
        {
            string filename = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            await _fileSaver.FileSaveAsync(file, "ClientApp/public/Images/Flats", filename);
            return new JsonResult(new
            {
                fileName = "Images/Flats/" + filename
            });
        }*/
        
        
        [HttpPost("add_flat_pictures")]
        public async Task<IActionResult> UploadProfilePicture(List<IFormFile> files)
        {
            List<string> addedPics = new List<string>();
            foreach (var file in files)
            {
                string filename = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                await _fileSaver.FileSaveAsync(file, "ClientApp/public/Images/Flats", filename);
                addedPics.Add("/Images/Flats/" + filename);
            }
            return new JsonResult(new
            {
                fileName = addedPics
            });
        }
    }
}