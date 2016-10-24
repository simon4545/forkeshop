/**
 * Created by Administrator on 15-5-5.
 */

//app 属性
var app_name = "application-name";
var app_version = "5.6.6";
var app_type = "web";
//var appBaseUrl = "http://124.42.118.42:3002/api/v3/";
//var appBaseUrl = "http://119.254.102.75:3002/api/v3/";
//var appBaseUrl = "http://192.168.1.117:3002/api/v3/";
var appBaseUrl = "http://127.0.0.1:3002/api/v3/";
//渠道推广号(仅限app)
var app_channelNum;

var appConfig = {
    //场景列表(头部)
    SCENES_LISTHEAD : appBaseUrl + "scenes/scenesList",
    //图片轮播
    MAINLOOPERAD_URL: appBaseUrl + "scenes/mainLoopAdsList",
    //场景详情
    SCENES_DETAIL : appBaseUrl + "scenes/scenesInfo",
    //获取产品详细信息--detail
    DETAIL_GOODSDETAILINFO: appBaseUrl + "goods/goodsinfo",
    //商品通用广告
    GODDS_EXAD_URL : appBaseUrl + "goods/normalAds",
    //登录
    GOLOGIN_URL: appBaseUrl + "user/login/bbx",
    //获取手机验证码
    GETMOBILECODE_URL: appBaseUrl + "user/validcode",
    //密码修正
    RESETPWD_URL: appBaseUrl + "user/resetPassword",
    //密码重置
    FORGOTPWD_URL: appBaseUrl + "user/findPassword",
    //获取收藏单品
    GETCOLLECTGOODS : appBaseUrl + "goods/getFavoriteGoods",
    //收藏单品
    COLLECTGOODS : appBaseUrl + "goods/setFavoriteGoods",
    //获取购物车内商品列表(新v1-1)
    GETCARTLIST: appBaseUrl + "cart/cartList",
    //加入购物车
    CHANGECART: appBaseUrl + 'cart/change_cart',
    //删除购物车内单个商品
    DELETECARTONE: appBaseUrl + "cart/delGoods",
    //获取全部优惠券列表
    GETALLCOUPONLIST: appBaseUrl + "coupon/allcouponlist",
    //获取用户地址列表
    GETADDRESSLIST: appBaseUrl + "consignee/list",
    //更新用户地址
    UPDATEADDRESS: appBaseUrl + "consignee/update",
    //添加用户地址返回id
    ADDADDRESS: appBaseUrl + "consignee/add",
    //删除用户地址
    DELETEADDRESS: appBaseUrl + "consignee/del",
    //获取订单列表
    GETORDERSLIST_URL: appBaseUrl + "order/list",
    //获取可用的优惠券列表（新）订单确认使用
    GETCOUPON_NEW: appBaseUrl + "order/coupon",
    ORDERTAIL_URL: appBaseUrl +  'order/detail',
    //验证手机号是否已经注册
    CHECKMIBILE_URL: appBaseUrl + "user/mobileisexist",
    //提交注册
    TORIGISTER_URL: appBaseUrl + "user/reg",

    //错误日志--用于ajax失败提交错误日志　TODO NO API
    WRONGAJAXLOG_URL: appBaseUrl + "logger/record",
    //商品定制广告 TODO　ｗｈｙ　？　ｗｈｅｒｅ？
    TOP_ADV_URL: appBaseUrl + "goods/specialAds",
    //是否显示红包入口 TODO NO API  return
    ISSHOWRAFFLEIMPORT_URL: appBaseUrl +  "coupon/show_raffle",
    //获取产品轮播缩略图　TODO Has Been Commented
    DETAIL_THUMBNAILSLIDE: appBaseUrl + "goods/imagelist",
    //获取产品详情信息展示缩略图 TODO Has Been Commented
    DETAIL_THUMBNAILLIST_URL: appBaseUrl + "goods/detail",
    //批量同步购物车(新v1-1) TODO　NO API
    BATCHCHANGECART_URL_1: appBaseUrl + "cart/change_cart_batch",


    //联合登录
    crossLogin : appBaseUrl + "user/oauth/app/token",
    LOGINBIND : appBaseUrl + "api3/auth/bindUserOauth",


    //获取用户信息
    USERINFO : appBaseUrl + "api/v1/user/info",


    //获取产品颜色和尺码列表
    GROUPFILTERCONFIG_URL: appBaseUrl + "goods/filterconfig",
    //颜色和尺码与商品id绑定
    ACTIONGOODS4GOODSGROUPLIST_URL: appBaseUrl + "action/goodsgrouplist",



    //提交订单
    COMMITORDER: appBaseUrl + "order/commit",
    COMMITORDER_1: appBaseUrl + "order/commit",

    //取消订单
    CANCELORDER_URL: appBaseUrl + "order/cancel",
    //確認訂單
    CONFIRMGOODS: appBaseUrl + "order/confirmgoods",
    //刪除訂單
    DELETEORDER :  appBaseUrl +  "order/del",
    //待配货状态下退货
    REBACKON2 : appBaseUrl + "order/refund/",
    //待签收和已完成状态下提交退款申请
    REBACKON9 : appBaseUrl + "aftersale/create",
    //退货单详情
    REBACKDETAIL : appBaseUrl + "aftersale/detail",
    //撤回退货单
    REBACKCANCEL : appBaseUrl + "aftersale/cancel",
    //提交退款寄回记录
    REBACKADDRESS : appBaseUrl + "aftersale/returngoods",
    //上传图片
    UPLOAD: appBaseUrl + "uploadFile/img",
    //退货说明
    REBACKDESC : appBaseUrl + "saleAfter/refundDesc",
    //退货信息
    REBACKINFO : appBaseUrl + "saleAfter/refundInfo",
    //催单
    REMINDERORDER : appBaseUrl + "aftersale/reminder",
    //获取专场列表
    GETBRANDLIST_URL: appBaseUrl + 'getbrandlist',
    //去支付
    NEW_GOPAY_URL: appBaseUrl + 'order/gopay',
    //去支付-app
    APP_GOPAY_URL: appBaseUrl + 'order/appweixin/gopay',

    //保存用户信息
    SAVE_NICKNAME: appBaseUrl + 'user/update',
    //用户头像上传
    UPLOAD_PICTURE: appBaseUrl + "user/face",
    //获取离线版本购物车信息
    GET_CART_OFF_INFO : appBaseUrl + "cart/offline",

    //订单详情
    EXPRESSINFO_GET : appBaseUrl + 'getKuaidi',

    //商品精选---特卖首页
    CHOSELIST_URL: appBaseUrl + "goods/chosen",
    //获取分类信息--分类页接口
    GETCATEGORYGOODSLIST_URL: appBaseUrl + 'goods/goodsSift',
    //联合登录
    CROSSLOGIN_URL : appBaseUrl + "api/v1/user/oauth/weixin?otype={0}&backurl={1}",
    //获取最新版本地址
    CHECKUPDATE_URL : appBaseUrl + "api/v1/app/checkupdate",
    //是否拥有抽奖机会
    ISHASCHANCE_URL :appBaseUrl + "api/v1.1/coupon/raffle",
    //抽奖结果
    RAFFLERESULT_URL : appBaseUrl + "api/v1.1/coupon/get_raffle",
    //根据优惠券金额获取推荐商品
    GETRECOMMENDGOODS_URL : appBaseUrl + "api/v1.1/goods/recommend",
    //获取推荐keys
    GETRECOMMENDKEYS_URL: appBaseUrl +  "api/v2/search/recommendSearchKeys",
    //获取搜索场景结果列表
    GETSEARCHINGSCENES_URL : appBaseUrl + "api/v2/search/searchScenes",
    //判断当前用户是否是新人且是否领取了优惠券
    ISNEWSRECEIVE_URL: appBaseUrl + "api/v1.1/coupon/is_new_member",
    //新人领券
    NEWSRECEIVE_URL : appBaseUrl + "api/v1.1/coupon/get_new_member_coupon",
    //通过邀请码领取优惠券
    USEINCODEGETCOUPON: appBaseUrl + "api/v2/checkInCodeValid/"
};

var statusCode = {
    SUCCESS: 200
};

var oneYuan =["e5b893a0928611e5b2ed3b20ca4f8b04","5f6a3aa08de611e5aba8759f2fa60c2a","1102b8108deb11e5aba8759f2fa60c2a","4a6fcb208f3411e58420793d6aca0e40"];