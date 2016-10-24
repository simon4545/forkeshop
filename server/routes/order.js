var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var urlencode = require('urlencode');
var Sync = require('sync');
var common = require('../common');
var utils = require('../utils');
var AppConfig = require('../config');
var path = require('path');
var mysql_db = global.app.get('MysqlConn');
var DateFormater = require('../public/javascripts/utils/dateFormater');
var orderController = require('../controller/orderController');
var request = require('request');

//订单管理页面
router.get('/list', function (req, res) {
    var data = {
        orderState: req.query.orderState,
        user: req.session.user
    };

    res.render('order/order_list', data);
});

//查询订单接口
router.post('/query', function (req, res) {
    var queryArgs = req.body;
    var pageIndex = queryArgs.pageIndex;
    var page = pageIndex || 1;
    Sync(function () {

        var queryStr = 'where 1=1 ';
        if(req.cookies.user.Role != '管理员') {
            queryStr += ' and bbx_orders.MerchantId = ' + req.cookies.user.Id +' ';
        }

        if (queryArgs.orderState && queryArgs.orderState != "0") {
            queryStr += 'and bbx_orders.OrderProgressState = ' + queryArgs.orderState;
            if (queryArgs.orderCode) {
                queryStr += " and (bbx_orders.OrderCode like '%" + queryArgs.orderCode + "%' or bbx_orders.PaidCode like '%" + queryArgs.orderCode + "%' or bbx_consignee4orders.ConsigneeMobile like  '%"
                + queryArgs.orderCode +
                "%' or bbx_consignee4orders.ConsigneeName like '%"
                + queryArgs.orderCode +
                "%')";
            }
        } else {
            if (queryArgs.orderCode) {
                queryStr += " and (bbx_orders.OrderCode like '%" + queryArgs.orderCode + "%' or bbx_orders.PaidCode like '%" + queryArgs.orderCode + "%' or bbx_consignee4orders.ConsigneeMobile like  '%"
                + queryArgs.orderCode +
                "%' or bbx_consignee4orders.ConsigneeName like '%"
                + queryArgs.orderCode +
                "%')";
            }
        }
        try {

            var count_result = mysql_db.query.sync(
                mysql_db,
                'select count(1) as _count from bbx_orders' +
                ' left JOIN bbx_consignee4orders ' +
                ' ON bbx_orders.Id=bbx_consignee4orders.Id left join bbx_account on bbx_account.Id = bbx_orders.MerchantId ' +
                queryStr
                );

            var query_result = mysql_db.query.sync(
                mysql_db,
                'SELECT bbx_orders.*,bbx_account.AccountName,bbx_consignee4orders.ConsigneeMobile,bbx_consignee4orders.ConsigneeName FROM bbx_orders ' +
                ' left JOIN bbx_consignee4orders ' +
                ' ON bbx_orders.Id=bbx_consignee4orders.Id left join bbx_account on bbx_account.Id = bbx_orders.MerchantId ' +
                queryStr + ' order by bbx_orders.CreateTime desc  limit ?,?',
                [(page - 1) * AppConfig.PAGING_CONFIG.pageSize, AppConfig.PAGING_CONFIG.pageSize]
                );

            var result = { total: count_result[0][0]['_count'], orders: query_result[0] };
            res.json({ code: 200, data: result });
        } catch (err) {
            console.error(err);
            res.json({ code: 300, data: "查询订单失败" });
        }
    });
});

//查询订单详情接口
router.post('/detail', function (req, res) {
    var queryArgs = req.body;

    var agentId = queryArgs.AgentId;
    var orderId = queryArgs.Id;
    var goods_query = 'where bbx_goods4orders.OrderId=' + '"' + orderId + '"';
    Sync(function () {
        try {
            var sql = `SELECT
                            Id,
                            OrderCode,
                            CASE OrderProgressState IN (1, 99)
                        WHEN TRUE THEN
                            ''
                        ELSE
                            OrderTime
                        END OrderTime
                        FROM
                            bbx_orders
                        WHERE
                            Id = ? `;

            var trade = mysql_db.query.sync(mysql_db, sql, [orderId])[0][0];
            var tradeId = trade.Id;
            var tradeCode = trade.OrderCode;
            var payTime = trade.OrderTime;

            var agent_result = [];

            var member_sql = 'select MemberAccount from `bbx_member`  where Id=?';
            var member_result = mysql_db.query.sync(mysql_db, member_sql, [queryArgs.MemberId]);


            var consignee_sql = 'select Id,ConsigneeName,ConsigneeMobile,Province,City,County,Address from `bbx_consignee4orders`  where Id=?';
            var consignee_result = mysql_db.query.sync(mysql_db, consignee_sql, [tradeId]);

            //2015-11-12 ycz 为解决退单统计goodsgroupId修改
            var gsqlycz = "select vgl.GoodsGroupId,bgo.GoodsImgPath,bgo.GoodsTitle,bgo.GoodsSalePrice,GoodsNum,bgo.Skuid,bgo.GoodsId,beo.ExpressName,beo.ExpressCode,vgl.BrandTitle from bbx_goods4orders bgo " +
                "LEFT JOIN bbx_express4orders beo ON beo.Id = bgo.ExpressId " +
                "LEFT JOIN bbx_view_goods_list vgl ON vgl.Id = bgo.GoodsId where bgo.OrderId = ? ";

            var goods_result = mysql_db.query.sync(mysql_db, gsqlycz, [orderId]);

            var express_sql = 'SELECT Id,ExpressCode,ExpressName,CreateTime FROM bbx_express4orders  where OrderId=?';
            var express_order_result = mysql_db.query.sync(mysql_db, express_sql, [orderId]);

            var result = {};
            if (agent_result.length > 0) {
                result.Agent = { agentUser: agent_result[0].username };
            } else {
                result.Agent = agentId ? { agentUser: '(AgentId：' + agentId + ')'} : {};
            }

            if (member_result[0][0]) {
                result.MemberAccount = member_result[0][0].MemberAccount;
            } else {
                result.MemberAccount = "";
            }


            result.CouponPar = "";
            result.CouponTitle = "";


            if (consignee_result[0][0]) {
                result.Id = consignee_result[0][0].Id;
                result.ConsigneeName = consignee_result[0][0].ConsigneeName;
                result.ConsigneeMobile = consignee_result[0][0].ConsigneeMobile;
                result.Province = consignee_result[0][0].Province;
                result.City = consignee_result[0][0].City;
                result.County = consignee_result[0][0].County;
                result.Address = consignee_result[0][0].Address;
            } else {
                result.Id = "";
                result.ConsigneeName = "";
                result.ConsigneeMobile = "";
                result.Province = "";
                result.City = "";
                result.County = "";
                result.Address = "";
            }

            if (goods_result[0] && goods_result[0].length > 0) {
                result.Goods = goods_result[0];
            } else {
                result.Goods = [];
            }

            if (express_order_result[0] && express_order_result[0].length > 0) {
                result.Express = express_order_result[0];
            } else {
                result.Express = [];
            }
            result.tradeCode = tradeCode;
            result.PayTime = payTime;
            result.saleAfter = "";

            /********** 20151204 yczhu Add **************/

            res.json({ code: 200, data: result });
        } catch (e) {
            console.error(e);
            res.json({ code: 300, data: '查询订单详情失败' });
        }
    });
});

// 获取订单收货详情
router.post('/consignee', function (req, res) {
    var orderId = req.body.orderId;
    Sync(function () {
        try {
            var consignee_result = mysql_db.query.sync(
                mysql_db,
                'select Id,ConsigneeName,ConsigneeMobile,Province,City,County,Address from `bbx_consignee4orders` where Id = ?',
                [orderId]
                );
            res.json({ code: 200, data: consignee_result[0][0] });
        } catch (e) {
            res.json({ code: 300, data: '查询订单收货地址失败' });
        }
    });
});

// 更新订单收货地址
router.post('/consignee/update', function (req, res) {
    var orderId = req.body.Id;
    var consigneeName = req.body.consigneeName;
    var consigneeMobile = req.body.consigneeMobile;
    var province = req.body.province;
    var city = req.body.city;
    var county = req.body.county;
    var address = req.body.address;
    console.error(req.body);
    Sync(function () {
        try {
            var consignee_result = mysql_db.query.sync(
                mysql_db,
                'update bbx_consignee4orders set ConsigneeName=?,ConsigneeMobile=?, Province=?,City=?,County=?,Address=? where Id = ?',
                [consigneeName, consigneeMobile, province, city, county, address, orderId]
                );
            res.json({ code: 200, data: null });
        } catch (e) {
            res.json({ code: 300, data: '更新订单收货地址失败' });
        }
    });
});


router.post('/change_status_by_Code', function (req, res) {
    orderController.changeStatusByCode(req, res);
});

// 批量修改订单状态
router.post('/change_status_batch', function (req, res) {
    // 状态：1（待付款），可改为99（取消交易）（建议不处理）
    // 状态：2（待配货），可改为3（待发货）,5（待退款）
    // 状态：3（待发货），可改为4（待签收），5（待退款）
    // 状态：4（待签收），可改为9（交易成功），5（待退款）
    // 状态：5（待退款），可改为19（已退款），2（待配货）
    var queryArgs = req.body;
    var orderIds = queryArgs.orderIds;
    var status = parseInt(queryArgs.status);

    Sync(function () {
        try {
            for (var i = 0; i < orderIds.length; i++) {
                var order_query = "'" + orderIds[i] + "'";
                var order_result = mysql_db.query.sync(
                    mysql_db,
                    "select OrderProgressState from bbx_orders where Id =" + order_query
                    );
                if (order_result[0] && order_result[0].length > 0) {
                    var orderProgressState = order_result[0][0].OrderProgressState;
                    if (orderProgressState == 1 || orderProgressState == 9 || orderProgressState == 19 || orderProgressState == 99) {
                        // 如果订单状态为待付款、已完成、已退款、取消交易，则不能再修改状态
                    } else if (orderProgressState == 5 && (status == 19 || status == 2)) {
                        // 如果订单状态为待退款，则只能做确认退款和取消退款操作
                        var order_result = mysql_db.query.sync(
                            mysql_db,
                            "update bbx_orders set OrderProgressState = " + status + ", OrderProgressInfo = '" + AppConfig.ORDER_STATE[status] + "',OrderTime = '" + DateFormater.format(new Date(), "yyyy-MM-dd hh:mm:ss") + "' where Id =" + order_query
                            );

                    } else if (status > orderProgressState) {
                        // 剩下的只要修改的状态大于已有的状态码就能修改
                        var order_result = mysql_db.query.sync(
                            mysql_db,
                            "update bbx_orders set OrderProgressState = " + status + ", OrderProgressInfo = '" + AppConfig.ORDER_STATE[status] + "', OrderTime = '" + DateFormater.format(new Date(), "yyyy-MM-dd hh:mm:ss") + "' where Id =" + order_query
                            );

                    }
                }
            }
            res.json({ code: 200, data: '操作成功' });
        } catch (e) {
            console.error(e);
            res.json({ code: 300, data: '操作失败' });
        }
    });
});

router.post('/add_express', function (req, res) {
    var queryArgs = req.body;
    var orderId = queryArgs.orderId;
    var expressName = queryArgs.expressName;
    var expressCode = queryArgs.expressCode.replace(/[^A-z0-9]+/g, '');
    Sync(function () {
        try {
            var ret_body = request.sync(null, 'http://www.kuaidi100.com/autonumber/autoComNum?text=' + expressCode);
            var order_up = mysql_db.query.sync(
                mysql_db,
                "UPDATE bbx_orders SET OrderProgressState = 4, OrderProgressInfo = '待签收', OrderTime = now() where Id = ? and OrderProgressState= 3",
                [orderId]
            );
            if(order_up.affectedRows) {
                request.post({
                    url: AppConfig.DB_CONFIG.REDIS_QUEUE_URL,
                    form:  {queueName: 'order:event', data: orderId + '::4'}
                },function (err, httpResponse, body) {
                    if(err) {
                        console.error(err);
                    }
                });
            }
            var expressId = common.no_uuid();

            if (ret_body[0].statusCode == 200) {
                if (ret_body[0].statusCode == 200) {
                    var ret_body = JSON.parse(ret_body[0].body);
                    if (ret_body.auto.length > 0) {
                        mysql_db.query.sync(
                            mysql_db,
                            'insert into bbx_express4orders (Id, OrderId, ExpressCode, ExpressName, CreateTime, ExpressAliasesName) value(?, ?, ?, ?, NOW(),?)',
                            [expressId, orderId, expressCode, expressName, ret_body.auto[0].comCode]
                        );
                    } else {
                        mysql_db.query.sync(
                            mysql_db,
                            'insert into bbx_express4orders (Id, OrderId, ExpressCode, ExpressName, CreateTime) value(?, ?, ?, ?, NOW())',
                            [expressId, orderId, expressCode, expressName]
                        );
                    }
                } else {
                    mysql_db.query.sync(
                        mysql_db,
                        'insert into bbx_express4orders (Id, OrderId, ExpressCode, ExpressName, CreateTime) value(?, ?, ?, ?, NOW())',
                        [expressId, orderId, expressCode, expressName]
                    );
                }
            }
            res.json({ code: 200, data: expressId });
        } catch (e) {
            console.error(e);
            res.json({code: 300, data: '操作失败'});
        }
    });
});


router.post('/delExpress', function (req, res) {
    var queryArgs = req.body;
    var expressId = queryArgs.expressId;
    Sync(function () {
        try {
            mysql_db.query.sync(
                mysql_db,
                'update bbx_goods4orders set ExpressId = null where ExpressId = ?',
                [expressId]
                );
            mysql_db.query.sync(
                mysql_db,
                'delete from bbx_express4orders where Id = ?',
                [expressId]
                );
            res.json({ code: 200, data: '操作成功' });
        } catch (e) {
            console.error(e);
            res.json({ code: 300, data: '操作失败' });
        }
    });
});
//商家销售订单发货对接表格导入
router.get('/setExpressInfo', function (req, res) {
    res.render('order/set_express_info', req.session.user);
});

// 导出订单
router.get('/exportorders', function (req, res) {
    if (req.cookies.user.Role == '管理员' || req.cookies.user.AccountName == 'test1') {
        app.controller('orderController').exportOrderDetailsAll(req, res);
    } else {
        app.controller('orderController').exportOrderDetailMerchant(req, res);
    }
});

/**
 * 发送缺货短信提醒
 */
router.post('/send_oos_msg', function (req, res) {
    Sync(function () {
        var orderId = req.body.orderId;
        var orderCode = req.body.orderCode;
        var mobile = req.body.mobile;
        var ret_body = request.sync(null, AppConfig.DB_CONFIG.mobileapiurl.replace('{0}', mobile).replace('{1}', urlencode('提醒您，您的订单' + orderCode + '部分商品缺货，请联系福克商城客服申请退款，给您造成的不便我们深表歉意~', 'gbk')));
        if (ret_body[0].statusCode == 200) {
            res.json({ code: 200, msg: '发送成功' })
        } else {
            res.json({ code: 300, msg: '发送失败' })
        }
    });
});
router.post('/getExpressInfo', function (req, res) {
    var expressId = req.body.expressId;
    Sync(function () {
        var express = mysql_db.query.sync(
            mysql_db,
            'select * from bbx_express4orders where Id = ?',
            [expressId]
            )[0];
        res.json({ code: 200, express: express });
    });
});

//获取修改订单状态为待配货状态的商品sku信息
router.post('/getChangeGoods', function (req, res) {
    orderController.getChangeGoods(req, res);
});

//修改商品sku信息
router.post('/changeGoods', function (req, res) {
    orderController.changeGoodsInfo(req, res);
});

router.post('/getMerchant', function (req, res) {
    orderController.getMerchant(req, res);
});

//订单管理页面
router.get('/orderDetail', function (req, res) {
    var data = {
        orderState: req.query.orderState,
        user: req.session.user
    };
    if (req.cookies.user.Role == '管理员') {
        res.render('order/orderDetail', data);
    } else {
        //404 报错才对
        res.render('order/order_list_d', data);
    }
});

router.post("/reBackGoods", function (req, res) {
    orderController.reBackGoods(req, res);
});

router.post("/reBackFee", function (req, res) {
    orderController.reBackFee(req, res);
});

router.post("/setRefundGoods", function (req, res) {
    orderController.setRefundGoods(req, res);
});

router.post("/setReFundGoodsBack", function (req, res) {
    orderController.setReFundGoodsBack(req, res);
});

//标记对账单(全部商家，当天，财务用)
router.post('/orderCheckAll', function (req, res) {
    orderController.orderCheckAll(req, res);
});

//导出发货对账单(全部商家，当天，财务用)
router.get('/outCheck09All', function (req, res) {
    orderController.outCheck09All(req, res);
});

//导出售后对账单(全部商家，当天，财务用)
router.get('/outCheck19All', function (req, res) {
    orderController.outCheck19All(req, res);
});

//导出售后对账单(全部商家，当天，财务用)
router.get('/outCheckPunish', function (req, res) {
    orderController.outCheckPunish(req, res);
});



//导出超时发货账单
router.get('/outTimeOut', function (req, res) {
    orderController.outTimeOutOrders(req, res);
});

//导出无物流单号的账单
router.get('/outNoExpress', function (req, res) {
    orderController.outNoExpressOrder(req, res);
});

module.exports = router;

