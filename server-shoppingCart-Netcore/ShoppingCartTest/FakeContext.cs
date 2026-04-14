//using shopeingcart;
//using ShoppingCart;

//public class FakeContext : IDataContext
//{
//    public List<Cart> carts { get; set; }
//    public List<Discount> discounts { get; set; }
//    public List<Product> products { get; set; }

//    public FakeContext()
//    {
//        carts = new List<Cart>
//            {
//                new Cart
//                {
//                    id = 103,
//                    iduser = "329544662",
//                    countproduct = 12,
//                    dateTime = new DateTime(2023, 3, 10),
//                    sum = 100,
//                    sumdiscount = 13
//                }
//            };

//        discounts = new List<Discount>
//            {
//                new Discount { id = 254, productid = 3, discountprecent = 45, discription = "Existing Discount", numindiscount = 5 }
//            };

//        products = new List<Product>
//            {
//                new Product { id = 3, price = 30, discription = "Sample Product", img = "image.png", numinstock = 100 }
//            };
//    }

//}