var AppConfig={};

AppConfig.URL={
    UPLOAD:"/upload",
    UPLOAD_TO_BDBCE:"/upload_bdBce",
    GOODS_COLOR:"/goods/color",
    GOODS_CATEGORY:"/goods/category",
    GOODS_SIZE:"/goods/size",
    GOODS_LIST:"/goodsgroup/list",
    GOODS_EDIT:"/goodsgroup/edit",
    GOODS_CREATE:"/goodsgroup/create",
    GOODS_INFO:"/goodsgroup/info",
    GOODS_DELETE:"/goodsgroup/delete",
    IMPORT_GOODS_EXCEL:"/goods/import/goods_excel",
    USER_LIST:"/user/list",
    USER_CREATE:"/user/create",
    USER_EDIT:"/user/edit",
    USER_DELETE:"/user/delete",
    ORDER_QUERY:"/order/query",
    ORDER_DETAIL:"/order/detail",
    ORDERS_CHANGE_STATUS: "/order/change_status_batch",
    ORDERS_CHANGE_STATUS_BY_CODE: "/order/change_status_by_Code",
    SETREFUNDGOODS : "/order/setRefundGoods",
    ORDER_ADD_EXPRESS: "/order/add_express",
    AGENT_ACTION_LIST:"http://m.bbxvip.com/api/v1/action/todayactionslist",
    PUBLISH_ACTION_INFO_PAGE:"http://m.bbxvip.com/weixin/#!/page/activity.html",
    TAOBAO_GOODS_INFO:"http://m.bbxvip.com/activity/taobao_api/index.php",

    IMPORTEXPRESSFEE : "/uploadFile/expressFeeImport",
    IMPORTOUTSTOCK : "/uploadFile/outStockImport",
}

AppConfig.PAGING_CONFIG={
    pageSize:20,
    actionGoodsSize:500
}

var FLOW_STATE={
    "1":"未提交审核",
    "2":"审核中",
    "3":"审核通过",
    "4":"审核不通过",
    "5":"二次审核",
    "6":"二次审核不通过"
}

var ACCOUNT_TYPE={
    "1":"微信",
    "2":"支付宝"
}

var AGENT_ACTION_FILTER=["f40e407790e54e7ba7e825c34cf48d11","8f5996df7985437d8199663334093ec6"];

if(typeof module != "undefined"){
    module.exports = AppConfig;
}