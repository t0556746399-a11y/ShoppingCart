using ShoppingCart.Core.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoppingCart.Core.Repositories
{
    public interface IDiscountRepository : IRepository<Discount>
    {
        public Task<List<Discount>> GetAsync();
        public Task<Discount> GetByIdAsync(int idproduct);
        public Task UpdateAsync(int id, Discount d);
        public Task DeleteAsync(int id);

    }
}
