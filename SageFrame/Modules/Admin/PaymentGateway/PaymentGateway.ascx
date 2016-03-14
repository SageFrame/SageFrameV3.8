<%@ Control Language="C#" AutoEventWireup="true" CodeFile="PaymentGateway.ascx.cs" Inherits="Modules_PaymentGateway_PaymentGateway" %>



<script type="text/javascript">
    //<![CDATA[
    $(function () {
        $(this).PaymentGateway({
            UserModuleID: '<%=userModuleID%>'
        });
    });
    //]]>	
</script>
<h2>Payment Gateway Setting Manager </h2>
<div class="sfButtonwrapper sfPadding">
    <span class="sfBtn icon-addnew" id="btnAddPaymentGateway">Add Payment Gateway</span>
</div>

<div class="sfGridwrapper clearfix">
    <div class="divOuter">
        <p class="CreatePaymentName sfFormwrapper" style="display: none; border: none;">
            <label>Payment Gateway Name</label>
            <input type="text" class="sfInput" id="txtPaymentGatewayName" />
            <span class="sfBtn icon-addnew" id="btnCreatePayment">Create</span>
            <span class="sfBtn icon-close" id="btnCancelPaymentCreate">Cancel</span>
        </p>

        <p class="noPaymentName sfFormwrapper" style="display: none; border: none;">
            <label>There is no payment Gateway Setting in the system.</label>
        </p>


        <%-- <table class="tblPayment" id="tblpayment" style="display: none;">
            <thead>
                <th>Setting key</th>
                <th>Setting value</th>
                <th></th>
            </thead>
            <tr>
                <td>
                    <label>RedirectURL</label></td>
                <td>
                http://samthing.com/asdf.aspx
            <td>

                <span>X</span>
            </td>

            </tr>

            <tr>
                <td>
                    <input type="text" class="test" value="asdasd" /></td>
                <td>
                    <input type="text" class="test" value="asdasd" /></td>
                <td>

                    <span>X</span>
                </td>

            </tr>
            <tr>
                <td>
                    <input type="text" class="test" value="asdasd" /></td>
                <td>
                    <input type="text" class="test" value="asdasd" /></td>
                <td>

                    <span>X</span>
                </td>

            </tr>
            <tr>
                <td>
                    <input type="text" class="test" /></td>
                <td>
                    <input type="text" class="test" /></td>
                <td>

                    <span>X </span><span class="sfBtn">AddField</span>
                </td>

            </tr>


        </table>--%>



        <%--<table>
            <thead>
                <th>S.No</th>
                <th>Payment Gateway Name</th>
                <th>Edit</th>
                <th>Delete</th>
            </thead>

            <tr>
                <td>1</td>
                <td>PayPal</td>
                <td><a class="icon-edit" title="Edit User" id="ctl19_gdvUser_ctl02_imgEdit"></a>
                </td>
            </tr>
            <tr>
                <td>1</td>
                <td>eSEWA</td>
                <td><a class="icon-edit" title="Edit User" id="ctl19_gdvUser_ctl02_imgEdit"></a>
                </td>
            </tr>
            <tr>
                <td>1</td>
                <td>tESTED</td>
                <td><a class="icon-edit" title="Edit User" id="ctl19_gdvUser_ctl02_imgEdit"></a>
                </td>
            </tr>
        </table>--%>
    </div>
    <div class="PaymentGatewayList" style="display: none;">
        <table class="tblPaymentGatewayList">
            <thead>
                <th>S.No</th>
                <th>Payment Gateway Name</th>
                <th>Edit Settings</th>
                <th>Delete Payment</th>
                <th><span class="sfBtn icon-delete" id="deleteSelectedPayment">Delete Selected</span></th>
            </thead>
        </table>
    </div>
    <div class="divEdit sfFormwrapper" style="display: none; border: none;">
        <h3 id="Header">Test</h3>

        <span id="AddRow" class="sfBtn sfButtonwrapper icon-addnew">Add New Row</span>
        <table class="tblPayment" id="tblpayment">
            <thead>
                <th>Setting Key</th>
                <th>SettingValue</th>
                <th></th>
            </thead>
        </table>
        <div class="sfButtonwrapper">
            <span id="SaveEdit" class="sfBtn sfButtonwrapper icon-save">Save</span>
            <span id="CancelEdit" class="sfBtn sfButtonwrapper icon-close">Cancel</span>
        </div>
    </div>
</div>
