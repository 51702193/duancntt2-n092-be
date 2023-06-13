import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import "dotenv/config";
// const express = require("express");
// const serverless = require("serverless-http");
// const cors = require("cors");

// console.log(process.env);

const app = express();
const router = express.Router();

console.log(process.env.MODE);

var whitelist = ["https://dacntt2-n092-fe.netlify.app"];
var corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
    return;
    if (process.env.MODE === "LOCAL") {
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

//Create new record
router.post("/add", (req, res) => {
  res.send("New record added.");
});

//delete existing record
router.delete("/", (req, res) => {
  res.send("Deleted existing record");
});

//updating existing record
router.put("/", (req, res) => {
  res.send("Updating existing record");
});

//showing demo records
router.get("/demo", (req, res) => {
  res.json([
    {
      id: "001",
      name: "Smith",
      email: "smith@gmail.com",
    },
    {
      id: "002",
      name: "Sam",
      email: "sam@gmail.com",
    },
    {
      id: "003",
      name: "lily",
      email: "lily@gmail.com",
    },
  ]);
});

app.use("/api", router);
// app.use("/.netlify/functions/api/", router);

if (process.env.MODE === "LOCAL") {
  app.listen(5000, () => {
    console.log(`Example app listening on port ${5000}`);
  });
}

exports.handler = serverless(app);
// module.exports.handler = serverless(app);
