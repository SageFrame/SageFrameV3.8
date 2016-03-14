<%@ Control Language="C#" AutoEventWireup="true" CodeFile="NewsLetterView.ascx.cs"
    Inherits="Modules_NewsLetter_NewsLetterView" %>

<script type="text/javascript">
    $(function() {
        $(".sfLocalee").SystemLocalize();
    });
    var UserModuleID = '<%=UserModuleID %>';
    var PortalID = '<%=PortalID %>';
    var NewsLetterPath = '<%=ModulePath %>';
    var UserName = '<%=UserName %>';
    var PageExt = '<%=PageExt %>';
        
</script>

<div id="divSubscribe" class="sfSubscribe">
    <div id="divRadios" style="display: none;">
        <input type="radio" name="rdbSubcribe" class="sfLocalee" value="ByEmail">By Email</input>
        <!--<input type="radio" name="rdbSubcribe" class="sfLocalee" id="rdbPhone" value="ByPhone">By
            Phone</input>-->
    </div>
    <label id="lblmessage" style="display: none" class="sfMessage sfLocalee">
    </label>
    <div id="divEmailSubsCribe">
        <div id="divEmailtext" class="sfLocalee">
            Your Email</div>
        <input name="Email" type="text" id="txtSubscribeEmail" class="sfInputbox" />
    </div>
  <!--  <div id="phoneSubscribe" style="display: none;">
        <div id="divPhoneText" class="sfLocalee">
            Your Mobile Number</div>
        <input name="Mobile" onkeypress="return isNumberKey(event)" type="text" class="sfInputbox"
            id="txtPhone" />
    </div>-->
    <div class="sfSubscribe">
        <input id="btnSubscribe" type="button" class="sfBtn sfLocalee" value="Subscribe" />
        <%--  <a id="btnSubscribe" href="javascript:void(0);" class="sfBtn sfLocalee">Subscribe</a>--%>
    </div>
    <!--<div id="divbUnsubscribe">
        <asp:Literal runat="server" ID="UnSubscribe"></asp:Literal>
    </div>-->
</div>
