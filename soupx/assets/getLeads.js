const {con} = require('../conn');
const mysql = require('mysql');

async function getLeads(req,res) {
    const query = "select * from explore_leads";
    const result = await new Promise((resolve,reject) => {
        con.query(query, (err, result) => {
            if(err) {
                console.log("Error executing query", err);
                reject(err);
            }
            else{
                resolve(result);
            }
        })
    });
    res.json(result);
}

module.exports = {getLeads};