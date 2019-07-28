using Microsoft.EntityFrameworkCore;
using ZwajApp.API.Models;

namespace ZwajApp.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Like>()
            .HasKey(k => new { k.LikerId, k.LikeeId});
            //من معجب به الى المعجبين
            modelBuilder.Entity<Like>()
            .HasOne(l => l.Likee)
            .WithMany(u => u.Likers)
            .HasForeignKey(l => l.LikeeId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Like>()
            .HasKey(k => new { k.LikerId, k.LikeeId});
            //من المعجب الى المعجب بهم
            modelBuilder.Entity<Like>()
            .HasOne(l => l.Liker)
            .WithMany(u => u.Likees)
            .HasForeignKey(l => l.LikerId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany(u => u.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);
            
            modelBuilder.Entity<Message>()
            .HasOne(m => m.Recipient)
            .WithMany(u => u.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);
            
        }
    }
}