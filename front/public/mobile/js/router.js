/* globals $$: false,appConfig:false,util:false,hiApp:false,console:false,mainView:false,
 alert:false,define:false,newIndexObj:false,myAddressObj:false,loginRegisterObj:false,userCenterObj:false,
 activityObj:false,shoppingCartObj:false,detailObj:false,classifyObj:false,couponObj:false,shoppingListsObj:false,
 orderConfirmObj:false*/

"use strict";
var router = {
    init: function () {

        var that = this;

        $$(document).on('pageBeforeInit', function (e) {
            var page = e.detail.page;
            router.pageBeforeInit(page);
            //这里是到一个页面默认让去顶部的按钮隐藏
            $$(".gotop").hide();
            $$(".app-download").hide();
        });

        $$(document).on('pageAfterAnimation', function (e) {
            var page = e.detail.page;
           // that.initShare();
            router.pageAfterAnimation(page);
        });
    },
    initShare:function(){
        var str1 = window.location.href ,str = "";
        if(str1.indexOf("#!/") != -1){
            str = str1.substr(str1.indexOf("#!/"));
        }
        util.getAjaxData({
            url:'http://m.bbxvip.com/api/v1/user/weixinjs',
            type:'post',
            data:{
                url: location.origin + location.pathname
            },
            success:function(json){
                if(json){
                    try{
                        var data = JSON.parse(json);
                        wx.config({
                            debug: false,
                            appId: data.appid,
                            timestamp: data.timestamp,
                            nonceStr: data.noncestr,
                            signature: data.signature,
                            jsApiList: [ 'onMenuShareTimeline','onMenuShareAppMessage']
                        });
                        wx.ready(function (a) {
                            wx.onMenuShareTimeline({
                                title:"" , // 分享标题
                                desc: "", // 分享描述
                                link: "http://m.bbxvip.com/activity/shareRedirect/redirect.html" + str, // 分享链接
                                imgUrl: "", // 分享图标
                                type: '', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function () {
                                    alert("分享成功");

                                    // 用户确认分享后执行的回调函数
                                },
                                cancel: function () {
                                    alert("分享取消");

                                    // 用户取消分享后执行的回调函数
                                }
                            });
                            wx.onMenuShareAppMessage({
                                title: "", // 分享标题
                                desc: "", // 分享描述
                                link: "http://m.bbxvip.com/activity/shareRedirect/redirect.html" + str, // 分享链接
                                imgUrl: "", // 分享图标
                                type: '', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function () {
                                    // 用户确认分享后执行的回调函数
                                },
                                cancel: function () {
                                    alert("分享取消");

                                    // 用户取消分享后执行的回调函数
                                }
                            });
                        });
                    }catch (e){
                    }
                }
            }
        });
    },
    pageAfterAnimation: function (page) {
        var name = page.name;
        var from = page.from;
        var query = page.query || util.getRequest();
        var swipeBack = page.swipeBack;
        var queryObj = $$.parseUrlQuery(window.location.href);
        var toolbarItem  = $$(".toolbar .tab-link");
        toolbarItem.removeClass("active");
        switch (name) {
            case 'reBackWaiting':
                reBackWaitingObj.show(query.orderCode);
                break;
            case 'reMinderOrder':
                reMinderOrderObj.show(query.orderCode);
                break;
            case 'reBackOn2' :
                reBack2Obj.show(query.oid);
                break;
            case 'reBackOn9' :
                reBack9Obj.show(query.orderCode,query.id);
                break;
            case 'reBackAddress' :
                reBackAddressObj.show(query.refundId);
                break;
            case 'reBackChecking' :
                reBackCheckingObj.show(query.refundId);
                break;
            case 'reBackCheckFail' :
                reBackCheckFailObj.show(query.refundId,query.id);
                break;
            case 'reBackDESC' :
                reBackDescObj.show();
                break;
            case 'index':
                $$(".toolbar").removeClass("toolbar-hidden");
                $$(toolbarItem[0]).addClass("active");
                break;
            case 'detail':
                detailObj.initData(query);
                $$(".toolbar").addClass('toolbar-hidden');
                break;
            case 'mycenter':
                mycenterObj.init(query);
                $$(toolbarItem[3]).addClass("active");
                break;
            case 'userCenter':
                userCenterObj.bindData();
                break;
            case 'nickname':
                userCenterObj.nickname.bindData();
                break;
            case 'gender':
                userCenterObj.gender.bindData();
                break;
            case 'addressList':
                addressListObj.show();
                break;
            case 'addressAdd':
                addressAddObj.show();
                break;
            case 'addressUpdate':
                addressUpdateObj.show(query.addressInfo);
                break;
            case 'addressSelect':
                addressSelectObj.show(query.index);
                break;
            case 'orderDetail':
                orderDetailObj.getShowData(queryObj.orderId,queryObj.msg);
                break;
            case 'shoppingCart2':
                if(!userObj.ID){
                    mainView.router.loadPage('page/login.html');
                    return;
                }

                shoppingCartObj2.showCart(queryObj.v);
                $$(toolbarItem[2]).addClass("active");
                break;
            case 'orderConfirm':
                orderConfirmObj.showOrder(page.fromPage.url,query.newAddress,query.addIndex);
                break;
            case "coupon":
                couponObj.getCouPonList();
                break;
            case 'shoppinglists':
                setTimeout(function(){
                    shoppingListsObj.showTab();
                },500);
                break;
            case 'scenes':
                break;
            case 'expressInfo':
                expressInfo.show(query);
                break;
            case 'collection':
                collectionObj.show();
                $$(toolbarItem[1]).addClass("active");
                break;
           /* case 'chosen':
                $$(toolbarItem[1]).addClass("active");
                break;*/
            case 'loginRegister':
                //如果路由查询到了账号信息，那么为联合登录成功，由自动登录路径直接跳转至index.html?a=2地址
                if(queryObj.user){
                    loginRegisterObj.outUrl = "";
                    var objStr = atob(queryObj.user);
                    try{
                        var user = JSON.parse(objStr);
                        loginRegisterObj.loginSuccessCall(user,1,queryObj.backUrl);
                    }
                    catch(e){
                        //反之，显示登录界面
                        loginRegisterObj.showLoginReg();
                    }
                }
                //查到外链，设置一下，没有查到外链，清空outUrl
                else if(query.fvl){
                    loginRegisterObj.outUrl = decodeURIComponent(query.fvl);
                    loginRegisterObj.showLoginReg();
                }
                else{
                    loginRegisterObj.outUrl = "";
                    //反之，显示登录界面
                    loginRegisterObj.showLoginReg();
                }
                break;
            case 'loginBind':
                loginBindObj.showPage(queryObj.openid,queryObj.oauthtype);
                break;
           }

        var _baiduUrl = page.url;

        //添加统计
        setTimeout(function(){
      //      util.writeAjaxLog( '','', 'statist' );
            _hmt.push(['_setCustomVar', 1,_baiduUrl, 1, 1]);
        },300);
    },
    pageBeforeInit: function (page) {
        var that = this;
        var name = page.name;
        var query = page.query || util.getRequest();
        var from = page.from;
        that._setCookie(query);
        switch (name) {
            case 'index':
                indexObj.init(query);
                break;
            case 'userCenter':
                userCenterObj.bindEvent();
                break;
            case 'nickname':
                userCenterObj.nickname.bindEvent();
                break;
            case 'gender':
                userCenterObj.gender.bindEvent();
                break;
            case 'activity':
                activityObj.init(query);
                break;
            case 'detail':
                detailObj.init(query);
                break;
            case 'coupon':
                couponObj.init();
                break;
            case 'scenes':
                scenesObj.init(query);
                scenesObj.show(query.actionId);
                break;
            case 'chosen':
                chosenObj.init();
                break;
            case 'shoppinglists':
                shoppingListsObj.init();
                break;
            case 'shoppingCart2':
                shoppingCartObj2.init();
                shoppingCartObj2.bindEvent();
                break;
            case 'orderConfirm':
                orderConfirmObj.init();
                orderConfirmObj.bindEvent();
                break;
            case 'addressList':
                addressListObj.init();
                break;
            case 'addressAdd':
                addressAddObj.init();
                break;
            case 'addressUpdate':
                addressUpdateObj.init();
                break;
            case 'addressSelect':
                addressSelectObj.init();
                break;
            case 'loginRegister':
                loginRegisterObj.init();
                break;
            case 'loginBind':
                loginBindObj.init();
                break;
            case 'forgotPwd':
                loginRegisterObj.initForgotPwd();
                break;
            case 'orderDetail':
                orderDetailObj.init();
                orderDetailObj.bindEvent();
                break;
            case 'setting':
                settingObj.init();
                break;
            case 'resetPwd':
                loginRegisterObj.resetInit();
                break;
            case 'mycenter':
               // mycenterObj.init(query);
                break;
            case 'classifylist':
                classifylistObj.init(query);
                break;
            case 'collection':
                collectionObj.init();
                break;
            case 'redpack':
                redpackObj.init();
                break;
            case 'searching' :
                searchingObj.init();
                break;
            case 'expressInfo':
                expressInfo.init();
                break;
            case 'reBackOn2' :
                reBack2Obj.init();
                break;
            case 'reBackOn9' :
                reBack9Obj.init();
                break;
            case 'reBackAddress' :
                reBackAddressObj.init();
                break;
            case 'reBackChecking':
                reBackCheckingObj.init();
                break;
            case 'reBackCheckFail' :
                reBackCheckFailObj.init();
                break;
            case 'reBackDESC' :
                reBackDescObj.init();
                break;
            case 'reMinderOrder':
                reMinderOrderObj.init();
                break;
            case 'reBackWaiting':
                reBackWaitingObj.init();
                break;
        }
    },
    _setCookie:function( request ){
        //此标记意为cookie2Tag,有此标记不清cookie
        if(!util.getCookie("c2t")){
            util.clearCookie("agentId");
        }
        if(request && request.agentId){
            util.setCookie2("agentId",request.agentId,null,"/",null);
            util.setCookie("c2t","1",300,null,"/",null);
        }
        if(request && request.agentId2){
            util.setCookie2("agentId2",request.agentId2,null,"/",null);
            util.setCookie("c2t","1",300,null,"/",null);
        }
        //冗余
        if(request && request.utf){
            util.setCookie("utf",request.utf,1,null,"/",null);
        }
    }
};