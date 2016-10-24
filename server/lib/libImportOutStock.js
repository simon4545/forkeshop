var AppConfig = require('../config');
var Sync = require('sync');
var common = require('../common');
var request = require('request');
var Excel = require('exceljs');
var dateFormat = require('../routes/common').dateFormat;
var randomNum = require('../routes/common').randomNum;
var _ = require('lodash');
var mysql_db = global.app.get('MysqlConn');
var _uuid = require('../routes/common').no_uuid;

/**********************************************************
 * 此处为导入缺货单
 */
function getExportMerchantData(xlsPath, callback) {
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(xlsPath).then(function () {
        var sheet = workbook.getWorksheet('Sheet 1');
        var sheetArray = [], sheetRows = [];
        sheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
            sheetArray.push(_.rest(row.values));
        });
        var header = sheetArray.shift();
        sheetArray.forEach(function (row, i) {
            var _obj = {};
            header.forEach(function (item, idx) {
                var _item = row[idx] ? (row[idx]).toString().trim():'';
                if (item == '订单编号') {
                    _item = _item.replace(/[^0-9]+/g, '');
                }
                _obj[item] = _item;
            });
            sheetRows.push(_obj);
        });
        updateSqlSync(sheetRows,callback);
    });
}

function updateSqlSync(list, callback) {
    Sync(function () {
        updateSql(list);
        callback(list);
    });
}

function updateSql(list){
    //先清除
    var sql_delete1 = "UPDATE bbx_refund SET MainShow = 0 WHERE OrderCode = ? " ;
    var sql_delete2 = "DELETE FROM bbx_refund4orders where ORDERCode = ? " ;
    var sql_delete3 = "DELETE FROM bbx_balance4orders where ORDERCode = ? " ;

    //再查询MemberId,MerchantId,GoodsId，GoodsNum，GoodsSalePrice，GoodsSupplyPrice,OrderTotalPrice,GoodsTotalPrice
    var sql_select1 = "SELECT MemberId,MerchantId,GoodsActionId,GoodsNum,GoodsSalePrice,GoodsSupplyPrice,OrderTotalPrice,GoodsTotalPrice " +
        "FROM bbx_view_order_with_goods_consignee_list_all WHERE OrderCode = ? "

    //再插入
    var sql_insert1 = "INSERT INTO bbx_refund (Id,RefundCode,OrderCode,MemberId,RefundType,RefundReason,RefundDesc,RefundProgressState," +
        "RefundProgressInfo,MerchantId,MerchantRefundAddress,CreateTime,UpdateTime,NeedBackGoods,GoodsState,UserUploadImg,ExpressImg,MainShow,MerchantGotBackGoods) " +
        "VALUES (?,?,?,?,?,?,?,?,?,?,?,now(),now(),?,?,?,?,?,?)";
    var sql_insert2 = "INSERT INTO bbx_refund4orders (Id,RefundCode,OrderCode,GoodsId,GoodsNum,CreateTime,UpdateTime,HasRefund,GoodsSalePrice,GoodsSupplyPrice) VALUES (?,?,?,?,?,now(),now(),?,?,?)";
    var sql_insert3 = "INSERT INTO bbx_balance4orders (RefundId,OrderCode,DeductGoodsPrice,DeductExpressFee,ExpressCompany,ExpressCode,MerchantId,AlipayAccount,AlipayAuthName) VALUES (?,?,?,?,?,?,?,?,?)";

    var refundId = "",orderCode = "",code = "";
    try{
        for(var i = 0;i<list.length;i++){
            orderCode = list[i]['订单编号'];
            refundId = _uuid();
            code = dateFormat(new Date(), "yyyyMMddhhmmss") + randomNum(4) ;

            if(!orderCode){
                continue;
            }

            mysql_db.beginTransaction.sync(mysql_db);
            //先清除
            mysql_db.query.sync( mysql_db,sql_delete1,[orderCode]);
            mysql_db.query.sync( mysql_db,sql_delete2,[orderCode]);
            mysql_db.query.sync( mysql_db,sql_delete3,[orderCode]);

            //再查询信息
            var result1 = mysql_db.query.sync( mysql_db,sql_select1,[orderCode])[0];

            //再插入
            //缺货退款不需要退货地址
            mysql_db.query.sync( mysql_db,sql_insert1,[refundId,code,orderCode,result1[0].MemberId,2,
                "缺货退款","福克商城汇总导入",3,"缺货已退款",result1[0].MerchantId,"",0,0,"","",1,1]);
            mysql_db.query.sync( mysql_db,sql_insert3,[refundId,orderCode,result1[0].OrderTotalPrice,0,"","",result1[0].MerchantId,"",""]);
            for(var j = 0 ,lenj = result1.length;j<lenj;j++){
                mysql_db.query.sync( mysql_db,sql_insert2,[_uuid(),dateFormat(new Date(), "yyyyMMddhhmmss") + randomNum(4),
                    orderCode,result1[j].GoodsActionId,result1[j].GoodsNum,'1',result1[j].GoodsSalePrice,result1[j].GoodsSupplyPrice]);
            }

            //将订单改为已完结，防止重复发货
            var sqlChangeOrder = "UPDATE bbx_orders SET OrderProgressState = 9 ,OrderProgressInfo = '交易关闭',orderTime = NOW() WHERE orderCode = ?";
            mysql_db.query.sync(mysql_db, sqlChangeOrder, [orderCode])[0];

            //加log
            var sqlAdd = "INSERT INTO bbx_refundlog (Id,RefundId,CurProgressState,PreProgressState,CreateTime,OprateRole,RecordText) VALUES (?,?,?,?,NOW(),?,?)"
            mysql_db.query.sync(mysql_db, sqlAdd, [_uuid(), refundId, 3, 0, "bbx_excel_导入", "缺货已退款-:-记录自福克商城"])[0];

            //发送消息给小龙
            request.post({
                url: AppConfig.DB_CONFIG.REDIS_QUEUE_URL,
                form:  {queueName: 'order:event', data: orderCode+"::"+ 0 + "::" + result1[0].OrderTotalPrice}
            },function (err, httpResponse, body) {
                if(err) {
                    console.error(err);
                }
            });

            mysql_db.commit.sync(mysql_db);
        }
    }
    catch(e){
        console.log(e);
        mysql_db.rollback.sync(mysql_db);
        return;
    }
}

exports.getExportMerchantData = getExportMerchantData;
