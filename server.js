const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Add CORS to allow cross-origin requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

async function connectToDatabase() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Successfully Connected to MongoDB');
    
    // Log database and collection details
    const database = client.db('user-chat');
    const collections = await database.listCollections().toArray();
    console.log('Available Collections:', collections.map(c => c.name));
    
    return database.collection('chat-history');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    throw error;
  }
}

app.get('/api/chat-records', async (req, res) => {
  try {
    const collection = await connectToDatabase();
    
    // Count documents first
    const documentCount = await collection.countDocuments();
    console.log(`Total Documents in Collection: ${documentCount}`);
    
    // Fetch all documents
    const chatRecords = await collection.find({}).toArray();
    
    console.log('Fetched Records:', chatRecords.length);
    
    res.json(chatRecords);
  } catch (error) {
    console.error('Error in /api/chat-records endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch chat records', 
      details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});