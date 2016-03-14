using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using SageFrame.Web;
using System.Net;
using System.IO;
using SageFrame.PaymentGateWay;
using System.Text;
using System.Web.Script.Serialization;

public partial class Modules_PayPalExample_PaypalExample : BaseAdministrationUserControl, IPay
{
    protected void Page_Load(object sender, EventArgs e)
    {
        GrabInformation();
    }
    protected void btnPaypalCheck_Click(object sender, EventArgs e)
    {
        try
        {
            ProcessPayment();
        }
        catch (Exception ex)
        {
            ProcessException(ex);
        }
    }

    private void GrabInformation()
    {
        try
        {
            if (Request.QueryString["tx"] != null)
                PaymentSuccess();
        }
        catch (Exception ex)
        {
            ProcessException(ex);
        }
    }

    public void PaymentSuccess()
    {

        PaymentController objController = new PaymentController();
        PaymentGatewaySetting objSettings= objController.FetchSetting(GetPortalID);
        PayPalSetting objPaypalSetting = objSettings.PayPal;

        string _transID = "";
        string payer_email = "";
        string _authToken = objPaypalSetting.AuthToken;
        string _txToken = Request.QueryString.Get("tx");
        string _query = string.Format("cmd=_notify-synch&tx={0}&at={1}", _txToken, _authToken);
        const string strSandbox = "https://www.sandbox.paypal.com/cgi-bin/webscr";
        const string strLive = "https://www.paypal.com/cgi-bin/webscr";
        string testPaypal = string.Empty;
        if (Session["IsTestPayPal"] != null)
        {
            testPaypal = bool.Parse(Session["IsTestPayPal"].ToString()) ? strSandbox : strLive;
        }
        var req = (HttpWebRequest)WebRequest.Create(testPaypal);

        req.Method = "POST";
        req.ContentType = "application/x-www-form-urlencoded";
        req.ContentLength = _query.Length;

        var stOut = new StreamWriter(req.GetRequestStream(), System.Text.Encoding.ASCII);
        stOut.Write(_query);
        stOut.Close();

        var stIn = new StreamReader(req.GetResponse().GetResponseStream());
        string _strResponse = stIn.ReadToEnd();
        stIn.Close();

        if (_strResponse.StartsWith("SUCCESS"))
        {
            String[] stringArray = _strResponse.Split('\n');
            int i;
            string status = string.Empty;
            for (i = 1; i < stringArray.Length - 1; i++)
            {
                String[] stringArray1 = stringArray[i].Split('=');
                String sKey = stringArray1[0];
                String sValue = HttpUtility.UrlDecode(stringArray1[1]);
                switch (sKey)
                {
                    case "txn_id":
                        _transID = Convert.ToString(sValue);
                        break;
                    case "payment_status":
                        status = Convert.ToString(sValue);
                        break;
                    case "payer_email":
                        payer_email = Convert.ToString(sValue);
                        break;
                }
            }
            //Store information here
        }
    }

    public void ProcessPayment()
    {
        try
        {
            PaymentController objController = new PaymentController();
            PaymentGatewaySetting objSettings = objController.FetchSetting(GetPortalID);
            PayPalSetting objPaypalSetting = objSettings.PayPal;
            if (objPaypalSetting != null)
            {                
                objPaypalSetting = objSettings.PayPal;
                string postUrl;
                string ReturnUrl = objPaypalSetting.RedirectURL;
                string BusinessAccount = objPaypalSetting.BusinessAccount;
                bool IsTestPaypal = objPaypalSetting.IsTestPayPal;
                string VerificationUrl = "";
                string CancelUrl = objPaypalSetting.CancelURL;
                string MainCurrency = "Us";
                double donateAmount = float.Parse(objPaypalSetting.Price.ToString());
                if (IsTestPaypal)
                {
                    postUrl = "https://www.sandbox.paypal.com/us/cgi-bin/webscr";
                    HttpContext.Current.Session["IsTestPayPal"] = true;
                }
                else
                {
                    postUrl = "https://www.paypal.com/us/cgi-bin/webscr";
                    HttpContext.Current.Session["IsTestPayPal"] = false;
                }
                string ids = IsTestPaypal.ToString();

                var url = new StringBuilder();
                url.Append(postUrl + "?cmd=_cart&business=" +
                           HttpUtility.UrlEncode(BusinessAccount.Trim()));
                int nCount = 1;
                url.AppendFormat("&item_name_" + nCount + "={0}", HttpUtility.UrlEncode("TestPaypal"));
                url.AppendFormat("&amount_" + nCount + "={0}",
                                 HttpUtility.UrlEncode(Math.Round(donateAmount, 2).ToString()));
                url.AppendFormat("&quantity_" + nCount + "={0}", HttpUtility.UrlEncode(1.ToString()));
                double discountAll = 0;
                double couponDiscount = 0;
                double taxAll = 0;
                double shippingCostAll = 0;
                url.AppendFormat("&num_cart_items={0}", HttpUtility.UrlEncode(nCount.ToString()));
                url.AppendFormat("&discount_amount_cart={0}",
                                 HttpUtility.UrlEncode(Math.Round((discountAll + couponDiscount), 2).ToString()));
                url.AppendFormat("&tax_cart={0}", HttpUtility.UrlEncode(Math.Round(taxAll, 2).ToString()));
                url.AppendFormat("&no_shipping={0}", HttpUtility.UrlEncode("1"));
                url.AppendFormat("&shipping_1={0}", HttpUtility.UrlEncode(Math.Round(shippingCostAll, 2).ToString()));
                url.AppendFormat("&currency_code={0}", HttpUtility.UrlEncode(MainCurrency));
                if (ReturnUrl != null && ReturnUrl.Trim() != "")
                    url.AppendFormat("&return={0}", HttpUtility.UrlEncode(ReturnUrl.ToString()));
                if (!string.IsNullOrEmpty(VerificationUrl))
                    url.AppendFormat("&notify_url={0}", HttpUtility.UrlEncode(VerificationUrl));
                if (!string.IsNullOrEmpty(CancelUrl))
                    url.AppendFormat("&cancel_return={0}", HttpUtility.UrlEncode(CancelUrl));
                url.AppendFormat("&upload={0}", HttpUtility.UrlEncode("1"));
                url.AppendFormat("&rm={0}", HttpUtility.UrlEncode("1"));
                url.AppendFormat("&custom={0}", HttpUtility.UrlEncode(ids));
                Response.Redirect(url.ToString(), false);
            }
        }
        catch (Exception ex)
        {
            ProcessException(ex);
        }
    }

    public void AdditionalFee()
    {
    }
    public void Refund()
    {
    }
    public void Cancel()
    {
    }
    public void GetTax()
    {
    }

}