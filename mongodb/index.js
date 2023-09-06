const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const districtList = require("../seed-data/districtList.json");
const provinceList = require("../seed-data/provinceList.json");
const wardList = require("../seed-data/wardList.json");
const { TINTUC_STATUS } = require("../constants/tintuc");

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
    // await client.close();
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

client.connect();

async function initDb() {
  // const db = await (await client.connect()).db(dbConfig.database);
  try {
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
    // await client.close();
  }
}

async function getProvinces() {
  try {
    await client.connect();
    const db = client.db(dbConfig.database);
    return await db.collection("provinces").find().toArray();
  } finally {
    // await client.close();
  }
}

async function dangTinTuc(data) {
  try {
    await client.connect();
    const db = client.db(dbConfig.database);
    return await db.collection("tintuc").insertOne({
      data: { ...data.data, status: TINTUC_STATUS.SUBMITTED },
    });
  } finally {
    // await client.close();
  }
}

async function updateTinTuc(data) {
  try {
    await client.connect();
    const db = client.db(dbConfig.database);
    await db
      .collection("tintuc")
      .updateOne(
        { _id: new ObjectId(data?.data?._id) },
        { $set: { "data.status": data?.data?.status } }
      );
  } finally {
    // await client.close();
  }
}

async function deleteTinTuc(data) {
  try {
    await client.connect();
    const db = client.db(dbConfig.database);
    await db
      .collection("tintuc")
      .deleteOne(
        { _id: new ObjectId(data?.data?._id) },
        // { $set: { "data.status": data?.data?.status } }
      );
  } finally {
    // await client.close();
  }
}

async function listDuAn({
  province,
  district,
  ward,
  pageSize = 3,
  currentPage = 1,
  status,
  user,
}) {
  const filter = {};
  if (province) {
    filter["data.province"] = province;
  }
  if (district) {
    filter["data.district"] = district;
  }
  if (ward) {
    filter["data.ward"] = ward;
  }
  if (status) {
    filter["data.status"] = status;
  }
  if (user) {
    filter["data.user"] = user;
  }
  try {
    await client.connect();
    const db = client.db(dbConfig.database);
    return await db
      .collection("tintuc")
      .find(filter)
      .sort({ $natural: -1 })
      .skip(pageSize * (currentPage - 1))
      .limit(+pageSize)
      .toArray();
    // .filter(
    //   (e) =>
    //     e.province == (province || true) &&
    //     e.district == (district || true) &&
    //     e.ward == (ward || true)
    // );
  } finally {
    // await client.close();
  }
}

async function duAn({ id }) {
  try {
    await client.connect();
    const db = client.db(dbConfig.database);
    const tintuc = await db
      .collection("tintuc")
      .findOne({ _id: new ObjectId(id) });
    return {
      ...tintuc.data,
      _id: tintuc._id,
      province: provinceList.find((p) => p.provinceId == tintuc.data.province),
      district: districtList.find((p) => p.districtId == tintuc.data.district),
      ward: wardList.find((p) => p.wardId == tintuc.data.ward),
    };
  } finally {
    // await client.close();
  }
}

// const initDb = () =>
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("foo");
//     }, 300);
//   });

module.exports = {
  initDb,
  getProvinces,
  dangTinTuc,
  listDuAn,
  duAn,
  updateTinTuc,
  deleteTinTuc,
};
