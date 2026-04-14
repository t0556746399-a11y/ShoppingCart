using ShoppingCart.Core.Entites;
using ShoppingCart.Core.Repositories;
using ShoppingCart.Core.Service;

namespace ShoppingCart.Service
{
    public class CartService : BaseService<Cart, ICartRepository>, ICartService, ICartProductService
    {
        public CartService(ICartRepository cartRepository) : base(cartRepository)
        {
        }

        public async Task<List<Cart>> GetAllAsync() => await _repository.GetAllAsync();

        public async Task<Cart> GetCartByIdAsync(int id) => await _repository.GetByIdAsync(id);

        public async Task AddAsync(Cart newCart)
        {
            await ExcuteAndSaveAsync(repo => repo.Add(newCart));
        }

        public async Task ClearCartAsync(int id)
        {
            await ExcuteAndSaveAsync(repo => repo.ClearCartAsync(id));
        }

        public async Task<List<Product>> GetProductsInCartAsync(int cartId)
            => await _repository.GetProductsInCartAsync(cartId);

        public async Task AddProductToCartAsync(int cartId, int productId)
        {
            await ExcuteAndSaveAsync(repo => repo.AddProductToCartAsync(cartId, productId));
        }

        public async Task RemoveProductFromCartAsync(int cartId, int productId)
        {
            await ExcuteAndSaveAsync(repo => repo.RemoveProductFromCartAsync(cartId, productId));
        }

    }
}