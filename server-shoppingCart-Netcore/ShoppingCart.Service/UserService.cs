using ShoppingCart.Core.Entites;
using ShoppingCart.Core.Repositories;
using ShoppingCart.Core.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoppingCart.Service
{
    public class UserService : BaseService<User,IUserRepository>, IUserService
    {
        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository userRepository):base(userRepository) 
        {
            _userRepository = userRepository;
        }

        public async Task<User> GetByUserNameAsync(string userName, string Password)
        {
            return await _userRepository.GetByUserNameAsync(userName, Password);
        }

        public async Task<User> AddUserAsync(User user)
        {
            return await ExcuteAndSaveAsync(repo =>
            {
                repo.Add(user); 
                return user;   
            });
        }

    }
}
