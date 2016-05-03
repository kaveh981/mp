

//-------------Global Variable begin------------------
var sortid;
//-------------Global Variable end------------------

$(document).ajaxStart(function () {
    loadingStart();
})
$(document).ajaxStop(function () {
    loadingEnd();
    $("[name=delete]").unbind().click(function () {
        var shopdetailId = $(this).attr("id");
        DeleteShoppingDetail(shopdetailId);
    });
});


$(document).ready(function () {


//    aComplete({ methodname: "GetCompletionListByItemName", servicename: "Management", id: "txt_Search", container: "searchBox", minlength: 2, autofocus: false, limit: 10, boxId: "txt_Search" });
    // hide #back-top first
    $("#back-top").hide();

    // fade in #back-top
    $(function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 500) {
                $('#back-top').fadeIn();
            } else {
                $('#back-top').fadeOut();
            }
        });

        // scroll body to 0px on click
        $('#back-top a').click(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
    })
    $('.box-category li').last().addClass('last');


    $.ajax({
        type: "POST",
        url: "/Home/TodayDate",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.isdone) {
                $("#date").find("span").html(response.date);
            }
        },
        error: function (response) {
        }
    });
    $("input[name=culture]").click(function () {
        $(this).parents("form").submit(); // apply by posting form
    });

    // highlight selected language
    $("input[name=culture]:checked").next().css("font-weight", "bold");

    $(".nav-menu li").unbind().click(function () {
        var id = $(this).find("a").attr("id");
        $(this).parents("ul").find("li").each(function () {
            if ($(this).find("a").attr("id") != id)
                $(this).find("a").removeClass("active");
        });
        $(this).find("a").addClass("active");
    });

    //    aComplete({ methodname: "GetCompletionListByItemName", servicename: "Home", id: "txtSearch", minlength: 2, autofocus: false, limit: 10, boxId: "txtSearch" });
    //            SetTotalQuantity();
    $("#shoppingCart").unbind().click(function () {
        ShowShoppingCartSummery();
    });
    $("#continue").click(function () {
        $("#shoppingCartSumm").addClass("hidden");
    });
    //            $("#btnSearchProduct").button();
    //            $("#txtSearch").css("margin-right", $("#catSpan").width() * 1 + 15);
    //            $("#txtSearch").width(($(window).width() * 38.5 / 100) - $("#catSpan").width() - 100);
    //             SetCheckboxes();
    $("#isNew").unbind().change(function () {
        var catId = getParameterByName("categoryId");
        var txtsearch = getParameterByName("txtSearch");
        var offer = getParameterByName("isOffer");
        var sale = getParameterByName("isSale");
        if ($(this).is(":checked"))
            window.location = "../Home/GetCategoryItems?categoryId=" + catId + "&txtSearch=" + txtsearch + "&isNew=true&isOffer=" + offer + "&isSale=" + sale;
        else
            window.location = "../Home/GetCategoryItems?categoryId=" + catId + "&txtSearch=" + txtsearch + "&isNew=false&isOffer=" + offer + "&isSale=" + sale;
    });
    $("#isSale").unbind().change(function () {
        var catId = getParameterByName("categoryId");
        var txtsearch = getParameterByName("txtSearch");
        var offer = getParameterByName("isOffer");
        var isnew = getParameterByName("isNew");
        if ($(this).is(":checked"))
            window.location = "../Home/GetCategoryItems?categoryId=" + catId + "&txtSearch=" + txtsearch + "&isNew=" + isnew + "&isOffer=" + offer + "&isSale=true";
        else
            window.location = "../Home/GetCategoryItems?categoryId=" + catId + "&txtSearch=" + txtsearch + "&isNew=" + isnew + "&isOffer=" + offer + "&isSale=false";
    });
    $("#isOffer").unbind().change(function () {
        var catId = getParameterByName("categoryId");
        var txtsearch = getParameterByName("txtSearch");
        var sale = getParameterByName("isSale");
        var isnew = getParameterByName("isNew");
        if ($(this).is(":checked"))
            window.location = "../Home/GetCategoryItems?categoryId=" + catId + "&txtSearch=" + txtsearch + "&isNew=" + isnew + "&isOffer=true&isSale=" + sale;
        else
            window.location = "../Home/GetCategoryItems?categoryId=" + catId + "&txtSearch=" + txtsearch + "&isNew=" + isnew + "&isOffer=false&isSale=" + sale;
    });
    $("#top_nav").find("li[name=menu]").each(function () {
        $(this).find("a").click(function () {
            MenuClick($(this));
        });
    });
    $(".button-search").unbind().click(function () {
        $(this).parent('form').submit();
    });
});

function loadingStart() {
    $("#plzwait").removeClass("hidden");
    $("#spinner").show();
}

function loadingEnd() {
    $("#spinner").removeClass("ui-state-active").hide();
    $("#plzwait").addClass("hidden");
}
//function bindDropDownList(data, Id, name) {
//    var $select = "";
//    if (Id != null)
//        $select = $("#" + Id);
//    else if (name != null)
//        $select = $("[name=" + name + "]");
//    $.ajax({
//        type: "POST",
//        url: "/" + data.controller + "/" + data.method,
//        contentType: "application/json; charset=utf-8",
//        success: function (response) {
//            if (response.isdone) {
//                if (data.defaultText != undefined)
//                    $select.html("<option value=''>" + data.defaultText + "</option>");
//                var options = response.options;
//                for (var i = 0; i < options.length; i++) {
//                    var val = options[i];
//                    $select.append("<option value='" + val.value + "'>" + val.title + "</option>");
//                }
//                if (data.selectedval != undefined) {
//                    $select.val(data.selectedval);
//                    BindProvinceCities(null, data.name, $select.val());
//                }
//            }
//        },
//        error: function (response) {
//            alert(response.responseText);
//        }
//    });
//}

function BindProvinceCities(Id, name, provinceCode, selectedval) {
    var $select = "";
    if (Id != null)
        $select = $("#" + Id);
    else if (name != null)
        $select = $("[name=" + name + "]");
    $.ajax({
        type: "POST",
        async: false,
        url: "/Shopping/ProvinceCities",
        data: "{provinceCode:'" + provinceCode + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.isdone) {
                $select.html("<option value=''>---</option>");
                var options = response.options;
                for (var i = 0; i < options.length; i++) {
                    var val = options[i];
                    $select.append("<option value='" + val.value + "'>" + val.title + "</option>");
                }
                if (selectedval != undefined && selectedval != null)
                    $select.val(selectedval);
            }
        },
        error: function (response) {
            //            alert(response.responseText);
        }
    });
}

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
function buildFullAcountList(jq, container) {
    var $con = $("#shopBuy");
    var table = {};
    var lstb = [];
    var lsth = [];
    var details = {};
    lsth.push({ title: "تاریخ", width: "10%", sort: "Date" });
    lsth.push({ title: "شماره فاکتور", width: "15%", sort: "InvoiceNO" });
    lsth.push({ title: "شرح", width: "13%" });
    lsth.push({ title: "بستانکار", width: "12%", sort: "Amount" });
    lsth.push({ title: "بدهکار", width: "12%", sort: "Amount" });
    lsth.push({ title: "باقیمانده", width: "12%", sort: "Amount" });
    lsth.push({ title: "فروشگاه", width: "10%", sort: "inv_Shop.Name" });
    if (!container.params.print) {
        lsth.push({ title: "جزئیات" });
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
    lsth.push({ title: "شماره فاکتور", width: "15%", sort: "InvoiceNO" });
    lsth.push({ title: "شرح", width: "25%" });
    lsth.push({ title: "مبلغ", width: "20%", sort: "Amount" });
    lsth.push({ title: "فروشگاه", width: "15%", sort: "inv_Shop.Name" });
    if (!container.params.print) {
        lsth.push({ title: "جزئیات" });
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
                "<td name='image' width='10%' ><img class='imagefortable' src='../Data/" + val.appName + "Photos/" + val.Barcode + "/tiny_1.jpg'></td>" +
                "<tr>";
            }
            $invoiceDetail.find("#onlineDetailListInvoice").html(ItemList);
            $invoiceDetail.removeClass("invisible");
            $invoiceDetail.dialog({ width: 1000 }).dialog("open");
        },

        error: function (response) { alert(response.responseText); }
    });
}
//function buildTable(tableData) {
//    $con = $("#" + tableData.container);
//    var heigth = 300;
//    if (tableData.heigth != undefined)
//        heigth = tableData.heigth;
//    var table = "<table class='table'><thead><tr class='ui-state-default'>";
//    var footer = "<tfoot><tr>"
//    $.each(tableData.header, function () {
//        if (tableData.hasFooter) {
//            if (this.footer != undefined)
//                footer += "<td " + (this.width != undefined ? ("width='" + this.width + "'") : " ") + ">" + this.footer + "</td>";
//            else
//                footer += "<td " + (this.width != undefined ? ("width='" + this.width + "'") : "") + "></td>";
//        }
//        if (this.sort != undefined) {
//            var order = "";
//            var sort = sortid.split(' ');
//            if (sort[0] == this.sort)
//                order = sort[1];
//            table += "<td " + (this.width != undefined ? ("width='" + this.width + "'") : " ") + " ><a href='javascript:void(0);' id='" + this.sort + "' rel='sort' class='sorted " + order + "' >" + this.title + "</a></td>";
//        }
//        else
//            table += "<td " + (this.width != undefined ? ("width='" + this.width + "'") : " ") + " ><span >" + this.title + "</span></td>";
//    })
//    table += "</tr></thead>";
//    table += "<tbody>";
//    var i = 0;
//    $.each(tableData.body, function () {

//        var id = this[0].trId;
//        var trName = "";
//        trName = this[0].trName;
//        if (trName != "")
//            table += "<tr name='" + trName + "' id='tr" + id + "'>";
//        else
//            table += "<tr id='tr" + id + "'>";
//        $.each(this, function () {
//            if (this.subId != undefined) {

//                table += "<td " + (this.width != undefined ? "style='width:" + this.width + "'" : " ") + (this.tooltip != undefined ? "title='" + this.html : "") + "' name='" + this.name + "' ><span class='cursor' menuName='" + this.menuName + "' name='subTab' id='" + this.subId + "'>" + (this.tooltip == undefined ? this.html : this.html.substring(0, this.tooltip) + "...") + "</span></td>";
//            }
//            else if (this.trId == undefined && this.props == undefined) {
//                if (this.id != undefined)
//                    table += "<td " + (this.width != undefined ? "style='width:" + this.width + "'" : " ") + (this.tooltip != undefined ? "title='" + this.html : "") + "' name='" + this.name + "' id='" + this.id + "'>" + (this.tooltip == undefined ? this.html : this.html.substring(0, this.tooltip) + "...") + "</td>";
//                else if (this.id == undefined)
//                    table += "<td " + (this.width != undefined ? "style='width:" + this.width + "'" : " ") + (this.tooltip != undefined ? "title='" + this.html : "") + "' name='" + this.name + "'>" + (this.tooltip == undefined ? this.html : this.html.substring(0, this.tooltip) + "...") + "</td>";
//            }
//            //            else if (this.props != undefined) {
//            //                var strName;
//            //                var props = "";
//            //                var oObject = this.props;
//            //                for (strName in oObject) {
//            //                    props += " " + (strName == "klass" ? "Class" : strName) + "='" + oObject[strName] + "' ";
//            //                }
//            //                table += "<td " + props + "'>" + (oObject.tooltip == undefined ? this.html : this.html.substring(0, oObject.tooltip) + "...") + "</td>";
//            //            }

//        });
//        if (tableData.details.editFunction != undefined) {
//            table += "<td style='text-align: center!important;'><button id='btnEdit'>ویرایش</button>";
//        }
//        //        else if (tableData.details.deleteFunction != undefined)
//        //            table += "<td>";
//        //Delete Button
//        if (tableData.details.deleteFunction != undefined)
//            table += "<td id='delete' style='text-align: center!important;'><button id='btnDelete'>حذف</button></td>";
//        //Details Button
//        if (tableData.details.detailsFunction != undefined)
//            table += "<td style='text-align: center!important;'><button id='btnDetails'>جزئیات</button></td>";
//        else
//            table += "</td>";
//        table += "</tr>";
//        i++;
//    });
//    table += "</tbody>";
//    if (tableData.hasFooter) {
//        table += footer;
//        table += "</tr></tfoot>";
//    }
//    table += "</table>";
//    $con.find("#" + tableData.divName).html(table)
//    //    if (tableData.width != undefined) {
//    //        $con.find("#" + tableData.divName).html(table).find("table").tableScroll({ height: heigth, width: tableData.width, flush: false });
//    //    }
//    //    else {
//    //        $con.find("#" + tableData.divName).html(table).find("table").tableScroll({ height: heigth, width: contentwidth, flush: false });
//    //    }

//    //    $con.find("[name=subTab]").unbind().click(function () {
//    //        var $d = $(this);
//    //        createSubTab({ name: $d.attr("menuName"), tabName: $d.html(), id: $d.attr("id") });
//    //    });

//    $con.find("[id=btnEdit]").button({
//        icons: {
//            primary: "ui-icon-pencil"
//        },
//        text: false
//    }).unbind().click(function () {
//        var d = this;
//        tableData.details.editFunction(this, tableData.container);
//    });

//    $con.find("[id=btnDelete]").button({
//        icons: {
//            primary: "ui-icon-closethick"
//        },
//        text: false
//    }).unbind().click(function () {
//        var d = this;
//        tableData.details.deleteFunction($(this).parents("tr").attr("id").replace("tr", ""), tableData.container);
//    });

//    $con.find("[id=btnDetails]").button({
//        icons: {
//            primary: "ui-icon-plus"
//        },
//        text: false
//    }).unbind().click(function () {
//        var d = this;
//        tableData.details.detailsFunction(this, tableData.container);
//    });

//    $con.find("[id=btnConfirm]").button({
//        icons: {
//            primary: "ui-icon-check"
//        },
//        text: false
//    }).unbind().click(function () {
//        var d = this;
//        tableData.details.confirmFunction(this, tableData.container);
//    });

//    if (tableData.details != undefined) {
//        if (tableData.details.rowClick != undefined) {
//            $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
//                tableData.details.rowClick($(this).parent("tr"), tableData.container.replace("dialog", ""));
//            }).addClass("cursor");
//        }
//    }
//    newSort(getFullAcountList, tableData.container, { container: tableData.container, callbackmethod: getFullAcountList, fname: "", page_index: 0,
//        build: tableData.buildFunction, servicename: tableData.servicename, methodname: tableData.methodname, print: false
//    });
//}

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
                "<td name='image' width='10%' ><img class='imagefortable' src='../Data/" + val.appName + "Photos/" + val.Barcode + "/tiny_1.jpg'></td>" +
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

//function newSort(f, container, params) {
//    if (container != undefined && params.container != "dialog")
//        $con = $("#" + container);
//    if (params.container != undefined && params.container == "dialog")
//        $con = $("#" + params.container + container);
//    $con.find('a[rel=sort]').die("click").live("click", function () {
//        $con.find('a[rel=sort]').removeClass("sorted");
//        $(this).addClass("sorted");
//        if (this.id == sortid.split(' ')[0].toString()) {
//            if (sortid.split(' ')[1] == "DESC") sortid = this.id + " ASC";
//            else sortid = this.id + " DESC";
//        }
//        else {
//            sortid = this.id + " DESC";
//        }
//        f(container, params);
//    });
//}
//Add Product To Basket
function getProperty(barcodeid) {
    var DTO = { 'barcodeid': barcodeid };
    $.ajax({
        type: "POST",
        data: JSON.stringify(DTO),
        url: "/Home/getProperty",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            var table = "<table class='TechnicalInfoTable' cellspacing='0' style='direction:ltr'><tbody>";
            var group = (typeof response) == 'string' ? eval('(' + response + ')') : response;
            for (var j = 0; j < group.length; j++) {
                var val = group[0, j];
                table += "<tr class='Title'><td class='Group' colspan='2'>" + val.Property + "</td></tr>";
                //                table += "<tr ><td colspan='3'>" + val.Property + "</td></tr>";
                var Properties = (typeof val.properties) == 'string' ? eval('(' + val.properties + ')') : val.properties;
                // table += "<tr  style='direction:ltr'>"
                for (var p = 0; p < Properties.length; p++) {
                    var val = Properties[0, p];
                    table += "<tr id='tr" + val.PropertyId + "' ><td style='direction:ltr' class='Value'>" + val.Value + "</td><td class='Filde'>" + val.Property + ": </td></tr>";
                    if (p < Properties.length * 1 - 1)
                        table += "<tr><td colspan='2'><div class='split'></div></td></tr>";
                    //                    table += "<tr id='tr" + val.PropertyId + "'><td>" + val.Property + "</td><td>" + val.Value + "</td><td id='delete'><button propId='" + val.PropertyId + "' id='btnDelete'>حذف</button></td></tr>";
                }
                // table += "</tr>";
            }
            table += "</tbody></table>"
            $("#itemProperty").html(table);
            //            $("#itemProperty").find("table").addClass("tablescroll");
            //            tableStyle();
            $("[id=btnDelete]").button({
                icons: {
                    primary: "ui-icon-closethick"
                },
                text: false
            }).unbind().click(function () {
                var d = this;
                if (confirm("آیا از حذف مطمئن هستید؟"))
                    deleteProperty($(this).attr("propId"), container + "dialogAddProperty", container);
                else
                    return;
            });
        },
        error: function (response) { alert(response.responseText); }
    });
}

function SetItemDetailSizeAndQuantity($dis) {
    var itemdetailId = $dis.parents("tr").attr("id").replace("detail", "");
    var DTO = { 'colorId': $dis.val(), 'itemdetailId': itemdetailId };
    $.ajax({
        type: "POST",
        url: "/Home/GetSizesForColor",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if ($("tr[id=detail" + itemdetailId + "]").find("select[name=sizes]").length > 0)
                $("tr[id=detail" + itemdetailId + "]").find("select[name=sizes]").removeClass("hidden");
            else {
                $("tr[id=detail" + itemdetailId + "]").find("td[id=sizeDetails]").html("<select id='size' name='sizes'></select>");
                $("[name=sizes]").unbind().change(function () {
                    SetItemDetailQuantityForSize($(this));
                });
            }
            $("tr[id=detail" + itemdetailId + "]").find("select[name=sizes]").html("<option value=''>---</option>");
            $("tr[id=detail" + itemdetailId + "]").find("select[name=quantity]").html("<option value='0'></option>");
            if (response.size != "null" && response.size.length > 0) {

                for (var i = 0; i < response.size.length; i++) {
                    var resp = response.size[i];
                    for (var j = 0; j < resp.size.length; j++) {
                        var val = resp.size[j];
                        if (val.quantity > 0)
                            $("tr[id=detail" + itemdetailId + "]").find("select[name=sizes]").append("<option value='" + val.SizeId + "'>" + val.Size + "</option>");
                    }
                }
            }
            else if ((response.size == "null" || response.size.length == 0) && response.quantity != "null") {
                $("tr[id=detail" + itemdetailId + "]").find("td[id=sizeDetails]").html("<span>---</span>");
                $("tr[id=detail" + itemdetailId + "]").find("select[name=quantity]").html("<option value='0'></option>");
                for (var i = 1; i <= response.quantity; i++) {
                    $("tr[id=detail" + itemdetailId + "]").find("select[name=quantity]").append("<option>" + i + "</option>");
                }
            }
            else if ((response.size == "null" || response.size.length == 0) && response.quantity == "null") {
                $("tr[id=detail" + itemdetailId + "]").find("td[id=sizeDetails]").html("<span>---</span>");
            }
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}
function SetItemDetailQuantityForSize($dis) {
    var itemdetailId = $dis.parents("tr").attr("id").replace("detail", "");
    var DTO = { 'sizeId': $dis.val(), 'itemdetailId': itemdetailId, 'colorId': $("tr[id=detail" + itemdetailId + "]").find("select[name=colors]").val() };
    $.ajax({
        type: "POST",
        url: "/Home/GetQuantityForColorSize",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            $("tr[id=detail" + itemdetailId + "]").find("select[name=quantity]").html("<option value='0'></option>");
            if (response.quantity != "null" && response.quantity > 0) {
                for (var i = 1; i <= response.quantity; i++) {
                    $("tr[id=detail" + itemdetailId + "]").find("select[name=quantity]").append("<option>" + i + "</option>");
                }
            }
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

function StartCompleteRegisteration() {
    var DTO = { 'MemberCode': $("[name=MemberCode]").val() };
    $.ajax({
        type: "POST",
        url: "/Shopping/CheckMemberCode",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!response.isdone) {
                alert(response.msg);
                return;
            }
            else {
                $("[name=code]").val(response.userInfo.Code);
                //                bindHierarchyData({ id: "Address", container: "regparent", table: "Address", parentid: response.userInfo.AddressId, css: "required validate" });
                $("[name=regName]").val(response.userInfo.Name != null ? response.userInfo.Name : "");
                $("[name=regFamily]").val(response.userInfo.Family != null ? response.userInfo.Family : "");
                $("[name=regAddressStr]").val(response.userInfo.Address != null ? response.userInfo.Address : "");
                $("[name=BirthYear]").val(response.userInfo.BirthYear);
                $("[name=BirthMonth]").val(response.userInfo.BirthMonth);
                $("[name=BirthDay]").val(response.userInfo.BirthDay);
                $("[name=regGender]").val(response.userInfo.Gender.toString());
                $("[name=regPostalCode]").val(response.userInfo.PostalCode != null ? response.userInfo.PostalCode : "");
                $("[name=Combo]").val(response.userInfo.Combo);

                bindDropDownList({ controller: "Shopping", method: "GetProvinces", selectedval: response.userInfo.ParentAddressId, name: "regCity", defaultText: "---" }, "regProvince", null);
                BindProvinceCities(null, "regCity", response.userInfo.ParentAddressId, response.userInfo.AddressId);
                $("#regProvince").unbind().change(function () {
                    BindProvinceCities("regCity", "regCity", $('#regProvince').val());
                });


                var phones = response.userInfo.phonelst;
                for (var i = 0; i < phones.length; i++) {
                    $("#phones").append("<li class='ui-state-default ui-corner-top'>" +
                                        "<a id='delete' name='smsItems' style='float: right' class='ui-icon ui-icon-close'>حذف</a>" +
                                        "<label name='num' class='ui-tabs-anchor'>" + phones[i] + "</label>" +
                                        "</li>");

                }
                var mobs = response.userInfo.moblst;
                for (var i = 0; i < mobs.length; i++) {
                    $("#mobiles").append("<li class='ui-state-default ui-corner-top'>" +
                                        "<a id='delete' name='smsItems' style='float: right' class='ui-icon ui-icon-close'>حذف</a>" +
                                        "<label name='num' class='ui-tabs-anchor'>" + mobs[i] + "</label>" +
                                        "</li>");

                }
                $("[id=delete]").addClass("cursor").unbind().click(function () {
                    $(this).parents("li").remove();
                });
                $("#btn_register").val("تکمیل ثبت نام");
                $("#login").addClass("hidden");
                $("#registerForm").removeClass("hidden");
            }
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}
function RegisterFromShoppingCart() {
    $("[name=regName]").val($.trim($("[name=regName]").val()));
    $("[name=regFamily]").val($.trim($("[name=regFamily]").val()));
    $("[name=regAddressStr]").val($.trim($("[name=regAddressStr]").val()));
    $("[name=regEmail]").val($.trim($("[name=regEmail]").val()));
    if ($("#phones").find("li").length > 0) {
        $("[name=regPhone]").removeClass("required");
        $("[name=regPhone]").removeClass("validate");
    }
    else {
        if ($("[name=regPhone]").hasClass("required"))
            $("[name=regPhone]").addClass("required");
        if ($("[name=regPhone]").hasClass("validate"))
            $("[name=regPhone]").addClass("validate");
    }
    if ($("#mobiles").find("li").length > 0) {
        $("[name=regMobile]").removeClass("required");
        $("[name=regMobile]").removeClass("validate");
    }
    else {
        if ($("[name=regMobile]").hasClass("required"))
            $("[name=regMobile]").addClass("required");
        if ($("[name=regMobile]").hasClass("validate"))
            $("[name=regMobile]").addClass("validate");
    }
    if (!validateAll($("#registerForm")))
        return;
    var isvalid = true;
    $("[name=regPhone]").val($.trim($("[name=regPhone]").val()));
    if ($("#phones").find("li").length == 0 && $("[name=regPhone]").val() != "") {
        $("#phones").append("<li style='margin:3px;width:120px; float:right; ' class='ui-state-default ui-corner-top' ><a id=delete name='smsItems' style='float:right' class='ui-icon ui-icon-close'>حذف</a><label name='num' class='ui-tabs-anchor' >" + $("[name=regPhone]").val() + "</label></li>");
        $("#phones").find("span[name=msg]").addClass("invisible");
    }
    $("[name=regMobile]").val($.trim($("[name=regMobile]").val()));
    if ($("#phones").find("li").length == 0) {
        if ($.trim($("input[name=regPhone]").val()) != "") {
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
        if ($.trim($("input[name=regMobile]").val()) != "") {
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
    if ($("#btn_register").val() == "ثبت نام") {
        var DTO = { 'Email': $("[name=regEmail]").val(), 'Password': $("[name=regPassword]").val(), 'selectedValue': $("#regparent").find("[name=AddressId]").val(),
            'Name': $("[name=regName]").val(), 'Family': $("[name=regFamily]").val(), 'BirthYear': $("[name=BirthYear]").val(),
            'BirthMonth': $("[name=BirthMonth]").val(), 'BirthDay': $("[name=BirthDay]").val(), 'Gender': $("[name=regGender]").val(),
            'AddressStr': $("[name=regAddressStr]").val(), 'PostalCode': $("[name=regPostalCode]").val(), 'Combo': $("#regparentJob").find("[name=Combo]").val(),
            'phones': phoneNums, 'mobiles': mobNums, 'FindBy': $("#FindBy").val(), 'regCity': $("#regCity").val()
        };
        $.ajax({
            type: "POST",
            url: "/Shopping/Register",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (response.userInfo == undefined) {
                    alert(response.msg);
                    return;
                }
                else {
                    $("#registerForm").addClass("hidden");
                    $("#receiverInfo").removeClass("hidden");
                    //                    bindHierarchyData({ id: "Address", container: "parent", table: "Address", parentid: response.userInfo.AddressId, css: "required validate" });
                    $("#txt_name").val(response.userInfo.Name != null ? response.userInfo.Name : "");
                    $("#txt_family").val(response.userInfo.Family != null ? response.userInfo.Family : "");
                    $("#txt_address").val(response.userInfo.Address != null ? response.userInfo.Address : "");
                    $("#txt_tell").val(response.userInfo.phone);
                    $("#txt_mobile").val(response.userInfo.mobile);
                    $("#txt_postcode").val(response.userInfo.PostalCode != null ? response.userInfo.PostalCode : "");

                    $("#province").val(response.userInfo.ParentAddressId);
                    BindProvinceCities(null, "city", response.userInfo.ParentAddressId, response.userInfo.AddressId);
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }
    else if ($("#btn_register").val() == "تکمیل ثبت نام") {
        var DTO = { 'Email': $("[name=regEmail]").val(), 'Password': $("[name=regPassword]").val(), 'selectedValue': $("#regparent").find("[name=AddressId]").val(),
            'Name': $("[name=regName]").val(), 'Family': $("[name=regFamily]").val(), 'BirthYear': $("[name=BirthYear]").val(),
            'BirthMonth': $("[name=BirthMonth]").val(), 'BirthDay': $("[name=BirthDay]").val(), 'Gender': $("[name=regGender]").val(),
            'AddressStr': $("[name=regAddressStr]").val(), 'PostalCode': $("[name=regPostalCode]").val(), 'Combo': $("#regparentJob").find("[name=Combo]").val(),
            'phones': phoneNums, 'mobiles': mobNums, 'code': $("[name=code]").val(), 'FindBy': $("#FindBy").val(), 'regCity': $("#regCity").val()
        };
        $.ajax({
            type: "POST",
            url: "/Shopping/CompleteRegisteration",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (response.userInfo == undefined) {
                    alert(response.msg);
                    return;
                }
                else {
                    $("#registerForm").addClass("hidden");
                    $("#receiverInfo").removeClass("hidden");
                    //                    bindHierarchyData({ id: "Address", container: "parent", table: "Address", parentid: response.userInfo.AddressId, css: "required validate" });
                    $("#txt_name").val(response.userInfo.Name != null ? response.userInfo.Name : "");
                    $("#txt_family").val(response.userInfo.Family != null ? response.userInfo.Family : "");
                    $("#txt_address").val(response.userInfo.Address != null ? response.userInfo.Address : "");
                    $("#txt_tell").val(response.userInfo.phone);
                    $("#txt_mobile").val(response.userInfo.mobile);
                    $("#txt_postcode").val(response.userInfo.PostalCode != null ? response.userInfo.PostalCode : "");

                    $("#province").val(response.userInfo.ParentAddressId);
                    BindProvinceCities(null, "city", response.userInfo.ParentAddressId, response.userInfo.AddressId);
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }
}
var first = true;
function BackToPrvPage() {
    //    if (first) {
    //        alert(history.back());
    //    var prvUrl = 
    history.back();
    //        first = false;
    //    }
    //    window.location = prvUrl;
}
function LoadShoppingCart() {
    bindDropDownList({ controller: "Shopping", method: "GetProvinces", selectedval: "2", name: "city", defaultText: "---" }, "province", null);
    $("#province").unbind().change(function () {
        BindProvinceCities("city", "city", $('#province').val());
    });
    BindProvinceCities(null, "city", "2");
    $.ajax({
        type: "POST",
        url: "/Home/GetCurrShamsiDatePlusDay",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.isdone) {
                $("#txt_dateSend").datepicker({ changeMonth: true, changeYear: true, onClose: function () { validateAll($("#newRecieverInfo")) } });
                $("#txt_dateSend").datepicker('option', 'minDate', response.currShamsi);
            }
            else
                alert(response.msg)
        },
        error: function (response) {
        }
    });

    $("#onlinePayment").attr("checked", true);
    $("#onlinePaymentDesc").removeClass("hidden");
    $("input[name=paymenttype]").unbind().change(function () {
        if ($(this).attr("id") == "onlinePayment") {
            $("#onlinePaymentDesc").removeClass("hidden");
            $("#payToCartDesc").addClass("hidden");
            $("#payAfterReceiveDesc").addClass("hidden");
        }
        else if ($(this).attr("id") == "payToCart") {
            $("#onlinePaymentDesc").addClass("hidden");
            $("#payToCartDesc").removeClass("hidden");
            $("#payAfterReceiveDesc").addClass("hidden");
        }
        else if ($(this).attr("id") == "payAfterReceive") {
            $("#onlinePaymentDesc").addClass("hidden");
            $("#payToCartDesc").addClass("hidden");
            $("#payAfterReceiveDesc").removeClass("hidden");
        }
    });

    $("#btn_confirmOrder").unbind().click(function () {
        if ((validateAll($("#newRecieverInfo")) && $("#newSenderInfo").hasClass("hidden")) ||
                   (validateAll($("#newRecieverInfo")) && !$("#newSenderInfo").hasClass("hidden") && validateAll($("#newSenderInfo")))) {
            if ($("input[id=myself]").is(":checked")) {
                if ($("input[id=female]").is(":checked") == false && $("input[id=male]").is(":checked") == false) {
                    alert("جنسیت را انتخاب کنید.");
                    return;
                }
            }
            else if ($("input[id=others]").is(":checked")) {
                if ($("input[id=sfemale]").is(":checked") == false && $("input[id=smale]").is(":checked") == false) {
                    alert("جنسیت را انتخاب کنید.");
                    return;
                }
            }
            $("#btn_confirmOrder").parents("form").get(0).submit();
        }
    });

    $("tr[name=shopDetailtr]").each(function () {
        if ($(this).find("select[name=colors]").length > 0 && $(this).find("select[name=colors]").attr("id").replace("color", "") != "")
            $(this).find("select[name=colors]").val($(this).find("select[name=colors]").attr("id").replace("color", ""));
        if ($(this).find("select[name=sizes]").length > 0 && $(this).find("select[name=sizes]").attr("id").replace("size", "") != "")
            $(this).find("select[name=sizes]").val($(this).find("select[name=sizes]").attr("id").replace("size", ""));
        if ($(this).find("select[name=quantity]").length > 0 && $(this).find("select[name=quantity]").html() != "") {
            $(this).find("select[name=quantity]").val($(this).find("select[name=quantity]").attr("id").replace("quantity", ""));
        }
    });
    $("[name=colors]").unbind().change(function () {
        SetItemDetailSizeAndQuantity($(this));
    });
    $("[name=sizes]").unbind().change(function () {
        SetItemDetailQuantityForSize($(this));
    });

    $("[name=quantity]").unbind().change(function () {
        var dis = $(this).parents("tr");
        var shopdetailId = $(this).parents("td").attr("id").replace("q", "");
        var DTO = { 'shopdetailId': shopdetailId, 'quantity': $(this).val(), 'colorId': dis.find("select[name=colors]").val(), 'sizeId': dis.find("select[name=sizes]").val() };
        $.ajax({
            type: "POST",
            url: "/Shopping/EditShoppingCartDetail",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (response.isdone == true) {
                    SetTotalQuantity(dis);
                }
                else
                    alert(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    });
    $("#btn_fastSubmitShoppingCart").unbind().click(function () {
        var haswarning = false;
        $("#myself").attr("checked", true);
        $("#txt_giftnote").val("");
        $("#isGift").attr("checked", false);
        $("#gift").attr("checked", false);
        $("#giftInfoTr").addClass("hidden");
        $("#recGender").removeClass("hidden");
        $("#female").addClass("required");
        $("#male").addClass("required");
        $("[name=sendto]").unbind().change(function () {
            if ($(this).attr("id") == "myself") {
                $("#newSenderInfo").addClass("hidden");
                $("#recGender").removeClass("hidden");
                $("#srecGender").addClass("hidden");
                $("#female").addClass("required");
                $("#male").addClass("required");
                $("#sfemale").removeClass("required");
                $("#smale").removeClass("required");
                $("#txt_giftnote").val("");
                $("#isGift").attr("checked", false);
                $("#gift").attr("checked", false);
                $("#giftInfoTr").addClass("hidden");
            }
            else {
                $("#newSenderInfo").removeClass("hidden");
                $("#recGender").addClass("hidden");
                $("#srecGender").removeClass("hidden");
                $("#sfemale").addClass("required");
                $("#smale").addClass("required");
                $("#female").removeClass("required");
                $("#male").removeClass("required");
                $("#giftInfoTr").removeClass("hidden");
            }
        });
        $("tr[name=shopDetailtr]").each(function () {
            if ($(this).find("select[name=colors]").val() == "" && $(this).find("select[name=colors]").find("option").length > 1) {
                haswarning = true;
                if (!$(this).hasClass("warning"))
                    $(this).addClass("warning");
            }
            if ($(this).find("select[name=sizes]").val() == "" && $(this).find("select[name=sizes]").find("option").length > 1) {
                haswarning = true;
                if (!$(this).hasClass("warning"))
                    $(this).addClass("warning");
            }
            if ($(this).find("select[name=quantity]").val() == "0" && $(this).find("select[name=quantity]").find("option").length > 1) {
                haswarning = true;
                if (!$(this).hasClass("warning"))
                    $(this).addClass("warning");
            }
            if ($(this).find("select[name=quantity]").find("option").length <= 1 && $(this).find("#subscrQuantity").length == 0
                                && $(this).find("select[name=colors]").find("option").length <= 1 &&
                                    $(this).find("select[name=sizes]").find("option").length <= 1) {
                var shopdetailId = $(this).find("[name=delete]").attr("id");
                //  alert(shopdetailId);
                DeleteShoppingDetail(shopdetailId);
            }
            if (!haswarning)
                $(this).removeClass("warning");
        });
        if (haswarning) {
            alert("تعداد کالا صحیح نمی باشد.");
            return;
        }
        $("#btn_fastSubmitShoppingCart").addClass("hidden");
        $("#btn_submitShoppingCart").addClass("hidden");
        $("#login").addClass("hidden");
        $("#notLoggedOptions").removeClass("hidden");
        $("#receiverInfo").removeClass("hidden");
        //        bindHierarchyData({ id: "Address", container: "parent", table: "Address", css: "required validate" });
    });
    $("#btn_submitShoppingCart").unbind().click(function () {
        var haswarning = false;
        $("tr[name=shopDetailtr]").each(function () {
            if ($(this).find("select[name=colors]").val() == "" && $(this).find("select[name=colors]").find("option").length > 1) {
                haswarning = true;
                if (!$(this).hasClass("warning"))
                    $(this).addClass("warning");
            }
            if ($(this).find("select[name=sizes]").val() == "" && $(this).find("select[name=sizes]").find("option").length > 1) {
                haswarning = true;
                if (!$(this).hasClass("warning"))
                    $(this).addClass("warning");
            }
            if ($(this).find("select[name=quantity]").val() == "0" && $(this).find("select[name=quantity]").find("option").length > 1) {
                haswarning = true;
                if (!$(this).hasClass("warning"))
                    $(this).addClass("warning");
            }
            if ($(this).find("select[name=quantity]").find("option").length <= 1 && $(this).find("#subscrQuantity").length == 0
                                && $(this).find("select[name=colors]").find("option").length <= 1 &&
                                    $(this).find("select[name=sizes]").find("option").length <= 1) {
                var shopdetailId = $(this).find("[name=delete]").attr("id");
                //  alert(shopdetailId);
                DeleteShoppingDetail(shopdetailId);
            }
            if (!haswarning)
                $(this).removeClass("warning");
        });
        if (haswarning) {
            alert("تعداد کالا صحیح نمی باشد.");
            return;
        }
        $.ajax({
            type: "POST",
            async: false,
            url: "/Shopping/CurrentUserInfo",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response.islogin == true) {
                    if (response.userInfo == undefined) {
                        alert(msg);
                        return;
                    }
                    else {
                        $("#btn_fastSubmitShoppingCart").addClass("hidden");
                        $("#btn_submitShoppingCart").addClass("hidden");
                        $("#receiverInfo").removeClass("hidden");
                        $("#login").addClass("hidden");
                        $("#receiverInfo").removeClass("hidden");
                        //                        bindHierarchyData({ id: "Address", container: "parent", table: "Address", parentid: response.userInfo.AddressId, css: "required validate" });
                        $("#txt_name").val(response.userInfo.Name != null ? response.userInfo.Name : "");
                        $("#txt_family").val(response.userInfo.Family != null ? response.userInfo.Family : "");
                        $("#txt_address").val(response.userInfo.Address != null ? response.userInfo.Address : "");
                        $("#txt_tell").val(response.userInfo.phone);
                        $("#txt_mobile").val(response.userInfo.mobile);
                        $("#txt_postcode").val(response.userInfo.PostalCode != null ? response.userInfo.PostalCode : "");

                        $("#province").val(response.userInfo.provinceId);
                        BindProvinceCities(null, "city", response.userInfo.provinceId, response.userInfo.AddressId);

                        $("#logonedSendToOthers").removeClass("hidden");
                        $("#userMyself").attr("checked", true);
                        $("#giftInfoTr").addClass("hidden");
                        $("#logonedSendToOthers").find("[name=userSendto]").unbind().change(function () {
                            if ($(this).attr("id") == "userMyself") {
                                $("#giftInfoTr").addClass("hidden");
                                //
                                $.ajax({
                                    type: "POST",
                                    async: false,
                                    url: "/Shopping/CurrentUserInfo",
                                    contentType: "application/json; charset=utf-8",
                                    success: function (response) {
                                        if (response.islogin == true) {
                                            if (response.userInfo == undefined) {
                                                alert(msg);
                                                return;
                                            }
                                            else {
                                                $("#btn_fastSubmitShoppingCart").addClass("hidden");
                                                $("#btn_submitShoppingCart").addClass("hidden");
                                                $("#receiverInfo").removeClass("hidden");
                                                $("#login").addClass("hidden");
                                                $("#receiverInfo").removeClass("hidden");
                                                $("#txt_name").val(response.userInfo.Name != null ? response.userInfo.Name : "");
                                                $("#txt_family").val(response.userInfo.Family != null ? response.userInfo.Family : "");
                                                $("#txt_address").val(response.userInfo.Address != null ? response.userInfo.Address : "");
                                                $("#txt_tell").val(response.userInfo.phone);
                                                $("#txt_mobile").val(response.userInfo.mobile);
                                                $("#txt_postcode").val(response.userInfo.PostalCode != null ? response.userInfo.PostalCode : "");

                                                $("#province").val(response.userInfo.provinceId);
                                                BindProvinceCities(null, "city", response.userInfo.provinceId, response.userInfo.AddressId);

                                                validateAll($("#newRecieverInfo"));
                                                $("#txt_giftnote").val("");
                                                $("#isGift").attr("checked", false);
                                                $("#gift").attr("checked", false);

                                            }
                                        }
                                    }
                                });
                                //
                            }
                            else {
                                $("#giftInfoTr").removeClass("hidden");
                                $("#newRecieverInfo").find("input[type=text]").each(function () {
                                    $(this).val("");
                                });
                                $("#newRecieverInfo").find("input[type=checkbox]").each(function () {
                                    $(this).attr("checked", false);
                                });
                                $("#newRecieverInfo").find("textarea").each(function () {
                                    $(this).val("");
                                });
                            }
                        });
                    }
                }
                else {
                    $("#btn_fastSubmitShoppingCart").addClass("hidden");
                    $("#btn_submitShoppingCart").addClass("hidden");
                    $("#login").removeClass("hidden");
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    });
    $("#btnLogin").unbind().click(function () {
        var DTO = { 'username': $("[name=UserName]").val(), 'password': $("[name=Password]").val() };
        $.ajax({
            type: "POST",
            url: "/Shopping/Login",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (response.userInfo == undefined) {
                    alert(response.msg);
                    return;
                }
                else {
                    $("#login").addClass("hidden");
                    $("#receiverInfo").removeClass("hidden");
                    //                    bindHierarchyData({ id: "Address", container: "parent", table: "Address", parentid: response.userInfo.AddressId, css: "required validate" });
                    $("#txt_name").val(response.userInfo.Name != null ? response.userInfo.Name : "");
                    $("#txt_family").val(response.userInfo.Family != null ? response.userInfo.Family : "");
                    $("#txt_address").val(response.userInfo.Address != null ? response.userInfo.Address : "");
                    $("#txt_tell").val(response.userInfo.phone);
                    $("#txt_mobile").val(response.userInfo.mobile);
                    $("#txt_postcode").val(response.userInfo.PostalCode != null ? response.userInfo.PostalCode : "");

                    $("#province").val(response.userInfo.provinceId);
                    BindProvinceCities(null, "city", response.userInfo.provinceId, response.userInfo.AddressId);

                    $("#logonedSendToOthers").removeClass("hidden");
                    $("#userMyself").attr("checked", true);
                    $("#giftInfoTr").addClass("hidden");
                    $("#logonedSendToOthers").find("[name=userSendto]").unbind().change(function () {
                        if ($(this).attr("id") == "userMyself") {
                            $("#giftInfoTr").addClass("hidden");
                            //
                            $.ajax({
                                type: "POST",
                                async: false,
                                url: "/Shopping/CurrentUserInfo",
                                contentType: "application/json; charset=utf-8",
                                success: function (response) {
                                    if (response.islogin == true) {
                                        if (response.userInfo == undefined) {
                                            alert(msg);
                                            return;
                                        }
                                        else {
                                            $("#btn_fastSubmitShoppingCart").addClass("hidden");
                                            $("#btn_submitShoppingCart").addClass("hidden");
                                            $("#receiverInfo").removeClass("hidden");
                                            $("#login").addClass("hidden");
                                            $("#receiverInfo").removeClass("hidden");
                                            $("#txt_name").val(response.userInfo.Name != null ? response.userInfo.Name : "");
                                            $("#txt_family").val(response.userInfo.Family != null ? response.userInfo.Family : "");
                                            $("#txt_address").val(response.userInfo.Address != null ? response.userInfo.Address : "");
                                            $("#txt_tell").val(response.userInfo.phone);
                                            $("#txt_mobile").val(response.userInfo.mobile);
                                            $("#txt_postcode").val(response.userInfo.PostalCode != null ? response.userInfo.PostalCode : "");

                                            $("#province").val(response.userInfo.provinceId);
                                            BindProvinceCities(null, "city", response.userInfo.provinceId, response.userInfo.AddressId);

                                            validateAll($("#newRecieverInfo"));
                                            $("#txt_giftnote").val("");
                                            $("#isGift").attr("checked", false);
                                            $("#gift").attr("checked", false);

                                        }
                                    }
                                }
                            });
                            //
                        }
                        else {
                            $("#giftInfoTr").removeClass("hidden");
                            $("#newRecieverInfo").find("input[type=text]").each(function () {
                                $(this).val("");
                            });
                            $("#newRecieverInfo").find("input[type=checkbox]").each(function () {
                                $(this).attr("checked", false);
                            });
                            $("#newRecieverInfo").find("textarea").each(function () {
                                $(this).val("");
                            });
                        }
                    });
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    });
    $("[name=Register]").unbind().click(function () {
        bindDropDownList({ controller: "Shopping", method: "GetProvinces", selectedval: "2", name: "regCity", defaultText: "---" }, "regProvince", null);
        $("#regProvince").unbind().change(function () {
            BindProvinceCities("regCity", "regCity", $('#regProvince').val());
        });
        BindProvinceCities(null, "regCity", "2");
        $("#registerForm").removeClass("hidden");
        $("#login").addClass("hidden");
    });
    $("[id=sendMemberCode]").unbind().click(function () {
        $("[name=mobileForsms]").val($.trim($("[name=mobileForsms]").val()));
        if ($("[name=mobileForsms]").val() == "") {
            $("#sendCodeResult").html("شماره موبایل را وارد کنید.");
            return;
        }
        var DTO = { 'mobile': $("[name=mobileForsms]").val() };
        $.ajax({ type: 'POST',
            url: "/Account/sendMemberCodeToMobile",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                $("#sendCodeResult").html(response.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    });
    $("[name=StartRegisterByCode]").unbind().click(function () {
        $("#login").addClass("hidden");
        $("#completeRegisterationForm").removeClass("hidden");
    });
    $("#StartRegisterByCode").unbind().click(function () {
        $("#completeRegisterationForm").addClass("hidden");
        StartCompleteRegisteration();
    });
    $("#addPhone").unbind().click(function () {
        if (validateAll($("[name=regPhone]").parent("td"))) {
            $("[name=regPhone]").val($.trim($("[name=regPhone]").val()));
            if ($("[name=regPhone]").val() != "") {
                $("#phones").append("<li style='margin:3px;width:120px; float:right; ' class='ui-state-default ui-corner-top' ><a id=delete name='smsItems' style='float:right' class='ui-icon ui-icon-close'>حذف</a><label name='num' class='ui-tabs-anchor' >" + $("[name=regPhone]").val() + "</label></li>")
                $("#phones").find("span[name=msg]").addClass("invisible");
                $("[id=delete]").addClass("cursor").unbind().click(function () {
                    $(this).parents("li").remove();
                });
            }
        }
    });
    $("#addMobile").unbind().click(function () {
        if (validateAll($("[name=regMobile]").parent("td"))) {
            $("[name=regMobile]").val($.trim($("[name=regMobile]").val()));
            if ($("[name=regMobile]").val() != "") {
                $("#mobiles").append("<li style='margin:3px;width:120px; float:right; ' class='ui-state-default ui-corner-top' ><a id=delete name='smsItems' style='float:right' class='ui-icon ui-icon-close'>حذف</a><label name='num' class='ui-tabs-anchor' >" + $("[name=regMobile]").val() + "</label></li>")
                $("#mobiles").find("span[name=msg]").addClass("invisible");
                $("[id=delete]").addClass("cursor").unbind().click(function () {
                    $(this).parents("li").remove();
                });
            }
        }
    });
    $("[id=delete]").addClass("cursor").unbind().click(function () {
        $(this).parents("li").remove();
    });
    $("#btn_register").unbind().click(function () {
        RegisterFromShoppingCart();
    });
    $("#onlinePayment").attr('checked', true);
}
//************* new *************
function MenuClick($dis) {
    $("#top_nav").find("li[name=menu]").find("a").each(function () {
        $(this).removeClass("selected");
    });
    $dis.parents("li[name=menu]").first("a").addClass("selected");

}




















