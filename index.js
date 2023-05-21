require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// MONGODB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ichdzcf.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const toys = client.db("legoDB").collection("toys");

        app.post('/toys',async(req,res)=>{
            const newToy = req.body;
            console.log(newToy);
            const result = await toys.insertOne(newToy);
            res.send(result);
        })


        // getting all toys and users toys
        app.get('/toys', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { seller_mail: req.query.email };
            }
            const result = await toys.find(query).toArray();
            res.send(result);
        })
        app.get('/alltoys', async (req, res) => {
            const result = await toys.find().limit(20).toArray();
            res.send(result);
        })

        app.get('/toy/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const toy = await toys.findOne(query);
            res.send(toy);
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
// MONGODB


app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER, process.env.DB_PASS);

app.get('/', (req, res) => {
    res.send('lego server running')

})
app.listen(port, () => {
    console.log('lego server is running on port - ', port);
})