$(function() {

    var NewsLetter = {
        config: {
            isPostBack: false,
            async: false,
            cache: false,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: { data: '' },
            dataType: 'json',
            baseURL: NewsLetterPath + 'Services/NewsLetterWebService.asmx/',
            method: "",
            ModulePath: '',
            PortalID: PortalID,
            UserModuleID: UserModuleID,
            UserName: UserName,
            PageExt: PageExt

        },
        init: function() {
            $('input:radio[value=ByEmail]').attr('checked', true);
            $('input:radio[value=ByPhone]').attr('checked', false);
            $('#phoneSubscribe').hide();
            $('#divEmailSubsCribe').show();
            //NewsLetter.GetSetting();
            $("#imageplace").html('<img src="' + NewsLetterPath + 'images/subscribe.png" alt="subscribe"/>');
            //            $('#lblmessage').click(function() {
            //                $(this).hide();
            //            });

        },
        SaveEmailSubscriber: function() {
            var email = $("#txtSubscribeEmail").val();
            if (NewsLetter.CheckPreviousEmailSubscription(email)) {
                var html = GetSystemLocale('You are already a subscribed member');
                $("#lblmessage").html(html).css({ "display": "block", "color": "red" });

            }

            else {
                var mydata = JSON2.stringify({
                    Email: email,
                    UserModuleID: NewsLetter.config.UserModuleID,
                    PortalID: NewsLetter.config.PortalID,
                    UserName: NewsLetter.config.UserName,
                    secureToken: SageFrameSecureToken
                });

                $.ajax({
                    type: "POST",
                    async: false,
                    url: NewsLetter.config.baseURL + "SaveEmailSubscriber",
                    data: mydata,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function(data) {
                        $("#txtSubscribeEmail").val('');
                        $("#lblmessage").html(GetSystemLocale("Subscribed Successfully")).css({ "display": "block", "color": "green" });
                    },
                    error: function() {
                    }
                });
            }


        },
        CheckPreviousEmailSubscription: function(email) {
            var bitval = true;
            $.ajax({
                type: "POST",
                async: false,
                url: NewsLetter.config.baseURL + "CheckPreviousEmailSubscription",
                data: JSON2.stringify({
                    Email: email,
                    PortalID: SageFramePortalID,
                    UserModuleID: NewsLetter.config.UserModuleID,
                    UserName: SageFrameUserName,
                    secureToken: SageFrameSecureToken
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data) {
                    if (data.d.length > 0) {
                        bitval = true;
                    }
                    else {
                        bitval = false;
                    }
                },
                error: function() {
                }
            });
            return bitval;
        },
        SaveMobileSubscriber: function() {
            var phone = $("#txtPhone").val();
            var mydata = JSON2.stringify({
                Phone: phone,
                UserModuleID: NewsLetter.config.UserModuleID,
                PortalID: NewsLetter.config.PortalID,
                UserName: NewsLetter.config.UserName,
                secureToken: SageFrameSecureToken
            });
            $.ajax({
                type: "POST",
                async: false,
                url: NewsLetter.config.baseURL + "SaveMobileSubscriber",
                data: mydata,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data) {
                    $("#txtPhone").val('');
                    $("#lblmessage").html(GetSystemLocale("Subscribed Successfully")).css({ "display": "block", "color": "green" });
                },
                error: function() {
                }
            });
        },
        GetSetting: function() {
            var param = JSON2.stringify({ UserModuleID: NewsLetter.config.UserModuleID, PortalID: NewsLetter.config.PortalID, UserName: SageFrameUserName });
            $.ajax({
                type: "POST",
                url: NewsLetter.config.baseURL + "GetNLSetting",
                data: param,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data) {
                    $.each(data.d, function(index, item) {
                        $("#header h3").html(item.ModuleHeader);
                        $("#header h5").html(item.ModuleDescription);
                        if (item.IsMobileSubscription == "false") {
                            $("#divRadios").hide();
                            $("#phoneSubscribe").hide();
                        }
                        $("#btnUnsubscibe").attr("href", item.UnSubscribePageName + PageExt);
                    });
                },
                error: function() {
                    //alert('error');
                }
            });
        }

    };
    NewsLetter.init();

    jQuery('input[name=rdbSubcribe]:radio').click(function() {
        var clickval = jQuery(this).val();
        if (clickval == 'ByEmail') {
            $('#divEmailSubsCribe').show();
            $('#phoneSubscribe').hide();
        }
        else if (clickval == 'ByPhone') {
            $('#divEmailSubsCribe').hide();
            $('#phoneSubscribe').show();
        }
    });
    $("#btnSubscribe").off().on("click", function(event) {
        //alert('');
        event.preventDefault();
        if ($('input:radio[value=ByEmail]').prop('checked') == true) {
            var email = $('#divEmailSubsCribe>#txtSubscribeEmail').val();
            var email_check = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;
            if (!email_check.test(email)) {
                $('#divSubscribe>#lblmessage').text(GetSystemLocale("Invalid Email")).css({ "display": "block", "color": "red" });
                return false;
            }
            else {
                NewsLetter.SaveEmailSubscriber();
                return true;
            }

        }
        else {
            if ($("#txtPhone").val() != "") {
                NewsLetter.SaveMobileSubscriber();
            }
            return true;
        }
    });

});

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}