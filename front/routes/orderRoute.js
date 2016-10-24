var express = require('express');
var router = express.Router();
var orderController = require('../controller/orderController');
var goodsCartController = require('../controller/goodsCartController');

// 购物车相关
router.post('/cart/del', function (req, res) {
    goodsCartController.delGoods(req, res);
});
router.post('/cart/change_cart', function (req, res) {
    goodsCartController.changeCart(req, res);
});
router.post('/cart/list', function (req, res) {
    goodsCartController.goodsList(req, res);
});
router.post('/cart/clear', function (req, res) {
    goodsCartController.clearGoods(req, res);
});

// 订单相关
router.post('/list', function (req, res) {
    orderController.orderList(req, res);
});
router.post('/cancel', function (req, res) {
    orderController.cancelOrder(req, res);
});
router.post('/del', function (req, res) {
    orderController.deleteOrder(req, res);
});
router.post('/confirm', function (req, res) {
    orderController.confirmOrder(req, res);
});
router.post('/detail', function (req, res) {
    orderController.orderDetail(req, res);
});
router.post('/coupon', function (req, res) {
    orderController.couponAvailable(req, res);
});
router.post('/commit', function (req, res) {
    orderController.commitOrder(req, res);
});
router.post('/gopay', function (req, res) {
    orderController.h5GoPay(req, res);
});
router.post('/appgopay', function (req, res) {
    orderController.appGoPay(req, res);
});
router.post('/consignee', function (req, res) {
    orderController.orderConsignee(req, res);
});
router.post('/express', function (req, res) {
    orderController.orderExpressInfo(req, res);
});
router.post('/refund', function (req, res) {
    orderController.refundOrder(req, res);
});
module.exports = router;