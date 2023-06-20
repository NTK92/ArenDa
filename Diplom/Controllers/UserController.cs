using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Diplom.Data;
using Diplom.Dtos;
using Diplom.Helpers;
using Diplom.Models;
using GoogleReCaptcha.V3.Interface;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Diplom.Controllers
{
    [Route("/user")]
    [ApiController]
    //
    public class UserController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly Jwt _jwt;
        private readonly ICaptchaValidator _captchaValidator;
        private readonly IMailService _mailService;
        
        public UserController(DataContext context, Jwt jwt,ICaptchaValidator captchaValidator,IMailService mailService)
        {
            _context = context;
            _jwt = jwt;
            _captchaValidator = captchaValidator;
            _mailService = mailService;
        }

        //get user
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        //get user/1
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var usr = await _context.Users.FindAsync(id);
            if (usr == null)
            {
                return NotFound();
            }
            return usr;
        }
        
        [HttpPost("signin/notwofactor")]
        public async Task<ActionResult<User>> SignInNoTwoFactor(UserDto signinuser)
        {
            var userDto = new
            {
                login = signinuser.Login,
                password = signinuser.Password
            };
            var usr = _context.Users.FirstOrDefault(s => s.Login != null && s.Login.Contains(userDto.login!));
            if (usr == null)
            {
                return BadRequest(new { error = "Неправильный логин"});
            }
            if (usr.Password != ComputeSha512Hash(userDto.password))
                return BadRequest(new { error = "Неправильный пароль"});
            
            if (!await _captchaValidator.IsCaptchaPassedAsync(signinuser.Captcha))
            {
                return BadRequest(new { error = "Вы не прошли капчу"});
            }

            var jwt = _jwt.Generate(usr.Id);
            Response.Cookies.Append("JWT",jwt,new CookieOptions()
            {
                HttpOnly = true
            });
            
            /*Response.Cookies.Append("userid",usr.Id.ToString(),new CookieOptions()
            {
                HttpOnly = true
            });*/
           
            return usr;
        }
        
        //[ValidateAntiForgeryToken]
        [HttpPost("signin")]
        public async Task<ActionResult> SignIn(UserDto signinuser)
        {
            var usr = _context.Users.FirstOrDefault(s => s.Login != null && s.Login.Contains(signinuser.Login!));
            if (usr == null)
            {
                return BadRequest(new { error = "Неправильный логин"});
            }
            if (usr.Password != ComputeSha512Hash(signinuser.Password))
                return BadRequest(new { error = "Неправильный пароль"});
            
            if (!await _captchaValidator.IsCaptchaPassedAsync(signinuser.Captcha))
            {
                return BadRequest(new { error = "Вы не прошли капчу"});
            }
            
            var email = signinuser.Login;
            var message_code = GenerateRandomCode();
            var message = "Код для подтверждения (код действителен 1 час): "+message_code;
            var subject = "Код для подтверждения на сайте ArenDa!";
            var messageHash = ComputeSha512Hash(message_code);

            /*var codes = _context.Codes.Where(c => c.Userid == usr.Id).ToList();
            foreach (var c in codes)
            {
                _context.Codes.Remove(c);
            }
            await _context.SaveChangesAsync();*/

            _context.Codes.Add(new Codes
            {
                Code = messageHash,
                Userid = usr.Id,
                User = usr,
                Time = DateTime.Now
            });
            await _context.SaveChangesAsync();
            await _mailService.SendEmailAsync(email, subject, message);

            /*Response.Cookies.Append("userid",usr.Id.ToString(),new CookieOptions()
            {
                HttpOnly = true
            });*/

            return Ok();
        }
        
        [HttpPost("signin/twofactor")]
        public async Task<ActionResult<User>> SignInTwoFactor(CodeDto codeDto)
        {
            if (codeDto.Code != "")
            {
                var login = codeDto.Login;
                var password = codeDto.Password;
                
                var usr = _context.Users.FirstOrDefault(s => s.Login != null && s.Login.Contains(login));
                if (usr == null)
                {
                    return BadRequest(new { error = "Неправильный логин"});
                }
                if (usr.Password != ComputeSha512Hash(password))
                    return BadRequest(new { error = "Неправильный пароль"});
                
                var cod = ComputeSha512Hash(codeDto.Code);
                var code =  _context.Codes.FirstOrDefaultAsync(c => c.Code.Contains(cod)).Result;
                if (code == null)
                {
                    return BadRequest(new { error = "Неправильный код"});
                }
                if (code.Time.AddHours(1) <= DateTime.Today)
                {
                    return BadRequest(new { error = "Время действия кода истекло"});
                }
                _context.Codes.Remove(code);
                await _context.SaveChangesAsync();

                var jwt = _jwt.Generate(usr.Id);
                Response.Cookies.Append("JWT",jwt,new CookieOptions()
                {
                    HttpOnly = true
                });
                return usr;
            }
            return BadRequest(new { error = "Введите код"});
            
        }
            

        static string ComputeSha512Hash(string rawData)  
        {  
            // Create a SHA512   
            using (SHA512 sha512Hash = SHA512.Create())  
            {  
                // ComputeHash - returns byte array  
                byte[] bytes = sha512Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));  
  
                // Convert byte array to a string   
                StringBuilder builder = new StringBuilder();  
                for (int i = 0; i < bytes.Length; i++)  
                {  
                    builder.Append(bytes[i].ToString("x2"));  
                }  
                return builder.ToString();  
            }  
        }  
        
        public string GenerateRandomCode()
        {
            using var rng = RandomNumberGenerator.Create();
            
            // Создаем массив из 4 байтов
            byte[] randomBytes = new byte[4];
            // Заполняем массив случайными байтами
            rng.GetBytes(randomBytes);
            // Преобразуем массив байтов в число типа int
            int randomNumber = BitConverter.ToInt32(randomBytes, 0);
            // Ограничиваем диапазон числа, чтобы оно было 8-значным
            randomNumber %= 100000000;
            if (randomNumber < 0)
                randomNumber += 100000000;
            return (randomNumber).ToString();
        }
        
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDto registerUser)
        {
            if (!await _captchaValidator.IsCaptchaPassedAsync(registerUser.Captcha))
            {
                return BadRequest(new { error = "Вы не прошли капчу"});
            }
            var usr = _context.Users.FirstOrDefaultAsync(s => s.Login!.Contains(registerUser.Login!)).Result;
            if (usr == null)
            {
                registerUser.Password = ComputeSha512Hash(registerUser.Password);
                var newUser = new User
                {
                    Id = registerUser.Id,
                    Login = registerUser.Login,
                    Password = registerUser.Password,
                    PhoneMobile = registerUser.PhoneMobile,
                    Name = registerUser.Name
                };
                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();
                var email = registerUser.Login;
                var message_code = GenerateRandomCode();
                var message = "Код для подтверждения (код действителен 1 час): "+message_code;
                var subject = "Код для подтверждения на сайте ArenDa!";
                var messageHash = ComputeSha512Hash(message_code);
                _context.Codes.Add(new Codes
                {
                    Code = messageHash,
                    Userid = newUser.Id,
                    User = newUser,
                    Time = DateTime.Now
                });
                await _context.SaveChangesAsync();
                await _mailService.SendEmailAsync(email, subject, message);

                //await _context.SaveChangesAsync();
                return CreatedAtAction("GetUser", new { id = registerUser.Id }, registerUser);
            }
            return BadRequest(new { error = "Данный логин уже существует"});
        }

        [HttpPost("register/twofactor")]
        public async Task<IActionResult> TwoFactorAuth(CodeDto codeDto)
        {
            if (codeDto.Code != "")
            {
                var cod = ComputeSha512Hash(codeDto.Code);
                var code =  _context.Codes.FirstOrDefaultAsync(c => c.Code.Contains(cod)).Result;
                if (code == null)
                {
                    return BadRequest(new { error = "Неправильный код"});
                }
                if (code.Time.AddHours(1) <= DateTime.Today)
                {
                    return BadRequest(new { error = "Время действия кода истекло"});
                }
                _context.Codes.Remove(code);
                await _context.SaveChangesAsync();
                return Ok();
            }
            return BadRequest(new { error = "Введите код"});
        }
        

        [HttpGet("auth")]
        public async Task<IActionResult> UserCheck ()
        {
            try
            {
                var jwt = Request.Cookies["JWT"];

                var token = _jwt.Verify(jwt);
                /*
                var userid = Request.Cookies["userid"];*/
                if (jwt == null)
                {
                    return Unauthorized();
                }
                //int id = int.Parse(userid);
                int id = int.Parse(token.Issuer);
                var user = await _context.Users.FindAsync(id);
                return Ok(user);
            }
            catch (Exception)
            {
                return Unauthorized();
            }
            
        }
        
        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            //Response.Cookies.Delete("userid");
            Response.Cookies.Delete("JWT");
            return await Task.FromResult(Ok(/*new { message = "Logged out" }*/));
        }
        
        [HttpPost("forgotpassword")]
        public async Task<ActionResult> ForgotPasswordFirstStep(UserDto signinuser)
        {
            var usr = _context.Users.FirstOrDefault(s => s.Login != null && s.Login.Contains(signinuser.Login!));
            if (usr == null)
            {
                return BadRequest(new { error = "Неправильный логин"});
            }
            if (!await _captchaValidator.IsCaptchaPassedAsync(signinuser.Captcha))
            {
                return BadRequest(new { error = "Вы не прошли капчу"});
            }
            
            var email = signinuser.Login;
            var message_code = GenerateRandomCode();
            var message = "Код для подтверждения (код действителен 1 час): "+message_code;
            var subject = "Код для подтверждения на сайте ArenDa!";
            var messageHash = ComputeSha512Hash(message_code);
            
            _context.Codes.Add(new Codes
            {
                Code = messageHash,
                Userid = usr.Id,
                User = usr,
                Time = DateTime.Now
            });
            await _context.SaveChangesAsync();
            await _mailService.SendEmailAsync(email, subject, message);
            
            return Ok();
        }

        [HttpPost("checkcode")]
        public async Task<ActionResult> CheckCode(CodeDto codeDto)
        {
            if (codeDto.Code != "")
            {
                var cod = ComputeSha512Hash(codeDto.Code);
                var code =  _context.Codes.FirstOrDefaultAsync(c => c.Code.Contains(cod)).Result;
                if (code == null)
                {
                    return BadRequest(new { error = "Неправильный код"});
                }
                if (code.Time.AddHours(1) <= DateTime.Today)
                {
                    return BadRequest(new { error = "Время действия кода истекло"});
                }
                _context.Codes.Remove(code);
                await _context.SaveChangesAsync();
                return Ok();
            }
            return BadRequest(new { error = "Введите код"});
        }
        
        [HttpPost("resetpassword")]
        public async Task<ActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var usr = _context.Users.FirstOrDefaultAsync(s => s.Login!.Contains(resetPasswordDto.Login!)).Result;
            if (usr == null)
            {
                return BadRequest(new { error = "Неверный логин"});
            }
            var psw = ComputeSha512Hash(resetPasswordDto.Password);
            usr.Password = psw;
            _context.Entry(usr).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok();
        }

    }
}
