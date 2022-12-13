const mongoose = require("mongoose");
const { logger } = require("../logger");
require("dotenv").config();

// const uri =
//   "mongodb+srv://" +
//   process.env.DB_USERNAME +
//   ":" +
//   process.env.DB_PASSWORD +
//   "@cluster0.kmgizju.mongodb.net/" +
//   process.env.DB_NAME +
//   "?retryWrites=true&w=majority";
const uri =
  "mongodb://localhost:27017/slack_connect_test?retryWrites=true&w=majority";

const connect = async function () {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.set("debug", (collectionName, method, query, doc) => {
    logger.info(
      `${collectionName}.${method} ${JSON.stringify(query)} ${JSON.stringify(
        doc
      )}`
    );
  });
};

module.exports = {
  connect,
};
