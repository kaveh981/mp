using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Configuration;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Drawing;
using System.Drawing.Imaging;
using System.Text;
using System.IO;
using System.Collections;
using System.Threading;
using System.Globalization;
using System.Xml.Linq;
using System.Xml.Schema;
using MvcInternationalization.Utility;
using MvcInternationalization.Controllers;
using MapiOnline.Models;
namespace MapiOnline.Controllers
{
    public class UploadifyController : BaseController
    {
        MapiDBEntities db = new MapiDBEntities();

        [HttpPost]
        public ActionResult Index(HttpPostedFileWrapper fileInput,SliderShow slideShow)
        {
            try
            {


                HttpPostedFileWrapper file = fileInput;

                string barcode = Request["barcode"];
                bool hasStamp = false;
                hasStamp = Request["hasStamp"] == "on" ? true : false;
                bool isMenu = false;
                if (!string.IsNullOrEmpty(Request["isMenu"]))
                    isMenu = bool.Parse(Request["isMenu"]);
                bool isLogo = false;
                if (!string.IsNullOrEmpty(Request["isLogo"]))
                    isLogo = bool.Parse(Request["isLogo"]);
                bool isSlider = false;
                if (!string.IsNullOrEmpty(Request["isSlider"]))
                    isSlider = bool.Parse(Request["isSlider"]);
                bool isStamp = false;
                if (!string.IsNullOrEmpty(Request["isStamp"]))
                    isStamp = bool.Parse(Request["isStamp"]);
                string id = Request["id"];
                string size = Request["size"];
                int priorityId = Convert.ToInt32(Request["priorityId"]);
                string colorId = Request["colorId"];
                if (colorId == "null")
                    colorId = "";

                if (!User.Identity.IsAuthenticated)
                {
                    return null;
                }
                if (isMenu)
                {
                    AddImage("", file.InputStream, file.ContentType, file.FileName, double.Parse(size), true, true, false, false, id, hasStamp);
                }
                else if (isLogo)
                {
                    System.IO.Directory.CreateDirectory(Server.MapPath("../Data/" + Membership.ApplicationName + "Logo"));
                    file.SaveAs(Server.MapPath("../Data/" + Membership.ApplicationName) + "Logo/" + "logo.jpg");
                }
                else if (isSlider)
                {
                    System.IO.Directory.CreateDirectory(Server.MapPath("../Data/" + Membership.ApplicationName + "SliderShow"));
                    XDocument xmlDoc = XDocument.Load(Server.MapPath("../Data/Slider.xml"));
                    int sid = 1;
                    if (xmlDoc.Elements("root").Elements("Slider").Count() > 0)
                        sid = (int.Parse(xmlDoc.Elements("root").Elements("Slider").OrderByDescending(o => o.Attribute("Id").Value).FirstOrDefault().Attribute("Id").Value) + 1);

                    file.SaveAs(Server.MapPath("../Data/" + Membership.ApplicationName) + "SliderShow/" + sid + ".jpg");
                    xmlDoc.Element("root").Add(new XElement("Slider", new XAttribute("Title", Request["title"].ToString()),
                        new XAttribute("LinkTo", Request["linkTo"].ToString()), new XAttribute("SliderInfo",string.IsNullOrEmpty(slideShow.sliderInfo)?"": slideShow.sliderInfo),
                        new XAttribute("Description", Request["description"].ToString()), new XAttribute("File", sid), new XAttribute("Priority", sid), new XAttribute("Id", sid)));
                    xmlDoc.Save(Server.MapPath("../Data/Slider.xml"));
                    AddImage("", file.InputStream, file.ContentType, "tiny_" + sid + ".jpg", 70, true, isMenu, isLogo, isSlider, id, hasStamp);
                }
                else if (isStamp)
                {
                    System.IO.Directory.CreateDirectory(Server.MapPath("../Data/" + Membership.ApplicationName + "Stamp"));
                    file.SaveAs(Server.MapPath("../Data/" + Membership.ApplicationName) + "Stamp/" + "stamp.jpg");
                }
                else
                {
                    AddImage(barcode, file.InputStream, file.ContentType, priorityId + ((colorId == "" || colorId == null) ? "" : "_" + colorId.ToString()) + ".jpg", 1000, true, isMenu, isLogo, isSlider, id, hasStamp);
                    AddImage(barcode, file.InputStream, file.ContentType, "thumb_" + priorityId + ((colorId == "" || colorId == null) ? "" : "_" + colorId.ToString()) + ".jpg", 300, true, isMenu, isLogo, isSlider, id, hasStamp);
                    AddImage(barcode, file.InputStream, file.ContentType, "tiny_" + priorityId + ((colorId == "" || colorId == null) ? "" : "_" + colorId.ToString()) + ".jpg", 100, true, isMenu, isLogo, isSlider, id, hasStamp);
                }
                return Json(new { isDone = true, appName = Membership.ApplicationName });
            }
            catch (Exception ex)
            {
                return Json(new { isDone = false, msg = ex.Message });
            }
        }

        public void AddImage(string barcode, Stream fu, string contentType, string fileName, double THUMBNAIL_SIZE, bool USE_SIZE_FOR_HEIGHT, bool isMenu, bool isLogo, bool isSlider, string id, bool hasStamp)
        {
            string imgContentType = contentType;
            {
                try
                {
                    System.Drawing.Image image = System.Drawing.Image.FromStream(fu);
                    ImageResize ir = new ImageResize();
                    ir.File = image;
                    ir.HasStamp = hasStamp;
                    if (USE_SIZE_FOR_HEIGHT)
                        ir.Height = THUMBNAIL_SIZE;
                    else
                        ir.Width = THUMBNAIL_SIZE;

                    int uwidth = image.Width;
                    int uheight = image.Height;
                    // int height = ((uheight * width) / uwidth);
                    System.Drawing.Bitmap b = new System.Drawing.Bitmap(ir.GetThumbnail());
                    // b.SetResolution(300, 300);
                    string newPath = "";
                    if (isMenu)
                        newPath = System.IO.Path.Combine(Server.MapPath("../Data/" + Membership.ApplicationName + "MenuPhotos/"), id);
                    else if (isLogo)
                        newPath = System.IO.Path.Combine(Server.MapPath("../Data/" + Membership.ApplicationName + "Logo"), "");
                    else if (isSlider)
                        newPath = System.IO.Path.Combine(Server.MapPath("../Data/" + Membership.ApplicationName + "SliderShow"), "");
                    else
                        newPath = System.IO.Path.Combine(Server.MapPath("../Data/" + Membership.ApplicationName + "Photos/"), barcode);

                    // Create the subfolder
                    System.IO.Directory.CreateDirectory(newPath);
                    if (isMenu)
                        b.Save(Server.MapPath("../Data/" + Membership.ApplicationName + "MenuPhotos/") + id + "/" + fileName, System.Drawing.Imaging.ImageFormat.Jpeg);
                    else if (isLogo)
                        b.Save(Server.MapPath("../Data/" + Membership.ApplicationName + "Logo") + "/" + "logo.jpg", System.Drawing.Imaging.ImageFormat.Jpeg);
                    else if (isSlider)
                    {
                        b.Save(Server.MapPath("../Data/" + Membership.ApplicationName + "SliderShow") + "/" + fileName, System.Drawing.Imaging.ImageFormat.Jpeg);

                        string[] photos = System.IO.Directory.GetFiles(newPath);




                        db.aspnet_Applications.Single(a => a.ApplicationName == Membership.ApplicationName).ApplicationDetail.SliderQuantity = photos.Length / 2;
                        db.SaveChanges();
                    }
                    else
                    {
                        b.Save(Server.MapPath("../Data/" + Membership.ApplicationName + "Photos/") + barcode + "/" + fileName, System.Drawing.Imaging.ImageFormat.Jpeg);


                        string[] photos = System.IO.Directory.GetFiles(newPath);
                        string images = "";
                        int l = photos.Length;
                        if (l > 0)
                        {
                            foreach (string item in photos)
                            {
                                if (!item.Contains("tiny") && !item.Contains("thumb"))
                                    images += System.IO.Path.GetFileName(item).Replace(".jpg", "") + ",";
                            }
                            images = images.Remove(images.Length - 1, 1);
                            db.inv_Barcode.Single(ba => ba.Barcode == barcode && ba.aspnet_Applications.ApplicationName == Membership.ApplicationName).Images = images;
                            db.SaveChanges();
                        }
                    }
                }
                catch (Exception ex)
                {

                }
                finally
                {

                }
            }


        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
    public class ImageResize
    {
        //instance fields
        private double m_width, m_height;
        private bool m_use_aspect = true;
        private bool hasStamp = false;
        private bool m_use_percentage = false;
        private System.Drawing.Image m_src_image, m_dst_image, m_resized;
        private System.Drawing.Image m_image;
        private ImageResize m_cache;
        private Graphics m_graphics;

        /// <summary>
        /// gets of sets the File
        /// </summary>
        public System.Drawing.Image File
        {

            get { return m_image; }
            set { m_image = value; }
        }
        /// <summary>
        /// gets of sets the Image
        /// </summary>
        public System.Drawing.Image Image
        {
            get { return m_src_image; }
            set { m_src_image = value; }
        }
        /// <summary>
        /// gets of sets the PreserveAspectRatio
        /// </summary>
        public bool PreserveAspectRatio
        {
            get { return m_use_aspect; }
            set { m_use_aspect = value; }
        }
        /// <summary>
        /// gets of sets the UsePercentages
        /// </summary>
        public bool UsePercentages
        {
            get { return m_use_percentage; }
            set { m_use_percentage = value; }
        }
        /// <summary>
        /// gets of sets the hasStamp
        /// </summary>
        public bool HasStamp
        {
            get { return hasStamp; }
            set { hasStamp = value; }
        }
        /// <summary>
        /// gets of sets the Width
        /// </summary>
        public double Width
        {
            get { return m_width; }
            set { m_width = value; }
        }
        /// <summary>
        /// gets of sets the Height
        /// </summary>
        public double Height
        {
            get { return m_height; }
            set { m_height = value; }
        }

        /// <summary>
        /// Returns a Image which represents a rezised Image
        /// </summary>
        /// <returns>A Image which represents a rezised Image, using the 
        /// proprerty settings provided</returns>
        public virtual System.Drawing.Image GetThumbnail()
        {
            // Flag whether a new image is required
            bool recalculate = false;
            double new_width = Width;
            double new_height = Height;
            // Load via stream rather than Image.FromFile to release the file
            // handle immediately
            if (m_src_image != null)
                m_src_image.Dispose();
            m_src_image = m_image;
            recalculate = true;
            // If you opted to specify width and height as percentages of the 
            // original image's width and height, compute these now
            if (UsePercentages)
            {
                if (Width != 0)
                {
                    new_width = (double)m_src_image.Width * Width / 100;

                    if (PreserveAspectRatio)
                    {
                        new_height = new_width * m_src_image.Height /
                            (double)m_src_image.Width;
                    }
                }
                if (Height != 0)
                {
                    new_height = (double)m_src_image.Height * Height / 100;

                    if (PreserveAspectRatio)
                    {
                        new_width = new_height * m_src_image.Width /
                            (double)m_src_image.Height;
                    }
                }
            }
            else
            {
                // If you specified an aspect ratio and absolute width or height,
                // then calculate this now; if you accidentally specified both a 
                // width and height, ignore the PreserveAspectRatio flag

                if (PreserveAspectRatio)
                {
                    if (Width != 0 && Height == 0)
                    {
                        new_height = (Width / (
                            double)m_src_image.Width) * m_src_image.Height;
                    }
                    else if (Height != 0 && Width == 0)
                    {
                        new_width = (Height / (
                            double)m_src_image.Height) * m_src_image.Width;
                    }
                }
            }
            recalculate = true;

            if (recalculate)
            {
                //  Calculate the new image
                if (m_dst_image != null)
                {
                    m_dst_image.Dispose();
                    m_graphics.Dispose();
                }
                //Bitmap bitmap = new Bitmap((int)new_width, (int)new_height,
                //    m_src_image.PixelFormat);
                //var attribute = new ImageAttributes();
                //attribute.SetWrapMode(System.Drawing.Drawing2D.WrapMode.TileFlipXY);  
                //m_graphics = Graphics.FromImage(bitmap);
                //m_graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                //m_graphics.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                //m_graphics.DrawImage(m_src_image, new Rectangle(0, 0, bitmap.Width, bitmap.Height), 0, 0, bitmap.Width, bitmap.Height, GraphicsUnit.Pixel, attribute);
                //m_graphics.DrawImage(m_src_image, 0, 0, bitmap.Width, bitmap.Height);
                //m_graphics.DrawImage(m_src_image, new Rectangle(0, 0, m_width,m_height), new Rectangle(0, 0, bitmap.Width, bitmap.Height), GraphicsUnit.Pixel, attribute);

                //m_dst_image = bitmap;
                //// Cache the image and its associated settings
                //m_cache = this.MemberwiseClone() as ImageResize;         
                //   //   m_graphics.DrawImage(rotatedImage, new Rectangle(new Point(0, 0), newSize), 0, 0, rotatedImage.Width, rotatedImage.Height, GraphicsUnit.Pixel, attribute);    
                m_dst_image = m_src_image.Clone() as System.Drawing.Image;
                RotateFlipType rotateFlipType = RotateFlipType.RotateNoneFlipNone;
                m_dst_image.RotateFlip(rotateFlipType);
                var newSize = CalculateResizedDimensions(m_dst_image, (int)new_width, (int)new_height);
                var resizedImage = new Bitmap(newSize.Width, newSize.Height, PixelFormat.Format24bppRgb);
                resizedImage.SetResolution(100, 100);
                m_resized = resizedImage;
                using (m_graphics = Graphics.FromImage(m_resized))
                {        // set parameters to create a high-quality thumbnail     
                    m_graphics.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                    m_graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
                    m_graphics.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
                    m_graphics.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;

                    // use an image attribute in order to remove the black/gray border around image after resize    
                    // (most obvious on white images), see this post for more information:     
                    // http://www.codeproject.com/KB/GDI-plus/imgresizoutperfgdiplus.aspx      
                    using (var attribute = new ImageAttributes())
                    {
                        attribute.SetWrapMode(System.Drawing.Drawing2D.WrapMode.TileFlipXY);
                        // draws the resized image to the bitmap        

                        m_graphics.DrawImage(m_dst_image, new Rectangle(new Point(0, 0), newSize), 0, 0, m_dst_image.Width, m_dst_image.Height, GraphicsUnit.Pixel, attribute);
                        if (HasStamp && newSize.Height > 700)
                        {
                            string stampLoc = HttpContext.Current.Server.MapPath("../Data/" + Membership.ApplicationName + "Stamp/stamp.jpg");
                            System.Drawing.Image stamp = System.Drawing.Image.FromFile(stampLoc);
                            float x = (((newSize.Height * m_dst_image.Width) / m_dst_image.Height) / 2) - (stamp.Width / 2);
                            float y = (newSize.Height / 2) - (stamp.Height / 2);
                            m_graphics.DrawImage(stamp, x, y);
                        }
                    }
                }


            }
            //  return resizedImage;
            return m_resized;

        }
        private static Size CalculateResizedDimensions(System.Drawing.Image image, int desiredWidth, int desiredHeight)
        {
            var widthScale = (double)desiredWidth / image.Width;
            var heightScale = (double)desiredHeight / image.Height;

            // scale to whichever ratio is smaller, this works for both scaling up and scaling down
            var scale = widthScale < heightScale ? widthScale : heightScale;

            return new Size
            {
                Width = (int)(scale * image.Width),
                Height = (int)(scale * image.Height)
            };
        }

        /// <summary>
        /// Frees all held resources, such as Graphics and Image handles
        /// </summary>
        ~ImageResize()
        {
            // Free resources
            if (m_dst_image != null)
            {
                m_dst_image.Dispose();
                m_graphics.Dispose();
            }

            if (m_src_image != null)
                m_src_image.Dispose();
        }
    }


}
