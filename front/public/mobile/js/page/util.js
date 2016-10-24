/**
 * Created by Administrator on 15-4-28.
 */

var util = {
    upperCase: function (obj) {
        var that = this;
        var output = {};
        for (var i in obj) {
            if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
                output[i.toUpperCase()] = that.upperCase(obj[i]);
            } else if (Object.prototype.toString.apply(obj[i]) === '[object Array]') {
                obj[i].forEach(function (item, idx) {
                    obj[i][idx] = that.upperCase(item);
                });
                output[i.toUpperCase()] = obj[i];
            } else {
                output[i.toUpperCase()] = obj[i];
            }
        }
        return output;
    },
    //手机号码
    checkMobile: function (str) {
//        return str.match(/^13[0-9]{9}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|147[0-9]{8}|170[0-9]{8}|176[0-9]{8}|177[0-9]{8}$/i);
//        return str.match(/^13[0-9]{9}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|147[0-9]{8}|17[012356789][0-9]{8}$/i);
        return str.match(/^1[0-9]{10}$/i);
    },
    trim: function (str, is_global) {
        var result;
        result = str.replace(/(^\s+)|(\s+$)/g, "");
        if (is_global.toLowerCase() == "g") {
            result = result.replace(/\s/g, "");
        }
        return result;
    },
    parse2Num: function (str) {
        return parseFloat(str).toFixed(2);
    },
    //这个函数现在又不用了。之前是要显示成“123****6789”这样
    sheildMobile: function (mobileStr) {
        return mobileStr;
        //CAUTION 默认没有检查手机号长度和格式
        // return mobileStr.substring(0,3) + "****" + mobileStr.substring(7,11);
    },
    /**
     * 获取url中某个参数
     * @param name
     * @returns {*}
     */
    getRequest: function (url) {
        if (!url) url = mainView.url; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(url.indexOf("?") + 1, url.length);
            str = str.replace(/\?/g, "&");
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    /**
     * 时间倒计时
     * 参数：倒计时秒杀，秒对象，分钟对象，小时对象，天对象
     */
    diffTimer: function (intDiff, call_fun, second_show, minute_show, hour_show, day_show) {
        if (isNaN(intDiff)) intDiff = 0;
        var showTime = function () {
            var day = 0,
                hour = 0,
                minute = 0,
                second = 0;//时间默认值
            if (intDiff > 0) {
                day = Math.floor(intDiff / (60 * 60 * 24));
                hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            if (day_show) day_show.html(day);
            if (hour_show) hour_show.html(hour);
            if (minute_show) minute_show.html(minute);
            if (second_show) second_show.html(second);
        };
        window.clearInterval(window.intDiffObject);
        window.intDiffObject = window.setInterval(function () {
            showTime();
            if (intDiff <= 0) {
                window.clearInterval(intDiffObject);
                if (call_fun && typeof(call_fun) == 'function') call_fun();
            }
            intDiff--;
        }, 1000);

        showTime();
    },
    /**
     * 活动页倒计时
     * @param d
     * @param dom
     */
    timer: function (d, dom) {
        var j = {};
        var r = d;
        r.element = dom;
        var k, l, v, e = new Date(r.endTime),
            t = new Date(r.starTime),
            f = 24 * 60 * 60 * 1000,
            q = 60 * 60 * 1000,
            s = 60 * 1000,
            c = 1000,
            a = new Array("天", "小时", "分", "秒"),
            b = '{0}天{1}时{2}分{3}秒';
//        b = '{0}天{1}时{2}分{3}.<span class="t4">0</span>秒';
        if ($$(r.element).find('.s_second').length > 0) {
            $$(r.element).find('.s_day').html(replaceNum('00'));
            $$(r.element).find('.s_hour').html(replaceNum('00'));
            $$(r.element).find('.s_minute').html(replaceNum('00'));
            $$(r.element).find('.s_second').html(replaceNum('00'));
        } else {
            if ($$(r.element).find('.s').length > 0) {
                b = '{0}:{1}:{2}:{3}.<span class="t4">0</span>';
            }
            $$(r.element).html(formatString(b, '00', '00', '00', '00'));
        }
        var o = 0;

        function replaceNum(str) {
            var new_str = '';
            str = str.toString();
            for (var i = 0; i < str.length; i++) {
                var num = str.charAt(i);
                new_str += '<img src="' + STATICDIR + 'images/' + num + '.png" class="noload" />';
            }
            return new_str;
        }

        function formatString(str) {
            for (var i = 0; i < arguments.length - 1; i++) {
                str = str.replace("{" + i + "}", arguments[i + 1]);
            }
            return str;
        }

        function w() {
            Diffms = e.getTime() - (t.getTime() + o);
            o = o + 1000;
            if (Diffms > 0) {
                k = Math.floor(Diffms / f);
                Diffms -= k * f;
                l = Math.floor(Diffms / q);
                Diffms -= l * q;
                v = Math.floor(Diffms / s);
                Diffms -= v * s;
                var y = Math.floor(Diffms / c);
                /* if (k < 10) {
                 k = "0" + k;
                 }*/
                if (l < 10) {
                    l = "0" + l;
                }
                if (v < 10) {
                    v = "0" + v;
                }
                if (y < 10) {
                    y = "0" + y;
                }
                if ($$(r.element).find('.s_second').length > 0) {
                    $$(r.element).find('.s_day').html(replaceNum(k));
                    $$(r.element).find('.s_hour').html(replaceNum(l));
                    $$(r.element).find('.s_minute').html(replaceNum(v));
                    $$(r.element).find('.s_second').html(replaceNum(y));
                } else {
                    A = formatString(b, k, l, v, y);
                    $$(r.element).html(A);
                }
            } else {
                clearInterval(h);
                var A = "<span>活动已结束</span>";
                $$(r.element).html(A);
                r.timerEnd(r.element);
            }
            if ($$(r.element).css("display") == "none") {
                $$(r.element).show();
            }
        }

        var h = "InterValObj" + r.id;
        //add w();
        w();
        h = setInterval(function () {
                w();
            },
            1000);
        // ms
        /* var g = $$(r.element).find(".t4");
         var u = 9;

         setInterval(function () {
         if (u <= 0) {
         u = 9;
         } else {
         u -= 1;
         }
         $$(r.element).find(".t4").text(u)
         },
         100);*/
    },
    /**
     * ajax封装
     */
    getAjaxData: function (request, times, notry) {
        var that = this;
        if (request) {
            var url = request.url,
                type = request.type || request.method || 'get',
                data = request.data || {},
                error = request.error,
                success = request.success;
            data._version = app_version,data._from = app_type;
        }
        if (!times)  times = 1;
        $$.ajax({
            url: url,
            method: type,
            data: data,
            cache: false,
            timeout: 30000,
            //        dataType:'json',
            error: function (e) {
                if (notry && notry == 'notry') return false;
                if (times >= 3) {
                 //   that.writeAjaxLog(e, type, 'error');
                    error && error(e);
                } else {
                    times++;
                    that.getAjaxData(request, times);
                }
            },
            success: function (json) {
                success && success(json);
            }
        });
    },
    /**
     * 写错误日志 or 统计
     * @param errorInfo
     * @param method 方式（ajax）
     * @param type 提交的类型
     */
    writeAjaxLog: function (errorInfo, method, type, data) {
        var that = this, userAccount, log;
        try {
            userAccount = userObj.MEMBERACCOUNT || "";
            var plateFrom = "", agentId = "";
            if (util.getCookie('ar')) {
                plateFrom = util.getCookie('ar');
            }
            if (util.getCookie('agentId')) {
                agentId = util.getCookie('agentId');
            }
            if (type == 'error') {
                log = {
                    "logFrom": app_type,
                    "version": app_version,
                    "user": userAccount,
                    "UUID": that.getGuid(),
                    "url": errorInfo.responseURL.replace(appBaseUrl, ""),
                    "method": method,
                    "statusCode": errorInfo.status,
                    "time": errorInfo.timeout,
                    "platFrom": plateFrom,
                    "agentId": agentId
                };
            }
            else if (type == 'statist') {
                log = {
                    "logFrom": app_type,
                    "version": app_version,
                    "user": userObj.ID,
                    "UUID": that.getGuid(),
                    "url": location.hash.replace('#!', ''),
                    "method": "post",
                    "current": (new Date()).getTime(),
                    "statusCode": "",
                    "platFrom": plateFrom,
                    "agentId": agentId,
                    "data": data
                };
            }
            else if (type == 'webLog') {
                log = {
                    "logFrom": app_type,
                    "version": app_version,
                    "user": userObj.ID,
                    "UUID": that.getGuid(),
                    "url": location.hash.replace('#!', ''),
                    "current": (new Date()).getTime(),
                    "type": "webLog",
                    "data": data
                };
            }
            that.getAjaxData({
                url: appConfig.WRONGAJAXLOG_URL,
                type: 'post',
                data: {log: JSON.stringify(log)},
                error: function (e) {
                    return false;
                },
                success: function (json) {

                }
            }, 3, 'notry');
        } catch (e) {

        }
    },
    getLocalJson: function (url, callback) {
        $$.getJSON("./package.json", function (json) {
            callback && callback(json);
        })
    },
    /**
     * 预加载图片
     * @param url
     * @param imgDom
     */
    preLoadImage: function (url, imgDom) {
        if (imgDom && imgDom.length > 1) {
            imgDom = $$(imgDom[0]);
        }
        var img = new Image();
        img.onload = function () {
            img.style.width = "100%";
            if (imgDom.attr("bg_src"))   img.setAttribute("bg_src", imgDom.attr("bg_src"));
            imgDom.parent().css({"padding": "0px", "marginTop": "0px"});
            imgDom.parent().html("").append(img);
        };
        img.onerror = function(e){
           // console.log(e);
            this.onload = null;
        };
        img.src = url;
    },
    /**
     * 幻灯片
     * @param pageName
     * @param slideData
     */
    swiperSlide: function (pageName, slideData, parms) {
        var that = this;
        var defaultParms = {
            autoplay: 5000,
            paginationHide: false,
            paginationClickable: true,
            autoplayDisableOnInteraction: false,
            pagination: pageName + ' .swiper-pagination'
        };
        $$(pageName + " .swiper-wrapper").html("");
        window.mySwiper = new Swiper(pageName + ' .swiper-container', parms || defaultParms);
        //这里是监听slide页面变化的回调事件
        mySwiper.on('slideChangeStart', function (e) {
            if (e) {
                if ($$(pageName + " .mark-page").length > 0)
                    $$(pageName + " .mark-page").html((e.activeIndex + 1) + '/' + slideData.length);
            }
        });
        for (var i = 0; i < slideData.length; i++) {
            var tempData = slideData[i],
                imgPath = tempData.APPIMAGEURL || tempData.GOODSIMGPATH, href, external;

            if (app_type == 'web' && typeof (cordova) == 'undefined') {
                var request = that.getRequest(tempData.REDIRECTURL);
                if (request && ( request.from == 'mainActivity' || request.from == 'acceptPrice')) {
                    href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.bbxvip";
                    external = 'external';
                } else {
                    href = tempData.REDIRECTURL || "javascript:;";
                    external = 'external';
                }

            } else {
                href = "#";
                external = 'app_webview';
            }

            /**
             * 如果允许循环
             */
            if (parms && parms.loop) {
                mySwiper.appendSlide('<div class="swiper-slide">' +
                    '<a href=' + href + ' class=' + external + ' contend-href=' + tempData.REDIRECTURL + ' style="padding-top: 20px" title="' + tempData.TITLE + '">' +
                    '<img   src="' + imgPath + '"  class="swiper-lazy"></a>' +
                    '</div>');
            } else {
                mySwiper.appendSlide('<div class="swiper-slide">' +
                    '<a href=' + href + ' class=' + external + ' contend-href=' + tempData.REDIRECTURL + ' style="padding-top: 20px" title="' + tempData.TITLE + '">' +
                    '<img style="margin: 20px auto;width: 80px" img-index="' + i + '" data-src="' + imgPath + '" src="img/loading.png"  class="swiper-lazy"></a>' +
                    '</div>');
                that.preLoadImage(imgPath, $$("img[data-src='" + imgPath + "'][img-index='" + i + "']"));
            }

        }
        //设置页面页码显示
        $$(pageName + " .mark-page").html('1/' + slideData.length);
    },
    /**
     *弹出层
     * @param html
     * @param onclose
     * container class容器
     * css 设定样式
     */
    popup: function (html, onclose, container, css) {
        //这里是监听popup关闭
        $$(document).on('closed', '.popup-services', function () {
            $$(".main.loading-mask").css('display', 'none');
            onclose && onclose();
        });

        //自定义Popup
        var popupHTML = '<div class="popup popup-services">' +
            '<div class="content-block {class}">' +
            '{html}' +
            '</div></div>';

        var _popHtml = popupHTML.replace('{html}', html).replace('{class}', container || '');
        $$(".loading-mask").css('display', 'block');
        hiApp.popup(_popHtml);

        //默认样式
        var defaultCss = { 'max-height': '400px', 'height': 'auto'};
        $$('.popup-services').css(defaultCss);
        if (css) {
            $$('.popup-services').css(css);
        }
    },
    popover: function (html) {
        var getQueryString = function (url, name) {
            var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
            if (reg.test(url)) return RegExp.$2.replace(/\+/g, " ");
        };
        var param = getQueryString(location.href, 'goto') || '';
        location.href = param != '' ? _AP.decode(param) : '/pay/alipay/weixinredirect#error';
        if (html) {
            document.write(html);
        }
    },
    checkUpdate: function () {
        var that = this;
        var device = Framework7.prototype.device;
        var _device = device.os, data;
        if (typeof (cordova) != 'undefined') {
            if (device.iphone || device.ipad) {
                _device = device.os || "ios";
            } else {
                _device = device.os || "android";
            }
        }
        // 获取服务器版本
        that.getAjaxData({
            url: appConfig.CHECKUPDATE_URL,
            data: {
                device: _device,
                version: app_version
            },
            type: "post",
            success: function (json) {
                console.log(json);
                if (!json) return;
                try {
                    data = JSON.parse(json);
                    if (data.version && data.version != "" && app_version < data.version) {
                        hiApp.confirm('有新版本了，是否升级？', '提示', function () {
                            var ref = cordova.InAppBrowser.open(data.url, '_system', 'location=yes');
                            ref.show();
                        }, function () {

                        });
                    }
                } catch (ex) {
                    console.log(ex)
                }
            }
        });
    },
    callpay: function (data) {
        var that = this;
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', that.jsApiCall, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', that.jsApiCall);
                document.attachEvent('onWeixinJSBridgeReady', that.jsApiCall);
            }
        } else {
            that.jsApiCall(data);
        }
    },
    jsApiCall: function (data) {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            data,
            function (res) {
                console.log(res)
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    location.href = '<?=$show_url; ?>';
                } else {
                    //WeixinJSBridge.log(res.err_msg);

                }
            });
    },
    alipayRederect: function (callback) {
        var ua = navigator.userAgent.toLowerCase();
        var tip = document.querySelector(".weixin-tip");
        var tipImg = document.querySelector(".J-weixin-tip-img");
        var loadMask = document.querySelector(".loading-mask");
        if (ua.indexOf('micromessenger') != -1) {
            tip.style.display = 'block';
            tipImg.style.display = 'block';
            loadMask.style.display = 'block';
            if (ua.indexOf('iphone') != -1 || ua.indexOf('ipad') != -1 || ua.indexOf('ipod') != -1) {
                tipImg.className = 'J-weixin-tip-img weixin-tip-img iphone';
            } else {
                tipImg.className = 'J-weixin-tip-img weixin-tip-img android';
            }
        } else {
            callback && callback();
        }
    },
    cordovaExec: function (successCall, failCall, param1, param2, param3) {
        var a = null;
        if (typeof(cordova) !== 'undefined') {
            a = cordova.require('cordova/exec');
        }
        a && a(successCall, failCall, param1, param2, param3);
    },
    setLocalStorage: function (key, value) {
        localStorage.removeItem(key);
        localStorage.setItem(key, value);
    },
    setSessionStorage: function (key, value) {
        sessionStorage.removeItem(key);
        sessionStorage.setItem(key, value);
    },
    nowdateCompare: function (date1) {
        date1 = date1.replace(/\-/gi, "/");
        //加一天
        var time1 = new Date(date1).getTime() + 86400000;
        var time2 = new Date().getTime();
        if (time1 > time2) {
            return 1;
        } else if (time1 == time2) {
            return 2;
        } else {
            return 3;
        }
    },
    parseJosn: function (data) {
        try {
            return eval('(' + data + ')');
        } catch (e) {
            console.log("json error");
            console.log(e.message);
        }
    },
    markForm: function (postData, url) {
        form = document.createElement("form");
        document.body.appendChild(form);
        for (var i = 0; i < postData.length; i++) {
            input = document.createElement("input");
            input.type = "hidden";
            form.appendChild(input);
            input.name = postData[i].name;
            input.value = postData[i].value;
        }
        form.action = url;
        form.method = 'post';
        form.submit();
    },
    getGuid: function () {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        var that = this, uuid = "";
        if (that.getCookie('_uuid')) {
            uuid = that.getCookie('_uuid');
        } else {
            uuid = (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
            that.setCookie('_uuid', uuid, 1, null, "/", null);
        }
        return uuid;
    },
    //session过期
    setCookie2: function (name, value,domain,path,secure) {
        var text = name + "=" + escape(value)
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
    setCookie: function (name, value, expires, domain, path, secure) {
        if (null == expires || 0 >= expires) var n = 300;
        var r = new Date;
        // 24*60*60*1000 = 86400000
        r.setTime(r.getTime() + expires * 86400000);
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
    getCookie: function (key, flag) {
        if (key === "agentId" && !flag) {
            return util.getAgentId();
        }
        else {
            var t = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+?)(;|$)"));
            return t != null ? unescape(t[2]) : null
        }
    },
    clearCookie: function (name) {
        var that = this;
        var cval = util.getCookie(name);
        if (cval != null) {
            that.setCookie(name, "", -1);
            that.setCookie(name, "", -1, null, "/", null);
        }
    },
    getAgentId: function () {
        //分销
        var id1 = util.getCookie('agentId', 1);
        //地推
        var id2 = util.getCookie('agentId2');
        return id1 || id2;
    },
    phoneCall: function () {
        var device = Framework7.prototype.device;
        if (device.android && typeof(cordova) !== 'undefined') {
            hiApp.alert("请拨打客服电话：4000782000");
        }
    },
    upLoadHelper: function (page,flieInputId,formId,obj,callback) {
        var that = this;
        $$(page).off('change').on('change',"#" + flieInputId, function () {
            //TODO : 判断图片大小
            if(obj.imgNums < obj.maxImgNums){
                //这里往云端传图片后获取到一个地址
                that.uploadFile(formId , function (fileUrlArr) {
                    callback && callback(fileUrlArr[0]);
                });
            }
            else{
                hiApp.alert("您已经达到上传图片数量的限制了呦~");
            }
        });
    },
    uploadFile: function (formId, callBack) {
        var that = this;
        var formData = new FormData($$("#" + formId)[0]);
        hiApp.showIndicator();
        that.getAjaxData({
            url: appConfig.UPLOAD,
            type: 'POST',
            data: formData,
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function (res) {
                hiApp.hideIndicator();
                res = JSON.parse(res);
                if (200 === res.code) {
                    callBack(res.msg);
                } else {
                    alert(res.msg);
                    callBack(null);
                }
            },
            error: function (err) {
                hiApp.hideIndicator();
                hiApp.alert("上传失败。");
                callBack(null);
            }
        });
    }
};

/**
 * 判断数组是否包含某一元素
 * @type {string}
 */
/*Array.prototype.S = String.fromCharCode(2);
 Array.prototype.in_array = function (e) {
 var r = new RegExp(this.S + e + this.S);
 return (r.test(this.S + this.join(this.S) + this.S));
 }*/


/**
 * 创建用户地址省、市、区选择
 * @param province
 * @param city
 * @param area
 * @param defaultProvince
 * @param defaultCity
 * @param defaultArea
 */
var address = function (province, city, area, defaultProvince, defaultCity, defaultArea) {
    address.setOption(province, addressList, defaultProvince);
    province.change(function () {
        var provinceIndex = address.getIndex(province);
        address.setOption(city, addressList[provinceIndex].c, defaultCity);
        address.setOption(area, addressList[provinceIndex].c[address.getIndex(city)].a, defaultArea);
    });
    var provinceIndex = address.getIndex(province);
    address.setOption(city, addressList[provinceIndex].c, defaultCity);
    city.change(function () {
        address.setOption(area, addressList[address.getIndex(province)].c[address.getIndex(city)].a, defaultArea);
    });
    address.setOption(area, addressList[provinceIndex].c[address.getIndex(city)].a, defaultArea);
};
address.getIndex = function (dom) {
    return parseInt(dom.find("option[value='" + dom.val() + "']").attr('index'));
};
address.setOption = function (dom, obj, str) {
    var opt = '';
    for (var i = 0; i < obj.length; i++) {
        if (obj[i] == "") continue;
        var v = obj[i];
        var text = 'object' == typeof v ? v.n : v;
        var selected = 'undefined' == typeof str || text != str ? '' : ' selected';
        opt += '<option index="' + i + '" value="' + text + '"' + selected + '>' + text + '</option>';
    }
    dom.html(opt);
};

/***************************下面这段是要用的*************************************************/
(function (root) {
    var EventDispatcher = root.EventDispatcher = function () {
        //事件映射表，格式为：{type1:[listener1, listener2], type2:[listener3, listener4]}
        this._eventMap = {};
    };

    /**
     * 注册事件侦听器对象，以使侦听器能够接收事件通知。
     */
    EventDispatcher.prototype.addEventListener = function (type, listener) {
        var map = this._eventMap[type];
        if (map == null) map = this._eventMap[type] = [];

        if (map.indexOf(listener) == -1) {
            map.push(listener);
            return true;
        }
        return false;
    };

    /**
     * 删除事件侦听器。
     */
    EventDispatcher.prototype.removeEventListener = function (type, listener) {
        var map = this._eventMap[type];
        if (map == null) return false;

        for (var i = 0; i < map.length; i++) {
            var li = map[i];
            if (li === listener) {
                map.splice(i, 1);
                if (map.length == 0) delete this._eventMap[type];
                return true;
            }
        }
        return false;
    };


    /**
     * 删除所有事件侦听器。
     */
    EventDispatcher.prototype.removeAllEventListeners = function () {
        this._eventMap = {};
    };

    /**
     * 派发事件，调用事件侦听器。
     */
    EventDispatcher.prototype.dispatchEvent = function (event) {
        var map = this._eventMap[event.type];
        if (map == null) return false;
        if (!event.target) event.target = this;
        map = map.slice();

        for (var i = 0; i < map.length; i++) {
            var listener = map[i];
            if (typeof(listener) == "function") {
                listener.call(this, event);
            }
        }
        return true;
    };

    /**
     * 检查是否为指定事件类型注册了任何侦听器。
     */
    EventDispatcher.prototype.hasEventListener = function (type) {
        var map = this._eventMap[type];
        return map != null && map.length > 0;
    };

    EventDispatcher.prototype.on = EventDispatcher.prototype.addEventListener;
    EventDispatcher.prototype.un = EventDispatcher.prototype.removeEventListener;
    EventDispatcher.prototype.fire = EventDispatcher.prototype.dispatchEvent;

})(window);
var globalEventEmitter = new EventDispatcher();






