using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ZwajApp.API.Models;

namespace ZwajApp.API.Data
{
    public class DataContext : IdentityDbContext<User,Role,int,IdentityUserClaim<int>,UserRole,IdentityUserLogin<int>,IdentityRoleClaim<int>,IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Value> Values { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Payment> Payments { get; set; }    
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<UserRole>(userRoles => {
                userRoles.HasKey(ur => new { ur.UserId, ur.RoleId });
                
                userRoles.HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();

                userRoles.HasOne(ur => ur.User)
                .WithMany(r => r.UsersRoles)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();
            });
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
            
            modelBuilder.Entity<Photo>()
            .HasQueryFilter(p => p.IsApproved);
            
        }
    }
}