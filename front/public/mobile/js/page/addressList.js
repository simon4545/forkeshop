/**
 * Created by pig on 15/10/11.
 */

var addressListObj = {
    liTpl : "",
    addressList : null,
    addressDefaultHtml : '<img src="img/default.png" />',
    init:function(){
        var that = this;
        var page = ".myAddressAddPage";
        that.liTpl = $$("#addressListLiTpl").html();

        //添加
        //Caution : 直接写在Dom里面用href了

        //删除地址
        //Caution : 这一块有点坑，用了f7的移除效果，连续删除的时候需要算删除的是第几个
        bindTapEvent(page,"#myAddressList .swipeout-delete", function (_this) {
            var index = parseInt(($$(_this).attr('index')), 10);
            var list = $$("#myAddressList .swipeout-delete");
            var num = 0;
            for (var i = 0; i < list.length; i++) {
                if(index > parseInt($$(list[i]).attr("index"),10)  ){
                    num++;
                }
            }
            that.deleteAddress(num);
        });

        //修改地址
        bindTapEvent(page,"#myAddressList .swipeout-content", function (_this) {
            var index = parseInt(($$(_this).attr('index')), 10);
            var list = $$("#myAddressList .swipeout-delete");
            var num = 0;
            for (var i = 0; i < list.length; i++) {
                if(index > parseInt($$(list[i]).attr("index"),10)  ){
                    num++;
                }
            }
            //修改地址
            mainView.router.loadPage({
                query: {
                    addressInfo: that.addressList[num]
                },
                url: 'page/addressUpdate.html'
            });
        });

    },
    show:function(){
        var that = this;
        that.showAddressList();
    },
    showAddressList : function(){
        var that = this;
        var ID = userObj.isExist();
        if (ID) {
            that.getAddressListAjax(ID, function(list){
                that.showAddressListHelper(list);
            });
        }
        else{
            //TODO : 这块路由是有问题的
            //TODO : 原意这里是如果没有登录，切回登陆页，路由考虑不妥，交由上一步处理
        }
    },
    getAddressListAjax : function(userid,callback){
        var that = this;
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.GETADDRESSLIST,
            type: 'post',
            data:{
                loginid : userid || 0
            },
            error: function () {
                hiApp.hideIndicator();
                return false;
            },
            success: function (dataStr) {
                //这个接口就是木有状态码的，返回值是数组
                hiApp.hideIndicator();
                var data = JSON.parse(dataStr);
                if(data.STATUSCODE == 200){
                    data = util.upperCase(data)
                    callback(data.DATA);
                }

            }
        });
    },
    showAddressListHelper : function(addressData){
        "use strict";
        var that = this;
        var htmlStr = '', addresss = that.addressList = that.addressFormat(addressData);
        console.log("1234");
        if (addresss.length) {
            for (var i = 0, len = addresss.length; i < len; i++) {
                htmlStr += that.liTpl.replace('{{name}}', addresss[i].name)
                    .replace('{{noAfter}}',i === (len - 1) ? "noAfter" : "")
                    .replace('{{mobile}}', util.sheildMobile(addresss[i].mobile))
                    .replace('{{default}}', addresss[i].defaultf ? that.addressDefaultHtml : "")
                    .replace('{{address}}', addresss[i].address)
                    .replace(/\{\{i\}\}/g, i);
            }
            $$("#myAddressList").html(htmlStr).show();
            $$("#emptyAddress").hide();
        }
        else {
            $$("#emptyAddress").show();
            $$("#myAddressList").hide();
        }
    },
    deleteAddress: function (i) {
        "use strict";
        var that = this;
        var ID = userObj.isExist();
        if (ID) {
            //splice返回结果是数组
            var obj = that.addressList.splice(i, 1);
            that.deleteAddressAjax(obj[0].addressId, ID);
            if(that.addressList.length === 0){
                $$("#emptyAddress").show();
                $$("#myAddressList").hide();
            }
        }
    },
    deleteAddressAjax: function (addressId, userid) {
        "use strict";
        hiApp.showIndicator();
        //发送
        util.getAjaxData({
            url: appConfig.DELETEADDRESS,
            type: 'POST',
            data:{'consigneeid':addressId,'loginid':userid},
            error: function () {
                hiApp.hideIndicator();
                return false;
            },
            success: function (data) {
                hiApp.hideIndicator();
                if (data) {
                    data = JSON.parse(data);
                    //这里删除的动画在framework7中自动触发，暂不处理失败
                    if (data.STATUSCODE === statusCode.SUCCESS) {

                    }
                    else{
                        //Caution : 这里又是个坑
                        //TODO ：默认必须成功，失败未处理
                    }
                }
            }
        });
    },
    //将数据库数据转化为js数据
    addressFormat:function(list){
        "use strict";
        var i =0 ,newlist = [],obj={};
        for(i=0;i<list.length;i++){
            obj = {};
            obj.addressId = list[i].ID;
            obj.name = list[i].CONSIGNEENAME;
            obj.mobile = list[i].CONSIGNEEMOBILE;
            obj.address = list[i].PROVINCE + list[i].CITY + list[i].COUNTY + list[i].ADDRESS;
            obj.defaultf = list[i].ISDEFAULT === "1" ? true : false;
            obj.province =  list[i].PROVINCE;
            obj.county =  list[i].COUNTY;
            obj.city =  list[i].CITY;
            obj.addresslast =  list[i].ADDRESS;
            newlist.push(obj);
        }
        return newlist;
    }
}


