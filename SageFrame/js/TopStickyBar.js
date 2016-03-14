$(function () {
    $(".sfLocalee").SystemLocalize();
    $('#imgAdmin').attr("src", SageFrameAppPath + "/Administrator/Templates/Default/images/admin-icon.png");
    $('#rdbEdit').attr("checked", true);
    $('span.sfPosition').hide();
    $('div.sfModule').append('<div class="sfClearDivTemp" style="clear:both"></div>');
    $('input[name="mode"]').on("click", function () {
        switch ($(this).attr("id")) {
            case "rdbEdit":
                $('div.sfModuleControl').show();
                $('span.sfPosition').hide();
                $('div.sfModule').append('<div class="sfClearDivTemp" style="clear:both"></div>');
                $('div.sfClearDivTemp').remove();
                $('div.sfWrapper').removeClass("sfLayoutmode");
                $('span.sfUsermoduletitle').hide();
                $('div.sfWrapper div').css("opacity", "1");
                break;
            case "rdbLayout":
                $('span.sfPosition').show();
                $('div.sfModuleControl').hide();
                $('div.sfModule').append('<div class="sfClearDivTemp" style="clear:both"></div>');
                var positions = $('div.sfWrapper');
                $.each(positions, function () {
                    $(this).addClass("sfLayoutmode");
                });
                $('div.sfLayoutmode div.sfModule').css("opacity", "0.5");
                $('span.sfUsermoduletitle').show();
                $('div.sfLayoutmode').hover(function () {
                    $(this).css("opacity", "1");
                    $(this).find("div.sfModule").css("opacity", "1");
                }, function () { $(this).find("div.sfModule").css("opacity", "0.5"); });
                break;
            case "rdbNone":
                $('div.sfModuleControl').hide();
                $('span.sfPosition').hide();
                $('div.sfClearDivTemp').remove();
                $('div.sfWrapper').removeClass("sfLayoutmode");
                $('span.sfUsermoduletitle').hide();
                $('div.sfWrapper div').css("opacity", "1");
                break;
        }
    });
    //        $(".signin").click(function(e) {
    //            e.preventDefault();
    //            $("div#signin_menu").toggle();
    //            $(".signin").toggleClass("menu-open");
    //        });
    //        $("div#signin_menu").mouseup(function() {
    //            return false
    //        });
    //        $(document).mouseup(function(e) {
    //            if ($(e.target).parent("a.signin").length == 0) {
    //                $(".signin").removeClass("menu-open");
    //                $("div#signin_menu").hide();
    //            }
    //        });

    $('.sfCpanel').on('click', function () {
        var divHeight = 0;
        if ($('#divCpanel').hasClass('On')) {
            // divHeight = parseInt($('.sfMiddle').height()) - parseInt($('#templateChangeWrapper').height());
            divHeight = -254;
            $('#divCpanel').removeClass('On').addClass('Off');
        }
        else {
            divHeight = 0;
            $('#divCpanel').removeClass('Off').addClass('On');
        }
        $('#divCpanel').animate({
            top: divHeight
        });
    });
    $('.myProfile').on('click', function () {
        if ($('.myProfileDrop').hasClass('Off')) {
            $('.myProfileDrop').removeClass('Off');
            $('.myProfileDrop').show();
        }
        else {
            $('.myProfileDrop').addClass('Off');
            $('.myProfileDrop').hide();
        }
    });
});