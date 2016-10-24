var request = require('supertest');
var should = require('should');
var app = require('../app');

/**
 * 用户注册
 */
describe('test/user.test.js', function () {
    it('should /api3/auth/reg status 300', function (done) {
        request(app)
            .post('/api3/auth/reg')
            .send({'mobile': '18019966009', password: 'asdfasdf', validcode: '1234'})
            .set('Accept', 'application/json')
            .end(function (err, res) {
                res.body.should.have.property('code', 300);
                //res.body.should.equal(200);
                //res.body.should.containEql('[');
                done();
            });
    });
});

/**
 * 收取验证码
 */
/*
describe('test/user.test.js', function () {
    it('should /api3/auth/validcode status 200', function (done) {
        request(app)
            .post('/api3/auth/validcode')
            //.field('mobile', '18019966009')
            //.field('password', 'asdfasdf')
            //.field('validcode', '1234')
            .send({'mobile': '18019966009'})
            .set('Accept', 'application/json')
            .end(function (err, res) {
                console.dir(res.body);
                res.body.should.have.property('code', 200);
                //res.body.should.equal(200);
                //res.body.should.containEql('[');
                done();
            });
    });
});
*/

/**
 * 登录
 */
describe('test/user.test.js', function () {
    it('should /api3/auth/login/bbx status 200', function (done) {
        request(app)
            .post('/api3/auth/login/bbx')
            .send({'mobile': '18019966009',password:'asdfasdf'})
            .set('Accept', 'application/json')
            .end(function (err, res) {
                res.body.should.have.property('code', 200);
                done();
            });
    });
});

/**
 * 找回密码
 */
describe('test/user.test.js', function () {
    it('should /api3/auth/findPassword have status', function (done) {
        request(app)
            .post('/api3/auth/findPassword')
            .send({'mobile': '18019966009',password:'asdfasdf',validcode: '1234'})
            .set('Accept', 'application/json')
            .end(function (err, res) {
                res.body.should.have.property('code');
                //res.body.code.should.be.a.Number();
                done();
            });
    });
});