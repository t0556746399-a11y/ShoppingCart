using System.ComponentModel.DataAnnotations;

namespace ShoppingCart.Core.Entites
{
    public class Cart
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string IdUser { get; set; }

        public int CountProduct { get; set; }

        public DateTime DateTime { get; set; } = DateTime.Now; // ערך ברירת מחדל לזמן הנוכחי

        public decimal Sum { get; set; }

        public decimal SumDiscount { get; set; }

        public List<Product> Products { get; set; } = new List<Product>();
    }
}