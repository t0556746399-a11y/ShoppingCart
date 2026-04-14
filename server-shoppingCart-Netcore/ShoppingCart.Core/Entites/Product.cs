using System.ComponentModel.DataAnnotations;
namespace ShoppingCart.Core.Entites
{

    public class Product
    {
        [Key]
        public int Id { get; set; }
        public double Price { get; set; }
        public string Description { get; set; }
        public string Img { get; set; }
        public int NumInStock { get; set; }

        public List<Cart> Carts { get; set; }
    }
}