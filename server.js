const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const BASE_PATH = process.env.BASE_PATH;
const MONGO_URI = process.env.MONGO_URI; // MongoDB connection string from .env

// Use middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Connect to MongoDB
let db;
MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db('school'); // Replace 'your-database-name' with the actual database name
        console.log('Connected to Database. . .');
   })
    .catch(error => console.error(error));

// Define your object
const myObject = {
    name: 'Danish Raza',
    Uni: 'University of Gujrat',
    // Add more key-value pairs as needed
};

// Define a route to expose your object via API
app.get('/api/object', (req, res) => {
    res.status(200).json(myObject);
});

app.post('/api/data', (req, res) => {
    const data = req.body;
    db.collection('students').insertOne(data) // Replace 'your-collection-name' with your collection name
        .then(result => {
            res.status(201).json(result);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'An error occurred' });
        });
});

// Define a route to fetch all documents from the MongoDB collection
app.get('/api/data', (req, res) => {
    db.collection('students').find().toArray()
        .then(results => {
            res.status(200).json(results);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'An error occurred' });
        });
});

// Define a route to delete a document from the MongoDB collection
app.delete('/api/data/:id', (req, res) => {
    const id = req.params.id;
    db.collection('students').deleteOne({ _id: new ObjectId(id) })
        .then(result => {
            if (result.deletedCount === 1) {
                res.status(200).json({ message: 'Document deleted' });
            } else {
                res.status(404).json({ message: 'Document not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'An error occurred' });
        });
});

app.get('/', (req, res) => {
    console.log("Is it working?");
    res.send(`<div><h1>Welcome to the NodeApp</h1><img src="${BASE_PATH}/free-photo/abstract-autumn-beauty-multi-colored-leaf-vein-pattern-generated-by-ai_188544-9871.jpg?w=2000&t=st=1719179562~exp=1719180162~hmac=ec6c473e0380077aaadd677a0710b63518accb3dd4c733067b6437ac9a7b54ba" /></div>`);
});

app.get('/exit', (req, res) => {
    // Perform actions to stop the server or any other desired actions
    res.send('Server stopped');
    process.exit(0); // This stops the server (not recommended in production)
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

