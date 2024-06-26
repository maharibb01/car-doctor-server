const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@dbcluster.equ9ury.mongodb.net/?retryWrites=true&w=majority&appName=DBCluster`;

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

    const serviceCollection = client.db("cardoctor").collection("services");
    const bookingCollection = client.db("cardoctor").collection("bookings");

    // service related operation
    app.get("/services", async (req, res) => {
      const result = await serviceCollection.find().toArray();
      res.send(result);
    })

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const result = await serviceCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    })

    // booking related operation
    app.get("/bookings", async (req, res) => {
      let query = {}
      console.log(req.query);
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    })

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      res.send(result)
    })

    app.patch("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBooking = req.body;
      const updateDoc = {
        $set: {
          status: updatedBooking.status
        }
      }
      const result = await bookingCollection.updateOne({ _id: new ObjectId(id) }, updateDoc)
      res.send(result);
    })

    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const result = await bookingCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", async (req, res) => {
  res.send("car doctor server is running");
})

app.listen(port, () => {
  console.log(`car doctor server is running on port ${port}`);
})