using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MapiOnline.Models;
using System.Web.Security;
using System.Data.Objects.DataClasses;
using System.Xml.Linq;
using System.Xml.Schema;
using MapiOnline.Controllers;



namespace MapiOnline.Controllers
{
    public class HierarchyController : Controller
    {
        MapiDBEntities db = new MapiDBEntities();
        string appName = Membership.ApplicationName;
        public class hItems
        {
            public object body { get; set; }
            public List<string[,]> parents { get; set; }
        }

        [HttpPost]

        public ActionResult GetTreeData(int? id, string name, string otherParam)
        {
            var s = Request["otherParam"];
            int? parentID = id == null ? null : id;

            var appDetails = db.aspnet_Applications.Single(aa => aa.ApplicationName == appName).ApplicationDetail;
            var appId = db.aspnet_Applications.Single(a => a.ApplicationName == appName).ApplicationId;
            if (name == "registerAccount")
            {
                var q = (db.ac_Account.Where(con => (((parentID == null && con.ParentAccountId == null) || (con.ParentAccountId == parentID)) && (con.ApplicationId == null || con.aspnet_Applications.ApplicationName == Membership.ApplicationName))).OrderBy(o => o.Name).Select(a => new
                {
                    a.AccountId,
                    a.Code,
                    a.Name,
                    a.Level,
                    amount = a.ac_AccountDetail.Where(ac => ac.ac_OrderHeader.FiscalPeriodId == appDetails.CurrentFiscalPeriodId).Sum(d => d.Amount),
                    childCount = a.ac_Account1.Count()
                }).AsEnumerable().Select(categ => new
                {
                    id = categ.AccountId,
                    name = categ.Code + " " + categ.Name + " " + (categ.Level != 3 ? (db.GetSubAccountBalanceByParent(categ.AccountId, appDetails.CurrentFiscalPeriodId,null).Sum(ss => ss.Value)).ToString() : (categ.amount).ToString()),
                    isParent = categ.childCount > 0 ? true : false,
                    icon = (categ.Level == 3 ? "../../../Content/zTreeStyle/img/diy/3.png" : "../../../Content/zTreeStyle/img/diy/1_open.png"),
                    font = new { color = (categ.Level == 3 ? "black" : categ.Level == 2 ? "blue" : categ.Level == 1 ? "red" : "green") }
                }));
                return Json(db.ac_Account.Where(con => (((parentID == null && con.ParentAccountId == null) || (con.ParentAccountId == parentID)) && (con.ApplicationId == null || con.aspnet_Applications.ApplicationName == Membership.ApplicationName))).OrderBy(o => o.Name).Select(a => new
                {
                    a.AccountId,
                    a.Code,
                    a.Name,
                    a.Level,
                    amount = a.ac_AccountDetail.Where(ac => ac.ac_OrderHeader.FiscalPeriodId == appDetails.CurrentFiscalPeriodId).Sum(d => d.Amount),
                    childCount = a.ac_Account1.Count()
                }).AsEnumerable().Select(categ => new
                    {
                        id = categ.AccountId,
                        name = categ.Code + " " + categ.Name + " " + (categ.Level != 3 ? (db.GetSubAccountBalanceByParent(categ.AccountId, appDetails.CurrentFiscalPeriodId,null).Sum(ss => ss.Value)).ToString() : (categ.amount).ToString()),
                        isParent = categ.childCount > 0 ? true : false,
                        icon = (categ.Level == 3 ? "../../../Content/zTreeStyle/img/diy/3.png" : "../../../Content/zTreeStyle/img/diy/1_open.png"),
                        font = new { color = (categ.Level == 3 ? "black" : categ.Level == 2 ? "blue" : categ.Level == 1 ? "red" : "green") }
                    }));
            }
            else if (name.ToLower() == "properties")
                {
                    return Json(db.inv_Property.Where(c => (parentID == null && c.ParentId == null) || (c.ParentId == parentID) && (c.ApplicationId == null || c.aspnet_Applications.ApplicationName == Membership.ApplicationName)).OrderBy(a => a.Priority).Select(catg => new
                    {
                        isChecked = catg.ShowInMenu,
                        id = catg.PropertyId,
                        name = catg.Property,
                        showInProperty=catg.ShowInProperty,
                        translated=catg.TranslatedProperty,
                        isParent = catg.inv_Property1.Count() > 0 ? true : false,
                        font = new { color = ((bool)catg.ShowInMenu ? "blue" : "black") },
                        //icon =((bool)catg.ShowOnline ? "../../../Content/zTreeStyle/img/diy/tik.png" : "../../../Content/zTreeStyle/img/diy/1_open.png"),
                    }));
                }
            else
            {
                if (name == "categories")
                {
                    return Json(db.inv_Category.Where(c => (parentID == null && c.ParentCategoryId == null) || (c.ParentCategoryId == parentID) && (c.ApplicationId == null || c.aspnet_Applications.ApplicationName == Membership.ApplicationName)).OrderBy(a => a.Priority).Select(catg => new
                     {
                         isChecked = catg.ShowOnline,
                         id = catg.CategoryId,
                         name = catg.Category,
                         isParent = catg.inv_Category1.Count() > 0 ? true : false,
                         font = new { color = ((bool)catg.ShowOnline ? "blue" : "black") },
                         //icon =((bool)catg.ShowOnline ? "../../../Content/zTreeStyle/img/diy/tik.png" : "../../../Content/zTreeStyle/img/diy/1_open.png"),
                     }));
                }
                else
                    if (name == "Menu")
                    {
                        XDocument xmlDoc = XDocument.Load(Server.MapPath("~/Data/Menu.xml"));
                        XElement x;
                        if (parentID == null)
                            x = xmlDoc.Element("root");
                        else
                            x = xmlDoc.Element("root").Descendants("Content").Single(t => t.Attribute("Id").Value == parentID.ToString());
                        return Json(
                            x.Elements("Content").OrderBy(o => Convert.ToInt32(o.Attribute("order").Value)).Select(ss => new
                            {
                                isChecked = ss.Attribute("show").Value,
                                id = ss.Attribute("Id").Value,
                                name = ss.Attribute("menuName").Value,
                                isParent = ss.Elements("Content").Count() > 0 ? true : false,
                                font = new { color = (Convert.ToBoolean(ss.Attribute("show").Value) ? "blue" : "black") },
                            })
                        );
                    }
                    else
                        return Json(new { isdone = false });
            }


        }
        public ActionResult Get(int? parentID, string table)
        {

            if (parentID == null)
                parentID = null;
            if (table.ToLower() == "address")
            {
                var d = db.p_Address.Where(con => (((parentID == null && con.ParentAddressId == null) || (con.ParentAddressId == parentID)) && (con.ApplicationId == null || con.aspnet_Applications.ApplicationName == Membership.ApplicationName))).OrderBy(o => o.Address)
                    .Select(address => new { value = address.Address, id = address.AddressId });
                return Json(new { d });
            }
            else if (table.ToLower() == "category")
            {
                var d = db.inv_Category.Where(con => (((parentID == null && con.ParentCategoryId == null) || (con.ParentCategoryId == parentID)) && (con.ApplicationId == null || con.aspnet_Applications.ApplicationName == Membership.ApplicationName))).OrderBy(o => o.Category)
                    .Select(categ => new { value = categ.Category, id = categ.CategoryId });
                return Json(new { d });
            }
            else if (table.ToLower() == "measureunit")
            {
                var d = db.inv_MeasureUnit.Where(con => (((parentID == null && con.ParentMeasureUnitId == null) || (con.ParentMeasureUnitId == parentID)) && (con.ApplicationId == null || con.aspnet_Applications.ApplicationName == Membership.ApplicationName))).OrderBy(o => o.UnitType)
                    .Select(categ => new { value = categ.UnitType, id = categ.MeasureUnitId });
                return Json(new { d });
            }
            //else if (table.ToLower() == "expensecategory")
            //{
            //    var d = db.ac_ExpenseCategory.Where(con => (((parentID == null && con.ParentExpenseCategoryId == null) || (con.ParentExpenseCategoryId == parentID)) && (con.ApplicationId == null || con.aspnet_Applications.ApplicationName == Membership.ApplicationName))).OrderBy(o => o.Expense)
            //        .Select(categ => new { value = categ.Expense, id = categ.ExpenseCategoryId });
            //    return Json(new { d });
            //}
            else if (table.ToLower() == "property")
            {
                var d = db.inv_Property.Where(con => (((parentID == null && con.ParentId == null) || (con.ParentId == parentID)) && (con.ApplicationId == null || con.aspnet_Applications.ApplicationName == Membership.ApplicationName))).OrderBy(o => o.Property)
                    .Select(categ => new { value = categ.Property, id = categ.PropertyId });
                return Json(new { d });
            }
            else if (table.ToLower() == "account")
            {
                var d = db.ac_Account.Where(con => (((parentID == null && con.ParentAccountId == null) || (con.ParentAccountId == parentID)) && (con.ApplicationId == null || con.aspnet_Applications.ApplicationName == Membership.ApplicationName))).OrderBy(o => o.Name)
                    .Select(categ => new { value = categ.Name, id = categ.AccountId, categ.Code, categ.Level, categ.AccountNature, categ.GroupType });
                return Json(new { d });
            }
            else return null;
        }
        [HttpPost]
        public ActionResult GetParents(int? parentID, string table, string StartLevel)
        {
            MapiDBEntities db = new MapiDBEntities();
            try
            {
                if (parentID == null)
                    parentID = null;
                hItems hitems = new hItems();
                if (table.ToLower() == "address")
                {
                    hitems.body = db.p_Address.Where(con => (((parentID == null && con.ParentAddressId == null) || (con.ParentAddressId == parentID)) && (con.ApplicationId == null || con.aspnet_Applications.ApplicationName == Membership.ApplicationName))).OrderBy(o => o.Address)
                   .Select(address => new { value = address.Address, id = address.AddressId });
                    // .Select(add => new string[,] { { add.Address, add.AddressId.ToString() } }).ToList();
                    hitems.parents = db.GetParentAddressById(parentID, StartLevel)//.OrderBy(o => o.AddressId)
                   .Select(ad => new { ad.Address, ad.AddressId }).AsEnumerable()
                   .Select(add => new string[,] { { add.Address, add.AddressId.ToString() } }).ToList();
                }
                else if (table.ToLower() == "category")
                {
                    hitems.body = db.inv_Category.Where(con => (((parentID == null && con.ParentCategoryId == null) || (con.ParentCategoryId == parentID)) && (con.ApplicationId == null || con.aspnet_Applications.ApplicationName == Membership.ApplicationName))).OrderBy(o => o.Category)
                   .Select(categ => new { value = categ.Category, id = categ.CategoryId });
                    hitems.parents = db.GetParentCategoryById(parentID, StartLevel)//.OrderBy(o => o.Category)
                   .Select(ad => new { ad.Category, ad.CategoryId }).AsEnumerable()
                   .Select(add => new string[,] { { add.Category, add.CategoryId.ToString() } }).ToList();
                }
                //else if (table.ToLower() == "measureunit")
                //{
                //    hitems.body = db.inv_MeasureUnit.Where(con => (((parentID == null && con.MeasureUnitId == null) || (con.MeasureUnitId == parentID)) && (con.ApplicationId == null || con.aspnet_Applications.ApplicationName == Membership.ApplicationName))).OrderBy(o => o.UnitType)
                //    .Select(categ => new { value = categ.UnitType, id = categ.MeasureUnitId });
                //    hitems.parents = db.GetParentMeasureUnitByID(parentID, StartLevel)//.OrderBy(o => o.UnitType)
                //   .Select(ad => new { ad.UnitType, ad.MeasureUnitId }).AsEnumerable()
                //   .Select(add => new string[,] { { add.UnitType, add.MeasureUnitId.ToString() } }).ToList();
                //}
                //else if (table.ToLower() == "expensecategory")
                //{
                //    hitems.body = db.ac_ExpenseCategory.Where(con => (((parentID == null && con.ExpenseCategoryId == null) || (con.ExpenseCategoryId == parentID)) && (con.ApplicationId == null || con.aspnet_Applications.ApplicationName == Membership.ApplicationName))).OrderBy(o => o.Expense)
                //   .Select(categ => new { value = categ.Expense, id = categ.ExpenseCategoryId });
                //    hitems.parents = db.GetParentExpenseCategoryById(parentID, StartLevel)//.OrderBy(o => o.Expense)
                //   .Select(ad => new { ad.Expense, ad.ExpenseCategoryId }).AsEnumerable()
                //   .Select(add => new string[,] { { add.Expense, add.ExpenseCategoryId.ToString() } }).ToList();
                //}
                //else if (table.ToLower() == "property")
                //{
                //    hitems.body = db.inv_Property.Where(con => (((parentID == null && con.PropertyId == null) || (con.PropertyId == parentID)) && (con.ApplicationId == null || con.aspnet_Applications.ApplicationName == Membership.ApplicationName))).OrderBy(o => o.Property)
                //   .Select(categ => Json(new { value = categ.Property, id = categ.PropertyId }));
                //    hitems.parents = db.GetParentPropertyById(parentID, StartLevel)//.OrderBy(o => o.Expense)
                //   .Select(ad => new { ad.Property, ad.PropertyId }).AsEnumerable()
                //   .Select(add => new string[,] { { add.Property, add.PropertyId.ToString() } }).ToList();
                //}
                //else if (table.ToLower() == "account")
                //{
                //    hitems.body = db.ac_Account.Where(con => (((parentID == null && con.AccountId == null) || (con.AccountId == parentID)) && (con.ApplicationId == null || con.aspnet_Applications.ApplicationName == Membership.ApplicationName))).OrderBy(o => o.Name)
                //   .Select(categ => new { value = categ.Name, id = categ.AccountId, categ.Code, categ.Level, categ.AccountNature, categ.GroupType });
                //    hitems.parents = db.GetParentAccountByID(parentID, StartLevel)//.OrderBy(o => o.Expense)
                //   .Select(ad => new { ad.Name, ad.AccountId, ad.Code, ad.Level, ad.GroupType, ad.AccountNature }).AsEnumerable()
                //   .Select(add => new string[,] { { add.Name, add.AccountId.ToString(), add.Code.ToString(), add.Level.ToString(), add.AccountNature.ToString(), add.GroupType.ToString() } }).ToList();
                //}
                return Json(new { d = hitems });
            }
            catch (Exception ex) { return null; }

        }
        [HttpPost]
        public ActionResult Delete(string table)
        {
            MapiDBEntities db = new MapiDBEntities();
            int? parentID = Convert.ToInt32(Request["selectedValue"]);
            try
            {
                int? parentId = null;
                if (parentID == 0)
                    parentID = null;
                if (table.ToLower() == "address")
                {
                    if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canEditAddress"))
                    {
                        return Json(new { isDone = false, msg = "notAllowed" });
                    }
                    p_Address address = db.p_Address.Single(si => si.AddressId == parentID);
                    parentId = address.ParentAddressId;
                    db.p_Address.DeleteObject(address);
                    db.SaveChanges();
                    return Json(db.p_Address.Where(con => ((parentId == null && con.ParentAddressId == null) || (con.ParentAddressId == parentId))).OrderBy(o => o.Address)
                   .Select(ad => new { value = ad.Address, id = ad.AddressId }));
                }
                else if (table.ToLower() == "category")
                {
                    if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canEditCategory"))
                    {
                        return Json(new { isDone = false, msg = "notAllowed" });
                    }
                    inv_Category category = db.inv_Category.Single(si => si.CategoryId == parentID);
                    if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canEditCategory"))
                    {
                        return Json(new { isDone = false, msg = "notAllowed" });
                    }
                    parentId = category.ParentCategoryId;
                    db.inv_Category.DeleteObject(category);
                    db.SaveChanges();
                    return Json(db.inv_Category.Where(con => ((parentId == null && con.ParentCategoryId == null) || (con.ParentCategoryId == parentId))).OrderBy(o => o.Category)
                    .Select(ad => new { value= ad.Category,id= ad.CategoryId }));
                }
                else if (table.ToLower() == "measureunit")
                {
                    if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canEditMeasureUnit"))
                    {
                        return Json(new { isDone = false, msg = "notAllowed" });
                    }
                    inv_MeasureUnit category = db.inv_MeasureUnit.Single(si => si.MeasureUnitId == parentID);
                    parentId = category.ParentMeasureUnitId;
                    db.inv_MeasureUnit.DeleteObject(category);
                    db.SaveChanges();
                    return Json(db.inv_MeasureUnit.Where(con => ((parentId == null && con.ParentMeasureUnitId == null) || (con.ParentMeasureUnitId == parentId))).OrderBy(o => o.UnitType)
                    .Select(ad => new { value = ad.UnitType, id = ad.MeasureUnitId }));
                }
                //else if (table.ToLower() == "expensecategory")
                //{
                //    if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canEditExpenseCategory"))
                //    {
                //        return new { isDone = false, msg = "notAllowed" };
                //    }
                //ac_ExpenseCategory expense = db.ac_ExpenseCategory.Single(si => si.ExpenseCategoryId == parentID);
                //parentId = expense.ParentExpenseCategoryId;
                //db.ac_ExpenseCategory.DeleteObject(expense);
                //db.SaveChanges();
                //return db.ac_ExpenseCategory.Where(con => ((parentId == null && con.ParentExpenseCategoryId == null) || (con.ParentExpenseCategoryId == parentId))).OrderBy(o => o.Expense)
                //.Select(ad => new { value = ad.Expense, id = ad.ExpenseCategoryId });
                //}
                else if (table.ToLower() == "property")
                {
                    if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canEditProperty"))
                    {
                        return Json(new { isDone = false, msg = "notAllowed" });
                    }
                    inv_Property property = db.inv_Property.Single(pr => pr.PropertyId == parentID);
                    parentId = property.PropertyId;
                    db.inv_Property.DeleteObject(property);
                    db.SaveChanges();
                    return Json(db.inv_Property.Where(con => ((parentId == null && con.ParentId == null) || (con.ParentId == parentId))).OrderBy(o => o.Property)
                    .Select(ad => Json(new { value = ad.Property, id = ad.PropertyId })));
                }
                else if (table.ToLower() == "account")
                {
                    if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canEditProperty"))
                    {
                        return Json(new { isDone = false, msg = "notAllowed" });
                    }
                    ac_Account account = db.ac_Account.Single(pr => pr.AccountId == parentID);
                    parentId = account.AccountId;
                    db.ac_Account.DeleteObject(account);
                    db.SaveChanges();
                    return Json(db.ac_Account.Where(con => ((parentId == null && con.AccountId == null) || (con.AccountId == parentId))).OrderBy(o => o.Name)
                    .Select(ad => new { value = ad.Name, id = ad.AccountId, ad.Code, ad.Level }));
                }
                else return null;
            }
            catch (Exception ex) { return Json(new { isDone = false, msg = ex.Message }); }

        }

        public ActionResult Add()
        {
            MapiDBEntities db = new MapiDBEntities();
            int? parentID = null;
            if (!string.IsNullOrEmpty(Request["selectedValue"]))
                parentID = Convert.ToInt32(Request["selectedValue"]);
            string value = Convert.ToString(Request["value"]);
            string table = Convert.ToString(Request["table"]);
            int? accountCode = null;
            if (!string.IsNullOrEmpty(Request["accountCode"]))
                accountCode = Convert.ToInt32(Request["accountCode"]);
            int? accountNature = Convert.ToInt32(Request["accountNature"]);
            int? groupType = Convert.ToInt32(Request["groupType"]);
            try
            {
                if (parentID == null)
                    parentID = null;
                if (table.ToLower() == "address")
                {
                    if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canEditAddress"))
                    {
                        return Json(new { isDone = false, msg = "notAllowed" });
                    }
                    p_Address address = new p_Address() { Address = value, ParentAddressId = parentID, ApplicationId = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationId };
                    db.p_Address.AddObject(address);
                    db.SaveChanges();
                    return Json(new { value = address.Address, id = address.AddressId, action = "add" });
                }
                else if (table.ToLower() == "category")
                {
                    if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canEditCategory"))
                    {
                        return Json(new { isDone = false, msg = "notAllowed" });
                    }
                    inv_Category category = new inv_Category() { Category = value, ParentCategoryId = parentID, ApplicationId = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationId };
                    if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canAddCategory"))
                    {
                        return Json(new { category = category.Category, CategoryId = category.CategoryId });
                    }

                    db.inv_Category.AddObject(category);
                    db.SaveChanges();
                    return Json(new { value = category.Category, id = category.CategoryId, action = "add" });
                }
                else if (table.ToLower() == "measureunit")
                {
                    if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canEditMeasureUnit"))
                    {
                        return Json(new { isDone = false, msg = "notAllowed" });
                    }
                    inv_MeasureUnit category = new inv_MeasureUnit() { UnitType = value, ParentMeasureUnitId = parentID, ApplicationId = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationId };
                    db.inv_MeasureUnit.AddObject(category);
                    db.SaveChanges();
                    return Json(new { value = category.UnitType, id = category.MeasureUnitId, action = "add" });
                }
                //else if (table.ToLower() == "expensecategory")
                //{
                //    if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canEditExpenseCategory"))
                //    {
                //        return new { isDone = false, msg = "notAllowed" };
                //    }
                //ac_ExpenseCategory category = new ac_ExpenseCategory() { Expense = value, ParentExpenseCategoryId = parentID, ApplicationId = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationId };
                //db.ac_ExpenseCategory.AddObject(category);
                //db.SaveChanges();
                //return new { value = category.Expense, id = category.ExpenseCategoryId, action = "add" };
                //}
                else if (table.ToLower() == "property")
                {
                    if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canEditProperty"))
                    {
                        return Json(new { isDone = false, msg = "notAllowed" });
                    }
                    inv_Property property = new inv_Property() { Property = value, ParentId = parentID, ApplicationId = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationId };
                    db.inv_Property.AddObject(property);
                    db.SaveChanges();
                    return Json(new { value = property.Property, id = property.PropertyId, action = "add" });
                }
                else if (table.ToLower() == "account")
                {
                    if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canEditProperty"))
                    {
                        return Json(new { isDone = false, msg = "notAllowed" });
                    }
                    byte level = 1;// parentID == null ? (byte)0 : Convert.ToByte(db.GetParentAccountByID(parentID.Value, "0").Count() + 1);
                    ac_Account account = new ac_Account()
                    {
                        Name = value,
                        Level = level,
                        GroupType = Convert.ToByte(groupType.Value),
                        AccountNature = Convert.ToByte(accountNature.Value),
                        Code = accountCode != null ? Convert.ToInt32(accountCode.Value) : utility.FindAccountCodeByParentId(parentID) + 1,
                        ParentAccountId = parentID,
                        ApplicationId = db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationId,
                        LedgentId = (new MapiOnline.Controllers.ManagementController()).findLedgentAccId(parentID.Value)
                    };
                    db.ac_Account.AddObject(account);
                    db.SaveChanges();
                    return Json(new { value = account.Name, id = account.AccountId, action = "add" });
                }
                else return null;
            }
            catch (Exception ex) { return null; }

        }


        [HttpPost]
        public ActionResult Update()
        {
            MapiDBEntities db = new MapiDBEntities();
            int? parentID = null;
            if (!string.IsNullOrEmpty(Request["selectedValue"]))
                parentID = Convert.ToInt32(Request["selectedValue"]);
            string value = Convert.ToString(Request["value"]);
            string table = Convert.ToString(Request["table"]);
            int? accountCode = null;
            if (!string.IsNullOrEmpty(Request["accountCode"]))
                accountCode = Convert.ToInt32(Request["accountCode"]);
            int? accountNature = Convert.ToInt32(Request["accountNature"]);
            int? groupType = Convert.ToInt32(Request["groupType"]);

            try
            {
                List<string> userRoles = utility.GetUserRoles(db, User.Identity.Name, Membership.ApplicationName);
                if (table.ToLower() == "address")
                {
                    if (!userRoles.Contains("canEditAddress"))
                    {
                        return Json(new { isDone = false, msg = "notAllowed" });
                    }
                    p_Address address = db.p_Address.Single(s => s.AddressId == parentID);
                    address.Address = value;
                    db.SaveChanges();
                    return Json(db.p_Address.Where(con => ((parentID == null && con.ParentAddressId == null) || (con.ParentAddressId == parentID))).OrderBy(o => o.Address)
                    .Select(ad => new { value = ad.Address, id = ad.AddressId }));
                }
                else if (table.ToLower() == "category")
                {
                    if (!userRoles.Contains("canEditCategory"))
                    {
                        return Json(new { isDone = false, msg = "notAllowed" });
                    }
                    inv_Category category = db.inv_Category.Single(s => s.CategoryId == parentID);
                    if (!userRoles.Contains("canAddCategory") && !userRoles.Contains("canDeleteCategory"))
                    {
                        return Json(db.inv_Category.Where(con => ((parentID == null && con.ParentCategoryId == null) || (con.ParentCategoryId == parentID))).OrderBy(o => o.Category)
                    .Select(ad => new { value = ad.Category, id = ad.CategoryId }));
                    }
                    category.Category = value;
                    db.SaveChanges();
                    return Json(db.inv_Category.Where(con => ((parentID == null && con.ParentCategoryId == null) || (con.ParentCategoryId == parentID))).OrderBy(o => o.Category)
                    .Select(ad => new { value = ad.Category, id = ad.CategoryId }));
                }
                else if (table.ToLower() == "measureunit")
                {
                    if (!userRoles.Contains("canEditMeasureUnit"))
                    {
                        return Json(new { isDone = false, msg = "notAllowed" });
                    }
                    inv_MeasureUnit category = db.inv_MeasureUnit.Single(s => s.MeasureUnitId == parentID);
                    category.UnitType = value;
                    db.SaveChanges();
                    return Json(db.inv_MeasureUnit.Where(con => ((parentID == null && con.ParentMeasureUnitId == null) || (con.ParentMeasureUnitId == parentID))).OrderBy(o => o.UnitType)
                    .Select(ad => new { value = ad.UnitType, id = ad.MeasureUnitId }));
                }
                //else if (table.ToLower() == "expensecategory")
                //{
                //    if (!userRoles.Contains("canEditExpenseCategory"))
                //    {
                //        return new { isDone = false, msg = "notAllowed" };
                //    }
                //ac_ExpenseCategory expense = db.ac_ExpenseCategory.Single(s => s.ExpenseCategoryId == parentID);
                //expense.Expense = value;
                //db.SaveChanges();
                //return db.ac_ExpenseCategory.Where(con => ((parentID == null && con.ParentExpenseCategoryId == null) || (con.ParentExpenseCategoryId == parentID))).OrderBy(o => o.Expense)
                //.Select(ad => new { value = ad.Expense, id = ad.ExpenseCategoryId });
                //}
                else if (table.ToLower() == "property")
                {
                    if (!userRoles.Contains("canEditProperty"))
                    {
                        return Json(new { isDone = false, msg = "notAllowed" });
                    }
                    inv_Property property = db.inv_Property.Single(p => p.PropertyId == parentID);
                    property.Property = value;
                    db.SaveChanges();
                    return Json(db.inv_Property.Where(con => ((parentID == null && con.ParentId == null) || (con.ParentId == parentID))).OrderBy(o => o.Property)
                    .Select(ad => Json(new { value = ad.Property, id = ad.PropertyId })));
                }
                else if (table.ToLower() == "account")
                {
                    if (!userRoles.Contains("canEditProperty"))
                    {
                        return Json(new { isDone = false, msg = "notAllowed" });
                    }
                    ac_Account property = db.ac_Account.Single(p => p.AccountId == parentID);
                    property.Name = value;
                    if (accountCode != null)
                        property.Code = accountCode.Value;
                    property.AccountNature = Convert.ToByte(accountNature.Value);
                    property.GroupType = Convert.ToByte(groupType.Value);
                    db.SaveChanges();
                    return Json(db.ac_Account.Where(con => ((parentID == null && con.ParentAccountId == null) || (con.ParentAccountId == parentID))).OrderBy(o => o.Name)
                    .Select(ad => new { value = ad.Name, id = ad.AccountId, ad.Code, ad.Level }));
                }
                else return Json(new { isDone = false, msg = "error" });
            }
            catch (Exception ex)
            {
                return Json(Json(new { isDone = false, msg = ex.Message }));
            }
        }
        [ChildActionOnly]
        public ActionResult BuildAddressHierarchy(HierarchyInfo options)
        {
            return PartialView(options);
        }
        [ChildActionOnly]
        public ActionResult bindXmlDropDownData(XmlDropDownData options)
        {
            return PartialView(options);
        }




        public ActionResult GetComboItems(string path)
        {
            XDocument xmlDoc = XDocument.Load(Server.MapPath("~/" + path + ".xml"));
            var res = xmlDoc.Elements("root").Elements("Title").Select(s => new { id = s.Attribute("Id").Value.ToString(), name = s.Attribute("Title").Value });
            return Json(res);
        }

        public ActionResult AddXML(string value, string path)
        {
            XDocument xmlDoc = XDocument.Load(Server.MapPath("~/" + path + ".xml"));
            int id = int.Parse(xmlDoc.Elements("root").Elements("Title").Last().Attribute("Id").Value) + 1;
            xmlDoc.Element("root").Add(new XElement("Title", new XAttribute("Title", value), new XAttribute("Id", id)));
            xmlDoc.Save(Server.MapPath("~/" + path + ".xml"));
            return Json(xmlDoc.Elements("root").Elements("Title").Select(s => new { id = s.Attribute("Id").Value.ToString(), name = s.Attribute("Title").Value }));
        }

        public ActionResult Delete(int id, string path)
        {
            XDocument xmlDoc = XDocument.Load(Server.MapPath("~/" + path + ".xml"));
            xmlDoc.Element("root").Elements("Title").Where(t => t.Attribute("Id").Value == id.ToString()).Remove();
            xmlDoc.Save(Server.MapPath("~/" + path + ".xml"));
            return Json(xmlDoc.Elements("root").Elements("Title").Select(s => new { id = s.Attribute("Id").Value.ToString(), name = s.Attribute("Title").Value }));
        }

        public ActionResult Update(int id, string value, string path)
        {

            XDocument xmlDoc = XDocument.Load(Server.MapPath("~/" + path + ".xml"));
            xmlDoc.Element("root").Elements("Title").Single(t => t.Attribute("Id").Value == id.ToString()).SetAttributeValue("Title", value);
            xmlDoc.Save(Server.MapPath("~/" + path + ".xml"));
            return Json(xmlDoc.Elements("root").Elements("Title").Select(s => new { id = s.Attribute("Id").Value.ToString(), name = s.Attribute("Title").Value }));

        }



        public ActionResult GetComboItemsRaw(string table)
        {

            if (table.ToLower() == "restriction")
            {
                return Json(db.inv_Restriction.Select(r => new { id = r.RestrictionId, value = r.Restriction }));
            }
            //if (table.ToLower() == "ordertype")
            //{
            //    return Json(db.ac_OrderType.Select(o => new { o.OrderTypeId, o.OrderType }).AsEnumerable().Select(r => new { id = r.OrderTypeId, value = r.OrderType + " " + r.OrderTypeId }));
            //}
            else
                return null;
        }

        public ActionResult AddRaw(string value, string table)
        {
            if (table.ToLower() == "restriction")
            {
                if (!utility.isInRole(db, User.Identity.Name, appName, "canEditAddress"))
                {
                    return Json(new { isDone = false, msg = "notAllowed" });
                }
                inv_Restriction restriction = new inv_Restriction() { Restriction = value };
                db.inv_Restriction.AddObject(restriction);
                db.SaveChanges();

                return Json(new { value = restriction.Restriction, id = restriction.RestrictionId });
            }
            //if (table.ToLower() == "ordertype")
            //{
            //    if (!utility.isInRole(db, User.Identity.Name, appName, "Application"))
            //    {
            //        return Json(new { isDone = false, msg = "notAllowed" });
            //    }
            //ac_OrderType m = new ac_OrderType() { OrderType = value };
            //db.ac_OrderType.AddObject(m);
            //db.SaveChanges();

                //return Json(db.ac_OrderType.Select(o => new { o.OrderTypeId, o.OrderType }).AsEnumerable().Select(r => new { id = r.OrderTypeId, value = r.OrderType + " " + r.OrderTypeId }));
            //}
            else
                return null;

        }

        public ActionResult DeleteRaw(int id, string table)
        {
            if (table.ToLower() == "restriction")
            {
                if (!utility.isInRole(db, User.Identity.Name, appName, "canEditAddress"))
                {
                    return Json(new { isDone = false, msg = "notAllowed" });
                }
                db.inv_Restriction.DeleteObject(db.inv_Restriction.Single(si => si.RestrictionId == id));
                db.SaveChanges();
                return Json(db.inv_Restriction.Select(r => new { id = r.RestrictionId, value = r.Restriction }));
            }
            //if (table.ToLower() == "ordertype")
            //{
            //    if (!utility.isInRole(db, User.Identity.Name, appName, "Application"))
            //    {
            //        return Json(new { isDone = false, msg = "notAllowed" });
            //    }
            //    db.ac_OrderType.DeleteObject(db.ac_OrderType.Single(si => si.OrderTypeId == id));
            //    db.SaveChanges();
            //    return Json(db.ac_OrderType.Select(o => new { o.OrderTypeId, o.OrderType }).AsEnumerable().Select(r => new { id = r.OrderTypeId, value = r.OrderType + " " + r.OrderTypeId }));
            //}
            else
                return null;
        }

        public ActionResult UpdateRaw(int id, string value, string table)
        {
            if (table.ToLower() == "restriction")
            {
                if (!utility.isInRole(db, User.Identity.Name, appName, "canEditAddress"))
                {
                    return Json(new { isDone = false, msg = "notAllowed" });
                }
                inv_Restriction restriction = db.inv_Restriction.Single(s => s.RestrictionId == id);
                restriction.Restriction = value;
                db.SaveChanges();
                return Json(db.inv_Restriction.Select(r => new { id = r.RestrictionId, value = r.Restriction }));
            }
            //if (table.ToLower() == "ordertype")
            //{
            //    if (!utility.isInRole(db, User.Identity.Name, Session["appName"].ToString(), "Application"))
            //    {
            //        return Json(new { isDone = false, msg = "notAllowed" });
            //    }
            //ac_OrderType m = db.ac_OrderType.Single(s => s.OrderTypeId == id);
            //m.OrderType = value;
            //db.SaveChanges();
            //return Json(db.ac_OrderType.Select(o => new { o.OrderTypeId, o.OrderType }).AsEnumerable().Select(r => new { id = r.OrderTypeId, value = r.OrderType + " " + r.OrderTypeId }));
            //}
            else

                return null;
        }


    }
}