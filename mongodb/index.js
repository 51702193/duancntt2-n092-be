const { MongoClient, ServerApiVersion } = require("mongodb");

const districtList = require("../seed-data/districtList.json");
const provinceList = require("../seed-data/provinceList.json");
const wardList = require("../seed-data/wardList.json");

const uri =
  "mongodb+srv://51702193:vista1406@dacntt2cluster.ep5jzno.mongodb.net/?retryWrites=true&w=majority";
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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    // return "Pinged your deployment. You successfully connected to MongoDB!";
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// ////////////////

const dbConfig = {
  database: "DACNTT2",
  collections: [
    { name: "provinces", options: {}, seed: provinceList },
    { name: "districts", options: {}, seed: districtList },
    { name: "wards", options: {}, seed: wardList },
  ],
};

async function initDb() {
  // const db = await (await client.connect()).db(dbConfig.database);
  try {
    await client.connect();
    const db = client.db(dbConfig.database);

    const collectionsExists = await db.listCollections().toArray();
    // await Promise.all(
    //   collectionsExists?.map(async (collection) => {
    //     await db.dropCollection(collection.name);
    //   })
    // );

    // await Promise.all(
    //   dbConfig.collections?.map(async (collection) => {
    //     await db.createCollection(collection.name, collection.options);
    //     await db.collection(collection.name).insertMany(collection.seed || []);
    //   })
    // );

    return collectionsExists;
  } finally {
    await client.close();
  }
}

async function getProvinces() {
  try {
    await client.connect();
    const db = client.db(dbConfig.database);
    return await db.collection("provinces").find({}).toArray();
  } finally {
    await client.close();
  }
}

// const initDb = () =>
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("foo");
//     }, 300);
//   });

module.exports = { initDb, getProvinces };
