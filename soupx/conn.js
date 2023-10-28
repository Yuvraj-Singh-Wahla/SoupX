const mysql = require('mysql');
var con = mysql.createConnection({
    host: "ls-15766b122b05d26f17df2b4847f89b09e2d3e984.cpjdlt4ax3rv.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "dbmasteruser",
    password: "Pf~h?[&(k3+H5?&o#A8*ZvF0G8V]xHsD",
    database: "SoupX_DB",
});
console.log("GOnna connect");
con.connect((error) => {
    if (error) {
        console.log("Error connecting to the database:", error);
        return;
    }
    console.log("Database Connected");
})

module.exports = { con };