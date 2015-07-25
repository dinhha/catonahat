﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Guline.Web.One.DInject;
using Guline.Web.One.Models;
using PetaPoco;
using Guline.Web.One.gModels;
using System.Web.Script.Serialization;

namespace Guline.Web.One.DIImpl
{
    public class ObjectGroup : IObjectGroup
    {
        private mContext db;

        public ObjectGroup(mContext _db)
        {
            this.db = _db;
        }

        public PetaPoco.Page<gModels.gObjectGroup> Listing(int page, int pagesize, long organizeid)
        {
            return db.Page<gModels.gObjectGroup>(page, pagesize, new PetaPoco.Sql("select * from gObjectGroup where [Status]=1 and gOrganizeID=@0 and isShowMenu=1 order by gOrder asc", organizeid));
        }
        //object type
        //1 string -  11 upload file  - 12 color picker



        public gModels.gObject getOneBaseObject(string objectname, long organizeid)
        {
            gModels.gObject obj = db.FirstOrDefault<gModels.gObject>(new PetaPoco.Sql("select top (1)  Name as [gObjectName],Title as gObjectDisplayName,ID as [gGroupID],hasChild,gCanSale,gJustAttr from gObjectGroup  where Name=@0 and Status=1", objectname));
            obj.Attrs = db.Fetch<gModels.gObjectAttr>(new PetaPoco.Sql("select a.* from gObjectAttr a join gObjectGroup g on g.ID=a.gObjectGroupID  where a.Status=1 and g.ID=@0 and g.gOrganizeID=@1 order by a.AttrOrder asc", obj.gGroupID, organizeid));
            return obj;
        }
        public gModels.gObject getOneObject(string objectname, long organizeid)
        {
            gModels.gObject obj = db.FirstOrDefault<gModels.gObject>(new PetaPoco.Sql("select top (1)  o.*,g.Name as [gObjectName],g.Title as gObjectDisplayName,g.ID as [gGroupID] from gObject o join gObjectGroup g on o.gGroupID=g.ID where g.Name=@0 and o.Status=1 and g.Status=1 and g.gOrganizeID=@1", objectname, organizeid));
            if (obj != null)
            {
                obj.Attrs = db.Fetch<gModels.gObjectAttr>(new PetaPoco.Sql("SELECT a.*,d.gValue AS [AttrValue],d.ID AS gObjectDataID FROM gObjectAttr a JOIN gObject o ON o.gGroupID = a.gObjectGroupID LEFT JOIN gObjectData d ON d.gAttrID = a.ID AND o.ID = d.gObjectID WHERE a.STATUS = 1 AND o.ID =@0 ORDER BY a.AttrOrder ASC", obj.ID));

            }
            else
            {
                obj = db.FirstOrDefault<gModels.gObject>(new PetaPoco.Sql("select top (1)  Name as [gObjectName],Title as gObjectDisplayName,ID as [gGroupID] from gObjectGroup  where Name=@0 and Status=1", objectname));
                obj.Attrs = db.Fetch<gModels.gObjectAttr>(new PetaPoco.Sql("select a.* from gObjectAttr a join gObjectGroup g on g.ID=a.gObjectGroupID  where a.Status=1 and g.ID=@0 order by a.AttrOrder asc", obj.gGroupID));
            }
            return obj;
        }

        public PetaPoco.Page<gModels.gObject> getListObjectHome(string objectname, string filters, string orderbys, int page, int pagesize, long organizeid)
        {
            PetaPoco.Page<gModels.gObject> gPage = db.Page<gModels.gObject>(page, pagesize, new PetaPoco.Sql("select o.*,g.Name as [gObjectName],g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID where g.Name=@0 and o.Status=1 and g.Status=1 and o.ParentID is not null and g.gOrganizeID=@1 and isnull(o.gEnabled,0)=1 order by o.gOrder asc", objectname, organizeid));
            foreach (var item in gPage.Items)
            {
                item.Attrs = db.Fetch<gModels.gObjectAttr>(new PetaPoco.Sql("SELECT a.*,d.gValue AS [AttrValue],d.ID AS gObjectDataID FROM gObjectAttr a JOIN gObject o ON o.gGroupID = a.gObjectGroupID LEFT JOIN gObjectData d ON d.gAttrID = a.ID AND o.ID = d.gObjectID WHERE a.STATUS = 1 AND o.ID =@0 ORDER BY a.AttrOrder ASC", item.ID));
            }
            return gPage;
        }

        public PetaPoco.Page<gModels.gObject> getListObject(string objectname, string filters, string orderbys, int page, int pagesize, long organizeid)
        {
            PetaPoco.Page<gModels.gObject> gPage = db.Page<gModels.gObject>(page, pagesize, new PetaPoco.Sql("select o.*,g.Name as [gObjectName],g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID where g.Name=@0 and o.Status=1 and g.Status=1 and o.ParentID is  null and g.gOrganizeID=@1 order by o.gOrder asc", objectname, organizeid));
            foreach (var item in gPage.Items)
            {
                item.Attrs = db.Fetch<gModels.gObjectAttr>(new PetaPoco.Sql("SELECT a.*,d.gValue AS [AttrValue],d.ID AS gObjectDataID FROM gObjectAttr a JOIN gObject o ON o.gGroupID = a.gObjectGroupID LEFT JOIN gObjectData d ON d.gAttrID = a.ID AND o.ID = d.gObjectID WHERE a.STATUS = 1 AND o.ID =@0 ORDER BY a.AttrOrder ASC", item.ID));
            }
            return gPage;
        }


        public long UpdateOneModel(gModels.gObject model, long organizeid)     //chưa viết check
        {
            try
            {


                if (model.ID == 0)
                {
                    model.CreateDate = DateTime.Now;
                    model.Status = 1;
                    db.Insert(model);
                }
                else
                {
                    //model.CreateDate = DateTime.Now;
                    model.LastUpdateDate = DateTime.Now;
                    db.Update("gObject", "ID", model);
                }
                if (model.Attrs != null)
                {
                    foreach (var attr in model.Attrs)
                    {
                        var mmodel = new gModels.gObjectData() { gObjectID = model.ID, CreateDate = DateTime.Now, gAttrID = attr.ID, gValue = attr.AttrValue };
                        if (attr.gObjectDataID == 0)
                        {
                            db.Insert(mmodel);
                            attr.gObjectDataID = mmodel.ID;

                        }
                        else
                        {
                            mmodel.LastUpdateDate = DateTime.Now;
                            mmodel.ID = attr.gObjectDataID;
                            db.Update(mmodel);
                        }

                    }
                }
                return model.ID;
            }
            catch
            {
                return 0;
            }

        }



        public gModels.gObject findObject(string objectname, long ID, long organizeid)
        {
            gModels.gObject obj = db.FirstOrDefault<gModels.gObject>(new PetaPoco.Sql("select top (1)  o.*,g.Name as [gObjectName],g.Title as gObjectDisplayName,g.ID as [gGroupID],g.hasChild as hasChild from gObject o join gObjectGroup g on o.gGroupID=g.ID where g.Name=@0 and o.Status=1 and g.Status=1 and o.ID=@1 and g.gOrganizeID=@2", objectname, ID, organizeid));
            if (obj != null)
            {
                obj.Attrs = db.Fetch<gModels.gObjectAttr>(new PetaPoco.Sql("SELECT a.*,d.gValue AS [AttrValue],d.ID AS gObjectDataID FROM gObjectAttr a JOIN gObject o ON o.gGroupID = a.gObjectGroupID LEFT JOIN gObjectData d ON d.gAttrID = a.ID AND o.ID = d.gObjectID WHERE a.STATUS = 1 AND o.ID =@0 ORDER BY a.AttrOrder ASC", obj.ID));

            }
            return obj;
        }
        public List<gModels.gObject> parentListHome(string objectname, long ID, long organizeid)
        {
            var list = db.Fetch<gModels.gObject>(new PetaPoco.Sql("select o.*,g.Name as [gObjectName],g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID where g.Name=@0 and o.Status=1 and g.Status=1 and o.ParentID is not null and (o.ID<>@1 or @1=0) and g.gOrganizeID=@2 and isnull(o.gEnabled,0)=1 order by o.gOrder asc", objectname, ID, organizeid));

            return list;
        }

        public List<gModels.gObject> parentList(string objectname, long ID, long organizeid)
        {
            var list = db.Fetch<gModels.gObject>(new PetaPoco.Sql("select o.*,g.Name as [gObjectName],g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID where g.Name=@0 and o.Status=1 and g.Status=1 and o.ParentID is null and (o.ID<>@1 or @1=0) and g.gOrganizeID=@2 order by o.gOrder asc", objectname, ID, organizeid));

            return list;
        }


        public List<gModels.gObject> ListObjectTitle(string objectname, long organizeid)
        {
            return db.Fetch<gModels.gObject>(new PetaPoco.Sql("select o.*,g.Name as [gObjectName],g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID where g.Name=@0 and o.Status=1 and g.Status=1 and g.gOrganizeID=@1", objectname, organizeid));
        }


        public gModels.gOrganize getOrganize(string domain)
        {
            return db.FirstOrDefault<gModels.gOrganize>(new PetaPoco.Sql("select top (1) * from gOrganize where Name like '%'+@0+'%'", domain));
        }


        public List<gModels.gObject> ListObjectWithChild(string objectname, long organizeid, string childorderby, string parentorderby)
        {
            var list = db.Fetch<gModels.gObject>(new PetaPoco.Sql("select o.*,g.Name as [gObjectName],g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID where g.Name=@0 and o.Status=1 and g.Status=1 and o.ParentID is not null and g.gOrganizeID=@1  " + parentorderby, objectname, organizeid));
            foreach (var item in list)
            {
                item.Attrs = db.Fetch<gModels.gObjectAttr>(new PetaPoco.Sql("SELECT a.*,d.gValue AS [AttrValue],d.ID AS gObjectDataID FROM gObjectAttr a JOIN gObject o ON o.gGroupID = a.gObjectGroupID LEFT JOIN gObjectData d ON d.gAttrID = a.ID AND o.ID = d.gObjectID WHERE a.STATUS = 1 AND o.ID =@0 ORDER BY a.AttrOrder ASC", item.ID));
                item.Childrens = db.Fetch<gModels.gObject>(new PetaPoco.Sql("select o.*,g.Name as [gObjectName],g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID where g.Name=@0 and o.Status=1 and g.Status=1 and isnull(o.ParentID,0)=@2 and g.gOrganizeID=@1 " + childorderby, objectname, organizeid, item.ID));
                foreach (var sitem in item.Childrens)
                {
                    sitem.Attrs = db.Fetch<gModels.gObjectAttr>(new PetaPoco.Sql("SELECT a.*,d.gValue AS [AttrValue],d.ID AS gObjectDataID FROM gObjectAttr a JOIN gObject o ON o.gGroupID = a.gObjectGroupID LEFT JOIN gObjectData d ON d.gAttrID = a.ID AND o.ID = d.gObjectID WHERE a.STATUS = 1 AND o.ID =@0 ORDER BY a.AttrOrder ASC", sitem.ID));
                }
            }

            return list;
        }

        public List<gModels.gObject> ListObjectWithChildHome(string objectname, long organizeid, string childorderby, string parentorderby)
        {
            var list = db.Fetch<gModels.gObject>(new PetaPoco.Sql("select o.*,g.Name as [gObjectName],g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID where g.Name=@0 and o.Status=1 and g.Status=1 and o.ParentID is not null and g.gOrganizeID=@1 and isnull(o.gEnabled,0)=1 " + parentorderby, objectname, organizeid));
            foreach (var item in list)
            {
                item.Attrs = db.Fetch<gModels.gObjectAttr>(new PetaPoco.Sql("SELECT a.*,d.gValue AS [AttrValue],d.ID AS gObjectDataID FROM gObjectAttr a JOIN gObject o ON o.gGroupID = a.gObjectGroupID LEFT JOIN gObjectData d ON d.gAttrID = a.ID AND o.ID = d.gObjectID WHERE a.STATUS = 1 and isnull(o.gEnabled,0)=1 AND o.ID =@0 ORDER BY a.AttrOrder ASC", item.ID));
                item.Childrens = db.Fetch<gModels.gObject>(new PetaPoco.Sql("select o.*,g.Name as [gObjectName],g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID where g.Name=@0 and o.Status=1 and g.Status=1 and isnull(o.ParentID,0)=@2 and g.gOrganizeID=@1 and isnull(o.gEnabled,0)=1 " + childorderby, objectname, organizeid, item.ID));
                foreach (var sitem in item.Childrens)
                {
                    sitem.Attrs = db.Fetch<gModels.gObjectAttr>(new PetaPoco.Sql("SELECT a.*,d.gValue AS [AttrValue],d.ID AS gObjectDataID FROM gObjectAttr a JOIN gObject o ON o.gGroupID = a.gObjectGroupID LEFT JOIN gObjectData d ON d.gAttrID = a.ID AND o.ID = d.gObjectID WHERE a.STATUS = 1 AND o.ID =@0 and isnull(o.gEnabled,0)=1 ORDER BY a.AttrOrder ASC", sitem.ID));
                }
            }

            return list;
        }

        public void UpdateObjectGroupOrder(long ID, int order, long organizeid)
        {
            db.Update("gObjectGroup", "ID", new { ID = ID, gOrder = order });
        }


        public void SortObject(long ID, int order, long organizeid)
        {
            db.Update("gObject", "ID", new { ID = ID, gOrder = order });
        }


        public List<gModels.gObject> ListObjectWithCondition(string objectname, string cond, int take, long organizeid)
        {
            string sqltake = (take != 0 ? " top (" + take + ") " : "");
            string sql = "select " + sqltake + " o.*,g.Name as gObjectName,g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID";
            if (cond != "")
            {
                sql += " where ";
                sql += cond;

                sql += " and g.gOrganizeID=@0 and g.Name=@1";
            }
            else
            {
                sql += " where g.gOrganizeID=@0 and g.Name=@1";
            }
            sql += "  order by  o.gOrder asc ";
            return db.Fetch<gModels.gObject>(new PetaPoco.Sql(sql, organizeid, objectname));
        }


        public gModels.gObject GetObjectContent(long ID, int iRelative, int cpage, int cpageitem)
        {
            var obj = db.FirstOrDefault<gModels.gObject>(new PetaPoco.Sql("select o.*,g.Name as gObjectName,g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID where o.ID=@0 and o.Status=1 and isnull(o.gEnabled,0)=1  order by  o.gOrder asc", ID));
            if (obj != null)
            {
                if (obj.ParentID != null && obj.ParentID !="0")
                {
                     obj.Parents=new List<gObject>();
                     obj.Relatives = new List<gObject>();
                    if(obj.ParentID.Contains(','))
                    {
                        foreach(var paID in obj.ParentID.Split(','))
                        {
                            obj.Parents.Add(db.FirstOrDefault<gModels.gObject>(new PetaPoco.Sql("select o.*,g.Name as gObjectName,g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID where o.ID=@0 and o.Status=1 and isnull(o.gEnabled,0)=1 order by  o.gOrder asc", paID)));
                            obj.Relatives.AddRange(db.Fetch<gModels.gObject>(new PetaPoco.Sql(@"select top(@2)  o.*,g.Name as gObjectName,g.Title as gObjectDisplayName from gObject
                                                                                           o join gObjectGroup g on o.gGroupID=g.ID where isnull(o.ParentID,0)=@0 and o.ID!=@1 
                                                                                            and o.Status=1 and isnull(o.gEnabled,0)=1 order by  RAND() desc", paID, iRelative, obj.ID)));
                        }
                    }
                    else
                    { 
                    obj.Parents.Add(db.FirstOrDefault<gModels.gObject>(new PetaPoco.Sql("select o.*,g.Name as gObjectName,g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID where o.ID=@0 and o.Status=1 and isnull(o.gEnabled,0)=1 order by  o.gOrder asc", obj.ParentID)));
                    obj.Relatives = db.Fetch<gModels.gObject>(new PetaPoco.Sql("select top(@2) o.*,g.Name as gObjectName,g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID where isnull(o.ParentID,0)=@0 and o.ID!=@1 and o.Status=1 and isnull(o.gEnabled,0)=1 order by  o.CreateDate desc", obj.ParentID, obj.ID, iRelative));
                    }
                    obj.Attrs = db.Fetch<gModels.gObjectAttr>(new PetaPoco.Sql("SELECT a.*,d.gValue AS [AttrValue],d.ID AS gObjectDataID FROM gObjectAttr a JOIN gObject o ON o.gGroupID = a.gObjectGroupID LEFT JOIN gObjectData d ON d.gAttrID = a.ID AND o.ID = d.gObjectID WHERE a.STATUS = 1 AND o.ID =@0 ORDER BY a.AttrOrder ASC", obj.ID));
                    if (obj.Parents != null)
                    {
                        foreach (var item in obj.Parents)
                        {
                            
                            if(item!=null)
                            {
                                item.Parents = new List<gObject>();
                                if (item.ParentID.Contains(','))
                                {
                                    foreach (var paID in item.ParentID.Split(','))
                                    {
                                        item.Parents.Add(db.FirstOrDefault<gModels.gObject>(new PetaPoco.Sql(@"select o.*,g.Name as gObjectName,g.Title as gObjectDisplayName from gObject
                                                                                                                       o join gObjectGroup g on o.gGroupID=g.ID where o.ID=@0  
                                                                                                                       and o.Status=1 and isnull(o.gEnabled,0)=1 order by  o.gOrder asc", paID)));
                                    }
                                }
                                else
                                {
                                    item.Parents.Add(db.FirstOrDefault<gModels.gObject>(new PetaPoco.Sql(@"select o.*,g.Name as gObjectName,g.Title as gObjectDisplayName from gObject
                                                                                                                       o join gObjectGroup g on o.gGroupID=g.ID where o.ID=@0  
                                                                                                                       and o.Status=1 and isnull(o.gEnabled,0)=1 order by  o.gOrder asc", item.ParentID)));
                                }

                            }
                        }
                        
                    }
                    
                }
                else
                {
                    obj.PageChildrens = db.Page<gModels.gObject>(cpage, cpageitem, new PetaPoco.Sql("select o.*,g.Name as gObjectName,g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID where isnull(o.ParentID,0)=@0 and o.Status=1 and isnull(o.gEnabled,0)=1 order by  o.CreateDate desc", obj.ID));
                    obj.Relatives = db.Fetch<gModels.gObject>(new PetaPoco.Sql("select top(5)  o.*,g.Name as gObjectName,g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID where o.gGroupID=@0 and o.ParentID is not null  and o.Status=1 and isnull(o.gEnabled,0)=1 order by  o.CreateDate desc", obj.gGroupID));
                   
                }
                foreach (var item in obj.Relatives)
                {
                    item.Attrs = db.Fetch<gModels.gObjectAttr>(new PetaPoco.Sql("SELECT a.*,d.gValue AS [AttrValue],d.ID AS gObjectDataID FROM gObjectAttr a JOIN gObject o ON o.gGroupID = a.gObjectGroupID LEFT JOIN gObjectData d ON d.gAttrID = a.ID AND o.ID = d.gObjectID WHERE a.STATUS = 1 AND o.ID =@0 ORDER BY a.AttrOrder ASC", item.ID));
                }
            }
            return obj;
        }


        public PetaPoco.Page<gModels.gObject> getListChildObject(string objectname, string parentid, string orderbys, int page, int pagesize, long organizeid)
        {

            PetaPoco.Page<gModels.gObject> gPage = db.Page<gModels.gObject>(page, pagesize, new PetaPoco.Sql(@"select o.*,g.Name as [gObjectName],g.Title as gObjectDisplayName from gObject 
            o join gObjectGroup g on o.gGroupID=g.ID 
            where g.Name=@0 
            and o.Status=1 
            and g.Status=1 
            and (@2=0 or o.ParentID  like '%'+@2+'%') 
            and o.ParentID is not null 
            and g.gOrganizeID=@1 
            order by o.CreateDate desc", objectname, organizeid, parentid));
            foreach (var item in gPage.Items)
            {
                item.Attrs = db.Fetch<gModels.gObjectAttr>(new PetaPoco.Sql("SELECT a.*,d.gValue AS [AttrValue],d.ID AS gObjectDataID FROM gObjectAttr a JOIN gObject o ON o.gGroupID = a.gObjectGroupID LEFT JOIN gObjectData d ON d.gAttrID = a.ID AND o.ID = d.gObjectID WHERE a.STATUS = 1 AND o.ID =@0 ORDER BY a.AttrOrder ASC", item.ID));
            }
            return gPage;
        }
        public List<gModels.gObject> getListChildObject(string objectname, string parentid, string orderbys, long organizeid)
        {

            var gPage = db.Fetch<gModels.gObject>(new PetaPoco.Sql(@"select o.*,g.Name as [gObjectName],g.Title as gObjectDisplayName from gObject 
            o join gObjectGroup g on o.gGroupID=g.ID 
            where g.Name=@0 
            and o.Status=1 
            and g.Status=1 
            and (@2=0 or o.ParentID  like '%'+@2+'%') 
            and o.ParentID is not null 
            and g.gOrganizeID=@1 
            order by o.CreateDate desc", objectname, organizeid, parentid));
            foreach (var item in gPage)
            {
                item.Attrs = db.Fetch<gModels.gObjectAttr>(new PetaPoco.Sql("SELECT a.*,d.gValue AS [AttrValue],d.ID AS gObjectDataID FROM gObjectAttr a JOIN gObject o ON o.gGroupID = a.gObjectGroupID LEFT JOIN gObjectData d ON d.gAttrID = a.ID AND o.ID = d.gObjectID WHERE a.STATUS = 1 AND o.ID =@0 ORDER BY a.AttrOrder ASC", item.ID));
            }
            return gPage;
        }
        public void UpdateDeleteObjects(string IDs)
        {
            if (IDs.Contains(","))
            {
                string[] splist = IDs.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
                foreach (string sid in splist)
                {
                    db.Update("gObject", "ID", new { ID = long.Parse(sid), Status = 0 });
                }
            }
            else
            {
                db.Update("gObject", "ID", new { ID = long.Parse(IDs), Status = 0 });
            }
        }


        public gModels.gObject findObjectByID(long ID)
        {
            var obj= db.FirstOrDefault<gModels.gObject>(new PetaPoco.Sql("select o.*,g.Name as gObjectName,g.Title as gObjectDisplayName from gObject o join gObjectGroup g on o.gGroupID=g.ID where o.ID=@0 and o.Status=1 and isnull(o.gEnabled,0)=1 order by  o.gOrder asc", ID));
            obj.Attrs = db.Fetch<gModels.gObjectAttr>(new PetaPoco.Sql("SELECT a.*,d.gValue AS [AttrValue],d.ID AS gObjectDataID FROM gObjectAttr a JOIN gObject o ON o.gGroupID = a.gObjectGroupID LEFT JOIN gObjectData d ON d.gAttrID = a.ID AND o.ID = d.gObjectID WHERE a.STATUS = 1 AND o.ID =@0 ORDER BY a.AttrOrder ASC", obj.ID));
            return obj;

        }
        public gModels.User findCustomer(string email, string phone)
        {
            return db.FirstOrDefault<gModels.User>("select u.ID,u.Email,u.Image,u.gOrganizeID,u.Image,u.CreateDate,u.ActiveDate,u.Address,u.Status from [User] u join [Group] g on g.ID=u.GroupID where u.Email=@0 and u.[Phone]=@1", email, phone);
        }
        public long NewCustomer(gModels.User model, long organizeid)
        {
            model.CreateDate = DateTime.Now;
            model.Status = 1;
            model.GroupID = 3;
            model.gOrganizeID = organizeid;
            db.Insert(model);
            return model.ID;
        }
        public  string radomCode()
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            var result = new string(
                Enumerable.Repeat(chars, 5)
                          .Select(s => s[random.Next(s.Length)])
                          .ToArray());
            return result;
        }
        public int AddOrder(gModels.Cart cart, long UserID, gModels.User u,string paymentmethod,long shipfee)
        {
            if (cart.List.Count == 0)
            {
                return 0;
            }
            else
            {
                try { 
                    var OrderCode=radomCode();
                    gOrder order = new gOrder();
                    order.gUserID = UserID;
                    order.ShippingFee = shipfee;
                    order.gTotalPrice = cart.TotalAmount + shipfee;
                    order.PaymentStatus = 1;
                    order.Status = 1;
                    order.CreateDate = DateTime.Now;
                    order.gEmail = u.Email;
                    order.gPhone = u.Phone;
                    order.gAddress = u.Address;
                    order.gFullName = u.FullName;
                    order.gOrderCode = OrderCode;
                    order.gPaymentType = paymentmethod;
                    var exist = db.ExecuteScalar<int>("Select count(1) from gOrder where gOrderCode=@Slug", new { Slug = OrderCode });
                    if (exist == 0)
                       {
                           db.Insert<gOrder>(order);
                           foreach (var item in cart.List)
                           {
                               gOrderDetail detail = new gOrderDetail();
                               detail.gOrderID = order.ID;
                               detail.gObjectID = item.ID;
                               detail.gQuantity = item.Quantity;
                               detail.gPrice = item.Pricing;
                               detail.CreateDate = DateTime.Now;
                               db.Insert<gOrderDetail>(detail);
                           }
                       }
                    return 1;
                }
                catch
                {
                    return 0;
                }
            }
        }
        public gModels.gObjectGroup findObjectGroup(string name, long organizeid)
        {
            return db.SingleOrDefault<gModels.gObjectGroup>("select top(1) * from gObjectGroup where gOrganizeID=@0 and Name=@1 ", organizeid, name);
        }
        public List<gModels.gOrderDetail> GetOrderDetail(long ID)
        {
            return db.Fetch<gModels.gOrderDetail>("select od.*,o.Title as Name,g.Title as ObjectName from gOrderDetail od join gObject o  on od.gObjectID=o.ID join gObjectGroup g on o.gGroupID=g.ID where od.gOrderID=@0 ", ID);
        }
        public void UpdateOrderStatus(long ID, int Status)
        {
            db.Update("gOrder", "ID", new { ID = ID, PaymentStatus = Status, LastUpdateDate = DateTime.Now });
        }
        public PetaPoco.Page<gModels.gOrder> GetMyOrders(string objectname, long parentid, string orderbys, int page, int pagesize, long organizeid, string username)
        {

            PetaPoco.Page<gModels.gOrder> gPage = db.Page<gModels.gOrder>(page, pagesize, new PetaPoco.Sql("select o.* from gOrder o  join [User] u on o.gUserID=u.ID where isnull(o.[Status],0)=1 and u.Email=@0  order by o.CreateDate desc", username));
            foreach(var item in gPage.Items)
            {
                item.gOrderDetails = GetOrderDetail(item.ID);
            }
            return gPage;
        }
        public PetaPoco.Page<gModels.gOrder> CheckOrders(int page, int pagesize, string email, string phone)
        {

            PetaPoco.Page<gModels.gOrder> gPage = db.Page<gModels.gOrder>(page, pagesize, new PetaPoco.Sql("select * from gOrder  where isnull([Status],0)=1 and gEmail=@0 and gPhone=@1  order by CreateDate desc", email, phone));

            return gPage;
        }
        public PetaPoco.Page<gModels.gOrder> GetListOrder(string objectname, long parentid, string orderbys, int page, int pagesize, long organizeid)
        {

            PetaPoco.Page<gModels.gOrder> gPage = db.Page<gModels.gOrder>(page, pagesize, new PetaPoco.Sql("select * from gOrder where isnull(Status,0)=1 order by CreateDate desc", objectname, organizeid, parentid));

            return gPage;
        }
        ///////////////////////////////Vũ code dưới dòng comment này...
        /// <summary>
        /// Author :Hoang Vu
        /// Des:GetObject Type HasCHild
        /// </summary>
        /// <param name="objectname"></param>
        /// <returns></returns>
        public int getObjectType(string objectname)
        {
            return db.ExecuteScalar<int>(@"Select hasChild from gObjectGroup where Name=@Name", new { Name = objectname });
        }
          /// <summary>
          /// Author: Hoang Vu
          /// Des:
          /// </summary>
          /// <param name="objectname"></param>
          /// <param name="organizeid"></param>
          /// <returns></returns>
        public long getBaseObjectGroupID(string objectname)
        {
            return db.ExecuteScalar<long>("Select ID from gObjectGroup  where Name=@Name and Status=1", new { Name = objectname });
        }
        /// <summary>
        /// Author HoangVu
        /// Des:
        /// </summary>
        /// <param name="parentID"></param>
        /// <returns></returns>
        public string getParentNameByParentID(string parentID)
        { 
            string s=db.ExecuteScalar<string>("Select Slug from gObject where @ParentID like ID",new {ParentID=parentID});
            return s;
        }
        public List<ProvinceModel> GetListProvince()
        {
            return db.Fetch<ProvinceModel>("Select * from dataProvince");
        }
        public List<string> GetDistrictList(int ProvinceID)
        {
            return db.Fetch<string>("Select District from dataDistrict where ProvinceID=@0", ProvinceID);
        }
       public string GetAboutUs()
        {
            return db.ExecuteScalar<string>("Select gValue from gObjectData where gObjectID=137 and gAttrID=119");
        }
       public string GetPaymentMethod()
       {
           return db.ExecuteScalar<string>("Select gValue from gObjectData where gObjectID=138 and gAttrID=122");
       }
    }
}
