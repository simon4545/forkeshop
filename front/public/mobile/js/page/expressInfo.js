var expressInfo = {
    expressCode: null,
    warptpl: "",
    liHeadTpl: "",
    liSTpl: "",
    init: function () {
        var that = this;
        that.warptpl = $$("#expressTpl").html();
        that.liHeadTpl = $$("#expressLi1Tpl").html();
        that.liSTpl = $$("#expressLisTpl").html();
    },
    show: function (queryObj) {
        var that = this;
        that.getData(queryObj,function(data){

            if (data && data.lastResult && data.lastResult.data && data.lastResult.data.length > 0) {
                that.showHtml(data.lastResult.data,queryObj.ename,queryObj.ecode);
            }
            else{
                that.showHtml([],queryObj.ename,queryObj.ecode);
            }
        });
    },
    showHtml: function (list,name,code) {

        var that = this;
        var html = "";
        if(list[0]){
            html += that.liHeadTpl.replace("{info}", list[0].context)
                .replace("{time}", list[0].ftime)

            if (list.length > 1) {
                for (var i = 1, len = list.length; i < len; i++) {
                    html += that.liSTpl.replace("{info}",list[i].context)
                        .replace("{time}", list[i].ftime)
                }
            }

            var htmls = that.warptpl.replace("{liHeadS}",html);

            $$("#expressListDiv").html(htmls).show();
            $$("#emptyExInfo").hide();
        }
        else{
            $$("#expressListDiv").hide();
            $$("#emptyExInfo").show();
        }

        $$("#expInfoName").html(name);
        $$("#expInfoCode").html("物流单号：" + code);
    },
    getData: function (obj,callback) {
        var oid = obj.oid,epinyin = obj.epinyin,ecode=obj.ecode;
        var that = this;
        util.getAjaxData({
            url: appConfig.EXPRESSINFO_GET,
            type: 'post',

            data: {
                company: epinyin,
                number: ecode,
                orderId : oid
            },
            error: function () {
                hiApp.hideIndicator();
                return false;
            },
            success: function (json) {
                var dataObj = JSON.parse(json);
                if(dataObj.code === statusCode.SUCCESS){
                    callback( JSON.parse(dataObj.msg));
                }
                else{
                    callback({});
                }
            }
        });
    }
}