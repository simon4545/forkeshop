var reBackDescObj = {
    init : function(){
    },
    show : function(){
        var that = this;
        that.getDESC(that.showDESC)

    },
    getDESC : function(callBack){
        util.getAjaxData({
            url: appConfig.REBACKDESC,
            type: 'POST',
            error: function (data) {
                hiApp.hideIndicator();
                hiApp.alert('系统正忙，请稍候~');
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
                        callBack && callBack(data.data);
                    }
                    else{
                        hiApp.alert(data.MESSAGE || '系统正忙，请稍候~');
                    }
                }
                catch (ex) {
                    hiApp.alert('系统正忙，请稍候~');
                    return false;
                }
            }
        });
    },
    showDESC : function(data){
        var that = this,
            tpl = "<p>{desc}</p>",
            htmlStr = "";
        for(var i = 0,len = data.length;i<len;i++){
            htmlStr += tpl.replace("{desc}",data[i]);
        }
        $$("#reBackDescWarp").html(htmlStr);
    }
}
