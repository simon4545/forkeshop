/**
 * Created by Administrator on 16-1-15.
 */
var sub = require('./alipay/alipay_submit.class');
var WCPay = require("./wcPayMentObj").WCPayMentObj;
var AliPay = require("./aliPayMentObj").Alipay;

var AliConfig = {
    partner: '2088611834593015' //合作身份者id，以2088开头的16位纯数字
    , key: '2vzizwj3ciydto2tktleqnqkgb0vb1nn'//安全检验码，以数字和字母组成的32位字符
    , seller_email: 'zfb@bbxvip.com' //卖家支付宝帐户 必填
    , account_name: "" //卖家实名认证信息
    , host: 'http://121.201.29.126:3000/'
    , cacert: __dirname + '/alipay/cacert.pem'//ca证书路径地址，用于curl中ssl校验
    , transport: 'http' //访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
    , input_charset: 'utf-8'//字符编码格式 目前支持 gbk 或 utf-8
    , sign_type: "MD5"//签名方式 不需修改
    , create_direct_pay_by_user_return_url: ''
    , create_direct_pay_by_user_notify_url: ''
    , batch_pay_to_user_return_url: ""
    , batch_pay_to_user_notify_url: ""
};

var wcConfig = {
    token: 'bbxvip',
    appid: 'wx5e18f2fd10c13d50',
    secret: '38374eea59b92433abc01ddea17b424f ',
    oauth: 'weixin',
    aesKey: "c8RIY0a0JLUySWYJgT0H6pRw82Oz8V2AwiDdv7S0Evm",
    trade_type: "JSAPI",
    mch_id: "1233266602",
    pay_key: "547fee427595ef5f690c6c91d69b95a2",
    notify_url: "http://m.bbxvip.com/api/v3/payment/weixin/notify_url",  //收款回告地址
    warning_url: "",
    sslcert_path: "",
    sslkey_path: "",
    ca_path: "",
    curl_timeout: 30,
    oauth_redirect_url: "http://m.bbxvip.com/api/v3/payment/h5weixinredirect/"  //授权回调地址
};

var payFactory = {
    //阿里支付实例
    aliPayIns: new AliPay(AliConfig),
    //微信支付实例
    wcPayIns: new WCPay(wcConfig)
};

//PC端支付宝订单支付，用户付款
payFactory.PCAliPay = function(order,res){
    var ali_params = {};
    ali_params.payment_type = "1";
    //服务器异步通知页面路径 //"http://商户网关地址/batch_trans_notify-PHP-UTF-8/notify_url.php";
    ali_params.notify_url = 'http://m.bbxvip.com/api/v3/payment/alipay/notify_url';
    //页面跳转同步通知页面路径
    ali_params.return_url = 'http://m.bbxvip.com/api/v3/payment/alipay/return_url';

    //商户订单号  /年月日时分秒毫秒
    //必填，格式：当天日期[8位]+序列号[3至16位]，如：201008010000001
    ali_params.out_trade_no = order.out_trade_no;

    //订单名称
    ali_params.subject = order.subject;
    //付款金额
    ali_params.total_fee = order.total_fee;
    //订单描述
    ali_params.body = order.subject;
    ali_params.show_url = '';

    ali_params.service = 'create_direct_pay_by_user';
    ali_params.partner = AliConfig.partner;
    ali_params._input_charset = AliConfig.input_charset;
    ali_params.sign_type = "MD5";
    ali_params.seller_email = AliConfig.seller_email;

    var submitObj = new sub.AlipaySubmit(AliConfig);
    var sHtmlText = submitObj.buildRequestForm(ali_params, "get", "提交");
    return sHtmlText;
};

//收钱，用户付款
payFactory.receiveMoney = function (orderData, method, res, orderFrom) {
    orderFrom = orderFrom || 'mobile';
    var _self = this;
    //orderData = {
    //    out_trade_no: "201601251205555666",
    //    subject: '订单号-test',
    //    total_fee: 0.01
    //}
    if (method === "ali") {
        var html = '';
        if (orderFrom === 'mobile') {
            html = _self.aliPayIns.createDirectPayByUser(orderData);
        } else  {
            html = _self.PCAliPay(orderData);
        }
        res.status(200);
        return res.send(html);
    } else if (method === "wc") {
        var url = _self.wcPayIns.getOathToken(orderData.out_trade_no);
        //重定向到授权页面
        return res.redirect(url);
    }
};

// 验证支付后端回调的合法性
payFactory.verifyNotify = function (data, method, callback) {
    var _self = this;
    if (method === "ali") {
        _self.aliPayIns.verifyNotify(data, function (data) {
            callback(data);
        });
    } else if (method === "wc") {
        _self.wcPayIns.verifyNotify(data, function (err, data) {
            callback(err, data);
        });
    }
};


//微信授权回调页面
payFactory.wcPayOauthBack = function (code, order, res) {
    var _self = this;
    _self.wcPayIns.H5Pay(code, order, function (data) {
        var dataStr = JSON.stringify(data);
        var payHtml = `
                <meta http-equiv='content-type' content='text/html; charset=utf-8'>
                <script>

                function jsApiCall() {
                    var data = window._data;
                    if (!data)return false;
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',
                        data,
                        function (res) {
                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                            location.href = 'http://m.bbxvip.com/weixin';
                        } else {
                            //到订单列表
                            alert('订单支付失败-1!');
                            alert(JSON.stringify(res));
                        location.href = 'http://m.bbxvip.com/weixin';
                        }
                    });
                }
                function callpay() {
                    if (typeof WeixinJSBridge == "undefined") {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                            document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
                        }
                    } else {
                        jsApiCall();
                    }
                }
                try {
                    window._data = ${dataStr};
                    callpay();
                } catch (ex) {
                    //到订单列表
                    alert('订单支付失败-2');
                    location.href = 'http://m.bbxvip.com/weixin';
                }
</script>`;
        res.send(payHtml);
    });
};

exports.payFactory = payFactory;
