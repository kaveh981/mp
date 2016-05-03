using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Threading;
using System.Xml.Linq;
namespace MapiOnline
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}/{id}", // URL with parameters
                new { controller = "Home", action = "Index", id = UrlParameter.Optional } // Parameter defaults
            );

        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);

            Application.Add("Online", 0);
        }
        protected void Session_Start()
        {

            try
            {
                Session.Add("Login", 1);
                Application.Lock();
                Application["Online"] = (int)Application["Online"] + 1;
                Application.UnLock();

                System.Threading.Thread l = new System.Threading.Thread(utility.GetCountryByIP);
                object[] lParameters = new object[] { utility.GetUserIP(), HttpContext.Current.Server.MapPath("~/Data/Logs.xml"), HttpContext.Current.Request.Browser.Type };
                l.Start(lParameters);

                //XDocument xmlDoc = XDocument.Load(Server.MapPath("~/Data/Logs.xml"));
                //int count = xmlDoc.Element("root").Elements("Log").Count();
                //xmlDoc.Element("root").Add(new XElement("Log", new XAttribute("Id", count + 1), new XAttribute("IP", utility.GetUserIP()), new XAttribute("Browser", Request.Browser.Type), new XAttribute("DateTime", DateTime.Now)
                //    , new XAttribute("AppName", System.Web.Security.Membership.ApplicationName)));
                //xmlDoc.Save(Server.MapPath("~/Data/Logs.xml"));
            }
            catch (Exception ex)
            {

            }
        }
        public override string GetVaryByCustomString(HttpContext context, string custom)
        {
            // Check for culture type of cachine
            if (custom == "culture")
            {
                // culture name (e.g. "en-US") is what should vary caching
                return Thread.CurrentThread.CurrentCulture.Name;
            }
            else
                return base.GetVaryByCustomString(context, custom);
        }

        protected void Session_End(object sender, EventArgs e)
        {
            Session.RemoveAll();
            Session.Abandon();
            Application.Lock();
            Application["Online"] = (int)Application["Online"] - 1;
            Application.UnLock();
        }

    }
}