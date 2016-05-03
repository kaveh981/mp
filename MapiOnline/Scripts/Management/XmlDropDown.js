
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
    if (canmodify) {
        $hrDiv.append("<a  href='#'> <img alt='ویرایش' class='hExpand unit HierarchyImage'  src='App_Themes/Default/Images/expand.jpg' /></a>" +
			"<select   id='hierarchyAddress' class='PagingSelect selectMedium' ></select>" +
            "<div  class='editBox invisible' style='padding-top:20px;'>  " +
            "<input   type='text' class='inputText inputW50'  />" +
            "<a  class='hAdd' href='#'> <img alt='اضافه'   src='App_Themes/Default/Images/Add-icon.png' /></a>" +
            "<a  class='hDelete' href='#'>  <img alt='حذف'   src='App_Themes/Default/Images/delete-icon.png' /></a>" +
            "<a  class='hEdit' href='#'> <img alt='ویرایش'  src='App_Themes/Default/Images/Edit-icon.png' /></a></div>"
           );
    }
    else {
        $hrDiv.append("<select   id='hierarchyAddress' class='PagingSelect select' ></select>");
    }
    var $hrSelect = $hrDiv.find("select");

    $hrDiv.find('.hExpand').unbind().bind('click', function () {
        $hrDiv.find(".editBox").toggle();
    });
    $hrDiv.find('.hDelete').unbind().bind('click', function () {
        DeleteXml_onclick($hrDiv, options.path, options.istext)
    });
    $hrDiv.find('.hAdd').unbind().bind('click', function () {
        AddXml_onclick($hrDiv, options.path, options.istext)
    });
    $hrDiv.find('.hEdit').unbind().bind('click', function () {
        UpdateXml_onclick($hrDiv, options.path, options.istext)
    });

    ajHierarchy = $.ajax({

        type: "POST",

        url: getPath("Services/XmlDropDown.asmx/GetComboItems"),

        data: "{path: '" + options.path + "'}",

        contentType: "application/json; charset=utf-8",

        dataType: "json",

        success: function (response) {

            BindXmlOptionsHtml(response, $hrSelect, options.istext);

        }

    });
}


function BindXmlOptionsHtml(response, $hrSelect,istext) {
    var Details = (typeof response.d) == 'string' ? eval('(' + response.d + ')') : response.d;
    $hrSelect.removeOption(/./).addOption('', ' انتخاب زیر گروه ');
    for (var j = 0; j < Details.length; j++) {
        var val = Details[0, j];
        var text = val.name;
        if(istext)
            var value = val.name;
        else
            var value = val.id;
        $hrSelect.addOption(value, text, false);
    }
}




function AddXml_onclick($hrDiv, path, istext) {
    $.ajax({

        type: "POST",

        url: getPath("Services/XmlDropDown.asmx/Add"),

        data: "{value: '" + $hrDiv.find(".inputText").val() + "', path: '" + path + "'}",

        contentType: "application/json; charset=utf-8",

        dataType: "json",

        success: function (response) {
            BindXmlOptionsHtml(response, $hrDiv.find("select"), istext)
            $hrDiv.find(".inputText").val("");
        }

    });
}


function UpdateXml_onclick($hrDiv, path, istext) {

    $.ajax({

        type: "POST",

        url: getPath("Services/XmlDropDown.asmx/Update"),

        data: "{id:'" + $hrDiv.find("select").val() + "',value: '" + $hrDiv.find(".inputText").val() + "', path: '" + path + "'}",

        contentType: "application/json; charset=utf-8",

        dataType: "json",

        success: function (response) {
            BindXmlOptionsHtml(response, $hrDiv.find("select"), istext)
            $hrDiv.find(".inputText").val("");
        }

    });
}


function DeleteXml_onclick($hrDiv, path, istext) {

    $.ajax({
        type: "POST",
        url: getPath("Services/XmlDropDown.asmx/Delete"),
        data: "{id: '" + $hrDiv.find("select").val() + "', path: '" + path + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (response) {
            BindXmlOptionsHtml(response, $hrDiv.find("select"), istext)
            $hrDiv.find(".inputText").val("");
        }

    });
}
