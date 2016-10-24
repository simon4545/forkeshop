/**
 * Created by Administrator on 2015/7/30.
 */
/**
 * 商家商品数据对接
 *
 */
$(function () {
    exportMerchant.bindEvents();
});

var exportMerchant = {
    bindEvents: function () {
        $("#inputFile_groupImg").on('change', function () {
            var loadId = layer.load();
            //这里往云端传图片后获取到一个地址
            exportMerchant.uploadFile("formUploadGroupImg").done(function (data) {
                layer.close(loadId);
                //var eval_data = eval("(" + data + ")");
                //eval_data = exportMerchant.dealDate(eval_data);
                //var html = exportMerchant.showTable(eval_data);
                //$("#dev_show_table").html(html);
            });
        })
    },
    uploadFile: function (formId) {
        var def = $.Deferred();
        var formData = new FormData($("#" + formId)[0]);
        $.ajax({
            url: AppConfig.URL.UPLOAD,
            type: 'POST',
            data: formData,
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (200 === data.code) {
                    //$("#imgShow").attr('src', data.msg.url);
                    layer.msg('导入完成，请到订单列表里检查一下');
                    def.resolve(data.data);
                } else {
                    console.log(data.msg);
                    layer.alert(data.msg);
                    def.resolve(null);
                }
            },
            error: function (err) {
                console.error(err, "与服务器通信发生错误。");
                layer.msg("与服务器通信发生错误。");
                def.resolve(null);
            }
        });
        return def.promise();
    },

    dealDate: function (data) {
        var res = [];
        for (var item in data) {
            var _data = data[item];
            var temp_data = {};
            for (var item2 in _data) {
                if (item2 == '序号') {
                    temp_data.num = _data[item2];
                }
                if (item2 == '销售订单号') {
                    temp_data.salesOrderNum = _data[item2];
                }
                if (item2 == '商品代码') {
                    temp_data.goodsCode = _data[item2];
                }
                if (item2 == '商品名称') {
                    temp_data.goodsName = _data[item2];
                }
                if (item2 == 'SKU') {
                    temp_data.SKU = _data[item2];
                }
                if (item2 == '数量') {
                    temp_data.count = _data[item2];
                }
                if (item2 == '商品单价') {
                    temp_data.price = _data[item2];
                }
                if (item2 == '收货人') {
                    temp_data.receiver = _data[item2];
                }
                if (item2 == '电话') {
                    temp_data.phoneNum = _data[item2];
                }
                if (item2 == '地址') {
                    temp_data.address = _data[item2];
                }
                if (item2 == '支付方式') {
                    temp_data.payway = _data[item2];
                }
                if (item2 == '拍单时间') {
                    temp_data.getGoodsTime = _data[item2];
                }
                if (item2 == '物流商') {
                    temp_data.expressCompany = _data[item2];
                }
                if (item2 == '快递单号') {
                    temp_data.trackingNum = _data[item2];
                }
                if (item2 == '备注') {
                    temp_data.remark = _data[item2];
                }
                if (item2 == '结款状态') {
                    temp_data.orderType = _data[item2];
                }
                if (item2 == '图片') {
                    temp_data.img = _data[item2];
                }
            }
            res.push(temp_data);
        }
        return res;
    },
    showTable: function (data) {
        var arr_html = [];
        arr_html.push('<table class="table table-striped table-hover table-bordered">');
        arr_html.push('<thead>');
        arr_html.push('<tr>');
        arr_html.push('<th>序号</th>');
        arr_html.push('    <th>销售订单号</th>');
        arr_html.push('    <th>商品代码</th>');
        arr_html.push('   <th>商品名称</th>');
        arr_html.push('   <th>SKU</th>');
        arr_html.push('   <th>数量</th>');
        arr_html.push('   <th>商品单价</th>');
        arr_html.push('   <th>收货人</th>');
        arr_html.push('   <th>电话</th>');
        arr_html.push('   <th>地址</th>');
        arr_html.push('   <th>支付方式</th>');
        arr_html.push('    <th>拍单时间</th>');
        arr_html.push('    <th>物流商</th>');
        arr_html.push('<th>快递单号</th>');
        arr_html.push('<th>备注</th>');
        arr_html.push('<th>结款状态</th>');
        arr_html.push('<th>图片</th>');
        arr_html.push('</tr>');
        arr_html.push('</thead>');
        for (var item in data) {
            arr_html.push('<tbody>');
            arr_html.push('<tr class="">');
            arr_html.push('<td>{0}</td>'.format(data[item].num));
            arr_html.push('<td>{0}</td>'.format(data[item].salesOrderNum));
            arr_html.push('<td>{0}</td>'.format(data[item].goodsCode));
            arr_html.push('<td>{0}</td>'.format(data[item].goodsName));
            arr_html.push('<td>{0}</td>'.format(data[item].SKU));
            arr_html.push('<td>{0}</td>'.format(data[item].count));
            arr_html.push('<td>{0}</td>'.format(data[item].price));
            arr_html.push('<td>{0}</td>'.format(data[item].receiver));
            arr_html.push('<td>{0}</td>'.format(data[item].phoneNum));
            arr_html.push('<td >{0}</td>'.format(data[item].address));
            arr_html.push('<td>{0}</td>'.format(data[item].payway));
            arr_html.push('<td>{0}</td>'.format(data[item].getGoodsTime));
            arr_html.push('<td>{0}</td>'.format(data[item].expressCompany));
            arr_html.push('<td>{0}</td>'.format(data[item].trackingNum));
            arr_html.push('<td>{0}</td>'.format(data[item].remark));
            arr_html.push('<td>{0}</td>'.format(data[item].orderType));
            arr_html.push('<td>{0}</td>'.format(data[item].img));
            arr_html.push('</tr>    ');
            arr_html.push('</tbody>');
        }
        arr_html.push('</table>');
        return arr_html.join('');
    }
};


String.prototype.format = function () {
    var s = this, i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};