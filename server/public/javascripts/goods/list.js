/**
 * 商品列表
 * Created by zlongxiao@126.com on 2015/11/7.
 */
window.goods = window.goods || {};

$(function () {
    PagingControl.init(goods.list.getAndShowDetail);
    goods.list.getAndShowDetail(1);
    //$("#formUploadExcel").on('change',goods.list.batchAddGoods);
    $("#flowState_query").on("change", function () {
        goods.list._flowState = $("#flowState_query").val();
        goods.list.getAndShowDetail(1);
    });
});

goods.list = {

    _keywords: "",

    _flowState: "",

    /**
     * 关键字搜索
     */
    goodsSearch: function () {
        goods.list._keywords = $.trim($("#queryKeyStr").val());
        goods.list.getAndShowDetail(1);
    },
    /**
     * 列表数据获取参数传递
     * @param pageIndex
     */
    getAndShowDetail: function (pageIndex, keywords) {
        var args = {
            pageIndex: pageIndex
        };
        goods.list.getDetail(args);
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
        var param = {pageIndex: args.pageIndex};
        if (goods.list._keywords) {
            param.queryKeyStr = goods.list._keywords;
        }
        if (goods.list._flowState) {
            param.saleState = goods.list._flowState;
        }
        common.ajax(url, param, goods.list._getDetailSucc, goods.list._getDetailError, data);
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
        goods.list.refreshTable(data.data.goods, curPageIndex);
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
     * @param goods
     */
    refreshTable: function (goods) {
        var temp = document.getElementById('goods_list_table').innerHTML;
        var ejs = new EJS({text: temp, type: "["});
        var html = ejs.render({list: goods});
        $("#listTBody").html(html);
    },
    /**
     * 批量上传商品
     * 功能废弃（没有调试通过）
     */
    batchAddGoods: function () {
        var layerId = layer.load();
        var url = '/goods/import/goods_excel';
        var formData = new FormData($("#formUploadExcel")[0]);
        common.ajax(url, formData, goods.list._batchAddSuc, goods.list._error, layerId);
    },
    _batchAddSuc: function (data, layerId) {

        $("#inputFile_excel").replaceWith('<input id="inputFile_excel" name="files" type="file" accept=".xls" style="cursor: pointer">');
    },
    _error: function () {
        layer.alert('服务异常');
    },
    /**
     * 删除商品组
     * @param goodsGroupId
     */
    deleteGoodGroup: function (goodsGroupId) {
        var url = '/goodsgroup/delete/';
        var param = {goodsGroupId: goodsGroupId};
        common.ajax(url, param, goods.list._deleteSuc, goods.list._error);
    },
    _deleteSuc: function (data) {
        if (data.code == 200) {
            layer.alert(data.msg);
            goods.list.getAndShowDetail(1);
        } else {
            layer.alert(data.msg);
        }
    },
    alertCannotEdit: function (brandTitle){
        layer.alert('您的品牌<span style="color: red;font-weight: bolder">'+ brandTitle + '</span>未通过审核，请联系管理员，审后才能编辑哦！');
    }
};