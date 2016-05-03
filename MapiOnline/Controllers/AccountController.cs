using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MapiOnline.Models;
using System.Web.Security;
using System.Data.Objects.DataClasses;
using System.Runtime.Remoting.Contexts;
using System.Xml.Linq;
using System.Data.Objects;
using MvcInternationalization.Controllers;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Net.Security;
namespace MapiOnline.Controllers
{
    public class AccountController : BaseController
    {

        private MapiDBEntities db = new MapiDBEntities();
        //
        // GET: /Account/
        public ActionResult Index()
        {
            return View();
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
                ViewBag.previousUrl = Request.UrlReferrer;
            return View();
        }
        [HttpPost]
        public ActionResult LogOn(LogOnModel logon, string ReturnUrl, int? categoryId)
        {
            try
            {
                MapiDBEntities db = new MapiDBEntities();
                bool authenticate = false;
                if (User.Identity.IsAuthenticated)
                {
                    if (!string.IsNullOrEmpty(logon.previousUrl))
                        return Redirect(logon.previousUrl);
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
                    //return Redirect("../Home/Index?categoryId=" + categoryId);
                    if (Url.IsLocalUrl(logon.previousUrl))
                    {
                        return Redirect(logon.previousUrl);
                    }
                    else
                    {
                        return RedirectToAction("Index", "Home");
                    }
                }
                else if (string.IsNullOrEmpty(logon.UserName) && string.IsNullOrEmpty(logon.Password))
                {
                    ViewBag.result = "";
                    return View(logon);
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
                        string appName = Membership.ApplicationName;
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

                    var a = db.p_Person.Where(p => p.p_Customer.aspnet_Membership.Email == logon.UserName && p.ac_Account.aspnet_Applications.ApplicationName == Membership.ApplicationName).Select(s => new { code = s.Code, name = s.Name, family = s.Family, logged = true }).FirstOrDefault();

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
                    if (logon.checkOut != null && (bool)logon.checkOut)
                        return RedirectToAction("CheckOut", "Shopping");

                    if (!string.IsNullOrEmpty(logon.previousUrl))
                        return Redirect(logon.previousUrl);
                    if (authenticate)
                        if (Url.IsLocalUrl(logon.previousUrl))
                        {
                            return Redirect(logon.previousUrl);
                        }
                        else
                        {
                            return RedirectToAction("Index", "Home");
                        }
                    //return Redirect("../Home/Index?categoryId=" + categoryId);
                    else
                    {
                        ViewBag.result = "شما وارد سایت نشده اید، لطفاً دوباره تلاش کنید.";
                        return View(logon);
                    }
                }
                else
                {
                    ViewBag.result = "ایمیل یا رمز عبور اشتباه است.";
                    return View(logon);
                }
            }
            catch (Exception ex)
            {
                ViewBag.result = ex.Message;
                return View(logon);
            }
        }
        private string GetUserIP()
        {
            string ipList = Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (!string.IsNullOrEmpty(ipList))
            {
                return ipList.Split(',')[0];
            }

            return Request.ServerVariables["REMOTE_ADDR"];
        }
        [Authorize]
        public ActionResult EditPersonalInfo()
        {
            if (User.Identity.IsAuthenticated)
            {
                string currentEmail = User.Identity.Name;
                var customer = db.p_Customer.FirstOrDefault(p => p.aspnet_Membership.aspnet_Users.UserName == currentEmail);
                if (customer != null)
                {
                    var customerCells = db.p_Person.Single(p => p.Code == customer.p_Person.Code).p_Phone.Where(p => p.Cell == true).Select(p => p.Number);
                    foreach (var item in customerCells)
                    {
                        RegisterModel model = new RegisterModel();
                        model.code = customer.p_Person.Code;
                        model.AddressId = Convert.ToInt32(customer.p_Person.AddressId);
                        ViewData["provinceId"] = customer.p_Person.p_Address.ParentAddressId;
                        model.AddressStr = customer.Address;
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
                        var options = new List<SelectListItem> { 
                                                new SelectListItem { Text="انتخاب", Value="" }, 
                                                new SelectListItem { Text="زن", Value="false" }, 
                                                new SelectListItem { Text= "مرد", Value= "true" } 
                                                };
                        ViewBag.Gender = new SelectList(options, "Value", "Text");
                        model.Gender = customer.p_Person.Gender.ToString();
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
                        model.Combo = !string.IsNullOrEmpty(customer.Job) ? customer.Job : " ";
                        model.PostalCode = customer.PostalCode;
                        //int? jobId = (int?)Convert.ToInt32(customer.Job);
                        //string jobTitle = "";
                        //if (jobId != null)
                        //{
                        //    jobTitle = XDocument.Load(Server.MapPath("~/XmlData/jobTitle.xml")).Elements("root").Elements("Title").Single(d => d.Attribute("Id").Value == jobId.Value.ToString()).Attribute("Title").Value;
                        //}
                        //model.Combo = jobTitle;
                        //model.Mobile.Number = customer.p_Person.p_Phone.FirstOrDefault(p => p.Cell).Number;
                        //model.Phone.Number = customer.p_Person.p_Phone.FirstOrDefault(p => !p.Cell).Number;
                        return View(model);
                    }
                }
                return View();
            }
            return LogOn();
        }
        [HttpPost]
        [Authorize]
        public ActionResult UserInfo(RegisterModel model)
        {
            try
            {

                var currentCustomer = db.p_Customer.FirstOrDefault(c => c.aspnet_Membership.aspnet_Users.UserName == User.Identity.Name);

                string bDay = model.BirthDay;
                string bMonth = model.BirthMonth;
                string bYear = model.BirthYear;

                var days = new List<SelectListItem> { 
                                                new SelectListItem { Text="انتخاب", Value="" }, 
                                                new SelectListItem { Text=" 1 ", Value="1" }, 
                                                new SelectListItem { Text=" 2 ", Value="2" }, 
                                                new SelectListItem { Text=" 3 ", Value="3" }, 
                                                new SelectListItem { Text=" 4 ", Value="4" }, 
                                                new SelectListItem { Text=" 5 ", Value="5" }, 
                                                new SelectListItem { Text=" 6 ", Value="6" }, 
                                                new SelectListItem { Text=" 7 ", Value="7" }, 
                                                new SelectListItem { Text=" 8 ", Value="8" }, 
                                                new SelectListItem { Text=" 9 ", Value="9" }, 
                                                new SelectListItem { Text=" 10 ", Value="10" }, 
                                                new SelectListItem { Text=" 11 ", Value="11" }, 
                                                new SelectListItem { Text=" 12 ", Value="12" }, 
                                                new SelectListItem { Text=" 13 ", Value="13" }, 
                                                new SelectListItem { Text=" 14 ", Value="14" }, 
                                                new SelectListItem { Text=" 15 ", Value="15" }, 
                                                new SelectListItem { Text=" 16 ", Value="16" }, 
                                                new SelectListItem { Text=" 17 ", Value="17" }, 
                                                new SelectListItem { Text=" 18 ", Value="18" }, 
                                                new SelectListItem { Text=" 19 ", Value="19" }, 
                                                new SelectListItem { Text=" 20 ", Value="20" }, 
                                                new SelectListItem { Text=" 21 ", Value="21" }, 
                                                new SelectListItem { Text=" 22 ", Value="22" }, 
                                                new SelectListItem { Text=" 23 ", Value="23" }, 
                                                new SelectListItem { Text=" 24 ", Value="24" }, 
                                                new SelectListItem { Text=" 25 ", Value="25" }, 
                                                new SelectListItem { Text=" 26 ", Value="26" }, 
                                                new SelectListItem { Text=" 27 ", Value="27" }, 
                                                new SelectListItem { Text=" 28 ", Value="28" }, 
                                                new SelectListItem { Text= " 29 ", Value= "29" } ,
                                                new SelectListItem { Text=" 30 ", Value="30" }, 
                                                new SelectListItem { Text= " 31 ", Value= "31" } 
                                                };
                ViewBag.BirthDay = new SelectList(days, "Value", "Text", bDay);
                var months = new List<SelectListItem> { 
                                                 new SelectListItem { Value=" 1" ,Text="فروردین" },
                                        new SelectListItem { Value="2" ,Text="اردیبهشت" },
                                        new SelectListItem { Value="3",Text="خرداد" },
                                        new SelectListItem { Value="4",Text="تیر" },
                                        new SelectListItem { Value="5",Text="مرداد" },
                                        new SelectListItem { Value="6",Text="شهریور" },
                                        new SelectListItem { Value="7",Text="مهر" },
                                        new SelectListItem { Value="8",Text="آبان" },
                                        new SelectListItem { Value="9",Text="آذر" },
                                        new SelectListItem { Value="10",Text="دی" },
                                        new SelectListItem { Value="11",Text="بهمن" },
                                        new SelectListItem { Value="12",Text="اسفند" }
                                                };
                ViewBag.BirthMonth = new SelectList(months, "Value", "Text", bMonth);
                var years = new List<
                SelectListItem>{
                                               new SelectListItem { Value="1394",Text="1394"},
                                        new SelectListItem { Value="1393",Text="1393"},
                                        new SelectListItem { Value="1392",Text="1392"},
                                        new SelectListItem { Value="1391",Text="1391"},
                                        new SelectListItem { Value="1390",Text="1390"},
                                        new SelectListItem { Value="1389",Text="1389"},
                                        new SelectListItem { Value="1387",Text="1387"},
                                        new SelectListItem { Value="1386",Text="1386"},
                                        new SelectListItem { Value="1385",Text="1385"},
                                        new SelectListItem { Value="1384",Text="1384"},
                                        new SelectListItem { Value="1383",Text="1383"},
                                        new SelectListItem { Value="1382",Text="1382"},
                                        new SelectListItem { Value="1381",Text="1381"},
                                        new SelectListItem { Value="1380",Text="1380"},
                                        new SelectListItem { Value="1379",Text="1379"},
                                        new SelectListItem { Value="1378",Text="1378"},
                                        new SelectListItem { Value="1377",Text="1377"},
                                        new SelectListItem { Value="1376",Text="1376"},
                                        new SelectListItem { Value="1375",Text="1375"},
                                        new SelectListItem { Value="1374",Text="1374"},
                                        new SelectListItem { Value="1373",Text="1373"},
                                        new SelectListItem { Value="1372",Text="1372"},
                                        new SelectListItem { Value="1371",Text="1371"},
                                        new SelectListItem { Value="1370",Text="1370"},
                                        new SelectListItem { Value="1369",Text="1369"},
                                        new SelectListItem { Value="1368",Text="1368"},
                                        new SelectListItem { Value="1367",Text="1367"},
                                        new SelectListItem { Value="1366",Text="1366"},
                                        new SelectListItem { Value="1365",Text="1365"},
                                        new SelectListItem { Value="1364",Text="1364"},
                                        new SelectListItem { Value="1363",Text="1363"},
                                        new SelectListItem { Value="1362",Text="1362"},
                                        new SelectListItem { Value="1361",Text="1361"},
                                        new SelectListItem { Value="1360",Text="1360"},
                                        new SelectListItem { Value="1359",Text="1359"},
                                        new SelectListItem { Value="1358",Text="1358"},
                                        new SelectListItem { Value="1357",Text="1357"},
                                        new SelectListItem { Value="1356",Text="1356"},
                                        new SelectListItem { Value="1355",Text="1355"},
                                        new SelectListItem { Value="1354",Text="1354"},
                                        new SelectListItem { Value="1353",Text="1353"},
                                        new SelectListItem { Value="1352",Text="1352"},
                                        new SelectListItem { Value="1351",Text="1351"},
                                        new SelectListItem { Value="1350",Text="1350"},
                                        new SelectListItem { Value="1349",Text="1349"},
                                        new SelectListItem { Value="1348",Text="1348"},
                                        new SelectListItem { Value="1347",Text="1347"},
                                        new SelectListItem { Value="1346",Text="1346"},
                                        new SelectListItem { Value="1345",Text="1345"},
                                        new SelectListItem { Value="1344",Text="1344"},
                                        new SelectListItem { Value="1343",Text="1343"},
                                        new SelectListItem { Value="1342",Text="1342"},
                                        new SelectListItem { Value="1341",Text="1341"},
                                        new SelectListItem { Value="1340",Text="1340"},
                                        new SelectListItem { Value="1339",Text="1339"},
                                        new SelectListItem { Value="1338",Text="1338"},
                                        new SelectListItem { Value="1337",Text="1337"},
                                        new SelectListItem { Value="1336",Text="1336"},
                                        new SelectListItem { Value="1335",Text="1335"},
                                        new SelectListItem { Value="1334",Text="1334"},
                                        new SelectListItem { Value="1333",Text="1333"},
                                        new SelectListItem { Value="1332",Text="1332"},
                                        new SelectListItem { Value="1331",Text="1331"},
                                        new SelectListItem { Value="1330",Text="1330"},
                                        new SelectListItem { Value="1329",Text="1329"},
                                        new SelectListItem { Value="1328",Text="1328"},
                                        new SelectListItem { Value="1327",Text="1327"},
                                        new SelectListItem { Value="1326",Text="1326"},
                                        new SelectListItem { Value="1325",Text="1325"},
                                        new SelectListItem { Value="1324",Text="1324"},
                                        new SelectListItem { Value="1323",Text="1323"},
                                        new SelectListItem { Value="1322",Text="1322"},
                                        new SelectListItem { Value="1321",Text="1321"},
                                        new SelectListItem { Value="1320",Text="1920"},
                                                                                     };
                ViewBag.BirthYear = new SelectList(years, "Value", "Text", bYear);

                var options = new List<SelectListItem> { 
                                                new SelectListItem { Text="انتخاب", Value="" }, 
                                                new SelectListItem { Text="زن", Value="False" }, 
                                                new SelectListItem { Text= "مرد", Value= "True" } 
                                                };
                ViewBag.Gender = new SelectList(options, "Value", "Text", currentCustomer.p_Person.Gender);

                if (User.Identity.IsAuthenticated)
                {
                    if (!string.IsNullOrEmpty(model.email))
                    {
                        MembershipUser Current = Membership.GetUser();

                        if (Membership.GetUser(model.email.ToLower()) == null)
                        {
                            string currentUsername = User.Identity.Name;
                            aspnet_Users _user = db.aspnet_Users.FirstOrDefault(u => u.UserName == currentUsername);
                            _user.UserName = model.email.ToLower();
                            _user.LoweredUserName = model.email.ToLower();
                            var customer = db.p_Customer.FirstOrDefault(c => c.aspnet_Membership.aspnet_Users.UserName == currentUsername);
                            customer.Email = model.email.ToLower();
                            var membership = db.aspnet_Membership.FirstOrDefault(m => m.Email == currentUsername);
                            membership.Email = model.email.ToLower();
                            membership.LoweredEmail = model.email.ToLower();
                            db.SaveChanges();
                            FormsAuthentication.SetAuthCookie(model.email.ToLower(), false);
                            ViewBag.result = "ایمیل شما با موفقیت تغییر یافت.";
                        }
                        else
                        {
                            ViewBag.result = "این ایمیل قبلاً ثبت نام شده است.";
                        }
                    }

                }


                else
                {
                    ViewBag.result = "شما از سایت خارج شده اید، مجدداً با ایمیل خود وارد شوید.";
                    return View(model);
                }

                if (User.Identity.IsAuthenticated)
                    if (model.Password != null && model.NewPassword != null && model.ConfirmPassword != null && model.NewPassword == model.ConfirmPassword)
                    {
                        var user = Membership.GetUser(User.Identity.Name);
                        if (user.ChangePassword(model.Password.ToString(), model.NewPassword.ToString()))
                        {
                            ViewBag.result = "رمز عبور شما با موفقیت تغییر یافت.";
                        }
                        //return View(Result("رمز عبور شما با موفقیت تغییر یافت."));
                        else
                        {
                            ViewBag.result = "رمز عبور جدید ثبت نشد، لطفاً دوباره تلاش کنید.";
                            return View(model);
                        }
                        //return View(Result("رمز عبور جدید ثبت نشد، لطفاً دوباره تلاش کنید."));
                    }
                    else
                    {
                        ViewBag.result = "رمز عبور جدید و تکرار آن یکسان نیست.";
                        if (model.Password != null && model.NewPassword != null)
                            return View(model);
                    }
                //return View(Result("رمز عبور جدید و تکرار آن یکسان نیست."));
                else
                {
                    ViewBag.result = "expired";
                    return View(model);
                }
                //return View(Result("expired"));

                //if (ModelState.IsValid)
                //{
                //var currentCustomer = db.p_Customer.FirstOrDefault(c => c.aspnet_Membership.aspnet_Users.UserName == User.Identity.Name);
                if (currentCustomer != null)
                {
                    //Roles.AddUserToRole(model.Email, "Customer");
                    //foreach (var item in currentCustomer.p_Person.p_Phone.ToList())
                    //{
                    //    db.p_Phone.DeleteObject(item);
                    //}
                    //string[] mobilesArr = mobiles[0].Split(',');
                    //foreach (var mobile in mobilesArr)
                    //{
                    //    string mob = mobile.Trim();
                    //    currentCustomer.p_Person.p_Phone.Add(new p_Phone()
                    //    {
                    //        Cell = true,
                    //        Number = mob
                    //    });
                    //}
                    //if (phones.Count > 0)
                    //{
                    //    string[] phonesArr = phones[0].Split(',');
                    //    foreach (var phone in phonesArr)
                    //    {
                    //        string ph = phone.Trim();
                    //        currentCustomer.p_Person.p_Phone.Add(new p_Phone()
                    //        {
                    //            Cell = false,
                    //            Number = ph
                    //        });
                    //    }
                    //}
                    //currentCustomer.p_Person.AddressId = regCity;

                    if (model.Phone != null && !currentCustomer.p_Person.p_Phone.Any(c => !c.Cell && c.Number == model.Phone))
                    {
                        currentCustomer.p_Person.p_Phone.Add(new p_Phone { Cell = false, Number = model.Phone });
                    }
                    if (model.Mobile != null && !currentCustomer.p_Person.p_Phone.Any(c => c.Cell && c.Number == model.Mobile))
                    {
                        currentCustomer.p_Person.p_Phone.Add(new p_Phone { Cell = true, Number = model.Mobile });
                    }
                    currentCustomer.p_Person.Name = model.Name;
                    currentCustomer.p_Person.Family = model.Family;
                    if (model.BirthYear != null)
                    {
                        model.BirthMonth = !string.IsNullOrEmpty(model.BirthMonth) ? model.BirthMonth : "01";
                        model.BirthDay = !string.IsNullOrEmpty(model.BirthDay) ? model.BirthDay : "01";
                        currentCustomer.p_Person.DateOfBirth = utility.GetDateCulture(model.BirthYear, model.BirthMonth, model.BirthDay);
                    }



                    currentCustomer.p_Person.Gender = Boolean.Parse(model.Gender);
                    //currentCustomer.Address = model.AddressStr;
                    //currentCustomer.PostalCode = model.PostalCode;
                    //if (!string.IsNullOrEmpty(Combo))
                    //    currentCustomer.Job = Combo.Trim();

                    db.SaveChanges();
                    ViewBag.result = "اطلاعات با موفقیت ثبت شد.";
                    return View(model);
                    return Json(new { isdone = true, msg = "اطلاعات با موفقیت ثبت شد." });
                }
                return Json(new { isdone = false, msg = "خطا در ثبت اطلاعات." });
                //}
                //else
                //    return Json(new { isdone = false, msg = "تکمیل موارد ستاره دار الزامیست." });
            }
            catch (Exception ex) { return Json(new { isdone = false, msg = ex.Message }); }
        }
        public ActionResult RegistrationType()
        {
            return View();
        }
        public ActionResult Register()
        {
            var options = new List<SelectListItem> { 
                new SelectListItem { Text="انتخاب", Value="" }, 
                new SelectListItem { Text="زن", Value="false" }, 
                new SelectListItem { Text= "مرد", Value= "true" } 
            };

            ViewBag.Gender = new SelectList(options, "Value", "Text");
            return View();
        }
        [HttpPost]
        public ActionResult Register(RegisterModel model, List<string> phones, List<string> mobiles, string FindBy, int regCity)
        {
            MembershipUser NewUser = null;
            Membership.ApplicationName = Membership.ApplicationName;
            MapiDBEntities db = new MapiDBEntities();
            p_Person Person = new p_Person();
            try
            {
                MembershipCreateStatus status;
                NewUser = Membership.Providers["CustomerProvider"].CreateUser(model.email, model.Password, model.email, null, null, true, Guid.NewGuid(), out status);
                if (NewUser != null)
                {
                    //Roles.AddUserToRole(model.Email, "Customer");
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
                    Person.Name = model.Name;
                    Person.Family = model.Family;
                    Person.RegDate = DateTime.Now;
                    Person.ApplicationId = app.ApplicationId;
                    if (model.BirthYear != null)
                    {
                        model.BirthMonth = !string.IsNullOrEmpty(model.BirthMonth) ? model.BirthMonth : "1";
                        model.BirthDay = !string.IsNullOrEmpty(model.BirthDay) ? model.BirthDay : "1";
                        Person.DateOfBirth = utility.GetDateCulture(model.BirthYear, model.BirthMonth, model.BirthDay);
                    }
                    Person.Gender = Boolean.Parse(model.Gender);
                    Person.p_Customer = new p_Customer()
                    {
                        Address = model.AddressStr,
                        PostalCode = model.PostalCode,
                        NetBuy = 0,
                        NetPayment = 0,
                        Job = model.Combo,
                        UserId = (Guid)NewUser.ProviderUserKey,
                        Email = model.email,
                        //RegistererId = app.ApplicationDetail.EmployeeId,
                        FindBy = FindBy
                    };

                    //ac_account
                    var tableAccount = db.ac_TableAccount.Single(a => a.Table == "customer" && a.ac_Account.aspnet_Applications.ApplicationName == Membership.ApplicationName);
                    var parentAccount = db.ac_Account.Single(a => a.AccountId == tableAccount.AccountId);
                    ac_Account account = new ac_Account()
                    {
                        AccountNature = parentAccount.AccountNature,
                        Code = utility.FindAccountCodeByParentId(tableAccount.AccountId) + 1,
                        GroupType = parentAccount.GroupType,
                        //Level = Convert.ToByte(parentAccount.Level + 1),
                        Level = 3,
                        Name = model.Family + " " + model.Name + " " + co,
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

                    var appDetails = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationDetail;
                    System.Threading.Thread t = new System.Threading.Thread(sendEmail);
                    object[] parameters = new object[] { model.email, "اطلاعات کاربری در فروشگاه شیراز رز ", 
                        "<div id='yui_3_2_0_1_131658669409891' style='width: 400px; margin: 20px auto; direction: rtl; font: 8pt/22px tahoma; border: 3px double rgb(40, 128, 192);'><div id='yui_3_2_0_1_131658669409888' style='direction: rtl; padding-right: 12px;'>اطلاعات کاربری شما در سایت  به شرح زیر می باشد :</div><div style='width: 350px; margin: 10px auto; direction: rtl; font: 8pt/22px tahoma; border: 1px solid rgb(40, 128, 192);'><div style='padding-right: 20px;'>کد اشتراک : " + Person.Code + "</div><div style='padding-right: 20px;'>آدرس الکترونیک و نام کاربری : " + model.email + "</div><div style='padding-right: 20px;'>کلمه عبور: " + model.Password + "</div></div><blockquote>با آروزی روزگار خوش برای شما<div style='text-align: left;'><a rel='nofollow' style='text-decoration: none; color: blue;' target='_blank' href='http://shirazrose.com'>shirazrose.com</a></div></blockquote></div>",
                     appDetails.Email,
                     appDetails.EmailPass,
                     appDetails.Port,
                     appDetails.Host};
                    t.Start(parameters);
                    sms.Send(mobilesArr[0], "کد اشتراک شما جهت سفارش تلفنی : " + Person.Code + "\n shirazrose.com");
                    FormsAuthentication.Authenticate(model.email, model.Password);
                    FormsAuthentication.SetAuthCookie(model.email, false);

                    if (utility.CheckForInternetConnection())
                    {
                        string userName = model.email;
                        string appName = Membership.ApplicationName;

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
                    return Json(new { link = "../Home/Index", logged = true });
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
                    Membership.DeleteUser(model.email);
                if (ex.InnerException != null)
                    return Json(new { msg = ex.InnerException.Message, logged = false });
                return Json(new { msg = ex.Message, logged = false });
            }
            finally { ((IDisposable)db).Dispose(); }
        }
        public ActionResult CompleteRegisteration(string MemberCode)
        {
            if (!string.IsNullOrEmpty(MemberCode))
            {
                string[] codeCell = MemberCode.Split('-');
                if (codeCell.Count() == 2)
                {
                    decimal celllast5 = Convert.ToDecimal(codeCell[1]) - 24680;
                    string code = "c" + (Convert.ToDecimal(codeCell[0]) / 1234).ToString();
                    var customer = db.p_Customer.SingleOrDefault(c => c.p_Person.Code == code);
                    if (customer != null)
                    {
                        var customerCells = db.p_Person.Single(p => p.Code == code).p_Phone.Where(p => p.Cell == true).Select(p => p.Number);
                        foreach (var item in customerCells)
                        {
                            if (Convert.ToDecimal(item.Substring(5)) == celllast5)
                            {
                                RegisterModel model = new RegisterModel();
                                model.code = customer.p_Person.Code;
                                var options = new List<SelectListItem> { 
                                          new SelectListItem { Text="انتخاب", Value="" }, 
                                          new SelectListItem { Text="زن", Value="false" }, 
                                          new SelectListItem { Text= "مرد", Value= "true" } 
                                        };

                                ViewBag.Gender = new SelectList(options, "Value", "Text");
                                model.Gender = customer.p_Person.Gender.ToString();
                                model.AddressId = customer.p_Person.AddressId.Value;
                                model.AddressStr = customer.Address;
                                ViewData["provinceId"] = customer.p_Person.p_Address != null ? customer.p_Person.p_Address.ParentAddressId : null;

                                if (customer.p_Person.AddressId != null)
                                    model.AddressId = customer.p_Person.AddressId.Value;
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
                                //model.Gender = customer.p_Person.Gender ? "مرد" : "زن";
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
                                model.Combo = customer.Job;
                                model.PostalCode = customer.PostalCode;
                                //model.Mobile.Number = customer.p_Person.p_Phone.FirstOrDefault(p => p.Cell).Number;
                                //model.Phone.Number = customer.p_Person.p_Phone.FirstOrDefault(p => !p.Cell).Number;
                                return View(model);
                            }
                        }
                    }
                }
                ViewBag.result = "کد صحیح نمی باشد.";
                return View("SendMemberCode");
            }
            ViewBag.result = "کد را وارد کنید.";
            return View("SendMemberCode");
        }
        [HttpPost]
        public ActionResult CompleteRegisteration(RegisterModel model, List<string> phones, List<string> mobiles, int regCity, string FindBy)
        {
            MembershipUser NewUser = null;
            var Person = db.p_Person.Single(p => p.Code == model.code);
            var customer = Person.p_Customer;
            try
            {
                MembershipCreateStatus status;
                NewUser = Membership.Providers["CustomerProvider"].CreateUser(model.email, model.Password, model.email, null, null, true, Guid.NewGuid(), out status);
                if (NewUser != null)
                {
                    //Roles.AddUserToRole(model.Email, "Customer");
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
                    Person.Name = model.Name;
                    Person.Family = model.Family;
                    if (model.BirthYear != null)
                    {
                        model.BirthMonth = !string.IsNullOrEmpty(model.BirthMonth) ? model.BirthMonth : "01";
                        model.BirthDay = !string.IsNullOrEmpty(model.BirthDay) ? model.BirthDay : "01";
                        Person.DateOfBirth = utility.GetDateCulture(model.BirthYear, model.BirthMonth, model.BirthDay);
                    }
                    Person.Gender = Boolean.Parse(model.Gender);

                    customer.UserId = (Guid)NewUser.ProviderUserKey;
                    customer.Email = model.email;
                    customer.Address = model.AddressStr;
                    customer.PostalCode = model.PostalCode;
                    customer.Job = model.Combo;
                    customer.FindBy = FindBy;
                    db.SaveChanges();

                    FormsAuthentication.Authenticate(model.email, model.Password);
                    FormsAuthentication.SetAuthCookie(model.email, false);
                    var appDetails = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationDetail;
                    System.Threading.Thread t = new System.Threading.Thread(sendEmail);
                    object[] parameters = new object[] { model.email, "اطلاعات کاربری در فروشگاه شیراز رز ",
                        "<div id='yui_3_2_0_1_131658669409891' style='width: 400px; margin: 20px auto; direction: rtl; font: 8pt/22px tahoma; border: 3px double rgb(40, 128, 192);'><div id='yui_3_2_0_1_131658669409888' style='direction: rtl; padding-right: 12px;'>اطلاعات کاربری شما در سایت  به شرح زیر می باشد :</div><div style='width: 350px; margin: 10px auto; direction: rtl; font: 8pt/22px tahoma; border: 1px solid rgb(40, 128, 192);'><div style='padding-right: 20px;'>کد اشتراک : " + Person.Code + "</div><div style='padding-right: 20px;'>آدرس الکترونیک و نام کاربری : " + model.email + "</div><div style='padding-right: 20px;'>کلمه عبور: " + model.Password + "</div></div><blockquote>با آروزی روزگار خوش برای شما<div style='text-align: left;'><a rel='nofollow' style='text-decoration: none; color: blue;' target='_blank' href='http://shirazrose.com'>shirazrose.com</a></div></blockquote></div>",
                         appDetails.Email,
                     appDetails.EmailPass,
                     appDetails.Port,
                     appDetails.Host};
                    t.Start(parameters);
                    sms.Send(mobilesArr[0], "کد اشتراک شما جهت سفارش تلفنی : " + customer.p_Person.Code + "\n shirazrose.com");
                    FormsAuthentication.Authenticate(model.email, model.Password);
                    FormsAuthentication.SetAuthCookie(model.email, false);
                    return Json(new { link = "../Home/Index", logged = true });
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
                    return Json(new { msg = "کاربری با این ایمیل قبلاً ثبت نام شده است، لطفاً ایمیل دیگری وارد کنید.", logged = false });
                else
                    Membership.DeleteUser(model.email);
                if (ex.InnerException != null)
                    return Json(new { msg = ex.InnerException.Message, logged = false });
                return Json(new { msg = ex.Message, logged = false });
            }
            finally { ((IDisposable)db).Dispose(); }

        }
        public static void sendEmail(object parameters)
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
        public ActionResult SendMemberCode()
        {
            return View();
        }
        public ActionResult sendMemberCodeToMobile(string mobile)
        {
            //if (HttpContext.Current.Session["Loggedin"] == null)
            //    return null;
            try
            {
                p_Customer p = new MapiDBEntities().p_Customer.Where(ph => ph.p_Person.p_Phone.Any(c => c.Cell == true && c.Number == mobile)).FirstOrDefault();
                if (p != null)
                {
                    string userName = "";
                    userName = (p.aspnet_Membership == null) ? "" : p.aspnet_Membership.aspnet_Users.UserName;
                    if (string.IsNullOrEmpty(userName))
                    {
                        string code = "کد عضویت :\n" + ((Convert.ToInt32(p.p_Person.Code.Substring(1)) * 1234) + "-" + (Convert.ToInt32(mobile.Substring(5)) + 24680)) + "\n shirazrose.com";
                        sms.Send(mobile, code);
                        return Json(new { isdone = true, msg = "کد عضویت به شماره موبایل ارسال شد." });
                    }
                    else
                    {
                        sms.Send(mobile, "ایمیل :\n" + userName + " /n shirazrose.com");
                        return Json(new { isdone = true, msg = "شما در سایت ثبت نام شده اید، ایمیل به شماره موبایل ارسال شد." });
                    }
                }
                else
                    return Json(new { isdone = false, msg = "شماره موبایل در سایت ثبت نشده است." });
            }
            catch (Exception ex)
            {
                return Json(new { isdone = true, msg = ex.Message });
            }
        }

        public ActionResult GetPersonInfo()
        {
            if (User.Identity.IsAuthenticated)
            {

                var perNameFamily = db.aspnet_Membership.Single(m => m.aspnet_Users.UserName == User.Identity.Name).p_Customer.FirstOrDefault().p_Person;
                if (!string.IsNullOrEmpty(perNameFamily.Name) && !string.IsNullOrEmpty(perNameFamily.Family))
                    ViewData["name"] = perNameFamily.Name + " " + perNameFamily.Family;
                else
                    ViewData["name"] = perNameFamily.ac_Account.Name;
                return PartialView("GetPersonInfo");
            }
            else
                return PartialView("NotLogged");
        }
        public ActionResult GetAdminInfo()
        {
            if (User.Identity.IsAuthenticated)
            {

                var perNameFamily = db.aspnet_Membership.Single(m => m.aspnet_Users.UserName == User.Identity.Name).p_Employee.FirstOrDefault().p_Person;
                ViewData["name"] = perNameFamily.Name + " " + perNameFamily.Family;
                return PartialView("GetAdminInfo");
            }
            else
                return PartialView("NotLogged");
        }
        public ActionResult LogOff(int? categoryId)
        {
            Session["orderHeaderId"] = null;
            FormsAuthentication.SignOut();
            return Redirect("../Home/Index?categoryId=" + categoryId);
        }
        [Authorize]
        public ActionResult RegisterItem()
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
        [Authorize]
        public ActionResult ChangePassword()
        {
            return View();
        }
        [HttpPost]
        [Authorize]
        public ActionResult ChangePassword(ChangePassword model)
        {
            if (ModelState.IsValid)
            {
                if (User.Identity.IsAuthenticated)
                    if (model.NewPassword == model.ConfirmNewPassword)
                    {
                        var user = Membership.GetUser(User.Identity.Name);
                        if (user.ChangePassword(model.Password, model.NewPassword))
                        {
                            ViewBag.result = "رمز عبور شما با موفقیت تغییر یافت.";
                            return View("Result");
                        }
                        //return View(Result("رمز عبور شما با موفقیت تغییر یافت."));
                        else
                        {
                            ViewBag.result = "رمز عبور جدید ثبت نشد، لطفاً دوباره تلاش کنید.";
                            return View("Result");
                        }
                        //return View(Result("رمز عبور جدید ثبت نشد، لطفاً دوباره تلاش کنید."));
                    }
                    else
                    {
                        ViewBag.result = "رمز عبور جدید و تکرار آن یکسان نیست.";
                        return View("Result");
                    }
                //return View(Result("رمز عبور جدید و تکرار آن یکسان نیست."));
                else
                {
                    ViewBag.result = "expired";
                    return View("Result");
                }
                //return View(Result("expired"));
            }
            else
            {
                ViewBag.result = "expired";
                return View("Result");
            }
        }
        [Authorize]
        public ActionResult ChangeUserName()
        {
            return View();
        }
        [HttpPost]
        [Authorize]
        public ActionResult ChangeUserName(ChangeUsername model)
        {
            if (User.Identity.IsAuthenticated)
            {
                if (model.NewEmail == model.ConfirmNewEmail)
                {
                    MembershipUser Current = Membership.GetUser();
                    if (model.Password == Current.GetPassword())
                    {
                        if (Membership.GetUser(model.NewEmail.ToLower()) == null)
                        {
                            string currentUsername = User.Identity.Name;
                            aspnet_Users _user = db.aspnet_Users.Single(u => u.UserName == currentUsername);
                            _user.UserName = model.NewEmail;
                            _user.LoweredUserName = model.NewEmail.ToLower();
                            var customer = db.p_Customer.Single(c => c.Email == currentUsername);
                            customer.Email = model.NewEmail;
                            var membership = db.aspnet_Membership.Single(m => m.Email == currentUsername);
                            membership.Email = model.NewEmail;
                            membership.LoweredEmail = model.NewEmail.ToLower();
                            db.SaveChanges();
                            FormsAuthentication.SetAuthCookie(model.NewEmail, false);
                            ViewBag.result = "ایمیل شما با موفقیت تغییر یافت.";
                            return View("Result");
                        }
                        else
                        {
                            ViewBag.result = "این ایمیل قبلاً ثبت نام شده است.";
                            return View("Result");
                        }
                    }
                    else
                    {
                        ViewBag.result = "رمز عبور اشتباه است.";
                        return View("Result");
                    }
                }
                else
                {
                    ViewBag.result = "ایمیل جدید و تکرار آن یکسان نیست.";
                    return View("Result");
                }
            }
            else
            {
                ViewBag.result = "شما از سایت خارج شده اید، مجدداً با ایمیل خود وارد شوید.";
                return View("Result");
            }
        }

        public ActionResult LostPassword()
        {
            return View();
        }
        [HttpPost]
        public ActionResult LoastPassword(string email)
        {
            MembershipUser Current = Membership.GetUser(email);
            try
            {
                if (string.IsNullOrEmpty(email) || string.IsNullOrWhiteSpace(email))
                {
                    ViewBag.result = "ایمیل خود را که در سایت ثبت شده وارد کنید.";
                    return View();
                }
                var appDetails = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationDetail;
                if (db.aspnet_Membership.Any(m => m.aspnet_Users.UserName == email))
                {
                    System.Threading.Thread t = new System.Threading.Thread(sendEmail);
                    object[] parameters = new object[] { email, 
                        "رمز عبور شما در فروشگاه شیراز رز ", 
                        "<div id='yui_3_2_0_1_131658669409891' style='width: 400px; margin: 20px auto; direction: rtl; font: 8pt/22px tahoma; border: 3px double rgb(40, 128, 192);'><div id='yui_3_2_0_1_131658669409888' style='direction: rtl; padding-right: 12px;'>اطلاعات کاربری شما در سایت  به شرح زیر می باشد :</div><div style='width: 350px; margin: 10px auto; direction: rtl; font: 8pt/22px tahoma; border: 1px solid rgb(40, 128, 192);'><div style='padding-right: 20px;'>آدرس الکترونیک : " + Current.UserName + "</div><div style='padding-right: 20px;'>کلمه عبور: " + Current.GetPassword() + "</div></div><blockquote>با آروزی روزگار خوش برای شما<div style='text-align: left;'><a rel='nofollow' style='text-decoration: none; color: blue;' target='_blank' href='http://shirazrose.com'>shirazrose.com</a></div></blockquote></div>" ,
                    appDetails.Email,
                     appDetails.EmailPass,
                     appDetails.Port,
                     appDetails.Host
                    };

                    t.Start(parameters);
                }
                ViewBag.result = "رمز عبور شما به ایمیل ارسال شد.";
                return View();
            }
            catch (Exception ex)
            {
                ViewBag.result = ex.Message;
                return View();
            }
        }

        public ActionResult ForgotPassword()
        {
            return View();
        }
        [HttpPost]
        public ActionResult ForgotPassword(string email)
        {
            MembershipUser Current = Membership.GetUser(email);
            try
            {
                if (string.IsNullOrEmpty(email) || string.IsNullOrWhiteSpace(email))
                {
                    ViewBag.result = "ایمیل خود را که در سایت ثبت شده وارد کنید.";
                    return View();
                }
                var appDetails = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationDetail;
                if (db.aspnet_Membership.Any(m => m.aspnet_Users.UserName == email))
                {
                    System.Threading.Thread t = new System.Threading.Thread(sendEmail);
                    object[] parameters = new object[] { email, 
                        "رمز عبور شما در فروشگاه شیراز رز ", 
                        "<div id='yui_3_2_0_1_131658669409891' style='width: 400px; margin: 20px auto; direction: rtl; font: 8pt/22px tahoma; border: 3px double rgb(40, 128, 192);'><div id='yui_3_2_0_1_131658669409888' style='direction: rtl; padding-right: 12px;'>اطلاعات کاربری شما در سایت  به شرح زیر می باشد :</div><div style='width: 350px; margin: 10px auto; direction: rtl; font: 8pt/22px tahoma; border: 1px solid rgb(40, 128, 192);'><div style='padding-right: 20px;'>آدرس الکترونیک : " + Current.UserName + "</div><div style='padding-right: 20px;'>کلمه عبور: " + Current.GetPassword() + "</div></div><blockquote>با آروزی روزگار خوش برای شما<div style='text-align: left;'><a rel='nofollow' style='text-decoration: none; color: blue;' target='_blank' href='http://shirazrose.com'>shirazrose.com</a></div></blockquote></div>" ,
                    appDetails.Email,
                     appDetails.EmailPass,
                     appDetails.Port,
                     appDetails.Host
                    };

                    t.Start(parameters);
                }
                ViewBag.result = "رمز عبور شما به ایمیل ارسال شد.";
                return View();
            }
            catch (Exception ex)
            {
                ViewBag.result = ex.Message;
                return View();
            }
        }

        private decimal? getBalance(decimal? amount)
        {
            decimal? firstBalance = balance;
            balance = balance + amount;
            return -firstBalance;
        }
        decimal? balance = 0;
        [Authorize]
        public ActionResult GetCurrentUserOrders(int skip, int take, bool first, string sort,
                                                 string shop, string EmployeeName, string InvoiceDateStart, string InvoiceDateEnd,
                                                 decimal? PriceFrom, decimal? PriceTo, string Barcode, string ProductName, string InvoiceNumber)
        {
            try
            {
                var currentCustomer = db.p_Customer.SingleOrDefault(c => c.Email == User.Identity.Name);
                List<ObjectParameter> ol = new List<ObjectParameter>();
                string dynStr = string.Empty;
                dynStr += "it.ClientId = @customerId ";
                ol.Add(new ObjectParameter("customerId", currentCustomer.AccountId));
                if (!string.IsNullOrEmpty(InvoiceDateStart))
                {
                    if (dynStr.Length > 0)
                        dynStr += " And ";
                    dynStr += " it.Date   >=   @InvoiceDateStart";
                    ol.Add(new ObjectParameter("InvoiceDateStart", utility.GetDateCulture(InvoiceDateStart)));
                }

                if (!string.IsNullOrEmpty(InvoiceDateEnd))
                {
                    if (dynStr.Length > 0)
                        dynStr += " And ";
                    dynStr += " it.Date   <=   @InvoiceDateEnd";
                    ol.Add(new ObjectParameter("InvoiceDateEnd", utility.GetDateCulture(InvoiceDateEnd)));
                }
                if (!string.IsNullOrEmpty(EmployeeName))
                {
                    if (dynStr.Length > 0)
                        dynStr += " And ";
                    dynStr += "(it.p_person.Family LIKE '%' + @EmployeeName + '%' or it.p_person.Name LIKE '%' + @EmployeeName + '%')";
                    ol.Add(new ObjectParameter("EmployeeName", EmployeeName));
                }
                if (!string.IsNullOrEmpty(shop))
                {
                    if (dynStr.Length > 0)
                        dynStr += " And ";
                    dynStr += "(it.inv_Shop.Name LIKE '%' + @shop + '%' or it.inv_Shop.Code LIKE '%' + @shop + '%')";
                    ol.Add(new ObjectParameter("shop", shop));
                }
                if (!string.IsNullOrEmpty(InvoiceNumber))
                {
                    if (dynStr.Length > 0)
                        dynStr += " AND ";

                    dynStr += "it.InvoiceNO = @InvoiceId";
                    ol.Add(new ObjectParameter("InvoiceId", InvoiceNumber));
                }
                if (!string.IsNullOrEmpty(Barcode))
                {
                    if (dynStr.Length > 0)
                        dynStr += " AND ";

                    dynStr += "(EXISTS(select g From it.ac_OrderDetail as g where(g.inv_ItemDetail.inv_Barcode.Barcode LIKE '%' + @Barcode + '%' or g.inv_ItemDetail.inv_Barcode.ItemCode LIKE '%' + @Barcode + '%' or g.inv_ItemDetail.inv_Barcode.Name LIKE '%' + @Barcode + '%')))";
                    ol.Add(new ObjectParameter("Barcode", Barcode));
                }
                if (PriceFrom != null)
                {
                    if (dynStr.Length > 0)
                        dynStr += " And ";
                    dynStr += " it.Amount >= @PriceFrom ";
                    ol.Add(new ObjectParameter("PriceFrom", PriceFrom.Value));
                }
                if (PriceTo != null)
                {
                    if (dynStr.Length > 0)
                        dynStr += " And ";
                    dynStr += " it.Amount <= @PriceTo ";
                    ol.Add(new ObjectParameter("PriceTo", PriceTo.Value));
                }
                var result = db.ac_OrderHeader.Where(dynStr, ol.ToArray());
                var results = result.OrderBy("it." + sort).Skip(skip).Take(take);
                decimal? sumDebtor = 0, sumCreditor = 0, sumPayment = 0, sumReceive = 0;
                if (results.Count() > 0)
                {
                    sumDebtor = result.Where(c => !c.Sell && c.IsMoney == false).Sum(a => (decimal?)a.Amount * a.ac_CurrencyRate.Buy);
                    sumCreditor = result.Where(c => c.Sell && c.IsMoney == false).Sum(a => (decimal?)a.Amount * a.ac_CurrencyRate.Buy);
                    balance = (sumCreditor != null ? sumCreditor : 0) - (sumDebtor != null ? sumDebtor : 0);
                    sumPayment = result.Where(c => !c.Sell && c.IsMoney == true).Sum(a => (decimal?)a.Amount * a.ac_CurrencyRate.Buy);
                    sumReceive = result.Where(c => c.Sell && c.IsMoney == true).Sum(a => (decimal?)a.Amount * a.ac_CurrencyRate.Buy);
                }
                return Json(new
                {
                    count = result.Count(),
                    sumDebtor,
                    sumCreditor,
                    balance,
                    sumPayment,
                    sumReceive,
                    results = results
                    .Select(b => new
                    {
                        //b.OrderTypeId,
                        b.OrderHeaderId,
                        // receiveVoucherCount = (int)b.ac_Voucher.Count,
                        b.InvoiceNO,
                        b.Date,
                        ShopName = b.inv_Shop.Name,
                        b.ShopId,
                        b.p_Person.Code,
                        isCustomer = (int?)b.p_Person.p_Customer.AccountId,
                        ClientName = b.p_Person.Name,
                        ClientFamily = b.p_Person.Family,
                        b.EmployeeId,
                        EmployeeName = b.p_Person.Name,
                        EmployeeFamily = b.p_Person.Family,
                        Amount = b.Amount * b.ac_CurrencyRate.Buy,
                        b.Sell,
                        b.ac_CurrencyRate.ac_Currency.Currency,
                        b.CounterId,
                        counterCode = (int?)b.ac_Counter.Code,
                        b.Description,
                        confirmerName = b.p_Employee.p_Person.Name,
                        confirmerFamily = b.p_Employee.p_Person.Family,
                        b.ConfirmerId,
                        b.ClientId,
                        clientCode = b.p_Person.p_Customer.p_Person.Code
                    }).AsEnumerable()
                    .Select(b => new
                    {
                        balance = getBalance((b.Sell ? -1 : 1) * b.Amount),
                        isOrder = true,
                        counterCode = b.counterCode == null ? "" : b.counterCode.ToString(),
                        id = b.OrderHeaderId,
                        b.InvoiceNO,
                        date = utility.GetstrDateCulture(b.Date),
                        // date = utility.GetstrDateCulture(b.Date),
                        shopName = b.ShopName,
                        amount = b.Amount,
                        isSell = !b.Sell,
                        PreOrder = b.ConfirmerId != null ? false : true,
                        currency = b.Currency,
                        employee = b.EmployeeName + " " + b.EmployeeFamily,
                        client = b.ClientName + " " + b.ClientFamily,
                        confirmer = b.confirmerName + " " + b.confirmerFamily,
                        b.ConfirmerId,
                        b.clientCode,
                        b.Description,
                        b.ClientId,
                        inOrderOf = b.Description,

                        //inOrderOf = (
                        //  b.cashCount > 0 && b.chequeCount == 0 && !b.Sell ? "پرداخت نقدی" :
                        //  b.cashCount > 0 && b.chequeCount > 0 && !b.Sell ? "پرداخت چک و نقدی" :
                        //  b.cashCount == 0 && b.chequeCount == 0 && b.receiveVoucherCount > 0 && !b.Sell ? "پرداخت کارت هدیه" :
                        //  b.cashCount == 0 && b.chequeCount > 0 && !b.Sell ? "پرداخت چک" :

                        //  b.cashCount > 0 && b.chequeCount == 0 && b.Sell ? "دریافت نقدی" :
                        //  b.cashCount > 0 && b.chequeCount > 0 && b.Sell ? "دریافت نقدی و چک" :
                        //  b.cashCount == 0 && b.chequeCount == 0 && b.sellVoucherCount > 0 && b.Sell ? "خرید کارت هدیه" :
                        //  b.cashCount == 0 && b.chequeCount > 0 && b.Sell ? "دریافت چک" :
                        //  b.orderDetailCount > 0 && b.Sell && b.isCustomer != null && b.ConfirmerId != null ? "خرید " :
                        //  b.orderDetailCount > 0 && b.Sell && b.isCustomer != null && b.ConfirmerId == null ? "پیش فاکتور " :
                        //  b.orderDetailCount > 0 && !b.Sell && b.isCustomer != null ? "مرجوعی از خرید  " : " " +
                        //  (b.Description != null ? b.Description.Trim() : "")),
                        //detail =b.OrderTypeId// (
                        //         b.cashCount > 0 || b.chequeCount > 0 ? "payment" :
                        //         (b.receiveVoucherCount > 0 || b.sellVoucherCount > 0) ? "voucher" :
                        //         b.orderDetailCount > 0 ? "order" : "")
                    })
                });

            }
            catch (Exception ex) { return Json(new { msg = ex.Message }); }
        }

        [Authorize]
        public ActionResult GetCurrentUserOnlineOrders(int skip, int take, bool first, string sort,
                                                string shop, string EmployeeName, string InvoiceDateStart, string InvoiceDateEnd,
                                                decimal? PriceFrom, decimal? PriceTo, string Barcode, string ProductName, string InvoiceNumber)
        {
            try
            {
                var currentCustomer = db.p_Customer.SingleOrDefault(c => c.Email == User.Identity.Name);
                List<ObjectParameter> ol = new List<ObjectParameter>();
                string dynStr = string.Empty;
                dynStr += "it.OrderHeaderId = it.ac_ReceiverDetails.OrderHeaderId and it.ClientId = @customerId ";
                ol.Add(new ObjectParameter("customerId", currentCustomer.AccountId));
                if (!string.IsNullOrEmpty(InvoiceDateStart))
                {
                    if (dynStr.Length > 0)
                        dynStr += " And ";
                    dynStr += " it.Date   >=   @InvoiceDateStart";
                    ol.Add(new ObjectParameter("InvoiceDateStart", utility.GetDateCulture(InvoiceDateStart)));
                }

                if (!string.IsNullOrEmpty(InvoiceDateEnd))
                {
                    if (dynStr.Length > 0)
                        dynStr += " And ";
                    dynStr += " it.Date   <=   @InvoiceDateEnd";
                    ol.Add(new ObjectParameter("InvoiceDateEnd", utility.GetDateCulture(InvoiceDateEnd)));
                }
                if (!string.IsNullOrEmpty(EmployeeName))
                {
                    if (dynStr.Length > 0)
                        dynStr += " And ";
                    dynStr += "(it.p_person.Family LIKE '%' + @EmployeeName + '%' or it.p_person.Name LIKE '%' + @EmployeeName + '%')";
                    ol.Add(new ObjectParameter("EmployeeName", EmployeeName));
                }
                if (!string.IsNullOrEmpty(shop))
                {
                    if (dynStr.Length > 0)
                        dynStr += " And ";
                    dynStr += "(it.inv_Shop.Name LIKE '%' + @shop + '%' or it.inv_Shop.Code LIKE '%' + @shop + '%')";
                    ol.Add(new ObjectParameter("shop", shop));
                }
                if (!string.IsNullOrEmpty(InvoiceNumber))
                {
                    if (dynStr.Length > 0)
                        dynStr += " AND ";

                    dynStr += "it.InvoiceNO = @InvoiceId";
                    ol.Add(new ObjectParameter("InvoiceId", InvoiceNumber));
                }
                if (!string.IsNullOrEmpty(Barcode))
                {
                    if (dynStr.Length > 0)
                        dynStr += " AND ";

                    dynStr += "(EXISTS(select g From it.ac_OrderDetail as g where(g.inv_ItemDetail.inv_Barcode.Barcode LIKE '%' + @Barcode + '%' or g.inv_ItemDetail.inv_Barcode.ItemCode LIKE '%' + @Barcode + '%' or g.inv_ItemDetail.inv_Barcode.Name LIKE '%' + @Barcode + '%')))";
                    ol.Add(new ObjectParameter("Barcode", Barcode));
                }
                if (PriceFrom != null)
                {
                    if (dynStr.Length > 0)
                        dynStr += " And ";
                    dynStr += " it.Amount >= @PriceFrom ";
                    ol.Add(new ObjectParameter("PriceFrom", PriceFrom.Value));
                }
                if (PriceTo != null)
                {
                    if (dynStr.Length > 0)
                        dynStr += " And ";
                    dynStr += " it.Amount <= @PriceTo ";
                    ol.Add(new ObjectParameter("PriceTo", PriceTo.Value));
                }
                var result = db.ac_OrderHeader.Where(dynStr, ol.ToArray());
                var results = result.OrderBy("it." + sort).Skip(skip).Take(take);
                decimal? sumDebtor = 0, sumCreditor = 0;
                if (results.Count() > 0)
                {
                    // DateTime dt = results.FirstOrDefault().Date;
                    sumCreditor = result.Where(c => !c.Sell).Sum(a => (decimal?)a.Amount * a.ac_CurrencyRate.Buy);
                    sumDebtor = result.Where(c => c.Sell).Sum(a => (decimal?)a.Amount * a.ac_CurrencyRate.Buy);
                    balance = sumCreditor - sumDebtor;
                }
                return Json(new
                {
                    count = result.Count(),
                    sumDebtor,
                    sumCreditor,
                    balance,
                    results = results
                    .Select(b => new
                    {
                        b.OrderHeaderId,
                        receiveVoucherCount = 0,// (int)b.ac_Voucher.Count,
                        b.InvoiceNO,
                        b.Date,
                        ShopName = b.inv_Shop.Name,
                        b.ShopId,
                        b.p_Person.Code,
                        isCustomer = (int?)b.p_Person.p_Customer.AccountId,
                        ClientName = b.p_Person.Name,
                        ClientFamily = b.p_Person.Family,
                        b.EmployeeId,
                        EmployeeName = b.p_Person.Name,
                        EmployeeFamily = b.p_Person.Family,
                        Amount = b.Amount * b.ac_CurrencyRate.Buy,
                        b.Sell,
                        b.ac_CurrencyRate.ac_Currency.Currency,
                        b.CounterId,
                        counterCode = (int?)b.ac_Counter.Code,
                        b.Description,
                        confirmerName = b.p_Employee.p_Person.Name,
                        confirmerFamily = b.p_Employee.p_Person.Family,
                        b.ConfirmerId,
                        b.ClientId,
                        clientCode = b.p_Person.p_Customer.p_Person.Code,
                        //b.OrderTypeId
                    }).AsEnumerable()
                    .Select(b => new
                    {
                        balance = getBalance((b.Sell ? -1 : 1) * b.Amount),
                        isOrder = true,
                        counterCode = b.counterCode == null ? "" : b.counterCode.ToString(),
                        id = b.OrderHeaderId,
                        b.InvoiceNO,
                        date = utility.GetstrDateCulture(b.Date),
                        // date = utility.GetstrDateCulture(b.Date),
                        shopName = b.ShopName,
                        amount = b.Amount,
                        isSell = !b.Sell,
                        PreOrder = b.ConfirmerId != null ? false : true,
                        currency = b.Currency,
                        employee = b.EmployeeName + " " + b.EmployeeFamily,
                        client = b.ClientName + " " + b.ClientFamily,
                        confirmer = b.confirmerName + " " + b.confirmerFamily,
                        b.ConfirmerId,
                        b.clientCode,
                        b.Description,
                        b.ClientId,
                        inOrderOf = b.Description,// (
                        //  b.cashCount > 0 && b.chequeCount == 0 && !b.Sell ? "پرداخت نقدی" :
                        //  b.cashCount > 0 && b.chequeCount > 0 && !b.Sell ? "پرداخت چک و نقدی" :
                        //  b.cashCount == 0 && b.chequeCount == 0 && b.receiveVoucherCount > 0 && !b.Sell ? "پرداخت کارت هدیه" :
                        //  b.cashCount == 0 && b.chequeCount > 0 && !b.Sell ? "پرداخت چک" :

                        //  b.cashCount > 0 && b.chequeCount == 0 && b.Sell ? "دریافت نقدی" :
                        //  b.cashCount > 0 && b.chequeCount > 0 && b.Sell ? "دریافت نقدی و چک" :
                        //  b.cashCount == 0 && b.chequeCount == 0 && b.sellVoucherCount > 0 && b.Sell ? "خرید کارت هدیه" :
                        //  b.cashCount == 0 && b.chequeCount > 0 && b.Sell ? "دریافت چک" :
                        //  b.orderDetailCount > 0 && b.Sell && b.isCustomer != null && b.ConfirmerId != null ? "خرید " :
                        //  b.orderDetailCount > 0 && b.Sell && b.isCustomer != null && b.ConfirmerId == null ? "پیش فاکتور " :
                        //  b.orderDetailCount > 0 && !b.Sell && b.isCustomer != null ? "مرجوعی از خرید  " : " " +
                        //  (b.Description != null ? b.Description.Trim() : "")),
                        //detail =b.OrderTypeId// (
                        //         b.cashCount > 0 || b.chequeCount > 0 ? "payment" :
                        //         (b.receiveVoucherCount > 0 || b.sellVoucherCount > 0) ? "voucher" :
                        //         b.orderDetailCount > 0 ? "order" : "")
                    })
                });

            }
            catch (Exception ex) { return Json(new { msg = ex.Message }); }
        }
        [Authorize]
        public ActionResult GetDetailPaymentList(int OrderHeaderId)
        {
            var xd = XDocument.Load(Server.MapPath("~/XmlData/BankTitle.xml")).Elements("root");
            var orderH = db.ac_OrderHeader.Where(oh => oh.OrderHeaderId == OrderHeaderId);
            return Json(new
            {
                dp = orderH.AsEnumerable().Select(oh => new
                    {
                        cash = oh.ac_AccountDetail.Select(csh => new
                        {
                            csh.ac_Cash.AccountDetailId,
                            csh.Amount,
                            csh.ac_Cash.Type,
                            csh.ac_Cash.ac_CurrencyRate.ac_Currency.Currency
                        }),
                        cheque = oh.ac_AccountDetail.Select(ch => new
                        {
                            ch.ac_Cheque.FirstOrDefault().AccountDetailId,
                            ch.Amount,
                            ch.ac_Cheque.FirstOrDefault().Bank,
                            ch.ac_Cheque.FirstOrDefault().Serial,
                            ch.ac_Cheque.FirstOrDefault().DueDate,
                            ch.ac_Cheque.FirstOrDefault().Passed,
                            ch.ac_Cheque.FirstOrDefault().ac_CurrencyRate.ac_Currency.Currency
                        }).AsEnumerable().Select(c => new
                       {
                           c.AccountDetailId,
                           c.Amount,
                           Bank = xd.Elements("Title").Single(d => d.Attribute("Id").Value == c.Bank).Attribute("Title").Value,
                           c.Serial,
                           Date = utility.GetstrDateCulture(c.DueDate),
                           Passed = c.Passed ? "پاس شده" : "پاس نشده",
                           c.Currency
                       })
                    })
            });
        }
        [Authorize]
        public ActionResult GetDetailInvoice(int id)
        {
            return Json(new
                {
                    d = db.ac_OrderDetail.Where(i => i.ac_AccountDetail.OrderHeaderId == id)
                   .Select(b => new
                   {
                       b.AccountDetailId,
                       b.ac_AccountDetail.ac_Account.inv_ItemDetail.BarcodeId,
                       b.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Barcode.Barcode,
                       b.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Barcode.Name,
                       b.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Barcode.ItemCode,
                       b.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Size,
                       b.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Color,
                       b.Quantity,
                       b.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Barcode.inv_MeasureUnit.UnitType,
                       Price = b.ac_AccountDetail.Amount,
                       b.Serial,
                       b.ac_AccountDetail.Description,
                       b.ac_AccountDetail.ac_OrderHeader.p_Employee.p_Person.ac_Account.aspnet_Applications.ApplicationName
                   }).AsEnumerable()
                   .Select(a => new
                   {
                       OrderDetailId = a.AccountDetailId,
                       a.BarcodeId,
                       a.Barcode,
                       a.Name,
                       a.ItemCode,
                       Color = (a.inv_Color.Count > 0 ? a.inv_Color.FirstOrDefault().Color : ""),
                       Size = (a.inv_Size.Count() > 0 ? a.inv_Size.FirstOrDefault().Size : ""),
                       a.Quantity,
                       a.UnitType,
                       a.Price,
                       a.Serial,
                       a.Description,
                       appName = a.ApplicationName
                   })
                });
        }
        [Authorize]
        public ActionResult GetOnlineDetailInvoice(int id)
        {
            var ordH = db.ac_OrderHeader.SingleOrDefault(oh => oh.OrderHeaderId == id);
            var rec = ordH.ac_ReceiverDetails;
            return Json(new
            {
                d = ordH.ac_AccountDetail.Where(a => a.ac_OrderDetail != null)
               .Select(b => new
               {
                   b.ac_OrderDetail.AccountDetailId,
                   b.ac_OrderDetail.ac_AccountDetail.ac_Account.inv_ItemDetail.BarcodeId,
                   b.ac_OrderDetail.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Barcode.Barcode,
                   b.ac_OrderDetail.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Barcode.Name,
                   b.ac_OrderDetail.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Barcode.ItemCode,
                   b.ac_OrderDetail.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Size,
                   b.ac_OrderDetail.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Color,
                   b.ac_OrderDetail.Quantity,
                   b.ac_OrderDetail.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Barcode.inv_MeasureUnit.UnitType,
                   Price = b.Amount,
                   b.ac_OrderDetail.Serial,
                   b.Description,
                   b.ac_OrderDetail.ac_AccountDetail.ac_Account.inv_ItemDetail.inv_Barcode.aspnet_Applications.ApplicationName
               }).AsEnumerable()
               .Select(a => new
               {
                   OrderDetailId = a.AccountDetailId,
                   a.BarcodeId,
                   a.Barcode,
                   a.Name,
                   a.ItemCode,
                   Color = (a.inv_Color.Count > 0 ? a.inv_Color.FirstOrDefault().Color : ""),
                   Size = (a.inv_Size.Count() > 0 ? a.inv_Size.FirstOrDefault().Size : ""),
                   a.Quantity,
                   a.UnitType,
                   a.Price,
                   a.Serial,
                   a.Description,
                   ApplicationName = a.ApplicationName
               }),
                receiverName = (rec.Name != null ? (rec.Name + " ") : "") +
                               (rec.Family != null ? rec.Family : ""),
                postType = rec.SendType == 1 ? "ارسال با پیک " : (rec.SendType == 2 ? " ارسال از طریق پست پیشتاز " : " ارسال از طریق پست تیپاکس "),
                dateTime = (rec.SendDate != null ? ("تاریخ " + utility.GetstrDateCultureSimple(rec.SendDate.Value)) : "") + (rec.SendTime != null ? (" ساعت " + rec.SendTime) : ""),
                isgiftDescription = (rec.IsGift == true ? ("هدیه است. " +
                                                          (!string.IsNullOrEmpty(rec.GiftNote) ? ("متن کارت هدیه ( " + rec.GiftNote + " ) ") : "") +
                                                          (rec.NeedWrap == true ? "کادو شود. " : "")) : "") +
                                    (!string.IsNullOrEmpty(rec.ac_OrderHeader.Description) ? rec.ac_OrderHeader.Description : ""),
                phoneMobile = (!string.IsNullOrEmpty(rec.Phone) ? ("تلفن " + rec.Phone + " ") : "") +
                              (!string.IsNullOrEmpty(rec.CellPhone) ? ("موبایل " + rec.CellPhone) : ""),
                paymentType = (rec.PaymentType == 1 ? "پرداخت آنلاین " : (rec.PaymentType == 2 ? "پرداخت به شماره کارت " : "پرداخت به پیک همزمان با تحویل کالا ")),
                receiverAddress = utility.getStrAddress(db.GetParentAddressById(rec.AddressID, "")) +
                                  (!string.IsNullOrEmpty(rec.Address) ? ("-> " + rec.Address) : "") +
                                  (!string.IsNullOrEmpty(rec.PostalCode) ? (" کد پستی " + rec.PostalCode) : ""),
                referenceId = rec.SaleReferenceId != null ? rec.SaleReferenceId.ToString() : ""
            });
        }
        [Authorize]
        //public ActionResult GetVoucherDetailsFullAccount(int orderHeaderId)
        //{
        //    if (!User.Identity.IsAuthenticated)
        //    {
        //        return Json(new { isExpired = true });
        //    }
        //    return Json(new
        //     {
        //         d = db.ac_Voucher.Where(v => v.OrderHeaderId == orderHeaderId || v.AccountId == orderHeaderId).Select(v => new
        //  {
        //      v.OrderHeaderId,
        //      v.Number,
        //      v.IsValid,
        //      v.ExpieryDate,
        //      v.Amount
        //  }).AsEnumerable().Select(v => new
        //  {
        //      v.OrderHeaderId,
        //      v.Number,
        //      IsValid = v.IsValid == true ? "معتبر" : "نامعتبر",
        //      ExpieryDate = utility.GetstrDateCultureSimple(v.ExpieryDate),
        //      v.Amount
        //  })
        //     });
        //}

        public ActionResult Result()
        {
            return View();
        }

        string getInvoiceNumber()
        {
            return (db.ac_OrderHeader.Count() > 0 ?
                  (new Random().Next(100000000, 990000000) + 1000 + DateTime.Now.Second).ToString() : "1001").ToString();
        }
        [Authorize]
        public ActionResult PayAmount(decimal payAmount)
        {
            ir.shaparak.bpm.PaymentGatewayImplService bpService = new ir.shaparak.bpm.PaymentGatewayImplService();
            DateTime dateTime = DateTime.Now;
            string result = "";
            decimal amount = payAmount * 10;
            string appName = Membership.ApplicationName;
            var appDetails = db.aspnet_Applications.Single(s => s.ApplicationName == appName).ApplicationDetail;

            result = bpService.bpPayRequest(
               appDetails.TerminalId.Value,
                    appDetails.PaymentUserName,
                    appDetails.PaymentPassword,
                Int64.Parse(getInvoiceNumber()),
                (long)amount,
                dateTime.Year.ToString() + dateTime.Month.ToString() + dateTime.Day.ToString(),
                dateTime.Hour.ToString() + dateTime.Minute.ToString() + dateTime.Second.ToString(),
                "سفارش",
                "http://shirazrose.com/Account/Payment",
                0);
            String[] resultArray = result.Split(',');
            if (resultArray[0] == "0")
            {

                ViewBag.Script = "<script language='javascript' type='text/javascript'> postRefId('" + resultArray[1] + "');</script> ";

                //string currentEmail = User.Identity.Name;
                //var customer = db.p_Customer.SingleOrDefault(c => c.Email == currentEmail);
                //if (customer != null)
                //{
                //    var customerCells = db.p_Person.Single(p => p.Code == customer.p_Person.Code).p_Phone.Where(p => p.Cell == true).Select(p => p.Number);
                //    RegisterModel model = new RegisterModel();
                //    foreach (var item in customerCells)
                //    {
                //        model.code = customer.p_Person.Code;
                //        if (customer.p_Person.AddressId != null)
                //            model.AddressStr = utility.getStrAddress(db.GetParentAddressById(customer.p_Person.AddressId.Value, "")) + "-> " + customer.Address;
                //        if (customer.p_Person.DateOfBirth != null)
                //        {
                //            DateTime birthdate = customer.p_Person.DateOfBirth.Value;
                //            string[] birthdateStr = utility.GetstrDateCultureSimple(birthdate).Split('/');
                //            model.BirthDay = birthdateStr[2];
                //            model.BirthMonth = birthdateStr[1];
                //            model.BirthYear = birthdateStr[0];
                //        }
                //        model.Email = customer.Email;
                //        model.Family = customer.p_Person.Family;
                //        model.Gender = customer.p_Person.Gender ? "آقای" : "خانم";
                //        model.Name = customer.p_Person.Name;
                //        List<string> moblst = new List<string>();
                //        List<string> phonelst = new List<string>();
                //        foreach (var mob in customer.p_Person.p_Phone.Where(p => p.Cell == true))
                //        {
                //            moblst.Add(mob.Number);

                //        }
                //        model.Mobilelist = moblst;
                //        foreach (var ph in customer.p_Person.p_Phone.Where(p => p.Cell == false))
                //        {
                //            phonelst.Add(ph.Number);
                //        }
                //        model.Phonelist = phonelst;
                //        int? jobId = (int?)Convert.ToInt32(customer.Job);
                //        string jobTitle = "";
                //        if (jobId != null && jobId > 0)
                //        {
                //            jobTitle = XDocument.Load(Server.MapPath("~/XmlData/jobTitle.xml")).Elements("root").Elements("Title").Single(d => d.Attribute("Id").Value == jobId.Value.ToString()).Attribute("Title").Value;
                //        }
                //        model.Combo = jobTitle;
                //        model.PostalCode = customer.PostalCode;

                //    }
                Session["amount"] = payAmount;
                //  paymentTest();
                return View();
                //}
                //return View("LogOn");
            }
            ViewBag.result = "پرداخت انجام نشد، لطفاً دوباره تلاش کنید.";
            return View("payment");
        }




        public static int getOrderType(MapiDBEntities db, int personId, bool isSell, bool isPayment, bool isTransfer, bool isExpense, bool isSocialSecurity, bool isSalary, bool isDeposit, bool isCorrection, bool isVoucher)
        {
            //if (isExpense && isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "expensePayment").OrderTypeId;
            //if (isExpense && !isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "expense").OrderTypeId;
            //if (isVoucher && isSell)
            //    return db.ac_OrderType.Single(s => s.OrderType == "voucherBuy").OrderTypeId;
            //if (isVoucher && !isSell)
            //    return db.ac_OrderType.Single(s => s.OrderType == "voucherReturn").OrderTypeId;
            //if (isSocialSecurity && isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "socialSecurityPayment").OrderTypeId;
            //if (isSocialSecurity && !isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "socialSecurity").OrderTypeId;
            //if (isSalary && isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "salaryPayment").OrderTypeId;
            //if (isSalary && !isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "salary").OrderTypeId;
            //if (isDeposit && isSell)
            //    return db.ac_OrderType.Single(s => s.OrderType == "withdraw").OrderTypeId;
            //if (isDeposit && !isSell)
            //    return db.ac_OrderType.Single(s => s.OrderType == "deposit").OrderTypeId;
            //if (isTransfer && isSell)
            //    return db.ac_OrderType.Single(s => s.OrderType == "transferFrom").OrderTypeId;
            //if (isTransfer && !isSell)
            //    return db.ac_OrderType.Single(s => s.OrderType == "transferTo").OrderTypeId;
            //if (isCorrection && isSell && !isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "correctionReturn").OrderTypeId;
            //if (isCorrection && !isSell && !isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "correction").OrderTypeId;
            //if (isCorrection && isSell && isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "correctionRefund").OrderTypeId;
            //if (isCorrection && !isSell && isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "correctionPayment").OrderTypeId;
            //bool isSupplier = db.p_Supplier.Any(s => s.PersonId == personId);
            //if (isSupplier && isSell && isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "supplierRefund").OrderTypeId;
            //if (!isSupplier && isSell && isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "customerRefund").OrderTypeId;
            //if (isSupplier && !isSell && isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "supplierPay").OrderTypeId;
            //if (isSupplier && isSell && !isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "supplierReturn").OrderTypeId;
            //if (!isSupplier && !isSell && isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "customerPay").OrderTypeId;
            //if (isSupplier && !isSell && !isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "supplierBuy").OrderTypeId;
            //if (!isSupplier && !isSell && !isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "customerReturn").OrderTypeId;
            //if (!isSupplier && isSell && !isPayment)
            //    return db.ac_OrderType.Single(s => s.OrderType == "customerBuy").OrderTypeId;
            //else
            return 0;
        }


        public ActionResult payment(string RefId, string ResCode, long saleOrderId, long SaleReferenceId)
        {
            decimal amount = Session["amount"] != null ? Convert.ToDecimal(Session["amount"]) : 0;
            ViewBag.RefId = RefId;
            ViewBag.ResCode = ResCode;
            ViewBag.SaleOrderId = saleOrderId;
            ViewBag.SaleReferenceId = SaleReferenceId;
            string result;
            int save = 0;
            var currCustomer = db.aspnet_Membership.SingleOrDefault(m => m.aspnet_Users.UserName == User.Identity.Name).p_Customer.FirstOrDefault();
            ir.shaparak.bpm.PaymentGatewayImplService bpService = new ir.shaparak.bpm.PaymentGatewayImplService();
            string appName = Membership.ApplicationName;
            var appDetails = db.aspnet_Applications.Single(s => s.ApplicationName == appName).ApplicationDetail;
            try
            {

                utility.BypassCertificateError();
                result = bpService.bpVerifyRequest(
                    appDetails.TerminalId.Value,
                    appDetails.PaymentUserName,
                    appDetails.PaymentPassword,
                    saleOrderId,
                    saleOrderId,
                    SaleReferenceId);
                if (result.Split(',')[0] != "0")
                {
                    utility.BypassCertificateError();
                    result = bpService.bpInquiryRequest(
                    appDetails.TerminalId.Value,
                    appDetails.PaymentUserName,
                    appDetails.PaymentPassword,
                    saleOrderId,
                    saleOrderId,
                    SaleReferenceId);
                }
                if (result.Split(',')[0] == "0")
                {
                    string settle = bpService.bpSettleRequest(
                     appDetails.TerminalId.Value,
                    appDetails.PaymentUserName,
                    appDetails.PaymentPassword,
                   saleOrderId,
                   saleOrderId,
                   SaleReferenceId);
                    if (Int32.Parse(settle) == 0)
                    {
                        ac_OrderHeader ordh = new ac_OrderHeader();
                        ordh.FiscalPeriodId = appDetails.CurrentFiscalPeriodId;
                        ac_Cash cash = new ac_Cash();
                        int currencyRateId = db.ac_Currency.Where(c => c.Currency == "تومان").FirstOrDefault().ac_CurrencyRate.OrderByDescending(c => c.Date).FirstOrDefault().CurrencyRateId;
                        ordh.Amount = amount;
                        ordh.ClientId = currCustomer.AccountId;
                        ordh.EmployeeId = appDetails.EmployeeId.Value;
                        ordh.ShopId = appDetails.ac_Counter.ShopId;
                        ordh.Date = DateTime.Now;
                        ordh.IsMoney = true;
                        ordh.Sell = false;
                        ordh.ConfirmerId = appDetails.EmployeeId.Value;
                        ordh.CounterId = appDetails.CounterId;
                        ordh.Table = "payment";
                        ordh.Description = "receiveCashFrom";
                        ordh.CurrencyRateId = currencyRateId;
                        var r = db.ac_OrderHeader.OrderByDescending(d => d.Date).Where(i => i.InvoiceNO.Contains("DO-"));
                        string invoiceNo = "DO-" + (r.Count() > 0 ? (Convert.ToInt32(r.FirstOrDefault().InvoiceNO.Split('-')[1]) + 1).ToString() : "1");
                        ordh.InvoiceNO = invoiceNo;
                        //ordh.OrderTypeId = getOrderType(db, currCustomer.AccountId, false, true, false, false, false, false, false, false, false);
                        cash.CurrencyRateId = currencyRateId;
                        //cash.Amount = ordh.Amount;
                        cash.Type = "online";

                        ac_AccountDetail accountDetailEmp = new ac_AccountDetail();
                        accountDetailEmp.AccountId = currCustomer.AccountId;
                        accountDetailEmp.ac_Cash = cash;
                        accountDetailEmp.IsDept = false;
                        accountDetailEmp.Amount = amount;

                        ac_AccountDetail accountDetailCo = new ac_AccountDetail();
                        accountDetailCo.AccountId = appDetails.CounterId;
                        accountDetailCo.ac_Cash = cash;
                        accountDetailCo.Amount = amount;
                        accountDetailEmp.IsDept = true;


                        ordh.ac_AccountDetail.Add(accountDetailEmp);
                        ordh.ac_AccountDetail.Add(accountDetailCo);
                        db.ac_OrderHeader.AddObject(ordh);
                        save = db.SaveChanges();
                        if (save > 0)
                            ViewBag.result = "پرداخت با موفقیت انجام شد شماره پیگیری: " + RefId + ".";
                        else
                            ViewBag.result = "پرداخت انجام نشد، لطفاً دوباره تلاش کنید.";
                        return View("payment");
                    }
                    else
                    {
                        ViewBag.result = "پرداخت انجام نشد، لطفاً دوباره تلاش کنید.";
                        return View("payment");
                    }

                }
                else
                {
                    result = bpService.bpReversalRequest(appDetails.TerminalId.Value,
                    appDetails.PaymentUserName,
                    appDetails.PaymentPassword,
                    saleOrderId,
                    saleOrderId,
                    SaleReferenceId
                    );
                    ViewBag.result = "پرداخت انجام نشد، لطفاً دوباره تلاش کنید.";
                    return View("payment");
                }
            }
            catch (Exception exp)
            {
                result = bpService.bpReversalRequest(appDetails.TerminalId.Value,
                    appDetails.PaymentUserName,
                    appDetails.PaymentPassword,
                   saleOrderId,
                   saleOrderId,
                   SaleReferenceId
                   );
                if (exp.InnerException != null)
                    ViewBag.result = exp.InnerException.Message;
                else
                    ViewBag.result = exp.Message;
                return View("payment");
            }
        }


        [Authorize]
        public ActionResult MyAccount()
        {
            return View();
        }

        [Authorize]
        public ActionResult OrderList()
        {
            string username = User.Identity.Name;
            return View(db.ac_OrderHeader.Where(s => s.p_Person.p_Customer.aspnet_Membership.aspnet_Users.UserName == username));
        }

        [Authorize]
        public ActionResult UserInfo()
        {
            if (User.Identity.IsAuthenticated)
            {
                string currentEmail = User.Identity.Name;
                var customer = db.p_Customer.FirstOrDefault(p => p.aspnet_Membership.aspnet_Users.UserName == currentEmail);
                var options = new List<SelectListItem> { 
                                                new SelectListItem { Text="انتخاب", Value="" }, 
                                                new SelectListItem { Text="زن", Value="False" }, 
                                                new SelectListItem { Text= "مرد", Value= "True" } 
                                                };
                ViewBag.Gender = new SelectList(options, "Value", "Text", customer.p_Person.Gender);

                if (customer != null)
                {
                    var customerCells = db.p_Person.Single(p => p.Code == customer.p_Person.Code).p_Phone.Where(p => p.Cell == true).Select(p => p.Number);

                    RegisterModel model = new RegisterModel();
                    model.code = customer.p_Person.Code;
                    if (customer.p_Person.AddressId != null)
                        model.AddressStr = utility.getStrAddress(db.GetParentAddressById(customer.p_Person.AddressId.Value, "")) + "-> " + customer.Address;
                    string bDay = "";
                    string bMonth = "";
                    string bYear = "";
                    if (customer.p_Person.DateOfBirth != null)
                    {
                        DateTime birthdate = customer.p_Person.DateOfBirth.Value;
                        string[] birthdateStr = utility.GetstrDateCultureSimple(birthdate).Split('/');
                        bDay = birthdateStr[1];
                        bMonth = birthdateStr[1];
                        bYear = birthdateStr[1];
                    }
                    var days = new List<SelectListItem> { 
                                                new SelectListItem { Text="انتخاب", Value="" }, 
                                                new SelectListItem { Text=" 1 ", Value="1" }, 
                                                new SelectListItem { Text=" 2 ", Value="2" }, 
                                                new SelectListItem { Text=" 3 ", Value="3" }, 
                                                new SelectListItem { Text=" 4 ", Value="4" }, 
                                                new SelectListItem { Text=" 5 ", Value="5" }, 
                                                new SelectListItem { Text=" 6 ", Value="6" }, 
                                                new SelectListItem { Text=" 7 ", Value="7" }, 
                                                new SelectListItem { Text=" 8 ", Value="8" }, 
                                                new SelectListItem { Text=" 9 ", Value="9" }, 
                                                new SelectListItem { Text=" 10 ", Value="10" }, 
                                                new SelectListItem { Text=" 11 ", Value="11" }, 
                                                new SelectListItem { Text=" 12 ", Value="12" }, 
                                                new SelectListItem { Text=" 13 ", Value="13" }, 
                                                new SelectListItem { Text=" 14 ", Value="14" }, 
                                                new SelectListItem { Text=" 15 ", Value="15" }, 
                                                new SelectListItem { Text=" 16 ", Value="16" }, 
                                                new SelectListItem { Text=" 17 ", Value="17" }, 
                                                new SelectListItem { Text=" 18 ", Value="18" }, 
                                                new SelectListItem { Text=" 19 ", Value="19" }, 
                                                new SelectListItem { Text=" 20 ", Value="20" }, 
                                                new SelectListItem { Text=" 21 ", Value="21" }, 
                                                new SelectListItem { Text=" 22 ", Value="22" }, 
                                                new SelectListItem { Text=" 23 ", Value="23" }, 
                                                new SelectListItem { Text=" 24 ", Value="24" }, 
                                                new SelectListItem { Text=" 25 ", Value="25" }, 
                                                new SelectListItem { Text=" 26 ", Value="26" }, 
                                                new SelectListItem { Text=" 27 ", Value="27" }, 
                                                new SelectListItem { Text=" 28 ", Value="28" }, 
                                                new SelectListItem { Text= " 29 ", Value= "29" } ,
                                                new SelectListItem { Text=" 30 ", Value="30" }, 
                                                new SelectListItem { Text= " 31 ", Value= "31" } 
                                                };
                    ViewBag.BirthDay = new SelectList(days, "Value", "Text", bDay);
                    var months = new List<SelectListItem> { 
                                                 new SelectListItem { Value=" 1" ,Text="فروردین" },
                                        new SelectListItem { Value="2" ,Text="اردیبهشت" },
                                        new SelectListItem { Value="3",Text="خرداد" },
                                        new SelectListItem { Value="4",Text="تیر" },
                                        new SelectListItem { Value="5",Text="مرداد" },
                                        new SelectListItem { Value="6",Text="شهریور" },
                                        new SelectListItem { Value="7",Text="مهر" },
                                        new SelectListItem { Value="8",Text="آبان" },
                                        new SelectListItem { Value="9",Text="آذر" },
                                        new SelectListItem { Value="10",Text="دی" },
                                        new SelectListItem { Value="11",Text="بهمن" },
                                        new SelectListItem { Value="12",Text="اسفند" }
                                                };
                    ViewBag.BirthMonth = new SelectList(months, "Value", "Text", bMonth);
                    var years = new List<
                    SelectListItem>{
                                        new SelectListItem { Value="1394",Text="1394"},
                                        new SelectListItem { Value="1393",Text="1393"},
                                        new SelectListItem { Value="1392",Text="1392"},
                                        new SelectListItem { Value="1391",Text="1391"},
                                        new SelectListItem { Value="1390",Text="1390"},
                                        new SelectListItem { Value="1389",Text="1389"},
                                        new SelectListItem { Value="1387",Text="1387"},
                                        new SelectListItem { Value="1386",Text="1386"},
                                        new SelectListItem { Value="1385",Text="1385"},
                                        new SelectListItem { Value="1384",Text="1384"},
                                        new SelectListItem { Value="1383",Text="1383"},
                                        new SelectListItem { Value="1382",Text="1382"},
                                        new SelectListItem { Value="1381",Text="1381"},
                                        new SelectListItem { Value="1380",Text="1380"},
                                        new SelectListItem { Value="1379",Text="1379"},
                                        new SelectListItem { Value="1378",Text="1378"},
                                        new SelectListItem { Value="1377",Text="1377"},
                                        new SelectListItem { Value="1376",Text="1376"},
                                        new SelectListItem { Value="1375",Text="1375"},
                                        new SelectListItem { Value="1374",Text="1374"},
                                        new SelectListItem { Value="1373",Text="1373"},
                                        new SelectListItem { Value="1372",Text="1372"},
                                        new SelectListItem { Value="1371",Text="1371"},
                                        new SelectListItem { Value="1370",Text="1370"},
                                        new SelectListItem { Value="1369",Text="1369"},
                                        new SelectListItem { Value="1368",Text="1368"},
                                        new SelectListItem { Value="1367",Text="1367"},
                                        new SelectListItem { Value="1366",Text="1366"},
                                        new SelectListItem { Value="1365",Text="1365"},
                                        new SelectListItem { Value="1364",Text="1364"},
                                        new SelectListItem { Value="1363",Text="1363"},
                                        new SelectListItem { Value="1362",Text="1362"},
                                        new SelectListItem { Value="1361",Text="1361"},
                                        new SelectListItem { Value="1360",Text="1360"},
                                        new SelectListItem { Value="1359",Text="1359"},
                                        new SelectListItem { Value="1358",Text="1358"},
                                        new SelectListItem { Value="1357",Text="1357"},
                                        new SelectListItem { Value="1356",Text="1356"},
                                        new SelectListItem { Value="1355",Text="1355"},
                                        new SelectListItem { Value="1354",Text="1354"},
                                        new SelectListItem { Value="1353",Text="1353"},
                                        new SelectListItem { Value="1352",Text="1352"},
                                        new SelectListItem { Value="1351",Text="1351"},
                                        new SelectListItem { Value="1350",Text="1350"},
                                        new SelectListItem { Value="1349",Text="1349"},
                                        new SelectListItem { Value="1348",Text="1348"},
                                        new SelectListItem { Value="1347",Text="1347"},
                                        new SelectListItem { Value="1346",Text="1346"},
                                        new SelectListItem { Value="1345",Text="1345"},
                                        new SelectListItem { Value="1344",Text="1344"},
                                        new SelectListItem { Value="1343",Text="1343"},
                                        new SelectListItem { Value="1342",Text="1342"},
                                        new SelectListItem { Value="1341",Text="1341"},
                                        new SelectListItem { Value="1340",Text="1340"},
                                        new SelectListItem { Value="1339",Text="1339"},
                                        new SelectListItem { Value="1338",Text="1338"},
                                        new SelectListItem { Value="1337",Text="1337"},
                                        new SelectListItem { Value="1336",Text="1336"},
                                        new SelectListItem { Value="1335",Text="1335"},
                                        new SelectListItem { Value="1334",Text="1334"},
                                        new SelectListItem { Value="1333",Text="1333"},
                                        new SelectListItem { Value="1332",Text="1332"},
                                        new SelectListItem { Value="1331",Text="1331"},
                                        new SelectListItem { Value="1330",Text="1330"},
                                        new SelectListItem { Value="1329",Text="1329"},
                                        new SelectListItem { Value="1328",Text="1328"},
                                        new SelectListItem { Value="1327",Text="1327"},
                                        new SelectListItem { Value="1326",Text="1326"},
                                        new SelectListItem { Value="1325",Text="1325"},
                                        new SelectListItem { Value="1324",Text="1324"},
                                        new SelectListItem { Value="1323",Text="1323"},
                                        new SelectListItem { Value="1322",Text="1322"},
                                        new SelectListItem { Value="1321",Text="1321"},
                                        new SelectListItem { Value="1320",Text="1920"},
                                                };
                    ViewBag.BirthYear = new SelectList(years, "Value", "Text", bYear);
                    model.Family = customer.p_Person.Family;
                    model.Name = customer.p_Person.Name;
                    model.email = customer.aspnet_Membership.Email;
                    model.Mobile = customer.p_Person.p_Phone.Where(c => c.Cell).OrderByDescending(o => o.PhoneId).FirstOrDefault() != null ? customer.p_Person.p_Phone.Where(c => c.Cell).OrderByDescending(o => o.PhoneId).FirstOrDefault().Number : "";
                    model.Phone = customer.p_Person.p_Phone.Where(c => !c.Cell).OrderByDescending(o => o.PhoneId).FirstOrDefault() != null ? customer.p_Person.p_Phone.Where(c => c.Cell).OrderByDescending(o => o.PhoneId).FirstOrDefault().Number : "";


                    //model.Mobile.Number = customer.p_Person.p_Phone.FirstOrDefault(p => p.Cell).Number;
                    //model.Phone.Number = customer.p_Person.p_Phone.FirstOrDefault(p => !p.Cell).Number;
                    return View(model);

                }
                return View();
            }
            return LogOn();
        }

        [HttpPost]
        public ActionResult Subscribe(string Email)
        {
            string appName = Membership.ApplicationName;
            MapiDBEntities db = new MapiDBEntities();
            p_Person Person = new p_Person();
            try
            {
                if (!db.p_Customer.Any(e => e.Email == Email))
                {


                    System.Threading.Thread ls = new System.Threading.Thread(utility.SubscribeUser);
                    object[] lsParameters = new object[] { utility.GetUserIP(), Server.MapPath("~/Data/Subscriber.xml"), Request.Browser.Type, Email };
                    ls.Start(lsParameters);


                    var appDetails = db.aspnet_Applications.Single(a => a.ApplicationName == appName).ApplicationDetail;
                    System.Threading.Thread t = new System.Threading.Thread(AccountController.sendEmail);
                    object[] parameters = new object[] { Email, "اطلاعات کاربری در فروشگاه شیراز رز ", 
                        "<div id='yui_3_2_0_1_131658669409891' style='width: 400px; margin: 20px auto; direction: rtl; font: 8pt/22px tahoma; border: 3px double rgb(40, 128, 192);'><div id='yui_3_2_0_1_131658669409888' style='direction: rtl; padding-right: 12px;'>اطلاعات کاربری شما در سایت  به شرح زیر می باشد :</div><div style='width: 350px; margin: 10px auto; direction: rtl; font: 8pt/22px tahoma; border: 1px solid rgb(40, 128, 192);'><div style='padding-right: 20px;'>کد اشتراک : " + Person.Code + "</div><div style='padding-right: 20px;'>آدرس الکترونیک : " +Email + "</div></div><blockquote>با آروزی روزگار خوش برای شما<div style='text-align: left;'><a rel='nofollow' style='text-decoration: none; color: blue;' target='_blank' href='http://shirazrose.com'>shirazrose.com</a></div></blockquote></div>",
                     appDetails.Email,
                     appDetails.EmailPass,
                     appDetails.Port,
                     appDetails.Host};
                    t.Start(parameters);
                    //sms.Send(mobilesArr[0], "کد اشتراک شما جهت سفارش تلفنی : " + Person.Code + "\n shirazrose.com");


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
                    return Json(new { msg = "ایمیل شما در فروشگاه شیراز رز ثبت شد.", isdone = true });
                }
                else
                {
                    return Json(new { msg = "کاربری با این ایمیل قبلاً ثبت نام شده است، لطفاً ایمیل دیگری وارد کنید.", logged = false });
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

        }


    }

    public class sms
    {
        public static void Send(string Mobiles, string message)
        {
            MapiDBEntities db = new MapiDBEntities();
            var currApp = db.ApplicationDetails.FirstOrDefault(a => a.aspnet_Applications.ApplicationName == Membership.ApplicationName);
            ir.afe.www.BoxService ibs = new ir.afe.www.BoxService();
            string[] r = ibs.SendMessage(currApp.SmsUser, currApp.SmsPass, currApp.SmsNumber.ToString(), new string[] { Mobiles }, message, "1", new long?[] { Int64.Parse(Mobiles) + new Random().Next(1000, 9000) });
        }
    }





}
