﻿using System;
using Guline.Web.One.gModels;
using System.Collections.Generic;
namespace Guline.Web.One.DInject
{
    public interface IObjectGroup
    {
        PetaPoco.Page<gObjectGroup> Listing(int page, int pagesize,long organizeid);

        gModels.gOrganize getOrganize(string domain);

        //gModels.gObject getBaseObject(string objectname);
        gModels.gObject getOneBaseObject(string objectname, long organizeid);
        gModels.gObject getOneObject(string objectname, long organizeid);
        gModels.gObject findObject(string objectname, long ID, long organizeid);
        PetaPoco.Page<gModels.gObject> getListObject(string objectname, string filters, string orderbys, int page, int pagesize, long organizeid);

        PetaPoco.Page<gModels.gObject> getListObjectHome(string objectname, string filters, string orderbys, int page, int pagesize, long organizeid);

        PetaPoco.Page<gModels.gObject> getListChildObject(string oBbjectname, string parentid, string orderbys, int page, int pagesize, long organizeid);
        List<gModels.gObject> parentList(string objectname, long ID, long organizeid);
        List<gModels.gObject> parentListHome(string objectname, long ID, long organizeid);
     
        List<gModels.gObject> ListObjectTitle(string objectname, long organizeid);
        long UpdateOneModel(gModels.gObject model, long organizeid);

        List<gModels.gObject> ListObjectWithChild(string objectname, long organizeid, string childorderby,string parentorderby);

        List<gModels.gObject> ListObjectWithChildHome(string objectname, long organizeid, string childorderby, string parentorderby);

        void UpdateObjectGroupOrder(long ID, int order, long organizeid);
        void SortObject(long ID, int order, long organizeid);

        ///new
        List<gModels.gObject> ListObjectWithCondition(string objectname, string cond,int take, long organizeid);

        gModels.gObject GetObjectContent(long ID, int iRelative, int cpage, int cpageitem);

        void UpdateDeleteObjects(string IDs);

        gModels.gObject findObjectByID(long ID);
        ///////////////////////////////////////////////////////////////////// Vu Code
        /// <summary>
        /// Author :Hoang Vu
        /// </summary>
        /// <param name="objectname"></param>
        /// <returns></returns>
        int getObjectType(string objectname);
        long getBaseObjectGroupID(string objectname);

        string getParentNameByParentID(string p);

        List<ProvinceModel> GetListProvince();

        List<string> GetDistrictList(int ProvinceID);


        User findCustomer(string p1, string p2);

        long NewCustomer(User people, long p);
        string radomCode();

        int AddOrder(Cart cart, long Idcustomer, User people, string paymentmethod,long shipfee);

        gObjectGroup findObjectGroup(string name, long p);

        List<gModels.gOrderDetail> GetOrderDetail(long ID);

        void UpdateOrderStatus(long ID, int Status);

        PetaPoco.Page<gModels.gOrder> GetMyOrders(string objectname, long parentid, string orderbys, int cpage, int cpageitem, long p1, string p2);

        PetaPoco.Page<gModels.gOrder> CheckOrders(int cpage, int cpageitem, string email, string phone);

        PetaPoco.Page<gModels.gOrder> GetListOrder(string objectname, long parentid, string orderbys, int cpage, int cpageitem, long p);


        List<gObject> getListChildObject(string objectname, string parentid, string orderbys, long p);

        string GetAboutUs();

        string GetPaymentMethod();
    }
}
