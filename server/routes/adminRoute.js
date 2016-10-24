var express = require('express');
var router = express.Router();
var adminController = require('../controller/adminController');


//登录页面
router.get('/list', function (req, res) {
    res.render('admin/list');
});

router.post('/list', function (req, res) {
    adminController.list(req, res);
});

router.get('/add', function (req, res) {
    res.render('admin/add');
});

router.post('/add', function (req, res) {
    adminController.add(req, res);
});

router.post('/del', function (req, res) {
    adminController.del(req, res);
});

//修改密码页面
router.get('/cpwd', function (req, res) {
    adminController.cpwdView(req, res);
});

//商家修改密码
router.post('/changepwd', function (req, res) {
    adminController.changePwd(req, res);
});

module.exports = router;
