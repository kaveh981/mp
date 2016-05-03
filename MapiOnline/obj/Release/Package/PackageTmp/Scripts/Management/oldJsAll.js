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
        url: getPath("Services/AccountDetails.asmx/GetAccountDetailsShop"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            $con.find("#txt_d_Sale").val(response.d.BuyAmount * 1 - response.d.SellAmount * 1);
            $con.find("#txt_d_PaymentSale").val((response.d.ReceivedCash * 1 + response.d.ReceivedCheque * 1 + response.d.ReceivedVoucher * 1) - (response.d.PaidCash * 1 + response.d.PaidCheque * 1 + response.d.paidVoucher * 1));
            $con.find("#txt_d_BalanceTotal").val((response.d.BuyAmount * 1 - response.d.SellAmount * 1) - ((response.d.ReceivedCash * 1 + response.d.ReceivedCheque * 1 + response.d.ReceivedVoucher * 1) - (response.d.PaidCash * 1 + response.d.PaidCheque * 1 + response.d.paidVoucher * 1)));
            $con.find("#txt_d_SaleTotal").val(response.d.BuyAmount);
            $con.find("#txt_d_Return").val(response.d.SellAmount);
            $con.find("#txt_d_TotalPayment").val(response.d.PaidCash * 1 + response.d.PaidCheque * 1 + response.d.paidVoucher * 1);
            $con.find("#txt_d_TotalReceive").val(response.d.ReceivedCash * 1 + response.d.ReceivedCheque * 1 + response.d.ReceivedVoucher * 1);
            $con.find("#txt_d_ChequePeyment").val(response.d.PaidCheque);
            $con.find("#txt_d_ChequeReceive").val(response.d.ReceivedCheque);
            $con.find("#txt_d_CashPayment").val(response.d.PaidCash);
            $con.find("#txt_d_CashReceive").val(response.d.ReceivedCash);
            $con.find("#txt_d_TotalOff").val(response.d.OffSale * 1 - response.d.BuyAmount * 1);
            $con.find("#txt_d_BuyQuantity").val(response.d.BuyQuantity);
            $con.find("#txt_d_SellQuantity").val(response.d.SellQuantity);
            $con.find("#txt_d_NetQuantity").val(response.d.BuyQuantity * 1 - response.d.SellQuantity * 1);
            //             $con.find("#txt_d_profit").val(response.d.profit);
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
        url: getPath("Services/AccountDetails.asmx/GetAccountDetailsShop"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            $con.find("#txt_d_Sale").val(response.d.SellAmount * 1 - response.d.BuyAmount * 1);
            $con.find("#txt_d_PaymentSale").val((response.d.PaidCash * 1 + response.d.PaidCheque * 1 + response.d.paidVoucher * 1) - (response.d.ReceivedCash * 1 + response.d.ReceivedCheque * 1 + response.d.ReceivedVoucher * 1));
            $con.find("#txt_d_BalanceTotal").val((response.d.SellAmount * 1 - response.d.BuyAmount * 1) - ((response.d.PaidCash * 1 + response.d.PaidCheque * 1 + response.d.paidVoucher * 1) - (response.d.ReceivedCash * 1 + response.d.ReceivedCheque * 1 + response.d.ReceivedVoucher * 1)));
            $con.find("#txt_d_SaleTotal").val(response.d.SellAmount);
            $con.find("#txt_d_Return").val(response.d.BuyAmount);
            $con.find("#txt_d_TotalPayment").val(response.d.PaidCash * 1 + response.d.PaidCheque * 1 + response.d.paidVoucher * 1);
            $con.find("#txt_d_TotalReceive").val(response.d.ReceivedCash * 1 + response.d.ReceivedCheque * 1 + response.d.ReceivedVoucher * 1);
            $con.find("#txt_d_ChequePeyment").val(response.d.PaidCheque);
            $con.find("#txt_d_ChequeReceive").val(response.d.ReceivedCheque);
            $con.find("#txt_d_CashPayment").val(response.d.PaidCash);
            $con.find("#txt_d_CashReceive").val(response.d.ReceivedCash);
            $con.find("#txt_d_TotalOff").val(response.d.OffBuy * 1 - response.d.SellAmount * 1);
            $con.find("#txt_d_profit").val(response.d.profit);
            $con.find("#txt_d_BuyQuantity").val(response.d.BuyQuantity);
            $con.find("#txt_d_SellQuantity").val(response.d.SellQuantity);
            $con.find("#txt_d_NetQuantity").val(response.d.BuyQuantity * 1 - response.d.SellQuantity * 1);

        },

        error: function (response) { alert(response.responseText); }
    });
}
//--------------------js AccountDetailsSupplier end-----------------------


//--------------------js MangmentOrderSupplier begin-----------------------

//--------------------js MangmentOrderSupplier begin-----------------------

//--------------------js MangmentPaymentSupplier begin-----------------------

//--------------------js MangmentPaymentSupplier begin-----------------------



//--------------------js MangmentOrder begin-----------------------

//--------------------js MangmentOrder begin-----------------------

//--------------------js MangmentPayment begin-----------------------

//--------------------js MangmentPayment begin-----------------------

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
        aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "AtuoComplete", id: "txt_customer", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_customer", fname: customerOnSelect });
        AccountFullAcc(container, first, { print: false, selectCase: "GetItemList" });
    }
}
function loadSupplierAccounting(container, first) {
    var $con = $("#" + container);

    if (first) {
        $con.find("#hd_d_IsClient").val(false);
        $con.find("#lblClient").html("supplier");
        aComplete({ methodname: "GetCompletionListBySupplierName", servicename: "AtuoComplete", id: "txt_customer", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_customer", fname: customerOnSelect });
        AccountFullAcc(container, first, { print: false, selectCase: "GetItemList" });
    }
}
function loadCustomerOrderProfit(container, first) {
    var $con = $("#" + container);

    if (first) {
        $con.find("#hd_d_IsClient").val(true);
        aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "AtuoComplete", id: "txt_customer", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_customer", fname: customerOnSelect });
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
        url: getPath("Services/Invoice.asmx/GetInvoiceList"),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var opt = InvoicegetOptionsFrom(response.d.count, container);
            $con.find("#paging").pagination(response.d.count, opt);
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
    jq = jq.d.results;
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
        $con.find("#a_IntroducerCode").die().live('click', function () {
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
        url: getPath("Services/Invoice.asmx/EditHeaderInvoice"),
        contentType: "application/json; charset=utf-8",
        data: "{OrderHeaderId: '" + $dis.prop('id').replace("tr", "") + "',Code: '" + $dis.find("td[name=Clinet] input").val() + "',Amount: '" + $dis.find("td[name=Amount] input").val() + "'}",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isDone) {
                $dis.find("a[id=a_CustomerIntroducerCode]").remove();
                $dis.find("span[id=search]").remove();
                $dis.find("div[id=Edit]").remove();
                $dis.find("div[id=Price]").html($dis.find("td[name=Amount] input").val() + " " + $dis.find("td[name=Amount] Label").html());
                $dis.find("div[id=Name]").html(response.d.msg);
                $dis.find("input").remove();
                $dis.find("Label").remove();
                $dis.find("div").removeClass("invisible");
            }
            else
                translate(response.d.msg);
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
            url: getPath("Services/Invoice.asmx/GetInvoiceList"),
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
        url: getPath("Services/Order.asmx/preOrderChange"),
        contentType: "application/json; charset=utf-8",
        data: "{orderHeaderId: '" + OrderId + "'}",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isdone)
                getInvoiceList(container);
        }
    });
}


function SelectDetailInvoice(id, container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        url: getPath("Services/Invoice.asmx/GetDetailInvoice"),
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + id + "'}",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            jq = response.d;
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

        bindItemsForSelectCombo({ methodname: "GetColorListForEdit", servicename: "InventorySetting", id: "ddl_m_Color_" + trid, container: trid, headertext: " رنگ", setcolor: true }, "{ barcodeid:'" + $dis.find("td[name=name]").prop('id') + "',orderDetailid:'" + trid.replace("tr", "") + "'}");
        $dis.find("#ddl_m_Color_" + trid).change(function () {
            SelectColorForOrderEdit(trid, $dis.find("td[name=name]").prop('id'));
        });
        ajDropDown.done(function () {
            if ($dis.find("#ddl_m_Color_" + trid + " option").length < 1)

                bindItemsForSelectCombo({ methodname: "GetSizeListByBarcodeIdColorIdForEdit", servicename: "InventorySetting", id: "ddl_m_Size_" + trid, container: trid, headertext: " جزئیات" }, "{ barcodeid:'" + $dis.find("td[name=name]").prop('id') + "',orderDetailid:'" + trid.replace("tr", "") + "',colorid:'" + "" + "'}");
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
    bindItemsForSelectCombo({ methodname: "GetSizeListByBarcodeIdColorIdForEdit", servicename: "InventorySetting", id: "ddl_m_Size_" + trid, container: trid, headertext: " جزئیات" }, "{ barcodeid:'" + barcodeid + "',orderDetailid:'" + trid.replace("tr", "") + "',colorid:'" + $("#" + trid).find("#ddl_m_Color_" + trid).val() + "'}");
}

function EditDetailInvoice($dis, container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        url: getPath("Services/Invoice.asmx/EditDetailInvoice"),
        contentType: "application/json; charset=utf-8",
        data: "{OrderDetailId: '" + $dis.prop('id').replace("tr", "") + "',ColorId: '" + ($dis.find("td[name=Color] select").val() != null ? $dis.find("td[name=Color] select").val() : "") + "',SizeId: '" + ($dis.find("td[name=Size] select").val() != null ? $dis.find("td[name=Size] select").val() : "") + "',Quantity: '" + $dis.find("td[name=Quantity] input").val() + "',Amount: '" + $dis.find("td[name=Price] input").val() + "',Serial: '" + $dis.find("td[name=Serial] input").val() + "'}",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            SelectDetailInvoice(response.d, container);
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
        url: getPath("Services/Order.asmx/ReturnOrder"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}


function RemoveItemDetailInvoice(OrderDetailId, container) {
    var con = $("#" + container);
    $.ajax({
        type: "POST",
        url: getPath("Services/Invoice.asmx/DeleteDetailInvoice"),
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + OrderDetailId + "'}",


        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
            if (response.d.isdone)
                con.find("#tr" + OrderDetailId).remove();
        },

        error: function (response) { alert(response.responseText); }
    });
}
//--------------------js invoice end-----------------------



//--------------------js order begin-----------------------

function loadOrder(supplierid, container, fname, IsWholeSale, isCustomer, first, options) {
    sortid = "BarcodeId Desc";
    if (first) {
        var $con = $("#" + container);
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
        bindItemsForSelectCombo({ methodname: "getAvailablity", servicename: "Inventory", id: "ddl_m_Availability", container: container, headertext: "وضعیت کالا", selectedindex: 1 });
        $con.find("#txt_s_ProductCode,#txt_s_ProductBarcode").bind('keydown', function (e) {
            if (e.keyCode == 13 || e.keyCode == 9) {
                getBarcodeListOrder(container, { container: "dialog", callbackmethod: getBarcodeListOrder, fname: fname, page_index: 0, build: buildBarcodeListOrder, servicename: "Inventory", methodname: "GetItemsList" });
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
            getBarcodeListOrder(container, { container: "dialog", callbackmethod: getBarcodeListOrder, fname: fname, page_index: 0, build: buildBarcodeListOrder, servicename: "Inventory", methodname: "GetItemsList" });

        }).button();

        $con.find("#btn_AddOrder").die().live('click', function () {
            if (validateAll($con)) {
                if (IsWholeSale) {
                    AddOrderWholesale(supplierid, container);
                }
                else {
                    AddOrder(supplierid, container);
                }
            }
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });

        $con.find("#btn_Print").die().live('click', function () {

            Popup($con.find("#Div_Print").html());
        }).button().addClass('invisible');
        aComplete({ methodname: "GetCompletionListByItemName", servicename: "AtuoComplete", id: "txt_s_ProductCode", container: container, minlength: 2, autofocus: false, limit: 10, boxId: "txt_s_ProductCode" }, { Status: "ddl_m_Availability" });
        if (options != undefined && options.isfastorder == true) {
            if (options != undefined && options.isChangeQuantity != undefined && options.isChangeQuantity == true) {
                aComplete({ methodname: "GetCompletionListBySupplierName", servicename: "AtuoComplete", id: "txt_s_Person", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_s_Person", fname: customerOnSelect });
            }
            else
                aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "AtuoComplete", id: "txt_s_Person", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_s_Person", fname: customerOnSelect });
        }
    }
}

function customerOnSelect(event, ui, container) {
    var $con = $("#" + container);
    $con.find("#customerOnSelect").html(ui.item.label).addClass("ui-state-highlight");
}
function getDataPrint(OrderHeaderId, container) {
    var $con = $("#" + container);
    var DTO = { 'id': OrderHeaderId };
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: getPath("Services/Invoice.asmx/GetInvoiceById"),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isdone) {
                SetInvoiceData(container, response);
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

function SetInvoiceData(container, response) {

    var $con = $("#" + container);
    //$con.find("#Div_Print").load("Report/PrintInvoice.htm", function () {
    var List = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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
    $con.find("#LClinet").html((List.Gender ? "خانم " : "آقای ") + " " + List.Family);
    $con.find("#LCustomer").html((List.ClientGender ? "خانم " : "آقای ") + " " + List.ClientFamily);
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
    /*optional stylesheet*/mywindow.document.write('<link rel="stylesheet" href="App_Themes/Default/StylePrint.css" type="text/css" />');
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
    //    if ($("#txt_s_Person").val() != undefined)
    //        supplierid = $("#txt_s_Person").val();
    orderheader["customerid"] = supplierid;
    orderheader["issell"] = !$con.find("#cb_d_Sale" + container).prop("checked");
    orderheader["ispreorder"] = $con.find("#cb_d_PreOrder" + container).prop("checked");

    var DTO = { 'header': orderheader, 'itemDetails': orderdetails, 'counterId': $("#userDefault").find("#ddl_m_Counter").val() };
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: $con.find("#cbIsChangeQuantity").length > 0 ? getPath("Services/Order.asmx/ChangeQuantity") : getPath("Services/Order.asmx/AddOrder"),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.alert != undefined) {
                SetInvoiceData(container, response);
                // getDataPrint(response.d.OrderHeaderId, container)
                translate(response.d.alert);
                if (response.d.InvoiceNO != undefined) {
                    $con.find("#OrderList").html("");
                    $con.find("#btn_Print").removeClass('invisible');
                    $con.find("#btn_AddOrder").addClass('invisible');
                    $con.find("#txt_m_InvoiceNumber").val(response.d.InvoiceNO);
                }
            }
            else
                translate(response.d.msg);

        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

function GetItemOrder($dis, container, barcode, isChangeQuantity) {
    // container = container.replace("dialog", "");
    if (barcode == undefined)
        barcode = $dis.find("[name=barcode]").html();
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
        url: getPath("Services/Order.asmx/GetProductForOrderByBarcode"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            $con.find("#txt_s_ProductBarcode").val("");
            if (response.d.length < 1)
                return;
            if ($con.find("#OrderList").html() == "") {
                $con.find("#txt_m_InvoiceNumber").val("");
                $con.find("#txt_m_PaymentAmount").val("");
            }
            var count = $con.find("tr[id*='tr_" + container + "']").length;
            var List = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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
            $con.find("#btn_Print").addClass('invisible');
            $con.find("#btn_AddOrder").removeClass('invisible');
            //    $con.find("#OrderList").parent().tableScroll({ height: 380 });
            // TableAlter(container);

            if (isChangeQuantity) {
                $con.find("#tdSerial").html("itemStatus");
                bindItemsForSelectCombo({ methodname: "getAvailablity", servicename: "Inventory", id: "ddl_m_Availability", container: trid, headertext: "وضعیت کالا", selectedindex: val.status });

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

                    bindItemsForSelectCombo({ methodname: "GetSizeListByBarcodeIdColorId", servicename: "InventorySetting", id: "ddl_m_Size_" + trid, container: trid, headertext: " جزئیات" }, "{ arg:'" + trid.split("_")[2] + "',sarg:'" + $("#userDefault").find("#ddl_s_Branch").val() + "',targ:'" + "" + "',isReturn:'" + isReturn + "'}");
            });
            SumPrice(trid, container);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function SelectColorForOrder(container, dis, barcodeid, isReturn) {
    var $con = $("#" + container);
    bindItemsForSelectCombo({ methodname: "GetSizeListByBarcodeIdColorId", servicename: "InventorySetting", id: "ddl_m_Size_" + container, container: container, headertext: " جزئیات" }, "{ arg:'" + barcodeid + "',sarg:'" + $("#userDefault").find("#ddl_s_Branch").val() + "',targ:'" + $(dis).val() + "',isReturn:'" + isReturn + "'}");
    //    bindItemsForCombo({ methodGetItem: "GetSizeListByBarcodeIdColorId", servicelocation: "InventorySetting", id: "ddl_m_Size_" + container, container: container, event: "evente" }, "{ arg:'" + container.split("_")[2] + "',sarg:'" + $("#userDefault").find("#ddl_s_Branch").val() + "',targ:'" + getRadioSelectedValue(id, container) + "',isReturn:'" + $con.parents().find("input:checkbox[id*='cb_d_Sale']").first().prop("checked") + "'}");
    // bindItemsForSelectByArgs("GetSizeListByBarcodeIdColorId", "InventorySetting", "ddl_m_Size_" + container, container, container.split("_")[2], getRadioSelectedValue(id, container), undefined);
}

function showQuantity(container, barcode) {
    buildColorSizeTable(barcode, $("#userDefault").find("#ddl_s_Branch").val(), true, "GetItemDetailsByBarcodeAndShopID", "dialog_ItemQuantity")
    $("#dialog_ItemQuantity").dialog().dialog('open');
}


function RemoveItemOrderElement(trid, container) {
    $("#" + trid).remove();
    SumPrice(trid, container);
}

function aComplete(options, data) {
    var $con = $("#" + options.container);
    var id = '#' + options.id;
    //    if (data = undefined)
    //        data = "{ 'q': '" + request.term + "', 'limit': '" + options.limit + "'}";
    //    else
    //        data = "{ 'q': '" + request.term + "', 'limit': '" + options.limit + "'}"


    $con.find(id).autocomplete({
        source: function (request, response) {
            var DTO = { 'q': request.term, 'limit': options.limit };
            if (data != undefined)
            //                $.each(data, function () {
            //                    var ss = this;
            //                });
                DTO["Status"] = $con.find("#ddl_m_Availability").val();
            //            if (data.st != undefined)
            //                DTO["Status"] = data.st;

            if (options.data != undefined) {
                var strName;
                var oObject = options.data;
                for (strName in oObject) {
                    //                    if (strName == "propertyId") {
                    //                        DTO[strName] = getHierarchySelectedValue(oObject[strName], options.container);
                    //                    }
                    //                    else
                    DTO[strName] = oObject[strName];
                }
            }
            $.ajax({
                url: getPath("Services/" + options.servicename + ".asmx/" + options.methodname),
                data: JSON.stringify(DTO),
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data.d.length > 0)
                        response(data.d);
                }
            });
        },
        focus: function (event, ui) {
            $con.find("#" + options.boxId).val(ui.item.value);
            return false;
        },
        select: function (event, ui) {
            $con.find("#" + options.boxId).val((options.selectBarcode != undefined && options.selectBarcode) ? ui.item.Barcode : ui.item.value);
            if (options.fname != undefined)
                options.fname(event, ui, options.container);
            return false;
        },
        minLength: options.minlength,
        autoFocus: options.autofocus
    });
}
function SumPrice(trid, container) {
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
    if (rownumber <= 0) {
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
        bindItemsForSelectCombo({ methodname: "GetComboItems", servicename: "XmlDropDown", headertext: "انتخاب بانک", id: "ddlBank", container: container }, "{ path:'Counter/BankTitle'}");
        ChangeCheckBoxGroupName("Check", container);
        $con.find("#txtInvoiceDateStart" + container).datepicker({ changeMonth: true, changeYear: true,
            onSelect: function (dateText, inst) {
                $('#txtInvoiceDateEnd' + container).datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
            }
        });
        $con.find("#txtInvoiceDateEnd" + container).datepicker({ changeMonth: true, changeYear: true });
        $con.find("#btnPrint").die().live('click', function () {
            getAcountList(container, { container: container, callbackmethod: getAcountList, fname: "", page_index: 0,
                build: buildAcountList, servicename: "Invoice", methodname: "GetInvoiceStatement", print: true
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
                build: buildAcountList, servicename: "Invoice", methodname: "GetInvoiceStatement", print: false
            });
        });
    }
    getAcountList(container, { container: container, callbackmethod: getAcountList, fname: "", page_index: 0,
        build: buildAcountList, servicename: "Invoice", methodname: "GetInvoiceStatement", print: false
    });
    $con.find("#PageSize").die().live('change', function () {
        getAcountList(container, { container: container, callbackmethod: getAcountList, fname: "", page_index: 0,
            build: buildAcountList, servicename: "Invoice", methodname: "GetInvoiceStatement", print: false
        });
    });
    $con.find("#DetailPaymentList").dialog({ autoOpen: false }).dialog({ width: 750 });
    //    $con.find("#DetailListInvoice").dialog({ autoOpen: false }).dialog({ width: 750 });
    $con.find("#dialog").attr("id", "dialog" + container);
}
//
function AccountFullAcc(container, first, params) {
    sortid = "Date desc";
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
                build: buildFullAcountList, servicename: "Order", methodname: "GetFullOrderStatement", print: params.print, selectCase: params.selectCase
            });
        });

        if (params.onLoad) {
            sortid = "date desc";
            getFullAcountList(container, { container: container, callbackmethod: getFullAcountList, fname: "", page_index: 0,
                build: buildFullAcountList, servicename: "Order", methodname: "GetFullOrderStatement", print: params.print, selectCase: params.selectCase
            });
        }

        //        $con.find("#PageSize").die().live('change', function () {
        //            getFullAcountList(container, { container: container, callbackmethod: getFullAcountList, fname: "", page_index: 0,
        //                build: buildFullAcountList, servicename: "Order", methodname: "GetFullOrderStatement", print: params.print, selectCase: params.selectCase
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
        $con.find("#btnPrint").die().live('click', function () {
            getFullAcountList(container, { container: container, callbackmethod: getFullAcountList, fname: "", page_index: 0,
                build: buildFullAcountList, servicename: "Order", methodname: "GetFullOrderStatement", print: true
            });
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
        bindItemsForSelectCombo({ async: false, methodname: "getAccountType", servicename: "Order", id: "ddl_AccountType", container: container, headertext: "انتخاب کارمند" });
    }
    AccountFullAcc(container, first, { print: false, selectCase: "Accounting" });
}
//Full account
function loadFullAcountReport(container, first) {
    AccountFullAcc(container, first, { print: false, selectCase: "GetItemList" });
    if (first) {
        aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "AtuoComplete", id: "txt_customer", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_customer", fname: customerOnSelect });
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
    lsth.push({ title: "debtor", sort: "Amount", footer: jq.d.sumDebtor, width: "10%" });
    lsth.push({ title: "creditor", sort: "Amount", footer: jq.d.sumCreditor, width: "10%" });
    lsth.push({ title: "balanceAmount", footer: (jq.d.sumDebtor * 1) - (jq.d.sumCreditor * 1), width: "10%" });
    lsth.push({ title: "store", sort: "inv_Shop.Name", width: "10%" });
    lsth.push({ title: "counter", sort: "counterid", width: "10%" });
    if (!container.params.print)
        lsth.push({ title: "details", width: "10%" });
    var List = (typeof jq.d.results) == 'string' ? eval('(' + jq.d.results + ')') : jq.d.results;
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
    lsth.push({ title: "invoiceNumbr", sort: "InvoiceNO", width: "8%" });
    lsth.push({ title: "confirm", sort: "p_Employee.p_Person.Family", width: "7%" });
    lsth.push({ title: "store", sort: "inv_Shop.Name", width: "6%" });
    lsth.push({ title: "counter", sort: "counterid", width: "6%" });
    if (!container.params.print) {
        lsth.push({ title: "print", width: "4%" });
        lsth.push({ title: "edit", width: "4%" });
        lsth.push({ title: "details", width: "4%" });
    }
    var List = (typeof jq.d.results) == 'string' ? eval('(' + jq.d.results + ')') : jq.d.results;
    var ItemList = "";
    if (List != null)
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            if (!container.params.print)
                trBody[0] = { trId: val.id, trName: val.detail };
            trBody[1] = { name: "employee", html: val.employee, width: "7%" };
            trBody[2] = { name: "customer", html: " <span class='cursor' name='subTab'  menuName='a_CustomerList' id='" + val.ClientId + "'>" + val.client + "</span>" + " <input type='hidden' id='hd_code' value='" + val.clientCode + "'/><input type='hidden' id='hd_clientId' value='" + val.ClientId + "'/>", width: "7%" };
            trBody[3] = { props: { datedigit: ToPersianDateDigit(val.date), date: val.date, name: "date", width: "8%", klass: "dateLong" }, html: val.date };
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
    $con.find("#spDeptor").html(jq.d.sumDebtor);
    $con.find("#spCreditor").html(jq.d.sumCreditor);
    $con.find("#spBalance").html(Math.round((jq.d.sumDebtor * 1) - (jq.d.sumCreditor * 1), 1));
    $con.find("#spNotPassedCheque").html(jq.d.sumNotPassed);
    $con.find("#spNetBalance").html(Math.round((jq.d.sumDebtor * 1) - (jq.d.sumCreditor * 1) - (jq.d.sumNotPassed * 1), 1));
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
    if ($con.find("#Div_Print").html().length < 10) {
        $con.find("#Div_Print").load("Report/PrintInvoice.htm", function () {
            getDataPrint($(dis).parents("tr").prop("id").replace("tr", ""), container);
        });
    }
    else
        getDataPrint($(dis).parents("tr").prop("id").replace("tr", ""), container);
}
//Full Account
function ConfirmFullAccount(dis, container) {
    $con = $("#" + container);
    $dis = $(dis);
    var DTO = { 'orderHeaderId': $dis.parents("tr").prop("id").replace("tr", "") };
    $.ajax({
        type: "POST",
        url: getPath("Services/Order.asmx/ConfirmFullAccount"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d != null && response.d.isdone == true) {
                getFullAcountList(container, { container: container, callbackmethod: getFullAcountList, fname: "", page_index: 0,
                    build: buildFullAcountList, servicename: "Order", methodname: "GetFullOrderStatement", print: false
                });
            }
            //$dis.parent().html(response.d.name + " " + response.d.family);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

//Full Account
function EditFullAccount(dis, container) {
    $con = $("#" + container);
    $dis = $(dis);
    //payment or Transfer
    $("#edit" + container, "#editExpense" + container, "#editSalary" + container, "#editSocial" + container).dialog().dialog("close");
    if ($dis.parents("tr").attr("name") == "payment")
        EditPaymentFullAccount($dis, container);
    //order
    else if ($dis.parents("tr").attr("name") == "order")
        EditOrderFullAccount($dis, container);
    //voucher
    else if ($dis.parents("tr").attr("name") == "voucher")
        EditVoucherFullAccount($dis, container);
    //expense category
    else if ($dis.parents("tr").attr("name") == "expense")
        EditExpenseFullAccount($dis, container);
    //salary
    if ($dis.parents("tr").attr("name") == "salary")
        EditSalaryFullAccount($dis, container);
    //social
    if ($dis.parents("tr").attr("name") == "social")
        EditSocialFullAccount($dis, container);
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
    //    aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "AtuoComplete", id: "txtCustomer", container: $dialog.prop("id"), minlength: 2, autofocus: false, limit: 20, boxId: "txtCustomer" });
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
    //    aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "AtuoComplete", id: "txtCustomer", container: $dialog.prop("id"), minlength: 2, autofocus: false, limit: 20, boxId: "txtCustomer" });
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
    bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "EmployeeService", id: "ddl_m_employee_add", container: "editSalary" + container, headertext: "انتخاب کارمند" });
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
    bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "EmployeeService", id: "ddl_social_employee_add", container: "editSocial" + container, headertext: "انتخاب کارمند" });
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
        url: getPath("Services/Order.asmx/EditOrderFullAcount"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            return response.d.isdone;
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
        url: getPath("Services/Order.asmx/EditOrderFullAcount"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            alert(response.d.msg);
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
        url: getPath("Services/Payment.asmx/EditPaymentFullAcount"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            alert(response.d.msg);
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
        url: getPath("Services/Order.asmx/EditExpenseFullAcount"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            alert(response.d.msg);
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
        url: getPath("Services/Order.asmx/GetVoucherDetailsFullAccount"),
        contentType: "application/json; charset=utf-8",
        data: "{orderHeaderId: '" + orderHeaderId + "'}",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
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
        url: getPath("Services/Order.asmx/EditVoucherFullAccount"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isdone) {
                $dis.find("div[id=Amount]").html($dis.find("input[id=Amount]").val());
                $dis.find("div[id=ExpieryDate]").html($dis.find("input[id=ExpieryDate]").val());
            }
            //Amount txt
            $dis.find("input[id=Amount]").remove();
            $dis.find("input[id=ExpieryDate]").remove();
            $dis.find("#Edit").remove();
            $dis.find("div[id=delete]").removeClass("invisible");
            $dis.find("div").removeClass("invisible");
            alert(response.d.msg);
            //            }
            //SelectDetailInvoice(response.d, container);
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
        bindItemsForSelectCombo({ methodname: "GetComboItems", servicename: "XmlDropDown", headertext: "انتخاب بانک", id: "ddlBank", container: container }, "{ path:'Counter/BankTitle'}");
        ChangeCheckBoxGroupName("Check", container);
        $con.find("#txtInvoiceDateStart").attr("id", "txtInvoiceDateStart" + container);
        $con.find("#txtInvoiceDateEnd").attr("id", "txtInvoiceDateEnd" + container);
        $con.find("#txtInvoiceDateStart" + container).datepicker({ changeMonth: true, changeYear: true,
            onSelect: function (dateText, inst) {
                $('#txtInvoiceDateEnd' + container).datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
            }
        });
        $con.find("#txtInvoiceDateEnd" + container).datepicker({ changeMonth: true, changeYear: true });

        $con.find("#btnPrint").die().live('click', function () {
            getAcountList(container, { container: container, callbackmethod: getAcountList, fname: "", page_index: 0,
                build: buildAcountList, servicename: "Invoice", methodname: "GetInvoiceStatement", print: true
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
                build: buildAcountList, servicename: "Invoice", methodname: "GetInvoiceStatement", print: false
            });
        });
    }
    getAcountList(container, { container: container, callbackmethod: getAcountList, fname: "", page_index: 0,
        build: buildAcountList, servicename: "Invoice", methodname: "GetInvoiceStatement", print: false
    });
    $con.find("#PageSize").die().live('change', function () {
        getAcountList(container, { container: container, callbackmethod: getAcountList, fname: "", page_index: 0,
            build: buildAcountList, servicename: "Invoice", methodname: "GetInvoiceStatement", print: false
        });
    });
    $con.find("#DetailPaymentList").dialog({ autoOpen: false }).dialog({ width: 750 });
    //    $con.find("#DetailListInvoice").dialog({ autoOpen: false }).dialog({ width: 750 });
    $con.find("#dialog").attr("id", "dialog" + container);
    $con.find("#ddlSearchBy1 option[value='Code']").remove();
    $con.find("#ddlSearchBy1 option[value='Name']").remove();
}
//--------------------js order end-----------------------

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
                build: buildVoucherList, servicename: "Order", methodname: "GetVoucherList", print: false
            });
        });
        //Page size change
        $con.find("#PageSize").die().live('change', function () {
            getVoucherList(container, { container: container, callbackmethod: getVoucherList, fname: "", page_index: 0,
                build: buildVoucherList, servicename: "Order", methodname: "GetVoucherList", print: false
            });
        });
        //Show Voucher List
        getVoucherList(container, { container: container, callbackmethod: getVoucherList, fname: "", page_index: 0,
            build: buildVoucherList, servicename: "Order", methodname: "GetVoucherList", print: false
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
    lsth.push({ title: "ارزش کارت", sort: "Amount", footer: jq.d.sumDebtor, width: "9%" });
    lsth.push({ title: "شماره کارت", sort: "Number", footer: jq.d.sumCreditor, width: "10%" });
    lsth.push({ title: "expieryDate", sort: "ExpieryDate", width: "13%" });
    lsth.push({ title: "Shop", sort: "ac_OrderHeader1.inv_Shop.Name", width: "10%" });
    lsth.push({ title: "status", sort: "IsValid", width: "8%" });
    lsth.push({ title: "deleteKey", width: "4%" });
    lsth.push({ title: "details", width: "4%" });
    var List = (typeof jq.d.results) == 'string' ? eval('(' + jq.d.results + ')') : jq.d.results;
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
        url: getPath("Services/Order.asmx/DeleteVoucher"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isdone == false) {
                alert(response.d.msg);
                return;
            }
            if (response.d != null && response.d.isdone == true)
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
        url: getPath("Services/Order.asmx/ChangeVoucherStatus"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d != null && response.d.isdone == false) {
                alert(response.d.msg);
                return;
            }
            if (response.d != null && response.d.isdone == true) {
                var $parentBtn = $dis.parent();
                if (response.d.status)
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
        url: getPath("Services/Order.asmx/GetVoucherDetails"),
        contentType: "application/json; charset=utf-8",
        data: "{voucherNumber: '" + $dis.parents("tr").find("[name=number]").html() + "'}",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            jq = response.d;
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
        url: getPath("Services/Customer.asmx/AddVoucher"),
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
                build: buildVoucherList, servicename: "Order", methodname: "GetVoucherList", print: false
            });
        });
        //Page size change
        $con.find("#PageSize").die().live('change', function () {
            getVoucherList(container, { container: container, callbackmethod: getVoucherList, fname: "", page_index: 0,
                build: buildVoucherList, servicename: "Order", methodname: "GetVoucherList", print: false
            });
        });
        //Show Voucher List
        getVoucherList(container, { container: container, callbackmethod: getVoucherList, fname: "", page_index: 0,
            build: buildVoucherList, servicename: "Order", methodname: "GetVoucherList", print: false
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
        url: getPath("Services/Order.asmx/GetVoucherItem"),
        data: JSON.stringify(DTO),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.msg == undefined) {
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
    jq = jq.d.results;
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
    jq = jq.d;
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
    aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "AtuoComplete", id: "txt_payer", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_payer", fname: customerOnSelect });
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
        url: getPath("Services/Customer.asmx/AddSellVoucher"),
        data: JSON.stringify(DTO),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
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
            build: buildCustomerRestrictionList, servicename: "Customer", methodname: "GetCustomerRestrictionList", print: false, customerId: customerId
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


    var List = (typeof jq.d.results) == 'string' ? eval('(' + jq.d.results + ')') : jq.d.results;
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
        url: getPath("Services/Customer.asmx/DeleteCustomerRestriction"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isDone == false) {
                alert(response.d.msg);
                return;
            }
            if (response.d != null && response.d.isDone == true)
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
        url: getPath("Services/Customer.asmx/AddCustomerRestriction"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isDone == false) {
                alert(response.d.msg);
                return;
            }
            if (response.d != null && response.d.isDone == true)
                getCustomerRestrictionList(container, { container: container, callbackmethod: getCustomerRestrictionList, fname: "", page_index: 0,
                    build: buildCustomerRestrictionList, servicename: "Customer", methodname: "GetCustomerRestrictionList", print: false, customerId: customerId
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
        url: getPath("Services/Customer.asmx/GetOnlineProfile"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isDone) {
                $con.find("#txtEmail").val(response.d.email)
                $con.find("#cbIsWholesaleBuyer").prop("checked", response.d.isWholesaleBuyer);
                $con.find("#cbCanGetCredit").prop("checked", response.d.canGetCredit);
                $con.find("#cbIsFriend").prop("checked", response.d.isFriend);
            }
            //            translate(response.d.alert);
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
        url: getPath("Services/Customer.asmx/UpdateOnlineProfile"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}


function loadNewSalary(container, first) {
    var $con = $("#" + container);
    $con.find("#dialogAddSalary").removeClass("invisible");
    bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "EmployeeService", id: "ddl_m_employee_add", container: container, headertext: "انتخاب کارمند" });
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
    bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "EmployeeService", id: "ddl_social_employee_add", container: container, headertext: "انتخاب کارمند" });
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
//--------------------voucher end------------------------

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
                OrderItemDetail["ColorID"] = ItemDetail[0];
                OrderItemDetail["SizeID"] = ItemDetail[1];
                OrderItemDetail["Quantity"] = this.value * ($row.find("[id*=ddl_m_measureunit]").val() != null ? $row.find("[id*=ddl_m_measureunit]").val().split('_')[0] : 1);
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
    if (orderdetails != "") {
        var DTO = { 'header': orderheader, 'itemDetails': orderdetails, 'counterId': $("#userDefault").find("#ddl_m_Counter").val() };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: getPath("Services/Order.asmx/AddOrderWholeSale"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.alert != undefined) {
                    SetInvoiceData(container, response);
                    translate(response.d.alert);
                    if (response.d.InvoiceNO != undefined) {
                        $con.find("#OrderList").html("");
                        $con.find("#btn_Print").removeClass('invisible');
                        $con.find("#btn_AddOrder").addClass('invisible');
                        $con.find("#txt_m_InvoiceNumber").val(response.d.InvoiceNO);
                    }
                }
                else
                    translate(response.d);
            },
            error: function (response) { alert(response.responseText); }
        });
    }
}

function GetItemOrderWholesale($dis, container, barcode) {
    //   container = container.replace("dialog", "");
    if (barcode == undefined)
        barcode = $dis.find("[name=barcode]").html();
    var $con = $("#" + container.replace("dialog", ""));
    var ItemList = "";
    $.ajax({
        type: "POST",
        data: "{barcode: '" + barcode + "'}",
        url: getPath("Services/Order.asmx/GetProduct"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            $con.find("#txt_s_ProductBarcode").val("");
            if (response.d.length < 1)
                return;
            var count = $con.find("tr[id*='tr_" + container + "']").length;
            var List = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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
    jq = jq.d.results;
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
//    jq = jq.d.results;
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



//--------------------js payment begin-----------------------

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
        $con.find("#btn_Cash").die().live('click', function () {
            GetItemCash(container);
        }).button({ icons: {
            primary: "ui-icon-plus"
        },
            text: true
        });
        $con.find("#btn_Cheque").die().live('click', function () {
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

        $con.find("#btn_Add_Payment").die().live('click', function () {
            if (validateAll($con) && $con.find("#txt_SumPeyment").val() != "0")
                AddPayment(Supplierid, container);
        }).button({ icons: {
            primary: "ui-icon-disk"
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
    aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "AtuoComplete", id: "txt_payer", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_payer", fname: customerOnSelect });
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
    bindItemsForSelectCombo({ methodname: "getCounterName", servicename: "Counter", headertext: "انتخاب صندوق", id: "ddl_CounterTo", container: container });
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
        $con.find("#btn_Cash").die().live('click', function () {
            GetItemCash(container);
            tableStyle();
        }).button({ icons: {
            primary: "ui-icon-plus"
        },
            text: true
        });
        $con.find("#btn_Cheque").die().live('click', function () {
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
        $con.find("#btn_voucher").die().live('click', function () {
            sortid = "OrderHeaderId Desc";
            getCustomerVoucherList(container, { container: "dialog", callbackmethod: getCustomerVoucherList, fname: VoucherRowClick, page_index: 0, build: buildPayVoucherList, servicename: "Order", methodname: "getCustomerVoucherList" });
        });

        $con.find("#btn_Add_Payment").die().live('click', function () {
            //            if (validateAll($con) && $con.find("#txt_SumPeyment").val() != "0")
            if (validateAll($con))
                AddPayment(Supplierid, container);
        }).button({ icons: {
            primary: "ui-icon-disk"
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
             $(this).find("#txt_m_DueDate").val() == "" || $(this).find("#txt_m_Amount").val() == "")
            return;
        cheque["Bank"] = $(this).find("#ddl_m_Bank_" + this.id).val();
        cheque["Serial"] = $(this).find("#txt_m_Serial").val();
        cheque["DueDate"] = $(this).find("#txt_m_DueDate").val();
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
        url: getPath("Services/Payment.asmx/AddPayment"),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
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
                 "<td><input type='text'  class=' inputText  ' id='txt_m_DueDate' placeholder='chequeDate'/></td>" +
                "<td id='delete'><button name='btn_Delete' >حذف</button></td></tr>";
    $con.find("#ChequeList").append(ItemList).parent().tableScroll({ height: 380, width: $con.width() - 85, flush: false });
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

    if ($con.find("select[id*=ddl_m_Bank_]").length > 1)
        $con.find("#ddl_m_Bank_" + trid).html($con.find("select[id*=ddl_m_Bank_]").first().html()).val("");

    else
        bindItemsForSelectCombo({ methodname: "GetComboItems", servicename: "XmlDropDown", headertext: "انتخاب بانک", id: "ddl_m_Bank_" + trid, container: container }, "{ path:'Counter/BankTitle'}");

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
        url: getPath("Services/Payment.asmx/GetPaymentList"),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var opt = PaymentgetOptionsFrom(response.d.count, container);
            $con.find("#paging").pagination(response.d.count, opt);
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
    jq = jq.d.results;
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
            url: getPath("Services/Payment.asmx/GetPaymentList"),
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
        url: getPath("Services/Payment.asmx/GetDetailPaymentList"),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var List = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
            var ItemCash = "";
            for (var i = 0; i < List.cash.length; i++) {
                var val = List.cash[0, i];
                ItemCash += "<tr id='tr" + val.CashId + "'>" +
                "<td width='50%' name='PaymentNO' >" + val.Amount + "  " + val.Currency + "</td>" +
                "<td width='40%'>" + val.Type + "</td>" +
                 "<td width='10%' id='delete'><button id='deleteCash'>حذف</button></td></tr>";
                //"<div class='modalClose modalRemove'><a href='javascript:RemoveItemDetailCash(" + val.CashId + ");'/></div>";
            };
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
            for (var i = 0; i < List.cheque.length; i++) {
                var val = List.cheque[0, i];
                ItemCheque += "<tr id='tr" + val.ChequeId + "'>" +
                "<td name='PaymentNO' width='18%'>" + val.Amount + "  " + val.Currency + "</td>" +
                "<td  width='18%'>" + val.Bank + "</td>" +
                "<td  width='20%'><input style='width:100px; height:20px;' name='serial' value='" + val.Serial + "'/></td>" +
                "<td id='status'  width='15%'>" + (val.Passed == "پاس شده" ? val.Passed :
                                      ("<button id='btn_pass'>تایید</button>")) + "</td>" +
                "<td   width='15%'><input style='width:70px; height:20px;' name='date' value='" + ToPersianDateDigit(val.Date) + "'/></td>" +
                "<td id='delete' width='7%'><button id='deleteCheque'>delete</button></td><td width='7%'><button id='editCheque'>edit</button></td></tr>";
                //<div class='modalClose modalRemove'><a href='javascript:RemoveItemDetailCheque(" + val.ChequeId + ");'/></div>";
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
        data: "{id: '" + chequeId + "'}",
        url: getPath("Services/Payment.asmx/ChequePassed"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isdone)
                $(dis).parents("td").html("پاس شده");
            else
                translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function RemoveItemDetailCash(id) {
    var $con = $("#tr" + id);
    $.ajax({
        type: "POST",
        url: getPath("Services/Payment.asmx/DeleteCash"),
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + id + "'}",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
            if (response.d.isDone)
                $con.remove();

        },

        error: function (response) { alert(response.responseText); }
    });
}

function RemoveItemDetailCheque(id) {
    var $con = $("#tr" + id);
    $.ajax({
        type: "POST",
        url: getPath("Services/Payment.asmx/DeleteCheque"),
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + id + "'}",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
            if (response.d.isDone)
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
        url: getPath("Services/Payment.asmx/EditCheque"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
            //            if (response.d.isDone)
            //               
        },

        error: function (response) { alert(response.responseText); }
    });
}
//--------------------js payment end-----------------------



//--------------------js customer begin-----------------------

function loadCustomerAdd(container, first) {

    customerAdd(container, first);
}
function loadCustomerAddToolbar(container, first) {

    customerAdd(container, first);
}

function customerAdd(container, first) {
    var $con = $("#" + container);
    if (first) {

        aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "AtuoComplete", id: "CustomerIntroducerCode", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "CustomerIntroducerCode" });
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

        //        $(document).tooltip({
        //            items: "span, [hierarchy], [title],[dropdown]",
        //            content: function () {
        //                var element = $(this);
        //                if (element.is("[dropdown]")) {
        //                    var text = element.text();
        //                    return "<img class='map' alt='" + text +
        //"' src='http://maps.google.com/maps/api/staticmap?" +
        //"zoom=11&size=350x350&maptype=terrain&sensor=false&center=" +
        //text + "'>";
        //                }
        //                if (element.is("[title]")) {
        //                    return element.attr("title");
        //                }
        //                if (element.is("[hierarchy]")) {
        //                    return "<div style='width:300px;'><p></p><p></p><p style='margin-top: 12.0pt; margin-right: 33.75pt; margin-bottom: 10.0pt; margin-left: -21.3pt; mso-add-space: auto; text-align: justify;' dir='rtl' class='MsoListParagraphCxSpFirst'><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif';' lang='FA'>ثبت مشخصات مشتری جدید.</span></p><p style='margin-top: 12.0pt; margin-right: 33.75pt; margin-bottom: 10.0pt; margin-left: -21.3pt; mso-add-space: auto; text-align: justify;' dir='rtl' class='MsoListParagraphCxSpMiddle'><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif';' lang='FA'><span style='mso-spacerun: yes;'>&nbsp;</span>با کلیک روی گزینه</span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif'; mso-no-proof: yes;' dir='ltr'><img alt='Description: C:\Users\shahrzad\Desktop\icon.png' src='jscripts/tiny_mce/img/canmodify.jpg' width='21' height='20' /></span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif';' lang='FA'> در سمت چپ فیلد شغل، در قسمت پایین آن میتوانید نام شغل را نوشته و با کلیک روی </span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif'; mso-no-proof: yes;' dir='ltr'><img alt='Description: C:\Users\shahrzad\Desktop\plus.png' src='jscripts/tiny_mce/img/plus.jpg' width='25' height='20' /></span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif';' lang='FA'>شغل جدید ثبت کنید و یا با کلیک روی</span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif'; mso-no-proof: yes;' dir='ltr'><img alt='Description: C:\Users\shahrzad\Desktop\edit.png' src='jscripts/tiny_mce/img/edit.jpg' width='21' height='20' /></span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif';' lang='FA'><span style='mso-spacerun: yes;'>&nbsp;</span>نام شغل انتخابی در لیست را ویرایش و با انتخاب</span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif'; mso-no-proof: yes;' dir='ltr'><img alt='Description: C:\Users\shahrzad\Desktop\delete.png' src='jscripts/tiny_mce/img/delete.jpg' width='21' height='20' /></span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif'; mso-bidi-language: AR-SA; mso-no-proof: yes;'><span style='mso-spacerun: yes;'>&nbsp;</span></span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif';' lang='FA'><span style='mso-spacerun: yes;'>&nbsp;</span>نام شغل انتخابی در لیست را حذف کنید.</span></p><p style='margin-top: 12.0pt; margin-right: 33.75pt; margin-bottom: 10.0pt; margin-left: -21.3pt; mso-add-space: auto; text-align: justify;' dir='rtl' class='MsoListParagraphCxSpLast'><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif';' lang='FA'>می توانید آدرس را به صورت دنباله ای از سرگروه که نام کشور است تا زیرگروه های شهر، خیابان، کوچه و پلاک ثبت کنید. با کلیک روی گزینه </span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif'; mso-no-proof: yes;' dir='ltr'><img alt='Description: C:\Users\shahrzad\Desktop\icon.png' src='jscripts/tiny_mce/img/canmodify.jpg' width='21' height='20' /></span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif';' lang='FA'>می توانید در کادر باز شده سرگروه یا زیرگروه اضافه، حذف یا ویرایش کنید. اگر در انتخاب زیرگروهی اشتباه کردید با کلیک روی هر کدام از موارد در دنباله انتخاب شده، زیرگروههای پس از آن، از انتخاب خارج خواهد شد، به عنوان مثال در </span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif'; mso-no-proof: yes;' dir='ltr'><img alt='Description: C:\Users\shahrzad\Desktop\address.png' src='jscripts/tiny_mce/img/address1.jpg' width='114' height='21' /></span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif';' lang='FA'>با کلیک روی شیراز، دنباله به صورت </span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif'; mso-no-proof: yes;' dir='ltr'><img alt='Description: C:\Users\shahrzad\Desktop\address2.png' src='jscripts/tiny_mce/img/address2.jpg' width='74' height='21' /></span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif';' lang='FA'>خواهد شد. با کلیک روی گزینه </span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif'; mso-no-proof: yes;' dir='ltr'><img alt='Description: C:\Users\shahrzad\Desktop\refresh.png' src='jscripts/tiny_mce/img/refresh.jpg' width='21' height='20' /></span><span style='font-size: 10.0pt; line-height: 115%; font-family: 'Tahoma','sans-serif';' lang='FA'>می توانید آدرس را از ابتدا انتخاب کنید.</span></p></div>";
        //                }
        //            }
        //        });

    }
}

function loadCustomerEdit(customerid, container, first) {
    if (first) {
        var $con = $("#" + container);
        aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "AtuoComplete", id: "CustomerIntroducerCode", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "CustomerIntroducerCode" });
        bindXmlDropDownData({ id: "CustomerJobEdit", container: container, path: "Customer/jobTitle", canmodify: true, istext: true, headertext: "انتخاب شغل" });
        $con.find("#divdialogCustomer").dialog({ autoOpen: false }).dialog({ width: 600 });
        $con.find("#EditCustomer").die().live('click', function () {
            if (validateAll($("#" + container)))
                EditCustomer(customerid, container);
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });

        $con.find("#a_CustomerIntroducerCode").die().live('click', function () {
            opendialog({ container: "divdialogCustomer", containerpage: container });
        });
        //setTimeout(function () { getCustomer(customerid, container) }, 100);
        getCustomer(customerid, container);
    }
}

function loadCustomerList(container, first) {
    sortid = 'PersonId desc';
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
            build: buildCustomerList, servicename: "Customer", methodname: "GetCustomerList", print: false
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
        $con.find("#PageSize").die().live('change', function () {
            //            getCustomerList({ container: container });
            getCustomerList(container, { container: container, callbackmethod: getCustomerList, fname: "", page_index: 0,
                build: buildCustomerList, servicename: "Customer", methodname: "GetCustomerList", print: false
            });
        });
        $con.find("#divslider").unbind('click').click(function () { sliderClick("divCustomersearch"); sliderClick("CustomerAdvanceSearch"); });
        $con.find("#btnSearchCustomer").button({
            icons: {
                primary: "ui-icon-search"
            },
            text: true
        }).unbind('click').click(function () {
            sortid = 'PersonId desc';
            //            getCustomerList({ container: container }); 
            getCustomerList(container, { container: container, callbackmethod: getCustomerList, fname: "", page_index: 0,
                build: buildCustomerList, servicename: "Customer", methodname: "GetCustomerList", print: false
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

    sortid = 'PersonId desc';
    if (first) {
        var $con = $("#" + container);
        $con.find("#PageSize").die().live('change', function () {
            //            getCustomerList({ container: container }); 
            getCustomerList(container, { container: container, callbackmethod: getCustomerList, fname: "", page_index: 0,
                build: buildCustomerList, servicename: "Customer", methodname: "GetCustomerList", print: false
            });
        });
        $con.find("#btnSearchCustomer").unbind('click').click(function () {
            //            getCustomerList({ container: container });
            getCustomerList(container, { container: container, callbackmethod: getCustomerList, fname: "", page_index: 0,
                build: buildCustomerList, servicename: "Customer", methodname: "GetCustomerList", print: false
            });
        });
        $con.find("#CustomertxtSearch").focus();
    }
}
function loadCustomerAddressEdit(customerid, container, first) {
    var $con = $("#" + container);
    if (first) {
        getCustomerAddress(customerid, container);
        $con.find("#EditAddress").die().live('click', function () {
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
        url: getPath("Services/Customer.asmx/AddCustomer"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.count > 0) {
                ResetPage(container);
                $("#tabFullAcountReport").find("#txt_customer").val(response.d.code)
            }
            translate(response.d.alert);
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
        url: getPath("Services/Customer.asmx/EditCustomer"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
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
    //    $.ajax({
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        data: JSON.stringify(DTO),
    //        type: "Post",
    //        url: getPath("Services/Customer.asmx/GetCustomerList"),
    //        success: function (response) {
    //            if (!isAuthenticated(response))
    //                return;
    //            var opt = customergetOptionsFrom(response.d.count, pageoption);
    //            $con.find("#paging").pagination(response.d.count, opt);
    //            customerpageselectCallback(0, response, pageoption, first);
    //        },
    //        error: function (response) { alert(response.responseText); }
    //    });
}


//function customergetOptionsFrom(count, pageoption) {
//    var $con = $("#" + pageoption.container);
//    var opt = { callback: customerpageselectCallback };
//    $con.find("input:text").each(function () {
//        opt[this.name] = this.className.match(/numeric/) ? parseInt(this.value) : this.value;
//    });
//    opt.prev_show_always = false;
//    opt.next_show_always = false;
//    if ((count) < $con.find("#PageSize").val())
//        $con.find("#PageSize").css("display", "none");
//    else {
//        $con.find("#PageSize").css("display", "inline");
//    }
//    opt.items_per_page = $con.find("#PageSize").val();
//    opt.prev_text = "قبلی";
//    opt.next_text = "بعدی";
//    opt.container = pageoption;
//    return opt;
//}

function buildCustomerList(jq, pageoption) {
    var $con = $("#" + pageoption.pagingContainer);
    jq = jq.d.results;
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
        trBody[0] = { trId: val.PersonId };
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

//function buildCustomerList(jq, pageoption) {
//    var $con = $("#" + pageoption.container);
//    jq = jq.d.results;
//    var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
//    var ItemList = "";
//    for (var i = 0; i < List.length; i++) {
//        var val = List[0, i];
//        ItemList += "<tr id='tr" + val.PersonId + "'>" +
//                  "<td name='code' >" + val.Code + "</td>"+
//"<td name='name'>" + val.Name + "  " + val.Family + "</td> " +
//                (pageoption.container != "divdialogCustomer" ? "<td >" + (val.age == 0 ? "__" : val.age) + "</td>" : "") +
//                (pageoption.container != "divdialogCustomer" ? "<td >" + val.regdate + "</td>" : "") +
//                (pageoption.container != "divdialogCustomer" ? "<td >" + (val.Gender == true ? 'مرد' : 'زن') + "</td>" : "") +
//                (pageoption.container != "divdialogCustomer" ? "<td >" + val.regName + "  " + val.regFamily + "</td>" : "") +
//                "<td >" + val.introducerName + "  " + val.introducerFamily + "</td>" +
//                (pageoption.container != "divdialogCustomer" ? "<td id='delete'><div class='modalClose modalRemove'><a href='javascript:RemoveCustomerElement(\"" + val.PersonId + "\",\"" + pageoption.container + "\");'/></div></td>" : "") +
//                "</tr>";
//    }
//    $con.find("#CustomerList").html(ItemList).parent().tableScroll({ height: 380 });
//    $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
//        ClickCustomer($(this).parent("tr"), pageoption)
//    }).addClass("cursor");
//    if (pageoption.container == "divdialogCustomer")
//        $con.dialog('open');
//}

//function customerpageselectCallback(page_index, jq, pageoption, first) {
//    var $con = $("#" + pageoption.container);
//    var code = "", name = "", regname = "", Introducer = "", mobile = "", phone = "", email = "";
//    if (first) {
//        buildCustomerList(jq, pageoption);
//    }
//    else {
//        first = false;
//        var items_per_page = $con.find("#PageSize").val();
//        var itemcontent = '';
//        var take = items_per_page;
//        var skip = page_index == 0 ? 0 : (page_index * take);
//        if (!$con.find("#moreFilter").is(":visible")) {
//            var search = $con.find("#SearchBy").val();
//            if (search == "Code") {

//                code = $con.find("#CustomertxtSearch").val();
//            } if (search == "Name") {

//                name = $con.find("#CustomertxtSearch").val();
//            } if (search == "RegName") {

//                regname = $con.find("#CustomertxtSearch").val();
//            } if (search == "IntroducerName") {

//                Introducer = $con.find("#CustomertxtSearch").val();
//            }
//            if (pageoption.container == "divdialogCustomer") {
//                name = $con.find("#selectCustomerName").val();
//                regname = $con.find("#selectCustomerRegisterer").val();
//            }
//            if (search == "Mobile") {

//                mobile = $con.find("#CustomertxtSearch").val();
//            }
//            if (search == "Phone") {

//                phone = $con.find("#CustomertxtSearch").val();
//            }
//            if (search == "Email") {

//                phone = $con.find("#CustomertxtSearch").val();
//            }
//            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'namefamily': name, 'introducer': Introducer, 'registerername': regname, 'agefrom': "", 'ageto': "", 'regdatefrom': "", 'regdateto': "", 'mobile': mobile, 'phone': phone, 'email': email };
//        }
//        else {
//            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'namefamily': $con.find("#CustomerSearchName").val(), 'introducer': $con.find("#CustomerIntroducerCode").val(), 'registerername': $con.find("#CustomerSearchRegName").val(), 'agefrom': $con.find("#CustomerSearchAgeStart").val(), 'ageto': $con.find("#CustomerSearchAgeEnd").val(), 'regdatefrom': $con.find("#CustomerSearchRegDateStart").val(), 'regdateto': $con.find("#CustomerSearchRegDateEnd").val(), 'mobile': mobile, 'phone': phone, 'email': email };
//        }
//        $.ajax({
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            data: JSON.stringify(DTO),
//            type: "Post",
//            url: getPath("Services/Customer.asmx/GetCustomerList"),
//            success: function (response) {
//                if (!isAuthenticated(response))
//                    return;
//                buildCustomerList(response, pageoption);
//            },
//            error: function (response) { alert(response.responseText); }
//        });

//        return false;
//    }
//    Sort(getCustomerList, pageoption);
//}


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
        url: getPath("Services/Customer.asmx/DeleteCustomer"),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (!response.d.isdone) {
                alert(response.d.msg);
                return;
            }
            else if (response.d.isdone)
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
        url: getPath("Services/Customer.asmx/GetCustomerById"),
        contentType: "application/json; charset=utf-8",
        data: "{customerid: '" + customerid + "' }",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var Customer = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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
        url: getPath("Services/Customer.asmx/GetAddressById"),
        contentType: "application/json; charset=utf-8",
        data: "{customerid: '" + customerid + "' }",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var Customer = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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
        url: getPath("Services/Customer.asmx/EditAddressCustomer"),
        contentType: "application/json; charset=utf-8",
        data: "{personid: '" + customerid + "',addressid: '" + getHierarchySelectedValue("divCustomerAddressEdit", container) + "',address: '" + $con.find("#CustomerFullAddressEdit").val() + "' }",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
            loadCustomerAddressEdit(customerid, container);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function getCustomerPhone(customerid, container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        url: getPath("Services/Customer.asmx/GetPhoneById"),
        contentType: "application/json; charset=utf-8",
        data: "{personid: '" + customerid + "'}",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            jq = response.d;
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
        url: getPath("Services/Customer.asmx/DeleteCustomerPhone"),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
            if (response.d.isDone)
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
        url: getPath("Services/Customer.asmx/AddCustomerPhone"),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
            if (response.d.isDone)
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
        url: getPath("Services/Customer.asmx/EditCustomerPhone"),
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
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function opendialog(pageoption) {
    var $con = $("#" + pageoption.container);
    sortid = 'PersonId desc';
    $con.find("#PageSize").die().live('change', function () {
        sortid = 'PersonId';
        //        getCustomerList(pageoption);
        getCustomerList(pageoption.container, { container: pageoption.container, callbackmethod: getCustomerList, fname: "", page_index: 0,
            build: buildCustomerList, servicename: "Customer", methodname: "GetCustomerList", print: false
        });
    });
    $con.find("#btn_searchCustomer").unbind().bind('click', function () { sortid = 'PersonId'; getCustomerList(pageoption); });
    //    getCustomerList(pageoption);
    getCustomerList(pageoption.container, { container: pageoption.container, callbackmethod: getCustomerList, fname: "", page_index: 0,
        build: buildCustomerList, servicename: "Customer", methodname: "GetCustomerList", print: false
    });
}
//--------------------js customer end-----------------------



//--------------------js supplier begin-----------------------


function loadSupplierAdd(container, first) {
    if (first) {
        var $con = $("#" + container);
        bindHierarchyData({ id: "divSupplierAddress", container: container, table: "address", canmodify: true });
        $con.find("#AddSupplier").die().live('click', function () {
            if (validateAll($("#" + container)))
                addSupplier(container);
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });
    }
}

function loadSupplierEdit(Supplierid, container, first) {
    var $con = $("#" + container);
    if (first) {
        getSupplier(Supplierid, container);
        $con.find("#EditSupplier").die().live('click', function () {
            if (validateAll($("#" + container)))
                EditSupplier(Supplierid, container);
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });
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
                // Animation complete.
                //                if ($con.find('#moreFilter').is(":visible"))
                //                    $con.find("#simpleSearch").addClass("invisible");
                //                else
                //                    $con.find("#simpleSearch").removeClass("invisible");
            });

        });
        sortid = 'PersonId desc';
        //bindDropDown("SearchBy", container, "sevente");
        $con.find("#SearchBy").val("Name");
        getSupplierList(container, { container: container, callbackmethod: getSupplierList, fname: "", page_index: 0,
            build: buildSupplierList, servicename: "Supplier", methodname: "GetSupplierList", print: false
        });
        //        getSupplierList(container);
        // GetSubMenuItems("a_SupplierList", container);

        $con.find("#SupplierSearchRegDateStart").datepicker({ changeMonth: true, changeYear: true,
            onSelect: function (dateText, inst) {
                $('#SupplierSearchRegDateEnd').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
            }
        });

        $con.find("#SupplierSearchRegDateEnd").datepicker({ changeMonth: true, changeYear: true });

        $con.find("#DialogBarcode").dialog({ autoOpen: false }).dialog({ width: 750 })
        //        $con.find("#PageSize").die().live('change', function () { getSupplierList(container); });
        //    $con.find("#divslider").unbind('click').click(function () { sliderClick("divSuppliersearch"); sliderClick("SupplierAdvanceSearch"); });
        $con.find("#btnSearchSupplier").unbind('click').click(function () {
            //            getSupplierList(container);
            getSupplierList(container, { container: container, callbackmethod: getSupplierList, fname: "", page_index: 0,
                build: buildSupplierList, servicename: "Supplier", methodname: "GetSupplierList", print: false
            });
        }).button({ icons: {
            primary: "ui-icon-search"
        }
        });
        $con.find("#SupplierAdvanceSearchbt").unbind('click').click(function () { getSupplierList(container); }).button();
    }
}
function loadListSupplierSelect(container) {
    var $con = $("#" + container);
    sortid = 'PersonId desc';
    $con.find("#btnSearchSupplier").unbind('click').click(function () {
        getSupplierList();

    });
}



function addSupplier(container) {
    var $con = $("#" + container);
    var DTO = { 'name': $con.find("#SupplierName").val(), 'family': $con.find("#SupplierFamily").val(), 'age': $con.find("#SupplierAge").val(), 'gender': $con.find("#ddl_m_Gender").val(), 'fax': $con.find("#SupplierFax").val(), 'mobile': $con.find("#SupplierMobile").val(), 'phone': $con.find("#Supplierphone").val(), 'addressid': getHierarchySelectedValue("divSupplierAddress", container), 'email': $con.find("#SupplierEmail").val(), 'date': $("#userDefault").find("#txt_s_Date").val() };
    //string name,string family,int age,bool gender,int registererid,string job,string mobile,string phone,int addressid
    $.ajax({
        type: "POST",
        url: getPath("Services/Supplier.asmx/AddSupplier"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.count > 0)
                ResetPage(container);
            translate(response.d.alert);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

function EditSupplier(Supplierid, container) {
    var $con = $("#" + container);
    var DTO = { 'personid': Supplierid, 'code': $con.find("#SupplierCodeEdit").val(), 'name': $con.find("#SupplierNameEdit").val(), 'family': $con.find("#SupplierFamilyEdit").val(), 'age': $con.find("#SupplierAgeEdit").val(), 'gender': $con.find("#ddl_m_Gender").val(), 'fax': $con.find("#SupplierFaxEdit").val(), 'email': $con.find("#SupplierEmailEdit").val() };
    $.ajax({
        type: "POST",
        url: getPath("Services/Supplier.asmx/EditSupplier"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.alert);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
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

    //    $.ajax({
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        data: JSON.stringify(DTO),
    //        type: "Post",
    //        url: getPath("Services/Supplier.asmx/GetSupplierList"),
    //        success: function (response) {
    //            if (!isAuthenticated(response))
    //                return;
    //            // if (response.d.isdone)
    //            buildSupplierList(response, container);
    //            //            var opt = SuppliergetOptionsFrom(response.d.count, container);
    //            //            $con.find("#paging").pagination(response.d.count, opt);
    //            //            SupplierpageselectCallback(0, response, container, first);
    //            //   parent.$.fancybox.center;
    //            //   parent.$.fancybox.resize;
    //        },
    //        error: function (response) { alert(response.responseText); }
    //    });
}


//function SuppliergetOptionsFrom(count, container) {
//    var $con = $("#" + container);
//    var opt = { callback: SupplierpageselectCallback };
//    $con.find("input:text").each(function () {
//        opt[this.name] = this.className.match(/numeric/) ? parseInt(this.value) : this.value;
//    });
//    opt.prev_show_always = false;
//    opt.next_show_always = false;
//    if ((count) < $con.find("#PageSize").val())
//        $con.find("#PageSize").css("display", "none");
//    else {
//        $con.find("#PageSize").css("display", "inline");
//    }
//    opt.items_per_page = $con.find("#PageSize").val();
//    opt.prev_text = "قبلی";
//    opt.next_text = "بعدی";
//    opt.container = container;
//    return opt;
//}


function buildSupplierList(jq, params) {
    var $con = $("#" + params.pagingContainer);
    jq = jq.d.results;
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
        trBody[0] = { trId: val.PersonId };
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


//function buildSupplierList2(jq, container) {
//    var $con = $("#" + container);
//    jq = jq.d.results;
//    var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
//    var ItemList = "";
//    for (var i = 0; i < List.length; i++) {
//        var val = List[0, i];
//        ItemList += "<tr id='tr" + val.PersonId + "'> <td width='14%' name='code' >" + val.Code + "</td>" +
//        "<td width='18%%' name='name'>" + val.Name + "  " + val.Family + "</td> " +
//                "<td width='12%'>" + (val.age == 0 ? "__" : val.age) + "</td>" +
//              "<td width='14%'>" + val.regdate + "</td>" +
//                "<td width='14%'>" + (val.Gender == true ? 'مرد' : 'زن') + "</td>" +
//                "<td width='18%'>" + val.regName + "  " + val.regFamily + "</td>" +
//                "<td width='10%'id='delete'>" +
//                "<button id='a_Button' >حذف</button></div></td></tr>";
//    }
//    $con.find("#SupplierList").html(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
//    // $con.find("#SupplierList").parent().tableScroll({ height: 380 });
//    // TableAlter(container);
//    $con.find("[id=a_Button]").button({
//        icons: {
//            primary: "ui-icon-closethick"
//        },
//        text: false
//    }).click(function () {
//        if (confirm("آیا از حذف مطمئن هستید؟"))
//            RemoveSupplierElement($(this).parents("tr").prop("id").replace("tr", ""), container);
//        else
//            return;
//    });
//    $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
//        ClickSupplier($(this).parent("tr"), container)
//    }).addClass("cursor");
//    // parent.$.fancybox.center;
//    //  parent.$.fancybox.resize;
//}

//function SupplierpageselectCallback(page_index, jq, container, first) {
//    var $con = $("#" + container);
//    var code = "", name = "", regname = "", Introducer = "";
//    if (first) {
//        buildSupplierList(jq, container);
//    }
//    else {
//        first = false;
//        var items_per_page = $con.find("#PageSize").val();
//        var itemcontent = '';
//        var take = items_per_page;
//        var skip = page_index == 0 ? 0 : (page_index * take);
//        if (!$con.find("#SupplierAdvanceSearchbt").is(":visible")) {
//            var search = $con.find("#SearchBy").val();
//            if (search == "Code") {

//                code = $con.find("#SuppliertxtSearch").val();
//            } if (search == "Name") {

//                name = $con.find("#SuppliertxtSearch").val();
//            } if (search == "RegName") {

//                regname = $con.find("#SuppliertxtSearch").val();
//            } if (search == "IntroducerName") {

//                Introducer = $con.find("#SuppliertxtSearch").val();
//            }
//            if (container == "selectSupplierContent") {
//                name = $con("#selectSupplierName").val();
//                regname = $con("#selectSupplierRegisterer").val();
//            }

//            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'code': code, 'namefamily': name, 'registerername': regname, 'agefrom': "", 'ageto': "", 'regdatefrom': "", 'regdateto': "" };
//        }
//        else {
//            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'code': $con.find("#SupplierSearchCode").val(), 'namefamily': $con.find("#SupplierSearchName").val(), 'introducer': $con.find("#SupplierSearchIndtroducerName").val(), 'registerername': $con.find("#SupplierSearchRegName").val(), 'agefrom': $con.find("#SupplierSearchAgeStart").val(), 'ageto': $con.find("#SupplierSearchAgeEnd").val(), 'regdatefrom': $con.find("#SupplierSearchRegDateStart").val(), 'regdateto': $con.find("#SupplierSearchRegDateEnd").val() };
//        }
//        $.ajax({
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            data: JSON.stringify(DTO),
//            type: "Post",
//            url: getPath("Services/Supplier.asmx/GetSupplierList"),
//            success: function (response) {
//                if (!isAuthenticated(response))
//                    return;
//                buildSupplierList(response, container);
//            },
//            error: function (response) { alert(response.responseText); }
//        });

//        return false;
//    }
//    Sort(getSupplierList, container);
//}


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
        url: getPath("Services/Supplier.asmx/DeleteSupplier"),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
            getSupplierList(container);

        },
        error: function (response) { alert(response.responseText); }
    });
}

function getSupplier(Supplierid, container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        url: getPath("Services/Supplier.asmx/GetSupplierById"),
        contentType: "application/json; charset=utf-8",
        data: "{Supplierid: '" + Supplierid + "' }",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var Supplier = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
            var cusval = Supplier[0];
            $con.find("#SupplierCodeEdit").val(cusval.Code)
            $con.find("#SupplierNameEdit").val(cusval.Name)
            $con.find("#SupplierFamilyEdit").val(cusval.Family);
            $con.find("#SupplierAgeEdit").val(cusval.Age == 0 ? "" : cusval.Age);
            $con.find("#SupplierFaxEdit").val(cusval.fax);
            $con.find("#SupplierEmailEdit").val(cusval.Email);
            bindHierarchyData({ id: "divSupplierAddressEdit", container: container, table: "address", canmodify: true, parentid: cusval.AddressId });
            $con.find("#ddl_m_Gender").val("" + cusval.Gender + "");

        },
        error: function (response) { alert(response.responseText); }
    });

}

function sevente(id, container) {
    var $con = $("#" + container);
    if ($con.find("#SearchBy").val() == "IntroducerName") {
        $con.find("#a_SuppliertxtSearch").addClass("searchText");
    }
    else
        $con.find("#a_SuppliertxtSearch").removeClass("searchText");
}
//--------------------js supplier end-----------------------



//--------------------js inventory begin-----------------------

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


function loadCurrencyHelp(container, first) {
    var $con = $("#" + container);
    if (first) {

        $con.find("#newCurrency").unbind("click").bind('click', function () {
            $("[id='a_CurrencyNameList']").trigger("click")
        });
        $con.find("#newRate").unbind("click").bind('click', function () {
            $("[id='a_CurrencyList']").trigger("click")
        });
    }
}

function loadInventoryAdd(container, first) {
    if (first) {
        var $con = $("#" + container);
        bindHierarchyData({ id: "hr_m_Category", container: container, canmodify: true, table: "category" });
        bindItemsForSelectCombo({ methodname: "getMeasureUnit", servicename: "Inventory", id: "ddl_m_MeasureUnit", container: container, headertext: " واحد کالا", selectedindex: 1 });
        bindItemsForSelectCombo({ methodname: "getAvailablity", servicename: "Inventory", id: "ddl_m_Availability", container: container, headertext: "وضعیت کالا", selectedindex: 1 });

        $con.find("#btn_Submit").die().live('click', function () {
            if (validateAll($("#" + container)))
                AddBarcode(container);
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });
    }
}


function loadEditQuantity(container, first) {
    var fname = GetItemEditQuantity;
    sortid = "BarcodeId Desc";
    if (first) {
        var $con = $("#" + container);
        $con.find("#dialog").attr("id", "dialog" + container);
        bindItemsForSelectCombo({ methodname: "getAvailablity", servicename: "Inventory", id: "ddl_m_Availability", container: container, headertext: "وضعیت کالا", selectedindex: 1 });
        $con.find("#txt_s_ProductCode,#txt_s_ProductBarcode").bind('keydown', function (e) {
            if (e.keyCode == 13 || e.keyCode == 9) {
                getBarcodeListOrder(container, { container: "dialog", callbackmethod: getBarcodeListOrder, fname: fname, page_index: 0, build: buildBarcodeListOrder, servicename: "Inventory", methodname: "GetItemsList" });
            }
        });
        //   aComplete("txt_s_ProductCode", container);
        // aComplete({ methodname: "GetCompletionListByItemName", servicename: "AtuoComplete", id: "txt_s_ProductCode", container: container, minlength: 2, autofocus: true, limit: 10 }, { Status: "ddl_m_Availability" });
        aComplete({ methodname: "GetCompletionListByItemName", servicename: "AtuoComplete", id: "txt_s_ProductCode", container: container, minlength: 2, autofocus: false, limit: 10, boxId: "txt_s_ProductCode" }, { Status: "ddl_m_Availability" });
        $con.find("#DialogBarcode").dialog({ autoOpen: false }).dialog({ width: 750 });
        $con.find("#dialog_ItemQuantity").dialog({ autoOpen: false })
        bindHierarchyData({ id: "hr_s_Category", table: "category", container: container });
        $con.find("#btn_SearchProduct").die().live('click', function () {
            sortid = "BarcodeId Desc";
            getBarcodeListOrder(container, { container: "dialog", callbackmethod: getBarcodeListOrder, fname: fname, page_index: 0, build: buildBarcodeListOrder, servicename: "Inventory", methodname: "GetItemsList" });
        }).button({ icons: { primary: 'ui-icon-search'} });

        $con.find("#btn_AddOrder").die().live('click', function () {
            EditQuantityItems(container);
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });
        $con.find("#OrderList").parent().tableScroll({ height: 380, width: contentwidth, flush: false });
    }
}


function GetItemEditQuantity($dis, container, barcode) {
    if (barcode == undefined)
        barcode = $dis.find("[name=barcode]").html();
    var $con = $("#" + container);
    var ItemList = "";
    $.ajax({
        type: "POST",
        data: "{barcode: '" + barcode + "'}",
        url: getPath("Services/Order.asmx/GetProduct"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            $con.find("#txt_s_ProductBarcode").val("");
            var count = $con.find("tr[id*='tr_" + container + "']").length;
            var List = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
            var ItemList = "";
            var val = List[0, 0];
            var trid = "tr_" + container + "_" + val.barcodeid + "_" + count;
            ItemList += "<tr id='" + trid + "'>" +
                "<td width='15%'>" + val.name + " " + val.code + " " + val.barcode + "</td>" +
                "<td width='10%'><input type='checkbox' id='cb_d_Broken_" + trid + "' /><label for='cb_d_Broken_" + trid + "'>سالم</label></td>" +
                "<td width='10%'><select class=' selectsmall1 ' id='ddl_m_Availability'></select></td>" +
                 "<td  width='30%'id='Quantity_" + trid + "'>" +
                "</td>" +
                "<td width='30%' id='Div_Product_Quantity_" + trid + "' dir='rtl'></td>" +
                "<td width='5%' id='delete'><button id='btn_deleteProduct'>حذف</button></td></tr>";
            $con.find("#OrderList").append(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
            // $con.find("#OrderList").parent().tableScroll({ height: 380 });
            // TableAlter(container);
            $con.find("[id=btn_deleteProduct]").button({
                icons: {
                    primary: "ui-icon-closethick"
                },
                text: false
            }).unbind().bind('click', function () {
                if (confirm("آیا از حذف مطمئن هستید؟"))
                    RemoveItemOrderElementWholesale($(this).parents("tr").attr("id"), container);
                else
                    return;
            });
            $("#" + trid).find("#txt_m_Price").bind('keydown', function (e) {
                if (e.keyCode == 40) {
                    $("#" + trid).next().find("#txt_m_Price").focus().focus(function () { this.select() });
                }
                if (e.keyCode == 38) {
                    $("#" + trid).prev().find("#txt_m_Price").focus().focus(function () { this.select() });
                }
            });
            $con.find("#cb_d_Broken_" + trid).button().prop("checked", "checked").trigger("change").unbind('change').change(function () {
                if (this.checked) {
                    buildColorSizeTable(barcode, $("#userDefault").find("#ddl_s_Branch").val(), true, "GetItemDetailsByBarcodeAndShopID", "Quantity_" + trid, trid);
                    $(this).button("option", "label", "سالم");
                }
                else {

                    buildColorSizeTable(barcode, $("#userDefault").find("#ddl_s_Branch").val(), true, "GetBrokenItemDetailsByBarcodeAndShopID", "Quantity_" + trid, trid);
                    $(this).button("option", "label", "خراب");
                }
            });

            buildColorSizeTable(barcode, $("#userDefault").find("#ddl_s_Branch").val(), false, "GetAllItemDetailsByBarcodeAndShopIDNoQuantity", "Div_Product_Quantity_" + trid, trid);
            buildColorSizeTable(barcode, $("#userDefault").find("#ddl_s_Branch").val(), true, "GetItemDetailsByBarcodeAndShopID", "Quantity_" + trid, trid);
            bindItemsForSelectCombo({ methodname: "getAvailablity", servicename: "Inventory", id: "ddl_m_Availability", container: trid, headertext: "وضعیت کالا", selectedindex: val.status });
            $con.find("#Footer").removeClass("invisible");
        },
        error: function (response) { alert(response.responseText); }
    });
}


function EditQuantityItems(container) {
    var $con = $("#" + container);
    var orderdetails = [];

    $.each($("#" + container).find("tr[id*=tr]"), function () {
        var orderDetailArray = [];
        var orderdetail = {};
        orderdetail["barcodeid"] = this.id.split("_")[2];
        orderdetail["status"] = $(this).find("#ddl_m_Availability").val();
        orderdetail["broken"] = $(this).find("#cb_d_Broken_" + this.id).prop('checked');
        $(this).find("#Div_Product_Quantity_" + this.id).find("input[name=quantity]").each(function () {
            if (this.value != "") {
                var itemDetails = {};
                var ItemDetail = {};
                ItemDetail = (this.id).split("-");
                itemDetails["ColorID"] = ItemDetail[0];
                itemDetails["SizeID"] = ItemDetail[1];
                itemDetails["Quantity"] = this.value;
                orderDetailArray.push(itemDetails);
            }
        });
        orderdetail["itemDetails"] = orderDetailArray;
        orderdetails.push(orderdetail);
    })
    var DTO = { 'Details': orderdetails, 'ShopId': $("#userDefault").find("#ddl_s_Branch").val() };
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: getPath("Services/Inventory.asmx/EditQuantityItems"),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}
function loadInventoryReportList(container, first) {
    sortid = 'BarcodeId desc';
    if (first) {
        var $con = $("#" + container);

        // bindDropDown("ddl_d_SearchBy", container);
        bindHierarchyData({ id: "hr_s_Category", table: "category", container: container, styleclass: "PagingSelect " });
        bindItemsForSelectCombo({ methodname: "getAvailablity", servicename: "Inventory", id: "ddl_s_Availability", container: container, headertext: "وضعیت کالا" });
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

function loadInventoryReport(barcodeId, container, first) {
    var $con = $("#" + container);
    if (first) {
        getBarcodeStatement(container, { container: container, callbackmethod: getBarcodeStatement, fname: "", page_index: 0,
            build: buildBarcodeStatement, servicename: "Inventory", methodname: "getBarcodeStatement", print: false, barcodeId: barcodeId
        });
        $con.find("[id=btnSearchVisitorStatistic]").button({ icons: {
            primary: "ui-icon-search"
        }
        }).unbind('click').click(function () {
            getBarcodeStatement(container, { container: container, callbackmethod: getBarcodeStatement, fname: "", page_index: 0,
                build: buildBarcodeStatement, servicename: "Inventory", methodname: "getBarcodeStatement", print: false, barcodeId: barcodeId
            });
        });
    }
}

function getBarcodeStatement(container, params) {
    var $con = $("#" + container);
    if (params.page_index > 0) {
        params.first = false;
    }
    var DTO = { 'barcodeId': params.barcodeId, 'shopId': $("#userDefault").find("#ddl_s_Branch").val()
    };
    params["DTO"] = DTO;

    pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
        first: true, isOrder: false
    });
}

function buildBarcodeStatement(jq, container) {
    var $con = $("#" + container.pagingContainer);
    var table = {};
    var lstb = [];
    var lsth = [];
    var details = {};
    lsth.push({ title: "name", width: "10%" });
    lsth.push({ title: "color", width: "5%" });
    lsth.push({ title: "size", width: "5%" });
    lsth.push({ title: "date", width: "12%" });
    lsth.push({ title: "description", width: "13%" });
    lsth.push({ title: "employee", width: "15%" });
    lsth.push({ title: "shop", width: "10%" });
    lsth.push({ title: "add", footer: jq.d.sumDebtor, width: "10%" });
    lsth.push({ title: "drop", footer: jq.d.sumCreditor, width: "10%" });
    lsth.push({ title: "balanceAmount", footer: Math.round((jq.d.sumDebtor * 1) - (jq.d.sumCreditor * 1), 1), width: "10%" });

    var List = (typeof jq.d.results) == 'string' ? eval('(' + jq.d.results + ')') : jq.d.results;
    var ItemList = "";
    if (List != null)
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            //   if (!container.params.print)
            trBody[0] = { trId: val.id };
            trBody[1] = { name: "name", html: val.Barcode, width: "10%" };
            trBody[2] = { name: "color", html: val.color, width: "5%" };
            trBody[3] = { name: "size", html: val.size, width: "5%" };
            trBody[4] = { name: "date", props: { date: val.Date, width: "12%", klass: "dateLong"} };
            trBody[5] = { name: "description", html: "<span>" + val.description + "</span>", width: "13%" };
            trBody[6] = { name: "employee", html: val.EmployeeName + " " + val.EmployeeFamily, width: "15%" };
            trBody[7] = { name: "shop", html: val.shopName, width: "10%" };
            trBody[8] = { name: "add", html: val.isDecrease == false ? val.Quantity : "", width: "10%" };
            trBody[9] = { name: "drop", html: val.isDecrease == true ? val.Quantity : "", width: "10%" };
            trBody[10] = { name: "balanceAmount", html: val.balance, width: "10%" };
            lstb.push(trBody);
        }
    //    if (container.params.print) {
    //        table = { header: lsth, body: lstb, heigth: 300,
    //            container: container.pagingContainer, divName: "Div_Print", hasFooter: true
    //        };
    //        buildPrintTable(table);
    //        container.params.print = false;
    //    }
    //    else {
    table = { header: lsth, details: {}, body: lstb, container: container.pagingContainer, divName: "statementList", hasFooter: true };
    buildTable(table);

    //    }
}


function loadInventoryList(container, first) {
    sortid = 'BarcodeId desc';
    if (first) {
        var $con = $("#" + container);

        //  bindDropDown("ddl_d_SearchBy", container);
        bindHierarchyData({ id: "hr_s_Category", table: "category", container: container, styleclass: "PagingSelect " });
        bindItemsForSelectCombo({ methodname: "getAvailablity", servicename: "Inventory", id: "ddl_s_Availability", container: container, headertext: "وضعیت کالا" });
        getBarcodeList(container, { container: container, callbackmethod: getBarcodeList, fname: "", page_index: 0,
            build: buildBarcodeList, servicename: "Inventory", methodname: "GetItemsList", print: false
        });
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
            getBarcodeList(container, { container: container, callbackmethod: getBarcodeList, fname: "", page_index: 0,
                build: buildBarcodeList, servicename: "Inventory", methodname: "GetItemsList", print: false
            });
        }).button({ icons: {
            primary: "ui-icon-search"
        }
        });
        //        $con.find("#PageSize").unbind('change').change(function () { getBarcodeList(container); });
        $con.find("#regdateFrom").datepicker({ changeMonth: true, changeYear: true,
            onSelect: function (dateText, inst) {
                $('#regdateTo').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
            }
        });
        $con.find("#regdateTo").datepicker({ changeMonth: true, changeYear: true });
        //        $con.find("#InventoryAdvanceSearchbt").unbind('click').click(function () { getBarcodeList(container); }).button();
    }

}
function loadInventoryEdit(barcodeid, container, first) {
    if (first) {
        var $con = $("#" + container);
        bindItemsForSelectCombo({ methodname: "getAvailablity", servicename: "Inventory", id: "ddl_m_Availability", container: container, headertext: "وضعیت کالا" });
        ajDropDown.done(GetSingelBarcode(barcodeid, container));
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

function loadColorSize(barcodeid, container, first) {
    if (first) {
        var $con = $("#" + container);
        getColor(container);
        getSize(container);
        $con.find("#btn_Submit").die().live('click', function () {
            if (validateAll($("#" + container)))
                addSizeColor(barcodeid, container);
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });
    }
}

function loadInventorySetting(container, first) {
    if (first) {

        var $con = $("#" + container);
        var measureFirst = true;
        var size = true;
        $con.find("#divInventoryAccordion").accordion({ heightStyle: "content", collapsible: true, active: false,
            change: function (event, ui) {

                if (ui.newContent.prop('id') == "Color" && $con.find("#ddl_m_Color option").length < 1) {
                    bindItemsForSelectCombo({ methodname: "GetColorSystem", servicename: "InventorySetting", id: "ddl_m_Color", container: container, headertext: "انتخاب رنگ ", setcolor: true });
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
                if (ui.newContent.prop('id') == "Measure" && measureFirst) { bindHierarchyData({ id: "hr_m_MeasureUnit", container: container, canmodify: true, table: "MeasureUnit", css: "selectsmall1" }); measureFirst = false; }
                if (ui.newContent.prop('id') == "Size" && size) {
                    getListSize(container);
                    bindItemsForSelectCombo({ methodname: "GetPaternSizeList", servicename: "InventorySetting", id: "ddl_m_Size", container: container, headertext: "انتخاب جزئیات " });
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

    }
}

function loadListColorSize(barcodeid, container, first) {
    getListColor_Size(barcodeid, container);
    if (first) {
        var $con = $("#" + container);
        bindItemsForSelectCombo({ methodname: "GetColorList", servicename: "InventorySetting", id: "ddl_m_Color", container: container, headertext: "انتخاب رنگ" });
        bindItemsForSelectCombo({ methodname: "GetSizeList", servicename: "InventorySetting", id: "ddl_m_Size", container: container, headertext: "انتخاب جزئیات" });

        $con.find("#btn_Submit").die().live('click', function () {
            if (validateAll($("#" + container)))
                EditColor_Size(barcodeid, container);
        }).button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        });
    }
}

function loadInventoryPrice(barcodeid, container, first) {
    if (first) {
        var $con = $("#" + container);
        getListPrice(barcodeid, container);

        $con.find("#txt_m_Date").datepicker({ changeMonth: true, changeYear: true });

        $con.find("#btn_Submit").button().unbind('click').click(function () {
            if (validateAll($("#" + container)))
                AddPrice(barcodeid, container);
        });
    }
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


function AddBarcode(container) {
    var $con = $("#" + container);
    var DTO = { 'barcode': $con.find("#txt_m_Barcode").val(), 'name': $con.find("#txt_m_Name").val(), 'itemcode': $con.find("#txt_m_ItemCode").val(), 'availibilityid': $con.find("#ddl_m_Availability").val(), 'measureunitid': $con.find("#ddl_m_MeasureUnit").val(), 'categoryid': getHierarchySelectedValue("hr_m_Category", container), 'regularprice': $con.find("#txt_m_RegularPrice").val(), 'frinendsprice': $con.find("#txt_m_FrinendsPrice").val(), 'wholesaleprice': $con.find("#txt_m_WholesalePrice").val(), 'onlineprice': $con.find("#txt_m_OnlinePrice").val(), 'weight': $con.find("#txt_m_Weight").val(), 'setColorSize': $con.find("#cb_d_SizeColor").prop("checked"), 'showOnline': $con.find("#ddl_m_ShowOnline").val(), 'date': $("#userDefault").find("#txt_s_Date").val() };
    $.ajax({
        type: "POST",
        url: getPath("Services/Inventory.asmx/AddBarcode"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isDone) {
                alert(response.d.barcode);
                ResetPage(container);
            }
            // translate(response.d.msg);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

function EditBarcode(barcodeid, container) {
    var $con = $("#" + container);
    var DTO = { 'barcodeid': barcodeid, 'barcode': $con.find("#txt_m_Barcode").val(), 'name': $con.find("#txt_m_Name").val(), 'itemcode': $con.find("#txt_m_ItemCode").val(), 'availibilityid': $con.find("#ddl_m_Availability").val(), 'weight': $con.find("#txt_m_Weight").val() };
    //string name,string family,int age,bool gender,int registererid,string job,string mobile,string phone,int addressid
    $.ajax({
        type: "POST",
        url: getPath("Services/Inventory.asmx/EditBarcode"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

function RemoveBarcodeElement(barcodeid, container) {

    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{barcodeid: '" + barcodeid + "'}",
        type: "Post",
        url: getPath("Services/Inventory.asmx/DeleteBarcode"),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isDone)
                getBarcodeList(container, { container: container, callbackmethod: getBarcodeList, fname: "", page_index: 0,
                    build: buildBarcodeList, servicename: "Inventory", methodname: "GetItemsList", print: false
                });
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function GetSingelBarcode(barcodeid, container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        url: getPath("Services/Inventory.asmx/GetSingleBarcode"),
        contentType: "application/json; charset=utf-8",
        data: "{barcodeid: '" + barcodeid + "' }",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var ItemVal = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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
        url: getPath("Services/Inventory.asmx/GetItemsList"),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (!isBarcode)
                buildProductList(response.d, container);
            if (isBarcode)
                buildPrintBarcode({ result: response.d.results, container: container })
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
    lsth.push({ title: "itemName", sort: "Name" });
    lsth.push({ title: "itemCode", sort: "ItemCode" });
    lsth.push({ title: "barcode", sort: "Barcode" });
    lsth.push({ title: "barcode", sort: "Barcode" });
    lsth.push({ title: "status" });
    lsth.push({ title: "category" });
    lsth.push({ title: "count" });
    //  lsth.push({ title: "واحد" });
    lsth.push({ title: "price" });

    var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
    var ItemList = "";
    for (var i = 0; i < List.length; i++) {
        var val = List[0, i];
        var trBody = {};
        trBody[0] = { name: "name", html: val.Name };
        trBody[1] = { name: "code", html: val.ItemCode }
        trBody[2] = { name: "barcodeDigit", html: val.Barcode }
        trBody[3] = { name: "barcode", html: val.Barcode };
        trBody[4] = { name: "status", html: val.Status };
        trBody[5] = { name: "Category", html: val.Category };
        trBody[6] = { name: "quantity", html: val.Quantity + " " + val.UnitType };
        //  trBody[6] = { name: "UnitType", html: val.UnitType };
        trBody[7] = { name: "Regular", html: "<span>" + val.Regular + "</span>" };
        lstb.push(trBody);
    }
    table = { header: lsth, body: lstb, container: container, hasFooter: false, divName: "Div_Print" };
    buildPrintTable(table);

}

function getBarcodeList(container, params) {
    var $con = $("#" + container);
    var first = true;
    var take = $con.find("#PageSize").val();
    var skip = 0;
    var page_index = 0
    var barcode = "", name = "", code = "", price = "";
    var DTO = [];
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
        DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
            'barcode': barcode, 'name': name, 'code': code, 'price': price, 'categoryid': getHierarchySelectedValue("hr_s_Category", container),
            'status': $con.find("#ddl_s_Availability").val(), 'quantityfrom': $con.find("#quantityFrom").val(), 'quantityto': $con.find("#quantityTo").val(),
            'regdatefrom': $con.find("#regdateFrom").val(), 'regdateto': $con.find("#regdateTo").val(), 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "GetItemsList"
        };
    }
    else {
        DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
            'barcode': barcode, 'name': name, 'code': code, 'price': price, 'categoryid': getHierarchySelectedValue("hr_s_Category", container),
            'status': $con.find("#ddl_s_Availability").val(), 'quantityfrom': $con.find("#quantityFrom").val(), 'quantityto': $con.find("#quantityTo").val(),
            'regdatefrom': $con.find("#regdateFrom").val(), 'regdateto': $con.find("#regdateTo").val(), 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "GetItemsList"
        };
        //var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': $con.find("#CustomerSearchCode").val(), 'namefamily': $container.find("#CustomerSearchName").val(), 'introducer': $container.find("#CustomerSearchIndtroducerName").val(), 'registerername': $container.find("#CustomerSearchRegName").val(), 'agefrom': $container.find("#CustomerSearchAgeStart").val(), 'ageto': $container.find("#CustomerSearchAgeEnd").val(), 'regdatefrom': $container.find("#CustomerSearchRegDateStart").val(), 'regdateto': $container.find("#CustomerSearchRegDateEnd").val() };
    }
    params["DTO"] = DTO;
    pageselectCallback(0, params, { container: "", fname: params.fname, pagingContainer: container,
        first: true, isOrder: false
    });
    //    $.ajax({
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        data: JSON.stringify(DTO),
    //        type: "Post",
    //        url: getPath("Services/Inventory.asmx/GetItemsList"),
    //        success: function (response) {
    //            if (!isAuthenticated(response))
    //                return;
    //            var opt = InventorygetOptionsFrom(response.d.count, container);
    //            $con.find("#paging").pagination(response.d.count, opt);
    //            InventorypageselectCallback(0, response, container, first);
    //        },
    //        error: function (response) { alert(response.responseText); }
    //    });
}


//function InventorygetOptionsFrom(count, container) {
//    var $con = $("#" + container);
//    var opt = { callback: InventorypageselectCallback };
//    $con.find("input:text").each(function () {
//        opt[this.name] = this.className.match(/numeric/) ? parseInt(this.value) : this.value;
//    });
//    opt.prev_show_always = false;
//    opt.next_show_always = false;
//    if ((count) < $con.find("#PageSize").val())
//        $con.find("#PageSize").css("display", "none");
//    else {
//        $con.find("#PageSize").css("display", "inline");
//    }
//    opt.items_per_page = $con.find("#PageSize").val();
//    opt.prev_text = "قبلی";
//    opt.next_text = "بعدی";
//    opt.container = container;
//    return opt;
//}


function buildBarcodeList(jq, pageoption) {
    var $con = $("#" + pageoption.pagingContainer);
    $con.find("#divFooter").removeClass("invisible");
    var appName = jq.d.appName;
    var onlineHost = jq.d.onlineHost;
    var sumPrice = jq.d.sumPrice;
    var sumQuantity = jq.d.sumQuantity;
    var table = {};
    var lstb = [];
    var lsth = [];
    var details = {};
    lsth.push({ title: "barcode", sort: "Barcode", width: "10%" });
    lsth.push({ title: "itemCode", sort: "ItemCode", width: "10%" });
    lsth.push({ title: "itemName", sort: "Name", width: "16%" });
    lsth.push({ title: "price", sort: "Regular", width: "10%" });
    lsth.push({ title: "status", sort: "AvailablityId", width: "10%" });
    lsth.push({ title: "category", sort: "Category", width: "10%" });
    lsth.push({ title: "count", sort: "Quantity", width: "6%" });
    lsth.push({ title: "registerDate", sort: "EnteryDate", width: "12%" });
    lsth.push({ title: "image", width: "10%" });
    lsth.push({ title: "deleteKey", width: "4%" });
    jq = jq.d.results;
    var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
    var ItemList = "";
    for (var i = 0; i < List.length; i++) {
        var val = List[0, i];
        var trBody = {};
        trBody[0] = { trId: val.BarcodeId };
        trBody[1] = { name: "barcode", html: val.Barcode, width: "10%" };
        trBody[2] = { name: "code", html: val.ItemCode, width: "10%" };
        trBody[3] = { name: "name", html: val.Name, width: "16%" };
        trBody[4] = { html: val.Regular, props: { name: "price", klass: "digit", width: "10%"} };
        trBody[5] = { html: val.Status, width: "10%" };
        trBody[6] = { html: val.Category, props: { width: "10%"} };
        trBody[7] = { html: val.Quantity + " " + val.UnitType, props: { width: "6%"} };
        trBody[8] = { html: val.EnteryDate, props: { date: val.EnteryDate, width: "12%", klass: "date"} };
        trBody[9] = { html: "<img class='imagefortable' src='" + onlineHost + "Data/" + appName + "Photos/" + val.Barcode + "/tiny_1.jpg'>", props: { width: "10%"} };
        lstb.push(trBody);
    }
    $con.find("#spTotalValue").html(sumPrice);
    $con.find("#spTotalQuantity").html(sumQuantity);
    table = { header: lsth, body: lstb, details: { rowClick: ClickBarcode }, heigth: 300, width: 500,
        container: pageoption.pagingContainer, divName: "BarcodeList", hasFooter: false, rowClickParams: { textboxId: "CustomerIntroducerCode" }
    };
    if (pageoption.pagingContainer != "divdialogCustomer") {
        details = { deleteFunction: RemoveBarcodeElement, rowClick: ClickBarcode };
        table = { header: lsth, body: lstb, details: details, heigth: 300, container: pageoption.pagingContainer, hasFooter: false,
            divName: "BarcodeList"
        };
    }

    buildTable(table);
    if (pageoption.pagingContainer == "divdialogCustomer")
        $con.dialog('open');
}


//function buildBarcodeList2(jq, container) {
//    var $con = $("#" + container);
//    if (jq.d.results != undefined) {
//        var appName = jq.d.appName;
//        var sumQuantity = jq.d.sumQuantity;
//        var sumPrice = jq.d.sumPrice;
//        if (appName == "/")
//            appName = "";
//        jq = jq.d.results;
//        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
//        var ItemList = "";
//        for (var i = 0; i < List.length; i++) {
//            var val = List[0, i];
//            ItemList += "<tr id='tr" + val.BarcodeId + "'>" +
//                "<td name='barcode' width='10%'>" + val.Barcode + "</td>" +
//                "<td name='code' width='10%'>" + val.ItemCode + "</td>" +
//                "<td name='name' width='20%'>" + val.Name + "</td> " +
//                "<td name='price' width='10%'>" + val.Regular + "</td> " +
//                "<td width='10%'>" + val.Status + "</td>" +
//                "<td width='10%'>" + val.Category + "</td>" +
//                "<td width='6%'>" + val.Quantity + " " + val.UnitType + "</td>" +
//                "<td width='8%' class='date' date='" + val.EnteryDate + "'>" + val.EnteryDate + "</td>" +
//                "<td name='image' width='10%' ><img class='imagefortable' src='Data/" + appName + "Photos/" + val.Barcode + "/tiny_1.jpg'></td>" +
//                "<td id='" + val.BarcodeId + "' name='delete' width='6%'><button id='modalClose'>حذف</button></td></tr>";
//        }
//        if (sumQuantity != undefined) {
//            var footer = "<tfoot id='" + container + "'><tr><td colspan='6'></td><td colspan='2'><span>totalQuantity</span></td><td colspan='2'>" + sumQuantity + "</td></tr><tr><td colspan='6'></td><td colspan='2'><span>totalPrice</span></td><td colspan='2'>" + sumPrice + "</td></tr></tfoot>";
//            $con.find("tfoot[id='" + container + "']").parent("table").remove();
//            $con.find("#BarcodeList").parent().remove('tfoot').append(footer);
//        }
//        $con.find("#BarcodeList").html(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
//        $con.find("[id=modalClose]").button({
//            icons: {
//                primary: "ui-icon-closethick"
//            },
//            text: false
//        }).click(function () {
//            if (confirm("آیا از حذف مطمئن هستید؟"))
//                RemoveBarcodeElement($(this).parent().prop("id"), container);
//            else
//                return;
//        });
//        //  $con.find("#BarcodeList").parent().tableScroll({ height: 380 });
//        //  TableAlter(container);
//        $con.find("tr[id*=tr]").find('td:not([name=delete])').click(function () {
//            ClickBarcode($(this).parent("tr"), container)
//        }).addClass("cursor");
//    }
//    else
//        $con.find("#BarcodeList").parent().tableScroll({ height: 380, width: contentwidth, flush: false });
//}

//function InventorypageselectCallback(page_index, jq, container, first) {
//    var $con = $("#" + container);
//    var barcode = "", name = "", code = "", price = "";
//    if (first) {
//        buildBarcodeList(jq, container);
//    }
//    else {
//        first = false;
//        var items_per_page = $con.find("#PageSize").val();
//        var itemcontent = '';
//        var take = items_per_page;
//        var skip = page_index == 0 ? 0 : (page_index * take);
//        if ($con.find("#divBarcodesearch").is(":visible")) {

//            var search = $con.find("#ddl_d_SearchBy").val();
//            if (search == "Barcode") {

//                barcode = $con.find("#txt_s_Inventory").val();
//            } if (search == "Name") {

//                name = $con.find("#txt_s_Inventory").val();
//            } if (search == "Code") {

//                code = $con.find("#txt_s_Inventory").val();
//            } if (search == "Price") {

//                price = $con.find("#txt_s_Inventory").val();
//            }

//            //        if (container == "selectCustomerContent") {
//            //            name = $con.find("#selectCustomerName").val();
//            //            regname = $con.find("#selectCustomerRegisterer").val();
//            //        }
//            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': barcode, 'name': name, 'code': code, 'price': price, 'categoryid': getHierarchySelectedValue("hr_s_Category", container), 'status': $con.find("#ddl_s_Availability").val(), 'quantityfrom': $con.find("#quantityFrom").val(), 'quantityto': $con.find("#quantityTo").val(), 'regdatefrom': $con.find("#regdateFrom").val(), 'regdateto': $con.find("#regdateTo").val(), 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "GetItemsList" };
//        }
//        else {
//            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': barcode, 'name': name, 'code': code, 'price': price, 'categoryid': getHierarchySelectedValue("hr_s_Category", container), 'status': $con.find("#ddl_s_Availability").val(), 'quantityfrom': $con.find("#quantityFrom").val(), 'quantityto': $con.find("#quantityTo").val(), 'regdatefrom': $con.find("#regdateFrom").val(), 'regdateto': $con.find("#regdateTo").val(), 'shopid': $("#userDefault").find("#ddl_s_Branch").val(), 'showOnline': ($con.find("#ddl_s_ShowOnline").val() == undefined ? "" : $con.find("#ddl_s_ShowOnline").val()), 'selectData': "GetItemsList" };
//            //var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': $con.find("#CustomerSearchCode").val(), 'namefamily': $container.find("#CustomerSearchName").val(), 'introducer': $container.find("#CustomerSearchIndtroducerName").val(), 'registerername': $container.find("#CustomerSearchRegName").val(), 'agefrom': $container.find("#CustomerSearchAgeStart").val(), 'ageto': $container.find("#CustomerSearchAgeEnd").val(), 'regdatefrom': $container.find("#CustomerSearchRegDateStart").val(), 'regdateto': $container.find("#CustomerSearchRegDateEnd").val() };
//        }
//        $.ajax({
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            data: JSON.stringify(DTO),
//            type: "Post",
//            url: getPath("Services/Inventory.asmx/GetItemsList"),
//            success: function (response) {
//                if (!isAuthenticated(response))
//                    return;
//                buildBarcodeList(response, container);
//            },
//            error: function (response) { alert(response.responseText); }
//        });

//        return false;
//    }
//    Sort(getBarcodeList, container);
//}

function ClickBarcode($dis, container) {
    createSubTab({ row: $dis, name: "a_InventoryList" });
    onRowClick($dis);
}

function ClickKardex($dis, container) {
    createSubTab({ row: $dis, name: "a_InventoryReportList" });
    onRowClick($dis);
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
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(DTO),
        type: "Post",
        url: getPath("Services/Inventory.asmx/GetItemsList"),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var opt = InventoryReportgetOptionsFrom(response.d.count, container);
            $con.find("#paging").pagination(response.d.count, opt);
            InventoryReportpageselectCallback(0, response, container, first);
        },
        error: function (response) { alert(response.responseText); }
    });
}



function buildBarcodeReportList(jq, container) {
    var $con = $("#" + container);
    if (jq.d.results != undefined) {
        var sumQuantity = jq.d.sumQuantity;
        var sumPrice = jq.d.sumPrice;
        jq = jq.d.results;
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
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: getPath("Services/Inventory.asmx/GetItemsList"),
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



function getColor(container) {
    var $con = $("#" + container);
    var ItemList = "";
    $.ajax({
        type: "POST",
        url: getPath("Services/InventorySetting.asmx/GetColorList"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var List = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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
        url: getPath("Services/InventorySetting.asmx/GetSizeParent"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var List = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
            var ItemList = "";
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                ItemList += " <h3><a href='#' >" + val.Size + "</a></h3><div id='div_" + val.SizeId + "'></div>";
            }
            $con.find("#divSizeAccordion").html(ItemList);
            $con.find("#divSizeAccordion").accordion({ heightStyle: "content", collapsible: true, active: false,
                change: function (event, ui) { if (ui.newContent.length > 0 && ui.newContent.html().length < 1) getSizeChild(ui.newContent.prop('id').replace("div_", ""), container) }
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
        url: getPath("Services/InventorySetting.asmx/GetSizeChild"),
        data: "{parentid: '" + sizeid + "'}",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var List = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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
        url: getPath("Services/Inventory.asmx/AddSizeColor"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
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
        url: getPath("Services/Inventory.asmx/GetColor_Size"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var List = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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
        url: getPath("Services/Inventory.asmx/EditColor_Size"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            getListColor_Size(barcodeid, container);
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function RemoveItemElement(itemid, container, barcodeid) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        data: "{itemid: '" + itemid + "'}",
        url: getPath("Services/Inventory.asmx/DeleteItem"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            getListColor_Size(barcodeid, container);
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}


function getListPrice(barcodeid, container) {
    var $con = $("#" + container);
    var ItemList = "";
    $.ajax({
        type: "POST",
        data: "{barcodeid: '" + barcodeid + "'}",
        url: getPath("Services/Inventory.asmx/GetPrice"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var List = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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
        data: "{barcodeid:'" + barcodeid + "',date:'" + $con.find("#txt_m_Date").val() + "',regular:'" + $con.find("#txt_m_RegularPrice").val() + "',Frinends:'" + $con.find("#txt_m_FrinendsPrice").val() + "',wholesale:'" + $con.find("#txt_m_WholesalePrice").val() + "',online:'" + $con.find("#txt_m_OnlinePrice").val() + "'}",
        url: getPath("Services/Inventory.asmx/AddPrice"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
            if (response.d.isDone)
                getListPrice(barcodeid, container);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function EditPrice(barcodeid, container) {

    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        data: "{priceid: '" + $con.find("#hd_m_priceid").val() + "',date:'" + $con.find("#txt_m_Date").val() + "',regular:'" + $con.find("#txt_m_RegularPrice").val() + "',Frinends:'" + $con.find("#txt_m_FrinendsPrice").val() + "',wholesale:'" + $con.find("#txt_m_WholesalePrice").val() + "',online:'" + $con.find("#txt_m_OnlinePrice").val() + "'}",
        url: getPath("Services/Inventory.asmx/EditPrice"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            getListPrice(barcodeid, container);
            $con.find("#btn_Submit").unbind().bind('click', function () {
                AddPrice(barcodeid, container);
            });
            $con.find("#txt_m_Date").val("");
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
    $con.find("#txt_m_Date").val($dis.find("td[name=Date]").html().split(' ')[1]);
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
        url: getPath("Services/Inventory.asmx/DeletePrice"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
            if (response.d.isDone)
                getListPrice(barcodeid, container);
        },
        error: function (response) { alert(response.responseText); }
    });
}


function getListCategory(barcodeid, container, first) {
    var $con = $("#" + container);
    var ItemList = "";
    ajgetListCategory = $.ajax({
        type: "POST",
        data: "{barcodeid: '" + barcodeid + "'}",
        url: getPath("Services/Inventory.asmx/GetCategoryList"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var List = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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
        url: getPath("Services/Inventory.asmx/AddCategory"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isDone)
                getListCategory(barcodeid, container);
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function RemoveCategoryElement(categoryid, container, barcodeid) {

    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        data: "{barcodeid:'" + barcodeid + "',categoryid:'" + categoryid + "'}",
        url: getPath("Services/Inventory.asmx/DeleteCategory"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isDone)
                getListCategory(barcodeid, container);
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function getListColorSystem(container) {
    var $con = $("#" + container);

    $.ajax({
        type: "POST",
        url: getPath("Services/InventorySetting.asmx/GetListColor"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var List = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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

function addColor(container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        data: "{color:'" + $con.find("#ddl_m_Color").val() + "',translate:'" + $con.find("#txt_m_Translate").val() + "'}",
        url: getPath("Services/InventorySetting.asmx/AddColor"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isdone)
                getListColorSystem(container);
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function RemoveColorElement(colorid, container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        data: "{colorid:'" + colorid + "'}",
        url: getPath("Services/InventorySetting.asmx/DeleteColor"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            getListColorSystem(container);
            translate(response.d);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function editColor(colorid, container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        data: "{colorid:'" + colorid + "',color:'" + $con.find("#ddl_m_Color").val() + "',translate:'" + $con.find("#txt_m_Translate").val() + "'}",
        url: getPath("Services/InventorySetting.asmx/EditColor"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isdone) {
                getListColorSystem(container);
                $con.find("#txt_m_Translate").val("");
                $con.find("#ddl_m_Color").val(0);
            }
            translate(response.d.msg);
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

function getListSize(container) {
    var $con = $("#" + container);

    $.ajax({
        type: "POST",
        url: getPath("Services/InventorySetting.asmx/GetListSize"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var List = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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
            $con.find("#divInventoryAccordion").accordion({ collapsible: true, heightStyle: "content" }); ;

        },
        error: function (response) { alert(response.responseText); }
    });

}


function AddPaternSize(container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        data: "{size:'" + $con.find("#txt_m_ParentSize").val() + "'}",
        url: getPath("Services/InventorySetting.asmx/AddParentSize"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            bindItemsForSelectCombo({ methodname: "GetPaternSizeList", servicename: "InventorySetting", id: "ddl_m_Size", container: container, headertext: "انتخاب جزئیات" });
            getListSize(container);
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function AddSize(container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        data: "{size:'" + $con.find("#txt_m_Size").val() + "',parentsizeid:'" + $con.find("#ddl_m_Size").val() + "'}",
        url: getPath("Services/InventorySetting.asmx/AddSize"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isdone)
                getListSize(container);
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function editSize(sizeid, container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        data: "{sizeid:'" + sizeid + "', size:'" + $con.find("#txt_m_Size").val() + "',parentsizeid:'" + $con.find("#ddl_m_Size").val() + "'}",
        url: getPath("Services/InventorySetting.asmx/EditSize"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isdone) {
                getListSize(container);
                $con.find("#ddl_m_Size").val(0);
                $con.find("#txt_m_Size").val("");
            }
            translate(response.d.msg);
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
        type: "POST",
        data: "{sizeid:'" + sizeid + "'}",
        url: getPath("Services/InventorySetting.asmx/DeleteSize"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            getListSize(container);
            translate(response.d);
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
        url: getPath("Services/Inventory.asmx/AddUnit"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isDone)
                GetUnitList(barcodeid, container)
            translate(response.d.msg);
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
        url: getPath("Services/Inventory.asmx/GetUnitList"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            buildUnitList(response.d, container)
        },
        error: function (response) {
            //alert(response.d.msg); 
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
        url: getPath("Services/Inventory.asmx/EditUnit"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d != null && response.d.isDone == true) {
                GetUnitList($("#" + container).find("#barcodeid").val(), container);
            }
            translate(response.d.msg);
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
        url: getPath("Services/Inventory.asmx/DeleteUnit"),
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d != null && response.d.isDone == true)
                $("#tr" + dis).remove();
            translate(response.d.msg);
        },
        error: function (response) {
            alert(response.responseText);

        }
    });
}

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
        aComplete({ methodname: "GetCompletionListByProperty", servicename: "AtuoComplete", id: "txtPropertyValueAdd", boxId: "txtPropertyValueAdd", container: container + "dialogAddProperty", minlength: 2, autofocus: false, limit: 20, data: { propertyId: "divPropertyAdd"} });
    }
}
function getAllProperties(barcodeid, dialog, container) {
    var $con = $("#" + container);
    var DTO = { 'barcodeid': barcodeid, 'propertyId': getHierarchySelectedValue("divProperty", container) };
    $.ajax({
        type: "POST",
        data: JSON.stringify(DTO),
        url: getPath("Services/Inventory.asmx/getAllPropertys"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            //                if(response.d.isdone)
            //            GetPropertyList(barcodeid, container)
            var table = "<table class='table' ><tbody>";
            var group = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
            for (var j = 0; j < group.length; j++) {
                var val = group[0, j];
                table += "<tr ><td style=' font-weight: bold; background-color: #CCFFCC' colspan='3'>" + val.Property + "</td></tr>";
                var Properties = (typeof val.properties) == 'string' ? eval('(' + val.properties + ')') : val.properties;
                // table += "<tr  style='direction:ltr'>"
                for (var p = 0; p < Properties.length; p++) {
                    var val = Properties[0, p];
                    table += "<tr id='tr" + val.PropertyId + "'><td>" + val.Property + "</td><td><input style='width:100%;height:25px;' id='pr" + val.PropertyId + "' propertyId='" + val.PropertyId + "' type='text' value='" + val.Value + "'/></td><td id='delete'>" + (val.Value != "" ? "<button propId='" + val.PropertyId + "' id='btnDelete'>حذف</button>" : "") + "</td></tr>";
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
                deleteProperty($(this).attr("propId"), container + "dialogAddProperty", container);
            else
                return;
        });
        $con.find("table").find("input:text").each(function () {
            aComplete({ methodname: "GetCompletionListByProperty", servicename: "AtuoComplete", id: $(this).attr("id"), boxId: $(this).attr("id"), container: container, minlength: 2, autofocus: false, limit: 20, data: { propertyId: $(this).attr("propertyId")} });
        });
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
        url: getPath("Services/Inventory.asmx/getProperty"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            //                if(response.d.isdone)
            //            GetPropertyList(barcodeid, container)
            var table = "<table class='table' ><tbody>";
            var group = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
            for (var j = 0; j < group.length; j++) {
                var val = group[0, j];
                table += "<tr ><td colspan='3'>" + val.Property + "</td></tr>";
                var Properties = (typeof val.properties) == 'string' ? eval('(' + val.properties + ')') : val.properties;
                // table += "<tr  style='direction:ltr'>"
                for (var p = 0; p < Properties.length; p++) {
                    var val = Properties[0, p];
                    table += "<tr id='tr" + val.PropertyId + "'><td>" + val.Property + "</td><td>" + val.Value + "</td><td id='delete'><button propId='" + val.PropertyId + "' id='btnDelete'>حذف</button></td></tr>";
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
                    deleteProperty($(this).attr("propId"), container + "dialogAddProperty", container);
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
        url: getPath("Services/Inventory.asmx/AddProperty"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isDone)
                getProperty(barcodeid, container + "dialogAddProperty", container);
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}
function updateProperties(barcodeid, container) {

    var $con = $("#" + container);

    var propList = [];

    $con.find("table").find("input:text").each(function () {
        var prop = {}
        prop["value"] = $(this).val();
        prop["id"] = $(this).attr("propertyId");
        propList.push(prop);
    });
    var DTO = { 'barcodeid': barcodeid, 'propList': propList
    };
    $.ajax({
        type: "POST",
        data: JSON.stringify(DTO),
        url: getPath("Services/Inventory.asmx/UpdateProperties"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isDone)
                getAllProperties(barcodeid, container, container);

            // alert("done");
            //getProperty(barcodeid, container + "dialogAddProperty", container);
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}
function deleteProperty(propertyId, dialog, container) {
    var $con = $("#" + container);
    var DTO = { 'propertyId': propertyId };
    $.ajax({
        type: "POST",
        data: JSON.stringify(DTO),
        url: getPath("Services/Inventory.asmx/deleteProperty"),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isDone)
                $con.find("#tr" + propertyId).remove();
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}

//function GetPropertyList(barcodeid, container) {
//    var $con = $("#" + container);
//    var ItemList = "";
//    var DTO = { 'barcodeid': barcodeid };
//    $.ajax({
//        type: "POST",
//        data: JSON.stringify(DTO),
//        url: getPath("Services/Inventory.asmx/getProperty"),
//        contentType: "application/json; charset=utf-8",
//        success: function (response) {
//            if (!isAuthenticated(response))
//                return;
//            buildUnitList(response.d, container)
//        },
//        error: function (response) {
//            //alert(response.d.msg); 
//        }
//    });
//}
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

function loadItemDefinition(barcodeid, container, first) {
    if (first) {
        var $con = $("#" + container);
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
        url: getPath("Services/InventorySetting.asmx/GetItemDefinition"),
        success: function (response) {
            if (response.d.canEdit) {
                $con.find("#divDefinition").html("<textarea class='editor' name='txtDefinition'>" + (response.d.isDone ? response.d.result == null ? "" : response.d.result : "") +
                "</textarea></n><button id='btnSaveDefintion'>save</button>");
                $con.find(".editor").tinymce({
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
                    save_onsavecallback: function () { AddItemDefinition(barcodeid, container); },
                    // Example content CSS (should be your site CSS)
                    content_css: '../../Scripts/tinymce/css/content.css',
                    convert_urls: false
                });

                $con.find("#btnSaveDefintion").button().unbind('click').bind('click', function () {
                    AddItemDefinition(barcodeid, container);
                });
            }
            else {
                $con.find("#divDefinition").html((response.d.isDone ? "<div style='padding-left:5em;'>" + response.d.result + "</div>" : ""));
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
        url: getPath("Services/InventorySetting.asmx/AddItemDefinition"),
        success: function (response) {
            translate(response.d.msg);
        },
        error: function (response) { alert(response.responseText); }
    });
}
//--------------------js inventory end-----------------------



//--------------------js counter begin-----------------------
function loadCounterAdd(container, first) {
    var $con = $("#" + container);
    bindItemsForSelectCombo({ servicename: "Shop", methodname: "getShopName", headertext: "شعبه اصلی", id: "ParentShopCounter", container: container });
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
        }).die().live('click', function (event) {
            getCounterList(container, { container: container, callbackmethod: getCounterList, fname: "", page_index: 0,
                build: buildCounterList, servicename: "Counter", methodname: "GetCounterlist", print: false
            });
        });
        getCounterList(container, { container: container, callbackmethod: getCounterList, fname: "", page_index: 0,
            build: buildCounterList, servicename: "Counter", methodname: "GetCounterlist", print: false
        });
        // GetSubMenuItems("a_CounterList", container);
    }
}

function loadCounterEdit(counterid, container, first) {
    if (first) {
        var $con = $("#" + container);
        bindItemsForSelectCombo({ servicename: "Shop", methodname: "getShopName", headertext: "شعبه اصلی", id: "ParentShopCounter", container: container });
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

function loadCounterAmount(counterid, container, first) {
    if (first) {
        var $con = $("#" + container);
        $con.find("#refreshCounterAmountList").button({ icons: {
            primary: "ui-icon-refresh"
        },
            text: false
        }).die().live('click', function (event) {
            getCurrencyCounter(counterid, container);
        });
        getCurrencyCounter(counterid, container);
    }
}

function addCounter(container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        url: getPath("Services/Counter.asmx/AddCounter"),
        contentType: "application/json; charset=utf-8",
        data: "{code: '" + $con.find("#text_Code").val() +
              "', shopid: '" + $con.find("#ParentShopCounter").val() + "'}",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isdone) {
                $("#ddl_m_Counter").append("<option value='" + response.d.counterId + "'>" + response.d.counterName + "</option>");
                $("#ddl_m_Counter").attr("disabled", false);
            }
            translate(response.d.msg);
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
        url: getPath("Services/Counter.asmx/EditCounter"),
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + counterid + "', code: '" + $con.find("#text_Code").val() +
              "', shopid: '" + $con.find("#ParentShopCounter").val() + "'}",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
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
    var List = (typeof jq.d.results) == 'string' ? eval('(' + jq.d.results + ')') : jq.d.results;
    var ItemList = "";
    if (List != null)
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            if (!container.params.print)
                trBody[0] = { trId: val.CounterId };
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
    //        $.ajax({
    //            type: "POST",
    //            url: getPath("Services/Counter.asmx/GetCounterlist"),
    //            contentType: "application/json; charset=utf-8",

    //            success: function (response) {
    //                if (!isAuthenticated(response))
    //                    return;
    //                var shop = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
    //                var shopItem = "";
    //                for (var j = 0; j < shop.length; j++) {
    //                    var val = shop[0, j];
    //                    shopItem += "<tr id='tr" + val.CounterId + "'>" +
    //                    "<td name='Code' width='40%'>" + val.Code + "</td>" +
    //                    "<td name='name' width='40%' id='" + val.ShopId + "'>" + val.Name + "  " + val.ShopCode + "</td>" +
    //                     "<td id='delete' width='20%'><button id='a_Button'>حذف</button></td></tr>";
    //                }
    //                $con.find("#CounterList").html(shopItem).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
    //                //$con.find("#CounterList").parent().tableScroll({ height: 380 });
    //                //   TableAlter(container);
    //                $con.find("[id=a_Button]").button({
    //                    icons: {
    //                        primary: "ui-icon-closethick"
    //                    },
    //                    text: false
    //                }).click(function () {
    //                    if (confirm("آیا از حذف مطمئن هستید؟"))
    //                        RemoveCounterElement($(this).parents("tr").prop("id").replace("tr", ""), container);
    //                    else
    //                        return;
    //                });
    //                $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
    //                    var tabId = createSubTab({ row: $(this).parent("tr"), name: "a_CounterList" });
    //                }).addClass("cursor");
    //            },
    //            error: function (response) { alert(response.responseText); }
    //        });
}

function clickCounter($dis, container) {

    createSubTab({ row: $dis, name: "a_CounterList" });
    itemId = $dis.prop("id").replace("tr", "");
    //  employeeid = itemId;
    onRowClick($dis);
}

function getCurrencyCounter(counterid, container) {
    var $con = $("#" + container);
    var amounttotal = 0;
    $.ajax({
        type: "POST",
        url: getPath("Services/Counter.asmx/GetCurrencyCounter"),
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + counterid + "'}",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var shop = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
            var shopItem = "";
            for (var j = 0; j < shop.length; j++) {
                var val = shop[0, j];
                shopItem += "<tr id='tr'>" +
                "<td width='30%'>" + val.Currency + "</td>" +
                "<td width='30%'>" + val.Amount + "</td>" +
                "<td name='Amount' width='35%'>" + (val.Amount * 1 * val.Sell * 1) + "</td></tr>";
                amounttotal += (val.Amount * 1 * val.Sell * 1);
            }
            $con.find("#txt_d_TotalAmount").val(amounttotal);
            $con.find("#CounterAmountList").html(shopItem).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
            // $con.find("#CounterAmountList").parent().tableScroll({ height: 380 });
            //  TableAlter(container);
        },
        error: function (response) { alert(response.responseText); }
    });
}

function RemoveCounterElement(CounterId, container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        url: getPath("Services/Counter.asmx/DeleteCounter"),
        contentType: "application/json; charset=utf-8",
        data: "{Cid: '" + CounterId + "'}",
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d.msg);
            if (response.d.isDone)
                getCounterList(container, { container: container, callbackmethod: getCounterList, fname: "", page_index: 0,
                    build: buildCounterList, servicename: "Counter", methodname: "GetCounterlist", print: false
                });

        },
        error: function (response) { alert(response.responseText); }
    });
}
//--------------------js counter end-----------------------



//--------------------js currency begin-----------------------
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
    bindItemsForSelectCombo({ servicename: "Currency", methodname: "CurrensyList", headertext: "انتخاب ارز", id: "currencyNameAdd", container: container });
    bindItemsForSelectCombo({ servicename: "Currency", methodname: "CurrensyList", headertext: "انتخاب ارز", id: "search_select", container: container });
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
            build: buildCurrencyRateList, servicename: "Currency", methodname: "GetCurrencyRate", print: false
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
        //        $con.find("#PageSize").die().live('change', function () { getCurrencyRate(container); });
        $con.find("#Button_advanceSearch").button().click(function () {
            //            getCurrencyRate(container);
            getCurrencyRate(container, { container: container, callbackmethod: getCurrencyRate, fname: "", page_index: 0,
                build: buildCurrencyRateList, servicename: "Currency", methodname: "GetCurrencyRate", print: false
            });
        });
        $con.find("#Button_search").button({ icons: {
            primary: "ui-icon-search"
        },
            text: true
        }).click(function () {
            getCurrencyRate(container, { container: container, callbackmethod: getCurrencyRate, fname: "", page_index: 0,
                build: buildCurrencyRateList, servicename: "Currency", methodname: "GetCurrencyRate", print: false
            });
            //            getCurrencyRate(container);
        });

    }
}

function deleteCurrency(container) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        url: getPath("Services/Currency.asmx/DeleteCurrency"),
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + $con.find("#CurrencyID").val() + "'}",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d);
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
        url: getPath("Services/Currency.asmx/AddCurrency"),
        contentType: "application/json; charset=utf-8",
        data: "{name: '" + $con.find("#currency_Name").val() + "', symbol: '" + $con.find("#currency_Symbol").val() + "'}",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d);
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
        url: getPath("Services/Currency.asmx/EditCurrency"),

        contentType: "application/json; charset=utf-8",
        data: "{id: '" + $con.find("#CurrencyID").val() + "', name: '" + $con.find("#currency_Name").val() + "', symbol: '" +
         $con.find("#currency_Symbol").val() + "'}",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d);
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
        url: getPath("Services/Currency.asmx/setIndexCurrency"),
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + currencyId + "'}",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            getCurrency(container);
            translate(response.d.msg);
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
        url: getPath("Services/Currency.asmx/CurrensyList"),
        contentType: "application/json; charset=utf-8",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var Currency = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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

//function currencypageselectCallback(page_index, jq, container, first) {
//    var $con = $("#" + container);
//    var advance = (($con.find("#moreFilter:visible").length > 0) ? true : false);
//    if (advance) {
//        datefrom = $con.find("#datefrom").val();
//        buyfrom = $con.find("#buyfrom").val();
//        selfrom = $con.find("#sellfrom").val();
//        curid = $con.find("#search_select").val();
//    }
//    else {
//        datefrom = $con.find("#rate_date").val();
//        buyfrom = $con.find("#text_buyrate").val();
//        selfrom = $con.find("#text_sellrate").val();
//        curid = $con.find('#currencyNameAdd').val();
//        $con.find("#datefrom").val("");
//        $con.find("#dateto").val("");
//        $con.find("#buyfrom").val("");
//        $con.find("#buyto").val("");
//        $con.find("#sellfrom").val("");
//        $con.find("#sellto").val("");

//    }

//    if (first) {
//        var currencyrate = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
//        var currencyrateitem = "";
//        for (var i = 0; i < currencyrate.length; i++) {
//            var val = currencyrate[0, i];
//            currencyrateitem += "<tr id='tr" + val.id + "'>" +
//                "<td name='crid' width='25%' id='" + val.crid + "'>" + val.name + " " + val.symbol + "</td>" +
//                "<td name='date' width='25%'>" + val.date + "</td>" +
//                "<td name='buy' width='25%'>" + val.buy + "</td>" +
//                "<td name='sell' width='25%'>" + val.sell + "</td></tr>";
//        }

//        $con.find("#currencyRateList").html(currencyrateitem).parent().tableScroll({ height: 380, width: contentwidth, flush: false }); ;
//        $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
//            ClickCurrencyRate($(this).parent("tr"), container)
//        }).addClass("cursor");
//        //  $con.find("#currencyRateList").parent().tableScroll({ height: 380 });
//        //  TableAlter(container);
//    }
//    else {
//        first = false;
//        var items_per_page = $con.find("#PageSize").val();
//        var itemcontent = '';
//        var take = items_per_page;
//        var skip = page_index == 0 ? 0 : (page_index * take);
//        $.ajax({
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            data: "{skip: '" + skip + "',take :'" + take + "',currentPage :'" + page_index + "',datefrom: '" + datefrom + "',dateto :'" + $('#dateto').val()
//                  + "',buyratefrom :'" + buyfrom
//                  + "',buyrateto :'" + $('#buyto').val() + "',sellratefrom :'" + selfrom + "',sellrateto :'" + $('#sellto').val()
//                  + "',currencyid :'" + curid + "',first :'" + first + "', sort: '" + sortid
//                  + "', advance: '" + advance + "'}",
//            type: "Post",
//            url: getPath("Services/Currency.asmx/GetCurrencyRate"),
//            success: function (response) {
//                if (!isAuthenticated(response))
//                    return;
//                var currencyrate = (typeof response.d.results) == 'string' ? eval('(' + response.d.results + ')') : response.d.results;
//                var currencyrateitem = "";
//                for (var i = 0; i < currencyrate.length; i++) {
//                    var val = currencyrate[0, i];
//                    currencyrateitem += "<tr id='tr" + val.id + "'> <td name='crid' id='" + val.crid + "'>" + val.name + " " + val.symbol + "</td>" +
//                "<td name='date'>" + val.date + "</td>" +
//                "<td name='buy'>" + val.buy + "</td>" +
//                "<td name='sell'>" + val.sell + "</td></tr>";

//                }
//                $con.find("#currencyRateList").html(currencyrateitem).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
//                $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
//                    ClickCurrencyRate($(this).parent("tr"), container)
//                }).addClass("cursor");
//                // $con.find("#currencyRateList").parent().tableScroll({ height: 380 });
//                //  TableAlter(container);

//            },
//            error: function (response) { alert(response.responseText); }
//        });

//        return false;
//    }
//    Sort(getCurrencyRate, container);
//}


function buildCurrencyRateList(jq, params) {
    var $con = $("#" + params.pagingContainer);
    jq = jq.d.results;
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

    //    $.ajax({
    //        contentType: "application/json; charset=utf-8",
    //        data: JSON.stringify(DTO),
    //        type: "Post",
    //        url: getPath("Services/Currency.asmx/GetCurrencyRate"),
    //        success: function (response) {
    //            if (!isAuthenticated(response))
    //                return;
    //            var opt = currencygetOptionsFromForm(response.d.count, container);
    //            $con.find("#paging").pagination(response.d.count, opt);
    //            currencypageselectCallback(0, response.d.results, container, first);
    //        },
    //        error: function (response) { alert(response.responseText); }
    //    });
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
        url: getPath("Services/Currency.asmx/CurrensyList"),
        contentType: "application/json; charset=utf-8",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            var Currency = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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
        url: getPath("Services/Currency.asmx/AddCurrencyRate"),
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
                build: buildCurrencyRateList, servicename: "Currency", methodname: "GetCurrencyRate", print: false
            });
            //            getCurrencyRate(container);
            translate(response.d);
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
        url: getPath("Services/Currency.asmx/EditCurrencyRate"),
        contentType: "application/json; charset=utf-8", //int idcurrency, decimal buy, decimal sell, string date
        data: JSON.stringify(DTO),
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d);
            $con.find("currencyNameAdd").val(0);
            // $("input[name='currencyNameAdd'][value='0']").trigger('click');
            $con.find("#rate_date").val("");
            $con.find("#text_buyrate").val("");
            $con.find("#text_sellrate").val("");
            //            getCurrencyRate(container);
            getCurrencyRate(container, { container: container, callbackmethod: getCurrencyRate, fname: "", page_index: 0,
                build: buildCurrencyRateList, servicename: "Currency", methodname: "GetCurrencyRate", print: false
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
        url: getPath("Services/Currency.asmx/DeleteCurrencyRate"),
        contentType: "application/json; charset=utf-8", //int idcurrency, decimal buy, decimal sell, string date
        data: "{id: '" + id + "'}",

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            translate(response.d);
            $con.find("#currencyNameAdd").val(0);
            //    $("input[name='currencyNameAdd'][value='0']").trigger('click');
            $con.find("#rate_date").val("");
            $con.find("#text_buyrate").val("");
            $con.find("#text_sellrate").val("");
            //            getCurrencyRate(container);
            getCurrencyRate(container, { container: container, callbackmethod: getCurrencyRate, fname: "", page_index: 0,
                build: buildCurrencyRateList, servicename: "Currency", methodname: "GetCurrencyRate", print: false
            });
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

//--------------------js currency end-----------------------



//--------------------js employee begin-----------------------



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
        aComplete({ methodname: "GetCompletionListByEmployeeName", servicename: "AtuoComplete", id: "text_empmaneger", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "text_empmaneger" });
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
        aComplete({ methodname: "GetCompletionListByEmployeeName", servicename: "AtuoComplete", id: "text_empmaneger", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "text_empmaneger" });
        bindHierarchyData({ id: "divEmployeeAddress", container: container, table: "address", canmodify: true, css: "selectsmall1 required validate" });
    }
}

function loadEmployeeRole(id, container, first) {
    if (first) {
        var $con = $("#" + container);
        getrole(id, "", container);
    }
}

function loadEmployeeShop(id, container, first) {
    getEmployeeShopList(id, container);
    if (first) {
        var $con = $("#" + container);
        bindItemsForSelectCombo({ methodname: "getShopNameByUser", servicename: "Shop", headertext: "انتخاب شعبه", id: "ParentEmployeeShop", container: container });
        $con.find("#addEmployeeShop").button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        }).die().live('click', function (event) {
            addEmployeeShop(id, container);
        });
        $("#" + container).find("#refreshEmployeeShopList").button({ icons: {
            primary: "ui-icon-refresh"
        },
            text: false
        }).unbind('click').click(function () {
            getEmployeeShopList(id, container);
            bindItemsForSelectCombo({ methodname: "getShopNameByUser", servicename: "Shop", headertext: "انتخاب شعبه", id: "ParentEmployeeShop", container: container });
        });
    }
}

function loadEmployeeCounter(id, container, first) {
    if (first) {
        var $con = $("#" + container);
        //bindItemsForSelect("getCounterName", "Counter", container);
        bindItemsForSelectCombo({ methodname: "getCounterNameForUser", servicename: "Counter", headertext: "انتخاب صندوق", id: "ParentEmployeeCounter", container: container });
        $con.find("#addEmployeeCounter").button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        }).die().live('click', function (event) {
            addEmployeeCounter(id, container);
        });
        $("#" + container).find("#refreshEmployeeCounterList").button({ icons: {
            primary: "ui-icon-refresh"
        },
            text: false
        }).unbind('click').click(function () {
            getEmployeeCounterList(id, container);
            bindItemsForSelectCombo({ methodname: "getCounterNameForUser", servicename: "Counter", headertext: "انتخاب صندوق", id: "ParentEmployeeCounter", container: container });
        });
    }
    getEmployeeCounterList(id, container);
}

function loadEmployeeList(container, first) {
    if (first) {
        sortid = "PersonId desc";
        var $con = $("#" + container);
        //  GetSubMenuItems("a_EmployeeList", container);
        $con.find("#refreshEmployeeList").button({ icons: {
            primary: "ui-icon-refresh"
        },
            text: false
        }).unbind('click').click(function () {
            //            getEmployeeList(container);
            getEmployeeList(container, { container: container, callbackmethod: getEmployeeList, fname: "", page_index: 0,
                build: buildEmployeeList, servicename: "EmployeeService", methodname: "EmployeeList", print: false
            });
        });
        getEmployeeList(container, { container: container, callbackmethod: getEmployeeList, fname: "", page_index: 0,
            build: buildEmployeeList, servicename: "EmployeeService", methodname: "EmployeeList", print: false
        });
        //        getEmployeeList(container);
    }
}

function loadEmployeeAccessDetails(employeeid, container, first) {
    if (first) {
        var $con = $("#" + container);
        $con.find("#btn_ChangeEmail").die().live('click', function (event) {
            ChangeUserName(container, employeeid)
        });
        $con.find("#btn_changePassword").button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        }).die().live('click', function (event) {
            if (validateAll($con.find("#div_pass")))
                ChangePassword(container, employeeid)
        });
        $con.find("#btn_editEmail").button({ icons: {
            primary: "ui-icon-disk"
        },
            text: true
        }).die().live('click', function (event) {
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
        url: getPath("Services/EmployeeService.asmx/SetUserStatus"),
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + employeeId + "', status: '" + status + "'}",
        error: function (response) {
            translate("error");
        },
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            return response.d.msg;
        }
    });
}
function getEmployeeEmail(container, employeeId) {
    var $con = $("#" + container);

    $.ajax({
        type: "POST",
        url: getPath("Services/EmployeeService.asmx/GetEmployeeEmail"),
        contentType: "application/json; charset=utf-8",
        data: "{id: '" + employeeId + "'}",
        error: function (response) {
            translate("error");
        },
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isdone) {
                $con.find("#text_empemailEdit").val(response.d.msg);
                if (response.d.status) {
                    $con.find("#cb_userStatus" + container).attr("checked", true);
                    $con.find("#cb_userStatus" + container).button("option", "label", "غیرفعال");
                }
                else {
                    $con.find("#cb_userStatus" + container).attr("checked", false);
                    $con.find("#cb_userStatus" + container).button("option", "label", "فعال");
                }
            }
            else
                translate(response.d.msg);
        }

    });
}

function ChangeEmail(container, employeeId) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        url: getPath("Services/EmployeeService.asmx/ChangeEmail"),
        contentType: "application/json; charset=utf-8",
        data: "{email: '" + $con.find("#text_empemailEdit").val() + "', id: '" + employeeId + "'}",
        error: function (response) {
            translate("error");
        },
        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d.isdone)
                alert("ایمیل با موفقیت ثبت شد.")
            else
                translate(response.d.msg)
        }

    });
}

function ChangePassword(container, employeeId) {
    var $con = $("#" + container);
    $.ajax({
        type: "POST",
        url: getPath("Services/Login.asmx/ChangePassword"),
        contentType: "application/json; charset=utf-8",
        data: "{oldPassword: '" + $con.find("#txt_s_OldPassword").val() + "', newPassword: '" + $con.find("#txt_s_NewPassword").val() + "', passwordConfirm: '" + $con.find("#txt_s_PasswordConfirm").val() + "', id: '" + employeeId + "'}",
        error: function (response) {
            translate("error");
        },

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d == "different")
                alert("تکرار کلمه عبور با کلمه عبور برابر نیست.");
            else
                if (response.d == "done")
                    alert("کلمه عبور ا موفقیت ثبت شد.")
                else if (response.d == "incorrect")
                    alert("کلمه عبور صحیح نیست.")
        }

    });

}

function ChangeUserName(container, employeeId) {
    var $con = $("#" + container);
    $.ajax({

        type: "POST",
        url: getPath("Services/Login.asmx/ChangeUserName"),
        contentType: "application/json; charset=utf-8",
        data: "{password: '" + $con.find("#txt_s_CurrentPassword").val() + "', newUser: '" + $con.find("#txt_s_NewUserName").val() + "', userConfirm: '" + $con.find("#txt_s_UserNameConfirm").val() + "', id: '" + employeeId + "'}",
        error: function (response) {
            translate("error");
        },

        success: function (response) {
            if (!isAuthenticated(response))
                return;
            if (response.d == "exist")
                alert("نام کاربری مجاز نیست.");
            else
                if (response.d == "different")
                    alert("ایمیل با تکرار ایمیل برابر نیست.")
                else
                    document.getElementById("userEmail").innerHTML = "<strong>نام کاربری فعلی شما </strong>" + response.d + "<strong> می باشد.</strong>"
            }

        });

    }

    function addEmployeeCounter(id, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: getPath("Services/EmployeeService.asmx/AddEmployeeCounter"),
            contentType: "application/json; charset=utf-8",
            data: "{counterid: '" + $con.find("#ParentEmployeeCounter").val() +
              "', personid: '" + id + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d.msg);
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
            url: getPath("Services/EmployeeService.asmx/getEmployeeCounterList"),
            contentType: "application/json; charset=utf-8",
            data: "{ personid: '" + id + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var shop = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
                var shopItem = "";
                for (var j = 0; j < shop.length; j++) {
                    var val = shop[0, j];
                    shopItem += "<tr id='tr" + val.CounterId + "'>" +
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
            url: getPath("Services/EmployeeService.asmx/DeleteEmployeeCounter"),
            contentType: "application/json; charset=utf-8",
            data: "{counterid: '" + counterid +
              "', personid: '" + personid + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.isDone)
                    getEmployeeCounterList(personid, container);
                translate(response.d.msg);

            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function addEmployeeShop(id, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: getPath("Services/EmployeeService.asmx/AddEmployeeShop"),
            contentType: "application/json; charset=utf-8",
            data: "{shopid: '" + $con.find("#ParentEmployeeShop").val() +
              "', personid: '" + id + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d.msg);
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
            url: getPath("Services/EmployeeService.asmx/getEmployeeShopList"),
            contentType: "application/json; charset=utf-8",
            data: "{ personid: '" + id + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var shop = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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
            url: getPath("Services/EmployeeService.asmx/DeleteEmployeeShop"),
            contentType: "application/json; charset=utf-8",
            data: "{shopid: '" + shopid +
              "', personid: '" + personid + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d);
                getEmployeeShopList(personid, container);

            },
            error: function (response) { alert(response.responseText); }
        });
    }
    function getroleChild(id, pid, appId, container) {
        var $con = $("#" + container);

        $.ajax({
            type: "POST",
            url: getPath("Services/EmployeeService.asmx/getRoleList"),
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + id + "',parentid: '" + pid + "',appId: '" + appId + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var role = (typeof (response.d)) == 'string' ? eval('(' + response.d + ')') : response.d;
                var roleItem = "";
                roleItem = "<div><table class='table line'>" +
                "<tbody id='roleList'>";
                for (var j = 0; j < role.length; j++) {
                    var val = role[0, j];
                    //var check = "";
                    roleItem += "<tr appId='" + appId + "' id='" + id +
                                     "'> <td id='" + container + "' ><input name='cbRole' type='checkbox'  " + ((val.isinrole == true) ? "checked='checked'" : "") +
                                     "   /> </td> <td id='" + val.rolename + "' name='rolename'><span>" + val.rolename +
                                      "</span></td> </tr>";
                }
                roleItem += "</tbody></table></div>";
                $con.find("#div_" + pid).html(roleItem);
                $con.find("[name='cbRole']").unbind("click").bind("click", function () { ocCheckenterFolder(this, appId); })
                $con.find("#divRolesAccordion").accordion({ collapsible: true, heightStyle: "content" });

                //  TableAlter(container);
            },
            error: function (response) { }
        });
    }


    function getrole(id, appId, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: getPath("Services/EmployeeService.asmx/getRoleParent"),
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + id + "',appId: '" + appId + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var role = (typeof (response.d)) == 'string' ? eval('(' + response.d + ')') : response.d;
                var roleItem = "";
                for (var j = 0; j < role.length; j++) {

                    var val = role[0, j];
                    roleItem += " <h3><a href='#' style='font-size: 16px!important'>" + val.rolename + "</a></h3><div id='div_" + val.roleid + "'></div>";

                }
                $con.find("#divRolesAccordion").html(roleItem);
                $con.find("#divRolesAccordion").accordion({ heightStyle: "content", collapsible: true, active: false,
                    change: function (event, ui) { if (ui.newContent.length > 0 && ui.newContent.html().length < 1) getroleChild(id, ui.newContent.prop('id').replace("div_", ""), appId, container) }
                });
                $con.find("#roleList").html(roleItem).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
                //  $con.find("#roleList").parent().tableScroll({ height: 380 });
                //  TableAlter(container);
            },
            error: function (response) { }
        });
    }

    function ocCheckenterFolder(dis, appId) {
        var id = $(dis).parent().parent().prop("id");
        $.ajax({
            type: "POST",
            url: getPath("Services/EmployeeService.asmx/AddroleforUser"),
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + id + "', role: '" + $(dis).parent().parent().find('td[name=rolename]').prop("id") + "', ischecked: '" + $(dis).is(':checked') + "', appId: '" + appId + "' }",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                getroleChild(id, response.d, $(dis).parent().attr('appId'), $(dis).parent().prop('id'));
                if (response.d.isdone)
                    alert("نقش ها با موفقیت ثبت شد.");
                else {
                    $(dis).attr("checked", !$(dis).checked);
                    translate(response.d.msg);
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function oncheckforcheng(dis) {
        $.ajax({
            type: "POST",
            url: getPath("Services/EmployeeService.asmx/usercancheng"),
            contentType: "application/json; charset=utf-8",
            data: "{username: '" + $(dis).parent().parent().prop("id") + "', role: '" + $(dis).parent().parent().find('td[name=rolename]').html() +
        "', ischeckedadd: '" + ($(dis).parent().parent().find('input:checkbox[name="insert"]').is(':checked')) +
        "', ischeckeddel: '" + ($(dis).parent().parent().find('input:checkbox[name="delete"]').is(':checked')) + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function addEmployee(container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: getPath("Services/EmployeeService.asmx/AddEmployee"),
            contentType: "application/json; charset=utf-8",
            data: "{username: '" + $con.find("#text_username").val() + "', pass: '" + $con.find("#text_password").val() + "', email: '" + $con.find("#text_empemail").val() +
              "', name: '" + $con.find("#text_empName").val() + "', famil: '" + $con.find("#text_empfamily").val() + "', male: '" + $con.find("#ddl_m_Gender").val() +
              "', bdate: '" + $con.find("#text_empbdate").val() + "', rdate: '" + $con.find("#text_empregdate").val() + "', tell: '" + $con.find("#text_emptell").val() +
              "', mobile: '" + $con.find("#text_empmobile").val() + "', meli: '" + $con.find("#text_empmelicode").val() + "', acc: '" + $con.find("#text_empaccount").val() +
              "', maneg: '" + $con.find("#text_empmaneger").val() + "', addressId: '" + getHierarchySelectedValue("divEmployeeAddress", container) + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.isdone && response.d.isAdmin)
                    location.reload(true);
                else if (response.d.isdone && !response.d.isAdmin)
                    translate(response.d.msg);
                else if (!response.d.isdone)
                    translate(response.d.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
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
        lsth.push({ title: "manager", footer: jq.d.sumDebtor, width: "16%" });
        lsth.push({ title: "image", width: "20%" });
        if (!container.params.print) {
            lsth.push({ title: "deleteKey", width: "4%" });
        }
        var List = (typeof jq.d.results) == 'string' ? eval('(' + jq.d.results + ')') : jq.d.results;
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
        //        $.ajax({
        //            type: "POST",
        //            url: getPath("Services/EmployeeService.asmx/EmployeeList"),
        //            contentType: "application/json; charset=utf-8",

        //            success: function (response) {
        //                if (!isAuthenticated(response))
        //                    return;
        //                var Employee = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
        //                var EmployeeItem = "";
        //                for (var j = 0; j < Employee.length; j++) {
        //                    var val = Employee[0, j];
        //                    EmployeeItem += "<tr name='" + val['code'] + "' id='tr" + val['id'] + "'>" +
        //                                "<td name='name' width='15%'> " + val['name'] + " </td> " +
        //                                "<td name='code' width='15%'>" + val['code'] + "</td>" +
        //                                "<td name='RegDate' width='15%'>" + val['regdate'] + "</td>" +
        //                                "<td name='tell' width='15%'>" + val['tell'] + "</td>" +
        //                                "<td name='manager' width='15%'>" + val['manager'] + "</td>" +
        //                                "<td name='image' width='20%'> <img class='imagefortable' src='ImageHandler/EmployeeLargePhoto.ashx?EmployeeCode=" + val['code'] + "' /></td>" +
        //                                "<td id='delete' width='5%'><button id='a_Button'>حذف</button></td>" +
        //                                "</tr>";
        //                    //<div class='modalClose modalRemove'><a href='javascript:DeleteEmployee(" + val['id'] + ");'/></div>

        //                }
        //                $con.find("#employeeList").html(EmployeeItem).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
        //                // $con.find("#employeeList").parent().tableScroll({ height: 380 });
        //                //   TableAlter(container);
        //                $con.find("[id=a_Button]").button({
        //                    icons: {
        //                        primary: "ui-icon-closethick"
        //                    },
        //                    text: false
        //                }).click(function () {
        //                    if (confirm("آیا از حذف مطمئن هستید؟"))
        //                        DeleteEmployee($(this).parents("tr").prop("id").replace("tr", ""));
        //                    else
        //                        return;
        //                });
        //                $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
        //                    //   var tabId = createSubTab(this, container);
        //                    ClickEmployee($(this).parent("tr"), container)
        //                }).addClass("cursor");
        //            },
        //            error: function (response) { alert(response.responseText); }
        //        });
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
            url: getPath("Services/EmployeeService.asmx/Deleteemployee"),
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + EmployeeId + "' }",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.isDone)
                    getEmployeeList(container, { container: container, callbackmethod: getEmployeeList, fname: "", page_index: 0,
                        build: buildEmployeeList, servicename: "EmployeeService", methodname: "EmployeeList", print: false
                    });
                translate(response.d.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function getEmployee(employeeid, container) {
        $.ajax({
            type: "POST",
            url: getPath("Services/EmployeeService.asmx/getEmployee"),
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + employeeid + "' }",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var Employee = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
                var empval = Employee[0];
                var con = $("#" + container);
                bindHierarchyData({ id: "divEmployeeAddress", table: "address", container: container, parentid: empval.AddressId, css: "selectsmall required validate" });
                con.find("#hid_empid").val(empval.PersonId)
                con.find("#text_empemail").val(empval.Email);
                con.find("#text_empName").val(empval.Name);
                con.find("#text_empfamily").val(empval.Family);
                con.find("#text_empbdate").val(empval.DateOfBirth);
                con.find("#text_empregdateEdit").val(empval.RegDate);
                con.find("#text_emphdate").val(empval.HierDate);
                con.find("#text_empmelicode").val(empval.IdCart);
                con.find("#text_empaccount").val(empval.AccountNumber);
                con.find("#text_empmaneger").val(empval.managere);
                con.find("#ddl_m_Gender").val("" + empval.Gender + "");

            },
            error: function (response) { alert(response.responseText); }
        });

    }

    function EditEmployee(container) {
        var con = $("#" + container);
        $.ajax({
            type: "POST",
            url: getPath("Services/EmployeeService.asmx/EditEmployee"),
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
                translate(response.d.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }
    //--------------------js employee end-----------------------



    //--------------------js shop begin-----------------------
    function loadShopList(container, first) {
        if (first) {
            $("#" + container).find("#refreshShopList").button({ icons: {
                primary: "ui-icon-refresh"
            },
                text: false
            }).unbind('click').click(function () {
                getShopList(container, { container: container, callbackmethod: getEmployeeList, fname: "", page_index: 0,
                    build: buildShopList, servicename: "Shop", methodname: "GetListShop", print: false
                });
                //                getShopList(container);
            });
            getShopList(container, { container: container, callbackmethod: getEmployeeList, fname: "", page_index: 0,
                build: buildShopList, servicename: "Shop", methodname: "GetListShop", print: false
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
            bindItemsForSelectCombo({ servicename: "Shop", methodname: "getShopName", headertext: "شعبه اصلی", id: "ParentShopName", container: container });
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

    function loadShopAdd(container, first) {
        if (first) {
            var $con = $("#" + container);
            $con.find("#text_shopDateStart").datepicker({ changeMonth: true, changeYear: true, onClose: function () { validateAll($("#" + container)) } });
            bindHierarchyData({ id: "divShopAddress", container: container, table: "address", canmodify: true, css: "selectsmall1 required validate" });
            bindItemsForSelectCombo({ methodname: "getShopName", servicename: "Shop", headertext: "انتخاب شعبه", id: "ParentShopName", container: container });
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
            url: getPath("Services/Shop.asmx/AddShop"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.isdone)
                    $("#ddl_s_Branch").append("<option value='" + response.d.shopId + "'>" + response.d.shopName + "</option>");
                translate(response.d.msg);
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
            url: getPath("Services/Shop.asmx/EditShop"),
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
                translate(response.d.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function deleteShop() {
        $.ajax({
            type: "POST",
            url: getPath("Services/Shop.asmx/DeleteShop"),
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + 0 + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d.msg);
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
        lsth.push({ title: "email", footer: jq.d.sumDebtor, width: "16%" });
        lsth.push({ title: "name", width: "15%" });
        lsth.push({ title: "mainBranch", width: "15%" });
        if (!container.params.print) {
            lsth.push({ title: "deleteKey", width: "4%" });
        }
        var List = (typeof jq.d.results) == 'string' ? eval('(' + jq.d.results + ')') : jq.d.results;
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

    function getShopList(container, params) {
        var $con = $("#" + container);
        //    params["DTO"] = DTO;
        pageselectCallback(0, params, { container: "", noPaging: true, fname: params.fname, pagingContainer: container,
            first: true, isOrder: false
        });
        //        $.ajax({
        //            type: "POST",
        //            url: getPath("Services/Shop.asmx/GetListShop"),
        //            contentType: "application/json; charset=utf-8",

        //            success: function (response) {
        //                if (!isAuthenticated(response))
        //                    return;
        //                var shop = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
        //                var shopItem = "";
        //                for (var j = 0; j < shop.length; j++) {
        //                    var val = shop[0, j];
        //                    shopItem += "<tr id='tr" + val.ShopId + "'>" +
        //                    "<td width='15%'>" + val.Code + "</td>" +
        //                    "<td width='10%'>" + val.Fax + "</td>" +
        //                    "<td width='15%'>" + val.Address + "</td>" +
        //                    "<td width='15%'>" + val.startdate + "</td>" +
        //                    "<td width='15%'>" + val.Email + "</td>" +
        //                    "<td width='15%' name='name'>" + val.Name + "</td>" +
        //                    "<td width='10%'>" + val.parent + "</td>" +
        //                    "<td id='delete' width='5%'><button id='a_Button'>حذف</button></td></tr>";
        //                }
        //                $con.find("#shopList").html(shopItem).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
        //                // $con.find("#shopList").parent().tableScroll({ height: 380 });
        //                //   TableAlter(container);
        //                $con.find("[id=a_Button]").button({
        //                    icons: {
        //                        primary: "ui-icon-closethick"
        //                    },
        //                    text: false
        //                }).click(function () {
        //                    if (confirm("آیا از حذف مطمئن هستید؟"))
        //                        RemoveShopElement($(this).parents("tr").prop("id").replace("tr", ""), container);
        //                    else
        //                        return;
        //                });
        //                $con.find("tr[id*=tr]").find('td:not([id=delete])').click(function () {
        //                    ClickShop($(this).parent("tr"), container)
        //                }).addClass("cursor");
        //            },
        //            error: function (response) { alert(response.responseText); }
        //        });
    }

    function ClickShop($dis, container) {

        createSubTab({ row: $dis, name: "a_ShopList" });
        itemId = $dis.prop("id").replace("tr", "");
        //  employeeid = itemId;
        onRowClick($dis);
    }



    function getShop(idShop, container) {
        $.ajax({
            type: "POST",
            url: getPath("Services/Shop.asmx/getShop"),
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + idShop + "' }",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var Item = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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

    function RemoveShopElement(idShop, container) {
        container
        $.ajax({
            type: "POST",
            url: getPath("Services/Shop.asmx/DeleteShop"),
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + idShop + "' }",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.isDone)
                    getShopList(container, { container: container, callbackmethod: getEmployeeList, fname: "", page_index: 0,
                        build: buildShopList, servicename: "Shop", methodname: "GetListShop", print: false
                    });
                //                    getShopList(container);
                translate(response.d.msg);

            },
            error: function (response) { alert(response.responseText); }
        });
    }
    //--------------------js shop end-----------------------





    //--------------------js imageUpload begin-----------------------

    function loadInventoryPhoto(barcodeid, container, first) {

        var $con = $("#" + container);
        if (first) {
            var barcode = $("#tr" + barcodeid).find("td[name='barcode']").html();
            bindItemsForSelectCombo({ methodname: "GetColorListByBarcodeIdAll", servicename: "InventorySetting", id: "ddl_m_Color", container: container, headertext: "انتخاب رنگ", setcolor: true, showAlert: false }, "{ arg:'" + barcodeid + "'}");
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
            url: getPath("Services/InventorySetting.asmx/getPhotos"),
            contentType: "application/json; charset=utf-8",
            data: "{ barcode:'" + barcode + "'}",
            success: function (response) {

                if (!isAuthenticated(response))
                    return;
                if (!response.d.hasPhoto)
                    return response.d.msg;
                var List = (typeof response.d.lphotos) == 'string' ? eval('(' + response.d.lphotos + ')') : response.d.lphotos;
                var appName = response.d.appName;
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
            url: getPath("Services/InventorySetting.asmx/sortPhotos"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var lis = $con.find("#sortable li");
                var List = (typeof response.d.lphotos) == 'string' ? eval('(' + response.d.lphotos + ')') : response.d.lphotos;
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
            url: getPath("Services/InventorySetting.asmx/deletePhoto"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                $con.find("#sortable li[id='" + liId + "']").remove();
                sortPhotos(barcode, container)
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    //    function ajaxFileUpload(barcode, container) {
    //        $.ajaxFileUpload
    //         (
    //             {
    //                 url: getPath("Uploadify/Upload.ashx?barcode=" + barcode + "&priorityId=" + ($("#" + container).find("#sortable li").length * 1 + 1) + "&colorId=" + $("#" + container).find("#ddl_m_Color").val()),
    //                 secureuri: false,
    //                 fileElementId: 'fileInput,' + container,
    //                 dataType: 'json',
    //                 success: function (data, status) {
    //                     getPhotos(barcode, container);
    //                     //                     var img = (barcode + "\\tiny_" + ($("#" + container).find("#sortable li").length * 1 + 1) + ($("#" + container).find("#ddl_m_Color").val() == "" ? "" : "_" + $("#" + container).find("#ddl_m_Color").val()) + ".jpg");
    //                     //                     var i = $("#" + container).find("#sortable li").length;
    //                     //                     $("#" + container).find("#sortable").append("<li style='cursor:move;' id='li" + (i * 1) + "' class='ui-state-default'><div class='modalClose modalRemove'><a href='javascript:RemovePhoto(\"" + container + "\",\"li" + i + "\",\"" + barcode + "\");'/></div><img title='" + img + "' alt='" + img + "' src='Data/Photos/" + img + "' /></li>")
    //                     //                     if (typeof (data.error) != 'undefined') {
    //                     //                         if (data.error != '') {

    //                     //                             translate(data.error);
    //                     //                         } else {
    //                     //                             translate(data.msg);
    //                     //                         }
    //                     //                     }
    //                 },
    //                 error: function (data, status, e) {
    //                     alert(e);
    //                 }
    //             }
    //         )
    //        return false;
    //    }
    //    function ajaxFileUpload2() {

    //        $.ajaxFileUpload
    //         (
    //             {
    //                 url: 'Uploadify/Upload.ashx',
    //                 secureuri: false,
    //                 fileElementId: 'fileInput',
    //                 dataType: 'json',
    //                 success: function (data, status) {

    //                 },
    //                 error: function (data, status, e) {
    //                     alert(e);
    //                 }
    //             }
    //         )
    //        return false;
    //    }

    //--------------------js imageUpload end-----------------------



    //--------------------js quantity begin-----------------------


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

            url: getPath("Services/InventorySetting.asmx/" + methodname),
            async: false,
            data: "{barcode: '" + barcode + "', shopId: '" + ShopId + "'}",

            contentType: "application/json; charset=utf-8",

            dataType: "json",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var Order = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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


    //---------------------------------------------------------------------

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
        txtWithout.setAttribute("title", "بدون جزئیات و رنگ");
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
                txtQuantity.setAttribute("title", text + "_" + "بدون جزئیات");
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
            $con.find("#a_CustomerIntroducerCode").die().live('click', function () {
                opendialog({ container: "divdialogCustomer", containerpage: container });
            });
            $con.find("#btnSearch").button({ icons: {
                primary: "ui-icon-search"
            }
            }).die().live('click', function () {
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
            }).die().live('click', function () {
                AccountDetailsShop(container, false);
            });
            $con.find("#a_CustomerIntroducerCode").die().live('click', function () {
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
            url: getPath("Services/AccountDetails.asmx/GetAccountDetailsShop"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (isSale) {
                    $con.find("#txt_d_Sale").val(response.d.BuyAmount * 1 - response.d.SellAmount * 1);
                    $con.find("#txt_d_PaymentSale").val((response.d.ReceivedCash * 1 + response.d.ReceivedCheque * 1 + response.d.ReceivedVoucher * 1) - (response.d.PaidCash * 1 + response.d.PaidCheque * 1 + response.d.paidVoucher * 1));
                    $con.find("#txt_d_BalanceTotal").val((response.d.BuyAmount * 1 - response.d.SellAmount * 1) - ((response.d.ReceivedCash * 1 + response.d.ReceivedCheque * 1 + response.d.ReceivedVoucher * 1) - (response.d.PaidCash * 1 + response.d.PaidCheque * 1 + response.d.paidVoucher * 1)));
                    $con.find("#txt_d_SaleTotal").val(response.d.BuyAmount);
                    $con.find("#txt_d_Return").val(response.d.SellAmount);
                    $con.find("#txt_d_TotalPayment").val(response.d.PaidCash * 1 + response.d.PaidCheque * 1 + response.d.paidVoucher * 1);
                    $con.find("#txt_d_TotalReceive").val(response.d.ReceivedCash * 1 + response.d.ReceivedCheque * 1 + response.d.ReceivedVoucher * 1);
                    $con.find("#txt_d_ChequePeyment").val(response.d.PaidCheque);
                    $con.find("#txt_d_ChequeReceive").val(response.d.ReceivedCheque);
                    $con.find("#txt_d_CashPayment").val(response.d.PaidCash);
                    $con.find("#txt_d_CashReceive").val(response.d.ReceivedCash);
                    $con.find("#txt_d_TotalOff").val(response.d.OffSale * 1 - response.d.BuyAmount * 1);
                    $con.find("#txt_d_profit").val(response.d.profit);
                    $con.find("#txt_d_BuyQuantity").val(response.d.BuyQuantity);
                    $con.find("#txt_d_SellQuantity").val(response.d.SellQuantity);
                    $con.find("#txt_d_NetQuantity").val(response.d.BuyQuantity * 1 - response.d.SellQuantity * 1);
                }
                else if (!isSale) {

                    $con.find("#txt_d_Sale").val(response.d.SellAmount * 1 - response.d.BuyAmount * 1);
                    $con.find("#txt_d_PaymentSale").val((response.d.PaidCash * 1 + response.d.PaidCheque * 1 + response.d.paidVoucher * 1) - (response.d.ReceivedCash * 1 + response.d.ReceivedCheque * 1 + response.d.ReceivedVoucher * 1));
                    $con.find("#txt_d_BalanceTotal").val((response.d.SellAmount * 1 - response.d.BuyAmount * 1) - ((response.d.PaidCash * 1 + response.d.PaidCheque * 1 + response.d.paidVoucher * 1) - (response.d.ReceivedCash * 1 + response.d.ReceivedCheque * 1 + response.d.ReceivedVoucher * 1)));
                    $con.find("#txt_d_SaleTotal").val(response.d.SellAmount);
                    $con.find("#txt_d_Return").val(response.d.BuyAmount);
                    $con.find("#txt_d_TotalPayment").val(response.d.PaidCash * 1 + response.d.PaidCheque * 1 + response.d.paidVoucher * 1);
                    $con.find("#txt_d_TotalReceive").val(response.d.ReceivedCash * 1 + response.d.ReceivedCheque * 1 + response.d.ReceivedVoucher * 1);
                    $con.find("#txt_d_ChequePeyment").val(response.d.PaidCheque);
                    $con.find("#txt_d_ChequeReceive").val(response.d.ReceivedCheque);
                    $con.find("#txt_d_CashPayment").val(response.d.PaidCash);
                    $con.find("#txt_d_CashReceive").val(response.d.ReceivedCash);
                    $con.find("#txt_d_TotalOff").val(response.d.OffBuy * 1 - response.d.SellAmount * 1);
                    $con.find("#txt_d_profit").val(response.d.profit);
                    $con.find("#txt_d_BuyQuantity").val(response.d.BuyQuantity);
                    $con.find("#txt_d_SellQuantity").val(response.d.SellQuantity);
                    $con.find("#txt_d_NetQuantity").val(response.d.BuyQuantity * 1 - response.d.SellQuantity * 1);

                }
            },

            error: function (response) { alert(response.responseText); }
        });
    }


    //--------------------js AccountDetailsShop end-----------------------

    //--------------------js TransferProducts begin-----------------------


    function loadTransferProducts(container, first) {
        sortid = "BarcodeId desc";
        if (first) {
            var $con = $("#" + container);
            $con.find("#dialog").attr("id", "dialog" + container);
            bindItemsForSelectCombo({ methodname: "getAvailablity", servicename: "Inventory", id: "ddl_m_Availability", container: container, headertext: "وضعیت کالا", selectedindex: 1 });
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
            bindItemsForSelectCombo({ methodname: "getShopName", servicename: "Shop", id: "ddl_m_Branch", container: container, headertext: "انتخاب شعبه " });
            $con.find("#DialogBarcode").dialog({ autoOpen: false }).dialog({ width: 750 })
            $con.find("#dialog_ItemQuantity").dialog({ autoOpen: false })
            //  DataBindForHierarchy("hr_s_Category", "0", "Category", "0", 20, container);
            bindHierarchyData({ id: "hr_s_Category", container: container, styleclass: "PagingSelect selectMedium", table: "category" });
            $con.find("#btn_SearchProduct").button({ icons: {
                primary: "ui-icon-search"
            }
            }).die().live('click', function () {
                getBarcodeListOrder(container, { container: "dialog", callbackmethod: getBarcodeListOrder, fname: GetItemTransferProducts, page_index: 0, build: buildBarcodeListOrder, servicename: "Inventory", methodname: "GetItemsList" });
                //   getBarcodeListOrder(container, GetItemTransferProducts);
            }).button();

            $con.find("#btn_AddTransferProducts").die().live('click', function () {
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
            url: getPath("Services/Transfer.asmx/AddTransferProducts"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d.msg);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function GetItemTransferProducts($dis, container, barcode) {
        var $con = $("#" + container);
        if (barcode == undefined)
            barcode = $dis.find("[name=barcode]").html();

        var ItemList = "";
        var DTO = { 'barcode': barcode, 'shopId': $("#userDefault").find("#ddl_s_Branch").val(), isReturn: false };
        $.ajax({
            type: "POST",
            data: JSON.stringify(DTO),
            url: getPath("Services/Order.asmx/GetProductForOrderByBarcode"),
            contentType: "application/json; charset=utf-8",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                $con.find("#txt_s_ProductBarcode").val("");
                var count = $con.find("tr[id*='tr_" + container + "']").length;
                var List = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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



    //--------------------js TransferProductList begin-----------------------



    function loadTransferProductList(container, first) {
        sortid = "TransferItemId desc";
        if (first) {
            var $con = $("#" + container);
            $con.find("#btnSearchTransferProducts").die().live('click', function () {
                getTransferProductsList(container, { container: container, callbackmethod: getTransferProductsList, fname: "", page_index: 0,
                    build: buildTransferProductsList, servicename: "Transfer", methodname: "GetTransferProductsList", print: false
                });
            }).button({ icons: {
                primary: "ui-icon-search"
            }
            });
            getTransferProductsList(container, { container: container, callbackmethod: getTransferProductsList, fname: "", page_index: 0,
                build: buildTransferProductsList, servicename: "Transfer", methodname: "GetTransferProductsList", print: false
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

        var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': barcode, 'name': name, 'code': code, 'price': price, 'quantityfrom': "", 'quantityto': "", 'regdatefrom': "", 'regdateto': "", 'shopid': $("#userDefault").find("#ddl_s_Branch").val() };
        params["DTO"] = DTO;
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
        lsth.push({ title: "senderName", sort: "p_Person.PersonId", width: "20%" });
        lsth.push({ title: "recieverName", sort: "p_Person1.PersonId", footer: jq.d.sumDebtor, width: "16%" });
        if (!container.params.print) {
            lsth.push({ title: "details", width: "4%" });
        }
        var List = (typeof jq.d.results) == 'string' ? eval('(' + jq.d.results + ')') : jq.d.results;
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
            type: "POST",
            url: getPath("Services/Transfer.asmx/GetDetailTransferProducts"),
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + id + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                jq = response.d;
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
            type: "POST",
            url: getPath("Services/Transfer.asmx/DeleteDetailTransferProducts"),
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + ItemDetailId + "',TransferId:'" + TransferId + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.isDone)
                    $con.find("#tr" + ItemDetailId).remove();
                translate(response.d.msg);
            },

            error: function (response) { alert(response.responseText); }
        });
    }

    function ConfirmTransferProducts(dis, container) {
        var $con = $("#" + container);
        $.ajax({
            type: "POST",
            url: getPath("Services/Transfer.asmx/ConfirmTransferProducts"),
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + $(dis).parent().parent().prop('id').replace("tr", "") + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d);
                getTransferProductsList(container, { container: container, callbackmethod: getTransferProductsList, fname: "", page_index: 0,
                    build: buildTransferProductsList, servicename: "Transfer", methodname: "GetTransferProductsList", print: false
                });
            },
            error: function (response) { alert(response.responseText); }
        });
    }
    //--------------------js TransferProductList end-----------------------

    //--------------------js TransferAmount begin-----------------------


    function loadTransferAmount(container, first) {
        sortid = "OrderHeaderId desc"
        getTransferAmountList(container);
        if (first) {
            var $con = $("#" + container);
            $con.find("input[id*=cb_d_Confirm_]").die().live('change', function () { if (this.checked) ConfirmTransferAmount(this, container); });
            $con.find("#btn_AddTransferAmount").button({ icons: {
                primary: "ui-icon-disk"
            },
                text: true
            });
            bindItemsForSelectCombo({ methodname: "getCounterName", servicename: "Counter", headertext: "انتخاب صندوق", id: "ddl_m_CounterTo", container: container });
            $con.find("#PageSize").die().live('change', function () { getTransferAmountList(container); });
            $con.find("#div_dialog_TransferAmount").dialog({ autoOpen: false }).dialog({ width: 750 })
            $con.find("#btn_AddTransferAmount").die().live('click', function () {
                AddTransferAmount(container);
            });
        }
    }

    function AddTransferAmount(container) {
        var $con = $("#" + container);
        var DTO = { 'amount': $con.find("#txt_m_TransferAmount").val(), 'counteridFrom': $("#userDefault").find("#ddl_m_Counter").val(), 'counteridTo': $con.find("#ddl_m_CounterTo").val(), 'currencyid': $("#userDefault").find("#ddl_m_Currency").val(), 'date': $("#userDefault").find("#txt_s_Date").val() };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: getPath("Services/Transfer.asmx/AddTransferAmount"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                getTransferAmountList(container);
            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function getTransferAmountList(container) {
        var $con = $("#" + container);
        var first = true;
        var take = $con.find("#PageSize").val();
        var skip = 0;
        var page_index = 0
        var barcode = "", name = "", code = "", price = "";


        var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': barcode, 'name': name, 'code': code, 'price': price, 'quantityfrom': "", 'quantityto': "", 'regdatefrom': "", 'regdateto': "", 'counterid': $("#userDefault").find("#ddl_m_Counter").val() };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: getPath("Services/Transfer.asmx/GetTransferAmountList"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.results != null) {
                    var opt = TransferAmountgetOptionsFrom(response.d.count, container);
                    $con.find("#paging").pagination(response.d.count, opt);
                    TransferAmountpageselectCallback(0, response, container, first);
                }

            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function TransferAmountgetOptionsFrom(count, container) {
        var $con = $("#" + container);
        var opt = { callback: TransferAmountpageselectCallback };
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
    function buildTransferAmountList(jq, container) {
        var $con = $("#" + container);
        jq = jq.d.results;
        var condialog = "div_dialog_TransferAmount";
        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            ItemList += "<tr id='tr" + val.OrderHeaderId + "'>" +
                "<td name='Amount' width='15%'>" + val.Amount + "  " + val.Currency + "</td>" +
                "<td name='Date' width='15%'>" + val.Date + "</td>" +
                "<td name='CounterFrom' width='15%'>" + val.CounterFromName + "</td> " +
                "<td name='CounterTo' width='15%'>" + val.CounterToName + "</td> " +
                "<td name='sender' width='15%'>" + val.sendername + "  " + val.senderfamily + "</td> " +
                (val.receivername != null || val.receiverfamily != null ? "<td name='receiver'  width='15%'>" + val.receivername + "  " + val.receiverfamily + "</td> " : "<td  width='15%'><input type='checkbox' id='cb_d_Confirm_" + val.OrderHeaderId + "' value='تائید' /><label for='cb_d_Confirm_" + val.OrderHeaderId + "'>تائید</label></td>") +
                "<td id='delete' width='10%'><button id='a_Button'>حذف</button></tr>";
        }
        $con.find("#TransferAmountList").html(ItemList).parent().tableScroll({ height: 380, width: contentwidth, flush: false });
        //   $con.find("#TransferAmountList").parent().tableScroll({ height: 380 });
        //  TableAlter(container);
        $con.find("[id=a_Button]").button({
            icons: {
                primary: "ui-icon-closethick"
            },
            text: false
        }).click(function () {
            if (confirm("آیا از حذف مطمئن هستید؟"))
                RemoveTransferAmount(this, $(this).parents("tr").prop("id").replace("tr", ""), container);
            else
                return;
        });
        $con.find("input[id*=cb_d_Confirm_]").button();
    }

    function TransferAmountpageselectCallback(page_index, jq, container, first) {
        var $con = $("#" + container);
        var barcode = "", name = "", code = "", price = "";
        if (first) {
            buildTransferAmountList(jq, container);
        }
        else {
            first = false;
            var items_per_page = $con.find("#PageSize").val();
            var itemcontent = '';
            var take = items_per_page;
            var skip = page_index == 0 ? 0 : (page_index * take);

            var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid, 'barcode': barcode, 'name': name, 'code': code, 'price': price, 'quantityfrom': "", 'quantityto': "", 'regdatefrom': "", 'regdateto': "", 'counterid': $("#userDefault").find("#ddl_m_Counter").val() };
            $.ajax({
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(DTO),
                type: "Post",
                url: getPath("Services/Transfer.asmx/GetTransferAmountList"),
                success: function (response) {
                    if (!isAuthenticated(response))
                        return;
                    buildTransferAmountList(response, container);
                },
                error: function (response) { alert(response.responseText); }
            });

            return false;
        }
        Sort(getTransferAmountList, container);
    }

    function ClickTransferAmount(dis) {

    }

    function RemoveTransferAmount(dis, id, container) {
        var $con = $("#" + container);
        var $dis = $(dis);
        $.ajax({
            type: "POST",
            url: getPath("Services/Transfer.asmx/DeleteTransferAmount"),
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + id + "'}",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.isdone)
                    $dis.parents("tr").remove();
                translate(response.d.msg);
            },

            error: function (response) { alert(response.responseText); }
        });
    }

    function ConfirmTransferAmount(dis, container) {
        var $con = $("#" + container);
        var $dis = $(dis);
        $.ajax({
            type: "POST",
            url: getPath("Services/Transfer.asmx/ConfirmTransferAmount"),
            contentType: "application/json; charset=utf-8",
            data: "{id: '" + $(dis).parent().parent().prop('id').replace("tr", "") + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.isdone)
                    $dis.parent().html(response.d.name + " " + response.d.family);
                translate(response.d.msg);
            },

            error: function (response) { alert(response.responseText); }
        });
    }

    //--------------------js TransferAmount end-----------------------



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
        $con.find("#PageSize").die().live('change', function () { getCustomerForSMSList({ container: container }); });
        $con.find("#divslider").unbind('click').click(function () { sliderClick("divCustomerForSMSsearch"); sliderClick("moreFilter"); });
        $con.find("#CustomerForSMSAdvanceSearchbt").button({ icons: {
            primary: "ui-icon-search"
        }
        }).unbind('click').click(function () { sortid = 'PersonId desc'; getCustomerForSMSList({ container: container }); });

        $con.find("#ddl_s_Shop").html($("#ddl_s_Branch").html()).val("");
        //----
        var selectedTxt = "";


        // $con.find("#ulSmsItems").droppable();

        $con.find("#txt_m_Body").sortable();
        $con.find("span[name='smsItems']").die().live("click", function () {
            $(this).parent("li").remove();
            GetSMSLenght(container);
        })


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
        bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "EmployeeService", id: "ddl_registerer", container: container, headertext: "انتخاب کارمند", selectedindex: 0 });

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
                }
            });
        }
    }

    function getCredit() {
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "Post",
            url: getPath("Services/Customer.asmx/GetCredit"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d.msg);
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
            url: getPath("Services/Customer.asmx/GetCustomerForSMSList"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var opt = CustomerForSMSgetOptionsFrom(response.d.count, pageoption);
                $con.find("#paging").pagination(response.d.count, opt);
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
        jq = jq.d.results;
        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var gender = val.Gender == true ? 'آقای' : 'خانم';
            var introducerName = val.introducerName == null ? "" : val.introducerName;
            ItemList += "<tr id='tr" + val.PersonId + "'>" +
                "<td><ul class=''>" +
                "<li class='line formControl'>" +
                "<div class=' unit size1of5'>" +
                "<label class='labelPadding '>" +
                "مشتری  " + val.Code + " : </label><span class='cursor' name='subTab' menuName='a_CustomerList' id='" + val.PersonId + "'>" + gender + " " + val.Name + " " + val.Family + "</span> <input type='hidden' id='hd_customeramily' value='" + val.Family + "' />" +
                "</div>" +
                "<div class=' unit size1of5'>" +
                "<label > معرف " + (val.introducerCode == null ? "" : val.introducerCode) + " : </label><label class=''>" + (val.introducerId == null ? "" : ("<span class='cursor' name='subTab' menuName='a_CustomerList' id='" + val.introducerId + "'>")) + (val.introducerName == null ? "" : val.introducerName) + "  " + (val.introducerFamily == null ? "" : val.introducerFamily) + (val.introducerId == null ? "" : "</span>") + "</label>" +
                "</div>" +
                "<div class=' unit size1of6'>" +
                "<label > ثبت نام کننده : </label><label >" + val.regName + "  " + val.regFamily + "</label>" +
                "</div>" +
                "<div class=' unit size1of7'>" +
                "<label >سن : </label><label >" + val.age + "</label>" +
                "</div>" +
                "<div class=' unit size1of7'>" +
                "<label >تاریخ ثبت نام : </label><label class=' label100'><span date='" + val.regdate + "' class='date'>" + val.regdate + "</span></label>" +
                "</div>" +
                "<div class=' unit size1of7'>" +
                   (val.Email != null ? ("<input type='checkbox' id='email" + val.PersonId + "' name='email' email='" + val.Email + "' /><label name='email' for='email" + val.PersonId + "'>" + val.Email + "</label>") : "") +
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
                    "<input type='checkbox' id='cb_d_Mobile_" + num + "' /><label name='CellNumber' for='cb_d_Mobile_" + num + "'>" + num + "</label>" +
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
                "<label class='labelPadding'>آخرین خرید : </label><label><span " + (val.LastBuy != null ? "class='date' date='" + val.LastBuy + "'" : "") + ">" + val.LastBuy + "</span></label>" +
                "</div>" +
                "<div class=' unit size1of6'>" +
                "<label >آخرین برداشت  : </label><label><span " + (val.LastPayment != null ? "class='date' date='" + val.LastPayment + "'" : "") + ">" + val.LastPayment + "</span></label>" +
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
        $con.find("input[id*='cb_d_Mobile_']").button();
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
                url: getPath("Services/Customer.asmx/GetCustomerForSMSList"),
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
            url: getPath("Services/Customer.asmx/SendSMSForSelected"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d)
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
            url: getPath("Services/Customer.asmx/SendSMSForAll"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d);
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
            url: getPath("Services/Customer.asmx/SendEmailForSelected"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d)
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
            url: getPath("Services/Customer.asmx/SendEmailForAll"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d);
            },
            error: function (response) { alert(response.responseText); }
        });

    }
    //----------------new SendSMS end-------------------


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
            bindItemsForSelectCombo({ servicename: "Customer", methodname: "GetSmsTitles", headertext: "انتخاب موضوع", id: "ddl_s_Title", container: container });
            aComplete({ methodname: "GetCompletionListByCustomerName", servicename: "AtuoComplete", id: "txt_customerSms", container: container, minlength: 2, autofocus: false, limit: 20, boxId: "txt_customerSms", fname: customerOnSelect });
            $con.find("#txt_s_SendDateTo").datepicker({ changeMonth: true, changeYear: true });
            $con.find("#div_customerSms").removeClass("invisible");
            $con.find("#PageSize").die().live('change', function () { getSMSList({ container: container }); });
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
            bindItemsForSelectCombo({ servicename: "Customer", methodname: "GetSmsTitles", headertext: "انتخاب موضوع", id: "ddl_s_Title", container: container });
            $con.find("#div_customerSms").addClass("invisible");
            $con.find("#txt_s_SendDateTo").datepicker({ changeMonth: true, changeYear: true });
            $con.find("#btn_resendSms").button().unbind('click').click(function () { resendSms(container); });
            $con.find("#PageSize").die().live('change', function () { getSMSList({ container: container, id: id }); });
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
            url: getPath("Services/Customer.asmx/ResendSms"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d.msg);
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
            url: getPath("Services/Customer.asmx/GetListSMS"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var opt = getSMSListgetOptionsFrom(response.d.count, pageoption);
                $con.find("#paging").pagination(response.d.count, opt);
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
            url: getPath("Services/Customer.asmx/CheckSmsStatus"),
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
        jq = jq.d.results;
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
                url: getPath("Services/Customer.asmx/GetListSMS"),
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

    //----------------new Bank begin-------------------

    function loadBank(container, first) {
        if (first) {
            bindXmlDropDownData({ id: "Bank_Name", container: container, path: "Counter/BankTitle", canmodify: true, istext: false, headertext: "انتخاب بانک ", css: "selectsmall " });
        }
    }

    //----------------new Bank end-------------------

    //----------------OrderType begin-------------------

    function loadOrderType(container, first) {
        if (first) {
            bindRawDropDownData({ id: "divOrderType", container: container, path: "orderType", canmodify: true, istext: false, headertext: "orderType", css: "selectsmall " });
        }
    }

    //----------------OrderType end-------------------


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
            //            $con.find("#PageSize").die().live('change', function () { getInvoiceList(container); });
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
                url: getPath("Services/Charts.asmx/GetSaleChart"),
                success: function (response) {
                    var testArray = [7, 6, 9, 14, 18, 21, 25, 26, 23, 18, 13, 9];
                    if (!isAuthenticated(response))
                        return;
                    if (response.d != null) {
                        var displayBy = $con.find("#ddl_d_DisplayBy").val();
                        var position = "right";
                        var parent = [];
                        var categories = [];
                        var amountList = [];
                        var quantityList = [];
                        if (response.d.name == "Month")
                            categories = PERSIAN_MONTHS;
                        else
                            if (response.d.name == "Season")
                                categories = ["بهار", "تابستان", "پاییز", "زمستان"];

                        $.each(response.d.data, function () {

                            //   $.each(this.amount, function () {
                            //  if (response.d.name == "Month") {
                            amountList.push(this.amount);
                            if (response.d.name != "Month" && response.d.name != "Season" && response.d.name != "Week" && response.d.name != "Day") {
                                categories.push(this.name);
                            }
                            if (response.d.name == "Year") {
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

            url: getPath("Services/XmlDropDown.asmx/GetComboItems"),
            async: async,
            data: "{path: '" + options.path + "'}",

            contentType: "application/json; charset=utf-8",

            dataType: "json",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                BindXmlOptionsHtml(response, $hrSelect, options);

            }

        });
    }


    function BindXmlOptionsHtml(response, $hrSelect, options) {
        var Details = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
        $hrSelect.removeOption(/./).addOption('', options.headertext);
        for (var j = 0; j < Details.length; j++) {
            var val = Details[0, j];
            var text = val.name;
            if (options.istext)
                var value = val.name;
            else
                var value = val.id;
            $hrSelect.addOption(value, text, false);
        }
    }




    function AddXml_onclick($hrDiv, options) {
        $.ajax({

            type: "POST",

            url: getPath("Services/XmlDropDown.asmx/Add"),

            data: "{value: '" + $hrDiv.find(".inputText").val() + "', path: '" + options.path + "'}",

            contentType: "application/json; charset=utf-8",

            dataType: "json",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                BindXmlOptionsHtml(response, $hrDiv.find("select"), options)
                $hrDiv.find(".inputText").val("");
            }

        });
    }


    function UpdateXml_onclick($hrDiv, options) {

        $.ajax({

            type: "POST",

            url: getPath("Services/XmlDropDown.asmx/Update"),

            data: "{id:'" + $hrDiv.find("select").val() + "',value: '" + $hrDiv.find(".inputText").val() + "', path: '" + options.path + "'}",

            contentType: "application/json; charset=utf-8",

            dataType: "json",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                BindXmlOptionsHtml(response, $hrDiv.find("select"), options)
                $hrDiv.find(".inputText").val("");
            }

        });
    }


    function DeleteXml_onclick($hrDiv, options) {

        $.ajax({
            type: "POST",
            url: getPath("Services/XmlDropDown.asmx/Delete"),
            data: "{id: '" + $hrDiv.find("select").val() + "', path: '" + options.path + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                BindXmlOptionsHtml(response, $hrDiv.find("select"), options)
                $hrDiv.find(".inputText").val("");
            }

        });
    }


    //---------------new xml dropdown end-------------------------

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

            url: getPath("Services/XmlDropDown.asmx/GetComboItemsRaw"),
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
        var Details = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
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

            url: getPath("Services/XmlDropDown.asmx/AddRaw"),

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

            url: getPath("Services/XmlDropDown.asmx/UpdateRaw"),

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
            url: getPath("Services/XmlDropDown.asmx/DeleteRaw"),
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



    function ResetPage(container) {
        var $con = $("#" + container);
        $con.find("input:text").val("");
        $con.find(".inputTip.tipOk").css({ 'display': 'none', 'visibility': 'hidden', 'opacity': '0' });
        // $con.find("select").val("");
        // $con.find(".hReset").trigger('click');
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
            $con.find("#PageSize").die().live('change', function () { GetEmployeeSalaryList({ container: container }); })
            $con.find("#txt_m_toDate").datepicker({ changeMonth: true, changeYear: true });
            $con.find("#txt_m_fromDate_add").datepicker({ changeMonth: true, changeYear: true,
                onSelect: function (dateText, inst) {
                    $('#txt_m_toDate_add').datepicker('option', 'minDate', new JalaliDate(inst['selectedYear'], inst['selectedMonth'], inst['selectedDay']));
                }
            });
            //        $con.find("#txt_m_fromDate_add").datepicker({ changeMonth: true, changeYear: true });
            //        $con.find("#txt_m_toDate_add").datepicker({ changeMonth: true, changeYear: true });
            //            $con.find("#divslider").unbind('click').click(function () { sliderClick("divEmployeesearch"); sliderClick("moreFilter"); });
            bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "EmployeeService", id: "ddl_m_employee", container: container, headertext: "انتخاب کارمند", selectedindex: 0 });
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
                bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "EmployeeService", id: "ddl_m_employee_add", container: container, headertext: "انتخاب کارمند" });
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
            $con.find("#PageSize").die().live('change', function () { GetSocialSecurityList({ container: container }); })
            $con.find("#txt_m_toDate").datepicker({ changeMonth: true, changeYear: true });
            bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "EmployeeService", id: "ddl_m_employee", container: container, headertext: "انتخاب کارمند", selectedindex: 0 });
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
                bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "EmployeeService", id: "ddl_social_employee_add", container: container, headertext: "انتخاب کارمند" });
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
            $con.find("#PageSize").die().live('change', function () { GetExpenseList({ container: container }); })
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
            bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "EmployeeService", id: "ddlEmployee", container: container, headertext: "انتخاب کارمند", selectedindex: 0 });
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
            url: getPath("Services/Order.asmx/GetTotalExpenses"),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.isDone) {
                    $con.find("[id=txtTotalExpense]").val(response.d.totalExpense);
                    $con.find("[id=txtTotalSocialSecurity]").val(response.d.totalSocialSecurity);
                    $con.find("[id=txtTotalEmployeeSalary]").val(response.d.totalSalary);
                    $con.find("[id=txtTotalSale]").val(response.d.totalSale);
                    $con.find("[id=txtTotalBuy]").val(response.d.totalBuy);
                    $con.find("[id=txtTotalReceive]").val((response.d.totalReceiveCash * 1) + (response.d.totalReceiveCheque * 1) + (response.d.totalReceiveVoucher * 1));
                    $con.find("[id=txtTotalPay]").val((response.d.totalPayCash * 1) + (response.d.totalPayCheque * 1) + (response.d.totalPayVoucher * 1));
                    $con.find("[id=txtTotalAmount]").val((response.d.totalExpense * 1) + (response.d.totalSocialSecurity * 1) + (response.d.totalSalary * 1));
                    $con.find("[id=txtTotalClearSale]").val((response.d.totalSale * 1) - (response.d.totalBuy * 1));
                    $con.find("[id=txtTotalClearReceive]").val(($con.find("[id=txtTotalReceive]").val() * 1) - ($con.find("[id=txtTotalPay]").val() * 1));
                    $con.find("[id=txtNetProfit]").val(($con.find("[id=txtTotalClearSale]").val() * 1) - ($con.find("[id=txtTotalAmount]").val() * 1));
                }
                else
                    translate(response.d.msg);
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
            url: getPath("Services/Order.asmx/AddEmployeeSalary"),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d.msg);
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
            url: getPath("Services/Order.asmx/AddSocialSecurity"),
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
            url: getPath("Services/Order.asmx/AddExpense"),
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
            url: getPath("Services/Order.asmx/GetEmployeeSalaryList"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                pageoption["count"] = response.d.count;
                pageoption["callBackName"] = employeepageselectCallback;
                var opt = getPageOptions(pageoption);
                $con.find("#paging").pagination(response.d.count, opt);
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
            url: getPath("Services/Order.asmx/GetSocialSecurityList"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                pageoption["count"] = response.d.count;
                pageoption["callBackName"] = socialsecuritypageselectCallback;
                var opt = getPageOptions(pageoption);
                $con.find("#paging").pagination(response.d.count, opt);
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
            url: getPath("Services/Order.asmx/GetExpenseList"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                pageoption["count"] = response.d.count;
                pageoption["callBackName"] = expensepageselectCallback;
                var opt = getPageOptions(pageoption);
                $con.find("#paging").pagination(response.d.count, opt);
                expensepageselectCallback(0, response, pageoption, first);
            },
            error: function (response) { alert(response.responseText); }
        });
    }


    function buildEmployeeSalaryList(jq, pageoption) {
        var $con = $("#" + pageoption.container);
        total = jq.d;
        jq = jq.d.results;
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
            bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "EmployeeService", id: "ddl_m_employee_add", container: pageoption.container, headertext: "انتخاب کارمند" });
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
        total = jq.d;
        jq = jq.d.results;
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
            bindItemsForSelectCombo({ async: false, methodname: "getEmployees", servicename: "EmployeeService", id: "ddl_social_employee_add", container: pageoption.container, headertext: "انتخاب کارمند" });
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
        if (jq.d.sumAmount != undefined)
            $con.find("#sumAmount").val(jq.d.sumAmount);
        jq = jq.d.results;
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
            url: getPath("Services/Order.asmx/EditSalary"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d.msg);
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
            url: getPath("Services/Order.asmx/EditSocialSecurity"),
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
            url: getPath("Services/Order.asmx/EditExpense"),
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
            url: getPath("Services/Order.asmx/ConfirmSalary"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d != null && response.d.isDone == true) {
                    var $parentBtn = $dis.parent();
                    //                    $con.find("#btnSalaryConfirm").remove();
                    $parentBtn.html(response.d.name + " " + response.d.family + " " + response.d.code);
                }
                else
                    translate(response.d.msg);
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
            url: getPath("Services/Order.asmx/ConfirmSocialSecurity"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d != null && response.d.isDone == true) {
                    var $parentBtn = $dis.parent();
                    //                    $con.find("#btnSocialConfirm").remove();
                    $parentBtn.html(response.d.name + " " + response.d.family + " " + response.d.code);
                }
                else
                    translate(response.d.msg);
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
            url: getPath("Services/Order.asmx/ConfirmExpense"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d != null && response.d.isDone == true) {
                    var $parentBtn = $dis.parent();
                    //                    $con.find("#btnExpenseConfirm").remove();
                    $parentBtn.html(response.d.name + " " + response.d.family); //+ " " + response.d.code);
                }
                else
                    translate(response.d.msg);
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
            url: getPath("Services/Order.asmx/DeleteSalary"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d != null && response.d.isDone == true) {
                    $(dis).parents("tr").remove();
                }
                translate(response.d.msg);
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
            url: getPath("Services/Order.asmx/DeleteSocial"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d != null && response.d.isDone == true) {
                    $(dis).parents("tr").remove();
                }
                translate(response.d.msg);
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
            url: getPath("Services/Order.asmx/DeleteExpense"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d != null && response.d.isDone == true) {
                    $dis.parents("tr").remove();
                    return true;
                }
                translate(response.d.msg)
            },
            error: function (response) {
                alert(response.responseText);

            }
        });
    }

    function employeepageselectCallback(page_index, jq, pageoption, first) {
        var $con = $("#" + pageoption.container);
        var employee = "", confirmer = "", registerer = "";
        if (first) {
            buildEmployeeSalaryList(jq, pageoption);
        }
        else {
            first = false;
            var items_per_page = $con.find("#PageSize").val();
            var itemcontent = '';
            var take = items_per_page;
            var skip = page_index == 0 ? 0 : (page_index * take);
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
            else {
                var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
                    'employeeId': $con.find("#ddl_m_employee").val(), 'employee': "", 'confirmer': $con.find("#txt_m_confirmer").val(),
                    'registerer': $con.find("#txt_m_registerer").val(), 'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
                    'fixSalaryFrom': $con.find("#txt_m_fixSalaryFrom").val(), 'fixSalaryTo': $con.find("#txt_m_fixSalaryTo").val(),
                    'dateFrom': $con.find("#txt_m_fromDate").val(), 'dateTo': $con.find("#txt_m_toDate").val(),
                    'isConfirmed': $con.find("#ddl_m_status").val(), 'description': $con.find("#txt_m_description").val()
                };
            }
            $.ajax({
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(DTO),
                type: "Post",
                url: getPath("Services/Order.asmx/GetEmployeeSalaryList"),
                success: function (response) {
                    if (!isAuthenticated(response))
                        return;
                    buildEmployeeSalaryList(response, pageoption);
                },
                error: function (response) { alert(response.responseText); }
            });

            return false;
        }
        Sort(GetEmployeeSalaryList, pageoption);
    }

    function socialsecuritypageselectCallback(page_index, jq, pageoption, first) {
        var $con = $("#" + pageoption.container);
        var employee = "", confirmer = "", registerer = "";
        if (first) {
            buildSocialSecurityList(jq, pageoption);
        }
        else {
            first = false;
            var items_per_page = $con.find("#PageSize").val();
            var itemcontent = '';
            var take = items_per_page;
            var skip = page_index == 0 ? 0 : (page_index * take);
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
            else {
                var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
                    'employeeId': $con.find("#ddl_m_employee").val(), 'employee': "", 'confirmer': $con.find("#txt_m_confirmer").val(),
                    'registerer': $con.find("#txt_m_registerer").val(), 'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
                    'amountFrom': $con.find("#txt_m_amountFrom").val(), 'amountTo': $con.find("#txt_m_amountTo").val(),
                    'dateFrom': $con.find("#txt_m_fromDate").val(), 'dateTo': $con.find("#txt_m_toDate").val(),
                    'isConfirmed': $con.find("#ddl_m_status").val(), 'description': $con.find("#txt_m_description").val(),
                    'month': $con.find("#Month_Name option:selected").val()
                };
            }
            $.ajax({
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(DTO),
                type: "Post",
                url: getPath("Services/Order.asmx/GetSocialSecurityList"),
                success: function (response) {
                    if (!isAuthenticated(response))
                        return;
                    buildSocialSecurityList(response, pageoption);
                },
                error: function (response) { alert(response.responseText); }
            });

            return false;
        }
        Sort(GetSocialSecurityList, pageoption);
    }

    function expensepageselectCallback(page_index, jq, pageoption, first) {
        var $con = $("#" + pageoption.container);
        var confirmer = "", registerer = "";
        if (first) {
            buildExpenseList(jq, pageoption);
        }
        else {
            first = false;
            var items_per_page = $con.find("#PageSize").val();
            var itemcontent = '';
            var take = items_per_page;
            var skip = page_index == 0 ? 0 : (page_index * take);
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
            else {
                var DTO = { 'skip': skip, 'take': take, 'currentPage': page_index, 'first': first, 'sort': sortid,
                    'expenseCategory': getHierarchySelectedValue("divExpenseCategoryAdd", pageoption.container),
                    'amountFrom': $con.find("#txt_m_AmountFrom").val(), 'amountTo': $con.find("#txt_m_AmountTo").val(),
                    'dateFrom': $con.find("#txt_m_fromDate").val(), 'dateTo': $con.find("#txt_m_toDate").val(),
                    'registerer': $con.find("#txt_m_registerer").val(), 'isConfirmed': $con.find("#ddl_m_status").val(),
                    'counterId': $("#userDefault").find("#ddl_m_Counter").val(),
                    'description': $con.find("#txt_m_description_add").val(), 'confirmer': $con.find("#txt_m_confirmer").val()
                };
            }
            $.ajax({
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(DTO),
                type: "Post",
                url: getPath("Services/Order.asmx/GetExpenseList"),
                success: function (response) {
                    if (!isAuthenticated(response))
                        return;
                    buildExpenseList(response, pageoption);
                },
                error: function (response) { alert(response.responseText); }
            });

            return false;
        }
        Sort(GetExpenseList, pageoption);
    }

    //------------------expenses end-----------------------------
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
            url: getPath("Services/EmployeeService.asmx/getRoleParentAll"),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var role = (typeof (response.d)) == 'string' ? eval('(' + response.d + ')') : response.d;
                var roleItem = "";
                for (var j = 0; j < role.length; j++) {

                    var val = role[0, j];
                    roleItem += " <h3><a href='#' >" + val.description + "</a></h3><div id='div_" + val.roleid + "'></div>";

                }
                $con.find("#divRolesAccordion").html(roleItem);
                $con.find("#divRolesAccordion").accordion({ heightStyle: "content", collapsible: true, active: false,
                    change: function (event, ui) { if (ui.newContent.length > 0 && ui.newContent.html().length < 1) getallroleChild(ui.newContent.prop('id').replace("div_", ""), container) }
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
            url: getPath("Services/EmployeeService.asmx/getRoleListAll"),
            contentType: "application/json; charset=utf-8",
            data: "{parentid: '" + pid + "'}",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                var role = (typeof (response.d)) == 'string' ? eval('(' + response.d + ')') : response.d;
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
            url: getPath("Services/EmployeeService.asmx/AddUser"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d.msg);
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
            url: getPath("Services/EmployeeService.asmx/BuyApplication"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d.msg);
            },
            error: function (response) { alert(response); }
        });
    }

    function loadApplicationList(container, first) {
        var $con = $("#" + container);
        if (first) {
            getAcountList(container, { container: container, callbackmethod: getApplicationList, fname: "", page_index: 0,
                build: buildApplicationList, servicename: "EmployeeService", methodname: "GetApplicationList", print: true
            });
            $con.find("#btnRefreshApplist").button({
                icons: {
                    primary: "ui-icon-refresh"
                },
                text: false
            }).unbind("click").bind('click', function (event) {
                getAcountList(container, { container: container, callbackmethod: getApplicationList, fname: "", page_index: 0,
                    build: buildApplicationList, servicename: "EmployeeService", methodname: "GetApplicationList", print: true
                });

            });
        }
    }

    function buildApplicationList(jq, pageoption) {
        var $con = $("#" + pageoption.pagingContainer);
        jq = jq.d;
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
            url: getPath("Services/EmployeeService.asmx/"),
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
            url: getPath("Services/EmployeeService.asmx/GetApplicationDetails"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                var jq = response.d[0];
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
            url: getPath("Services/EmployeeService.asmx/EditApplication"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d.msg)
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
            aComplete({ methodname: "GetCompletionListByItemName", servicename: "AtuoComplete", id: "txt_matchedBarcode", container: container, minlength: 2, autofocus: false, limit: 10, boxId: "txt_matchedBarcode", data: { Status: 1 }, selectBarcode: true });
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
            url: getPath("Services/Inventory.asmx/addMatchingBarcode"),
            success: function (response) {
                if (response.d.isdone)
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
            url: getPath("Services/Inventory.asmx/getMatchingBarcodes"),
            success: function (response) {
                if (response.d.isdone)
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
        jq = jq.d.results;
        lsth.push({ title: "matchingBarcode", width: "55%" });
        lsth.push({ title: "countProduct", width: "10%" });
        lsth.push({ title: "countMached", width: "10%" });
        lsth.push({ title: "discountPer", width: "15%" });
        lsth.push({ title: "deleteKey", width: "10%" });
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
            url: getPath("Services/Inventory.asmx/DeleteMatchingBarcode"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d != null && response.d.isDone == true) {
                    $con.find("#tr" + MatchingItemId).remove();
                    return true;
                }
                translate(response.d.msg)
            },
            error: function (response) {
                alert(response.responseText);

            }
        });
    }



    //------------------MatchingBarcode end--------------------

    //------------------ item account details begin ----------------

    function loadItemAccountingDetails(barcodeid, container, first) {
        var $con = $("#" + container);
        if (first) {
            $con.find("#btn_Submit").button({
                icons: {
                    primary: "ui-icon-disk"
                }
            }).unbind().click(function () {
                if (validateAll($("#" + container)))
                    editItemAccountDetail(barcodeid, container)
            });
            getItemAccountDetail(barcodeid, container);
            getAveragePrice(barcodeid, container)
        }
    }

    function getAveragePrice(barcodeid, container) {
        var $con = $("#" + container);
        var DTO = { 'barcodeid': barcodeid };
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(DTO),
            type: "Post",
            url: getPath("Services/Inventory.asmx/GetColor_Size"),
            success: function (response) {
                buildAveragePrice(response, container);
            },
            error: function (response) { alert(response.responseText); }
        });
    }
    function buildAveragePrice(jq, container) {
        var $con = $("#" + container.pagingContainer);
        var table = {};
        var lstb = [];
        var lsth = [];
        jq = jq.d;
        lsth.push({ title: "details", width: "16%" });
        lsth.push({ title: "color", width: "15%" });
        lsth.push({ title: "colorName", width: "15%" });
        lsth.push({ title: "priceDifference", width: "15%" });
        lsth.push({ title: "averageBuyPrice", width: "15%" });
        lsth.push({ title: "quantityKey", width: "15%" });
        lsth.push({ title: "edit", width: "4%" });
        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        if (List != null)
            for (var i = 0; i < List.length; i++) {
                var val = List[0, i];
                var trBody = {};
                var name = val.Name != null ? val.Name : "";
                var code = val.ItemCode != null ? val.ItemCode : "";
                var barcode = val.Barcode != null ? val.Barcode : "";
                trBody[0] = { trId: val.ItemDetailId };
                trBody[1] = { name: "detail", html: val.Size, width: "16%" };
                trBody[2] = { name: "color", html: val.Color, props: { width: "15%", style: "background-color:" + val.Color + ""} };
                trBody[3] = { name: "colorName", html: val.Color, width: "15%" };
                trBody[4] = { name: "sellPrice", html: val.DetailPrice, width: "15%" };
                trBody[5] = { name: "averageBuyPrice", html: "<input name='averagePrice' value=" + val.BuyPrice + " />", width: "15%" };
                trBody[6] = { name: "quantity", html: val.Quantity, width: "15%" };
                lstb.push(trBody);
            }
        var details = { editFunction: EditDetailBuyPrice
        };
        table = { header: lsth, body: lstb, heigth: 300, container: container, divName: "AveragePriceList", details: details, hasFooter: false };
        buildTable(table);
    }

    function EditDetailBuyPrice(dis, container) {
        var $row = $(dis).parents("tr");
        var id = $row.prop("id");
        var $con = $("#" + container);
        var DTO = {
            'id': id.replace('tr', ''),
            'price': $row.find("[name='averagePrice']").val()
        };
        $.ajax({
            type: "POST",
            url: getPath("Services/InventorySetting.asmx/EditDetailBuyPrice"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.isDone) {
                    translate(response.d.msg);
                }
                //translate(response.d.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }


    function getItemAccountDetail(barcodeid, container) {
        var $con = $("#" + container);
        var DTO = {
            'barcodeId': barcodeid
        };
        $.ajax({
            type: "POST",
            url: getPath("Services/InventorySetting.asmx/getItemAccountDetail"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.isDone) {
                    $con.find("#txt_m_Price").val(response.d.AverageBuyPrice);
                }
                //            translate(response.d.alert);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    function editItemAccountDetail(barcodeid, container) {
        var $con = $("#" + container);
        var DTO = {
            'barcodeId': barcodeid,
            'averageBuyPrice': $con.find("#txt_m_Price").val()
        };
        $.ajax({
            type: "POST",
            url: getPath("Services/InventorySetting.asmx/editItemAccountDetail"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.isDone) {
                    $con.find("#txt_m_Price").val(response.d.AverageBuyPrice);
                }
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }
    //------------------- item account details end-------------------

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
            url: getPath("Services/EmployeeService.asmx/GetSetting"),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.isDone) {
                    var res = response.d.result;
                    bindItemsForSelectCombo({ methodname: "getEmployees", servicename: "EmployeeService", id: "ddl_m_Employee", container: container, headertext: "انتخاب کارمند", selectedvalue: res.EmployeeId });
                    bindItemsForSelectCombo({ servicename: "Counter", methodname: "getCounterNameForUser", headertext: "انتخاب صندوق", id: "ddl_m_Counter", container: container, selectedvalue: res.CounterId });
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
                }
                //            translate(response.d.alert);
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
            'onlineHost': $con.find("#txt_m_OnlineHost").val()
        };
        $.ajax({
            type: "POST",
            url: getPath("Services/EmployeeService.asmx/UpdateSetting"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),

            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                translate(response.d.msg);
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
    }

    //------------------Setting End-----------------------------


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
            url: getPath("Services/Charts.asmx/GetSaleChart"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d != null) {
                    var displayBy = "0"; // $con.find("#ddl_d_DisplayBy").val();
                    var position = "right";
                    var totalSale = 0;
                    var avSale = 0;
                    var avValue = 0;
                    var totalQuantity = 0;
                    var categories = [];
                    var data = [];
                    var quantity = [];
                    $.each(response.d, function () {
                        categories.push(ToPersianDate(this.date));
                        if (displayBy == "Amount" || displayBy == "0") {


                            data.push(Math.ceil(this.amount * 10) / 10);
                            quantity.push(Math.ceil(this.quantity * 10) / 10);

                            totalSale += Math.ceil(this.amount * 10) / 10;
                            totalQuantity += Math.ceil(this.quantity * 10) / 10;
                        }
                    })
                    if (response.d.length > 0) {
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
            url: getPath("Services/Charts.asmx/GetTopProductChart"),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d != null) {
                    var categories = [];
                    var data = [];
                    var quantity = [];
                    $.each(response.d, function () {

                        quantity.push(Math.ceil(this.quantity * 10) / 10);
                        categories.push(this.Name);
                    })
                    if (response.d.length > 0) {

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
    //------------dashboard end---------------------------------

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
            url: getPath("Services/Menu.asmx/AddFaq"),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.isDone) {
                    BuildFaqAccordion(container);
                }
                translate(response.d.msg);
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
            url: getPath("Services/Menu.asmx/getFaqQuestions"),
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

                for (var i = 0; i < response.d.length; i++) {
                    var val = response.d[i];
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
            url: getPath("Services/Menu.asmx/sortFaqQuestions"),
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
            url: getPath("Services/Menu.asmx/getFaqForEdit"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                $con.find("#txtQuestion").val(response.d.result.question);
                $con.find("[name='txtFaq']").val(response.d.result.answer);
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
            url: getPath("Services/Menu.asmx/deleteFaq"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                if (response.d.isDone) {
                    $con.find("#accordion").find("#" + faqId).remove();
                }
                else
                    alert(response.d.msg);
            },
            error: function (response) { alert(response.responseText); }
        });
    }

    function getFaq(faqId, container) {
        var $con = $("#" + container);
        $con.find("#divFaq").html("<textarea class='editor' name='txtFaq'></textarea></n><button id='btnSaveDefintion'>save</button>");
        $con.find(".editor").tinymce({
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
            url: getPath("Services/Menu.asmx/getFaqQuestions"),
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

                for (var i = 0; i < response.d.length; i++) {

                    var val = response.d[i];
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
            url: getPath("Services/Menu.asmx/getFaqForEdit"),
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(DTO),
            success: function (response) {
                if (!isAuthenticated(response))
                    return;
                $con.find("#faqContent").find("#p" + faqId).html(response.d.result.answer);
            },
            error: function (response) { alert(response.responseText); }
        });
    }
    //--------------support end----------------------------------


    //--------------------statistic begin------------------------------

    function loadVisitorStatistic(container, first) {
        var $con = $("#" + container);
        if (first) {
            getVisitorStatisticList(container, { container: container, callbackmethod: getVisitorStatisticList, fname: "", page_index: 0,
                build: buildVisitorStaticList, servicename: "Login", methodname: "GetVisitorStatistic", print: false
            });
            $con.find("[id=btnSearchVisitorStatistic]").button({ icons: {
                primary: "ui-icon-search"
            }
            }).unbind('click').click(function () {

                getVisitorStatisticList(container, { container: container, callbackmethod: getVisitorStatisticList, fname: "", page_index: 0,
                    build: buildVisitorStaticList, servicename: "Login", methodname: "GetVisitorStatistic", print: false
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
        jq = jq.d.results;
        lsth.push({ title: "ip", width: "15%" });
        lsth.push({ title: "countryName", width: "15%" });
        lsth.push({ title: "cityName ", width: "15%" });
        lsth.push({ title: "date", width: "20%" });
        lsth.push({ title: "timeZone ", width: "15%" });
        lsth.push({ title: "browser", width: "10%" });
        lsth.push({ title: "appName", width: "10%" });

        var List = (typeof jq) == 'string' ? eval('(' + jq + ')') : jq;
        var ItemList = "";
        for (var i = 0; i < List.length; i++) {
            var val = List[0, i];
            var trBody = {};
            trBody[0] = { name: "ip", html: val.ip, width: "15%" };
            trBody[1] = { name: "countryName", html: val.countryName, width: "15%" }
            trBody[2] = { name: "cityName", html: val.cityName, width: "15%" };
            trBody[3] = { name: "date", html: val.dateTime, width: "20%" };
            trBody[4] = { name: "timeZone", html: val.timeZone, width: "15%" };
            trBody[5] = { name: "browser", html: val.browser, width: "10%" };
            trBody[6] = { name: "appName", html: val.appName, width: "10%" };

            lstb.push(trBody);
        }
        //    var details = { editFunction: BindItemsForEditMenu, deleteFunction: DeleteMenu, rowClick: ClickMenu };
        table = { header: lsth, details: {}, body: lstb, container: container.pagingContainer, divName: "visitorStatistic" };
        buildTable(table);
    }