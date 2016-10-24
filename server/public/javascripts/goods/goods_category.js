
function bindCommands(){}

function getAndShowCategories(){
    getCategories().done(function(categories){
        if(categories){
            console.log(categories);
            showCategories(categories);
        }
    });
}

function getCategories(){
    var def = $.Deferred();
    $.ajax({
        url: AppConfig.URL.GOODS_CATEGORY,
        type: 'POST',
        data:{},
        success: function (res) {
            if (200 === res.code) {
                def.resolve(res.data);
            } else {
                def.resolve(null);
            }
        },
        error: function (err) {
            layer.alert("查询商品分类失败，请刷新页面重试。");
            def.resolve(null);
        }
    });
    return def.promise();
}

function showCategories(categories){
    $("#listTBody").empty();
    for(var i=0;i<categories.length;i++){
        var name = "";
        if(categories[i].parentId){
            name = "&nbsp"+categories[i].categoryName;
        }else{
            name = categories[i].categoryName+">";
        }

        var tr = $('<tr>'+
            '<td>'+(i+1)+'</td>'+
            '<td>'+name+'</td>'+
            '</tr>');
        $("#listTBody").append(tr);
    }
}

function init(){
    getAndShowCategories();
    bindCommands();
}

window.onload = init();