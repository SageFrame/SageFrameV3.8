<%@ Control Language="C#" AutoEventWireup="true" CodeFile="TopStickyBar.ascx.cs"
    Inherits="Controls_TopStickyBar" %>
<%@ Register Src="LoginStatus.ascx" TagName="LoginStatus" TagPrefix="uc1" %>
<div class="sfTopbar clearfix">
    <ul class="left">
        <li>
            <div class="sfLogo">
                <asp:HyperLink ID="hypLogo" runat="server">Dashboard</asp:HyperLink>
                <asp:Label runat="server" ID="lblVersion"></asp:Label>
            </div>
        </li>
    </ul>
    <ul class="right">
    </ul>
    <div id="cpanel" runat="server">
        <div id="divCpanel" style="top: -254px;">
            <div id="signin_menu" class="clearfix">
                <ul>
                    <li>
                        <h6 class="sfLocalee">
                            Customize:</h6>
                        <p>
                            <label class="sfLocalee">
                                Themes:</label>
                            <asp:DropDownList ID="ddlThemes" runat="server" meta:resourcekey="ddlThemesResource1">
                            </asp:DropDownList>
                        </p>
                        <p>
                            <label class="sfLocalee">
                                Screen:</label>
                            <asp:DropDownList ID="ddlScreen" runat="server" meta:resourcekey="ddlScreenResource1">
                                <asp:ListItem Value="0" meta:resourcekey="ListItemResource1">fluid</asp:ListItem>
                                <asp:ListItem Value="1" meta:resourcekey="ListItemResource2">wide</asp:ListItem>
                                <asp:ListItem Value="2" meta:resourcekey="ListItemResource3">narrow</asp:ListItem>
                            </asp:DropDownList>
                        </p>
                        <p>
                            <label class="sfLocalee">
                                Layouts:</label>
                            <asp:DropDownList ID="ddlLayout" runat="server" meta:resourcekey="ddlLayoutResource1">
                            </asp:DropDownList>
                        </p>
                        <p>
                            <asp:Button ID="btnApply" OnClick="btnApply_Click" runat="server" Text="Apply" CssClass="sfBtn"
                                meta:resourcekey="btnApplyResource1" />
                        </p>
                        <div class="sfMode">
                            <h6 class="sfLocalee">
                                Mode:</h6>
                            <label class="sfLocale">
                                <input id="rdbEdit" name="mode" type="radio" />
                                Edit</label>
                            <label class="sfLocale">
                                <input id="rdbLayout" name="mode" type="radio" />
                                Layout</label>
                            <label class="sfLocale">
                                <input id="rdbNone" name="mode" type="radio" />
                                None</label>
                        </div>
                    </li>
                </ul>
            </div>
            <span class="sfCpanel icon-themesetting signin"></span>
        </div>
    </div>
    <ul class="right">
        <li class="sfDashBoard">
            <asp:HyperLink ID="hlnkDashboard" CssClass="icon-dashboard" runat="server" meta:resourcekey="hlnkDashboardResource1">Dashboard</asp:HyperLink>
        </li>
        <li class="loggedin"><span class="icon-user">
            <asp:Literal ID="litUserName" runat="server" Text="Logged As" meta:resourcekey="litUserNameResource1">
            </asp:Literal></span> &nbsp;<strong><%= userName%></strong> </li>
        <li class="logout"><span class='myProfile  icon-arrow-s'></span>
            <div class="myProfileDrop Off" style="display: none;">
                <ul>
                    <li>
                        <%= userName%>
                    </li>
                    <li class="myaccount">
                        <asp:HyperLink runat="server" ID="lnkAccount" Text="My Account" meta:resourcekey="lnkAccountResource1"></asp:HyperLink>
                    </li>
                    <li>
                        <uc1:LoginStatus ID="LoginStatus2" runat="server" />
                    </li>
                </ul>
            </div>
        </li>
    </ul>
</div>
