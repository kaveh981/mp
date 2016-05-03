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
namespace MapiOnline.Controllers
{
    public class TshopController : BaseController
    {
        //
        // GET: /Tshop/
        MapiDBEntities db = new MapiDBEntities();
        string appName = Membership.ApplicationName;
        public ActionResult Index()
        {
            return View();
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
                    return Json(new { isdone = false });
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
                                Session["shoppingCartId"] = null;
                        }
                    }
                    if (authenticate)
                        return Json(new { isdone = true });

                    else
                    {
                        ViewBag.result = "شما وارد سایت نشده اید، لطفاً دوباره تلاش کنید.";
                        return Json(new { isdone = false });

                    }
                }
                else
                {
                    ViewBag.result = "ایمیل یا رمز عبور اشتباه است.";
                    return Json(new { isdone = false });

                }
            }


            catch (Exception ex)
            {
                ViewBag.result = ex.Message;
                return Json(new { isdone = false });

            }
        }

        public ActionResult LogOff()
        {
            try
            {
                FormsAuthentication.SignOut();
                return Json(new { isdone = true });
            }
            catch (Exception ex)
            {
                ViewBag.result = ex.Message;
                return Json(new { isdone = false });

            }
        }



        public ActionResult CheckOut_step1()
        {
            if (Session["orderHeaderId"] != null)
            {
                int orderHeaderId = Convert.ToInt32(Session["orderHeaderId"]);
                var orderHeader = db.ac_OrderHeader.SingleOrDefault(o => o.OrderHeaderId == orderHeaderId);
                RegisterModel model = new RegisterModel();
                model.code = orderHeader.p_Person.Code;
                model.AddressId = Convert.ToInt32(orderHeader.p_Person.AddressId);
                model.State = orderHeader.p_Person.p_Address.ParentAddressId.Value;
                model.Address = orderHeader.p_Person.p_Address.Address;
                model.Gender = orderHeader.p_Person.Gender.ToString();
                model.AddressStr = orderHeader.p_Person.p_Customer.Address;
                if (orderHeader.p_Person.DateOfBirth != null)
                {
                    DateTime birthdate = orderHeader.p_Person.DateOfBirth.Value;
                    string[] birthdateStr = utility.GetstrDateCultureSimple(birthdate).Split('/');
                    model.BirthDay = birthdateStr[2];
                    model.BirthMonth = birthdateStr[1];
                    model.BirthYear = birthdateStr[0];
                }
                model.email = orderHeader.p_Person.p_Customer.Email;
                model.Family = orderHeader.p_Person.Family;
                var options = new List<SelectListItem> { 
                                                new SelectListItem { Text="انتخاب", Value="" }, 
                                                new SelectListItem { Text="زن", Value="False" }, 
                                                new SelectListItem { Text= "مرد", Value= "True" } 
                                                };
                ViewBag.Gender = new SelectList(options, "Value", "Text", orderHeader.p_Person.Gender.ToString());
                model.Gender = orderHeader.p_Person.Gender.ToString();
                model.Name = orderHeader.p_Person.Name;
                List<string> moblst = new List<string>();
                List<string> phonelst = new List<string>();
                var mobs = orderHeader.p_Person.p_Phone.Where(p => p.Cell == true);
                foreach (var mob in mobs)
                {
                    moblst.Add(mob.Number);
                }
                model.Mobilelist = moblst;
                model.Mobile = mobs.Count() > 0 ? mobs.FirstOrDefault().Number : "";
                foreach (var ph in orderHeader.p_Person.p_Phone.Where(p => p.Cell == false))
                {
                    phonelst.Add(ph.Number);
                }
                model.Phonelist = phonelst;
                model.Phone = phonelst.Count() > 0 ? phonelst.First() : "";
                model.Combo = !string.IsNullOrEmpty(orderHeader.p_Person.p_Customer.Job) ? orderHeader.p_Person.p_Customer.Job : " ";
                model.PostalCode = orderHeader.p_Person.p_Customer.PostalCode;
                ViewBag.StateId = new SelectList(db.p_Address.Where(p => p.ParentAddressId == 1), "AddressId", "Address", orderHeader.p_Person.p_Address.ParentAddressId.Value);
                ViewBag.AddressId = new SelectList(db.p_Address, "AddressId", "Address", orderHeader.p_Person.AddressId);
                return View(model);
            }

            int shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
            var shoppingCart = db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId);
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
                        RegisterModel model = new RegisterModel();
                        model.code = customer.p_Person.Code;
                        model.AddressId = Convert.ToInt32(customer.p_Person.AddressId);
                        model.State = (customer.p_Person.p_Address != null && customer.p_Person.p_Address.ParentAddressId != null) ? customer.p_Person.p_Address.ParentAddressId.Value : 0;
                        model.Address = customer.p_Person.p_Address != null ? customer.p_Person.p_Address.Address : "";
                        model.Gender = customer.p_Person.Gender.ToString();
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
                                                new SelectListItem { Text="زن", Value="False" }, 
                                                new SelectListItem { Text= "مرد", Value= "True" } 
                                                };
                        ViewBag.Gender = new SelectList(options, "Value", "Text", customer.p_Person.Gender.ToString());
                        model.Gender = customer.p_Person.Gender.ToString();
                        model.Name = customer.p_Person.Name;
                        List<string> moblst = new List<string>();
                        List<string> phonelst = new List<string>();
                        foreach (var mob in mobs)
                        {
                            moblst.Add(mob.Number);
                        }
                        model.Mobilelist = moblst;
                        model.Mobile = mobs.Count() > 0 ? mobs.FirstOrDefault().Number : "";
                        foreach (var ph in customer.p_Person.p_Phone.Where(p => p.Cell == false))
                        {
                            phonelst.Add(ph.Number);
                        }
                        model.Phonelist = phonelst;
                        model.Phone = phonelst.Count() > 0 ? phonelst.First() : "";
                        model.Combo = !string.IsNullOrEmpty(customer.Job) ? customer.Job : " ";
                        model.PostalCode = customer.PostalCode;
                        ViewBag.StateId = new SelectList(db.p_Address.Where(p => p.ParentAddressId == 1), "AddressId", "Address", (customer.p_Person.p_Address != null && customer.p_Person.p_Address.ParentAddressId != null) ? (int?)customer.p_Person.p_Address.ParentAddressId.Value : null);
                        ViewBag.AddressId = new SelectList(db.p_Address, "AddressId", "Address", customer.p_Person.AddressId==null?3:customer.p_Person.AddressId);
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
                        ViewBag.AddressId = new SelectList(db.p_Address.Where(p => p.ParentAddressId == 2), "AddressId", "Address");
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
                    ViewBag.AddressId = new SelectList(db.p_Address.Where(p => p.ParentAddressId == 2), "AddressId", "Address", 3);
                    return View();

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
        public ActionResult CheckOut_step1(RegisterModel Model)
        {
            try
            {
                int shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                var app = db.aspnet_Applications.FirstOrDefault(a => a.ApplicationName == appName);
                if (Session["orderHeaderId"] != null)
                {
                    int orderHeaderId = Convert.ToInt32(Session["orderHeaderId"]);
                    var orderHeader = db.ac_OrderHeader.SingleOrDefault(o => o.OrderHeaderId == orderHeaderId);
                    orderHeader.p_Person.Name = Model.Name;
                    orderHeader.p_Person.Family = Model.Family;
                    orderHeader.p_Person.AddressId = Model.AddressId;
                    orderHeader.p_Person.p_Customer.Address = Model.AddressStr;
                    orderHeader.p_Person.p_Customer.Email = Model.email;
                    if (!string.IsNullOrEmpty(Model.Gender))
                        orderHeader.p_Person.Gender = bool.Parse(Model.Gender);
                    var mob = orderHeader.p_Person.p_Phone.SingleOrDefault(p => p.Number == Model.Mobile);
                    if (mob == null)
                        orderHeader.p_Person.p_Phone.Add(new p_Phone { Number = Model.Mobile, Cell = true });
                    var phone = orderHeader.p_Person.p_Phone.SingleOrDefault(p => p.Number == Model.Phone);
                    if (Model.Phone != null)
                    {
                        if (phone == null)
                            orderHeader.p_Person.p_Phone.Add(new p_Phone { Number = Model.Phone, Cell = false });
                    }
                    orderHeader.p_Person.p_Customer.PostalCode = Model.PostalCode;
                }
                else if (User.Identity.IsAuthenticated)
                {
                    var userName = User.Identity.Name;
                    var per = db.aspnet_Membership.FirstOrDefault(m => m.aspnet_Users.UserName == userName).p_Customer.FirstOrDefault().p_Person;
                    int paccountId = per.AccountId;
                    shoppingCartId = db.ac_ShoppingCart.FirstOrDefault(s => s.CustomerId == paccountId).ShoppingCartId;
                    per.Name = Model.Name;
                    per.Family = Model.Family;
                    per.AddressId = Model.AddressId;
                    per.p_Customer.Address = Model.AddressStr;
                    per.p_Customer.Email = Model.email;
                    if (!string.IsNullOrEmpty(Model.Gender))
                        per.Gender = bool.Parse(Model.Gender);
                    var mob = per.p_Phone.FirstOrDefault(p => p.Number == Model.Mobile);
                    if (mob == null)
                        per.p_Phone.Add(new p_Phone { Number = Model.Mobile, Cell = true });
                    if (Model.Phone != null)
                    {
                        var phone = per.p_Phone.FirstOrDefault(p => p.Number == Model.Phone);
                        if (phone == null)
                            per.p_Phone.Add(new p_Phone { Number = Model.Phone, Cell = false });
                    }
                    per.p_Customer.PostalCode = Model.PostalCode;
                    db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId).p_Customer = per.p_Customer;
                }
                else
                {
                    var oldperson = db.p_Customer.FirstOrDefault(p => p.p_Person.aspnet_Applications.ApplicationName == appName && p.p_Person.p_Phone.Any(h => (h.Cell == true && h.Number == Model.Mobile) || p.Email == Model.email));// db.p_Phone.Where(p => p.p_Person.p_Customer.AccountId == p.p_Person.AccountId && p.p_Person.aspnet_Applications.ApplicationName == appName && p.Cell == true && p.Number == mobileNumber);
                    if (oldperson == null)
                    {
                        p_Person per = new p_Person();
                        p_Customer cu = new p_Customer();
                        var pcode = db.p_Person.Where(p => p.AccountId == p.p_Customer.AccountId);
                        var co = pcode.Count() > 0 ? pcode.OrderByDescending(c => c.AccountId).Select(c => c.Code).First() : "9998";
                        co = co.Replace("c", "");
                        co = "c" + (int.Parse(co) + 2).ToString();
                        per.Code = co;
                        per.Name = Model.Name;
                        per.Family = Model.Family;
                        per.AddressId = Model.AddressId;
                        per.RegDate = DateTime.Now;
                        if (!string.IsNullOrEmpty(Model.Gender))
                            per.Gender = bool.Parse(Model.Gender);
                        cu.Address = Model.AddressStr;
                        cu.Email = Model.email;
                        per.p_Phone.Add(new p_Phone { Number = Model.Mobile, Cell = true });
                        if (!string.IsNullOrEmpty(Model.Phone))
                            per.p_Phone.Add(new p_Phone { Number = Model.Phone, Cell = false });
                        cu.PostalCode = Model.PostalCode;
                        per.ApplicationId = app.ApplicationId;
                        per.p_Customer = cu;
                        db.p_Person.AddObject(per);
                        var tableAccount = db.ac_TableAccount.Single(a => a.Table == "customer" && a.aspnet_Applications.ApplicationName == appName);
                        var parentAccount = db.ac_Account.Single(a => a.AccountId == tableAccount.AccountId);

                        ac_Account account = new ac_Account()
                        {
                            AccountNature = parentAccount.AccountNature,
                            Code = utility.FindAccountCodeByParentId(tableAccount.AccountId) + 1,
                            GroupType = parentAccount.GroupType,
                            //Level = Convert.ToByte(parentAccount.Level + 1),
                            Level = 3,
                            Name = Model.Family + " " + Model.Name + " " + co,
                            ParentAccountId = tableAccount.AccountId,
                            ApplicationId = app.ApplicationId,
                            RegistererId = app.ApplicationDetail.EmployeeId,
                            LedgentId = (new MapiOnline.Controllers.ManagementController()).findLedgentAccId(tableAccount.AccountId)
                        };
                        per.ac_Account = account;
                        per.ac_Account.aspnet_Applications = app;
                        per.ac_Account.RegistererId = app.ApplicationDetail.EmployeeId;
                        db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId).p_Customer = per.p_Customer;

                    }
                    else
                    {
                        oldperson.p_Person.Name = Model.Name;
                        oldperson.p_Person.Family = Model.Family;
                        oldperson.p_Person.AddressId = Model.AddressId;
                        oldperson.p_Person.p_Customer.Address = Model.AddressStr;
                        oldperson.p_Person.p_Customer.Email = Model.email;
                        if (!string.IsNullOrEmpty(Model.Gender))
                            oldperson.p_Person.Gender = bool.Parse(Model.Gender);
                        var mob = oldperson.p_Person.p_Phone.SingleOrDefault(p => p.Number == Model.Mobile);
                        if (mob == null)
                            oldperson.p_Person.p_Phone.Add(new p_Phone { Number = Model.Mobile, Cell = true });
                        if (Model.Phone != null)
                        {
                            var phone = oldperson.p_Person.p_Phone.SingleOrDefault(p => p.Number == Model.Phone);
                            if (phone == null)
                                oldperson.p_Person.p_Phone.Add(new p_Phone { Number = Model.Phone, Cell = false });
                        }
                        oldperson.PostalCode = Model.PostalCode;
                        db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId).p_Customer = oldperson;
                    }
                }

                db.SaveChanges();
                return RedirectToAction("CheckOut_step2", "Tshop");
            }
            catch (Exception ex)
            {
                return RedirectToAction("CheckOut_step1", "Tshop");

            }
        }


        public ActionResult CheckOut_step2()
        {
            try
            {
                if (Session["orderHeaderId"] != null)
                {
                    int orderHeaderId = Convert.ToInt32(Session["orderHeaderId"]);
                    var orderHeader = db.ac_OrderHeader.SingleOrDefault(o => o.OrderHeaderId == orderHeaderId);
                    RegisterModel SModel = new RegisterModel();
                    var Receiver = orderHeader.ac_ReceiverDetails;
                    SModel.Name = Receiver.Name;
                    SModel.AddressStr = Receiver.Address;
                    int addressId = Convert.ToInt32(Receiver.AddressID);
                    ViewBag.StateId = new SelectList(db.p_Address.Where(p => p.ParentAddressId == 1), "AddressId", "Address", Receiver.p_Address.ParentAddressId);

                    ViewBag.AddressId = new SelectList(db.p_Address.Where(p => p.ParentAddressId == 2), "AddressId", "Address", Receiver.AddressID);
                    SModel.Mobile = Receiver.CellPhone;
                    SModel.Family = Receiver.Family;
                    SModel.Phone = Receiver.Phone;
                    SModel.PostalCode = Receiver.PostalCode;
                    return View(SModel);
                }

                int shoppingCartId = 0;
                int personAccountId = 0;
                if (User.Identity.IsAuthenticated)
                {
                    string userName = User.Identity.Name;
                    var per = db.aspnet_Membership.FirstOrDefault(m => m.aspnet_Users.UserName == userName).p_Customer.FirstOrDefault().p_Person;
                    personAccountId = per.AccountId;
                    shoppingCartId = db.ac_ShoppingCart.FirstOrDefault(s => s.CustomerId == personAccountId).ShoppingCartId;
                }
                else
                {
                    shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                    personAccountId = db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId).CustomerId.Value;
                }

                var receiver = XDocument.Load(Server.MapPath("~/Data/ReceiverInfo.xml")).Elements("root").Elements("User").LastOrDefault(d => d.Attribute("shoppingCartId").Value == shoppingCartId.ToString());
                RegisterModel Model = new RegisterModel();
                if (receiver != null)
                {
                    Model.Name = receiver.Attribute("name").Value;
                    Model.AddressStr = receiver.Attribute("addressStr").Value;
                    int addressId = Convert.ToInt32(receiver.Attribute("Address").Value);
                    ViewBag.StateId = new SelectList(db.p_Address.Where(p => p.ParentAddressId == 1), "AddressId", "Address", db.p_Address.SingleOrDefault(s => s.AddressId == addressId).ParentAddressId);

                    ViewBag.AddressId = new SelectList(db.p_Address.Where(p => p.ParentAddressId == 2), "AddressId", "Address", addressId);
                    Model.Mobile = receiver.Attribute("mobile").Value;
                    Model.Family = receiver.Attribute("family").Value;
                    Model.Phone = receiver.Attribute("phone").Value;
                    Model.PostalCode = receiver.Attribute("postcode").Value;
                }
                else
                {
                    var customer = db.p_Customer.SingleOrDefault(c => c.AccountId == personAccountId);
                    Model.code = customer.p_Person.Code;
                    ViewBag.StateId = new SelectList(db.p_Address.Where(p => p.ParentAddressId == 1), "AddressId", "Address", (customer.p_Person.p_Address != null && customer.p_Person.p_Address.ParentAddressId != null) ? customer.p_Person.p_Address.ParentAddressId.Value : 0);
                    ViewBag.AddressId = new SelectList(db.p_Address.Where(p => p.ParentAddressId == 2), "AddressId", "Address", customer.p_Person.AddressId);
                    Model.Address = customer.p_Person.p_Address.Address;
                    Model.AddressStr = customer.Address;
                    if (customer.p_Person.DateOfBirth != null)
                    {
                        DateTime birthdate = customer.p_Person.DateOfBirth.Value;
                        string[] birthdateStr = utility.GetstrDateCultureSimple(birthdate).Split('/');
                        Model.BirthDay = birthdateStr[2];
                        Model.BirthMonth = birthdateStr[1];
                        Model.BirthYear = birthdateStr[0];
                    }
                    Model.email = customer.Email;
                    Model.Family = customer.p_Person.Family;
                    var options = new List<SelectListItem> { 
                                                new SelectListItem { Text="انتخاب", Value="" }, 
                                                new SelectListItem { Text="زن", Value="false" }, 
                                                new SelectListItem { Text= "مرد", Value= "true" } 
                                                };
                    ViewBag.Gender = new SelectList(options, "Value", "Text", customer.p_Person.Gender.ToString());
                    Model.Gender = customer.p_Person.Gender.ToString();
                    Model.Name = customer.p_Person.Name;

                    Model.Mobile = customer.p_Person.p_Phone.Where(c => c.Cell).Count() > 0 ? customer.p_Person.p_Phone.Where(c => c.Cell).FirstOrDefault().Number : "";
                    Model.Phone = customer.p_Person.p_Phone.Where(c => !c.Cell).Count() > 0 ? customer.p_Person.p_Phone.Where(c => !c.Cell).FirstOrDefault().Number : "";
                    Model.Combo = !string.IsNullOrEmpty(customer.Job) ? customer.Job : " ";
                    Model.PostalCode = customer.PostalCode;
                    return View(Model);

                }
                return View("CheckOut_step2", Model);

            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Home");

            }
        }

        [HttpPost]
        public ActionResult CheckOut_step2(RegisterModel Model)
        {
            try
            {
                int shoppingCartId = 0;
                int personAccountId = 0;

                if (Session["orderHeaderId"] != null)
                {
                    int orderHeaderId = Convert.ToInt32(Session["orderHeaderId"]);
                    var orderHeader = db.ac_OrderHeader.SingleOrDefault(o => o.OrderHeaderId == orderHeaderId);
                    var receiver = orderHeader.ac_ReceiverDetails;
                    receiver.Name = string.IsNullOrEmpty(Model.Name) ? "" : Model.Name;
                    receiver.Family = string.IsNullOrEmpty(Model.Family) ? "" : Model.Family;
                    receiver.Phone = string.IsNullOrEmpty(Model.Phone) ? "" : Model.Phone;
                    receiver.CellPhone = string.IsNullOrEmpty(Model.Mobile) ? "" : Model.Mobile;
                    receiver.AddressID = Model.AddressId;
                    receiver.Address = Model.AddressStr;
                    receiver.PostalCode = string.IsNullOrEmpty(Model.PostalCode) ? "" : Model.PostalCode;
                    db.SaveChanges();
                    return RedirectToAction("CheckOut_step3", "Tshop");
                }

                if (User.Identity.IsAuthenticated)
                {
                    string userName = User.Identity.Name;
                    var per = db.aspnet_Membership.FirstOrDefault(m => m.aspnet_Users.UserName == userName).p_Customer.FirstOrDefault().p_Person;
                    personAccountId = per.AccountId;
                    shoppingCartId = db.ac_ShoppingCart.FirstOrDefault(s => s.CustomerId == personAccountId).ShoppingCartId;
                }
                else
                {
                    shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                    personAccountId = db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId).CustomerId.Value;
                }

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

                XDocument xmlDoc = XDocument.Load(Server.MapPath("~/Data/ReceiverInfo.xml"));
                xmlDoc.Element("root").Elements("User").Where(t => t.Attribute("personId").Value == personAccountId.ToString()).Remove();
                xmlDoc.Element("root").Add(new XElement("User",
                    new XAttribute("personId", personAccountId),
                    new XAttribute("Amount", amount),
                    new XAttribute("name", (string.IsNullOrEmpty(Model.Name) ? "" : Model.Name)),
                    new XAttribute("family", (string.IsNullOrEmpty(Model.Family) ? "" : Model.Family)),
                    new XAttribute("phone", (string.IsNullOrEmpty(Model.Phone) ? "" : Model.Phone)),
                    new XAttribute("mobile", (string.IsNullOrEmpty(Model.Mobile) ? "" : Model.Mobile)),
                    new XAttribute("Address", Model.AddressId),
                    new XAttribute("addressStr", Model.AddressStr),
                    new XAttribute("postcode", (string.IsNullOrEmpty(Model.PostalCode) ? "" : Model.PostalCode)),
                    new XAttribute("timesend", (string.IsNullOrEmpty(Request["timesend"]) ? "" : Request["timesend"])),
                    new XAttribute("datesend", (string.IsNullOrEmpty(Request["datesend"]) ? "" : Request["datesend"])),
                    new XAttribute("description", (string.IsNullOrEmpty(Request["description"]) ? "" : Request["description"])),
                    new XAttribute("isgift", (string.IsNullOrEmpty(Request["isgift"]) ? "" : Request["isgift"])),
                    new XAttribute("giftnote", (string.IsNullOrEmpty(Request["giftnote"]) ? "" : Request["giftnote"])),
                    new XAttribute("needwrap", (string.IsNullOrEmpty(Request["Gift"]) ? "" : Request["Gift"])),
                    new XAttribute("sendtype", (string.IsNullOrEmpty(Request["sendtype"]) ? "" : Request["sendtype"])),
                    new XAttribute("shoppingCartId", shoppingCartId)
                ));
                xmlDoc.Save(Server.MapPath("~/Data/ReceiverInfo.xml"));
                return RedirectToAction("CheckOut_step3", "Tshop");

            }
            catch (Exception ex)
            {
                return RedirectToAction("CheckOut_step2", "Tshop");

            }
        }


        public ActionResult CheckOut_step3()
        {
            try
            {
                var options = new List<SelectListItem> { 
                                                new SelectListItem { Text="8 تا 12 ظهر", Value="8 تا 12 ظهر" }, 
                                                new SelectListItem { Text="15 تا 20", Value="15 تا 20" }, 
                                                };
                if (Session["orderHeaderId"] != null)
                {
                    int orderHeaderId = Convert.ToInt32(Session["orderHeaderId"]);
                    var orderHeader = db.ac_OrderHeader.SingleOrDefault(o => o.OrderHeaderId == orderHeaderId);
                    ShippingModel SModel = new ShippingModel();
                    var Receiver = orderHeader.ac_ReceiverDetails;
                    SModel.SendType = Receiver.SendType.ToString();
                    SModel.SendDate = utility.GetstrDateCultureSimpleYearLast(Receiver.SendDate.Value);
                    SModel.SendTime = Receiver.SendTime;
                    SModel.GiftNote = Receiver.GiftNote;
                    SModel.MoreInfo = orderHeader.Description;
                    ViewBag.SendTime = new SelectList(options, "Value", "Text", Receiver.SendTime != null ? Receiver.SendTime : "8 تا 12 ظهر");
                    return View("CheckOut_step3", SModel);
                }



                int shoppingCartId = 0;
                int personAccountId = 0;
                if (User.Identity.IsAuthenticated)
                {
                    string userName = User.Identity.Name;
                    var per = db.aspnet_Membership.FirstOrDefault(m => m.aspnet_Users.UserName == userName).p_Customer.FirstOrDefault().p_Person;
                    personAccountId = per.AccountId;
                    shoppingCartId = db.ac_ShoppingCart.FirstOrDefault(s => s.CustomerId == personAccountId).ShoppingCartId;
                }
                else
                {
                    shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                    personAccountId = db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId).CustomerId.Value;
                }

                var receiver = XDocument.Load(Server.MapPath("~/Data/ReceiverInfo.xml")).Elements("root").Elements("User").LastOrDefault(d => d.Attribute("shoppingCartId").Value == shoppingCartId.ToString());

                string addressId = receiver.Attribute("Address") != null ? receiver.Attribute("Address").Value : "";
                if (!string.IsNullOrEmpty(addressId))
                {
                    int aId = Convert.ToInt32(addressId);
                    var country = db.p_Address.SingleOrDefault(a => a.AddressId == aId).p_Address2;
                    int stateId = country.AddressId;
                    ViewBag.CountryId = new SelectList(db.p_Address, "AddressId", "Address", country.ParentAddressId);
                    ViewBag.StateId = new SelectList(db.p_Address, "AddressId", "Address", stateId);
                }
                else
                {
                    ViewBag.CountryId = new SelectList(db.p_Address, "AddressId", "Address");
                    ViewBag.StateId = new SelectList(db.p_Address, "AddressId", "Address");
                }

                ShippingModel Model = new ShippingModel();
                ac_ReceiverDetails ac_ReceiverDetails = new Models.ac_ReceiverDetails();
                Model.CountryId = receiver.Attribute("countary") != null ? receiver.Attribute("countary").Value : "";
                Model.StateId = receiver.Attribute("state") != null ? receiver.Attribute("state").Value : "";
                Model.ZipCode = receiver.Attribute("zipcode") != null ? receiver.Attribute("zipcode").Value : "";
                Model.SendType = receiver.Attribute("sendtype") != null ? receiver.Attribute("sendtype").Value : "";
                Model.SendDate = receiver.Attribute("datesend") != null ? receiver.Attribute("datesend").Value : "";
                Model.SendTime = receiver.Attribute("timesend") != null ? receiver.Attribute("timesend").Value : "";
                Model.GiftNote = receiver.Attribute("giftnote") != null ? receiver.Attribute("giftnote").Value : "";
                Model.MoreInfo = receiver.Attribute("description") != null ? receiver.Attribute("description").Value : "";
                ViewBag.SendTime = new SelectList(options, "Value", "Text", receiver.Attribute("timesend") != null ? receiver.Attribute("timesend").Value : "8 تا 12 ظهر");
                return View("CheckOut_step3", Model);
            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Home");
            }
        }
        [HttpPost]
        public ActionResult CheckOut_step3(ShippingModel shipping)
        {
            try
            {
                if (Session["orderHeaderId"] != null)
                {
                    int orderHeaderId = Convert.ToInt32(Session["orderHeaderId"]);
                    var orderHeader = db.ac_OrderHeader.SingleOrDefault(o => o.OrderHeaderId == orderHeaderId);
                    var Receiver = orderHeader.ac_ReceiverDetails;
                    Receiver.SendType = Convert.ToInt32(shipping.SendType);
                    Receiver.SendTime = shipping.SendTime;
                    Receiver.SendDate = utility.GetDateTimeCulture(shipping.SendDate);
                    Receiver.GiftNote = shipping.GiftNote;
                    orderHeader.Description = shipping.MoreInfo;
                    db.SaveChanges();
                    return RedirectToAction("CheckOut_step4", "Tshop");
                }

                ac_ShoppingCart shoppingCart = null;
                int shoppingCartId = 0;
                int personAccountId = 0;
                if (User.Identity.IsAuthenticated)
                {
                    string userName = User.Identity.Name;
                    var per = db.aspnet_Membership.FirstOrDefault(m => m.aspnet_Users.UserName == userName).p_Customer.FirstOrDefault().p_Person;
                    personAccountId = per.AccountId;
                    shoppingCart = db.ac_ShoppingCart.FirstOrDefault(s => s.CustomerId == personAccountId);
                    shoppingCartId = shoppingCart.ShoppingCartId;
                }
                else
                {
                    shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                    shoppingCart = db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId);
                    personAccountId = shoppingCart.CustomerId.Value;
                }

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

                XDocument xmlDoc = XDocument.Load(Server.MapPath("~/Data/ReceiverInfo.xml"));
                var xml = xmlDoc.Element("root").Elements("User").SingleOrDefault(t => t.Attribute("shoppingCartId").Value == shoppingCartId.ToString());
                xml.SetAttributeValue("sendtype", shipping.SendType);
                xml.SetAttributeValue("country", shipping.CountryId);
                xml.SetAttributeValue("state", shipping.StateId);
                xml.SetAttributeValue("zipCode", shipping.ZipCode);
                xml.SetAttributeValue("sendtype", shipping.SendType);
                xml.SetAttributeValue("timesend", shipping.SendTime);
                xml.SetAttributeValue("datesend", shipping.SendDate);
                xml.SetAttributeValue("giftnote", shipping.GiftNote);
                xml.SetAttributeValue("description", shipping.MoreInfo);
                xmlDoc.Save(Server.MapPath("~/Data/ReceiverInfo.xml"));


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

                ordH.ClientId = personAccountId;
                decimal sum = 0;
                var shoppingcartDetails = shoppingCart.ac_ShoppingCartDetails.Where(sd => sd.ChildShoppingCartDetailsId == null);

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

                //var r = db.ac_OrderHeader.OrderByDescending(d => d.Date).Where(i => i.InvoiceNO.Contains("AOP-"));
                string invoiceNo = ManagementController.getInvoiceNumber(db, "", true, true);

                var appDetail = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationDetail;
                ordH.CurrencyRateId = db.ac_Currency.Where(c => c.Currency == "تومان").FirstOrDefault().ac_CurrencyRate.OrderByDescending(c => c.Date).FirstOrDefault().CurrencyRateId;

                if (appDetail.EmployeeId != null)
                {
                    ordH.EmployeeId = appDetail.EmployeeId.Value;
                }
                ordH.InvoiceNO = invoiceNo;
                ordH.IsMoney = false;
                ordH.Sell = true;

                var receiver = XDocument.Load(Server.MapPath("~/Data/ReceiverInfo.xml")).Elements("root").Elements("User").LastOrDefault(d => d.Attribute("shoppingCartId").Value == shoppingCartId.ToString());
                ordH.Description = (receiver.Attribute("description") != null ? receiver.Attribute("description").Value : "");

                ac_ReceiverDetails ac_ReceiverDetails = new Models.ac_ReceiverDetails();
                ac_ReceiverDetails.Name = receiver.Attribute("name").Value;
                ac_ReceiverDetails.Address = receiver.Attribute("addressStr").Value;
                ac_ReceiverDetails.AddressID = receiver.Attribute("Address") != null ? Convert.ToInt32(receiver.Attribute("Address").Value) : 1;
                ac_ReceiverDetails.CellPhone = receiver.Attribute("mobile").Value;
                ac_ReceiverDetails.Family = receiver.Attribute("family").Value;
                ac_ReceiverDetails.Phone = receiver.Attribute("phone").Value;
                ac_ReceiverDetails.PostalCode = receiver.Attribute("postcode").Value;
                ac_ReceiverDetails.SendType = !string.IsNullOrEmpty(receiver.Attribute("sendtype").Value) ? (int?)Convert.ToInt32(receiver.Attribute("sendtype").Value) : null;
                ac_ReceiverDetails.SendDate = !string.IsNullOrEmpty(receiver.Attribute("datesend").Value) ? utility.GetDateTimeCulture(receiver.Attribute("datesend").Value) : DateTime.Now;
                ac_ReceiverDetails.SendTime = receiver.Attribute("timesend").Value;
                ac_ReceiverDetails.IsGift = receiver.Attribute("isGift") != null ? Convert.ToBoolean(receiver.Attribute("isgift").Value) : false;
                ac_ReceiverDetails.NeedWrap = receiver.Attribute("needwarp") != null ? Convert.ToBoolean(receiver.Attribute("needwrap").Value) : false;
                ac_ReceiverDetails.GiftNote = receiver.Attribute("giftnote") != null ? receiver.Attribute("giftnote").Value : "";
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
                foreach (var item in shoppingCart.ac_ShoppingCartDetails.ToList())
                {
                    if (item.ac_ShoppingCartDetails1.Count > 0)
                        foreach (var items in item.ac_ShoppingCartDetails1.ToList())
                        {
                            db.ac_ShoppingCartDetails.DeleteObject(items);
                        }
                    db.ac_ShoppingCartDetails.DeleteObject(item);
                }
                db.ac_ShoppingCart.DeleteObject(shoppingCart);
                ordH.ClientId = personAccountId;
                ordH.ac_ReceiverDetails.Address = utility.getStrAddress(db.GetParentAddressById(ordH.ac_ReceiverDetails.AddressID, "")) + "-> " + ordH.ac_ReceiverDetails.Address;

                //moshtari - > bedehkar
                ac_AccountDetail accountDetailCus = new ac_AccountDetail();
                accountDetailCus.AccountId = personAccountId;
                accountDetailCus.IsDept = true;
                accountDetailCus.Amount = sum + ac_ReceiverDetails.DeliveryExpense.Value - ac_ReceiverDetails.DiscountAmount.Value;
                ordH.ac_AccountDetail.Add(accountDetailCus);

                db.SaveChanges();
                xmlDoc.Element("root").Elements("User").LastOrDefault(t => t.Attribute("personId").Value == personAccountId.ToString()).Remove();
                xmlDoc.Save(Server.MapPath("~/Data/ReceiverInfo.xml"));
                Session["shoppingCartId"] = null;
                Session["orderHeaderId"] = ordH.OrderHeaderId;

                return RedirectToAction("CheckOut_step4", "Tshop");

            }
            catch (Exception ex)
            {
                return RedirectToAction("CheckOut_step3", "Tshop");

            }
        }



        public ActionResult CheckOut_step4()
        {
            return View();
        }

        [HttpPost]
        public ActionResult CheckOut_step4(paymentModel payment)
        {
            try
            {
                if (Request["accepted"] == "on")
                {
                    if (payment.paymentMethod == 1)
                    {
                        return RedirectToAction("CheckOutOnlinePayment", "Tshop");
                    }
                    int orderHeaderId = Convert.ToInt32(Session["orderHeaderId"]);

                    //if (!payment.accepted)
                    //    return RedirectToAction("Index", "Home");

                    var receiverDetail = db.ac_OrderHeader.SingleOrDefault(s => s.OrderHeaderId == orderHeaderId).ac_ReceiverDetails;
                    receiverDetail.PaymentType = payment.paymentMethod;
                    receiverDetail.ac_OrderHeader.Description = payment.CommentsOrder;
                    db.SaveChanges();
                    var customer = receiverDetail.ac_OrderHeader.p_Person.p_Customer;
                    sendSMSEmail(customer.Email, false, customer.p_Person.p_Phone.FirstOrDefault(m => m.Cell == true).Number, receiverDetail.ac_OrderHeader.InvoiceNO, customer.AccountId, customer.p_Person.p_Phone.FirstOrDefault(m => m.Cell == true).Number);
                    return RedirectToAction("CheckOut_step5", "Tshop");
                }
                else
                {
                    return RedirectToAction("CheckOut_step4", "Tshop");
                }

            }
            catch (Exception ex)
            {
                return RedirectToAction("CheckOut_step3", "Tshop");
            }
            return View();
        }

        public ActionResult CheckOutOnlinePayment(paymentModel payment)
        {
            try
            {
                int orderHeaderId = Convert.ToInt32(Session["orderHeaderId"]);

                decimal amount = db.ac_OrderHeader.SingleOrDefault(s => s.OrderHeaderId == orderHeaderId).Amount;
                string result = "";
                ir.shaparak.bpm.PaymentGatewayImplService bpService = new ir.shaparak.bpm.PaymentGatewayImplService();
                DateTime dateTime = DateTime.Now;
                var appDetails = db.aspnet_Applications.Single(s => s.ApplicationName == appName).ApplicationDetail;

                result = bpService.bpPayRequest(
                     appDetails.TerminalId.Value,
                        appDetails.PaymentUserName,
                        appDetails.PaymentPassword,
                    Int64.Parse(ShoppingController.getInvoiceNumber()),
                    (long)amount * 10,
                    dateTime.Year.ToString() + dateTime.Month.ToString() + dateTime.Day.ToString(),
                    dateTime.Hour.ToString() + dateTime.Minute.ToString() + dateTime.Second.ToString(),
                    "سفارش",
                   "http://shirazrose.com/Tshop/Payment",
                    0);
                String[] resultArray = result.Split(',');
                if (resultArray[0] == "0")
                {

                    ViewBag.Script = "<script language='javascript' type='text/javascript'> postRefId('" + resultArray[1] + "');</script> ";
                    return View();
                }
                else
                    return RedirectToAction("CheckOut_step4", "Tshop");


            }
            catch (Exception e)
            {
                return RedirectToAction("CheckOut_step4", "Tshop");
            }
        }

        public ActionResult CheckOut_step5()
        {
            int orderHeaderId = Convert.ToInt32(Session["orderHeaderId"]);

            return View(db.ac_OrderHeader.SingleOrDefault(s => s.OrderHeaderId == orderHeaderId));
        }

        [HttpPost]
        public ActionResult CheckOut_step5(paymentModel payment)
        {
            try
            {
                if (!payment.accepted)
                    return RedirectToAction("Index", "Home");
                ac_ShoppingCart shoppingCart = null;
                int shoppingCartId = 0;
                int personAccountId = 0;
                if (User.Identity.IsAuthenticated)
                {
                    string userName = User.Identity.Name;
                    var per = db.aspnet_Membership.FirstOrDefault(m => m.aspnet_Users.UserName == userName).p_Customer.FirstOrDefault().p_Person;
                    personAccountId = per.AccountId;
                    shoppingCart = db.ac_ShoppingCart.FirstOrDefault(s => s.CustomerId == personAccountId);
                    shoppingCartId = shoppingCart.ShoppingCartId;
                }
                else
                {
                    shoppingCartId = Convert.ToInt32(Session["shoppingCartId"]);
                    shoppingCart = db.ac_ShoppingCart.SingleOrDefault(s => s.ShoppingCartId == shoppingCartId);
                    personAccountId = shoppingCart.CustomerId.Value;
                }
                int orderHeaderId = Convert.ToInt32(Session["orderHeaderId"]);
                var receiverDetail = db.ac_OrderHeader.SingleOrDefault(s => s.OrderHeaderId == orderHeaderId).ac_ReceiverDetails;
                receiverDetail.PaymentType = payment.paymentMethod;
                receiverDetail.ac_OrderHeader.Description = payment.CommentsOrder;
                return RedirectToAction("CheckOut_step5", "Tshop");
            }
            catch (Exception ex)
            {
                return RedirectToAction("CheckOut_step3", "Tshop");

            }
            return View();
        }

        public ActionResult endOrder()
        {
            string userName = User.Identity.Name;
            int perId = db.aspnet_Membership.FirstOrDefault(m => m.aspnet_Users.UserName == userName).p_Customer.FirstOrDefault().AccountId;

            int orderHeaderId = Convert.ToInt32(Request["orderId"]);
            if (db.ac_OrderHeader.Where(p => p.p_Person.AccountId == perId && p.OrderHeaderId == orderHeaderId).Count() > 0)
            {
                Session["orderHeaderId"] = orderHeaderId;
                var orderHeader = db.ac_OrderHeader.Where(p => p.p_Person.AccountId == perId && p.OrderHeaderId == orderHeaderId);
                return RedirectToAction("CheckOut_step4", "Tshop");
            }
            else
                return RedirectToAction("index", "Home");

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
                return RedirectToAction("CheckOut_step4", "Tshop");
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
                if (result.Split(',')[0] != "0")
                {
                    utility.BypassCertificateError();
                    result = bpService.bpInquiryRequest(appDetails.TerminalId.Value,
                    appDetails.PaymentUserName,
                    appDetails.PaymentPassword,
                    saleOrderId.Value,
                    saleOrderId.Value,
                    SaleReferenceId.Value);
                }
                if (result.Split(',')[0] == "0")
                {
                    //ViewBag.Script = "<script language='javascript' type='text/javascript'> alert('" + result.Split(',')[0] + "--" + SaleReferenceId + "');</script> ";
                    int orderHeaderId = Convert.ToInt32(Session["orderHeaderId"]);
                    var receiverDetail = db.ac_OrderHeader.SingleOrDefault(s => s.OrderHeaderId == orderHeaderId).ac_ReceiverDetails;
                    receiverDetail.PaymentType = 1;
                    receiverDetail.SaleOrderId = saleOrderId.Value;
                    receiverDetail.SaleReferenceId = SaleReferenceId.Value;
                    //receiverDetail.ac_OrderHeader.Description = payment.CommentsOrder;
                    db.SaveChanges();

                    var customer = receiverDetail.ac_OrderHeader.p_Person.p_Customer;
                    sendSMSEmail(customer.Email, false, customer.p_Person.p_Phone.FirstOrDefault(m => m.Cell == true).Number, receiverDetail.ac_OrderHeader.InvoiceNO, customer.AccountId, customer.p_Person.p_Phone.FirstOrDefault(m => m.Cell == true).Number);
                    return View("CheckOut_step5", db.ac_OrderHeader.SingleOrDefault(s => s.OrderHeaderId == orderHeaderId));
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
                    return View("CheckOut_step4");
                }
            }
            catch (Exception exp)
            {
                result = bpService.bpReversalRequest(appDetails.TerminalId.Value,
                    appDetails.PaymentUserName,
                    appDetails.PaymentPassword,
                   saleOrderId.Value,
                   saleOrderId.Value,
                   SaleReferenceId.Value
                   );
                ViewBag.message = exp.Message;
                ViewBag.error = exp.Message + "-" + personId + "-" + shoppingCartId + "-" + Session["personId"].ToString();
                return View("CheckOut_step4");
            }
        }

        void sendSMSEmail(string email, bool? isGift, string smobile, string invoiceNo, int accountId, string mobile)
        {
            if (!string.IsNullOrEmpty(email))
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

    }
}




