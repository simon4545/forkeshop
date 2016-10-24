/**
 * Created by zlongxiao@126.com on 2015/11/11.
 */

window.goods = window.goods || {};
$(function () {
    goods.verify.init();
});

goods.verify = {
    _groupId: "",
    //列表页的数据
    _listHref: "",
    //列表页的数据
    queryString: function () {
        var keywords = common.QueryString('queryKeyStr');
        var brandId = common.QueryString('brandId');
        var flowState = common.QueryString('flowState');
        var pageIndex = common.QueryString('pageIndex');
        goods.verify._listHref = '/goods/mgr?queryKeyStr=' + keywords + "&brandId=" + brandId + "&flowState=" + flowState + "&pageIndex=" + pageIndex;
    },

    divHide: function (divId) {
        $('#' + divId).hide();
    },
    init: function () {
        goods.verify.queryString();
        goods.verify._groupId = common.QueryString('goodsGroupId');
        goods.verify.mainView.init();
        if (checkSnapshot) {
            goods.verify.snapShotView.init();
        }

        $('#btnMainPre').click(function () {
            $("#div_main_detail_m").show();
        });
        $('#btnSnapShotPre').click(function () {
            $("#div_snap_detail_m").show();
        });
        $("#mainControl").on('click', function () {
            $(this).addClass('.btn blue');
            $("#snapshotControl").removeClass('.btn blue').addClass('.btn');
            $("#mainGoods").show();
            $("#snapshotGoods").hide();
        });

        $("#snapshotControl").on('click', function () {
            if (checkSnapshot) {
                $(this).addClass('.btn blue');
                $("#mainControl").removeClass('.btn blue').addClass('.btn');
                $("#snapshotGoods").show();
                $("#mainGoods").hide();
                //$("#div_snap_detail_m").show();
            } else {
                layer.alert('没有快照信息');
            }
        });

        $("#btnCheckPass").on('click', function () {
            goods.verify.btnEvents.checkPass();
        });

        $("#btnCheckFail").on('click', function () {
            goods.verify.btnEvents.checkNoPass();
        });

        $("#btnCancel").on('click', function () {
            window.location.href = goods.verify._listHref;
        });
        $("#btnOtherOp").on('click', function () {
            var goodsGroupId = common.QueryString('goodsGroupId');
            arr_html = [];
            arr_html.push('<div style="width: 100%;">商品销售状态重置：<button onclick="goods.verify.resetGoodsSaleState(\'' + goodsGroupId + '\', 1)" type="button" class="btn red">置为可售</button> ' +
                '<button onclick="goods.verify.resetGoodsSaleState(\'' + goodsGroupId + '\', 2)" type="button" class="btn" style="color: white;text-shadow: none;background-color: #ad6704;">强制下架</button>' +
                '<div style="margin: 15px 0px;">注：强制下架的商品如果加入专场可以展示，不能购买~</div>');
            artDialogCommon.noButton('商品其他操作', arr_html.join(''));
        });
    },

    resetGoodsSaleState: function (goodsGroupId, state) {
        common.ajax('/goodsgroup/resetGoodsSaleState', {state: state, goodsGroupId: goodsGroupId}, function (data) {
            layer.msg('重置成功~')
        }, function () {
            layer.msg('重置失败~')
        });
    },

    /**
     * 获取商品分类信息
     * @param $id
     */
    getCategory: function ($id) {
        var url = '/goods/category';
        common.ajax(url, "", goods.verify._getCategorySuc, goods.verify._error, $id);
    },
    /**
     * 商品分类成功回调
     * @param data
     * @param $id
     * @private
     */
    _getCategorySuc: function (data, $id) {
        if (data.code == 200) {
            var categoryArr = data.data;
            var id = $("#" + $id).attr('values');
            for (var i = 0; i < categoryArr.length; i++) {
                if (categoryArr[i].Id == id) {
                    $("#" + $id).val(categoryArr[i].categoryName);
                }
            }
        }
    },
    /**
     * 获取品牌信息
     * @param $id
     */
    /**getBrand: function ($id) {
        var url = '/brand/list';
        common.ajax(url, "", goods.verify._getBrandSuc, goods.verify._error, $id);
    },
     _getBrandSuc: function (data, $id) {
        if (data.code == '200') {
            try {
                var id = $("#" + $id).attr('values');
                var brands = data.data.brands;
                var len = brands.length;
                for (var i = 0; i < len; i++) {
                    if (brands[i].Id == id) {
                        $("#" + $id).val(brands[i].BrandTitle);
                    }
                }
            } catch (e) {
                layer.alert("数据异常");
            }
        }
    },**/
    _error: function () {
        layer.alert('数据异常');
    },
    /**
     * sku 表格展示
     * @param skuInfo
     * @param $id
     */
    skus: function (skuInfo, $id) {
        try {
            var t = new NCTable(
                {
                    cols: [
                        {title: '编号', alias: 'Id', visible: false, editable: false},
                        {title: '规则', alias: 'FilterConfig', visible: true, editable: false},
                        {title: '商品SKU', alias: 'Skuid', visible: true, editable: false},
                        {
                            title: '售价',
                            alias: 'GoodsSalePrice',
                            type: 'number',
                            visible: true,
                            editable: true
                        },
                        {
                            title: '供货价',
                            alias: 'GoodsSupplyPrice',
                            type: 'number',
                            visible: true,
                            editable: false
                        },
                        {title: '库存', alias: 'MaxCount', type: 'number', visible: true, editable: false}
                    ],
                    container: '#' + $id,
                    headerClassName: '',
                    itemClassName: '',
                    className: '',
                    op: false,
                    id: 'test',
                    onDeleteItem: function (id) {
                    },
                    onUpdateItem: function (id, key, value) {
                        if (key == 'GoodsSalePrice') {
                            if ($id == 'dev_skus') {
                                goods.verify.mainView.updateSupplyPrice(id, value);
                            } else {
                                goods.verify.snapShotView.updateSupplyPrice(id, value);
                            }
                        }

                    }
                }
            );
            t.refresh(skuInfo);
        } catch (e) {
            layer.alert('数据异常');
        }
    },

    labels: function (data, $id) {
        var len = data.length;
        var arr_html = [];
        for (var i = 0; i < len; i++) {
            arr_html.push('<label class="checkbox">');
            if (data[i].checked) {
                arr_html.push('<input type="checkbox" value="" checked="checked" disabled/>');
            } else {
                arr_html.push('<input type="checkbox" value="" disabled/>');
            }
            arr_html.push('<span class="ruleInput noteInput">' + data[i].label + '</span>');
            arr_html.push('</label>');
        }
        $("#" + $id).html(arr_html.join(''));
    },
    /**
     * 主表中的信息展示
     */
    mainView: {
        _labeldb: TAFFY(),
        _maindb: TAFFY(),
        main_view_db: TAFFY(),
        init: function () {
            try {
                goods.verify.getCategory('categoryInput');
                //goods.verify.getBrand('brandInput');
                var data = JSON.parse(mainSKuList);
                goods.verify.mainView.main_view_db = TAFFY(data);
                for (var i = 0; i < data.length; i++) {
                    goods.verify.mainView._maindb.insert(new SKU_SUPPLY(data[i].Id, data[i].GoodsSalePrice, data[i].GoodsSupplyPrice));
                }
                goods.verify.skus(goods.verify.mainView.main_view_db().get(), 'dev_skus');

                var labelList = JSON.parse(labelStr);
                for (var i = 0; i < labelList.length; i++) {
                    goods.verify.mainView._labeldb.insert(new Labels(labelList[i]));
                }
                var chooseLabelList = mainChooseLabelStr.split(',');
                for (var j = 0; j < chooseLabelList.length; j++) {
                    goods.verify.mainView._labeldb({label: chooseLabelList[j]}).update({checked: true});
                }
                goods.verify.labels(goods.verify.mainView._labeldb().get(), 'dev_goodsLabel');

            } catch (e) {
                layer.alert('数据异常');
            }
        },
        updateSupplyPrice: function (id, value) {
            goods.verify.mainView._maindb({id: id}).update({salePrice: value});
        },
        /**
         * 批量更新快照价格
         */
        batchUpdateSupplyPrice: function () {
            var percent = $("#dev_main_batch").val();
            if (percent != '') {
                var value = 1 + percent / 100;
                goods.verify.mainView._maindb().update(function () {
                    this.salePrice = parseFloat((this.supplyPrice * value).toFixed(1));
                    this.change = true;
                    return this;
                });
                goods.verify.mainView.main_view_db().update(function () {
                    this.GoodsSalePrice = parseFloat((this.GoodsSupplyPrice * value).toFixed(1));
                    return this;
                });
                //刷新数据
                goods.verify.skus(goods.verify.mainView.main_view_db().get(), 'dev_skus');
            }

        }
    },
    /**
     * 快照中的信息展示
     */
    snapShotView: {
        _labeldb: TAFFY(),
        _snapdb: TAFFY(),
        snap_view_db: TAFFY(),
        init: function () {
            try {
                var groupInfo = eval("(" + replace2html(snapShotGroupInfo) + ")");
                $("#categoryInput_snapshot").attr('values', groupInfo.CategoryId);
                //$("#brandInput_snapShot").attr("values", groupInfo.BrandId);
                $("#goodsGroupTitleInput_snapshot").val(groupInfo.GoodsGroupTitle);
                $("#outerIdInput_snapshot").val(groupInfo.Outeriid);
                $("#express_fee_snapshot").val(groupInfo.ExpressFee);
                $("#priceInput_snapshot").val(groupInfo.GoodsPrice);
                $("#div_snap_createtime").html(groupInfo.SnapCreateTime.replace('T', ' ').replace('.000Z', ''));
                if (groupInfo.SnapFlag == 1) {
                    $("#div_snap_flag").html("<span style='color: green'>审核通过</span>");
                } else {
                    $("#div_snap_flag").html("<span style='color: red'>未审核或审核不通过</span>");
                }

                goods.verify.getCategory('categoryInput_snapshot');
                //goods.verify.getBrand('brandInput_snapShot');
                var data = JSON.parse(ssSku);
                goods.verify.snapShotView.snap_view_db = TAFFY(data);
                for (var i = 0; i < data.length; i++) {
                    goods.verify.snapShotView._snapdb.insert(new SKU_SUPPLY(data[i].Id, data[i].GoodsSalePrice, data[i].GoodsSupplyPrice));
                }
                goods.verify.skus(goods.verify.snapShotView.snap_view_db().get(), 'dev_skus_snapshot');
                //图片处理
                var imgs = JSON.parse(ssImg);
                var arr_html = [];
                for (var i = 0; i < imgs.length; i++) {
                    arr_html.push('<img src="' + imgs[i] + '" class="img_thumbnail" style="width: 150px;height:150px;display: inline-block">');
                    arr_html.push('<a href="' + imgs[i] + '" download="' + imgs[i] + '" class="btn icn-only downloadFile"><i class="icon-arrow-down"></i></a>')
                }
                $("#imgs_snapshot").html(arr_html);
                $('#summernote_snapshot').html(groupInfo.GoodsDetail);
                $('#snap_div_detail').html(groupInfo.GoodsDetail.replace(/(style|width|height|class)=\".*?\"/ig, ''));
                $('#dev_goodsLink').val(groupInfo.GoodsLink);

                var labelList = JSON.parse(labelStr);
                for (var i = 0; i < labelList.length; i++) {
                    goods.verify.snapShotView._labeldb.insert(new Labels(labelList[i]));
                }
                var chooseLabelList = ssLabelStr.split(',');
                for (var j = 0; j < chooseLabelList.length; j++) {
                    goods.verify.snapShotView._labeldb({label: chooseLabelList[j]}).update({checked: true});
                }
                goods.verify.labels(goods.verify.snapShotView._labeldb().get(), 'dev_goodsLabel_snapshot');

            } catch (e) {
                console.log(e);
                layer.alert('数据异常');
            }
        },
        updateSupplyPrice: function (id, value) {
            goods.verify.snapShotView._snapdb({id: id}).update({salePrice: value});
        },
        /**
         * 批量更新快照价格
         */
        batchUpdateSupplyPrice: function () {
            var percent = $("#dev_snapshot_batch").val();
            if (percent != '') {
                var value = 1 + percent / 100;
                goods.verify.snapShotView._snapdb().update(function () {
                    this.salePrice = parseFloat((this.supplyPrice * value).toFixed(1));
                    this.change = true;
                    return this;
                });
                goods.verify.snapShotView.snap_view_db().update(function () {
                    this.GoodsSalePrice = parseFloat((this.GoodsSupplyPrice * value).toFixed(1));
                    return this;
                });
                //刷新数据
                goods.verify.skus(goods.verify.snapShotView.snap_view_db().get(), 'dev_skus_snapshot');
            }

        }
    },
    btnEvents: {
        checkPass: function () {
            var loadId = layer.load();
            var url = '/goods/checkPass';
            var param = {State: 3, goodsGroupId: goods.verify._groupId};
            /*//检查价格是否有变化
             goods.verify.salePriceChange();
             if (checkSnapshot) {
             param.type = 'snapshot';
             param.saleObj = goods.verify.snapShotView._snapdb().get();
             } else {
             param.type = 'main';
             param.saleObj = goods.verify.mainView._maindb().get();
             }*/
            common.ajax(url, param, goods.verify.btnEvents._checkPassSuc, goods.verify._error, loadId);
        },
        _checkPassSuc: function (data, loadId) {
            layer.close(loadId);
            if (data.code == 200) {
                layer.alert(data.data, {closeBtn: false}, function () {
                    window.location.href = goods.verify._listHref;
                });
            } else {
                layer.alert(data.data);
            }
        },
        checkNoPass: function () {
            layer.prompt({title: '请输入审核不通过理由，并确认', formType: 2}, function (text) {
                var goodsObj = {State: 4, AuditOpinion: text};
                var url = '/goods/audit/' + goods.verify._groupId;
                common.ajax(url, goodsObj, goods.verify.btnEvents._checkPassSuc, goods.verify._error);
            });
        }
    },
    /**
     * 检查价格是否有变化
     */
    salePriceChange: function () {
        var data, len = 0;
        if (checkSnapshot) {
            data = goods.verify.snapShotView._snapdb().get();
            len = data.length;
            for (var i = 0; i < len; i++) {
                if (data[i].salePrice != data[i].salePriceTem) {
                    goods.verify.snapShotView._snapdb({id: data[i].id}).update({change: true});
                }
            }
        } else {
            data = goods.verify.mainView._maindb().get();
            len = data.length;
            for (var i = 0; i < len; i++) {
                if (data[i].salePrice != data[i].salePriceTem) {
                    goods.verify.mainView._maindb({id: data[i].id}).update({change: true});
                }
            }
        }
    },
    /**
     * 修改商品的售价
     */
    changeGoodsPrice: function (type) {
        var url = '/goods/updateGoodsSalePrice';
        var param = {goodsGroupId: goods.verify._groupId, type: type};
        //检查价格是否有变化
        goods.verify.salePriceChange();
        if (type == 'main') {
            param.saleObj = goods.verify.mainView._maindb().get();
        } else {
            param.saleObj = goods.verify.snapShotView._snapdb().get();
        }
        if (param.saleObj.length == 0) {
            layer.alert('没有数据修改，请不要提交！');
        } else {
            common.ajax(url, param, goods.verify._changeGoodsPriceSuc, goods.verify._error);
        }

    },
    _changeGoodsPriceSuc: function (data) {
        layer.alert(data.msg);
    }

};

/**
 * 转义html 内容
 * @param str
 * @returns {string|XML}
 */
function replace2html(str) {
    return str.replace(/&#34;/ig, "'").replace(/&lt;/ig, '<').replace(/&gt;/ig, '>')
        .replace(/&nbsp;/ig, ' ').replace(/&amp;/ig, '&').replace(/&quot;/ig, '"');
}


/**
 * 商品标签基类
 * @param label
 * @param checked
 * @constructor
 */
function Labels(label, checked) {
    this.label = label;
    this.checked = checked ? true : false;
}

function SKU_SUPPLY(id, salePrice, supplyPrice) {
    this.id = id;
    this.salePrice = salePrice;
    this.salePriceTem = salePrice;
    this.supplyPrice = supplyPrice;
    this.change = false;
}
