/**
 * 登录注册都在这
 * 找回密码也在这
 * 修改密码也在这
 * 找回密码之所以在这，主要是因为发送验证码那段是一样的。
 * 而且我也不想把账号初始化过程分开在两个文件里
 * 修改密码放在这，同上
 *      ------  by  yczhu
 */

/* globals $$: false,appConfig:false,util:false,hiApp:false,console:false,mainView:false,
 define:false,newIndexObj:false,myAddressObj:false,cartObj:false,bindTapEvent:false,statusCode:false,cordova:false,shoppingCartObj:false */
var registerCodeCount = 0;

var loginRegisterObj = {
    curTab: 0,
    comeFrom: '',
    outUrl:"",
    init: function () {
        "use strict";
        var that = this;
        var page = ".loginPage";

        //这里用于区分是否显示联合登录的按钮
        if(app_type == 'app'){
            var device = Framework7.prototype.device;
            if( device.ios || device.iphone ){
                util.cordovaExec(function (success) {
                    if(success == '1001'){
                        //  hiApp.alert('均已安装');
                    }
                }, function (fail) {
                    if(fail == '1002'){
                        $$("#weixinLogin").hide();
                        $$("#qqLogin").hide();
                    }
                    if(fail == '1003'){
                        $$("#qqLogin").hide();
                    }
                    if(fail == '1004'){
                        $$("#weixinLogin").hide();
                    }
                }, "SSOLogin","isInstalled", []);
            }
        }else{
            //这里是 web
            $$("#weiboLogin").hide();
            $$("#qqLogin").hide();

            if (navigator.userAgent.toLowerCase().indexOf('micromessenger') == -1) {
                $$("#weixinLogin").hide();
            }
        }

        function loginBtnChangeColor(){
            if ($$("#loginPwdInput").val() && $$("#loginMobileInput").val()) {
                $$("#loginBtn").addClass("act");
            }
            else {
                $$("#loginBtn").removeClass("act");
            }
        }

        //framework7没有封装input方法，只能这样
        document.getElementById("loginMobileInput").addEventListener("input",loginBtnChangeColor);

        //framework7没有封装input方法，只能这样
        document.getElementById("loginPwdInput").addEventListener("input", loginBtnChangeColor);

        function regBtnChangeColor(){
            if ($$("#registerMobileInput").val() && $$("#registerCodeInput").val() && $$("#registerPwdInput").val().length > 6) {
                $$("#goToRegister").addClass("act");
            }
            else {
                $$("#goToRegister").removeClass("act");
            }
        }

        //framework7没有封装input方法，只能这样
        document.getElementById("registerMobileInput").addEventListener("input",regBtnChangeColor);

        //framework7没有封装input方法，只能这样
        document.getElementById("registerCodeInput").addEventListener("input",regBtnChangeColor);

        //framework7没有封装input方法，只能这样
        document.getElementById("registerPwdInput").addEventListener("input", regBtnChangeColor);

        //登录按钮
        bindTapEvent(page, '#loginBtn', function (_this) {
            var mobile = $$("#loginMobileInput").val();
            var pwd = $$("#loginPwdInput").val();
            if (mobile && pwd) {
                loginRegisterObj.loginAjax(mobile, pwd, 0);
            }
            else {
                hiApp.alert("请输入手机号和密码~");
            }
        });

        //注册发送验证码
        bindTapEvent(page, '#registerCodeBtn', function (_this) {
            var mobile = $$("#registerMobileInput").val();
            if (mobile) {
                //发送验证码之前先验证是否被注册
                //成功后发送验证码。回调函数在下面这个函数中
                loginRegisterObj.checkMobileAjax(mobile);
            }
            else {
                hiApp.alert("请填个手机号码先~");
            }
        });

        //注册按钮
        bindTapEvent(page, '#goToRegister', function (_this) {
            var mobile = $$("#registerMobileInput").val(),
                password = $$("#registerPwdInput").val(),
                code = $$("#registerCodeInput").val();

            if (loginRegisterObj.regOrForgotCheck(mobile,password,code)) {
                loginRegisterObj.registerAjax(mobile, password, code);
            }
        });
        //登录tab
        bindTapEvent(page, '#loginTab', function (_this) {
            loginRegisterObj.curTab = 0;
        });
        //注册tab
        bindTapEvent(page, '#registerTab', function (_this) {
            loginRegisterObj.curTab = 1;
        });
        //返回
        bindTapEvent(page, '#loginGoBack', function (_this) {
            loginRegisterObj.loginBack();
        });

        //联合登录
        //todo yanchen_zhu 这块可以封装一下，区分是web还是app，把联合登录的类型和应用的类型送到一个方法里，统一调用就妥妥的了
        //暂时先不动，等待QQ联合登录OK
        bindTapEvent(page, '#qqLogin', function (_this) {
            loginRegisterObj.crossLoginHelper("QQ","SSOLogin","loginQQInfo");
        });

        bindTapEvent(page, '#weixinLogin', function (_this) {
            loginRegisterObj.crossLoginHelper("weixin","SSOLogin", "loginWeiXinInfo");
        });

        bindTapEvent(page, '#weiboLogin', function (_this) {
            loginRegisterObj.crossLoginHelper("weibo","SSOLogin", "getSinaWeiboInfo");
        });
    },
    initForgotPwd: function () {
        "use strict";
        var that = this;
        var page = ".forgotPwdPage";

        //找回密码发送验证码
        bindTapEvent(page, '#forgotPwdCodeBtn', function (_this) {
            var mobile = $$("#forgotPwdMobileInput").val();
            if (mobile) {
                loginRegisterObj.getForgotCode(mobile);
            }
            else {
                hiApp.alert("请填个手机号码先~");
            }

        });

        //找回密码
        bindTapEvent(page, '#forgetBtn', function (_this) {
            "use strict";
            var mobile = $$("#forgotPwdMobileInput").val();
            var pwd = $$("#forgotPwdPwdInput").val();
            var code = $$("#forgotPwdCodeInput").val();

            if (loginRegisterObj.regOrForgotCheck(mobile,pwd,code)) {
                loginRegisterObj.forgotAjax(mobile, pwd, code);
            }
        });
    },
    showLoginReg: function () {
        "use strict";
        $$("#mainViewNavBar").hide();
        var that = this;

        if (that.curTab === 1) {
            $$("#loginTab").removeClass("active");
            $$("#registerTab").addClass("active");
            $$("#tabLogin").removeClass("active");
            $$("#tabReg").addClass("active");
            $$(".tabs").transform("translate3d(-100%, 0px, 0px)");
        }
    },
    loginAjax: function (mobile, password, autoLogin) {
        "use strict";
        hiApp.showIndicator();
        if(!mobile || !password) return;
        util.getAjaxData({
            url: appConfig.GOLOGIN_URL,
            data: {mobile: mobile, password: password},
            type: 'POST',
            error: function (data) {
                hiApp.hideIndicator();
                hiApp.alert('用户不存在，请重试');
                return false;
            },
            success: function (data) {
                hiApp.hideIndicator();
                console.log(data);
                try {
                    if (!data) {
                        return;
                    }
                    data = JSON.parse(data);
                    loginRegisterObj.loginSuccessCall(data, autoLogin);
                }
                catch (ex) {
                    hiApp.alert('后台数据出错，请重试');
                    return false;
                }
            }
        });
    },
    loginSuccessCall: function (data, autoLogin,url) {
        "use strict";
        var that = this;

        if (data.STATUSCODE !== statusCode.SUCCESS) {
            hiApp.alert(data.MSG);
            return false;
        }

        userObj.setCurUser(util.upperCase(data.DATA));
        userObj.setLocalUser();

        //本地购物意向加入到购物车（批量）
        var list = shoppingCartObj2.formatLocalListForBatch();
        if (list && list.length) {
            //如果出现库存不足，直接由服务端将这一项丢失
            shoppingCartObj2.batchChangeGoodsNum(data.ID, list, autoLogin);
        }
        else {
            that.loginGoToHelper(autoLogin,url);
        }
    },
    //这个函数写在这里，主要是给shoppingCartObj在同步完成之后调用
    loginGoToHelper: function (autoLogin,url) {
        if (autoLogin === 1) {
            //参数a=2无实际意义，仅表示自动登录走了不一样的流程，供调试用
            mainView.router.loadPage('page/index.html?a=2');
        } else if (autoLogin === 0) {
            //跳至网站外（外链带进来的）
            if(loginRegisterObj.outUrl){
                if(app_type == "web"){
                    //web端直接打开
                    window.location.href = loginRegisterObj.outUrl;
                }else{
                    //用app打开外部链接
                    var _href, cookie, ref;
                    _href = loginRegisterObj.outUrl;
                    if(userObj.isExist()) {
                        cookie = 'loginid='+ userObj.ID + ';userAccount='+ userObj.MEMBERACCOUNT +'@Path=/';
                        ref = cordova.InAppBrowser.open(_href, '_blank', 'location=yes;clearAllCache=true',function(){}, cookie);
                    }else{
                        ref = cordova.InAppBrowser.open(_href, '_blank', 'location=yes');
                    }
                    ref.show();
                }
            }
            else if (loginRegisterObj.comeFrom) {
                mainView.router.loadPage(loginRegisterObj.comeFrom);
            }
            //如果在登录页独立刷新
            else if(mainView.history.length === 2 ){
                mainView.router.loadPage('page/index.html');
            }
            else {
                mainView.router.loadPage('page/index.html');
            }
        }
    },
    loginBack: function () {
        if (userObj.isExist()) {
            mainView.router.back();
        }
        else {
            //mainView.router.loadPage('page/index.html');
            mainView.router.loadPage('page/mycenter.html');
        }
    },
    /**
     * 获取验证码
     */
    getRegisterCode: function (mobile) {
        "use strict";
        var that = this;
        if (mobile) {
            that.getCodeAjax(mobile, that.regGetCodeSuccess);
        }
    },
    getCodeAjax: function (mobile, successCall) {
        "use strict";
        hiApp.showIndicator();
        if(!mobile) return;
        util.getAjaxData({
            'url': appConfig.GETMOBILECODE_URL,
            type: 'post',
            data: {
                'mobile': mobile
            },
            error: function () {
                hiApp.hideIndicator();
                return false;
            },
            success: function (data) {
                hiApp.hideIndicator();
                if (!data) {
                    return;
                }
                console.log(data);
                data = JSON.parse(data);
                if (data.STATUSCODE === statusCode.SUCCESS) {
                    successCall();
                }
                else {
                    hiApp.alert("验证码发送失败~");
                }
            }
        });
    },
    regGetCodeSuccess: function () {
        "use strict";
        hiApp.alert("验证码已发送！");
        registerCodeCount = 60;
        $$('#registerCodeBtn').attr('disabled', 'true');
        $$('#registerCodeBtn').html('重新发送(' + registerCodeCount + ')');
        var InterValObj = window.setInterval(function () {
            if (registerCodeCount === 0) {
                window.clearInterval(InterValObj);  //停止计时器
                $$('#registerCodeBtn').removeAttr('disabled');//启用按钮
                $$('#registerCodeBtn').html('重发验证码');
            }
            else {
                registerCodeCount--;
                $$('#registerCodeBtn').html('重新发送(' + registerCodeCount + ')');
            }
        }, 1000);
    },
    checkMobileAjax: function (mobile) {
        "use strict";
        var that = this;
        if(!mobile) return;
        util.getAjaxData({
            url: appConfig.CHECKMIBILE_URL,
            type: 'post',
            data:{
                mobile : mobile
            },
            success: function (data) {
                if (data) {
                    data = JSON.parse(data);
                    //这里就是这样，成功表示存在，不成功才是不存在
                    if (data.STATUSCODE === statusCode.SUCCESS) {
                        hiApp.alert("手机号已被注册！");
                    }
                    else {
                        that.getRegisterCode(mobile);
                    }
                }
            },
            error: function () {
            }
        });
    },
    /**
     * 注册提交
     */
    registerAjax: function (mobile, password, code) {
        "use strict";
        var that = this,agentId;
        if(!mobile || !password || !code) return;
        hiApp.showIndicator();
        //判断是否是渠道包(仅限app)
        if(app_channelNum && app_type == "app"){
            agentId = app_channelNum;
        }
        if(util.getCookie('agentId')){
            agentId = util.getCookie('agentId');
        }
        util.getAjaxData({
            url: appConfig.TORIGISTER_URL,
            type: 'post',
            data: {
                mobile: mobile,
                password: password,
                validcode: code,
                agentId : agentId || ""
            },
            success: function (data) {
                hiApp.hideIndicator();
                if (!data) {
                    hiApp.alert("服务器错误，请稍后重试~");
                } else {
                    try {
                        data = JSON.parse(data);
                        console.log(data);
                        if (data.STATUSCODE === statusCode.SUCCESS) {
                            hiApp.alert("注册成功！");
                            //调用这个有点命名上的误导
                            if(data.MSG)
                                data.DATA = data.MSG;
                            that.loginSuccessCall(data, 0);
                        } else {
                            hiApp.alert(data.MSG);
                        }
                    } catch (e) {

                    }
                }
            },
            error: function () {
                hiApp.alert("连接服务器超时！");
                hiApp.hideIndicator();
                return false;
            }
        });
    },
    getForgotCode: function (mobile) {
        "use strict";
        var that = this;
        if (mobile) {
            that.getCodeAjax(mobile, that.forgotGetCodeSuccess);
        }
    },
    forgotGetCodeSuccess: function () {
        "use strict";
        hiApp.alert("验证码已发送~");
        registerCodeCount = 60;
        $$('#forgotPwdCodeBtn').attr('disabled', 'true');
        $$('#forgotPwdCodeBtn').html('重新发送(' + registerCodeCount + ')');
        var InterValObj = window.setInterval(function () {
            if (registerCodeCount === 0) {
                window.clearInterval(InterValObj);  //停止计时器
                $$('#forgotPwdCodeBtn').removeAttr('disabled');//启用按钮
                $$('#forgotPwdCodeBtn').html('重发验证码');
            }
            else {
                registerCodeCount--;
                $$('#forgotPwdCodeBtn').html('重新发送(' + registerCodeCount + ')');
            }
        }, 1000);
    },
    forgotAjax: function (mobile, pwd, code) {
        "use strict";
        var that = this;
        if(!mobile || !pwd || !code) return ;
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.FORGOTPWD_URL,
            type: 'post',
            data: {
                mobile: mobile,
                password: pwd,
                validcode: code
            },
            success: function (data) {
                hiApp.hideIndicator();
                if (!data) {
                    hiApp.alert("服务器错误，请稍后重试！");
                } else {
                    try {
                        data = JSON.parse(data);
                        console.log(data);
                        if (data.STATUSCODE === statusCode.SUCCESS) {
                            hiApp.alert("密码重置成功！");
                            that.loginSuccessCall(data, 0);
                        } else {
                            hiApp.alert("密码重置失败！您输入的信息有误！");
                        }
                    } catch (e) {

                    }
                }
            },
            error: function () {
                hiApp.alert("连接服务器超时！");
                hiApp.hideIndicator();
                return false;
            }
        });
    },
    regOrForgotCheck : function(mobile,password,code){
        if (!mobile) {
            hiApp.alert("请输入手机号先~");
            return false;
        } else if (!password) {
            hiApp.alert("请输入密码先~");
            return false;
        }
        else if (password.length < 6) {
            hiApp.alert("密码长度要大于6位~");
            return false;
        }
        else if(!code){
            hiApp.alert("请输入验证码先~~");
            return false;
        }
        else{
            return true;
        }
    },
    resetInit: function () {
        var page = ".resetPwd-page";

        bindTapEvent(page, '#resetPwdBtn', function (_this) {
            var new1 = $$("#newpwdInput1").val();
            var new2 = $$("#newpwdInput2").val();
            var old = $$("#oldpwdInput").val();
            if (new1 !== new2) {
                hiApp.alert("两次输入的新密码不一致哈~");
            }
            else if (!new2) {
                hiApp.alert("新密码不能为空~");
                return false;
            }
            else if (new2.length < 6) {
                hiApp.alert("新密码长度要大于6位~");
                return false;
            }
            else {
                loginRegisterObj.resetPwdAjax(new2, old);
            }
        });
    },
    resetPwdAjax: function (newPwd, oldPwd) {
        var that = this;
        hiApp.showIndicator();
        if(!newPwd || !oldPwd) return;
        util.getAjaxData({
            url: appConfig.RESETPWD_URL,
            type: 'post',
            data: {
                loginid: userObj.isExist(),
                newpassword: newPwd,
                oldpassword: oldPwd
            },
            success: function (data) {
                hiApp.hideIndicator();
                if (!data) {
                    hiApp.alert("服务器错误，请稍后重试！");
                } else {
                    try {
                        data = JSON.parse(data);
                        console.log(data);
                        if (data.STATUSCODE === statusCode.SUCCESS) {
                            hiApp.alert("密码修改成功~", "", function () {
                                mainView.router.back();
                            });
                        } else {
                            hiApp.alert(data.MSG);
                        }
                    } catch (e) {

                    }
                }
            },
            error: function () {
                hiApp.alert("连接服务器超时！");
                hiApp.hideIndicator();
                return false;
            }
        });
    },
    //联合登陆
    crossLoginHelper:function(webotype,appotype,appparam1){
        var that = this;
        if(app_type === 'web'){
            console.log(that.comeFrom);
            //TODO : 挂到V3版本上
            var backurl = encodeURIComponent(that.comeFrom);
            window.location.href = appConfig.CROSSLOGIN_URL.replace("{0}", webotype).replace("{1}", backurl);
        }
        else if(app_type === 'app'){
            hiApp.showIndicator();
            util.cordovaExec(function (success) {
                hiApp.hideIndicator();
                if(success.indexOf("uid") != -1){
                    loginRegisterObj.appCrossLogin(success,webotype)
                }
                else{
                    hiApp.alert("第三方登录失败了~");
                }
            }, function (fail) {
                hiApp.hideIndicator();
                hiApp.alert("第三方登录失败了~");
            }, appotype, appparam1, []);
        }
    },
    //联合登录至后台
    appCrossLogin:function(successstr,type){
        "use strict";
        var that = this;
        if(!successstr || !type) return;

        util.getAjaxData({
            //TODO 用V3版本
            url: appConfig.crossLogin,
            type: 'post',
            data: {
                token: successstr,
                app: type
            },
            success: function (data) {
                hiApp.hideIndicator();
                if (!data) {
                    hiApp.alert("服务器错误，请稍后重试~");
                } else {
                    try {
                        data = JSON.parse(data);
                        console.log(data);
                        if (data.STATUSCODE === statusCode.SUCCESS) {
                            hiApp.alert("登录成功！");
                            //TODO : 判断是否绑定，没有绑定则跳转至绑定界面
                            //调用这个有点命名上的误导
                            that.loginSuccessCall(data, 0);
                        } else {
                            hiApp.alert(data.MSG);
                        }
                    } catch (e) {

                    }
                }
            },
            error: function () {
                hiApp.alert("连接服务器超时！");
                hiApp.hideIndicator();
                return false;
            }
        });
    }
};

