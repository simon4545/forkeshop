/**
 * Created by alinger on 2016/10/12.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('./mobile/index');
});

module.exports=router;