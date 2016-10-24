/**
 * Created by pig on 15/10/11.
 */
var addressUpdateObj = {
    addressToUpdate:"",
    pCCTpl : "",
    pCCWarpTpl : "",
    selectProvince : "",
    selectCity:"",
    selectCounty:"",
    init : function(){
        var that = this;
        that.pCCTpl = $$("#addressPCCTpl").html();
        that.pCCWarpTpl = $$("#addressPCCWarpTpl").html();

        var page = ".updateAddressPage";

        bindTapEvent(page,"#addressUpdateBtn", function () {
            var name = $$("#upAddressName").val();
            var mobile = util.trim($$("#upAddressMobile").val(),"g");
            var address = $$("#upAddressAdd").val();
            var defaultf = $$("#upAddressDefault").is(":checked");

            that.updateAddress(name, mobile, address, defaultf);
        });

        //显示省
        bindTapEvent(page,"#upAddressProvinceLi", function () {
           that.showProvince();
        });

        bindTapEvent(page,"#upAddressCityLi", function () {
            that.showCity(that.selectProvince);
        });

        bindTapEvent(page,"#upAddressCountyLi", function () {
            that.showCounty(that.selectCity);
        });

        //单击省
        bindTapEvent(document,".UlPro li", function (_this) {
            that.selectProvince = $$(_this).attr("province");
            $$("#upAddressProvince").val(that.selectProvince);
        });

        //单击市
        bindTapEvent(document,".UlCity li", function (_this) {
            that.selectCity = $$(_this).attr("province");
            $$("#upAddressCity").val(that.selectCity );

        });

        //单击县
        bindTapEvent(document,".UlCounty li", function (_this) {
            that.selectCounty = $$(_this).attr("province");
            $$("#upAddressCounty").val(that.selectCounty );
        });


        bindTapEvent(document,".no-padding-no-margin", function (_this) {
            hiApp.closeModal();
        });
    },
    show : function(addressInfo){
        var that = this;
        that.addressToUpdate = addressInfo;
        $$("#upAddressName").val(addressInfo.name);
        $$("#upAddressMobile").val(addressInfo.mobile);
        $$("#upAddressAdd").val(addressInfo.addresslast);

        if(addressInfo.defaultf){
            $$("#upDefaultAddressLab").click();
        }

        that.selectProvince = addressInfo.province;
        that.selectCity = addressInfo.city;
        that.selectCounty = addressInfo.county;

        $$("#upAddressProvince").val(addressInfo.province);
        $$("#upAddressCity").val(addressInfo.city );
        $$("#upAddressCounty").val(addressInfo.county);
    },
    showProvince : function (){
        var that = this;
        var provinces = addressAddObj.formatArea().provinces;
        var str = "";

        for(var i= 0,len = provinces.length;i<len;i++){
            str += that.pCCTpl.replace(/\{name\}/g,provinces[i]);
        }

        var html = that.pCCWarpTpl.replace("{classW}","UlPro").replace("{words}","请选择省").replace("{inner}",str);

        util.popup(html, "", "no-padding-no-margin");
    },
    showCity : function(provinceName){

        var that = this;
        var provinces = addressAddObj.formatArea().citys[provinceName];
        var str = "";
        if( provinces && provinces.length){
            for(var i= 0,len = provinces.length;i<len;i++){
                str += that.pCCTpl.replace(/\{name\}/g,provinces[i]);
            }

            var html = that.pCCWarpTpl.replace("{classW}","UlCity").replace("{words}","请选择市").replace("{inner}",str);

            util.popup(html, "", "no-padding-no-margin .h400");
        }
        else{
            hiApp.alert("请优先选择省级信息~");
        }
    },
    showCounty : function(cityName){
        var that = this;
        var provinces = addressAddObj.formatArea().discs[that.selectProvince + cityName ];
        var str = "";
        if(provinces && provinces.length){
            for(var i= 0,len = provinces.length;i<len;i++){
                str += that.pCCTpl.replace(/\{name\}/g,provinces[i]);
            }

            var html = that.pCCWarpTpl.replace("{classW}","UlCounty").replace("{words}","请选择地区").replace("{inner}",str);

            util.popup(html, "", "no-padding-no-margin");
        }
        else{
            hiApp.alert("请优先选择省市级信息~");
        }
    },
    updateAddress: function (name, mobile, address, defaultf) {
        "use strict";
        var that = this;
        var ID = userObj.isExist();
        var addFlag = addressAddObj.checkAddress(that.selectProvince,that.selectCity,that.selectCounty);
        if (ID) {
            //省市县不对，直接over
            if(!addFlag){
                hiApp.alert("您的收货地址怎么感觉哪里不对劲的样子~");
                return;
            }
            //电话号码不对，直接over
            if(!util.checkMobile(mobile)){
                hiApp.alert("您的电话号码怎么感觉哪里不对劲的样子~");
                return;
            }
            if (!name || !address) {
                hiApp.alert("请把收货信息填写完整！");
            }
            else {
                var province = that.selectProvince, city = that.selectCity, district = that.selectCounty;
                that.updateAjax(name, mobile, province, city, district, address,ID, defaultf);
            }
        }
    },
    updateAjax : function(name, mobile, province, city, district, address, userid, isDefault) {
        "use strict";
        var that = this;
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.UPDATEADDRESS,
            type: 'post',
            data: {
                consigneeid:that.addressToUpdate.addressId,
                consigneename: name,
                consigneemobile: mobile,
                province: province,
                city: city,
                county: district,
                address: address,
                loginid: userid,
                isdefault: isDefault ? "1" : "0"
            },
            error: function () {
                hiApp.hideIndicator();
                return;
            },
            success: function (data) {
                var ret = JSON.parse(data);
                hiApp.hideIndicator();
                if (ret.STATUSCODE === statusCode.SUCCESS) {
                    mainView.router.back();
                }
                else{
                    hiApp.alert("更新失败了~");
                }
            }
        });
    }
}