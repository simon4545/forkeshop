var DB_CONFIG = {
    MYSQL_DB: 'mysql://bbxvip:bbxvip110@127.0.0.1:3308/bbxvip_b2c?debug=false&connectTimeout=4000&charset=UTF8_GENERAL_CI&timezone=+0800',
    mobileapiurl: 'http://211.147.239.62:9050/cgi-bin/sendsms?to={0}&username=bbxvip@bbxvip&password=bbxvip110!&msgtype=1&text={1}',
    KNEX:{
        host: '127.0.0.1',
        port:'3308',
        user: 'bbxvip',
        password: 'bbxvip110',
        database: 'bbxvip_b2c'
    }
}

module.exports = DB_CONFIG;
