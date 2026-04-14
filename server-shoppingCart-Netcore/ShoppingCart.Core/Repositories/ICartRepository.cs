using ShoppingCart.Core.Entites;

namespace ShoppingCart.Core.Repositories
{
    public interface ICartRepository : IRepository<Cart>
    {
        Task<List<Cart>> GetAllAsync();
        Task<Cart> GetByIdAsync(int id);
        Task ClearCartAsync(int id); 
        Task<List<Product>> GetProductsInCartAsync(int cartId); // נוסף
        Task AddProductToCartAsync(int cartId, int productId);
        Task RemoveProductFromCartAsync(int cartId, int productId);
    }
}