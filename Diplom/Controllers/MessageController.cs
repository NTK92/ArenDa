using Diplom.Data;
using Diplom.Dtos;
using Diplom.Helpers;
using Diplom.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Diplom.Controllers
{
    
    [Route("message")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly CipherService _cipherService;

        public MessageController(DataContext context, CipherService cipherService)
        {
            _context = context;
            _cipherService = cipherService;
        }
        
        //get message
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Message>>> GetMessages()
        {
            return await _context.Messages.ToListAsync();
        }

        //get message/1
        [HttpGet("{id}")]
        public async Task<ActionResult<Message>> GetMessage(int id)
        {
            var msg = await _context.Messages.FindAsync(id);
            if (msg == null)
            {
                return NotFound();
            }
            return msg;
        }
        
        // получаем список отправленных сообщений пользователя
        //get message/1/sendedmessages
        [HttpGet("{id}/sendedmessages")]
        public async Task<IEnumerable<Message>> GetSendedMessagesById(int id)
        {
            var msg = await _context.Messages
                .Where(m => m.Userid == id) 
                .OrderByDescending(d => d.Time)
                .ToListAsync();
            foreach (var m in msg)
            {
                var text = _cipherService.Decrypt(m.Text);
                m.Text = text;
            }
            return msg;
        }
        
        // получаем список полученных сообщений пользователя
        //get message/1/receivedmessages
        [HttpGet("{id}/receivedmessages")]
        public async Task<IEnumerable<Message>> GetReceivedMessagesById(int id)
        {
            var msg = await _context.Messages
                .Where(m => m.Receiverid == id)
                .OrderByDescending(d => d.Time)
                .ToListAsync();
            foreach (var m in msg)
            {
                var text = _cipherService.Decrypt(m.Text);
                m.Text = text;
            }
            return msg;
        }
        
        // получаем список квартир по id пользователя
        //get message/1/flats
        [HttpGet("{id}/flats")]
        public async Task<IEnumerable<Flats>> GetFlatsById(int id)
        {
            var flat = await _context.Flats
                .Where(p => p.Userid == id)
                .ToListAsync();
                
            return flat;
        } 
        
        // достаем из сообщения id отправителя
        //get message/1/userid
        [HttpGet("{id}/userid")]
        public async Task<ActionResult> GetSenderUserIdFromMessage(int id)
        {
            var msg = await _context.Messages.FindAsync(id);
            if (msg == null)
            {
                return NotFound();
            }
            
            var user = await _context.Users.FindAsync(msg.Userid);
            var resultDto = new {id = user!.Id, name = user.Name, PhoneMobile = user.PhoneMobile};
            return new JsonResult(resultDto);
        }
        
        // достаем из сообщения id получателя
        //get message/1/receiverid
        [HttpGet("{id}/receiverid")]
        public async Task<ActionResult> GetReceiverUserIdFromMessage(int id)
        {
            var msg = await _context.Messages.FindAsync(id);
            if (msg == null)
            {
                return NotFound();
            }
            
            var user = await _context.Users.FindAsync(msg.Receiverid);
            var resultDto = new {id = user!.Id, name = user.Name, PhoneMobile = user.PhoneMobile};
            return new JsonResult(resultDto);
        }
        
        // достаем из сообщения id квартиры
        //get message/1/flatid
        [HttpGet("{id}/flatid")]
        public async Task<ActionResult> GetFlatIdFromMessage(int id)
        {
            var msg = await _context.Messages.FindAsync(id);
            if (msg == null)
            {
                return NotFound();
            }
            
            var flat = await _context.Flats.FindAsync(msg.Flatid);
            var resultDto = new {id = flat!.Id, address = flat.Address};
            return new JsonResult(resultDto);
        }
        
        // отправляем сообщение
        //post message
        [HttpPost("send")]
        public async Task<ActionResult<Message>> SendMessage(MessageDto msg)
        {
            var usr = _context.Users.FirstOrDefault(u => u.Id == msg.Userid);
            if (usr == null)
            {
                return BadRequest(new { error = "Пользователь не найден"});
            }
            var flt = _context.Flats.FirstOrDefault(f => f.Id == msg.Flatid);
            if (flt == null)
            {
                return BadRequest(new { error = "Квартира не найдена"});
            }
            var date = DateTime.Now;
            date = new DateTime(date.Year, date.Month, date.Day, date.Hour, date.Minute, date.Second);
            
            var text = _cipherService.Encrypt(msg.Text);
            msg.Text = text;
            _context.Messages.Add(new Message
            {
                Flatid = msg.Flatid,
                Receiverid = msg.Receiverid,
                Userid = msg.Userid,
                Text = msg.Text,
                Time = date,
                User = usr,
                Flat = flt
            });
            await _context.SaveChangesAsync();
            return Ok();
            /*var newmsg = await _context.messages.FindAsync(msg.id);
            if (newmsg == null)
            {
                NotFound();
            }
            return newmsg;*/
        }
        
    }
}
