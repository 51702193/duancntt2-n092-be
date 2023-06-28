const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

require("dotenv/config");

const districtList = require("../seed-data/districtList.json");
const provinceList = require("../seed-data/provinceList.json");
const wardList = require("../seed-data/wardList.json");

const app = express();
const router = express.Router();

console.log(process.env.MODE);

var whitelist = ["https://dacntt2-n092-fe.netlify.app"];
var corsOptions = {
  origin: function (origin, callback) {
    console.log("run2");
    callback(null, true);

    if (process.env.MODE === "LOCAL" || process.env.MODE === "DEV") {
      console.log("run");
      callback(null, true);
      return;
    }
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

//Get all students
router.get("/", (req, res) => {
  res.send("App is running..");
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

//delete existing record
router.delete("/", (req, res) => {
  res.send("Deleted existing record");
});

//updating existing record
router.put("/", (req, res) => {
  res.send("Updating existing record");
});

// app.use("/api", router);
app.use("/.netlify/functions/api", router);

if (process.env.MODE === "LOCAL") {
  app.listen(5000, () => {
    console.log(`Example app listening on port ${5000}`);
  });
}

module.exports.handler = serverless(app);
