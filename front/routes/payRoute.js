/**
 * Created by Administrator on 2016/1/25.
 */
var express = require('express');
var router = express.Router();

var payCtrl = require("../controller/payController");

//localhost:3002/api/v3/pay/PCAliPay?order={"subject":"百宝香订单","orderId":"15415641566","totalPrice":0.01}

//PC端支付宝订单支付
router.get('/PCAliPay',payCtrl.PCAliPay);
router.get('/PCAliPay/notify_url',payCtrl.PCAliPay_notify_url);
router.get('/PCAliPay/return_url',payCtrl.PCAliPay_return_url);



//收钱 -- web版的支付
router.get('/recieveMenoy',payCtrl.recieveMenoy);

//ali支付回告通知页面
router.post('/RMNotifyAli',payCtrl.RMNotifyAli);
router.post('/RMReturnAli',payCtrl.RMReturnAli);

//wechat支付
router.get("/H5PayWC",payCtrl.H5PayWC);

//wechat支付回告通知页面
router.post('/RMNotifyWC',payCtrl.RMNotifyWC);
router.post('/RMReturnWC',payCtrl.RMReturnWC);

module.exports=router;