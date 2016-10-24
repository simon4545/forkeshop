var goodsGroup = {};
var editGroupId = null;
var editGroupInfo = null;
var tempSku = [];
//TODO 上传图片接口需要，暂时处理
var pageType='add';
function bindCommands() {
    $("#btnQueryTaoBaoGoods").click(function () {
        var queryTaoBaoGoodsId = $("#queryTaoBaoGoodsId").val();
        getAndShowTaoBaoGoods(queryTaoBaoGoodsId);
    });

    $("#btnConfirm").click(function () {
        var result = getGroupInfo();
        if (!result) {
            return;
        }
        if (editGroupInfo && editGroupInfo.State == 3) {
            //如果当前已经是审核通过了，则需要改变flowState到未审核状态
            goodsGroup.State = 1;
        }
        var layerLoadId = layer.load();
        sendGoodsGroup(goodsGroup).done(function (result) {
            layer.close(layerLoadId);
            if (result) {
                layer.alert("提交成功！", {closeBtn: false}, function () {
                    window.location.replace("/goods/list");
                });
            }
        });
    });

    $("#btnSubmitCheck").click(function () {
        var args = {};
        args.State = 2;
        var layerLoadId = layer.load();
        auditGoodsGroup(args).done(function (result) {
            layer.close(layerLoadId);
            if (result) {
                layer.alert("提交成功！", {closeBtn: false}, function () {
                    window.location.replace("/goods/list");
                });
            }
        });
    });

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
                $("#thumbContainer").append(imgThumb);
            }
        });
    });

    $("#thumbContainer").on("click", ".deleteThumb", function () {
        $(this).parent().remove();
    });

    $("#thumbContainer").on("click", ".img_thumbnail", function () {
        $("#thumbContainer").find(".img_thumbnail").removeClass("bordered");
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
}

function getAndShowTaoBaoGoods(queryTaoBaoGoodsId) {
    var layerId = layer.load();
    getTaoBaoGoodsInfo(queryTaoBaoGoodsId).done(function (taoInfo) {
        if (taoInfo) {
            console.log(taoInfo);
            //处理taoInfo
            var groupInfo = {};
            groupInfo.brand = {
                "Id": "55e6b1e3c0249fac0f7f8741",
                "Id": "5d3f8e57a5fc4055bebd395e3aaea5c0",
                "BrandTitle": "other",
                "BrandSort": 141,
                "BrandInfo": "other",
                "CreateTime": "2015-05-21 01:01:02",
                "BrandLogo": "http://bj.bcebos.com/mbbxvip/brand/5d3f8e57a5fc4055bebd395e3aaea5c0.png",
                "State": 3,
                "user": {
                    "username": "test1",
                    "Id": "55af29c67347c44e43466bca"
                }
            }
            groupInfo.category = {};
            groupInfo.customConfig = taoInfo.customConfig;
            groupInfo.State = 1;
            groupInfo.goodsDetail = '';
            for (var i = 0; i < taoInfo.goodsDetail.length; i++) {
                if (taoInfo.goodsDetail[i].label == "img") {
                    groupInfo.goodsDetail += '<p style="text-align: center; "><img src="' + taoInfo.goodsDetail[i].content + '" data-filename="" style="width: 640px;"></p><p><br></p>';
                }
            }
            groupInfo.goodsGroupTitle = taoInfo.goodsGroupTitle;
            groupInfo.imgPaths = taoInfo.imgPaths;
            groupInfo.outerId = taoInfo.outerId;
            groupInfo.price = taoInfo.price;
            groupInfo.sku = taoInfo.sku;
            groupInfo.tag = 0;
            groupInfo.user = {
                "username": "test1",
                "Id": "55af29c67347c44e43466bca"
            }

            initSelectOptions(groupInfo).done(function () {
                initEditor();
                layer.msg("导入成功！");
            });
        } else {
            layer.alert("未查询到商品信息，请核对ID后重试！");
        }
        layer.close(layerId);
    });
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

function showGroupSku(goodsGroup) {
    $("#list_childrenTBody").empty();
    for (var i = 0; i < goodsGroup.sku.length; i++) {
        var tr = $('<tr class="skuTr">' +
        '<td><input class="skuTitle" value="' + goodsGroup.sku[i].title + '"></td>' +
        '<td><input class="skuId" placeholder="字母+数字，不能重复" style="width: 100px" value="' + goodsGroup.sku[i].sku_id + '"></td>' +
        '<td><input class="sellPrice" placeholder="数字" style="width: 100px" value=' + goodsGroup.sku[i].sell_price + '></td>' +
        '<td><input class="maxCount" placeholder="数字" style="width: 100px" value="50"></td>' +
        '<td><a href="#" class="btn mini black btnDeleteSku"><i class="icon-trash"></i> 删除</a></td>' +
        '</tr>');
        $("#list_childrenTBody").append(tr);
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

function getFinalSkus() {
    var skus = [];
    $("#list_childrenTBody>tr").each(function (index, tr) {
        var sku = {};
        sku.title = $(tr).find(".skuTitle").val();
        sku.sku_id = $(tr).find(".skuId").val();
        sku.outer_id = goodsGroup.outerId;
        sku.sell_price = $(tr).find(".sellPrice").val();
        sku.quantity = $(tr).find(".maxCount").val();
        skus.push(sku);
    });
    goodsGroup.sku = skus;
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

function getGroupInfo() {
    var formResult = validateForm();
    if (!formResult) {
        return false;
    }

    goodsGroup.category = $("#categorySelect").children("option:selected").data("categoryInfo");
    goodsGroup.goodsGroupTitle = $("#goodsGroupTitleInput").val();
    goodsGroup.outerId = $("#outerIdInput").val();
    goodsGroup.price = parseFloat($("#priceInput").val());
    goodsGroup.tag = parseInt($('#targetPerson input[name="optionsRadios_sex"]:checked ').val());
    goodsGroup.saleState = parseInt($('#publishState input[name="saleState"]:checked ').val());
    goodsGroup.express_fee = parseFloat($("#ExpressFee").val());
    goodsGroup.goodsDetail = $('#summernote').code();

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
    $("#thumbContainer img").each(function (i, img) {
        imgPaths.push(img.src);
    });
    if (imgPaths.length < 1) {
        layer.alert("请上传商品图片。");
        return false;
    }
    //根据选中的图片调换首张图片
    var borderedImg = $("#thumbContainer").find(".bordered");
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

/**
 * 根据商品类别显示颜色和尺码选项
 * @param categoryId
 */
function updateShowColorsAndSizes(categoryId) {

    $("#category_color").empty();
    $("#category_size").empty();
    //添加按钮
    var addBtn = $('<button type="button" class="btn btn-default  btnAddConfig"><i class="icon-plus"></i></button>');
    $("#category_color").append(addBtn);
    //添加按钮
    var addBtn = $('<button type="button" class="btn btn-default  btnAddConfig"><i class="icon-plus"></i></button>');
    $("#category_size").append(addBtn);
    var def = $.Deferred();
    var layerLoadId = layer.load();
    getGoodsColors(categoryId).done(function (colors) {
        if (editGroupInfo) {
            colors = editGroupInfo.customConfig.colors;
        }
        if (!colors || colors.length < 1) {
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
 * @return Object
 */
function getTaoBaoGoodsInfo(goodsId) {
    var def = $.Deferred();
    if (!goodsId) {
        def.resolve(null);
    }
    $.ajax({
        url: AppConfig.URL.TAOBAO_GOODS_INFO + "?outId=" + goodsId,
        type: 'GET',
        success: function (res) {
            if (res) {
                if (typeof res == "string") {
                    res = JSON.parse(res);
                }
                if (!res.goodsGroupTitle) {
                    def.resolve(null);
                } else {
                    def.resolve(res);
                }
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
 * 添加/编辑商品组
 * @param groupObj
 * @returns {*}
 */
function sendGoodsGroup(groupObj) {
    var def = $.Deferred();
    if (editGroupId) {
        var url = AppConfig.URL.GOODS_EDIT + "/" + editGroupId;
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
    } else {
        var url = AppConfig.URL.GOODS_CREATE;
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
                    console.log(res.data);
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
    }

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

function auditGoodsGroup(groupObj) {
    var def = $.Deferred();
    if(!editGroupId){
        alert('请先保存！');
        def.resolve(null);
        return def.promise();
    }
    $.ajax({
        url: '/goods/audit/'+editGroupId,
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
            def.resolve();
        });
    });
    return def.promise();
}

function showEditGroupInfo(groupInfo) {
    var flowStateTip = FLOW_STATE[groupInfo.State];
    if (groupInfo.State == 4) {
        flowStateTip = flowStateTip + "（" + groupInfo.checkFailReason + "）";
    }
    $("#flowStateTip").text(flowStateTip);
    $("#goodsGroupTitleInput").val(groupInfo.goodsGroupTitle);
    $("#outerIdInput").val(groupInfo.outerId);
    $("#priceInput").val(groupInfo.price);
    $("#targetPerson").empty().append('<label class="radio"><input type="radio" name="optionsRadios_sex" value="0"/>无性别区分</label>' +
    '<label class="radio"><input type="radio" name="optionsRadios_sex" value="1"/>男童</label>' +
    '<label class="radio"><input type="radio" name="optionsRadios_sex" value="2"/>女童</label>');
    $('#targetPerson input[name="optionsRadios_sex"]').each(function (index, ele) {
        if (ele.value == groupInfo.tag) {
            $(ele).attr('checked', true);
        }
    });

    showGroupSku(groupInfo);

    $('#detailEditor').empty();
    $("#detailEditor").append('<div id="summernote"></div>');
    $('#summernote').html(groupInfo.goodsDetail);

    $("#thumbContainer").empty();
    for (var i = 0; i < groupInfo.imgPaths.length; i++) {
        var imgDiv = $('<div class="img_thumbnailDiv"><img src="' + groupInfo.imgPaths[i] + '" class="img_thumbnail" style="width: 150px;height:150px;display: inline-block"><a href="javascript:;" class="btn icn-only deleteThumb"><i class="icon-remove"></i></a></div>');
        $("#thumbContainer").append(imgDiv);
    }
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
    if (!parseFloat($("#priceInput").val())) {
        layer.alert("请正确填写吊牌价");
        pass = false;
        return pass;
    }
    return pass;
}

function initEditor() {
    $('#summernote').summernote({
        height: 500,
        lang: 'zh-CN'
    });
}

function init() {
    if (location.search) {
        editGroupId = location.search.replace("?", "");
    }
    getGoodsGroupInfo(editGroupId).done(function (groupInfo) {
        console.log(groupInfo);
        initSelectOptions(groupInfo).done(function () {
            initEditor();
            bindCommands();
        });
    });


}

window.onload = init();