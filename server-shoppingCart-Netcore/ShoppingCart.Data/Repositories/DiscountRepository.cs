using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer.Query.Internal;
using ShoppingCart.Core.Entites;
using ShoppingCart.Core.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace ShoppingCart.Data.Repositories
{
    public class DiscountRepository : IDiscountRepository
    {
        private readonly dataContext _context;

        public DiscountRepository(dataContext context)
        {
            _context = context;
        }

        public async Task<List<Discount>> GetAsync()
        {
            return await _context.Discounts.Include(d => d.Product).ToListAsync();
        }

        public async Task<Discount> GetByIdAsync(int id)
        {
            return await _context.Discounts.FirstOrDefaultAsync(x => x.Id == id);
        }

        public void Add(Discount value)
        {
            _context.Discounts.Add(value);
        }

        public async Task UpdateAsync(int id, Discount d)
        {
            var discountToUpdate = await GetByIdAsync(id);

            if (discountToUpdate != null)
            {
                discountToUpdate.ProductId = d.ProductId;
                discountToUpdate.Description = d.Description;
                discountToUpdate.NumInDiscount = d.NumInDiscount;
                discountToUpdate.DiscountPercent = d.DiscountPercent;
            }
        }

        public async Task DeleteAsync(int id)
        {
            var dis = await GetByIdAsync(id);
            if (dis != null)
            {
                _context.Discounts.Remove(dis);
            }
        }
        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}