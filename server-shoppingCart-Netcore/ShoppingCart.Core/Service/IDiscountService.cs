using ShoppingCart.Core.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoppingCart.Core.Service
{
    public interface IDiscountService
    {
        public Task<List<Discount>> GetAsync();
        public Task<Discount> GetByIdAsync(int idproduct);
        public Task AddAsync(Discount value);
        public Task UpdateAsync(int id, Discount d);
        public Task DeleteAsync(int id);
    }
}
