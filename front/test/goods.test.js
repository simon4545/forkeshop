/**
 * Created by Administrator on 2016/1/27.
 */
var request = require('supertest');
var should = require('should');
var app = require('../app');

/**
 * imgList
 */
//describe('test/goods.test.js', function () {
//    it('should /api3/goods/imgList status 300', function (done) {
//        request(app)
//            .post('/api3/goods/imgList')
//            .send({
//                "goodsGroupId": "004fbf00a56e11e5b4ea65b968b44ca7"
//            })
//            .set('Accept', 'application/json')
//            .end(function (err, res) {
//                res.body.should.have.property('STATUSCODE', 200);
//                done();
//            });
//    });
//});

/**
 * detail
 */
//describe('test/goods.test.js', function () {
//    it('should /api3/goods/detail status 300', function (done) {
//        request(app)
//            .post('/api3/goods/detail')
//            .send({
//                "goodsGroupId": "004fbf00a56e11e5b4ea65b968b44ca7"
//            })
//            .set('Accept', 'application/json')
//            .end(function (err, res) {
//                res.body.should.have.property('STATUSCODE', 200);
//                done();
//            });
//    });
//});

//
///**
// * detail
// */
//describe('test/goods.test.js', function () {
//    it('should /api3/goods/goodsInfo status 300', function (done) {
//        request(app)
//            .post('/api3/goods/goodsInfo')
//            .send({
//                "goodsGroupId": "004fbf00a56e11e5b4ea65b968b44ca7"
//            })
//            .set('Accept', 'application/json')
//            .end(function (err, res) {
//                res.body.should.have.property('STATUSCODE', 200);
//                done();
//            });
//    });
//});

/**
 * goodsSift TODO 仔细测试
 */
//describe('test/goods.test.js', function () {
//    it('should /api3/goods/goodsSift status 300', function (done) {
//        request(app)
//            .post('/api3/goods/goodsSift')
//            .send({
//                "filters": "",
//                "pageNum": "1",
//                "categoryType":"Jacket"
//            })
//            .set('Accept', 'application/json')
//            .end(function (err, res) {
//                res.body.should.have.property('STATUSCODE', 200);
//                done();
//            });
//    });
//});


/**
 * normalAds
 */
//describe('test/goods.test.js', function () {
//    it('should /api3/goods/normalAds status 300', function (done) {
//        request(app)
//            .post('/api3/goods/normalAds')
//            .send({})
//            .set('Accept', 'application/json')
//            .end(function (err, res) {
//                res.body.should.have.property('STATUSCODE', 200);
//                done();
//            });
//    });
//});

/**
 * normalAds TODO：待测 数据库未同步
 */
//describe('test/goods.test.js', function () {
//    it('should /api3/goods/specialAds status 300', function (done) {
//        request(app)
//            .post('/api3/goods/specialAds')
//            .send({
//
//            })
//            .set('Accept', 'application/json')
//            .end(function (err, res) {
//                res.body.should.have.property('STATUSCODE', 200);
//                done();
//            });
//    });
//});


/**
 * getFavoriteGoods
 */
//describe('test/goods.test.js', function () {
//    it('should /api3/goods/getFavoriteGoods status 300', function (done) {
//        request(app)
//            .post('/api3/goods/getFavoriteGoods')
//            .send({
//                "userId" : "23dbea4a392411e5b45d00163e005f18"
//            })
//            .set('Accept', 'application/json')
//            .end(function (err, res) {
//                res.body.should.have.property('STATUSCODE', 200);
//                done();
//            });
//    });
//});

/**
 * setFavoriteGoods
 */
describe('test/goods.test.js', function () {
    it('should /api3/goods/setFavoriteGoods status 300', function (done) {
        request(app)
            .post('/api3/goods/setFavoriteGoods')
            .send({
                "userId" : "23dbea4a392411e5b45d00163e005f18",
                "goodsGroupId" : "003fe510af7511e59760618a995e5ce3",
                "flag" : "0"
            })
            .set('Accept', 'application/json')
            .end(function (err, res) {
                res.body.should.have.property('STATUSCODE', 200);
                done();
            });
    });
});

