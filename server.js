const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

require("dotenv").config(); // load the environment variables

// import routes
const bootcampRoutes = require("./routes/bootcamps");
const courseRoutes = require("./routes/courses");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/reviews");

// connect to the database
require("./config/database").connectDB();

// enable cors
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse file upload and limits the size of the file
app.use(fileupload());

// Middleware to secure the headers
app.use(helmet());

// Middleware to prevent parameter pollution
app.use(hpp());

// Middleware to sanitize the data
app.use((req, res, next) => {
  req.body = mongoSanitize.sanitize(req.body); // Sanitize only req.body
  next();
});

// // Middleware to sanitize the data from xss attacks
app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      req.body[key] = xss(req.body[key]); // Sanitizing each body field
    }
  }

  if (req.query) {
    for (const key in req.query) {
      req.query[key] = xss(req.query[key]); // Sanitizing each query param
    }
  }

  next(); // Proceed to the next middleware/route handler
});

// Middleware to limit the number of requests
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

// mount the routes
app.use("/api/v1/bootcamps", bootcampRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/reviews", reviewRoutes);

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
app.use((err, req, res, next) => {
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
