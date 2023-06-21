const { con } = require("../conn");

async function getSubscriptionCustomers(req, res) {
  const query = "SELECT * FROM subscriptions";
  
  try {
    const data = await new Promise((resolve, reject) => {
      con.query(query, (error, result) => {
        if (error) {
          console.log("Error executing query", error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
    console.log(data);
    
    res.json(data);
  } catch (error) {
    // Handle the error appropriately
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { getSubscriptionCustomers };
