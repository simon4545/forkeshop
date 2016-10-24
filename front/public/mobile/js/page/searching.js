/**
 * Created by Administrator on 15-10-26.
 */
var searchingObj = {
    page:'.searching-page ',
    isLoad:false,
    init:function(){
        var that = this;
        that.initData();
        that.bindEvent();
    },
    initData:function(){
        var that = this;
        window.mySearchbar = hiApp.searchbar('.searchbar', {
            searchList: '.list-block-search',
            searchIn: '.item-title'
        });
        $$(that.page + 'input[name="searchInput"]').focus();
        $$(that.page + ".goods-container").html("");
        that.getRecommendKeys();
    },
    bindEvent:function(){
        var that  =this,searchInterval;

        //监听搜索
        $$(that.page).on('change keydown keypress keyup', 'input[name="searchInput"]', function () {
            var searchInfo = $$(this).val();
            if(!searchInfo){
                $$(that.page + ".recommend-search-list").show();
                setTimeout(function(){
                    $$(that.page + ".goods-container").html("");
                    $$(that.page + ".search-res-Box").css('display','none');
                },100);
                return false;
            }else{
                window.searchTimeOut =  setTimeout(function(){
                        clearTimeout(searchTimeOut);
                        that.setSearchingResult(searchInfo);
                },100);

            }
        });

        //推荐搜索热词
        bindTapEvent(that.page, that.page + ".recommend-item",function(_this,e){
           var selectSearch = $$(_this).text();
           $$(that.page + 'input[name="searchInput"]').val(selectSearch).trigger('change');

        });


        //进入专场
        bindTapEvent(that.page, '.goToScene', function (_this) {
            var id = $$(_this).attr("sceneId");
            mainView.router.loadPage({
                url:'page/scene.html?actionId=' + id
            });
        },1);
    },
    getRecommendKeys:function(){
        var that = this;
        var searchBox= $$(that.page + ".search-box");
        util.getAjaxData({
            url: appConfig.GETRECOMMENDKEYS_URL,
            error: function (e) {
                console.log(e);
                return false;
            },
            success: function (json) {
                if (json) {
                    try {
                        var data = JSON.parse(json);
                        if (data.code === statusCode.SUCCESS) {
                            var result = data.data;
                            console.log(result)
                            if(result){
                                for(var i=0;i<result.length; i++){
                                    var recommendItem = '<div class="recommend-item">'+result[i]+'</div>';
                                    searchBox.append(recommendItem);
                                }
                            }
                        }
                    }catch (e){

                    }
                }
            }
        });
    },
    /**
     * 获取搜索场景结果展示
     */
    setSearchingResult:function(searchInfo){
        var that = this;
        var scenesList =  $$(that.page + ".goods-container");
        var searchBox = $$(that.page + ".search-res-Box");
        util.getAjaxData({
            url: appConfig.GETSEARCHINGSCENES_URL,
            data: {
                searchInfo:searchInfo
            },
            type: 'post',
            error: function (e) {
                console.log(e);
                return false;
            },
            success: function (json) {
                if (json) {
                    try {
                        var data = JSON.parse(json);
                        if (data.code === statusCode.SUCCESS) {
                            var sceneList = data.data;
                            scenesList.html("");
                            if(sceneList.length){
                                var htmlStr = "";
                                for(var i = 0,len=sceneList.length;i<len;i++){
                                    var sceneTpl = $$("#scenesCollectTpl").html();
                                    htmlStr += sceneTpl.replace("{{spectacleImage}}",sceneList[i].spectacleImage)
                                        .replace("{{spectacleTitle}}",sceneList[i].spectacleTitle)
                                        .replace("{{likeNum}}",sceneList[i].likeNum)
                                        .replace(/\{\{sceneId\}\}/g,sceneList[i]._id)
                                        .replace(/\{\{@index\}\}/g,i)
                                        .replace("{{listLength}}",sceneList[i].listLength)
                                }
                                scenesList.html(htmlStr);
                                //懒加载图片
                                for(i=0; i<sceneList.length; i++){
                                    if(sceneList[i].spectacleImage) util.preLoadImage(sceneList[i].spectacleImage ,
                                        $$(that.page + "div[sceneid='"+sceneList[i]._id+"'] .action-img-con img[data-src='"+sceneList[i].spectacleImage+"']"));
                                }
                                searchBox.css('display','block');
                            }
                        }
                        else{

                        }
                    } catch (e) {
                    }
                }
            }
        });
    },
    setSearchingList : function() {
        var that = this;
        var activity_Box = $$(that.page+".goods-container"),
            activity_goods_Item =  $$("#goodsItemtemplate").html(),
            _activity_goods_Item,tempData,_href;
        activity_Box.html("");
        util.getAjaxData({
            url: appConfig.GETSEARCHINGGOODS_URL,
            method: 'get',
            error: function () {
                return false;
            },
            success: function (json) {
                if (json) {
                    try {
                        json = JSON.parse(json);
                        if(!json)  return;
                        var activityData = json.data;
                        for (var i = 0; i < activityData.length; i++) {
                            tempData = activityData[i];
                            var discount = parseInt(Number(tempData.GOODSSALEPRICE)/Number(tempData.GOODSPRICE) *10);
                            _href = 'page/detail.html?id='+tempData.ID+'&actionId='+tempData.ACTIONID+'&groupId='+tempData.GOODSGROUPID;
                            _activity_goods_Item = activity_goods_Item.replace('{ID}', tempData.GOODSID)
                                .replace('{ACTIONID}', tempData.ACTIONID)
                                .replace('{GROUPID}', tempData.GOODSGROUPID)
                                .replace('{title}', tempData.GOODSTITLE ||  tempData.GOODSGROUPTITLE ||tempData.GOODSSHORTTITLE ||"暂无标题")
                                .replace('{title2}', tempData.GOODSTITLE ||   tempData.GOODSGROUPTITLE ||tempData.GOODSSHORTTITLE ||"暂无标题")
                                .replace('{imgUrl}', tempData.GOODSIMGPATH)
                                .replace('{index}', i)
                                .replace('{discount}', discount || 1)
                                .replace('{GOODSSALEPRICE}', tempData.GOODSSALEPRICE)
                                .replace('{GOODSPRICE}', tempData.GOODSPRICE)
                                .replace('{href}',  _href)
                                .replace('{display}','').replace('{good_tag_new}','').replace('{good_tag_out}','');
                            activity_Box.append(_activity_goods_Item);
                            if(tempData.GOODSIMGPATH) util.preLoadImage(tempData.GOODSIMGPATH ,
                                $$(that.page+"div[contend-id='"+tempData.GOODSID+"'][item-index='"+i+"'] img[data-src='"+tempData.GOODSIMGPATH+"']"));
                        }
                        $$(that.page+ ".recommend-container").show();
                    } catch (e) {

                    }
                }
            }
        });
    }
}