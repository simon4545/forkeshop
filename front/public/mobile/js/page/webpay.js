/**
 * Created by Administrator on 15-7-13.
 */

var payObj = {
    creatOrder: function (data) {
        if (data) {
            if (!userObj.isExist()) return;
            var userId = userObj.ID ,postData,agentId,utf;
            //判断本地是否存有分销编号
            if(util.getCookie('agentId')){
                agentId = util.getCookie('agentId');
            }
            if(util.getCookie('utf'))
            {
                utf = util.getCookie('utf');
            }
            postData = [
                {name: 'loginId', value: userId},
                {name: 'goodsList', value: JSON.stringify(data.goodsList)},
                {name: 'consigneeId', value: data.consigneeid},
                {name: 'paytype', value: data.paytype},
                {name: 'couponid', value: data.couponid},
                {name: 'orderfrom', value: 'web'},
                {name: 'remark', value: data.remark},
                {name: 'agentId', value: agentId || "" },
                {name: 'utf', value: utf || ""}
            ];
            util.markForm(postData ,appConfig.COMMITORDER_1);
        }
    },
    getPayType: function () {
        var payType = "";
        if ($$("#paytype0").hasClass('selected')) {
            payType = '支付宝支付';
        } else if ($$("#paytype1").hasClass('selected')) {
            payType = '微信支付';
        }
        return payType;
    },
    goPay: function (orderDetail) {
        var loginid, orderid, paytype, postData;
        if (!orderDetail) return;
        else if( orderDetail.length >= 1)
            orderDetail = orderDetail[0];

        if (userObj.isExist()) {
            loginid = userObj.ID;
        } else {
            mainView.router.loadPage('page/login.html');
        }
        orderid = orderDetail.ID;
        paytype = orderDetail.ORDERPAYINFO;
        postData = [
            {name: 'loginId', value: loginid},
            {name: 'oid', value: orderid},
            {name: 'paytype', value: paytype}
        ];
        util.markForm(postData ,appConfig.NEW_GOPAY_URL);
    },
    webAlipay: function (orderDetail) {
    },
    webWeinxi: function (orderDetail) {
    }
};