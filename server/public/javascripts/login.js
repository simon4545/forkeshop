function bindCommands(){
    $("#btnSubmit").click(function(){
        var username=$("#username").val();
        var password=$("#password").val();
        if(!username || !password){
            return;
        }
        var data={username:username, password:password};

        $.ajax({
            type: "POST",
            url: "login",
            data: data,
            dataType: "json",
            success: function(res){
                if(300 === res.status){
                    $(".alert-error").show();
                    $(".alert-error").find("span").html(res.msg);
                }else{
                    $(".alert-error").hide();
                    window.location.href = "homepage";
                }
            },
            error:function(err){
                console.error(err);
            }
        });
    })
}

bindCommands();