using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MapiOnline.Models;
using System.Web.Security;
using System.Data.Objects.DataClasses;
using System.Xml.Linq;

namespace MapiOnline.Controllers
{
    public class XmlDropDownController : Controller
    {
        MapiDBEntities db = new MapiDBEntities();
        public string GetTitleValue(int? tiltleid)
        {
            if (tiltleid != null)
            {
                return XDocument.Load(this.Server.MapPath("~/XmlData/jobTitle.xml")).Elements("root").Elements("Title").Single(d => d.Attribute("Id").Value == tiltleid.Value.ToString()).Attribute("Title").Value;
            }
            else
                return "";
        }
       
     
        [HttpPost]
        public ActionResult GetComboItems(string path)
        {
            XDocument xmlDoc = XDocument.Load(Server.MapPath("~/" + path + ".xml"));
            var d = xmlDoc.Elements("root").Elements("Title").Select(s => new { id = s.Attribute("Id").Value.ToString(), name = s.Attribute("Title").Value });
            return Json(d);
        }
        [HttpPost]
        public ActionResult Add(string value, string path)
        {
            XDocument xmlDoc = XDocument.Load(Server.MapPath("~/" + path + ".xml"));
            int id = int.Parse(xmlDoc.Elements("root").Elements("Title").Last().Attribute("Id").Value) + 1;
            xmlDoc.Element("root").Add(new XElement("Title", new XAttribute("Title", value), new XAttribute("Id", id)));
            xmlDoc.Save(Server.MapPath("~/" + path + ".xml"));
            var d = xmlDoc.Elements("root").Elements("Title").Select(s => new { id = s.Attribute("Id").Value.ToString(), name = s.Attribute("Title").Value });
            return Json(d);
        }
        [HttpPost]
        public ActionResult Delete(int id, string path)
        {
            XDocument xmlDoc = XDocument.Load(Server.MapPath("~/" + path + ".xml"));
            xmlDoc.Element("root").Elements("Title").Where(t => t.Attribute("Id").Value == id.ToString()).Remove();
            xmlDoc.Save(Server.MapPath("~/" + path + ".xml"));
            var d = xmlDoc.Elements("root").Elements("Title").Select(s => new { id = s.Attribute("Id").Value.ToString(), name = s.Attribute("Title").Value });
            return Json(d);
        }
        [HttpPost]
        public ActionResult Update(int id, string value, string path)
        {
            XDocument xmlDoc = XDocument.Load(Server.MapPath("~/" + path + ".xml"));
            xmlDoc.Element("root").Elements("Title").Single(t => t.Attribute("Id").Value == id.ToString()).SetAttributeValue("Title", value);
            xmlDoc.Save(Server.MapPath("~/" + path + ".xml"));
            var d = xmlDoc.Elements("root").Elements("Title").Select(s => new { id = s.Attribute("Id").Value.ToString(), name = s.Attribute("Title").Value });
            return Json(d);
        }


        [HttpPost]
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
        [HttpPost]
        public ActionResult AddRaw(string value, string table)
        {

            if (table.ToLower() == "restriction")
            {
                if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canEditAddress"))
                {
                    return Json(new { isDone = false, msg = "notAllowed" });
                }
                inv_Restriction restriction = new inv_Restriction() { Restriction = value };
                db.inv_Restriction.AddObject(restriction);
                db.SaveChanges();

                return Json(db.inv_Restriction.Select(r => new { id = r.RestrictionId, value = r.Restriction }));
            }
            //if (table.ToLower() == "ordertype")
            //{
            //    //if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "Application"))
            //    //{
            //    //    return Json(new { isDone = false, msg = "notAllowed" });
            //    //}
            //    //ac_OrderType m = new ac_OrderType() { OrderType = value };
            //    //db.ac_OrderType.AddObject(m);
            //    //db.SaveChanges();

            //    //return Json(db.ac_OrderType.Select(o => new { o.OrderTypeId, o.OrderType }).AsEnumerable().Select(r => new { id = r.OrderTypeId, value = r.OrderType + " " + r.OrderTypeId }));
            //}
            else
                return null;

        }
        [HttpPost]
        public ActionResult DeleteRaw(int id, string table)
        {
            if (table.ToLower() == "restriction")
            {
                if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canEditAddress"))
                {
                    return Json(new { isDone = false, msg = "notAllowed" });
                }
                db.inv_Restriction.DeleteObject(db.inv_Restriction.Single(si => si.RestrictionId == id));
                db.SaveChanges();
                return Json(db.inv_Restriction.Select(r => new { id = r.RestrictionId, value = r.Restriction }));
            }
            //if (table.ToLower() == "ordertype")
            //{
            //    if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "Application"))
            //    {
            //        return Json(new { isDone = false, msg = "notAllowed" });
            //    }
                //db.ac_OrderType.DeleteObject(db.ac_OrderType.Single(si => si.OrderTypeId == id));
                //db.SaveChanges();
                //return Json(db.ac_OrderType.Select(o => new { o.OrderTypeId, o.OrderType }).AsEnumerable().Select(r => new { id = r.OrderTypeId, value = r.OrderType + " " + r.OrderTypeId }));
            //}
            else
                return null;
        }
        [HttpPost]
        public ActionResult UpdateRaw(int id, string value, string table)
        {

            if (table.ToLower() == "restriction")
            {
                if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "canEditAddress"))
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
            //    if (!utility.isInRole(db, User.Identity.Name, Membership.ApplicationName, "Application"))
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
