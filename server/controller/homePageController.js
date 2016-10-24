/**
 * Created by pig on 15/11/1.
 */
var mysql_db = global.app.get('MysqlConn');
var Sync = require('sync');
var common = require('../common.js');
var Excel = require('exceljs');
var dateFormat = require('../routes/common').dateFormat;

function getDate(req) {
    //默认是查询当天
    var date = common.dateFormat(new Date(), "yyyy-MM-dd");
    //获取查询日期，覆盖默认查询日期
    var url = req.originalUrl.substring(req.originalUrl.indexOf("?"));
    var theRequest = {};
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    (theRequest["date"]) && (date = theRequest["date"]);
    return date;
}

function get4banner(req, res) {
    var date = getDate(req);
    Sync(function () {
        try {
            //总销售额
            var sql1 = "SELECT SUM(OrderTotalPrice) AS NUM , SUM(GoodsTotalPrice) AS GNUM FROM bbx_orders WHERE DATE(CreateTime) = ? " +
                "AND OrderProgressState NOT IN (1,99)";
            var result1 = mysql_db.query.sync(mysql_db, sql1, [date])[0][0];

            //今日总销量
            var sql2 = "SELECT SUM(GOODSNUM) AS NUM FROM bbx_goods4orders WHERE OrderId IN ( " +
                "SELECT Id FROM bbx_orders WHERE DATE(CreateTime) = ?  " +
                "AND OrderProgressState NOT IN (1,99) " +
                ")";
            var result2 = mysql_db.query.sync(mysql_db, sql2, [date])[0][0].NUM;

            //今日总订单量
            var sql3 = "SELECT COUNT( DISTINCT(Id) ) AS NUM FROM bbx_orders WHERE DATE(CreateTime) = ? AND OrderProgressState NOT IN (1,99)";
            var result3 = mysql_db.query.sync(mysql_db, sql3, [date])[0][0].NUM;

            var single = (result1.NUM / result3).toFixed(2);

            res.render('homepage.html', {
                totalPriceNum: result1.NUM.toFixed(2) || 0,
                totalGoodsNum: result1.GNUM.toFixed(2) || 0,
                goodsNum: result2 || 0,
                orderNum: result3 || 0,
                single: single,
                user: req.cookies.user,
                date: date
            });
        }
        catch (e) {
            res.render('homepage.html', {
                totalPriceNum: 0,
                totalGoodsNum: 0,
                goodsNum: 0,
                orderNum: 0,
                single: 0,
                user: req.cookies.user,
                date: date
            });
        }
    });
}

exports.get4banner = get4banner;

