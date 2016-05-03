using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MapiOnline.Models;
using System.Data.Objects;
using System.Web.Security;
using MvcInternationalization.Utility;
using MvcInternationalization.Controllers;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Schema;
using System.Net.Mail;
using System.Net;
using System.Data;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.UI;
using Statistics;

namespace MapiOnline.Controllers
{
    public class HomeController : BaseController
    {

        MapiDBEntities db = new MapiDBEntities();
        string appName = Membership.ApplicationName;

        public ActionResult DeleteSh()
        {
            var shopcart = db.ac_ShoppingCart;
            foreach (var item in shopcart.ToList())
            {
                if (item.ac_ShoppingCartDetails.Count > 0)
                {
                    foreach (var det in item.ac_ShoppingCartDetails.ToList())
                    {
                        if (det.ac_ShoppingCartDetails1.Count > 0)
                        {
                            foreach (var det2 in det.ac_ShoppingCartDetails1.ToList())
                            {
                                db.ac_ShoppingCartDetails.DeleteObject(det2);
                            }
                        }
                        db.ac_ShoppingCartDetails.DeleteObject(det);
                    }
                }
                db.ac_ShoppingCart.DeleteObject(item);
            }
            db.SaveChanges();
            if (shopcart.Count() > 0)
                return Json(new { msg = "Error" });
            else
                return Json(new { msg = "Success" });
        }
        public ActionResult SetCulture(string culture)
        {
            // Validate input
            culture = CultureHelper.GetValidCulture(culture);

            // Save culture in a cookie
            HttpCookie cookie = Request.Cookies["_culture"];
            if (cookie != null)
                cookie.Value = culture;   // update cookie value
            else
            {

                cookie = new HttpCookie("_culture");
                cookie.HttpOnly = false; // Not accessible by JS.
                cookie.Value = culture;
                cookie.Expires = DateTime.Now.AddYears(1);
            }
            Response.Cookies.Add(cookie);
            return Redirect(Request.UrlReferrer.AbsoluteUri);
            // return RedirectToAction("Index");
        }

        public ActionResult Index()
        {
            //string pass = Membership.GetUser("m_zhoobin51").GetPassword();
            //Statistic st = new Statistic();
            //ViewData["Online"] = st.Online;
            //ViewData["Today"] = st.Today;
            //ViewData["Yesterday"] = st.Yesterday;
            //ViewData["Month"] = st.Month;
            //ViewData["Total"] = st.Total;
            //ViewData["LastMonth"] = st.LastMonth;
            //ViewBag.Title = "درگاه ارتباطات جدید";
            //return View();
            //hazine peik
           // decimal? deliveryExpense = db.ApplicationDetails.Single(a => a.AppName == appName).DeliveryExpense;
            //Session["se-deliveryExpense"] = deliveryExpense;

            bool? hasWholeRole = null;
            bool? hasFriendRole = null;
            IQueryable<inv_Barcode> items = null;
            if (User.Identity.IsAuthenticated && !utility.isInRole(new MapiOnline.Models.MapiDBEntities(), User.Identity.Name, appName, "Online"))
            {
                string username = User.Identity.Name;
                List<string> roles = utility.GetUserRoles(db, username, appName);
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
                var currCustomer = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == User.Identity.Name).p_Customer.FirstOrDefault().inv_Restriction.Select(c => c.RestrictionId);

                items = db.inv_Barcode.Where(b => (b.inv_Restriction.Count < 1 || b.inv_Restriction.Any(r => currCustomer.Contains(r.RestrictionId))) && b.ShowOnline == true);
            }

            else
            {
                items = db.inv_Barcode.Where(b => (b.inv_Restriction.Count < 1) && b.ShowOnline == true);
            }
            return View(new CategoryItemsModel { Items = items.OrderByDescending(b => b.EnteryDate).ToList(), HasWholeRole = hasWholeRole, hasFriendRole = hasFriendRole });
        }

        public ActionResult BestSell()
        {
            bool? hasWholeRole = null;
            bool? hasFriendRole = null;
            IQueryable<inv_Barcode> items = null;
            DateTime date = DateTime.Now.AddMonths(-12);
            if (User.Identity.IsAuthenticated && !utility.isInRole(new MapiOnline.Models.MapiDBEntities(), User.Identity.Name, appName, "Online"))
            {
                string username = User.Identity.Name;
                List<string> roles = utility.GetUserRoles(db, username, appName);
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

                var currCustomer = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == User.Identity.Name).p_Customer.FirstOrDefault().inv_Restriction.Select(c => c.RestrictionId);
                items = db.inv_Barcode.Where(b => (b.inv_Restriction.Count < 1 || b.inv_Restriction.Any(r => currCustomer.Contains(r.RestrictionId))) && b.ShowOnline == true && b.EnteryDate > date);
            }
            else
            {
                items = db.inv_Barcode.Where(b => (b.inv_Restriction.Count < 1) && b.ShowOnline == true && b.EnteryDate > date);
            }
            return PartialView(new CategoryItemsModel { Items = items.OrderByDescending(b => b.SellQuantity).Take(4).ToList(), HasWholeRole = hasWholeRole, hasFriendRole = hasFriendRole });
        }

        public ActionResult GetCategoryTitle(int? categoryId)
        {
            var parents = db.GetParentCategoryById(categoryId, null).ToList();
            return PartialView(parents);
        }

        public ActionResult MenuCategory(int? categoryId, int? rootCategoryId)
        {

            return View(db.inv_Category.Where(s => s.aspnet_Applications.ApplicationName == appName && s.ShowOnline.Value && s.ParentCategoryId == null).OrderBy(o => o.Priority));
        }

        public ActionResult GetTopCategory(int? categoryId, int? rootCategoryId)
        {

            return View(db.inv_Category.Where(s => s.aspnet_Applications.ApplicationName == appName && s.ShowOnline.Value && s.ParentCategoryId == null).OrderBy(o => o.Priority));
        }
        public ActionResult GetTopCategoryDropDown(int? categoryId, int? rootCategoryId)
        {

            return View(db.inv_Category.Where(s => s.aspnet_Applications.ApplicationName == appName && s.ShowOnline.Value && s.ParentCategoryId == null).OrderBy(o => o.Priority));
        }
        public ActionResult PropertyMenu()
        {

            return View(db.inv_Property.Where(s => s.aspnet_Applications.ApplicationName == appName && s.ShowInMenu.Value).OrderBy(o => o.Property));
        }

        public ActionResult PropertyMenuDropDown()
        {

            return View(db.inv_Property.Where(s => s.aspnet_Applications.ApplicationName == appName && s.ShowInMenu.Value).OrderBy(o => o.Property));
        }
        public ActionResult BrandMenu(int? brandId, int? rootCategoryId)
        {

            return View(db.inv_Property.Where(s => s.aspnet_Applications.ApplicationName == appName && s.inv_Property2.TranslatedProperty == "occasion").OrderBy(o => o.Property));
        }

        public ActionResult SidePropertyMenu()
        {

            return View(db.inv_Property.SingleOrDefault(s => s.ParentId == null).inv_Property1.Where(s => s.aspnet_Applications.ApplicationName == appName && s.ShowInFilter != null && s.ShowInFilter.Value).OrderBy(o => o.Priority));
        }

        public ActionResult ColorMenu(int? colorId, int? rootCategoryId)
        {
            
            return View(db.inv_Color.Where(s => s.aspnet_Applications.ApplicationName == appName).OrderBy(o => o.Color));
        }
        public ActionResult visitorStatistic()
        {
            //XDocument xmlDoc = XDocument.Load(Server.MapPath("~/Data/mLogs.xml"));
            //var result = xmlDoc.Element("root").Elements("Log");
            //int day= result.Where(a => DateTime.Parse(a.Attribute("DateTime").Value.ToString()) < DateTime.Now).Count();
            //int yesterday = result.Where(a => DateTime.Parse(a.Attribute("DateTime").Value.ToString()) < DateTime.Now.AddDays(-1)).Count();
            //int month = result.Where(a => DateTime.Parse(a.Attribute("DateTime").Value.ToString()) < DateTime.Now.AddDays(-2)).Count();
            //int total = result.Where(a => DateTime.Parse(a.Attribute("DateTime").Value.ToString()) < DateTime.Now).Count();
            //int lastmonth = result.Where(a => DateTime.Parse(a.Attribute("DateTime").Value.ToString()) < DateTime.Now).Count();
            //return Json(new
            //{
            //    count = result.Count(),
            //    results = result.OrderByDescending(o => Convert.ToInt32(o.Attribute("Id").Value)).Skip(skip).Take(take)
            //       .Select(s => new
            //       {
            //           ip = s.Attribute("IP").Value,
            //           countryName = s.Attribute("countryName").Value,
            //           cityName = s.Attribute("cityName").Value,
            //           browser = s.Attribute("Browser").Value,
            //           appName = s.Attribute("AppName").Value,
            //           dateTime = s.Attribute("DateTime").Value,
            //           timeZone = s.Attribute("timeZone").Value,
            //           user = s.Attribute("Username") != null ? s.Attribute("Username").Value : "",
            //       })
            //});
            try
            {
                Statistic st = new Statistic();
                ViewData["Online"] = st.Online;
                ViewData["Today"] = st.Today;
                ViewData["Yesterday"] = st.Yesterday;
                ViewData["Month"] = st.Month;
                ViewData["Total"] = st.Total;
                ViewData["LastMonth"] = st.LastMonth;
                ViewBag.Title = "درگاه ارتباطات جدید";
                return View();
            }
            catch (Exception ex)
            {
                XDocument xmlDoc = XDocument.Load(Server.MapPath("~/Statistics/statistics.xml"));
                var result = xmlDoc.Element("dataroot");
                ViewData["Online"] =HttpContext.Application["Online"];
                ViewData["Yesterday"] = Convert.ToInt32(result.Element("yesterday").Value);
                ViewData["Month"] = Convert.ToInt32(result.Element("month").Value);
                ViewData["Today"] = Convert.ToInt32(result.Element("today").Value);
                ViewData["LastMonth"] = Convert.ToInt32(result.Element("lastmonth").Value);
                ViewData["Total"] = Convert.ToInt32(result.Element("total").Value);
                return View();
            }
        }
        public ActionResult CategoryMenu(int? categoryId, int? rootCategoryId)
        {
            //if (rootCategoryId == null)
            //    rootCategoryId = 910;
            var parents = db.GetParentCategoryById(categoryId, null).OrderBy(o => o.Priority).ToList();
            //var topcategories = db.inv_Category.Where(c => c.ShowOnline == true).OrderBy(o => o.Priority).ToList();
            //  categoryId = 910;
            //var parents = db.GetParentCategoryById(categoryId, null).ToList();
            if (parents.Count > 0 && rootCategoryId != null)
                parents.Remove(parents.Single(s => s.CategoryId == rootCategoryId));
            var currentCategories = db.inv_Category.Where(c => c.ParentCategoryId == categoryId && c.ShowOnline == true).OrderBy(o => o.Priority).ToList();
            if (currentCategories.Count < 1)
            {
                var cid = parents.LastOrDefault();
                if (cid != null)
                {
                    currentCategories = db.inv_Category.Where(c => c.ParentCategoryId == cid.ParentCategoryId && c.ShowOnline == true).OrderBy(o => o.Priority).ToList();
                    parents.Remove(parents.LastOrDefault());
                }
            }
            List<inv_Category> rootCategories = new List<inv_Category>();
            if (rootCategoryId == null)
            {
                if (categoryId == null)
                    currentCategories = db.inv_Category.Where(c => c.ParentCategoryId == null && c.ShowOnline == true).OrderBy(o => o.Priority).ToList();
                rootCategories = db.inv_Category.Where(c => c.ParentCategoryId == null && c.ShowOnline == true).OrderBy(o => o.Priority).ToList();
                if (categoryId == null)
                    rootCategories = db.inv_Category.Where(c => c.ParentCategoryId == null && c.ShowOnline == true).OrderBy(o => o.Priority).ToList();
            }
            else
            {
                if (categoryId == null)
                    currentCategories = db.inv_Category.Where(c => c.ParentCategoryId == rootCategoryId && c.ShowOnline == true).OrderBy(o => o.Priority).ToList();
                rootCategories = db.inv_Category.Where(c => c.ParentCategoryId == rootCategoryId && c.ShowOnline == true).OrderBy(o => o.Priority).ToList();
                if (categoryId == null)
                    rootCategories = db.inv_Category.Where(c => c.ParentCategoryId == rootCategoryId && c.ShowOnline == true).OrderBy(o => o.Priority).ToList();
            }
            //if (categoryId == null)
            //    currentCategories = db.inv_Category.Where(c => c.ParentCategoryId == rootCategoryId && c.ShowOnline == true).ToList();
            //var rootCategories = db.inv_Category.Where(c => c.ParentCategoryId == rootCategoryId && c.ShowOnline == true).ToList();
            //if (categoryId == null)
            //    rootCategories = db.inv_Category.Where(c => c.ParentCategoryId == rootCategoryId && c.ShowOnline == true).ToList();
            ViewData["topCategory"] = db.inv_Category.SingleOrDefault(c => c.CategoryId == categoryId && c.ShowOnline == true) != null ? db.inv_Category.SingleOrDefault(c => c.CategoryId == categoryId && c.ShowOnline == true).Category : "";
            return PartialView(new CategoryMenuModel { parentCategoryId = parents.Count > 0 ? parents.First().CategoryId : 0, Categories = currentCategories, Parents = parents, RootCategories = rootCategories });
        }

        public ActionResult GetSideMenu()
        {
            XDocument xmlDoc = XDocument.Load(Server.MapPath("~/Data/Menu.xml"));
            var onlineMenu = xmlDoc.Element("root").Elements("Content").Where(c => c.Attribute("menuLocation").Value == "side" && c.Attribute("show").Value == "true").OrderBy(o => Convert.ToInt32(o.Attribute("order").Value));
            //    .Select(t => new SideMenu
            //{
            //    MenuId = Convert.ToInt32(t.Attribute("Id").Value),
            //    Order = Convert.ToInt32(t.Attribute("order").Value),
            //    MenuName = t.Attribute("menuName").Value,
            //    IsLink = bool.Parse(t.Attribute("isLink").Value),
            //    MenuLocation = t.Attribute("menuLocation").Value,
            //    LinkTo = t.Attribute("linkTo").Value,
            //    Show = bool.Parse(t.Attribute("show").Value),
            //    Lang = t.Attribute("lang").Value,
            //    NewPage=bool.Parse(t.Attribute("newPage").Value)

            //}).OrderBy(o => o.Order).ToList();
            return PartialView(onlineMenu);
        }

        public ActionResult GetTopMenu()
        {
            XDocument xmlDoc = XDocument.Load(Server.MapPath("~/Data/Menu.xml"));
            var onlineMenu = xmlDoc.Element("root").Elements("Content").Where(c => c.Attribute("menuLocation").Value == "side" && c.Attribute("show").Value == "true").OrderBy(o => Convert.ToInt32(o.Attribute("order").Value));
            return PartialView(onlineMenu);
        }
        public ActionResult GetTopMenuWide()
        {
            XDocument xmlDoc = XDocument.Load(Server.MapPath("~/Data/Menu.xml"));
            var onlineMenu = xmlDoc.Element("root").Elements("Content").Where(c => c.Attribute("menuLocation").Value == "side" && c.Attribute("show").Value == "true").OrderBy(o => Convert.ToInt32(o.Attribute("order").Value));
            return PartialView(onlineMenu);
        }
        public ActionResult GetBottomMenu()
        {
            XDocument xmlDoc = XDocument.Load(Server.MapPath("~/Data/Menu.xml"));
            var onlineMenu = xmlDoc.Element("root").Elements("Content").Where(c => c.Attribute("menuLocation").Value == "bottom" && c.Attribute("show").Value == "true").OrderBy(o => Convert.ToInt32(o.Attribute("order").Value));//.Select(t => new SideMenu
            //{
            //    MenuId = Convert.ToInt32(t.Attribute("Id").Value),
            //    Order = Convert.ToInt32(t.Attribute("order").Value),
            //    MenuName = t.Attribute("menuName").Value,
            //    IsLink = bool.Parse(t.Attribute("isLink").Value),
            //    MenuLocation = t.Attribute("menuLocation").Value,
            //    LinkTo = t.Attribute("linkTo").Value,
            //    Show = bool.Parse(t.Attribute("show").Value),
            //    Lang = t.Attribute("lang").Value,
            //    NewPage = bool.Parse(t.Attribute("newPage").Value)

            //}).OrderBy(o => o.Order).ToList();
            return PartialView(onlineMenu);
        }
        public static Func<MapiDBEntities, string, int, int, List<int?>, object>
        getReturnProduct = CompiledQuery.Compile((MapiDBEntities db, string q, int limit, int categoryId, List<int?> childs)
         => db.inv_Barcode.Where(b => b.inv_Category.Any(s => childs.Contains(s.CategoryId)) && (b.ApplicationId == null || b.aspnet_Applications.ApplicationName == Membership.ApplicationName) && ((b.Name).Contains(q) || b.ItemCode.Contains(q))).OrderBy(b => b.Name).Take(limit)
        .Select(b => new { label = b.Name, value = b.Name }));

        public ActionResult GetCompletionListByItemName(int? categoryId, string keyword)
        {
            string q = keyword;
            if (categoryId != null)
            {
                List<int?> childs = db.GetSubCategoryByParent(categoryId).ToList();
                childs.Add(categoryId);
                return Json(db.inv_Barcode.Where(b => b.inv_Category.Any(s => childs.Contains(s.CategoryId)) && (b.ApplicationId == null || b.aspnet_Applications.ApplicationName == appName) && ((b.Name).Contains(q) || b.ItemCode.Contains(q)) && b.ShowOnline == true).OrderBy(b => b.Name).Take(10)
            .Select(b => new { label = b.Name, value = b.Name }));
            }
            else
            {
                return Json(db.inv_Barcode.Where(b => (b.ApplicationId == null || b.aspnet_Applications.ApplicationName == appName) && ((b.Name).Contains(q) || b.ItemCode.Contains(q)) && b.ShowOnline == true).OrderBy(b => b.Name).Take(10)
           .Select(b => new { label = b.Name, value = b.Name }));
            }

        }

        public ActionResult SearchProduct(int categoryId, string keyword, int? page)
        {
            var categories = db.GetParentCategoryById(categoryId, null).ToList();
            List<int?> childs = db.GetSubCategoryByParent(categoryId).ToList();
            childs.Add(categoryId);
            IQueryable<inv_Barcode> items = null;
            if (User.Identity.IsAuthenticated)
            {
                var currCustomer = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == User.Identity.Name).p_Customer.FirstOrDefault().inv_Restriction.Select(c => c.RestrictionId);

                items = db.inv_Barcode.Where(b => (b.inv_Restriction.Count < 1 || b.inv_Restriction.Any(r => currCustomer.Contains(r.RestrictionId))) && b.inv_Category.Any(s => childs.Contains(s.CategoryId)) &&
                                                     (string.IsNullOrEmpty(keyword) || b.Name.Contains(keyword)) && b.ShowOnline == true);
            }
            else
            {
                var currCustomer = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == User.Identity.Name).p_Customer.FirstOrDefault().inv_Restriction.Select(c => c.RestrictionId);

                items = db.inv_Barcode.Where(b => (b.inv_Restriction.Count < 1) && b.inv_Category.Any(s => childs.Contains(s.CategoryId)) &&
                                                     (string.IsNullOrEmpty(keyword) || b.Name.Contains(keyword)) && b.ShowOnline == true);
            }
            int count = items.Count();
            ViewBag.Pager = Pager.Items(count).PerPage(24).Move(1).Segment(10).Center();
            if (page != null)
            {
                ViewBag.Pager = Pager.Items(count).PerPage(24).Move(page.Value).Segment(10).Center();
                int skip = (page.Value - 1) * 24;
                return View("GetCategoryItems", new CategoryItemsModel { Categories = categories, Items = items.OrderByDescending(b => b.EnteryDate).Skip(skip).Take(24).ToList() });
            }
            return View(new CategoryItemsModel { Categories = categories, Items = items.OrderByDescending(b => b.EnteryDate).Take(24).ToList() });
        }

        //public ActionResult GetCategoryItems(int? categoryId, int? page, string txtSearch, bool? isNew, bool? isSale, bool? isOffer, bool? isBestSelling,
        //                                     string sortBy, int? itemPerPage)
        //{
        //    bool? hasWholeRole = null;
        //    bool? hasFriendRole = null;
        //    if (itemPerPage == null)
        //        itemPerPage = 16;
        //    if (string.IsNullOrEmpty(sortBy))
        //        sortBy = "date";
        //    IQueryable<inv_Barcode> items = null;
        //    var categories = db.inv_Category.ToList();

        //    if (User.Identity.IsAuthenticated && !utility.isInRole(new MapiOnline.Models.MapiDBEntities(), User.Identity.Name, appName, "Online"))
        //    {
        //        string username = User.Identity.Name;
        //        List<string> roles = utility.GetUserRoles(db, username, appName);
        //        foreach (var rl in roles)
        //        {
        //            if (rl == "isWholesaleBuyer")
        //                hasWholeRole = true;
        //            if (rl == "isFriend")
        //                hasFriendRole = true;
        //        }
        //        if (hasWholeRole != true)
        //            hasWholeRole = false;
        //        if (hasFriendRole != true)
        //            hasFriendRole = false;

        //        var currCustomer = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == User.Identity.Name).p_Customer.FirstOrDefault().inv_Restriction.Select(c => c.RestrictionId);

        //        if (categoryId != null)
        //        {
        //            List<int?> childs = db.GetSubCategoryByParent(categoryId).ToList();
        //            childs.Add(categoryId);
        //            items = db.inv_Barcode.Where(b => (b.inv_Restriction.Count < 1 || b.inv_Restriction.Any(r => currCustomer.Contains(r.RestrictionId))) && b.inv_Category.Any(s => childs.Contains(s.CategoryId)) &&
        //                                                 (string.IsNullOrEmpty(txtSearch) || b.Name.Contains(txtSearch) || b.ItemCode.Contains(txtSearch)) &&
        //                                                  b.ShowOnline == true &&
        //                                                 (isNew == false || isNew == null || b.IsNew == true) &&
        //                                                 (isSale == false || isSale == null || b.IsSale == true) &&
        //                                                 (isOffer == false || isOffer == null || b.IsOffer == true));
        //        }
        //        else if (isBestSelling != true)
        //        {
        //            items = db.inv_Barcode.Where(b => (b.inv_Restriction.Count < 1 || b.inv_Restriction.Any(r => currCustomer.Contains(r.RestrictionId))) && (string.IsNullOrEmpty(txtSearch) || b.Name.Contains(txtSearch) || b.ItemCode.Contains(txtSearch)) &&
        //                                                  b.ShowOnline == true &&
        //                                                 (isNew == false || isNew == null || b.IsNew == true) &&
        //                                                 (isSale == false || isSale == null || b.IsSale == true) &&
        //                                                 (isOffer == false || isOffer == null || b.IsOffer == true));

        //        }
        //        else if (isBestSelling == true)
        //        {
        //            items = db.inv_Barcode.Where(b => (b.inv_Restriction.Count < 1 || b.inv_Restriction.Any(r => currCustomer.Contains(r.RestrictionId))) && b.SellQuantity > 4 && b.ShowOnline == true);
        //        }
        //    }
        //    else
        //    {
        //        if (categoryId != null)
        //        {
        //            List<int?> childs = db.GetSubCategoryByParent(categoryId).ToList();
        //            childs.Add(categoryId);
        //            items = db.inv_Barcode.Where(b => b.inv_Restriction.Count < 1 && b.inv_Category.Any(s => childs.Contains(s.CategoryId)) &&
        //                                                 (string.IsNullOrEmpty(txtSearch) || b.Name.Contains(txtSearch) || b.ItemCode.Contains(txtSearch)) &&
        //                                                  b.ShowOnline == true &&
        //                                                 (isNew == false || isNew == null || b.IsNew == true) &&
        //                                                 (isSale == false || isSale == null || b.IsSale == true) &&
        //                                                 (isOffer == false || isOffer == null || b.IsOffer == true));
        //        }
        //        else if (isBestSelling != true)
        //        {
        //            items = db.inv_Barcode.Where(b => b.inv_Restriction.Count < 1 && (string.IsNullOrEmpty(txtSearch) || b.Name.Contains(txtSearch) || b.ItemCode.Contains(txtSearch)) &&
        //                                                  b.ShowOnline == true &&
        //                                                 (isNew == false || isNew == null || b.IsNew == true) &&
        //                                                 (isSale == false || isSale == null || b.IsSale == true) &&
        //                                                 (isOffer == false || isOffer == null || b.IsOffer == true));

        //        }
        //        else if (isBestSelling == true)
        //        {
        //            items = db.inv_Barcode.Where(b => b.inv_Restriction.Count < 1 && b.SellQuantity > 4 && b.ShowOnline == true);
        //        }

        //    }
        //    int count = items.Count();
        //    ViewBag.Pager = Pager.Items(count).PerPage(12).Move(1).Segment(10).Center();
        //    switch (sortBy)
        //    {
        //        case "date":
        //            items = items.OrderByDescending(b => b.EnteryDate);
        //            break;
        //        case "Name-asc":
        //            items = items.OrderBy(b => b.Name);
        //            break;
        //        case "Name-dsc":
        //            items = items.OrderByDescending(b => b.Name);
        //            break;
        //        case "Price-asc":
        //            items = items.OrderByDescending(b => b.inv_Price.FirstOrDefault().Online);
        //            break;
        //        case "Price-dsc":
        //            items = items.OrderByDescending(b => b.inv_Price.FirstOrDefault().Online);
        //            break;
        //    }
        //    if (page != null)
        //    {
        //        ViewBag.Pager = Pager.Items(count).PerPage(itemPerPage.Value).Move(page.Value).Segment(10).Center();
        //        int skip = (page.Value - 1) * itemPerPage.Value;

        //        return View(new CategoryItemsModel { Categories = categories, Items = items.Skip(skip).Take(itemPerPage.Value).ToList(), HasWholeRole = hasWholeRole, hasFriendRole = hasFriendRole });
        //    }
        //    return View(new CategoryItemsModel { Categories = categories, Items = items.Take(itemPerPage.Value).ToList(), HasWholeRole = hasWholeRole, hasFriendRole = hasFriendRole });
        //}

        public ActionResult Category(int? categoryId, int? page, string txtSearch, bool? isNew, bool? isSale, bool? isOffer, bool? isBestSelling, int? perPage, string sortBy)
        {
            sortBy = Request["sortBy"];


            decimal? fromPrice = !string.IsNullOrEmpty(Request["fromPrice"]) ? Convert.ToDecimal(Request["fromPrice"]) : Request["priceRange"] != null ? (Request["priceRange"].ToString().Split(',')[0] != null ? (decimal?)Convert.ToDecimal(Request["priceRange"].ToString().Split(',')[0]) : null) : null;
            decimal? toPrice = !string.IsNullOrEmpty(Request["toPrice"]) ? Convert.ToDecimal(Request["toPrice"]) : Request["priceRange"] != null ? (Request["priceRange"].ToString().Split(',')[1] != null ? (decimal?)Convert.ToDecimal(Request["priceRange"].ToString().Split(',')[1]) : null) : null;
            int itemPerPage = 24;
            if (perPage != null)
                itemPerPage = perPage.Value;
            if (string.IsNullOrEmpty(sortBy))
                sortBy = "EnteryDate DESC";
            bool? hasWholeRole = null;
            bool? hasFriendRole = null;
            IQueryable<inv_Barcode> items = null;
            var categories = db.inv_Category.ToList();
            List<ObjectParameter> ol = new List<ObjectParameter>();
            string dynStr = string.Empty;
            dynStr += "(it.aspnet_Applications.ApplicationName = @appname or it.aspnet_Applications.ApplicationId Is NULL )  And it.ShowOnline == @showOnline ";
            ol.Add(new ObjectParameter("appname", appName));
            ol.Add(new ObjectParameter("showOnline", true));
            if (!string.IsNullOrEmpty(txtSearch))
            {
                if (dynStr.Length > 0)
                    dynStr += " AND ";
                dynStr += "( (it.Name ) LIKE '%' + @name + '%' OR (it.ItemCode ) LIKE '%' + @name + '%')";
                ol.Add(new ObjectParameter("name", txtSearch));

            }
            if (categoryId != null)
            {
                if (dynStr.Length > 0)
                    dynStr += " And ";
                dynStr += "EXISTS(select o From it.inv_Category as o where(o.CategoryId  in " + utility.getHierarchyDataForGeneralCategory(categoryId) + "))";// ; "it.CategoryID in " + utility.getHierarchyDataForGeneralCategory(categoryId);
            }
            if (isNew != null)
            {
                if (dynStr.Length > 0)
                    dynStr += " AND ";
                dynStr += " it.IsNew = @isNew";
                ol.Add(new ObjectParameter("isNew", isNew));
            }
            if (Request["property"] != null)
            {
                foreach (var item in Request["property"].Split(','))
                {
                    if (dynStr.Length > 0)
                        dynStr += " AND ";
                    //db.inv_Barcode.First().inv_Price.OrderByDescending(a=>a.Date).FirstOrDefault().Online;
                    dynStr += "EXISTS(select o From it.inv_Property as o where(o.PropertyId  ==" + item + "))";
                }
            }
            //if (Request["property"] != null)
            //{
            //    if (dynStr.Length > 0)
            //        dynStr += " AND ";
            //    //db.inv_Barcode.First().inv_Price.OrderByDescending(a=>a.Date).FirstOrDefault().Online;
            //    dynStr += "EXISTS(select o From it.inv_Property as o where(o.PropertyId  in {" + Request["property"].ToString() + "}))";
            //}
            if (Request["colors"] != null)
            {
                if (dynStr.Length > 0)
                    dynStr += " AND ";
                dynStr += "EXISTS(select o From it.inv_ItemDetail as o where (EXISTS(select g from o.inv_Color  as g where( g.ColorId in  {" + Request["colors"].ToString() + "}))))";
            }
            if (Request["discount"] != null && Request["discount"].Split(',').Count() < 2)
            {
                if (dynStr.Length > 0)
                    dynStr += " AND ";
                dynStr += " it.IsSale = @IsSale";
                ol.Add(new ObjectParameter("IsSale", Convert.ToBoolean(Request["discount"].ToString())));
            }
            if (fromPrice != null)
            {
                if (dynStr.Length > 0)

                    dynStr += " AND ";
                dynStr += "EXISTS(select o From it.inv_Price  as o where( o.Online >= @fromPrice ))";
                ol.Add(new ObjectParameter("fromPrice", fromPrice));
            }
            if (toPrice != null)
            {
                if (dynStr.Length > 0)

                    dynStr += " AND ";
                dynStr += "EXISTS(select o From it.inv_Price  as o where( o.Online <= @toPrice ))";
                ol.Add(new ObjectParameter("toPrice", toPrice));
            }
            if (isSale != null)
            {
                if (dynStr.Length > 0)
                    dynStr += " AND ";
                dynStr += " it.IsSale = @isSale";
                ol.Add(new ObjectParameter("isSale", isSale));
            }
            if (isOffer != null)
            {
                if (dynStr.Length > 0)
                    dynStr += " AND ";
                dynStr += " it.IsOffer = @isOffer";
                ol.Add(new ObjectParameter("isOffer", isOffer));
            }

            if (User.Identity.IsAuthenticated && !utility.isInRole(new MapiOnline.Models.MapiDBEntities(), User.Identity.Name, appName, "Online"))
            {
                string username = User.Identity.Name;
                List<string> roles = utility.GetUserRoles(db, username, appName);
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

                var currCustomer = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == User.Identity.Name).p_Customer.FirstOrDefault().inv_Restriction.Select(c => c.RestrictionId);
                List<int?> childs = db.GetSubCategoryByParent(categoryId).ToList();
                childs.Add(categoryId);

                items = db.inv_Barcode.Where(dynStr, ol.ToArray()).OrderBy("it." + sortBy).Where(b => (b.inv_Restriction.Count < 1 || b.inv_Restriction.Any(r => currCustomer.Contains(r.RestrictionId))));
            }
            else
            {
                //List<int?> childs = db.GetSubCategoryByParent(categoryId).ToList();
                //childs.Add(categoryId);
                items = db.inv_Barcode.Where(dynStr, ol.ToArray()).OrderBy("it." + sortBy).Where(b => b.inv_Restriction.Count < 1);
            }
            int count = items.Count();
            ViewBag.Pager = Pager.Items(count).PerPage(itemPerPage).Move(1).Segment(10).Center();
            if (page != null)
            {
                ViewBag.Pager = Pager.Items(count).PerPage(itemPerPage).Move(page.Value).Segment(10).Center();
                int skip = (page.Value - 1) * itemPerPage;
                return View(new CategoryItemsModel { Categories = categories, Items = items.Skip(skip).Take(itemPerPage).ToList(), HasWholeRole = hasWholeRole, hasFriendRole = hasFriendRole });
            }
            return View(new CategoryItemsModel { Categories = categories, Items = items.Take(itemPerPage).ToList(), HasWholeRole = hasWholeRole, hasFriendRole = hasFriendRole });
        }

        public ActionResult GetCategoryItems(int? categoryId, int? page, string txtSearch, bool? isNew, bool? isSale, bool? isOffer, bool? isBestSelling, int? perPage, string sortBy)
        {
            int itemPerPage = 16;
            if (perPage != null)
                itemPerPage = perPage.Value;
            if (string.IsNullOrEmpty(sortBy))
                sortBy = "EnteryDate DESC";
            bool? hasWholeRole = null;
            bool? hasFriendRole = null;
            string s = "ss";
            IQueryable<inv_Barcode> items = null;
            var categories = db.inv_Category.ToList();
            List<ObjectParameter> ol = new List<ObjectParameter>();
            string dynStr = string.Empty;
            dynStr += "(it.aspnet_Applications.ApplicationName = @appname or it.aspnet_Applications.ApplicationId Is NULL )  And it.ShowOnline = @showOnline ";
            ol.Add(new ObjectParameter("appname", appName));
            ol.Add(new ObjectParameter("showOnline", true));
            if (!string.IsNullOrEmpty(txtSearch))
            {
                if (dynStr.Length > 0)
                    dynStr += " AND ";
                dynStr += "( (it.Name ) LIKE '%' + @name + '%' OR (it.ItemCode ) LIKE '%' + @name + '%')";
                ol.Add(new ObjectParameter("name", txtSearch));

            }
            if (categoryId != null)
            {
                if (dynStr.Length > 0)
                    dynStr += " And ";
                dynStr += dynStr += "EXISTS(select o From it.inv_Category as o where(o.CategoryId  in " + utility.getHierarchyDataForGeneralCategory(categoryId) + "))";// ; "it.CategoryID in " + utility.getHierarchyDataForGeneralCategory(categoryId);
            }
            if (isNew != null)
            {
                if (dynStr.Length > 0)
                    dynStr += " AND ";
                dynStr += " it.IsNew = @isNew";
                ol.Add(new ObjectParameter("isNew", isNew));
            }
            if (isSale != null)
            {
                if (dynStr.Length > 0)
                    dynStr += " AND ";
                dynStr += " it.IsSale = @isSale";
                ol.Add(new ObjectParameter("isSale", isSale));
            }
            if (isOffer != null)
            {
                if (dynStr.Length > 0)
                    dynStr += " AND ";
                dynStr += " it.IsOffer = @isOffer";
                ol.Add(new ObjectParameter("isOffer", isOffer));
            }

            if (User.Identity.IsAuthenticated && !utility.isInRole(new MapiOnline.Models.MapiDBEntities(), User.Identity.Name, appName, "Online"))
            {
                string username = User.Identity.Name;
                List<string> roles = utility.GetUserRoles(db, username, appName);
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

                var currCustomer = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == User.Identity.Name).p_Customer.FirstOrDefault().inv_Restriction.Select(c => c.RestrictionId);
                List<int?> childs = db.GetSubCategoryByParent(categoryId).ToList();
                childs.Add(categoryId);

                items = db.inv_Barcode.Where(dynStr, ol.ToArray()).OrderBy("it." + sortBy).Where(b => (b.inv_Restriction.Count < 1 || b.inv_Restriction.Any(r => currCustomer.Contains(r.RestrictionId))));
            }
            else
            {
                List<int?> childs = db.GetSubCategoryByParent(categoryId).ToList();
                childs.Add(categoryId);
                items = db.inv_Barcode.Where(dynStr, ol.ToArray()).OrderBy("it." + sortBy).Where(b => b.inv_Restriction.Count < 1);
            }
            int count = items.Count();
            ViewBag.Pager = Pager.Items(count).PerPage(itemPerPage).Move(1).Segment(10).Center();
            if (page != null)
            {
                ViewBag.Pager = Pager.Items(count).PerPage(itemPerPage).Move(page.Value).Segment(10).Center();
                int skip = (page.Value - 1) * itemPerPage;
                return View(new CategoryItemsModel { Categories = categories, Items = items.Skip(skip).Take(itemPerPage).ToList(), HasWholeRole = hasWholeRole, hasFriendRole = hasFriendRole });
            }
            return View(new CategoryItemsModel { Categories = categories, Items = items.Take(itemPerPage).ToList(), HasWholeRole = hasWholeRole, hasFriendRole = hasFriendRole });
        }

        public ActionResult GetCategoryParents(int? categoryId)
        {
            bool? hasWholeRole = null;
            bool? hasFriendRole = null;
            if (User.Identity.IsAuthenticated)
            {
                string username = User.Identity.Name;
                List<string> roles = utility.GetUserRoles(db, username, appName);
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
            var categories = db.GetParentCategoryById(categoryId, null).ToList();
            return View(categories);
        }

        public ActionResult GetOnlineSliderShow()
        {
            try
            {
                if (appName == "/")
                    appName = "";
                var results = XDocument.Load(Server.MapPath("~/Data/Slider.xml")).Elements("root").Elements("Slider").OrderBy(o => o.Attribute("Priority").Value).
                      Select(d => new SliderShow
                      {
                          title = d.Attribute("Title") != null ? d.Attribute("Title").Value.ToString() : "",
                          priority = d.Attribute("Priority") != null ? Convert.ToInt32(d.Attribute("Priority").Value) : 0,
                          linkTo = d.Attribute("LinkTo") != null ? d.Attribute("LinkTo").Value.ToString() : "",
                          description = d.Attribute("Description") != null ? d.Attribute("Description").Value.ToString() : "",
                          sliderInfo = d.Attribute("SliderInfo") != null ? d.Attribute("SliderInfo").Value.ToString() : "",
                          id = Convert.ToInt32(d.Attribute("Id").Value.ToString()),
                          file = d.Attribute("File").Value.ToString(),
                          appName = appName,
                      });

                return PartialView(results);
            }
            catch (Exception ex) { return Json(new { hasPhoto = false, msg = ex.Message }); }
            finally { Dispose(); }
        }

        //public ActionResult GetTopProducts()
        //{
        //    var products = db.inv_Barcode.Where(b=> b.ShowOnline == true).OrderByDescending(p => p.EnteryDate)..ToList();
        //    return PartialView(products);
        //}
        public ActionResult ProductDetails(int? productId, string tabName)
        {
            bool? hasWholeRole = null;
            bool? hasFriendRole = null;

            var b = new inv_Barcode();
            IEnumerable<inv_Barcode> items = null;
            if (User.Identity.IsAuthenticated)
            {
                string username = User.Identity.Name;
                List<string> roles = utility.GetUserRoles(db, username, appName);
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
                var currCustomer = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == User.Identity.Name).p_Customer.FirstOrDefault().inv_Restriction.Select(c => c.RestrictionId);

                b = db.inv_Barcode.Single(c => (c.inv_Restriction.Count < 1 || c.inv_Restriction.Any(r => currCustomer.Contains(r.RestrictionId))) && c.BarcodeId == productId && c.ShowOnline == true);
                items = b.inv_MatchingBarcode.Where(m => (m.inv_Barcode1.inv_Restriction.Count < 1 || m.inv_Barcode1.inv_Restriction.Any(r => currCustomer.Contains(r.RestrictionId))) && (m.inv_Barcode.ShowOnline == true)).Select(m => m.inv_Barcode1);
            }
            else
            {
                b = db.inv_Barcode.Single(c => (c.inv_Restriction.Count < 1) && c.BarcodeId == productId && c.ShowOnline == true);

                items = b.inv_MatchingBarcode.Where(m => (m.inv_Barcode1.inv_Restriction.Count < 1) && m.inv_Barcode1.ShowOnline == true).Select(m => m.inv_Barcode1);
            }
            int? currPersonId = null;
            if (User.Identity.IsAuthenticated)
            {
                currPersonId = db.p_Customer.FirstOrDefault(c => c.aspnet_Membership.Email == User.Identity.Name).AccountId;
            }

            //if (tabName == "general")
            //{
            return View(
            new ProductDetailsModel()
            {
                HasWholeRole = hasWholeRole,
                hasFriendRole = hasFriendRole,
                Items = items.ToList(),
                Photos = getPhotos(b.Barcode),
                barcodeid = b.BarcodeId,
                name = b.Name,
                categoryId = b.inv_Category.Count > 0 ? b.inv_Category.FirstOrDefault().CategoryId : 0,
                code = b.ItemCode,
                barcode = b.Barcode,
                status = b.inv_Availablity.Status,
                AppName = b.aspnet_Applications.ApplicationName,
                oldprice = hasWholeRole == true ? (b.inv_Price.OrderByDescending(p => p.Date).Skip(1).Take(1).FirstOrDefault() != null ? (decimal?)b.inv_Price.OrderByDescending(p => p.Date).Skip(1).Take(1).FirstOrDefault().Wholesale : null) : (b.inv_Price.OrderByDescending(p => p.Date).Skip(1).Take(1).FirstOrDefault() != null ? (decimal?)b.inv_Price.OrderByDescending(p => p.Date).Skip(1).Take(1).FirstOrDefault().Online : null),
                price = hasWholeRole == true ? (b.inv_Price.OrderByDescending(p => p.Date).FirstOrDefault().Wholesale > 0 ? b.inv_Price.OrderByDescending(p => p.Date).FirstOrDefault().Wholesale : b.inv_Price.OrderByDescending(p => p.Date).FirstOrDefault().Online) : (b.inv_Price.OrderByDescending(p => p.Date).FirstOrDefault().Online),
                definition = b.Definition,
                colorDetails = b.inv_ItemDetail.Where(d => d.inv_Color.Count > 0)
                .Select(c => new { price = c.DetailPrice, colorId = c.inv_Color.FirstOrDefault().ColorId, color = c.inv_Color.FirstOrDefault().Color }).Distinct()
                .Select(a => new colorsizeModel()
                {
                    id = a.colorId,
                    name = a.color,
                    pricedetails = a.price
                }).ToList(),
                colorDetailsAvailable = b.inv_ItemDetail.Where(d => d.inv_Color.Count > 0 && d.inv_ItemLocation.Sum(s => s.Quantity) > 0)
                .Select(c => new { price = c.DetailPrice, colorId = c.inv_Color.FirstOrDefault().ColorId, color = c.inv_Color.FirstOrDefault().Color }).Distinct()
                .Select(a => new colorsizeModel()
                {
                    id = a.colorId,
                    name = a.color,
                    pricedetails = a.price
                }).ToList(),

                sizeDetails = b.inv_ItemDetail.Where(d => d.inv_Size.Count > 0)
                .Select(s => new { price = s.DetailPrice, parentTitle = s.inv_Size.FirstOrDefault().inv_Size2.Size, sizeId = s.inv_Size.FirstOrDefault().SizeId, size = s.inv_Size.FirstOrDefault().Size }).Distinct()
                .Select(a => new colorsizeModel()
                {
                    id = a.sizeId,
                    name = a.size,
                    parentTitle = a.parentTitle,
                    pricedetails = a.price
                }).ToList(),
                sizeDetailsAvailable = b.inv_ItemDetail.Where(d => d.inv_Size.Count > 0 && d.inv_ItemLocation.Sum(s => s.Quantity) > 0)
                .Select(s => new { price = s.DetailPrice, parentTitle = s.inv_Size.FirstOrDefault().inv_Size2.Size, sizeId = s.inv_Size.FirstOrDefault().SizeId, size = s.inv_Size.FirstOrDefault().Size }).Distinct()
                .Select(a => new colorsizeModel()
                {
                    id = a.sizeId,
                    name = a.size,
                    parentTitle = a.parentTitle,
                    pricedetails = a.price
                }).ToList(),
                unitType = b.inv_MeasureUnit.UnitType,
                Quantity = b.inv_ItemDetail.Sum(q => q.inv_ItemLocation.Sum(qq => qq.Quantity)) <= 20 ? b.inv_ItemDetail.Sum(q => q.inv_ItemLocation.Sum(qq => qq.Quantity)) : 20,
                description = b.Description,
                technical = b.inv_Property.Where(p => p.ShowInProperty != null && p.ShowInProperty.Value).GroupBy(g => new { g.inv_Property2.PropertyId, g.inv_Property2.Property, g.inv_Property2.TranslatedProperty }).Select(s =>
                  new propertyModel()
                  {
                      property = s.Key.Property,
                      translatedProperty = s.Key.TranslatedProperty,
                      properties = s.Select(p => new propertyItems() { value = p.TranslatedProperty, name = p.Property }).ToList()
                  }).ToList(),
                properties = b.inv_Property.Where(p => (p.ShowInMenu == null || p.ShowInMenu == false) && (p.ShowInProperty == null || p.ShowInProperty == false)).Select(s =>
                new propertyItems()
                {
                    name = s.inv_Property2.Property,
                    value = s.Property,
                    id = s.inv_Property2.PropertyId
                }).ToList(),
                comments = b.p_Comment.Where(c => c.IsConfirmed == true || (currPersonId != null && c.CustomerId == currPersonId)).Select(c => new commentsModel()
                {
                    comment = c.Comment,
                    username = c.p_Customer.p_Person.Name + " " + c.p_Customer.p_Person.Family,
                    isConfirmed = c.IsConfirmed
                }).ToList(),
                //measureUnits = b.inv_BarcodeMeasureUnit.Select(m => new { id = m.Quantity, discount = m.DiscountPercentage, name = m.inv_MeasureUnit.UnitType }).ToList()
            });
            //}
            //else if (tabName == "technicalInfo")
            //{
            //    return View(
            //   new ProductDetailsModel()
            //   {

            //       HasWholeRole = hasWholeRole,
            //       hasFriendRole = hasFriendRole,
            //       Items = items.ToList(),
            //       technical = b.invbr_PropertyBarcode.GroupBy(g => new { g.inv_Property.inv_Property2.PropertyId, g.inv_Property.inv_Property2.Property }).Select(s =>
            //           new propertyModel()
            //           {
            //               property = s.Key.Property,
            //               properties = s.Select(p => new propertyItems() { value = p.Value, name = p.inv_Property.Property }).ToList()
            //           }).ToList(),
            //       Photos = getPhotos(b.Barcode),
            //       barcodeid = b.BarcodeId,
            //       name = b.Name,
            //       categoryId = b.inv_Category.FirstOrDefault().CategoryId,
            //       code = b.ItemCode,
            //       barcode = b.Barcode,
            //       status = b.inv_Availablity.Status,
            //       AppName = b.aspnet_Applications.ApplicationName,
            //       oldprice = hasWholeRole == true ? (b.inv_Price.OrderByDescending(p => p.Date).Skip(1).Take(1).FirstOrDefault() != null ? (decimal?)b.inv_Price.OrderByDescending(p => p.Date).Skip(1).Take(1).FirstOrDefault().Wholesale : null) : (b.inv_Price.OrderByDescending(p => p.Date).Skip(1).Take(1).FirstOrDefault() != null ? (decimal?)b.inv_Price.OrderByDescending(p => p.Date).Skip(1).Take(1).FirstOrDefault().Online : null),
            //       price = hasWholeRole == true ? (b.inv_Price.OrderByDescending(p => p.Date).FirstOrDefault().Wholesale > 0 ? b.inv_Price.OrderByDescending(p => p.Date).FirstOrDefault().Wholesale : b.inv_Price.OrderByDescending(p => p.Date).FirstOrDefault().Online) : (b.inv_Price.OrderByDescending(p => p.Date).FirstOrDefault().Online),
            //       colorDetails = b.inv_ItemDetail.Where(d => d.inv_Color.Count > 0)
            //       .Select(c => new { price = c.DetailPrice, colorId = c.inv_Color.FirstOrDefault().ColorId, color = c.inv_Color.FirstOrDefault().Color }).Distinct()
            //       .Select(a => new colorsizeModel()
            //       {
            //           id = a.colorId,
            //           name = a.color,
            //           pricedetails = a.price
            //       }).ToList(),
            //       colorDetailsAvailable = b.inv_ItemDetail.Where(d => d.inv_Color.Count > 0 && d.inv_ItemLocation.Sum(s => s.Quantity) > 0)
            //       .Select(c => new { price = c.DetailPrice, colorId = c.inv_Color.FirstOrDefault().ColorId, color = c.inv_Color.FirstOrDefault().Color }).Distinct()
            //       .Select(a => new colorsizeModel()
            //       {
            //           id = a.colorId,
            //           name = a.color,
            //           pricedetails = a.price
            //       }).ToList(),

            //       sizeDetails = b.inv_ItemDetail.Where(d => d.inv_Size.Count > 0)
            //       .Select(s => new { price = s.DetailPrice, parentTitle = s.inv_Size.FirstOrDefault().inv_Size2.Size, sizeId = s.inv_Size.FirstOrDefault().SizeId, size = s.inv_Size.FirstOrDefault().Size }).Distinct()
            //       .Select(a => new colorsizeModel()
            //       {
            //           id = a.sizeId,
            //           name = a.size,
            //           parentTitle = a.parentTitle,
            //           pricedetails = a.price
            //       }).ToList(),
            //       sizeDetailsAvailable = b.inv_ItemDetail.Where(d => d.inv_Size.Count > 0 && d.inv_ItemLocation.Sum(s => s.Quantity) > 0)
            //       .Select(s => new { price = s.DetailPrice, parentTitle = s.inv_Size.FirstOrDefault().inv_Size2.Size, sizeId = s.inv_Size.FirstOrDefault().SizeId, size = s.inv_Size.FirstOrDefault().Size }).Distinct()
            //       .Select(a => new colorsizeModel()
            //       {
            //           id = a.sizeId,
            //           name = a.size,
            //           parentTitle = a.parentTitle,
            //           pricedetails = a.price
            //       }).ToList(),
            //       unitType = b.inv_MeasureUnit.UnitType,
            //       Quantity = b.inv_ItemDetail.Sum(q => q.inv_ItemLocation.Sum(qq => qq.Quantity)) <= 20 ? b.inv_ItemDetail.Sum(q => q.inv_ItemLocation.Sum(qq => qq.Quantity)) : 20,
            //       //measureUnits = b.inv_BarcodeMeasureUnit.Select(m => new { id = m.Quantity, discount = m.DiscountPercentage, name = m.inv_MeasureUnit.UnitType }).ToList()
            //       description = b.Description
            //   });
            //}
            //else
            //{
            //    int? currPersonId = null;
            //    if (User.Identity.IsAuthenticated)
            //    {
            //        currPersonId = db.p_Customer.FirstOrDefault(c => c.aspnet_Membership.Email == User.Identity.Name).AccountId;
            //    }
            //    return View(
            //   new ProductDetailsModel()
            //   {
            //       HasWholeRole = hasWholeRole,
            //       hasFriendRole = hasFriendRole,
            //       Items = items.ToList(),
            //       comments = b.p_Comment.Where(c => c.IsConfirmed == true || (currPersonId != null && c.CustomerId == currPersonId)).Select(c => new commentsModel()
            //       {
            //           comment = c.Comment,
            //           username = c.p_Customer.p_Person.Name + " " + c.p_Customer.p_Person.Family,
            //           isConfirmed = c.IsConfirmed
            //       }).ToList(),
            //       Photos = getPhotos(b.Barcode),
            //       barcodeid = b.BarcodeId,
            //       name = b.Name,
            //       categoryId = b.inv_Category.FirstOrDefault().CategoryId,
            //       code = b.ItemCode,
            //       barcode = b.Barcode,
            //       status = b.inv_Availablity.Status,
            //       AppName = b.aspnet_Applications.ApplicationName,
            //       oldprice = hasWholeRole == true ? (b.inv_Price.OrderByDescending(p => p.Date).Skip(1).Take(1).FirstOrDefault() != null ? (decimal?)b.inv_Price.OrderByDescending(p => p.Date).Skip(1).Take(1).FirstOrDefault().Wholesale : null) : (b.inv_Price.OrderByDescending(p => p.Date).Skip(1).Take(1).FirstOrDefault() != null ? (decimal?)b.inv_Price.OrderByDescending(p => p.Date).Skip(1).Take(1).FirstOrDefault().Online : null),
            //       price = hasWholeRole == true ? (b.inv_Price.OrderByDescending(p => p.Date).FirstOrDefault().Wholesale > 0 ? b.inv_Price.OrderByDescending(p => p.Date).FirstOrDefault().Wholesale : b.inv_Price.OrderByDescending(p => p.Date).FirstOrDefault().Online) : (b.inv_Price.OrderByDescending(p => p.Date).FirstOrDefault().Online),
            //       colorDetails = b.inv_ItemDetail.Where(d => d.inv_Color.Count > 0).Select(c => new { colorId = c.inv_Color.FirstOrDefault().ColorId, color = c.inv_Color.FirstOrDefault().Color }).Distinct()
            //       .Select(a => new colorsizeModel()
            //       {
            //           id = a.colorId,
            //           name = a.color,
            //       }).ToList(),
            //       colorDetailsAvailable = b.inv_ItemDetail.Where(d => d.inv_Color.Count > 0 && d.inv_ItemLocation.Sum(s => s.Quantity) > 0)
            //       .Select(c => new { price = c.DetailPrice, colorId = c.inv_Color.FirstOrDefault().ColorId, color = c.inv_Color.FirstOrDefault().Color }).Distinct()
            //       .Select(a => new colorsizeModel()
            //       {
            //           id = a.colorId,
            //           name = a.color,
            //           pricedetails = a.price
            //       }).ToList(),

            //       sizeDetails = b.inv_ItemDetail.Where(d => d.inv_Size.Count > 0)
            //       .Select(s => new { price = s.DetailPrice, parentTitle = s.inv_Size.FirstOrDefault().inv_Size2.Size, sizeId = s.inv_Size.FirstOrDefault().SizeId, size = s.inv_Size.FirstOrDefault().Size }).Distinct()
            //       .Select(a => new colorsizeModel()
            //       {
            //           id = a.sizeId,
            //           name = a.size,
            //           parentTitle = a.parentTitle,
            //           pricedetails = a.price
            //       }).ToList(),
            //       sizeDetailsAvailable = b.inv_ItemDetail.Where(d => d.inv_Size.Count > 0 && d.inv_ItemLocation.Sum(s => s.Quantity) > 0)
            //       .Select(s => new { price = s.DetailPrice, parentTitle = s.inv_Size.FirstOrDefault().inv_Size2.Size, sizeId = s.inv_Size.FirstOrDefault().SizeId, size = s.inv_Size.FirstOrDefault().Size }).Distinct()
            //       .Select(a => new colorsizeModel()
            //       {
            //           id = a.sizeId,
            //           name = a.size,
            //           parentTitle = a.parentTitle,
            //           pricedetails = a.price
            //       }).ToList(),
            //       unitType = b.inv_MeasureUnit.UnitType,
            //       Quantity = b.inv_ItemDetail.Sum(q => q.inv_ItemLocation.Sum(qq => qq.Quantity)) <= 20 ? b.inv_ItemDetail.Sum(q => q.inv_ItemLocation.Sum(qq => qq.Quantity)) : 20,
            //       description = b.Description
            //       //measureUnits = b.inv_BarcodeMeasureUnit.Select(m => new { id = m.Quantity, discount = m.DiscountPercentage, name = m.inv_MeasureUnit.UnitType }).ToList()
            //   });
            //}
        }

        public ActionResult GetSizesForColorByBarcode(int? colorId, int barcodeId)
        {
            if (colorId == null)
                return Json(new { size = "null", quantity = "null" });
            return Json(new
            {
                size = db.inv_ItemDetail.Where(b => b.BarcodeId == barcodeId && b.inv_Color.Any(c => c.ColorId == colorId) && b.inv_Size.Count() > 0 && b.inv_ItemLocation.Sum(q => q.Quantity) > 0)
                    .Select(a => new
                    {
                        size = a.inv_Size.Select(s => new { s.SizeId, s.Size, quantity = s.inv_ItemDetail.Sum(d => d.inv_ItemLocation.Sum(l => l.Quantity)) })
                        //quantity = a.inv_ItemLocation.Sum(q => q.Quantity)
                    }),
                quantity = db.inv_ItemDetail.Where(qu => qu.BarcodeId == barcodeId && qu.inv_Color.Any(c => c.ColorId == colorId)
                                                         && qu.inv_Color.Any(c => c.ColorId == colorId)
                                                         && qu.inv_ItemLocation.Sum(q => q.Quantity) > 0)
                                           .Sum(a => (decimal?)a.inv_ItemLocation.Sum(q => q.Quantity))
            });
        }

        public ActionResult GetSelectedColorDiffPrice(int? colorId, int barcodeId)
        {
            decimal? baseprice = db.inv_Barcode.FirstOrDefault(b => b.BarcodeId == barcodeId).inv_Price.FirstOrDefault().Online;
            return Json(new { diff = (db.inv_ItemDetail.FirstOrDefault(i => i.BarcodeId == barcodeId && i.inv_Color.Any(c => c.ColorId == colorId)).DetailPrice) - baseprice });
        }
        public ActionResult GetSizesForColor(int? colorId, int itemdetailId)
        {
            int barcodeId = db.inv_ItemDetail.SingleOrDefault(i => i.AccountId == itemdetailId).BarcodeId;
            if (colorId == null)
                return Json(new { size = "null", quantity = "null" });
            return Json(new
            {
                size = db.inv_ItemDetail.Where(b => b.BarcodeId == barcodeId && b.inv_Color.Any(c => c.ColorId == colorId) && b.inv_Size.Count() > 0 && b.inv_ItemLocation.Sum(q => q.Quantity) > 0)
                    .Select(a => new
                    {
                        size = a.inv_Size.Select(s => new { s.SizeId, s.Size, quantity = s.inv_ItemDetail.Sum(d => d.inv_ItemLocation.Sum(l => l.Quantity)) })
                        //quantity = a.inv_ItemLocation.Sum(q => q.Quantity)
                    }),
                quantity = db.inv_ItemDetail.Where(qu => qu.BarcodeId == barcodeId && qu.inv_Color.Any(c => c.ColorId == colorId)
                                                         && qu.inv_Color.Any(c => c.ColorId == colorId)
                                                         && qu.inv_ItemLocation.Sum(q => q.Quantity) > 0)
                                           .Sum(a => (decimal?)a.inv_ItemLocation.Sum(q => q.Quantity))
            });
        }

        public ActionResult GetQuantityForColorSizeByBarcode(int? sizeId, int? colorId, int barcodeId)
        {
            decimal? baseprice = db.inv_Barcode.FirstOrDefault(b => b.BarcodeId == barcodeId).inv_Price.FirstOrDefault().Regular;
            if (colorId == null && sizeId != null)
            {
                var detail = db.inv_ItemDetail.Where(b => b.BarcodeId == barcodeId && b.inv_Size.Count() > 0
                                           && b.inv_Color.Count == 0
                                           && b.inv_Size.Any(c => c.SizeId == sizeId)
                                           && b.inv_ItemLocation.Sum(q => q.Quantity) > 0);
                return Json(new
                {
                    quantity = detail.Sum(a => (decimal?)a.inv_ItemLocation.Sum(q => q.Quantity)),
                    diff = (detail.Count() > 0 && detail.FirstOrDefault().DetailPrice != null) ? (detail.FirstOrDefault().DetailPrice - baseprice) : 0
                });
            }
            else if (sizeId == null && colorId != null)
            {
                var detail = db.inv_ItemDetail.Where(b => b.BarcodeId == barcodeId && b.inv_Color.Any(c => c.ColorId == colorId)
                                          && b.inv_Size.Count == 0
                                          && b.inv_ItemLocation.Sum(q => q.Quantity) > 0);
                return Json(new
                {
                    quantity = detail.Sum(a => (decimal?)a.inv_ItemLocation.Sum(q => q.Quantity)),
                    diff = (detail.Count() > 0 && detail.FirstOrDefault().DetailPrice != null) ? (detail.FirstOrDefault().DetailPrice - baseprice) : 0
                });
            }
            else if (sizeId != null && colorId != null)
            {
                var detail = db.inv_ItemDetail.Where(b => b.BarcodeId == barcodeId && b.inv_Color.Any(c => c.ColorId == colorId) && b.inv_Size.Count() > 0
                                           && b.inv_Size.Any(c => c.SizeId == sizeId)
                                           && b.inv_ItemLocation.Sum(q => q.Quantity) > 0);
                return Json(new
                {
                    quantity = detail.Sum(a => (decimal?)a.inv_ItemLocation.Sum(q => q.Quantity)),
                    diff = (detail.Count() > 0 && detail.FirstOrDefault().DetailPrice != null) ? (detail.FirstOrDefault().DetailPrice - baseprice) : 0
                });
            }
            else
                return Json(new
                {
                    quantity = "null"
                });
        }

        public ActionResult GetQuantityForColorSize(int? sizeId, int? colorId, int itemdetailId)
        {
            int barcodeId = db.inv_ItemDetail.SingleOrDefault(i => i.AccountId == itemdetailId).BarcodeId;
            if (colorId == null && sizeId != null)
                return Json(new
                {
                    quantity = db.inv_ItemDetail.Where(b => b.BarcodeId == barcodeId && b.inv_Size.Count() > 0
                                           && b.inv_Color.Count == 0
                                           && b.inv_Size.Any(c => c.SizeId == sizeId)
                                           && b.inv_ItemLocation.Sum(q => q.Quantity) > 0)
                               .Sum(a => (decimal?)a.inv_ItemLocation.Sum(q => q.Quantity))
                });
            else if (sizeId == null && colorId != null)
                return Json(new
                {
                    quantity = db.inv_ItemDetail.Where(b => b.BarcodeId == barcodeId && b.inv_Color.Any(c => c.ColorId == colorId)
                                          && b.inv_Size.Count == 0
                                          && b.inv_ItemLocation.Sum(q => q.Quantity) > 0)
                              .Sum(a => (decimal?)a.inv_ItemLocation.Sum(q => q.Quantity))
                });
            else if (sizeId != null && colorId != null)
                return Json(new
                {
                    quantity = db.inv_ItemDetail.Where(b => b.BarcodeId == barcodeId && b.inv_Color.Any(c => c.ColorId == colorId) && b.inv_Size.Count() > 0
                                           && b.inv_Size.Any(c => c.SizeId == sizeId)
                                           && b.inv_ItemLocation.Sum(q => q.Quantity) > 0)
                               .Sum(a => (decimal?)a.inv_ItemLocation.Sum(q => q.Quantity))
                });
            else
                return Json(new
                {
                    quantity = "null"
                });
        }

        public PhotosInfoModel getPhotos(string barcode)
        {
            try
            {
                string s = Server.MapPath("../../Data/" + appName + "Photos/") + barcode;
                string[] ps = System.IO.Directory.GetFiles(s);

                List<string> lphotos = new List<string>();
                //string images = db.inv_Barcode.SingleOrDefault(b => b.Barcode == barcode).Images;
                //string[] photos = images.Split(',');
                foreach (var item in ps)
                {
                    int n;
                    bool isNumeric = int.TryParse(Path.GetFileName(item).Replace(".jpg", ""), out n);
                    if (isNumeric)
                        lphotos.Add(n.ToString());
                }
                return new PhotosInfoModel() { lphotos = lphotos, appName = appName, hasPhoto = true };
            }
            catch (Exception ex) { return new PhotosInfoModel() { hasPhoto = false }; }
            finally { Dispose(); }
        }

        public ActionResult getProperty(int barcodeid)
        {
            try
            {
                MapiDBEntities db = new MapiDBEntities();
                return Json(db.inv_Barcode.SingleOrDefault(b => b.BarcodeId == barcodeid).inv_Property.GroupBy(g => new { g.inv_Property2.PropertyId, g.inv_Property2.Property }).Select(s => new { s.Key.Property, s.Key.PropertyId, properties = s.Select(p => new { Value = p.Property, p.inv_Property2.Property, p.PropertyId }) }));
            }
            catch (Exception ex)
            {
                return Json(new { isDone = false, msg = ex.Message });
            }

        }

        public ActionResult CustomizedBouquet(string bouquetType)
        {
            bool? hasWholeRole = null;
            bool? hasFriendRole = null;
            if (User.Identity.IsAuthenticated)
            {
                string username = User.Identity.Name;
                List<string> roles = utility.GetUserRoles(db, username, appName);
                foreach (var rl in roles)
                {
                    if (rl == "isWholesaleBuyer")
                        hasWholeRole = true;
                    if (rl == "isFriend")
                        hasFriendRole = true;
                }
                //if (hasWholeRole == true)
                //{
                //    var flowersWholeSale = db.inv_ItemDetail.Where(i => i.inv_Barcode.ShowOnline == true && i.inv_Barcode.inv_Category.Any(c => c.Category == "شاخه گل") &&
                //    (i.inv_Size.Any(s => s.inv_Size2.Size == "کیفیت" && s.Size.Contains("درجه 2")) || i.inv_Size.Count == 0));
                //    if (bouquetType == "customized")
                //    {
                //        var items = db.inv_Barcode.Where(b => b.ShowOnline == true && b.inv_Property.Any(p => p.Property == "customized"));
                //        return View(new CustomizedBouquetModel { Flowers = flowersWholeSale.ToList(), Items = items.ToList(), Category = "دسته گل و سبد سفارشی" });
                //    }
                //    else
                //    {
                //        var items = db.inv_Barcode.Where(b => b.ShowOnline == true && b.inv_Property.Any(p => p.Property == "bride"));
                //        return View(new CustomizedBouquetModel { Flowers = flowersWholeSale.ToList(), Items = items.ToList(), Category = "دسته گل عروس" });
                //    }
                //}
            }
            var flowers = db.inv_ItemDetail.Where(i => i.inv_Barcode.inv_Category.Any(c => c.Category == "شاخه گل"));
            //var flowers = db.inv_ItemDetail.Where(i => i.inv_Barcode.inv_Category.Any(c => c.Category == "شاخه گل")
            //       && (i.inv_Size.Any(s => s.inv_Size2.Size == "کیفیت" && s.Size.Contains("درجه 2")) || i.inv_Size.Count == 0));
            if (bouquetType == "customized")
            {
                var items = db.inv_Barcode.Where(b => b.ShowOnline == true && b.inv_Property.Any(p => p.Property == "customized"));
                return View(new CustomizedBouquetModel { Flowers = flowers.ToList(), Items = items.ToList(), Category = "دسته گل و سبد سفارشی", hasFriendRole = hasFriendRole, HasWholeRole = hasWholeRole });
            }
            else
            {
                var items = db.inv_Barcode.Where(b => b.ShowOnline == true && b.inv_Property.Any(p => p.Property == "bride"));
                return View(new CustomizedBouquetModel { Flowers = flowers.ToList(), Items = items.ToList(), Category = "دسته گل عروس", hasFriendRole = hasFriendRole, HasWholeRole = hasWholeRole });
            }
        }

        //public ActionResult SideMenu(string menuId,TinyMCE model)
        //{

        //    XDocument xmlDoc = XDocument.Load(Server.MapPath("~/Data/Menu.xml"));
        //    model.Content = xmlDoc.Element("root").Elements("Content").Single(t => t.Attribute("Id").Value == menuId).Value;
        //    ViewBag.canEdit = false;
        //    return View(model);
        //}

        public ActionResult SideMenu(int id)
        {
            XDocument xmlDoc = XDocument.Load(Server.MapPath("~/Data/Menu.xml"));
            TinyMCE model = new TinyMCE();
            var content = xmlDoc.Element("root").Descendants("Content").FirstOrDefault(t => t.Attribute("Id").Value == id.ToString()).Element("Value");
            model.Content = content != null ? content.Value : "";
            if (utility.isInRole(db, User.Identity.Name, appName, "canEditOnlineMenu"))
                model.CanEdit = true;
            else
                model.CanEdit = false;
            model.menuId = id;
            return View(model);
        }

        [HttpPost, ActionName("SideMenu")]
        public ActionResult SideMenu(TinyMCE model)
        {
            if (!utility.isInRole(db, User.Identity.Name, appName, "canEditOnlineMenu"))
            {
                return View(model);
            }
            try
            {

                XDocument xmlDoc = XDocument.Load(Server.MapPath("~/Data/Menu.xml"));
                var r = xmlDoc.Element("root").Descendants("Content").FirstOrDefault(t => t.Attribute("Id").Value == model.menuId.ToString()).Element("Value");//.Descendants("content");
                if (r != null)
                {
                    r.ReplaceNodes(new XCData(model.Content));
                }
                else
                    xmlDoc.Element("root").Add(new XElement("Content", new XElement("Value", new XCData(model.Content), new XAttribute("Id", model.menuId))));
                xmlDoc.Save(Server.MapPath("~/Data/Menu.xml"));
                return View(model);
            }
            catch (Exception ex)
            {
                return View(model);
            }

        }
        [HttpGet]
        public ActionResult ContactUs()
        {
            if (User.Identity.IsAuthenticated)
            {
                var currPerson = db.p_Customer.FirstOrDefault(c => c.aspnet_Membership.Email == User.Identity.Name).p_Person;
                ViewData["userEmail"] = User.Identity.Name;
                ViewData["userNameFamily"] = (currPerson.Name != null ? currPerson.Name : "") + " " + currPerson.Family;
            }
            return View();
        }
        [HttpPost]
        public ActionResult getContactUsEmail()
        {
            if (User.Identity.IsAuthenticated)
            {
                var currPerson = db.p_Customer.FirstOrDefault(c => c.aspnet_Membership.Email == User.Identity.Name).p_Person;
                return Json(new { userEmail = User.Identity.Name, userNameFamily = (currPerson.Name != null ? currPerson.Name : "") + " " + currPerson.Family });
            }
            else
                return Json(new { userEmail = "", userNameFamily = "" });
        }
        [HttpPost]
        public ActionResult ContactUs(string name, string email, string subject, string body)
        {
            bool isdone = SendEmailToShop(name, email, subject, body);
            if (isdone)
                return Json(new { isdone, msg = "پیام شما ارسال شد. با تشکر " });
            else
                return Json(new { isdone, msg = "پیام شما ارسال نشد. لطفاً دوباره تلاش کنید " });
        }
        public bool SendEmailToShop(string Name, string Email, string Subject, string Body)
        {
            var appDetails = db.aspnet_Applications.Single(a => a.ApplicationName == appName).ApplicationDetail;
            System.Net.Mail.MailMessage mailObj = new System.Net.Mail.MailMessage(Email, appDetails.Email);
            mailObj.Body = "نام فرستنده :  " + Name + "   \n" + "متن پیام : " + "  \n" + Body;
            mailObj.Subject = Subject;
            SmtpClient SMTPServer = new SmtpClient(appDetails.Host);
            SMTPServer.Credentials = new NetworkCredential(appDetails.Email, appDetails.EmailPass);
            mailObj.BodyEncoding = System.Text.Encoding.UTF8;
            mailObj.SubjectEncoding = System.Text.Encoding.UTF8;
            try
            {
                SMTPServer.Send(mailObj);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public ActionResult TodayDate()
        {
            return Json(new { isdone = true, date = new persianDate(DateTime.Now).CompletePrsDate() });
        }

        public ActionResult GetCurrShamsiDatePlusDay()
        {
            string currShamsi = utility.GetstrDateCultureSimple(DateTime.Now);
            return Json(new { isdone = true, currShamsi });
        }

        public ActionResult SaveComment(string comment, int barcodeId)
        {
            if (User.Identity.IsAuthenticated)
            {
                string uname = User.Identity.Name;
                p_Comment cmnt = new p_Comment();
                cmnt.Comment = comment;
                cmnt.CustomerId = db.p_Customer.SingleOrDefault(c => c.aspnet_Membership.Email == uname).AccountId;
                cmnt.BarcodeId = barcodeId;
                cmnt.IsConfirmed = false;
                cmnt.Date = DateTime.Now;
                db.p_Comment.AddObject(cmnt);
                db.SaveChanges();
                return Json(new { isdone = true, username = cmnt.p_Customer.p_Person.Name + " " + cmnt.p_Customer.p_Person.Family });
            }
            else
                return Json(new { isdone = false });
        }

        [HttpPost]
        public ActionResult LogOn(LogOnModel logon, string returnUrl, int? categoryId)
        {
            try
            {
                MapiDBEntities db = new MapiDBEntities();
                bool authenticate = false;
                if (User.Identity.IsAuthenticated)
                {

                    if (Session["shoppingCartId"] != null)
                    {
                        int shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                        string currUsername = User.Identity.Name;
                        var currCustomer = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == currUsername).p_Customer.FirstOrDefault();
                        var oldshoppingcart = db.ac_ShoppingCart.SingleOrDefault(s => s.CustomerId == currCustomer.AccountId);
                        if (oldshoppingcart != null)
                        {
                            db.ac_ShoppingCart.DeleteObject(oldshoppingcart);
                        }
                        var shoppingcart = db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId);
                        shoppingcart.CustomerId = currCustomer.AccountId;
                        if (db.SaveChanges() > 0)
                            Session["shoppingCartId"] = null;
                    }

                }
                else if (string.IsNullOrEmpty(logon.UserName) && string.IsNullOrEmpty(logon.Password))
                {
                    ViewBag.result = "";
                    return Json(new { isdone = false, msg = "شما وارد سایت نشده اید، لطفاً دوباره تلاش کنید." });
                }
                else


                    authenticate = Membership.ValidateUser(logon.UserName, logon.Password);
                if (authenticate)
                {
                    FormsAuthentication.Authenticate(logon.UserName, logon.Password);
                    FormsAuthentication.SetAuthCookie(logon.UserName, false);
                    if (utility.CheckForInternetConnection())
                    {
                        string userName = logon.UserName;
                        var appDetails = db.aspnet_Applications.Single(aa => aa.ApplicationName == appName).ApplicationDetail;

                        System.Threading.Thread l = new System.Threading.Thread(utility.GetCountryByIPForManagement);
                        object[] lParameters = new object[] { utility.GetUserIP(), Server.MapPath("~/Data/mLogs.xml"), Request.Browser.Type, userName, appName };
                        l.Start(lParameters);

                        System.Threading.Thread t = new System.Threading.Thread(utility.sendEmail);
                        object[] parameters = new object[] { 
                        "kv_fr@yahoo.com",
                        userName + " rose " + DateTime.Now + " App: " + appName + " IP:" + utility.GetUserIP() + " Browser: " +  Request.Browser.Type,
                        userName + " rose " + DateTime.Now + " App: " + appName + " IP:" + utility.GetUserIP() + " Browser: " + Request.Browser.Type,
                        appDetails.Email,
                        appDetails.EmailPass,
                        appDetails.Port,
                        appDetails.Host
                    };
                        t.Start(parameters);
                    }

                    var a = db.p_Person.Where(p => p.p_Customer.aspnet_Membership.Email == logon.UserName && p.ac_Account.aspnet_Applications.ApplicationName == appName).Select(s => new { code = s.Code, name = s.Name, family = s.Family, logged = true }).FirstOrDefault();

                    DateTime d = DateTime.Now.AddDays(-1);
                    var oldShoppingCarts = db.ac_ShoppingCart.Where(c => c.CustomerId == null && c.Date < d);
                    foreach (var sc in oldShoppingCarts)
                    {
                        db.ac_ShoppingCart.DeleteObject(sc);
                    }
                    db.SaveChanges();
                    if (Session["shoppingCartId"] != null)
                    {
                        int shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                        if (authenticate)
                        {
                            string currUsername = logon.UserName;
                            var currCustomer = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == currUsername).p_Customer.FirstOrDefault();
                            var oldshoppingcart = db.ac_ShoppingCart.SingleOrDefault(s => s.CustomerId == currCustomer.AccountId);
                            if (oldshoppingcart != null)
                            {
                                foreach (var item in oldshoppingcart.ac_ShoppingCartDetails.ToList())
                                {
                                    //if (item.ac_ShoppingCartDetails1.Count > 0)
                                    //    foreach (var items in item.ac_ShoppingCartDetails1.ToList())
                                    //    {
                                    //        db.ac_ShoppingCartDetails.DeleteObject(items);
                                    //    }
                                    db.ac_ShoppingCartDetails.DeleteObject(item);
                                }
                                db.ac_ShoppingCart.DeleteObject(oldshoppingcart);
                            }
                            var shoppingcart = db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId);
                            shoppingcart.CustomerId = currCustomer.AccountId;
                            if (db.SaveChanges() > 0)
                                Session["orderHeaderId"] = null;
                        }
                    }
                    if (authenticate)
                        return Json(new { isdone = true });
                    else
                    {
                        ViewBag.result = "شما وارد سایت نشده اید، لطفاً دوباره تلاش کنید.";
                        return Json(new { isdone = false, msg = "شما وارد سایت نشده اید، لطفاً دوباره تلاش کنید." });
                    }
                }
                else
                {
                    ViewBag.result = "ایمیل یا رمز عبور اشتباه است.";
                    return Json(new { isdone = false, msg = "ایمیل یا رمز عبور اشتباه است." });

                }
            }


            catch (Exception ex)
            {
                ViewBag.result = ex.Message;
                return Json(new { isdone = false, msg = "شما وارد سایت نشده اید، لطفاً دوباره تلاش کنید." });

            }
        }

        public ActionResult LogOff(int? categoryId)
        {
            FormsAuthentication.SignOut();
            Session["orderHeaderId"] = null;
            Session["shoppingCartId"] = null;
            return Redirect("../Home/Index?categoryId=" + categoryId);
        }

        public void ExportToExcel()
        {
            DataTable dt = GetUserOrders();
            //Get the data from database into datatable

            //Create a dummy GridView
            GridView GridView1 = new GridView();
            GridView1.AllowPaging = false;
            GridView1.DataSource = dt;
            GridView1.DataBind();
            //Change the Header Row back to white color
            GridView1.HeaderRow.Style.Add("background-color", "#FFFFFF");
            GridView1.HeaderRow.Style.Add("color", "#FFFFFF");
            GridView1.HeaderRow.Style.Add("font-family", "tahoma");
            GridView1.HeaderRow.Style.Add("font-size", "10");
            GridView1.HeaderRow.Style.Add("text-align", "center");
            GridView1.HeaderRow.Style.Add("height", "50px");

            //Applying stlye to gridview header cells
            for (int i = 0; i < GridView1.HeaderRow.Cells.Count; i++)
            {
                GridView1.HeaderRow.Cells[i].Style.Add("background-color", "#507CD1");
            }
            int j = 1;
            //This loop is used to apply stlye to cells based on particular row
            foreach (GridViewRow gvrow in GridView1.Rows)
            {
                gvrow.Style.Add("text-align", "right");
                gvrow.Style.Add("font-family", "tahoma");
                gvrow.Style.Add("font-size", "12");
                gvrow.Style.Add("direction", "rtl");
                gvrow.BackColor = System.Drawing.Color.White;
                if (j <= GridView1.Rows.Count)
                {
                    if (j % 2 != 0)
                    {
                        for (int k = 0; k < gvrow.Cells.Count; k++)
                        {
                            gvrow.Cells[k].Style.Add("background-color", "#EFF3FB");
                        }
                    }
                }
                j++;
            }
            Response.Clear();
            Response.Buffer = true;
            Response.AddHeader("content-disposition",
             "attachment;filename=shirazroseOrders.xls");
            Response.Charset = "";
            Response.ContentType = "application/vnd.ms-excel";
            StringWriter sw = new StringWriter();
            HtmlTextWriter hw = new HtmlTextWriter(sw);

            for (int i = 0; i < GridView1.Rows.Count; i++)
            {
                //Apply text style to each Row
                GridView1.Rows[i].Attributes.Add("class", "textmode");
            }
            GridView1.RenderControl(hw);

            //style to format numbers to string
            string style = @"<style> .textmode { mso-number-format:\@; } </style>";
            Response.Write(style);
            Response.Output.Write(sw.ToString());
            Response.Flush();
            Response.End();
        }

        public DataTable GetUserOrders()
        {
            try
            {
                var ordh1 = db.ac_OrderHeader.Where(oh => oh.ac_ReceiverDetails != null && oh.ConfirmerId == null).OrderByDescending(oh => oh.OrderHeaderId);
                int s = ordh1.Count();
                var ordh = db.ac_OrderHeader.Where(oh => oh.ac_ReceiverDetails != null && oh.ConfirmerId == null).OrderByDescending(oh => oh.OrderHeaderId).Select(oh => new
                {
                    oh.Amount,
                    oh.ac_ReceiverDetails.DiscountAmount,
                    oh.InvoiceNO,
                    oh.ConfirmerId,
                    oh.ac_ReceiverDetails.IsGift,
                    oh.OrderHeaderId,
                    oh.Date,
                    oh.ac_ReceiverDetails.Name,
                    oh.ac_ReceiverDetails.Family,
                    oh.ac_ReceiverDetails.Phone,
                    oh.ac_ReceiverDetails.CellPhone,
                    oh.ac_ReceiverDetails.Address,
                    oh.ac_ReceiverDetails.PostalCode,
                    sname = oh.p_Person.Name,
                    sfamily = oh.p_Person.Family,
                    sphone = oh.p_Person.p_Phone.FirstOrDefault(p => p.Cell == false),
                    smobile = oh.p_Person.p_Phone.FirstOrDefault(p => p.Cell == true),
                    oh.ac_ReceiverDetails.SendDate,
                    oh.ac_ReceiverDetails.SendTime,
                    oh.Description,
                    oh.ac_AccountDetail,
                    oh.ac_ReceiverDetails.PaymentType,
                    oh.ac_ReceiverDetails.SaleReferenceId,
                    oh.ac_ReceiverDetails.GiftNote,
                    oh.ac_ReceiverDetails.NeedWrap,
                    OrderDetail = oh.ac_AccountDetail.AsEnumerable().Select(od => new
                    {
                        desc = !string.IsNullOrEmpty(od.Description) ? od.Description : "",
                        od.ac_OrderDetail.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Barcode.Name,
                        od.ac_OrderDetail.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Barcode.ItemCode,
                        Quantity = (decimal?)od.ac_OrderDetail.Quantity,
                        Amount = (decimal?)od.Amount,
                        Size = od.ac_OrderDetail.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Size.FirstOrDefault() != null ? od.ac_OrderDetail.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Size.FirstOrDefault().Size : ""
                    })
                }).AsEnumerable().Select(oh => new
                {
                    sender = oh.sname + " " + oh.sfamily + " تلفن: " + (oh.sphone != null ? oh.sphone.Number : "") + " موبایل: " + (oh.smobile != null ? oh.smobile.Number : ""),
                    receiver = oh.Name + " " + oh.Family + " آدرس: " + oh.Address + (oh.PostalCode != null ? (!string.IsNullOrEmpty(oh.PostalCode.Trim()) ? (" کد پستی " + oh.PostalCode.Trim()) : "") : "") + " تلفن: " + oh.Phone + " موبایل: " + oh.CellPhone,
                    sendDate = (oh.SendDate != null ? utility.GetstrDateCultureSimple(oh.SendDate.Value) : "") + " " + oh.SendTime,
                    oh.Description,
                    Amount = (decimal?)oh.Amount,
                    Discount = (oh.DiscountAmount != null ? oh.DiscountAmount : 0),
                    oh.InvoiceNO,
                    IsDelivered = oh.ConfirmerId != null ? "ارسال شده" : "ارسال نشده",
                    IsGift = oh.IsGift == true ? ("هدیه است. متن روی کارت: " + oh.GiftNote) : "هدیه نیست.",
                    oh.OrderHeaderId,
                    date = utility.GetstrDateCulture(oh.Date),
                    oh.PaymentType,
                    oh.OrderDetail,
                    oh.SaleReferenceId,
                    NeedWrap = oh.NeedWrap == true ? "کادو شود." : ""
                });
                DataTable dt = new DataTable();
                dt.Columns.Add("ردیف");
                dt.Columns.Add("مبلغ");
                dt.Columns.Add("تخفیف");
                dt.Columns.Add("شماره فاکتور");
                dt.Columns.Add("وضعیت ارسال");
                dt.Columns.Add("نوع ارسال");
                dt.Columns.Add("تاریخ ثبت");
                dt.Columns.Add("دریافت کننده");
                dt.Columns.Add("ارسال کننده");
                dt.Columns.Add("تاریخ ارسال");
                dt.Columns.Add("روش پرداخت");
                dt.Columns.Add("شماره پرداخت اینترنتی");
                dt.Columns.Add("توضیحات");
                dt.Columns.Add("کالاهای فاکتور");
                int rowno = 1;
                foreach (var oh in ordh)
                {
                    string ordDetails = "";
                    int count = 1;
                    foreach (var od in oh.OrderDetail)
                    {
                        string code = (!string.IsNullOrEmpty(od.ItemCode) ? (" کد" + od.ItemCode) : "");
                        ordDetails = ordDetails + " (((" + count + "." + od.desc + " " + od.Name + " " + od.Size + "، تعداد" + od.Quantity + "عدد، " + code + "، قیمت واحد" + od.Amount + "تومان))) ";
                        count++;
                    }
                    string payType = "";
                    switch (oh.PaymentType)
                    {
                        case 1:
                            payType = "پرداخت آنلاین";
                            break;
                        case 2:
                            payType = "پرداخت به شماره کارت اعتباری";
                            break;
                        case 3:
                            payType = "پرداخت به پیک همزمان با تحویل کالا";
                            break;
                    }
                    dt.Rows.Add(rowno,
                            oh.Amount,
                            oh.Discount,
                            oh.InvoiceNO,
                            oh.IsDelivered,
                            oh.IsGift + oh.NeedWrap,
                            oh.date,
                            oh.receiver,
                            oh.sender,
                            oh.sendDate,
                            payType,
                            oh.SaleReferenceId,
                            oh.Description,
                            ordDetails
                            );
                    rowno++;
                }
                return dt;
            }
            catch (Exception ex) { throw; }
        }


        public ActionResult ShoppingCart()
        {

            //hazine peik
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
                        shoppingCartDetails = sd,
                        colorDetailsAvailable = sd.inv_ItemDetail.inv_Barcode.inv_ItemDetail.Where(d => d.inv_Color.Count > 0 && d.inv_ItemLocation.Sum(s => s.Quantity) > 0).Select(c => new { detailPrice = c.DetailPrice, colorId = c.inv_Color.FirstOrDefault().ColorId, color = c.inv_Color.FirstOrDefault().Color }).Distinct()
                    .Select(a => new colorsizeModel()
                    {
                        pricedetails = a.detailPrice,
                        id = a.colorId,
                        name = a.color,
                    }).ToList(),
                        selectedColorId = sd.inv_ItemDetail.inv_Color.Count() > 0 ? (int?)sd.inv_ItemDetail.inv_Color.FirstOrDefault().ColorId : null,
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
                        Quantity = sd.inv_ItemDetail.inv_ItemLocation.Sum(q => (decimal?)q.Quantity) <= 20 ? sd.inv_ItemDetail.inv_ItemLocation.Sum(q => (decimal?)q.Quantity) : 20,
                        selectedQuantity = sd.Quantity,
                        isLogon = islogon,
                        deliveryExpense = deliveryExpense
                    }));
            }
            else
                return Json(new { isdone = false, msg = "سبد خرید خالی است." });
        }

        [Authorize]
        public ActionResult Profile()
        {
            if (User.Identity.IsAuthenticated)
            {
                string currentEmail = User.Identity.Name;
                var customer = db.p_Customer.SingleOrDefault(c => c.Email == currentEmail);
                if (customer != null)
                {
                    var customerCells = db.p_Person.Single(p => p.Code == customer.p_Person.Code).p_Phone.Where(p => p.Cell == true).Select(p => p.Number);
                    foreach (var item in customerCells)
                    {
                        RegisterModel model = new RegisterModel();
                        model.code = customer.p_Person.Code;
                        if (customer.p_Person.AddressId != null)
                            model.AddressStr = utility.getStrAddress(db.GetParentAddressById(customer.p_Person.AddressId.Value, "")) + "-> " + customer.Address;
                        if (customer.p_Person.DateOfBirth != null)
                        {
                            DateTime birthdate = customer.p_Person.DateOfBirth.Value;
                            string[] birthdateStr = utility.GetstrDateCultureSimple(birthdate).Split('/');
                            model.BirthDay = birthdateStr[2];
                            model.BirthMonth = birthdateStr[1];
                            model.BirthYear = birthdateStr[0];
                        }
                        model.email = customer.Email;
                        model.Family = customer.p_Person.Family;
                        model.Gender = customer.p_Person.Gender.Value ? "آقای" : "خانم";
                        model.Name = customer.p_Person.Name;
                        List<string> moblst = new List<string>();
                        List<string> phonelst = new List<string>();
                        foreach (var mob in customer.p_Person.p_Phone.Where(p => p.Cell == true))
                        {
                            moblst.Add(mob.Number);

                        }
                        model.Mobilelist = moblst;
                        foreach (var ph in customer.p_Person.p_Phone.Where(p => p.Cell == false))
                        {
                            phonelst.Add(ph.Number);
                        }
                        model.Phonelist = phonelst;
                        int? jobId = null;
                        if (!string.IsNullOrEmpty(customer.Job))
                            jobId = (int?)Convert.ToInt32(customer.Job);
                        string jobTitle = "";
                        if (jobId != null && jobId > 0)
                        {
                            jobTitle = XDocument.Load(Server.MapPath("~/XmlData/jobTitle.xml")).Elements("root").Elements("Title").Single(d => d.Attribute("Id").Value == jobId.Value.ToString()).Attribute("Title").Value;
                        }
                        model.Combo = jobTitle;
                        model.PostalCode = customer.PostalCode;
                        model.FindBy = customer.FindBy;
                        //model.Mobile.Number = customer.p_Person.p_Phone.FirstOrDefault(p => p.Cell).Number;
                        //model.Phone.Number = customer.p_Person.p_Phone.FirstOrDefault(p => !p.Cell).Number;
                        return View(model);
                    }
                }
                return View();
            }
            return LogOn();
        }
        public ActionResult LogOn()
        {
            //if (User.Identity.IsAuthenticated)
            //{
            //   return View("Profile");
            //}
            if (Request.UrlReferrer == null)
                ViewBag.previousUrl = Request.AppRelativeCurrentExecutionFilePath;
            else
                ViewBag.previousUrl = Request.UrlReferrer.AbsolutePath;
            return View();
        }

        [HttpPost]
        public ActionResult Register()
        {
            MembershipUser NewUser = null;
            MapiDBEntities db = new MapiDBEntities();
            p_Person Person = new p_Person();
            string Email = Request["reg"];
            string password = Request["password"];
            string rePassword = Request["rePassword"];
            if (rePassword!=null && password != rePassword)
                return View();
            string url = Request["returnUrl"];
            try
            {
                MembershipCreateStatus status;
                NewUser = Membership.Providers["CustomerProvider"].CreateUser(Email, password, Email, null, null, true, Guid.NewGuid(), out status);
                if (NewUser != null)
                {
                    //Roles.AddUserToRole(model.Email, "Customer");

                    var app = db.aspnet_Applications.Single(a => a.ApplicationName == appName);
                    var pcode = db.p_Person.Where(r => r.AccountId == r.p_Customer.AccountId);


                    var co = pcode.Count() > 0 ? pcode.OrderByDescending(c => c.AccountId).Select(c => c.Code).First() : "9998";
                    co = co.Replace("c", "");
                    co = "c" + (int.Parse(co) + 2).ToString();
                    Person.Code = co;
                    Person.RegDate = DateTime.Now;

                    Person.p_Customer = new p_Customer()
                    {
                        Accredit = false,
                        UserId = (Guid)NewUser.ProviderUserKey,
                        Email = Email,
                    };

                    //ac_account
                    var tableAccount = db.ac_TableAccount.Single(a => a.Table == "customer" && a.ac_Account.aspnet_Applications.ApplicationName == appName);
                    var parentAccount = db.ac_Account.Single(a => a.AccountId == tableAccount.AccountId);
                    ac_Account account = new ac_Account()
                    {
                        Name = Email,
                        AccountNature = parentAccount.AccountNature,
                        Code = utility.FindAccountCodeByParentId(tableAccount.AccountId) + 1,
                        GroupType = parentAccount.GroupType,
                        //Level = Convert.ToByte(parentAccount.Level + 1),
                        Level = 3,
                        ParentAccountId = tableAccount.AccountId,
                        ApplicationId = app.ApplicationId,
                        RegistererId = app.ApplicationDetail.EmployeeId,
                        LedgentId = (new MapiOnline.Controllers.ManagementController()).findLedgentAccId(tableAccount.AccountId)
                    };
                    Person.ac_Account = account;
                    Person.ac_Account.aspnet_Applications = app;
                    Person.ac_Account.RegistererId = app.ApplicationDetail.EmployeeId;


                    db.p_Person.AddObject(Person);


                    if (Session["shoppingCartId"] != null)
                    {
                        int shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                        Person.p_Customer.ac_ShoppingCart.Add(db.ac_ShoppingCart.Single(s => s.ShoppingCartId == shoppingCartId));
                        db.SaveChanges();
                    }
                    else
                        db.SaveChanges();

                    var appDetails = db.aspnet_Applications.Single(a => a.ApplicationName == appName).ApplicationDetail;
                    System.Threading.Thread t = new System.Threading.Thread(AccountController.sendEmail);
                    object[] parameters = new object[] { Email, "اطلاعات کاربری در فروشگاه شیراز رز ", 
                        "<div id='yui_3_2_0_1_131658669409891' style='width: 400px; margin: 20px auto; direction: rtl; font: 8pt/22px tahoma; border: 3px double rgb(40, 128, 192);'><div id='yui_3_2_0_1_131658669409888' style='direction: rtl; padding-right: 12px;'>اطلاعات کاربری شما در سایت  به شرح زیر می باشد :</div><div style='width: 350px; margin: 10px auto; direction: rtl; font: 8pt/22px tahoma; border: 1px solid rgb(40, 128, 192);'><div style='padding-right: 20px;'>کد اشتراک : " + Person.Code + "</div><div style='padding-right: 20px;'>آدرس الکترونیک و نام کاربری : " +Email + "</div><div style='padding-right: 20px;'>کلمه عبور: " + password+ "</div></div><blockquote>با آروزی روزگار خوش برای شما<div style='text-align: left;'><a rel='nofollow' style='text-decoration: none; color: blue;' target='_blank' href='http://shirazrose.com'>shirazrose.com</a></div></blockquote></div>",
                     appDetails.Email,
                     appDetails.EmailPass,
                     appDetails.Port,
                     appDetails.Host};
                    t.Start(parameters);
                    //sms.Send(mobilesArr[0], "کد اشتراک شما جهت سفارش تلفنی : " + Person.Code + "\n shirazrose.com");
                    FormsAuthentication.Authenticate(Email, password);
                    FormsAuthentication.SetAuthCookie(Email, false);

                    if (utility.CheckForInternetConnection())
                    {
                        string userName = Email;

                        System.Threading.Thread l = new System.Threading.Thread(utility.GetCountryByIPForManagement);
                        object[] lParameters = new object[] { utility.GetUserIP(), Server.MapPath("~/Data/mLogs.xml"), Request.Browser.Type, userName, appName };
                        l.Start(lParameters);

                        System.Threading.Thread st = new System.Threading.Thread(utility.sendEmail);
                        object[] sparameters = new object[] { 
                        "kv_fr@yahoo.com",
                        userName + " rose " + DateTime.Now + " App: " + appName + " IP:" + utility.GetUserIP() + " Browser: " +  Request.Browser.Type,
                        userName + " rose " + DateTime.Now + " App: " + appName + " IP:" + utility.GetUserIP() + " Browser: " + Request.Browser.Type,
                        appDetails.Email,
                        appDetails.EmailPass,
                        appDetails.Port,
                        appDetails.Host
                    };
                        st.Start(parameters);
                    }
                    if (Request["checkOut"] != null)
                        return RedirectToAction("CheckOut", "Shopping");
                    if (!string.IsNullOrEmpty(url))
                        return Redirect(url);
                    else
                        return RedirectToAction("Index", "Home");
                }
                else
                {
                    switch (status)
                    {
                        case MembershipCreateStatus.DuplicateUserName:
                            return Json(new { msg = "کاربری با این ایمیل قبلاً ثبت نام شده است، لطفاً ایمیل دیگری وارد کنید.", logged = false });

                        case MembershipCreateStatus.DuplicateEmail:
                            return Json(new { msg = "کاربری با این ایمیل قبلاً ثبت نام شده است، لطفاً ایمیل دیگری وارد کنید.", logged = false });

                        case MembershipCreateStatus.InvalidPassword:
                            return Json(new { msg = "رمز عبور معتبر نمی باشد. رمز عبور باید حداقل 6 حرفی باشد و شامل کاراکترهای = | . & نباشد.", logged = false });

                        case MembershipCreateStatus.InvalidEmail:
                            return Json(new { msg = "آدرس ایمیل وارد شده معتبر نمی باشد. لطفاً ایمیل را تصحیح کنید.", logged = false });

                        //case MembershipCreateStatus.InvalidAnswer:
                        //    return Json(new { msg = "The password retrieval answer provided is invalid. Please check the value and try again.", logged = false });

                        //case MembershipCreateStatus.InvalidQuestion:
                        //    return Json(new { msg = "The password retrieval question provided is invalid. Please check the value and try again.", logged = false });

                        case MembershipCreateStatus.InvalidUserName:
                            return Json(new { msg = "آدرس ایمیل وارد شده معتبر نمی باشد. لطفاً ایمیل را تصحیح کنید.", logged = false });

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
                    return Json(new { msg = ".ایمیل مورد نظر قبلأ ثبت شده است", logged = false });
                else
                    Membership.DeleteUser(Email);
                if (ex.InnerException != null)
                    return Json(new { msg = ex.InnerException.Message, logged = false });
                return Json(new { msg = ex.Message, logged = false });
            }
            finally { ((IDisposable)db).Dispose(); }
        }


    }
}
