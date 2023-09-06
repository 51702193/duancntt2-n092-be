const express = require("express");
const asyncHandler = require("express-async-handler");
const serverless = require("serverless-http");
const cors = require("cors");
const path = require("path");

const {
  initDb,
  getProvinces,
  dangTinTuc,
  listDuAn,
  duAn,
  updateTinTuc,
  deleteTinTuc,
} = require("../mongodb");

require("dotenv/config");

const districtList = require("../seed-data/districtList.json");
const provinceList = require("../seed-data/provinceList.json");
const wardList = require("../seed-data/wardList.json");

// const image1 = require("./Picture1.jpg");
// console.log("🚀 ~ file: api.js:16 ~ image1:", image1)
// const image2 = require("./Picture2.jpg");
// const image3 = require("./Picture3.jpg");

const app = express();
const router = express.Router();
router.use(express.json({ limit: "50mb" }));
// router.use(express.bodyParser({ limit: "50mb" }));

// console.log(process.env.MODE);

var whitelist = ["https://dacntt2-n092-fe.netlify.app"];
var corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);

    if (process.env.MODE === "LOCAL" || process.env.MODE === "DEV") {
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

// app.use(cors(corsOptions));

app.use(
  cors({
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);
// app.use(express.json());

// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "*");
//   res.setHeader("Access-Control-Allow-Headers", "*");

//   next();
// });

router.get(
  "/init",
  asyncHandler(async (req, res) => {
    await initDb()
      .then((e) => res.json({ message: e }))
      .catch((e) => res.status(400).json({ message: e }));
  })
);

router.get("/", (req, res) => {
  res.send("demo");
});

router.get(
  "/provinces",
  asyncHandler(async (req, res) => {
    await getProvinces()
      .then((e) => res.json(e))
      .catch((e) => {
        console.log("e", e);
        res.status(400).json({ message: e });
      });
  })
);
router.get("/districts", (req, res) => {
  const result = districtList.filter(
    (e) => e.provinceId == (req.query.province || true)
  );
  res.send(result);
});
router.get("/wards", (req, res) => {
  const result = wardList.filter(
    (e) => e.districtId == (req.query.district || true)
  );
  res.send(result);
});

router.post(
  "/dang-tin-tuc",
  asyncHandler(async (req, res) => {
    await dangTinTuc(req.body)
      .then((e) => res.json(e))
      .catch((e) => {
        console.log("e", e);
        res.status(400).json({ message: e });
      });
  })
);

router.post(
  "/update-tin-tuc",
  asyncHandler(async (req, res) => {
    await updateTinTuc(req.body)
      .then((e) => res.json(e))
      .catch((e) => {
        console.log("e", e);
        res.status(400).json({ message: e });
      });
  })
);

router.post(
  "/xoa-tin-tuc",
  asyncHandler(async (req, res) => {
    await deleteTinTuc(req.body)
      .then((e) => res.json(e))
      .catch((e) => {
        console.log("e", e);
        res.status(400).json({ message: e });
      });
  })
);

router.get(
  "/list-du-an",
  asyncHandler(async (req, res) => {
    await listDuAn(req.query || {})
      .then((e) => res.json(e))
      .catch((e) => {
        console.log("e", e);
        res.status(400).json({ message: e });
      });
  })
);

router.get(
  "/du-an",
  asyncHandler(async (req, res) => {
    await duAn({ id: req.query.id })
      .then((e) => res.json(e))
      .catch((e) => {
        console.log("e", e);
        res.status(400).json({ message: e });
      });
  })
);

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
