const mongoose = require("mongoose");
const env = require("env2")("./.env");
const mongo_url = process.env.MONGODB_URI;
const connection = mongoose.connect(mongo_url);
module.exports = { connection };
