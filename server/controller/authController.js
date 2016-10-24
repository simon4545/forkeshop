var express = require('express');
var Sync = require('sync');
var utils = require('../utils');
var AppConfig = require('../config');
var mysqlConn = app.get('MysqlConn');
var common = require('../common');
/**
 * 登录
 * @param req
 * @param res
 */
function login(req, res) {
    mysqlConn.query('select * from bbx_account where AccountName=? and AccountPass=? limit 1', [req.body.username, req.body.password],
        function (err, result) {
            if (utils.isError(err)) {
                return utils.jsonFail(res);
            }
            if (!result.length) {
                return utils.jsonFail(res, {status: 300, msg: '用户名或密码错误'});
            }

            var re = result[0];
            delete re.AccountPass;
            delete re.CreateTime;
            req.session.user = re;
            //app.current() = result[0];
            res.cookie('user', JSON.stringify(result[0]), {maxAge: 900000000, path: '/'});
            res.json({status: 200, data: re.Id});
        });
}


exports.login = login;

