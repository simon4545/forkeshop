/**
 * Created by Administrator on 16-1-15.
 */

var core_func = require("./wc_core.function");
var request = require('request');
var underScore = require('underscore');
var xml2js = require('xml2js');

var URLS = {
    Oauth:"https://open.weixin.qq.com/connect/oauth2/authorize",
    Oauth_OpenId : "https://api.weixin.qq.com/sns/oauth2/access_token",
    UNIFIED_ORDER: 'https://api.mch.weixin.qq.com/pay/unifiedorder'
};

var RETURN_CODES = {
    SUCCESS: 'SUCCESS',
    FAIL: 'FAIL'
};

function WCSubmit(config){
    this.wc_config = config;
}

WCSubmit.prototype.getOathToken = function(state){
    var _self = this;
    var params = {
        appid: _self.wc_config.appid,
        response_type:"code",
        scope:"snsapi_base",
        state: state + "#wechat_redirect",
        redirect_uri:encodeURIComponent(_self.wc_config.oauth_redirect_url)
    }
    var paramStr = core_func.ObjToQueryString(params);
    return URLS.Oauth + "?" + paramStr;
}

WCSubmit.prototype.getOpenId = function(code,callback){
    var _self = this;
    var params = {
        appid: _self.wc_config.appid,
        secret:_self.wc_config.secret,
        code:code,
        grant_type:"authorization_code"
    };
    var paramStr = core_func.ObjToQueryString(params);

    request(URLS.Oauth_OpenId + "?" + paramStr, function(err, response, body){
        if(err){
            return null;
        }
        var bodyObj = JSON.parse(body);
        callback(bodyObj.openid);
    });
}

WCSubmit.prototype.checkSign = function(data, callback) {
    var _self = this;
    var paySign = ore_func.getSign(data,"",_self.wc_config.pay_key);
    if (paySign == checkSign) {

    }
}

WCSubmit.prototype.getWCPayRequestParams = function (order,callback){
    var _self = this;
    var default_params = {
        appid: _self.wc_config.appid,
        timeStamp: core_func.generateTimeStamp(),
        nonce_str: core_func.generateNonceStr(),
        signType: 'MD5'
    };

    var requiredData = core_func.getRequiredData(order);

    _self.signedQuery(URLS.UNIFIED_ORDER, order, {
        required:requiredData
    }, function (err, data) {

        console.error(err);

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
        params.paySign = core_func.getSign(params,"",_self.wc_config.pay_key);
        callback(null, params);
    });
}

WCSubmit.prototype.signedQuery = function(url, params, options, callback){
    var _self = this;
    var required = options.required || [];

    params = _self.extendWithDefault(params, [
        'appid',
        'mch_id',
        'nonce_str',
        'notify_url'
    ]);

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
        'sign': core_func.getSign(params,"",_self.wc_config.pay_key)
    }, params);

    var request = (options.https ? core_func.httpsRequest : core_func.httpRequest).bind(_self);

    request(url, core_func.buildXml(params), function(err, body){
        if(err){
            return callback(err);
        }
        _self.validate(body, callback);
    });
}

WCSubmit.prototype.extendWithDefault = function (obj, keysNeedExtend) {
    var _self = this;
    var defaults = {
        appid: _self.wc_config.appid,
        mch_id: _self.wc_config.mch_id,
        nonce_str: core_func.generateNonceStr(),
        notify_url: _self.wc_config.notify_url,
        op_user_id: _self.wc_config.mch_id
    };
    var extendObject = {};

    keysNeedExtend.forEach(function (k) {
        if (defaults[k]) {
            extendObject[k] = defaults[k];
        }
    });
    return underScore.extend(extendObject,obj);
};

WCSubmit.prototype.validate = function (xml, callback) {
    var _self = this;

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
        } else if (_self.wc_config.appid !== data.appid) {
            error = new Error();
            error.name = 'InvalidAppId';
        } else if (_self.wc_config.mch_id !== data.mch_id) {
            error = new Error();
            error.name = 'InvalidMchId';
        } else if (core_func.getSign(data,"",_self.wc_config.pay_key) !== data.sign) {
            error = new Error();
            error.name = 'InvalidSignature';
        }
        callback(error, data);
    });
};

exports.WCSubmit = WCSubmit;