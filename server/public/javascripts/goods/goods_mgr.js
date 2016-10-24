var totalPageNum = 1;
var curPageIndex = 1;
var goodsId = null;
var channelList = [];

function bindCommands() {
    $("#btnQueryGoods").click(function () {
        getAndShowGoods(1);
    });

    $("#flowState_query").on("change", function () {
        getAndShowGoods(1);
    });


    getGoodsBrands().done(function(data){
        var brands = data.brands;
        $("#goodsBrand_query").append($('<option value="" checked>全部</option>'));
        for (var i = 0; i < brands.length; i++) {
            var option = $('<option value="' + brands[i].Id + '">' + brands[i].BrandTitle + '</option>');
            $("#goodsBrand_query").append(option);
        }
        $("#goodsBrand_query").select2();
        $("#goodsBrand_query").on('change', function(){
            getAndShowGoods(1);
        });
    });


    $("#listTBody").on("click", ".btnGoodsDetail", function () {
        goodsId = $(this).attr("data-id");
        var layerId = layer.load();
        getGoodsGroupInfo(goodsId).done(function (goodsInfo) {
            if (goodsInfo) {
                //console.log(goodsInfo);
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
                        '<td>' + goodsInfo.sku[i].quantity + '</td>' +
                        '</tr>');
                    $("#listTBody_childGoods").append(tr);
                }

                $('#summernote').html(goodsInfo.goodsDetail);

                $("#flowStateTip").text(FLOW_STATE[goodsInfo.flowState]);

                if (goodsInfo.flowState == 2) {
                    $("#btnCheckPass").show();
                    $("#btnCheckFail").show();
                } else {
                    $("#btnCheckPass").hide();
                    $("#btnCheckFail").hide();
                }
                $("#list_container").hide();
                $("#add_edit_container").show();
            }
            layer.close(layerId);
        });
    });

    $("#btnCancel").click(function () {
        $("#list_container").show();
        $("#add_edit_container").hide();
    });

    $("#btnCheckPass").click(function () {
        var goodsObj = {State: 3};
        auditGoodsGroup(goodsObj).done(function (result) {
            if (result) {
                layer.alert("提交成功！", {closeBtn: false}, function () {
                    window.location.reload();
                });
            }
        });
    });

    $("#btnCheckFail").click(function () {
        layer.prompt({title: '请输入审核不通过理由，并确认', formType: 2}, function (text) {
            var goodsObj = {State: 4, checkFailReason: text};
            auditGoodsGroup(goodsObj).done(function (result) {
                if (result) {
                    layer.alert("提交成功！", {closeBtn: false}, function () {
                        window.location.reload();
                    });
                }
            });
        });

    });
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
 * 编辑商品信息
 * @param goodsObj
 * @returns {*}
 */
function sendGoods(goodsObj) {
    var def = $.Deferred();
    var url = AppConfig.URL.GOODS_EDIT + "/" + goodsId;
    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(goodsObj),
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
 * @param args
 * @return Array
 */
function getGoods(args) {
    var def = $.Deferred();
    $.ajax({
        url: AppConfig.URL.GOODS_LIST,
        type: 'POST',
        data: JSON.stringify(args),
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data);
            } else {
                def.resolve(null);
            }
        },
        error: function (err) {
            layer.alert("查询失败，请刷新页面重试。");
            def.resolve(null);
        }
    });
    return def.promise();
}


function auditGoodsGroup(groupObj) {
    var def = $.Deferred();
    $.ajax({
        url: '/goods/audit/'+goodsId,
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

function showGoods(goods) {
    console.log(goods);
    $("#listTBody").empty();
    /*var tr = $('<tr>'+
     '<td>'+((curPageIndex-1)*100+i+1)+'</td>'+
     '<td>'+goods[i].goodsGroupTitle+'</td>'+
     '<td>'+FLOW_STATE[goods[i].flowState]+'</td>'+
     '<td><a href="#" class="btn mini blue btnGoodsDetail"><i class="icon-list-alt"></i> 详情</a></td>'+
     '</tr>');*/
    var temp = document.getElementById('goods_list_table').innerHTML;
    var ejs = new EJS({text: temp, type: "["});
    console.log(goods);
    var html = ejs.render({list: goods, channel: channelList});
    $("#listTBody").append(html);
}


function err(err) {
    layer.alert(err.msg);
}

function getAndShowGoods(pageIndex) {
    var loadId = layer.load();
    var queryKeyStr = $("#queryKeyStr").val();
    var brandId = $('#goodsBrand_query').val();
    var args = {
        pageIndex: pageIndex,
        pageSize: 100,
        flowState: $("#flowState_query").val(),
        queryKeyStr: queryKeyStr,
        brandId : brandId
    };
    getGoods(args).done(function (goodsList) {
        if (goodsList) {
            console.log(goodsList);
            totalPageNum = Math.ceil(parseInt(goodsList.total) / 100);
            curPageIndex = args.pageIndex;
            PagingControl.updatePagingControl(totalPageNum, curPageIndex);
            showGoods(goodsList.goods);
        }
        layer.close(loadId);
    });
}

function getGoodsBrands() {
    var def = $.Deferred();
    $.ajax({
        url: '/brand/list',
        type: 'post',
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

function init() {
    PagingControl.init(getAndShowGoods);
    getAndShowGoods(1);
    bindCommands();
}

window.onload = init();