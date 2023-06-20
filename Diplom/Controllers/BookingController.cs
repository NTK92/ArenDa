using Diplom.Data;
using Diplom.Dtos;
using Diplom.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Diplom.Controllers
{

    [Route("booking")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly DataContext _context;

        public BookingController(DataContext context)
        {
            _context = context;
        }
        
        //get all bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBooking()
        {
            return await _context.Booking.ToListAsync();
        }
        
        // получаем список отправленных броней
        //get message/1/sendedmessages
        [HttpGet("{id}/sendedBookings")]
        public async Task<IEnumerable<Booking>> GetSendedBookingsById(int id)
        {
            var bookings = await _context.Booking
                .Where(b => b.Userid == id) 
                .OrderByDescending(i => i.Id)
                .ToListAsync();
            return bookings;
        }
        
        // получаем список полученных броней
        //get message/1/receivedmessages
        [HttpGet("{id}/receivedBookings")]
        public async Task<IEnumerable<Booking>> GetReceivedBookingsById(int id)
        {
            var flatList = await _context.Flats.Where(f => f.Userid == id).ToListAsync();
            
            List<Booking> result = new List<Booking>();
            foreach (var flat in flatList)
            {
                var bookings = await _context.Booking
                    .Where(m => m.Flatid == flat.Id)
                    .OrderByDescending(i => i.Id)
                    .ToListAsync();    
                result.AddRange(bookings);
            }
            
            return result;
        }
        
        [HttpPost("book")]
        public async Task<ActionResult<Booking>> Book(BookingDto bookingDto)
        {
            var usr = _context.Users.FirstOrDefault(u => u.Id == bookingDto.Userid);
            if (usr == null)
            {
                return BadRequest(new { error = "Пользователь не найден"});
            }
            var flt = _context.Flats.FirstOrDefault(f => f.Id == bookingDto.Flatid);
            if (flt == null)
            {
                return BadRequest(new { error = "Квартира не найдена"});
            }
            _context.Booking.Add(new Booking
            {
                Flatid = bookingDto.Flatid,
                Userid = bookingDto.Userid,
                Date = bookingDto.Date,
                Allowed = false,
                User = usr,
                Flat = flt
            });
            await _context.SaveChangesAsync();
            return Ok();
        }
        
        [HttpPost("getinfo/received")]
        public async Task<ActionResult<Booking>> GetBookingInfoReceived(BookingDto bookingDto)
        {
            var usr = await _context.Users.FindAsync(bookingDto.Userid);
            if (usr == null)
            {
                return BadRequest(new { error = "Пользователь не найден"});
            }
            var flt = await _context.Flats.FindAsync(bookingDto.Flatid);
            if (flt == null)
            {
                return BadRequest(new { error = "Квартира не найдена"});
            }
            var resultDto = new {name = usr.Name, picture = flt.Picture, address = flt.Address };
            return new JsonResult(resultDto);
        }
        
        [HttpPost("getinfo/sended")]
        public async Task<ActionResult<Booking>> GetBookingInfoSended(BookingDto bookingDto)
        {
            var flt = await _context.Flats.FindAsync(bookingDto.Flatid);
            if (flt == null)
            {
                return BadRequest(new { error = "Квартира не найдена"});
            }
            var usr = await _context.Users.FindAsync(flt.Userid);
            if (usr == null)
            {
                return BadRequest(new { error = "Пользователь не найден"});
            }
            var resultDto = new {name = usr.Name, picture = flt.Picture, address = flt.Address };
            return new JsonResult(resultDto);
        }
        
        [HttpPut("{id}/change")]
        public async Task<IActionResult> ChangeStatus(int id)
        {
            var booking = await _context.Booking.FindAsync(id);
            if (booking != null)
            {
                booking.Allowed = !booking.Allowed;
                _context.Entry(booking).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
        
    }
}