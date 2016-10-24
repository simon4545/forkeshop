var goodsGroup = {};
var goodsGroups = [];
var curGroupId = null;
var editGroupInfo = null;
var tempSku = [];
var goodsMysqlId = null;
var totalPageNum = 1;
var curPageIndex = 1;
var channelList = [];
function bindCommands() {
    $("#btnQueryGroup").click(function () {
        getAndShowGoods(1);
    });

    $("#listTBody").on("click", ".btnDetail", function () {
        curGroupId = $(this).attr("data-id");
        var layerId = layer.load();
        getGoodsGroupInfo(curGroupId).done(function (goodsInfo) {
            if (goodsInfo) {
                $("#categoryInput").val(goodsInfo.category.categoryName);
                $("#brandInput").val(goodsInfo.brand.BrandTitle);
                $("#goodsGroupTitleInput").val(goodsInfo.goodsGroupTitle);
                $("#outerIdInput").val(goodsInfo.outerId);
                $("#priceInput").val(goodsInfo.price);
                $("#goodsGroupTitleInput").val(goodsInfo.goodsGroupTitle);

                $("#thumbContainer").empty();
                for (var i = 0; i < goodsInfo.imgPaths.length; i++) {
                    var imgDiv = $('<div class="img_thumbnailDiv"><img src="' + goodsInfo.imgPaths[i] + '" class="img_thumbnail" style="width: 150px;height:150px;display: inline-block"><a href="' + goodsInfo.imgPaths[i] + '" class="btn icn-only downloadFile"><i class="icon-arrow-down"></i></a></div>');
                    $("#thumbContainer").append(imgDiv);
                }

                $("#listTBody_childGoods").empty();

                for (var i = 0; i < goodsInfo.sku.length; i++) {
                    var tr = $('<tr>' +
                    '<td>' + goodsInfo.sku[i].title + '</td>' +
                    '<td>' + goodsInfo.sku[i].sku_id + '</td>' +
                    '<td>' + goodsInfo.sku[i].sell_price + '</td>' +
                    '</tr>');
                    $("#listTBody_childGoods").append(tr);
                }

                $('#summernote').html(goodsInfo.goodsDetail);

                var flowStateTip = FLOW_STATE[goodsInfo.State];
                if (goodsInfo.State == 4) {
                    flowStateTip = flowStateTip + "（" + goodsInfo.checkFailReason + "）";
                }
                $("#flowStateTip").text(flowStateTip);

                if (goodsInfo.State != 3) {
                    $("#btnSubmitCheck").show();
                } else {
                    $("#btnSubmitCheck").hide();
                }
                $("#list_container").hide();
                $("#detail_container").show();
            }
            layer.close(layerId);
        });
    });

    $("#btnCancel").click(function () {
        $("#list_container").show();
        $("#detail_container").hide();
    });

    $("#listTBody").on("click", ".btnDeleteGroup", function () {
        var groupId = $(this).attr("data-id");
        var State = $(this).attr("State");
        var layerLoadId = layer.load();
        deleteGoodsGroup(groupId, State).done(function (result) {
            layer.close(layerLoadId);
            if (result) {
                layer.alert("删除成功", {closeBtn: false}, function () {
                    window.location.reload();
                });
            }
        });
    });
    $("#listTBody").on("click", ".btnEditGroup", function () {
        curGroupId = $(this).attr("data-id");
        window.location.href = "/goods/edit?goodsGroupId="+curGroupId;
        /*var layerId = layer.load();

        getGoodsGroupInfo(curGroupId).done(function (goodsInfo) {
            initSelectOptions(goodsInfo).done(function () {
                initEditor();
                layer.close(layerId);
            });
            $("#list_container").hide();
            $("#edit_container").show();

        });*/
    });

    $("#btnSubmitCheck").click(function () {
        var args = {};
        args.State = 2;
        var layerLoadId = layer.load();
        auditGoodsGroup(args).done(function (result) {
            layer.close(layerLoadId);
            if (result) {
                layer.alert("提交成功", {closeBtn: false}, function () {
                    window.location.reload();
                });
            }
        });
    });

    $("#flowState_query").on("change", function () {
        getAndShowGoods(1);
    });

    $("#formUploadExcel").on('change', "#inputFile_excel", doUploadGoodsExcel);

    $("#categorySelect").on("change", function () {
        var categoryId = $(this).children("option:selected").attr("parentId");
        updateShowColorsAndSizes(categoryId);
    });

    $("#inputFile_groupImg").on('change', function () {
        var loadId = layer.load();
        var allSmallerThan200kb = true;
        var allLargerThan50kb = true;
        var filesObj = $(this)[0].files;
        for (var attr in filesObj) {
            var size = filesObj[attr].size;
            if (size > 205000) {
                allSmallerThan200kb = false;
            }
            if (size < 52000) {
                allLargerThan50kb = false;
            }
        }
        if (!allSmallerThan200kb || !allLargerThan50kb) {
            layer.close(loadId);
            layer.alert("上传的图片中，有图片大于200KB或小于50KB，请修改后重新上传。");
            return;
        }
        //这里往云端传图片后获取到一个地址
        uploadFile("formUploadGroupImg").done(function (fileUrlArr) {
            layer.close(loadId);
            //console.log(fileUrlArr);
            for (var i = 0; i < fileUrlArr.length; i++) {
                var imgThumb = $('<div class="img_thumbnailDiv">' +
                '<img src="' + fileUrlArr[i] + '" class="img_thumbnail" style="width: 150px;height:150px;display: inline-block">' +
                '<a href="javascript:;" class="btn icn-only deleteThumb"><i class="icon-remove"></i></a>' +
                '</div>');
                $("#thumbContainer_edit").append(imgThumb);
            }
        });
    });

    $("#thumbContainer_edit").on("click", ".deleteThumb", function () {
        $(this).parent().remove();
    });

    $("#thumbContainer_edit").on("click", ".img_thumbnail", function () {
        $("#thumbContainer_edit").find(".img_thumbnail").removeClass("bordered");
        $(this).addClass("bordered");
    });

    $("#category_color,#category_size").on("click", "input[type=checkbox]", function () {
        getGroupSKU();
        compareAndReCalcSku();
        showGroupSku(goodsGroup);
    });

    $("#category_color").on("click", ".btnAddConfig", function () {
        var category_color_item = $(
            '<label class="checkbox">' +
            '<input class="colorCheck" type="checkbox"/>' +
            '<span style="display: inline-block;background-color: rgba(0,0,0,0)' + ';margin-top: 3px;width: 16px;height: 16px;position: absolute;"></span>' +
            '<input type="text" class="ruleInput colorInput">' +
            '</label>');
        $(this).before(category_color_item);
    });

    $("#category_size").on("click", ".btnAddConfig", function () {
        var category_size_item = $(
            '<label class="checkbox">' +
            '<input class="sizeCheck" type="checkbox" value=""/><input type="text" class="ruleInput">' +
            '</label>');
        $(this).before(category_size_item);
    });


    $("#list_childrenTBody").on("click", ".btnDeleteSku", function () {
        $(this).parent().parent().remove();
    });

    $("#btnCancel_edit").click(function () {
        $("#list_container").show();
        $("#edit_container").hide();
    });

    $("#btnConfirm_edit").click(function () {
        var result = getGroupInfo();
        if (!result) {
            return;
        }
        result.State = 2;
        if (editGroupInfo && editGroupInfo.State == 3) {
        }
        var layerLoadId = layer.load();
        sendGoodsGroup(result).done(function (result) {
            layer.close(layerLoadId);
            if (result) {
                layer.msg("提交成功！");
                $("#list_container").show();
                $("#edit_container").hide();
            }
        });
    });

    $("#btnSubmitCheck_edit").click(function () {
        var args = {};
        args.State = 2;
        var layerLoadId = layer.load();
        auditGoodsGroup(args).done(function (result) {
            layer.close(layerLoadId);
            if (result) {
                layer.msg("提交成功！");
                $("#list_container").show();
                $("#edit_container").hide();
            }
        });
    });
}
function auditGoodsGroup(groupObj) {
    var def = $.Deferred();
    if (!curGroupId) {
        alert('请先保存！');
        def.resolve(null);
        return def.promise();
    }
    $.ajax({
        url: '/goods/audit/' + curGroupId,
        type: 'POST',
        data: JSON.stringify(groupObj),
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data);
            } else {
                layer.alert(res.data);
                def.resolve(null);
            }
        },
        error: function (err) {
            layer.alert("与服务器通信发生错误。");
            def.resolve(null);
        }
    });
    return def.promise();
}
function getGroupInfo() {
    var formResult = validateForm();
    if (!formResult) {
        return false;
    }

    goodsGroup.id = curGroupId;
    goodsGroup.category = $("#categorySelect").children("option:selected").data("categoryInfo");
    goodsGroup.brand = $("#brandSelect").children("option:selected").data("brandInfo");
    if (!goodsGroup.brand) {
        layer.alert("您没有设定品牌，请确认您已经添加了品牌并通过了审核。");
        return false;
    }
    goodsGroup.goodsGroupTitle = $("#goodsGroupTitleInput_edit").val();
    goodsGroup.outerId = $("#outerIdInput_edit").val();
    goodsGroup.price = parseFloat($("#priceInput_edit").val());
    goodsGroup.tag = parseInt($('#tagAttr_edit input[name="optionsRadios_sex"]:checked ').val());
    goodsGroup.goodsDetail = $('#summernote_edit').code();
    //快递费用
    goodsGroup.express_fee = $("#expressFeeInput").val();

    getFinalSkus();
    if (goodsGroup.sku.length < 1) {
        layer.alert("请设定商品规则。");
        return false;
    }
    var skuResult = validateSku();
    if (!skuResult) {
        return false;
    }

    var imgPaths = [];
    $("#thumbContainer_edit img").each(function (i, img) {
        imgPaths.push(img.src);
    });
    if (imgPaths.length < 1) {
        layer.alert("请上传商品图片。");
        return false;
    }
    //根据选中的图片调换首张图片
    var borderedImg = $("#thumbContainer_edit").find(".bordered");
    var borderedSrc = borderedImg.length > 0 ? borderedImg.attr("src") : null;
    if (borderedSrc) {
        imgPaths.splice(imgPaths.lastIndexOf(borderedSrc), 1);
        imgPaths.splice(0, 0, borderedSrc);
    }
    goodsGroup.imgPaths = imgPaths;

    var customConfig = {colors: [], sizes: []};
    $("#category_color input[type=checkbox]").each(function (i, checkbox) {
        var colorConfig = {};
        colorConfig.color = $(checkbox.parentNode).find(".colorInput").val();
        colorConfig.rgba = $(checkbox.parentNode).find("span").css("background-color");
        if (checkbox.checked) {
            colorConfig.checked = true;
        } else {
            colorConfig.checked = false;
        }
        customConfig.colors.push(colorConfig);
    });

    $("#category_size input[type=checkbox]").each(function (i, checkbox) {
        var sizeConfig = {};
        sizeConfig.size = $(checkbox.parentNode).find(".ruleInput").val();
        if (checkbox.checked) {
            sizeConfig.checked = true;
        } else {
            sizeConfig.checked = false;
        }
        customConfig.sizes.push(sizeConfig);
    });
    goodsGroup.customConfig = customConfig;
    return goodsGroup;
}
function validateSku() {
    var pass = true;
    var skuIdArr = [];
    $(".skuId").each(function () {
        var skuId = $(this).val();
        if (!skuId) {
            pass = false;
            layer.alert("您有sku没有填写，sku为必填项");
        }
        skuIdArr.push(skuId);
    });
    if (!pass) {
        return pass;
    }
    //验证数组是否重复
    function isRepeat(arr) {
        var hash = {};
        for (var i in arr) {
            if (hash[arr[i]])
                return true;
            hash[arr[i]] = true;
        }
        return false;
    }

    if (isRepeat(skuIdArr)) {
        pass = false;
        layer.alert("sku存在重复，同一组商品的sku不能重复。");
        return pass;
    }

    return pass;
}
function validateForm() {
    var pass = true;
    $("input").each(function () {
        if (!$(this).val() && $(this).attr("required")) {
            $(this).siblings(".help-inline").show();
            pass = false;
            layer.alert("请将信息填写完整后再提交。");
            return pass;
        } else {
            $(this).siblings(".help-inline").hide();
        }
    });
    if (!parseFloat($("#priceInput_edit").val())) {
        layer.alert("请正确填写吊牌价");
        pass = false;
        return pass;
    }
    return pass;
}
function getFinalSkus() {
    var skus = [];
    $("#list_childrenTBody>tr").each(function (index, tr) {
        var sku = {};
        sku.title = $(tr).find(".skuTitle").val();
        sku.sku_id = $(tr).find(".skuId").val();
        sku.outer_id = goodsGroup.outerId;
        sku.sell_price = $(tr).find(".sellPrice").val();
        sku.quantity = $(tr).find(".sellCount").val();
        if ($(tr).find(".skuOutterId").val()) {
            sku.id = $(tr).find(".skuOutterId").val();
        }
        skus.push(sku);
    });
    goodsGroup.sku = skus;
}

function initSelectOptions(groupInfo) {
    var def = $.Deferred();
    var childCategoryId, categoryId, brandId;
    if (groupInfo) {
        editGroupInfo = groupInfo;
        tempSku = groupInfo.sku;
        childCategoryId = groupInfo.category.Id;
        brandId = groupInfo.brand.Id;
        showEditGroupInfo(groupInfo);
    }
    getGoodsCategory().done(function (categories) {


        $("#categorySelect").empty();
        var categoryArr = JSONTreeParser.parse(categories, 'Id', 'parentId', 'children');

        console.log(categoryArr);
        for (var i = 0; i < categoryArr.length; i++) {
            var parentOption = $('<option disabled="disabled">-----' + categoryArr[i].categoryName + '-----</option>');
            $("#categorySelect").append(parentOption);
            for (var j = 0; j < categoryArr[i].children.length; j++) {
                var childOption = $('<option class="categoryOption" parentId="' + categoryArr[i].Id + '" value="' + categoryArr[i].children[j].Id + '">' + categoryArr[i].children[j].categoryName + '</option>');
                if (childCategoryId && childCategoryId == categoryArr[i].children[j].Id) {
                    childOption.attr("selected", true);
                }
                childOption.data("categoryInfo", categoryArr[i].children[j]);
                $("#categorySelect").append(childOption);
            }
        }

        categoryId = $("#categorySelect").children("option:selected").attr("parentId");
        updateShowColorsAndSizes(categoryId).done(function () {
            getBrands().done(function (brands) {
                $("#brandSelect").empty();
                for (var i = 0; i < brands.length; i++) {
                    var option = $('<option value="' + brands[i].Id + '">' + brands[i].BrandTitle + '</option>');
                    if (brandId && brandId == brands[i].Id) {
                        option.attr("selected", true);
                    }
                    option.data("brandInfo", brands[i]);
                    $("#brandSelect").append(option);
                }
                $("#brandSelect").select2();
                def.resolve();
            });
        });
    });
    return def.promise();
}

function showEditGroupInfo(groupInfo) {
    var flowStateTip = FLOW_STATE[groupInfo.State];
    if (groupInfo.State == 4) {
        flowStateTip = flowStateTip + "（" + groupInfo.checkFailReason + "）";
    }
    $("#flowStateTip_edit").text(flowStateTip);
    $("#goodsGroupTitleInput_edit").val(groupInfo.goodsGroupTitle);
    $("#outerIdInput_edit").val(groupInfo.outerId);
    $("#priceInput_edit").val(groupInfo.price);
    //快递费用
    $("#expressFeeInput").val(groupInfo.express_fee);

    $("#tagAttr_edit").empty().append('<label class="radio"><input type="radio" name="optionsRadios_sex" value="0"/>无性别区分</label>' +
    '<label class="radio"><input type="radio" name="optionsRadios_sex" value="1"/>男童</label>' +
    '<label class="radio"><input type="radio" name="optionsRadios_sex" value="2"/>女童</label>');
    $('#tagAttr_edit input[name="optionsRadios_sex"]').each(function (index, ele) {
        if (ele.value == groupInfo.tag) {
            $(ele).attr('checked', true);
        }
    });

    showGroupSku(groupInfo);

    $('#detailEditor_edit').empty();
    $("#detailEditor_edit").append('<div id="summernote_edit"></div>');
    $('#summernote_edit').html(groupInfo.goodsDetail);

    $("#thumbContainer_edit").empty();
    for (var i = 0; i < groupInfo.imgPaths.length; i++) {
        var imgDiv = $('<div class="img_thumbnailDiv"><img src="' + groupInfo.imgPaths[i] + '" class="img_thumbnail" style="width: 150px;height:150px;display: inline-block"><a href="javascript:;" class="btn icn-only deleteThumb"><i class="icon-remove"></i></a></div>');
        $("#thumbContainer_edit").append(imgDiv);
    }
}

function getGroupSKU() {
    var colors = [];
    var sizes = [];

    $("#category_color input[type=checkbox]").each(function (i, checkbox) {
        if (checkbox.checked) {
            var color = $(checkbox.parentNode).find(".colorInput").val();
            colors.push(color);
        }
    });

    $("#category_size input[type=checkbox]").each(function (i, checkbox) {
        if (checkbox.checked) {
            var size = $(checkbox.parentNode).find(".ruleInput").val();
            console.log(size);
            sizes.push(size);
        }
    });

    var SKUs = getCombinedSKUs(colors, sizes);
    goodsGroup.sku = SKUs;
}

function showGroupSku(goodsGroup) {
    $("#list_childrenTBody").empty();
    for (var i = 0; i < goodsGroup.sku.length; i++) {
        var tr = $('<tr class="skuTr">' +
        '<td><input type="hidden" class="skuOutterId" value="' + (goodsGroup.sku[i].id||'') + '"><input class="skuTitle" value="' + goodsGroup.sku[i].title + '"></td>' +
        '<td><input class="skuId" placeholder="字母+数字，不能重复" style="width: 150px" value="' + goodsGroup.sku[i].sku_id + '"></td>' +
        '<td><input class="sellPrice" placeholder="数字" style="width: 100px" value=' + goodsGroup.sku[i].sell_price + '></td>' +
        '<td><input class="sellCount" placeholder="数字" style="width: 100px" value=' + goodsGroup.sku[i].quantity + '></td>' +
        '<td><a style="cursor: pointer" class="btn mini black btnDeleteSku"><i class="icon-trash"></i> 删除</a></td>' +
        '</tr>');
        $("#list_childrenTBody").append(tr);
    }
}

function getCombinedSKUs(colors, sizes) {
    var skus = [];
    for (var i = 0; i < colors.length; i++) {
        for (var j = 0; j < sizes.length; j++) {
            var skuObj = {sku_id: "", outer_id: goodsGroup.outerId, title: colors[i] + "," + sizes[j], sell_price: ""};
            skus.push(skuObj);
        }
    }
    return skus;
}

//比较tempSku和重新生成的sku，然后合并
function compareAndReCalcSku() {
    console.log(goodsGroup.sku, tempSku);
    //sku减少
    if (goodsGroup.sku.length < tempSku.length) {
        //找到减少的sku然后从tempSku里去除
        for (var i = 0; i < tempSku.length; i++) {
            var contain = false;
            for (var j = 0; j < goodsGroup.sku.length; j++) {
                if (tempSku[i].title == goodsGroup.sku[j].title) {
                    contain = true;
                }
            }
            if (!contain) {
                console.log(i, tempSku[i].title)
                delete tempSku[i];
            }
        }
        var temp = [];
        for (var attr in tempSku) {
            if (typeof attr != "undefined") {
                temp.push(tempSku[attr]);
            }
        }
        tempSku = temp;
    }
    //sku增加
    if (goodsGroup.sku.length > tempSku.length) {
        //找到增加的sku然后添加到tempSku里去
        for (var i = 0; i < goodsGroup.sku.length; i++) {
            var contain = false;
            for (var j = 0; j < tempSku.length; j++) {
                if (goodsGroup.sku[i].title == tempSku[j].title) {
                    contain = true;
                }
            }
            if (!contain) {
                tempSku.push(goodsGroup.sku[i]);
            }
        }
    }
    goodsGroup.sku = tempSku;
}
/**
 * 编辑商品组
 * @param groupObj
 * @returns {*}
 */
function sendGoodsGroup(groupObj) {
    var def = $.Deferred();
    var url = AppConfig.URL.GOODS_EDIT + "/" + curGroupId;
    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(groupObj),
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (res) {
            if (200 === res.code) {
                console.log(res.data);
                def.resolve(res.data);
            } else {
                //  console.log(res.data);
                layer.alert(res.data);
                def.resolve(null);
            }
        },
        error: function (err) {
            console.error(err, "与服务器通信发生错误。");
            layer.alert("与服务器通信发生错误。");
            def.resolve(null);
        }
    });


    return def.promise();
}
/**
 * 查询的商品分类
 * @return Array
 */
function getGoodsCategory() {
    var def = $.Deferred();
    $.ajax({
        url: AppConfig.URL.GOODS_CATEGORY,
        type: 'POST',
        data: {},
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data);
            } else {
                def.resolve(null);
            }
        },
        error: function (err) {
            layer.alert("查询商品分类失败，请刷新页面重试。");
            def.resolve(null);
        }
    });
    return def.promise();
}

/**
 * @return Array
 */
function getBrands() {
    var def = $.Deferred();
    $.ajax({
        url: AppConfig.URL.BRAND_LIST,
        type: 'POST',
        data: JSON.stringify({pageSize: 0}),
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data.brands);
            } else {
                def.resolve(null);
            }
        },
        error: function (err) {
            layer.alert("查询品牌失败，请刷新页面重试。");
            def.resolve(null);
        }
    });
    return def.promise();
}
/**
 * @param categoryId string 查询的商品类别
 * @return Array
 */
function getGoodsColors(categoryId) {
    var def = $.Deferred();
    $.ajax({
        url: AppConfig.URL.GOODS_COLOR + "/" + categoryId,
        type: 'GET',
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data && res.data.colors);
            } else {
                def.resolve(null);
            }
        },
        error: function (err) {
            layer.alert("查询商品颜色失败，请重试。");
            def.resolve(null);
        }
    });
    return def.promise();
}

/**
 * @param categoryId string 查询的商品类别
 * @return Array
 */
function getGoodsSizes(categoryId) {
    var def = $.Deferred();
    $.ajax({
        url: AppConfig.URL.GOODS_SIZE + "/" + categoryId,
        type: 'GET',
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data && res.data.sizes);
            } else {
                def.resolve(null);
            }
        },
        error: function (err) {
            layer.alert("查询商品颜色失败，请重试。");
            def.resolve(null);
        }
    });
    return def.promise();
}
/**
 * 根据商品类别显示颜色和尺码选项
 * @param categoryId
 */
function updateShowColorsAndSizes(categoryId) {
    var def = $.Deferred();
    var layerLoadId = layer.load();
    console.log(categoryId);
    getGoodsColors(categoryId).done(function (colors) {
        if (editGroupInfo) {
            colors = editGroupInfo.customConfig.colors;
        }
        if (!colors || colors.length < 1) {
            layer.close(layerLoadId);
            def.resolve(null);
            return;
        }
        $("#category_color").empty();
        for (var i = 0; i < colors.length; i++) {
            var category_color_item = $(
                '<label class="checkbox">' +
                '<input class="colorCheck" type="checkbox"/>' +
                '<span style="display: inline-block;background-color: ' + colors[i].rgba + ';margin-top: 3px;width: 16px;height: 16px;position: absolute;"></span>' +
                '<input type="text" value="' + colors[i].color + '" class="ruleInput colorInput">' +
                '</label>');
            if (colors[i].checked) {
                category_color_item.find(".colorCheck").attr("checked", true);
            }
            $("#category_color").append(category_color_item);
        }
        //添加按钮
        var addBtn = $('<button type="button" class="btn btn-default btnAddConfig"><i class="icon-plus"></i></button>');
        $("#category_color").append(addBtn);

        getGoodsSizes(categoryId).done(function (sizes) {
            layer.close(layerLoadId);
            if (editGroupInfo) {
                sizes = editGroupInfo.customConfig.sizes;
            }
            if (!sizes || sizes.length < 1) {
                def.resolve(null);
                return;
            }
            $("#category_size").empty();
            for (var i = 0; i < sizes.length; i++) {
                var sizeStr = "";
                if (editGroupInfo) {
                    sizeStr = sizes[i].size;
                } else {
                    sizeStr = sizes[i];
                }
                var category_size_item = $(
                    '<label class="checkbox">' +
                    '<input class="sizeCheck" type="checkbox" value=""/><input type="text" value="' + sizeStr + '" class="ruleInput">' +
                    '</label>');
                if (sizes[i].checked) {
                    category_size_item.find(".sizeCheck").attr("checked", true);
                }
                $("#category_size").append(category_size_item);
            }
            //添加按钮
            var addBtn = $('<button type="button" class="btn btn-default btnAddConfig"><i class="icon-plus"></i></button>');
            $("#category_size").append(addBtn);
            def.resolve(true);
        });
    });
    return def.promise();
}

/**
 * @param formId 文件上传form元素id
 * @return obj {code: 200, msg: url}
 * @return obj {code: 300, err: "文件上传失败"}
 */
function uploadFile(formId) {
    var def = $.Deferred();
    var formData = new FormData($("#" + formId)[0]);
    $.ajax({
        url: AppConfig.URL.UPLOAD_TO_BDBCE,
        type: 'POST',
        data: formData,
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        success: function (res) {
            if (200 === res.code) {
                console.log("上传成功。");
                def.resolve(res.msg);
            } else {
                console.log(res.msg);
                layer.alert(res.msg);
                def.resolve(null);
            }
        },
        error: function (err) {
            console.error(err, "与服务器通信发生错误。");
            layer.alert("与服务器通信发生错误。");
            def.resolve(null);
        }
    });
    return def.promise();
}


function doUploadGoodsExcel() {
    var layerId = layer.load();
    uploadGoodsExcel("formUploadExcel").done(function (fileUrl) {
        layer.close(layerId);
        //console.log("批量上传完毕");
        $("#inputFile_excel").replaceWith('<input id="inputFile_excel" name="files" type="file" accept=".xls" style="cursor: pointer">');
    });
}

/**
 * @param formId 文件上传form元素id
 * @return obj {code: 200, msg: url}
 * @return obj {code: 300, err: "文件上传失败"}
 */
function uploadGoodsExcel(formId) {
    var def = $.Deferred();
    var formData = new FormData($("#" + formId)[0]);
    $.ajax({
        url: AppConfig.URL.IMPORT_GOODS_EXCEL,
        type: 'POST',
        data: formData,
        async: true,
        cache: false,
        contentType: false,
        processData: false,
        success: function (res) {
            if (200 === res.code) {
                layer.alert("上传成功。", {closeBtn: false}, function () {
                    window.location.reload();
                });
                def.resolve(res.data);
            } else {
                //console.log(res.data);
                layer.alert(res.data);
                def.resolve(null);
            }
        },
        error: function (err) {
            console.error(err, "与服务器通信发生错误。");
            layer.alert("与服务器通信发生错误。");
            def.resolve(null);
        }
    });
    return def.promise();
}

/**
 * 修改商品组sku
 * @param args
 * @returns {*}
 */
function modifyGoods(args) {
    var def = $.Deferred();
    $.ajax({
        url: AppConfig.URL.GOODS_EDIT + "/" + curGroupId,
        type: 'POST',
        data: JSON.stringify(args),
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (res) {
            if (200 === res.code) {
                //console.log(res.data);
                def.resolve(res.data);
            } else {
                //console.log(res.data);
                layer.alert(res.data);
                def.resolve(null);
            }
        },
        error: function (err) {
            console.error(err, "与服务器通信发生错误。");
            layer.alert("与服务器通信发生错误。");
            def.resolve(null);
        }
    });
    return def.promise();
}

/**
 * 删除商品组
 * @param groupId,State
 * @returns {*}
 */
function deleteGoodsGroup(groupId, State) {
    var def = $.Deferred();
    $.ajax({
        url: AppConfig.URL.GOODS_DELETE + "/" + groupId,
        type: 'POST',
        data: JSON.stringify({State: State}),
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (res) {
            if (200 === res.code) {
                //console.log(res.data);
                def.resolve(res.data);
            } else {
                //console.log(res.data);
                layer.alert(res.data);
                def.resolve(null);
            }
        },
        error: function (err) {
            console.error(err, "与服务器通信发生错误。");
            layer.alert("与服务器通信发生错误。");
            def.resolve(null);
        }
    });
    return def.promise();
}

/**
 * @return Object
 */
function getGoodsGroupInfo(goodsGroupId) {
    var def = $.Deferred();
    if (!goodsGroupId) {
        def.resolve(null);
    }
    $.ajax({
        url: AppConfig.URL.GOODS_INFO + "/" + goodsGroupId,
        type: 'GET',
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data[0]);
            } else {
                def.resolve(null);
            }
        },
        error: function (err) {
            layer.alert("查询商品组信息失败，请刷新页面重试。");
            def.resolve(null);
        }
    });
    return def.promise();
}


/**
 * @return Array
 */
function getGoodsGroups(args) {
    var def = $.Deferred();
    $.ajax({
        url: AppConfig.URL.GOODS_LIST,
        type: 'POST',
        data: JSON.stringify(args),
        dataType: "JSON",
        contentType: 'application/json',
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data);
            } else {
                def.resolve(null);
            }
        },
        error: function (err) {
            layer.alert("查询商品组信息失败，请刷新页面重试。");
            def.resolve(null);
        }
    });
    return def.promise();
}

function getAndShowGoods(pageIndex) {
    var layerLoadId = layer.load();
    var queryKeyStr = $("#queryKeyStr").val();
    var args = {pageIndex: pageIndex, State: $("#flowState_query").val(), queryKeyStr: queryKeyStr, pageSize: 100};
    getGoodsGroups(args).done(function (groupList) {
        //TODO:123123
        goodsGroups = groupList.goods;
        totalPageNum = Math.ceil(parseInt(groupList.total) / 100);
        curPageIndex = args.pageIndex;
        PagingControl.updatePagingControl(totalPageNum, curPageIndex);
        showGoodsGroup(goodsGroups);
        layer.close(layerLoadId);
    });
}

function showGoodsGroup(goods) {
    console.log(goods);
    $("#listTBody").empty();
    var temp = document.getElementById('goods_list_table').innerHTML;
    var ejs = new EJS({text: temp, type: "["});
    var html = ejs.render({list: goods, channel: channelList});
    $("#listTBody").append(html);
}

function initEditor() {
    $('#summernote_edit').summernote({
        height: 500,
        lang: 'zh-CN'
    });
}

/**
 * 键盘监听事件
 * 监听
 * up 38
 * down 40
 * delete 46
 */
function keydonwEvents() {
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 38) { // 按 Esc
            //要做的事情
            alert("按 up");
        }
        if (e && e.keyCode == 40) { // 按 F2
            //要做的事情
            alert("按 down");
        }
        if (e && e.keyCode == 46) { // enter 键
            //要做的事情
            alert("按 delete");
        }
    };
}

function init() {
    PagingControl.init(getAndShowGoods);
    getAndShowGoods(1);
    bindCommands();
    //keydonwEvents();
}

window.onload = init();