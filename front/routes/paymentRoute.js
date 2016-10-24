var express = require('express');
var router = express.Router();
var paymentController = require('../controller/paymentController');
var xmlparser = require('express-xml-bodyparser');

// 支付宝支付后端回调
router.post('/alipay/notify_url', function (req, res) {
    paymentController.alipayNotify(req, res);
});
// 支付宝前端回调
router.get('/alipay/return_url', function (req, res) {
    paymentController.alipayReturn(req, res);
});
//微信支付授权跳转
router.get('/h5weixinredirect/', function (req, res) {
    paymentController.h5WeixinRedirect(req, res);
});
//微信支付授权跳转
router.post('/h5weixinredirect/', function (req, res) {
    paymentController.h5WeixinRedirect(req, res);
});

// 微信支付后端回调
router.post('/weixin/notify_url', xmlparser({trim: false, explicitArray: false}), function (req, res) {
    paymentController.weixinNotify(req, res);
});

module.exports = router;