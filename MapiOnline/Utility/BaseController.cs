using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Threading;
using MvcInternationalization.Utility;
using System.Globalization;


namespace MvcInternationalization.Controllers
{
    public class BaseController : Controller
    {

        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {

            // Is it View ?
            ViewResultBase view = filterContext.Result as ViewResultBase;
            if (view == null) // if not exit
                return;

            string cultureName =  "fa-IR";// "en-US";// Thread.CurrentThread.CurrentCulture.Name; // e.g. "en-US" // filterContext.HttpContext.Request.UserLanguages[0]; // needs validation return "en-us" as default            

            // Is it default culture? exit
            if (cultureName == CultureHelper.GetDefaultCulture())
                return;

            
            // Are views implemented separately for this culture?  if not exit
            bool viewImplemented = CultureHelper.IsViewSeparate(cultureName);
            if (viewImplemented == false)
                return;
            
            string viewName = view.ViewName;

            int i = 0;

            if (string.IsNullOrEmpty(viewName))
            {
                if (ViewExists(filterContext.RouteData.Values["action"] + "." + cultureName))
                    viewName = filterContext.RouteData.Values["action"] + "." + cultureName; // Index.en-US
                else
                    viewName = filterContext.RouteData.Values["action"].ToString();

            }
            else if ((i = viewName.IndexOf('.')) > 0)
            {
                // contains . like "Index.cshtml"                
                viewName = viewName.Substring(0, i + 1) + cultureName + viewName.Substring(i);
            }
            else
                viewName += "." + cultureName; // e.g. "Index" ==> "Index.en-Us"


            view.ViewName = viewName;

            filterContext.Controller.ViewBag._culture = "." + cultureName;

            base.OnActionExecuted(filterContext);
        }
        private bool ViewExists(string name)
        {
            ViewBag.deliveryExpense = 1000;
            ViewEngineResult result = ViewEngines.Engines.FindView(ControllerContext, name, null);
            return (result.View != null);
        }

        protected override void ExecuteCore()
        {
            string cultureName = null;
            // Attempt to read the culture cookie from Request
            HttpCookie cultureCookie = Request.Cookies["_culture"];
            if (cultureCookie != null)
                cultureName = cultureCookie.Value;
            else if (Request.UserLanguages != null)
            {
                cultureName = Request.UserLanguages[0]; // obtain it from HTTP header AcceptLanguages
            }

            // Validate culture name
            cultureName =  CultureHelper.GetValidCulture(cultureName); // This is safe

            // Modify current thread's culture            
            Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(cultureName);
            Thread.CurrentThread.CurrentUICulture = CultureInfo.CreateSpecificCulture(cultureName);
            try
            {
                base.ExecuteCore();
            }
            catch(Exception ex)
            {
                utility.emailErrorLog(ex, "ExecuteCore");
            }
          
        }
    }
    //public abstract class ViewModelBase
    //{
    //    public string Name { get; set; }
    //    public bool isAdmin { get; set; }
    //}

    //public class HomeViewModel : ViewModelBase
    //{
    //}
}
