<%@ WebHandler Language="C#" Class="UploadHandler" %>

using System;
using System.Web;
using System.IO;
using SageFrame.Services;
public class UploadHandler : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {

        int retStatus = 0;
        string retMsg = string.Empty;
        string Location = HttpContext.Current.Request.QueryString["LocationName"].ToString();
        string TemplateName = HttpContext.Current.Request.QueryString["TemplateName"].ToString();
        if (HttpContext.Current.Request.Files.Count > 0)
        {
            HttpPostedFile file = HttpContext.Current.Request.Files[0];

        
            string strFileName = Path.GetFileName(HttpContext.Current.Request.Files[0].FileName);
            string strExtension = Path.GetExtension(HttpContext.Current.Request.Files[0].FileName).ToLower();
            string strBaseLocation = GetLocation(Location, TemplateName);
            if (Location == "FavIcon")
                strFileName = "favicon.ico";
            string strSaveLocation = GetLocation(Location, TemplateName) + strFileName;
            object obj = new object();
            lock (obj)
            {
                if (!Directory.Exists(strBaseLocation))
                {
                    Directory.CreateDirectory(strBaseLocation);
                }
            }

            HttpContext.Current.Request.Files[0].SaveAs(strSaveLocation);

            HttpContext.Current.Response.ContentType = "text/plain";
            HttpContext.Current.Response.Write("({ 'Status': '" + retStatus + "','Message': '" + retMsg + "' })");
            HttpContext.Current.Response.End();
        }

    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
    public string GetLocation(string LocationName, string TemplateName)
    {
        string Location = string.Empty;

        switch (LocationName)
        {
            case "FavIcon":
                Location = HttpContext.Current.Server.MapPath("~/");
                if (TemplateName == "Default")
                    Location = HttpContext.Current.Server.MapPath("~/Core/Template/");
                else
                    Location = HttpContext.Current.Server.MapPath("~/Templates/" + TemplateName + "/");
                break;
            case "FullImageBg":
                if (TemplateName == "Default")
                    Location = HttpContext.Current.Server.MapPath("~/Core/Template/images/");
                else
                    Location = HttpContext.Current.Server.MapPath("~/Templates/" + TemplateName + "/images/");
                break;
            case "CustomFont":
                if (TemplateName == "Default")
                    Location = HttpContext.Current.Server.MapPath("~/Core/Template/fonts/");
                else
                    Location = HttpContext.Current.Server.MapPath("~/Templates/" + TemplateName + "/fonts/");
                break;
            case "CustomPattern":
                if (TemplateName == "Default")
                    Location = HttpContext.Current.Server.MapPath("~/Core/Template/images/pattern/");
                else
                    Location = HttpContext.Current.Server.MapPath("~/Templates/" + TemplateName + "/images/pattern/");
                break;


        }
        return Location;
    }

}