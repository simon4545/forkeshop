var express = require('express');
var router = express.Router();
var userController = require('../controller/userController');

router.post('/sendsms', function (req, res) {
    userController.sendsms(req,res);
});

router.post('/reg', function (req, res) {
    userController.reg(req,res);
});

router.post('/validcode',function(req, res){
    userController.validcode(req,res);
});

router.post('/login/bbx', function (req, res) {
    userController.login(req,res);
});

router.post('/findPassword', function (req, res) {
    userController.findPassword(req,res);
});

router.post('/resetPassword', function (req, res) {
    userController.resetPassword(req,res);
});

router.post('/update', function (req, res) {
    userController.update(req,res);
});

router.post('/info', function (req, res) {
    userController.info(req,res);
});

router.post('/mobileisexist', function (req, res) {
    userController.mobileisexist(req,res);
});

module.exports=router;
