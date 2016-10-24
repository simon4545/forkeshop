var express = require('express');
var Sync = require('sync');
var AppConfig = require('../config');
var mysql_db = global.app.get('MysqlConn');
var common = require('../common');

function list(req,res){
    //获取管理员信息
    var inParam = req.body;
    var pageIndex = inParam.pageIndex || 1;
    var pageSize = AppConfig.PAGING_CONFIG.pageSize;
    var startNum =  pageSize* (pageIndex - 1);
    Sync(function(){
        try{
            var selSQL= ` SELECT
                        Id,
                        AccountName,
                        CreateTime,
                        Role,
                        AccountState `;
            var fromSQL = ` FROM
                        bbx_account
                    WHERE
                        Role LIKE '%管理员' `;
            var limitSQL =` LIMIT ?,? `;
            var selCountSQL = ` SELECT COUNT(1) AS cnt `;

            var pageSQL = selSQL+fromSQL+limitSQL;
            var countSQL = selCountSQL+fromSQL;

            var count_result = mysql_db.query.sync(mysql_db,countSQL,[])[0][0].cnt;
            var page_result = mysql_db.query.sync(mysql_db,pageSQL,[startNum,pageSize])[0];

            console.log(count_result);
            console.log(page_result);
            var data={
                CODE:200,
                MSG:'成功',
                DATA:{
                    totalSize:count_result,
                    pageIndex:pageIndex,
                    pageSize:pageSize,
                    data:page_result
                }
            };
            res.json(data);
        }catch (e){
            console.log(e);
            var data={
                CODE:300,
                MSG:'获取数据失败'
            };
            res.json(data);
        }
    });
}

function  add(req,res){
    var inParam=req.body;
    console.log(inParam);

    Sync(function(){
        try{
            //检验用户明是否已存在
            //存在给出提示
            //不存在，添加到数据库

            var userName=inParam.username;
            if(!inParam.newPass&&inParam.newPass==inParam.newPass2){
                throw '两次输入密码不一致或为空';
            }

            var checkSQL = `SELECT COUNT(1) AS cnt FROM bbx_account WHERE AccountName = ? ;`;
            var check_result = mysql_db.query.sync(mysql_db,checkSQL,[userName])[0][0].cnt;
            console.log(check_result);
            if(check_result>0){
                throw '管理员用户已存在';
            }

            var addSQL=`INSERT INTO bbx_account (AccountName,AccountPass,CreateTime,Role,AccountState)  VALUES (?,?,?,?,?) ;`;
            var param=[
                userName,
                inParam.newPass,
                new Date(),
                '管理员',
                1
            ];

            var add_result = mysql_db.query.sync(mysql_db,addSQL,param);
            console.log(add_result);
            if(add_result.affectedRows==0){
                throw '添加管理员失败';
            }

            var data={
                code:200,
                msg:'成功'
            };
            res.json(data);
        }catch (e){
            console.log(e);
            var data={
                code:300,
                msg:e
            };
            res.json(data);
        }
    });
}

function  del(req,res){
    var inParam=req.body;
    var localUser = req.cookies;
    console.log(localUser);
    console.log(inParam);

    Sync(function(){
        try{

            //检验用户明是否存在
            //TODO 判断用户是否有权限删除用户
            //删除用户

            if(!localUser&&!localUser.user&&localUser.user.Id){
                throw '用户未登录，非法操作';
            }

            var id=inParam.id;

            if(id==localUser.user.Id){
                throw '用户不可以删除自己的账户';
            }

            var checkSQL = `SELECT * FROM bbx_account WHERE Id = ? ;`;
            var check_result = mysql_db.query.sync(mysql_db,checkSQL,[id])[0];
            if(check_result.length==0){
                throw '管理员用户不存在';
            }

            var delSQL=`DELETE FROM bbx_account WHERE Id= ? ;`;
            var param=[
                id
            ];

            var del_result = mysql_db.query.sync(mysql_db,delSQL,param);
            if(del_result.affectedRows==0){
                throw '删除管理员失败';
            }

            var data={
                code:200,
                msg:'删除成功'
            };
            res.json(data);
        }catch (e){
            console.log(e);
            var data={
                code:300,
                msg:e
            };
            res.json(data);
        }
    });
}

function cpwdView(req, res) {
    var userId = req.query.id, user;
    if (userId) {
        mysql_db.query(
            'select AccountName from bbx_account where Id=? limit 1',
            [userId], function (err, result) {
                user = result[0];
                if (user) {
                    res.render('admin/cpwd', {account: user});
                } else {
                    res.json({code: 300, err: "查询失败"});
                }
            }
        );
    } else {
        res.render('admin/cpwd', {account: {}});
    }
}

function changePwd(req, res) {
    Sync(function () {
        var inParam = req.body;
        var userId = inParam.sellerId;
        var oldPass = inParam.oldPass;
        var newPass = inParam.newPass;
        var newPass2 = inParam.newPass2;
        var username = inParam.username;

        if (userId) {
            try {

                if (!newPass&&newPass != newPass2) {
                    res.json({code: 301, msg: "密码输入不对"});
                    return;
                }

                var sql = 'select count(1) as ct from bbx_account where Id=? and AccountPass=? and AccountName=?';
                var ct = mysql_db.query.sync(mysql_db, sql, [userId, oldPass, username])[0][0].ct;

                if (ct == 0) {
                    res.json({code: 300, msg: "当前密码错误"});
                    return;
                }

                var sql2 = 'UPDATE bbx_account SET AccountPass=? WHERE Id=? and AccountName=?';
                mysql_db.query.sync(mysql_db, sql2, [newPass, userId, username]);

                res.json({code: 200, msg: "提交成功"});
            } catch (e) {
                console.log(e);
                res.json({code: 302, msg: "服务异常"});
            }
        }
    })
}

exports.list=list;
exports.add=add;
exports.del=del;
exports.cpwdView=cpwdView;
exports.changePwd=changePwd;