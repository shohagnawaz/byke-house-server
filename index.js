const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pnaw0g1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const bykeCollection = client.db("byke-house").collection("bykes");

    app.get("/bykes", async(req, res) => {
        const bykes = await bykeCollection.find().toArray();
        res.send(bykes); 
    });

    app.get("/bykes", async(req, res) => {
        const userEmail = req.query.email;
        const query = userEmail? { created_by: userEmail } : {};
        const options = {
          sort: { createdAt: -1 }
        };
        const carts = await bykeCollection.find(query, options).toArray();
        res.send(carts)
    });

    app.post("/bykes", async(req, res) => {
        const item = req.body;
        const result = await bykeCollection.insertOne(item);
        res.send(result);
    });

    app.delete("/bykes/:id", async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bykeCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("byke server is running")
});

app.listen(port, () => {
    console.log(`byke server is running on port: ${port}`)
});