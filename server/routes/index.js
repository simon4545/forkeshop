var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var uuid = require('node-uuid');
var fs = require('fs');
var Sync = require('sync');
var multipart = require('connect-multiparty');
var ALY = require('aliyun-sdk');
var utils = require('../utils');
var AppConfig = require('../config');
var oss = new ALY.OSS(AppConfig.OSS_CONFIG);
var libImportExpressInfo = require('../lib/importExpressInfo');
var async = require('async');
var ZipFile = require('async-unzip').ZipFile;
var dateFormat = require('./common').dateFormat;
var bce = require('baidubce-sdk');
function _auth(req, res, next) {
    var url = req._parsedUrl.pathname;
    console.dir(req._parsedUrl.pathname)
    if (url.lastIndexOf("agent") != -1) {
        ////分销商
        //if (url != "/agent/login" && url != "/agent/about" && url != "/agent/register" && url != "/agent/mgr" && !req.session.agent_user && url != "/agent/forgotPassword") {
        //    if (req.session.user || req.cookies.agent_user) {
        //        next();
        //    } else {
        //        console.log(url, "分销商session失效");
        //        res.redirect('/agent/login');
        //    }
        //} else {
            next();
        //}
    } else {
        //普通商家
        if (url != "/login" && !req.cookies.user && url.indexOf('/logger') < 0 && url.indexOf('/spectacle') < 0 && url.indexOf('/promotion') < 0) {
            console.log("session失效");
            res.redirect('/login');
        } else {
            //if( req.cookies.user.AccountState == 1) {} else {res.redirect('/login'); }
            next();
        }
    }
}


//var mysql_con = mysql.createPool(AppConfig.DB_CONFIG.MYSQL_DB);
var mysql_con = mysql.createConnection(AppConfig.DB_CONFIG.MYSQL_DB);
mysql_con.connect(function (err) {
    if (err) {
        console.error('mysql数据库连接错误: ' + err.stack);
        return;
    }
    console.log('mysql数据库连接成功， id ' + mysql_con.threadId);
});

global.app.set('MysqlConn', mysql_con);

router.get('/homepage', function (req, res,next) {
    app.controller('homePageController').get4banner(req,res);
});



//文件上传接口
router.post('/upload', multipart(), function (req, res) {
    if (!req.files.files) {
        res.json({code: 301, msg: "上传数据存在异常，请重试"});
        return;
    }

    var fileArr = [];
    if (!(req.files.files instanceof Array)) {
        //商家订单数据导入
        var temp_path = req.files.files.path;
        var fileExt = temp_path.substring(temp_path.lastIndexOf(".") + 1).toLowerCase();
        if (fileExt === 'xlsx') {
            libImportExpressInfo.getExportMerchantData(temp_path, getResult);
            function getResult(result) {
                if (result == false) {
                    console.log('error:');
                    res.json({code: 300, msg: "文件上传失败"});
                }
                res.json({code: 200, msg: JSON.stringify(result), data: JSON.stringify(result)});
            }

            return;
        } else {
            fileArr.push(req.files.files);
        }
    } else {
        fileArr = req.files.files;
    }

    var urlArr = [];
    Sync(function () {
        try {
            for (var i = 0; i < fileArr.length; i++) {
                var temp_path = fileArr[i].path;
                var fileName = temp_path.substring(temp_path.lastIndexOf("\\") + 1).substring(temp_path.lastIndexOf("\/") + 1);
                var fileExt = temp_path.substring(temp_path.lastIndexOf(".") + 1).toLowerCase();
                if (fileExt == "png" || fileExt == "jpeg" || fileExt == "jpg" || fileExt == "gif" || fileExt == "bmp") {
                    var content = fs.readFileSync(temp_path);
                    //上传到阿里云
                    var expiresDate = new Date().setFullYear(2099);
                    oss.putObject.sync(oss, {
                        Bucket: 'mbbxvip',
                        Key: fileName,
                        Body: content,
                        AccessControlAllowOrigin: '',
                        ContentType: 'image/' + fileExt,
                        CacheControl: '',
                        ContentDisposition: '',
                        ContentEncoding: '',
                        ServerSideEncryption: 'AES256',
                        Expires: expiresDate
                    });
                    var url = AppConfig.URL.ALY_FILE_BASE_URL + fileName;
                    urlArr.push(url);
                    console.log("上传成功，文件访问地址：" + url);
                    // 删除临时文件
                    fs.unlink(temp_path);
                }
            }
            res.json({code: 200, msg: urlArr});
        } catch (err) {
            console.error(err);
            logger.writeErr(err);
            res.json({code: 300, msg: "文件上传失败"});
        }
    });
});

router.get('/exportGoodsImg', function (req, res) {
    res.render('exportGoodsImg', req.session.user);
});

//文件上传接口
router.post('/uploadImg', multipart(), function (req, res) {
    if (req.files.files && req.files.files.path != 'undefined') {
        var temp_path = req.files.files.path;
        var fileExt = temp_path.substring(temp_path.lastIndexOf(".") + 1).toLowerCase();
        if (temp_path && fileExt === 'zip') {
            var sku = [], imgPaths = [];
            var zipFile = new ZipFile(temp_path),
                noMoreFiles = false;
            async.whilst(function () {
                return !noMoreFiles;
            }, function (cb) {
                async.waterfall([
                    function (cb) {
                        zipFile.getNextEntry(cb);
                    },
                    function (entry, cb) {
                        if (entry) {
                            var fileName = entry.filename;
                            if (entry.isFile) {
                                console.log(fileName);
                                imgPaths.push(fileName);
                            } else {
                                console.log(fileName);
                                sku.push(fileName);
                            }
                        } else {
                            noMoreFiles = true;
                        }
                        cb();
                    }], cb);
            }, function () {
                zipFile.close();
                goodsImg.exportGoodsImg(sku, imgPaths, getResult);
                function getResult(result) {
                    if (result == false) {
                        console.log('error:');
                        res.json({code: 300, msg: "文件上传失败"});
                    }
                    res.json({code: 200, msg: JSON.stringify(result), data: JSON.stringify(result)});
                }
            });
        }
    } else {
        res.json({code: 301, msg: "上传数据存在异常，请重试"});
    }
});

//文件上传接口
router.post('/upload_bdBce', multipart(), function (req, res) {
    if (!req.files.files) {
        res.json({code: 301, msg: "上传数据存在异常，请重试"});
        return;
    }
    var imgUrlArr = [], fileArr = [];
    if (!(req.files.files instanceof Array)) {
        fileArr.push(req.files.files);
    } else {
        fileArr = req.files.files;
    }
    try {
        //这里是百度云配置
        var bucket = AppConfig.BDBCE_CONFIG.bucketName;
        var config = {
            credentials: {
                ak: AppConfig.BDBCE_CONFIG.accessKeyId,
                sk: AppConfig.BDBCE_CONFIG.secretAccessKey
            },
            endpoint: AppConfig.BDBCE_CONFIG.endpoint
        };
        var client = new bce.BosClient(config);
        //这里开始调用上传方法
        uploadImgToBDBCE(res, fileArr, client, bucket, imgUrlArr, 0);
    } catch (err) {
        console.log(err);
        logger.writeErr(err);
        res.json({code: 300, msg: "文件上传失败"});
    }


});
/**
 * 上传到百度bce
 * @param res
 * @param fileArr
 * @param client
 * @param bucket
 * @param imgUrlArr
 * @param i
 */
function uploadImgToBDBCE(res, fileArr, client, bucket, imgUrlArr, i) {
    var temp_path = fileArr[i].path;
    var fileExt = temp_path.substring(temp_path.lastIndexOf(".") + 1).toLowerCase();
    //暂只支持上传图片
    if (fileExt == "png" || fileExt == "jpeg" || fileExt == "jpg" || fileExt == "gif" || fileExt == "bmp") {
        var currentDate = dateFormat(new Date(), "yyyy-MM-dd");
        //自定义图片名称
//        var key =   "test/" + uuid.v1().replace(/-/ig, "") + ".png";
        var key = currentDate + "/" + uuid.v1().replace(/-/ig, "") + ".png";
        //云端图片地址
        var imgUrl = AppConfig.URL.BDBCD_CDN_FILE_BASE_URL + key;
        client.putObjectFromFile(bucket, key, temp_path).then(function (response) {
            imgUrlArr.push(imgUrl);
            if (i >= fileArr.length - 1) {
                res.json({code: 200, msg: imgUrlArr});
            } else {
                i++;
                uploadImgToBDBCE(res, fileArr, client, bucket, imgUrlArr, i);
            }
        }).catch(function (error) {
            logger.writeErr(error);
            if (i >= fileArr.length - 1) {
                res.json({code: 200, msg: imgUrlArr});
            } else {
                i++;
                uploadImgToBDBCE(res, fileArr, client, bucket, imgUrlArr, i);
            }
        });
    }
}


app.use('/', router);
app.use('/', require('./authRoute'));
app.use('/', require('./goodsRoute'));

app.use('/uploadFile', require('./uploadRoute'));
app.use('/mainlooper', _auth, require('./mainlooperRoute'));
app.use('/member', _auth, require('./memberRoute'));
app.use('/order', _auth, require('./order'));
app.use('/admin', _auth, require('./adminRoute'));
module.exports = router;