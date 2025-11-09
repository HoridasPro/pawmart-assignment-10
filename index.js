const express = require("express");
const cors = require("cors");
// const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.JSON || 3000;

// middleware
app.use(cors());
app.use(express.json());
// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.mulyrzf.mongodb.net/?appName=Cluster0";
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

app.get("/", (req, res) => {
  res.send("hello welcome to my project");
});

app.listen(port, () => {
  console.log(`Port is runnign on this port ${port}`);
});
