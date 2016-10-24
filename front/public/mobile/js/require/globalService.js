define(['appFunc'], function (appFunc) {
    var CONFIG = {};
    //var Sharedpreferences = cordova.require("com.xgr.lalami.Sharedpreferences");
    var globalService = {
        init: function () {
            CONFIG = {};
            CONFIG.currentUser = {};
            //CONFIG.currentUser.sid = localStorage.getItem('sid');
            //Sharedpreferences.getString('sid', function (val) {
            //    CONFIG.currentUser.sid = val;
            //
            //}, function () {
            //});
            //Sharedpreferences.getString('user', function (val) {
            //    CONFIG.currentUser = JSON.parse(val);
            //    CONFIG.currentUser.sid = CONFIG.currentUser._id;
            //    //CONFIG.currentUser = JSON.parse(localStorage.getItem('user'));
            //    if (CONFIG.currentUser && !CONFIG.currentUser.geo) {
            //        CONFIG.currentUser.geo = {latitude: 0, longitude: 0};
            //    }
            //}, function (err) {
            //    if (CONFIG.currentUser && !CONFIG.currentUser.geo) {
            //        CONFIG.currentUser.geo = {latitude: 0, longitude: 0};
            //    }
            //});
/*            cordova.require("com.xgr.lalami.BmobUserService").getObjectId(function (id) {
                CONFIG.bmobId = id;
            }, function () {

            })*/

        },
        getBmobId:function(){
            return CONFIG.bmobId;
        },
        getCurrentUser: function () {
            return CONFIG.currentUser;
        },
        getConfig: function (type, defaultValue) {
            if (CONFIG['config-' + type] !== undefined)return CONFIG['config-' + type];
            Sharedpreferences.getBoolean('config-' + type, function (val) {
                CONFIG['config-' + type] = val;
            }, function () {
                CONFIG['config-' + type] = defaultValue;
            });
            return defaultValue;
        },
        setConfig: function (type, value) {
            CONFIG['config-' + type]=value;
            return Sharedpreferences.putBoolean('config-' + type, value);
        },
        getSid: function () {
            var m = $$.parseUrlQuery(window.location.href || '');
            return m.sid || CONFIG.currentUser.sid || CONFIG.currentUser._id;
        },

        setCurrentUser: function (sid, user) {
            if (!user.geo) {
                user.geo = {latitude: 0, longitude: 0};
            }
            console.log('globalService::setCurrentUser'+JSON.stringify(user));
            CONFIG.currentUser = user;
            CONFIG.token=user.accessToken;
            Sharedpreferences.putString('user', JSON.stringify(user), function () {
            }, function () {
            });
            Sharedpreferences.putString('sid', sid);
            //appFunc.setCookie('node_club', 's:' + sid + '$$$$');
        },

        removeCurrentUser: function () {
            CONFIG.currentUser = {};
            Sharedpreferences.remove('user', function () {
            }, function () {
            });
            Sharedpreferences.remove('sid', function () {
            }, function () {
            });
        },
        getTags: function () {
            return [
                {tag: "分享", id: 'share'},
                {tag: "约会", id: "ask"} ,
                {tag: "形婚", id: "job"}
            ]
        },
        getTagsColor: function () {
            return["#5bb4da", "#38b57f", "#fca405", "#5999f3", "#f26d5f"]
        },
        isLogin: function () {
            return CONFIG.currentUser.sid || CONFIG.currentUser._id;
        },
        setString:function(type,value){
            if(type && value)
            {
                Sharedpreferences.putString(type, value);
            }

        },
        getString:function(type,callback){
            Sharedpreferences.getString(type, function (val) {
                callback(val);
            }, function () {

            });
        }

    };

    globalService.init();

    return globalService;
});