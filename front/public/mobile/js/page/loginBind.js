
var loginBindObj = {
    uid3td : "",
    type3td : "",
    bindCodeCount : 0,
    init:function(){
        var page = ".loginBind", that = this;

        function regBtnChangeColor(){
            if ($$("#bindMobileInput").val() && $$("#bindCodeInput").val() && $$("#bindPwdInput").val().length > 6) {
                $$("#goToBind").addClass("act");
            }
            else {
                $$("#goToBind").removeClass("act");
            }
        }

        document.getElementById("bindMobileInput").addEventListener("input",regBtnChangeColor);
        document.getElementById("bindCodeInput").addEventListener("input",regBtnChangeColor);
        document.getElementById("bindPwdInput").addEventListener("input",regBtnChangeColor);

        //绑定发送验证码
        bindTapEvent(page, '#bindCodeBtn', function () {
            var mobile = $$("#bindMobileInput").val();
            if (mobile) {
                //这块发送验证码不想重写了，调loginRegisterObj方法，回调函数调自己的操作DOM
                loginRegisterObj.getCodeAjax(mobile,that.regGetCodeSuccess);
            }
            else {
                hiApp.alert("请填个手机号码先~");
            }
        });

        //绑定
        bindTapEvent(page, '#goToBind', function (_this) {
            var mobile = $$("#bindMobileInput").val(),
                password = $$("#bindPwdInput").val(),
                code = $$("#bindCodeInput").val();
            //这块验证不想重写了，调loginRegisterObj方法
            if (loginRegisterObj.regOrForgotCheck(mobile,password,code)) {
                that.goToBind(mobile,password,code);
            }
        });
    },
    showPage:function(openId,otype){
        var that = this;
        //信息不对，直接回首页
        if(!openId || !otype){
            mainView.router.loadPage('page/index.html');
            hiApp.alert("第三方登录失败");
        }
        that.uid3td = openId;
        that.type3td = otype;
    },
    regGetCodeSuccess: function () {
        "use strict";
        var that = this;
        hiApp.alert("验证码已发送！");
        that.bindCodeCount = 60;
        $$('#bindCodeBtn').attr('disabled', 'true');
        $$('#bindCodeBtn').html('重新发送(' + that.bindCodeCount + ')');

        var InterValObj = window.setInterval(function () {
            if (that.bindCodeCount === 0) {
                window.clearInterval(InterValObj);  //停止计时器
                $$('#bindCodeBtn').removeAttr('disabled');//启用按钮
                $$('#bindCodeBtn').html('重发验证码');
            }
            else {
                that.bindCodeCount--;
                $$('#bindCodeBtn').html('重新发送(' + that.bindCodeCount + ')');
            }
        }, 1000);
    },
    goToBind:function(mobile,password,code){
        var that = this;
        hiApp.showIndicator();
        if(!mobile || !password ) return;
        util.getAjaxData({
            url: appConfig.LOGINBIND,
            type: 'post',
            data: {
                mobile: mobile,
                password: password,
                validcode: code,
                openid:that.uid3td,
                oauthtype:that.type3td
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
                            //TODO : 绑定成功之后，跳回首页
                            hiApp.alert(data.MSG, "", function () {

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
    }
}
