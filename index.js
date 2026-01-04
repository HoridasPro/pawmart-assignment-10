const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mulyrzf.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const pawMartProject = client.db("pawMartProject");
    const productsCollection = pawMartProject.collection("products");
    const orderCollection = pawMartProject.collection("orders");
    const addListingCollection = pawMartProject.collection("add Listing");

    // For the get only one data
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    // For latest product
    app.get("/latest-products", async (req, res) => {
      const cursor = productsCollection.find().skip(4).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get all the data for the categories
    app.get("/products", async (req, res) => {
      const category = req.query.category;
      const query = {};
      if (category) {
        query.category = { $regex: new RegExp(category, "i") };
      }
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get for the orders
    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { orderProduct: id };
      const cursor = orderCollection.find(query).sort({ price: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });
    // get for the Download pdf
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/search", async (req, res) => {
      const search_text = req.query.search;
      let query = {};
      if (search_text) {
        query = { product_name: { $regex: search_text, $options: "i" } };
      }

      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    //For the my listing
    app.get("/myListings", async (req, res) => {
      const email = req.query.email;
      const cursor = addListingCollection
        .find({ email: email })
        .sort({ date: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });
    //For the my orders
    app.get("/myOrders", async (req, res) => {
      const email = req.query.email;
      const cursor = orderCollection.find({ email: email }).sort({ date: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/addListing", async (req, res) => {
      const email = req.query.email;
      const cursor = addListingCollection
        .find({ email: email })
        .sort({ date: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });
    // For the update
    app.get("/addListing/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addListingCollection.findOne(query);
      res.send(result);
    });

    // For the post to orders
    app.post("/orders", async (req, res) => {
      const newProduct = req.body;
      const result = await orderCollection.insertOne(newProduct);
      res.send(result);
    });
    // For the post to orders
    app.post("/addListing", async (req, res) => {
      const newProduct = req.body;
      const result = await addListingCollection.insertOne(newProduct);
      res.send(result);
    });

    // For the patch
    app.patch("/addListing/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updatedProduct.product_name,
          category: updatedProduct.category,
          price: updatedProduct.price,
          location: updatedProduct.location,
          description: updatedProduct.description,
          image: updatedProduct.photo,
          date: updatedProduct.date,
          email: updatedProduct.email,
        },
      };
      const result = await addListingCollection.updateOne(query, update);
      res.send(result);
    });

    // For the delete
    app.delete("/addListing/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addListingCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
