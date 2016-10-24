var ft;

var fileTransfer = {

    startUpload: function (fileUrl, success) {
        this.success = success;
        var _usr = userObj;
        var uploadServer = appConfig.UPLOAD_PICTURE + "?userid=" + _usr.ID;

        /* global FileUploadOptions */
        var options = new FileUploadOptions();
        options.fileKey = 'uploadFile';
        options.fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);
        options.mimeType = 'image/jpeg';
        options.params = {};
        ft = new FileTransfer();
        ft.upload(fileUrl, encodeURI(uploadServer), fileTransfer.uploadSuccess, fileTransfer.uploadFail, options);

        ft.onprogress = fileTransfer.onprogress;
    },

    uploadSuccess: function (r) {
        hiApp.closeModal('.modal');
        navigator.camera.cleanup();
        var response = r.response ? JSON.parse(r.response) : '';

        var errText;
        if (response.STATUSCODE == "200") {
            fileTransfer.success && fileTransfer.success(response);
        } else if (response.STATUSCODE == "302") {
            errText = "请上传jpg或png 4M 以内的图片";
            alert(errText);
        } else {
            errText = "上传图片出错";
            alert(errText);
        }
    },

    uploadFail: function (error) {
        hiApp.closeModal('.modal');
        hiApp.hideIndicator();
        /* global FileTransferError */
        var errText;
        if (error.code == "302") {
            errText = "请上传jpg或png 4M 以内的图片";
        } else {
            errText = "上传图片出错";
        }
        hiApp.alert(errText);
    },

    onprogress: function (progressEvent) {
        if (progressEvent.lengthComputable) {
            var percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            $$('#progress').parents('.modal-inner').find('.modal-title .percent').html(percent + '%');
            $$('#progress').find('.progress-bar').css('width', percent + '%');
        }
    },

    abortUpload: function () {
        ft.abort();
    }
};