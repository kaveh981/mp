using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Globalization;
using System.Data.Objects;
using System.Web.Security;
using MapiOnline.Models;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Net.Security;
using System.Xml.Linq;
using System.IO;
using System.Xml;
using System.Collections.Specialized;
using System.Web.Services;
using System.Xml.Schema;
using System.Web.SessionState;
using System.Data.Objects.DataClasses;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Profile;
/// <summary>
/// Summary description for utility
/// </summary>
public class utility
{
    MapiDBEntities db = new MapiDBEntities();

    public static void GetCountryByIP(object parameters)
    {
        try
        {
            
            object[] parameterArray = (object[])parameters;
            string api_key = "d06db40aee5646d3665747a3f45317a8b5a08c493dc8aa556e4c0e2f5d4a1ed4";
            // string ipResponse = IPRequestHelper("http://ipinfodb.com/ip_query_country.php?ip=", (string)parameterArray[0]);
            string myxml = "http://api.ipinfodb.com/v3/ip-city/?key=" + api_key + "&ip=" + (string)parameterArray[0] + "&format=xml";
            XmlDocument ipInfoXML = new XmlDocument();
            ipInfoXML.Load(myxml);
            XmlNodeList responseXML = ipInfoXML.GetElementsByTagName("Response");
            //<statusCode>OK</statusCode><statusMessage></statusMessage><ipAddress>127.0.0.1</ipAddress><countryCode>-</countryCode><countryName>-</countryName><regionName>-</regionName><cityName>-</cityName><zipCode>-</zipCode><latitude>0</latitude><longitude>0</longitude><timeZone>-</timeZone>
            XDocument xmlDoc = XDocument.Load((string)parameterArray[1]);
            XmlElement ipInfo = (System.Xml.XmlElement)(responseXML.Item(0));
            if (ipInfo.GetElementsByTagName("countryName").Item(0).InnerText != "UNITED STATES")
            {
                int count = xmlDoc.Element("root").Elements("Log").Count();
                xmlDoc.Element("root").Add(new XElement("Log", new XAttribute("Id", count + 1), new XAttribute("IP", ipInfo.GetElementsByTagName("ipAddress").Item(0).InnerText), new XAttribute("countryName", ipInfo.GetElementsByTagName("countryName").Item(0).InnerText), new XAttribute("cityName", ipInfo.GetElementsByTagName("cityName").Item(0).InnerText), new XAttribute("timeZone", ipInfo.GetElementsByTagName("timeZone").Item(0).InnerText), new XAttribute("Browser", (string)parameterArray[2]), new XAttribute("DateTime", DateTime.Now)
                    , new XAttribute("AppName", System.Web.Security.Membership.ApplicationName)));
                xmlDoc.Save((string)parameterArray[1]);
            }
        }
        catch (Exception ex)
        {

        }
    }

    public static void SubscribeUser(object parameters)
    {
        try
        {
            object[] parameterArray = (object[])parameters;
            string api_key = "d06db40aee5646d3665747a3f45317a8b5a08c493dc8aa556e4c0e2f5d4a1ed4";
            // string ipResponse = IPRequestHelper("http://ipinfodb.com/ip_query_country.php?ip=", (string)parameterArray[0]);
            string myxml = "http://api.ipinfodb.com/v3/ip-city/?key=" + api_key + "&ip=" + (string)parameterArray[0] + "&format=xml";
            XmlDocument ipInfoXML = new XmlDocument();
            ipInfoXML.Load(myxml);
            XmlNodeList responseXML = ipInfoXML.GetElementsByTagName("Response");
            //<statusCode>OK</statusCode><statusMessage></statusMessage><ipAddress>127.0.0.1</ipAddress><countryCode>-</countryCode><countryName>-</countryName><regionName>-</regionName><cityName>-</cityName><zipCode>-</zipCode><latitude>0</latitude><longitude>0</longitude><timeZone>-</timeZone>
            XDocument xmlDoc = XDocument.Load((string)parameterArray[1]);
            XmlElement ipInfo = (System.Xml.XmlElement)(responseXML.Item(0));
            
                int count = xmlDoc.Element("root").Elements("Log").Count();
                xmlDoc.Element("root").Add(new XElement("Log", new XAttribute("Id", count + 1), new XAttribute("IP", ipInfo.GetElementsByTagName("ipAddress").Item(0).InnerText), new XAttribute("countryName", ipInfo.GetElementsByTagName("countryName").Item(0).InnerText), new XAttribute("cityName", ipInfo.GetElementsByTagName("cityName").Item(0).InnerText), new XAttribute("timeZone", ipInfo.GetElementsByTagName("timeZone").Item(0).InnerText), new XAttribute("Browser", (string)parameterArray[2]), new XAttribute("DateTime", DateTime.Now), new XAttribute("Email", (string)parameterArray[3])
                    , new XAttribute("AppName", System.Web.Security.Membership.ApplicationName)));
                xmlDoc.Save((string)parameterArray[1]);
            
        }
        catch (Exception ex)
        {

        }
    }

    public static void GetCountryByIPForManagement(object parameters)
    {
        try
        {
            object[] parameterArray = (object[])parameters;
            string api_key = "d06db40aee5646d3665747a3f45317a8b5a08c493dc8aa556e4c0e2f5d4a1ed4";
            // string ipResponse = IPRequestHelper("http://ipinfodb.com/ip_query_country.php?ip=", (string)parameterArray[0]);
            string myxml = "http://api.ipinfodb.com/v3/ip-city/?key=" + api_key + "&ip=" + (string)parameterArray[0] + "&format=xml";
            XmlDocument ipInfoXML = new XmlDocument();
            ipInfoXML.Load(myxml);
            XmlNodeList responseXML = ipInfoXML.GetElementsByTagName("Response");
            //<statusCode>OK</statusCode><statusMessage></statusMessage><ipAddress>127.0.0.1</ipAddress><countryCode>-</countryCode><countryName>-</countryName><regionName>-</regionName><cityName>-</cityName><zipCode>-</zipCode><latitude>0</latitude><longitude>0</longitude><timeZone>-</timeZone>
            XDocument xmlDoc = XDocument.Load((string)parameterArray[1]);
            XmlElement ipInfo = (System.Xml.XmlElement)(responseXML.Item(0));

            int count = xmlDoc.Element("root").Elements("Log").Count();
            xmlDoc.Element("root").Add(new XElement("Log", new XAttribute("Id", count + 1), new XAttribute("IP", ipInfo.GetElementsByTagName("ipAddress").Item(0).InnerText), new XAttribute("countryName", ipInfo.GetElementsByTagName("countryName").Item(0).InnerText), new XAttribute("cityName", ipInfo.GetElementsByTagName("cityName").Item(0).InnerText), new XAttribute("timeZone", ipInfo.GetElementsByTagName("timeZone").Item(0).InnerText), new XAttribute("Browser", (string)parameterArray[2]), new XAttribute("DateTime", DateTime.Now)
                , new XAttribute("AppName", parameterArray[4].ToString()), new XAttribute("Username", parameterArray[3].ToString())));
            xmlDoc.Save((string)parameterArray[1]);

        }
        catch (Exception ex)
        {

        }
    }

    public static void emailErrorLog(Exception ex,string method)
    {
        try
        {
            XDocument xmlDoc = XDocument.Load(HttpContext.Current.Server.MapPath("~/Data/errorLogs.xml"));
            xmlDoc.Element("root").Add(new XElement("Error",
                   new XAttribute("Message", ex.Message),
                   new XAttribute("StackTrace", ex.StackTrace),
                   new XAttribute("InnerExceptionMessage", ex.InnerException != null ? ex.InnerException.Message : ""),
                    new XAttribute("DateTime", DateTime.Now.ToString()),
                    new XAttribute("Method", method)
               ));
            xmlDoc.Save(HttpContext.Current.Server.MapPath("~/Data/errorLogs.xml"));
        }
       catch (Exception e)
                {

                }
    }

    public static string IPRequestHelper(string url, string ipAddress)
    {
        string checkURL = url + ipAddress;

        HttpWebRequest objRequest = (HttpWebRequest)WebRequest.Create(checkURL);
        HttpWebResponse objResponse = (HttpWebResponse)objRequest.GetResponse();

        StreamReader responseStream = new StreamReader(objResponse.GetResponseStream());
        string responseRead = responseStream.ReadToEnd();

        responseStream.Close();
        responseStream.Dispose();

        return responseRead;
    }
    public static bool CheckForInternetConnection()
    {
        try
        {
            using (var client = new WebClient())
            using (var stream = client.OpenRead("http://www.google.com"))
            {
                return true;
            }
        }
        catch
        {
            return false;
        }
    }
    public static string GetUserIP()
    {
        string ipList = HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

        if (!string.IsNullOrEmpty(ipList))
        {
            return ipList.Split(',')[0];
        }

        return HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
    }
    public static DateTime GetDateCulture(string Date)
    {
        string[] str = Date.Split('/');
        //bool isPersian = (bool)HttpContext.Current.Session["persian"];
        //if (Session["culture"].ToString() == "fa-IR")
        //{
        //if (isPersian)
        //    return DateTime.Parse(Date);
        //else
        //{
        PersianCalendar pc = new PersianCalendar();
        return pc.ToDateTime(int.Parse(str[2].ToString()), int.Parse(str[1].ToString()), int.Parse(str[0].ToString()), 0, 0, 0, 0);
        //}
        //}
        //else
        //    return DateTime.Parse(string.Format("{0}/{1}/{2}", Yaer, Month, Day));
    }
    public static DateTime GetDateCultureStartByYear(string Date)
    {
        string[] str = Date.Split('/');
        //bool isPersian = (bool)HttpContext.Current.Session["persian"];
        //if (Session["culture"].ToString() == "fa-IR")
        //{
        //if (isPersian)
        //    return DateTime.Parse(Date);
        //else
        //{
        PersianCalendar pc = new PersianCalendar();
        return pc.ToDateTime(int.Parse(str[0].ToString()), int.Parse(str[1].ToString()), int.Parse(str[2].ToString()), 0, 0, 0, 0);
        //}
        //}
        //else
        //    return DateTime.Parse(string.Format("{0}/{1}/{2}", Yaer, Month, Day));
    }
    public static DateTime GetDateStartByYear(string Date)
    {
        string[] str = Date.Split('/');
        //bool isPersian = (bool)HttpContext.Current.Session["persian"];
        //if (Session["culture"].ToString() == "fa-IR")
        //{
        //if (isPersian)
        //    return DateTime.Parse(Date);
        //else
        //{
        PersianCalendar pc = new PersianCalendar();
        return (pc.ToDateTime(int.Parse(str[0].ToString()), int.Parse(str[1].ToString()), int.Parse(str[2].ToString()), 0, 0, 0, 0)).Date;
        //}
        //}
        //else
        //    return DateTime.Parse(string.Format("{0}/{1}/{2}", Yaer, Month, Day));
    }
    public static DateTime GetDateTimeCulture(string Date)
    {

        string[] str = Date.Split('/');

        PersianCalendar pc = new PersianCalendar();
        DateTime now = DateTime.Now;
        return pc.ToDateTime(int.Parse(str[2].ToString()), int.Parse(str[1].ToString()), int.Parse(str[0].ToString()), now.Hour, now.Minute, now.Second, now.Millisecond);
    }

    public static string GetstrDateCulture(DateTime Date)
    {
        //if (Session["culture"].ToString() == "fa-IR")
        //{
        PersianCalendar pc = new PersianCalendar();
        return string.Format("{3}:{4} {2}/{1}/{0}", pc.GetDayOfMonth(Date), pc.GetMonth(Date), pc.GetYear(Date), pc.GetHour(Date), pc.GetMinute(Date));
        //}
        //else
        //    return Date.ToShortDateString();

    }


    public static string GetstrDateCultureSimple(DateTime Date)
    {
        PersianCalendar pc = new PersianCalendar();
        return string.Format("{2}/{1}/{0}", pc.GetDayOfMonth(Date), pc.GetMonth(Date), pc.GetYear(Date));
    }
    public static string GetstrDateCultureSimpleYearLast(DateTime Date)
    {
        PersianCalendar pc = new PersianCalendar();
        return string.Format("{2}/{1}/{0}", pc.GetYear(Date), pc.GetMonth(Date), pc.GetDayOfMonth(Date));
    }
    public static string getStrCategory(ObjectResult<MapiOnline.Models.inv_Category> obj)
    {
        string str = "";
        foreach (var item in obj)
        {
            str += item.Category + "->";
        }
        return str.Substring(0, str.Length - 2);
    }

    public static string getStrAddress(ObjectResult<MapiOnline.Models.p_Address> obj)
    {
        string str = "";
        foreach (var item in obj)
        {
            str += item.Address + "->";
        }
        return str.Substring(0, str.Length - 2);
    }

    public static string getHierarchyDataForGeneralCategory(int? parentID)
    {
        MapiDBEntities db = new MapiDBEntities();
        int?[] i = db.GetSubCategoryByParent(parentID).ToArray();
        string s = "{";
        foreach (int? a in i)
        {
            s = s + a.Value.ToString() + ",";
        }
        return s + parentID.ToString() + "}";
    }

    public static string getHierarchyDataForExpenseCategory(int? parentID)
    {
        //int[] i = new MapiDBEntities().GetSubExpenseCategoryByParent(parentID).Select(c => c.ExpenseCategoryId).ToArray();
        //string s = "{";
        //foreach (int? a in i)
        //{
        //    s = s + a.Value.ToString() + ",";
        //}
        //return s + parentID.ToString() + "}";
        return null;
    }

    public static string getHierarchyDataForAccount(int? parentID)
    {
        int?[] i = new MapiDBEntities().GetSubAccountByParent(parentID).ToArray();
        string s = "{";
        foreach (int? a in i)
        {
            s = s + a.ToString() + ",";
        }
        return s + parentID.ToString() + "}";
    }

    public static string getHierarchyDataForEmployee(int? parentID)
    {
        int?[] i = new MapiDBEntities().GetSubEmployeeByParent(parentID).ToArray();
        string s = "{";
        foreach (int? a in i)
        {
            s = s + a.Value.ToString() + ",";
        }
        return s + parentID.ToString() + "}";
    }
    public static string getCounterForShop(int shopId)
    {
        int[] j = new MapiDBEntities().ac_Counter.Where(c => c.ShopId == shopId).Select(c => c.AccountId).ToArray();
        string s = "{";
        foreach (int a in j)
        {
            s = s + a.ToString() + ",";
        }
        return s + shopId.ToString() + "}";
    }


    public static string getHierarchyDataForAddress(int? parentID)
    {
        int?[] i = new MapiDBEntities().GetSubAddressByParent(parentID).ToArray();
        string s = "{";
        foreach (int? a in i)
        {
            s = s + a.Value.ToString() + ",";
        }
        return s + parentID.ToString() + "}";
    }
    public static List<string> GetUserRoles(MapiDBEntities db, string username, string appname)
    {
        //return db.aspnet_Roles.Any(r => r.RoleName == rolename && r.aspnet_Applications.ApplicationName == appname && r.aspnet_Users.Any(u => u.UserName == username && u.aspnet_Applications.ApplicationName == appname));
        return db.aspnet_Users.Single(u => u.UserName == username && u.aspnet_Applications.ApplicationName == appname).aspnet_Roles.Select(r => r.RoleName).ToList();
    }
    public static bool isInRole(MapiDBEntities db, string username, string appname, string roleName)
    {
        if (!string.IsNullOrEmpty(username))
            return db.aspnet_Users.Single(u => u.UserName == username && u.aspnet_Applications.ApplicationName == appname).aspnet_Roles.Select(r => r.RoleName).Contains(roleName);
        else return false;
    }
    public static DateTime GetDateCulture(string Yaer, string Month, string Day)
    {
        //if (Session["culture"].ToString() == "fa-IR")
        //{
        PersianCalendar pc = new PersianCalendar();
        return pc.ToDateTime(int.Parse(Yaer), int.Parse(Month), int.Parse(Day), 0, 0, 0, 0);

        //}
        //else
        //    return DateTime.Parse(string.Format("{0}/{1}/{2}", Yaer, Month, Day));

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
        catch (Exception ex)
        {

        }
    }

    public static string getCounterForUser(string code)
    {
        IEnumerable<int> j = new MapiOnline.Models.MapiDBEntities().p_Employee.Single(e => e.p_Person.Code == code && e.p_Person.ac_Account.aspnet_Applications.ApplicationName == Membership.ApplicationName).ac_Counter.Select(c => c.AccountId);
        string s = "{";
        foreach (int a in j)
        {
            s = s + a.ToString() + ",";
        }
        s = s.Remove(s.Length - 1, 1);
        return s += "}";
    }

    public static void BypassCertificateError()
    {
        ServicePointManager.ServerCertificateValidationCallback +=
            delegate(
                Object sender1,
                X509Certificate certificate,
                X509Chain chain,
                SslPolicyErrors sslPolicyErrors)
            {
                return true;
            };
    }
    public static string getShopForUser(string code)
    {
        IEnumerable<int> j = new MapiDBEntities().p_Employee.Single(e => e.p_Person.Code == code && e.p_Person.ac_Account.aspnet_Applications.ApplicationName == Membership.ApplicationName).inv_Shop.Select(sh => sh.ShopId);
        string s = "{";
        foreach (int a in j)
        {
            s = s + a.ToString() + ",";
        }
        s = s.Remove(s.Length - 1, 1);
        return s += "}";
    }

    public static int FindAccountCodeByParentId(int? parentId)
    {
        MapiDBEntities db = new MapiDBEntities();
        return db.ac_Account.OrderByDescending(a => a.Code).First().Code;
        if (parentId == null)
        {
            var pa = db.ac_Account.Where(a => a.ParentAccountId == null);
            return pa.Count() > 0 ? pa.OrderByDescending(c => c.Code).First().Code : -1;

        }
        else
        {
            var pa = db.ac_Account.Single(a => a.AccountId == parentId);
            return db.ac_Account.Where(a => a.ParentAccountId == parentId).Count() > 0 ? Convert.ToInt32(pa.Code.ToString() + db.ac_Account.Where(a => a.ParentAccountId == parentId).OrderByDescending(c => c.Code).First().Code.ToString()) : 0;

        }
    }

}
public class SearchResult
{
    public int count { get; set; }
    public IEnumerable<object> results { get; set; }
}



