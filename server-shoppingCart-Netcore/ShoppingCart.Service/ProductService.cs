using ShoppingCart.Core.Entites;
using ShoppingCart.Core.Repositories;
using ShoppingCart.Core.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoppingCart.Service
{
    public class ProductService : BaseService<Product, IProductRepository>, IProductService
    {

        public ProductService(IProductRepository productRepository):base(productRepository)
        {
        }
        public async Task<IEnumerable<Product>> GetAsync() => await _repository.GetAsync();

        public async Task<Product> GetByIdAsync(int id) => await _repository.GetByIdAsync(id);
      
        public async Task<IEnumerable<Product>> GetByDescriptionAsync(string description) => await _repository.GetByDescriptionAsync(description);

        public async Task AddAsync(Product value)
        {
            await ExcuteAndSaveAsync(repo => repo.Add(value));

        }
        public async Task UpdateAsync(int id, Product p)
        {
            await ExcuteAndSaveAsync(repo => repo.UpdateProductAsync(id, p));
        }
        public async Task UpdateStockAsync(int id, int count)
        {
            await ExcuteAndSaveAsync(repo => repo.UpdateStockAsync(id, count));
        }
        public async Task DeleteAsync(int id)
        {
            await ExcuteAndSaveAsync(repo => repo.DeleteAsync(id));
        }


    }
}
