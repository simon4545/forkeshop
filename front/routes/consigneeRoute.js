var express = require('express');
var router = express.Router();
var consigneeController = require('../controller/consigneeController');

router.post('/list', function (req, res) {
    consigneeController.list(req,res);
});

router.post('/add',function(req, res){
    consigneeController.add(req,res);
});

router.post('/update', function (req, res) {
    consigneeController.update(req,res);
});

router.post('/del', function (req, res) {
    consigneeController.del(req,res);
});

module.exports=router;
