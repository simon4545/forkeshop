/**
 * Created by Administrator on 15-4-25.
 */
var activityObj = {
    page:'.activity-page ',
    init:function(request){
        this.initData(request);
    },
    initData:function(request){
        this.setCart();
        this.setActivityInfo(request);
        this.setActivityGoodsList(request);
    },
    setCart: function () {
        var that = this;
        shoppingCartObj2.getGoodsNumAndTime(function (data) {
            if (data) {
                if (data.NUM)
                    $$(that.page + ".cart-num").html(data.NUM);
                else
                    $$(that.page + ".cart-num").html(0);
            }
        });
    },
    setActivityInfo:function( request ){
        var activityInfo, endTime,that = this;
        if(!request) return;
        util.getAjaxData({
            url: appConfig.ACTIVITYINFO + '?actionid=' + request.actionid,
            method: 'get',
            error: function () {
                hiApp.hideIndicator();
                return false;
            },
            success: function (json) {
                try{
                    activityInfo = JSON.parse(json);
                    console.log(activityInfo);
                    if(activityInfo && activityInfo.APPACTIONIMAGE && activityInfo.APPACTIONIMAGE!="null"){
                        util.preLoadImage(activityInfo.APPACTIONIMAGE , $$(that.page+".top-img-box img"));
                    }
                    if(activityInfo && activityInfo.DISCOUNTTITLE && activityInfo.DISCOUNTTITLE!="null"){
                        $$(that.page + ".discount-title").html(activityInfo.DISCOUNTTITLE);
                    }
                    $$(that.page+".navbar .center").html(activityInfo.ACTIONTITLE|| "特卖专场");
                    if (activityInfo.ACTIONFINISHTIME) {
                        endTime = activityInfo.ACTIONFINISHTIME.replace(/-/g,"/");
                        var startTime = new Date();
                        util.timer({
                            starTime: startTime,
                            endTime: endTime,
                            timerEnd: function (ele) {
                            }
                        }, $$(that.page+'.s_time'));
                    }
                }catch (e){

                }
            }
        });
    },
    /**
     * 设置活动列表
     * @param request
     * TODO：和首页考虑抽象为同一个函数
     */
    setActivityGoodsList : function(request) {
        var that = this;
        var activity_Box = $$(that.page+".goods-container"),
            activity_goods_Item =  $$("#goodsItemtemplate").html(),
            _activity_goods_Item,tempData,_href;
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.ACTIVITYLIST_URL + '?actionid=' + request.actionid,
            method: 'get',
            error: function () {
                hiApp.hideIndicator();
                return false;
            },
            success: function (json) {
                hiApp.hideIndicator();
                if (json) {
                    try {
                        var activityData = JSON.parse(json);
                        console.log(activityData)
                        for (var i = 0; i < activityData.length; i++) {
                            tempData = activityData[i];
                            _href = 'page/detail.html?id='+tempData.ID+'&actionId='+tempData.ACTIONID+'&groupId='+tempData.GOODSGROUPID;
                            if(parseInt(tempData.ISPREPARE) || parseInt(tempData.ISOFFLINE) || parseInt(tempData.STOCK) <=0){
                                _href = "#";
                            }
                            _activity_goods_Item = activity_goods_Item.replace('{ID}', tempData.GOODSID)
                                .replace('{ACTIONID}', tempData.ACTIONID)
                                .replace('{GROUPID}', tempData.GOODSGROUPID)
                                .replace('{title}', tempData.GOODSTITLE ||  tempData.GOODSGROUPTITLE ||tempData.GOODSSHORTTITLE ||"暂无标题")
                                .replace('{title2}', tempData.GOODSTITLE ||   tempData.GOODSGROUPTITLE ||tempData.GOODSSHORTTITLE ||"暂无标题")
                                .replace('{imgUrl}', tempData.GOODSIMGPATH)
                                .replace('{index}', i)
                                .replace('{discount}', tempData.GOODSDISCOUNT)
                                .replace('{GOODSSALEPRICE}', tempData.GOODSSALEPRICE)
                                .replace('{GOODSPRICE}', tempData.GOODSPRICE)
                                .replace('{href}',  _href);
                            if(parseInt(tempData.STOCK) <=0){
                                //已经售罄的无需判断是否是新品和即将售罄
                                _activity_goods_Item = _activity_goods_Item.replace('{display}','').replace('{good_tag_new}','').replace('{good_tag_out}','');
                            }else{
                                _activity_goods_Item = _activity_goods_Item.replace('{display}','none');
                                if(tempData.ISNEW==1)
                                    _activity_goods_Item = _activity_goods_Item.replace('{good_tag_new}','<img src="img/newIcon/new.png">');
                                else
                                    _activity_goods_Item = _activity_goods_Item.replace('{good_tag_new}','');
                                if(tempData.ISOUT==1)
                                    _activity_goods_Item = _activity_goods_Item.replace('{good_tag_out}','<img src="img/newIcon/out.png">');
                                else
                                    _activity_goods_Item = _activity_goods_Item.replace('{good_tag_out}','');
                            }
                            activity_Box.append(_activity_goods_Item);
                            if(tempData.GOODSIMGPATH) util.preLoadImage(tempData.GOODSIMGPATH ,
                                $$(that.page+"div[contend-id='"+tempData.GOODSID+"'][item-index='"+i+"'] img[data-src='"+tempData.GOODSIMGPATH+"']"));

                            //即将开售
                            if(tempData.ISPREPARE==1){
                                $$(that.page+"div[contend-id='"+tempData.GOODSID+"'][item-index='"+i+"'] .mark")
                                    .css({'background-image':'url("img/newIcon/nostart.png")',
                                        display:''});
                            }
                            //已过期
                            if(tempData.ISOFFLINE==1){
                                $$(that.page+"div[contend-id='"+tempData.GOODSID+"'][item-index='"+i+"'] .mark")
                                    .css({'background-image':'url("img/newIcon/offlinesale.png")',
                                        display:''});
                            }

                        }
                    } catch (e) {

                    }
                }
            }
        });
    }
};


