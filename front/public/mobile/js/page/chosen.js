/**
 * Created by Administrator on 15-12-26.
 */
var chosenObj ={
    page:'.chosen-page ',
    init:function(query){
        this.bindEvent(query);
        this.initData(query);
    },
    initData:function(query){
        this.setChosenList(query);
    },
    bindEvent:function(query){
        var that = this,infiniteTime=0;

        bindTapEvent(that.page, ".goods-item", function(_this){
            var index = $$(_this).index();
            if(!index) index = "all";
            util.writeAjaxLog( '','', 'statist', {target:'chosen-item'+ index} );
        });

        //在每个页面监听滚动条事件
        $$(that.page + ".page-content").on('scroll',function(){
            _onScroll(this, that.page);
        });
        // 注册'infinite'事件处理函数
        $$(document).on('infinite',that.page + '.infinite-scroll' ,function (e) {
            infiniteTime++;
            if( infiniteTime==2){
                infiniteTime =0;
                e.stopPropagation();
                return false;
            }
            var preloader= $$(that.page+".index-infinite-preloader");
            setTimeout(function () {
                if (preloader.css("display") == 'block') {
                    var chosePage = preloader.attr("contend-page");
                    console.log('page'+chosePage);
                    chosePage++;
                    preloader.attr("contend-page", chosePage).hide();
                    that.setChosenList(chosePage,function(){
                        preloader.show();
                    });
                }
            }, 500);
        });
    },
    setChosenList:function( page ){
        var that = this;
        var chosen_Box = $$(that.page+".goods-container"),
            chosen_goods_Item =  $$("#goodsItemtemplate").html(),
            _chosen_goods_Item,tempData,_href,chosenData;
        if(!page) page =1;
        if(page==1){
            chosen_Box.html("");
        }
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.CHOSELIST_URL + "/" + page,
            type: 'post',
            error: function (e) {
                hiApp.hideIndicator();
                return false;
            },
            success: function (json) {
                hiApp.hideIndicator();
                if (json) {
                    try {
                        var chosenData = JSON.parse(json);
                        console.log(chosenData);
                        for (var i = 0; i < chosenData.length; i++) {
                            tempData = chosenData[i];
                            _href = 'page/detail.html?id='+tempData.ID+'&actionId='+tempData.ACTIONID+'&groupId='+tempData.GOODSGROUPID;
                            if(parseInt(tempData.ISPREPARE) || parseInt(tempData.ISOFFLINE) || parseInt(tempData.STOCK) <=0){
                                _href = "#";
                            }
                            _chosen_goods_Item = chosen_goods_Item.replace('{ID}', tempData.GOODSID)
                                .replace('{ACTIONID}', tempData.ACTIONID)
                                .replace('{GROUPID}', tempData.GOODSGROUPID)
                                .replace('{title}', tempData.GOODSTITLE || tempData.GOODSGROUPTITLE ||"暂无标题")
                                .replace('{title2}', tempData.GOODSTITLE ||  tempData.GOODSGROUPTITLE ||"暂无标题")
                                .replace('{imgUrl}', tempData.GOODSIMGPATH)
                                .replace('{index}', i)
                                .replace('{discount}', tempData.GOODSDISCOUNT)
                                .replace('{GOODSSALEPRICE}', tempData.GOODSSALEPRICE)
                                .replace('{GOODSPRICE}', tempData.GOODSPRICE)
                                .replace('{href}', _href);
                            if(parseInt(tempData.STOCK) <=0){
                                //已经售罄的无需判断是否是新品和即将售罄
                                _chosen_goods_Item = _chosen_goods_Item.replace('{display}','').replace('{good_tag_new}','').replace('{good_tag_out}','');
                            }else{
                                _chosen_goods_Item = _chosen_goods_Item.replace('{display}','none');
                                if(tempData.ISNEW==1)
                                    _chosen_goods_Item = _chosen_goods_Item.replace('{good_tag_new}','<img src="img/newIcon/new.png">');
                                else
                                    _chosen_goods_Item = _chosen_goods_Item.replace('{good_tag_new}','');
                                if(tempData.ISOUT==1)
                                    _chosen_goods_Item = _chosen_goods_Item.replace('{good_tag_out}','<img src="img/newIcon/out.png">');
                                else
                                    _chosen_goods_Item = _chosen_goods_Item.replace('{good_tag_out}','');
                            }
                            chosen_Box.append(_chosen_goods_Item);

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
                        if(chosenData.length>0 && chosenData.length ==20)
                            $$(that.page+".index-infinite-preloader").show();
                        else
                            $$(that.page+".index-infinite-preloader").hide();
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        });
    }
};