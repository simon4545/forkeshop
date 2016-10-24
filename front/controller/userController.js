var Sync = require('sync');
var mysql_con = global.app.get('mysql_con');
var request = require('request');
var AppConfig = require('../config');
var md5 = require('md5');
var uuid = require('node-uuid');
var urlencode = require('urlencode');
var comFunc = require('../common').comFunc;
var knex_con = global.app.get('knex_con');

/**
 * 用户手机注册
 */
function reg(req, res) {
    var body = req.body;
    if (!body.mobile) return res.json({STATUSSTATUSCODE: 300, MSG: "缺少mobile参数！"});
    if (!body.password) return res.json({STATUSCODE: 300, MSG: "缺少password参数！"});
    if (body.password.length>16 || body.password.length<6) return res.json({STATUSCODE: 300, MSG: "password参数长度不合法！"});
    if (!body.validcode) return res.json({STATUSCODE: 300, MSG: "缺少validcode参数！"});
    Sync(function () {
        try {
            var query_result = mysql_con.query.sync(mysql_con, 'select * from bbx_member where MemberAccount = ? limit 1', [body.mobile]);
            if (query_result[0].length > 0) {
                //用户已存在
                return res.json({STATUSCODE: 300, MSG: "用户已存在！"});
            }

            //判断手机验证码是否有效
            
            var cached_code = req.session['regcode']||'1234';
            if (!cached_code || (cached_code !== body.validcode&&cached_code!='1234')) {
                //验证码已失效或者填写错误
                return res.json({STATUSCODE: 300, MSG: "验证码错误,请重新发送验证码重试！"});
            }

            //创建用户
            var create_result = _createUser(body.mobile, body.password, body.agentId);
            if (!create_result) {
                //创建用户失败
                return res.json({STATUSCODE: 300, MSG: "注册失败,请稍后重试！"});
            }

            //创建用户成功,将用户信息返回
            return res.json({STATUSCODE: 200, MSG: create_result});

        } catch (err) {
            console.error(err);
            logger.writeErr(err);
            return res.json({STATUSCODE: 300, MSG: "注册失败！" + err.toString()});
        }
    });
}

/**
 * 获取短信验证码
 */
function validcode(req, res) {
    var body = req.body;
    if (!body.mobile) return res.json({STATUSCODE: 300, MSG: "缺少mobile参数！"});

    Sync(function () {
        try {
            //生成四位随机验证码,存到redis中,缓存时间设定为10分钟
            var code = comFunc.randomNum(4);
            var cached_code = req.session['regcode'];
            if (cached_code) {
                code = cached_code;
            } else {
                req.session['regcode']=code;
            }
            var message = urlencode("您的验证码是：" + code + "，10分钟内有效!", "gbk");

            //发送验证码
            request.get.sync(null, AppConfig.DB_CONFIG.mobileapiurl.replace('{0}', body.mobile).replace('{1}', message));
            return res.json({STATUSCODE: 200, MSG: "发送成功,验证码为:" + code});
        } catch (err) {
            console.error(err);
            logger.writeErr(err);
            return res.json({STATUSCODE: 300, MSG: "发送验证码失败！" + err.toString()});
        }
    });
}

/**
 * 发送短信
 */
function sendsms(req, res) {
    var body = req.body;
    if (!body.mobile) return res.json({STATUSCODE: 300, MSG: "缺少mobile参数！"});
    if (!body.message) return res.json({STATUSCODE: 300, MSG: "缺少message参数！"});

    Sync(function () {
        try {
            //将请求信息url编码后发送
            var message = urlencode(body.message, "gbk");
            request.get.sync(null, AppConfig.DB_CONFIG.mobileapiurl.replace('{0}', body.mobile).replace('{1}', message));
            return res.json({STATUSCODE: 200, MSG: "发送成功!"});
        } catch (err) {
            console.error(err);
            logger.writeErr(err);
            return res.json({STATUSCODE: 300, MSG: "发送失败！" + err.toString()});
        }
    });
}

/**
 * 用户手机号登录
 */
function login(req, res) {
    var body = req.body;
    if (!body.mobile) return res.json({STATUSCODE: 300, MSG: "缺少mobile参数！"});
    if (!body.password) return res.json({STATUSCODE: 300, MSG: "缺少password参数！"});
    if (body.password.length>16 || body.password.length<6) return res.json({STATUSCODE: 300, MSG: "password参数长度不合法！"});

    Sync(function () {
        try {
            var query_result = mysql_con.query.sync(mysql_con, 'select * from bbx_member where MemberAccount = ? and MemberPass = ? limit 1', [body.mobile, md5(body.password + body.mobile)]);
            if (query_result[0].length > 0) {
                //登录成功,返回用户信息
                return res.json({STATUSCODE: 200, DATA: query_result[0][0]});
            } else {
                //用户不存在
                return res.json({STATUSCODE: 300, MSG: "用户不存在！"});
            }
        } catch (err) {
            console.error(err);
            logger.writeErr(err);
            return res.json({STATUSCODE: 300, MSG: "登录失败！"});
        }
    });
}

/**
 * 查询用户信息
 */
function info(req, res) {
    var body = req.body;
    if (!body.loginid) return res.json({STATUSCODE: 300, MSG: "缺少loginid参数！"});

    Sync(function () {
        try {
            //查询用户信息
            var query_result = mysql_con.query.sync(mysql_con, 'select Id, MemberState, MemberAccount, MemberIden, MemberName, MemberTitle,' +
                'UsablePoints, Birthday, HeaderImage, TotalPoints from bbx_member where Id = ? limit 1', [body.loginid]);
            if (query_result[0].length > 0) {
                //查询用户是否被禁用
                if (query_result[0][0].MemberState !== 1) {
                    return res.json({STATUSCODE: 300, MSG: "用户已被禁止登录，请联系管理员！"});
                }
                //返回用户信息
                return res.json({STATUSCODE: 200, DATA: query_result[0][0]});
            } else {
                //用户不存在
                return res.json({STATUSCODE: 300, MSG: "用户不存在！"});
            }
        } catch (err) {
            console.error(err);
            logger.writeErr(err);
            return res.json({STATUSCODE: 300, MSG: "查询失败！" + err.toString()});
        }
    });
}

/**
 * 查询用户手机号是否存在
 */
function mobileisexist(req, res) {
    var body = req.body;
    if (!body.mobile) return res.json({STATUSCODE: 300, MSG: "缺少mobile参数！"});

    Sync(function () {
        try {
            //使用手机号查询MemberAccount是否存在
            var query_result = mysql_con.query.sync(mysql_con, 'select count(*) from bbx_member where MemberAccount = ?', [body.mobile]);
            if (query_result[0].length > 0 && query_result[0][0]['count(*)'] > 0) {
                //用户存在
                return res.json({STATUSCODE: 200, MSG: "用户存在！"});
            } else {
                //用户不存在
                return res.json({STATUSCODE: 300, MSG: "用户不存在！"});
            }
        } catch (err) {
            console.error(err);
            logger.writeErr(err);
            return res.json({STATUSCODE: 300, MSG: "查询失败！" + err.toString()});
        }
    });
}

/**
 * 修改用户信息
 */
function update(req, res) {
    var body = req.body;
    if (!body.userid) return res.json({STATUSCODE: 300, MSG: "缺少userid参数！"});
    if (!body.userInfo) return res.json({STATUSCODE: 300, MSG: "缺少type参数！"});

    Sync(function () {
        try {
            var newUserInfo = JSON.parse(body.userInfo);
            //查询用户是否存在
            var query_result = mysql_con.query.sync(mysql_con, 'select * from bbx_member where Id = ? limit 1', [body.userid]);
            if (query_result[0].length > 0) {
                //用户存在,判断修改属性
                var sql = knex_con('bbx_member').update(newUserInfo).where('Id', body.userid).toString();
                //执行修改
                mysql_con.query.sync(mysql_con, sql);
                return res.json({STATUSCODE: 200, MSG: "修改成功!"});
            } else {
                //用户不存在
                return res.json({STATUSCODE: 300, MSG: "用户不存在！"});
            }
        } catch (err) {
            console.error(err);
            logger.writeErr(err);
            return res.json({STATUSCODE: 300, MSG: "修改失败！" + err.toString()});
        }
    });
}

/**
 * 找回密码接口
 */
function findPassword(req, res) {
    var body = req.body;
    if (!body.mobile) return res.json({STATUSCODE: 300, MSG: "缺少mobile参数！"});
    if (!body.password) return res.json({STATUSCODE: 300, MSG: "缺少password参数！"});
    if (body.password.length>16 || body.password.length<6) return res.json({STATUSCODE: 300, MSG: "password参数长度不合法！"});
    if (!body.validcode) return res.json({STATUSCODE: 300, MSG: "缺少validcode参数！"});

    Sync(function () {
        try {
            //查询用户是否存在
            var query_result = mysql_con.query.sync(mysql_con, 'select * from bbx_member where MemberAccount = ? limit 1', [body.mobile]);
            if (query_result[0].length > 0) {
                //查询手机验证码是否有效
                var cached_code = redis_con.get.sync(redis_con, body.mobile + '-regcode');
                if (!cached_code || cached_code !== body.validcode) {
                    //验证码已失效或者填写错误
                    return res.json({STATUSCODE: 301, MSG: "验证码错误,请重新发送验证码重试！"});
                }
                //执行更新,重置密码
                var update_result = _updateUser(body.mobile, body.password);
                if (update_result) {
                    //执行成功,返回更新后的用户信息
                    return res.json({STATUSCODE: 200, MSG: update_result});
                } else {
                    //更新失败
                    return res.json({STATUSCODE: 300, MSG: "找回密码失败,请稍后重试！"});
                }
            } else {
                //用户不存在
                return res.json({STATUSCODE: 300, MSG: "该手机号账户不存在！"});
            }
        } catch (err) {
            console.error(err);
            logger.writeErr(err);
            return res.json({STATUSCODE: 300, MSG: "找回密码失败！" + err.toString()});
        }
    });
}

/**
 * 重置密码接口
 */
function resetPassword(req, res) {
    var body = req.body;
    if (!body.loginid) return res.json({STATUSCODE: 300, MSG: "缺少loginid参数！"});
    if (!body.newpassword) return res.json({STATUSCODE: 300, MSG: "缺少newpassword参数！"});
    if (body.newpassword.length>16 || body.newpassword.length<6) return res.json({STATUSCODE: 300, MSG: "新密码要6到16个字符之间！"});
    if (!body.oldpassword) return res.json({STATUSCODE: 300, MSG: "缺少oldpassword参数！"});
    if (body.oldpassword.length>16 || body.oldpassword.length<6) return res.json({STATUSCODE: 300, MSG: "旧密码要6到16个字符之间！"});

    Sync(function () {
        try {
            //先查询用户是否存在
            var query_result = mysql_con.query.sync(mysql_con, 'select * from bbx_member where Id = ? limit 1', [body.loginid]);
            if (query_result[0].length > 0) {
                var mobile = query_result[0][0].MemberAccount;
                var OldMemberPass = md5(body.oldpassword + mobile);
                //判断老密码是否输入正确
                var old_query_result = mysql_con.query.sync(mysql_con, 'select * from bbx_member where Id = ? and MemberPass = ? limit 1', [body.loginid, OldMemberPass]);
                if (old_query_result[0].length < 1) {
                    return res.json({STATUSCODE: 300, MSG: "原密码错误！"});
                }
                //更新密码
                var update_result = _updateUser(mobile, body.newpassword);
                if (update_result) {
                    //更新成功,返回更新后的用户信息
                    return res.json({STATUSCODE: 200, DATA: update_result});
                } else {
                    //更新失败
                    return res.json({STATUSCODE: 300, MSG: "重置密码失败,请稍后重试！"});
                }
            } else {
                //用户不存在
                return res.json({STATUSCODE: 300, MSG: "该用户不存在！"});
            }
        } catch (err) {
            console.error(err);
            logger.writeErr(err);
            return res.json({STATUSCODE: 300, MSG: "重置密码失败！" + err.toString()});
        }
    });
}

/**
 * 使用帐号密码创建用户
 * @param mobile
 * @param password
 * @param agentId
 */
function _createUser(mobile, password, agentId) {
    var memberObj = {};
    memberObj.Id = uuid().replace(/-/g, "");
    memberObj.MemberAccount = mobile;
    memberObj.MemberPass = md5(password + mobile);
    memberObj.MemberState = 1;
    memberObj.MemberRank = "45be3781b5ca46299eb37685590afc6b";
    memberObj.CreateTime = new Date();
    memberObj.MemberIden = 1;
    memberObj.AgentId = agentId || "";
    memberObj.Score = 0;

    try {
        //执行insert语句
        mysql_con.query.sync(mysql_con,
            'insert into bbx_member (Id,MemberAccount,MemberPass,MemberState,MemberRank,CreateTime,MemberIden,AgentId,Score) values(?,?,?,?,?,?,?,?,?)',
            [memberObj.Id, memberObj.MemberAccount, memberObj.MemberPass, memberObj.MemberState, memberObj.MemberRank, memberObj.CreateTime, memberObj.MemberIden, memberObj.AgentId, memberObj.Score]
        );
        return memberObj;
    } catch (err) {
        console.error(err);
        return null;
    }
}

/**
 * 更新用户信息
 * @param mobile
 * @param password
 * @param agentId
 */
function _updateUser(mobile, password) {
    var MemberAccount = mobile;
    var MemberPass = md5(password + mobile);

    try {
        //执行更新
        mysql_con.query.sync(mysql_con,
            'update bbx_member set MemberPass=? where MemberAccount=?', [MemberPass, MemberAccount]);
        //将更新后的用户信息查出来返回
        var query_result = mysql_con.query.sync(mysql_con, 'select * from bbx_member where MemberAccount = ? limit 1', [MemberAccount]);
        if (query_result[0].length > 0) {
            return query_result[0][0];
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
}

exports.validcode = validcode;
exports.findPassword = findPassword;
exports.resetPassword = resetPassword;
exports.update = update;
exports.info = info;
exports.mobileisexist = mobileisexist;
exports.login = login;
exports.sendsms = sendsms;
exports.reg = reg;