var express = require('express');
var app = express();
global.app = app;
global.log = console.log;
global.BASEPATH = __dirname;
app = require('./extend')(app);
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var session = require('express-session');
var utils = require('./utils');

//阿里支付的坑 修改请求的headers
app.use(function (req, res, next) {
    if (req.url == '/api/v2/notify_url'||req.url == '/notify_url'
        ||req.url == '/api/v2/notify_url_99'||req.url == '/notify_url_99'
        ||req.url == '/api/v2/return_url_99'||req.url == '/return_url_99') {
        req.headers['content-type'] = 'application/x-www-form-urlencoded';
    }
    next();
});

// view engine setup
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');

//在日志中输出url请求
//var log = require('./logHelper');
//log.use(app);
/*app.use(favicon(path.join(__dirname, '/public/favicon.ico' +
 '')));*/
//app.use(logger('dev'));
app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({extended: true, parameterLimit: '2000'}));
app.use(cookieParser());
app.use(compress());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'bbxvip'
}));



app.use(function (req, res, next) {
    try {
        req.cookies.user = JSON.parse(req.cookies.user);
        res.locals.userRole = req.cookies.user.Role;
        res.locals.userName = req.cookies.user.AccountName;
        res.locals.userId = req.cookies.user.Id;

    } catch (ex) {
    }
    next();
});
var routes = require('./routes/index');
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;