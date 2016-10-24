var reBackCheckingObj = {
    refundId:"",
    init:function(){
        var that = this;
        var page = ".reBackChecking"
        //撤销申请
        bindTapEvent(page, '#cancelReBack', function (_this) {
            var data = that.checkDataBeforeCancel();
            if(data){
                that.cancelReBack(data,function(){
                    mainView.router.back();
                });
            }
        });
    },
    show:function(refundId){
        var that = this;
        that.refundId = refundId;
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
    cancelReBack : function(data,callBack){
        var that = this;
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.REBACKCANCEL,
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
                    if(data.STATUSCODE == 200){
                        hiApp.alert(data.MESSAGE,"提示",function(){
                            callBack && callBack();
                        });
                    }
                    else{
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
