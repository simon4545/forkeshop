/**
 * Created by Administrator on 15-4-29.
 */
/* globals $$: false,
 appConfig:false,
 util:false,
 hiApp:false,
 console:false，
 localStorage:false,
 Template7:false,
 userObj:false,
 camera:false,
 bindTapEvent:false,
 app_type:false,
 mainView:false
 */
var userCenterObj = {
    /* jshint strict: false */
    imgNums: 0,
    maxImgNums: 1,
    init: function () {
        var that = this;
        that.bindEvent();
        that.bindData();
    },
    bindEvent: function () {
        var page = ".usercenter-page";
        var that = this;
        bindTapEvent(page, '#nickname', function (_this) {
            mainView.router.loadPage('page/userCenter/nickname.html');
        });

        bindTapEvent(page, '#gender', function (_this) {
            mainView.router.loadPage('page/userCenter/gender.html');
        });

        $$("#addPhotoImg").on('change', function () {
            //TODO : 判断图片大小
            util.uploadFile("photoImgForm" , function (fileUrlArr) {
                $$("#headImgUC").attr("src", fileUrlArr[0]);
                that.uploadPhotoImg(fileUrlArr[0]);
            });
        });
        if(app_type ==='app') {
            $$("#addPhotoImg").remove();
        }
        bindTapEvent(page, '.ac-3', function (_this, e) {
            if(app_type ==='app') {
                var buttons1 = [
                    {
                        text: '拍照',
                        color: 'orange',
                        bold: true,
                        onClick: function () {
                            camera.getPhoto({allowEdit: true, type: 'camera'}, userCenterObj.camera.photoSuccess);
                        }
                    },
                    {
                        text: '从手机相册选择',
                        color: 'orange',
                        bold: true,
                        onClick: function () {
                            camera.getPhoto({allowEdit: true}, userCenterObj.camera.photoSuccess);
                        }
                    }
                ];
                var buttons2 = [
                    {
                        text: '取消',
                        color: 'gray'
                    }
                ];
                var groups = [buttons1, buttons2];
                hiApp.actions(groups);
            }
        });


    },
    uploadPhotoImg:function( imgPath ){
       if(userObj.isExist()){
           util.getAjaxData({
               url: appConfig.SAVE_NICKNAME,
               type:'post',
               data:{
                   userid: userObj.ID,
                   type: "HeaderImage",
                   value: imgPath
               },
               success:function(){
                   userObj.HEADERIMAGE = imgPath;
                   userObj.setLocalUser();
               }
           })
       }
    },
    bindData: function () {
        var _usr = userObj;
        var nickName = _usr.MEMBERNAME === "" ? _usr.MEMBERACCOUNT : _usr.MEMBERNAME;
        var gender = _usr.MEMBERIDEN === "1" ? "女" : "男";
        var headImg = _usr.HEADERIMAGE === "" ? false : _usr.HEADERIMAGE;
        $$("#nicknameLabel").html(nickName);
        $$("#genderLabel").html(gender);
        $$("#phoneNum").html(util.sheildMobile(_usr.MEMBERACCOUNT));
        if (headImg) {
            $$("#headImgUC").attr("src", headImg);
        }else{
            if(_usr.MEMBERIDEN === "0"){
                $$("#headImgUC").attr('src', 'img/newIcon/icon_15.png');
            }else{
                $$("#headImgUC").attr('src', 'img/newIcon/icon_14.png');
            }
        }

    },

    nickname: {

        bindEvent: function () {
            var page = ".nickname-page";

            bindTapEvent(page, '#clearNickname', function (_this) {
                userCenterObj.nickname.clearNickName();
            });

            bindTapEvent(page, '#nicknameSave', function (_this) {
                var nickname = $$("#nicknameInput").val();
                if(nickname){
                    userCenterObj.nickname.saveNickname(nickname);
                }
                else{
                    hiApp.alert("请填个昵称先~");
                }
            });
        },

        clearNickName: function () {
            $$("#nicknameInput").val("");
        },

        bindData: function () {
            var _usr = userObj;
            var nickName = _usr.MEMBERNAME === "" ? _usr.MEMBERACCOUNT : _usr.MEMBERNAME;
            $$("#nicknameInput").val(nickName);
        },

        saveNickname: function (nickname) {
            var _usr = userObj;
            var data = {
                userid: _usr.ID,
                type: "nickname",
                value: nickname
            };
            var req = {
                url: appConfig.SAVE_NICKNAME,
                type: "post",
                data: data,
                success: userCenterObj.nickname.reloadUserCenter
            };
            util.getAjaxData(req);
        },

        reloadUserCenter: function () {
            userObj.MEMBERNAME = $$("#nicknameInput").val();
            userObj.setLocalUser();
            mainView.router.back();
            //    mainView.router.loadPage('page/userCenter/userCenter.html');
        }
    },

    gender: {

        bindEvent: function () {
            var page = ".gender-page";

            bindTapEvent(page, '#genderSave', function (_this) {
                userCenterObj.gender.saveGender();
            });
        },

        bindData: function () {
            var _usr = userObj;
            var gender = _usr.MEMBERIDEN;
            if (gender === "1") {
                $$("#genderWoman").attr("checked", "checked");
            } else {
                $$("#genderMan").attr("checked", "checked");
            }
        },

        saveGender: function () {
            var gender = "0";
            if ($$("#genderWoman")[0].checked === true) {
                gender = "1";
            }
            var _usr = userObj;
            var data = {
                userid: _usr.ID,
                type: "sex",
                value: gender
            };
            var req = {
                url: appConfig.SAVE_NICKNAME,
                type: "post",
                data: data,
                success: userCenterObj.gender.reloadUserCenter
            };
            util.getAjaxData(req);
        },
        reloadUserCenter: function () {
            var gender = "0";
            if ($$("#genderWoman")[0].checked === true) {
                gender = "1";
            }
            userObj.MEMBERIDEN = gender;
            userObj.setLocalUser();
            mainView.router.back();
            //     mainView.router.loadPage('page/userCenter/userCenter.html');
        }
    },

    camera: {
        photoSuccess: function (_src) {
            camera.startUpload(_src, function (url) {
                if (url.STATUSCODE === "200") {
                    userCenterObj.camera.reloadUserCenter(url.URL);
                    userCenterObj.uploadPhotoImg(url.URL);
                }
            });
        },

        reloadUserCenter: function (imgUrl) {
            var _usr = userObj;
            userObj.HEADERIMAGE = imgUrl;
            userObj.setLocalUser();
            var headImg = _usr.HEADERIMAGE === "" ? false : _usr.HEADERIMAGE;
            if (headImg) {
                $$("#headImgUC").attr("src", imgUrl);

            }
        }
    }
};