const express = require("express");
const asyncHandler = require("express-async-handler");
const serverless = require("serverless-http");
const cors = require("cors");

const { initDb: mongoRun } = require("../mongodb");

require("dotenv/config");

const districtList = require("../seed-data/districtList.json");
const provinceList = require("../seed-data/provinceList.json");
const wardList = require("../seed-data/wardList.json");

const app = express();
const router = express.Router();

// console.log(process.env.MODE);

// var whitelist = ["https://dacntt2-n092-fe.netlify.app"];
// var corsOptions = {
//   origin: function (origin, callback) {
//     callback(null, true);

//     if (process.env.MODE === "LOCAL" || process.env.MODE === "DEV") {
//       callback(null, true);
//       return;
//     }
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(cors());

router.get("/init", async (req, res, next) => {
  const result = await mongoRun()
    .then((e) => res.json({ message: e }))
    .catch((e) => res.status(400).json({ message: e }));
});

router.get("/districts", (req, res) => {
  res.send(districtList);
});
router.get("/provinces", (req, res) => {
  res.send(provinceList);
});
router.get("/wards", (req, res) => {
  res.send(wardList);
});

// //delete existing record
// router.delete("/", (req, res) => {
//   res.send("Deleted existing record");
// });

// //updating existing record
// router.put("/", (req, res) => {
//   res.send("Updating existing record");
// });

// // app.use("/api", router);
app.use("/.netlify/functions/api", router);

if (process.env.MODE === "LOCAL") {
  app.listen(5000, () => {
    console.log(`Example app listening on port ${5000}`);
  });
}

module.exports.handler = serverless(app);
