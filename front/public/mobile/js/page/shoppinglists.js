/**
 * Created by Administrator on 2015/7/10.
 */
/* globals $$: false,
 appConfig:false,
 util:false,
 hiApp:false,
 console:false，
 localStorage:false,
 Template7:false,
 userObj:false,
 mainView:false
 */
var shoppingListsObj = {
    tab: 1,
    page:".shoppinglists-page ",
    list1: null,
    list2: null,
    list3: null,
    list4: null,
    list5: null,
    list1Flag: 0,
    list2Flag: 0,
    list3Flag: 0,
    list4Flag: 0,
    list5Flag: 0,
    /* jshint strict: false */
    init: function () {
        var that = this;
        shoppingListsObj.bindEvents();
        /*//这里判断是否有抽奖机会，有的话提示他前去领取
        redpackObj.hasRaffleChance(function(){
            $$(that.page + ".loading-mask-shoppingList").show();
            $$(that.page + ".raffle-reminder-dialog").show();
        });*/
        //临时加入，不发货通知
        //$$(".loading-mask.main").show();
        //$$("#inform").show();
    },
    bindEvents: function () {
        var that = this,
            infiniteTime =1;

       /* //关闭抽奖提醒弹出框
        bindTapEvent(that.page, ".pop-dialog-close",function(){
            $$(that.page + ".loading-mask-shoppingList").hide();
            $$(that.page + ".raffle-reminder-dialog").hide();
        });
        //立即前往抽奖页面
        bindTapEvent(that.page, ".go-raffle-btn", function(){
            $$(that.page + ".loading-mask-shoppingList").hide();
            $$(that.page + ".raffle-reminder-dialog").hide();
            mainView.router.loadPage({
                url:'page/redpack.html'
            });
        });*/

        bindTapEvent('.shoppinglists-page','.tab-link',function(_this){
            var index = $$(_this).index() +1;
            shoppingListsObj.tab = index;
            switch (index){
                case 1:
                    shoppingListsObj.all.getData();break;
                case 2:
                    shoppingListsObj.pendingPayment.getData();break;
                case 3:
                    shoppingListsObj.inbound.getData();break;
                case 4:
                    shoppingListsObj.payments.getData();break;
                case 5:
                    shoppingListsObj.hadBought.getData();break;
            }
            var preloader= $$(that.page+".index-infinite-preloader");
            preloader.attr("contend-page", 1);
        });

        //在每个页面监听滚动条事件
        $$(that.page + ".page-content").on('scroll',function(){
            _onScroll(this, that.page);
        });

        // 注册'infinite'事件处理函数
        //上拉翻页
        $$(document).on('infinite', that.page+'.infinite-scroll', function (e) {
            infiniteTime++;
            if( infiniteTime==2){
                infiniteTime =0;
                e.stopPropagation();
                return false;
            }
            var preloader= $$(that.page+".index-infinite-preloader"),
                state,successCallBack;
            setTimeout(function () {
                if (preloader.css("display") == 'block') {
                    var chosePage = preloader.attr("contend-page");
                    chosePage++;
                    console.log('page'+chosePage);
                    preloader.attr("contend-page", chosePage).hide();
                    switch (that.tab){
                        case 1:
                            state = 0;
                            successCallBack = that.all.showList;
                            break;
                        case 2:
                            state = 1;
                            successCallBack = that.pendingPayment.showList;
                            break;
                        case 3:
                            state = 3;
                            successCallBack = that.inbound.showList;
                            break;
                        case 4:
                            state = 5;
                            successCallBack = that.payments.showList;
                            break;
                        case 5:
                            state = 9;
                            successCallBack = that.hadBought.showList;
                            break;
                    }
                    shoppingListsObj.getOrderList(state, successCallBack, chosePage);
                }
            }, 500);
        });
    },

    //这个函数是给进入此页面时调用，故所有状态重置重新加载
    showTab: function () {
        var that = this;
        switch (that.tab) {
            case 1:
                $$("#tab1_click").click();
                break;
            case 2:
                $$("#tab2_click").click();
                break;
            case 3:
                $$("#tab3_click").click();
                break;
            case 4:
                $$("#tab4_click").click();
                break;
            case 5:
                $$("#tab5_click").click();
                break;
        }
    },
    gotoOrderList: function (goodsItem) {
        for (var item in shoppingListsObj._listData) {
            if (item === goodsItem.toUpperCase()) {
                util.setSessionStorage("orderData", JSON.stringify(shoppingListsObj._listData[item]));
                var timeout = setTimeout(function(){
                    clearTimeout(timeout);
                    mainView.router.loadPage('page/orderDetail.html');
                },10);
                break;
            }
        }
    },

    _listData: null,

    showList: function (data, domId) {
        var that = this;
        try {
            var evalData = data;
            console.log(evalData);
            shoppingListsObj._listData = evalData;
            var template = $$('#shoppingListTpl').html();

            var html_arr = [];

            var data2 = null, list2 = null, i = 0, len = 0,
                preloader= $$(that.page+".index-infinite-preloader"),_thispage;
            _thispage = preloader.attr("contend-page");

            var tempTpl = $$('#shoppingListInnerTpl').html();

            for (var item in evalData) {
                if (evalData.hasOwnProperty(item)) {

                    data2 = evalData[item];
                    list2 = data2.ORDERDETAIL;
                    for (i = 0, len = list2.length; i < len; i++) {
                        list2[i].GOODSCOSTPRICE = util.parse2Num(list2[i].GOODSCOSTPRICE);
                        list2[i].GOODSSALEPRICE = util.parse2Num(list2[i].GOODSSALEPRICE);
                    }
                    data2.ORDERTOTALPRICE = util.parse2Num(data2.ORDERTOTALPRICE);

                    var tempList = data2.ORDERDETAIL;
                    var innerStr = "",j= 0,lenj= 0,strj="";
                    for(i=0,len = tempList.length ; i<len ;i++){

                        for(strj="",j=0,lenj= tempList[i].GOODSFILTERCONFIG.length;j<lenj;j++){
                            strj += tempList[i].GOODSFILTERCONFIG[j];
                        }

                        innerStr += tempTpl.replace("{{ID}}",tempList[i].ID)
                            .replace("{{GOODSIMGPATH}}",tempList[i].GOODSIMGPATH)
                            .replace("{{GOODSTITLE}}",tempList[i].GOODSTITLE)
                            .replace("{{GOODSCOSTPRICE}}",tempList[i].GOODSCOSTPRICE)
                            .replace("{{GOODSFILTERCONFIG}}",strj)
                            .replace("{{GOODSSALEPRICE}}",tempList[i].GOODSSALEPRICE)
                            .replace("{{GOODSNUM}}",tempList[i].GOODSNUM);
                    }

                    var bottomStr = "";
                    if(data2.ORDERPROGRESSSTATE === '1' ){
                        //待付款
                        bottomStr =  $$('#shoppingListHelper1Tpl').html().replace("{{ORDERID}}",data2.ORDERID);
                    }
                    else if(data2.ORDERPROGRESSSTATE === '2'){
                        //待配货状态下退货
                        bottomStr =  $$('#shoppingListHelper2-1Tpl').html().replace("{{ORDERID}}",data2.ORDERID);;
                    }
                    else if(data2.ORDERPROGRESSSTATE === '3'){
                        //发货中
                        bottomStr =  $$('#shoppingListHelper2Tpl').html();
                    }
                    else if(data2.ORDERPROGRESSSTATE === '4' ){
                        //待签收
                        var tempStr = shoppingListsObj.getRefundBtnHtml(data2);
                        bottomStr =  $$('#shoppingListHelper3Tpl').html().replace("{{ORDERID}}",data2.ORDERID).replace("{{saBtn}}",tempStr);
                    }
                    else if(data2.ORDERPROGRESSSTATE === '5' ){
                        //待退款
                        bottomStr =  $$('#shoppingListHelper4Tpl').html();
                    }
                    else if(data2.ORDERPROGRESSSTATE === '9' ){
                        //交易完成
                        var tempStr = shoppingListsObj.getRefundBtnHtml(data2);
                        bottomStr =  $$('#shoppingListHelper5Tpl').html().replace("{{ORDERID}}",data2.ORDERID).replace("{{saBtn}}",tempStr);
                    }
                    else if(data2.ORDERPROGRESSSTATE === '19' || data2.ORDERPROGRESSSTATE === '99' ){
                        //19已退款，99已过期
                        bottomStr =  $$('#shoppingListHelper6Tpl').html().replace("{{ORDERID}}",data2.ORDERID);
                    }

                    var tempHtml = template.replace("{{ORDERCODE}}",data2.ORDERCODE)
                        .replace("{{ORDERPROGRESSINFO}}",data2.ORDERPROGRESSINFO)
                        .replace("{{ORDERDETAIL}}",innerStr)
                        .replace("{{ORDERTOTALNUM}}",data2.ORDERTOTALNUM)
                        .replace("{{ORDERTOTALPRICE}}",data2.ORDERTOTALPRICE)
                        .replace("{{bottom}}",bottomStr);

                    html_arr.push(tempHtml);

                }
            }
            console.log(_thispage);
            if (html_arr.length === 0 &&  _thispage == 1) {
                //如果为空，page =1
                $$(that.page + "#" + domId).html('<div class="content-block"><div class="emptyList"><img src="img/noOrder.png" /></div></div>');
            }else if(html_arr.length !== 0 &&  _thispage >= 1){
                //如果不为空,且page>=1
                $$(that.page + "#" + domId).append(html_arr.join(''));
            }

            if(html_arr.length === 0 || html_arr.length < 10){
                $$(that.page + ".index-infinite-preloader").hide();
            }else{
                $$(that.page+".index-infinite-preloader").show();
            }

            //加入这段是为了解决TAB同高造成滚动的问题
            console.log(that.tab);
            for (var i = 1; i <= 5; i++) {
                if (i !== that.tab) {
                    $$(that.page + "#shoppinglist_tab" + i).html("");
                }else{
                }
            }

        } catch (e) {

        }
    },

    //全部
    all: {
        getData: function () {
            shoppingListsObj.getOrderList(0, shoppingListsObj.all.showList);
        },
        showList: function (data) {
            hiApp.hideIndicator();
            shoppingListsObj.list1 = data;
            shoppingListsObj.list1Flag = 1;
            shoppingListsObj.showList(data, "shoppinglist_tab1");
        }
    },

    //待付款
    pendingPayment: {
        getData: function () {
            shoppingListsObj.getOrderList(1, shoppingListsObj.pendingPayment.showList);
        },
        showList: function (data) {
            hiApp.hideIndicator();
            shoppingListsObj.list2 = data;
            shoppingListsObj.list2Flag = 1;
            shoppingListsObj.showList(data, "shoppinglist_tab2");
        },
        //TODO：支付
        inboundEvents: function (orderid) {
            for (var item in shoppingListsObj._listData) {
                if (item === orderid.toUpperCase()) {
                    payObj.goPay(shoppingListsObj._listData[item].ORDERDETAIL);
                }
            }
        }
    },

    //待收货
    inbound: {
        getData: function () {
            shoppingListsObj.getOrderList(3, shoppingListsObj.inbound.showList);
        },
        showList: function (data) {
            hiApp.hideIndicator();
            shoppingListsObj.list3 = data;
            shoppingListsObj.list3Flag = 1;
            shoppingListsObj.showList(data, "shoppinglist_tab3");
        },
        //退货
        reBackEvents : function (oid){
            mainView.router.loadPage('page/reBackOn2.html?oid='+oid);
        },
        //确认收货
        inboundEvents: function (orderid) {
            var _usr = userObj;
            var data = {};
            data.loginid = _usr.ID;
            data.orderid = orderid;
            hiApp.confirm('确认已收到货物？','提示',function(){
                $$(shoppingListsObj.page+".index-infinite-preloader").attr("contend-page",1);
                var req = {
                    url: appConfig.CONFIRMGOODS,
                    type: "post",
                    data: data,
                    success: shoppingListsObj.eventCallBack
                };
                util.getAjaxData(req, 3);
            },function(){

            });
        }
    },

    //退款中
    payments: {
        getData: function () {
            shoppingListsObj.getOrderList(5, shoppingListsObj.payments.showList);
        },
        showList: function (data) {
            hiApp.hideIndicator();
            shoppingListsObj.list4 = data;
            shoppingListsObj.list4Flag = 1;
            shoppingListsObj.showList(data, "shoppinglist_tab4");
        }
        //聯繫客服
    },

    //已买到
    hadBought: {
        getData: function () {
            shoppingListsObj.getOrderList(9, shoppingListsObj.hadBought.showList);
        },
        showList: function (data) {
            hiApp.hideIndicator();
            shoppingListsObj.list5 = data;
            shoppingListsObj.list5Flag = 1;
            shoppingListsObj.showList(data, "shoppinglist_tab5");
        },
        //刪除
        deleteEvents: function (orderid) {
            var _usr = userObj;
            var data = {};
            data.loginid = _usr.ID;
            data.orderid = orderid;
            hiApp.confirm('确认删除此订单？','提示',function(){
                $$(shoppingListsObj.page+".index-infinite-preloader").attr("contend-page",1);
                var req = {
                    url: appConfig.DELETEORDER,
                    type: "post",
                    data: data,
                    success: shoppingListsObj.eventCallBack
                };
                util.getAjaxData(req, 3);
            },function(){

            });
        }
    },

    //页面事件点击后的回调
    eventCallBack: function () {
        var that = this;
        var domId = $$(shoppingListsObj.page+".active").attr("id");
        switch (domId) {
            case "tab1_click":
                shoppingListsObj.all.getData();
                break;
            case "tab2_click":
                shoppingListsObj.pendingPayment.getData();
                break;
            case "tab3_click":
                shoppingListsObj.inbound.getData();
                break;
            case "tab4_click":
                shoppingListsObj.payments.getData();
                break;
            case "tab5_click":
                shoppingListsObj.hadBought.getData();
                break;
        }
    },

    //订单列表请求
    getOrderList: function (orderState, success, page) {
        var _usr = userObj;
        var data = {};
        var that = this;
        data.loginId = userObj.isExist();
        if (orderState !== 0) {
            data.orderState = orderState;
        }
        if(!page){
            page = 1;
            for(var i = 1; i<6; i++){
                $$(that.page+"#shoppinglist_tab"+i).html("");
            }
        }
        data.pageNum = page;
        var req = {
            url: appConfig.GETORDERSLIST_URL,
            type: "post",
            data: data,
            success: function(ret){
                if(ret){
                    ret = JSON.parse(ret);
                    if(ret.STATUSCODE == 200){
                        success && success(ret.DATA);
                    }
                }

            }
        };
        hiApp.showIndicator();
        util.getAjaxData(req, 3);
    },

    getRefundBtnHtml:function(data2){
        var tpl1 = '<div class="pay-btn" style="margin-right: 10px;"><span style="color: #333333"><a href="{{saleAfter}}" style="color:#5c5c5c;">申请售后</a></span></div>';
        var tpl2 = '<div class="pay-btn" style="margin-right: 10px;"><span style="color: #333333"><a href="{{saleAfter}}" style="color:#5c5c5c;">退款查看</a></span></div>';
        var tpl = "";
        var hrefStr = "";
        var tempStr = "";
        //待签收
        if(data2.REFUNDID){
            if(data2.REFUNDPROGRESSSTATE == 0){
                //待审核，带参数，可撤回
                hrefStr = "page/reBackChecking.html?refundId=" + data2.REFUNDID;
                tpl = tpl2;
            }
            else if(data2.REFUNDPROGRESSSTATE == 1){
                //待寄回，带参数
                hrefStr = "page/reBackAddress.html?refundId=" + data2.REFUNDID;
                tpl = tpl2;
            }
            else if(data2.REFUNDPROGRESSSTATE == 2){
                //待退钱,显示退回信息
                hrefStr = "page/reBackWaiting.html?orderCode=" + data2.ORDERCODE;
                tpl = tpl2;
            }
            else if(data2.REFUNDPROGRESSSTATE == 4){
                //不同意退钱，带参数，要查详情，显示理由
                hrefStr = "page/reBackCheckFail.html?refundId=" + data2.REFUNDID + "&id=" + data2.ORDERID ;
                tpl = tpl2;
            }
            else if(data2.REFUNDPROGRESSSTATE == 3){
                //已退款
                hrefStr = "page/reBackOver.html";
                tpl = tpl2;
            }
            else if(data2.CANREFUND){
                //可退
                hrefStr = "page/reBackOn9.html?orderCode=" + data2.ORDERCODE + "&id=" + data2.ORDERID;
                tpl = tpl1;
            }
        }
        else if(data2.CANREFUND){
            //可退
            hrefStr = "page/reBackOn9.html?orderCode=" + data2.ORDERCODE + "&id=" + data2.ORDERID;
            tpl = tpl1;
        }
        if(hrefStr){
            tempStr = tpl.replace("{{saleAfter}}",hrefStr);
        }
        return tempStr;
    }
};