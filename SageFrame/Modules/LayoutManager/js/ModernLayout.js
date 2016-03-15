(function ($) {
    $.createModernLayoutManager = function (p) {
        p = $.extend
        ({
            PortalID: 1,
            AppPath: SageFrameAppPath,
            Extension: '',
            EditFilePath: '',
            UserModuleID: ''
        }, p);
        var selectedDOM = '';
        var actionOptions = ' <div class="options" style="display:none">';
        actionOptions += '<ul>';
        actionOptions += '<li><i title="add container/s or column/s" class="elementAdd icons-add"></i></li>';
        actionOptions += '<li><i title="Duplicate DOM" class="elementduplicate icons-duplicate"></i></li>';
        actionOptions += '<li><i title="Delete DOM" class="elementDelete icons-delete"></i></li>';
        //actionOptions += '<li><i class="elementEmpty icons-empty"></i></li>';
        actionOptions += '<li title="Select" id="elemSelect"><i class="elementSelect disabled icons-select"></i></li>';
        actionOptions += '<li><i title="Properties" class="elementProperties icons-property"></i></li>';
        actionOptions += '</ul>';
        //actionOptions += '<div class="layoutAddContainer" style="display: none;">' + $('.layoutaddContainer').html() + '</div>';
        actionOptions += '</div>';

        var actionResOptions = ' <div class="options resOptions" style="display:none">';
        actionResOptions += '<span class="icons-toggle"></span>';
        actionResOptions += '<ul style="display:none;" class="hide">';
        actionResOptions += '<li><i title="add container/s or column/s"  class="elementAdd icons-add"></i></li>';
        actionResOptions += '<li><i title="Duplicate DOM" class="elementduplicate icons-duplicate"></i></li>';
        actionResOptions += '<li><i title="Delete DOM" class="elementDelete icons-delete"></i></li>';
        //actionOptions += '<li><i class="elementEmpty icons-empty"></i></li>';
        actionResOptions += '<li id="elemSelect"><i title="Select" class="elementSelect disabled icons-select"></i></li>';
        actionResOptions += '<li><i title="Properties" class="elementProperties icons-property"></i></li>';
        actionResOptions += '</ul>';
        //actionOptions += '<div class="layoutAddContainer" style="display: none;">' + $('.layoutaddContainer').html() + '</div>';
        actionResOptions += '</div>';
        var dataDetail = { name: '', divClass: '', style: '', ID: '', dataID: 0, parentDataID: 0, width: 0, sfFixed: false };
        var DOMelement = [];
        var child = { childID: '', parentID: '', innerChild: true };
        var ParentChild = [];
        var containerID = 0;
        var isAnydivActive = false;
        var isAnydivselected = false;
        var LayoutList = "";
        var ModernLayoutManager = {
            config: {
                isPostBack: false,
                async: false,
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
                ModernLayoutManager.ModernLayout();
                //ModernLayoutManager.GetTemplateListName();
                $('#divBodyWrapper').find('#divName').focus(function () { $(this).select(); });
                //For automation only
                //$('.templateLayout').eq(0).trigger('click');
                //$('#imgAddModernLayout').trigger('click');
                //$('#divBodyWrapper').find('#createParentContainer').trigger('click');
                //$('#divBodyWrapper').find('#createParentContainer').trigger('click');
                //$('#divBodyWrapper').find('#createParentContainer').trigger('click');
                ////$('#divBodyWrapper').find('#createParentContainer').trigger('click');
                ////adding 1st property
                //$('#divBodyWrapper').find('.elementProperties').eq(0).trigger('click');
                //$('#divBodyWrapper').find('#divName').val('Banner');
                //$('#divBodyWrapper').find('#divClass').val('Banner');
                //$('#divBodyWrapper').find('#divStyle').val('');
                //$('#divBodyWrapper').find('#divWidth').val('100');
                //$('#divBodyWrapper').find('#saveProperties').trigger('click');
                ////adding 1st property
                //$('#divBodyWrapper').find('.elementProperties').eq(1).trigger('click');
                //$('#divBodyWrapper').find('#divName').val('navigation');
                //$('#divBodyWrapper').find('#divClass').val('navigation');
                //$('#divBodyWrapper').find('#divStyle').val('');
                //$('#divBodyWrapper').find('#divWidth').val('100');
                //$('#divBodyWrapper').find('#saveProperties').trigger('click');
                ////adding 1st property
                //$('#divBodyWrapper').find('.elementProperties').eq(2).trigger('click');
                //$('#divBodyWrapper').find('#divName').val('news');
                //$('#divBodyWrapper').find('#divClass').val('news');
                //$('#divBodyWrapper').find('#divStyle').val('');
                //$('#divBodyWrapper').find('#divWidth').val('100');
                //$('#divBodyWrapper').find('#saveProperties').trigger('click');
                //// $('#divBodyWrapper').find('#btnSaveLayout').trigger('click');
                //  $('#divBodyWrapper').find('#layoutBuilder').find("div[data-id='1']").find(' > .options').find('.elementAdd').trigger('click');

            },
            ajaxSuccess: function (data) {
                switch (ModernLayoutManager.config.ajaxCallMode) {
                    case 1:
                        $('#divBodyWrapper').attr("data-edit", data.d);
                        ModernLayoutManager.showHideSaveButton();
                        alert('Layout created succesfully');
                        break
                    case 2:
                        //$('#divBodyWrapper').attr("data-edit", data.d);
                        alert('Layout created succesfully');
                        $('#divBodyWrapper').find('#goBack').trigger('click');
                        break;
                    case 3:
                        data = data.d;
                        //var html = '<ul>';
                        var html = '';
                        html += "";
                        html += "<span>Existing Layout</span>";
                        html += '<div class="ExistingtemplateList"><div class="wrapper_templateList">';
                        if (data.length > 0) {
                            $.each(data, function (index, value) {
                                var layout = value.split(',,,,');
                                html += '<div class="templateList">';
                                html += '<div class="smallDOM">';
                                html += layout[1];
                                html += '</div>';
                                html += '<div class="smallDOMover">';
                                html += '<span class="sfBtn activatetemplate" data-name="' + layout[0].replace('.xml', '').trim() + '">Use this</span>'
                                html += '</div>';
                                html += '</div>';
                            });
                        }
                        else {
                            html += '<div class="notemplateList"><span class="notemplateListMsg">there are no modern layout in this template</span></div>';
                        }
                        html += '</div>';
                        html += '</div>';
                        //html += '</ul>';
                        $('#divBodyWrapper').find('.existingTemplateList').html(html);

                        $('#divBodyWrapper').find('.smallDOM').find('div').each(function () {
                            $(this).removeAttr('style');
                        });
                        ModernLayoutManager.BindTemplateEvents();
                        break;
                    case 4:
                        $('#divBodyWrapper').find('#layoutBuilder').html(data.d);
                        ModernLayoutManager.UpdateDetail();
                        break;
                    case 24:
                        break;
                }
            },
            ajaxFailure: function () {
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
                    error: this.ajaxFailure
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
            ModernLayout: function () {
                $('#imgAddModernLayout').off().on("click", function () {
                    ModernLayoutManager.ModernPopupLayout("");
                });

                $('#imgEditModernLayout').off().on("click", function () {
                    ModernLayoutManager.ModernPopupLayout($('#ddlLayoutList option:selected').val());
                });
            },
            ModernPopupLayout: function (layoutName) {
                DOMelement = [];
                $('body').append('<div id="divBodyWrapper"></div>');
                $('#divBodyWrapper').css({
                    height: Math.max($(document).height(), $(window).height()),// $(window).height(),
                    //height: $(window).height(),
                    width: '100%',
                    position: "absolute",
                    'background-color': "#f2f2f2",
                    top: $('#divAdminControlPanel').height(),
                    left: $(window).width()
                }).html($('.layoutcustomcode').html()).animate({ left: "0px" }, 1000);
                $('#divBodyWrapper').attr("data-edit", layoutName);
                ModernLayoutManager.ModernPopupBindEvent();
                if (layoutName.length == 0) {
                    setTimeout(function () {
                        $('#divBodyWrapper').find('#toogleTemplateList').trigger('click');
                    }, 1000);
                }
                else {
                    ModernLayoutManager.GetSingleWireFrame(layoutName);
                    $('#divBodyWrapper').find('#txtlayoutname').val(layoutName);
                }

                //$(window).scroll(function () {
                //    var propertiesTop = $('#divBodyWrapper').find('.templateList_wrapper').height();
                //    propertiesTop = $('#divBodyWrapper').find('.layout_mngr').height() + $('#divBodyWrapper').find('.templateList_wrapper').height();
                //    console.log($(this).scrollTop() + "    " + propertiesTop);
                //    if ($(this).scrollTop() > propertiesTop) {
                //        $('#divBodyWrapper').find('.layout_property').css({ position: 'fixed' }).addClass('margintop0');
                //    } else {
                //        $('#divBodyWrapper').find('.layout_property').css({ position: 'relative' }).removeClass('margintop0');
                //    }
                //});
            },
            ModernPopupBindEvent: function () {
                $('#divBodyWrapper').find('#goBack').off().on('click', function () {
                    $('#divBodyWrapper').animate({ left: $(window).width() + "px" }, 1000, function () {
                        $('#divBodyWrapper').remove();
                    });
                });
                $('#divBodyWrapper').find('#toogleTemplateList').off().on('click', function () {
                    $('#divBodyWrapper').find('.templateList_wrapper').addClass('active');
                    $('#divBodyWrapper').find('.templateList_wrapper').slideDown(500, function () {

                    });
                    $('#divBodyWrapper').find('.layout_wrapper').find('.layout_action > ul').css({ 'position': 'relative' }).removeClass('fixed');
                    // if ($('#divBodyWrapper').find('.existingTemplateList').html().length == 0) {
                    ModernLayoutManager.GetModernLayouts();

                    $('#divBodyWrapper').find('.layout_property').css({ position: 'relative' }).addClass('margintop0');
                    $('#divBodyWrapper').find('.layout_wrapper').addClass('margintop0');
                    $('#divBodyWrapper').find('.layoutBuilder_wrapper').removeClass("margintop0");
                    //}
                });
                $('#divBodyWrapper').find('#cancelTemplateList').off().on('click', function () {
                    $('#divBodyWrapper').find('.layout_wrapper').removeClass('margintop0');
                    $('#divBodyWrapper').find('.templateList_wrapper').slideUp(500, function () {
                        $('#divBodyWrapper').find('.templateList_wrapper').removeClass('active');
                        $('#divBodyWrapper').find('.layout_property').css({ position: 'fixed' }).removeClass('margintop0');                        
                        $('#divBodyWrapper').find('.layout_wrapper').find('.layout_action > ul').css({ 'position': 'fixed' }).addClass('fixed');;
                        $('#divBodyWrapper').find('.layoutBuilder_wrapper').addClass("margintop0");
                    });
                });

                $('#divBodyWrapper').find('#divPropClose').off().on('click', function () {
                    ModernLayoutManager.CloseSideBar();
                });
                $('#divBodyWrapper').find('#divPropOpen').off().on('click', function () {
                    ModernLayoutManager.OpenSideBar();
                });
                $('#divBodyWrapper').find('#createParentContainer').off().on('click', function () {
                    if ($('#divBodyWrapper').find('#layoutBuilder').find(".notes").length > 0) {
                        $('#divBodyWrapper').find('#layoutBuilder').html('');
                    }
                    selectedDOM = $(this).parent('div.layout_action');
                    $('#divBodyWrapper').find('#layoutBuilder').append(ModernLayoutManager.containerHTML());
                    //ModernLayoutManager.AddChild();
                    ModernLayoutManager.BindEventOptions();
                    ModernLayoutManager.showHideSaveButton();
                    $('#divBodyWrapper').find('#cancelTemplateList').trigger('click');
                });
                $('#divBodyWrapper').find('#divName').off().on('keydown', function (e) {
                    if (e.which === 32) {
                        return false;
                    }
                });
                $('#divBodyWrapper').find('#txtlayoutname').off().on('keydown', function (e) {
                    if (e.which === 32) {
                        return false;
                    }
                });
                $('#divBodyWrapper').find('#btnSaveLayout').off().on('click', function () {
                    ModernLayoutManager.SaveLayout(1);
                });
                $('#divBodyWrapper').find('#btnSaveExitLayout').off().on('click', function () {
                    ModernLayoutManager.SaveLayout(2);
                });
                $('#divBodyWrapper').find('#btnResetTolast').off().on('click', function () {
                    var layoutName = $('#divBodyWrapper').attr("data-edit");
                    if (layoutName.length > 0) {
                        if ($('#divBodyWrapper').find('#layoutBuilder').find('div').length > 0) {
                            jConfirm('Are you sure you want to reset to Last save ?', 'Reset to last save', function (r) {
                                if (r) {
                                    ModernLayoutManager.GetSingleWireFrame(layoutName);
                                }
                            });
                        }
                        else {
                            ModernLayoutManager.GetSingleWireFrame(layoutName);
                        }
                    }
                });

                $('#divBodyWrapper').find('#txtlayoutname').off().on('keyup', function () {
                    var currentlayoutName = $('#divBodyWrapper').find('#txtlayoutname').val().trim();
                    if (currentlayoutName.length > 0) {
                        ModernLayoutManager.checkDuplicateName();
                    }
                    else {
                        $('#divBodyWrapper').find('#layoutNameError').html('Layout name is required');
                    }
                });

                $('#divBodyWrapper').find('#saveProperties').off().on('click', function () {
                    if (selectedDOM != null && selectedDOM.length > 0) {
                        var selectedDOMID = selectedDOM.attr('data-id');
                        var DOMexists = false;
                        var indexofDOM = 0;
                        var length = DOMelement.length;
                        var nameExists = false;
                        var name = $('#divBodyWrapper').find('#divName').val();
                        var width = $('#divBodyWrapper').find('#divWidth').val();
                        for (var i = 0; i < length; i++) {
                            if (DOMelement[i].dataID == selectedDOMID) {
                                DOMexists = true;
                                indexofDOM = i;
                            }
                            if (DOMelement[i].ID.toLowerCase() == name.toLowerCase() && DOMelement[i].dataID != selectedDOMID) {
                                nameExists = true;
                            }
                        }
                        if (nameExists || width < 0 || name.trim().length == 0) {
                            $('#divBodyWrapper').find('#nameError').html('');
                            $('#divBodyWrapper').find('#widthError').html('');
                            if (nameExists) {
                                $('#divBodyWrapper').find('#nameError').html('Name already exists');
                                $('#divBodyWrapper').find('#divName').trigger('focus');
                            }
                            if (width < 0) {
                                $('#divBodyWrapper').find('#widthError').html('width must be greater than 0');
                                $('#divBodyWrapper').find('#divWidth').trigger('focus');
                            }
                            if (name.trim().length == 0) {
                                $('#divBodyWrapper').find('#nameError').html('Name is required');
                                $('#divBodyWrapper').find('#divName').trigger('focus');
                            }
                        }
                        else {

                            dataDetail = {};
                            dataDetail.ID = name;
                            dataDetail.divClass = $('#divBodyWrapper').find('#divClass').val();
                            dataDetail.dataID = selectedDOMID;
                            dataDetail.name = name;
                            dataDetail.width = width;
                            dataDetail.style = $('#divBodyWrapper').find('#divStyle').val();
                            if (DOMexists) {
                                DOMelement[indexofDOM] = dataDetail;
                            }
                            else {
                                DOMelement.push(dataDetail);
                            }
                            var tempWidth = selectedDOM.attr('data-con');
                            if (selectedDOM.hasClass('sfFixed')) {
                                selectedDOM.removeClass('sfFixed');
                            }
                            selectedDOM.removeClass('sfCol_' + tempWidth).addClass('sfCol_' + width).attr('data-con', width);
                            selectedDOM.removeClass('attrError');
                            $('#divBodyWrapper').find('#nameError').html('');
                            $('#divBodyWrapper').find('#divWidth').html('');
                            selectedDOM.removeClass('hoverActiveDiv').removeClass('activeDiv');
                            selectedDOM.removeClass('activeDivProperties');
                            //isAnydivActive = false;
                            selectedDOM.find(' > .options').find('.elementSelect').removeClass('disabled');
                            $('.propSave').show();
                            setTimeout(function () {
                                $('.propSave').hide();
                            }, 2000);
                            //for (i = 0; i < DOMelement.length; i++) {
                            //    console.log(DOMelement[i].dataID, DOMelement[i].ID, DOMelement[i].width, DOMelement[i].divClass);
                            //}
                        }
                    }
                });
                $('#divBodyWrapper').find('#viewDOM').off().on('click', function () {
                    if ($('#divBodyWrapper').find('.viewCode').length == 0) {
                        //if ($('#divBodyWrapper').find('#layoutBuilderDOM').find('div').length > 0) {
                        $('#divBodyWrapper').append('<div class="viewCode"></div><div class="viewCodeFade"></div>');
                        $('#divBodyWrapper').find('.viewCode').append('<i id="divCodeClose" class="icons-cancel"></i>');
                        $('#divBodyWrapper').find('.viewCode').append('<textarea id="txtlayoutBuilderParsedDOM" class="layoutparsedDOM"></textarea>');
                        var $divBodyWrapper = $('#divBodyWrapper').find('#layoutBuilderDOM');
                        $divBodyWrapper.html($('#divBodyWrapper').find('#layoutBuilder').html());
                        $divBodyWrapper.find('div.options').remove();
                        $divBodyWrapper.find('div.ui-resizable-handle').remove();
                        $divBodyWrapper.find('div.activeDivProperties').removeClass('activeDivProperties');
                        $divBodyWrapper.find('div').removeClass('selectedDiv').removeClass('hoverActiveDiv').removeClass('activeDiv').removeClass('ui-resizable').removeAttr("data-con").removeAttr('attrError');
                        $divBodyWrapper.find('div').each(function () {
                            var $this = $(this);
                            var dataID = parseInt($this.attr('data-id'));
                            $this.removeClass('ui-resizable');
                            length = DOMelement.length;
                            for (var i = 0; i < length; i++) {
                                var DOMID = parseInt(DOMelement[i].dataID);
                                if (dataID == DOMID) {
                                    $this.attr('id', DOMelement[i].ID);
                                    $this.addClass(DOMelement[i].divClass);
                                    if (DOMelement[i].style != null && DOMelement[i].style.length > 0) {
                                        $this.attr('style', DOMelement[i].style);
                                    }
                                    if ($this.hasClass('freeContainer')) {
                                        $this.removeClass('sfCol_100').removeClass('freeContainer');
                                    }
                                    else {
                                        $this.addClass('sfCol_' + DOMelement[i].width);
                                    }
                                    $this.removeAttr('data-id');
                                }
                            }

                        });
                        //runTabifier($('#divBodyWrapper').find('#layoutBuilderDOM').html(), 'HTML', $('#divBodyWrapper').find('#txtlayoutBuilderDOM'));                        
                        if ($('#divBodyWrapper').find('#txtlayoutBuilderParsedDOM').length > 0 && typeof ($('#divBodyWrapper').find('#txtlayoutBuilderParsedDOM')) != "undefined") {
                            runTabifier($divBodyWrapper.html(), 'HTML', $('#divBodyWrapper').find('#txtlayoutBuilderParsedDOM'));
                        }

                        $('#divBodyWrapper').find('.viewCode').find('#divCodeClose').off().on('click', function () {
                            $('#divBodyWrapper').find('.viewCode').remove();
                            $('#divBodyWrapper').find('.viewCodeFade').remove();
                        });
                    }
                    //}
                    //else {
                    //    $('#divBodyWrapper').find('.viewCode').show();
                    //    $('#divBodyWrapper').find('.viewCodeFade').show();
                    //}
                });

                $('#divBodyWrapper').find('#InsertCode').off().on('click', function () {
                    var $this = $(this);
                    if ($('#divBodyWrapper').find('#layoutBuilder').find('div').length > 0) {
                        jConfirm('Are you sure you want to insert new code ?', 'Use new Layout Dialog', function (r) {
                            if (r) {
                                ModernLayoutManager.InsertCode();
                            }
                        });
                    }
                    else {
                        ModernLayoutManager.InsertCode();
                    }
                });
                $('#divBodyWrapper').find('#CreateNewTemplate').off().on('click', function () {
                    var $this = $(this);
                    if ($('#divBodyWrapper').find('#layoutBuilder').find('div').length == 0) {
                        $('#divBodyWrapper').find('#layoutBuilder').empty();
                        ModernLayoutManager.showHideSaveButton();
                        $('#divBodyWrapper').find('#cancelTemplateList').trigger('click');
                    }
                    else {
                        jConfirm('Are you sure you want to use new layout ?', 'Use new Layout Dialog', function (r) {
                            if (r) {
                                $('#divBodyWrapper').find('#layoutBuilder').empty();
                                ModernLayoutManager.showHideSaveButton();
                                $('#divBodyWrapper').find('#cancelTemplateList').trigger('click');
                            }
                        });
                    }
                });

            },
            InsertCode: function () {
                if ($('#divBodyWrapper').find('.InsertCode').length == 0) {
                    $('#divBodyWrapper').append('<div class="InsertCode"></div><div class="viewInsertCodeFade"></div>');
                    $('#divBodyWrapper').find('.InsertCode').append('<span class="sfError"></span>');
                    $('#divBodyWrapper').find('.InsertCode').append('<i id="divInsertCodeClose" class="icons-cancel"></i>');
                    $('#divBodyWrapper').find('.InsertCode').append('<textarea id="txtGetInsertCode" class="layoutparsedDOM"></textarea>');
                    $('#divBodyWrapper').find('.InsertCode').append(' <div class="sfButtonWrapper"><span class="sfBtn sfSave" id="InsertCodeInDOM">save</span></div>');
                    $('#divBodyWrapper').find('.InsertCode').find('#InsertCodeInDOM').off().on('click', function () {
                        $('#divBodyWrapper').find('.InsertCode').find('.sfError').text('');
                        var code = $('#divBodyWrapper').find('.InsertCode').find('#txtGetInsertCode').val().trim();
                        if (code.length > 0) {
                            var isHtml = /<[a-z]|[\s\S]+>+>[\s\S]*<\/[a-z]+>/g.test(code);
                            if (isHtml) {
                                $('#divBodyWrapper').find('#layoutBuilder').html(code);
                                ModernLayoutManager.UpdateDetail();
                                $('#divBodyWrapper').find('#cancelTemplateList').trigger('click');
                                $('#divBodyWrapper').find('#divInsertCodeClose').trigger('click');
                            }
                            else {
                                $('#divBodyWrapper').find('.InsertCode').find('.sfError').text('Invalid Html tag found');
                            }
                        }
                        else {
                            $('#divBodyWrapper').find('.InsertCode').find('.sfError').text('Please enter some valid HTML layout code');
                        }
                    });
                    $('#divBodyWrapper').find('.InsertCode').find('#divInsertCodeClose').off().on('click', function () {
                        $('#divBodyWrapper').find('.InsertCode').remove();
                        $('#divBodyWrapper').find('.viewInsertCodeFade').remove();
                    });
                }
                else {
                    $('#divBodyWrapper').find('.InsertCode').show();
                    $('#divBodyWrapper').find('.viewInsertCodeFade').show();
                }
            },
            CloseSideBar: function () {
                $('#divBodyWrapper').find('.layout_container').animate({ width: '100%' }, 500);
                $('#divBodyWrapper').find('.layout_property').animate({ width: '0%' }, {
                    duration: 500,
                    complete: function () {
                        $('#divBodyWrapper').find('#divPropOpen').show();
                    }
                });
                $('#divBodyWrapper').find('.layout_property').removeClass('open');
                $('#divBodyWrapper').find('#divPropClose').hide();
            },
            SaveLayout: function (success) {
                var $divBodyWrapper = $('#divBodyWrapper').find('#layoutBuilderDOM');
                var layoutName = $('#divBodyWrapper').find('#txtlayoutname').val().trim();
                $('#divBodyWrapper').find('div.activeDivProperties').removeClass('activeDivProperties');
                $('#divBodyWrapper').find('#layoutBuilder').find('div').removeAttr('attrError');
                if (layoutName.length == 0) {
                    $('#divBodyWrapper').find('#layoutNameError').html('Layout name is required');
                    return false;
                }
                var exists = ModernLayoutManager.checkDuplicateName();
                if (exists) {
                    return false;
                }
                var length = 0;
                var test = '';
                length = DOMelement.length;
                $divBodyWrapper.html($('#divBodyWrapper').find('#layoutBuilder').html());
                $divBodyWrapper.find('div.options').remove();
                $divBodyWrapper.find('div.ui-resizable-handle').remove();
                //var DOMlength = $('#layoutBuilder  div').not('.options').not('.ui-resizable-handle').length;
                var DOMlength = $divBodyWrapper.find('div').length;
                if (length == DOMlength && layoutName.length > 0) {
                    $divBodyWrapper.find('div').removeClass('selectedDiv').removeClass('hoverActiveDiv').removeClass('activeDiv').removeClass('ui-resizable').removeAttr("data-con");
                    $('#divBodyWrapper').find('#layoutBuilderDOM').find('div').each(function () {
                        var $this = $(this);
                        var dataID = parseInt($this.attr('data-id'));
                        length = DOMelement.length;
                        $this.removeClass('ui-resizable');
                        for (var i = 0; i < length; i++) {
                            var DOMID = parseInt(DOMelement[i].dataID);
                            if (dataID == DOMID) {
                                $this.attr('id', DOMelement[i].ID);
                                $this.addClass(DOMelement[i].divClass);
                                if (DOMelement[i].style != null && DOMelement[i].style.length > 0) {
                                    $this.attr('style', DOMelement[i].style);
                                }
                                if ($this.hasClass('freeContainer')) {
                                    $this.removeClass('sfCol_100').removeClass('freeContainer');
                                }
                                else {
                                    $this.addClass('sfCol_' + DOMelement[i].width);
                                }
                                $this.removeAttr('data-id');
                                var innerchild = false;
                                if ($this.find('div').length == 0) {
                                    innerchild = true;
                                }
                                if (innerchild) {
                                    $this.append(ModernLayoutManager.CreatePlaceholder(DOMelement[i].ID));
                                }
                            }
                        }
                    });

                    runTabifier($('#divBodyWrapper').find('#layoutBuilderDOM').html(), 'HTML', $('#divBodyWrapper').find('#txtlayoutBuilderDOM'));
                    var regex = /(<asp:(.)+placeholder>)/g;
                    setTimeout(function () {
                        var xml = $('#divBodyWrapper').find('#txtlayoutBuilderDOM').val().replace(regex, "");
                        var ascx = $('#divBodyWrapper').find('#txtlayoutBuilderDOM').val();
                        if (xml.length > 0) {
                            xml = '<layout name="layout_all" modern="true"> \n ' + xml + '\n</layout>';
                            ModernLayoutManager.CreateModernLayout(layoutName, xml, ascx, success);
                        }
                        // Why settimeout here ??the tabifier is running asynchronous method.
                    }, 1000);
                }
                else {
                    $('#layoutBuilder  div').not('.options').not('.ui-resizable-handle').each(function () {
                        var $this = $(this);
                        var dataID = parseInt($this.attr('data-id'));
                        length = DOMelement.length;
                        var dataidExists = false;
                        for (var i = 0; i < length; i++) {
                            var DOMID = parseInt(DOMelement[i].dataID);
                            if (dataID == DOMID) {
                                dataidExists = true;
                                return;
                            }
                        }
                        if (!dataidExists) {
                            $this.addClass('attrError');
                        }
                        else {
                            $this.removeClass('attrError');
                        }
                    });
                }
            },
            OpenSideBar: function () {
                $('#divBodyWrapper').find('.layout_container').animate({ width: '80%' }, 500);
                $('#divBodyWrapper').find('.layout_property').animate({ width: '20%', }, {
                    duration: 500,
                    complete: function () {
                        $('#divBodyWrapper').find('#divPropClose').show();
                    }
                });
                $('#divBodyWrapper').find('.layout_property').addClass('open');
                $('#divBodyWrapper').find('#divPropOpen').hide();
            },
            containerHTML: function () {
                containerID++;
                var container = '<div class="container sfCol_100" data-con="100" data-id="' + containerID + '">' + actionOptions + '</div>';
                return container;
            },
            containerHTMLFree: function () {
                var container = '<div class="freeDiv" data-id="' + containerID + '">' + actionOptions + '</div>';
                containerID++;
                return container;
            },
            hoverEvent: function (event, $this) {
                event.stopPropagation();
                $('#divBodyWrapper').find('#layoutBuilder').find('div').not('.options').not('.ui-resizable-handle').removeClass('hoverActiveDiv');
                $this.addClass('hoverActiveDiv');
            },
            BindEventOptions: function () {
                //$('#divBodyWrapper').find('.elementAdd').off().on('click', function () {
                //    selectedDOM = $(this).parents('.options').parent('div');
                //    if (selectedDOM != null && selectedDOM.length > 0) {
                //        selectedDOM.append(ModernLayoutManager.containerHTML());
                //        ModernLayoutManager.AddChild();
                //        ModernLayoutManager.BindEventOptions();
                //    }
                //});

                $('#divBodyWrapper').find('#createChildContainer').off().on('click', function () {
                    var selecteddivID = $(this).parent('div').parent('div').attr('data-s');
                    var currentselectedDOM = $('#divBodyWrapper').find('#layoutBuilder').find("div[data-id='" + selecteddivID + "']");
                    if (selectedDOM != null && selectedDOM.length > 0) {
                        selectedDOM.append(ModernLayoutManager.containerHTML());
                        //ModernLayoutManager.AddChild();
                        ModernLayoutManager.BindEventOptions();
                        $('#divBodyWrapper').find('.cancelAddPopup').trigger('click');
                    }
                });

                $('#divBodyWrapper').find('#EmptyParentContainer').off().on('click', function () {
                    jConfirm('Are you sure you want to empty the layout ?', 'Empty Layout Dialog', function (r) {
                        if (r) {
                            $('#divBodyWrapper').find('#layoutBuilder').empty();
                            ModernLayoutManager.showHideSaveButton();
                            DOMelement = [];
                        }
                    });
                });

                $('#divBodyWrapper').find('#createColumns').off().on('click', function () {
                    $('#divBodyWrapper').find('.container_options').hide();
                    $('#divBodyWrapper').find('.columns_wrapper').show();
                    $('#divBodyWrapper').find('.freecontainer_wrapper').hide();
                });

                $('#divBodyWrapper').find('.addCol').off().on('click', function () {
                    var cols = $(this).find('.colNo').text();
                    ModernLayoutManager.CreateColumns(cols, selectedDOM);
                });
                $('#divBodyWrapper').find('.btnback').off().on('click', function () {
                    $('#divBodyWrapper').find('.container_options').show();
                    $('#divBodyWrapper').find('.columns_wrapper').hide();
                    $('#divBodyWrapper').find('.freecontainer_wrapper').hide();
                });

                $('#divBodyWrapper').find('#addMultipleColumn').off().on('click', function () {
                    var cols = $('#divBodyWrapper').find('#colsNo').val();
                    ModernLayoutManager.CreateColumns(cols, selectedDOM);
                });

                $('#divBodyWrapper').find('#createFreeContainer').off().on('click', function () {
                    $('#divBodyWrapper').find('.container_options').hide();
                    $('#divBodyWrapper').find('.columns_wrapper').hide();
                    $('#divBodyWrapper').find('.freecontainer_wrapper').show();
                });

                $('#divBodyWrapper').find('.addFreeCol').off().on('click', function () {
                    var cols = $(this).find('.freecolNo').text();
                    ModernLayoutManager.CreateFreeColumns(cols, selectedDOM);
                });

                $('#divBodyWrapper').find('#addMultipleFreeColumn').off().on('click', function () {
                    var cols = $('#divBodyWrapper').find('#colsfreeNo').val();
                    ModernLayoutManager.CreateFreeColumns(cols, selectedDOM);
                });

                $('#divBodyWrapper').find('#addBefore').off().on('click', function () {
                    var selecteddivID = $(this).parent('div').parent('div').attr('data-s');
                    var currentselectedDOM = $('#divBodyWrapper').find('#layoutBuilder').find("div[data-id='" + selecteddivID + "']");
                    currentselectedDOM.before(ModernLayoutManager.containerHTML());
                    ModernLayoutManager.BindEventOptions();
                    $('#divBodyWrapper').find('.cancelAddPopup').trigger('click');
                });

                $('#divBodyWrapper').find('#addAfter').off().on('click', function () {
                    var selecteddivID = $(this).parent('div').parent('div').attr('data-s');
                    var currentselectedDOM = $('#divBodyWrapper').find('#layoutBuilder').find("div[data-id='" + selecteddivID + "']");
                    currentselectedDOM.after(ModernLayoutManager.containerHTML());
                    ModernLayoutManager.BindEventOptions();
                    $('#divBodyWrapper').find('.cancelAddPopup').trigger('click');
                });

                $('#divBodyWrapper').find('li#elemSelect').off().on('click', function () {
                    var $this = $(this).find('.elementSelect');
                    if ($this.hasClass('disabled')) {
                        return false;
                    }
                    $('#divBodyWrapper').find('#divName').val('');
                    $('#divBodyWrapper').find('#divClass').val('');
                    $('#divBodyWrapper').find('#divStyle').val('');
                    $('#divBodyWrapper').find('#nameError').html('');
                    $('#divBodyWrapper').find('#widthError').html('');
                    selectedDOM = $this.parent().parent().parent().parent();
                    $('#divBodyWrapper').find('#widthProp').hide();
                    if ($this.hasClass('activeSelect')) {
                        $this.removeClass('activeSelect');
                        selectedDOM.removeClass('selectedDiv').removeClass('hoverActiveDiv').removeClass('activeDiv');
                        if ($('#divBodyWrapper').find('.activeSelect').length == 0) {
                            isAnydivActive = false;
                            isAnydivselected = false;
                            $('#divBodyWrapper').find('.additionWrapper').hide();
                            $('#divBodyWrapper').find('.savepropertiesWrapper').show();
                            $('#divBodyWrapper').find('#widthProp').show();
                        }
                        else {
                            //var parent = $this.parent().parent().parent();
                            //parent.find('li').show();
                            //parent.show();
                        }
                    }
                    else {
                        ModernLayoutManager.OpenSideBar();
                        $this.addClass('activeSelect');
                        selectedDOM.addClass('hoverActiveDiv').addClass('activeDiv').addClass('selectedDiv');
                        $('#divBodyWrapper').find('.additionWrapper').show();
                        $('#divBodyWrapper').find('.savepropertiesWrapper').hide();
                        isAnydivActive = true;
                        isAnydivselected = true;
                        var selectedDOMlength = $('#divBodyWrapper').find('#layoutBuilder').find('div.selectedDiv').length;
                        if (selectedDOMlength == 1) {
                            $('#divBodyWrapper').find('#mergeCol').addClass('disabled');
                            $('#divBodyWrapper').find('#SplitCol').removeClass('disabled');
                        } else {
                            $('#divBodyWrapper').find('#mergeCol').removeClass('disabled');
                            $('#divBodyWrapper').find('#SplitCol').addClass('disabled');
                        }
                    }
                });

                $('#divBodyWrapper').find('#SplitCol').off().on('click', function () {
                    if ($(this).hasClass('disabled')) {
                        return false;
                    }
                    var classes = selectedDOM.attr('class');
                    var selectedDOMID = selectedDOM.attr('data-id');
                    var pattern = new RegExp(/sfCol_[0-9]+/);
                    var isMatched = classes.match(pattern);
                    var nameExists = false;
                    if (isMatched != null) {
                        var indexofDOM = 0;
                        var name = $('#divBodyWrapper').find('#divName').val();
                        var length = DOMelement.length;
                        if (name.length > 0) {
                            for (var i = 0; i < length; i++) {
                                if (DOMelement[i].dataID == selectedDOMID) {
                                    indexofDOM = i;
                                }
                                if (DOMelement[i].ID.toLowerCase() == name.toLowerCase()) {
                                    nameExists = true;
                                }
                            }
                            if (nameExists) {
                                $('#divBodyWrapper').find('#nameError').html('Name already exists');
                                $('#divBodyWrapper').find('#divName').trigger('focus');
                            }
                            else {
                                var tempWidth = selectedDOM.attr('data-con');
                                var newWidth = Math.floor(tempWidth / 2);
                                selectedDOM.removeClass('sfCol_' + tempWidth).addClass('sfCol_' + newWidth).attr('data-con', newWidth);
                                //selectedDOM.removeClass('attrError');
                                $('#divBodyWrapper').find('#nameError').html('');
                                //$('#divBodyWrapper').find('#divWidth').html('');
                                selectedDOM.removeClass('hoverActiveDiv').removeClass('activeDiv').removeClass('selectedDiv ');
                                selectedDOM.find(' > .options').find('.elementSelect').removeClass('activeSelect').hid
                                selectedDOM.find(' > .options').hide();
                                DOMelement[indexofDOM].width = newWidth;

                                containerID++;
                                dataDetail = {};
                                dataDetail.ID = name;
                                dataDetail.divClass = $('#divBodyWrapper').find('#divClass').val();
                                dataDetail.dataID = containerID;
                                dataDetail.name = name;
                                dataDetail.width = newWidth;
                                dataDetail.style = $('#divBodyWrapper').find('#divStyle').val();
                                widthClass = classes.replace('sfCol_' + tempWidth, 'sfCol_' + newWidth);
                                DOMelement.push(dataDetail);
                                var column = '<div class="' + widthClass + '" data-id="' + containerID + '" data-con="' + newWidth + '" >' + actionOptions + '</div>';
                                //ModernLayoutManager.AddChild();
                                $(column).insertAfter(selectedDOM);
                                selectedDOM = $('#divBodyWrapper').find('#layoutBuilder').find("div[data-id='" + containerID + "']");
                                selectedDOM.removeClass('hoverActiveDiv').removeClass('activeDiv').removeClass('selectedDiv ');
                                selectedDOM.find(' > .options').find('.elementSelect').removeClass('disabled');
                                ModernLayoutManager.BindEventOptions();
                                ModernLayoutManager.MouseOverEffect();
                                ModernLayoutManager.ResizeableCol();
                                isAnydivActive = false;
                                isAnydivselected = false;
                                $('#divBodyWrapper').find('#nameError').html('');
                            }
                        }
                        else {
                            $('#divBodyWrapper').find('#nameError').html('Name is required');
                            $('#divBodyWrapper').find('#divName').trigger('focus');
                        }
                    }
                });

                $('#divBodyWrapper').find('#wrapCol').off().on('click', function () {
                    var name = $('#divBodyWrapper').find('#divName').val();
                    if (name.length > 0) {
                        var nameExists = false;
                        var length = DOMelement.length;
                        for (var i = 0; i < length; i++) {
                            //if (DOMelement[i].dataID == selectedDOMID) {
                            //    indexofDOM = i;
                            //}
                            if (DOMelement[i].ID.toLowerCase() == name.toLowerCase()) {
                                nameExists = true;
                            }
                        }
                        if (nameExists) {
                            $('#divBodyWrapper').find('#nameError').html('Name already exists');
                            $('#divBodyWrapper').find('#divName').trigger('focus');
                        }
                        else {

                            var fullWidth = 0;
                            var width = 0;
                            $('#divBodyWrapper').find('#layoutBuilder').find('div.selectedDiv').each(function () {
                                var tempWidth = $(this).attr('data-con');
                                fullWidth += parseInt(tempWidth);
                            });
                            var widthClass = 'col';
                            if (fullWidth > 100) {
                                width = 100;
                                widthClass = 'container';
                            }
                            else {
                                width = fullWidth;
                            }
                            containerID++;
                            dataDetail = {};
                            dataDetail.ID = name;
                            dataDetail.divClass = $('#divBodyWrapper').find('#divClass').val();
                            dataDetail.dataID = containerID;
                            dataDetail.name = name;
                            dataDetail.width = width;
                            dataDetail.style = $('#divBodyWrapper').find('#divStyle').val();
                            widthClass += ' sfCol_' + width;
                            DOMelement.push(dataDetail);
                            var column = '<div class="' + widthClass + '" data-id="' + containerID + '" data-con="' + width + '" >' + actionOptions + '</div>';
                            //ModernLayoutManager.AddChild();
                            $(column).insertAfter($('#divBodyWrapper').find('#layoutBuilder').find('div.selectedDiv').eq(0));
                            selectedDOM = $('#divBodyWrapper').find('#layoutBuilder').find("div[data-id='" + containerID + "']");
                            selectedDOM.removeClass('hoverActiveDiv').removeClass('activeDiv').removeClass('selectedDiv ');
                            selectedDOM.append(actionOptions);
                            selectedDOM.find(' > .options').find('.elementSelect').removeClass('disabled');
                            $('#divBodyWrapper').find('#layoutBuilder').find('div.selectedDiv').each(function () {
                                $this = $(this);

                                $this.removeClass('hoverActiveDiv').removeClass('activeDiv').removeClass('selectedDiv ');
                                $this.find('.elementSelect').removeClass('activeSelect');

                                if (fullWidth <= 100) {
                                    var inititalWidth = $this.attr('data-con');
                                    var widthClass = '';

                                    if ((inititalWidth * 100) % fullWidth == 0) {
                                        width = (inititalWidth * 100) / fullWidth;
                                        widthClass = 'sfCol_' + width;
                                    }
                                    else {
                                        width = (inititalWidth * 100) / fullWidth;
                                        widthClass = 'sfFixed sfCol_' + Math.floor(width);
                                    }

                                    var classes = $this.attr('class');
                                    var pattern = new RegExp(/sfCol_[0-9]+/);
                                    var isMatched = classes.match(pattern);
                                    if (isMatched != null) {
                                        $this.removeClass('sfCol_' + inititalWidth).addClass(widthClass).attr('data-con', Math.floor(width));
                                    }
                                    else {
                                        $this.addClass(widthClass).attr('data-con', Math.floor(width));
                                    }
                                    $this.appendTo(selectedDOM);
                                }
                                else {
                                    $this.appendTo(selectedDOM);
                                }
                            });
                            ModernLayoutManager.BindEventOptions();
                            ModernLayoutManager.MouseOverEffect();
                            ModernLayoutManager.ResizeableCol();
                            isAnydivActive = false;
                            isAnydivselected = false;
                            $('#divBodyWrapper').find('#nameError').html('');
                        }
                    } else {
                        $('#divBodyWrapper').find('#nameError').html('Name is required');
                        $('#divBodyWrapper').find('#divName').trigger('focus');
                    }
                });

                $('#divBodyWrapper').find('#mergeCol').off().on('click', function () {
                    if ($(this).hasClass('disabled')) {
                        return false;
                    }
                    var name = $('#divBodyWrapper').find('#divName').val();
                    if (name.length > 0) {
                        var nameExists = false;
                        var length = DOMelement.length;
                        for (var i = 0; i < length; i++) {
                            if (DOMelement[i].ID.toLowerCase() == name.toLowerCase()) {
                                nameExists = true;
                            }
                        }
                        if (nameExists) {
                            $('#divBodyWrapper').find('#nameError').html('Name already exists');
                            $('#divBodyWrapper').find('#divName').trigger('focus');
                        }
                        else {
                            var fullWidth = 0;
                            var width = 0;
                            $('#divBodyWrapper').find('#layoutBuilder').find('div.selectedDiv').each(function () {
                                var tempWidth = $(this).attr('data-con');
                                fullWidth += parseInt(tempWidth);
                            });
                            var widthClass = 'col';
                            if (fullWidth > 100) {
                                width = 100;
                                widthClass = 'container';
                            }
                            else {
                                width = fullWidth;
                            }
                            containerID++;
                            dataDetail = {};
                            dataDetail.ID = name;
                            dataDetail.divClass = $('#divBodyWrapper').find('#divClass').val();
                            dataDetail.dataID = containerID;
                            dataDetail.name = name;
                            dataDetail.width = width;
                            dataDetail.style = $('#divBodyWrapper').find('#divStyle').val();
                            widthClass += ' sfCol_' + width;
                            DOMelement.push(dataDetail);
                            var column = '<div class="' + widthClass + '" data-id="' + containerID + '" data-con="' + width + '" >' + actionOptions + '</div>';
                            //ModernLayoutManager.AddChild();
                            $(column).insertAfter($('#divBodyWrapper').find('#layoutBuilder').find('div.selectedDiv').eq(0));
                            selectedDOM = $('#divBodyWrapper').find('#layoutBuilder').find("div[data-id='" + containerID + "']");
                            selectedDOM.removeClass('hoverActiveDiv').removeClass('activeDiv').removeClass('selectedDiv ');
                            selectedDOM.find(' > .options').find('.elementSelect').removeClass('disabled');
                            //selectedDOM.append(actionOptions);

                            $('#divBodyWrapper').find('#layoutBuilder').find('div.selectedDiv').each(function () {
                                $this = $(this);
                                $this.removeClass('hoverActiveDiv').removeClass('activeDiv').removeClass('selectedDiv ');
                                $this.find('.elementSelect').removeClass('activeSelect');

                                $this.find(' > .options').remove();
                                $this.children().appendTo(selectedDOM);
                                $this.remove();
                            });
                            ModernLayoutManager.BindEventOptions();
                            ModernLayoutManager.MouseOverEffect();
                            ModernLayoutManager.ResizeableCol();
                            isAnydivActive = false;
                            isAnydivselected = false;
                            $('#divBodyWrapper').find('#nameError').html('');
                        }
                    } else {
                        $('#divBodyWrapper').find('#nameError').html('Name is required');
                        $('#divBodyWrapper').find('#divName').trigger('focus');
                    }
                });


                $('#divBodyWrapper').find('.elementAdd').off().on('click', function () {
                    if (!isAnydivselected) {
                        $('#divBodyWrapper').find('.container_options').show();
                        $('#divBodyWrapper').find('.columns_wrapper').hide();
                        $('#divBodyWrapper').find('.freecontainer_wrapper').hide();
                        isAnydivActive = true;
                        $(this).addClass('activeSelect');
                        selectedDOM = $(this).parents('.options').parent('div');
                        selectedDOM.addClass('hoverActiveDiv').addClass('activeDiv');
                        var containerDOM = $('#divBodyWrapper').find('#layoutaddContainer');
                        containerDOM.attr('data-s', selectedDOM.attr('data-id'));
                        var parentTop = selectedDOM.offset().top;
                        var parentleft = selectedDOM.offset().left;
                        var parentheight = selectedDOM.height();
                        var parentwidth = selectedDOM.width();

                        var conatinerheight = containerDOM.height();
                        var conatinerwidth = containerDOM.width();
                        var containerTop = parentTop - (conatinerheight / 2) - 50;
                        var containerleft = parentleft + (parentwidth / 2) - (conatinerwidth / 2);
                        containerDOM.css({ top: containerTop, left: containerleft });
                        containerDOM.show();
                    }
                });

                $('#divBodyWrapper').find('.elementduplicate').off().on('click', function () {
                    if (!isAnydivselected) {
                        selectedDOM = $(this).parents('.options').parent('div');
                        var selectedDOMID = selectedDOM.attr('data-id');
                        var copyelement = selectedDOM[0].outerHTML;
                        // selectedDOM.after($("<div />").append(selectedDOM.clone(false, false)).html());
                        selectedDOM.after(copyelement);
                        selectedDOM = $('#divBodyWrapper').find('#layoutBuilder').find("div[data-id='" + selectedDOMID + "']").eq(1);
                        selectedDOM.find('div').not('.options').not('.ui-resizable-handle').each(function () {
                            var $this = $(this);
                            var oriDataDetail = ModernLayoutManager.GetDomDetail($this.attr('data-id'));
                            containerID++;
                            $this.attr('data-id', containerID);//.attr('id', selectedDOM.attr('id') + containerID);
                            var ndataDetail = {};
                            var newranName = ModernLayoutManager.GenerateRandomName();
                            ndataDetail.ID = newranName;
                            ndataDetail.dataID = containerID;
                            ndataDetail.name = newranName;
                            if (typeof (oriDataDetail) !== "undefined") {
                                if (typeof (oriDataDetail.divClass) !== "undefined" && oriDataDetail.divClass.length > 0) {
                                    ndataDetail.divClass = oriDataDetail.divClass;
                                }
                                if (typeof (oriDataDetail.width) !== "undefined" && oriDataDetail.width.length > 0) {
                                    ndataDetail.width = oriDataDetail.width;
                                }
                                if (typeof (oriDataDetail.style) !== "undefined" && oriDataDetail.style.length > 0) {
                                    ndataDetail.style = oriDataDetail.style;
                                }
                            }
                            $this.find(' > .options').find('.elementSelect').removeClass('disabled');
                            DOMelement.push(ndataDetail);
                        });
                        var originalDataDetail = ModernLayoutManager.GetDomDetail(selectedDOMID);
                        containerID++;
                        selectedDOM.attr('data-id', containerID);//.attr('id', selectedDOM.attr('id') + containerID);
                        var newDataDetail = {};
                        var ranName = ModernLayoutManager.GenerateRandomName();
                        newDataDetail.ID = ranName;
                        newDataDetail.dataID = containerID;
                        newDataDetail.name = ranName;
                        if (typeof (originalDataDetail) !== "undefined") {
                            if (typeof (originalDataDetail.divClass) !== "undefined" && originalDataDetail.divClass.length > 0) {
                                newDataDetail.divClass = originalDataDetail.divClass;
                            }
                            if (typeof (originalDataDetail.width) !== "undefined" && originalDataDetail.width.length > 0) {
                                newDataDetail.width = originalDataDetail.width;
                            }
                            if (typeof (originalDataDetail.style) !== "undefined" && originalDataDetail.style.length > 0) {
                                newDataDetail.style = originalDataDetail.style;
                            }
                        }
                        selectedDOM.find(' > .options').find('.elementSelect').removeClass('disabled');
                        DOMelement.push(newDataDetail);
                        //for (i = 0; i < DOMelement.length; i++) {
                        //    console.log(DOMelement[i].dataID, DOMelement[i].ID, DOMelement[i].width, DOMelement[i].divClass);
                        //}
                        ModernLayoutManager.BindEventOptions();
                        ModernLayoutManager.MouseOverEffect();
                        ModernLayoutManager.ResizeableCol();
                    }
                });
                $('#divBodyWrapper').find('.elementDelete').off().on('click', function () {
                    if (!isAnydivselected) {
                        selectedDOM = $(this).parents('.options').parent('div');
                        selectedDOM.addClass('hoverActiveDiv').addClass('activeDiv');
                        var containerDOM = $('#DeleteContainer');
                        if (containerDOM.length == 0) {
                            var deleteDOM = '<div id="DeleteContainer" class="DeleteContainer" data-s="' + selectedDOM.attr('data-id') + '">';
                            deleteDOM += '<div class="deleteWrapper">';
                            deleteDOM += '<i id="cancelDeletePopup" class="icons-cancel cancelPopup" data-s="0"></i>';
                            deleteDOM += '<span>What Do you want to do ?</span>';
                            deleteDOM += '<div id="deletelayout" class="deletelayout">';
                            deleteDOM += '<span class="sfBtn sfSave" id="btnDeleteModernLayout">Delete</span>';
                            deleteDOM += '<span class="sfBtn sfEmpty" id="btnEmptyModernLayout">Empty</span>';
                            deleteDOM += '</div>';
                            deleteDOM += '</div>';
                            deleteDOM += '</div>';
                            $('body').append(deleteDOM);
                            $('#btnDeleteModernLayout').off().on('click', function () {
                                isAnydivActive = false;
                                var dataid = $(this).parents('#DeleteContainer').attr('data-s');
                                selectedDOM = $('#divBodyWrapper').find('#layoutBuilder').find("div[data-id='" + dataid + "']");
                                var deleteIds = [];
                                deleteIds.push(selectedDOM.attr('data-id'));
                                selectedDOM.find('div').not('.options').not('.ui-resizable-handle').each(function () {
                                    var ID = $(this).attr('data-id');
                                    deleteIds.push(ID);
                                });
                                ModernLayoutManager.DeleteDOMID(deleteIds);
                                selectedDOM.remove();
                                ModernLayoutManager.showHideSaveButton();
                                $('#cancelDeletePopup').trigger('click');
                            });

                            $('#btnEmptyModernLayout').off().on('click', function () {
                                isAnydivActive = false;
                                var dataid = $(this).parents('#DeleteContainer').attr('data-s');
                                selectedDOM = $('#divBodyWrapper').find('#layoutBuilder').find("div[data-id='" + dataid + "']");
                                var deleteIds = [];
                                selectedDOM.find('div').not('.options').not('.ui-resizable-handle').each(function () {
                                    var ID = $(this).attr('data-id');
                                    deleteIds.push(ID);
                                });
                                ModernLayoutManager.DeleteDOMID(deleteIds);
                                selectedDOM.empty();
                                selectedDOM.find(' > .options').find('.elementSelect').removeClass('disabled');
                                selectedDOM.append(actionOptions);
                                ModernLayoutManager.BindEventOptions();
                                $('#cancelDeletePopup').trigger('click');
                            });

                            $('#cancelDeletePopup').off().on('click', function () {
                                $('#DeleteContainer').remove();
                            });
                        }
                        else {
                            containerDOM.attr('data-s', selectedDOM.attr('data-id'));
                        }
                        var containerDOM = $('#DeleteContainer');
                        var parentTop = selectedDOM.offset().top;
                        var parentleft = selectedDOM.offset().left;
                        var parentheight = selectedDOM.outerHeight();
                        var parentwidth = selectedDOM.outerWidth();
                        containerDOM.css({
                            top: parentTop,
                            left: parentleft,
                            height: parentheight,
                            width: parentwidth,
                            position: 'absolute'
                        });
                    }
                });

                $('#divBodyWrapper').find('.cancelAddPopup').off().on('click', function () {
                    isAnydivActive = false;
                    var dataid = $(this).parent('div').attr('data-s');
                    selectedDOM = $('#divBodyWrapper').find('#layoutBuilder').find("div[data-id='" + dataid + "']");
                    selectedDOM.removeClass('hoverActiveDiv').removeClass('activeDiv');
                    selectedDOM.find('.options').hide();
                    $('#divBodyWrapper').find('#layoutaddContainer').hide();
                    $('.elementAdd').removeClass('activeSelect');
                });

                ModernLayoutManager.MouseOverEffect();
                $('#divBodyWrapper').find('.elementProperties').off().on('click', function () {
                    if (!isAnydivselected) {
                        $('#divBodyWrapper').find('#nameError').html('');
                        $('#divBodyWrapper').find('#divWidth').html('');
                        selectedDOM = $(this).parents('.options').parent('div');
                        $('.additionWrapper').hide();
                        if (selectedDOM.hasClass('freeContainer')) {
                            $('#divBodyWrapper').find('#divWidth').val('100');
                            $('#divBodyWrapper').find('#widthProp').hide();
                        }
                        else {
                            $('#divBodyWrapper').find('#widthProp').show();
                        }
                        $('.savepropertiesWrapper').show();
                        $('#divBodyWrapper').find('div').removeClass('activeDivProperties');
                        selectedDOM.addClass('activeDivProperties');
                        ModernLayoutManager.ClearProperties();
                        var width = selectedDOM.attr('data-con');
                        $('#divBodyWrapper').find('#divWidth').val(width);
                        if (selectedDOM != null && selectedDOM.length > 0) {
                            var selectedDOMID = selectedDOM.attr('data-id');
                            var length = DOMelement.length;
                            for (var i = 0; i < length; i++) {
                                if (DOMelement[i].dataID == selectedDOMID) {
                                    $('#divBodyWrapper').find('#divName').val(DOMelement[i].ID);
                                    $('#divBodyWrapper').find('#divClass').val(DOMelement[i].divClass);
                                    $('#divBodyWrapper').find('#divStyle').val(DOMelement[i].style);
                                    $('#divBodyWrapper').find('#divWidth').val(DOMelement[i].width);
                                }
                            }
                            if (!$('#divBodyWrapper').find('.layout_property').hasClass('open')) {
                                ModernLayoutManager.OpenSideBar();
                            }
                            //ModernLayoutManager.AddChild();
                            //ModernLayoutManager.BindEventOptions();
                        }
                    }
                });

                $('.icons-toggle').on('click', function () {
                    var $this = $(this);
                    var next = $this.next();
                    if (next.hasClass('hide')) {
                        next.removeClass('hide');
                        next.show();
                    }
                    else {
                        next.addClass('hide');
                        next.hide()
                    }
                });

            },
            GenerateRandomName: function (e) {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 5; i++)
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                return text;
            },
            GetDomDetail: function (dataID) {
                var dataDetail;
                length = DOMelement.length;
                for (var i = 0; i < length; i++) {
                    if (DOMelement[i].dataID == dataID) {
                        dataDetail = DOMelement[i];
                    }
                }
                return dataDetail;

            },
            DeleteDOMID: function (deleteIds) {
                var listlength = DOMelement.length;
                var deletelistLength = deleteIds.length;
                var newList = [];
                for (i = 0; i < listlength; i++) {
                    var notTodelete = true;
                    for (j = 0; j < deletelistLength; j++) {
                        if (parseInt(DOMelement[i].dataID) == parseInt(deleteIds[j])) {
                            notTodelete = false;
                        }
                    }
                    if (notTodelete) {
                        newList.push(DOMelement[i]);
                    }
                }
                DOMelement = newList;
            },
            showHideSaveButton: function () {
                if ($('#divBodyWrapper').find('#layoutBuilder').find('div').length == 0) {
                    if ($('#divBodyWrapper').attr('data-edit').trim().length == 0) {
                        $('#divBodyWrapper').find('#btnSaveLayout').hide();
                        $('#divBodyWrapper').find('#btnSaveExitLayout').hide();
                        $('#divBodyWrapper').find('#btnResetTolast').hide();
                        $('#divBodyWrapper').find('#savelayout').hide();
                    }
                    else {
                        $('#divBodyWrapper').find('#btnSaveLayout').hide();
                        $('#divBodyWrapper').find('#btnSaveExitLayout').hide();
                        $('#divBodyWrapper').find('#btnResetTolast').show();
                        $('#divBodyWrapper').find('#savelayout').show();
                    }
                }
                else {
                    if ($('#divBodyWrapper').attr('data-edit').trim().length == 0) {
                        $('#divBodyWrapper').find('#btnSaveLayout').show();
                        $('#divBodyWrapper').find('#btnSaveExitLayout').show();
                        $('#divBodyWrapper').find('#btnResetTolast').hide();
                        $('#divBodyWrapper').find('#savelayout').show();
                    }
                    else {
                        $('#divBodyWrapper').find('#btnSaveLayout').show();
                        $('#divBodyWrapper').find('#btnSaveExitLayout').show();
                        $('#divBodyWrapper').find('#btnResetTolast').show();
                        $('#divBodyWrapper').find('#savelayout').show();
                    }
                }
            },
            MouseOverEffect: function () {
                $('#divBodyWrapper').find('#layoutBuilder').find('div').not('.options').not('.ui-resizable-handle').off().on({
                    mouseenter: function (event) {
                        $this = $(this);
                        if (!isAnydivActive) {
                            ModernLayoutManager.hoverEvent(event, $this);
                            $this.find(' > .options').find('li').show();
                            $this.find(' > .options').show();
                        }
                        if (isAnydivselected) {
                            if (!$this.hasClass('selectedDiv')) {
                                $this.find(' > .options').find('li').hide();
                                var parentID = $('#divBodyWrapper').find('#layoutBuilder').find('div.selectedDiv').parent('div').attr('data-id');
                                var currentParentID = $this.parent('div').attr('data-id');
                                if (parentID == currentParentID) {
                                    $this.find(' > .options').find('li#elemSelect').show();
                                    $this.find(' > .options').show();
                                }
                            }
                            else {
                                //ModernLayoutManager.hoverEvent(event, $this);
                            }
                        }
                    },
                    mousemove: function (event) {
                        $this = $(this);
                        event.stopPropagation();
                        if (!isAnydivActive) {
                            $this.find(' > .options').show();
                            $('#divBodyWrapper').find('#layoutBuilder').find('div').not('.options').not('.ui-resizable-handle').removeClass('hoverActiveDiv');
                            $this.addClass('hoverActiveDiv');
                        }
                        if (isAnydivselected) {
                            $('#divBodyWrapper').find('#layoutBuilder').find('div').not('.options').not('.ui-resizable-handle').removeClass('hoverActiveDiv');
                            $this.addClass('hoverActiveDiv');
                            $this.find(' > .options').show();
                        }
                    },
                    mouseout: function (event) {
                        event.stopPropagation();
                        $this = $(this);
                        $this.removeClass('hoverActiveDiv');
                        if (!isAnydivActive) {
                            $this.find('.options').hide();
                        }
                        if (isAnydivselected) {
                            if ($this.hasClass('selectedDiv')) {
                                $this.find('.options').show();
                            }
                            else {
                                $this.find('.options').hide();
                            }
                        }
                    }
                });
                $('#divBodyWrapper').find('#layoutBuilder').find('div.options').off().on({
                    mouseenter: function (event) {
                        $(this).show();
                    },

                });
            },
            ResizeableCol: function () {
                var container = '';
                //$('#divBodyWrapper').find('#layoutBuilder').find('.col').resizable({
                //    helper: "ui-resizable-helper",
                //    handles: 'e',
                //    start: function (event, ui) {
                //        container = ui.element.parent('div');
                //        sibTotalWidth = ui.originalSize.width + ui.originalElement.next().outerWidth();
                //    },
                //    stop: function (event, ui) {
                //        var cellPercentWidth = 100 * ui.originalElement.outerWidth() / container.innerWidth();
                //        ui.originalElement.css('width', cellPercentWidth + '%');
                //        var nextCell = ui.originalElement.next();
                //        var nextPercentWidth = 100 * nextCell.outerWidth() / container.innerWidth();
                //        nextCell.css('width', nextPercentWidth + '%');
                //    },
                //    resize: function (event, ui) {
                //        ui.originalElement.next().width(sibTotalWidth - ui.size.width);
                //        var cellPercentWidth = 100 * ui.originalElement.outerWidth() / container.innerWidth();
                //        ui.originalElement.find('.elementSelect').text(parseFloat(cellPercentWidth).toFixed(3) + '%');
                //        var nextCell = ui.originalElement.next();
                //        var nextPercentWidth = 100 * nextCell.outerWidth() / container.innerWidth();
                //        nextCell.find('.elementSelect').text(parseFloat(nextPercentWidth).toFixed(3) + '%');
                //    }
                //});
            },
            CreateColumns: function (colNo, $appendTo) {
                var hundred = 100;
                var width = 0;
                var widthClass = '';
                if (hundred % colNo == 0) {
                    width = (hundred / colNo);
                    widthClass = 'sfCol_' + width;
                }
                else {
                    width = (hundred / colNo);
                    widthClass = 'sfFixed sfCol_' + Math.floor(width);
                }
                var divWidth = Math.floor($appendTo.width() / colNo);
                var column = '';
                for (var i = 0; i < colNo; i++) {
                    containerID++;
                    var optCont = actionOptions;
                    if (divWidth <= 112) {
                        optCont = actionResOptions;
                    }
                    column += '<div class="col ' + widthClass + '" data-id="' + containerID + '" data-con="' + Math.floor(width) + '" >' + optCont + '</div>';
                    //ModernLayoutManager.AddChild();
                }
                //$appendTo.html('');
                //selectedDOM.append(actionOptions);
                $appendTo.append(column);
                ModernLayoutManager.BindEventOptions();
                ModernLayoutManager.MouseOverEffect();
                ModernLayoutManager.ResizeableCol();
                $('#divBodyWrapper').find('.cancelAddPopup').trigger('click');
            },

            CreateFreeColumns: function (colNo, $appendTo) {
                var hundred = 100;
                var width = 100;
                var widthClass = widthClass = 'freeContainer';// sfCol_' + width;
                var column = '';
                for (var i = 0; i < colNo; i++) {
                    containerID++;
                    column += '<div class=" ' + widthClass + '" data-id="' + containerID + '" data-con="' + width + '" >' + actionOptions + '</div>';
                    //ModernLayoutManager.AddChild();
                }
                $appendTo.append(column);
                $('#divBodyWrapper').find('#layoutBuilder').find("div.freeContainer").find('#elemSelect').remove();
                ModernLayoutManager.BindEventOptions();
                ModernLayoutManager.MouseOverEffect();
                $('#divBodyWrapper').find('.cancelAddPopup').trigger('click');
            },
            ClearProperties: function () {
                $('#divBodyWrapper').find('#divName').val('');
                $('#divBodyWrapper').find('#divClass').val('');
                $('#divBodyWrapper').find('#divStyle').val('');
                $('#divBodyWrapper').find('#divWidth').val('100');
            },
            CreatePlaceholder: function (paneName) {
                var placeholder = '<asp:PlaceHolder ID="pch_' + paneName + '" runat="server"></asp:PlaceHolder>';
                return placeholder;
            },
            AddChild: function () {
                var selectedDOMID = selectedDOM.attr('data-id');
                ModernLayoutManager.AddcontainerChild(containerID, selectedDOMID);
            },
            AddcontainerChild: function (childID, parentID) {

                child = { childID: childID, parentID: parentID, innerChild: true };
                if (parentID != 0) {
                    length = ParentChild.length;
                    for (var i = 0; i < length; i++) {
                        if (parentID == ParentChild[i].childID) {
                            ParentChild[i].innerChild = false;
                        }
                    }
                }
                ParentChild.push(child);
                //for development test
                var test = '';
                length = ParentChild.length;
                for (var i = 0; i < length; i++) {
                    test +=
                    ParentChild[i].childID + "   " +
                    ParentChild[i].parentID + "   " +
                    ParentChild[i].innerChild + "   " + '\n';
                }
                //$('.noprotect').val(test);
            },
            checkDuplicateName: function () {
                var name = $('#divBodyWrapper').find('#txtlayoutname').val().trim();
                var exists = false;
                var existingName = $('#divBodyWrapper').attr('data-edit');
                if (existingName.length > 0 && existingName == name) {
                    return false;
                }
                if (LayoutList.length == 0) {
                    ModernLayoutManager.GetTemplateListName();
                }
                var listLayout = LayoutList.split(',');
                var length = listLayout.length;
                for (i = 0; i < length ; i++) {
                    if (listLayout[i].toLowerCase().length > 0 && listLayout[i].toLowerCase() == name.toLowerCase()) {
                        exists = true;
                    }
                }
                $('#divBodyWrapper').find('#layoutNameError').html('');
                if (exists) {
                    $('#divBodyWrapper').find('#layoutNameError').html('Layout name already exists');
                }
                //else {
                //    $('#divBodyWrapper').find('#layoutNameError').html('');
                //}
                return exists;
            },
            BindTemplateEvents: function () {
                $('#divBodyWrapper').find('.activatetemplate').off().on('click', function () {
                    var $this = $(this);
                    var layoutName = $this.attr('data-name');
                    if ($('#divBodyWrapper').find('#layoutBuilder').find('div').length == 0) {
                        ModernLayoutManager.GetSingleWireFrame(layoutName);
                        $('#divBodyWrapper').find('#cancelTemplateList').trigger('click');
                    }
                    else {
                        jConfirm('Are you sure you want to use this layout ?', 'Use existing Layout Dialog', function (r) {
                            if (r) {
                                ModernLayoutManager.GetSingleWireFrame(layoutName);
                                $('#divBodyWrapper').find('#cancelTemplateList').trigger('click');
                            }
                        });
                    }
                });
            },
            SavedSuceessFullyAlert: function () {
            },
            //UseExistingLayout: function ($this) {
            //    $('#divBodyWrapper').find('#layoutBuilder').html($this.parents('div.templateList').find('.smallDOM').html());
            //    $('#divBodyWrapper').find('#cancelTemplateList').trigger('click');
            //},
            UpdateDetail: function () {
                DOMelement = [];
                containerID = 0;
                $('#divBodyWrapper').find('#layoutBuilder').find(' > div').each(function () {
                    if (!$(this).hasClass('container'))
                        $(this).addClass('container');
                });
                $('#divBodyWrapper').find('#layoutBuilder').find('div').each(function () {
                    $this = $(this);
                    var ID = $this.attr('id');
                    if (typeof (ID) != "undefined") {
                        $this.prepend(actionOptions);
                        ModernLayoutManager.showHideSaveButton();
                        ModernLayoutManager.BindEventOptions();
                        ModernLayoutManager.MouseOverEffect();
                        ModernLayoutManager.ResizeableCol();
                        var classes = $this.attr('class');
                        var pattern = new RegExp(/sfCol_[0-9]+/);
                        var isMatched = classes.match(pattern);
                        var width = 100;
                        containerID++;
                        if (isMatched == null) {
                            $this.addClass('freeContainer');
                            $this.find('#elemSelect').remove();
                        }
                        else {
                            width = isMatched[0].replace('sfCol_', '');
                        }
                        $this.attr('data-id', containerID);
                        $this.attr('data-con', width);
                        dataDetail = {};
                        dataDetail.ID = $this.attr('id');
                        dataDetail.divClass = $this.attr('class').replace(isMatched, '').replace('col', '').replace('container', '').replace('freeContainer', '').replace('ui-resizable', '');
                        $this.removeClass(dataDetail.divClass);
                        dataDetail.dataID = containerID;
                        dataDetail.name = $this.attr('id');
                        dataDetail.width = width;
                        dataDetail.style = $this.attr('style');
                        $this.removeAttr('style');
                        $this.find(' > .options').find('.elementSelect').removeClass('disabled');
                        //widthClass = classes.replace('sfCol_' + width, 'sfCol_' + newWidth);
                        DOMelement.push(dataDetail);
                    }
                    else {
                        $this.remove();
                    }
                });
            },
            calculateDOM: function () {

            },
            CreateModernLayout: function (filename, xml, ascx, success) {
                this.config.method = "CreateModernLayout";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ FilePath: filename, Xml: xml, TemplateName: currentTemplateName, ascx: ascx });
                this.config.ajaxCallMode = success;
                this.ajaxCall(this.config);
            },

            GetModernLayouts: function () {
                this.config.method = "ModernLayoutList";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({ templateName: currentTemplateName });
                this.config.ajaxCallMode = 3;
                this.ajaxCall(this.config);
            },
            GetSingleWireFrame: function (layoutName) {
                this.config.method = "SingleModernLayout";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    templateName: currentTemplateName,
                    layoutName: layoutName
                });
                this.config.ajaxCallMode = 4;
                this.ajaxCall(this.config);
            },
            GetTemplateListName: function () {
                this.config.method = "LoadLayouts";
                this.config.url = this.config.baseURL + this.config.method;
                this.config.data = JSON2.stringify({
                    templateName: currentTemplateName
                });
                $.ajax({
                    type: this.config.type,
                    contentType: this.config.contentType,
                    cache: this.config.cache,
                    url: this.config.url,
                    data: this.config.data,
                    dataType: this.config.dataType,
                    success: function (data) {
                        LayoutList = data.d;
                    },
                    error: this.ajaxFailure
                });
            }

        };
        ModernLayoutManager.init();
    }
    $.fn.ModernLayoutManager = function (p) {
        $.createModernLayoutManager(p);
    };
})(jQuery);