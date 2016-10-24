var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var goodsController = require('../controller/goodsController');

//商品列表页面
router.get('/goods/list', function (req, res) {
    res.render('goods/goods_list', req.session.user);
});

//添加商品页面
router.get('/goods/add', function (req, res) {
    //res.render('goods/goods_add', req.session.user);
    goodsController.addGoodsPage(req, res);
});

//商品管理页面
router.get('/goods/mgr', function (req, res) {
    res.render('goods/goods_mgr', {goodsOption: req.query.goodsOption});
});

//商品类别页面
router.get('/goods/category', function (req, res) {
    res.render('goods/goods_category', req.session.user);
});

//查询所有商品组接口
router.post('/goodsgroup/list', function (req, res) {
    goodsController.getGoodsGroups(req, res);
});

//修改商品组来源
router.post('/goods/changeChannel', function (req, res) {
    goodsController.changeChange(req, res);
});

//查询某一个商品组接口
router.get('/goodsgroup/info/:goodsGroupId', function (req, res) {
    goodsController.getGoodsGroupInfo(req, res);
});

//创建商品组接口
router.post('/goodsgroup/create', function (req, res) {
    goodsController.createGoodsGroup(req, res);
});

//添加商品组修改页面
router.get('/goods/edit', function (req, res) {
    goodsController.getEditGoodsInfo(req, res);
});

//商品组修改接口
router.post('/goodsgroup/edit/:goodsGroupId', function (req, res) {
    goodsController.editGoodsGroup(req, res);
});

//保存并提交审核
router.post('/goodsgroup/saveAndCommit/:goodsGroupId', function (req, res) {
    goodsController.saveAndCommit(req, res);
});

//删除商品组接口
router.post('/goodsgroup/delete/', function (req, res) {
    goodsController.deleteGoodsGroup(req, res);
});

//查询商品分类接口
router.post('/goods/category', function (req, res) {
    goodsController.getGoodsCategory(req, res);
});

//检查商品编码是否重复
router.post('/goods/checkOuteriid', function (req, res) {
    goodsController.checkOuteriid(req, res);
});

//商品组详情展示
router.get('/goods/detail', function (req, res) {
    goodsController.detail(req, res);
});

//商品审核页面
router.get('/goods/verify', function (req, res) {
    goodsController.getVerifyView(req, res);
});

//商品组审核通过
router.post('/goods/checkPass', function (req, res) {
    goodsController.checkPass(req, res);
});

//审核
router.post('/goods/audit/:id', function (req, res) {
    goodsController.audit(req, res);
});

//导入淘宝商品
router.get('/goods/taobaoSKUAPI', function (req, res) {
    goodsController.taobaoSKUAPI(req, res);
});

//商品组编辑库存展示
router.get('/goods/editGoodsCount', function (req, res) {
    goodsController.editGoodsCountView(req, res);
});

//修改库存
router.post('/goods/changeMaxCount', function (req, res) {
    goodsController.changeMaxCount(req, res);
});

//检测商户基本信息是否审核通过请求
router.post('/goods/checkMerchantInfo', function (req, res) {
    goodsController.checkMerchantInfo(req, res);
});

//修改商品售价
router.post('/goods/updateGoodsSalePrice', function (req, res) {
    goodsController.updateGoodsSalePrice(req, res);
});
//重置商品销售状态
router.post('/goodsgroup/resetGoodsSaleState', function (req, res) {
    goodsController.resetGoodsSaleState(req, res);
});
module.exports = router;
