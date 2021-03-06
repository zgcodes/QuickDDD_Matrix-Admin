﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Application.Services.Dto
{
    /// <summary>
    /// 查询参数基类（查询、分页、排序）
    /// </summary>
    public class QueryRequestInput
    {

        public QueryRequestInput()
        {
            pageNumber = 1;
            pageSize = 10;
        }

        public string Keywords { get; set; }//搜索关键词

        /// <summary>
        /// 分页时跳过几行
        /// </summary>
        public int iDisplayStart { get { return pageSize * (pageNumber - 1); } }

        public int pageSize { get; set; }//每页行数

        public int pageNumber { get; set; }//当前页是第几页

        public string order { get; set; }//排序方式（升，降）

        /// <summary>
        /// 列数
        /// </summary>
        public int iColumns { get; set; }

        /// <summary>
        /// 排序列的数量
        /// </summary>
        public int iSortingCols { get; set; }

        /// <summary>
        /// 逗号分割所有的列
        /// </summary>
        public string sColumns { get; set; }

        public virtual DateTime? StartTime { get; set; }

        public virtual DateTime? EndTime { get; set; }

    }
}
