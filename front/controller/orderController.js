var Sync = require('sync');
var comFunc = require('../common').comFunc;
var AppConfig = require('../config');
var mysql_con = global.app.get('mysql_con');
var knex_con = global.app.get('knex_con');
var payFactory = require("../lib/payFactory").payFactory;
/*******************************用户订单操作 start*******************************************/

//创建催单
function creatReminderOrder(req, res) {
    var body = req.body;
    var loginId = body.loginId, orderCode = body.orderCode, reason = body.reason, remark = body.remark;
    if (!loginId || !orderCode) {
        return res.json({
            STATUSCODE: 300,
            MSG: "参数错误~"
        });
    }

    var selectReminderSql = "SELECT * FROM bbx_reminder WHERE OrderCode = ? AND MemberId = ? ";
    var selectOrderSql = "SELECT * FROM bbx_orders WHERE OrderCode = ? AND MemberId = ? ";
    var createReminderSql = "INSERT INTO bbx_reminder (Id,OrderCode,MemberId,ReminderReason,CreateTime,UpdateTime,ReminderRemark,MerchantId) VALUES (?,?,?,?,NOW(),NOW(),?,?)"
    Sync(function () {
        try {
            //先查询是否有催单记录
            var selectReminderRes = mysql_con.query.sync(mysql_con,selectReminderSql, [orderCode, loginId])[0];
            if (selectReminderRes.length > 0) {
                throw {
                    STATUSCODE: 300,
                    MSG: "您的催单已在处理中，请耐心等~"
                }
            }
            //再查询订单是否存在
            var selectOrderRes = mysql_con.query.sync(mysql_con,selectOrderSql, [orderCode, loginId])[0];
            if (selectOrderRes.length == 0) {
                throw {
                    STATUSCODE: 300,
                    MSG: "没有查到您的订单~"
                }
            }
            //创建新的催单
            var createReminderRes = mysql_con.query.sync(mysql_con,createReminderSql, [comFunc.no_uuid(), orderCode, loginId, reason, remark, selectOrderRes[0].MerchantId]);
            return res.json({
                STATUSCODE: 200,
                MSG: "成功~"
            })
        } catch (e) {
            console.log(e);
            return res.json({
                STATUSCODE: 300,
                MSG: e.MSG || "催单失败，请重试~"
            });
        }
    });
}

/**
 * 订单列表
 * @param req
 * @param res
 */
function orderList(req, res) {
    var body = req.body;
    var loginId = body.loginId,
        orderState = parseInt(body.orderState || 0),
        pageNum = body.pageNum || 1;

    Sync(function () {
        try {
            var sql = knex_con.distinct('Id').select('Id').from('bbx_view_order_with_goods_consignee_list_all')
                .where('MemberId', loginId);

            switch (orderState) {
                case 3:
                    sql.whereIn('OrderProgressState', [
                        AppConfig.OrderState.EXPRESSING,
                        AppConfig.OrderState.READYING,
                        AppConfig.OrderState.CHECKING
                    ]);
                    break;
                default:
                    if (orderState != 0) {
                        sql.where('OrderProgressState', orderState);
                    }
                    break;
            }
            sql = sql.limit(20).offset((pageNum - 1) * 20).toString();
            var orderIdList = mysql_con.query.sync(mysql_con, sql)[0];

            var orderIds = [];
            for (var idx in orderIdList) {
                if (orderIdList.hasOwnProperty(idx)) {
                    orderIds.push(orderIdList[idx]['Id']);
                }
            }

            sql = knex_con.select(
                'Id',
                'GoodsGroupId',
                'GoodsTitle',
                'GoodsSalePrice',
                'GoodsCostPrice',
                'GoodsFilterConfig',
                'GoodsNum',
                'GoodsImgPath',
                'OrderProgressState',
                'OrderProgressInfo',
                'OrderCode',
                'OrderTime',
                'OrderPayInfo',
                'GoodsTotalPrice',
                'OrderTotalPrice',
                'OrderTotalDiscount',
                'CreateTime',
                'Orderfrom',
                'Remarks')
                .from('bbx_view_order_with_goods_consignee_list_all')
                .whereIn('Id', orderIds)
                .orderBy('OrderTime', 'DESC')
                .toString();

            var orderGoodsList = mysql_con.query.sync(mysql_con, sql)[0];
            var OrderArr = {};
            for (var i in orderGoodsList) {
                if (orderGoodsList.hasOwnProperty(i)) {
                    var OrderId = orderGoodsList[i]['Id'];
                    if (OrderArr.hasOwnProperty(OrderId)) {
                        OrderArr[OrderId]['OrderGoodsNum'] += orderGoodsList[i]['GoodsNum'];
                        OrderArr[OrderId]['orderDetail'].push(orderGoodsList[i]);
                    } else {
                        OrderArr[OrderId] = {
                            'OrderId': orderGoodsList[i]['Id'],
                            'OrderProgressState': orderGoodsList[i]['OrderProgressState'],
                            'OrderProgressInfo': orderGoodsList[i]['OrderProgressInfo'],
                            'OrderCode': orderGoodsList[i]['OrderCode'],
                            'CreateTime': orderGoodsList[i]['CreateTime'],
                            'OrderTime': orderGoodsList[i]['OrderTime'],
                            'OrderPayInfo': orderGoodsList[i]['OrderPayInfo'],
                            'GoodsTotalPrice': orderGoodsList[i]['GoodsTotalPrice'],
                            'OrderTotalPrice': orderGoodsList[i]['OrderTotalPrice'],
                            'OrderTotalDiscount': orderGoodsList[i]['OrderTotalDiscount'],
                            'Orderfrom': orderGoodsList[i]['Orderfrom'],
                            'OrderTotalNum': 0,
                            'Remarks': orderGoodsList[i]['Remarks'],
                            'OrderGoodsNum': orderGoodsList[i]['GoodsNum'],
                            'orderDetail': []
                        };
                        
                        OrderArr[OrderId]['orderDetail'].push(orderGoodsList[i]);
                    }
                }
            }

            /******************** 20160311 add by yczhu start ************************/

            sql = knex_con.select(
                'OrderId',
                'ExpressName',
                'ExpressCode')
                .from('bbx_express4orders')
                .whereIn('OrderId', orderIds)
                .toString();

            var expressList = mysql_con.query.sync(mysql_con, sql)[0];
            console.log("*****************************************");
            console.log(expressList);
            for (var i in expressList) {
                if (expressList.hasOwnProperty(i)) {
                    var OrderId = expressList[i]['OrderId'];
                    if (OrderArr.hasOwnProperty(OrderId)) {
                        //默认一个单号只有一个包裹
                        OrderArr[OrderId].EXPRESSCODE = expressList[i]['ExpressCode'];
                        OrderArr[OrderId].EXPRESSNAME = expressList[i]['ExpressName'];
                    }
                }
            }

            console.log(OrderArr);

            /******************** 20160311 add by yczhu end ************************/

            res.json({STATUSCODE: 200, DATA: comFunc.upperCase(OrderArr)});
        } catch (e) {
            console.error(e);
            res.json({STATUSCODE: 300, MSG: '查询失败~'});
        }
    });
}

/**
 * 订单详情
 * @param req
 * @param res
 */
function orderDetail(req, res) {
    var body = req.body;
    var loginId = body.loginId,
        orderId = body.orderId;
    Sync(function () {
        try {
            var sql = knex_con.select(
                'Id',
                'GoodsGroupId',
                'ConsigneeAddress',
                'ConsigneeMobile',
                'ConsigneeName',
                'GoodsTitle',
                'GoodsSalePrice',
                'GoodsCostPrice',
                'GoodsFilterConfig',
                'GoodsNum',
                'GoodsImgPath',
                'OrderProgressState',
                'OrderProgressInfo',
                'OrderCode',
                'OrderTime',
                'OrderPayInfo',
                'GoodsTotalPrice',
                'OrderTotalPrice',
                'OrderTotalDiscount',
                'CreateTime',
                'Orderfrom',
                'Remarks')
                .from('bbx_view_order_with_goods_consignee_list_all')
                .where({
                    Id: orderId,
                    MemberId: loginId
                })
                .orderBy('OrderTime', 'DESC')
                .toString();

            var orderGoodsList = mysql_con.query.sync(mysql_con, sql)[0];
            var OrderArr = {};
            for (var i in orderGoodsList) {
                if (orderGoodsList.hasOwnProperty(i)) {
                    var orderIdTmp = orderGoodsList[i]['Id'];
                    if (OrderArr.hasOwnProperty(orderIdTmp)) {
                        OrderArr[orderIdTmp]['orderDetail'].push(orderGoodsList[i]);
                    } else {
                        OrderArr[orderIdTmp] = {
                            'OrderId': orderGoodsList[i]['Id'],
                            'OrderProgressState': orderGoodsList[i]['OrderProgressState'],
                            'OrderProgressInfo': orderGoodsList[i]['OrderProgressInfo'],
                            'OrderCode': orderGoodsList[i]['OrderCode'],
                            'CreateTime': orderGoodsList[i]['CreateTime'],
                            'OrderTime': orderGoodsList[i]['OrderTime'],
                            'OrderPayInfo': orderGoodsList[i]['OrderPayInfo'],
                            'GoodsTotalPrice': orderGoodsList[i]['GoodsTotalPrice'],
                            'OrderTotalPrice': orderGoodsList[i]['OrderTotalPrice'],
                            'OrderTotalDiscount': orderGoodsList[i]['OrderTotalDiscount'],
                            'Orderfrom': orderGoodsList[i]['Orderfrom'],
                            'OrderTotalNum': 0,
                            'Remarks': orderGoodsList[i]['Remarks'],
                            'orderDetail': []
                        };
                        OrderArr[orderIdTmp]['orderDetail'].push(orderGoodsList[i]);
                    }
                }
            }
            sql = knex_con.select('ExpressName', 'ExpressCode', 'ExpressAliasesName').from('bbx_express4orders').where('OrderId', orderId).toString();
            var expressList = mysql_con.query.sync(mysql_con, sql)[0];
            OrderArr[orderId]['express'] = expressList;
            res.json({STATUSCODE: 200, DATA: JSON.stringify(comFunc.upperCase(OrderArr[orderId]))});
        } catch (e) {
            console.error(e);
            res.json({STATUSCODE: 300, MSG: '查询失败~'});
        }
    });
}

/**
 * 确认收货
 * @param req
 * @param res
 */
function confirmOrder(req, res) {
    var body = req.body;
    var loginId = body.loginId,
        orderId = body.orderId;

    Sync(function () {
        var sql = knex_con('bbx_orders').update({
            OrderProgressState: AppConfig.OrderState.FINISH,
            OrderProgressInfo: '交易成功',
            OrderTime: new Date()
        }).where({
            Id: orderId,
            MemberId: loginId
        }).whereIn('OrderProgressState', [
            AppConfig.OrderState.CHECKING,
            AppConfig.OrderState.READYING,
            AppConfig.OrderState.EXPRESSING
        ]).toString();
        var excRet = mysql_con.query.sync(mysql_con, sql);

        if (excRet.affectedRows) {
            return res.json({STATUSCODE: 200, DATA: "确认成功"});
        }
        return res.json({STATUSCODE: 300, MSG: '确认失败，请查看订单状态~'});
    });
}

/**
 * 删除订单
 * @param req
 * @param res
 */
function deleteOrder(req, res) {
    var body = req.body;
    var loginId = body.loginId,
        orderId = body.orderId;

    Sync(function () {
        var sql = knex_con('bbx_orders')
            .update({IsDeleted: 1})
            .where({
                Id: orderId,
                MemberId: loginId
            }).toString();
        var excRet = mysql_con.query.sync(mysql_con, sql);
        if (excRet.affectedRows) {
            return res.json({STATUSCODE: 200, DATA: "删除成功"});
        }
        return res.json({STATUSCODE: 300, MSG: '删除失败~'});
    });
}

/**
 * 取消订单
 * @param req
 * @param res
 */
function cancelOrder(req, res) {
    var body = req.body;
    var loginId = body.loginId,
        orderId = body.orderId;
    Sync(function () {
        var result = _cancelOrder(orderId, loginId);
        if (result) {
            return res.json({STATUSCODE: 200, DATA: '取消成功'});
        } else {
            return res.json({STATUSCODE: 300, MSG: '取消失败'});
        }
    });
}

/**
 * 获取订单收货地址
 * @param req
 * @param res
 */
function orderConsignee(req, res) {
    var body = req.body;
    var orderId = body.orderId || '';
    Sync(function () {
        var sql = knex_con.select('*').from('bbx_consignee4orders').where('Id', orderId).toString();
        var consignee = mysql_con.query.sync(mysql_con, sql)[0];
        if (consignee.length > 0) {
            res.json({STATUSCODE: 200, DATA: JSON.stringify(comFunc.upperCase(consignee[0]))});
        } else {
            res.json({STATUSCODE: 300, MSG: '未查到此订单'});
        }
    });
}

/**
 * 获取订单物流信息
 * @param req
 * @param res
 */
function orderExpressInfo(req, res) {
    var body = req.body;
    var expressCode = body.expressCode || '',
        orderId = body.orderId || '';
    Sync(function () {
        var sql = knex_con.select().from('bbx_express4orders').where({
            OrderId: orderId,
            ExpressCode: expressCode
        }).toString();
        var expressInfo = mysql_con.query.sync(mysql_con, sql)[0];
        if (expressInfo.length > 0) {
            return res.json(comFunc.upperCase({STATUSCODE: 200, DATA: expressInfo[0]}));
        } else {
            return res.json({STATUSCODE: 300, MSG: '未查到此订单'});
        }
    });
}


/*******************************用户订单操作 end*******************************************/
/*******************************下单操作 start*******************************************/
/**
 * 计算商品总价值
 * @param goodsList
 * @returns {number}
 * @private
 */
function _getOrderTotalPrice(goodsList) {
    var amountCash = 0;
    var skuIds = [];
    for (var idx in goodsList) {
        if (goodsList.hasOwnProperty(idx)) {
            skuIds.push(goodsList[idx]['Id']);
        }
    }
    var reallyCanBuyGoods = _getGoodsBySkuIds(skuIds);
    for (var i in reallyCanBuyGoods) {
        if (reallyCanBuyGoods.hasOwnProperty(i)) {
            var needNum = getValueById(reallyCanBuyGoods[i]['Id'], goodsList);
            amountCash += reallyCanBuyGoods[i]['GoodsSalePrice'] * needNum;
        }
    }
    return amountCash;
}

/**
 * 提交订单
 * @param req
 * @param res
 */
function commitOrder(req, res) {
    var body = req.body;
    var loginId = body.loginId,
        consigneeId = body.consigneeId,
        couponId = body.couponId,
        payType = body.payType || '微信支付',
        orderFrom = body.orderFrom,
        goodsList = body.goodsList,
        remark = body.remark,
        agentId = body.agentId;
    console.log(body);
    goodsList = JSON.parse(goodsList);
    var amountCash = 0,
        discountCash = 0,
        couponCash = 0,
        consigneeInfo = null,
        orderImgPath = null;
    Sync(function () {
        try {
            mysql_con.beginTransaction.sync(mysql_con);
            var orderId = comFunc.no_uuid(),
                orderCode = comFunc.dateFormat(new Date(), "yyyyMMddhhmmss") + comFunc.randomNum(4);

            // 0. 获取收货地址
            consigneeInfo = _getUserConsignee(loginId, consigneeId);

            // 1. 验证用户
            _checkUserState(loginId);
            console.log('----验证用户 end');
            // 2. 验证库存和限购
            var reallyBuyGoods = _checkInventoryForOrder(loginId, goodsList);
            console.log('----验证库存和限购 end');
            // 3. 写入订单详情
            var ret = _setGoodsForOrder(orderId, reallyBuyGoods);
            amountCash = ret.amountCash;
            orderImgPath = ret.orderImgPath;
            console.log('----写入订单详情 end');
           
            // 6. 写入收货信息
            _setConsigneeForOrder(orderId, consigneeInfo);

            console.log('----写入收货信息 end');

            // 7. 创建订单和交易记录
            var orderRecord = {
                Id: orderId,
                MemberId: loginId,
                OrderProgressState: AppConfig.OrderState.WAITING,
                OrderProgressInfo: '待付款',
                OrderPayInfo: payType,
                OrderCode: orderCode,
                GoodsFreight: 0,
                PaidCode: orderCode,
                CreateTime: new Date(),
                OrderTime: new Date(),
                OrderFrom: orderFrom,
                Remarks: remark,
                AgentId: agentId,
                GoodsTotalPrice: amountCash,
                OrderTotalPrice: amountCash - couponCash - discountCash,
                OrderTotalDiscount: discountCash,
                OrderImage: orderImgPath
            };
            _setOrder(orderRecord);
            mysql_con.commit.sync(mysql_con);
            console.log('----创建订单和交易记录 end');
            // 执行支付
            _goPay(orderRecord, res);
        } catch (e) {
            console.error(e);
            mysql_con.rollback.sync(mysql_con);
            res.redirect('http://m.bbxvip.com/weixin/index.html#!/page/index.html?msg=' + e.msg);
        }
    });


}

/*******************************下单操作 end*******************************************/
/*******************************支付操作 start*******************************************/
/**
 * 网页端 去支付
 * @param req
 * @param res
 */
function h5GoPay(req, res) {
    var orderId = req.body.orderId;
    if (!orderId) {
        return res.json({STATUSCODE: 300, MSG: '参数错误'});
    }

    Sync(function () {
        var sql = knex_con.select().from('bbx_tradeorder').where('Id', orderId).toString();
        var order = mysql_con.query.sync(mysql_con, sql)[0];
        if (order.length > 0) {
            order = order[0];
            if (order['OrderProgressState'] === AppConfig.OrderState.WAITING) {
                _goPay(order, res);
            } else {
                return res.redirect('http://m.bbxvip.com/weixin/index.html#!/page/index.html?msg=该订单不可支付~');
            }
        } else {
            return res.redirect('http://m.bbxvip.com/weixin/index.html#!/page/index.html?msg=无此订单~');
        }
    });
}

/**
 * App端 去支付
 * @param req
 * @param res
 */
function appGoPay(req, res) {
    var orderId = req.body.orderId;
    if (!orderId) {
        return res.json({STATUSCODE: 300, MSG: '参数错误'});
    }

    Sync(function () {
        var sql = knex_con.select().from('bbx_tradeorder').where('Id', orderId).toString();
        var order = mysql_con.query.sync(mysql_con, sql)[0];
        if (order.length > 0) {
            order = order[0];
            if (order['OrderProgressState'] === AppConfig.OrderState.WAITING) {
                _goPay(order, res);
            } else {
                return res.json({STATUSCODE: 300, MSG: '该订单不可支付~'});
            }
        } else {
            return res.json({STATUSCODE: 300, MSG: '无此订单~'});
        }
    });
}

/**
 * 去支付统一接口
 * @param order
 * @param res
 * @private
 */
function _goPay(order, res) {
    console.log(order);
    var orderParam = {
        out_trade_no: order['OrderCode'],
        subject: '百宝香流水号--' + order['OrderCode'],
        total_fee: order['OrderTotalPrice']
    };

    if (order['OrderFrom'] === 'web' && order['OrderPayInfo'] === '微信支付') {
        console.log('微信支付（web）：' + orderParam);
        payFactory.receiveMoney(orderParam, 'wc', res);
    } else if (order['OrderFrom'] === 'web' && order['OrderPayInfo'] === '支付宝支付') {
        console.log('调起支付宝（web）：' + orderParam);
        payFactory.receiveMoney(orderParam, 'ali', res);
    } else if (order['OrderFrom'] === 'app') {
        console.log('支付（app）：' + orderParam);
        // TODO: 返回app端支付需要的参数
    } else {
        // pc网页端支付
        console.log('pc网页端支付（ali）：' + orderParam);
        payFactory.receiveMoney(orderParam, 'ali', res, 'pc');
    }
}

/*******************************支付操作 end*******************************************/

/*******************************私有方法********************************************/

/**
 * 订单支付成功后回调
 * @param orderCode
 * @returns {boolean}
 * @private
 */
function _orderPayCallback(orderCode) {
    try {
        var sql = knex_con('bbx_orders').update({
            OrderProgressState: AppConfig.OrderState.CHECKING,
            OrderProgressInfo: '已付款',
            OrderTime: new Date()
        }).where({
            OrderProgressState: AppConfig.OrderState.WAITING,
            OrderCode: orderCode
        }).toString();

        var excRet = mysql_con.query.sync(mysql_con, sql);
        if (excRet.affectedRows) {
            return true;
        } else {
            throw {};
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 * 设置订单和流水号
 * @param order
 * @returns {boolean}
 * @private
 */
function _setOrder(order) {
    var sql = knex_con.insert(order).into('bbx_orders').toString();
    mysql_con.query.sync(mysql_con, sql);
    return true;
}

/**
 * 检查用户状态，正常或禁用
 * @param loginId
 * @returns {boolean}
 * @private
 */
function _checkUserState(loginId) {
    var sql = knex_con.select('MemberState').from('bbx_member').where('Id', loginId).toString();
    var queryRes = mysql_con.query.sync(mysql_con, sql)[0];
    if (queryRes[0].MemberState === 1) {
        return true;
    } else {
        return false;
    }
}

/**
 * 获取用户收货地址
 * @param loginId
 * @param consigneeId
 * @returns {string}
 * @private
 */
function _getUserConsignee(loginId, consigneeId) {
    var query_doc = {
        Id: consigneeId,
        MemberId: loginId
    };
    var sql = knex_con.select('*').from('bbx_consignee').where(query_doc).toString();
    var queryRes = mysql_con.query.sync(mysql_con, sql)[0];
    return queryRes[0];
}

/**
 * 为订单验证库存
 * @param loginId
 * @param goodsList
 * @returns {Array}
 * @private
 */
function _checkInventoryForOrder(loginId, goodsList) {
    var reallyBuyGoods = [];
    for (var idx in goodsList) {
        if (goodsList.hasOwnProperty(idx)) {
            var skuId = goodsList[idx]['Id'];
            var needNum = goodsList[idx]['goodsNum'] || 1;
            console.log(skuId, needNum);
            // 1. 查看限购和库存
            var sql = knex_con.select('LimitCount', 'MaxCount', 'GoodsTitle').from('bbx_view_goods_list').where('Id', skuId).toString();
            var actionGoods = mysql_con.query.sync(mysql_con, sql)[0];
            console.log(actionGoods);
            if (actionGoods.length === 0) {
                continue;
            }
            actionGoods = actionGoods[0];
            console.log(actionGoods);
            var limitCount = actionGoods['LimitCount'];
            var maxCount = actionGoods['MaxCount'];

            // 2. 查询用户已经购买该sku的数量（去除已完结和已退款）
            sql = knex_con.from('bbx_goods4orders')
                .select(knex_con.raw('IFNULL(SUM(bbx_goods4orders.GoodsNum),0) AS GoodsNum'))
                .innerJoin('bbx_orders', 'bbx_goods4orders.OrderId', 'bbx_orders.Id')
                .where('bbx_orders.MemberId', loginId)
                .where('bbx_goods4orders.GoodsId', skuId)
                .whereNotIn('bbx_orders.OrderProgressState', [AppConfig.OrderState.REFUNDED, AppConfig.OrderState.CANCEL])
                .toString();
            var hasTotalNum = mysql_con.query.sync(mysql_con, sql)[0][0]['GoodsNum'];
            var needTotalNum = needNum + hasTotalNum;
            if (limitCount === 0 || limitCount >= needTotalNum) {
                if (maxCount >= needNum) {
                    // 3. 执行减库存原子操作
                    sql = knex_con.raw('UPDATE bbx_goods SET MaxCount = (MaxCount - ?) WHERE Id = ? and (MaxCount - ?)>=0', [needNum, skuId, needNum]).toString();
                    var excRet = mysql_con.query.sync(mysql_con, sql);
                    if (excRet.affectedRows) {
                        reallyBuyGoods.push(goodsList[idx]);
                    }
                } else {
                    throw {msg: actionGoods['GoodsTitle'] + '超出限购数量，不能购买~'};
                }
            }
        }
    }
    return reallyBuyGoods;
}

/**
 * 为订单设置收货地址记录
 * @param orderId
 * @param consigneeInfo
 * @returns {boolean}
 * @private
 */
function _setConsigneeForOrder(orderId, consigneeInfo) {
    var consigneeObj = {
        Id: orderId,
        ConsigneeName: consigneeInfo['ConsigneeName'],
        CreateTime: new Date(),
        ConsigneeMobile: consigneeInfo['ConsigneeMobile'],
        ExpressTimeType: consigneeInfo['ExpressTimeType'],
        Province: consigneeInfo['Province'],
        City: consigneeInfo['City'],
        County: consigneeInfo['County'],
        Address: consigneeInfo['Address']
    };
    var sql = knex_con.insert(consigneeObj).into('bbx_consignee4orders').toString();
    var excRet = mysql_con.query.sync(mysql_con, sql);
    return true;
}

/**
 * 为订单设置商品详情列表
 * @param orderId
 * @param goodsList
 * @private
 */
function _setGoodsForOrder(orderId, goodsList) {
    var amountCash = 0, orderImgPath = '';
    var skuIds = [];
    for (var idx in goodsList) {
        if (goodsList.hasOwnProperty(idx)) {
            skuIds.push(goodsList[idx]['Id']);
        }
    }
    var reallyCanBuyGoods = _getGoodsBySkuIds(skuIds);
    if (goodsList.length === 0) {
        throw {msg: "商品已下架或未上架,无法为您生成订单~"};
    }

    var goods4OrderJsonjArr = [];
    for (var i in reallyCanBuyGoods) {
        if (reallyCanBuyGoods.hasOwnProperty(i)) {
            var needNum = getValueById(reallyCanBuyGoods[i]['Id'], goodsList);
            goods4OrderJsonjArr.push({
                Id: comFunc.no_uuid(),
                GoodsId: reallyCanBuyGoods[i]['Id'],
                GoodsGroupId: reallyCanBuyGoods[i]['GoodsGroupId'],
                GoodsTitle: reallyCanBuyGoods[i]['GoodsTitle'],
                GoodsSubtitle: reallyCanBuyGoods[i]['GoodsSubtitle'],
                GoodsImgPath: reallyCanBuyGoods[i]['GoodsImgPath'],
                GoodsSalePrice: reallyCanBuyGoods[i]['GoodsSalePrice'],
                GoodsCostPrice: reallyCanBuyGoods[i]['GoodsPrice'],
                GoodsNum: needNum,
                GoodsNumber: reallyCanBuyGoods[i]['GoodsNumber'],
                Outeriid: reallyCanBuyGoods[i]['Outeriid'],
                Skuid: reallyCanBuyGoods[i]['Skuid'],
                CreateTime: new Date(),
                OrderId: orderId,
                GoodsFilterConfig: reallyCanBuyGoods[i]['FilterConfig']
            });

            // 计算商品总价值
            amountCash += reallyCanBuyGoods[i]['GoodsSalePrice'] * needNum;

            // TODO: 调用删除购车单个sku方法  _deleteCartGoods
        }
    }
    var sql = knex_con.insert(goods4OrderJsonjArr).into('bbx_goods4orders').toString();
    mysql_con.query.sync(mysql_con, sql);
    orderImgPath = reallyCanBuyGoods[0]['GoodsImgPath'];
    return {
        orderImgPath: orderImgPath,
        amountCash: amountCash
    };
}

/**
 * 根据skuid找到获取可售商品
 * @param SkuIds
 * @returns {Array}
 * @private
 */
function _getGoodsBySkuIds(SkuIds) {
    var sql = knex_con.select().from('bbx_view_goods_list')
        .whereIn('Id', SkuIds)
        .where('GoodsSaleState', AppConfig.ActionGoodsSaleState.ONLINE)
        .whereRaw('GoodsSalePrice > ?', [0])
        .toString();
    var goodsList = mysql_con.query.sync(mysql_con, sql)[0];
    return goodsList;
}

/**
 * 取消订单
 * @param orderId
 * @param loginId
 * @returns {boolean}
 * @private
 */
function _cancelOrder(orderId, loginId) {

    // 1. 将订单设置为 取消状态
    var sql = knex_con('bbx_orders').update({
        OrderProgressState: AppConfig.OrderState.CANCEL,
        OrderProgressInfo: '订单已取消',
        OrderTime: new Date()
    }).where({
        OrderProgressState: AppConfig.OrderState.WAITING,
        Id: orderId,
        MemberId: loginId
    }).toString();

    var excRet = mysql_con.query.sync(mysql_con, sql);
    if (excRet.affectedRows) {
        // 3. 库存 返还
        _resetStock(orderId);
        return true;
    }
    return false;
}


/**
 * 返还库存
 * @param orderId
 */
function _resetStock(orderId) {
    mysql_con.query('select * from bbx_goods4orders where OrderId = ?', [orderId], function (err, result) {
        result.forEach(function (item, idx) {
            mysql_con.query('update bbx_goods set MaxCount=MaxCount + ? where Id = ?', [item.GoodsNum, item.GoodsId], function () {
            })
        });
    });
}


/**
 * 购物商品数据获取num
 * @param skuId
 * @param goodList
 * @returns {*}
 */
function getValueById(skuId, goodList) {
    var goodsNum = 1;
    for (var idx in goodList) {
        if (goodList[idx]['Id'] === skuId) {
            goodsNum = goodList[idx]['goodsNum'] || 1;
            break;
        }
    }
    return goodsNum;
}
exports.creatReminderOrder = creatReminderOrder;
exports.commitOrder = commitOrder;
exports.confirmOrder = confirmOrder;
exports.deleteOrder = deleteOrder;
exports.orderList = orderList;
exports.orderDetail = orderDetail;
exports.cancelOrder = cancelOrder;
exports.orderConsignee = orderConsignee;
exports.orderExpressInfo = orderExpressInfo;
exports.h5GoPay = h5GoPay;
exports.appGoPay = appGoPay;
exports._orderPayCallback = _orderPayCallback;