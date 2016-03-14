var currentTemplateName = '';// this varible is created inorder to share the choosen template name with modernlayout.js
(function ($) {
    $.createLayoutManager = function (p) {
        p = $.extend
        ({
            PortalID: 1,
            AppPath: SageFrameAppPath,
            Extension: '',
            EditFilePath: '',
            UserModuleID: ''
        }, p);
        var Customeditor = "";
        var ThemeOptions = "";
        var chkNavigation = "";
        var chkForms = "";
        var chkTable = "";
        var chkPagination = "";
        var editor = CodeMirror.fromTextArea(document.getElementById("txtLayoutEditor"), { lineNumbers: true, mode: { name: "xml", htmlMode: true } });
        var editorCreate = CodeMirror.fromTextArea(document.getElementById("txtLayoutCreator"), { lineNumbers: true, mode: { name: "xml", htmlMode: true } });
        var LayoutManager = {
            config: {
                isPostBack: false,
                async: false,
                timeout: 3000,
                cache: false,
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                data: { data: '' },
                dataType: 'json',
                baseURL: p.AppPath + '/Modules/LayoutManager/WebMethod.aspx/',
                method: "",
                url: "",
                ajaxCallMode: 0,
                ActiveLayout: '',
                ActiveTheme: '',
                SettingMode: 'Theme',
                Template: 'Default',
                AppPath: p.AppPath,
                NavMode: 'Folder',
                ReturnData: null,
                FileName: "",
                PortalID: p.PortalID,
                pchArr: [],
                wrapArr: [],
                ActivePageDiv: "",
                PanName: [],
                NewValue: [],
                sfHeader: '',
                sfFooter: '',
                sfContain: ''
            },
            init: function () {
                this.BindEvents();
                this.LoadTemplates();
                this.InitVisibility();
                //this.UploadFavicon();
                SageFrame.tooltip.GetToolTip("imgToolTip", "#spnPresets", SageFrame.messages.Presets);
                SageFrame.tooltip.GetToolTip("imgToolTip1", "#spnActivelayout", "This is from where you can include items into your menu");
                SageFrame.tooltip.GetToolTip("imgToolTip2", "#spnActivetheme", "This is from where you can include items into your menu");
                SageFrame.tooltip.GetToolTip("imgToolTip3", "#spnActivewidth", "This is from where you can include items into your menu");
                SageFrame.tooltip.GetToolTip("imgToolTip4", "#spnHandheld", "This is from where you can include items into your menu");
                SageFrame.tooltip.GetToolTip("imgToolTip5", "#spnApplytopages", "This is from where you can include items into your menu");
                $('div.sfLayoutmanager').hide();
                $('#tabLayoutMgr').tabs({ fx: [null, { height: 'show', opacity: 'show' }] });
                $('div.sfPresetmessage').hide();
                LayoutManager.config.pchArr.push("&lt;placeholder");
                LayoutManager.config.wrapArr.push("&lt;wrap");
                $('#divLayoutWireframe').on('click', 'th', function () {
                    var tableId = $(this).parents('table').prop('id');
                    var self = $(this);
                    var th = self.parents('table').find('th');
                    if (self.prev('th').hasClass('sfActive') || self.next('th').hasClass('sfActive')) {
                        self.toggleClass('sfActive');
                        $('#merge_' + tableId).show();
                        $('#btnMerge_' + tableId).show();
                        $('#split_' + tableId).hide();
                    }
                    else {
                        th.not(self).removeClass('sfActive');
                        self.toggleClass('sfActive');
                        $('#split_' + tableId).show();
                        $('#btnSplit_' + tableId).show();
                        $('#merge_' + tableId).hide();
                    }
                    if (self.prev('th').hasClass('sfActive') && self.next('th').hasClass('sfActive')) {
                        th.removeClass('sfActive');
                        $('#merge_' + tableId).hide();
                        $('#split_' + tableId).hide();
                    }
                    if ($('#' + tableId).find('.sfActive').length == 0) {
                        $('#merge_' + tableId).hide();
                        $('#split_' + tableId).hide();
                    }
                    if ($('#' + tableId).find('.sfActive').length == 1) {
                        $('#merge_' + tableId).hide();
                        $('#btnSplit_' + tableId).show();
                        $('#split_' + tableId).show();
                    }
                    if ($('#' + tableId).find('.sfActive').length > 1) {
                        $('#merge_' + tableId).show();
                        $('#btnMerge_' + tableId).show();
                        $('#split_' + tableId).hide();
                    }
                });

                $('#divLayoutWireframe').on('click', '#btnReset', function () {
                    LayoutManager.ResetCore();
                });

                $('#lblSaveLayoutChange').on("click", function () {
                    LayoutManager.config.PanName = [];
                    LayoutManager.config.NewValue = [];
                    $('.sfOuterwrapper').each(function (index) {
                        if ($(this).prop('id') !== 'sfBodyContent') {
                            var tableId = $(this).prop('id') + "_mytable";
                            LayoutManager.LoadPanName($(this).prop('id'));
                            var pchId = '#divPlaceHolder_' + tableId.toLowerCase();
                            LayoutManager.LoadNewLayout($(pchId).text());
                        }
                    });
                    var containA = "";
                    LayoutManager.config.sfHeader = "";
                    LayoutManager.config.sfContent = "";
                    LayoutManager.config.sfFooter = "";
                    var temp = 0;
                    $('#sfOuterWrapper div.sfOuterwrapper').each(function (index) {
                        var id = $(this).prop('id');
                        var tableID = id + "_mytable";
                        var pchId = '#divPlaceHolder_' + tableID.toLowerCase();
                        var containA = $(pchId).text();
                        if (id !== "sfBodyContent") {
                            if (temp == 1) {
                                temp = 2;
                            }
                        }
                        else {
                            temp = 1;
                            $('.sfMainContent,.sfMiddletop,.sfMiddlebottom,.sfFulltopspan,.sfFullbottomspan').find('table').each(function () {
                                var pid = "#divPlaceHolder_" + $(this).prop('id');
                                containA += $(pid).text();
                            });
                        }
                        if (temp == 0) {
                            LayoutManager.config.sfHeader += containA;
                        }
                        if (temp == 1) {
                            LayoutManager.config.sfContent += containA;
                        }
                        if (temp == 2) {
                            LayoutManager.config.sfFooter += containA;
                        }
                    });
                    var fileName = $('#ddlLayoutList').val();
                    LayoutManager.RecreateLayout(fileName, LayoutManager.config.sfHeader.length > 0 ? LayoutManager.config.sfHeader : "", LayoutManager.config.sfContent.length > 0 ? LayoutManager.config.sfContent : "", LayoutManager.config.sfFooter.length > 0 ? LayoutManager.config.sfFooter : "");
                });
                $('#ddlAttr').bind("change", function () {
                    switch ($('#ddlAttr option:selected').val()) {
                        case 0:
                            break;
                        case "1":
                            if ($('#spnNameTooltip').length == 0) {
                                $('#tblAttr').append("<tr><td width='20%'><label class='sfFormlabel'>name=</label></td><td><input id='txtName' title='name' type='text' class='sfInputbox sfInputlm'/></td><td><span id='spnNameTooltip'></span></td></tr>");
                                SageFrame.tooltip.GetToolTip("imgToolTip5", "#spnNameTooltip", "The name of the placeholder");
                                LayoutManager.config.pchArr.push(" name='fixed'");
                            }
                            break;
                        case "2":
                            if ($('#spnModeTooltip').length == 0) {
                                $('#tblAttr').append("<tr><td width='20%'><label class='sfFormlabel'>mode=</label></td><td>'fixed'</td><td><span id='spnModeTooltip'></span></td></tr>");
                                SageFrame.tooltip.GetToolTip("imgToolTip", "#spnModeTooltip", "If Mode='fixed', the positions inside have fix width");
                                LayoutManager.config.pchArr.push(" mode='fixed'");
                            }
                            break;
                        case "3":
                            if ($('#spnWidthTooltip').length == 0) {
                                $('#tblAttr').append("<tr><td width='20%'><label class='sfFormlabel'>width=</label></td><td><input id='txtWidth' type='text' title='width' class='sfInputbox sfInputlm'/></td><td><span id='spnWidthTooltip'></span></td></tr>");
                                SageFrame.tooltip.GetToolTip("imgToolTip2", "#spnWidthTooltip", "Here we can specify the widths of positions<br/> E.g:width='20,80' ");
                                LayoutManager.config.pchArr.push(" width=''");
                            }
                            break;
                        case "4":
                            if ($('#spnWrapinTooltip').length == 0) {
                                $('#tblAttr').append("<tr><td><label class='sfFormlabel'>wrapinner=</label></td><td><input id='txtWrapinner' type='text' title='wrapinner' class='sfInputbox sfInputlm'/></td><td><span id='spnWrapinTooltip'></span></td></tr>");
                                SageFrame.tooltip.GetToolTip("imgToolTip3", "#spnWrapinTooltip", "It specifies the number of inner wrappers with the class sfInnerwrapper");
                                LayoutManager.config.pchArr.push(" wrapinner=''");
                            }
                            break;
                        case "5":
                            if ($('#spnWrapoutTooltip').length == 0) {
                                $('#tblAttr').append("<tr><td><label class='sfFormlabel'>wrapouter=</label></td><td><input id='txtWrapouter' type='text' title='wrapouter' class='sfInputbox sfInputlm'/></td><td><span id='spnWrapoutTooltip'></span></td></tr>");
                                SageFrame.tooltip.GetToolTip("imgToolTip4", "#spnWrapoutTooltip", "Specifies the number of outer wrappers with the class sfOuterwrapper");
                                LayoutManager.config.pchArr.push(" wrapouter=''");
                            }
                            break;
                    }
                    var count = LayoutManager.config.pchArr.length;
                    $('#pchPreview').html(LayoutManager.config.pchArr.join(' ') + '&gt;&lt;placeholder&gt;');
                });
                $('#txtName,#txtWidth,#txtWrapinner,#txtWrapouter').on("keyup", function () {

                    var self = $(this);
                    $.each(LayoutManager.config.pchArr, function (index, item) {
                        var controlKey = $(self).prop("title");
                        if (index > 0) {
                            var key = item.split('=')[0];
                            key = jQuery.trim(key);
                            controlKey = jQuery.trim(controlKey);
                            if (controlKey == key) {
                                LayoutManager.config.pchArr[index] = key + "=" + "'" + $(self).val() + "'";
                            }
                        }
                    });
                    var count = LayoutManager.config.pchArr.length;
                    $('#pchPreview').html(LayoutManager.config.pchArr.join(' ') + '&gt;&lt;placeholder&gt;');
                });
                $('#txtPlaceholder').on("keyup", function () {
                    $('#pchPreview').html(LayoutManager.config.pchArr.join(' ') + '&gt;' + $(this).val() + '&lt;placeholder&gt;');
                });
                //wrap markup creator
                $('#ddlWrapattr').bind("change", function () {
                    switch ($('#ddlWrapattr option:selected').val()) {
                        case 0:
                            break;
                        case "1":
                            if ($('#spnWrapNameTooltip').length == 0) {
                                $('#tblWrapAttr').append("<tr><td width='20%'><label class='sfFormlabel'>name=</label></td><td><input id='txtWrapName' title='name' type='text' class='sfInputbox'/></td><td><span id='spnWrapNameTooltip'></span></td></tr>");
                                SageFrame.tooltip.GetToolTip("imgToolTip6", "#spnWrapNameTooltip", "The name of the wrapper used");
                                LayoutManager.config.wrapArr.push(" name='mywrapper'");
                            }
                            break;
                        case "2":
                            if ($('#spnWrapTypeTooltip').length == 0) {
                                $('#tblWrapAttr').append("<tr><td width='20%'><label class='sfFormlabel'>type=</label></td><td><select title='type' id='selWraptype' class='sfListmenu'><option value='position'>position</option><option value='placeholder'>placeholder</option></select></td><td><span id='spnWrapTypeTooltip'></span></td></tr>");
                                SageFrame.tooltip.GetToolTip("imgToolTip7", "#spnWrapTypeTooltip", "The type of divs the wrapper wraps.");
                                LayoutManager.config.wrapArr.push(" type='position'");
                            }
                            break;
                        case "3":
                            if ($('#spnWrapClassTooltip').length == 0) {
                                $('#tblWrapAttr').append("<tr><td><label class='sfFormlabel'>class=</label></td><td><input id='txtWrapClass' type='text' title='class' class='sfInputbox'/></td><td><span id='spnWrapClassTooltip'></span></td></tr>");
                                SageFrame.tooltip.GetToolTip("imgToolTip8", "#spnWrapClassTooltip", "This is used to inject custom classes to the wrappers");
                                LayoutManager.config.wrapArr.push(" class=''");
                            }
                            break;
                        case "4":
                            if ($('#spnWrapDepthTooltip').length == 0) {
                                $('#tblWrapAttr').append("<tr><td width='20%'><label class='sfFormlabel'>depth=</label></td><td><input id='txtWrapDepth' type='text' title='depth' class='sfInputbox'/></td><td><span id='spnWrapDepthTooltip'></span></td></tr>");
                                SageFrame.tooltip.GetToolTip("imgToolTip8", "#spnWrapDepthTooltip", "The number of wrappers needed");
                                LayoutManager.config.wrapArr.push(" depth=''");
                            }
                            break;
                    }
                    var count = LayoutManager.config.wrapArr.length;
                    $('#wrapPreview').html(LayoutManager.config.wrapArr.join(' ') + '&gt;&lt;wrap&gt;');
                });
                $('#txtWrapName,#txtWrapClass,#txtWrapDepth').on("keyup", function () {
                    var self = $(this);
                    $.each(LayoutManager.config.wrapArr, function (index, item) {
                        var controlKey = $(self).prop("title");

                        if (index > 0) {
                            var key = item.split('=')[0];
                            key = jQuery.trim(key);
                            controlKey = jQuery.trim(controlKey);

                            if (controlKey == key) {
                                LayoutManager.config.wrapArr[index] = key + "=" + "'" + $(self).val() + "'";
                            }
                        }
                    });
                    var count = LayoutManager.config.wrapArr.length;
                    $('#wrapPreview').html(LayoutManager.config.wrapArr.join(' ') + '&gt;&lt;wrap&gt;');
                });
                $('#selWraptype').on("change", function () {
                    var self = $(this);
                    $.each(LayoutManager.config.wrapArr, function (index, item) {
                        var controlKey = $(self).prop("title");

                        if (index > 0) {
                            var key = item.split('=')[0];
                            key = jQuery.trim(key);
                            controlKey = jQuery.trim(controlKey);

                            if (controlKey == key) {
                                LayoutManager.config.wrapArr[index] = key + "=" + "'" + $(self).val() + "'";
                            }
                        }
                    });
                    var count = LayoutManager.config.wrapArr.length;
                    $('#wrapPreview').html(LayoutManager.config.wrapArr.join(' ') + '&gt;&lt;wrap&gt;');
                });
                $('#txtPositions').on("keyup", function () {
                    $('#wrapPreview').html(LayoutManager.config.wrapArr.join(' ') + '&gt;' + $(this).val() + '&lt;wrap&gt;');
                });
                $('div.sflayoutbuilderhead').bind("click", function () {
                    $(this).next("div").slideToggle();
                });
                //$('#divMsgTemplate').html(SageFrame.messaging.showdivmessage("Presets are a way of achieving multiple layout variations in your site"));
                $('div.sfPresetpages span.delete').on("click", function () {
                    $(this).parent("li").remove();
                });
                $('#activeLayoutList').on('change', 'select', function () {
                    $(this).parent().find("img.sfAddpage").remove();
                    if ($(this).val() == "2") {
                        if ($(this).parent().find(".customize").length == 0) {
                            $(this).parent().append('<span class="customize"><i class="icon-page-add"><i/></span>');
                            $(this).parent().find("div.sfPresetpages").remove();
                        }
                    }
                    else {
                        $(this).parent().find("div.sfPresetpages").remove();
                    }
                });
                $('#selTypes').on("change", function () {
                    switch ($(this).val()) {
                        case "0":
                            $('#tblPch').show();
                            $('#tblWrap').hide();
                            break;
                        case "1":
                            $('#tblWrap').show();
                            $('#tblPch').hide();
                            break;
                    }
                });
            },

            InitEqualHeights: function () {
                //                var middlewrapper = $('#sfMainWrapper').height();
                //                var leftwrapper = $('#sfLeft').height();
                //                var rightwrapper = $('#sfRight').height();
                //                var arrHeights = [middlewrapper, leftwrapper, rightwrapper];
                //                var biggest = Math.max.apply(null, arrHeights);
                //                biggest = biggest < 200 ? 200 : biggest;
                //                $('#sfMainWrapper .sfContainer,#sfLeft .sfContainer,#sfRight .sfContainer').css("height", biggest - 22 + "px");
                //                var lefttop = $('#sfLeft div.sfLeftTop').height() == null ? 0 : $('#sfLeft div.sfLeftTop').height() + 22 + 10;
                //                var leftbottom = $('#sfLeft div.sfLeftBottom').height() == null ? 0 : $('#sfLeft div.sfLeftBottom').height() + 22 + 10;
                //                var sfColsWrapLeft = biggest - (lefttop + leftbottom) - 40;
                //                $('#sfLeft div.sfColswrap').css("height", sfColsWrapLeft + "px");
                //                $('#sfLeft div.sfColswrap div.sfLeftA div.sfWrapper,#sfLeft div.sfColswrap div.sfLeftB div.sfWrapper').css("height", sfColsWrapLeft - 22 + "px");

                //                var righttop = $('#sfRight div.sfRightTop').height() == null ? 0 : $('#sfRight div.sfRightTop').height() + 22 + 10;
                //                var rightbottom = $('#sfRight div.sfRightBottom').height() == null ? 0 : $('#sfRight div.sfRightBottom').height() + 22 + 10;
                //                var sfColsWrapRight = biggest - (righttop + rightbottom) - 40;
                //                $('#sfRight div.sfColswrap').css("height", sfColsWrapRight + "px");
                //                $('#sfRight div.sfColswrap').css("height", sfColsWrapRight + "px");
                //                $('#sfRight div.sfColswrap div.sfRightA div.sfWrapper,#sfRight div.sfColswrap div.sfRightB div.sfWrapper').css("height", sfColsWrapRight - 22 + "px");

                //                
                //                var middletop = $('#sfMainWrapper div.sfMiddletop').height() == null ? 0 : $('#sfMainWrapper div.sfMiddletop').height();
                //                var middlebottom = $('#sfMainWrapper div.sfMiddlebottom ').height() == null ? 0 : $('#sfMainWrapper div.sfMiddlebottom ').height();
                //                var middlemaintop = $('#sfMainWrapper div.sfMiddlemaintop ').height() == null ? 0 : $('#sfMainWrapper div.sfMiddlemaintop ').height();
                //                var middlemainbottom = $('#sfMainWrapper div.sfMiddlemainbottom ').height() == null ? 0 : $('#sfMainWrapper div.sfMiddlemainbottom ').height();
                //                var sfColsWrapMiddle = biggest - (middletop + middlebottom) - 40;

                //                $('#sfMainWrapper div.sfMainContent').css("height", sfColsWrapMiddle + "px");

                //                //$('#sfMainWrapper div.sfMiddlemaincurrent').css("height", sfColsWrapMiddle-middlemaintop-middlemainbottom - 22 + "px");
            },
            ajaxSuccess: function (data) {
                switch (LayoutManager.config.ajaxCallMode) {
                    case 0:
                        editor.setValue(data.d);
                        break;
                    case 1:
                        LayoutManager.BindThemes(data);

                        break;
                    case 2:
                        LayoutManager.BindSetting(data);
                        break;
                    case 3:
                        LayoutManager.BindLayoutList(data);
                        break;
                    case 4:
                        LayoutManager.BindSectionList(data);
                        break;
                    case 5:
                        LayoutManager.BindBlockHTML(data);
                        break;
                    case 6:
                        LayoutManager.BindPages(data);
                        break;
                    case 7:
                        LayoutManager.BindLayoutList_Preset(data);
                        break;
                    case 8:
                        LayoutManager.BindThemeList_Preset(data);
                        break;
                    case 9:
                        LayoutManager.BindTemplates(data);
                        break;
                    case 10:
                        SageFrame.messaging.show(SageFrame.messaging.GetLocalizedMessage("en-US", "TemplateManager", "TemplateActivated"), "Success");
                        LayoutManager.LoadTemplates();
                        break;
                    case 11:
                        LayoutManager.BindBasicSettings(data);
                        break;
                    case 12:
                        LayoutManager.BindLayoutList_Visual(data);
                        break;
                    case 13:
                        LayoutManager.BindLayoutWireFrame(data);
                        LayoutManager.SortPan();
                        break;
                    case 14:
                        LayoutManager.BindUpdatedLayout(data);
                        break;
                    case 15:
                        LayoutManager.BindFiles(data);
                        break;
                    case 16:
                        LayoutManager.BindFileToEditor(data);
                        break;
                    case 17:
                        LayoutManager.BindPresets(data);
                        break;
                    case 18:
                        SageFrame.messaging.show(SageFrame.messaging.GetLocalizedMessage("en-US", "TemplateManager", "TemplateDeleted"), "Success");
                        LayoutManager.LoadTemplates();
                        break;
                    case 19:
                        LayoutManager.BindPreviewImages(data);
                        break;
                    case 20:
                        SageFrame.messaging.show(SageFrame.messaging.GetLocalizedMessage("en-US", "TemplateManager", "ThemeDeleted"), "Success");
                        LayoutManager.BindThemes(data);
                        break;
                    case 21:
                        $('div.sfPresetmessage').slideUp();
                        SageFrame.messaging.show(SageFrame.messaging.GetLocalizedMessage("en-US", "TemplateManager", "PresetDeleted"), "Success");
                        break;
                    case 22:
                        LayoutManager.BindLayoutList_Creator(data);
                        break;
                    case 23:
                        LayoutManager.BindLayout_Create(data);
                        break;
                    case 24:
                        LayoutManager.PostLayoutCreationActions(data);
                        break;
                    case 25:
                        LayoutManager.CheckDuplicateTemplate(data);
                        break;
                    case 26:
                        SageFrame.messaging.show("Template successfully created ", "Success");
                        LayoutManager.LoadTemplates();
                        break;
                    case 27:
                        LayoutManager.LoadLayoutWireFrame($('#ddlLayoutList option:selected').val());
                        SageFrame.messaging.show(" Layout saved successfully", "Success");
                        break;
                    case 28:
                        LayoutManager.LoadLayoutWireFrame($('#ddlLayoutList option:selected').val());
                        break;
                    case 29:
                        if (!$.isEmptyObject(data.d)) {
                            var data = $.parseJSON(data.d);
                            //1st tab
                            $("#layout").val(data.LayOut);
                            $("#chkNavigation").prop("checked", $.parseJSON(data.CSSComponents.chkNavigation));
                            $("#chkForms").prop("checked", $.parseJSON(data.CSSComponents.chkForms));
                            $("#chkTable").prop("checked", $.parseJSON(data.CSSComponents.chkTable));
                            $("#chkPagination").prop("checked", $.parseJSON(data.CSSComponents.chkPagination));
                            $("#chkRightToLeft").prop("checked", $.parseJSON(data.RightToLeft));
                            $("#txtGutterSpace").val(data.GutterSpace);
                            //2nd tab


                            if (data.Font.GoogleFont !== "") {
                                $('#chkGoogleFont').trigger('click');
                                $("#chkGoogleFont").prop("checked", true);
                                $('#googleFont').val(data.Font.GoogleFont);

                            }
                            else {

                                $("#ddlHeadingFont").val(data.Font.HeadingFont);
                                $("#ddlBodyFont").val(data.Font.BodyFont);
                            }

                            $('#txtBaseFontSize').val(data.FontSize.BaseFontSize);
                            $('#txtBaseLineHeight').val(data.FontSize.BaseLineHeight);
                            $('#txtH1').val(data.FontSize.H1);
                            $('#txtH2').val(data.FontSize.H2);
                            $('#txtH3').val(data.FontSize.H3);
                            $('#txtH4').val(data.FontSize.H4);
                            $('#txtH5').val(data.FontSize.H5);
                            $('#txtH6').val(data.FontSize.H6);
                            //3rd tab image
                            $('.patternList  img').each(function () {
                                if ($(this).attr("alt") == data.ActivePattern) {
                                    $(this).addClass("active");
                                }
                            });
                            $("#hdnfullImageBg").val(data.FullImageBg)
                            $("#lblBgImage").text(data.FullImageBg)
                            //4th tab Colors
                            LayoutManager.GetColorPicker(data)
                            $("#textDecoration").prop("checked", $.parseJSON(data.CommonStyles.UnderlineLinkHover));
                            //5th tab Header
                            $("#stickyH").prop("checked", $.parseJSON(data.StickyHeader.EnableHeaderSticky));
                            $("#stickyHmobile").prop("checked", $.parseJSON(data.StickyHeader.DisableStickyHeaderSmallScreens));

                            $("#transHeader").prop("checked", $.parseJSON(data.TransparentHeader.MakeHeaderTransparent));
                            $("#txtTransparencyValue").val(data.TransparentHeader.TransparencyValue);

                            $("#headAtSide").prop("checked", $.parseJSON(data.HeaderFixedSidebar));

                            if ($.parseJSON(data.HeaderFixedSidebar) === true) {
                                $('#stickyH').prop('checked', false);
                                $('#stickyHmobile').prop('checked', false);
                                $('#stickyHmobile').attr('disabled', true);
                                $("#stickyH").attr('disabled', true);
                            }

                        }


                        break;
                    case 30:

                        break;
                    case 31:

                        break;
                    case 32:
                        var pattern = "";
                        pattern = data.d;
                        $('#divPattern').html('');
                        $('#divPattern').html(pattern);
                        LayoutManager.SelectPatterns();
                        break;
                    case 33:

                        break;
                }
            },
            BindEvents: function () {
                $('#lnkThemes').bind("click", function () {


                    $('#lblSaveLayoutChange').hide();
                    $('div.sfNavbar ul li').removeClass("sfActive");
                    $(this).parent("li").addClass("sfActive");
                    $('#sectionsDiv,#layoutsDiv,#basicsDiv,#presetsDiv,div.cssClassLayoutBottom,#visualLayoutMgr').hide();
                    $('#themesDiv').show();
                    LayoutManager.ReadThemes();
                });
                $('#lnkLayoutMgr').bind("click", function () {
                    $('div.sfNavbar ul li').removeClass("sfActive");
                    $(this).parent("li").addClass("sfActive");
                    $('#sectionsDiv,#basicsDiv,#themesDiv,#presetsDiv,div.cssClassLayoutBottom,#visualLayoutMgr').hide();
                    $('#layoutsDiv').show();
                    LayoutManager.LoadLayoutList();
                });
                $('#lnkSectionMgr').bind("click", function () {
                    $('div.sfNavbar ul li').removeClass("sfActive");
                    $(this).parent("li").addClass("sfActive");
                    $('#basicsDiv,#themesDiv,#layoutsDiv,#presetsDiv,div.cssClassLayoutBottom,#visualLayoutMgr').hide();
                    $('#sectionsDiv').show();
                    LayoutManager.config.SettingMode = "Section";
                });
                $('#lnkBasicSettings').bind("click", function () {
                    $('#lblSaveLayoutChange').hide();
                    $('div.sfNavbar ul li').removeClass("sfActive");
                    $(this).parent("li").addClass("sfActive");
                    $('#sectionsDiv,#themesDiv,#layoutsDiv,div.cssClassLayoutBottom,#presetsDiv,#visualLayoutMgr').hide();
                    $('#basicsDiv').show();
                    var templateName = LayoutManager.config.Template
                    LayoutManager.LoadTemplate(templateName);
                });

                $('#lnkPresets').bind("click", function () {
                    $('#lblSaveLayoutChange').hide();
                    $('div.sfNavbar ul li').removeClass("sfActive");
                    $(this).parent("li").addClass("sfActive");
                    $('#basicsDiv,#sectionsDiv,#themesDiv,#layoutsDiv,div.cssClassLayoutBottom,#visualLayoutMgr').hide();
                    $('#presetsDiv').show();
                    LayoutManager.LoadPresets();
                });

                $('li.liDelete').on('click', function () {
                    var selDiv = $(this).prop("id").replace("del_", "");
                    $('.' + selDiv).removeClass(selDiv).addClass("remove");
                    html = '';
                    html += '<option>' + selDiv + '</option>';
                    html += '</ul>'
                    $('#ddlDeletelist').append(html);
                    var attrName = selDiv;
                    var FileName = $('#ddlLayoutList option:selected').val();
                    var FilePath = FileName;
                    RewriteWireFrame(FilePath, attrName);
                });
                $('#spApply').on('click', function () {
                    var FileName = $('#ddlLayoutList option:selected').val();
                    var FilePath = FileName;
                    setXml(FilePath);
                });
                $('#imgUndo').on('click', function () {
                    var restore = $('#ddlDeletelist option:selected').val();
                    $('#del_' + restore).parents('div .remove').prop('class', restore);
                    $('#ddlDeletelist option:selected').remove();
                    var FileName = $('#ddlLayoutList option:selected').val();
                    var FilePath = FileName;
                    var attrName = restore;
                    RemoveVisible(FilePath, attrName);
                });
                $('#btnCreateTemplate').click(function () {
                    $('#sfCreateTemplate').show();
                    $('#txtNewTemplate').val('');
                });
                $('#btnSaveTemplate').click(function () {
                    var TemplateName = $('#txtNewTemplate').val();
                    if (TemplateName == "") {
                        SageFrame.messaging.show("Enter Template Name ", "Alert");
                        return false;
                    }
                    else {
                        LayoutManager.CheckExistingTemplate();
                        LayoutManager.InitVisibility();
                    }
                });
                function RemoveVisible(filepath, attrName) {
                    $.ajax({
                        type: "POST",
                        url: '/Modules/LayoutManager/WebMethod.aspx/RemoveVisible',
                        data: JSON.stringify({ FilePath: filepath, attrName: attrName }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (msg) {
                            $('#divLayoutWireframe').html(msg.d);
                        },
                        error: function () {
                            alert("fail remove visible");
                        }
                    });
                }
                function setXml(filepath) {
                    $.ajax({
                        type: "POST",
                        url: '/Modules/LayoutManager/WebMethod.aspx/setXml',
                        data: JSON.stringify({ FilePath: filepath }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (msg) {
                            $('#divLayoutWireframe').html(msg.d);
                        },
                        error: function () {
                            alert("fail remove setXml");
                        }
                    });
                }
                function RewriteWireFrame(filepath, attrName) {
                    $.ajax({
                        type: "POST",
                        url: '/Modules/LayoutManager/WebMethod.aspx/RewriteWireFrame',
                        data: JSON.stringify({ FilePath: filepath, attrName: attrName }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (msg) {
                            $('#divLayoutWireframe').html(msg.d);
                        },
                        error: function () {
                            alert("fail rewrite");
                        }
                    });
                }

                // Add PCH
                $('#imgAddPlaceHolder').toggle(function () {
                    $('#tblPch').slideToggle("slow");
                    $('#txtLayoutEditor').removeClass("layoutEditor").addClass("layoutEditorWithPch");
                    $('#imgAddPlaceHolder').prop("src", "/Modules/LayoutManager/images/allow_list_close.jpg");
                }, function () {
                    $('#txtLayoutEditor').removeClass("layoutEditorWithPch").addClass("layoutEditor");
                    $('#tblPch').hide();
                    $('#imgAddPlaceHolder').prop("src", "/Modules/LayoutManager/images/text_code_add.png");
                });
                $('#pchAdd').on('click', function () {
                    $(editor).insertAtPch($('#pchPreview').html());
                });

                // themes
                $("#layoutList table tr img.edit").on("click", function () {
                    var fileName = $(this).prev("input[type='hidden']").val();
                    LayoutManager.ReadLayout(fileName);
                });
                $("#sectionList table tr img.edit").on("click", function () {
                    var fileName = $(this).prev("input[type='hidden']").val();
                    LayoutManager.ReadBlockHTML(fileName);
                });
                $('#layoutsDiv div.controls ul li.Add').bind("click", function () {
                    LayoutManager.ShowPopUp("divAddLayout", "Create a Layout");
                });
                $('#chkEnableHandheld_preset').bind("click", function () {
                    if ($(this).prop("checked")) {
                        $('#trHandheld').show();
                    }
                    else {
                        $('#trHandheld').hide();
                    }
                });
                $('#rbPresetCustom').bind("click", function () {
                    LayoutManager.ShowPopUp("divPagePresets", "Select Pages");
                    LayoutManager.GetPages();
                });
                $('span.editLayout').bind("click", function (e) {
                    if (!$(this).hasClass("cssClassActive")) {
                        $('span.editLayout,span.editTheme,span.editWidth').removeClass("cssClassActive");
                        $(this).addClass("cssClassActive");
                        $('#activeLayoutList').show();
                        LayoutManager.LoadLayoutList_Preset();
                    }
                    else {
                        $(this).removeClass("cssClassActive");
                    }
                });
                $(document).scroll(function () {
                    $('#dropEditLayout').hide();
                });
                $(document).click(function () {
                    $('#dropEditLayout').hide();
                });
                $('#dropEditLayout,span.editLayout,span.editTheme,span.editWidth').click(function (event) {
                    event.stopPropagation();
                });
                $('#pageList').on('click', '#pageTree li span', function () {

                    if (!$(this).hasClass("sfActivepage") && !$(this).hasClass("sfAssigned")) {
                        $(this).addClass("sfActivepage");
                    }
                    else {
                        $(this).removeClass("sfActivepage");
                    }
                });
                $('#spnSavePagePreset').bind("click", function () {
                    var pages = $('#pageTree li span.sfActivepage');
                    var html = '<div class="sfPresetpages"><ul>';
                    $.each(pages, function (index, item) {
                        html += '<li class="sfCurve"><span class="sfPageName">' + $.trim($(this).text().replace(/-/g, " ")).replace(/ /g, '-') + '</span><span class="sfDelete"><i class="icon-delete"></i></span></li>';
                    });
                    html += '</ul></div>';
                    var activeElement = LayoutManager.config.ActivePageDiv;
                    $(activeElement).parent().append(html);
                    $('#divPagePresets').dialog("close");
                });
                $('.sfFormwrapper').on('click', '.customize', function () {
                    LayoutManager.config.ActivePageDiv = $(this).prev("select");
                    LayoutManager.ShowPopUp("divPagePresets", "Select Pages");
                    LayoutManager.GetPages();
                });
                $('#presetPages li span').on('click', '.delete', function () {

                    $(this).parent("li").remove();
                });

                $('div.sfButtonwrapper').on('click', 'ul li.preview', function () {

                    var template = $(this).find("a").prop("id");
                    template = template.substring(template.indexOf('#') + 1, template.length);
                    LayoutManager.config.Template = template;
                    LayoutManager.ShowPopUp("divTemplatePreview", "Preview");
                    LayoutManager.GetPreviewImages(template);
                });
                $('a').on('click', '.sfTemplatethumb', function () {

                    var template = $(this).prop("rel");
                    LayoutManager.config.Template = template;
                    LayoutManager.ShowPopUp("divTemplatePreview", "Preview");
                    LayoutManager.GetPreviewImages(template);
                });
                $('div.cssClassPreview span.return').bind("click", function () {
                    $('div.sfLayoutmanager').hide();
                    $('div.sfTemplatemanger').show();
                    LayoutManager.LoadTemplates();
                });
                $('#templateList').on('click', '.sfTemplatedetail', function () {
                    $('div.sfLayoutmanager').show();
                    $('#themesDiv').hide();
                    $('div.sfTemplatemanger').hide();
                    $('#lnkBasicSettings').parent("li").addClass("cssClassActive");
                    var templateName = $(this).find("li.title").text();
                    $('#tabLayoutMgr ul li').removeClass('ui-tabs-selected ui-state-active');
                    $('#tabLayoutMgr ul li:first').addClass('ui-tabs-selected ui-state-active');
                    LayoutManager.InitVisibility();
                    LayoutManager.config.Template = templateName;
                    LayoutManager.LoadTemplate(templateName);
                });

                $('#templateList').on('click', '.templatePreset', function () {
                    $('div.sfLayoutmanager').show();
                    $('#themesDiv').hide();
                    $('div.sfTemplatemanger').hide();
                    $('#lnkBasicSettings').parent("li").addClass("cssClassActive");
                    var templateName = $(this).attr('data');
                    $('#tabLayoutMgr ul li').removeClass('ui-tabs-selected ui-state-active');
                    $('#tabLayoutMgr ul li').eq(1).addClass('ui-tabs-selected ui-state-active');
                    LayoutManager.InitVisibility();
                    LayoutManager.config.Template = templateName;
                    currentTemplateName = templateName;
                    LayoutManager.LoadTemplate(templateName);
                    $('#tabLayoutMgr ul').find('li a').eq(1).trigger('click');
                });

                $('#templateList').on('click', '.templateLayout', function () {
                    $('div.sfLayoutmanager').show();
                    $('#themesDiv').hide();
                    $('div.sfTemplatemanger').hide();
                    $('#lnkBasicSettings').parent("li").addClass("cssClassActive");
                    var templateName = $(this).attr('data');
                    $('#tabLayoutMgr ul li').removeClass('ui-tabs-selected ui-state-active');
                    $('#tabLayoutMgr ul li').eq(2).addClass('ui-tabs-selected ui-state-active');
                    LayoutManager.InitVisibility();
                    LayoutManager.config.Template = templateName;
                    currentTemplateName = templateName;
                    LayoutManager.LoadTemplate(templateName);
                    $('#tabLayoutMgr ul').find('li a').eq(2).trigger('click');
                });


                $('#templateList').on('click', '.lnkThemes', function () {

                    var templateName = $(this).attr('data');
                    LayoutManager.config.Template = templateName;
                    currentTemplateName = templateName;
                    $('div.sfLayoutmanager').show();
                    $('div.sfTemplatemanger').hide();
                    $('#lnkBasicSettings').parent("li").addClass("cssClassActive");
                    var templateName = $(this).attr('data');
                    $('#tabLayoutMgr ul li').removeClass('ui-tabs-selected ui-state-active');
                    $('#tabLayoutMgr ul li').eq(3).addClass('ui-tabs-selected ui-state-active');


                    LayoutManager.InitVisibility();
                    $('#tabLayoutMgr ul').find('li a').eq(3).trigger('click');
                });

                $('#lnkVisualLayoutMgr').bind("click", function () {
                    $('#lblSaveLayoutChange').hide();
                    $('div.cssClassNavBar ul li').removeClass("cssClassActive");
                    $(this).parent("li").addClass("cssClassActive");
                    $('#basicsDiv,#sectionsDiv,#themesDiv,#layoutsDiv,div.cssClassLayoutBottom,#presetsDiv').hide();
                    $('#visualLayoutMgr').show();
                    LayoutManager.LoadLayoutList_Visual();
                });

                $('#ddlLayoutList').on('change', function () {
                    var layout = $('#ddlLayoutList option:selected').val();
                    //  if (layout == "Core" || layout == "UnderConstruction") {
                    if (layout == "Core") {
                        $('#imgEditLayout_Visual,#btnDeleteLayout').hide();
                        $('#lblSaveLayoutChange').hide();
                    }
                    else {
                        $('#imgEditLayout_Visual,#btnDeleteLayout').show();
                        $('#lblSaveLayoutChange').show();
                    }
                    LayoutManager.LoadLayoutWireFrame(layout);
                });
                $('#imgEditLayout_Visual').bind("click", function () {


                    var fileName = $('#ddlLayoutList option:selected').val();
                    $('#hdnLayoutName').val(fileName);

                    LayoutManager.CheckIsModernTemplate(fileName);

                    //var dialogOptions = {
                    //    "title": $(this).parent().prev().find("option:selected").val(),
                    //    "minWidth": 650,
                    //    "minHeight": 500,
                    //    "modal": true,
                    //    "position": [400, 200],
                    //    "dialogClass": "sfFormwrapper"
                    //};
                    //if ($("#button-cancel").prop("checked")) {

                    //    dialogOptions["buttons"] = {
                    //        "Cancel": function () {
                    //            //;
                    //            $(this).dialog("close");
                    //        }
                    //    };
                    //}
                    ////dialog-extend options
                    //var dialogExtendOptions = {
                    //    "maximize": true
                    //};
                    ////open dialog
                    //$("#divEditXML").dialog(dialogOptions).dialogExtend(dialogExtendOptions);
                    ////$('div.ui-dialog').css("z-index", "3000");
                    //LayoutManager.ReadLayout(fileName);


                });
                $('#imgAddLayout').bind("click", function () {
                    var empty = '';
                    LayoutManager.ShowPopUp("divAddLayout", "Add Layout");
                    LayoutManager.LoadLayoutList_Creator();
                    editorCreate.setValue(empty);
                    $('#txtNewLayoutName').val('');
                });
                $('#ddlClonebleLayouts').bind("change", function () {
                    var fileName = $('#ddlClonebleLayouts option:selected').val();
                    LayoutManager.ReadLayout_Create(fileName);
                });
                $('#btnCreateLayout').bind("click", function () {
                    var fileName = SageFrame.utils.GetPageSEOName($('#txtNewLayoutName').val());
                    var hasSpace = $('#txtNewLayoutName').val().indexOf(' ');
                    var regex = /^[A-Za-z]+$/;
                    var templateName = $('#txtNewLayoutName').val();
                    if (hasSpace >= 0) {
                        SageFrame.messaging.alert("Space is not valid for layout name.", '#msgAddLayout');
                    }
                    else {
                        if ($.trim(fileName) == '' || fileName.length == 0) {
                            SageFrame.messaging.alert("Required Field cannot be blank", '#msgAddLayout');
                        }
                        else if (SageFrame.utils.IsNumber(SageFrame.utils.GetFileNameWithoutExtension(fileName))) {
                            SageFrame.messaging.alert("Layout name can contains only alphabets", '#msgAddLayout');
                        }
                        else if (editorCreate.getValue() == "") {
                            SageFrame.messaging.alert("Layout cannot be empty", '#msgAddLayout');
                        }
                        else if (!regex.test(fileName)) {
                            SageFrame.messaging.alert("Layout name can contains only alphabets", '#msgAddLayout');
                        }
                        else if ($("select[id$='ddlClonebleLayouts'] option:contains('" + templateName + "')").length > 0) {
                            SageFrame.messaging.alert("Layout with same name already exists.Please choose different name.", '#msgAddLayout');
                        }
                        else {

                            var xml = editorCreate.getValue();
                            fileName = SageFrame.utils.GetPageSEOName(fileName);
                            LayoutManager.CreateLayout(fileName, xml);
                        }
                    }
                });
                $('#SaveLayout_Edit').bind("click", function () {

                    var fileName = $('#hdnLayoutName').val();
                    var xml = editor.getValue();
                    LayoutManager.UpdateLayout(fileName, xml);
                });
                $('#lblSaveLayout').on("click", function () {
                    var fileName = $('#ddlLayoutList').val();
                    var newValue = $('#divPlaceHolder').text();
                    var template = LayoutManager.config.Template;
                    currentTemplateName = templateName;
                    LayoutManager.RecreateLayout('Core\\Template\\layouts\\' + fileName + '.xml', newValue);
                });
                $('#divFileList ul li a').on("click", function () {
                    var fileName = $(this).text();
                    if (LayoutManager.IsFile(fileName)) {
                        LayoutManager.config.NavMode = "File";
                        if (!LayoutManager.IsImage(fileName)) {
                            $('div.cssClassFileMgr').hide();
                            $('#divInlineEditor').show();
                            $('#btnSaveFile').show();
                            LayoutManager.config.FileName = fileName;
                            LayoutManager.ReadFile(LayoutManager.config.Template, LayoutManager.GetFolderPath($('#divFileMgrBreadCrumb span').last().text()) + "/" + fileName);
                        }
                    }
                    else {
                        LayoutManager.BuildBreadCrumb($(this).text(), 0);
                        var path = LayoutManager.GetFolderPath($(this).text());
                        LayoutManager.LoadFiles(LayoutManager.config.Template, path);
                    }
                });
                $('#divFileMgrBreadCrumb span').on("click", function () {
                    LayoutManager.ResetInlineEditor();
                    var breadCrumb = $('#divFileMgrBreadCrumb span');
                    var path = "";
                    var self = $(this).text();
                    var keepChecking = true;
                    var newBreadCrumb = "";
                    $.each(breadCrumb, function (index, item) {
                        if (keepChecking) {
                            if (self != $(this).text()) {
                                if (index > 0) {
                                    path += $(this).text();
                                    path += "/";
                                }
                                newBreadCrumb += '<span>' + $(this).text() + '</span>';
                                newBreadCrumb += ">>";
                            }
                            else {
                                path += $(this).text();
                                newBreadCrumb += '<span>' + $(this).text() + '</span>';
                                keepChecking = false;
                            }
                        }
                    });
                    path = LayoutManager.config.Template === path ? "" : path;
                    LayoutManager.BuildBreadCrumb(newBreadCrumb, 1);
                    LayoutManager.LoadFiles(LayoutManager.config.Template, path);
                });
                $('div.navBack').bind("click", function () {
                    switch (LayoutManager.config.NavMode) {
                        case "Folder":
                            var length = $('#divFileMgrBreadCrumb span').length;
                            length = length - 1;
                            var selected = $('#divFileMgrBreadCrumb span:nth-child(' + length + ')').text();
                            var path = LayoutManager.GetFolderPath(selected);
                            LayoutManager.LoadFiles(LayoutManager.config.Template, path);
                            LayoutManager.BuildNewBreadCrumb(selected);
                            break;
                        case "File":
                            var selected = $('#divFileMgrBreadCrumb span').last().text();
                            if (LayoutManager.config.Template === selected) {
                                LayoutManager.LoadFiles(LayoutManager.config.Template, "");
                            }
                            else {
                                var path = LayoutManager.GetFolderPath(selected);
                                LayoutManager.LoadFiles(LayoutManager.config.Template, path);
                            }
                            LayoutManager.ResetInlineEditor();
                            break;
                    }
                });
                $('#btnSavePreset').bind("click", function () {
                    LayoutManager.SavePreset();
                    $('div.sfPresetmessage').slideUp();
                });
                $('#btnCreatePreset').on("click", function () {
                    var html = "";
                    html += '<input type="text" id="txtNewPreset" title="Preset Name Goes Here" class="sfInputbox"/>';
                    html += '<img id="imbCreatePreset" src=' + SageFrame.utils.GetAdminImage("imgapprove.png") + '>';
                    html += '<img id="imbCancelPreset" src=' + SageFrame.utils.GetAdminImage("btndelete.png") + '>';
                    $('#liCreatePreset').html(html);
                });
                $('#activeWidthList ul li').on("click", function () {
                    $('#spnActiveWidth').text($(this).text());
                    $('#activeWidthList ul li').removeClass('sfActive');
                    $(this).addClass('sfActive');
                });
                $('#presetsDiv').on('click', '#activeThemeList ul li', function () {
                    $('#spnActiveTheme').text($(this).text());
                    $('#activeThemeList ul li').removeClass('sfActive');
                    $(this).addClass('sfActive');
                });
                $('#btnSaveFile').bind("click", function () {
                    var path = LayoutManager.GetFolderPath(LayoutManager.config.FileName);
                    var filepath = path + LayoutManager.config.FileName;
                    LayoutManager.SaveFileInEditor(filepath);
                });
                $('#lblCancelEditMode').bind("click", function () {
                    $('div.sfLayoutmanager').hide();
                    $('div.sfTemplatemanger').show();
                });
                $('.sfFormwrapper').on('click', 'div.sfPresetpages span.sfDelete', function () {
                    if ($(this).parent().parent("ul").find("li").length == 1) {
                        $(this).parents("div.sfPresetpages").prev("span").remove();
                        $(this).parents("div.sfPresetpages").prev("select").val("0");
                    }
                    $(this).parent("li").remove();
                });
            },
            ajaxFailure: function () {
            },
            complete: function (response, textStatus) {
                // return alert("Hey: " + response);
            },
            ajaxCall: function (config) {
                $.ajax({
                    type: this.config.type,
                    contentType: this.config.contentType,
                    cache: this.config.cache,
                    url: this.config.url,
                    data: this.config.data,
                    dataType: this.config.dataType,
                    success: this.ajaxSuccess,
                    error: this.ajaxFailure,
                    complete: this.complete
                });
            },
            ajaxCall_return: function (url, param) {
                var data = null;
                $.ajax({
                    type: this.config.type,
                    contentType: this.config.contentType,
                    cache: this.config.cache,
                    url: url,
                    async: false,
                    data: param,
                    dataType: this.config.dataType,
                    success: function (msg) { data = msg.d; },
                    error: this.ajaxFailure
                });
                return data;
            },
            SaveFileInEditor: function (filePath) {
                var saveddata = this.ajaxCall_return(this.config.baseURL + "UpdateFile", JSON2.stringify({ TemplateName: LayoutManager.config.Template, FileName: filePath }));
            },
            ShowPopUp: function (popupid, headertext) {
                $('#msgDiv').html('');
                $('#msgAddLayout').html('');
                var options = {
                    modal: true,
                    title: headertext,
                    height: 550,
                    width: 650,
                    dialogClass: "sfFormwrapper"
                };
                dlg = $('#' + popupid).dialog(options);
                dlg.parent().appendTo($('form:first'));
            },
            DropPopUp: function (popupid, e) {
                //getting height and width of the message box
                var height = $(popupid).height();
                var width = $(popupid).width();
                //calculating offset for displaying popup message
                leftVal = e.pageX - width + "px";
                topVal = e.pageY + "px";
                //show the popup message and hide with fading effect                  
                $(popupid).css({ top: topVal }).show();
            },
            HidePopUp: function () {
                $('#divEditXML,#divAddLayout,#divPagePresets').dialog().dialog("close");
            },
            InitVisibility: function () {
                $('#sectionsDiv,#layoutsDiv,#themesDiv').hide();
                $('div.cssClassLayoutBottom,#presetsDiv,#trHandheld').hide();
                $('#basicsDiv').show();
                $('#sfCreateTemplate').hide();
            },
            ReadSettings: function () {
                this.config.method = "ReadSettings";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = '{}';
                this.config.ajaxCallMode = 2;
                this.ajaxCall(this.config);
            },
            ReadLayout: function (fileName) {
                this.config.method = "ReadXML";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ filePath: fileName, TemplateName: LayoutManager.config.Template });
                this.config.ajaxCallMode = 0;
                this.ajaxCall(this.config);
            },
            ResetCore: function () {
                this.config.method = "ResetCore";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ FilePath: $('#ddlLayoutList').val(), TemplateName: LayoutManager.config.Template });
                this.config.ajaxCallMode = 28;
                this.ajaxCall(this.config);
            },
            LoadLayoutList: function () {
                this.config.method = "LoadLayout";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ TemplateName: LayoutManager.config.Template });
                this.config.ajaxCallMode = 3;
                this.ajaxCall(this.config);
            },
            BindLayoutList: function (data) {
                var layouts = data.d;
                var html = '<table><tr ><td >S.N</td><td>Layout</td><td>Activate</td><td>Edit</td><td>Delete</td></tr>';
                $.each(layouts, function (index, item) {
                    var sn = parseInt(index) + 1;
                    var flag = item.Key === LayoutManager.config.ActiveLayout + ".xml" ? LayoutManager.config.ActiveFlag : LayoutManager.config.InActiveFlag;
                    html += '<tr><td>' + sn + '</td><td>' + item.Key + '</td><td><img src="' + flag + '"/></td><td><input type="hidden" value=' + item.Key + '><img class="edit" src="' + LayoutManager.config.EditButton + '"/></td><td><img src="' + LayoutManager.config.DeleteButton + '"/></td></tr>';
                });
                html += '</table>';
                $('#layoutList').html(html);
            },
            LoadLayoutList_Preset: function () {
                this.config.method = "LoadLayout";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ TemplateName: LayoutManager.config.Template });
                this.config.ajaxCallMode = 7;
                this.ajaxCall(this.config);
            },
            BindLayoutList_Preset: function (data) {
                var layouts = data.d;
                var html = '<ul>';
                $.each(layouts, function (index, item) {
                    var sn = parseInt(index) + 1;
                    var oddEven = "clearfix";
                    html += ' <li class=' + oddEven + '><label class="sfLayout">' + item.Key + '</label>';
                    html += '<select class="sfListmenu"><option value="0">None</option><option value="1">All</option><option value="2">Custom</option></select></li>';
                });
                html += '</table><div class="cssClassClear"></div>';
                $('#activeLayoutList').html(html);
                LayoutManager.LoadThemeList_Preset();
            },
            CreateTemplate: function () {
                var _folderName = SageFrame.utils.GetPageSEOName($('#txtNewTemplate').val());
                this.config.method = "CreateTemplate";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ filepath: LayoutManager.config.AppPath, FolderName: _folderName });
                this.config.ajaxCallMode = 26;
                this.ajaxCall(this.config);
            },
            CheckExistingTemplate: function () {
                var _folderName = $('#txtNewTemplate').val();
                this.config.method = "CheckExistingTemplate";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ filepath: LayoutManager.config.AppPath, FolderName: _folderName });
                this.config.ajaxCallMode = 25;
                this.ajaxCall(this.config);
            },
            CheckDuplicateTemplate: function (data) {
                var item = data.d;
                var NewTemplate = $('#txtNewTemplate').val().toLowerCase();
                if (NewTemplate == item.Existfolder) {
                    SageFrame.messaging.show("Template already exist, create new template ", "Alert");
                    return false;
                }
                else if (NewTemplate == "default") {
                    SageFrame.messaging.show("Access Denied, Can't Create template name \"Default\" ", "Alert");
                }
                else {
                    this.CreateTemplate();
                }
            },
            //            LoadSectionList: function() {
            //                this.config.method = "LoadBlockTypes";
            //                this.config.url = this.config.baseURL + this.config.method;
            //                this.config.data = '{}';
            //                this.config.ajaxCallMode = 4;
            //                this.ajaxCall(this.config);
            //            },
            BindSectionList: function (data) {
                var blocks = data.d;
                var html = '<table><tr ><td >S.N</td><td>Section</td><td>Edit</td><td>Delete</td></tr>';
                $.each(blocks, function (index, item) {
                    var sn = parseInt(index) + 1;
                    html += '<tr><td>' + sn + '</td><td>' + item.SectionName + '</td><td><input type="hidden" value=' + item.SectionName + '><img class="edit" src="' + LayoutManager.config.EditButton + '"/></td><td><img src="' + LayoutManager.config.DeleteButton + '"/></td></tr>';
                });
                html += '</table>';
                $('#sectionList').html(html);
                LayoutManager.InitPaging();
            },
            BindLayout: function (data) {
                var xml = data.d;
                $('#txtLayoutEditor').text(xml);
            },
            ReadThemes: function () {
                this.config.method = "GetThemes";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ TemplateName: LayoutManager.config.Template });
                this.config.ajaxCallMode = 1;
                this.ajaxCall(this.config);
            },
            BindThemes: function (data) {
                var themes = data.d;

                if (data.d.length < 1) {


                    html = SageFrame.messaging.showdivmessage("No themes available");
                    //var html = '<div id="templateOptionDetails" class="clearfix sfFormwrapper"><div class="sfLeftdiv"><ul><li class="sfSelected"><span>General</span></li><li><span>Responsive</span></li><li><span>Typography</span></li><li><span>Images</span></li><li><span>Colors</span></li><li>Header</li><li>Extras</li><li>Custom CSS</li><li>Reset</li></ul></div>';
                    var html = '<div id="templateOptionDetails" class="clearfix sfFormwrapper"><div class="sfLeftdiv"><ul><li class="sfSelected" id="spnGeneral"><span>General</span></li><li id="spnTypography"><span>Typography</span></li><li id="spnImages"><span>Images</span></li><li id="spnColors"><span>Colors</span></li><li id="spnHeader">Header</li><li id="spnCustom">Custom CSS</li><li id="spnReset">Reset</li></ul></div>';

                    html += '<div class="sfCenterWrapper"><div class="sfCenter"><ul class="sfSelected"><h4>Select Layout. Works in body section.</h4><select id="layout" name="layout" class="select of-input"><option selected="selected" value="Boxed" id="boxed">Boxed</option><option value="Wide" id="wide">Wide</option><option value="Fluid" id="fluid">Fluid</option></select><h4>CSS components</h4><p>Check/Uncheck the boxes whether to load or not following css components.</p><label class="sfBlock"><input type="checkbox" value="$navigation" checked="" id="chkNavigation"> Navigation</label> <label class="sfBlock"><input type="checkbox" value="$forms" checked="" id="chkForms"> Forms</label> <label class="sfBlock"><input type="checkbox" value="$table" checked="" id="chkTable"> Tables</label><label class="sfBlock"><input type="checkbox" value="$pagination" checked="" id="chkPagination"> Pagination </label>';
                    html += '<h4>Direction From Right to Left</h4><label><input type="checkbox" id="chkRightToLeft"value="rtl">Check this box to make your layout direction from right to left.</label>';
                    html += '<h4>Gutter Space</h4><input type="number" id="txtGutterSpace"  class="sfInputbox"></ul>';
                    //html += '<ul><h4>Major BreakPoints</h4><p>Define the breakpoints at which your layout will change, adapting to different screen sizes.</p><div class="sfMoreblocks"><div class="sfCol_25"><label>Small Screen</label> <input type="text" value="480px" class="sfInputbox"></div><div class="sfCol_25"><label>Medium Screen</label> <input type="text" value="768px" class="sfInputbox"></div><div class="sfCol_25"><label>Large Screen</label> <input type="text" value="1100px" class="sfInputbox"></div><div class="sfCol_25"><label>Extra Large Screen</label> <input type="text" value="1441px" class="sfInputbox"></div></div><h4>Off Canvas Menu</h4><p>Off-canvas menus are positioned outside of the viewport and slide in when activated.Remember this applies to the menu inside header section only.</p><label><input type="checkbox" id="offCanvas" checked="checked" />Off Canvas Menu</label><h4>Hide Elements</h4> <p>You can hide elements in small screen(equals to or less than small scren size)</p><input type="text" placeholder="Type ID/Class then hit enter"/><br/></ul>';
                    html += '<ul><label class="sfBlock"><input type="checkbox" id="chkGoogleFont" value="$googleFont"> Google Font</label><div id="divGoogleFont" style="display:none"><h4>Google Fonts</h4><p>Grap <a href="http://www.google.com/fonts/" target="_blank">the google fonts</a> you want and paste that code below in standard format. </p><input id="googleFont" type="text"  placeholder="http://fonts.googleapis.com/css?family=Open+Sans:300,400" /></div><div id="divCustomFont"><label>Select Heading Font</label><select id="ddlHeadingFont"></select><label>Select Body Font</label><select id="ddlBodyFont"></select><h4>Custom Font</h4><p class="sfNote">Upload .ttf,.woff,.eot,.svg,.woff file only.</p><input type="file" id="customFont" /> <br/></div> <h4>Font Size</h4><p class="note">All font sizes are in pixels. </p><div class="sfMoreblocks  sf-pri-pdd-bottom "><div class="sfCol_33 sfFixed"><label>Base Font Size</label> <input id="txtBaseFontSize" type="number" value="" class="sfInputbox"></div> <div class="sfCol_33 sfFixed"><label>Base Line Height</label> <input type="number" value="" class="sfInputbox" id="txtBaseLineHeight"></div><div class="sfCol_33 sfFixed"><label>Heading Font Size H1</label> <input type="number" id="txtH1" value="" class="sfInputbox"></div>';
                    html += '<div class="sfCol_33 sfFixed"><label>Heading Font Size H2</label> <input type="number" value="" class="sfInputbox" id="txtH2"></div><div class="sfCol_33 sfFixed"><label>Heading Font Size H3</label> <input type="number" value="" id="txtH3" class="sfInputbox"></div><div class="sfCol_33 sfFixed"><label>Heading Font Size H4</label> <input type="number" value="" id="txtH4" class="sfInputbox"></div>';
                    html += '<div class="sfCol_33 sfFixed"><label>Heading Font Size H5</label> <input type="number" id="txtH5" value="" class="sfInputbox"></div> <div class="sfCol_33 sfFixed">';
                    html += '<label>Heading Font Size H6</label> <input type="number" value="" id="txtH6" class="sfInputbox"></div></div></ul>';
                    html += '<ul><h4>Favicon</h4> <p class="sfNote">Upload .ico file, you can use <a href="http://www.favicon.cc" target="_blank">this online tool</a>.</p> <input type="file" id="favicon" /><h4>Full Page Image Background</h4><p class="sfNote">Upload minimum size: 1366*768. This image works like <a href="http://www.w3.org/wiki/Adaptive_Images" target="_blank">adaptive images.</a><label class="sfClose" id="cncBgImage">X</label>  <span>Active image:</span><label  class="sflabel" id="lblBgImage">No active Image.</label> </p><input type="file" id="fullImageBg" /><br/><br/><h4>Background Patterns</h4>';
                    html += '<p class="sfNote">Background patterns work only in boxed layout</p><div class="patternList"><div  id="divPattern"></div><label>Upload Your Own Pattern</label><input type="file" id="customPattern" /><br/></div></ul>';
                    html += '<ul>',
                    //html += '<ul><h4>Predefined Color Scheme</h4><div class="colorboxes clearfix"><div style="background:#660000;" class="color">&nbsp;</div><div style="background:#990000;" class="color">&nbsp;</div><div style="background:#c00;" class="color">&nbsp;</div><div style="background:#cc3333;" class="color">&nbsp;</div><div style="background:#ea4c88;" class="color">&nbsp;</div><div style="background:#993399;" class="color">&nbsp;</div><div style="background:#663399;" class="color">&nbsp;</div><div style="background:#333399;" class="color">&nbsp;</div><div style="background:#0066cc;" class="color">&nbsp;</div><div style="background:#0099cc;" class="color">&nbsp;</div><div style="background:#66cccc;" class="color">&nbsp;</div><div style="background:#77cc33;" class="color">&nbsp;</div><div style="background:#669900;" class="color">&nbsp;</div><div style="background:#336600;" class="color">&nbsp;</div><div style="background:#666600;" class="color">&nbsp;</div><div style="background:#999900;" class="color">&nbsp;</div><div style="background:#cccc33;" class="color">&nbsp;</div><div style="background:#ffcc33;" class="color">&nbsp;</div><div style="background:#ff9900;" class="color">&nbsp;</div><div style="background:#ff6600;" class="color">&nbsp;</div><div style="background:#cc6633;" class="color">&nbsp;</div><div style="background:#996633;" class="color">&nbsp;</div><div style="background:#663300;" class="color">&nbsp;</div></div>';
                    html += '<h4>Common Styles</h4><div class="sfMoreblocks"><div class="sfCol_25"><h6>Body Text Color</h6><div  class="color" id="divBodyTextColor">&nbsp;</div><input type="text" value="#555" class="sfInputbox" id="txtBodyTextColor"></div><div class="sfCol_25"><h6>Body Background Color</h6><div style="background:#fff;" class="color" id="divBodyBgColor">&nbsp;</div><input type="text" value="#fff" class="sfInputbox" id="txtBodyBgColor"></div><div class="sfCol_25"><h6>Link Text Color</h6><div style="background:#428bca;" class="color" id="divLinkTextColor">&nbsp;</div><input type="text" value="#428bca" class="sfInputbox" id="txtLinkTextColor"></div><div class="sfCol_25"><h6>Link Hover Color</h6><div style="background:#2a6496;" class="color" id="divLinkHoverColor">&nbsp;</div><input type="text" value="#2a6496" class="sfInputbox" id="txtLinkHoverColor"></div><div class="sfCol_100"><label><input type="checkbox" id="textDecoration" />Underline at link hover. </label></div></div>';
                    html += '<h4>Headings Text Color</h4><div class="sfMoreblocks"><div class="sfCol_33 sfFixed"><label>H1</label><div id="divH1" style="background:#555;" class="color">&nbsp;</div><input type="text" value="#555" class="sfInputbox" id="H1color" name="color"></div><div class="sfCol_33 sfFixed"><label>H2</label><div style="background:#555;" class="color" id="divH2">&nbsp;</div><input type="text" value="#555" class="sfInputbox" id="H2color" name="color"></div><div class="sfCol_33 sfFixed"><label>H3</label><div style="background:#555;" class="color" id="divH3">&nbsp;</div><input type="text" value="#555" class="sfInputbox" id="H3color" name="color"></div><div class="sfCol_33 sfFixed"><label>H4</label><div id="divH4" style="background:#555;" class="color">&nbsp;</div><input type="text" value="#555" class="sfInputbox" id="H4color" name="color"></div><div class="sfCol_33 sfFixed"><label>H5</label><div id="divH5" style="background:#555;" class="color">&nbsp;</div><input type="text" value="#555" class="sfInputbox" id="H5color" name="color"></div><div class="sfCol_33 sfFixed"><label>H6</label><div id="divH6" style="background:#555;" class="color">&nbsp;</div><input type="text" value="#555" class="sfInputbox" id="H6color" name="color"></div></div>';
                    html += '<h4>Buttons Color</h4><div class="sfMoreblocks"><div class="sfCol_33 sfFixed"><label>Primary Color</label><div id="divPrimarybtncolor" style="background:#428bca;" class="color">&nbsp;</div><input type="text" value="#428bca" class="sfInputbox" id="txtPrimarybtncolor"></div><div class="sfCol_33 sfFixed"><label>Success Color</label><div style="background:#5cb85c;" class="color" id="divBtnSuccess">&nbsp;</div><input type="text" value="#5cb85c" class="sfInputbox" id="txtBtnSuccess"></div><div class="sfCol_33 sfFixed"><label>Info Color</label><div style="background:#5bc0de;" class="color" id="divBtnInfo">&nbsp;</div><input type="text" value="#5bc0de" class="sfInputbox" id="txtBtnInfo"></div><div class="sfCol_33 sfFixed"><label>Error Color</label><div style="background:#d9534f;" class="color" id="divBtnError">&nbsp;</div><input type="text" value="#d9534f" class="sfInputbox" id="txtBtnError"></div><div class="sfCol_33 sfFixed"><label>Warning Color</label><div style="background:#f0ad4e;" class="color" id="divBtnWarning">&nbsp;</div><input type="text" value="#f0ad4e" class="sfInputbox" id="txtBtnWarning"></div></div><br/></ul>';

                    html += '<ul><h4>Sticky Header</h4><p>This header which always shows up at top even in scrolling is called "Sticky Header".This module works with "sfHeaders" class.</p><label><input type="checkbox" id="stickyH"/>Enable the header sticky</label><label class="leftIndent"><input type="checkbox" id="stickyHmobile"/>Disable sticky header in small screens.</label><h4>Transparent Header</h4><label><input type="checkbox" id="transHeader" /> Make header transparent </label><p>Select transparency value from below.</p>	<input type="range" name="range" min="0" max="1" step="0.1" value="1" onchange="this.nextElementSibling.value=this.value" /><input id="txtTransparencyValue" type="number" step="any" name="range" min="0" max="1" value="1" onchange="this.previousElementSibling.value=this.value" /><h4>Header As Fixed Sidebar</h4><p>All elements placed inside header section will be positioned on left by default.In this case, you may have to control individual divs.</p><label><input type="checkbox" id="headAtSide" />Enable Header at Left Side</label></ul>';
                    //html += '<ul><h4>Go To Top</h4><label><input type="checkbox" id="goToTop"/>Check this box to show "Go to top options"</label><h4>Copyright Info</h4><p>Type your copyright information. The latest year will be automatically <a href="http://updateyourfooter.com/" target="_blank">updated.</a></p><input type="text" class="sfInputbox" id="copyright" placeholder /> <h4>Reveal Popup At First Time</h4><p> Put your contents to show a popup at first time only.</p><label><input type="checkbox" />CK Editor</label></ul>';
                    html += '<ul><h4>Custom CSS</h4><p>Paste your CSS code, do not include any tags or HTML in thie field. Any custom CSS entered here will override the theme CSS. In some cases, the !important tag may be needed.</p><br/><textarea  id="custom_css" name="custom_css" class="sfTextarea sfEditor"></textarea></ul>';
                    html += '<ul><h4>Reset Theme Options</h4><p>If You want to reset all theme options, Hit the button below.</p><br/><br/><a class="sfBtn sfPrimaryBtn" id="btnReset">Reset</a></ul>';
                    html += '</div></div></div>';
                    html += '<a class="sfBtn sfPrimaryBtn icon-save" id="btnSaveThemeOptions">Save Changes</a>';
                    //html += '<a class="sfBtn sfPrimaryBtn icon-save" id="btnGetThemeOptions">GetOptions</a>';
                    html += '<input type="hidden" val="" id="hdnfavicon"/>';
                    html += '<input type="hidden" val="" id="hdnfullImageBg"/>';
                    html += '<input type="hidden" val="" id="hdncustomFont"/>';
                    html += '<input type="hidden" val="" id="hdncustomPattern"/>';

                }


                $.each(themes, function (index, item) {
                    var sn = parseInt(index) + 1;
                    var id = 'del_' + item.Key;
                    var flag = item.Key === LayoutManager.config.ActiveTheme ? LayoutManager.config.ActiveFlag : LayoutManager.config.InActiveFlag;
                    var oddeven = index % 2 == 0 ? "sfEven" : "sfOdd";
                    html += '<tr class=' + oddeven + '><td>' + sn + '</td><td>' + item.Key + '</td><td><img id=' + id + ' class="sfDelete" src="' + LayoutManager.config.DeleteButton + '"/></td></tr>';
                });
                html += '</table>';
                $('#themeList').html(html);



                //Theme Options
                $("#btnSaveThemeOptions").on("click", function (e) {

                    var selectedTab = "";
                    $(".sfLeftdiv ul li").each(function (index) {
                        if ($(this).is(".sfSelected")) {
                            selectedTab = $(this).prop("id");
                        }
                    });
                    var BaseFontSize = $('#txtBaseFontSize').val();
                    var BaseLineHeight = $('#txtBaseLineHeight').val();
                    var H1 = $('#txtH1').val();
                    var H2 = $('#txtH2').val();
                    var H3 = $('#txtH3').val();
                    var H4 = $('#txtH4').val();
                    var H5 = $('#txtH5').val();
                    var H6 = $('#txtH6').val();
                    var GutterSpace = $('#txtGutterSpace').val();
                    if (LayoutManager.validateNumber(BaseFontSize) &&
                        LayoutManager.validateNumber(BaseLineHeight) &&
                        LayoutManager.validateNumber(H1) &&
                        LayoutManager.validateNumber(H2) &&
                        LayoutManager.validateNumber(H3) &&
                        LayoutManager.validateNumber(H4) &&
                        LayoutManager.validateNumber(H5) &&
                        LayoutManager.validateNumber(H6)
                        && LayoutManager.validateNumber(GutterSpace)) {

                        var ValidGoogleFont = $("#googleFont").val().search("[?&]family=") != -1;
                        if ($("#chkGoogleFont").is(':checked')) {
                            if (ValidGoogleFont && /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test($("#googleFont").val())) {
                                var customcss = $('.sfLeftdiv ul li:contains("Custom CSS")');
                                $(customcss).trigger("click");
                                LayoutManager.SaveThemeOptions();
                                LayoutManager.GetColorPicker($.parseJSON(ThemeOptions));
                                var CustomCSS = Customeditor.getValue();
                                LayoutManager.UpdateCustomCSS(CustomCSS);
                                $("#" + selectedTab).trigger("click");

                            }
                            else {
                                jAlert('Your Google Fonts URL is not valied !!!', 'Sage Alert');
                            }

                        }
                        else {
                            var Newcustomcss = $('.sfLeftdiv ul li:contains("Custom CSS")');
                            $(Newcustomcss).trigger("click");
                            LayoutManager.SaveThemeOptions();
                            LayoutManager.GetColorPicker($.parseJSON(ThemeOptions));
                            var NewCustomCSS = Customeditor.getValue();
                            LayoutManager.UpdateCustomCSS(NewCustomCSS);
                            $("#" + selectedTab).trigger("click");

                        }
                    }
                    else {
                        jAlert('Font size and Gutter Space must be a number!!!', 'Sage Alert');
                    }


                });
                $("#btnReset").on("click", function (e) {
                    LayoutManager.ResetThemeOptions();
                    LayoutManager.GetThemeOptions();
                });
                $("#cncBgImage").on("click", function (e) {
                    $("#hdnfullImageBg").val("");
                    $("#lblBgImage").text("No active Image.");

                });

                $('#chkGoogleFont').change(function () {
                    if ($(this).is(":checked")) {
                        $("#divGoogleFont").show();
                        $("#divCustomFont").hide();
                    }
                    else {
                        $("#divGoogleFont").hide();
                        $("#divCustomFont").show();
                    }
                });
                $('#headAtSide').change(function () {

                    if ($(this).is(":checked")) {
                        $('#stickyH').prop('checked', false);
                        $('#stickyHmobile').prop('checked', false);
                        $('#stickyHmobile').attr('disabled', true);
                        $("#stickyH").attr('disabled', true);
                    }
                    else {
                        $('#stickyHmobile').removeAttr('disabled');
                        $("#stickyH").removeAttr('disabled');
                    }
                });
                LayoutManager.GetAvailableFonts();
                LayoutManager.GetPatterns();
                LayoutManager.ReadCustomCSS();

                LayoutManager.UploadFiles('#favicon', "FavIcon");
                LayoutManager.UploadFiles('#fullImageBg', "FullImageBg");
                LayoutManager.UploadFiles('#customFont', "CustomFont");
                LayoutManager.UploadFiles('#customPattern', "CustomPattern");

                LayoutManager.GetThemeOptions();

                $(".sfLeftdiv ul li").on("click", function (e) {

                    if ($(this).html() === "Custom CSS" && ($('.CodeMirror').length == 2)) {
                        LayoutManager.CustomCodeMirror();
                    }
                    if (!$(this).hasClass("sfSelected")) {
                        var tabNum = $(this).index();
                        var nthChild = tabNum + 1;
                        $(".sfLeftdiv ul li.sfSelected").removeClass("sfSelected");
                        $(this).addClass("sfSelected");
                        $(".sfCenterWrapper ul.sfSelected").removeClass("sfSelected");
                        $(".sfCenterWrapper ul:nth-child(" + nthChild + ")").addClass("sfSelected");
                    }
                });
                $('#themeList img.sfDelete').click(function () {
                    var me = $(this);
                    jConfirm('Are you sure you want to delete this layout?', 'Confirmation Dialog', function (r) {
                        if (r) {
                            var dName = me.prop("id").replace("del_", "");
                            var TemplateName = LayoutManager.config.Template;
                            LayoutManager.DeleteTheme(TemplateName, dName);
                            LayoutManager.config.SettingMode = "Theme";
                        }
                    });
                });
            },

            validateNumber: function (Value) {
                return /^[\s\d]*$/.test(Value);
            },
            GetColorPicker: function (data) {


                $('#divBodyTextColor').css('backgroundColor', data.CommonStyles.BodyTextColor);
                $("#txtBodyTextColor").val(data.CommonStyles.BodyTextColor);

                $('#divBodyBgColor').css('backgroundColor', data.CommonStyles.BodyBackgroundColor);
                $("#txtBodyBgColor").val(data.CommonStyles.BodyBackgroundColor);

                $('#divLinkTextColor').css('backgroundColor', data.CommonStyles.LinkTextColor);
                $("#txtLinkTextColor").val(data.CommonStyles.LinkTextColor);

                $('#divLinkHoverColor').css('backgroundColor', data.CommonStyles.LinkHoverColor);
                $("#txtLinkHoverColor").val(data.CommonStyles.LinkHoverColor);

                $('#divH1').css('backgroundColor', data.HeadingsTextColor.H1color);
                $("#H1color").val(data.HeadingsTextColor.H1color);

                $('#divH2').css('backgroundColor', data.HeadingsTextColor.H2color);
                $("#H2color").val(data.HeadingsTextColor.H2color);

                $('#divH3').css('backgroundColor', data.HeadingsTextColor.H3color);
                $("#H3color").val(data.HeadingsTextColor.H3color);

                $('#divH4').css('backgroundColor', data.HeadingsTextColor.H4color);
                $("#H3color").val(data.HeadingsTextColor.H4color);

                $('#divH5').css('backgroundColor', data.HeadingsTextColor.H5color);
                $("#H5color").val(data.HeadingsTextColor.H5color);

                $('#divH6').css('backgroundColor', data.HeadingsTextColor.H6color);
                $("#H6color").val(data.HeadingsTextColor.H6color);

                $('#divPrimarybtncolor').css('backgroundColor', data.ButtonsColor.PrimaryColor);
                $("#txtPrimarybtncolor").val(data.ButtonsColor.PrimaryColor);

                $('#divBtnSuccess').css('backgroundColor', data.ButtonsColor.SuccessColor);
                $("#txtBtnSuccess").val(data.ButtonsColor.SuccessColor);

                $('#divBtnInfo').css('backgroundColor', data.ButtonsColor.InfoColor);
                $("#txtBtnInfo").val(data.ButtonsColor.InfoColor);

                $('#divBtnError').css('backgroundColor', data.ButtonsColor.ErrorColor);
                $("#txtBtnError").val(data.ButtonsColor.ErrorColor);

                $('#divBtnWarning').css('backgroundColor', data.ButtonsColor.WarningColor);
                $("#txtBtnWarning").val(data.ButtonsColor.WarningColor);

                $("#divBodyTextColor").ColorPicker({
                    color: "#0000ff",
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onBeforeShow: function () {
                        $('#divBodyTextColor').ColorPickerSetColor(data.CommonStyles.BodyTextColor);
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#divBodyTextColor').css('backgroundColor', '#' + hex);
                        $("#txtBodyTextColor").val('#' + hex);
                    }

                });
                $("#divBodyBgColor").ColorPicker({
                    color: '#0000ff',
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onBeforeShow: function () {
                        $('#divBodyBgColor').ColorPickerSetColor(data.CommonStyles.BodyTextColor);
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#divBodyBgColor').css('backgroundColor', '#' + hex);
                        $("#txtBodyBgColor").val('#' + hex);
                    }

                });
                $("#divLinkTextColor").ColorPicker({
                    color: '#0000ff',
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onBeforeShow: function () {
                        $('#divLinkTextColor').ColorPickerSetColor(data.CommonStyles.LinkTextColor);
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#divLinkTextColor').css('backgroundColor', '#' + hex);
                        $("#txtLinkTextColor").val('#' + hex);
                    }

                });
                $("#divLinkHoverColor").ColorPicker({
                    color: '#0000ff',
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onBeforeShow: function () {
                        $('#divLinkHoverColor').ColorPickerSetColor(data.CommonStyles.LinkHoverColor);
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#divLinkHoverColor').css('backgroundColor', '#' + hex);
                        $("#txtLinkHoverColor").val('#' + hex);
                    }

                });

                $("#divH1").ColorPicker({
                    color: '#0000ff',
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onBeforeShow: function () {
                        $('#divH1').ColorPickerSetColor(data.HeadingsTextColor.H1color);
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#divH1').css('backgroundColor', '#' + hex);
                        $("#H1color").val('#' + hex);
                    }

                });
                $("#divH2").ColorPicker({
                    color: '#0000ff',
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onBeforeShow: function () {
                        $('#divH2').ColorPickerSetColor(data.HeadingsTextColor.H2color);
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#divH2').css('backgroundColor', '#' + hex);
                        $("#H2color").val('#' + hex);
                    }
                });
                $("#divH3").ColorPicker({
                    color: '#0000ff',
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onBeforeShow: function () {
                        $('#divH3').ColorPickerSetColor(data.HeadingsTextColor.H3color);
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#divH3').css('backgroundColor', '#' + hex);
                        $("#H3color").val('#' + hex);
                    }
                });
                $("#divH4").ColorPicker({
                    color: '#0000ff',
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onBeforeShow: function () {
                        $('#divH4').ColorPickerSetColor(data.HeadingsTextColor.H4color);
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#divH4').css('backgroundColor', '#' + hex);
                        $("#H4color").val('#' + hex);
                    }
                });
                $("#divH5").ColorPicker({
                    color: '#0000ff',
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onBeforeShow: function () {
                        $('#divH5').ColorPickerSetColor(data.HeadingsTextColor.H5color);
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#divH5').css('backgroundColor', '#' + hex);
                        $("#H5color").val('#' + hex);
                    }
                });
                $("#divH6").ColorPicker({
                    color: '#0000ff',
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onBeforeShow: function () {
                        $('#divH6').ColorPickerSetColor(data.HeadingsTextColor.H6color);
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#divH6').css('backgroundColor', '#' + hex);
                        $("#H6color").val('#' + hex);
                    }
                });

                $("#divPrimarybtncolor").ColorPicker({
                    color: '#0000ff',
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onBeforeShow: function () {
                        $('#divPrimarybtncolor').ColorPickerSetColor(data.ButtonsColor.PrimaryColor);
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#divPrimarybtncolor').css('backgroundColor', '#' + hex);
                        $("#txtPrimarybtncolor").val('#' + hex);
                    }
                });
                $("#divBtnSuccess").ColorPicker({
                    color: '#0000ff',
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onBeforeShow: function () {
                        $('#divBtnSuccess').ColorPickerSetColor(data.ButtonsColor.SuccessColor);
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#divBtnSuccess').css('backgroundColor', '#' + hex);
                        $("#txtBtnSuccess").val('#' + hex);
                    }
                });
                $("#divBtnInfo").ColorPicker({
                    color: '#0000ff',
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onBeforeShow: function () {
                        $('#divBtnSuccess').ColorPickerSetColor(data.ButtonsColor.InfoColor);
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#divBtnInfo').css('backgroundColor', '#' + hex);
                        $("#txtBtnInfo").val('#' + hex);
                    }
                });
                $("#divBtnError").ColorPicker({
                    color: '#0000ff',
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onBeforeShow: function () {
                        $('#divBtnError').ColorPickerSetColor(data.ButtonsColor.ErrorColor);
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#divBtnError').css('backgroundColor', '#' + hex);
                        $("#txtBtnError").val('#' + hex);
                    }
                });
                $("#divBtnWarning").ColorPicker({
                    color: '#0000ff',
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onBeforeShow: function () {
                        $('#divBtnWarning').ColorPickerSetColor(data.ButtonsColor.WarningColor);
                    },
                    onChange: function (hsb, hex, rgb) {
                        $('#divBtnWarning').css('backgroundColor', '#' + hex);
                        $("#txtBtnWarning").val('#' + hex);
                    }
                });

            },
            CustomCodeMirror: function () {

                Customeditor = CodeMirror.fromTextArea(document.getElementById("custom_css"), {
                    lineNumbers: true,
                    mode: { name: "css", htmlMode: true },
                    autofocus: true,
                    styleActiveLine: true
                });

                setTimeout(function () {
                    Customeditor.refresh();
                }, 100);

            },
            SaveThemeOptions: function () {

                //1 st tab General
                var LayOut = $("#layout option:selected").text();
                var RightToLeft = $('#chkRightToLeft').is(":checked") ? true : false;

                chkNavigation = $("#chkNavigation").prop('checked') ? true : false;
                chkForms = $("#chkForms").prop('checked') ? true : false;
                chkTable = $("#chkTable").prop('checked') ? true : false;
                chkPagination = $("#chkPagination").prop('checked') ? true : false;
                var CSSComponents = chkNavigation + "," + chkForms + "," + chkTable + "," + chkPagination;
                var GutterSpace = $('#txtGutterSpace').val();

                //2nd tab Typography
                var GoogleFonts = "";
                var HeadingFont = "";
                var BodyFont = "";
                var CustomFont = "";
                var CustomFontHeading = "";
                var CustomFontBody = "";
                var Font = "";

                var FontSize = "";
                var BaseFontSize = $('#txtBaseFontSize').val();
                var BaseLineHeight = $('#txtBaseLineHeight').val();
                var H1 = $('#txtH1').val();
                var H2 = $('#txtH2').val();
                var H3 = $('#txtH3').val();
                var H4 = $('#txtH4').val();
                var H5 = $('#txtH5').val();
                var H6 = $('#txtH6').val();
                FontSize = '"FontSize":{"BaseFontSize":"' + BaseFontSize + '","BaseLineHeight":"' + BaseLineHeight + '","H1":"' + H1 + '","H2":"' + H2 + '","H3":"' + H3 + '","H4":"' + H4 + '","H5":"' + H5 + '","H6":"' + H6 + '"}';

                if ($("#chkGoogleFont").is(':checked')) {
                    GoogleFonts = $("#googleFont").val();
                    Font = '"Font":{"GoogleFont":"' + GoogleFonts + '","HeadingFont":"","BodyFont":""}';
                }
                else {
                    HeadingFont = $("#ddlHeadingFont option:selected").text();
                    BodyFont = $("#ddlBodyFont option:selected").text();
                    Font = '"Font":{"GoogleFont":"","HeadingFont":"' + HeadingFont + '","BodyFont":"' + BodyFont + '"}';
                }
                //3rd tab images
                var ActivePattern = "";
                $('.patternList  img').each(function () {
                    if ($(this).hasClass("active")) {
                        ActivePattern = $(this).attr("alt");
                    }
                });
                var FullImageBg = $("#hdnfullImageBg").val();
                //4th tab Colors
                var CommonStyles = "";
                var BodyTextColor = $("#txtBodyTextColor").val();
                var BodyBackgroundColor = $("#txtBodyBgColor").val();
                var LinkTextColor = $("#txtLinkTextColor").val();
                var LinkHoverColor = $("#txtLinkHoverColor").val();
                var UnderlineLinkHover = $("#textDecoration").prop('checked') ? true : false;
                CommonStyles = '"CommonStyles":{"BodyTextColor":"' + BodyTextColor + '","BodyBackgroundColor":"' + BodyBackgroundColor + '","LinkTextColor":"' + LinkTextColor + '","LinkHoverColor":"' + LinkHoverColor + '","UnderlineLinkHover":"' + UnderlineLinkHover + '"}';

                var HeadingsTextColor = "";
                var H1color = $("#H1color").val();
                var H2color = $("#H2color").val();
                var H3color = $("#H3color").val();
                var H4color = $("#H4color").val();
                var H5color = $("#H5color").val();
                var H6color = $("#H6color").val();
                HeadingsTextColor = '"HeadingsTextColor":{"H1color":"' + H1color + '","H2color":"' + H2color + '","H3color":"' + H3color + '","H4color":"' + H4color + '","H5color":"' + H5color + '","H6color":"' + H6color + '"}';

                var ButtonsColor = "";
                var PrimaryColor = $('#txtPrimarybtncolor').val();
                var SuccessColor = $('#txtBtnSuccess').val();
                var InfoColor = $('#txtBtnInfo').val();
                var ErrorColor = $('#txtBtnError').val();
                var WarningColor = $('#txtBtnWarning').val();
                ButtonsColor = '"ButtonsColor":{"PrimaryColor":"' + PrimaryColor + '","SuccessColor":"' + SuccessColor + '","InfoColor":"' + InfoColor + '","ErrorColor":"' + ErrorColor + '","WarningColor":"' + WarningColor + '"}';

                //5th tab Header

                var StickyHeader = "";
                var EnableHeaderSticky = $("#stickyH").prop('checked') ? true : false;
                var DisableStickyHeaderSmallScreens = $("#stickyHmobile").prop('checked') ? true : false;
                StickyHeader = '"StickyHeader":{"EnableHeaderSticky":"' + EnableHeaderSticky + '","DisableStickyHeaderSmallScreens":"' + DisableStickyHeaderSmallScreens + '"}';

                var TransparentHeader = "";
                var MakeHeaderTransparent = $("#transHeader").prop('checked') ? true : false;
                var TransparencyValue = $("#transHeader").prop('checked') ? $('#txtTransparencyValue').val() : "";
                TransparentHeader = '"TransparentHeader":{"MakeHeaderTransparent":"' + MakeHeaderTransparent + '","TransparencyValue":"' + TransparencyValue + '"}';

                var HeaderFixedSidebar = $("#headAtSide").prop('checked') ? true : false;

                ThemeOptions = '{"LayOut": "' + LayOut + '" ,"GutterSpace": "' + GutterSpace + '",' + Font + ',' + FontSize + ',' + CommonStyles + ',' + HeadingsTextColor + ',' + ButtonsColor + ',' + StickyHeader + ',' + TransparentHeader + ',"HeaderFixedSidebar": "' + HeaderFixedSidebar + '","ActivePattern": "' + ActivePattern + '","FullImageBg": "' + FullImageBg + '","CSSComponents":{"chkNavigation":"' + chkNavigation + '", "chkForms":"' + chkForms + '", "chkTable":"' + chkTable + '", "chkPagination":"' + chkPagination + '"  },"RightToLeft": "' + RightToLeft + '"}';

                this.config.method = "SaveThemeOptions";
                $.ajax({
                    url: this.config.baseURL + this.config.method,
                    type: "POST",
                    processData: false,
                    contentType: 'application/json; charset=utf-8',
                    data: JSON2.stringify({

                        TemplateName: LayoutManager.config.Template,
                        ThemeOptions: ThemeOptions
                    }),
                    isPostBack: false,
                    async: false,
                    cache: false,
                    success: function (response) {

                        LayoutManager.GetRawCss(chkNavigation, chkForms, chkTable, chkPagination);
                    },
                    error: function (er) {
                        //alert("Summary Error");
                    }

                });

            },
            ResetThemeOptions: function () {

                this.config.method = "ResetThemeOptions";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    TemplateName: LayoutManager.config.Template
                });
                this.config.ajaxCallMode = 33;
                this.ajaxCall(this.config);
            },

            GetRawCss: function (Navigation, Forms, Tables, Pagination) {

                this.config.method = "GetRawCss";
                $.ajax({
                    url: this.config.baseURL + this.config.method,
                    type: "POST",
                    processData: false,
                    contentType: 'application/json; charset=utf-8',
                    data: JSON2.stringify({

                        Navigation: Navigation,
                        Forms: Forms,
                        Tables: Tables,
                        Pagination: Pagination
                    }),
                    isPostBack: false,
                    async: false,
                    cache: false,
                    success: function (response) {



                        var Seeting = $.parseJSON(ThemeOptions);

                        var TemplateCSS = response.d;
                        var Layout = "";
                        var Wide = "$wide";
                        var Right = "$right";
                        var FontFaceHeaderURL = "$FontFaceHeaderURL";
                        var FontFaceBodyURL = "$FontFaceBodyURL";
                        var opacity = "$opacity";
                        var UnderlineLinkHover = "none";
                        var ActivePattern = "$bgImage";
                        var HeaderFixedSidebar = "40px 0";
                        var InnerWrapperWidth = "100%";
                        var DivLeft = "$divLeft";

                        var GoogleFont = "$GoogleFont";
                        var FontName = "";
                        var HeadingFont = "";
                        if (Seeting.Font.GoogleFont !== "") {
                            GoogleFont = Seeting.Font.GoogleFont;
                            FontName = GoogleFont.split('=')[1].split(':')[0].replace('+', ' ');
                            HeadingFont = FontName
                        }
                        if (Seeting.Font.HeadingFont !== "") {
                            FontName = Seeting.Font.BodyFont;
                            HeadingFont = Seeting.Font.HeadingFont;
                            var BodyFontURL = new Array();
                            var HeadingFontURL = new Array();
                            BodyFontURL = LayoutManager.GetReletedFontFile(LayoutManager.config.Template, FontName).split(',');
                            HeadingFontURL = LayoutManager.GetReletedFontFile(LayoutManager.config.Template, HeadingFont).split(',');

                            FontFaceBodyURL = "";
                            $.each(BodyFontURL, function (index, value) {

                                FontFaceBodyURL += "url('../fonts/" + FontName + value + "'), ";

                            });
                            FontFaceHeaderURL = "";
                            $.each(HeadingFontURL, function (index, value) {

                                FontFaceHeaderURL += "url('../fonts/" + HeadingFont + value + "'), ";

                            });


                        }
                        var DisableStickyHeader = "relative";
                        var EnableHeaderSticky = "relative";
                        var DisableFixed = "$disableFixed";
                        if (Seeting.StickyHeader.EnableHeaderSticky == "true" && Seeting.StickyHeader.DisableStickyHeaderSmallScreens == "true") {
                            EnableHeaderSticky = "fixed;top:0px;width:100%;z-index:100";
                            DisableStickyHeader = "relative";
                            DisableFixed = " relative;z-index:100"
                        }
                        if (Seeting.StickyHeader.EnableHeaderSticky == "true" && Seeting.StickyHeader.DisableStickyHeaderSmallScreens !== "true") {
                            EnableHeaderSticky = "fixed;top:0px;width:100%;"
                            DisableStickyHeader = "fixed"
                        }

                        var bgRepeatOption = "";
                        if (Seeting.FullImageBg !== "") {
                            ActivePattern = "url('../images/" + Seeting.FullImageBg + "')";
                            bgRepeatOption = "no-repeat"
                        }
                        if (Seeting.ActivePattern !== "") {
                            ActivePattern += ",url('../images/pattern/" + Seeting.ActivePattern + "')";
                            bgRepeatOption += ",repeat"
                        }

                        ActivePattern += ";" + "background-repeat:" + bgRepeatOption;
                        var GSpace = "$gutterSpace";
                        var GutterS = "$gSpace"
                        if (Seeting.GutterSpace !== "") {
                            GSpace = Seeting.GutterSpace;
                            //GutterS = "-" + Seeting.GutterSpace + "px";
                        }
                        if (Seeting.LayOut == "Boxed") {
                            Layout = "980px;margin:0 auto";
                            if (Seeting.GutterSpace !== "") {
                                GutterS = "-" + Seeting.GutterSpace + "px";
                            }
                        }
                        if (Seeting.LayOut == "Wide") {
                            Layout = "100%; max-width:1600px";
                            if (Seeting.GutterSpace !== "") {
                                GutterS = "auto";
                            }
                        }
                        if (Seeting.LayOut == "Fluid") {
                            Layout = "100%";
                            if (Seeting.GutterSpace !== "") {
                                GutterS = "auto";
                            }
                        }

                        if (Seeting.RightToLeft == "true")
                            Right = "right";

                        if (Seeting.TransparentHeader.MakeHeaderTransparent == "true")
                            opacity = Seeting.TransparentHeader.TransparencyValue;
                        if (Seeting.CommonStyles.UnderlineLinkHover == "true")
                            UnderlineLinkHover = "underline";
                        var WidthContent = "$wideContent";
                        if (Seeting.HeaderFixedSidebar == "true") {

                            HeaderFixedSidebar = "100px 0 0;overflow: hidden;background: #3a3a3a none repeat scroll 0 0;border-right: 5px solid rgba(0, 0, 0, 0.2);box-shadow: 0 0 5px #000;height: 100vh;left: 0;top: 0;width: 250px;z-index: 999;margin-left:0";
                            InnerWrapperWidth = "960px;background: #fff none repeat scroll 0 0;position: relative";
                            DivLeft = "left;margin-left:250px";
                            EnableHeaderSticky = "fixed";
                            WidthContent = "960px;margin-left:235px"

                        }

                        TemplateCSS = TemplateCSS.replace("$font_size_base", Seeting.FontSize.BaseFontSize + "px")
                        .replace(/\$gutterSpace/g, GSpace + "px")
                        .replace(/\$gSpace/g, GutterS)
                        .replace(/\$wideContent/g, WidthContent)
                        .replace(/\$line_height_base/g, Seeting.FontSize.BaseLineHeight + "px")
                        .replace(/\$textColor/g, Seeting.CommonStyles.BodyTextColor)
                        .replace(/\$bodyBg/g, Seeting.CommonStyles.BodyBackgroundColor)
                        .replace(/\$font_size_h1/g, Seeting.FontSize.H1 + "px")
                        .replace(/\$font_size_h2/g, Seeting.FontSize.H2 + "px")
                        .replace(/\$font_size_h3/g, Seeting.FontSize.H3 + "px")
                        .replace(/\$font_size_h4/g, Seeting.FontSize.H4 + "px")
                        .replace(/\$font_size_h5/g, Seeting.FontSize.H5 + "px")
                        .replace(/\$font_size_h6/g, Seeting.FontSize.H6 + "px")

                        .replace(/\$h1c/g, Seeting.HeadingsTextColor.H1color)
                        .replace(/\$h2c/g, Seeting.HeadingsTextColor.H2color)
                        .replace(/\$h3c/g, Seeting.HeadingsTextColor.H3color)
                        .replace(/\$h4c/g, Seeting.HeadingsTextColor.H4color)
                        .replace(/\$h5c/g, Seeting.HeadingsTextColor.H5color)
                        .replace(/\$h6c/g, Seeting.HeadingsTextColor.H6color)

                        .replace(/\$acolor/g, Seeting.CommonStyles.LinkTextColor)
                        .replace(/\$ahover/g, Seeting.CommonStyles.LinkHoverColor)

                        .replace(/\$primary_color/g, Seeting.ButtonsColor.PrimaryColor)
                        .replace(/\$warningColor/g, Seeting.ButtonsColor.WarningColor)
                        .replace(/\$errorColor/g, Seeting.ButtonsColor.ErrorColor)
                        .replace(/\$successColor/g, Seeting.ButtonsColor.SuccessColor)
                        .replace(/\$infoColor/g, Seeting.ButtonsColor.InfoColor)

                        .replace(/\$layout/g, Layout)
                        .replace(/\$right/g, Right)
                        .replace(/\$header/g, "'" + HeadingFont + "'")
                        .replace(/\$bodyfont/g, "'" + FontName + "'")

                        .replace(/\$opacity/g, opacity)
                        .replace(/\$linkText/g, Seeting.CommonStyles.LinkTextColor)
                        .replace(/\$linkHover/g, Seeting.CommonStyles.LinkHoverColor)
                        .replace(/\$underLine/g, UnderlineLinkHover)
                        .replace(/\$bgImage/g, ActivePattern)
                        .replace(/\$fixed/g, EnableHeaderSticky)
                        .replace(/\$relative/g, DisableStickyHeader)
                        .replace(/\$Block/g, HeaderFixedSidebar)
                        .replace(/\$width/g, InnerWrapperWidth)
                        .replace(/\$divLeft/g, DivLeft)

                        .replace(/\$GoogleFont/g, "url('" + GoogleFont + "')")
                        .replace(/\$FontFaceBodyURL/g, FontFaceBodyURL.replace(/,\s*$/, ""))
                        .replace(/\$FontFaceHeaderURL/g, FontFaceHeaderURL.replace(/,\s*$/, ""))
                        .replace(/\$disableFixed/g, DisableFixed)
                        ;

                        LayoutManager.WriteRawCss(TemplateCSS);
                    },
                    error: function (er) {
                        //alert("Summary Error");
                    }

                });

            },
            GetReletedFontFile: function (TemplateName, FileName) {
                var extList = "";
                this.config.method = "GetReletedFontFile";
                $.ajax({
                    url: this.config.baseURL + this.config.method,
                    type: "POST",
                    processData: false,
                    contentType: 'application/json; charset=utf-8',
                    data: JSON2.stringify({

                        TemplateName: LayoutManager.config.Template,
                        FileName: FileName
                    }),
                    isPostBack: false,
                    async: false,
                    cache: false,
                    success: function (response) {
                        extList = response.d;
                    },
                    error: function (er) {
                        //alert("Summary Error");
                    }


                });
                return extList.replace(/,\s*$/, "");
            },
            WriteRawCss: function (TemplateCSS) {

                this.config.method = "UpdateTemplateCSS";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    TemplateName: LayoutManager.config.Template,
                    TemplateCSS: TemplateCSS

                });
                this.config.ajaxCallMode = 33;
                this.ajaxCall(this.config);
            },
            GetThemeOptions: function () {

                this.config.method = "GetThemeOptions";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    TemplateName: LayoutManager.config.Template

                });
                this.config.ajaxCallMode = 29;
                this.ajaxCall(this.config);
            },
            UpdateCustomCSS: function (CustomCSS) {

                this.config.method = "UpdateCustomCSS";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    TemplateName: LayoutManager.config.Template,
                    CustomCSS: CustomCSS

                });
                this.config.ajaxCallMode = 31;
                this.ajaxCall(this.config);
            },
            UploadFiles: function (divID, LocationName) {
                var uploadFlag = false;
                var upload = new AjaxUpload($(divID), {
                    action: p.AppPath + '/Modules/LayoutManager/UploadHandler.ashx?LocationName=' + LocationName + '&TemplateName=' + LayoutManager.config.Template,
                    name: 'myfile[]',
                    multiple: false,
                    data: {
                    },
                    autoSubmit: true,
                    responseType: 'json',
                    onChange: function (file, ext) {
                    },
                    onSubmit: function (file, ext) {
                        ext = ext.toLowerCase();
                        if (LocationName == "FavIcon") {
                            if (ext == "ico") {
                                return true;
                            }
                            else {
                                jAlert('Not a valid image file!', 'Sage Alert');
                                return false;
                            }
                        }
                        if (LocationName == "FullImageBg" || LocationName == "CustomPattern") {
                            if (ext == "jpg" || ext == "png" || ext == "jpeg") {
                                return true;
                            }
                            else {
                                jAlert('Not a valid image file!', 'Sage Alert');
                                return false;
                            }
                        }
                        if (LocationName == "CustomFont") {
                            if (ext == "ttf" || ext == "woff" || ext == "eot" || ext == "svg" || ext == "woff2" || ext == "otf") {
                                return true;
                            }
                            else {
                                jAlert('Not a valid image file!', 'Sage Alert');
                                return false;
                            }
                        }
                    },
                    onComplete: function (file, response) {
                        if (response == "LargeImagePixel") {
                            return ConfirmDialog(this, 'message', "The image size is too large in pixel");
                        }
                        var Eximage = file.split(" ").join("_");

                        if (LocationName == "FavIcon")
                            $("#hdnfavicon").val(Eximage);
                        if (LocationName == "FullImageBg") {
                            $("#hdnfullImageBg").val(Eximage);
                            $("#lblBgImage").text(Eximage);

                        }
                        if (LocationName == "CustomPattern") {
                            $("#hdncustomPattern").val(Eximage);
                            LayoutManager.GetPatterns();
                        }
                        if (LocationName == "CustomFont") {
                            $("#hdncustomFont").val(Eximage);
                            LayoutManager.GetAvailableFonts();
                        }
                    }
                });
            },
            ReadCustomCSS: function () {

                this.config.method = "ReadCustomCSS";
                $.ajax({
                    url: this.config.baseURL + this.config.method,
                    type: "POST",
                    processData: false,
                    contentType: 'application/json; charset=utf-8',
                    data: JSON2.stringify({
                        TemplateName: LayoutManager.config.Template
                    }),
                    isPostBack: false,
                    async: false,
                    cache: false,
                    success: function (response) {
                        if (!$.isEmptyObject(response)) {
                            var CustomCSS = "";
                            CustomCSS = response.d;
                            $('#custom_css').val(CustomCSS);



                        }
                    },
                    error: function (er) {

                    }


                });
            },
            SelectPatterns: function () {

                var paternChooser = $('.patternList  img');
                paternChooser.click(function () {
                    if (!$(this).hasClass('active'))
                        $('.active').removeClass('active');
                    if (!paternChooser.hasClass('active')) {
                        $(this).addClass('active');
                    } else {
                        $(this).removeClass('active');
                    }
                });
            },
            GetAvailableFonts: function () {
                this.config.method = "GetAvailableFonts";
                $.ajax({
                    url: this.config.baseURL + this.config.method,
                    type: "POST",
                    processData: false,
                    contentType: 'application/json; charset=utf-8',
                    data: JSON2.stringify({

                        TemplateName: LayoutManager.config.Template
                    }),
                    isPostBack: false,
                    async: false,
                    cache: false,
                    success: function (response) {
                        if (!$.isEmptyObject(response)) {
                            var font = "";
                            font = response.d;
                            $('#ddlHeadingFont').html('');
                            $('#ddlBodyFont').html('');
                            $('#ddlHeadingFont').html(font);
                            $('#ddlBodyFont').html(font);
                        }
                    },
                    error: function (er) {
                        //alert("Summary Error");
                    }

                });
            },

            GetPatterns: function () {

                this.config.method = "GetPatterns";
                //this.config.async = false;
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    TemplateName: LayoutManager.config.Template

                });
                this.config.ajaxCallMode = 32;
                this.ajaxCall(this.config);
            },
            LoadThemeList_Preset: function () {
                this.config.method = "GetThemes";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    TemplateName: LayoutManager.config.Template
                });
                this.config.ajaxCallMode = 8;
                this.ajaxCall(this.config);
            },
            BindThemeList_Preset: function (data) {
                var themes = data.d;
                var html = '<ul>';
                html += '<li>default</li>';
                $.each(themes, function (index, item) {
                    var sn = parseInt(index) + 1;
                    html += '<li class="sfCurve">' + item.Key + '</li>';
                });
                html += '</ul>';
                $('#activeThemeList').html(html);
                LayoutManager.BindPresetDetails();
            },
            ReadBlockHTML: function (fileName) {
                this.config.method = "ReadBlockHTML";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ fileName: "/Modules/LayoutManager/Sections/" + fileName });
                this.config.ajaxCallMode = 5;
                this.ajaxCall(this.config);
            },
            BindBlockHTML: function (data) {
                var html = data.d;
                $('#txtHTMLEditor').text(html);
                LayoutManager.ShowPopUp("divEditHTML");
            },
            InitPaging: function () {
                $('#paging_container3').pajinate({
                    items_per_page: 5,
                    item_container_id: '#sectionList table tbody',
                    nav_panel_id: '.alt_page_navigation'
                });
            },
            GetPages: function () {
                this.config.method = "GetNormalPage";
                this.config.url = LayoutManager.config.AppPath + '/Modules/Admin/MenuManager/MenuWebService.asmx/' + this.config.method;
                this.config.data = JSON2.stringify({ PortalID: p.PortalID, UserName: SageFrameUserName, CultureCode: 'en-US', secureToken: SageFrameSecureToken, userModuleID: p.UserModuleID });
                this.config.ajaxCallMode = 6;
                this.ajaxCall(this.config);
            },
            BindPages: function (data) {
                var pages = data.d;
                var PageID = "";
                var parentID = "";
                var PageLevel = 0;
                var itemPath = "";
                var html = "";
                html += '<ul id="pageTree">';
                $.each(pages, function (index, item) {
                    PageID = item.PageID;
                    parentID = item.ParentID;
                    categoryLevel = item.Level;
                    if (item.Level == 0) {
                        html += '<li id=' + PageID + '>';
                        html += LayoutManager.ContainsPage(item.PageName) ? '<span class="sfAssigned">' + item.PageName + '</span>' : '<span class="page parent">' + item.PageName + '</span>';
                        if (item.ChildCount > 0) {
                            html += "<ul>";
                            itemPath += item.PageName;
                            html += LayoutManager.BindChildCategory(pages, PageID);
                            html += "</ul>";
                        }
                        html += "</li>";
                    }
                    itemPath = '';
                });
                html += '</ul>';
                $('#pageList').html(html);
            },
            BindChildCategory: function (response, PageID) {
                var strListmaker = '';
                var childNodes = '';
                var path = '';
                var itemPath = "";
                itemPath += "";
                $.each(response, function (index, item) {
                    if (item.Level > 0) {
                        if (item.ParentID == PageID) {
                            itemPath += item.PageName;
                            var prefix = LayoutManager.GetPrefixes(item.Level);
                            strListmaker += '<li id=' + PageID + '>';
                            strListmaker += LayoutManager.ContainsPage(item.PageName) ? '<span class="page sfAssigned">' + prefix + item.PageName + '</span>' : '<span class="page">' + prefix + item.PageName + '</span>';
                            childNodes = LayoutManager.BindChildCategory(response, item.PageID);
                            itemPath = itemPath.replace(itemPath.lastIndexOf(item.AttributeValue), '');
                            if (childNodes != '') {
                                strListmaker += "<ul>" + childNodes + "</ul>";
                            }
                            strListmaker += "</li>";
                        }
                    }
                });
                return strListmaker;
            },
            ContainsPage: function (pagename) {
                var addedPages = $('div.sfPresetpages ul li');
                var status = false;
                $.each(addedPages, function () {
                    if ($(this).text().toLowerCase() == SageFrame.utils.GetPageSEOName(pagename.toLowerCase())) {
                        status = true;
                    }
                });
                return status;
            },
            GetPrefixes: function (level) {
                var prefix = "";
                for (var i = 0; i < level; i++) {
                    prefix += "---";
                }
                return prefix;
            },
            LoadTemplates: function () {
                this.config.method = "GetTemplateList";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ PortalID: LayoutManager.config.PortalID });
                this.config.ajaxCallMode = 9;
                this.ajaxCall(this.config);
            },
            BindTemplates: function (data) {
                var template = data.d;
                var html = '';
                $.each(template, function (index, item) {
                    var tempMarkup = "";
                    var isActiveClass = item.IsActive ? 'class="sfTemplateholder sfCurve sfActivetemplate"' : 'class="sfTemplateholder  sfCurve"';
                    tempMarkup += ' <div ' + isActiveClass + '>';
                    tempMarkup += '<a href="#" rel="' + item.TemplateName + '" class="sfTemplatethumb"> <img alt="Default" src="' + item.ThumbImage + '"> </a>';
                    tempMarkup += '<div class="sfTemplatedetail">';
                    tempMarkup += '<ul><li class="title"><span>' + item.TemplateName + '</span> </li> <li class="author"><span>By:<a href="#">SageFrame</a></span> </li>';
                    tempMarkup += ' </ul></div>';
                    var activateId = 'lnkActivate#' + item.TemplateSeoName;
                    var previewId = 'lnkPreview#' + item.TemplateSeoName;

                    if (!item.IsDefault) {
                        if (!item.IsActive)
                            tempMarkup += '<i class="icon-close sfDelete" href="#" rel=' + item.TemplateSeoName + '></i>';
                    }

                    var isActivated = 'Activate';
                    if (item.IsActive) {
                        isActivated = 'Activated';
                    }
                    tempMarkup += '<div class="sfButtonwrapper">';
                    tempMarkup += '<ul class="sfTemplateSetting"><li class="sfViewDemo"><a href="#" >View Demo</a></li><li class="activate"><a href="#" id=' + activateId + '>' + isActivated + '</a></li>';
                    tempMarkup += ' <li class="sfTemplateCustomize">Customize <i class="icon-arrow-slim-e"></i><ul  class="sfTemplateEdit">';
                    tempMarkup += '<li class="sfPages"><a href="' + SageFrameHostURL + '/Admin/Pages' + p.Extension + '" target="_blank" >Pages</a></li>';
                    tempMarkup += '<li class="templatePreset" data="' + item.TemplateName + '">Preset</li><li class="templateLayout" data="' + item.TemplateName + '">Layout Manager</li><li class="lnkThemes" data="' + item.TemplateName + '">Theme Options</li></ul></li>';
                    var editFileLink = p.EditFilePath + '/Admin/Template-File-Editor' + p.Extension + '?tname=' + item.TemplateSeoName;
                    // if (!item.IsDefault) {
                    tempMarkup += '<li class="sfEditfiles"><a href=' + editFileLink + ' id="lnkEditFiles">Edit Files</a></li>';
                    //                        if (!item.IsActive)
                    //                            tempMarkup += ' <li class="sfDelete"><a href="#" id="lnkDelete" rel=' + item.TemplateSeoName + '>Delete</a></li>';
                    //}
                    tempMarkup += '</ul></div><div class="clear"></div></div>';
                    //  if (SageFramePortalID == 1) {
                    //     html += tempMarkup;
                    //}
                    //else {
                    if (!item.IsApplied) {
                        html += tempMarkup;
                    }

                    //}
                });
                $('#templateList').html(html);
                //$('div.sfButtonwrapper li.sfDelete').easyconfirm({ locale: { title: 'Select Yes or No', text: 'Are you sure you want to delete this template?', button: ['No', 'Yes']} });

                $('div.sfButtonwrapper').on('click', 'ul li.activate', function () {
                    var template = $(this).find("a").prop("id");
                    template = template.substring(template.indexOf('#') + 1, template.length);
                    LayoutManager.ActivateTemplate(template);
                });
                $('div.sfTemplateholder  ').on('click', 'i.sfDelete', function () {
                    var me = $(this);
                    jConfirm('Are you sure you want to delete this layout?', 'Confirmation Dialog', function (r) {
                        if (r) {
                            var template = me.parent().find("a.sfTemplatethumb").prop("rel");
                            LayoutManager.DeleteTemplate(template);
                        }
                    });
                });
            },
            ActivateTemplate: function (templateName) {
                this.config.method = "ActivateTemplate";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ TemplateName: templateName, PortalID: LayoutManager.config.PortalID });
                this.config.ajaxCallMode = 10;
                this.ajaxCall(this.config);
            },
            LoadTemplate: function (templateName) {
                this.config.method = "GetBasicSettings";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ TemplateName: templateName });
                this.config.ajaxCallMode = 11;
                this.ajaxCall(this.config);
            },
            BindBasicSettings: function (data) {
                var basics = data.d;
                $('#spnTemplateName').text(basics.TemplateName);
                $('#spnAuthor').text(basics.Author);
                $('#spnDescription').text(basics.Description);
                $('#spnWebsite').text(basics.Website);
            },
            LoadLayoutList_Visual: function () {
                this.config.method = "LoadLayout";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ TemplateName: LayoutManager.config.Template });
                this.config.ajaxCallMode = 12;
                this.ajaxCall(this.config);
            },
            BindLayoutList_Visual: function (data) {

                var layouts = data.d;
                var html = '';
                if (layouts != null && typeof (layouts) != "undefined" && layouts.length > 0) {
                    $.each(layouts, function (index, item) {
                        var sn = parseInt(index) + 1;
                        if (item != null && typeof (item.Key) != "undefined") {
                            html += '<option>' + item.Key + '</option>';
                        }
                    });
                    html += '</ul>';
                    $('#ddlLayoutList').html(html);
                    $('#imgEditLayout_Visual,#btnDeleteLayout').hide().delay(1000);
                    var layout = $('#ddlLayoutList option:selected').val();
                    LayoutManager.LoadLayoutWireFrame(layout);
                    //$('#btnDeleteLayout').easyconfirm({ locale: { title: 'Select Yes or No', text: 'Are you sure you want to delete this layout?', button: ['No', 'Yes']} });
                    $('#btnDeleteLayout').click(function () {
                        jConfirm('Are you sure you want to delete this layout?', 'Confirmation Dialog', function (r) {
                            if (r) {
                                var result = LayoutManager.ajaxCall_return(LayoutManager.config.baseURL + "DeleteLayout", JSON2.stringify({ TemplateName: LayoutManager.config.Template, Layout: $('#ddlLayoutList').val() }));
                                SageFrame.messaging.show(SageFrame.messaging.GetLocalizedMessage("en-US", "TemplateManager", "LayoutDeleted"), "Success");
                                LayoutManager.LoadLayoutList_Visual();
                            }
                        });
                        //});
                    });
                }
            },
            LoadLayoutWireFrame: function (layout) {
                this.config.method = "GenerateWireFrame";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ FilePath: layout, TemplateName: $.trim(LayoutManager.config.Template) });
                this.config.ajaxCallMode = 13;
                this.ajaxCall(this.config);
            },
            BindLayoutWireFrame: function (data) {
                var layout = data.d;
                layoutSplit = layout.split(',,,,');
                if (layoutSplit[0] == 'False') {
                    $('#divLayoutWireframe').html(layoutSplit[1]);
                }
                else {
                    $('#divLayoutWireframe').html(layoutSplit[1]);
                    LayoutManager.Addplaceholder();
                }
                //$('#divLayoutWireframe').html(layout);
                LayoutManager.InitResizeLayout();
                LayoutManager.InitEqualHeights();
            },
            Addplaceholder: function () {
                $('#divLayoutWireframe').find('div').each(function () {
                    var $this = $(this);
                    $(this).removeAttr('style');
                    if ($this.find('div').length == 0) {
                        //var innerHTML = '<div class="sfWrapper sfCurve">';
                        var innerHTML = '<div class="sfPosition">' + $this.attr('id') + '</div>';
                        //innerHTML += '<div class="sfblocks"></div></div>';
                        //var innerHTML = '<div class="sfPosition">' + $this.attr('id') + '</div>';
                        //innerHTML += '<div class="sfblocks"></div></div>';
                        $this.html(innerHTML);
                    }
                });
            },
            LoadNewLayout: function (NewLayOut) {
                LayoutManager.config.NewValue.push(NewLayOut);
            },
            LoadPanName: function (PanName) {
                var PName = PanName.split('sf')[1];
                LayoutManager.config.PanName.push(PName);
            },
            InitResizeLayout: function () {
                LayoutManager.config.PanName = [];
                $('.sfOuterwrapper').each(function (index) {
                    if ($(this).prop('id') !== 'sfBodyContent') {
                        var tableId = $(this).prop('id').toLowerCase() + "_mytable";
                        $('#' + tableId).before('<span style="display:none"  id="split_' + tableId + '" class="sfSplit"><img src=' + SageFrame.utils.GetAdminImage("split.png") + '  alt="Split"  id=btnSplit_' + tableId + ' /></span>');
                        $('#' + tableId).before('<span style="display:none" id="merge_' + tableId + '" class="sfMerge"><img src=' + SageFrame.utils.GetAdminImage("merge.png") + '  alt="Merge"  id=btnMerge_' + tableId + ' /></span><div style="display:none" id=divPlaceHolder_' + tableId + '></div>');
                        $('#' + tableId).resize();
                    }
                });
                $('.sfMainContent,.sfMiddletop,.sfMiddlebottom,.sfFulltopspan,.sfFullbottomspan').find('table').each(function () {
                    var tableId = $(this).prop('id');
                    $('#' + tableId).before('<span style="display:none" id="split_' + tableId + '" class="sfSplit"><img src=' + SageFrame.utils.GetAdminImage("split.png") + '  alt="Split" id=btnSplit_' + tableId + ' /></span>');
                    $('#' + tableId).before('<span style="display:none" id="merge_' + tableId + '" class="sfMerge"><img src=' + SageFrame.utils.GetAdminImage("merge.png") + '  alt="Merge" id=btnMerge_' + tableId + ' /></span><div style="display:none" id=divPlaceHolder_' + tableId + '></div>');
                    $('#' + tableId).resize();
                });
            },
            BindEditButton: function () {
                $(".sfOuterwrapper").each(function () {
                    // if ($('#ddlLayoutList').val() !== 'Core')
                    //$(this).before('<span class="sfEditLayoutPage"><img src=' + SageFrame.utils.GetAdminImage("page-edit.png") + '  alt="Edit LayOut" /></span>');
                });
            },
            RecreateLayout: function (FileName, SfHeader, SfContain, SfFooter) {
                this.config.method = "RecreateLayout";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ FilePath: FileName, TemplateName: LayoutManager.config.Template, sfHeader: SfHeader, sfContain: SfContain, sfFooter: SfFooter });
                this.config.ajaxCallMode = 27;
                this.ajaxCall(this.config);
            },
            SortPan: function () {
                $('#sfOuterWrapper').sortable({
                    //revert: true
                    items: ":not(.sfBlockwrap,#sfOuterWrapper,#sfBodyContent,#sfOuterWrapper div div,#sfOuterWrapper div table thead tr th div,#sfOuterWrapper div table thead tr th,#sfOuterWrapper div table thead tr,#sfOuterWrapper div table thead,#sfOuterWrapper div table)",
                    stop: function () {

                    }
                });
                $('table thead tr').sortable({
                    connectWith: '#' + $(this).parents().find('table').prop('id'),
                    stop: function () {
                        $("#" + $(this).parents().find('table').prop('id')).resize();
                    }
                });
                $("#sfOuterWrapper,table thead tr").disableSelection();
            },

            ///End
            UpdateLayout: function (filename, xml) {
                this.config.method = "UpdateLayout";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ FilePath: filename, Xml: xml, TemplateName: LayoutManager.config.Template });
                this.config.ajaxCallMode = 14;
                this.ajaxCall(this.config);
            },
            BindUpdatedLayout: function (data) {
                if (data.d == 0) {
                    LayoutManager.LoadLayoutWireFrame($('#hdnLayoutName').val());
                    LayoutManager.HidePopUp();
                }
                else if (data.d == 1) {
                    SageFrame.messaging.alert("XML Document contains invalid tags", '#msgDiv');
                }
            },
            LoadFiles: function (_TemplateName, _path) {
                this.config.method = "GetFiles";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ TemplateName: _TemplateName, FolderPath: _path });
                this.config.ajaxCallMode = 15;
                this.ajaxCall(this.config);
            },
            BindFiles: function (data) {
                var files = data.d;
                var html = '<ul>';
                $.each(files, function (index, item) {
                    var TemplatePath = LayoutManager.config.AppPath + "/" + item.FilePath.substring(item.FilePath.indexOf("Templates"), item.FilePath.Length);
                    TemplatePath = TemplatePath.replace(/\\/gi, "\/");
                    var previewClass = LayoutManager.IsImage(item.FileName) ? "class='preview' href='" + TemplatePath + "'" : "href='#'";
                    html += '<li><a ' + previewClass + '>' + LayoutManager.GetFileImage(item.FileExtension) + '<div class="name" id=' + item.FilePath + '>' + item.FileName + '</div></a><div class="size">' + item.Size + ' <i>bytes</i></div><div class="time">' + item.CreatedDate + '</div>';
                    html += LayoutManager.IsFile(item.FileName) ? '<span class="delete"><img align="absmiddle" src=' + LayoutManagerPath + "images/popupclose.png" + '></span></li>' : '</li>';
                });
                html += '</ul>';
                $('#divFileList').html(html);
                LayoutManager.config.NavMode = "Folder";
                LayoutManager.InitLightBox();
            },
            GetFileImage: function (ext) {
                var filePic = "file";
                switch (ext) {
                    case '.htm':
                        filePic = "html";
                        break;
                    case '.css':
                        filePic = "css";
                        break;
                    case '.xml':
                        filePic = "xml";
                        break;
                    case '.ico':
                        filePic = "picture";
                        break;
                    case '.ascx':
                        filePic = "html";
                        break;
                    case '.png':
                        filePic = "picture";
                        break;
                    case '.jpg':
                        filePic = "picture";
                        break;
                    case '.gif':
                        filePic = "picture";
                        break;
                    default:
                        filePic = "directory";
                        break;
                }
                filePic = filePic + ".png";
                return '<img src="../images/fileimages/' + filePic + '" align="absmiddle">';
            },
            BuildBreadCrumb: function (directory, mode) {
                if (mode == 0) {
                    var breadCrumb = $('#divFileMgrBreadCrumb').html();
                    breadCrumb += ">>";
                    breadCrumb += '<span>' + directory + '</span>';
                    $('#divFileMgrBreadCrumb').html(breadCrumb);
                }
                else if (mode == 1) {
                    $('#divFileMgrBreadCrumb').html(directory);
                }
            },
            GetFolderPath: function (self) {
                var breadCrumb = $('#divFileMgrBreadCrumb span');
                var path = "";
                var keepChecking = true;
                $.each(breadCrumb, function (index, item) {
                    if (keepChecking) {
                        if (self != $(this).text()) {
                            if (index > 0) {
                                path += $(this).text();
                                path += "/";
                            }
                        }
                        else {
                            path += $(this).text();
                            keepChecking = false;
                        }
                    }
                });
                path = LayoutManager.config.Template === path ? "" : path;
                return path;
            },
            CheckIsModernTemplate: function (layoutName) {
                this.config.method = "IsModernLayout";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    templateName: LayoutManager.config.Template,
                    layoutName: layoutName
                });
                $.ajax({
                    type: this.config.type,
                    contentType: this.config.contentType,
                    cache: this.config.cache,
                    url: this.config.url,
                    data: this.config.data,
                    dataType: this.config.dataType,
                    success: function (data) {
                        isModern = data.d;
                        if (isModern) {
                            $('#imgEditModernLayout').trigger('click');
                        }
                        else {

                            $('#hdnLayoutName').val(layoutName);
                            var dialogOptions = {
                                "title": $(this).parent().prev().find("option:selected").val(),
                                "minWidth": 650,
                                "minHeight": 500,
                                "modal": true,
                                "position": [400, 200],
                                "dialogClass": "sfFormwrapper"
                            };
                            if ($("#button-cancel").prop("checked")) {

                                dialogOptions["buttons"] = {
                                    "Cancel": function () {
                                        //;
                                        $(this).dialog("close");
                                    }
                                };
                            }
                            //dialog-extend options
                            var dialogExtendOptions = {
                                "maximize": true
                            };
                            //open dialog
                            $("#divEditXML").dialog(dialogOptions).dialogExtend(dialogExtendOptions);
                            //$('div.ui-dialog').css("z-index", "3000");
                            LayoutManager.ReadLayout(layoutName);
                        }
                    },
                    error: this.ajaxFailure
                });
            },
            BuildNewBreadCrumb: function (self) {
                var breadCrumb = $('#divFileMgrBreadCrumb span');
                var keepChecking = true;
                var newBreadCrumb = "";
                $.each(breadCrumb, function (index, item) {
                    if (keepChecking) {
                        if (self != $(this).text()) {
                            newBreadCrumb += '<span>' + $(this).text() + '</span>';
                            newBreadCrumb += ">>";
                        }
                        else {
                            newBreadCrumb += '<span>' + $(this).text() + '</span>';
                            keepChecking = false;
                        }
                    }
                });
                LayoutManager.BuildBreadCrumb(newBreadCrumb, 1);
            },
            IsFile: function (fileName) {
                return (fileName.indexOf(".") > -1 ? true : false);
            },
            IsImage: function (fileName) {
                var status = false;
                if (fileName.indexOf(".png") > -1 || fileName.indexOf(".jpg") > -1 || fileName.indexOf(".gif") > -1) {
                    status = true;
                }
                return status;
            },
            InitCodeMirror: function () {
                var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
                    mode: "application/xml",
                    lineNumbers: true,
                    onCursorActivity: function () {
                        editor.setLineClass(hlLine, null);
                        hlLine = editor.setLineClass(editor.getCursor().line, "activeline");
                    }
                });
                editor.setOption("theme", "night");
                var hlLine = editor.setLineClass(0, "activeline");
            },
            ResetInlineEditor: function () {
                $('div.CodeMirror').remove();
                $('#divInlineEditor').hide();
            },
            ReadFile: function (_TemplateName, _FileName) {
                this.config.method = "ReadFiles";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ TemplateName: _TemplateName, FilePath: _FileName });
                this.config.ajaxCallMode = 16;
                this.ajaxCall(this.config);
            },
            BindFileToEditor: function (data) {
                $('#code').val(data.d);
                LayoutManager.InitCodeMirror();
            },
            InitLightBox: function () {
                $('#divFileList ul li a.preview').lightBox({
                    imageBtnClose: LayoutManagerPath + "images/lightbox-btn-close.gif",
                    imageLoading: LayoutManagerPath + "images/lightbox-ico-loading.gif",
                    imageBtnNext: LayoutManagerPath + "images/lightbox-btn-next.gif",
                    imageBtnPrev: LayoutManagerPath + "images/lightbox-btn-prev.gif",
                    imageBlank: LayoutManagerPath + "images/lightbox-blank.gif"
                });
            },
            LoadPresets: function () {
                this.config.method = "LoadPresets";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ TemplateName: LayoutManager.config.Template });
                this.config.ajaxCallMode = 17;
                this.ajaxCall(this.config);
            },
            BindPresets: function (data) {
                var presets = data.d;
                var html = '';
                var activepresets = this.ajaxCall_return(this.config.baseURL + "LoadActivePresets", JSON2.stringify({ TemplateName: LayoutManager.config.Template }));
                $.each(presets, function (index, item) {
                    if (item != null) {
                        var activeClass = LayoutManager.IsPresetActive(activepresets, item.Key) ? "class='sfActive'" : "";
                        html += '<li ' + activeClass + '>' + item.Key + '<span class="delete"><img src=' + SageFrame.utils.GetAdminImage("btndelete.png") + ' /></span></li>';
                    }
                });
                $('#ulPresetList').html(html);
                $('#ulPresetList li').removeClass("selectedPreset");
                var firstActivePreset = LayoutManager.GetFirstActivePreset(true);
                LayoutManager.LoadLayoutList_Preset();
            },
            IsPresetActive: function (activepresets, preset) {
                var IsActive = false;
                $.each(activepresets, function (index, item) {
                    if (item.PresetName + ".xml" === preset) {
                        IsActive = true;
                    }
                });
                return IsActive;
            },
            GetFirstActivePreset: function (highlight) {
                var firstpreset = "";
                var presetList = $('#ulPresetList li');
                var keepChecking = true;
                $.each(presetList, function () {
                    if (keepChecking) {
                        if ($(this).hasClass('sfActive')) {
                            firstpreset = $(this).text();
                            keepChecking = false;
                            if (highlight) {
                                $(this).addClass('selectedPreset');
                            }
                        }
                    }
                });
                return firstpreset;
            },
            BindPresetDetails: function () {
                var presetdetails = this.ajaxCall_return(this.config.baseURL + "GetPresetDetails", JSON2.stringify({ TemplateName: LayoutManager.config.Template, PortalID: SageFramePortalID }));
                LayoutManager.ClearPresetDetails();
                var themes = $('#activeThemeList ul li');
                $.each(themes, function (index, item) {
                    if ($(this).text() == presetdetails.ActiveTheme) {
                        $(this).addClass("sfActive");
                    }
                });
                var widths = $('#activeWidthList ul li');
                $.each(widths, function (index, item) {
                    if ($(this).text().toLowerCase() == presetdetails.ActiveWidth) {
                        $(this).addClass("sfActive");
                    }
                });
                var layouts = $('label.sfLayout');
                $.each(layouts, function () {
                    var activelayouts = presetdetails.lstLayouts;
                    var self = $(this);
                    $.each(activelayouts, function (index, item) {
                        if ((self).text().toLowerCase() == item.Key.toLowerCase()) {
                            $(self).addClass("sfActive");
                            if (item.Value.toLowerCase() == "all") {
                                $(self).next("select").val("1");
                            }
                            else {
                                $(self).next("select").val("2");
                                $(self).parent().append('<span class="customize"><i class="icon-page-add" data-title="Add Page" ></i></span>');
                                var pages = item.Value.split(',');
                                var html = '<div class="sfPresetpages"><ul>';
                                $.each(pages, function (i, it) {
                                    html += '<li class="sfCurve"><span class="sfPageName">' + SageFrame.utils.GetPageSEOName(it) + '</span><span class="sfDelete"><i class ="icon-delete"></i></span></li>';
                                });
                                html += '</ul></div>';
                                $(self).parent().append(html);
                            }
                        }
                    });
                });
            },
            ClearPresetDetails: function () {
                $('#spnActiveLayout').text("");
                $('#spnActiveTheme').text("");
                $('#spnActiveWidth').text("");
                $('#chkCssOpt_preset').prop("checked", false);
                $('#chkJsOpt_preset').prop("checked", false);
                $('#chkShowCpanel_preset').prop("checked", false);
                $('#chkEnableHandheld_preset').prop("checked", false);
                $('#trHandheld').hide();
            },
            SavePreset: function () {
                var param = {
                    TemplateName: LayoutManager.config.Template,
                    ActiveTheme: $('#activeThemeList ul li.sfActive').text().toLowerCase(),
                    ActiveWidth: $('#activeWidthList ul li.sfActive').text().toLowerCase(),
                    lstLayouts: LayoutManager.SelectPages(),
                    portalID: LayoutManager.config.PortalID
                };
                var preset = this.ajaxCall_return(this.config.baseURL + "SavePreset", JSON2.stringify(param));
                switch (preset) {
                    case 0:
                        SageFrame.messaging.show(SageFrame.messaging.GetLocalizedMessage("en-US", "TemplateManager", "PresetSaved"), "Success");
                        break;
                    case 1:
                        SageFrame.messaging.show(SageFrame.messaging.GetLocalizedMessage("en-US", "TemplateManager", "ApplyToAllForMultiplePresets"), "Alert");
                        break;
                    case 2:
                        SageFrame.messaging.show(SageFrame.messaging.GetLocalizedMessage("en-US", "TemplateManager", "PageAlreadyAppliedToPreset"), "Alert");
                        break;
                }
            },
            SelectPages: function () {
                var pages = "All";
                var layouts = $('#activeLayoutList ul li');
                var selectedPages = [];
                var allPageFlag = 0;
                var pagesArr = [];
                var i = 0;
                $.each(layouts, function (index, item) {
                    switch ($(this).find("select").val()) {
                        case "0":
                            break;
                        case "1":
                            if (allPageFlag == 0) {
                                selectedPages[i] = { "Key": $(this).find("label.sfLayout").text(), "Value": "All" };
                                i++;
                                allPageFlag = 1;
                            }
                            break;
                        case "2":
                            var pages = $(this).find("div.sfPresetpages ul li");
                            var selected = [];
                            $.each(pages, function () {
                                if (jQuery.inArray($(this).text(), pagesArr) == -1) {
                                    selected.push($(this).text());
                                    pagesArr.push($(this).text());
                                }
                            });
                            if (selected.length > 0) {
                                selectedPages[i] = { "Key": $(this).find("label.sfLayout").text(), "Value": selected.join(',') };
                                i++;
                            }
                            break;
                    }
                });
                return selectedPages;
            },
            GetSEOName: function (word) {
                return (word.replace(/ /g, "-"));
            },
            DeleteTemplate: function (template) {
                this.config.method = "DeleteTemplate";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ TemplateName: template });
                this.config.ajaxCallMode = 18;
                this.ajaxCall(this.config);
            },
            InitGallery: function () {
                $(".image").click(function () {
                    var image = $(this).prop("rel");
                    $('#imagePreview').html('<img src="' + image + '"/>');
                    var newheight = $('#imagePreview img').height();
                    $('#imagePreview').animate({ height: newheight + "px" }, 500);
                    return false;
                });
            },
            GetPreviewImages: function (templateName) {
                this.config.method = "GetPreviewImages";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ TemplateName: LayoutManager.config.Template });
                this.config.ajaxCallMode = 19;
                this.ajaxCall(this.config);
            },
            BindPreviewImages: function (data) {
                var images = data.d;
                var html = '';
                if (images.length == 0) {
                    var imagepath = LayoutManager.config.AppPath + '/images/defaulttemplate.jpg';
                    html += '<a href="#" rel=' + imagepath + ' class="image"><img src=' + imagepath + ' class="thumb" border="0"/></a>';
                    $('#imagePreview').html('<img src=' + imagepath + ' border="0"/>');
                }
                $.each(images, function (index, item) {
                    if (index < 4) {
                        var imagepath = LayoutManager.config.Template.toLowerCase() == "default" ? LayoutManager.config.AppPath + '/Core/Template/screenshots/' + item.Key : LayoutManager.config.AppPath + '/Templates/' + LayoutManager.config.Template + "/screenshots/" + item.Key;
                        var imgsrc = LayoutManager.config.Template.toLowerCase() == "default" ? LayoutManager.config.AppPath + '/Core/Template/screenshots/' + item.Key : LayoutManager.config.AppPath + '/Templates/' + LayoutManager.config.Template + "/screenshots/" + item.Key;
                        html += '<a href="#" rel=' + imagepath + ' class="image"><img src=' + imgsrc + ' class="thumb" border="0"/></a>';
                        if (index == 0) {
                            $('#imagePreview').html('<img src=' + imgsrc + ' border="0"/>');
                        }
                    }
                });
                $('#imageThumbs').html(html);
                LayoutManager.InitGallery();
            },
            DeleteTheme: function (templatename, theme) {
                this.config.method = "DeleteTheme";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ TemplateName: LayoutManager.config.Template, ThemeName: theme });
                this.config.ajaxCallMode = 20;
                this.ajaxCall(this.config);
            },
            LoadLayoutList_Creator: function () {
                this.config.method = "LoadLayout";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ TemplateName: LayoutManager.config.Template });
                this.config.ajaxCallMode = 22;
                this.ajaxCall(this.config);
            },
            BindLayoutList_Creator: function (data) {
                var layouts = data.d;
                var html = '';
                html += '<option>[None]</option>';
                $.each(layouts, function (index, item) {
                    var sn = parseInt(index) + 1;
                    html += '<option>' + item.Key + '</option>';
                });
                html += '</ul>';
                $('#ddlClonebleLayouts').html(html);
            },
            ReadLayout_Create: function (fileName) {
                this.config.method = "ReadXML";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ filePath: fileName, TemplateName: LayoutManager.config.Template });
                this.config.ajaxCallMode = 23;
                this.ajaxCall(this.config);
            },
            BindLayout_Create: function (data) {
                var xml = data.d;
                editorCreate.setValue(xml);
            },
            CreateLayout: function (filename, xml) {
                this.config.method = "CreateLayout";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ FilePath: filename, Xml: xml, TemplateName: LayoutManager.config.Template });
                this.config.ajaxCallMode = 24;
                this.ajaxCall(this.config);
            },
            PostLayoutCreationActions: function (data) {
                if (parseInt(data.d) == 0) {
                    SageFrame.messaging.show("Layout Created Successfully", "Success");
                    LayoutManager.LoadLayoutList_Visual();
                    LayoutManager.HidePopUp();
                }
                else {
                    SageFrame.messaging.alert("Invalid Layout", '#msgAddLayout');
                }
            }
        };
        LayoutManager.init();
        LayoutManager.InitResizeLayout();
    }
    $.fn.LayoutManager = function (p) {
        $.createLayoutManager(p);
    };
})(jQuery);