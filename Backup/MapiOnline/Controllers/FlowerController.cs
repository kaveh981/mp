using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MapiOnline.Models;
using System.Data.Objects;
using System.Web.Security;
using MvcInternationalization.Controllers;
namespace MapiOnline.Controllers
{
    public class FlowerController : BaseController
    {
        //
        // GET: /FlowerShop/

        MapiDBEntities db = new MapiDBEntities();

        public ActionResult Index()
        {
            return View();
        }
        //public ActionResult WeddingCar()
        //{
        //    string appname = Membership.ApplicationName;
        //    var product = db.inv_Barcode.FirstOrDefault(i => i.Name == "weddingCar");
        //    string[] imgs = product.Images.Split(',');
        //    return View(new OthersProductModel() { appName = appname, barcode = product.Barcode, definition = product.Definition, images = imgs });
        //}

        public ActionResult AddCustomizedBouquetToShopCart(List<FlowerInfoModel> flowerslist, int decorationId)
        {
            ac_ShoppingCart shoppingCart = new ac_ShoppingCart();
            ac_ShoppingCart usershoppingcart = null;
            int? currPersonId = null;
            if (User.Identity.IsAuthenticated)
            {
                string currUsername = User.Identity.Name;
                currPersonId = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == currUsername).p_Customer.FirstOrDefault().AccountId;
                usershoppingcart = db.ac_ShoppingCart.SingleOrDefault(s => s.CustomerId == currPersonId);
            }
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
            var itemDetail = db.inv_ItemDetail.Where(i => i.inv_ItemLocation.Sum(s => (decimal?)s.Quantity) >= 0 && i.AccountId == decorationId).FirstOrDefault();
            if (itemDetail == null)
                return Json(new { totalQuantity = 0 });
            shoppingCartDetails.ItemDetailId = itemDetail.AccountId;
            var shoppingdt = db.ac_ShoppingCartDetails.Where(sd => sd.ItemDetailId == shoppingCartDetails.ItemDetailId && sd.ShoppingCartId == shoppingCart.ShoppingCartId);
            decimal? totalQuantity = 0;
            bool NotExist = false;
            if (shoppingdt.Count() > 0)
            {
                foreach (var dec in shoppingdt)
                {

                    //var shopdetailStr = shoppingdt.ShoppingCartDetailsId.ToString();
                    var oldDecFlowers = db.ac_ShoppingCartDetails.Where(sd => sd.ChildShoppingCartDetailsId == dec.ShoppingCartDetailsId && sd.ShoppingCartId == shoppingCart.ShoppingCartId);
                    if (oldDecFlowers.Count() == flowerslist.Count)
                    {
                        NotExist = false;
                        foreach (var fl in flowerslist)
                        {
                            if (!oldDecFlowers.Any(of => of.Price == fl.price && of.Quantity == fl.count && of.ItemDetailId == fl.productId))
                                NotExist = true;
                        }
                    }
                    else
                        NotExist = true;
                    if (!NotExist)
                    {
                        dec.Quantity += 1;
                        if (currPersonId != null)
                            shoppingCart.CustomerId = currPersonId;
                        if (Session["shoppingCartId"] == null && (currPersonId == null || shoppingCart.ShoppingCartId == 0))
                        {
                            shoppingCart.Date = DateTime.Now;
                            db.ac_ShoppingCart.AddObject(shoppingCart);
                        }
                        break;
                    }
                }

            }
            else
            {
                var price = db.inv_Barcode.SingleOrDefault(b => b.inv_ItemDetail.FirstOrDefault().AccountId == decorationId).inv_Price.OrderByDescending(p => p.Date).FirstOrDefault();
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
                shoppingCartDetails.Quantity = 1;
                shoppingCartDetails.Description = db.inv_Barcode.Any(b => b.inv_ItemDetail.FirstOrDefault().AccountId == itemDetail.AccountId && b.inv_Property.Any(p => p.Property == "customized")) == true ? "دسته گل سفارشی" : "دسته گل عروس";
                foreach (var fl in flowerslist)
                {
                    shoppingCart.ac_ShoppingCartDetails.Add(new ac_ShoppingCartDetails()
                    {
                        ItemDetailId = fl.productId,
                        Price = fl.price,
                        Quantity = fl.count,
                        ac_ShoppingCartDetails2 = shoppingCartDetails
                    });
                }
                shoppingCart.ac_ShoppingCartDetails.Add(shoppingCartDetails);
                if (currPersonId != null)
                    shoppingCart.CustomerId = currPersonId;
                if (Session["shoppingCartId"] == null && (currPersonId == null || shoppingCart.ShoppingCartId == 0))
                {
                    shoppingCart.Date = DateTime.Now;
                    db.ac_ShoppingCart.AddObject(shoppingCart);
                }
            }
            if (NotExist)
            {
                var price = db.inv_Barcode.SingleOrDefault(b => b.inv_ItemDetail.FirstOrDefault().AccountId == decorationId).inv_Price.OrderByDescending(p => p.Date).FirstOrDefault();
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
                shoppingCartDetails.Quantity = 1;
                shoppingCartDetails.Description = db.inv_Barcode.Any(b => b.inv_ItemDetail.FirstOrDefault().AccountId == itemDetail.AccountId && b.inv_Property.Any(p => p.Property == "customized")) == true ? "دسته گل سفارشی" : "دسته گل عروس";
                foreach (var fl in flowerslist)
                {
                    shoppingCart.ac_ShoppingCartDetails.Add(new ac_ShoppingCartDetails()
                    {
                        ItemDetailId = fl.productId,
                        Price = fl.price,
                        Quantity = fl.count,
                        ac_ShoppingCartDetails2 = shoppingCartDetails
                    });
                }
                shoppingCart.ac_ShoppingCartDetails.Add(shoppingCartDetails);
                if (currPersonId != null)
                    shoppingCart.CustomerId = currPersonId;
                if (Session["shoppingCartId"] == null && (currPersonId == null || shoppingCart.ShoppingCartId == 0))
                {
                    shoppingCart.Date = DateTime.Now;
                    db.ac_ShoppingCart.AddObject(shoppingCart);
                }
            }
            db.SaveChanges();
            if (currPersonId == null)
                Session["shoppingCartId"] = shoppingCart.ShoppingCartId;
            var shopdts = db.ac_ShoppingCartDetails.Where(sd => sd.ShoppingCartId == shoppingCart.ShoppingCartId).Select(sd => new { sd.Quantity, sd.Price });
            totalQuantity = shopdts.Sum(sd => sd.Quantity);
            return Json(new
            {
                totalQuantity = totalQuantity
            });
        }

        public ActionResult FlowerSubscription()
        {
            bool? hasWholeRole = null;
            bool? hasFriendRole = null;
            if (User.Identity.IsAuthenticated)
            {
                string username = User.Identity.Name;
                List<string> roles = utility.GetUserRoles(db, username, Membership.ApplicationName);
                foreach (var rl in roles)
                {
                    if (rl == "isWholesaleBuyer")
                        hasWholeRole = true;
                    if (rl == "isFriend")
                        hasFriendRole = true;
                }
                if (hasWholeRole != true)
                    hasWholeRole = false;
                if (hasFriendRole != true)
                    hasFriendRole = false;
            }
            var items = db.inv_Barcode.Where(b => b.inv_Category.Any(c => c.Category == "شاخه گل") && b.ShowOnline == true);

            return View(new CategoryItemsModel { Categories = null, Items = items.ToList(), HasWholeRole = hasWholeRole, hasFriendRole = hasFriendRole });
        }
        public ActionResult AddFlowerSubscriptionToShoppingCart(List<FlowerInfoModel> flowerslist, List<string> daysArr, string startStr, string endStr)
        {
            int dayscount = GetCountDays(daysArr, startStr, endStr);
            ac_ShoppingCart shoppingCart = new ac_ShoppingCart();
            ac_ShoppingCart usershoppingcart = null;
            int? currPersonId = null;
            if (User.Identity.IsAuthenticated)
            {
                string currUsername = User.Identity.Name;
                currPersonId = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == currUsername).p_Customer.FirstOrDefault().AccountId;
                usershoppingcart = db.ac_ShoppingCart.SingleOrDefault(s => s.CustomerId == currPersonId);
            }
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

            string daysTxt = string.Empty;
            foreach (var day in daysArr)
            {
                switch (day)
                {
                    case "Sunday":
                        if (daysTxt != "")
                            daysTxt += ", ";
                        daysTxt += "یکشنبه";
                        break;
                    case "Monday":
                        if (daysTxt != "")
                            daysTxt += ", ";
                        daysTxt += "دوشنبه";
                        break;
                    case "Tuesday":
                        if (daysTxt != "")
                            daysTxt += ", ";
                        daysTxt += "سه شنبه";
                        break;
                    case "Wednesday":
                        if (daysTxt != "")
                            daysTxt += ", ";
                        daysTxt += "چهارشنبه";
                        break;
                    case "Thursday":
                        if (daysTxt != "")
                            daysTxt += ", ";
                        daysTxt += "پنج شنبه";
                        break;
                    case "Friday":
                        if (daysTxt != "")
                            daysTxt += ", ";
                        daysTxt += "جمعه";
                        break;
                    case "Saturday":
                        if (daysTxt != "")
                            daysTxt += ", ";
                        daysTxt += "شنبه";
                        break;
                }
            }

            foreach (var fl in flowerslist)
            {
                string desc = "اشتراک " + fl.count + "شاخه گل برای " + dayscount + " روز از تاریخ " + startStr + " تا تاریخ " + endStr + " روزهای ";
                desc += daysTxt;
                if (fl.sizeId != null)
                {
                    var itemDetail = db.inv_ItemDetail.SingleOrDefault(i => i.inv_ItemLocation.Sum(s => (decimal?)s.Quantity) >= fl.count * dayscount && i.BarcodeId == fl.productId &&
                                                                                              i.inv_Size.Any(c => c.SizeId == fl.sizeId));
                    if (itemDetail == null)
                        return Json(new { totalQuantity = 0 });
                    shoppingCart.ac_ShoppingCartDetails.Add(new ac_ShoppingCartDetails()
                    {
                        ItemDetailId = itemDetail.AccountId,
                        Price = fl.price,
                        Quantity = fl.count * dayscount,
                        Description = desc
                    });
                }
                else
                {
                    bool itemHasColorSize = db.inv_ItemDetail.Any(b => b.BarcodeId == fl.productId && (b.inv_Size.Count > 0 || b.inv_Color.Count > 0));
                    if (itemHasColorSize)
                        return Json(new { hascolorsize = true });
                    var itemDetail = db.inv_ItemDetail.Where(i => i.inv_ItemLocation.Sum(s => (decimal?)s.Quantity) >= 0 && i.BarcodeId == fl.productId).FirstOrDefault();
                    if (itemDetail == null)
                        return Json(new { totalQuantity = 0 });
                    shoppingCart.ac_ShoppingCartDetails.Add(new ac_ShoppingCartDetails()
                    {
                        ItemDetailId = itemDetail.AccountId,
                        Price = fl.price,
                        Quantity = fl.count * dayscount,
                        Description = desc
                    });
                }
            }
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
            var shopdts = db.ac_ShoppingCartDetails.Where(sd => sd.ShoppingCartId == shoppingCart.ShoppingCartId).Select(sd => new { sd.Quantity, sd.Price });
            decimal totalQuantity = 0;
            totalQuantity = shopdts.Sum(sd => sd.Quantity);
            return Json(new
            {
                totalQuantity = totalQuantity
            });
        }
        public ActionResult CountDays(List<string> daysArr, string startStr, string endStr)
        {
            int totalCount = GetCountDays(daysArr, startStr, endStr);
            return Json(new { isdone = true, count = totalCount });
        }
        public int GetCountDays(List<string> daysArr, string startStr, string endStr)
        {
            int totalCount = 0;
            foreach (var item in daysArr)
            {
                DayOfWeek day = 0;
                switch (item)
                {
                    case "Sunday":
                        day = 0;
                        break;
                    case "Monday":
                        day = DayOfWeek.Monday;
                        break;
                    case "Tuesday":
                        day = DayOfWeek.Tuesday;
                        break;
                    case "Wednesday":
                        day = DayOfWeek.Wednesday;
                        break;
                    case "Thursday":
                        day = DayOfWeek.Thursday;
                        break;
                    case "Friday":
                        day = DayOfWeek.Friday;
                        break;
                    case "Saturday":
                        day = DayOfWeek.Saturday;
                        break;
                }
                DateTime start = utility.GetDateCulture(startStr);
                DateTime end = utility.GetDateCulture(endStr);
                TimeSpan ts = end - start;                       // Total duration
                int count = (int)Math.Floor(ts.TotalDays / 7);   // Number of whole weeks
                int remainder = (int)(ts.TotalDays % 7);         // Number of remaining days
                int sinceLastDay = (int)(end.DayOfWeek - day);   // Number of days since last [day]
                if (sinceLastDay < 0) sinceLastDay += 7;         // Adjust for negative days since last [day]
                // If the days in excess of an even week are greater than or equal to the number days since the last [day], then count this one, too.
                if (remainder >= sinceLastDay) count++;
                totalCount += count;
            }
            return totalCount;
        }
        public ActionResult GetCurrShamsiDatePlusDay()
        {
            string currShamsi = utility.GetstrDateCultureSimple(DateTime.Now);
            return Json(new { isdone = true, currShamsi });
        }
    }
}
