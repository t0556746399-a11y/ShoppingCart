using ShoppingCart.Core.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoppingCart.Core.Service
{
    public interface ICartService
    {
        Task<List<Cart>> GetAllAsync();
        Task<Cart> GetCartByIdAsync(int id);
        Task AddAsync(Cart newCart);
        Task ClearCartAsync(int id);
    }
}
