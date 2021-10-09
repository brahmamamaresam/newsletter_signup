let express = require("express");
let bodyParser = require("body-parser");
let request = require("request");
let https = require("https");
// const { response } = require("express");

let PORT = 3000;
let app = express();

app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {
    let fName = req.body.firstName;
    let lName = req.body.lastName;
    let email = req.body.email;
    let data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fName,
                LNAME: lName
            }
        }]
    };

    let jsonData = JSON.stringify(data);

    const url = "https://us5.api.mailchimp.com/3.0/lists/f76396527c";
    const options = {
        method: "POST",
        auth: "brahmam1:f5e04232564012d6adde8c09fcc902b-us5"
    }
    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            console.log(JSON.parse(data));
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(PORT, () => {
    console.log("server is listening on port " + PORT);
})


// api key
// 92035cda527ed0335b14c52537b1f82d-us5
// 9f5e04232564012d6adde8c09fcc902b-us5
// list ID
// f76396527c