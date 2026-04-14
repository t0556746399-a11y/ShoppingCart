using AutoMapper;
using ShoppingCart.Core.DTOs;
using ShoppingCart.Core.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ShoppingCart.Models;

namespace ShoppingCart.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // --- DTOs (עבור שליפת נתונים - GET) ---
            CreateMap<Cart, CartDTO>().ReverseMap();
            CreateMap<Product, ProductDTO>().ReverseMap();
            CreateMap<Discount, DiscountDTO>().ReverseMap();

            // --- PostModels (עבור יצירה/עדכון - POST/PUT) ---
            CreateMap<Cart, CartPostModel>().ReverseMap();
            CreateMap<Product, ProductPostModel>().ReverseMap();
            CreateMap<Discount, DiscountPostModel>().ReverseMap();
        }
    }
}
