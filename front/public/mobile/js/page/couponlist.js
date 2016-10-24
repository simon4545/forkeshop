/**
 * Created by Administrator on 15-5-5.
 */



/* globals $$: false,
 appConfig:false,
 util:false,
 hiApp:false,
 console:false，
 localStorage:false */
var couponObj = {
    /* jshint strict: false */
    init: function () {
        $$('#mainViewNavBar').remove();
    },
    /**
     * 获取优惠券列表
     */
    getCouPonList: function () {

        /* jshint strict: false */
        var template, couponItem,
            canUse = 0, alreadyUse = 0, outTime = 0, that = this, noDataTemplate;
        if(userObj.isExist()){
//        if (localStorage.getItem('user')) {
            try {
                setTimeout(function () {
                    util.getAjaxData({
                        url: appConfig.GETALLCOUPONLIST,
                        data : {
                            loginid : userObj.isExist()
                        },
                        type: 'post',
                        error: function () {
                            hiApp.hidePreloader();
                            return;
                        },
                        success: function (jsonStr) {
                            hiApp.hidePreloader();
                            if(jsonStr){
                                var dataObj = JSON.parse(jsonStr);
                                if(dataObj.STATUSCODE == 200){
                                    try {
                                        var couponList = dataObj.DATA;
                                        noDataTemplate = '<div class="emptyList" >' +
                                            '<img src="img/noCoupon.png" />' +
                                            '</div>';
                                        if (couponList.length === 0) {
                                            $$("#no_use").html(noDataTemplate);
                                            $$("#used").html(noDataTemplate);
                                            $$("#expired").html(noDataTemplate);
                                        } else if (couponList.length > 0) {
                                            for (var i = 0; i < couponList.length; i++) {
                                                couponItem = couponList[i];
                                                console.log(couponItem);
                                                template = '<div class="coulist" style="background-image: url(img/ico/{iconImag});">' +
                                                    '<div class="coulist-top">' +

                                                    '<div class="coulist-top-middle">' +
                                                    '<div>' +
                                                    '<span type=0 class="coulist-top-middle-span">¥ </span>' +
                                                    '<span type=0 class="coulist-top-middle-span-b">{COUPONPAR}</span>' +
                                                    '</div>' +
                                                    '</div>' +
                                                    '<div class="coulist-top-right">' +
                                                    '<li class="coulist-top-right-li-top"></li>' +
                                                    '<li ><sapn class="coulist-top-right-li-middle-span" >{COUPONTITLE}</span> </li>' +
                                                    '<li class="coulist-top-right-li-bottom">元优惠券</li>' +
                                                    '</div>' +
                                                    '</div>' +

                                                    '<div class="coulist-bottom">' +
                                                    '<div style="margin-top: 5px;">截至日期：{EXPIREDATE}</div>' +
                                                    '</div>' +
                                                    '<div class="coulist-right">' +
                                                    '   {USEDSTATUS}' +
                                                    '  </div>' +
                                                    ' </div>' +
                                                    '<div class="clear"></div>';
                                                template = template.replace("{COUPONPAR}", couponItem.COUPONPAR)
                                                    .replace("{COUPONTITLE}", couponItem.COUPONTITLE)
                                                    .replace("{EXPIREDATE}", couponItem.EXPIREDATE);
                                                //未使用
                                                if (couponItem.USEDSTATUS === "1") {
                                                    //未过期
                                                    if(couponItem.ISEXPIRE === "0"){
                                                        canUse++;
                                                        template = template.replace("{USEDSTATUS}", "未使用").replace('{iconImag}', 'icon_23.png');
                                                        $$("#no_use").append(template);
                                                    }
                                                    //已过期
                                                    else{
                                                        outTime++;
                                                        template = template.replace(new RegExp(/(type=0)/g), ' style="color:#ADADAD"');
                                                        template = template.replace("{USEDSTATUS}", "已过期").replace('{iconImag}', 'icon_22.png');
                                                        $$("#expired").append(template);
                                                    }
                                                }
                                                //禁用
                                                else if (couponItem.USEDSTATUS === "-1") {
                                                    //TODO : 暂不做处理，不显示
                                                }
                                                //已使用
                                                else if(couponItem.USEDSTATUS === "0"){
                                                    alreadyUse++;
                                                    template = template.replace(new RegExp(/(type=0)/g), ' style="color:#ADADAD"');
                                                    template = template.replace("{USEDSTATUS}", "已使用").replace('{iconImag}', 'icon_22.png');
                                                    $$("#used").append(template);
                                                }
                                            }
                                            console.log(canUse);
                                            if (canUse === 0) {
                                                $$("#no_use").html(noDataTemplate);
                                            }
                                            if (alreadyUse === 0) {
                                                $$("#used").html(noDataTemplate);
                                            }
                                            if (outTime === 0) {
                                                $$("#expired").html(noDataTemplate);
                                            }
                                        }
                                    } catch (e) {
                                    }

                                }
                            }
                        }
                    });
                }, 10);
            } catch (e) {

            }
        }
    }
};
