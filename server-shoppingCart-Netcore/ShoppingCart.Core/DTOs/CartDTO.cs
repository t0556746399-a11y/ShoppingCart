using ShoppingCart.Core.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoppingCart.Core.DTOs
{
    public class CartDTO
    {
        public int Id { get; set; }
        public string IdUser { get; set; }
        public int CountProduct { get; set; }
        public DateTime DateTime { get; set; }
        public decimal Sum { get; set; }
        public decimal SumDiscount { get; set; }

        public List<Product> Products { get; set; }
    }
}
