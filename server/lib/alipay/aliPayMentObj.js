var AlipayNotify = require('./alipay_notify.class').AlipayNotify;
var AlipaySubmit = require('./alipay_submit.class').AlipaySubmit;
var  assert = require('assert');
var url = require('url');

var DOMParser = require('xmldom').DOMParser;

var default_alipay_config = {
    partner:'' //合作身份者id，以2088开头的16位纯数字
    ,key:''//安全检验码，以数字和字母组成的32位字符
    ,seller_email:'' //卖家支付宝帐户 必填
    ,host:'' //域名
    ,cacert:'cacert.pem'//ca证书路径地址，用于curl中ssl校验 请保证cacert.pem文件在当前文件夹目录中
    ,transport:'' //访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
    ,input_charset:''//字符编码格式 目前支持 gbk 或 utf-8
    ,sign_type:"MD5"//签名方式 不需修改
    ,create_direct_pay_by_user_return_url : '/api/payMent/aliSayHello'
    ,create_direct_pay_by_user_notify_url: '/api/payMent/aliPayNotifyBack'
    ,show_url : 'http://127.0.0.1:3000/api/payMent/aliPayNotifyBack'

//    ,refund_fastpay_by_platform_pwd_notify_url : '/alipay/refund_fastpay_by_platform_pwd/notify_url'
//    ,create_partner_trade_by_buyer_notify_url: '/aplipay/create_partner_trade_by_buyer/notify_url'
//    ,create_partner_trade_by_buyer_return_url: '/aplipay/create_partner_trade_by_buyer/return_url'
//    ,trade_create_by_buyer_return_url : '/alipay/trade_create_by_buyer/return_url'
//    ,trade_create_by_buyer_notify_url: '/alipay/trade_create_by_buyer/notify_url'
};

var Alipay = function(alipay_config){
    var _self = this;
    _self.alipay_config = default_alipay_config;
    for(var key in alipay_config){
        _self.alipay_config[key] = alipay_config[key];
    }

//    partner:'2088611834593015' //合作身份者id，以2088开头的16位纯数字
//        ,key:'2vzizwj3ciydto2tktleqnqkgb0vb1nn'//安全检验码，以数字和字母组成的32位字符
//        ,seller_email:'zfb@bbxvip.com' //卖家支付宝帐户 必填
//        ,host:'http://localhost:3000/'
//        ,cacert:'cacert.pem'//ca证书路径地址，用于curl中ssl校验
//        ,transport:'http' //访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
//        ,input_charset:'utf-8'//字符编码格式 目前支持 gbk 或 utf-8
//    ,sign_type:"MD5"//签名方式 不需修改

}

Alipay.prototype.create_direct_pay_by_user = function(data, res){
    var _self  = this;

    //建立请求
    var alipaySubmit = new AlipaySubmit(_self.alipay_config);

    var parameter = {
//        service : 'alipay.wap.create.direct.pay.by.user'
        service:'alipay.wap.trade.create.direct'
        ,seller_id : _self.alipay_config.partner
        ,partner:_self.alipay_config.partner
        ,payment_type:'1' //支付类型
        ,notify_url: url.resolve(_self.alipay_config.host, _self.alipay_config.create_direct_pay_by_user_notify_url)//服务器异步通知页面路径,必填，不能修改, 需http://格式的完整路径，不能加?id=123这类自定义参数
        ,return_url: url.resolve(_self.alipay_config.host , _self.alipay_config.create_direct_pay_by_user_return_url)//页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，不能写成http://localhost/
        ,seller_email:_self.alipay_config.seller_email //卖家支付宝帐户 必填
        ,_input_charset:_self.alipay_config['input_charset'].toLowerCase().trim()
    };
    for(var key in data){
        parameter[key] = data[key];
    }

    console.log(parameter);

    var html_text = alipaySubmit.buildRequestForm(parameter,"get", "确认");
    console.log(html_text);
    res.body = html_text;
};

Alipay.prototype.sayHello = function(data, callBack){
    console.log("ali--hello");
    callBack({},{a:"hello--ali"});
}

exports.Alipay = Alipay;