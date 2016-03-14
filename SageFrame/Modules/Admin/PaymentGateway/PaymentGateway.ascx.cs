using SageFrame.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Modules_PaymentGateway_PaymentGateway : BaseAdministrationUserControl
{
    public int userModuleID = 0;
    protected void Page_Load(object sender, EventArgs e)
    {
        userModuleID = int.Parse(SageUserModuleID);
        IncludeCss("PaymentCss", "/Modules/Admin/PaymentGateway/css/module.css");
        IncludeJs("PaymentIs", "/Modules/Admin/PaymentGateway/js/PaymentGateway.js");
        IncludeJs("AlertJS", "/js/jquery.alerts.js");
        IncludeCss("AlertCSS", "/css/jquery.alerts.css");
    }
}