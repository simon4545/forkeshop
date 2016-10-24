
var actionList = [];

function getListData(){
    var def = $.Deferred();
    $.ajax({
        url:"http://m.bbxvip.com/spectacle/getSpectacleHead",
        type:"post",
        success:function(data){
            console.log(data);
            def.resolve(data.data);
        },
        error:function(){
            def.resolve([]);
        }
    });
    return def.promise();
}

function initActionListData(){
    getListData().done(function(data){

        for(var i= 0,len=data.length;i<len;i++){
           // if(data[i].spectacleState === 1){
                var div = $('<div class="col-xs-12">'+
                '<img class="subjectImg" actionIndex="'+data[i]._id+'" src="'+data[i].spectacleImage+'">'+
                '</div>');
                $("#actionListCon").append(div);
           // }
        }
    })
}

//function initActionList(){
//    for(var i=0;i<actionList.length;i++){
//        var div = $('<div class="col-xs-12">'+
//        '<img class="subjectImg" actionIndex="'+actionList[i]._id+'" src="'+actionList[i].actionImg+'">'+
//        '</div>');
//        $("#actionListCon").append(div);
//    }
//}

function bindCommands(){

    $("#actionListCon").on('click',".subjectImg",function(){
        window.location.href = "detail_t.html?actionIndex="+$(this).attr("actionIndex");
    });

    //$(".subjectImg").click(function(){
    //
    //});
}

function init(){
    //initActionList();
    initActionListData();
    bindCommands();
}


window.onload = function(){
    init();
}