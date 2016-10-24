/**
 * Created by Administrator on 2015/7/30.
 */
/**
 * 商家商品数据对接
 *
 */
$(function () {
    exportGoodsImg.bindEvents();
});

var exportGoodsImg = {
    bindEvents: function () {
        $("#inputFile_groupImg").on('change', function () {
            var loadId = layer.load();
            //这里往云端传图片后获取到一个地址
            exportGoodsImg.uploadFile("formUploadGroupImg").done(function (data) {
                console.log(data);
                var html = "上传失败，请重试";
                if (data == "true") {
                    html = "上传成功,请去商品后台检查文件上传是否正确！";
                }
                $("#dev_show_table").html(html);
                layer.close(loadId);
            });
        })
    },
    uploadFile: function (formId) {
        var def = $.Deferred();
        var formData = new FormData($("#" + formId)[0]);
        $.ajax({
            url: '/uploadImg',
            type: 'POST',
            data: formData,
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (200 === data.code) {
                    //$("#imgShow").attr('src', data.msg.url);
                    console.log("上传成功。");
                    def.resolve(data.data);
                } else {
                    console.log(data.msg);
                    layer.alert(data.msg);
                    def.resolve(null);
                }
            },
            error: function (err) {
                console.error(err, "与服务器通信发生错误。");
                layer.alert("与服务器通信发生错误。");
                def.resolve(null);
            }
        });
        return def.promise();
    }
};


String.prototype.format = function () {
    var s = this, i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};