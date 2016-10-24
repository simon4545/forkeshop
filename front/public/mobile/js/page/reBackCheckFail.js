
var reBackCheckFailObj = {
    refundId : "",
    orderCode : "",
    orderId : "",
    init:function(){
        var that = this;
        var page = ".reBackCheckFail";

        //撤销申请并重新发起
        bindTapEvent(page, '#cancelReBackStart', function (_this) {
            mainView.router.loadPage('page/reBackOn9.html?orderCode=' + that.orderCode + "&id=" + that.orderId);
        });
    },
    show:function(refundId,orderId){
        var that = this;
        that.refundId = refundId;
        that.orderId = orderId;
        var data = {
            loginid : userObj.isExist(),
            refundId : refundId
        }

        reBackAddressObj.getRefundDetail(data,function(ret){
            var log = ret.OPRATELOG;
            $$("#reBackFailTextArea").val(log[0].RECORDTEXT);
            that.orderCode = ret.ORDERCODE;
        });
    },
    checkDataBeforeCancel:function(){
        var that = this;
        var data = {
            loginid : userObj.isExist(),
            refundId : that.refundId,
            reason : "用户主动撤回售后申请"
        }
        return data;
    }
}