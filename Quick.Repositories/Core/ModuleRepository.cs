
using System;
using System.Linq;
using System.ComponentModel.Composition;
using Quick.Domain;
using System.Collections.Generic;


namespace Quick.Repositories
{
	/// <summary>
    /// 仓储操作层实现 ——
    /// </summary>
    public class ModuleRepository : EfRepositoryBase<Module>, IModuleRepository
    {

        public ModuleRepository()
            : base(new QuickDbContext())
        { }
    
    }
}
