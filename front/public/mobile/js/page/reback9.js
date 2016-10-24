var reBack9Obj = {
    orderCode: "",
    orderId:"",
    uploadImgTpl: "",
    goodsListTpl:"",
    imgNums: 0,
    maxImgNums: 3,
    init: function () {
        var page = ".reBackOn9";
        var that = this;
        that.uploadImgTpl = $$("#reBackImgTpl").html();
        that.goodsListTpl = $$("#reBackOn9GoodsTpl").html();

        //选择理由
        bindTapEvent(page, '#backReason', function (_this) {
            that.showSelectReason();
        });

        //-
        bindTapEvent(page, '.goodsnum-sub', function (_this) {
            var hereThis = $$(_this);
            var eq = hereThis.attr("eq");
            var num = parseInt($$("#gdNumOn9_" + eq).html());
            if(num>0){
                $$("#gdNumOn9_" + eq).html(num-1);
                if(num == 1){
                    hereThis.removeClass("active");
                }
                $$("#gdAddOn9_" + eq).addClass("active");
            }
        });

        //+
        bindTapEvent(page, '.goodsnum-add', function (_this) {
            var hereThis = $$(_this);
            var eq = hereThis.attr("eq");
            var maxNum = parseInt(hereThis.attr("maxData")) ;
            var num = parseInt($$("#gdNumOn9_" + eq).html());
            if(num < maxNum ){
                $$("#gdNumOn9_" + eq).html(num+1);
                if(num == maxNum - 1 ){
                    hereThis.removeClass("active");
                }
                $$("#gdSubOn9_" + eq).addClass("active");
            }
        });

        //上传图片
        util.upLoadHelper(page, "addImgFile", "imgForm", reBack9Obj, function (imgPath) {
            that.addImgCallback(imgPath);
        });

        //提交申请
        bindTapEvent(page, '#reBackCommit', function (_this) {
            var data = that.checkData();
            if (data) {
                hiApp.confirm("确定退回的商品数量等信息无误？","温馨提示",function(){
                    that.commit(data);
                });
            }
        });
    },
    show: function (code,Id) {
        var that = this;
        that.orderCode = code;
        that.orderId = Id;
        that.imgNums = 0;

        if (userObj.isExist()) {
            util.getAjaxData({
                url: appConfig.ORDERTAIL_URL_1,
                type: 'post',
                data: {
                    loginid: userObj.isExist(),
                    orderid: that.orderId
                },
                error: function () {
                    hiApp.hideIndicator();
                    return false;
                },
                success: function (json) {
                    var dataObj = JSON.parse(json);
                    that.showGoods(dataObj.ORDERDETAIL);
                }
            });
        }
    },
    showGoods:function(data){
        console.log(data);
        var that = this;
        var htmlStr = "";
        for(var i = 0,len=data.length;i<len;i++){
            htmlStr += that.goodsListTpl.replace("{{name}}",data[i].GOODSTITLE)
                .replace("{{filter}}",data[i].GOODSFILTERCONFIG[0])
                .replace(/\{\{num\}\}/g,data[i].GOODSNUM)
                .replace(/\{\{index\}\}/g,i)
                .replace("{{goodId}}",data[i].GOODSACTIONID)
                .replace("{{goodsImg}}",data[i].GOODSIMGPATH);
        }
        $$("#goodsListReBackOn9").html(htmlStr);
    },
    addImgCallback: function (imgPath) {
        var that = this;
        var imgHtml = that.uploadImgTpl.replace("{imgPath}", imgPath);
        $$("#imgWarpReBackOn9").append(imgHtml);
        that.imgNums++;
    },
    showSelectReason: function () {
        var buttons1 = [
            {
                text: '<span style="color:#f60;font-size: 15px;">请选择您退款的原因：</span>',
                label: true
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">发错货退货</span>',
                onClick: function () {
                    $$("#backReason").val("发错货退货");
                }
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">质量问题退货</span>',
                onClick: function () {
                    $$("#backReason").val("质量问题退货");
                }
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">7天无理由退货</span>',
                onClick: function () {
                    $$("#backReason").val("7天无理由退货");
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
    },
    checkData: function () {
        var that = this;
        var i = 0, len = 0;
        var data = {
            loginid: userObj.isExist(),
            orderCode: that.orderCode,
            refundType: 1,
            refundReason: $$("#backReason").val(),
            refundDesc: $$("#backReason2").val()
        }

        var imgs = [];
        var imgDoms = $$("#imgWarpReBackOn9 img");
        for (i = 0, len = imgDoms.length; i < len; i++) {
            imgs.push($$(imgDoms[i]).attr("src"));
        }

        var goodsDom = $$(".numOn9"),tempGoods = null;
        var list = [],flag = 0;
        for(i =0 ,len = goodsDom.length;i<len;i++){
            tempGoods = {
                goodsId : $$("#gdNumOn9_" + i).attr("goodId"),
                num : parseInt($$("#gdNumOn9_" + i).html())
            }
            if(tempGoods.num == 0){
                flag++;
            }
            list.push(tempGoods);
        }
        if(flag == goodsDom.length){
            hiApp.alert("别捣乱好么亲~请确认您要退回的商品和数量~");
            return;
        }

        data.goodsList = JSON.stringify(list) ;

        if (!data.loginid) {
            hiApp.alert("请先登录~");
            return;
        }
        else if (!data.refundReason) {
            hiApp.alert("请选择您退款的原因~");
            return;
        }
        else if (!imgs.length && data.refundReason != "7天无理由退货") {
            hiApp.alert("请上传照片以证明您的描述正确~");
            return;
        }
        else {
            data.uploadImg = imgs.join("^");
            return data;
        }
    },
    commit: function (data) {
        var that = this;
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.REBACKON9,
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
//                            mainView.router.loadPage('page/shoppinglists.html');
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
    }
}
