var camera = {
    callback: null,
    getPicture: function () {

        if (!appFunc.isPhonegap()) {
            hiApp.alert(i18n.error.phonegap_only);
            return false;
        }

        var $this = $$(this);

        var netStatus = networkStatus.checkConnection();

        var quality, sourceType;
        if (netStatus === 'WIFI') {
            quality = 100;
        } else {
            quality = 80;
        }

        if (!$this.hasClass('camera')) {
            sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
        } else {
            sourceType = Camera.PictureSourceType.CAMERA;
        }

        var cameraOptions = {
            quality: quality,
            allowEdit: false,
            sourceType: sourceType,
            mediaType: Camera.MediaType.PICTURE,
            targetWidth: 480,
            targetHeight: 480
        };

        navigator.camera.getPicture(camera.cameraSuccess, camera.cameraError, cameraOptions);

    },

    cameraSuccess: function (fileUrl) {
        //    $$('#mycenter-photo').attr('src',fileUrl);
        $$('#uploadPicPreview>img').attr('src', fileUrl);
        $$('#uploadPicPreview').show();

    },

    cameraError: function (message) {
        setTimeout(function () {
            if (message !== 'no image selected') {
                hiApp.alert(message);
            }
        }, 500);
    },

    clearCache: function () {
        navigator.camera.cleanup();
    },

    startUpload: function (url, success) {
        if (url.indexOf('?')) {
            url = url.split('?')[0];
        }
        fileTransfer.startUpload(url, success);
    },

    isPhonegap: function () {
        return (typeof(cordova) !== 'undefined' || typeof(phonegap) !== 'undefined');
    },
    getPhoto: function (options, callback) {
        // $$("#popover-mycenter").css("display","none");
        $$('#mycenter-photo').attr("isChange", 0);
      /*  if (!camera.isPhonegap()) {
            hiApp.alert(i18n.error.phonegap_only);
            return false;
        }
*/
        var $this = $$(this);

        var netStatus = networkStatus.checkConnection();

        var quality, sourceType;
        if (netStatus === 'WIFI') {

            quality = 100;
        } else {

            quality = 80;
        }

        if (options.type != 'camera') {

            sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
        } else {
            sourceType = Camera.PictureSourceType.CAMERA;
        }

        var cameraOptions = {
            quality: quality,
            allowEdit: false,
            sourceType: sourceType,
            mediaType: Camera.MediaType.PICTURE,
            targetWidth: 480,
            targetHeight: 480
        };
        for (var param in options) {
            cameraOptions[param] = options[param];
        }
        navigator.camera.getPicture(callback || camera.photoSuccess, camera.photoError, cameraOptions);
    },
    photoSuccess: function (fileUrl) {

        /*camera.startUpload(fileUrl, function (url) {
         postBody.avatar=url;
         console.log(JSON.stringify(postBody));
         xhr.simpleCall({
         func: 'user/'+ GS.getCurrentUser().loginname,
         data: postBody,
         method:'POST'
         }, function (response) {
         if (response.r === -1) {
         hiApp.hidePreloader();
         hiApp.alert(response.msg);
         }else{
         //  hiApp.alert("±£´æ³É¹¦£¡");
         s.hideToolbar();
         }
         });
         });*/
       // $$('#mycenter-photo').attr('src', fileUrl).attr("isChange", 1);
    },
    photoError: function (message) {
        setTimeout(function () {
            if (message !== 'no image selected') {
                hiApp.alert(message);
                hiApp.hideIndicator();
            }
        }, 500);
    }
};