using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingCart.Core.DTOs;
using ShoppingCart.Core.Entites;
using ShoppingCart.Core.Service;
using ShoppingCart.Models;

[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IMapper _mapper;

    public ProductController(IProductService productService, IMapper mapper)
    {
        _productService = productService;
        _mapper = mapper;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<ProductDTO>>> Get()
    {
        var list = await _productService.GetAsync();
        return Ok(_mapper.Map<IEnumerable<ProductDTO>>(list));
    }

    [HttpGet("desc/{description}")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<ProductDTO>>> GetByDescription(string description)
    {
        var products = await _productService.GetByDescriptionAsync(description);
        if (products == null || !products.Any()) return NotFound("לא נמצאו מוצרים");
        return Ok(_mapper.Map<IEnumerable<ProductDTO>>(products));
    }

    [HttpPost]
    [Authorize(Roles = "manager")]
    public async Task<ActionResult> Post([FromBody] ProductPostModel value)
    {
        if (string.IsNullOrWhiteSpace(value.Description)) return BadRequest("תיאור ריק");

        var existing = await _productService.GetByDescriptionAsync(value.Description);
        if (existing != null && existing.Any()) return Conflict("המוצר כבר קיים");

        var entity = _mapper.Map<Product>(value);
        await _productService.AddAsync(entity);
        return Ok(entity);
    }

    [HttpPut("{id}/count")]
    [AllowAnonymous]
    public async Task<ActionResult> UpdateStock(int id, [FromQuery] int count)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product == null) return NotFound();

        if (product.NumInStock + count < 0) return BadRequest("אין מספיק מלאי");

        await _productService.UpdateStockAsync(id, count);
        return Ok();
    }
}