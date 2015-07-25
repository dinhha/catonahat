using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Guline.Web.One.gModels
{
    [TableName("gOrder")]
    [PrimaryKey("ID")]
    public class gOrder
    {
        public long ID { get; set; }
        public long gUserID { get; set; }
        public Nullable<long> gTotalPrice { get; set; }
        public long PaymentStatus { get; set; }
        public Nullable<long> Status { get; set; }
        public System.DateTime CreateDate { get; set; }
        public Nullable<System.DateTime> LastUpdateDate { get; set; }
        public string CreatedBy { get; set; }
        public string LastUpdateBy { get; set; }
        public string gEmail { get; set; }
        public string gPhone { get; set; }
        public string gAddress { get; set; }

        public string gFullName { get; set; }
        public string gPaymentType { get; set; }
        public long ShippingFee { get; set; }
        public string gOrderCode { get; set; }
        [ResultColumn]
        public List<gOrderDetail> gOrderDetails { get; set; }
    }
    [TableName("gOrderDetail")]
    [PrimaryKey("ID")]
    public partial class gOrderDetail
    {
        public long ID { get; set; }
        public long gOrderID { get; set; }
        public long gObjectID { get; set; }
        public long gQuantity { get; set; }
        public long gPrice { get; set; }
        public string gSize { get; set; }
        public string gColor { get; set; }
        public System.DateTime CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> LastUpdateDate { get; set; }
        public string LastUpdateBy { get; set; }

        [PetaPoco.ResultColumn]
        public string Name { get; set; }
        [PetaPoco.ResultColumn]
        public string Image { get; set; }
        [PetaPoco.ResultColumn]
        public int PublishTypeID { get; set; }
        [PetaPoco.ResultColumn]
        public string ObjectName { get; set; }
    }
}