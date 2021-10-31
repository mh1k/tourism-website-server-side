const { MongoClient } = require('mongodb');
const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle ware //
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ippt8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('tourism_site');
        const packageCollection = database.collection('packages');
        const ordersCollection = database.collection('orders');
        const othersplaceCollection = database.collection('othersplace');
        const bangladeshCollection = database.collection('bangladeshplace');

        // GET PACKAGE API
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

        // POST PACKAGE API 

        app.post('/packages', async (req, res) => {

            const newPackage = req.body;
            const result = await packageCollection.insertOne(newPackage);
            console.log("got new user", req.body);
            console.log("added user", result);
            res.json(result)

        })

        //Ohters place collection
        app.get('/othersplace', async (req, res) => {
            const cursor = othersplaceCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });
        
        
        //Bangladesh place collection
        app.get('/banglaplace', async (req, res) => {
            const cursor = bangladeshCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });


        // GET ORDERS API
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

        //Use Query for My Order 
        app.get('/order', async (req, res) => {
            const search = req.query.search;
            console.log(req.query.search);
            const query = { userEmail: search }
            const cursor = await ordersCollection?.find(query);
            const packages = await cursor.toArray();
            // console.log(package);
            res.send(packages)

        });

        //UPDATED API

        app.put('/orders/:id', async (req, res) => {

            const id = req.params.id;
            const updateBooking = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateBooking.status
                }
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options);
            console.log(req.body);
            res.json(result)

        })

        //Delete Order
        app.delete('/orders/:id', async (req, res) => {

            const id = req.params.id;
            console.log(("delete product with id", id));
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);

        })


        // SINGLE GET API 

        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await packageCollection.findOne(query);
            // console.log("load user with id", id, productsCollection);
            res.send(product);
        })

        // POST API 

        app.post('/orders', async (req, res) => {

            const newProduct = req.body;
            const result = await ordersCollection.insertOne(newProduct);
            console.log("got new user", req.body);
            console.log("added user", result);
            res.json(result)

        })



    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Tourism Server');
});


app.listen(port, () => {
    console.log('Running Tourism Server on port', port);
});