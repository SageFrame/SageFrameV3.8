<%@ WebService Language="C#" Class="PaymentGateway" %>
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using SageFrame.Security.Entities;
using SageFrame.Security;
using SageFrame.Templating;
using System.IO;
using SageFrame.Pages;
using SageFrame.Services;
using SageFrame.PaymentGateWay;

/// <summary>
/// Summary description for MenuWebService
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]

public class PaymentGateway : AuthenticateService
{

    [WebMethod]
    public PaymentGatewayInfo LoadPaymentGateways(int UserModuleID, int PortalID, string UserName, string SecureToken)
    {
        PaymentGatewayInfo objPayment = new PaymentGatewayInfo();
        if (IsPostAuthenticatedView(PortalID, UserModuleID, UserName, SecureToken))
        {
            PaymentController objPaymentController = new PaymentController();
            objPayment = objPaymentController.GetPaymentGatewaysSetting(PortalID);
        }
        return objPayment;
    }

    [WebMethod]
    public void SavePaymentGateways(int UserModuleID, int PortalID, string UserName, string SecureToken, string SettingValue)
    {
        if (IsPostAuthenticatedView(PortalID, UserModuleID, UserName, SecureToken))
        {
            PaymentGatewayInfo objPayment = new PaymentGatewayInfo();
            PaymentController objPaymentController = new PaymentController();
            objPayment.UserModuleID = UserModuleID;
            objPayment.PortalID = PortalID;
            objPayment.SettingValue = SettingValue;
            objPayment.UserName = UserName;
            objPaymentController.SavePaymentGateways(objPayment);
        }
    }
}