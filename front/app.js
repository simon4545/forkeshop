var express = require('express');
var app = express();
global.app = app;
global.BASEPATH = __dirname;
app = require('./extend')(app);
var path = require('path');
var favicon = require('serve-favicon');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');


//模板解析引擎设置
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(function (req, res, next) {
    if (req.url == '/api/v3/payment/alipay/notify_url') {
        console.log('阿里回调进来了');
        req.headers['content-type'] = 'application/x-www-form-urlencoded';
    }
    next();
});

app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(compress());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

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