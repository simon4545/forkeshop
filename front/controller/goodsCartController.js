var Sync = require('sync');
var comFunc = require('../common').comFunc;
var _ = require('underscore');
var mysql_con = global.app.get('mysql_con');
var knex_con = global.app.get('knex_con');
/*******************************购物车 start*******************************************/
/**
 * 购物车商品list
 * @param req
 * @param res
 */
function goodsList(req, res) {
    var loginId = req.body.loginId;
    if (!loginId) {
        res.json({ STATUSCODE: 300, MSG: '请登录后提交' });
        return;
    }
    knex_con.select('Cart').from('bbx_cart').where('UserId', loginId).limit(1).then(
        (result) => {
            Sync(function () {
                var ret = _getGoods(result[0]);
                res.json({ STATUSCODE: 200, DATA: { OUTTIME: 3600, DATA: ret } });
            });
        }
    ).catch(function (err) {
        console.error(err);
    });

}

/**
 * 修改购物车商品
 * @param req
 * @param res
 */
function changeCart(req, res) {
    var body = req.body;
    var loginId = body.loginid, needNum = body.num || 0, skuId = body.actiongoodsid;
    if (!loginId) {
        res.json({ STATUSCODE: 300, MSG: '请登录后提交' });
        return;
    }
    var goodsList = [{ skuId: skuId, num: needNum }];
    Sync(function () {
        var ret = _changeCartGoods(loginId, goodsList, req);
        res.json(ret);
    });
}

/**
 * 批量修改购物车商品
 * @param req
 * @param res
 */
function changeCartBatch(req, res) {
    var body = req.body;
    var loginId = body.loginid, goodsList = body.goodslist;
    if (!loginId) {
        res.json({ STATUSCODE: 300, MSG: '请登录后提交' });
        return;
    }
    goodsList = JSON.parse(goodsList);

    Sync(function () {
        var ret = _changeCartGoods(loginId, goodsList, req);
        res.json(ret);
    });
}

/**
 * 删除购物车中的一个商品
 * @param req
 * @param res
 */
function delGoods(req, res) {
    var loginId = req.body.loginId;
    var sukId = req.body.goodsId;
    if (!loginId) {
        res.json({ STATUSCODE: 300, MSG: '请登录后提交' });
        return;
    }
    Sync(function () {
        _deleteCartGoods(loginId, sukId, req);
        res.json({ STATUSCODE: 200, DATA: "OK" });
    });
}

function clearGoods(req, res) {
    var loginId = req.body.loginId;
    knex_con('bbx_cart')
        .where('UserId', loginId)
        .del().then(() => { });
    res.json({ STATUSCODE: 200, DATA: "OK" });
}
/*******************************购物车 end*******************************************/

/**
 * 删除购物车商品--私有
 * @private
 */
function _deleteCartGoods(loginId, skuId, req) {
    try {
        var orderGoodsList = mysql_con.query.sync(mysql_con,
            knex_con.select('Cart').from('bbx_cart').where('UserId', loginId).limit(1).toString())[0];
        var cartGoodsJson = JSON.parse(result[0].Cart);
        cartGoodsJson = cartGoodsJson.filter(function (item, idx) {
            if (item.skuId != skuId) return true;
        });
        mysql_con.query.sync(mysql_con,
            knex_con('bbx_cart')
                .where('UserId', loginId)
                .update({
                    Cart: JSON.stringify(cartGoodsJson)
                }).toString())

        return true;
    } catch (ex) {
        console.error(err);
        return { DATA: [], OUTTIME: 3600, STATUSCODE: 300 };
    }


}

/**
 * 购物车商品加入方法 -- 私有
 * @param loginId
 * @param goodsList
 * @private
 */
function _changeCartGoods(loginId, goodsList, req) {
    try {
        var cartGoodsJson = [], goods = {};
        var result = mysql_con.query.sync(mysql_con,
            knex_con.select('Cart').from('bbx_cart').where('UserId', loginId).limit(1).toString())[0];
        if (result.length < 1)
            result = [];
        else {
            result = JSON.parse(result[0].Cart)
        }
        goodsList.forEach(function (i) {
            goods[i.skuId] = parseInt(i.num);
        });
        result.forEach(function (i) {
            if (goods[i.skuId]) {
                goods[i.skuId] = parseInt(goods[i.skuId]) + parseInt(i.num);
            } else {
                goods[i.skuId] = parseInt(i.num);
            }
        });
        for (var g in goods) {
            cartGoodsJson.push({ skuId: g, num: goods[g] })
        }

        if (result.length == 0) {
            knex_con('bbx_cart')
                .insert({ UserId: loginId, Cart: JSON.stringify(cartGoodsJson) }).then(function () {
                    console.log(arguments)
                });
        } else {
            knex_con('bbx_cart')
                .where('UserId', loginId)
                .update({
                    Cart: JSON.stringify(cartGoodsJson)
                }).then(function () {
                    console.log(arguments)
                });
        }

        return { DATA: [], OUTTIME: 3600, STATUSCODE: 200 };
    } catch (ex) {
        console.error(ex);
        return { DATA: [], OUTTIME: 3600, STATUSCODE: 300 };
    }


}
/**
 *
 * @param goodsArr
 * @private
 */
function _getGoods(goodsArr) {
    var returnGoodsList = [];
    var needGoodsIds = [];
    if (!goodsArr) return returnGoodsList;
    goodsArr = JSON.parse(goodsArr.Cart);
    for (idx in goodsArr) {
        needGoodsIds.push(goodsArr[idx]['skuId']);
    }
    if (needGoodsIds.length == 0) {
        return returnGoodsList;
    }
    var sql = knex_con.select(
        'Id', 'FilterConfig', 'GoodsGroupTitle', 'GoodsImgPath',
        'GoodsPrice', 'GoodsSalePrice', 'Maxcount'
    ).from('bbx_view_goods_list').whereIn('Id', needGoodsIds).toString();
    var goodsInfoList = mysql_con.query.sync(mysql_con, sql)[0];
    for (idx in goodsInfoList) {
        var item = goodsArr.find(function (i) {
            return i.skuId === goodsInfoList[idx]['Id']
        });
        if (item) {
            returnGoodsList.push({
                FILTERCONFIG: goodsInfoList[idx]['FilterConfig'],
                GOODSGROUPTITLE: goodsInfoList[idx]['GoodsGroupTitle'],
                ID: goodsInfoList[idx]['Id'],
                GOODSIMGPATH: goodsInfoList[idx]['GoodsImgPath'],
                GOODSNUM: item.num,
                GOODSPRICE: goodsInfoList[idx]['GoodsPrice'],
                GOODSSALEPRICE: goodsInfoList[idx]['GoodsSalePrice'],
                MAXCOUNT: goodsInfoList[idx]['Maxcount']
            });
        }
    }
    return returnGoodsList;
}

exports.goodsList = goodsList;
exports.changeCart = changeCart;
exports.changeCartBatch = changeCartBatch;
exports.delGoods = delGoods;
exports.clearGoods = clearGoods;