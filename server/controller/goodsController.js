var express = require('express');
var Sync = require('sync');
var utils = require('../utils');
var uuid = require('node-uuid');
var fs = require('fs');
var AppConfig = require('../config');
var mysql_db = global.app.get('MysqlConn');
var request = require('request');
var taffy = require('../lib/taffy-min');

/**
 * 获取商品分类
 * @param req
 * @param res
 */
function getGoodsCategory(req, res) {

    Sync(function () {
        try {
            var sql;
            sql = 'SELECT * from bbx_goodscategory  where CategoryTree like "%1800%" ORDER BY CategorySort ASC';
            var result = mysql_db.query.sync(mysql_db, sql)[0];
            var list = [], temp;
            for (var i = 0; i < result.length; i++) {
                temp = result[i];
                if (i != 0) {
                    list.push({
                        Id: temp.Id,
                        categoryName: temp.CategoryTitle,
                        parentId: temp.CategoryPid
                    });
                } else {
                    list.push({
                        Id: temp.Id,
                        categoryName: temp.CategoryTitle
                    });
                }

            }
            res.json({"code": 200, "data": list});
        } catch (e) {
            console.log(e);
            res.json({"code": 300, "data": "error"});
        }
    });
}

/**
 * 获取商品组列表信息
 * @param req
 * @param res
 */
function getGoodsGroups(req, res) {
    Sync(function () {
        try {
            var sql;
            var skipNum = parseInt(req.body.pageIndex) - 1 || 0;
            var pageSize = req.body.pageSize || 100;
            skipNum = skipNum * pageSize;
            var where = "where 1 = 1 ";


            if (req.body.queryKeyStr) {
                where = where + ' and (GoodsGroupTitle like "%' + req.body.queryKeyStr + '%" or Outeriid like "%' + req.body.queryKeyStr + '%") ';
            }
            if (req.body.saleState && req.body.saleState != '-1') {
                switch (req.body.saleState) {
                    case '0':
                        where += ' and GoodsSaleState=0 ';
                        break;
                    case '1':
                        where += ' and GoodsSaleState=1 ';
                        break;
                }
            }

            sql = 'SELECT Id,GoodsGroupTitle,GoodsSaleState,GoodsImgPath,State,CreateTime ' +
                ' FROM  bbx_view_goodsgroup_list A  '
                + where + '  ORDER BY UpdateTime desc limit ' + skipNum + ',' + pageSize;
            var result = mysql_db.query.sync(mysql_db, sql)[0];

            var sql2 = 'SELECT  count(1) AS count FROM  bbx_view_goodsgroup_list A ' + where;
            var result2 = mysql_db.query.sync(mysql_db, sql2)[0];

            var list = [], temp;
            var img = 'http://img3.baa.bitautotech.com/img/V2img4.baa.bitautotech.com/space/2011/03/03/929e1913-2453-45f1-852f-f2204f2105b3_735_0_max_jpg.jpg';
            for (var i = 0; i < result.length; i++) {
                temp = result[i];

                list.push({
                    Id: temp.Id,
                    ActionId: temp.ActionId,
                    ActionTitle: temp.ActionTitle,
                    goodsGroupTitle: temp.GoodsGroupTitle,
                    GoodsSaleState: temp.GoodsSaleState,
                    //上架状态 0 未上架  1 已上架 2 已下架
                    addedState: temp.GoodsSaleState,
                    createTime: temp.CreateTime,
                    imgPaths: typeof (temp.GoodsImgPath) == 'object' ? temp.GoodsImgPath : [temp.GoodsImgPath || img],
                    brand: {
                        BrandTitle: temp.BrandTitle,
                        BrandState: temp.BrandState
                    },
                    State: temp.State
                })
            }
            res.json({"code": 200, "data": {goods: list, total: result2[0].count}});
        } catch (e) {
            console.error(e);
            res.json({"code": 300, "data": null});
        }
    });
}

/**
 * 获取单个商品组信息
 * @param req
 * @param res
 */
function getGoodsGroupInfo(req, res) {
    var goodsGroupId = req.params.goodsGroupId;
    if (!goodsGroupId || goodsGroupId == 'null') {
        res.json({"code": 300, "data": null});
    }
    Sync(function () {
        try {
            var sql = 'SELECT ' +
                'where A.Id="' + goodsGroupId + '" limit 1';
            var goodsGroup = mysql_db.query.sync(mysql_db, sql)[0][0];

            sql = 'select * from bbx_goods where GoodsGroupId="' + goodsGroupId + '"';
            var goods = mysql_db.query.sync(mysql_db, sql)[0];
            var sku = [], temp;
            //设置sku
            for (var i = 0; i < goods.length; i++) {
                temp = goods[i];
                sku.push({
                    id: temp.Id,
                    sku_id: temp.Skuid,
                    sell_price: temp.GoodsSalePrice,
                    quantity: temp.MaxCount,
                    outer_id: goodsGroup.Outeriid,
                    title: temp.FilterConfig
                });
            }
            //设置customConfig
            sql = 'SELECT * from bbx_goods4filterconfig  where GoodsGroupId ="' + goodsGroupId + '"';
            var result2 = mysql_db.query.sync(mysql_db, sql)[0];
            var colorTemp = [], sizeTemp = [];
            for (var i = 0; i < result2.length; i++) {
                if (result2[i].GoodsFilterTitle == '颜色') {
                    colorTemp = result2[i].GoodsFilterConfig.split(',');
                } else {
                    sizeTemp = result2[i].GoodsFilterConfig.split(',');
                }
            }
            var colorArr = [], sizeArr = [];
            if (colorTemp.length > 0) {
                for (var i = 0; i < colorTemp.length; i++) {
                    colorArr.push({
                        color: colorTemp[i],
                        rgba: "rgb(255, 255, 0)",
                        checked: true
                    })
                }
            }
            if (sizeTemp.length > 0) {
                for (var i = 0; i < sizeTemp.length; i++) {
                    sizeArr.push({
                        size: sizeTemp[i],
                        checked: true
                    })
                }
            }

            var list = [], temp;
            var img = 'http://img3.baa.bitautotech.com/img/V2img4.baa.bitautotech.com/space/2011/03/03/929e1913-2453-45f1-852f-f2204f2105b3_735_0_max_jpg.jpg';
            temp = goodsGroup;
            var goodsGroupImage = mysql_db.query.sync(mysql_db, 'select GoodsImgPath from bbx_goodsimages where GoodsId=?', [goodsGroupId])[0];
            var goodsGroupImages = [temp.GoodsImgPath];
            goodsGroupImage.forEach(function (item, idx) {
                if (goodsGroupImages.indexOf(item.GoodsImgPath) == -1) {
                    goodsGroupImages.push(item.GoodsImgPath)
                }
            });
            log(goodsGroupImages)
            list.push({
                Id: temp.Id,
                ActionTitle: temp.ActionTitle,
                goodsGroupTitle: temp.GoodsGroupTitle,
                GoodsSaleState: temp.GoodsSaleState,
                createTime: temp.CreateTime,
                goodsLink: temp.GoodsLink,
                imgPaths: goodsGroupImages,
                brand: {
                    Id: temp.BrandId,
                    BrandTitle: temp.BrandTitle
                },
                flowState: temp.State,
                outerId: temp.Outeriid,
                tag: temp.Tag,
                price: temp.GoodsPrice,
                express_fee: temp.ExpressFee,
                goodsDetail: temp.GoodsDetail,
                customConfig: {
                    colors: colorArr,
                    sizes: sizeArr
                },
                category: {
                    Id: temp.CategoryId,
                    categoryName: temp.CategoryTitle
                },
                sku: sku
            });
            res.json({"code": 200, "data": list});
        } catch (e) {
            console.log(e);
            res.json({"code": 300, "data": null});
        }
    });
}

/**
 * 创建商品组
 * @param req
 * @param res
 */
function createGoodsGroup(req, res) {
    Sync(function () {
        var cookies_user = req.cookies.user;
        var merchantId = cookies_user.Id;

        var param = req.body;
        param.user = req.cookies.user;
        console.log(param);
        var result = _addGoodsGroup(param);
        console.log(result);
        if (result.code == 200) {
            res.json({code: 200, data: result.groupId});
        } else {
            if (result.errorCode == '1062' || result.errorCode == '1169') {
                res.json({code: 300, data: '商品编码有重复，请重新输入后，再提交'});
            } else {
                res.json({code: 300, data: '提交失败'});
            }

        }
    });
}

/**
 * 编辑商品信息
 * @param req
 * @param res
 */
function editGoodsGroup(req, res) {
    var cookies_user = req.cookies.user;
    var merchantId = cookies_user.Id;

    var group=req.body;
    Sync(function(){
        mysql_db.beginTransaction.sync(mysql_db);
        try {
            var groupId = group.id;

            //更新商品组
            mysql_db.query.sync(
                mysql_db,
                'UPDATE bbx_goodsgroup SET GoodsGroupTitle=?,GoodsGroupSubTitle=?,GoodsDetail=?,GoodsImgPath=?,GoodsPrice=?,' +
                'CategoryId=?,Outeriid=?,Tag=?,State=?,UpdateTime=now(),GoodsSaleState=?  WHERE Id=?',
                [group.goodsGroupTitle, group.goodsGroupTitle, group.goodsDetail, group.imgPaths[0],
                    group.price, group.category.Id,  group.outerId, group.tag, group.State,group.saleState, groupId]
            );

            //获取商品的库存信息
            var sku_quantity_db = new taffy.taffy();
            var sql2 = 'SELECT Id,SkuId,MaxCount FROM bbx_goods WHERE GoodsGroupId =?;';
            var quantitys = mysql_db.query.sync(mysql_db, sql2, [groupId])[0];
            try {
                for (var i = 0; i < quantitys.length; i++) {
                    sku_quantity_db.insert({
                        id: quantitys[i].Id,
                        quantity: quantitys[i].MaxCount,
                        SkuId: quantitys[i].SkuId
                    });
                }
            } catch (e) {
                console.log(e);
            }

            //更新子商品，先删除，后增加
            mysql_db.query.sync(mysql_db, 'DELETE FROM bbx_goods WHERE GoodsGroupId=?', [groupId]);
            var publish_goodsId = '';
            for (var i = 0; i < group.sku.length; i++) {
                var goodsId;
                var quantity = group.sku[i].quantity;
                var skuId = group.sku[i].sku_id;

                if (group.sku[i].id) {
                    goodsId = group.sku[i].id;
                    try {
                        quantity = sku_quantity_db({id: goodsId}).get()[0].quantity;
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    goodsId = uuid.v1().replace(/-/ig, "");
                }

                publish_goodsId = goodsId;
                var goodsCostPrice = group.sku[i].sell_price;
                //供货价
                var supplyPrice = group.sku[i].supply_price;
                var outerId = group.sku[i].outer_id || group.outerId;

                var filterConfig = group.sku[i].title;
                var childTitle = group.goodsGroupTitle + " " + filterConfig;

                //在已有的库存上加上20% 取整
                var count = Math.ceil(quantity * 1.2);
                mysql_db.query.sync(
                    mysql_db,
                    'insert into bbx_goods ' +
                    '(`Id`,`GoodsTitle`,`GoodsShortTitle`,`GoodsPrice`,`GoodsCostPrice`,`CreateTime`,`Outeriid`,`Skuid`,' +
                    '`GoodsGroupId`,`FilterConfig`,`MaxCount`,`OriginalCount`,`GoodsSalePrice`,`LimitCount`,GoodsSupplyPrice)' +
                    'values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                    [goodsId, childTitle, childTitle,
                        group.price, goodsCostPrice, new Date(),
                        outerId, skuId, groupId, filterConfig, quantity, count, goodsCostPrice, 0, supplyPrice]
                );
            }

            //更新bbx_goods4filterconfig，先删除，后增加
            var deleteConfigSql = 'DELETE  FROM bbx_goods4filterconfig WHERE GoodsGroupId=?';
            mysql_db.query.sync(mysql_db, deleteConfigSql, [groupId]);

            //插入bbx_goods4filterconfig
            var sizeFilterId = uuid.v1().replace(/-/ig, "") + "";
            var sizeFilter = "";
            for (var i = 0; i < group.customConfig.sizes.length; i++) {
                if (group.customConfig.sizes[i].checked) {
                    sizeFilter = sizeFilter + "," + group.customConfig.sizes[i].size;
                }
            }
            sizeFilter = sizeFilter.replace(",", "");
            mysql_db.query.sync(
                mysql_db,
                'insert into bbx_goods4filterconfig values(?,?,?,?,?,?)',
                [sizeFilterId, "", "尺码", sizeFilter, groupId, 2]
            );

            var colorFilterId = uuid.v1().replace(/-/ig, "") + "";
            var colorFilter = "";
            for (var i = 0; i < group.customConfig.colors.length; i++) {
                if (group.customConfig.colors[i].checked) {
                    colorFilter = colorFilter + "," + group.customConfig.colors[i].color;
                }
            }
            colorFilter = colorFilter.replace(",", "");
            mysql_db.query.sync(
                mysql_db,
                'insert into bbx_goods4filterconfig values(?,?,?,?,?,?)',
                [colorFilterId, "", "颜色", colorFilter, groupId, 1]
            );

            //更新bbx_goodsimages，先删除，后增加
            mysql_db.query.sync(mysql_db, 'DELETE FROM bbx_goodsimages WHERE GoodsId=?', [groupId]);
            for (var i = 0; i < group.imgPaths.length; i++) {
                var imgId = uuid.v1().replace(/-/ig, "") + "";
                mysql_db.query.sync(
                    mysql_db,
                    'insert into bbx_goodsimages values(?,?,?,?)',
                    [imgId, group.imgPaths[i], groupId, new Date()]
                );
            }

            //观测者 同步商品展示
            //app.emit('SET_GOODSGROUP_RELATION', {groupId: goodsGroupId, goodsId: publish_goodsId});
            mysql_db.commit.sync(mysql_db);
            res.json({code: 200, data: "保存成功"});
        } catch (err) {
            console.log(err);
            mysql_db.rollback.sync(mysql_db);
            res.json({code: 300, data: "保存失败"});
        }
    });
}

/**
 * 删除单个商品组信息(假删除)
 * @param req
 * @param res
 */
function deleteGoodsGroup(req, res) {
    Sync(function () {
        try {
            var goodsGroupId = req.body.goodsGroupId;
            var sql = 'UPDATE bbx_goodsgroup SET IsDelete=1 WHERE Id=?';
            mysql_db.query.sync(mysql_db, sql, [goodsGroupId]);
            res.json({code: 200, msg: "删除成功"});
        } catch (err) {
            console.error(err);
            res.json({code: 300, data: "删除失败"});
        }
    });
}

/**
 * 添加商品
 * @param group
 * @returns {*}
 * @private
 */
function _addGoodsGroup(group) {
    group.createTime = new Date();
    var groupId = uuid.v1().replace(/-/ig, "") + "";
        //开始事务
    //mysql_db.beginTransaction.sync(mysql_db);
    console.log('begin*********');
    console.log(group);
    try {
        var insert_result = mysql_db.query.sync(
            mysql_db,
            'insert into bbx_goodsgroup (Id,GoodsGroupTitle,GoodsGroupSubTitle,GoodsDetail,CreateTime,GoodsImgPath,GoodsPrice,' +
            'CategoryId,Outeriid,Tag,GoodsSaleState,UpdateTime) values(?,?,?,?,now(),?,?,?,?,?,?,now())',
            [groupId, group.goodsGroupTitle, group.goodsGroupTitle,
                group.goodsDetail,  group.imgPaths[0],
                group.price, group.category.Id,group.outerId, group.tag,group.saleState ]
        );

        console.log('insert_result*********');
        console.log(insert_result);

        for (var i = 0; i < group.sku.length; i++) {
            var goodsId = uuid.v1().replace(/-/ig, "") + "";
            group.sku[i].sell_price = parseFloat((group.sku[i].supply_price * 1.1).toFixed(1));
            var goodsCostPrice = group.sku[i].sell_price;
            var goodsStock = 0;
            var goodsImgPath = "";
            var goodsNumber = "";
            var outerId = group.sku[i].outer_id || group.outerId;
            var skuId = group.sku[i].sku_id;

            var filterConfig = group.sku[i].title;
            var childTitle = group.goodsGroupTitle + " " + filterConfig;
            var quantity = group.sku[i].quantity;
            var supplyPrice = group.sku[i].supply_price;
            //在已有的库存上加上20% 取整
            var count = Math.ceil(quantity * 1.2);

            mysql_db.query.sync(
                mysql_db,
                'insert into bbx_goods(Id, GoodsTitle,GoodsShortTitle,GoodsPrice,GoodsCostPrice,GoodsStock,GoodsImgPath,' +
                'GoodsNumber,CreateTime,Outeriid,Skuid,GoodsGroupId,FilterConfig,MaxCount,OriginalCount,GoodsSalePrice,' +
                ' LimitCount,GoodsSupplyPrice) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [goodsId, childTitle, childTitle,
                    group.price, goodsCostPrice, goodsStock, goodsImgPath, goodsNumber, group.createTime,
                    outerId, skuId, groupId, filterConfig, quantity, count, goodsCostPrice, 0, supplyPrice]
            );
        }

        //插入bbx_goods4filterconfig
        var sizeFilterId = uuid.v1().replace(/-/ig, "") + "";
        var sizeFilter = "";
        for (var i = 0; i < group.customConfig.sizes.length; i++) {
            if (group.customConfig.sizes[i].checked) {
                sizeFilter = sizeFilter + "," + group.customConfig.sizes[i].size;
            }
        }
        sizeFilter = sizeFilter.replace(",", "");
        mysql_db.query.sync(
            mysql_db,
            'insert into bbx_goods4filterconfig values(?,?,?,?,?,?)',
            [sizeFilterId, "", "尺码", sizeFilter, groupId, 2]
        );

        var colorFilterId = uuid.v1().replace(/-/ig, "") + "";
        var colorFilter = "";
        for (var i = 0; i < group.customConfig.colors.length; i++) {
            if (group.customConfig.colors[i].checked) {
                colorFilter = colorFilter + "," + group.customConfig.colors[i].color;
            }
        }
        colorFilter = colorFilter.replace(",", "");
        mysql_db.query.sync(
            mysql_db,
            'insert into bbx_goods4filterconfig values(?,?,?,?,?,?)',
            [colorFilterId, "", "颜色", colorFilter, groupId, 1]
        );

        //插入bbx_goodsimages
        for (var i = 0; i < group.imgPaths.length; i++) {
            var imgId = uuid.v1().replace(/-/ig, "") + "";
            mysql_db.query.sync(
                mysql_db,
                'insert into bbx_goodsimages values(?,?,?,?)',
                [imgId, group.imgPaths[i], groupId, group.createTime]
            );
        }
        //新流程 2016-01-27 15:41:08
        //往快照库中写入一条记录
        group.id = groupId;


        //事务提交
        //mysql_db.commit.sync(mysql_db);
        return {code: 200, groupId: groupId};
    } catch (err) {
        console.log(err);
        console.log(err.errno);
        //事务回滚
        //mysql_db.rollback.sync(mysql_db);
        return {code: 300, errorCode: err.errno};
    }
}

/**
 * 修改商品来源或商品地址
 * @param req
 * @param res
 */
function changeChange(req, res) {
    Sync(function () {
        try {
            var goodsGroupId = req.body.goodsGroupId;
            var goodsLink = req.body.goodsLink;
            var sql;
            //商品来源地址修改
            if (goodsLink) {
                sql = 'UPDATE bbx_goodsgroup SET GoodsLink=? WHERE Id=?;';
                mysql_db.query.sync(mysql_db, sql, [goodsLink, goodsGroupId]);
                res.json({code: 200, msg: "修改成功"});
            }

        } catch (e) {
            console.log(e);
            res.json({code: 300, msg: "changeChannel fail"});
        }
    })
}


/**
 * 颜色列表
 * @returns {*[]}
 */
function getGoodsColors() {
    var colors = [
        {"color": "红色", "rgba": "rgba(255,0,0,1)"},
        {"color": "黄色", "rgba": "rgba(255,255,0,1)"},
        {"color": "蓝色", "rgba": "rgba(0,0,255,1)"},
        {"color": "黑色", "rgba": "rgba(0,0,0,1)"},
        {"color": "白色", "rgba": "rgba(255,255,255,1)"},
        {"color": "透明", "rgba": "rgba(0,0,0,0.1)"},
        {"color": "绿色", "rgba": "rgba(0,255,0,1)"},
        {"color": "粉色", "rgba": "rgba(255,192,203,1)"},
        {"color": "紫色", "rgba": "rgba(128,0,128,1)"},
        {"color": "军绿色", "rgba": "rgba(33,94,33,1)"},
        {"color": "天蓝色", "rgba": "rgba(135,206,235,1)"},
        {"color": "浅黄色", "rgba": "rgba(245,222,179,1)"},
        {"color": "深卡其布色", "rgba": "rgba(189,183,107,1)"},
        {"color": "巧克力色", "rgba": "rgba(92,51,23,1)"},
        {"color": "桔色", "rgba": "rgba(255,228,196,1)"},
        {"color": "浅灰色", "rgba": "rgba(211,211,211,1)"},
        {"color": "浅绿色", "rgba": "rgba(147,255,147,1)"},
        {"color": "深灰色", "rgba": "rgba(169,169,169,1)"},
        {"color": "深紫色", "rgba": "rgba(135,31,120,1)"},
        {"color": "深蓝色", "rgba": "rgba(0,0,139,1)"},
        {"color": "紫罗兰", "rgba": "rgba(138,43,226,1)"},
        {"color": "褐色", "rgba": "rgba(165,42,42,1)"},
        {"color": "酒红色", "rgba": "rgba(102,25,45,1)"},
        {"color": "藏青色", "rgba": "rgba(47,47,79,1)"},
        {"color": "墨绿色", "rgba": "rgba(47,79,79,1)"},
        {"color": "玫红", "rgba": "rgba(254,0,127,1)"}
    ];

    return colors;
}

/**
 * 默认尺码列表
 * @returns {string[]}
 */
function getGoodsSize() {
    var sizes = ["11码以下", "12码", "13码", "14码", "15码", "16码", "17码", "18码", "19码", "20码", "21码", "22码", "23码", "24码", "25码", "26码", "27码", "28码", "29码",
        "30码", "31码", "32码", "33码", "34码", "35码", "36码", "37码", "38码", "39码", "40码", "48cm", "52cm", "59cm", "66cm", "73cm", "80cm", "85cm", "90cm", "95cm", "100cm",
        "105cm", "110cm", "115cm", "120cm", "125cm", "130cm", "135cm", "140cm", "145cm", "150cm", "155cm", "160cm", "165cm", "170cm", "175cm", "180cm"];
    return sizes;
}

/**
 * 标签列表
 */
function labelList() {
    var label = ['韩系', '嘻哈风', '纯棉', '棉麻', '公主', '欧美', '森系', '波点', '运动', '学院', '小碎花', '欧根纱',
        '复古', '舞蹈服', '潮童', '牛仔', '绅士', "餐具", "玩具", "婴儿服", "睡袋", "T恤", "家居服", "睡衣", "保暖内衣",
        "配饰", "搞怪", "套装", "米奇", "卡通", "裤子", "棉衣", "帽子", "围巾", "手套", "拖鞋", "雨具", "小大人", "黑白",
        "动物", "迷彩", "豹纹", "糖果色", "亲子装", "雪地鞋", "连衣裙", "卫衣", "真皮", "千鸟格", "小背心", "短靴", '毛绒绒',
        "0-3岁", "3-6岁", "6-12岁", "9.9包邮", "19.9包邮", "39.9包邮"
    ];
    return label;
}

/**
 * 更新主库中的商品销售价格
 * @param saleObj
 */
function updateMainSupply(saleObj) {
    if (!saleObj) return;
    var len = saleObj.length;
    for (var i = 0; i < len; i++) {
        var sql = 'UPDATE bbx_goods SET GoodsSalePrice=? WHERE Id=?;';
        mysql_db.query.sync(mysql_db, sql, [saleObj[i].salePrice, saleObj[i].id]);
    }
}

/**
 * 获取需要编辑的商品组信息
 * @param req
 * @param res
 */
function getEditGoodsInfo(req, res) {
    Sync(function () {
        try {
            var goodsGroupId = req.query.goodsGroupId;
            var last_result = getMainTableInfo(goodsGroupId);
            last_result.user = req.session.user;
            res.render('goods/edit', last_result);
        } catch (e) {
            console.log(e);
            res.json({code: 300, msg: "error"});
        }
    });
}

/**
 *根据groupId 从主表中获取数据
 * @param goodsGroupId
 * @returns
 */
function getMainTableInfo(goodsGroupId) {
    //从主表中获取数据
    try {
        var sql = 'SELECT * from bbx_goodsgroup  WHERE Id=? ;';
        var groupInfo = mysql_db.query.sync(mysql_db, sql, [goodsGroupId])[0][0];
        groupInfo.StateInfo = AppConfig.GOODS_AUDIT_STATE[groupInfo.State];
        var sql2 = 'SELECT * from bbx_goods  WHERE GoodsGroupId=?;';
        var skuList = mysql_db.query.sync(mysql_db, sql2, [goodsGroupId])[0];
        var len = skuList.length;
        var color = [];
        var size = [];
        for (var i = 0; i < len; i++) {
            var color_size = skuList[i].FilterConfig.split(',');
            skuList[i].color = color_size[0];
            skuList[i].size = color_size[1];
            if (color.indexOf(color_size[0]) < 0) {
                color.push(color_size[0]);
            }
            if (size.indexOf(color_size[1]) < 0) {
                size.push(color_size[1]);
            }
        }
        var sql3 = 'SELECT GoodsImgPath from bbx_goodsimages WHERE GoodsId=?';
        var imgsPath = mysql_db.query.sync(mysql_db, sql3, [goodsGroupId])[0];
        var last_result = {
            groupInfo: groupInfo,
            skuList: skuList,
            skuListStr: JSON.stringify(skuList),
            color: color,
            size: size,
            imgsPath: imgsPath,
            labelListStr: JSON.stringify(labelList()),
            chooseLabelsStr: groupInfo.GoodsLabel,
            AuditOpinion: groupInfo.AuditOpinion || false
        };
        return last_result;
    } catch (e) {
        console.log(e);
        return false;
    }
}

/**
 * 检查Outeriid 是否重复
 * @param req
 * @param res
 */
function checkOuteriid(req, res) {
    Sync(function () {
        try {
            var outeriid = req.body.outeriid;
            var sql = 'SELECT count(1) as ct from bbx_goodsgroup WHERE Outeriid=?;';
            var count = mysql_db.query.sync(mysql_db, sql, [outeriid])[0][0];
            if (count.ct == 0) {
                res.json({code: 200, msg: true});
            } else {
                res.json({code: 201, msg: "商品编码已存在，请重新输入！"});
            }
        } catch (e) {
            console.log(e);
            res.json({code: 300, msg: false});
        }
    });
}

/**
 * 商品组详情展示
 * @param req
 * @param res
 */
function detail(req, res) {
    Sync(function () {
        var last_result = {user: req.session.user};
        try {
            var goodsGroupId = req.query.goodsGroupId;
            last_result = detailInfo(goodsGroupId, last_result);
            res.render('goods/detail', last_result);
        } catch (e) {
            console.log(e);
            res.render('goods/detail', last_result);
        }
    });
}

function editGoodsCountView(req, res) {
    Sync(function () {
        var last_result = {user: req.session.user};
        try {
            var goodsGroupId = req.query.goodsGroupId;
            var sql = 'SELECT * from bbx_view_goods_list WHERE GoodsGroupId=?';
            var result = mysql_db.query.sync(mysql_db, sql, [goodsGroupId])[0];
            var sql2 = 'SELECT GoodsImgPath from bbx_goodsimages WHERE GoodsId=?';
            var imgsPath = mysql_db.query.sync(mysql_db, sql2, [goodsGroupId])[0];

            var sql3 = 'SELECT * FROM bbx_goods WHERE GoodsGroupId=?';
            var skuInfo = mysql_db.query.sync(mysql_db, sql3, [goodsGroupId])[0];
            last_result.skuInfoStr = JSON.stringify(skuInfo);
            last_result.result = result[0];
            last_result.imgsPath = imgsPath || [];
            last_result.resultStr = JSON.stringify(last_result.result).replace(/\\/g, '\\\\');
            res.render('goods/editGoodsCount', last_result);
        } catch (e) {
            console.log(e);
            res.render('goods/editGoodsCount', last_result);
        }
    });
}

/**
 *商品组详细信息获取
 * @param goodsGroupId
 * @param last_result
 * @returns {*}
 */
function detailInfo(goodsGroupId, last_result) {
    try {
        var sql = 'SELECT * from bbx_view_goods_list WHERE GoodsGroupId=?';
        var result = mysql_db.query.sync(mysql_db, sql, [goodsGroupId])[0];
        var sql2 = 'SELECT GoodsImgPath from bbx_goodsimages WHERE GoodsId=?';
        var imgsPath = mysql_db.query.sync(mysql_db, sql2, [goodsGroupId])[0];
        last_result.result = result;
        last_result.imgsPath = imgsPath || [];
        return last_result
    } catch (e) {
        console.log(e);
        return last_result;
    }
}

/**
 * 商品添加页初始化数据
 * @param req
 * @param res
 */
function addGoodsPage(req, res) {
    var last_result = {};
    last_result.user = req.session.user;
    last_result.colors = getGoodsColors();
    last_result.color = JSON.stringify(last_result.colors);
    last_result.sizes = getGoodsSize();
    last_result.size = JSON.stringify(last_result.sizes);
    last_result.labelList = labelList();
    last_result.labelListStr = JSON.stringify(last_result.labelList);
    res.render('goods/goods_add', last_result);
}

/**
 * 修改库存
 * @param req
 * @param res
 */
function changeMaxCount(req, res) {
    Sync(function () {
        try {
            var skuInfo = req.body.skuInfo;
            for (var i = 0; i < skuInfo.length; i++) {
                var sql = 'UPDATE bbx_goods SET MaxCount=? WHERE Id=? and GoodsGroupId=?';
                mysql_db.query.sync(mysql_db, sql, [skuInfo[i].MaxCount, skuInfo[i].Id, skuInfo[i].goodsGroupId]);
            }
            console.log("changeMaxCount goodsGroupId:" + skuInfo[0].goodsGroupId);
            res.json({code: 200, msg: "修改成功"});
        } catch (e) {
            console.log(e);
            res.json({code: 300, msg: "修改失败"});
        }
    })
}
/**
 * 检测商户基本信息是否审核通过请求
 * @param req
 * @param res
 */
function checkMerchantInfo(req, res) {
    Sync(function () {
        res.json({code: 200, msg: 'pass'});
    });
}

/**
 *审核中和审核通过后，修改商品价格
 */
function updateGoodsSalePrice(req, res) {
    Sync(function () {
        var saleObj = req.body.saleObj;
        var goodsGroupId = req.body.goodsGroupId;
        var sql = 'SELECT count(1) as ct FROM bbx_goodsgroup WHERE Id=? and State in (2,3)';
        var check = mysql_db.query.sync(mysql_db, sql, [goodsGroupId])[0][0].ct;
        if (check == 1) {
            var str = '线上价格修改成功';
            updateMainSupply(saleObj);
            res.json({code: 200, msg: str});
        } else {
            res.json({code: 300, msg: '状态不对，不允许调用此接口'});
        }
    })
}

/**
 * 重置商品组销售状态
 * @param req
 * @param res
 */
function resetGoodsSaleState(req, res) {
    Sync(function () {
        var state = req.body.state;
        var goodsGroupId = req.body.goodsGroupId;

        var sql = 'update bbx_goodsgroup set GoodsSaleState = ? where Id = ?';
        mysql_db.query.sync(mysql_db, sql, [state, goodsGroupId]);
        res.json({code: 200, msg: 'success'});
    });
}

exports.getGoodsColors = getGoodsColors;
exports.getGoodsSize = getGoodsSize;
exports.getGoodsCategory = getGoodsCategory;
exports.getGoodsGroups = getGoodsGroups;
exports.getGoodsGroupInfo = getGoodsGroupInfo;
exports.createGoodsGroup = createGoodsGroup;
exports.editGoodsGroup = editGoodsGroup;
exports.deleteGoodsGroup = deleteGoodsGroup;
exports.changeChange = changeChange;
exports.getEditGoodsInfo = getEditGoodsInfo;
exports.checkOuteriid = checkOuteriid;
exports.detail = detail;
exports.addGoodsPage = addGoodsPage;
exports.editGoodsCountView = editGoodsCountView;
exports.changeMaxCount = changeMaxCount;
exports.checkMerchantInfo = checkMerchantInfo;
exports.updateGoodsSalePrice = updateGoodsSalePrice;
exports.resetGoodsSaleState = resetGoodsSaleState;