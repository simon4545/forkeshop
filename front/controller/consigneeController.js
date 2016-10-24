var Sync = require('sync');
var mysql_con = global.app.get('mysql_con');
var logger = require("../logHelper").helper;
var uuid = require('node-uuid');

/**
 * 根据memberId获取收货地址
 */
function list(req,res){
    var body = req.body;
    if (!body.loginid) return res.json({STATUSCODE:300,MSG: "缺少loginid参数！"});
    Sync(function(){
        try{
            var query_result = mysql_con.query.sync(mysql_con,'select * from bbx_consignee where MemberId = ? order by IsDefault desc', [body.loginid]);
            //console.log(query_result[0]);
            return res.json({STATUSCODE:200,DATA: query_result[0]});
        }catch (err){
            console.error(err);
            logger.writeErr(err);
            return res.json({STATUSCODE:300,MSG: "查询失败,请稍后重试！"+err.toString()});
        }
    });
}

/**
 * 添加收货地址
 */
function add(req,res){
    var body = req.body;
    if (!body.loginid) return res.json({STATUSCODE:300,MSG: "缺少loginid参数！"});
    if (!body.consigneename) return res.json({STATUSCODE:300,MSG: "缺少consigneename参数！"});
    if (!body.consigneemobile) return res.json({STATUSCODE:300,MSG: "缺少consigneemobile参数！"});
    if (!body.province) return res.json({STATUSCODE:300,MSG: "缺少province参数！"});
    if (!body.city) return res.json({STATUSCODE:300,MSG: "缺少city参数！"});
    if (!body.county) return res.json({STATUSCODE:300,MSG: "缺少county参数！"});
    if (!body.address) return res.json({STATUSCODE:300,MSG: "缺少address参数！"});
    if (!body.isdefault) return res.json({STATUSCODE:300,MSG: "缺少isdefault参数！"});

    var consigneeObj={};
    consigneeObj.Id = uuid().replace(/-/g,"");
    consigneeObj.MemberId = body.loginid;
    consigneeObj.ConsigneeName = body.consigneename;
    consigneeObj.ConsigneeMobile = body.consigneemobile;
    consigneeObj.Province = body.province;
    consigneeObj.City = body.city;
    consigneeObj.County = body.county;
    consigneeObj.Address = body.address;
    consigneeObj.IsDefault = parseInt(body.isdefault);
    consigneeObj.CreateTime = new Date();

    Sync(function(){
        mysql_con.beginTransaction.sync(mysql_con);
        try{
            //如果设定当前地址为默认地址,则需要把其他的默认地址标记去掉
            if(parseInt(body.isdefault) == 1){
                mysql_con.query.sync(mysql_con,'update bbx_consignee set IsDefault=0 where MemberId=? and IsDefault=1', [body.loginid]);
            }
            mysql_con.query.sync(mysql_con,
                'insert into bbx_consignee (Id,MemberId,ConsigneeName,ConsigneeMobile,Province,City,County,Address,IsDefault,CreateTime) values(?,?,?,?,?,?,?,?,?,?)',
                [consigneeObj.Id,consigneeObj.MemberId,consigneeObj.ConsigneeName,consigneeObj.ConsigneeMobile,consigneeObj.Province,consigneeObj.City,consigneeObj.County,consigneeObj.Address,consigneeObj.IsDefault,consigneeObj.CreateTime]
            );
            //事务提交
            mysql_con.commit.sync(mysql_con);
            return res.json({STATUSCODE:200,DATA: consigneeObj});
        }catch (err){
            console.error(err);
            logger.writeErr(err);
            mysql_con.rollback.sync(mysql_con);
            return res.json({STATUSCODE:300,MSG: "添加失败,请稍后重试！"+err.toString()});
        }
    });
}

/**
 * 更新收货地址
 */
function update(req,res){
    var body = req.body;
    if (!body.loginid) return res.json({STATUSCODE:300,MSG: "缺少loginid参数！"});
    if (!body.consigneeid) return res.json({STATUSCODE:300,MSG: "缺少consigneeid参数！"});
    if (!body.consigneename) return res.json({STATUSCODE:300,MSG: "缺少consigneename参数！"});
    if (!body.consigneemobile) return res.json({STATUSCODE:300,MSG: "缺少consigneemobile参数！"});
    if (!body.province) return res.json({STATUSCODE:300,MSG: "缺少province参数！"});
    if (!body.city) return res.json({STATUSCODE:300,MSG: "缺少city参数！"});
    if (!body.county) return res.json({STATUSCODE:300,MSG: "缺少county参数！"});
    if (!body.address) return res.json({STATUSCODE:300,MSG: "缺少address参数！"});
    if (!body.isdefault) return res.json({STATUSCODE:300,MSG: "缺少isdefault参数！"});

    Sync(function(){
        mysql_con.beginTransaction.sync(mysql_con);
        try {
            //如果设定当前地址为默认地址,则需要把其他的默认地址标记去掉
            if(parseInt(body.isdefault) == 1){
                mysql_con.query.sync(mysql_con,'update bbx_consignee set IsDefault=0 where MemberId=? and IsDefault=1', [body.loginid]);
            }
            //查询地址是否存在
            var query_result = mysql_con.query.sync(mysql_con,'select * from bbx_consignee where Id=?', [body.consigneeid]);
            if(query_result[0].length<1){
                return res.json({STATUSCODE:300,MSG: "要修改的地址id不存在！"});
            }
            //更新地址
            mysql_con.query.sync(mysql_con,'update bbx_consignee set ConsigneeName=?,ConsigneeMobile=?,Province=?,City=?,County=?,Address=?,IsDefault=? where Id=? ',
                [body.consigneename,body.consigneemobile,body.province,body.city,body.county,body.address,body.isdefault,body.consigneeid]);
            //把更新后的地址再查出来,返回
            var update_result = mysql_con.query.sync(mysql_con,'select * from bbx_consignee where Id=?', [body.consigneeid]);
            if(update_result[0].length<1){
                return res.json({STATUSCODE:300,MSG: "更新地址失败！"});
            }
            //事务提交
            mysql_con.commit.sync(mysql_con);
            return res.json({STATUSCODE:200,DATA: update_result[0][0]});
        }catch (err){
            console.error(err);
            logger.writeErr(err);
            mysql_con.rollback.sync(mysql_con);
            return res.json({STATUSCODE:300,MSG: "登录失败！"});
        }
    });
}

/**
 * 删除收货地址
 */
function del(req,res){
    var body = req.body;
    if (!body.consigneeid) return res.json({STATUSCODE:300,MSG: "缺少consigneeid参数！"});

    Sync(function(){
        try{
            //先查地址是否存在
            var query_result = mysql_con.query.sync(mysql_con,'select * from bbx_consignee where Id = ?', [body.consigneeid]);
            if(query_result[0].length<1){
                return res.json({STATUSCODE:300,MSG: "要删除的地址id不存在！"});
            }
            //执行删除操作
            mysql_con.query.sync(mysql_con,'delete from bbx_consignee where Id = ?', [body.consigneeid]);
            return res.json({STATUSCODE:200,DATA: "删除成功!"});
        }catch (err){
            console.error(err);
            logger.writeErr(err);
            return res.json({STATUSCODE:300,MSG: "查询失败,请稍后重试！"+err.toString()});
        }
    });
}

exports.list = list;
exports.add = add;
exports.update = update;
exports.del = del;