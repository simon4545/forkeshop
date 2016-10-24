var Sync = require('sync');
var AppConfig = require('../config');
var mysql_con = global.app.get('mysql_con');
var knex_con = global.app.get('knex_con');
var payFactory = require("../lib/payFactory").payFactory;
var orderController = require('../controller/orderController');
var comFunc = require('../common').comFunc;
/*******************************阿里支付****************************************************/
// 支付宝支付后端回调
function alipayNotify(req, res) {
    Sync(function () {
        try {
            var data = req.body;
            console.log('支付宝调起了我们的后端回调(body)：');
            console.log(data);
            payFactory.verifyNotify(data, 'ali', function (ret) {
                console.log('verifyNotify结果：' + ret);
                console.log('trade_status：' + data.trade_status);
                console.log('out_trade_no：' + data.out_trade_no);
                if (ret) {
                    if (data.trade_status == 'TRADE_FINISHED' || data.trade_status == 'TRADE_SUCCESS') {

                        console.log(data.out_trade_no);
                        var result = orderController._orderPayCallback(data.out_trade_no);
                        if (result) {
                            console.log('success');
                            res.end('success');
                        } else {
                            throw {};
                        }

                    } else {
                        throw {};
                    }
                } else {
                    throw {};
                }
            });
        } catch (e) {
            console.error(e);
            console.log('fail');
            res.end('fail');
        }
    });
}

function alipayReturn() {
    var data = req.query;
    var orderCode = data.out_trade_no;
    res.redirect('http://www.bbxvip.com/myOrders');
}

/*******************************微信支付****************************************************/
//微信的H5支付授权token回调页面
function h5WeixinRedirect(req, res) {
    var code = req.query.code, orderCode = req.query.state;
    Sync(function () {
        // 先查询订单是否存在和能否支付
        var sql = knex_con.select().from('bbx_orders').where({
            OrderCode: orderCode,
            OrderProgressState: AppConfig.OrderState.WAITING
        }).toString();
        var order = mysql_con.query.sync(mysql_con, sql)[0];
        if (order.length > 0) {
            // 去获取openId和支付
            payFactory.wcPayOauthBack(code, order[0], res);
        } else {
            // 订单支付失败
            res.redirect('http://www.bbxvip.com/myOrders');
        }
    });
}

/**
 * 微信后端回调
 * @param req
 * @param res
 * @private
 */
function weixinNotify(req, res) {
    try {
        var data = req.body;
        console.log('微信支付调起了我们的后端回调(body)：');
        console.log(data);
        // 先验证签名
        // 再调用order方法执行拆单
        payFactory.verifyNotify(data, 'wc', function (err, ret) {
            if (ret && !err) {
                Sync(function () {
                    console.log(data.out_trade_no);
                    var result = orderController._orderPayCallback(data.xml.out_trade_no);
                    if (result) {
                        console.log('success');

                        console.log(comFunc.buildXml({ return_code: 'SUCCESS' }));
                        res.send(comFunc.buildXml({ return_code: 'SUCCESS' }));
                    } else {
                        throw {};
                    }
                });
            } else {
                throw err;
            }
        });
    } catch (e) {
        console.error(e);
        console.log('fail');
        console.log(comFunc.buildXml({ return_code: 'FAIL' }));
        res.send(comFunc.buildXml({ return_code: 'FAIL' }));
    }
}

exports.alipayNotify = alipayNotify;
exports.alipayReturn = alipayReturn;
exports.h5WeixinRedirect = h5WeixinRedirect;
exports.weixinNotify = weixinNotify;
