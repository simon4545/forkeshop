var CONFIG = require('./dbconfig.js');
module.exports = {
    isError: function (obj) {
        return obj instanceof Error;
    },

    jsonFail: function (res, obj) {
        if (obj) {
            res.json(obj);
        } else {
            res.json({ status: 300 });
        }
        return false;
    },
    MySQLClient: function () {
        var mysql = require('mysql');
        var connection = mysql.createConnection(CONFIG.EDB);
        return connection;
    },
    upperCase: function (obj) {
        var that=this;
        var output = {};
        for (var i in obj) {
            if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
                output[i.toUpperCase()] = that.upperCase(obj[i]);
            }else if(Object.prototype.toString.apply(obj[i]) === '[object Array]'){
                obj[i].forEach(function(item,idx){
                    obj[i][idx]=that.upperCase(item);
                });
                output[i.toUpperCase()]=obj[i];
            }else {
                output[i.toUpperCase()] = obj[i];
            }
        }
        return output;
    }
};