/* jshint node: true */
/* global require,exports */
'use strict';
var Sync = require('sync');
var async = require('async');
var comFunc = require('../common').comFunc;
var AppConfig = require('../config');
var mysql_con = global.app.get('mysql_con');
var _ = require('underscore');

//商品缩略图（detail页面顶部轮播图）
function goodsImgList(req, res) {
    var goodsGroupId = req.body.goodsGroupId;
    if (!goodsGroupId) {
        return res.json({
            STATUSCODE: 300,
            MSG: "参数错误~"
        });
    }
    var selectSql = "SELECT * FROM bbx_goodsimages WHERE GoodsId = ? ";
    Sync(function () {
        try {
            var imgs = mysql_con.query.sync(mysql_con, selectSql, [goodsGroupId])[0];
            return res.json({
                STATUSCODE: 200,
                DATA: imgs
            });
        } catch (e) {
            console.log(e);
            return res.json({
                STATUSCODE: 300,
                MSG: "服务器错误~"
            });
        }
    });
}

//商品详情（商家上传的图片）
function goodsDetail(req, res) {
    var goodsGroupId = req.body.goodsGroupId;
    if (!goodsGroupId) {
        return res.json({
            STATUSCODE: 300,
            MSG: "参数错误~"
        });
    }

    var selectSql = "SELECT GoodsDetail FROM bbx_goodsgroup WHERE Id = ? ";
    Sync(function () {
        try {
            var goodsDetail = mysql_con.query.sync(mysql_con, selectSql, [goodsGroupId])[0];
            var goodsDetailStr = '';
            if (goodsDetail.length > 0) {
                //数据库传出来的字段是大写的GoodsDetail不是goodsDetail
                goodsDetailStr = goodsDetail[0].GoodsDetail;
                goodsDetailStr = goodsDetailStr.replace(/_.webp/im, '');
                goodsDetailStr = goodsDetailStr.replace(/(style|width|height|class)=\".*?\"/im, '');
            }
            res.json({
                STATUSCODE: 200,
                DATA: goodsDetailStr
            });
        } catch (e) {
            console.log(e);
            return res.json({
                STATUSCODE: 300,
                MSG: "服务器错误~"
            });
        }
    });
}

//精选
function goodsSift(req, res) {
    var categoryType = req.body.categoryType || '',
        filters = req.body.filters || null,
        pageNum = req.body.pageNum || 1;

    var offset = (pageNum - 1) * 20;

    var sql = "SELECT Id AS GoodsGroupId, CreateTime, " +
        "GoodsSaleState, GoodsImgPath, GoodsGroupTitle, CategoryTitle, " +
        "GoodsPrice, GoodsSalePrice " +
        "FROM bbx_view_goodsgroup_list " +
        "WHERE GoodsSaleState = " + AppConfig.ActionGoodsSaleState.ONLINE;
    if (categoryType) {
        if (AppConfig.GoodsTag.hasOwnProperty(categoryType)) {
            var goodsTagStr = AppConfig.GoodsTag[categoryType];
            sql += " AND a.Tag in (" + goodsTagStr + ", 0) ";
        }
        if (AppConfig.goodsCategory.hasOwnProperty(categoryType)) {
            var categoryStr = AppConfig.goodsCategory[categoryType].join(",");
            sql += " AND b.CategorySort IN(" + categoryStr + ") ";
        }
    }
    if (filters) {
        filters = filters.split(',');
        filters.forEach(function (filterStr) {
            var arr = filterStr.split(":");
            var column = arr[0], orderIng = arr[1];
            sql += " order by " + column + (orderIng === 'asc' ? " asc" : " desc");
        });
    }
    sql += " limit 20 offset " + offset;
    Sync(function () {
        try {
            var selectRes = mysql_con.query.sync(mysql_con, sql)[0];
            return res.json(comFunc.upperCase({
                STATUSCODE: 200,
                DATA: selectRes
            }));
        } catch (e) {
            console.error(e);
            return res.json({
                STATUSCODE: 300,
                MSG: "服务器错误~"
            });
        }
    });
}

//商品详情
function goodsInfo(req, res) {
    var goodsGroupId = req.body.goodsGroupId, goodsId,
        //goodsId = req.body.goodsId,
        actionId = req.body.actionId;

    if (!goodsGroupId) {
        return res.json({
            STATUSCODE: 300,
            MSG: "参数错误~"
        });
    }

    var baseInfo1Sql = `select 
                        GoodsId, GoodsFilterTitle, GoodsFilterConfig, 
                        GoodsGroupId, Sort from bbx_goods4filterconfig 
                        where GoodsGroupId=? order by Sort`,
        baseInfo2Sql = `select 
                        Id as GOODSGROUPID, GoodsSaleState,GoodsGroupTitle
                        ,GoodsDetail,CategoryTitle
                        from bbx_view_goodsgroup_list where Id=?`,
        baseInfo3Sql = `select 
                        Id,GoodsTitle,GoodsSalePrice,GoodsSaleState,GOODSPRICE,
                        FILTERCONFIG, MaxCount,GOODSIMGPATH 
                        from bbx_view_goods_list where GoodsGroupId=?`,
        baseInfo4Sql = 'SELECT * FROM bbx_goodsimages WHERE GoodsId = ?',
        baseInfo5Sql = 'SELECT GoodsDetail FROM bbx_goodsgroup WHERE Id = ?';

    async.parallel([
        //商品规格
        function (callback) {
            mysql_con.query(baseInfo1Sql, [goodsGroupId], function (err, result) {
                if (err || result.length == 0) {
                    return callback(err || 'err');
                }
                callback(null, result);
            });
        },
        //商品信息
        function (callback) {
            mysql_con.query(baseInfo2Sql, [goodsGroupId], function (err, result) {
                if (err || result.length == 0) {
                    return callback(err || 'err');
                }
                result = result[0];

                if (result.GoodsSaleState == 1) {
                    result.ISONSALE = 1;
                } else if (result.GoodsSaleState == 0) {
                    result.ISONSALE = 0;
                } else {
                    result.ISONSALE = 1;
                    result.MaxCount = 0;
                }
                callback(null, result);

            });
        },
        //商品列表
        function (callback) {
            mysql_con.query(baseInfo3Sql, [goodsGroupId], function (err, result) {
                if (err || result.length == 0) {
                    return callback(err || 'err');
                }
                result.forEach(function (item, idx) {
                    if (item.GoodsSaleState == 1) {
                        item.ISONSALE = 1;
                    } else if (item.GoodsSaleState == 0) {
                        item.ISONSALE = 0;
                    } else {
                        item.ISONSALE = 1;
                        item.MaxCount = 0;
                    }
                });
                callback(null, result);
            });
        },
        // 商品图片列表
        function (callback) {
            mysql_con.query(baseInfo4Sql, [goodsGroupId], function (err, result) {
                if (err || result.length == 0) {
                    return callback(err || 'err');
                }
                callback(null, result);
            });
        },
        // 商品详情
        function (callback) {
            mysql_con.query(baseInfo5Sql, [goodsGroupId], function (err, result) {
                if (err || result.length == 0) {
                    return callback(err || 'err');
                }
                console.log(result);
                result = result[0]['GoodsDetail'];
                result = result.replace(/_.webp/im, '');
                result = result.replace(/(style|width|height|class)=\".*?\"/im, '');
                callback(null, result);
            });
        },
    ],

        function (err, results) {
            if (err) {
                console.error(err);
                return res.json({
                    STATUSCODE: 300,
                    MSG: "服务器错误~"
                });
            }
            var theGoods;
            var resObj = {};
            resObj.GoodsList = results[2];
            resObj.FilterConfig = results[0];
            resObj.GoodsGroupInfo = results[1];
            resObj.ImgList = results[3];
            resObj.GoodsGroupDetail = results[4];
            if (goodsId) {
                theGoods = resObj.GoodsList.find(function (item, idx) {
                    return item.GoodsId == goodsId;
                })
            }
            if (!theGoods) {
                resObj.GoodsList.sort(function (a, b) {
                    return a.GoodsSalePrice - b.GoodsSalePrice;
                });
                theGoods = resObj.GoodsList[0];
            }
            if (theGoods) {
                resObj.GoodsGroupInfo.FilterConfig = theGoods.FilterConfig;
                resObj.GoodsGroupInfo.GoodsImgPath = theGoods.GoodsImgPath;
                resObj.GoodsGroupInfo.GoodsPrice = theGoods.GoodsPrice;
                resObj.GoodsGroupInfo.GoodsSalePrice = theGoods.GoodsSalePrice;

                resObj.GoodsGroupInfo.Maxcount = theGoods.Maxcount;
                resObj.GoodsGroupInfo.GoodsTitle = theGoods.GoodsTitle;
            }
            //这句执行要2ms
            return res.json({
                STATUSCODE: 200,
                DATA: comFunc.upperCase(resObj)
            });
        });
}


function getFavoriteGoods(req, res) {
    var userId = req.body.userId;
    if (!userId) {
        return res.json({
            STATUSCODE: 300,
            MSG: "参数错误~"
        });
    }
    Sync(function () {
        try {
            var sql = `SELECT 
                        vgl.Id AS GoodsGroupId,
                        vgl.GoodsSalePrice,
                        vgl.GoodsSaleState,
                        vgl.GoodsGroupTitle,
                        vgl.GoodsPrice,
                        vgl.GoodsImgPath,
                        vgl.OffComment AS GoodsDiscount
                    FROM
                        bbx_favorite f
                            LEFT JOIN
                        bbx_view_goodsgroup_list vgl ON f.GoodsGroupId = vgl.Id
                    WHERE
                        f.UserId = ?
                    ORDER BY f.CreateTime DESC`;

            var result = mysql_con.query.sync(mysql_con, sql, [userId])[0];

            result = result || [];
            return res.json({
                STATUSCODE: 200,
                DATA: result
            });
        } catch (e) {
            console.log(e);
            return res.json({
                STATUSCODE: 300,
                MSG: "服务器错误~"
            });
        }
    });
}

function setFavoriteGoods(req, res) {
    var userId = req.body.userId, goodsGroupId = req.body.goodsGroupId;
    if (!userId || !goodsGroupId) {
        return res.json({
            STATUSCODE: 300,
            MSG: "参数错误~"
        });
    }
    var result = null;
    Sync(function () {
        try {
            //加入收藏
            var result = mysql_con.query.sync(mysql_con,
                'select count(1) as c from bbx_favorite where UserId=? and GoodsGroupId=?',
                [userId, goodsGroupId])[0];
            if (result&&result.length>0) {
                if (result[0].c > 0) {
                    mysql_con.query.sync(mysql_con,
                        'delete from bbx_favorite where UserId=? and GoodsGroupId=?',
                        [userId, goodsGroupId]);
                }else{
                    mysql_con.query.sync(mysql_con,
                        'insert into bbx_favorite set UserId=? , GoodsGroupId=?',
                        [userId, goodsGroupId]);
                }
            }
            return res.json({
                STATUSCODE: 200,
                DATA: "1"
            });
        } catch (ex) {
            return res.json({
                STATUSCODE: 300,
                MSG: "服务器错误~"
            });
        }
    });
}

exports.goodsImgList = goodsImgList;
exports.goodsDetail = goodsDetail;
exports.goodsSift = goodsSift;
exports.goodsInfo = goodsInfo;
exports.getFavoriteGoods = getFavoriteGoods;
exports.setFavoriteGoods = setFavoriteGoods;