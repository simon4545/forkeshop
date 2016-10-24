/**
 * Created by Administrator on 15-7-9.
 */

var indexObj ={
    page:'.index-page ',
    category:"all",
    orderInfo:{
        sex: '',
        has:'false',
        priceOrder : "",
        discountOrder :""
    },
    init:function(query){
        this.bindEvent(query);
        this.initData(query);
    },
    initData:function(query){
        if(query.category) this.category = query.category;
        this.setCart();
        this.setClassify();
        this.setTabStatus(this.category);
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
    bindEvent:function(){
        var that = this,infiniteTime=0;
        //切换cate
        bindTapEvent(that.page,that.page+".type-tab .tab-item", function (_this) {
            var index = $$(_this).index();
            that.category = index;
            that.setTabStatus(index);
            that.setClassify();
        });
        //是否有货
        bindTapEvent(that.page,that.page + ".order-tab .has",function(_this){
            var has = $$(that.page+".order-tab .has").attr('has');
            if(has=='true'){
                has = 'false';
            }else{
                has = 'true';
            }
            $$(that.page+".order-tab .has" ).attr('has',has);
            if( has=='true' ){
                $$(that.page+".order-tab .has .single").addClass('single-l');
            }else{
                $$(that.page+".order-tab .has .single").removeClass('single-l');
            }
            that.setOrderInfo();
            that.setClassify();
        });
        //在每个页面监听滚动条事件
        $$(that.page + ".page-content").on('scroll',function(){
            _onScroll(this, that.page);
        });
        //价格排序
        bindTapEvent(that.page,that.page + ".order-tab .price",function(_this){
            var ordertype = $$(_this).attr('orderby');
            that.setOrderStatus(ordertype);
            //设置排序信息
            that.setOrderInfo();
            //分类ID
            that.setClassify();
        });
        //折扣排序
        bindTapEvent(that.page,that.page + ".order-tab .discount",function(_this){
            var ordertype = $$(_this).attr('orderby');
            that.setOrderStatus(ordertype);
            that.setOrderInfo();
            that.setClassify();
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
                that.setClassify(chosePage,function(){
                    preloader.show();
                });
                }
            }, 500);
        });
    },
    setClassify:function( page ){
        var that = this;
        var classify_Box = $$(that.page+".goods-container"),
            classify_goods_Item =  $$("#goodsItemtemplate").html(),
            _classify_goods_Item,tempData,filters="",category,_href;
        if(!page) page =1;
        if( that.orderInfo.priceOrder!=""){
            filters = filters + "GoodsSalePrice:" + that.orderInfo.priceOrder;
        }else if( that.orderInfo.discountOrder!=""){
          //  filters = filters + "GoodsDiscount:" + that.orderInfo.discountOrder;
        }
        if(page==1){
            classify_Box.html("");
        }
        category = that.getCategoryIds(that.category);
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.GETCATEGORYGOODSLIST_URL,
            type: 'post',
            data:{
                filters:filters,
                hasInventory:that.orderInfo.has,
                pageNum:page,
                categoryType:category
            },
            error: function (e) {
                hiApp.hideIndicator();
                return false;
            },
            success: function (json) {
                hiApp.hideIndicator();
                if (json) {
                    try {
                        var classifyData = JSON.parse(json).DATA;
                        console.log(classifyData);
                        for (var i = 0; i < classifyData.length; i++) {
                            tempData = classifyData[i];
                            _href = 'page/detail.html?groupId='+tempData.GOODSGROUPID;
                            if(parseInt(tempData.ISPREPARE) || parseInt(tempData.ISOFFLINE) || parseInt(tempData.STOCK) <=0){
                                _href = "#";
                            }
                            _classify_goods_Item = classify_goods_Item.replace('{ID}', tempData.GOODSID)
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
                                _classify_goods_Item = _classify_goods_Item.replace('{display}','').replace('{good_tag_new}','').replace('{good_tag_out}','');
                            }else{
                                _classify_goods_Item = _classify_goods_Item.replace('{display}','none');
                                if(tempData.ISNEW==1)
                                    _classify_goods_Item = _classify_goods_Item.replace('{good_tag_new}','<img src="img/newIcon/new.png">');
                                else
                                    _classify_goods_Item = _classify_goods_Item.replace('{good_tag_new}','');
                                if(tempData.ISOUT==1)
                                    _classify_goods_Item = _classify_goods_Item.replace('{good_tag_out}','<img src="img/newIcon/out.png">');
                                else
                                    _classify_goods_Item = _classify_goods_Item.replace('{good_tag_out}','');
                            }
                            classify_Box.append(_classify_goods_Item);

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
                        if(classifyData.length>0 && classifyData.length ==20)
                            $$(that.page+".index-infinite-preloader").show();
                        else
                            $$(that.page+".index-infinite-preloader").hide();
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        });
    },
    setTabStatus:function(index){
        var tabArr = $$(this.page+".type-tab .tab-item"),tabItem,selectItem;
        for(var i=0; i< tabArr.length ;i++){
            tabItem = tabArr[i];
            $$(tabItem).find('img').attr('src','img/icon-tab/'+i+'.png');
        }
        selectItem = tabArr[index];
        $$(selectItem).find('img').attr('src','img/icon-tab/'+index+'-l.png');
    },
    getCategoryIds:function( index ){
        var categoryIds="";
        if(!index) index = 0;
        switch (parseInt(index)){
            case 0:
                categoryIds = 'jacket';
                break;
            case 1:
                categoryIds = 'trousers';
                break;
            case 2:
                categoryIds = 'skirt';
                break;
            case 3:
                categoryIds = 'suit';
                break;
            case 4:
                categoryIds = 'shoes';
                break;
            case 5:
                categoryIds = 'accessories';
                break;
            default:
                categoryIds = '';
        }
        return categoryIds;
    },
    setOrderStatus:function(ordertype){
        var that = this,order;
        order = $$(that.page+".order-tab ." + ordertype).attr('order');
        if(order=='asc'){
            order ='desc';
        }else if(order == 'desc'){
            order = 'asc';
        }else{
            order = 'desc';
        }

        $$(that.page+".order-tab .price").attr('order','');
        $$(that.page+".order-tab .discount").attr('order','');
        $$(that.page+".order-tab ." + ordertype).attr('order',order);

        $$(that.page+".order-tab .price").removeClass("order-desc").removeClass("order-asc");
        $$(that.page+".order-tab .discount").removeClass("order-desc").removeClass("order-asc");
        $$(that.page+".order-tab ."+ ordertype).addClass('order-'+order);
    },
    setOrderInfo:function(){
        var that = this,
            has = $$(that.page+".order-tab .has").attr('has'),
            sex = $$(that.page+".order-tab .has").attr('sex'),
            priceOrder = $$(that.page+".order-tab .price").attr('order'),
            discountOrder = $$(that.page+".order-tab .discount").attr('order');
        this.orderInfo = {
            has: has||"",
            sex:sex||"",
            priceOrder : priceOrder||"",
            discountOrder : discountOrder||""
        };
    }
};