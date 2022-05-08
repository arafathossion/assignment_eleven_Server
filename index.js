const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { send } = require('express/lib/response');
require('dotenv').config();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.x8cmc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db("vegetableWearhouse");
        const vegetableItem = database.collection("vegetableItem");

        app.get('/vegetableItems', async (req, res) => {
            const query = {};
            const cursor = vegetableItem.find(query);
            const singleItem = await cursor.toArray();
            res.send(singleItem);
        })
        // Load All Data

        app.get('/vegetableItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleItems = await vegetableItem.findOne(query);
            res.send(singleItems)
        })
        // Single Item

        app.put('/quantity/:id', async (req, res) => {
            const id = req.params.id;
            const updateQuantity = req.body; 
            console.log(updateQuantity)
            console.log(id)
            const filter = {_id: ObjectId(id)};
            // console.log(filter)
            const options = {upsert : true};
            const updatedDoc = {
                $set:{
                    quantity: updateQuantity.reduceQuantity,
                }
            }
            const result = await vegetableItem.updateOne(filter,updatedDoc,options);
            res.send(result)
        })
        // Update Quantity



        app.post('/additem', async (req, res) => {
            const addItem = req.body;
            const result = await vegetableItem.insertOne(addItem);
            res.send(result)
        })
        // Add New Item


        app.get('/myitems', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = vegetableItem.find(query);
            const singleItem = await cursor.toArray();
            res.send(singleItem);
        })
        // My Items


       
  
        

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})