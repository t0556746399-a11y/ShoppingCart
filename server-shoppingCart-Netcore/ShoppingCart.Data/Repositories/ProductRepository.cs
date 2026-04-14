using Microsoft.EntityFrameworkCore;
using ShoppingCart.Core.Entites;
using ShoppingCart.Core.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShoppingCart.Data.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly dataContext _context;

        public ProductRepository(dataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<Product> GetByIdAsync(int id)
        {
            return await _context.Products.FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<IEnumerable<Product>> GetByDescriptionAsync(string description)
        {
            if(string.IsNullOrWhiteSpace(description))
                return Enumerable.Empty<Product>();
            return await _context.Products
                .Where(x => x.Description.ToLower().Contains(description.ToLower()))
                .ToListAsync();
        }
        public void Add(Product value)
        {
            _context.Products.Add(value);
        }

        public async Task UpdateProductAsync(int id, Product p)
        {
            var productToUpdate = await GetByIdAsync(id);

            if (productToUpdate != null)
            {
                productToUpdate.Price = p.Price;
                productToUpdate.Description = p.Description;
                productToUpdate.Img = p.Img;
                productToUpdate.NumInStock = p.NumInStock;
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateStockAsync(int id, int count)
        {
            var productToUpdate = await GetByIdAsync(id);
            if (productToUpdate != null)
            {
                if (productToUpdate.NumInStock + count >= 0)
                {
                    productToUpdate.NumInStock += count;
                }
            }
        }

        public async Task DeleteAsync(int id)
        {
            var pro = await GetByIdAsync(id);
            if (pro != null)
            {
                _context.Products.Remove(pro);
            }

        }
        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}