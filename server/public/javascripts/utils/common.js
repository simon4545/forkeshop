/**
 * Created by Administrator on 2015/8/17.
 */

var common = {
    ajax: function (url, data, successback, errorback, arg, type) {
        $.ajax({
            url: url,
            type: type == undefined ? "POST" : "GET",
            cache: false,
            data: data,
            success: function (res) {
                if (!arg) {
                    successback(res);
                } else {
                    successback(res, arg);
                }
            },
            error: function (err) {
                if (!arg) {
                    errorback(err);
                } else {
                    errorback(err, arg);
                }
            }
        });
    },
    QueryString: function (item) {
        var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        return svalue ? svalue[1] : svalue;
    },
    QueryStingURL: function (url, item) {
        var svalue = url.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        return svalue ? svalue[1] : svalue;
    },
    //手机号码
    checkMobile: function (str) {
        return str.match(/^1[0-9]{10}$/i);
    },
    GetRequest: function (url) {
        var theRequest = {};
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    /**
     * param 将要转为URL参数字符串的对象
     * key URL参数字符串的前缀
     * encode true/false 是否进行URL编码,默认为true
     *
     * return URL参数字符串
     */
    urlEncode: function (param, encode, key) {
        if (param == null) return '';
        var paramStr = '';
        var t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
        } else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += this.urlEncode(param[i], encode, k);
            }
        }
        return paramStr;
    },
    getCookies: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
};