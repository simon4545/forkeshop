var request = require('supertest');
var should = require('should');
var app = require('../app');

/**
 * 创建售后单
 */
//describe('test/saleAfter.test.js', function () {
//    it('should /api3/saleAfter/refund/create status 300', function (done) {
//        request(app)
//            .post('/api3/saleAfter/refund/create')
//            .send({
//                "loginId": "7f8759d084e511e58f9600163e005f18",
//                "orderCode": "201601171918153703",
//                "refundType": "1",
//                "refundReason": "7天无理由退货",
//                "refundDesc": "这是个测试",
//                "uploadImg": "3123123^31232312",
//                "goodsList": [{
//                    "goodsId": "b634e86094aa11e58f7c39cbb078801b",
//                    "num": "1"
//                }]
//            })
//            .set('Accept', 'application/json')
//            .end(function (err, res) {
//                res.body.should.have.property('STATUSCODE', 200);
//                done();
//            });
//    });
//});

/**
 * 取消售后单
 */
//describe('test/saleAfter.test.js', function () {
//    it('should /api3/saleAfter/refund/cancel status 300', function (done) {
//        request(app)
//            .post('/api3/saleAfter/refund/cancel')
//            .send({
//                "loginId": "7f8759d084e511e58f9600163e005f18",
//                "refundId": "e9010020c31311e58849911b7a2204ec"
//            })
//            .set('Accept', 'application/json')
//            .end(function (err, res) {
//                res.body.should.have.property('STATUSCODE', 200);
//                done();
//            });
//    });
//});

/**
 * 提交快递信息
 */
//describe('test/saleAfter.test.js', function () {
//    it('should /api3/saleAfter/refund/complete status 300', function (done) {
//        request(app)
//            .post('/api3/saleAfter/refund/complete')
//            .send({
//                "loginId": "7f8759d084e511e58f9600163e005f18",
//                "refundId": "4a5370a0c31511e5b5c915510a2c2dad",
//                "expressCompany": "中通",
//                "expressCode": "1234567890测试",
//                "alipayAccount": "123456789",
//                "alipayAuthName": "测试",
//                "expressFee": "10",
//                "expressImg": "122123"
//            })
//            .set('Accept', 'application/json')
//            .end(function (err, res) {
//                res.body.should.have.property('STATUSCODE', 200);
//                done();
//            });
//    });
//});

/**
 * 创建催单
 */
//describe('test/saleAfter.test.js', function () {
//    it('should /api3/saleAfter/reMinder/create status 300', function (done) {
//        request(app)
//            .post('/api3/saleAfter/reMinder/create')
//            .send({
//                "loginId": "7f8759d084e511e58f9600163e005f18",
//                "orderCode":"201601171918153703",
//                "reason":"dfasfd",
//                "remark":""
//            })
//            .set('Accept', 'application/json')
//            .end(function (err, res) {
//                res.body.should.have.property('STATUSCODE', 200);
//                done();
//            });
//    });
//});

/**
 * 查询
 */
describe('test/saleAfter.test.js', function () {
    it('should /api3/saleAfter/refund/query status 300', function (done) {
        request(app)
            .post('/api3/saleAfter/refund/query')
            .send({
                "loginId": "5c158224723911e5904400163e005f18",
                "refundId" : "67f98904bda811e598c200163e005f18"
            })
            .set('Accept', 'application/json')
            .end(function (err, res) {
                res.body.should.have.property('STATUSCODE', 200);
                done();
            });
    });
});

