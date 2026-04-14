//using Microsoft.AspNetCore.Http.HttpResults;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Mvc.RazorPages;
//using shopeingcart;
//using ShoppingCart.Controllers;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace ShoppingCartTest
//{
//    public class ProductControllerTest
//    {
//        private FakeContext fakeContext = new FakeContext();

//        [Fact]
//        public void Get_ReturnOk()
//        {
//            var id = 3;
//            var controller = new ProductController(fakeContext);

//            var result = controller.Get(id);
//            Assert.IsType<OkObjectResult>(result);
//        }

//        [Fact]
//        public void Get_ReturnNotFound()
//        {
//            var id = 2;
//            var controller = new ProductController(fakeContext);
//            var result = controller.Get(id);
//            Assert.IsType<NotFoundResult>(result);
//        }
//        [Fact]
//        public void Post_NewProductReturnsOkWithNull()
//        {
//            var controller = new ProductController(fakeContext);
//            var newProduct = new Product { id = 2, price = 10, discription = "מוצר חדש", img = "img2", numinstock = 5 };
//            var result = controller.Post(newProduct);
//            Assert.IsType<OkObjectResult>(result);
//            Assert.Null(((OkObjectResult)result).Value);
//            Assert.Equal(2, fakeContext.products.Count);
//            Assert.True(fakeContext.products.Any(p => p.id == 2));
//        }
//        [Fact]
//        public void Post_ExistingProduct_ReturnsConflict()
//        {           
//            var controller = new ProductController(fakeContext);
//            var existingProduct = new Product { id = 3, price = 50, discription = "קיים", img = "img", numinstock = 100 };            // Act
//            var result = controller.Post(existingProduct);
//            Assert.IsType<ConflictResult>(result);
//            Assert.Equal(1, fakeContext.products.Count); 
//        }
//        [Fact]
//        public void PutDetails_ExistingId_UpdatesProductDetails()
//        {          
//            var controller = new ProductController(fakeContext);
//            var existingId = 3;
//            var newDescription = "תיאור חדש";
//            var updatedProduct = new Product
//            {
//                id = existingId,
//                price = 150.75,
//                discription = newDescription,
//                img = "new_img",
//                numinstock = 500
//            };
//            controller.Put(existingId, updatedProduct);
//            var productInList = fakeContext.products.Find(p => p.id == existingId);
//            Assert.Equal(newDescription, productInList.discription);
//            Assert.Equal(150.75, productInList.price);
//        }
//        [Fact]
//        public void PutCount_ExistingId_UpdatesStockCorrectly()
//        {           
//            var controller = new ProductController(fakeContext);
//            var existingId = 3;
//            var initialStock = fakeContext.products.Find(p => p.id == existingId).numinstock; 
//            var countToAdd = 5;           
//            controller.Put(existingId, countToAdd);            
//            var productInList = fakeContext.products.Find(p => p.id == existingId);
//            Assert.Equal(initialStock + countToAdd, productInList.numinstock);
//        }
//        [Fact]
//        public void Delete_NonExistingId_ReturnsNotFound()
//        {
//            var controller = new ProductController(fakeContext);
//            var nonExistingId = 99;
//            var result = controller.Delete(nonExistingId);

//            Assert.IsType<NotFoundResult>(result); 
//            Assert.Single(fakeContext.products); 
//        }
//        [Fact]
//        public void Delete_NonExistingId_ReturnsBadRequest()
//        {
//            var controller = new ProductController(fakeContext);
//            var nonExistingId = -1; 
//            var result = controller.Delete(nonExistingId);

//            Assert.IsType<BadRequestResult>(result); 
//            Assert.Single(fakeContext.products);
//        }
//    }
//}
        
