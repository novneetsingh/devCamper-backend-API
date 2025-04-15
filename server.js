const express = require("express");
const app = express();
require("dotenv").config();

// import routes
const bootcampRoutes = require("./routes/bootcamps");

// connect to the database
require("./config/database").connectDB();

// Middleware to parse JSON request bodies
app.use(express.json());

app.use("/api/v1/bootcamps", bootcampRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Express server!",
    data: {
      name: "Express Server",
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
