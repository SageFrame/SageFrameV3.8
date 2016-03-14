<%@ Control Language="C#" AutoEventWireup="true" CodeFile="FileMgr.ascx.cs" Inherits="Modules_FileManager_FileMgr" %>
<script type="text/javascript">
    $(function () {
        $(this).FManager({
            UserID: '<%=UserID%>',
            UserModuleID: '<%=UserModuleID%>',
            hostdirName: '<%=hostdirName%>',
            UserName: '<%=UserName%>'
        });
    });

</script>
<h1>File Manager</h1>
<div class="sfFilemanageholder sfMargintop">
    <div id="divFileTreeOuter">
        <div id="divTab">
            <ul class="sfTab clearfix">
                <li id="Template" class="sfActive">
                    <label class="sfFormlabel">
                        Template</label></li>
                <li id="Module">
                    <label class="sfFormlabel">
                        Modules</label></li>
                <li id="System" class="lastList">
                    <label class="sfFormlabel">
                        System</label></li>
            </ul>
        </div>
        <div class="clear">
        </div>
        <div id="divFileTree">
        </div>
    </div>
    <div class="sfRightcol sfContentWrap">
        <div class="sfContent">
            <div class="clearfix sfFormwrapper sfPadding sfBorderNone">
                <div id="divControls">
                    <ul>
                        <li class="sfUpload icon-add-file sfBtn">Add File</li>
                        <li class="sfDelete icon-delete-file sfBtn">Delete File</li>
                        <li class="sfAddfolder icon-add-folder sfBtn">Add Folder</li>
                        <li class="sfDeletefolder icon-delete-folder sfBtn">Delete Folder</li>
                        <li class="sfCopy icon-copy sfBtn">Copy</li>
                        <li class="sfMove icon-move sfBtn">Move</li>
                        <li class="sfRefresh icon-refresh sfBtn">Refresh</li>
                    </ul>
                    <div class="clear">
                    </div>
                </div>
                <div id="divSearch" class="sfTableOption clearfix">
                    <div class="sfLeftdiv">
                        <table border="0" cellspacing="0" cellpadding="0" class="sfFloatleft">
                            <tr>
                                <td>
                                    <label class="sfFormlabel">
                                        Address:</label>
                                </td>
                                <td>
                                    <input type="text" id="txtAddress" class="sfInputbox" disabled="disabled" />
                                </td>
                                <td>
                                    <label class="sfFormlabel">
                                        Search:</label>
                                </td>
                                <td>
                                    <input type="text" id="txtSearch" class="sfInputbox sfAuto sfFloatLeft" />
                                    <label id="imbSearch" class="icon-search sfBtn">
                                    </label>
                                </td>
                                <td>
                                    <%-- <img src="" id="imbSearch" />--%>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="sfRightdiv">
                        <label class="sfFormlabel">
                            Items Per Page:</label>
                        <select id="ddlPageSize" class="sfListmenu sfAuto">
                        </select>
                    </div>
                </div>
            </div>
            <div id="divFileList">
            </div>
            <div id='divPagerNav' class="sfPagination clearfix">
            </div>
        </div>
    </div>
</div>
<div id="uploadFilePopUp" class="popupbox sfFormwrapper" style="height: 150px; width: 200px; background-color: #fff">
    <div class="ui-widget-header">
        <span class="ui-dialog-title" id="ui-dialog-title-divEditPopUp">FileMgrPopUp</span><a
            href="#" class="ui-dialog-titlebar-close" role="button"><span class="sfClosepopup ui-icon ui-icon-closethick">close</span></a>
    </div>
    <table>
        <%-- <tr>
       <td colspan="3">
                <span id="spnPath"></span>
            </td>
        </tr>--%>
        <tr>
            <td>
                <span class="sfFormlabel">Browse Files: </span>
            </td>
            <td>
                <input type="file" id="fileUpload" class="fileClass" />
            </td>
        </tr>
    </table>
</div>
<div id="newFolderPopUp" class="popupbox sfFormwrapper">
    <div class="ui-widget-header">
        <span class="ui-dialog-title" id="Span1">Add New Folder</span><a href="#" class="ui-dialog-titlebar-close ui-corner-all"
            role="button"><span class="sfClosepopup ui-icon ui-icon-closethick">close</span></a>
    </div>
    <table>
        <tr>
            <td>
                <span class="sfFormlabel">FolderName:</span>
            </td>
            <td>
                <input type="text" id="txtFolderName" class="sfInputbox" />
            </td>
            <td></td>
        </tr>
        <tr>
            <td>
                <span class="sfFormlabel">Type:</span>
            </td>
            <td>
                <input type="checkbox" id="chkFolderType" disabled="disabled" checked="checked">
                Standard
                <%-- <select id="ddlFileType" class="sfListmenu">
                    <option value="0">Standard</option>
                    <option value="1">Secured</option>
                    <option value="2">Database</option>
                </select>--%>
            </td>
            <td>
                <div class="sfButtonwrapper">
                    <input type="button" id="btnCreateFolder" class="sfBtn" value="Create" />
                </div>
            </td>
        </tr>
    </table>
</div>
<div id="divEditMode" class="popupbox sfFormwrapper" style="height: 75%; width: 75%; overflow: scroll; background-color: #fff">
    <div class="ui-widget-header">
        <span class="ui-dialog-title" id="Span4">FileMgrPopUp</span><a href="#" class="ui-dialog-titlebar-close ui-corner-all"><span
            class="sfClosepopup ui-icon ui-icon-closethick">close</span></a>
    </div>
    <div id="divImages">
        <h2>Edit Image</h2>
        <div id="divFileInforMation">
        </div>
        <table>
            <tr id="trUrl">
                <td>
                    <label class="sfFormlabel">
                        Share Link:
                    </label>
                    <input type="text" class="sfInputbox" id="txtUrl" readonly="readonly" style="width: 400px;" />
                </td>
                <td>
                    <a id='downloadLink' class='icon-download sfBtn'>Download</a>
                </td>
            </tr>
            <tr>
                <td>
                    <label id="hdnPath" style="display: none">
                    </label>
                    <label class="sfFormlabel">
                        Image:
                    </label>
                    <label id="txtTitle">
                    </label>
                </td>
                <td>
                    <label class="sfFormlabel">
                        Cropped image:</label>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="sfOrgImage">
                        <img src="" alt="My Image" title="Image" id="originalImage" />
                    </div>
                    <div>
                        X1
                        <input type="text" size="4" id="x1" name="x1" class="coor" readonly="readonly" />
                        Y1
                        <input type="text" size="4" id="y1" name="y1" class="coor" readonly="readonly" />
                        X2
                        <input type="text" size="4" id="x2" name="x2" class="coor" readonly="readonly" />
                        Y2
                        <input type="text" size="4" id="y2" name="y2" class="coor" readonly="readonly" />
                        <br />
                        W
                        <input type="text" size="4" id="w" name="w" class="coor" readonly="readonly" />
                        H
                        <input type="text" size="4" id="h" name="h" class="coor" readonly="readonly" />
                    </div>
                    <div>
                        <label id="btnCrop" class="icon-crop sfBtn" onclick="return ValidateSelected();">
                            Crop</label>
                    </div>
                </td>
                <td style="vertical-align: top;">
                    <div id="divCropedImage" class="sfCropImage">
                    </div>
                </td>
            </tr>
            <tr>
                <td></td>
            </tr>
        </table>
    </div>
    <div id="divEditFile">
        <label class="sfFormlabel">
            Share Link:
        </label>
        <input type="text" class="sfInputbox" id="txtShareFile" readonly="readonly" style="width: 400px;" />
        <a id='downloadFile' class='icon-download sfBtn'>Download</a>
        <textarea id="txtEditFile" name="txtEditFile" style="display: none"></textarea>
        <label id="lblFilepath" style="display: none">
        </label>
        <div class="sfButtonwrapper sftype1">
            <label id="lblSaveDocument" class="icon-save sfBtn">
                Save</label>
        </div>
    </div>
</div>
<div id="divEditPopUp" class="popupbox sfFormwrapper">
    <div class="ui-widget-header">
        <span class="ui-dialog-title" id="Span2">Rename File</span><a href="#" class="ui-dialog-titlebar-close ui-corner-all"
            role="button"><span class="sfClosepopup ui-icon ui-icon-closethick">close</span></a>
    </div>
    <table>
        <tr>
            <td width="80px">
                <span class="sfFormlabel">FileName:</span>
            </td>
            <td>
                <input type="text" id="txtEditFileName" class="sfInputbox" />
            </td>
        </tr>
        <tr>
            <td>
                <span class="sfFormlabel">File Mode:</span>
            </td>
            <td>
                <input type="checkbox" id="chkArchive" value="A" disabled="disabled" />
                Archive<br />
            </td>
            <%--   <td>
                <input type="checkbox" id="chkRead" value="R" />
                Read
            </td>--%>
        </tr>
        <%--  <tr>
            <td>
            </td>
            <td>
                <input type="checkbox" id="chkSystem" value="W" />
                Write<br />
            </td>
        </tr>
        <tr>
            <td>
            </td>
            <td>
                <input type="checkbox" id="chkHidden" value="H" />
                Hidden<br />
            </td>
        </tr>--%>
        <tr>
            <td colspan="2"></td>
            <td>
                <div class="sfButtonwrapper">
                    <input type="button" id="btnUpdateFile" value="Update" class="sfBtn" />
                </div>
            </td>
        </tr>
    </table>
</div>
<div id="divCopyFiles" class="popupbox">
    <div class="ui-widget-header">
        <span class="ui-dialog-title" id="Span3">Message</span><a href="#" class="ui-dialog-titlebar-close ui-corner-all"
            role="button"><span class="sfClosepopup ui-icon ui-icon-closethick"> close</span></a>
    </div>
    <p id="copyMessage">
    </p>
    <div class="sfButtonwrapper">
        <input type="button" id="btnCopy" class="sfBtn" value="" />
    </div>
</div>
<div id="divMessagePopUp" class="popupbox">
    <div class="ui-widget-header">
        <a href="#" class="ui-dialog-titlebar-close ui-corner-all" role="button"><span class="sfClosepopup ui-icon ui-icon-closethick">close</span></a>
    </div>
    <div class="cssClassFileManagerPopUP" style="text-align: center">
        <span class="cssClassMessage sfFormlabel"></span>
    </div>
</div>
<div id="divSuccessPopUp" class="popupbox">
    <div class="ui-widget-header">
        <a href="#" class="ui-dialog-titlebar-close ui-corner-all" role="button"><span class="sfClosepopup ui-icon ui-icon-closethick">close</span></a>
    </div>
    <div class="cssClassFileManagerPopUP" style="text-align: center">
        <span class="cssClassSuccessMessage sfFormlabel"></span>
    </div>
</div>
<div id="divErrorPopUp" class="popupbox">
    <div class="ui-widget-header">
        <span class="ui-dialog-title" id="Span6">Add New Folder</span><a href="#" class="ui-dialog-titlebar-close ui-corner-all"
            role="button"><span class="sfClosepopup ui-icon ui-icon-closethick">close</span></a>
    </div>
    <div class="cssClassFileManagerPopUP" style="text-align: center">
        <span class="cssClassErrorMessage sfFormlabel"></span>
    </div>
</div>
<div id="divConfirmPopUp" class="popupbox sfFormwrapper">
    <div class="ui-widget-header">
        <span class="ui-dialog-title" id="Span7">Confirmation</span><a href="#" class="ui-dialog-titlebar-close ui-corner-all"
            role="button"><span class="sfClosepopup ui-icon ui-icon-closethick">close</span></a>
    </div>
    <span class="sfFormlabel sfConfirmmsg" style="text-align: center"></span>
    <div class="sfButtonwrapper" style="text-align: center">
        <input type="button" id="btnConfirmYes" value="Yes" style="float: none" class="sfBtn" />
        <input type="button" id="btnConfirmNo" value="No" style="float: none" class="sfBtn" />
    </div>
</div>
<asp:HiddenField ID="hdnDestinationPath" runat="server" Value="" />
