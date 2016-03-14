#region "Copyright"
/*
FOR FURTHER DETAILS ABOUT LICENSING, PLEASE VISIT "LICENSE.txt" INSIDE THE SAGEFRAME FOLDER
*/
#endregion

#region "References"
using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using System.Web.Script.Services;
using System.Web.Services;
using System.Collections.Generic;
using System.IO;
using System.Xml;
using SageFrame.Templating;
using SageFrame.Templating.xmlparser;
using SageFrame.FileManager;
using SageFrame.Common;
using SageFrame.Pages;
using System.Text.RegularExpressions;
using SageFrame.Core;
using SageFrame.Framework;
using System.Text;
#endregion


[ScriptService]
public partial class Modules_LayoutManager_WebMethod : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    [WebMethod]
    public static string ReadXML(string filePath, string TemplateName)
    {
        try
        {
            string templatePath = Decide.IsTemplateDefault(TemplateName.Trim()) ? Utils.GetTemplatePath_Default(TemplateName) : Utils.GetTemplatePath(TemplateName);
            string fileName = Path.GetFileName(filePath);
            filePath = filePath.ToLower().Equals("core") ? string.Format("{0}/Layouts/standard/All.xml", Utils.GetTemplatePath_Default("Default")) : string.Format("{0}/layouts/{1}.xml", templatePath, filePath);
            DataSet ds = new DataSet();
            ds.ReadXml(filePath);
            string s = ds.GetXml();
            return s;
        }
        catch (Exception)
        {
            return "Couldn't Read the XML file. Make sure it is a valid xml";
        }
    }
    [WebMethod]
    public static List<KeyValue> GetThemes(string TemplateName)
    {
        string themePath = Decide.IsTemplateDefault(TemplateName) ? Utils.GetThemePath_Default(TemplateName) : Utils.GetThemePath(TemplateName);
        DirectoryInfo dir = new DirectoryInfo(themePath);
        List<KeyValue> lstThemes = new List<KeyValue>();
        if (dir.Exists)
        {
            foreach (DirectoryInfo theme in dir.GetDirectories())
            {
                lstThemes.Add(new KeyValue(theme.Name, theme.FullName));
            }
        }
        return lstThemes;
    }
    [WebMethod]
    public static List<KeyValue> LoadPresets(string TemplateName)
    {
        string themePath = Decide.IsTemplateDefault(TemplateName) ? Utils.GetPresetPath_DefaultTemplate(TemplateName) : Utils.GetPresetPath(TemplateName);
        DirectoryInfo dir = new DirectoryInfo(themePath);
        List<KeyValue> lstPresets = new List<KeyValue>();
        if (dir.Exists)
        {
            foreach (FileInfo preset in dir.GetFiles("*.xml"))
            {
                if (!Utils.CompareStrings(preset.Name, TemplateConstants.PagePresetFile))
                {
                    lstPresets.Add(new KeyValue(preset.Name, preset.FullName));
                }
            }
        }
        return lstPresets;
    }
    [WebMethod]
    public static List<PresetInfo> LoadActivePresets(string TemplateName)
    {
        string presetPath = Decide.IsTemplateDefault(TemplateName) ? Utils.GetPresetPath_DefaultTemplate(TemplateName) : Utils.GetPresetPath(TemplateName);
        List<PresetInfo> lstActivePresets = new List<PresetInfo>();
        string pagepreset = presetPath + "/" + TemplateConstants.PagePresetFile;
        if (File.Exists(pagepreset))
        {
            lstActivePresets = PresetHelper.ParsePreset(pagepreset, "pagepresets/page");
        }
        else
        {
            lstActivePresets.Add(PresetInfo.GetPresetPages("default", "*"));
        }
        return lstActivePresets;
    }
    [WebMethod]
    public static PresetInfo GetPresetDetails(string TemplateName, int PortalID)
    {
        string presetPath = Decide.IsTemplateDefault(TemplateName.Trim()) ? Utils.GetPresetPath_DefaultTemplate(TemplateName) : Utils.GetPresetPath(TemplateName);
        presetPath += "/" + "pagepreset.xml";
        PresetInfo objPreset = new PresetInfo();
        try
        {
            objPreset = PresetHelper.LoadPresetDetails(presetPath);
            PageController objPageController = new PageController();
            List<PageEntity> lstMenu = objPageController.GetMenuFront(PortalID, false);
            foreach (PageEntity obj in lstMenu)
            {
                obj.ChildCount = lstMenu.Count(
                    delegate (PageEntity objMenu)
                    {
                        return (objMenu.ParentID == obj.PageID);
                    }
                    );
            }
            List<string> lstPages = new List<string>();
            List<KeyValue> lstLayout = new List<KeyValue>();
            foreach (KeyValue kvp in objPreset.lstLayouts)
            {
                string[] arrPage = kvp.Value.Split(',');
                List<string> lstNewPage = new List<string>();
                foreach (string page in arrPage)
                {
                    bool exists = lstMenu.Exists(
                           delegate (PageEntity obj)
                           {
                               return obj.PageName.TrimStart('-') == page;
                           }
                        );
                    if (exists || page.ToLower() == "all")
                    {
                        lstNewPage.Add(page);
                    }
                }
                if (lstNewPage.Count > 0)
                {
                    lstLayout.Add(new KeyValue(kvp.Key, string.Join(",", lstNewPage.ToArray())));
                }
            }
            objPreset.lstLayouts = lstLayout;
            //PresetHelper.WritePreset(presetPath, objPreset);
            return objPreset;
        }
        catch (Exception)
        {
            throw;
        }
    }

    [WebMethod]
    public static int SavePreset(string TemplateName, string ActiveTheme, string ActiveWidth, List<PresetKeyValue> lstLayouts, int portalID)
    {
        List<KeyValue> lstLyts = new List<KeyValue>();
        foreach (PresetKeyValue kvp in lstLayouts)
        {
            lstLyts.Add(new KeyValue(kvp.Key, kvp.Value));
        }
        PresetInfo PresetObj = new PresetInfo();
        PresetObj.ActiveTheme = ActiveTheme;
        PresetObj.ActiveWidth = ActiveWidth;
        PresetObj.lstLayouts = lstLyts;
        string presetPath = Decide.IsTemplateDefault(TemplateName.Trim()) ? Utils.GetPresetPath_DefaultTemplate(TemplateName) : Utils.GetPresetPath(TemplateName);
        string pagepreset = presetPath + "/" + TemplateConstants.PagePresetFile;
        presetPath += "/" + "pagepreset.xml";
        int presetstatus = 0;
        try
        {
            PresetHelper.WritePreset(presetPath, PresetObj);
            return presetstatus;
        }
        catch (Exception)
        {
            throw;
        }
        finally
        {
            AppErazer.ClearSysHash(ApplicationKeys.ActivePagePreset + "_" + portalID);
            SageFrame.Common.CacheHelper.Clear("PresetList");
        }

    }

    public static void CreateLayoutControls(string TemplateName, string filePath)
    {
        BlockParser.CheckFilePath();
        string templatePath = Decide.IsTemplateDefault(TemplateName) ? Utils.GetTemplatePath_Default(TemplateName) : Utils.GetTemplatePath(TemplateName);
        string presetPath = Decide.IsTemplateDefault(TemplateName) ? Utils.GetPresetPath_DefaultTemplate(TemplateName) : Utils.GetPresetPath(TemplateName);
        ModulePaneGenerator mg = new ModulePaneGenerator();
        XmlParser parser = new XmlParser();
        try
        {
            List<XmlTag> lstXmlTag = parser.GetXmlTags(filePath, "layout/section");
            List<XmlTag> lstWrappers = parser.GetXmlTags(filePath, "layout/wrappers");
            string html = mg.GenerateHTML(lstXmlTag, lstWrappers, 2);
            //html = Utils.FormatHtmlOutput(html);
            string controlclass = Path.GetFileNameWithoutExtension(filePath);
            string controlname = string.Format("{0}.ascx", controlclass);
            if (!File.Exists(templatePath + "/" + controlname))
            {
                FileStream fs = null;
                using (fs = File.Create(templatePath + "/" + controlname))
                {
                }
            }
            else
            {
                File.Delete(templatePath + "/" + controlname);
                FileStream fs = null;
                using (fs = File.Create(templatePath + "/" + controlname))
                {
                }
            }
            using (StreamWriter sw = new StreamWriter(templatePath + "/" + controlname))
            {
                sw.Write("<%@ Control Language=\"C#\" ClassName=\"" + controlclass + "\" %>");
                sw.Write(Environment.NewLine);
                sw.Write(html);
            }
        }
        catch (Exception)
        {
            throw;
        }
    }
    [WebMethod]
    public static List<KeyValue> LoadLayout(string TemplateName)
    {
        string filePath = Decide.IsTemplateDefault(TemplateName.Trim()) ? Utils.GetTemplatePath_Default(TemplateName) : Utils.GetTemplatePath(TemplateName);
        DirectoryInfo dir = new DirectoryInfo(filePath + "/layouts");
        List<KeyValue> lstLayouts = new List<KeyValue>();
        foreach (FileInfo layout in dir.GetFiles())
        {
            lstLayouts.Add(new KeyValue(Path.GetFileNameWithoutExtension(layout.Name), layout.FullName));
        }
        lstLayouts.Insert(0, new KeyValue("Core", "Core"));
        return lstLayouts;
    }

    //[WebMethod]
    //public static List<SectionInfo> LoadBlockTypes()
    //{
    //    DirectoryInfo dir = new DirectoryInfo("E://DotNetProjects//sftemplating//SageFrame//Modules//LayoutManager//Sections");
    //    List<SectionInfo> lstSections = new List<SectionInfo>();
    //    foreach (FileInfo file in dir.GetFiles())
    //    {
    //        SectionInfo obj = new SectionInfo();
    //        obj.SectionName = file.Name;
    //        lstSections.Add(obj);
    //    }
    //    return lstSections;
    //}

    [WebMethod]
    public static string ReadBlockHTML(string fileName)
    {
        HTMLBuilder hb = new HTMLBuilder();
        fileName = HttpContext.Current.Server.MapPath("~/") + fileName;
        string html = hb.ReadHTML(fileName);
        return html;
    }

    [WebMethod]
    public static List<TemplateInfo> GetTemplateList(int PortalID)
    {
        string templates = Utils.GetAbsolutePath(TemplateConstants.TemplateDirectory);
        DirectoryInfo dir = new DirectoryInfo(templates);
        List<TemplateInfo> lstTemplates = new List<TemplateInfo>();
        string activeTemplate = TemplateController.GetActiveTemplate(PortalID).TemplateName;
        if (activeTemplate.Length < 1) { activeTemplate = "Default"; }
        foreach (DirectoryInfo temp in dir.GetDirectories())
        {
            TemplateInfo tempObj = new TemplateInfo(temp.Name, temp.FullName, GetThumbPath(temp.FullName, temp.Name, TemplateConstants.TemplateDirectory), false, false);
            if (temp.Name.ToLower().Replace(' ', '_').Equals(activeTemplate.ToLower()))
            {
                tempObj.IsActive = true;
            }
            lstTemplates.Add(tempObj);
        }
        bool IsDefaultActive = activeTemplate.ToLower().Equals("default") ? true : false;
        lstTemplates.Insert(0, new TemplateInfo("Default", "/Core/Template/", GetThumbPath(HttpContext.Current.Server.MapPath("~/Core/Template/"), "Template", "Core/"), IsDefaultActive, true));
        List<TemplateInfo> lstFinalTemplates = new List<TemplateInfo>();
        List<TemplateInfo> lstAppliedTemplates = new List<TemplateInfo>();
        try
        {
            lstAppliedTemplates = TemplateController.GetPortalTemplates();
        }
        catch (Exception)
        {
            throw;
        }
        foreach (TemplateInfo template in lstTemplates)
        {
            bool status = false;
            foreach (TemplateInfo templt in lstAppliedTemplates)
            {
                if (template.TemplateName.ToLower() == templt.TemplateName.ToLower() && templt.PortalID != PortalID)
                {
                    status = true;
                    break;
                }
            }
            if (!status)
                template.IsApplied = false;
            else
                template.IsApplied = true;
        }
        return lstTemplates;
    }

    public static string GetThumbPath(string TemplatePath, string TemplateName, string RootFolder)
    {
        string thumbpath = HttpContext.Current.Request.ApplicationPath == "/" ? TemplateConstants.NoImagePath + TemplateConstants.NoImageImag : HttpContext.Current.Request.ApplicationPath + TemplateConstants.NoImagePath + TemplateConstants.NoImageImag;
        if (Directory.Exists(TemplatePath + TemplateConstants.ThumbPath))
        {
            DirectoryInfo dir = new DirectoryInfo(TemplatePath + TemplateConstants.ThumbPath);
            foreach (FileInfo file in dir.GetFiles())
            {
                if (Utils.ValidateThumbImage(file))
                {
                    thumbpath = string.Format("{0}/{1}{2}{3}/{4}", HttpContext.Current.Request.ApplicationPath == "/" ? "" : HttpContext.Current.Request.ApplicationPath, RootFolder, TemplateName, TemplateConstants.ThumbPath, file.Name);
                    break;
                }
            }
        }
        return thumbpath;
    }

    [WebMethod]
    public static void ActivateTemplate(string TemplateName, int PortalID)
    {
        ClearOptimizationCache(PortalID);
        string optimized_path = HttpContext.Current.Server.MapPath(SageFrameConstants.OptimizedResourcePath);
        IOHelper.DeleteDirectoryFiles(optimized_path, ".js,.css");
        if (File.Exists(HttpContext.Current.Server.MapPath(SageFrameConstants.OptimizedCssMap)))
        {
            DeleteNodes(HttpContext.Current.Server.MapPath(SageFrameConstants.OptimizedCssMap), "resourcemaps/resourcemap");
        }
        if (File.Exists(HttpContext.Current.Server.MapPath(SageFrameConstants.OptimizedJsMap)))
        {
            DeleteNodes(HttpContext.Current.Server.MapPath(SageFrameConstants.OptimizedJsMap), "resourcemap/resourcemap");
        }
        TemplateController.ActivateTemplate(TemplateName, PortalID);
    }

    private static void ClearOptimizationCache(int PortalID)
    {
        AppErazer.ClearSysHash(ApplicationKeys.ActivePagePreset + "_" + PortalID);
        AppErazer.ClearSysHash(ApplicationKeys.ActiveTemplate + "_" + PortalID);
        AppErazer.ClearSysHash(ApplicationKeys.ActivePagePreset + "_" + PortalID);
        AppErazer.ClearSysCache();
        string optimized_path = HttpContext.Current.Server.MapPath(SageFrameConstants.OptimizedResourcePath);
        IOHelper.DeleteDirectoryFiles(optimized_path, ".js,.css");
        if (File.Exists(HttpContext.Current.Server.MapPath(SageFrameConstants.OptimizedCssMap)))
        {
            SageFrame.Web.XmlHelper.DeleteNodes(HttpContext.Current.Server.MapPath(SageFrameConstants.OptimizedCssMap), "resourcemap/resourcemap");
        }
        if (File.Exists(HttpContext.Current.Server.MapPath(SageFrameConstants.OptimizedJsMap)))
        {
            SageFrame.Web.XmlHelper.DeleteNodes(HttpContext.Current.Server.MapPath(SageFrameConstants.OptimizedJsMap), "resourcemap/resourcemap");
        }
    }

    public static void DeleteNodes(string target_path, string nodeName)
    {
        XmlDocument doc = new XmlDocument();
        doc.Load(target_path);
        XmlNode node = doc.SelectSingleNode("resourcemaps");
        node.RemoveAll();
        doc.Save(target_path);
    }

    [WebMethod]
    public static TemplateInfo GetBasicSettings(string TemplateName)
    {
        TemplateInfo objTemp = new TemplateInfo();
        string filePath = Decide.IsTemplateDefault(TemplateName.Trim()) ? Utils.GetTemplateInfoFilePath_Default(TemplateName) : Utils.GetTemplateInfoFilePath(TemplateName);
        if (File.Exists(filePath))
        {
            XmlDocument doc = new XmlDocument();
            doc.Load(filePath);
            XmlNode root = doc.DocumentElement;
            objTemp.TemplateName = root.SelectSingleNode("name").ChildNodes[0].Value;
            objTemp.Author = root.SelectSingleNode("author").ChildNodes[0].Value;
            objTemp.Description = root.SelectSingleNode("description").ChildNodes[0].Value;
            objTemp.Website = root.SelectSingleNode("website").ChildNodes[0].Value;
            return objTemp;
        }
        else
        {
            return objTemp = TemplateHelper.CreateEmptyTemplateObject();
        }
    }

    [WebMethod]
    public static string GenerateWireFrame(string FilePath, string TemplateName)
    {
        try
        {
            string layout = string.Empty;
            //Check For Default Layout
            BlockParser.CheckFilePath(FilePath.ToLower());
            List<XmlTag> lstXmlTags = new List<XmlTag>();
            XmlParser parser = new XmlParser();
            string templatePath = Decide.IsTemplateDefault(TemplateName.Trim()) ? Utils.GetTemplatePath_Default(TemplateName) : Utils.GetTemplatePath(TemplateName);
            string filePath = FilePath.ToLower().Equals("core") ? string.Format("{0}/Layouts/standard/All.xml", Utils.GetTemplatePath_Default("Default")) : string.Format("{0}/layouts/{1}.xml", templatePath, FilePath);
            bool modernLayout = CheckModernLayout(filePath, out layout);
            if (!modernLayout)
            {
                lstXmlTags = parser.GetXmlTags(filePath, "layout/section");
                List<XmlTag> lstWrappers = parser.GetXmlTags(filePath, "layout/wrappers");
                ModulePaneGenerator wg = new ModulePaneGenerator();
                layout = wg.GenerateHTML(lstXmlTags, lstWrappers, 1);
            }
            layout = modernLayout.ToString() + ",,,," + layout;
            return layout;
        }
        catch (Exception)
        {
            if (FilePath.ToLower().Equals("core"))
                return ("<div class='sfMessage sfErrormsg'>Invalid XML document<input type='button' class='sfResetCore' id='btnReset' value='Reset Core'/></div>");
            else
                return ("<div class='sfMessage sfErrormsg'>Invalid XML document</div>");

        }
    }

    private static bool CheckModernLayout(string filePath, out string layout)
    {
        bool ismodernLayout = false;
        List<XmlTag> lstSectionNodes = new List<XmlTag>();
        System.Xml.XmlDocument doc = XmlHelper.LoadXMLDocument(filePath);//layout
        System.Xml.XmlElement root = doc.DocumentElement;
        layout = "";
        if (root.Attributes["modern"] != null)
        {
            System.Xml.XmlNodeList objNoedlist = XmlHelper.GetXMLNodes(doc, "layout");
            layout = root.InnerXml;
            ismodernLayout = true;
        }
        return ismodernLayout;
    }
    [WebMethod]
    public static bool IsModernLayout(string templateName, string layoutName)
    {
        string templatePath = Decide.IsTemplateDefault(templateName.Trim()) ? Utils.GetTemplatePath_Default(templateName) : Utils.GetTemplatePath(templateName);
        string filePath = layoutName.ToLower().Equals("core") ? string.Format("{0}/Layouts/standard/All.xml", Utils.GetTemplatePath_Default("Default")) : string.Format("{0}/layouts/{1}.xml", templatePath, layoutName);
        bool ismodernLayout = false;
        List<XmlTag> lstSectionNodes = new List<XmlTag>();
        XmlDocument doc = XmlHelper.LoadXMLDocument(filePath);//layout
        XmlElement root = doc.DocumentElement;
        if (root.Attributes["modern"] != null)
        {     
            ismodernLayout = true;
        }
        return ismodernLayout;
    }

    [WebMethod]
    public static string LoadLayouts(string templateName)
    {
        string filePath = Decide.IsTemplateDefault(templateName.Trim()) ? Utils.GetTemplatePath_Default(templateName) : Utils.GetTemplatePath(templateName);
        DirectoryInfo dir = new DirectoryInfo(filePath + "/layouts");
        string layouts = string.Empty;
        foreach (FileInfo layout in dir.GetFiles())
        {
            string layoutName = layout.Name.Replace(".xml", "");
            layouts += ',' + layoutName;
        }
        return layouts;
    }
    [WebMethod]
    public static List<string> ModernLayoutList(string templateName)
    {
        List<string> objLayoutList = new List<string>();
        string filePath = Decide.IsTemplateDefault(templateName.Trim()) ? Utils.GetTemplatePath_Default(templateName) : Utils.GetTemplatePath(templateName);
        DirectoryInfo dir = new DirectoryInfo(filePath + "/layouts");
        string layouts = string.Empty;
        foreach (FileInfo layout in dir.GetFiles())
        {
            string fileName = layout.FullName;
            string layoutValue = string.Empty;
            bool modernLayout = CheckModernLayout(fileName, out layoutValue);
            if (modernLayout)
            {
                objLayoutList.Add(layout.Name + ",,,," + layoutValue);
            }
        }
        return objLayoutList;
    }

    [WebMethod]
    public static string SingleModernLayout(string templateName, string layoutName)
    {
        string filePath = Decide.IsTemplateDefault(templateName.Trim()) ? Utils.GetTemplatePath_Default(templateName) : Utils.GetTemplatePath(templateName);
        filePath = string.Format("{0}/layouts/{1}.xml", filePath, layoutName);
        string layoutValue = string.Empty;
        if (File.Exists(filePath))
        {
            CheckModernLayout(filePath, out layoutValue);
        }
        return layoutValue;
    }

    public static int last = 0;
    public static string ParselinkedInXMl(string xml, string nodeStart, int sectionIndex)
    {
        string nodeLast = "</section>";
        int start = xml.ToLower().IndexOf(nodeStart.ToLower());
        if (start != -1)
        {
            last = xml.IndexOf(nodeLast, last + nodeLast.Length);
            int length2 = last - start - nodeStart.Length;
            xml = xml.Substring(start + nodeStart.Length, length2);
            return xml;
        }
        else
            return string.Empty;
    }

    [WebMethod]
    public static void RecreateLayout(string FilePath, string TemplateName, string sfHeader, string sfContain, string sfFooter)
    {

        string templatePath = Decide.IsTemplateDefault(TemplateName.Trim()) ? Utils.GetTemplatePath_Default(TemplateName) : Utils.GetTemplatePath(TemplateName);
        //string filePath = string.Format("{0}/layouts/{1}.xml",templatePath,FilePath);
        string filePath = FilePath.ToLower().Equals("core") ? string.Format("{0}/Layouts/standard/All.xml", Utils.GetTemplatePath_Default("Default")) : string.Format("{0}/layouts/{1}.xml", templatePath, FilePath);
        //string filePath = HttpContext.Current.Server.MapPath("~/") + FilePath;
        StreamReader srMatchCase = new StreamReader(filePath);
        StreamReader srReadToEnd = new StreamReader(filePath);
        string xml = srReadToEnd.ReadToEnd();
        string sectionHeader = "<section name=\"sfHeader\"";
        string sectionContain = "<section name=\"sfContent\"";
        string sectionFooter = "<section name=\"sfFooter\"";
        string line = string.Empty;
        try
        {
            while ((line = srMatchCase.ReadLine()) != null)
            {
                if (line.Contains(sectionHeader))
                {
                    sectionHeader = line;
                }
                if (line.Contains(sectionContain))
                {
                    sectionContain = line;
                }
                if (line.Contains(sectionFooter))
                {
                    sectionFooter = line;
                }
                if (line.Contains("leftA"))
                {
                    sfContain.Replace(line, "");
                    sfContain += line;
                }
                if (line.Contains("leftB"))
                {
                    sfContain.Replace(line, "");
                    sfContain += line;
                }
                if (line.Contains("lefttop"))
                {
                    sfContain.Replace(line, "");
                    sfContain += line;
                }
                if (line.Contains("leftbottom"))
                {
                    sfContain.Replace(line, "");
                    sfContain += line;
                }
                if (line.Contains("righttop"))
                {
                    sfContain.Replace(line, "");
                    sfContain += line;
                }
                if (line.Contains("RightA"))
                {
                    sfContain.Replace(line, "");
                    sfContain += line;
                }
                if (Regex.IsMatch(line, @"\s*<\s*placeholder.*name\s*=\s*[" + "\"" + @"']+\s*rightB\s*[" + "\"" + @"']+[^>]*>.*</placeholder\s*\>"))
                {
                    sfContain.Replace(line, "");
                    sfContain += line;
                }
                if (Regex.IsMatch(line, @"\s*<\s*placeholder.*name\s*=\s*[" + "\"" + @"']+\s*rightbottom\s*[" + "\"" + @"']+[^>]*>.*</placeholder\s*\>"))
                {
                    sfContain.Replace(line, "");
                    sfContain += line;
                }

            }
        }
        catch (Exception)
        {
            throw;
        }
        srMatchCase.Close();
        srReadToEnd.Close();
        string oldSectionHeader = ParselinkedInXMl(xml, sectionHeader, 1);
        string oldsectionContain = ParselinkedInXMl(xml, sectionContain, 2);
        string oldsectionFooter = ParselinkedInXMl(xml, sectionFooter, 3);
        last = 0;
        try
        {
            if (oldSectionHeader != string.Empty)
            {
                xml = xml.Replace(oldSectionHeader, sfHeader);
            }
            if (oldsectionContain != string.Empty)
            {
                xml = xml.Replace(oldsectionContain, sfContain);
            }
            if (oldsectionFooter != string.Empty)
            {
                xml = xml.Replace(oldsectionFooter, sfFooter);
            }
            xml = xml.Replace(@"width=""100""", "");
            //xml = xml.Replace(oldSectionHeader, sfHeader).Replace(oldsectionContain,sfContain).Replace(oldsectionFooter,sfFooter);
            StreamWriter srWriteXml = new StreamWriter(filePath);
            srWriteXml.Write(xml);
            srWriteXml.Close();
            UpdateLayout(FilePath, xml, TemplateName);


        }
        catch (Exception)
        {
            throw;
        }
    }

    [WebMethod]
    public static int UpdateLayout(string FilePath, string Xml, string TemplateName)
    {
        int status = 0;
        TemplateName = TemplateName.Trim();
        if (!Utils.ContainsXmlHeader(Xml))
        {
            Xml = string.Format("<?xml version=\"1.0\" encoding=\"utf-8\"?>{0}", Xml);
        }
        if (Decide.IsXmlInputValid(Xml))
        {
            string templatePath = Decide.IsTemplateDefault(TemplateName) ? Utils.GetTemplatePath_Default(TemplateName) : Utils.GetTemplatePath(TemplateName);
            //string filePath = string.Format("{0}/layouts/{1}.xml",templatePath,FilePath);
            string filePath = FilePath.ToLower().Equals("core") ? string.Format("{0}/Layouts/standard/All.xml", Utils.GetTemplatePath_Default("Default")) : string.Format("{0}/layouts/{1}.xml", templatePath, FilePath);

            using (StreamWriter sw = new StreamWriter(filePath))
            {
                XDocument doc = XDocument.Parse(Xml);
                sw.Write(doc.ToString());
            }
            CreateLayoutControls(TemplateName, filePath);
        }
        else
        {
            status = 1;
        }
        return status;
    }
    [WebMethod]
    public static int CreateLayout(string FilePath, string Xml, string TemplateName)
    {
        string templatePath = Decide.IsTemplateDefault(TemplateName.Trim()) ? Utils.GetTemplatePath_Default(TemplateName) : Utils.GetTemplatePath(TemplateName);
        string filePath = templatePath + "/layouts/" + Utils.GetFileNameWithExtension(FilePath, "xml");
        int status = 0;
        try
        {
            if (Decide.IsXmlInputValid(Xml))
            {
                using (StreamWriter sw = new StreamWriter(filePath))
                {
                    if (!Utils.ContainsXmlHeader(Xml))
                    {
                        sw.Write("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
                    }
                    sw.Write(Xml);
                }
                CreateLayoutControls(TemplateName.Trim(), filePath);
            }
            else
            {
                status = 1;
            }
            return status;

        }
        catch (Exception)
        {
            throw;
        }
    }

    [WebMethod]
    public static string CreateModernLayout(string FilePath, string Xml, string TemplateName, string ascx)
    {
        string templatePath = Decide.IsTemplateDefault(TemplateName.Trim()) ? Utils.GetTemplatePath_Default(TemplateName) : Utils.GetTemplatePath(TemplateName);
        string filePath = templatePath + "/layouts/" + Utils.GetFileNameWithExtension(FilePath, "xml");
        int status = 0;
        try
        {
            //if (Decide.IsXmlInputValid(Xml))
            //{
            using (StreamWriter sw = new StreamWriter(filePath))
            {
                //if (!Utils.ContainsXmlHeader(Xml))
                //{
                //    sw.Write("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
                //}
                sw.Write(Xml);
            }

            string controlname = string.Format("{0}.ascx", FilePath);
            if (!File.Exists(templatePath + "/" + controlname))
            {
                FileStream fs = null;
                using (fs = File.Create(templatePath + "/" + controlname))
                {
                }
            }
            else
            {
                File.Delete(templatePath + "/" + controlname);
                FileStream fs = null;
                using (fs = File.Create(templatePath + "/" + controlname))
                {
                }
            }
            using (StreamWriter sw = new StreamWriter(templatePath + "/" + controlname))
            {
                sw.Write("<%@ Control Language=\"C#\" ClassName=\"" + FilePath + "\" %>");
                sw.Write(Environment.NewLine);
                sw.Write(ascx);
            }

            //}
            //else
            //{
            //    status = 1;
            //}
            return FilePath;

        }
        catch (Exception)
        {
            throw;
        }
    }

    [WebMethod]
    public static List<FileEntity> GetFiles(string TemplateName, string FolderPath)
    {
        string filePath = Decide.IsTemplateDefault(TemplateName) ? Utils.GetTemplatePath_Default(TemplateName) : Utils.GetTemplatePath(TemplateName);
        filePath = FolderPath != "" ? filePath + "/" + FolderPath : filePath;
        List<FileEntity> lstFiles = new List<FileEntity>();
        if (Directory.Exists(filePath))
        {
            DirectoryInfo dir = new DirectoryInfo(filePath);
            foreach (DirectoryInfo folder in dir.GetDirectories())
            {
                lstFiles.Add(new FileEntity(folder.Name, folder.FullName, "", Path.HasExtension(folder.Name) ? false : true, Size(folder), folder.CreationTime.ToShortDateString()));
            }
            foreach (FileInfo file in dir.GetFiles())
            {
                lstFiles.Add(new FileEntity(file.Name, file.FullName, Path.GetExtension(file.Name), Path.HasExtension(file.Name) ? false : true, file.Length, file.CreationTime.ToShortDateString()));
            }
        }
        return lstFiles;
    }

    public static long Size(DirectoryInfo dirInfo)
    {
        long total = 0;
        foreach (System.IO.FileInfo file in dirInfo.GetFiles())
            total += file.Length;
        foreach (System.IO.DirectoryInfo dir in dirInfo.GetDirectories())
            total += Size(dir);
        return total;
    }
    [WebMethod]
    public static string ReadFiles(string TemplateName, string FilePath)
    {
        XmlParser _parser = new XmlParser();
        string filePath = Decide.IsTemplateDefault(TemplateName) ? Utils.GetTemplatePath_Default(TemplateName) : Utils.GetTemplatePath(TemplateName);
        filePath = FilePath != "" ? filePath + "/" + FilePath : filePath;
        string html = XmlHelper.GetXMLString(filePath);
        return html;
    }

    [WebMethod]
    public static void DeleteTemplate(string TemplateName)
    {
        try
        {
            string target_dir = Decide.IsTemplateDefault(TemplateName) ? Utils.GetTemplatePath_Default(TemplateName) : Utils.GetTemplatePath(TemplateName);
            Utils.DeleteDirectory(target_dir);
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
    [WebMethod]
    public static void DeleteTheme(string TemplateName, string ThemeName)
    {
        string target_dir = Decide.IsTemplateDefault(TemplateName) ? Utils.GetTemplatePath_Default(TemplateName) : Utils.GetTemplatePath(TemplateName);
        string theme_dir = target_dir + "/Themes/" + ThemeName;
        Utils.DeleteDirectory(theme_dir);
    }
    [WebMethod]
    public static List<KeyValue> GetPreviewImages(string TemplateName)
    {
        string target_dir = Decide.IsTemplateDefault(TemplateName) ? Utils.GetTemplatePath_Default(TemplateName) : Utils.GetTemplatePath(TemplateName);
        string imagePath = target_dir + "/screenshots/";
        List<KeyValue> lstImages = new List<KeyValue>();
        DirectoryInfo dirInfo = new DirectoryInfo(imagePath);
        foreach (FileInfo file in dirInfo.GetFiles())
        {
            string ext = Path.GetExtension(file.Name);
            if (ext == ".jpg" || ext == ".png" || ext == ".gif")
                lstImages.Add(new KeyValue(file.Name, file.FullName));
        }
        return lstImages;
    }

    [WebMethod]
    public static void DeletePreset(string TemplateName, string Preset)
    {
        string presetPath = Decide.IsTemplateDefault(TemplateName) ? Utils.GetPresetPath_DefaultTemplate(TemplateName) : Utils.GetPresetPath(TemplateName);
        string pagepreset = presetPath + "/" + TemplateConstants.PagePresetFile;
        string target_dir = Decide.IsTemplateDefault(TemplateName) ? Utils.GetTemplateInfoFilePath_Default(TemplateName) : Utils.GetTemplateInfoFilePath(TemplateName);
        string preset_dir = target_dir + "/presets/" + Preset;
        Utils.DeleteFile(preset_dir);
        PresetHelper.DeletePresetFromPresetPages(Preset, pagepreset);
    }
    [WebMethod]
    public static void DeleteLayout(string TemplateName, string Layout)
    {
        TemplateName = Utils.CleanString(TemplateName);
        string templatePath = Decide.IsTemplateDefault(TemplateName) ? Utils.GetTemplatePath_Default(TemplateName) : Utils.GetTemplatePath(TemplateName);
        string fileName = Path.GetFileName(Layout);
        Layout = string.Format("{0}/layouts/{1}.xml", templatePath, Layout);
        string controlfile = string.Format("{0}/{1}.ascx", templatePath, Path.GetFileNameWithoutExtension(Layout));
        Utils.DeleteFile(controlfile);
        Utils.DeleteFile(Layout);

    }

    [WebMethod]
    public static void CreateTemplate(string filepath, string FolderName)
    {
        try
        {
            if (filepath == "") filepath = "~/";
            string completePath = HttpContext.Current.Server.MapPath(filepath + "/Templates/" + FolderName);
            string path = HttpContext.Current.Server.MapPath(filepath);
            DirectoryInfo SrcDir = new DirectoryInfo(path + "/Core/Blank/");
            DirectoryInfo DisDir = new DirectoryInfo(path + "/Templates/" + FolderName);
            CopyDirectory(SrcDir, DisDir);
        }
        catch (Exception e)
        {
            throw e;
        }
    }

    [WebMethod]
    static void CopyDirectory(DirectoryInfo source, DirectoryInfo destination)
    {
        if (!destination.Exists)
        {
            destination.Create();
        }
        FileInfo[] files = source.GetFiles();
        foreach (FileInfo file in files)
        {
            file.CopyTo(Path.Combine(destination.FullName, file.Name));
        }
        // Process subdirectories.
        DirectoryInfo[] dirs = source.GetDirectories();
        foreach (DirectoryInfo dir in dirs)
        {
            // Get destination directory.
            string destinationDir = Path.Combine(destination.FullName, dir.Name);
            // Call CopyDirectory() recursively.
            CopyDirectory(dir, new DirectoryInfo(destinationDir));
        }
    }

    [WebMethod]
    public static Foldername CheckExistingTemplate(string filepath, string FolderName)
    {
        string fname = string.Empty;
        string TempFolder = HttpContext.Current.Server.MapPath(filepath + "/Templates/");
        DirectoryInfo dInfo = new DirectoryInfo(TempFolder);
        Foldername info = new Foldername();
        foreach (DirectoryInfo obj in dInfo.GetDirectories())
        {
            if (obj.Name.ToLower() == FolderName.ToLower())
            {
                info.Existfolder = obj.Name.ToLower();
            }
        }
        return (info);
    }

    [WebMethod]
    public static void ResetCore(string FilePath, string TemplateName)
    {
        try
        {
            string xml = Utils.FallbackLayout();
            string DefaultfilePath = string.Format("{0}/Layouts/standard/All.xml", Utils.GetTemplatePath_Default("Default"));
            if (!File.Exists(DefaultfilePath))
            {

                FileStream fs = File.Create(DefaultfilePath);
                fs.Flush();
                fs.Close();
                fs.Dispose();

            }
            StreamWriter srWriteXml = new StreamWriter(DefaultfilePath);
            srWriteXml.WriteLine(xml);
            srWriteXml.Close();
        }
        catch (Exception ex)
        {

            throw ex;
        }
    }

    #region "Entity"
    public class Foldername
    {
        public string Existfolder { get; set; }
        public Foldername() { }
    }
    #endregion
    #region "Theme Options"

    [WebMethod(true)]
    public static void SaveThemeOptions(string TemplateName, string ThemeOptions)
    {
        TemplateController obj = new TemplateController();
        obj.SaveThemeOptions(TemplateName, ThemeOptions);
    }


    [WebMethod]
    public static string GetThemeOptions(string TemplateName)
    {
        TemplateController obj = new TemplateController();
        return obj.GetThemeOptions(TemplateName);
    }
    [WebMethod]
    public static string GetAvailableFonts(string TemplateName)
    {
        StringBuilder sb = new StringBuilder();
        string HTML = string.Empty;
        string FolderPath = string.Empty;
        if (TemplateName == "Default")
           
            FolderPath = HttpContext.Current.Server.MapPath("~/Core/Template/fonts");

        else
            FolderPath = HttpContext.Current.Server.MapPath("~/Templates/" + TemplateName + "/fonts");
        if (Directory.Exists(FolderPath))
        {
            List<string> objFileList = new List<string>();
            foreach (string files in Directory.GetFiles(FolderPath))
            {
                FileInfo info = new FileInfo(files);

                if (!objFileList.Contains(Path.GetFileNameWithoutExtension(info.Name)))
                {
                    objFileList.Add(Path.GetFileNameWithoutExtension(info.Name));
                }

               
            }
            foreach (string Filename in objFileList)
            {
                sb.Append("<option>");
                sb.Append(Path.GetFileNameWithoutExtension(Filename));
                sb.Append("</option>");
                
            }

        }
        HTML = sb.ToString();

        return HTML;
    }
    [WebMethod]
    public static string GetReletedFontFile(string TemplateName, string FileName)
    {

        string FolderPath = string.Empty;
        string objExtList = string.Empty;
        if (TemplateName == "Default")
            FolderPath = HttpContext.Current.Server.MapPath("~/Core/Template/fonts");
        else
            FolderPath = HttpContext.Current.Server.MapPath("~/Templates/" + TemplateName + "/fonts");
        if (Directory.Exists(FolderPath))
        {

            foreach (string files in Directory.GetFiles(FolderPath))
            {
                FileInfo info = new FileInfo(files);

                if (Path.GetFileNameWithoutExtension(info.Name) == FileName)
                {
                    objExtList += Path.GetExtension(info.Name) + ",";
                }


            }
        }

        return objExtList;
    }
    [WebMethod]
    public static string GetPatterns(string TemplateName)
    {
        StringBuilder sb = new StringBuilder();
        string HTML = string.Empty;
        HTML = "Patterns are not found.";
        string FolderPath = string.Empty;
        string FilePath = string.Empty;
        string RootURL = HttpContext.Current.Request.Url.ToString();
        string RawURL = HttpContext.Current.Request.RawUrl.ToString();
        RootURL = RootURL.Replace(RawURL, string.Empty);
        if (TemplateName == "Default")
        {
            FolderPath = HttpContext.Current.Server.MapPath("~/Core/Template/images/patterns/");
            FilePath = RootURL + "/Core/Template/images/patterns/";
        }
        else
        {
            FolderPath = HttpContext.Current.Server.MapPath("~/Templates/" + TemplateName + "/images/pattern/");
            FilePath = RootURL + "/Templates/" + TemplateName + "/images/pattern/";
        }
        if (Directory.Exists(FolderPath))
        {
            foreach (string files in Directory.GetFiles(FolderPath))
            {
                FileInfo info = new FileInfo(files);
                sb.Append("<img class='' alt=" + Path.GetFileName(info.Name) + " src=");
                sb.Append(FilePath + Path.GetFileName(info.Name));
                sb.Append(">");
            }
            HTML = sb.ToString();
        }

        return HTML;
    }
    [WebMethod]
    public static string ReadCustomCSS(string TemplateName)
    {
        string html = string.Empty;

        try
        {

            html = GetXMLString(TemplateName);

        }
        catch (Exception e)
        {
            throw e;
        }

        return html;
    }
    [WebMethod]
    public static string GetRawCss(bool Navigation, bool Forms, bool Tables, bool Pagination)
    {
        string html = string.Empty;

        try
        {

            html = ReadRawCss(Navigation, Forms, Tables, Pagination);

        }
        catch (Exception e)
        {
            throw e;
        }

        return html;
    }
    public static string GetXMLString(string TemplateName)
    {

        string xml = null;
        string FilePath = string.Empty;
        if (TemplateName == "Default")
        {
            FilePath = HttpContext.Current.Server.MapPath("~/Core/Template/css/custom.css");
        }
        else
        {
            FilePath = HttpContext.Current.Server.MapPath("~/Templates/" + TemplateName + "/css/custom.css");
        }
        StreamReader sr = null;
        try
        {
            if (File.Exists(FilePath))
            {
                sr = new StreamReader(FilePath);
                xml = sr.ReadToEnd();
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            if (sr != null)
            {
                sr.Close();
                sr = null;
            }

        }
        return xml;
    }
    public static string ReadRawCss(bool Navigation, bool Forms, bool Tables, bool Pagination)
    {
        //  Navigation,bool Forms,bool Tables,bool Pagination)
        string xml = null;

        string NavigationFilePath = string.Empty;
        string FormsFilePath = string.Empty;
        string TablesFilePath = string.Empty;
        string PaginationFilePath = string.Empty;


        StreamReader srNavigation = null;
        StreamReader srForms = null;
        StreamReader srTables = null;
        StreamReader srPagination = null;
        StreamReader sr = null;
        try
        {
            string FilePath = string.Empty;
            FilePath = HttpContext.Current.Server.MapPath("~/Modules/LayoutManager/css/RawCss/Raw_template.css");
            if (File.Exists(FilePath))
            {

                sr = new StreamReader(FilePath);
                xml = sr.ReadToEnd();

            }
            if (Navigation)
            {
                string NavigationPath = HttpContext.Current.Server.MapPath("~/Modules/LayoutManager/css/RawCss/Navigation.css");
                if (File.Exists(NavigationPath))
                {
                    srNavigation = new StreamReader(NavigationPath);
                    xml += srNavigation.ReadToEnd();

                }
            }
            if (Forms)
            {
                string FormPath = HttpContext.Current.Server.MapPath("~/Modules/LayoutManager/css/RawCss/Forms.css");
                if (File.Exists(FormPath))
                {
                    srForms = new StreamReader(FormPath);
                    xml += srForms.ReadToEnd();

                }
            }
            if (Tables)
            {
                string TablePath = HttpContext.Current.Server.MapPath("~/Modules/LayoutManager/css/RawCss/Table.css");
                if (File.Exists(TablePath))
                {
                    srTables = new StreamReader(TablePath);
                    xml += srTables.ReadToEnd();

                }
            }
            if (Pagination)
            {
                string PaginationPath = HttpContext.Current.Server.MapPath("~/Modules/LayoutManager/css/RawCss/Pagination.css");
                if (File.Exists(PaginationPath))
                {
                    srPagination = new StreamReader(PaginationPath);
                    xml += srPagination.ReadToEnd();

                }
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            if (sr != null)
            {
                sr.Close();
                sr = null;
            }
            if (srNavigation != null)
            {
                srNavigation.Close();
                srNavigation = null;
            }
            if (srForms != null)
            {
                srForms.Close();
                srForms = null;
            }
            if (srTables != null)
            {
                srTables.Close();
                srTables = null;
            }
            if (srPagination != null)
            {
                srPagination.Close();
                srPagination = null;
            }
        }
        return xml;
    }

    [WebMethod]
    public static void UpdateCustomCSS(string TemplateName, string CustomCSS)
    {


        string FilePath = string.Empty;

        if (TemplateName == "Default")
        {
            FilePath = HttpContext.Current.Server.MapPath("~/Core/Template/css/custom.css");

        }
        else
        {
            FilePath = HttpContext.Current.Server.MapPath("~/Templates/" + TemplateName + "/css/custom.css");

        }
        if (File.Exists(FilePath))
        {
            File.SetAttributes(FilePath, FileAttributes.Normal);
            File.Delete(FilePath);

        }
        if (!File.Exists(FilePath))
        {
            FileStream CreateFile = File.Create(FilePath);
            CreateFile.Close();
        }
        if (File.Exists(FilePath))
        {
            StreamWriter objStreamWriter = new StreamWriter(FilePath, true);
            objStreamWriter.Write(CustomCSS);
            objStreamWriter.Close();
        }

    }

    [WebMethod]
    public static void UpdateTemplateCSS(string TemplateName, string TemplateCSS)
    {


        string FilePath = string.Empty;

        if (TemplateName == "Default")
        {
            FilePath = HttpContext.Current.Server.MapPath("~/Core/Template/css/template.css");

        }
        else
        {
            FilePath = HttpContext.Current.Server.MapPath("~/Templates/" + TemplateName + "/css/template.css");

        }
        if (File.Exists(FilePath))
        {
            File.SetAttributes(FilePath, FileAttributes.Normal);
            File.Delete(FilePath);

        }
        if (!File.Exists(FilePath))
        {
            FileStream CreateFile = File.Create(FilePath);
            CreateFile.Close();
        }
        if (File.Exists(FilePath))
        {
            StreamWriter objStreamWriter = new StreamWriter(FilePath, true);
            objStreamWriter.Write(TemplateCSS);
            objStreamWriter.Close();
        }

    }
    [WebMethod]
    public static void ResetThemeOptions(string TemplateName)
    {
        TemplateController obj = new TemplateController();
        obj.ResetThemeOptions(TemplateName);
    }
    #endregion

}
