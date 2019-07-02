using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ZwajApp.API.Models;

namespace ZwajApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        public AuthRepository(DataContext context)
        {
            _context = context;

        }
        public async Task<User> Login (string username, string password)
        {
           var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == username);
           if(user == null) return null;
           if(!verfiyPasswordHash(password , user.PassswordSalt , user.PasswordHash ))
           return null;
           return user;
        }

        private bool verfiyPasswordHash(string password, byte[] passswordSalt, byte[] passwordHash)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512(passswordSalt)){
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if(computedHash[i] != passwordHash[i]){
                        return false;
                    }
                }      
                return true;
            }
        
            
        }

        public async Task<User> Register (User user, string password)
        {
            byte[] passwordHash , passswordSalt;
            createPasswordHash(password , out passwordHash , out passswordSalt);
            user.PassswordSalt = passswordSalt;
            user.PasswordHash = passwordHash;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
            

        }

        private void createPasswordHash (string password, out byte[] passwordHash, out byte[] passswordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512()){
                passswordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> UserExists (string username)
        {
            if(await _context.Users.AnyAsync(x => x.Username == username)) return true;
            return false;
        }
    }
}