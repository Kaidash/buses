const dbconfig = require('../config/database');
const mysql = require('mysql');
const Promise = require('bluebird');
const using = Promise.using;
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);
const pool = mysql.createPool(dbconfig);

const getConnection = function () {
    return pool.getConnectionAsync().disposer(function (connection) {
        return connection.destroy();
    });
};
const query = function (command, args) {
    return using(getConnection(), function (connection) {
        console.log(command);
        return connection.queryAsync(command, args);
    });
};
module.exports = {
    query: query
};
