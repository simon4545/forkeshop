var request = require('supertest');
var should = require('should');
var assert = require('assert');
var qc=require('../bin/qc').qc;
describe('test/api.test.js', function () {
    it('should qc exist', function (done) {
        assert.equal(Object.prototype.toString.call(qc),'[object Function]');
        done()
    });
});
describe('test/api.test.js', function () {
    it('should createQueue sucess', function (done) {
        var _qc=new qc({connstr:'redis://120.26.214.10:6379',password:'bbxredis110'});
        _qc.queue('test').publish('come on fuck',function(err){
            assert.equal(err,undefined);
            done();
        });
    });
});
describe('test/api.test.js', function () {
    it('should getQueue sucess', function (done) {
        var _qc=new qc({connstr:'redis://120.26.214.10:6379',password:'bbxredis110'});
        _qc.queue('test').get(function(err,work){
            if(err){
                return console.error(err);
            }
            work.on('data',function(data){
                console.log(data);
                assert.notEqual(data,undefined);
                //work.done();
                //work.done(new Error('test'));
                done();
            })
        });
    });
});

/*
describe('test/api.test.js', function () {
    it('should post toutiao /videoDetail status 200', function (done) {
        request(app).post('/videoDetail').send({'videoId': '566e3c3928bf476426464b7c'}).end(function (err, res) {
            res.status.should.equal(200);
            //console.log(res.body.msg.videoArr);
            //res.body.should.not.containEql('[');
            done();
        });
    });
});
describe('test/api.test.js', function () {
    it('should post self /videoDetail status 200', function (done) {
        request(app).post('/videoDetail').send({'videoId': '5670262e5a32e0f00ed7b4ee'}).end(function (err, res) {
            res.status.should.equal(200);
            //console.log(res.body.msg.videoArr);
            //res.body.should.not.containEql('[');
            done();
        });
    });
});
describe('test/api.test.js', function () {
    it('should post toutiao /getVpro status 200', function (done) {
        request(app).post('/getVpro').send({'Id': '56712cbecb42dda81f3a5115'}).end(function (err, res) {
            res.status.should.equal(200);
            //res.body.should.not.containEql('[');
            done();
        });
    });
});

describe('test/api.test.js', function () {
    it('should post self /getVpro status 200', function (done) {
        request(app).post('/getVpro').send({'Id': '56702ad0a1fdaa5a35227e21'}).end(function (err, res) {
            res.status.should.equal(200);
            //res.body.should.not.containEql('[');
            done();
        });
    });
});
*/
