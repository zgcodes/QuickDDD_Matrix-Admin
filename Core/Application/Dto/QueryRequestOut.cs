
namespace Core.Application.Services.Dto
{
   
    public class QueryRequestOut<T>
    {

        public int pageCount { get; set; }//行数

        public T[] pageData { get; set; }//数据

    }
}
