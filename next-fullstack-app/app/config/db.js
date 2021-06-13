'use strict'
const mysql = require("mysql");
const dbConfig = require("./db.config.js");

var connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
});

connection.connect(function(err) {
    if (err) {
        console.log("Error in connecting:" + err.stack);
        return
    }
    console.log('Connected as thread id:' + connection.threadId);
});

module.exports = connection;