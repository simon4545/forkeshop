/**
 * 导入淘宝sku信息
 * Created by zlongxiao@126.com on 2015/11/18.
 */
var taffy = require('../lib/taffy-min');

/**
 * 返回sku 数据
 * @param data
 * @param taobaoSkuId
 * @returns {*}
 */
function cancatTaobaoData(data, taobaoSkuId) {
    try {
        var color_db = new taffy.taffy();
        var size_db = new taffy.taffy();
        var quantity_db = new taffy.taffy();
        var groupInfoObj = data.data;
        var groupInfo = {};
        groupInfo.GoodsGroupTitle = groupInfoObj.item_info.title;
        //自己的品牌
        //groupInfo.BrandId = groupInfoObj.brand.Id;
        //groupInfo.CategoryId = groupInfoObj.category.Id;
        groupInfo.Outeriid = taobaoSkuId;
        groupInfo.ExpressFee = 0;
        groupInfo.GoodsPrice = groupInfoObj.price_info.item_price.price.price;
        groupInfo.Tag = 0;
        groupInfo.GoodsDetail = dealDetail(groupInfoObj.desc_info.content);
        groupInfo.GoodsLink = '';
        groupInfo.AuditOpinion = false;

        var skuList = [];
        var sku_property = groupInfoObj.sku_info.sku_props.sku_property;
        //处理颜色和尺码
        for (var l = 0; l < sku_property.length; l++) {
            if (sku_property[l].prop_id == "1627207") {
                dealColor(sku_property[l].values.sku_property_value, color_db);
            } else {
                dealSize(sku_property[l].values.sku_property_value, size_db);
            }
        }

        dealQuantity(groupInfoObj.stock_info.sku_quantity_list.sku_quantity, quantity_db);
        var sku_data = groupInfoObj.sku_info.pv_map_sku_list.pv_map_sku;
        var len = sku_data.length;
        for (var i = 0; i < len; i++) {
            var sku = {};
            sku.Skuid = sku_data[i].sku_id;
            sku.Outeriid = taobaoSkuId;
            var color_size = sku_data[i].pv.split(';');
            for (var j = 0; j < color_size.length; j++) {
                if (color_size[j].indexOf('1627207') >= 0) {
                    var _color_code = color_size[j].split(":")[1];
                    sku.color = color_db({value_id: _color_code}).get()[0].name;
                } else {
                    var _size_code = color_size[j].split(":")[1];
                    sku.size = size_db({value_id: _size_code}).get()[0].name;
                }
            }

            sku.FilterConfig = sku.color + "," + sku.size;
            sku.MaxCount = quantity_db({sku_id: sku.Skuid}).get()[0].quantity;
            //此处数据不获取，直接该为0，让商家自己填写
            sku.GoodsSalePrice = 0;
            sku.Id = "";
            skuList.push(sku);
        }

        var colors = [];
        for (var j = 0; j < color_db().count(); j++) {
            colors.push(color_db().get()[j].name);
        }

        var sizes = [];
        for (var k = 0; k < size_db().count(); k++) {
            sizes.push(size_db().get()[k].name);
        }
        var imgsPath = [];
        for (var l = 0; l < color_db().count(); l++) {
            var _imgPath = {};
            _imgPath.GoodsImgPath = color_db().get()[l].img_url;
            imgsPath.push(_imgPath);
        }
        var last_result = {
            groupInfo: groupInfo,
            // 为\n \r \t 替换
            groupInfoStr: JSON.stringify(groupInfo).replace(/\\/g, '\\\\'),
            skuList: skuList,
            skuListStr: JSON.stringify(skuList),
            color: colors,
            size: sizes,
            colors: JSON.stringify(colors),
            sizes: JSON.stringify(sizes),
            imgsPath: imgsPath,
            imgsPathStr: JSON.stringify(imgsPath)
        };
        return last_result;
    } catch (e) {
        console.log(e);
        return false;
    }
}

/**
 * 处理颜色数据
 * @param data
 * @param color_db
 */
function dealColor(data, color_db) {
    //判断数据类型是否为数组
    if (data instanceof  Array) {
        var len = data.length;
        for (var i = 0; i < len; i++) {
            color_db.insert(data[i]);
        }
    } else {//单个颜色处理
        color_db.insert(data);
    }

}

/**
 * 处理尺码数据
 * @param data
 * @param size_db
 */
function dealSize(data, size_db) {
    if (data instanceof  Array) {
        var len = data.length;
        for (var i = 0; i < len; i++) {
            size_db.insert(data[i]);
        }
    } else {//单个尺码处理
        size_db.insert(data);
    }

}

/**
 * 处理商品数量数据
 * @param data
 * @param quantity_db
 */
function dealQuantity(data, quantity_db) {
    var len = data.length;
    for (var i = 0; i < len; i++) {
        quantity_db.insert(data[i]);
    }
}

/**
 * 处理商品详情数据
 * 两种情况，xml 格式和非xml 格式
 * @param data
 * @returns {*}
 */
function dealDetail(data) {
    if (data.indexOf('<?xml version') >= 0 || data.indexOf('<wapDesc>') >= 0) {
        var reg = />(h.*?)</ig, a = [], r;
        var arr_html = [];
        while (r = reg.exec(data)) {
            a.push(r[1])
        }
        for (var i = 0; i < a.length; i++) {
            arr_html.push('<img src="' + a[i] + '" />');
        }
        return arr_html.join('<br/>');
    } else {
        return data;
    }

}

exports.cancatTaobaoData = cancatTaobaoData;



