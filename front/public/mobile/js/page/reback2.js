
var reBack2Obj= {
    oid : "",
    init : function (){
        var page = ".reBackOn2";
        var that = this;
        bindTapEvent(page, '#backReason', function (_this) {
            that.showSelectReason();
        });

        bindTapEvent(page, '#reBackCommit', function (_this) {
            var str =  $$("#backReason").val();
            var str2 =  $$("#backReason2").val();
            if(str || str2){
                that.commit(str,str2);
            }
            else{
                hiApp.alert("请选择您退款的原因~");
            }
        });
    },
    show:function(oid){
        var that = this;
        that.oid = oid;
    },
    showSelectReason:function(){

        var buttons1 = [
            {
                text: '<span style="color:#f60;font-size: 15px;">请选择您退款的原因：</span>',
                label: true
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">地址填错，重新拍</span>',
                onClick : function(){
                    $$("#backReason").val("地址填错，重新拍");
                }
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">颜色尺码选错，重新拍</span>',
                onClick :  function(){
                    $$("#backReason").val("颜色尺码选错，重新拍");
                }
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">不喜欢了</span>',
                onClick :  function(){
                    $$("#backReason").val("不喜欢了");
                }
            },
            {
                text: '<span style="color:#5c5c5c;font-size: 15px;">其他</span>',
                onClick :  function(){
                    $$("#backReason").val("其他");
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
    commit : function(type,str){
        var that = this;
        util.getAjaxData({
            url: appConfig.REBACKON2 + that.oid,
            data: {reason: type,reason2:str},
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
                    if(data.code == 200){
                        hiApp.alert(data.msg);
                        shoppingListsObj.tab = 4;
                        mainView.router.loadPage('page/shoppinglists.html');
                    }
                    else{
                        hiApp.alert(data.msg || '后台数据出错，请稍后重试~');
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
