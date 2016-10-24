/**
 * Created by Administrator on 15-7-13.
 */
/*gulp-replace*/
var payObj = {
    //创建订单
    creatOrder: function (data) {
        "use strict";
        //  hiApp.showIndicator();
        if (!userObj.isExist()) return;
        var device = Framework7.prototype.device;
        var userId = userObj.ID, that = this, agentId;
        if( app_channelNum ){
            agentId = app_channelNum;
        }
        //判断本地是否存有分销编号
        if(localStorage.getItem('agentId')){
            agentId = localStorage.getItem('agentId');
        }
        util.getAjaxData({
            url: appConfig.COMMITORDER_1,
            type: 'post',
            data: {
                loginid: userId,
                goodsList: JSON.stringify(data.goodsList),
                consigneeid: data.consigneeid, //收货信息ID
                couponid: data.couponid,//优惠券ID
                paytype: data.paytype,//付款方式 ‘微信支付’/ '支付宝支付'
                orderfrom: 'app',// 订单来源 ‘wap’
                remark: data.remark,
                agentId : agentId || ""
            },
            error: function () {
                return false;
            },
            success: function (json) {
                var data = JSON.parse(json);
                if (data.STATUSCODE == 200) {
                    that.goPay(data);
                } else {
                    hiApp.hideIndicator();
                    hiApp.alert(data.MSG || "订单提交失败");
                }

            }
        });
    },
    getPayType: function () {
        var payType = "";
        if ($$("#paytype0").hasClass('selected')) {
            payType = '支付宝支付';
        } else if ($$("#paytype1").hasClass('selected')) {
            payType = '微信支付';
        }
        return payType;
        var device = Framework7.prototype.device;
        if (device && device.iphone) {
            if ($$("#paytype0").hasClass('selected')) {
                payType = 'ios_alipay';
            } else if ($$("#paytype1").hasClass('selected')) {
                payType = 'ios_weixin';
            }
        } else {
            if ($$("#paytype0").hasClass('selected')) {
                payType = 'android_alipay';
            } else if ($$("#paytype1").hasClass('selected')) {
                payType = 'android_weixin';
            }
        }
        return payType;
    },
    goPay: function (orderDetail) {
        var that = this;
        var device = Framework7.prototype.device,payType;
        if (!orderDetail)
            return;
        else if( orderDetail.length >= 1)
            orderDetail = orderDetail[0];
        payType = orderDetail.ORDERPAYINFO;
        //支付宝直接支付
        if (device.iphone) {
            if (payType == '支付宝支付') {
                that.iosAlipay(orderDetail);
                return;
            }
        } else {
            if (payType == '支付宝支付') {
                that.androidAlipay(orderDetail);
                return;
            }
        }
        //微信直接支付，需要先从后台拿到PrepareID
        util.getAjaxData({
            url: appConfig.APP_GOPAY_URL,
            type: 'post',
            data: {
                loginid: userObj.ID,
                orderid: orderDetail.ID
            },
            error: function () {
                return false;
            },
            success: function (json) {
                var data = JSON.parse(json);
                if (data.STATUSCODE == 200) {
                    if (device.iphone) {
                        if (payType !== '支付宝支付') {
                            that.iosWeixin(data);
                        }
                    } else {
                        if (payType !== '支付宝支付') {
                            that.androidWeixin(data);
                        }
                    }
                } else {
                    hiApp.alert(data.MSG || "订单提交失败");
                }

            }
        });

    },
    androidAlipay: function (orderDetail) {
        var that = this;
        orderConfirmObj.clickFlag = 0 ;
        hiApp.hideIndicator();
        if (!orderDetail) hiApp.alert("订单消息已过期");
        setTimeout(function () {
            alipay.pay({
                out_trade_no: orderDetail.ORDERCODE ,
                subject: '商品标题',
                body: '商品描述',
                total_fee: orderDetail.ORDERTOTALPRICE ,
                notify_url: appBaseUrl + 'payment/alipay/callback/appnotify',
                return_url: appBaseUrl + "weixin/#!/page/shoppinglists.html"
            }, function (result) {
                if (!result) {
                    hiApp.alert("支付宝异常");
                } else {
                    switch (result) {
                        case "9000":
                            hiApp.alert("支付成功");
                            //  that.paySuccess(orderDetail);
                            break;
                        case "4000":
                            hiApp.alert("系统异常");
                            break;
                        case "4001":
                            hiApp.alert("订单参数错误");
                            break;
                        case "6001":
                            hiApp.alert("用户取消支付");
                            break;
                        case "6002":
                            hiApp.alert("网络连接异常");
                            break;
                    }
                    mainView.router.loadPage("page/shoppinglists.html");
                }
            }, function (result) {
                hiApp.alert(result.toString());
            });
        }, 10);
    },
    iosAlipay: function (orderDetail) {
        orderConfirmObj.clickFlag = 0 ;
        hiApp.hideIndicator();
        util.cordovaExec(function (success) {
            hiApp.alert("支付成功");
            mainView.router.loadPage("page/shoppinglists.html");
        }, function (fail) {
            hiApp.alert("支付失败");
            mainView.router.loadPage("page/shoppinglists.html");
        }, "Alipay", "getAlipayInfo", [orderDetail.ORDERCODE, orderDetail.ORDERTOTALPRICE]);
    },
    iosWeixin: function (orderDetail) {
        //TODO:ios端微信支付待集成
        orderConfirmObj.clickFlag = 0 ;
        hiApp.hideIndicator();
        util.cordovaExec(function (success) {
            hiApp.alert("支付成功！");
            mainView.router.loadPage("page/shoppinglists.html");
        }, function (fail) {
            hiApp.alert("支付失败");
            mainView.router.loadPage("page/shoppinglists.html");
        }, "Wxpay", "getWXPayInfo", [JSON.stringify(orderDetail)]);
    },
    androidWeixin: function (orderDetail) {
        //TODO:安卓端微信支付待集成
        orderConfirmObj.clickFlag = 0;
        hiApp.hideIndicator();
        util.cordovaExec(function (success) {
            hiApp.alert("支付成功");
            mainView.router.loadPage("page/shoppinglists.html");
        }, function (fail) {
            hiApp.alert("支付失败");
            mainView.router.loadPage("page/shoppinglists.html");
        }, "WXpay", "getWXpay", [JSON.stringify(orderDetail)]);
    }
};
/*/gulp-replace*/