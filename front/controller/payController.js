var mysql_con = global.app.get('mysql_con');
var payFactory = require("../lib/payFactory").payFactory;

//PC端支付宝订单支付，用户付款
function PCAliPay(req,res){
    try {
        var order = JSON.parse(req.query.order);
        payFactory.PCAliPay(order,res);
    } catch (e) {
        console.error(e);
    }
}
function PCAliPay_notify_url(req,res){
    res.send("这里需要跳转到订单列表页面...");
}

function PCAliPay_return_url(req,res){
    res.send("这里需要跳转到订单列表页面...");
}

//手机端,支付宝收钱
function recieveMenoy(req,res){
    var q = req.query;
    var method = q.method,order = q.order;
    payFactory.receiveMoney(order,method,res);
}

//ali 收钱回告
function RMNotifyAli(req,res){
}

//ali 收钱返回
function RMReturnAli(req,res){
}

//微信的H5支付授权token回调页面
function H5PayWC(req,res){
    var code = req.query.code,orderId = req.query.state;
    payFactory.wcPayOauthBack(code,orderId,res);
}

//wechat 收钱回告
function RMNotifyWC(req,res){
}

//wechat 收钱返回
function RMReturnWC(req,res){
}

exports.PCAliPay = PCAliPay;
exports.PCAliPay_notify_url = PCAliPay_notify_url;
exports.PCAliPay_return_url = PCAliPay_return_url;
exports.recieveMenoy = recieveMenoy;
exports.RMNotifyAli = RMNotifyAli;
exports.RMReturnAli = RMReturnAli;
exports.RMNotifyWC = RMNotifyWC;
exports.RMReturnWC = RMReturnWC;
exports.H5PayWC = H5PayWC;