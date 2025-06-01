const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const client = new MongoClient(MONGO_URI);
let db;

const connectToDB = async () => {
  if (!db) {
    await client.connect();
    db = client.db("clearpath");
    console.log("MongoDB connected");
  }
  return db;
};

module.exports = { connectToDB };
