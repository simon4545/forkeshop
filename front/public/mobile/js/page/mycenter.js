/**
 * Created by Administrator on 15-8-24.
 */
var mycenterObj = {
    page:".mycenter-page ",
    init:function(query){
        this.initData(query);
        this.bindEvent(query);
    },
    initData:function(query){
        var that = this;
        that.setUserInfo();
        globalEventEmitter.on('userDataArrived',function(){
            that.setUserInfo();
        });
    },
    bindEvent:function(query){
        var that = this;
        //跳转登录页
        bindTapEvent(that.page,"#slideLogin", function (_this) {
            loginRegisterObj.curTab = 0;
            loginRegisterObj.comeFrom = 'page/index.html';
            mainView.router.loadPage('page/login.html');
        });
        //跳转注册页
        bindTapEvent(that.page,"#slideReg", function (_this) {
            loginRegisterObj.curTab = 1;
            loginRegisterObj.comeFrom = 'page/index.html';
            mainView.router.loadPage('page/login.html');
        });
        //跳转收藏专场
        bindTapEvent(that.page,"#slideCollection", function (_this) {
            userObj.noIDGotoLogin('page/collection.html');
        });
        //查看我的收货地址
        bindTapEvent(that.page,"#slideMyAddress", function (_this) {
            userObj.noIDGotoLogin('page/addressList.html');
        });
        //全部
        bindTapEvent(that.page,"#slideOrderAll", function (_this) {
            shoppingListsObj.tab = 1;
            userObj.noIDGotoLogin('page/shoppinglists.html');
        });
        //待付款
        bindTapEvent(that.page,"#slideOrderToPay", function (_this) {
            shoppingListsObj.tab = 2;
            userObj.noIDGotoLogin('page/shoppinglists.html');
        });
        //待收货
        bindTapEvent(that.page,"#slideOrderToGet", function (_this) {
            shoppingListsObj.tab = 3;
            userObj.noIDGotoLogin('page/shoppinglists.html');
        });
        //退款中
        bindTapEvent(that.page,"#slideOrderToSend", function (_this) {
            shoppingListsObj.tab = 4;
            userObj.noIDGotoLogin('page/shoppinglists.html');
        });
        //已买到
        bindTapEvent(that.page,"#slideOrderToBack", function (_this) {
            shoppingListsObj.tab = 5;
            userObj.noIDGotoLogin('page/shoppinglists.html');
        });
        //进入个人中心
        bindTapEvent(that.page,"#userInfoLink",function(_this){
            if(!userObj.isExist()) return;
            mainView.router.loadPage('page/userCenter/userCenter.html');
        });
        //设置
        bindTapEvent(that.page,"#setting",function(_this){
            mainView.router.loadPage('page/setting.html');
        });
        bindTapEvent(that.page, "#aboutUs", function(){
            mainView.router.loadPage('page/aboutUs.html');
        });
        //拨打电话
        bindTapEvent(that.page,"#telphoneCall",function(){
            util.phoneCall();
        });
    },
    setUserInfo:function(){
        var that = this;
        var slideLogin = $$(that.page+"#slideLogin"),
            slideReg = $$(that.page+"#slideReg"),
            userAccount = $$(that.page+"#userAccount"),
            memberName = $$(that.page+"#memberName"),
            headImg = $$(that.page+"#headImg"),
            editBtn = $$(that.page+"#editBtn");
        if(userObj.isExist()){
            try{
                slideLogin.hide();
                slideReg.hide();
                editBtn.show();
                memberName.show().html(userObj.MEMBERNAME||"访客1001");
                userAccount.html(userObj.MEMBERACCOUNT);
                if(userObj.HEADERIMAGE){
                    headImg.find('img').attr('src',userObj.HEADERIMAGE);
                }else{
                    if(userObj.MEMBERIDEN==0){
                        headImg.find('img').attr('src', 'img/newIcon/icon_15.png');
                    }else{
                        headImg.find('img').attr('src', 'img/newIcon/icon_14.png');
                    }
                }
                headImg.show();
            }catch (e){
            }
        }
    }
};