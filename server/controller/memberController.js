var express = require('express');
var Sync = require('sync');
var AppConfig = require('../config');
var mysql_db = global.app.get('MysqlConn');
var common = require('../common');
var md5 = require('md5');

function list(req,res){
    Sync(function () {
        var keyword = req.body.keyword || '';
        var page = req.body.page || 1;

        var memberNum = mysql_db.query.sync(
            mysql_db,
            "select count(1) as _c from bbx_member where MemberAccount like '%" + keyword + "%'"
        )[0][0];

        var members = mysql_db.query.sync(
            mysql_db,
            "select * from bbx_member where MemberAccount like '%" + keyword + "%' order by CreateTime desc limit ?,?",
            [(page - 1) * AppConfig.PAGING_CONFIG.pageSize, AppConfig.PAGING_CONFIG.pageSize]
        )[0];

        var data = {total: memberNum['_c'], members: members};
        res.json({code: 200, data: data});
    });
}


function  detail(req,res){
    var userId = req.query.userId;

    Sync(function () {
        //获取用户详情
        try {
            var selSQL = `SELECT * FROM bbx_member WHERE Id=? ;`;
            var user_result = mysql_db.query.sync(mysql_db,selSQL,[userId])[0][0];
            res.render('member/detail', user_result);
        } catch (e) {
            console.log(e);
            res.render('member/detail', {});
        }
    });
}

function  editView(req,res){
    var userId = req.query.userId;

    Sync(function () {
        //获取用户详情
        try {
            var selSQL = `SELECT * FROM bbx_member WHERE Id=? ;`;
            var user_result = mysql_db.query.sync(mysql_db,selSQL,[userId])[0][0];
            res.render('member/edit', user_result);
        } catch (e) {
            console.log(e);
            res.render('member/edit', {});
        }
    });
}

function  edit(req,res){
    var user = req.body;
    Sync(function () {
        //获取用户详情
        try {
            if(!user||!user.memberId){
                throw '主要信息缺失';
            }

            var upSQL = `UPDATE bbx_member SET MemberAccount=?,MemberState=?,MemberIden=?,MemberName=?   WHERE Id=? ;`;
            var param=[
                user.memberAccount,
                user.memberState,
                user.memberIden,
                user.memberName,
                user.memberId
            ];
            var up_result = mysql_db.query.sync(mysql_db,upSQL,param);
            if(up_result.affectedRows==0){
                throw '更新失败';
            }

            console.log(up_result);
            var data={
                code:200,
                msg:'更新成功'
            };
            res.json(data);
        } catch (e) {
            console.log(e);
            var data={
                code:300,
                msg:e
            };
            res.json(data);
        }
    });
}


function  cpwd(req,res){
    var user = req.body;
    Sync(function () {
        //获取用户详情
        try {
            if(!user||!user.memberId||!user.newPass){
                throw '主要信息缺失';
            }

            var selSQL = ` SELECT * FROM bbx_member WHERE Id=? LIMIT 1;`;
            var selParam = [
                user.memberId
            ];

            var sel_result = mysql_db.query.sync(mysql_db,selSQL,selParam)[0];
            if(sel_result.length==0){
                throw '用户不存在';
            }

            var newPassword=md5(user.newPass+sel_result[0].MemberAccount);

            var upSQL = `UPDATE bbx_member SET MemberPass=? WHERE Id=? ;`;
            var param=[
                newPassword,
                user.memberId
            ];
            var up_result = mysql_db.query.sync(mysql_db,upSQL,param);
            if(up_result.affectedRows==0){
                throw '更新失败';
            }

            console.log(up_result);
            var data={
                code:200,
                msg:'更新成功'
            };
            res.json(data);
        } catch (e) {
            console.log(e);
            var data={
                code:300,
                msg:e
            };
            res.json(data);
        }
    });
}

exports.list=list;
exports.detail=detail;
exports.editView=editView;
exports.edit=edit;
exports.cpwd=cpwd;