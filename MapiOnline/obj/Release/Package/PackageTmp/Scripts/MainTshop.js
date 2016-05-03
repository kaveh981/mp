$(document).ajaxStart(function () {
    loadingStart();
})
$(document).ajaxStop(function () {
    loadingEnd();
});


$(document).ready(function () {
    $("#btn_SignUp").off().on('click', function () {
        SignUp();
    });
    ShowShoppingCartSummery();


    $('#Frm_Tshop').ajaxForm({
        success: function (response) {
            if (response.isdone)
                location.reload(true);
        },
        complete: function (xhr) {

        }
    });
})

$(document).ajaxStop(function () {
    loadingEnd();
    $("[name=delete]").unbind().click(function () {
        var shopdetailId = $(this).attr("id");
        DeleteShoppingDetail(shopdetailId);
    });


});

function SignUp() {
    if (
    //validateAll($("#Frm_SignUp")) && 
    $("#password").val() == $("#repassword").val()) {
        $("#Frm_SignUp").attr("action", "/Home/register");
        $('#Frm_SignUp').ajaxForm({
            data: { returnUrl: window.location.href },
            success: function (response) {
                location.reload(true);
            },
            complete: function (xhr) {

            }
        });
    }
    else {
        $("#Frm_SignUp").attr("action", "");
        alert("Not valid");
    }

}


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
                if ((color == null || color.length == 0) && (size == null || size.length == 0))
                    imgtodrag = $this.parents("[name=proBox]").find("#img" + barcodeId).find(".img-responsive");
                else
                    imgtodrag = $this.parents("[name=proBox]").find(".sp-large").find(".img-responsive");
                if (imgtodrag.length > 0) {
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
                                    'top': 590,
                                    'right': cart.offset().left,
                                    'width': 75,
                                    'height': 75
                                }, 1000, 'easeInOutExpo');

                    //                    setTimeout(function () {
                    //                        cart.effect("shake", {
                    //                            times: 2
                    //                        }, 200);
                    //                    }, 1500);

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
            //            }
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}


function ShowShoppingCartSummery() {
    $.ajax({ type: 'POST',
        url: "/Shopping/ShoppingCartSummary",
        success: function (response) {
            $("#cartBody").html("");
            if (response.isdone) {
                $("#SubtotalAmount").html(response.totalAmount);
                $("#cart-total").html( "("+response.totalAmount+")" );
                if (response.details.length > 0) {
                    for (var i = 0; i < response.details.length; i++) {
                        var val = response.details[i];
                        var item = '<tr class="miniCartProduct" id="tr"' + val.Barcode + '>' +
                                    '<td style="20%" class="miniCartProductThumb">' +
                                        '<div>' +
                                            '<a href="product-details.html">' +
                                               "<img src='../../../Data/" + (val.ApplicationName == "/" ? "" : val.ApplicationName) + "Photos/" + val.Barcode + "/tiny_1.jpg' alt='" + val.Name + "' title='" + val.Name + "' >" +

                                           ' </a>' +
                                        '</div>' +
                                   ' </td>' +
                                   ' <td style="40%">' +
                                        '<div class="miniCartDescription">' +
                                           ' <h4>' +
                                              '  <a href="product-details.html">' + val.Name + ' </a>' +
                                           ' </h4>' +
                                            '<span class="size">' + ((val.Size != null && val.Size != "" ? val.Size : "") + (val.Color != null && val.Color != "" ? ((val.Size != null && val.Size) ? " / " : "") + val.Color : "")) + ' </span>' +
                                           ' <div class="price">' +
                                               ' <span>' + val.Price + '  </span>' +
                        ' </div>' +
                                        '</div>' +
                                    '</td>' +
                                    '<td style="10%" class="miniCartQuantity">' +
                        ' <a>X ' + val.Quantity + ' </a>' +
                        ' </td>' +
                        ' <td style="15%" class="miniCartSubtotal">' +
                        ' <span>' + val.TotalPrice + ' </span>' +
                        ' </td>' +
                        '<td style="5%" class="delete" name="delete"  id="' + val.ShoppingCartDetailsId + '">' +
                        '  <a> x </a>' +
                        '</td>' +
                        ' </tr>';
                        $("#cartBody").append(item);
                    }
                    $("#shopcart").trigger('mouseover');
                    $("#shopcart").trigger('mouseenter');

                    $("#shopcart").trigger('hover');

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


function SetTotalQuantity($tr) {
    $.ajax({
        type: "POST",
        url: "/Shopping/GetTotalQuantity",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if ($tr != undefined && $tr != null)
                $tr.find("#totalItemAmount").html(($tr.find("#itemprice").html() * 1 * $tr.find("[name=quanitySniper]").val() * 1));
            $("#totalAmount").html(response.totalAmount);
            $("#itemCatrQuantity").html(response.quantity);
            //            $("#SubtotalAmount").html(response.discount);
            $("#total-price").html(response.finalAmount);
            $("#sendExpense").html(response.deliveryExpense);

        },
        error: function (response) {
            alert("خطا در ذخیره تعداد کالا، لطفاً دوباره تلاش کنید.")
        }
    });
}

function LoadShoppingCart() {
    //    bindDropDownList({ controller: "Shopping", method: "GetProvinces", selectedval: "2", name: "city", defaultText: "---" }, "province", null);
    //    $("#province").unbind().change(function () {
    //        BindProvinceCities("city", "city", $('#province').val());
    //    });
    //    BindProvinceCities(null, "city", "2");
    //    $.ajax({
    //        type: "POST",
    //        url: "/Home/GetCurrShamsiDatePlusDay",
    //        contentType: "application/json; charset=utf-8",
    //        success: function (response) {
    //            if (response.isdone) {
    //                $("#txt_dateSend").datepicker({ changeMonth: true, changeYear: true, onClose: function () { validateAll($("#newRecieverInfo")) } });
    //                $("#txt_dateSend").datepicker('option', 'minDate', response.currShamsi);
    //            }
    //            else
    //                alert(response.msg)
    //        },
    //        error: function (response) {
    //        }
    //    });

    //    $("#onlinePayment").attr("checked", true);
    //    $("#onlinePaymentDesc").removeClass("hidden");
    //    $("input[name=paymenttype]").unbind().change(function () {
    //        if ($(this).attr("id") == "onlinePayment") {
    //            $("#onlinePaymentDesc").removeClass("hidden");
    //            $("#payToCartDesc").addClass("hidden");
    //            $("#payAfterReceiveDesc").addClass("hidden");
    //        }
    //        else if ($(this).attr("id") == "payToCart") {
    //            $("#onlinePaymentDesc").addClass("hidden");
    //            $("#payToCartDesc").removeClass("hidden");
    //            $("#payAfterReceiveDesc").addClass("hidden");
    //        }
    //        else if ($(this).attr("id") == "payAfterReceive") {
    //            $("#onlinePaymentDesc").addClass("hidden");
    //            $("#payToCartDesc").addClass("hidden");
    //            $("#payAfterReceiveDesc").removeClass("hidden");
    //        }
    //    });

    //    $("#btn_confirmOrder").unbind().click(function () {
    //        if ((validateAll($("#newRecieverInfo")) && $("#newSenderInfo").hasClass("hidden")) ||
    //                   (validateAll($("#newRecieverInfo")) && !$("#newSenderInfo").hasClass("hidden") && validateAll($("#newSenderInfo")))) {
    //            if ($("input[id=myself]").is(":checked")) {
    //                if ($("input[id=female]").is(":checked") == false && $("input[id=male]").is(":checked") == false) {
    //                    alert("جنسیت را انتخاب کنید.");
    //                    return;
    //                }
    //            }
    //            else if ($("input[id=others]").is(":checked")) {
    //                if ($("input[id=sfemale]").is(":checked") == false && $("input[id=smale]").is(":checked") == false) {
    //                    alert("جنسیت را انتخاب کنید.");
    //                    return;
    //                }
    //            }
    //            $("#btn_confirmOrder").parents("form").get(0).submit();
    //        }
    //    });

    //    $("tr[name=shopDetailtr]").each(function () {
    //        if ($(this).find("select[name=colors]").length > 0 && $(this).find("select[name=colors]").attr("id").replace("color", "") != "")
    //            $(this).find("select[name=colors]").val($(this).find("select[name=colors]").attr("id").replace("color", ""));
    //        if ($(this).find("select[name=sizes]").length > 0 && $(this).find("select[name=sizes]").attr("id").replace("size", "") != "")
    //            $(this).find("select[name=sizes]").val($(this).find("select[name=sizes]").attr("id").replace("size", ""));
    //        if ($(this).find("select[name=quantity]").length > 0 && $(this).find("select[name=quantity]").html() != "") {
    //            $(this).find("select[name=quantity]").val($(this).find("select[name=quantity]").attr("id").replace("quantity", ""));
    //        }
    //    });
    //    $("[name=colors]").unbind().change(function () {
    //        SetItemDetailSizeAndQuantity($(this));
    //    });
    //    $("[name=sizes]").unbind().change(function () {
    //        SetItemDetailQuantityForSize($(this));
    //    });

    //   
    //    $("#btn_fastSubmitShoppingCart").unbind().click(function () {
    //        var haswarning = false;
    //        $("#myself").attr("checked", true);
    //        $("#txt_giftnote").val("");
    //        $("#isGift").attr("checked", false);
    //        $("#gift").attr("checked", false);
    //        $("#giftInfoTr").addClass("hidden");
    //        $("#recGender").removeClass("hidden");
    //        $("#female").addClass("required");
    //        $("#male").addClass("required");
    //        $("[name=sendto]").unbind().change(function () {
    //            if ($(this).attr("id") == "myself") {
    //                $("#newSenderInfo").addClass("hidden");
    //                $("#recGender").removeClass("hidden");
    //                $("#srecGender").addClass("hidden");
    //                $("#female").addClass("required");
    //                $("#male").addClass("required");
    //                $("#sfemale").removeClass("required");
    //                $("#smale").removeClass("required");
    //                $("#txt_giftnote").val("");
    //                $("#isGift").attr("checked", false);
    //                $("#gift").attr("checked", false);
    //                $("#giftInfoTr").addClass("hidden");
    //            }
    //            else {
    //                $("#newSenderInfo").removeClass("hidden");
    //                $("#recGender").addClass("hidden");
    //                $("#srecGender").removeClass("hidden");
    //                $("#sfemale").addClass("required");
    //                $("#smale").addClass("required");
    //                $("#female").removeClass("required");
    //                $("#male").removeClass("required");
    //                $("#giftInfoTr").removeClass("hidden");
    //            }
    //        });
    //        $("tr[name=shopDetailtr]").each(function () {
    //            if ($(this).find("select[name=colors]").val() == "" && $(this).find("select[name=colors]").find("option").length > 1) {
    //                haswarning = true;
    //                if (!$(this).hasClass("warning"))
    //                    $(this).addClass("warning");
    //            }
    //            if ($(this).find("select[name=sizes]").val() == "" && $(this).find("select[name=sizes]").find("option").length > 1) {
    //                haswarning = true;
    //                if (!$(this).hasClass("warning"))
    //                    $(this).addClass("warning");
    //            }
    //            if ($(this).find("select[name=quantity]").val() == "0" && $(this).find("select[name=quantity]").find("option").length > 1) {
    //                haswarning = true;
    //                if (!$(this).hasClass("warning"))
    //                    $(this).addClass("warning");
    //            }
    //            if ($(this).find("select[name=quantity]").find("option").length <= 1 && $(this).find("#subscrQuantity").length == 0
    //                                && $(this).find("select[name=colors]").find("option").length <= 1 &&
    //                                    $(this).find("select[name=sizes]").find("option").length <= 1) {
    //                var shopdetailId = $(this).find("[name=delete]").attr("id");
    //                //  alert(shopdetailId);
    //                DeleteShoppingDetail(shopdetailId);
    //            }
    //            if (!haswarning)
    //                $(this).removeClass("warning");
    //        });
    //        if (haswarning) {
    //            alert("تعداد کالا صحیح نمی باشد.");
    //            return;
    //        }
    //        $("#btn_fastSubmitShoppingCart").addClass("hidden");
    //        $("#btn_submitShoppingCart").addClass("hidden");
    //        $("#login").addClass("hidden");
    //        $("#notLoggedOptions").removeClass("hidden");
    //        $("#receiverInfo").removeClass("hidden");
    //        //        bindHierarchyData({ id: "Address", container: "parent", table: "Address", css: "required validate" });
    //    });
    //    $("#btn_submitShoppingCart").unbind().click(function () {
    //        var haswarning = false;
    //        $("tr[name=shopDetailtr]").each(function () {
    //            if ($(this).find("select[name=colors]").val() == "" && $(this).find("select[name=colors]").find("option").length > 1) {
    //                haswarning = true;
    //                if (!$(this).hasClass("warning"))
    //                    $(this).addClass("warning");
    //            }
    //            if ($(this).find("select[name=sizes]").val() == "" && $(this).find("select[name=sizes]").find("option").length > 1) {
    //                haswarning = true;
    //                if (!$(this).hasClass("warning"))
    //                    $(this).addClass("warning");
    //            }
    //            if ($(this).find("select[name=quantity]").val() == "0" && $(this).find("select[name=quantity]").find("option").length > 1) {
    //                haswarning = true;
    //                if (!$(this).hasClass("warning"))
    //                    $(this).addClass("warning");
    //            }
    //            if ($(this).find("select[name=quantity]").find("option").length <= 1 && $(this).find("#subscrQuantity").length == 0
    //                                && $(this).find("select[name=colors]").find("option").length <= 1 &&
    //                                    $(this).find("select[name=sizes]").find("option").length <= 1) {
    //                var shopdetailId = $(this).find("[name=delete]").attr("id");
    //                //  alert(shopdetailId);
    //                DeleteShoppingDetail(shopdetailId);
    //            }
    //            if (!haswarning)
    //                $(this).removeClass("warning");
    //        });
    //        if (haswarning) {
    //            alert("تعداد کالا صحیح نمی باشد.");
    //            return;
    //        }
    //        $.ajax({
    //            type: "POST",
    //            async: false,
    //            url: "/Shopping/CurrentUserInfo",
    //            contentType: "application/json; charset=utf-8",
    //            success: function (response) {
    //                if (response.islogin == true) {
    //                    if (response.userInfo == undefined) {
    //                        alert(msg);
    //                        return;
    //                    }
    //                    else {
    //                        $("#btn_fastSubmitShoppingCart").addClass("hidden");
    //                        $("#btn_submitShoppingCart").addClass("hidden");
    //                        $("#receiverInfo").removeClass("hidden");
    //                        $("#login").addClass("hidden");
    //                        $("#receiverInfo").removeClass("hidden");
    //                        //                        bindHierarchyData({ id: "Address", container: "parent", table: "Address", parentid: response.userInfo.AddressId, css: "required validate" });
    //                        $("#txt_name").val(response.userInfo.Name != null ? response.userInfo.Name : "");
    //                        $("#txt_family").val(response.userInfo.Family != null ? response.userInfo.Family : "");
    //                        $("#txt_address").val(response.userInfo.Address != null ? response.userInfo.Address : "");
    //                        $("#txt_tell").val(response.userInfo.phone);
    //                        $("#txt_mobile").val(response.userInfo.mobile);
    //                        $("#txt_postcode").val(response.userInfo.PostalCode != null ? response.userInfo.PostalCode : "");

    //                        $("#province").val(response.userInfo.provinceId);
    //                        BindProvinceCities(null, "city", response.userInfo.provinceId, response.userInfo.AddressId);

    //                        $("#logonedSendToOthers").removeClass("hidden");
    //                        $("#userMyself").attr("checked", true);
    //                        $("#giftInfoTr").addClass("hidden");
    //                        $("#logonedSendToOthers").find("[name=userSendto]").unbind().change(function () {
    //                            if ($(this).attr("id") == "userMyself") {
    //                                $("#giftInfoTr").addClass("hidden");
    //                                //
    //                                $.ajax({
    //                                    type: "POST",
    //                                    async: false,
    //                                    url: "/Shopping/CurrentUserInfo",
    //                                    contentType: "application/json; charset=utf-8",
    //                                    success: function (response) {
    //                                        if (response.islogin == true) {
    //                                            if (response.userInfo == undefined) {
    //                                                alert(msg);
    //                                                return;
    //                                            }
    //                                            else {
    //                                                $("#btn_fastSubmitShoppingCart").addClass("hidden");
    //                                                $("#btn_submitShoppingCart").addClass("hidden");
    //                                                $("#receiverInfo").removeClass("hidden");
    //                                                $("#login").addClass("hidden");
    //                                                $("#receiverInfo").removeClass("hidden");
    //                                                $("#txt_name").val(response.userInfo.Name != null ? response.userInfo.Name : "");
    //                                                $("#txt_family").val(response.userInfo.Family != null ? response.userInfo.Family : "");
    //                                                $("#txt_address").val(response.userInfo.Address != null ? response.userInfo.Address : "");
    //                                                $("#txt_tell").val(response.userInfo.phone);
    //                                                $("#txt_mobile").val(response.userInfo.mobile);
    //                                                $("#txt_postcode").val(response.userInfo.PostalCode != null ? response.userInfo.PostalCode : "");

    //                                                $("#province").val(response.userInfo.provinceId);
    //                                                BindProvinceCities(null, "city", response.userInfo.provinceId, response.userInfo.AddressId);

    //                                                validateAll($("#newRecieverInfo"));
    //                                                $("#txt_giftnote").val("");
    //                                                $("#isGift").attr("checked", false);
    //                                                $("#gift").attr("checked", false);

    //                                            }
    //                                        }
    //                                    }
    //                                });
    //                                //
    //                            }
    //                            else {
    //                                $("#giftInfoTr").removeClass("hidden");
    //                                $("#newRecieverInfo").find("input[type=text]").each(function () {
    //                                    $(this).val("");
    //                                });
    //                                $("#newRecieverInfo").find("input[type=checkbox]").each(function () {
    //                                    $(this).attr("checked", false);
    //                                });
    //                                $("#newRecieverInfo").find("textarea").each(function () {
    //                                    $(this).val("");
    //                                });
    //                            }
    //                        });
    //                    }
    //                }
    //                else {
    //                    $("#btn_fastSubmitShoppingCart").addClass("hidden");
    //                    $("#btn_submitShoppingCart").addClass("hidden");
    //                    $("#login").removeClass("hidden");
    //                }
    //            },
    //            error: function (response) {
    //                alert(response.responseText);
    //            }
    //        });
    //    });
    //    $("#btnLogin").unbind().click(function () {
    //        var DTO = { 'username': $("[name=UserName]").val(), 'password': $("[name=Password]").val() };
    //        $.ajax({
    //            type: "POST",
    //            url: "/Shopping/Login",
    //            contentType: "application/json; charset=utf-8",
    //            data: JSON.stringify(DTO),
    //            success: function (response) {
    //                if (response.userInfo == undefined) {
    //                    alert(response.msg);
    //                    return;
    //                }
    //                else {
    //                    $("#login").addClass("hidden");
    //                    $("#receiverInfo").removeClass("hidden");
    //                    //                    bindHierarchyData({ id: "Address", container: "parent", table: "Address", parentid: response.userInfo.AddressId, css: "required validate" });
    //                    $("#txt_name").val(response.userInfo.Name != null ? response.userInfo.Name : "");
    //                    $("#txt_family").val(response.userInfo.Family != null ? response.userInfo.Family : "");
    //                    $("#txt_address").val(response.userInfo.Address != null ? response.userInfo.Address : "");
    //                    $("#txt_tell").val(response.userInfo.phone);
    //                    $("#txt_mobile").val(response.userInfo.mobile);
    //                    $("#txt_postcode").val(response.userInfo.PostalCode != null ? response.userInfo.PostalCode : "");

    //                    $("#province").val(response.userInfo.provinceId);
    //                    BindProvinceCities(null, "city", response.userInfo.provinceId, response.userInfo.AddressId);

    //                    $("#logonedSendToOthers").removeClass("hidden");
    //                    $("#userMyself").attr("checked", true);
    //                    $("#giftInfoTr").addClass("hidden");
    //                    $("#logonedSendToOthers").find("[name=userSendto]").unbind().change(function () {
    //                        if ($(this).attr("id") == "userMyself") {
    //                            $("#giftInfoTr").addClass("hidden");
    //                            //
    //                            $.ajax({
    //                                type: "POST",
    //                                async: false,
    //                                url: "/Shopping/CurrentUserInfo",
    //                                contentType: "application/json; charset=utf-8",
    //                                success: function (response) {
    //                                    if (response.islogin == true) {
    //                                        if (response.userInfo == undefined) {
    //                                            alert(msg);
    //                                            return;
    //                                        }
    //                                        else {
    //                                            $("#btn_fastSubmitShoppingCart").addClass("hidden");
    //                                            $("#btn_submitShoppingCart").addClass("hidden");
    //                                            $("#receiverInfo").removeClass("hidden");
    //                                            $("#login").addClass("hidden");
    //                                            $("#receiverInfo").removeClass("hidden");
    //                                            $("#txt_name").val(response.userInfo.Name != null ? response.userInfo.Name : "");
    //                                            $("#txt_family").val(response.userInfo.Family != null ? response.userInfo.Family : "");
    //                                            $("#txt_address").val(response.userInfo.Address != null ? response.userInfo.Address : "");
    //                                            $("#txt_tell").val(response.userInfo.phone);
    //                                            $("#txt_mobile").val(response.userInfo.mobile);
    //                                            $("#txt_postcode").val(response.userInfo.PostalCode != null ? response.userInfo.PostalCode : "");

    //                                            $("#province").val(response.userInfo.provinceId);
    //                                            BindProvinceCities(null, "city", response.userInfo.provinceId, response.userInfo.AddressId);

    //                                            validateAll($("#newRecieverInfo"));
    //                                            $("#txt_giftnote").val("");
    //                                            $("#isGift").attr("checked", false);
    //                                            $("#gift").attr("checked", false);

    //                                        }
    //                                    }
    //                                }
    //                            });
    //                            //
    //                        }
    //                        else {
    //                            $("#giftInfoTr").removeClass("hidden");
    //                            $("#newRecieverInfo").find("input[type=text]").each(function () {
    //                                $(this).val("");
    //                            });
    //                            $("#newRecieverInfo").find("input[type=checkbox]").each(function () {
    //                                $(this).attr("checked", false);
    //                            });
    //                            $("#newRecieverInfo").find("textarea").each(function () {
    //                                $(this).val("");
    //                            });
    //                        }
    //                    });
    //                }
    //            },
    //            error: function (response) {
    //                alert(response.responseText);
    //            }
    //        });
    //    });
    //    $("[name=Register]").unbind().click(function () {
    //        bindDropDownList({ controller: "Shopping", method: "GetProvinces", selectedval: "2", name: "regCity", defaultText: "---" }, "regProvince", null);
    //        $("#regProvince").unbind().change(function () {
    //            BindProvinceCities("regCity", "regCity", $('#regProvince').val());
    //        });
    //        BindProvinceCities(null, "regCity", "2");
    //        $("#registerForm").removeClass("hidden");
    //        $("#login").addClass("hidden");
    //    });
    //    $("[id=sendMemberCode]").unbind().click(function () {
    //        $("[name=mobileForsms]").val($.trim($("[name=mobileForsms]").val()));
    //        if ($("[name=mobileForsms]").val() == "") {
    //            $("#sendCodeResult").html("شماره موبایل را وارد کنید.");
    //            return;
    //        }
    //        var DTO = { 'mobile': $("[name=mobileForsms]").val() };
    //        $.ajax({ type: 'POST',
    //            url: "/Account/sendMemberCodeToMobile",
    //            contentType: "application/json; charset=utf-8",
    //            data: JSON.stringify(DTO),
    //            success: function (response) {
    //                $("#sendCodeResult").html(response.msg);
    //            },
    //            error: function (response) {
    //                alert(response.responseText);
    //            }
    //        });
    //    });
    //    $("[name=StartRegisterByCode]").unbind().click(function () {
    //        $("#login").addClass("hidden");
    //        $("#completeRegisterationForm").removeClass("hidden");
    //    });
    //    $("#StartRegisterByCode").unbind().click(function () {
    //        $("#completeRegisterationForm").addClass("hidden");
    //        StartCompleteRegisteration();
    //    });
    //    $("#addPhone").unbind().click(function () {
    //        if (validateAll($("[name=regPhone]").parent("td"))) {
    //            $("[name=regPhone]").val($.trim($("[name=regPhone]").val()));
    //            if ($("[name=regPhone]").val() != "") {
    //                $("#phones").append("<li style='margin:3px;width:120px; float:right; ' class='ui-state-default ui-corner-top' ><a id=delete name='smsItems' style='float:right' class='ui-icon ui-icon-close'>حذف</a><label name='num' class='ui-tabs-anchor' >" + $("[name=regPhone]").val() + "</label></li>")
    //                $("#phones").find("span[name=msg]").addClass("invisible");
    //                $("[id=delete]").addClass("cursor").unbind().click(function () {
    //                    $(this).parents("li").remove();
    //                });
    //            }
    //        }
    //    });
    $(".glyphicon-trash").unbind().click(function () {
        DeleteShoppingDetail($(this).parents('td').attr('id'));
        $($(this)).parents("tr").remove();

    });

    $("input[name='quanitySniper']").unbind().change(function () {
        var row = $(this).parents('tr');
        checkQuantity(row);
    });
    //    $("#addMobile").unbind().click(function () {
    //        if (validateAll($("[name=regMobile]").parent("td"))) {
    //            $("[name=regMobile]").val($.trim($("[name=regMobile]").val()));
    //            if ($("[name=regMobile]").val() != "") {
    //                $("#mobiles").append("<li style='margin:3px;width:120px; float:right; ' class='ui-state-default ui-corner-top' ><a id=delete name='smsItems' style='float:right' class='ui-icon ui-icon-close'>حذف</a><label name='num' class='ui-tabs-anchor' >" + $("[name=regMobile]").val() + "</label></li>")
    //                $("#mobiles").find("span[name=msg]").addClass("invisible");
    //                $("[id=delete]").addClass("cursor").unbind().click(function () {
    //                    $(this).parents("li").remove();
    //                });
    //            }
    //        }
    //    });
    //    $("[id=delete]").addClass("cursor").unbind().click(function () {
    //        $(this).parents("li").remove();
    //    });
    //    $("#btn_register").unbind().click(function () {
    //        RegisterFromShoppingCart();
    //    });
    //    $("#onlinePayment").attr('checked', true);
    SetTotalQuantity();
}

function checkQuantity(row) {
    var DTO = { 'shopdetailId': row.attr('id'), 'quantity': row.find("[name=quanitySniper]").val(), 'colorId': null, 'sizeId': null };
    $.ajax({
        type: "POST",
        url: "/Shopping/EditShoppingCartDetail",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (response.isdone == true) {
                SetTotalQuantity(row);

            }
            else
                alert(response.msg);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

//-----------------PRoduct Details begin---------------------

//-------------------Product Detail End---------------------