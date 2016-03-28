using System.Web;
using System.Web.Optimization;

namespace Quick.WebUI.Admin
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            //        //公用样式
            bundles.Add(new StyleBundle("~/css/base").Include(
                      "~/content/bootstrap.css",
                      "~/content/bootstrap-theme.css",
                      "~/css/modal/bootstrap-modal-bs3patch.css",
                      "~/css/modal/bootstrap-modal.css",
                      "~/css/modal/modal.css",
                      "~/content/font-awesome.css",
                      "~/css/site.css"
                      ));


            //        //每个文件都引用的基础样式
            bundles.Add(new ScriptBundle("~/js/base").Include(
                        "~/scripts/jquery-1.11.3.js",
                        "~/scripts/bootstrap.js",
                        "~/scripts/juicer.js",
                        "~/js/site.js",
                        "~/scripts/jquery-ui.js",
                        "~/js/modal/bootstrap-modal.js",
                         "~/js/modal/bootstrap-modalmanager.js",
                        "~/js/modal/bootbox.js",
                         "~/js/site-dialog.js"
                        ));


            //        //列表页面需引用的js
            bundles.Add(new ScriptBundle("~/js/datatables").Include(
                        "~/scripts/jquery-ui.js",
                        "~/scripts/jqueryDataTables/jquery.dataTables.js",
                        "~/scripts/jqueryDataTables/dataTables.bootstrap.js",
                        "~/scripts/jqueryDataTables/plugin/dataTables.colVis.js",
                        "~/scripts/jqueryDataTables/plugin/dataTables.colReorder.js",
                         "~/scripts/bootstrap-editable.js",
                         "~/js/site-utils.js",
                         "~/js/site-jquery-tables.js"
                        ));

            //        //表单页面需引用的js
            bundles.Add(new ScriptBundle("~/js/form").Include(
                      "~/scripts/jquery.validate.js",
                      "~/js/site-form.js",
                      "~/js/site-validate.js"));
        }
    }
}