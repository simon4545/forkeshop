/**
 * Created by Administrator on 2015/8/16.
 */
var uuid = require('node-uuid');
var http = require('http');

function no_uuid() {
    var _uuid = uuid.v1();
    var sp = _uuid.split('-');
    return sp.join('');
}

/**
 * 时间格式转换辅助方法
 * @param   {date}      date
 * @param   {String}    fmt格式 yyyy-MM-dd hh:mm:ss
 * @return  {Array}     数组
 */

function dateFormat(date, fmt) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function logger(postData) {
    var options = {
        hostname: 'm.bbxvip.com',
        port: 80,
        path: '/logger/record',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };

    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    req.write(postData);
    req.end();
}

/**
 * 生成8位的随机数字+字母字符串
 * @param len
 * @returns {string}
 */
function randomString(len) {
    len = len || 8;
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function randomNum (len) {
    var rStr = "";
    var $chars = '0123456789';
    var maxPos = $chars.length;
    for (var j = 0; j < len; j ++) {
        rStr += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return rStr;
}

exports.no_uuid = no_uuid;
exports.dateFormat = dateFormat;
exports.logger = logger;
exports.randomString = randomString;
exports.randomNum = randomNum;