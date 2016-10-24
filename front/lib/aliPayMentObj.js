var AlipayNotify = require('./alipay/alipay_notify.class').AlipayNotify;
var AlipaySubmit = require('./alipay//alipay_submit.class').AlipaySubmit;

var assert = require('assert');
var url = require('url');
var DOMParser = require('xmldom').DOMParser;

var default_alipay_config = {
    partner: '' //合作身份者id，以2088开头的16位纯数字
    , key: ''//安全检验码，以数字和字母组成的32位字符
    , seller_email: '' //卖家支付宝帐户 必填
    , account_name: "" //卖家实名认证信息
    , host: '' //域名
    , cacert: 'cacert.pem'//ca证书路径地址，用于curl中ssl校验 请保证cacert.pem文件在当前文件夹目录中
    , transport: '' //访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
    , input_charset: ''//字符编码格式 目前支持 gbk 或 utf-8
    , sign_type: "MD5"//签名方式 不需修改
    , create_direct_pay_by_user_return_url: ''
    , create_direct_pay_by_user_notify_url: ''
    , batch_pay_to_user_return_url: ""
    , batch_pay_to_user_notify_url: ""
};

var Alipay = function (alipay_config) {
    var _self = this;
    _self.alipay_config = default_alipay_config;
    for (var key in alipay_config) {
        _self.alipay_config[key] = alipay_config[key];
    }
};

Alipay.prototype.createDirectPayByUser = function (data) {
    var _self = this;

    //建立请求
    var alipaySubmit = new AlipaySubmit(_self.alipay_config);

    //还需要 out_trade_no subject total_fee
    var parameter = {
        service: 'alipay.wap.create.direct.pay.by.user'
        , partner: _self.alipay_config.partner
        , _input_charset: _self.alipay_config.input_charset
        , sign_type: "MD5"//签名方式 不需修改
        , notify_url: url.resolve(_self.alipay_config.host, _self.alipay_config.create_direct_pay_by_user_notify_url)
        , return_url: url.resolve(_self.alipay_config.host, _self.alipay_config.create_direct_pay_by_user_return_url)
        , seller_id: _self.alipay_config.partner
        , payment_type: '1' //支付类型
    };

    for (var key in data) {
        parameter[key] = data[key];
    }

    var html_text = alipaySubmit.buildRequestForm(parameter, "get", "确认");
    return html_text;
};

Alipay.prototype.batchPayToUsers = function (data) {
    var _self = this;
    //建立请求
    var alipaySubmit = new AlipaySubmit(_self.alipay_config);

    //还差  detail_data，batch_no,batch_num,batch_fee,extend_param
    var parameter = {
        service: 'batch_trans_notify',
        partner: _self.alipay_config.partner,
        _input_charset: "utf-8",
        sign_type: "MD5",
        account_name: _self.alipay_config.account_name,
        Email: _self.alipay_config.seller_email,
        notify_url: url.resolve(_self.alipay_config.host, _self.alipay_config.batch_pay_to_user_notify_url),
        return_url: url.resolve(_self.alipay_config.host, _self.alipay_config.batch_pay_to_user_return_url)
    };

    for (var key in data) {
        parameter[key] = data[key];
    }

    var html_text = alipaySubmit.buildRequestForm(parameter, "get", "确认");
    return html_text;
};

Alipay.prototype.verifyNotify = function (POST, callback) {
    var _self = this;
    var alipayNotify  = new AlipayNotify(_self.alipay_config);
    alipayNotify.verifyNotify(POST, function (data) {
        callback(data);
    });
};

exports.Alipay = Alipay;