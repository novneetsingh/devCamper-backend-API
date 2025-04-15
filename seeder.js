const fs = require("fs");
const Bootcamp = require("./models/Bootcamp");

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`./data/bootcamps.json`, "utf-8"));

require("dotenv").config(); // load environment variables

// connect to db
require("./config/database").connectDB();

// create bootcamps
const createBootcamps = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Bootcamps created");
    process.exit(0);
  } catch (error) {
    console.log(error);
  }
};

// delete all bootcamps
const deleteBootcamps = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("Bootcamps deleted");
    process.exit(0);
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-create") {
  createBootcamps();
} else if (process.argv[2] === "-delete") {
  deleteBootcamps();
}
