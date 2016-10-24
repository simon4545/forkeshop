/**
 * Created by Administrator on 15-8-5.
 */

var userObj = {
    ID: "",
    MEMBERACCOUNT: "",
    MEMBERIDEN: "",
    MEMBERNAME: "",
    MEMBERTITLE: "",
    USABLEPOINTS: 0,
    BIRTHDAY: "",
    TOTALPOINTS: 0,
    HEADERIMAGE: "",
    //此字段为过期时间，前端专用，以驼峰区分(这个数字没有实际意义，是写下这段代码时的时间)
    //如果看不懂，你也可以改作1900年1月1号的第一毫秒做默认过期时间
    vaildTime: 1438329977791,
    getCurUserCopy: function () {
        "use strict";
        var that = this;
        return {
            ID: that.ID,
            MEMBERACCOUNT: that.MEMBERACCOUNT,
            MEMBERIDEN: that.MEMBERIDEN,
            MEMBERNAME: that.MEMBERNAME,
            MEMBERTITLE: that.MEMBERTITLE,
            USABLEPOINTS: that.USABLEPOINTS,
            BIRTHDAY: that.BIRTHDAY,
            TOTALPOINTS: that.TOTALPOINTS,
            HEADERIMAGE: that.HEADERIMAGE,
            vaildTime: that.vaildTime
        };
    },
    setCurUser: function (data) {
        "use strict";
        var that = this;
        that.ID = data.ID || that.ID;
        that.HEADERIMAGE = data.HEADERIMAGE || that.HEADERIMAGE;
        that.MEMBERACCOUNT = data.MEMBERACCOUNT || that.MEMBERACCOUNT;
        that.MEMBERIDEN = data.MEMBERIDEN || that.MEMBERIDEN;
        that.MEMBERNAME = data.MEMBERNAME || that.MEMBERNAME;
        that.MEMBERTITLE = data.MEMBERTITLE || that.MEMBERTITLE;
        that.BIRTHDAY = data.BIRTHDAY || that.BIRTHDAY;
        if (data.USABLEPOINTS) {
            that.USABLEPOINTS = parseInt(data.USABLEPOINTS, 10);
        }
        if (data.TOTALPOINTS) {
            that.TOTALPOINTS = parseInt(data.TOTALPOINTS, 10);
        }
        //1209600000 = 1000 * 60 * 60 * 24 * 14 两周的毫秒数（到期时间）
        that.vaildTime = new Date().getTime() + 1209600000;

        globalEventEmitter.fire({type:'userDataArrived'});
    },
    setLocalUser: function () {
        "use strict";
        var that = this;
        var obj = that.getCurUserCopy();
        util.setLocalStorage('user', JSON.stringify(obj));

        //cookie存
        util.setCookie("userID",that.ID,14,null,"/",null);
        //cookie存
        util.setCookie("userAccount",that.MEMBERACCOUNT,14,null,"/",null);
    },
    isExist: function () {
        "use strict";
        var that = this;
        if (that.ID) {
            return that.ID;
        }
        else {
            var userData = userObj.getLocalUser();
            //localStorage返回
            if (userData instanceof Object) {
                if (userData.vaildTime > new Date().getTime()) {
                    userObj.setCurUser(userData);
                    return userObj.ID;
                }
            }
            //cookie 返回
            else if( (typeof userData).toLowerCase() === "string" && userData){
                that.ID = userData;
                that.getPostInfo(userData);
                return userData;
            }
            return "";
        }
    },
    getPostInfo:function(id){
        "use strict";
        var that = this;
        util.getAjaxData({
            'url': appConfig.USERINFO,
            type: 'post',
            data: {
                loginid: id
            },
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

                    if (data.STATUSCODE !== statusCode.SUCCESS) {
                        hiApp.alert(data.MSG);
                        return false;
                    }

                    userObj.setCurUser(data);
                    userObj.setLocalUser();
                }
                catch (ex) {
                    return false;
                }
            }
        });
    },
    //理论上这个方法只有在第一次打开页面时会调用
    //后来为了解决刷新问题，在本对象的isExist中也会调用
    getLocalUser: function () {
        "use strict";
        var that = this;
        var obj = JSON.parse(localStorage.getItem('user'));

        if(obj){
            return obj;
        }
        else{

            if(app_type === 'web'){
                return util.getCookie("userID");
            }
            else{
                return localStorage.getItem("user");
            }

//            return util.getCookie("userID");
        }
    },
    //这个方法在打开页面前进行身份判断，应该移到路由配置中去，暂时没有做
    noIDGotoLogin: function (url) {
        "use strict";
        var that = this;
        if (that.isExist()) {
            mainView.router.loadPage(url);
        }
        else {
            loginRegisterObj.comeFrom = url;
            mainView.router.loadPage('page/login.html');
        }
    },
    //退出登录时使用
    clearLocalUser: function () {
        "use strict";
        var that = this;
        localStorage.removeItem("user");

        if(app_type === "web"){
            util.clearCookie("userID");
        }
        else{
            localStorage.removeItem("user");
        }

        that.ID = "",
            that.MEMBERACCOUNT = "",
            that.MEMBERIDEN = "",
            that.MEMBERNAME = "",
            that.MEMBERTITLE = "",
            that.USABLEPOINTS = 0,
            that.BIRTHDAY = "",
            that.TOTALPOINTS = 0,
            that.HEADERIMAGE = "",
            that.vaildTime = 1438329977791;
    }
};