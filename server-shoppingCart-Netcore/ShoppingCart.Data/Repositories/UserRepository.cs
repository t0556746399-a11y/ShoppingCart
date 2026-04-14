using Microsoft.EntityFrameworkCore;
using ShoppingCart.Core.Entites;
using ShoppingCart.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoppingCart.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly dataContext _dataContext;
        public UserRepository(dataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<User> GetByUserNameAsync(string userName, string Password)
        {
            return await _dataContext.Users.FirstOrDefaultAsync(u => u.UserName == userName && u.Password == Password);
        }

       
        public void Add(User entity)
        {
            _dataContext.Users.Add(entity);
        }

        public async Task SaveAsync()
        {
            await _dataContext.SaveChangesAsync();
        }
    }
}
