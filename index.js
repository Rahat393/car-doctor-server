const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lnoy20s.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  


async function run() {
  try{
    const servicesCollection = client.db("carDoctor").collection("services")
    const ordersCollection = client.db("carDoctor").collection("orders")
    

    app.get('/services', async(req, res) => {
      const query = {};
      const result = await servicesCollection.find(query).toArray()
      res.send(result)
    });

    app.get('/services/:id', async(req,res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await servicesCollection.findOne(filter) ;
      res.send(result)
    })

    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.send(result)
    })

    app.get('/orders', async (req, res) => {
      let query = {};

      if (req.query.email) {
          query = {
              email: req.query.email
          }
      }
      const cursor = ordersCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
  });

  app.delete('/orders/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await ordersCollection.deleteOne(query);
    res.send(result);
});

app.patch('/orders/:id', async (req, res) => {
  const id = req.params.id;
  const status = req.body.status
  const query = { _id: new ObjectId(id) }
  const updatedDoc = {
      $set: {
          status: status
      }
  }
  const result = await ordersCollection.updateOne(query, updatedDoc);
  res.send(result);
})

  }
  finally{

  }
}
run().catch(console.log )

app.get('/', async(req, res) => {
  res.send('car doctor is running')
});

app.listen(port, () => console.log( `car doctor is running on ${port}`))