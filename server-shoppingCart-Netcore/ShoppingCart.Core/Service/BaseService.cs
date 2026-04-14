using ShoppingCart.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoppingCart.Core.Service
{
    public abstract class BaseService<T,TRepository>
        where T : class
        where TRepository:IRepository<T>
    {
        protected readonly TRepository _repository;
        protected BaseService(TRepository repository)
        {
            _repository = repository;
        }
        protected async Task ExcuteAndSaveAsync(Action<TRepository> operation)
        {
            operation(_repository);
            await _repository.SaveAsync();
        }
        protected async Task<TResult> ExcuteAndSaveAsync<TResult>(Func<TRepository, TResult> operation)
        {
            var result = operation(_repository);
            await _repository.SaveAsync();
            return result;
        }

    }
}
