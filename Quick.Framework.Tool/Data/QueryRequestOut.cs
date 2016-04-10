using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Quick.Framework.Tool
{
   
    public class QueryRequestOut<T>
    {

        public int pageCount { get; set; }//行数

        public T[] pageData { get; set; }//数据

    }
}
