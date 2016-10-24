/**
 * Created by Administrator on 2016/1/26.
 */

var express = require('express');
var router = express.Router();

var goodsCtrl = require("../controller/goodsController");

////商品缩略图（商品主页头部轮播大图）
//router.post('/imgList',goodsCtrl.goodsImgList);

////商品详情（商品详情图，商家上传的一堆list）
//router.post('/detail',goodsCtrl.goodsDetail);

//商品信息（属性尺码颜色等）
router.post('/goodsInfo',goodsCtrl.goodsInfo);

//精选
router.post('/goodsSift',goodsCtrl.goodsSift);

//商品详情统一广告
//router.post('/normalAds',goodsCtrl.normalAds);

//商品详情定制广告
//router.post('/specialAds',goodsCtrl.specialAds);

//拉取用户收藏的商品
router.post('/getFavoriteGoods',goodsCtrl.getFavoriteGoods);

//设置用户收藏的商品
router.post('/setFavoriteGoods',goodsCtrl.setFavoriteGoods);

module.exports=router;