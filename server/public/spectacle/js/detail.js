var actionIndex = 0;

function bindCommands() {
    $("#btnBackToHome").click(function () {
        window.location.href = "list.html";
    });

    $("#goodsPreviewCon").on("click", ".previewImg,.btnGoodsDetailBackImg", function () {
        window.location.href = $(this).attr("saleUrl");
    });
}

function init() {
    initData().done(function (data) {
        actionInfoArr = fomatData(data.data[0]);
        initActionInfo();
    });

    bindCommands();
}

function fomatData(data) {
    var obj2 = null, temp = null, list2 = [];
    for (var j = 0, lenj = data.spectacleGoodsList.length; j < lenj; j++) {
        temp = data.spectacleGoodsList[j];
        obj2 = {
            goodsImg: temp.imgPath,
            goodsTitle: temp.goodsTitle,
            saleUrl: temp.link,
            goodsPrice: temp.goodsPrice,
            goodsIntro: temp.goodsDesc,
            saleRate: temp.process,
            recommendStar: temp.recommendNum
        }
        list2.push(obj2);
    }
    return {
        subjectTitle: data.spectacleDesc,
        subjectImg: data.spectacleTopImage1,
        goodsInfo: list2
    }

}

function initData() {
    var def = $.Deferred();
    $.ajax({
        url: "http://m.bbxvip.com/spectacle/scenes_Info",
        type: "post",
        data: {
            _id: actionIndex
        },
        success: function (data) {
            console.log(data);
            def.resolve(data);
        },
        error: function () {
            def.resolve("");
        }
    });
    return def.promise();
}

function initActionInfo() {
    var actionInfo = actionInfoArr;
    $("#subjectTitle").text(actionInfo.subjectTitle);
    $("#subjectImg").attr("src", actionInfo.subjectImg);
    $("#goodsPreviewCon").empty();
    for (var i = 0; i < actionInfo.goodsInfo.length; i++) {
        var thisPageUrl = encodeURIComponent(window.location.href);
        var goodsPreviewDiv = $('<div class="goodsPreviewDiv" class="row">' +
        '<div class="col-xs-12 previewImgCon">' +
        '<img class="previewImg" saleUrl="' + actionInfo.goodsInfo[i].saleUrl + '&backUrl=' + thisPageUrl + '" src="' + actionInfo.goodsInfo[i].goodsImg + '">' +
        '</div>' +
        '<div class="row goodsBasicInfoCon">' +
        '<div class="col-xs-2 price">' +
        '<span class="goodsPrice">￥' + actionInfo.goodsInfo[i].goodsPrice + '</span>' +
        '</div>' +
        '<div class="col-xs-10">' +
        '<span class="goodsTitle">' + actionInfo.goodsInfo[i].goodsTitle + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="col-xs-8">' +
        '<p class="goodsIntro">' + actionInfo.goodsInfo[i].goodsIntro + '</p>' +
        '</div>' +
        '<div class="col-xs-4 btnGoodsDetailCon">' +
        '<img class="btnGoodsDetailBackImg" saleUrl="' + actionInfo.goodsInfo[i].saleUrl + '" src="../images/btnGoodsDetailBack.png">' +
        '</div>' +
        '<div class="col-xs-12">' +
        '<div class="saleRate">' +
        '<img class="saleRateBack" src="../images/saleRateBack.png"/>' +
        '<div class="saleRateDiv"></div>' +
        '<span style="padding-left: 5px">已售' + actionInfo.goodsInfo[i].saleRate + '%</span>' +
        '</div>' +
        '<div class="recommendStar">' +
        '<div class="starCon">' +
        '</div>' +
        '<div>必备指数:</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-xs-12 goodsInfoBottomImg">' +
        '<img src="../images/goodsInfoBottom.png">' +
        '</div>' +
        '</div>');
        var saleRatePercent = actionInfo.goodsInfo[i].saleRate * 0.29 + "%";
        goodsPreviewDiv.find(".saleRateDiv").css({width: saleRatePercent});
        var starCon = goodsPreviewDiv.find(".starCon");
        var redStarNum = actionInfo.goodsInfo[i].recommendStar;
        var grayStarNum = 5 - redStarNum;
        for (var red = 0; red < redStarNum; red++) {
            starCon.append('<img src="../images/redStar.png">');
        }
        for (var gray = 0; gray < grayStarNum; gray++) {
            starCon.append('<img src="../images/grayStar.png">');
        }
        $("#goodsPreviewCon").append(goodsPreviewDiv);
    }
}

function getRequestArg(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]);
    return null;
}

window.onload = function () {
    actionIndex = getRequestArg("actionIndex");
    if(actionIndex.length<4){
        window.location.href = "list.html";
    }
    init();
}