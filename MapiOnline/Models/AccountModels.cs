using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;


namespace MapiOnline.Models
{
    public class TinyMCE
    {
        public bool CanEdit { get; set; }
        public string MenuName { get; set; }
        public int menuId { get; set; }
        [UIHint("tinymce_jquery_full"), AllowHtml]
        public string Content { get; set; }
    }
    public class SideMenu
    {
        public int MenuId { get; set; }
        public int Order { get; set; }
        public string MenuName { get; set; }
        public bool IsLink { get; set; }
        public string MenuLocation { get; set; }
        public string LinkTo { get; set; }
        public bool Show { get; set; }
        public string Lang { get; set; }
        public string Content { get; set; }
    }
    public class LogOnInfo
    {
        public string Name { get; set; }
        public string Family { get; set; }
    }

   

    public class ShippingModel
    {
        public string CountryId { get; set; }
        public string StateId { get; set; }
        public string ZipCode { get; set; }
        public string SendType { get; set; }
        [Display(Name = "تاریخ ارسال")]
        public string SendDate { get; set; }
        [Display(Name = "ساعت ارسال")]
        public string SendTime { get; set; }
        [Display(Name = "متن روی کارت هدیه")]
        public string GiftNote { get; set; }
        [Display(Name = "توضیحات تکمیلی سفارش")]
        public string MoreInfo { get; set; }
    }

    public class CategoryItemsModel
    {
        public List<inv_Barcode> Items { get; set; }
        public List<inv_Category> Categories { get; set; }
        public bool? HasWholeRole { get; set; }
        public bool? hasFriendRole { get; set; }
    }

    public class SliderShow
    {
        public string file { get; set; }
        public int id { get; set; }
        public int priority { get; set; }
        public string description { get; set; }
        //[AllowHtml]
        public string sliderInfo { get; set; }
        public string title { get; set; }
        public string linkTo { get; set; }
        public string appName { get; set; }
    }

    public class CustomizedBouquetModel
    {
        public List<inv_Barcode> Items { get; set; }
        public List<inv_ItemDetail> Flowers { get; set; }
        public string Category { get; set; }
        public bool? HasWholeRole { get; set; }
        public bool? hasFriendRole { get; set; }
    }

    public class CategoryMenuModel
    {
       public int parentCategoryId { get; set; }
        public List<inv_Category> Parents { get; set; }
        public List<inv_Category> Categories { get; set; }
        public List<inv_Category> RootCategories { get; set; }
    }

    public class LogOnModel
    {
        public string MemberCode { get; set; }

        [Required(ErrorMessage = "ایمیل را وارد کنید.")]
        [Display(Name = "ایمیل")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "رمز عبور را وارد کنید.")]
        [DataType(DataType.Password)]
        [Display(Name = "رمز عبور")]
        public string Password { get; set; }

        [Display(Name = "مرا به خاطر بسپار.")]
        public bool RememberMe { get; set; }

        public bool? checkOut { get; set; }

        public string previousUrl { get; set; }
    }

    public class CheckOutModel
    {

        public string ReceiverName { get; set; }
        public string ReceiverFaily { get; set; }
        public string ReceiverMobile { get; set; }
        public string ReceiverPhone { get; set; }
        public int ReceiverState { get; set; }
        public int ReceiverCity { get; set; }
        public string ReceiverAddress { get; set; }
        public int? CountryId { get; set; }
        public int? StateId { get; set; }
        public string ZipCode { get; set; }
        public Int16 SendType { get; set; }
        public Int16 PaymentMethod { get; set; }
        public string  sendTo { get; set; }
        public string   userSendTo { get; set; }
        [Display(Name = "تاریخ ارسال")]
        public string SendDate { get; set; }
        [Display(Name = "ساعت ارسال")]
        public string SendTime { get; set; }
        [Display(Name = "متن روی کارت هدیه")]
        public string GiftNote { get; set; }
        [Display(Name = "توضیحات تکمیلی سفارش")]
        public string MoreInfo { get; set; }
    
        [Display(Name = "شرکت")]
        public string Company { get; set; }
        public string RefrenceAddress { get; set; }


        [Display(Name = "نام")]
        public string Name { get; set; }

        [Required(ErrorMessage = "نام خانوادگی را وارد کنید.")]
        [Display(Name = "نام خانوادگی")]
        [DataType(DataType.Text)]
        public string Family { get; set; }

        [Required(ErrorMessage = "سال تولد را وارد کنید.")]
        [Display(Name = "تاریخ تولد")]
        public string BirthYear { get; set; }

        public string BirthMonth { get; set; }

        public string BirthDay { get; set; }

        [Required(ErrorMessage = "جنسیت را انتخاب کنید.")]
        [Display(Name = "جنسیت")]
        public bool? Gender { get; set; }

        [DataType(DataType.PhoneNumber)]
        [Display(Name = "تلفن")]
        public string Phone { get; set; }

        [Display(Name = "موبایل")]
        public string Mobile { get; set; }

        [DataType(DataType.PhoneNumber)]
        [Display(Name = "تلفن")]
        public List<string> Phonelist { get; set; }

        [Display(Name = "موبایل")]
        public List<string> Mobilelist { get; set; }

        [Required(ErrorMessage = "آدرس را انتخاب کنید.")]
        [Display(Name = "شهر")]
        public int AddressId { get; set; }

        [Required(ErrorMessage = "ادامه آدرس را وارد کنید.")]
        [Display(Name = "ادامه آدرس")]
        public string AddressStr { get; set; }

        [Required(ErrorMessage = "رمز عبور را وارد کنید.")]
        [DataType(DataType.Password)]
        [Display(Name = "رمز عبور")]
        public string Password { get; set; }

        [Required(ErrorMessage = "رمز عبور جدید را وارد کنید.")]
        [DataType(DataType.Password)]
        [Display(Name = " رمز عبور جدید")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "تکرار رمز عبور")]
        //[Compare("Password", ErrorMessage = "رمز عبور و تکرار رمز عبور باید یکسان باشد.")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "ایمیل را وارد کنید.")]
        [DataType(DataType.EmailAddress, ErrorMessage = "فرمت ایمیل صحیح نمی باشد.")]
        [Display(Name = "آدرس ایمیل")]
        public string email { get; set; }

        [Display(Name = "شغل")]
        public string Combo { get; set; }

        [Display(Name = "کد پستی")]
        public string PostalCode { get; set; }

        [Display(Name = "نحوه آشنایی با کارآمد سیستم")]
        public string FindBy { get; set; }
        [Display(Name = "استان")]
        public int State { get; set; }
        public string Address { get; set; }
    }

    public class RegisterModel
    {

        public string code { get; set; }
        [Display(Name = "شرکت")]
        public string Company { get; set; }
        public string RefrenceAddress { get; set; }


        [Display(Name = "نام")]
        public string Name { get; set; }

        [Required(ErrorMessage = "نام خانوادگی را وارد کنید.")]
        [Display(Name = "نام خانوادگی")]
        [DataType(DataType.Text)]
        public string Family { get; set; }

        [Required(ErrorMessage = "سال تولد را وارد کنید.")]
        [Display(Name = "تاریخ تولد")]
        public string BirthYear { get; set; }

        public string BirthMonth { get; set; }

        public string BirthDay { get; set; }

        [Required(ErrorMessage = "جنسیت را انتخاب کنید.")]
        [Display(Name = "جنسیت")]
        public string Gender { get; set; }

        [DataType(DataType.PhoneNumber)]
        [Display(Name = "تلفن")]
        public string Phone { get; set; }

        [Display(Name = "موبایل")]
        public string Mobile { get; set; }

        [DataType(DataType.PhoneNumber)]
        [Display(Name = "تلفن")]
        public List<string> Phonelist { get; set; }

        [Display(Name = "موبایل")]
        public List<string> Mobilelist { get; set; }

        [Required(ErrorMessage = "آدرس را انتخاب کنید.")]
        [Display(Name = "شهر")]
        public int AddressId { get; set; }

        [Required(ErrorMessage = "ادامه آدرس را وارد کنید.")]
        [Display(Name = "ادامه آدرس")]
        public string AddressStr { get; set; }

        [Required(ErrorMessage = "رمز عبور را وارد کنید.")]
        [DataType(DataType.Password)]
        [Display(Name = "رمز عبور")]
        public string Password { get; set; }

        [Required(ErrorMessage = "رمز عبور جدید را وارد کنید.")]
        [DataType(DataType.Password)]
        [Display(Name = " رمز عبور جدید")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "تکرار رمز عبور")]
        //[Compare("Password", ErrorMessage = "رمز عبور و تکرار رمز عبور باید یکسان باشد.")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "ایمیل را وارد کنید.")]
        [DataType(DataType.EmailAddress, ErrorMessage = "فرمت ایمیل صحیح نمی باشد.")]
        [Display(Name = "آدرس ایمیل")]
        public string email { get; set; }

        [Display(Name = "شغل")]
        public string Combo { get; set; }

        [Display(Name = "کد پستی")]
        public string PostalCode { get; set; }

        [Display(Name = "نحوه آشنایی با کارآمد سیستم")]
        public string FindBy { get; set; }
         [Display(Name = "استان")]
        public int State { get; set; }
        public string Address { get; set; }
    }

    public class ChangePassword
    {
        [Required(ErrorMessage = "رمز عبور را وارد کنید.")]
        [DataType(DataType.Password)]
        [Display(Name = "رمز عبور")]
        public string Password { get; set; }

        [Required(ErrorMessage = "رمز عبور جدید را وارد کنید.")]
        [DataType(DataType.Password)]
        [Display(Name = "رمز عبور جدید")]
        public string NewPassword { get; set; }

        [Required(ErrorMessage = "تکرار رمز عبور جدید را وارد کنید.")]
        [DataType(DataType.Password)]
        [Display(Name = "تکرار رمز عبور جدید")]
        //[Compare("NewPassword", ErrorMessage = "رمز عبور و تکرار رمز عبور باید یکسان باشد.")]
        public string ConfirmNewPassword { get; set; }
    }

    public class ChangeUsername
    {
        [Required(ErrorMessage = "رمز عبور را وارد کنید.")]
        [DataType(DataType.Password)]
        [Display(Name = "رمز عبور")]
        public string Password { get; set; }

        [Required(ErrorMessage = "ایمیل جدید را وارد کنید.")]
        [DataType(DataType.EmailAddress)]
        [Display(Name = "ایمیل جدید")]
        public string NewEmail { get; set; }

        [DataType(DataType.EmailAddress)]
        [Display(Name = "تکرار ایمیل جدید")]
        //[Compare("NewEmail", ErrorMessage = "ایمیل جدید و تکرار ایمیل جدید باید یکسان باشد.")]
        public string ConfirmNewEmail { get; set; }
    }

    public class HierarchyInfo
    {
        public string headertext { get; set; }
        public string css { get; set; }
        public bool canmodify { get; set; }
        public string startlevel { get; set; }
        public string parentid { get; set; }
        public string depth { get; set; }
        public string container { get; set; }
        public string id { get; set; }
        public string table { get; set; }
    }

    public class XmlDropDownData
    {
        public string id { get; set; }
        public string container { get; set; }
        public string path { get; set; }
        public bool canmodify { get; set; }
        public bool istext { get; set; }
        public string headertext { get; set; }
    }

    public class SearchShopBuyDTO
    {
        public string sort { get; set; }
        public string EmployeeName { get; set; }
        public string Shop { get; set; }
        public string ProductName { get; set; }
        public string Barcode { get; set; }
        public string InvoiceDateStart { get; set; }
        public string InvoiceDateEnd { get; set; }
        public string PriceFrom { get; set; }
        public string PriceTo { get; set; }
    }

    public class ProductDetailsModel
    {
        public List<inv_Barcode> Items { get; set; }
        public List<colorsizeModel> colorDetails { get; set; }
        public List<colorsizeModel> sizeDetails { get; set; }
        public List<colorsizeModel> colorDetailsAvailable { get; set; }
        public List<colorsizeModel> sizeDetailsAvailable { get; set; }
        public int barcodeid { get; set; }
        public int categoryId { get; set; }
        public string name { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public string barcode { get; set; }
        public string status { get; set; }
        public decimal? oldprice { get; set; }
        public decimal? price { get; set; }
        public string unitType { get; set; }
        public decimal? Quantity { get; set; }
        public string AppName { get; set; }
        public string definition { get; set; }
        public List<propertyModel> technical { get; set; }
        public List<propertyItems> properties { get; set; }
        public List<commentsModel> comments { get; set; }
        public List<inv_BarcodeMeasureUnit> measureUnits { get; set; }
        public PhotosInfoModel Photos { get; set; }
        public bool isCustomize { get; set; }
        public bool isBride { get; set; }
        public bool? HasWholeRole { get; set; }
        public bool? hasFriendRole { get; set; }
    }

    public class commentsModel
    {
        public string username { get; set; }
        public string comment { get; set; }
        public bool? isConfirmed { get; set; }
    }
    public class propertyModel
    {
        public string property { get; set; }
        public string translatedProperty { get; set; }
        public List<propertyItems> properties { get; set; }
    }

    public class propertyItems
    {
        public string value { get; set; }
        public string name { get; set; }
        public int id { get; set; }
    }

    public class colorsizeModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public decimal? pricedetails { get; set; }
        public string parentTitle { get; set; }
    }

    public class PhotosInfoModel
    {
        public List<string> lphotos { get; set; }
        public string appName { get; set; }
        public bool hasPhoto { get; set; }
    }

    public class ShoppingCartDetailsModel
    {
        public List<colorsizeModel> colorDetailsAvailable { get; set; }
        public List<colorsizeModel> sizeDetailsAvailable { get; set; }
        public int? selectedColorId { get; set; }
        public int? selectedSizeId { get; set; }
        public string selectedColor { get; set; }
        public string selectedSize { get; set; }
        public ac_ShoppingCartDetails shoppingCartDetails { get; set; }
        public decimal? Quantity { get; set; }
        public decimal selectedQuantity { get; set; }
        public bool isLogon { get; set; }
        public decimal deliveryExpense { get; set; }
        //public List<colorsizeModel> sizeDetailsForSelectedColor { get; set; }
    }

    public class OthersProductModel
    {
        public string definition { get; set; }
        public string barcode { get; set; }
        public string[] images { get; set; }
        public string appName { get; set; }
    }

    public class FlowerInfoModel
    {
        public int productId { get; set; }
        public int count { get; set; }
        public decimal price { get; set; }
        public int? sizeId { get; set; }
    }

    public class paymentModel
    {
        public int paymentMethod  { get; set; }
        public string CommentsOrder { get; set; }
        public bool accepted { get; set; }
    }
}