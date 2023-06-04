'use strict';
// Include our packages in our main server file
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const axios = require('axios');

var cors = require('cors');
var path = require('path');
var port = 3504;

var Razorpay = require('razorpay');
const { response } = require('express');

let instance = new Razorpay({
    key_id: "rzp_test_4wIWvYrxDrtp8s",
    key_secret: "u5BhaEiebMWLRjLxrVnOXV1s",
});

// Use body-parser to get POST requests for API use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


var mysql = require('mysql');
const { use } = require('express/lib/application');

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

const subscriptionsTable = `
CREATE TABLE IF NOT EXISTS subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    sex VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    weight FLOAT NOT NULL,
    height VARCHAR(255) NOT NULL,
    goal VARCHAR(255) NOT NULL,
    days JSON NOT NULL,
    add_ons VARCHAR(255) NOT NULL,
    meals JSON NOT NULL,
    preference VARCHAR(25) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    pincode INT NOT NULL,
    amt FLOAT NOT NULL,
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    payLater BOOLEAN NOT NULL
  )
`;

con.query(subscriptionsTable, (error, results) => {
    if (error) {
        console.error('Error executing query: ', error);
        return;
    }
    console.log('Query results:', results);
});

// const query = "DROP TABLE IF EXISTS subscriptions";

// con.query(query, (error, results) => {
//     if (error) {
//         console.error('Error executing query: ', error);
//         return;
//     }
//     console.log('Query results:', results);
// });

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query('CREATE TABLE IF NOT EXISTS explore_leads(id int NOT NULL AUTO_INCREMENT, phone varchar(30), verification varchar(10), PRIMARY KEY(id));', function(error, result, fields) {
//     // console.log(result);
//   });
// });

const sub_leads = `
    CREATE TABLE IF NOT EXISTS subLeads(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    phone VARCHAR(15)
    )
`;
con.query(sub_leads, (error, results) => {
    if (error) {
        console.error('Error executing query: ', error);
        return;
    }
    console.log('Query results:', results);
})

app.set('view engine', 'ejs');

app.use("/soupx", express.static(__dirname + '/soupx'));
app.use("/css", express.static(__dirname + '/soupx/css'));
app.use("/img", express.static(__dirname + '/soupx/img'));
app.use("/images", express.static(__dirname + '/soupx/images'));
app.use("/js", express.static(__dirname + '/soupx/js'));
app.use("/", express.static(__dirname + '/soupx'));
app.use("/assets", express.static(__dirname + '/soupx/assets'));
app.use("/video", express.static(__dirname + '/soupx/video'));
app.use("/sitemap.xml", express.static(__dirname + '/sitemap.xml'));

//SUBSCRIPTION LEAD API
app.post('/api/subLeads', async function (req, res) {
    const lead = {
        name: req.body.name,
        phone: parseInt(req.body.phone)
    };
    console.log(lead);
    const query = `
  INSERT INTO subLeads
  SET ?
`;

    con.query(query, lead, (error, results) => {
        if (error) {
            console.error('Error inserting data: ', error);
            res.json({ message: false })
            return;
        }
        console.log('Data inserted successfully!');
        console.log(results);
        res.json({ message: true });
    });
});


//CREATE EXPLORE LEAD API
app.post('/leads', async (req, res) => {
    const phone = req.body.phone;
    console.log(phone);
    await con.query(`INSERT INTO explore_leads (phone, verification) VALUES ("${phone}", "No")`, function (err, result, fields) {
        if (err) throw err
        const options = {
            method: 'POST',
            url: `https://control.msg91.com/api/v5/otp?template_id=626695641042174181129b03&mobile=91${phone}`,
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authkey: '372124AHzypLn4SL961e928fcP1'
            },
            data: { Param1: 'value1', Param2: 'value2', Param3: 'value3' }
        };

        axios
            .request(options)
            .then(function (response) {
                //   console.log(response.data);
            })
            .catch(function (error) {
                console.error(error);
            });
        // res.send('User saved successfully!')
        // res.redirect("https://explore.soupx.in/")

    })
});

//VERIFY EXPLORE LEAD API
app.post('/verify_lead', (req, res) => {
    const phone = req.body.phone;
    const otp = req.body.otp;
    const options = {
        method: 'GET',
        url: `https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=91${phone}`,
        headers: { accept: 'application/json', authkey: '372124AHzypLn4SL961e928fcP1' }
    };

    axios
        .request(options)
        .then(function (response) {
            console.log(response.data);
            if (response.data.type == "success") {
                con.query(`UPDATE explore_leads SET verification="Yes" where phone = "${phone}" `);

                // axios.get('https://explore.soupx.in/').then(function(response) {
                // //    res.redirect( response.request.res.responseUrl); 
                //     console.log(response.request.res.responseUrl);
                //     // console.log(ans.status);

                //    }).catch(function(no200){
                //     console.error("404, 400, and other events");

                //   });
            }
            else {
                // res.send(response.data);
            }
        })
        .catch(function (error) {
            console.error(error);
        });


})

app.post('/api/addSubscription', async (req, res) => {
    const data = {
        name: req.body.name,
        phone: req.body.phone,
        sex: req.body.sex,
        age: parseInt(req.body.age),
        weight: parseFloat(req.body.weight),
        height: req.body.height,
        goal: req.body.goal,
        days: JSON.stringify(req.body.days),
        add_ons: req.body.add_ons,
        meals: req.body.meals,
        preference: req.body.preference,
        address: req.body.address,
        pincode: parseInt(req.body.pincode),
        city: req.body.city,
        amt: parseFloat(req.body.amt),
        razorpay_order_id: req.body.order_id,
        razorpay_payment_id: req.body.payment_id,
        razorpay_signature: req.body.raz_sign
    };

    const query = `
  INSERT INTO subscriptions
  SET ?
`;

    con.query(query, data, (error, results) => {
        if (error) {
            console.error('Error inserting data: ', error);
            res.json({ message: false })
            return;
        }
        console.log('Data inserted successfully!');
        res.json({ message: true });
    });
})


app.get('/explore_menu', async function (req, res) {

    // res.render(path.join(__dirname+'/soupx/subscription.ejs'))
    await res.redirect("https://explore.soupx.in/");

});



//DELETE EXPLORE LEAD
app.delete('/delete_leads', (req, res) => {
    con.connect(function (err) {
        con.query(`DELETE FROM explore_leads`, function (err, result, fields) {
            if (err) throw err
            res.send('Deleted Successfully!')
        })
    })
})

//GET EXPLORE LEADS
app.get('/get_leads', (req, res) => {
    con.connect(function (err) {
        con.query(`SELECT * FROM explore_leads`, function (err, result, fields) {
            if (err) res.send(err);
            if (result) res.send(result);

        });
    });
});

//CREATE RAZORPAY ORDER
app.post("/api/payment/order", (req, res) => {
    var params = req.body;
    instance.orders.create(params).then((data) => {
        res.send({ "sub": data, "status": "success" });
    }).catch((error) => {
        res.send({ "sub": error, "status": "failed" });
    })
});

app.post('/api/payLater', (req, res) => {
    const data = req.body;
    const subscriptionData = {
        name: data.name,
        phone: data.phone,
        sex: data.sex,
        age: parseInt(data.age),
        weight: parseFloat(data.weight),
        height: data.height,
        goal: data.goal,
        days: JSON.stringify(data.days),
        add_ons: data.add_ons,
        meals:JSON.stringify(data.meals),
        preference: data.preference,
        address: data.address,
        pincode: parseInt(data.pincode),
        city: data.city,
        amt: parseFloat(data.amt),
        payLater: 'true' === (data.payLater)
    };
    console.log(subscriptionData);

    const query = `
  INSERT INTO subscriptions
  SET ?
`;

    con.query(query, subscriptionData, (error, results) => {
        if (error) {
            console.error('Error inserting data: ', error);
            res.json({subscription: "Failure"})
        }
        else{
            console.log('Data inserted successfully!');
            res.json({subscription:"Success"});
        }
        console.log(results);
    });
})

function addSubscription(data) {
    const subscriptionData = {
        name: data.name,
        phone: data.phone,
        sex: data.sex,
        age: parseInt(data.age),
        weight: parseFloat(data.weight),
        height: data.height,
        goal: data.goal,
        days: JSON.stringify(data.days),
        add_ons: data.add_ons,
        meals: JSON.stringify(data.meals),
        preference: data.preference,
        address: data.address,
        pincode: parseInt(data.pincode),
        city: data.city,
        amt: parseFloat(data.amt),
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
        payLater: 'false' === (data.payLater)
    };
    console.log(subscriptionData);

    const query = `
  INSERT INTO subscriptions
  SET ?
`;

    let promiese = new Promise((resolve, reject) => {
        con.query(query, subscriptionData, (error, results) => {
            if (error) {
                console.error('Error inserting data: ', error);
                reject(false);
            }
            else
                console.log('Data inserted successfully!');
            console.log(results);
            resolve(true);
        });
    });

    return promiese;

}

//VERIFY PAYMENT
app.post("/api/payment/verify", async (req, res) => {
    var body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', 'u5BhaEiebMWLRjLxrVnOXV1s')
        .update(body.toString())
        .digest('hex');
    console.log("sig" + req.body.razorpay_signature);
    console.log("sig" + expectedSignature);
    if (expectedSignature === req.body.razorpay_signature) {

        addSubscription(req.body).then((result) => {
            res.json({
                payment_status: "Success",
                subscription_status: "Success",
            })

        }, (result) => {
            res.json({
                payment_status: "Success",
                subscription_status: "Faliure",
            })
        })
    }
    else {
        res.json({
            payment_status: "faliure",
            subscription_status: "faliure",
        })
    }



});

//REDIRECT TO HOMEPAGE
app.get('/', function (req, res) {

    res.render(path.join(__dirname + '/soupx/index.ejs'))

});

//REDIRECT TO PAYMENT PAGE
app.get('/payment', function (req, res) {

    res.render(path.join(__dirname + '/soupx/razorpay.ejs'))

});

//REDIRECT TO SUBSCRIPTION PAGE
app.get('/subscription', function (req, res) {

    res.render(path.join(__dirname + '/soupx/subscription.ejs'))
    // response.redirect("https://subscription.soupx.in/")

});

//REDIRECT TO EXPLORE PAGE
app.get('/explore', function (request, response) {

    response.render(path.join(__dirname + '/soupx/explore.ejs'))

});

//REDIRECT TO FAQ PAGE
app.get('/faq', function (request, response) {

    response.render(path.join(__dirname + '/soupx/faq'))

});

//REDIRECT TO ABOUT US PAGE
app.get('/about-us', function (request, response) {

    response.render(path.join(__dirname + '/soupx/about'))

}, function (err) { });

//REDIRECT TO PRIVACY POLICY PAGE
app.get('/privacy-policy', function (request, response) {

    response.render(path.join(__dirname + '/soupx/privacy-policy'))
});

//REDIRECT TO REFUND POLICY PAGE
app.get('/refund-policy', function (request, response) {

    response.render(path.join(__dirname + '/soupx/refund-policy'))
});

//REDIRECT TO TnC PAGE
app.get('/terms-and-conditions', function (request, response) {

    response.render(path.join(__dirname + '/soupx/terms-and-conditions'))
});

// Start the server
app.listen(port);
console.log('Your server is running on port ' + port + '.');
