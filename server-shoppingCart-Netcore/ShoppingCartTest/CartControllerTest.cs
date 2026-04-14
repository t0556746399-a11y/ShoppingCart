//using Microsoft.AspNetCore.Mvc;
//using shopeingcart;
//using ShoppingCart.Controllers;
//using System.Collections.Generic;
//using System.Linq;
//using Xunit;

//namespace ShoppingCartTest
//{
//    public class CartControllerTest
//    {
//        private readonly FakeContext fakeContext;
//        private readonly CartController _controller;

//        public CartControllerTest()
//        {
//            fakeContext = new FakeContext();
//            _controller = new CartController(fakeContext);
//        }
//        [Fact]
//        public void Get_ReturnsAllCarts()
//        {
//            // Arrange: 
//            // כדי למנוע השפעה של Post_CreatesNewCart, 
//            // ננקה את ה-Context ונוסיף רק את העגלה המקורית
//            fakeContext.carts.Clear();
//            fakeContext.carts.Add(new Cart
//            {
//                id = 103,
//                iduser = "329544662",
//                // ... שאר הפרטים 
//                listproduct = new List<Product>()
//            });

//            // Act
//            var result = _controller.Get();
//            var allCarts = Assert.IsType<List<Cart>>(result); // ודא שהסוג הוא List<Cart> אם זה מה שבאמת חוזר

//            // Assert
//            // מצפים שתהיה בדיוק עגלה אחת לאחר האיפוס וההוספה מחדש
//            Assert.Single(allCarts);
//        }
//        [Fact]
//        public void Get_ReturnsCart_WhenCartExists()
//        {
//            var existingCartId = 103;

//            // Act
//            var result = _controller.Get(existingCartId);

//            // Assert
//            var okResult = Assert.IsType<OkObjectResult>(result.Result); // Get מחזירה ActionResult<Cart>
//            var cart = Assert.IsType<Cart>(okResult.Value);
//            Assert.Equal(existingCartId, cart.id);
//        }

//        [Fact]
//        public void Get_ReturnsNotFound_WhenCartDoesNotExist()
//        {
//            // Act
//            var result = _controller.Get(100);

//            // Assert
//            // יש לבדוק את המאפיין .Result של ActionResult<Cart>
//            Assert.IsType<NotFoundResult>(result.Result);
//        }

//        [Fact]
//        public void Post_CreatesNewCart()
//        {
//            // Arrange
//            var newCart = new Cart { id = 1, iduser = "123456789" }; // ID=1 לא קיים
//            var initialCount = fakeContext.carts.Count; // אמור להיות 1 (מ-FakeContext)

//            // Act
//            var result = _controller.Post(newCart);

//            // Assert
//            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
//            var createdCart = Assert.IsType<Cart>(createdResult.Value);

//            // 1. ודא שהעגלה נוספה ל-FakeContext (כמות: 1 + 1 = 2)
//            Assert.Equal(initialCount + 1, fakeContext.carts.Count);

//            // 2. ודא שה-ID שהתקבל תואם
//            Assert.Equal(1, createdCart.id);
//        }
//        [Fact]
//        public void GetProductsInCart_ReturnsProducts_WhenCartExists()
//        {
//            // Arrange
//            var cartId = 500; // שימוש ב-ID ייחודי כדי לא לשבור את עגלה 103
//            var product = fakeContext.products.First(); // מוצר ID=3

//            // יצירת עגלה חדשה ומותחלת עם המוצר
//            var cart = new Cart { id = cartId, listproduct = new List<Product> { product } };
//            fakeContext.carts.Add(cart); // הוספת העגלה הזו ל-Context

//            // Act
//            var result = _controller.GetProductsInCart(cartId); // נבדוק את העגלה החדשה

//            // Assert
//            var okResult = Assert.IsType<OkObjectResult>(result.Result);
//            var products = Assert.IsType<List<Product>>(okResult.Value);
//            Assert.Single(products);
//            Assert.Equal(3, products.First().id);

//            // ניקוי: ניתן למחוק את העגלה שהוספנו לאחר הבדיקה כדי לעזור בניקיון
//            // fakeContext.carts.Remove(cart); 
//        }

//        [Fact]
//        public void GetProductsInCart_ReturnsNotFound_WhenCartDoesNotExist()
//        {
//            // Act
//            var result = _controller.GetProductsInCart(999);

//            // Assert
//            Assert.IsType<NotFoundObjectResult>(result.Result);
//        }

//        [Fact]
//        public void Post_ExistingCart_ReturnsBadRequest()
//        {
//            // Arrange: נשתמש בעגלה 103 שכבר קיימת ב-FakeContext
//            var existingCart = new Cart { id = 103, iduser = "329544662" };
//            // אין צורך להוסיף אותה שוב ל-fakeContext.carts.Add(existingCart);

//            // Act
//            var result = _controller.Post(existingCart);

//            // Assert
//            // יש לבדוק את המאפיין .Result של ActionResult<Cart>
//            Assert.IsType<BadRequestObjectResult>(result.Result);
//        }

//        [Fact]
//        public void Delete_ExistingCart_ReturnsNoContent()
//        {
//            // Arrange: ודא שיש רק את העגלה שאותה אנו בודקים
//            fakeContext.carts.Clear();
//            var cartIdToDelete = 103;
//            var existingCart = new Cart { id = cartIdToDelete };
//            fakeContext.carts.Add(existingCart);

//            // Act
//            var result = _controller.Delete(cartIdToDelete);

//            // Assert
//            Assert.IsType<NoContentResult>(result);
//            Assert.Empty(fakeContext.carts);
//        }

//        [Fact]
//        public void Delete_NonExistingCart_ReturnsNotFound()
//        {
//            var result = _controller.Delete(999);
//            Assert.IsType<NotFoundObjectResult>(result);
//        }

//        //[Fact]
//        //public void AddProductToCart_AddsProductSuccessfully()
//        //{
//        //    var productId = 1;
//        //    var cartId = 100;

//        //    fakeContext.products.Add(new Product { id = productId, price = 30, discription = "Test Product", img = "image.png", numinstock = 10 });
//        //    var cart = new Cart { id = cartId, listproduct = new List<Product>() };
//        //    fakeContext.carts.Add(cart);

//        //    var result = _controller.AddProductToCart(cartId, productId);

//        //    var okResult = Assert.IsType<OkObjectResult>(result);
//        //    var updatedCart = Assert.IsType<Cart>(okResult.Value);
//        //    Assert.Equal(1, updatedCart.listproduct.Count);
//        //}

//        //[Fact]
//        //public void AddProductToCart_ProductNotFound_ReturnsNotFound()
//        //{
//        //    var result = _controller.AddProductToCart(100, 999);
//        //    Assert.IsType<NotFoundObjectResult>(result);
//        //}

//        //    [Fact]
//        //    public void RemoveProductFromCart_RemovesProductSuccessfully()
//        //    {
//        //        var product = new Product { id = 2 };
//        //        var cart = new Cart { id = 100, listproduct = new List<Product> { product } };
//        //        fakeContext.carts.Add(cart);
//        //        var result = _controller.RemoveProductFromCart(100, 2);
//        //        Assert.IsType<OkObjectResult>(result);
//        //        Assert.Empty(cart.listproduct);
//        //    }

//        //    [Fact]
//        //    public void RemoveProductFromCart_ProductNotFound_ReturnsNotFound()
//        //    {
//        //        var cart = new Cart { id = 100, listproduct = new List<Product> { new Product { id = 2 } } };
//        //        fakeContext.carts.Add(cart);
//        //        var result = _controller.RemoveProductFromCart(100, 999);
//        //        Assert.IsType<NotFoundObjectResult>(result);
//        //    }
//    }
//}