var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var AppConfig = require('../config');
var knex = require('knex');
var comFunc = require('../common').comFunc;

var mysql_con = mysql.createConnection(AppConfig.DB_CONFIG.MYSQL_DB);

var knex_con = knex({
    client: 'mysql',
    debug: true,
    connection:AppConfig.DB_CONFIG.KNEX,
    pool: { min: 0, max: 7 },
    acquireConnectionTimeout: 10000
});


global.app.set('mysql_con', mysql_con);
global.app.set('knex_con', knex_con);

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
router.get('/1', (req, res) => {
    req.session.teswt = 1;
    res.send('1-0---');
});
router.get('/2', (req, res) => {
    res.send(req.session.teswt.toString());
});
app.use('/', router);
app.use('/api/v3/user/', require('./userRoute'));
app.use('/api/v3/consignee/', require('./consigneeRoute'));
app.use('/api/v3/order/', require('./orderRoute'));
app.use('/api/v3/goods/', require('./goodsRoute'));
//app.use('/api/v3/scenes/', require('./scenesRoute'));
app.use('/api/v3/pay/', require('./payRoute'));
app.use('/api/v3/payment/', require('./paymentRoute'));
app.use('/api/v3/cart/', require('./cartRoute'));

app.use('/mobile', require('./mobile/indexRoute'));

module.exports = router;