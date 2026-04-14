using System.ComponentModel.DataAnnotations;
namespace ShoppingCart.Core.Entites
{

    public class Discount
    {
        [Key]
        public int Id { get; set; }
        public string Description { get; set; }
        public int NumInDiscount { get; set; }
        public double DiscountPercent { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }
    }
}