//-------------Global Variable begin------------------
var ajDropDown;
var sortid;
var pass1;
var profile;
var currentprofile;
var sarg;
var cout_tr = 1;
var $container;
var textin;
var ajgetListCategory;
var datefrom = "";
var buyfrom = "";
var selfrom = "";
var employeeid;
var ajHierarchy;
var menuItems;
var dir;
var contentwidth;
var timeout = 0;

//-------------Global Variable end------------------

//--------------------js General begin-----------------------

//-----------------General begin---------







$(document).ready(function ($) {
    $("head").find("#leftStyle").prop("disabled", true);

    $("#userDefault").find("#txt_s_Date").datepicker().datepicker('setDate', new Date()).datepicker();
    //    if (typeof (Storage) !== "undefined") {
    //        if (localStorage.clickcount) {
    //            localStorage.clickcount = Number(localStorage.clickcount) + 1;
    //        }
    //        else {
    //            localStorage.clickcount = 1;
    //        }
    //        alert("You have clicked the button " + localStorage.clickcount + " time(s).");
    //        //  alert("yes");
    //    }
    //    else {
    //        alert("no");
    //        // Sorry! No web storage support..
    //    }
    //    $(document).tooltip();
    var $con = $("#signin-form");
    //if ($con.find("#username").val().length > 0 && $con.fi nd("#password").val().length > 0) {
    userLogin("signin-form");
    //}
    $("#forgotPass").unbind("click").bind('click', function (event) {
        $("#forgot-form").toggle();
        $("#signin-form").toggle();
    })
    $("#btnForgotPassword").button().unbind("click").bind('click', function (event) {
        loginPasswordForgot();
    })
    $("#signin-form").find("#btn_Submit").button().unbind("click").bind('click', function (event) {
        userLogin("signin-form");
    })
    $("#ddl_m_Language").unbind("change").bind('change', function (event) {
        masterLocalize();
        localize();
    })


    $("#signin-form").find("#password").bind('keypress', function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13 && !$("#signin-form").find("#btn_Submit").is(":focus")) {
            $("#signin-form").find("#btn_Submit").focus(); //.trigger("click");
        }
    });
    //    $(".Shevron").live('mouseover', function (event) {
    //        //alert("out");
    //        $(this).removeClass().addClass("Shevron");
    //        $(this).removeClass().addClass("ShevronActive");
    //        //  alert("over");
    //    })
    // $('#switcher').themeswitcher();
    $("#divslider").unbind('click').live('click', function (event) {
        var $con = $(this).parent(".ui-tabs-panel");
        sliderClick("divBasic");
        sliderClick("moreFilter");
    });
    contentwidth = $(window).width() - 85;
    //    $("body").bind('keypress', function (e) {
    //        var code = (e.keyCode ? e.keyCode : e.which);
    //        if (code == 104) {
    //            getHelp();
    //        }
    //    });
    $("#a_help").unbind('click').bind('click', function () {
        getHelp();
    });

    if ($.browser.msie) {
        //  $("#dialogHelp").dialog({ width: 800, height: 500 }).dialog("open");
        alert("برای مشاهده بهتر از " + "\n Browser Chrome " + " یا " + " FireFox \n" + "استفاده کنید" + ".");
    }



});


function getHelp() {
    var mainTab = $("#mainTab").find(".top-nav").find(".ui-tabs-active").find("a").attr("mainTab");
    // var subTab = $("div:not([class='invisible'])").find("[subTab]").find(".ui-tabs-active").find("a").attr("id");
    var subTab = $("[aria-expanded='true']").find("[subTab]").find(".ui-tabs-active").find("a").attr("id");
    if (subTab == undefined && (mainTab == "a_FullAcountReport" || mainTab == "a_Accounting"))
        subTab = "store"
    else if (subTab == undefined && (mainTab != "a_FullAcountReport" || mainTab != "a_Accounting"))
        return alert("زیر منو انتخاب نشده است")
    var DTO = { 'mainTab': mainTab, 'subTab': subTab, 'lang': $lang.val() };
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: "Management/getHelp",
        success: function (response) {
            if (response.canEdit) {
                $("#dialogHelp").find("#help").html("<textarea class='editor' name='text1'>" + (response.isDone ? response.result : "") +
                "</textarea></n><button id='btnSaveHelp'>save</button>");
                $(".editor").tinymce({
                    // Location of TinyMCE script
                    script_url: '../../Scripts/tinymce/tiny_mce.js',
                    width: "100%",
                    height: "500px",
                    directionality: "rtl",
                    theme: "advanced",
                    verify_html: false,
                    plugins: "pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,autosave",
                    theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                    theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                    theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                    theme_advanced_buttons4: "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak,restoredraft,codehighlighting,netadvimage",
                    theme_advanced_toolbar_location: "top",
                    theme_advanced_toolbar_align: "right",
                    theme_advanced_statusbar_location: "bottom",
                    theme_advanced_resizing: false,
                    save_onsavecallback: function () { AddHelp(); },
                    // Example content CSS (should be your site CSS)
                    content_css: '../../Scripts/tinymce/css/content.css',
                    convert_urls: false
                });

                $("#btnSaveHelp").button().unbind('click').bind('click', function () {
                    AddHelp();
                });
            }
            else {
                $("#dialogHelp").html((response.isDone ? "<div style='padding-left:5em;'>" + response.result + "</div>" : ""));
            }
            $("#dialogHelp").dialog({ width: 800, height: 500 }).dialog("open");

        },
        error: function (response) { alert(response.responseText); }
    });
}
function AddHelp() {
    var mainTab = $("#mainTab").find(".top-nav").find(".ui-tabs-active").find("a").attr("mainTab");
    var subTab = $("div:not([class='invisible'])").find("[subTab]").find("[tabIndex='0']").find("a:visible:first").attr("id");
    if (subTab == undefined && (mainTab == "a_FullAcountReport" || mainTab == "a_Accounting"))
        subTab = "store"
    var DTO = { 'mainTab': mainTab, 'subTab': subTab, 'help': $("[name='text1']").val(), 'lang': $lang.val() };
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: "Management/addHelp",
        success: function (response) {
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}
$(document).on('propertychange keyup input paste', 'input.data_field', function () {
    var io = $(this).val().length ? 1 : 0;
    $(this).nextAll('.icon_clear').first().stop().fadeTo(100, io);
}).on('click', '.icon_clear', function () {
    $(this).delay(300).fadeTo(100, 0).prevAll(".data_field").first().val('');
});
$(document).on('error', function () { translate("error") });
function masterLocalize() {
    $.each($("[mllk]"), function () {
        var $this = $(this);
        if ($this.find(".ui-button-text").length > 0)
            $this.find(".ui-button-text").text(langs[$this.attr("mllk")][$("#ddl_m_Language").val()]);
        else {
            if (langs[$this.attr("mllk")] != undefined)
                $this.text(langs[$this.attr("mllk")][$("#ddl_m_Language").val()]);
        }
    });
}

function isAuthenticated(response) {
    if (response != null && response.isExpired) {
        $("#loginBox").dialog({ modal: true, autoOpen: false,
            buttons: { "ورود": function () { userLogin("loginBox"); } }
        }).dialog("open");
        return false;
    }
    return true;
}
function newSort(f, container, params) {
    if (container != undefined && params.container != "dialog")
        $con = $("#" + container);
    if (params.container != undefined && params.container == "dialog")
        $con = $("#" + params.container + container);
    $con.find('a[rel=sort]').die("click").live("click", function () {
        $con.find('a[rel=sort]').removeClass("sorted");
        $(this).addClass("sorted");
        if (this.id == sortid.split(' ')[0].toString()) {
            if (sortid.split(' ')[1] == "DESC") sortid = this.id + " ASC";
            else sortid = this.id + " DESC";
        }
        else {
            sortid = this.id + " DESC";
        }
        f(container, params);
    });
}

function Sort(f, container, fname) {
    if (container.container == undefined)
        $con = $("#" + container);
    else
        if (container.container != undefined && container.pagingContainer != undefined)
            $con = $("#" + container.container + container.pagingContainer);
        else
            $con = $("#" + container.container);
    $con.find('a[rel=sort]').die("click").live("click", function () {
        $con.find('a[rel=sort]').removeClass("sorted");
        $(this).addClass("sorted");
        if (this.id == sortid.split(' ')[0].toString()) {
            if (sortid.split(' ')[1] == "DESC")
                sortid = this.id + " ASC";
            else
                sortid = this.id + " DESC";
        }
        else {
            sortid = this.id + " DESC";
        }
        f(container, fname);
    });
}

function getfocusOnEnter(id) {

    if (event.keyCode == 13)
        document.getElementById(id).focus();
}





function userLogin(container) {
    var $con = $("#" + container);
    var DTO = { 'userName': $con.find("#username").val(), 'password': $con.find("#password").val() };
    $.ajax({
        type: "POST",
        url: "/Management/UserLogin",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {

            if (response.logged && container == "loginBox") {
                $(".fixed_elem").css("background-color", "#E4FFCC");
                if ($("#loginBox").dialog().dialog("isOpen"))
                    $("#loginBox").dialog("close");
                if ($("#empCode").val() != response.code) {
                    $("#signin-form").hide();
                    $("#userDefault").removeClass("hidden");
                    $("#lbl_d_UserName").html(response.name + " " + response.family);
                    var $shop = $("#userDefault").find("#ddl_s_Branch");
                    document.title = response.name + " " + response.family;
                    if (!response.isAdmin) {
                        bindItemsForSelectCombo({ servicename: "Management", methodname: "getShopNameByUser", headertext: "انتخاب شعبه", id: "ddl_s_Branch", container: "userDefault", selectedindex: 1, async: false });
                        $shop.change(function () {
                            if ($(this).val() != "")
                                bindItemsForSelectCombo({ servicename: "Management", methodname: "getCounterNameByUser", headertext: "انتخاب صندوق", id: "ddl_m_Counter", container: "userDefault" }, { arg: $shop.val() });
                        });
                        bindItemsForSelectCombo({ servicename: "Management", methodname: "getCounterNameByUser", headertext: "انتخاب صندوق", id: "ddl_m_Counter", container: "userDefault", selectedindex: 1 }, { arg: $shop.val() });
                        bindItemsForSelectCombo({ servicename: "Management", methodname: "getCurrencyName", headertext: "انتخاب ارز", id: "ddl_m_Currency", container: "userDefault", selectedindex: 1 });
                        $con.find("#username").val(""); $con.find("#password").val("");
                    }
                    location.reload(true);
                }
                return;
            }
            if (response.logged) {
                $(".fixed_elem").css("background-color", "#E4FFCC");
                $("#container").html("");
                $("body").remove("#container");
                $("#signin-form,#heading").hide();
                $("#signin").css("background", "none")
                $("#userDefault").removeClass("hidden");
                $("#empCode").val(response.code);
                $("#lbl_d_UserName").html(response.name + " " + response.family);
                var $shop = $("#userDefault").find("#ddl_s_Branch");
                document.title = response.name + " " + response.family;
                if (!response.isAdmin) {
                    bindItemsForSelectCombo({ servicename: "Management", methodname: "getShopNameByUser", headertext: "انتخاب شعبه", id: "ddl_s_Branch", container: "userDefault", selectedindex: 1, async: false });
                    $shop.change(function () {
                        if ($(this).val() != "")
                            bindItemsForSelectCombo({ servicename: "Management", methodname: "getCounterNameByUser", headertext: "انتخاب صندوق", id: "ddl_m_Counter", container: "userDefault" }, { arg: $shop.val() });
                    });
                    bindItemsForSelectCombo({ servicename: "Management", methodname: "getCounterNameByUser", headertext: "انتخاب صندوق", id: "ddl_m_Counter", container: "userDefault", selectedindex: 1 }, { arg: $shop.val() });
                    bindItemsForSelectCombo({ servicename: "Management", methodname: "getCurrencyName", headertext: "انتخاب ارز", id: "ddl_m_Currency", container: "userDefault", selectedindex: 1 });
                }
                GetMenuItems();
                GetSubMenuItems();
                // $("#tabs").tabs();
                SetHeight();

                //   getCurrentProfile();

                jQuery.fn.center = function () {
                    this.css("top", 24 + "px");
                    this.animate({ 'left': (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px" }, 100);
                    return this;
                }

                $("#userDefault").find("#an_m_SignOut").die("click").live('click', function (event) {
                    userSignOut(container);
                });
                setInterval(function () {
                    resetApp();
                }, 180000);
            }
            else {
                if (response.isSignout)
                    return;
                alert(response.errorMessage)
            }
        }
        //        ,
        //        error: function (response) {
        //            alert(response.responseText);
        //        }
    });
}



function userSignOut(container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        url: "/Account/LogOff",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            $("#signin-form").show();
            $("#userDefault").addClass("hidden");
            $("#lbl_d_UserName").html("");
            $("#lbl_d_UserName").html("");
            $con.find("#password").val("");
            $("#mainTab").tabs("destroy").html("");
            $("#rightMenuAccordion").html("");
            location.reload(true);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

$(document).ajaxStart(function () {
    // $("#spinner")
    $("#spinner").toggleClass("invisible").toggle();
    window.clearInterval(timeout);
});
$(document).ajaxStop(function () {
    timeout = setInterval(function () {
        resetApp();
    }, 180000);
    // $(document).tooltip().tooltip("destroy");
    //$("#spinner").toggleClass("invisible");
    $("#spinner").removeClass("ui-state-active").toggleClass("invisible").toggle();

    SetHeight();
    tableStyle();
    //$("thead tr").addClass("ui-widget-header");
    //  $(".ui-dialog thead tr").removeClass("ui-widget-header");
    // $("label").css("color", $(".ui-state-default").css("color"));
    localize();
    //    $('.ui-autocomplete').css({ 'left': 0 + 'px', 'top': 0 + 'px' });
    //    $("[id*='delete']").unbind("click").bind("click", function () { confirm("sometext"); })
    //    $('table').find('td:contains("null")').html($('table').find('td:contains("null")').html().replace("null", "-"));
    replaceNull();
    $('table').find('.digit').digits();
});
function tableStyle() {
    $('.tablescroll').addClass("red");
    $(".tablescroll_body > tbody > tr").addClass("ui-state-default");
    $(".tablescroll_body > tbody > tr").mouseover(function () { $(this).addClass("ui-state-hover"); });
    $(".tablescroll_body > tbody > tr").mouseout(function () { $(this).removeClass("ui-state-hover"); });
}
window.onresize = function (event) { SetHeight(); }

function SetHeight() {

    //    $('.mainmenu').height($(window).height() - 23);
    $('.mainbody').css("min-height", $(window).height() - 50);

}

function replaceNull() {
    $('table').find('td:contains("null")').each(function () {
        var $this = $(this);
        $this.html($this.html().replace("null", "-"))
    })
}







var resizeTimer;
function windowResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setModalInfoHeight, 600);

}

function sliderClick(id) {

    var src = ($('#pdToggleImage').attr("src") == "App_Themes/Default/Images/shevron_expand.gif")
                ? "App_Themes/Default/Images/shevron_collapse.gif"
                : "App_Themes/Default/Images/shevron_expand.gif";
    $('#pdToggleImage').attr("src", src);
    $("#" + id).slideToggle("fast");

}


function onRowClick($dis) {
    $('tr[id*="tr"]').removeClass("rowOnClick");
    $dis.addClass("rowOnClick");
}






//----------------------General end----------------------








//--------------------js quantity begin-----------------------




function bindSizeColor(size, color, Quantity, withQuantity, $con) {

    var table = "<table id='tbSizeColor_" + $con.prop("id") + "' name='SieColor' class='QuantityTable' title='orderDetail' ></table>";
    $con.html(table);
    var tbSizeColor = document.getElementById("tbSizeColor_" + $con.prop("id"))
    var tbo = document.createElement('tbody');
    var rowOnlySize = document.createElement('tr');
    var row0 = document.createElement('tr');
    var cell0 = document.createElement('td');
    var cell1 = document.createElement('td');
    var cell2 = document.createElement('td');
    var cell3 = document.createElement('td');
    tbSizeColor.appendChild(tbo);
    tbo.appendChild(rowOnlySize);
    tbo.appendChild(row0);
    rowOnlySize.appendChild(cell2);
    rowOnlySize.appendChild(cell3);
    row0.appendChild(cell1);
    row0.appendChild(cell0);
    var txtWithout = document.createElement('input');
    txtWithout.setAttribute("name", "quantity");
    txtWithout.setAttribute("id", "" + "-" + "");
    txtWithout.setAttribute("title", "بدون سایز و رنگ");
    cell0.appendChild(txtWithout);
    cell1.appendChild(document.createTextNode('   '));
    cell2.appendChild(document.createTextNode('   '));
    cell3.appendChild(document.createTextNode('   '));
    var sizeLength = size.length;


    if (sizeLength > 0) {

        for (var j = 0; j < sizeLength; j++) {
            var val = size[0, j];
            var text = val.Size;
            var value = (val.SizeId == undefined ? "" : val.SizeId);

            var tdOnlySize = document.createElement('td');
            var txtQuantity = document.createElement('input');
            txtQuantity.setAttribute("name", "quantity");
            txtQuantity.setAttribute("title", "بدون رنگ" + "_" + text);
            txtQuantity.setAttribute("id", "" + "-" + value);
            tdOnlySize.appendChild(txtQuantity);
            rowOnlySize.appendChild(tdOnlySize);
            var td = document.createElement('td');
            td.setAttribute("id", "cell");
            var txtSize = document.createElement('input');
            txtSize.setAttribute("value", text);
            txtSize.setAttribute("name", value);
            txtSize.setAttribute("title", text);
            txtSize.setAttribute("id", "txtSize" + (j * 1));
            td.appendChild(txtSize);
            row0.appendChild(td);
        }
    }
    if (color.length > 0) {
        var colorLength = color.length;
        for (var j = 0; j < colorLength; j++) {

            var val = color[0, j];
            var text = val.Color;
            var value = val.ColorId == undefined ? "" : val.ColorId;
            var tr = document.createElement('tr');
            tr.setAttribute("id", "row" + (j * 1));
            tbo.appendChild(tr);
            var tdOnlyColor = document.createElement('td');
            tdOnlyColor.setAttribute("id", "cell" + j);
            var txtQuantity = document.createElement('input');
            txtQuantity.setAttribute("name", "quantity");
            txtQuantity.setAttribute("title", text + "_" + "بدون سایز");
            txtQuantity.setAttribute("id", value + "-" + "");
            tdOnlyColor.appendChild(txtQuantity);
            tr.appendChild(tdOnlyColor);
            var td = document.createElement('td');
            td.setAttribute("id", "cell" + j);
            var txtColor = document.createElement('input');
            txtColor.style.backgroundColor = text;
            txtColor.setAttribute("id", "txtColor" + (j * 1) + 1);
            txtColor.setAttribute("value", text);
            txtColor.setAttribute("name", value);
            txtColor.setAttribute("title", text);
            td.appendChild(txtColor);
            tr.appendChild(td);
            for (var k = 0; k < size.length; k++) {
                var valSize = size[0, k];
                var textSize = valSize.Size == undefined ? "" : valSize.Size;
                var valueSize = valSize.SizeId == undefined ? "" : valSize.SizeId;
                var td = document.createElement('td');
                td.setAttribute("id", "cell" + k);
                var txtQuantity = document.createElement('input');
                txtQuantity.setAttribute("name", "quantity");
                txtQuantity.setAttribute("title", text + "_" + textSize);
                txtQuantity.setAttribute("id", value + "-" + valueSize);
                td.appendChild(txtQuantity);
                tr.appendChild(td);
            }
        }
    }
    //        if (!withQuantity) {
    //            $con.find("table[id*=tbSizeColor]").find("input[name=quantity]").spinner({
    //                stop: function () {
    //                    SumWholesale($con.prop("id"));
    //                }
    //            });
    //        } 
}

function readItemDetailQuantitys(id, container) {
    if (container != undefined)
        $con = $("#" + container).find("#" + id);
    else
        $con = $("#" + id);
    var orderDetailArray = [];
    $con.find("input[name=quantity]").each(function () {
        if (this.value != "") {
            var ItemDetail = {};
            var OrderItemDetail = {};
            ItemDetail = (this.id).split("-");
            OrderItemDetail["ColorID"] = ItemDetail[0];
            OrderItemDetail["SizeID"] = ItemDetail[1];
            OrderItemDetail["Quantity"] = this.value;
            orderDetailArray.push(OrderItemDetail);
            OrderItemDetail = null;
        }
    });
    return orderDetailArray;
}
function getTotalQuantity(id, container) {
    if (container != undefined)
        $con = $("#" + container).find("#" + id);
    else
        $con = $("#" + id);
    var quantity = 0;
    $con.find("input[name='quantity']").each(function () {
        if (this.value != "") {

            quantity += (this.value * 1);
        }
    });
    return quantity;
}
//--------------------js quantity end-----------------------





//------------------OnlineStore begin------------------------
var CategoryzTree;

function loadOnlineCategories(container, first) {
    var $con = $("#" + container);
    if (first) {

        $con.find("#treeDemo").attr('id', "treeDemo" + container);
        var id = "treeDemo" + container;
        $.fn.zTree.init($con.find("#" + id), Categorysetting);
        CategoryzTree = $.fn.zTree.getZTreeObj(id);
        $con.find("#btn_Refresh").off().on('click', function () {
            $.fn.zTree.init($con.find("#" + id), Categorysetting);
            CategoryzTree = $.fn.zTree.getZTreeObj(id);
        })

        $con.find("#btn_saveCategory").off().on('click', function () {
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });

        $con.find("#editDialog").attr("id", "editDialog" + container);
        $("#toggle").button().click(function () {
            if ($("#accordion").accordion("option", "icons")) {
                $("#accordion").accordion("option", "icons", null);
            } else {
                $("#accordion").accordion("option", "icons", icons);
            }
        });

        var icons = {
            header: "ui-icon-circle-arrow-e",
            activeHeader: "ui-icon-circle-arrow-s"
        };
        $con.find("#accordion").accordion({
            icons: icons,
            heightStyle: "content", collapsible: true, active: false,
            change: function (event, ui) {
                if (ui.newContent.length > 0 && ui.newContent.html().length < 1) {
                    var CategoryId = $(ui.newHeader).attr("categoryId");
                    BuildCategoriesAccordion(CategoryId, $con.find("#accContent" + CategoryId), $con, false);
                }
            }
        }).sortable({
            axis: "y",
            //handle: "h3",
            stop: function (event, ui) {
                // IE doesn't register the blur when sorting
                // so trigger focusout handlers to remove .ui-state-focus
                ui.item.children("h3").triggerHandler("focusout");
                SortCategories(ui.item, $con)
            }
        });

        $con.find('#frm_Category').ajaxForm({
            success: function (response) {
                if (response.isdone) {
                    if (response.isEdit) {
                        CategoryEditTreeNode(response.name, response.isCheck, response.id);
                        //                        $("#hi_isEdit").val(false);
                        //                        $("#hi_SelectedParentCatId").val("");
                    }
                    else {
                        var node = { 'name': response.name, 'id': response.id, 'isChecked': response.isCheck };
                        categoryaddNewTreeNode(node);
                        //                        $("#hi_isEdit").val(false);
                        //                        $("#hi_SelectedParentCatId").val("");
                    }
                }
                else
                    alert(response.msg);
            },
            complete: function (xhr) {

            }
        });

    }
    localize();
}



var Categorysetting = {
    view: {
        addHoverDom: CategoryaddHoverDom,
        removeHoverDom: CategoryremoveHoverDom,
        fontCss: CategorygetFont,
        nameIsHTML: true
    },
    edit: {
        enable: true,
        showRenameBtn: false
    },
    check:
    {
        enable: true
    },
    data: {
        simpleData: {
            enable: true
        },
        key:
        {
            checked: "isChecked"
        }

    },
    async: {
        enable: true,
        url: "Hierarchy/GetTreeData",
        autoParam: ["id", "name"],
        otherParam: { "name": "categories" }

    },

    callback: {
        //        onRightClick: CategoryOnRightClick,
        beforeDrag: CategorybeforeDrag,
        onClick: categoryonClick,
        //        beforeDrop: beforeDrop,
        onAsyncSuccess: CategoryonAsyncSuccess,
        onCheck: categoryonCheck,
        onRename: categoryonRename,
        beforeRemove: categorybeforeRemove,
        beforeEditName: categorybeforeEditName,
        onDblClick: categoryonDblClick,
        onDrop: categoryOnDrop
    }
};

function CategorygetFont(treeId, node) {
    return node.font ? node.font : {};
}

function CategoryonAsyncSuccess(event, treeId, treeNode, msg) {
    var container = "frm_Category";
    var $con = $("#" + container);
    $con.find(".zTreeDemoBackground li:even").css("background-color", "#FFFFFF");
    $con.find(".zTreeDemoBackground li:odd").css("background-color", "#E6F2FF");

}
function CategorybeforeDrag(treeId, treeNodes) {
    for (var i = 0, l = treeNodes.length; i < l; i++) {
        if (treeNodes[i].drag === false) {
            return false;
        }
    }
    return true;
}
function categoryOnDrop(event, treeid, treeNodes, targetNode, moveType) {

    var list = [];
    for (var i = 0; i < treeNodes.length; i++) {
        list[i] = treeNodes[i].id;
    }
    var children = [];
    var c;
    if (targetNode) {
        if (targetNode.children == undefined)
            if (targetNode.getParentNode() != null) {
                c = targetNode.getParentNode().children;
                $.each(c, function () {
                    children.push(this.id);
                });
            }
            else {
                var nodes = CategoryzTree.getNodesByFilter(filterzTree);
                $.each(nodes, function () {
                    children.push(this.id);
                });
            }

        else {
            c = targetNode.children;
            $.each(c, function () {
                children.push(this.id);
            });
        }
    }
    else {
        var nodes = CategoryzTree.getNodesByFilter(filterzTree);
        $.each(nodes, function () {
            children.push(this.id);
        });
    }

    var DTO = { 'TableName': 'category', 'TargetId': targetNode == null ? null : (moveType == "inner" ? targetNode.id : targetNode.getParentNode() == null ? null : targetNode.getParentNode().id), 'treeNodes': list, 'children': children };
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/TreeDaragDrop",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (response.isdone)
                alert(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });

}
function categoryonClick(event, treeId, treeNode) {
    var container = "frm_Category";
    var $con = $("#" + container);
    $con.find("#hi_isEdit").val(true);
    $con.find("#hi_SelectedParentCatId").val(treeNode.id);
    GetCategoryForEdit(treeNode.id);
    $con.find("#btn_saveCategory").button({ icons: {
        primary: "ui-icon-disk"
    },
        text: true,
        label: "edit"
    });
    localize();
}

function categorybeforeRemove(treeId, treeNode) {
    var container = "frm_Category";
    var $con = $("#" + container);
    var isdone = false;
    if (confirm("Confirm delete node '" + treeNode.name + "' it?")) {
        var id = treeNode.id;
        var DTO = { 'TableName': 'category', 'id': id };
        $.ajax({
            type: "POST",
            async: false,
            url: "Management/DeleteTree",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                isdone = response.isdone;
                $con.find("#hi_isEdit").val(true);
                $con.find("#hi_SelectedParentCatId").val(treeNode.id);
                GetCategoryForEdit(treeNode.id);
                $con.find("#btn_saveCategory").button({ icons: {
                    primary: "ui-icon-disk"
                },
                    text: true,
                    label: "add"
                });
            },
            error: function (response) { alert(response.responseText); }
        });
    }
    return isdone;
}

function categorybeforeEditName(treeId, treeNode, newName, isCancel) {
    var container = "frm_Category";
    var $con = $("#" + container);
    $con.find("#hi_isEdit").val(true);
    $con.find("#hi_SelectedParentCatId").val(treeNode.id);
    GetCategoryForEdit(treeNode.id);
    CategoryzTree.selectNode(treeNode);
    return false;
}

function categoryonRename(e, treeId, treeNode, isCancel) {
    var container = "frm_Category";
    var $con = $("#" + container);
    $con.find("#hi_isEdit").val(true);
    $con.find("#hi_SelectedParentCatId").val(treeNode.id);
    GetCategoryForEdit(treeNode.id);
}

function CategoryremoveHoverDom(treeId, treeNode) {
    var container = "frm_Category";
    var $con = $("#" + container);
    $con.find("#addBtn_" + treeNode.tId).unbind().remove();
};

function CategoryaddHoverDom(treeId, treeNode) {
    var container = "frm_Category";
    var $con = $("#" + container);
    var sObj = $con.find("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $con.find("#addBtn_" + treeNode.tId).length > 0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $con.find("#addBtn_" + treeNode.tId);
    if (btn) btn.bind("click", function () {
        $con.find("#btn_saveCategory").button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true,
            label: "add"
        });
        localize();
        $con.find("#hi_isEdit").val(false);
        $con.find("#hi_SelectedParentCatId").val(treeNode.id);
        $con.find("#txt_name").val("");
        $con.find("#txt_quantity").val("");
        $con.find("#txt_description").val("");
        $con.find("#chk_ShowCategory").attr('checked', false);
        CategoryzTree.selectNode(treeNode);
        return false;
    });
};


function categoryonDblClick(event, treeId, treeNode) {
    var container = "frm_Category";
    var $con = $("#" + container);
    $con.find("#hi_isEdit").val(false);
    $con.find("#hi_SelectedParentCatId").val("0");
    $con.find("#txt_name").val("");
    $con.find("#txt_quantity").val("");
    $con.find("#txt_description").val("");
    $con.find("#chk_ShowCategory").attr('checked', false);
    $con.find("#btn_saveCategory").button({ icons: {
        primary: "ui-icon-disk"
    },
        text: true,
        label: "addroot"
    });
    CategoryzTree.cancelSelectedNode(treeNode);
    localize();
}



function CategoryEditTreeNode(name, isChecked, id) {
    var node = CategoryzTree.getSelectedNodes()[0];
    node.name = name;
    node.isChecked = isChecked;
    CategoryzTree.updateNode(node);
}

function categoryaddNewTreeNode(newNode) {
    if (CategoryzTree.getSelectedNodes()[0] && ($("#hi_SelectedParentCatId").val() != "0" && $("#hi_SelectedParentCatId").val() != "")) {
        $("#hi_SelectedParentCatId").val(CategoryzTree.getSelectedNodes()[0].id);
        newNode.checked = CategoryzTree.getSelectedNodes()[0].checked;
        CategoryzTree.addNodes(CategoryzTree.getSelectedNodes()[0], newNode);
    } else {
        CategoryzTree.addNodes(null, newNode);
    }
}


function categoryonCheck(event, treeId, treeNode) {
    var id = treeNode.id;
    var DTO = { 'tableName': 'category', 'Id': id, 'show': treeNode.isChecked };
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/ChangeshowTreeNodeRec",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (response.isdone) {
                alert(response.msg);
            }
        },
        error: function (response) { alert(response.responseText); }
    });
}

function GetCategoryForEdit(categoryId) {
    var DTO = { 'TableName': 'Category', 'Id': categoryId };
    var container = "div_Details";
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/getTreeItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            var show = response.ShowOnline != null ? response.ShowOnline : false;
            $("#txt_name").val(response.Category);
            $("#txt_quantity").val(response.Quantity);
            $("#txt_description").val(response.Description);
            $("#hi_SelectedParentCatId").val(response.CategoryId);
            $("#chk_ShowCategory").attr('checked', response.ShowOnline);
        },
        error: function (response) { alert(response.responseText); }
    });
}


//----------------online menu begin
var onlineMenuzTree;

function loadOnlineMenu(container, first) {
    $con = $("#" + container);
    if (first) {

        $con.find("#treeDemo").attr('id', "treeDemo" + container);
        var id = "treeDemo" + container;
        $.fn.zTree.init($con.find("#" + id), OnlineMenusetting);
        onlineMenuzTree = $.fn.zTree.getZTreeObj(id);
        $con.find("#btn_Refresh").off().on('click', function () {
            $.fn.zTree.init($con.find("#" + id), OnlineMenusetting);
            onlineMenuzTree = $.fn.zTree.getZTreeObj(id);
        })



        $con.find("#dialogAddMenu").attr("id", "dialogAddMenu" + container);
        var $dialog = $con.find("#dialogAddMenu" + container);
        $con.find("#btn_new").button({
            icons: {
                primary: "ui-icon-plusthick"
            }
        }).unbind().click(function () {
            $dialog.find("#ddl_m_MenuLocation").val("side");
            $dialog.find("#btn_save").button({
                icons: {
                    primary: "ui-icon-disk"
                }
            }).unbind().click(function () {
                //                if (validateAll( $con.find("#dialogAddMenu")))
                AddMenu($dialog, container, null);
            });

            $dialog.dialog(open).dialog({ width: 500 });
        });
        if ($dialog.find("#ddl_m_IsLink").prop("checked"))
            $dialog.find("#liTxtLinkTo").toggleClass("hidden")
        $dialog.find("#ddl_m_IsLink").change(function () {
            $dialog.find("#liTxtLinkTo").toggleClass("hidden")
        })

        $con.find("#btn_newBottom").button({
            icons: {
                primary: "ui-icon-plusthick"
            }
        }).unbind().click(function () {
            $dialog.find("#ddl_m_MenuLocation").val("bottom");
            $dialog.find("#btn_save").button({
                icons: {
                    primary: "ui-icon-disk"
                }
            }).unbind().click(function () {
                //                if (validateAll( $con.find("#dialogAddMenu")))
                AddMenu($dialog, container, null);
            });
            $dialog.dialog(open).dialog({ width: 500 });
        });

        $con.find("#btn_saveOnlineMenu").off().on('click', function () {
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });

        $con.find("#chk_islink").unbind('change').change(function () {
            if (this.checked)
                $con.find("#txta_linkTo").prop('disabled', false);
            else {
                $con.find("#txta_linkTo").prop('disabled', true);
                $con.find("#txta_linkTo").val('');
            }
        });

        $con.find('#frm_OnlineMenu').ajaxForm({
            // target: '#fileInput',
            success: function (response) {
                if (response.isDone) {
                    //                    $("#hi_SelectedParentAccId").val("0");
                    //                $("#div_Details").addClass("hidden");
                    if (response.isEdit) {
                        OnlineMenuEditTreeNode(response.name, response.isCheck, response.id);
                    }
                    else {
                        var node = { 'name': response.name, 'id': response.id, 'isChecked': response.isCheck };
                        OnlineMenuaddNewTreeNode(node);
                    }
                    //                    translate(response.msg);
                }
                else
                    alert(response.msg);
            },
            complete: function (xhr) {

            }
        });

        localize();

    }
}


var OnlineMenusetting = {
    view: {
        addHoverDom: OnlineMenuaddHoverDom,
        removeHoverDom: OnlineMenuremoveHoverDom,
        fontCss: onlineMenugetFont,
        nameIsHTML: true
    },
    edit: {
        enable: true,
        showRenameBtn: false
    },
    check:
    {
        enable: true
    },
    data: {
        simpleData: {
            enable: true
        },
        key:
        {
            checked: "isChecked"
        }

    },
    async: {
        enable: true,
        url: "Hierarchy/GetTreeData",
        autoParam: ["id", "name"],
        otherParam: { "name": "Menu" }

    },

    callback: {
        //        onRightClick: CategoryOnRightClick,
        beforeDrag: OnlineMenubeforeDrag,
        onClick: onlineMenuClick,
        //        beforeDrop: beforeDrop,
        onAsyncSuccess: onlineMenuonAsyncSuccess,
        onCheck: OnlineMenuonCheck,
        onRename: OnlineMenuonRename,
        beforeRemove: OnlineMenubeforeRemove,
        beforeEditName: OnlineMenubeforeEditName,
        onDblClick: OnlineMenuonDblClick,
        onDrop: OnlineMenuOnDrop
    }
};

function onlineMenugetFont(treeId, node) {
    return node.font ? node.font : {};
}

function onlineMenuonAsyncSuccess(event, treeId, treeNode, msg) {
    var container = "frm_OnlineMenu";
    var $con = $("#" + container);
    $con.find(".zTreeDemoBackground li:even").css("background-color", "#FFFFFF");
    $con.find(".zTreeDemoBackground li:odd").css("background-color", "#E6F2FF");

}

function OnlineMenubeforeDrag(treeId, treeNodes) {
    for (var i = 0, l = treeNodes.length; i < l; i++) {
        if (treeNodes[i].drag === false) {
            return false;
        }
    }
    return true;
}

function OnlineMenuaddHoverDom(treeId, treeNode) {
    var container = "frm_OnlineMenu";
    var $con = $("#" + container);
    var sObj = $con.find("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $con.find("#addBtn_" + treeNode.tId).length > 0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $con.find("#addBtn_" + treeNode.tId);
    if (btn) btn.bind("click", function () {
        $con.find("#btn_saveOnlineMenu").button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true,
            label: "add"
        });
        localize();
        $con.find("#hi_isEdit").val(false);
        $con.find("#hi_SelectedParentMenuId").val(treeNode.id);
        $con.find("#txt_Menuname").val("");
        $con.find("#chk_islink").prop("checked", false);
        $con.find("#txta_linkTo").val("");
        $con.find("#select_menuLocation").val(-1);
        $con.find("#txt_order").val("");
        $con.find("#txt_lang").val("");
        $con.find("#chk_newPage").prop("checked", false);
        $con.find("#chk_Show").prop("checked", false);
        onlineMenuzTree.selectNode(treeNode);
        return false;
    });
};


function onlineMenuClick(event, treeId, treeNode) {
    var container = "frm_OnlineMenu";
    var $con = $("#" + container);
    $con.find("#hi_isEdit").val(true);
    $con.find("#hi_SelectedParentMenuId").val(treeNode.id);
    GetOnlineMenuForEdit(treeNode.id);
    $con.find("#btn_saveOnlineMenu").button({ icons: {
        primary: "ui-icon-disk"
    },
        text: true,
        label: "edit"
    });
    localize();
}


function GetOnlineMenuForEdit(menuId) {
    var container = "frm_OnlineMenu";
    var $con = $("#" + container);
    var DTO = { 'TableName': 'onlineMenu', 'lang': "per", 'Id': menuId };
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/getTreeItem",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            $con.find("#txt_Menuname").val(response.menuName);
            $con.find("#chk_islink").prop('checked', response.isLink == "true" ? true : false);
            $con.find("#chk_Show").prop('checked', response.show == "true" ? true : false);
            $con.find("#txta_linkTo").html(response.linkTo);
            $con.find("#chk_newPage").prop('checked', response.newPage == "true" ? true : false);
            $con.find("#select_menuLocation").val(response.menuLocation == "side" ? 0 : 1);
            $con.find("#txt_order").val(response.order);
            $con.find("#txt_lang").val(response.lang);
            $con.find("#hi_SelectedParentMenuId").val(response.id);
            if (!response.isRoot) {
                $con.find("#select_menuLocation").html("");
                $con.find("#select_menuLocation").prop('disabled', true);
            }
            else {
                if ($con.find("#select_menuLocation").html() == "") {
                    $con.find("#select_menuLocation").html('<option value="0">side</option><option value="1">bottom</option>');
                    $con.find("#select_menuLocation").prop('disabled', false);
                }

            }
        },
        error: function (response) { alert(response.responseText); }
    });
}


function filterzTree(node) {
    return (node.level == 0);
}
function OnlineMenuOnDrop(event, treeid, treeNodes, targetNode, moveType) {
    var list = [];
    for (var i = 0; i < treeNodes.length; i++) {
        list[i] = treeNodes[i].id;
    }
    var children = [];
    var c;
    if (targetNode) {
        if (targetNode.children == undefined)
            if (targetNode.getParentNode() != null) {
                c = targetNode.getParentNode().children;
                $.each(c, function () {
                    children.push(this.id);
                });
            }
            else {
                var nodes = onlineMenuzTree.getNodesByFilter(filterzTree);
                $.each(nodes, function () {
                    children.push(this.id);
                });
            }

        else {
            c = targetNode.children;
            $.each(c, function () {
                children.push(this.id);
            });
        }
    }
    else {
        var nodes = onlineMenuzTree.getNodesByFilter(filterzTree);
        $.each(nodes, function () {
            children.push(this.id);
        });
    }

    var DTO = { 'TableName': 'onlineMenu', 'TargetId': targetNode == null ? null : (moveType == "inner" ? targetNode.id : targetNode.getParentNode() == null ? null : targetNode.getParentNode().id), 'treeNodes': list, 'children': children };
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/TreeDaragDrop",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (response.isdone)
                alert(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });

}


function OnlineMenubeforeRemove(treeId, treeNode) {
    var container = "frm_OnlineMenu";
    var $con = $("#" + container);
    var isdone = false;
    if (confirm("Confirm delete node '" + treeNode.name + "' it?")) {
        var id = treeNode.id;
        var DTO = { 'TableName': 'onlineMenu', 'id': id };
        $.ajax({
            type: "POST",
            async: false,
            url: "Management/DeleteTree",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                isdone = response.isdone;
                $con.find("#hi_isEdit").val(false);
                $con.find("#hi_SelectedParentMenuId").val("0");
                $con.find("#btn_saveOnlineMenu").button({ icons: {
                    primary: "ui-icon-disk"
                },
                    text: true,
                    label: "add"
                });
                alert(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });
    }
    return isdone;
}

function OnlineMenubeforeEditName(treeId, treeNode, newName, isCancel) {
    var container = "frm_OnlineMenu";
    var $con = $("#" + container);
    $con.find("#hi_isEdit").val(true);
    $con.find("#hi_SelectedParentMenuId").val(treeNode.id);
    GetCategoryForEdit(treeNode.id);
    onlineMenuzTree.selectNode(treeNode);
    return false;
}
function OnlineMenuonRename(e, treeId, treeNode, isCancel) {
    var container = "frm_OnlineMenu";
    var $con = $("#" + container);
    $con.find("#hi_isEdit").val(true);
    $con.find("#hi_SelectedParentMenuId").val(treeNode.id);
    GetCategoryForEdit(treeNode.id);
}

function OnlineMenuremoveHoverDom(treeId, treeNode) {
    var container = "frm_OnlineMenu";
    var $con = $("#" + container);
    $con.find("#addBtn_" + treeNode.tId).unbind().remove();
};

function OnlineMenuonDblClick(event, treeId, treeNode) {
    var container = "frm_OnlineMenu";
    var $con = $("#" + container);
    $con.find("#hi_isEdit").val(false);
    $con.find("#hi_SelectedParentMenuId").val("0");
    $con.find("#txt_Menuname").val("");
    $con.find("#chk_islink").prop("checked", false);
    $con.find("#txta_linkTo").val("");
    $con.find("#select_menuLocation").val(-1);
    $con.find("#txt_order").val("");
    $con.find("#txt_lang").val("");
    $con.find("#chk_newPage").prop("checked", false);
    $con.find("#chk_Show").prop("checked", false);
    $con.find("#btn_saveOnlineMenu").button({ icons: {
        primary: "ui-icon-disk"
    },
        text: true,
        label: "addroot"
    });
    onlineMenuzTree.cancelSelectedNode(treeNode);
    localize();
}

function OnlineMenuEditTreeNode(name, isChecked, id) {
    var node = onlineMenuzTree.getSelectedNodes()[0];
    node.name = name;
    node.isChecked = isChecked;
    onlineMenuzTree.updateNode(node);
}

function OnlineMenuaddNewTreeNode(newNode) {
    var container = "frm_OnlineMenu";
    var $con = $("#" + container);
    if (onlineMenuzTree.getSelectedNodes()[0] && ($con.find("#hi_SelectedParentMenuId").val() != "0" && $con.find("#hi_SelectedParentMenuId").val() != "")) {
        $con.find("#hi_SelectedParentMenuId").val(onlineMenuzTree.getSelectedNodes()[0].id);
        newNode.checked = onlineMenuzTree.getSelectedNodes()[0].checked;
        onlineMenuzTree.addNodes(onlineMenuzTree.getSelectedNodes()[0], newNode);
    } else {
        onlineMenuzTree.addNodes(null, newNode);
    }
}

function OnlineMenuonCheck(event, treeId, treeNode) {
    var id = treeNode.id;
    var DTO = { 'tableName': 'onlineMenu', 'Id': id, 'show': treeNode.isChecked };
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/ChangeshowTreeNodeRec",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (response.isdone) {
                alert(response.msg);
            }
        },
        error: function (response) { alert(response.responseText); }
    });
}


function SortOnlineMenu($this, $con) {
    var sortOnlineMenus = [];
    var priority = 1;
    $this.parent("div").children("h3").each(function () {
        var sortOnlineMenu = {};
        sortOnlineMenu["id"] = $(this).attr("onlineMenuId");
        sortOnlineMenu["Priority"] = priority;
        priority++;
        sortOnlineMenus.push(sortOnlineMenu);
    })
    var DTO = { 'sortOnlineMenu': sortOnlineMenus };
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/SortOnlineMenu",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {

        },
        error: function (response) { alert(response.responseText); }
    });
}
//function GetOnlineMenuForEdit($dis, container) {
//    var $con = $("#" + container);
//    $("#dialogAddMenu" + container).dialog().dialog("destroy");
//    var $row = $dis.parents("h3");
//    var id = $row.attr("onlineMenuId");
//    var $con = $("#" + container);
//    $con.find("#btn_save").button({
//        icons: {
//            primary: "ui-icon-disk"
//        }
//    }).unbind().click(function () {
//        if (validateAll($con.find("#dialogAddExpense")))
//            EditOnlineMenu(id, $("#dialogAddMenu" + container), container);
//    });
//    if ($row.find("[name=isLink]").attr("isChcked") == "true")
//        $con.find("#liTxtLinkTo").removeClass("hidden")
//    else
//        $con.find("#liTxtLinkTo").addClass("hidden")
//    $con.find("#txtMenuName").val($row.find("[name=menuName]").html());
//    $con.find("#ddl_m_IsLink").prop("checked", ($row.find("[name=isLink]").attr("isChcked") == "true"));
//    $con.find("#ddl_m_Show").prop("checked", ($row.find("[name=show]").attr("isChcked") == "true"));
//    $con.find("#ddl_m_newPage").prop("checked", ($row.find("[name=newPage]").attr("isChcked") == "true"));
//    $con.find("#txtLinkTo").val($row.find("[name=linkTo]").html());
//    $con.find("#dialogAddMenu" + container).dialog({ autoOpen: true });
//}
function EditOnlineMenu(id, $dialog, container) {
    var $con = $dialog;
    var DTO = { 'menuId': id, 'menuName': $con.find("#txtMenuName").val(), 'isLink': $con.find("#ddl_m_IsLink").prop("checked"),
        'menuLocation': $con.find("#ddl_m_MenuLocation").val(), 'linkTo': $con.find("#txtLinkTo").val(), 'show': $con.find("#ddl_m_Show").prop("checked"), 'lang': $lang.val(), 'newPage': $con.find("#ddl_m_newPage").prop("checked")
    };
    $.ajax({
        type: "POST",
        data: JSON.stringify(DTO),
        url: "Management/EditMenu",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response != null && response.isDone == "true") {
                alert(response.isDone);
                BuildOnlineMenuAccordion(null, $("#" + container).find("#accordion,#accordionBottom"), $("#" + container), true);
            }
            translate(response.msg);
        },
        error: function (response) {
            alert(response.responseText);

        }
    });
}




function AddMenu($dialog, container, $this) {
    var $con = $dialog;
    var parentId = null;
    if ($this != undefined)
        parentId = $this.attr("onlineMenuId");
    var DTO = { 'menuName': $con.find("#txtMenuName").val(), 'isLink': $con.find("#ddl_m_IsLink").prop("checked"),
        'menuLocation': $con.find("#ddl_m_MenuLocation").val(), 'linkTo': $con.find("#txtLinkTo").val(),
        'show': $con.find("#ddl_m_Show").prop("checked"), 'lang': $lang.val(),
        'newPage': $con.find("#ddl_m_newPage").prop("checked"), 'parentId': parentId
    };
    $.ajax({
        type: "POST",
        data: JSON.stringify(DTO),
        url: "Management/AddMenu",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isDone) {
                if (parentId != null)
                    $this.parents("h3").trigger("click");
                else
                    BuildOnlineMenuAccordion(null, $("#" + container).find("#accordion,#accordionBottom"), $("#" + container), true);
            }
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}




function DeleteMenu($this, container) {
    var $con = $("#" + container);

    var DTO = { 'menuId': $this.attr("onlineMenuId") };
    $.ajax({
        type: "POST",
        url: "Management/DeleteMenu",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response != null && response.isDone == true)
                $this.parents("h3").remove();
            translate(response.msg);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}


//-----------------online menu end----



function loadMenuPhotos(menuId, container, first) {

    var $con = $("#" + container);
    if (first) {
        $con.find("#fileInput").button();
        $con.find("#menuId").val(menuId);
        $con.find("#btn_Submit").button().unbind('click').click(function () {
            // if (validateAll($("#" + container)))
            ajaxFileUpload({ container: container, id: menuId, isMenu: true, size: $con.find("#txt_m_Size").val() });
        });
        getMenuPhotos(menuId, container);
    }
}

function getMenuPhotos(menuId, container) {
    var $con = $("#" + container);
    var ItemList = "";
    $.ajax({
        type: "POST",
        url: "Management/getMenuPhotos",
        contentType: "application/json; charset=utf-8",
        data: "{ menuId:'" + menuId + "'}",
        success: function (response) {

            if (!isAuthenticated(response))
                return;
            if (!response.hasPhoto)
                return response.msg;
            var List = (typeof response.result) == 'string' ? eval('(' + response.result + ')') : response.result;
            var appName = response.appName;
            if (appName == "/")
                appName = "";
            var ItemList = "<table id='sortable' >";
            if (List != null)
                for (var i = 0; i < List.length; i++) {
                    var val = List[0, i];
                    ItemList += "<tr style='float:none; padding:0 0 30px;' class='cleaner' id='li" + i + "' ><td><div class='modalClose modalRemove'><a href='javascript:RemoveMenuPhoto(\"" + container + "\",\"li" + i + "\",\"" + menuId + "\");'/></div><img style='border:1px;'  title='" + val + "' alt='" + val + "' src='Data/" + appName + "MenuPhotos/" + val + "' /></td></tr><tr id='li" + i + "'><td><span source='" + "../../../Data/" + appName + "MenuPhotos/" + val + "' name='sourceName'></span></td></tr>";
                }
            ItemList += "</table>";
            $con.find("#div_d_PhotoList").html(ItemList);
            $con.find("[name='sourceName']").each(function () {
                $(this).html($(this).attr("source"));
            });
            // $con.find("[name='sourceName']").html($(this).prev().attr("src"));
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}



function RemoveMenuPhoto(container, liId, menuId) {
    //  var barcode = alt.split('/')[0];
    var $con = $("#" + container);
    var alt = $con.find("#" + liId).find("img").attr("alt");
    var DTO = { 'fileName': alt, 'menuId': menuId };
    var ItemList = "";
    $.ajax({
        type: "POST",
        url: "Management/deleteMenuPhoto",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isDone) {
                $con.find("#sortable tr[id='" + liId + "']").remove();
            }
            else
                alert(response.msg)
        },
        error: function (response) { alert(response.responseText); }
    });
}

function loadOnlineLogo(container, first) {

    var $con = $("#" + container);
    if (first) {
        $con.find("#fileInput").button()
        $con.find("#btn_Submit").button().unbind('click').click(function () {
            if (validateAll($("#" + container))) {

                ajaxFileUpload({ container: container, isMenu: false, isLogo: true });
            }

        });
        getOnlineLogo(container);
    }
}

function getOnlineLogo(container) {
    var $con = $("#" + container);
    var ItemList = "";
    $.ajax({
        type: "POST",
        url: "Management/getOnlineLogo",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (!isAuthenticated(response))
                return;
            if (!response.hasPhoto)
                return response.msg;
            var List = (typeof response.result) == 'string' ? eval('(' + response.result + ')') : response.result;
            var appName = response.appName;
            if (appName == "/")
                appName = "";
            var ItemList = "<ul id='sortable' >";
            if (List != null)
                for (var i = 0; i < List.length; i++) {
                    var val = List[0, i];
                    ItemList += "<li style='cursor:move; float:none;' id='li" + i + "' ><div class='modalClose modalRemove'><a href='javascript:RemoveOnlineLogo(\"" + container + "\",\"li" + i + "\");'/></div><img style='border:1px;'  title='" + val + "' alt='" + val + "' src='Data/" + appName + "Logo/" + val + "' /></li>";
                }
            ItemList += "</ul>";
            $con.find("#div_d_PhotoList").html(ItemList);


        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}



function RemoveOnlineLogo(container, liId) {
    //  var barcode = alt.split('/')[0];
    var $con = $("#" + container);
    var alt = $con.find("#" + liId).children("img").prop("alt");
    var ItemList = "";
    $.ajax({
        type: "POST",
        url: "Management/deleteOnlineLogo",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isDone)
                $con.find("#sortable li[id='" + liId + "']").remove();
            else
                alert(response.msg)
        },
        error: function (response) { alert(response.responseText); }
    });
}

function loadPhotoStamp(container, first) {

    var $con = $("#" + container);
    if (first) {
        $con.find("#fileInput").button()
        $con.find("#btn_Submit").button().unbind('click').click(function () {
            if (validateAll($("#" + container))) {

                ajaxFileUpload({ container: container, isMenu: false, isStamp: true });
            }

        });
        getPhotoStamp(container);
    }
}

function getPhotoStamp(container) {
    var $con = $("#" + container);
    var ItemList = "";
    $.ajax({
        type: "POST",
        url: "Management/getPhotoStamp",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (!isAuthenticated(response))
                return;
            if (!response.hasPhoto)
                return response.msg;
            var List = (typeof response.result) == 'string' ? eval('(' + response.result + ')') : response.result;
            var appName = response.appName;
            if (appName == "/")
                appName = "";
            var ItemList = "<ul id='sortable' >";
            if (List != null)
                for (var i = 0; i < List.length; i++) {
                    var val = List[0, i];
                    ItemList += "<li style='cursor:move; float:none;' id='li" + i + "' ><div class='modalClose modalRemove'><a href='javascript:RemovePhotoStamp(\"" + container + "\",\"li" + i + "\");'/></div><img style='border:1px;'  title='" + val + "' alt='" + val + "' src='Data/" + appName + "Stamp/" + val + "' /></li>";
                }
            ItemList += "</ul>";
            $con.find("#div_d_PhotoList").html(ItemList);


        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}



function RemovePhotoStamp(container, liId) {
    //  var barcode = alt.split('/')[0];
    var $con = $("#" + container);
    var alt = $con.find("#" + liId).children("img").prop("alt");
    var ItemList = "";
    $.ajax({
        type: "POST",
        url: "Management/deletePhotoStamp",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isDone)
                $con.find("#sortable li[id='" + liId + "']").remove();
            else
                alert(response.msg)
        },
        error: function (response) { alert(response.responseText); }
    });
}


function loadOnlineSliderShow(container, first) {

    var $con = $("#" + container);
    if (first) {
        $con.find("#editDialog").attr("id", "editDialog" + container);
        $con.find("#fileInput").button()
        $con.find("#btn_Submit").button().unbind('click').click(function () {
            if (validateAll($("#" + container)))
                ajaxFileUpload({ container: container, isMenu: false, isLogo: false, isSlider: true });
        });
        // getOnlineSliderShow(container);
        BuildSliderShowAccordion(container)
    }
}

//--------slider begin
function BuildSliderShowAccordion(container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        //  async: false,
        url: "Management/GetOnlineSliderShow",
        contentType: "application/json; charset=utf-8",
        // data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var icons = {
                header: "ui-icon-circle-arrow-e",
                activeHeader: "ui-icon-circle-arrow-s"
            };

            var $dis = $con.find("#sortableSlider");
            $dis.html("");
            var appName = response.appName;
            if (appName == "/")
                appName = "";
            for (var i = 0; i < response.results.length; i++) {
                var val = response.results[i];
                var SliderShowId = val.id;
                $dis.append("<li style='cursor:move;margin: 0 3px 3px 3px; padding: 0.4em;' SliderShowId='" + val.id + "' class='ui-state-default'>" +
                "<span style='float:left;position:relative;top:42px;'  class='ui-icon ui-icon-arrowthick-2-n-s'></span><table width='98%' border='1 px' style='margin:5px;' cellpadding='2px'>" +
                "<tr><td width='15%'  scope='row'>عنوان:<span  id='accordion" + val.id + "'>" +
                val.title + " </span></td><td>توضیحات:<span>" + val.description + "</span></td>" +
                "<td width='22%' rowspan='2'><span><img  title='" + val.title + "' alt='" + val.title + "' src='Data/" + appName + "SliderShow/tiny_" + val.file + ".jpg" +
                "' /></span></td><td class='red' width='5%'><span><button SliderShowId='" + val.file +
                val.id + "' id='btn_edit'>ویرایش</button></span></td></tr><tr>" +
                "<td  colspan='2' scope='row'>لینک به:<span>" + val.linkTo + "</span></td><td class='red' width='5%'><span><button SliderShowId='" + val.file +
                val.id + "' id='btn_delete'>deleteKey</button></span></td>" +
                "</tr></table>");
            }


            $con.find("[id=btn_edit]").button({
                icons: { primary: 'ui-icon-pencil' },
                text: true
            }).unbind("click").click(function () {
                GetOnlineSliderShowForEdit($(this), $con);
                $("#editDialog" + $con.attr("id")).dialog({ width: 300, height: 350 }).dialog("open");
                $("#editDialog" + $con.attr("id")).removeClass("invisible");
                return false;
            });
            $con.find("[id=btn_delete]").button({
                icons: { primary: 'ui-icon-closethick' },
                text: true
            }).unbind("click").click(function () {
                DeleteOnlineSliderShow($(this), $con);
                return false;
            });
            var icons = {
                header: "ui-icon-circle-arrow-e",
                activeHeader: "ui-icon-circle-arrow-s"
            };

            $con.find("#sortableSlider").sortable({

                stop: function (event, ui) {
                    // IE doesn't register the blur when sorting
                    // so trigger focusout handlers to remove .ui-state-focus
                    ui.item.children("li").triggerHandler("focusout");
                    SortSliderShow(ui.item, $con)
                }
            });

        },
        error: function (response) { alert(response.responseText); }
    });
}

function SortSliderShow($this, $con) {
    var sortSliderShows = [];
    var priority = 1;
    $this.parent("ul").children("li").each(function () {
        var sortSliderShow = {};
        sortSliderShow["id"] = $(this).attr("SliderShowid");
        sortSliderShow["Priority"] = priority;
        priority++;
        sortSliderShows.push(sortSliderShow);
    })
    var DTO = { 'sortSliderShow': sortSliderShows };
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/SortOnlineSliderShow",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {

        },
        error: function (response) { alert(response.responseText); }
    });
}
function GetOnlineSliderShowForEdit($dis, $con) {
    var DTO = { 'SliderShowId': $dis.parents("li").attr("SliderShowId") };
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/GetOnlineSliderShowForEdit",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            $("#editDialog" + $con.attr("id")).find("#txtTitle").val(response.title);
            $("#editDialog" + $con.attr("id")).find("#txtLinkTo").val(response.linkTo);
            $("#editDialog" + $con.attr("id")).find("#txtDescription").val(response.description);
            $("#editDialog" + $con.attr("id")).find("#sliderInfo").val(response.sliderInfo);
            $("#editDialog" + $con.attr("id")).find("#btn_save").button();

            $("#editDialog" + $con.attr("id")).find('#formSliderShow').ajaxForm({
                // target: '#fileInput',
                data: { id: $dis.parents("li").attr("SliderShowId") },

                success: function () {

                },
                complete: function (xhr) {

                }
            });
        },
        error: function (response) { alert(response.responseText); }
    });
}

function DeleteOnlineSliderShow($dis, $con) {
    var DTO = { 'SliderShowId': $dis.parents("li").attr("SliderShowId") };
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/DeleteOnlineSliderShow",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (response.isDone)
                $dis.parents("li").remove();
        },
        error: function (response) { alert(response.responseText); }
    });
}
//function EditSliderShow($dialog) {
////    var DTO = { 'SliderShowId': $dialog.find("#hdSliderShowId").val(), 'SliderShow': $dialog.find("#txtSliderShow").val(), 'showOnline': $dialog.find("#ddlShowOnline").val(),
////        'description': $dialog.find("#txtDescription").val()
//    };
//    $.ajax({
//        type: "POST",
//        async: false,
//        url: "Management/EditSliderShow",
//        contentType: "application/json; charset=utf-8",
//        data: JSON.stringify(DTO),
//        success: function (response) {
//            alert("با موفقیت انجام شد.");
//        },
//        error: function (response) { alert(response.responseText); }
//    });
//}


//----------slider end

function getOnlineSliderShow(container) {
    var $con = $("#" + container);
    var ItemList = "";
    $.ajax({
        type: "POST",
        url: "Management/GetOnlineSliderShow",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (!response.hasPhoto)
                return response.msg;
            var List = (typeof response.lphotos) == 'string' ? eval('(' + response.lphotos + ')') : response.lphotos;
            var appName = response.appName;
            if (appName == "/")
                appName = "";
            var ItemList = "<ul id='sortable'>";
            if (List != null)
                for (var i = 0; i < List.length; i++) {
                    var val = List[0, i];
                    ItemList += "<li style='cursor:move;width:280px;' id='li" + i + "' class='ui-state-default'><div class='modalClose modalRemove'><a href='javascript:RemoveOnlineSliderShow(\"" + container + "\",\"li" + i + "\");'/></div><img  title='" + val + "' alt='" + val + "' src='Data/" + appName + "SliderShow/" + val + "' /></li>";
                }
            ItemList += "</ul>";
            $con.find("#div_d_PhotoList").html(ItemList);

            $("#sortable").sortable().sortable({
                stop: function (event, ui) { sortOnlineSliderShow(container) }
            });
            //  $("#spinner").hide();
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

function sortOnlineSliderShow(container) {
    var $con = $("#" + container);
    var photoList = [];

    $.each($("#sortable li").find("img"), function () {
        photoList.push(this.alt);
    });
    var DTO = { 'photos': photoList };

    var ItemList = "";
    $.ajax({
        type: "POST",
        url: "Management/SortOnlineSliderShow",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var lis = $con.find("#sortable li");
            var List = (typeof response.lphotos) == 'string' ? eval('(' + response.lphotos + ')') : response.lphotos;
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                $(lis[i]).find("img").attr("alt", val).attr("title", val);
            }
        },
        error: function (response) { alert(response.responseText); }
    });
}

function RemoveOnlineSliderShow(container, liId) {
    //  var barcode = alt.split('/')[0];
    var $con = $("#" + container);
    var alt = $con.find("#" + liId).children("img").prop("alt");
    var DTO = { 'fileName': alt };
    var ItemList = "";
    $.ajax({
        type: "POST",
        url: "Management/DeleteOnlineSliderShow",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            $con.find("#sortable li[id='" + liId + "']").remove();
            if ($con.find("#sortable li").length > 1)
                sortOnlineSliderShow(container)
        },
        error: function (response) { alert(response.responseText); }
    });
}


function ajaxFileUpload(options) {
    var $con = $("#" + options.container);
    if (options.isMenu)
        var queryString = "id=" + options.id + "&size=" + options.size + "&isMenu=True";
    else if (options.isLogo)
        var queryString = "isLogo=True";
    else if (options.isSlider)
        var queryString = "isSlider=True" + "&priorityId=" + ($("#" + options.container).find("#sortable li").length * 1 + 1);
    else
        var queryString = "barcode=" + options.barcode + "&priorityId=" + ($("#" + options.container).find("#sortable li").length * 1 + 1) + "&colorId=" + $("#" + options.container).find("#ddl_m_Color").val();

    var bar = $('.bar');
    var percent = $('.percent');
    var status = $('#status');
    $con.find('#imageForm').ajaxForm({
        // target: '#fileInput',
        data: { priorityId: ($("#" + options.container).find("#sortable li").length * 1 + 1) },
        beforeSend: function () {
            status.empty();
            var percentVal = '0%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        uploadProgress: function (event, position, total, percentComplete) {
            var percentVal = percentComplete + '%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        success: function () {
            var percentVal = '100%';
            bar.width(percentVal)
            percent.html(percentVal);

            if (options.isMenu)
                getMenuPhotos(options.id, options.container);
            else if (options.isLogo)
                getOnlineLogo(options.container);
            else if (options.isSlider)
                BuildSliderShowAccordion(options.container);
            else
                getPhotos(options.barcode, options.container);
        },
        complete: function (xhr) {
            status.html(xhr.responseText);
        }
    });

}

//------------------OnlineStore end------------------------

//-----------------------OnlineOrders Begin----------------------
function loadInvoiceList(container, first) {
    var $con = $("#" + container);
    InvoiceListload(container, first)
    if (first) {
        sortid = "Date desc";
        $con.find("[id=btnSearch]").button({ icons: {
            primary: "ui-icon-search"
        }
        }).unbind('click').click(function () {
            sortid = "date desc";
            getOnlineInvoiceList(container, { container: container, callbackmethod: getFullAcountList, fname: "", page_index: 0,
                build: buildOnlineInvoiceList, servicename: "Management", methodname: "GetOnlineOrderStatement", print: false
            });
        });
    }
    $con.find("#PageSize").die().live('change', function () {
        getOnlineInvoiceList(container, { container: container, callbackmethod: getFullAcountList, fname: "", page_index: 0,
            build: buildOnlineInvoiceList, servicename: "Management", methodname: "GetOnlineOrderStatement", print: false
        });
    });
}
//Full Account
function getOnlineInvoiceList(container, params) {
    var $con = $("#" + container);
    if (params.page_index > 0)
        params.first = false;
    var name = "", customerName = "", customerCode = "", EmployeeCode = "", EmployeeName = "", Shop = "",
        InvoiceNumber = "", PriceFrom = "", PriceTo = "", confirmerCode = "", confirmerName = "", categoryId = "", barcode = "",
        sell = "", InvoiceDateStart = "", InvoiceDateEnd = "", confirmed = "", isDebtor = "";
    //----
    customerCode = $con.find("#txt_customer").val();
    //----
    search = $con.find("#ddlSearchBy2").val();
    if (search != "") {
        if (search == "EmployeeCode") {

            EmployeeCode = $con.find("#txtSearch2").val();
        }
        if (search == "EmployeeName") {

            EmployeeName = $con.find("#txtSearch2").val();
        }
        if (search == "confirmerCode") {

            confirmerCode = $con.find("#txtSearch2").val();
        }
        if (search == "confirmerName") {

            confirmerName = $con.find("#txtSearch2").val();
        }
        if (search == "InvoiceNumber") {

            InvoiceNumber = $con.find("#txtSearch2").val();
        }
    }
    //----
    InvoiceDateStart = $con.find("#txtInvoiceDateStart").val();
    InvoiceDateEnd = $con.find("#txtInvoiceDateEnd").val();
    if ($con.find("#moreFilter").is(":visible")) {

        //----
        PriceFrom = $con.find("#txt_s_PriceFrom").val();
        PriceTo = $con.find("#txt_s_PriceTo").val();
        //----
        confirmed = $con.find("#selectStatus").val();
        isDebtor = $con.find("#selectAmountStatus").val();
        categoryId = getHierarchySelectedValue("hr_s_Category", container);
        barcode = $con.find("#txt_s_ProductCode").val();
    }
    var DTO = { 'sort': sortid, 'supplierid': "", 'IsClient': "",
        'SupplierName': name, 'code': customerCode, 'customerName': customerName, 'EmployeeId': EmployeeCode, 'EmployeeName': EmployeeName,
        'Shop': Shop, 'InvoiceId': InvoiceNumber, 'InvoiceDateStart': InvoiceDateStart, 'InvoiceDateEnd': InvoiceDateEnd,
        'PriceFrom': PriceFrom, 'PriceTo': PriceTo,
        'Order': ($con.find("#Checkbox7" + container).length > 0 ? $con.find("#Checkbox7" + container).prop('checked') : ""),
        'shopid': $("#userDefault").find("#ddl_s_Branch").val(),
        'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
        'sell': ($con.find("#Checkbox1" + container).length > 0 ? $con.find("#Checkbox1" + container).prop('checked') : ""),
        'buy': ($con.find("#Checkbox2" + container).length > 0 ? $con.find("#Checkbox2" + container).prop('checked') : ""),
        'voucher': ($con.find("#Checkbox5" + container).length > 0 ? $con.find("#Checkbox5" + container).prop('checked') : ""),
        'payment': ($con.find("#Checkbox3" + container).length > 0 ? $con.find("#Checkbox3" + container).prop('checked') : ""),
        'transfer': ($con.find("#Checkbox4" + container).length > 0 ? $con.find("#Checkbox4" + container).prop('checked') : ""),
        'notTransfer': ($con.find("#Checkbox12" + container).length > 0 ? $con.find("#Checkbox12" + container).prop('checked') : ""),
        'expense': ($con.find("#Checkbox6" + container).length > 0 ? $con.find("#Checkbox6" + container).prop('checked') : ""),
        'passed': ($con.find("#Checkbox10" + container).length > 0 ? $con.find("#Checkbox10" + container).prop('checked') : ""),
        'notPassed': ($con.find("#Checkbox11" + container).length > 0 ? $con.find("#Checkbox11" + container).prop('checked') : ""),
        'confirmed': ($con.find("#Checkbox8" + container).length > 0 ? $con.find("#Checkbox8" + container).prop('checked') : ""),
        'notConfirmed': ($con.find("#Checkbox9" + container).length > 0 ? $con.find("#Checkbox9" + container).prop('checked') : ""),
        'isDebtor': isDebtor, 'categoryId': categoryId, 'barcode': barcode
    };
    params["DTO"] = DTO;
    pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
        first: true, isOrder: true
    });
}
//
function buildOnlineInvoiceList(jq, container) {
    var $con = $("#" + container.pagingContainer);
    var table = {};
    var lstb = [];
    var lsth = [];
    var details = {};
    lsth.push({ title: "employee", sort: "p_person.Family", width: "11%" });
    lsth.push({ title: "customer", sort: "p_person1.Family", width: "11%" });
    lsth.push({ title: "date", sort: "Date", width: "12%" });
    lsth.push({ title: "accountDescription", width: "16%" });
    lsth.push({ title: "debtor", sort: "Amount", footer: jq.sumDebtor, width: "8%" });
    lsth.push({ title: "creditor", sort: "Amount", footer: jq.sumCreditor, width: "8%" });
    lsth.push({ title: "balanceAmount", footer: Math.round((jq.sumDebtor * 1) - (jq.sumCreditor * 1), 1), width: "8%" });
    lsth.push({ title: "invoiceNumber", sort: "InvoiceNO", width: "8%" });
    //    lsth.push({ title: "confirm", sort: "p_Employee.p_Person.Family", width: "9%" });
    lsth.push({ title: "store", sort: "inv_Shop.Name", width: "6%" });
    lsth.push({ title: "counter", sort: "counterid", width: "6%" });
    if (!container.params.print) {
        lsth.push({ title: "edit" });
        lsth.push({ title: "details" });
    }
    var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
    var ItemList = "";
    if (List != null)
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            if (!container.params.print)
                trBody[0] = { trId: val.id, trName: val.detail };
            trBody[1] = { name: "employee", html: val.employee, width: "11%" };
            trBody[2] = { name: "customer", html: "<span class='cursor' name='subTab'  menuName='a_CustomerList' id='" + val.ClientId + "'>" + val.client + "</span>" + " <input type='hidden' id='hd_code' value='" + val.clientCode + "'/><input type='hidden' id='hd_clientId' value='" + val.ClientId + "'/>", width: "11%" };
            trBody[3] = { props: { date: val.date, name: "date", width: "12%", klass: "dateLong" }, html: val.date };
            trBody[4] = { name: "description", html: "<span>" + val.inOrderOf + "</span>" + " <input type='hidden' id='hd_categoryId' value='" + val.categoryId + "'/><input type='hidden' id='hd_description' value='" + val.Description + "'/><input type='hidden' id='hd_salaryFromDate' value='" + val.salaryFromDate + "'/><input type='hidden' id='hd_salaryToDate' value='" + val.salaryToDate + "'/><input type='hidden' id='hd_monthId' value='" + val.Month + "'/><input type='hidden' id='hd_fixSalary' value='" + val.fixSalary + "'/><input type='hidden' id='hd_commission' value='" + val.commission + "'/>", width: "16%" };
            trBody[5] = { name: "Debtor", html: val.isSell == true ? val.amount : "", width: "8%" };
            trBody[6] = { name: "Creditor", html: val.isSell == true ? "" : "<span>" + val.amount + "</span>" + " <input type='hidden' id='hd_commission' value='" + val.commission + "'/>", width: "8%" };
            trBody[7] = { name: "balance", html: val.balance, width: "8%" };
            trBody[8] = { name: "InvoiceNO", html: "<span class='cursor' name='subTab'  menuName='a_InvoiceList' id='" + val.id + "'>" + val.InvoiceNO + "</span>" + " <input type='hidden' id='hd_code' value='" + val.InvoiceNO + "'/><input type='hidden' id='hd_clientId' value='" + val.id + "'/>", width: "8%" };
            //  trBody[9] = { name: "confirmer", html: (val.ConfirmerId == null ? "<button id='btnConfirm'>تایید</button>" : val.confirmer), width: "9%" };
            trBody[9] = { name: "shop", html: val.shopName, width: "6%" };
            trBody[10] = { name: "counter", html: val.counterCode, width: "6%" };
            lstb.push(trBody);
        }

    if (container.params.print) {
        table = { header: lsth, body: lstb, heigth: 300,
            container: container.pagingContainer, divName: "Div_Print", hasFooter: true
        };
        buildPrintTable(table);
        container.params.print = false;
    }
    else {
        table = { header: lsth, body: lstb, details: { detailsFunction: FullAcountDetails, editFunction: EditFullAccount, confirmFunction: ConfirmFullAccount }, heigth: 300,
            container: container.pagingContainer, divName: "invoicelist", hasFooter: true
        };
        buildTable(table);
    }
}

function ConfirmFullAccount(dis, container) {
    $con = $("#" + container);
    $dis = $(dis);
    var DTO = { 'orderHeaderId': $dis.parents("tr").prop("id").replace("tr", "") };
    $.ajax({
        type: "POST",
        url: "Management/ConfirmFullAccount",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response != null && response.isdone == true) {
                getFullAcountList(container, { container: container, callbackmethod: getFullAcountList, fname: "", page_index: 0,
                    build: buildFullAcountList, servicename: "Management", methodname: "GetFullOrderStatement", print: false
                });
            }
            //$dis.parent().html(response.name + " " + response.family);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}
function FullAcountDetails(dis, container) {
    $con = $("#" + container);
    $dis = $(dis);
    //payment or Transfer
    $("#voucherDetailsList" + container + "," + "#DetailPaymentList" + container + "," + "#dialog" + container + "," + "#expense" + container).dialog().dialog("close");
    if ($dis.parents("tr").attr("name") == "payment")
        ListDetailPayment($dis.parents("tr").prop("id").replace("tr", ""), container);
    //order
    else if ($dis.parents("tr").attr("name") == "order")
        SelectDetailInvoice($dis.parents("tr").prop("id").replace("tr", ""), "dialog" + container);
    //voucher
    else if ($dis.parents("tr").attr("name") == "voucher")
        VoucherDetailsFullAccount($dis.parents("tr").prop("id").replace("tr", ""), container);
    //expense
    else if (($dis.parents("tr").attr("name") == "expense" || $dis.parents("tr").attr("name") == "salary" || $dis.parents("tr").attr("name") == "social"))
        ExpenseDetailsFullAccount($dis, container);
}

function SelectColorForOrderEdit(trid, barcodeid) {
    bindItemsForSelectCombo({ methodname: "GetSizeListByBarcodeIdColorIdForEdit", servicename: "Management", id: "ddl_m_Size_" + trid, container: trid, headertext: " سایز" }, { barcodeid: barcodeid, orderDetailid: trid.replace("tr", ""), colorid: $("#" + trid).find("#ddl_m_Color_" + trid).val() });
}

function InvoiceListload(container, first) {

    var $con = $("#" + container);
    if (first) {
        bindHierarchyData({ id: "hr_s_Category", table: "category", container: container, styleclass: "PagingSelect " });
        $con.find('#moreFilter').slideUp('fast');
        $con.find('.toggle-more-filters').click(function () {
            $(this).toggleClass("open")
            $con.find('#moreFilter').slideToggle(function () {
                // Animation complete.
            });
        });
        $con.find(".icon_clear").unbind('click').click(function () { $con.find("#customerOnSelect").html(""); });
        ChangeCheckBoxGroupName("Check", container);
        $con.find("#txtInvoiceDateStart").datepicker({ changeMonth: true, changeYear: true,
            onSelect: function (dateText, inst) {
                $('#txtInvoiceDateEnd').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
            }
        });
        $con.find("#btnPrint").die().live('click', function () {
            getFullAcountList(container, { container: container, callbackmethod: getFullAcountList, fname: "", page_index: 0,
                build: buildFullAcountList, servicename: "Management", methodname: "GetFullOrderStatement", print: true
            });
        }).button({ icons: {
            primary: "ui-icon-print"
        },
            text: true
        });
        $con.find("#txtInvoiceDateEnd").datepicker({ changeMonth: true, changeYear: true });
        //Payment Details
        $con.find("#DetailPaymentList" + container).dialog({ autoOpen: false }).dialog({ width: 750 });
        $con.find("#DetailPaymentList").attr("id", "DetailPaymentList" + container);
        //Invoice Details
        $con.find("#dialog").attr("id", "dialog" + container);
        //Order Edit Dialog
        $con.find("#DialogEditAccount").attr("id", "editOrder" + container);
        //
        $con.find("#dialogAdd").attr("id", "dialogAdd" + container);
    }
    aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "Management", id: "txt_customer", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_customer", fname: customerOnSelect });
}

function loadConfirmSell(Id, container, first) {
    var $con = $("#" + container);
    $con.find("#orderheaderId").val(Id);
    if (first) {
        GetInvoiceDetails(Id, container);
        $con.find("#btnTransfer").button({
            text: true,
            icons: {
                primary: "ui-icon-transferthick-e-w"
            }
        }).click(function () {
            ConfirmOnlineOrder(container, Id);
        });
        $con.find("#cancelOrder").button({
            text: true,
            icons: {
                primary: "ui-icon-transferthick-e-w"
            }
        }).click(function () {
            CancelOrder(container, Id);
        });
    }
}


function GetInvoiceDetails(id, container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        url: "Management/GetInvoiceDetails",
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + id + "'}",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            jq = response.invoiceDetails;
            buildOnlineInvoiceDetail(jq, container);
            var receiverDetail = response.receiverDetails[0];
            if (receiverDetail != undefined) {
                //                 BindParents($con.find("#lblAddress"), "address", receiverDetail.AddressID, 0, { isRaw: true, concat: receiverDetail.Address });
                $con.find("#lblAddress").html(receiverDetail.Address);
                $con.find("#lblCellPhone").html(receiverDetail.CellPhone);
                $con.find("#lblGiftNote").html(receiverDetail.GiftNote);
                $con.find("#lblIsGift").html(receiverDetail.IsGift == null ? "خیر" : receiverDetail.IsGift == "" ? "خیر" : (receiverDetail.IsGift.toString() == "true" ? "بلی" : "خیر"));
                $con.find("#lblName").html(receiverDetail.Name);
                $con.find("#lblNeedWrap").html(receiverDetail.NeedWrap  == null ? "خیر" : receiverDetail.IsGift == "" ? "خیر" : (receiverDetail.NeedWrap.toString() == "true" ? "بلی" : "خیر"));
                $con.find("#lblPhone").html(receiverDetail.Phone);
                $con.find("#lblPostalCode").html(receiverDetail.PostalCode);
                $con.find("#lblSendDate").attr("date", receiverDetail.SendDate);
                $con.find("#lblSendDate").html(receiverDetail.SendDate);
                $con.find("#lblSendTime").html(receiverDetail.SendTime);
                switch (receiverDetail.SendType) {
                    case 1:
                        $con.find("#lblSendType").html("ارسال با پیک");
                        break;
                    case 2:
                        $con.find("#lblSendType").html("ارسال از طریق پست پیشتاز");
                        break;
                    case 3:
                        $con.find("#lblSendType").html("ارسال از طریق پست تیپاکس");
                        break;

                }
                switch (receiverDetail.PaymentType) {
                    case 1:
                        $con.find("#lblPaymentType").html("پرداخت آنلاین");
                        break;
                    case 2:
                        $con.find("#lblPaymentType").html("پرداخت به شماره کارت اعتباری");
                        break;
                    case 3:
                        $con.find("#lblPaymentType").html("پرداخت به پیک همزمان با تحویل کالا");
                        break;

                }
                $con.find("#lblFamily").html(receiverDetail.Family);
                $con.find("#lblDescription").html(receiverDetail.Description);
                $con.find("#lblAmount").html(receiverDetail.Amount);
                $con.find("#lblDate").attr("date", receiverDetail.Date);
                $con.find("#lblDate").html(receiverDetail.Date);
                $con.find("#lblDiscountAmount").html(receiverDetail.DiscountAmount);
                $con.find("#lblDeliveryExpense").html(receiverDetail.DeliveryExpense);
                $con.find("#lblPurchaser").html("<span class='cursor' name='subTab'  menuName='a_InvoiceList' id='" + receiverDetail.PersonId + "'>" + receiverDetail.CustomerName + " " + receiverDetail.CustomerFamily + "</span>" + " <input type='hidden' id='hd_code' value='" + receiverDetail.CustomerName + " " + receiverDetail.CustomerFamily + "'/><input type='hidden' id='hd_clientId' value='" + receiverDetail.PersonID + "'/>");
            }
            $con.find("span[name='subTabBarcode']").unbind().click(function () {
                showQuantity(container, $(this).attr("Barcode"));
            })
            $con.find("span[name='subTab']").unbind().click(function () {
                createSubTab({ name: "a_CustomerList", id: receiverDetail.PersonId, row: null, tabName: receiverDetail.CustomerName + " " + receiverDetail.CustomerFamily });
            })
            $con.find("[name=tQuan]").spinner();
            $con.find("select[name=ddl_shops]").unbind().change(function () {
                if ($(this).val() == "") {
                    $con.find("input[name='" + ordDId + "_avQuan']").html("0");
                    return;
                }
                var ordDId = $(this).parents("tr").attr("id").replace("tr", "");
                $.ajax({
                    type: "POST",
                    url: "Management/GetItemDetailCountForShop",
                    contentType: "application/json; charset=utf-8",
                    data: "{orderDetailId: '" + ordDId + "', shopId: '" + $(this).val() + "'}",
                    success: function (response) {
                        $con.find("span[name='" + ordDId + "_avQuan']").html(response);
                    },
                    error: function (response) { alert(response.responseText); }
                });
            });
        },
        error: function (response) { alert(response.responseText); }
    });
}

function showQuantity(container, barcode) {
    buildColorSizeTable(barcode, $("#userDefault").find("#ddl_s_Branch").val(), true, "GetItemDetailsByBarcodeAndShopID", "dialog_ItemQuantity")
    $("#dialog_ItemQuantity").dialog().dialog('open');
}

function loadListColorSize(barcodeid, container, first) {
    getListColor_Size(barcodeid, container);
    if (first) {
        var $con = $("#" + container);
        bindItemsForSelectCombo({ methodname: "GetColorList", servicename: "Management", id: "ddl_m_Color", container: container, headertext: "انتخاب رنگ" });
        bindItemsForSelectCombo({ methodname: "GetSizeList", servicename: "Management", id: "ddl_m_Size", container: container, headertext: "انتخاب جزئیات" });

        $con.find("#btn_Submit").off().on('click', function () {
            if (validateAll($("#" + container)))
                EditColor_Size(barcodeid, container);
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });
    }
}

function buildColorSizeTable(barcode, shopId, withQuantity, methodname, id, Container) {
    if (Container != undefined)
        $con = $("#" + Container).find("#" + id);
    else
        $con = $("#" + id);

    getItem(barcode, shopId, withQuantity, methodname, id, Container);

}

function getItem(barcode, ShopId, withQuantity, methodname, id, Container) {
    if (Container != undefined)
        $con = $("#" + Container).find("#" + id);
    else
        $con = $("#" + id);

    $.ajax({

        type: "POST",

        url: "Management/" + methodname,
        async: false,
        data: "{barcode: '" + barcode + "', shopId: '" + ShopId + "'}",

        contentType: "application/json; charset=utf-8",

        dataType: "json",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var Order = (typeof response) == 'string' ? eval('(' + response + ')') : response;
            bindSizeColor(Order.Size, Order.Color, Order.Quantity, withQuantity, $con);
            if (withQuantity)
                BindQuantitys(Order.Quantity, $con);
            else {
                $con.find("input[name='quantity']").die("change").live('change', function () {

                    SumWholesale(Container.split("_")[1]);
                });
            }
        }
    });
}


function BindQuantitys(Quantity, $con) {
    for (var j = 0; j < Quantity.length; j++) {
        var val = Quantity[0, j];
        var text = val.Quantity;
        var value = (val.ColorId == null ? "" : val.ColorId) + "-" + (val.SizeId == null ? "" : val.SizeId);
        $con.find("#" + value).val((text * 1).toFixed(0));
    }

}


function buildOnlineInvoiceDetail(jq, container) {
    var $con = $("#" + container.pagingContainer);
    var table = {};
    var lstb = [];
    var lsth = [];
    var details = {};
    lsth.push({ title: "description", width: "28%" });
    lsth.push({ title: "color", width: "8%" });
    lsth.push({ title: "size", width: "8%" });
    lsth.push({ title: "count", width: "6%" });
    lsth.push({ title: "price", width: "8%" });
    lsth.push({ title: "sum", width: "7%" });
    lsth.push({ title: "serial", width: "10%" });
    lsth.push({ title: "store", width: "15%" });
    lsth.push({ title: "transferQuantity", width: "10%" });

    var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
    var ItemList = "";
    if (List != null)
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            var ItemList = "<select id='" + val.ItemDetailId + "' name='ddl_shops'><option value=''>---</option>";
            for (var s = 0; s < val.shop.length; s++) {
                var shval = val.shop[s];
                ItemList += "<option value='" + shval.ShopId + "'>" + shval.Name + ": " + shval.Quantity + "</option>";
            }
            ItemList += "</select><span name='" + val.OrderDetailId + "_avQuan'></span>";
            //store = store + ItemList;
            trBody[0] = { trId: val.OrderDetailId };
            trBody[1] = { name: "description", html: "<span barcode='" + val.Barcode + "' class='cursor' name='subTabBarcode' menuName='a_InventoryList' id='" + val.BarcodeId + "'>" + (val.Barcode == null ? "" : val.Barcode + "_") + (val.Name == null ? "" : val.Name) + (val.Description == null ? "" : "_" + val.Description) + (val.ItemCode == null ? "" : "_" + val.ItemCode) + "</span>", width: "28%" };
            trBody[2] = { name: "color", html: "<div id='Color" + (val.ColorId == "0" ? "" : val.ColorId) + "'>" + (val.Color == null ? "" : val.Color) + "</div>", width: "8%" };
            trBody[3] = { name: "size", html: "<div id='Size" + (val.SizeId == "0" ? "" : val.SizeId) + "'>" + (val.Size == null ? "" : val.Size) + "", width: "8%" };
            trBody[4] = { name: "count", html: "<div id='Quantity'>" + (val.Quantity == null ? "" : val.Quantity) + "</div>  " + (val.UnitType == null ? "" : val.UnitType), width: "6%" };
            trBody[5] = { name: "price", html: "<div id='Price'>" + (val.Amount == null ? "" : val.Amount) + "</div>", width: "8%" };
            trBody[6] = { name: "sum", html: "<div id='TotalPrice'>" + (val.Quantity * val.Amount) + "</div>", width: "7%" };
            trBody[7] = { name: "serial", html: "<input style='width:80px;' type='text' name='Serial' />", width: "10%" };
            trBody[8] = { name: "store", html: ItemList, width: "15%" };
            trBody[9] = { name: "transferQuantity", html: "<input style='width:20px;' name='tQuan' value='" + val.Quantity + "' type='text'/>", width: "10%" };
            lstb.push(trBody);
        }



    table = { header: lsth, body: lstb, heigth: 300,
        container: container, divName: "InvoiceDetailsList", hasFooter: false, details: {}
    };
    buildTable(table);

}
function ConfirmOnlineOrder(container, OrderHeaderId) {
    var $con = $("#" + container);
    var orderdetails = [];
    $.each($con.find("tr[id*=tr]"), function () {
        var orderdetail = {};
        var $row = $(this);
        var orderDetailArray = [];
        //  if ($con.find("input[name=tQuan]").html() * 1 >= $row.find("div[id=Quantity]").html() * 1) {
        var OrderItemDetail = {};
        OrderItemDetail["itemDetailId"] = $row.find("select[name='ddl_shops']").attr("id");
        OrderItemDetail["quantity"] = $row.find("input[name='tQuan']").val();
        OrderItemDetail["serial"] = $row.find("input[name='Serial']").val();
        OrderItemDetail["shopidFrom"] = $row.find("select[name='ddl_shops']").val();
        orderdetails.push(OrderItemDetail);
        //  }

    });
    var DTO = { 'itemDetails': orderdetails, 'OrderHeaderId': OrderHeaderId, 'shopIdTo': $("#userDefault").find("#ddl_s_Branch").val(), 'counterId': $("#userDefault").find("#ddl_m_Counter").val() };
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: "Management/ConfirmOnlineOrder",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function CancelOrder(container, OrderHeaderId) {
    var $con = $("#" + container);
    var DTO = { 'OrderHeaderId': OrderHeaderId };
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: "MAnagement/CancelOrder",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

//function EditFullAccount(dis, container) {
//   

//    $con = $("#" + container);
//    $dis = $(dis);
//    //payment or Transfer
//    $("#edit" + container, "#editExpense" + container, "#editSalary" + container, "#editSocial" + container).dialog().dialog("close");
//    if ($dis.parents("tr").attr("name") == "payment")
//        return;
//    //order
//    else if ($dis.parents("tr").attr("name") == "order")
//        EditOrderFullAccount($dis, container);
//    //voucher
//    else if ($dis.parents("tr").attr("name") == "voucher")
//        EditVoucherFullAccount($dis, container);
//    //expense category
//    else if ($dis.parents("tr").attr("name") == "expense")
//        EditExpenseFullAccount($dis, container);
//    //salary
//    if ($dis.parents("tr").attr("name") == "salary")
//        EditSalaryFullAccount($dis, container);
//    //social
//    if ($dis.parents("tr").attr("name") == "social")
//        EditSocialFullAccount($dis, container);
//}

function EditOrderFullAccount(dis, container) {
    var $con = $("#" + container);
    var $dis = $(dis);
    var $dialog = $("#editOrder" + container);
    $dialog.find("#txtAmount").val($dis.parents("tr").find("[name=Debtor]").html() != "" ? $dis.parents("tr").find("[name=Debtor]").html() : $dis.parents("tr").find("[name=Creditor]").find("span").html());
    //    $dialog.find("#txtCustomer").val($dis.parents("tr").find("#hd_code").val());
    //    aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "Management", id: "txtCustomer", container: $dialog.prop("id"), minlength: 2, autofocus: false, limit: 20, boxId: "txtCustomer" });
    $dialog.find("#btnEditAccount").button({
        icons: {
            primary: "ui-icon-disk"
        }
    }).unbind().click(function () {
        if (UpdateOrderFullAccount($dis.parents("tr").prop("id").replace("tr", ""), container)) {

        }
    });
    $dialog.dialog(open).dialog({ width: 400, modal: true });
    localize();
}
function UpdateOrderFullAccount(orderHeaderId, container) {
    $con = $("#editOrder" + container);
    var DTO = { 'orderHeaderId': orderHeaderId, 'amount': $con.find("#txtAmount").val() };
    $.ajax({
        type: "POST",
        url: "Management/EditOrderFullAcount",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            return response.msg;
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

function RemoveItemDetailInvoice(OrderDetailId, container) {
    var con = $("#" + container);
    $.ajax({
        type: "POST",
        url: "Management/DeleteDetailInvoice",
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + OrderDetailId + "'}",


        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.msg);
            if (response.isdone)
                con.find("#tr" + OrderDetailId).remove();
        },

        error: function (response) { alert(response.responseText); }
    });
}


function ClickDetailInvoice($dis, container) {
    var $con = $("#" + container);
    onRowClick($dis);
    trid = $dis.prop('id');
    if ($dis.hasClass("rowOnClick") && $dis.find("input:text").length < 2) {
        $dis.find("td[name=Color]").append("<select   id='ddl_m_Color_" + trid + "' disabled='disabled' class='inputDiv selectSmall required validate-address' ></select>");
        $dis.find("div[id=Color]").addClass("invisible");

        $dis.find("td[name=Size]").append("<select   id='ddl_m_Size_" + trid + "' disabled='disabled' class='inputDiv selectSmall required validate-address' ></select>");
        $dis.find("div[id=Size]").addClass("invisible");

        $dis.find("td[name=Quantity]").append("<input type='text' class='inputText inputW50 ' value='" + $dis.find("div[id=Quantity]").html().split(" ")[0] + "'/><Label id='Label'>" + $dis.find("div[id=Quantity]").html().split(" ")[1] + "</Label>");
        $dis.find("div[id=Quantity]").addClass("invisible");

        $dis.find("td[name=Price]").append("<input type='text' class='inputText inputW50 ' value='" + $dis.find("div[id=Price]").html() + "'/>");
        $dis.find("div[id=Price]").addClass("invisible");

        $dis.find("td[name=TotalPrice]").append("<input type='text' class='inputText inputW50 ' value='" + $dis.find("div[id=TotalPrice]").html() + "'/>");
        $dis.find("div[id=TotalPrice]").addClass("invisible");

        $dis.find("td[name=Serial]").append("<input type='text' class='inputText inputW50 ' value='" + $dis.find("div[id=Serial]").html() + "'/>");
        $dis.find("div[id=Serial]").addClass("invisible");

        $dis.find("div[id=delete]").addClass("invisible");
        $dis.find("td[id=delete]").append("<div id='Edit'><a id='Edit_Button' href='#'>بروز </a></div>");

        $dis.find("div[id=Broken]").addClass("invisible");
        $dis.find("td[name=Quantity] input,td[name=Price] input").change(function () {
            SumPriceDetail($dis);
        });

        $dis.find("[id=Edit_Button]").click(function () {
            EditDetailInvoice($dis, container);
        }).button();

        bindItemsForSelectCombo({ methodname: "GetColorListForEdit", servicename: "Management", id: "ddl_m_Color_" + trid, container: trid, headertext: " رنگ", setcolor: true }, { barcodeid: $dis.find("td[name=name]").prop('id'), orderDetailid: trid.replace("tr", "") });
        $dis.find("#ddl_m_Color_" + trid).change(function () {
            SelectColorForOrderEdit(trid, $dis.find("td[name=name]").prop('id'));
        });
        ajDropDown.done(function () {
            if ($dis.find("#ddl_m_Color_" + trid + " option").length < 1)

                bindItemsForSelectCombo({ methodname: "GetSizeListByBarcodeIdColorIdForEdit", servicename: "Management", id: "ddl_m_Size_" + trid, container: trid, headertext: " سایز" }, { barcodeid: $dis.find("td[name=name]").prop('id'), orderDetailid: trid.replace("tr", ""), colorid: "" });
        });

        $.each($con.find("tr[id*=tr]"), function () {
            if (!$(this).hasClass("rowOnClick")) {
                $(this).find("input:text[id!=txt_m_QuantityReturn]").remove();
                $(this).find("select").remove();
                $(this).find("Label[id=Label]").remove();
                $(this).find("#Edit").remove();
                $(this).find("div[id=Broken]").removeClass("invisible");
                $(this).find("div").removeClass("invisible");
            }
        });
    }
    else {
        $dis.find("input:text[id!=txt_m_QuantityReturn]").remove();
        $dis.find("select").remove();
        $dis.find("Label[id=Label]").remove();
        $dis.find("#Edit").remove();
        $dis.find("div").removeClass("invisible");
    }
}


//----------------------OnlineOrders Ends-----------------------

//----------------------Inventory Begin--------------------------

function loadInventoryHelp(container, first) {
    var $con = $("#" + container);
    if (first) {

        $con.find("#newItem").unbind("click").bind('click', function () {
            $("[id='a_InventoryAdd']").trigger("click")
        });
        $con.find("#management").unbind("click").bind('click', function () {
            $("[id='a_InventoryList']").trigger("click")
        });
        $con.find("#cardex").unbind("click").bind('click', function () {
            $("[id='a_InventoryReportList']").trigger("click")
        });
        $con.find("#setting").unbind("click").bind('click', function () {
            $("[id='a_InventorySetting']").trigger("click")
        });
    }
}

function loadItemHelp(barcodeId, container, first) {
    var $con = $("#" + container);
    if (first) {

        $con.find("#edit").unbind("click").bind('click', function () {
            $con.parent().find("[id='a_InventoryEdit']").trigger("click")
        });
        $con.find("#detailList").unbind("click").bind('click', function () {
            $con.parent().find("[id='a_ListColorSize']").trigger("click")
        });
        $con.find("#newDetail").unbind("click").bind('click', function () {
            $con.parent().find("[id='a_ColorSize']").trigger("click")
        });
        $con.find("#category").unbind("click").bind('click', function () {
            $con.parent().find("[id='a_InventoryCategory']").trigger("click")
        });
        $con.find("#averagePrice").unbind("click").bind('click', function () {
            $con.parent().find("[id='a_ItemAccountingDetails']").trigger("click")
        });
        $con.find("#periodicPrice").unbind("click").bind('click', function () {
            $con.parent().find("[id='a_InventoryPrice']").trigger("click")
        });
        $con.find("#MeasureUnit").unbind("click").bind('click', function () {
            $con.parent().find("[id='a_InventoryUnit']").trigger("click")
        });
    }
}

function loadInventoryAdd(container, first) {
    if (first) {
        var $con = $("#" + container);
        bindHierarchyData({ id: "hr_m_Category", container: container, canmodify: true, table: "account" });
        bindHierarchyData({ id: "hr_m_Category2", container: container, canmodify: true, table: "category" });
        bindItemsForSelectCombo({ methodname: "getMeasureUnit", servicename: "Management", id: "ddl_m_MeasureUnit", container: container, headertext: " واحد کالا", selectedindex: 1 });
        bindItemsForSelectCombo({ methodname: "getAvailablity", servicename: "Management", id: "ddl_m_Availability", container: container, headertext: "وضعیت کالا", selectedindex: 1 });

        $con.find("#btn_Submit").off().on('click', function () {
            if (validateAll($("#" + container)))
                AddBarcode(container);
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });
    }
}

function AddBarcode(container) {
    var $con = $("#" + container);
    var DTO = { 'barcode': $con.find("#txt_m_Barcode").val(), 'name': $con.find("#txt_m_Name").val(), 'itemcode': $con.find("#txt_m_ItemCode").val(), 'availibilityid': $con.find("#ddl_m_Availability").val(), 'measureunitid': $con.find("#ddl_m_MeasureUnit").val(), 'categoryid': getHierarchySelectedValue("hr_m_Category", container), 'regularprice': $con.find("#txt_m_RegularPrice").val(), 'frinendsprice': $con.find("#txt_m_FrinendsPrice").val(), 'wholesaleprice': $con.find("#txt_m_WholesalePrice").val(), 'onlineprice': $con.find("#txt_m_OnlinePrice").val(), 'weight': $con.find("#txt_m_Weight").val(), 'setColorSize': $con.find("#cb_d_SizeColor").prop("checked"), 'showOnline': $con.find("#ddl_m_ShowOnline").val(), 'date': $("#userDefault").find("#txt_s_Date").val() };
    $.ajax({
        type: "POST",
        url: "Management/AddBarcode",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isDone) {
                alert("بارکد کالا:" + response.barcode);
                ResetPage(container);
            }
            // translate(response.msg);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}


function loadInventoryList(container, first) {
    sortid = 'BarcodeId desc';
    if (first) {
        var $con = $("#" + container);

        //  bindDropDown("ddl_d_SearchBy", container);
        bindHierarchyData({ id: "hr_s_Category", table: "category", container: container, styleclass: "PagingSelect " });
        bindItemsForSelectCombo({ methodname: "getAvailablity", servicename: "Management", id: "ddl_s_Availability", container: container, headertext: "وضعیت کالا" });
        getBarcodeList(container);
        //  GetSubMenuItems("a_InventoryList", container);
        //        $con.find("#divslider").unbind('click').click(function () { sliderClick("divInventorysearch"); sliderClick("InventoryAdvanceSearch"); });
        $con.find("#btnPrint").die().live('click', function () {
            GetProductList(container, false);
        }).button({ icons: {
            primary: "ui-icon-print"
        },
            text: true
        });
        $con.find("#btnPrintBarcode").unbind().bind('click', function () {
            GetProductList(container, true);
        }).button({ icons: {
            primary: "ui-icon-print"
        },
            text: true
        });
        $con.find("#btnSearchInventory").unbind('click').click(function () {
            getBarcodeList(container);
        }).button({ icons: {
            primary: "ui-icon-search"
        }
        });
        $con.find("#PageSize").unbind('change').change(function () { getBarcodeList(container); });
        $con.find("#regdateFrom").datepicker({ changeMonth: true, changeYear: true,
            onSelect: function (dateText, inst) {
                $('#regdateTo').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
            }
        });
        $con.find("#regdateTo").datepicker({ changeMonth: true, changeYear: true });
        //        $con.find("#InventoryAdvanceSearchbt").unbind('click').click(function () { getBarcodeList(container); }).button();
    }

}

function getBarcodeListOrder(container, params) {
    var $con = $("#" + container);
    var $dialog = $("#" + params.container + container);
    var barcode = $con.find("#txt_s_ProductBarcode").val();
    if (barcode != "" && barcode != undefined) {
        params.fname(null, container, barcode);
        return;
    }
    if (params.page_index > 0) {
        params.first = false;
    }
    var DTO = { 'sort': sortid, 'barcode': ($con.find("#txt_s_ProductBarcode").val() == undefined ? "" : $con.find("#txt_s_ProductBarcode").val()), 'name': ($con.find("#txt_s_ProductCode").val() == undefined ? "" : $con.find("#txt_s_ProductCode").val()), 'code': "", 'price': "", 'categoryid': getHierarchySelectedValue("hr_s_Category", container), 'status': ($con.find("#ddl_m_Availability").val() == undefined ? "" : $con.find("#ddl_m_Availability").val()), 'quantityfrom': "", 'quantityto': "", 'regdatefrom': "", 'regdateto': "", 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "GetItemsList" };
    params["DTO"] = DTO;

    pageselectCallback(0, params, { container: "dialog", fname: params.fname, pagingContainer: container, first: true, isOrder: true });
}


function getBarcodeList(container) {
    var $con = $("#" + container);
    var first = true;
    var take = $con.find("#PageSize").val();
    var skip = 0;
    var page_index = 0
    var barcode = "", name = "", code = "", price = "";
    if ($con.find("#divBarcodesearch").is(":visible")) {

        var search = $con.find("#ddl_d_SearchBy").val();
        if (search == "Barcode") {

            barcode = $con.find("#txt_s_Inventory").val();
        } if (search == "Name") {

            name = $con.find("#txt_s_Inventory").val();
        } if (search == "Code") {

            code = $con.find("#txt_s_Inventory").val();
        } if (search == "Price") {

            price = $con.find("#txt_s_Inventory").val();
        }

        //        if (container == "selectCustomerContent") {
        //            name = $con.find("#selectCustomerName").val();
        //            regname = $con.find("#selectCustomerRegisterer").val();
        //        }
        var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
            'barcode': barcode, 'name': name, 'code': code, 'price': price, 'categoryid': getHierarchySelectedValue("hr_s_Category", container),
            'status': $con.find("#ddl_s_Availability").val(), 'quantityfrom': $con.find("#quantityFrom").val(), 'quantityto': $con.find("#quantityTo").val(),
            'regdatefrom': $con.find("#regdateFrom").val(), 'regdateto': $con.find("#regdateTo").val(), 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "GetItemsList"
        };
    }
    else {
        var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
            'barcode': barcode, 'name': name, 'code': code, 'price': price, 'categoryid': getHierarchySelectedValue("hr_s_Category", container),
            'status': $con.find("#ddl_s_Availability").val(), 'quantityfrom': $con.find("#quantityFrom").val(), 'quantityto': $con.find("#quantityTo").val(),
            'regdatefrom': $con.find("#regdateFrom").val(), 'regdateto': $con.find("#regdateTo").val(), 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "GetItemsList"
        };
        //var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': $con.find("#CustomerSearchCode").val(), 'namefamily': $container.find("#CustomerSearchName").val(), 'introducer': $container.find("#CustomerSearchIndtroducerName").val(), 'registerername': $container.find("#CustomerSearchRegName").val(), 'agefrom': $container.find("#CustomerSearchAgeStart").val(), 'ageto': $container.find("#CustomerSearchAgeEnd").val(), 'regdatefrom': $container.find("#CustomerSearchRegDateStart").val(), 'regdateto': $container.find("#CustomerSearchRegDateEnd").val() };
    }
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: "Management/GetItemsList",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var opt = InventorygetOptionsFrom(response.count, container);
            $con.find("#paging").pagination(response.count, opt);
            InventorypageselectCallback(0, response, container, first);
        },
        error: function (response) { alert(response.responseText); }
    });
}


function buildBarcodeListOrder(jq, pageoption) {
    var $con = $("#" + pageoption.container);
    jq = jq.results;
    var table = {};
    var lstb = [];
    var lsth = [];
    var details = {};
    lsth.push({ title: "category", width: "12%" });
    lsth.push({ title: "itemName", sort: "Name", width: "35%" });
    lsth.push({ title: "itemCode", sort: "ItemCode", width: "14%" });
    lsth.push({ title: "count", sort: "Quantity", width: "10%" });
    lsth.push({ title: "price", sort: "Regular", width: "15%" });
    lsth.push({ title: "barcode", sort: "Barcode", width: "14%" });


    var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
    var ItemList = "";
    for (var i = 0; i < List.length; i++) {
        var val = List[0, i];
        var trBody = {};
        trBody[0] = { trId: val.BarcodeId };
        trBody[1] = { html: val.Category, width: "12%" };
        trBody[2] = { name: "name", html: val.Name, width: "35%" };
        trBody[3] = { name: "code", html: val.ItemCode, width: "14%" };
        trBody[4] = { name: "quantity", html: val.Quantity + " " + val.UnitType, width: "10%" };
        trBody[5] = { html: val.Regular, props: { name: "price", klass: "digit", width: "15%"} };
        trBody[6] = { name: "barcode", html: val.Barcode, width: "14%" };

        lstb.push(trBody);
    }
    details = { rowClick: pageoption.fname };
    table = { header: lsth, body: lstb, details: details, heigth: 300, width: 620,
        container: pageoption.container + pageoption.pagingContainer, divName: "BarcodeList",
        rowClickParams: { fname: GetItemOrder }
    };
    buildTable(table);
}



function InventorygetOptionsFrom(count, container) {
    var $con = $("#" + container);
    var opt = { callback: InventorypageselectCallback };
    $con.find("input:text").each(function () {
        opt[this.name] = this.className.match(/numeric/) ? parseInt(this.value) : this.value;
    });
    opt.prev_show_always = false;
    opt.next_show_always = false;
    if ((count) < $con.find("#PageSize").val())
        $con.find("#PageSize").css("display", "none");
    else {
        $con.find("#PageSize").css("display", "inline");
    }
    opt.items_per_page = $con.find("#PageSize").val();
    opt.prev_text = "قبلی";
    opt.next_text = "بعدی";
    opt.container = container;
    return opt;
}



function GetProductList(container, isBarcode) {
    var $con = $("#" + container);
    var barcode = "", name = "", code = "", price = "";
    if ($con.find("#divBarcodesearch").is(":visible")) {

        var search = $con.find("#ddl_d_SearchBy").val();
        if (search == "Barcode") {

            barcode = $con.find("#txt_s_Inventory").val();
        } if (search == "Name") {

            name = $con.find("#txt_s_Inventory").val();
        } if (search == "Code") {

            code = $con.find("#txt_s_Inventory").val();
        } if (search == "Price") {

            price = $con.find("#txt_s_Inventory").val();
        }
        var DTO = { 'skip': 0, 'take': 0, 'currentPage': 0, 'first': false, 'sort': sortid, 'barcode': barcode, 'name': name, 'code': code, 'price': price, 'categoryid': getHierarchySelectedValue("hr_s_Category", container), 'status': $con.find("#ddl_s_Availability").val(), 'quantityfrom': "", 'quantityto': "", 'regdatefrom': "", 'regdateto': "", 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "GetProductList" };
    }
    else {
        var DTO = { 'skip': 0, 'take': 0, 'currentPage': 0, 'first': false, 'sort': sortid, 'barcode': barcode, 'name': name, 'code': code, 'price': price, 'categoryid': getHierarchySelectedValue("hr_s_Category", container), 'status': $con.find("#ddl_s_Availability").val(), 'quantityfrom': "", 'quantityto': "", 'regdatefrom': "", 'regdateto': "", 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "GetProductList" };
    }
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: "Management/GetItemsList",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (!isBarcode)
                buildProductList(response, container);
            if (isBarcode)
                buildPrintBarcode({ result: response.results, container: container })
        },
        error: function (response) { alert(response.responseText); }
    });
}

function buildPrintBarcode(options) {
    var $con = $("#" + options.container);
    jq = options.result;
    var ul = ""
    var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
    var ItemList = "";
    var c = 0
    for (var i = 0; i < List.length; i++) {
        if (c == 24)
            c = 0;
        var val = List[0, i];
        if (options.hasQuantity != undefined && options.hasQuantity)
            for (var Q = 0; Q < val.Quantity; Q++) {
                if (c == 24)
                    c = 0;
                ul += "<div dir='rtl' style=' width:24%; margin:4px; float:left; text-align: center;'><div  name='barcode' id=" + val.Barcode + "></div>";
                ul += val.Name + "</br>" + (val.ItemCode == null ? "" : val.ItemCode) + "</br>" + val.Regular + " تومان";
                ul += "</div>";
                if (c == 23)
                    ul += "<div style='page-break-after:always;'>---------------------</div>"
                c++;
            }
        else {
            ul += "<div dir='rtl' style=' width:24%; margin:4px; float:left; text-align: center;'><div  name='barcode' id=" + val.Barcode + "></div>";
            ul += val.Name + "</br>" + (val.ItemCode == null ? "" : val.ItemCode) + "</br>" + val.Regular + " تومان";
            ul += "</div>";
            if (c == 23)
                ul += "<div style='page-break-after:always;'>-----------------------</div>"
            c++;
        }
    }
    $con.append("<div id='divPrintBarcode' class='invisible'></div>");
    $con.find("#divPrintBarcode").html(ul);
    $con.find("#divPrintBarcode").find("[name='barcode']").each(function () {
        var $this = $(this);
        $this.barcode($this.attr("id"), "code39", { showHRI: true, barWidth: 1, barHeight: 20 })
    });
    // $con.find("#divPrintBarcode").dialog();
    Popup($con.find("#divPrintBarcode").html());
}


function buildProductList(jq, container) {
    var $con = $("#" + container);
    var table = {};
    var lstb = [];
    var lsth = [];
    jq = jq.results;
    lsth.push({ title: "نام کالا", sort: "Name" });
    lsth.push({ title: "کد کالا", sort: "ItemCode" });
    lsth.push({ title: "بارکد ", sort: "Barcode" });
    lsth.push({ title: "وضعیت" });
    lsth.push({ title: "گروه کالا" });
    lsth.push({ title: "موجودی" });
    //  lsth.push({ title: "واحد" });
    lsth.push({ title: "قیمت" });

    var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
    var ItemList = "";
    for (var i = 0; i < List.length; i++) {
        var val = List[0, i];
        var trBody = {};
        trBody[0] = { name: "name", html: val.Name };
        trBody[1] = { name: "code", html: val.ItemCode + "_" + val.Barcode }
        trBody[2] = { name: "barcode", html: val.Barcode };
        trBody[3] = { name: "status", html: val.Status };
        trBody[4] = { name: "Category", html: val.Category };
        trBody[5] = { name: "quantity", html: val.Quantity + " " + val.UnitType };
        //  trBody[6] = { name: "UnitType", html: val.UnitType };
        trBody[6] = { name: "Regular", html: "<span>" + val.Regular + "</span>" };
        lstb.push(trBody);
    }
    table = { header: lsth, body: lstb, container: container, hasFooter: false, divName: "Div_Print" };
    buildPrintTable(table);

}

function InventorypageselectCallback(page_index, jq, container, first) {
    var $con = $("#" + container);
    var barcode = "", name = "", code = "", price = "";
    if (first) {
        buildBarcodeList(jq, container);
    }
    else {
        first = false;
        var items_per_page = $con.find("#PageSize").val();
        var itemcontent = '';
        var take = items_per_page;
        var skip = page_index == 0 ? 0 : (page_index * take);
        if ($con.find("#divBarcodesearch").is(":visible")) {

            var search = $con.find("#ddl_d_SearchBy").val();
            if (search == "Barcode") {

                barcode = $con.find("#txt_s_Inventory").val();
            } if (search == "Name") {

                name = $con.find("#txt_s_Inventory").val();
            } if (search == "Code") {

                code = $con.find("#txt_s_Inventory").val();
            } if (search == "Price") {

                price = $con.find("#txt_s_Inventory").val();
            }

            //        if (container == "selectCustomerContent") {
            //            name = $con.find("#selectCustomerName").val();
            //            regname = $con.find("#selectCustomerRegisterer").val();
            //        }
            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': barcode, 'name': name, 'code': code, 'price': price, 'categoryid': getHierarchySelectedValue("hr_s_Category", container), 'status': $con.find("#ddl_s_Availability").val(), 'quantityfrom': $con.find("#quantityFrom").val(), 'quantityto': $con.find("#quantityTo").val(), 'regdatefrom': $con.find("#regdateFrom").val(), 'regdateto': $con.find("#regdateTo").val(), 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "GetItemsList" };
        }
        else {
            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': barcode, 'name': name, 'code': code, 'price': price, 'categoryid': getHierarchySelectedValue("hr_s_Category", container), 'status': $con.find("#ddl_s_Availability").val(), 'quantityfrom': $con.find("#quantityFrom").val(), 'quantityto': $con.find("#quantityTo").val(), 'regdatefrom': $con.find("#regdateFrom").val(), 'regdateto': $con.find("#regdateTo").val(), 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "GetItemsList" };
            //var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': $con.find("#CustomerSearchCode").val(), 'namefamily': $container.find("#CustomerSearchName").val(), 'introducer': $container.find("#CustomerSearchIndtroducerName").val(), 'registerername': $container.find("#CustomerSearchRegName").val(), 'agefrom': $container.find("#CustomerSearchAgeStart").val(), 'ageto': $container.find("#CustomerSearchAgeEnd").val(), 'regdatefrom': $container.find("#CustomerSearchRegDateStart").val(), 'regdateto': $container.find("#CustomerSearchRegDateEnd").val() };
        }
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/GetItemsList",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                buildBarcodeList(response, container);
            },
            error: function (response) { alert(response.responseText); }
        });

        return false;
    }
    Sort(getBarcodeList, container);
}



function buildBarcodeList(jq, pagingContainer) {
    var $con = $("#" + pagingContainer);
    $con.find("#divFooter").removeClass("invisible");
    var appName = jq.appName;
    var onlineHost = jq.onlineHost;
    var sumPrice = jq.sumPrice;
    var sumQuantity = jq.sumQuantity;
    var table = {};
    var lstb = [];
    var lsth = [];
    var details = {};
    lsth.push({ title: "barcode", sort: "Barcode", width: "10%" });
    lsth.push({ title: "itemCode", sort: "ItemCode", width: "9%" });
    lsth.push({ title: "itemName", sort: "Name", width: "13%" });
    lsth.push({ title: "price", sort: "Regular", width: "10%" });
    lsth.push({ title: "status", sort: "AvailablityId", width: "7%" });
    lsth.push({ title: "show", sort: "ShowOnline", width: "7%" });
    lsth.push({ title: "category", sort: "Category", width: "10%" });
    lsth.push({ title: "count", sort: "Quantity", width: "6%" });
    lsth.push({ title: "registerDate", sort: "EnteryDate", width: "12%" });
    lsth.push({ title: "image", width: "10%" });
    lsth.push({ title: "deleteKey", width: "4%" });
    jq = jq.results;
    var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
    var ItemList = "";
    for (var i = 0; i < List.length; i++) {
        var val = List[0, i];
        var trBody = {};
        trBody[0] = { trId: val.BarcodeId };
        trBody[1] = { name: "barcode", html: val.Barcode, width: "10%" };
        trBody[2] = { name: "code", html: val.ItemCode, width: "9%" };
        trBody[3] = { name: "name", html: val.Name, width: "13%" };
        trBody[4] = { html: val.Regular, props: { name: "price", klass: "digit", width: "10%"} };
        trBody[5] = { html: val.Status, width: "7%" };
        trBody[6] = { name: "ShowOnline", html: val.ShowOnline, props: { width: "7%"} };
        trBody[7] = { html: val.Category, props: { width: "10%"} };
        trBody[8] = { html: val.Quantity + " " + val.UnitType, props: { width: "6%"} };
        trBody[9] = { html: val.EnteryDate, props: { date: val.EnteryDate, width: "12%", klass: "date"} };
        trBody[10] = { html: "<img class='imagefortable' src='Data/" + appName + "Photos/" + val.Barcode + "/tiny_1.jpg'>", props: { width: "10%"} };
        lstb.push(trBody);
    }
    $con.find("#spTotalValue").html(sumPrice);
    $con.find("#spTotalQuantity").html(sumQuantity);
    table = { header: lsth, body: lstb, details: { rowClick: ClickBarcode }, heigth: 300, width: 500,
        container: pagingContainer, divName: "BarcodeList", hasFooter: false, rowClickParams: { textboxId: "CustomerIntroducerCode" }
    };
    if (pagingContainer != "divdialogCustomer") {
        details = { deleteFunction: RemoveBarcodeElement, rowClick: ClickBarcode };
        table = { header: lsth, body: lstb, details: details, heigth: 300, container: pagingContainer, hasFooter: false,
            divName: "BarcodeList"
        };
    }
    buildTable(table);
    if (pagingContainer == "divdialogCustomer")
        $con.dialog('open');
}


function RemoveBarcodeElement(barcodeid, container) {

    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{barcodeid: '" + barcodeid + "'}",
        type: "Post",
        url: "Management/DeleteBarcode",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isDone)
                getBarcodeList(container, { container: container, callbackmethod: getBarcodeList, fname: "", page_index: 0,
                    build: buildBarcodeList, servicename: "Management", methodname: "GetItemsList", print: false
                });
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function ClickBarcode($dis, container) {
    createSubTab({ row: $dis, name: "a_InventoryList" });
    onRowClick($dis);
}

function loadInventoryPhoto(barcodeid, container, first) {

    var $con = $("#" + container);
    if (first) {
        var barcode = $("#tr" + barcodeid).find("td[name='barcode']").html();
        $con.find("#hdBarcode").val(barcode);
        bindItemsForSelectCombo({ methodname: "GetColorListByBarcodeIdAll", servicename: "Management", id: "ddl_m_Color", container: container, headertext: "انتخاب رنگ", setcolor: true, showAlert: false }, { arg: barcodeid });
        $con.find("#fileInput").button()
        $con.find("#btn_Submit").button().unbind('click').click(function () {
            if (validateAll($("#" + container)))
                ajaxFileUpload({ container: container, barcode: barcode, isMenu: false });
        });
        getPhotos(barcode, container);
    }
}

function getPhotos(barcode, container) {
    var $con = $("#" + container);
    var ItemList = "";
    $.ajax({
        type: "POST",
        url: "Management/getPhotos",
        contentType: "application/json; charset=utf-8",
        data: "{ barcode:'" + barcode + "'}",
        success: function (response) {

            if (!isAuthenticated(response))
                return;
            if (!response.hasPhoto)
                return response.msg;
            var List = (typeof response.lphotos) == 'string' ? eval('(' + response.lphotos + ')') : response.lphotos;
            var appName = response.appName;
            if (appName == "/")
                appName = "";
            var ItemList = "<ul id='sortable'>";
            if (List != null)
                for (var i = 0; i < List.length; i++) {
                    var val = List[0, i];
                    ItemList += "<li style='cursor:move;' id='li" + i + "' class='ui-state-default'><div class='modalClose modalRemove'><a href='javascript:RemovePhoto(\"" + container + "\",\"li" + i + "\",\"" + barcode + "\");'/></div><img  title='" + val + "' alt='" + val + "' src='Data/" + appName + "Photos/" + val + "' /></li>";
                }
            ItemList += "</ul>";
            $con.find("#div_d_PhotoList").html(ItemList);

            $("#sortable").sortable().sortable({
                stop: function (event, ui) { sortPhotos(barcode, container) }
            });
            //  $("#spinner").hide();
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

function sortPhotos(barcode, container) {
    var $con = $("#" + container);
    var photoList = [];

    $.each($("#sortable li").find("img"), function () {
        photoList.push(this.alt);
    });
    var DTO = { 'photos': photoList, 'barcode': barcode };

    var ItemList = "";
    $.ajax({
        type: "POST",
        url: "Management/sortPhotos",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var lis = $con.find("#sortable li");
            var List = (typeof response.lphotos) == 'string' ? eval('(' + response.lphotos + ')') : response.lphotos;
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                $(lis[i]).find("img").attr("alt", val).attr("title", val);
            }
        },
        error: function (response) { alert(response.responseText); }
    });
}

function RemovePhoto(container, liId, barcode) {
    //  var barcode = alt.split('/')[0];
    var $con = $("#" + container);
    var alt = $con.find("#" + liId).children("img").prop("alt");
    var DTO = { 'fileName': alt, 'barcode': barcode };
    var ItemList = "";
    $.ajax({
        type: "POST",
        url: "Management/deletePhoto",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            $con.find("#sortable li[id='" + liId + "']").remove();
            if ($con.find("#sortable li").length > 1)
                sortPhotos(barcode, container)
        },
        error: function (response) { alert(response.responseText); }
    });
}

function loadInventoryRestriction(barcodeId, container, first) {
    var $con = $("#" + container);
    if (first) {
        $con.find("#hvBarcodeId").val(barcodeId);
        bindRawDropDownData({ id: "divRestriction", container: container, path: "restriction", canmodify: true, istext: false, headertext: "انتخاب گروه ", css: "selectsmall " });
        $con.find("#btnEditProfile").button({
            icons: {
                primary: "ui-icon-disk"
            }
        }).unbind().click(function () {
            if (validateAll($("#" + container)))
                UpdateOnlineProfile(barcodeId, container);
        });

        getItemRestrictionList(container, { container: container, callbackmethod: getItemRestrictionList, fname: "", page_index: 0,
            build: buildItemRestrictionList, servicename: "Management", methodname: "GetItemRestrictionList", print: false, barcodeId: barcodeId
        });

        $con.find("#btnAddRestriction").button({
            icons: {
                primary: "ui-icon-cross"
            }
        })

        $con.find('#itemRestriction').ajaxForm({
            // target: '#fileInput',
            data: { restrictionId: $con.find("#divRestriction option:selected").val(), barcodeId: barcodeId },

            success: function () {

            },
            complete: function (xhr) {
                getItemRestrictionList(container, { container: container, callbackmethod: getItemRestrictionList, fname: "", page_index: 0,
                    build: buildItemRestrictionList, servicename: "Management", methodname: "GetItemRestrictionList", print: false, barcodeId: barcodeId
                });
            }
        });
    }
}

function getItemRestrictionList(container, params) {
    var $con = $("#" + container);
    if (params.page_index > 0) {
        params.first = false;
    }
    var DTO = { barcodeId: params.barcodeId };
    params["DTO"] = DTO;
    pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
        first: true, isOrder: false
    });
}

function buildItemRestrictionList(jq, container) {
    var $con = $("#" + container.pagingContainer);
    var table = {};
    var lstb = [];
    var lsth = [];
    var details = {};
    lsth.push({ title: "restriction", width: "80%" });


    var List = (typeof jq.restrictionList) == 'string' ? eval('(' + jq.restrictionList + ')') : jq.restrictionList;
    var ItemList = "";
    if (List != null)
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            if (!container.params.print)
                trBody[0] = { trId: val.RestrictionId };
            trBody[1] = { name: "restriction", id: val.RestrictionId, html: val.Restriction, width: "80%" };

            lstb.push(trBody);
        }
    var details = { deleteFunction: DeleteItemRestriction };
    table = { header: lsth, body: lstb, details: details, heigth: 300,
        container: container.pagingContainer, divName: "itemRestrictionList", hasFooter: false
    };
    buildTable(table);
}
function DeleteItemRestriction(dis, container) {
    var $con = $("#" + container);
    var $dis = $("#tr" + dis);
    var DTO = { 'barcodeId': $con.find("#hvBarcodeId").val(), 'restrictionId': dis };
    $.ajax({
        type: "POST",
        url: "/Management/DeleteItemRestriction",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isDone == false) {
                alert(response.msg);
                return;
            }
            if (response != null && response.isDone == true)
                $dis.remove();
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

//$con.find('#itemRestriction').ajaxForm({
//    // target: '#fileInput',
//    data: { priorityId: ($("#" + options.container).find("#sortable li").length * 1 + 1) },

//    success: function () {
//        if (options.isMenu)
//            getMenuPhotos(options.id, options.container);
//        else if (options.isLogo)
//            getOnlineLogo(options.container);
//        else if (options.isSlider)
//            getOnlineSliderShow(options.container);
//        else
//            getPhotos(options.barcode, options.container);
//    },
//    complete: function (xhr) {
//        status.html(xhr.responseText);
//    }
//});

//function AddItemRestriction(barcodeId, container) {
//    var $con = $("#" + container);
//    var DTO = { 'restrictionId': $con.find("#divRestriction option:selected").val() };
//    $.ajax({
//        type: "POST",
//        url: "/Management/AddItemRestriction",
//        contentType: "application/json; charset=utf-8",
//        data: JSON.stringify(DTO),
//        success: function (response) {
//            if (!isAuthenticated(response))
//                return;
//            if (response.isdone == false) {
//                alert(response.msg);
//                return;
//            }
//            if (response != null && response.isdone == true)
//                getItemRestrictionList(container, { container: container, callbackmethod: getItemRestrictionList, fname: "", page_index: 0,
//                    build: buildItemRestrictionList, servicename: "Management", methodname: "GetItemRestrictionList", print: false, barcodeId: barcodeId
//                });
//        },
//        error: function (response) {
//            alert(response.responseText);
//        }
//    });
//}


function loadCommentList(container, first) {
    sortid = 'CommentId desc';
    if (first) {
        var $con = $("#" + container);
        $con.find("#dialog").attr("id", "dialog" + container);
        bindHierarchyData({ id: "hr_s_Category", table: "category", container: container, styleclass: "PagingSelect " });
        bindItemsForSelectCombo({ methodname: "getAvailablity", servicename: "Management", id: "ddl_s_Availability", container: container, headertext: "وضعیت کالا" });
        $con.find("#btnSearchInventory").unbind('click').click(function () {
            getCommentList(container, { container: container, callbackmethod: getCommentList, fname: "", page_index: 0,
                build: buildCommentList, servicename: "Management", methodname: "GetCommentList", print: false
            });
        }).button({ icons: {
            primary: "ui-icon-search"
        }
        });
        $con.find("#PageSize").unbind('change').change(function () {
            getCommentList(container, { container: container, callbackmethod: getCommentList, fname: "", page_index: 0,
                build: buildCommentList, servicename: "Management", methodname: "GetCommentList", print: false
            });
        });
        $con.find("#regdateFrom").datepicker({ changeMonth: true, changeYear: true,
            onSelect: function (dateText, inst) {
                $('#regdateTo').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
            }
        });
        $con.find("#regdateTo").datepicker({ changeMonth: true, changeYear: true });
    }

}

function getCommentList(container, params) {
    var $con = $("#" + container);
    var first = true;
    var take = $con.find("#PageSize").val();
    var skip = 0;
    var page_index = 0
    var barcode = "", name = "", code = "", price = "";
    if ($con.find("#divBarcodesearch").is(":visible")) {

        var search = $con.find("#ddl_d_SearchBy").val();
        if (search == "Barcode") {

            barcode = $con.find("#txt_s_Inventory").val();
        } if (search == "Name") {

            name = $con.find("#txt_s_Inventory").val();
        } if (search == "Code") {

            code = $con.find("#txt_s_Inventory").val();
        } if (search == "Price") {

            price = $con.find("#txt_s_Inventory").val();
        }
        var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
            'barcode': barcode, 'name': name, 'code': code, 'price': price, 'categoryid': getHierarchySelectedValue("hr_s_Category", container),
            'status': $con.find("#ddl_s_Availability").val(), 'quantityfrom': $con.find("#quantityFrom").val(), 'quantityto': $con.find("#quantityTo").val(),
            'regdatefrom': $con.find("#regdateFrom").val(), 'regdateto': $con.find("#regdateTo").val(), 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "GetItemsList"
        };
    }
    else {
        var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
            'barcode': barcode, 'name': name, 'code': code, 'price': price, 'categoryid': getHierarchySelectedValue("hr_s_Category", container),
            'status': $con.find("#ddl_s_Availability").val(), 'quantityfrom': $con.find("#quantityFrom").val(), 'quantityto': $con.find("#quantityTo").val(),
            'regdatefrom': $con.find("#regdateFrom").val(), 'regdateto': $con.find("#regdateTo").val(), 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "GetItemsList"
        };
    }
    params["DTO"] = DTO;
    pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
        first: true, isOrder: true
    });
}
//
function buildCommentList(jq, container) {
    var $con = $("#" + container.pagingContainer);
    var table = {};
    var lstb = [];
    var lsth = [];
    var details = {};
    lsth.push({ title: "نام کالا", sort: "inv_Barcode.Name", width: "15%" });
    lsth.push({ title: "customerName", sort: "p_Customer.p_Person.Family", width: "15%" });
    lsth.push({ title: "date", sort: "Date", width: "15%" });
    lsth.push({ title: "comment ", sort: "Comment", width: "35%" });
    lsth.push({ title: "isConfirmed ", sort: "IsConfirmed", width: "9%" });
    if (!container.params.print) {
        lsth.push({ title: "edit" });
        lsth.push({ title: "details" });
    }
    var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
    var ItemList = "";
    if (List != null)
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            if (!container.params.print)
                trBody[0] = { trId: val.CommentId };
            trBody[1] = { name: "name", html: val.Name + "_" + val.ItemCode + "_" + val.Barcode, width: "15%" };
            trBody[2] = { name: "family", html: val.CustomerName + " " + val.Family + "_" + val.Code, width: "15%" };
            trBody[3] = { props: { date: val.Date, name: "date", width: "15%", klass: "dateLong" }, html: val.Date };
            trBody[4] = { name: "comment", html: val.Comment, tooltip: 150, width: "35%" };
            trBody[5] = { name: "isConfirmed", html: (val.IsConfirmed == false ? ("<input type='checkbox' id='checkConfirm' />") : ("<input checked type='checkbox' id='checkConfirm' />")), width: "9%" };
            lstb.push(trBody);
        }

    table = { header: lsth, body: lstb, details: { deleteFunction: DeleteComment, editFunction: getComment, confirmFunction: ConfirmComment }, heigth: 300,
        container: container.pagingContainer, divName: "CommentList", hasFooter: true
    };
    buildTable(table);
}
function DeleteComment(commentId, container) {
    var $con = $("#" + container);

    var DTO = { 'commentId': commentId };
    $.ajax({
        type: "POST",
        url: "Management/DeleteComment",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response != null && response.isDone == true)
                $con.find("#tr" + commentId).remove();
            translate(response.msg);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
};
function getComment(dis, container) {
    $con = $("#" + container);
    $dis = $(dis);
    $dialog = $("#dialog" + container);
    $dialog.dialog(); //.dialog("close");
    $dialog.find("#txtComment").val($dis.parents("tr").find("[name='comment']").html());
    $dialog.find("#btn_EditComment").button({ icons: {
        primary: "ui-icon-disk"
    }
    }).unbind('click').click(function () {
        EditComment($dis.parents("tr").prop("id").replace("tr", ""), container);
    });

};
function EditComment(commentId, container) {
    $con = $("#" + container);
    var DTO = { 'commentId': commentId, 'comment': $("#dialog" + container).find("#txtComment").val() };
    $.ajax({
        type: "POST",
        url: "Management/EditComment",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response != null && response.isDone == true)
            // $con.find("#tr" + $dis.parents("tr").prop("id").replace("tr", "")).remove();
                translate(response.msg);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
};
function ConfirmComment(dis, container) {
    $con = $("#" + container);
    $dis = $(dis);

    var DTO = { 'commentId': $dis.parents("tr").prop("id").replace("tr", ""), 'isConfirmed': $dis.parents("tr").find("[id='checkConfirm']").prop("checked") };
    $.ajax({
        type: "POST",
        url: "Management/ConfirmComment",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response != null && response.isDone == true)
            // $con.find("#tr" + commentId).remove();
                translate(response.msg);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
};


//---------------------onlineProperty begin-----------------------

function loadInventoryEdit(barcodeid, container, first) {
    if (first) {
        var $con = $("#" + container);
        GetSingelBarcode(barcodeid, container);
        $con.find("#btn_Submit").die().live('click', function () {
            if (validateAll($("#" + container)))
                EditBarcode(barcodeid, container);
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });
    }
}

function GetSingelBarcode(barcodeid, container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        url: "Management/GetSingleBarcode",
        contentType: "application/json; charset=utf-8",
        data: "{barcodeid: '" + barcodeid + "' }",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            bindItemsForSelectCombo({ async: false, methodname: "getAvailablity", servicename: "Management", id: "ddl_m_Availability", container: container, headertext: "وضعیت کالا" });
            var ItemVal = (typeof response.result) == 'string' ? eval('(' + response.result + ')') : response.result;
            var item = ItemVal[0];
            $con.find("#txt_m_Barcode").val(item.Barcode)
            $con.find("#txt_m_Name").val(item.Name)
            $con.find("#txt_m_ItemCode").val(item.ItemCode);
            $con.find("#ddl_m_Availability").val(item.AvailablityId);
            $con.find("#ddl_m_ShowOnline").val("" + item.ShowOnline + "");
            $con.find("#ddl_m_IsNew").val("" + item.IsNew + "");
            $con.find("#ddl_m_IsSale").val("" + item.IsSale + "");
            $con.find("#ddl_m_IsOffer").val("" + item.IsOffer + "");
            $con.find("#txt_m_Weight").val(item.Weight);
            $con.find("#txt_m_Description").val(item.Description);
        },
        error: function (response) { alert(response.responseText); }
    });

}

function EditBarcode(barcodeid, container) {
    var $con = $("#" + container);
    var DTO = { 'barcodeid': barcodeid, 'barcode': $con.find("#txt_m_Barcode").val(), 'name': $con.find("#txt_m_Name").val(), 'itemcode': $con.find("#txt_m_ItemCode").val(), 'availibilityid': $con.find("#ddl_m_Availability").val(), 'discription': $con.find("#txt_m_Description").val(), 'weight': $con.find("#txt_m_Weight").val(), 'showOnline': $con.find("#ddl_m_ShowOnline").val() };
    $.ajax({
        type: "POST",
        url: "Management/EditBarcode",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.msg);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}
//---------------------onlineProperty End---------------------------

//---------------itemDefinition begin----------------------------


function loadItemDefinition(barcodeid, container, first) {
    var $con = $("#" + container);
    if (first) {
        getItemDefinition(barcodeid, container);
    }
}

function getItemDefinition(barcodeid, container) {
    var $con = $("#" + container);
    var DTO = { 'barcodeId': barcodeid };
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: "Management/GetItemDefinition",
        success: function (response) {
            if (response.canEdit) {
                $con.find("#divDefinition").html("<textarea class='editor' name='txtDefinition'>" + (response.isDone ? response.result == null ? "" : response.result : "") +
                "</textarea></n><button id='btnSaveDefintion'>save</button>");
                $con.find(".editor").tinymce({
                    // Location of TinyMCE script
                    script_url: '../../Scripts/tinymce/tiny_mce.js',
                    width: "100%",
                    height: "500px",
                    directionality: "rtl",
                    theme: "advanced",
                    verify_html: false,
                    plugins: "pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,autosave",
                    theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                    theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                    theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                    theme_advanced_buttons4: "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak,restoredraft,codehighlighting,netadvimage",
                    theme_advanced_toolbar_location: "top",
                    theme_advanced_toolbar_align: "right",
                    theme_advanced_statusbar_location: "bottom",
                    theme_advanced_resizing: false,

                    // Example content CSS (should be your site CSS)
                    content_css: '../../Scripts/tinymce/css/content.css',
                    convert_urls: false

                });

                $con.find("#btnSaveDefintion").button().unbind('click').bind('click', function () {
                    AddItemDefinition(barcodeid, container);
                });
            }
            else {
                $con.find("#divDefinition").html((response.isDone ? "<div style='padding-left:5em;'>" + response.result + "</div>" : ""));
            }
        },
        error: function (response) { alert(response.responseText); }
    });
}
function AddItemDefinition(barcodeId, container) {
    var $con = $("#" + container);
    var DTO = { 'barcodeId': barcodeId, 'definition': $con.find("[name='txtDefinition']").val() };
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: "Management/AddItemDefinition",
        success: function (response) {
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

//--------------itemDefinition end------------------------------

//---------------itemProperty Begin----------------------------

function loadItemProperty(barcodeid, container, first) {
    if (first) {
        var $con = $("#" + container);

        var $dialogAdd = $con.find("#dialogAddProperty").attr("id", container + "dialogAddProperty")
        $con.find("#barcodeid").val(barcodeid);
        getProperty(barcodeid, container + "dialogAddProperty", container);
        bindHierarchyData({ id: "divProperty", container: container, table: "property", canmodify: true });
        $con.find("#btn_properties").button({
            icons: {
                primary: "ui-icon-plusthick"
            }
        }).unbind().click(function () {
            getAllProperties(barcodeid, container + "dialogAddProperty", container);
        });

        $con.find("#btn_updateProperties").button({
            icons: {
                primary: "ui-icon-plusthick"
            }
        }).unbind().click(function () {
            updateProperties(barcodeid, container);
        });

        $con.find("#btn_new").button({
            icons: {
                primary: "ui-icon-plusthick"
            }
        }).unbind().click(function () {
            $dialogAdd.find("input, select").val("");
            $dialogAdd.find("#btn_save").button({
                icons: {
                    primary: "ui-icon-disk"
                }
            }).unbind().click(function () {
                //                if (validateAll( $con.find("#dialogAddUnit")))
                AddProperty(barcodeid, container + "dialogAddProperty", container);
            });



            bindHierarchyData({ id: "divPropertyAdd", container: container + "dialogAddProperty", table: "property", canmodify: true });
            $dialogAdd.dialog(open).dialog({ width: 500 });
        });
        aComplete({ methodname: "GetCompletionListByProperty", servicename: "Management", id: "txtPropertyValueAdd", boxId: "txtPropertyValueAdd", container: container + "dialogAddProperty", minlength: 2, autofocus: false, limit: 20, data: { propertyId: "divPropertyAdd"} });
    }
}
function getAllProperties(barcodeid, dialog, container) {
    var $con = $("#" + container);
    var DTO = { 'barcodeid': barcodeid, 'propertyId': getHierarchySelectedValue("divProperty", container) };
    $.ajax({
        type: "POST",
        data: JSON.stringify(DTO),
        url: "Management/getAllPropertys",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            //                if(response.isdone)
            //            GetPropertyList(barcodeid, container)
            var table = "<table class='table' ><tbody>";
            var group = (typeof response.properties) == 'string' ? eval('(' + response.properties + ')') : response.properties;
            for (var j = 0; j < group.length; j++) {
                var val = group[0, j];
                table += "<tr ><td style=' font-weight: bold; background-color: #CCFFCC' colspan='3'>" + val.Property + "</td></tr>";
                var Properties = (typeof val.properties) == 'string' ? eval('(' + val.properties + ')') : val.properties;
                // table += "<tr  style='direction:ltr'>"
                for (var p = 0; p < Properties.length; p++) {
                    var val = Properties[0, p];
                    var subProperty = "<option value=''>انتخاب کنید</option>";
                    for (var sp = 0; sp < val.properties.length; sp++) {
                        var sval = val.properties[0, sp];
                        subProperty += "<option " + ($.inArray(sval.PropertyId, response.propertyIds) != -1 ? "selected" : "") + " value='" + sval.PropertyId + "' >" + sval.Property + "</option>"
                    }
                    table += "<tr id='tr" + val.PropertyId + "'><td>" + val.Property + "</td>" +
                    "<td><select propertyId='" + val.PropertyId + "' >" +
                     subProperty
                    + "</select ></td>" +
                     "<td><input  />" +
                     "</td></tr>";
                }
                // table += "</tr>";
            }
            table += "</tbody></table>"
            $con.find("#itemProperty").html(table);
            $con.find("#itemProperty").tableScroll({ height: 380, width: contentwidth, flush: false });
            $con.find("[id=btnDelete]").button({


        });

        $con.find("[id=btnDelete]").button({
            icons: {
                primary: "ui-icon-closethick"
            },
            text: false
        }).unbind().click(function () {
            var d = this;
            if (confirm("آیا از حذف مطمئن هستید؟"))
                deleteProperty($(this).attr("propId"), barcodeid, container + "dialogAddProperty", container);
            else
                return;
        });
        //        $con.find("table").find("input:text").each(function () {
        //            aComplete({ methodname: "GetCompletionListByProperty", servicename: "Management", id: $(this).attr("id"), boxId: $(this).attr("id"), container: container, minlength: 2, autofocus: false, limit: 20, data: { propertyId: $(this).attr("propertyId")} });
        //        });
        //        $con.find("table").find("input:text").each(function () {
        //            aComplete({ methodname: "GetCompletionListByProperty", servicename: "Management", id: $(this).attr("id"), boxId: $(this).attr("id"), container: container, minlength: 2, autofocus: false, limit: 20, data: { propertyId: $(this).attr("propertyId")} });
        //        });
    },
    error: function (response) { alert(response.responseText); }
});
}
function getProperty(barcodeid, dialog, container) {
    var $con = $("#" + container);
    var DTO = { 'barcodeid': barcodeid };
    $.ajax({
        type: "POST",
        data: JSON.stringify(DTO),
        url: "Management/getProperty",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            //                if(response.isdone)
            //            GetPropertyList(barcodeid, container)
            var table = "<table class='table' ><tbody>";
            var group = (typeof response) == 'string' ? eval('(' + response + ')') : response;
            for (var j = 0; j < group.length; j++) {
                var val = group[0, j];
                table += "<tr ><td colspan='3'>" + val.Property + "</td></tr>";
                var Properties = (typeof val.properties) == 'string' ? eval('(' + val.properties + ')') : val.properties;
                // table += "<tr  style='direction:ltr'>"
                for (var p = 0; p < Properties.length; p++) {
                    var val = Properties[0, p];
                    table += "<tr id='tr" + val.PropertyId + "'><td>" + val.Property + "</td><td>" + val.Value + "</td><td id='delete'><button propId='" + val.PropertyId + "' id='btnDelete'>deleteKey</button></td></tr>";
                }
                // table += "</tr>";
            }
            table += "</tbody></table>"
            $con.find("#itemProperty").html(table);
            $con.find("#itemProperty").tableScroll({ height: 380, width: contentwidth, flush: false });
            $con.find("[id=btnDelete]").button({
                icons: {
                    primary: "ui-icon-closethick"
                },
                text: false
            }).unbind().click(function () {
                var d = this;
                if (confirm("آیا از حذف مطمئن هستید؟"))
                    deleteProperty($(this).attr("propId"), barcodeid, container + "dialogAddProperty", container);
                else
                    return;
            });
        },
        error: function (response) { alert(response.responseText); }
    });
}
function AddProperty(barcodeid, dialog, container) {
    var $con = $("#" + dialog);
    var DTO = { 'barcodeid': barcodeid, 'propertyId': getHierarchySelectedValue("divPropertyAdd", dialog),
        'value': $con.find("#txtPropertyValueAdd").val()
    };
    $.ajax({
        type: "POST",
        data: JSON.stringify(DTO),
        url: "Management/AddProperty",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isDone)
                getProperty(barcodeid, container + "dialogAddProperty", container);
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}
function updateProperties(barcodeid, container) {

    var $con = $("#" + container);

    var propList = [];

    $con.find("table[propertyId]").each(function () {
        var prop = {}
        prop["value"] = $(this).parent().parent().find("input[property]:text").val();
        prop["main"] = $(this).parent().parent().find("input[main]:text").val();
        //        prop["propertyId"] = $(this).val();
        prop["id"] = $(this).attr("propertyId");

        var propertyId = [];
        $con.find("input:checkbox:checked").each(function () {

            propertyId.push($(this).val());
        });
        prop["propertyId"] = propertyId;
        propList.push(prop);
    });
    var DTO = { 'barcodeid': barcodeid, 'propList': propList
    };
    $.ajax({
        type: "POST",
        data: JSON.stringify(DTO),
        url: "Management/UpdateProperties",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isDone)
                getAllProperties(barcodeid, container, container);

            // alert("done");
            //getProperty(barcodeid, container + "dialogAddProperty", container);
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}
function deleteProperty(propertyId, barcodeId, dialog, container) {
    var $con = $("#" + container);
    var DTO = { 'propertyId': propertyId, 'barcodeId': barcodeId };
    $.ajax({
        type: "POST",
        data: JSON.stringify(DTO),
        url: "Management/deleteProperty",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isDone)
                $con.find("#tr" + propertyId).remove();
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}


function buildPropertyList(jq, container) {
    var $con = $("#" + container);
    var table = {};
    var lstb = [];
    var lsth = [];
    lsth.push({ title: "واحد کالا", sort: "", width: "30%" });
    lsth.push({ title: "تعداد", width: "30%" });
    lsth.push({ title: "تخفیف واحد", width: "25%" });
    lsth.push({ title: "ویرایش/حذف", width: "15%" });
    var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
    var ItemList = "";
    for (var i = 0; i < List.length; i++) {
        var val = List[0, i];
        var trBody = {};
        trBody[0] = { trId: val.MeasureUnitId };
        trBody[1] = { name: "unit", html: val.UnitType, width: "30%" };
        trBody[2] = { name: "quantity", html: val.Quantity, width: "30%" };
        trBody[3] = { name: "discount", html: val.DiscountPercentage, width: "25%" };
        lstb.push(trBody);
    }
    var details = { editFunction: BindItemsForEditUnit, deleteFunction: DeleteUnit };
    table = { header: lsth, body: lstb, details: details, container: container, divName: "UnitTable" };
    buildTable(table);
}

//---------------itemProperty End------------------------------

//------------------MatchingBarcode begin------------------
function loadItemMatchingBarcode(barcodeid, container, first) {
    var $con = $("#" + container);
    if (first) {
        $con.find("#hd_barcodeId").val(barcodeid);
        $con.find("#btn_save").unbind().click(function () {
            addMatchingBarcode(barcodeid, container);
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });
        getMatchingBarcodes(barcodeid, container);
        aComplete({ methodname: "GetCompletionListByItemName", servicename: "Management", id: "txt_matchedBarcode", container: container, minlength: 2, autofocus: false, limit: 10, boxId: "txt_matchedBarcode", data: { Status: 1 }, selectBarcode: true });
    }
}
function addMatchingBarcode(barcodeid, container) {
    var $con = $("#" + container);
    var DTO = { 'barcodId': barcodeid, 'matchedBarcode': $con.find("#txt_matchedBarcode").val(), 'discountPer': $con.find("#txt_discountPer").val(),
        'countBarcode': $con.find("#txt_countBarcode").val(), 'countMatched': $con.find("#txt_countMatched").val()
    };
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: "Management/addMatchingBarcode",
        success: function (response) {
            if (response.isdone)
                getMatchingBarcodes(barcodeid, container);
        },
        error: function (response) { alert(response.responseText); }
    });
}
function getMatchingBarcodes(barcodeid, container) {
    var $con = $("#" + container);
    var DTO = { 'barcodeId': barcodeid };
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: "Management/getMatchingBarcodes",
        success: function (response) {
            if (response.isdone)
                buildMatchingBarcodes(response, container);
        },
        error: function (response) { alert(response.responseText); }
    });
}
function buildMatchingBarcodes(jq, container) {
    var $con = $("#" + container.pagingContainer);
    var table = {};
    var lstb = [];
    var lsth = [];
    jq = jq.results;
    lsth.push({ title: "matchingBarcode", width: "55%" });
    lsth.push({ title: "countProduct", width: "10%" });
    lsth.push({ title: "countMached", width: "10%" });
    lsth.push({ title: "discountPer", width: "15%" });
    lsth.push({ title: "delete", width: "10%" });
    var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
    var ItemList = "";
    if (List != null)
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            var name = val.Name != null ? val.Name : "";
            var code = val.ItemCode != null ? val.ItemCode : "";
            var barcode = val.Barcode != null ? val.Barcode : "";
            trBody[0] = { trId: val.MatchingItemId };
            trBody[1] = { name: "matchingBarcode", html: (name + " " + code + " " + barcode), width: "55%" };
            trBody[2] = { name: "countProduct", html: val.Quantity, width: "10%" };
            trBody[3] = { name: "countMached", html: val.MatchingQuantity, width: "10%" };
            trBody[4] = { name: "discountPer", html: val.DiscountPercentage == true ? val.amount : "", width: "15%" };
            lstb.push(trBody);
        }
    var details = { deleteFunction: DeleteMatchingBarcode
    };
    table = { header: lsth, body: lstb, heigth: 300, container: container, divName: "MachingBarcodeslist", details: details, hasFooter: false };
    buildTable(table);
}

function DeleteMatchingBarcode(MatchingItemId, container) {
    var $con = $("#" + container);
    var DTO = { 'matchingItemId': MatchingItemId };
    $.ajax({
        type: "POST",
        url: "Management/DeleteMatchingBarcode",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response != null && response.isDone == true) {
                $con.find("#tr" + MatchingItemId).remove();
                return true;
            }
            translate(response.msg)
        },
        error: function (response) {
            alert(response.responseText);

        }
    });
}



//------------------MatchingBarcode end--------------------

//---------------- Color Detail begin-----------------
function loadColorSize(barcodeid, container, first) {
    if (first) {
        var $con = $("#" + container);
        getColor(container);
        getSize(container);
        $con.find("#btn_Submit").off().on('click', function () {
            if (validateAll($("#" + container)))
                addSizeColor(barcodeid, container);
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });
    }
}

function getColor(container) {
    var $con = $("#" + container);
    var ItemList = "";
    $.ajax({
        type: "POST",
        url: "Management/GetColorList",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var List = (typeof response) == 'string' ? eval('(' + response + ')') : response;
            var ItemList = "";
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                ItemList += "<div class='unit CheckBox' style='background-color:" + val.name + ";'><input name='cd_Color' id='" + val.id + "' type='checkbox' id='cb_d_SizeColor' value='" + val.id + "'   /></div>";
            }
            $con.find("#divColor").html(ItemList);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function getSize(container) {
    var $con = $("#" + container);
    var ItemList = "";
    $.ajax({
        type: "POST",
        url: "Management/GetSizeParent",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var List = (typeof response) == 'string' ? eval('(' + response + ')') : response;
            var ItemList = "";
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                ItemList += " <h3><a href='#' >" + val.Size + "</a></h3><div id='div_" + val.SizeId + "'></div>";
            }
            $con.find("#divSizeAccordion").html(ItemList);
            $con.find("#divSizeAccordion").accordion({ heightStyle: "content", collapsible: true, active: false,
                activate: function (event, ui) { if (ui.newPanel.length > 0 && ui.newPanel.html().length < 1) getSizeChild(ui.newPanel.prop('id').replace("div_", ""), container) }
            });
        },
        error: function (response) { alert(response.responseText); }
    });
}

function getSizeChild(sizeid, container) {
    var $con = $("#" + container);
    var ItemList = "";
    $.ajax({
        type: "POST",
        url: "Management/GetSizeChild",
        data: "{parentid: '" + sizeid + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var List = (typeof response) == 'string' ? eval('(' + response + ')') : response;
            var ItemList = "<div id='divSizeContent'>";
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                ItemList += "<div class='unit CheckBox' ><label for='size' class=' unit label label75'>" + val.Size + "</label><input name='cd_Size' id='" + val.SizeId + "' type='checkbox' id='cb_d_SizeColor' value='" + val.SizeId + "'  class='unit' /></div>";
            }
            ItemList += "</div>";
            $con.find("#div_" + sizeid).html(ItemList);
            //            $con.find("#divSizeAccordion").accordion("resize");
            $con.find("#divSizeAccordion").accordion({ collapsible: true, heightStyle: "content" });
        },
        error: function (response) { alert(response.responseText); }
    });
}


function addSizeColor(barcodeid, container) {
    var $con = $("#" + container);
    var SizeList = [];
    var ColorList = [];

    $.each($con.find("input:checkbox[name=cd_Color]"), function () {
        if (this.checked)
            ColorList.push(this.value);
    });
    $.each($con.find("input:checkbox[name=cd_Size]"), function () {
        if (this.checked)
            SizeList.push(this.value);
    });
    var DTO = { 'barcodeid': barcodeid, 'colorlist': ColorList, 'sizelist': SizeList, 'price': $con.find("#txt_Price").val(), 'noColorSize': $con.find("input:checkbox[id=cb_d_SizeColor]").is(":checked") };
    $.ajax({
        type: "POST",
        data: JSON.stringify(DTO),
        url: "Management/AddSizeColor",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function getListColor_Size(barcodeid, container) {
    var $con = $("#" + container);
    var ItemList = "";
    $.ajax({
        type: "POST",
        data: "{barcodeid: '" + barcodeid + "'}",
        url: "Management/GetColor_Size",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var List = (typeof response) == 'string' ? eval('(' + response + ')') : response;
            var ItemList = "";
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                ItemList += "<tr id='tr" + val.ItemDetailId + "'>" +
                "<td id='Size_" + val.SizeId + "' width='20%'>" + val.Size + "</td>" +
                "<td width='15%' style='background-color:" + val.Color + ";'></td>" +
                "<td id='Color_" + val.ColorId + "' width='25%'>" + val.Color + "</td>" +
                "<td name='price' width='25%'>" + val.DetailPrice + "</td>" +
                "<td id='delete' width='15%'><div><button name='delete' id='a_Button'>deleteKey</button></td></tr>";
                //<a href='javascript:RemoveItemElement(" + val.ItemDetailId + ",\"" + container + "\",\"" + barcodeid + "\" );'/></div>
            }
            $con.find("#ListColor_Size").html(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
            //$con.find("#ListColor_Size").parent().tableScroll({ height: 380 });
            //  TableAlter(container);
            $con.find("button[id=a_Button]").button({
                icons: {
                    primary: "ui-icon-closethick"
                },
                text: false
            }).click(function () {
                if (confirm("آیا از حذف مطمئن هستید؟"))
                    RemoveItemElement($(this).parents("tr").prop("id").replace("tr", ""), container, barcodeid);
                else
                    return;
            });
            $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
                ClickColorSize($(this).parent("tr"), container)
            }).addClass("cursor");
        },
        error: function (response) { alert(response.responseText); }
    });
}

function RemoveItemElement(itemid, container, barcodeid) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        data: "{itemid: '" + itemid + "'}",
        url: "Management/DeleteItem",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            getListColor_Size(barcodeid, container);
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}


function ClickColorSize($dis, container) {
    var $con = $("#" + container);
    $con.find("#ddl_m_Size").val($dis.find("td[id*=Size_]").prop("id").replace("Size_", ""));
    $con.find("#ddl_m_Color").val($dis.find("td[id*=Color_]").prop("id").replace("Color_", ""));
    $con.find("#txt_m_Price").val($dis.find("td[name=price]").html() == "null" ? "" : $dis.find("td[name=price]").html());
    $con.find("#hd_m_itemid").val($dis.prop("id").replace("tr", ""));
}

function EditColor_Size(barcodeid, container) {

    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        data: "{itemid: '" + $con.find("#hd_m_itemid").val() + "',sizeid:'" + ($con.find("#ddl_m_Size").val() == null ? "" : $con.find("#ddl_m_Size").val()) + "',colorid:'" + ($con.find("#ddl_m_Color").val() == null ? "" : $con.find("#ddl_m_Color").val()) + "',price:'" + $con.find("#txt_m_Price").val() + "'}",
        url: "Management/EditColor_Size",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            getListColor_Size(barcodeid, container);
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

//----------------Color Detail End-------------------

function loadInventoryPrice(barcodeid, container, first) {
    if (first) {
        var $con = $("#" + container);
        getListPrice(barcodeid, container);
        $con.find("#txt_m_Date").attr("id", container + "txt_m_Date");
        $con.find("#" + container + "txt_m_Date").datepicker({ changeMonth: true, changeYear: true });

        $con.find("#btn_Submit").button().unbind('click').click(function () {
            if (validateAll($("#" + container)))
                AddPrice(barcodeid, container);
        });
    }
}

function getListPrice(barcodeid, container) {
    var $con = $("#" + container);
    var ItemList = "";
    $.ajax({
        type: "POST",
        data: "{barcodeid: '" + barcodeid + "'}",
        url: "Management/GetPrice",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var List = (typeof response) == 'string' ? eval('(' + response + ')') : response;
            var ItemList = "";
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                ItemList += "<tr id='tr" + val.PriceId + "'>" +
                "<td name='Date'width='15%'>" + val.Date + "</td>" +
                "<td name='Regular' width='20%'>" + val.Regular + "</td>" +
                "<td name='Freinds' width='20%'>" + val.Freinds + "</td>" +
                "<td name='Wholesale' width='20%'>" + val.Wholesale + "</td>" +
                "<td name='Online' width='20%'>" + val.Online + "</td>" +
                "<td id='delete' width='5%'><button id='a_Button'>حذف</button></td></tr>";
                //<div class='modalClose modalRemove'><a href='javascript:RemovePriceElement(" + val.PriceId + ",\"" + container + "\",\"" + barcodeid + "\" );'/></div>
            }
            $con.find("#ListPrice").html(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
            //$con.find("#ListPrice").parent().tableScroll({ height: 380 });
            //TableAlter(container);
            $con.find("[id=a_Button]").button({
                icons: {
                    primary: "ui-icon-closethick"
                },
                text: false
            }).click(function () {
                if (confirm("آیا از حذف مطمئن هستید؟"))
                    RemovePriceElement($(this).parents("tr").prop("id").replace("tr", ""), container, barcodeid);
                else
                    return;
            });
            $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
                ClickPrice($(this).parent("tr"), container, barcodeid)
            }).addClass("cursor");
        },
        error: function (response) { alert(response.responseText); }
    });
}

function AddPrice(barcodeid, container) {

    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        data: "{barcodeid:'" + barcodeid + "',date:'" + $con.find("#" + container + "txt_m_Date").val() + "',regular:'" + $con.find("#txt_m_RegularPrice").val() + "',Frinends:'" + $con.find("#txt_m_FrinendsPrice").val() + "',wholesale:'" + $con.find("#txt_m_WholesalePrice").val() + "',online:'" + $con.find("#txt_m_OnlinePrice").val() + "'}",
        url: "Management/AddPrice",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.msg);
            if (response.isDone)
                getListPrice(barcodeid, container);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function EditPrice(barcodeid, container) {

    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        data: "{priceid: '" + $con.find("#hd_m_priceid").val() + "',date:'" + $con.find("#" + container + "txt_m_Date").val() + "',regular:'" + $con.find("#txt_m_RegularPrice").val() + "',Frinends:'" + $con.find("#txt_m_FrinendsPrice").val() + "',wholesale:'" + $con.find("#txt_m_WholesalePrice").val() + "',online:'" + $con.find("#txt_m_OnlinePrice").val() + "'}",
        url: "Management/EditPrice",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            getListPrice(barcodeid, container);
            $con.find("#btn_Submit").unbind().bind('click', function () {
                AddPrice(barcodeid, container);
            });
            $con.find("#" + container + "txt_m_Date").val("");
            $con.find("#txt_m_RegularPrice").val("");
            $con.find("#txt_m_FrinendsPrice").val("");
            $con.find("#txt_m_WholesalePrice").val("");
            $con.find("#txt_m_OnlinePrice").val("");
            $con.find("#hd_m_priceid").val();
        },
        error: function (response) { alert(response.responseText); }
    });
}


function ClickPrice($dis, container, barcodeid) {
    var $con = $("#" + container);
    $con.find("#" + container + "txt_m_Date").val($dis.find("td[name=Date]").html().split(' ')[1]);
    $con.find("#txt_m_RegularPrice").val($dis.find("td[name=Regular]").html() == "null" ? "" : $dis.find("td[name=Regular]").html());
    $con.find("#txt_m_FrinendsPrice").val($dis.find("td[name=Freinds]").html() == "null" ? "" : $dis.find("td[name=Freinds]").html());
    $con.find("#txt_m_WholesalePrice").val($dis.find("td[name=Wholesale]").html() == "null" ? "" : $dis.find("td[name=Wholesale]").html());
    $con.find("#txt_m_OnlinePrice").val($dis.find("td[name=Online]").html() == "null" ? "" : $dis.find("td[name=Online]").html());
    $con.find("#hd_m_priceid").val($dis.prop("id").replace("tr", ""));
    $con.find("#btn_Submit").unbind().bind('click', function () {
        EditPrice(barcodeid, container);
    });

}

function RemovePriceElement(priceid, container, barcodeid) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        data: "{priceid: '" + priceid + "'}",
        url: "Management/DeletePrice",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.msg);
            if (response.isDone)
                getListPrice(barcodeid, container);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function loadInventoryCategory(barcodeid, container, first) {
    if (first) {
        var $con = $("#" + container);
        getListCategory(barcodeid, container, first);
        $con.find("#btn_Submit").button().unbind('click').click(function () {
            if (validateAll($("#" + container)))
                AddCategory(barcodeid, container);
        });
    }
}


function getListCategory(barcodeid, container, first) {
    var $con = $("#" + container);
    var ItemList = "";
    ajgetListCategory = $.ajax({
        type: "POST",
        data: "{barcodeid: '" + barcodeid + "'}",
        url: "Management/GetCategoryList",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var List = (typeof response) == 'string' ? eval('(' + response + ')') : response;
            var ItemList = "";
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                ItemList += "<tr id='tr" + val.CategoryId + "'>" +
                "<td name='Category' width='80%'>" + val.Category + "</td>" +
                "<td id='delete' width='20%'><button id='a_Button'>حذف</button></td></tr>";
                //<div class='modalClose modalRemove'><a href='javascript:RemoveCategoryElement(" + val.CategoryId + ",\"" + container + "\",\"" + barcodeid + "\" );'/></div>
            }
            $con.find("#ListCategory").html(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
            // $con.find("#ListCategory").parent().tableScroll({ height: 380 });
            //            TableAlter(container);
            //            $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
            //                ClickPrice($(this).parent("tr"), container, barcodeid)
            //            }).addClass("cursor");
            $con.find("[id=a_Button]").button({
                icons: {
                    primary: "ui-icon-closethick"
                },
                text: false
            }).click(function () {
                if (confirm("آیا از حذف مطمئن هستید؟"))
                    RemoveCategoryElement($(this).parents("tr").prop("id").replace("tr", ""), container, barcodeid);
                else
                    return;
            });
            if (first)
                bindHierarchyData({ id: "hr_m_Category", container: container, canmodify: true, table: "category" });
        },
        error: function (response) { alert(response.responseText); }
    });
}

function AddCategory(barcodeid, container) {

    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        data: "{barcodeid:'" + barcodeid + "',categoryid:'" + getHierarchySelectedValue("hr_m_Category", container) + "'}",
        url: "Management/AddCategory",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isDone)
                getListCategory(barcodeid, container);
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function RemoveCategoryElement(categoryid, container, barcodeid) {

    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        data: "{barcodeid:'" + barcodeid + "',categoryid:'" + categoryid + "'}",
        url: "Management/DeleteCategory",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isDone)
                getListCategory(barcodeid, container);
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}


function loadInventoryUnit(barcodeid, container, first) {
    if (first) {
        var $con = $("#" + container);
        $con.find("#barcodeid").val(barcodeid);
        GetUnitList(barcodeid, container);
        $con.find("#btn_new").button({
            icons: {
                primary: "ui-icon-plusthick"
            }
        }).unbind().click(function () {
            $("#dialogAddUnit").find("input, select").val("");
            $("#dialogAddUnit").find("#btn_save").button({
                icons: {
                    primary: "ui-icon-disk"
                }
            }).unbind().click(function () {
                //                if (validateAll( $con.find("#dialogAddUnit")))
                AddUnit(barcodeid, "dialogAddUnit", container);
            });
            bindHierarchyData({ id: "divUnitCategoryAdd", container: "dialogAddUnit", table: "MeasureUnit", canmodify: true });
            $("#dialogAddUnit").dialog(open).dialog({ width: 500 });
        });
    }
}

function AddUnit(barcodeid, dialog, container) {
    var $con = $("#" + dialog);
    var DTO = { 'barcodeid': barcodeid, 'MeasureUnitId': getHierarchySelectedValue("divUnitCategoryAdd", dialog),
        'quantity': $con.find("#txtQuantityAdd").val(), 'discount': $con.find("#txtDiscountAdd").val()
    };
    $.ajax({
        type: "POST",
        data: JSON.stringify(DTO),
        url: "Management/AddUnit",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isDone)
                GetUnitList(barcodeid, container)
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function buildUnitList(jq, container) {
    var $con = $("#" + container);
    var table = {};
    var lstb = [];
    var lsth = [];
    lsth.push({ title: "واحد کالا", sort: "", width: "30%" });
    lsth.push({ title: "تعداد", width: "30%" });
    lsth.push({ title: "تخفیف واحد", width: "25%" });
    lsth.push({ title: "ویرایش/حذف", width: "15%" });
    var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
    var ItemList = "";
    for (var i = 0; i < List.length; i++) {
        var val = List[0, i];
        var trBody = {};
        trBody[0] = { trId: val.MeasureUnitId };
        trBody[1] = { name: "unit", html: val.UnitType, width: "30%" };
        trBody[2] = { name: "quantity", html: val.Quantity, width: "30%" };
        trBody[3] = { name: "discount", html: val.DiscountPercentage, width: "25%" };
        lstb.push(trBody);
    }
    var details = { editFunction: BindItemsForEditUnit, deleteFunction: DeleteUnit };
    table = { header: lsth, body: lstb, details: details, container: container, divName: "UnitTable" };
    buildTable(table);
}

function GetUnitList(barcodeid, container) {
    var $con = $("#" + container);
    var ItemList = "";
    var DTO = { 'barcodeid': barcodeid };
    $.ajax({
        type: "POST",
        data: JSON.stringify(DTO),
        url: "Management/GetUnitList",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            buildUnitList(response, container)
        },
        error: function (response) {
            //alert(response.msg); 
        }
    });
}

function BindItemsForEditUnit(dis, container) {
    $("#dialogAddUnit").dialog().dialog("destroy");
    var $row = $(dis).parents("tr");
    var id = $row.prop("id");
    var $con = $("#" + container);
    $con.find("#divUnitCategoryAdd").html("");
    $con.find("#btn_save").button({
        icons: {
            primary: "ui-icon-disk"
        }
    }).unbind().click(function () {
        if (validateAll($con.find("#dialogAddExpense")))
            EditUnit(id.replace("tr", ""), "dialogAddUnit", container);
    });
    bindHierarchyData({ id: "divUnitCategoryAdd", container: "dialogAddUnit", table: "MeasureUnit", canmodify: true, parentid: id.replace("tr", "") });
    $con.find("#txtQuantityAdd").val($row.find("[name=quantity]").html());
    $con.find("#txtDiscountAdd").val($row.find("[name=discount]").html());
    $con.find("#dialogAddUnit").dialog({ autoOpen: true });
}

function EditUnit(oldMeasureunitId, dialog, container) {
    var $con = $("#" + dialog);
    var DTO = { 'barcodeid': $("#" + container).find("#barcodeid").val(), 'oldMeasureUnitId': oldMeasureunitId,
        'newMeasureUnitId': getHierarchySelectedValue("divUnitCategoryAdd", dialog),
        'quantity': $con.find("#txtQuantityAdd").val(), 'discount': $con.find("#txtDiscountAdd").val()
    };
    $.ajax({
        type: "POST",
        data: JSON.stringify(DTO),
        url: "Management/EditUnit",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response != null && response.isDone == true) {
                GetUnitList($("#" + container).find("#barcodeid").val(), container);
            }
            translate(response.msg);
        },
        error: function (response) {
            alert(response.responseText);

        }
    });
}

function DeleteUnit(dis, container) {
    var $con = $("#" + container);
    //    var $dis = $(dis);
    //    var $row = $(dis).parents("tr");
    var id = dis;
    var DTO = { 'barcodeid': $("#" + container).find("#barcodeid").val(), 'MeasureUnitId': id };
    $.ajax({
        type: "POST",
        url: "Management/DeleteUnit",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response != null && response.isDone == true)
                $("#tr" + dis).remove();
            translate(response.msg);
        },
        error: function (response) {
            alert(response.responseText);

        }
    });
}

//----------------------Inventory End----------------------------


//--------------------statistic begin------------------------------

function loadVisitorStatistic(container, first) {
    var $con = $("#" + container);
    if (first) {
        getVisitorStatisticList(container, { container: container, callbackmethod: getVisitorStatisticList, fname: "", page_index: 0,
            build: buildVisitorStaticList, servicename: "Management", methodname: "GetVisitorStatistic", print: false
        });
        $con.find("[id=btnSearchVisitorStatistic]").button({ icons: {
            primary: "ui-icon-search"
        }
        }).unbind('click').click(function () {

            getVisitorStatisticList(container, { container: container, callbackmethod: getVisitorStatisticList, fname: "", page_index: 0,
                build: buildVisitorStaticList, servicename: "Management", methodname: "GetVisitorStatistic", print: false
            });
        });
    }
}

function loadVisitorStatisticManagement(container, first) {
    var $con = $("#" + container);
    if (first) {
        getVisitorStatisticList(container, { container: container, callbackmethod: getVisitorStatisticList, fname: "", page_index: 0,
            build: buildVisitorStaticList, servicename: "Management", methodname: "GetVisitorStatisticForManagement", print: false
        });
        $con.find("[id=btnSearchVisitorStatistic]").button({ icons: {
            primary: "ui-icon-search"
        }
        }).unbind('click').click(function () {

            getVisitorStatisticList(container, { container: container, callbackmethod: getVisitorStatisticList, fname: "", page_index: 0,
                build: buildVisitorStaticList, servicename: "Management", methodname: "GetVisitorStatisticForManagement", print: false
            });
        });
    }
}

function getVisitorStatisticList(container, params) {
    var $con = $("#" + container);
    if (params.page_index > 0) {
        params.first = false;
    }


    var DTO = { 'sort': sortid
    };
    params["DTO"] = DTO;

    pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
        first: true, isOrder: false
    });
}


function buildVisitorStaticList(jq, container) {

    var $con = $("#" + container.pagingContainer);
    var table = {};
    var lstb = [];
    var lsth = [];
    jq = jq.results;
    lsth.push({ title: "ip", width: "20%" });
    lsth.push({ title: "countryName", width: "15%" });
    lsth.push({ title: "cityName ", width: "10%" });
    lsth.push({ title: "date", width: "20%" });
    lsth.push({ title: "timeZone ", width: "5%" });
    lsth.push({ title: "browser", width: "10%" });
    lsth.push({ title: "appName", width: "10%" });
    lsth.push({ title: "user", width: "10%" });

    var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
    if (List = undefined)
        retur;
    var ItemList = "";
    for (var i = 0; i < List.length; i++) {
        var val = List[0, i];
        var trBody = {};
        trBody[0] = { name: "ip", html: val.ip, width: "20%" };
        trBody[1] = { name: "countryName", html: val.countryName, width: "15%" }
        trBody[2] = { name: "cityName", html: val.cityName, width: "10%" };
        trBody[3] = { name: "date", html: val.dateTime, width: "20%" };
        trBody[4] = { name: "timeZone", html: val.timeZone, width: "5%" };
        trBody[5] = { name: "browser", html: val.browser, width: "10%" };
        trBody[6] = { name: "appName", html: val.appName, width: "10%" };
        trBody[7] = { name: "user", html: val.user, width: "10%" };

        lstb.push(trBody);
    }
    //    var details = { editFunction: BindItemsForEditMenu, deleteFunction: DeleteMenu, rowClick: ClickMenu };
    table = { header: lsth, details: {}, body: lstb, container: container.pagingContainer, divName: "visitorStatistic" };
    buildTable(table);


}
//-------------------statistic end-----------------------------------


//-------------support begin--------------------------------


function loadAddFaq(container, first) {
    $con = $("#" + container);
    if (first) {
        getFaq("", container, true);
        $con.find("#btn_saveFaq").button({
            icons: {
                primary: "ui-icon-plusthick"
            }
        }).unbind().click(function () {

            AddFaq(container);

        });

        BuildFaqAccordion(container);

    }
}

function AddFaq(container) {
    var $con = $("#" + container);
    var DTO = { 'question': $con.find("#txtQuestion").val(), 'faq': $("[name='txtFaq']").val(), 'lang': $lang.val() };
    $.ajax({
        type: "POST",
        data: JSON.stringify(DTO),
        url: "Management/AddFaq",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isDone) {
                BuildFaqAccordion(container);
            }
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function BuildFaqAccordion(container) {
    var $con = $("#" + container);
    var DTO = { 'lang': $lang.val() };
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/getFaqQuestions",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var icons = {
                header: "ui-icon-circle-arrow-e",
                activeHeader: "ui-icon-circle-arrow-s"
            };
            var $side = $con.find("#accordion");
            $side.accordion().accordion("destroy").html("");

            for (var i = 0; i < response.length; i++) {
                var val = response[i];
                var h3 = "";
                h3 = "<li order='" + val.order + "' id='" + val.id + "' class='ui-state-default'>" +
                "<span name='question' >" + val.question + "</span>" +
                "<button OnlineMenuId='" + val.id + "' id='btn_edit'>ویرایش</button><button OnlineMenuId='" +
                 val.id + "' id='btn_delete'>delete</button></li>";
                $side.append(h3);
            }
            $side.find("[id=btn_edit]").button({
                icons: { primary: 'ui-icon-pencil' },
                text: true
            }).unbind("click").click(function () {
                getFaqForEdit($(this).parents("li").attr("id"), container);
                return false;
            });
            $side.find("[id=btn_delete]").button({
                icons: { primary: 'ui-icon-pencil' },
                text: true
            }).unbind("click").click(function () {
                deleteFaq($(this).parents("li").attr("id"), container);
                return false;
            });
            $side.sortable({
                axis: "y",
                //  handle: "h3",
                stop: function (event, ui) {
                    // IE doesn't register the blur when sorting
                    // so trigger focusout handlers to remove .ui-state-focus
                    ui.item.children("h3").triggerHandler("focusout");
                    SortFaqQuestions(container)
                }
            });
        },
        error: function (response) { alert(response.responseText); }
    });
}

function SortFaqQuestions(container) {
    var $con = $("#" + container);
    var sortOnlineMenus = [];
    var priority = 1;
    $con.find("#accordion").children("li").each(function () {
        var sortOnlineMenu = {};
        sortOnlineMenu["id"] = $(this).attr("id");
        sortOnlineMenu["Priority"] = priority;
        priority++;
        sortOnlineMenus.push(sortOnlineMenu);
    })
    var DTO = { 'sortFaq': sortOnlineMenus };
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/sortFaqQuestions",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {

        },
        error: function (response) { alert(response.responseText); }
    });
}

function getFaqForEdit(faqId, container) {
    var $con = $("#" + container);
    var DTO = { 'id': faqId };
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/getFaqForEdit",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            $con.find("#txtQuestion").val(response.result.question);
            $con.find("[name='txtFaq']").val(response.result.answer);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function deleteFaq(faqId, container) {
    var $con = $("#" + container);
    var DTO = { 'id': faqId };
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/deleteFaq",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isDone) {
                $con.find("#accordion").find("#" + faqId).remove();
            }
            else
                alert(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function getFaq(faqId, container) {
    var $con = $("#" + container);
    $con.find("#divFaq").html("<textarea class='editor' name='txtFaq'></textarea></n><button id='btnSaveDefintion'>save</button>");
    $con.find(".editor").tinymce({
        // Location of TinyMCE script
        script_url: '../../Scripts/tinymce/tiny_mce.js',
        width: "100%",
        height: "500px",
        directionality: "rtl",
        theme: "advanced",
        verify_html: false,
        plugins: "pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,autosave",
        theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
        theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
        theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
        theme_advanced_buttons4: "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak,restoredraft,codehighlighting,netadvimage",
        theme_advanced_toolbar_location: "top",
        theme_advanced_toolbar_align: "right",
        theme_advanced_statusbar_location: "bottom",
        theme_advanced_resizing: false,
        save_onsavecallback: function () { AddFaq(container); },
        // Example content CSS (should be your site CSS)
        content_css: '../../Scripts/tinymce/css/content.css',
        convert_urls: false
    });

    $con.find("#btnSaveDefintion").button().unbind('click').bind('click', function () {
        AddFaq(container);
    });

}


function loadFaq(container, first) {
    $con = $("#" + container);
    if (first) {
        BuildFaqContent(container);
    }
}


function BuildFaqContent(container) {
    var $con = $("#" + container);
    var DTO = { 'lang': $("#ddl_m_Language").val() };
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/getFaqQuestions",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;

            var icons = {
                header: "ui-icon-circle-arrow-e",
                activeHeader: "ui-icon-circle-arrow-s"
            };
            var $side = $con.find("#faqContent");
            $side.accordion().accordion("destroy").html("");

            for (var i = 0; i < response.length; i++) {

                var val = response[i];
                var h3 = "";
                h3 = "<h3 id='" + val.id + "'>" + val.question + "</h3>" +
                       "<div><p id='p" + val.id + "'></p></div>";
                $side.append(h3);
            }
            $side.accordion({ collapsible: true, heightStyle: "content", active: false,
                change: function (event, ui) {
                    if (ui.newContent.length > 0 && ui.newContent.html().length < 16)
                        getFaqAnswer(ui.newHeader.attr("id"), container)
                }
            });
        },
        error: function (response) { alert(response.responseText); }
    });
}
function getFaqAnswer(faqId, container) {
    var $con = $("#" + container);
    var DTO = { 'id': faqId };
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/getFaqForEdit",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            $con.find("#faqContent").find("#p" + faqId).html(response.result.answer);
        },
        error: function (response) { alert(response.responseText); }
    });
}
//--------------support end----------------------------------

//------------dashboard begin-----------------------------
function loadDashCharts(container, first) {
    var $con = $("#" + container);
    if (first) {
        $con.find("#sale7,#sale14,#sale30").unbind("click").click(function () {
            $con.find("#sale7,#sale14,#sale30").removeClass("selected");
            $(this).addClass("selected");
            GetDashboardSaleChart(container, true, $(this).attr("data-days"));
        });
        $con.find("#top7,#top14,#top30,#top182,#top365").unbind("click").click(function () {
            $con.find("#top7,#top14,#top30,#top182,#top365").removeClass("selected");
            $(this).addClass("selected");
            GetTopProductChart(container, true, $(this).attr("data-days"));
        });
        $con.find("#newSale").unbind("click").click(function () {
            $("[maintab='a_FullAcountReport']").trigger("click");
        });
        $con.find("#newProduct").unbind("click").click(function () {
            $("[maintab='InventoryAdd']").trigger("click");
            $("[id='a_InventoryAdd']").trigger("click")

        });
        GetDashboardSaleChart(container, true, 7);
        GetTopProductChart(container, true, 7);
    }
}


function GetDashboardSaleChart(container, isCustomer, period) {
    var $con = $("#" + container);
    var name = "", code = "", EmployeeId = "", EmployeeName = "", Shop = "", InvoiceId = "", ProductId = "",
        ProductName = "", Barcode = "";
    var priceFrom = "", priceTo = "", categoryId = "";
    if ($con.find("#moreFilter").is(":visible")) {
        var search = $con.find("#ddl_d_SearchBy1").val();
        if (search != "") {
            if (search == "Code") {
                code = $con.find("#txtSearch1").val();
            } if (search == "Name") {

                name = $con.find("#txtSearch1").val();
            } if (search == "EmployeeId") {

                EmployeeId = $con.find("#txtSearch1").val();
            } if (search == "EmployeeName") {

                EmployeeName = $con.find("#txtSearch1").val();
            }
            if (search == "Shop") {

                Shop = $con.find("#txtSearch1").val();
            }
        }
        var search = $con.find("#ddl_d_SearchBy2").val();
        if (search != "") {
            if (search == "InvoiceId") {
                InvoiceId = $con.find("#txtSearch2").val();
            } if (search == "ProductId") {

                ProductId = $con.find("#txtSearch2").val();
            } if (search == "ProductName") {

                ProductName = $con.find("#txtSearch2").val();
            }
            if (search == "Barcode") {

                Barcode = $con.find("#txtSearch2").val();
            }
        }
        priceFrom = $con.find("#txt_s_PriceFrom").val();
        priceTo = $con.find("#txt_s_PriceTo").val();
        categoryId = getHierarchySelectedValue("hr_s_Category", container);
    }

    var sell = "";
    if ($con.find("#Checkbox1" + container).prop('checked') && $con.find("#Checkbox2" + container).prop('checked'))
        sell = "";
    else if (!$con.find("#Checkbox1" + container).prop('checked') && $con.find("#Checkbox2" + container).prop('checked'))
        sell = false;
    else if ($con.find("#Checkbox1" + container).prop('checked') && !$con.find("#Checkbox2" + container).prop('checked'))
        sell = true;

    var DTO = { 'Datetype': "DayDashboard", 'supplierid': "",
        'IsClient': true, 'SupplierName': name, 'code': code, 'EmployeeId': EmployeeId,
        'EmployeeName': EmployeeName, 'Shop': Shop, 'InvoiceId': InvoiceId, 'ProductId': ProductId,
        'ProductName': ProductName, 'Barcode': Barcode,
        'InvoiceDateStart': period,
        'InvoiceDateEnd': "",
        'InvoiceYearStart': "",
        'InvoiceYearEnd': "",
        'PriceFrom': priceFrom, 'PriceTo': priceTo, 'Order': sell,
        'PreOrder': ($con.find("#Checkbox3" + container).length > 0 ? $con.find("#Checkbox3" + container).prop('checked') : ""),
        'Broken': ($con.find("#Checkbox4" + container).length > 0 ? $con.find("#Checkbox4" + container).prop('checked') : ""),
        'CategoryId': categoryId, 'shopid': $("#userDefault").find("#ddl_s_Branch").val(),
        'counterid': $("#userDefault").find("#ddl_m_Counter").val()
    };


    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: "Management/GetSaleChart",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response != null) {
                var displayBy = "0"; // $con.find("#ddl_d_DisplayBy").val();
                var position = "right";
                var totalSale = 0;
                var avSale = 0;
                var avValue = 0;
                var totalQuantity = 0;
                var categories = [];
                var data = [];
                var quantity = [];
                $.each(response, function () {
                    categories.push(ToPersianDate(this.date));
                    if (displayBy == "Amount" || displayBy == "0") {


                        data.push(Math.ceil(this.amount * 10) / 10);
                        quantity.push(Math.ceil(this.quantity * 10) / 10);

                        totalSale += Math.ceil(this.amount * 10) / 10;
                        totalQuantity += Math.ceil(this.quantity * 10) / 10;
                    }
                })
                if (response.length > 0) {
                    $con.find("#spTotalSale").html(Math.ceil(totalSale * 10) / 10);
                    $con.find("#spAvSale").html(Math.ceil((totalSale / period * 1) * 10) / 10);
                    $con.find("#spAvValue").html(Math.ceil((totalSale / totalQuantity) * 10) / 10);

                    $('#saleChart').highcharts({
                        credits: {
                            enabled: false
                        },
                        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                        chart: {
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                                stops: [
            [0, 'rgb(255, 255, 255)'],
            [1, 'rgb(240, 240, 255)']
         ]
                            },

                            plotBackgroundColor: 'rgba(255, 255, 255, .9)',
                            plotShadow: true,
                            plotBorderWidth: 1
                        },

                        title: {
                            text: ''
                        },

                        xAxis: {
                            categories: categories,
                            labels: {
                                rotation: -35,
                                align: 'right',
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'Verdana, sans-serif'
                                }
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'مبلغ فروش'
                            }
                        },
                        tooltip: {
                            valueSuffix: 'تومان'
                        },
                        plotOptions: {
                            line: {
                                dataLabels: {
                                    enabled: true
                                },
                                enableMouseTracking: false
                            }
                        },
                        series: [{
                            name: 'مبلغ ',
                            color: 'green',
                            type: 'spline',
                            data: data,
                            tooltip: {
                                valueSuffix: ' تومان'
                            }
                        }]

                    });
                }
            }

        },
        error: function (response) { alert(response.responseText); }
    });
    return false;
}


function GetTopProductChart(container, isCustomer, period) {
    var $con = $("#" + container);


    var DTO = { 'Datetype': "DayTopProduct",
        'InvoiceDateStart': period,
        'shopid': $("#userDefault").find("#ddl_s_Branch").val()
    };

    // var DTO = { 'shopid': $("#userDefault").find("#ddl_s_Branch").val() };

    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: "Management/GetTopProductChart",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response != null) {
                var categories = [];
                var data = [];
                var quantity = [];
                $.each(response, function () {

                    quantity.push(Math.ceil(this.quantity * 10) / 10);
                    categories.push(this.Name);
                })
                if (response.length > 0) {

                    $('#popular-products-chart').highcharts({
                        credits: {
                            enabled: false
                        },
                        chart: {
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                                stops: [
            [0, 'rgb(255, 255, 255)'],
            [1, 'rgb(240, 240, 255)']
         ]
                            },

                            plotBackgroundColor: 'rgba(255, 255, 255, .9)',
                            plotShadow: true,
                            plotBorderWidth: 1
                        },

                        title: {
                            text: ''
                        },
                        yAxis: {
                            title: {
                                text: 'تعداد فروش'
                            }
                        },
                        xAxis: {
                            categories: categories,
                            labels: {
                                rotation: -35,
                                align: 'right',
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'Verdana, sans-serif'
                                }
                            }
                        },

                        tooltip: {
                            formatter: function () {
                                return '<div lang="fa" dir="rtl"> ' +
               this.x + ' : ' + this.y + " عدد"
                                '</div>';
                            }
                        },
                        plotOptions: {
                            line: {
                                dataLabels: {
                                    enabled: true
                                },
                                enableMouseTracking: false
                            }
                        },
                        series: [{
                            name: "تعداد ",
                            color: '#33CC33',
                            type: 'column',
                            data: quantity,
                            align: 'right',
                            tooltip: {
                                valueSuffix: ' عدد'
                            }
                        }]

                    });
                }
            }

        },
        error: function (response) { alert(response.responseText); }
    });
    return false;
}


function loadSellChart(container, first) {
    if (first) {
        loadChart(first, container, true, { onLoad: true })
    }
}
function loadBuyChart(container, first) {
    if (first) {
        loadChart(first, container, false, { onLoad: true })
    }
}

function loadChart(first, container, isCustomer, params) {
    var $con = $("#" + container);
    if (first) {
        $con.find('#moreFilter').slideUp('fast');
        $con.find('.toggle-more-filters').click(function () {
            $(this).toggleClass("open")
            //            $con.find('#moreFilter').removeClass('invisible');
            $con.find('#moreFilter').slideToggle(function () {
                // Animation complete.
            });
        });
        // GetSaleChart(container);
        //$con.find("#btnSearch").button();
        ChangeCheckBoxGroupName("Check", container);
        var invoiceDay = " <option value=''>روز </option>", invoiceMonth = "<option value=''>ماه </option>",
                invoiceYear = " <option value=''>سال </option>";
        var yearEnd = new Date();
        yearEnd = (yearEnd.getFullYear() * 1 - 621) + 1;
        for (var i = 1; i < 32; i++) {
            invoiceDay += " <option value='" + i + "'>" + i + "</option>";
            if (i < 13)
                invoiceMonth += " <option value='" + i + "'>" + i + "</option>";
        }
        for (var i = 1388; i < yearEnd; i++) {
            invoiceYear += " <option value='" + i + "'>" + i + "</option>";
        }
        $con.find("#txt_s_InvoiceDayStart").html(invoiceDay);
        $con.find("#txt_s_InvoiceDayStart").val("1");
        $con.find("#txt_s_InvoiceMonthStart").html(invoiceMonth);
        $con.find("#txt_s_InvoiceMonthStart").val("1");
        $con.find("#txt_s_InvoiceYearStart").html(invoiceYear);
        $con.find("#txt_s_InvoiceYearStart").val("1388");
        $con.find("#txt_s_InvoiceDayEnd").html(invoiceDay);
        $con.find("#txt_s_InvoiceDayEnd").val("29");
        $con.find("#txt_s_InvoiceMonthEnd").html(invoiceMonth);
        $con.find("#txt_s_InvoiceMonthEnd").val("12");
        $con.find("#txt_s_InvoiceYearEnd").html(invoiceYear);
        $con.find("#txt_s_InvoiceYearEnd").val(yearEnd * 1 - 1);
        $con.find("#ddl_d_GroupBy").val("Month");
        //            $con.find("#txt_s_PriceTo").datepicker("getDate");
        //        $con.find("#txt_s_InvoiceYearStart").datepicker({ dateFormat: "yy", changeYear: true,
        //            onSelect: function (dateText, inst) {
        //                $('#txt_s_InvoiceYearEnd').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
        //            }
        //        });
        //        $con.find("#txt_s_InvoiceYearEnd").datepicker({ dateFormat: "yy", changeYear: true });

        // bindDropDown("ddl_d_SearchBy1", container);
        //  bindDropDown("ddl_d_SearchBy2", container);
        //bindDropDown("ddl_d_GroupBy", container);
        bindHierarchyData({ id: "hr_s_Category", table: "category", container: container });
        $con.find("#btnSearch").button({ icons: {
            primary: "ui-icon-search"
        }
        }).unbind('click').click(function () {
            GetSaleChart(container, isCustomer);
        });
        if (params.onLoad) {
            GetSaleChart(container, isCustomer);
        }
        //            $con.find("#PageSize").off().on('change', function () { getInvoiceList(container); });
        //            $con.find("#div_dialog_invoice").dialog({ autoOpen: false }).dialog({ width: 900 });

    }
    function GetSaleChart(container, isCustomer) {
        var $con = $("#" + container);
        var name = "", code = "", EmployeeId = "", EmployeeName = "", Shop = "", InvoiceId = "", ProductId = "",
        ProductName = "", Barcode = "";
        var priceFrom = "", priceTo = "", categoryId = "";
        if ($con.find("#moreFilter").is(":visible")) {
            var search = $con.find("#ddl_d_SearchBy1").val();
            if (search != "") {
                if (search == "Code") {
                    code = $con.find("#txtSearch1").val();
                } if (search == "Name") {

                    name = $con.find("#txtSearch1").val();
                } if (search == "EmployeeId") {

                    EmployeeId = $con.find("#txtSearch1").val();
                } if (search == "EmployeeName") {

                    EmployeeName = $con.find("#txtSearch1").val();
                }
                if (search == "Shop") {

                    Shop = $con.find("#txtSearch1").val();
                }
            }
            var search = $con.find("#ddl_d_SearchBy2").val();
            if (search != "") {
                if (search == "InvoiceId") {
                    InvoiceId = $con.find("#txtSearch2").val();
                } if (search == "ProductId") {

                    ProductId = $con.find("#txtSearch2").val();
                } if (search == "ProductName") {

                    ProductName = $con.find("#txtSearch2").val();
                }
                if (search == "Barcode") {

                    Barcode = $con.find("#txtSearch2").val();
                }
            }
            priceFrom = $con.find("#txt_s_PriceFrom").val();
            priceTo = $con.find("#txt_s_PriceTo").val();
            categoryId = getHierarchySelectedValue("hr_s_Category", container);
        }

        var sell = "";
        if ($con.find("#Checkbox1" + container).prop('checked') && $con.find("#Checkbox2" + container).prop('checked'))
            sell = "";
        else if (!$con.find("#Checkbox1" + container).prop('checked') && $con.find("#Checkbox2" + container).prop('checked'))
            sell = false;
        else if ($con.find("#Checkbox1" + container).prop('checked') && !$con.find("#Checkbox2" + container).prop('checked'))
            sell = true;

        var DTO = { 'Datetype': $con.find("#ddl_d_GroupBy").val(), 'supplierid': $con.find("#hd_d_PersonId").val(),
            'IsClient': isCustomer, 'SupplierName': name, 'code': code, 'EmployeeId': EmployeeId,
            'EmployeeName': EmployeeName, 'Shop': Shop, 'InvoiceId': InvoiceId, 'ProductId': ProductId,
            'ProductName': ProductName, 'Barcode': Barcode,
            'InvoiceDateStart': $con.find("#txt_s_InvoiceMonthStart").val() + "/" + $con.find("#txt_s_InvoiceDayStart").val(),
            'InvoiceDateEnd': $con.find("#txt_s_InvoiceMonthEnd").val() + "/" + $con.find("#txt_s_InvoiceDayEnd").val(),
            'InvoiceYearStart': $con.find("#txt_s_InvoiceYearStart").val(),
            'InvoiceYearEnd': $con.find("#txt_s_InvoiceYearEnd").val(),
            'PriceFrom': priceFrom, 'PriceTo': priceTo, 'Order': sell,
            'PreOrder': ($con.find("#Checkbox3" + container).length > 0 ? $con.find("#Checkbox3" + container).prop('checked') : ""),
            'Broken': ($con.find("#Checkbox4" + container).length > 0 ? $con.find("#Checkbox4" + container).prop('checked') : ""),
            'CategoryId': categoryId, 'shopid': $("#userDefault").find("#ddl_s_Branch").val(),
            'counterid': $("#userDefault").find("#ddl_m_Counter").val()
        };

        // var DTO = { 'shopid': $("#userDefault").find("#ddl_s_Branch").val() };

        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/GetSaleChart",
            success: function (response) {
                var testArray = [7, 6, 9, 14, 18, 21, 25, 26, 23, 18, 13, 9];
                if (!isAuthenticated(response))
                    return;
                if (response != null) {
                    var displayBy = $con.find("#ddl_d_DisplayBy").val();
                    var position = "right";
                    var parent = [];
                    var categories = [];
                    var amountList = [];
                    var quantityList = [];
                    if (response.name == "Month")
                        categories = PERSIAN_MONTHS;
                    else
                        if (response.name == "Season")
                            categories = ["بهار", "تابستان", "پاییز", "زمستان"];

                    $.each(response.data, function () {

                        //   $.each(this.amount, function () {
                        //  if (response.name == "Month") {
                        amountList.push(this.amount);
                        if (response.name != "Month" && response.name != "Season" && response.name != "Week" && response.name != "Day") {
                            categories.push(this.name);
                        }
                        if (response.name == "Year") {
                            categories = this.name;
                        }
                        //  }
                        //                                    else {
                        //                                        categories.push(this.amount[0].xAxis)
                        //                                        amountList.push(this.amount[0].data);
                        //                                    }
                        quantityList.push(this.quantity);
                        //    });
                        var amount = {
                            name: this.name + " مبلغ",
                            // color: '#89A54E',
                            type: 'column',
                            data: this.amount
                        };
                        var quantity = {
                            name: this.name + " تعداد",
                            // color: '#4572A7',

                            type: 'spline',
                            yAxis: 1,
                            data: this.quantity
                        };
                        if ($con.find("#ddl_d_DisplayBy").val() == "Amount")
                            parent.push(amount);
                        else if ($con.find("#ddl_d_DisplayBy").val() == "Count")
                            parent.push(quantity);
                        else {
                            parent.push(amount);
                            parent.push(quantity);
                        }

                    });

                    if (parent.length > 0) {

                        //                            $.plot($con.find("#Div_SaleChart"), parent,
                        //                           {
                        //                               // bars: { show: true, barWidth: 0.5 },
                        //                               xaxis: { tickDecimals: "number" },
                        //                               //  alignTicksWithAxis: position == "right" ? 1 : null,
                        //                               yaxes: [{ min: 0 },
                        //                        {
                        //                            // align if we are to the right
                        //                            alignTicksWithAxis: position == "right" ? 1 : null,
                        //                            position: position

                        //                        }],
                        //                               legend: { noColumns: 2 }
                        //                           });

                        $con.find('#Div_SaleChart').highcharts({
                            title: {
                                text: ' ',
                                x: -20 //center
                            },
                            credits: {
                                enabled: false
                            },
                            colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                            chart: {
                                //                                type: 'column',
                                backgroundColor: {
                                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                                    stops: [[0, 'rgb(255, 255, 255)'], [1, 'rgb(240, 240, 255)']]
                                },
                                plotBackgroundColor: 'rgba(255, 255, 255, .9)',
                                plotShadow: true,
                                plotBorderWidth: 1
                            },
                            yAxis: [{ // Primary yAxis
                                labels: {
                                    // format: '{value}°C',
                                    style: {
                                        color: '#89A54E'
                                    }
                                },
                                title: {
                                    text: 'مبلغ',
                                    style: {
                                        color: '#89A54E'
                                    }
                                }
                            }, { // Secondary yAxis
                                title: {
                                    text: 'تعداد',
                                    style: {
                                        color: '#4572A7'
                                    }
                                },
                                labels: {
                                    //  format: '{value} mm',
                                    style: {
                                        color: '#4572A7'
                                    }
                                },
                                opposite: true
                            }],

                            //                            title: {
                            //                                text: ''
                            //                            },

                            xAxis: {
                                categories: categories,
                                labels: {
                                    rotation: -35,
                                    align: 'right',
                                    style: {
                                        fontSize: '13px',
                                        fontFamily: 'Verdana, sans-serif'
                                    }
                                }
                            },
                            //                            yAxis: {
                            //                                title: {
                            //                                    text: 'مبلغ فروش'
                            //                                }
                            //                            },
                            //                            tooltip: {
                            //                                valueSuffix: 'تومان'
                            //                            },
                            //                            plotOptions: {
                            //                                line: {
                            //                                    dataLabels: {
                            //                                        enabled: true
                            //                                    },
                            //                                    enableMouseTracking: false
                            //                                }
                            //                            },
                            series: parent
                            // [{
                            //                                name: 'مبلغ ',
                            //                                color: 'green',
                            //                                type: 'spline',
                            //                                data: parent,
                            //                                tooltip: {
                            //                                    valueSuffix: ' تومان'
                            //                                }
                            //                            }]

                        });


                    }
                    else {
                        $.plot($con.find("#Div_SaleChart"), [[0, 0]],
                        {
                            // bars: { show: false, barWidth: 0.5 },
                            xaxis: { tickDecimals: "number" },
                            //    alignTicksWithAxis: position == "right" ? 1 : null,
                            yaxes: [{ min: 0 },
                        {
                            // align if we are to the right
                            alignTicksWithAxis: position == "right" ? 1 : null,
                            position: position
                        }],
                            legend: { position: 'sw' }
                        });
                    }
                }
                else {
                    $.plot($con.find("#Div_SaleChart"), [[0, 0]],
                        {
                            bars: { show: false, barWidth: 0.5 },
                            xaxis: { tickDecimals: "number" }
                        });
                }
            },
            error: function (response) { alert(response.responseText); }
        });
        return false;
    }

}
//------------dashboard end---------------------------------
//-----------aplication details begin------------------
//----------------OrderType begin-------------------
var zTree;
function loadOrderType(container, first) {
    var $con = $("#" + container);
    if (first) {

        $con.find("#treeDemo").attr('id', "treeDemo" + container);
        var id = "treeDemo" + container;
        $.fn.zTree.init($con.find("#" + id), setting);
        zTree = $.fn.zTree.getZTreeObj(id);
        $con.find("#btn_Refresh").off().on('click', function () {
            $.fn.zTree.init($con.find("#" + id), setting);
            zTree = $.fn.zTree.getZTreeObj(id);
        })


        $con.find("#addTableAccount").off().on('click', function () {
            addTableAccount(container);
        }).button({ icons: {
    },
            text: true
        });

        $con.find("#btn_saveOrderType").off().on('click', function () {
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });

        $con.find("#btn_addRelatedAcc").off().on('click', function () {
            var id = zTree.getSelectedNodes()[0].id;
            var relatedId = getHierarchySelectedValue("hr_m_Category", container);
            addrelatedAcc(id, relatedId);
            getRelatedAcc(id);
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });

        bindLoadAddOrder();

        $con.find('#frm_AddAccount').ajaxForm({
            success: function (response) {
                if (response.isdone) {
                    if (response.isEdit) {
                        EditTreeNode(response.name);
                    }
                    else {
                        var node = { 'name': response.name, 'id': response.id };
                        addNewTreeNode(node);
                    }
                    translate(response.msg);
                }
            },
            complete: function (xhr) {

            }
        });


        localize();

    }
}

function bindLoadAddOrder() {
    var container = "frm_AddAccount";
    $("#Level").unbind("change").bind('change', function (event) {
        if ($(this).val() == "0") {
            bindItemsForSelectCombo({ methodname: "GetComboItems", servicename: "XmlDropDown", headertext: "انتخاب ماهیت حساب", id: "AccountNature", container: container }, { path: 'XmlData/AccountNatureTitleGroup' });
            bindItemsForSelectCombo({ methodname: "GetComboItems", servicename: "XmlDropDown", headertext: "انتخاب گروه", id: "GroupType", container: container }, { path: 'XmlData/GroupTypeTitle' });
        }
        if ($(this).val() == "1") {
            bindItemsForSelectCombo({ methodname: "GetComboItems", servicename: "XmlDropDown", headertext: "انتخاب ماهیت حساب", id: "AccountNature", container: container }, { path: 'XmlData/AccountNatureTitleGeneral' });
            $con.find("#GroupType").html("");
            $con.find("#GroupType").attr('disabled', true);
        }
        if ($(this).val() == "2") {
            bindItemsForSelectCombo({ methodname: "GetComboItems", servicename: "XmlDropDown", headertext: "انتخاب ماهیت حساب", id: "AccountNature", container: container }, { path: 'XmlData/AccountNatureTitleLegen' });
            $con.find("#GroupType").html("");
            $con.find("#GroupType").attr('disabled', true);

        }
        if ($(this).val() == "3") {
            $con.find("#AccountNature").html("");
            $con.find("#GroupType").html("");
            $con.find("#AccountNature").attr('disabled', true);
            $con.find("#GroupType").attr('disabled', true);
        }

    })
    bindItemsForSelectCombo({ methodname: "GetComboItems", servicename: "XmlDropDown", headertext: "انتخاب نوع حساب", id: "tableAccount", container: container }, { path: 'XmlData/TableAccount' });

    bindHierarchyData({ id: "hr_m_Category", container: container, canmodify: false, table: "account" });
    bindRawDropDownData({ id: "divOrderType", container: container, path: "orderType", canmodify: true, istext: false, headertext: "orderType", css: "selectsmall " });
    bindHierarchyData({ id: "divAccount", container: container, table: "account", isAccount: true, canmodify: true, css: "selectsmall1 required validate" });


}

var setting = {
    view: {
        addHoverDom: AccoountaddHoverDom,
        removeHoverDom: AccountremoveHoverDom,
        fontCss: AccountgetFont,
        nameIsHTML: true
    },
    edit: {
        enable: true,
        showRenameBtn: false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    async: {
        enable: true,
        url: "Hierarchy/GetTreeData",
        autoParam: ["id", "name"],
        otherParam: { "name": "registerAccount" }
        //            dataFilter:ajaxDataFilter

    },

    callback: {
        onDblClick: AccountonDblClick,
        onClick: AccountonClick,
        beforeDrag: AccountbeforeDrag,
        onAsyncSuccess: AccountonAsyncSuccess,
        onRename: AccountonRename,
        beforeRemove: AccountbeforeRemove,
        beforeEditName: AccountbeforeEditName,
        onDrop: AccountOnDrop
    }
};

function AccountgetFont(treeId, node) {
    return node.font ? node.font : {};
}

function AccountremoveHoverDom(treeId, treeNode) {
    var container = "frm_AddAccount";
    var $con = $("#" + container);
    $con.find("#addBtn_" + treeNode.tId).unbind().remove();
};

function AccoountaddHoverDom(treeId, treeNode) {
    var container = "frm_AddAccount";
    var $con = $("#" + container);
    var sObj = $con.find("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $con.find("#addBtn_" + treeNode.tId).length > 0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $con.find("#addBtn_" + treeNode.tId);
    if (btn) btn.bind("click", function () {
        $con.find("#btn_saveOrderType").button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true,
            label: "add"
        });
        localize();
        $con.find("#GroupType").html("");
        $con.find("#txt_name").val("");
        $con.find("#tableAccount").val("");
        $con.find("#txt_code").val("");
        $con.find("#lbl_balanceAmount").text("0");
        $con.find("#hi_isEdit").val(false);
        $con.find("#hi_SelectedParentAccId").val(treeNode.id);
        bindLoadAddOrder();
        zTree.selectNode(treeNode);
        return false;
    });
};


function AccountbeforeEditName(treeId, treeNode, newName, isCancel) {
    var container = "frm_AddAccount";
    var $con = $("#" + container);
    $con.find("#hi_isEdit").val(true);
    $con.find("#hi_SelectedParentAccId").val(treeNode.id);
    getRelatedAcc(treeNode.id);
    zTree.selectNode(treeNode);
    return false;
}
function AccountbeforeRemove(treeId, treeNode) {
    var isdone = false;
    if (confirm("Confirm delete node '" + treeNode.name + "' it?")) {
        var id = treeNode.id;
        var DTO = { 'TableName': 'Account', 'id': id };
        $.ajax({
            type: "POST",
            async: false,
            url: "Management/DeleteTree",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                isdone = response.isdone;
                var container = "frm_AddAccount";
                var $con = $("#" + container);
                $con.find("#hi_isEdit").val(false);
                $con.find("#hi_SelectedParentAccId").val("0");
                $("#btn_saveOrderType").button({ icons: {
                    primary: "ui-icon-disk"
                },
                    text: true,
                    label: "add"
                });
            },
            error: function (response) { alert(response.responseText); }
        });
    }
    return isdone;
}

function AccountonRename(e, treeId, treeNode, isCancel) {
    var container = "frm_AddAccount";
    var $con = $("#" + container);
    $con.find("#hi_isEdit").val(true);
    $con.find("#hi_SelectedParentAccId").val(treeNode.id);
    getRelatedAcc(treeNode.id);
}

function AccountonAsyncSuccess(event, treeId, treeNode, msg) {
    var container = "frm_AddAccount";
    var $con = $("#" + container);
    $con.find(".zTreeDemoBackground li:even").css("background-color", "#FFFFFF");
    $con.find(".zTreeDemoBackground li:odd").css("background-color", "#E6F2FF");

}

function AccountbeforeDrag(treeId, treeNodes) {
    for (var i = 0, l = treeNodes.length; i < l; i++) {
        if (treeNodes[i].drag === false) {
            return false;
        }
    }
    return true;
}
function AccountOnDrop(event, treeid, treeNodes, targetNode, moveType) {
    var list = [];
    for (var i = 0; i < treeNodes.length; i++) {
        list[i] = treeNodes[i].id;
    }
    var DTO = { 'TableName': 'Account', 'TargetId': targetNode == null ? null : (moveType == "inner" ? targetNode.id : targetNode.getParentNode() == null ? null : targetNode.getParentNode().id), 'treeNodes': list, 'children': null };
    $.ajax({
        type: "POST",
        async: false,
        url: "Management/TreeDaragDrop",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (response.isdone)
                alert(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });

}

function ajaxDataFilter(treeId, parentNode, responseData) {
    if (responseData) {
        for (var i = 0; i < responseData.length; i++) {
            responseData[i].name += responseData[i].code;
        }
    }
}


function AccountonClick(event, treeId, treeNode) {
    var container = "frm_AddAccount";
    var $con = $("#" + container);
    $con.find("#hi_isEdit").val(true);
    $con.find("#hi_SelectedParentAccId").val(treeNode.id);
    getRelatedAcc(treeNode.id);
    $con.find("#btn_saveOrderType").button({ icons: {
        primary: "ui-icon-disk"
    },
        text: true,
        label: "edit"
    });
    localize();
}

function getRelatedAcc(id) {
    $("#ul_RelatedAcc").html("");
    var DTO = { 'TableName': 'Account', 'Id': id };
    var container = "div_Details";
    var $con = $("#" + container);
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: ("Management/getTreeItem"),
        async: false,
        success: function (response) {
            if (response.isDone) {
                if (response.level != null) {
                    if (response.level == "0") {
                        bindItemsForSelectCombo({ async: false, methodname: "GetComboItems", servicename: "XmlDropDown", headertext: "انتخاب ماهیت حساب", id: "AccountNature", container: container }, { path: 'XmlData/AccountNatureTitleGroup' });
                        bindItemsForSelectCombo({ async: false, methodname: "GetComboItems", servicename: "XmlDropDown", headertext: "انتخاب گروه", id: "GroupType", container: container }, { path: 'XmlData/GroupTypeTitle' });
                    }
                    if (response.level == "1") {
                        bindItemsForSelectCombo({ async: false, methodname: "GetComboItems", servicename: "XmlDropDown", headertext: "انتخاب ماهیت حساب", id: "AccountNature", container: container }, { path: 'XmlData/AccountNatureTitleGeneral' });
                        $con.find("#GroupType").html("");
                        $con.find("#GroupType").attr('disabled', true);
                    }
                    if (response.level == "2") {
                        bindItemsForSelectCombo({ async: false, methodname: "GetComboItems", servicename: "XmlDropDown", headertext: "انتخاب ماهیت حساب", id: "AccountNature", container: container }, { path: 'XmlData/AccountNatureTitleLegen' });
                        $con.find("#GroupType").html("");
                        $con.find("#GroupType").attr('disabled', true);
                    }
                    if (response.level == "3") {
                        $con.find("#AccountNature").html("");
                        $con.find("#GroupType").html("");
                        $con.find("#AccountNature").attr('disabled', true);
                        $con.find("#GroupType").attr('disabled', true);

                    }
                }

                $("#txt_name").val(response.name);
                $("#Level").val(response.level);
                $("#AccountNature").val(response.accNature);
                $("#GroupType").val(response.groupType);
                if (response.tableAccount != "")
                    $("#tableAccount").val(response.tableAccount);
                else
                    $("#tableAccount").val("");

                $("#txt_code").val(response.Code);
                $("#lbl_balanceAmount").text(response.Amount);
                if (response.relatedacc.length == 0)
                    $con.find("#hr_m_Category").addClass("hidden");
                else
                    $con.find("#hr_m_Category").removeClass("hidden");
                for (var i = 0; i < response.relatedacc.length; i++) {
                    var Accitem = response.relatedacc[i];
                    var accid = Accitem.split(' ');
                    var str = "";
                    for (var j = 1; j < accid.length; j++) {
                        str += " " + accid[j];
                    }
                    var item = '<li id="' + accid[0] + '" ><div class="bg-info"><br class="cleaner"><table style="font-family: tahoma; font-size: small" ><tr><td width="5%"></td><td width="60%">' +
                        str + "</td>" +
                        '<td width="10%" align="center" valign="middle"><span id="delete" id="delete" class="cursor ui-icon ui-icon-closethick"> </td>' +
                        "</tr></table><br class='cleaner'></div><br class='cleaner'></li>";

                    $("#ul_RelatedAcc").append(item);
                }


                $("[id=delete]").unbind().click(function () {
                    if (confirm("آیا از حذف مطمئن هستید؟")) {
                        var id = $(this).parents("li").first().prop("id");
                        if (deleterelateAcc(zTree.getSelectedNodes()[0].id, id))
                            $("#" + id).remove();
                    }
                    else
                        return;
                });

            }
            else {
                $("#hi_isEdit").val(false);
                $con.find("#hr_m_Category").addClass("hidden");
                alert(response.msg);
            }
        },
        error: function (response) { alert(response.responseText); }
    });

}

function deleterelateAcc(parentAccId, relatedAccId) {
    var DTO = { 'parentAccId': parentAccId, 'relatedAccId': relatedAccId };
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: ("Management/deleteRelatedAcc"),
        success: function (response) {
            if (response.isdone) {

                alert(response.msg);
                getRelatedAcc(parentAccId);
                return true;
            }
            else {
                alert("not allow");
                return false;
            }

        },
        error: function (response) { alert(response.responseText); }
    });
}

function AccountonDblClick(event, treeId, treeNode) {
    var container = "frm_AddAccount";
    var $con = $("#" + container);
    $con.find("#hi_isEdit").val(false);
    $con.find("#hi_SelectedParentAccId").val("0");
    zTree.cancelSelectedNode(treeNode);
}

function addNewTreeNode(newNode) {

    if (zTree.getSelectedNodes()[0]) {
        $("#hi_SelectedParentAccId").val(zTree.getSelectedNodes()[0].id);
        newNode.checked = zTree.getSelectedNodes()[0].checked;
        zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
    } else {
        zTree.addNodes(null, newNode);
    }
}


function EditTreeNode(name, id) {
    var node = zTree.getSelectedNodes()[0];
    node.name = name;
    zTree.updateNode(node);
}



function addrelatedAcc(parentAccId, relatedAccId) {
    var DTO = { 'parentAccId': parentAccId, 'relatedAccId': relatedAccId };
    $.ajax({
        type: "POST",
        url: "Management/addRelatedAcc",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (response.isdone)
                return true;
            else
                return false;
            alert(response.msg);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

function addTableAccount(container) {
    var $con = $("#" + container);
    var DTO = { 'accountId': getHierarchySelectedValue("divAccount", container), 'table': $con.find("#ddl_Table").val() };
    $.ajax({
        type: "POST",
        url: "Management/AddTableAccount",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.msg);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}
//----------------OrderType end-------------------


//------------application details end--------------------

//-------------employee begin-------------------------
function loadEmployeeHelp(container, first) {
    var $con = $("#" + container);
    if (first) {


        $con.find("#newEmployee").unbind("click").bind('click', function () {
            $("[id='a_EmployeeAdd']").trigger("click")
        });
        $con.find("#management").unbind("click").bind('click', function () {
            $("[id='a_EmployeeList']").trigger("click")
        });

    }
}

function loadEmployeeAdd(container, first) {
    if (first) {
        var $con = $("#" + container);
        $con.find("#text_empbdate").datepicker({ changeMonth: true, changeYear: true });
        $con.find("#text_empregdate").datepicker({ changeMonth: true, changeYear: true, onClose: function () { validateAll($("#" + container)) } });
        $con.find("#addemployee").button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        }).unbind('click').click(function () {
            if (validateAll($("#" + container)))
                addEmployee(container);
        });
        $con.find("#text_empregdate").datepicker({ changeMonth: true, changeYear: true, onClose: function () { validateAll($("#" + container)) } });
        aComplete({ methodname: "GetCompletionListByEmployeeName", servicename: "Management", id: "text_empmaneger", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "text_empmaneger" });
        bindHierarchyData({ id: "divEmployeeAddress", container: container, table: "address", canmodify: true, css: "selectsmall1 required validate" });
    }
}

function addEmployee(container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        url: "Management/AddEmployee",
        contentType: "application/json; charset=utf-8",
        data: "{username: '" + $con.find("#text_username").val() + "', pass: '" + $con.find("#text_password").val() + "', email: '" + $con.find("#text_empemail").val() +
              "', name: '" + $con.find("#text_empName").val() + "', famil: '" + $con.find("#text_empfamily").val() + "', male: '" + $con.find("#ddl_m_Gender").val() +
              "', bdate: '" + $con.find("#text_empbdate").val() + "', rdate: '" + $con.find("#text_empregdate").val() + "', tell: '" + $con.find("#text_emptell").val() +
              "', mobile: '" + $con.find("#text_empmobile").val() + "', meli: '" + $con.find("#text_empmelicode").val() + "', acc: '" + $con.find("#text_empaccount").val() +
              "', maneg: '" + $con.find("#text_empmaneger").val() + "', addressId: '" + getHierarchySelectedValue("divEmployeeAddress", container) + "'}",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isdone && response.isAdmin)
                location.reload(true);
            else if (response.isdone && !response.isAdmin)
                translate(response.msg);
            else if (!response.isdone)
                translate(response.msg);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

function loadEmployeeList(container, first) {
    if (first) {
        sortid = "AccountId desc";
        var $con = $("#" + container);
        //  GetSubMenuItems("a_EmployeeList", container);
        $con.find("#refreshEmployeeList").button({ icons: {
            primary: "ui-icon-refresh"
        },
            text: false
        }).unbind('click').click(function () {
            //            getEmployeeList(container);
            getEmployeeList(container, { container: container, callbackmethod: getEmployeeList, fname: "", page_index: 0,
                build: buildEmployeeList, servicename: "Management", methodname: "EmployeeList", print: false
            });
        });
        getEmployeeList(container, { container: container, callbackmethod: getEmployeeList, fname: "", page_index: 0,
            build: buildEmployeeList, servicename: "Management", methodname: "EmployeeList", print: false
        });
        //        getEmployeeList(container);
    }
}
function buildEmployeeList(jq, container) {
    var $con = $("#" + container.pagingContainer);
    var table = {};
    var lstb = [];
    var lsth = [];
    var details = {};
    lsth.push({ title: "name", width: "15%" });
    lsth.push({ title: "code", width: "10%" });
    lsth.push({ title: "dateOfEmployment", width: "20%" });
    lsth.push({ title: "phone", width: "15%" });
    lsth.push({ title: "manager", footer: jq.sumDebtor, width: "16%" });
    lsth.push({ title: "image", width: "20%" });
    if (!container.params.print) {
        lsth.push({ title: "deleteKey", width: "4%" });
    }
    var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
    var ItemList = "";
    if (List != null)
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            if (!container.params.print)
                trBody[0] = { trId: val.id };
            trBody[1] = { name: "name", html: val.name, width: "15%" };
            trBody[2] = { name: "code", html: val.code, width: "10%" };
            trBody[3] = { props: { date: val.regdate, name: "date", width: "20%", klass: "dateLong" }, html: val.regdate };
            trBody[4] = { name: "tell", html: val.tell, width: "15%" };
            trBody[5] = { name: "manager", html: val.manager, width: "16%" };
            trBody[6] = { name: "image", html: "<img class='imagefortable' src='ImageHandler/EmployeeLargePhoto.ashx?EmployeeCode=" + val.code + "' />", width: "20%" };
            lstb.push(trBody);
        }
    table = { header: lsth, body: lstb, details: { deleteFunction: DeleteEmployee, rowClick: ClickEmployee }, heigth: 300,
        container: container.pagingContainer, divName: "employeeList"
    };
    buildTable(table);
}


function getEmployeeList(container, params) {
    var $con = $("#" + container);
    //    params["DTO"] = DTO;
    pageselectCallback(0, params, { container: "", noPaging: true, fname: params.fname, pagingContainer: container,
        first: true, isOrder: false
    });
}


function ClickEmployee($dis, container) {
    createSubTab({ row: $dis, name: "a_EmployeeList" });
    itemId = $dis.prop("id").replace("tr", "");
    employeeid = itemId;
    onRowClick($dis);
}

function DeleteEmployee(EmployeeId, container) {
    $.ajax({
        type: "POST",
        url: "Management/Deleteemployee",
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + EmployeeId + "' }",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isDone)
                getEmployeeList(container, { container: container, callbackmethod: getEmployeeList, fname: "", page_index: 0,
                    build: buildEmployeeList, servicename: "Management", methodname: "EmployeeList", print: false
                });
            translate(response.msg);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

function getEmployee(employeeid, container) {
    $.ajax({
        type: "POST",
        url: "Management/getEmployee",
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + employeeid + "' }",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var Employee = (typeof response) == 'string' ? eval('(' + response + ')') : response;
            var empval = Employee[0];
            var con = $("#" + container);
            bindHierarchyData({ id: "divEmployeeAddress", table: "address", container: container, parentid: empval.AddressId, css: "selectsmall required validate" });
            con.find("#hid_empid").val(empval.AccountId)
            con.find("#text_empemail").val(empval.Email);
            con.find("#text_empName").val(empval.Name);
            con.find("#text_empfamily").val(empval.Family);
            con.find("#text_empbdate").val(empval.DateOfBirth);
            con.find("#text_empregdateEdit").val(ToPersianDateDigitYearRight(empval.RegDate));
            con.find("#text_emphdate").val(ToPersianDateDigitYearRight(empval.HierDate));
            con.find("#text_empmelicode").val(empval.IdCart);
            con.find("#text_empaccount").val(empval.AccountNumber);
            con.find("#text_empmaneger").val(empval.managere);
            con.find("#ddl_m_Gender").val("" + empval.Gender + "");

        },
        error: function (response) { alert(response.responseText); }
    });

}

function loadSubEmployeeHelp(barcodeId, container, first) {
    var $con = $("#" + container);
    if (first) {
        $con.find("#edit").unbind("click").bind('click', function () {
            $con.parent().find("[id='a_EmployeeEdit']").trigger("click")
        });
        $con.find("#accessDetail").unbind("click").bind('click', function () {
            $con.parent().find("[id='a_EmployeeAccessDetails']").trigger("click")
        });
        $con.find("#roles").unbind("click").bind('click', function () {
            $con.parent().find("[id='a_EmployeeRole']").trigger("click")
        });
        $con.find("#branches").unbind("click").bind('click', function () {
            $con.parent().find("[id='a_EmployeeShop']").trigger("click")
        });
        $con.find("#counters").unbind("click").bind('click', function () {
            $con.parent().find("[id='a_EmployeeCounter']").trigger("click")
        });
    }
}

function loadEmployeeEdit(employeeid, container, first) {
    getEmployee(employeeid, container);
    if (first) {
        var $con = $("#" + container);
        $con.find("#butn_Editemployee").button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        }).unbind('click').click(function () {
            if (validateAll($("#" + container)))
                EditEmployee(container);
        });
        $con.find("#text_empregdateEdit").datepicker({ changeMonth: true, changeYear: true, onClose: function () { validateAll($("#" + container)) } });
        $con.find("#text_emphdate").datepicker({ changeMonth: true, changeYear: true, onClose: function () { validateAll($("#" + container)) } });
        aComplete({ methodname: "GetCompletionListByEmployeeName", servicename: "Management", id: "text_empmaneger", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "text_empmaneger" });
    }
}


function EditEmployee(container) {
    var con = $("#" + container);
    $.ajax({
        type: "POST",
        url: "Management/EditEmployee",
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + con.find("#hid_empid").val() +
              "', name: '" + con.find("#text_empName").val() + "', famil: '" + con.find("#text_empfamily").val() +
              "', gender: '" + con.find("#ddl_m_Gender").val() + "', bdate: '" + con.find("#text_empbdate").val() +
              "', regdate: '" + con.find("#text_empregdateEdit").val() + "', hdate: '" + con.find("#text_emphdate").val() +
              "', meli: '" + con.find("#text_empmelicode").val() + "', acc: '" + con.find("#text_empaccount").val() +
              "', manage: '" + con.find("#text_empmaneger").val() + "', addressId: '" + getHierarchySelectedValue("divEmployeeAddress", container) + "'}",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.msg);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}



function loadEmployeeAccessDetails(employeeid, container, first) {
    if (first) {
        var $con = $("#" + container);
        $con.find("#btn_ChangeEmail").off().on('click', function (event) {
            ChangeUserName(container, employeeid)
        });
        $con.find("#btn_changePassword").button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        }).off().on('click', function (event) {
            if (validateAll($con.find("#div_pass")))
                ChangePassword(container, employeeid)
        });
        $con.find("#btn_editEmail").button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        }).off().on('click', function (event) {
            if (validateAll($con.find("#div_email")))
                ChangeEmail(container, employeeid);
        });
        ChangeCheckBoxName("cb_userStatus", container);
        $con.find("#cb_userStatus" + container).button();
        getEmployeeEmail(container, employeeid);
        $con.find("#cb_userStatus" + container).unbind('change').change(function () {
            SetUserStatus(employeeid, this.checked);
            if (this.checked)
                $(this).button("option", "label", "غیرفعال");
            else
                $(this).button("option", "label", "فعال");
        });

    }
}


function SetUserStatus(employeeId, status) {
    $.ajax({
        type: "POST",
        url: "Management/SetUserStatus",
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + employeeId + "', status: '" + status + "'}",
        error: function (response) {
            translate("error");
        },
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            return response.msg;
        }
    });
}
function getEmployeeEmail(container, employeeId) {
    var $con = $("#" + container);

    $.ajax({
        type: "POST",
        url: "Management/GetEmployeeEmail",
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + employeeId + "'}",
        error: function (response) {
            translate("error");
        },
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isdone) {
                $con.find("#text_empemailEdit").val(response.msg);
                if (response.status) {
                    $con.find("#cb_userStatus" + container).attr("checked", true);
                    $con.find("#cb_userStatus" + container).button("option", "label", "غیرفعال");
                }
                else {
                    $con.find("#cb_userStatus" + container).attr("checked", false);
                    $con.find("#cb_userStatus" + container).button("option", "label", "فعال");
                }
            }
            else
                translate(response.msg);
        }

    });
}

function ChangeEmail(container, employeeId) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        url: "Management/ChangeEmail",
        contentType: "application/json; charset=utf-8",
        data: "{email: '" + $con.find("#text_empemailEdit").val() + "', id: '" + employeeId + "'}",
        error: function (response) {
            translate("error");
        },
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.isdone)
                alert("ایمیل با موفقیت ثبت شد.")
            else
                translate(response.msg)
        }

    });
}

function ChangePassword(container, employeeId) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        url: "Management/ChangePassword",
        contentType: "application/json; charset=utf-8",
        data: "{oldPassword: '" + $con.find("#txt_s_OldPassword").val() + "', newPassword: '" + $con.find("#txt_s_NewPassword").val() + "', passwordConfirm: '" + $con.find("#txt_s_PasswordConfirm").val() + "', id: '" + employeeId + "'}",
        error: function (response) {
            translate("error");
        },

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response == "different")
                alert("تکرار کلمه عبور با کلمه عبور برابر نیست.");
            else
                if (response == "done")
                    alert("کلمه عبور ا موفقیت ثبت شد.")
                else if (response == "incorrect")
                    alert("کلمه عبور صحیح نیست.")
        }

    });

}

function ChangeUserName(container, employeeId) {
    var $con = $("#" + container);
    $.ajax({

        type: "POST",
        url: "Management/ChangeUserName",
        contentType: "application/json; charset=utf-8",
        data: "{password: '" + $con.find("#txt_s_CurrentPassword").val() + "', newUser: '" + $con.find("#txt_s_NewUserName").val() + "', userConfirm: '" + $con.find("#txt_s_UserNameConfirm").val() + "', id: '" + employeeId + "'}",
        error: function (response) {
            translate("error");
        },

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response == "exist")
                alert("نام کاربری مجاز نیست.");
            else
                if (response == "different")
                    alert("ایمیل با تکرار ایمیل برابر نیست.")
                else
                    document.getElementById("userEmail").innerHTML = "<strong>نام کاربری فعلی شما </strong>" + response + "<strong> می باشد.</strong>"
            }

        });

    }

    var RolezTree;
    function loadEmployeeRole(id, container, first) {
        if (first) {
            var $con = $("#" + container);

            var conId = "treeDemo" + container;
            $con.find("#treeDemo").attr('id', "treeDemo" + container);
            Rolesetting.async.otherParam = { "empId": id };
            $.fn.zTree.init($con.find("#" + conId), Rolesetting);
            RolezTree = $.fn.zTree.getZTreeObj(conId);
            $con.find("#btn_Refresh").off().on('click', function () {
                $.fn.zTree.init($con.find("#" + conId), Rolesetting);
                RolezTree = $.fn.zTree.getZTreeObj(conId);
            })


            $con.find('#frm_EmployeeRole').ajaxForm({
                success: function (response) {
                    if (response.isdone) {
                        if (response.isEdit) {
                            CategoryEditTreeNode(response.name, response.isCheck, response.id);
                        }
                        else {
                            var node = { 'name': response.name, 'id': response.id, 'isChecked': response.isCheck };
                            categoryaddNewTreeNode(node);
                        }
                    }
                    else
                        alert(response.msg);
                },
                complete: function (xhr) {

                }
            });

        }
    }



    var Rolesetting = {
        view: {
            fontCss: RolegetFont,
            nameIsHTML: true
        },
        edit: {
            enable: true,
            showRenameBtn: false,
            showRemoveBtn: false
        },
        check:
    {
        enable: true,
        chkDisabledInherit: true
    },
        data: {
            simpleData: {
                enable: true
            },
            key:
        {
            checked: "isChecked"

        }

        },
        async: {
            enable: true,
            url: "Management/getRoleList",
            autoParam: ["id", "name"]
        },

        callback: {
            onAsyncSuccess: RoleonAsyncSuccess,
            onCheck: RoleonCheck
        }
    };

    function RolegetFont(treeId, node) {
        return node.font ? node.font : {};
    }
    function RoleonAsyncSuccess(event, treeId, treeNode, msg) {
        var container = "frm_EmployeeRole";
        var $con = $("#" + container);
        $con.find(".zTreeDemoBackground li:even").css("background-color", "#FFFFFF");
        $con.find(".zTreeDemoBackground li:odd").css("background-color", "#E6F2FF");

    }
    function RoleonCheck(event, treeId, treeNode) {
        $.ajax({
            type: "POST",
            url: "Management/AddroleforUser",
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + treeNode.empId + "', role: '" + treeNode.name + "', ischecked: '" + treeNode.isChecked + "' }",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone)
                    alert("نقش ها با موفقیت ثبت شد.");
                else {
                    translate(response.msg);
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        return false;
    }

    function loadEmployeeShop(id, container, first) {
        getEmployeeShopList(id, container);
        if (first) {
            var $con = $("#" + container);
            bindItemsForSelectCombo({ methodname: "getShopNameByUser", servicename: "Management", headertext: "انتخاب شعبه", id: "ParentEmployeeShop", container: container });
            $con.find("#addEmployeeShop").button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            }).off().on('click', function (event) {
                addEmployeeShop(id, container);
            });
            $("#" + container).find("#refreshEmployeeShopList").button({ icons: {
                primary: "ui-icon-refresh"
            },
                text: false
            }).unbind('click').click(function () {
                getEmployeeShopList(id, container);
                bindItemsForSelectCombo({ methodname: "getShopNameByUser", servicename: "Management", headertext: "انتخاب شعبه", id: "ParentEmployeeShop", container: container });
            });
        }
    }

    function addEmployeeShop(id, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/AddEmployeeShop",
            contentType: "application/json; charset=utf-8",
            data: "{shopid: '" + $con.find("#ParentEmployeeShop").val() +
              "', personid: '" + id + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
                getEmployeeShopList(id, container);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }


    function getEmployeeShopList(id, container) {

        var $con = $("#" + container);

        $.ajax({
            type: "POST",
            url: "Management/getEmployeeShopList",
            contentType: "application/json; charset=utf-8",
            data: "{ personid: '" + id + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var shop = (typeof response) == 'string' ? eval('(' + response + ')') : response;
                var shopItem = "";
                for (var j = 0; j < shop.length; j++) {
                    var val = shop[0, j];
                    shopItem += "<tr id='tr" + val.ShopId + "' ><td width='80%'>" + val.Name + val.Code + "</td>" +
                    "<td id='delete' width='20%'><button id='a_Button'>حذف</button></td></tr>";
                }
                $con.find("#EmployeeShopList").html(shopItem).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
                //  $con.find("#EmployeeShopList").parent().tableScroll({ height: 380 });
                //  TableAlter(container);
                $con.find("[id=a_Button]").button({
                    icons: {
                        primary: "ui-icon-closethick"
                    },
                    text: false
                }).click(function () {
                    if (confirm("آیا از حذف مطمئن هستید؟"))
                        RemoveEmplyeeShop($(this).parents("tr").prop("id").replace("tr", ""), id, container);
                    else
                        return;
                });
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function RemoveEmplyeeShop(shopid, personid, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/DeleteEmployeeShop",
            contentType: "application/json; charset=utf-8",
            data: "{shopid: '" + shopid +
              "', personid: '" + personid + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response);
                getEmployeeShopList(personid, container);

            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function loadEmployeeCounter(id, container, first) {
        if (first) {
            var $con = $("#" + container);
            //bindItemsForSelect("getCounterName", "Counter", container);
            bindItemsForSelectCombo({ methodname: "getCounterNameForUser", servicename: "Management", headertext: "انتخاب صندوق", id: "ParentEmployeeCounter", container: container });
            $con.find("#addEmployeeCounter").button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            }).off().on('click', function (event) {
                addEmployeeCounter(id, container);
            });
            $("#" + container).find("#refreshEmployeeCounterList").button({ icons: {
                primary: "ui-icon-refresh"
            },
                text: false
            }).unbind('click').click(function () {
                getEmployeeCounterList(id, container);
                bindItemsForSelectCombo({ methodname: "getCounterNameForUser", servicename: "Management", headertext: "انتخاب صندوق", id: "ParentEmployeeCounter", container: container });
            });
        }
        getEmployeeCounterList(id, container);
    }


    function addEmployeeCounter(id, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/AddEmployeeCounter",
            contentType: "application/json; charset=utf-8",
            data: "{counterid: '" + $con.find("#ParentEmployeeCounter").val() +
              "', personid: '" + id + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
                getEmployeeCounterList(id, container);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function getEmployeeCounterList(id, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/getEmployeeCounterList",
            contentType: "application/json; charset=utf-8",
            data: "{ personid: '" + id + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var shop = (typeof response) == 'string' ? eval('(' + response + ')') : response;
                var shopItem = "";
                for (var j = 0; j < shop.length; j++) {
                    var val = shop[0, j];
                    shopItem += "<tr id='tr" + val.AccountId + "'>" +
                    "<td width='80%'>" + val.Code + "</td>" +
                    "<td id='delete' width='80%'><button id='a_Button'>حذف</button></td></tr>";
                }
                $con.find("#EmployeeCounterList").html(shopItem).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
                // $con.find("#EmployeeCounterList").parent().tableScroll({ height: 380 });
                //  TableAlter(container);
                $con.find("[id=a_Button]").button({
                    icons: {
                        primary: "ui-icon-closethick"
                    },
                    text: false
                }).click(function () {
                    if (confirm("آیا از حذف مطمئن هستید؟"))
                        RemoveEmplyeeCounter($(this).parents("tr").prop("id").replace("tr", ""), id, container);
                    else
                        return;
                });
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function RemoveEmplyeeCounter(counterid, personid, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/DeleteEmployeeCounter",
            contentType: "application/json; charset=utf-8",
            data: "{counterid: '" + counterid +
              "', personid: '" + personid + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isDone)
                    getEmployeeCounterList(personid, container);
                translate(response.msg);

            },
            error: function (response) { alert(response.responseText); }
        });
    }

    //---------------employee end-------------------------

    //---------------shop begin-------------------

    function loadShopHelp(container, first) {
        var $con = $("#" + container);
        if (first) {

            $con.find("#newBranch").unbind("click").bind('click', function () {
                $("[id='a_ShopAdd']").trigger("click")
            });
            $con.find("#management").unbind("click").bind('click', function () {
                $("[id='a_ShopList']").trigger("click")
            });

        }
    }
    function loadShopAdd(container, first) {
        if (first) {
            var $con = $("#" + container);
            $con.find("#text_shopDateStart").datepicker({ changeMonth: true, changeYear: true, onClose: function () { validateAll($("#" + container)) } });
            bindHierarchyData({ id: "divShopAddress", container: container, table: "address", canmodify: true, css: "selectsmall1 required validate" });
            bindItemsForSelectCombo({ methodname: "getShopName", servicename: "Management", headertext: "انتخاب شعبه", id: "ParentShopName", container: container });
            $con.find("#addShop").button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            }).unbind('click').click(function () {
                if (validateAll($("#" + container)))
                    addShop(container);
            });
        }
    }

    function loadShopList(container, first) {
        if (first) {
            $("#" + container).find("#refreshShopList").button({ icons: {
                primary: "ui-icon-refresh"
            },
                text: false
            }).unbind('click').click(function () {
                getShopList(container, { container: container, callbackmethod: getEmployeeList, fname: "", page_index: 0,
                    build: buildShopList, servicename: "Management", methodname: "GetListShop", print: false
                });
                //                getShopList(container);
            });
            getShopList(container, { container: container, callbackmethod: getEmployeeList, fname: "", page_index: 0,
                build: buildShopList, servicename: "Management", methodname: "GetListShop", print: false
            });
            //            getShopList(container);
            //  GetSubMenuItems("a_ShopList", container);
        }
    }

    function loadShopEdit(id, container, first) {
        if (first) {
            var $con = $("#" + container);
            $con.find("#text_shopDateStart").attr("id", "text_shopDateStart" + container);
            $con.find("#text_shopDateStart" + container).datepicker({ changeMonth: true, changeYear: true, onClose: function () { validateAll($("#" + container)) } });
            //            bindHierarchyData({ id: "divShopAddress", container: container, table: "address", canmodify: true, css: "selectsmall1 required validate" });
            bindItemsForSelectCombo({ servicename: "Management", methodname: "getShopName", headertext: "شعبه اصلی", id: "ParentShopName", container: container });
            ajDropDown.done(function () { getShop(id, container); });
            $con.find("#addShop").button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            }).unbind('click').click(function () {
                if (validateAll($("#" + container)))
                    EditShop(id, container);
            });
        }
    }

    function getShop(idShop, container) {
        $.ajax({
            type: "POST",
            url: "Management/getShop",
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + idShop + "' }",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var Item = (typeof response) == 'string' ? eval('(' + response + ')') : response;
                var ItmVal = Item[0];
                var $con = $("#" + container);
                // con.find().val(ItmVal.ShopId)
                $con.find("#text_shopCode").val(ItmVal.Code);
                $con.find("#text_shopFax").val(ItmVal.Fax);
                bindHierarchyData({ id: "divShopAddress", table: "address", container: container, parentid: ItmVal.AddressId, css: "selectsmall required validate" });

                //   DataBindForHierarchy("divShopAddress", ItmVal.AddressId, "address", "0", 20, container);
                $con.find("#text_shopDateStart" + container).val(ItmVal.startdate);
                $con.find("#text_shopEmail").val(ItmVal.Email);
                $con.find("#text_shopName").val(ItmVal.Name);
                $con.find("#ParentShopName").val(ItmVal.ParentShopId);

            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function addShop(container) {
        var $con = $("#" + container);

        var DTO = { 'code': $con.find("#text_shopCode").val(),
            fax: $con.find("#text_shopFax").val(),
            address: getHierarchySelectedValue("divShopAddress", container),
            startdate: $con.find("#text_shopDateStart").val(),
            email: $con.find("#text_shopEmail").val(),
            name: $con.find("#text_shopName").val(),
            parent: $con.find("#ParentShopName").val()
        }

        $.ajax({
            type: "POST",
            url: "Management/AddShop",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone)
                    $("#ddl_s_Branch").append("<option value='" + response.shopId + "'>" + response.shopName + "</option>");
                translate(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }


    function EditShop(id, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/EditShop",
            contentType: "application/json; charset=utf-8",
            data: "{id:'" + id + "',code: '" + $con.find("#text_shopCode").val() +
              "', fax: '" + $con.find("#text_shopFax").val() +
              "', address: '" + getHierarchySelectedValue("divShopAddress", container) +
              "', startdate: '" + $con.find("#text_shopDateStart" + container).val() +
              "', email: '" + $con.find("#text_shopEmail").val() +
              "', name: '" + $con.find("#text_shopName").val() +
              "', parent: '" + $con.find("#ParentShopName").val() +
              "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function deleteShop() {
        $.ajax({
            type: "POST",
            url: "Management/DeleteShop",
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + 0 + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }


    function buildShopList(jq, container) {
        var $con = $("#" + container.pagingContainer);
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "code", width: "10%" });
        lsth.push({ title: "fax", width: "15%" });
        lsth.push({ title: "address", width: "15%" });
        lsth.push({ title: "dateStart", width: "15%" });
        lsth.push({ title: "email", footer: jq.sumDebtor, width: "16%" });
        lsth.push({ title: "name", width: "15%" });
        lsth.push({ title: "mainBranch", width: "15%" });
        if (!container.params.print) {
            lsth.push({ title: "deleteKey", width: "4%" });
        }
        var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
        var ItemList = "";
        if (List != null)
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                var trBody = {};
                if (!container.params.print)
                    trBody[0] = { trId: val.ShopId };
                trBody[1] = { name: "code", html: val.Code, width: "10%" };
                trBody[2] = { name: "fax", html: val.Fax, width: "15%" };
                trBody[3] = { name: "address", html: val.Address, width: "15%" };
                trBody[4] = { props: { date: val.StartingDate, name: "date", width: "16%", klass: "dateLong" }, html: val.StartingDate };
                trBody[5] = { name: "email", html: val.Email, width: "15%" };
                trBody[6] = { name: "name", html: val.Name, width: "15%" };
                trBody[7] = { name: "name", html: val.parent, width: "15%" };
                lstb.push(trBody);
            }
        table = { header: lsth, body: lstb, details: { deleteFunction: RemoveShopElement, rowClick: ClickShop }, heigth: 300,
            container: container.pagingContainer, divName: "shopList"
        };
        buildTable(table);
    }

    function RemoveShopElement(idShop, container) {
        container
        $.ajax({
            type: "POST",
            url: "Management/DeleteShop",
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + idShop + "' }",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isDone)
                    getShopList(container, { container: container, callbackmethod: getEmployeeList, fname: "", page_index: 0,
                        build: buildShopList, servicename: "Management", methodname: "GetListShop", print: false
                    });
                //                    getShopList(container);
                translate(response.msg);

            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function getShopList(container, params) {
        var $con = $("#" + container);
        //    params["DTO"] = DTO;
        pageselectCallback(0, params, { container: "", noPaging: true, fname: params.fname, pagingContainer: container,
            first: true, isOrder: false
        });

    }

    function ClickShop($dis, container) {

        createSubTab({ row: $dis, name: "a_ShopList" });
        itemId = $dis.prop("id").replace("tr", "");
        //  employeeid = itemId;
        onRowClick($dis);
    }


    //---------------shop end----------------------

    //---------------counter begin-----------------
    function loadCounterHelp(container, first) {
        var $con = $("#" + container);
        if (first) {

            $con.find("#newCounter").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_CounterAdd']").trigger("click")
            });
            $con.find("#banks").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_Bank']").trigger("click")
            });
            $con.find("#management").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_CounterList']").trigger("click")
            });
        }
    }

    function loadCounterAdd(container, first) {
        var $con = $("#" + container);
        bindItemsForSelectCombo({ servicename: "Management", methodname: "getShopName", headertext: "شعبه اصلی", id: "ParentShopCounter", container: container });
        if (first) {
            $con.find("#addCounter").button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            }).unbind('click').click(function () {
                if ($con.find("#ParentShopCounter").val() == "") {
                    alert("شعبه را انتخاب کنید.");
                    return;
                }
                if (validateAll($("#" + container)))
                    addCounter(container);
            });
        }
    }
    function loadCounterList(container, first) {
        if (first) {
            var $con = $("#" + container);
            $con.find("#refreshCounterList").button({ icons: {
                primary: "ui-icon-refresh"
            },
                text: false
            }).off().on('click', function (event) {
                getCounterList(container, { container: container, callbackmethod: getCounterList, fname: "", page_index: 0,
                    build: buildCounterList, servicename: "Management", methodname: "GetCounterlist", print: false
                });
            });
            getCounterList(container, { container: container, callbackmethod: getCounterList, fname: "", page_index: 0,
                build: buildCounterList, servicename: "Management", methodname: "GetCounterlist", print: false
            });
            // GetSubMenuItems("a_CounterList", container);
        }
    }

    function loadCounterEdit(counterid, container, first) {
        if (first) {
            var $con = $("#" + container);
            bindItemsForSelectCombo({ servicename: "Management", methodname: "getShopName", headertext: "شعبه اصلی", id: "ParentShopCounter", container: container });
            $con.find("#addCounter").button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            }).unbind('click').click(function () {
                if ($con.find("#ParentShopCounter").val() == "") {
                    alert("شعبه را انتخاب کنید.");
                    return;
                }
                if (validateAll($("#" + container)))
                    EditCounter(counterid, container);
            });
            ajDropDown.done(function () {
                $con.find("#ParentShopCounter").val($("#tr" + counterid).find("td[name=branchName]").prop('id'));
                $con.find("#text_Code").val($("#tr" + counterid).find("td[name=name]").attr("code"));
            });
        }
    }

    function addCounter(container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/AddCounter",
            contentType: "application/json; charset=utf-8",
            data: "{code: '" + $con.find("#text_Code").val() +
              "', shopid: '" + $con.find("#ParentShopCounter").val() + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone) {
                    $("#ddl_m_Counter").append("<option value='" + response.counterId + "'>" + response.counterName + "</option>");
                    $("#ddl_m_Counter").attr("disabled", false);
                }
                translate(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function EditCounter(counterid, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/EditCounter",
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + counterid + "', code: '" + $con.find("#text_Code").val() +
              "', shopid: '" + $con.find("#ParentShopCounter").val() + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function buildCounterList(jq, container) {
        var $con = $("#" + container.pagingContainer);
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "code", width: "46%" });
        lsth.push({ title: "branchName", width: "50%" });
        if (!container.params.print) {
            lsth.push({ title: "deleteKey", width: "4%" });
        }
        var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
        var ItemList = "";
        if (List != null)
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                var trBody = {};
                if (!container.params.print)
                    trBody[0] = { trId: val.AccountId };
                trBody[1] = { props: { name: "name", width: "46%", code: val.Code }, html: "<span>counter</span> " + val.Code };
                trBody[2] = { props: { id: val.ShopId, name: "branchName", width: "50%" }, html: val.Name + "  " + val.ShopCode };
                lstb.push(trBody);
            }
        table = { header: lsth, body: lstb, details: { deleteFunction: RemoveCounterElement, rowClick: clickCounter }, heigth: 300,
            container: container.pagingContainer, divName: "CounterList"
        };
        buildTable(table);
    }

    function getCounterList(container, params) {
        var $con = $("#" + container);
        //    params["DTO"] = DTO;
        pageselectCallback(0, params, { container: "", noPaging: true, fname: params.fname, pagingContainer: container,
            first: true, isOrder: false
        });
    }

    function clickCounter($dis, container) {

        createSubTab({ row: $dis, name: "a_CounterList" });
        itemId = $dis.prop("id").replace("tr", "");
        //  employeeid = itemId;
        onRowClick($dis);
    }
    function RemoveCounterElement(CounterId, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/DeleteCounter",
            contentType: "application/json; charset=utf-8",
            data: "{Cid: '" + CounterId + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
                if (response.isDone)
                    getCounterList(container, { container: container, callbackmethod: getCounterList, fname: "", page_index: 0,
                        build: buildCounterList, servicename: "Management", methodname: "GetCounterlist", print: false
                    });

            },
            error: function (response) { alert(response.responseText); }
        });
    }

    //----------------new Bank begin-------------------

    function loadBank(container, first) {
        if (first) {
            bindXmlDropDownData({ id: "Bank_Name", container: container, path: "Data/BankTitle", canmodify: true, istext: false, headertext: "انتخاب بانک ", css: "selectsmall " });
        }
    }

    //----------------new Bank end-------------------

    //---------------counter end-------------------

    //---------------supplier begin----------------
    function loadSupplierHelp(container, first) {
        var $con = $("#" + container);
        if (first) {

            $con.find("#newSupplier").unbind("click").bind('click', function () {
                $("[id='a_SupplierAdd']").trigger("click")
            });
            $con.find("#management").unbind("click").bind('click', function () {
                $("[id='a_SupplierList']").trigger("click")
            });
            $con.find("#accountDetail").unbind("click").bind('click', function () {
                $("[id='a_SupplierAccounting']").trigger("click")
            });
            $con.find("#changeQuantity").unbind("click").bind('click', function () {
                $("[id='a_EditQuantityOrder']").trigger("click")
            });

        }
    }

    function loadSupplierAdd(container, first) {
        if (first) {
            var $con = $("#" + container);
            bindHierarchyData({ id: "divSupplierAddress", container: container, table: "address", canmodify: true });
            $con.find("#AddSupplier").off().on('click', function () {
                if (validateAll($("#" + container)))
                    addSupplier(container);
            }).button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            });
        }
    }

    function addSupplier(container) {
        var $con = $("#" + container);
        var DTO = { 'name': $con.find("#SupplierName").val(), 'family': $con.find("#SupplierFamily").val(), 'age': $con.find("#SupplierAge").val(), 'gender': $con.find("#ddl_m_Gender").val(), 'fax': $con.find("#SupplierFax").val(), 'mobile': $con.find("#SupplierMobile").val(), 'phone': $con.find("#Supplierphone").val(), 'addressid': getHierarchySelectedValue("divSupplierAddress", container), 'email': $con.find("#SupplierEmail").val(), 'date': $("#userDefault").find("#txt_s_Date").val() };
        //string name,string family,int age,bool gender,int registererid,string job,string mobile,string phone,int addressid
        $.ajax({
            type: "POST",
            url: "Management/AddSupplier",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.count > 0)
                    ResetPage(container);
                translate(response.alert);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function loadEditQuantityOrder(container, first) {
        var $con = $("#" + container);
        if (first) {
            $con.find("[name='changeQuantity']").remove();
            $con.find("[name='setPayment']").removeClass("invisible");
            $con.find("#spClient").html("supplier")
            $con.find("#txt_s_Person").attr("placeholder", "supplier")
            $con.find("#cbSetPayment").unbind('change').change(function () {
                if (this.checked) $(this).button("option", "label", "setPayment"); else $(this).button("option", "label", "noPayment");
                localize();
            }).button();
            loadOrder(0, container, GetItemOrder, false, true, first, { isfastorder: true, isChangeQuantity: true });
        }
    }

    function loadSupplierList(container, first) {
        var $con = $("#" + container);
        if (first) {
            $con.find('#moreFilter').slideUp('fast');
            $con.find('.toggle-more-filters').click(function () {
                $(this).toggleClass("open")
                $con.find("#divBasic").toggleClass("hidden")
                $con.find('#moreFilter').removeClass('invisible');
                $con.find('#moreFilter').slideToggle(function () {
                });
            });
            sortid = 'AccountId desc';
            $con.find("#SearchBy").val("Name");
            getSupplierList(container, { container: container, callbackmethod: getSupplierList, fname: "", page_index: 0,
                build: buildSupplierList, servicename: "Management", methodname: "GetSupplierList", print: false
            });
            $con.find("#SupplierSearchRegDateStart").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#SupplierSearchRegDateEnd').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });

            $con.find("#SupplierSearchRegDateEnd").datepicker({ changeMonth: true, changeYear: true });

            $con.find("#DialogBarcode").dialog({ autoOpen: false }).dialog({ width: 750 })
            $con.find("#btnSearchSupplier").unbind('click').click(function () {
                getSupplierList(container, { container: container, callbackmethod: getSupplierList, fname: "", page_index: 0,
                    build: buildSupplierList, servicename: "Management", methodname: "GetSupplierList", print: false
                });
            }).button({ icons: {
                primary: "ui-icon-search"
            }
            });
            $con.find("#SupplierAdvanceSearchbt").unbind('click').click(function () { getSupplierList(container); }).button();
        }
    }


    function getSupplierList(container, params) {
        var $con = $("#" + container);
        var first = true;
        var take = $con.find("#PageSize").val();
        var skip = 0;
        var page_index = 0
        var code = "", name = "", regname = "", Introducer = "";
        var DTO = [];
        if (!$con.find("#moreFilter").is(":visible")) {

            var search = $con.find("#SearchBy").val();
            if (search == "Code") {

                code = $con.find("#SuppliertxtSearch").val();
            } if (search == "Name") {

                name = $con.find("#SuppliertxtSearch").val();
            } if (search == "RegName") {

                regname = $con.find("#SuppliertxtSearch").val();
            }
            if (container == "selectSupplierContent") {
                name = $con("#selectSupplierName").val();
                regname = $con("#selectSupplierRegisterer").val();
            }
            DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'code': code, 'namefamily': name, 'registerername': regname, 'agefrom': "", 'ageto': "", 'regdatefrom': "", 'regdateto': "" };
        }
        else {
            DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'code': $con.find("#SupplierSearchCode").val(), 'namefamily': $con.find("#SupplierSearchName").val(), 'registerername': $con.find("#SupplierSearchRegName").val(), 'agefrom': $con.find("#SupplierSearchAgeStart").val(), 'ageto': $con.find("#SupplierSearchAgeEnd").val(), 'regdatefrom': $con.find("#SupplierSearchRegDateStart").val(), 'regdateto': $con.find("#SupplierSearchRegDateEnd").val() };
        }
        params["DTO"] = DTO;
        pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
            first: true, isOrder: false
        });
    }


    function buildSupplierList(jq, params) {
        var $con = $("#" + params.pagingContainer);
        jq = jq.results;
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "usernameCode", sort: "p_Person.Code", width: "8%" });
        lsth.push({ title: "nameAndFamily", sort: "p_Person.Family", width: "21%" });
        //    lsth.push({ title: "introducer", sort: "p_Customer2.p_Person.Family", width: "14%" });
        if (container != "divdialogCustomer") {
            //        lsth.push({ title: "email", sort: "aspnet_Membership.Email", width: "20%" });
            lsth.push({ title: "age", sort: "p_Person.DateOfBirth", width: "4%" });
            lsth.push({ title: "dateOfRegistration", sort: "p_Person.RegDate", width: "10%" });
            lsth.push({ title: "gender", sort: "p_Person.Gender", width: "5%" });
            lsth.push({ title: "registrator", sort: "p_Person1.Family", width: "14%" });
            lsth.push({ title: "deleteKey", width: "4%" });
        }
        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            trBody[0] = { trId: val.AccountId };
            trBody[1] = { name: "code", html: val.Code, width: "8%" };
            trBody[2] = { name: "name", html: val.Name + "  " + val.Family, width: "21%" };
            //        trBody[3] = { html: val.introducerName + "  " + val.introducerFamily, width: "14%" };
            if (container != "divdialogCustomer") {
                //            trBody[4] = { html: val.email == 0 ? "__" : val.email, width: "20%" };
                trBody[3] = { html: val.age == 0 ? "__" : val.age, width: "4%" };
                trBody[4] = { html: val.regdate, props: { date: val.regdate, width: "10%", klass: "date"} };
                trBody[5] = { html: val.Gender == true ? 'مرد' : 'زن', width: "5%" };
                trBody[6] = { html: val.regName + "  " + val.regFamily, width: "14%" };
            }
            lstb.push(trBody);
        }
        table = { header: lsth, body: lstb, details: { rowClick: ClickSupplier }, heigth: 300, width: 500,
            container: params.pagingContainer, divName: "SupplierList", rowClickParams: { textboxId: "CustomerIntroducerCode" }
        };
        if (params.pagingContainer != "divdialogCustomer") {
            details = { deleteFunction: RemoveSupplierElement, rowClick: ClickSupplier };
            table = { header: lsth, body: lstb, details: details, heigth: 300, container: params.pagingContainer,
                divName: "SupplierList"
            };
        }

        buildTable(table);
        if (params.pagingContainer == "divdialogCustomer")
            $con.dialog('open');
    }
    function ClickSupplier($dis, container) {
        var $con = $("#" + container);
        //$con("#" + textin).val($con("#" + $dis.prop("id")).children("td[name='code']").html());

        if (container == "diva_selectSupplierList") {
            $con("#SupplierContent").find("#SuppliertxtSearch").val($con.find("#" + $dis.prop("id")).children("td[name='code']").html());
            $con("#SupplierContent").find("#SupplierSearchIndtroducerName").val($con.find("#" + $dis.prop("id")).children("td[name='code']").html());
            // parent.$.fancybox.close();
        }
        else {
            createSubTab({ row: $dis, name: "a_SupplierList" });
            onRowClick($dis);
        }

    }

    function RemoveSupplierElement(personid, container) {
        var $con = $("#" + container);
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: "{personid: '" + personid + "'}",
            type: "Post",
            url: "Management/DeleteSupplier",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
                getSupplierList(container);

            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function loadSubSupplierHelp(barcodeId, container, first) {
        var $con = $("#" + container);
        if (first) {

            $con.find("#submitInvoice").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_SupplierOrder']").trigger("click")
            });
            $con.find("#submitWholesaleInvoice").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_SupplierWholesaleOrder']").trigger("click")
            });
            $con.find("#edit").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_SupplierEdit']").trigger("click")
            });
            $con.find("#editPhone").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_CustomerPhoneEdit']").trigger("click")
            });
            $con.find("#supplierPayment").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_SupplierPayment']").trigger("click")
            });
            $con.find("#management").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_SupplierInvoiceList']").trigger("click")
            });
            $con.find("#accountDetail").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_AccountDetailsSupplier']").trigger("click")
            });

        }
    }

    function loadSupplierOrder(supplierid, container, first) {
        loadOrder(supplierid, container, GetItemOrder, false, false, first);

    }

    function loadSupplierWholesaleOrder(supplierid, container, first) {

        loadOrder(supplierid, container, GetItemOrderWholesale, true, false, first);
    }

    //function loadSupplierPayment(Supplierid, container, first) {
    //    if (first) {
    //        var $con = $("#" + container);

    //        $con.find("#div_customer").addClass("invisible");
    //        $con.find("#txt_payer").removeClass("required");
    //        $con.find("#ddl_CounterTo").addClass("invisible");
    //        $con.find("#lbl_CounterTo").addClass("hidden");
    //        $con.find("#lbl_payer").addClass("hidden");
    //        ChangeCheckBoxGroupName("radio", container);
    //        setRadioValue("radio" + container, "true", container);
    //        $con.find("#radio" + container).buttonset();
    //        $con.find("#btn_Cash").off().on('click', function () {
    //            GetItemCash(container);
    //        }).button({ icons: {
    //            primary: "ui-icon-plus"
    //        },
    //            text: true
    //        });
    //        $con.find("#btn_Cheque").off().on('click', function () {
    //            if (first) {
    //                $con.find("#divslider2").removeClass("invisible");
    //                $con.find("#table_cheque").removeClass("invisible");
    //            }
    //            GetItemCheque(container);
    //        }).button({ icons: {
    //            primary: "ui-icon-plus"
    //        },
    //            text: true
    //        });

    //        $con.find("#btn_Add_Payment").off().on('click', function () {
    //            if (validateAll($con) && $con.find("#txt_SumPeyment").val() != "0")
    //                AddPayment(Supplierid, container);
    //        }).button({ icons: {
    //            primary: "ui-icon-disk"
    //        },
    //            text: true
    //        });
    //        GetItemCash(container);

    //        $con.find("#btnPrint").die().live('click', function () {
    //            PrintPaymentDetails(container, $con.find("#hi_paymentId").val());
    //        }).button({ icons: {
    //            primary: "ui-icon-print"
    //        },
    //            text: true
    //        });
    //    }
    //}

    function AddPayment(Supplierid, container) {
        var $con = $("#" + container);
        if ($con.find("#txt_SumPeyment").val() == "0")
            return;
        var Cashes = [];
        var Cheques = [];
        var Voucher = [];

        if ($con.find("#ddl_CounterTo").val() == $("#userDefault").find("#ddl_m_Counter").val()) {
            alert("صندوق مبدا و مقصد یکسان است.");
            return;
        }
        $.each($("#" + container).find("tr[id*=Cash_]"), function () {
            var cash = {};
            cash["CurrencyId"] = $("#ddl_m_Currency_" + this.id).val();
            cash["Amount"] = $(this).find("#txt_m_Amount").val();
            cash["Type"] = getRadioSelectedValue("radioPayment" + this.id);
            Cashes.push(cash);
        });
        $.each($("#" + container).find("tr[id*=Cheque_]"), function () {
            var cheque = {};
            if ($(this).find("#ddl_m_Bank_" + this.id).val() == "" || $(this).find("#txt_m_Serial").val() == "" ||
             $(this).find("[name='txt_m_DueDate']").val() == "" || $(this).find("#txt_m_Amount").val() == "")
                return;
            cheque["Bank"] = $(this).find("#ddl_m_Bank_" + this.id).val();
            cheque["Serial"] = $(this).find("#txt_m_Serial").val();
            cheque["DueDate"] = $(this).find("[name='txt_m_DueDate']").val();
            cheque["CurrencyId"] = $("#ddl_m_Currency_" + this.id).val();
            cheque["Amount"] = $(this).find("#txt_m_Amount").val();
            Cheques.push(cheque);
        });
        $.each($("#" + container).find("tr[id*=voucher_]"), function () {
            //        var voucher = {};
            //        voucher["number"] = $(this).find("[name=voucherNumber]").html();
            Voucher.push($(this).find("[name=voucherNumber]").html());
        });
        var DTO = { 'cash': Cashes, 'cheque': Cheques, 'voucher': Voucher, 'supplierid': Supplierid, 'payerCode': $con.find("#txt_payer").val(),
            'counterid': $("#userDefault").find("#ddl_m_Counter").val(), 'pay': getRadioSelectedValue("radio" + container, container),
            'tocounterid': $con.find("#ddl_CounterTo").val(), 'description': $con.find("#txt_description").val(), 'date': $("#userDefault").find("#txt_s_Date").val()
        };

        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/AddPayment",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function loadAccountDetailsSupplier(Supplierid, container, first) {
        AccountDetailsSupplier(Supplierid, container);
    }

    function AccountDetailsSupplier(Supplierid, container) {
        var $con = $("#" + container);
        DTO = { 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'Scoup': "", 'clientid': Supplierid, 'employeeid': "", 'dateFrom': "", 'dateTo': "", 'isSale': "", 'clientCode': "" };
        $.ajax({
            type: "POST",
            url: "Management/GetAccountDetailsShop",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                $con.find("#txt_d_Sale").val(response.SellAmount * 1 - response.BuyAmount * 1);
                $con.find("#txt_d_PaymentSale").val((response.PaidCash * 1 + response.PaidCheque * 1 + response.paidVoucher * 1) - (response.ReceivedCash * 1 + response.ReceivedCheque * 1 + response.ReceivedVoucher * 1));
                $con.find("#txt_d_BalanceTotal").val((response.SellAmount * 1 - response.BuyAmount * 1) - ((response.PaidCash * 1 + response.PaidCheque * 1 + response.paidVoucher * 1) - (response.ReceivedCash * 1 + response.ReceivedCheque * 1 + response.ReceivedVoucher * 1)));
                $con.find("#txt_d_SaleTotal").val(response.SellAmount);
                $con.find("#txt_d_Return").val(response.BuyAmount);
                $con.find("#txt_d_TotalPayment").val(response.PaidCash * 1 + response.PaidCheque * 1 + response.paidVoucher * 1);
                $con.find("#txt_d_TotalReceive").val(response.ReceivedCash * 1 + response.ReceivedCheque * 1 + response.ReceivedVoucher * 1);
                $con.find("#txt_d_ChequePeyment").val(response.PaidCheque);
                $con.find("#txt_d_ChequeReceive").val(response.ReceivedCheque);
                $con.find("#txt_d_CashPayment").val(response.PaidCash);
                $con.find("#txt_d_CashReceive").val(response.ReceivedCash);
                $con.find("#txt_d_TotalOff").val(response.OffBuy * 1 - response.SellAmount * 1);
                $con.find("#txt_d_profit").val(response.profit);
                $con.find("#txt_d_BuyQuantity").val(response.BuyQuantity);
                $con.find("#txt_d_SellQuantity").val(response.SellQuantity);
                $con.find("#txt_d_NetQuantity").val(response.BuyQuantity * 1 - response.SellQuantity * 1);

            },

            error: function (response) { alert(response.responseText); }
        });
    }

    function loadSupplierInvoiceList(Supplierid, container, first) {

        var $con = $("#" + container);
        if (first) {
            $con.find("#blCode").remove();
            $con.find("#hd_d_PersonId").val(Supplierid);
            $con.find("#hd_d_IsClient").val(false);
            AccountFullAcc(container, first, { print: false, selectCase: "GetItemList", onLoad: true });
        }
    }
    //---------------supplier end------------------



    //----------------customer begin--------------


    function loadCustomerHelp(container, first) {
        var $con = $("#" + container);
        if (first) {

            $con.find("#newCustomer").unbind("click").bind('click', function () {
                $("[id='a_CustomerAdd']").trigger("click")
            });
            $con.find("#management").unbind("click").bind('click', function () {
                $("[id='a_CustomerList']").trigger("click")
            });
            $con.find("#accountDetail").unbind("click").bind('click', function () {
                $("[id='a_CustomerAccounting']").trigger("click")
            });
            $con.find("#invoiceProfit").unbind("click").bind('click', function () {
                $("[id='a_CustomerOrderProfit']").trigger("click")
            });
        }
    }

    function loadSubCustomerHelp(barcodeId, container, first) {
        var $con = $("#" + container);
        if (first) {

            $con.find("#submitInvoice").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_CustomerOrder']").trigger("click")
            });
            $con.find("#submitWholesaleInvoice").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_CustomerWholesaleOrder']").trigger("click")
            });
            $con.find("#edit").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_CustomerEdit']").trigger("click")
            });
            $con.find("#editPhone").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_CustomerPhoneEdit']").trigger("click")
            });
            $con.find("#customerPayment").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_CustomerPayment']").trigger("click")
            });
            $con.find("#management").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_CustomerInvoiceList']").trigger("click")
            });
            $con.find("#accountDetail").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_AccountDetails']").trigger("click")
            });
            $con.find("#chart").unbind("click").bind('click', function () {
                $con.parent().find("[id='a_CustomerChart']").trigger("click")
            });
        }
    }


    function loadCustomerAdd(container, first) {

        customerAdd(container, first);
    }
    function loadCustomerAddToolbar(container, first) {

        customerAdd(container, first);
    }

    function customerAdd(container, first) {
        var $con = $("#" + container);
        if (first) {

            aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "Management", id: "CustomerIntroducerCode", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "CustomerIntroducerCode" });
            bindHierarchyData({ id: "divCustomerAddress", container: container, table: "address", canmodify: true });
            bindXmlDropDownData({ id: "CustomerJob", container: container, path: "Customer/jobTitle", canmodify: true, istext: false, headertext: "انتخاب شغل" });

            $con.find("#divdialogCustomer").dialog({ autoOpen: false }).dialog({ width: 600 });
            $con.find("#AddCustomer").button({ icons: {
                primary: "ui-icon-disk"
            }
            }).unbind('click').click(function () {
                if (validateAll($("#" + container)))
                    addCustomer(container);
            });
        }
    }

    function loadCustomerEdit(customerid, container, first) {
        if (first) {
            var $con = $("#" + container);
            aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "Management", id: "CustomerIntroducerCode", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "CustomerIntroducerCode" });
            bindXmlDropDownData({ id: "CustomerJobEdit", container: container, path: "Customer/jobTitle", canmodify: true, istext: true, headertext: "انتخاب شغل" });
            $con.find("#divdialogCustomer").dialog({ autoOpen: false }).dialog({ width: 600 });
            $con.find("#EditCustomer").off().on('click', function () {
                if (validateAll($("#" + container)))
                    EditCustomer(customerid, container);
            }).button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            });

            $con.find("#a_CustomerIntroducerCode").off().on('click', function () {
                opendialog({ container: "divdialogCustomer", containerpage: container });
            });
            //setTimeout(function () { getCustomer(customerid, container) }, 100);
            getCustomer(customerid, container);
        }
    }

    function loadCustomerList(container, first) {
        sortid = 'AccountId desc';
        var $con = $("#" + container);
        if (first) {
            //        $('#moreFilter').addClass('invisible');
            $con.find('#moreFilter').slideUp('fast');
            $con.find('.toggle-more-filters').click(function () {
                $(this).toggleClass("open")
                $con.find("#simpleSearch").toggleClass("hidden")
                $con.find('#moreFilter').removeClass('invisible');
                $con.find('#moreFilter').slideToggle(function () {
                    // Animation complete.
                    //                if ($con.find('#moreFilter').is(":visible"))
                    //                    $con.find("#simpleSearch").addClass("invisible");
                    //                else
                    //                    $con.find("#simpleSearch").removeClass("invisible");
                });

            });
            $container = $con.find("#customerContent");
            //bindDropDown("SearchBy", container, "evente");
            $con.find("#SearchBy").val("Name");
            //        getCustomerList({ container: container });
            getCustomerList(container, { container: container, callbackmethod: getCustomerList, fname: "", page_index: 0,
                build: buildCustomerList, servicename: "Management", methodname: "GetCustomerList", print: false
            });
            // GetSubMenuItems("a_CustomerList");

            $con.find("#CustomerSearchRegDateStart").datepicker({
                changeMonth: true,
                changeYear: true,
                onSelect: function (dateText, inst) {
                    $con.find('#CustomerSearchRegDateEnd').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });

            $con.find("#CustomerSearchRegDateEnd").datepicker({ changeMonth: true, changeYear: true });

            $con.find("#divdialogCustomer").dialog({ autoOpen: false }).dialog({ width: 600 });
            $con.find("#PageSize").off().on('change', function () {
                //            getCustomerList({ container: container });
                getCustomerList(container, { container: container, callbackmethod: getCustomerList, fname: "", page_index: 0,
                    build: buildCustomerList, servicename: "Management", methodname: "GetCustomerList", print: false
                });
            });
            $con.find("#divslider").unbind('click').click(function () { sliderClick("divCustomersearch"); sliderClick("CustomerAdvanceSearch"); });
            $con.find("#btnSearchCustomer").button({
                icons: {
                    primary: "ui-icon-search"
                },
                text: true
            }).unbind('click').click(function () {
                sortid = 'AccountId desc';
                //            getCustomerList({ container: container }); 
                getCustomerList(container, { container: container, callbackmethod: getCustomerList, fname: "", page_index: 0,
                    build: buildCustomerList, servicename: "Management", methodname: "GetCustomerList", print: false
                });
            });
            //        $con.find("#CustomerAdvanceSearchbt").button({
            //            icons: {
            //                primary: "ui-icon-search"
            //            },
            //            text: false
            //        }).unbind('click').click(function () { sortid = 'PersonId desc'; getCustomerList({ container: container }); });
        }
        $con.find("#CustomertxtSearch").val("").focus();
    }
    function loadListCustomerSelect(container, first) {

        sortid = 'AccountId desc';
        if (first) {
            var $con = $("#" + container);
            $con.find("#PageSize").off().on('change', function () {
                //            getCustomerList({ container: container }); 
                getCustomerList(container, { container: container, callbackmethod: getCustomerList, fname: "", page_index: 0,
                    build: buildCustomerList, servicename: "Management", methodname: "GetCustomerList", print: false
                });
            });
            $con.find("#btnSearchCustomer").unbind('click').click(function () {
                //            getCustomerList({ container: container });
                getCustomerList(container, { container: container, callbackmethod: getCustomerList, fname: "", page_index: 0,
                    build: buildCustomerList, servicename: "Management", methodname: "GetCustomerList", print: false
                });
            });
            $con.find("#CustomertxtSearch").focus();
        }
    }
    function loadCustomerAddressEdit(customerid, container, first) {
        var $con = $("#" + container);
        if (first) {
            getCustomerAddress(customerid, container);
            $con.find("#EditAddress").off().on('click', function () {
                EditAddressCustomer(customerid, container);
            }).button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            });
        }
    }

    function loadCustomerPhoneEdit(customerid, container, first) {
        if (first) {
            var $con = $("#" + container);
            getCustomerPhone(customerid, container);

            $con.find("#EditPhone").unbind().bind('click', function () {
                AddPhoneCustomer(customerid, container);
            }).button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            });
        }
    }

    function addCustomer(container) {
        var $con = $("#" + container);
        var DTO = { 'name': $con.find("#CustomerName").val(), 'family': $con.find("#CustomerFamily").val(), 'age': $con.find("#CustomerAge").val(),
            'gender': $con.find("#ddl_m_Gender").val(), 'job': $con.find("#CustomerJob option:selected").text(), 'mobile': $con.find("#CustomerMobile").val(), 'phone': $con.find("#Customerphone").val(), 'addressid': getHierarchySelectedValue("divCustomerAddress", container), 'address': $con.find("#CustomerFullAddressEdit").val(), 'intoducercode': $con.find("#CustomerIntroducerCode").val(), 'date': $("#userDefault").find("#txt_s_Date").val()
        };
        $.ajax({
            type: "POST",
            url: "Management/AddCustomer",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.count > 0) {
                    ResetPage(container);
                    $("#tabFullAcountReport").find("#txt_customer").val(response.code)
                }
                translate(response.alert);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function EditCustomer(customerid, container) {
        var $con = $("#" + container);
        var DTO = { 'personid': customerid, 'code': $con.find("#CustomerCodeEdit").val(), 'name': $con.find("#CustomerNameEdit").val(), 'family': $con.find("#CustomerFamilyEdit").val(), 'age': $con.find("#CustomerAgeEdit").val(), 'gender': $con.find("#ddl_m_Gender").val(), 'job': $con.find("#CustomerJobEdit option:selected").text(), 'introducercode': $con.find("#CustomerIntroducerCode").val() };
        //string name,string family,int age,bool gender,int registererid,string job,string mobile,string phone,int addressid
        $.ajax({
            type: "POST",
            url: "Management/EditCustomer",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function getCustomerList(container, params) {
        var $con = $("#" + params.container);
        var first = true;
        var take = $con.find("#PageSize").val();
        var skip = 0;
        var page_index = 0
        var DTO = [];
        var code = "", name = "", regname = "", Introducer = "", phone = "", mobile = "", email = "";
        if (!$con.find("#moreFilter").is(":visible")) {
            var search = $con.find("#SearchBy").val();
            if (search == "Code") {

                code = $con.find("#CustomertxtSearch").val();
            } if (search == "Name") {

                name = $con.find("#CustomertxtSearch").val();
            } if (search == "RegName") {

                regname = $con.find("#CustomertxtSearch").val();
            } if (search == "IntroducerName") {

                Introducer = $con.find("#CustomertxtSearch").val();
            }
            if (search == "Mobile") {

                mobile = $con.find("#CustomertxtSearch").val();
            }
            if (search == "Phone") {

                phone = $con.find("#CustomertxtSearch").val();
            }
            if (search == "Email") {

                email = $con.find("#CustomertxtSearch").val();
            }
            if (params.container == "divdialogCustomer") {
                name = $con.find("#selectCustomerName").val();
                regname = $con.find("#selectCustomerRegisterer").val();
            }
            DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'namefamily': name, 'introducer': Introducer, 'registerername': regname, 'agefrom': "", 'ageto': "", 'regdatefrom': "", 'regdateto': "", 'mobile': mobile, 'phone': phone, 'email': email };
        }
        else {
            DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'namefamily': $con.find("#CustomerSearchName").val(), 'introducer': $con.find("#CustomerIntroducerCode").val(), 'registerername': $con.find("#CustomerSearchRegName").val(), 'agefrom': $con.find("#CustomerSearchAgeStart").val(), 'ageto': $con.find("#CustomerSearchAgeEnd").val(), 'regdatefrom': $con.find("#CustomerSearchRegDateStart").val(), 'regdateto': $con.find("#CustomerSearchRegDateEnd").val(), 'mobile': mobile, 'phone': phone, 'email': email };
        }
        params["DTO"] = DTO;
        pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
            first: true, isOrder: false
        });
    }
    function buildCustomerList(jq, pageoption) {
        var $con = $("#" + pageoption.pagingContainer);
        jq = jq.results;
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "usernameCode", sort: "p_Person.Code", width: "8%" });
        lsth.push({ title: "nameAndFamily", sort: "p_Person.Family", width: "21%" });
        lsth.push({ title: "introducer", sort: "p_Customer2.p_Person.Family", width: "14%" });
        if (pageoption.pagingContainer != "divdialogCustomer") {
            lsth.push({ title: "email", sort: "aspnet_Membership.Email", width: "20%" });
            lsth.push({ title: "age", sort: "p_Person.DateOfBirth", width: "4%" });
            lsth.push({ title: "dateOfRegistration", sort: "p_Person.RegDate", width: "10%" });
            lsth.push({ title: "gender", sort: "p_Person.Gender", width: "5%" });
            lsth.push({ title: "registrator", sort: "p_Person1.Family", width: "14%" });
            lsth.push({ title: "deleteKey", width: "4%" });
        }
        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            trBody[0] = { trId: val.AccountId };
            trBody[1] = { name: "code", html: val.Code, width: "8%" };
            trBody[2] = { name: "name", html: val.Name + "  " + val.Family, width: "21%" };
            trBody[3] = { html: val.introducerName + "  " + val.introducerFamily, width: "14%" };
            if (pageoption.pagingContainer != "divdialogCustomer") {
                trBody[4] = { html: val.email == 0 ? "__" : val.email, width: "20%" };
                trBody[5] = { html: val.age == 0 ? "__" : val.age, width: "4%" };
                trBody[6] = { html: val.regdate, props: { date: val.regdate, width: "10%", klass: "date"} };
                trBody[7] = { html: val.Gender == true ? 'مرد' : 'زن', width: "5%" };
                trBody[8] = { html: val.regName + "  " + val.regFamily, width: "14%" };
            }
            lstb.push(trBody);
        }
        table = { header: lsth, body: lstb, details: { rowClick: ClickCustomer }, heigth: 300, width: 500,
            container: pageoption.pagingContainer, divName: "CustomerList", rowClickParams: { textboxId: "CustomerIntroducerCode" }
        };
        if (pageoption.pagingContainer != "divdialogCustomer") {
            details = { deleteFunction: RemoveCustomerElement, rowClick: ClickCustomerList };
            table = { header: lsth, body: lstb, details: details, heigth: 300, container: pageoption.pagingContainer,
                divName: "CustomerList"
            };
        }

        buildTable(table);
        if (pageoption.pagingContainer == "divdialogCustomer")
            $con.dialog('open');
    }


    function ClickCustomer($dis, container, params) {
        var $con = $("#" + container);
        $("#" + params.textboxId).val($("#" + $dis.prop("id")).children("td[name='code']").html());

        //    if (pageoption.container == "divdialogCustomer") {
        //        $("#" + containerpage).find("#CustomertxtSearch").val($con.find("#" + $dis.prop("id")).children("td[name='code']").html());
        //        $("#" + containerpage).find("#CustomerIntroducerCode").val($con.find("#" + $dis.prop("id")).children("td[name='code']").html());
        $con.dialog('close');
        //    else {
        //        createSubTab($dis, pageoption.container);
        //        onRowClick($dis);
        //    }
    }

    function ClickCustomerList($dis, container, code, id) {
        var $con = $("#" + container);
        if (code != undefined)
            $("#" + textin).val(code);
        else
            $("#" + textin).val($("#" + $dis.prop("id")).children("td[name='code']").html());
        if (id != undefined)
            createSubTab({ name: "a_CustomerList", id: id, row: $dis });
        else {
            createSubTab({ name: "a_CustomerList", row: $dis });
        }
        onRowClick($dis);
    }

    function RemoveCustomerElement(personid, container) {
        var $con = $("#" + container);
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: "{personid: '" + personid + "'}",
            type: "Post",
            url: "Management/DeleteCustomer",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (!response.isdone) {
                    alert(response.msg);
                    return;
                }
                else if (response.isdone)
                    $("#tr" + personid).remove();
                //                getCustomerList({ container: container });
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function getCustomer(customerid, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/GetCustomerById",
            contentType: "application/json; charset=utf-8",
            data: "{customerid: '" + customerid + "' }",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var Customer = (typeof response) == 'string' ? eval('(' + response + ')') : response;
                var cusval = Customer[0];
                var $con = $("#" + container);
                $con.find("#CustomerCodeEdit").val(cusval.Code)
                $con.find("#CustomerNameEdit").val(cusval.Name)
                $con.find("#CustomerFamilyEdit").val(cusval.Family);
                $con.find("#CustomerAgeEdit").val(cusval.Age == 0 ? "" : cusval.Age);
                $con.find("#CustomerIntroducerCodeEdit").val(cusval.IntroducerCode);
                $con.find("#CustomerJobEdit select").val("" + cusval.Job + "");
                $con.find("#ddl_m_Gender").val("" + cusval.Gender + "");

            },
            error: function (response) { alert(response.responseText); }
        });

    }

    function evente(id, container) {
        var $con = $("#" + container);
        if ($con.find("#SearchBy").val() == "IntroducerName") {
            $con.find("#a_CustomertxtSearch").addClass("searchText");
        }
        else
            $con.find("#a_CustomertxtSearch").removeClass("searchText");
    }

    function getCustomerAddress(customerid, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/GetAddressById",
            contentType: "application/json; charset=utf-8",
            data: "{customerid: '" + customerid + "' }",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var Customer = (typeof response) == 'string' ? eval('(' + response + ')') : response;
                var cusval = Customer[0];
                // DataBindForHierarchy("divCustomerAddressEdit", cusval.AddressId, "address", "0", 20, container);
                //bindHierarchyData({ id: "hr_s_Category", table: "category", container: container, styleclass: "PagingSelect" });
                bindHierarchyData({ id: "divCustomerAddressEdit", table: "address", container: container, parentid: cusval.AddressId });
                $con.find("#CustomerFullAddressEdit").val(cusval.Address)

            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function EditAddressCustomer(customerid, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/EditAddressCustomer",
            contentType: "application/json; charset=utf-8",
            data: "{personid: '" + customerid + "',addressid: '" + getHierarchySelectedValue("divCustomerAddressEdit", container) + "',address: '" + $con.find("#CustomerFullAddressEdit").val() + "' }",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
                loadCustomerAddressEdit(customerid, container);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function getCustomerPhone(customerid, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/GetPhoneById",
            contentType: "application/json; charset=utf-8",
            data: "{personid: '" + customerid + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                jq = response;
                var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
                var ItemList = "";
                for (var i = 0; i < List.length; i++) {
                    var val = List[0, i];
                    ItemList += "<tr id='tr" + val.PhoneId + "'>" +
                "<td width='40%' name='number'>" + val.Number + "</td>" +
                "<td width='40%' name='cell'>" + (val.Cell == true ? 'موبایل' : 'تـلفن') + "</td>" +
                "<td width='20%' id='delete'><button id='a_Button'>حذف</button></td></tr>";
                    // <div class='modalClose modalRemove'><a href='javascript:RemoveCustomerPhone(" + val.PhoneId + ",\"" + customerid + "\",\"" + container + "\");'/></div>
                }
                $con.find("#CustomerPhoneList").html(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
                $con.find("[id=a_Button]").button({
                    icons: {
                        primary: "ui-icon-closethick"
                    },
                    text: false
                }).click(function () {
                    if (confirm("آیا از حذف مطمئن هستید؟"))
                        RemoveCustomerPhone($(this).parents("tr").prop("id").replace("tr", ""), customerid, container);
                    else
                        return;
                });
                // $con.find("#CustomerPhoneList").parent().tableScroll({ height: 380 });
                //    TableAlter(container);
                $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
                    ClickCustomerPhone($(this).parent("tr"), customerid, container);
                }).addClass("cursor");
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function ClickCustomerPhone($dis, customerid, container) {
        var $con = $("#" + container);
        $con.find("#text_CustomerNumber").val($con.find("#" + $dis.prop("id")).children("td[name='number']").html());
        //$con.find("input[name='radio_CustomerPhone'][value='" + (con.find("#" + dis.id).children("td[name='cell']").html() == "تـلفن" ? false : true)  + "']").prop('checked', 'checked').trigger('click');
        $con.find("#ddl_m_CellType").val($con.find("#" + $dis.prop("id")).children("td[name='cell']").html() == "تـلفن" ? "false" : "true");

        $con.find("#EditPhone").button().unbind('click').click(function () {
            EditPhoneCustomer($dis.prop("id").replace("tr", ""), customerid, container);
        });

    }

    function RemoveCustomerPhone(phoneid, customerid, container) {

        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: "{phoneid: '" + phoneid + "'}",
            type: "Post",
            url: "Management/DeleteCustomerPhone",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
                if (response.isDone)
                    getCustomerPhone(customerid, container);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function AddPhoneCustomer(customerid, container) {
        var $con = $("#" + container);
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: "{personid: '" + customerid + "',number: '" + $con.find("#text_CustomerNumber").val() + "',cell: '" + $con.find("#ddl_m_CellType").val() + "'}",
            type: "Post",
            url: "Management/AddCustomerPhone",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
                if (response.isDone)
                    getCustomerPhone(customerid, container);
            },
            error: function (response) { alert(response.responseText); }
        });
    }



    function EditPhoneCustomer(phoneid, customerid, container) {
        var $con = $("#" + container);
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: "{phoneid: '" + phoneid + "',personid: '" + customerid + "',number: '" + $con.find("#text_CustomerNumber").val() + "',cell: '" + $con.find("#ddl_m_CellType").val() + "'}",
            type: "Post",
            url: "Management/EditCustomerPhone",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                getCustomerPhone(customerid, container);
                $con.find("#text_CustomerNumber").val("");
                $con.find("#ddl_m_CellType").val("true");

                $con.find("#EditPhone").button().unbind('click').click(function () {
                    if (validateAll($("#" + container))) {
                        AddPhoneCustomer(customerid, container);
                    }
                });
                translate(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function opendialog(pageoption) {
        var $con = $("#" + pageoption.container);
        sortid = 'AccountId desc';
        $con.find("#PageSize").off().on('change', function () {
            sortid = 'AccountId';
            //        getCustomerList(pageoption);
            getCustomerList(pageoption.container, { container: pageoption.container, callbackmethod: getCustomerList, fname: "", page_index: 0,
                build: buildCustomerList, servicename: "Management", methodname: "GetCustomerList", print: false
            });
        });
        $con.find("#btn_searchCustomer").unbind().bind('click', function () { sortid = 'AccountId'; getCustomerList(pageoption); });
        //    getCustomerList(pageoption);
        getCustomerList(pageoption.container, { container: pageoption.container, callbackmethod: getCustomerList, fname: "", page_index: 0,
            build: buildCustomerList, servicename: "Management", methodname: "GetCustomerList", print: false
        });
    }


    function loadOnlineProfile(customerId, container, first) {
        var $con = $("#" + container);
        if (first) {
            $con.find("#hvCustomerId").val(customerId);
            GetOnlineProfile(customerId, container);
            bindRawDropDownData({ id: "divRestriction", container: container, path: "restriction", canmodify: true, istext: false, headertext: "انتخاب گروه ", css: "selectsmall " });
            $con.find("#btnEditProfile").button({
                icons: {
                    primary: "ui-icon-disk"
                }
            }).unbind().click(function () {
                if (validateAll($("#" + container)))
                    UpdateOnlineProfile(customerId, container);
            });

            getCustomerRestrictionList(container, { container: container, callbackmethod: getCustomerRestrictionList, fname: "", page_index: 0,
                build: buildCustomerRestrictionList, servicename: "Management", methodname: "GetCustomerRestrictionList", print: false, customerId: customerId
            });

            $con.find("#btnAddRestriction").button({
                icons: {
                    primary: "ui-icon-disk"
                }
            }).unbind().click(function () {
                if (validateAll($("#RestrictionList")))
                    AddCustomerRestriction(customerId, container);
            });

        }
    }


    function getCustomerRestrictionList(container, params) {
        var $con = $("#" + container);
        if (params.page_index > 0) {
            params.first = false;
        }
        var DTO = { customerId: params.customerId };
        params["DTO"] = DTO;
        pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
            first: true, isOrder: false
        });
    }

    function buildCustomerRestrictionList(jq, container) {
        var $con = $("#" + container.pagingContainer);
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "restriction", width: "80%" });


        var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
        var ItemList = "";
        if (List != null)
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                var trBody = {};
                if (!container.params.print)
                    trBody[0] = { trId: val.RestrictionId };
                trBody[1] = { name: "restriction", html: val.Restriction, width: "80%" };

                lstb.push(trBody);
            }
        var details = { deleteFunction: DeleteCustomerRestriction };
        table = { header: lsth, body: lstb, details: details, heigth: 300,
            container: container.pagingContainer, divName: "restrictionList", hasFooter: true
        };
        buildTable(table);
    }
    function DeleteCustomerRestriction(dis, container) {
        var $con = $("#" + container);
        var $dis = $("#tr" + dis);
        var DTO = { 'customerId': $con.find("#hvCustomerId").val(), 'restrictionId': dis };
        $.ajax({
            type: "POST",
            url: "Management/DeleteCustomerRestriction",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isDone == false) {
                    alert(response.msg);
                    return;
                }
                if (response != null && response.isDone == true)
                    $dis.remove();
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function AddCustomerRestriction(customerId, container) {
        var $con = $("#" + container);
        var DTO = { 'customerId': customerId, 'restrictionId': $con.find("#divRestriction option:selected").val() };
        $.ajax({
            type: "POST",
            url: "Management/AddCustomerRestriction",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isDone == false) {
                    alert(response.msg);
                    return;
                }
                if (response != null && response.isDone == true)
                    getCustomerRestrictionList(container, { container: container, callbackmethod: getCustomerRestrictionList, fname: "", page_index: 0,
                        build: buildCustomerRestrictionList, servicename: "Management", methodname: "GetCustomerRestrictionList", print: false, customerId: customerId
                    });
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function GetOnlineProfile(customerId, container) {
        var $con = $("#" + container);
        var DTO = { 'customerId': customerId };
        $.ajax({
            type: "POST",
            url: "Management/GetOnlineProfile",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isDone) {
                    $con.find("#txtEmail").val(response.email)
                    $con.find("#cbIsWholesaleBuyer").prop("checked", response.isWholesaleBuyer);
                    $con.find("#cbCanGetCredit").prop("checked", response.canGetCredit);
                    $con.find("#cbIsFriend").prop("checked", response.isFriend);
                }
                //            translate(response.alert);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }


    function UpdateOnlineProfile(customerId, container) {
        var $con = $("#" + container);
        var DTO = { 'customerId': customerId, 'email': $con.find("#txtEmail").val(), 'isWholesaleBuyer': $con.find("#cbIsWholesaleBuyer").prop("checked"), 'canGetCredit': $con.find("#cbCanGetCredit").prop("checked"), 'isFriend': $con.find("#cbIsFriend").prop("checked")
        };
        $.ajax({
            type: "POST",
            url: "Management/UpdateOnlineProfile",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    //--------------------js customer end-----------------------


    //---------------customer toolbar begin -----------------
    function loadCustomerFastOrder(container, first) {

        loadOrder(0, container, GetItemOrder, false, true, first, { isfastorder: true });
    }
    //--------------customer toolbal end-------------------

    //----------------currency begin--------------------------

    function loadCurrencyNameList(container, first) {
        var $con = $("#" + container);
        getCurrency(container);
        $con.find("#addCurrency").button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        }).unbind('click').click(function () {
            if (validateAll($("#" + container)))
                addCurrency(container);
        });
        $con.find("#editCurrency").button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        }).unbind('click').click(function () {
            if (validateAll($("#" + container))) {
                if ($con.find(".table tbody tr").length == 0)
                    alert('داده ای برای ویرایش وجود ندارد');
                else {
                    if (validateAll($(this))) editCurrency(container);
                }
            }
        });

        $con.find("#deleteCurrency").button({ icons: {
            primary: "ui-icon-closethick"
        },
            text: true
        }).unbind('click').click(function () {
            if (validateAll($("#" + container))) {
                if (($con.find(".table tbody tr").length) == 0) {
                    $con.find("#currency_Name").val('');
                    $con.find("#currency_Symbol").val('');
                    $con.find("#CurrencyID").val('');
                    alert('داده ای برای حذف وجود ندارد');
                }

                else deleteCurrency(container);
            }
        });
    }

    function loadCurrencyList(container, first) {
        sortid = "CurrencyRateId desc";
        var $con = $("#" + container);
        //getCurrencyForSelect("currencyNameAdd", container);
        bindItemsForSelectCombo({ servicename: "Management", methodname: "CurrensyList", headertext: "انتخاب ارز", id: "currencyNameAdd", container: container });
        bindItemsForSelectCombo({ servicename: "Management", methodname: "CurrensyList", headertext: "انتخاب ارز", id: "search_select", container: container });
        if (first) {
            $con.find('#moreFilter').slideUp('fast');
            $con.find('.toggle-more-filters').click(function () {
                $(this).toggleClass("open")
                $con.find("#divBasic").toggleClass("hidden")
                $con.find('#moreFilter').removeClass('invisible');
                $con.find('#moreFilter').slideToggle(function () {
                    // Animation complete.
                    //                if ($con.find('#moreFilter').is(":visible"))
                    //                    $con.find("#simpleSearch").addClass("invisible");
                    //                else
                    //                    $con.find("#simpleSearch").removeClass("invisible");
                });

            });
            $con.find("#datefrom").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#dateto').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#dateto").datepicker({ changeMonth: true, changeYear: true });
            $con.find("#rate_date").datepicker({ changeMonth: true, changeYear: true, onClose: function () { validateAll($("#" + container)) } });
            //        getCurrencyRate(container);
            getCurrencyRate(container, { container: container, callbackmethod: getCurrencyRate, fname: "", page_index: 0,
                build: buildCurrencyRateList, servicename: "Management", methodname: "GetCurrencyRate", print: false
            });
            $con.find("#addCurrencyRate").button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            }).unbind('click').click(function () {
                if ($con.find("#currencyNameAdd").val() == "") {
                    alert("نام ارز را انتخاب کنید.");
                    return;
                }
                if (validateAll($("#" + container)))
                    addCurrencyRate(container);
            });
            $con.find("#editCurrencyRate").button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            }).unbind('click').click(function () {
                if ($con.find("#currencyNameAdd").val() == "") {
                    alert("نام ارز را انتخاب کنید.");
                    return;
                }
                if (validateAll($("#" + container)))
                    editCurrencyRate(container);
            });
            $con.find("#deleteCurrencyRate").button({ icons: {
                primary: "ui-icon-closethick"
            },
                text: true
            }).unbind('click').click(function () {
                //            if (validateAll($("#" + container)))
                deleteCurrencyRate(container);
            });
            $con.find("#Reset").click(function () {
                $con.find("#currencyNameAdd").val(0);
                //  $("input[name='currencyNameAdd'][value='0']").trigger('click');
                $con.find("#rate_date").val("");
                $con.find("#text_buyrate").val("");
                $con.find("#text_sellrate").val("");
            }).button({ icons: {
                primary: "ui-icon-plus"
            },
                text: true
            });
            $con.find("#divslider").unbind('click').click(function () { sliderClick("moreFilter"); sliderClick("ul_add"); });
            //        $con.find("#PageSize").off().on('change', function () { getCurrencyRate(container); });
            $con.find("#Button_advanceSearch").button().click(function () {
                //            getCurrencyRate(container);
                getCurrencyRate(container, { container: container, callbackmethod: getCurrencyRate, fname: "", page_index: 0,
                    build: buildCurrencyRateList, servicename: "Management", methodname: "GetCurrencyRate", print: false
                });
            });
            $con.find("#Button_search").button({ icons: {
                primary: "ui-icon-search"
            },
                text: true
            }).click(function () {
                getCurrencyRate(container, { container: container, callbackmethod: getCurrencyRate, fname: "", page_index: 0,
                    build: buildCurrencyRateList, servicename: "Management", methodname: "GetCurrencyRate", print: false
                });
                //            getCurrencyRate(container);
            });

        }
    }

    function deleteCurrency(container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/DeleteCurrency",
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + $con.find("#CurrencyID").val() + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response);
                getCurrency(container);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function addCurrency(container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/AddCurrency",
            contentType: "application/json; charset=utf-8",
            data: "{name: '" + $con.find("#currency_Name").val() + "', symbol: '" + $con.find("#currency_Symbol").val() + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response);
                getCurrency(container);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }


    function editCurrency(container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/EditCurrency",

            contentType: "application/json; charset=utf-8",
            data: "{id: '" + $con.find("#CurrencyID").val() + "', name: '" + $con.find("#currency_Name").val() + "', symbol: '" +
         $con.find("#currency_Symbol").val() + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response);
                getCurrency(container);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function setIndexCurrency(currencyId, container) {
        $.ajax({
            type: "POST",
            url: "Management/setIndexCurrency",
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + currencyId + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                getCurrency(container);
                translate(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function ClickCurrency($dis, container) {
        var $con = $("#" + container);
        $con.find("#currency_Name").val($("#" + $dis.prop("id") + " td[name=currency]").html());
        $con.find("#currency_Symbol").val($("#" + $dis.prop("id") + " td[name=symbol]").html());
        $con.find("#CurrencyID").val($dis.prop("id").toString().replace('tr', ''));
    }

    function getCurrency(container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/CurrensyList",
            contentType: "application/json; charset=utf-8",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var Currency = (typeof response) == 'string' ? eval('(' + response + ')') : response;
                var CurrencyItems = "";
                for (var j = 0; j < Currency.length; j++) {
                    var val = Currency[0, j];
                    CurrencyItems += "<tr id='tr" + val.id + "'><td  width='40%' name='currency'>" + val.name +
                 "</td><td width='30%' name='symbol'>" + val.symbol + "</td>" + "<td width='30%' name='symbol'><input value=' ' name='isIndex' currencyId='" + val.id + "' type='checkbox'  " + (val.isIndex ? "checked" : "") + "/></td>"
                    "</tr>";
                }
                $con.find("#currencylist").html(CurrencyItems).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
                $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
                    ClickCurrency($(this).parent("tr"), container)
                }).addClass("cursor");

                $con.find("[name='isIndex']").click(function () {

                    setIndexCurrency($(this).attr("currencyId"), container);
                });
                // $con.find("#currencylist").parent().tableScroll({ height: 380 });
                //  TableAlter(container);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function buildCurrencyRateList(jq, params) {
        var $con = $("#" + params.pagingContainer);
        jq = jq.results;
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "name", sort: "ac_Currency.CurrencyId", width: "24%" });
        lsth.push({ title: "date", sort: "Date", width: "30%" });
        lsth.push({ title: "buyPrice", sort: "Buy", width: "21%" });
        lsth.push({ title: "sellPrice", sort: "Sell", width: "21%" });
        lsth.push({ title: "deleteKey", width: "4%" });
        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            trBody[0] = { trId: val.CurrencyRateId };
            trBody[1] = { props: { currencyId: val.CurrencyId, name: "name", id: val.CurrencyId, width: "24%" }, html: val.Currency + " " + val.Symbol };
            trBody[2] = { html: val.Date, props: { name: "date", persianDate: val.date.split(" ")[1], date: val.Date, width: "30%", klass: "dateLong"} };
            trBody[3] = { props: { name: "buyPrice", buy: val.Buy, width: "21%" }, name: "buyPrice", html: val.Buy };
            trBody[4] = { props: { name: "sellPrice", sell: val.Sell, width: "21%" }, name: "sellPrice", html: val.Sell };
            lstb.push(trBody);
        }
        table = { header: lsth, body: lstb, details: { rowClick: ClickCurrencyRate, deleteFunction: deleteCurrencyRate }, heigth: 300,
            container: params.pagingContainer, divName: "currencyRateList", rowClickParams: { textboxId: "CustomerIntroducerCode" }
        };
        buildTable(table);

    }

    function getCurrencyRate(container, params) {
        var $con = $("#" + container);
        var first = true;
        var take = $con.find("#PageSize").val();
        var skip = 0;
        var page_index = 0
        var curid;
        var DTO = [];
        var advance = (($con.find("#moreFilter:visible").length > 0) ? true : false);
        if (advance) {
            DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'datefrom': $con.find("#datefrom").val(), 'dateto': $con.find('#dateto').val(), 'buyratefrom': $con.find("#buyfrom").val(), 'buyrateto': $con.find('#buyto').val(), 'sellratefrom': $con.find("#sellfrom").val(), 'sellrateto': $con.find('#sellto').val(), 'currencyid': $con.find("#search_select").val(), 'first': first, 'sort': sortid, 'advance': advance };
        }
        else {
            $con.find("#datefrom").val("");
            $con.find("#dateto").val("");
            $con.find("#buyfrom").val("");
            $con.find("#buyto").val("");
            $con.find("#sellfrom").val("");
            $con.find("#sellto").val("");
            DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'datefrom': $con.find("#rate_date").val(), 'dateto': $con.find('#dateto').val(), 'buyratefrom': $con.find("#text_buyrate").val(), 'buyrateto': $con.find('#buyto').val(), 'sellratefrom': $con.find("#text_sellrate").val(), 'sellrateto': $con.find('#sellto').val(), 'currencyid': $con.find("#currencyNameAdd").val(), 'first': first, 'sort': sortid, 'advance': advance };
        }
        params["DTO"] = DTO;
        pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
            first: true, isOrder: false
        });
    }

    function ClickCurrencyRate($dis, container) {
        var $con = $("#" + container);
        $con.find("#text_buyrate").val($dis.find("td[name=buyPrice]").attr("buy"));
        $con.find("#text_sellrate").val($dis.find("td[name=sellPrice]").attr("sell"));
        $con.find("#rate_date").val($dis.find("td[name=date]").attr("persianDate"));
        $con.find("#currencyNameAdd").val($dis.find("td[name='name']").attr("currencyId"));
        $con.find("#currencyid").val($dis.prop("id").replace('tr', ''));
        var advance = (($con.find("#moreFilter:visible").length > 0) ? true : false);
        if (advance) {
            sliderClick("moreFilter"); sliderClick("ul_add");
        }
        onRowClick($dis);
    }



    function getCurrencyForSelect(id, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/CurrensyList",
            contentType: "application/json; charset=utf-8",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var Currency = (typeof response) == 'string' ? eval('(' + response + ')') : response;
                var CurrencyItems = " <li> <a  href='javascript:void(0);' ><input type='radio' name='" + id + "' class='offright' value='0'/><span> -</span></a></li>";

                for (var j = 0; j < Currency.length; j++) {
                    var val = Currency[0, j];
                    CurrencyItems += " <li>" +
                                " <a  href='javascript:void(0);' ><input type='radio' name='" + id + "' class='offright' value='" + val['CurrencyId'] + "'/><span>" +
                                val['Currency'] + "</span></a>" +
					"</li>";
                }
                $con.find("#" + id).find("div.selectChildCont > ul").html(CurrencyItems);
                $con.find("#search_select").find("div.selectChildCont > ul").html(CurrencyItems);
                ChangeNameOfComboBox("search_select", id);
            },
            error: function (response) { alert(response.responseText); }
        });
    }



    function addCurrencyRate(container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/AddCurrencyRate",
            contentType: "application/json; charset=utf-8", //int idcurrency, decimal buy, decimal sell, string date
            data: "{idcurrency: '" + $con.find('#currencyNameAdd').val() + "', buy: '"
        + $con.find("#text_buyrate").val() + "', sell: '" + $con.find("#text_sellrate").val() + "', date: '" + $con.find("#rate_date").val() + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                $con.find("#currencyNameAdd").val(0);
                //  $("input[name='currencyNameAdd'][value='0']").trigger('click');
                $con.find("#rate_date").val("");
                $con.find("#text_buyrate").val("");
                $con.find("#text_sellrate").val("");
                getCurrencyRate(container, { container: container, callbackmethod: getCurrencyRate, fname: "", page_index: 0,
                    build: buildCurrencyRateList, servicename: "Management", methodname: "GetCurrencyRate", print: false
                });
                //            getCurrencyRate(container);
                translate(response);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }



    function editCurrencyRate(container) {
        var $con = $("#" + container);
        var DTO = { "id": $con.find("#currencyid").val(), "currencyid": $con.find('#currencyNameAdd').val(),
            "buy": $con.find("#text_buyrate").val(), "sell": $con.find("#text_sellrate").val(),
            "date": $con.find("#rate_date").val()
        };
        $.ajax({
            type: "POST",
            url: "Management/EditCurrencyRate",
            contentType: "application/json; charset=utf-8", //int idcurrency, decimal buy, decimal sell, string date
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response);
                $con.find("currencyNameAdd").val(0);
                // $("input[name='currencyNameAdd'][value='0']").trigger('click');
                $con.find("#rate_date").val("");
                $con.find("#text_buyrate").val("");
                $con.find("#text_sellrate").val("");
                //            getCurrencyRate(container);
                getCurrencyRate(container, { container: container, callbackmethod: getCurrencyRate, fname: "", page_index: 0,
                    build: buildCurrencyRateList, servicename: "Management", methodname: "GetCurrencyRate", print: false
                });
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function deleteCurrencyRate(id, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/DeleteCurrencyRate",
            contentType: "application/json; charset=utf-8", //int idcurrency, decimal buy, decimal sell, string date
            data: "{id: '" + id + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response);
                $con.find("#currencyNameAdd").val(0);
                //    $("input[name='currencyNameAdd'][value='0']").trigger('click');
                $con.find("#rate_date").val("");
                $con.find("#text_buyrate").val("");
                $con.find("#text_sellrate").val("");
                //            getCurrencyRate(container);
                getCurrencyRate(container, { container: container, callbackmethod: getCurrencyRate, fname: "", page_index: 0,
                    build: buildCurrencyRateList, servicename: "Management", methodname: "GetCurrencyRate", print: false
                });
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    //--------------------js currency end-----------------------

    //-----------------payment begin--------------------------

    function loadSupplierPayment(Supplierid, container, first) {
        if (first) {
            var $con = $("#" + container);

            $con.find("#div_customer").addClass("invisible");
            $con.find("#txt_payer").removeClass("required");
            $con.find("#ddl_CounterTo").addClass("invisible");
            $con.find("#lbl_CounterTo").addClass("hidden");
            $con.find("#lbl_payer").addClass("hidden");
            ChangeCheckBoxGroupName("radio", container);
            setRadioValue("radio" + container, "true", container);
            $con.find("#radio" + container).buttonset();
            $con.find("#btn_Cash").off().on('click', function () {
                GetItemCash(container);
            }).button({ icons: {
                primary: "ui-icon-plus"
            },
                text: true
            });
            $con.find("#btn_Cheque").off().on('click', function () {
                if (first) {
                    $con.find("#divslider2").removeClass("invisible");
                    $con.find("#table_cheque").removeClass("invisible");
                }
                GetItemCheque(container);
            }).button({ icons: {
                primary: "ui-icon-plus"
            },
                text: true
            });

            $con.find("#btn_Add_Payment").off().on('click', function () {
                if (validateAll($con) && $con.find("#txt_SumPeyment").val() != "0")
                    AddPayment(Supplierid, container);
            }).button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            });

            $con.find("#btnPrint").die().live('click', function () {
                PrintPaymentDetails(container, $con.find("#hi_paymentId").val());
            }).button({ icons: {
                primary: "ui-icon-print"
            },
                text: true
            });
            GetItemCash(container);
        }
    }
    function loadPayment(container, first) {
        var $con = $("#" + container);
        if ($("#txt_customer").val() != "")
            $con.find("#txt_payer").val($("#txt_customer").val());
        $con.find("#div_counterTo").addClass("invisible");
        //    $con.find("#ddl_CounterTo").addClass("invisible");
        //    $con.find("#lbl_CounterTo").addClass("hidden");
        aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "Management", id: "txt_payer", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_payer", fname: customerOnSelect });
        loadCustomerPayment(null, container, first);

    }

    function loadCounterPayment(container, first) {
        var $con = $("#" + container);
        $con.find("#voucherDiv").addClass("invisible");
        $con.find("#div_customer").addClass("invisible");
        $con.find("#txt_payer").removeClass("required");
        //    $con.find("#lbl_payer").addClass("hidden");
        //    $con.find("#txt_payer").addClass("invisible");
        $con.find("#div_counterTo").addClass("invisible");
        //    $con.find("#ddl_CounterTo").addClass("invisible");
        //    $con.find("#lbl_CounterTo").addClass("hidden");
        $con.find("#div_voucherTxt").addClass("hidden");
        $con.find("#spanVoucher").addClass("invisible");
        loadCustomerPayment(null, container, first);
    }

    function loadTransferMoney(container, first) {
        var $con = $("#" + container);
        $con.find("#radio").addClass("invisible");
        $con.find("#voucherDiv").addClass("invisible");
        $con.find("#div_customer").addClass("invisible");
        $con.find("#txt_payer").removeClass("required");
        $con.find("#div_voucherTxt").addClass("hidden");
        $con.find("#spanVoucher").addClass("invisible");
        //    $con.find("#lbl_payer").addClass("hidden");
        //    $con.find("#txt_payer").addClass("invisible");
        bindItemsForSelectCombo({ methodname: "getCounterName", servicename: "Management", headertext: "انتخاب صندوق", id: "ddl_CounterTo", container: container });
        loadCustomerPayment(null, container, first);
    }

    function loadCustomerPayment(Supplierid, container, first) {
        sortid = "OrderHeaderId desc";
        var $con = $("#" + container);
        if (first) {
            //        $con.find("#txt_s_Date").attr("id", "txt_s_Date" + container);
            //        $con.find("#txt_s_Date" + container).datepicker({ changeMonth: true, changeYear: true });
            //        $con.find("#txt_s_Date" + container).datepicker('setDate', new Date());
            if (Supplierid != null) {
                $con.find("#div_counterTo").addClass("invisible");
                $con.find("#div_customer").addClass("invisible");
                $con.find("#txt_payer").removeClass("required");
            }
            ChangeCheckBoxGroupName("radio", container);
            $con.find("#hd_d_PersonId").val(Supplierid);
            setRadioValue("radio" + container, "false", container);
            $con.find("#radio" + container).buttonset();
            $("#dialog" + container).remove();
            $con.find("#dialog").attr("id", "dialog" + container);
            $con.find("#btn_Cash").off().on('click', function () {
                GetItemCash(container);
                tableStyle();
            }).button({ icons: {
                primary: "ui-icon-plus"
            },
                text: true
            });
            $con.find("#btn_Cheque").off().on('click', function () {
                if (first) {
                    $con.find("#divslider2").removeClass("invisible");
                    $con.find("#table_cheque").removeClass("invisible");
                }
                GetItemCheque(container);
            }).button({ icons: {
                primary: "ui-icon-plus"
            },
                text: true
            });
            //Voucher
            $con.find("#txtVoucherNumber").bind('keydown', function (e) {
                if (e.keyCode == 13 || e.keyCode == 9) {
                    //Get Voucher Item
                    GetVoucherItem(first, container);
                }
            });
            $con.find("#btn_voucher").off().on('click', function () {
                sortid = "OrderHeaderId Desc";
                getCustomerVoucherList(container, { container: "dialog", callbackmethod: getCustomerVoucherList, fname: VoucherRowClick, page_index: 0, build: buildPayVoucherList, servicename: "Management", methodname: "getCustomerVoucherList" });
            });

            $con.find("#btn_Add_Payment").off().on('click', function () {
                //            if (validateAll($con) && $con.find("#txt_SumPeyment").val() != "0")
                if (validateAll($con))
                    AddPayment(Supplierid, container);
            }).button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            });

            $con.find("#btnPrint").die().live('click', function () {
                PrintPaymentDetails(container, $con.find("#hi_paymentId").val());
            }).button({ icons: {
                primary: "ui-icon-print"
            },
                text: true
            });
            //$con.find("#btn_Cash").trigger("click");
            localize();
        }
    }
    function AddPayment(Supplierid, container) {
        var $con = $("#" + container);
        if ($con.find("#txt_SumPeyment").val() == "0")
            return;
        var Cashes = [];
        var Cheques = [];
        var Voucher = [];

        if ($con.find("#ddl_CounterTo").val() == $("#userDefault").find("#ddl_m_Counter").val()) {
            alert("صندوق مبدا و مقصد یکسان است.");
            return;
        }
        $.each($("#" + container).find("tr[id*=Cash_]"), function () {
            var cash = {};
            cash["CurrencyId"] = $("#ddl_m_Currency_" + this.id).val();
            cash["Amount"] = $(this).find("#txt_m_Amount").val();
            cash["Type"] = getRadioSelectedValue("radioPayment" + this.id);
            Cashes.push(cash);
        });
        $.each($("#" + container).find("tr[id*=Cheque_]"), function () {
            var cheque = {};
            if ($(this).find("#ddl_m_Bank_" + this.id).val() == "" || $(this).find("#txt_m_Serial").val() == "" ||
             $(this).find("[name='txt_m_DueDate']").val() == "" || $(this).find("#txt_m_Amount").val() == "")
                return;
            cheque["Bank"] = $(this).find("#ddl_m_Bank_" + this.id).val();
            cheque["Serial"] = $(this).find("#txt_m_Serial").val();
            cheque["DueDate"] = $(this).find("[name='txt_m_DueDate']").val();
            cheque["CurrencyId"] = $("#ddl_m_Currency_" + this.id).val();
            cheque["Amount"] = $(this).find("#txt_m_Amount").val();
            Cheques.push(cheque);
        });
        $.each($("#" + container).find("tr[id*=voucher_]"), function () {
            //        var voucher = {};
            //        voucher["number"] = $(this).find("[name=voucherNumber]").html();
            Voucher.push($(this).find("[name=voucherNumber]").html());
        });
        var DTO = { 'cash': Cashes, 'cheque': Cheques, 'voucher': Voucher, 'supplierid': Supplierid, 'payerCode': $con.find("#txt_payer").val(),
            'counterid': $("#userDefault").find("#ddl_m_Counter").val(), 'pay': getRadioSelectedValue("radio" + container, container),
            'tocounterid': $con.find("#ddl_CounterTo").val(), 'description': $con.find("#txt_description").val(), 'date': $("#userDefault").find("#txt_s_Date").val()
        };

        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/AddPayment",
            success: function (response) {
                if (!isAuthenticated(response)) {
                    return;
                }
                if (response.isDone)
                    $con.find("#hi_paymentId").val(response.OrderHeaderId);
                translate(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function PrintPaymentDetails(container, paymentId) {
        var $con = $("#" + container);
        if ($con.find("#Div_Print").html().length < 10) {
            $con.find("#Div_Print").load("Report/PrintPayment.htm", function () {
                getPaymentPrint(container, paymentId);
            });
        }
        else
            getPaymentPrint(container, paymentId);
    }

    function getPaymentPrint(container, paymentId) {
        var $con = $("#" + container);
        var DTO = {
            'OrderHeaderId': paymentId
        };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/GetDetailPaymentList",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone) {
                    if (!response.pay) {
                        SetPaymentData(container, response);
                    }
                    else {
                        SetPaymentData(container, response);
                    }
                    Popup($con.find("#Div_Print").html());
                }
                else
                    alert("noData");

            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function SetPaymentData(container, response) {

        var $con = $("#" + container);
        var ItemList = "";
        var t = 0;

        $con.find("#lb_recieveFrom").html("&nbsp;" + response.recieveFrorm);
        $con.find("#lb_Description").html("&nbsp;" + response.description);
        $con.find("#lb_date").html("&nbsp;" + ToPersianDate(response.Date));
        $con.find("#lb_InvoiceNO").html("&nbsp;" + response.InvoiceNO);
        $("table#tbl_printPayment tr.newRows").each(function (i) {
            $(this).remove();
        });

        var firstRow = $con.find("#tr-first");
        if (response.dp.cheque.length == 0)
            firstRow.html("");
        else
            if (firstRow.html() == "") {
                var str = '<td colspan="2" valign="top" style="text-align: center;">' +
               ' ردیف' +
            '</td>' +
           ' <td colspan="2" valign="top" style="text-align: center;">' +
                'نوع سند' +
          '  </td>' +
            '<td colspan="2" valign="top" style="text-align: center;">' +
               ' سر رسید' +
            '</td>' +
            '<td colspan="2" valign="top" style="text-align: center;">' +
               ' شماره چک' +
           ' </td>' +
           ' <td colspan="2" valign="top" style="text-align: center;">' +
               ' مشخصات بانک' +
           ' </td>' +
            '<td colspan="12" valign="top" style="text-align: center;">' +
              '  مبلغ به تومان &nbsp;' +
           ' </td>';
                firstRow.html(str);
            }

        var money = 0;
        for (var i = 0; i < response.dp.cash.length; i++) {
            money += Math.abs(response.dp.cash[i].Amount);
        }
        var moneyPay = money.toString();
        $con.find("#lb_PaymentMoney").text(convertNumberToString(moneyPay));

        var Item =
        '<td colspan="10" valign="top" style="border-top:hidden;border-right:hidden;">مبلغ نقد :&nbsp;' +
               (convertNumberToString(moneyPay))
            + 'تومان</td>' +
            '<td valign="top" width="1%">' +
           (moneyPay.length > 0 ? (moneyPay.substring(moneyPay.length - 1, moneyPay.length)) : "&nbsp;")
            + '</td>' +
            '<td valign="top" width="1%">' +
           (moneyPay.length - 1 > 0 ? (moneyPay.substring(moneyPay.length - 2, moneyPay.length - 1)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%">' +
           (moneyPay.length - 2 > 0 ? (moneyPay.substring(moneyPay.length - 3, moneyPay.length - 2)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%">' +
           (moneyPay.length - 3 > 0 ? (moneyPay.substring(moneyPay.length - 4, moneyPay.length - 3)) : "&nbsp;")
            + '</td>' +
              '<td valign="top" width="1%">' +
           (moneyPay.length - 4 > 0 ? (moneyPay.substring(moneyPay.length - 5, moneyPay.length - 4)) : "&nbsp;")
            + '</td>' +
              '<td valign="top" width="1%">' +
           (moneyPay.length - 5 > 0 ? (moneyPay.substring(moneyPay.length - 6, moneyPay.length - 5)) : "&nbsp;")
            + '</td>' +
            '<td valign="top" width="1%">' +
           (moneyPay.length - 6 > 0 ? (moneyPay.substring(moneyPay.length - 7, moneyPay.length - 6)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%"> ' +
           (moneyPay.length - 7 > 0 ? (moneyPay.substring(moneyPay.length - 8, moneyPay.length - 7)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%">' +
           (moneyPay.length - 8 > 0 ? (moneyPay.substring(moneyPay.length - 9, moneyPay.length - 8)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%">' +
           (moneyPay.length - 9 > 0 ? (moneyPay.substring(moneyPay.length - 10, moneyPay.length - 9)) : "&nbsp;")
            + '</td>' +
           ' <td colspan="2" valign="top" width="1%">' +
           (moneyPay.length - 10 > 0 ? (moneyPay.substring(moneyPay.length - 11, moneyPay.length - 10)) : "&nbsp;")
           + ' </td>';
        $con.find("#tr_paymentMoney").html(Item);


        for (var i = 0; i < response.dp.cheque.length; i++) {
            var recAcc = response.dp.cheque[i];
            var m = Math.abs(recAcc.Amount).toString();
            t += Math.abs(recAcc.Amount);
            ItemList += '<tr class="newRows">' +
            '<td colspan="2" valign="top" width="4%">' +
               (i + 1)
           + '</td>' +
            '<td colspan="2" valign="top" width="5%">چک</td>' +
            '<td colspan="2" valign="top" width="7%">' +
               ToPersianDate(recAcc.Date)
            + '</td>' +
            '<td colspan="2" valign="top" width="7%">' +
                recAcc.Serial
            + '</td>' +
           ' <td colspan="2" valign="top" width="65%">' +
                recAcc.Bank
           + '</td>' +
            '<td valign="top" width="1%">' +
           (m.length > 0 ? (m.substring(m.length - 1, m.length)) : "&nbsp;")

            + '</td>' +
            '<td valign="top" width="1%">' +
           (m.length - 1 > 0 ? (m.substring(m.length - 2, m.length - 1)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%">' +
           (m.length - 2 > 0 ? (m.substring(m.length - 3, m.length - 2)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%">' +
           (m.length - 3 > 0 ? (m.substring(m.length - 4, m.length - 3)) : "&nbsp;")
            + '</td>' +
              '<td valign="top" width="1%">' +
           (m.length - 4 > 0 ? (m.substring(m.length - 5, m.length - 4)) : "&nbsp;")
            + '</td>' +
              '<td valign="top" width="1%">' +
           (m.length - 5 > 0 ? (m.substring(m.length - 6, m.length - 5)) : "&nbsp;")
            + '</td>' +
            '<td valign="top" width="1%">' +
           (m.length - 6 > 0 ? (m.substring(m.length - 7, m.length - 6)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%"> ' +
           (m.length - 7 > 0 ? (m.substring(m.length - 8, m.length - 7)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%">' +
           (m.length - 8 > 0 ? (m.substring(m.length - 9, m.length - 8)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%">' +
           (m.length - 9 > 0 ? (m.substring(m.length - 10, m.length - 9)) : "&nbsp;")
            + '</td>' +
           ' <td colspan="2" valign="top" width="1%">' +
           (m.length - 10 > 0 ? (m.substring(m.length - 11, m.length - 10)) : "&nbsp;")
           + ' </td>' +
        '</tr>';
        }

        var m = Math.abs(t).toString();
        ItemList += '<tr class="newRows">' +
        '<td colspan="10" valign="top" > جمع اسناد :&nbsp;' +
               (convertNumberToString(m))
            + 'تومان</td>' +
            '<td valign="top" width="1%">' +
           (m.length > 0 ? (m.substring(m.length - 1, m.length)) : "&nbsp;")
            + '</td>' +
            '<td valign="top" width="1%">' +
           (m.length - 1 > 0 ? (m.substring(m.length - 2, m.length - 1)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%">' +
           (m.length - 2 > 0 ? (m.substring(m.length - 3, m.length - 2)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%">' +
           (m.length - 3 > 0 ? (m.substring(m.length - 4, m.length - 3)) : "&nbsp;")
            + '</td>' +
              '<td valign="top" width="1%">' +
           (m.length - 4 > 0 ? (m.substring(m.length - 5, m.length - 4)) : "&nbsp;")
            + '</td>' +
              '<td valign="top" width="1%">' +
           (m.length - 5 > 0 ? (m.substring(m.length - 6, m.length - 5)) : "&nbsp;")
            + '</td>' +
            '<td valign="top" width="1%">' +
           (m.length - 6 > 0 ? (m.substring(m.length - 7, m.length - 6)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%"> ' +
           (m.length - 7 > 0 ? (m.substring(m.length - 8, m.length - 7)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%">' +
           (m.length - 8 > 0 ? (m.substring(m.length - 9, m.length - 8)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%">' +
           (m.length - 9 > 0 ? (m.substring(m.length - 10, m.length - 9)) : "&nbsp;")
            + '</td>' +
           ' <td colspan="2" valign="top" width="1%">' +
           (m.length - 10 > 0 ? (m.substring(m.length - 11, m.length - 10)) : "&nbsp;")
           + ' </td>' +
        '</tr>';

        m = (+t + +moneyPay).toString();
        ItemList += '<tr class="newRows">' +
        '<td colspan="10" valign="top" > مبلغ کل نقد و اسناد :&nbsp;' +
            (convertNumberToString(m))
            + 'تومان</td>' +
            '<td valign="top" width="1%">' +
           (m.length > 0 ? (m.substring(m.length - 1, m.length)) : "&nbsp;")
            + '</td>' +
            '<td valign="top" width="1%">' +
           (m.length - 1 > 0 ? (m.substring(m.length - 2, m.length - 1)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%">' +
           (m.length - 2 > 0 ? (m.substring(m.length - 3, m.length - 2)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%">' +
           (m.length - 3 > 0 ? (m.substring(m.length - 4, m.length - 3)) : "&nbsp;")
            + '</td>' +
              '<td valign="top" width="1%">' +
           (m.length - 4 > 0 ? (m.substring(m.length - 5, m.length - 4)) : "&nbsp;")
            + '</td>' +
              '<td valign="top" width="1%">' +
           (m.length - 5 > 0 ? (m.substring(m.length - 6, m.length - 5)) : "&nbsp;")
            + '</td>' +
            '<td valign="top" width="1%">' +
           (m.length - 6 > 0 ? (m.substring(m.length - 7, m.length - 6)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%"> ' +
           (m.length - 7 > 0 ? (m.substring(m.length - 8, m.length - 7)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%">' +
           (m.length - 8 > 0 ? (m.substring(m.length - 9, m.length - 8)) : "&nbsp;")
            + '</td>' +
             '<td valign="top" width="1%">' +
           (m.length - 9 > 0 ? (m.substring(m.length - 10, m.length - 9)) : "&nbsp;")
            + '</td>' +
           ' <td colspan="2" valign="top" width="1%">' +
           (m.length - 10 > 0 ? (m.substring(m.length - 11, m.length - 10)) : "&nbsp;")
           + ' </td>' +
        '</tr>';



        if (!response.pay) {
            $con.find("#lb_header").text("رسید وجه");
            $con.find("#lb_typeRecPay").text("دریافت از :");
            ItemList += '<tr class="newRows">' +
           ' <td style="border: medium hidden; text-align: center;" colspan="8" valign="top"  width="50%"><br/><br/>' +
              '  نام و امضای مدیر عامل' +
           ' </td>' +
           ' <td style="border: medium hidden; text-align: center;" colspan="14" valign="top"  width="50%"><br/><br/>' +
               ' نام و امضای دریافت کننده' +
           '   </td>' +
           ' </tr>';
        }
        else {
            $con.find("#lb_header").text("پرداخت وجه");
            $con.find("#lb_typeRecPay").text("پرداخت به :");
            ItemList += '<tr class="newRows">' +
           ' <td style="border: medium hidden; text-align: center;" colspan="8" valign="top"  width="50%"><br/><br/>' +
              ' نام و امضای پرداخت کننده چک' +
           ' </td>' +
           ' <td style="border: medium hidden; text-align: center;" colspan="14" valign="top"  width="50%"><br/><br/>' +
               ' نام و امضای دریافت کننده' +
           '   </td>' +
           ' </tr>';
        }
        firstRow.append(ItemList);

    }

    function setReciveData(container, response) {

    }

    function GetItemCash(container) {
        var $con = $("#" + container);
        var ItemList = "";
        var trid = "Cash_" + cout_tr + "_" + container;
        cout_tr += 1;
        ItemList += "<tr id= '" + trid + "'>" +
                "<td id='Currency'>" +
                " <select class='selectLarg' id='ddl_m_Currency_" + trid + "'></select>" +
                "</td>" +
                 "<td><input type='text' class=' inputText  ' id='txt_m_Amount' placeholder='amount' onchange='return SumPayment(\"" + container + "\");'/></td>" +
                "<td>" +
                "<div id='radioPayment" + trid + "'>" +
		        "<input type='radio' id='radio1" + trid + "' name='radioPayment" + trid + "' checked='checked' value='نقدی'/><label for='radio1" + trid + "'>cash</label>" +
		        "<input type='radio' id='radio2" + trid + "' name='radioPayment" + trid + "'  value='کارت' /><label for='radio2" + trid + "'>creditCard</label>" +
                "<input type='radio' id='radio3" + trid + "' name='radioPayment" + trid + "' value='حواله' /><label for='radio3" + trid + "'>remittance</label>" +
	            "</div></td>" +
                "<td id='delete'><button name='btn_Delete' >حذف</button></td></tr>";
        $con.find("#CashList").append(ItemList).parent().tableScroll({ height: 380, width: $con.width() - 130, flush: false });
        $con.find("[name=btn_Delete]").button({ icons: {
            primary: "ui-icon-closethick"
        },
            text: false
        }).unbind().click(function () {
            if (confirm("آیا از حذف مطمئن هستید؟"))
                RemoveItemCashElement($(this).parents("tr").attr("id"), container);
            else
                return;
        });
        localize();
        tableStyle();

        $("#" + trid).find("#radioPayment" + trid).buttonset();
        //  $con.find("#ddl_m_Currency_" + trid + " ul").html($("#userDefault").find("#ddl_m_Currency ul").html());
        //   $con.find("#ddl_m_Currency_" + trid + " ul li").first().remove();
        $con.find("#ddl_m_Currency_" + trid).html($("#userDefault").find("#ddl_m_Currency").html()).find('option:eq(1)').prop('selected', 'selected');
        //   ChangeNameOfComboBox("ddl_m_Currency_" + trid, "ddl_m_Currency", trid);
        //   bindDropDown("ddl_m_Currency_" + trid, trid);
        //  $con.find("#ddl_m_Currency_" + trid + " ul li a").first().trigger("click");
        // setRadioValue("ddl_m_Currency_" + trid, "1", trid);
        // $con.find("#CashList").parent().tableScroll({ height: 380 });
        // TableAlter(container);

    }
    function RemoveItemCashElement(trid, container) {
        var $con = $("#" + container);
        $con.find("#" + trid).remove();
        SumPayment(container);
    }

    function GetItemCheque(container) {
        var $con = $("#" + container);
        var ItemList = "";
        var trid = "Cheque_" + cout_tr + "_" + container;
        cout_tr += 1;
        ItemList += "<tr id= '" + trid + "'>" +
                "<td id='Currency'>" +
                " <select class='selectLarg' id='ddl_m_Currency_" + trid + "'></select>" +

                "</td>" +
                 "<td><input type='text'  class=' inputText  ' id='txt_m_Amount' placeholder='chequeAmount' onchange='return SumPayment(\"" + container + "\");'/></td>" +
                "<td><input type='text'  class=' inputText  ' id='txt_m_Serial' placeholder='chequeSerial' /></td>" +
                "<td id='Bank'>" +
                " <select class='selectLarg' id='ddl_m_Bank_" + trid + "'>" +
                "</select>" +
                "</td>" +
                 "<td><input type='text'  class=' inputText  id='" + cout_tr + "_txt_m_DueDate'  name='txt_m_DueDate' placeholder='chequeDate'/></td>" +
                "<td id='delete'><button name='btn_Delete' >حذف</button></td></tr>";
        $con.find("#ChequeList").append(ItemList).parent().tableScroll({ height: 380, width: $con.width() - 85, flush: false });
        $("[name='txt_m_DueDate']").datepicker({
            changeMonth: true,
            changeYear: true
        });
        localize();
        tableStyle();
        $con.find("[name=btn_Delete]").button({ icons: {
            primary: "ui-icon-closethick"
        },
            text: false
        }).unbind().click(function () {
            if (confirm("آیا از حذف مطمئن هستید؟"))
                RemoveItemCashElement($(this).parents("tr").attr("id"), container);
            else
                return;
        });

        if (getRadioSelectedValue("radio" + container, container) == "false") {

            bindItemsForSelectCombo({ methodname: "GetComboItems", servicename: "XmlDropDown", headertext: "انتخاب بانک", id: "ddl_m_Bank_" + trid, container: container }, { path: 'Counter/BankTitle' });
        }
        else
            bindItemsForSelectCombo({ data: { ParentName: "bankPaidDocument" }, methodname: "GetChildAccountNameWithParent", servicename: "Management", headertext: "انتخاب بانک", id: "ddl_m_Bank_" + trid, container: container });



        //  $con.find("#ddl_m_Currency_" + trid + " ul").html($("#userDefault").find("#ddl_m_Currency ul").html());
        //  $con.find("#ddl_m_Currency_" + trid + " ul li").first().remove();
        //   ChangeNameOfComboBox("ddl_m_Currency_" + trid, "ddl_m_Currency", trid);
        //   bindDropDown("ddl_m_Currency_" + trid, trid);
        //bindDropDown("ddl_m_Bank_" + trid, trid);
        //  $con.find("#ddl_m_Currency_" + trid + " ul li").first().find("input").prop("checked", "checked").trigger("click");
        $con.find("#ddl_m_Currency_" + trid).html($("#userDefault").find("#ddl_m_Currency").html()).find('option:eq(1)').prop('selected', 'selected');
        // bindItemsForSelectCombo({ methodname: "getCurrencyName", servicename: "Currency", headertext: "انتخاب ارز", id: "ddl_m_Currency_"+trid, container: container });
        // $con.find("#ChequeList").parent().tableScroll({ height: 380 });
        //  TableAlter(container);
    }
    function SumPayment(container) {
        var $con = $("#" + container);
        var sumprice = 0;
        $.each($con.find("tr[id*=Cheque_]"), function () {
            sumprice += $(this).find("#txt_m_Amount").val() * 1;
        });
        $con.find("#txt_m_SumCheque").val(sumprice);
        sumprice = 0;
        $.each($con.find("tr[id*=Cash_]"), function () {
            sumprice += $(this).find("#txt_m_Amount").val() * 1;
        });
        $con.find("#txt_m_SumCash").val(sumprice);
        sumprice = 0;
        $.each($con.find("tr[id*=voucher_]"), function () {
            sumprice += $(this).find("[name=voucherAmount]").html() * 1;
        })
        $con.find("#txt_m_SumVoucher").val(sumprice);

        $("#" + container).find("#txt_SumPeyment").val($("#" + container).find("#txt_m_SumCheque").val() * 1 + $("#" + container).find("#txt_m_SumCash").val() * 1 + $("#" + container).find("#txt_m_SumVoucher").val() * 1);
    }

    function getPaymentList(container) {
        var $con = $("#" + container);
        var first = true;
        var take = $con.find("#PageSize").val();
        var skip = 0;
        var page_index = 0
        var name = "", code = "", EmployeeId = "", EmployeeName = "", Counter = "", BankName = "", Serial = ""
        , invoiceDateStart = "", InvoiceDateEnd = "", paymentDateStart = "", paymentDateEnd = "", priceFrom = "", priceTo = "";
        if ($con.find("#moreFilter").is(":visible")) {
            var search = $con.find("#ddl_d_SearchBy1").val();
            if (search != "") {
                if (search == "Code") {
                    code = $con.find("#txtSearch1").val();
                } if (search == "Name") {

                    name = $con.find("#txtSearch1").val();
                } if (search == "EmployeeId") {

                    EmployeeId = $con.find("#txtSearch1").val();
                } if (search == "EmployeeName") {

                    EmployeeName = $con.find("#txtSearch1").val();
                }
                if (search == "Counter") {

                    Counter = $con.find("#txtSearch1").val();
                }
            }
            //----
            BankName = $con.find("#ddlBank").val();
            Serial = $con.find("#txtSerial").val();
            //----
            if ($con.find("#txt_s_InvoiceDateStart").length > 0)
                invoiceDateStart = $con.find("#txt_s_InvoiceDateStart").val();
            if ($con.find("#txt_s_InvoiceDateEnd").length > 0)
                InvoiceDateEnd = $con.find("#txt_s_InvoiceDateEnd").val();
            if ($con.find("#txt_s_PaymentDateStart").length > 0)
                paymentDateStart = $con.find("#txt_s_PaymentDateStart").val();
            if ($con.find("#txt_s_PaymentDateEnd").length > 0)
                paymentDateEnd = $con.find("#txt_s_PaymentDateEnd").val();
            if ($con.find("#txt_s_PriceFrom").length > 0)
                priceFrom = $con.find("#txt_s_PriceFrom").val();
            if ($con.find("#txt_s_PriceTo").length > 0)
                priceTo = $con.find("#txt_s_PriceTo").val();
        }
        var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
            'supplierid': $con.find("#hd_d_PersonId").val(), 'IsClient': $con.find("#hd_d_IsClient").val(),
            'SupplierName': name, 'code': code, 'EmployeeId': EmployeeId, 'EmployeeName': EmployeeName,
            'Counter': Counter, 'BankName': BankName, 'Serial': Serial, 'InvoiceDateStart': invoiceDateStart,
            'InvoiceDateEnd': InvoiceDateEnd, 'PaymentDateStart': paymentDateStart, 'PaymentDateEnd': paymentDateEnd,
            'PriceFrom': priceFrom, 'PriceTo': priceTo, 'pay': ($con.find("#Checkbox1" + container).length > 0 ?
        $con.find("#Checkbox1" + container).prop('checked') : ""), 'receive': ($con.find("#Checkbox2" + container).length > 0 ?
        $con.find("#Checkbox2" + container).prop('checked') : ""), 'cash': ($con.find("#Checkbox3" + container).length > 0 ?
        $con.find("#Checkbox3" + container).prop('checked') : ""), 'cheque': ($con.find("#Checkbox4" + container).length > 0 ?
        $con.find("#Checkbox4" + container).prop('checked') : ""), 'voucher': ($con.find("#Checkbox5" + container).length > 0 ?
        $con.find("#Checkbox5" + container).prop('checked') : ""), 'passed': ($con.find("#Checkbox6" + container).length > 0 ?
        $con.find("#Checkbox6" + container).prop('checked') : ""), 'notpass': ($con.find("#Checkbox7" + container).length > 0 ?
        $con.find("#Checkbox7" + container).prop('checked') : ""), 'shopid': $("#userDefault").find("#ddl_s_Branch").val(),
            'counterid': $("#userDefault").find("#ddl_m_Counter").val()
        };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/GetPaymentList",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var opt = PaymentgetOptionsFrom(response.count, container);
                $con.find("#paging").pagination(response.count, opt);
                PaymentpageselectCallback(0, response, container, first);
            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function PaymentgetOptionsFrom(count, container) {
        var $con = $("#" + container);
        var opt = { callback: PaymentpageselectCallback };
        $con.find("input:text").each(function () {
            opt[this.name] = this.className.match(/numeric/) ? parseInt(this.value) : this.value;
        });
        opt.prev_show_always = false;
        opt.next_show_always = false;
        if ((count) < $con.find("#PageSize").val())
            $con.find("#PageSize").css("display", "none");
        else {
            $con.find("#PageSize").css("display", "inline");
        }
        opt.items_per_page = $con.find("#PageSize").val();
        opt.prev_text = "قبلی";
        opt.next_text = "بعدی";
        opt.container = container;
        return opt;
    }
    function buildPaymentList(jq, container) {
        var $con = $("#" + container);
        jq = jq.results;
        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        if (List != null) {
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                ItemList += "<tr id='tr" + val.OrderHeaderId + "'>" +
                "<td width='15%' name='Clinet' id='" + val.ClientId + "'>" + val.ClientName + " " + val.ClientFamily + "</td> " +
                "<td width='15%' name='PaymentNO' >" + val.Name + " " + val.Family + "</td>" +
                "<td width='15%' name='Date' >" + val.Date + "</td>" +
                "<td width='15%' name='Pay'>" + (val.Sell == false ? "واریز" : "برداشت") + "</td>" +
                "<td width='15%' name='Code' >" + val.Code + "</td> " +
                "<td width='15%' name='Price'>" + val.Price + "</td> " +
                "<td width='10%'name='detail'><button id='a_Button' >جزئیات فاکتور</button></td>"
                //                "<td width='10%'name='detail'><a href='javascript:ListDetailPayment(\"" + val.OrderHeaderId + "\",\"" + container + "\");'>جزئیات برداشت</a></td>" +
                "</tr>";
            }
        }
        $con.find("#PaymentList").html(ItemList);
        $con.find("#PaymentList").parent().tableScroll({ height: 380, width: contentwidth, flush: false });
        $con.find("[id=a_Button]").button({
            icons: {
                primary: "ui-icon-plus"
            },
            text: false
        }).click(function () {
            ListDetailPayment($(this).parents("tr").prop("id").replace("tr", ""), container);
        });
        //  TableAlter(container);
        //    $con.find("tr[id*=tr]").find('td:not([name=detail])').click(function () {
        //        ClickPayment($(this).parent("tr"))
        //    }).addClass("cursor");

    }

    function PaymentpageselectCallback(page_index, jq, container, first) {
        var $con = $("#" + container);
        if (first) {
            buildPaymentList(jq, container);
        }
        else {
            first = false;
            var items_per_page = $con.find("#PageSize").val();
            var itemcontent = '';
            var take = items_per_page;
            var skip = page_index == 0 ? 0 : (page_index * take);
            var name = "", code = "", EmployeeId = "", EmployeeName = "", Counter = "", BankName = "", Serial = "";
            var search = $con.find("#ddl_d_SearchBy1").val();
            if (search != "") {
                if (search == "Code") {
                    code = $con.find("#txtSearch1").val();
                } if (search == "Name") {

                    name = $con.find("#txtSearch1").val();
                } if (search == "EmployeeId") {

                    EmployeeId = $con.find("#txtSearch1").val();
                } if (search == "EmployeeName") {

                    EmployeeName = $con.find("#txtSearch1").val();
                }
                if (search == "Counter") {

                    Counter = $con.find("#txtSearch1").val();
                }
            }
            var search = $con.find("#ddl_d_SearchBy2").val();
            if (search != "") {
                if (search == "BankName") {
                    BankName = $con.find("#txtSearch2").val();
                } if (search == "Serial") {

                    Serial = $con.find("#txtSearch2").val();
                }
            }

            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'supplierid': $con.find("#hd_d_PersonId").val(), 'IsClient': $con.find("#hd_d_IsClient").val(), 'SupplierName': name, 'code': code, 'EmployeeId': EmployeeId, 'EmployeeName': EmployeeName, 'Counter': Counter, 'BankName': BankName, 'Serial': Serial, 'InvoiceDateStart': ($con.find("#txt_s_InvoiceDateStart").length > 0 ? $con.find("#txt_s_InvoiceDateStart").val() : ""), 'InvoiceDateEnd': ($con.find("#txt_s_InvoiceDateEnd").length > 0 ? $con.find("#txt_s_InvoiceDateEnd").val() : ""), 'PaymentDateStart': ($con.find("#txt_s_PaymentDateStart").length > 0 ? $con.find("#txt_s_PaymentDateStart").val() : ""), 'PaymentDateEnd': ($con.find("#txt_s_PaymentDateEnd").length > 0 ? $con.find("#txt_s_PaymentDateEnd").val() : ""), 'PriceFrom': ($con.find("#txt_s_PriceFrom").length > 0 ? $con.find("#txt_s_PriceFrom").val() : ""), 'PriceTo': ($con.find("#txt_s_PriceTo").length > 0 ? $con.find("#txt_s_PriceTo").val() : ""), 'pay': ($con.find("#Checkbox1" + container).length > 0 ? $con.find("#Checkbox1" + container).prop('checked') : ""), 'receive': ($con.find("#Checkbox2" + container).length > 0 ? $con.find("#Checkbox2" + container).prop('checked') : ""), 'cash': ($con.find("#Checkbox3" + container).length > 0 ? $con.find("#Checkbox3" + container).prop('checked') : ""), 'cheque': ($con.find("#Checkbox4" + container).length > 0 ? $con.find("#Checkbox4" + container).prop('checked') : ""), 'voucher': ($con.find("#Checkbox5" + container).length > 0 ? $con.find("#Checkbox5" + container).prop('checked') : ""), 'passed': ($con.find("#Checkbox6" + container).length > 0 ? $con.find("#Checkbox6" + container).prop('checked') : ""), 'notpass': ($con.find("#Checkbox7" + container).length > 0 ? $con.find("#Checkbox7" + container).prop('checked') : ""), 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'counterid': $("#userDefault").find("#ddl_m_Counter").val() };
            $.ajax({
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(DTO),
                type: "Post",
                url: "Management/GetPaymentList",
                success: function (response) {
                    if (!isAuthenticated(response))
                        return;
                    buildPaymentList(response, container);
                },
                error: function (response) { alert(response.responseText); }
            });

            return false;
        }
        Sort(getPaymentList, container);
    }

    function ListDetailPayment(id, container) {
        var $con = $("#" + container);
        $("#DetailPaymentList").attr("id", "DetailPaymentList" + container);
        $DetailPaymentList = $("#DetailPaymentList" + container);
        var DTO = { 'OrderHeaderId': id };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/GetDetailPaymentList",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var List = (typeof response) == 'string' ? eval('(' + response + ')') : response;
                var ItemCash = "";
                if (List.dp) {
                    for (var i = 0; i < List.dp.cash.length; i++) {
                        var val = List.dp.cash[0, i];
                        ItemCash += "<tr id='tr" + val.AccountDetailId + "'>" +
                "<td width='50%' name='PaymentNO' >" + val.Amount + "  " + val.Currency + "</td>" +
                "<td width='40%'>" + val.Type + "</td>" +
                 "<td width='10%' id='delete'><button id='deleteCash'>حذف</button></td></tr>";
                        //"<div class='modalClose modalRemove'><a href='javascript:RemoveItemDetailCash(" + val.CashId + ");'/></div>";
                    };
                }
                $DetailPaymentList.find("#CashList").html(ItemCash).parent().tableScroll({ height: 380, width: 500, flush: false });
                if (ItemCash != "") {
                    $DetailPaymentList.find("#tablecash").removeClass("invisible");
                    $DetailPaymentList.find("[id=deleteCash]").button({
                        icons: {
                            primary: "ui-icon-closethick"
                        },
                        text: false
                    }).click(function () {
                        if (confirm("آیا از حذف مطمئن هستید؟"))
                            RemoveItemDetailCash($(this).parents("tr").prop("id").replace("tr", ""));
                        else
                            return;
                    });
                }
                else {
                    $DetailPaymentList.find("#tablecash").addClass("invisible");
                }
                ItemCheque = "";
                if (List.dp) {
                    for (var i = 0; i < List.dp.cheque.length; i++) {
                        var val = List.dp.cheque[0, i];
                        ItemCheque += "<tr id='tr" + val.AccountDetailId + "'>" +
                "<td name='PaymentNO' width='18%'>" + val.Amount + "  " + val.Currency + "</td>" +
                "<td  width='18%'>" + val.Bank + "</td>" +
                "<td  width='20%'><input style='width:100px; height:20px;' name='serial' value='" + val.Serial + "'/></td>" +
                "<td id='status'  width='15%'>" + (val.Passed == "پاس شده" ? val.Passed :
                                      ("<button id='btn_pass'>تایید</button>")) + "</td>" +
                "<td   width='15%'><input style='width:70px; height:20px;' name='date' value='" + ToPersianDateDigitYearRight(val.Date) + "'/></td>" +
                "<td id='delete' width='7%'><button id='deleteCheque'>delete</button></td><td width='7%'><button id='editCheque'>edit</button></td></tr>";
                        //<div class='modalClose modalRemove'><a href='javascript:RemoveItemDetailCheque(" + val.ChequeId + ");'/></div>";
                    }
                }
                $DetailPaymentList.find("#ChequeList").html(ItemCheque).parent().tableScroll({ height: 380, width: 600, flush: false });
                $DetailPaymentList.find("[name='date']").datepicker(); //.datepicker('setDate', new Date())
                if (ItemCheque != "") {
                    $DetailPaymentList.find("#tablecheque").removeClass("invisible");
                    $DetailPaymentList.find("[id=deleteCheque]").button({
                        icons: {
                            primary: "ui-icon-closethick"
                        },
                        text: false
                    }).click(function () {
                        if (confirm("آیا از حذف مطمئن هستید؟"))
                            RemoveItemDetailCheque($(this).parents("tr").prop("id").replace("tr", ""));
                        else
                            return;
                    });
                    $DetailPaymentList.find("[id=editCheque]").button({
                        icons: {
                            primary: "ui-icon-pencil"
                        },
                        text: false
                    }).click(function () {
                        editItemDetailCheque($(this).parents("tr").prop("id").replace("tr", ""), $(this).parents("tr").find("[name='date']").val(), $(this).parents("tr").find("[name='serial']").val());
                    });
                    $DetailPaymentList.find("[id=btn_pass]").button({
                        text: true
                    }).click(function () {
                        ChequePassed($(this).parents("tr").prop("id").replace("tr", ""), this);
                    });
                }
                else {
                    $DetailPaymentList.find("#tablecheque").addClass("invisible");
                }
                //    $con.find("#ChequeList").parent().tableScroll({ height: 380 });
                //  TableAlter(container);
                //$("#VoucherDetailList, #transferMoney, #DetailPaymentList, #dialog").dialog("close");
                $DetailPaymentList.dialog('open').dialog({ width: 650 });
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function ChequePassed(chequeId, dis) {
        $.ajax({
            type: "POST",
            data: "{id: '" + chequeId + "',counterId: '" + $("#userDefault").find("#ddl_m_Counter").val() + "'}",
            url: "Management/ChequePassed",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone)
                    $(dis).parents("td").html("پاس شده");
                else
                    translate(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function RemoveItemDetailCash(id) {
        var $con = $("#tr" + id);
        $.ajax({
            type: "POST",
            url: "Management/DeleteCash",
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + id + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
                if (response.isDone)
                    $con.remove();

            },

            error: function (response) { alert(response.responseText); }
        });
    }

    function RemoveItemDetailCheque(id) {
        var $con = $("#tr" + id);
        $.ajax({
            type: "POST",
            url: "Management/DeleteCheque",
            contentType: "application/json; charset=utf-8",
            data: "{accDetailId: '" + id + "',isRecieved: '" + true + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
                if (response.isDone)
                    $con.remove();
            },

            error: function (response) { alert(response.responseText); }
        });
    }


    function editItemDetailCheque(id, date, serial) {
        var $con = $("#tr" + id);
        var DTO = { 'id': id, 'date': date, 'serial': serial };
        $.ajax({
            type: "POST",
            url: "Management/EditCheque",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
                //            if (response.isDone)
                //               
            },

            error: function (response) { alert(response.responseText); }
        });
    }
    //--------------------js payment end-----------------------



    //--------------------voucher begin----------------------
    function loadVoucherList(container, first) {
        sortid = 'OrderHeaderId desc';
        var $con = $("#" + container);
        if (first) {
            //slide
            $con.find('#moreFilter').slideUp('fast');
            $con.find('.toggle-more-filters').click(function () {
                $(this).toggleClass("open")
                $con.find('#moreFilter').slideToggle(function () {
                });
            });
            //Validation Date
            $con.find("#VoucherFromValidationDate").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#VoucherToValidationDate').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#VoucherToValidationDate").datepicker({ changeMonth: true, changeYear: true });
            //Register Date
            $con.find("#VoucherRegDateFrom").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#VoucherRegDateTo').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#VoucherRegDateTo").datepicker({ changeMonth: true, changeYear: true });
            //
            //Pay Date
            $con.find("#VoucherPayDateFrom").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#VoucherPayDateTo').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#VoucherPayDateTo").datepicker({ changeMonth: true, changeYear: true });
            //Search Button
            $con.find("#btnSearchVoucher").button({ icons: {
                primary: "ui-icon-search"
            }
            }).unbind('click').click(function () {
                sortid = "OrderHeaderId desc";
                getVoucherList(container, { container: container, callbackmethod: getVoucherList, fname: "", page_index: 0,
                    build: buildVoucherList, servicename: "Management", methodname: "GetVoucherList", print: false
                });
            });
            //Page size change
            $con.find("#PageSize").off().on('change', function () {
                getVoucherList(container, { container: container, callbackmethod: getVoucherList, fname: "", page_index: 0,
                    build: buildVoucherList, servicename: "Management", methodname: "GetVoucherList", print: false
                });
            });
            //Show Voucher List
            getVoucherList(container, { container: container, callbackmethod: getVoucherList, fname: "", page_index: 0,
                build: buildVoucherList, servicename: "Management", methodname: "GetVoucherList", print: false
            });
            //Show Voucher Details


        }
        $con.find("#voucherDetailsDialog").attr("id", "dialog" + container);
        $con.find("#dialog" + container).dialog({ autoOpen: false }).dialog({ width: 800 });
    }

    function getVoucherList(container, params) {
        var $con = $("#" + container);
        if (params.page_index > 0) {
            params.first = false;
        }
        var registerer = "", customer = "", number = "", payer = "", VoucherRegDateFrom = "", VoucherRegDateTo = "",
        VoucherPayDateFrom = "", VoucherPayDateTo = "", VoucherBuyAmountFrom = "",
        VoucherBuyAmountTo = "", VoucherAmountFrom = "", VoucherAmountTo = "";
        //simple searchBy
        var search = $con.find("#SearchBy").val();
        if (search != "") {
            if (search == "registerer") {
                registerer = $con.find("#voucherTxtSearch").val();
            }
            if (search == "customer") {

                customer = $con.find("#voucherTxtSearch").val();
            }
            if (search == "number") {

                number = $con.find("#voucherTxtSearch").val();
            }
            if (search == "payer") {

                payer = $con.find("#voucherTxtSearch").val();
            }
        }
        //Search More Filters
        if ($con.find("#moreFilter").is(":visible")) {
            VoucherAmountFrom = $con.find("#VoucherAmountFrom").val();
            VoucherAmountTo = $con.find("#VoucherAmountTo").val();
            VoucherBuyAmountFrom = $con.find("#VoucherBuyAmountFrom").val();
            VoucherBuyAmountTo = $con.find("#VoucherBuyAmountTo").val();
            VoucherRegDateFrom = $con.find("#VoucherRegDateFrom").val();
            VoucherRegDateTo = $con.find("#VoucherRegDateTo").val();
            VoucherPayDateFrom = $con.find("#VoucherPayDateFrom").val();
            VoucherPayDateTo = $con.find("#VoucherPayDateTo").val();
        }

        var DTO = { 'sort': sortid, 'customerId': $con.find("#hd_d_PersonId").val(), 'registerer': registerer, 'customer': customer,
            'number': number, 'payer': payer, 'FromValidationDate': $con.find("#VoucherFromValidationDate").val(),
            'ToValidationDate': $con.find("#VoucherToValidationDate").val(), 'voucherStatus': $con.find("#voucherStatus").val(),
            'amountFrom': VoucherAmountFrom, 'amountTo': VoucherAmountTo, 'buyAmountFrom': VoucherBuyAmountFrom,
            'buyAmountTo': VoucherBuyAmountTo, 'regDateFrom': VoucherRegDateFrom, 'regDateTo': VoucherRegDateTo,
            'payDateFrom': VoucherPayDateFrom, 'payDateTo': VoucherPayDateTo
        };
        params["DTO"] = DTO;

        pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
            first: true, isOrder: false
        });
    }

    function buildVoucherList(jq, container) {
        var $con = $("#" + container.pagingContainer);
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "کارمند (صادر کننده)", sort: "ac_OrderHeader1.p_Person.Family", width: "10%" });
        lsth.push({ title: "مشتری (واریز کننده)", sort: "ac_OrderHeader1.p_Person1.Family", width: "10%" });
        lsth.push({ title: "issueDate", sort: "ac_OrderHeader1.Date", width: "13%" });
        lsth.push({ title: "buyPrice", sort: "ac_OrderHeader1.Amount", width: "9%" });
        lsth.push({ title: "ارزش کارت", sort: "Amount", footer: jq.sumDebtor, width: "9%" });
        lsth.push({ title: "شماره کارت", sort: "Number", footer: jq.sumCreditor, width: "10%" });
        lsth.push({ title: "expieryDate", sort: "ExpieryDate", width: "13%" });
        lsth.push({ title: "Shop", sort: "ac_OrderHeader1.inv_Shop.Name", width: "10%" });
        lsth.push({ title: "status", sort: "IsValid", width: "8%" });
        lsth.push({ title: "deleteKey", width: "4%" });
        lsth.push({ title: "details", width: "4%" });
        var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
        var ItemList = "";
        if (List != null)
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                var trBody = {};
                if (!container.params.print)
                    trBody[0] = { trId: val.OrderHeaderId };
                trBody[1] = { name: "employee", html: val.registerer, width: "10%" };
                trBody[2] = { name: "customer", html: val.customer, width: "10%" };
                trBody[3] = { html: val.Date, props: { name: "date", date: val.Date, width: "13%", klass: "date"} };
                trBody[4] = { name: "payAmount", html: val.buyAmount, width: "9%" };
                trBody[5] = { name: "amount", html: val.Amount, width: "9%" };
                trBody[6] = { name: "number", html: val.Number, width: "10%" };
                trBody[7] = { html: val.ExpieryDate, props: { name: "validationDate", date: val.ExpieryDate, width: "13%", klass: "date"} };
                trBody[8] = { name: "shop", html: val.shop, width: "10%" };
                trBody[9] = { name: "status", html: "<span id='voucherStatus'>" + (val.IsValid == true ? "معتبر" : "نامعتبر") + "</span>&nbsp;&nbsp;&nbsp;<button id='btnConfirm'>تغییر وضعیت</button>", width: "8%" };
                lstb.push(trBody);
            }
        var details = { deleteFunction: DeleteVoucher, confirmFunction: ChangeVoucherStatus, detailsFunction: VoucherDetails };
        table = { header: lsth, body: lstb, details: details, heigth: 300,
            container: container.pagingContainer, divName: "VoucherList", hasFooter: true
        };
        buildTable(table);
    }
    function DeleteVoucher(dis, container) {
        var $con = $("#" + container);
        var $dis = $("#tr" + dis);
        var DTO = { 'voucherNumber': $dis.find("[name=number]").html() };
        $.ajax({
            type: "POST",
            url: "Management/DeleteVoucher",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone == false) {
                    alert(response.msg);
                    return;
                }
                if (response != null && response.isdone == true)
                    $dis.remove();
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }
    function ChangeVoucherStatus(dis, container) {
        var $con = $("#" + container);
        var $dis = $(dis);
        var DTO = { 'voucherNumber': $dis.parents("tr").find("[name=number]").html() };
        $.ajax({
            type: "POST",
            url: "Management/ChangeVoucherStatus",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response != null && response.isdone == false) {
                    alert(response.msg);
                    return;
                }
                if (response != null && response.isdone == true) {
                    var $parentBtn = $dis.parent();
                    if (response.status)
                        $parentBtn.find("#voucherStatus").html("معتبر");
                    else
                        $parentBtn.find("#voucherStatus").html("نامعتبر");
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }
    function VoucherDetails(dis, container) {
        var $con = $("#" + container);
        var $dis = $(dis);
        var $dialog = $("#dialog" + container);
        $.ajax({
            type: "POST",
            url: "Management/GetVoucherDetails",
            contentType: "application/json; charset=utf-8",
            data: "{voucherNumber: '" + $dis.parents("tr").find("[name=number]").html() + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                jq = response;
                if (jq.OrderHeaderId == undefined) {
                    alert("کارت هدیه خرج نشده است.");
                    return;
                }
                if (jq.msg != undefined && jq.msg == "empty") {
                    $dialog.find("#VoucherDetailList").html("");
                    $dialog.dialog("close");
                    return;
                }
                var ItemList = "";
                ItemList += "<tr id='tr" + jq.OrderHeaderId + "'>" +
            "<td name='customer' width='20%'>" + jq.employer + "</td>" +
            "<td name='payer' width='20%'>" + jq.payer + "</td>" +
            "<td name='Date' width='20%'>" + jq.Date + "</td>" +
            "<td name='shop' width='20%'>" + jq.shop + "</td>" +
            "<td name='counter' width='20%'>" + jq.counter + "</td>" +
            "</tr>";
                $dialog.find("#VoucherDetailList").html(ItemList).parent().tableScroll({ height: 380, width: 750, flush: false });
                $dialog.dialog({ width: 800 }).dialog("open");
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function AddVoucher(Supplierid, container) {
        var $con = $("#" + container.pagingContainer);
        var DTO = { 'customerId': Supplierid, 'voucherAmount': 100000, 'minimumBuy': 200, 'currencyId': $("#userDefault").find("#ddl_m_Currency").val(), 'shopId': $("#userDefault").find("#ddl_s_Branch").val(), 'expieryDate': "1391/10/30" };
        $.ajax({
            url: "Management/AddVoucher",
            data: JSON.stringify(DTO),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {

            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function loadCustomerVoucherList(customerid, container, first) {
        sortid = 'OrderHeaderId desc';
        var $con = $("#" + container);
        $con.find("#hd_d_PersonId").val(customerid);
        if (first) {
            //slide
            $con.find('#moreFilter').slideUp('fast');
            $con.find('.toggle-more-filters').click(function () {
                $(this).toggleClass("open")
                $con.find('#moreFilter').slideToggle(function () {
                });
            });
            //Validation Date
            $con.find("#txtFromValidationDate").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#txtToValidationDate').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#txtToValidationDate").datepicker({ changeMonth: true, changeYear: true });
            //Register Date
            $con.find("#VoucherRegDateFrom").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#VoucherRegDateTo').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#VoucherRegDateTo").datepicker({ changeMonth: true, changeYear: true });
            //
            //Pay Date
            $con.find("#VoucherPayDateFrom").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#VoucherPayDateTo').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#VoucherPayDateTo").datepicker({ changeMonth: true, changeYear: true });
            //Search Button
            $con.find("#btnSearchVoucher").button({ icons: {
                primary: "ui-icon-search"
            }
            }).unbind('click').click(function () {
                sortid = "OrderHeaderId desc";
                getVoucherList(container, { container: container, callbackmethod: getVoucherList, fname: "", page_index: 0,
                    build: buildVoucherList, servicename: "Management", methodname: "GetVoucherList", print: false
                });
            });
            //Page size change
            $con.find("#PageSize").off().on('change', function () {
                getVoucherList(container, { container: container, callbackmethod: getVoucherList, fname: "", page_index: 0,
                    build: buildVoucherList, servicename: "Management", methodname: "GetVoucherList", print: false
                });
            });
            //Show Voucher List
            getVoucherList(container, { container: container, callbackmethod: getVoucherList, fname: "", page_index: 0,
                build: buildVoucherList, servicename: "Management", methodname: "GetVoucherList", print: false
            });
            //Show Voucher Details

            $con.find("#SearchBy option[value='customer']").remove();
        }
        $con.find("#voucherDetailsDialog").attr("id", "dialog" + container);
        $con.find("#dialog" + container).dialog({ autoOpen: false }).dialog({ width: 750 });
    }

    function getCustomerVoucherList(container, params) {
        var $con = $("#" + container);
        if ($con.find("#txt_payer").val() == "" && $con.find("#hd_d_PersonId").val() == "") {
            alert("کد مشتری را انتخاب کنید.");
            return;
        }
        if (params.page_index > 0) {
            params.first = false;
        }
        var DTO = { 'sort': sortid, 'customerId': $con.find("#hd_d_PersonId").val(), 'customerCode': $con.find("#txt_payer").val() };
        params["DTO"] = DTO;
        pageselectCallback(0, params, { container: "dialog", fname: params.fname, pagingContainer: container, first: true, isOrder: false });
    }
    function VoucherRowClick($dis, container) {
        var $con = $("#" + container);
        $con.find("#txtVoucherNumber").val($dis.find("[name=number]").html());
        GetVoucherItem(true, container);
    }
    function GetVoucherItem(first, container) {
        var $con = $("#" + container);
        var $dialog = $("#" + container);
        var ItemList = "";
        var isReturn = false;
        var DTO = { 'voucherNumber': $con.find("#txtVoucherNumber").val() };
        $.ajax({
            url: "Management/GetVoucherItem",
            data: JSON.stringify(DTO),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.msg == undefined) {
                    //                if (first) {
                    $con.find("#divslider2").removeClass("invisible");
                    $con.find("#table_voucher").removeClass("invisible");
                    //                }
                    buildPayVoucherItem(response, container);
                }
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function buildPayVoucherList(jq, pageoption) {
        var $con = $("#" + pageoption.container);
        jq = jq.results;
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "voucherOwner", width: "12%" });
        lsth.push({ title: "number", sort: "Number", width: "35%" });
        lsth.push({ title: "cost", sort: "Amount", width: "14%" });
        lsth.push({ title: "expieryDate", sort: "ExpieryDate", width: "10%" });
        lsth.push({ title: "buyAmount", sort: "buyAmount", width: "15%" });
        lsth.push({ title: "registerer", width: "14%" });

        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            trBody[0] = { trId: val.OrderHeaderId };
            trBody[1] = { name: "customer", html: val.customer, width: "12%" };
            trBody[2] = { name: "number", html: val.Number, width: "35%" };
            trBody[3] = { name: "Amount", html: val.Amount, width: "14%" };
            trBody[4] = { name: "ExpieryDate", html: val.ExpieryDate, width: "10%" };
            trBody[5] = { name: "buyAmount", html: val.buyAmount, width: "15%" };
            trBody[6] = { name: "registerer", html: val.registerer, width: "14%" };

            lstb.push(trBody);
        }
        details = { rowClick: pageoption.fname };
        table = { header: lsth, body: lstb, details: details, heigth: 300, width: 620,
            container: pageoption.container + pageoption.pagingContainer, divName: "VoucherList",
            rowClickParams: { fname: VoucherRowClick }
        };
        buildTable(table);
    }

    function buildPayVoucherItem(jq, container) {
        var $con = $("#" + container);
        var counter = 0;
        jq = jq;
        $con.find("#VoucherItem").find("td[name=voucherNumber]").each(function () {
            if ($(this).html() == jq.Number)
                counter++;
        });
        if (counter == 0) {
            var trId = "voucher_" + jq.OrderHeaderId;
            var ItemList = "";
            ItemList += "<tr id= '" + trId + "'>" +
                "<td width='12%'>" + jq.customer + "</td>" +
               "<td name='voucherNumber' width='10%'>" + jq.Number + "</td>" +
               "<td name='voucherAmount' width='13%'>" + jq.Amount + "</td>" +
               "<td width='10%'>" + jq.ExpieryDate + "</td>" +
               "<td width='13%'>" + jq.buyAmount + "</td>" +
               "<td width='12%'>" + jq.registerer + "</td>" +
               "<td width='10%'>" + jq.Date + "</td>" +
               "<td width='14%'>" + jq.shop + "</td>" +
               "<td id='delete' width='6%'><button name='btn_Delete' ></button></td></tr>";
            "</tr >";
            $con.find("#VoucherItem").append(ItemList).parent().tableScroll({ height: 380, width: $con.width() - 85, flush: false }); ;
            tableStyle();
            SumPayment(container);
            $con.find("[name=btn_Delete]").button({ icons: {
                primary: "ui-icon-closethick"
            },
                text: false
            }).unbind().click(function () {
                if (confirm("آیا از حذف مطمئن هستید؟"))
                    RemoveItemVoucherElement($(this).parents("tr").attr("id"), container);
                else
                    return;
            });
        }
    }

    function RemoveItemVoucherElement(trid, container) {
        var $con = $("#" + container);
        $con.find("#" + trid).remove();
        SumPayment(container);
    }

    function loadSellVoucher(container, first) {
        var $con = $("#" + container);
        if ($("#txt_customer").val() != "")
            $con.find("#txt_payer").val($("#txt_customer").val());
        $con.find("#btn_newVoucher").button({
            icons: { primary: 'ui-icon-plus' },
            text: true
        }).click(function () {
            BuildVoucherItem(container);
        });
        $con.find("#btn_Add_Voucher").button({
            icons: { primary: 'ui-icon-disk' },
            text: true
        }).click(function () {
            if (validateAll($con))
                AddSellVoucher($con.find("#txt_payer").val(), container);
        });
        aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "Management", id: "txt_payer", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_payer", fname: customerOnSelect });
        $con.find("#txt_PaymentAmount").dblclick(function () {
            $con.find("#txt_PaymentAmount").val($con.find("#txt_TotalAmount").val());
        });
    }

    function BuildVoucherItem(container) {
        var $con = $("#" + container);
        $con.find("#table_voucher").removeClass("invisible");
        var temp = "";
        temp += "<tr name='sellVoucher'>" +
            "<td width='45%'><input type='text' class=' inputText inputW136 required validate' name='Digit' id='txt_amount' onchange='return SumVoucherAmount(\"" + container + "\");'/></td>" +
            "<td width='45%'><input type='text' class=' inputText inputW136 required validate' name='Date' id='txt_date'/></td>" +
            "<td width='10%'><button id='btn_delete'>حذف</button></td>" +
            "</tr>";
        $con.find("#table_voucher").append(temp).parent().tableScroll({ height: 380, width: 600, flush: false });
        SumVoucherAmount(container);
        $con.find("[id=btn_delete]").button({
            icons: { primary: 'ui-icon-closethick' },
            text: false
        }).click(function () {
            $(this).parents("tr").remove();
            SumVoucherAmount(container);
        });
    }

    function SumVoucherAmount(container) {
        var $con = $("#" + container);
        var sumprice = 0;
        $con.find("tr[name=sellVoucher]").each(function () {
            sumprice += $(this).find("#txt_amount").val() * 1;
        });
        $con.find("#txt_TotalAmount").val(sumprice);
    }

    function AddSellVoucher(customerCode, container) {
        var $con = $("#" + container);
        var Vouchers = [];
        $con.find("tr[name=sellVoucher]").each(function () {
            var voucher = {};
            voucher["ExpieryDate"] = $(this).find("#txt_date").val();
            voucher["Amount"] = $(this).find("#txt_amount").val();
            Vouchers.push(voucher);
        });
        var DTO = { 'customerCode': customerCode, 'currencyId': $("#userDefault").find("#ddl_m_Currency").val(),
            'shopId': $("#userDefault").find("#ddl_s_Branch").val(), 'vouchers': Vouchers,
            'counterId': $("#userDefault").find("#ddl_m_Counter").val(), 'amount': $con.find("#txt_TotalAmount").val(),
            'payAmount': $con.find("#txt_PaymentAmount").val(), 'description': $con.find("#txt_description").val()
        };
        $.ajax({
            url: "Management/AddSellVoucher",
            data: JSON.stringify(DTO),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    //---------------voucher end---------------------------



    //--------------------js order begin-----------------------

    function loadOrder(supplierid, container, fname, IsWholeSale, isCustomer, first, options) {
        var $con = $("#" + container);
        sortid = "BarcodeId Desc";
        $con.find("#div_OrderDate").addClass('hidden');
        $con.find("#div_payamount").removeClass('hidden');
        if (first) {

            $con.find('#moreFilter').slideUp('fast');
            //        $con.find("#txt_s_Date").attr("id", "txt_s_Date" + container);
            //        $con.find("#txt_s_Date" + container).datepicker({ changeMonth: true, changeYear: true });
            //        $con.find("#txt_s_Date" + container).datepicker('setDate', new Date());
            $con.find('.toggle-more-filters').click(function () {
                $(this).toggleClass("open");
                $con.find('#moreFilter').removeClass('invisible');
                $con.find('#moreFilter').slideToggle(function () {
                    // Animation complete.
                });
            });
            if ($("#txt_customer").val() != "" && container == "dialogAddAccounting") {
                $con.find("#txt_s_Person").val($("#txt_customer").val());
                $con.find("#customerOnSelect").html($("#customerOnSelect").html());
            }
            $con.find("#Div_Print").load("Report/PrintInvoice.htm", function () { });
            $("#dialog" + container).remove();
            $con.find("#dialog").attr("id", "dialog" + container);
            bindItemsForSelectCombo({ methodname: "getAvailablity", servicename: "Management", id: "ddl_m_Availability", container: container, headertext: "وضعیت کالا", selectedindex: 1 });
            $con.find("#txt_s_ProductCode,#txt_s_ProductBarcode").bind('keydown', function (e) {
                if (e.keyCode == 13 || e.keyCode == 9) {
                    getBarcodeListOrder(container, { container: "dialog", callbackmethod: getBarcodeListOrder, fname: fname, page_index: 0, build: buildBarcodeListOrder, servicename: "Management", methodname: "GetItemsList" });
                }
            });
            if (options != undefined && options.isChangeQuantity != undefined && options.isChangeQuantity == true) {
                $con.append("<input type='checkbox' id='cbIsChangeQuantity' class='hidden' checked />")
            }

            $con.find("#txt_m_PaymentAmount").dblclick(function () {
                $con.find("#txt_m_PaymentAmount").val($con.find("#txt_m_TotalPrice").val());
            });
            if (IsWholeSale) {
                $con.find("#simpleOrder").remove();
            }
            else {

                $con.find("#wholesaleOrder").remove();
            }

            ChangeCheckBoxName("cb_d_PreOrder", container);
            ChangeCheckBoxName("cb_d_Sale", container);
            if (isCustomer) {

                $con.find("#cb_d_Sale" + container).unbind('change').change(function () {
                    if (this.checked) $(this).button("option", "label", "فروش"); else $(this).button("option", "label", "مرجوعی");
                });
            }
            else {
                $con.find("#cb_d_Sale" + container).prop("checked", "checked").trigger("change").unbind('change').change(function () { if (this.checked) $(this).button("option", "label", "مرجوعی"); else $(this).button("option", "label", "خرید"); });
            }
            $con.find("#cb_d_PreOrder" + container).unbind('change').change(function () { if (this.checked) $(this).button("option", "label", "فاکتور"); else $(this).button("option", "label", "پیش فاکتور"); });

            $con.find("#dialog_ItemQuantity").dialog({ autoOpen: false })
            bindHierarchyData({ id: "hr_s_Category", table: "category", container: container });
            $con.find("#btn_SearchProduct").button({ icons: {
                primary: "ui-icon-search"
            }
            }).unbind().bind('click', function () {
                sortid = "BarcodeId Desc";
                getBarcodeListOrder(container, { container: "dialog", callbackmethod: getBarcodeListOrder, fname: fname, page_index: 0, build: buildBarcodeListOrder, servicename: "Management", methodname: "GetItemsList" });

            }).button();

            $con.find("#btn_AddOrder").off().on('click', function () {
                if (validateAll($con)) {
                    if (!$con.find("#hi_orderHeaderId").val()) {
                        if (IsWholeSale) {
                            AddOrderWholesale(supplierid, container);
                        }
                        else {
                            AddOrder(supplierid, container);
                        }
                    }
                    else {
                        EditOrder(supplierid, container);
                    }
                }

            }).button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            });

            $con.find("#btn_Print").off().on('click', function () {

                Popup($con.find("#Div_Print").html());
            }).button().addClass('invisible');
            aComplete({ methodname: "GetCompletionListByItemName", servicename: "Management", id: "txt_s_ProductCode", container: container, minlength: 2, autofocus: false, limit: 10, boxId: "txt_s_ProductCode" }, { Status: "ddl_m_Availability" });
            if (options != undefined && options.isfastorder == true) {
                if (options != undefined && options.isChangeQuantity != undefined && options.isChangeQuantity == true) {
                    aComplete({ methodname: "GetCompletionListBySupplierName", servicename: "Management", id: "txt_s_Person", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_s_Person", fname: customerOnSelect });
                }
                else
                    aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "Management", id: "txt_s_Person", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_s_Person", fname: customerOnSelect });
            }
        }
    }

    function customerOnSelect(event, ui, container) {
        var $con = $("#" + container);
        $con.find("#customerOnSelect").html(ui.item.label).addClass("ui-state-highlight");
        $con.find("#hd_s_Person").val(ui.item.id);
    }
    function getDataPrint(OrderHeaderId, container) {
        var $con = $("#" + container);
        var DTO = { 'id': OrderHeaderId };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/GetInvoiceById",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone) {
                    SetInvoiceData(container, response);
                    Popup($con.find("#Div_PrintFactor").html());
                }
                else
                    alert("noData");

            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function SetInvoiceData(container, response) {

        var $con = $("#" + container);
        //$con.find("#Div_Print").load("Report/PrintInvoice.htm", function () {
        var List = (typeof response) == 'string' ? eval('(' + response + ')') : response;
        var ItemList = "";
        for (var i = 0; i < List.detail.length; i++) {
            var val = List.detail[i];
            ItemList += "<tr><td align='Center'>" + (i * 1 + 1) + "</td>" +
                "<td align='Right'  nowrap='nowrap'><h6>" + val.Name + "</h6></td>" +
                "<td align='Center' nowrap='nowrap'><h6>" + val.Quantity + "</h6></td>" +
                "<td align='Center' nowrap='nowrap'>" + val.Price + "</td>" +
                "<td align='Center' nowrap='nowrap'>" + (val.Price * val.Quantity) + "</td></tr>";
        }
        $con.find("#LShop").html(List.ShopName);
        if (List.PreOrder)
            $con.find("#LInvoice").html("پیش فاکتور");
        else
            $con.find("#LInvoice").html((List.Sell ? " فاکتور فروش " : " فاکتور مرجوعی "));
        $con.find("#LInvoiceNo").html(List.InvoiceNO);
        $con.find("#LClinet").html((List.Gender ? "آقای " : "خانم ") + " " + List.Family);
        $con.find("#LCustomer").html((List.ClientGender ? "آقای " : "خانم ") + " " + List.ClientFamily);
        $con.find("#LDate").html(List.Date);
        //  $con.find("#LTime").html(List.Time);
        $con.find("#LAmount").html(List.Amount);
        $con.find("#LCurrency").html(List.Currency);
        $con.find("#DetailInvoiceList").html(ItemList);
        //});
    }

    function Popup(data) {
        var mywindow = window.open('', 'Div_Print'); //'height=400,width=600');
        mywindow.document.write('<html><head><title>my div</title>');
        /*optional stylesheet*/mywindow.document.write('<link rel="stylesheet" href="Content/Default/StylePrint.css" type="text/css" />');
        mywindow.document.write("</head><body dir='rtl'>");
        mywindow.document.write(data);
        mywindow.document.write('</body></html>');
        mywindow.document.close();
        mywindow.print();
        return true;
    }

    function loadSupplierOrder(supplierid, container, first) {
        loadOrder(supplierid, container, GetItemOrder, false, false, first);

    }
    function loadCustomerOrder(supplierid, container, first) {

        loadOrder(supplierid, container, GetItemOrder, false, true, first);
    }
    function loadCustomerFastOrder(container, first) {

        loadOrder(0, container, GetItemOrder, false, true, first, { isfastorder: true });
    }

    function loadEditQuantityOrder(container, first) {
        var $con = $("#" + container);
        if (first) {
            $con.find("[name='changeQuantity']").remove();
            $con.find("[name='setPayment']").removeClass("invisible");
            $con.find("#spClient").html("supplier")
            $con.find("#txt_s_Person").attr("placeholder", "supplier")
            $con.find("#cbSetPayment").unbind('change').change(function () {
                if (this.checked) $(this).button("option", "label", "setPayment"); else $(this).button("option", "label", "noPayment");
                localize();
            }).button();
            loadOrder(0, container, GetItemOrder, false, true, first, { isfastorder: true, isChangeQuantity: true });
        }
    }


    function AddOrder(supplierid, container) {
        var $con = $("#" + container);
        var orderdetails = [];
        var orderheader = {};
        $.each($("#" + container).find("#OrderList").find("tr[id*=tr]"), function () {
            var orderdetail = {};
            var $row = $(this);
            var colorId = $row.find("#ddl_m_Color_" + this.id).val();
            var sizeId = $row.find("#ddl_m_Size_" + this.id).val();
            orderdetail["barcodeid"] = this.id.split("_")[2];
            orderdetail["colorid"] = colorId == null ? "" : colorId;
            orderdetail["sizeid"] = sizeId == null ? "" : sizeId;
            orderdetail["quantity"] = $row.find("#txt_m_TotalQuantity").val();
            orderdetail["price"] = $row.find("#txt_m_Price").val();
            orderdetail["description"] = "";
            orderdetail["serial"] = $row.find("#txt_m_Serial").val();
            orderdetail["broken"] = false;
            if ($con.find("#cbIsChangeQuantity").prop("checked")) {
                orderdetail["status"] = $row.find("#ddl_m_Availability").val();
                orderdetail["broken"] = $row.find("#cb_d_Broken_" + this.id).prop('checked');
            }
            orderdetails.push(orderdetail);
        })
        orderheader["shopid"] = $("#userDefault").find("#ddl_s_Branch").val();
        orderheader["date"] = $("#userDefault").find("#txt_s_Date").val();
        orderheader["currenyid"] = $("#userDefault").find("#ddl_m_Currency").val();
        if ($con.find("#cbIsChangeQuantity").length < 1) {
            orderheader["totalamount"] = $con.find("#txt_m_TotalPrice").val().replace(/,/g, "");
            orderheader["PaymentAmount"] = $con.find("#txt_m_PaymentAmount").val().replace(/,/g, "");

        }
        else {
            orderheader["setPayment"] = $con.find("#cbSetPayment").prop("checked");
        }
        orderheader["description"] = $con.find("#txt_m_Description").val();
        orderheader["invoicenumber"] = $con.find("#txt_m_InvoiceNumber").val();
        orderheader["clientCode"] = $con.find("#txt_s_Person").val();
        if ($con.find("#hd_s_Person").val() != undefined)
            supplierid = $con.find("#hd_s_Person").val();
        orderheader["customerid"] = supplierid;
        orderheader["issell"] = !$con.find("#cb_d_Sale" + container).prop("checked");
        orderheader["ispreorder"] = $con.find("#cb_d_PreOrder" + container).prop("checked");

        var DTO = { 'header': orderheader, 'itemDetails': orderdetails, 'counterId': $("#userDefault").find("#ddl_m_Counter").val(), 'vat': $con.find("#txt_vat").val() };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: $con.find("#cbIsChangeQuantity").length > 0 ? "Management/ChangeQuantity" : "Management/AddOrder",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.alert != undefined) {
                    SetInvoiceData(container, response);
                    // getDataPrint(response.OrderHeaderId, container)
                    translate(response.alert);
                    if (response.InvoiceNO != undefined) {
                        $con.find("#OrderList").html("");
                        $con.find("#btn_Print").removeClass('invisible');
                        $con.find("#btn_AddOrder").addClass('invisible');
                        $con.find("#txt_m_InvoiceNumber").val(response.InvoiceNO);
                    }
                }
                else
                    translate(response.msg);

            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function GetItemOrder($dis, container, barcode, isChangeQuantity) {
        // container = container.replace("dialog", "");


        if (barcode == undefined) {
            //first tr of $dis
            var b = $dis.closest('tr').attr('id');
            barcode = b.substring(2, b.length);
        }
        var $con = $("#" + container);
        //  var $con = $("#" + container.replace("dialog", ""));
        var ItemList = "";

        var isReturn = false;
        if ($con.find("#cb_d_Sale" + container).prop("checked") != undefined)
            isReturn = $con.find("#cb_d_Sale" + container).prop("checked");
        var isChangeQuantity = false;
        if ($con.find("#cbIsChangeQuantity").prop("checked") != undefined) {
            isChangeQuantity = $con.find("#cbIsChangeQuantity").prop("checked");
            isReturn = true;
        }
        var DTO = { 'barcode': barcode, 'shopId': $("#userDefault").find("#ddl_s_Branch").val(), isReturn: isReturn };
        $.ajax({
            type: "POST",
            data: JSON.stringify(DTO),
            url: "Management/GetProductForOrderByBarcode",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                $con.find("#txt_s_ProductBarcode").val("");
                if (response.length < 1)
                    return;
                if ($con.find("#OrderList").html() == "") {
                    $con.find("#txt_m_InvoiceNumber").val("");
                    $con.find("#txt_m_PaymentAmount").val("");
                }
                var count = $con.find("tr[id*='tr_" + container + "']").length;
                var List = (typeof response) == 'string' ? eval('(' + response + ')') : response;
                var ItemList = "";
                var val = List[0, 0];
                var trid = "tr_" + container + "_" + val.barcodeid + "_" + count;
                //         var tb=  " <table class='table'><thead id='header' style='height: 23px' class='invisible'><td width='3%'> ردیف</td><td width='11%'> نام و کد کالا</td><td width='8%'> واحد</td><td width='43%'> تعداد</td>"
                //            + "<td width='11%'> قیمت پایه </td><td width='6%'>تعداد نهایی</td> <td width='13%'> قیمت نهایی </td><td width='5%'>حذف</td> </thead><tbody id='OrderList'></tbody></table>"
                var priceType = "";
                // var regularPrice = val.price.Regular;
                obj = val.price;
                for (var name in obj) {
                    var value = obj[name];
                    var p = 0;
                    if (value == null)
                        p = val.price.basePrice;
                    else
                        p = value;
                    priceType += "<option value='" + p + "'>" + p + " " + name + "</option>";
                }
                ItemList += "<tr id='" + trid + "'>" +
            "<td width='3%' id='rownumber'></td>" +
                "<td width='20%'><a href='javascript:showQuantity(\"" + container + "\",\"" + val.barcode + "\");'>" + val.name + " " + val.code + " " + val.barcode + "</a></td>" +
                "<td width='6%' id='Color_'>" +
                            " <select   id='ddl_m_Color_" + trid + "' disabled='disabled' class='select55 ' ></select>" +
                            "</td>" +
                             "<td width='6%' id='Color_'>" +
                           "<select   id='ddl_m_Size_" + trid + "' disabled='disabled' class='select55 '></select>" +
                            "</td>" +
                             "<td width='6%' id='Color_'>" +
                            " <select   id='ddl_m_measureunit_" + trid + "' disabled='disabled' class='select55 '></select>" +
                            "</td>" +
                             "<td width='10%' id='Color_'> <select   id='ddl_m_priceType_" + trid + "'  class='select95'>" + priceType + "</select></td>" +
               "<td width='7%'><input type='text'  id='txt_m_Quantity' VALUE='1' class='inputW34 fontSize15'  /></td>" +
                "<td width='11.5%'><input type='text'  id='txt_m_Price' class='inputW80 fontSize15' value='" + val.price.basePrice + "' /></td>" +
                "<td width='7%'><input type='text' id='txt_m_TotalQuantity' class='inputW50 fontSize15'   disabled='disabled'/></td>" +
                "<td width='9%'><input  class='inputW80 fontSize15 digit' type='text' id='txt_m_TotalItemPrice' disabled='disabled'/></td>" +
                "<td width='11%' id='Color_'>" + (isChangeQuantity ? "<select class=' selectsmall1 ' id='ddl_m_Availability'></select>" : " <input class='inputW100 fontSize15' type='text' id='txt_m_Serial' />") + "</td>" +
                // (isChangeQuantity ? "<td width='11%'><select class=' selectsmall1 ' id='ddl_m_Availability'></select></td>" : "<td width='11%'><input class='inputW100 fontSize15' type='text' id='txt_m_Serial' /></td>") +
                "<td width='2.5%' id='delete'><span title='حذف' name='deleteOrder' class='cursor ui-icon ui-icon-closethick'></span></td></tr>";
                $con.find("#OrderList").append(ItemList).parent().tableScroll({ height: 380, width: $con.width() - 85, flush: false });
                //            $con.find("#btn_Print").addClass('invisible');
                $con.find("#btn_AddOrder").removeClass('invisible');
                //    $con.find("#OrderList").parent().tableScroll({ height: 380 });
                // TableAlter(container);

                if (isChangeQuantity) {
                    $con.find("#tdSerial").html("itemStatus");
                    bindItemsForSelectCombo({ methodname: "getAvailablity", servicename: "Management", id: "ddl_m_Availability", container: trid, headertext: "وضعیت کالا", selectedindex: val.status });

                    $con.find("#cb_d_Broken_" + trid).button().prop("checked", "checked").trigger("change").unbind('change').change(function () {
                        if (this.checked) {
                            //  buildColorSizeTable(barcode, $("#userDefault").find("#ddl_s_Branch").val(), true, "GetItemDetailsByBarcodeAndShopID", "Quantity_" + trid, trid);
                            $(this).button("option", "label", "سالم");
                        }
                        else {

                            //  buildColorSizeTable(barcode, $("#userDefault").find("#ddl_s_Branch").val(), true, "GetBrokenItemDetailsByBarcodeAndShopID", "Quantity_" + trid, trid);
                            $(this).button("option", "label", "خراب");
                        }
                    });
                }
                $con.find("[name=deleteOrder]").unbind().click(function () {
                    if (confirm("آیا از حذف مطمئن هستید؟"))
                        RemoveItemOrderElement($(this).parents("tr").first().prop("id"), container);
                    else
                        return;
                });

                $("#" + trid).find("[id=txt_m_Quantity]").spinner({ change: function () {
                    SumPrice($(this).parents("tr").attr("id"), container);
                },
                    stop: function () {
                        SumPrice($(this).parents("tr").attr("id"), container);
                    }
                });
                $("#" + trid).find("[id=txt_m_Price]").spinner({ step: 1000, change: function () {
                    SumPrice($(this).parents("tr").attr("id"), container);
                },
                    stop: function () {
                        SumPrice($(this).parents("tr").attr("id"), container);
                    }
                });
                $con.find("#Footer").removeClass("invisible");
                $("#" + trid).find("#txt_m_Price").unbind("keydown").bind('keydown', function (e) {
                    if (e.keyCode == 40) {
                        $(this).parent().parent().next().find("#txt_m_Price").focus().focus(function () { this.select() });
                    }
                    if (e.keyCode == 38) {
                        $(this).parent().parent().prev().find("#txt_m_Price").focus().focus(function () { this.select() });
                    }
                });
                $("#" + trid).find("#txt_m_Quantity").unbind("keydown").bind('keydown', function (e) {
                    if (e.keyCode == 40) {
                        $("#" + trid).next().find("#txt_m_Quantity").focus().focus(function () { this.select() });
                    }
                    if (e.keyCode == 38) {
                        $("#" + trid).prev().find("#txt_m_Quantity").focus().focus(function () { this.select() });
                    }
                });

                bindComboData({ id: "ddl_m_measureunit_" + trid, container: trid, isMeasureUnit: true }, val.measureUnits);
                $("#ddl_m_measureunit_" + trid).change(function () { SumPrice(trid, container); });
                bindComboData({ id: "ddl_m_Color_" + trid, container: trid, headertext: " رنگ", setcolor: true }, val.colors);
                $("#ddl_m_Color_" + trid).change(function () { SelectColorForOrder(trid, this, val.barcodeid, isReturn); });
                $("#ddl_m_priceType_" + trid).change(function () {
                    $("#" + trid).find("#txt_m_Price").val($(this).val());
                    SumPrice(trid, container);
                });
                ajDropDown.done(function () {
                    if ($con.find("#ddl_m_Color_" + trid + " option").length < 1)

                        bindItemsForSelectCombo({ methodname: "GetSizeListByBarcodeIdColorId", servicename: "Management", id: "ddl_m_Size_" + trid, container: trid, headertext: " جزئیات" }, { arg: trid.split("_")[2], sarg: $("#userDefault").find("#ddl_s_Branch").val(), targ: "", isReturn: isReturn });
                });
                SumPrice(trid, container);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function SelectColorForOrder(container, dis, barcodeid, isReturn) {
        var $con = $("#" + container);
        bindItemsForSelectCombo({ methodname: "GetSizeListByBarcodeIdColorId", servicename: "Management", id: "ddl_m_Size_" + container, container: container, headertext: " جزئیات" }, { arg: barcodeid, sarg: $("#userDefault").find("#ddl_s_Branch").val(), targ: $(dis).val(), isReturn: isReturn });
        //    bindItemsForCombo({ methodGetItem: "GetSizeListByBarcodeIdColorId", servicelocation: "InventorySetting", id: "ddl_m_Size_" + container, container: container, event: "evente" }, "{ arg:'" + container.split("_")[2] + "',sarg:'" + $("#userDefault").find("#ddl_s_Branch").val() + "',targ:'" + getRadioSelectedValue(id, container) + "',isReturn:'" + $con.parents().find("input:checkbox[id*='cb_d_Sale']").first().prop("checked") + "'}");
        // bindItemsForSelectByArgs("GetSizeListByBarcodeIdColorId", "InventorySetting", "ddl_m_Size_" + container, container, container.split("_")[2], getRadioSelectedValue(id, container), undefined);
    }

    function showQuantity(container, barcode) {
        buildColorSizeTable(barcode, $("#userDefault").find("#ddl_s_Branch").val(), true, "GetItemDetailsByBarcodeAndShopID", "dialog_ItemQuantity")
        $("#dialog_ItemQuantity").dialog().dialog('open');
    }


    function RemoveItemOrderElement(trid, container, isEdit) {
        $("#" + trid).remove();
        SumPrice(trid, container, isEdit);
    }

    function SumPrice(trid, container, isEdit) {
        $("#" + trid).find("input[id=txt_m_TotalQuantity]").val($("#" + trid).find("input[id=txt_m_Quantity]").val() * ($("#" + trid).find("[id*=ddl_m_measureunit]").val() != null ? $("#" + trid).find("[id*=ddl_m_measureunit]").val().split('_')[0] : 1));
        var totPrice = $("#" + trid).find("input[id=txt_m_TotalQuantity]").val() * ($("#" + trid).find("input[id=txt_m_Price]").val());
        //with discount
        //   $("#" + trid).find("input[id=txt_m_TotalItemPrice]").val(totPrice - (totPrice * ($("#" + trid).find("[id*=ddl_m_measureunit]").val() != null ? $("#" + trid).find("[id*=ddl_m_measureunit]").val().split('_')[1] / 100 : 0)));
        $("#" + trid).find("input[id=txt_m_TotalItemPrice]").val(totPrice);
        $("#" + trid).find("input[id=txt_m_TotalItemPrice]").attr("price", totPrice);
        var sumprice = 0;
        var rownumber = 0;
        $.each($("#" + container).find("tr[id*=tr]"), function () {
            sumprice += $(this).find("input[id=txt_m_TotalItemPrice]").attr("price") * 1;
            rownumber++;
            $(this).find("[id=rownumber]").html(rownumber);
        });
        if (isEdit == undefined)
            isEdit = false;
        if (rownumber <= 0 && !isEdit) {
            $("#" + container).find("#Footer").addClass('invisible');
            $("#" + container).find("#header").addClass('invisible');
        }
        else {
            $("#" + container).find("#Footer").removeClass('invisible');
            $("#" + container).find("#header").removeClass('invisible');
        }

        $("#" + container).find("input[id=txt_m_TotalPrice]").val(sumprice);
        if (!$.browser.msie) {
            $(".digit").digits();
        }
    }

    function loadAcountReport(container, first) {
        sortid = "Date desc";
        var $con = $("#" + container);
        if (first) {
            $con.find('#moreFilter').slideUp('fast');
            $con.find('.toggle-more-filters').click(function () {
                $(this).toggleClass("open")
                $con.find('#moreFilter').slideToggle(function () {
                    // Animation complete.
                });
            });
            bindItemsForSelectCombo({ methodname: "GetComboItems", servicename: "XmlDropDown", headertext: "انتخاب بانک", id: "ddlBank", container: container }, { path: 'Counter/BankTitle' });
            ChangeCheckBoxGroupName("Check", container);
            $con.find("#txtInvoiceDateStart" + container).datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#txtInvoiceDateEnd' + container).datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#txtInvoiceDateEnd" + container).datepicker({ changeMonth: true, changeYear: true });
            $con.find("#btnPrint").off().on('click', function () {
                getAcountList(container, { container: container, callbackmethod: getAcountList, fname: "", page_index: 0,
                    build: buildAcountList, servicename: "Management", methodname: "GetInvoiceStatement", print: true
                });
            }).button({ icons: {
                primary: "ui-icon-print"
            },
                text: true
            });
            $con.find("#txtDueDateFrom").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#txtDueDateTo').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#txtDueDateTo").datepicker({ changeMonth: true, changeYear: true });

            bindHierarchyData({ id: "hr_s_Category", table: "category", container: container });
            $con.find("[id=btnSearch]").button({ icons: {
                primary: "ui-icon-search"
            }
            }).unbind('click').click(function () {
                sortid = "date desc";
                getAcountList(container, { container: container, callbackmethod: getAcountList, fname: "", page_index: 0,
                    build: buildAcountList, servicename: "Management", methodname: "GetInvoiceStatement", print: false
                });
            });
        }
        getAcountList(container, { container: container, callbackmethod: getAcountList, fname: "", page_index: 0,
            build: buildAcountList, servicename: "Management", methodname: "GetInvoiceStatement", print: false
        });
        $con.find("#PageSize").off().on('change', function () {
            getAcountList(container, { container: container, callbackmethod: getAcountList, fname: "", page_index: 0,
                build: buildAcountList, servicename: "Management", methodname: "GetInvoiceStatement", print: false
            });
        });
        $con.find("#DetailPaymentList").dialog({ autoOpen: false }).dialog({ width: 750 });
        //    $con.find("#DetailListInvoice").dialog({ autoOpen: false }).dialog({ width: 750 });
        $con.find("#dialog").attr("id", "dialog" + container);
    }
    //
    function AccountFullAcc(container, first, params) {
        sortid = "date desc";
        var $con = $("#" + container);
        if (first) {
            $con.find("#txtInvoiceDateStart").attr("id", "txtInvoiceDateStart" + container);
            $con.find("#txtInvoiceDateEnd").attr("id", "txtInvoiceDateEnd" + container);
            $con.find("[id=btnSearch]").button({ icons: {
                primary: "ui-icon-search"
            }
            }).unbind('click').click(function () {
                sortid = "date desc";
                getFullAcountList(container, { container: container, callbackmethod: getFullAcountList, fname: "", page_index: 0,
                    build: buildFullAcountList, servicename: "Management", methodname: "GetFullOrderStatement", print: params.print, selectCase: params.selectCase
                });
            });

            if (params.onLoad) {
                sortid = "date desc";
                getFullAcountList(container, { container: container, callbackmethod: getFullAcountList, fname: "", page_index: 0,
                    build: buildFullAcountList, servicename: "Management", methodname: "GetFullOrderStatement", print: params.print, selectCase: params.selectCase
                });
            }

            //        $con.find("#PageSize").off().on('change', function () {
            //            getFullAcountList(container, { container: container, callbackmethod: getFullAcountList, fname: "", page_index: 0,
            //                build: buildFullAcountList, servicename: "Management", methodname: "GetFullOrderStatement", print: params.print, selectCase: params.selectCase
            //            });
            //        });


            bindHierarchyData({ id: "hr_s_Category", table: "category", container: container, styleclass: "PagingSelect " });
            $con.find('#moreFilter').slideUp('fast');
            $con.find('.toggle-more-filters').click(function () {
                $(this).toggleClass("open")
                $con.find('#moreFilter').slideToggle(function () {
                    // Animation complete.
                });
            });
            $con.find(".icon_clear").unbind('click').click(function () { $con.find("#customerOnSelect").html(""); });
            ChangeCheckBoxGroupName("Check", container);
            $con.find("#txtInvoiceDateStart" + container).datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#txtInvoiceDateEnd' + container).datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#btnPrint").off().on('click', function () {
                //                PrintPaymentDetails(container);
                PrintAccountingDetails(container, "daybookClientPrint");
                //                PrintClientStatement(container);
                //            getFullAcountList(container, { container: container, callbackmethod: getFullAcountList, fname: "", page_index: 0,
                //                build: buildFullAcountList, servicename: "Management", methodname: "GetFullOrderStatement", print: true
                //            });
            }).button({ icons: {
                primary: "ui-icon-print"
            },
                text: true
            });


            $con.find("#txtInvoiceDateEnd" + container).datepicker({ changeMonth: true, changeYear: true });
            //Payment Details
            $con.find("#DetailPaymentList" + container).dialog({ autoOpen: false }).dialog({ width: 750 });
            $con.find("#DetailPaymentList").attr("id", "DetailPaymentList" + container);
            //Transfer Money
            $con.find("#transferMoney").attr("id", "transferMoney" + container);
            //Invoice Details
            $con.find("#dialog").attr("id", "dialog" + container);
            //Voucher Details & edit
            $con.find("#voucherDetailsList").attr("id", "voucherDetailsList" + container);
            $con.find("#voucherDetailsList" + container).dialog({ autoOpen: false }).dialog({ width: 750 });
            $con.find("#DialogEditVoucherAmount").attr("id", "editvoucher" + container);
            //Expense Details
            $con.find("#expense").attr("id", "expense" + container);
            //Order Edit Dialog
            $con.find("#DialogEditAccount").attr("id", "editOrder" + container);
            //Expense Edit Dialog
            $con.find("#dialogAddExpense").attr("id", "editExpense" + container);
            //Salary Edit Dialog
            $con.find("#dialogAddSalary").attr("id", "editSalary" + container);
            //Social Edit Dialog
            $con.find("#dialogAddSocial").attr("id", "editSocial" + container);
            $con.find("#dialogAdd").attr("id", "dialogAdd" + container);
        }

    }
    //Accounting
    function loadAccounting(container, first) {
        var $con = $("#" + container);
        if (first) {
            bindItemsForSelectCombo({ async: false, methodname: "getAccountType", servicename: "Management", id: "ddl_AccountType", container: container, headertext: "انتخاب کارمند" });
        }
        AccountFullAcc(container, first, { print: false, selectCase: "Accounting" });
    }
    //Full account
    function loadFullAcountReport(container, first) {
        AccountFullAcc(container, first, { print: false, selectCase: "GetItemList" });
        if (first) {
            aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "Management", id: "txt_customer", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_customer", fname: customerOnSelect });
        }
    }

    function getAcountList(container, params) {
        var $con = $("#" + container);
        if (params.page_index > 0) {
            params.first = false;
        }
        var name = "", code = "", EmployeeId = "", EmployeeName = "", Shop = "",
        InvoiceId = "", ProductId = "", ProductName = "", Barcode = "", PriceFrom = "", PriceTo = "", Category = "", Serial = "",
        sell = "", preOrder = "", Broken = "", InvoiceDateStart = "", InvoiceDateEnd = "",
        BankName = "", DueDateFrom = "", DueDateTo = "";
        //----
        search = $con.find("#ddlSearchBy2").val();
        if (search != "") {
            if (search == "InvoiceId") {
                InvoiceId = $con.find("#txtSearch2").val();
            }
            if (search == "ProductId") {

                ProductId = $con.find("#txtSearch2").val();
            }
            if (search == "ProductName") {

                ProductName = $con.find("#txtSearch2").val();
            }
            if (search == "Barcode") {

                Barcode = $con.find("#txtSearch2").val();
            }
        }
        //----
        if ($con.find("#Checkbox1" + container).prop('checked') && $con.find("#Checkbox2" + container).prop('checked'))
            sell = "";
        else if (!$con.find("#Checkbox1" + container).prop('checked') && $con.find("#Checkbox2" + container).prop('checked'))
            sell = false;
        else if ($con.find("#Checkbox1" + container).prop('checked') && !$con.find("#Checkbox2" + container).prop('checked'))
            sell = true;
        if ($con.find("#Checkbox3" + container).length > 0)
            preOrder = $con.find("#Checkbox3" + container).prop('checked');
        if ($con.find("#Checkbox4" + container).length > 0)
            Broken = $con.find("#Checkbox4" + container).prop('checked');

        var search = $con.find("#ddlSearchBy1").val();
        if ($con.find("#moreFilter").is(":visible")) {
            alert("here");
            //----
            Category = getHierarchySelectedValue("hr_s_Category", container);
            //----
            if (search != "") {
                if (search == "Code") {
                    code = $con.find("#txtSearch1").val();
                } if (search == "Name") {

                    name = $con.find("#txtSearch1").val();
                } if (search == "EmployeeId") {

                    EmployeeId = $con.find("#txtSearch1").val();
                } if (search == "EmployeeName") {

                    EmployeeName = $con.find("#txtSearch1").val();
                }
            }
            //----
            BankName = $con.find("#ddlBank").val();
            Serial = $con.find("#txtSerial").val();
            //----
            InvoiceDateStart = $con.find("#txtInvoiceDateStart" + container).val();
            InvoiceDateEnd = $con.find("#txtInvoiceDateEnd" + container).val();
            DueDateFrom = $con.find("#txtDueDateFrom").val();
            DueDateTo = $con.find("#txtDueDateTo").val();
            //----
            PriceFrom = $con.find("#txt_s_PriceFrom").val();
            PriceTo = $con.find("#txt_s_PriceTo").val();
        }

        var DTO = { 'sort': sortid, 'supplierid': $con.find("#hd_d_PersonId").val(), 'IsClient': $con.find("#hd_d_IsClient").val(),
            'SupplierName': name, 'code': code, 'EmployeeId': EmployeeId, 'EmployeeName': EmployeeName, 'Shop': Shop,
            'InvoiceId': InvoiceId, 'ProductId': ProductId, 'ProductName': ProductName, 'Barcode': Barcode,
            'InvoiceDateStart': InvoiceDateStart, 'InvoiceDateEnd': InvoiceDateEnd,
            'PriceFrom': PriceFrom, 'PriceTo': PriceTo, 'Order': sell,
            'PreOrder': preOrder, 'Broken': Broken, 'CategoryId': Category, 'shopid': $("#userDefault").find("#ddl_s_Branch").val(),
            'counterId': $("#userDefault").find("#ddl_m_Counter").val(), 'BankName': BankName, 'Serial': Serial,
            'dueDateFrom': DueDateFrom, 'dueDateTo': DueDateTo,
            'pay': ($con.find("#Checkbox5" + container).length > 0 ? $con.find("#Checkbox5" + container).prop('checked') : ""),
            'receive': ($con.find("#Checkbox6" + container).length > 0 ? $con.find("#Checkbox6" + container).prop('checked') : ""),
            'cash': ($con.find("#Checkbox7" + container).length > 0 ? $con.find("#Checkbox7" + container).prop('checked') : ""),
            'cheque': ($con.find("#Checkbox8" + container).length > 0 ? $con.find("#Checkbox8" + container).prop('checked') : ""),
            'voucher': ($con.find("#Checkbox9" + container).length > 0 ? $con.find("#Checkbox9" + container).prop('checked') : ""),
            'passed': ($con.find("#Checkbox10" + container).length > 0 ? $con.find("#Checkbox10" + container).prop('checked') : ""),
            'notpass': ($con.find("#Checkbox11" + container).length > 0 ? $con.find("#Checkbox11" + container).prop('checked') : "")
        };

        params["DTO"] = DTO;
        pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
            first: true, isOrder: true
        });
    }
    //Full Account
    function getFullAcountList(container, params) {
        var $con = $("#" + container);
        if (params.page_index > 0)
            params.first = false;
        var name = "", customerName = "", customerCode = "", EmployeeCode = "", EmployeeName = "", Shop = "",
        InvoiceNumber = "", PriceFrom = "", PriceTo = "", confirmerCode = "", confirmerName = "", categoryId = "", barcode = "",
        sell = "", InvoiceDateStart = "", InvoiceDateEnd = "", confirmed = "", isDebtor = "", accountType = "";
        //----
        customerCode = $con.find("#txt_customer").length > 0 ? $con.find("#txt_customer").val() : "";
        //----
        search = $con.find("#ddlSearchBy2").val();
        if (search != "") {
            //        if (search == "customerCode") {
            //            customerCode = $con.find("#txtSearch2").val();
            //        }
            //        if (search == "customerName") {

            //            customerName = $con.find("#txtSearch2").val();
            //        }
            if (search == "EmployeeCode") {

                EmployeeCode = $con.find("#txtSearch2").val();
            }
            if (search == "EmployeeName") {

                EmployeeName = $con.find("#txtSearch2").val();
            }
            if (search == "confirmerCode") {

                confirmerCode = $con.find("#txtSearch2").val();
            }
            if (search == "confirmerName") {

                confirmerName = $con.find("#txtSearch2").val();
            }
            if (search == "InvoiceNumber") {

                InvoiceNumber = $con.find("#txtSearch2").val();
            }
        }
        //----
        InvoiceDateStart = $con.find("#txtInvoiceDateStart" + container).val();
        InvoiceDateEnd = $con.find("#txtInvoiceDateEnd" + container).val();
        if ($con.find("#moreFilter").is(":visible")) {

            //----
            PriceFrom = $con.find("#txt_s_PriceFrom").val();
            PriceTo = $con.find("#txt_s_PriceTo").val();
            //----
            confirmed = $con.find("#selectStatus").val();
            isDebtor = $con.find("#selectAmountStatus").val();
            accountType = $con.find("#ddl_AccountType").length > 0 ? $con.find("#ddl_AccountType").val() : "";
            categoryId = getHierarchySelectedValue("hr_s_Category", container);
            barcode = $con.find("#txt_s_ProductCode").val();
        }

        var DTO = {
            'sort': sortid,
            'supplierid': $con.find("#hd_d_PersonId").val(),
            'IsClient': $con.find("#hd_d_IsClient").val(),
            'SupplierName': name,
            'code': customerCode,
            'customerName': customerName,
            'EmployeeId': EmployeeCode,
            'EmployeeName': EmployeeName,
            'Shop': Shop,
            'InvoiceId': InvoiceNumber,
            'InvoiceDateStart': InvoiceDateStart, 'InvoiceDateEnd': InvoiceDateEnd,
            'PriceFrom': PriceFrom, 'PriceTo': PriceTo,
            'Order': ($con.find("#Checkbox7" + container).length > 0 ? $con.find("#Checkbox7" + container).prop('checked') : ""),
            'shopid': $("#userDefault").find("#ddl_s_Branch").val(),
            'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
            'sell': ($con.find("#Checkbox1" + container).length > 0 ? $con.find("#Checkbox1" + container).prop('checked') : ""),
            'buy': ($con.find("#Checkbox2" + container).length > 0 ? $con.find("#Checkbox2" + container).prop('checked') : ""),
            'voucher': ($con.find("#Checkbox5" + container).length > 0 ? $con.find("#Checkbox5" + container).prop('checked') : ""),
            'payment': ($con.find("#Checkbox3" + container).length > 0 ? $con.find("#Checkbox3" + container).prop('checked') : ""),
            'transfer': ($con.find("#Checkbox4" + container).length > 0 ? $con.find("#Checkbox4" + container).prop('checked') : ""),
            'notTransfer': ($con.find("#Checkbox12" + container).length > 0 ? $con.find("#Checkbox12" + container).prop('checked') : ""),
            'expense': ($con.find("#Checkbox6" + container).length > 0 ? $con.find("#Checkbox6" + container).prop('checked') : ""),
            'passed': ($con.find("#Checkbox10" + container).length > 0 ? $con.find("#Checkbox10" + container).prop('checked') : ""),
            'notPassed': ($con.find("#Checkbox11" + container).length > 0 ? $con.find("#Checkbox11" + container).prop('checked') : ""),
            'confirmed': ($con.find("#Checkbox8" + container).length > 0 ? $con.find("#Checkbox8" + container).prop('checked') : ""),
            'notConfirmed': ($con.find("#Checkbox9" + container).length > 0 ? $con.find("#Checkbox9" + container).prop('checked') : ""),
            'isDebtor': isDebtor, 'categoryId': categoryId, 'barcode': barcode, 'accountType': accountType
        };
        params["DTO"] = DTO;
        pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
            first: true, isOrder: true
        });
    }

    function buildAcountList(jq, container) {
        var $con = $("#" + container.pagingContainer);
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "employee", sort: "p_person.Family", width: "10%" });
        lsth.push({ title: "customer", sort: "p_person1.Family", width: "10%" });
        lsth.push({ title: "date", sort: "Date", width: "10%" });
        lsth.push({ title: "accountDescription", width: "10%" });
        lsth.push({ title: "debtor", sort: "Amount", footer: jq.sumDebtor, width: "10%" });
        lsth.push({ title: "creditor", sort: "Amount", footer: jq.sumCreditor, width: "10%" });
        lsth.push({ title: "balanceAmount", footer: (jq.sumDebtor * 1) - (jq.sumCreditor * 1), width: "10%" });
        lsth.push({ title: "store", sort: "inv_Shop.Name", width: "10%" });
        lsth.push({ title: "counter", sort: "counterid", width: "10%" });
        if (!container.params.print)
            lsth.push({ title: "details", width: "10%" });
        var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
        var ItemList = "";
        if (List != null)
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                var trBody = {};
                if (!container.params.print)
                    trBody[0] = { trId: val.id };
                trBody[1] = { name: "employee", html: val.employee, width: "10%" };
                trBody[2] = { name: "customer", html: val.client, width: "10%" };
                trBody[3] = { name: "date", html: val.date, width: "10%" };
                trBody[4] = { name: "description", html: val.inOrderOf, width: "10%" };
                trBody[5] = { name: "Debtor", html: val.isSell == true ? val.amount : "", width: "10%" };
                trBody[6] = { name: "Creditor", html: val.isSell == true ? "" : val.amount, width: "10%" };
                trBody[7] = { name: "balance", html: val.balance, width: "10%" };
                trBody[8] = { name: "shop", html: val.shopName, width: "10%" };
                trBody[9] = { name: "counter", html: val.counterCode, width: "10%" };
                lstb.push(trBody);
            }

        if (container.params.print) {
            table = { header: lsth, body: lstb, details: { detailsFunction: AcountDetails }, heigth: 300,
                container: container.pagingContainer, divName: "Div_Print", hasFooter: true
            };
            buildPrintTable(table);
            container.params.print = false;
        }
        else {
            table = { header: lsth, body: lstb, details: { detailsFunction: AcountDetails }, heigth: 300,
                container: container.pagingContainer, divName: "acountReportlist", hasFooter: true
            };
            buildTable(table);
        }
    }
    //Full Account
    function buildFullAcountList(jq, container) {
        var $con = $("#" + container.pagingContainer);
        $con.find("#divFooter").removeClass("invisible")
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "employee", sort: "p_person.Family", width: "7%" });
        lsth.push({ title: "customer", sort: "p_person1.Family", width: "7%" });
        lsth.push({ title: "date", sort: "Date", width: "8%" });
        lsth.push({ title: "accountDescription", width: "7%" });
        lsth.push({ title: "debtor", sort: "Amount", width: "10%" });
        lsth.push({ title: "creditor", sort: "Amount", width: "10%" });
        lsth.push({ title: "balanceAmount", width: "12%" });
        lsth.push({ title: "invoiceNumber", sort: "InvoiceNO", width: "8%" });
        lsth.push({ title: "confirm", sort: "p_Employee.p_Person.Family", width: "7%" });
        lsth.push({ title: "store", sort: "inv_Shop.Name", width: "6%" });
        lsth.push({ title: "counter", sort: "counterid", width: "6%" });
        if (!container.params.print) {
            lsth.push({ title: "print", width: "4%" });
            lsth.push({ title: "edit", width: "4%" });
            lsth.push({ title: "details", width: "4%" });
        }
        var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
        var ItemList = "";
        if (List != null)
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                var trBody = {};
                if (!container.params.print)
                    trBody[0] = { trId: val.id, trName: val.detail };
                trBody[1] = { name: "employee", html: val.employee, width: "7%" };
                trBody[2] = { name: "customer", html: " <span class='cursor' name='subTab'  menuName='a_CustomerList' id='" + val.ClientId + "'>" + val.client + "</span>" + " <input type='hidden' id='hd_code' value='" + val.clientCode + "'/><input type='hidden' id='hd_clientId' value='" + val.ClientId + "'/>", width: "7%" };
                trBody[3] = { props: { datedigit: ToPersianDateDigitYearRight(val.date), date: val.date, name: "date", width: "8%", klass: "dateLong" }, html: val.date };
                trBody[4] = { name: "description", html: "<span>" + val.inOrderOf + "</span>" + " <input type='hidden' id='hd_categoryId' value='" + val.categoryId + "'/><input type='hidden' id='hd_description' value='" + val.Description + "'/><input type='hidden' id='hd_salaryFromDate' value='" + val.salaryFromDate + "'/><input type='hidden' id='hd_salaryToDate' value='" + val.salaryToDate + "'/><input type='hidden' id='hd_monthId' value='" + val.Month + "'/><input type='hidden' id='hd_fixSalary' value='" + val.fixSalary + "'/><input type='hidden' id='hd_commission' value='" + val.commission + "'/>", width: "7%" };
                trBody[5] = { html: val.isSell == true ? val.amount : "", props: { name: "Debtor", klass: "digit", style: "font-size:1em;", width: "10%"} };
                trBody[6] = { html: val.isSell == true ? "" : "<span>" + val.amount + "</span>" + " <input type='hidden' id='hd_commission' value='" + val.commission + "'/>", props: { name: "Creditor", style: "font-size:1em;", klass: "digit", width: "10%"} };
                trBody[7] = { name: "balance", html: val.balance, width: "12%" };
                trBody[8] = { name: "InvoiceNO", html: val.InvoiceNO, width: "8%" };
                trBody[9] = { name: "confirmer", html: (val.ConfirmerId == null ? "<button id='btnConfirm'>تایید</button>" : val.confirmer), width: "7%" };
                trBody[10] = { name: "shop", html: val.shopName, width: "6%" };
                trBody[11] = { name: "counter", html: val.counterCode, width: "6%" };
                lstb.push(trBody);
            }
        $con.find("#spDeptor").html(jq.sumDebtor);
        $con.find("#spCreditor").html(jq.sumCreditor);
        $con.find("#spBalance").html(Math.round((jq.sumDebtor * 1) - (jq.sumCreditor * 1), 1));
        $con.find("#spNotPassedCheque").html(jq.sumNotPassed);
        $con.find("#spNetBalance").html(Math.round((jq.sumDebtor * 1) - (jq.sumCreditor * 1) - (jq.sumNotPassed * 1), 1));
        if (container.params.print) {
            table = { header: lsth, body: lstb, heigth: 300,
                container: container.pagingContainer, divName: "Div_Print", hasFooter: false
            };
            buildPrintTable(table);
            container.params.print = false;
        }
        else {
            table = { header: lsth, body: lstb, details: { detailsFunction: FullAcountDetails, editFunction: EditFullAccount, confirmFunction: ConfirmFullAccount, printFunction: PrintFullAccount }, heigth: 300,
                container: container.pagingContainer, divName: "acountReportlist", hasFooter: false
            };
            buildTable(table);
        }
    }

    function PrintFullAccount(dis, container) {
        var $con = $("#" + container);
        //        if ($dis.parents("tr").attr("name") == "order" || $dis.parents("tr").attr("name") == "payment") {
        if ($(dis).parents("tr").attr("name") == "payment")
            PrintPaymentDetails(container, $(dis).parents("tr").prop("id").replace("tr", ""));
        else {
            if ($con.find("#Div_PrintFactor").html().length < 10) {
                $con.find("#Div_PrintFactor").load("Report/PrintInvoice.htm", function () {
                    getDataPrint($(dis).parents("tr").prop("id").replace("tr", ""), container);
                });
            }
            else
                getDataPrint($(dis).parents("tr").prop("id").replace("tr", ""), container);
        }

    }
    //Full Account
    function ConfirmFullAccount(dis, container) {
        $con = $("#" + container);
        $dis = $(dis);
        var DTO = { 'orderHeaderId': $dis.parents("tr").prop("id").replace("tr", "") };
        $.ajax({
            type: "POST",
            url: "Management/ConfirmFullAccount",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response != null && response.isdone == true) {
                    getFullAcountList(container, { container: container, callbackmethod: getFullAcountList, fname: "", page_index: 0,
                        build: buildFullAcountList, servicename: "Management", methodname: "GetFullOrderStatement", print: false
                    });
                }
                //$dis.parent().html(response.name + " " + response.family);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    //Full Account
    function EditFullAccount(dis, container) {
        if ($(dis).parents("tr").attr("name") == "order") {
            var b = $(dis).closest('tr').attr('id');
            var InvoiceNO = $(dis).closest('tr').find('[name=InvoiceNO]').text();
            var id = b.substring(2, b.length);
            var $con = $("#" + container);
            createSubTab({ name: "a_EditOrder", tabName: InvoiceNO, id: id });
        }
    }

    function loadEditFastOrder(id, container, first) {

        loadOrder(0, container, GetItemOrder, false, false, first, { isfastorder: true });
        GetItemEditFastOrder(container, id);
    }

    function GetItemEditFastOrder(container, id) {
        var $con = $("#" + container);
        $con.find("#div_OrderDate").removeClass('hidden');
        $con.find("#div_payamount").addClass('hidden');
        $con.find("#OrderList").html("");
        $con.find("#txt_m_OrderDate").attr("id", container + "txt_m_OrderDate");
        $con.find("#" + container + "txt_m_OrderDate").datepicker({ changeMonth: true, changeYear: true });
        $con.find("#hi_orderHeaderId").val(id);
        var DTO = { 'id': id };
        $.ajax({
            type: "POST",
            data: JSON.stringify(DTO),
            url: "Management/GetEditDetailInvoice",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                $con.find("#" + container + "txt_m_OrderDate").val(ToPersianDateDigitYearRight(response.Date));
                $con.find("#txt_s_ProductBarcode").val("");
                if (response.length < 1)
                    return;

                if (response.iscustomer == true) {
                    //                $con.find("#txt_s_Person").unbind();
                    aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "Management", id: "txt_s_Person", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_s_Person", fname: customerOnSelect });
                }
                else {
                    //                $con.find("#txt_s_Person").unbind();
                    aComplete({ methodname: "GetCompletionListBySupplierName", servicename: "Management", id: "txt_s_Person", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_s_Person", fname: customerOnSelect });
                }
                $con.find("#txt_vat").val(response.VatAmount);
                $con.find("#txt_m_InvoiceNumber").val(response.InvoiceNO);
                $con.find("#txt_m_TotalPrice").val(response.Amount);
                $con.find("#txt_m_Description").val(response.Description);
                $con.find("#txt_m_PaymentAmount").addClass("invisible");

                for (var i = 0; i < response.result.length; i++) {
                    var rec = response.result[i];
                    var ItemList = "";
                    var priceType = "";
                    obj = rec.priceType;

                    for (var name in obj) {
                        var value = obj[name];
                        var p = 0;
                        if (value == null)
                            p = rec.priceType.basePrice;
                        else
                            p = value;
                        priceType += "<option value='" + p + "'>" + p + " " + name + "</option>";
                    }

                    var trid = "tr" + i + "_" + container + "_" + rec.BarcodeId + "_" + rec.Quantity;
                    ItemList += "<tr id='" + trid + "'>" +
                                                    "<td width='3%' id='rownumber'></td>" +
                                                        "<td width='20%'><a href='javascript:showQuantity(\"" + container + "\",\"" + rec.barcode + "\");'>" + rec.Name + " " + rec.code + " " + rec.barcode + "</a></td>" +
                                                        "<td width='6%' id='Color_'>" +
                                                                    " <select   id='ddl_m_Color_" + trid + "' disabled='disabled' class='select55 ' ></select>" +
                                                                    "</td>" +
                                                                     "<td width='6%' id='Color_'>" +
                                                                   "<select   id='ddl_m_Size_" + trid + "' disabled='disabled' class='select55 '></select>" +
                                                                    "</td>" +
                                                                     "<td width='6%' id='Color_'>" +
                                                                    " <select   id='ddl_m_measureunit_" + trid + "' disabled='disabled' class='select55 '></select>" +
                                                                    "</td>" +
                                                                     "<td width='10%' id='Color_'> <select   id='ddl_m_priceType_" + trid + "'  class='select95'>" + priceType + "</select></td>" +
                                                       "<td width='7%'><input type='text'  id='txt_m_Quantity' VALUE='" + rec.Quantity + "' class='inputW34 fontSize15'  /></td>" +
                                                        "<td width='11.5%'><input type='text'  id='txt_m_Price' class='inputW80 fontSize15' value='" + Math.abs(rec.Price) + "' /></td>" +
                                                        "<td width='7%'><input type='text'  id='txt_m_TotalQuantity' VALUE='" + rec.Quantity + "' class='inputW50 fontSize15'   disabled='disabled'/></td>" +
                                                        "<td width='9%'><input  class='inputW80 fontSize15 digit' VALUE='" + (rec.Quantity * Math.abs(rec.Price)) + "' price='" + (rec.Quantity * Math.abs(rec.Price)) + "' type='text' id='txt_m_TotalItemPrice' disabled='disabled'/></td>" +
                                                        "<td width='11%'> <input class='inputW100 fontSize15' type='text' id='txt_m_Serial'/></td>" +
                    "<td width='2.5%' id='delete'><span title='حذف' name='deleteOrder' class='cursor ui-icon ui-icon-closethick'></span></td></tr>";


                    $con.find("#OrderList").append(ItemList).parent().tableScroll({ height: 380, width: $con.width() - 85, flush: false });

                    $con.find("[name=deleteOrder]").unbind().click(function () {
                        if (confirm("آیا از حذف مطمئن هستید؟"))
                            RemoveItemOrderElement($(this).parents("tr").first().prop("id"), container, true);
                        else
                            return;
                    });

                    $("#" + trid).find("[id=txt_m_Quantity]").spinner({ change: function () {
                        SumPrice($(this).parents("tr").attr("id"), container);
                    },
                        stop: function () {
                            SumPrice($(this).parents("tr").attr("id"), container);
                        }
                    });
                    $("#" + trid).find("[id=txt_m_Price]").spinner({ step: 1000, change: function () {
                        SumPrice($(this).parents("tr").attr("id"), container);
                    },
                        stop: function () {
                            SumPrice($(this).parents("tr").attr("id"), container);
                        }
                    });

                    $("#" + trid).find("#txt_m_Price").unbind("keydown").bind('keydown', function (e) {
                        if (e.keyCode == 40) {
                            $(this).parent().parent().next().find("#txt_m_Price").focus().focus(function () { this.select() });
                        }
                        if (e.keyCode == 38) {
                            $(this).parent().parent().prev().find("#txt_m_Price").focus().focus(function () { this.select() });
                        }
                    });
                    $("#" + trid).find("#txt_m_Quantity").unbind("keydown").bind('keydown', function (e) {
                        if (e.keyCode == 40) {
                            $("#" + trid).next().find("#txt_m_Quantity").focus().focus(function () { this.select() });
                        }
                        if (e.keyCode == 38) {
                            $("#" + trid).prev().find("#txt_m_Quantity").focus().focus(function () { this.select() });
                        }
                    });

                    bindComboData({ id: "ddl_m_measureunit_" + trid, container: trid, isMeasureUnit: true }, rec.measureUnits);
                    $("#ddl_m_measureunit_" + trid).change(function () { SumPrice(trid, container); });
                    bindComboData({ id: "ddl_m_Color_" + trid, container: trid, headertext: " رنگ", setcolor: true }, rec.colors);
                    $("#ddl_m_Color_" + trid).change(function () { SelectColorForOrder(trid, this, rec.BarcodeId); });
                    bindComboData({ id: "ddl_m_Size_" + trid, container: trid, headertext: " جزئیات" }, rec.sizes);

                    $("#ddl_m_Size_" + trid).change(function () { SelectColorForOrder(trid, this, rec.BarcodeId); });
                    $("#ddl_m_Color_" + trid).val(rec.Color);
                    $("#ddl_m_Size_" + trid).val(rec.Size);
                    $("#ddl_m_priceType_" + trid).change(function () {
                        $("#" + trid).find("#txt_m_Price").val($(this).val());
                        SumPrice(trid, container);
                    });
                    //                ajDropDown.done(function () {
                    //                    if ($con.find("#ddl_m_Color_" + trid + " option").length < 1)
                    //                        bindItemsForSelectCombo({ methodname: "GetSizeListByBarcodeIdColorId", servicename: "Management", id: "ddl_m_Size_" + trid, container: trid, headertext: " جزئیات" }, { arg: trid.split("_")[2], sarg: $("#userDefault").find("#ddl_s_Branch").val(), targ: "" });
                    //                });
                    //                SelectColorForOrderEdit(trid, rec.barcodeid);
                    // SumPrice(trid, container);


                }
                $con.find("#customerOnSelect").text(response.person);
                $con.find("#txt_s_Person").val(response.code);
                $con.find("#btn_Print").removeClass('invisible');
                $con.find("#btn_AddOrder").removeClass('invisible');
                $con.find("#Footer").removeClass("invisible");
                $con.find("#header").removeClass("invisible");



            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function EditOrder(supplierid, container) {
        var $con = $("#" + container);
        var orderdetails = [];
        var orderheader = {};
        $.each($("#" + container).find("#OrderList").find("tr[id*=tr]"), function () {
            var orderdetail = {};
            var $row = $(this);
            var colorId = $row.find("#ddl_m_Color_" + this.id).val();
            var sizeId = $row.find("#ddl_m_Size_" + this.id).val();
            orderdetail["barcodeid"] = this.id.split("_")[2];
            orderdetail["colorid"] = colorId == null ? "" : colorId;
            orderdetail["sizeid"] = sizeId == null ? "" : sizeId;
            orderdetail["quantity"] = $row.find("#txt_m_TotalQuantity").val();
            orderdetail["price"] = $row.find("#txt_m_Price").val();
            orderdetail["description"] = "";
            orderdetail["serial"] = $row.find("#txt_m_Serial").val();
            orderdetail["broken"] = false;
            if ($con.find("#cbIsChangeQuantity").prop("checked")) {
                orderdetail["status"] = $row.find("#ddl_m_Availability").val();
                orderdetail["broken"] = $row.find("#cb_d_Broken_" + this.id).prop('checked');
            }
            orderdetails.push(orderdetail);
        })
        orderheader["shopid"] = $("#userDefault").find("#ddl_s_Branch").val();
        orderheader["date"] = $con.find("#" + container + "txt_m_OrderDate").val();
        orderheader["currenyid"] = $("#userDefault").find("#ddl_m_Currency").val();
        if ($con.find("#cbIsChangeQuantity").length < 1) {
            orderheader["totalamount"] = $con.find("#txt_m_TotalPrice").val().replace(/,/g, "");
            orderheader["PaymentAmount"] = $con.find("#txt_m_PaymentAmount").val().replace(/,/g, "");

        }
        else {
            orderheader["setPayment"] = $con.find("#cbSetPayment").prop("checked");
        }
        orderheader["description"] = $con.find("#txt_m_Description").val();
        orderheader["invoicenumber"] = $con.find("#txt_m_InvoiceNumber").val();
        orderheader["clientCode"] = $con.find("#txt_s_Person").val();
        if ($con.find("#hd_s_Person").val() != undefined)
            supplierid = $con.find("#hd_s_Person").val();
        orderheader["customerid"] = supplierid;
        orderheader["issell"] = !$con.find("#cb_d_Sale" + container).prop("checked");
        orderheader["ispreorder"] = $con.find("#cb_d_PreOrder" + container).prop("checked");

        var DTO = { 'header': orderheader, 'itemDetails': orderdetails, 'counterId': $("#userDefault").find("#ddl_m_Counter").val(), 'orderHeaderId': $con.find("#hi_orderHeaderId").val(), 'vat': $con.find("#txt_vat").val() };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/EditOrder",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.alert != undefined) {
                    SetInvoiceData(container, response);
                    // getDataPrint(response.OrderHeaderId, container)
                    translate(response.alert);
                    if (response.InvoiceNO != undefined) {
                        //   $con.find("#OrderList").html("");
                        $con.find("#btn_Print").removeClass('invisible');
                        // $con.find("#btn_AddOrder").addClass('invisible');
                        //  $con.find("#txt_m_InvoiceNumber").val(response.InvoiceNO);
                    }
                }
                else
                    translate(response.msg);

            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    //Full Account
    function EditVoucherFullAccount(dis, container) {
        var $con = $("#" + container);
        var $dis = $(dis);
        var $dialog = $("#editvoucher" + container);
        $dialog.find("#txt_voucherAmount").val($dis.parents("tr").find("[name=Debtor]").html() != "" ? $dis.parents("tr").find("[name=Debtor]").html().replace(/,/g, "") : $dis.parents("tr").find("[name=Creditor]").html().replace(/,/g, ""));

        $dialog.find("#btn_editVoucherAmount").button({
            icons: {
                primary: "ui-icon-disk"
            }
        }).unbind().click(function () {
            if (UpdateVoucherAmount($dis.parents("tr").prop("id").replace("tr", ""), container)) {

            }
        });
        $dialog.dialog(open).dialog({ width: 400, modal: true });
        localize();
    }
    //Full Account
    function EditOrderFullAccount(dis, container) {
        var $con = $("#" + container);
        var $dis = $(dis);
        var $dialog = $("#editOrder" + container);
        $dialog.find("#txtAmount").val($dis.parents("tr").find("[name=Debtor]").html() != "" ? $dis.parents("tr").find("[name=Debtor]").html().replace(/,/g, "") : $dis.parents("tr").find("[name=Creditor]").html().replace(/,/g, "")).parent("li").removeClass("hidden");
        $dialog.find("#txtDate").val($dis.parents("tr").find("[name=date]").attr("datedigit")).datepicker();
        //    $dialog.find("#txtCustomer").val($dis.parents("tr").find("#hd_code").val());
        //    aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "Management", id: "txtCustomer", container: $dialog.prop("id"), minlength: 2, autofocus: false, limit: 20, boxId: "txtCustomer" });
        $dialog.find("#btnEditAccount").button({
            icons: {
                primary: "ui-icon-disk"
            }
        }).unbind().click(function () {
            if (UpdateOrderFullAccount($dis.parents("tr").prop("id").replace("tr", ""), container)) {

            }
        });
        $dialog.dialog(open).dialog({ width: 400, modal: true });
        localize();
    }

    function EditPaymentFullAccount(dis, container) {
        var $con = $("#" + container);
        var $dis = $(dis);
        var $dialog = $("#editOrder" + container);
        $dialog.find("#txtAmount").parent("li").addClass("hidden");
        //    $dialog.find("#txtAmount").val($dis.parents("tr").find("[name=Debtor]").html() != "" ? $dis.parents("tr").find("[name=Debtor]").html().replace(/,/g, "") : $dis.parents("tr").find("[name=Creditor]").html().replace(/,/g, ""));
        $dialog.find("#txtDate").val($dis.parents("tr").find("[name=date]").attr("datedigit")).datepicker();
        //    $dialog.find("#txtCustomer").val($dis.parents("tr").find("#hd_code").val());
        //    aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "Management", id: "txtCustomer", container: $dialog.prop("id"), minlength: 2, autofocus: false, limit: 20, boxId: "txtCustomer" });
        $dialog.find("#btnEditAccount").button({
            icons: {
                primary: "ui-icon-disk"
            }
        }).unbind().click(function () {
            if (UpdatePaymentFullAccount($dis.parents("tr").prop("id").replace("tr", ""), container)) {

            }
        });
        $dialog.dialog(open).dialog({ width: 400, modal: true });
        localize();
    }
    //Full Account
    function EditExpenseFullAccount(dis, container) {
        var $row = $(dis).parents("tr");
        var id = $row.find("#hd_categoryId").val();
        var $con = $("#" + container);
        var $dialog = $("#editExpense" + container);
        $dialog.find("#divExpenseCategoryAdd").html("");
        $con.find("#btn_saveExpense").button({
            icons: {
                primary: "ui-icon-disk"
            }
        }).unbind().click(function () {
            if (validateAll($con.find("#dialogAddExpense")))
                EditExpense($row.prop("id").replace("tr", ""), $dialog.prop("id"));
        });
        $dialog.find("#divExpenseCategoryAdd").html("");
        bindHierarchyData({ id: "divExpenseCategoryAdd", container: "editExpense" + container, table: "ExpenseCategory", canmodify: true, parentid: id, css: "selectsmall1 required validate" });
        $dialog.find("#txt_m_amount_add").val($row.find("[name=Debtor]").html().replace(/,/g, ""));
        $dialog.find("#txt_m_description_add").val($row.find("#hd_description").val());
        $dialog.dialog({ autoOpen: true });
    }
    //Full Account
    function EditSalaryFullAccount(dis, container) {
        var $row = $(dis).parents("tr");
        var $dialog = $("#editSalary" + container);
        $dialog.find("#btn_save").button({
            icons: {
                primary: "ui-icon-disk"
            }
        }).unbind().click(function () {
            if (validateAll($con.find("#editSalary" + container)))
                EditEmployeeSalary($dis.parents("tr").prop("id").replace("tr", ""), "editSalary" + container);
        });
        bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "Management", id: "ddl_m_employee_add", container: "editSalary" + container, headertext: "انتخاب کارمند" });
        $dialog.find("#ddl_m_employee_add").val($row.find("#hd_clientId").val());
        $dialog.find("#txt_m_fromDate_add").val($row.find("#hd_salaryFromDate").val());
        $dialog.find("#txt_m_toDate_add").val($row.find("#hd_salaryToDate").val());
        $dialog.find("#txt_m_fixSalary_add").val($row.find("#hd_fixSalary").val());
        //    $dialog.find("#txt_m_fixSalary_add").val(($row.find("[name=Creditor]").find("span").html() * 1) - ($row.find("#hd_commission").val() * 1));
        $dialog.find("#txt_m_commission_add").val($row.find("#hd_commission").val());
        $dialog.find("#txt_salary_description_add").val($row.find("#hd_description").val());
        $dialog.find("#txt_m_fromDate_add").datepicker({ changeMonth: true, changeYear: true,
            onSelect: function (dateText, inst) {
                $('#txt_m_toDate_add').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
            }
        });
        $dialog.dialog(open).dialog({ width: 500 });
    }
    //Full Account
    function EditSocialFullAccount(dis, container) {
        var $row = $(dis).parents("tr");
        var $dialog = $("#editSocial" + container);
        $dialog.find("#btn_saveSocial").button({
            icons: {
                primary: "ui-icon-disk"
            }
        }).unbind().click(function () {
            if (validateAll($con.find("#editSocial" + container)))
                EditSocialSecurity($dis.parents("tr").prop("id").replace("tr", ""), "editSocial" + container);
        });
        bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "Management", id: "ddl_social_employee_add", container: "editSocial" + container, headertext: "انتخاب کارمند" });
        if ($("#Month_Name_Add").html() == "")
            bindXmlDropDownData({ async: false, id: "Month_Name_Add", container: "editSocial" + container, path: "Counter/MonthTitle", canmodify: true, istext: false, headertext: "انتخاب ماه" });
        $dialog.find("#ddl_social_employee_add").val($row.find("#hd_clientId").val());
        $dialog.find("#txt_social_amount_add").val($row.find("[name=Debtor]").html().replace(/,/g, ""));
        //$dialog.find("#txt_social_amount_add").val($row.find("[name=Debtor]").find("span").html());
        $dialog.find("#Month_Name_Add select").val($row.find("#hd_monthId").val());
        $dialog.find("#txt_social_description_add").val($row.find("#hd_description").val());
        $dialog.dialog(open).dialog({ width: 500 });
    }
    //Full Account
    function UpdateVoucherAmount(orderHeaderId, container) {
        $con = $("#editvoucher" + container);
        var DTO = { 'orderHeaderId': orderHeaderId, 'amount': $con.find("#txt_voucherAmount").val() };
        $.ajax({
            type: "POST",
            url: "Management/EditOrderFullAcount",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                return response.isdone;
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }
    //Full Account
    function UpdateOrderFullAccount(orderHeaderId, container) {
        $con = $("#editOrder" + container);
        var DTO = { 'orderHeaderId': orderHeaderId, 'amount': $con.find("#txtAmount").val(), 'date': $con.find("#txtDate").val() };
        $.ajax({
            type: "POST",
            url: "Management/EditOrderFullAcount",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                alert(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function UpdatePaymentFullAccount(orderHeaderId, container) {
        $con = $("#editOrder" + container);
        var DTO = { 'orderHeaderId': orderHeaderId, 'date': $con.find("#txtDate").val() };
        $.ajax({
            type: "POST",
            url: "Management/EditPaymentFullAcount",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                alert(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }
    //Full Account
    function UpdateExpenseFullAccount(dis, container) {
        $con = $("#edit" + container);
        var DTO = { 'orderHeaderId': orderHeaderID, 'expenseCategory': getHierarchySelectedValue("divExpenseCategoryAdd", container),
            'amount': $con.find("#txt_m_amount_add").val(),
            'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
            'currencyId': $("#userDefault").find("#ddl_m_Currency").val(),
            'description': $con.find("#txt_m_description_add").val(),
            'shopId': $("#userDefault").find("#ddl_s_Branch").val()
        };
        $.ajax({
            type: "POST",
            url: "Management/EditExpenseFullAcount",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                alert(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }
    //Full Account
    function ExpenseDetailsFullAccount(dis, container) {
        var $con = $("#" + container);
        var $dialog = $("#expense" + container);
        var ItemList = "";
        var val = $(dis).parents("tr");
        ItemList += "<tr id='" + val.prop("id") + "'>" +
                "<td name='description' width='90%'>" + "مبلغ " + val.find("[name=Debtor]").html().replace(/,/g, "") + " تومان " + val.find("[name=description]").find("span").html() + "</td>" +
                "<td name='delete' width='10%'><button id='a_Button' >حذف</button></td>" +
                "</tr>";
        $dialog.find("#expenseDetailList").html(ItemList).parent().tableScroll({ height: 380, width: 750, flush: false });
        $dialog.find("[id=a_Button]").button({
            icons: {
                primary: "ui-icon-closethick"
            },
            text: false
        }).click(function () {
            if (confirm("آیا از حذف مطمئن هستید؟"))
                if (DeleteExpense($(this), container))
                    $(dis).parents("tr").remove();
                else
                    return;
        });
        $dialog.dialog({ width: 800 }).dialog("open");
    }

    //Full Account
    function VoucherDetailsFullAccount(orderHeaderId, container) {
        $con = $("#" + container);
        var $dialog = $("#voucherDetailsList" + container);
        $.ajax({
            type: "POST",
            url: "Management/GetVoucherDetailsFullAccount",
            contentType: "application/json; charset=utf-8",
            data: "{orderHeaderId: '" + orderHeaderId + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                jq = response;
                if (jq.msg != undefined && jq.msg == "empty") {
                    $dialog.find("#DetailListVoucher").html("");
                    $dialog.dialog("close");
                    return;
                }
                var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
                var ItemList = "";
                for (var i = 0; i < List.length; i++) {
                    var val = List[0, i];
                    ItemList += "<tr id='tr" + val.OrderHeaderId + "'>" +
                "<td name='number' width='25%'>" + val.Number + "</td>" +
                "<td name='IsValid' width='20%'>" + "<span id='voucherStatus'>" + val.IsValid + "</span>&nbsp;&nbsp;&nbsp;<button id='btnConfirm'>تغییر وضعیت</button></td>" +
                "<td name='ExpieryDate' width='20%'><div id='ExpieryDate'>" + val.ExpieryDate + "</div></td>" +
                "<td name='Amount' width='20%'><div id='Amount'>" + val.Amount + "</div></td>" +
                "<td name='Edit' width='8%'><div><button id='btn_edit' >ویرایش</button></div></td>" +
                "<td name='Delete' width='7%'><div><button id='btn_delete' >حذف</button></div></td>" +
                "</tr>";
                }
                $dialog.find("#DetailListVoucher").html(ItemList).parent().tableScroll({ height: 380, width: 750, flush: false });
                $dialog.find("[id=btnConfirm]").button({
                    icons: { primary: 'ui-icon-check' },
                    text: false
                }).click(function () {
                    ChangeVoucherStatus(this, container);
                });
                $dialog.find("[id=btn_delete]").button({
                    icons: { primary: 'ui-icon-closethick' },
                    text: false
                }).click(function () {
                    if (confirm("آیا از حذف مطمئن هستید؟"))
                        DeleteVoucher(this, container);
                    else
                        return;
                });
                $dialog.find("[id=btn_edit]").button({
                    icons: { primary: 'ui-icon-pencil' },
                    text: false
                }
            ).click(function () {
                ClickDetailVoucher($(this).parents("tr").first(), container);
                $(this).parent("div").addClass("invisible")
            });

                $dialog.dialog({ width: 800 }).dialog("open");
            },
            error: function (response) { alert(response.responseText); }
        });
    }
    //Full Account
    function ClickDetailVoucher($dis, container) {
        var $con = $("#" + container);
        var $dialog = $("#voucherDetailsList" + container);
        onRowClick($dis);
        trid = $dis.prop('id');
        if ($dis.hasClass("rowOnClick") && $dis.find("input:text").length < 2) {
            //Amount txt
            $dis.find("td[name=Amount]").append("<input type='text' id='Amount' class='inputText inputW100 ' value='" + $dis.find("div[id=Amount]").html() + "'/>");
            $dis.find("div[id=Amount]").addClass("invisible");
            //
            $dis.find("td[name=ExpieryDate]").append("<input type='text' id='ExpieryDate' class='inputText inputW100 ' value='" + $dis.find("div[id=ExpieryDate]").html() + "'/>");
            //        $dis.find("input[id=ExpieryDate]").datepicker({ changeMonth: true, changeYear: true });
            $dis.find("div[id=ExpieryDate]").addClass("invisible");
            //
            $dis.find("div[id=delete]").addClass("invisible");
            $dis.find("td[name=Edit]").append("<div id='Edit'><a id='Edit_Button' href='#'>بروز </a></div>");
            //Edit Button
            $dis.find("[id=Edit_Button]").click(function () {
                EditDetailVoucher($dis, container);
            }).button();
            //
            $.each($dialog.find("tr[id*=tr]"), function () {
                if (!$(this).hasClass("rowOnClick")) {
                    $(this).find("input[id=Amount]").remove();
                    $(this).find("input[id=ExpieryDate]").remove();
                    $(this).find("#Edit").remove();
                    $(this).find("div[id=delete]").removeClass("invisible");
                    $(this).find("div").removeClass("invisible");
                }
            });

        }
        else {
            $dis.find("input:text[id!=txt_m_QuantityReturn]").remove();
            $dis.find("select").remove();
            $dis.find("Label[id=Label]").remove();
            $dis.find("#Edit").remove();
            $dis.find("div").removeClass("invisible");
        }
    }
    //Full Account
    function EditDetailVoucher($dis, container) {
        var $con = $("#" + container);
        var DTO = { 'voucherNumber': $dis.find("td[name=number]").html(), 'amount': $dis.find("input[id=Amount]").val(),
            'expieryDate': $dis.find("input[id=ExpieryDate]").val()
        };
        $.ajax({
            type: "POST",
            url: "Management/EditVoucherFullAccount",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone) {
                    $dis.find("div[id=Amount]").html($dis.find("input[id=Amount]").val());
                    $dis.find("div[id=ExpieryDate]").html($dis.find("input[id=ExpieryDate]").val());
                }
                //Amount txt
                $dis.find("input[id=Amount]").remove();
                $dis.find("input[id=ExpieryDate]").remove();
                $dis.find("#Edit").remove();
                $dis.find("div[id=delete]").removeClass("invisible");
                $dis.find("div").removeClass("invisible");
                alert(response.msg);
                //            }
                //SelectDetailInvoice(response, container);
            }
        });
    }
    function EditAccount(dis, container) {
        $con = $("#" + container);
        $dis = $(dis);
    }

    function AcountDetails(dis, container) {
        $con = $("#" + container);
        $dis = $(dis);
        if ($dis.parents("tr").find("[name=counter]").html() != "")
            ListDetailPayment($dis.parents("tr").prop("id").replace("tr", ""), container);
        else
            SelectDetailInvoice($dis.parents("tr").prop("id").replace("tr", ""), "dialog" + container);
    }
    //Full Account
    function FullAcountDetails(dis, container) {
        $con = $("#" + container);
        $dis = $(dis);
        //payment or Transfer
        $("#voucherDetailsList" + container + "," + "#DetailPaymentList" + container + "," + "#dialog" + container + "," + "#expense" + container).dialog().dialog("close");
        if ($dis.parents("tr").attr("name") == "payment")
            ListDetailPayment($dis.parents("tr").prop("id").replace("tr", ""), container);
        //order
        else if ($dis.parents("tr").attr("name") == "order")
            SelectDetailInvoice($dis.parents("tr").prop("id").replace("tr", ""), "dialog" + container);
        //voucher
        else if ($dis.parents("tr").attr("name") == "voucher")
            VoucherDetailsFullAccount($dis.parents("tr").prop("id").replace("tr", ""), container);
        //expense
        else if (($dis.parents("tr").attr("name") == "expense" || $dis.parents("tr").attr("name") == "salary" || $dis.parents("tr").attr("name") == "social"))
            ExpenseDetailsFullAccount($dis, container);
    }
    function loadCustomerAcountReport(customerid, container, first) {
        sortid = "Date desc";
        var $con = $("#" + container);
        $con.find("#hd_d_PersonId").val(customerid);
        if (first) {
            $con.find('#moreFilter').slideUp('fast');
            $con.find('.toggle-more-filters').click(function () {
                $(this).toggleClass("open")
                $con.find('#moreFilter').slideToggle(function () {
                    // Animation complete.
                });
            });
            bindItemsForSelectCombo({ methodname: "GetComboItems", servicename: "XmlDropDown", headertext: "انتخاب بانک", id: "ddlBank", container: container }, { path: 'Counter/BankTitle' });
            ChangeCheckBoxGroupName("Check", container);
            $con.find("#txtInvoiceDateStart").attr("id", "txtInvoiceDateStart" + container);
            $con.find("#txtInvoiceDateEnd").attr("id", "txtInvoiceDateEnd" + container);
            $con.find("#txtInvoiceDateStart" + container).datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#txtInvoiceDateEnd' + container).datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#txtInvoiceDateEnd" + container).datepicker({ changeMonth: true, changeYear: true });

            $con.find("#btnPrint").off().on('click', function () {
                getAcountList(container, { container: container, callbackmethod: getAcountList, fname: "", page_index: 0,
                    build: buildAcountList, servicename: "Management", methodname: "GetInvoiceStatement", print: true
                });
            }).button({ icons: {
                primary: "ui-icon-print"
            },
                text: true
            });

            $con.find("#txtDueDateFrom").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#txtDueDateTo').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#txtDueDateTo").datepicker({ changeMonth: true, changeYear: true });

            bindHierarchyData({ id: "hr_s_Category", table: "category", container: container });
            $con.find("[id=btnSearch]").button({ icons: {
                primary: "ui-icon-search"
            }
            }).unbind('click').click(function () {
                sortid = "date desc";
                getAcountList(container, { container: container, callbackmethod: getAcountList, fname: "", page_index: 0,
                    build: buildAcountList, servicename: "Management", methodname: "GetInvoiceStatement", print: false
                });
            });
        }
        getAcountList(container, { container: container, callbackmethod: getAcountList, fname: "", page_index: 0,
            build: buildAcountList, servicename: "Management", methodname: "GetInvoiceStatement", print: false
        });
        $con.find("#PageSize").off().on('change', function () {
            getAcountList(container, { container: container, callbackmethod: getAcountList, fname: "", page_index: 0,
                build: buildAcountList, servicename: "Management", methodname: "GetInvoiceStatement", print: false
            });
        });
        $con.find("#DetailPaymentList").dialog({ autoOpen: false }).dialog({ width: 750 });
        //    $con.find("#DetailListInvoice").dialog({ autoOpen: false }).dialog({ width: 750 });
        $con.find("#dialog").attr("id", "dialog" + container);
        $con.find("#ddlSearchBy1 option[value='Code']").remove();
        $con.find("#ddlSearchBy1 option[value='Name']").remove();
    }
    //--------------------js order end-----------------------


    //--------------------js Invoice begin-----------------------

    function loadSupplierInvoiceList(Supplierid, container, first) {

        var $con = $("#" + container);
        if (first) {
            $con.find("#blCode").remove();
            $con.find("#hd_d_PersonId").val(Supplierid);
            $con.find("#hd_d_IsClient").val(false);
            AccountFullAcc(container, first, { print: false, selectCase: "GetItemList", onLoad: true });
        }
    }
    function loadCustomerInvoiceList(Supplierid, container, first) {
        var $con = $("#" + container);
        if (first) {
            $con.find("#blCode").remove();
            $con.find("#hd_d_PersonId").val(Supplierid);
            $con.find("#hd_d_IsClient").val(true);
            AccountFullAcc(container, first, { print: false, selectCase: "GetItemList", onLoad: true });
        }
    }

    function loadCustomerAccounting(container, first) {
        var $con = $("#" + container);

        if (first) {
            $con.find("#hd_d_IsClient").val(true);
            aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "Management", id: "txt_customer", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_customer", fname: customerOnSelect });
            AccountFullAcc(container, first, { print: false, selectCase: "GetItemList" });
        }
    }
    function loadSupplierAccounting(container, first) {
        var $con = $("#" + container);

        if (first) {
            $con.find("#hd_d_IsClient").val(false);
            $con.find("#lblClient").html("supplier");
            aComplete({ methodname: "GetCompletionListBySupplierName", servicename: "Management", id: "txt_customer", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_customer", fname: customerOnSelect });
            AccountFullAcc(container, first, { print: false, selectCase: "GetItemList" });
        }
    }
    function loadCustomerOrderProfit(container, first) {
        var $con = $("#" + container);

        if (first) {
            $con.find("#hd_d_IsClient").val(true);
            aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "Management", id: "txt_customer", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_customer", fname: customerOnSelect });
            AccountFullAcc(container, first, { print: false, selectCase: "GetProfitList" });
        }

    }
    function getInvoiceList(container) {
        var $con = $("#" + container);
        var first = true;
        var take = $con.find("#PageSize").val();
        var skip = 0;
        var page_index = 0
        var name = "", code = "", EmployeeId = "", EmployeeName = "", Shop = "", InvoiceId = "", ProductId = "",
    ProductName = "", Barcode = "", PriceFrom = "", PriceTo = "", Category = "", sell = "", preOrder = "", Broken = "";
        var search = $con.find("#ddl_d_SearchBy1").val();
        if ($con.find("#moreFilter").is(":visible")) {
            if (search != "") {
                if (search == "Code") {
                    code = $con.find("#txtSearch1").val();
                } if (search == "Name") {

                    name = $con.find("#txtSearch1").val();
                } if (search == "EmployeeId") {

                    EmployeeId = $con.find("#txtSearch1").val();
                } if (search == "EmployeeName") {

                    EmployeeName = $con.find("#txtSearch1").val();
                }
                if (search == "Shop") {

                    Shop = $con.find("#txtSearch1").val();
                }
            }
            if ($con.find("#txt_s_PriceFrom").length > 0)
                PriceFrom = $con.find("#txt_s_PriceFrom").val();
            if ($con.find("#txt_s_PriceTo").length > 0)
                PriceTo = $con.find("#txt_s_PriceTo").val();

            if ($con.find("#Checkbox1" + container).prop('checked') && $con.find("#Checkbox2" + container).prop('checked'))
                sell = "";
            else if (!$con.find("#Checkbox1" + container).prop('checked') && $con.find("#Checkbox2" + container).prop('checked'))
                sell = false;
            else if ($con.find("#Checkbox1" + container).prop('checked') && !$con.find("#Checkbox2" + container).prop('checked'))
                sell = true;
            if ($con.find("#Checkbox3" + container).length > 0)
                preOrder = $con.find("#Checkbox3" + container).prop('checked');
            if ($con.find("#Checkbox4" + container).length > 0)
                Broken = $con.find("#Checkbox4" + container).prop('checked');
        }
        var search = $con.find("#ddl_d_SearchBy2").val();
        if (search != "") {
            if (search == "InvoiceId") {
                InvoiceId = $con.find("#txtSearch2").val();
            } if (search == "ProductId") {

                ProductId = $con.find("#txtSearch2").val();
            } if (search == "ProductName") {

                ProductName = $con.find("#txtSearch2").val();
            }
            if (search == "Barcode") {

                Barcode = $con.find("#txtSearch2").val();
            }

        }
        Category = getHierarchySelectedValue("hr_s_Category", container);

        var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
            'supplierid': $con.find("#hd_d_PersonId").val(), 'IsClient': $con.find("#hd_d_IsClient").val(),
            'SupplierName': name, 'code': code, 'EmployeeId': EmployeeId, 'EmployeeName': EmployeeName, 'Shop': Shop,
            'InvoiceId': InvoiceId, 'ProductId': ProductId, 'ProductName': ProductName,
            'InvoiceDateStart': ($con.find("#txt_s_InvoiceDateStart").length > 0 ?
                $con.find("#txt_s_InvoiceDateStart").val() : ""), 'Barcode': Barcode,
            'InvoiceDateEnd': ($con.find("#txt_s_InvoiceDateEnd").length > 0 ? $con.find("#txt_s_InvoiceDateEnd").val() :
                 ""), 'PriceFrom': PriceFrom, 'PriceTo': PriceTo, 'Order': sell,
            'PreOrder': preOrder, 'Broken': Broken, 'CategoryId': Category, 'shopid': $("#userDefault").find("#ddl_s_Branch").val(),
            'counterid': $("#userDefault").find("#ddl_m_Counter").val()
        };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/GetInvoiceList",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var opt = InvoicegetOptionsFrom(response.count, container);
                $con.find("#paging").pagination(response.count, opt);
                InvoicepageselectCallback(0, response, container, first);
            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function InvoicegetOptionsFrom(count, container) {
        var $con = $("#" + container);
        var opt = { callback: InvoicepageselectCallback };
        $con.find("input:text").each(function () {
            opt[this.name] = this.className.match(/numeric/) ? parseInt(this.value) : this.value;
        });
        opt.prev_show_always = false;
        opt.next_show_always = false;
        if ((count) < $con.find("#PageSize").val())
            $con.find("#PageSize").css("display", "none");
        else {
            $con.find("#PageSize").css("display", "inline");
        }
        opt.items_per_page = $con.find("#PageSize").val();
        opt.prev_text = "قبلی";
        opt.next_text = "بعدی";
        opt.container = container;
        return opt;
    }
    function buildInvoiceList(jq, container) {
        var $con = $("#" + container);
        jq = jq.results;
        var condialog = "dialog" + container;

        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var str = "";
            if ($con.find("#hd_d_iscustomer").val() == "false") {
                str = (val.Sell == false ? "خرید" : "مرجوعی");
            } else {
                str = (val.Sell == true ? "فروش" : "مرجوعی");
            }
            ItemList += "<tr id='tr" + val.OrderHeaderId + "'>" +
                "<td width='14%' id='td" + val.OrderHeaderId + "' name='InvoiceNO' >" + val.InvoiceNO + "</td>" +
                "<td width='10%' name='Date' >" + val.Date + "</td>" +
                "<td width='10%' name='Shop' id='" + val.ShopId + "'>" + val.ShopName + "</td> " +
                "<td width='12%' name='Employee' id='" + val.EmployeeId + "'>" + val.EmployeeName + " " + val.EmployeeFamily + "</td> " +
                "<td width='12%' name='Clinet' id='" + val.Code + "'><div id='Name'>" + val.ClientName + " " + val.ClientFamily + "</div></td> " +
                "<td width='13%' name='Amount'><div id='Price'>" + val.Amount + " " + val.Currency + "</div></td> " +
                "<td width='9%' name='Sell'>" + str + "</td>" +
                "<td width='9%' name='PreOrder'>" + (val.PreOrder == false ? "فاکتور" : "<a id='a_PreOrder' href='javascript:SetInvoice(" + val.OrderHeaderId + ",\"" + container + "\");'>پیش فاکتور </a>") + "</td>" +
                "<td width='11%' name='detail' id='" + val.OrderHeaderId + "'><div id='Detail'><button id='a_ButtonEdit'>ویرایش</button><button id='a_ButtonPrint'>چاپ</button><button id='a_Button' >جزئیات فاکتور</button></div></td>" +
                "</tr>";
        }

        //b.OrderHeaderId, b.InvoiceNO, b.Date,b.ShopName ,b.ClientId,b.ClientName,b.ClientFamily,b.EmployeeId,b.EmployeeName,b.EmployeeFamily, b.Price,b.Broken,b.Sell,b.PreOrder
        $con.find("#InvoiceList").html(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
        $con.find("[id=a_Button]").button({
            icons: {
                primary: "ui-icon-plus"
            },
            text: false
        }).click(function () {
            SelectDetailInvoice($(this).parents("td").prop("id"), condialog)
        });
        $con.find("[id=a_ButtonEdit]").button({
            icons: {
                primary: "ui-icon-pencil"
            },
            text: false
        }).click(function () {
            ClickInvoice($(this).parents("tr").first(), container)
        });
        $con.find("[id=a_ButtonPrint]").button({
            icons: {
                primary: "ui-icon-print"
            },
            text: false
        }).click(function () {
            getDataPrint($(this).parents("td").prop("id"), container);
        });
        // $con.find("#InvoiceList")
        // TableAlter(container);
        //    $con.find("tr[id*=tr]").find("td:not(:[name=detail])").click(function () {
        //        ClickInvoice($(this).parents("tr"), container)
        //    }).addClass("cursor");
    }

    function ClickInvoice($dis, container) {
        var $con = $("#" + container);
        onRowClick($dis);
        if ($dis.hasClass("rowOnClick") && $dis.find("td[name=Amount] input").length < 1) {

            $dis.find("td[name=Amount]").append("<input type='text' class='inputText inputW136 ' value='" + $dis.find("td[name=Amount] div").html().split(" ")[0] + "'/><Label>" + $dis.find("td[name=Amount] div").html().split(" ")[1] + "</Label>");
            $dis.find("div[id=Price]").addClass("invisible");

            $dis.find("td[name=Clinet]").append("<input type='text' class='inputText inputW136 ' id='CustomerIntroducerCode' value='" + $dis.find("td[name=Clinet]").prop('id') + "'/><a id='a_IntroducerCode' href='#' ><span id='search' class='searchText'></span></a>");
            $dis.find("div[id=Name]").addClass("invisible");

            $dis.find("div[id=Detail]").addClass("invisible");
            $dis.find("td[name=detail]").append("<div id='Edit'><button id='Edit_Button' >بروز</button></div>");

            $dis.find("#Edit_Button").click(function () {
                EditHeaderInvoice($dis, container);
            }).button();
            $con.find("#divdialogCustomer").dialog({ autoOpen: false }).dialog({ width: 600 });
            $con.find("#a_IntroducerCode").off().on('click', function () {
                opendialog({ container: "divdialogCustomer", containerpage: container });
            });

            $.each($con.find("tr[id*=tr]"), function () {
                if (!$(this).hasClass("rowOnClick")) {
                    $(this).find("a[id=a_CustomerIntroducerCode]").remove();
                    $(this).find("input").remove();
                    $(this).find("span[id=search]").remove();
                    $(this).find("Label").remove();
                    $(this).find("div[id=Edit]").remove();
                    $(this).find("div").removeClass("invisible");


                }
            });
        }
        else {
            $dis.find("a[id=a_CustomerIntroducerCode]").remove();
            $dis.find("input").remove();
            $dis.find("span[id=search]").remove();
            $dis.find("Label").remove();
            $dis.find("div[id=Edit]").remove();
            $dis.find("div").removeClass("invisible");
        }
    }

    function EditHeaderInvoice($dis, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/EditHeaderInvoice",
            contentType: "application/json; charset=utf-8",
            data: "{OrderHeaderId: '" + $dis.prop('id').replace("tr", "") + "',Code: '" + $dis.find("td[name=Clinet] input").val() + "',Amount: '" + $dis.find("td[name=Amount] input").val() + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isDone) {
                    $dis.find("a[id=a_CustomerIntroducerCode]").remove();
                    $dis.find("span[id=search]").remove();
                    $dis.find("div[id=Edit]").remove();
                    $dis.find("div[id=Price]").html($dis.find("td[name=Amount] input").val() + " " + $dis.find("td[name=Amount] Label").html());
                    $dis.find("div[id=Name]").html(response.msg);
                    $dis.find("input").remove();
                    $dis.find("Label").remove();
                    $dis.find("div").removeClass("invisible");
                }
                else
                    translate(response.msg);
            }
        });
    }

    function InvoicepageselectCallback(page_index, jq, container, first) {
        var $con = $("#" + container);
        if (first) {
            buildInvoiceList(jq, container);
        }
        else {
            first = false;
            var items_per_page = $con.find("#PageSize").val();
            var itemcontent = '';
            var take = items_per_page;
            var skip = page_index == 0 ? 0 : (page_index * take);
            var name = "", code = "", EmployeeId = "", EmployeeName = "", Shop = "", InvoiceId = "", ProductId = "", ProductName = "", Barcode = "";
            var search = $con.find("#ddl_d_SearchBy1").val();
            if (search != "") {
                if (search == "Code") {
                    code = $con.find("#txtSearch1").val();
                } if (search == "Name") {

                    name = $con.find("#txtSearch1").val();
                } if (search == "EmployeeId") {

                    EmployeeId = $con.find("#txtSearch1").val();
                } if (search == "EmployeeName") {

                    EmployeeName = $con.find("#txtSearch1").val();
                }
                if (search == "Shop") {

                    Shop = $con.find("#txtSearch1").val();
                }
            }
            var search = $con.find("#ddl_d_SearchBy2").val();
            if (search != "") {
                if (search == "InvoiceId") {
                    InvoiceId = $con.find("#txtSearch2").val();
                } if (search == "ProductId") {

                    ProductId = $con.find("#txtSearch2").val();
                } if (search == "ProductName") {

                    ProductName = $con.find("#txtSearch2").val();
                }
                if (search == "Barcode") {

                    Barcode = $con.find("#txtSearch2").val();
                }
            }
            var sell = "";
            if ($con.find("#Checkbox1" + container).prop('checked') && $con.find("#Checkbox2" + container).prop('checked'))
                sell = "";
            else if (!$con.find("#Checkbox1" + container).prop('checked') && $con.find("#Checkbox2" + container).prop('checked'))
                sell = false;
            else if ($con.find("#Checkbox1" + container).prop('checked') && !$con.find("#Checkbox2" + container).prop('checked'))
                sell = true;

            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'supplierid': $con.find("#hd_d_PersonId").val(), 'IsClient': $con.find("#hd_d_IsClient").val(), 'SupplierName': name, 'code': code, 'EmployeeId': EmployeeId, 'EmployeeName': EmployeeName, 'Shop': Shop, 'InvoiceId': InvoiceId, 'ProductId': ProductId, 'ProductName': ProductName, 'InvoiceDateStart': ($con.find("#txt_s_InvoiceDateStart").length > 0 ? $con.find("#txt_s_InvoiceDateStart").val() : ""), 'Barcode': Barcode, 'InvoiceDateEnd': ($con.find("#txt_s_InvoiceDateEnd").length > 0 ? $con.find("#txt_s_InvoiceDateEnd").val() : ""), 'PriceFrom': ($con.find("#txt_s_PriceFrom").length > 0 ? $con.find("#txt_s_PriceFrom").val() : ""), 'PriceTo': ($con.find("#txt_s_PriceTo").length > 0 ? $con.find("#txt_s_PriceTo").val() : ""), 'Order': sell, 'PreOrder': ($con.find("#Checkbox3" + container).length > 0 ? $con.find("#Checkbox3" + container).prop('checked') : ""), 'Broken': ($con.find("#Checkbox4" + container).length > 0 ? $con.find("#Checkbox4" + container).prop('checked') : ""), 'CategoryId': getHierarchySelectedValue("hr_s_Category", container), 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'counterid': $("#userDefault").find("#ddl_m_Counter").val() };

            $.ajax({
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(DTO),
                type: "Post",
                url: "Management/GetInvoiceList",
                success: function (response) {
                    if (!isAuthenticated(response))
                        return;
                    buildInvoiceList(response, container);
                },
                error: function (response) { alert(response.responseText); }
            });

            return false;
        }
        Sort(getInvoiceList, container);
    }



    function SetInvoice(OrderId, container) {
        $.ajax({
            type: "POST",
            url: "Management/preOrderChange",
            contentType: "application/json; charset=utf-8",
            data: "{orderHeaderId: '" + OrderId + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone)
                    getInvoiceList(container);
            }
        });
    }


    function SelectDetailInvoice(id, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/GetDetailInvoice",
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + id + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                jq = response;
                var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
                var ItemList = "";
                for (var i = 0; i < List.length; i++) {
                    var val = List[0, i];
                    ItemList += "<tr id='tr" + val.OrderDetailId + "'>" +
                "<td name='name' id='" + val.BarcodeId + "' width='17%'><span class='cursor' name='subTab' menuName='a_InventoryList' id='" + val.BarcodeId + "'>" + (val.Barcode == null ? "" : val.Barcode + "_") + (val.Name == null ? "" : val.Name) + (val.Description == null ? "" : "_" + val.Description) + (val.ItemCode == null ? "" : "_" + val.ItemCode) + "</span></td>" +
                "<td name='Color' width='10%'><div id='Color'>" + (val.Color == null ? "" : val.Color) + "</div></td>" +
                "<td name='Size' width='10%'><div id='Size'>" + (val.Size == null ? "" : val.Size) + "</div></td>" +
                "<td name='Quantity' width='7%'><div id='Quantity'>" + (val.Quantity == null ? "" : val.Quantity) + "  " + (val.UnitType == null ? "" : val.UnitType) + "</div></td>" +
                "<td name='Price' width='10%'><div id='Price'>" + (val.Price == null ? "" : val.Price) + "</div></td>" +
                "<td name='TotalPrice' width='10%'><div id='TotalPrice'>" + (val.Quantity * val.Price) + "</div></td>" +
                "<td name='Serial' width='10%'><div id='Serial'>" + (val.Serial == null ? "" : val.Serial) + "</div></td>" +
                "<td name='Broken' width='16%'><div id='Broken'><input type='text' class='inputText inputW50' id='txt_m_QuantityReturn'  value='" + (val.Quantity == null ? "" : val.Quantity) + "'/>" +
                "<input type='checkbox' id='CheckboxBroken_" + val.OrderDetailId + "' /><label for='CheckboxBroken_" + val.OrderDetailId + "' style='width:50px; font-size:x-small; margin-left:2px;'>خراب</label>" +
                "<input type='checkbox' id='CheckboxReturn_" + val.OrderDetailId + "' /><label for='CheckboxReturn_" + val.OrderDetailId + "' style='width:50px;font-size:x-small;'>مرجوع</label></div></td>" +
                "<td id='delete' width='10%'><div class='unit' id='" + val.OrderDetailId + "' ><button id='btn_edit' >ویرایش</button><button id='btn_delete'  >حذف</button></div></td></tr>";
                }
                $con.find("#DetailListInvoice").html(ItemList).parent().tableScroll({ height: 380, width: 980, flush: false });

                $con.find("[name=subTab]").unbind().click(function () {
                    var $d = $(this);
                    createSubTab({ name: $d.attr("menuName"), tabName: $d.html(), id: $d.attr("id") });
                });
                $con.find("[id=btn_delete]").button({
                    icons: { primary: 'ui-icon-closethick' },
                    text: false
                }
            ).click(function () {
                if (confirm("آیا از حذف مطمئن هستید؟"))
                    RemoveItemDetailInvoice($(this).parent().prop("id"), container);
                else
                    return;
            });
                $con.find("[id=btn_edit]").button({
                    icons: { primary: 'ui-icon-pencil' },
                    text: false
                }
            ).click(function () {
                ClickDetailInvoice($(this).parents("tr").first(), container);
                $(this).parent("div").addClass("invisible")
            });
                // $con.find("#DetailListInvoice").parent().tableScroll({ height: 380 });
                //  TableAlter(container);
                //   $con.find("input[id*=Checkbox]").button();
                $con.find("[id=btn_Return]").unbind('click').click(function () {
                    AddReturnInvoice(container);
                }).button();
                //            $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
                //                ClickDetailInvoice($(this).parent("tr"), container);
                //            }).addClass("cursor");
                // $con.find("#DetailListInvoice")
                //            $("#VoucherDetailList").dialog("close");
                //            $("#transferMoney").dialog("close");
                //            $("#DetailPaymentList").dialog("close");
                $con.dialog({ width: 1000 });
            },

            error: function (response) { alert(response.responseText); }
        });
    }

    function ClickDetailInvoice($dis, container) {
        var $con = $("#" + container);
        onRowClick($dis);
        trid = $dis.prop('id');
        if ($dis.hasClass("rowOnClick") && $dis.find("input:text").length < 2) {
            $dis.find("td[name=Color]").append("<select   id='ddl_m_Color_" + trid + "' disabled='disabled' class='inputDiv selectSmall required validate-address' ></select>");
            $dis.find("div[id=Color]").addClass("invisible");

            $dis.find("td[name=Size]").append("<select   id='ddl_m_Size_" + trid + "' disabled='disabled' class='inputDiv selectSmall required validate-address' ></select>");
            $dis.find("div[id=Size]").addClass("invisible");

            $dis.find("td[name=Quantity]").append("<input type='text' class='inputText inputW50 ' value='" + $dis.find("div[id=Quantity]").html().split(" ")[0] + "'/><Label id='Label'>" + $dis.find("div[id=Quantity]").html().split(" ")[1] + "</Label>");
            $dis.find("div[id=Quantity]").addClass("invisible");

            $dis.find("td[name=Price]").append("<input type='text' class='inputText inputW50 ' value='" + $dis.find("div[id=Price]").html() + "'/>");
            $dis.find("div[id=Price]").addClass("invisible");

            $dis.find("td[name=TotalPrice]").append("<input type='text' class='inputText inputW50 ' value='" + $dis.find("div[id=TotalPrice]").html() + "'/>");
            $dis.find("div[id=TotalPrice]").addClass("invisible");

            $dis.find("td[name=Serial]").append("<input type='text' class='inputText inputW50 ' value='" + $dis.find("div[id=Serial]").html() + "'/>");
            $dis.find("div[id=Serial]").addClass("invisible");

            $dis.find("div[id=delete]").addClass("invisible");
            $dis.find("td[id=delete]").append("<div id='Edit'><a id='Edit_Button' href='#'>بروز </a></div>");

            $dis.find("div[id=Broken]").addClass("invisible");
            $dis.find("td[name=Quantity] input,td[name=Price] input").change(function () {
                SumPriceDetail($dis);
            });

            $dis.find("[id=Edit_Button]").click(function () {
                EditDetailInvoice($dis, container);
            }).button();

            bindItemsForSelectCombo({ methodname: "GetColorListForEdit", servicename: "Management", id: "ddl_m_Color_" + trid, container: trid, headertext: " رنگ", setcolor: true }, { barcodeid: $dis.find("td[name=name]").prop('id'), orderDetailid: trid.replace("tr", "") });
            $dis.find("#ddl_m_Color_" + trid).change(function () {
                SelectColorForOrderEdit(trid, $dis.find("td[name=name]").prop('id'));
            });
            ajDropDown.done(function () {
                if ($dis.find("#ddl_m_Color_" + trid + " option").length < 1)

                    bindItemsForSelectCombo({ methodname: "GetSizeListByBarcodeIdColorIdForEdit", servicename: "Management", id: "ddl_m_Size_" + trid, container: trid, headertext: " جزئیات" }, { barcodeid: $dis.find("td[name=name]").prop('id'), orderDetailid: trid.replace("tr", ""), colorid: "" });
            });

            $.each($con.find("tr[id*=tr]"), function () {
                if (!$(this).hasClass("rowOnClick")) {
                    $(this).find("input:text[id!=txt_m_QuantityReturn]").remove();
                    $(this).find("select").remove();
                    $(this).find("Label[id=Label]").remove();
                    $(this).find("#Edit").remove();
                    $(this).find("div[id=Broken]").removeClass("invisible");
                    $(this).find("div").removeClass("invisible");
                }
            });
        }
        else {
            $dis.find("input:text[id!=txt_m_QuantityReturn]").remove();
            $dis.find("select").remove();
            $dis.find("Label[id=Label]").remove();
            $dis.find("#Edit").remove();
            $dis.find("div").removeClass("invisible");
        }
    }

    function SumPriceDetail($dis) {
        $dis.find("td[name=TotalPrice] input").val($dis.find("td[name=Quantity] input").val() * $dis.find("td[name=Price] input").val());
    }

    function SelectColorForOrderEdit(trid, barcodeid) {
        bindItemsForSelectCombo({ methodname: "GetSizeListByBarcodeIdColorIdForEdit", servicename: "Management", id: "ddl_m_Size_" + trid, container: trid, headertext: " جزئیات" }, { barcodeid: barcodeid, orderDetailid: trid.replace("tr", ""), colorid: $("#" + trid).find("#ddl_m_Color_" + trid).val() });
    }

    function EditDetailInvoice($dis, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/EditDetailInvoice",
            contentType: "application/json; charset=utf-8",
            data: "{OrderDetailId: '" + $dis.prop('id').replace("tr", "") + "',ColorId: '" + ($dis.find("td[name=Color] select").val() != null ? $dis.find("td[name=Color] select").val() : "") + "',SizeId: '" + ($dis.find("td[name=Size] select").val() != null ? $dis.find("td[name=Size] select").val() : "") + "',Quantity: '" + $dis.find("td[name=Quantity] input").val() + "',Amount: '" + $dis.find("td[name=Price] input").val() + "',Serial: '" + $dis.find("td[name=Serial] input").val() + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                SelectDetailInvoice(response.orderHeaderId, container);
            }
        });
    }


    function AddReturnInvoice(container) {

        var OrderDetail = [];
        var isEmpty = true;
        $.each($("#" + container).find("tr[id*=tr]"), function () {
            var item = {};
            if (($(this).find("input[id*=CheckboxReturn_]").prop('checked') || $(this).find("input[id*=CheckboxBroken_]").prop('checked')) &&
             $(this).find("#txt_m_QuantityReturn").val() != "" && $(this).find("#txt_m_QuantityReturn").val() != "0") {
                item["orderDetailId"] = this.id.replace("tr", "");
                item["isBroken"] = $(this).find("input[id*=CheckboxBroken_]").prop('checked');
                item["quantity"] = $(this).find("#txt_m_QuantityReturn").val();
                OrderDetail.push(item);
                isEmpty = false;
            }

        });
        if (isEmpty) {
            alert("ابتدا تعداد کالا را نوشته، گزینه مرجوعی یا خراب را تیک زده سپس 'ثبت مرجوعی' را کلیک کنید.");
            return;
        }
        DTO = { 'returnItems': OrderDetail, 'shopId': $("#userDefault").find("#ddl_s_Branch").val(), 'counterId': $("#userDefault").find("#ddl_m_Counter").val(), 'date': $("#userDefault").find("#txt_s_Date").val() },
    $.ajax({
        type: "POST",
        url: "Management/ReturnOrder",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
    }


    function RemoveItemDetailInvoice(OrderDetailId, container) {
        var con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/DeleteDetailInvoice",
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + OrderDetailId + "'}",


            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
                if (response.isdone)
                    con.find("#tr" + OrderDetailId).remove();
            },

            error: function (response) { alert(response.responseText); }
        });
    }
    //--------------------js invoice end-----------------------

    //--------------------js orderWholesale begin-----------------------


    function loadSupplierWholesaleOrder(supplierid, container, first) {

        loadOrder(supplierid, container, GetItemOrderWholesale, true, false, first);
    }

    function loadCustomerWholesaleOrder(supplierid, container, first) {

        loadOrder(supplierid, container, GetItemOrderWholesale, true, true, first);
    }


    function AddOrderWholesale(supplierid, container) {
        var $con = $("#" + container);

        var orderdetails = [];
        var orderheader = {};
        $.each($("#" + container).find("tr[id*=tr]"), function () {
            var orderdetail = {};
            orderdetail["barcodeid"] = this.id.split("_")[2];
            var $row = $(this);
            var orderDetailArray = [];
            $(this).find("input[name=quantity]").each(function () {

                if (this.value != "") {
                    var ItemDetail = {};
                    var OrderItemDetail = {};
                    ItemDetail = (this.id).split("-");
                    OrderItemDetail["colorid"] = ItemDetail[0];
                    OrderItemDetail["sizeid"] = ItemDetail[1];
                    OrderItemDetail["quantity"] = parseFloat(this.value * ($row.find("[id*=ddl_m_measureunit]").val() != null ? $row.find("[id*=ddl_m_measureunit]").val().split('_')[0] : 1)).toFixed(2);
                    orderDetailArray.push(OrderItemDetail);
                }
            });
            if ($(this).find("#txt_m_TotalQuantity").val() == "0" || $(this).find("#txt_m_TotalQuantity").val() == undefined)
                return;
            orderdetail["quantity"] = $(this).find("#txt_m_TotalQuantity").val();
            orderdetail["price"] = $(this).find("#txt_m_Price").val();
            orderdetail["description"] = "";
            orderdetail["serial"] = "";
            orderdetail["broken"] = false;
            orderdetail["itemDetails"] = orderDetailArray
            orderdetails.push(orderdetail);
        })
        orderheader["shopid"] = $("#userDefault").find("#ddl_s_Branch").val();
        orderheader["currenyid"] = $("#userDefault").find("#ddl_m_Currency").val();
        orderheader["date"] = $("#userDefault").find("#txt_s_Date").val();
        orderheader["totalamount"] = $con.find("#txt_m_TotalPrice").val().replace(/,/g, "");
        orderheader["description"] = $con.find("#txt_m_Description").val();
        orderheader["invoicenumber"] = $con.find("#txt_m_InvoiceNumber").val();
        orderheader["PaymentAmount"] = $con.find("#txt_m_PaymentAmount").val().replace(/,/g, "");
        orderheader["customerid"] = supplierid;
        orderheader["issell"] = !$con.find("#cb_d_Sale" + container).prop("checked");
        orderheader["ispreorder"] = $con.find("#cb_d_PreOrder" + container).prop("checked");
        //        orderheader["vat"] = $con.find("#vat").val();

        if (orderdetails != "") {
            var DTO = { 'header': orderheader, 'itemDetails': orderdetails, 'counterId': $("#userDefault").find("#ddl_m_Counter").val(), 'vat': $con.find("#txt_vat").val() };
            $.ajax({
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(DTO),
                type: "Post",
                url: "Management/AddOrderWholeSale",
                success: function (response) {
                    if (!isAuthenticated(response))
                        return;
                    if (response.alert != undefined) {
                        SetInvoiceData(container, response);
                        translate(response.alert);
                        if (response.InvoiceNO != undefined) {
                            $con.find("#OrderList").html("");
                            $con.find("#btn_Print").removeClass('invisible');
                            $con.find("#btn_AddOrder").addClass('invisible');
                            $con.find("#txt_m_InvoiceNumber").val(response.InvoiceNO);
                        }
                    }
                    else
                        translate(response);
                },
                error: function (response) { alert(response.responseText); }
            });
        }
    }

    function GetItemOrderWholesale($dis, container, barcode) {
        //   container = container.replace("dialog", "");

        //        if (barcode == undefined)
        //            barcode = $dis.find("[name=barcode]").html();

        if (barcode == undefined) {
            //first tr of $dis
            var b = $dis.closest('tr').attr('id');
            barcode = b.substring(2, b.length);
        }

        var $con = $("#" + container.replace("dialog", ""));
        var ItemList = "";
        $.ajax({
            type: "POST",
            data: "{barcode: '" + barcode + "'}",
            url: "Management/GetProduct",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                $con.find("#txt_s_ProductBarcode").val("");
                if (response.length < 1)
                    return;
                var count = $con.find("tr[id*='tr_" + container + "']").length;
                var List = (typeof response) == 'string' ? eval('(' + response + ')') : response;
                var ItemList = "";
                var val = List[0, 0];
                var trid = "tr_" + container + "_" + val.barcodeid + "_" + count;
                ItemList += "<tr id='" + trid + "'>" +
            "<td width='3%' id='rownumber'></td>" +
                "<td width='11%'><a href='javascript:showQuantity(\"" + container + "\",\"" + val.barcode + "\");'>" + val.name + " " + val.code + " " + val.barcode + "</a></td>" +
                 "<td id='mesureunit' width='8%'>" +
                  " <select   id='ddl_m_measureunit_" + trid + "' disabled='disabled' class='select95'></select>" +
                            "</td>" +
                 "<td id='Div_Product_Quantity_" + trid + "' width='43%' dir='rtl'></td>" +
                 "<td width='11%'><input type='text'  class=' inputText inputW100 fontSize15' id='txt_m_Price' value='" + val.price + "'/></td>" +
                 "<td width='6%'><input type='text'  class=' inputText inputW50 fontSize15' id='txt_m_TotalQuantity'  disabled='disabled' value='0'/></td>" +
                "<td width='13%'><input type='text'  class=' inputText inputW136 fontSize15 digit' id='txt_m_TotalItemPrice' disabled='disabled' /></td>" +
                "<td width='5%' id='delete'><button name='btn_Delete' >حذف</button></td></tr>";


                $con.find("#OrderList").append(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
                $con.find("#btn_Print").addClass('invisible');
                $con.find("#btn_AddOrder").removeClass('invisible');
                $con.find("[name=btn_Delete]").button({ icons: {
                    primary: "ui-icon-closethick"
                },
                    text: false
                }).unbind().click(function () {
                    if (confirm("آیا از حذف مطمئن هستید؟"))
                        RemoveItemOrderElementWholesale($(this).parents("tr").attr("id"), container);
                    else
                        return;
                });
                if ($con.find("#wholeOrderList").html() == "") {
                    $("#" + container).find("#Footer").addClass('invisible');
                    $("#" + container).find("#header").addClass('invisible');
                }
                else {
                    $("#" + container).find("#Footer").removeClass('invisible');
                    $("#" + container).find("#header").removeClass('invisible');
                }
                var rownumber = 0;
                $.each($("#" + container).find("#OrderList").find("tr[id*=tr_]"), function () {
                    rownumber++;
                    $(this).find("[id=rownumber]").html(rownumber);
                });
                //    $con.find("#OrderList").parent().tableScroll({ height: 380 });
                //  TableAlter(container);

                $con.find("[id=txt_m_Price]").spinner({ step: 1000, change: function () {
                    SumWholesale(container);
                },
                    stop: function () {
                        SumWholesale(container);
                    }
                });
                $("#" + trid).find("#txt_m_Price").bind('keydown', function (e) {
                    if (e.keyCode == 40) {
                        $("#" + trid).next().find("#txt_m_Price").focus().focus(function () { this.select() });
                    }
                    if (e.keyCode == 38) {
                        $("#" + trid).prev().find("#txt_m_Price").focus().focus(function () { this.select() });
                    }
                });
                bindComboData({ id: "ddl_m_measureunit_" + trid, container: trid, isMeasureUnit: true }, val.measureUnits);
                $("#ddl_m_measureunit_" + trid).change(function () { SumWholesale(container); });
                buildColorSizeTable(barcode, $("#userDefault").find("#ddl_s_Branch").val(), false, "GetItemDetailsByBarcodeAndShopIDNoQuantity", "Div_Product_Quantity_" + trid, trid)
                // SumWholesale(trid, container);
                //  $con.find("tr[id*=tr]").dblclick(function () {
                //ClickColorSize(this, container)
                //  });
                $con.find("#Footer").removeClass("invisible");
            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function RemoveItemOrderElementWholesale(trid, container) {
        $("#" + trid).remove();
        SumWholesale(trid.split("_")[1]);
    }

    function getBarcodeListOrder(container, params) {
        var $con = $("#" + container);
        var $dialog = $("#" + params.container + container);
        var barcode = $con.find("#txt_s_ProductBarcode").val();
        if (barcode != "" && barcode != undefined) {
            params.fname(null, container, barcode);
            return;
        }
        if (params.page_index > 0) {
            params.first = false;
        }
        var DTO = { 'sort': sortid, 'barcode': ($con.find("#txt_s_ProductBarcode").val() == undefined ? "" : $con.find("#txt_s_ProductBarcode").val()), 'name': ($con.find("#txt_s_ProductCode").val() == undefined ? "" : $con.find("#txt_s_ProductCode").val()), 'code': "", 'price': "", 'categoryid': getHierarchySelectedValue("hr_s_Category", container), 'status': ($con.find("#ddl_m_Availability").val() == undefined ? "" : $con.find("#ddl_m_Availability").val()), 'quantityfrom': "", 'quantityto': "", 'regdatefrom': "", 'regdateto': "", 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "GetItemsList" };
        params["DTO"] = DTO;

        pageselectCallback(0, params, { container: "dialog", fname: params.fname, pagingContainer: container, first: true, isOrder: true, isChangeQuantity: true });
    }

    function buildBarcodeListOrder(jq, pageoption) {
        var $con = $("#" + pageoption.container);
        jq = jq.results;
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "category", width: "12%" });
        lsth.push({ title: "itemName", sort: "Name", width: "35%" });
        lsth.push({ title: "itemCode", sort: "ItemCode", width: "14%" });
        lsth.push({ title: "count", sort: "Quantity", width: "10%" });
        lsth.push({ title: "price", sort: "Regular", width: "15%" });
        lsth.push({ title: "barcode", sort: "Barcode", width: "14%" });


        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            trBody[0] = { trId: val.BarcodeId };
            trBody[1] = { html: val.Category, width: "12%" };
            trBody[2] = { name: "name", html: val.Name, width: "35%" };
            trBody[3] = { name: "code", html: val.ItemCode, width: "14%" };
            trBody[4] = { name: "quantity", html: val.Quantity + " " + val.UnitType, width: "10%" };
            trBody[5] = { html: val.Regular, props: { name: "price", klass: "digit", width: "15%"} };
            trBody[6] = { name: "barcode", html: val.Barcode, width: "14%" };

            lstb.push(trBody);
        }
        details = { rowClick: pageoption.fname };
        table = { header: lsth, body: lstb, details: details, heigth: 300, width: 620,
            container: pageoption.container + pageoption.pagingContainer, divName: "BarcodeList",
            rowClickParams: { fname: GetItemOrder }
        };
        buildTable(table);
    }

    //function buildBarcodeListOrder(jq, pageoption) {
    //    var $con = $("#" + pageoption.pagingContainer);
    //    jq = jq.results;
    //    var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
    //    var ItemList = "";
    //    for (var i = 0; i < List.length; i++) {
    //        var val = List[0, i];
    //        ItemList += "<tr id='tr" + val.BarcodeId + "'>" +
    //                "<td name='barcode' >" + val.Barcode + "</td>" +
    //                "<td name='code' >" + val.ItemCode + "</td>" +
    //                "<td name='name'>" + val.Name + "</td> " +
    //                "<td name='price'>" + val.Regular + "</td> " +
    //                "<td >" + val.Category + "</td>" +
    //                "</tr>";
    //    }
    //    $("#" + pageoption.container).find("#BarcodeList").html(ItemList).parent().tableScroll({ height: 380 });
    //    //  $("#" + pageoption.container).find("#BarcodeList").parent().tableScroll({ height: 380 });

    //    // TableAlter(pageoption.pagingContainer);
    //    $("#" + pageoption.container).find("tr[id*=tr]").click(function () {
    //        SelectBarcodeWholesale(this, pageoption)
    //    }).addClass("cursor");

    //}

    function SelectBarcodeWholesale(dis, container, params) {
        params.fname($(dis).find("td[name=barcode]").html(), container);
    }
    //function SelectBarcodeWholesale(dis, pageoption, params) {
    //    pageoption.fname($(dis).find("td[name=barcode]").html(), pageoption.pagingContainer);
    //}

    function SumWholesale(container) {
        var SumWholesaleprice = 0;
        var $con = $("#" + container);
        var rownumber = 0;
        $.each($con.find("tr[id*=tr]"), function () {
            $(this).find("#txt_m_TotalQuantity").val(getTotalQuantity($(this).find("td[id*=Div_Product_Quantity_]").prop('id'), $(this).prop('id')) * ($(this).find("[id*=ddl_m_measureunit]").val() != null ? $(this).find("[id*=ddl_m_measureunit]").val().split('_')[0] : 1));
            var totPrice = $(this).find("#txt_m_TotalQuantity").val() * $(this).find("#txt_m_Price").val()
            //with discount
            //$(this).find("#txt_m_TotalItemPrice").val(totPrice - (totPrice * ($(this).find("[id*=ddl_m_measureunit]").val() != null ? $(this).find("[id*=ddl_m_measureunit]").val().split('_')[1] / 100 : 0)));
            $(this).find("#txt_m_TotalItemPrice").val(totPrice);
            $(this).find("#txt_m_TotalItemPrice").attr("price", totPrice);
            SumWholesaleprice += $(this).find("#txt_m_TotalItemPrice").attr("price") * 1;
            rownumber++;
            $(this).find("[id=rownumber]").html(rownumber);
        })
        if (rownumber <= 0) {
            $("#" + container).find("#Footer").addClass('invisible');
            $("#" + container).find("#header").addClass('invisible');
        }
        else {
            $("#" + container).find("#Footer").removeClass('invisible');
            $("#" + container).find("#header").removeClass('invisible');
        }
        $con.find("#txt_m_TotalPrice").val(SumWholesaleprice);
        if (!$.browser.msie) {
            $(".digit").digits();
        }
    }
    //--------------------js orderwholesale end-----------------------

    //--------------------js AccountDetails begin-----------------------

    function loadAccountDetails(Supplierid, container, first) {

        AccountDetails(Supplierid, container);
    }

    function AccountDetails(Supplierid, container) {
        var $con = $("#" + container);
        $con.find("#clearSale").html("خرید خالص");
        $con.find("#clearAmount").html("مبلغ برداشتی خالص");
        $con.find("#countSale").html("تعداد خرید");
        $con.find("#sumSale").html("جمع خرید");
        $con.find("#btnNewVoucher").button().unbind('click').click(function () {
            AddVoucher(Supplierid, container);
        });
        DTO = { 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'Scoup': "", 'clientid': Supplierid, 'employeeid': "", 'dateFrom': "", 'dateTo': "", 'isSale': "", 'clientCode': "" };
        $.ajax({
            type: "POST",
            url: "Management/GetAccountDetailsShop",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                $con.find("#txt_d_Sale").val(response.BuyAmount * 1 - response.SellAmount * 1);
                $con.find("#txt_d_PaymentSale").val((response.ReceivedCash * 1 + response.ReceivedCheque * 1 + response.ReceivedVoucher * 1) - (response.PaidCash * 1 + response.PaidCheque * 1 + response.paidVoucher * 1));
                $con.find("#txt_d_BalanceTotal").val((response.BuyAmount * 1 - response.SellAmount * 1) - ((response.ReceivedCash * 1 + response.ReceivedCheque * 1 + response.ReceivedVoucher * 1) - (response.PaidCash * 1 + response.PaidCheque * 1 + response.paidVoucher * 1)));
                $con.find("#txt_d_SaleTotal").val(response.BuyAmount);
                $con.find("#txt_d_Return").val(response.SellAmount);
                $con.find("#txt_d_TotalPayment").val(response.PaidCash * 1 + response.PaidCheque * 1 + response.paidVoucher * 1);
                $con.find("#txt_d_TotalReceive").val(response.ReceivedCash * 1 + response.ReceivedCheque * 1 + response.ReceivedVoucher * 1);
                $con.find("#txt_d_ChequePeyment").val(response.PaidCheque);
                $con.find("#txt_d_ChequeReceive").val(response.ReceivedCheque);
                $con.find("#txt_d_CashPayment").val(response.PaidCash);
                $con.find("#txt_d_CashReceive").val(response.ReceivedCash);
                $con.find("#txt_d_TotalOff").val(response.OffSale * 1 - response.BuyAmount * 1);
                $con.find("#txt_d_BuyQuantity").val(response.BuyQuantity);
                $con.find("#txt_d_SellQuantity").val(response.SellQuantity);
                $con.find("#txt_d_NetQuantity").val(response.BuyQuantity * 1 - response.SellQuantity * 1);
                //             $con.find("#txt_d_profit").val(response.profit);
            },
            error: function (response) { alert(response.responseText); }
        });
    }
    //--------------------js AccountDetails end-----------------------


    //--------------------js AccountDetailsSupplier begin-----------------------

    function loadAccountDetailsSupplier(Supplierid, container, first) {
        AccountDetailsSupplier(Supplierid, container);
    }

    function AccountDetailsSupplier(Supplierid, container) {
        var $con = $("#" + container);
        DTO = { 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'Scoup': "", 'clientid': Supplierid, 'employeeid': "", 'dateFrom': "", 'dateTo': "", 'isSale': "", 'clientCode': "" };
        $.ajax({
            type: "POST",
            url: "Management/GetAccountDetailsShop",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                $con.find("#txt_d_Sale").val(response.SellAmount * 1 - response.BuyAmount * 1);
                $con.find("#txt_d_PaymentSale").val((response.PaidCash * 1 + response.PaidCheque * 1 + response.paidVoucher * 1) - (response.ReceivedCash * 1 + response.ReceivedCheque * 1 + response.ReceivedVoucher * 1));
                $con.find("#txt_d_BalanceTotal").val((response.SellAmount * 1 - response.BuyAmount * 1) - ((response.PaidCash * 1 + response.PaidCheque * 1 + response.paidVoucher * 1) - (response.ReceivedCash * 1 + response.ReceivedCheque * 1 + response.ReceivedVoucher * 1)));
                $con.find("#txt_d_SaleTotal").val(response.SellAmount);
                $con.find("#txt_d_Return").val(response.BuyAmount);
                $con.find("#txt_d_TotalPayment").val(response.PaidCash * 1 + response.PaidCheque * 1 + response.paidVoucher * 1);
                $con.find("#txt_d_TotalReceive").val(response.ReceivedCash * 1 + response.ReceivedCheque * 1 + response.ReceivedVoucher * 1);
                $con.find("#txt_d_ChequePeyment").val(response.PaidCheque);
                $con.find("#txt_d_ChequeReceive").val(response.ReceivedCheque);
                $con.find("#txt_d_CashPayment").val(response.PaidCash);
                $con.find("#txt_d_CashReceive").val(response.ReceivedCash);
                $con.find("#txt_d_TotalOff").val(response.OffBuy * 1 - response.SellAmount * 1);
                $con.find("#txt_d_profit").val(response.profit);
                $con.find("#txt_d_BuyQuantity").val(response.BuyQuantity);
                $con.find("#txt_d_SellQuantity").val(response.SellQuantity);
                $con.find("#txt_d_NetQuantity").val(response.BuyQuantity * 1 - response.SellQuantity * 1);

            },

            error: function (response) { alert(response.responseText); }
        });
    }
    //--------------------js AccountDetailsSupplier end-----------------------

    //----------------new ListSMS begin-------------------
    function loadAllListSMS(container, first) {
        sortid = "Date Desc";
        if (first) {
            var $con = $("#" + container);
            getSMSList({ container: container });
            $con.find("#txt_s_SendDateFrom").datepicker({
                changeMonth: true,
                changeYear: true,
                onSelect: function (dateText, inst) {
                    $con.find('#txt_s_SendDateTo').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            bindItemsForSelectCombo({ servicename: "Management", methodname: "GetSmsTitles", headertext: "انتخاب موضوع", id: "ddl_s_Title", container: container });
            aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "Management", id: "txt_customerSms", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_customerSms", fname: customerOnSelect });
            $con.find("#txt_s_SendDateTo").datepicker({ changeMonth: true, changeYear: true });
            $con.find("#div_customerSms").removeClass("invisible");
            $con.find("#PageSize").off().on('change', function () { getSMSList({ container: container }); });
            $con.find("#btn_Search").button({ icons: {
                primary: "ui-icon-search"
            }
            }).unbind('click').click(function () { getSMSList({ container: container }); });
            $con.find("#btn_checkStatus").button().unbind('click').click(function () { checkSmsStatus({ container: container }); });
            $con.find("#btn_resendSms").button().unbind('click').click(function () { resendSms(container); });
        }
    }

    function loadListSMS(id, container, first) {
        sortid = "Date Desc";
        if (first) {
            var $con = $("#" + container);
            getSMSList({ container: container, id: id });
            $con.find("#txt_s_SendDateFrom").datepicker({
                changeMonth: true,
                changeYear: true,
                onSelect: function (dateText, inst) {
                    $con.find('#txt_s_SendDateTo').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            bindItemsForSelectCombo({ servicename: "Management", methodname: "GetSmsTitles", headertext: "انتخاب موضوع", id: "ddl_s_Title", container: container });
            $con.find("#div_customerSms").addClass("invisible");
            $con.find("#txt_s_SendDateTo").datepicker({ changeMonth: true, changeYear: true });
            $con.find("#btn_resendSms").button().unbind('click').click(function () { resendSms(container); });
            $con.find("#PageSize").off().on('change', function () { getSMSList({ container: container, id: id }); });
            $con.find("#btn_Search").button({ icons: {
                primary: "ui-icon-search"
            }
            }).unbind('click').click(function () { getSMSList({ container: container, id: id }); });
            $con.find("#btn_checkStatus").button().unbind('click').click(function () { checkSmsStatus({ container: container, id: id }); });
        }
    }

    function resendSms(container) {
        var $con = $("#" + container);
        var sms = [];
        $con.find("#SMSList").find("input:checkbox").each(function () {
            if (this.checked == true)
                sms.push($(this).parents("tr").attr("id").replace("tr", ""));
        });
        var DTO = { 'messageId': sms };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/ResendSms",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function getSMSList(pageoption) {
        var $con = $("#" + pageoption.container);
        var first = true;
        var take = $con.find("#PageSize").val();
        var skip = 0;
        var page_index = 0;

        var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'id': pageoption.id != undefined ? pageoption.id : "",
            'title': $con.find("#ddl_s_Title").val(), 'body': $con.find("#txt_s_Body").val(),
            'datefrom': $con.find("#txt_s_SendDateFrom").val(), 'dateto': $con.find("#txt_s_SendDateTo").val(),
            'status': $con.find("#txt_smsStatus").val(), 'mobile': $con.find("#txt_mobileSms").val(),
            "customerCode": $con.find("#txt_customerSms").val()
        };

        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/GetListSMS",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var opt = getSMSListgetOptionsFrom(response.count, pageoption);
                $con.find("#paging").pagination(response.count, opt);
                getSMSListpageselectCallback(0, response, pageoption, first);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function checkSmsStatus(pageoption) {
        var $con = $("#" + pageoption.container);
        var DTO = { 'id': pageoption.id != undefined ? pageoption.id : "",
            'title': $con.find("#ddl_s_Title").val(), 'body': $con.find("#txt_s_Body").val(),
            'datefrom': $con.find("#txt_s_SendDateFrom").val(), 'dateto': $con.find("#txt_s_SendDateTo").val(),
            'status': $con.find("#txt_smsStatus").val(), 'mobile': $con.find("#txt_mobileSms").val(),
            "customerCode": $con.find("#txt_customerSms").val()
        };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/CheckSmsStatus",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                getSMSList({ container: pageoption.container, id: pageoption.id });
            },
            error: function (response) { alert(response.responseText); }
        });
    }
    function getSMSListgetOptionsFrom(count, pageoption) {
        var $con = $("#" + pageoption.container);
        var opt = { callback: getSMSListpageselectCallback };
        $con.find("input:text").each(function () {
            opt[this.name] = this.className.match(/numeric/) ? parseInt(this.value) : this.value;
        });
        opt.prev_show_always = false;
        opt.next_show_always = false;
        if ((count) < $con.find("#PageSize").val())
            $con.find("#PageSize").css("display", "none");
        else {
            $con.find("#PageSize").css("display", "inline");
        }
        opt.items_per_page = $con.find("#PageSize").val();
        opt.prev_text = "قبلی";
        opt.next_text = "بعدی";
        opt.container = pageoption;
        return opt;
    }

    function buildgetSMSList(jq, pageoption) {
        var $con = $("#" + pageoption.container);
        jq = jq.results;
        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        if (List != null) {
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                ItemList += "<tr id='tr" + val.MessageId + "'>" +
        "<td width='10%' date='" + val.Date + "' class='dateLong'></td>" +
        "<td width='10%'>" + val.Title + "</td>" +
        "<td width='25%'>" + val.Body + "</td>" +
        "<td width='5%'>" + val.Length + "</td>" +
        "<td width='10%'>" + val.Number + "</td>" +
        "<td width='10%'>" + val.Name + " " + val.Family + "</td>" +
        "<td width='10%'>" + val.cName + " " + val.cFamily + "</td>" +
        "<td width='15%' style='background-color:" + (val.Status == "SentToMobile" ? "#B9F43E" : "#ED6912") + ";'><span>" + val.Status + "</span></td>" +
        "<td width='5%'><input type='checkbox' name='selectsms'></input></td>" +
        "</tr>";
            }
        }
        $con.find("#SMSList").html(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
        //  $con.find("#SMSList").parent().tableScroll({ height: 380 });
        //  TableAlter(pageoption.container);
    }

    function getSMSListpageselectCallback(page_index, jq, pageoption, first) {
        var $con = $("#" + pageoption.container);
        if (first) {
            buildgetSMSList(jq, pageoption);
        }
        else {
            first = false;
            var items_per_page = $con.find("#PageSize").val();
            var itemcontent = '';
            var take = items_per_page;
            var skip = page_index == 0 ? 0 : (page_index * take);
            // var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'id': pageoption.id, 'title': $con.find("#ddl_s_Title select").val(), 'body': $con.find("#txt_s_Body").val(), 'datefrom': $con.find("#txt_s_SendDateFrom").val(), 'dateto': $con.find("#txt_s_SendDateTo").val() };
            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'id': pageoption.id != undefined ? pageoption.id : "",
                'title': $con.find("#ddl_s_Title").val(), 'body': $con.find("#txt_s_Body").val(),
                'datefrom': $con.find("#txt_s_SendDateFrom").val(), 'dateto': $con.find("#txt_s_SendDateTo").val(),
                'status': $con.find("#txt_smsStatus").val(), 'mobile': $con.find("#txt_mobileSms").val(),
                "customerCode": $con.find("#txt_customerSms").val()
            };
            $.ajax({
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(DTO),
                type: "Post",
                url: "Management/GetListSMS",
                success: function (response) {
                    if (!isAuthenticated(response))
                        return;
                    buildgetSMSList(response, pageoption);
                },
                error: function (response) { alert(response.responseText); }
            });
            return false;
        }
        Sort(getSMSList, pageoption);
    }


    //----------------new ListSMS end-------------------

    //----------------new CustomerChart begin-------------------
    function loadSellChart(container, first) {
        if (first) {
            loadChart(first, container, true, { onLoad: true })
        }
    }
    function loadBuyChart(container, first) {
        if (first) {
            loadChart(first, container, false, { onLoad: true })
        }
    }
    function loadCustomerChart(customerid, container, first) {
        var $con = $("#" + container);
        if (first) {
            $con.find("#hd_d_PersonId").val(customerid);
            loadChart(first, container, true, { onLoad: true })
        }
    }

    function loadChart(first, container, isCustomer, params) {
        var $con = $("#" + container);
        if (first) {
            $con.find('#moreFilter').slideUp('fast');
            $con.find('.toggle-more-filters').click(function () {
                $(this).toggleClass("open")
                //            $con.find('#moreFilter').removeClass('invisible');
                $con.find('#moreFilter').slideToggle(function () {
                    // Animation complete.
                });
            });
            // GetSaleChart(container);
            //$con.find("#btnSearch").button();
            ChangeCheckBoxGroupName("Check", container);
            var invoiceDay = " <option value=''>روز </option>", invoiceMonth = "<option value=''>ماه </option>",
                invoiceYear = " <option value=''>سال </option>";
            var yearEnd = new Date();
            yearEnd = (yearEnd.getFullYear() * 1 - 621) + 1;
            for (var i = 1; i < 32; i++) {
                invoiceDay += " <option value='" + i + "'>" + i + "</option>";
                if (i < 13)
                    invoiceMonth += " <option value='" + i + "'>" + i + "</option>";
            }
            for (var i = 1388; i < yearEnd; i++) {
                invoiceYear += " <option value='" + i + "'>" + i + "</option>";
            }
            $con.find("#txt_s_InvoiceDayStart").html(invoiceDay);
            $con.find("#txt_s_InvoiceDayStart").val("1");
            $con.find("#txt_s_InvoiceMonthStart").html(invoiceMonth);
            $con.find("#txt_s_InvoiceMonthStart").val("1");
            $con.find("#txt_s_InvoiceYearStart").html(invoiceYear);
            $con.find("#txt_s_InvoiceYearStart").val("1388");
            $con.find("#txt_s_InvoiceDayEnd").html(invoiceDay);
            $con.find("#txt_s_InvoiceDayEnd").val("29");
            $con.find("#txt_s_InvoiceMonthEnd").html(invoiceMonth);
            $con.find("#txt_s_InvoiceMonthEnd").val("12");
            $con.find("#txt_s_InvoiceYearEnd").html(invoiceYear);
            $con.find("#txt_s_InvoiceYearEnd").val(yearEnd * 1 - 1);
            $con.find("#ddl_d_GroupBy").val("Month");
            //            $con.find("#txt_s_PriceTo").datepicker("getDate");
            //        $con.find("#txt_s_InvoiceYearStart").datepicker({ dateFormat: "yy", changeYear: true,
            //            onSelect: function (dateText, inst) {
            //                $('#txt_s_InvoiceYearEnd').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
            //            }
            //        });
            //        $con.find("#txt_s_InvoiceYearEnd").datepicker({ dateFormat: "yy", changeYear: true });

            // bindDropDown("ddl_d_SearchBy1", container);
            //  bindDropDown("ddl_d_SearchBy2", container);
            //bindDropDown("ddl_d_GroupBy", container);
            bindHierarchyData({ id: "hr_s_Category", table: "category", container: container });
            $con.find("#btnSearch").button({ icons: {
                primary: "ui-icon-search"
            }
            }).unbind('click').click(function () {
                GetSaleChart(container, isCustomer);
            });
            if (params.onLoad) {
                GetSaleChart(container, isCustomer);
            }
            //            $con.find("#PageSize").off().on('change', function () { getInvoiceList(container); });
            //            $con.find("#div_dialog_invoice").dialog({ autoOpen: false }).dialog({ width: 900 });

        }
        function GetSaleChart(container, isCustomer) {
            var $con = $("#" + container);
            var name = "", code = "", EmployeeId = "", EmployeeName = "", Shop = "", InvoiceId = "", ProductId = "",
        ProductName = "", Barcode = "";
            var priceFrom = "", priceTo = "", categoryId = "";
            if ($con.find("#moreFilter").is(":visible")) {
                var search = $con.find("#ddl_d_SearchBy1").val();
                if (search != "") {
                    if (search == "Code") {
                        code = $con.find("#txtSearch1").val();
                    } if (search == "Name") {

                        name = $con.find("#txtSearch1").val();
                    } if (search == "EmployeeId") {

                        EmployeeId = $con.find("#txtSearch1").val();
                    } if (search == "EmployeeName") {

                        EmployeeName = $con.find("#txtSearch1").val();
                    }
                    if (search == "Shop") {

                        Shop = $con.find("#txtSearch1").val();
                    }
                }
                var search = $con.find("#ddl_d_SearchBy2").val();
                if (search != "") {
                    if (search == "InvoiceId") {
                        InvoiceId = $con.find("#txtSearch2").val();
                    } if (search == "ProductId") {

                        ProductId = $con.find("#txtSearch2").val();
                    } if (search == "ProductName") {

                        ProductName = $con.find("#txtSearch2").val();
                    }
                    if (search == "Barcode") {

                        Barcode = $con.find("#txtSearch2").val();
                    }
                }
                priceFrom = $con.find("#txt_s_PriceFrom").val();
                priceTo = $con.find("#txt_s_PriceTo").val();
                categoryId = getHierarchySelectedValue("hr_s_Category", container);
            }

            var sell = "";
            if ($con.find("#Checkbox1" + container).prop('checked') && $con.find("#Checkbox2" + container).prop('checked'))
                sell = "";
            else if (!$con.find("#Checkbox1" + container).prop('checked') && $con.find("#Checkbox2" + container).prop('checked'))
                sell = false;
            else if ($con.find("#Checkbox1" + container).prop('checked') && !$con.find("#Checkbox2" + container).prop('checked'))
                sell = true;

            var DTO = { 'Datetype': $con.find("#ddl_d_GroupBy").val(), 'supplierid': $con.find("#hd_d_PersonId").val(),
                'IsClient': isCustomer, 'SupplierName': name, 'code': code, 'EmployeeId': EmployeeId,
                'EmployeeName': EmployeeName, 'Shop': Shop, 'InvoiceId': InvoiceId, 'ProductId': ProductId,
                'ProductName': ProductName, 'Barcode': Barcode,
                'InvoiceDateStart': $con.find("#txt_s_InvoiceMonthStart").val() + "/" + $con.find("#txt_s_InvoiceDayStart").val(),
                'InvoiceDateEnd': $con.find("#txt_s_InvoiceMonthEnd").val() + "/" + $con.find("#txt_s_InvoiceDayEnd").val(),
                'InvoiceYearStart': $con.find("#txt_s_InvoiceYearStart").val(),
                'InvoiceYearEnd': $con.find("#txt_s_InvoiceYearEnd").val(),
                'PriceFrom': priceFrom, 'PriceTo': priceTo, 'Order': sell,
                'PreOrder': ($con.find("#Checkbox3" + container).length > 0 ? $con.find("#Checkbox3" + container).prop('checked') : ""),
                'Broken': ($con.find("#Checkbox4" + container).length > 0 ? $con.find("#Checkbox4" + container).prop('checked') : ""),
                'CategoryId': categoryId, 'shopid': $("#userDefault").find("#ddl_s_Branch").val(),
                'counterid': $("#userDefault").find("#ddl_m_Counter").val()
            };

            // var DTO = { 'shopid': $("#userDefault").find("#ddl_s_Branch").val() };

            $.ajax({
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(DTO),
                type: "Post",
                url: "Management/GetSaleChart",
                success: function (response) {
                    var testArray = [7, 6, 9, 14, 18, 21, 25, 26, 23, 18, 13, 9];
                    if (!isAuthenticated(response))
                        return;
                    if (response != null) {
                        var displayBy = $con.find("#ddl_d_DisplayBy").val();
                        var position = "right";
                        var parent = [];
                        var categories = [];
                        var amountList = [];
                        var quantityList = [];
                        if (response.name == "Month")
                            categories = PERSIAN_MONTHS;
                        else
                            if (response.name == "Season")
                                categories = ["بهار", "تابستان", "پاییز", "زمستان"];

                        $.each(response.data, function () {

                            //   $.each(this.amount, function () {
                            //  if (response.name == "Month") {
                            amountList.push(this.amount);
                            if (response.name != "Month" && response.name != "Season" && response.name != "Week" && response.name != "Day") {
                                categories.push(this.name);
                            }
                            if (response.name == "Year") {
                                categories = this.name;
                            }
                            //  }
                            //                                    else {
                            //                                        categories.push(this.amount[0].xAxis)
                            //                                        amountList.push(this.amount[0].data);
                            //                                    }
                            quantityList.push(this.quantity);
                            //    });
                            var amount = {
                                name: this.name + " مبلغ",
                                // color: '#89A54E',
                                type: 'column',
                                data: this.amount
                            };
                            var quantity = {
                                name: this.name + " تعداد",
                                // color: '#4572A7',

                                type: 'spline',
                                yAxis: 1,
                                data: this.quantity
                            };
                            if ($con.find("#ddl_d_DisplayBy").val() == "Amount")
                                parent.push(amount);
                            else if ($con.find("#ddl_d_DisplayBy").val() == "Count")
                                parent.push(quantity);
                            else {
                                parent.push(amount);
                                parent.push(quantity);
                            }

                        });

                        if (parent.length > 0) {

                            //                            $.plot($con.find("#Div_SaleChart"), parent,
                            //                           {
                            //                               // bars: { show: true, barWidth: 0.5 },
                            //                               xaxis: { tickDecimals: "number" },
                            //                               //  alignTicksWithAxis: position == "right" ? 1 : null,
                            //                               yaxes: [{ min: 0 },
                            //                        {
                            //                            // align if we are to the right
                            //                            alignTicksWithAxis: position == "right" ? 1 : null,
                            //                            position: position

                            //                        }],
                            //                               legend: { noColumns: 2 }
                            //                           });

                            $con.find('#Div_SaleChart').highcharts({
                                title: {
                                    text: ' ',
                                    x: -20 //center
                                },
                                credits: {
                                    enabled: false
                                },
                                colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                                chart: {
                                    //                                type: 'column',
                                    backgroundColor: {
                                        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                                        stops: [[0, 'rgb(255, 255, 255)'], [1, 'rgb(240, 240, 255)']]
                                    },
                                    plotBackgroundColor: 'rgba(255, 255, 255, .9)',
                                    plotShadow: true,
                                    plotBorderWidth: 1
                                },
                                yAxis: [{ // Primary yAxis
                                    labels: {
                                        // format: '{value}°C',
                                        style: {
                                            color: '#89A54E'
                                        }
                                    },
                                    title: {
                                        text: 'مبلغ',
                                        style: {
                                            color: '#89A54E'
                                        }
                                    }
                                }, { // Secondary yAxis
                                    title: {
                                        text: 'تعداد',
                                        style: {
                                            color: '#4572A7'
                                        }
                                    },
                                    labels: {
                                        //  format: '{value} mm',
                                        style: {
                                            color: '#4572A7'
                                        }
                                    },
                                    opposite: true
                                }],

                                //                            title: {
                                //                                text: ''
                                //                            },

                                xAxis: {
                                    categories: categories,
                                    labels: {
                                        rotation: -35,
                                        align: 'right',
                                        style: {
                                            fontSize: '13px',
                                            fontFamily: 'Verdana, sans-serif'
                                        }
                                    }
                                },
                                //                            yAxis: {
                                //                                title: {
                                //                                    text: 'مبلغ فروش'
                                //                                }
                                //                            },
                                //                            tooltip: {
                                //                                valueSuffix: 'تومان'
                                //                            },
                                //                            plotOptions: {
                                //                                line: {
                                //                                    dataLabels: {
                                //                                        enabled: true
                                //                                    },
                                //                                    enableMouseTracking: false
                                //                                }
                                //                            },
                                series: parent
                                // [{
                                //                                name: 'مبلغ ',
                                //                                color: 'green',
                                //                                type: 'spline',
                                //                                data: parent,
                                //                                tooltip: {
                                //                                    valueSuffix: ' تومان'
                                //                                }
                                //                            }]

                            });


                        }
                        else {
                            $.plot($con.find("#Div_SaleChart"), [[0, 0]],
                        {
                            // bars: { show: false, barWidth: 0.5 },
                            xaxis: { tickDecimals: "number" },
                            //    alignTicksWithAxis: position == "right" ? 1 : null,
                            yaxes: [{ min: 0 },
                        {
                            // align if we are to the right
                            alignTicksWithAxis: position == "right" ? 1 : null,
                            position: position
                        }],
                            legend: { position: 'sw' }
                        });
                        }
                    }
                    else {
                        $.plot($con.find("#Div_SaleChart"), [[0, 0]],
                        {
                            bars: { show: false, barWidth: 0.5 },
                            xaxis: { tickDecimals: "number" }
                        });
                    }
                },
                error: function (response) { alert(response.responseText); }
            });
            return false;
        }

    }
    //----------------new CustomerChart end-------------------

    //----------------new SendSMS begin-------------------
    function GetSMSLenght(container) {
        var $con = $("#" + container);
        var len = 0;
        $con.find("#txt_m_Body li").each(function () {
            if ($(this).attr("char") != undefined && $(this).attr("char") != "")
                len += $(this).attr("char") * 1;
            else
                len += $(this).find("a").html().length * 1 + 1;
        });

        $con.find("#txt_m_Page").val((parseInt(parseInt(len) / 70) + 1));
        $con.find("#txt_m_Count").val(Math.abs(70 - (len % 70)));
    }

    function sendEmailSms(container) {
        var $con = $("#" + container);
        $con.find('#moreFilter').slideUp('fast');
        $con.find('.toggle-more-filters').click(function () {
            $(this).toggleClass("open")
            //            $con.find('#moreFilter').removeClass('invisible');
            $con.find('#moreFilter').slideToggle(function () {
                // Animation complete.
            });
        });
        bindXmlDropDownData({ id: "ddl_s_Title", container: container, path: "Customer/smsTitle", canmodify: true, headertext: "انتخاب موضوع", async: false, css: "selectsmall1 required validate" });
        $container = $con.find("#CustomerForSMSContent");
        bindHierarchyData({ id: "divCustomerForSMSAddress", container: container, table: "address" });
        //bindDropDown("ddl_d_SearchByProduct", container);
        bindHierarchyData({ id: "div_Category", container: container, table: "Category" });
        //bindDropDown("SearchBy", container, "evente");
        $con.find("#SearchBy").val("Name");
        $con.find("#SendAll").button({ icons: {
            primary: "ui-icon-disk"
        }
        });
        $con.find("#SendSelected").button({ icons: {
            primary: "ui-icon-disk"
        }
        });
        $con.find("#txt_m_Body").keydown(function () {
            GetSMSLenght(container);
        });
        $con.find("#ddl_TitleSMS").html($con.find("#ddl_s_Title select").html());
        $con.find("#txt_LastDateSMSFrom").datepicker({
            changeMonth: true,
            changeYear: true,
            onSelect: function (dateText, inst) {
                $con.find('#txt_LastDateSMSTo').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
            }
        });

        $con.find("#txt_LastDateSMSTo").datepicker({ changeMonth: true, changeYear: true });

        $con.find("#txt_s_PaymenytLastFrom").datepicker({
            changeMonth: true,
            changeYear: true,
            onSelect: function (dateText, inst) {
                $con.find('#txt_s_PaymenytLastTo').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
            }
        });

        $con.find("#txt_s_PaymenytLastTo").datepicker({ changeMonth: true, changeYear: true });

        $con.find("#CustomerForSMSSearchRegDateStart").datepicker({
            changeMonth: true,
            changeYear: true,
            onSelect: function (dateText, inst) {
                $con.find('#CustomerForSMSSearchRegDateEnd').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
            }
        });

        $con.find("#CustomerForSMSSearchRegDateEnd").datepicker({ changeMonth: true, changeYear: true });

        $con.find("#txt_s_BuytLastFrom").datepicker({
            changeMonth: true,
            changeYear: true,
            onSelect: function (dateText, inst) {
                $con.find('#txt_s_BuytLastTo').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
            }
        });

        $con.find("#txt_s_BuytLastTo").datepicker({ changeMonth: true, changeYear: true });

        $con.find("#divdialogCustomerForSMS").dialog({ autoOpen: false }).dialog({ width: 600 });
        $con.find("#PageSize").off().on('change', function () { getCustomerForSMSList({ container: container }); });
        $con.find("#divslider").unbind('click').click(function () { sliderClick("divCustomerForSMSsearch"); sliderClick("moreFilter"); });
        $con.find("#CustomerForSMSAdvanceSearchbt").button({ icons: {
            primary: "ui-icon-search"
        }
        }).unbind('click').click(function () { sortid = 'AccountId desc'; getCustomerForSMSList({ container: container }); });

        $con.find("#ddl_s_Shop").html($("#ddl_s_Branch").html()).val("");
        //----
        var selectedTxt = "";


        // $con.find("#ulSmsItems").droppable();

        $con.find("#txt_m_Body").sortable();
        //        $con.find("span[name='smsItems']").off().on("click", function () {
        //            $(this).parent("li").remove();
        //            GetSMSLenght(container);
        //        })


        $con.find("#btn_editContent").button({
            text: false,
            icons: {
                primary: "ui-icon-refresh"
            }
        })
        .click(function () {
            $con.find("#btn_editContent").addClass("invisible");
            selectedTxt.html($con.find("#txt_content").val());
            GetSMSLenght(container);
        });
        //----
        bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "Management", id: "ddl_registerer", container: container, headertext: "انتخاب کارمند", selectedindex: 0 });

        $con.find("#btn_regDate, #btn_address, #btn_product, #btn_shop, #btn_category, #btn_subject, #btn_registerer," +
                      " #btn_lastSentDate, #lastBuyDate").button({
                          text: false,
                          icons: {
                              primary: "ui-icon-circle-check"
                          }
                      })
        .click(function () {
            var options;
            if ($(this).text().indexOf("شامل") != "-1") {
                options = {
                    label: "به جز",
                    icons: {
                        primary: "ui-icon-circle-minus"
                    }
                };
                $(this).parent().removeClass("frog").addClass("red");
            } else {
                options = {
                    label: "شامل",
                    icons: {
                        primary: "ui-icon-circle-check"
                    }
                };
                $(this).parent().removeClass("red").addClass("frog");
            }
            $(this).button("option", options);
        }).parent().addClass("frog");
    }

    function loadSendEmail(container, first) {
        if (first) {
            sendEmailSms(container);
            $con = $("#" + container);

            $con.find("#SendAll").unbind('click').click(function () {
                if (validateAll($("#divSmsSubject")))
                    if (confirm("Are you Sure?!")) { SendEmailForAll({ container: container }); }
            });
            $con.find("#SendSelected").unbind('click').click(function () {
                if (validateAll($("#divSmsSubject")))
                    if (confirm("Are you Sure?!")) { SendEmailForSelected(container); }
            });


            $con.find("#emailBody").html("<textarea class='editor' name='text1'>" +
                "</textarea>");
            $(".editor").tinymce({
                // Location of TinyMCE script
                script_url: 'jscripts/tiny_mce/tiny_mce.js',
                width: "100%",
                height: "500px",
                directionality: "rtl",
                theme: "advanced",
                verify_html: false,
                plugins: "pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,autosave",
                theme_advanced_buttons1: "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
                theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
                theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
                theme_advanced_buttons4: "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak,restoredraft,codehighlighting,netadvimage",
                theme_advanced_toolbar_location: "top",
                theme_advanced_toolbar_align: "right",
                theme_advanced_statusbar_location: "bottom",
                theme_advanced_resizing: false,
                // Example content CSS (should be your site CSS)
                content_css: '../../Scripts/tinymce/css/content.css',
                convert_urls: false
            });
            $con.find("#ulSmsItems li,#li_text").bind("click", function () {
                // $con.find(".editor").last("p").append("<%name%>");
                $con.find("[name=text1]").append("<span>%" + $(this).attr("name") + "%</span>");
                if ($(this).attr("id") == "li_text") {
                    $con.find("#txt_m_Body").append("<li style='margin:3px;' name='" + $(this).attr("name") + "' class='ui-state-default ui-corner-top' ><a name='content' href='#' class='ui-tabs-anchor' >" + $con.find("#txt_content").val() + "</a> <span name='smsItems' class='ui-icon ui-icon-close'>Remove Tab</span></li>");
                    $con.find("#txt_m_Body").find("a[name='content']").unbind('click').click(function () {
                        selectedTxt = SelectContent(this, container);
                        $con.find("#btn_editContent").removeClass("invisible");
                    });
                }
                else
                    $con.find("#txt_m_Body").append("<li style='margin:5px;' char='" + $(this).attr("char") + "' name='" + $(this).attr("name") + "' class='ui-state-default ui-corner-top' ><a href='#' class='ui-tabs-anchor' >" + $(this).find("a").html() + "</a> <span name='smsItems' class='ui-icon ui-icon-close'>Remove Tab</span></li>");

                $con.find("span[name='smsItems']").off().on("click", function () {
                    $(this).parent("li").remove();
                    GetSMSLenght(container);
                })
            }).attr("style", "margin:3px;");

        }

    }

    function loadSendSMS(container, first) {
        if (first) {
            sendEmailSms(container);
            var $con = $("#" + container);

            $con.find("#SendAll").unbind('click').click(function () {
                if (validateAll($("#divSmsSubject")))
                    if (confirm("Are you Sure?!")) { SendMessageForAll({ container: container }); }
            });
            $con.find("#SendSelected").unbind('click').click(function () {
                if (validateAll($("#divSmsSubject")))
                    if (confirm("Are you Sure?!")) { SendMessageForSelected(container); }
            });
            $con.find("#btn_showCredit").button().unbind('click').click(function () {
                getCredit();
            });

            $con.find("#ulSmsItems li,#li_text").draggable({ cursor: "move", revert: true }).attr("style", "margin:3px;");
            $con.find("#txt_m_Body").droppable({
                accept: $("#ulSmsItems li,#li_text"),
                //                activeClass: "ui-state-hover",
                //                hoverClass: "ui-state-active",
                //   over: function (event, ui) { alert("over"); },
                drop: function (event, ui) {
                    if (ui.draggable.attr("id") == "li_text") {
                        $con.find("#txt_m_Body").append("<li style='margin:3px;' name='" + ui.draggable.attr("name") + "' class='ui-state-default ui-corner-top' ><a name='content' href='#' class='ui-tabs-anchor' >" + $con.find("#txt_content").val() + "</a> <span name='smsItems' class='ui-icon ui-icon-close'>Remove Tab</span></li>");
                        $con.find("#txt_m_Body").find("a[name='content']").unbind('click').click(function () {
                            selectedTxt = SelectContent(this, container);
                            $con.find("#btn_editContent").removeClass("invisible");
                        });
                    }
                    else
                        $con.find("#txt_m_Body").append("<li style='margin:5px;' char='" + ui.draggable.attr("char") + "' name='" + ui.draggable.attr("name") + "' class='ui-state-default ui-corner-top' ><a href='#' class='ui-tabs-anchor' >" + ui.draggable.find("a").html() + "</a> <span name='smsItems' class='ui-icon ui-icon-close'>Remove Tab</span></li>");
                    GetSMSLenght(container);

                    $con.find("span[name='smsItems']").off().on("click", function () {
                        $(this).parent("li").remove();
                        GetSMSLenght(container);
                    })
                }
            });

        }
    }

    function getCredit() {
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "Post",
            url: "Management/GetCredit",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function SelectContent(dis, container) {
        $con = $("#" + container);
        $dis = $(dis);
        $con.find("#txt_content").val($dis.html());
        return $dis;
        //        $con.find("#selectedLableUId").val($dis.prop("uniqueNumber"));
        //        $(this).attr('id', $dis.prop("uniqueNumber"));
    }
    function getCustomerForSMSList(pageoption) {
        var $con = $("#" + pageoption.container);
        var first = true;
        var take = $con.find("#PageSize").val();
        var skip = 0;
        var page_index = 0
        var code = "", name = "", regname = "", Introducer = "", Mobile = "", Phone = "", Barcode = "", ProductName = "", ProductCode = "", email = "";

        var search = $con.find("#SearchBy").val();
        if (search == "Code") {

            code = $con.find("#CustomerForSMStxtSearch").val();
        }
        else if (search == "Email") {

            email = $con.find("#CustomerForSMStxtSearch").val();
        }
        else if (search == "Name") {

            name = $con.find("#CustomerForSMStxtSearch").val();
        } else if (search == "RegName") {

            regname = $con.find("#CustomerForSMStxtSearch").val();
        } else if (search == "IntroducerName") {

            Introducer = $con.find("#CustomerForSMStxtSearch").val();
        }
        else if (search == "Mobile") {

            Mobile = $con.find("#CustomerForSMStxtSearch").val();
        }
        else if (search == "Phone") {

            Phone = $con.find("#CustomerForSMStxtSearch").val();
        }

        var searchProduct = $con.find("#ddl_d_SearchByProduct").val();
        if (searchProduct == "Barcode") {
            Barcode = $con.find("#txt_s_Product").val();
        } else if (searchProduct == "Name") {

            ProductName = $con.find("#txt_s_Product").val();
        } else if (searchProduct == "Code") {

            ProductCode = $con.find("#txt_s_Product").val();
        }



        var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': $con.find("#ddl_s_Sort").val() + " " + $con.find("#ddl_s_Sorting").val(), 'code': code, 'namefamily': name, 'introducer': Introducer, 'registerername': regname, 'Mobile': Mobile, 'Phone': Phone,
            'agefrom': $con.find("#CustomerForSMSSearchAgeStart").val(), 'ageto': $con.find("#CustomerForSMSSearchAgeEnd").val(), 'regdatefrom': $con.find("#CustomerForSMSSearchRegDateStart").val(), 'regdateto': $con.find("#CustomerForSMSSearchRegDateEnd").val(),
            'gender': $con.find("#ddl_s_Gender").val(), 'shopId': $con.find("#ddl_s_Shop").val(), 'LastDateSMSFrom': $con.find("#txt_LastDateSMSFrom").val(), 'LastDateSMSTo': $con.find("#txt_LastDateSMSTo").val(), 'subjectsms': $con.find("#ddl_TitleSMS").val(), 'AddressId': getHierarchySelectedValue("divCustomerForSMSAddress", pageoption.container),
            'barcode': Barcode, 'productname': ProductName, 'productcode': ProductCode, 'categoryid': getHierarchySelectedValue("div_Category", pageoption.container),
            'PaymenytLastFrom': $con.find("#txt_s_PaymenytLastFrom").val(), 'PaymenytLastTo': $con.find("#txt_s_PaymenytLastTo").val(), 'PaymentAmountFrom': $con.find("#txt_s_PaymentAmountFrom").val(), 'PaymentAmountTo': $con.find("#txt_s_PaymentAmountTo").val(),
            'BuyAmountFrom': $con.find("#txt_s_BuyAmountFrom").val(), 'BuyAmountTo': $con.find("#txt_s_BuyAmountTo").val(), 'BuyIntroducerFrom': $con.find("#txt_s_BuyIntroducerFrom").val(), 'BuyIntroducerTo': $con.find("#txt_s_BuyIntroducerTo").val(),
            'DebtFrom': $con.find("#txt_s_DebtFrom").val(), 'DebtTo': $con.find("#txt_s_DebtTo").val(), 'VocherBuyFrom': $con.find("#txt_s_VocherBuyFrom").val(), 'VocherBuyTo': $con.find("#txt_s_VocherBuyTo").val(),
            'ChequeNotFrom': $con.find("#txt_s_ChequeNotFrom").val(), 'ChequeNotTo': $con.find("#txt_s_ChequeNotTo").val(), 'BuyLastFrom': $con.find("#txt_s_BuytLastFrom").val(), 'BuyLastTo': $con.find("#txt_s_BuytLastTo").val(),
            'regDate': $con.find("#btn_regDate").text().indexOf("شامل") != "-1" ? true : false, 'address': $con.find("#btn_address").text().indexOf("شامل") != "-1" ? true : false,
            'product': $con.find("#btn_product").text().indexOf("شامل") != "-1" ? true : false, 'shop': $con.find("#btn_shop").text().indexOf("شامل") != "-1" ? true : false,
            'category': $con.find("#btn_category").text().indexOf("شامل") != "-1" ? true : false, 'subject': $con.find("#btn_subject").text().indexOf("شامل") != "-1" ? true : false,
            'registerer': $con.find("#btn_registerer").text().indexOf("شامل") != "-1" ? true : false, 'lastSentDate': $con.find("#btn_lastSentDate").text().indexOf("شامل") != "-1" ? true : false,
            'lastBuy': $con.find("#lastBuyDate").text().indexOf("شامل") != "-1" ? true : false, 'registererId': $con.find("#ddl_registerer").val(), 'email': email
        };
        // alert($con.find("#btn_product").text())
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/GetCustomerForSMSList",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var opt = CustomerForSMSgetOptionsFrom(response.count, pageoption);
                $con.find("#paging").pagination(response.count, opt);
                CustomerForSMSpageselectCallback(0, response, pageoption, first);
            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function CustomerForSMSgetOptionsFrom(count, pageoption) {
        var $con = $("#" + pageoption.container);
        var opt = { callback: CustomerForSMSpageselectCallback };
        $con.find("input:text").each(function () {
            opt[this.name] = this.className.match(/numeric/) ? parseInt(this.value) : this.value;
        });
        opt.prev_show_always = false;
        opt.next_show_always = false;
        if ((count) < $con.find("#PageSize").val())
            $con.find("#PageSize").css("display", "none");
        else {
            $con.find("#PageSize").css("display", "inline");
        }
        opt.items_per_page = $con.find("#PageSize").val();
        opt.prev_text = "قبلی";
        opt.next_text = "بعدی";
        opt.container = pageoption;
        return opt;
    }
    function buildCustomerForSMSList(jq, pageoption) {
        var $con = $("#" + pageoption.container);
        jq = jq.results;
        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var gender = val.Gender == true ? 'آقای' : 'خانم';
            var introducerName = val.introducerName == null ? "" : val.introducerName;
            ItemList += "<tr id='tr" + val.AccountId + "'>" +
                "<td><ul class=''>" +
                "<li class='line formControl'>" +
                "<div class=' unit size1of5'>" +
                "<label class='labelPadding '>" +
                "مشتری  " + val.Code + " : </label><span class='cursor' name='subTab' menuName='a_CustomerList' id='" + val.AccountId + "'>" + gender + " " + val.Name + " " + val.Family + "</span> <input type='hidden' id='hd_customeramily' value='" + val.Family + "' />" +
                "</div>" +
                "<div class=' unit size1of5'>" +
                "<label > معرف " + (val.introducerCode == null ? "" : val.introducerCode) + " : </label><label class=''>" + (val.introducerId == null ? "" : ("<span class='cursor' name='subTab' menuName='a_CustomerList' id='" + val.introducerId + "'>")) + (val.introducerName == null ? "" : val.introducerName) + "  " + (val.introducerFamily == null ? "" : val.introducerFamily) + (val.introducerId == null ? "" : "</span>") + "</label>" +
                "</div>" +
                "<div class=' unit size1of6'>" +
                "<label > ثبت نام کننده : </label><label >" + (val.regFamily != null ? (val.regName + "  " + val.regFamily) : "") + "</label>" +
                "</div>" +
                "<div class=' unit size1of7'>" +
                "<label >سن : </label><label >" + val.age + "</label>" +
                "</div>" +
                "<div class=' unit size1of7'>" +
                "<label >تاریخ ثبت نام : </label><label class=' label100'><span date='" + val.regdate + "' class='date'>" + val.regdate + "</span></label>" +
                "</div>" +
                "<div class=' unit size1of7'>" +
                   (val.Email != null ? ("<input type='checkbox' id='email" + val.AccountId + "' name='email' email='" + val.Email + "' /><label name='email' for='email" + val.AccountId + "'>" + val.Email + "</label>") : "") +
                "</div>" +
                "</li><br/>" +
                "<li class='line formControl''>" +
                "<div class=' unit size1of6'>" +
                "<label class='labelPadding'>خرید خالص : </label><label><span class='digit'>" + val.NetBuy + "</span> تومان</label>" +
                "</div>" +
                "<div class=' unit size1of6'>" +
                "<label >پرداختی خالص : </label><label><span class='digit'>" + val.NetPayment + "</span> تومان</label>" +
                "</div>" +
                "<div class=' unit size1of6'>" +
                "<label>چکهای پرداختی : </label><label><span class='digit'>" + (val.ReceivedCheque) + "</span> تومان</label>" +
                "</div>" +
                "<div class=' unit size1of6'>" +
                "<label>چکهای پاس نشده : </label><label><span class='digit'>" + val.ChequeNotPassed + "</span> تومان</label>" +
                "</div>" +
                "<div class=' unit size1of6'>" +
                "<label >بدهی کل : </label><label><span class='digit'>" + (val.NetBuy * 1 - val.NetPayment * 1) + "</span> تومان</label>" +
                "</div>" +
                "<div class=' unit size1of6'><label class='unit label15'>همراه :</label><ul class=' unit '> ";
            for (var j = 0; j < val.Mobile.length; j++) {
                var num = val.Mobile[0, j];
                ItemList += "<li>" +
                    "<input type='checkbox' name='mobileNum' id='cb_d_Mobile_" + num + "' ><label name='CellNumber' for='cb_d_Mobile_" + num + "'>" + num + "</label>" +
                        "</li>";
            }
            ItemList += "</ul></div></li><br/>" +
                "<li class='line formControl''>" +
                "<div class=' unit size1of6'>" +
                "<label>موجودی کارت خرید : </label><label><span class='digit'>" + val.VoucherPower + "</span> تومان</label>" +
                "</div>" +
                "<div class=' unit size1of6'>" +
                "<label>پرداختی کارت خرید : </label><label><span class='digit'>" + (val.paidVoucher * 1 - val.ReceivedVoucher * 1) + "</span> تومان</label>" +
                "</div>" +
                "<div class=' unit size1of6'>" +
                "<label class='labelPadding'>آخرین خرید : </label><label>" + (val.LastBuy != null ? ("<span class='date' date='" + val.LastBuy + "'>" + val.LastBuy + "</span>") : "") + "</label>" +
                "</div>" +
                "<div class=' unit size1of6'>" +
                "<label >آخرین برداشت  : </label><label>" + (val.LastPayment != null ? ("<span class='date' date='" + val.LastPayment + "'>" + val.LastPayment + "</span>") : "") + "</label>" +
                "</div>" +
                "<div class=' unit size1of6'>" +
                "<label> خرید معرفی شده ها : </label><label><span class='digit'>" + val.BuyIntroducer + "</span> تومان</label>" +
                "</div>" +
                "<div class=' unit size1of6'>" +
                "<label>  واریزی معرفی شده ها : </label><label><span class='digit'>" + val.PaymentIntroducer + "</span> تومان</label>" +
                "</div>" +
                "</li>" +
               "</ul></td></tr>";
        }
        $con.find("#CustomerForSMSList").html(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
        // $con.find("#CustomerForSMSList").parent().tableScroll({ height: 380 });
        $con.find("input[name='mobileNum']").button();
        $con.find("input[name='email']").button();
        //  TableAlter(pageoption.container);
        $con.find("tr[id*=tr]").dblclick(function () {
            // ClickCustomerForSMS(this, pageoption)
        });
        $con.find("[name=subTab]").unbind().click(function () {
            var $d = $(this);
            createSubTab({ name: $d.attr("menuName"), tabName: $d.html(), id: $d.attr("id") });
        });
        if (pageoption.container == "divdialogCustomerForSMS")
            $con.dialog('open');
    }

    function CustomerForSMSpageselectCallback(page_index, jq, pageoption, first) {
        var $con = $("#" + pageoption.container);
        if (first) {
            buildCustomerForSMSList(jq, pageoption);
        }
        else {
            first = false;
            var items_per_page = $con.find("#PageSize").val();
            var itemcontent = '';
            var take = items_per_page;
            var skip = page_index == 0 ? 0 : (page_index * take);
            var code = "", name = "", regname = "", Introducer = "", Mobile = "", Phone = "", Barcode = "", ProductName = "", ProductCode = "", email = "";

            var search = $con.find("#SearchBy").val();
            if (search == "Code") {

                code = $con.find("#CustomerForSMStxtSearch").val();
            } else if (search == "Name") {

                name = $con.find("#CustomerForSMStxtSearch").val();
            }
            else if (search == "Email") {

                email = $con.find("#CustomerForSMStxtSearch").val();
            }
            else if (search == "RegName") {

                regname = $con.find("#CustomerForSMStxtSearch").val();
            } else if (search == "IntroducerName") {

                Introducer = $con.find("#CustomerForSMStxtSearch").val();
            }
            else if (search == "Mobile") {

                Mobile = $con.find("#CustomerForSMStxtSearch").val();
            }
            else if (search == "Phone") {

                Phone = $con.find("#CustomerForSMStxtSearch").val();
            }

            var searchProduct = $con.find("#ddl_d_SearchByProduct").val();
            if (searchProduct == "Barcode") {

                Barcode = $con.find("#txt_s_Product").val();
            } else if (searchProduct == "Name") {

                ProductName = $con.find("#txt_s_Product").val();
            } else if (searchProduct == "Code") {

                ProductCode = $con.find("#txt_s_Product").val();
            }


            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': $con.find("#ddl_s_Sort").val() + " " + $con.find("#ddl_s_Sorting").val(), 'code': code, 'namefamily': name, 'introducer': Introducer, 'registerername': regname, 'Mobile': Mobile, 'Phone': Phone,
                'agefrom': $con.find("#CustomerForSMSSearchAgeStart").val(), 'ageto': $con.find("#CustomerForSMSSearchAgeEnd").val(), 'regdatefrom': $con.find("#CustomerForSMSSearchRegDateStart").val(), 'regdateto': $con.find("#CustomerForSMSSearchRegDateEnd").val(),
                'gender': $con.find("#ddl_s_Gender").val(), 'shopId': $con.find("#ddl_s_Shop").val(), 'LastDateSMSFrom': $con.find("#txt_LastDateSMSFrom").val(), 'LastDateSMSTo': $con.find("#txt_LastDateSMSTo").val(), 'subjectsms': $con.find("#ddl_TitleSMS").val(), 'AddressId': getHierarchySelectedValue("divCustomerForSMSAddress", pageoption.container),
                'barcode': Barcode, 'productname': ProductName, 'productcode': ProductCode, 'categoryid': getHierarchySelectedValue("div_Category", pageoption.container),
                'PaymenytLastFrom': $con.find("#txt_s_PaymenytLastFrom").val(), 'PaymenytLastTo': $con.find("#txt_s_PaymenytLastTo").val(), 'PaymentAmountFrom': $con.find("#txt_s_PaymentAmountFrom").val(), 'PaymentAmountTo': $con.find("#txt_s_PaymentAmountTo").val(),
                'BuyAmountFrom': $con.find("#txt_s_BuyAmountFrom").val(), 'BuyAmountTo': $con.find("#txt_s_BuyAmountTo").val(), 'BuyIntroducerFrom': $con.find("#txt_s_BuyIntroducerFrom").val(), 'BuyIntroducerTo': $con.find("#txt_s_BuyIntroducerTo").val(),
                'DebtFrom': $con.find("#txt_s_DebtFrom").val(), 'DebtTo': $con.find("#txt_s_DebtTo").val(), 'VocherBuyFrom': $con.find("#txt_s_VocherBuyFrom").val(), 'VocherBuyTo': $con.find("#txt_s_VocherBuyTo").val(),
                'ChequeNotFrom': $con.find("#txt_s_ChequeNotFrom").val(), 'ChequeNotTo': $con.find("#txt_s_ChequeNotTo").val(), 'BuyLastFrom': $con.find("#txt_s_BuytLastFrom").val(), 'BuyLastTo': $con.find("#txt_s_BuytLastTo").val(),
                'regDate': $con.find("#btn_regDate").text().indexOf("شامل") != "-1" ? true : false, 'address': $con.find("#btn_address").text().indexOf("شامل") != "-1" ? true : false,
                'product': $con.find("#btn_product").text().indexOf("شامل") != "-1" ? true : false, 'shop': $con.find("#btn_shop").text().indexOf("شامل") != "-1" ? true : false,
                'category': $con.find("#btn_category").text().indexOf("شامل") != "-1" ? true : false, 'subject': $con.find("#btn_subject").text().indexOf("شامل") != "-1" ? true : false,
                'registerer': $con.find("#btn_registerer").text().indexOf("شامل") != "-1" ? true : false, 'lastSentDate': $con.find("#btn_lastSentDate").text().indexOf("شامل") != "-1" ? true : false,
                'lastBuy': $con.find("#lastBuyDate").text().indexOf("شامل") != "-1" ? true : false, 'registererId': $con.find("#ddl_registerer").val(), 'email': email
            };

            $.ajax({
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(DTO),
                type: "Post",
                url: "Management/GetCustomerForSMSList",
                success: function (response) {
                    if (!isAuthenticated(response))
                        return;
                    buildCustomerForSMSList(response, pageoption);
                },
                error: function (response) { alert(response.responseText); }
            });
            return false;
        }
        Sort(getCustomerForSMSList, pageoption);
    }

    function SendMessageForSelected(container) {
        var $con = $("#" + container);
        var header = [];
        var messageBody = "";
        $con.find("ul[id*=txt_m_Body] li").each(function () {
            if ($(this).attr("name") == "name")
                messageBody += "<%name%>";
            else if ($(this).attr("name") == "family")
                messageBody += "<%family%>";
            else if ($(this).attr("name") == "amount")
                messageBody += "<%amount%>";
            else if ($(this).attr("name") == "voucherAmount")
                messageBody += "<%voucherAmount%>";
            else if ($(this).attr("name") == "text")
                messageBody += $(this).find("a[name=content]").html();
            else if ($(this).attr("name") == "title")
                messageBody += "<%title%>";
        });
        if ($(this).find("input[id*='cb_d_Mobile_']:checked").length > 0) {
            $con.find("tr[id*=tr]").each(function () {
                var headerDetail = {};
                var number = [];
                $(this).find("input[id*='cb_d_Mobile_']:checked").each(function () {
                    if (!$(this).attr("checked"))
                        number.push($(this).prop('id').split("_")[3]);
                });
                headerDetail["listNumber"] = number;
                headerDetail["personid"] = $(this).prop('id').replace("tr", "");
                headerDetail["family"] = $(this).find("label[name='Customername']").prop('id');
                headerDetail["sex"] = $(this).find("label[name='Customername']").html().split(" ")[0];
                header.push(headerDetail);
            });
        } else {
            $con.find("tr[id*=tr]").each(function () {
                var headerDetail = {};
                var number = [];

                $(this).find("input[id*='cb_d_Mobile_']").each(function () {
                    if (!$(this).prop("checked"))
                        number.push($(this).prop('id').split("_")[3]);
                });
                if (number.length > 0) {
                    headerDetail["listNumber"] = number;
                    headerDetail["personid"] = $(this).prop('id').replace("tr", "");
                    headerDetail["family"] = $(this).find("[id='hd_customeramily']").val();
                    headerDetail["sex"] = $(this).find("span[id='" + headerDetail["personid"] + "']").html().split(" ")[0];

                    header.push(headerDetail);
                }
            });

        }

        if (header.length == 0) {
            translate("selectCustomers");
            return;
        }
        var DTO = { 'header': header, 'messageBody': messageBody, 'messageHeader': "",
            'Setname': false, 'title': $con.find("#ddl_s_Title select").val(),
            'paging': $con.find("#txt_m_Page").val()
        };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/SendSMSForSelected",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response)
            },
            error: function (response) { alert(response.responseText); }
        });
        return false;

    }


    function SendMessageForAll(pageoption) {
        var $con = $("#" + pageoption.container);
        if ($con.find("#CustomerForSMSList").html() == "") {
            translate("selectCustomers");
            return;
        }
        var first = true;
        var take = $con.find("#PageSize").val();
        var skip = 0;
        var page_index = 0
        var code = "", name = "", regname = "", Introducer = "", Mobile = "", Phone = "", Barcode = "", ProductName = "", email = "",
        ProductCode = "", messageBody = "";
        $con.find("ul[id*=txt_m_Body] li").each(function () {
            if ($(this).prop("name") == "name")
                messageBody += "<%name%>";
            else if ($(this).attr("name") == "family")
                messageBody += "<%family%>";
            else if ($(this).attr("name") == "amount")
                messageBody += "<%amount%>";
            else if ($(this).attr("name") == "voucherAmount")
                messageBody += "<%voucherAmount%>";
            else if ($(this).attr("name") == "text")
                messageBody += $(this).find("a[name=content]").html();
            else if ($(this).attr("name") == "title")
                messageBody += "<%title%>";
        });
        var search = $con.find("#SearchBy").val();
        if (search == "Code") {

            code = $con.find("#CustomerForSMStxtSearch").val();
        } else if (search == "Name") {

            name = $con.find("#CustomerForSMStxtSearch").val();
        }
        else if (search == "Email") {

            email = $con.find("#CustomerForSMStxtSearch").val();
        }
        else if (search == "RegName") {

            regname = $con.find("#CustomerForSMStxtSearch").val();
        } else if (search == "IntroducerName") {

            Introducer = $con.find("#CustomerForSMStxtSearch").val();
        }
        else if (search == "Mobile") {

            Mobile = $con.find("#CustomerForSMStxtSearch").val();
        }
        else if (search == "Phone") {

            Phone = $con.find("#CustomerForSMStxtSearch").val();
        }

        var searchProduct = $con.find("#ddl_d_SearchByProduct").val();
        if (search == "Barcode") {

            Barcode = $con.find("#txt_s_Product").val();
        } else if (searchProduct == "Name") {

            ProductName = $con.find("#txt_s_Product").val();
        } else if (searchProduct == "Code") {

            ProductCode = $con.find("#txt_s_Product").val();
        }

        var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': $con.find("#ddl_s_Sort").val() + " " + $con.find("#ddl_s_Sorting").val(), 'code': code, 'namefamily': name, 'introducer': Introducer, 'registerername': regname, 'Mobile': Mobile, 'Phone': Phone,
            'agefrom': $con.find("#CustomerForSMSSearchAgeStart").val(), 'ageto': $con.find("#CustomerForSMSSearchAgeEnd").val(), 'regdatefrom': $con.find("#CustomerForSMSSearchRegDateStart").val(), 'regdateto': $con.find("#CustomerForSMSSearchRegDateEnd").val(),
            'gender': $con.find("#ddl_s_Gender").val(), 'shopId': $con.find("#ddl_s_Shop").val(), 'LastDateSMSFrom': $con.find("#txt_LastDateSMSFrom").val(), 'LastDateSMSTo': $con.find("#txt_LastDateSMSTo").val(), 'subjectsms': $con.find("#ddl_TitleSMS").val(), 'AddressId': getHierarchySelectedValue("divCustomerForSMSAddress", pageoption.container),
            'barcode': Barcode, 'productname': ProductName, 'productcode': ProductCode, 'categoryid': getHierarchySelectedValue("div_Category", pageoption.container),
            'PaymenytLastFrom': $con.find("#txt_s_PaymenytLastFrom").val(), 'PaymenytLastTo': $con.find("#txt_s_PaymenytLastTo").val(), 'PaymentAmountFrom': $con.find("#txt_s_PaymentAmountFrom").val(), 'PaymentAmountTo': $con.find("#txt_s_PaymentAmountTo").val(),
            'BuyAmountFrom': $con.find("#txt_s_BuyAmountFrom").val(), 'BuyAmountTo': $con.find("#txt_s_BuyAmountTo").val(), 'BuyIntroducerFrom': $con.find("#txt_s_BuyIntroducerFrom").val(), 'BuyIntroducerTo': $con.find("#txt_s_BuyIntroducerTo").val(),
            'DebtFrom': $con.find("#txt_s_DebtFrom").val(), 'DebtTo': $con.find("#txt_s_DebtTo").val(), 'VocherBuyFrom': $con.find("#txt_s_VocherBuyFrom").val(), 'VocherBuyTo': $con.find("#txt_s_VocherBuyTo").val()
        , 'ChequeNotFrom': $con.find("#txt_s_ChequeNotFrom").val(), 'ChequeNotTo': $con.find("#txt_s_ChequeNotTo").val(), 'BuyLastFrom': $con.find("#txt_s_BuytLastFrom").val(), 'BuyLastTo': $con.find("#txt_s_BuytLastTo").val()
        , 'messageBody': messageBody, 'messageHeader': "", 'Setname': false, 'title': $con.find("#ddl_s_Title select").val(), 'paging': $con.find("#txt_m_Page").val(),
            'regDate': $con.find("#btn_regDate").text().indexOf("شامل") != "-1" ? true : false, 'address': $con.find("#btn_address").text().indexOf("شامل") != "-1" ? true : false,
            'product': $con.find("#btn_product").text().indexOf("شامل") != "-1" ? true : false, 'shop': $con.find("#btn_shop").text().indexOf("شامل") != "-1" ? true : false,
            'category': $con.find("#btn_category").text().indexOf("شامل") != "-1" ? true : false, 'subject': $con.find("#btn_subject").text().indexOf("شامل") != "-1" ? true : false,
            'registerer': $con.find("#btn_registerer").text().indexOf("شامل") != "-1" ? true : false, 'lastSentDate': $con.find("#btn_lastSentDate").text().indexOf("شامل") != "-1" ? true : false,
            'lastBuy': $con.find("#lastBuyDate").text().indexOf("شامل") != "-1" ? true : false, 'registererId': $con.find("#ddl_registerer").val(), 'email': email
        };

        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/SendSMSForAll",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response);
            },
            error: function (response) { alert(response.responseText); }
        });

    }


    function SendEmailForSelected(container) {
        var $con = $("#" + container);
        var header = [];
        var messageBody = $con.find("[name='text1']").val();
        var messageHeader = "";
        $con.find("ul[id*=txt_m_Body] li").each(function () {
            if ($(this).attr("name") == "name")
                messageHeader += "<%name%>";
            else if ($(this).attr("name") == "family")
                messageHeader += "<%family%>";
            else if ($(this).attr("name") == "amount")
                messageHeader += "<%amount%>";
            else if ($(this).attr("name") == "voucherAmount")
                messageHeader += "<%voucherAmount%>";
            else if ($(this).attr("name") == "text")
                messageHeader += $(this).find("a[name=content]").html();
            else if ($(this).attr("name") == "title")
                messageHeader += "<%title%>";
        });
        if ($(this).find("input[name='email']:checked").length > 0) {
            $con.find("tr[id*=tr]").each(function () {
                var headerDetail = {};
                var number = [];
                $(this).find("input[id*='cb_d_Mobile_']:checked").each(function () {
                    if (!$(this).attr("checked"))
                        number.push($(this).prop('id').split("_")[3]);
                });
                headerDetail["listNumber"] = number;
                headerDetail["personid"] = $(this).prop('id').replace("tr", "");
                headerDetail["family"] = $(this).find("label[name='Customername']").prop('id');
                headerDetail["sex"] = $(this).find("label[name='Customername']").html().split(" ")[0];
                header.push(headerDetail);
            });
        } else {
            $con.find("tr[id*=tr]").each(function () {
                var headerDetail = {};
                var number = [];

                $(this).find("input[name='email']").each(function () {
                    if (!$(this).prop("checked"))
                        number.push($(this).attr("email"));
                });
                if (number.length > 0) {
                    headerDetail["listNumber"] = number;
                    headerDetail["personid"] = $(this).prop('id').replace("tr", "");
                    headerDetail["family"] = $(this).find("[id='hd_customeramily']").val();
                    headerDetail["sex"] = $(this).find("span[id='" + headerDetail["personid"] + "']").html().split(" ")[0];

                    header.push(headerDetail);
                }
            });

        }

        if (header.length == 0) {
            translate("selectCustomers");
            return;
        }
        var DTO = { 'header': header, 'messageBody': messageBody, 'messageHeader': messageHeader,
            'Setname': false, 'title': $con.find("#ddl_s_Title select").val()
        };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/SendEmailForSelected",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response)
            },
            error: function (response) { alert(response.responseText); }
        });
        return false;

    }


    function SendEmailForAll(pageoption) {
        var $con = $("#" + pageoption.container);
        if ($con.find("#CustomerForSMSList").html() == "") {
            translate("selectCustomers");
            return;
        }
        var first = true;
        var take = $con.find("#PageSize").val();
        var skip = 0;
        var page_index = 0
        var code = "", name = "", regname = "", Introducer = "", Mobile = "", Phone = "", Barcode = "", ProductName = "", email = "",
        ProductCode = "", messageBody = "";
        $con.find("ul[id*=txt_m_Body] li").each(function () {
            if ($(this).prop("name") == "name")
                messageBody += "<%name%>";
            else if ($(this).attr("name") == "family")
                messageBody += "<%family%>";
            else if ($(this).attr("name") == "amount")
                messageBody += "<%amount%>";
            else if ($(this).attr("name") == "voucherAmount")
                messageBody += "<%voucherAmount%>";
            else if ($(this).attr("name") == "text")
                messageBody += $(this).find("a[name=content]").html();
            else if ($(this).attr("name") == "title")
                messageBody += "<%title%>";
        });
        var search = $con.find("#SearchBy").val();
        if (search == "Code") {

            code = $con.find("#CustomerForSMStxtSearch").val();
        } else if (search == "Name") {

            name = $con.find("#CustomerForSMStxtSearch").val();
        } else if (search == "RegName") {

            regname = $con.find("#CustomerForSMStxtSearch").val();
        } else if (search == "IntroducerName") {

            Introducer = $con.find("#CustomerForSMStxtSearch").val();
        }
        else if (search == "Mobile") {

            Mobile = $con.find("#CustomerForSMStxtSearch").val();
        }
        else if (search == "Phone") {

            Phone = $con.find("#CustomerForSMStxtSearch").val();
        }

        var searchProduct = $con.find("#ddl_d_SearchByProduct").val();
        if (search == "Barcode") {

            Barcode = $con.find("#txt_s_Product").val();
        } else if (searchProduct == "Name") {

            ProductName = $con.find("#txt_s_Product").val();
        } else if (searchProduct == "Code") {

            ProductCode = $con.find("#txt_s_Product").val();
        }
        else if (searchProduct == "Email") {

            email = $con.find("#txt_s_Product").val();
        }

        var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': $con.find("#ddl_s_Sort").val() + " " + $con.find("#ddl_s_Sorting").val(), 'code': code, 'namefamily': name, 'introducer': Introducer, 'registerername': regname, 'Mobile': Mobile, 'Phone': Phone,
            'agefrom': $con.find("#CustomerForSMSSearchAgeStart").val(), 'ageto': $con.find("#CustomerForSMSSearchAgeEnd").val(), 'regdatefrom': $con.find("#CustomerForSMSSearchRegDateStart").val(), 'regdateto': $con.find("#CustomerForSMSSearchRegDateEnd").val(),
            'gender': $con.find("#ddl_s_Gender").val(), 'shopId': $con.find("#ddl_s_Shop").val(), 'LastDateSMSFrom': $con.find("#txt_LastDateSMSFrom").val(), 'LastDateSMSTo': $con.find("#txt_LastDateSMSTo").val(), 'subjectsms': $con.find("#ddl_TitleSMS").val(), 'AddressId': getHierarchySelectedValue("divCustomerForSMSAddress", pageoption.container),
            'barcode': Barcode, 'productname': ProductName, 'productcode': ProductCode, 'categoryid': getHierarchySelectedValue("div_Category", pageoption.container),
            'PaymenytLastFrom': $con.find("#txt_s_PaymenytLastFrom").val(), 'PaymenytLastTo': $con.find("#txt_s_PaymenytLastTo").val(), 'PaymentAmountFrom': $con.find("#txt_s_PaymentAmountFrom").val(), 'PaymentAmountTo': $con.find("#txt_s_PaymentAmountTo").val(),
            'BuyAmountFrom': $con.find("#txt_s_BuyAmountFrom").val(), 'BuyAmountTo': $con.find("#txt_s_BuyAmountTo").val(), 'BuyIntroducerFrom': $con.find("#txt_s_BuyIntroducerFrom").val(), 'BuyIntroducerTo': $con.find("#txt_s_BuyIntroducerTo").val(),
            'DebtFrom': $con.find("#txt_s_DebtFrom").val(), 'DebtTo': $con.find("#txt_s_DebtTo").val(), 'VocherBuyFrom': $con.find("#txt_s_VocherBuyFrom").val(), 'VocherBuyTo': $con.find("#txt_s_VocherBuyTo").val()
        , 'ChequeNotFrom': $con.find("#txt_s_ChequeNotFrom").val(), 'ChequeNotTo': $con.find("#txt_s_ChequeNotTo").val(), 'BuyLastFrom': $con.find("#txt_s_BuytLastFrom").val(), 'BuyLastTo': $con.find("#txt_s_BuytLastTo").val()
        , 'messageBody': messageBody, 'messageHeader': "", 'Setname': false, 'title': $con.find("#ddl_s_Title select").val(), 'paging': "",
            'regDate': $con.find("#btn_regDate").text().indexOf("شامل") != "-1" ? true : false, 'address': $con.find("#btn_address").text().indexOf("شامل") != "-1" ? true : false,
            'product': $con.find("#btn_product").text().indexOf("شامل") != "-1" ? true : false, 'shop': $con.find("#btn_shop").text().indexOf("شامل") != "-1" ? true : false,
            'category': $con.find("#btn_category").text().indexOf("شامل") != "-1" ? true : false, 'subject': $con.find("#btn_subject").text().indexOf("شامل") != "-1" ? true : false,
            'registerer': $con.find("#btn_registerer").text().indexOf("شامل") != "-1" ? true : false, 'lastSentDate': $con.find("#btn_lastSentDate").text().indexOf("شامل") != "-1" ? true : false,
            'lastBuy': $con.find("#lastBuyDate").text().indexOf("شامل") != "-1" ? true : false, 'registererId': $con.find("#ddl_registerer").val(), 'email': email
        };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/SendEmailForAll",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response);
            },
            error: function (response) { alert(response.responseText); }
        });

    }
    //----------------new SendSMS end-------------------

    //------------------application begin------------------------

    function loadAddApplication(container, first) {
        var $con = $("#" + container);
        if (first) {
            $con.find("#txt_dateStart").attr("id", container + "txt_dateStart");
            $con.find("#txt_expieryDate").attr("id", container + "txt_expieryDate");
            $con.find("#" + container + "txt_dateStart").datepicker({ changeMonth: true, changeYear: true, onClose: function () { validateAll($("#" + container)) },
                onSelect: function (dateText, inst) {
                    $('#' + container + 'txt_expieryDate').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#" + container + "txt_expieryDate").datepicker({ changeMonth: true, changeYear: true, onClose: function () { validateAll($("#" + container)) } });
            getAllRoles(container);
            $con.find("#addApplication").button({
                icons: {
                    primary: "ui-icon-plus"
                },
                text: true
            }).unbind("click").bind('click', function (event) {
                if (validateAll($con))
                    addApplication(container);

            });
        }
    }

    function loadBuyApplication(container, first) {
        var $con = $("#" + container);
        if (first) {
            localize();
            $con.find("#txt_expieryDate").datepicker({ changeMonth: true, changeYear: true });
            $con.find("#buyApplication").button({
                icons: {
                    primary: "ui-icon-plus"
                },
                text: true
            }).unbind("click").bind('click', function (event) {
                if (validateAll($con))
                    buyApplication(container);

            });
        }
    }

    function loadHelp(container, first) {
        var $con = $("#" + container);
        if (first) {
            $con.find(".editor").jqte();
        }
    }

    function getAllRoles(container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/getRoleParentAll",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var role = (typeof (response)) == 'string' ? eval('(' + response + ')') : response;
                var roleItem = "";
                for (var j = 0; j < role.length; j++) {

                    var val = role[0, j];
                    roleItem += " <h3><a href='#' >" + val.description + "</a></h3><div id='div_" + val.roleid + "'></div>";

                }
                $con.find("#divRolesAccordion").html(roleItem);
                $con.find("#divRolesAccordion").accordion({ heightStyle: "content", collapsible: true, active: false,
                    activate: function (event, ui) { if (ui.newPanel.length > 0 && ui.newPanel.html().length < 1) getallroleChild(ui.newPanel.prop('id').replace("div_", ""), container) }
                });
                $con.find("#roleList").html(roleItem).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
                //  $con.find("#roleList").parent().tableScroll({ height: 380 });
                //  TableAlter(container);
            },
            error: function (response) { }
        });
    }

    function getallroleChild(pid, container) {
        var $con = $("#" + container);

        $.ajax({
            type: "POST",
            url: "Management/getRoleListAll",
            contentType: "application/json; charset=utf-8",
            data: "{parentid: '" + pid + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var role = (typeof (response)) == 'string' ? eval('(' + response + ')') : response;
                var roleItem = "";
                roleItem = "<div><table class='table line'>" +
                "<tbody id='roleList'>";
                for (var j = 0; j < role.length; j++) {

                    var val = role[0, j];
                    //var check = "";
                    roleItem += "<tr>" +
                                "<td id='" + container + "' ><input type='checkbox' " +
                                "   /> </td> <td id='" + val.rolename + "' name='rolename'>" + val.description +
                                "</td> </tr>";
                }
                roleItem += "</tbody></table></div>";
                $con.find("#div_" + pid).html(roleItem);
                $con.find("#divRolesAccordion").accordion({ collapsible: true, heightStyle: "content" });

                //  TableAlter(container);
            },
            error: function (response) { }
        });
    }

    function addApplication(container) {
        var $con = $("#" + container);
        var roles = [];
        $con.find("#divRolesAccordion").find("input:checkbox").each(function () {
            if (this.checked == true)
                roles.push($(this).parents("tr").find("[name=rolename]").attr("id"));
        });
        var DTO = { 'username': $con.find("#txt_appUser").val(), 'pass': $con.find("#txt_appPass").val(), 'appName': $con.find("#txt_appname").val(), 'branchlimit': $con.find("#txt_shoplimit").val(),
            'counterlimit': $con.find("#txt_accountlimit").val(), 'employeelimit': $con.find("#txt_employeelimit").val(), 'expierydate': $con.find("#" + container + "txt_expieryDate").val(),
            'roles': roles, 'smscredit': $con.find("#txt_smslimit").val(), 'smsnumber': $con.find("#txt_smsNumber").val(), 'startdate': $con.find("#" + container + "txt_dateStart").val()
        };
        $.ajax({
            type: "POST",
            url: "Management/AddUser",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
            },
            error: function (response) { alert(response); }
        });
    }

    function buyApplication(container) {
        var $con = $("#" + container);

        var DTO = { 'userName': $con.find("#txt_userName").val(),
            'amount': $con.find("#txt_amount").val(),
            'branchLimit': $con.find("#txt_branchLimit").val(),
            'employeeLimit': $con.find("#txt_employeeLimit").val(),
            'extraBranchPrice': $con.find("#txt_extraBranchPrice").val(),
            'extraEmployeePrice': $con.find("#txt_extraEmployeePrice").val(),
            'membershipPrice': $con.find("#txt_membershipPrice").val(),
            'smsLimit': $con.find("#txt_smsLimit").val(),
            'smsRate': $con.find("#txt_smsRate").val(),
            'expieryDate': $con.find("#txt_expieryDate").val(),
            'name': $con.find("#txt_name").val(),
            'family': $con.find("#txt_family").val(),
            'email': $con.find("#txt_email").val(),
            'mobile': $con.find("#txt_mobile").val(),
            'password': $con.find("#txt_password").val()
        };
        $.ajax({
            type: "POST",
            url: "Management/BuyApplication",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
            },
            error: function (response) { alert(response); }
        });
    }

    function loadApplicationList(container, first) {
        var $con = $("#" + container);
        if (first) {
            getAcountList(container, { container: container, callbackmethod: getApplicationList, fname: "", page_index: 0,
                build: buildApplicationList, servicename: "Management", methodname: "GetApplicationList", print: true
            });
            $con.find("#btnRefreshApplist").button({
                icons: {
                    primary: "ui-icon-refresh"
                },
                text: false
            }).unbind("click").bind('click', function (event) {
                getAcountList(container, { container: container, callbackmethod: getApplicationList, fname: "", page_index: 0,
                    build: buildApplicationList, servicename: "Management", methodname: "GetApplicationList", print: true
                });

            });
        }
    }

    function buildApplicationList(jq, pageoption) {
        var $con = $("#" + pageoption.pagingContainer);
        jq = jq;
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "appName", sort: "AppName", width: "20%" });
        lsth.push({ title: "shoplimit", sort: "shoplimit", width: "20%" });
        lsth.push({ title: "dateStart", sort: "StartingDate", width: "20%" });
        lsth.push({ title: "status", sort: "IsActive", width: "16%" });
        lsth.push({ title: "expieryDate", sort: "ExpieryDate", width: "20%" });
        lsth.push({ title: "deleteBtn", width: "4%" });
        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            trBody[0] = { trId: val.ApplicationId };
            trBody[1] = { name: "appname", html: val.AppName, width: "20%" };
            trBody[2] = { name: "shoplimit", html: val.ShopLimit, width: "20%" };
            trBody[3] = { name: "datestart", html: val.StartingDate, props: { date: val.StartingDate, width: "20%", klass: "date"} };
            trBody[4] = { name: "status", html: val.IsActive, width: "16%" };
            trBody[5] = { name: "expierydate", html: val.ExpieryDate, props: { date: val.ExpieryDate, width: "20%", klass: "date"} };
            lstb.push(trBody);
        }
        details = { deleteFunction: RemoveApplicationElement, rowClick: ClickApplicationList };
        table = { header: lsth, body: lstb, details: details, heigth: 300, container: pageoption.pagingContainer,
            divName: "divApplicationList"
        };
        buildTable(table);
    }

    function ClickApplicationList($dis, container) {
        var $con = $("#" + container);
        var id = $dis.attr("id").replace("tr", "");
        if (id != undefined)
            createSubTab({ name: "a_ApplicationList", tabName: $dis.find("[name=appname]").html(), id: id });
        else {
            createSubTab({ name: "a_ApplicationList", row: $dis });
        }
        onRowClick($dis);
    }

    function RemoveApplicationElement($dis, container) {
        var $con = $("#" + container);
        var DTO = { 'appId': $dis.attr("id").replace("tr", "") };
        $.ajax({
            type: "POST",
            url: "Management/",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {

            },
            error: function (response) { alert(response); }
        });
    }

    function getApplicationList(container, params) {
        var $con = $("#" + container);
        pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
            first: true, isOrder: true
        });
    }

    function loadEditApplication(appId, container, first) {

        if (first) {

            var $con = $("#" + container);
            $con.find("#txt_dateStart").datepicker({ changeMonth: true, changeYear: true, onClose: function () { validateAll($("#" + container)) } });
            $con.find("#txt_expieryDate").datepicker({ changeMonth: true, changeYear: true, onClose: function () { validateAll($("#" + container)) } });
            getEditApplication(appId, container)
            $con.find("#addApplication").unbind().click(function () {
                editApplication(appId, container)
            }).button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            });
        }
    }

    function getEditApplication(appId, container) {
        var $con = $("#" + container);
        var DTO = { "appId": appId };
        $.ajax({
            type: "POST",
            url: "Management/GetApplicationDetails",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                var jq = response[0];
                $con.find("#txt_appname").val(jq.AppName);
                $con.find("#txt_shoplimit").val(jq.ShopLimit);
                $con.find("#txt_accountlimit").val(jq.AccountLimit);
                $con.find("#txt_employeelimit").val(jq.EmployeeLimit);
                $con.find("#ddl_status").val(jq.IsActive);
                $con.find("#txt_dateStart").val(jq.StartingDate);
                $con.find("#txt_expieryDate").val(jq.ExpieryDate);
                $con.find("#txt_smslimit").val(jq.SmsCredit);
                $con.find("#txt_smsNumber").val(jq.SmsNumber);
            },
            error: function (response) { alert(response); }
        });
    }

    function editApplication(appId, container) {
        var $con = $("#" + container);
        var DTO = { "appId": appId, "appName": $con.find("#txt_appname").val(), "shopLimit": $con.find("#txt_shoplimit").val(), "accountLimit": $con.find("#txt_accountlimit").val(),
            "employeeLimit": $con.find("#txt_employeelimit").val(), "status": $con.find("#ddl_status").val(), "dateStart": $con.find("#txt_dateStart").val(),
            "expieryDate": $con.find("#txt_expieryDate").val(), "smsLimit": $con.find("#txt_smslimit").val(), "smsNumber": $con.find("#txt_smsNumber").val()
        };
        $.ajax({
            type: "POST",
            url: "Management/EditApplication",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg)
            },
            error: function (response) { alert(response); }
        });
    }

    function loadEditApplicationRoles(id, container, first) {
        if (first) {
            var $con = $("#" + container);
            getrole(0, id, container);
        }
    }


    //------------------application end--------------------------


    //------------------Setting Start---------------------------

    function loadSetting(container, first) {
        var $con = $("#" + container);
        if (first) {

            GetSetting(container);
            $con.find("#btnEditSetting").button({
                icons: {
                    primary: "ui-icon-disk"
                }
            }).unbind().click(function () {
                if (validateAll($("#" + container)))
                    UpdateSetting(container);
            });
        }
    }

    function GetSetting(container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/GetSetting",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isDone) {
                    var res = response.result;
                    bindItemsForSelectCombo({ methodname: "getEmployees", servicename: "Management", id: "ddl_m_Employee", container: container, headertext: "انتخاب کارمند", selectedvalue: res.EmployeeId });
                    bindItemsForSelectCombo({ servicename: "Management", methodname: "getCounterNameForUser", headertext: "انتخاب صندوق", id: "ddl_m_Counter", container: container, selectedvalue: res.CounterId });
                    bindItemsForSelectCombo({ methodname: "getFiscalPeriod", servicename: "Management", id: "ddl_FiscalPeriod", container: container, headertext: "انتخاب دوره مالی", selectedvalue: res.CurrentFiscalPeriodId });

                    $con.find("#lbl_AppName").html(res.AppName);
                    $con.find("#lbl_StartingDate").html(res.StartingDate);
                    $con.find("#lbl_StartingDate").attr("date", res.StartingDate);
                    $con.find("#lbl_ExpieryDate").html(res.ExpieryDate);
                    $con.find("#lbl_ExpieryDate").attr("date", res.ExpieryDate);
                    $con.find("#lbl_ShopLimit").html(res.ShopLimit);
                    $con.find("#lbl_SmsCredit").html(res.SmsCredit);
                    $con.find("#txt_m_Host").val(res.Host);
                    $con.find("#txt_m_EmailPass").val(res.EmailPass);
                    $con.find("#ddl_m_Language").val(res.Language);
                    $con.find("#txt_m_PaymentPassword").val(res.PaymentPassword);
                    $con.find("#txt_m_PaymentUserName").val(res.PaymentUserName);
                    $con.find("#txt_m_Port").val(res.Port);
                    $con.find("#txt_m_Email").val(res.Email);
                    $con.find("#txt_m_SmsNumber").val(res.SmsNumber);
                    $con.find("#txt_m_SmsPass").val(res.SmsPass);
                    $con.find("#txt_Sms_SmsUser").val(res.SmsUser);
                    $con.find("#txt_m_TerminalId").val(res.TerminalId);
                    $con.find("#txt_m_OnlineHost").val(res.OnlineHost);
                    $con.find("#txt_m_DeliveryExpense").val(res.DeliveryExpense);
                }
                //            translate(response.alert);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }


    function UpdateSetting(container) {
        var $con = $("#" + container);
        var DTO = {
            'employeeId': $con.find("#ddl_m_Employee").val(),
            'counterId': $con.find("#ddl_m_Counter").val(),
            'host': $con.find("#txt_m_Host").val(),
            'emailPass': $con.find("#txt_m_EmailPass").val(),
            'language': $con.find("#ddl_m_Language").val(),
            'paymentPassword': $con.find("#txt_m_PaymentPassword").val(),
            'paymentUserName': $con.find("#txt_m_PaymentUserName").val(),
            'port': $con.find("#txt_m_Port").val(),
            'email': $con.find("#txt_m_Email").val(),
            'smsNumber': $con.find("#txt_m_SmsNumber").val(),
            'smsPass': $con.find("#txt_m_SmsPass").val(),
            'smsUser': $con.find("#txt_Sms_SmsUser").val(),
            'terminalId': $con.find("#txt_m_TerminalId").val(),
            'paymentUserName': $con.find("#txt_m_PaymentUserName").val(),
            'onlineHost': $con.find("#txt_m_OnlineHost").val(),
            'deliveryExpense': $con.find("#txt_m_DeliveryExpense").val(),
            'FiscalPeriodId': $con.find("#ddl_FiscalPeriod").val()
        };
        $.ajax({
            type: "POST",
            url: "Management/UpdateSetting",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    //------------------Setting End-----------------------------

    //-----------------expense begin---------------------

    function loadNewSalary(container, first) {
        var $con = $("#" + container);
        $con.find("#dialogAddSalary").removeClass("invisible");
        bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "Management", id: "ddl_m_employee_add", container: container, headertext: "انتخاب کارمند" });
        $con.find("#btn_save").button({
            icons: {
                primary: "ui-icon-disk"
            }
        }).unbind().click(function () {
            if (validateAll($("#" + container)))
                AddEmployeeSalary("dialogAddAccounting");
        });
        $con.find("#txt_m_fromDate_add").attr("id", container + "txt_m_fromDate_add");
        $con.find("#txt_m_toDate_add").attr("id", container + "txt_m_toDate_add");
        $con.find("#" + container + "txt_m_fromDate_add").datepicker({ changeMonth: true, changeYear: true, onClose: function () { validateAll($("#" + container)) },
            onSelect: function (dateText, inst) {
                $('#' + container + 'txt_m_toDate_add').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
            }
        });
        $con.find("#" + container + "txt_m_toDate_add").datepicker({ changeMonth: true, changeYear: true, onClose: function () { validateAll($("#" + container)) } });
    }
    function loadNewSocialSecurity(container, first) {
        var $con = $("#" + container);
        $con.find("#dialogAddSocial").removeClass("invisible");
        bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "Management", id: "ddl_social_employee_add", container: container, headertext: "انتخاب کارمند" });
        //    alert($con.find("#Month_Name_Add").html());
        //    if ($con.find("#Month_Name_Add").html() == "")
        //        alert($con.find("#Month_Name_Add").html());
        bindXmlDropDownData({ async: false, id: "Month_Name_Add", container: container, path: "Counter/MonthTitle", canmodify: true, istext: false, headertext: "انتخاب ماه", css: "selectsmall required validate" });
        $con.find("#btn_save").button({
            icons: {
                primary: "ui-icon-disk"
            }
        }).unbind().click(function () {
            if (validateAll($con))
                AddSocialSecurity("dialogAddSocial");
        });
    }

    function loadNewExpense(container, first) {
        var $con = $("#" + container);
        $con.find("#dialogAddExpense").removeClass("invisible");
        bindHierarchyData({ id: "divExpenseCategoryAdd", container: "dialogAddExpense", table: "ExpenseCategory", canmodify: true, css: "selectsmall1 required validate" });
        $con.find("#btn_save").button({
            icons: {
                primary: "ui-icon-disk"
            }
        }).unbind().click(function () {
            if (validateAll($("#dialogAddExpense")))
                AddExpense("dialogAddExpense");
        });
    }


    //--------------------expenses begin-----------------------

    function loadEmployeeSalary(container, first) {
        var $con = $("#" + container);
        sortid = "OrderHeaderId desc";
        //            $con.find("#dialogAddSalary").dialog({ autoOpen: false }).dialog({ width: 500 });
        if (first) {
            $con.find('#moreFilter').slideUp('fast');
            $con.find('.toggle-more-filters').click(function () {
                $(this).toggleClass("open")
                $con.find("#divBasic").toggleClass("hidden")
                $con.find('#moreFilter').removeClass('invisible');
                $con.find('#moreFilter').slideToggle(function () {
                    // Animation complete.
                    //                if ($con.find('#moreFilter').is(":visible"))
                    //                    $con.find("#simpleSearch").addClass("invisible");
                    //                else
                    //                    $con.find("#simpleSearch").removeClass("invisible");
                });

            });
            $con.find("#txt_m_fromDate").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#txt_m_toDate').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#PageSize").off().on('change', function () { GetEmployeeSalaryList({ container: container }); })
            $con.find("#txt_m_toDate").datepicker({ changeMonth: true, changeYear: true });
            $con.find("#txt_m_fromDate_add").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#txt_m_toDate_add').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            //        $con.find("#txt_m_fromDate_add").datepicker({ changeMonth: true, changeYear: true });
            //        $con.find("#txt_m_toDate_add").datepicker({ changeMonth: true, changeYear: true });
            //            $con.find("#divslider").unbind('click').click(function () { sliderClick("divEmployeesearch"); sliderClick("moreFilter"); });
            bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "Management", id: "ddl_m_employee", container: container, headertext: "انتخاب کارمند", selectedindex: 0 });
            GetEmployeeSalaryList({ container: container });
            //            $con.find("#btn_search").button({
            //                icons: {
            //                    primary: "ui-icon-search"
            //                }
            //            }).unbind().click(function () {
            //                GetEmployeeSalaryList({ container: container });
            //            });
            $con.find("#EmployeeAdvanceSearchbt").button({
                icons: {
                    primary: "ui-icon-search"
                }
            }).unbind().click(function () {
                GetEmployeeSalaryList({ container: container });
            });
            $con.find("#btn_new").button({
                icons: {
                    primary: "ui-icon-plusthick"
                }
            }).unbind().click(function () {
                $("#dialogAddSalary").find("input, select").val("");
                $("#dialogAddSalary").find("#btn_save").button({
                    icons: {
                        primary: "ui-icon-disk"
                    }
                }).unbind().click(function () {
                    if (validateAll($con.find("#dialogAddSalary")))
                        AddEmployeeSalary("dialogAddSalary");
                });
                bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "Management", id: "ddl_m_employee_add", container: container, headertext: "انتخاب کارمند" });
                $("#dialogAddSalary").dialog(open).dialog({ width: 500, modal: true });
            });

        }
    }
    function loadSocialSecurity(container, first) {
        var $con = $("#" + container);

        sortid = "OrderHeaderId desc";
        if (first) {
            $con.find('#moreFilter').slideUp('fast', function () { GetSocialSecurityList({ container: container }); });
            $con.find('.toggle-more-filters').click(function () {
                $(this).toggleClass("open")
                $con.find("#divBasic").toggleClass("hidden")
                $con.find('#moreFilter').removeClass('invisible');
                $con.find('#moreFilter').slideToggle(function () {
                    // Animation complete.
                    //                if ($con.find('#moreFilter').is(":visible"))
                    //                    $con.find("#simpleSearch").addClass("invisible");
                    //                else
                    //                    $con.find("#simpleSearch").removeClass("invisible");
                });

            });
            $con.find("#txt_m_fromDate").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#txt_m_toDate').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#PageSize").off().on('change', function () { GetSocialSecurityList({ container: container }); })
            $con.find("#txt_m_toDate").datepicker({ changeMonth: true, changeYear: true });
            bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "Management", id: "ddl_m_employee", container: container, headertext: "انتخاب کارمند", selectedindex: 0 });
            bindXmlDropDownData({ id: "Month_Name", container: container, path: "Counter/MonthTitle", canmodify: false, istext: false, headertext: "انتخاب ماه" });
            bindXmlDropDownData({ async: false, id: "Month_Name_Add", container: container, path: "Counter/MonthTitle", canmodify: true, istext: false, headertext: "انتخاب ماه" });
            $con.find("#SocialAdvanceSearchbt").button({
                icons: {
                    primary: "ui-icon-search"
                }
            }).unbind().click(function () {
                GetSocialSecurityList({ container: container });
            });
            $con.find("#btn_new").button({
                icons: {
                    primary: "ui-icon-plusthick"
                }
            }).unbind().click(function () {
                $("#dialogAddSocial").find("input, select").val("");
                $("#dialogAddSocial").find("#btn_save").button({
                    icons: {
                        primary: "ui-icon-disk"
                    }
                }).unbind().click(function () {
                    if (validateAll($con.find("#dialogAddSocial")))
                        AddSocialSecurity("dialogAddSocial");
                });
                bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "Management", id: "ddl_social_employee_add", container: container, headertext: "انتخاب کارمند" });
                $("#dialogAddSocial").dialog(open).dialog({ width: 500 });

            });
        }
    }

    function loadExpense(container, first) {
        var $con = $("#" + container);
        sortid = "OrderHeaderId desc";
        if (first) {
            $con.find('#moreFilter').slideUp('fast', function () { GetExpenseList({ container: container }); });
            $con.find('.toggle-more-filters').click(function () {
                $(this).toggleClass("open")
                $con.find("#divBasic").toggleClass("hidden")
                $con.find('#moreFilter').removeClass('invisible');
                $con.find('#moreFilter').slideToggle(function () {
                    // Animation complete.
                    //                if ($con.find('#moreFilter').is(":visible"))
                    //                    $con.find("#simpleSearch").addClass("invisible");
                    //                else
                    //                    $con.find("#simpleSearch").removeClass("invisible");
                });

            });
            $con.find("#txt_m_fromDate").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#txt_m_toDate').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#PageSize").off().on('change', function () { GetExpenseList({ container: container }); })
            $con.find("#txt_m_toDate").datepicker({ changeMonth: true, changeYear: true });
            //            $con.find("#divslider").unbind('click').click(function () { sliderClick("divExpensesearch"); sliderClick("ExpenseAdvanceSearch"); });
            bindHierarchyData({ id: "divExpenseCategory", container: container, table: "ExpenseCategory", canmodify: false });
            //            GetExpenseList({ container: container });
            $con.find("#btn_search").button({
                icons: {
                    primary: "ui-icon-search"
                }
            }).unbind().click(function () {
                GetExpenseList({ container: container });
            });
            $con.find("#ExpenseAdvanceSearchbt").button({
                icons: {
                    primary: "ui-icon-search"
                }
            }).unbind().click(function () {
                GetExpenseList({ container: container });
            });
            $con.find("#btn_new").button({
                icons: {
                    primary: "ui-icon-plusthick"
                }
            }).unbind().click(function () {
                $("#dialogAddExpense").find("input, select").val("");
                $("#dialogAddExpense").find("#btn_save").button({
                    icons: {
                        primary: "ui-icon-disk"
                    }
                }).unbind().click(function () {
                    if (validateAll($con.find("#dialogAddExpense")))
                        AddExpense("dialogAddExpense");
                });
                bindHierarchyData({ id: "divExpenseCategoryAdd", container: "dialogAddExpense", table: "ExpenseCategory", canmodify: true, css: "selectsmall1 required validate" });
                $("#dialogAddExpense").dialog(open).dialog({ width: 500 });

            });
        }
    }

    function loadTotalExpense(container, first) {
        var $con = $("#" + container);
        if (first) {
            bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "Management", id: "ddlEmployee", container: container, headertext: "انتخاب کارمند", selectedindex: 0 });
            $con.find("[id=txtDateFrom]").datepicker({ changeMonth: true, changeYear: true });
            $con.find("[id=txtDateTo]").datepicker({ changeMonth: true, changeYear: true });
            $con.find("[id=btn_search]").button({
                icons: {
                    primary: "ui-icon-search"
                }
            }).unbind().click(function () {
                GetTotalExpenses($con.find("[id=ddlEmployee]").val(), $con.find("[id=txtDateFrom]").val(),
                                 $con.find("[id=txtDateTo]").val(), $("[id=userDefault]").find("[id=ddl_s_Branch]").val(),
                                 container);
            });
        }
    }

    function GetTotalExpenses(registererId, dateFrom, dateTo, shopId, container) {
        var $con = $("#" + container);
        var DTO = { 'registererId': registererId,
            'dateFrom': dateFrom,
            'dateTo': dateTo,
            'shopId': shopId
        };
        $.ajax({
            type: "POST",
            data: JSON.stringify(DTO),
            url: "Management/GetTotalExpenses",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isDone) {
                    $con.find("[id=txtTotalExpense]").val(response.totalExpense);
                    $con.find("[id=txtTotalSocialSecurity]").val(response.totalSocialSecurity);
                    $con.find("[id=txtTotalEmployeeSalary]").val(response.totalSalary);
                    $con.find("[id=txtTotalSale]").val(response.totalSale);
                    $con.find("[id=txtTotalBuy]").val(response.totalBuy);
                    $con.find("[id=txtTotalReceive]").val((response.totalReceiveCash * 1) + (response.totalReceiveCheque * 1) + (response.totalReceiveVoucher * 1));
                    $con.find("[id=txtTotalPay]").val((response.totalPayCash * 1) + (response.totalPayCheque * 1) + (response.totalPayVoucher * 1));
                    $con.find("[id=txtTotalAmount]").val((response.totalExpense * 1) + (response.totalSocialSecurity * 1) + (response.totalSalary * 1));
                    $con.find("[id=txtTotalClearSale]").val((response.totalSale * 1) - (response.totalBuy * 1));
                    $con.find("[id=txtTotalClearReceive]").val(($con.find("[id=txtTotalReceive]").val() * 1) - ($con.find("[id=txtTotalPay]").val() * 1));
                    $con.find("[id=txtNetProfit]").val(($con.find("[id=txtTotalClearSale]").val() * 1) - ($con.find("[id=txtTotalAmount]").val() * 1));
                }
                else
                    translate(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });
    }
    function AddEmployeeSalary(container) {
        var $con = $("#" + container);
        var DTO = { 'employeeId': $con.find("#ddl_m_employee_add").val(),
            'fromDate': $con.find("#" + container + "txt_m_fromDate_add").val(), 'toDate': $con.find("#" + container + "txt_m_toDate_add").val(),
            'fixSalary': $con.find("#txt_m_fixSalary_add").val(), 'commission': $con.find("#txt_m_commission_add").val(),
            'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
            'currencyId': $("#userDefault").find("#ddl_m_Currency").val(),
            'description': $con.find("#txt_salary_description_add").val(), 'shopId': $("#userDefault").find("#ddl_s_Branch").val(),
            'date': $("#userDefault").find("#txt_s_Date").val()
        };
        $.ajax({
            type: "POST",
            data: JSON.stringify(DTO),
            url: "Management/AddEmployeeSalary",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
                //  getListPrice(barcodeid, container);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function AddSocialSecurity(container) {
        var $con = $("#" + container);
        var DTO = { 'employeeId': $con.find("#ddl_social_employee_add").val(),
            'month': $con.find("#Month_Name_Add option:selected").val(),
            'amount': $con.find("#txt_social_amount_add").val(),
            'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
            'currencyId': $("#userDefault").find("#ddl_m_Currency").val(),
            'description': $con.find("#txt_social_description_add").val(),
            'shopId': $("#userDefault").find("#ddl_s_Branch").val(),
            'date': $("#userDefault").find("#txt_s_Date").val()
        };
        $.ajax({
            type: "POST",
            data: JSON.stringify(DTO),
            url: "Management/AddSocialSecurity",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                alert("اطلاعات ثبت شد.");
                //  getListPrice(barcodeid, container);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function AddExpense(container) {
        var $con = $("#" + container);
        var DTO = { 'expenseCategoryId': getHierarchySelectedValue("divExpenseCategoryAdd", container),
            'amount': $con.find("#txt_m_amount_add").val(),
            'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
            'currencyId': $("#userDefault").find("#ddl_m_Currency").val(),
            'description': $con.find("#txt_m_description_add").val(),
            'shopId': $("#userDefault").find("#ddl_s_Branch").val(),
            'date': $("#userDefault").find("#txt_s_Date").val()
        };
        $.ajax({
            type: "POST",
            data: JSON.stringify(DTO),
            url: "Management/AddExpense",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                alert("اطلاعات ثبت شد.");
                //  getListPrice(barcodeid, container);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function GetEmployeeSalaryList(pageoption) {
        var $con = $("#" + pageoption.container);
        var first = true;
        var take = $con.find("#PageSize").val();
        var skip = 0;
        var page_index = 0
        var employee = "", confirmer = "", registerer = "";
        if (!$con.find("#moreFilter").is(":visible")) {
            var search = $con.find("#ddl_m_searchBy").val();
            if (search == "employee") {

                employee = $con.find("#EmployeetxtSearch").val();
            } if (search == "confirmer") {

                confirmer = $con.find("#EmployeetxtSearch").val();
            } if (search == "registerer") {

                registerer = $con.find("#EmployeetxtSearch").val();
            }
            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
                'employeeId': 0, 'employee': employee, 'confirmer': confirmer,
                'registerer': registerer, 'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
                'fixSalaryFrom': "", 'fixSalaryTo': "",
                'dateFrom': "", 'dateTo': "",
                'isConfirmed': "", 'description': ""
            };
        }
        else
            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
                'employeeId': ($con.find("#ddl_m_employee").val() != "" ? $con.find("#ddl_m_employee").val() : 0),
                'employee': "", 'confirmer': $con.find("#txt_m_confirmer").val(),
                'registerer': $con.find("#txt_m_registerer").val(), 'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
                'fixSalaryFrom': $con.find("#txt_m_fixSalaryFrom").val(), 'fixSalaryTo': $con.find("#txt_m_fixSalaryTo").val(),
                'dateFrom': $con.find("#txt_m_fromDate").val(), 'dateTo': $con.find("#txt_m_toDate").val(),
                'isConfirmed': $con.find("#ddl_m_status").val(), 'description': $con.find("#txt_m_description").val()
            };

        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/GetEmployeeSalaryList",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                pageoption["count"] = response.count;
                pageoption["callBackName"] = employeepageselectCallback;
                var opt = getPageOptions(pageoption);
                $con.find("#paging").pagination(response.count, opt);
                employeepageselectCallback(0, response, pageoption, first);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function GetSocialSecurityList(pageoption) {
        var $con = $("#" + pageoption.container);
        var first = true;
        var take = $con.find("#PageSize").val();
        var skip = 0;
        var page_index = 0
        var employee = "", confirmer = "", registerer = "";
        if (!$con.find("#moreFilter").is(":visible")) {
            var search = $con.find("#ddl_m_searchBy").val();
            if (search == "employee") {

                employee = $con.find("#EmployeetxtSearch").val();
            } if (search == "confirmer") {

                confirmer = $con.find("#EmployeetxtSearch").val();
            } if (search == "registerer") {

                registerer = $con.find("#EmployeetxtSearch").val();
            }
            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
                'employeeId': "", 'employee': employee, 'confirmer': confirmer,
                'registerer': registerer, 'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
                'amountFrom': "", 'amountTo': "",
                'dateFrom': "", 'dateTo': "",
                'isConfirmed': "", 'description': "", 'month': ""
            };
        }
        else
            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
                'employeeId': ($con.find("#ddl_m_employee").val() != "" ? $con.find("#ddl_m_employee").val() : ""),
                'employee': "", 'confirmer': $con.find("#txt_m_confirmer").val(),
                'registerer': $con.find("#txt_m_registerer").val(), 'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
                'amountFrom': $con.find("#txt_m_amountFrom").val(), 'amountTo': $con.find("#txt_m_amountTo").val(),
                'dateFrom': $con.find("#txt_m_fromDate").val(), 'dateTo': $con.find("#txt_m_toDate").val(),
                'isConfirmed': $con.find("#ddl_m_status").val(), 'description': $con.find("#txt_m_description").val(),
                'month': $con.find("#Month_Name option:selected").val()
            };

        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/GetSocialSecurityList",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                pageoption["count"] = response.count;
                pageoption["callBackName"] = socialsecuritypageselectCallback;
                var opt = getPageOptions(pageoption);
                $con.find("#paging").pagination(response.count, opt);
                socialsecuritypageselectCallback(0, response, pageoption, first);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function GetExpenseList(pageoption) {
        var $con = $("#" + pageoption.container);
        var first = true;
        var take = $con.find("#PageSize").val();
        var skip = 0;
        var page_index = 0
        var confirmer = "", registerer = "";
        if (!$con.find("#moreFilter").is(":visible")) {
            var search = $con.find("#ddl_m_searchBy").val();
            if (search == "confirmer") {

                confirmer = $con.find("#ExpensetxtSearch").val();
            } if (search == "registerer") {

                registerer = $con.find("#ExpensetxtSearch").val();
            }
            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
                'expenseCategory': "",
                'amountFrom': "", 'amountTo': "",
                'confirmer': confirmer,
                'registerer': registerer, 'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
                'dateFrom': "", 'dateTo': "",
                'isConfirmed': "", 'description': ""
            };
        }
        else
            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
                'expenseCategory': getHierarchySelectedValue("divExpenseCategory", pageoption.container),
                'amountFrom': $con.find("#txt_m_AmountFrom").val(), 'amountTo': $con.find("#txt_m_AmountTo").val(),
                'dateFrom': $con.find("#txt_m_fromDate").val(), 'dateTo': $con.find("#txt_m_toDate").val(),
                'registerer': $con.find("#txt_m_registerer").val(), 'isConfirmed': $con.find("#ddl_m_status").val(),
                'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
                'description': $con.find("#txt_m_description").val(), 'confirmer': $con.find("#txt_m_confirmer").val()
            };

        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/GetExpenseList",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                pageoption["count"] = response.count;
                pageoption["callBackName"] = expensepageselectCallback;
                var opt = getPageOptions(pageoption);
                $con.find("#paging").pagination(response.count, opt);
                expensepageselectCallback(0, response, pageoption, first);
            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function buildEmployeeSalaryList(jq, pageoption) {
        var $con = $("#" + pageoption.container);
        total = jq;
        jq = jq.results;
        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            ItemList += "<tr id='tr" + val.OrderHeaderId + "'>" +
                        "<td width='13%' id = 'td" + val.ClientId + "' name = 'employee'>" + val.EmployeeName + "</td>" +
                        "<td width='10%' name = 'fixsalary'>" + "<span>" + val.FixSalary + "</span>" + " " + val.Currency + "</td> " +
                        "<td width='8%' name = 'comission'>" + "<span>" + val.Commission + "</span>" + " " + val.Currency + "</td>" +
                        "<td width='8%' name = 'fromDate'>" + val.FromDate + "</td>" +
                        "<td width='8%' name = 'toDate'>" + val.ToDate + "</td>" +
                        "<td width='8%' name = 'date'>" + val.Date + "</td>" +
                        "<td width='8%' name = 'registerer'>" + val.RegistererName + "</td>" +
                        "<td  width='5%'name = 'shop'>" + val.shop + "</td>" +
                        "<td width='5%' name = 'counter'>" + val.counter + "</td>" +
                        "<td width='10%' name = 'Description'>" + val.Description + "</td>" +
                        "<td  width='8%'name = 'confirmer'>" + (val.ConfirmerName != null ? val.ConfirmerName :
                        ("<button id='btnSalaryConfirm'>تایید</button>")) + "</td>" +
                        "<td width='6%' id='edit'><button id='btnEditSalary'>ویرایش</button></td>" +
                        "<td width='3%' id='delete'><button id='btnDeleteSalary'>حذف</button></td>" +
                        "</tr>";
        }

        $con.find("#SalaryList").html(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
        $con.find("#txtTotalSalary").html(total.sumSalary);
        $con.find("#txtTotalCommision").html(total.sumComission);
        $con.find("#txtTotalRecieve").html((total.sumSalary * 1) + (total.sumComission * 1));
        $con.find("[id=btnSalaryConfirm]").button({
            icons: {
                primary: "ui-icon-check"
            },
            text: false
        }).unbind().click(function () {
            ConfirmSalary($(this).parents("tr").prop("id").replace("tr", ""), pageoption.container, $(this));
        });
        $con.find("[id=btnEditSalary]").button({
            icons: {
                primary: "ui-icon-pencil"
            },
            text: false
        }).unbind().click(function () {
            var $dis = $(this);
            bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "Management", id: "ddl_m_employee_add", container: pageoption.container, headertext: "انتخاب کارمند" });
            $("#dialogAddSalary").find("#btn_save").button({
                icons: {
                    primary: "ui-icon-disk"
                }
            }).unbind().click(function () {
                if (validateAll($con.find("#dialogAddSalary")))
                    EditEmployeeSalary($dis.parents("tr").prop("id").replace("tr", ""), "dialogAddSalary");
            });
            $("#dialogAddSalary").dialog(open).dialog({ width: 500 });
            BindItemsForEditSalary($(this).parents("tr"), "dialogAddSalary");
        });
        $con.find("[id=btnDeleteSalary]").button({
            icons: {
                primary: "ui-icon-closethick"
            },
            text: false
        }).unbind().click(function () {
            if (confirm("آیا از حذف مطمئن هستید؟"))
                DeleteSalary($(this).parents("tr").prop("id").replace("tr", ""), pageoption.container, this);
            else
                return;
        });
        //  $con.find("#SalaryList").parent().tableScroll({ height: 380 });
        //        if (pageoption.container == "divdialogEmployee")
        //            $con.dialog('open');
    }

    function buildSocialSecurityList(jq, pageoption) {
        var $con = $("#" + pageoption.container);
        total = jq;
        jq = jq.results;
        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            ItemList += "<tr id='tr" + val.OrderHeaderId + "'>" +
                        "<td width='15%' id = 'td" + val.ClientId + "' name = 'employee'>" + val.EmployeeName + "</td>" +
                        "<td width='10%' name = 'amount'>" + "<span>" + val.Amount + "</span>" + " " + val.Currency + "</td> " +
                        "<td width='8%' name = 'month' id = '" + val.MonthId + "'>" + val.Month + "</td>" +
                        "<td width='8%' name = 'date'>" + val.Date + "</td>" +
                        "<td width='10%' name = 'registerer'>" + val.RegistererName + "</td>" +
                        "<td width='8%' name = 'shop'>" + val.shop + "</td>" +
                        "<td width='5%' name = 'counter'>" + val.counter + "</td>" +
                        "<td width='12%' name = 'Description'>" + val.Description + "</td>" +
                        "<td width='8%' name = 'confirmer'>" + (val.ConfirmerName != null ? val.ConfirmerName :
                        ("<button id='btnSocialConfirm'>تایید</button>")) + "</td>" +
                        "<td width='8%' id='edit'><button id='btnEditSocial'>ویرایش</button></td>" +
                        "<td width='8%' id='delete'><button id='btnDeleteSocial'>حذف</button></td>" +
                        "</tr>";
        }
        $con.find("#SocialList").html(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
        $con.find("#txtTotalAmount").html(total.sumAmount);
        $con.find("[id=btnSocialConfirm]").button({
            icons: {
                primary: "ui-icon-check"
            },
            text: false
        }).unbind().click(function () {
            ConfirmSocialSecurity($(this).parents("tr").prop("id").replace("tr", ""), pageoption.container, $(this));
        });
        $con.find("[id=btnEditSocial]").button({
            icons: {
                primary: "ui-icon-pencil"
            },
            text: false
        }).unbind().click(function () {
            var $dis = $(this);
            bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "Management", id: "ddl_social_employee_add", container: pageoption.container, headertext: "انتخاب کارمند" });
            $("#dialogAddSocial").find("#btn_save").button({
                icons: {
                    primary: "ui-icon-disk"
                }
            }).unbind().click(function () {
                if (validateAll($con.find("#dialogAddSocial")))
                    EditSocialSecurity($dis.parents("tr").prop("id").replace("tr", ""), "dialogAddSocial");
            });
            $("#dialogAddSocial").dialog(open).dialog({ width: 500 });
            BindItemsForEditSocial($(this).parents("tr"), "dialogAddSocial");
        });
        $con.find("[id=btnDeleteSocial]").button({
            icons: {
                primary: "ui-icon-closethick"
            },
            text: false
        }).unbind().click(function () {
            if (confirm("آیا از حذف مطمئن هستید؟"))
                DeleteSocial($(this).parents("tr").prop("id").replace("tr", ""), pageoption.container, this);
            else
                return;
        });
        // $con.find("#SocialList").parent().tableScroll({ height: 380 });
        //        if (pageoption.container == "divdialogEmployee")
        //            $con.dialog('open');
    }

    function buildExpenseList(jq, pageoption) {
        var $con = $("#" + pageoption.container);
        var table = {};
        var lstb = [];
        var lsth = [];
        if (jq.sumAmount != undefined)
            $con.find("#sumAmount").val(jq.sumAmount);
        jq = jq.results;
        lsth.push({ title: "گروه هزینه", sort: "ac_Expense.ac_ExpenseCategory.Expense", width: "12%" });
        lsth.push({ title: "مبلغ", sort: "Amount", footer: $con.find("#sumAmount").val(), width: "12%" });
        lsth.push({ title: "تاریخ ثبت", sort: "Date", width: "10%" });
        lsth.push({ title: "توسط", sort: "p_Person.Family", width: "12%" });
        lsth.push({ title: "شعبه", sort: "inv_Shop.Name", width: "10%" });
        lsth.push({ title: "صندوق", sort: "ac_Expense.ac_Counter.Code", width: "10%" });
        lsth.push({ title: "توضیحات", sort: "Description", width: "14%" });
        lsth.push({ title: "تائید", sort: "ac_Expense.p_Person.Family", width: "10%" });
        lsth.push({ title: "ویرایش/حذف", width: "10%" });

        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            trBody[0] = { trId: val.OrderHeaderId };
            trBody[1] = { name: "expenseCategory", id: val.ExpenseCategoryId, html: val.ExpenseCategory, width: "12%" };
            trBody[2] = { name: "amount", html: "<span>" + val.Amount + "</span>" + " " + val.Currency, width: "12%" };
            trBody[3] = { name: "date", html: val.Date, width: "10%" };
            trBody[4] = { name: "registerer", html: val.RegistererName, width: "12%" };
            trBody[5] = { name: "shop", html: val.shop, width: "10%" };
            trBody[6] = { name: "counter", html: val.counter, width: "10%" };
            trBody[7] = { name: "Description", html: val.Description, tooltip: 5, width: "14%" };
            trBody[8] = { name: "confirmer", html: (val.ConfirmerName != null ? val.ConfirmerName : ("<button id='btnConfirm'>تایید</button>")), width: "10%" };
            lstb.push(trBody);
        }
        var details = { editFunction: BindItemsForEditExpense, deleteFunction: DeleteExpense,
            confirmFunction: ConfirmExpense
        };
        table = { header: lsth, body: lstb, details: details, container: pageoption.container,
            hasFooter: true, divName: "expenseTable"
        };
        buildTable(table);
    }

    function BindItemsForEditSalary(dis, container) {
        var $con = $("#" + container);
        $con.find("#ddl_m_employee_add").val(dis.find("[name=employee]").prop("id").replace("td", ""));
        $con.find("#txt_m_fromDate_add").val(dis.find("[name=fromDate]").html());
        $con.find("#txt_m_toDate_add").val(dis.find("[name=toDate]").html());
        $con.find("#txt_m_fixSalary_add").val(dis.find("[name=fixsalary]").find("span").html());
        $con.find("#txt_m_commission_add").val(dis.find("[name=comission]").find("span").html());
        $con.find("#txt_salary_description_add").val(dis.find("[name=Description]").html());
    }

    function BindItemsForEditSocial(dis, container) {
        var $con = $("#" + container);
        $con.find("#ddl_social_employee_add").val(dis.find("[name=employee]").prop("id").replace("td", ""));
        $con.find("#txt_social_amount_add").val(dis.find("[name=amount]").find("span").html());
        $con.find("#Month_Name_Add select").val(dis.find("[name='month']").prop("id"));
        $con.find("#txt_social_description_add").val(dis.find("[name=Description]").html());
    }

    function BindItemsForEditExpense(dis, container) {
        $("#dialogAddExpense").dialog().dialog("destroy");
        var $row = $(dis).parents("tr");
        var id = $row.find("[name='expenseCategory']").prop("id");
        var $con = $("#" + container);
        $con.find("#divExpenseCategoryAdd").html("");
        $con.find("#btn_save").button({
            icons: {
                primary: "ui-icon-disk"
            }
        }).unbind().click(function () {
            if (validateAll($con.find("#dialogAddExpense")))
                EditExpense($row.prop("id").replace("tr", ""), "dialogAddExpense");
        });
        //        $("#dialogAddExpense").dialog(close).dialog({ width: 500, beforeClose: function () { $(this).dialog("destroy") } });
        $con.find("#divExpenseCategoryAdd").html("");
        bindHierarchyData({ id: "divExpenseCategoryAdd", container: container, table: "ExpenseCategory", canmodify: true, parentid: id, css: "selectsmall1 required validate" });
        $con.find("#txt_m_amount_add").val($row.find("[name=amount]").find("span").html());
        $con.find("#txt_m_description_add").val($row.find("[name=Description]").prop("title"));
        // $("#dialogAddExpense").dialog({ autoOpen: false, beforeClose: function () { alert("beforeclose"); $(this).dialog("destroy") } }).dialog("destroy").dialog(close);
        //        if ($("#dialogAddExpense").data("dialog").isOpen)

        $con.find("#dialogAddExpense").dialog({ autoOpen: true });   //.dialog(close); ;
        // $("#dialogAddExpense").dialog("destroy");
        //    $("#dialogAddExpense").dialog(close);
        //    $("#dialogAddExpense").dialog(open).dialog({ width: 500, beforeClose: function () { $(this).dialog("destroy") } });
        //    
    }

    function EditEmployeeSalary(orderHeaderID, container) {
        $con = $("#" + container);
        var DTO = { 'orderHeaderId': orderHeaderID, 'employeeId': $con.find("#ddl_m_employee_add").val(),
            'fromDate': $con.find("#txt_m_fromDate_add").val(), 'toDate': $con.find("#txt_m_toDate_add").val(),
            'fixSalary': $con.find("#txt_m_fixSalary_add").val(), 'commission': $con.find("#txt_m_commission_add").val(),
            'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
            'currencyId': $("#userDefault").find("#ddl_m_Currency").val(),
            'description': $con.find("#txt_salary_description_add").val(),
            'shopId': $("#userDefault").find("#ddl_s_Branch").val()
        };
        $.ajax({
            type: "POST",
            url: "Management/EditSalary",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function EditSocialSecurity(orderHeaderID, container) {
        $con = $("#" + container);
        var DTO = { 'orderHeaderId': orderHeaderID, 'employeeId': $con.find("#ddl_social_employee_add").val(),
            'month': $con.find("#Month_Name_Add option:selected").val(),
            'amount': $con.find("#txt_social_amount_add").val(),
            'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
            'currencyId': $("#userDefault").find("#ddl_m_Currency").val(),
            'description': $con.find("#txt_social_description_add").val(),
            'shopId': $("#userDefault").find("#ddl_s_Branch").val()
        };
        $.ajax({
            type: "POST",
            url: "Management/EditSocialSecurity",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function EditExpense(orderHeaderID, container) {
        $con = $("#" + container);
        var DTO = { 'orderHeaderId': orderHeaderID, 'expenseCategory': getHierarchySelectedValue("divExpenseCategoryAdd", container),
            'amount': $con.find("#txt_m_amount_add").val(),
            'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
            'currencyId': $("#userDefault").find("#ddl_m_Currency").val(),
            'description': $con.find("#txt_m_description_add").val(),
            'shopId': $("#userDefault").find("#ddl_s_Branch").val()
        };
        $.ajax({
            type: "POST",
            url: "Management/EditExpense",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function ConfirmSalary(orderHeaderId, container, $dis) {
        var $con = $("#" + container);
        var DTO = { 'orderHeaderId': orderHeaderId };
        $.ajax({
            type: "POST",
            url: "Management/ConfirmSalary",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response != null && response.isDone == true) {
                    var $parentBtn = $dis.parent();
                    //                    $con.find("#btnSalaryConfirm").remove();
                    $parentBtn.html(response.name + " " + response.family + " " + response.code);
                }
                else
                    translate(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function ConfirmSocialSecurity(orderHeaderId, container, $dis) {
        var $con = $("#" + container);
        var DTO = { 'orderHeaderId': orderHeaderId };
        $.ajax({
            type: "POST",
            url: "Management/ConfirmSocialSecurity",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response != null && response.isDone == true) {
                    var $parentBtn = $dis.parent();
                    //                    $con.find("#btnSocialConfirm").remove();
                    $parentBtn.html(response.name + " " + response.family + " " + response.code);
                }
                else
                    translate(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function ConfirmExpense(dis, container) {
        var $con = $("#" + container);
        var $dis = $(dis);
        var DTO = { 'orderHeaderId': $dis.parents("tr").prop("id").replace("tr", "") };
        $.ajax({
            type: "POST",
            url: "Management/ConfirmExpense",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response != null && response.isDone == true) {
                    var $parentBtn = $dis.parent();
                    //                    $con.find("#btnExpenseConfirm").remove();
                    $parentBtn.html(response.name + " " + response.family); //+ " " + response.code);
                }
                else
                    translate(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function DeleteSalary(orderHeaderId, container, dis) {
        var $con = $("#" + container);
        var DTO = { 'orderHeaderId': orderHeaderId };
        $.ajax({
            type: "POST",
            url: "Management/DeleteSalary",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response != null && response.isDone == true) {
                    $(dis).parents("tr").remove();
                }
                translate(response.msg);
            },
            error: function (response) {
                alert(response.responseText);

            }
        });
    }
    function DeleteSocial(orderHeaderId, container, dis) {
        var $con = $("#" + container);
        var DTO = { 'orderHeaderId': orderHeaderId };
        $.ajax({
            type: "POST",
            url: "Management/DeleteSocial",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response != null && response.isDone == true) {
                    $(dis).parents("tr").remove();
                }
                translate(response.msg);
            },
            error: function (response) {
                alert(response.responseText);

            }
        });
    }

    function DeleteExpense(dis, container) {
        var $con = $("#" + container);
        var $dis = $(dis);
        var DTO = { 'orderHeaderId': $dis.parents("tr").prop("id").replace("tr", "") };
        $.ajax({
            type: "POST",
            url: "Management/DeleteExpense",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response != null && response.isDone == true) {
                    $dis.parents("tr").remove();
                    return true;
                }
                translate(response.msg)
            },
            error: function (response) {
                alert(response.responseText);

            }
        });
    }


    //-----------------expense end-------------------


    //--------------------js AccountDetailsShop begin-----------------------

    function loadAccountDetailsShopSale(container, first) {

        if (first) {
            var $con = $("#" + container);
            $con.find("#clearSale").html("فروش خالص");
            $con.find("#clearAmount").html("مبلغ واریزی خالص");
            $con.find("#countSale").html("تعداد فروش");
            $con.find("#sumSale").html("جمع فروش");
            $con.find("#divdialogCustomer").dialog({ autoOpen: false }).dialog({ width: 600 });
            $con.find("#ddl_s_Scoup").val("day");
            $con.find("#txt_s_DateStart").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#txt_s_DateEnd').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#txt_s_DateEnd").datepicker({ changeMonth: true, changeYear: true });
            $con.find("#a_CustomerIntroducerCode").off().on('click', function () {
                opendialog({ container: "divdialogCustomer", containerpage: container });
            });
            $con.find("#btnSearch").button({ icons: {
                primary: "ui-icon-search"
            }
            }).off().on('click', function () {
                AccountDetailsShop(container, true);
            });
        }
        AccountDetailsShop(container, true);
    }

    function loadAccountDetailsShopBuy(container, first) {

        if (first) {
            var $con = $("#" + container);
            $con.find("#clearSale").html("خرید خالص");
            $con.find("#clearAmount").html("مبلغ برداشتی خالص");
            $con.find("#countSale").html("تعداد خرید");
            $con.find("#sumSale").html("جمع خرید");
            $con.find("#divdialogCustomer").dialog({ autoOpen: false }).dialog({ width: 600 });
            $con.find("#ddl_s_Scoup").val("day");
            $con.find("#txt_s_DateStart").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#txt_s_DateEnd').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#txt_s_DateEnd").datepicker({ changeMonth: true, changeYear: true });
            $con.find("#btnSearch").button({ icons: {
                primary: "ui-icon-search"
            }
            }).off().on('click', function () {
                AccountDetailsShop(container, false);
            });
            $con.find("#a_CustomerIntroducerCode").off().on('click', function () {
                opendialog({ container: "divdialogCustomer", containerpage: container });
            });
        }
        AccountDetailsShop(container, false);
    }

    function AccountDetailsShop(container, isSale) {
        var $con = $("#" + container);
        DTO = { 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'Scoup': $con.find("#ddl_s_Scoup").val(), 'clientid': "", 'employeeid': $con.find("#txt_s_Supplier").val(), 'dateFrom': $con.find("#txt_s_DateStart").val(), 'dateTo': $con.find("#txt_s_DateEnd").val(), 'isSale': isSale, 'clientCode': $con.find("#CustomerIntroducerCode").val() };
        $.ajax({
            type: "POST",
            url: "Management/GetAccountDetailsShop",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (isSale) {
                    $con.find("#txt_d_Sale").val(response.BuyAmount * 1 - response.SellAmount * 1);
                    $con.find("#txt_d_PaymentSale").val((response.ReceivedCash * 1 + response.ReceivedCheque * 1 + response.ReceivedVoucher * 1) - (response.PaidCash * 1 + response.PaidCheque * 1 + response.paidVoucher * 1));
                    $con.find("#txt_d_BalanceTotal").val((response.BuyAmount * 1 - response.SellAmount * 1) - ((response.ReceivedCash * 1 + response.ReceivedCheque * 1 + response.ReceivedVoucher * 1) - (response.PaidCash * 1 + response.PaidCheque * 1 + response.paidVoucher * 1)));
                    $con.find("#txt_d_SaleTotal").val(response.BuyAmount);
                    $con.find("#txt_d_Return").val(response.SellAmount);
                    $con.find("#txt_d_TotalPayment").val(response.PaidCash * 1 + response.PaidCheque * 1 + response.paidVoucher * 1);
                    $con.find("#txt_d_TotalReceive").val(response.ReceivedCash * 1 + response.ReceivedCheque * 1 + response.ReceivedVoucher * 1);
                    $con.find("#txt_d_ChequePeyment").val(response.PaidCheque);
                    $con.find("#txt_d_ChequeReceive").val(response.ReceivedCheque);
                    $con.find("#txt_d_CashPayment").val(response.PaidCash);
                    $con.find("#txt_d_CashReceive").val(response.ReceivedCash);
                    $con.find("#txt_d_TotalOff").val(response.OffSale * 1 - response.BuyAmount * 1);
                    $con.find("#txt_d_profit").val(response.profit);
                    $con.find("#txt_d_BuyQuantity").val(response.BuyQuantity);
                    $con.find("#txt_d_SellQuantity").val(response.SellQuantity);
                    $con.find("#txt_d_NetQuantity").val(response.BuyQuantity * 1 - response.SellQuantity * 1);
                }
                else if (!isSale) {

                    $con.find("#txt_d_Sale").val(response.SellAmount * 1 - response.BuyAmount * 1);
                    $con.find("#txt_d_PaymentSale").val((response.PaidCash * 1 + response.PaidCheque * 1 + response.paidVoucher * 1) - (response.ReceivedCash * 1 + response.ReceivedCheque * 1 + response.ReceivedVoucher * 1));
                    $con.find("#txt_d_BalanceTotal").val((response.SellAmount * 1 - response.BuyAmount * 1) - ((response.PaidCash * 1 + response.PaidCheque * 1 + response.paidVoucher * 1) - (response.ReceivedCash * 1 + response.ReceivedCheque * 1 + response.ReceivedVoucher * 1)));
                    $con.find("#txt_d_SaleTotal").val(response.SellAmount);
                    $con.find("#txt_d_Return").val(response.BuyAmount);
                    $con.find("#txt_d_TotalPayment").val(response.PaidCash * 1 + response.PaidCheque * 1 + response.paidVoucher * 1);
                    $con.find("#txt_d_TotalReceive").val(response.ReceivedCash * 1 + response.ReceivedCheque * 1 + response.ReceivedVoucher * 1);
                    $con.find("#txt_d_ChequePeyment").val(response.PaidCheque);
                    $con.find("#txt_d_ChequeReceive").val(response.ReceivedCheque);
                    $con.find("#txt_d_CashPayment").val(response.PaidCash);
                    $con.find("#txt_d_CashReceive").val(response.ReceivedCash);
                    $con.find("#txt_d_TotalOff").val(response.OffBuy * 1 - response.SellAmount * 1);
                    $con.find("#txt_d_profit").val(response.profit);
                    $con.find("#txt_d_BuyQuantity").val(response.BuyQuantity);
                    $con.find("#txt_d_SellQuantity").val(response.SellQuantity);
                    $con.find("#txt_d_NetQuantity").val(response.BuyQuantity * 1 - response.SellQuantity * 1);

                }
            },

            error: function (response) { alert(response.responseText); }
        });
    }


    //--------------------js AccountDetailsShop end-----------------------


    //--------------------js Accounting start-----------------------
    var isper;
    var SavedNewAccountings;
    function loadAddAccounting(container, first) {
        var $con = $("#" + container);
        if (first) {
            $con.find("#tbl_Accounting").tableScroll({ height: 300, width: contentwidth, flush: false });

            for (var i = 1; i <= 5; i++) {
                AddRowTblAccounting(container, null, +($con.find("#hi_cRow").val()));
                $con.find("#hi_cRow").val(+($con.find("#hi_cRow").val()) + 1);
            }
            var i = 1;
            $.each($("#" + container).find("#AccountingList tr  .trc"), function () {
                $(this).find("[id*=lb]").text(i);
                i++;
            });



            $con.find("#btn_AddNewRow").off().on('click', function () {
                AddRowTblAccounting(container, null, +($con.find("#hi_cRow").val()));
                $con.find("#hi_cRow").val(+($con.find("#hi_cRow").val()) + 1);
                var i = 1;
                $.each($("#" + container).find("#AccountingList tr"), function () {
                    if ($(this).hasClass("trc")) {
                        $(this).find("[id*=lb]").text(i);
                        i++;
                    }
                });
            });


            $con.find("#btn_TemporarySaveAccounting").off().on('click', function () {
                $con.find("#isper").val(false);
                SavedNewAccountings = true;
                if ($con.find("#spDeptor").html() - (-1 * (+$con.find("#spCreditor").html())) != 0) {
                    alert("notBalance");
                }
                else {
                    $con.find("#frm_Accounting").submit();
                }

                $con.find("#countRow").val($con.find('#AccountingList').children().length);
            }).button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            });


            $con.find("#btn_PermanentSaveAccounting").off().on('click', function () {
                $con.find("#isper").val(true);
                SavedNewAccountings = true;
                if ($con.find("#spDeptor").html() - (-1 * +$con.find("#spCreditor").html() != 0)) {
                    alert("notBalance");
                }
                else {
                    $con.find("#frm_Accounting").submit();
                }

            }).button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            });

            $con.find("#btn_Print").off().on('click', function () {
                PrintAddedAccountDetails(container, $con.find("#hi_AddedOrderHeaderId").val());
            }).button({ icons: {
                primary: "ui-icon-print"
            },
                text: true
            });



            $con.find('#Frm_Tshop').ajaxForm({
                // target: '#fileInput',
                data: { ShopId: $("#userDefault").find("#ddl_s_Branch").val(), CurrencyRateId: $("#userDefault").find("#ddl_m_Currency").val(), CounterId: $("#userDefault").find("#ddl_m_Counter").val(), date: $("#userDefault").find("#txt_s_Date").val(), isper: isper },
                success: function (response) {
                    alert(response.msg);
                    $con.find("#hi_AddedOrderHeaderId").val(response.orderHeaderId)

                },
                complete: function (xhr) {

                }
            });


            $con.find('#txt_AccountingDescription').blur(function () {
                var rowCount = $con.find("#hi_cRow").val();
                for (var i = 1; i <= rowCount; i++) {
                    $con.find("#txt_description" + i).val($(this).val());

                }
            });

            localize();
        }
    }

    function AddRowTblAccounting(container, Account, rowCount) {
        var $con = $("#" + container);
        var trid = rowCount + 1;

        var ItemList = "<tr class='trc' id='" + (trid) + "' style='border-bottom-style: solid; border-width: 0px 0px 3px 0px; border-color: #C0C0C0'> <td width='4%'>" +
                 " <label id='lb" + trid + "'></label>" +
                 "<input type='hidden' id='hi_AccountId" + trid + "' name='hi_AccountId" + trid + "'  />" +
                 "</td>" +
                 "<td width='90%'>" +
                  " <table> <tr>  <td width='6%'>" +
                   "<input type='text' id='txt_code" + trid + "' name='txt_code" + trid + "' placeholder='code' class='inputW136  '/></td>" +
                   "  <td width='18%'><input type='text' id='txt_title" + trid + "' name='txt_title" + trid + "' placeholder='account'  style='width: 100%'/> </td>" +
                   "  <td width='3%'><input type='text' placeholder='debtor' name='txt_deptor" + trid + "' id='txt_deptor" + trid + "' class='inputW136 digit'/></td> " +
                    " <td width='4%'><input type='text' placeholder='creditor' name='txt_creditor" + trid + "' id='txt_creditor" + trid + "' class='inputW136 digit' /></td> </tr>" +
                "<tr >" +
                "<td colspan='4'>" +
                 "<div > <span title='شرح'></span>" +
                    "<input type='text' placeholder='description'  id='txt_description" + trid + "' name='txt_description" + trid + "'  style='width:95% '/>" +
                "</div></td>" +

                "</tr> </table></td>" +
                "<td id='delete'><span title='حذف' name='delete' class='cursor ui-icon ui-icon-closethick'  width= '90%' height='95%'></span></td>" +

                "</tr>";


        $con.find("#AccountingList").append(ItemList).parent().tableScroll({ height: 300, width: contentwidth, flush: false });
        aComplete({ methodname: "GetCompletionListByAccountName", servicename: "Management", id: "txt_title" + trid, boxId: "txt_code" + trid, container: container, minlength: 2, autofocus: false, limit: 20, fname: OpeningAccountOnSelect });

        $con.find("#txt_deptor" + trid).blur(function (e) {

            totalDebtCreditOpeningAccount(container);
        });


        $con.find("#txt_creditor" + trid).blur(function (e) {

            totalDebtCreditOpeningAccount(container);
        });

        $con.find("#txt_deptor" + trid).spinner({ step: 1000, change: function () {
            totalDebtCreditOpeningAccount(container);
        },
            stop: function () {
                totalDebtCreditOpeningAccount(container);
            }
        });

        $con.find("#txt_creditor" + trid).spinner({ step: 1000, change: function () {
            totalDebtCreditOpeningAccount(container);
        },
            stop: function () {
                totalDebtCreditOpeningAccount(container);
            }
        });



        var name = "lb" + trid;
        $con.find("#" + name).text(trid);


        $con.find("[id=delete]").unbind().bind('click', function () {
            if (confirm("آیا از حذف مطمئن هستید؟")) {
                var id = $(this).parents("tr").first().prop("id");
                $("#" + id).remove();
                var i = 1;
                $.each($("#" + container).find("#AccountingList tr "), function () {
                    if ($(this).find("[id*=lb]").length > 0) {
                        $(this).find("[id*=lb]").text(i);
                        i++;
                    }
                });
            }
            else
                return;
        });


        localize();
    }



    function PrintAddedAccountDetails(container, orderHeaderId) {
        var $con = $("#" + container);
        if ($con.find("#Div_Print").html().length < 10) {
            $con.find("#Div_Print").load("Report/PrintAccount.htm", function () {
                getAccountPrint(orderHeaderId, container);
            });
        }
        else
            getAccountPrint(orderHeaderId, container);
    }

    function getAccountPrint(OrderHeaderId, container) {
        var $con = $("#" + container);
        var DTO = { 'id': OrderHeaderId };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/GetAccountById",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone) {
                    SetAccountData(container, response);
                    Popup($con.find("#Div_Print").html());
                }
                else
                    alert("noData");

            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function SetAccountData(container, response) {

        var $con = $("#" + container);
        //$con.find("#Div_Print").load("Report/PrintInvoice.htm", function () {
        var List = response.accountDetail;
        var ItemList = "";
        for (var i = 0; i < List.length; i++) {
            var val = List[i];
            if (val.IsDept)
                ItemList += "<tr><td align='Center'>" + (i * 1 + 1) + "</td>" +
                "<td align='Right'  nowrap='nowrap'><h6>" + val.Code + "</h6></td>" +
                "<td align='Center' nowrap='nowrap'><h6>" + val.Name + "</h6></td>" +
                 "<td align='Center' nowrap='nowrap'></td>" +
                "<td align='Center' nowrap='nowrap'>" + val.Amount + "</td>" +
                "<td align='Center' nowrap='nowrap'></td></tr>";
            else
                ItemList += "<tr><td align='Center'>" + (i * 1 + 1) + "</td>" +
                "<td align='Right'  nowrap='nowrap'><h6>" + val.Code + "</h6></td>" +
                "<td align='Center' nowrap='nowrap'><h6>" + val.Name + "</h6></td>" +
                 "<td align='Center' nowrap='nowrap'></td>" +
                "<td align='Center' nowrap='nowrap'></td>" +
                 "<td align='Center' nowrap='nowrap'>" + val.Amount + "</td></tr>";

        }
        ItemList += "<tr><td align='Center' style='border-bottom:hidden; border-right:hidden;' nowrap='nowrap' colspan='3' dir='ltr' align='left'></td>" +
                 "<td align='Center' nowrap='nowrap'  align='left'><h6>جمع صفحه</h6></td>" +
                "<td align='Center' nowrap='nowrap'>" + response.Amount + "</td>" +
                 "<td align='Center' nowrap='nowrap'>" + response.Amount + "</td></tr>";
        ItemList += "<tr><td align='Center' nowrap='nowrap'  style='border-bottom:hidden;border-right:hidden;' colspan='3' dir='ltr' align='left'></td>" +
                "<td align='Center' nowrap='nowrap' align='left'><h6> جمع کل </h6></td>" +
                "<td align='Center' nowrap='nowrap'>" + response.Amount + "</td>" +
                 "<td align='Center' nowrap='nowrap'>" + response.Amount + "</td></tr>";

        $con.find("#LInvoiceNo").html(response.InvoiceNO);
        $con.find("#LDate").html(response.Date);
        $con.find("#Ldescription").html(response.Description);
        //    $con.find("#LAmount1").html(response.Amount);
        //    $con.find("#Ltotal2").html(response.Amount);
        //    $con.find("#LAmount2").html(response.Amount);
        $con.find("#DetailAccountList").html(ItemList);
    }


    function AccountOnSelect(event, ui, container, id) {
        var $con = $("#" + container);
        var txtid = id.replace("txt_title", "txt_code");
        $con.find(txtid).val(ui.item.value);
    }

    //--------------------js Accounting end-----------------------

    //--------------------js Accounting List start-----------------------


    function loadDisplayAccounts(container, first) {
        var $con = $("#" + container);
        InvoiceListload(container, first)
        sortid = "ac_OrderHeader.OrderHeaderId desc";
        if (first) {

            $con.find("[id=btnSearch]").button({ icons: {
                primary: "ui-icon-search"
            }
            }).unbind('click').click(function () {
                sortid = "ac_OrderHeader.OrderHeaderId desc";
                getFullAccountingList(container, { container: container, callbackmethod: getFullAccountingList, fname: "", page_index: 0,
                    build: buildAcountsList, servicename: "Management", methodname: "GetFullAccountList", print: false
                });

            });
            bindHierarchyData({ id: "hr_acc_category", table: "account", container: container, styleclass: "PagingSelect " });
            aComplete({ methodname: "GetCompletionListByAccountName", servicename: "Management", id: "txt_Accounting", boxId: "lb_AccountingName", container: container, minlength: 2, autofocus: false, limit: 20, fname: AccountListOnSelect });

            $con.find("#txt_AccListDateStart").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#txt_AccListDateEnd').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#txt_AccListDateEnd").datepicker({ changeMonth: true, changeYear: true });

            getFullAccountingList(container, { container: container, callbackmethod: getFullAccountingList, fname: "", page_index: 0,
                build: buildAcountsList, servicename: "Management", methodname: "GetFullAccountList", print: false
            });

            $con.find("#btnPrint").die().live('click', function () {
                PrintAccountingDetails(container, "daybookPrint");
            }).button({ icons: {
                primary: "ui-icon-print"
            },
                text: true
            });

        }
    }


    function PrintAccountingDetails(container, isPrint) {
        var $con = $("#" + container);
        if ($con.find("#Div_Print").html().length < 10) {
            $con.find("#Div_Print").load("Report/PrintAccounting.htm", function () {
                getAccountingPrint(container, isPrint);
            });
        }
        else
            getAccountingPrint(container, isPrint);
    }

    function getAccountingPrint(container, isPrint) {
        var $con = $("#" + container);
        var DTO = {
            'sort': sortid,
            'shopid': $("#userDefault").find("#ddl_s_Branch").val(),
            'accCode': $con.find("#txt_Accounting").val(),
            'AccountingDateStart': $con.find("#txt_AccListDateStart").val(),
            'AccountingDateEnd': $con.find("#txt_AccListDateEnd").val(),
            'accountId': getHierarchySelectedValue("hr_acc_category", container) == null ? $con.find("#hd_d_PersonId").val() : getHierarchySelectedValue("hr_acc_category", container),
            'description': $con.find("#txt_description").val(),
            'invoiceNo': $con.find("#txt_invoiceNumber").val(),
            'documentNumber': $con.find("#txt_documentNumber").val(),
            'isPrint': isPrint
        };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/GetFullAccountList",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone) {
                    SetAccountinglistData(container, response);
                    Popup($con.find("#Div_Print").html());
                }
                else
                    alert("noData");

            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }


    function SetAccountinglistData(container, response) {

        var $con = $("#" + container);
        //$con.find("#Div_Print").load("Report/PrintInvoice.htm", function () {
        var ItemList = "";
        var totalFinance = 0;
        var totalDebtandFund = 0;
        var loss = 0;
        var count = 0;
        $con.find("#lb_DateRange").html("از تاریخ" + "&nbsp;&nbsp;" + ToPersianDate(response.DateStart) + "&nbsp;&nbsp;" + "تا تاریخ" + "&nbsp;&nbsp;" + ToPersianDate(response.DateEnd));
        for (var i = 0; i < response.results.length; i++) {
            var recAcc = response.results[i];
            var first = true;
            var description = "";
            for (var j = 0; j < recAcc.length; j++) {
                var rec = recAcc[j];
                description = rec.Description;
                var date = rec.Date;
                var d = ToPersianDateDigitYearRight(date);
                var da = d.split('/');

                if (rec.IsDept) {
                    ItemList += "<tr>" +
                                   "<td width='5%' style='border-top: hidden;border-bottom: hidden;'>" + (first ? rec.InvoiceNO : "&nbsp;") + "</td>" +
                                    "<td width='5%' style='border-top: hidden;border-bottom: hidden;'><table  style='font-family: tahoma; font-size: small; width: 100%; height: 100%; margin-left: auto;margin-right: auto; border-bottom: hidden;' cellspacing='0px' cellpadding='0px' width='100%'>" +
                                   " <tr><td width='50%'  style='border-top: hidden;border-bottom: hidden;text-align:center;'>" + d[3] + "</td>" +
                                   "<td width='50%'  style='border-top: hidden;border-bottom: hidden;text-align:center;'>" + d[2] + "</td></tr></table>" +
                                   "</td>" +
                                    "<td width='60%' style='border-top: hidden;border-bottom: hidden;' >" + rec.title + "</td>" +
                                        "<td width='10%' style='border-top: hidden;border-bottom: hidden;' >" + rec.AccountDetailId + "</td>" +
                                         "<td width='10%' style='border-top: hidden;border-bottom: hidden;'>" + rec.Amount + "</td>" +
                                         "<td width='10%' style='border-top: hidden;border-bottom: hidden;'>&nbsp;</td>" +
                                       "</tr>";
                }
                else {
                    ItemList += "<tr>" +
                                  "<td width='5%' style='border-top: hidden;border-bottom: hidden;'>" + (first ? rec.InvoiceNO : "&nbsp;") + "</td>" +
                                   "<td width='5%' style='border-top: hidden;border-bottom: hidden;'><table  style='font-family: tahoma; font-size: small; width: 100%; height: 100%; margin-left: auto;margin-right: auto; border-bottom: hidden;' cellspacing='0px' cellpadding='0px' width='100%'>" +
                                   " <tr><td width='50%'  style='border-top: hidden;border-bottom: hidden;text-align:center;'>" + d[3] + "</td>" +
                                   "<td width='50%'  style='border-top: hidden;border-bottom: hidden;text-align:center;'>" + d[2] + "</td></tr></table>" +
                                   "</td>" +
                                    "<td width='60%' style='border-top: hidden;border-bottom: hidden;' >" + ("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + rec.title) + "</td>" +
                                        "<td width='10%' style='border-top: hidden;border-bottom: hidden;' >" + rec.AccountDetailId + "</td>" +
                                         "<td width='10%' style='border-top: hidden;border-bottom: hidden;'>&nbsp;</td>" +
                                         "<td width='10%' style='border-top: hidden;border-bottom: hidden;'>" + rec.Amount + "</td>" +
                                       "</tr>";
                }



                first = false;
            }

            ItemList += "<tr>" +
                                  "<td width='5%' style='border-top: hidden;border-bottom: hidden;'>&nbsp;</td>" +
                                   "<td width='5%' style='border-top: hidden;border-bottom: hidden;'>&nbsp;" +
                                   "</td>" +
                                    "<td width='60%' style='border-top: hidden' >" + (description != "" ? description : "&nbsp;") + "</td>" +
                                        "<td width='10%' style='border-top: hidden;border-bottom: hidden;' >&nbsp;</td>" +
                                         "<td width='10%' style='border-top: hidden;border-bottom: hidden;'>&nbsp;</td>" +
                                         "<td width='10%' style='border-top: hidden;border-bottom: hidden;'>&nbsp;</td>" +
                                       "</tr>";
        }

        ItemList += "<tr>" +
                          "<td colspan='3' style='border-right: hidden;border-bottom: hidden;'>" + ToPersianDate(response.DateNow) + "</td>" +
                            "<td width='10%' >جمع صفحه</td>" +
                                 "<td width='10%' >" + response.sumDebtor + "</td>" +
                                 "<td width='10%' >" + response.sumCreditor + "</td>" +
                               "</tr>";
        ItemList += "<tr>" +
                          "<td colspan='3' style='border-right: hidden;border-bottom: hidden;border-top: hidden;'></td>" +
                            "<td width='10%' >جمع کل</td>" +
                                 "<td width='10%' >" + response.sumDebtor + "</td>" +
                                 "<td width='10%' >" + response.sumCreditor + "</td>" +
                               "</tr>";



        $con.find("#DetailAccountList").html(ItemList);
    }

    function AccountListOnSelect(event, ui, container) {
        var $con = $("#" + container);
        $con.find("#txt_Accounting").val(ui.item.value);
        $con.find("#lb_AccountingName").text(ui.item.label);
    }

    function getFullAccountingList(container, params) {
        var $con = $("#" + container);
        var DTO = {
            'sort': sortid,
            'shopid': $("#userDefault").find("#ddl_s_Branch").val(),
            'accCode': $con.find("#txt_Accounting").val(),
            'AccountingDateStart': $con.find("#txt_AccListDateStart").val(),
            'AccountingDateEnd': $con.find("#txt_AccListDateEnd").val(),
            'accountId': getHierarchySelectedValue("hr_acc_category", container),
            'description': $con.find("#txt_description").val(),
            'invoiceNo': $con.find("#txt_invoiceNumber").val(),
            'documentNumber': $con.find("#txt_documentNumber").val(),
            'isPrint': "daybook"
        };
        params["DTO"] = DTO;
        pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
            first: true, isOrder: true
        });
    }

    function buildAcountsList(jq, container) {
        var $con = $("#" + container.pagingContainer);
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        $con.find("#divFooter").removeClass("invisible")
        lsth.push({ title: "documentNumber", sort: "AccountDetailId", width: "7%" });
        lsth.push({ title: "invoiceNumber", sort: "ac_OrderHeader.InvoiceNO", width: "8%" });
        lsth.push({ title: "registerDate", sort: "ac_OrderHeader.Date", width: "10%" });
        lsth.push({ title: "accountCode", sort: "ac_Account.Code", width: "5%" });
        lsth.push({ title: "account", sort: "ac_Account.Name", width: "20%" });
        lsth.push({ title: "debtorAmount", sort: "IsDept", width: "10%" });
        lsth.push({ title: "creditorAmount", width: "10%" });
        lsth.push({ title: "balanceAmount", sort: "Amount", width: "10%" });
        lsth.push({ title: "registerer", sort: "ac_OrderHeader.p_Employee.p_Person.Name", width: "10%" });
        lsth.push({ title: "confirmer", sort: "ac_OrderHeader.p_Employee1.p_Person.Name", width: "10%" });

        //        if (!container.params.print)
        //            lsth.push({ title: "details", width: "10%" });
        var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
        var ItemList = "";
        if (List != null)
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                var trBody = {};
                if (!container.params.print)
                    trBody[0] = { trId: val.AccountDetailId };
                trBody[1] = { name: "accountId", html: val.AccountDetailId, width: "7%" };
                trBody[2] = { name: "name", html: val.InvoiceNO, width: "8%" };
                trBody[3] = { props: { datedigit: ToPersianDateDigitYearRight(val.Date), date: val.Date, name: "date", width: "10%", klass: "dateLong"} };
                trBody[4] = { name: "accountCode", html: val.Code, width: "5%" };
                trBody[5] = { name: "account", html: val.title + " " + val.Description, width: "20%" };
                trBody[6] = { html: (val.IsDept == true ? val.Amount : ""), props: { name: "Debtor", klass: "digit", style: "font-size:1em;", width: "10%"} };
                trBody[7] = { html: (val.IsDept != true ? val.Amount : ""), props: { name: "Creditor", klass: "digit", style: "font-size:1em;", width: "10%"} };
                trBody[8] = { html: (val.balance), props: { name: "Balance", klass: "digit", style: "font-size:1em;", width: "10%"} };
                trBody[9] = { name: "NameFamily", html: val.Name + " " + val.Family, width: "10%" };
                trBody[10] = { name: "confirmer", html: val.confirmer, width: "10%" };

                lstb.push(trBody);
            }
        $con.find("#spDeptor").html(jq.sumDebtor);
        $con.find("#spCreditor").html(jq.sumCreditor);
        $con.find("#spBalance").html(Math.round((jq.sumDebtor * 1) - (jq.sumCreditor * 1), 1));
        $con.find("#spNotPassedCheque").html(jq.sumNotPassed);
        $con.find("#spNetBalance").html(Math.round((jq.sumDebtor * 1) - (jq.sumCreditor * 1) - (jq.sumNotPassed * 1), 1));

        if (container.params.print) {
            table = { header: lsth, body: lstb, details: { rowClick: AccountRowOnSelect }, heigth: 300,
                container: container.pagingContainer, divName: "Div_Print", hasFooter: false
            };
            buildPrintTable(table);
            container.params.print = false;
        }
        else {
            table = { header: lsth, body: lstb, details: { rowClick: AccountRowOnSelect }, heigth: 300,
                container: container.pagingContainer, divName: "acountReportlist", hasFooter: false
            };
            buildTable(table);
        }
    }

    function AccountRowOnSelect($dis, container) {
        var $con = $("#" + container);
        createSubTab({ row: $dis, name: "a_DisplayAccounts" });
        onRowClick($dis);
    }

    function loadAccountingEdit(AccountDetailId, container, first) {
        var $con = $("#" + container);
        var DTO = {
            'AccountDetailId': AccountDetailId
        };
        DisplayAccountInfo(container, DTO, "GetAccountInfo");
        $con.find("[id=btn_SearchAccounting]").button({ icons: {
            primary: "ui-icon-search"
        }
        }).unbind('click').click(function () {
            DTO = {
                'OrderHeaderId': $con.find("#txt_OrderHeaderId").val(),
                'InvoiceNum': $con.find("#txt_InvoiceNum").val()
            };
            DisplayAccountInfo(container, DTO, "GetAccountInfoSearch2");
        });

        $con.find('#frm_Accounting').ajaxForm({
            data: { ShopId: $("#userDefault").find("#ddl_s_Branch").val(), CurrencyRateId: $("#userDefault").find("#ddl_m_Currency").val(),
                CounterId: $("#userDefault").find("#ddl_m_Counter").val(),
                date: $("#userDefault").find("#txt_s_Date").val(), isper: isper
            },

            success: function (response) {
                alert(response.msg);
            },
            complete: function (xhr) {

            }
        });

        $con.find("#btn_TemporarySaveAccounting").off().on('click', function () {
            //                $con.find("#frm_Accounting").attr("action", "Management/AddItemAccounting");
            isper = false;
            $con.find("#countRow").val($con.find('#AccountingList').children().length);
        }).button({ icons: {
        //        primary: "ui-icon-disk"
    },
            text: true
        });


        $con.find("#btn_PermanentSaveAccounting").off().on('click', function () {
            //                $con.find("#frm_Accounting").attr("action", "Management/AddItemAccounting");
            isper = true;
            $con.find("#countRow").val($con.find('#AccountingList').children().length);
        }).button({ icons: {
        //        primary: "ui-icon-disk"
    },
            text: true
        });

        $con.find("#btn_Print").off().on('click', function () {
            PrintAddedAccountDetails(container, $con.find("#txt_OrderHeaderId").val());
        }).button({ icons: {
            primary: "ui-icon-print"
        },
            text: true
        });

    }

    function DisplayAccountInfo(container, DTO, ServiceName) {
        var $con = $("#" + container);
        $con.find("#AccountingList").parents("form").append('<input type="hidden" id="countRow" name="countRow" />');
        $con.find("#countRow").val($con.find('#AccountingList').children().length);
        $con.find("#txt_AccountingDate").datepicker({ changeMonth: true, changeYear: true });
        $.ajax({
            url: "Management/" + ServiceName,
            data: JSON.stringify(DTO),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response.isdone) {

                    var row = 1;
                    $con.find("#txt_AccountingDescription").val(response.Description);
                    $con.find("#txt_AccountingDate").val(ToPersianDateDigitYearRight(response.Date));
                    $con.find("#txt_PersonName").val(response.Name + " " + response.Family);
                    $con.find("#txt_ShopName").val(response.ShopName);
                    $con.find("#txt_OrderHeaderId").val(response.OrderHeaderId);
                    $con.find("#txt_InvoiceNum").val(response.InvoiceNO);
                    $con.find("#AccountingList").html("");

                    for (var i = 0; i < response.orderDetailes.length; i++) {
                        var row = +($con.find("#hi_cRow").val()) + 1;
                        var Account = response.orderDetailes[i];
                        AddRowTblAccounting(container, null, +($con.find("#hi_cRow").val()));
                        if (Account != undefined) {
                            $con.find("#hi_AccountId" + row).val(Account.AccountDetailId);
                            $con.find("#txt_code" + row).val(Account.Code);
                            $con.find("#txt_title" + row).val(Account.title);
                            $con.find("#txt_deptor" + row).val(Account.IsDept == true ? Account.Amount : "");
                            $con.find("#txt_creditor" + row).val(Account.IsDept == false ? Account.Amount : "");
                            $con.find("#txt_description" + row).val(Account.Description);
                        }
                        $con.find("#hi_cRow").val(+($con.find("#hi_cRow").val()) + 1);
                        //                        AddRowTblAccounting(container, response.orderDetailes[i], +($con.find("#hi_cRow").val()));
                        //                       
                        //                        $con.find("input[name=txt_code" + rownumber + "]").val(response.orderDetailes[i].Code);

                        //                        $con.find("input[name=txt_title" + rownumber + "]").val(response.orderDetailes[i].title);
                        //                        aComplete({ methodname: "GetCompletionListByAccountName", servicename: "Management", id: "txt_title" + rownumber, boxId: "txt_code" + rownumber, container: container, minlength: 2, autofocus: false, limit: 20, fname: AccountOnSelect });

                        //                        $con.find("input[name=txt_deptor" + rownumber + "]").val(response.orderDetailes[i].IsDept == true ? response.orderDetailes[i].Amount : "");
                        //                        $con.find("input[name=txt_creditor" + rownumber + "]").val(response.orderDetailes[i].IsDept != true ? response.orderDetailes[i].Amount : "");
                        //                        $con.find("input[name=txt_description" + (rownumber + 1) + "]").val(response.orderDetailes[i].Description);
                        //                        $con.find("input[name=txt_code" + rownumber + "]").parents("td").append('<input value="' + response.orderDetailes[i].AccountDetailId + '" type="hidden" name="hi_OrderDetailAcc' + rownumber + '" id="' + rownumber + '"/>');
                        //                        rownumber = rownumber + 2;
                    }

                    if (SavedNewAccountings && ((+rownumber / 2) - 1) < 5) {
                        var diff = (5 - ((+rownumber / 2) - 1));
                        for (var i = 0; i < diff; i++) {
                            AddRowTblAccounting(container);
                        }
                    }

                }
                else {
                    alert("please enter orderdetailId or Invoicenumber ");
                }

            }
        });

    }


    function loadAddBank(container, first) {

        var $con = $("#" + container);
        if (first) {
            sortid = "ac_OrderHeader.OrderHeaderId desc";
            $con.find("[id=AddBank]").button({ icons: {
                primary: "ui-icon-disk"
            }
            }).unbind('click').click(function () {
                AddBankAccount(container);
                getBankList(container, { container: container, callbackmethod: getCounterList, fname: "", page_index: 0,
                    build: buildBankList, servicename: "Management", methodname: "GetBankList", print: false
                });
            });

            $con.find("[id=UpdateBank]").button({ icons: {
                primary: "ui-icon-disk"
            }
            }).unbind('click').click(function () {
                UpdateBankAccount(container);

            });

            getBankList(container, { container: container, callbackmethod: getBankList, fname: "", page_index: 0,
                build: buildBankList, servicename: "Management", methodname: "GetBankList", print: false
            });
        }

    }

    function AddBankAccount(container) {
        var $con = $("#" + container);
        var DTO = { 'name': $con.find("#BankName").val() };
        $.ajax({
            url: "Management/AddBankAccount",
            data: JSON.stringify(DTO),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response.isdone) {
                    alert(response.msg);
                }
                else {
                    alert("please enter Bank name ");
                }

            }
        });

    }

    function UpdateBankAccount(container) {
        var $con = $("#" + container);
        var DTO = { 'name': $con.find("#BankName").val(), 'AccId': $con.find("#hi_SelectedBankAccId").val() };
        $.ajax({
            url: "Management/UpdateBankAccount",
            data: JSON.stringify(DTO),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response.isDone) {
                    alert(response.msg);
                    getBankList(container, { container: container, callbackmethod: getBankList, fname: "", page_index: 0,
                        build: buildBankList, servicename: "Management", methodname: "GetBankList", print: false
                    });
                }
                else {
                    alert("please enter Bank name ");
                }

            }
        });

    }

    function getBankList(container, params) {
        var $con = $("#" + container);
        //    params["DTO"] = DTO;
        pageselectCallback(0, params, { container: "", noPaging: true, fname: params.fname, pagingContainer: container,
            first: true, isOrder: false
        });
    }

    function buildBankList(jq, container) {
        var $con = $("#" + container.pagingContainer);
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "code", width: "46%" });
        lsth.push({ title: "bankName", width: "50%" });
        if (!container.params.print) {
            lsth.push({ title: "deleteKey", width: "4%" });
        }
        var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
        var ItemList = "";
        if (List != null)
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                var trBody = {};
                if (!container.params.print)
                    trBody[0] = { trId: val.AccountId };
                trBody[1] = { props: { name: "name", width: "46%", code: val.Code }, html: val.Code };
                trBody[2] = { props: { id: val.AccountId, name: "BankName", width: "50%" }, html: val.Name };
                lstb.push(trBody);
            }
        table = { header: lsth, body: lstb, details: { deleteFunction: RemoveBankElement, rowClick: clickBank }, heigth: 300,
            container: container.pagingContainer, divName: "BankList"
        };
        buildTable(table);
    }

    function RemoveBankElement(AccountId, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: "Management/DeleteBank",
            contentType: "application/json; charset=utf-8",
            data: "{accountId: '" + AccountId + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
                if (response.isDone)
                    getCounterList(container, { container: container, callbackmethod: GetBankList, fname: "", page_index: 0,
                        build: buildBankList, servicename: "Management", methodname: "getBankList", print: false
                    });

            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function clickBank($dis, container) {
        var $con = $("#" + container);
        var b = $dis.closest('tr').attr('id');
        var AccountId = b.substring(2, b.length);
        $con.find("#BankName").val($dis.find("#" + AccountId).html());

        $con.find("#hi_SelectedBankAccId").val(AccountId);
        onRowClick($dis);
    }





    function loadRecievedDocument(container, first) {
        var $con = $("#" + container);
        sortid = "DueDate desc";
        if (first) {



            $con.find("#ddl_Currency").html($("#userDefault").find("#ddl_m_Currency").html()).find('option:eq(1)').prop('selected', 'selected');
            $con.find("#txt_checkDate").datepicker().datepicker('setDate', new Date()).datepicker();

            if ($con.find("select[id*=ddl_m_Bank_]").length > 1)
                $con.find("#ddl_Banks").html($con.find("select[id*=ddl_m_Bank_]").first().html()).val("");

            else
                bindItemsForSelectCombo({ methodname: "GetComboItems", servicename: "XmlDropDown", headertext: "انتخاب بانک", id: "ddl_Banks", container: container }, { path: 'Counter/BankTitle' });


            bindItemsForSelectCombo({ data: { ParentName: "bankReceivedDocument" }, methodname: "GetAccountNameWithParentId", servicename: "Management", headertext: "انتخاب حساب دریافتنی", id: "ddl_recievableAccount", container: container });

            aComplete({ methodname: "GetCompletionPersonCurrentAccount", servicename: "Management", id: "txt_currentAccountPerson", boxId: "lb_currentAccPersonCode",
                container: container, minlength: 2, autofocus: false, limit: 20, fname: currAccPersonOnSelect
            });





            $con.find("#btn_Add_Payment").off().on('click', function () {
            }).button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            });


            $con.find("[id=btn_currentcheque]").button({ icons: {

        }
            }).unbind('click').click(function () {
                if ($con.find("#dialogCurrStatus").length > 0) {
                    $con.find("#dialogCurrStatus").attr("id", "dialogCurrStatus" + container);
                }

                var $dialog = $("#dialogCurrStatus" + container);
                $dialog.dialog(open).dialog({ width: 500 });

                bindItemsForSelectCombo({ data: { ParentName: "bankReceivedDocument" }, methodname: "GetAccountNameWithParentId", servicename: "Management", headertext: "انتخاب حساب دریافتنی", id: "ddl_accontRecievedBank", container: "dialogCurrStatus" + container });
                //                bindItemsForSelectCombo({ data: { ParentName: "bankReceivedDocument" }, methodname: "GetChildAccountNameWithParent", servicename: "Management", headertext: "انتخاب حساب دریافتنی", id: "ddl_accontRecievedBank", container: "dialogCurrStatus" + container });

            });

            //dialogpassStatusui-tabs-18
            $con.find("[id=btn_passedcheque]").button({ icons: {

        }
            }).unbind('click').click(function () {
                if ($con.find("#dialogpassStatus").length > 0) {
                    $con.find("#dialogpassStatus").attr("id", "dialogpassStatus" + container);
                }
                var containerid = "dialogpassStatus" + container;
                var $dialog = $("#" + containerid);
                $dialog.dialog(open).dialog({ width: 500 });
                var $conDialog = $("#dialogpassStatus" + container);

                bindItemsForSelectCombo({ data: { ParentName: "currentAccount" }, methodname: "GetchildAccountNameWithParentName", servicename: "Management", headertext: "انتخاب حساب دریافتنی", id: "ddl_RecievableAccPass", container: containerid });



            });
            $con.find("[id=btn_returncheque]").button({ icons: {

        }
            }).unbind('click').click(function () {
                if ($con.find("#dialogReturnStatus").length > 0) {
                    $con.find("#dialogReturnStatus").attr("id", "dialogReturnStatus" + container);
                }
                var $dialog = $("#dialogReturnStatus" + container);
                $dialog.dialog(open).dialog({ width: 500 });
            });

            $con.find("[id=btn_givecheque]").button({ icons: {

        }
            }).unbind('click').click(function () {
                if ($con.find("#dialogGiveStatus").length > 0) {
                    $con.find("#dialogGiveStatus").attr("id", "dialogGiveStatus" + container);
                }
                var $dialog = $("#dialogGiveStatus" + container);
                $dialog.dialog(open).dialog({ width: 500 });

                aComplete({ methodname: "GetCompletionPersonCurrentAccount", servicename: "Management", id: "txt_curAccountPersonRec", boxId: "lb_curAccountPersonRec",
                    container: "dialogGiveStatus" + container, minlength: 2, autofocus: false, limit: 20, fname: curAccPersonRecieveOnSelect
                });


            });
            $con.find("[id=btn_saveRetStatus]").button({ icons: {

        }
            }).unbind('click').click(function () {
                changeChequeStatus("return", container);
            });

            $con.find("[id=btn_savecurrStatus]").button({ icons: {

        }
            }).unbind('click').click(function () {
                changeChequeStatus("current", container);
            });

            $con.find("[id=btn_savePassStatus]").button({ icons: {
            //                primary: "ui-icon-search"
        }
            }).unbind('click').click(function () {
                changeChequeStatus("pass", container);
            });

            $con.find("[id=btn_saveGiveStatus]").button({ icons: {
            //                primary: "ui-icon-search"
        }
            }).unbind('click').click(function () {
                changeChequeStatus("give", container);
            });



            $con.find('#frm_RecievedCheck').ajaxForm({
                // target: '#fileInput',
                data: { ShopId: $("#userDefault").find("#ddl_s_Branch").val(), CounterId: $("#userDefault").find("#ddl_m_Counter").val(), isper: isper },
                success: function (response) {
                    getchequeList(container, { container: container, callbackmethod: getchequeList, fname: "", page_index: 0,
                        build: buildchequeList, servicename: "Management", methodname: "GetRecievedcheque", print: false
                    });
                },
                complete: function (xhr) {

                }
            });

        }

        getchequeList(container, { container: container, callbackmethod: getchequeList, fname: "", page_index: 0,
            build: buildchequeList, servicename: "Management", methodname: "GetRecievedcheque", print: false
        });



    }

    function changeChequeStatus(type, container) {
        var $conPage = $("#" + container);

        var accountDetailId = $conPage.find("#hi_SelectedchequeAccDetailId").val();
        if (type == "current") {
            var $con = $("#dialogCurrStatus" + container);
            var DTO = { 'type': type, 'accdetailId': accountDetailId, 'recievableAcc': $con.find("#ddl_accontRecievedBank").val()
        , 'personCode': null, 'description': $con.find("#txt_commentChangeStatus").val()
            };
        }
        if (type == "pass") {
            var $con = $("#dialogpassStatus" + container);
            var DTO = { 'type': type, 'accdetailId': accountDetailId, 'recievableAcc': $con.find("#ddl_RecievableAccPass").val(),
                'personCode': null, 'description': $con.find("#txt_commentChangeStatusPass").val()
            };
        }
        if (type == "give") {
            var $con = $("#dialogGiveStatus" + container);
            var DTO = { 'type': type, 'accdetailId': accountDetailId, 'recievableAcc': null,
                'personCode': $con.find("#txt_curAccountPersonRec").val(), 'description': $con.find("#txt_commentChangeStatusGive").val()
            };
        }

        if (type == "return") {
            var $con = $("#dialogReturnStatus" + container);
            var DTO = { 'type': type, 'accdetailId': accountDetailId, 'recievableAcc': null,
                'personCode': null, 'description': $con.find("#txt_commentChangeStatusRet").val()
            };
        }

        $.ajax({
            type: "POST",
            url: "Management/ChangeChequeStatus",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
                if (response.isdone)
                    getchequeList(container, { container: container, callbackmethod: getchequeList, fname: "", page_index: 0,
                        build: buildchequeList, servicename: "Management", methodname: "GetRecievedcheque", print: false
                    });

            },
            error: function (response) { alert(response.responseText); }
        });

    }

    function getchequeList(container, params) {
        var $con = $("#" + container);
        var DTO = [];
        DTO = { 'sort': sortid, 'ShopId': $("#userDefault").find("#ddl_s_Branch").val(), 'CounterId': $("#userDefault").find("#ddl_m_Counter").val() };
        params['DTO'] = DTO;
        pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
            first: true, isOrder: true
        });
    }

    function buildchequeList(jq, container) {
        var $con = $("#" + container.pagingContainer);
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "dueDate", sort: "", width: "8%" });
        lsth.push({ title: "chequeSerial", sort: "Serial", width: "10%" });
        lsth.push({ title: "payerAccount", sort: "ac_AccountDetail.ac_Account.Name", width: "20%" });
        lsth.push({ title: "description", sort: "ac_AccountDetail.Description", width: "40%" });
        lsth.push({ title: "amount", sort: "ac_AccountDetail.Amount", width: "10%" });
        lsth.push({ title: "status", sort: "Status", width: "8%" });

        if (!container.params.print) {
            lsth.push({ title: "deleteKey", width: "4%" });
        }
        var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
        var ItemList = "";
        if (List != null)
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                var trBody = {};
                if (!container.params.print)
                    trBody[0] = { trId: val.AccountDetailId };
                trBody[1] = { props: { date: val.DueDate, name: "date", width: "8%", klass: "date" }, html: val.DueDate };
                trBody[2] = { name: "Serial", html: val.Serial, width: "10%" };
                trBody[3] = { name: "reciever", html: val.issuer, width: "20%" };
                trBody[4] = { name: "Description", html: val.reciever + "" + val.Description, width: "40%" };
                trBody[5] = { name: "amount", html: val.amount, width: "10%" };
                var st = "";
                if (val.Status == 1)
                    st = "دریافتنی";
                if (val.Status == 2)
                    st = "در جریان";
                if (val.Status == 3)
                    st = "وصولی";
                if (val.Status == 4)
                    st = "واگذارده";
                if (val.Status == 5)
                    st = "برگشتی";
                trBody[6] = { name: "Status", html: st, width: "8%" };
                lstb.push(trBody);
            }
        table = { header: lsth, body: lstb, details: { deleteFunction: RemoveCheque, rowClick: clickcheque }, heigth: 300,
            container: container.pagingContainer, divName: "chequeList"
        };
        buildTable(table);
    }


    function RemoveCheque(AccountDetailId, container) {
        var $con = $("#" + container);
        var DTO = { 'accDetailId': AccountDetailId, 'isRecieved': true };
        $.ajax({
            type: "POST",
            url: "Management/DeleteCheque",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
                if (response.isdone)
                    getchequeList(container, { container: container, callbackmethod: getchequeList, fname: "", page_index: 0,
                        build: buildchequeList, servicename: "Management", methodname: "GetRecievedcheque", print: false
                    });

            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function clickcheque($dis, container) {

        var $table = $dis.parents('tbody');

        $("#" + container).find("#chequeList  table  tr").removeClass("ui-state-error");
        $dis.addClass("ui-state-error");

        var $con = $("#" + container);
        var b = $dis.closest('tr').attr('id');
        var AccountId = b.substring(2, b.length);

        $con.find("#hi_SelectedchequeAccDetailId").val(AccountId);
        onRowClick($dis);
    }

    function currAccPersonOnSelect(event, ui, container, id) {
        var $con = $("#" + container);
        //        var txtid = id.replace("txt_title", "txt_code");
        $con.find("#lb_currentAccPersonName").html(ui.item.label);
        $con.find("#txt_currentAccountPerson").val(ui.item.value);
        $con.find("#hi_currentAccPeraccId").val(ui.item.id);
    }

    function curAccPersonRecieveOnSelect(event, ui, container, id) {
        var $con = $("#" + container);
        //        var txtid = id.replace("txt_title", "txt_code");
        $con.find("#lb_curAccountPersonRec").html(ui.item.label);
        $con.find("#txt_curAccountPersonRec").val(ui.item.value);
        $con.find("#hi_curAccPeraccIdRec").val(ui.item.id);
    }

    function currAccountRecivable(event, ui, container, id) {
        var $con = $("#" + container);
        $con.find("#lb_recievableAccountName").html(ui.item.label);
        $con.find("#txt_recievableAccount").val(ui.item.value);
    }

    function loadPaidDocument(container, first) {
        var $con = $("#" + container);
        if (first) {

            sortid = "DueDate desc";

            $con.find("#txt_checkDate").datepicker().datepicker('setDate', new Date()).datepicker();

            bindItemsForSelectCombo({ data: { ParentName: "bankPaidDocument" }, methodname: "GetChildAccountNameWithParent", servicename: "Management", headertext: "انتخاب حساب پرداختنی", id: "ddl_accountPaidBanks", container: container });



            $con.find("[id=btn_addRow]").unbind('click').click(function () {
                AddRowTblPaidDocument(container);
            });

            //ezafe kardane 3 satr default
            for (var i = 0; i < 3; i++) {
                AddRowTblPaidDocument(container);
            }

            getPaidchequeList(container, { container: container, callbackmethod: getPaidchequeList, fname: "", page_index: 0,
                build: buildPaidchequeList, servicename: "Management", methodname: "GetPaidcheque", print: false
            });


            $con.find("#btn_Add_Payment").off().on('click', function () {
            }).button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            });



            $con.find('#frm_PaidCheck').ajaxForm({
                // target: '#fileInput',
                data: { ShopId: $("#userDefault").find("#ddl_s_Branch").val(), CounterId: $("#userDefault").find("#ddl_m_Counter").val(), currencyId: $("#userDefault").find("#ddl_m_Currency").val(),
                    countRow: $con.find('#chequePaidList').children().length, isper: isper
                },
                success: function (response) {
                    $("#hi_SelectedchequeAccDetailId").val("0");
                    getPaidchequeList(container, { container: container, callbackmethod: getPaidchequeList, fname: "", page_index: 0,
                        build: buildPaidchequeList, servicename: "Management", methodname: "GetPaidcheque", print: false
                    });
                },
                complete: function (xhr) {

                }
            });

        }

    }

    function AddRowTblPaidDocument(container, accdetail) {


        var $con = $("#" + container);
        var rowCount = $con.find('#chequePaidList').children().length;
        var trid = rowCount;
        var ItemList = "<tr id='" + (trid) + "' > <td width='3%'>" +
                 " <label id='lb'></label>" +
                 "<input type='hidden' id='hi_AccDetailId' name='hi_AccDetailId' />" +
        "</td>" +

                "<td width='6%'>" +
                    "<input type='text' id='PersonAccCode' name='PersonAccCode' placeholder='accountCode' class=' inputText inputW136'/>" +
                "</td>" +
                 "<td width='6%'>" +
                    "<input type='text' id='txt_PersonAcc' name='txt_PersonAcc' placeholder='account' class=' inputText inputW136 validate'/>" +
                "</td>" +
                "<td width='40%'>" +
                   " <input type='text'  name='txt_comment' id='txt_comment' placeholder='description' style='width: 100%'/>" +
                "</td>" +
                "<td width='3%'>" +
                   " <input type='text' name='txt_amount' placeholder='amount' class=' inputW80 digit'/>" +
                "</td>" +
               " <td width='3%'>" +
               "<select class='selectMedium' name='ddl_Currency'>" +
                       " </select>" +
        "</td>" +
                "<td width='3%'>" +
                     " <span title='حذف' id='delete' name='delete' class='cursor ui-icon ui-icon-closethick'></span>" +
                "</td> </tr>";

        $("#lb_" + trid).text(rowCount);
        $con.find("#chequePaidList").append(ItemList).parent().tableScroll({ height: 300, width: contentwidth, flush: false });
        PaidDocumentControlesID(container, accdetail);
        $con.find("[id=delete]").unbind().click(function () {
            if (confirm("آیا از حذف مطمئن هستید؟")) {

                var id = $(this).parents("tr").first().prop("id");
                $("#" + id).remove();
                PaidDocumentControlesID(container, accdetail);
            }
            else
                return;
        });
        localize();
    }

    function PaidDocumentControlesID(container, val) {
        var $con = $("#" + container);
        var rownumber = 1;
        var row = 1;
        $.each($("#" + container).find("#chequePaidList tr"), function () {
            $(this).attr('id', rownumber);

            $(this).find("[id*=hi_AccDetailId]").attr('name', "hi_AccDetailId" + rownumber);
            $(this).find("[id*=hi_AccDetailId]").attr('id', "hi_AccDetailId" + rownumber);


            $(this).find("[id*=PersonAccCode]").attr('name', "PersonAccCode" + rownumber);
            $(this).find("[id*=PersonAccCode]").attr('id', "PersonAccCode" + rownumber);

            $(this).find("input[name*=txt_PersonAcc]").attr('name', "txt_PersonAcc" + rownumber);
            $(this).find("input[name*=txt_PersonAcc]").attr('id', "txt_PersonAcc" + rownumber);



            $(this).find("input[name*=txt_comment]").attr('name', "txt_comment" + rownumber);
            $(this).find("input[name*=txt_comment]").attr('id', "txt_comment" + rownumber);

            $(this).find("[id*=lb]").attr('name', "lb_" + rownumber);
            $(this).find("[id*=lb]").attr('id', "lb_" + rownumber);
            if ($(this).find("[id*=lb]").length > 0) {
                $("#lb_" + rownumber).text(row);
                row++;
            }

            aComplete({ methodname: "GetCompletionPersonCurrentAccount", servicename: "Management", id: ("txt_PersonAcc" + rownumber), boxId: ("PersonAccCode" + rownumber),
                container: container, minlength: 2, autofocus: false, limit: 20, fname: currPaidAccOnSelect
            });

            $(this).find("input[name*=txt_amount]").attr('name', "txt_amount" + rownumber);
            $(this).find("input[name*=txt_amount]").attr('id', "txt_amount" + rownumber);
            var ddlcurrencyname = "ddl_Currency" + rownumber;
            $(this).find("[name*=ddl_Currency]").attr('name', ddlcurrencyname);
            $(this).find("[name=" + ddlcurrencyname + "]").html($("#userDefault").find("#ddl_m_Currency").html()).find('option:eq(1)').prop('selected', 'selected');

            if (val != null && val != "undefined") {
                $(this).find("#" + "PersonAccCode" + rownumber).val(val.Code);
                $(this).find("#" + "txt_PersonAcc" + rownumber).val(val.Name);
                $(this).find("#" + "txt_comment" + rownumber).val(val.Description);
                $(this).find("#" + "txt_amount" + rownumber).val(val.Amount);
                $(this).find("#" + "ddl_Currency" + rownumber).val(val.CurrencyRateId);
                $(this).find("#" + "hi_AccDetailId" + rownumber).val(val.AccountDetailId);
            }

            rownumber++;
        });

    }

    function currPaidAccOnSelect(event, ui, container, id) {
        var $con = $("#" + container);
        var txtid = id.replace("txt_PersonAcc", "txtPersonAccCode");
        $con.find(txtid).val(ui.item.value);
        $con.find(id).val(ui.item.label);
    }



    function getPaidchequeList(container, params) {
        var $con = $("#" + container);
        var DTO = [];
        //        sortid = "DueDate";
        DTO = { 'sort': sortid, 'ShopId': $("#userDefault").find("#ddl_s_Branch").val(), 'CounterId': $("#userDefault").find("#ddl_m_Counter").val() };
        params['DTO'] = DTO;
        pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
            first: true, isOrder: true
        });
    }

    function buildPaidchequeList(jq, container) {
        var $con = $("#" + container.pagingContainer);
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "dueDate", sort: "DueDate", width: "8%" });
        lsth.push({ title: "chequeSerial", sort: "Serial", width: "7%" });
        lsth.push({ title: "chequeReciever", sort: "ac_AccountDetail.ac_Account.Name", width: "33%" });
        lsth.push({ title: "description", sort: "ac_AccountDetail.Description", width: "30%" });
        lsth.push({ title: "amount", sort: "ac_AccountDetail.Amount", width: "10%" });
        lsth.push({ title: "status", sort: "Status", width: "8%" });

        if (!container.params.print) {
            lsth.push({ title: "deleteKey", width: "4%" });
        }
        var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
        var ItemList = "";
        if (List != null)
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                var trBody = {};
                if (!container.params.print)
                    trBody[0] = { trId: val.AccountDetailId };
                trBody[1] = { props: { date: val.DueDate, name: "date", width: "8%", klass: "date" }, html: val.DueDate };
                trBody[2] = { name: "Serial", html: val.Serial, width: "7%" };
                trBody[3] = { name: "reciever", html: val.reciever + " " + val.issuer, width: "33%" };
                trBody[4] = { name: "Description", html: val.Description, width: "30%" };
                trBody[5] = { name: "amount", html: val.amount, width: "10%" };
                var st = "";
                if (val.pass)
                    st = "پاس شده";
                else
                    st = "پاس نشده";
                trBody[6] = { name: "Status", html: st, width: "8%" };
                lstb.push(trBody);
            }
        table = { header: lsth, body: lstb, details: { deleteFunction: RemovePaidCheque, rowClick: clickPaidcheque }, heigth: 300,
            container: container.pagingContainer, divName: "chequeList"
        };
        buildTable(table);
    }

    function RemovePaidCheque(AccountDetailId, container) {
        var $con = $("#" + container);
        var DTO = { 'accDetailId': AccountDetailId, 'isRecieved': false };
        $.ajax({
            type: "POST",
            url: "Management/DeleteCheque",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
                if (response.isdone)
                    getPaidchequeList(container, { container: container, callbackmethod: getPaidchequeList, fname: "", page_index: 0,
                        build: buildPaidchequeList, servicename: "Management", methodname: "GetPaidcheque", print: false
                    });

            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function clickPaidcheque($dis, container) {

        var $table = $dis.parents('tbody');

        var $con = $("#" + container);
        var b = $dis.closest('tr').attr('id');
        var AccountDetailId = b.substring(2, b.length);

        if (!$dis.hasClass("ui-state-error")) {
            $("#" + container).find("#chequeList  table  tr").removeClass("ui-state-error");
            $dis.addClass("ui-state-error");
            $con.find("#hi_SelectedchequeAccDetailId").val(AccountDetailId);
            $con.find("#chequePaidList").html("");

            $con.find("#txt_serial").val("");
            $con.find("#txt_checkDate").val("");
            $con.find("#ddl_accountPaidBanks").val("");
            $con.find("#txt_comment").val("");


            $.ajax({
                type: "POST",
                url: "Management/GetPaidDocumentInfo",
                contentType: "application/json; charset=utf-8",
                data: "{accDetailId: '" + AccountDetailId + "'}",
                success: function (response) {
                    if (response.isdone) {
                        $con.find("#txt_serial").val(response.serial);
                        $con.find("#txt_checkDate").val(ToPersianDateDigitYearRight(response.DueDate));
                        $con.find("#ddl_accountPaidBanks").val(response.PayableAcc);
                        $con.find("#txt_comment").val(response.Description);
                        $con.find("#chk_isPassed").attr("checked", response.passed);
                        $con.find("#chequePaidList").html("");
                        for (var i = 0; i < response.accdetails.length; i++) {
                            AddRowTblPaidDocument(container, response.accdetails[i]);
                        }

                    }
                    else {
                        $con.find("#hi_SelectedchequeAccDetailId").val("0");
                        for (var i = 0; i < 3; i++) {
                            AddRowTblPaidDocument(container);
                        }
                        alert(response.msg);
                    }

                },
                error: function (response) { alert(response.responseText); }
            });
        }
        else {

            $con.find("#chequePaidList").html("");
            for (var i = 0; i < 3; i++) {
                AddRowTblPaidDocument(container);
            }
            $("#" + container).find("#chequeList  table  tr").removeClass("ui-state-error");
            $dis.removeClass("ui-state-error");
            $con.find("#hi_SelectedchequeAccDetailId").val("0");
        }

        onRowClick($dis);
    }
    //--------------------js Accounting List end-----------------------


    //--------------------js Opening account begin-----------------------

    function loadOpeningAccount(container, first) {
        var $con = $("#" + container);
        if (first) {
            GetAccount(container);
            $con.find("#btn_AddNewRow").off().on('click', function () {
                AddRowTblOpeningAccount(container, null, +($con.find("#hi_cRow").val()));
                $con.find("#hi_cRow").val(+($con.find("#hi_cRow").val()) + 1);
                var i = 1;
                $.each($("#" + container).find("#AccountingList tr .trc"), function () {
                    $(this).find("[id*=lb]").text(i);
                    i++;
                });
            })

            $con.find("#btn_TemporarySaveAccounting").off().on('click', function () {
                $con.find("#isper").val(false);
            }).button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            });


            $con.find("#btn_PermanentSaveAccounting").off().on('click', function () {
                $con.find("#isper").val(true);
            }).button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            });
        }

        $con.find('#frm_OpeningAccounting').ajaxForm({
            // target: '#fileInput',
            data: { ShopId: $("#userDefault").find("#ddl_s_Branch").val(), CurrencyRateId: $("#userDefault").find("#ddl_m_Currency").val(),
                CounterId: $("#userDefault").find("#ddl_m_Counter").val(), date: $("#userDefault").find("#txt_s_Date").val()
            },
            success: function (response) {
                //                $con.find("#txt_OrderHeaderId").val(response.orderHeaderId);
                //                DTO = {
                //                    'OrderHeaderId': $con.find("#txt_OrderHeaderId").val(),
                //                    'InvoiceNum': $con.find("#txt_InvoiceNum").val()
                //                };
                //                DisplayAccountInfo(container, DTO, "GetAccountInfoSearch2");

            },
            complete: function (xhr) {

            }
        });
    }

    function GetAccount(container) {
        var $con = $("#" + container);
        var DTO = { 'level': 3 };
        $.ajax({
            url: "Management/GetAccountwithlevel",
            data: JSON.stringify(DTO),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response.isdone) {
                    var rowCount = $con.find('#AccountingList').children().length;
                    for (var i = 0; i < response.results.length; i++) {
                        if (i < 10)

                            AddRowTblOpeningAccount(container, response.results[i], rowCount);
                        rowCount++
                    }
                    $con.find("#AccountingList").parent().tableScroll({ height: 300, width: contentwidth, flush: false });
                }
                else {
                    alert(response.msg);
                }

            }
        });
    }


    function AddRowTblOpeningAccount(container, Account, rowCount) {
        var $con = $("#" + container);
        var trid = rowCount + 1;

        var ItemList = "<tr  class='trc' id='" + (trid) + "' style='border-bottom-style: solid; border-width: 0px 0px 3px 0px; border-color: #C0C0C0'> <td width='6%'>" +
                 " <label id='lb" + trid + "'></label>" +
                 "<input type='hidden' id='hi_AccountId" + trid + "' name='hi_AccountId" + trid + "'  />" +
                 "</td>" +
                 "<td >" +
                  " <table> <tr>  <td width='5%'>" +
                   "<input type='text' id='txt_code" + trid + "' name='txt_code" + trid + "' placeholder='accountCode'/> </td>" +
                   " <td width='4%'> <input type='text' id='txt_title" + trid + "' name='txt_title" + trid + "' placeholder='account'/></td>" +
                   "  <td width='11%'><input type='text' placeholder='count' name='txt_Amount" + trid + "' id='txt_Amount" + trid + "' class='inputW70'/></td>" +
                   "  <td width='6%'><input type='text' placeholder='price' name='txt_price" + trid + "' id='txt_price" + trid + "'/></td>" +
                   " <td width='10%'><select name='ddl_Branch" + trid + "'  id='ddl_Branch" + trid + "'></select></td>" +
                   "  <td width='6%'><input type='text' placeholder='debtor' name='txt_deptor" + trid + "' id='txt_deptor" + trid + "'/></td>" +
                    " <td width='6%'><input type='text' placeholder='creditor' name='txt_creditor" + trid + "' id='txt_creditor" + trid + "'/></td>" +
                "</tr>" +
                "<tr >" +
                "<td colspan='7'>" +
                 " <span title='شرح'></span>" +
                    "<input type='text' placeholder='description'  width='100%' id='txt_description" + trid + "' name='txt_description" + trid + "'  style='width:95%'/>" +
                "</td>" +

                "</tr> </table></td>" +
                "<td width='6%'>" +
                     "  <span title='حذف' id='delete' name='delete' class='cursor ui-icon ui-icon-closethick' ></span>" +
                "</td> " +

                "</tr>";



        $con.find("#AccountingList").append(ItemList); //.parent().tableScroll({ height: 300, width: contentwidth, flush: false });
        $con.find("#hi_cRow").val(trid);

        aComplete({ methodname: "GetCompletionListByAccountName", servicename: "Management", id: "txt_title" + trid, boxId: "txt_code" + trid, container: container, minlength: 2, autofocus: false, limit: 20, fname: OpeningAccountOnSelect });

        if (Account != null) {
            $con.find("#hi_AccountId" + trid).val(Account.AccountId);
            $con.find("#txt_code" + trid).val(Account.Code);
            $con.find("#txt_title" + trid).val(Account.Name);
        }
        var name = "lb" + trid;
        $con.find("#" + name).text(trid);
        $con.find("#ddl_Branch" + trid).html($("#userDefault").find("#ddl_s_Branch").html()).val("");

        $con.find("#txt_Amount" + trid).val("0");
        $con.find("#txt_Amount" + trid).spinner({ step: 1000, change: function () {

            //            SumPrice($(this).parents("tr").attr("id"), container);

            var id = $(this)[0].id.replace("txt_Amount", "");
            var amount = $(this).val();
            var price = $con.find("#txt_price" + trid).val();
            if (amount != "" && price != "") {
                $con.find("#txt_deptor" + id).val(amount * price);
            }
            totalDebtCreditOpeningAccount(container);


        },
            stop: function () {

                var id = $(this)[0].id.replace("txt_Amount", "");
                var amount = $(this).val();
                var price = $con.find("#txt_price" + trid).val();
                if (amount != "" && price != "") {
                    $con.find("#txt_deptor" + id).val(amount * price);
                }

                totalDebtCreditOpeningAccount(container);

            }

        });

        $con.find("#txt_Amount" + trid).blur(function (e) {

            if (e.keyCode == 40) {
                $con.next().find("#txt_Amount" + trid).focus().focus(function () { this.select() });
            }
            if (e.keyCode == 38) {
                $con.prev().find("#txt_Amount" + trid).focus().focus(function () { this.select() });
            }
            var id = $(this)[0].id.replace("txt_Amount", "");
            var amount = $(this).val();
            var price = $con.find("#txt_price" + trid).val();
            if (amount != "" && price != "") {
                $con.find("#txt_deptor" + id).val(amount * price);
            }
            totalDebtCreditOpeningAccount(container);
        });

        $con.find("#txt_price" + trid).blur(function (e) {

            if (e.keyCode == 40) {
                $con.next().find("#txt_price" + trid).focus().focus(function () { this.select() });
            }
            if (e.keyCode == 38) {
                $con.prev().find("#txt_price" + trid).focus().focus(function () { this.select() });
            }
            var id = $(this)[0].id.replace("txt_price", "");
            var amount = $con.find("#txt_Amount" + trid).val();
            var price = $(this).val();
            if (amount != "" && price != "") {
                $con.find("#txt_deptor" + id).val(amount * price);
            }

            totalDebtCreditOpeningAccount(container);
        });



        $con.find("#txt_deptor" + trid).blur(function (e) {

            totalDebtCreditOpeningAccount(container);
        });


        $con.find("#txt_creditor" + trid).blur(function (e) {

            totalDebtCreditOpeningAccount(container);
        });




        $con.find("[id=delete]").unbind().click(function () {
            if (confirm("آیا از حذف مطمئن هستید؟")) {

                var id = $(this).parents("tr").first().prop("id");
                $("#" + id).remove();
                var i = 1;
                $.each($("#" + container).find("#AccountingList tr"), function () {
                    if ($(this).find("[id*=lb]").length > 0) {
                        $(this).find("[id*=lb]").text(i);
                        i++;
                    }
                });
                totalDebtCreditOpeningAccount(container);
            }
            else
                return;
        });


        localize();
    }
    function OpeningAccountOnSelect(event, ui, container, id) {
        var $con = $("#" + container);
        var txtid = id.replace("txt_title", "txt_code");
        $con.find(txtid).val(ui.item.value);
        $con.find(id).val(ui.item.label);
    }

    function totalDebtCreditOpeningAccount(container) {
        var $con = $("#" + container)
        var totalDebt = 0;
        var totalCredit = 0;
        var c = $con.find("#hi_cRow").val();
        for (var i = 0; i <= c; i++) {
            if ($con.find("[name=txt_deptor" + i + "]").length > 0) {
                totalDebt += +($con.find("[name=txt_deptor" + i + "]").val());
            }
            if ($con.find("[name=txt_creditor" + i + "]").length > 0) {
                totalCredit += +($con.find("[name=txt_creditor" + i + "]").val());
            }
        }
        $con.find("#spCreditor").html(totalCredit);
        $con.find("#spDeptor").html(totalDebt);

    }


    //--------------------js Opening account end-----------------------


    //--------------------js TransferProductList begin-----------------------



    function loadTransferProductList(container, first) {
        sortid = "TransferItemId desc";
        if (first) {
            var $con = $("#" + container);
            $con.find("#btnSearchTransferProducts").off().on('click', function () {
                getTransferProductsList(container, { container: container, callbackmethod: getTransferProductsList, fname: "", page_index: 0,
                    build: buildTransferProductsList, servicename: "Transfer", methodname: "GetTransferProductsList", print: false
                });
            }).button({ icons: {
                primary: "ui-icon-search"
            }
            });
            getTransferProductsList(container, { container: container, callbackmethod: getTransferProductsList, fname: "", page_index: 0,
                build: buildTransferProductsList, servicename: "Management", methodname: "GetTransferProductsList", print: false
            });
            //            $con.find("#div_dialog_TransferProducts").dialog({ autoOpen: false }).dialog({ width: 750 });
            $con.find("#div_dialog_TransferProducts").attr("id", "div_dialog_TransferProducts" + container).dialog({ autoOpen: false }).dialog({ width: 750 });
        }
    }

    function getTransferProductsList(container, params) {
        var $con = $("#" + container);
        var first = true;
        var take = $con.find("#PageSize").val();
        var skip = 0;
        var page_index = 0
        var barcode = "", name = "", code = "", price = "";
        var search = $con.find("#ddl_d_SearchBy").val();
        if (search == "Barcode") {

            barcode = $con.find("#txt_s_TransferProducts").val();
        } if (search == "Name") {

            name = $con.find("#txt_s_TransferProducts").val();
        } if (search == "Code") {

            code = $con.find("#txt_s_TransferProducts").val();
        } if (search == "Price") {

            price = $con.find("#txt_s_TransferProducts").val();
        }

        var DTO = {
            'skip': skip,
            'take': take,
            'currentPage': page_index,
            'first': first,
            'sort': sortid,
            'barcode': barcode,
            'name': name,
            'code': code,
            'price': price,
            'quantityfrom': "",
            'quantityto': "",
            'regdatefrom': "",
            'regdateto': "",
            'shopid': $("#userDefault").find("#ddl_s_Branch").val()
        };
        params["DTO"] = DTO;

        params.servicename = "Management";

        pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
            first: true, isOrder: false
        });
    }

    function buildTransferProductsList(jq, container) {
        var $con = $("#" + container.pagingContainer);
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "date", sort: "Date", width: "20%" });
        lsth.push({ title: "fromBranch", sort: "inv_Shop.ShopId", width: "20%" });
        lsth.push({ title: "toBranch", sort: "inv_Shop1.ShopId", width: "20%" });
        lsth.push({ title: "senderName", sort: "p_Person.AccountId", width: "20%" });
        lsth.push({ title: "recieverName", sort: "p_Person1.AccountId", footer: jq.sumDebtor, width: "16%" });
        if (!container.params.print) {
            lsth.push({ title: "details", width: "4%" });
        }
        var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
        var ItemList = "";
        if (List != null)
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                var trBody = {};
                if (!container.params.print)
                    trBody[0] = { trId: val.TransferItemId, trName: val.detail };
                trBody[1] = { props: { date: val.Date, name: "date", width: "20%", klass: "dateLong" }, html: val.Date };
                trBody[2] = { name: "fromBranch", html: val.ShopFromName, width: "20%" };
                trBody[3] = { name: "toBranch", html: val.ShopToName, width: "20%" };
                trBody[4] = { name: "senderName", html: (val.sendername + "  " + val.senderfamily), width: "20%" };
                trBody[5] = { name: "recieverName", html: ((val.receivername != null && val.receiverfamily != null) ? (val.receivername + " " + val.receiverfamily) : "<button id='btnConfirm'>تایید</button>"), width: "16%" };

                lstb.push(trBody);
            }

        table = { header: lsth, body: lstb, details: { detailsFunction: SelectDetailTransferProducts, confirmFunction: ConfirmTransferProducts }, heigth: 300,
            container: container.pagingContainer, divName: "TransferProductsList"
        };
        buildTable(table);

    }

    function ClickTransferProducts($dis) {

    }

    function SelectDetailTransferProducts(dis, container) {
        var $con = $("#div_dialog_TransferProducts" + container);
        id = $(dis).parents("tr").prop("id").replace("tr", "");
        $.ajax({

            url: "Management/GetDetailTransferProducts",
            data: "{id: '" + id + "'}",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                jq = response;
                var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
                var ItemList = "";
                for (var i = 0; i < List.length; i++) {
                    var val = List[0, i];
                    ItemList += "<tr id='tr" + val.ItemDetailId + "'>" +
                "<td width='30%' name='name'>" + val.Barcode + "_" + val.Name + "_" + val.ItemCode + "</td>" +
                "<td width='15%' name='Size'>" + val.Size + "</td>" +
                "<td width='15%' name='Color'>" + val.Color + "</td>" +
                "<td width='20%' name='Quantity'>" + val.Quantity + "  " + val.UnitType + "</td>" +
                "<td name='" + val.TransferItemId + "' width='20%' id='delete'><button id='a_Button'>حذف</button></td></tr>";
                    //<div class='modalClose modalRemove'><a href='javascript:(" + val.ItemDetailId + ", " + val.TransferItemId + ",\"" + container + "\");'/></div>
                }

                $con.find("#DetailListTransferProducts").html(ItemList).parent().tableScroll({ height: 380, width: 700, flush: false });
                $con.find("[id=a_Button]").button({
                    icons: {
                        primary: "ui-icon-closethick"
                    },
                    text: false
                }).click(function () {
                    if (confirm("آیا از حذف مطمئن هستید؟"))
                        RemoveItemDetailTransferProducts($(this).parents("tr").attr("id").replace("tr", ""),
                                                 $(this).parents("td").attr("name"), container);
                    else
                        return;
                });

                $con.find("#btn_PrintBarcode").button({
                    icons: {
                        primary: "ui-icon-print"
                    },
                    text: true
                }).click(function () {
                    buildPrintBarcode({ result: jq, container: container, hasQuantity: true });
                });

                $con.find("tr[id*=tr]").dblclick(function () {
                    //ClickPhone(this, id, container);
                });
                $con.dialog('open');
            },

            error: function (response) { alert(response.responseText); }
        });
    }



    function RemoveItemDetailTransferProducts(ItemDetailId, TransferId, container) {
        var $con = $("#div_dialog_TransferProducts" + container);
        $.ajax({

            url: "Management/DeleteDetailTransferProducts",
            data: "{id: '" + ItemDetailId + "',TransferId:'" + TransferId + "'}",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isDone)
                    $con.find("#tr" + ItemDetailId).remove();
                translate(response.msg);
            },

            error: function (response) { alert(response.responseText); }
        });
    }

    function ConfirmTransferProducts(dis, container) {
        var $con = $("#" + container);
        $.ajax({

            url: "Management/ConfirmTransferProducts",
            data: "{id: '" + $(dis).parent().parent().prop('id').replace("tr", "") + "'}",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response);
                getTransferProductsList(container, { container: container, callbackmethod: getTransferProductsList, fname: "", page_index: 0,
                    build: buildTransferProductsList, servicename: "Transfer", methodname: "GetTransferProductsList", print: false
                });
            },
            error: function (response) { alert(response.responseText); }
        });
    }
    //--------------------js TransferProductList end-----------------------


    //--------------------js TransferProducts begin-----------------------

    function loadTransferProducts(container, first) {
        sortid = "BarcodeId desc";
        if (first) {
            var $con = $("#" + container);
            $con.find("#dialog").attr("id", "dialog" + container);
            bindItemsForSelectCombo({ methodname: "getAvailablity", servicename: "Management", id: "ddl_m_Availability", container: container, headertext: "وضعیت کالا", selectedindex: 1 });

            $con.find("#txt_s_ProductCode,#txt_s_ProductBarcode").bind('keydown', function (e) {
                if (e.keyCode == 13 || e.keyCode == 9) {
                    getBarcodeListOrder(container, { container: "dialog", callbackmethod: getBarcodeListOrder, fname: GetItemTransferProducts, page_index: 0, build: buildBarcodeListOrder, servicename: "Inventory", methodname: "GetItemsList" });
                }
            });
            // aComplete("txt_s_ProductCode", container);
            // aComplete({ methodname: "GetCompletionListByItemName", servicename: "AtuoComplete", id: "txt_s_ProductCode", container: container, minlength: 2, autofocus: true, limit: 10 }, { Status: "ddl_m_Availability" });
            aComplete({ methodname: "GetCompletionListByItemName", servicename: "AtuoComplete", id: "txt_s_ProductCode", container: container, minlength: 2, autofocus: false, limit: 10, boxId: "txt_s_ProductCode" }, { Status: "ddl_m_Availability" });
            $con.find("#btn_AddTransferProducts").button({ icons: {
                primary: "ui-icon-transferthick-e-w"
            }
            });
            bindItemsForSelectCombo({ methodname: "getShopName", servicename: "Management", id: "ddl_m_Branch", container: container, headertext: "انتخاب شعبه " });
            $con.find("#DialogBarcode").dialog({ autoOpen: false }).dialog({ width: 750 })
            $con.find("#dialog_ItemQuantity").dialog({ autoOpen: false })
            //  DataBindForHierarchy("hr_s_Category", "0", "Category", "0", 20, container);
            bindHierarchyData({ id: "hr_s_Category", container: container, styleclass: "PagingSelect selectMedium", table: "category" });
            $con.find("#btn_SearchProduct").button({ icons: {
                primary: "ui-icon-search"
            }
            }).off().on('click', function () {
                getBarcodeListOrder(container, { container: "dialog", callbackmethod: getBarcodeListOrder, fname: GetItemTransferProducts, page_index: 0, build: buildBarcodeListOrder, servicename: "Management", methodname: "GetItemsList" });
                //   getBarcodeListOrder(container, GetItemTransferProducts);
            }).button();

            $con.find("#btn_AddTransferProducts").off().on('click', function () {
                if (validateAll($con.find("#div_ToCounter")) && $con.find("#OrderList").html() != "")
                    AddTransferProducts(container);
            }).button({ icons: {
                primary: "ui-icon-transferthick-e-w"
            },
                text: true
            });
            $con.find("#OrderList").parent().tableScroll({ height: 380, width: contentwidth, flush: false });
        }
    }

    function AddTransferProducts(container) {
        var $con = $("#" + container);
        var orderdetails = [];
        var orderheader = {};
        $.each($("#" + container).find("tr[id*=tr]"), function () {
            var orderdetail = {};
            orderdetail["barcodeid"] = this.id.split("_")[2];

            var orderDetailArray = [];
            $(this).find("input[name=quantity]").each(function () {
                if (this.value != "") {
                    var ItemDetail = {};
                    var OrderItemDetail = {};
                    ItemDetail = (this.id).split("-");
                    OrderItemDetail["ColorID"] = ItemDetail[0];
                    OrderItemDetail["SizeID"] = ItemDetail[1];
                    OrderItemDetail["Quantity"] = this.value;
                    orderDetailArray.push(OrderItemDetail);
                }
            });
            orderdetail["itemDetails"] = orderDetailArray
            orderdetails.push(orderdetail);
        })
        orderheader["shopidTo"] = $con.find("#ddl_m_Branch").val();
        orderheader["date"] = $("#userDefault").find("#txt_s_Date").val();
        orderheader["shopidFrom"] = $("#userDefault").find("#ddl_s_Branch").val();
        orderheader["description"] = $con.find("#txt_m_Description").val();

        var DTO = { 'header': orderheader, 'itemDetails': orderdetails };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: ("Management/AddTransferProducts"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function GetItemTransferProducts($dis, container, barcode) {
        var $con = $("#" + container);
        if (barcode == undefined) {
            //first tr of $dis
            var b = $dis.closest('tr').attr('id');
            barcode = b.substring(2, b.length);
        }

        var ItemList = "";
        var DTO = { 'barcode': barcode, 'shopId': $("#userDefault").find("#ddl_s_Branch").val(), 'isReturn': false };
        $.ajax({

            url: "Management/GetProductForOrderByBarcode",
            data: JSON.stringify(DTO),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                $con.find("#txt_s_ProductBarcode").val("");
                var count = $con.find("tr[id*='tr_" + container + "']").length;
                var List = (typeof response) == 'string' ? eval('(' + response + ')') : response;
                var ItemList = "";
                for (var i = 0; i < List.length; i++) {

                    var val = List[0, i];
                    var trid = "tr_" + container + "_" + val.barcodeid + "_" + count;
                    ItemList += "<tr id='" + trid + "'>" +
                "<td width='20%'><a href='javascript:showQuantity(\"" + container + "\",\"" + val.barcode + "\");'>" + val.name + " " + val.code + " " + val.barcode + "</a></td>" +
                 "<td width='10%' id='mesureunit'>" +
                  " <select   id='ddl_m_measureunit_" + trid + "' disabled='disabled' class='select95'></select>" +
                "</td>" +
                "<td width='10%'><input type='text'  class=' inputText inputW50 ' id='txt_m_TotalQuantity'  disabled='disabled' value='0'/></td>" +
                "<td width='50%' id='Div_Product_Quantity_" + trid + "' dir='rtl'></td>" +
                "<td width='10%' id='delete'><button id='btn_deleteProduct'>حذف</button></td></tr>";
                }

                $con.find("#OrderList").append(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
                //$con.find("#OrderList").parent().tableScroll({ height: 380 });
                //   TableAlter(container);
                $con.find("[id=btn_deleteProduct]").button({
                    icons: {
                        primary: "ui-icon-closethick"
                    },
                    text: false
                }).unbind().bind('click', function () {
                    if (confirm("آیا از حذف مطمئن هستید؟"))
                        RemoveItemOrderElementTransferProducts($(this).parents("tr").attr("id"), container);
                    else
                        return;
                });
                buildColorSizeTable(barcode, $("#userDefault").find("#ddl_s_Branch").val(), false, "GetItemDetailsByBarcodeAndShopIDNoQuantity", "Div_Product_Quantity_" + trid, trid)
                bindComboData({ id: "ddl_m_measureunit_" + trid, container: trid, isMeasureUnit: true }, val.measureUnits);
                $("#ddl_m_measureunit_" + trid).change(function () { SumTransferProducts(trid, container); });
            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function RemoveItemOrderElementTransferProducts(trid, container) {
        $("#" + trid).remove();
        SumTransferProducts(trid, container);
    }


    function SumTransferProducts(trid, container) {
        $("#" + trid).find("#txt_m_TotalQuantity").val(getTotalQuantity(trid, container) * ($("#" + trid).find("[id*=ddl_m_measureunit]").val() != null ? $("#" + trid).find("[id*=ddl_m_measureunit]").val().split('_')[0] : 1));
    }
    //--------------------js TransferProducts end-----------------------



    //-----------------ProfitAndLossReport start-------------------------
    function loadProfitAndLossReport(container, first) {
        var $con = $("#" + container);
        if (first) {
            GetProfitAndLossReports(container);

            $("#ddl_ProfitLossReportType").unbind("change").bind('change', function (event) {
                GetProfitAndLossReports(container);
            });
            $con.find("#btn_Print").off().on('click', function () {
                PrintProfitAndLossDetails(container);
            }).button({ icons: {
                primary: "ui-icon-print"
            },
                text: true
            });
        }

    }

    function GetProfitAndLossReports(container) {
        var $con = $("#" + container);
        var id = $con.find("#ddl_ProfitLossReportType").children(":selected").attr("id");
        if (id == null)
            selectedReportType = 2;
        var DTO = { 'id': id };
        var ItemList = "";
        $con.find("#ProfitAndLossReport").html("");
        $.ajax({

            url: "Management/GetProfitAndLoss",
            data: JSON.stringify(DTO),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response.result))
                    return;

                for (var i = 0; i < response.result.length; i++) {
                    var rec1 = response.result[i];
                    var balance = 0;
                    if (rec1.GroupType == 4 || rec1.GroupType == 5) {
                        if (rec1.balance > 0)
                            balance = "(" + (rec1.balance) + ")";
                        else
                            balance = (-1 * rec1.balance);
                    }
                    else {
                        if (rec1.GroupType != 0) {
                            if (rec1.balance > 0)
                                balance = "(" + (-1 * rec1.balance) + ")";
                            else
                                balance = (-1 * rec1.balance);
                        }
                        else
                            balance = rec1.balance;
                    }
                    ItemList += "<tr>" +
                "<td width='20%'>" + rec1.Name + "</td>" +
                 "<td width='20%' >" + balance + "</td>" +
                 "<td width='20%' ></td>" +
                 "<td width='10%' ></td>" +
                 "<td width='20%' ></td>" +
               "</tr>";
                }
                if ($con.find("#td_CurrentPhaseEndProfit").text() == "")
                    $con.find("#td_CurrentPhaseEndProfit").html("<span>PeriodEndProfit</span>" + ToPersianDateDigitYearRight(response.endDate));
                $con.find("#ProfitAndLossReport").html(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function PrintProfitAndLossDetails(container) {
        var $con = $("#" + container);
        if ($con.find("#Div_Print").html().length < 10) {
            $con.find("#Div_Print").load("Report/PrintProfitAndLoss.htm", function () {
                getProfitAndLossPrint(container);
            });
        }
        else
            getProfitAndLossPrint(container);
    }

    function getProfitAndLossPrint(container) {
        var $con = $("#" + container);
        var DTO = { 'id': $con.find("#ddl_ProfitLossReportType").children(":selected").attr("id") };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/GetProfitAndLoss",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone) {
                    SetProftitAndLossData(container, response);
                    Popup($con.find("#Div_Print").html());
                }
                else
                    alert("noData");

            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function SetProftitAndLossData(container, response) {

        var $con = $("#" + container);
        //$con.find("#Div_Print").load("Report/PrintInvoice.htm", function () {
        var ItemList = "";
        var totaladded = 0;
        var totalDecrease = 0;
        for (var i = 0; i < response.result.length; i++) {
            var rec1 = response.result[i];
            if (rec1.Code != 0) {
                if (rec1.balance < 0) {
                    if (i + 2 == response.result.length)
                        ItemList += "<tr  >" +
                       "<td width='20%' style='  border-top: hidden; width: 20%;' >" + rec1.Code + "</td>" +
                        "<td width='40%' style=' border-top: hidden; width: 40%;'>" + rec1.Name + "</td>" +
                         "<td width='10%' style='  border-top: hidden; width: 10%;'>" + (-1 * rec1.balance) + "</td>" +
                         "<td width='10%' style=' border-top: hidden; width: 10%;'>&nbsp;</td>" +
                       "</tr>";
                    else
                        ItemList += "<tr  >" +
                       "<td width='20%' style='border-bottom: hidden; border-top: hidden; width: 20%;' >" + rec1.Code + "</td>" +
                        "<td width='40%' style='border-bottom: hidden; border-top: hidden; width: 40%;'>" + rec1.Name + "</td>" +

                         "<td width='10%' style='border-bottom: hidden; border-top: hidden; width: 10%;'>" + (-1 * rec1.balance) + "</td>" +
                         "<td width='10%' style='border-bottom: hidden; border-top: hidden; width: 10%;'>&nbsp;</td>" +
                       "</tr>";
                    totaladded += (-1 * rec1.balance);
                }
                else {
                    if (i + 2 == response.result.length)
                        ItemList += "<tr  >" +
                        "<td width='20%' style=' border-top: hidden; width: 20%;'>" + rec1.Code + "</td>" +
                        "<td width='40%'style='  border-top: hidden; width: 40%;'>" + rec1.Name + "</td>" +
                          "<td width='10%' style=' border-top: hidden; width: 10%;'>&nbsp;</td>" +
                          "<td width='10%' style='  border-top: hidden; width: 10%;' >" + (rec1.balance) + "</td>" +
                       "</tr>";
                    else
                        ItemList += "<tr  >" +
                        "<td width='20%' style='border-bottom: hidden; border-top: hidden; width: 20%;'>" + rec1.Code + "</td>" +
                        "<td width='40%'style='border-bottom: hidden; border-top: hidden; width: 40%;'>" + rec1.Name + "</td>" +
                          "<td width='10%' style='border-bottom: hidden; border-top: hidden; width: 10%;'>&nbsp;</td>" +
                          "<td width='10%' style='border-bottom: hidden;  border-top: hidden; width: 10%;' >" + (rec1.balance) + "</td>" +
                       "</tr>";
                    totalDecrease += (rec1.balance)

                }

            }


        }
        ItemList += "<tr  >" +
                                "<td colspan='2'  style='border-bottom: hidden; border-left: hidden; border-right: hidden; width: 20%;'><table width='100%'><tr><td width='60%' style='direction:ltr;'>" + response.Date + "</td><td width='40%' style='direction:ltr;'>جمع کل</td></tr></table></td>" +
                                  "<td width='10%' >" + totaladded + "</td>" +
                                  "<td width='10%'  >" + totalDecrease + "</td>" +
                               "</tr>";
        if (totalDecrease > totaladded)
            ItemList += "<tr  >" +
                                "<td colspan='2' style='border-bottom: hidden; border-left: hidden; border-right: hidden; border-top: hidden; width: 20%; direction:ltr;'>زیان ویژه دوره عملکرد</td>" +
                                  "<td width='10%' >&nbsp;</td>" +
                                  "<td width='10%' >" + (totalDecrease - totaladded) + "</td>" +
                               "</tr>";
        else
            if (totalDecrease < totaladded)
                ItemList += "<tr  >" +
                                "<td colspan='2' style='border-bottom: hidden; border-left: hidden; border-right: hidden; border-top: hidden; width: 20%; direction:ltr;'>سود ویژه دوره عملکرد</td>" +
                                  "<td width='10%' >" + (totaladded - totalDecrease) + "</td>" +
                                  "<td width='10%' style='border-left: hidden;' ></td>" +
                               "</tr>";
            else
                ItemList += "<tr  >" +
                                "<td colspan='2' style='border-bottom: hidden; border-left: hidden; border-right: hidden; border-top: hidden; width: 20%; direction:ltr;'>سود ویژه دوره عملکرد</td>" +
                                  "<td width='10%'  >0</td>" +
                                  "<td width='10%' style='border-left: hidden; border-bottom:hidden;' >&nbsp;</td>" +
                               "</tr>";



        //            $con.find("#LInvoiceNo").html(response.InvoiceNO);
        //            $con.find("#LDate").html(response.Date);
        $con.find("#ProfitLossList").html(ItemList);
    }



    //-----------------ProfitAndLossReport end-------------------------

    //-----------------BalanceSheet end-------------------------

    function loadBalanceSheet(container, first) {
        var $con = $("#" + container);
        GetBalanceSheetReports(container);
        if (first) {
            $("#ddl_BalanceSheetReportType").unbind("change").bind('change', function (event) {
                GetBalanceSheetReports(container);
            });
            $con.find("#btn_Print").off().on('click', function () {
                PrintBalanceSheetDetails(container);
            }).button({ icons: {
                primary: "ui-icon-print"
            },
                text: true
            });
        }
    }

    function GetBalanceSheetReports(container) {
        var $con = $("#" + container);
        var id = $con.find("#ddl_BalanceSheetReportType").children(":selected").attr("id");
        if (id == null)
            selectedReportType = 2;
        var DTO = { 'id': id };
        var ItemListFi = "";
        var ItemListcDebtAndFund = "";
        $con.find("#BalanceSheetReport").html("");
        $.ajax({

            url: "Management/GetBalanceSheet",
            data: JSON.stringify(DTO),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                //            if (!isAuthenticated(response.result))
                //                return;
                var totalFinance = 0;
                for (var i = 0; i < response.resultFinance.length; i++) {
                    var rec = response.resultFinance[i];
                    var balanceFinance = 0;
                    if (rec.balance < 0)
                        balanceFinance = "(" + (-1 * rec.balance) + ")";
                    else
                        balanceFinance = rec.balance;
                    ItemListFi += "<tr>" +
                "<td width='50%'>" + rec.Name + "</td>" +
                 "<td width='21%' >" + balanceFinance + "</td>" +
                 "<td width='21%' ></td>" +
                 "<td width='8%' ></td>" +
               "</tr>";


                }


                for (var i = 0; i < response.resultDebtAndFund.length; i++) {
                    var rec = response.resultDebtAndFund[i];
                    var balanceDebtAndFund = 0;
                    if (rec.balance < 0)
                        balanceDebtAndFund = "(" + (-1 * rec.balance) + ")";
                    else
                        balanceDebtAndFund = rec.balance;

                    ItemListcDebtAndFund += "<tr>" +
                 "<td width='50%' >" + rec.Name + "</td>" +
                   "<td width='21%' >" + balanceDebtAndFund + "</td>" +
                   "<td width='21%' ></td>" +
                 "<td width='8%' ></td>" +
               "</tr>";


                }
                if (response.resultFinance.length > response.resultDebtAndFund.length) {
                    for (var i = 0; i < (response.resultFinance.length - response.resultDebtAndFund.length); i++) {
                        ItemListcDebtAndFund += "<tr>" +
                 "<td width='50%' >" + "&nbsp" + "</td>" +
                   "<td width='21%' >" + "" + "</td>" +
                   "<td width='21%' ></td>" +
                 "<td width='8%' ></td>" +
               "</tr>";
                    }
                }
                if (response.resultFinance.length < response.resultDebtAndFund.length) {
                    for (var i = 0; i < (response.resultDebtAndFund.length - response.resultFinance.length); i++) {
                        ItemListFi += "<tr>" +
                "<td width='50%'>" + "&nbsp" + "</td>" +
                 "<td width='21%' >" + "" + "</td>" +
                 "<td width='21%' ></td>" +
                 "<td width='8%' ></td>" +
               "</tr>";

                    }
                }
                if ($con.find("#td_ActualOpEndBalanceSheet").text() == "") {
                    $con.find("#td_ActualOpEndBalanceSheet").html("<span>ActualOpEndBalanceSheet</span>" + ToPersianDateDigitYearRight(response.endDate));
                    $con.find("#td_ActualOpEndBalanceSheetDebt").html("<span>ActualOpEndBalanceSheet</span>" + ToPersianDateDigitYearRight(response.endDate));
                }
                $con.find("#BalanceSheetFinanceReport").html(ItemListFi).parent().tableScroll({ height: 380, width: contentwidth / 2, flush: false });

                $con.find("#BalanceSheetDebtAndFundReport").html(ItemListcDebtAndFund).parent().tableScroll({ height: 380, width: contentwidth / 2, flush: false });
            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function PrintBalanceSheetDetails(container) {
        var $con = $("#" + container);
        if ($con.find("#Div_Print").html().length < 10) {
            $con.find("#Div_Print").load("Report/PrintBalanceSheet.htm", function () {
                getBalanceSheetPrint(container);
            });
        }
        else
            getBalanceSheetPrint(container);
    }

    function getBalanceSheetPrint(container) {
        var $con = $("#" + container);
        var DTO = { 'id': $con.find("#ddl_BalanceSheetReportType").children(":selected").attr("id") };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: "Management/GetBalanceSheet",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone) {
                    SetBalanceSheetData(container, response);
                    Popup($con.find("#Div_Print").html());
                }
                else
                    alert("noData");

            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function SetBalanceSheetData(container, response) {

        var $con = $("#" + container);
        //$con.find("#Div_Print").load("Report/PrintInvoice.htm", function () {
        var ItemList = "";
        var totalFinance = 0;
        var totalDebtandFund = 0;
        var loss = 0;
        var count = 0;

        if (response.resultFinance.length > response.resultDebtAndFund.length)
            count = response.resultFinance.length;
        else
            count = response.resultDebtAndFund.length;
        for (var i = 0; i < count; i++) {
            var resultFinance = response.resultFinance[i];
            var resultDebtandFund = response.resultDebtAndFund[i];
            if (resultFinance != undefined && resultFinance.AccountId == 0)
                totalFinance = resultFinance.balance;
            if (resultDebtandFund != undefined && resultDebtandFund.AccountId == 0)
                totalDebtandFund = resultDebtandFund.balance;
            if (resultDebtandFund != undefined && resultDebtandFund.AccountId == -1)
                loss = resultDebtandFund.balance;
            if (i + 2 == count) {
                if (resultFinance != undefined && resultDebtandFund != undefined)
                    ItemList += "<tr>" +
                       "<td width='30%' style='  border-top: hidden;' >" + ((resultFinance != undefined && resultFinance.AccountId != 0) ? resultFinance.Name : "&nbsp;") + "</td>" +
                        "<td width='20%' style='border-top: hidden;' >" + ((resultFinance.balance != undefined && resultFinance.AccountId != 0) ? resultFinance.balance : "&nbsp;") + "</td>" +
                         "<td width='30%' style='border-top: hidden;'>" + ((resultDebtandFund != undefined && resultDebtandFund.AccountId != 0) ? resultDebtandFund.Name : "&nbsp;") + "</td>" +
                         "<td width='20%' style='border-top: hidden;'>" + ((resultDebtandFund != undefined && resultDebtandFund.AccountId != 0) ? resultDebtandFund.balance : "&nbsp;") + "</td>" +
                       "</tr>";
            }
            else {
                if (resultFinance != undefined && resultDebtandFund != undefined)
                    ItemList += "<tr  >" +
                       "<td width='30%' style='  border-top: hidden;border-bottom: hidden;' >" + ((resultFinance != undefined && resultFinance.AccountId != 0) ? resultFinance.Name : "&nbsp;") + "</td>" +
                        "<td width='20%' style=' border-top: hidden;border-bottom: hidden;'>" + ((resultFinance.balance != undefined && resultFinance.AccountId != 0) ? resultFinance.balance : "&nbsp;") + "</td>" +
                         "<td width='30%' style='  border-top: hidden;border-bottom: hidden;'>" + ((resultDebtandFund != undefined && resultDebtandFund.AccountId != 0) ? resultDebtandFund.Name : "&nbsp;") + "</td>" +
                         "<td width='20%' style='  border-top: hidden;border-bottom: hidden;'>" + ((resultDebtandFund != undefined && resultDebtandFund.AccountId != 0) ? resultDebtandFund.balance : "&nbsp;") + "</td>" +
                       "</tr>";
            }

        }
        ItemList += "<tr>" +
                       "<td width='30%' style='border-bottom: hidden;border-right: hidden;border-left: hidden;' >" + ToPersianDate(new Date()) + "</td>" +
                        "<td width='20%' >" + totalFinance + "</td>" +
                         "<td width='30%' style='border-bottom: hidden;border-left: hidden;border-right: hidden;'></td>" +
                         "<td width='20%' >" + totalDebtandFund + "</td></tr>";
        ItemList += "<tr>" +
                       "<td width='30%' style='border-bottom: hidden;border-top: hidden;border-right: hidden;border-left: hidden;' ></td>" +
                        "<td width='20%' style='border-bottom: hidden;border-top: hidden;border-right: hidden;border-left: hidden;'></td>" +
                         "<td width='30%' style='border-bottom: hidden;border-top: hidden;border-right: hidden;border-left: hidden;direction:rtl;text-align:left;'>زیان :</td>" +
                         "<td width='20%' style='border-bottom: hidden;border-top: hidden;border-right: hidden;border-left: hidden;'>" + loss + "</td></tr>";


        $con.find("#BalanceSheetList").html(ItemList);
    }


    //-----------------BalanceSheet end-------------------------

    //-----------------FiscalPeriod start-------------------------

    function loadFiscalPeriod(container, first) {
        var $con = $("#" + container);
        if (first) {
            $con.find("#txt_dateStart").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $con.find("#txt_endingDate").datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                    $con.find("#txt_ClosingDate").datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#txt_endingDate").datepicker({ changeMonth: true, changeYear: true });
            $con.find("#txt_ClosingDate").datepicker({ changeMonth: true, changeYear: true });

            $con.find('#Frm_FiscalPeriod').ajaxForm({
                // target: '#fileInput',
                //                            data: { closingDate: $("#userDefault").find("#ddl_s_Branch").val(), CurrencyRateId: $("#userDefault").find("#ddl_m_Currency").val(), CounterId: $("#userDefault").find("#ddl_m_Counter").val(), date: $("#userDefault").find("#txt_s_Date").val(), isper: isper },
                success: function (response) {
                    getFiscalPeriodList(container, { container: container, callbackmethod: getBankList, fname: "", page_index: 0,
                        build: buildFiscalPeriodList, servicename: "Management", methodname: "GetFiscalPeriodList", print: false
                    });
                    $con.find("#hi_SelectedFiscalPeriodId").val("");
                    alert(response.msg);
                },
                complete: function (xhr) {
                    $con.find("#hi_SelectedFiscalPeriodId").val("");
                },
                error: function (response) {
                    $con.find("#hi_SelectedFiscalPeriodId").val("");
                }
            });

            getFiscalPeriodList(container, { container: container, callbackmethod: getBankList, fname: "", page_index: 0,
                build: buildFiscalPeriodList, servicename: "Management", methodname: "GetFiscalPeriodList", print: false
            });

            localize();
        }
    }

    function getFiscalPeriodList(container, params) {
        var $con = $("#" + container);
        //    params["DTO"] = DTO;
        pageselectCallback(0, params, { container: "", noPaging: true, fname: params.fname, pagingContainer: container,
            first: true, isOrder: false
        });
    }

    function buildFiscalPeriodList(jq, container) {
        var $con = $("#" + container.pagingContainer);
        var table = {};
        var lstb = [];
        var lsth = [];
        var details = {};
        lsth.push({ title: "FiscalPeriodName", width: "20%" });
        lsth.push({ title: "dateStart", width: "20%" });
        lsth.push({ title: "endingDate", width: "20%" });
        lsth.push({ title: "ClosingDate", width: "20%" });
        if (!container.params.print) {
            lsth.push({ title: "deleteKey", width: "4%" });
        }
        var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
        var ItemList = "";
        if (List != null)
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                var trBody = {};
                if (!container.params.print)
                    trBody[0] = { trId: val.FiscalPeriodId };
                trBody[1] = { name: "FiscalPeriodName", html: val.Name + "<input type='hidden' id='hi_dateStart' value='" + val.StartingDate + "'/>" + "<input type='hidden' id='hi_EndingDate' value='" + val.EndingDate + "'/>" + "<input type='hidden' id='hi_ClosingDate' value='" + val.ClosingDate + "'/>", width: "20%" };
                trBody[2] = { props: { date: val.StartingDate, name: "dateStart", width: "20%", klass: "date" }, html: val.StartingDate };
                trBody[3] = { props: { date: val.EndingDate, name: "endingDate", width: "20%", klass: "date" }, html: val.EndingDate };
                trBody[4] = { props: { date: val.ClosingDate, name: "ClosingDate", width: "20%", klass: "date" }, html: val.ClosingDate };

                lstb.push(trBody);
            }
        table = { header: lsth, body: lstb, details: { deleteFunction: RemoveFiscalPeriod, rowClick: ClickFiscalPeriod }, heigth: 300,
            container: container.pagingContainer, divName: "FiscalPeriodList"
        };
        buildTable(table);
    }

    function RemoveFiscalPeriod(FiscalPeriodId, container) {
        var DTO = { 'fiscalPeriodId': FiscalPeriodId };
        var ItemList = "";
        $con.find("#ProfitAndLossReport").html("");
        $.ajax({

            url: "Management/RemoveFiscalPeriod",
            data: JSON.stringify(DTO),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {

                getFiscalPeriodList(container, { container: container, callbackmethod: getBankList, fname: "", page_index: 0,
                    build: buildFiscalPeriodList, servicename: "Management", methodname: "GetFiscalPeriodList", print: false
                });
                alert(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });


    }
    function ClickFiscalPeriod($dis, container) {
        var $con = $("#" + container);
        var b = $dis.closest('tr').attr('id');
        var FiscalPeriodId = b.substring(2, b.length);

        $con.find("#txt_FiscalPeriodName").val($("#" + b).find("[name=FiscalPeriodName]").text());
        $con.find("#txt_dateStart").val(ToPersianDateDigitYearRight($("#" + b).find("#hi_dateStart").val()));
        $con.find("#txt_endingDate").val(ToPersianDateDigitYearRight($("#" + b).find("#hi_EndingDate").val()));
        $con.find("#txt_ClosingDate").val(ToPersianDateDigitYearRight($("#" + b).find("#hi_ClosingDate").val()));



        if (!$dis.hasClass("ui-state-error")) {
            $("#" + container).find("#FiscalPeriodList  table  tr").removeClass("ui-state-error");
            $dis.addClass("ui-state-error");
            $con.find("#hi_SelectedFiscalPeriodId").val(FiscalPeriodId);
        }
        else {
            $("#" + container).find("#FiscalPeriodList  table  tr").removeClass("ui-state-error");
            $dis.removeClass("ui-state-error");
            $con.find("#hi_SelectedFiscalPeriodId").val("");
        }

        onRowClick($dis);
    }

    //-----------------FiscalPeriod end-------------------------


    //-----------------InventorySetting Start-------------------------

    function loadInventorySetting(container, first) {
        //        if (first) {

        var $con = $("#" + container);
        var measureFirst = true;
        var size = true;
        $con.find("#divInventoryAccordion").accordion({ heightStyle: "content", collapsible: true, active: false,
            activate: function (event, ui) {

                if (ui.newPanel.prop('id') == "Color" && $con.find("#ddl_m_Color option").length < 1) {
                    bindItemsForSelectCombo({ methodname: "GetColorSystem", servicename: "Management", headertext: "انتخاب رنگ", id: "ddl_m_Color", container: container, setcolor: true });
                    getListColorSystem(container);
                    $con.find("#btn_SubmitColor").button({ icons: {
                        primary: "ui-icon-disk"
                    },
                        text: true
                    }).die().live('click', function () {
                        if (validateAll($con.find("#Color")))
                            addColor(container);
                    });
                    $con.find("#btn_EditColor").button({ icons: {
                        primary: "ui-icon-disk"
                    },
                        text: true
                    }).die().live('click', function () {
                        if (validateAll($con.find("#Color")) && $con.find("#selectedColorId").val() != "")
                            editColor($con.find("#selectedColorId").val(), container);
                    });
                }
                if (ui.newPanel.prop('id') == "Measure" && measureFirst) { bindHierarchyData({ id: "hr_m_MeasureUnit", container: container, canmodify: true, table: "MeasureUnit", css: "selectsmall1" }); measureFirst = false; }
                if (ui.newPanel.prop('id') == "Size" && size) {
                    getListSize(container);
                    bindItemsForSelectCombo({ methodname: "GetPaternSizeList", servicename: "Management", id: "ddl_m_Size", container: container, headertext: "انتخاب جزئیات " });
                    $con.find("#btn_AddPaternSize_Submit").button({ icons: {
                        primary: "ui-icon-disk"
                    },
                        text: true
                    }).unbind("click").bind('click', function () {
                        if (validateAll($con.find("#ParentSizeDiv")))
                            AddPaternSize(container);
                    });
                    $con.find("#btn_AddSize_Submit").button({ icons: {
                        primary: "ui-icon-disk"
                    },
                        text: true
                    }).unbind("click").bind('click', function () {
                        if (validateAll($con.find("#divAdvanceSize")))
                            AddSize(container);
                    });
                    $con.find("#btn_EditSize_Submit").button({ icons: {
                        primary: "ui-icon-pencil"
                    },
                        text: true
                    }).unbind("click").bind('click', function () {
                        if (validateAll($con.find("#divAdvanceSize")) && $con.find("#selectedSizeId").val() != "")
                            editSize($con.find("#selectedSizeId").val(), container);
                    });
                    size = false;
                }
            }
        });
        localize();

        //        }
    }

    function AddSize(container) {
        var $con = $("#" + container);

        $.ajax({

            url: "Management/AddSize",
            data: "{size:'" + $con.find("#txt_m_Size").val() + "',parentsizeid:'" + $con.find("#ddl_m_Size").val() + "'}",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone)
                    getListSize(container);
                translate(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function editSize(sizeid, container) {
        var $con = $("#" + container);

        $.ajax({
            url: "Management/EditSize",
            data: "{sizeid:'" + sizeid + "', size:'" + $con.find("#txt_m_Size").val() + "',parentsizeid:'" + $con.find("#ddl_m_Size").val() + "'}",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone) {
                    getListSize(container);
                    $con.find("#ddl_m_Size").val(0);
                    $con.find("#txt_m_Size").val("");
                }
                translate(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });

    }

    function ClickSize($dis, container) {
        var $con = $("#" + container);
        $con.find("#ddl_m_Size").val($dis.find("td[id*=td]").prop("id").replace("td", ""));
        $con.find("#txt_m_Size").val($dis.find("td[name=Size]").html() == "null" ? "" : $dis.find("td[name=Size]").html());
        $con.find("#selectedSizeId").val($dis.prop("id").replace("tr", ""));
    }

    function RemoveSizeElement(sizeid, container) {
        var $con = $("#" + container);

        $.ajax({
            url: "Management/DeleteSize",
            data: "{sizeid:'" + sizeid + "'}",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                getListSize(container);
                translate(response);
            },
            error: function (response) { alert(response.responseText); }
        });

    }


    function AddPaternSize(container) {
        var $con = $("#" + container);


        $.ajax({
            url: "Management/AddParentSize",
            data: "{size:'" + $con.find("#txt_m_ParentSize").val() + "'}",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                bindItemsForSelectCombo({ methodname: "GetPaternSizeList", servicename: "InventorySetting", id: "ddl_m_Size", container: container, headertext: "انتخاب جزئیات" });
                getListSize(container);
                translate(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });

    }

    function getListColorSystem(container) {
        var $con = $("#" + container);


        $.ajax({
            url: "Management/GetListColor",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var List = (typeof response) == 'string' ? eval('(' + response + ')') : response;
                var ItemList = "";
                for (var i = 0; i < List.length; i++) {
                    var val = List[0, i];
                    ItemList += "<tr id='tr" + val.ColorId + "'>" +
                "<td width='20%' style='background-color: " + val.Color + ";'></td>" +
                "<td width='35%' name='name'>" + val.Color + "</td>" +
                "<td width='35%' name='translate'>" + val.ColorTranslate + "</td>" +
                "<td id='delete' width='10%'><button id='a_Button'>حذف</button></td></tr>";
                    //<div class='modalClose modalRemove'><a href='javascript:RemoveColorElement(" + val.ColorId + ",\"" + container + "\");'/></div>
                }
                $con.find("#ListColor").html(ItemList).parent().tableScroll({ height: 380, flush: false });
                //  $con.find("#ListColor").parent().tableScroll({ height: 380 });
                //   TableAlter(container);
                $con.find("[id=a_Button]").button({
                    icons: {
                        primary: "ui-icon-closethick"
                    },
                    text: false
                }).click(function () {
                    if (confirm("آیا از حذف مطمئن هستید؟"))
                        RemoveColorElement($(this).parents("tr").prop("id").replace("tr", ""), container);
                    else
                        return;
                });
                $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
                    ClickColor($(this).parent("tr"), container)
                }).addClass("cursor");
                $con.find("#divInventoryAccordion").accordion({ collapsible: true, heightStyle: "content" });

            },
            error: function (response) { alert(response.responseText); }
        });



    }

    function ClickColor($dis, container) {
        var $con = $("#" + container);
        $con.find("#ddl_m_Color").val($dis.find("td[name=name]").html());
        $con.find("#selectedColorId").val($dis.prop("id").replace("tr", ""))
        $con.find("#txt_m_Translate").val($dis.find("td[name=translate]").html() == "null" ? "" : $dis.find("td[name=translate]").html());
    }


    function addColor(container) {
        var $con = $("#" + container);

        $.ajax({
            url: "Management/AddColor",
            data: "{color:'" + $con.find("#ddl_m_Color").val() + "',translate:'" + $con.find("#txt_m_Translate").val() + "'}",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone)
                    getListColorSystem(container);
                translate(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });

    }

    function editColor(colorid, container) {
        var $con = $("#" + container);

        $.ajax({
            url: "Management/EditColor",
            data: "{colorid:'" + colorid + "',color:'" + $con.find("#ddl_m_Color").val() + "',translate:'" + $con.find("#txt_m_Translate").val() + "'}",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.isdone) {
                    getListColorSystem(container);
                    $con.find("#txt_m_Translate").val("");
                    $con.find("#ddl_m_Color").val(0);
                }
                translate(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });


    }

    function getListSize(container) {
        var $con = $("#" + container);


        $.ajax({
            url: "Management/GetListSize",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var List = (typeof response) == 'string' ? eval('(' + response + ')') : response;
                var ItemList = "";
                for (var i = 0; i < List.length; i++) {
                    var val = List[0, i];
                    if (val.ParentSizeId != null && val.ParentSizeId != 0)
                        ItemList += "<tr id='tr" + val.SizeId + "'>" +
                    "<td width='45%' name='Parent' id='td" + val.ParentSizeId + "'>" + val.ParentSize + "</td>" +
                    "<td width='45%' name='Size'>" + val.Size + "</td>" +
                    "<td width='10%' id='delete'><button id='a_Button'>حذف</button></td></tr>";
                    else
                        ItemList += "<tr id='tr" + val.SizeId + "'>" +
                    "<td width='45%' name='Parent' id='td" + val.SizeId + "'>" + val.Size + "</td>" +
                    "<td width='45%' name='Size'></td>" +
                    "<td width='10%' id='delete'><button id='a_Button'>حذف</button></td></tr>";
                }
                $con.find("#ListSize").html(ItemList).parent().tableScroll({ height: 380, flush: false });
                // $con.find("#ListSize").parent().tableScroll({ height: 380 });
                //  TableAlter(container);
                $con.find("[id=a_Button]").button({
                    icons: {
                        primary: "ui-icon-closethick"
                    },
                    text: false
                }).click(function () {
                    if (confirm("آیا از حذف مطمئن هستید؟"))
                        RemoveSizeElement($(this).parents("tr").prop("id").replace("tr", ""), container);
                    else
                        return;
                });
                $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
                    ClickSize($(this).parent("tr"), container)
                }).addClass("cursor");
                $con.find("#divInventoryAccordion").accordion({ collapsible: true, heightStyle: "content" });
            },
            error: function (response) { alert(response.responseText); }
        });




    }

    //-----------------InventorySetting End-------------------------

    //-----------------InventoryReportList Start-------------------------

    function loadInventoryReportList(container, first) {
        sortid = 'BarcodeId desc';
        if (first) {
            var $con = $("#" + container);

            // bindDropDown("ddl_d_SearchBy", container);
            bindHierarchyData({ id: "hr_s_Category", table: "category", container: container, styleclass: "PagingSelect " });
            bindItemsForSelectCombo({ methodname: "getAvailablity", servicename: "Management", id: "ddl_s_Availability", container: container, headertext: "وضعیت کالا", selectedindex: 1 });

            getBarcodeReportList(container);
            //  GetSubMenuItems("a_InventoryReportList", container);
            $con.find("#divslider").unbind('click').click(function () { sliderClick("divInventorysearch"); sliderClick("InventoryAdvanceSearch"); });
            $con.find("#btnSearchInventory").unbind('click').click(function () { getBarcodeReportList(container); }).button({ icons: {
                primary: "ui-icon-search"
            }
            });
            $con.find("#PageSize").unbind('change').change(function () { getBarcodeReportList(container); });
            $con.find("#InventoryAdvanceSearchbt").unbind('click').click(function () { getBarcodeReportList(container); }).button();
            $con.find("#regdateFrom").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#regdateTo').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            $con.find("#regdateTo").datepicker({ changeMonth: true, changeYear: true });
        }

    }



    function getBarcodeReportList(container) {
        var $con = $("#" + container);
        var first = true;
        var take = $con.find("#PageSize").val();
        var skip = 0;
        var page_index = 0
        var barcode = "", name = "", code = "", price = "";
        if ($con.find("#divBarcodesearch").is(":visible")) {

            var search = $con.find("#ddl_d_SearchBy").val();
            if (search == "Barcode") {

                barcode = $con.find("#txt_s_Inventory").val();
            } if (search == "Name") {

                name = $con.find("#txt_s_Inventory").val();
            } if (search == "Code") {

                code = $con.find("#txt_s_Inventory").val();
            } if (search == "Price") {

                price = $con.find("#txt_s_Inventory").val();
            }

            //        if (container == "selectCustomerContent") {
            //            name = $con.find("#selectCustomerName").val();
            //            regname = $con.find("#selectCustomerRegisterer").val();
            //        }
            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': barcode, 'name': name, 'code': code, 'price': price, 'categoryid': getHierarchySelectedValue("hr_s_Category", container), 'status': $con.find("#ddl_s_Availability").val(), 'quantityfrom': $con.find("#quantityFrom").val(), 'quantityto': $con.find("#quantityTo").val(), 'regdatefrom': $con.find("#regdateFrom").val(), 'regdateto': $con.find("#regdateTo").val(), 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "getBarcodeReportList" };
        }
        else {
            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': barcode, 'name': name, 'code': code, 'price': price, 'categoryid': getHierarchySelectedValue("hr_s_Category", container), 'status': $con.find("#ddl_s_Availability").val(), 'quantityfrom': $con.find("#quantityFrom").val(), 'quantityto': $con.find("#quantityTo").val(), 'regdatefrom': $con.find("#regdateFrom").val(), 'regdateto': $con.find("#regdateTo").val(), 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "getBarcodeReportList" };
            //var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': $con.find("#CustomerSearchCode").val(), 'namefamily': $container.find("#CustomerSearchName").val(), 'introducer': $container.find("#CustomerSearchIndtroducerName").val(), 'registerername': $container.find("#CustomerSearchRegName").val(), 'agefrom': $container.find("#CustomerSearchAgeStart").val(), 'ageto': $container.find("#CustomerSearchAgeEnd").val(), 'regdatefrom': $container.find("#CustomerSearchRegDateStart").val(), 'regdateto': $container.find("#CustomerSearchRegDateEnd").val() };
        }


        $.ajax({
            url: "Management/GetItemsList",
            data: JSON.stringify(DTO),
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var opt = InventoryReportgetOptionsFrom(response.count, container);
                $con.find("#paging").pagination(response.count, opt);
                InventoryReportpageselectCallback(0, response, container, first);
            },
            error: function (response) { alert(response.responseText); }
        });

    }


    function InventoryReportgetOptionsFrom(count, container) {
        var $con = $("#" + container);
        var opt = { callback: InventoryReportpageselectCallback };
        $con.find("input:text").each(function () {
            opt[this.name] = this.className.match(/numeric/) ? parseInt(this.value) : this.value;
        });
        opt.prev_show_always = false;
        opt.next_show_always = false;
        if ((count) < $con.find("#PageSize").val())
            $con.find("#PageSize").css("display", "none");
        else {
            $con.find("#PageSize").css("display", "inline");
        }
        opt.items_per_page = $con.find("#PageSize").val();
        opt.prev_text = "قبلی";
        opt.next_text = "بعدی";
        opt.container = container;
        return opt;
    }


    function InventoryReportpageselectCallback(page_index, jq, container, first) {
        var $con = $("#" + container);
        var barcode = "", name = "", code = "", price = "";
        if (first) {
            buildBarcodeReportList(jq, container);
        }
        else {
            first = false;
            var items_per_page = $con.find("#PageSize").val();
            var itemcontent = '';
            var take = items_per_page;
            var skip = page_index == 0 ? 0 : (page_index * take);
            if ($con.find("#divBarcodesearch").is(":visible")) {

                var search = $con.find("#ddl_d_SearchBy").val();
                if (search == "Barcode") {

                    barcode = $con.find("#txt_s_Inventory").val();
                } if (search == "Name") {

                    name = $con.find("#txt_s_Inventory").val();
                } if (search == "Code") {

                    code = $con.find("#txt_s_Inventory").val();
                } if (search == "Price") {

                    price = $con.find("#txt_s_Inventory").val();
                }

                //        if (container == "selectCustomerContent") {
                //            name = $con.find("#selectCustomerName").val();
                //            regname = $con.find("#selectCustomerRegisterer").val();
                //        }
                var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': barcode, 'name': name, 'code': code, 'price': price, 'categoryid': getHierarchySelectedValue("hr_s_Category", container), 'status': $con.find("#ddl_s_Availability").val(), 'quantityfrom': "", 'quantityto': "", 'regdatefrom': "", 'regdateto': "", 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "getBarcodeReportList" };
            }
            else {
                var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': barcode, 'name': name, 'code': code, 'price': price, 'categoryid': getHierarchySelectedValue("hr_s_Category", container), 'status': $con.find("#ddl_s_Availability").val(), 'quantityfrom': "", 'quantityto': "", 'regdatefrom': "", 'regdateto': "", 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "getBarcodeReportList" };
                //var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': $con.find("#CustomerSearchCode").val(), 'namefamily': $container.find("#CustomerSearchName").val(), 'introducer': $container.find("#CustomerSearchIndtroducerName").val(), 'registerername': $container.find("#CustomerSearchRegName").val(), 'agefrom': $container.find("#CustomerSearchAgeStart").val(), 'ageto': $container.find("#CustomerSearchAgeEnd").val(), 'regdatefrom': $container.find("#CustomerSearchRegDateStart").val(), 'regdateto': $container.find("#CustomerSearchRegDateEnd").val() };
            }


            $.ajax({
                url: "Management/GetItemsList",
                data: JSON.stringify(DTO),
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    if (!isAuthenticated(response))
                        return;
                    buildBarcodeReportList(response, container);
                },
                error: function (response) { alert(response.responseText); }
            });

            return false;
        }
        Sort(getBarcodeReportList, container);
    }



    function buildBarcodeReportList(jq, container) {
        var $con = $("#" + container);
        if (jq.results != undefined) {
            var sumQuantity = jq.sumQuantity;
            var sumPrice = jq.sumPrice;
            jq = jq.results;
            var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
            var ItemList = "";
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                ItemList += "<tr id='tr" + val.BarcodeId + "'>" +
                "<td name='barcode' width='7%'>" + val.Barcode + "</td>" +
                "<td name='code' width='5%'>" + val.ItemCode + "</td>" +
                "<td name='name' width='7%'>" + val.Name + "</td> " +
                "<td name='price' width='5%'>" + val.Regular + "</td> " +
                "<td width='5%'>" + val.Status + "</td>" +
                "<td width='5%'>" + val.Category + "</td>" +
                "<td width='5%'>" + val.BuyQuantity + " " + val.UnitType + "</td>" +
                "<td width='5%'>" + val.AverageBuyPrice + "</td>" +
                "<td width='6%'>" + val.SellQuantity + " " + val.UnitType + "</td>" +
                "<td width='5%'>" + val.AverageSellPrice + "</td>" +
                "<td width='5%'>" + val.TotalAvailableQuantity + " " + val.UnitType + "</td>" +
                "<td width='5%'>" + val.TotalBrokenQuantity + " " + val.UnitType + "</td>" +
                "<td width='6%'>" + Math.round((val.BuyQuantity * val.AverageBuyPrice) * 100) / 100 + "</td>" +
                "<td width='6%'>" + Math.round((val.SellQuantity * val.AverageSellPrice) * 100) / 100 + "</td>" +
                 "<td width='6%'>" + Math.round(((val.SellQuantity * val.AverageSellPrice) - (val.BuyQuantity * val.AverageBuyPrice)) * 100) / 100 + "</td>" +
                "<td width='5%'>" + (val.SellQuantity > 0 ? Math.round(((val.AverageSellPrice - val.AverageBuyPrice) * 1) * 100) / 100 : 0) + "</td>" +
                "<td width='5%'>" + (val.SellQuantity > 0 ? Math.round(((val.AverageSellPrice - val.AverageBuyPrice) / val.AverageBuyPrice * 100) * 100) / 100 : 0) + "</td>" +
                "<td width='7%'>" + "سود روز:" + "<br/>" + (val.SellQuantity > 0 ? Math.round(val.AveSellPerDay * 100 - (val.AverageSellPrice - val.AverageBuyPrice)) / 100 : 0) + "<br/>" + "فروش روز:" + "<br/>" + Math.round(val.AveSellPerDay * 100) / 100 + "<br/>" + "تاریخ اتمام:" + "<br/>" + (val.SellQuantity > 0 ? val.ItemFinishDate : "<span>unknown</span>") + "<br/>" + "</td>" +
                //                "<td width='5%'>" + Math.round(val.AveProfitPerDay * 100) / 100 + "</td>" +
                //                "<td width='7%'>" + val.ItemFinishDate + "</td>" +
                //                "<td name='image' width='9%'><img class='imagefortable' src='Data/Photos/" + val.Barcode + "/tiny_1.jpg'>
                "</tr>";
            }
            //        if (sumQuantity != undefined) {
            //            var footer = "<tfoot id='" + container + "'><tr><td colspan='6'></td><td colspan='2'><span>totalQuantity</span></td><td colspan='2'>" + sumQuantity + "</td></tr><tr><td colspan='6'></td><td colspan='2'><span>totalPrice</span></td><td colspan='2'>" + sumPrice + "</td></tr></tfoot>";
            //            $con.find("tfoot[id='" + container + "']").parent("table").remove();
            //            $con.find("#BarcodeList").parent().remove('tfoot').append(footer);
            //        }
            if (sumQuantity != undefined) {
                $con.find("#divFooter").removeClass("invisible");
            }
            $con.find("#spTotalValue").html(sumPrice);
            $con.find("#spTotalQuantity").html(sumQuantity);
            $con.find("#BarcodeList").html(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
            //  $con.find("#BarcodeList").parent().tableScroll({ height: 280 });
            // TableAlter(container);
            $con.find("tr[id*=tr]").find('td').click(function () {
                ClickKardex($(this).parent("tr"), container)
            }).addClass("cursor");
        }
        else
            $con.find("#BarcodeList").parent().tableScroll({ height: 380, width: contentwidth, flush: false });
    }

    function ClickKardex($dis, container) {
        createSubTab({ row: $dis, name: "a_InventoryReportList" });
        onRowClick($dis);
    }
    //-----------------InventoryReportList End-------------------------


    //----------property tree begin-------
    var PropertyzTree;
    function loadProductProperties(container, first) {

        var $con = $("#" + container);
        if (first) {

            $con.find("#treeDemo").attr('id', "treeDemo" + container);
            var id = "treeDemo" + container;
            $.fn.zTree.init($con.find("#" + id), Propertysetting);
            PropertyzTree = $.fn.zTree.getZTreeObj(id);
            $con.find("#btn_Refresh").off().on('click', function () {
                $.fn.zTree.init($con.find("#" + id), Propertysetting);
                PropertyzTree = $.fn.zTree.getZTreeObj(id);
            })

            $con.find("#btn_saveProperty").off().on('click', function () {
            }).button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            });

            $con.find('#frm_Property').ajaxForm({
                success: function (response) {
                    if (response.isdone) {
                        if (response.isEdit) {
                            PropertyEditTreeNode(response.name, response.isCheck, response.id);
                            //                        $("#hi_isEdit").val(false);
                            //                        $("#hi_SelectedParentCatId").val("");
                        }
                        else {
                            var node = { 'name': response.name, 'id': response.id, 'isChecked': response.isCheck };
                            propertyaddNewTreeNode(node);
                            //                        $("#hi_isEdit").val(false);
                            //                        $("#hi_SelectedParentCatId").val("");
                        }
                    }
                    else
                        alert(response.msg);
                },
                complete: function (xhr) {

                }
            });

        }
        localize();
    }



    var Propertysetting = {
        view: {
            addHoverDom: PropertyaddHoverDom,
            removeHoverDom: PropertyremoveHoverDom,
            fontCss: PropertygetFont,
            nameIsHTML: true
        },
        edit: {
            enable: true,
            showRenameBtn: false
        },
        check:
    {
        enable: true
    },
        data: {
            simpleData: {
                enable: true
            },
            key:
        {
            checked: "isChecked"
        }

        },
        async: {
            enable: true,
            url: "Hierarchy/GetTreeData",
            autoParam: ["id", "name"],
            otherParam: { "name": "Properties" }

        },

        callback: {
            //        onRightClick: PropertyOnRightClick,
            beforeDrag: PropertybeforeDrag,
            onClick: propertyonClick,
            //        beforeDrop: beforeDrop,
            onAsyncSuccess: PropertyonAsyncSuccess,
            onCheck: propertyonCheck,
            onRename: propertyonRename,
            beforeRemove: propertybeforeRemove,
            beforeEditName: propertybeforeEditName,
            onDblClick: propertyonDblClick,
            onDrop: propertyOnDrop
        }
    };

    function PropertygetFont(treeId, node) {
        return node.font ? node.font : {};
    }

    function PropertyonAsyncSuccess(event, treeId, treeNode, msg) {
        var container = "frm_Property";
        var $con = $("#" + container);
        $con.find(".zTreeDemoBackground li:even").css("background-color", "#FFFFFF");
        $con.find(".zTreeDemoBackground li:odd").css("background-color", "#E6F2FF");

    }
    function PropertybeforeDrag(treeId, treeNodes) {
        for (var i = 0, l = treeNodes.length; i < l; i++) {
            if (treeNodes[i].drag === false) {
                return false;
            }
        }
        return true;
    }
    function propertyOnDrop(event, treeid, treeNodes, targetNode, moveType) {

        var list = [];
        for (var i = 0; i < treeNodes.length; i++) {
            list[i] = treeNodes[i].id;
        }
        var children = [];
        var c;
        if (targetNode) {
            if (targetNode.children == undefined)
                if (targetNode.getParentNode() != null) {
                    c = targetNode.getParentNode().children;
                    $.each(c, function () {
                        children.push(this.id);
                    });
                }
                else {
                    var nodes = PropertyzTree.getNodesByFilter(filterzTree);
                    $.each(nodes, function () {
                        children.push(this.id);
                    });
                }

            else {
                c = targetNode.children;
                $.each(c, function () {
                    children.push(this.id);
                });
            }
        }
        else {
            var nodes = PropertyzTree.getNodesByFilter(filterzTree);
            $.each(nodes, function () {
                children.push(this.id);
            });
        }

        var DTO = { 'TableName': 'property', 'TargetId': targetNode == null ? null : (moveType == "inner" ? targetNode.id : targetNode.getParentNode() == null ? null : targetNode.getParentNode().id), 'treeNodes': list, 'children': children };
        $.ajax({
            type: "POST",
            async: false,
            url: "Management/TreeDaragDrop",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (response.isdone)
                    alert(response.msg);
            },
            error: function (response) { alert(response.responseText); }
        });

    }
    function propertyonClick(event, treeId, treeNode) {
        var container = "frm_Property";
        var $con = $("#" + container);
        $con.find("#hi_isEdit").val(true);
        $con.find("#hi_SelectedParentCatId").val(treeNode.id);
        GetPropertyForEdit(treeNode.id);
        $con.find("#btn_saveProperty").button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true,
            label: "edit"
        });
        localize();
    }

    function propertybeforeRemove(treeId, treeNode) {
        var container = "frm_Property";
        var $con = $("#" + container);
        var isdone = false;
        if (confirm("Confirm delete node '" + treeNode.name + "' it?")) {
            var id = treeNode.id;
            var DTO = { 'TableName': 'property', 'id': id };
            $.ajax({
                type: "POST",
                async: false,
                url: "Management/DeleteTree",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(DTO),
                success: function (response) {
                    isdone = response.isdone;
                    $con.find("#hi_isEdit").val(true);
                    $con.find("#hi_SelectedParentCatId").val(treeNode.id);
                    GetPropertyForEdit(treeNode.id);
                    $con.find("#btn_saveProperty").button({ icons: {
                        primary: "ui-icon-disk"
                    },
                        text: true,
                        label: "add"
                    });
                },
                error: function (response) { alert(response.responseText); }
            });
        }
        return isdone;
    }

    function propertybeforeEditName(treeId, treeNode, newName, isCancel) {
        var container = "frm_Property";
        var $con = $("#" + container);
        $con.find("#hi_isEdit").val(true);
        $con.find("#hi_SelectedParentCatId").val(treeNode.id);
        GetPropertyForEdit(treeNode.id);
        PropertyzTree.selectNode(treeNode);
        return false;
    }

    function propertyonRename(e, treeId, treeNode, isCancel) {
        var container = "frm_Property";
        var $con = $("#" + container);
        $con.find("#hi_isEdit").val(true);
        $con.find("#hi_SelectedParentCatId").val(treeNode.id);
        GetPropertyForEdit(treeNode.id);
    }

    function PropertyremoveHoverDom(treeId, treeNode) {
        var container = "frm_Property";
        var $con = $("#" + container);
        $con.find("#addBtn_" + treeNode.tId).unbind().remove();
    };

    function PropertyaddHoverDom(treeId, treeNode) {
        var container = "frm_Property";
        var $con = $("#" + container);
        var sObj = $con.find("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $con.find("#addBtn_" + treeNode.tId).length > 0) return;
        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='add node' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $con.find("#addBtn_" + treeNode.tId);
        if (btn) btn.bind("click", function () {
            $con.find("#btn_saveProperty").button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true,
                label: "add"
            });
            localize();
            $con.find("#hi_isEdit").val(false);
            $con.find("#hi_SelectedParentCatId").val(treeNode.id);
            $con.find("#txt_name").val("");
            $con.find("#txt_translated").val("");
            $con.find("#chk_ShowInProperty").attr('checked', false);
            $con.find("#chk_ShowInMenu").attr('checked', false);
            $con.find("#chk_ShowInFilter").attr('checked', false);
            PropertyzTree.selectNode(treeNode);
            return false;
        });
    };


    function propertyonDblClick(event, treeId, treeNode) {
        var container = "frm_Property";
        var $con = $("#" + container);
        $con.find("#hi_isEdit").val(false);
        $con.find("#hi_SelectedParentCatId").val("0");
        $con.find("#txt_name").val("");
        $con.find("#txt_translated").val("");
        $con.find("#chk_ShowInProperty").attr('checked', false);
        $con.find("#chk_ShowInMenu").attr('checked', false);
        $con.find("#chk_ShowInFilter").attr('checked', false);
        $con.find("#btn_saveProperty").button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true,
            label: "addroot"
        });
        PropertyzTree.cancelSelectedNode(treeNode);
        localize();
    }



    function PropertyEditTreeNode(name, isChecked, id) {
        var node = PropertyzTree.getSelectedNodes()[0];
        node.name = name;
        node.isChecked = isChecked;
        PropertyzTree.updateNode(node);
    }

    function propertyaddNewTreeNode(newNode) {
        if (PropertyzTree.getSelectedNodes()[0] && ($("#hi_SelectedParentCatId").val() != "0" && $("#hi_SelectedParentCatId").val() != "")) {
            $("#hi_SelectedParentCatId").val(PropertyzTree.getSelectedNodes()[0].id);
            newNode.checked = PropertyzTree.getSelectedNodes()[0].checked;
            PropertyzTree.addNodes(PropertyzTree.getSelectedNodes()[0], newNode);
        } else {
            PropertyzTree.addNodes(null, newNode);
        }
    }


    function propertyonCheck(event, treeId, treeNode) {
        var id = treeNode.id;
        var DTO = { 'tableName': 'property', 'Id': id, 'show': treeNode.isChecked };
        $.ajax({
            type: "POST",
            async: false,
            url: "Management/ChangeshowTreeNodeRec",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (response.isdone) {
                    alert(response.msg);
                }
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function GetPropertyForEdit(propertyId) {
        var DTO = { 'TableName': 'Property', 'Id': propertyId };
        var container = "div_Details";
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            async: false,
            url: "Management/getTreeItem",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                var show = response.ShowOnline != null ? response.ShowOnline : false;
                $("#txt_name").val(response.Property);
                $("#txt_translated").val(response.TranslatedProperty);
                $("#hi_SelectedParentCatId").val(response.PropertyId);
                $("#chk_ShowInProperty").attr('checked', response.ShowInProperty);
                $("#chk_ShowInMenu").attr('checked', response.ShowInMenu);
                $("#chk_ShowInFilter").attr('checked', response.ShowInFilter);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    //-------------property tree end------------

    function getAllProperties(barcodeid, dialog, container) {
        var $con = $("#" + container);
        var DTO = { 'barcodeid': barcodeid, 'propertyId': getHierarchySelectedValue("divProperty", container) };
        $.ajax({
            type: "POST",
            data: JSON.stringify(DTO),
            url: "Management/getAllPropertys",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                //                if(response.isdone)
                //            GetPropertyList(barcodeid, container)
                var table = "<table class='table' ><tbody>";
                var group = (typeof response.properties) == 'string' ? eval('(' + response.properties + ')') : response.properties;
                for (var j = 0; j < group.length; j++) {
                    var val = group[0, j];
                    table += "<tr ><td style=' font-weight: bold; background-color: #CCFFCC' colspan='4'>" + val.Property + "</td></tr>";
                    var Properties = (typeof val.properties) == 'string' ? eval('(' + val.properties + ')') : val.properties;
                    // table += "<tr  style='direction:ltr'>"
                    for (var p = 0; p < Properties.length; p++) {
                        var val = Properties[0, p];
                        var subProperty = "";
                        for (var sp = 0; sp < val.properties.length; sp++) {
                            var sval = val.properties[0, sp];
                            subProperty += "<tr><td><input type='checkbox' " + ($.inArray(sval.PropertyId, response.propertyIds) != -1 ? "checked" : "") + " value='" + sval.PropertyId + "' />" + sval.Property + " , " + sval.TranslatedProperty + "</td></tr>"
                        }
                        table += "<tr  id='tr" + val.PropertyId + "'><td>" + val.Property + "</td>" +
                    "<td>" +
                    "<table  propertyId='" + val.PropertyId + "'><tbody>" +
                    subProperty
                    + "</tbody ></table></td>" +
                     "<td><input property  placeholder='property' />" +
                     "</td><td><input main placeholder='main' />" +
                     "</td></tr>";
                    }
                    // table += "</tr>";
                }
                table += "</tbody></table>"
                $con.find("#itemProperty").html(table);
                $con.find("#itemProperty").tableScroll({ height: 380, width: contentwidth, flush: false });
                $con.find("[id=btnDelete]").button({


            });

            $con.find("[id=btnDelete]").button({
                icons: {
                    primary: "ui-icon-closethick"
                },
                text: false
            }).unbind().click(function () {
                var d = this;
                if (confirm("آیا از حذف مطمئن هستید؟"))
                    deleteProperty($(this).attr("propId"), barcodeid, container + "dialogAddProperty", container);
                else
                    return;
            });
            //        $con.find("table").find("input:text").each(function () {
            //            aComplete({ methodname: "GetCompletionListByProperty", servicename: "Management", id: $(this).attr("id"), boxId: $(this).attr("id"), container: container, minlength: 2, autofocus: false, limit: 20, data: { propertyId: $(this).attr("propertyId")} });
            //        });
            //        $con.find("table").find("input:text").each(function () {
            //            aComplete({ methodname: "GetCompletionListByProperty", servicename: "Management", id: $(this).attr("id"), boxId: $(this).attr("id"), container: container, minlength: 2, autofocus: false, limit: 20, data: { propertyId: $(this).attr("propertyId")} });
            //        });
        },
        error: function (response) { alert(response.responseText); }
    });
}

	