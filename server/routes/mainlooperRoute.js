var express = require('express');
var router = express.Router();
var Sync = require('sync');
var utils = require('../utils');
var mysql_db = global.app.get('MysqlConn');

router.get('/list', function (req, res) {
    Sync(function() {
        var list = mysql_db.query.sync(mysql_db, 'select * from bbx_mainlooperad order by AdSort')[0];
        var data = {
            list : list,
            user: req.cookies.user
        };
        res.render('mainlooper/list', data);
    });
});

router.post('/query', function (req, res) {
    var id = req.body.id;
    Sync(function() {
        var list = mysql_db.query.sync(mysql_db, 'select * from bbx_mainlooperad where Id = ?', [id])[0];
        res.json({code: 200, data: list});
    });
});

router.post('/del', function (req, res) {
    var id = req.body.id;
    Sync(function() {
        var list = mysql_db.query.sync(mysql_db, 'delete from bbx_mainlooperad where Id = ?', [id])[0];
        res.json({code: 200, data: list});
    });
});


router.post('/save', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var appImageUrl = req.body.appImageUrl;
    var redirectUrl = req.body.redirectUrl;
    var adSort = req.body.adSort;
    Sync(function() {
        if(id) {
            mysql_db.query.sync(
                mysql_db,
                'update bbx_mainlooperad set Title = ?, AppImageUrl= ?, RedirectUrl= ?,AdSort = ? where Id = ?',
                [title, appImageUrl, redirectUrl, adSort, id]
            )[0];
        } else {
            mysql_db.query.sync(
                mysql_db,
                'insert into bbx_mainlooperad (Id, Title, AppImageUrl, RedirectUrl, AdSort, CreateTime) values(uuid(),?,?,?,?, now())',
                [title, appImageUrl, redirectUrl, adSort]
            )[0];
        }
        res.json({code: 200, data: ''});
    });
});

module.exports = router;
