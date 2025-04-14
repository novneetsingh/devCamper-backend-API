const express = require("express");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;

// import routes
const userRoutes = require("./routes/users");

// connect to the database
require("./config/database").connectDB();

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Express server!",
    data: {
      name: "Express Server",
    },
  });
});

// Middleware to parse JSON request bodies
app.use(express.json());

app.use("/api/v1/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
