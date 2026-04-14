using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingCart.Core.DTOs;
using ShoppingCart.Core.Entites;
using ShoppingCart.Core.Service;
using ShoppingCart.Models;

[Route("api/[controller]")]
[ApiController]
public class DiscountController : ControllerBase
{
    private readonly IDiscountService _discountService;
    private readonly IMapper _mapper;

    public DiscountController(IDiscountService discountService, IMapper mapper)
    {
        _discountService = discountService;
        _mapper = mapper;
    }

    [HttpGet]
    [AllowAnonymous]

    public async Task<ActionResult<IEnumerable<DiscountDTO>>> Get()
    {
        var discounts = await _discountService.GetAsync();
        var discountsDto = _mapper.Map<IEnumerable<DiscountDTO>>(discounts);
        return Ok(discountsDto);
    }
    [HttpGet("{id}")]
    [AllowAnonymous]

    public async Task<ActionResult<DiscountDTO>> GetById(int id)
    {
        var discount = await _discountService.GetByIdAsync(id);
        if (discount == null) return NotFound();

        var dto = _mapper.Map<DiscountDTO>(discount);
        return Ok(dto);
    }
    [HttpPost]
    [Authorize(Roles = "manager")]
    public async Task<ActionResult> Post([FromBody] DiscountPostModel model)
    {
        var discountEntity = _mapper.Map<Discount>(model);
        await _discountService.AddAsync(discountEntity);
        var dto = _mapper.Map<DiscountDTO>(discountEntity);
        return CreatedAtAction(nameof(GetById), new { id = discountEntity.Id }, dto);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "manager")]
    public async Task<ActionResult> Put(int id, [FromBody] DiscountPostModel model)
    {
        var existing = await _discountService.GetByIdAsync(id);
        if (existing == null) return NotFound();

        _mapper.Map(model, existing);
        await _discountService.UpdateAsync(id, existing);
        return NoContent();
    }
}