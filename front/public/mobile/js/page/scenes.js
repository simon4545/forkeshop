var scenesObj = {
    tpl: "",
    page: ".scene-page ",
    curSceneId : "",
    //场景页，
    curSceneGoodsList : [],
    curSceneLike : 0,
    init: function (request) {
        var that = this;
        that.tpl = $$("#scenesDetailTpl").html();

        bindTapEvent(that.page, 'li', function (_this) {
            var url = $$(_this).attr("gotoUrl");

            mainView.loadPage({
                url:"page/detail.html?" + url
            })
        },1);

        function showSetSceneCollSu(){
            that.curSceneLike = that.curSceneLike ? 0 : 1 ;
            that.showSceneLike();
            if(that.curSceneLike ===1 && userObj.isExist()){
                $$("#tipsImgZan").addClass('active');
                setTimeout(function(){
                    $$("#tipsImgZan").removeClass('active');
                    $$(".show-collect-dialog").addClass("active");
                    setTimeout(function(){
                        $$(".show-collect-dialog").removeClass('active');
                    },1500);
                },1000);
            }
        }

        //这里由于考虑到img的自适应，所以收藏专场的点击在两个地方触发
        bindTapEvent(that.page, 'img.width100', function (_this) {
            that.setCollectScenes(that.curSceneId,that.curSceneLike ? 0 : 1, showSetSceneCollSu);
        });
        bindTapEvent(that.page, '.testTips', function (_this) {
            that.setCollectScenes(that.curSceneId,that.curSceneLike ? 0 : 1,showSetSceneCollSu);
        });

        //收藏单品
        bindTapEvent(that.page, '.testZan', function (_this,e) {
            //TODO :
            var id = $$(_this).attr("goodsgroupid");
            var index = $$(_this).attr("index");
            var flag = $$("#testZanImg_" + index).attr("src") === "./img/923/nozan.png" ? 1:0;

            that.setCollectGoods(id,flag,function(){
                that.showLikeGoodsInScene(function(){
                    if(flag ===1 && userObj.isExist()){
                        $$(_this).find('img').addClass('active');
                        setTimeout(function(){
                            $$(_this).find('img').removeClass('active');
                            $$(".show-collect-dialog").addClass("active");
                            setTimeout(function(){
                                $$(".show-collect-dialog").removeClass('active');
                            },1500);
                        },1000);
                    }
                });
            });
            e.stopPropagation();
            e.preventDefault();
            return false;
        });

        //在每个页面监听滚动条事件
        $$(that.page + ".page-content").on('scroll',function(_this){
            if(!$$(that.page + ".redpackImport").hasClass('active')){
                $$(that.page + ".redpackImport").addClass('active');
            }
        });


//      redpackObj.hasRaffleChance();
        //这里判断抽奖活动是否停止
        redpackObj.activityStop(function(){
            $$(that.page + ".redpackImport").hide();
        },function(){
            $$(that.page + ".redpackImport").hide();
        });


        var device = Framework7.prototype.device;
        if(device.iphone){
            // 下拉刷新页面
            $$(that.page + ".page-content").addClass('pull-to-refresh-content');
            setTimeout(function(){
                var ptrContent = $$(that.page+ '.pull-to-refresh-content');
                //第二个参数代表不使用translate
                // 添加'refresh'监听器
                ptrContent.on('refresh', function (e) {
                    var topImg =  $$(that.page + ".scene-top-img");
                    var initHeight = $$(".scene-page .scene-top-img-con").attr('init-height');
                    setTimeout(function(){
                        var _scale = topImg[0].style.transform;
                        if(_scale!=""){
                            _scale = parseFloat(_scale.substring(6,_scale.length-1)).toFixed(3);
                            var _ind = setInterval(function(){
                                _scale = _scale -0.1;
                                if(_scale<=1){
                                    _scale=1;
                                    clearInterval(_ind);
                                }
                                topImg.css({
                                    "transform-origin":"50% 0",
                                    "-webkit-transform-origin":"50% 0",
                                    "transform":"scale("+_scale+")",
                                    "-webkit-transform":"scale("+_scale+")"
                                });
                                topImg.parent().css('height',parseFloat(initHeight)*_scale + "px")
                            },5);
                        }
                        hiApp.pullToRefreshDone();
                    },0);
                });
            },500);

        }
    },
    showSceneLike:function(flag){
        var that = this;
        $$("#tipsImgZan").attr("src",that.curSceneLike ? "./img/923/coll.png" : "./img/923/noColl.png");
        if(!flag){
            var num = parseInt($$("#slikeNum").html());
            num += (that.curSceneLike ? 1 : -1 );
            $$("#slikeNum").html(num);
        }
    },
    show: function (id) {
        var that = this;
        that.curSceneId = id;
        that.curSceneLike = 0;
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.SCENES_DETAIL,
            data: {
                id: id
            },
            type: 'post',
            error: function (e) {
                console.log(e);
                hiApp.hideIndicator();
                return false;
            },
            success: function (json) {
                hiApp.hideIndicator();
                if (json) {
                    try {
                        var data = JSON.parse(json);
                        if (data.STATUSCODE === statusCode.SUCCESS) {
                            var data2 = JSON.parse(data.DATA);
                            that.curSceneGoodsList = data2.spectacleGoodsList;
                            that.showHtml(data2);
                        }
                        else{
                            hiApp.alert("此专场已不复存在~",function(){
                                mainView.loadPage({
                                    url:"page/index.html"
                                })
                            });
                        }
                    } catch (e) {

                    }
                }
            }
        });
    },
    showHtml: function (data) {
        var that = this;

        var tplhelper = $$("#scenesDetailHelperTpl").html();
        var tplhelper2 = $$("#scenesDetailHelper2Tpl").html();
        var list = data.spectacleGoodsList;
        var strinner = "";
        for(var i= 0,len=list.length ; i<len;i++){
            strinner += tplhelper.replace("{{link}}",list[i].link)
                .replace(/\{\{@index\}\}/g,i)
                .replace("{{imgPath}}",list[i].imgPath)
                .replace("{{goodsPrice}}",list[i].goodsPrice)
                .replace("{{goodsTitle}}",list[i].goodsTitle)
                .replace("{{goodsDesc}}",list[i].goodsDesc)
                .replace("{{goodsGroupId}}",list[i]._id)
                .replace("{{collectionNum}}",list[i].collectionNum)
                .replace(/\{\{process\}\}/g,list[i].process)
                .replace("{{helper2}}",list[i].process === 100 ? tplhelper2 : "" )
                .replace("{{groupId}}",list[i]._id)
        }

        var htmlStr = that.tpl.replace("{{spectacleImage}}",data.spectacleImage)
            .replace("{{spectacleTitle}}",data.spectacleTitle)
            .replace("{{spectacleDesc}}",data.spectacleDesc)
            .replace("{{likeNum}}",data.likeNum)
            .replace("{{helper1}}",strinner);

        $$("#scenesContent").html(htmlStr);

        //懒加载图片
        var spectacleGoodsList = data.spectacleGoodsList;
        for(var i=0; i<spectacleGoodsList.length; i++){
            var tempData = spectacleGoodsList[i];
            if(tempData.imgPath) util.preLoadImage(tempData.imgPath ,
                $$("#goodsImgScene_" + i));

            //1元商品显示宝箱图标
            if(oneYuan){
                for(var j=0;j < oneYuan.length; j++){
                    if(tempData._id == oneYuan[j]){
                        if($$("li[_groupId='"+tempData._id+"']").length>0)
                            $$("li[_groupId='"+tempData._id+"']").find(".goldenBox").addClass("active");
                    }
                }
            }
        }

        $$("#sfad").hide();

//        if(that.curSceneId == "3dc84a608e5c11e5a2e1e7f3b0ca3a39"){
//            $$("#sfad").show();
//            $$(".sceneUl").css("padding-bottom","35px");
//        }
//        else{
//            $$("#sfad").hide();
//        }
//
//        $$("#sfad").on("click",function(){
//            window.location.href = "http://m.fang.com/zt/wap/201511/etfzxzyyd.html?city=hz&m=home?source=jiajupr&utm_source=baibao";
//        });

        that.showLikeSceneInScene();
        that.showLikeGoodsInScene();
    },
    //场景页显示场景是否已经收藏
    showLikeSceneInScene : function (){
        var that = this;
        if(userObj.isExist()){
            that.getCollectScenes(function(list){
                var i = 0 ,len = list.length,flag = 0;
                for(;i<len;i++){
                    if(list[i]._id === that.curSceneId){
                        flag = 1;
                        break;
                    }
                }
                if(flag){
                    that.curSceneLike = 1;
                }
                that.showSceneLike(1);
            });
        }
    },
    //场景页显示单品是否已经被收藏
    showLikeGoodsInScene : function(call){
        var that = this;
        if(userObj.isExist()){
            that.getCollectGoods(function(list){
                var i = 0 ,len = list.length;
                var j = 0,lenj = that.curSceneGoodsList.length;
                var flag2 = 0,temp = null,num =1;
                for(;j<lenj;j++){
                    flag2 = 0;
                    temp = that.curSceneGoodsList[j];
                    for(i=0;i<len;i++){
                        //这里的_id实际是goodsGroupId,Id实际也是goodsGroupId
                        if(list[i].GoodsGroupId === temp._id){
                            flag2 = 1;
                            break;
                        }
                    }
                    if(!flag2){
                        num = parseInt($$("#testZanSpan_" + j).html()) - 1 ;
                        $$("#testZanSpan_" + j).html(num);
                        $$("#testZanImg_" + j).attr("src","./img/923/nozan.png");
                    }
                    else{
                        num = parseInt($$("#testZanSpan_" + j).html()) + 1 ;
                        $$("#testZanSpan_" + j).html(num);
                        $$("#testZanImg_" + j).attr("src","./img/923/zan.png");
                        call && call();
                    }
                }
            });
        }
    },
    setCollectScenes : function(sceneId,flag,callback){
        if( userObj.isExist()){
//            hiApp.showIndicator();
            //flag == 1 ? 收藏 ：取消收藏
            util.getAjaxData({
                url: appConfig.COLLECTSCENES,
                data: {
                    userId: userObj.isExist(),
                    sceneId : sceneId ,
                    flag:flag
                },
                type: 'post',
                error: function (e) {
                    console.log(e);
//                    hiApp.hideIndicator();
                    return false;
                },
                success: function (json) {
                    console.log(json);
                    if (json) {
                        try {
                            var data = JSON.parse(json);
                            if (data.STATUSCODE === statusCode.SUCCESS) {
                                callback();
                            }
//                            hiApp.hideIndicator();
                        } catch (e) {
//                            hiApp.hideIndicator();
                        }
                    }
                }
            });
        }
        else{
            hiApp.alert("亲，请先登录~",function(){
                mainView.router.loadPage("page/login.html");
            });
        }
    },
    setCollectGoods : function(goodsGroupId,flag,callback){
        if(userObj.isExist()){
            //flag == 1 ? 收藏 ：取消收藏
            //data中的goodsId字段实际上传输的是goodsGroupId
            util.getAjaxData({
                url: appConfig.COLLECTGOODS,
                data: {
                    userId: userObj.isExist(),
                    goodsGroupId : goodsGroupId,
                    flag:flag
                },
                type: 'post',
                error: function (e) {
                    console.log(e);
//                    hiApp.hideIndicator();
                    return false;
                },
                success: function (json) {
                    console.log(json);
                    if (json) {
                        try {
                            var data = JSON.parse(json);
                            if (data.STATUSCODE === statusCode.SUCCESS) {
                                callback();

                            }
                        } catch (e) {
                        }
                    }
                }
            });
        }
        else{
            hiApp.alert("亲，请先登录~",function(){
                mainView.router.loadPage("page/login.html");
            });
        }
    },
    getCollectScenes : function(callback){
//        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.GETCOLLECTSCENE,
            data: {
                userId: userObj.isExist()
            },
            type: 'post',
            error: function (e) {
                console.log(e);
//                hiApp.hideIndicator();
                return false;
            },
            success: function (json) {
                if (json) {
                    try {
                        var data = JSON.parse(json);
                        if (data.STATUSCODE === statusCode.SUCCESS) {
                            callback(data.DATA);
                        }
                        else{
                            callback([]);
                        }
//                        hiApp.hideIndicator();
                    } catch (e) {
//                        hiApp.hideIndicator();
                    }
                }
            }
        });
    },
    getCollectGoods:function(callback){
        util.getAjaxData({
            url: appConfig.GETCOLLECTGOODS,
            data: {
                userId: userObj.isExist()
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
                        if (data.STATUSCODE === statusCode.SUCCESS) {
                            callback(data.DATA);
                        }
                        else{
                            callback([]);
                        }
                    } catch (e) {
                    }
                }
            }
        });
    }
}
