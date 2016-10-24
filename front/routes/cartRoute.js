/**
 * Created by Administrator on 2016/2/23.
 */
var express = require('express');
var router = express.Router();

var cartCtrl = require("../controller/goodsCartController");

router.post('/cartList',cartCtrl.goodsList);

router.post('/delGoods',cartCtrl.delGoods);

router.post('/change_cart', cartCtrl.changeCart);
router.post('/cart/clear', cartCtrl.clearGoods);


module.exports = router;