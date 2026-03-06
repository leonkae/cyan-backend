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

const postSchema = new mongoose.Schema({
    caption :{
        type: String,
        required : [true, "Caption is required"],
        trim:true,
        maxlength: [200, "Caption cannot exceed 200 characters"]
    },
    image: {
        type: String,
        required: [true, "Image URL is required"],
        trim: true,
    },
    category:{
        type: String,
        required: [true, "Category is required"],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }


});

const Posts = mongoose.model("Posts", postSchema);
connectDb();

app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Posts.find().sort({ createdAt: -1 });   
        res.json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

app.post('/api/posts', async (req, res) => {
    try {
        const { caption, image, category } = req.body;  
        const newPost = new Posts({ caption, image, category });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) { 
        console.error("Error creating post:", err);
        res.status(500).json({ error: "Failed to create post" });
    }   
});

app.get('/', (req, res) => {
    res.send("This is the Cyan API");
}) 

app.listen(port, () => {
    console.log(`Cyan server is running at http://${hostname}:${port}/`)
    console.log("Cyan Api armed and ready ...")
})