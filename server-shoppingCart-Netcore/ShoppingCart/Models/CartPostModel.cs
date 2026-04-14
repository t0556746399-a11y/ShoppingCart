using ShoppingCart.Core.Entites;

namespace ShoppingCart.Models
{
    public class CartPostModel
    {
        public string IdUser { get; set; }
        public DateTime DateTime { get; set; }
        public decimal Sum { get; set; }
        public List<int> ProductIds { get; set; }
    }
}
