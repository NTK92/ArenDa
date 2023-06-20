using Diplom.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Diplom.Data
{
    public class DataContext : DbContext
    {

        public DataContext(DbContextOptions<DataContext> options) :
            base(options)
        { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=DiplomDb;Username=postgres;Password=1234");
        }

        public DbSet<User> Users { get; set; } 
        public DbSet<Flats> Flats { get; set; }
        public DbSet<Message> Messages { get; set; } 
        public DbSet<Codes> Codes { get; set; }
        public DbSet<Pictures> Pictures { get; set; }
        public DbSet<Booking> Booking { get; set; }
    }
}
