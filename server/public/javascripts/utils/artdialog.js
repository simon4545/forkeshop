/**
 * Created by Administrator on 2015/8/20.
 */

var artDialogCommon = {

    /**
     * artDialog 锁屏
     */
    lock: function () {
        var content = '<center style="font-size:18px;">数据获取中，请稍后...</center>';
        if (arguments[0] == "commit") {
            content = '<center style="font-size:18px;">数据提交中，请稍后...</center>';
        } else if (arguments[0] == "check") {
            content = '<center style="font-size:18px;">数据检测中，请稍后...</center>';
        }
        art.dialog({
            title: false,
            lock: true,
            background: 'gray', // 背景色
            opacity: 0.4,	// 透明度
            content: content,
            cancel: false,
            esc: false
        });
    },

    /**
     * artDialog 关闭（全部关闭）
     */
    close: function () {
        var list = art.dialog.list;
        for (var i in list) {
            list[i].close();
        }
    },

    /**
     * 仅有确定按钮的弹出框
     * @param title
     * @param content
     * @param okCallback
     */
    normal: function (title, content, okCallback) {
        var paramInfo = arguments[3];
        art.dialog({
            title: title,
            content: content,
            background: "gray",
            opacity: 0.4,
            ok: function () {
                if (typeof  okCallback === "function") {
                    var res = okCallback(paramInfo);
                    if (res == false) {
                        return false;
                    }
                }
            },
            okVal: '确定',
            width: 600,
            height: "auto",
            lock: true,
            esc: false
        });
    },

    /**
     * 仅有确定按钮的弹出框，同时绑定右上角叉事件
     * @param title
     * @param content
     * @param okCallback
     */
    normalCancle: function (title, content, okCallback, cancelCallback) {
        var paramInfo = arguments[4];
        art.dialog({
            title: title,
            content: content,
            background: "gray",
            opacity: 0.2,
            ok: function () {
                if (typeof  okCallback === "function") {
                    var res = okCallback(paramInfo);
                    if (res == false) {
                        return false;
                    }
                }
            },
            cancel: function () {
                if (typeof  cancelCallback === "function") {
                    var res = cancelCallback(paramInfo);
                    if (res == false) {
                        return false;
                    }
                }
            },
            cancelVal: '取消',
            lock: false,
            esc: false
        });
    },
    /**
     * 仅有确定按钮的弹出框
     * 弹出框 width height 自适应。
     * @param title
     * @param content
     * @param okCallback
     */
    normalAuto: function (title, content, okCallback) {
        art.dialog({
            title: title,
            content: content,
            background: "gray",
            opacity: 0.4,
            ok: function () {
                if (typeof  okCallback === "function") {
                    var res = okCallback();
                    if (res == false) {
                        return false;
                    }
                }
            },
            okVal: '确定',
            width: 750,
            height: "auto",
            lock: true,
            esc: false,
            padding: '10px 10px'
        });
    },

    /**
     * 试卷设置弹出框
     * @param title
     * @param content
     * @param okCallback
     * @param cancelCallback
     */
    examSet: function (title, content, okCallback, cancelCallback) {
        art.dialog({
            title: title,
            content: content,
            background: "gray",
            opacity: 0.4,
            ok: function () {
                if (typeof  okCallback === "function") {
                    var res = okCallback();
                    if (res == false) {
                        return false;
                    }
                }
            },
            okVal: '确定',
            width: 730,
            height: 550,
            lock: true,
            esc: false
        });
    },

    /**
     * 无按钮
     * @param title
     * @param content
     */
    noButton: function (title, content) {
        art.dialog({
            title: title,
            content: content,
            background: "gray",
            opacity: 0.4,
            width: 500,
            height: "auto",
            lock: true,
            esc: false
        });
    },

    /**
     *
     * @param title
     * @param content
     * @param okCallback
     * @param cancelCallback
     */
    okAndCancel: function (title, content, okCallback, cancelCallback, okTitle, cancelTitle) {
        art.dialog({
            title: title,
            content: content,
            background: "gray",
            opacity: 0.2,
            ok: function () {
                if (typeof  okCallback === "function") {
                    okCallback();
                }
            },
            okVal: okTitle ? okTitle : '确定',
            cancel: function () {
                if (typeof  cancelCallback === "function") {
                    cancelCallback();
                }
            },
            cancelVal: cancelTitle ? cancelTitle : '取消',
            lock: true,
            esc: false
        });
    },

    /**
     *
     * @param title
     * @param content
     * @param okCallback
     * @param cancelCallback
     * @param paramInfo
     */
    okAndCel: function (title, content, okCallback, cancelCallback, paramInfo) {
        var okTitle;
        if (paramInfo) {
            okTitle = paramInfo.okTitle;
        }
        art.dialog({
            title: title,
            content: content,
            background: "gray",
            opacity: 0.4,
            ok: function () {
                if (typeof  okCallback === "function") {
                    okCallback(paramInfo);
                }
            },
            okVal: okTitle ? okTitle : '确定',
            cancel: function () {
                if (typeof  cancelCallback === "function") {
                    cancelCallback(paramInfo);
                }
            },
            cancelVal: '取消',
            lock: true,
            esc: false
        });
    },
    mask: function (title, content) {
        art.dialog({
            title: title,
            lock: true,
            background: 'gray', // 背景色
            opacity: 0.2,	// 透明度
            content: content,
            width: "auto",
            cancel: false,
            esc: false
        });
    },

    cancelDisplay: function (title, content, cancelCallback) {
        art.dialog({
            title: title,
            lock: false,
            content: content,
            drag: true,
            resize: true,
            cancelVal: '关闭',
            height: "auto",
            cancel: function () {
                if (typeof  cancelCallback === "function") {
                    cancelCallback();
                }
            },
            esc: false
        })
    },

    /**
     * 自动关闭提示对话框
     * @param time
     * @param content
     */
    autoClose: function (time, content) {
        art.dialog({
            time: time,
            background: "gray",
            opacity: 0.4,
            width: 500,
            height: "auto",
            lock: true,
            content: content
        });
    },
    /**
     * 自动关闭提示对话框
     * add by xlzhou2 2014-11-12 11:22:00
     * @param time
     * @param content
     */
    autoClosed: function (time, content) {
        art.dialog({
            title: "温馨提示",
            time: time,
            background: "gray",
            opacity: 0.4,
            width: 300,
            height: "auto",
            lock: true,
            content: content
        });
    },

    msg: function () {
        var html = $("#dev_recruit_img").html();
        art.dialog({
            id: 'msg',
            title: '公告',
            content: html,
            width: 350,
            height: 250,
            left: '100%',
            top: '100%',
            fixed: true,
            drag: false,
            resize: false
        })
    },

    msg2: function () {
        var html = $("#dev_xinxiang_img").html();
        art.dialog({
            id: 'msg2',
            title: false,
            content: html,
            width: 135,
            height: 195,
            left: '100%',
            top: '100%',
            background: 'red', // 背景色
            opacity: 0.87,	// 透明度
            fixed: true,
            drag: false,
            resize: false
        });
        $(".aui_inner").css({
            border: "none",
            background: "none"
        })
        $(".aui_close").hide();
    },

    /**
     * 为纯文本添加样式
     * @param str
     * @returns {string}
     */
    addTextStyle: function (str) {
        return '<center style="font-size:18px;">' + str + '</center>';
    }
};