var express = require('express');
var router = express.Router();
var authController = require('../controller/authController');

//不指定地址，则先跳转到登录页面
router.get('/', function (req, res, next) {
    res.redirect('login');
});

//登录页面
router.get('/login', function (req, res) {
    res.render('login');
});


//处理登录请求
router.post('/login', function (req, res) {
    authController.login(req, res);
});

module.exports = router;
