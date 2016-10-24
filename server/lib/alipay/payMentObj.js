/**
 * Created by Administrator on 16-1-11.
 */
var md5 = require('md5');
var sha1 = require('sha1');
var request = require('request');
var underScore = require('underscore');
var xml2js = require('xml2js');
var https = require('https');
var url_mod = require('url');

var signTypes = {
    MD5: md5,
    SHA1: sha1
};

var RETURN_CODES = {
    SUCCESS: 'SUCCESS',
    FAIL: 'FAIL'
};

var URLS = {
    Oauth:"https://open.weixin.qq.com/connect/oauth2/authorize",
    Oauth_OpenId : "https://api.weixin.qq.com/sns/oauth2/access_token",
    UNIFIED_ORDER: 'https://api.mch.weixin.qq.com/pay/unifiedorder'
};

var WCPayMentObj = function (config) {
    this.appid = config.appid;
    this.mch_id = config.mch_id;
    this.secret = config.secret;
    this.notify_url = config.notify_url;
    this.pay_key = config.pay_key;
    return this;
};

WCPayMentObj.prototype.getOpenId = function(code,callback){
    var self = this;
    var params = {
        appid: self.appid,
        secret:self.secret,
        code:code,
        grant_type:"authorization_code"
    };
    var paramStr = self.toQueryString(params);

    // TODO: 修改成request post 获取 openId

    request(URLS.Oauth_OpenId + "?" + paramStr, function(err, response, body){
        console.log(paramStr);
        if(err){
            return null;
        }
        var bodyObj = JSON.parse(body);
        console.log(bodyObj);
        callback(bodyObj.openid);
    });
};

WCPayMentObj.prototype.getOauth = function(redirect_uri,state,res){
    var self = this;
    var params = {
        appid: self.appid,
        response_type:"code",
        scope:"snsapi_base",
        state: state + "#wechat_redirect",
        redirect_uri:encodeURIComponent(redirect_uri)
    }

    console.log(params.redirect_uri);
    console.log("==== re ui  =====");
    var paramStr = self.toQueryString(params);
    console.log(URLS.Oauth + "?" + paramStr);
    res.code = 200;
    res.redirect(URLS.Oauth + "?" + paramStr );
}


WCPayMentObj.prototype.getWCPayRequestParams = function (order, callback) {
    var _self = this;

    var default_params = {
        appid: _self.appid,
        timeStamp: this.generateTimeStamp(),
        nonce_str: _self.generateNonceStr(),
        signType: 'MD5'
    };

    console.log("-- default_params --");

    _self.unifiedOrder(order, function (err, data) {
        //TODO : 预支付over
        if (err) {
            return callback(err);
        }

        var params = underScore.extend(default_params, {
            package: 'prepay_id=' + data.prepay_id
        });

        params.appId = params.appid;
        delete params.appid;

        params.nonceStr = params.nonce_str;
        delete params.nonce_str;

        console.log("--- go  ----");
        console.log(params);

        params.paySign = _self.getSign(params);
        console.log("-- get prepay id  --");
        callback(null, params);
    });
};

WCPayMentObj.prototype.generateTimeStamp = function () {
    return parseInt(+new Date() / 1000, 10) + '';
};

WCPayMentObj.prototype.generateNonceStr = function (length) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = chars.length;
    var noceStr = '';
    var i;
    for (i = 0; i < (length || 32); i++) {
        noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return noceStr;
};

WCPayMentObj.prototype.extendWithDefault = function (obj, keysNeedExtend) {
    var _self = this;
    var defaults = {
        appid: _self.appid,
        mch_id: _self.mch_id,
        nonce_str: _self.generateNonceStr(),
        notify_url: _self.notify_url,
        op_user_id: _self.mch_id
    };
    var extendObject = {};

    keysNeedExtend.forEach(function (k) {
        if (defaults[k]) {
            extendObject[k] = defaults[k];
        }
    });
    return underScore.extend(extendObject, obj);
};

WCPayMentObj.prototype.unifiedOrder = function (params, callback) {
    var _self = this;

    var requiredData = ['body', 'out_trade_no', 'total_fee', 'spbill_create_ip', 'trade_type'];
    if(params.trade_type == 'JSAPI'){
        requiredData.push('openid');
    }else if (params.trade_type == 'NATIVE'){
        requiredData.push('product_id');
    }
    params.notify_url = params.notify_url || _self.notify_url;
    _self.signedQuery(URLS.UNIFIED_ORDER, params, {
        required:requiredData
    }, callback);
};

WCPayMentObj.prototype.getSign = function (pkg, signType) {
    var _self = this;
    pkg = underScore.clone(pkg);
    delete pkg.sign;
    console.log("-- start sign --")
    console.log(pkg);
    signType = signType || 'MD5';
    var string1 = _self.toQueryString(pkg);
    console.log("-- start sign 11 --")
    console.log(string1);
    var stringSignTemp = string1 + '&key=' + _self.pay_key;
    /*************** !!!!!! wo cao ***************/
    var signValue = signTypes[signType](stringSignTemp).toUpperCase();
    return signValue;
};

WCPayMentObj.prototype.signedQuery = function(url, params, options, callback){
    var _self = this;
    var required = options.required || [];
    console.log("===========");
    console.log(params);
    params = _self.extendWithDefault(params, [
        'appid',
        'mch_id',
        'nonce_str'
    ]);
    console.log("+++++ params extendWithDefault ++++++++");
    console.log(params);
    for(var key in params){
        if(params[key] !== undefined && params[key] !== null){
            params[key] = params[key].toString();
        }
    }

    var missing = [];
    required.forEach(function(key) {
        var alters = key.split('|');
        for (var i = alters.length - 1; i >= 0; i--) {
            if (params[alters[i]]) {
                return;
            }
        }
        missing.push(key);
    });

    if(missing.length){
        return callback('missing params ' + missing.join(','));
    }

    params = underScore.extend({
        'sign': _self.getSign(params)
    }, params);

    console.log("+++++ params extend getSign ++++++++");
    console.log(params);

    var request = (options.https ? this.httpsRequest : this.httpRequest).bind(_self);
    request(url, _self.buildXml(params), function(err, body){
        if(err){
            return callback(err);
        }
        _self.validate(body, callback);
    });
};

WCPayMentObj.prototype.toQueryString = function (object) {
    return Object.keys(object).filter(function (key) {
        return object[key] !== undefined && object[key] !== '';
    }).sort().map(function (key) {
            return key + '=' + object[key];
        }).join('&');
};

WCPayMentObj.prototype.httpsRequest = function(url, data, callback){
    var _self = this;
    var parsed_url = url_mod.parse(url);
    var req = https.request({
        host: parsed_url.host,
        port: 443,
        path: parsed_url.path,
        pfx: _self.pfx,
        passphrase: _self.passphrase,
        method: 'POST'
    }, function(res) {
        var content = '';
        res.on('data', function(chunk) {
            content += chunk;
        });
        res.on('end', function(){
            callback(null, content);
        });
    });

    req.on('error', function(e) {
        callback(e);
    });
    req.write(data);
    req.end();
};

WCPayMentObj.prototype.httpRequest = function(url, data, callback){
    request({
        url: url,
        method: 'POST',
        body: data
    }, function (err, response, body) {
        if (err) {
            return callback(err);
        }
        callback(null, body);
    });
};

WCPayMentObj.prototype.buildXml = function (obj) {
    var builder = new xml2js.Builder();
    var xml = builder.buildObject({xml:obj});
    return xml;
};

WCPayMentObj.prototype.validate = function (xml, callback) {
    var self = this;

    console.log(xml);

    xml2js.parseString(xml, {
        trim: true,
        explicitArray: false
    }, function (err, json) {
        var error = null,
            data;
        if (err) {
            error = new Error();
            err.name = 'XMLParseError';
            return callback(err, xml);
        }

        data = json ? json.xml : {};

        if (data.return_code == RETURN_CODES.FAIL) {
            error = new Error(data.return_msg);
            error.name = 'ProtocolError';
        } else if (data.result_code == RETURN_CODES.FAIL) {
            error = new Error(data.err_code_des);
            error.name = 'ProtocolError';
        } else if (self.appid !== data.appid) {
            error = new Error();
            error.name = 'InvalidAppId';
        } else if (self.mch_id !== data.mch_id) {
            error = new Error();
            error.name = 'InvalidMchId';
        } else if (self.getSign(data) !== data.sign) {
            error = new Error();
            error.name = 'InvalidSignature';
        }
        callback(error, data);
    });
};

WCPayMentObj.prototype.sayHello = function (){
    console.log("hello--1111")
}

exports.WCPayMentObj = WCPayMentObj;