"use strict";

const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit : 10,
    host : process.env.HOST,
    port : process.env.PORT,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE, // default schema
    debug : false,
}).promise()

module.exports = pool