using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ShoppingCart;
using ShoppingCart.Core.Entites;

namespace ShoppingCart
{
    public class dataContext : DbContext
    {
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Discount> Discounts { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        private readonly IConfiguration _configuration;
        public dataContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));
        }

    }
}
//  "ConnectionStrings": "Server=(localdb)\\MSSQLLocalDB;Database=ShoppingCart",
//מנהל מוסיף מוצר מנהל מוסיף מבצע ולעדכן
 