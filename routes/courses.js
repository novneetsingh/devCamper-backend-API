const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getAllCourses,
  getCourseById,
  getCoursesByBootcampId,
} = require("../controllers/courses");

router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.get("/bootcamp/:bootcampId", getCoursesByBootcampId);

module.exports = router;
