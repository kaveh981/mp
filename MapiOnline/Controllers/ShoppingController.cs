using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MapiOnline.Models;
using System.Web.Security;
using System.Xml.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Net.Security;
using MvcInternationalization.Controllers;
using System.IO;
namespace MapiOnline.Controllers
{
    public class ShoppingController : BaseController
    {
        MapiDBEntities db = new MapiDBEntities();

        public ActionResult CheckShoppingCart()
        {
            if (User.Identity.IsAuthenticated)
            {
                string currUsername = User.Identity.Name;
                int currPersonId = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == currUsername).p_Customer.FirstOrDefault().AccountId;
                return Json(new
                {
                    isdone = true,
                    result = db.ac_ShoppingCartDetails.Any(sd => sd.ac_ShoppingCart.CustomerId == currPersonId)
                });
            }
            else if (Session["shoppingCartId"] != null)
            {
                int shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                return Json(new
                {
                    isdone = true,
                    result = db.ac_ShoppingCartDetails.Any(sd => sd.ShoppingCartId == shoppingCartId)
                });
            }
            else
                return Json(new { isdone = true, result = false });
        }

        public ActionResult ShoppingCartSummary()
        {
            if (User.Identity.IsAuthenticated)
            {
                string currUsername = User.Identity.Name;
                var customer = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == currUsername).p_Customer.FirstOrDefault();
                if (customer == null)
                    return Json(new
                  {
                      isdone = false
                  });
                int currPersonId = customer.AccountId;
                var shoppingdt = db.ac_ShoppingCartDetails.Where(sd => sd.ac_ShoppingCart.CustomerId == currPersonId);
                decimal totalAmount = 0;
                var simShopdt = shoppingdt.Where(sd => sd.ac_ShoppingCartDetails1.Count == 0 && sd.ChildShoppingCartDetailsId == null);
                if (simShopdt.Count() > 0)
                    totalAmount += simShopdt.Sum(sd => sd.Quantity * sd.Price);
                if (shoppingdt.Any(sd => sd.ac_ShoppingCartDetails1.Count > 0))
                {
                    foreach (var shopdtItms in shoppingdt.Where(sd => sd.ac_ShoppingCartDetails1.Count > 0))
                    {
                        totalAmount += shopdtItms.ac_ShoppingCartDetails1.Sum(sd => sd.Quantity * sd.Price) * shopdtItms.Quantity;
                        totalAmount += shopdtItms.Price * shopdtItms.Quantity;
                    }
                }
                decimal discount = 0;
                if (totalAmount > 100000 && totalAmount <= 200000)
                    discount = totalAmount * 1 / 100;
                else if (totalAmount > 200000)
                    discount = totalAmount * 2 / 100;
                else if (totalAmount <= 100000)
                    discount = 0;
                decimal? quantity = shoppingdt.Where(sd => sd.ChildShoppingCartDetailsId == null).Sum(sd => (decimal?)sd.Quantity);

                //hazine peik
                string appName = Membership.ApplicationName;
                decimal deliveryExpense = db.ApplicationDetails.Single(a => a.AppName == appName).DeliveryExpense.Value;
                //Session["se-deliveryExpense"] = deliveryExpense;

                return Json(new
                {
                    isdone = true,
                    details = shoppingdt.AsEnumerable().Where(sd => sd.ChildShoppingCartDetailsId == null).Select(sd => new
                    {
                        sd.inv_ItemDetail.inv_Barcode.inv_MeasureUnit.UnitType,
                        sd.Quantity,
                        sd.Price,
                        TotalPrice = sd.ac_ShoppingCartDetails1.Count == 0 ? sd.Price : (sd.ac_ShoppingCartDetails1.Sum(sdIt => sdIt.Quantity * sdIt.Price) + sd.Price),
                        sd.inv_ItemDetail.inv_Barcode.Barcode,
                        sd.inv_ItemDetail.inv_Barcode.Name,
                        sd.inv_ItemDetail.inv_Barcode.aspnet_Applications.ApplicationName,
                        sd.ShoppingCartDetailsId,
                        sd.inv_ItemDetail.BarcodeId,
                        Size = sd.inv_ItemDetail.inv_Size.Count > 0 ? sd.inv_ItemDetail.inv_Size.FirstOrDefault().Size : "",
                        Color = sd.inv_ItemDetail.inv_Color.Count > 0 ? sd.inv_ItemDetail.inv_Color.FirstOrDefault().Color : ""
                    }),
                    quantity = quantity != null ? quantity : 0,
                    totalAmount = totalAmount,
                    discount = discount,
                    finalAmount = totalAmount + deliveryExpense - discount

                });
            }
            else if (Session["shoppingCartId"] != null)
            {
                int shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                var shoppingdt = db.ac_ShoppingCartDetails.Where(sd => sd.ShoppingCartId == shoppingCartId);
                decimal totalAmount = 0;
                var simShopdt = shoppingdt.Where(sd => sd.ac_ShoppingCartDetails1.Count == 0 && sd.ChildShoppingCartDetailsId == null);
                if (simShopdt.Count() > 0)
                    totalAmount += simShopdt.Sum(sd => sd.Quantity * sd.Price);
                if (shoppingdt.Any(sd => sd.ac_ShoppingCartDetails1.Count > 0))
                {
                    foreach (var shopdtItms in shoppingdt.Where(sd => sd.ac_ShoppingCartDetails1.Count > 0))
                    {
                        totalAmount += shopdtItms.ac_ShoppingCartDetails1.Sum(sd => sd.Quantity * sd.Price) * shopdtItms.Quantity;
                        totalAmount += shopdtItms.Price * shopdtItms.Quantity;
                    }
                }
                decimal discount = 0;
                if (totalAmount > 100000 && totalAmount <= 200000)
                    discount = totalAmount * 1 / 100;
                else if (totalAmount > 200000)
                    discount = totalAmount * 2 / 100;
                else if (totalAmount <= 100000)
                    discount = 0;
                decimal? quantity = shoppingdt.Where(sd => sd.ChildShoppingCartDetailsId == null).Sum(sd => (decimal?)sd.Quantity);

                //hazine peik
                string appName = Membership.ApplicationName;
                decimal deliveryExpense = db.ApplicationDetails.Single(a => a.AppName == appName).DeliveryExpense.Value;
                //Session["se-deliveryExpense"] = deliveryExpense;

                return Json(new
                {
                    isdone = true,
                    details = shoppingdt.AsEnumerable().Where(sd => sd.ChildShoppingCartDetailsId == null).Select(sd => new
                    {
                        sd.inv_ItemDetail.inv_Barcode.inv_MeasureUnit.UnitType,
                        sd.Quantity,
                        sd.Price,
                        TotalPrice = sd.ac_ShoppingCartDetails1.Count == 0 ? sd.Price : (sd.ac_ShoppingCartDetails1.Sum(sdIt => sdIt.Quantity * sdIt.Price) + sd.Price),
                        sd.inv_ItemDetail.inv_Barcode.Barcode,
                        sd.inv_ItemDetail.inv_Barcode.Name,
                        sd.inv_ItemDetail.inv_Barcode.aspnet_Applications.ApplicationName,
                        sd.ShoppingCartDetailsId,
                        sd.inv_ItemDetail.BarcodeId,
                        Size = sd.inv_ItemDetail.inv_Size.Count > 0 ? sd.inv_ItemDetail.inv_Size.FirstOrDefault().Size : null,
                        Color = sd.inv_ItemDetail.inv_Color.Count > 0 ? sd.inv_ItemDetail.inv_Color.FirstOrDefault().Color : null
                    }),
                    quantity = quantity != null ? quantity : 0,
                    totalAmount = totalAmount,
                    discount = discount,
                    finalAmount = totalAmount + deliveryExpense - discount
                });
            }
            else
                return Json(new { isdone = false, msg = "سبد خرید خالی است." });
        }

        public ActionResult AddToShoppingCart(int barcodeId, int count, int? sizeId, int? colorId)
        {
            Session["orderHeaderId"] = null;
            ac_ShoppingCart shoppingCart = new ac_ShoppingCart();
            ac_ShoppingCart usershoppingcart = null;
            int? currPersonId = null;
            if (User.Identity.IsAuthenticated)
            {
                string currUsername = User.Identity.Name;
                currPersonId = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == currUsername).p_Customer.FirstOrDefault().AccountId;
                usershoppingcart = db.ac_ShoppingCart.SingleOrDefault(s => s.CustomerId == currPersonId);
            }
            //if (Session["shoppingCartId"] == null && usershoppingcart == null)
            //{
            //    ac_ShoppingCartDetails shoppingCartDetails = new ac_ShoppingCartDetails();
            //    if (colorId == null && sizeId == null)
            //    {
            //        var itemDetail = db.inv_ItemDetail.Where(i => i.inv_ItemLocation.Sum(s => (decimal?)s.Quantity) >= count && i.BarcodeId == barcodeId).FirstOrDefault();
            //        if (itemDetail == null)
            //            return Json(new
            //            {
            //                totalQuantity = 0,
            //                totalPrice = 0
            //            });
            //        shoppingCartDetails.ItemDetailId = itemDetail.ItemDetailId;

            //        var price = db.inv_Barcode.SingleOrDefault(b => b.BarcodeId == barcodeId).inv_Price.OrderByDescending(p => p.Date).FirstOrDefault();
            //        shoppingCartDetails.Price = price.Online != null ? price.Online.Value : price.Regular;
            //    }
            //    shoppingCartDetails.Quantity = count;
            //    shoppingCart.Date = DateTime.Now;
            //    if (currPersonId != null)
            //        shoppingCart.CustomerId = currPersonId;
            //    db.ac_ShoppingCart.AddObject(shoppingCart);
            //    shoppingCart.ac_ShoppingCartDetails.Add(shoppingCartDetails);
            //}
            //else
            //{
            if (Session["shoppingCartId"] != null)
            {
                Int32 shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                shoppingCart = db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId);
            }
            else if (usershoppingcart != null)
            {
                shoppingCart = usershoppingcart;
            }
            ac_ShoppingCartDetails shoppingCartDetails = new ac_ShoppingCartDetails();
            if (colorId == null && sizeId == null)
            {
                bool itemHasColorSize = db.inv_ItemDetail.Any(b => b.BarcodeId == barcodeId && (b.inv_Size.Count > 0 || b.inv_Color.Count > 0));
                if (itemHasColorSize)
                    return Json(new { hascolorsize = true });
                var itemDetail = db.inv_ItemDetail.Where(i => i.inv_ItemLocation.Sum(s => (decimal?)s.Quantity) >= 0 && i.BarcodeId == barcodeId).FirstOrDefault();
                if (itemDetail == null)
                    return Json(new { totalQuantity = 0 });

                var shoppingdt = db.ac_ShoppingCartDetails.SingleOrDefault(sd => sd.ItemDetailId == itemDetail.AccountId && sd.ShoppingCartId == shoppingCart.ShoppingCartId && sd.ChildShoppingCartDetailsId == null);

                if (shoppingdt == null)
                {
                    shoppingCartDetails.ItemDetailId = itemDetail.AccountId;
                    var price = db.inv_Barcode.SingleOrDefault(b => b.BarcodeId == barcodeId).inv_Price.OrderByDescending(p => p.Date).FirstOrDefault();
                    if (User.Identity.IsAuthenticated)
                    {
                        string username = User.Identity.Name;
                        List<string> roles = utility.GetUserRoles(db, username, Membership.ApplicationName);
                        if (roles.Contains("isWholesaleBuyer"))
                            shoppingCartDetails.Price = price.Wholesale != null ? price.Wholesale.Value : (price.Online != null ? price.Online.Value : price.Regular);
                        else if (roles.Contains("isFriend"))
                            shoppingCartDetails.Price = price.Freinds != null ? price.Freinds.Value : (price.Online != null ? price.Online.Value : price.Regular);
                        else
                            shoppingCartDetails.Price = price.Online != null ? price.Online.Value : price.Regular;
                    }
                    else
                        shoppingCartDetails.Price = price.Online != null ? price.Online.Value : price.Regular;
                    shoppingCartDetails.Quantity = count;
                    if (db.inv_ItemDetail.Single(i => i.AccountId == itemDetail.AccountId).inv_ItemLocation.Sum(s => s.Quantity) < 1)
                        return Json(new { totalQuantity = 0 });
                    shoppingCart.ac_ShoppingCartDetails.Add(shoppingCartDetails);
                }
                else
                {
                    //shoppingCartDetails.inv_ItemDetail.AccountId = itemDetail.AccountId;
                    var itm = shoppingCart.ac_ShoppingCartDetails.Single(a => a.ItemDetailId == itemDetail.AccountId);
                    if (itm.inv_ItemDetail.inv_ItemLocation.Sum(q => (decimal?)q.Quantity) < shoppingdt.Quantity + count)
                        return Json(new { totalQuantity = 0 });
                    itm.Quantity += count;
                    //shoppingdt.Quantity += count;
                }
            }
            else if (colorId != null && sizeId != null)
            {
                var itemDetail = db.inv_ItemDetail.SingleOrDefault(i => i.inv_ItemLocation.Sum(s => (decimal?)s.Quantity) >= count && i.BarcodeId == barcodeId &&
                                                                                          i.inv_Color.Any(c => c.ColorId == colorId) &&
                                                                                          i.inv_Size.Any(c => c.SizeId == sizeId));
                if (itemDetail == null)
                    return Json(new
                    {
                        totalQuantity = 0
                    });

                var shoppingdt = db.ac_ShoppingCartDetails.SingleOrDefault(sd => sd.ItemDetailId == itemDetail.AccountId && sd.ShoppingCartId == shoppingCart.ShoppingCartId && sd.ChildShoppingCartDetailsId == null);
                if (shoppingdt == null)
                {
                    shoppingCartDetails.ItemDetailId = itemDetail.AccountId;
                    var price = db.inv_Barcode.SingleOrDefault(b => b.BarcodeId == barcodeId).inv_Price.OrderByDescending(p => p.Date).FirstOrDefault();
                    if (User.Identity.IsAuthenticated)
                    {
                        shoppingCartDetails.ItemDetailId = itemDetail.AccountId;
                        string username = User.Identity.Name;
                        List<string> roles = utility.GetUserRoles(db, username, Membership.ApplicationName);
                        if (roles.Contains("isWholesaleBuyer"))
                            shoppingCartDetails.Price = (itemDetail.DetailPrice != null ? itemDetail.DetailPrice.Value : 0) +
                                (price.Wholesale != null ? price.Wholesale.Value : (price.Online != null ? price.Online.Value : price.Regular));
                        else if (roles.Contains("isFriend"))
                            shoppingCartDetails.Price = (itemDetail.DetailPrice != null ? itemDetail.DetailPrice.Value : 0) +
                                (price.Freinds != null ? price.Freinds.Value : (price.Online != null ? price.Online.Value : price.Regular));
                        else
                            shoppingCartDetails.Price = (itemDetail.DetailPrice != null ? itemDetail.DetailPrice.Value : 0) + (price.Online != null ? price.Online.Value : price.Regular);
                    }
                    else
                        shoppingCartDetails.Price = (itemDetail.DetailPrice != null ? itemDetail.DetailPrice.Value : 0) + (price.Online != null ? price.Online.Value : price.Regular);
                    shoppingCartDetails.Quantity = count;
                    shoppingCart.ac_ShoppingCartDetails.Add(shoppingCartDetails);
                }
                else
                {
                    var itm = shoppingCart.ac_ShoppingCartDetails.Single(a => a.ItemDetailId == itemDetail.AccountId);
                    if (itm.inv_ItemDetail.inv_ItemLocation.Sum(q => (decimal?)q.Quantity) < shoppingdt.Quantity + count)
                        return Json(new { totalQuantity = 0 });
                    itm.Quantity += count;
                }
            }
            else if (colorId == null)
            {
                var itemDetail = db.inv_ItemDetail.SingleOrDefault(i => i.inv_ItemLocation.Sum(s => (decimal?)s.Quantity) >= count && i.BarcodeId == barcodeId &&
                                                                                          i.inv_Size.Any(c => c.SizeId == sizeId));
                if (itemDetail == null)
                    return Json(new { totalQuantity = 0 });

                var shoppingdt = db.ac_ShoppingCartDetails.SingleOrDefault(sd => sd.ItemDetailId == itemDetail.AccountId && sd.ShoppingCartId == shoppingCart.ShoppingCartId && sd.ChildShoppingCartDetailsId == null);
                if (shoppingdt == null)
                {
                    shoppingCartDetails.ItemDetailId = itemDetail.AccountId;
                    var price = db.inv_Barcode.SingleOrDefault(b => b.BarcodeId == barcodeId).inv_Price.OrderByDescending(p => p.Date).FirstOrDefault();
                    if (User.Identity.IsAuthenticated)
                    {
                        string username = User.Identity.Name;
                        List<string> roles = utility.GetUserRoles(db, username, Membership.ApplicationName);
                        if (roles.Contains("isWholesaleBuyer"))
                            shoppingCartDetails.Price = price.Wholesale != null ? (price.Wholesale.Value + itemDetail.DetailPrice.Value) : (price.Online != null ? (price.Online.Value + itemDetail.DetailPrice.Value) : (price.Regular + itemDetail.DetailPrice.Value));
                        else if (roles.Contains("isFriend"))
                            shoppingCartDetails.Price = price.Freinds != null ? (price.Freinds.Value + itemDetail.DetailPrice.Value) : (price.Online != null ? (price.Online.Value + itemDetail.DetailPrice.Value) : (price.Regular + itemDetail.DetailPrice.Value));
                        else
                            shoppingCartDetails.Price = price.Online != null ? (price.Online.Value + itemDetail.DetailPrice.Value) : (price.Regular + itemDetail.DetailPrice.Value);
                    }
                    else
                        shoppingCartDetails.Price = price.Online != null ? (price.Online.Value + itemDetail.DetailPrice == null ? 0 : itemDetail.DetailPrice.Value) : (price.Regular + itemDetail.DetailPrice == null ? 0 : itemDetail.DetailPrice.Value);
                    shoppingCartDetails.Quantity = count;
                    shoppingCart.ac_ShoppingCartDetails.Add(shoppingCartDetails);
                }
                else
                {
                    var itm = shoppingCart.ac_ShoppingCartDetails.Single(a => a.ItemDetailId == itemDetail.AccountId);
                    if (itm.inv_ItemDetail.inv_ItemLocation.Sum(q => (decimal?)q.Quantity) < shoppingdt.Quantity + count)
                        return Json(new { totalQuantity = 0 });
                    itm.Quantity += count;
                }
            }
            else if (sizeId == null)
            {
                var itemDetail = db.inv_ItemDetail.SingleOrDefault(i => i.inv_ItemLocation.Sum(s => (decimal?)s.Quantity) >= count && i.BarcodeId == barcodeId &&
                                                                                          i.inv_Color.Any(c => c.ColorId == colorId));
                if (itemDetail == null)
                    return Json(new { totalQuantity = 0 });

                var shoppingdt = db.ac_ShoppingCartDetails.SingleOrDefault(sd => sd.ItemDetailId == itemDetail.AccountId && sd.ShoppingCartId == shoppingCart.ShoppingCartId && sd.ChildShoppingCartDetailsId == null);
                if (shoppingdt == null)
                {
                    shoppingCartDetails.ItemDetailId = itemDetail.AccountId;
                    var price = db.inv_Barcode.SingleOrDefault(b => b.BarcodeId == barcodeId).inv_Price.OrderByDescending(p => p.Date).FirstOrDefault();
                    if (User.Identity.IsAuthenticated)
                    {
                        string username = User.Identity.Name;
                        List<string> roles = utility.GetUserRoles(db, username, Membership.ApplicationName);
                        if (roles.Contains("isWholesaleBuyer"))
                            shoppingCartDetails.Price = price.Wholesale != null ? price.Wholesale.Value : (price.Online != null ? price.Online.Value : price.Regular);
                        else if (roles.Contains("isFriend"))
                            shoppingCartDetails.Price = price.Freinds != null ? price.Freinds.Value : (price.Online != null ? price.Online.Value : price.Regular);
                        else
                            shoppingCartDetails.Price = price.Online != null ? price.Online.Value : price.Regular;
                    }
                    else
                        shoppingCartDetails.Price = price.Online != null ? price.Online.Value : price.Regular;
                    shoppingCartDetails.Quantity = count;
                    shoppingCart.ac_ShoppingCartDetails.Add(shoppingCartDetails);
                }
                else
                {
                    var itm = shoppingCart.ac_ShoppingCartDetails.Single(a => a.ItemDetailId == itemDetail.AccountId);
                    if (itm.inv_ItemDetail.inv_ItemLocation.Sum(q => (decimal?)q.Quantity) < shoppingdt.Quantity + count)
                        return Json(new { totalQuantity = 0 });
                    itm.Quantity += count;
                }
            }
            //}
            if (currPersonId != null)
                shoppingCart.CustomerId = currPersonId;
            if (Session["shoppingCartId"] == null && (currPersonId == null || shoppingCart.ShoppingCartId == 0))
            {
                shoppingCart.Date = DateTime.Now;
                db.ac_ShoppingCart.AddObject(shoppingCart);
            }
            db.SaveChanges();
            if (currPersonId == null)
                Session["shoppingCartId"] = shoppingCart.ShoppingCartId;
            var shopdt = db.ac_ShoppingCartDetails.Where(sd => sd.ShoppingCartId == shoppingCart.ShoppingCartId).Select(sd => new { sd.Quantity, sd.Price });
            decimal? totalQuantity = shopdt.Sum(sd => sd.Quantity);
            return Json(new
            {
                totalQuantity = totalQuantity
            });
        }

        public ActionResult GetTotalQuantity()
        {
            string appName = Membership.ApplicationName;
            decimal? deliveryExpense = db.ApplicationDetails.Single(a => a.AppName == appName).DeliveryExpense;
            if (Session["orderHeaderId"] != null)
            {
                int orderHeaderId = Convert.ToInt32(Session["orderHeaderId"]);
                var orderHeader = db.ac_OrderHeader.SingleOrDefault(p => p.OrderHeaderId == orderHeaderId);
                return Json(new { quantity = orderHeader.ac_AccountDetail.Where(a => a.ac_OrderDetail != null).Sum(s => s.ac_OrderDetail.Quantity), totalAmount = Math.Abs(orderHeader.ac_AccountDetail.Where(a => a.ac_OrderDetail != null).Sum(s => s.ac_OrderDetail.ac_AccountDetail1.Amount.Value)), discount = orderHeader.ac_ReceiverDetails.DiscountAmount, finalAmount = Math.Abs(orderHeader.Amount), deliveryExpense });
            }
            if (User.Identity.IsAuthenticated)
            {

                string currUsername = User.Identity.Name;
                int currPersonId = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == currUsername).p_Customer.FirstOrDefault().AccountId;
                if (Session["orderHeaderId"] != null)
                {
                    int orderHeaderId = Convert.ToInt32(Session["orderHeaderId"]);
                    var orderHeader = db.ac_OrderHeader.SingleOrDefault(p => p.p_Person.AccountId == currPersonId && p.OrderHeaderId == orderHeaderId);
                    return Json(new { quantity = orderHeader.ac_AccountDetail.Where(a => a.ac_OrderDetail != null).Sum(s => s.ac_OrderDetail.Quantity), totalAmount = Math.Abs(orderHeader.ac_AccountDetail.Where(a => a.ac_OrderDetail != null).Sum(s => s.Amount).Value), discount = orderHeader.ac_ReceiverDetails.DiscountAmount, finalAmount = Math.Abs(orderHeader.ac_AccountDetail.Where(a => a.ac_OrderDetail != null).Sum(s => s.Amount).Value) - deliveryExpense - orderHeader.ac_ReceiverDetails.DiscountAmount, deliveryExpense });
                }
                else
                {
                    var shoppingdt = db.ac_ShoppingCartDetails.Where(sd => sd.ac_ShoppingCart.CustomerId == currPersonId);
                    if (shoppingdt.Count() > 0)
                    {
                        decimal totalAmount = 0;
                        var simShopdt = shoppingdt.Where(sd => sd.ac_ShoppingCartDetails1.Count == 0 && sd.ChildShoppingCartDetailsId == null);
                        if (simShopdt.Count() > 0)
                            totalAmount += simShopdt.Sum(sd => sd.Quantity * sd.Price);
                        if (shoppingdt.Any(sd => sd.ac_ShoppingCartDetails1.Count > 0))
                        {
                            foreach (var shopdtItms in shoppingdt.Where(sd => sd.ac_ShoppingCartDetails1.Count > 0))
                            {
                                totalAmount += shopdtItms.ac_ShoppingCartDetails1.Sum(sd => sd.Quantity * sd.Price) * shopdtItms.Quantity;
                                totalAmount += shopdtItms.Price * shopdtItms.Quantity;
                            }
                        }
                        decimal discount = 0;
                        if (totalAmount > 100000 && totalAmount <= 200000)
                            discount = totalAmount * 1 / 100;
                        else if (totalAmount > 200000)
                            discount = totalAmount * 2 / 100;
                        else if (totalAmount <= 100000)
                            discount = 0;
                        decimal? quantity = shoppingdt.Where(sd => sd.ChildShoppingCartDetailsId == null).Sum(sd => (decimal?)sd.Quantity);

                        //hazine peik

                        //Session["se-deliveryExpense"] = deliveryExpense;


                        return Json(new { quantity = quantity != null ? quantity : 0, totalAmount = totalAmount, discount = discount, finalAmount = totalAmount + deliveryExpense - discount, deliveryExpense });
                    }

                    else
                        return Json(new { quantity = 0, totalAmount = 0, discount = 0, finalAmount = 0, deliveryExpense = 0 });
                }
            }
            else if (Session["shoppingCartId"] != null)
            {
                Int32 shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                var shoppingdt = db.ac_ShoppingCartDetails.Where(sd => sd.ShoppingCartId == shoppingCartId);
                decimal totalAmount = 0;
                var simShopdt = shoppingdt.Where(sd => sd.ac_ShoppingCartDetails1.Count == 0 && sd.ChildShoppingCartDetailsId == null);
                if (simShopdt.Count() > 0)
                    totalAmount += simShopdt.Sum(sd => sd.Quantity * sd.Price);
                if (shoppingdt.Any(sd => sd.ac_ShoppingCartDetails1.Count > 0))
                {
                    foreach (var shopdtItms in shoppingdt.Where(sd => sd.ac_ShoppingCartDetails1.Count > 0))
                    {
                        totalAmount += shopdtItms.ac_ShoppingCartDetails1.Sum(sd => sd.Quantity * sd.Price) * shopdtItms.Quantity;
                        totalAmount += shopdtItms.Price * shopdtItms.Quantity;
                    }
                }
                decimal discount = 0;
                if (totalAmount > 100000 && totalAmount <= 200000)
                    discount = totalAmount * 1 / 100;
                else if (totalAmount > 200000)
                    discount = totalAmount * 2 / 100;
                else if (totalAmount <= 100000)
                    discount = 0;
                decimal? quantity = shoppingdt.Where(sd => sd.ChildShoppingCartDetailsId == null).Sum(sd => (decimal?)sd.Quantity);


                //Session["se-deliveryExpense"]=deliveryExpense;

                return Json(new { quantity = quantity != null ? quantity : 0, totalAmount = totalAmount, discount = discount, finalAmount = totalAmount + deliveryExpense - discount, deliveryExpense });
            }
            else
                return Json(new { quantity = 0, totalAmount = 0, discount = 0, finalAmount = 0, deliveryExpense = 0 });
        }
        public ActionResult ShoppingCart()
        {

            //hazine peik

            string appName = Membership.ApplicationName;
            decimal deliveryExpense = db.ApplicationDetails.Single(a => a.AppName == appName).DeliveryExpense.Value;
            ac_ShoppingCart shoppingcart = null;
            bool islogon = User.Identity.IsAuthenticated;
            if (islogon)
            {
                string currUsername = User.Identity.Name;
                int currPersonId = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == currUsername).p_Customer.FirstOrDefault().AccountId;
                shoppingcart = db.ac_ShoppingCart.SingleOrDefault(s => s.CustomerId == currPersonId);
            }
            else if (Session["shoppingCartId"] != null)
            {
                int shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                shoppingcart = db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId);
            }
            if (shoppingcart != null)
            {
                return View(db.ac_ShoppingCartDetails.Where(sd => sd.ShoppingCartId == shoppingcart.ShoppingCartId).ToList()
                    .Select(sd => new ShoppingCartDetailsModel()
                    {
                        //ProductCount=sd.ac_ShoppingCart.ac_ShoppingCartDetails.Sum(a=>a.Quantity),
                        shoppingCartDetails = sd,
                        colorDetailsAvailable = sd.inv_ItemDetail.inv_Barcode.inv_ItemDetail.Where(d => d.inv_Color.Count > 0 && d.inv_ItemLocation.Sum(s => s.Quantity) > 0).Select(c => new { detailPrice = c.DetailPrice, colorId = c.inv_Color.FirstOrDefault().ColorId, color = c.inv_Color.FirstOrDefault().Color }).Distinct()
                    .Select(a => new colorsizeModel()
                    {
                        pricedetails = a.detailPrice,
                        id = a.colorId,
                        name = a.color,
                    }).ToList(),
                        selectedColorId = sd.inv_ItemDetail.inv_Color.Count() > 0 ? (int?)sd.inv_ItemDetail.inv_Color.FirstOrDefault().ColorId : null,
                        selectedColor = sd.inv_ItemDetail.inv_Color.Count() > 0 ? sd.inv_ItemDetail.inv_Color.FirstOrDefault().Color : "",
                        sizeDetailsAvailable = sd.inv_ItemDetail.inv_Color.Count() > 0 ? sd.inv_ItemDetail.inv_Barcode.inv_ItemDetail.Where(d => d.inv_Color.Any(c => c.ColorId == sd.inv_ItemDetail.inv_Color.FirstOrDefault().ColorId) && d.inv_Size.Count > 0 && d.inv_ItemLocation.Sum(s => s.Quantity) > 0).Select(s => new { detailPrice = s.DetailPrice, sizeId = s.inv_Size.FirstOrDefault().SizeId, size = s.inv_Size.FirstOrDefault().Size }).Distinct()
                    .Select(a => new colorsizeModel()
                    {
                        pricedetails = a.detailPrice,
                        id = a.sizeId,
                        name = a.size,
                    }).ToList() :
                    sd.inv_ItemDetail.inv_Barcode.inv_ItemDetail.Where(d => d.inv_Size.Count > 0 && d.inv_ItemLocation.Sum(s => s.Quantity) > 0).Select(s => new { detailPrice = s.DetailPrice, sizeId = s.inv_Size.FirstOrDefault().SizeId, size = s.inv_Size.FirstOrDefault().Size }).Distinct()
                    .Select(a => new colorsizeModel()
                    {
                        pricedetails = a.detailPrice,
                        id = a.sizeId,
                        name = a.size,
                    }).ToList(),
                        selectedSizeId = sd.inv_ItemDetail.inv_Size.Count() > 0 ? (int?)sd.inv_ItemDetail.inv_Size.FirstOrDefault().SizeId : null,
                        selectedSize = sd.inv_ItemDetail.inv_Size.Count() > 0 ? sd.inv_ItemDetail.inv_Size.FirstOrDefault().Size : "",
                        Quantity = sd.inv_ItemDetail.inv_ItemLocation.Sum(q => (decimal?)q.Quantity) <= 20 ? sd.inv_ItemDetail.inv_ItemLocation.Sum(q => (decimal?)q.Quantity) : 20,
                        selectedQuantity = sd.Quantity,
                        isLogon = islogon,
                        deliveryExpense = deliveryExpense
                    }));
            }
            else
                return RedirectToAction("Index", "Home");
            // return Json(new { isdone = false, msg = "سبد خرید خالی است." });


        }


        public static string getInvoiceNumber()
        {
            //var last = new MapiDBEntities().ac_OrderHeader.OrderByDescending(o => o.OrderHeaderId).FirstOrDefault();
            // return (last!=null ?
            //     (last.OrderHeaderId+1000000000).ToString() : "1001").ToString();
        
            return (new MapiDBEntities().ac_OrderHeader.Count() > 0 ?
                  (new Random().Next(100000000, 990000000) + 1000 + DateTime.Now.Second).ToString() : "1001").ToString();
        }
        //[HttpPost]
        //public ActionResult ShoppingCart(int sendtype, string name, string family, string phone, string mobile, int city, string addressStr,
        //                              string postcode, string timesend, string datesend, string description, bool? isGift, string giftnote,
        //                              bool? gift, int paymenttype, string sname, string sfamily, string sphone, string smobile, string sendto, bool? gender, bool? sgender)
        //{
        //    string userName = "";
        //    int personId = 0;
        //    int? shopId = null;
        //    if (User.Identity.IsAuthenticated)
        //    {
        //        userName = User.Identity.Name;
        //        personId = db.aspnet_Membership.FirstOrDefault(m => m.aspnet_Users.UserName == userName).p_Customer.FirstOrDefault().PersonId;
        //        if (!db.ac_ShoppingCart.Any(s => s.CustomerId == personId))
        //            return RedirectToAction("Index", "Home");
        //    }
        //    else
        //    {
        //        string phoneNumber = "", mobileNumber = "";
        //        if (sendto == "others")
        //        {
        //            phoneNumber = sphone;
        //            mobileNumber = smobile;
        //        }
        //        else if (sendto == "myself")
        //        {
        //            phoneNumber = phone;
        //            mobileNumber = mobile;
        //        }
        //        var oldperson = db.p_Phone.Where(p => p.Number == phoneNumber || p.Number == mobileNumber);
        //        if (Session["shoppingCartId"] == null)
        //            return RedirectToAction("Index", "Home");
        //        shopId = Convert.ToInt32(Session["shoppingCartId"]);
        //        var shoppingcart = db.ac_ShoppingCart.FirstOrDefault(s => s.ShoppingCartId == shopId);

        //        if (oldperson.Count() == 0 || oldperson.FirstOrDefault().p_Person.p_Customer == null)
        //        {
        //            var app = db.aspnet_Applications.FirstOrDefault(a => a.ApplicationName == Membership.ApplicationName);
        //            p_Person per = new p_Person();
        //            var pcode = db.p_Person.Where(p => p.PersonId == p.p_Customer.PersonId);
        //            var co = pcode.Count() > 0 ? pcode.OrderByDescending(c => c.PersonId).Select(c => c.Code).First() : "9998";
        //            co = co.Replace("c", "");
        //            co = "c" + (int.Parse(co) + 2).ToString();
        //            per.Code = co;
        //            per.aspnet_Applications = app;//.ApplicationId,
        //            per.RegDate = DateTime.Now;
        //            p_Customer customer = new p_Customer();
        //            if (sendto == "others")
        //            {
        //                per.Name = sname;
        //                per.Family = sfamily;
        //                per.Gender = sgender.Value;
        //                if (!string.IsNullOrEmpty(sphone))
        //                    per.p_Phone.Add(new p_Phone() { Number = sphone, Cell = false });
        //                if (!string.IsNullOrEmpty(smobile))
        //                    per.p_Phone.Add(new p_Phone() { Number = smobile, Cell = true });
        //            }
        //            if (sendto == "myself")
        //            {
        //                per.Name = name;
        //                per.Family = family;
        //                per.Gender = gender.Value;
        //                per.RegDate = DateTime.Now; if (!string.IsNullOrEmpty(phone))
        //                    per.p_Phone.Add(new p_Phone() { Number = phone, Cell = false });
        //                if (!string.IsNullOrEmpty(mobile))
        //                    per.p_Phone.Add(new p_Phone() { Number = mobile, Cell = true });
        //                per.AddressId = city;
        //                customer.Address = addressStr;
        //                customer.PostalCode = postcode;
        //            }
        //            customer.NetBuy = 0;
        //            customer.NetPayment = 0;
        //            customer.ac_ShoppingCart.Add(shoppingcart);
        //            customer.RegistererId = app.ApplicationDetail.EmployeeId;
        //            per.p_Customer = customer;
        //            db.p_Person.AddObject(per);
        //            db.SaveChanges();
        //            personId = per.PersonId;
        //        }
        //        else
        //        {
        //            personId = oldperson.FirstOrDefault().p_Person.p_Customer.PersonId;
        //            var shopCart = db.ac_ShoppingCart.Where(c => c.CustomerId == personId);
        //            if (shopCart.Count() > 0)
        //            {
        //                foreach (var item in shopCart.ToList())
        //                {
        //                    foreach (var detail in item.ac_ShoppingCartDetails.ToList())
        //                    {
        //                        if (detail.ac_ShoppingCartDetails1.Count > 0)
        //                        {
        //                            foreach (var details in detail.ac_ShoppingCartDetails1.ToList())
        //                            {
        //                                db.ac_ShoppingCartDetails.DeleteObject(details);
        //                            }
        //                        }
        //                        db.ac_ShoppingCartDetails.DeleteObject(detail);
        //                    }
        //                    db.ac_ShoppingCart.DeleteObject(item);
        //                }
        //            }
        //            shoppingcart.CustomerId = personId;
        //            db.SaveChanges();
        //        }

        //    }
        //    //return View("Index", "Home");
        //    var r = db.ac_OrderHeader.OrderByDescending(d => d.Date).Where(i => i.InvoiceNO.Contains("AOP-"));
        //    string invoiceNo = "AOP-" + (r.Count() > 0 ? (Convert.ToInt32(r.FirstOrDefault().InvoiceNO.Split('-')[1]) + 1).ToString() : "1");
        //    if (paymenttype != 1)
        //    {
        //        ac_OrderHeader payment = new ac_OrderHeader();
        //        payment = ConfirmNotPaidOrder(sendtype, name, family, phone, mobile, city, addressStr, postcode, timesend, datesend, description, isGift,
        //                                      giftnote, gift, paymenttype, invoiceNo, personId);
        //        payment.ac_ReceiverDetails.Address = utility.getStrAddress(db.GetParentAddressById(payment.ac_ReceiverDetails.AddressID, "")) + "-> " + payment.ac_ReceiverDetails.Address;
        //        //return RedirectToAction("OrderInfo", payment);
        //        return View("OrderInfo", payment);
        //    }
        //    int? shoppingCartId = null;
        //    if (User.Identity.IsAuthenticated)
        //    {
        //        //string currUsername = User.Identity.Name;
        //        //int currPersonId = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == currUsername).p_Customer.FirstOrDefault().PersonId;
        //        shoppingCartId = db.ac_ShoppingCart.FirstOrDefault(s => s.CustomerId == personId).ShoppingCartId;
        //    }
        //    else
        //        shoppingCartId = shopId;
        //    //{
        //    //    return Json("لطفاً با نام کاربری و رمز عبور وارد سایت شده و دوباره تلاش کنید.");
        //    //}
        //    decimal totalAmount = db.ac_ShoppingCartDetails.Where(sd => sd.ShoppingCartId == shoppingCartId).Sum(sd => sd.Quantity * sd.Price);
        //    decimal discount = 0;
        //    if (totalAmount > 100000 && totalAmount <= 200000)
        //        discount = totalAmount * 1 / 100;
        //    else if (totalAmount > 200000)
        //        discount = totalAmount * 2 / 100;
        //    else if (totalAmount <= 100000)
        //        discount = 0;
        //    decimal amount = (totalAmount + 2000 - discount);
        //    Session["personId"] = personId;
        //    ir.shaparak.bpm.PaymentGatewayImplService bpService = new ir.shaparak.bpm.PaymentGatewayImplService();
        //    DateTime dateTime = DateTime.Now;
        //    string result = "";

        //    string appName = Membership.ApplicationName;
        //    var appDetails = db.aspnet_Applications.Single(s => s.ApplicationName == appName).ApplicationDetail;

        //    result = bpService.bpPayRequest(
        //         appDetails.TerminalId.Value,
        //            appDetails.PaymentUserName,
        //            appDetails.PaymentPassword,
        //        Int64.Parse(getInvoiceNumber()),
        //        (long)amount * 10,
        //        dateTime.Year.ToString() + dateTime.Month.ToString() + dateTime.Day.ToString(),
        //        dateTime.Hour.ToString() + dateTime.Minute.ToString() + dateTime.Second.ToString(),
        //        "سفارش",
        //        "http://shirazrose.com/Shopping/Payment",
        //        0);
        //    String[] resultArray = result.Split(',');
        //    if (resultArray[0] == "0")
        //    {
        //        bool isgift = isGift == null ? false : true;
        //        bool Gift = gift == null ? false : true;
        //        ViewBag.Script = "<script language='javascript' type='text/javascript'> postRefId('" + resultArray[1] + "');</script> ";
        //        XDocument xmlDoc = XDocument.Load(Server.MapPath("~/Data/ReceiverInfo.xml"));
        //        xmlDoc.Element("root").Elements("User").Where(t => t.Attribute("personId").Value == personId.ToString()).Remove();
        //        xmlDoc.Element("root").Add(new XElement("User",
        //            new XAttribute("personId", personId),
        //            new XAttribute("UserName", userName),
        //            new XAttribute("Amount", amount),
        //            new XAttribute("name", name),
        //            new XAttribute("family", family),
        //            new XAttribute("phone", phone),
        //            new XAttribute("mobile", mobile),
        //            new XAttribute("Address", city),
        //            new XAttribute("addressStr", addressStr),
        //            new XAttribute("postcode", postcode),
        //            new XAttribute("timesend", timesend),
        //            new XAttribute("datesend", datesend),
        //            new XAttribute("description", description),
        //            new XAttribute("isgift", isgift),
        //            new XAttribute("giftnote", giftnote),
        //            new XAttribute("needwrap", Gift),
        //            new XAttribute("sendtype", sendtype)
        //        ));
        //        xmlDoc.Save(Server.MapPath("~/Data/ReceiverInfo.xml"));
        //        return View("payAmount");
        //    }
        //    return Content(result.ToString() + "پاسخی از بانک دریافت نشد، لطفاً دوباره تلاش کنید.", "text/html");
        //}

        public ActionResult CheckOut()
        {

            var sendTimeOptions = new List<SelectListItem> { 
                                                new SelectListItem { Text="8 تا 12 ظهر", Value="8 تا 12 ظهر" }, 
                                                new SelectListItem { Text="15 تا 20", Value="15 تا 20" }, 
                                                };
            if (Session["orderHeaderId"] != null)
            {
                int orderHeaderId = Convert.ToInt32(Session["orderHeaderId"]);
                var orderHeader = db.ac_OrderHeader.SingleOrDefault(o => o.OrderHeaderId == orderHeaderId);
                CheckOutModel model = new CheckOutModel();
                model.AddressId = Convert.ToInt32(orderHeader.p_Person.AddressId);
                model.Gender = orderHeader.p_Person.Gender;
                model.AddressStr = orderHeader.p_Person.p_Customer.Address;
                model.email = orderHeader.p_Person.p_Customer.Email;
                model.Family = orderHeader.p_Person.Family;
                var options = new List<SelectListItem> { 
                                                new SelectListItem { Text="انتخاب", Value="" }, 
                                                new SelectListItem { Text="زن", Value="False" }, 
                                                new SelectListItem { Text= "مرد", Value= "True" } 
                                                };
                ViewBag.Gender = new SelectList(options, "Value", "Text", orderHeader.p_Person.Gender.ToString());
                model.Gender = orderHeader.p_Person.Gender;
                model.Name = orderHeader.p_Person.Name;
                model.Mobile = orderHeader.p_Person.p_Phone.Where(c => c.Cell).Count() > 0 ? orderHeader.p_Person.p_Phone.Last().Number : "";

                model.Phone = orderHeader.p_Person.p_Phone.Where(c => !c.Cell).Count() > 0 ? orderHeader.p_Person.p_Phone.Last().Number : "";
                model.Combo = !string.IsNullOrEmpty(orderHeader.p_Person.p_Customer.Job) ? orderHeader.p_Person.p_Customer.Job : " ";
                model.PostalCode = orderHeader.p_Person.p_Customer.PostalCode;
                if (orderHeader.p_Person.p_Address != null)
                {
                    model.State = orderHeader.p_Person.p_Address.ParentAddressId.Value;
                    model.Address = orderHeader.p_Person.p_Address.Address;
                    //384 is for kalan shahrha
                    ViewBag.StateId = new SelectList(db.p_Address.Where(p => p.ParentAddressId == 1), "AddressId", "Address", orderHeader.p_Person.p_Address.ParentAddressId.Value);
                    ViewBag.AddressId = new SelectList(db.p_Address, "AddressId", "Address", orderHeader.p_Person.AddressId);

                }

                var Receiver = orderHeader.ac_ReceiverDetails;
                model.SendType = Convert.ToInt16(Receiver.SendType.Value);
                model.SendDate = utility.GetstrDateCultureSimpleYearLast(Receiver.SendDate.Value);
                model.SendTime = Receiver.SendTime;
                model.GiftNote = Receiver.GiftNote;
                model.MoreInfo = orderHeader.Description;
                ViewBag.SendTime = new SelectList(sendTimeOptions, "Value", "Text", Receiver.SendTime != null ? Receiver.SendTime : "8 تا 12 ظهر");
                return View(model);
            }

            int shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
            var shoppingCart = db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId);
            if (shoppingCart == null && shoppingCartId != 0)
                return RedirectToAction("Index", "Home");
            if (User.Identity.IsAuthenticated || shoppingCart.p_Customer != null)
            {
                string currentEmail = User.Identity.Name;
                var customer = db.p_Customer.FirstOrDefault(c => c.aspnet_Membership.aspnet_Users.UserName == currentEmail);
                if (customer == null)
                    customer = shoppingCart.p_Customer;
                var mobs = customer.p_Person.p_Phone.Where(p => p.Cell == true);
                if (!db.ac_ShoppingCart.Any(a => a.CustomerId == customer.AccountId))
                    return RedirectToAction("Index", "Home");
                else
                    if (customer != null)
                    {
                        CheckOutModel model = new CheckOutModel();
                        //model.code = customer.p_Person.Code;
                        model.AddressId = Convert.ToInt32(customer.p_Person.AddressId);
                        model.State = (customer.p_Person.p_Address != null && customer.p_Person.p_Address.ParentAddressId != null) ? customer.p_Person.p_Address.ParentAddressId.Value : 0;
                        model.Address = customer.p_Person.p_Address != null ? customer.p_Person.p_Address.Address : "";
                        model.Gender = customer.p_Person.Gender;
                        model.AddressStr = customer.Address;
                        model.email = customer.Email;
                        model.Family = customer.p_Person.Family;
                        var options = new List<SelectListItem> { 
                                                new SelectListItem { Text="انتخاب", Value="" }, 
                                                new SelectListItem { Text="زن", Value="False" }, 
                                                new SelectListItem { Text= "مرد", Value= "True" } 
                                                };
                        ViewBag.Gender = new SelectList(options, "Value", "Text", customer.p_Person.Gender.ToString());
                        model.Gender = customer.p_Person.Gender;
                        model.Name = customer.p_Person.Name;
                        model.Mobile = customer.p_Person.p_Phone.Where(c => c.Cell).Count() > 0 ? customer.p_Person.p_Phone.Last().Number : "";

                        model.Phone = customer.p_Person.p_Phone.Where(c => !c.Cell).Count() > 0 ? customer.p_Person.p_Phone.Last().Number : "";

                        model.Combo = !string.IsNullOrEmpty(customer.Job) ? customer.Job : " ";
                        model.PostalCode = customer.PostalCode;
                        ViewBag.StateId = new SelectList(db.p_Address.Where(p => p.ParentAddressId == 1), "AddressId", "Address", (customer.p_Person.p_Address != null && customer.p_Person.p_Address.ParentAddressId != null) ? (int?)customer.p_Person.p_Address.ParentAddressId.Value : null);
                        ViewBag.AddressId = new SelectList(db.p_Address, "AddressId", "Address", customer.p_Person.AddressId == null ? 3 : customer.p_Person.AddressId);
                        ViewBag.SendTime = new SelectList(sendTimeOptions, "Value", "Text");
                        return View(model);
                    }

                    else
                    {
                        var options = new List<SelectListItem> { 
                                                new SelectListItem { Text="انتخاب", Value="" }, 
                                                new SelectListItem { Text="زن", Value="False" }, 
                                                new SelectListItem { Text= "مرد", Value= "True" } 
                                                };
                        ViewBag.Gender = new SelectList(options, "Value", "Text");
                        ViewBag.StateId = new SelectList(db.p_Address.Where(p => p.ParentAddressId == 1), "AddressId", "Address");
                        ViewBag.AddressId = new SelectList(db.p_Address.Where(p => p.ParentAddressId == 384), "AddressId", "Address");
                        ViewBag.SendTime = new SelectList(sendTimeOptions, "Value", "Text");
                        //ViewBag.Gender = new SelectList(new System.Collections.IEnumerable., "AddressId", "Address");
                        return View();
                    }

            }
            if (Session["shoppingCartId"] != null)
            {
                if (Request["isGuest"] == "guest")
                {
                    var options = new List<SelectListItem> { 
                                                new SelectListItem { Text="انتخاب", Value="" }, 
                                                new SelectListItem { Text="زن", Value="False" }, 
                                                new SelectListItem { Text= "مرد", Value= "True" } 
                                                };
                    ViewBag.Gender = new SelectList(options, "Value", "Text");
                    ViewBag.StateId = new SelectList(db.p_Address.Where(p => p.ParentAddressId == 1), "AddressId", "Address", 2);
                    ViewBag.AddressId = new SelectList(db.p_Address.Where(p => p.ParentAddressId == 384), "AddressId", "Address", 3);
                    ViewBag.SendTime = new SelectList(sendTimeOptions, "Value", "Text");
                    return View(new CheckOutModel());

                }
                else
                {

                    return RedirectToAction("LogOn", "Account", new { checkOut = true });

                }
            }
            else
                return RedirectToAction("Index", "Home");
            //View(new RegisterModel() {AddressId=2 });


        }

        [HttpPost]
        public ActionResult CheckOut(CheckOutModel checkout)
        {
            long orderId = 0;
            try
            {
                //base info

                string userName = "";
                int personAccountId = 0;
                int? CounterId = 0;
                int? shoppingCartId = null;
                p_Person per = new p_Person();
                string email = "";

                if (User.Identity.IsAuthenticated)
                {
                    userName = User.Identity.Name;
                    per = db.aspnet_Membership.FirstOrDefault(m => m.aspnet_Users.UserName == userName).p_Customer.FirstOrDefault().p_Person;
                    personAccountId = per.AccountId;
                    shoppingCartId = db.ac_ShoppingCart.FirstOrDefault(s => s.CustomerId == personAccountId).ShoppingCartId;
                    email = per.p_Customer.aspnet_Membership.Email;
                    shoppingCartId = db.ac_ShoppingCart.FirstOrDefault(s => s.CustomerId == personAccountId).ShoppingCartId;
                }
                else
                    shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                var shoppingcart = db.ac_ShoppingCart.FirstOrDefault(s => s.ShoppingCartId == shoppingCartId);
                CounterId = db.ApplicationDetails.Single(s => s.AppName == Membership.ApplicationName).CounterId;
                int shopId = db.ac_Counter.Single(s => s.AccountId == CounterId).ShopId;
                var app = db.aspnet_Applications.FirstOrDefault(a => a.ApplicationName == Membership.ApplicationName);
                decimal totalAmount = db.ac_ShoppingCartDetails.Where(sd => sd.ShoppingCartId == shoppingCartId).Sum(sd => sd.Quantity * sd.Price);
                decimal discount = 0;
                if (totalAmount > 100000 && totalAmount <= 200000)
                    discount = totalAmount * 1 / 100;
                else if (totalAmount > 200000)
                    discount = totalAmount * 2 / 100;
                else if (totalAmount <= 100000)
                    discount = 0;

                //hazine peik
                string appName = Membership.ApplicationName;
                decimal deliveryExpense = db.ApplicationDetails.Single(a => a.AppName == appName).DeliveryExpense.Value;
                //Session["se-deliveryExpense"] = deliveryExpense;


                decimal amount = (totalAmount + deliveryExpense - discount);
                string result = "";

                // bank
                if (checkout.PaymentMethod == 1)
                {
                    ir.shaparak.bpm.PaymentGatewayImplService bpService = new ir.shaparak.bpm.PaymentGatewayImplService();
                    DateTime dateTime = DateTime.Now;
                    var appDetails = db.aspnet_Applications.Single(s => s.ApplicationName == appName).ApplicationDetail;
                    orderId = Int64.Parse(getInvoiceNumber());
                    result = bpService.bpPayRequest(
                         appDetails.TerminalId.Value,
                            appDetails.PaymentUserName,
                            appDetails.PaymentPassword,
                        orderId,
                        (long)amount * 10,
                        dateTime.Year.ToString() + dateTime.Month.ToString() + dateTime.Day.ToString(),
                        dateTime.Hour.ToString() + dateTime.Minute.ToString() + dateTime.Second.ToString(),
                        "سفارش",
                       "http://shirazrose.com/Shopping/Payment",
                        0);
                    //******** make this ==0;
                    if (Convert.ToInt32(result.Split(',')[0]) == 0)
                        throw new FileNotFoundException(result.Split(',')[0] + "_" + orderId.ToString());
                    //return RedirectToAction("ShoppingCart", "Shopping");
                    //return RedirectToAction("Home", "Index", new { d = result.Split(',')[0] });
                    //    //return RedirectToAction("ShoppingCart", "Shopping");

                }
                if (User.Identity.IsAuthenticated)
                {
                    // to see if the customer has anything in the shoppingCart
                    if (!db.ac_ShoppingCart.Any(s => s.CustomerId == personAccountId))
                        return RedirectToAction("Index", "Home");
                }
                else
                {
                    // to register a new customer
                    string phoneNumber = "", mobileNumber = "";
                    if (!string.IsNullOrEmpty(checkout.Phone))
                        phoneNumber = checkout.Phone;
                    if (!string.IsNullOrEmpty(checkout.Mobile))
                        mobileNumber = checkout.Mobile;
                    //check user
                    //string appName = app.ApplicationName;

                    var oldperson = db.p_Customer.FirstOrDefault(p => p.p_Person.aspnet_Applications.ApplicationName == appName && p.p_Person.p_Phone.Any(h => (h.Cell == true && h.Number == mobileNumber) || p.Email == checkout.email));

                    if (oldperson == null)
                    {
                        var pcode = db.p_Person.Where(p => p.AccountId == p.p_Customer.AccountId);
                        var co = pcode.Count() > 0 ? pcode.OrderByDescending(c => c.AccountId).Select(c => c.Code).First() : "9998";
                        co = co.Replace("c", "");
                        co = "c" + (int.Parse(co) + 2).ToString();
                        per.Code = co;

                        per.RegDate = DateTime.Now;
                        p_Customer customer = new p_Customer();


                        per.Name = checkout.Name;
                        per.Family = checkout.Family;
                        per.Gender = checkout.Gender;
                        per.RegDate = DateTime.Now;
                        if (!string.IsNullOrEmpty(checkout.Phone))
                            per.p_Phone.Add(new p_Phone() { Number = checkout.Phone, Cell = false });
                        if (!string.IsNullOrEmpty(checkout.Mobile))
                            per.p_Phone.Add(new p_Phone() { Number = checkout.Mobile, Cell = true });
                        //per.AddressId = checkout.StateId;
                        customer.Address = checkout.AddressStr;
                        //customer.PostalCode = checkout.PostalCode;
                        customer.Email = checkout.email;
                        customer.NetBuy = 0;
                        customer.NetPayment = 0;
                        customer.ac_ShoppingCart.Add(shoppingcart);
                        var tableAccount = db.ac_TableAccount.Single(a => a.Table == "customer" && a.aspnet_Applications.ApplicationName == appName);
                        var parentAccount = db.ac_Account.Single(a => a.AccountId == tableAccount.AccountId);

                        ac_Account account = new ac_Account()
                        {
                            AccountNature = parentAccount.AccountNature,
                            Code = utility.FindAccountCodeByParentId(tableAccount.AccountId) + 1,
                            GroupType = parentAccount.GroupType,
                            //Level = Convert.ToByte(parentAccount.Level + 1),
                            Level = 3,
                            Name = checkout.Family + " " + checkout.Name + " " + co,
                            ParentAccountId = tableAccount.AccountId,
                            ApplicationId = app.ApplicationId,
                            RegistererId = app.ApplicationDetail.EmployeeId,
                            LedgentId = (new MapiOnline.Controllers.ManagementController()).findLedgentAccId(tableAccount.AccountId)
                        };
                        per.ac_Account = account;
                        per.ac_Account.aspnet_Applications = app;
                        per.ac_Account.RegistererId = app.ApplicationDetail.EmployeeId;
                        per.p_Customer = customer;
                        db.p_Person.AddObject(per);
                    }
                    else
                    {
                        per = oldperson.p_Person;
                        var op = oldperson;
                        if (op.aspnet_Membership != null)
                            email = op.aspnet_Membership.Email;
                        int oldPersonId = op.AccountId;
                        oldperson.p_Person.Name = checkout.Name;
                        oldperson.p_Person.Family = checkout.Family;
                        //if (checkout.AddressId != null)
                        //    oldperson.p_Person.AddressId = checkout.AddressId;
                        oldperson.p_Person.p_Customer.Address = checkout.AddressStr;
                        oldperson.p_Person.p_Customer.Email = checkout.email;
                        if (!checkout.Gender == null)
                            oldperson.p_Person.Gender = checkout.Gender;
                        var mob = oldperson.p_Person.p_Phone.SingleOrDefault(p => p.Number == checkout.Mobile);
                        if (mob == null)
                            oldperson.p_Person.p_Phone.Add(new p_Phone { Number = checkout.Mobile, Cell = true });
                        if (checkout.Phone != null)
                        {
                            var phone = oldperson.p_Person.p_Phone.SingleOrDefault(p => p.Number == checkout.Phone);
                            if (phone == null)
                                oldperson.p_Person.p_Phone.Add(new p_Phone { Number = checkout.Phone, Cell = false });
                        }
                        if (checkout.PostalCode != null)
                            oldperson.PostalCode = checkout.PostalCode;
                        db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId).p_Customer = oldperson;
                        var shopCart = db.ac_ShoppingCart.Where(c => c.CustomerId == oldPersonId);
                        if (shopCart.Count() > 0)
                        {
                            foreach (var item in shopCart.ToList())
                            {
                                foreach (var detail in item.ac_ShoppingCartDetails.ToList())
                                {
                                    if (detail.ac_ShoppingCartDetails1.Count > 0)
                                    {
                                        foreach (var details in detail.ac_ShoppingCartDetails1.ToList())
                                        {
                                            db.ac_ShoppingCartDetails.DeleteObject(details);
                                        }
                                    }
                                    db.ac_ShoppingCartDetails.DeleteObject(detail);
                                }
                            }
                        }
                        // shoppingcart.CustomerId = oldPersonId;
                    }

                }


                string invoiceNo = ManagementController.getInvoiceNumber(db, "", true, true);

                if (checkout.PaymentMethod != 1)
                {
                    //not online
                    ac_OrderHeader ordH = new ac_OrderHeader();
                    var appDetails = db.aspnet_Applications.Single(aa => aa.ApplicationName == appName).ApplicationDetail;
                    ordH.FiscalPeriodId = appDetails.CurrentFiscalPeriodId;
                    ordH.Table = "order";
                    ordH.Date = System.DateTime.Now;
                    //ordH.CounterId = CounterId;
                    //ordH.ShopId=shopId;

                    if (discount > 0)
                    {
                        var buyDiscountIncome = discount;
                        // agarkarbar shamel takhfif shavad va baraie hazine peik
                        new ManagementController().AddOtherAccount("sale", ref ordH, 0, 0, 0, buyDiscountIncome, 0, 0, 0, deliveryExpense, 0);
                    }
                    else
                    {
                        // hazine peik
                        new ManagementController().AddOtherAccount("sale", ref ordH, 0, 0, 0, 0, 0, 0, 0, deliveryExpense, 0);
                    }

                    ordH.ClientId = per.AccountId;
                    decimal sum = 0;
                    var shoppingcartDetails = shoppingcart.ac_ShoppingCartDetails.Where(sd => sd.ChildShoppingCartDetailsId == null);

                    foreach (var item in shoppingcartDetails)
                    {
                        string desc = "";
                        if (item.inv_ItemDetail.inv_Barcode.inv_Property.Any(p => p.Property == "bride"))
                            desc = "دسته گل عروس ( ";
                        if (item.inv_ItemDetail.inv_Barcode.inv_Property.Any(p => p.Property == "customized"))
                            desc = "دسته گل سفارشی ( ";

                        ac_OrderDetail orderdetail = new ac_OrderDetail();

                        // baraie inke shoppingcart  khali nbashad
                        if (item.ac_ShoppingCartDetails1.Count > 0)
                        {
                            decimal sumSh = 0;

                            // shoppingCard -> bestankar
                            foreach (var itmDt in item.ac_ShoppingCartDetails1)
                            {
                                desc += "تعداد " + itmDt.Quantity + " شاخه " + itmDt.inv_ItemDetail.inv_Barcode.Name + ". ";
                                ac_OrderDetail ordD = new ac_OrderDetail();
                                ordD.Quantity = itmDt.Quantity;
                                ac_AccountDetail accDetail = new ac_AccountDetail();
                                accDetail.Amount = itmDt.Price * itmDt.Quantity;
                                //???
                                //orderdetail.Broken = false;
                                //orderdetail.Serial = itmDt.;
                                accDetail.AccountId = itmDt.ItemDetailId;
                                accDetail.IsDept = true;
                                accDetail.ac_OrderDetail = ordD;
                                ordH.ac_AccountDetail.Add(accDetail);
                                sumSh += itmDt.Price * itmDt.Quantity;
                            }
                            sum += sumSh;
                            desc += " ) ";
                            orderdetail.Description = desc;
                        }
                        else
                            orderdetail.Description = item.Description;

                        //sum += item.Quantity * item.Price;
                        ////customer -> bedehkar
                        //ac_AccountDetail accountDetailCu = new ac_AccountDetail();
                        //accountDetailCu.AccountId = per.AccountId;
                        //accountDetailCu.IsDept = false;
                        //accountDetailCu.Amount = sum;
                        //ordH.ac_AccountDetail.Add(accountDetailCu);
                        orderdetail.Quantity = item.Quantity;

                        //mojodie kala -> bestankar
                        ac_AccountDetail accountDetail = new ac_AccountDetail();
                        accountDetail.Amount = item.Quantity * item.inv_ItemDetail.BuyPrice;
                        accountDetail.Description = item.Description;
                        accountDetail.AccountId = item.ItemDetailId;
                        accountDetail.IsDept = false;
                        orderdetail.ac_AccountDetail = accountDetail;
                        orderdetail.Quantity = item.Quantity;
                        orderdetail.Broken = false;

                        //forosh -> bestankar
                        ac_AccountDetail accDetailS = new ac_AccountDetail();
                        var accSell_TotalAmount = db.ac_Account.Where(a => a.RelatedAccountId == item.inv_ItemDetail.AccountId && a.ac_Account2.ac_TableAccount.Table == "itemSale");

                        accDetailS.Amount = item.Quantity * item.Price;
                        accDetailS.AccountId = accSell_TotalAmount.First().AccountId;
                        accDetailS.IsDept = false;
                        if (!string.IsNullOrEmpty(item.Description))
                            accDetailS.Description = item.Description;
                        orderdetail.ac_AccountDetail1 = accDetailS;

                        //gheimate tamam shode -> bedehkar
                        var accPrice_TotalAmount = db.ac_Account.Where(a => a.RelatedAccountId == item.inv_ItemDetail.AccountId && a.ac_Account2.ac_TableAccount.Table == "itemPrice");
                        ac_AccountDetail accDetailTA = new ac_AccountDetail();
                        accDetailTA.Amount = item.Quantity * item.inv_ItemDetail.BuyPrice;
                        accDetailTA.AccountId = accPrice_TotalAmount.First().AccountId;
                        accDetailTA.IsDept = true;
                        if (!string.IsNullOrEmpty(item.Description))
                            accDetailS.Description = item.Description;
                        orderdetail.ac_AccountDetail2 = accDetailTA;

                        sum += item.Quantity * item.Price;

                        ordH.ac_AccountDetail.Add(accountDetail);
                        ordH.ac_AccountDetail.Add(accDetailS);
                        ordH.ac_AccountDetail.Add(accDetailTA);


                    }



                    var appDetail = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationDetail;
                    ordH.CurrencyRateId = db.ac_Currency.Where(c => c.Currency == "تومان").FirstOrDefault().ac_CurrencyRate.OrderByDescending(c => c.Date).FirstOrDefault().CurrencyRateId;
                    ordH.Description = "preOrderBuy " + checkout.MoreInfo;
                    if (appDetail.EmployeeId != null)
                    {
                        ordH.EmployeeId = appDetail.EmployeeId.Value;
                    }
                    ordH.InvoiceNO = invoiceNo;
                    ordH.IsMoney = false;
                    ordH.Sell = true;
                    ac_ReceiverDetails ac_ReceiverDetails = new Models.ac_ReceiverDetails();
                    ac_ReceiverDetails.Name = checkout.ReceiverName;
                    ac_ReceiverDetails.Address = checkout.ReceiverAddress;
                    ac_ReceiverDetails.AddressID = checkout.AddressId;
                    if (checkout.ReceiverMobile != null)
                        ac_ReceiverDetails.CellPhone = checkout.ReceiverMobile;
                    ac_ReceiverDetails.Family = checkout.ReceiverFaily;
                    ac_ReceiverDetails.PaymentType = checkout.PaymentMethod;
                    if (checkout.ReceiverPhone != null)
                        ac_ReceiverDetails.Phone = checkout.ReceiverPhone;
                    //ac_ReceiverDetails.PostalCode = checkout;
                    ac_ReceiverDetails.SendType = checkout.SendType;
                    ac_ReceiverDetails.SendDate = utility.GetDateTimeCulture(checkout.SendDate);
                    ac_ReceiverDetails.SendTime = checkout.SendTime;
                    //ac_ReceiverDetails.IsGift = Convert.ToBoolean(checkout.GiftNote);
                    //ac_ReceiverDetails.NeedWrap = Convert.ToBoolean(gift);
                    if (checkout.GiftNote != null)
                        ac_ReceiverDetails.GiftNote = checkout.GiftNote;
                    decimal totAmount = 0;
                    var simShopdt = shoppingcartDetails.Where(sd => sd.ac_ShoppingCartDetails1.Count == 0 && sd.ChildShoppingCartDetailsId == null);
                    if (simShopdt.Count() > 0)
                        totAmount += simShopdt.Sum(sd => sd.Quantity * sd.Price);
                    if (shoppingcartDetails.Any(sd => sd.ac_ShoppingCartDetails1.Count > 0))
                    {
                        foreach (var shopdtItms in shoppingcartDetails.Where(sd => sd.ac_ShoppingCartDetails1.Count > 0))
                        {
                            totAmount += shopdtItms.ac_ShoppingCartDetails1.Sum(sd => sd.Quantity * sd.Price) * shopdtItms.Quantity;
                            totAmount += shopdtItms.Price * shopdtItms.Quantity;
                        }
                    }
                    decimal discountAmount = 0;
                    if (totAmount > 100000 && totAmount <= 200000)
                        discountAmount = totAmount * 1 / 100;
                    else if (totAmount > 200000)
                        discountAmount = totAmount * 2 / 100;
                    else if (totAmount <= 100000)
                        discountAmount = 0;
                    ac_ReceiverDetails.DiscountAmount = discountAmount;

                    ac_ReceiverDetails.DeliveryExpense = deliveryExpense;
                    ordH.ac_ReceiverDetails = ac_ReceiverDetails;
                    ordH.Amount = totAmount + ac_ReceiverDetails.DeliveryExpense.Value - ac_ReceiverDetails.DiscountAmount.Value;
                    db.ac_OrderHeader.AddObject(ordH);
                    foreach (var item in shoppingcart.ac_ShoppingCartDetails.ToList())
                    {
                        if (item.ac_ShoppingCartDetails1.Count > 0)
                            foreach (var items in item.ac_ShoppingCartDetails1.ToList())
                            {
                                db.ac_ShoppingCartDetails.DeleteObject(items);
                            }
                        db.ac_ShoppingCartDetails.DeleteObject(item);
                    }
                    db.ac_ShoppingCart.DeleteObject(shoppingcart);
                    ordH.p_Person = per;
                    ordH.ac_ReceiverDetails.Address = ordH.ac_ReceiverDetails.Address;

                    //moshtari - > bedehkar
                    ac_AccountDetail accountDetailCus = new ac_AccountDetail();
                    accountDetailCus.AccountId = per.AccountId;
                    accountDetailCus.IsDept = true;
                    accountDetailCus.Amount = sum + ac_ReceiverDetails.DeliveryExpense.Value - ac_ReceiverDetails.DiscountAmount.Value;
                    ordH.ac_AccountDetail.Add(accountDetailCus);

                    db.SaveChanges();

                    sendSMSEmail(email, true, checkout.Mobile, invoiceNo, per.AccountId, checkout.Mobile);

                    Session["orderHeaderId"] = ordH.OrderHeaderId;
                    Session["shoppingCartId"] = null;
                    return RedirectToAction("OrderInfo", "Shopping");
                }



                String[] resultArray = result.Split(',');
                //ViewBag.Script = "<script language='javascript' type='text/javascript'>  alert('" + resultArray[0] + "');</script> ";
                //********change to !=
                if (resultArray[0] != "0")
                {

                    db.SaveChanges();
                    Session["personId"] = per.AccountId;

                    //bool isgift = isGift == null ? false : true;
                    //bool Gift = gift == null ? false : true;
                    //********change to 0
                    ViewBag.Script = "<script language='javascript' type='text/javascript'>  postRefId('" + resultArray[0] + "');</script> ";
                    XDocument xmlDoc = XDocument.Load(Server.MapPath("~/Data/ReceiverInfo.xml"));
                    xmlDoc.Element("root").Elements("User").Where(t => t.Attribute("personId").Value == per.AccountId.ToString()).Remove();
                    xmlDoc.Element("root").Add(new XElement("User",
                        //********* set second index to 0
                        new XAttribute("refid", resultArray[0] + "--" + resultArray[0]),
                        new XAttribute("personId", per.AccountId),
                        new XAttribute("UserName", userName),
                        new XAttribute("Amount", amount),
                        new XAttribute("name", checkout.ReceiverName == null ? "" : checkout.ReceiverName),
                        new XAttribute("family", checkout.ReceiverFaily),
                        new XAttribute("phone", checkout.ReceiverPhone == null ? "" : checkout.ReceiverPhone),
                        new XAttribute("mobile", checkout.ReceiverMobile == null ? "" : checkout.ReceiverMobile),
                        new XAttribute("Address", checkout.AddressId),
                        new XAttribute("addressStr", utility.getStrAddress(db.GetParentAddressById(checkout.AddressId, "")) + "->" + checkout.ReceiverAddress),
                        new XAttribute("postcode", ""),
                        new XAttribute("timesend", checkout.SendTime == null ? "" : checkout.SendTime),
                        new XAttribute("datesend", checkout.SendDate == null ? "" : checkout.SendDate),
                        new XAttribute("description", checkout.MoreInfo == null ? "" : checkout.MoreInfo),
                        //new XAttribute("isgift", isgift),
                        new XAttribute("giftnote", checkout.GiftNote == null ? "" : checkout.GiftNote),
                        //new XAttribute("needwrap", Gift),
                        new XAttribute("sendtype", 1),// checkout.SendType == null ? "" : checkout.SendType),
                        new XAttribute("shoppingCartId", shoppingCartId)
                    ));
                    xmlDoc.Save(Server.MapPath("~/Data/ReceiverInfo.xml"));
                    //*******uncomment payment and comment return
                    return  Payment("www", "www", 4444, 4444);
                    //return View("PayAmount");
                    //  return RedirectToAction("OrderInfo", "Shopping");
                }
                else
                {
                    throw new FileNotFoundException(resultArray[0]);
                }

                return RedirectToAction("CheckOut", "Shopping");//, Content(result.ToString() + "پاسخی از بانک دریافت نشد، لطفاً دوباره تلاش کنید.", "text/html"));
            }
            catch (Exception ex)
            {
                utility.emailErrorLog(ex, "CheckOut_" + orderId.ToString());
                //return Json(new {message=ex.Message+ex.StackTrace, isDone = false });
                return RedirectToAction("CheckOut", "Shopping");//, new { e = ex.Message });
            }
        }

        public ActionResult OrderInfo()
        {
            int orderHeaderId = Convert.ToInt32(Session["orderHeaderId"]);

            return View(db.ac_OrderHeader.SingleOrDefault(s => s.OrderHeaderId == orderHeaderId));
        }

        void sendSMSEmail(string email, bool? isGift, string smobile, string invoiceNo, int accountId, string mobile)
        {
            if (!string.IsNullOrEmpty(email) && isGift != null)
            {
                var appDetails = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationDetail;
                System.Threading.Thread t = new System.Threading.Thread(sendEmail);
                object[] parameters = new object[] { email, "اطلاعات خرید اینترنتی", 
                        "<div id='yui_3_2_0_1_131658669409891' style='width: 400px; margin: 20px auto; direction: rtl; font: 8pt/22px tahoma; border: 3px double rgb(40, 128, 192);'><div id='yui_3_2_0_1_131658669409888' style='direction: rtl; padding-right: 12px;'>از خرید شما سپاسگزاریم.</div><div style='width: 350px; margin: 10px auto; direction: rtl; font: 8pt/22px tahoma; border: 1px solid rgb(40, 128, 192);'><div style='padding-right: 20px;'>شماره فاکتور : " + invoiceNo + "</div></div><blockquote>با آروزی روزگار خوش برای شما<div style='text-align: left;'><a rel='nofollow' style='text-decoration: none; color: blue;' target='_blank' href='http://shirazrose.com'>shirazrose.com</a></div></blockquote></div>",
                     appDetails.Email,
                     appDetails.EmailPass,
                     appDetails.Port,
                     appDetails.Host};
                t.Start(parameters);
            }

            if (isGift == false)
            {
                if (!string.IsNullOrEmpty(smobile))
                    sms.Send(smobile, "شماره فاکتور " + invoiceNo + "\nاز خرید شما سپاسگزاریم.\nshirazrose.com");
                else if (accountId > 0)
                    sms.Send(mobile, "شماره فاکتور " + invoiceNo + "\nاز خرید شما سپاسگزاریم.\nshirazrose.com");
            }
            else if (isGift == true)
            {
                if (!string.IsNullOrEmpty(smobile))
                    sms.Send(smobile, "شماره فاکتور " + invoiceNo + "\nاز خرید شما سپاسگزاریم.\nshirazrose.com");
                else if (accountId > 0)
                {
                    string smob = db.p_Phone.FirstOrDefault(p => p.PersonId == accountId && p.Cell == true).Number;
                    if (!string.IsNullOrEmpty(smob))
                        sms.Send(smob, "شماره فاکتور " + invoiceNo + "\nاز خرید شما سپاسگزاریم.\nshirazrose.com");
                }
            }
        }
        [HttpPost]
        public ActionResult Payment(string RefId, string ResCode, long? saleOrderId, long? SaleReferenceId)
        {
            int shoppingCartId = 0;
            int personId = 0;
            string result;
            ir.shaparak.bpm.PaymentGatewayImplService bpService = new ir.shaparak.bpm.PaymentGatewayImplService();

            string appName = Membership.ApplicationName;
            var appDetails = db.aspnet_Applications.Single(s => s.ApplicationName == appName).ApplicationDetail;

            if (SaleReferenceId == null)
                return RedirectToAction("ShoppingCart", "Shopping");
            try
            {
                ViewBag.RefId = RefId;
                ViewBag.ResCode = ResCode;
                ViewBag.SaleOrderId = saleOrderId;
                ViewBag.SaleReferenceId = SaleReferenceId;
                utility.BypassCertificateError();
                result = bpService.bpVerifyRequest(
                  appDetails.TerminalId.Value,
                    appDetails.PaymentUserName,
                    appDetails.PaymentPassword,
                    saleOrderId.Value,
                    saleOrderId.Value,
                    SaleReferenceId.Value
            );
                //*********make it ==
                if (result.Split(',')[0] == "0")
                {
                    utility.BypassCertificateError();
                    result = bpService.bpInquiryRequest(appDetails.TerminalId.Value,
                    appDetails.PaymentUserName,
                    appDetails.PaymentPassword,
                    saleOrderId.Value,
                    saleOrderId.Value,
                    SaleReferenceId.Value);
                }
                //********* make it !=
                if (result.Split(',')[0] != "0")
                {
                    //ViewBag.Script = "<script language='javascript' type='text/javascript'> alert('" + result.Split(',')[0] + "--" + SaleReferenceId + "');</script> ";
                    ac_OrderHeader payment = new ac_OrderHeader();
                    payment.FiscalPeriodId = appDetails.CurrentFiscalPeriodId;
                    personId = Convert.ToInt32(Session["personId"]);
                    XDocument xmlDoc = XDocument.Load(Server.MapPath("~/Data/ReceiverInfo.xml"));
                    var sd = xmlDoc.Element("root").Elements("User").LastOrDefault(t => t.Attribute("personId").Value == personId.ToString());
                    shoppingCartId = Convert.ToInt32(sd.Attribute("shoppingCartId").Value);
                    payment = ConfirmOrder(SaleReferenceId.Value, saleOrderId.Value, personId, shoppingCartId);
                    //   Session.Remove("personId");

                    sd.Remove();
                    xmlDoc.Save(Server.MapPath("~/Data/ReceiverInfo.xml"));
                    Session["orderHeaderId"] = payment.OrderHeaderId;
                    Session["shoppingCartId"] = null;
                    return RedirectToAction("OrderInfo", "Shopping");
                }
                else
                {
                    result = bpService.bpReversalRequest(appDetails.TerminalId.Value,
                    appDetails.PaymentUserName,
                    appDetails.PaymentPassword,
                    saleOrderId.Value,
                    saleOrderId.Value,
                    SaleReferenceId.Value
                    );
                    ViewBag.error = "پرداخت انجام نشد، لطفاً دوباره تلاش کنید.";
                    return View("ShoppingCart");
                }
            }
            catch (Exception exp)
            {
                utility.emailErrorLog(exp, "Payment");
                result = bpService.bpReversalRequest(appDetails.TerminalId.Value,
                    appDetails.PaymentUserName,
                    appDetails.PaymentPassword,
                   saleOrderId.Value,
                   saleOrderId.Value,
                   SaleReferenceId.Value
                   );
                ViewBag.message = exp.Message;
                ViewBag.error = exp.Message + "-" + personId + "-" + shoppingCartId + "-" + Session["personId"].ToString();
                return View("ShoppingCart");
            }
        }

        ac_OrderHeader ConfirmOrder(long saleRefrenceId, long saleOrderId, int personId, int shoppingCartId)
        {

            string invoiceNo = ManagementController.getInvoiceNumber(db, "", true, true);
            var receiver = XDocument.Load(Server.MapPath("~/Data/ReceiverInfo.xml")).Elements("root").Elements("User").LastOrDefault(d => d.Attribute("shoppingCartId").Value == shoppingCartId.ToString());
            //ac_OrderHeader ordH = new ac_OrderHeader();

            var shoppingcart = db.ac_ShoppingCart.FirstOrDefault(s => s.ShoppingCartId == shoppingCartId);
            var shoppingcartDetails = shoppingcart.ac_ShoppingCartDetails.Where(sd => sd.ChildShoppingCartDetailsId == null);
            //decimal detailAmount = 0;
            //foreach (var item in shoppingcartDetails)
            //{
            //    string desc = "";
            //    if (item.inv_ItemDetail.inv_Barcode.inv_Property.Any(p => p.Property == "bride"))
            //        desc = "دسته گل عروس ( ";
            //    if (item.inv_ItemDetail.inv_Barcode.inv_Property.Any(p => p.Property == "customized"))
            //        desc = "دسته گل سفارشی ( ";
            //    ac_OrderDetail ordD = new ac_OrderDetail();
            //    ac_AccountDetail accountDetail = new ac_AccountDetail();
            //    accountDetail.AccountId = item.ItemDetailId;
            //    accountDetail.Amount = item.Price;
            //    ordD.Quantity = item.Quantity;
            //    ordD.Broken = false;
            //    detailAmount += item.Price * item.Quantity;
            //    if (item.ac_ShoppingCartDetails1.Count > 0)
            //    {
            //        decimal sumSh = 0;
            //        // shoppingCard -> bestankar
            //        foreach (var itmDt in item.ac_ShoppingCartDetails1)
            //        {

            //            desc += "تعداد " + itmDt.Quantity + " شاخه " + itmDt.inv_ItemDetail.inv_Barcode.Name + ". ";
            //            ac_OrderDetail ordDet = new ac_OrderDetail();
            //            ordDet.Quantity = itmDt.Quantity;
            //            ac_AccountDetail accDetail = new ac_AccountDetail();
            //            accDetail.Amount = itmDt.Price * itmDt.Quantity;
            //            //???
            //            ordDet.Broken = false;
            //            //ordDet.Serial = itmDt.;
            //            accDetail.AccountId = itmDt.ItemDetailId;
            //            accDetail.IsDept = true;
            //            accDetail.ac_OrderDetail = ordDet;
            //            ordH.ac_AccountDetail.Add(accDetail);
            //            sumSh += itmDt.Price * itmDt.Quantity;
            //        }
            //        desc += " ) ";
            //        ordD.Description = desc;
            //        detailAmount += sumSh;
            //    }

            //    //customer -> bedehkar
            //    ac_AccountDetail accountDetailCu = new ac_AccountDetail();
            //    accountDetailCu.AccountId = personId;
            //    accountDetailCu.IsDept = false;
            //    accountDetailCu.Amount = detailAmount;
            //    ordH.ac_AccountDetail.Add(accountDetailCu);
            //    accountDetail.Description = item.Description;
            //    accountDetail.Table = "orderDetail";
            //    accountDetail.IsDept = true;
            //    ordH.ac_AccountDetail.Add(accountDetail);
            //    //for (int i = 0; i < item.Quantity; i++)
            //    //{
            //    //    ordD.Quantity = 1;
            //    //    ordH.ac_OrderDetail.Add(ordD);
            //    //}
            //}
            //var appDetail = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationDetail;
            //ordH.ClientId = personId;
            //ordH.CurrencyRateId = db.ac_Currency.Where(c => c.Currency == "تومان").FirstOrDefault().ac_CurrencyRate.OrderByDescending(c => c.Date).FirstOrDefault().CurrencyRateId;
            //ordH.Date = DateTime.Now;
            //ordH.Description = "preOrderBuy " + receiver.Attribute("description").Value;
            //ordH.EmployeeId = appDetail.EmployeeId.Value;
            //ordH.InvoiceNO = invoiceNo;
            ////ordH.OrderTypeId = AccountController.getOrderType(db, personId, true, false, false, false, false, false, false, false, false);
            //ordH.IsMoney = false;
            //ordH.Sell = true;


            //---------------
            ac_OrderHeader ordH = new ac_OrderHeader();
            var appDetails = db.aspnet_Applications.Single(aa => aa.ApplicationName == Membership.ApplicationName).ApplicationDetail;
            ordH.FiscalPeriodId = appDetails.CurrentFiscalPeriodId;
            ordH.Table = "order";
            ordH.Date = System.DateTime.Now;
            //ordH.CounterId = CounterId;
            //ordH.ShopId=shopId;
            ordH.ClientId = personId;
            decimal sum = 0;
            var appDetail = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationDetail;
            if (shoppingcartDetails.Count() < 1)
                throw new DivideByZeroException();
            foreach (var item in shoppingcartDetails)
            {
                string desc = "";
                if (item.inv_ItemDetail.inv_Barcode.inv_Property.Any(p => p.Property == "bride"))
                    desc = "دسته گل عروس ( ";
                if (item.inv_ItemDetail.inv_Barcode.inv_Property.Any(p => p.Property == "customized"))
                    desc = "دسته گل سفارشی ( ";

                ac_OrderDetail orderdetail = new ac_OrderDetail();

                // baraie inke shoppingcart  khali nbashad
                if (item.ac_ShoppingCartDetails1.Count > 0)
                {
                    decimal sumSh = 0;

                    // shoppingCard -> bestankar
                    foreach (var itmDt in item.ac_ShoppingCartDetails1)
                    {
                        desc += "تعداد " + itmDt.Quantity + " شاخه " + itmDt.inv_ItemDetail.inv_Barcode.Name + ". ";
                        ac_OrderDetail ordD = new ac_OrderDetail();
                        ordD.Quantity = itmDt.Quantity;
                        ac_AccountDetail accDetail = new ac_AccountDetail();
                        accDetail.Amount = itmDt.Price * itmDt.Quantity;
                        //???
                        //orderdetail.Broken = false;
                        //orderdetail.Serial = itmDt.;
                        accDetail.AccountId = itmDt.ItemDetailId;
                        accDetail.IsDept = true;
                        accDetail.ac_OrderDetail = ordD;
                        ordH.ac_AccountDetail.Add(accDetail);
                        sumSh += itmDt.Price * itmDt.Quantity;
                    }
                    sum += sumSh;
                    desc += " ) ";
                    orderdetail.Description = desc;
                }
                else
                    orderdetail.Description = item.Description;

                //sum += item.Quantity * item.Price;
                ////customer -> bedehkar
                //ac_AccountDetail accountDetailCu = new ac_AccountDetail();
                //accountDetailCu.AccountId = per.AccountId;
                //accountDetailCu.IsDept = false;
                //accountDetailCu.Amount = sum;
                //ordH.ac_AccountDetail.Add(accountDetailCu);
                orderdetail.Quantity = item.Quantity;

                //mojodie kala -> bestankar
                ac_AccountDetail accountDetail = new ac_AccountDetail();
                accountDetail.Amount = item.Quantity * item.inv_ItemDetail.BuyPrice;
                accountDetail.Description = item.Description;
                accountDetail.AccountId = item.ItemDetailId;
                accountDetail.IsDept = false;
                orderdetail.ac_AccountDetail = accountDetail;
                orderdetail.Quantity = item.Quantity;
                orderdetail.Broken = false;

                //forosh -> bestankar
                ac_AccountDetail accDetailS = new ac_AccountDetail();
                var accSell_TotalAmount = db.ac_Account.Where(a => a.RelatedAccountId == item.inv_ItemDetail.AccountId && a.ac_Account2.ac_TableAccount.Table == "itemSale");
                accDetailS.Amount = item.Quantity * item.Price;
                accDetailS.AccountId = accSell_TotalAmount.First().AccountId;
                accDetailS.IsDept = false;
                if (!string.IsNullOrEmpty(item.Description))
                    accDetailS.Description = item.Description;
                orderdetail.ac_AccountDetail1 = accDetailS;

                //gheimate tamam shode -> bedehkar
                var accPrice_TotalAmount = db.ac_Account.Where(a => a.RelatedAccountId == item.inv_ItemDetail.AccountId && a.ac_Account2.ac_TableAccount.Table == "itemPrice");
                ac_AccountDetail accDetailTA = new ac_AccountDetail();
                accDetailTA.Amount = item.Quantity * item.inv_ItemDetail.BuyPrice;
                accDetailTA.AccountId = accPrice_TotalAmount.First().AccountId;
                accDetailTA.IsDept = true;
                if (!string.IsNullOrEmpty(item.Description))
                    accDetailS.Description = item.Description;
                orderdetail.ac_AccountDetail2 = accDetailTA;

                sum += item.Quantity * item.Price;

                ordH.ac_AccountDetail.Add(accountDetail);
                ordH.ac_AccountDetail.Add(accDetailS);
                ordH.ac_AccountDetail.Add(accDetailTA);
            }


            ordH.CurrencyRateId = db.ac_Currency.Where(c => c.Currency == "تومان").FirstOrDefault().ac_CurrencyRate.OrderByDescending(c => c.Date).FirstOrDefault().CurrencyRateId;
            ordH.Description = "preOrderBuy " + receiver.Attribute("description").Value;
            if (appDetail.EmployeeId != null)
            {
                ordH.EmployeeId = appDetail.EmployeeId.Value;
            }
            ordH.InvoiceNO = invoiceNo;
            ordH.IsMoney = false;
            ordH.Sell = true;


            //------------------

            ac_ReceiverDetails ac_ReceiverDetails = new Models.ac_ReceiverDetails();
            ac_ReceiverDetails.Name = receiver.Attribute("name").Value;
            ac_ReceiverDetails.Address = receiver.Attribute("addressStr").Value;
            ac_ReceiverDetails.AddressID = Convert.ToInt32(receiver.Attribute("Address").Value);
            ac_ReceiverDetails.CellPhone = receiver.Attribute("mobile").Value;
            ac_ReceiverDetails.Family = receiver.Attribute("family").Value;
            ac_ReceiverDetails.PaymentType = 1;
            ac_ReceiverDetails.Phone = receiver.Attribute("phone").Value;
            ac_ReceiverDetails.PostalCode = receiver.Attribute("postcode").Value;
            ac_ReceiverDetails.SaleOrderId = saleOrderId;
            ac_ReceiverDetails.SaleReferenceId = saleRefrenceId;
            ac_ReceiverDetails.SendType = Convert.ToInt32(receiver.Attribute("sendtype").Value);
            ac_ReceiverDetails.SendDate = utility.GetDateTimeCulture(receiver.Attribute("datesend").Value);// utility.GetDateStartByYear(receiver.Attribute("datesend").Value);// utility.GetDateCulture(receiver.Attribute("datesend").Value);
            ac_ReceiverDetails.SendTime = receiver.Attribute("timesend").Value;
            ac_ReceiverDetails.IsGift = receiver.Attribute("isgift") == null ? false : Convert.ToBoolean(receiver.Attribute("isgift").Value);
            ac_ReceiverDetails.NeedWrap = receiver.Attribute("needwrap") == null ? false : Convert.ToBoolean(receiver.Attribute("needwrap").Value);
            ac_ReceiverDetails.GiftNote = receiver.Attribute("giftnote").Value;
            decimal totalAmount = 0;
            var simShopdt = shoppingcartDetails.Where(sd => sd.ac_ShoppingCartDetails1.Count == 0 && sd.ChildShoppingCartDetailsId == null);
            if (simShopdt.Count() > 0)
                totalAmount += simShopdt.Sum(sd => sd.Quantity * sd.Price);
            if (shoppingcartDetails.Any(sd => sd.ac_ShoppingCartDetails1.Count > 0))
            {
                foreach (var shopdtItms in shoppingcartDetails.Where(sd => sd.ac_ShoppingCartDetails1.Count > 0))
                {
                    totalAmount += shopdtItms.ac_ShoppingCartDetails1.Sum(sd => sd.Quantity * sd.Price) * shopdtItms.Quantity;
                    totalAmount += shopdtItms.Price * shopdtItms.Quantity;
                }
            }
            decimal discount = 0;
            if (totalAmount > 100000 && totalAmount <= 200000)
                discount = totalAmount * 1 / 100;
            else if (totalAmount > 200000)
                discount = totalAmount * 2 / 100;
            else if (totalAmount <= 100000)
                discount = 0;
            ac_ReceiverDetails.DiscountAmount = discount;

            //hazine peik
            string appName = Membership.ApplicationName;
            decimal deliveryExpense = db.ApplicationDetails.Single(a => a.AppName == appName).DeliveryExpense.Value;
            //Session["se-deliveryExpense"] = deliveryExpense;

            ac_ReceiverDetails.DeliveryExpense = deliveryExpense;
            ordH.ac_ReceiverDetails = ac_ReceiverDetails;
            ordH.Amount = totalAmount + ac_ReceiverDetails.DeliveryExpense.Value - ac_ReceiverDetails.DiscountAmount.Value;
            db.ac_OrderHeader.AddObject(ordH);
            foreach (var item in shoppingcart.ac_ShoppingCartDetails.ToList())
            {
                if (item.ac_ShoppingCartDetails1.Count > 0)
                    foreach (var items in item.ac_ShoppingCartDetails1.ToList())
                    {
                        db.ac_ShoppingCartDetails.DeleteObject(items);
                    }
                db.ac_ShoppingCartDetails.DeleteObject(item);
            }
            db.ac_ShoppingCart.DeleteObject(shoppingcart);
            //moshtari - > bedehkar
            ac_AccountDetail accountDetailCus = new ac_AccountDetail();
            accountDetailCus.AccountId = personId;
            accountDetailCus.IsDept = true;
            accountDetailCus.Amount = sum + ac_ReceiverDetails.DeliveryExpense.Value - ac_ReceiverDetails.DiscountAmount.Value;
            ordH.ac_AccountDetail.Add(accountDetailCus);

            if (discount > 0)
            {
                var buyDiscountIncome = discount;
                // agarkarbar shamel takhfif shavad va baraie hazine peik
                new ManagementController().AddOtherAccount("sale", ref ordH, 0, 0, 0, buyDiscountIncome, 0, 0, 0, deliveryExpense, 0);
            }
            else
            {
                // hazine peik
                new ManagementController().AddOtherAccount("sale", ref ordH, 0, 0, 0, 0, 0, 0, 0, deliveryExpense, 0);
            }

            db.SaveChanges();
            Session.Remove("shoppingCartId");
            var customer = db.p_Customer.FirstOrDefault(c => c.AccountId == personId);



            sendSMSEmail(customer.Email, Convert.ToBoolean((receiver.Attribute("isgift") == null ? "false" : receiver.Attribute("isgift").Value)), customer.p_Person.p_Phone.FirstOrDefault(m => m.Cell == true).Number, invoiceNo, personId, customer.p_Person.p_Phone.FirstOrDefault(m => m.Cell == true).Number);
            //if (!string.IsNullOrEmpty(customer.Email))
            //{
            //    var appDetails = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationDetail;
            //    System.Threading.Thread t = new System.Threading.Thread(sendEmail);
            //    object[] parameters = new object[] { customer.Email, "سفارش شما با موفقیت ثبت شد.", 
            //            "<div id='yui_3_2_0_1_131658669409891' style='width: 400px; margin: 20px auto; direction: rtl; font: 8pt/22px tahoma; border: 3px double rgb(40, 128, 192);'><div id='yui_3_2_0_1_131658669409888' style='direction: rtl; padding-right: 12px;'>از خرید شما سپاسگزاریم.</div><div style='width: 350px; margin: 10px auto; direction: rtl; font: 8pt/22px tahoma; border: 1px solid rgb(40, 128, 192);'><div style='padding-right: 20px;'>شماره فاکتور : " + invoiceNo + "</div></div><blockquote>با آروزی روزگار خوش برای شما<div style='text-align: left;'><a rel='nofollow' style='text-decoration: none; color: blue;' target='_blank' href='http://shirazrose.com'>shirazrose.com</a></div></blockquote></div>",
            //         appDetails.Email,
            //         appDetails.EmailPass,
            //         appDetails.Port,
            //         appDetails.Host};
            //    t.Start(parameters);
            //}
            //var customerMobile = customer.p_Person.p_Phone.FirstOrDefault(m => m.Cell == true);
            //if (customerMobile != null)
            //{
            //    string mobNum = customerMobile.Number;
            //    sms.Send(mobNum, "سفارش با موفقیت ثبت شد. شماره فاکتور " + invoiceNo + "\nاز خرید شما سپاسگزاریم.\nکارآمد سیستم\n");
            //}
            return ordH;
        }






        public ActionResult DeleteShoppingCartDetail(int shopdetailId)
        {
            try
            {
                bool cartDeleted = false;
                int? shoppingCartId = null;
                if (User.Identity.IsAuthenticated)
                {
                    string currUsername = User.Identity.Name;
                    int currPersonId = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == currUsername).p_Customer.FirstOrDefault().AccountId;
                    shoppingCartId = db.ac_ShoppingCart.SingleOrDefault(s => s.CustomerId == currPersonId).ShoppingCartId;
                }
                else if (Session["shoppingCartId"] != null)
                {
                    shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                }
                int detailsCount = db.ac_ShoppingCartDetails.Where(sd => sd.ShoppingCartId == shoppingCartId && sd.ChildShoppingCartDetailsId == null).Count();
                var detail = db.ac_ShoppingCartDetails.FirstOrDefault(sd => sd.ShoppingCartDetailsId == shopdetailId && sd.ShoppingCartId == shoppingCartId);
                if (detail.ac_ShoppingCartDetails1.Count > 0)
                {
                    foreach (var item in detail.ac_ShoppingCartDetails1.ToList())
                    {
                        db.ac_ShoppingCartDetails.DeleteObject(item);
                    }

                }
                db.ac_ShoppingCartDetails.DeleteObject(detail);
                if (detailsCount == 1)
                {
                    db.ac_ShoppingCart.DeleteObject(db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId));
                    cartDeleted = true;
                }
                if (db.SaveChanges() > 0 && cartDeleted)
                    Session["shoppingCartId"] = null;
                return Json(new { isdone = true, cartDeleted });
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                    return Json(new { isdone = false, msg = ex.InnerException.Message });
                return Json(new { isdone = false, msg = ex.Message });
            }

        }

        public ActionResult EditShoppingCartDetail(int shopdetailId, decimal quantity, int? colorId, int? sizeId)
        {
            try
            {
                int? shoppingCartId = null;
                if (User.Identity.IsAuthenticated)
                {
                    string currUsername = User.Identity.Name;
                    int currPersonId = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == currUsername).p_Customer.FirstOrDefault().AccountId;
                    shoppingCartId = db.ac_ShoppingCart.SingleOrDefault(s => s.CustomerId == currPersonId).ShoppingCartId;
                }
                else if (Session["shoppingCartId"] != null)
                {
                    shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                }
                var detail = db.ac_ShoppingCartDetails.SingleOrDefault(sd => sd.ShoppingCartDetailsId == shopdetailId && sd.ShoppingCartId == shoppingCartId);
                int barcodeId = detail.inv_ItemDetail.BarcodeId;
                int itemdetailId = detail.ItemDetailId;
                inv_ItemDetail itemdetail = new inv_ItemDetail();
                if (colorId != null && sizeId != null)
                    itemdetail = db.inv_ItemDetail.SingleOrDefault(i => i.BarcodeId == barcodeId && i.inv_Color.Any(c => c.ColorId == colorId) && i.inv_Size.Count() > 0
                                               && i.inv_Size.Any(c => c.SizeId == sizeId)
                                               && i.inv_ItemLocation.Sum(q => q.Quantity) > 0);
                if (colorId == null && sizeId != null)
                    itemdetail = db.inv_ItemDetail.SingleOrDefault(i => i.BarcodeId == barcodeId
                                               && i.inv_Size.Any(c => c.SizeId == sizeId)
                                               && i.inv_ItemLocation.Sum(q => q.Quantity) > 0);
                if (colorId != null && sizeId == null)
                    itemdetail = db.inv_ItemDetail.SingleOrDefault(i => i.BarcodeId == barcodeId && i.inv_Color.Any(c => c.ColorId == colorId)
                                               && i.inv_ItemLocation.Sum(q => q.Quantity) > 0);
                if (colorId == null && sizeId == null)
                {
                    //itemdetail = db.inv_ItemDetail.SingleOrDefault(i => i.BarcodeId == barcodeId && i.inv_Size.Count() == 0
                    //                           && i.inv_Color.Count() == 0
                    //                           && i.inv_ItemLocation.Sum(q => q.Quantity) > 0);
                    itemdetail = db.inv_ItemDetail.FirstOrDefault(i => i.AccountId == itemdetailId && i.inv_ItemLocation.Sum(q => q.Quantity) >= quantity);
                }
                if (itemdetail != null)
                {
                    itemdetailId = itemdetail.AccountId;
                    detail.ItemDetailId = itemdetailId;
                    detail.Price = itemdetail.inv_Barcode.inv_Price.OrderByDescending(p => p.Date).FirstOrDefault().Online.Value + (itemdetail.DetailPrice == null ? 0 : itemdetail.DetailPrice.Value);
                    detail.Quantity = quantity;
                    db.SaveChanges();
                    return Json(new { isdone = true });
                }
                else
                    return Json(new { isdone = false, msg = "این تعداد از کالا با رنگ و سایز انتخاب شده موجود نمی باشد." });
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                    return Json(new { isdone = false, msg = ex.InnerException.Message });
                return Json(new { isdone = false, msg = ex.Message });
            }
        }

        public ActionResult CurrentUserInfo()
        {
            var options = new List<SelectListItem> { 
                                          new SelectListItem { Text="انتخاب", Value="" }, 
                                          new SelectListItem { Text="زن", Value="false" }, 
                                          new SelectListItem { Text= "مرد", Value= "true" } 
                                        };
            ViewBag.Gender = new SelectList(options, "Value", "Text");
            if (User.Identity.IsAuthenticated)
            {
                var currentUser = db.aspnet_Membership.Single(m => m.aspnet_Users.UserName == User.Identity.Name).p_Customer.FirstOrDefault();
                if (currentUser != null)
                {
                    ViewData["provinceId"] = currentUser.p_Person.p_Address.ParentAddressId;
                    return Json(new
                    {
                        islogin = true,
                        userInfo = new
                        {
                            provinceId = currentUser.p_Person.p_Address.ParentAddressId,
                            currentUser.p_Person.Name,
                            currentUser.p_Person.Family,
                            currentUser.Address,
                            currentUser.p_Person.AddressId,
                            phone = currentUser.p_Person.p_Phone.Where(p => p.Cell == false).Select(p => p.Number).ToList(),
                            mobile = currentUser.p_Person.p_Phone.Where(p => p.Cell == true).Select(p => p.Number).ToList(),
                            currentUser.p_Person.Gender,
                            birthdateStr = currentUser.p_Person.DateOfBirth != null ? utility.GetstrDateCultureSimple(currentUser.p_Person.DateOfBirth.Value) : ""
                        }
                    });
                }
                else
                    return Json(new { islogin = true, msg = "خطا در جستجوی اطلاعات کاربری" });
            }
            else
                return Json(new { islogin = false });
        }

        public ActionResult Login(string username, string password)
        {
            try
            {
                if (User.Identity.IsAuthenticated)
                {
                    var currentUser = db.aspnet_Membership.Single(m => m.aspnet_Users.UserName == User.Identity.Name).p_Customer.FirstOrDefault();
                    if (currentUser != null)
                    {
                        if (Session["shoppingCartId"] != null)
                        {
                            var oldshoppingcart = db.ac_ShoppingCart.SingleOrDefault(s => s.CustomerId == currentUser.AccountId);
                            if (oldshoppingcart != null)
                            {
                                db.ac_ShoppingCart.DeleteObject(oldshoppingcart);
                            }
                            int shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                            var shoppingCart = db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId);
                            shoppingCart.CustomerId = currentUser.AccountId;
                            db.SaveChanges();
                            Session["shoppingCartId"] = null;
                        }
                        return Json(new
                        {
                            islogin = true,
                            userInfo = new
                            {
                                provinceId = currentUser.p_Person.p_Address.ParentAddressId,
                                currentUser.p_Person.Name,
                                currentUser.p_Person.Family,
                                currentUser.Address,
                                currentUser.p_Person.AddressId,
                                currentUser.p_Person.p_Address.ParentAddressId,
                                phone = currentUser.p_Person.p_Phone.Where(p => p.Cell == false).Select(p => p.Number).ToList(),
                                mobile = currentUser.p_Person.p_Phone.Where(p => p.Cell == true).Select(p => p.Number).ToList(),
                                currentUser.PostalCode,
                                currentUser.p_Person.Gender,
                                birthdateStr = currentUser.p_Person.DateOfBirth != null ? utility.GetstrDateCultureSimple(currentUser.p_Person.DateOfBirth.Value) : ""
                            }

                        });
                    }
                    else
                        return Json(new { islogin = false, msg = "خطا در جستجوی اطلاعات کاربری" });
                }
                else if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
                {
                    if (Membership.ValidateUser(username, password))
                    {
                        FormsAuthentication.Authenticate(username, password);
                        FormsAuthentication.SetAuthCookie(username, false);
                        var currentUser = db.aspnet_Membership.Single(m => m.aspnet_Users.UserName == username).p_Customer.FirstOrDefault();
                        if (currentUser != null)
                        {
                            if (Session["shoppingCartId"] != null)
                            {
                                var oldshoppingcart = db.ac_ShoppingCart.SingleOrDefault(s => s.CustomerId == currentUser.AccountId);
                                if (oldshoppingcart != null)
                                {
                                    foreach (var item in oldshoppingcart.ac_ShoppingCartDetails.ToList())
                                    {
                                        if (item.ac_ShoppingCartDetails1.Count > 0)
                                            foreach (var items in item.ac_ShoppingCartDetails1.ToList())
                                            {
                                                db.ac_ShoppingCartDetails.DeleteObject(items);
                                            }
                                        db.ac_ShoppingCartDetails.DeleteObject(item);
                                    }
                                    db.ac_ShoppingCart.DeleteObject(oldshoppingcart);
                                }
                                int shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                                var shoppingCart = db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId);
                                shoppingCart.CustomerId = currentUser.AccountId;
                                if (db.SaveChanges() > 0)
                                    Session["shoppingCartId"] = null;
                            }
                            return Json(new
                            {
                                islogin = true,
                                userInfo = new
                                {
                                    provinceId = currentUser.p_Person.p_Address.ParentAddressId,
                                    currentUser.p_Person.Name,
                                    currentUser.p_Person.Family,
                                    currentUser.Address,
                                    currentUser.p_Person.AddressId,
                                    phone = currentUser.p_Person.p_Phone.Where(p => p.Cell == false).FirstOrDefault().Number,
                                    mobile = currentUser.p_Person.p_Phone.Where(p => p.Cell == true).FirstOrDefault().Number,
                                    currentUser.PostalCode,
                                    currentUser.p_Person.Gender,
                                    birthdateStr = currentUser.p_Person.DateOfBirth != null ? utility.GetstrDateCultureSimple(currentUser.p_Person.DateOfBirth.Value) : ""
                                }

                            });
                        }
                        else
                            return Json(new { islogin = false, msg = "خطا در جستجوی اطلاعات کاربری" });
                    }
                    else
                        return Json(new { islogin = false, msg = "نام کاربری یا رمز عبور اشتباه می باشد." });
                }
                else
                    return Json(new { islogin = false, msg = "نام کاربری و رمز عبور را وارد کنید." });
            }
            catch (Exception ex) { return Json(new { islogin = false, msg = ex.Message }); }
        }

        public ActionResult SubmitShoppingCart()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Register(string Email, string Password, int? regCity, string Name, string Family, string BirthYear, string BirthMonth, string FindBy,
                                     string BirthDay, string Gender, string AddressStr, string PostalCode, string Combo, List<string> phones, List<string> mobiles)
        {
            MembershipUser NewUser = null;
            Membership.ApplicationName = Membership.ApplicationName;
            MapiDBEntities db = new MapiDBEntities();
            p_Person Person = new p_Person();
            try
            {
                MembershipCreateStatus status;
                NewUser = Membership.Providers["CustomerProvider"].CreateUser(Email, Password, Email, null, null, true, Guid.NewGuid(), out status);
                if (NewUser != null)
                {
                    //Roles.AddUserToRole(Email, "Customer");
                    string[] mobilesArr = mobiles[0].Split(',');
                    foreach (var mobile in mobilesArr)
                    {
                        string mob = mobile.Trim();
                        Person.p_Phone.Add(new p_Phone()
                        {
                            Cell = true,
                            Number = mob
                        });
                    }
                    if (phones.Count > 0)
                    {
                        string[] phonesArr = phones[0].Split(',');
                        foreach (var phone in phonesArr)
                        {
                            string ph = phone.Trim();
                            Person.p_Phone.Add(new p_Phone()
                            {
                                Cell = false,
                                Number = ph
                            });
                        }
                    }
                    var app = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName);
                    var pcode = db.p_Person.Where(r => r.AccountId == r.p_Customer.AccountId);
                    var co = pcode.Count() > 0 ? pcode.OrderByDescending(c => c.AccountId).Select(c => c.Code).First() : "9998";
                    co = co.Replace("c", "");
                    co = "c" + (int.Parse(co) + 2).ToString();
                    Person.Code = co;
                    Person.AddressId = regCity;
                    Person.Name = Name;
                    Person.Family = Family;
                    Person.RegDate = DateTime.Now;
                    //Person.ApplicationId = app.ApplicationId;
                    if (BirthYear != null)
                    {
                        BirthMonth = !string.IsNullOrEmpty(BirthMonth) ? BirthMonth : "1";
                        BirthDay = !string.IsNullOrEmpty(BirthDay) ? BirthDay : "1";
                        Person.DateOfBirth = utility.GetDateCulture(BirthYear, BirthMonth, BirthDay);
                    }
                    Person.Gender = Boolean.Parse(Gender);
                    Person.p_Customer = new p_Customer()
                    {
                        Address = AddressStr,
                        PostalCode = PostalCode,
                        NetBuy = 0,
                        NetPayment = 0,
                        Job = Combo,
                        UserId = (Guid)NewUser.ProviderUserKey,
                        Email = Email,
                        //???
                        //RegistererId = app.ApplicationDetail.EmployeeId,
                        FindBy = FindBy
                    };
                    db.p_Person.AddObject(Person);
                    db.SaveChanges();
                    if (Session["shoppingCartId"] != null)
                    {
                        int shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                        var shoppingCart = db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId);
                        shoppingCart.CustomerId = Person.p_Customer.AccountId;
                        if (db.SaveChanges() > 0)
                            Session["shoppingCartId"] = null;
                    }
                    var appDetails = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationDetail;
                    System.Threading.Thread t = new System.Threading.Thread(sendEmail);
                    object[] parameters = new object[] { Email, "اطلاعات کاربری در فروشگاه شیراز رز ", 
                        "<div id='yui_3_2_0_1_131658669409891' style='width: 400px; margin: 20px auto; direction: rtl; font: 8pt/22px tahoma; border: 3px double rgb(40, 128, 192);'><div id='yui_3_2_0_1_131658669409888' style='direction: rtl; padding-right: 12px;'>اطلاعات کاربری شما در سایت  به شرح زیر می باشد :</div><div style='width: 350px; margin: 10px auto; direction: rtl; font: 8pt/22px tahoma; border: 1px solid rgb(40, 128, 192);'><div style='padding-right: 20px;'>کد اشتراک : " + Person.Code + "</div><div style='padding-right: 20px;'>آدرس الکترونیک و نام کاربری : " + Email + "</div><div style='padding-right: 20px;'>کلمه عبور: " + Password + "</div></div><blockquote>با آروزی روزگار خوش برای شما<div style='text-align: left;'><a rel='nofollow' style='text-decoration: none; color: blue;' target='_blank' href='http://shirazrose.com'>shirazrose.com</a></div></blockquote></div>",
                     appDetails.Email,
                     appDetails.EmailPass,
                     appDetails.Port,
                     appDetails.Host};
                    t.Start(parameters);
                    sms.Send(mobilesArr[0], "کد اشتراک شما جهت سفارش تلفنی : " + Person.Code + "\n shirazrose.com");
                    FormsAuthentication.Authenticate(Email, Password);
                    FormsAuthentication.SetAuthCookie(Email, false);
                    return Json(new
                            {
                                islogin = true,
                                userInfo = new
                                {
                                    Person.p_Customer.p_Person.Name,
                                    Person.p_Customer.p_Person.Family,
                                    Person.p_Customer.Address,
                                    Person.p_Customer.p_Person.AddressId,
                                    Person.p_Customer.p_Person.p_Address.ParentAddressId,
                                    phone = Person.p_Customer.p_Person.p_Phone.Where(p => p.Cell == false).FirstOrDefault().Number,
                                    mobile = Person.p_Customer.p_Person.p_Phone.Where(p => p.Cell == true).FirstOrDefault().Number,
                                    Person.p_Customer.PostalCode,
                                    Person.p_Customer.p_Person.Gender,
                                    birthdateStr = Person.p_Customer.p_Person.DateOfBirth != null ? utility.GetstrDateCultureSimple(Person.p_Customer.p_Person.DateOfBirth.Value) : ""
                                }

                            });
                }
                else
                {
                    switch (status)
                    {
                        case MembershipCreateStatus.DuplicateUserName:
                            return Json(new { msg = "کاربری با این ایمیل قبلاً ثبت نام شده است، لطفاً ایمیل دیگری وارد کنید.", islogin = false });

                        case MembershipCreateStatus.DuplicateEmail:
                            return Json(new { msg = "کاربری با این ایمیل قبلاً ثبت نام شده است، لطفاً ایمیل دیگری وارد کنید.", islogin = false });

                        case MembershipCreateStatus.InvalidPassword:
                            return Json(new { msg = "رمز عبور معتبر نمی باشد. رمز عبور باید حداقل 6 حرفی باشد و شامل کاراکترهای = | . & نباشد.", islogin = false });

                        case MembershipCreateStatus.InvalidEmail:
                            return Json(new { msg = "آدرس ایمیل وارد شده معتبر نمی باشد. لطفاً ایمیل را تصحیح کنید.", islogin = false });

                        //case MembershipCreateStatus.InvalidAnswer:
                        //    return Json(new { msg = "The password retrieval answer provided is invalid. Please check the value and try again.", logged = false });

                        //case MembershipCreateStatus.InvalidQuestion:
                        //    return Json(new { msg = "The password retrieval question provided is invalid. Please check the value and try again.", logged = false });

                        case MembershipCreateStatus.InvalidUserName:
                            return Json(new { msg = "آدرس ایمیل وارد شده معتبر نمی باشد. لطفاً ایمیل را تصحیح کنید.", islogin = false });

                        case MembershipCreateStatus.ProviderError:
                            return Json(new { msg = "خطا در ثبت نام. لطفاً اطلاعات وارد شده را بررسی کرده و دوباره تلاش کنید. در صورت مشاهده مجدد این پیام به مدیر سایت اطلاع دهید.", islogin = false });

                        case MembershipCreateStatus.UserRejected:
                            return Json(new { msg = "خطا در ثبت نام. لطفاً اطلاعات وارد شده را بررسی کرده و دوباره تلاش کنید. در صورت مشاهده مجدد این پیام به مدیر سایت اطلاع دهید.", islogin = false });

                        default:
                            return Json(new { msg = "خطا در ثبت نام. لطفاً اطلاعات وارد شده را بررسی کرده و دوباره تلاش کنید. در صورت مشاهده مجدد این پیام به مدیر سایت اطلاع دهید.", islogin = false });
                    }
                }
            }
            catch (Exception ex)
            {
                if (ex.Message == "The username is already in use.")
                    return Json(new { msg = ".ایمیل مورد نظر قبلأ ثبت شده است", islogin = false });
                else
                    Membership.DeleteUser(Email);
                if (ex.InnerException != null)
                    return Json(new { msg = ex.InnerException.Message, islogin = false });
                return Json(new { msg = ex.Message, islogin = false });
            }
            finally { ((IDisposable)db).Dispose(); }
        }

        public ActionResult CheckMemberCode(string MemberCode)
        {
            if (!string.IsNullOrEmpty(MemberCode))
            {
                string[] codeCell = MemberCode.Split('-');
                if (codeCell.Count() == 2)
                {
                    decimal celllast5 = Convert.ToDecimal(codeCell[1]) - 24680;
                    string code = "c" + (Convert.ToDecimal(codeCell[0]) / 1234).ToString();
                    var currentUser = db.p_Customer.SingleOrDefault(c => c.p_Person.Code == code);
                    if (currentUser != null)
                    {
                        var customerCells = db.p_Person.Single(p => p.Code == code).p_Phone.Where(p => p.Cell == true).Select(p => p.Number);
                        foreach (var item in customerCells)
                        {
                            if (Convert.ToDecimal(item.Substring(5)) == celllast5)
                            {
                                var options = new List<SelectListItem> { 
                                          new SelectListItem { Text="انتخاب", Value="" }, 
                                          new SelectListItem { Text="زن", Value="false" }, 
                                          new SelectListItem { Text= "مرد", Value= "true" } 
                                        };

                                ViewBag.Gender = new SelectList(options, "Value", "Text");
                                //if (currentUser.p_Person.AddressId != null)
                                //    model.selectedValue = currentUser.p_Person.AddressId.Value;
                                string BirthDay = "", BirthMonth = "", BirthYear = "";
                                if (currentUser.p_Person.DateOfBirth != null)
                                {
                                    DateTime birthdate = currentUser.p_Person.DateOfBirth.Value;
                                    string[] birthdateStr = utility.GetstrDateCultureSimple(birthdate).Split('/');
                                    BirthDay = birthdateStr[2];
                                    BirthMonth = birthdateStr[1];
                                    BirthYear = birthdateStr[0];
                                }
                                List<string> moblst = new List<string>();
                                List<string> phonelst = new List<string>();
                                foreach (var mob in currentUser.p_Person.p_Phone.Where(p => p.Cell == true))
                                {
                                    moblst.Add(mob.Number);

                                }
                                //model.Mobilelist = moblst;
                                foreach (var ph in currentUser.p_Person.p_Phone.Where(p => p.Cell == false))
                                {
                                    phonelst.Add(ph.Number);
                                }
                                //model.Phonelist = phonelst;
                                //model.Combo = currentUser.Job;
                                //model.Mobile.Number = customer.p_Person.p_Phone.FirstOrDefault(p => p.Cell).Number;
                                //model.Phone.Number = customer.p_Person.p_Phone.FirstOrDefault(p => !p.Cell).Number;
                                return Json(new
                                {
                                    isdone = true,
                                    userInfo = new
                                    {
                                        currentUser.p_Person.Name,
                                        currentUser.p_Person.Family,
                                        currentUser.Address,
                                        currentUser.p_Person.AddressId,
                                        ParentAddressId = currentUser.p_Person.p_Address != null ? currentUser.p_Person.p_Address.ParentAddressId : null,
                                        moblst,
                                        phonelst,
                                        currentUser.PostalCode,
                                        currentUser.p_Person.Gender,
                                        BirthDay,
                                        BirthMonth,
                                        BirthYear,
                                        Combo = currentUser.Job,
                                        currentUser.p_Person.Code
                                    }

                                });
                            }
                        }
                    }
                }
                return Json(new { isdone = false, msg = "کد وارد شده صحیح نمی باشد." });
            }
            return Json(new { isdone = false, msg = "کد را وارد کنید." });
        }

        public ActionResult CompleteRegisteration(string Email, string Password, int regCity, string Name, string Family, string BirthYear, string BirthMonth,
                                     string BirthDay, string Gender, string AddressStr, string PostalCode, string Combo, List<string> phones, List<string> mobiles,
                                     string code, string FindBy)
        {
            MembershipUser NewUser = null;
            var Person = db.p_Person.Single(p => p.Code == code);
            var customer = Person.p_Customer;
            try
            {
                MembershipCreateStatus status;
                NewUser = Membership.Providers["CustomerProvider"].CreateUser(Email, Password, Email, null, null, true, Guid.NewGuid(), out status);
                if (NewUser != null)
                {
                    //Roles.AddUserToRole(Email, "Customer");
                    foreach (var item in Person.p_Phone.ToList())
                    {
                        db.p_Phone.DeleteObject(item);
                    }
                    string[] mobilesArr = mobiles[0].Split(',');
                    foreach (var mobile in mobilesArr)
                    {
                        string mob = mobile.Trim();
                        Person.p_Phone.Add(new p_Phone()
                        {
                            Cell = true,
                            Number = mob
                        });
                    }
                    if (phones.Count > 0)
                    {
                        string[] phonesArr = phones[0].Split(',');
                        foreach (var phone in phonesArr)
                        {
                            string ph = phone.Trim();
                            Person.p_Phone.Add(new p_Phone()
                            {
                                Cell = false,
                                Number = ph
                            });
                        }
                    }
                    Person.AddressId = regCity;
                    Person.Name = Name;
                    Person.Family = Family;
                    if (BirthYear != null)
                    {
                        BirthMonth = !string.IsNullOrEmpty(BirthMonth) ? BirthMonth : "01";
                        BirthDay = !string.IsNullOrEmpty(BirthDay) ? BirthDay : "01";
                        Person.DateOfBirth = utility.GetDateCulture(BirthYear, BirthMonth, BirthDay);
                    }
                    Person.Gender = Boolean.Parse(Gender);
                    customer.UserId = (Guid)NewUser.ProviderUserKey;
                    customer.Email = Email;
                    customer.Address = AddressStr;
                    customer.PostalCode = PostalCode;
                    customer.Job = Combo;
                    customer.FindBy = FindBy;
                    if (Session["shoppingCartId"] != null)
                    {
                        int shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                        var shoppingCart = db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId);
                        shoppingCart.CustomerId = Person.p_Customer.AccountId;
                        if (db.SaveChanges() > 0)
                            Session["shoppingCartId"] = null;
                    }
                    FormsAuthentication.Authenticate(Email, Password);
                    FormsAuthentication.SetAuthCookie(Email, false);

                    var appDetails = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationDetail;
                    System.Threading.Thread t = new System.Threading.Thread(sendEmail);
                    object[] parameters = new object[] { Email, "اطلاعات کاربری در فروشگاه شیراز رز ", 
                        "<div id='yui_3_2_0_1_131658669409891' style='width: 400px; margin: 20px auto; direction: rtl; font: 8pt/22px tahoma; border: 3px double rgb(40, 128, 192);'><div id='yui_3_2_0_1_131658669409888' style='direction: rtl; padding-right: 12px;'>اطلاعات کاربری شما در سایت  به شرح زیر می باشد :</div><div style='width: 350px; margin: 10px auto; direction: rtl; font: 8pt/22px tahoma; border: 1px solid rgb(40, 128, 192);'><div style='padding-right: 20px;'>کد اشتراک : " + Person.Code + "</div><div style='padding-right: 20px;'>آدرس الکترونیک و نام کاربری : " + Email + "</div><div style='padding-right: 20px;'>کلمه عبور: " + Password + "</div></div><blockquote>با آروزی روزگار خوش برای شما<div style='text-align: left;'><a rel='nofollow' style='text-decoration: none; color: blue;' target='_blank' href='http://shirazrose.com'>shirazrose.com</a></div></blockquote></div>",
                     appDetails.Email,
                     appDetails.EmailPass,
                     appDetails.Port,
                     appDetails.Host};
                    t.Start(parameters);
                    sms.Send(mobilesArr[0], "کد اشتراک شما جهت سفارش تلفنی : " + Person.Code + "\n shirazrose.com");
                    FormsAuthentication.Authenticate(Email, Password);
                    FormsAuthentication.SetAuthCookie(Email, false);
                    return Json(new
                    {
                        islogin = true,
                        userInfo = new
                        {
                            Person.p_Customer.p_Person.Name,
                            Person.p_Customer.p_Person.Family,
                            Person.p_Customer.Address,
                            Person.p_Customer.p_Person.AddressId,
                            Person.p_Customer.p_Person.p_Address.ParentAddressId,
                            phone = Person.p_Customer.p_Person.p_Phone.Where(p => p.Cell == false).FirstOrDefault().Number,
                            mobile = Person.p_Customer.p_Person.p_Phone.Where(p => p.Cell == true).FirstOrDefault().Number,
                            Person.p_Customer.PostalCode,
                            Person.p_Customer.p_Person.Gender,
                            birthdateStr = Person.p_Customer.p_Person.DateOfBirth != null ? utility.GetstrDateCultureSimple(Person.p_Customer.p_Person.DateOfBirth.Value) : ""
                        }

                    });
                }
                else
                //{
                //    ViewBag.result = "ایمیل یا رمز عبور اشتباه است.";
                //    return Json(new { link = "../Account/Register", logged = false });
                //}
                {
                    switch (status)
                    {
                        case MembershipCreateStatus.DuplicateUserName:
                            return Json(new { msg = "کاربری با این ایمیل قبلاً ثبت نام شده است، لطفاً ایمیل دیگری وارد کنید.", islogin = false });

                        case MembershipCreateStatus.DuplicateEmail:
                            return Json(new { msg = "کاربری با این ایمیل قبلاً ثبت نام شده است، لطفاً ایمیل دیگری وارد کنید.", islogin = false });

                        case MembershipCreateStatus.InvalidPassword:
                            return Json(new { msg = "رمز عبور معتبر نمی باشد. رمز عبور باید حداقل 6 حرفی باشد و شامل کاراکترهای = | . & نباشد.", islogin = false });

                        case MembershipCreateStatus.InvalidEmail:
                            return Json(new { msg = "آدرس ایمیل وارد شده معتبر نمی باشد. لطفاً ایمیل را تصحیح کنید.", islogin = false });

                        //case MembershipCreateStatus.InvalidAnswer:
                        //    return Json(new { msg = "The password retrieval answer provided is invalid. Please check the value and try again.", logged = false });

                        //case MembershipCreateStatus.InvalidQuestion:
                        //    return Json(new { msg = "The password retrieval question provided is invalid. Please check the value and try again.", logged = false });

                        case MembershipCreateStatus.InvalidUserName:
                            return Json(new { msg = "آدرس ایمیل وارد شده معتبر نمی باشد. لطفاً ایمیل را تصحیح کنید.", islogin = false });

                        case MembershipCreateStatus.ProviderError:
                            return Json(new { msg = "خطا در ثبت نام. لطفاً اطلاعات وارد شده را بررسی کرده و دوباره تلاش کنید. در صورت مشاهده مجدد این پیام به مدیر سایت اطلاع دهید.", logged = false });

                        case MembershipCreateStatus.UserRejected:
                            return Json(new { msg = "خطا در ثبت نام. لطفاً اطلاعات وارد شده را بررسی کرده و دوباره تلاش کنید. در صورت مشاهده مجدد این پیام به مدیر سایت اطلاع دهید.", logged = false });

                        default:
                            return Json(new { msg = "خطا در ثبت نام. لطفاً اطلاعات وارد شده را بررسی کرده و دوباره تلاش کنید. در صورت مشاهده مجدد این پیام به مدیر سایت اطلاع دهید.", logged = false });
                    }
                }

            }
            catch (Exception ex)
            {
                if (ex.Message == "The username is already in use.")
                    return Json(new { msg = "کاربری با این ایمیل قبلاً ثبت نام شده است، لطفاً ایمیل دیگری وارد کنید.", islogin = false });
                else
                    Membership.DeleteUser(Email);
                if (ex.InnerException != null)
                    return Json(new { msg = ex.InnerException.Message, islogin = false });
                return Json(new { msg = ex.Message, islogin = false });
            }
            finally { ((IDisposable)db).Dispose(); }
        }

        static void sendEmail(object parameters)
        {
            try
            {
                object[] parameterArray = (object[])parameters;
                System.Net.Mail.MailMessage m = new System.Net.Mail.MailMessage((string)parameterArray[3], ((string)parameterArray[0]).Trim());
                m.Subject = (string)parameterArray[1];
                m.IsBodyHtml = true;
                m.Body = (string)parameterArray[2];
                System.Net.Mail.SmtpClient mailClient = new System.Net.Mail.SmtpClient();
                //mailClient.Credentials = new System.Net.NetworkCredential("kaveh981@gmail.com", "123456");
                mailClient.Credentials = new System.Net.NetworkCredential((string)parameterArray[3], (string)parameterArray[4]);
                if ((int?)parameterArray[5] != null)
                    mailClient.Port = ((int?)parameterArray[5]).Value;//587;
                if (!string.IsNullOrEmpty((string)parameterArray[6]))
                    mailClient.Host = (string)parameterArray[6];// "mail.farsstar.com";smtp.gmail.com
                //  mailClient.EnableSsl = true;
                if (!string.IsNullOrEmpty((string)parameterArray[3]))
                    mailClient.Send(m);
            }
            catch (Exception ex) { }
        }

        public ActionResult GetProvinces()
        {
            var result = db.p_Address.Where(c => c.ParentAddressId == 1 && c.AddressId != 0 && c.AddressId != -1).Select(r => new { value = r.AddressId, title = r.Address });
            return Json(new { isdone = true, options = result });
        }

        public ActionResult ProvinceCities(int? provinceCode)
        {
            var options = db.p_Address.Where(c => c.ParentAddressId == provinceCode).Select(c => new
            {
                value = c.AddressId,
                title = c.Address
            });
            return Json(new { isdone = true, options });
        }
    }
}
