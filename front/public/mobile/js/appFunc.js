define(['Framework7'], function () {
    var $$ = Dom7;

    var appFunc = {

        isPhonegap: function () {
            return (typeof(cordova) !== 'undefined' || typeof(phonegap) !== 'undefined');
        },

        isEmail: function (str) {
            var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
            return reg.test(str);
        },

        getPageNameInUrl: function (url) {
            url = url || '';
            var arr = url.split('.');
            return arr[0];
        },

        isEmpty: function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }

            return true;
        },

        megicAlert:function(){
            var _dom = $$('<div class="modal modal-in remove-on-close">'+
                '<div style="padding-bottom: 10px;-webkit-border-radius: 5px;background-color: #fff;">'+
                '<div class="" style="-webkit-border-radius: 5px 5px 0 0;height: 34px;background-color: #ff2d55;font-size:16px;line-height: 34px;color: white;">每日登陆奖励</div>'+
                '<div class="" style="line-height: 20px;font-size: 14px;color: #545151;padding-top: 20px;">'+
                '<img src="style/img/zs_2.png" style="margin: 0 auto;margin-bottom: 10px;display: block;background-color:transparent" />每日首次登录，获得奖励黄钻<p  style="color: #FF7622">50枚</p></div>'+
                '<div class="button button-fill " style="margin:0 auto;margin-top:20px;font-size:16px;width: 92%;">确定</div>'+
                '</div>'+
                '</div>');
            _dom.find('.button').on('click',function(e){
                hiApp.closeModal(_dom);
                _dom.remove();
                $$('.modal-overlay').remove();
            });
            $$('body').append(_dom);
            hiApp.openModal(_dom);
        },


        hideToolbar: function () {
            hiApp.hideToolbar('.toolbar');
        },

        showToolbar: function () {
            hiApp.showToolbar('.toolbar');
        },

        timeFormat: function (ms) {
            if (typeof ms === 'string') {
                ms = +new Date(ms);
            } else {

                ms = ms * 1000;
            }

            var d_second, d_minutes, d_hours, d_days;
            var timeNow = new Date().getTime();
            var d = (timeNow - ms) / 1000;
            d_days = Math.round(d / (24 * 60 * 60));
            d_hours = Math.round(d / (60 * 60));
            d_minutes = Math.round(d / 60);
            d_second = Math.round(d);
            if (d_days > 0 && d_days < 2) {
                return d_days + '天前';
            } else if (d_days <= 0 && d_hours > 0) {
                return d_hours + '小时前';
            } else if (d_hours <= 0 && d_minutes > 0) {
                return d_minutes + '分钟';
            } else if (d_minutes <= 0 && d_second >= 0) {
                return '刚刚';
            } else {
                var s = new Date();
                s.setTime(ms);
                return (s.getFullYear() + '-' + f(s.getMonth() + 1) + '-' + f(s.getDate()) + ' ' + f(s.getHours()) + ':' + f(s.getMinutes()));
            }

            function f(n) {
                if (n < 10)
                    return '0' + n;
                else
                    return n;
            }
        },
        removeHTML: function (html) {
            var start_ptn = /(<.[^>]*?>)*/gi;      //过滤标签开头
            var end_ptn = /<\/?\w+>$/ig;            //过滤标签结束
            var c1 = html.replace(start_ptn, "").replace(end_ptn);
            return c1;
        },
        getCharLength: function (str) {
            var iLength = 0;
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255) {
                    iLength += 2;
                }
                else {
                    iLength += 1;
                }
            }
            return iLength;
        },

        matchUrl: function (string) {
            var reg = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&;:\/~\+#]*[\w\-\@?^=%&;\/~\+#])?/g;

            string = string.replace(reg, function (a) {
                if (a.indexOf('http') !== -1 || a.indexOf('ftp') !== -1) {
                    return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'' + a + '\',\'_blank\')\">' + a + '</a>';
                }
                else {
                    return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'http://' + a + '\',\'_blank\')\">' + a + '</a>';
                }
            });
            return string;
        },

        hot_status: function (data) {
            var obj = data;

            if (obj.top == true) {
                return data = "置顶";
            } else if (obj.good == true) {
                return data = "精华";
            } else {

                switch (obj.tab) {
                    case "share":
                        data = "分享";
                        break;
                    case "ask":
                        data = "约会";
                        break;
                    case "job":
                        data = "形婚";
                        break;
                    default:
                        data = "其他";
                        break;
                }

                return data;

            }
        },


        avater: function (data) {
            if (!data)return "";
            var avastr = data.substr(0, 4);
            if (avastr == "http") {
                return data;
            } else {
                return data = "http://lalami.la" + data;
                //console.error("xx");
            }
        },
        city: function (data) {
            return data ? data : "海王星"
        },

        bindEvents: function (bindings) {
            for (var i in bindings) {
                if (bindings[i].selector) {
                    $$(bindings[i].element)
                        .on(bindings[i].event, bindings[i].selector, bindings[i].handler);
                } else {
                    $$(bindings[i].element)
                        .on(bindings[i].event, bindings[i].handler);
                }
            }
        },
        setCookie: function (name, value, expires, domain, path, secure) {
            if (null == expires || 0 >= expires) var n = 300;
            var r = new Date;
            r.setTime(r.getTime() + expires * 24 * 60 * 60 * 1e3);
            var text = name + "=" + escape(value) + ";" + "expires=" + r.toGMTString();
            if (domain) {
                text += '; domain=' + domain;
            }
            if (path) {
                text += '; path=' + path;
            }
            if (secure) {
                text += '; secure';
            }
            document.cookie = text;
        },
        getCookie: function (e) {
            var t = document.cookie.match(new RegExp("(^| )" + e + "=([^;]+?)(;|$)"));
            return t != null ? unescape(t[2]) : null
        },
        registerTemplateFun:function(){
            Template7.registerHelper('absPath80', function (url) {
                if (!url) return "";
                url=url.replace(/(\?|&)thumb=\d+x\d+/ig,"")
                return url.indexOf('http://') === 0 ? url + '?thumb=80x80' : "http://lalami.la" + url + '?thumb=80x80';
            });
            Template7.registerHelper('absPath180', function (url) {
                if (!url) return "";
                url=url.replace(/(\?|&)thumb=\d+x\d+/ig,"")
                return url.indexOf('http://') === 0 ? url + '?thumb=180x180' : "http://lalami.la" + url + '?thumb=180x180';
            });
            Template7.registerHelper('absPath48', function (url) {
                if (!url) return "";
                url=url.replace(/(\?|&)thumb=\d+x\d+/ig,"")
                return url.indexOf('http://') === 0 ? url + '?thumb=48x48' : "http://lalami.la" + url + '?thumb=48x48';
            });
            Template7.registerHelper('timeFormat', function (time) {
                return appFunc.timeFormat(time);
            });
            Template7.registerHelper('distance', function (distanceMiter) {
                var prettyDistance="";
                if(distanceMiter>5000){
                    prettyDistance=parseInt(distanceMiter/1000)+"公里";
                }else if(distanceMiter>1500){
                    prettyDistance=parseInt(distanceMiter)+"米";
                }else{
                    prettyDistance="很近很近";
                }
                return prettyDistance;
            });
        },
        registerHookFun:function(){
            Framework7.prototype.plugins.handleEvent = function (app, params) {


                // Handle app init hook
                function pageBeforeInit(pageDate) {
                    if(pageDate&&pageDate.url&&pageDate.url.indexOf('page/item.html?id=')!=-1){

                    }
                }

                // Return hooks
                return {
                    hooks: {
                        // App init hook
                        pageBeforeInit: pageBeforeInit
                    }
                };
            };
        }
    };

    return appFunc;
});