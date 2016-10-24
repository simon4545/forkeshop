var AppConfig = require('../config');
var Sync = require('sync');
var common = require('../common');
var request = require('request');
var Excel = require('exceljs');
var _ = require('lodash');
function getExportMerchantData(xlsPath, callback) {
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(xlsPath)
        .then(function () {
            var sheet = workbook.getWorksheet(1);
            var sheetArray = [], sheetRows = [];
            sheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                sheetArray.push(_.rest(row.values));
            });
            var header = sheetArray.shift();
            sheetArray.forEach(function (row, i) {
                var _obj = {};
                header.forEach(function (item, idx) {
                    var _item =row[idx]? (row[idx]).toString().trim():'';
                    if (item == '快递单号') {
                        _item = _item.replace(/[^A-z0-9]+/g, '');
                    }
                    _obj[item] = _item;
                });
                sheetRows.push(_obj)
            });
            //console.dir(sheetRows);
            insertIntoMysqlData(sheetRows, callback);
        });
}

function insertIntoMysqlData(res, callback) {
    Sync(function () {
        for (var item in res) {
            insertIntoMysql(res[item]);
        }
        _update_orders_status(); // 更新订单状态
        callback(res);
    });
}



function insertIntoMysql(data) {
    try {
        var connection = app.get('MysqlConn');
        if (data['销售订单号'] != ''&&data['快递单号'] && data['快递单号'].length > 6) {
            //检查orderId 是否在表中存在，如果存在，则更新表
            var result = connection.query.sync(
                connection,
                'select Id from bbx_orders where OrderCode=?',
                [data['销售订单号']]
                );
            if (result[0].length > 0) {

                var orderId = result[0][0].Id;
                result = connection.query.sync(
                    connection,
                    'select Id from bbx_express4orders where OrderId=? and ExpressCode=?',
                    [orderId, data['快递单号']]
                    );
                if (result[0].length == 0) {

                    var _uuid = common.no_uuid();

                    var ret_body = request.sync(null, 'http://www.kuaidi100.com/autonumber/autoComNum?text=' + data['快递单号']);
                    if (ret_body[0].statusCode == 200) {
                        ret_body = JSON.parse(ret_body[0].body);

                        if (ret_body.auto.length > 0) {
                            _insertOrderExpress(_uuid, data['物流商'], data['快递单号'], orderId, ret_body.auto[0].comCode, data.SKU);
                        } else {
                            _insertOrderExpress(_uuid, data['物流商'], data['快递单号'], orderId, null, data.SKU);
                        }
                    } else {
                        _insertOrderExpress(_uuid, data['物流商'], data['快递单号'], orderId, null, data.SKU);
                    }


                } else {
                    var _id = result[0][0].Id;

                    var ret_body = request.sync(null, 'http://www.kuaidi100.com/autonumber/autoComNum?text=' + data['快递单号']);
                    if (ret_body[0].statusCode == 200) {
                        if (ret_body[0].statusCode == 200) {
                            var ret_body = JSON.parse(ret_body[0].body);

                            if (ret_body.auto.length > 0) {
                                _updateOrderExpress(data['快递单号'], data['物流商'], orderId, ret_body.auto[0].comCode, _id, data.SKU);
                            } else {
                                _updateOrderExpress(data['快递单号'], data['物流商'], orderId, null, _id, data.SKU);
                            }
                        } else {
                            _updateOrderExpress(data['快递单号'], data['物流商'], orderId, null, _id, data.SKU);
                        }
                    }

                }
                //request.post({
                //    url: AppConfig.DB_CONFIG.REDIS_API,
                //    body: "LPUSH/order:event/" + orderId + "::4"
                //},
                //    function (err, httpResponse, body) { });
                request.post({
                    url: AppConfig.DB_CONFIG.REDIS_QUEUE_URL,
                    form:  {queueName: 'order:event', data: orderId + '::4'}
                },function (err, httpResponse, body) {
                    if(err) {
                        console.error(err);
                    }
                });
            }
        }
    } catch (e) {
        console.error(e.message);
    }
}

/**
 * 将订单状态修改为 待签收
 */
function _update_orders_status() {
    var connection = app.get('MysqlConn');
    var sql = "update bbx_orders set OrderProgressState=4,OrderProgressInfo='待签收',OrderTime=now()" +
        "where OrderProgressState=3 and Id in (  " +
        "SELECT OrderId from bbx_express4orders)";
    var result = connection.query.sync(
        connection,
        sql
        );
    return true;
}

/**
 *
 * @param expressCode
 * @param expressCompany
 * @param orderId
 * @param comCode
 * @param Id
 * @private
 */
function _updateOrderExpress(expressCode, expressCompany, orderId, comCode, Id, skuId) {
    var connection = app.get('MysqlConn');
    result = connection.query.sync(
        connection,
        'update bbx_express4orders set ExpressCode=?,ExpressName=?,OrderId=?,ExpressAliasesName = ? where Id=?',
        [expressCode, expressCompany, orderId, comCode, Id]
        );
    _update_goods4order_expressId(orderId, Id, skuId);
    return;
}

/**
 *
 * @param uuid
 * @param expressCompany
 * @param expressCode
 * @param orderId
 * @param comCode
 * @private
 */
function _insertOrderExpress(uuid, expressCompany, expressCode, orderId, comCode, skuId) {
    var connection = app.get('MysqlConn');
    result = connection.query.sync(
        connection,
        'insert into bbx_express4orders (Id,ExpressName,ExpressCode,CreateTime,OrderId,ExpressAliasesName) VALUES (?,?,?,now(),?,?)',
        [uuid, expressCompany, expressCode, orderId, comCode]
        );
    _update_goods4order_expressId(orderId, uuid, skuId);
    return;
}

/**
 * 将物流信息反更新到bbx_goods4orders表中
 * @param orderId
 * @param expressId
 * @param skuId
 * @private
 */
function _update_goods4order_expressId(orderId, expressId, skuId) {
    var connection = app.get('MysqlConn');
    result = connection.query.sync(
        connection,
        'UPDATE bbx_goods4orders SET ExpressId = ? WHERE OrderId = ? AND Skuid = ?',
        [expressId, orderId, skuId]
        );
    return true;
}

exports.getExportMerchantData = getExportMerchantData;
