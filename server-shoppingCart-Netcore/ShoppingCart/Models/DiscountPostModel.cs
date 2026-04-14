using ShoppingCart.Core.Entites;
namespace ShoppingCart.Models
{
    public class DiscountPostModel
    {
        public string Description { get; set; }
        public int NumInDiscount { get; set; }
        public double DiscountPercent { get; set; }

        // מפתח זר למוצר
        public int ProductId { get; set; }
    }
}
