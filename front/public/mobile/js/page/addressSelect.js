/**
 * Created by pig on 15/10/11.
 */

var addressSelectObj = {
    selectLiTpl: "",
    selectList : [],
    lastSelectNum : 0,
    init: function () {
        "use strict";
        var that = this;
        that.selectLiTpl = $$("#selectAddressTemplate").html();

        var page = ".myAddressSelectPage";

        bindTapEvent(page, "#addressSelectBack", function (_this) {

            var domList = $$("#myAddressSelectList li");
            var i = 0,len = domList.length;
            for(;i<len;i++){
                if($$("#addressSelectLab" + i).hasClass("selected")){
                    break;
                }
            }

            setTimeout(function () {
                mainView.router.back({
                    query: {
                        newAddress: that.selectList[i],
                        addIndex : i
                    },
                    url: 'page/orderConfirm.html'
                });
            }, 100);
        });

        //选择地址
        bindTapEvent(page, "#myAddressSelectList li", function (_this) {
            var index = parseInt(($$(_this).attr('eq')), 10);
            $$(".addressForSelect").removeClass("selected");
            $$("#addressSelectLab" + index).addClass("selected");
            setTimeout(function () {
                mainView.router.back({
                    query: {
                        newAddress: that.selectList[index],
                        addIndex : index
                    },
                    url: 'page/orderConfirm.html'
                });
            }, 100);
        });

    },
    show: function (index) {
        var that = this;
        //如果没有获取到参数，则是从地址保存页返回过来
        addressListObj.getAddressListAjax(userObj.isExist(), function (addressList2) {
            that.showSelectList(addressList2, index);
        });
    },
    //TODO : Caution
    showSelectList: function (addressList, index) {
        "use strict";
        var that = this;
        that.selectList = addressList || that.selectList;
        that.lastSelectNum = index || that.lastSelectNum;

        var i = 0, len = that.selectList.length;
        for (; i < len; i++) {
            that.selectList[i].SHEILDMOBILE = util.sheildMobile(that.selectList[i].CONSIGNEEMOBILE);
        }

        var htmlStr = "", list = that.selectList;
        var defaultFlagHtml = '<b class="default-flag">默认</b>';

        for (i = 0, len = list.length; i < len; i++) {
            htmlStr += that.selectLiTpl.replace(/\{\{@index\}\}/g, i)
                .replace("{{CONSIGNEENAME}}", list[i].CONSIGNEENAME)
                .replace("{{SHEILDMOBILE}}", list[i].SHEILDMOBILE)
                .replace("{{PROVINCE}}", list[i].PROVINCE)
                .replace("{{CITY}}", list[i].CITY)
                .replace("{{COUNTY}}", list[i].COUNTY)
                .replace("{{ADDRESS}}", list[i].ADDRESS)
                .replace("{{defaulteFlag}}", list[i].ISDEFAULT === 1 ? defaultFlagHtml : "");
        }

        $$("#myAddressSelectList").html("").append(htmlStr);
        $$("#addressSelectLab" + that.lastSelectNum).addClass("selected");
    }
}