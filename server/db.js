require('dotenv').config();
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DBPORT,
    database: 'todoapp'
});

module.exports = pool;
