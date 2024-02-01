const mysql = require('mysql2');

// Create a connection to the sql database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employee_tracker'
});

module.exports = db.promise();