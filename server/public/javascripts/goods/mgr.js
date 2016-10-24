/**
 * Created by zlongxiao@126.com on 2015/11/13.
 */
window.goods = window.goods || {};
$(function () {
    goods.mgr.queryString();
    PagingControl.init(goods.mgr.getAndShowDetail);
    //goods.mgr.getBrand();
    //goods.mgr.getAction();
    goods.mgr.getAndShowDetail(goods.mgr._pageIndex);
    $("#btnQueryGoods").click(function () {
        goods.mgr._keywords = $.trim($("#queryKeyStr").val());
        goods.mgr.getAndShowDetail(1);
    });

    $("#flowState_query").on("change", function () {
        goods.mgr._flowState = $("#flowState_query").val();
        if (goods.mgr._flowState == 0) {
            goods.mgr._flowState = '';
        }
        goods.mgr.getAndShowDetail(1);
    });

    /**$("#goodsBrand_query").on('change', function () {
        goods.mgr._brandId = $(this).val();
        goods.mgr.getAndShowDetail(1);
    });**/
});

goods.mgr = {
    _keywords: '',

    _brandId: '',

    _flowState: '',

    _pageIndex: 1,

    _channelList: [],

    _actionList: [],
    /**
     * 截获URL中的参数
     */
    queryString: function () {
        goods.mgr._keywords = decodeURIComponent(common.QueryString('queryKeyStr'));
        if (goods.mgr._keywords != 'null') {
            $("#queryKeyStr").val(goods.mgr._keywords);
        } else {
            goods.mgr._keywords = '';
        }
        goods.mgr._brandId = common.QueryString('brandId');
        goods.mgr._flowState = common.QueryString('flowState');
        goods.mgr._pageIndex = common.QueryString('pageIndex');
    },
    /**
     * 列表数据获取参数传递
     * @param pageIndex
     */
    getAndShowDetail: function (pageIndex) {
        goods.mgr._pageIndex = pageIndex || 1;

        var args = {
            pageIndex: pageIndex || 1
        };

        goods.mgr.getDetail(args);
    },
    /**
     * 列表数据获取
     * @param args
     */
    getDetail: function (args) {
        var layerLoadId = layer.load();
        var url = '/goodsgroup/list';
        var data = {
            succ: {
                args: args,
                layerLoadId: layerLoadId
            }
        };
        var param = {pageIndex: args.pageIndex, pageSize: 100};
        //if (goods.mgr._pageIndex) {
        param.pageIndex = goods.mgr._pageIndex;
        //}
        if (goods.mgr._keywords) {
            param.queryKeyStr = goods.mgr._keywords;
        }
        if (goods.mgr._flowState) {
            param.flowState = goods.mgr._flowState;
        }
        if (goods.mgr._brandId) {
            param.brandId = goods.mgr._brandId;
        }
        param.goodsOption=goodsOption;
        common.ajax(url, param, goods.mgr._getDetailSucc, goods.mgr._getDetailError, data);
    },
    /**
     * 列表数据获取成功回调
     * @param data
     * @param parm
     * @private
     */
    _getDetailSucc: function (data, parm) {
        var totalPageNum = Math.ceil(parseInt(data.data.total) / 100);
        var curPageIndex = parm.succ.args.pageIndex;
        goods.mgr.refreshTable(data.data.goods, curPageIndex);
        PagingControl.updatePagingControl(totalPageNum, curPageIndex);
        layer.close(parm.succ.layerLoadId);
    },
    /**
     * 列表数据获取失败回调
     * @param err
     * @param parm
     * @private
     */
    _getDetailError: function (err, parm) {
        layer.close(parm.succ.layerLoadId);
    },
    /**
     * 列表数据绑定
     * @param data
     */
    refreshTable: function (data, pageIndex) {
        var temp = document.getElementById('goods_list_table').innerHTML;
        var ejs = new EJS({text: temp, type: "["});
        var html = ejs.render({
            list: data,
            queryKeyStr: goods.mgr._keywords,
            flowState: goods.mgr._flowState,
            brandId: goods.mgr._brandId,
            actionList: goods.mgr._actionList,
            pageIndex: pageIndex
        });
        $("#listTBody").html(html);

        var actionsObj = $(".action_change");
        actionsObj.select2();
    },
    _error: function (e) {
        layer.alert('与服务器通信异常');
    },
    /**
     * 获取品牌信息
     */
    /**getBrand: function () {
        var url = '/brand/list';
        common.ajax(url, '', goods.mgr._getBrandSuc, goods.mgr._error);
    },
    _getBrandSuc: function (data) {
        if (data.code == 200) {
            var brands = data.data.brands;
            var goodsBrandObj = $("#goodsBrand_query");
            goodsBrandObj.append($('<option value="" checked>全部</option>'));
            for (var i = 0; i < brands.length; i++) {
                var option = $('<option value="' + brands[i].Id + '">' + brands[i].BrandTitle + '(' + brands[i].AccountName +  ')'+ '</option>');
                goodsBrandObj.append(option);
            }
            goodsBrandObj.select2();
        }
    },
    getAction: function () {
        var url = '/actions/list';
        common.ajax(url, {pageIndex : -1}, goods.mgr._getActionSuc, goods.mgr._error);
    },
    _getActionSuc: function (data) {
        if (data.code == 200) {
            goods.mgr._actionList = data.msg.data;
        }
    },**/

    /**
     * 修改商品来源和商品的地址
     * @param goodsGroupId
     * @param channelName
     * @param goodsLink
     */
    changeChannel: function (goodsGroupId, channelName, goodsLink) {
        var url = '/goods/changeChannel';
        if (channelName === '0') return;
        var param = {goodsGroupId: goodsGroupId};
        if (channelName) {
            param.channelName = channelName;
            common.ajax(url, param, goods.mgr._changeChannelSuc, goods.mgr._error);
        }
        if (goodsLink) {
            param.goodsLink = goodsLink;
            common.ajax(url, param, goods.mgr._changeChannelSuc, goods.mgr._error);
        }
    },
    _changeChannelSuc: function () {
    },
    /**
     * 商品组更换场景
     * @param goodsGroupId
     * @param ActionId
     * @private
     */
    _changeAction: function(goodsGroupId, oldActionId, newActionId, actionTitle) {
        if(newActionId == '0') {
           layer.alert('请从活动管理中删除~');
        } else {
            layer.confirm('是否将该商品加入 ' + actionTitle + '?', function () {
                var url = '/actions/goods/change';
                var param = {groupId: goodsGroupId, oldAId: oldActionId, newAId: newActionId};
                common.ajax(url, param, goods.mgr._changeActionSuc, goods.mgr._error);
            });
        }
    },
    _changeActionSuc: function (data) {
        layer.msg(data.msg, {time: 800});
    }
};