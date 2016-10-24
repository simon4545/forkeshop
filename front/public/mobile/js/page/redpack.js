/**
 * Created by Administrator on 15-10-14.
 */
var redpackObj = {
    page:'.redpack-page ',
    isAlready:true,
    init:function(){
        var that = this;
        that.initData();
        that.bindEvent();
    },
    initData:function(){
      var that = this;
        that.setRecommendGoodsList("");
        that.hasRaffleChance();
        that.isNewsReceived();
        that.shareInit();
        return;
      that.activityStop(function(){
              that.setRecommendGoodsList("");
              that.hasRaffleChance();
          },  function(){
              $$(that.page + ".redpack-offline").show();
              $$(that.page + ".loading-mask-redpack").show();
          });

    },
    activityStop:function(start,stop){
        return ;
      var that = this;
      util.getAjaxData({
          url: appConfig.ISSHOWRAFFLEIMPORT_URL,
          success:function(json){
              try{
                if(json){
                    var data = JSON.parse(json);
                    if(data.ISSHOW){
                        start &&  start();
                    }else{
                        stop && stop();
                    }

                }else{
                    stop && stop();
                }
              }catch (e){

              }

          },
          error:function(err){
              stop && stop();
          }
      })
    },
    bindEvent:function(){
        var that = this;
//        var bounce = new Bounce();
        //点击开始抽奖
        bindTapEvent(that.page, that.page + ".pointer", function(_this){
       //     $$(that.page + ".loading-mask-redpack").show();
        //    $$(that.page + ".raffle-stop-dialog").show();
        //    return false;

            if(!that.isAlready) return;
            that.isAlready = false;
            util.writeAjaxLog("","","webLog",{userAction:'2-clickPointer'});
            //每次之前先清空数据
          //  mainView.refreshPage();
          //  that.getRaffle(bounce);
            //自己写的方法
            that.getRaffle("");

        });
        //点击查看
        bindTapEvent(that.page, that.page + ".view-btn", function(_this){
           that.isAlready =    true;
           $$(that.page + ".loading-mask-redpack").hide();
           $$(that.page + ".result-con-pop").hide();
           mainView.router.loadPage({
             url:"page/coupon.html"
           });
        });
        //点击消费
        bindTapEvent(that.page, that.page + ".use-btn ,.see-btn", function(_this){
            that.isAlready =    true;
            $$(that.page + ".loading-mask-redpack").hide();
            $$(that.page + ".pop-dialog").hide();
            var _offsetTop = $$(that.page + ".recommend-container")[0].offsetTop;
            console.log(_offsetTop);
            _scrollTop(_offsetTop-100,100);
        });

        //活动规则
        bindTapEvent(that.page, that.page + ".btn-rules", function(){
            $$(that.page + ".loading-mask-redpack").show();
            $$(that.page + ".vip_mask").show();
        });

        //关闭活动规则
        bindTapEvent(that.page, that.page + ".rules-close", function(){
            $$(that.page + ".loading-mask-redpack").hide();
            $$(that.page + ".vip_mask").hide();
        });

        //领取新人红包
        bindTapEvent(that.page, that.page + ".receive-btn", function(_this){
            if($$(_this).hasClass('active')){
                $$(that.page + ".receive-btn").removeClass("active");
                that.newsReceived();
            }else{
                hiApp.alert("亲，只有新人才有机会奥~","温馨提示",function(){

                });
            }
        });

        //关闭pop-dialog
        bindTapEvent(that.page, that.page + ".pop-dialog-close", function(_this){
            $$(that.page + ".loading-mask-redpack").hide();
            $$(that.page + ".pop-dialog").hide();
        });

        //立即分享
        bindTapEvent(that.page, that.page + ".share-btn", function(_this){
           $$(that.page + ".raffle-best-dialog").hide();
           $$(that.page + ".share-pop").show();
        });

        //查看更多
        bindTapEvent(that.page, that.page + ".view-more-btn", function(_this){
           mainView.router.loadPage("page/index.html");
        });


    },
    /**
     *从后台拉去抽奖结果
     * @param bounce
     * @param rotateEnd
     */
    getRaffle:function (bounce){
        var that = this;
        var num,text,coupon="",couponCode,couponName;
        var time = $$(that.page + "#raffle-times span").html();
        if(time==0) {
            $$(that.page + ".loading-mask-redpack").show();
            $$(that.page + ".no-raffle-dialog").show();
            that.isAlready =    true;
            return;
        }
        if(userObj.isExist()){
            util.getAjaxData({
                type: "POST",
                url: appConfig.RAFFLERESULT_URL,
                data: {
                    loginid:userObj.ID
                },
                error:function(){
                    that.isAlready =    true;
                    hiApp.alert("服务器开了会小差，请稍后再试~","温馨提示");
                },
                success: function(data){
                    that.hasRaffleChance();
                    if(data){
                        try{
                            var result =  JSON.parse(data);
                            console.log(result);
                            if(result.STATUSCODE == 200){
                                if(result.MSG){
                                   couponCode = result.MSG.COUPON_CODE;
                                   couponName = result.MSG.COUPON_NAME
                                }else{
                                    couponCode = '001';
                                }
                                switch (couponCode){
                                    case '001':
                                        num = 4;
                                        text = "好可惜，差一点就抓住奖品了~";
                                        coupon = "";
                                        break;
                                    case '002':
                                        //指针转
                                        // num = 1;
                                        //转盘转
                                        num = 1;
                                        text = couponName;
                                        coupon = 3;
                                        break;
                                    case '003':
                                        //指针转
                                        // num = 3;
                                        //转盘转
                                        num = 5;
                                        text = couponName;
                                        coupon = 8;
                                        break;
                                    case '004':
                                        //指针转
                                        //num = 5;
                                        //转盘转
                                        num = 3;
                                        text = couponName;
                                        coupon = 50;
                                        break;
                                    case '005':
                                        //指针转
                                        // num = 2;
                                        //转盘转
                                        num = 6;
                                        text = couponName;
                                        coupon = 18;
                                        break;
                                    case '006':
                                        //指针转
                                        //num = 6;
                                        //转盘转
                                        num = 2;
                                        text = couponName;
                                        coupon = 180;
                                        break;
                                    case '007':
                                        num = 7;
                                        text = couponName;
                                        coupon = 50;
                                        break;
                                    default :
                                        num = 4;
                                        text = couponName;
                                        coupon = "";
                                        break;
                                }
                            }else{
                                num =4;
                                coupon = "";
                                text = "好可惜，差一点就抓住奖品了~";
                            }
                            //num=0代表已经抽过奖了
                            if(num!=0){
                                 that.begin(num);
                                //设置3秒显示结果
                                setTimeout(function(){
                                    that.isAlready = true;
                                     if(num!=4){
                                         if(num==7){
                                             $$(that.page + ".loading-mask-redpack").show();
                                             $$(that.page + ".raffle-best-dialog").show();
                                         }else{
                                             $$(that.page +".show-text span").text(text);
                                             $$(that.page + ".loading-mask-redpack").show();
                                             $$(that.page + ".result-con-pop").show();
                                         }
                                         that.setRecommendGoodsList( coupon );
                                     }else{
                                         $$(that.page + ".loading-mask-redpack").show();
                                         $$(that.page + ".raffle-lost-dialog").show();
                                     }
                                 },3500);
                            }else{
                                that.isAlready = true;
                                $$(that.page + ".loading-mask-redpack").show();
                                $$(that.page + ".no-raffle-dialog").show();
                            }
                        }catch(e){

                        }

                    }
                }
            });
        }else{
            that.isAlready = true;
            hiApp.confirm("亲，请先登录~","温馨提示",function(){
                mainView.loadPage("page/login.html");
            },function(){
            });
        }
    },
    begin:function(numTemp){
        var that = this;
        $$(that.page + ".turnplate").css({
            animation:"redpack"+ numTemp +" 3s ease",
            "-webkit-animation": "redpack"+ numTemp +" 3s ease",
            "animation-fill-mode":"forwards",
            "-webkit-animation-fill-mode":"forwards",
            "transform-origin":"50% 50% 0",
            "-webkit-transform-origin":"50% 50% 0"
        });
    },
    /**
     * 插件
     * @param roateBegin
     * @param rotateEnd
     * @param during
     */
    beginBounce:function(bounce,rotateEnd,callback){
        var that = this;

        bounce.rotate({
            from: 0,
            to: rotateEnd
        }).applyTo(document.querySelectorAll(that.page +".turnplate"),{onComplete:function(){
                callback && callback();
            }});
       // bounce.remove();
    },
    /**
     * 开始转盘
     * @param roateBegin 开始角度
     * @param rotateEnd  结束角度
     * @param during  动画时间间隔
     */
    beginRotate:function(roateBegin, rotateEnd , during){
        var that = this,rotateTemp = 0;
        window._isEnd=0;
        if(roateBegin) rotateTemp = roateBegin;
        window._interval =  setInterval(function(){
            rotateTemp = rotateTemp + 10;
           /* if(rotateTemp%360==0 && _isEnd==1){
                clearInterval(_interval);
                that.beginLast();
            }*/
            //这里是等返回结果再转
            if(rotateTemp >= 360*6 && rotateTemp < rotateEnd){
                clearInterval(_interval);
                that.beginRotate(rotateTemp, rotateEnd, 30);
            }else if( rotateTemp >= rotateEnd){
                clearInterval(_interval);
            }
            $$(that.page+ ".pointer").css({
                transform:'rotate('+rotateTemp+'deg)',
                "transform-origin":"50% 60% 0",
                "-webkit-transform":'rotate('+rotateTemp+'deg)',
                "-webkit-transform-origin":"50% 60% 0"
            });
        },during);

    },
    /**
     * 考虑到网络会有延迟，于是设定先转动，然后再根据结果停止
     */
    beginLast:function(){
        var that = this,rotateTemp = 0;
        var numTemp =  parseInt(Math.random()*6)+1;
        var rotateEnd = 60 * numTemp;
        window._interval =  setInterval(function(){
            rotateTemp = rotateTemp+10;
            if( rotateTemp >= rotateEnd ){
                clearInterval(_interval);
            }
            $$(that.page+ ".pointer").css({
                transform:'rotate('+rotateTemp+'deg)',
                "transform-origin":"50% 60%",
                "-webkit-transform":'rotate('+rotateTemp+'deg)',
                "-webkit-transform-origin":"50% 60%"
            });
        },20);
    },
    /**
     * 设置推荐列表
     * @param request
     */
    setRecommendGoodsList : function(coupon) {
        var that = this;
        var activity_Box = $$(that.page+".goods-container"),
            activity_goods_Item =  $$("#goodsItemtemplate").html(),
            _activity_goods_Item,tempData,_href;
        activity_Box.html("");
        util.getAjaxData({
            url: appConfig.GETRECOMMENDGOODS_URL+"?coupon="+coupon||"",
            method: 'get',
            error: function () {
                return false;
            },
            success: function (json) {
                if (json) {
                    try {
                        var activityData = JSON.parse(json);
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
    },
    /**
     * 判断当前用户是否有机会抽奖
     */
    hasRaffleChance:function(callback){
        var that = this;
        $$(that.page + "#raffle-times span").html("0");
      //  return;
        if(userObj.isExist()){
            util.getAjaxData({
                type: "POST",
                url: appConfig.ISHASCHANCE_URL,
                data: {
                    loginid: userObj.ID
                },
                success: function(data){
                    if(data){
                        try{
                            var result =  JSON.parse(data);
                            console.log(result)
                            if(result.STATUSCODE == 200){
                                $$(that.page + "#raffle-times span").html(result.MSG);
                                if(parseInt(result.MSG)>0){
                                    callback && callback();
                                }

                            }
                            setTimeout(function(){
                                util.writeAjaxLog("","","webLog",{userType:result.MEMBERROLE});
                            },1000);
                        }catch(e){

                        }

                    }

                }
            });
        }else{
            util.writeAjaxLog("","","webLog",{userType: "游客"});
        }

    },
    isNewsReceived:function(){
        var that = this;
        if(userObj.isExist()){
            util.getAjaxData({
                url:appConfig.ISNEWSRECEIVE_URL + "?loginid=" + userObj.ID,
                success:function(json){
                    try{
                        if(json){
                            json = JSON.parse(json);
                            console.log(json);
                            if(json.STATUSCODE ==200){
                                $$(that.page + ".receive-btn").addClass("active");
                            }
                        }
                    }catch (e){

                    }
                }
            });
        }
    },
    newsReceived:function(){
        var that = this;
        if(userObj.isExist()){
            util.getAjaxData({
                url:appConfig.NEWSRECEIVE_URL + "?loginid=" + userObj.ID,
                success:function(json){
                    try{
                        if(json){
                            json = JSON.parse(json);
                            if(json.STATUSCODE ==200){
                                hiApp.alert("领取成功","温馨提示",function(){
                                    mainView.router.loadPage({
                                        url:"page/coupon.html"
                                    });
                                });
                            }else{
                                hiApp.alert("领取失败","温馨提示",function(){

                                });
                            }
                        }
                    }catch (e){

                    }
                }
            });
        }else{
            hiApp.alert("亲，您尚未登录~","温馨提示",function(){
                mainView.router.loadPage({
                    url:"page/login.html"
                });
            });
        }
    },
    shareInit:function(){
        var that = this;
        //这里重置shareUrl
        //如果分享自己的页面，则用myUserID
        var shareUrl = "http://m.bbxvip.com/weixin/#!/page/redpack.html";
        var shareTitle = '百宝香抽奖活动，惊现神秘大奖！抢抢抢！';
        var shareImgUrl = "http://mbbxvip.bj.bcebos.com/shenmi.png";
        //微信分享统计
        util.getAjaxData({
            url: 'http://webapp.bbxvip.com/api/v1/user/weixinjs',
            type: 'post',
            data: {
                url: location.origin + location.pathname
            },
            success: function (json) {
                if (json) {
                    try {
                        var data = JSON.parse(json);
                        console.log(data);
                        wx.config({
                            debug: false,
                            appId: data.appid,
                            timestamp: data.timestamp,
                            nonceStr: data.noncestr,
                            signature: data.signature,
                            jsApiList: [ 'onMenuShareTimeline', 'onMenuShareAppMessage']
                        });
                        wx.ready(function () {
                            wx.onMenuShareTimeline({
                                title: shareTitle, // 分享标题
                                desc: shareTitle, // 分享描述
                                link: shareUrl, // 分享链接
                                imgUrl: shareImgUrl, // 分享图标
                                type: '', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function () {
                                    // 用户确认分享后执行的回调函数
                                    $$(that.page + ".loading-mask-redpack").hide();
                                    $$(that.page + ".share-pop").hide();
                                    //alert("分享成功");
                                 //   $("#loading-mask").hide();
                                  //  $("#share-arrow").hide();

                                },
                                cancel: function () {
                                    $$(that.page + ".loading-mask-redpack").hide();
                                    $$(that.page + ".share-pop").hide();
                                    // 用户取消分享后执行的回调函数
                                    //alert("分享取消");
                                  //  window.location.href = "http://m.bbxvip.com/";
                                }
                            });
                            wx.onMenuShareAppMessage({
                                title: shareTitle, // 分享标题
                                desc: shareTitle, // 分享描述
                                link: shareUrl, // 分享链接
                                imgUrl: shareImgUrl, // 分享图标
                                type: '', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function () {
                                    // 用户确认分享后执行的回调函数
                                    $$(that.page + ".loading-mask-redpack").hide();
                                    $$(that.page + ".share-pop").hide();
                                    //alert("分享成功");
                                 //   $("#loading-mask").hide();
                                 //   $("#share-arrow").hide();

                                },
                                cancel: function () {
                                    $$(that.page + ".loading-mask-redpack").hide();
                                    $$(that.page + ".share-pop").hide();
                                    // 用户取消分享后执行的回调函数
                                    //alert("分享取消");
                                   // window.location.href = "http://m.bbxvip.com/";
                                }
                            });
                        });
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        });
    }
}