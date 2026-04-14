using ShoppingCart.Core.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoppingCart.Core.Service
{
    public interface ICartProductService
    {
        Task<List<Product>> GetProductsInCartAsync(int cartId);
        Task AddProductToCartAsync(int cartId, int productId);
        Task RemoveProductFromCartAsync(int cartId, int productId);
    }
}
