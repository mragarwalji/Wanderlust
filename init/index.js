const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// MongoDB connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// connect to the database
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
// function to connect to the database
async function main() {
  await mongoose.connect(MONGO_URL);
}
// initialize the database with seed data
const initDB = async () => {
  // clear existing data
  await Listing.deleteMany({});

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "694905eb1e79dbb61852b020",
   }))
  // insert seed data
  await Listing.insertMany(initData.data);
  // close the connection
  console.log("data was initialized");
};
// run the initialization
initDB();