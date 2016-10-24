/**
 * Created by Administrator on 15-7-20.
 */
var settingObj = {
    page:".setting-page ",
    init:function(){
        this.bindEvent();
        this.initData();
    },
    bindEvent:function(){
        var that = this;
        bindTapEvent(that.page,"#logoutBtn",function(_this){
            userObj.clearLocalUser();
            setTimeout(function(){
                mainView.router.loadPage('page/mycenter.html');
            },100);
        });
    },
    initData:function(){
        //如果没有登录，修改密码和退出登录隐藏
        if(!userObj.isExist()){
            $$("#changePassword").hide();
            $$("#logoutBox").hide();
        }
    }
};