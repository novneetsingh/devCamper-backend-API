const express = require("express");
const path = require("path");
const app = express();
const fileupload = require("express-fileupload");
require("dotenv").config();

// import routes
const bootcampRoutes = require("./routes/bootcamps");
const courseRoutes = require("./routes/courses");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

// connect to the database
require("./config/database").connectDB();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse file upload and limits the size of the file
app.use(fileupload());

// mount the routes
app.use("/api/v1/bootcamps", bootcampRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

// default route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Express server!",
    data: {
      name: "Express Server",
    },
  });
});

// Error handling middleware
app.use((err, res) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
