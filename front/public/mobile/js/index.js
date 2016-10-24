/* globals $$: false,Dom7:false,require:false,appConfig:false,util:false,hiApp:false,console:false,mainView:false,
 alert:false,define:false,newIndexObj:false,myAddressObj:false,loginObj:false */

//  "use strict";
var app = {
    //这个属性是给路由重定向使用的
    preloadNum: 0,
    initialize: function () {
        if (typeof(cordova) !== 'undefined') {
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
        var fastClicks = false, animateNavBackIcon = false , animatePages = false;
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
//            swipePanel: 'left',
            precompileTemplates: true,
            preloadPreviousPage:true,
            //路由重置
            //Caution : 百度统计不在这里，在router中
            preroute: function (view, options) {

                var urllist = view.history.concat();
                var len = urllist.length;

                //后退过程
                if ((typeof options).toLowerCase() === "object" && options.backFlag && !options.force) {
                    options.backFlag = false;

                    // 如果路由记录的是以下界面（满足以下条件），则返回至上一页的上一页
                    //TODO : 这里估计有问题，不是真正的back，此处应该是back，非load
                    //caution : 回退的时候会加载上一页面，同时会预加载上一页的上一页，当预加载上一页的时候，不调用这里
                    if ((urllist[len - 2] === "page/login.html" && userObj.isExist() && !options.preloadOnly)) {
                        if (app.preloadNum === 0) {
                            app.preloadNum = 1;

                            mainView.router.back({
                                url:urllist[len - 3],
                                force:true,
                                backFlag:false,
                                backLength:-2
                            });
                            return false;
                        }
                        else {
                            app.preloadNum = 0;
                        }
                    }
                }
                //前进过程
                else {
                    if ((typeof options).toLowerCase() === "object")
                        //进入到订单确认页面时，先验证是否登录,然后进入订单确认页
                        if("page/orderConfirm.html" === options.url) {
                            if (!userObj.isExist()) {
                                loginRegisterObj.comeFrom = options.url;
                                view.router.loadPage('page/login.html');
                                return false;
                            }
                        }
                        //进入到订单详情页面时，先验证是否登录，然后进入首页,若登录进入相应模块处理
                        //目前唯一能进到这里的场景是：支付跳转之后，由于切换浏览器，导致信息丢失
                        else if("page/orderDetail.html"  === options.url.split("?")[0]){
                            if (!userObj.isExist()) {
                                view.router.loadPage('page/index.html');
                                return false;
                            }
                        }
                        else if("page/shoppinglists.html" === options.url) {
                            if (!userObj.isExist()) {
                                loginRegisterObj.comeFrom = options.url;
                                view.router.loadPage('page/login.html');
                                return false;
                            }
                        }
                    }
                }
        });
        window.mainView = hiApp.addView('#mainView');
        if ((device.iphone || device.android) && typeof(cordova) !== 'undefined') {
            util.checkUpdate();
            if (!localStorage.getItem('welcome')) {
                welcome();
            }
        }
        var width = $$(window).width();
        if(width>768){
            $$(document.body).css({"width":"640px","margin":"0 auto"});
        }

        mainView.router.loadPage('page/index.html');

        //初始化状态
        userObj.isExist();

        bindTapEvent(document,".toolbar .tab-link",function(_this){
            var _href = $$(_this).attr('content-href');
            mainView.loadPage({
                url:_href
            });
            $$(".toolbar .tab-link").removeClass("active");
            $$(_this).addClass("active");
        });

        bindTapEvent(document, ".vip-ok-btn", function(){
            $$(".loading-mask.main").hide();
            $$("#inform").hide();
        });

       //领红包入口
        /*bindTapEvent( document , '.redpackImport', function(_this){
            mainView.router.loadPage({
                url:'page/redpack.html'
            });
        });

        //这里判断是不是新人
        if(userObj.isExist()){
            util.getAjaxData({
                url:appConfig.ISNEWSRECEIVE_URL + "?loginid=" + userObj.ID,
                success:function(json){
                    try{
                        if(json){
                            json = JSON.parse(json);
                            console.log(json);
                            if(json.STATUSCODE ==200){
                                $$(".news-welcome-dialog").show();
                            }
                        }
                    }catch (e){

                        }
                }
            });
        }

        //领取---新人专享红包  囊括  关闭按钮的事件
        bindTapEvent( document , '.news-welcome-dialog', function(_this,e){
           $$(".news-welcome-dialog").hide();
         //$$(".main.loading-mask").hide();
            if(e.target && !$$(e.target).hasClass('pop-dialog-close')){
                mainView.router.loadPage({
                    url:"page/redpack.html"
                });
            }else{

            }
        });*/

        //分享按钮--目前只能在详情页面分享
        bindTapEvent(document,".share-icon", function(){
            var imgUrl;
            if($$(".detail-page .color-size-box .imgbox img").length>0){
                imgUrl=  $$(".detail-page .color-size-box .imgbox img").attr('src');
            }
            var title = $$(".detail-page .good-detail .good-title").text();
            var jsonArr= {
                title : "【百宝香】 " + title,
                url : "http://m.bbxvip.com/app_download/shareUrl.html",
                text : "百宝香（m.bbxvip.com），买童装就到百宝香!   http://m.bbxvip.com/app_download/shareUrl.html",
                imageUrl :  imgUrl || "http://m.bbxvip.com/activity/shareRedirect/512.png"
            };
            var device = Framework7.prototype.device ,share;
            if(device.android){
                share = "SSOLogin";
            }else{
                share = "Share";
            }
            if(app_type === 'app'){
                util.cordovaExec(function(){
                    hiApp.alert("分享成功");
                },function(){
                    hiApp.alert("分享失败");
                }, share , "shareInfo", [jsonArr.title,jsonArr.url,jsonArr.text,jsonArr.imageUrl]);
            }
        });


        //app下载与统计
        bindTapEvent(document , ".app-download",function(_this,e){
            if($$(e.target).hasClass("close-img")){
                $$(".app-download").hide();
                return false;
            }else{
                util.writeAjaxLog("","","webLog",{userAction:'app_download_web'});
                var timeout = setTimeout(function(){
                    clearTimeout(timeout);
                    window.location.href = "http://m.bbxvip.com/app_download/redirect.html";
                },100);
            }
        });

        //关闭panel-left
        bindTapEvent(document,".panel-left",function(_this){
            hiApp.closePanel('left');
        });

        //跳转登录页
        bindTapEvent(".panel","#slideLogin", function (_this) {
//            alert("1");
            loginRegisterObj.curTab = 0;
            loginRegisterObj.comeFrom = 'page/index.html';
            mainView.router.loadPage('page/login.html');
        });
        //跳转注册页
        bindTapEvent(".panel","#slideReg", function (_this) {
            loginRegisterObj.curTab = 1;
            loginRegisterObj.comeFrom = 'page/index.html';
            mainView.router.loadPage('page/login.html');
        });
        //查看我的收货地址
        bindTapEvent(".panel","#slideMyAddress", function (_this) {
            userObj.noIDGotoLogin('page/myAddressAdd.html');
        });
        //查看我的优惠券
        bindTapEvent(".panel","#slideMyCoupon", function (_this) {
            userObj.noIDGotoLogin('page/coupon.html');
        });
        //全部
        bindTapEvent(".panel","#slideOrderAll", function (_this) {
            shoppingListsObj.tab = 1;
            userObj.noIDGotoLogin('page/shoppinglists.html');
        });
        //待付款
        bindTapEvent(".panel","#slideOrderToPay", function (_this) {
            shoppingListsObj.tab = 2;
            userObj.noIDGotoLogin('page/shoppinglists.html');
        });
        //待收货
        bindTapEvent(".panel","#slideOrderToGet", function (_this) {
            shoppingListsObj.tab = 3;
            userObj.noIDGotoLogin('page/shoppinglists.html');
        });
        //退款中
        bindTapEvent(".panel","#slideOrderToSend", function (_this) {
            shoppingListsObj.tab = 4;
            userObj.noIDGotoLogin('page/shoppinglists.html');
        });
        //已买到
        bindTapEvent(".panel","#slideOrderToBack", function (_this) {
            shoppingListsObj.tab = 5;
            userObj.noIDGotoLogin('page/shoppinglists.html');
        });
        //进入个人中心
        bindTapEvent(".panel","#userInfoLink",function(_this){
            if(!userObj.isExist()) return;
            mainView.router.loadPage('page/userCenter/userCenter.html');
        });
        //设置
        bindTapEvent(".panel","#setting",function(_this){
            mainView.router.loadPage('page/setting.html');
        });
        //拨打电话
        bindTapEvent(".panel","#telphoneCall",function(){
            util.phoneCall();
        });
    }
};
app.initialize();
router.init();

/**
 * 回到顶部
 * @param top
 * @param duration
 * @param callback
 * @private
 */
function _scrollTop(top,duration,callback){
    $$(".page-content").scrollTop(top,duration,callback);
}
/**
 * 截获滚动事件
 * @param _this
 * @private
 */
var scrollInit=0;
function _onScroll(_this, page){
    var _scrTop = $$(_this).scrollTop(),
        _height = $$( page + '.page-content').height();
//    console.log($$( page + ".gotop"))
    if(_scrTop>_height && _scrTop>1000){
        $$( page + ".gotop").show();
    }else{
        $$( page + ".gotop").hide();
    }
    /*if(scrollInit < _scrTop){
        $$(".classify-page  .type-tab").hide(1000);
        $$(".classify-page .order-tab").hide(1000);
    }else{
        $$(".classify-page  .type-tab").show(400);
        $$(".classify-page .order-tab").show(400);
    }*/
    scrollInit = _scrTop;
}

/**
 * 场景列表页面下拉时首图放大
 * @param translate
 */
var initHeight;
function pullToChange(translate){
    if(!translate) return;
    var __scale = 1 + 2 * translate/414;

    if(!initHeight) {
        initHeight = $$(".scene-page .scene-top-img-con").css('height');
    }
    $$(".scene-page .scene-top-img-con").attr('init-height',initHeight);
    var _height = parseFloat(initHeight) * __scale;
    $$(".scene-page .scene-top-img").css({
        "transform-origin":"50% 0",
        "-webkit-transform-origin":"50% 0",
        transform:"scale("+__scale+")",
        "-webkit-transform":"scale("+__scale+")"
    });
    $$(".scene-page .scene-top-img").parent().css('height',_height + "px");

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
 * tap事件封装
 * @param dom
 * @param callback
 */
function bindTapEvent(page, dom, callback,capture) {

    $$(page).off("click").on('click', dom, function (e) {
        callback && callback(this, e);
    },capture ? false:true);
    /* var touch={};
     $$(document).on('touchstart',dom,function (e) {
     touch.x1 = e.touches[0].pageX;
     touch.y1 = e.touches[0].pageY;
     touch.x2 = e.touches[0].pageX;
     touch.y2 = e.touches[0].pageY;
     }).on("touchmove", dom,function (e) {
     touch.x2 = e.touches[0].pageX;
     touch.y2 = e.touches[0].pageY;
     }).on('touchend', dom, function (e) {
     if ((touch.x2 && Math.abs(touch.x1 - touch.x2) < 30) &&
     (touch.y2 && Math.abs(touch.y1 - touch.y2) < 30)) {
     callback && callback(this,e);
     }
     });*/
}


/**
 * android call
 * @private
 */
function callShare(){
    var arguArr, url, cookieInfo, cookieArr;
    if(arguments && arguments[0]){
        arguArr = arguments[0].split("|");
    }
    if(arguArr){
        if( arguArr.length == 2 ){
            url = arguArr[0];
            cookieInfo = arguArr[1];
            cookieArr = cookieInfo.split(";");
        }else{
            url = arguArr[0];
        }
    }else {
        hiApp.alert("系统错误");
        return;
    }
    var title ="", imgUrl;
    //这里是从cookie里面获取分享的内容
    if(cookieArr && cookieArr.length>0){
        for(var i=0;i <cookieArr.length; i++){
            if(cookieArr[i].indexOf("title")>-1){
                title = cookieArr[i].substr(7);
            }
            if(cookieArr[i].indexOf("shareImg")>-1){
                imgUrl = cookieArr[i].substr(10);
            }
            if(cookieArr[i].indexOf("shareUrl")>-1){
                url = cookieArr[i].substr(10);
            }
        }
    }
    var jsonArr= {
        title : "【百宝香】 " + title,
        url : url,
        text : "百宝香（m.bbxvip.com），买童装就到百宝香!   http://m.bbxvip.com/app_download/shareUrl.html",
        imageUrl :  imgUrl || "http://m.bbxvip.com/activity/shareRedirect/512.png"
    };
    var device = Framework7.prototype.device ,share;
    if(device.android){
        share = "SSOLogin";
    }else{
        share = "Share";
    }
    if(app_type === 'app'){
        util.cordovaExec(function(){
            hiApp.alert("分享成功");
        },function(){
            hiApp.alert("分享失败");
        }, share , "shareInfo", [jsonArr.title,jsonArr.url,jsonArr.text,jsonArr.imageUrl]);
    }
}


/**
 * 返回事件监听
 * @private
 * Caution ：这个函数是给移动端调用的函数，用于截获移动操作系统的后退事件
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
        case 'page/userCenter/userCenter.html':
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
    "use strict";
    window.Framework7.prototype.plugins = {
        welcomescreen: function (app, globalPluginParams) {

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
                        /*container.css({
                            'background-color': options.bgcolor,
                            'color': options.fontcolor
                        });*/
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
                       /* '<div class="welcomescreen-closebtn close-welcomescreen">{{options.closeButtonText}}</div>' +*/
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
        var imgPath = ["img/welcome/4s+1.png","img/welcome/4s+2.png","img/welcome/4s+3.png"];
        var height = parseInt($$(window).height());
        if(height <= 480){
            imgPath = ["img/welcome/4s_1.png","img/welcome/4s_2.png","img/welcome/4s_3.png"];
        }
        welcomescreen_slides = [
            {
                id: 'slide0',
                picture: '<div class="tutorialicon"><img width="100%" src='+imgPath[0]+'></div>'
               // text: 'Welcome to this tutorial. In the <a class="tutorial-next-link" href="#">next steps</a> we will guide you through a manual that will teach you how to use this app.'
            },
            {
                id: 'slide1',
                picture: '<div class="tutorialicon"><img width="100%" src='+imgPath[1]+'></div>'
             //   text: 'This is slide 2'
            },
            {
                id: 'slide2',
                picture: '<div class="tutorialicon"><img width="100%" src='+imgPath[2]+'></div>',
                text: '<div class="close-welcomescreen" style="width: 50%;margin-left: 25%"><img width="100%" src="img/newIcon/openShopping.png"></div>'
            }

        ];

        welcomescreen = _hiApp.welcomescreen(welcomescreen_slides, options);
    };
    var ipc = new myapp.pages.IndexPageController(hiApp, $$);
}







