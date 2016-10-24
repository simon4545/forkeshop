
var reBackWaitingObj = {
    orderCode:"",
    init:function(){

    },
    show:function(orderCode){
        var that = this;
        that.orderCode = orderCode;
        that.getData(orderCode);
    },
    getData:function(orderCode){
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.REBACKINFO,
            type: "post",
            data: {
                orderCode:orderCode
            },
            success:function(ret){
                hiApp.hideIndicator();
                var retObj = JSON.parse(ret);
                $$("#rebackInfo").html(retObj.data);
            },
            error:function(){
                hiApp.hideIndicator();
            }
        }, 3);
    }
}
