/**
 * Created by Administrator on 16-1-15.
 */
/**
 * Created by Administrator on 16-1-11.
 */

var WCSubmit = require("./wechat/wc_submit.class").WCSubmit;

var default_wc_config = {
    token: '',
    appid: '',    //wx开头的公众号Id
    secret: '',
    oauth: '',
    aesKey: "",
    trade_type: "JSAPI",  //交易类型，目前只做JSAPI
    mch_id: "",   //商户Id
    pay_key: "",  //支付密钥
    notify_url: "",
    warning_url: "",
    sslcert_path: "",
    sslkey_path: "",
    ca_path: "",
    curl_timeout: 30,
    oauth_redirect_url: ""   //授权回调
};

var WCPayMentObj = function (config) {
    var _self = this;

    _self.wc_config = default_wc_config;

    for (var key in config) {
        _self.wc_config[key] = config[key];
    }
};

WCPayMentObj.prototype.getOathToken = function (data) {
    var _self = this;
    var wcSubmitIns = new WCSubmit(_self.wc_config);
    return wcSubmitIns.getOathToken(data);
};

WCPayMentObj.prototype.H5Pay = function (code, order, callBack) {
    var _self = this;
    var wcSubmitIns = new WCSubmit(_self.wc_config);
    wcSubmitIns.getOpenId(code, function (openid) {
        /**** 开始预支付  ****/
        var orderParam = {
            body: '百宝香流水号--' + order['OrderCode'],
            out_trade_no: order['OrderCode'],
            total_fee: order['OrderTotalPrice'] * 100,
            spbill_create_ip: '120.26.87.71',
            openid: openid,
            trade_type: 'JSAPI'
        };
        wcSubmitIns.getWCPayRequestParams(orderParam, function (err, payargs) {
            callBack(payargs);
        });
    });
};

WCPayMentObj.prototype.verifyNotify = function (xml, callBack) {
    //xml = { xml:
    //{ appid: 'wx5e18f2fd10c13d50',
    //    bank_type: 'CFT',
    //    cash_fee: '1',
    //    fee_type: 'CNY',
    //    is_subscribe: 'Y',
    //    mch_id: '1233266602',
    //    nonce_str: 'CEd5B5fXKFF4QSUxixCArqM39xWEZPTs',
    //    openid: 'orWgzuNPQc9-TijegV-Npt4rPcwY',
    //    out_trade_no: '201603031433381050',
    //    result_code: 'SUCCESS',
    //    return_code: 'SUCCESS',
    //    sign: 'D655CBB3A78FC9A6EA52B930A3E70E59',
    //    time_end: '20160303143352',
    //    total_fee: '1',
    //    trade_type: 'JSAPI',
    //    transaction_id: '1001760204201603033691840191'
    //}
    //}
    var data = xml.xml;
    var result_code = data.result_code;
    if (result_code == 'SUCCESS') {
        callBack(null, true);
    } else {
        callBack(null, false);
    }
    //var _self = this;
    //var wcSubmitIns = new WCSubmit(_self.wc_config);
    //wcSubmitIns.validate(xml, function (err, data) {
    //    callBack(data);
    //});
};

exports.WCPayMentObj = WCPayMentObj;