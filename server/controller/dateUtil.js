/**
 * Created by zlongxiao@126.com on 2015/9/28.
 */
var dateFormat = require('../routes/common').dateFormat;

//东八区时间转换
function toUTCDate(date) {
    return new Date(date.valueOf() - (date.getTimezoneOffset() * 60000));
}

function currentDay() {
    var res = {};
    var st = new Date();
    st = new Date(st.setHours(0, 0, 0, 0));
    var et = new Date();
    et = new Date(et.setHours(23, 59, 59, 0));
    res.startTimeMongo = st;//toUTCDate(new Date(st));
    res.endTimeMongo = et; //toUTCDate(new Date(et));
    res.startTime = dateFormat(new Date(st), 'yyyy-MM-dd hh:mm:ss');
    res.endTime = dateFormat(new Date(et), 'yyyy-MM-dd hh:mm:ss');
    return res;
}
/**
 *获取
 * @returns {{}}
 */
function currentMonth() {
    var now = new Date(); //当前日期
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getYear(); //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0; //
    var res = {};
    res.startTimeMongo = toUTCDate(new Date(nowYear, nowMonth, 1));
    res.endTimeMongo = toUTCDate(new Date(nowYear, nowMonth + 1, 1));
    res.startTime = dateFormat(new Date(nowYear, nowMonth, 1), 'yyyy-MM-dd hh:mm:ss');
    res.endTime = dateFormat(new Date(nowYear, nowMonth + 1, 1), 'yyyy-MM-dd hh:mm:ss');

    return res;
}

function lastMonth() {
    var now = new Date(); //当前日期
    var lastMonthDate = new Date(); //上月日期
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    var lastMonth = lastMonthDate.getMonth();
    var nowYear = now.getYear(); //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0; //

    var res = {};
    res.startTimeMongo = toUTCDate(new Date(nowYear, lastMonth, 1));
    res.endTimeMongo = toUTCDate(new Date(nowYear, lastMonth + 1, 1));
    res.startTime = dateFormat(new Date(nowYear, lastMonth, 1), 'yyyy-MM-dd hh:mm:ss');
    res.endTime = dateFormat(new Date(nowYear, lastMonth + 1, 1), 'yyyy-MM-dd hh:mm:ss');
    return res;
}

function currentWeek(type) {
    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    var nowDay = now.getDate(); //当前日
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getYear(); //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0; //
    if (type == 'last') {
        type = 7;//上周，减去7天
    } else {
        type = 0;
    }
    var res = {};
    res.startTimeMongo = toUTCDate(new Date(nowYear, nowMonth, nowDay + 1 - nowDayOfWeek - type));
    res.endTimeMongo = toUTCDate(new Date(nowYear, nowMonth, nowDay + (8 - nowDayOfWeek - type)));
    res.startTime = dateFormat(new Date(nowYear, nowMonth, nowDay + 1 - nowDayOfWeek - type), 'yyyy-MM-dd hh:mm:ss');
    res.endTime = dateFormat(new Date(nowYear, nowMonth, nowDay + (8 - nowDayOfWeek - type)), 'yyyy-MM-dd hh:mm:ss');
    //console.log(res.startTime);
    //console.log(res.endTime);
    return res;
}

/**
 * x天之前的时间段
 * @param x
 */
function beforeXdays(x) {
    var now = new Date();
    var st = new Date(now.valueOf() - x * 24 * 60 * 60 * 1000);
    var res = {};
    res.startTimeMongo = toUTCDate(st);
    res.endTimeMongo = toUTCDate(now);
    res.startTime = dateFormat(st, 'yyyy-MM-dd hh:mm:ss');
    res.endTime = dateFormat(now, 'yyyy-MM-dd hh:mm:ss');
    return res;
}

exports.currentMonth = currentMonth;
exports.lastMonth = lastMonth;
exports.toUTCDate = toUTCDate;
exports.currentWeek = currentWeek;
exports.currentDay = currentDay;
exports.beforeXdays=beforeXdays;
