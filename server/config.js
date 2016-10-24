var DB_CONFIG;
//if (process.env.NODE_ENV == 'development') {
//    DB_CONFIG = require('./dbconfig_dev');
//} else if (process.env.NODE_ENV == 'production') {
//    DB_CONFIG = require('./dbconfig');
//}
DB_CONFIG = require('./dbconfig');
var AppConfig = {};

AppConfig.DB_CONFIG = DB_CONFIG;

AppConfig.OSS_CONFIG = {
    accessKeyId: "Sbyr9xoER6Ns5ZNp",
    secretAccessKey: "sQZdNqDiI2tsUllYGbqRSMCDO6KFsz",
    endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
    apiVersion: '2013-10-15'
};

AppConfig.BDBCE_CONFIG = {
    accessKeyId: "9bde49fb40514ea8bab0442a530f4589",
    secretAccessKey: "58e62c6548ec4a8f861fdfed8c8f8bef",
    endpoint: 'http://bj.bcebos.com',
    bucketName: "bbx-new-static"
};

AppConfig.PAGING_CONFIG = {
    pageSize: 20,
    actionGoodsSize: 500
};
AppConfig.FLOW_STATE = {
    "1": "未提交审核",
    "2": "审核中",
    "3": "审核通过",
    "4": "审核不通过"
}
AppConfig.GOODS_AUDIT_STATE = {
    "1": "未提交审核",
    "2": "审核中",
    "3": "审核通过",
    "4": "审核不通过",
    "5": "二次审核",
    "6": "二次审核不通过"
}
AppConfig.ORDER_CHANNEL = {
    'all': "全部",
    'alibaba': "阿里巴巴",
    'edb': "e店宝",
    'self': "自采",
    'merchant': "商家",
    'other': "其他"
};

AppConfig.ORDER_STATE = {
    1: "待付款",
    2: "待配货",
    3: "发货中",
    4: "待签收",
    5: "待退款",
    9: "交易成功",
    19: "已退款",
    99: "交易取消"
};

AppConfig.ACTION_STATE = {
    0: "即将上架",
    1: "最新上架",
    8: "已下架",
    9: "已作废",
    10: "筹划中"
};

AppConfig.ACTION_TYPE = {
    1: "品牌",
    2: "专场",
    3: "搭配"
};

AppConfig.ACTION_GOODS_SALE_STATE = {
    0: "未审核,不可售",
    1: "可售",
    2: "强制下架，不可售"
};

AppConfig.URL = {
    ALY_FILE_BASE_URL: "http://mbbxvip.oss-cn-hangzhou.aliyuncs.com/",
    BDBCE_FILE_BASE_URL: "http://bbx-new-static.bj.bcebos.com/",
    BDBCD_CDN_FILE_BASE_URL: "http://res1.bbxvip.com/"
};


AppConfig.AGENT = {
    Clear_Money_Standard: 100
};

AppConfig.RECOMMEND_SEARCH_KEY = ['暖宝宝', '亲子装', '美少女', '下雨天', '小公主', '潮我看', '韩系', '配饰', '牛仔', '米奇'];

AppConfig.PASS_AGENTID = ['565e6323e716e41b3c14f3b7','5630a4c9e716e40fbc82fb66'];

//顺序对应着编号类型，不可随意调
AppConfig.PUNISH = [
    [1,"超时发货",30],
    [2,"虚假发货",30],
    [3,"缺货漏发",20],
    [4,"质量问题",30],
    [5,"发错货",20],
    [6,"其他",10]
]

module.exports = AppConfig;
