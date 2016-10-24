var AppConfig = require('../config');
var Sync = require('sync');
var common = require('../common');
var request = require('request');
var Excel = require('exceljs');
var _ = require('lodash');
var mysql_db = global.app.get('MysqlConn');
var _uuid = require('../routes/common').no_uuid;

/**********************************************************
 *
 * Caution 此处本是为退回快递费做准备
 * 现在为售后单导入
 *
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
    var sql = "UPDATE bbx_refund SET RefundProgressState = 3,RefundProgressInfo = '卖家已退款' WHERE Id = ? AND OrderCode = ? ";
    var sql2 = "SELECT OrderCode,DeductGoodsPrice FROM bbx_balance4orders WHERE OrderCode = ? "
    var sqlAdd = "INSERT INTO bbx_refundlog (Id,RefundId,CurProgressState,PreProgressState,CreateTime,OprateRole,RecordText) VALUES (?,?,?,?,NOW(),?,?)"
    var resObj = null,refundId= "";
    try{

        for(var i = 0;i<list.length;i++){
            mysql_db.beginTransaction.sync(mysql_db);
            mysql_db.query.sync( mysql_db,sql,[list[i]['售后编号'],list[i]['订单编号']]);
            resObj =   mysql_db.query.sync( mysql_db,sql2,[list[i]['订单编号']])[0][0];

            refundId = list[i]['售后编号'];
            mysql_db.query.sync(mysql_db, sqlAdd, [_uuid(), refundId, 3, "", "excel_导入", "福克商城已退款-:-记录自福克商城"])[0];

            request.post({
                url: AppConfig.DB_CONFIG.REDIS_QUEUE_URL,
                form:  {queueName: 'order:event', data: resObj.OrderCode+"::"+ 0 + "::" + resObj.DeductGoodsPrice}
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
