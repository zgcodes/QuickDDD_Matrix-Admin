using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Quick.Application
{
    /// <summary>
    /// 用于查询首页按钮
    /// </summary>
    public class GetUserPermissionInput
	{
		public IList<int> RoleIdList { get; set; }

        public string Controller { get; set; }

        public string Action { get; set; }

	}
}
