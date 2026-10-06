using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingCart.Core.DTOs;
using ShoppingCart.Core.Entites;
using ShoppingCart.Core.Service;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;
    private readonly ICartProductService _cartProductService; 
    private readonly IMapper _mapper;

    public CartController(ICartService cartService, ICartProductService cartProductService, IMapper mapper)
    {
        _cartService = cartService;
        _cartProductService = cartProductService;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<CartDTO>> GetMyCart()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var allCarts = await _cartService.GetAllAsync();
        var userCart = allCarts.FirstOrDefault(c => c.IdUser == userId);

        if (userCart == null)
        {
            userCart = new Cart { IdUser = userId, DateTime = DateTime.Now };
            await _cartService.AddAsync(userCart);
        }

        return Ok(_mapper.Map<CartDTO>(userCart));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCart(int id)
    {
        await _cartService.ClearCartAsync(id);
        return Ok();
    }

    [HttpPut("{cartId}/product/{productId}")]
    public async Task<ActionResult> AddProduct(int cartId, int productId)
    {
        await _cartProductService.AddProductToCartAsync(cartId, productId);
        return Ok();
    }

    [HttpDelete("{cartId}/product/{productId}")]
    public async Task<ActionResult> RemoveProduct(int cartId, int productId)
    {
        await _cartProductService.RemoveProductFromCartAsync(cartId, productId);
        return Ok();
    }
}