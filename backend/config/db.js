const mongoose = require("mongoose");
require('dotenv').config();
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected you are good to GO!");
  } catch (error) {
    console.error(`Error:${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
