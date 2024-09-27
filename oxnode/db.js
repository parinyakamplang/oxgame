const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ox1234',
    database: 'oxGame'
});

module.exports = db;
