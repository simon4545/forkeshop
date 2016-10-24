
var reMinderOrderObj = {
    orderCode:"",
    init:function(){
        var page = ".reMinderOrder";
        var that = this;

        //选择理由
        bindTapEvent(page, '#reMinderReason', function (_this) {
            that.showSelectReason();
        });

        //提交
        bindTapEvent(page, '#reMinderCommit', function (_this) {
            var data = that.checkData();
            if(data){
                that.postReMinderData(data);
            }
        });

    },
    show:function(orderCode){
        var that = this;
        that.orderCode = orderCode;
    },
    checkData:function(){
        var that = this;
        var data = {
            loginId:userObj.isExist(),
            orderCode: that.orderCode,
            reason:$$("#reMinderReason").val(),
            remark:$$("#reMinderReason2").val()
        }

        if(!data.loginId){
            hiApp.alert("请先登录~");
            return ;
        }
        else if(!data.reason){
            hiApp.alert("请先选择催单原因~");
            return;
        }
        else{
            return data;
        }
    },
    postReMinderData:function(data){
        var that = this;
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.REMINDERORDER,
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
    showSelectReason: function () {
        var buttons1 = [
            {
                text: '<span style="color:#f60;font-size: 15px;">请选择您催单的原因：</span>',
                label: true
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">一直没有物流单号</span>',
                onClick: function () {
                    $$("#reMinderReason").val("一直没有物流单号");
                }
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">物流单号查不到信息</span>',
                onClick: function () {
                    $$("#reMinderReason").val("物流单号查不到信息");
                }
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">物流信息停止更新了</span>',
                onClick: function () {
                    $$("#reMinderReason").val("物流信息停止更新了");
                }
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">漏发货，需要补发</span>',
                onClick: function () {
                    $$("#reMinderReason").val("漏发货，需要补发");
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
