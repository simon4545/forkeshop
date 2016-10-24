var reBackAddressObj = {
    refundId: "",
    imgNums:0,
    maxImgNums : 3,
    uploadImgTpl:"",
    reFundReason : "",
    init: function () {
        var that = this;
        var page = ".reBackAddress";
        that.uploadImgTpl = $$("#reBackImgTpl").html();
        //选择物流公司
        bindTapEvent(page, '#backExpressName', function (_this) {
            that.showSelectWuliu();
        });

        bindTapEvent(page, '#reBackCommitAddress', function (_this) {
            var data = that.checkData();
            if (data) {
                hiApp.confirm("请确认您提交的信息无误~","提示",function(){
                    that.commitData(data);
                });
            }
        });

        //地址页面撤销申请
        bindTapEvent(page, '#cancelReBackAddress', function (_this) {
            var data = that.checkDataBeforeCancel();
            if(data){
                reBackCheckingObj.cancelReBack(data,function(){
                    mainView.router.back();
                });
            }
        });

        //上传图片
        util.upLoadHelper(page,"addImgReAddress", "imgFormReAddress",reBackAddressObj, function (imgPath) {
            that.addImgCallback(imgPath);
        });
    },
    show: function (refundId) {
        var that = this;
        that.refundId = refundId;
        that.imgNums = 0;

        var data = {
            loginid : userObj.isExist(),
            refundId : refundId
        }

        that.getRefundDetail(data,function(ret){
            that.reFundReason = ret.REFUNDREASON;

            //显示商家退货地址
            that.showSellerAddress(ret.MERCHANTREFUNDADDRESS);
            //显示支付宝信息填写项目
            if(ret.REFUNDREASON != "7天无理由退货" ){
                that.showZFB();
            }
            //TODO:显示售后时间须知
        });
    },
    addImgCallback:function(imgPath){
        var that = this;
        var imgHtml = that.uploadImgTpl.replace("{imgPath}",imgPath);
        $$("#imgWarpReBackAddress").append(imgHtml);
        that.imgNums++;
    },
    checkDataBeforeCancel:function(){
        var that = this;
        var data = {
            loginid : userObj.isExist(),
            refundId : that.refundId,
            reason : "用户主动撤回售后申请"
        }
        return data;
    },
    getRefundDetail:function(data,callBack){
        var that = this;
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.REBACKDETAIL,
            data: data,
            type: 'POST',
            error: function (data) {
                hiApp.hideIndicator();
                hiApp.alert('系统正忙，请稍后重试~');
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
                    if (data.STATUSCODE == 200) {
                        callBack(data.DATA);
                    }
                    else {
                        hiApp.alert(data.MESSAGE || '后台数据出错，请稍后重试~');
                    }
                }
                catch (ex) {
                    hiApp.alert('后台数据出错，请稍后重试~');
                    return false;
                }
            }
        });
    },
    showSellerAddress: function (addStr) {
        $$("#sellerAddress").html(addStr);
    },
    showZFB: function () {
        $$("#ZFBAccountWarp").show();
        $$("#ZFBNameWarp").show();
        $$("#ZFBFeeWarp").show();
    },
    commitData: function (data) {
        var that = this;
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.REBACKADDRESS,
            data: data,
            type: 'POST',
            error: function (data) {
                hiApp.hideIndicator();
                hiApp.alert('系统正忙，请稍后重试~');
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
                    if (data.STATUSCODE == 200) {
                        hiApp.alert(data.MESSAGE,"提示",function(){
                            mainView.router.back();
                        });
                    }
                    else {
                        hiApp.alert(data.MESSAGE || '后台数据出错，请稍后重试~');
                    }
                }
                catch (ex) {
                    hiApp.alert('后台数据出错，请稍后重试~');
                    return false;
                }
            }
        });
    },
    checkData: function () {
        var that = this;
        var imgs = [];
        var imgDoms = $$("#imgWarpReBackAddress img");
        for (var i = 0, len = imgDoms.length; i < len; i++) {
            imgs.push($$(imgDoms[i]).attr("src"));
        }

        var fee = parseFloat($$("#ZFBFee").val() || 0).toFixed(2);
        console.log(fee);
        $$("#ZFBFee").val(fee);
        var data = {
            loginid: userObj.isExist(),
            refundId: that.refundId,
            expressCompany: $$("#backExpressName").val(),
            expressCode: $$("#backExpressCode").val(),
            expressFee: fee,
            alipayAuthName: $$("#ZFBName").val(),
            alipayAccount: $$("#ZFBAccount").val(),
            expressImg: imgs
        }

        if (data.expressCompany && data.expressCode) {

        }
        else {
            hiApp.alert("请将快递信息补充完整~");
            return;
        }

        if(that.reFundReason != "7天无理由退货"){
            if (data.expressFee.toLowerCase() != 'nan') {
                if (!imgs.length) {
                    hiApp.alert("请上传快递单照片~");
                    return;
                }
                else if (!data.alipayAuthName) {
                    hiApp.alert("请将支付宝认证姓名补充完整~以方便我们将快递费退给您~");
                    return;
                }
                else if (!data.alipayAccount) {
                    hiApp.alert("请将支付宝账号补充完整~以方便我们将快递费退给您~");
                    return;
                }

                data.expressImg =  data.expressImg.join("^");
                return data;
            }
            else{
                hiApp.alert("请将物流费用填写为小数，无须其他字符~");
            }
        }
        else{
            data.expressImg =  data.expressImg.join("^");
            return data;
        }
    },
    showSelectWuliu: function () {
        var buttons1 = [
            {
                text: '<span style="color:#f60;font-size: 15px;">请选择您退货的物流公司：</span>',
                label: true
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">EMS</span>',
                onClick: function () {
                    $$("#backExpressName").val("EMS");
                }
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">韵达</span>',
                onClick: function () {
                    $$("#backExpressName").val("韵达");
                }
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">中通</span>',
                onClick: function () {
                    $$("#backExpressName").val("中通");
                }
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">百世汇通</span>',
                onClick: function () {
                    $$("#backExpressName").val("百世汇通");
                }
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">圆通</span>',
                onClick: function () {
                    $$("#backExpressName").val("圆通");
                }
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">申通</span>',
                onClick: function () {
                    $$("#backExpressName").val("申通");
                }
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">天天</span>',
                onClick: function () {
                    $$("#backExpressName").val("天天");
                }
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">其他</span>',
                onClick: function () {
                    $$("#backExpressName").val("其他");
                }
            }
        ];
        var buttons2 = [
            {
                text: '<span style="color:#f60;font-size: 15px;">取消</span>'
            }
        ];

        var groups = [buttons1, buttons2];
        hiApp.actions(groups);
    }
}
