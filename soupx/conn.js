const mysql = require('mysql');
var con = mysql.createConnection({
    host: "soupx-db.ct4awx1ga5he.eu-north-1.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "SoupXadmin",
    database: "SoupX_db",
});

con.connect((error) => {
    if (error) {
        console.log("Error connecting to the database:", error);
        return;
    }
    console.log("Database Connected");
})

module.exports = {con};