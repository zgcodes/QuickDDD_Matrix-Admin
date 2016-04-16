using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System.IO;

namespace Quick.Resources.Web.Controllers
{
    public class UploaderController : Controller
    {

        public UploaderController()
        {
        }

        public ViewResult Index()
        {
            return View();
        }

        public string UploadImage()
        {
            HttpPostedFileBase uploadFile = Request.Files[0];
            string fileName = uploadFile.FileName;
            int fileSize = uploadFile.ContentLength;
            string fileExt = Path.GetExtension(fileName).ToLower();
            string message = "";
            if (!(fileExt == ".png" || fileExt == ".gif" || fileExt == ".jpg" || fileExt == ".jpeg"))
            {
                message = "图片类型只能为gif,png,jpg,jpeg";
                return message;
            }
            else
            {
                if (fileSize > (int)(5000 * 1024))
                {
                    message = "图片大小不能超过5000KB";
                    return message;
                }
                else
                {
                    Random r = new Random();
                    string uploadFileName = DateTime.Now.ToString("yyyyMMddhhmmss") + r.Next(100000, 999999) + fileExt;
                    try
                    {
                        string directoryPath = Server.MapPath("~/UploadImages/");
                        if (!Directory.Exists(directoryPath))//不存在这个文件夹就创建这个文件夹 
                        {
                            Directory.CreateDirectory(Server.MapPath("~/UploadImages/"));
                        }
                        uploadFile.SaveAs(Server.MapPath("~/UploadImages/") + uploadFileName);
                        message = uploadFileName;
                        return message;
                    }
                    catch (Exception ex)
                    {
                        message = ex.Message;
                        return message;
                    }
                }
            }
        }
    }
}