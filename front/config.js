var DB_CONFIG;
if (process.env.NODE_ENV == 'development') {
   DB_CONFIG = require('./dbconfig_dev');
} else {
   DB_CONFIG = require('./dbconfig');
}
var AppConfig = {};

AppConfig.DB_CONFIG = DB_CONFIG;

AppConfig.OSS_CONFIG = {
    accessKeyId: "Sbyr9xoER6Ns5ZNp",
    secretAccessKey: "sQckNqDiI2tsUllYGbqRSMCDO6KFsz",
    endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
    apiVersion: '2013-10-15'
};

AppConfig.URL = {
    ALY_FILE_BASE_URL: "http://mbbxvip.oss-cn-hangzhou.aliyuncs.com/"
};


AppConfig.OrderState = {
    //待付款
    WAITING: 1,
    //待配货
    CHECKING: 2,
    //待发货
    READYING: 3,
    //待签收
    EXPRESSING: 4,
    //待退款
    REFUNDING: 5,
    //交易成功
    FINISH: 9,
    //已退款
    REFUNDED: 19,
    //交易取消
    CANCEL: 99
}

AppConfig.RefundState = {
    WAIT_SELLER_AGREE: 0,
    WAIT_BUYER_RETURN_GOODS: 1,
    WAIT_SELLER_CONFIRM_GOODS: 2,
    SUCCESS: 3,
    SELLER_REFUSE_BUYER: 4,
    CLOSED: 5
}
AppConfig.RefundStateInfo = {
    WAIT_SELLER_AGREE: "买家发起售后",
    WAIT_BUYER_RETURN_GOODS: "卖家同意售后，等待买家退货",
    WAIT_SELLER_CONFIRM_GOODS: "买家已退回货物，等待卖家确认",
    SUCCESS: "退款成功，售后完结",
    SELLER_REFUSE_BUYER: "卖家拒绝退款",
    CLOSED: "售后关闭"
}

AppConfig.RefundType = ['退款退货'];

AppConfig.ActionState = {
    WAIT : 0,
    ONLINE : 1,
    OFFLINE : 8,
    DISUSE : 9
}
AppConfig.ActionStateInfo = {
    WAIT : "即将上架",
    ONLINE : "最新上架",
    OFFLINE : "已下架",
    DISUSE : "已作废"
}

AppConfig.ActionGoodsSaleState = {
    OFFLINE : 0,
    ONLINE : 1
}

AppConfig.ActionGoodsSaleStateInfo = {
    OFFLINE : "下架",
    ONLINE : "上架"
}

AppConfig.GoodsTag = {
    'boy': 1,
    'girl': 2,
    'both': 0
};
AppConfig.GoodsLabel = {

};

AppConfig.CouponStatus = {
    TRUE: 1,
    FALSE: 0
}
module.exports = AppConfig;
