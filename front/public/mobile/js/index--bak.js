require.config({
    paths: {
        text: 'require/text',
        i18n: 'require/i18n',
        Framework7: 'require/framework7'
//        GS: 'require/globalService'
    },
    shim: {
        'Framework7': {
            exports: 'Framework7'
        }
    }
});
require(['Framework7'], function (Framework7) {
    var app = {
        initialize: function () {
            var device = Framework7.prototype.device;
            if ((device.iphone || device.android) && typeof(cordova) !== 'undefined') {
                addPlugin();
            }
            this.bindEvents();
        },
        bindEvents: function () {
            window.onload = this.onDeviceReady();
        },
        onDeviceReady: function () {
            app.receivedEvent('deviceready');
        },
        receivedEvent: function (id) {
            window.$$ = Dom7;
            var device = Framework7.prototype.device;
            var fastClicks = animateNavBackIcon = animatePages = false;
            if (device.iphone) {
                fastClicks = animateNavBackIcon = animatePages = true;
            }
            window.hiApp = new Framework7({
                fastClicks: fastClicks,
                animatePages: animatePages,
                popupCloseByOutside: false,
                animateNavBackIcon: animateNavBackIcon,
                modalTitle: '提示',
                modalButtonOk: '确认',
                modalButtonCancel: '取消',
                swipeBackPage: false,
                pushState: true,
                swipePanel: 'left',
                onPageInit: function (app, page) {

                }
            });
            window.mainView = hiApp.addView('#mainView');
            if ((device.iphone || device.android) && typeof(cordova) !== 'undefined') {
                util.checkUpdate();
                if (!localStorage.getItem('welcome')) {
                    welcome();
                }
            }
//
            try {
                if (localStorage.getItem('loginInfo')) {
                    var loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
                    setTimeout(function () {
                        loginObj.login(loginInfo.mobile, loginInfo.password, 1);
                    }, 10);
                } else {
                    mainView.router.loadPage('page/myAddressAdd.html');
                }
            } catch (e) {

            }

            //remove 'hidden-navbar' class
            $$('div.navbar').removeClass('navbar-hidden');

            //navBar事件
            bindTapEvent(".tab-link", function (_this) {
                var _href = $$(_this).attr("content-href");
                $$('.toolbar .tab-link').removeClass("active");
                $$('.toolbar .tab-link .icon').removeClass('active');
                $$(_this).addClass("active");
                $$(_this).find('.icon').addClass('active');
                mainView.router.loadPage(_href);
            });
            //首页今日特卖与即将开抢
            bindTapEvent('.in_tab .nav_top li', function (_this) {
                mainObj.clickTab(_this);
            });
            //进入商品详情页
            bindTapEvent('.goodItem', function (_this) {
                var actionId = $$(_this).attr('contend-actionid'),
                    id = $$(_this).attr('contend-id'),
                    groupId = $$(_this).attr('contend-groupid'),
                    title = $$(_this).attr('title');
                mainView.router.loadPage({
                    query: {
                        actionId: actionId,
                        id: id,
                        title: title,
                        groupId: groupId
                    },
                    url: 'page/detail.html'
                });
            });
            //进入活动页
            bindTapEvent('.activityItem', function (_this) {
                var actionId = $$(_this).attr('contend-actionid'),
                    actionImgUrl = $$(_this).attr('action-imgUrl'),
                    title = $$(_this).attr('title'),
                    type = $$(_this).attr('contend-type');
                mainView.router.loadPage({
                    url: 'page/index.html',
                    query: {
                        actionId: actionId,
                        title: title,
                        actionImg: actionImgUrl,
                        type: type
                    }
                });
            });
            //颜色选择
            bindTapEvent('.colorItem', function (_this) {
                $$(".color-chose").remove();
                var template = '<div class="color-chose"><img src="img/ico/chose-ico.png"></div>';
                $$(".colorItem").removeClass('chose');
                $$(_this).addClass('chose');
                $$(_this).append(template);
                var actionId = $$("#actionIdBox").val();
                var groupId = $$("#groupIdBox").val();
                var request = {
                    actionId: actionId,
                    groupId: groupId
                };
                detailObj.setConfigBindId(request, 'change');
            });
            //尺码选择
            bindTapEvent('.sizeItem', function (_this) {
                $$(".size-chose").remove();
                var template = '<div class="size-chose"><img src="img/ico/chose-ico.png"></div>';
                $$(".sizeItem").removeClass('chose');
                $$(_this).addClass('chose');
                $$(_this).append(template);
                var actionId = $$("#actionIdBox").val();
                var groupId = $$("#groupIdBox").val();
                var request = {
                    actionId: actionId,
                    groupId: groupId
                };
                detailObj.setConfigBindId(request, 'change');
            });
            //加入购物车
            bindTapEvent('#buyBtn', function (_this) {
                if ($$(_this).attr("isable") == 0) return;
                if ($$(".color-chose").length == 0) {
                    hiApp.alert("请选择颜色");
                    return false;
                }
                if ($$(".size-chose").length == 0) {
                    hiApp.alert("请选择尺码");
                    return false;
                }
                var actionId = $$("#actionIdBox").val();
                var groupId = $$("#groupIdBox").val();
                var request = {
                    actionId: actionId,
                    groupId: groupId
                };
                detailObj.setConfigBindId(request);
            });

            //去逛逛
            bindTapEvent('.goShopping', function (_this) {
                $$('.toolbar .tab-link').removeClass("active");
                $$('.toolbar .tab-link .icon').removeClass('active');
                $$($$('.toolbar .tab-link')[0]).addClass("active");
                $$($$('.toolbar .tab-link')[0]).find('.icon').addClass('active');
                mainView.router.loadPage('page/index.html');
            });
            //进入购物车
            bindTapEvent('.jumpToCart', function (_this) {
                $$('.toolbar .tab-link').removeClass("active");
                $$('.toolbar .tab-link .icon').removeClass('active');
                $$($$('.toolbar .tab-link')[3]).addClass("active");
                $$($$('.toolbar .tab-link')[3]).find('.icon').addClass('active');
                mainView.router.loadPage('page/shoppingCart.html');
            });
            //购物车内增加商品数量
            bindTapEvent('.addGoods', function (_this) {
                var cartItem = $$(_this).parents('.buylist');
                if (cartItem.length > 0) {
                    var goodId = cartItem.attr('contend-id');
                    cartObj.addGoods(goodId);
                }
            });
            //购物车内减少商品数量
            bindTapEvent('.minGoods', function (_this) {
                var cartItem = $$(_this).parents('.buylist');
                if (cartItem.length > 0) {
                    var goodId = cartItem.attr('contend-id');
                    cartObj.minGoods(goodId, 'min');
                }
            });
            //购物车内删除整个商品
            bindTapEvent('.deleteGoods', function (_this) {
                hiApp.confirm("确定要删除该商品？", function () {
                    var cartItem = $$(_this).parents('.buylist');
                    if (cartItem.length > 0) {
                        var goodId = cartItem.attr('contend-id');
                        cartObj.minGoods(goodId, 'delete');
                    }
                });
            });
            //购物车内-去结算
            bindTapEvent('.goCheck', function (_this) {
                var totalCount = $$(".totalGoodsPrice").html(),
                    totalDiffPrice = $$(".totalDiffPrice").html(),
                    cbCouponId;
                if ($$("#cbCoupon").is(":checked"))  cbCouponId = $$("#cbCoupon").attr("data-id");
                mainView.router.loadPage({
                    query: {
                        totalCount: totalCount,
                        totalDiffPrice: totalDiffPrice,
                        cbCouponId: cbCouponId
                    },
                    url: 'page/checkout.html'
                });
            });
            //navbar right btn
            bindTapEvent('#rightNavBar .link', function (_this) {
                if ($$(_this).attr('action')) {
                    var action = $$(_this).attr('action');
                    if (action == 'create') {
                        if (addressObj.checkForm()) {
                            addressObj.createAddress();
                        }
                    } else if (action == 'cancel') {
                        //TODO:这里是取消订单事件处理
//             F           alert('取消订单');
                        hiApp.confirm("确定取消订单？", function () {
                            orderObj.changeOrderStatus(99);
                        });

                    } else if (action == 'update') {
                        if (addressObj.checkForm()) {
                            addressObj.updateAddress();
                        }
                    } else if (action == 'return') {
                        hiApp.confirm("确定申请退款？", function () {
                            orderObj.changeOrderStatus(5);
                        });
                    }
                }

            });
            //订单checkout页面显示其他地址
            bindTapEvent('#showOtherAddress', function (_this) {
                $$(".default-address-box").hide();
                $$(".address-list-box").show();
            });
            //新增地址
            bindTapEvent(".address-btn", function (_this) {
                mainView.router.loadPage({
                    url: 'page/addAddress.html',
                    query: {action: 'create'}
                })
            });
            //编辑地址
            bindTapEvent('.address-edit', function (_this, e) {
                if (e.target.getAttribute("class") && e.target.getAttribute("class").indexOf('delete-address') != -1) return false;
                var addressId = $$(_this).attr("contend-id");
                mainView.router.loadPage({
                    url: "page/addAddress.html",
                    query: {
                        id: addressId,
                        action: 'update'
                    }
                });
            });
            //删除地址
            bindTapEvent('.delete-address', function (_this, e) {
                var addressId = $$(_this).attr("contend-id");
                addressObj.deleteAddress(addressId);
            });

            //查看订单详情
            bindTapEvent('.viewOrderDetail', function (_this) {
                var orderId = $$(_this).parents('.buylist').attr("contend-orderid");
                mainView.router.loadPage("page/orderdetail.html?orderId=" + orderId);
            });
            //加载更多
            bindTapEvent("#loadMore", function (_this) {
                var chosePage = $$(_this).attr("contend-page");
                $$(_this).hide();
                chosePage++;
                $$(_this).attr("contend-page", chosePage);
                chosenObj.setChoseList(chosePage);
            });
            //点击注册
            bindTapEvent(".btn-register", function (_this) {
                var _href = $$(_this).attr("content-href");
                mainView.router.loadPage(_href);
            });
            //点击登录
            bindTapEvent('#btn-login', function (_this) {
                if (!$$('#btnUserName').val()) {
                    hiApp.alert('手机号不能为空');
                    return false;
                }
                if (!$$('#btnPassword').val()) {
                    hiApp.alert('密码不能为空');
                    return false;
                }
                var moblie = $$('#btnUserName').val(), password = $$('#btnPassword').val();
                loginObj.login(moblie, password, 0);
            });
            //注销登录
            bindTapEvent('#logoutBtn', function (_this) {
                if (localStorage.getItem('loginInfo')) {
                    localStorage.removeItem('loginInfo');
                    localStorage.removeItem('user');
                    localStorage.removeItem('localCart');
                    localStorage.removeItem('addCartTime');
                    sessionStorage.removeItem('wantBuy');

                    $$('.toolbar .tab-link').removeClass("active");
                    $$('.toolbar .tab-link .icon').removeClass('active');
                    $$($$('.toolbar .tab-link')[0]).addClass("active");
                    $$($$('.toolbar .tab-link')[0]).find('.icon').addClass('active');
                    mainView.router.loadPage('page/index.html');
                }
            });
            //用户中心--去登陆
            bindTapEvent('.toLogin_btn', function (_this) {
                mainView.router.loadPage('page/login.html');
            });
            //用户中心--去注册
            bindTapEvent('.toRegister_btn', function (_this) {
                mainView.router.loadPage('page/register.html');
            });
            //购物车页面结算购物券选择
            $$(document).on("click", '#cbCoupon', function () {
                cartObj.setPayInfo('couponClick');
            });

            //结算页面结算按钮
            bindTapEvent("#checkOut_checkOrder", function () {
                checkOutObj.checkOrder();
            });
            //注册页面--去登录
            bindTapEvent("#btn_toLogin", function () {
                mainView.router.loadPage('page/login.html');
            });
            //获取验证码
            bindTapEvent("#btnSendCode", function () {
                registerObj.getCode();
            });
            //提交注册
            bindTapEvent("#btnReg", function () {
                registerObj.checkAuthCode();
            });
            //优惠券页面tab切换
            bindTapEvent(".coupon-tab-li", function (_this) {
                couponObj.changeTab(_this);
            });
            //个人中心设置按钮
            bindTapEvent(".settingBtn", function (_this) {
                if (!localStorage.getItem('user')) {
                    console.log("未登录")
                    mainView.router.loadPage("page/login.html");
                } else {
                    mainView.router.loadPage("page/setting.html");
                }
            });
            /*//监听首页滚动条
             $$( document ).on("scrollBarIndex",function() {
             if($$("#box").offset() && parseInt($$("#box").offset().top) > 80 ){
             $$(".subnavbar.sliding").hide();
             }
             });*/


            //订单列表页去支付
            bindTapEvent(".order_list_pay", function (_this) {
                var orderId = $$(_this).attr("contend-id");
                orderObj.getOrderDetailAndPay(orderId);
            });

            //订单详情页去支付
            bindTapEvent("#buyBtn_orderDetail", function (_this) {
                var orderId = $$("#orderdetail_orderid").val();
                orderObj.getOrderDetailAndPay(orderId);
            });
            //去顶部
            bindTapEvent(".goTop", function () {
//               $$(".choseshw")[0].scrollIntoView();
//                cordova.require("com.xgr.lalami.Message").browser('http://t.bbxvip.com/ac/tP/');
            });

            //关闭poppopover
            bindTapEvent(".popover-close", function () {
                $$("#popover_Box").hide();
            });

            bindTapEvent(".brandItem", function (_this) {
                var brandId = $$(_this).attr('contend_brandId'),
                    brandTitle = $$(_this).attr('contend_brandtitle');
                mainView.router.loadPage({
                    url: 'page/activity.html',
                    query: {
                        brandId: brandId,
                        brandTitle: brandTitle
                    }
                });
            });



            /**
             * tap事件封装
             * @param dom
             * @param callback
             */
            function bindTapEvent(dom, callback) {

                /* $$(document).on('click',dom,function(e){
                 callback && callback(this,e);
                 });*/
                var touch = {};
                $$(document).on('touchstart', dom, function (e) {
                    touch.x1 = e.touches[0].pageX;
                    touch.y1 = e.touches[0].pageY;
                    touch.x2 = e.touches[0].pageX;
                    touch.y2 = e.touches[0].pageY;
                }).on("touchmove", dom, function (e) {
                    touch.x2 = e.touches[0].pageX;
                    touch.y2 = e.touches[0].pageY;
                }).on('touchend', dom, function (e) {
                    if ((touch.x2 && Math.abs(touch.x1 - touch.x2) < 30) &&
                        (touch.y2 && Math.abs(touch.y1 - touch.y2) < 30)) {
                        callback && callback(this, e);
                    }
                });
            }


        }
    };
    app.initialize();
    init();
});

function init() {
    var chosePage = 1;

    $$("#backToLast").hide();
    $$("#centerNavBar").css('left', 0);
    $$("#rightNavBar").html('');
    $$('.popup').on('open', function () {
        $$('.views').addClass('blured');
        //$$('.statusbar-overlay').addClass('with-popup-opened');
    });
    $$('.popup').on('close', function () {
        $$('.views').removeClass('blured');
        //$$('.popup input[type="text"]')[0].blur();
        //$$('.statusbar-overlay').removeClass('with-popup-opened');
    });
    $$('.page-login').on('click', function () {
        hiApp.closeModal('.popup-register');
        $$('.popup-register').once('closed', function () {
            hiApp.popup('.popup-login');
        });
    });
    $$('.page-reg').on('click', function () {
        hiApp.closeModal('.popup-login');
        $$('.popup-login').once('closed', function () {
            hiApp.popup('.popup-register');
        });
    });

    hiApp.onPageInit('myAddressSave', function (obj) {

    });
    hiApp.onPageAfterAnimation('myAddressSave', function () {

    });
    hiApp.onPageInit('myAddressAdd', function (obj) {
//        if(obj) var query = obj.query;
//        addressObj.setAddress(query);
    });
    hiApp.onPageAfterAnimation('myAddressAdd', function () {
        myAddressObj.showAddressList();
    });

    hiApp.onPageInit('login', function (obj) {
        if (obj && obj.query) {
            var query = obj.query;
            if (query && query.fromPage == 'detail') {

            }
        }
    });
    hiApp.onPageAfterAnimation('login', function () {
        setNavbarNormal();
        var navBox = $$("#centerNavBar .logo"),
            dapeiLogo = ' <div class="logo-text">登录</div>';
        navBox.html(dapeiLogo);
        $$("#backToLast").css("display", "");

    });

    hiApp.onPageInit('register', function (obj) {

    });
    hiApp.onPageAfterAnimation('register', function (obj) {
        //setNavbarNormal();
        $$("#backToLast").css("display", "");

    });

    hiApp.onPageInit('index', function () {
        newIndexObj.getIndexList();
    });
    hiApp.onPageBeforeAnimation('index', function () {
        setNavbarNormal();
        var navBox = $$("#centerNavBar .logo"),
            indexLogo = '<img width="50px" src="img/logo.png">';
        navBox.html(indexLogo);

        // $$("#rightNavBar").html(' <a class="link icon-only open-popup" action="saixuan"  href="#" data-popup=".popup-services">筛选</a>');
    });


    hiApp.onPageInit('brandZone', function () {
        $$('.infinite-scroll').on('infinite', function () {
            $$(".subnavbar.sliding").hide();
        });
        mainObj.setTodayActionsList();
        mainObj.setLaterActionsList();
        /* mainObj.setMainLooperadList();
         mainObj.setChuhuangList();
         mainObj.setMatchChannelList();
         setTimeout(function () {
         mainObj.setTodayActionsList();
         mainObj.setLaterActionsList();
         }, 1000);*/

    });
    hiApp.onPageBeforeAnimation('brandZone', function () {
        setNavbarNormal();
        var navBox = $$("#centerNavBar .logo"),
            indexLogo = '<img width="50px" src="img/logo.png">';
        navBox.html(indexLogo);

    });

    hiApp.onPageInit('brand', function (obj) {
        var query = obj.query;
        if (query) brandObj.setBrandList(query);
    });
    hiApp.onPageBeforeAnimation('brand', function (obj) {
        setNavbarNormal();
        var query = obj.query , title;
        if (query) {
            title = query.brandTitle;
        } else {
            title = "品牌专场";
        }
        var navBox = $$("#centerNavBar .logo"),
            indexLogo = '<div class="logo-text">' + title + '专场</div>';
        navBox.html(indexLogo);

    });


    hiApp.onPageInit('collocation', function () {
        collocationObj.setCollocationList();
    });
    hiApp.onPageBeforeAnimation('collocation', function () {
        setNavbarNormal();
        var navBox = $$("#centerNavBar .logo"),
            dapeiLogo = ' <div class="logo-text">搭配</div>';
        navBox.html(dapeiLogo);

    });

    hiApp.onPageInit('chosen', function () {
        chosePage = 1;
        chosenObj.setChoseList(chosePage);
        // 注册'infinite'事件处理函数
        $$('.infinite-scroll').on('infinite', function () {
            setTimeout(function () {
                if ($$("#loadMore").css("display") == 'block') {
                    var chosePage = $$("#loadMore").attr("contend-page");
                    $$("#loadMore").hide();
                    chosePage++;
                    $$("#loadMore").attr("contend-page", chosePage);
                    $$(".chosen_infinite_preloader").hide();
                    chosenObj.setChoseList(chosePage);
                }
            }, 200);
        });
    });
    hiApp.onPageBeforeAnimation('chosen', function () {
        setNavbarNormal();
        var navBox = $$("#centerNavBar .logo"),
            dapeiLogo = ' <div class="logo-text">精选</div>';
        navBox.html(dapeiLogo);

    });

    hiApp.onPageInit('shoppingCart', function () {
        cartObj.getCartList();
    });
    hiApp.onPageBeforeAnimation('shoppingCart', function () {
        setNavbarNormal();
        var navBox = $$("#centerNavBar .logo"),
            dapeiLogo = ' <div class="logo-text">购物车</div>';
        navBox.html(dapeiLogo);

    });

    hiApp.onPageInit('userCenter', function () {
        userCenterObj.setUserCenter();
    });
    hiApp.onPageBeforeAnimation('userCenter', function () {
        setNavbarNormal();
        var navBox = $$("#centerNavBar .logo"),
            dapeiLogo = ' <div class="logo-text">我的</div>';
        navBox.html(dapeiLogo);

    });

    hiApp.onPageInit('setting', function () {

    });
    hiApp.onPageBeforeAnimation('setting', function () {
        setNavbarNormal();
        var navBox = $$("#centerNavBar .logo"),
            dapeiLogo = ' <div class="logo-text">设置</div>';
        navBox.html(dapeiLogo);

        $$("#backToLast").css("display", "");

    });

    hiApp.onPageInit('detail', function (obj) {
//        var requestObj = util.getRequest();
        if (obj) {
            var requestObj = obj.query;
        }
        if (requestObj) detailObj.setDetailInfo(requestObj);
    });
    hiApp.onPageBeforeAnimation('detail', function (obj) {
        setNavbarNormal();
        var requestObj;
        if (obj) {
            requestObj = obj.query;
        }
        var title = "商品详情";
        var navBox = $$("#centerNavBar .logo"),
            dapeiLogo = ' <div class="logo-text detail">' + title + '</div>';
        navBox.html(dapeiLogo);
        $$("#backToLast").css("display", "");
    });
    hiApp.onPageAfterAnimation('detail', function () {
    });

    hiApp.onPageInit('activity', function (obj) {
        var requestObj;
        if (obj) {
            requestObj = obj.query;
        }
        if (requestObj) activityObj.setActivityList(requestObj);
    });
    hiApp.onPageBeforeAnimation('activity', function (obj) {
        setNavbarNormal();
        var requestObj = obj && obj.query ? obj.query : null;
        var title = requestObj && requestObj.title ? requestObj.title : "活动主题";
        var navBox = $$("#centerNavBar .logo"),
            dapeiLogo = ' <div class="logo-text detail">' + title + '</div>';
        navBox.html(dapeiLogo);
        if (requestObj && requestObj.actionImg) util.preLoadImage(requestObj.actionImg, $$(".top_image"));
        $$("#backToLast").css("display", "");
    });

    hiApp.onPageInit('checkout', function (obj) {
        if (obj) var query = obj.query;
        checkOutObj.setPayInfo(query);
        addressObj.getAddressList();
    });
    hiApp.onPageBeforeAnimation('checkout', function (obj) {
        setNavbarNormal();
        var query;
        if (obj) query = obj.query;
        if (query && query.reload) {
            addressObj.getAddressList();
        }
        var navBox = $$("#centerNavBar .logo"),
            dapeiLogo = ' <div class="logo-text detail">订单结算</div>';
        navBox.html(dapeiLogo);
        $$("#backToLast").css("display", "");
    });

    hiApp.onPageInit('addAddress', function (obj) {
        if (obj) var query = obj.query;
        addressObj.setAddress(query);
    });
    hiApp.onPageBeforeAnimation('addAddress', function (obj) {
        setNavbarNormal();
        var query, title;
        if (obj) query = obj.query;
        if (query.action == 'create') {
            title = '新增地址';
            $$("#rightNavBar").html('<a class="link icon-only" action="create" href="#">创建</a>');
        } else if (query.action == 'update') {
            title = '修改收货地址';
            $$("#rightNavBar").html('<a class="link icon-only" action="update" href="#">保存</a>');
        }
        var navBox = $$("#centerNavBar .logo"),
            dapeiLogo = ' <div class="logo-text detail">' + title + '</div>';
        navBox.html(dapeiLogo);
        $$("#backToLast").css("display", "");
    });

    hiApp.onPageInit('addrManageList', function (obj) {
        addressObj.addressManageList();
    });
    hiApp.onPageBeforeAnimation('addrManageList', function (obj) {
        setNavbarNormal();
        var query;
        if (obj) query = obj.query;
        if (query && query.reload) {
            addressObj.addressManageList();
        }
        var navBox = $$("#centerNavBar .logo"),
            dapeiLogo = '<div class="logo-text detail">我的收货地址</div>';
        navBox.html(dapeiLogo);
        $$("#backToLast").css("display", "");
        $$("#rightNavBar").html('<a class="link icon-only" action="update" style="display: none" href="#">保存</a>');
    });


    hiApp.onPageInit('orderlist', function () {
        var request = util.getRequest(), state;
        if (!request)
            state = null;
        else
            state = request.state;
        orderObj.setOrderList(state);
    });
    hiApp.onPageBeforeAnimation('orderlist', function (obj) {
        setNavbarNormal();
        var request = util.getRequest(), title, state;
        if (request) {
            state = request.state;
            switch (state) {
                case '1':
                    title = '待支付订单';
                    break;
                case '3':
                    title = '待发货订单';
                    break;
                case '4':
                    title = '待收货订单';
                    break;
                default :
                    title = '全部订单';
            }
        } else {
            title = '全部订单';
        }
        if (obj) var query = obj.query;
        if (query && query.reload) orderObj.setOrderList(state);
        var navBox = $$("#centerNavBar .logo"),
            dapeiLogo = '<div class="logo-text detail">' + title + '</div>';
        navBox.html(dapeiLogo);
        $$("#backToLast").css("display", "");
    });

    hiApp.onPageInit('orderdetail', function () {
        var request = util.getRequest();
        orderObj.orderDetail_states(request);
        orderObj.orderDetail_goods(request);
        setTimeout(function () {
            orderObj.orderDetail_address(request);
        }, 500);
    });
    hiApp.onPageBeforeAnimation('orderdetail', function () {
        setNavbarNormal();
        var navBox = $$("#centerNavBar .logo"),
            dapeiLogo = ' <div class="logo-text detail">订单详情</div>';
        navBox.html(dapeiLogo);
        $$("#backToLast").css("display", "");
        $$("#rightNavBar").html('<a class="link icon-only" action="cancel" style="display: none" href="#">取消订单</a>');
    });

    hiApp.onPageInit('coupon', function () {
        couponObj.getCouPonList();
    });
    hiApp.onPageBeforeAnimation('coupon', function () {
        setNavbarNormal();
        var navBox = $$("#centerNavBar .logo"),
            dapeiLogo = ' <div class="logo-text detail">我的优惠券</div>';
        navBox.html(dapeiLogo);
        $$("#backToLast").css("display", "");
    });


    hiApp.onPageInit('gopay', function () {
        var request = util.getRequest();
        setTimeout(function () {
            payObj.gopay(request);
        }, 20);
    });
    hiApp.onPageBeforeAnimation('gopay', function () {
        setNavbarNormal();
        var navBox = $$("#centerNavBar .logo"),
            dapeiLogo = ' <div class="logo-text detail"></div>';
        navBox.html(dapeiLogo);
        $$("#backToLast").css("display", "");
    });
}
/**
 * 设置Navbar为标准状态
 */
function setNavbarNormal() {
    $$("#backToLast").hide();
    $$("#centerNavBar").css('left', 0);
    $$("#rightNavBar").html('');
}

/**
 * 返回事件监听
 * @private
 */
function _backHistory() {
    var url = mainView.url, _url;
    if (url.indexOf('?') != -1)
        _url = url.substr(0, url.indexOf('?'));
    else
        _url = url;
    switch (_url) {
//        case 'page/login.html':
        case 'page/index.html':
        case 'page/brandZone.html':
        case 'page/userCenter.html':
        case 'page/chosen.html':
        case 'page/shoppingCart.html':
//        case 'page/collocation.html':
            hiApp.confirm("确定退出应用？", function () {
                navigator.app.exitApp();
            });
            break;
        default :
            mainView.router.back();
            break;
    }
}

/**
 * framework7 Plugins
 */
function addPlugin() {
    window.Framework7.prototype.plugins = {
        welcomescreen: function (app, globalPluginParams) {
            'use strict';

            // Variables in module scope
            var $$ = Dom7,
                t7 = Template7,
                Welcomescreen;

            // Click handler to close welcomescreen
            $$(document).on('click', '.close-welcomescreen', function (e) {
                util.setLocalStorage('welcome', true);
                e.preventDefault();
                var $wscreen = $$(this).parents('.welcomescreen-container');
                if ($wscreen.length > 0 && $wscreen[0].f7Welcomescreen) {
                    $wscreen[0].f7Welcomescreen.close();
                }
            });

            /**
             * Represents the welcome screen
             *
             * @class
             * @memberof module:Framework7/prototype/plugins/welcomescreen
             */
            Welcomescreen = function (slides, options) {

                // Private properties
                var self = this,
                    defaultTemplate,
                    template,
                    container,
                    swiper,
                    swiperContainer,
                    defaults = {
                        closeButton: true,        // enabled/disable close button
                        closeButtonText: 'Skip', // close button text
                        cssClass: '',             // additional class on container
                        pagination: true,         // swiper pagination
                        loop: false,              // swiper loop
                        open: true                // open welcome screen on init
                    };

                /**
                 * Initializes the swiper
                 *
                 * @private
                 */
                function initSwiper() {
                    swiper = new Swiper('.swiper-container', {
                        direction: 'horizontal',
                        loop: options.loop,
                        pagination: options.pagination ? swiperContainer.find('.swiper-pagination') : undefined
                    });
                }

                /**
                 * Sets colors from options
                 *
                 * @private
                 */
                function setColors() {
                    if (options.bgcolor) {
                        container.css({
                            'background-color': options.bgcolor,
                            'color': options.fontcolor
                        });
                    }
                }

                /**
                 * Sets the default template
                 *
                 * @private
                 */
                function defineDefaultTemplate() {
                    defaultTemplate = '<div class="welcomescreen-container {{#if options.cssClass}}{{options.cssClass}}{{/if}}">' +
                        '{{#if options.closeButton}}' +
                        '<div class="welcomescreen-closebtn close-welcomescreen">{{options.closeButtonText}}</div>' +
                        '{{/if}}' +
                        '<div class="welcomescreen-swiper swiper-container">' +
                        '<div class="swiper-wrapper">' +
                        '{{#each slides}}' +
                        '<div class="swiper-slide" {{#if id}}id="{{id}}"{{/if}}>' +
                        '{{#if content}}' +
                        '<div class="welcomescreen-content">{{content}}</div>' +
                        '{{else}}' +
                        '{{#if picture}}' +
                        '<div class="welcomescreen-picture">{{picture}}</div>' +
                        '{{/if}}' +
                        '{{#if text}}' +
                        '<div class="welcomescreen-text">{{text}}</div>' +
                        '{{/if}}' +
                        '{{/if}}' +
                        '</div>' +
                        '{{/each}}' +
                        '</div>' +
                        '{{#if options.pagination}}' +
                        '<div class="welcomescreen-pagination swiper-pagination"></div>' +
                        '{{/if}}' +
                        '</div>' +
                        '</div>';
                }

                /**
                 * Sets the options that were required
                 *
                 * @private
                 */
                function applyOptions() {
                    var def;
                    options = options || {};
                    for (def in defaults) {
                        if (typeof options[def] === 'undefined') {
                            options[def] = defaults[def];
                        }
                    }
                }

                /**
                 * Compiles the template
                 *
                 * @private
                 */
                function compileTemplate() {
                    if (!options.template) {
                        // Cache compiled templates
                        if (!app._compiledTemplates.welcomescreen) {
                            app._compiledTemplates.welcomescreen = t7.compile(defaultTemplate);
                        }
                        template = app._compiledTemplates.welcomescreen;
                    } else {
                        template = t7.compile(options.template);
                    }
                }

                /**
                 * Shows the welcome screen
                 *
                 * @public
                 * @memberof module:Framework7/prototype/plugins/welcomescreen
                 */
                self.open = function () {
                    container = $$(template({options: options, slides: slides}));
                    swiperContainer = container.find('.swiper-container');
                    setColors();
                    $$('body').append(container);
                    initSwiper();
                    container[0].f7Welcomescreen = self;
                    if (typeof options.onOpened === 'function') {
                        options.onOpened();
                    }
                };

                /**
                 * Hides the welcome screen
                 *
                 * @public
                 * @memberof module:Framework7/prototype/plugins/welcomescreen
                 */
                self.close = function () {
                    if (swiper) {
                        swiper.destroy(true);
                    }
                    if (container) {
                        container.remove();
                    }
                    container = swiperContainer = swiper = undefined;
                    if (typeof options.onClosed === 'function') {
                        options.onClosed();
                    }
                };

                /**
                 * Shows the next slide
                 *
                 * @public
                 * @memberof module:Framework7/prototype/plugins/welcomescreen
                 */
                self.next = function () {
                    if (swiper) {
                        swiper.slideNext();
                    }
                };

                /**
                 * Shows the previous slide
                 *
                 * @public
                 * @memberof module:Framework7/prototype/plugins/welcomescreen
                 */
                self.previous = function () {
                    if (swiper) {
                        swiper.slidePrev();
                    }
                };

                /**
                 * Goes to the desired slide
                 *
                 * @param {number} index The slide to show
                 * @public
                 * @memberof module:Framework7/prototype/plugins/welcomescreen
                 */
                self.slideTo = function (index) {
                    if (swiper) {
                        swiper.slideTo(index);
                    }
                };

                /**
                 * Initialize the instance
                 *
                 * @method init
                 */
                (function () {
                    defineDefaultTemplate();
                    compileTemplate();
                    applyOptions();

                    // Open on init
                    if (options.open) {
                        self.open();
                    }

                }());

                // Return instance
                return self;
            };

            app.welcomescreen = function (slides, options) {
                return new Welcomescreen(slides, options);
            };

        }
    };
}
/**
 * 欢迎页
 */
function welcome() {
    //welcomeScreen
    var myapp = myapp || {};
    myapp.pages = myapp.pages || {};
    myapp.pages.IndexPageController = function (_hiApp, $$) {
        var options = {
                'bgcolor': '#0da6ec',
                'fontcolor': '#fff',
                'onOpened': function () {
                    console.log("welcome screen opened");
                },
                'onClosed': function () {
                    console.log("welcome screen closed");
                }
            },
            welcomescreen_slides,
            welcomescreen;

        welcomescreen_slides = [
            {
                id: 'slide0',
                picture: '<div class="tutorialicon">♥</div>',
                text: 'Welcome to this tutorial. In the <a class="tutorial-next-link" href="#">next steps</a> we will guide you through a manual that will teach you how to use this app.'
            },
            {
                id: 'slide1',
                picture: '<div class="tutorialicon">✲</div>',
                text: 'This is slide 2'
            },
            {
                id: 'slide2',
                picture: '<div class="tutorialicon">♫</div>',
                text: 'This is slide 3'
            },
            {
                id: 'slide3',
                picture: '<div class="tutorialicon">☆</div>',
                text: 'Thanks for reading! Enjoy this app or go to <a class="tutorial-previous-slide" href="#">previous slide</a>.<br><br><a class="tutorial-close-btn close-welcomescreen" href="#">End Tutorial</a>'
            }

        ];

        welcomescreen = _hiApp.welcomescreen(welcomescreen_slides, options);
    };
    var ipc = new myapp.pages.IndexPageController(hiApp, $$);
}






