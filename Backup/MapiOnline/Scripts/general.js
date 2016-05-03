

//-------------Global Variable begin------------------

//////////validation//////////////////////////////////



$(document).ready(function () {


    setvalid("Email");
    setvalid("String");
    setvalid("LongString");
    setvalid("Digit");
    setvalid("Date");
    setvalid("Phone");
    setvalid("Mobile");
    setvalid("Combo");
    setvalid("ComboBool");
    setvalid("ComboDiv");
    setvalid("fileInput");
    setvalid("password");
    setvalid("passwordConfirm");


    $("#male").live({
        click: function () {
            selectBoxCheck($(this));
        }
    });
    $("#female").live({
        click: function () {
            selectBoxCheck($(this));
        }
    });

    $("#txt_phone").live({
        click: function () {
            selectBoxCheck($(this));
        }
    });
    $("#txt_mobile").live({
        click: function () {
            selectBoxCheck($(this));
        }
    });

    var active = 0;

    if (getParameterByName("tabName") == "comment")
        active = 1;

//    $("#productInfo").tabs({ active: active, activate: function (event, ui) {
//        if (ui.newPanel.attr("id") == "general") {
//            $("#infoTab").find("[name=tabName]").val("general");
//        }
//        else if (ui.newPanel.attr("id") == "comments") {
//            $("#infoTab").find("[name=tabName]").val("comment");
//        }

//        $("#infoTab").submit();
//    }
//    });
    $("#txt_dateSend").datepicker({ minDate: 0,maxDate: "+30D", changeMonth: true, changeYear: true, onClose: function () { validateAll($("#newRecieverInfo")) } });

});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function setvalid(id) {
    $("[validation='" + id + "']").die();
    $("[validation='" + id + "']").live({
        focusout: function () {
            myFocusOut($(this))
        },
        click: function () {
            myClick($(this));
        }
    });
}

function validateAll($con) {
    var countVal = 0;
    $con.find('[class*="validate"]').each(function () {
        if (myFocusOut($(this)) == false)
            countVal += 1;
    });
    return (countVal > 0) ? false : true;
}
function selectRadioButton(elem) {
    $('[validation=' + elem.attr("validation") + ']').each(function () {
        var dis = $("#" + this.id);
        if (dis.is(':checked')) {
            dis.parent().parent().removeClass().addClass("radioOn");
        }
        else {
            dis.parent().parent().removeClass().addClass("radioOff");
        }
    });
}

function selectCheckBoxShippingAddress(elem) {
    var par = elem.parent();
    var child = elem.children();
    if (child.is(':checkbox')) {
        if (child.is(':checked')) {
            elem.removeClass();
            elem.addClass("labelCheck checked");
        }
        else {
            elem.removeClass();
            elem.addClass("labelCheck unchecked");
        }
    }

}

function selectBoxCheck(elem) {
    var par = elem.parent();

    if (elem.is(':checkbox')) {
        if (elem.is(':checked')) {
            par.removeClass();
            par.addClass("labelCheck checked");
        }
        else {
            par.removeClass();
            par.addClass("labelCheck unchecked");
        }
    }
    else {
        $('[validation=' + elem.attr("validation") + ']').each(function () {
            var dis = $(this);
            if (dis.is(':checked')) {
                dis.parent().removeClass().addClass("labelRadio radioOn");
            }
            else {
                dis.parent().removeClass().addClass("labelRadio radioOff");
            }
        });

    }
}

//function getTranslate(keyWord) {
//    var key = (keyWord == undefined ? "undefined" : keyWord);
//    langs[[key][$("#ddl_m_Language").val()]
//}

function myFocusOut(elem) {
    if (!elem.hasClass("required") && !elem.hasClass("validate"))
        return;
    var par = elem.parent();
    elem.removeClass("ui-state-error");
    elem.next("#val" + elem.attr("id")).remove();
    elem.after("<span id='val" + elem.attr("id") + "'></span>")
    var id = elem.attr("validation");
    par.find(".inputTip.tipHelp." + id).css({ 'display': 'none', 'visibility': 'hidden', 'opacity': '0' });
    var required = "  <span style='display:inline' class='inputTip tipWarn String'>" +
                "<span class='advice required' style='display: inline;' >پر کردن این فیلد ضروری می باشد.</span></span>";
    var validate = " <span style='display:inline' class='inputTip tipWarn String'>" +
                "<span class='advice validate' style='display: inline;'>اطلاعات راصحیح وارد کنید.</span></span>";
    var ok = "<span class=' tipOk Digit'></span>";
    if (elem.attr("validation") == "comboDiv") {
        if (!checkValidation(elem.attr('validation')))
            elem.next("#val" + elem.attr("id")).html(required);
        else
            elem.next("#val" + elem.attr("id")).html(ok);
    }
    else if (elem.hasClass("required") && elem.val() == "") {
        elem.addClass("ui-state-error");
        elem.next("#val" + elem.attr("id")).html(required)

        return false;
    }
    else if (!elem.hasClass("required") && elem.val() == "") {
        elem.removeClass("ui-state-error");
        elem.next("#val" + elem.attr("id")).html(ok)
        return true;
    }
    else if (checkValidation(elem.attr('validation'), elem)) {
        elem.removeClass("ui-state-error");
        elem.next("#val" + elem.attr("id")).html(ok)
        return true;
    }


    else {
        elem.addClass("ui-state-error");
        elem.next("#val" + elem.attr("id")).html(validate)
        return false;
    }
}

function myClick(elem) {
    elem.next("#val" + elem.attr("id")).remove();
    elem.parent().find(".inputTip.tipHelp." + elem.attr("validation")).css({ 'display': 'inline', 'visibility': 'visible', 'opacity': '1' });
}

function checkValidation(name, elam) {
    if (name == undefined)
        name = elam.attr("name");
    var data = elam.val();
    switch (name) {
        case "email":
            return new RegExp("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$").test(data);
            break;
        case "ComboDiv":
            if (elam.hasClass("required")) {
                if (elam.nextAll(".resultBar").html() == "")
                    return false;
                else
                    return true;
            }
            else
                return true;
            break;
        case "fileInput":
            return new RegExp(/^[a-zA-Z0-9-اآبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیءّئءأإؤي\s _.:\\]+$/).test(data);
            break;
        case "Combo":
            if (data == "" || data == "-")
                return false;
            else
                return true;
            break;
        case "ComboBool":
            if (data == "false" || data == "true")
                return true;
            else
                return false;
            break;
        case "LongString":
            return true; // new RegExp(/^[a-zA-Z0-9-اآبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیءّئءأإؤي\s _]+$/).test(data);
            break;
        case "String":
            return new RegExp(/^([a-zA-Zاآبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیءّئءأإؤي]+[\s ]?[a-zA-Zاآبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیءّئءأإؤي]*)$/).test(data);
            break;
        case "Digit":
            return new RegExp(/^([0-9]+)$/).test(data);
            break;
        case "Date":
            return new RegExp(/^[1-4]\d{3}\/((0?[1-6]\/((3[0-1])|([1-2][0-9])|(0?[1-9])))|((1[0-2]|(0?[7-9]))\/(30|([1-2][0-9])|(0?[1-9]))))$/).test(data);
            break;
        case "Mobile":
            if (elam.parents("table").find("ul[id=mobiles]").find("li").length > 0)
                return true;
            return new RegExp(/^((091)[0-9]\d{7}$)|^((093)[1-9]\d{7}$)/).test(data);
            break;
        case "Phone":
            if (elam.parents("table").find("ul[id=phones]").find("li").length > 0)
                return true;
            return new RegExp(/^((0)[1-9]\d{9}$)/).test(data);
            break;
        case "Email":
            return new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(data);
            break;
        case "password": case "newPassword": case "ctrlPassword":
            return (data.length >= 1) ? true : false;
            break;
        case "passwordConfirm":
            return (data == elam.parents("table").find("[validation=password]").val() && data != "") ? true : false;
            break;
        case "emailConfirm":
            return (data == $("#newEmail").val() && data != "") ? true : false;
            break;
        default:
            return "";
    }
}
// Check if string is a valid email address
function chkPhone(data, id) {
    var reg = new RegExp("^[0-9]{11}$");
    if (reg.test(data)) {
        document.getElementById('er0' + id).style.visibility = "hidden";
        document.getElementById('ok0' + id).style.visibility = "visible";
    } else {

        document.getElementById('ok0' + id).style.visibility = "hidden";
        document.getElementById('er0' + id).style.visibility = "visible";
    }
}

function chkMail(fData) {
    var reg = new RegExp("^[0-9a-zA-Z]+@[0-9a-zA-Z]+[\.]{1}[0-9a-zA-Z]+[\.]?[0-9a-zA-Z]+$");
    var res = reg.test(fData);
    if (res) {
        document.getElementById('er01').style.visibility = "hidden";
        document.getElementById('ok01').style.visibility = "visible";
    } else {
        document.getElementById('ok01').style.visibility = "hidden";
        document.getElementById('er01').style.visibility = "visible";
    }
    return (res);
}
function chkPass(pass, type) {
    if (type == '1') {
        pass1 = pass;
        if (pass != "") {
            document.getElementById('er02').style.visibility = "hidden";
            document.getElementById('ok02').style.visibility = "visible";
        } else if (pass == "") {
            document.getElementById('ok02').style.visibility = "hidden";
            document.getElementById('er02').style.visibility = "visible";
        }
    } else if (type == '2') {
        if (pass == pass1 && pass1 != "") {
            document.getElementById('er03').style.visibility = "hidden";
            document.getElementById('ok03').style.visibility = "visible";
        } else {
            document.getElementById('ok03').style.visibility = "hidden";
            document.getElementById('er03').style.visibility = "visible";
        }
    }
}
function chkLen(data, num) {
    if (data != "") {
        document.getElementById('er' + num).style.visibility = "hidden";
        document.getElementById('ok' + num).style.visibility = "visible";
    } else if (data == "") {
        document.getElementById('ok' + num).style.visibility = "hidden";
        document.getElementById('er' + num).style.visibility = "visible";
    }
}
function tip(par, num) {
    if (par == "show") {
        document.getElementById('tip' + num).style.visibility = "visible";
    } else if (par == "hide") {
        document.getElementById('tip' + num).style.visibility = "hidden";
    }
}
//////////validation End//////////////////////////////////

$.fn.digits = function () {
    return this.each(function () {
        $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
    })
}
//--------------------js General begin-----------------------
//$(document).ready(function ($) {
//    GetPersonInfo();
//});

function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function getTestData() {
    var test = "test";
    $.ajax({
        type: "POST",
        url: "/Login/getTestData2",
        data: "{test:'" + test + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            alert(response)
        },

        error: function (response) { alert(response) }
    });
}

function onclickloginLink() {
    $("#divlogindialog").dialog({ width: "650px" }).dialog("open");
    $("#divlogindialog").removeClass("invisible")
}

function GetPersonInfo() {
    $.ajax({
        contentType: "application/json; charset=utf-8",
        type: "Post",
        url: "/Account/GetPersonInfo",
        success: function (response) {
            if (response.isdone) {
                $("#gh-ug").html("<a id='a_UserProfile' href='../Account/Profile'>" + response.name + " " + response.family + "</a>  خوش آمدید!   " +
                            "<a href='../Account/LogOff'>خروج</a>");
            }
        },
        error: function (response) { alert(response.responseText); }
    });
}

function LogOutUser() {
    $.ajax({
        contentType: "application/json; charset=utf-8",
        type: "Post",
        url: "/Account/LogOutUser",
        success: function (response) {
            if (response.isdone) {
                $("#gh-ug").html("<a href='../Account/LogOn'>ورود</a> | <a href='../Account/Register'>عضویت</a>");

            }
        },
        error: function (response) { alert(response.responseText); }
    });
}

//---------------new hierarchy begin----------------

function bindHierarchyData(options) {
    var headertext = "انتخاب";
    if (options.headertext != undefined)
        headertext = options.headertext;

    var css = "selectHierarchy";

    if (options.canmodify)
        css = "selectsmall1 validate";
    if (options.css != undefined)
        css = options.css;
    var startlevel = "0";
    if (options.startlevel != undefined)
        startlevel = options.startlevel;
    var parentid = "0";
    if (options.parentid != undefined)
        parentid = options.parentid;
    var depth = 20;
    if (options.depth != undefined)
        depth = options.depth;
    if (options.container != undefined)
        var $hrDiv = $("#" + options.container).find("#" + options.id);
    else
        var $hrDiv = $("#" + options.id);
    var canmodify = false;
    if (options.canmodify != undefined)
        canmodify = options.canmodify;
    $hrDiv.html("");
    if (canmodify) {
        $hrDiv.append("<a  href='#'> <span title='باز' class='hExpand unit HierarchyImage ui-icon ui-icon-circle-triangle-s'  ></span></a>" +
           "<a  href='#'><span title='رست' class='hReset unit HierarchyImage ui-icon ui-icon-refresh'></span></a>" +
			"<select    id='hierarchyAddress' class=' " + css + " ' validation='ComboDiv' ></select>" +
            "<div  class='resultBar'></div><div  class='editBox invisible' style='padding-top:20px;'>  " +
            "<input   type='text' class='inputText inputW50'  />" +
            "<a  class='hAdd' href='#'> <span title='اضافه' class=' unit  ui-icon ui-icon-plusthick'></span></a>" +
            "<a  class='hDelete' href='#'> <span title='حذف' class=' unit  ui-icon ui-icon-trash'></span></a>" +
            "<a  class='hEdit' href='#'><span title='ویرایض' class=' unit  ui-icon ui-icon-pencil'></span></a></div>"
           );
    }
    else {
        $hrDiv.append("<a href='#'><span title='رست' class='hReset unit HierarchyImage ui-icon ui-icon-refresh'></span></a>" +
          "<select   id='hierarchyAddress' class='" + css + "' validation='ComboDiv' ></select>" +
          " <div  class='resultBar'></div>");
    }

    var $hrSelect = $hrDiv.find("select");
    $hrSelect.unbind().bind("change",
        function () {
            onOptionChanged(this, options.table, depth, $hrDiv);
        }
    );
    $hrDiv.find('.hReset').unbind().bind('click', function () {
        Resetbut_onclick($hrDiv, options.table, startlevel, parentid, headertext, options.resetid);
    });
    $hrDiv.find('.hExpand').unbind().bind('click', function () {
        if ($(this).hasClass("ui-icon-circle-triangle-s")) {
            $(this).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n").prop("title", "بسته");
        }
        else if ($(this).hasClass("ui-icon-circle-triangle-n"))
            $(this).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s").prop("title", "باز");
        $hrDiv.find(".editBox").toggle();
    });
    $hrDiv.find('.hDelete').unbind().bind('click', function () {
        Delete_onclick($hrDiv, options.table, headertext)
    });
    $hrDiv.find('.hAdd').unbind().bind('click', function () {
        Add_onclick($hrDiv, options.table)
    });
    $hrDiv.find('.hEdit').unbind().bind('click', function () {
        Update_onclick($hrDiv, options.table)
    });
    if (options.parentid != undefined) {
        BindParents($hrDiv, options.table, options.parentid, startlevel)
        return;
    }

    ajHierarchy = $.ajax({

        type: "POST",

        url: "/Hierarchy/Get",

        data: "{parentID: '" + (options.parentid == undefined ? "" : options.parentid) + "', table: '" + options.table + "'}",

        contentType: "application/json; charset=utf-8",

        success: function (response) {
            BindOptionsHtml(response, $hrSelect);
            setSelectedValueID($hrDiv);

        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}


function onOptionChanged(dis, tableName, depth, $hrDiv) {
    var selectedValue = $(dis).val();
    var selectedText = $(dis).selectedOptions()[0].text
    var c = 0;
    var conId = $hrDiv.prop("id");
    $("a[name='hiddenOption']").each(function () {
        c = c + 1;
    });
    if (selectedValue != "-" && c < depth) {
        var $resultBar = $hrDiv.find(".resultBar");
        $resultBar.append("<span class='spanAction' name='hiddenOption' id='" + selectedValue + "'>" + selectedText + " > </span>");
        $resultBar.find("#" + selectedValue).click(function () {
            onOptionClicked($hrDiv, selectedValue, tableName);
        });
        if (c + 1 < depth) {
            $.ajax({
                type: "POST",
                url: "/Hierarchy/Get",
                data: "{parentID: '" + $hrDiv.find(".resultBar span").last().prop("id") + "', table: '" + tableName + "'}",
                contentType: "application/json; charset=utf-8",

                success: function (response) {
                    BindOptionsHtml(response, $hrDiv.find("select"));
                    setSelectedValueID($hrDiv);
                }
            });
        }
    }
}


function onOptionClicked($hrDiv, parentId, tableName) {
    $.ajax({

        type: "POST",

        url: "/Hierarchy/Get",
        data: "{parentID: '" + parentId + "', table: '" + tableName + "'}",
        contentType: "application/json; charset=utf-8",

        success: function (response) {
            BindOptionsHtml(response, $hrDiv.find("select"), false);
            var $resultBar = $hrDiv.find(".resultBar span");
            while ($hrDiv.find(".resultBar span").last() != null && $hrDiv.find(".resultBar span").last().prop("id") != parentId) {
                $hrDiv.find(".resultBar span").last().remove();
            }
            setSelectedValueID($hrDiv);
        }
    });
}

function BindOptionsHtml(response, $hrSelect, isAdd, isParents) {
    if (!isAdd) {
        var Details;
        if (isParents)
            Details = response;
        else
            Details = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
    }
    //   var Details = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
    $hrSelect.removeOption(/./).addOption('-', ' انتخاب ');
    //    if ($(".resultBar").find("span").length == 0)
    //        $hrSelect.removeOption(/./).addOption('-', ' کشور را انتخاب کنید. ');
    //    else if ($(".resultBar").find("span").length == 1)
    //        $hrSelect.removeOption(/./).addOption('-', ' استان را انتخاب کنید. ');
    //    else if ($(".resultBar").find("span").length == 2)
    //        $hrSelect.removeOption(/./).addOption('-', ' شهر را انتخاب کنید. ');
    //    else if ($(".resultBar").find("span").length >= 3)
    //        $hrSelect.removeOption(/./).addOption('-', ' منطقه را انتخاب کنید. ');
    if (Details != undefined)
        for (var j = 0; j < Details.length; j++) {
            var val = Details[j];
            var text = val.value;
            var value = val.id;
            $hrSelect.addOption(value, text, false);
        }
}

function setSelectedValueID($hrDiv) {
    $hrDiv.find("#selectedValue").remove();
    $hrDiv.append("<input name='selectedValue' id='selectedValue' type='hidden' />");
    if ($hrDiv.find(".resultBar span").last() != null)
        $hrDiv.find("#selectedValue").val($hrDiv.find(".resultBar span").last().prop("id"));
    else {
        if ($("#startLevelID").val() != null)
            $hrDiv.find("#selectedValue").val($("#startLevelID").val());
        else
            $hrDiv.find("#selectedValue").val(null);
    }
}

function BindParents($hrDiv, tableName, selectedValue, startLevel, options) {

    $.ajax({
        type: "POST",
        url: "/Hierarchy/GetParents",
        data: "{parentID: '" + selectedValue + "', table: '" + tableName + "', StartLevel: '" + startLevel + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d != null) {
                var Details = (typeof response.parents) == 'string' ? eval('(' + response.parents + ')') : response.parents;

                if (options != undefined && options.isRaw) {
                    for (var j = 0; j < Details.length; j++) {
                        var val = Details[0, j];
                        var id = val[1];
                        $hrDiv.append("<span >" + val[0] + " > </span>");
                    }
                    $hrDiv.append(options.concat)
                }
                else {
                    BindOptionsHtml(response.body, $hrDiv.find("select"), false, true);

                    var $resultBar = $hrDiv.find(".resultBar");
                    $resultBar.find("span").remove();
                    {
                        for (var j = 0; j < Details.length; j++) {
                            var val = Details[0, j];
                            var id = val[1];
                            $resultBar.append("<span class='spanAction' name='hiddenOption' id='" + id + "' >" + val[0] + " > </span>");
                            $resultBar.find("[class=spanAction]").click(function () {
                                onOptionClicked($hrDiv, $(this).attr("id"), tableName);
                            })
                        }
                    }
                }
                setSelectedValueID($hrDiv);
            }
        }
    });

}


function Resetbut_onclick($hrDiv, tableName, startLevel, parentId, text, resetId) {
    if (resetId != undefined) {
        BindParents(container, tableName, resetId, startLevel)
        return;
    }
    $.ajax({

        type: "POST",

        url: "/Hierarchy/Get",

        data: "{parentID: '" + "" + "', table: '" + tableName + "'}",

        contentType: "application/json; charset=utf-8",

        success: function (response) {
            $hrDiv.find(".resultBar span").remove();
            BindOptionsHtml(response, $hrDiv.find('select'), false);

            setSelectedValueID($hrDiv);
        }
    });
}

function Delete_onclick(container, tableName, text) {

    $.ajax({

        type: "POST",

        url: "/Hierarchy/Delete",

        data: "{parentID: '" + container.find(".resultBar span").last().prop("id") + "', table: '" + tableName + "'}",

        contentType: "application/json; charset=utf-8",

        success: function (response) {
            if (response.isDone != undefined && !response.isDone) {
                alert(response.msg)
                return;
            }
            BindOptionsHtml(response, container, false);
            container.find(".resultBar span").last().remove();
            if (container.find(".resultBar span").last().length > 0)
                container.find('span.text').html(container.find(".resultBar span").last().html().replace("&gt;&gt;", ""));
            else
                container.find('span.text').html(text);
            setSelectedValueID(container);
        },
        error: function (response) {
            alert(response);
        }

    });
}

function Add_onclick($hrDiv, tableName) {
    // var container = $("#" + id);
    var parentID
    if ($hrDiv.find(".resultBar span").last().length > 0)
        parentID = $hrDiv.find(".resultBar span").last().prop("id");
    else
        parentID = 0;

    //  var conId = container.prop("id");
    $.ajax({

        type: "POST",

        url: "/Hierarchy/Add",

        data: "{parentID: '" + parentID + "', value: '" + $hrDiv.find(".inputText").val() + "', table: '" + tableName + "'}",

        contentType: "application/json; charset=utf-8",

        success: function (response) {
            if (response.isDone != undefined && !response.isDone) {
                alert(response.msg)
                return;
            }
            var $resultBar = $hrDiv.find(".resultBar");
            $resultBar.append("<span class='spanAction' name='hiddenOption' id='" + response.id + "' >" + response.value + " > </span>");
            $resultBar.find("#" + response.id).click(function () {
                onOptionClicked($hrDiv, response.id, tableName);
            });
            BindOptionsHtml(response, $hrDiv.find("select"), true)
            setSelectedValueID($hrDiv);
            $hrDiv.find(".inputText").val("");
        }

    });
}


function Update_onclick(container, tableName) {

    $.ajax({

        type: "POST",

        url: "/Hierarchy/Update",

        data: "{parentID: '" + container.find(".resultBar span").last().prop("id") + "', value: '" + container.find(".inputText").val() + "', table: '" + tableName + "'}",

        contentType: "application/json; charset=utf-8",

        success: function (response) {
            if (response.isDone != undefined && !response.isDone) {
                alert(response.msg)
                return;
            }
            container.find(".resultBar span").last().html(container.find(".inputText").val() + "&gt;&gt;");
            container.find('span.text').html(container.find(".inputText").val());
            setSelectedValueID(container);
        }

    });
}

function getHierarchySelectedValue(id, container) {
    if (container != undefined)
        return $("#" + container).find("#" + id).find("#selectedValue").val() == undefined ? null : $("#" + container).find("#" + id).find("#selectedValue").val();
    else
        return $("#" + id).find("#selectedValue").val() == undefined ? null : $("#" + id).find("#selectedValue").val();
}

//----------------new hierarchy end-------------------


//-------------- new dropdown begin ---------------------

function bindRawDropDownData(options) {
    var headertext = "انتخاب";
    if (options.headertext != undefined)
        headertext = options.headertext;
    if (options.container != undefined)
        var $hrDiv = $("#" + options.container).find("#" + options.id);
    else
        var $hrDiv = $("#" + options.id);
    var canmodify = false;
    if (options.canmodify != undefined)
        canmodify = options.canmodify;
    var css = "selectHierarchy";

    if (options.canmodify)
        css = "selectsmall validate";
    if (options.css != undefined)
        css = options.css;
    var async = true;
    if (options.async != undefined)
        async = options.async;
    if (canmodify) {
        $hrDiv.append("<a  href='#'> <span title='باز' class='hExpand unit HierarchyImage ui-icon ui-icon-circle-triangle-s'  ></span></a>" +
			"<select   id='hierarchyAddress' class=' " + css + " ' name='Combo' ></select>" +
            "<div  class='resultBar'></div><div  class='editBox invisible' style='padding-top:20px;'>  " +
            "<input   type='text' class='inputText inputW50'  />" +
            "<a  class='hAdd' href='#'> <span title='اضافه' class=' unit  ui-icon ui-icon-plusthick'></span></a>" +
            "<a  class='hDelete' href='#'> <span title='حذف' class=' unit  ui-icon ui-icon-trash'></span></a>" +
            "<a  class='hEdit' href='#'><span title='ویرایش' class=' unit  ui-icon ui-icon-pencil'></span></a></div>"
           );
    }
    else {
        $hrDiv.append(
          "<select   id='hierarchyAddress' class=' " + css + "' name='Combo' ></select>");
    }
    var $hrSelect = $hrDiv.find("select");

    $hrDiv.find('.hExpand').unbind().bind('click', function () {
        if ($(this).hasClass("ui-icon-circle-triangle-s"))
            $(this).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
        else if ($(this).hasClass("ui-icon-circle-triangle-n"))
            $(this).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
        $hrDiv.find(".editBox").toggle();
    });
    $hrDiv.find('.hDelete').unbind().bind('click', function () {
        DeleteRaw_onclick($hrDiv, options)
    });
    $hrDiv.find('.hAdd').unbind().bind('click', function () {
        AddRaw_onclick($hrDiv, options)
    });
    $hrDiv.find('.hEdit').unbind().bind('click', function () {
        UpdateRaw_onclick($hrDiv, options)
    });

    ajHierarchy = $.ajax({

        type: "POST",
        url: "/XmlDropDown/GetComboItemsRaw",

        async: async,
        data: "{table: '" + options.path + "'}",

        contentType: "application/json; charset=utf-8",

        dataType: "json",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            BindRawOptionsHtml(response, $hrSelect, options);

        }

    });
}


function BindRawOptionsHtml(response, $hrSelect, options) {
    var Details = (typeof response) == 'string' ? eval('(' + response + ')') : response;
    $hrSelect.removeOption(/./).addOption('', options.headertext);
    if (Details.length < 1)
        return;
    for (var j = 0; j < Details.length; j++) {
        var val = Details[0, j];
        var text = val.value;
        if (options.istext)
            var value = val.value;
        else
            var value = val.id;
        $hrSelect.addOption(value, text, false);
    }
}




function AddRaw_onclick($hrDiv, options) {
    $.ajax({

        type: "POST",

        url: "/XmlDropDown/AddRaw",

        data: "{value: '" + $hrDiv.find(".inputText").val() + "', table: '" + options.path + "'}",

        contentType: "application/json; charset=utf-8",

        dataType: "json",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            BindRawOptionsHtml(response, $hrDiv.find("select"), options)
            $hrDiv.find(".inputText").val("");
        }

    });
}


function UpdateRaw_onclick($hrDiv, options) {

    $.ajax({

        type: "POST",
        url: "/XmlDropDown/UpdateRaw",


        data: "{id:'" + $hrDiv.find("select").val() + "',value: '" + $hrDiv.find(".inputText").val() + "', table: '" + options.path + "'}",

        contentType: "application/json; charset=utf-8",

        dataType: "json",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            BindRawOptionsHtml(response, $hrDiv.find("select"), options)
            $hrDiv.find(".inputText").val("");
        }

    });
}


function DeleteRaw_onclick($hrDiv, options) {

    $.ajax({
        type: "POST",
        url: "/XmlDropDown/DeleteRaw",
        data: "{id: '" + $hrDiv.find("select").val() + "', table: '" + options.path + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            BindRawOptionsHtml(response, $hrDiv.find("select"), options)
            $hrDiv.find(".inputText").val("");
        }

    });
}


//---------------new  dropdown end-------------------------




//-------------- new xml dropdown begin ---------------------

function bindXmlDropDownData(options) {
    var headertext = "انتخاب";
    if (options.headertext != undefined)
        headertext = options.headertext;
    if (options.container != undefined)
        var $hrDiv = $("#" + options.container).find("#" + options.id);
    else
        var $hrDiv = $("#" + options.id);
    var canmodify = false;
    if (options.canmodify != undefined)
        canmodify = options.canmodify;
    var css = "selectHierarchy";

    if (options.canmodify)
        css = "selectsmall validate";
    if (options.css != undefined)
        css = options.css;
    var async = true;
    if (options.async != undefined)
        async = options.async;
    if (canmodify) {
        $hrDiv.append("<a  href='#'> <span title='باز' class='hExpand unit HierarchyImage ui-icon ui-icon-circle-triangle-s'  ></span></a>" +
			"<select   id='hierarchyAddress' class=' " + css + " ' name='Combo' ></select>" +
            "<div  class='resultBar'></div><div  class='editBox invisible' style='padding-top:20px;'>  " +
            "<input   type='text' class='inputText inputW50'  />" +
            "<a  class='hAdd' href='#'> <span title='اضافه' class=' unit  ui-icon ui-icon-plusthick'></span></a>" +
            "<a  class='hDelete' href='#'> <span title='حذف' class=' unit  ui-icon ui-icon-trash'></span></a>" +
            "<a  class='hEdit' href='#'><span title='ویرایش' class=' unit  ui-icon ui-icon-pencil'></span></a></div>"
           );
    }
    else {
        $hrDiv.append(
          "<select   id='hierarchyAddress' class=' " + css + "' name='Combo' ></select>");
    }
    var $hrSelect = $hrDiv.find("select");

    $hrDiv.find('.hExpand').unbind().bind('click', function () {
        if ($(this).hasClass("ui-icon-circle-triangle-s"))
            $(this).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
        else if ($(this).hasClass("ui-icon-circle-triangle-n"))
            $(this).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
        $hrDiv.find(".editBox").toggle();
    });
    $hrDiv.find('.hDelete').unbind().bind('click', function () {
        DeleteXml_onclick($hrDiv, options)
    });
    $hrDiv.find('.hAdd').unbind().bind('click', function () {
        AddXml_onclick($hrDiv, options)
    });
    $hrDiv.find('.hEdit').unbind().bind('click', function () {
        UpdateXml_onclick($hrDiv, options)
    });

    ajHierarchy = $.ajax({

        type: "POST",

        url: "/XmlDropDown/GetComboItems",
        async: async,
        data: "{path: '" + options.path + "'}",

        contentType: "application/json; charset=utf-8",

        success: function (response) {
            BindXmlOptionsHtml(response, $hrSelect, options);

        }

    });
}


function BindXmlOptionsHtml(response, $hrSelect, options) {
    var Details = (typeof response) == 'string' ? eval('(' + response + ')') : response;
    $hrSelect.html("");
    $hrSelect.append("<option value=''>" + options.headertext + "</option>");
    for (var j = 0; j < Details.length; j++) {
        var val = Details[0, j];
        var text = val.name;
        if (options.istext)
            var value = val.name;
        else
            var value = val.id;
        $hrSelect.append("<option value='" + value + "'>" + text + "</option>");
        // $hrSelect.addOption(value, text, false);
    }
}




function AddXml_onclick($hrDiv, options) {
    $.ajax({

        type: "POST",

        url: "/XmlDropDown/Add",

        data: "{value: '" + $hrDiv.find(".inputText").val() + "', path: '" + options.path + "'}",

        contentType: "application/json; charset=utf-8",

        success: function (response) {
            BindXmlOptionsHtml(response, $hrDiv.find("select"), options)
            $hrDiv.find(".inputText").val("");
        }

    });
}


function UpdateXml_onclick($hrDiv, options) {

    $.ajax({

        type: "POST",

        url: "/XmlDropDown/Update",

        data: "{id:'" + $hrDiv.find("select").val() + "',value: '" + $hrDiv.find(".inputText").val() + "', path: '" + options.path + "'}",

        contentType: "application/json; charset=utf-8",

        success: function (response) {
            BindXmlOptionsHtml(response, $hrDiv.find("select"), options)
            $hrDiv.find(".inputText").val("");
        }

    });
}


function DeleteXml_onclick($hrDiv, options) {

    $.ajax({
        type: "POST",
        url: "/XmlDropDown/Delete",
        data: "{id: '" + $hrDiv.find("select").val() + "', path: '" + options.path + "'}",
        contentType: "application/json; charset=utf-8",

        success: function (response) {
            BindXmlOptionsHtml(response, $hrDiv.find("select"), options)
            $hrDiv.find(".inputText").val("");
        }

    });
}


//---------------new xml dropdown end-------------------------

//--------------- Show Shop User Orders ----------------------
//Full Account
function getFullAcountList(container, params) {
    if (sortid == "" || sortid == null)
        sortid = "date desc";
    var $con = $("#" + container);
    if (params.page_index > 0)
        params.first = false;
    var take = $("#PageSize").val();
    //
    var InvoiceNumber = "", EmployeeName = "", shop = "", ProductName = "", Barcode = "", PriceFrom = "", PriceTo = "",
        InvoiceDateStart = "", InvoiceDateEnd = "";
    var search = $con.find("#ddlSearchBy1").val();
    if (search != "") {
        if (search == "Code") {
            code = $con.find("#txtSearch1").val();
        } if (search == "EmployeeName") {
            EmployeeName = $con.find("#txtSearch1").val();
        } if (search == "InvoiceNumber") {
            InvoiceNumber = $con.find("#txtSearch1").val();
        } if (search == "shop") {
            shop = $con.find("#txtSearch1").val();
        }
        if (search == "productBarcode") {
            Barcode = $con.find("#txtSearch1").val();
        }
    }
    if ($con.find("#txt_s_PriceFrom").length > 0)
        PriceFrom = $con.find("#txt_s_PriceFrom").val();
    if ($con.find("#txt_s_PriceTo").length > 0)
        PriceTo = $con.find("#txt_s_PriceTo").val();
    InvoiceDateStart = $con.find("#txtInvoiceDateStart").val();
    InvoiceDateEnd = $con.find("#txtInvoiceDateEnd").val();
    //
    var DTO = { 'sort': sortid, 'EmployeeName': EmployeeName, 'shop': shop, 'Barcode': Barcode,
        'InvoiceDateStart': InvoiceDateStart, 'InvoiceDateEnd': InvoiceDateEnd, 'PriceFrom': PriceFrom, 'PriceTo': PriceTo, 'InvoiceNumber': InvoiceNumber
    };
    params["DTO"] = DTO;
    pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
        first: true, isOrder: true
    });
}

function pageselectCallback(page_index, params, pageoption) {
    var $con = $("#" + pageoption.pagingContainer);
    if (pageoption.container != "")
        var $dialog = $("#" + pageoption.container + pageoption.pagingContainer);
    else
        var $dialog = $con;
    if (page_index > 0) {
        pageoption.first = false;
    }
    else if (pageoption.first) {
        pageoption["params"] = params;
        if ($dialog.find("#PageSize").val() != undefined)
            $dialog.find("#PageSize").die().live('change', function () {
                pageoption.params.callbackmethod(pageoption.pagingContainer, params);
            });
        else
            $con.find("#PageSize").die().live('change', function () {
                pageoption.params.callbackmethod(pageoption.pagingContainer, params);
            });
    }
    var DTO = pageoption.params.DTO;
    if ($dialog.find("#PageSize").val() != undefined)
        var items_per_page = $dialog.find("#PageSize").val();
    else
        var items_per_page = $con.find("#PageSize").val();
    var itemcontent = '';
    var take = items_per_page;
    var skip = page_index == 0 ? 0 : (page_index * take);
    DTO["skip"] = skip;
    DTO["take"] = take;
    var sort = pageoption.params.DTO.sort;
    var shop = pageoption.params.DTO.shop;
    var EmployeeName = pageoption.params.DTO.EmployeeName;
    var Barcode = pageoption.params.DTO.Barcode;
    var InvoiceDateStart = pageoption.params.DTO.InvoiceDateStart;
    var InvoiceDateEnd = pageoption.params.DTO.InvoiceDateEnd;
    var PriceFrom = pageoption.params.DTO.PriceFrom;
    var PriceTo = pageoption.params.DTO.PriceTo;
    var InvoiceNumber = pageoption.params.DTO.InvoiceNumber;
    $.ajax({
        data: $("form").serialize() + '&skip=' + skip + '&take=' + take + '&shop=' + shop + '&sort=' + sort + '&EmployeeName=' + EmployeeName +
                                      '&Barcode=' + Barcode + '&InvoiceDateStart=' + InvoiceDateStart +
                                      '&InvoiceDateEnd=' + InvoiceDateEnd + '&PriceFrom=' + PriceFrom + '&PriceTo=' + PriceTo +
                                      '&first=' + pageoption.first + '&InvoiceNumber=' + InvoiceNumber,
        //        data: JSON.stringify(pageoption.params.DTO),
        type: "Post",
        url: "/" + pageoption.params.servicename + "/" + pageoption.params.methodname,
        dataType: "json",
        success: function (response) {
            //            if (!isAuthenticated(response))
            //                return;
            if (response.count == 1 && pageoption.isOrder == true && pageoption.container != "") {
                pageoption.fname(null, pageoption.pagingContainer, response.results[0].Barcode);
            }
            else {
                if (page_index < 1 && pageoption.first) {
                    var opt = getPageOptions({ params: pageoption.params, count: response.count,
                        container: "", fname: pageoption.fname, pagingContainer: pageoption.pagingContainer,
                        callBackName: pageselectCallback
                    });
                    $dialog.find("#paging").pagination(response.count, opt);
                    pageoption.params.build(response, pageoption);
                    if (pageoption.container != "")
                        $dialog.dialog({ width: 650 }).dialog("open");

                }
                else
                    pageoption.params.build(response, pageoption);

                newSort(pageoption.params.callbackmethod, pageoption.pagingContainer, pageoption.params);
            }

        },
        error: function (response) { //alert(response.responseText); 
            response.responseText;
        }
    });
}
//
function getPageOptions(pageoption) {
    if (pageoption.container != "")
        var $con = $("#" + pageoption.container); //.find("#"+pageoption.container);
    else
        var $con = $("#" + pageoption.pagingContainer);
    var opt = { callback: pageoption.callBackName };
    $con.find("input:text").each(function () {
        opt[this.name] = this.className.match(/numeric/) ? parseInt(this.value) : this.value;
    });
    opt.prev_show_always = false;
    opt.next_show_always = false;
    if ((pageoption.count) < $con.find("#PageSize").val())
        $con.find("#PageSize").css("display", "none");
    else {
        $con.find("#PageSize").css("display", "inline");
    }
    opt.items_per_page = $con.find("#PageSize").val();
    //    opt.count = pageoption.count;
    opt.prev_text = "<<-قبلی";
    opt.next_text = "بعدی->>";
    opt.container = pageoption;
    return opt;
}
//Full Account
function buildFullAcountList(jq, container) {
    var $con = $("#shopBuy");
    var table = {};
    var lstb = [];
    var lsth = [];
    var details = {};
    lsth.push({ title: "تاریخ", width: "10%", sort: "Date" });
    lsth.push({ title: "شماره فاکتور", width: "11%", sort: "InvoiceNO" });
    lsth.push({ title: "شرح", width: "13%" });
    lsth.push({ title: "بستانکار", width: "12%", sort: "Amount" });
    lsth.push({ title: "بدهکار", width: "12%", sort: "Amount" });
    lsth.push({ title: "باقیمانده", width: "12%", sort: "Amount" });
    lsth.push({ title: "فروشگاه", width: "10%", sort: "inv_Shop.Name" });
    if (!container.params.print) {
        lsth.push({ title: "جزئیات و کالاها" });
    }
    var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
    var ItemList = "";
    if (List != null)
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            if (!container.params.print)
                trBody[0] = { trId: val.id, trName: val.detail };
            trBody[1] = { name: "date", html: val.date, width: "15%" };
            trBody[2] = { name: "InvoiceNO", html: val.InvoiceNO, width: "12%" };
            trBody[3] = { name: "description", html: "<span>" + val.inOrderOf + "</span>", width: "15%" };
            trBody[4] = { name: "Debtor", html: val.isSell == true ? val.amount : "", width: "10%" };
            trBody[5] = { name: "Creditor", html: val.isSell == true ? "" : "<span>" + val.amount + "</span>", width: "10%" };
            trBody[6] = { name: "balance", html: val.balance, width: "12%" };
            trBody[7] = { name: "shop", html: val.shopName == null ? "---" : val.shopName, width: "7%" };
            lstb.push(trBody);
        }
    table = { header: lsth, body: lstb, details: { detailsFunction: FullAcountDetails }, heigth: 300,
        container: "shopBuyTable", divName: "ordersInfo", hasFooter: false, servicename: "Account", methodname: "GetCurrentUserOrders",
        buildFunction: buildFullAcountList
    };
    $("#sumDebtor").html(jq.sumDebtor != null ? jq.sumDebtor : 0);
    $("#sumCreditor").html(jq.sumCreditor != null ? jq.sumCreditor : 0);
    $("#sumBalance").html(jq.balance != null ? Math.round(jq.balance, 1) : 0);
    $("#sumPayment").html(jq.sumPayment != null ? jq.sumPayment : 0);
    $("#sumReceive").html(jq.sumReceive != null ? jq.sumReceive : 0);
    buildTable(table);
}
//Full Account
function buildOnlineOrdersList(jq, container) {
    var $con = $("#onlineBuy");
    var table = {};
    var lstb = [];
    var lsth = [];
    var details = {};
    lsth.push({ title: "تاریخ", width: "15%", sort: "Date" });
    lsth.push({ title: "شماره فاکتور", width: "12%", sort: "InvoiceNO" });
    lsth.push({ title: "شرح", width: "25%" });
    lsth.push({ title: "مبلغ", width: "20%", sort: "Amount" });
    lsth.push({ title: "فروشگاه", width: "15%", sort: "inv_Shop.Name" });
    if (!container.params.print) {
        lsth.push({ title: "جزئیات و کالاها" });
    }
    var List = (typeof jq.results) == 'string' ? eval('(' + jq.results + ')') : jq.results;
    if (List.length > 0) {
        $("#accountDetails").removeClass("hidden");
    }
    else
        $("#accountDetails").addClass("hidden");
    var ItemList = "";
    if (List != null)
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            if (!container.params.print)
                trBody[0] = { trId: val.id, trName: val.detail };
            trBody[1] = { name: "date", html: val.date, width: "15%" };
            trBody[2] = { name: "InvoiceNO", html: val.InvoiceNO, width: "12%" };
            trBody[3] = { name: "description", html: "<span>" + val.inOrderOf + "</span>", width: "25%" };
            trBody[5] = { name: "Creditor", html: val.isSell == true ? "" : "<span>" + val.amount + "</span>", width: "20%" };
            trBody[7] = { name: "shop", html: val.shopName == null ? "---" : val.shopName, width: "15%" };
            lstb.push(trBody);
        }
    table = { header: lsth, body: lstb, details: { detailsFunction: OnlineOrderDetails }, heigth: 300,
        container: "onlineBuyTable", divName: "nOrdersInfo", hasFooter: false, servicename: "Account", methodname: "GetCurrentUserOnlineOrders",
        buildFunction: buildOnlineOrdersList
    };
    $("#sumNetCreditor").html(jq.sumDebtor);
    buildTable(table);
}
function FullAcountDetails(dis, container) {
    $con = $("#" + container);
    $dis = $(dis);
    //payment or Transfer
    $("#voucherDetailsList" + container + "," + "#DetailPaymentList" + container + "," + "#dialog" + container).dialog().dialog("close");
    if ($dis.parents("tr").attr("name") == "payment")
        ListDetailPayment($dis.parents("tr").prop("id").replace("tr", ""), container);
    //order
    else if ($dis.parents("tr").attr("name") == "order")
        SelectDetailInvoice($dis.parents("tr").prop("id").replace("tr", ""), container);
    //voucher
    else if ($dis.parents("tr").attr("name") == "voucher")
        VoucherDetailsFullAccount($dis.parents("tr").prop("id").replace("tr", ""), container);
}
function OnlineOrderDetails(dis, container) {
    $con = $("#" + container);
    $dis = $(dis);
    var $invoiceDetail = $("#onlineOrderDetails");
    var id = $dis.parents("tr").prop("id").replace("tr", "");
    $.ajax({
        type: "POST",
        url: "/Account/GetOnlineDetailInvoice",
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + id + "'}",
        success: function (response) {
            $("#receiverName").html(response.receiverName);
            $("#postType").html(response.postType);
            $("#dateTime").html(response.dateTime);
            $("#isgiftDescription").html(response.isgiftDescription);
            $("#phoneMobile").html(response.phoneMobile);
            $("#paymentType").html(response.paymentType);
            $("#receiverAddress").html(response.receiverAddress);
            $("#referenceId").html(response.referenceId);
            jq = response.d;
            var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
            var ItemList = "";
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                val.appName = val.appName == null ? "/" : val.appName;
                ItemList += "<tr id='tr" + val.OrderDetailId + "'>" +
                "<td name='name' id='" + val.BarcodeId + "' width='17%'><span class='cursor' name='subTab' menuName='a_InventoryList' id='" + val.BarcodeId + "'>" + (val.Barcode == null ? "" : val.Barcode + "_") + (val.Name == null ? "" : val.Name) + (val.Description == null ? "" : "_" + val.Description) + (val.ItemCode == null ? "" : "_" + val.ItemCode) + "</span></td>" +
                "<td name='Color' width='10%'><div id='Color'>" + (val.Color == null ? "" : val.Color) + "</div></td>" +
                "<td name='Size' width='10%'><div id='Size'>" + (val.Size == null ? "" : val.Size) + "</div></td>" +
                "<td name='Quantity' width='7%'><div id='Quantity'>" + (val.Quantity == null ? "" : val.Quantity) + "  " + (val.UnitType == null ? "" : val.UnitType) + "</div></td>" +
                "<td name='Price' width='10%'><div id='Price'>" + (val.Price == null ? "" : val.Price) + "</div></td>" +
                "<td name='TotalPrice' width='10%'><div id='TotalPrice'>" + (val.Quantity * val.Price) + "</div></td>" +
                 "<td name='Serial' width='10%'><div id='Serial'>" + (val.Serial == null ? "" : val.Serial) + "</div></td>" +
                "<td name='image' width='10%' ><img class='imagefortable' src='http://shirazrose.com/Data/" + val.appName + "Photos/" + val.Barcode + "/tiny_1.jpg'></td>" +
                "<tr>";
            }
            $invoiceDetail.find("#onlineDetailListInvoice").html(ItemList);
            $invoiceDetail.removeClass("invisible");
            $invoiceDetail.dialog({ width: 1000 }).dialog("open");
        },

        error: function (response) { alert(response.responseText); }
    });
}
function buildTable(tableData) {
    $con = $("#" + tableData.container);
    var heigth = 300;
    if (tableData.heigth != undefined)
        heigth = tableData.heigth;
    var table = "<table class='table'><thead><tr class='ui-state-default'>";
    var footer = "<tfoot><tr>"
    $.each(tableData.header, function () {
        if (tableData.hasFooter) {
            if (this.footer != undefined)
                footer += "<td " + (this.width != undefined ? ("width='" + this.width + "'") : " ") + ">" + this.footer + "</td>";
            else
                footer += "<td " + (this.width != undefined ? ("width='" + this.width + "'") : "") + "></td>";
        }
        if (this.sort != undefined) {
            var order = "";
            var sort = sortid.split(' ');
            if (sort[0] == this.sort)
                order = sort[1];
            table += "<td " + (this.width != undefined ? ("width='" + this.width + "'") : " ") + " ><a href='javascript:void(0);' id='" + this.sort + "' rel='sort' class='sorted " + order + "' >" + this.title + "</a></td>";
        }
        else
            table += "<td " + (this.width != undefined ? ("width='" + this.width + "'") : " ") + " ><span >" + this.title + "</span></td>";
    })
    table += "</tr></thead>";
    table += "<tbody>";
    var i = 0;
    $.each(tableData.body, function () {

        var id = this[0].trId;
        var trName = "";
        trName = this[0].trName;
        if (trName != "")
            table += "<tr name='" + trName + "' id='tr" + id + "'>";
        else
            table += "<tr id='tr" + id + "'>";
        $.each(this, function () {
            if (this.subId != undefined) {

                table += "<td " + (this.width != undefined ? "style='width:" + this.width + "'" : " ") + (this.tooltip != undefined ? "title='" + this.html : "") + "' name='" + this.name + "' ><span class='cursor' menuName='" + this.menuName + "' name='subTab' id='" + this.subId + "'>" + (this.tooltip == undefined ? this.html : this.html.substring(0, this.tooltip) + "...") + "</span></td>";
            }
            else if (this.trId == undefined && this.props == undefined) {
                if (this.id != undefined)
                    table += "<td " + (this.width != undefined ? "style='width:" + this.width + "'" : " ") + (this.tooltip != undefined ? "title='" + this.html : "") + "' name='" + this.name + "' id='" + this.id + "'>" + (this.tooltip == undefined ? this.html : this.html.substring(0, this.tooltip) + "...") + "</td>";
                else if (this.id == undefined)
                    table += "<td " + (this.width != undefined ? "style='width:" + this.width + "'" : " ") + (this.tooltip != undefined ? "title='" + this.html : "") + "' name='" + this.name + "'>" + (this.tooltip == undefined ? this.html : this.html.substring(0, this.tooltip) + "...") + "</td>";
            }
            //            else if (this.props != undefined) {
            //                var strName;
            //                var props = "";
            //                var oObject = this.props;
            //                for (strName in oObject) {
            //                    props += " " + (strName == "klass" ? "Class" : strName) + "='" + oObject[strName] + "' ";
            //                }
            //                table += "<td " + props + "'>" + (oObject.tooltip == undefined ? this.html : this.html.substring(0, oObject.tooltip) + "...") + "</td>";
            //            }

        });
        if (tableData.details.editFunction != undefined) {
            table += "<td style='text-align: center!important;'><button id='btnEdit'>ویرایش</button>";
        }
        //        else if (tableData.details.deleteFunction != undefined)
        //            table += "<td>";
        //Delete Button
        if (tableData.details.deleteFunction != undefined)
            table += "<td id='delete' style='text-align: center!important;'><button id='btnDelete'>حذف</button></td>";
        //Details Button
        if (tableData.details.detailsFunction != undefined)
            table += "<td style='text-align: center!important;'><button id='btnDetails'>جزئیات</button></td>";
        else
            table += "</td>";
        table += "</tr>";
        i++;
    });
    table += "</tbody>";
    if (tableData.hasFooter) {
        table += footer;
        table += "</tr></tfoot>";
    }
    table += "</table>";
    $con.find("#" + tableData.divName).html(table)
    //    if (tableData.width != undefined) {
    //        $con.find("#" + tableData.divName).html(table).find("table").tableScroll({ height: heigth, width: tableData.width, flush: false });
    //    }
    //    else {
    //        $con.find("#" + tableData.divName).html(table).find("table").tableScroll({ height: heigth, width: contentwidth, flush: false });
    //    }

    //    $con.find("[name=subTab]").unbind().click(function () {
    //        var $d = $(this);
    //        createSubTab({ name: $d.attr("menuName"), tabName: $d.html(), id: $d.attr("id") });
    //    });

    $con.find("[id=btnEdit]").button({
        icons: {
            primary: "ui-icon-pencil"
        },
        text: false
    }).unbind().click(function () {
        var d = this;
        tableData.details.editFunction(this, tableData.container);
    });

    $con.find("[id=btnDelete]").button({
        icons: {
            primary: "ui-icon-closethick"
        },
        text: false
    }).unbind().click(function () {
        var d = this;
        tableData.details.deleteFunction($(this).parents("tr").attr("id").replace("tr", ""), tableData.container);
    });

    $con.find("[id=btnDetails]").button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: false
    }).unbind().click(function () {
        var d = this;
        tableData.details.detailsFunction(this, tableData.container);
    });

    $con.find("[id=btnConfirm]").button({
        icons: {
            primary: "ui-icon-check"
        },
        text: false
    }).unbind().click(function () {
        var d = this;
        tableData.details.confirmFunction(this, tableData.container);
    });

    if (tableData.details != undefined) {
        if (tableData.details.rowClick != undefined) {
            $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
                tableData.details.rowClick($(this).parent("tr"), tableData.container.replace("dialog", ""));
            }).addClass("cursor");
        }
    }
    newSort(getFullAcountList, tableData.container, { container: tableData.container, callbackmethod: getFullAcountList, fname: "", page_index: 0,
        build: tableData.buildFunction, servicename: tableData.servicename, methodname: tableData.methodname, print: false
    });
}

function ListDetailPayment(OrderHeaderId, container) {
    var $con = $("#" + container);
    $DetailPaymentList = $("#DetailPaymentList");
    $.ajax({
        data: $("form").serialize() + '&OrderHeaderId=' + OrderHeaderId,
        dataType: "json",
        type: "Post",
        url: "/Account/GetDetailPaymentList",
        success: function (response) {
            //            if (!isAuthenticated(response))
            //                return;
            var List = (typeof response) == 'string' ? eval('(' + response.dp[0] + ')') : response.dp[0];
            var ItemCash = "";
            for (var i = 0; i < List.cash.length; i++) {
                var val = List.cash[0, i];
                if (val.Amount > 0) {
                    ItemCash += "<tr id='tr" + val.CashId + "'>" +
                "<td width='50%' name='PaymentNO' >" + val.Amount + "  " + val.Currency + "</td>" +
                "<td width='40%'>" + val.Type + "</td></tr>";
                }
            };
            $DetailPaymentList.find("#CashList").html(ItemCash);
            if (ItemCash != "") {
                $DetailPaymentList.find("#tablecash").removeClass("invisible");
            }
            else {
                $DetailPaymentList.find("#tablecash").addClass("invisible");
            }
            ItemCheque = "";
            for (var i = 0; i < List.cheque.length; i++) {
                var val = List.cheque[0, i];
                if (val.Amount > 0) {
                    ItemCheque += "<tr id='tr" + val.ChequeId + "'>" +
                "<td name='PaymentNO' width='20%'>" + val.Amount + "  " + val.Currency + "</td>" +
                "<td  width='20%'>" + val.Bank + "</td>" +
                "<td  width='15%'>" + val.Serial + "</td>" +
                "<td id='status'  width='15%'>" + val.Passed + "</td>" +
                "<td  width='20%'>" + val.Date + "</td></tr>";
                }
            }
            $DetailPaymentList.find("#ChequeList").html(ItemCheque);
            if (ItemCheque != "") {
                $DetailPaymentList.find("#tablecheque").removeClass("invisible");
            }
            else {
                $DetailPaymentList.find("#tablecheque").addClass("invisible");
            }
            $DetailPaymentList.dialog({ width: '300px' }).dialog('open');
        },
        error: function (response) { alert(response.responseText); }
    });
}

function SelectDetailInvoice(id, container) {
    var $con = $("#" + container);
    var $invoiceDetail = $("#dialog");
    $.ajax({
        type: "POST",
        url: "/Account/GetDetailInvoice",
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + id + "'}",

        success: function (response) {
            //            if (!isAuthenticated(response))
            //                return;
            jq = response.d;
            var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
            var ItemList = "";
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                val.appName = val.appName == null ? "/" : val.appName;
                ItemList += "<tr id='tr" + val.OrderDetailId + "'>" +
                "<td name='name' id='" + val.BarcodeId + "' width='17%'><span class='cursor' name='subTab' menuName='a_InventoryList' id='" + val.BarcodeId + "'>" + (val.Barcode == null ? "" : val.Barcode + "_") + (val.Name == null ? "" : val.Name) + (val.Description == null ? "" : "_" + val.Description) + (val.ItemCode == null ? "" : "_" + val.ItemCode) + "</span></td>" +
                "<td name='Color' width='10%'><div id='Color'>" + (val.Color == null ? "" : val.Color) + "</div></td>" +
                "<td name='Size' width='10%'><div id='Size'>" + (val.Size == null ? "" : val.Size) + "</div></td>" +
                "<td name='Quantity' width='7%'><div id='Quantity'>" + (val.Quantity == null ? "" : val.Quantity) + "  " + (val.UnitType == null ? "" : val.UnitType) + "</div></td>" +
                "<td name='Price' width='10%'><div id='Price'>" + (val.Price == null ? "" : val.Price) + "</div></td>" +
                "<td name='TotalPrice' width='10%'><div id='TotalPrice'>" + (val.Quantity * val.Price) + "</div></td>" +
                 "<td name='Serial' width='10%'><div id='Serial'>" + (val.Serial == null ? "" : val.Serial) + "</div></td>" +
                "<td name='image' width='10%' ><img class='imagefortable' src='http://shirazrose.com/Data/" + val.appName + "Photos/" + val.Barcode + "/tiny_1.jpg'></td>" +
                "<tr>";
            }
            $invoiceDetail.find("#DetailListInvoice").html(ItemList);

            //            $invoiceDetail.find("[name=subTab]").unbind().click(function () {
            //                var $d = $(this);
            //                createSubTab({ name: $d.attr("menuName"), tabName: $d.html(), id: $d.attr("id") });
            //            });
            // $con.find("#DetailListInvoice").parent().tableScroll({ height: 380 });
            //  TableAlter(container);
            //   $con.find("input[id*=Checkbox]").button();
            //            $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
            //                ClickDetailInvoice($(this).parent("tr"), container);
            //            }).addClass("cursor");
            // $con.find("#DetailListInvoice")
            //            $("#VoucherDetailList").dialog("close");
            //            $("#transferMoney").dialog("close");
            //            $("#DetailPaymentList").dialog("close");
            $invoiceDetail.removeClass("invisible");
            $invoiceDetail.dialog({ width: 1000 }).dialog("open");
        },

        error: function (response) { alert(response.responseText); }
    });
}
//Full Account
function VoucherDetailsFullAccount(orderHeaderId, container) {
    $con = $("#" + container);
    var $dialog = $("#voucherDetailsList");
    $.ajax({
        type: "POST",
        url: "/Account/GetVoucherDetailsFullAccount",
        contentType: "application/json; charset=utf-8",
        data: "{orderHeaderId: '" + orderHeaderId + "'}",
        success: function (response) {
            //            if (!isAuthenticated(response))
            //                return;
            jq = response.d;
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
                "<td name='IsValid' width='20%'>" + "<span id='voucherStatus'>" + val.IsValid + "</span></td>" +
                "<td name='ExpieryDate' width='20%'><div id='ExpieryDate'>" + val.ExpieryDate + "</div></td>" +
                "<td name='Amount' width='20%'><div id='Amount'>" + val.Amount + "</div></td>" +
                "</tr>";
            }
            $dialog.find("#DetailListVoucher").html(ItemList);
            $dialog.removeClass("invisible");
            $dialog.dialog({ width: 800 }).dialog("open");
        },
        error: function (response) { alert(response.responseText); }
    });
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
//Add Product To Basket
//function aComplete(options, data) {
//    var id = '#' + options.id;
//    $(id).autocomplete({
//        source: function (request, response) {
//            var DTO = { 'q': request.term };
//            if (options.data != undefined) {
//                var strName;
//                var oObject = options.data;
//                for (strName in oObject) {
//                    if (strName == "propertyId") {
//                        DTO[strName] = getHierarchySelectedValue(oObject[strName], options.container);
//                    }
//                    else
//                        DTO[strName] = oObject[strName];
//                }
//            }
//            $.ajax({
//                url: "/" + options.servicename + "/" + options.methodname,
//                data: JSON.stringify(DTO),
//                dataType: "json",
//                type: "POST",
//                contentType: "application/json; charset=utf-8",
//                success: function (data) {
//                    if (data.length > 0)
//                        response(data);
//                }
//            });
//        },
//        focus: function (event, ui) {
//            $("#" + options.boxId).val(ui.item.value);
//            return false;
//        },
//        select: function (event, ui) {
//            $("#" + options.boxId).val(ui.item.value);
//            if (options.fname != undefined)
//                options.fname(event, ui, options.container);
//            return false;
//        },
//        minLength: options.minlength,
//        autoFocus: options.autofocus
//    });
//}
function tableStyle() {
    $('.tablescroll').addClass("red");
    $("tbody tr").addClass("ui-state-default");
    $("tbody tr").mouseover(function () { $(this).addClass("ui-state-hover"); });
    $("tbody tr").mouseout(function () { $(this).removeClass("ui-state-hover"); });
}
function SetCheckboxes() {
    var offer = getParameterByName("isOffer") == "true" ? true : false;
    var sale = getParameterByName("isSale") == "true" ? true : false;
    var isnew = getParameterByName("isNew") == "true" ? true : false;
    $("#isOffer").attr("checked", offer);
    $("#isSale").attr("checked", sale);
    $("#isNew").attr("checked", isnew);
}

function bindDropDownList(data, Id, name) {
    var $select = "";
    if (Id != null)
        $select = $("#" + Id);
    else if (name != null)
        $select = $("[name=" + name + "]");
    $.ajax({
        type: "POST",
        url: "/" + data.controller + "/" + data.method,
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.isdone) {
                if (data.defaultText != undefined)
                    $select.html("<option value=''>" + data.defaultText + "</option>");
                var options = response.options;
                for (var i = 0; i < options.length; i++) {
                    var val = options[i];
                    $select.append("<option value='" + val.value + "'>" + val.title + "</option>");
                }
                if (data.selectedval != undefined) {
                    $select.val(data.selectedval);
                    BindProvinceCities(null, data.name, $select.val());
                }
            }
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}