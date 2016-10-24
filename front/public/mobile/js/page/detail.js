/**
 * Created by Administrator on 15-4-25.
 */

var detailObj = {
    /**
     * 注意后面的空格
     */
    page: '.detail-page ',
    GOODSGROUPINFO: null,
    GOODSLIST: null,
    FILTERCONFIG: null,
    init: function (query) {
        var that = this;
        that.bindEvent(query);
        that.getAllInfo(query);
        that.showLikeGoods(query);
    },
    initData: function (query) {
        var that = this;
        //这里获取购物车的剩余时间和数量
        that.setCart();
        //分享按钮是否显示
        if (app_type == 'app') {
            $$(that.page + ".share-icon").css('display', 'flex');
        }
    },
    setCart: function () {
        var that = this;
        shoppingCartObj2.getGoodsNumAndTime(function (data) {
            if (data) {
                if (data.OUTTIME && data.OUTTIME > 0) {
                    util.diffTimer(data.OUTTIME, "", $$(that.page + '.cart-time .B_Second'), $$(that.page + '.cart-time .B_Minute'));
                    $$(that.page + ".cart-time").css('display', 'inline-block');
                    $$(that.page + '.mark-time').css('display', 'inline-block');
                    setTimeout(function () {
                        $$(that.page + '.mark-time').hide();
                    }, 5000);
                } else {
                    $$(that.page + '.cart-time').hide();
                    $$(that.page + '.mark-time').hide();
                }
                if (data.NUM)
                    $$(that.page + ".cart-num").html(data.NUM);
                else
                    $$(that.page + ".cart-num").html(0);
            }
        });
    },
    bindEvent: function (request) {

        var that = this, infiniteTime = 0;
        //监听mask点击，关闭颜色尺码选择框
        bindTapEvent(that.page, that.page + "#popup-mask", function () {
            $$(that.page + ".color-size-box").css({
                'transform': 'translate3d(0, 0, 0)',
                '-webkit-transform': 'translate3d(0, 0, 0)'
            });
            $$(that.page + ".popup-btn").hide();
            $$(that.page + "#popup-mask").hide();
        });

        //弹出购物车popUp
        bindTapEvent(that.page, that.page + ".addcart", function (_this) {
            $$(that.page + ".color-size-box").css({
                'transform': 'translate3d(0, -400px, 0)',
                '-webkit-transform': 'translate3d(0, -400px, 0)'
            });
            $$(that.page + ".popup-btn").show();
            $$(that.page + ".gopay").attr('click-to', 'addcart');
            if ($$(that.page + ".gopay").attr('isable') != 0)
                $$(that.page + ".gopay").html("加购物车");
            $$(that.page + "#popup-mask").show();
        });

        //商品数量+1
        bindTapEvent(that.page, that.page + ".add-btn", function (_this) {
            $$(that.page + ".num-info .btn").addClass('btn-l');
            var num = $$(that.page + ".good-num").html();
            var maxcount = parseInt($$(that.page + ".color-size-box").find(".des-info .count font").html());
            if (parseInt(num) < parseInt(maxcount))
                num++;
            else {
                $$(_this).removeClass('btn-l');
                hiApp.alert("该商品最多只能购买" + maxcount + "件");
            }

            $$(that.page + ".good-num").html(num);
        });

        //商品数量-1
        bindTapEvent(that.page, that.page + ".min-btn", function (_this) {
            $$(that.page + ".num-info .btn").addClass('btn-l');
            var num = $$(that.page + ".good-num").html();
            if (parseInt(num) >= 2) num--;
            else {
                $$(_this).removeClass('btn-l');
                return;
            }
            $$(that.page + ".good-num").html(num);
        });

        //弹出立即购买popUp
        bindTapEvent(that.page, that.page + ".buynow", function (_this) {
            $$(that.page + ".color-size-box").css({
                'transform': 'translate3d(0, -400px, 0)',
                '-webkit-transform': 'translate3d(0, -400px, 0)'
            });
            $$(that.page + ".popup-btn").show();
            $$(that.page + ".gopay").attr('click-to', 'pay');
            if ($$(that.page + ".gopay").attr('isable') != 0)
                $$(that.page + ".gopay").html("付款");
            $$(that.page + "#popup-mask").show();
        });

        //去付款
        bindTapEvent(that.page, that.page + ".gopay", function (_this) {
            if ($$(_this).attr('isable') != 0) {
                if ($$(that.page + '.color-info .select-item-s').length == 0 || $$(that.page + '.size-info .select-item-s').length == 0) {
                    hiApp.alert('颜色、尺码不能不为空');
                    return;
                }
                var request = util.getRequest();
                that.setConfigBindId(request, $$(that.page + ".gopay").attr('click-to'));
                $$(that.page + ".color-size-box").css({
                    'transform': 'translate3d(0, 0, 0)',
                    '-webkit-transform': 'translate3d(0, 0, 0)'
                });
                $$(that.page + ".popup-btn").hide();
                $$(that.page + "#popup-mask").hide();
            }
        });

        //关闭颜色尺码选择框（popUp）
        bindTapEvent(that.page, that.page + ".close", function (_this) {
            $$(that.page + ".color-size-box").css({
                'transform': 'translate3d(0, 0, 0)',
                '-webkit-transform': 'translate3d(0, 0, 0)'
            });
            $$(that.page + ".popup-btn").hide();
            $$(that.page + "#popup-mask").hide();
        });

        //颜色选择
        bindTapEvent(that.page, that.page + ".color-info .select-item", function (_this) {
            $$(that.page + ".color-info .select-item").removeClass('select-item-s');
            $$(_this).addClass('select-item-s');
            var request = util.getRequest();
            that.setConfigBindId(request, 'change');
        });

        //尺码选择
        bindTapEvent(that.page, that.page + ".size-info .select-item", function (_this) {
            $$(that.page + ".size-info .select-item").removeClass('select-item-s');
            $$(_this).addClass('select-item-s');
            var request = util.getRequest();
            that.setConfigBindId(request, 'change');
        });

        // 注册'infinite'事件处理函数
        $$(document).on('infinite', that.page + '.infinite-scroll', function (e) {
            infiniteTime++;
            if (infiniteTime == 2) {
                infiniteTime = 0;
                e.stopPropagation();
                return false;
            }
            $$(that.page + ".detail-info-tag").hide();
            $$(that.page + ".detail-thumnailList").show();
        });

        // 弹出颜色尺码选择框--默认响应加入购物车
        bindTapEvent(that.page, that.page + "#go-select-btn", function () {
            $$(that.page + ".color-size-box").css({
                'transform': 'translate3d(0, -400px, 0)',
                '-webkit-transform': 'translate3d(0, -400px, 0)'
            });
            $$(that.page + ".popup-btn").show();
            $$(that.page + ".gopay").attr('click-to', 'addcart');
            if ($$(that.page + ".gopay").attr('isable') != 0)
                $$(that.page + ".gopay").html("加购物车");
            $$(that.page + "#popup-mask").show();
        });


        //在每个页面监听滚动条事件
        var interVal = null, lastY;
        $$(that.page + ".page-content").on('scroll', function (e) {
            var _this = this;
            if (interVal == null)// 未发起时，启动定时器，1秒1执行
                interVal = setInterval(function () {
                    if (lastY == $$(_this).scrollTop()) {
                        _onScroll(_this, that.page);
                        clearInterval(interVal);
                        interVal = null;
                    }
                }, 10);
            lastY = $$(_this).scrollTop();
        });


        //收藏单品
        bindTapEvent(that.page, '.testZan', function (_this, e) {
            var groupId = request.groupId;
            console.log(groupId);
            var flag = $$(that.page + ".testZanImg").attr("src") === "./img/923/nozan.png" ? 1 : 0;
            scenesObj.setCollectGoods(groupId, flag, function () {
                that.showLikeGoods(request, function () {
                    if (flag === 1 && userObj.isExist()) {
                        $$(_this).find('img').addClass('active');
                        setTimeout(function () {
                            $$(_this).find('img').removeClass('active');
                            $$(".show-collect-dialog").addClass("active");
                            setTimeout(function () {
                                $$(".show-collect-dialog").removeClass('active');
                            }, 1500);
                        }, 1000);
                    }
                });
            });
            e.stopPropagation();
            e.preventDefault();
            return false;
        });

    },
    showLikeGoods: function (requst, callback) {
        var that = this;
        var likeNum;
        if (userObj.isExist()) {
            scenesObj.getCollectGoods(function (list) {
                console.log(list);
                var i = 0, len = list.length;
                var flag = 0, num = 1;
                for (i = 0; i < len; i++) {
                    if (list[i].GoodsGroupId == requst.groupId) {
                        flag = 1;
                        break;
                    }
                }
                if (!flag) {
                    likeNum = parseInt($$(that.page + ".testZanSpan").html());
                    if (likeNum == 0) likeNum = 258;
                    num = likeNum - 1;
                    $$(that.page + ".testZanImg").attr("src", "./img/923/nozan.png");
                    $$(that.page + ".testZanSpan").html(num);
                } else {
                    likeNum = parseInt($$(that.page + ".testZanSpan").html());
                    if (likeNum == 0) likeNum = 258;
                    num = likeNum + 1;
                    $$(that.page + ".testZanImg").attr("src", "./img/923/zan.png");
                    $$(that.page + ".testZanSpan").html(num);
                    callback && callback();
                }
            });
        }
    },
    getAllInfo: function (request) {
        var that = this;
        util.getAjaxData({
            url: appConfig.DETAIL_GOODSDETAILINFO,
            type: 'post',
            data: {
                goodsGroupId: request.groupId
            },
            error: function () {
                return false;
            },
            success: function (jsonStr) {
                var json = JSON.parse(jsonStr);
                if (json.STATUSCODE == 200) {
                    try {
                        var All = json.DATA;
                        that.GOODSGROUPINFO = All.GOODSGROUPINFO;
                        that.GOODSLIST = All.GOODSLIST;
                        that.FILTERCONFIG = All.FILTERCONFIG;
                        that.imgList = All.IMGLIST;
                        that.GOODSGROUPDETAIL=All.GOODSGROUPDETAIL;
                        //设置商品信息
                        that.setDetailInfo(that.GOODSGROUPINFO, request);
                        that.setDetailThumbnailSlide(that.imgList);
                        setTimeout(function () {
                            //设置产品详细描述
                            that.setDetailThumnailList(that.GOODSGROUPDETAIL);
                        }, 100);
                    } catch (e) {

                    }
                }
            }
        });
    },
    setDetailInfo: function (GOODSGROUPINFO, request) {
        var that = this;
        var dContainer = $$("#gooddetailbox"),
            gooddetailtemplate = $$("#detailinfotemplate").html(),
            _gooddetailtemplate, endTime, color_sizeBox = $$(that.page + " .color-size-box");
        if (GOODSGROUPINFO) {
            $$(that.page + " #groupIdBox").val(request.groupId);
            //设置颜色、尺码列表
            that.setSizeAndColor();
            //设置轮播图片

            console.log(GOODSGROUPINFO);
            //设置点赞数
          //  $$(that.page + ".testZanSpan").html(GOODSGROUPINFO.COLLECTIONNUM);

         //   endTime = GOODSGROUPINFO.ACTIONFINISHTIME.replace(/-/g, "/");
            $$(that.page + ".good-title").html(GOODSGROUPINFO.GOODSGROUPTITLE || GOODSGROUPINFO.GOODSTITLE || "暂无标题");
            //这里展示满减信息
            if (GOODSGROUPINFO.DISCOUNTTITLE) {
                $$(that.page + ".discount-title").html(GOODSGROUPINFO.DISCOUNTTITLE);
                $$(that.page + ".good-jian").css('display', '');
            } else {
                // $$(that.page + "#good-flag-con").addClass('last');
            }

            //这里设置价格、折扣、以及结束时间
            _gooddetailtemplate = gooddetailtemplate.replace('{GOODSPRICE}', GOODSGROUPINFO.GOODSPRICE)
                .replace('{GOODSSALEPRICE}', GOODSGROUPINFO.GOODSSALEPRICE)
                .replace('{GOODSDISCOUNT}', GOODSGROUPINFO.GOODSDISCOUNT)
                .replace('{dateEndTime}', GOODSGROUPINFO.ACTIONFINISHTIME);
            dContainer.html(_gooddetailtemplate);

            //设置颜色尺码选择框内的标题、价格、库存
            color_sizeBox.find(".des-info .title").html(GOODSGROUPINFO.GOODSGROUPTITLE || GOODSGROUPINFO.GOODSTITLE || "暂无标题");
            color_sizeBox.find(".des-info .price").html("¥" + GOODSGROUPINFO.GOODSSALEPRICE);
            color_sizeBox.find(".des-info .count font").html(GOODSGROUPINFO.MAXCOUNT);
            //这里是设置倒计时器
            if (endTime) {
                var startTime = new Date();
                util.timer({
                    starTime: startTime,
                    endTime: endTime,
                    timerEnd: function (ele) {
                    }
                }, $$(that.page + '.s_time'));
            }
            //根据库存判断是否售罄
            if (parseInt(GOODSGROUPINFO.MAXCOUNT) <= 0) {
                $$(that.page + ".gopay").attr('isable', 0).html("已售罄").css('background', 'rgb(208,208,208)');
            }
            if (GOODSGROUPINFO.ISPREPARE == 1) {
                $$(that.page + ".gopay").attr('isable', 0).html("即将开售").css('background', 'rgb(208,208,208)');
            }
            if (GOODSGROUPINFO.ISOFFLINE == 1) {
                $$(that.page + ".gopay").attr('isable', 0).html("已过期").css('background', 'rgb(208,208,208)');
            }
            if (parseInt(GOODSGROUPINFO.ISONSALE) == 0) {
                $$(that.page + ".gopay").attr('isable', 0).html("已下架").css('background', 'rgb(208,208,208)');
            }

        } else {
            hiApp.alert("该商品已不复存在~", function () {
                mainView.router.loadPage("page/index.html");
                return;
            });
        }
    },
    /**
     * 详情页面缩略图slide
     */
    setDetailThumbnailSlide: function (slideData) {
        var that = this;
       // var slideData = JSON.parse(json);
        util.swiperSlide(that.page, slideData);
        if (slideData[0] && slideData[0].GOODSIMGPATH)
            $$(that.page + " .color-size-box").find(".imgbox img").attr('src', slideData[0].GOODSIMGPATH);
        return;
        var that = this;
        hiApp.showIndicator();
        util.getAjaxData({
            url: appConfig.DETAIL_THUMBNAILSLIDE,
            type: 'post',
            data: {
                goodsgroupid: detailInfo.GOODSGROUPID
            },
            error: function () {
                hiApp.hideIndicator();
                return false;
            },
            success: function (json) {
                hiApp.hideIndicator();
                if (json) {
                    try {
                        var slideData = JSON.parse(json);
                        util.swiperSlide(that.page, slideData);
                        if (slideData[0] && slideData[0].GOODSIMGPATH)
                            $$(that.page + " .color-size-box").find(".imgbox img").attr('src', slideData[0].GOODSIMGPATH);
                    } catch (e) {

                    }
                }
            }
        });
    },
    setSizeAndColor: function () {
        var that = this;
        var colorBox = $$(that.page + ".color-info"),
            sizeBox = $$(that.page + ".size-info"),
            FILTERCONFIG;

        colorBox.html('<div class="col-100 des-t">颜色</div>');
        sizeBox.html('<div class="col-100 des-t">尺码</div>');
        if (that.FILTERCONFIG) {
            try {
                if (that.GOODSGROUPINFO) {
                    FILTERCONFIG = that.GOODSGROUPINFO.FILTERCONFIG;
                }
                var sizeInfo = that.FILTERCONFIG, tempArr = [], template, _template, filterItem = "";
                if (FILTERCONFIG)
                    FILTERCONFIG = FILTERCONFIG.split(',');
                else
                    FILTERCONFIG = [];
                for (var i = 0; i < sizeInfo.length; i++) {
                    var tempData = sizeInfo[i];
                    if (FILTERCONFIG && FILTERCONFIG.length > 0)
                        filterItem = FILTERCONFIG[i];
                    if (!tempData) continue;
                    tempArr = tempData.GOODSFILTERCONFIG.split(',');
                    if (tempData.GOODSFILTERTITLE == "颜色") {
                        for (var j = 0; j < tempArr.length; j++) {
                            /*if ( filterItem == tempArr[j]) {
                             template = '<div class="select-item  select-item-s">{color}</div>';
                             } else {
                             template = '<div class="select-item">{color}</div>';
                             }*/
                            //取消默认颜色选择
                            template = '<div class="select-item">{color}</div>';
                            _template = template.replace('{color}', tempArr[j]);
                            colorBox.append(_template);
                        }
                    } else {
                        for (var j = 0; j < tempArr.length; j++) {
                            /*if (filterItem == tempArr[j]) {
                             template = '<div class="select-item select-item-s">{size}</div>';
                             } else {
                             template = '<div class="select-item">{size}</div>';
                             }*/
                            //取消默认尺码选择
                            template = '<div class="select-item">{size}</div>';
                            _template = template.replace('{size}', tempArr[j]);
                            sizeBox.append(_template);
                        }
                    }
                }
            } catch (e) {

            }
        }
    },
    setConfigBindId: function (request) {
        var that = this,
            colorChose = $$(that.page + ".color-info .select-item-s").html(),
            sizeChose = $$(that.page + ".size-info .select-item-s").html(),
            tempArr = [],
            arg = arguments,
            available = 0, clicktype;
        clicktype = $$(that.page + ".gopay").attr('click-to');
        if (!sizeChose || !colorChose) return;
        var groupList = that.GOODSLIST;
        if (!groupList)
            return;
        for (var i = 0; i < groupList.length; i++) {
            var groupItem = groupList[i];
            if (groupItem.FILTERCONFIG) tempArr = groupItem.FILTERCONFIG.split(',');
            if (( tempArr[0] == colorChose && tempArr[1] == sizeChose ) || (tempArr[1] == colorChose && tempArr[0] == sizeChose )) {
                available = 1;
                if (clicktype == 'pay') {
                    $$(that.page + ".gopay").attr('isable', 1).html("付款").css('background', 'rgb(255,216,0)');
                } else {
                    $$(that.page + ".gopay").attr('isable', 1).html("加购物车").css('background', 'rgb(255,216,0)');
                }
                console.log(groupItem);
                if (arg[1] && arg[1] == 'change') {
                    $$(that.page + ".sale-price font").html(groupItem.GOODSSALEPRICE + '&nbsp;');
                    $$(that.page + ".tag-price font").html(groupItem.GOODSPRICE + '&nbsp;');
                    $$(that.page + ".des-info .count font").html(groupItem.MAXCOUNT);
                    $$(that.page + ".color-size-box .price").html('¥' + groupItem.GOODSSALEPRICE);
                    $$(that.page + ".color-size-box .imgbox img").attr('src', groupItem.GOODSIMGPATH);
                    //已售罄
                    if (parseInt(groupItem.MAXCOUNT) <= 0) {
                        $$(that.page + ".gopay").attr('isable', 0).html("已售罄").css('background', 'rgb(208,208,208)');
                    }
                    //即将开售
                    if (groupItem.ISPREPARE == 1) {
                        $$(that.page + ".gopay").attr('isable', 0).html("即将开售").css('background', 'rgb(208,208,208)');
                    }
                    //已过期
                    if (groupItem.ISOFFLINE == 1) {
                        $$(that.page + ".gopay").attr('isable', 0).html("已过期").css('background', 'rgb(208,208,208)');
                    }
                    //已下架
                    if (parseInt(groupItem.ISONSALE) == 0) {
                        $$(that.page + ".gopay").attr('isable', 0).html("已下架").css('background', 'rgb(208,208,208)');
                    }

                } else {
                    if (clicktype == 'pay') {
                        that.setPriceAndPay(groupItem);
                    } else {
                        that.addCart(groupItem.ID);
                    }
                }
                return;
            }
        }
        if (available == 0) {
            $$(that.page + ".gopay").attr('isable', 0).html("已售罄").css('background', 'rgb(208,208,208)');
        }
    },
    /**
     * 立即购买
     * @param detailInfo
     */
    setPriceAndPay: function (detailInfo) {
        var that = this,
            num = $$(that.page + '.color-size-box .good-num').html(), goodsList = [], salePrice;
        var src = $$($$(that.page + ".swiper-slide")[0]).find('img').attr("src");
        var goodstitle = $$(that.page + ".good-title").html();
        var groupId = $$(that.page + " #groupIdBox").val();

        detailInfo.GOODSNUM = num || 1;
        detailInfo.GOODSIMGPATH = src || detailInfo.APPSHOPIMAGE;
        detailInfo.GOODSGROUPTITLE = goodstitle || "暂无标题";
        detailInfo.GOODSGROUPID = groupId;
        goodsList.push(detailInfo);

        salePrice = parseFloat(detailInfo.GOODSSALEPRICE).toFixed(2) * parseInt(num);
        util.setSessionStorage('orderlist', JSON.stringify(goodsList));
        util.setSessionStorage('orderlistprice', JSON.stringify(salePrice));

//        util.setLocalStorage('orderlist', JSON.stringify(goodsList));
//        util.setLocalStorage('orderlistprice', JSON.stringify(salePrice));

        mainView.router.loadPage('page/orderConfirm.html');
    },
    /**
     * 设置页面详情缩略图
     */
    setDetailThumnailList: function (detailInfo) {
        var that = this;
        var detail_thumbnailList = $$(that.page + ".detail-thumnailList .thumbnail-box");
        detailInfo = detailInfo.replace("<br>", "");
        detail_thumbnailList.html(detailInfo);
        var imageArr = $$(".detail-thumnailList img");
        for (var i = 0; i < imageArr.length; i++) {
            var imageItem = imageArr[i];
            $$(imageItem).css({
                'width': '100%',
                'height': 'auto'
            });
        }
        return;
        var that = this;
        var detail_thumbnailList = $$(that.page + ".detail-thumnailList .thumbnail-box");
        util.getAjaxData({
            url: appConfig.DETAIL_THUMBNAILLIST_URL,
            type: 'post',
            data: {
                goodsgroupid: detailInfo.GOODSGROUPID
            },
            error: function () {
                return false;
            },
            success: function (json) {
                if (json) {
                    try {
                        // json = json.replace(/\s*(style|width|height|class)=\".*?\"/ig, "");
                        json = json.replace("<br>", "");
                        detail_thumbnailList.html(json);
                        var imageArr = $$(".detail-thumnailList img");
                        for (var i = 0; i < imageArr.length; i++) {
                            var imageItem = imageArr[i];
                            $$(imageItem).css({
                                'width': '100%',
                                'height': 'auto'
                            });
                        }
                    } catch (e) {

                    }
                }
            }
        });
    },
    /**
     *加入购物车
     * @param goodsId
     */
    addCart: function (goodsId) {
        var that = this,
            num = $$(that.page + '.color-size-box .good-num').html(), localCart = [], errorMsg;
        if (userObj.isExist()) {
            try {
                var loginId = userObj.ID || 0;
                setTimeout(function () {
                    util.getAjaxData({
                        url: appConfig.CHANGECART,
                        type: 'post',
                        data: {
                            actiongoodsid: goodsId,
                            num: num || 1,
                            loginid: loginId
                        },
                        success: function (json) {
                            try {
                                var jsonObj = JSON.parse(json);
                                if (jsonObj.STATUSCODE == 200) {
                                    var data = jsonObj.DATA;
                                    var src = $$($$(that.page + ".swiper-slide")[0]).find('img').attr("src");
                                    $$(".animation_box").html('<img src="' + src + '">');
                                    $$(".animation_box").addClass('active');
                                    setTimeout(function () {
                                        $$(".animation_box").removeClass('active');
                                    }, 1000);
                                    $$(that.page + "#popup-mask").hide();
                                    that.setCart();
                                }
                                else {
                                    if (data && data.MSG) {
                                        errorMsg = data.MSG;
                                    }
                                    else {
                                        errorMsg = "库存不足";
                                    }
                                    hiApp.alert(errorMsg);
                                }
                            } catch (e) {
                            }
                        }
                    });
                }, 10);
            } catch (e) {

            }

        } else {
            try {
                var localCartInfo = "";
                if (app_type == 'web') {
                    localCartInfo = util.getCookie('localCart');
                } else {
                    localCartInfo = localStorage.getItem('localCart');
                }
                if (localCartInfo) {
                    var exsist = false, _num;
                    localCart = JSON.parse(localCartInfo);
                    for (var i = 0; i < localCart.length; i++) {
                        var Id = localCart[i].Id;
                        if (!Id) continue;
                        if (Id == goodsId) {
                            _num = parseInt(localCart[i].num);
                            _num += parseInt(num);
                            localCart[i].num = _num;
                            exsist = true;
                        }
                    }
                    if (!exsist) {
                        localCart.push({Id: goodsId || "", num: num || 1});
                    }
                } else {
                    localCart.push({Id: goodsId || "", num: num || 1});
                }
                if (app_type == 'web') {
                    util.setCookie('localCart', JSON.stringify(localCart), 1, null, "/", null);
                    util.setCookie('addCartTime', JSON.stringify(new Date().getTime()), 1, null, "/", null);
                } else {
                    util.setLocalStorage('localCart', JSON.stringify(localCart));
                    util.setLocalStorage('addCartTime', JSON.stringify(new Date().getTime()));
                }
                var src = $$($$(that.page + ".swiper-slide")[0]).find('img').attr("src");
                $$(".animation_box").html('<img src="' + src + '">');
                $$(".animation_box").addClass('active');
                setTimeout(function () {
                    $$(".animation_box").removeClass('active');
                }, 1000);
                $$(that.page + "#popup-mask").hide();
                that.setCart();
            } catch (e) {

            }
        }
    }

};











