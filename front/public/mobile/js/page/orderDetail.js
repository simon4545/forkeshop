/**
 * Created by Administrator on 15-7-15.
 */
var orderDetailObj = {
    orderID: "",
    tpl: "",
    wuliuTpl:"",
    wuliuHelperTpl : "",
    page: ".orderdetail-page ",
    reMinderTpl:"",
    orderinfo: null,
    init: function () {
        "use strict";
        var that = this;
        that.tpl = $$("#orderdetailtemplate").html();
        that.wuliuTpl = $$("#wuliuTemplate").html();
        that.wuliuHelperTpl = $$("#wuliuTemplateHelper").html();
        that.reMinderTpl = $$("#orderDetailReminderTpl").html();
    },
    bindEvent: function () {
        "use strict";
        var that = this;

        //取消或删除订单
        bindTapEvent(that.page, '#orderDetailCancel', function (_this) {

            var str = $$("#orderDetailCancelWord").html();
            if (str === "取消订单") {
                hiApp.confirm("确定要取消订单，亲？","提示",function(){
                    orderDetailObj.cancelOrder();
                },function(){

                });
            }
            else if (str === "删除订单") {
                hiApp.confirm("确定要删除订单，亲？","提示",function(){
                    orderDetailObj.deleteOrder();
                },function(){

                });

            }
            else if(str === "确认收货"){
                hiApp.confirm("确定已经收到货了亲？未收到不要点确定哦~","提示",function(){
                    orderDetailObj.getConfirm();
                },function(){

                });
            }
        });

        bindTapEvent(that.page, '#orderDetailGoPay', function (_this) {
            orderDetailObj.goToPay();
        });

        bindTapEvent(that.page, '.goto-express', function (_this) {
            var oid = $$(_this).attr("oId"),ename = $$(_this).attr("ename"),ecode = $$(_this).attr("ecode");
            var epinyin = $$(_this).attr("epinyin");
            mainView.router.loadPage({
                url:"page/expressInfo.html",
                query: {
                    oid:oid,
                    epinyin:epinyin,
                    ename : ename,
                    ecode : ecode
                }
            });
        });

        //后退处理
        bindTapEvent(that.page, '#orderDetailBack', function (_this) {
            if (mainView.history.length > 2) {
                mainView.router.back();
            }
            else {
                mainView.router.loadPage("page/index.html");
            }
        });
    },
    formatDataForShow: function (obj) {
        "use strict";
        var that = this;
        var list = [], i = 0, len = obj.ORDERDETAIL.length;
        var tempObj = null;
        for (; i < len; i++) {
            tempObj = {};
            console.log(obj.ORDERDETAIL);
            tempObj.GOODSIMGPATH = obj.ORDERDETAIL[i].GOODSIMGPATH;
            tempObj.GOODSGROUPTITLE = obj.ORDERDETAIL[i].GOODSTITLE;
            tempObj.GOODSCOSTPRICE = obj.ORDERDETAIL[i].GOODSCOSTPRICE;
            tempObj.FILTERCONFIG = obj.ORDERDETAIL[i].GOODSFILTERCONFIG[0];
            tempObj.GOODSSALEPRICE = obj.ORDERDETAIL[i].GOODSSALEPRICE;
            tempObj.GOODSNUM = obj.ORDERDETAIL[i].GOODSNUM;
            tempObj.__HREF = "page/detail.html?id="+obj.ORDERDETAIL[i].GOODSACTIONID+"&groupId="+obj.ORDERDETAIL[i].GOODSGROUPID;
            list.push(tempObj);
        }

        var reMindStr = "";
        if(obj.ORDERPROGRESSSTATE == 3 || obj.ORDERPROGRESSSTATE == 4 ){
            reMindStr = that.reMinderTpl.replace("{{ORDERCODE}}",obj.ORDERCODE);
        }

        //TODO : 支付截止时间
        var showObj = {
            ORDERPROGRESSINFO: obj.ORDERPROGRESSINFO,
            ORDERCODE: obj.ORDERCODE,
            List: list,
            ORDERTOTALDISCOUNT : obj.ORDERTOTALDISCOUNT,
            ORDERTOTALPRICE: obj.ORDERTOTALPRICE,
            CREATETIME: obj.CREATETIME,
            REMARKS: obj.REMARKS || "订单备注...",
            DEADLINE: "",
            REMINDBTN : reMindStr
        }

        return showObj;
    },
    getShowData: function (orderId,msg) {
        "use strict";
        var that = this;

        //先获取orderID，url带过来，没带过来自己去取
        if(!orderId){
            var obj = JSON.parse(sessionStorage.getItem("orderData"));
            orderId = obj.ORDERID;
        }

        if (orderId) {
            if (userObj.isExist()) {
                //如果不换浏览器，是可以拿到用户ID的
                //增加这个分支，是为了处理支付之后跳转过来的场景
                util.getAjaxData({
                    url: appConfig.ORDERTAIL_URL,
                    type: 'post',
                    data: {
                        loginId: userObj.isExist(),
                        orderId: orderId
                    },
                    error: function () {
                        hiApp.hideIndicator();
                        return false;
                    },
                    success: function (json) {
                        var dataObj = JSON.parse(json);
                        if(dataObj.STATUSCODE == 200){
                            that.showDetail(dataObj.DATA);
                        }
                    }
                });
            }
            else {
                //什么也不做
                //TODO ： 后续给提示 ?
                //理论上这里是进不来的，如果没有userID，会在页面加载时拦截掉
                return ;
            }
        }
        else{
            //TODO：这个错误怎么处理？
            //虽然理论上不会走到这儿
            return ;
        }
    },
    showDetail: function (objStr) {
        "use strict";
        var that = this;
        var obj = JSON.parse(objStr);
        that.orderinfo = obj;
        that.orderID = obj.ORDERID;

        var showObj = that.formatDataForShow(obj);

        var template = Template7.compile(that.tpl);
        var htmlStr = template(showObj);
        $$("#orderShowArea").html("").append(htmlStr);

        $$("#wuliuBlock").show();
        var showData = {
            wuliuList : obj.EXPRESS,
            CONSIGNEENAME:obj.ORDERDETAIL[0].CONSIGNEENAME,
            CONSIGNEEMOBILE:obj.ORDERDETAIL[0].CONSIGNEEMOBILE,
            CONSIGNEEADDRESS:obj.ORDERDETAIL[0].CONSIGNEEADDRESS,
            ORDERID : obj.ORDERID
        }
        that.showWuliuAndAddress(showData);

        //待支付
        if (obj.ORDERPROGRESSSTATE == "1") {
            $$("#orderDetailFixBar").show();
            $$("#orderDetailGoPay").show();
            var num = util.parse2Num(obj.ORDERTOTALPRICE);
            $$("#orderDetailPayVal").html("￥" + num);
        }
        else {
            $$("#orderDetailFixBar").hide();
            $$("#orderDetailGoPay").hide();
        }

        //已完成
        if (obj.ORDERPROGRESSSTATE == "9" || obj.ORDERPROGRESSSTATE == "19" || obj.ORDERPROGRESSSTATE == "99") {
            $$("#orderDetailCancelWord").html("删除订单");
        }
        //待付款
        else if (obj.ORDERPROGRESSSTATE == "1") {
            $$("#orderDetailCancelWord").html("取消订单");
        }
        //待付款
        else if (obj.ORDERPROGRESSSTATE == "4") {
            $$("#orderDetailCancelWord").html("确认收货");
        }
        //占位
        else {
            $$("#orderDetailCancelWord").html("占位订单").css({visibility: "hidden"});
        }

    },
    showWuliuAndAddress:function(data){
        "use strict";
        var that = this;
        var wuliuHelperHtml="";
        var list = data.wuliuList;
        for(var i = 0,len = list.length;i<len;i++){
            wuliuHelperHtml += that.wuliuHelperTpl.replace(/\{\{EXPRESSNAME}}/g,list[i].EXPRESSNAME)
                .replace(/\{\{EXPRESSPY}}/g,list[i].EXPRESSALIASESNAME)
                .replace(/\{\{EXPRESSCODE}}/g,list[i].EXPRESSCODE)
                .replace("{{ORDERID}}",data.ORDERID)
        }
        var wuliuHtml = that.wuliuTpl.replace("{{wuliuHelper}}",wuliuHelperHtml)
            .replace("{{CONSIGNEENAME}}",data.CONSIGNEENAME)
            .replace("{{CONSIGNEEMOBILE}}",data.CONSIGNEEMOBILE)
            .replace("{{CONSIGNEEADDRESS}}",data.CONSIGNEEADDRESS);

        $$("#wuliuBlock").html("").append(wuliuHtml);
    },
    //取消订单
    cancelOrder: function () {
        "use strict";
        var that = this;
        var userId = userObj.isExist();
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.CANCELORDER_URL,
            type: 'post',
            data: {
                loginId: userId,
                orderId: that.orderID
            },
            error: function () {
                hiApp.hideIndicator();
                return false;
            },
            success: function (json) {
                hiApp.hideIndicator();
                var data = JSON.parse(json);
                console.log(json);
                if (statusCode.SUCCESS === data.STATUSCODE) {
                    hiApp.alert("订单取消成功~", "", function () {
                        mainView.router.back();
                    });
                }
                else {
                    hiApp.alert(data.MSG);
                }
            }
        });
    },
    goToPay: function () {
        "use strict";
        var that = this;
        payObj.goPay(that.orderinfo.ORDERDETAIL);
    },
    getConfirm: function () {
        var that = this;
        var userId = userObj.isExist();
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.CONFIRMGOODS,
            type: 'post',
            data: {
                loginId: userId,
                orderId: that.orderID
            },
            error: function () {
                hiApp.hideIndicator();
                return false;
            },
            success: function (json) {
                hiApp.hideIndicator();
                var data = JSON.parse(json);
                console.log(json);
                if (statusCode.SUCCESS === data.STATUSCODE) {
                    hiApp.alert("收货确认成功~", "", function () {
                        mainView.router.back();
                    });
                }
                else {
                    hiApp.alert(data.MSG);
                }
            }
        });
    },
    deleteOrder: function () {
        "use strict";
        var that = this;
        var userId = userObj.isExist();
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.DELETEORDER,
            type: 'post',
            data: {
                loginId: userId,
                orderId: that.orderID
            },
            error: function () {
                hiApp.hideIndicator();
                return false;
            },
            success: function (json) {
                hiApp.hideIndicator();
                var data = JSON.parse(json);
                console.log(json);
                if (statusCode.SUCCESS === data.STATUSCODE) {
                    hiApp.alert("订单删除成功~", "", function () {
                        mainView.router.back();
                    });
                }
                else {
                    hiApp.alert(data.MSG);
                }
            }
        });
    }
}