var curPageIndex = 1;
var totalPageNum = 1;
var orderState = '';
var userRole = "";
var startDay = '';
var endDay = '';

var btn_export_obj_html = {
    0: '导出全部订单',
    1: '导出待付款订单',
    2: '导出待配货订单',
    3: '导出发货中订单',
    4: '导出待签收订单',
    5: '导出待退款订单',
    9: '导出已完成订单',
    19: '导出已退款订单',
    99: '导出已取消订单'
};

function datepicker () {
    WdatePicker({
        dateFmt: 'yyyy-MM-dd'
    });
}

function exportOrders(channel) {

    startDay = $('#startDay').val();
    endDay = $('#endDay').val();
    if(startDay && endDay) {
        var udl = '/order/exportorders?channel='+channel+'&orderstate='+orderState+'&startday='+startDay+'&endday='+endDay;
        window.location.href = udl;
    } else {
      layer.msg('请选择时间');
    }

}

function bindCommands() {
    $('#btnExportOrder').on('click', function ()  {
        var _btnHtml = btn_export_obj_html[orderState];
        var arr_html = [];
        arr_html.push('<div>开始时间：');
        arr_html.push('<input onclick="return datepicker()" id="startDay" style="cursor: pointer" class="Wdate" /><br/><br/>');
        arr_html.push('结束时间：<input onclick="return datepicker()" id="endDay" style="cursor: pointer" class="Wdate" />');
        arr_html.push('</div><br/>');
        arr_html.push('<div style="float: right;" class="btn-group"><button class="btn btn-info green">'+_btnHtml+'</button>' +
        '<button class="btn btn-info dropdown-toggle green" data-toggle="dropdown"><span class="caret"></span></button>' +
        '<ul class="dropdown-menu" style="min-width: 98px">' +
        '<li><a style="cursor: pointer" onclick="return exportOrders(\'all\')">全部订单</a></li>' +
        '</ul></div>');
        artDialogCommon.noButton('导出订单', arr_html.join(''));
    });


    $("#orderState_query").on("change", function () {
        getAndShowOrders(1);
    });

    $('#orderCode_query').keydown(function (e) {
        // 按下回车键，触发搜索
        if (e.which == 13) {
            $("#btnQuery").trigger("click");
        }
    });

    $("#btnQuery,#btnQuery_agent").click(function () {
        getAndShowOrders(1);
    });

    $("#check_all").click(function () {
        $('input[name="check_item"]').attr("checked", this.checked);
    });

    $('#order_status li').click(function () {
        var target_value = $(this).find('a').attr('data-target');
        var target_msg = $(this).find('a').attr('data-msg');
        var orderIds = getCheckedOrderIds();
        if (orderIds.length == 0) {
            layer.msg('至少要选择一个吧！');
            return;
        }
        layer.confirm(target_msg, function () {
            changeOrdersStatus(orderIds, target_value).done(function (back) {
                if (back) {
                    layer.msg('操作成功~');
                } else {
                    layer.msg('操作失败，请重试！');
                }
                getAndShowOrders(curPageIndex);
            });
        });
    });

    $("#listTBody").on("click", ".btnOrdersDetail", function () {
        var orderInfo = $(this).data("orderInfo");
        var layerLoadId = layer.load();
        getOrderDetail(orderInfo).done(function (detailInfo) {
            if (!detailInfo) {
                layer.msg("查询订单失败，请刷新页面重试。");
            }
            showOrderInfo(orderInfo, detailInfo);
            layer.close(layerLoadId);
            showOrderInfoBar(orderInfo.OrderProgressState, orderInfo.Id,orderInfo.OrderCode,orderInfo.MerchantId, userRole,detailInfo.saleAfter);
        });
        $('#orderDetail_listModal').modal("show");
    });
}

/**
 * 展示订单信息
 * @param orderInfo
 * @param detailInfo
 */
function showOrderInfo(orderInfo, detailInfo) {

    console.log(orderInfo);
    console.log(detailInfo);

    var temp = document.getElementById('dev_orderInfo_template').innerHTML;
    var ejs = new EJS({text: temp, type: "["});
    var html = ejs.render({orderInfo: orderInfo, detailInfo: detailInfo});
    $("#infoContainer").html(html);
}

/**
 * 展示订单信息中的按钮
 * @param status
 * @param id
 * @param userRole
 */
function showOrderInfoBar(status, id,orderCode,MerchantId,userRole,saleAfter) {
    var temp = document.getElementById('dev_orderInfo_btns_template').innerHTML;
    var ejs = new EJS({text: temp, type: "["});
    var html = ejs.render({status: status, userRole: userRole, id: id,OrderCode:orderCode,MerchantId:MerchantId,saleAfter:saleAfter});
    $("#order_op_bar").html(html);
}

// 更改订单状态
function orderChangeConfirm(msg, state, orderId) {
    layer.confirm(msg, function () {
        var orderIds = [];
        orderIds.push(orderId);
        changeOrdersStatus(orderIds, state).done(function (back) {
            if (back) {
                layer.msg('操作成功~');
            } else {
                layer.msg('操作失败，请重试！');
            }
            $('#orderDetail_listModal').modal("hide");
            getAndShowOrders(curPageIndex);
        });
    })
}

function send_oos_msg (orderId, orderCode, mobile) {
    layer.confirm('确定要发送缺货提醒短信给用户？', function () {
        send_oos_msg_ajax(orderId, orderCode, mobile).done(function () {
            layer.msg('操作成功~');
        });
    });
}

// 缺货短信提醒
function send_oos_msg_ajax(orderId, orderCode, mobile) {
    var def = $.Deferred();
    var args = {
        'orderId': orderId,
        'orderCode': orderCode,
        'mobile': mobile
    };
    $.ajax({
        url: '/order/send_oos_msg',
        type: 'POST',
        data: JSON.stringify(args),
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data);
            } else {
                def.resolve(false);
            }
        },
        error: function (err) {
            def.resolve(false);
        }
    });
    return def.promise();
}


// 添加订单物流单号
function addOrderExpress(orderId) {

    layer.prompt({
        title: '请输入物流商',
        formType: 0 //prompt风格，支持0-2
    }, function (expressName) {
        layer.prompt({title: '请输入物流单号', formType: 2}, function (expressCode) {
            addOrderExpressAjax(orderId, expressName, expressCode).done(function (back) {
                if (back) {
                    layer.msg('添加成功~');
                    var htm = "<div><span onclick=\"return showExpressDetail(\'"+ back +"\')\">" + expressName + ":" + expressCode + "</span><i class='btn_delExpress' data-val='" + back + "' onclick=\"return delOrderExpress(\'"+ back +"\')\">X</i></div>";
                    $("#expressInfo i#btnBlurAddEx").before(htm);
                } else {
                    layer.msg('添加失败,请重试。');
                }
            });
        });
    });
}

/**
 * 编辑订单地址
 * @param oderId
 */
function editOrderConsigneeAddress(orderId) {
    getOrderConsignee(orderId).done(function (back) {
        if (back) {
            layer.prompt({
                title: '请输入新的收货地址:',
                formType: 2,
                value: back.ConsigneeName + '\n' + back.ConsigneeMobile + '\n' + back.Province + '\n' + back.City + '\n' + back.County + '\n'
                + back.Address
            }, function (address) {
                var addressArr = address.split('\n');
                var orderConsignee = {};
                orderConsignee.Id = orderId;
                for (var x in addressArr) {
                    switch (parseInt(x)) {
                        case 0:
                            orderConsignee.consigneeName = addressArr[x];
                            break;
                        case 1:
                            orderConsignee.consigneeMobile = addressArr[x];
                            break;
                        case 2:
                            orderConsignee.province = addressArr[x];
                            break;
                        case 3:
                            orderConsignee.city = addressArr[x];
                            break;
                        case 4:
                            orderConsignee.county = addressArr[x];
                            break;
                        case 5:
                            orderConsignee.address = addressArr[x];
                            break;
                    }
                }
                updateOrderConsignee(orderConsignee).done(function (back) {
                    if (back) {
                        layer.msg("更新地址成功");
                        $('#orderDetail_listModal').modal("hide");
                    } else {
                        layer.msg("更新地址失败");
                    }
                });
            });
        } else {
            layer.msg("查询地址失败");
        }
    });
}

/**
 * 获取订单收货地址
 * @param orderId
 * @return Object
 */
function getOrderConsignee(orderId) {
    var def = $.Deferred();
    var orderInfo = {orderId: orderId};
    $.ajax({
        url: "/order/consignee",
        type: 'POST',
        data: JSON.stringify(orderInfo),
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data);
            } else {
                def.resolve(false);
            }
        },
        error: function (err) {
            def.resolve(false);
        }
    });
    return def.promise();
}

/**
 * 获取订单收货地址
 * @param orderId
 * @return Object
 */
function updateOrderConsignee(orderConsignee) {
    var def = $.Deferred();
    $.ajax({
        url: "/order/consignee/update",
        type: 'POST',
        data: JSON.stringify(orderConsignee),
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (res) {
            if (200 === res.code) {
                def.resolve(true);
            } else {
                def.resolve(false);
            }
        },
        error: function (err) {
            def.resolve(false);
        }
    });
    return def.promise();
}


/**
 * 获取订单详情
 * @param orderInfo
 * @return Object
 */
function getOrderDetail(orderInfo) {
    var def = $.Deferred();
    $.ajax({
        url: AppConfig.URL.ORDER_DETAIL,
        type: 'POST',
        data: JSON.stringify(orderInfo),
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data);
            } else {
                def.resolve(false);
            }
        },
        error: function (err) {
            def.resolve(false);
        }
    });
    return def.promise();
}

// 添加物流信息
function addOrderExpressAjax(orderId, expressName, expressCode) {
    var def = $.Deferred();
    var args = {
        'orderId': orderId,
        'expressName': expressName,
        'expressCode': expressCode
    }
    $.ajax({
        url: AppConfig.URL.ORDER_ADD_EXPRESS,
        type: 'POST',
        data: JSON.stringify(args),
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data);
            } else {
                def.resolve(false);
            }
        },
        error: function (err) {
            def.resolve(false);
        }
    });
    return def.promise();
}

/**
 * @param args
 * @return Array
 */
function getOrders(args) {
    var def = $.Deferred();
    $.ajax({
        url: AppConfig.URL.ORDER_QUERY,
        type: 'POST',
        data: JSON.stringify(args),
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data);
            } else {
                def.resolve(false);
            }
        },
        error: function (err) {
            def.resolve(false);
        }
    });
    return def.promise();
}

function changeOrdersStatus(orderIds, target_status) {
    var def = $.Deferred();
    args = {orderIds: orderIds, status: target_status};
    $.ajax({
        url: AppConfig.URL.ORDERS_CHANGE_STATUS,
        type: 'POST',
        data: JSON.stringify(args),
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data);
            } else {
                def.resolve(false);
            }
        },
        error: function (err) {
            def.resolve(false);
        }
    });
    return def.promise();
}

/*function showOrders(data,curPageIndex){
 var temp = document.getElementById('dev_order_template').innerHTML;
 var ejs = new EJS({text: temp, type: "["});
 var data_table = data.data;
 var html = ejs.render({data: data_table});
 $("#listTBody").html(html);
 }*/

function showOrders(orders) {
    //console.log(orders);
    $("#listTBody").empty();
    for (var i = 0; i < orders.length; i++) {
        var orderTime = orders[i].CreateTime.replace("T", " ").replace(".000Z", "");
        var MerchantName = orders[i].AccountName || '<><>';
        var orderTr = $('<tr>' +
            ' <td><input type="checkbox" value="' + orders[i].Id + '" name="check_item"/></td>' +
            '<td>' + ((curPageIndex - 1) * AppConfig.PAGING_CONFIG.pageSize + i + 1) + '</td>' +
            '<td>' + orders[i].OrderCode + '</td>' +
            '<td><img src=\"' + orders[i].OrderImage + '\" /></td>' +
            '<td>' + orders[i].OrderTotalPrice + '</td>' +
            '<td>' + orders[i].ConsigneeName + '</td>' +
            '<td>' + orders[i].ConsigneeMobile + '</td>' +
            '<td>' + orders[i].OrderProgressInfo + '</td>' +
            '<td>' + orderTime + '</td>' +
            '<td>' + MerchantName + '</td>' +
            '<td><a href="javascript:void(0);" class="btn mini blue btnOrdersDetail"><i class="icon-list-alt"></i> 详情</a> </td>' +
            '</tr>');

        orderTr.find(".btnOrdersDetail").data("orderInfo", orders[i]);
        $("#listTBody").append(orderTr);
    }
    // order checkbox 操作
    var $check_item = $("input[name='check_item']");
    $check_item.click(function () {
        $check_item.length == $("input[name='check_item']:checked").length ? $("#check_all").attr("checked", true) : $("#check_all").attr("checked", false);
        $check_item.length == $("input[name='check_item']:checked").length ? $("#uniform-check_all span").addClass("checked") : $("#uniform-check_all span").removeClass("checked");
    });
}

function getAndShowOrders(pageIndex) {
    orderState = $("#orderState_query").val();
    var layerLoadId = layer.load();
    var args = {
        pageIndex: pageIndex,
        orderState: $("#orderState_query").val(),
        orderCode: $("#orderCode_query").val(),
        agentName: $("#agent_query").val()
    };
    //console.log(args);
    getOrders(args).done(function (orderList) {
        if (orderList) {
            //console.log(orderList);
            var totalPageNum = Math.ceil(parseInt(orderList.total) / AppConfig.PAGING_CONFIG.pageSize);
            curPageIndex = args.pageIndex;
            PagingControl.updatePagingControl(totalPageNum, curPageIndex);
            showOrders(orderList.orders);
        } else {
            layer.msg("查询订单失败，请刷新页面重试!");
        }
        layer.close(layerLoadId);
    });

}

// 获取已中的订单Id
function getCheckedOrderIds() {
    var orderIds = [];
    $("input[name='check_item']:checked").each(function () {
        orderIds.push($(this).val());
    });
    return orderIds;
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

function initDeliveryUI() {
    var user = getCookie("user");
    if (user && typeof user == "string") {
        user = JSON.parse(user);
    }
    userRole = user.role;
    if (userRole == "admin") {
        $("#orderState_query").empty().append('<option value="0">全部</option><option value="1">待付款</option><option value="2">待配货</option><option value="3">发货中</option><option value="4">待签收</option><option value="5">待退款</option><option value="9">交易成功</option><option value="19">已退款</option><option value="99">交易取消</option>');
        $("#orderOperateDiv").show();
    }
    if (userRole == "delivery") {
        $("#orderState_query").empty().append('<option value="3">发货中</option>');
        $("#orderOperateDiv").hide();
    }
}

function init() {
    initDeliveryUI();
    orderState = getUrlParam('orderState');
    $("#orderState_query").val(orderState);
    PagingControl.init(getAndShowOrders);
    getAndShowOrders(1);
    bindCommands();
}

function delOrderExpress (expressId) {
    layer.confirm('您确认要删除该物流信息吗？', function () {
        delOrderExpressAjax(expressId).done(function (back) {
            if (back) {
                $('.btn_delExpress').each(function(i){
                    if($(this).attr('data-val')== expressId){
                        $(this).parent('div').remove();
                    }
                });
                layer.msg('操作成功~');
            } else {
                layer.msg('操作失败，请重试！');
            }
            getAndShowOrders(curPageIndex);
        });
    });
}

function delOrderExpressAjax(expressId) {
    var def = $.Deferred();
    args = {expressId: expressId};
    $.ajax({
        url: '/order/delExpress',
        type: 'POST',
        data: JSON.stringify(args),
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data);
            } else {
                def.resolve(false);
            }
        },
        error: function (err) {
            def.resolve(false);
        }
    });
    return def.promise();
}

function showExpressDetail (expressId) {
    $.ajax({
        url: '/order/getExpressInfo',
        type: 'POST',
        data: JSON.stringify({expressId: expressId}),
        dataType: 'JSON',
        contentType: 'application/json',
        success: function (res) {
            if (200 === res.code) {
                var arr_html = [];
                arr_html.push('物流公司：' + res.express[0]['ExpressName'] + '<br/>');
                arr_html.push('物流单号：' + res.express[0]['ExpressCode'] + '<br/>');
                arr_html.push('创建时间：' + res.express[0]['CreateTime'].replace("T", " ").replace(".000Z", "") + '<br/>');
                var express_htm = '<table>';
                if(res.express[0]['ExpressInfo']) {
                    var expressInfo = JSON.parse(res.express[0]['ExpressInfo']);
                    var expressData = expressInfo.lastResult.data;
                    var _length = expressData.length;
                    var _list_htm = '';
                    _list_htm += ('<thead><th style="width: 143px;">时间</th><th>地点和跟踪进度</th></thead>')
                    for(var i = _length - 1; i > -1 ; i --){
                        _list_htm += ('<tr><td>' + expressData[i]['time'] + '</td><td>' + expressData[i]['context'] + '</td></tr>')
                    }
                    express_htm += _list_htm;
                }else {
                    express_htm += '<tr><td>暂无物流进度信息</td></tr>';
                }
                express_htm += '</table>';
                arr_html.push('物流详情：' + express_htm);
                artDialogCommon.normal('物流进度', arr_html.join(''));
            } else {
                layer.msg('查询物流失败');
            }
        },
        error: function (err) {
            layer.msg('查询物流失败');
        }
    });
}

//订单信息 orderInfo
window.oi = window.oi || {};
//订单修改
oi.change = {
    __goods_db: new TAFFY(),

    clickEvents: function (orderCode, sku_id, num, price) {
        oi.change.getChangeGoods(orderCode, sku_id, num, price);
    },
    getChangeGoods: function (orderCode, sku_id, num, price) {
        var url = '/order/getChangeGoods';
        var param = {orderCode: orderCode, sku_id: sku_id};
        var data = {num: num, price: price};
        common.ajax(url, param, oi.change._getChangeGoodsSuc, oi.change._error, data)
    },
    _getChangeGoodsSuc: function (data, data2) {
        if (data.code == 200) {
            oi.change.__goods_db().remove();
            oi.change.__goods_db = TAFFY(data.msg.goods);
            oi.change._dealData();
            var temp = document.getElementById('dev_show_goods').innerHTML;
            var ejs = new EJS({text: temp, type: "["});
            var html = ejs.render({
                data: oi.change.__goods_db().get(),
                num: data2.num,
                price: data2.price,
                orderId: data.msg.order.orderId,
                oldGoodsId: data.msg.order.goodsId
            });
            artDialogCommon.normal('修改商品', html, oi.change.changeGoodsOK);
        } else {
            layer.alert(data.msg);
        }
    },
    _error: function (err) {
        console.log(err);
    },
    //处理数据
    _dealData: function () {
        var len = oi.change.__goods_db().count();
        for (var i = 0; i < len; i++) {
            var color_size = oi.change.__goods_db().get()[i].FilterConfig;
            var color = color_size.split(',')[0];
            var size = color_size.split(',')[1];
            oi.change.__goods_db().get()[i].color = color;
            oi.change.__goods_db().get()[i].size = size;
        }
    },
    /**
     * 商品修改成功回调
     */
    changeGoodsOK: function () {
        var goodsId, orderId, oldGoodsId, goodsConfig;
        $('[name="dev_radio"]').each(function () {
            if ($(this).attr("checked")) {
                goodsId = $(this).attr("goodsid");
                orderId = $(this).attr("orderid");
                oldGoodsId = $(this).attr('oldgoodsid');
                goodsConfig = $(this).attr('goodsConfig');
            }
        });
        if (goodsId && orderId && oldGoodsId) {
            var goodsInfo = oi.change.__goods_db({Id: goodsId}).get()[0];
            var url = '/order/changeGoods';
            var param = {
                goodsId: goodsId,
                orderId: orderId,
                oldGoodsId: oldGoodsId,
                goodsConfig: goodsConfig,
                goodsTitle: goodsInfo.GoodsTitle,
                sku_id: goodsInfo.Skuid
            };
            common.ajax(url, param, oi.change._changeSuc, oi.change._error)
        }

    },
    _changeSuc: function (data) {
        if (data.code == '200') {
            layer.alert(data.msg);
        } else {
            layer.alert(data.msg);
        }
    },
    _getMerchantSuc: function (data) {
        if (data.code == '200') {
            var arr_html = [];
            arr_html.push('收件人：' + data.msg.ReturnUsername + '<br/>');
            arr_html.push('收件人电话：' + data.msg.ReturnUserPhone + '<br/>');
            arr_html.push('收件人地址：' + data.msg.ReturnAddress + '<br/>');
            artDialogCommon.normal('商家信息', arr_html.join(''));
        }
    }
};

window.onload = init();
