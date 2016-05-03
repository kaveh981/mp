using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MapiOnline.Models;

namespace MapiOnline.Controllers
{ 
    public class testController : Controller
    {
        private MapiDBEntities db = new MapiDBEntities();

        //
        // GET: /test/

        public ViewResult Index()
        {
            var ac_orderheader = db.ac_OrderHeader.Include("ac_Counter").Include("ac_CurrencyRate").Include("inv_Shop").Include("p_Employee").Include("p_Employee1").Include("ac_ReceiverDetails").Include("ac_FiscalPeriod").Include("p_Person");
            return View(ac_orderheader.ToList());
        }

        //
        // GET: /test/Details/5

        public ViewResult Details(int id)
        {
            ac_OrderHeader ac_orderheader = db.ac_OrderHeader.Single(a => a.OrderHeaderId == id);
            return View(ac_orderheader);
        }

        //
        // GET: /test/Create

        public ActionResult Create()
        {
            ViewBag.CounterId = new SelectList(db.ac_Counter, "AccountId", "AccountId");
            ViewBag.CurrencyRateId = new SelectList(db.ac_CurrencyRate, "CurrencyRateId", "CurrencyRateId");
            ViewBag.ShopId = new SelectList(db.inv_Shop, "ShopId", "Fax");
            ViewBag.EmployeeId = new SelectList(db.p_Employee, "AccountId", "AccountNumber");
            ViewBag.ConfirmerId = new SelectList(db.p_Employee, "AccountId", "AccountNumber");
            ViewBag.OrderHeaderId = new SelectList(db.ac_ReceiverDetails, "OrderHeaderID", "Name");
            ViewBag.FiscalPeriodId = new SelectList(db.ac_FiscalPeriod, "FiscalPeriodId", "Name");
            ViewBag.ClientId = new SelectList(db.p_Person, "AccountId", "Name");
            return View();
        } 

        //
        // POST: /test/Create

        [HttpPost]
        public ActionResult Create(ac_OrderHeader ac_orderheader)
        {
            if (ModelState.IsValid)
            {
                db.ac_OrderHeader.AddObject(ac_orderheader);
                db.SaveChanges();
                return RedirectToAction("Index");  
            }

            ViewBag.CounterId = new SelectList(db.ac_Counter, "AccountId", "AccountId", ac_orderheader.CounterId);
            ViewBag.CurrencyRateId = new SelectList(db.ac_CurrencyRate, "CurrencyRateId", "CurrencyRateId", ac_orderheader.CurrencyRateId);
            ViewBag.ShopId = new SelectList(db.inv_Shop, "ShopId", "Fax", ac_orderheader.ShopId);
            ViewBag.EmployeeId = new SelectList(db.p_Employee, "AccountId", "AccountNumber", ac_orderheader.EmployeeId);
            ViewBag.ConfirmerId = new SelectList(db.p_Employee, "AccountId", "AccountNumber", ac_orderheader.ConfirmerId);
            ViewBag.OrderHeaderId = new SelectList(db.ac_ReceiverDetails, "OrderHeaderID", "Name", ac_orderheader.OrderHeaderId);
            ViewBag.FiscalPeriodId = new SelectList(db.ac_FiscalPeriod, "FiscalPeriodId", "Name", ac_orderheader.FiscalPeriodId);
            ViewBag.ClientId = new SelectList(db.p_Person, "AccountId", "Name", ac_orderheader.ClientId);
            return View(ac_orderheader);
        }
        
        //
        // GET: /test/Edit/5
 
        public ActionResult Edit(int id)
        {
            ac_OrderHeader ac_orderheader = db.ac_OrderHeader.Single(a => a.OrderHeaderId == id);
            ViewBag.CounterId = new SelectList(db.ac_Counter, "AccountId", "AccountId", ac_orderheader.CounterId);
            ViewBag.CurrencyRateId = new SelectList(db.ac_CurrencyRate, "CurrencyRateId", "CurrencyRateId", ac_orderheader.CurrencyRateId);
            ViewBag.ShopId = new SelectList(db.inv_Shop, "ShopId", "Fax", ac_orderheader.ShopId);
            ViewBag.EmployeeId = new SelectList(db.p_Employee, "AccountId", "AccountNumber", ac_orderheader.EmployeeId);
            ViewBag.ConfirmerId = new SelectList(db.p_Employee, "AccountId", "AccountNumber", ac_orderheader.ConfirmerId);
            ViewBag.OrderHeaderId = new SelectList(db.ac_ReceiverDetails, "OrderHeaderID", "Name", ac_orderheader.OrderHeaderId);
            ViewBag.FiscalPeriodId = new SelectList(db.ac_FiscalPeriod, "FiscalPeriodId", "Name", ac_orderheader.FiscalPeriodId);
            ViewBag.ClientId = new SelectList(db.p_Person, "AccountId", "Name", ac_orderheader.ClientId);
            return View(ac_orderheader);
        }

        //
        // POST: /test/Edit/5

        [HttpPost]
        public ActionResult Edit(ac_OrderHeader ac_orderheader)
        {
            if (ModelState.IsValid)
            {
                db.ac_OrderHeader.Attach(ac_orderheader);
                db.ObjectStateManager.ChangeObjectState(ac_orderheader, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CounterId = new SelectList(db.ac_Counter, "AccountId", "AccountId", ac_orderheader.CounterId);
            ViewBag.CurrencyRateId = new SelectList(db.ac_CurrencyRate, "CurrencyRateId", "CurrencyRateId", ac_orderheader.CurrencyRateId);
            ViewBag.ShopId = new SelectList(db.inv_Shop, "ShopId", "Fax", ac_orderheader.ShopId);
            ViewBag.EmployeeId = new SelectList(db.p_Employee, "AccountId", "AccountNumber", ac_orderheader.EmployeeId);
            ViewBag.ConfirmerId = new SelectList(db.p_Employee, "AccountId", "AccountNumber", ac_orderheader.ConfirmerId);
            ViewBag.OrderHeaderId = new SelectList(db.ac_ReceiverDetails, "OrderHeaderID", "Name", ac_orderheader.OrderHeaderId);
            ViewBag.FiscalPeriodId = new SelectList(db.ac_FiscalPeriod, "FiscalPeriodId", "Name", ac_orderheader.FiscalPeriodId);
            ViewBag.ClientId = new SelectList(db.p_Person, "AccountId", "Name", ac_orderheader.ClientId);
            return View(ac_orderheader);
        }

        //
        // GET: /test/Delete/5
 
        public ActionResult Delete(int id)
        {
            ac_OrderHeader ac_orderheader = db.ac_OrderHeader.Single(a => a.OrderHeaderId == id);
            return View(ac_orderheader);
        }

        //
        // POST: /test/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {            
            ac_OrderHeader ac_orderheader = db.ac_OrderHeader.Single(a => a.OrderHeaderId == id);
            db.ac_OrderHeader.DeleteObject(ac_orderheader);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}