using ShoppingCart.Core.Entites;
using ShoppingCart;

namespace ShoppingCart
{
    public interface IDataContext
    {
        public List<Cart> carts { get; set; }
        public List<Discount> discounts { get; set; }
        public List<Product> products { get; set; }

    }
}
