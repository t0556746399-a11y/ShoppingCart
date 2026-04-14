using Microsoft.EntityFrameworkCore;
using ShoppingCart.Core.Entites;
using ShoppingCart.Core.Repositories;

namespace ShoppingCart.Data.Repositories
{
    public class CartRepository : ICartRepository
    {
        private readonly dataContext _context;

        public CartRepository(dataContext context)
        {
            _context = context;
        }

        public async Task<List<Cart>> GetAllAsync()
        {
            return await _context.Carts.Include(c => c.Products).ToListAsync();
        }

        public async Task<Cart> GetByIdAsync(int id)
        {
            return await _context.Carts.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id);
        }

        /// <summary>
        /// Clears all products from a cart without deleting the cart itself.
        /// Resets cart totals and returns stock for all products.
        /// </summary>
        public async Task ClearCartAsync(int id) 
        {
            var cart = await _context.Carts.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id);
            if (cart != null)
            {
                foreach (var product in cart.Products)
                {
                    product.NumInStock++;
                }

                cart.Products.Clear();
                cart.CountProduct = 0;
                cart.Sum = 0;
                cart.SumDiscount = 0;

                await SaveAsync();
            }
        }
        private async Task RecalculateCartTotalsAsync(Cart cart)
        {
            cart.CountProduct = cart.Products.Count;
            cart.Sum = cart.Products.Sum(p => (decimal)p.Price);
            await SaveAsync();
        }

        public async Task AddProductToCartAsync(int cartId, int productId)
        {
            var cart = await _context.Carts.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == cartId);
            var product = await _context.Products.FindAsync(productId);

            if (cart != null && product != null && product.NumInStock > 0)
            {
                cart.Products.Add(product);
                product.NumInStock--;
                await RecalculateCartTotalsAsync(cart);
            }
        }

        public async Task RemoveProductFromCartAsync(int cartId, int productId)
        {
            var cart = await _context.Carts.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == cartId);
            if (cart != null)
            {
                var product = cart.Products.FirstOrDefault(p => p.Id == productId);
                if (product != null)
                {
                    cart.Products.Remove(product);
                    product.NumInStock++;
                    await RecalculateCartTotalsAsync(cart);
                }
            }
        }

        public void Add(Cart newCart) => _context.Carts.Add(newCart);
        public async Task SaveAsync() => await _context.SaveChangesAsync();
        public async Task<List<Product>> GetProductsInCartAsync(int cartId) { var c = await GetByIdAsync(cartId); return c?.Products ?? new List<Product>(); }
    }
}