const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express()

const hostname = process.env.HOSTNAME || localhost;
const port = process.env.PORT || 3000;

const connectDb = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("Check URI")
        }

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        })
        console.log("Mongo Atlas connected succesfully")
    }catch(err){
        console.error("Mongo Atlas connection error:", err)
        process.exit(1)
    }   
}

connectDb();

app.get('/', (req, res) => {
    res.send("This is the Cyan API");
}) 

app.listen(port, () => {
    console.log(`Cyan server is running at http://${hostname}:${port}/`)
    console.log("Cyan Api armed and ready ...")
})