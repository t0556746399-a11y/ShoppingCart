using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoppingCart.Core.DTOs
{
    public class DiscountDTO
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public int NumInDiscount { get; set; }
        public double DiscountPercent { get; set; }
        public int ProductId { get; set; }

    }
}
