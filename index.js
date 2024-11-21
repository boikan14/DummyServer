const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = 3100
const cors = require('cors')
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
require("dotenv").config();
var bodyParser = require('body-parser')


// const uri = "mongodb+srv://vickeybhatnagar2323:Akt1205@mern.ebmszlo.mongodb.net/?retryWrites=true&w=majority&appName=MERN";

// const client = new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
//   });

//   async function run() {
//     try {
//       // Connect the client to the server	(optional starting in v4.7)
//       await client.connect();
//       // Send a ping to confirm a successful connection
//       await client.db("mern_tut");
//       console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//       // Ensures that the client will close when you finish/error
//       await client.close();
//     }
//   }
//   run().catch(console.dir);




const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    userId: String,
    mobile: Number,
    password: String
});

const Users = mongoose.model('Users', userSchema);




app.use(bodyParser.json());
app.use(cors());

var count = 0;
app.get('/', (req, res) => {


    getData();
    function getData() {
        count = count+1;
        const filePath = path.join(__dirname, 'mendix_jason.json');  
        fs.readFile(filePath, 'utf8', (err, data) => {  
            if (err) {  
                console.error('Error reading JSON file:', err);  
                return;  
            }  
            try {  
                var strJson = JSON.stringify(data);
                strJson = strJson.replaceAll("xxxx", (Math.floor(Math.random() * 99999999999999) + 1)
                .toString());
                strJson = strJson.replaceAll("yyyy", count);
                data = JSON.parse(strJson);
                const jsonData = JSON.parse(data);  
                res.send(jsonData);  
            } catch (jsonErr) {  
                console.error('Error parsing JSON data:', jsonErr);  
            }  
        });  

    }

})

app.post('/signup', async (req, res) => {

    await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log("Database connected!"))
        .catch(err => console.log(err));

    var myData = new Users(req.body);
    await myData.save()
        .then(item => {
            res.send("item saved to database");
            console.log(myData)
            res.status(200);
        })

    mongoose.connection.close();

})




app.post('/login', (req, res) => {




    var myData = req.body;
    var user = myData.userid;
    var password = myData.password;
    console.log(myData)
    pullData();
    async function pullData() {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(() => console.log("Database connected!"))
            .catch(err => console.log(err));
        const userData = await Users.find({ userId: user });
        userData.forEach(element => {
            if (user == element.userId) {
                if (password == element.password) {
                    res.send("Login successful")
                    res.status(200)
                }
                else {
                    res.send("Login Failed, wrong password")
                    res.status(401)

                }
            }
            else {
                res.send("Login Failed, user does not exist")
                res.status(401)
            }

        });


        mongoose.connection.close();
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})