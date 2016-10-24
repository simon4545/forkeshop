//收藏的代码
//TODO : 分页和懒加载
//TODO : 没有收藏的显示
var collectionObj = {
    page:".collection-page",
    sceneTpl:"",
    goodsTpl : "",
    goodsWarpTpl : "",
    init : function (){
        var that = this;
        that.goodsWarpTpl = $$("#goodsCollect1Tpl").html();
        that.goodsTpl = $$("#goodsCollect2Tpl").html();
        that.bindEvent();
    },
    bindEvent : function (){
        var that = this;
        //进入详情页
        bindTapEvent(that.page, '.gotodetail', function (_this) {
            var actionId = $$(_this).attr("ct-actionid");
            var groupId = $$(_this).attr("ct-groupid");
            var id = $$(_this).attr("ct-id");
            mainView.router.loadPage({
                url:'page/detail.html?actionId=' + actionId + "&groupId=" + groupId
            });
        },1);

        //删除单品
        bindTapEvent(that.page, '.deleGoods', function (_this,e) {
            var id = $$(_this).attr("goods");
            scenesObj.setCollectGoods(id,0,function(){
                that.showSingles();
            });
            e.stopPropagation();
            e.preventDefault();
            return false;
        });
    },
    show : function (){
        var that = this;
        //根据tab值，显示专场或单品
        //默认显示单品
        that.showSingles();
    },
    //显示单品
    showSingles : function(){
        var that = this;
        scenesObj.getCollectGoods(function(goodslist){

            if(goodslist.length){
                $$("#singlesCollDiv .goods-container").html("");
                //两个一组，分组加载
                var i = 0,len = goodslist.length;
                var tempStr = "";
                for(; i< len; i++){
                    console.log(len);
                    tempStr = that.getGoodsHtmlHelper(goodslist[i],i);
                    $$("#singlesCollDiv .goods-container").append(tempStr);
                }
                //懒加载图片
                for(i=0; i<goodslist.length; i++){
                    if(goodslist[i].GoodsImgPath) util.preLoadImage(goodslist[i].GoodsImgPath ,
                        $$("#goodsCollectImg_" + i));
                }
            }
            else{
                $$("#singlesCollDiv .goods-container").html("");
                that.showNoGoods();
            }
        });
    },
    getGoodsHtmlHelper:function(obj,i){
        var that = this;
        return  that.goodsTpl.replace("{goodsTitle}",obj.GoodsGroupTitle)
            .replace("{salePrice}",obj.GoodsSalePrice)
            .replace("{price}",obj.GoodsPrice)
            .replace(/\{GROUPID\}/g,obj.GoodsGroupId)
            .replace(/\{ACTIONID\}/g,obj.ActionId)
            .replace(/\{ID\}/g,obj.GoodsGroupId)
            .replace(/\{@index\}/g,i)
            .replace("{noStock}",obj.MaxCount > 0 ? "none;":"block;")
            .replace("{offLine}",obj.GoodsSaleState === 1 ? "none;":"block;")
            .replace("{discount}",obj.GoodsDiscount);
    },
    showNoGoods : function(){
        $$("#noGoodsColl").show();
    }
};