using ShoppingCart.Core.Entites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoppingCart.Core.Repositories
{
    public interface IUserRepository:IRepository<User>
    {
        public Task<User> GetByUserNameAsync(string UserName, string Password);
    }
}
