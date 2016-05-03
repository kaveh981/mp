function AddToShoppingCart(barcodeId, count, size, color, $this) {
    var DTO = { 'barcodeId': barcodeId, 'count': count, 'sizeId': size, 'colorId': color };
    $.ajax({
        type: "POST",
        url: "/Shopping/AddToShoppingCart",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (response.hascolorsize) {
                window.location = "../Home/ProductDetails?productId=" + barcodeId + "&technicalInfo=general";
            }
            else if (response.totalQuantity * 1 > 0) {

                var cart = $('#shoppingCart');
                var imgtodrag = "";
                if ($this.parents("[name=itemContainer]").find("#img" + barcodeId).find(".productImg").length > 0)
                    imgtodrag = $this.parents("[name=itemContainer]").find("#img" + barcodeId).find(".productImg").eq(0);
                else
                    imgtodrag = $('.addToCart').parents('.news_box_left').find("#zoom_03").eq(0);
                if (imgtodrag) {
                    var imgclone = imgtodrag.clone()
                .offset({
                    top: imgtodrag.offset().top,
                    left: imgtodrag.offset().left
                })
                .css({
                    'opacity': '0.5',
                    'position': 'absolute',
                    'height': '150px',
                    'width': '150px',
                    'z-index': '100'
                })
                .appendTo($('body'))
                .animate({
                    'top': cart.offset().top + 140,
                    'left': cart.offset().left + 140,
                    'width': 75,
                    'height': 75
                }, 1000, 'easeInOutExpo');

                    setTimeout(function () {
                        cart.effect("shake", {
                            times: 2
                        }, 200);
                    }, 1500);

                    imgclone.animate({
                        'width': 0,
                        'height': 0
                    }, function () {
                        $(this).detach()
                    });
                }
                ShowShoppingCartSummery();
                setTimeout("window.scrollTo(0, " + 0 + ")", 800);
            }
            else
                alert("این تعداد از کالای انتخاب شده موجود نمی باشد.");
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}


function SetTotalQuantity($tr) {
    $.ajax({
        type: "POST",
        url: "/Shopping/GetTotalQuantity",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            $("#cart-total").html(response.quantity);
            $("#itemsCount").html(response.quantity + " کالا, " + response.finalAmount + " تومان");
            if ($tr != undefined && $tr != null)
                $tr.find("[name=totalPrice]").html($tr.find("[name=onePrice]").html() * 1 * $tr.find("[name=quantity]").val() * 1);
            if ($("[id=totalAmount]").length > 0) {
                $("#itemsCount").html(response.quantity + " کالا, " + response.finalAmount + " تومان");
                $("[id=totalAmount]").html(response.totalAmount);
                $("[id=discount]").html(response.discount);
                $("[id=finalAmount]").html(response.finalAmount);
            }
        },
        error: function (response) {
            alert("خطا در ذخیره تعداد کالا، لطفاً دوباره تلاش کنید.")
        }
    });
}


function ShowShoppingCartSummery() {
    $.ajax({ type: 'POST',
        url: "/Shopping/ShoppingCartSummary",
        success: function (response) {
            $("#cartBody").html("");
            if (response.isdone) {
                if (response.details.length > 0) {
                    for (var i = 0; i < response.details.length; i++) {
                        var val = response.details[i];
                        $("#cartBody").append("<tr><td class='image'>"
                       + "<a href='../Home/ProductDetails?productId=" + val.BarcodeId + "'>"
                       + "<img src='../../../Data/" + (val.ApplicationName == "/" ? "" : val.ApplicationName) + "Photos/" + val.Barcode + "/tiny_1.jpg' alt='" + val.Name + "' title='" + val.Name + "' style='width:47px; height:47px;'></a></td>"
                       + "<td class='name'>"
                        + "<a href='#'>" + val.Name + "</a>"
                       + "<div></div><span class='quantity'>x</span><span class='quantity'> " + val.Quantity + " " + val.UnitType + "</span><span class='total'> " + val.Price + "<span> تومان</span></span> </td>"
                       + " <td class='remove'><span>"
                       + "<img  title='Remove' name='delete' id='" + val.ShoppingCartDetailsId + "' alt='Remove' src='../../Content/Green/image/close.png'></span></td>"
                       + "</tr>");

                    }
                    $("#cart-total").html(response.quantity);
                    $("#itemsCount").html(response.quantity + " کالا, " + response.finalAmount + " تومان");
                    $("[id=totalAmount]").html(response.totalAmount);
                    $("[id=discount]").html(response.discount);
                    $("[id=finalAmount]").html(response.finalAmount);
                    $(".linkShopBag").removeClass("hidden");


                }
                else {
                    $("#shoppingCartDetails").append("سبد خرید خالی است.");
                    $(".linkShopBag").addClass("hidden");
                }
            }
            else {
                $("#shoppingCartDetails").append(response.msg);
                $(".linkShopBag").addClass("hidden");
            }
            $("#shoppingCartSumm").removeClass("hidden");
        },
        dataType: "json"
    });
}

function CheckShoppingCart() {
    $.ajax({ type: 'POST',
        url: "/Shopping/CheckShoppingCart",
        success: function (response) {
            if (response.result != undefined && response.result == true)
                $(".finishOrder").removeClass("hidden");
            else
                $(".finishOrder").addClass("hidden");
        },
        dataType: "json",
        error: function (response) {
            alert(response.responseText);
        }
    });
}
function DeleteShoppingDetail(shopdetailId) {
    var DTO = { 'shopdetailId': shopdetailId };
    $.ajax({
        type: "POST",
        url: "/Shopping/DeleteShoppingCartDetail",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (response.isdone == true) {
                if (response.cartDeleted)
                    window.location = "../Home/Index";
                else {
                    $("#" + shopdetailId).parents("tr").remove();
                    SetTotalQuantity();
                }
            }
            else
                alert(response.msg);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

function SetCustomizedBouquetTotalPrice() {
    var totalprice = 0;
    var bouquetDesc = "";
    var flwSelected = "";
    var decSelected = "";
    $("#decorationDiv").find("[name=proBox]").each(function () {
        if ($(this).find("input[name=decoration]").attr("checked")) {
            totalprice = totalprice * 1 + $(this).find("[name=decpriceSpan]").html() * 1;
            bouquetDesc = $(this).parents("td").find("#hDecName").html();
            decSelected = $(this).parents("td").find("#hDecName").html();
        }
    });
    bouquetDesc += " (";
    $("#flowersDiv").find("[name=proBox]").each(function () {
        totalprice = totalprice * 1 + $(this).find("[name=priceSpan]").html() * 1 * $(this).find("[name=countDdl]").val() * 1;
        if ($(this).find("[name=countDdl]").val() > 0) {
            bouquetDesc += " تعداد " + $(this).find("[name=countDdl]").val() + " شاخه " + $(this).parents("td").find("#hFlowerName").html() + ".";
            flwSelected += " تعداد " + $(this).find("[name=countDdl]").val() + " شاخه " + $(this).parents("td").find("#hFlowerName").html() + ".";
        }
    });
    bouquetDesc += " )";
    $("[id=bouquetDesc]").html(bouquetDesc != " ( )" ? bouquetDesc : "موردی انتخاب نشده است.");
    $("[id=bouquetprice]").html(totalprice);
    $("[id=selectedFlwSpan]").html(flwSelected != "" ? flwSelected : "موردی انتخاب نشده است.");
    $("[id=selectedDecSpan]").html(decSelected != "" ? decSelected : "موردی انتخاب نشده است.");
}
function addCustomizedBouquetToBasket() {
    var flowerslist = [];
    var decorationId = "";
    var flowerSelected = "";
    $("#flowersDiv").find("[name=proBox]").each(function () {
        var flowerInfo = {};
        if ($(this).find("[name=countDdl]").val() > 0) {
            flowerSelected = "yes";
            //product id
            flowerInfo["productId"] = $(this).find("[name=priceSpan]").attr("id").replace("qprice", "");
            //product quality
            $("input[name=Qualities" + flowerInfo["productId"] + "]").each(function () {
                if ($(this).attr("checked")) {
                    flowerInfo["quality"] = $(this).attr("id").replace("Quality", "");
                }
            });
            //product count
            flowerInfo["count"] = $(this).find("[name=countDdl]").val();
            //product price
            flowerInfo["price"] = $(this).find("[name=priceSpan]").html();
            flowerslist.push(flowerInfo);
        }
    });
    $("[name=decoration]").each(function () {
        if ($(this).attr("checked")) {
            decorationId = $(this).attr("id").replace("decoration", "");
        }
    });
    if (flowerSelected == "yes" && decorationId != "") {
        var DTO = { 'flowerslist': flowerslist, 'decorationId': decorationId };
        $.ajax({
            type: "POST",
            url: "/Flower/AddCustomizedBouquetToShopCart",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (response.totalQuantity > 0) {
                    ShowShoppingCartSummery();
                    $("[name=countDdl]").val("0");
                    $("input[name=decoration]").attr("checked", false);
                    $("#bouquetprice").html("0");
                    $("#bouquetDesc").html(" ( )");
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }
    else {
        var alertMsg = "";
        if (flowerSelected != "yes" && decorationId == "")
            alertMsg = "تزیین و شاخه گل های دسته گل را انتخاب کنید.";
        else if (flowerSelected != "yes")
            alertMsg = "شاخه گل های دسته گل را انتخاب کنید.";
        else if (decorationId == "")
            alertMsg = "تزیین دسته گل را انتخاب کنید.";
        alert(alertMsg);
    }
}


// *************** FlowerSubscription Begin *********************
function loadFlowerSubscription() {
    $("input[id=Quality2]").each(function () {
        $(this).attr("checked", true);
        $(this).parents("div[name=proBox]").find("[name=itemprice]").html($(this).attr("value"));
    });
    $("input[id*=Quality]").unbind().change(function () {
        if ($(this).is(":checked")) {
            $(this).parents("div[name=proBox]").find("[name=itemprice]").html($(this).attr("value"));
        }
    });
    //
    $.ajax({
        type: "POST",
        url: "/Home/GetCurrShamsiDatePlusDay",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.isdone) {
                $("#txtDateFrom").datepicker({ changeMonth: true, changeYear: true,
                    onSelect: function (dateText, inst) {
                        $('#txtDateTo').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'] + 1, inst['selectedDay']));
                    }
                    , onClose: function () { SetSubscriptionTotalPriceDesc(); }
                });
                $("#txtDateFrom").datepicker('option', 'minDate', response.currShamsi);
                $("#txtDateTo").datepicker({ changeMonth: true, changeYear: true
                    , onClose: function () { SetSubscriptionTotalPriceDesc(); }
                });
            }
            else
                alert(response.msg)
        },
        error: function (response) {
        }
    });

    $("#tblDays").find("input[type=checkbox]").unbind().change(function () {
        SetSubscriptionTotalPriceDesc();
    });
    //
    SetSubscriptionTotalPriceDesc();
    $("[name=countDdl]").unbind().change(function () {
        SetSubscriptionTotalPriceDesc();
    });
    $("#btnSave").unbind().click(function () {
        addFlowerSubscriptionToShoppingCart()
    });
}
function SetSubscriptionTotalPriceDesc() {
    var totalprice = 0;
    var subscriptionDesc = "";
    $("#flowersDiv").find("[name=proBox]").each(function () {
        if ($(this).find("[name=countDdl]").val() > 0) {
            totalprice = totalprice * 1 + $(this).find("[name=itemprice]").html() * $(this).find("[name=countDdl]").val() * 1;
        }
        if ($(this).find("[name=countDdl]").val() > 0) {
            subscriptionDesc += " تعداد " + $(this).find("[name=countDdl]").val() + " شاخه " + $(this).parents("td").find("#hFlowerName").html();
            $(this).parents("td").find("input[id*=Quality]").each(function () {
                if ($(this).is(":checked"))
                    subscriptionDesc += ($(this).attr("id").replace("Quality", "") == 1 ? " درجه 1 " : ($(this).attr("id").replace("Quality", "") == 2 ? " درجه 2 " : " درجه 3 "));
            });
            subscriptionDesc += ". ";
        }
    });
    var daysCount = SetFlowerSubscriptionTotalAmount();
    totalprice = (totalprice * 1) * (daysCount * 1);
    $("#subscriptionDesc").html(subscriptionDesc);
    $("#subscriptionPrice").html(totalprice);
    $("#daysCount").html(daysCount);
}
function addFlowerSubscriptionToShoppingCart() {
    var flowerslist = [];
    var flowerSelected = "";
    $("#flowersDiv").find("[name=proBox]").each(function () {
        var flowerInfo = {};
        if ($(this).find("[name=countDdl]").val() > 0) {
            flowerSelected = "yes";
            //product id
            flowerInfo["productId"] = $(this).find("[name=itemprice]").attr("id").replace("qprice", "");
            //product quality
            $("input[name=Qualities" + flowerInfo["productId"] + "]").each(function () {
                if ($(this).attr("checked")) {
                    //                    flowerInfo["quality"] = $(this).attr("id").replace("Quality", "");
                    flowerInfo["sizeId"] = $(this).attr("sizeId").replace("sizeId", "");
                }
            });
            //product count
            flowerInfo["count"] = $(this).find("[name=countDdl]").val();
            //product price
            flowerInfo["price"] = $(this).find("[name=itemprice]").html();
            flowerslist.push(flowerInfo);
        }
    });
    var days = [];
    $("#tblDays").find("input[type=checkbox]").each(function () {
        if ($(this).is(":checked")) {
            days.push($(this).attr("id"));
        }
    });
    if (flowerSelected == "yes" && $.trim($("#txtDateFrom").val()) != "" && $.trim($("#txtDateTo").val()) != "" && days.length > 0) {
        var DTO = { 'flowerslist': flowerslist, 'daysArr': days, 'startStr': $.trim($("#txtDateFrom").val()), 'endStr': $.trim($("#txtDateTo").val()) };
        $.ajax({
            type: "POST",
            url: "/Flower/AddFlowerSubscriptionToShoppingCart",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (response.totalQuantity > 0) {
                    ShowShoppingCartSummery();
                    $("#subscriptionDesc").html("");
                    $("#subscriptionPrice").html("0");
                    $("#daysCount").html("0");
                    $("[name=countDdl]").val("0");
                    $("#tblDays").find("input[type=checkbox]").attr("checked", false);
                    $("#txtDateFrom").val("");
                    $("#txtDateTo").val("");
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }
    else {
        var alertMsg = "";
        if (flowerSelected != "yes" && $.trim($("#txtDateFrom").val()) == "" && $.trim($("#txtDateTo").val()) == "" && days.length == 0)
            alertMsg = "شاخه گل ها و تاریخ و روزهای اشتراک را انتخاب کنید.";
        else if (flowerSelected != "yes" && ($.trim($("#txtDateFrom").val()) != "" && $.trim($("#txtDateTo").val()) != "" && days.length > 0))
            alertMsg = "شاخه گل ها را انتخاب کنید.";
        else if (flowerSelected == "yes" && ($.trim($("#txtDateFrom").val()) == "" || $.trim($("#txtDateTo").val()) == "" || days.length == 0))
            alertMsg = "تاریخ و روزهای اشتراک را انتخاب کنید.";
        alert(alertMsg);
    }
}
function SetFlowerSubscriptionTotalAmount() {
    if ($.trim($("#txtDateFrom").val()) != "" && $.trim($("#txtDateTo").val()) != "") {
        var days = [];
        $("#tblDays").find("input[type=checkbox]").each(function () {
            if ($(this).is(":checked")) {
                days.push($(this).attr("id"));
            }
        });
        if (days != undefined && days.length > 0)
            return CountDays(days, $.trim($("#txtDateFrom").val()), $.trim($("#txtDateTo").val()));
    }
    return 0;
}
function CountDays(days, start, end) {
    var DTO = { 'daysArr': days, 'startStr': start, 'endStr': end }
    var count = 0;
    $.ajax({
        type: "POST",
        async: false,
        url: "/Flower/CountDays",
        contentType: 'application/json;',
        dataType: 'json',
        data: JSON.stringify(DTO),
        success: function (response) {
            if (response.isdone) {
                count = response.count;
            }
            else {
                count = 0;
            }
        },
        error: function (response) { alert(response.responseText); }
    });
    return count;
}
function Register() {
    $("#Name").val($.trim($("#Name").val()));
    $("#Family").val($.trim($("#Family").val()));
    $("#AddressStr").val($.trim($("#AddressStr").val()));
    $("#Email").val($.trim($("#Email").val()));
    if ($("#phones").find("li").length > 0) {
        $("[name=Phone]").removeClass("required");
        $("[name=Phone]").removeClass("validate");
    }
    else {
        if ($("[name=Phone]").hasClass("required"))
            $("[name=Phone]").addClass("required");
        if ($("[name=Phone]").hasClass("validate"))
            $("[name=Phone]").addClass("validate");
    }
    if ($("#mobiles").find("li").length > 0) {
        $("[name=Mobile]").removeClass("required");
        $("[name=Mobile]").removeClass("validate");
    }
    else {
        if ($("[name=Mobile]").hasClass("required"))
            $("[name=Mobile]").addClass("required");
        if ($("[name=Mobile]").hasClass("validate"))
            $("[name=Mobile]").addClass("validate");
    }
    if (!validateAll($("#registerForm")))
        return;
    var isvalid = true;
    if ($("#phones").find("li").length == 0) {
        if ($.trim($("input[name=Phone]").val()) != "") {
            $("#addPhone").click();
        }
        else {
            if ($("#phones").find("span[name=msg]").length > 0)
                $("#phones").find("span[name=msg]").removeClass("invisible");

            else
                $("#phones").append("<span name='msg' style='color: #FF0000'>ثبت شماره تلفن ضروری می باشد.</span>")
            isvalid = false;
        }
    }
    if ($("#mobiles").find("li").length == 0) {
        if ($.trim($("input[name=Mobile]").val()) != "") {
            $("#addMobile").click();
        }
        else {
            if ($("#mobiles").find("span[name=msg]").length > 0)
                $("#mobiles").find("span[name=msg]").removeClass("invisible");

            else
                $("#mobiles").append("<span name='msg' style='color: #FF0000'>ثبت شماره موبایل ضروری می باشد.</span>")
            isvalid = false;
        }
    }
    //
    if (!isvalid) {
        $("#result").html("پر کردن موارد ستاره دار ضروری است. لطفاً اطلاعات خواسته شده را کامل و صحیح وارد کنید.");
        return;
    }
    else
        $("#result").html("");
    var phoneNums = [];
    var mobNums = [];
    $("#phones").find("label[name=num]").each(function () {
        phoneNums.push($(this).html());
    });
    $("#mobiles").find("label[name=num]").each(function () {
        mobNums.push($(this).html());
    });
    $.ajax({ type: 'POST',
        url: "/Account/Register",
        data: $("form").serialize() + '&phones=' + phoneNums + '&mobiles=' + mobNums,
        success: function (response) {
            if (response.logged)
                window.location.replace(response.link);
            else
                $("#result").html(response.msg);
        },
        dataType: "json"
    });
}
function AddMobile() {
    if (validateAll($("[name=Mobile]").parent("td"))) {
        $("[name=Mobile]").val($.trim($("[name=Mobile]").val()));
        if ($("[name=Mobile]").val() != "") {
            $("#mobiles").append("<li style='margin:3px;width:120px; float:right; ' class='ui-state-default ui-corner-top' ><a id=delete name='smsItems' style='float:right' class='ui-icon ui-icon-close'>حذف</a><label name='num' class='ui-tabs-anchor' >" + $("[name=Mobile]").val() + "</label></li>")
            $("#mobiles").find("span[name=msg]").addClass("invisible");
            $("[id=delete]").addClass("cursor").unbind().click(function () {
                $(this).parents("li").remove();
            });
        }
    }
}
// *************** FlowerSubscription End *********************
