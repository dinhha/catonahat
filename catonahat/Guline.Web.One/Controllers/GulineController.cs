using Guline.Web.One.DInject;
using Guline.Web.One.gModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Guline.Web.One.Controllers
{
    public class GulineController : Controller
    {
        protected gOrganize Organize;
        protected string sOrganize;
        public GulineController()
        {


            sOrganize = System.Web.HttpContext.Current.Request.Url.Host;

            //just for culture

            //if (System.Web.HttpContext.Current.Request.QueryString["token"] == null)
            //{
            //    if (System.Web.HttpContext.Current.Session["Organize"] != null)
            //    {
            //        Organize = (gModels.gOrganize)System.Web.HttpContext.Current.Session["Organize"];
            //    }
            //    else
            //    {
            //        System.Web.HttpContext.Current.Response.Redirect("~/", true);
            //    }
            //}

        }
        /// <summary>
        /// User đang đăng nhập
        /// </summary>
        /// <returns></returns>

        public bool IsLogin()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return false;
            }
            return true;
      
        }
        public bool IsAdmin(IUserService sc)
        {
            if (!sc.CheckRole(User.Identity.Name))
            {
                return false;
            }
            return true;

        }
        public bool IsSystemAdminRole(IUserService sc)
        {
            if (IsLogin())
            {
                return IsAdmin(sc);
            }
            return false;
        }
    }
}
