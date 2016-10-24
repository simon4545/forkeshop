/* globals $$: false,appConfig:false,util:false,hiApp:false,console:false,mainView:false,
 alert:false,define:false,newIndexObj:false,myAddressObj:false,loginRegisterObj:false,userCenterObj:false,
 activityObj:false,detailObj:false,classifyObj:false,Template7:false,userObj:false,bindTapEvent:false*/

var orderConfirmObj = {
    goodsList: {},
    coupons: [],
    couponIndex: null,
    listTpl: "",
    couponTpl: "",
    listHtmlObj: null,
    price: 0,
    saleDiscount: 0,
    address: "",
    addressList: [],
    //已选择地址的index值
    addressIndex: 0,
    page: ".orderconfirm-page",
    clickFlag: 0,
    tpl1 : '<div id="useCoupon" class="item-title">已使用优惠券，立减<a id="orderConfirmDisCount">{{PricePair}}</a>元<a class="couponbtn">优惠券</a></div>',
    tpl2 : '<div id="useCoupon" class="item-title">未使用优惠券 <a class="couponbtn">优惠券</a></div>',
    init: function () {
        "use strict";
        var that = this;
        that.listTpl = $$("#orderconfirmtemplate").html();
        that.couponTpl = $$("#orderConfirmCoupons1").html();
        that.clickFlag = 0;
        //临时加入，不发货通知
       // $$(".loading-mask.main").show();
       // $$("#inform").show();
    },
    bindEvent: function () {
        "use strict";
        var that = this;
        //收货地址选择
        bindTapEvent(that.page, '#orderConfirmAddress', function (_this) {
            if (!that.address) {
                mainView.router.loadPage('page/addressAdd.html');
            }
            else {
                mainView.router.loadPage({
                    query: {
                        index: that.addressIndex
                    },
                    url: 'page/addressSelect.html'
                });
            }
        });
            //支付方式
        bindTapEvent(that.page, "#payTypeUl li", function (_this) {
            var num = $$(_this).attr("eq");
            $$(".paytypelab").removeClass("selected");
            $$("#paytype" + num).addClass("selected");
        });

        //下订单,支付
        bindTapEvent(that.page, '#orderconfirmgotopay', function (_this) {
            var data = orderConfirmObj.checkDatabeforeCommit();
            if (data && !that.clickFlag) {
                var str = '请确认下单信息是否正确，提交后不支持更改~';
               /* var str = '请确认下单信息是否正确，提交后不支持更改<br/>(<font style="color: #f60;font-weight: bold">重要通知：</font>亲爱的百宝香会员，您好！年关将至，从本日起，' +
                    '<font style="color: #f60;font-weight: bold">部分偏远地区</font>物流公司将停止发货，'+
                '故此期间购买的<font style="color: #f60;font-weight: bold">部分</font>商品可能无法正常发货，预计会推迟至2-15日发货，谢谢您的谅解！~)';*/
                hiApp.confirm(str,"提示",function(){
                    that.clickFlag = 1;
                    payObj.creatOrder(data);
                    hiApp.showIndicator();
                });
            }
        });

        //不在微信环境下不显示微信
        if (app_type == 'web' &&  navigator.userAgent.toLowerCase().indexOf('micromessenger') == -1) {
            $$(that.page + " .weixin-pay").hide();
            $$(that.page + " #paytype0").addClass("selected");
        }



    },
    showOrder: function (pageFrom, data,index) {
        "use strict";
        var that = this, agentIdText = "", agentShow = "";

        that.clickFlag = 0;
        hiApp.hideIndicator();
        //获取list

        that.goodsList = that.formatDataForShow(JSON.parse(sessionStorage.getItem("orderlist")));
        that.price = util.parse2Num(JSON.parse(sessionStorage.getItem("orderlistprice")));
        that.saleDiscount = util.parse2Num(JSON.parse(sessionStorage.getItem("saleDiscount")) || 0);

//        that.goodsList = that.formatDataForShow(JSON.parse(localStorage.getItem("orderlist")));
//        that.price = util.parse2Num(JSON.parse(localStorage.getItem("orderlistprice")));
//        that.saleDiscount = util.parse2Num(JSON.parse(localStorage.getItem("saleDiscount")) || 0);

        //获取agentId
        if(app_type =='web'){
            if (util.getCookie('agentId')) {
                agentIdText = util.getCookie('agentId');
            } else {
                agentShow = 'display:none';
            }
        }else{
            if (localStorage.getItem('agentId')) {
                agentIdText = localStorage.getItem('agentId');
            } else {
                agentShow = 'display:none';
            }
        }

        //展示
        var template = Template7.compile(that.listTpl);
        var htmlStr = template({
            List: that.goodsList,
            GOODSTOTAL: that.price,
            SALEDISCOUNT: that.saleDiscount,
            agentIdText: agentIdText,
            agentShow: agentShow
        });
        that.listHtmlObj = $$(htmlStr);
        $$("#orderConfirmlist").html("").append(that.listHtmlObj);
        $$("#orderConfirmTotal").html("合计：￥" + util.parse2Num(that.price));
        that.getAddress(pageFrom, data,index);

    },
    formatDataForShow: function (list) {
        var i = 0, len = list.length;
        for (; i < len; i++) {
            list[i].GOODSPRICE = util.parse2Num(list[i].GOODSPRICE);
            list[i].GOODSSALEPRICE = util.parse2Num(list[i].GOODSSALEPRICE);
        }
        return list;
    },
    //获取地址,调用地址页的方法，回调处理有点龊
    getAddress: function (pageFrom, data,index) {
        "use strict";
        var that = this;
        var userId = userObj.isExist();
        //如果是从地址选择页面返回回来，修正选择的地址
        //TODO : Caution 这里如果没有data，就坑爹了
        if (pageFrom === "page/addressSelect.html" || pageFrom === "page/addressAdd.html") {
            that.addressList = [data];
            that.address = data;
            that.addressIndex = index;
            that.showAddress();
        }
        else {
            addressListObj.getAddressListAjax(userId, function (data) {
                that.getAddressCall(data);
            });
        }
    },
    //获取地址的回调，有默认设置默认，没默认选择第一个
    //如果传入了是第几个，就是第几个(这个参数暂时无效)
    getAddressCall: function (data, index) {
        "use strict";
        var that = this;
        hiApp.hideIndicator();
        that.addressList = data || that.addressList;
        var address = null;
        if (data.length > 0) {
            if (index) {
                that.addressIndex = index;
                address = that.addressList[that.addressIndex];
            }
            else {
                //默认设为第一个
                address = data[0];
                that.addressIndex = 0;
                //如果设了默认，改回来
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i].ISDEFAULT === "1") {
                        address = data[i];
                        that.addressIndex = i;
                        break;
                    }
                }
            }

            that.address = address;
            that.showAddress();
        }
    },
    showAddress: function () {
        "use strict";
        var that = this;
        if (that.address) {
            var str = that.address.PROVINCE + that.address.CITY + that.address.COUNTY + that.address.ADDRESS;
            $$("#orderConfirmAddressDiv").html(str);
        }
    },
    checkDatabeforeCommit: function () {
        "use strict";
        var that = this;
        var couponid = "";
        var consigneeid = "";
        if(that.address){
            consigneeid = that.address.ID;
        }

        if (!consigneeid) {
            hiApp.alert("请选择收货地址~");
            return;
        }
        var paytype = payObj.getPayType();
        if (!paytype) {
            hiApp.alert("请选择付款方式~");
            return;
        }

        if (that.coupons.length && that.couponIndex < that.coupons.length ) {
            couponid = that.coupons[that.couponIndex].ID;
        }

        var remark = $$("#orderConfirmTextArea").val();

        var list = [];
        var i, len;
        for (i = 0, len = that.goodsList.length; i < len; i++) {
            list.push({
                'Id': that.goodsList[i].ID,
                'goodsNum': that.goodsList[i].GOODSNUM || 1
            });
        }

        return {
            consigneeid: consigneeid,
            couponid: couponid,
            paytype: paytype,
            remark: remark,
            goodsList: list
        };
    }
};
