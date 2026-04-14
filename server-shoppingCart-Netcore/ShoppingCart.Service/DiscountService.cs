using ShoppingCart.Core.Entites;
using ShoppingCart.Core.Repositories;
using ShoppingCart.Core.Service;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShoppingCart.Service
{
    public class DiscountService : BaseService<Discount, IDiscountRepository>, IDiscountService
    {
        public DiscountService(IDiscountRepository discountRepository) : base(discountRepository)
        {
        }

        public async Task<List<Discount>> GetAsync() => await _repository.GetAsync();

        public async Task<Discount> GetByIdAsync(int id) => await _repository.GetByIdAsync(id);

        public async Task AddAsync(Discount value)
        {
            await ExcuteAndSaveAsync(repo => repo.Add(value));
        }

        public async Task UpdateAsync(int id, Discount d)
        {
            await ExcuteAndSaveAsync(repo => repo.UpdateAsync(id, d));
        }

        public async Task DeleteAsync(int id)
        {
            await ExcuteAndSaveAsync(repo => repo.DeleteAsync(id));
        }
    }
}