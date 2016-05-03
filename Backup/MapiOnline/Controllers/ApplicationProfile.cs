using System;
using System.Web.Profile;

namespace Profile
{
    public class ApplicationProfile : ProfileBase
    {
        //[SettingsAllowAnonymous(false)]
        //[ProfileProvider("EmployeeInfoProvider")]
        public ApplicationInfo ApplicationInfo
        {
            get { return (ApplicationInfo)base["ApplicationInfo"]; }
            set { base["ApplicationInfo"] = value; }
        }
    }

    public class ApplicationInfo
    {
        public string[] Roles;
        public DateTime StartingDate;
        public DateTime ExpieryDate;
        public int EmployeeLimit;
        public int CounterLimit;
        public int BranchLimit;
        public decimal SmsCredit;
        public Int64 SmsNumber;
        
    }
}