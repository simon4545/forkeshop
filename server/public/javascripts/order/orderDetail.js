var userRole = "";

function showOrdetail() {

    var orderCode = getUrlParam("ocd");

    getAndShowOrders(1,orderCode,function(orderInfo){
        var layerLoadId = layer.load();

        getOrderDetail(orderInfo).done(function (detailInfo) {
            if (!detailInfo) {
                layer.msg("查询订单失败，请刷新页面重试。");
            }
            showOrderInfo(orderInfo, detailInfo);
            layer.close(layerLoadId);
        });
        $('#orderDetail_Modal').show();
    });
}

//http://127.0.0.1:3000/order/orderDetail?ocd=201511162103177761

function getAndShowOrders(pageIndex,ocd,callback) {
    var layerLoadId = layer.load();
    var args = {
        pageIndex: pageIndex,
        orderState: "",
        orderCode: ocd,
        agentName: ""
    };
    getOrders(args).done(function (orderList) {
        if (orderList) {
            callback(orderList.orders[0]);
        } else {
            layer.msg("查询订单失败，请刷新页面重试!");
        }
        layer.close(layerLoadId);
    });
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
    $("#orderDetail_Modal").html(html);
}

/**
 * 展示订单信息中的按钮
 * @param status
 * @param id
 * @param userRole
 */
function showOrderInfoBar(status, id, userRole) {
    var temp = document.getElementById('dev_orderInfo_btns_template').innerHTML;
    var ejs = new EJS({text: temp, type: "["});
    var html = ejs.render({status: status, userRole: userRole, id: id});
    $("#order_op_bar").html(html);
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

function init(){
    showOrdetail();
}

window.onload = init();
