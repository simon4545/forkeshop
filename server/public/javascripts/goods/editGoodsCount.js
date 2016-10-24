/**
 * 编辑库存
 * Created by zlongxiao@126.com on 2015/11/24.
 */

window.goods = window.goods || {};
$(function () {
    goods.egc.init();
});

goods.egc = {
    goodsGroupId: '',
    skudb: TAFFY(),
    _table: undefined,
    init: function () {
        goods.egc.goodsGroupId = common.QueryString('goodsGroupId');
        goods.egc.initSkudb();
        goods.egc.universalTable();
        goods.egc.refreshTable();
        $("#dev_commit").on('click', function () {
            goods.egc.commit();
        })
    },
    initSkudb: function () {
        var skuObj = JSON.parse(skuStr);
        for (var i = 0; i < skuObj.length; i++) {
            var data = skuObj[i];
            goods.egc.skudb.insert(new Sku(data.Id, data.FilterConfig, data.Skuid, data.GoodsSupplyPrice, data.MaxCount))
        }
    },
    universalTable: function () {
        goods.egc._table = new NCTable(
            {
                cols: [
                    {title: '编号', alias: 'Id', visible: false, editable: false},
                    {title: '规则', alias: 'FilterConfig', visible: true, editable: false},
                    {title: '商品SKU', alias: 'Skuid', visible: true, editable: false},
                    {title: '供货价', alias: 'GoodsSupplyPrice', type: 'number', visible: true, editable: false},
                    {title: '库存', alias: 'MaxCount', type: 'number', visible: true, editable: true}
                ],
                container: '#dev_sku_table',
                headerClassName: '',
                itemClassName: '',
                className: '',
                op: false,
                id: 'test',
                onDeleteItem: function (id) {
                    layer.alert('不允许删除');
                },
                onUpdateItem: function (id, key, value) {
                    switch (key) {
                        case 'MaxCount':
                            goods.egc.updateMaxCount(id, value);
                            break;
                    }
                }
            });
    },
    refreshTable: function () {
        goods.egc._table.refresh(goods.egc.skudb().get());
    },
    updateMaxCount: function (id, value) {
        goods.egc.skudb({Id: id}).update({MaxCount: value});
    },
    commit: function () {
        var url = '/goods/changeMaxCount';
        var data = goods.egc.skudb().get();
        var len = goods.egc.skudb().count();
        var info = [];
        for (var i = 0; i < len; i++) {
            if (data[i].MaxCount != data[i].MaxCountTemp) {
                info.push(data[i]);
            }
        }
        if (info.length > 0) {
            var param = {skuInfo: info};
            common.ajax(url, param, goods.egc._commitSuc, goods.egc._commitErr);
        } else {
            layer.alert('没有检测到库存修改');
        }
    },
    _commitSuc: function (data) {
        layer.alert(data.msg);
    },
    _commitErr: function (err) {
        layer.alert(err.msg);
    }
};

/**
 * sku 对象
 * @param id
 * @param filterConfig
 * @param skuid
 * @param salePrice
 * @param count
 * @constructor
 */
function Sku(id, filterConfig, skuid, salePrice, count) {
    this.Id = id;
    this.FilterConfig = filterConfig;
    this.Skuid = skuid;
    this.GoodsSupplyPrice = salePrice;
    this.MaxCount = count;
    this.MaxCountTemp = count;
    this.goodsGroupId = goods.egc.goodsGroupId;
}