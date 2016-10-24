/**
 * Created by Administrator on 16-1-15.
 */
var md5 = require('md5');
var sha1 = require('sha1');
var underScore = require('underscore');
var request = require('request');
var https = require('https');
var url_mod = require('url');
var xml2js = require('xml2js');

var signTypes = {
    MD5: md5,
    SHA1: sha1
};

function ObjToQueryString (object){
    return Object.keys(object).filter(function (key) {
        return object[key] !== undefined && object[key] !== '';
    }).sort().map(function (key) {
            return key + '=' + object[key];
        }).join('&');
}

exports.generateTimeStamp = function(){
    return parseInt(+new Date() / 1000, 10) + '';
}

exports.generateNonceStr = function(length){
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = chars.length;
    var noceStr = '';
    var i;
    for (i = 0; i < (length || 32); i++) {
        noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return noceStr;
}

exports.getRequiredData = function(params){
    var requiredData = ['body', 'out_trade_no', 'total_fee', 'spbill_create_ip', 'trade_type'];
    if(params.trade_type == 'JSAPI'){
        requiredData.push('openid');
    }else if (params.trade_type == 'NATIVE'){
        requiredData.push('product_id');
    }
    return requiredData ;
}

exports.getSign = function(pkg, signType,pay_key){
    pkg = underScore.clone(pkg);
    delete pkg.sign;
    signType = signType || 'MD5';
    var string1 = ObjToQueryString(pkg);
    var stringSignTemp = string1 + '&key=' + pay_key;
    var signValue = signTypes[signType](stringSignTemp).toUpperCase();
    return signValue;
}

exports.httpsRequest = function(url, data, callback){
    var _self = this;
    var parsed_url = url_mod.parse(url);
    //Caution 这里可能会出问题
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

exports.httpRequest = function(url, data, callback){
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

exports.buildXml = function (obj) {
    var builder = new xml2js.Builder();
    var xml = builder.buildObject({xml:obj});
    return xml;
};

exports.ObjToQueryString = ObjToQueryString;