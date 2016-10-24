/**
 * 订单相关
 * Created by zlongxiao@126.com on 2015/10/29.
 */
var Sync = require('sync');
var utils = require('../utils');
var _uuid = require('../routes/common').no_uuid;
var dateFormat = require('../routes/common').dateFormat;
var randomNum = require('../routes/common').randomNum;
var nodeExcel = require('excel-export')
var uuid = require('node-uuid');
var mysql_db = app.get('MysqlConn');
var AppConfig = require('../config');
var taffy = require('../lib/taffy-min');
var request = require('request');
var Excel = require('exceljs');
var DateFormater = require('../public/javascripts/utils/dateFormater');

/**
 * 获取修改订单状态为待配货状态的商品sku信息
 * @param req
 * @param res
 */
function getChangeGoods(req, res) {
    Sync(function () {
        try {
            var orderCode = req.body.orderCode;
            var sku_id = req.body.sku_id;
            var sql = 'SELECT GoodsGroupId,a.Id as orderId,GoodsActionId as goodsId FROM bbx_view_order_with_goods_consignee_list_all AS a LEFT JOIN bbx_view_goods_with_action_list ' +
                ' AS b ON a.ActionId = b.ActionId AND a.GoodsActionId = b.Id WHERE ( a.OrderCode = ? AND a.Skuid = ? );';
            var result = mysql_db.query.sync(mysql_db, sql, [orderCode, sku_id])[0][0];

            var sql2 = 'SELECT * from bbx_view_goods_with_action_list WHERE GoodsGroupId=?';
            var result_group = mysql_db.query.sync(mysql_db, sql2, result.GoodsGroupId);

            var last_result = {goods: result_group[0], order: result};
            res.json({code: 200, msg: last_result});
        } catch (e) {

            res.json({code: 300, msg: "error"});
        }
    });
}

/**
 * 修改订单信息
 * @param req
 * @param res
 */
function changeGoodsInfo(req, res) {
    Sync(function () {
        try {
            var goodsId = req.body.goodsId;
            var orderId = req.body.orderId;
            var oldGoodsId = req.body.oldGoodsId;
            var goodsConfig = req.body.goodsConfig;
            var goodsTitle = req.body.goodsTitle;
            var sku_id = req.body.sku_id;
            var sql = 'UPDATE bbx_goods4orders set GoodsId=? ,GoodsFilterConfig=?,Skuid=?,GoodsTitle=? WHERE GoodsId=? and OrderId=?';
            var result = mysql_db.query.sync(mysql_db, sql, [goodsId, goodsConfig, sku_id, goodsTitle, oldGoodsId, orderId]);

            res.json({code: 200, msg: 'success'});
        } catch (e) {
            res.json({code: 300, msg: "fail"});
        }
    })
}

//根据orderCode改编order状态
function changeStatusByCode(req,res){
    Sync(function(){
        // 状态：1（待付款），可改为99（取消交易）（建议不处理）
        // 状态：2（待配货），可改为3（待发货）,5（待退款）
        // 状态：3（待发货），可改为4（待签收），5（待退款）
        // 状态：4（待签收），可改为9（交易成功），5（待退款）
        // 状态：5（待退款），可改为19（已退款），2（待配货）
        var queryArgs = req.body;
        var orderCode = queryArgs.orderCode;
        var status = parseInt(queryArgs.status);

        try{
            var order_result = mysql_db.query.sync(
                mysql_db,
                "select OrderProgressState from bbx_orders where OrderCode =" + orderCode
            )[0];

            if (order_result && order_result.length > 0) {
                var orderProgressState = order_result[0].OrderProgressState;
                if (orderProgressState == 1 || orderProgressState == 9 || orderProgressState == 19 || orderProgressState == 99) {
                    // 如果订单状态为待付款、已完成、已退款、取消交易，则不能再修改状态
                } else if (orderProgressState == 5 && (status == 19 || status == 2)) {
                    // 如果订单状态为待退款，则只能做确认退款和取消退款操作
                    var sql2 = "update bbx_orders set OrderProgressState = " + status + ", OrderProgressInfo = '" + AppConfig.ORDER_STATE[status] + "',OrderTime = '" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + "' where OrderCode =" + orderCode ;
                    mysql_db.query.sync(mysql_db,sql2);
                    //request.post({
                    //    url:AppConfig.DB_CONFIG.REDIS_API,
                    //    body:"LPUSH/order:event/"+orderCode+"::"+status
                    //    },function(err,httpResponse,body){});
                    request.post({
                        url: AppConfig.DB_CONFIG.REDIS_QUEUE_URL,
                        form:  {queueName: 'order:event', data: orderCode + '::' + status}
                    },function (err, httpResponse, body) {
                        if(err) {
                            console.error(err);
                        }
                    });


                } else if (status > orderProgressState) {
                    // 剩下的只要修改的状态大于已有的状态码就能修改
                    var sql3 = "update bbx_orders set OrderProgressState = " + status + ", OrderProgressInfo = '" + AppConfig.ORDER_STATE[status] + "', OrderTime = '" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + "' where OrderCode =" + orderCode;
                    mysql_db.query.sync(mysql_db,sql3);
                    //request.post({
                    //    url:AppConfig.DB_CONFIG.REDIS_API,
                    //    body:"LPUSH/order:event/"+orderCode+"::"+status
                    //    },function(err,httpResponse,body){});

                    request.post({
                        url: AppConfig.DB_CONFIG.REDIS_QUEUE_URL,
                        form:  {queueName: 'order:event', data: orderCode + '::' + status}
                    },function (err, httpResponse, body) {
                        if(err) {
                            console.error(err);
                        }
                    });
                }
            }

            res.json({code:200,data:"ok"});
        }catch(e){
            res.json({code:300});
        }
    });
}

/************************ yczhu ADD **************************************/
function setRefundGoods(req,res){
    var list = req.body.list;
    var orderCode = req.body.orderCode;
    var role = req.cookies.user.Id;
    var descStr = req.body.descStr;
    var merchantId = 0;
    var allGoods = 0;
    var orderTotalPrice = 0;
    var goodsTotalPrice = 0;
    var refundId = _uuid();

    Sync(function(){
        try{
            mysql_db.beginTransaction.sync(mysql_db);

            //把订单之前的售后单全部改为不显示,以缺货单为主
            mysql_db.query.sync(
                mysql_db,
                'UPDATE bbx_refund SET MainShow = 0 WHERE OrderCode = ? ',[orderCode]
            );

            //创建退货信息 bbx_refund4orders
            for(var i= 0,len = list.length; i <len;i++){

                // 1) 查询订单的sku的信息
                var orderInfo =  mysql_db.query.sync(
                    mysql_db,
                    'SELECT * FROM bbx_view_order_with_goods_consignee_list_all WHERE OrderCode = ? and GoodsActionId = ?',
                    [orderCode,list[i].goodsId]
                )[0];

                var goodsSalePrice = 0;
                var GoodsSupplyPrice = 0;
                if(orderInfo.length > 0) {
                    goodsSalePrice = orderInfo[0]['GoodsSalePrice'];
                    GoodsSupplyPrice = orderInfo[0]['GoodsSupplyPrice'];
                    merchantId = orderInfo[0]['MerchantId'];
                    allGoods += list[i].goodsNum * goodsSalePrice; //计算退款，创建冲账单

                    orderTotalPrice = orderInfo[0]['OrderTotalPrice'];
                    goodsTotalPrice = orderInfo[0]['GoodsTotalPrice'];
                }

                //创建退货明细
                code = dateFormat(new Date(), "yyyyMMddhhmmss") + randomNum(4) ;
                mysql_db.query.sync(
                    mysql_db,
                    "INSERT INTO bbx_refund4orders (Id,RefundCode,OrderCode,GoodsId,GoodsNum,CreateTime,UpdateTime,HasRefund,GoodsSalePrice,GoodsSupplyPrice) VALUES (?,?,?,?,?,now(),now(),?,?,?)",
                    [_uuid(),code,orderCode,list[i].goodsId,list[i].goodsNum,0,goodsSalePrice,GoodsSupplyPrice]);
            }

            //创建售后单bbx_refund
            var code = dateFormat(new Date(), "yyyyMMddhhmmss") + randomNum(4) ;
            var sql2 = "INSERT INTO bbx_refund (Id,RefundCode,OrderCode,MemberId,RefundType,RefundReason,RefundDesc,RefundProgressState," +
                "RefundProgressInfo,MerchantId,MerchantRefundAddress,CreateTime,UpdateTime,NeedBackGoods,GoodsState,UserUploadImg,ExpressImg,MainShow,MerchantGotBackGoods) " +
                "VALUES (?,?,?,?,?,?,?,?,?,?,?,now(),now(),?,?,?,?,?,?)";

            //缺货退款不需要用户信息和卖家地址
            mysql_db.query.sync(
                mysql_db,
                sql2,
                [refundId,code,orderCode,"",2,"缺货退款",descStr,2,"卖家同意退款",merchantId,"",0,0,null,null,1,1]);

            //计算退款，创建冲账单
            var reBack = (allGoods/goodsTotalPrice * orderTotalPrice).toFixed(2);
            //缺货的退款账
            mysql_db.query.sync(
                mysql_db,
                "INSERT INTO bbx_balance4orders (RefundId,OrderCode,DeductGoodsPrice,DeductExpressFee,ExpressCompany,ExpressCode,MerchantId,AlipayAccount,AlipayAuthName) VALUES (?,?,?,?,?,?,?,?,?)",
                [refundId,orderCode,reBack,0,null,null,merchantId,null,null]
            );

            //操作记录
            var sqlAdd = "INSERT INTO bbx_refundlog (Id,RefundId,CurProgressState,PreProgressState,CreateTime,OprateRole,RecordText) VALUES (?,?,?,?,NOW(),?,?)";
            mysql_db.query.sync(
                mysql_db,
                sqlAdd,
                [_uuid(), refundId, 2, 2, role, "创建缺货退款申请"]
            )[0];

            //将订单改为已完结，防止重复发货
            var sqlChangeOrder = "UPDATE bbx_orders SET OrderProgressState = 9 ,OrderProgressInfo = '交易关闭',orderTime = NOW() WHERE orderCode = ?";
            mysql_db.query.sync(mysql_db, sqlChangeOrder, [orderCode])[0];

            mysql_db.commit.sync(mysql_db);

            res.json({code:200});
        }catch(e){

            console.log(e);
            //事务回滚
            mysql_db.rollback.sync(mysql_db);

            res.json({code:300});
        }
    });
}

function setReFundGoodsBack(req,res){
    var orderCode = req.body.orderCode;
    var date = dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
    Sync(function(){
        try{
            var sql = "UPDATE bbx_refund4orders SET HasRefund = 1 ,UpdateTime = ? WHERE OrderCode = ?" ;
            mysql_db.query.sync(mysql_db,sql,[date,orderCode]);
            res.json({code:200});
        }catch(e){
            res.json({code:300});
        }
    })
}

function outTimeOutOrders(req,res){
    var sTime = req.query.sTime;
    var eTime = req.query.eTime;

    Sync(function(){
        try{
            var sql = "SELECT ot.A , timestampdiff(HOUR,ot.B,ot.C) AS DiffDate,bg4o.goodsTitle,ba.AccountName,ot.F ,ot.B,ot.C FROM (  " +
            "SELECT bbo.OrderCode AS A ,bto.OrderTime AS B,be4o.CreateTime AS C , bbo.Id AS D ,bbo.MerchantId AS E,bbo.CreateTime AS F FROM bbx_orders bbo " +
            "LEFT JOIN bbx_tradeorder bto ON bbo.PaidCode = bto.OrderCode " +
            "LEFT JOIN bbx_express4orders be4o ON bbo.Id = be4o.OrderId " +
            "WHERE bbo.CreateTime BETWEEN DATE(?) AND DATE(?) " +
            "AND be4o.CreateTime IS NOT NULL ) ot " +
            "LEFT JOIN bbx_goods4orders bg4o ON bg4o.orderId = ot.D " +
            "left JOIN bbx_account ba ON ba.Id = ot.E " +
            "HAVING DiffDate > 48 ";
            var result = mysql_db.query.sync(mysql_db, sql,[sTime,eTime])[0];
            var conf = {};
            conf.stylesXmlFile = "styles.xml";
            conf.cols = [
                {
                    caption: '销售订单号',
                    type: 'string',
                    width: 20
                },
                {
                    caption: '超时时间',
                    type: 'number'
                },
                {
                    caption: '商品标题',
                    type: 'String',
                    width: 40
                },
                {
                    caption: '商家账号',
                    type: 'string',
                    width: 15
                },
                {
                    caption: '订单创建时间',
                    type: 'string',
                    width: 30
                },
                {
                    caption: '订单付款时间',
                    type: 'string',
                    width: 30
                },
                {
                    caption: '物流单号导入时间',
                    type: 'string',
                    width: 30
                }
            ];

            var m_data = [];
            var _length = result.length;

            for (var i = 0; i < _length; i++) {
                var arry = [
                    result[i]['A'],
                    result[i]['DiffDate'],
                    result[i]['goodsTitle'],
                    result[i]['AccountName'],
                    dateFormat(result[i]['F'], "yyyy-MM-dd hh:mm:ss"),
                    dateFormat(result[i]['B'], "yyyy-MM-dd hh:mm:ss"),
                    dateFormat(result[i]['C'], "yyyy-MM-dd hh:mm:ss")
                ];
                m_data.push(arry);
            }
            conf.rows = m_data;
            var resultxls = nodeExcel.execute(conf);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader("Content-Disposition", "attachment; filename=" + encodeURIComponent(dateFormat(new Date(), "yyyy-MM-dd") + "超时发货清单.xlsx"));
            res.end(resultxls, 'binary');
        }catch(e){
            console.error(e);
            res.json({code: 300, msg: "fail"});
        }
    });
}

function outNoExpressOrder (req,res){
    var sTime = req.query.sTime;
    var eTime = req.query.eTime;
    Sync(function(){
        try{
            var sql = "SELECT ot.A , bg4o.goodsTitle,ba.AccountName,ot.F,ot.B FROM ( " +
            "SELECT bbo.OrderCode AS A ,bto.OrderTime AS B, bbo.Id AS D ,bbo.MerchantId AS E,bbo.CreateTime AS F FROM bbx_orders bbo " +
            "LEFT JOIN bbx_tradeorder bto ON bbo.PaidCode = bto.OrderCode " +
            "LEFT JOIN bbx_express4orders be4o ON bbo.Id = be4o.OrderId " +
            "WHERE bbo.CreateTime BETWEEN DATE(?) AND DATE(?) " +
            "AND ISNULL(be4o.CreateTime) )ot " +
            "LEFT JOIN bbx_goods4orders bg4o ON bg4o.orderId = ot.D " +
            "left JOIN bbx_account ba ON ba.Id = ot.E";

            var result = mysql_db.query.sync(mysql_db, sql,[sTime,eTime])[0];

            var conf = {};
            conf.stylesXmlFile = "styles.xml";
            conf.cols = [
                {
                    caption: '销售订单号',
                    type: 'string',
                    width: 20
                },
                {
                    caption: '商品标题',
                    type: 'String',
                    width: 40
                },
                {
                    caption: '商家账号',
                    type: 'string',
                    width: 15
                },
                {
                    caption: '订单创建时间',
                    type: 'string',
                    width: 30
                },
                {
                    caption: '订单付款时间',
                    type: 'string',
                    width: 30
                }
            ];

            var m_data = [];
            var _length = result.length;

            for (var i = 0; i < _length; i++) {
                var arry = [
                    result[i]['A'],
                    result[i]['goodsTitle'],
                    result[i]['AccountName'],
                    dateFormat(result[i]['F'], "yyyy-MM-dd hh:mm:ss"),
                    dateFormat(result[i]['B'], "yyyy-MM-dd hh:mm:ss")
                ];
                m_data.push(arry);
            }
            conf.rows = m_data;
            var resultxls = nodeExcel.execute(conf);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader("Content-Disposition", "attachment; filename=" + encodeURIComponent(dateFormat(new Date(), "yyyy-MM-dd") + "无物流单号清单.xlsx"));
            res.end(resultxls, 'binary');
        }catch(e){
            res.json({code: 300, msg: "fail"});
        }
    });
}

//标记对账单
//加事务
function orderCheckAll(req,res){
    Sync(function(){
        try{
            console.log("------------");
            var cTime = req.body.cTime;
            console.log(cTime);

            //开始事务
            mysql_db.beginTransaction.sync(mysql_db);

            //标记order表中9的订单
            var checkOrderSql = "UPDATE bbx_orders SET HasChecked = NOW() " +
                "WHERE Id in ( SELECT Id FROM ( SELECT Id FROM bbx_orders " +
                "WHERE DATE(CreateTime) >= '2015-11-15' AND DATE(CreateTime) <= ? " +
                "AND HasChecked IS NULL AND OrderProgressState = 9) a )";
            var resultOrder = mysql_db.query.sync(mysql_db, checkOrderSql,[cTime]);

            console.log(resultOrder);

            //标记balance表
            var checkBalanceSql = "UPDATE bbx_balance4orders SET CheckTime = NOW() " +
                "WHERE RefundId IN ( SELECT RefundId FROM ( " +
                "SELECT RefundId FROM bbx_view_refund_with_balance rwb " +
                "LEFT JOIN bbx_orders bbo ON rwb.OrderCode = bbo.OrderCode " +
                "WHERE ISNULL(checkTime) " +
                "AND RefundProgressState = 3 " +
                "AND DATE(bbo.CreateTime) >= '2015-11-15' " +
                "AND DATE(bbo.CreateTime) <= ? ) a )";

            var resultBalance = mysql_db.query.sync(mysql_db, checkBalanceSql,[cTime]);
            console.log(resultBalance);

            //标记处罚表
            var checkPunishSql = "UPDATE bbx_merchant4punishment SET CheckTime = NOW()  " +
                "WHERE Id IN ( SELECT Id FROM ( " +
                "SELECT Id FROM bbx_merchant4punishment " +
                "WHERE ISNULL(CheckTime) AND DATE(PunishTime) <= ? ) a )" ;

            var resultPunish = mysql_db.query.sync(mysql_db, checkPunishSql,[cTime]);
            console.log(resultPunish);

            mysql_db.commit.sync(mysql_db);
        }
        catch(e){
            console.log(e);
            //事务回滚
            mysql_db.rollback.sync(mysql_db);
            res.json({code:300});
        }

        if(resultPunish && resultBalance && resultOrder){
            //var result2 = _doCheckBill(cTime);
            res.json({code:200});
        }
    });
}

//导出所有商家，交易完成的订单

function outCheck09All(req,res){
    Sync(function(){
        try{
            var cTime = req.query.cTime;

            //导出成功交易的订单

            var selectSql = "SELECT a.OrderCode,c.AccountName,a.OrderProgressInfo,b.GoodsTitle,b.GoodsNum,b.GoodsSupplyPrice FROM (  " +
                "SELECT Id,OrderCode,OrderProgressInfo,MerchantId FROM bbx_orders WHERE Date(HasChecked) = ? " +
                " ) a LEFT JOIN bbx_goods4orders b ON b.OrderId = a.Id " +
                "LEFT JOIN bbx_account c ON a.MerchantId = c.Id ORDER BY c.AccountName";

            //var selectSql = "SELECT bba.AccountName,bbo.OrderCode,bbe4o.ExpressName,bbe4o.ExpressCode,bbo.createTime,bbo.OrderProgressInfo,bbo.GoodsTotalPrice FROM " +
            //    "(SELECT Id,OrderCode,createTime,GoodsTotalPrice,MerchantId,OrderProgressInfo FROM bbx_orders " +
            //    "WHERE OrderProgressState = 9 " +
            //    "AND Date(HasChecked) = ? " +
            //    " ) bbo " +
            //    "LEFT JOIN bbx_account bba ON bbo.MerchantId = bba.Id " +
            //    "LEFT JOIN bbx_express4orders bbe4o ON bbo.Id = bbe4o.OrderId " +
            //    "ORDER BY bba.AccountName DESC";

            var result = mysql_db.query.sync(mysql_db, selectSql,[cTime])[0];
            var conf = {};
            conf.stylesXmlFile = "styles.xml";
            conf.cols = [
                {caption: '商家名称',type: 'string',width: 20},
                {caption: '福克商城订单编号',type: 'string',width: 20},
                {caption: '订单状态',type: 'string',width: 20},
                {caption: '订单商品供货价',type: 'number',width: 20},
                {caption: '订单商品数量',type: 'number',width: 20},
                {caption: '订单商品',type: 'string',width: 200}
            ];

            var m_data = [];
            var _length = result.length;

            for (var i = 0; i < _length; i++) {

                var arry = [
                    result[i]['AccountName'],
                    result[i]['OrderCode'],
                    result[i]['OrderProgressInfo'],
                    result[i]['GoodsSupplyPrice'],
                    result[i]['GoodsNum'],
                    result[i]['GoodsTitle']
                ];
                m_data.push(arry);
            }
            conf.rows = m_data;
            var resultxls = nodeExcel.execute(conf);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader("Content-Disposition", "attachment; filename=" + encodeURIComponent(dateFormat(new Date(), "yyyy-MM-dd") + "已完结对账单.xls"));
            res.end(resultxls, 'binary');
        }catch(e){
            res.json({code: 300, msg: "fail"});
        }
    });
}


//导出所有商家，售后的订单
function outCheck19All(req,res){
    Sync(function(){
        try{
            var cTime = req.query.cTime;
            console.log(cTime);
            //导出已标记的售后订单

            var selectSql = "SELECT f.OrderCode,f.AccountName,DeductExpressFee,MoreMoney,RefundReason,GoodsTitle,f.goodsNum AS gn1,d.goodsNum AS gn2,d.GoodsSupplyPrice FROM ( " +
                "SELECT a.OrderCode,a.AccountName,DeductExpressFee,MoreMoney,b.RefundReason,c.GoodsId,c.goodsNum FROM ( " +
                "SELECT RefundId,OrderCode,AccountName,DeductExpressFee,MoreMoney FROM bbx_balance4orders " +
                "LEFT JOIN bbx_account ON bbx_balance4orders.MerchantId = bbx_account.Id WHERE DATE(CheckTime) = ?  " +
                ")a LEFT JOIN bbx_refund b ON a.RefundId = b.Id LEFT JOIN bbx_refund4orders c ON a.OrderCode = c.OrderCode " +
                ")f LEFT JOIN bbx_view_order_with_goods_consignee_list_all d ON f.OrderCode = d.OrderCode AND f.GoodsId = d.goodsActionId ORDER BY OrderCode"

            //var selectSql = "SELECT b.GoodsTotalPrice,a.DeductGoodsPrice,a.OrderCode,a.DeductExpressFee,a.ExpressCode,a.ExpressCompany,a.RefundReason,a.AccountName,a.MoreMoney  FROM (" +
            //    "SELECT b4o.OrderCode,b4o.DeductGoodsPrice,b4o.DeductExpressFee,b4o.ExpressCode,b4o.ExpressCompany,br.RefundReason,bba.AccountName,b4o.MoreMoney " +
            //    "FROM bbx_balance4orders b4o LEFT JOIN bbx_refund br ON b4o.RefundId = br.Id " +
            //    "LEFT JOIN bbx_account bba ON b4o.MerchantId = bba.Id " +
            //    "WHERE Date(CheckTime) = ? ORDER BY bba.AccountName DESC) a " +
            //    "LEFT JOIN ( " +
            //    "SELECT SUM((GoodsNum * GoodsSupplyPrice)) AS GoodsTotalPrice, OrderCode FROM bbx_refund4orders " +
            //    "GROUP BY OrderCode ) b " +
            //    "ON a.OrderCode = b.OrderCode " +
            //    "ORDER BY a.AccountName DESC";

            var result = mysql_db.query.sync(mysql_db, selectSql,[cTime])[0];
            var conf = {};
            conf.stylesXmlFile = "styles.xml";
            conf.cols = [
                {caption: '商家名称',type: 'string',width: 20},
                {caption: '福克商城订单编号',type: 'string',width: 20},
                {caption: '售后退回的快递费',type: 'number',width: 20},
                {caption: '补退优惠券',type: 'number',width: 20},
                {caption: '售后类型',type: 'string',width: 20},
                {caption: '供货价',type: 'number',width: 20},
                {caption: '退货数量',type: 'number',width: 20},
                {caption: '商品名称',type: 'string',width: 200}
            ];

            var m_data = [];
            var _length = result.length;
            for (var i = 0; i < _length; i++) {
                var arry = [
                    result[i]['AccountName'],
                    result[i]['OrderCode'],
                    result[i]['DeductExpressFee'],
                    result[i]['MoreMoney'],
                    result[i]['RefundReason'],
                    result[i]['GoodsSupplyPrice'],
                    result[i]['gn1'],
                    result[i]['GoodsTitle']
                ];
                m_data.push(arry);
            }
            console.log("-");
            conf.rows = m_data;
            var resultxls = nodeExcel.execute(conf);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader("Content-Disposition", "attachment; filename=" + encodeURIComponent(dateFormat(new Date(), "yyyy-MM-dd") + "售后对账单.xlsx"));
            res.end(resultxls, 'binary');
        }catch(e){
            res.json({code: 300, msg: "fail"});
        }
    });
}


function outCheckPunish(req,res){
    Sync(function(){
        try{
            var cTime = req.query.cTime;
            console.log(cTime);
            //导出已标记的售后订单

            var selectSql = "SELECT AccountName,MerchantId,PunishmentPrice,PunishTime,PunishmentType,OrderCode " +
                "FROM bbx_merchant4punishment a LEFT JOIN bbx_account b on b.Id = a.MerchantId " +
                "WHERE DATE(CheckTime) = ? ORDER BY MerchantId"

            var result = mysql_db.query.sync(mysql_db, selectSql,[cTime])[0];

            result.map(function (item, index) {
                item.PunishReason = AppConfig.PUNISH[parseInt(item.PunishmentType) - 1][1];
                item.createTime = dateFormat(new Date(item.PunishTime),"yyyy-MM-dd");
            });

            var conf = {};
            conf.stylesXmlFile = "styles.xml";
            conf.cols = [
                {caption: '商家名称',type: 'string',width: 20},
                {caption: '处罚订单',type: 'string',width: 20},
                {caption: '处罚原因',type: 'string',width: 20},
                {caption: '处罚金额',type: 'number',width: 20},
                {caption: '处罚时间',type: 'string',width: 20}
            ];

            var m_data = [];
            var _length = result.length;
            for (var i = 0; i < _length; i++) {
                var arry = [
                    result[i]['AccountName'],
                    result[i]['OrderCode'],
                    result[i]['PunishReason'],
                    result[i]['PunishmentPrice'],
                    result[i]['createTime']
                ];
                m_data.push(arry);
            }
            console.log("-");
            conf.rows = m_data;
            var resultxls = nodeExcel.execute(conf);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader("Content-Disposition", "attachment; filename=" + encodeURIComponent(dateFormat(new Date(), "yyyy-MM-dd") + "处罚对账单.xlsx"));
            res.end(resultxls, 'binary');
        }catch(e){
            res.json({code: 300, msg: "fail"});
        }
    });
}

function exportOrderDetailsAll(req, res, next) {
    var order_statas = req.query.orderstate;
    var start_day = req.query.startday;
    var end_day = req.query.endday;
    var order_statas_sql = '';
    if (order_statas) {
        if (order_statas != '0') {
            order_statas_sql = "AND vogc.OrderProgressState = " + order_statas;
        }
        if (order_statas == 3) {
            order_statas_sql += ' and vogc.ExpressId IS NULL ';
        }
    }

    var sql = [];
    sql.push("SELECT");
    sql.push("vogc.OrderCode,vogc.OrderTime,vogc.GoodsTitle,vogc.GoodsFilterConfig,vogc.GoodsNum,vogc.GoodsSalePrice,vogc.OrderTotalPrice,vogc.ConsigneeName,vogc.ConsigneeMobile,vogc.ConsigneeAddress,vogc.Remarks,vogc.CreateTime,vogc.OrderProgressInfo,vogc.Outeriid,vogc.Skuid");
    sql.push("FROM bbx_view_order_with_goods_consignee_list_all vogc");
    sql.push("WHERE 1 = 1");
    sql.push(order_statas_sql);
    sql.push("AND date(vogc.CreateTime) >= '" + start_day + "'AND date(vogc.CreateTime) <= '" + end_day + "'");
    sql.push("ORDER BY CreateTime, OrderCode DESC");
    sql = sql.join(' ');
    var workbook = new Excel.Workbook();
    var sheet = workbook.addWorksheet("Sheet 1");
    sheet.columns = [
        {
            header: '销售订单号',
            type: 'string',
            width: 20
        },
        {
            header: '商品代码',
            type: 'string',
            width: 15
        },
        {
            header: 'SKU',
            type: 'string',
            width: 15
        },
        {
            header: '商品名称',
            type: 'string',
            width: 60
        },
        {
            header: '商品规格',
            type: 'string',
            width: 15
        },
        {
            header: '数量',
            type: 'number'
        },
        {
            header: '商品金额',
            type: 'number'
        },

        {
            header: '订单全额',
            type: 'number'
        },
        {
            header: '收货人',
            type: 'string',
            width: 15
        },
        {
            header: '电话',
            type: 'string',
            width: 15
        },
        {
            header: '收货地址',
            type: 'string',
            width: 60
        },
        {
            header: '备注',
            type: 'string',
            width: 20
        },
        {
            header: '下单时间',
            type: 'string',
            width: 20
        },
        {
            header: '更新时间',
            type: 'string',
            width: 20
        },
        {
            header: '订单状态',
            type: 'string',
            width: 20
        }
    ];
    mysql_db.query(
        sql,
        function (err, orders) {
            var data = [];
            for (var i = 0; i < orders.length; i++) {
                var _order = orders[i];
                var arry = [
                    orders[i]['OrderCode'],
                    orders[i]['Outeriid'],
                    orders[i]['Skuid'],
                    orders[i]['GoodsTitle'],
                    orders[i]['GoodsFilterConfig'],
                    orders[i]['GoodsNum'],
                    orders[i]['GoodsSalePrice'],
                    orders[i]['OrderTotalPrice'],
                    orders[i]['ConsigneeName'],
                    orders[i]['ConsigneeMobile'],
                    orders[i]['ConsigneeAddress'],
                    orders[i]['Remarks'],
                    DateFormater.format(new Date(new Date(orders[i]['CreateTime']).getTime() - 8 * 3600 * 1000), "yyyy-MM-d hh:mm:ss"),
                    DateFormater.format(new Date(new Date(orders[i]['OrderTime']).getTime() - 8 * 3600 * 1000), "yyyy-MM-d hh:mm:ss"),
                    orders[i]['OrderProgressInfo']
                ];
                sheet.addRow(arry);

                if (orders[i + 1] && (_order['OrderCode'] == orders[i + 1]['OrderCode'])) {
                    sheet.getCell('A' + (i + 2)).fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: getRGB() + "00" }
                    };
                }
                if (orders[i - 1] && (_order['OrderCode'] == orders[i - 1]['OrderCode'])) {
                    sheet.getCell('A' + (i + 2)).fill = sheet.getCell('A' + (i + 1)).fill;
                }
            }
            //sheet.commit();
            res.setHeader("Content-Type", "application/vnd.ms-excel;");
            res.setHeader("Content-disposition", "attachment;filename=" + encodeURIComponent(dateFormat(new Date(), "yyyy-MM-dd") + "-福克商城订单.xlsx"));
            workbook.xlsx.write(res)
                .then(function () {
                    res.end();
                });

        }
    );
}
function exportOrderDetailMerchant(req, res) {
    var order_statas = req.query.orderstate;
    var start_day = req.query.startday;
    var end_day = req.query.endday;
    var order_statas_sql = '';
    var order_create_sql = '';
    if (order_statas) {
        if (order_statas != '0') {
            order_statas_sql = "AND vogc.OrderProgressState = " + order_statas + ' AND OrderProgressState <> 2 ';
        } else {
            order_statas_sql = ' AND OrderProgressState <> 2 ';
        }

        if(order_statas != '3') {
            order_create_sql = "AND date(vogc.CreateTime) >= '" + start_day + "'AND date(vogc.CreateTime) <= '" + end_day + "'"
        }
    }
    var sql = [];
    sql.push("SELECT");
    sql.push("a.AccountName,vogc.OrderCode,bvgl.BrandTitle,vogc.OrderTime,vogc.GoodsTitle,vogc.GoodsNum,vogc.GoodsFilterConfig,vogc.GoodsSupplyPrice,vogc.OrderTotalPrice,vogc.ConsigneeName,vogc.ConsigneeMobile,vogc.ConsigneeAddress,vogc.Remarks,vogc.CreateTime,vogc.OrderProgressInfo,vogc.Outeriid,vogc.Skuid");
    sql.push("FROM bbx_view_order_with_goods_consignee_list_all vogc");
    sql.push("left join bbx_view_goods_list bvgl ON vogc.GoodsActionId = bvgl.GoodsId");
    sql.push("LEFT JOIN bbx_account a ON a.Id = vogc.MerchantId");
    sql.push("WHERE 1 = 1");
    sql.push("AND vogc.MerchantId = " + req.cookies.user.Id);
    sql.push(order_statas_sql);
    sql.push(order_create_sql);
    sql.push("ORDER BY CreateTime, OrderCode DESC");
    sql = sql.join(' ');
    var workbook = new Excel.Workbook();
    var sheet = workbook.addWorksheet("Sheet 1");
    sheet.columns = [
        {
            header: '销售订单号',
            type: 'string',
            width: 20
        },
        {
            header: '商家名称',
            type: 'string',
            width: 30
        },
        {
            header: '品牌名称',
            type: 'string',
            width: 30
        },
        {
            header: '商品代码',
            type: 'string',
            width: 15
        },
        {
            header: 'SKU',
            type: 'string',
            width: 15
        },
        {
            header: '商品名称',
            type: 'string',
            width: 60
        },
        {
            header: '商品规格',
            type: 'string',
            width: 15
        },
        {
            header: '数量',
            type: 'number'
        },
        {
            header: '商品供货价',
            type: 'number'
        },
        {
            header: '收货人',
            type: 'string',
            width: 15
        },
        {
            header: '电话',
            type: 'string',
            width: 15
        },
        {
            header: '收货地址',
            type: 'string',
            width: 60
        },
        {
            header: '备注',
            type: 'string',
            width: 20
        },
        {
            header: '下单时间',
            type: 'string',
            width: 20
        },
        {
            header: '更新时间',
            type: 'Date',
            width: 20
        },
        {
            header: '订单状态',
            type: 'Date',
            width: 20
        },
        {
            header: '物流商' ,
            width: 20
        },
        {
            header: '快递单号',
            width: 20
        }
    ];
    mysql_db.query(
        sql,
        function (err, orders) {
            var data = [];
            for (var i = 0; i < orders.length; i++) {
                var _order = orders[i];
                var arry = [
                    orders[i]['OrderCode'],
                    orders[i]['AccountName'],
                    orders[i]['BrandTitle'],
                    orders[i]['Outeriid'],
                    orders[i]['Skuid'],
                    orders[i]['GoodsTitle'],
                    orders[i]['GoodsFilterConfig'],
                    orders[i]['GoodsNum'],
                    orders[i]['GoodsSupplyPrice'],
                    orders[i]['ConsigneeName'],
                    orders[i]['ConsigneeMobile'],
                    orders[i]['ConsigneeAddress'],
                    orders[i]['Remarks'],
                    DateFormater.format(new Date(new Date(orders[i]['CreateTime']).getTime() - 8 * 3600 * 1000), "yyyy-MM-d hh:mm:ss"),
                    DateFormater.format(new Date(new Date(orders[i]['OrderTime']).getTime() - 8 * 3600 * 1000), "yyyy-MM-d hh:mm:ss"),
                    orders[i]['OrderProgressInfo'],
                    "'",
                    "'",
                ];
                sheet.addRow(arry);

                if (orders[i + 1] && (_order['OrderCode'] == orders[i + 1]['OrderCode'])) {
                    sheet.getCell('A' + (i + 2)).fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: getRGB() + "00" }
                    };
                }
                if (orders[i - 1] && (_order['OrderCode'] == orders[i - 1]['OrderCode'])) {
                    sheet.getCell('A' + (i + 2)).fill = sheet.getCell('A' + (i + 1)).fill;
                }
            }
            res.setHeader("Content-Type", "application/vnd.ms-excel;");
            res.setHeader("Content-disposition", "attachment;filename=" + encodeURIComponent(dateFormat(new Date(), "yyyy-MM-dd") + "-福克商城订单.xlsx"));
            workbook.xlsx.write(res)
                .then(function () {
                    res.end();
                });
        }
    );
}

function getRGB() {
    return (Math.round(Math.random() * 1000) % 255).toString(16) + '' +
        (Math.round(Math.random() * 1000) % 255).toString(16) + '' +
        (Math.round(Math.random() * 1000) % 255).toString(16)
}

exports.outNoExpressOrder = outNoExpressOrder;
exports.outTimeOutOrders = outTimeOutOrders;
exports.setReFundGoodsBack = setReFundGoodsBack;
exports.setRefundGoods = setRefundGoods;
exports.changeStatusByCode = changeStatusByCode;
exports.orderCheckAll = orderCheckAll;
exports.outCheck19All = outCheck19All;
exports.outCheck09All = outCheck09All;
exports.outCheckPunish = outCheckPunish;
exports.getChangeGoods = getChangeGoods;
exports.changeGoodsInfo = changeGoodsInfo;
exports.exportOrderDetailsAll = exportOrderDetailsAll;
exports.exportOrderDetailMerchant = exportOrderDetailMerchant;