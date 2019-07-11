using System.Collections.Generic;
using Newtonsoft.Json;
using ZwajApp.API.Models;

namespace ZwajApp.API.Data
{
    public class TrialData
    {
        private readonly DataContext _context;
        public TrialData(DataContext context)
        {
            _context = context;
        }
        public void TrialUsers(){
            var userData = System.IO.File.ReadAllText("Data/UserTrailData.json");
            var users = JsonConvert.DeserializeObject<List<User>>(userData);
            foreach (var user in users)
            {
                byte[] passwordHash , passwordSalt;
                createPasswordHash("password" , out passwordHash, out passwordSalt);
                user.PasswordHash = passwordHash;
                user.PassswordSalt = passwordSalt;
                user.Username = user.Username.ToLower();
                _context.Add(user);


            }
            _context.SaveChanges();

        }
        private void createPasswordHash (string password, out byte[] passwordHash, out byte[] passswordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512()){
                passswordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}