var PagingControl={};
PagingControl.curPageIndex=1;
PagingControl.totalPageNum=1;

/**
 * @param pageRefreshFunc 页面刷新方法
 */
PagingControl.init = function(pageRefreshFunc){
    var _self = this;

    $("#btnFirstPage").click(function(){
        pageRefreshFunc(1);
    });

    $("#btnLastPage").click(function(){
        pageRefreshFunc(_self.totalPageNum);
    });

    $("#btnPrePage").click(function(){
        if(_self.curPageIndex>1){
            pageRefreshFunc(_self.curPageIndex-1);
        }
    });

    $("#btnNextPage").click(function(){
        if(_self.curPageIndex<_self.totalPageNum){
            pageRefreshFunc(_self.curPageIndex+1);
        }
    });

    $("#pagingSelect").on("change",function(){
        var pageIndex = parseInt($(this).val());
        pageRefreshFunc(pageIndex);
    });
};

PagingControl.updatePagingControl = function(totalPageNum,curPageIndex){
    var _self = this;
    _self.totalPageNum=totalPageNum;
    _self.curPageIndex=curPageIndex;
    $("#totalPageNum").text(_self.totalPageNum);
    $("#pagingSelect").empty();
    for(var i=1;i<=_self.totalPageNum;i++){
        $("#pagingSelect").append('<option>'+i+'</option>');
    }
    $("#pagingSelect").val(_self.curPageIndex);
}


var Paganation=(function(host){
    function _Paganation(url,callback){
        var _self = this,uri=url;
        this.curPageIndex=1;
        this.totalPageNum=1;
        if(!arguments.length){
            uri=url=host.location;
            callback=null;
        }
        if(arguments.length===1){
            uri=url=host.location;
            callback=arguments[0];
        }
        if(url instanceof Location){
            url=url.search.replace('?','');
        }
        this.queryObj=common.GetRequest(url);
        $("#btnFirstPage").click(function(){
            callback&&callback(1,this.queryObj);
            host.location=uri.replace(url,$(this.queryObj).serialize());
        });

        $("#btnLastPage").click(function(){
            callback&&callback(_self.totalPageNum,this.queryObj);
            host.location=uri.replace(url,$(this.queryObj).serialize());
        });

        $("#btnPrePage").click(function(){
            if(_self.curPageIndex>1){
                callback&&callback(_self.curPageIndex-1,this.queryObj);
                host.location=uri.replace(url,$(this.queryObj).serialize());
            }
        });

        $("#btnNextPage").click(function(){
            if(_self.curPageIndex<_self.totalPageNum){
                callback&&callback(_self.curPageIndex+1,this.queryObj);
                host.location=uri.replace(url,$(this.queryObj).serialize());
            }
        });

        $("#pagingSelect").on("change",function(){
            var pageIndex = parseInt($(this).val());
            callback&&callback(pageIndex,this.queryObj);
            host.location=uri.replace(url,$(this.queryObj).serialize());
        });
    }
    return _Paganation;
})(window);