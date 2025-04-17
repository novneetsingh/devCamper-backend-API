const fs = require("fs");
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require("./models/User");

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`./data/bootcamps.json`, "utf-8"));
const courses = JSON.parse(fs.readFileSync(`./data/courses.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`./data/users.json`, "utf-8"));

require("dotenv").config(); // load environment variables

// connect to db
require("./config/database").connectDB();

// create bootcamps
const createData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);

    console.log("Bootcamps, Courses and Users created");
    process.exit(0);
  } catch (error) {
    console.log(error);
  }
};

// delete all bootcamps
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();

    console.log("Bootcamps, Courses and Users deleted");
    process.exit(0);
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-create") {
  createData();
} else if (process.argv[2] === "-delete") {
  deleteData();
}
