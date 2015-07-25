using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Guline.Web.One.gModels
{
    public class Cart
    {
        public Cart()
        {
            List = new List<CartItem>();
            TotalAmount = 0;
            Count = 0;
        }
        public List<CartItem> List { get; set; }

        public int Count { get; set; }

        public long TotalAmount { get; set; }

        public CartItem find(long ID)
        {
            return List.Where(m => m.ID == ID).FirstOrDefault();
        }
        public int Remove(long ID)
        {
            var found = List.Where(m => m.ID == ID).FirstOrDefault();
            if (found != null)
            {
                this.TotalAmount = this.TotalAmount - found.Pricing;
                this.Count = this.Count - 1;
                List.Remove(found);
                UpdateCount();
                return 1;
            }
            else
            {
                return 0;
            }

        }
        private void UpdateCount()
        {
            this.Count = 0;
            this.TotalAmount = 0;
            foreach (var o in List)
            {
                this.Count += 1;
                this.TotalAmount += o.Pricing;
            }
        }
        public void AddUpdateCart(CartItem obj, gModels.Cart cart)
        {
            var found = List.Where(m => m.ID == obj.ID).FirstOrDefault();
            if (found == null)
            {
                List.Add(obj);
                Count = Count + 1;
                TotalAmount = TotalAmount + obj.Pricing;
            }
            else
            {
                if (obj.Quantity == 0)
                {
                    List.Remove(found);
                }
                else
                { 
                    found.Quantity = obj.Quantity;
                    found.Pricing = found.Quantity * found.Price;
                    TotalAmount = UpdateTotalAmount(cart);
                }

            }
        }
        private long UpdateTotalAmount(gModels.Cart cart)
        {
            long total = 0;
            foreach(var a in cart.List)
            {
                total += a.Pricing;
            }
            return total;
        }
    }
    public class CartItem
    {
        public long ID { get; set; }
        public string Color { get; set; }
        public string Size { get; set; }
        public int Quantity { get; set; }
        public long Price { get; set; }
        public long Pricing { get; set; }//thành tiền
        public gModels.gObject Object { get; set; }
    }
}