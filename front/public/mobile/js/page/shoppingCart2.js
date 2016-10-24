/**
 *
 * 这个shoppingCart的存在主要为了处理满减做的改动
 *
 * @type {{groupTpl: string, cartTotal1: string, cartTotal2: string, dataList: null, outTime: number, page: string, dataPos: null, salePrice: number, saleDiscount: number, init: Function, bindEvent: Function, showCart: Function, getCartListAjax: Function, getCartListLocal: Function, showCartData: Function, showCartEmpty: Function, forMateDBData: Function, showCartList: Function, showCartTotal: Function, showCartListByGroup: Function, caculateTotal: Function, caculateFullCut: Function, changeGoodsNum: Function, deleteCart: Function, setCartDowntime: Function, getGoodsNumAndTime: Function, caculateTime: Function, formatDateForNumTime: Function, formatLocalList: Function, findAction: Function, newActionObj: Function, formatLocalListForBatch: Function, batchChangeGoodsNum: Function, setLocalOrderGoods: Function}}
 */

var shoppingCartObj2 = {
    groupTpl: "",
    cartTotal1: "",
    cartTotal2: "",
    dataList: null,
    outTime: 0,
    page: ".shoppingCartPage",
    dataPos: [],
    salePrice: 0,
    saleDiscount: 0,
    init: function () {
        var that = this;
        that.groupTpl = $$("#newCartV1_1Tpl").html();
        that.cartTotal1 = $$("#newCartV1_1TOTAL1Tpl").html();
        that.cartTotal2 = $$("#newCartV1_1TOTAL2Tpl").html();
        that.cartTotal3 = $$("#newCartV1_1TOTAL3Tpl").html();
    },
    bindEvent: function () {

        var that = this;

        //去首页
        bindTapEvent(that.page, '#goToIndex', function (_this) {
            mainView.router.loadPage("page/index.html");
        });

        //下单
        bindTapEvent(that.page, '#goToOrderConfirm', function (_this) {
            var boolFlag = shoppingCartObj2.setLocalOrderGoods();
            if (boolFlag) {
                mainView.router.loadPage('page/orderConfirm.html');
            }
            else {
                hiApp.alert("请选择相应商品和数量进行结算");
            }
        });

        //删除
        bindTapEvent(that.page, '.cartDelete', function (_this) {
            var eqd = parseInt($$(_this).attr("eqd"), 10) , eqi = parseInt($$(_this).attr("eqi"), 10);

            hiApp.confirm("确定删除？", "提示", function () {
                shoppingCartObj2.deleteCart(eqd, eqi);
            });
        });

        //全选
        bindTapEvent(that.page, '#cartSelectAllDIV', function (_this) {
            hiApp.showIndicator();
            var type = !$$("#cartSelectAllLabel").hasClass("selected");
            type ? $$("#cartSelectAllLabel").addClass("selected") : $$("#cartSelectAllLabel").removeClass("selected");

            var inputs = $$(".cartLSelect");
            var i, len;
            for (i = 0, len = inputs.length; i < len; i++) {
                type ? inputs.addClass("selected") : inputs.removeClass("selected");
            }

            var j, lenj;
            for (i = 0, len = that.dataPos.length; i < len; i++) {
                for (j = 0, lenj = that.dataPos[i].length; j < lenj; j++) {
                    that.dataPos[i][j] = ( type ? 1 : 0 );
                }
            }

            that.showCartTotal(that.dataList);
            hiApp.hideIndicator();
        });


        //item选择
        bindTapEvent(that.page, '.cartImgSelect', function (_this) {
            hiApp.showIndicator();
            var eqi = parseInt($$(_this).attr("eqi"));
            var selectImg = $$("#cartSelect_" + eqi);
            var type = !selectImg.hasClass("selected");
            type ? selectImg.addClass("selected") : selectImg.removeClass("selected");
            that.dataPos[eqi] = type ? 1 : 0;

            var i = 0 , len = that.dataList.length, flag1 = 1;

            for (; i < len; i++) {
                if (i !== eqi) {
                    if (!$$("#cartSelect_" + i).hasClass("selected")) {
                        flag1 = 0;
                        break;
                    }
                }
            }

            var flag = 1;

            if (flag && type && flag1) {
                $$("#cartSelectAllLabel").addClass("selected");
            }
            else {
                $$("#cartSelectAllLabel").removeClass("selected");
            }

            that.showCartTotal(that.dataList);
            hiApp.hideIndicator();
        });

        //绑定数量变动
        bindTapEvent(that.page, '.goodsnum-add', function (_this) {
            hiApp.showIndicator();
            var eqi = parseInt($$(_this).attr("eqi"), 10);
            shoppingCartObj2.changeGoodsNum(eqi, 1) && that.showCartTotal(that.dataList);
            hiApp.hideIndicator();
        });
        bindTapEvent(that.page, '.goodsnum-sub', function (_this) {
            hiApp.showIndicator();
            var eqi = parseInt($$(_this).attr("eqi"), 10);
            shoppingCartObj2.changeGoodsNum(eqi, -1) && that.showCartTotal(that.dataList);
            hiApp.hideIndicator();
        });

    },
    showCart: function (flag) {
        "use strict";
        var that = this;
        if (userObj.isExist()) {
            that.getCartListAjax();
        }
        else {
            that.getCartListLocal();
        }

        $$("#mainViewNavBar").show();
        $$("#mainViewNavBar .logo").html("购物车");

//        if (flag) {
//            //显示底部
//            $$("#cartBackIcon").css("visibility", "hidden");
//            $$("#cartFixBar").css("bottom", "50px");
//            $$(".toolbar").show();
//        }
//        else {
//            //显示顶部
//            $$("#cartBackIcon").css("visibility", "visible");
//            $$("#cartFixBar").css("bottom", "0");
//            $$(".shoppingCartPage").addClass("no-toolbar");
//            $$(".toolbar").hide();
//        }
    },
    getCartListAjax: function () {
        "use strict";
        var that = this;
        hiApp.showIndicator();
        var userId = userObj.isExist();
        var data = "";

        util.getAjaxData({
            url: appConfig.GETCARTLIST,
            type: 'post',
            data: {
                loginId: userId
            },
            error: function () {
                hiApp.hideIndicator();
                return false;
            },
            success: function (json) {
                if(json){
                    var dataObj = JSON.parse(json);
                    if(dataObj.STATUSCODE == 200){
                        var _data = dataObj.DATA;
                        console.log(_data);
                        var __data = util.upperCase(_data);
                        console.log(__data);
                        that.showCartData(__data);
                    }
                }
                setTimeout(function () {
                    hiApp.hideIndicator();
                }, 1000);

            }
        });
    },
    getCartListLocal: function () {
        "use strict";
        var that = this;
        that.formatLocalList(function(data){
            that.showCartData(data);
        });
    },
    showCartData: function (data) {
        "use strict";
        var that = this;
        //list方法没有状态
        if (data.DATA && data.DATA.length > 0) {
            that.outTime = data.OUTTIME;
            that.setCartDowntime(data.OUTTIME);
            that.dataList = that.forMateDBData(data.DATA);
            hiApp.hideIndicator();
            that.showCartList(that.dataList);
            that.showCartTotal(that.dataList);
            $$("#cartThroughBar").show();
            $$("#cartEquation").show();
            $$("#cartFixBar").show();
            $$("#emptyCart").hide();
        }
        else {
            that.showCartEmpty();
        }
    },
    showCartEmpty: function () {
        "use strict";
        $$("#cartThroughBar").hide();
        $$("#cartEquation").hide();
        $$("#cartFixBar").hide();
        $$("#emptyCart").show();
        $$("#cartList_v1").html("");
    },
    forMateDBData: function (list) {
        var that = this;
        var i = 0, len = list.length;
        for (; i < len; i++) {
            that.dataPos[i]=1;
        }
        return list;
    },
    showCartList: function (list) {
        var that = this;
        var i = 0, len = list.length, htmlStr = "", temp;
        htmlStr += that.showCartListByGroup(list);
        $$("#cartList_v1").html(htmlStr);
    },
    showCartTotal: function (list) {
        var that = this;
        var i = 0, len = list.length, htmlStr = "", temp1, temp2;
        //总价，满减，实付
        var allT = 0 , allM = 0 , allP = 0;
        temp1 = that.caculateTotal(list);
        allT += temp1.allTotal;
        htmlStr = that.cartTotal1.replace("{{ALLGOODNUM}}", temp1.allNum).replace("{{REALTOTAL}}", util.parse2Num(temp1.allMenoy));
        allP += temp1.allMenoy;
        $$("#cartTotalLi").html(htmlStr);
        //等式
        allT = util.parse2Num(allT);
        allM = util.parse2Num(allM);
        allP = util.parse2Num(allP);
        var allDis = util.parse2Num(allT - allM - allP);
        var str = (allM === "0.00") ? "￥" + allT + "-" + "￥" + allDis + "=" + "￥" + allP : "￥" + allT + "-" + "￥" + allDis + "-" + "￥" + allM + "=" + "￥" + allP
        $$("#cartEquation").html(str);
        //下边框
        $$("#cartFixBarPrice").html(allP);
        $$("#cartFixBarDiscount").html(util.parse2Num(allT - allP));

        that.salePrice = allP;
        that.saleDiscount = allM;
    },
    showCartListByGroup: function (listObj) {
        var that = this;
        var template = Template7.compile(that.groupTpl);
        var list = listObj;
        var htmlStr = template(listObj);

        var tpl = $$("#newCartV1_1HelperTpl").html();
        var tpls1 = $$("#newCartV1_1Helper1Tpl").html(),
            tpls2 = $$("#newCartV1_1Helper2Tpl").html(),
            tpla1 = $$("#newCartV1_1Helper3Tpl").html(),
            tpla2 = $$("#newCartV1_1Helper4Tpl").html();

        var i= 0,len= list.length;
        var listHtml = "";
        console.log(list);
        for(;i<len;i++){
            listHtml += tpl.replace(/\{\{index\}\}/g, i)
                .replace("{{GOODSIMGPATH}}",list[i].GOODSIMGPATH)
                .replace("{{GOODSGROUPTITLE}}",list[i].GOODSGROUPTITLE)
                .replace("{{GOODSPRICE}}",list[i].GOODSPRICE)
                .replace("{{FILTERCONFIG}}",list[i].FILTERCONFIG)
                .replace("{{GOODSSALEPRICE}}",list[i].GOODSSALEPRICE)
                .replace("{{GOODSNUM}}",list[i].GOODSNUM)
                .replace("{{goodsnum-sub}}",(list[i].GOODSNUM === 1 ? tpls1 : tpls2).replace(/\{\{index\}\}/g,i))
                .replace("{{goodsnum-add}}",(list[i].GOODSNUM === list[i].MAXCOUNT ? tpla1 : tpla2).replace(/\{\{index\}\}/g,i))
        }

        htmlStr = that.groupTpl.replace("{{inner}}",listHtml);

        return htmlStr;
    },
    //计算总价和总数
    caculateTotal: function (listObj, index) {
        var that = this;
        var allMenoy = 0, allNum = 0, allTotal = 0;
        var i = 0, len = listObj.length, temp = null;
        for (; i < len; i++) {
            temp = listObj[i];
            allMenoy += temp.GOODSNUM * temp.GOODSSALEPRICE * that.dataPos[i];
            allNum += temp.GOODSNUM * that.dataPos[i];
            allTotal += temp.GOODSNUM * temp.GOODSPRICE * that.dataPos[i];
        }
        return {
            allMenoy: allMenoy,
            allNum: allNum,
            allTotal: allTotal
        };
    },
    changeGoodsNum: function (eqi, type) {
        var that = this;
        var num = that.dataList[eqi].GOODSNUM;
        var maxCount = parseInt(that.dataList[eqi].MAXCOUNT);
        var _str = eqi;

        if (type === -1 && num <= 1) {
            //这里本来是有提示的
            return;
        }
        else if (type === 1 && num >= maxCount) {
            //这里本来是有提示的
            return;
        }

        if (1 <= num && num <= maxCount) {
            num = (type === -1 ? num - 1 : num + 1);
            $$("#cartNum_" + _str).html(num);
            that.dataList[eqi].GOODSNUM = num;
            if (num === 1) {
                $$("#goodsSub_" + _str).removeClass("active");
                $$("#goodsAdd_" + _str).addClass("active");
            }
            else if (num === maxCount) {
                $$("#goodsSub_" + _str).addClass("active");
                $$("#goodsAdd_" + _str).removeClass("active");
            }
            else {
                $$("#goodsSub_" + _str).addClass("active");
                $$("#goodsAdd_" + _str).addClass("active");
            }
            return true;
        }
        return;
    },
    deleteCart: function (eqi) {
        "use strict";
        var that = this;
        hiApp.showIndicator();
        if (userObj.isExist()) {
            util.getAjaxData({
                url: appConfig.DELETECARTONE,
                type: 'post',
                data: {
                    loginId: userObj.ID,
                    goodsId: that.dataList[eqi].ID
                },
                error: function () {
                    hiApp.hideIndicator();
                    return false;
                },
                success: function (json) {
                    console.log(json);
                    hiApp.hideIndicator();

                    var queryObj = util.getRequest(window.location.href);
                    that.showCart(queryObj.v);
                    //TODO : 清楚redis操作，默认一定会成功
                }
            });
        }
        else {
            //删除本地购物车
            hiApp.hideIndicator();
            try{
                var templist =[],goodslistStr;
                if(app_type === "web"){
                    if(util.getCookie("localCart"))
                        goodslistStr = util.getCookie("localCart");
                }else{
                    if(localStorage.getItem("localCart"))
                        goodslistStr = localStorage.getItem("localCart");
                }
                if(goodslistStr){
                    templist = JSON.parse(goodslistStr);
                }
                var deleID = that.dataList[eqd].GOODSLIST[eqi].ID;
                var deleIndex = -1;
                for(var i= 0,len=templist.length ;i<len;i++){
                    if(templist[i].Id === deleID){
                        deleIndex = i;
                        break;
                    }
                }

                if(deleIndex != -1){
                    templist.splice(deleIndex,1);

                    if(templist.length === 0){

                        if(app_type === "web"){
                            util.clearCookie("localCart");
                            util.clearCookie("addCartTime");
                        }
                        else{
                            localStorage.removeItem("localCart");
                            localStorage.removeItem("addCartTime");
                        }

                    }
                    else{
                        if(app_type === "web"){
                            util.setCookie('localCart', JSON.stringify(templist),1,null,"/",null);
                        }else{
                            util.setLocalStorage('localCart', JSON.stringify(templist));
                        }
                    }

                    var queryObj = util.getRequest(window.location.href);
                    that.showCart(queryObj.v);
                }
            }catch (e){

            }

        }
    },
    //倒计时
    setCartDowntime: function (time) {
        //TODO ：页面切换时清空计时器
        //TODO:计时器停止时需要清空页面
        "use strict";
        var that = this;
        util.diffTimer(time || 3600, that.showCartEmpty, $$('#cartSecond'), $$('#cartMin'))
    },
    //获取数量和时间
    getGoodsNumAndTime: function (callback) {
        "use strict";
        var that = this;
        if (userObj.isExist()) {
            var data = "";
            util.getAjaxData({
                url: appConfig.GETCARTLIST,
                method: 'post',
                data: {
                    loginId: userObj.ID
                },
                error: function () {
                    return false;
                },
                success: function (json) {
                    data = JSON.parse(json);
                    data = that.formatDateForNumTime(data.DATA);
                    data && callback(data);
                }
            });
        }
        else {
            var goodslistStr = "";

            if(app_type === 'web'){
                goodslistStr = util.getCookie("localCart");
            }
            else{
                goodslistStr = localStorage.getItem("localCart");
            }


            var num = 0;
            if (goodslistStr) {
                try {
                    var goodslist = JSON.parse(goodslistStr);

                    var i = 0, len = goodslist.length;
                    for (; i < len; i++) {
                        num += parseInt(goodslist[i].num);
                    }
                }
                catch (e) {
                    num = 0
                }
            }
            else {
                num = 0
            }
            var _outtime = that.caculateTime();
            var data = {
                NUM: num,
                OUTTIME: _outtime
            };
            callback(data);
        }
    },
    caculateTime:function(){
        var _outtime = "";

        if(app_type === "web"){
            _outtime = util.getCookie("addCartTime");
        }
        else{
            _outtime = localStorage.getItem("addCartTime");
        }


        //如果存在此字段
        if (_outtime) {
            _outtime = ((new Date()).getTime() - parseInt(_outtime)) / 1000;
            //如果超过3600s
            _outtime = 3600 - _outtime;
            _outtime = _outtime < 0 ? 0 : _outtime;
        }
        else {
            _outtime = 0;
        }
        return _outtime;
    },
    formatDateForNumTime: function (data) {
        "use strict";
        console.log(data);
        var that = this, list = data.DATA;
        if (list && list.length) {
            var i = 0, len = list.length;
            var num = 0;
            for (; i < len; i++) {
                num += list[i].GOODSNUM;
            }
            return {
                NUM: num,
                OUTTIME: data.OUTTIME
            }
        }
        else {
            return {
                NUM: 0,
                OUTTIME: 0
            }
        }

    },
    formatLocalListForBatch: function (param1, param2) {
        "use strict";
        var key1 = param1 || "goodsActionId";
        var key2 = param2 || "num";
        var goodslistStr = "";
        if(app_type === "web"){
            goodslistStr = util.getCookie("localCart");
        }
        else{
            goodslistStr = localStorage.getItem("localCart");
        }

        var templist = [];
        if (goodslistStr) {
            try {
                var goodslist = JSON.parse(goodslistStr);
                var i, len, obj;
                for (i = 0, len = goodslist.length; i < len; i++) {
                    obj = {};
                    obj[key1] = goodslist[i].Id;
                    obj[key2] = goodslist[i].num || 1;
                    templist.push(obj);
                }
                return templist;
            } catch (e) {
                if(app_type === "web"){
                    util.clearCookie("localCart");
                    util.clearCookie("addCartTime");
                }
                else{
                    localStorage.removeItem("localCart");
                    localStorage.removeItem("addCartTime");
                }

                return templist;
            }
        } else {
            return templist;
        }
    },
    batchChangeGoodsNum: function (userId, datalist, autoLogin) {
        "use strict";
        console.log(datalist);
        util.getAjaxData({
            url: appConfig.BATCHCHANGECART_URL_1,
            type: 'post',
            data: {
                loginid: userId,
                goodslist: JSON.stringify(datalist)
            },
            error: function (e) {
                loginRegisterObj.loginGoToHelper(autoLogin);
                return false;
            },
            success: function (json) {
                console.log(json);
                var jsons = JSON.parse(json);
                if (jsons.STATUSCODE === statusCode.SUCCESS) {
                    //同步完之后，清空本地记录
                    if(app_type === "web"){
                        util.clearCookie("localCart");
                        util.clearCookie("addCartTime");
                    }
                    else{
                        localStorage.removeItem("localCart");
                        localStorage.removeItem("addCartTime");
                    }

                    //Caution：这里其实有问题，部分失败没有处理
                    //返回结果中有个list，表明每一样是否成功
                }
                else {
                    hiApp.alert("批量同步购物车失败~");
                }
                loginRegisterObj.loginGoToHelper(autoLogin);
            }
        });
    },
    //将选中物品记在本地并下单
    setLocalOrderGoods: function () {
        "use strict";
        var list = [], that = this;

        var i = 0, len = that.dataList.length;

        for (; i < len; i++) {
            if ($$("#cartSelect_" + i ).hasClass("selected")) {
                list.push(that.dataList[i]);
            }
        }

        if (list.length > 0) {
            //TODO：这里可能会有同步问题
            util.setSessionStorage('orderlist', JSON.stringify(list));
            util.setSessionStorage('orderlistprice', JSON.stringify(that.salePrice));
            util.setSessionStorage('saleDiscount', JSON.stringify(that.saleDiscount));

            return true;
        }
        else {
            return false;
        }
    }
};
