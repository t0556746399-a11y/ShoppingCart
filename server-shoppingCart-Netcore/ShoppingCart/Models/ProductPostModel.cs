using ShoppingCart.Core.Entites;

namespace ShoppingCart.Models
{
    public class ProductPostModel

    {
        public int Id { get; set; }
        public double Price { get; set; }
        public string Description { get; set; }
        public string Img { get; set; }
        public int NumInStock { get; set; }
    }
}
