const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

// middleware
app.use(cors());
app.use(express.json());

//*** Connecting with client side ****/ 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e27x00p.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        // Make Database and Get data from Client side
        const coffeeCollection = client.db('coffeeDB').collection('coffee')

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Coffee maker server is running')
})

app.listen(port, () => {
    console.log(`Coffee Making app listening on port: ${port}`);
})