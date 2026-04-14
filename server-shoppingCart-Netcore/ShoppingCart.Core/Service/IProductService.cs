using ShoppingCart.Core.DTOs;
using ShoppingCart.Core.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoppingCart.Core.Service
{
    public interface IProductService
    {
        public Task<IEnumerable<Product>> GetAsync();
        public Task<Product> GetByIdAsync(int id);
        public Task<IEnumerable<Product>> GetByDescriptionAsync(string description);
        public Task AddAsync(Product value);
        public Task UpdateAsync(int id, Product p);
        public Task UpdateStockAsync(int id, int count);
        public Task DeleteAsync(int id);

    }
}
