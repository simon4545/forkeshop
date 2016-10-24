var express = require('express');
var router = express.Router();
var AppConfig = require('../config');
var multipart = require('connect-multiparty');
var fs = require('fs');
var ALY = require('aliyun-sdk');
var oss = new ALY.OSS(AppConfig.OSS_CONFIG);
var Sync = require('sync');

var libImportExpressFee = require('../lib/importExpressFee');
var libImportOutStock = require('../lib/libImportOutStock');

//文件上传接口
router.post('/img', multipart(), function (req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    if (!req.files.files) {
        res.json({code: 301, msg: "上传数据存在异常，请重试"});
        return;
    }

    var fileArr = [];
    if (!(req.files.files instanceof Array)) {
        //商家订单数据导入
        var temp_path = req.files.files.path;
        var fileExt = temp_path.substring(temp_path.lastIndexOf(".") + 1).toLowerCase();

        fileArr.push(req.files.files);

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
                console.log("售后图片上传成功：" + url);
                // 删除临时文件
                fs.unlink(temp_path);
            }
            res.json({code: 200, msg: urlArr});
        } catch (err) {
            console.error(err);
            res.json({code: 300, msg: "文件上传失败"});
        }
    });
});

router.post('/expressFeeImport', multipart(), function (req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    if (!req.files.files) {
        res.json({code: 301, msg: "上传数据存在异常，请重试"});
        return;
    }

    var fileArr = [];
    if (!(req.files.files instanceof Array)) {
        //快递费列表导入
        var temp_path = req.files.files.path;
        var fileExt = temp_path.substring(temp_path.lastIndexOf(".") + 1).toLowerCase();
        if (fileExt === 'xlsx') {
            libImportExpressFee.getExportMerchantData(temp_path, getResult);
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
});

router.post('/outStockImport', multipart(), function (req, res) {
    res.set('Access-Control-Allow-Origin', '*');
    if (!req.files.files) {
        res.json({code: 301, msg: "上传数据存在异常，请重试"});
        return;
    }

    var fileArr = [];
    if (!(req.files.files instanceof Array)) {
        //快递费列表导入
        var temp_path = req.files.files.path;
        var fileExt = temp_path.substring(temp_path.lastIndexOf(".") + 1).toLowerCase();
        if (fileExt === 'xlsx') {

            libImportOutStock.getExportMerchantData(temp_path, getResult);

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
});


module.exports = router;