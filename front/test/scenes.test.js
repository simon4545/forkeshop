/**
 * Created by Administrator on 2016/1/27.
 */
var request = require('supertest');
var should = require('should');
var app = require('../app');

/**
 * mainLoopAdsList
 */
//describe('test/scenes.test.js', function () {
//    it('should /api3/scenes/mainLoopAdsList status 300', function (done) {
//        request(app)
//            .post('/api3/scenes/mainLoopAdsList')
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
 * scenesList
 */
//describe('test/scenes.test.js', function () {
//    it('should /api3/scenes/scenesList status 300', function (done) {
//        request(app)
//            .post('/api3/scenes/scenesList')
//            .send({
//                "page" : "1"
//            })
//            .set('Accept', 'application/json')
//            .end(function (err, res) {
//                res.body.should.have.property('STATUSCODE', 200);
//                done();
//            });
//    });
//});

/**
 * scenesInfo
 */
//describe('test/scenes.test.js', function () {
//    it('should /api3/scenes/scenesInfo status 300', function (done) {
//        request(app)
//            .post('/api3/scenes/scenesInfo')
//            .send({
//                "id" : "eccb9b70b51711e5bf984b6068419633"
//            })
//            .set('Accept', 'application/json')
//            .end(function (err, res) {
//                res.body.should.have.property('STATUSCODE', 200);
//                done();
//            });
//    });
//});

/**
 * getFavoriteScenes
 */
//describe('test/scenes.test.js', function () {
//    it('should /api3/scenes/getFavoriteScenes status 300', function (done) {
//        request(app)
//            .post('/api3/scenes/getFavoriteScenes')
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
 * setFavoriteScenes
 */
describe('test/scenes.test.js', function () {
    it('should /api3/scenes/setFavoriteScenes status 300', function (done) {
        request(app)
            .post('/api3/scenes/setFavoriteScenes')
            .send({
                "userId" : "23dbea4a392411e5b45d00163e005f18",
                "sceneId" : "1a23ef20a91811e58b1ae1be6a16241d",
                "flag" : "1"
            })
            .set('Accept', 'application/json')
            .end(function (err, res) {
                res.body.should.have.property('STATUSCODE', 200);
                done();
            });
    });
});

