using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Guline.Web.One.Controllers;
using Guline.Web.One.DInject;
using System.Net.Mail;
using Guline.Web.One.gModels;
using Newtonsoft.Json;
using System.Web.Script.Serialization;
using System.Text.RegularExpressions;

namespace Guline.Web.One.Areas.Api.Controllers
{

    public class ObjectController : GulineController
    {
        private IObjectGroup sc;
        private readonly IUserService _userService;
        public ObjectController(IObjectGroup service, IUserService userservice)
        {
            sc = service;
            this.Organize = sc.getOrganize(this.sOrganize);
            _userService = userservice;
        }
        public ActionResult getAppConfig()
        {
           
            gModels.Cart cart = null;
            if (Session["Cart"] != null)
            {

                cart = (gModels.Cart)Session["Cart"];
            }
            else
            {
                cart = new Cart();

            }
            gModels.User u = null;
            if (User.Identity.IsAuthenticated)
            {

                u = _userService.GetUserByEmail(User.Identity.Name);
            }
            return Json(new { success = true, ShoppingCart = cart, config = sc.getOneObject("config", Organize.ID), menus = sc.getListObject("Product",null,null,1,12, Organize.ID), User = u, ProvinceList = sc.GetListProvince() }, JsonRequestBehavior.AllowGet);
          

        }
        public ActionResult GetListOrder(string objectname, string orderbys, long parentid = 0, int cpage = 1, int cpageitem = 12)
        {
            var listobjects = sc.GetListOrder(objectname, parentid, orderbys, cpage, cpageitem, Organize.ID);
            return Json(new { success = true, data = listobjects }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult ListObject(int page = 1, int pagesize = 10)
        {
            if (!IsSystemAdminRole(_userService))
            {
                return Json(new { success = false, auth = false, msg = "Bạn chưa đăng nhập hoặc không quyền hạn này." }, JsonRequestBehavior.AllowGet);
            }
            var listobjects = sc.Listing(page, pagesize, Organize.ID);
            var user = _userService.GetUserByEmail(User.Identity.Name);
            return Json(new { success = true, Data = listobjects, Username = User.Identity.Name, user = user }, JsonRequestBehavior.AllowGet);
        }

        //use with paing
        public ActionResult GetListObjectData(string objectname, string filters, string orderbys, int cpage = 1, int cpageitem = 12)
        {
            var listobjects = sc.getListObject(objectname, filters, orderbys, cpage, cpageitem, Organize.ID);
            //Vu~ them get ObjectType ,GroupID
            var ObjectType = sc.getObjectType(objectname);
            return Json(new { success = true, data = listobjects, objectType = 1, GroupID = sc.getBaseObjectGroupID(objectname) }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetListObjectDataHome(string objectname, string filters, string orderbys, int cpage = 1, int cpageitem = 12)
        {
            var listobjects = sc.getListObjectHome(objectname, filters, orderbys, cpage, cpageitem, Organize.ID);
            return Json(new { success = true, data = listobjects }, JsonRequestBehavior.AllowGet);
        }
        //
        //use with paing
        public ActionResult GetListChildObjectData(string objectname, string orderbys, string parentid = "0", int cpage = 1, int cpageitem = 12)
        {
            var listobjects = sc.getListChildObject(objectname, parentid, orderbys, cpage, cpageitem, Organize.ID);
            foreach (var obj in listobjects.Items)
            {
                obj.ParentName = new List<string>();
                if (!string.IsNullOrEmpty(obj.ParentID))
                {
                    if (obj.ParentID.Contains(','))
                        foreach (var item in obj.ParentID.Split(','))
                        {
                            obj.ParentName.Add(sc.getParentNameByParentID(item));
                        }
                    else
                    {
                        obj.ParentName.Add(sc.getParentNameByParentID(obj.ParentID));
                    }
                }
            }
            return Json(new { success = true, data = listobjects, parents = sc.parentList(objectname, 0, Organize.ID) }, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Non paing
        /// </summary>
        /// <param name="objectname"></param>
        /// <param name="orderbys"></param>
        /// <param name="parentid"></param>
        /// <returns></returns>
        public ActionResult GetListNoPageChildObjectData(string objectname, string orderbys, string parentid = "0")
        {
            var listobjects = sc.getListChildObject(objectname, parentid, orderbys, Organize.ID);
            foreach (var obj in listobjects)
            {
                obj.ParentName = new List<string>();
                if (!string.IsNullOrEmpty(obj.ParentID))
                {
                    if (obj.ParentID.Contains(','))
                        foreach (var item in obj.ParentID.Split(','))
                        {
                            obj.ParentName.Add(sc.getParentNameByParentID(item));
                        }
                    else
                    {
                        obj.ParentName.Add(sc.getParentNameByParentID(obj.ParentID));
                    }
                }
            }
            return Json(new { success = true, data = listobjects, parents = sc.parentList(objectname, 0, Organize.ID) }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult editObject(string objectname, long ID)
        {
            var objbase = sc.findObject(objectname, ID, Organize.ID);
            if (objbase == null)
            {
                return Json(new { success = false, msg = "object not found." }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new
                {
                    success = true,
                    data = objbase,
                    parents = sc.parentList(objectname, 0, Organize.ID)
                }, JsonRequestBehavior.AllowGet);

            }
        }
        public ActionResult findObject(string objectname, long ID)
        {
            var objbase = sc.findObject(objectname, ID, Organize.ID);
            if (objbase == null)
            {
                return Json(new { success = false, msg = "object not found." }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = true, data = objbase }, JsonRequestBehavior.AllowGet);

            }
        }
        public ActionResult GetOneBaseObject(string objectname)
        {
            var objbase = sc.getOneBaseObject(objectname, Organize.ID);
            if (objbase == null)
            {
                return Json(new { success = false, msg = "object not found." }, JsonRequestBehavior.AllowGet);
            }
            else
            {

                return Json(new { success = true, data = objbase, parents = sc.parentList(objectname, 0, Organize.ID) }, JsonRequestBehavior.AllowGet);

            }
        }
        public ActionResult GetObjectListTile(string objectname)
        {
            var objbase = sc.ListObjectTitle(objectname, Organize.ID);
            return Json(new { success = true, data = objbase }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetOneObject(string objectname)
        {
            var objbase = sc.getOneObject(objectname, Organize.ID);
            if (objbase == null)
            {
                return Json(new { success = false, msg = "object not found." }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = true, data = objbase }, JsonRequestBehavior.AllowGet);

            }
        }
        [HttpPost]
        public ActionResult UpdateOneObject(gModels.gObject model)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Json(new { success = false, auth = false, msg = "Bạn chưa đăng nhập hoặc không quyền hạn này." }, JsonRequestBehavior.AllowGet);
            }
            var modelImage = model.Attrs.Where(m => m.AttrType == 9);
            if (modelImage.Count() > 0)
            {
                foreach (var item in model.Attrs.Where(m => m.AttrType == 9))
                {
                    item.AttrValue = item.AttrValue.Replace("[", "").Replace("]", "").Replace('"', ' ');
                }
            }
            long id = sc.UpdateOneModel(model, Organize.ID);
            return Json(new { success = true, data = id });
        }

        public ActionResult SortObjectGroup(string order)
        {
            string[] sp1 = order.Split(new string[] { "|" }, StringSplitOptions.RemoveEmptyEntries);
            foreach (string sp in sp1)
            {
                string[] orders = sp.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
                sc.UpdateObjectGroupOrder(long.Parse(orders[0]), int.Parse(orders[1]), Organize.ID);
            }
            return Json(new { success = true }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult SortObject(string order)
        {
            string[] sp1 = order.Split(new string[] { "|" }, StringSplitOptions.RemoveEmptyEntries);
            foreach (string sp in sp1)
            {
                string[] orders = sp.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
                sc.SortObject(long.Parse(orders[0]), int.Parse(orders[1]), Organize.ID);
            }
            return Json(new { success = true }, JsonRequestBehavior.AllowGet);
        }

        //send mail
        public ActionResult SendMail(SendMail model)
        {

            var mailconfig = sc.getOneObject("mailconfig", Organize.ID);
            if (mailconfig == null)
                return Json(new { success = false, msg = "You should config mail sender first." }, JsonRequestBehavior.AllowGet);

            var config = mailconfig.Attrs.ToDictionary(m => m.AttrName, m => m.AttrValue);
            try
            {
                var template = sc.findObject("mailtemplate", model.TemplateID, Organize.ID);
                if (template == null)
                    return Json(new { success = false, msg = "Template not found" }, JsonRequestBehavior.AllowGet);

                var SmtpServer = new SmtpClient(config["host"]);
                SmtpServer.Port = int.Parse(config["port"]);
                SmtpServer.Credentials = new System.Net.NetworkCredential(config["user"], config["password"]);
                SmtpServer.EnableSsl = true;



                List<Receiver> listerror = new List<Receiver>();
                List<gModels.gObjectAttr> listAttr = new List<gObjectAttr>();
                string recevers = "";
                foreach (var receiver in model.Receivers)
                {
                    try
                    {
                        var email = new GuMail();
                        email.mSmtp = SmtpServer;
                        email.From = config["user"];
                        //get email template
                        var templateconfig = template.Attrs.ToDictionary(m => m.AttrName, m => m.AttrValue);
                        email.Title = template.Title;
                        email.ContentText = templateconfig["shortdescription"];
                        email.ContentHtml = templateconfig["mailcontent"];
                        email.To = receiver.text;
                        email.Send();
                        if (recevers != "") recevers += "," + receiver.text;
                        else recevers += receiver.text;


                    }
                    catch
                    {
                        listerror.Add(receiver);
                    }
                }
                listAttr.Add(new gModels.gObjectAttr() { ID = 9, AttrValue = recevers, gObjectGroupID = 3, Status = 1, CreateDate = DateTime.Now, AttrType = 17 });
                listAttr.Add(new gModels.gObjectAttr() { ID = 11, AttrValue = JsonConvert.SerializeObject(template), gObjectGroupID = 3, Status = 1, CreateDate = DateTime.Now, AttrType = 4 });
                //hh
                sc.UpdateOneModel(new gObject()
                {
                    Title = template.Title,
                    CreateDate = DateTime.Now,
                    Status = 1,
                    gGroupID = 3,
                    Slug = template.Slug,
                    Attrs = listAttr
                }, Organize.ID);
                return Json(new { success = true, error = listerror }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, mgs = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        //get object home
        public ActionResult GetPanelObjects(string objects)
        {
            string[] spobjects = objects.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
            List<gModels.gPanelObject> List = new List<gPanelObject>();

            foreach (var objname in spobjects)
            {
                gModels.gPanelObject panel = new gPanelObject();
                panel.Categorys = sc.ListObjectWithCondition(objname, "isnull(ParentID,0)=0 and isnull(gShowHome,0)=1  and isnull(gEnabled,0)=1 ", 0, Organize.ID);
                panel.gObjectName = objname;
                if (panel.Categorys.Count > 0)
                {
                    panel.gObjectDisplayName = panel.Categorys[0].gObjectDisplayName;
                }
                else
                {
                    panel.gObjectDisplayName = objname;
                }

                panel.ListBestBuy = sc.ListObjectWithCondition(objname, "isnull(ParentID,0)<>0 and gBestBuy=1 and isnull(gEnabled,0)=1", 0, Organize.ID);
                panel.ListShowHome = sc.ListObjectWithCondition(objname, "isnull(ParentID,0)<>0 and gShowHome=1 and isnull(gEnabled,0)=1", 0, Organize.ID);
                List.Add(panel);
            }
            return Json(new { success = true, data = List }, JsonRequestBehavior.AllowGet);
        }
        //
        public ActionResult GetObjectContent(long ID = 0, int iRelative = 5, int cpage = 1, int cpageitem = 12)
        {
            var obj = sc.GetObjectContent(ID, iRelative, cpage, cpageitem);
            if (obj == null)

                return Json(new { success = false, msg = "Object not found" }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = true, data = obj }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetViewObject(string objectname, int childget = 12)
        {
            gModels.gPanelObject panel = new gPanelObject();
            panel.Categorys = sc.parentListHome(objectname, 0, Organize.ID);
            panel.gObjectName = objectname;
            if (panel.Categorys.Count > 0)
            {
                panel.gObjectDisplayName = panel.Categorys[0].gObjectDisplayName;
            }
            else
            {
                panel.gObjectDisplayName = objectname;
            }
            foreach (var cat in panel.Categorys)
            {
                cat.Childrens = sc.ListObjectWithCondition(objectname, "ParentID=" + cat.ID + " and isnull(gEnabled,0)=1 ", childget, Organize.ID);
            }

            panel.ListBestBuy = sc.ListObjectWithCondition(objectname, "ParentID is not null and gBestBuy=1 and isnull(gEnabled,0)=1 ", 0, Organize.ID);

            return Json(new { success = true, data = panel }, JsonRequestBehavior.AllowGet);
        }
        //get object for links
        public ActionResult GetLinkPanelObjectsHome(string objects, string childorderby, string parentorderby)
        {
            string[] spobjects = objects.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
            List<gModels.gPanelObject> List = new List<gPanelObject>();
            foreach (var objname in spobjects)
            {
                gModels.gPanelObject panel = new gPanelObject();
                panel.Categorys = sc.ListObjectWithChildHome(objname, Organize.ID, childorderby, parentorderby);
                panel.gObjectName = objname;
                if (panel.Categorys.Count > 0)
                {
                    panel.gObjectDisplayName = panel.Categorys[0].gObjectDisplayName;
                }
                else
                {
                    panel.gObjectDisplayName = objname;
                }

                List.Add(panel);
            }
            return Json(new { success = true, data = List }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetLinkPanelObjects(string objects, string childorderby, string parentorderby)
        {
            string[] spobjects = objects.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
            List<gModels.gPanelObject> List = new List<gPanelObject>();
            foreach (var objname in spobjects)
            {
                gModels.gPanelObject panel = new gPanelObject();
                panel.Categorys = sc.ListObjectWithChild(objname, Organize.ID, childorderby, parentorderby);
                panel.gObjectName = objname;
                if (panel.Categorys.Count > 0)
                {
                    panel.gObjectDisplayName = panel.Categorys[0].gObjectDisplayName;
                }
                else
                {
                    panel.gObjectDisplayName = objname;
                }

                List.Add(panel);
            }
            return Json(new { success = true, data = List }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult DeleteObjects(string IDs)
        {
            sc.UpdateDeleteObjects(IDs);
            return Json(new { success = true }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult AddCart(gObject obj, string Size, string Color, int Quantity)
        {

            gModels.Cart cart;
            if (Session["Cart"] == null)
            {
                cart = new Cart();
            }
            else
            {
                cart = (gModels.Cart)Session["Cart"];
            }
            var cartitem = cart.find(obj.ID);
            if (cartitem == null)
            {
                cart.AddUpdateCart(new gModels.CartItem() { Color = Color, Size = Size, Price = (obj.Attrs[1].AttrValue == null ? int.Parse(obj.Attrs[0].AttrValue) : int.Parse(obj.Attrs[1].AttrValue)), Quantity = Quantity, Pricing = Quantity * (obj.Attrs[1].AttrValue == null ? int.Parse(obj.Attrs[0].AttrValue) : int.Parse(obj.Attrs[1].AttrValue)), Object = obj, ID = obj.ID },cart);
                Session["Cart"] = cart;
                return Json(new { success = true, count = cart.Count }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                Session["Cart"] = cart;
                return Json(new { success = false, msg = "Đã thêm trong giỏ hàng!", count = cart.Count }, JsonRequestBehavior.AllowGet);
            }


        }
        public ActionResult GetCart()
        {
            gModels.Cart cart = null;
            if (Session["Cart"] != null)
            {

                cart = (gModels.Cart)Session["Cart"];
            }
            else
            {
                cart = new Cart();

            }
            return Json(new { success = true, data = cart }, JsonRequestBehavior.AllowGet);

        }
        public ActionResult RemoveCart(long ID)
        {
            gModels.Cart cart = null;
            if (Session["Cart"] != null)
            {

                cart = (gModels.Cart)Session["Cart"];
            }
            else
            {
                cart = new Cart();

            }
            if (cart.Remove(ID) > 0)
            {
                Session["Cart"] = cart;
                return Json(new { success = true, cart.Count, cart.TotalAmount }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = false, msg = "Không thể xóa nội dung này khỏi giỏ hàng" }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult UpdateCart(long ID, int Quantity,long price)
        {
            gModels.Cart cart = null;
            if (Session["Cart"] != null)
            {

                cart = (gModels.Cart)Session["Cart"];
            }
            else
            {
                return Json(new { success = false, msg = "Time out" }, JsonRequestBehavior.AllowGet);

            }
            cart.AddUpdateCart(new gModels.CartItem() { ID = ID, Quantity = Quantity, Pricing = Quantity *price },cart);
            Session["Cart"] = cart;
            return Json(new { success = true, data = cart }, JsonRequestBehavior.AllowGet);

        }
        [HttpPost]
        public ActionResult DoOrder(gModels.User people,string paymentmethod,long shipfee)
        {
            gModels.Cart cart = null;
            if (Session["Cart"] != null)
            {

                cart = (gModels.Cart)Session["Cart"];
            }
            else
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);

            }
            long Idcustomer = 0;
            if (User.Identity.IsAuthenticated)
            {
                var u = _userService.GetUserByEmail(User.Identity.Name);
                if (u == null)
                    return Json(new { success = false, msg = "Not login" }, JsonRequestBehavior.AllowGet);

                Idcustomer = u.ID;
            }
            else
            {
                var customer = sc.findCustomer(people.Email, people.Phone);

                if (customer == null)
                {
                    Idcustomer = sc.NewCustomer(people, Organize.ID);
                }
                else
                {
                    Idcustomer = customer.ID;

                }
            }
            string error = "";
            int result = sc.AddOrder(cart, Idcustomer, people, paymentmethod, shipfee);
            if (result > 0)
            {

                var mailconfig = sc.getOneObject("mailconfig", Organize.ID);
                //send mail to mailconfig
                var config = mailconfig.Attrs.ToDictionary(m => m.AttrName, m => m.AttrValue);
                try
                {
                    var template = sc.getOneObject("mailtemplate", Organize.ID);

                    var SmtpServer = new SmtpClient(config["host"]);
                    SmtpServer.Port = int.Parse(config["port"]);
                    SmtpServer.Credentials = new System.Net.NetworkCredential(config["user"], config["password"]);
                    SmtpServer.EnableSsl = true;

                    //get email template             
                    var dnow = DateTime.Now;
                    var templateconfig = template.Attrs.ToDictionary(m => m.AttrName, m => m.AttrValue);

                    var emailcontent = templateconfig["mailcontent"];
                    emailcontent = emailcontent.Replace("_TOTALAMOUNT_", String.Format("{0:0,0 vnđ}", cart.TotalAmount));
                    emailcontent = emailcontent.Replace("_TIME_", dnow.ToString("hh:mm:ss  dd/MM/yyyy"));
                    emailcontent = emailcontent.Replace("_NAME_", people.FullName);
                    int i = 1;
                    string cartstr = "<table cellspacing='0' cellpadding='10' border='1' style='width:100%'><tr style='background:#038738;color:#fff'><td>#</td><td>Sản phẩm</td><td>Số lượng</td><td>Đơn giá</td><td>Thành tiền</td></tr>";
                    foreach (var citem in cart.List)
                    {
                        cartstr += "<tr>";
                        cartstr += "<td style='text-align:center'>";
                        cartstr += i.ToString();
                        cartstr += "</td>";
                        cartstr += "<td>";
                        if (!string.IsNullOrEmpty(citem.Object.gImage))
                        {
                            string imglink = citem.Object.gImage;
                            cartstr += "<img style='width:50px;height:50px;float:left;margin-right:10px' src='" + imglink + "' alt='" + citem.Object.Title + "'/>";
                        }
                        cartstr += "<span style='float:left;padding-top:10px;font-weight:bold'>" + citem.Object.Title + "</span>";
                        cartstr += "</td>";
                        cartstr += "<td style='text-align:center'>";
                        cartstr += citem.Quantity;
                        cartstr += "</td>";
                        cartstr += "<td>";
                        cartstr += String.Format("{0:0,0 }",1);
                        cartstr += "</td>";
                        cartstr += "<td>";
                        cartstr += String.Format("{0:0,0 }", citem.Pricing);
                        cartstr += "</td>";
                        cartstr += "</tr>";
                        i += 1;
                    }


                    cartstr += "<tr>";
                    cartstr += "<td colspan='4'></td><td>";
                    cartstr += "<span style='color:green;font-size:18px;font-weight:bold;'>" + String.Format("{0:0,0 }", cart.TotalAmount) + "</span>  VND";
                    cartstr += "</td>";
                    cartstr += "</tr>";
                    cartstr += "</table>";
                    emailcontent = emailcontent.Replace("_CART_", cartstr);

                    MatchCollection matchCollection = Regex.Matches(emailcontent, "<img.+?src=[\"'](.+?)[\"'].*?>", RegexOptions.IgnoreCase);
                    foreach (Match match in matchCollection)
                    {
                        string value = match.Groups[1].Value;

                        emailcontent = emailcontent.Replace(value, HttpUtility.UrlDecode(value));

                    }

                    string customerstr = "<table cellspacing='0' cellpadding='10' border='1'><tr style='background:#038738;color:#fff'><td>Họ và tên</td><td>Số điện thoại</td><td>Email</td><td>Địa chỉ</td></tr><tr><td>" + people.FullName + "</td><td>" + people.Phone + "</td><td>" + people.Email + "</td><td>" + people.Address + "</td></tr><tr><td>Ghi chú</td><td colspan='3'></td></tr></table>";
                    emailcontent = emailcontent.Replace("_CUSTOMER_", customerstr);
                    emailcontent = emailcontent.Replace("_LINKCHECKORDER_", "<a href='" + Request.Url.GetLeftPart(UriPartial.Authority) + "/kiem-tra-don-hang?email=" + HttpUtility.UrlEncode(people.Email) + "&phone=" + HttpUtility.UrlEncode(people.Phone) + "' target='_blank'>Kiểm tra đơn hàng</a>");

                    try
                    {
                        var email = new GuMail();
                        email.mSmtp = SmtpServer;
                        email.From = config["user"];
                        email.Title = templateconfig["mailtitle"] + " - " + dnow.ToString("hh:mm:ss dd/MM/yyyy");
                        email.ContentText = templateconfig["shortdescription"];
                        email.ContentHtml = emailcontent;
                        email.To = people.Email;
                        email.Send();


                    }
                    catch (Exception er)
                    {
                        error += "Không thể gửi mail tới email của bạn" + er.Message;
                    }

                    try
                    {


                        var email = new GuMail();
                        email.mSmtp = SmtpServer;
                        email.From = config["user"];
                        email.Title = templateconfig["mailtitle"] + " - " + dnow.ToString("hh:mm:ss dd/MM/yyyy");
                        email.ContentText = templateconfig["shortdescription"];
                        email.ContentHtml = emailcontent;
                        email.To = config["notifyemail"];
                        email.Send();
                    }
                    catch (Exception err)
                    {

                        error += "\n Không thể gửi mail tới email của bạn" + err.Message;
                    }

                }
                catch
                { }
                //
                cart = new Cart();
                Session["Cart"] = cart;
            }

            return Json(new { success = true, data = result, error = error }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetObjectGroup(string name)
        {
            return Json(new { success = true, data = sc.findObjectGroup(name, Organize.ID) }, JsonRequestBehavior.AllowGet);
        }
        //public ActionResult UpdateObjectGroup(gModels.gObjectGroup obj)
        //{
        //    sc.UpdateObjectGroup(obj.ID, obj.Title, obj.gPanelHome);
        //    return Json(new { success = true }, JsonRequestBehavior.AllowGet);
        //}
        public ActionResult OrderDetail(long ID = 0)
        {

            return Json(new { success = true, data = sc.GetOrderDetail(ID) }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult UpdateOrderStatus(long ID, int Status)
        {
            sc.UpdateOrderStatus(ID, Status);
            return Json(new { success = true }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetMyOrders(string objectname, string orderbys, long parentid = 0, int cpage = 1, int cpageitem = 12)
        {
            var listobjects = sc.GetMyOrders(objectname, parentid, orderbys, cpage, cpageitem, Organize.ID, User.Identity.Name);
            return Json(new { success = true, data = listobjects }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetMyOrdersByUser(string objectname, string orderbys, string username,long parentid = 0,int cpage = 1, int cpageitem = 12)
        {
            var listobjects = sc.GetMyOrders(objectname, parentid, orderbys, cpage, cpageitem, Organize.ID, username);
            return Json(new { success = true, data = listobjects }, JsonRequestBehavior.AllowGet);
        }
        //CheckOrders
        public ActionResult CheckOrders(string email, string phone, int cpage = 1, int cpageitem = 12)
        {
            var listobjects = sc.CheckOrders(cpage, cpageitem, email, phone);
            return Json(new { success = true, data = listobjects }, JsonRequestBehavior.AllowGet);
        }
        ///////////////////////////////Vũ code dưới dòng comment này...
        [HttpPost]
        public JsonResult CheckoutAsGest(User user)
        {
            try
            {

                Session["CheckoutGest"] = user;

                return Json(new { success = true });
            }
            catch 
            {
                return Json(new { success = false });
            }
        }
        public ActionResult GetGest()
        {
            var user = Session["CheckoutGest"];
            return Json(new { success = true, user = user }, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Author :Hoang Vu
        /// </summary>
        /// <param name="ID">ProvinceID</param>
        /// <returns></returns>
        public JsonResult GetListDistrict(int ID)
        {
            return Json(new { data = sc.GetDistrictList(ID), msg = "Danh sach quan huyen" }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAboutus()
        {
            return Json(new { data = sc.GetAboutUs(), msg = "Danh sach quan huyen" }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPaymentMethod()
        {
            return Json(new { data = sc.GetPaymentMethod(), msg = "Danh sach quan huyen" }, JsonRequestBehavior.AllowGet);
        }
    }
}
