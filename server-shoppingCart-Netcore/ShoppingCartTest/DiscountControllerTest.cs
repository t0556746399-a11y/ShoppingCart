//using Microsoft.AspNetCore.Mvc;
//using shopeingcart;
//using ShoppingCart.Controllers;
//using System.Collections.Generic;
//using System.Linq;
//using Xunit;
//using System; // נחוץ אם FakeContext משתמש ב-DateTime

//namespace ShoppingCartTest
//{
//    public class DiscountControllerTest
//    {
//        private FakeContext fakeContext;

//        // הקונסטרקטור דואג שכל בדיקה תקבל מופע חדש ונקי של FakeContext
//        public DiscountControllerTest()
//        {
//            fakeContext = new FakeContext();
//        }

//        [Fact]
//        public void Get_ReturnsAllDiscounts()
//        {
//            // Arrange: הקונטקסט נקי ומתחיל עם הנחה אחת (254) כפי שהוגדר ב-FakeContext
//            var controller = new DiscountController(fakeContext);

//            // Act
//            var result = controller.Get();

//            var okResult = Assert.IsType<ActionResult<IEnumerable<Discount>>>(result);
//            var discounts = Assert.IsAssignableFrom<IEnumerable<Discount>>(okResult.Value);

//            // Assert
//            // מצפים שתהיה בדיוק הנחה אחת
//            Assert.Single(discounts);
//        }

//        [Fact]
//        public void Get_ReturnsNotFound_WhenDiscountDoesNotExist()
//        {
//            var controller = new DiscountController(fakeContext);
//            var result = controller.Get(235);
//            Assert.IsType<NotFoundResult>(result);
//        }

//        [Fact]
//        public void Post_CreatesNewDiscount()
//        {
//            // Arrange: מתחיל עם 1 הנחה
//            var controller = new DiscountController(fakeContext);
//            // נשתמש ב-ID שלא קיים (כגון 2)
//            var newDiscount = new Discount { id = 2, productid = 3, discountprecent = 20, discription = "חדש", numindiscount = 10 };
//            var initialCount = fakeContext.discounts.Count; // initialCount = 1

//            // Act
//            var result = controller.Post(newDiscount);

//            // Assert
//            Assert.IsType<OkObjectResult>(result);
//            // מוודא שהספירה עלתה ב-1 (1 + 1 = 2)
//            Assert.Equal(initialCount + 1, fakeContext.discounts.Count);
//            Assert.True(fakeContext.discounts.Any(d => d.id == 2));
//        }

//        [Fact]
//        public void Post_ExistingDiscount_ReturnsConflict()
//        {
//            var controller = new DiscountController(fakeContext);
//            // ננסה להוסיף את הנחה 254 שכבר קיימת ב-FakeContext
//            var existingDiscount = new Discount { id = 254, productid = 1, discountprecent = 15, discription = "קיים", numindiscount = 5 };
//            var result = controller.Post(existingDiscount);
//            Assert.IsType<ConflictResult>(result);
//        }

//        [Fact]
//        public void Put_UpdatesExistingDiscount()
//        {
//            var controller = new DiscountController(fakeContext);
//            var updatedDiscount = new Discount { id = 254, productid = 3, discountprecent = 50, discription = "Updated Description", numindiscount = 3 };
//            var result = controller.Put(254, updatedDiscount);
//            Assert.IsType<NoContentResult>(result);

//            var discountInList = fakeContext.discounts.Find(d => d.id == 254);
//            Assert.Equal(50, discountInList.discountprecent);
//            Assert.Equal("Updated Description", discountInList.discription);
//        }

//        [Fact]
//        public void Put_NonExistingDiscount_ReturnsNotFound()
//        {
//            var controller = new DiscountController(fakeContext);
//            var updatedDiscount = new Discount { id = 999, productid = 1, discountprecent = 50, discription = "מעודכן", numindiscount = 3 };
//            var result = controller.Put(999, updatedDiscount);
//            Assert.IsType<NotFoundResult>(result);
//        }

//        [Fact]
//        public void Delete_ExistingDiscount_ReturnsNoContent()
//        {
//            var controller = new DiscountController(fakeContext);
//            var discountIdToDelete = 254; // ID קיים ב-FakeContext

//            // Act
//            var result = controller.Delete(discountIdToDelete);

//            // Assert
//            Assert.IsType<NoContentResult>(result);

//            // *** תיקון לוגי: מוודא שה-ID הנכון (254) הוסר ***
//            Assert.DoesNotContain(fakeContext.discounts, d => d.id == discountIdToDelete);
//        }

//        [Fact]
//        public void Delete_NonExistingDiscount_ReturnsNotFound()
//        {
//            var controller = new DiscountController(fakeContext);
//            var result = controller.Delete(999);
//            // מחיקת פריט לא קיים צריכה להחזיר NotFound (404)
//            Assert.IsType<NotFoundResult>(result);
//        }

//        [Fact]
//        public void Get_ReturnsDiscount_WhenDiscountExists()
//        {
//            var controller = new DiscountController(fakeContext);
//            var result = controller.Get(254);
//            var okResult = Assert.IsType<OkObjectResult>(result);
//            var discount = Assert.IsType<Discount>(okResult.Value);

//            // *** תיקון קל ב-Assert: מוודא שה-ID שהוחזר הוא 254 ***
//            Assert.Equal(254, discount.id);
//        }

//        [Fact]
//        public void Post_NonUniqueDiscountId_ReturnsConflict()
//        {
//            var controller = new DiscountController(fakeContext);

//            // 254 כבר קיים. נוסיף 234 באופן זמני כדי לבדוק קונפליקט חוזר
//            var uniqueDiscount = new Discount { id = 234, productid = 1, discountprecent = 10, discription = "קיים", numindiscount = 2 };
//            controller.Post(uniqueDiscount);

//            // ננסה להוסיף שוב 234
//            var newDiscount = new Discount { id = 234, productid = 2, discountprecent = 15, discription = "חדש", numindiscount = 5 };
//            var result = controller.Post(newDiscount);

//            Assert.IsType<ConflictResult>(result);
//        }

//        [Fact]
//        public void Get_ReturnsDiscount_WhenDiscountIdExists()
//        {
//            var controller = new DiscountController(fakeContext);
//            var result = controller.Get(254);
//            var okResult = Assert.IsType<OkObjectResult>(result);
//            var discount = Assert.IsType<Discount>(okResult.Value);

//            // *** תיקון קל ב-Assert: מוודא שה-ID שהוחזר הוא 254 ***
//            Assert.Equal(254, discount.id);
//        }
//    }
//}