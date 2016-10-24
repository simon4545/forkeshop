var express = require('express');
var router = express.Router();

var memberController = require('../controller/memberController');


router.get('/list', function (req, res) {
    res.render('member/list');
});

router.post('/list', function (req, res) {
    memberController.list(req,res);
});

router.get('/detail', function (req, res) {
    memberController.detail(req,res);
});

router.get('/edit', function (req, res) {
    memberController.editView(req,res);
});


router.post('/edit', function (req, res) {
    memberController.edit(req,res);
});

router.get('/cpwd', function (req, res) {
    res.render('member/cpwd');
});


router.post('/cpwd', function (req, res) {
    memberController.cpwd(req,res);
});


module.exports = router;
