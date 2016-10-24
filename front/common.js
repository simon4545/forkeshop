/**
 * Created by Administrator on 2016/1/23.
 */

var uuid = require('node-uuid');
var xml2js = require('xml2js');

var comFunc = {
    no_uuid: function () {
        var _uuid = uuid.v1();
        var sp = _uuid.split('-');
        return sp.join('');
    },
    dateFormat: function (date, fmt) {
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
    },
    randomString: function (len) {
        len = len || 8;
        var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },
    randomNum: function (len) {
        var rStr = "";
        var $chars = '0123456789';
        var maxPos = $chars.length;
        for (var j = 0; j < len; j++) {
            rStr += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return rStr;
    },
    array_remove: function (arr, dx) {
        var new_arr = [];
        if (arr instanceof Array) {
            if (isNaN(dx) || dx > arr.length) {
                return false;
            }
            for (var i = 0; i < arr.length; i++) {
                if (i != dx) {
                    new_arr.push(arr[i]);
                }
            }
            return new_arr;
        } else {
            return false;
        }
    },
    /**
     * 转对象的键为大写
     * @param obj
     * @returns {{}}
     */
    upperCase: function (obj) {
        var that = this;
        var output = {};
        for (var i in obj) {
            if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
                output[i.toUpperCase()] = that.upperCase(obj[i]);
            } else if (Object.prototype.toString.apply(obj[i]) === '[object Array]') {
                obj[i].forEach(function (item, idx) {
                    obj[i][idx] = that.upperCase(item);
                });
                output[i.toUpperCase()] = obj[i];
            } else {
                output[i.toUpperCase()] = obj[i];
            }
        }
        return output;
    },
    buildXml: function (obj) {
        var builder = new xml2js.Builder();
        var xml = builder.buildObject({xml: obj});
        return xml;
    }
}

exports.comFunc = comFunc;
