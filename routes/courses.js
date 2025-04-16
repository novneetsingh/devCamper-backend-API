const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getAllCourses,
  getCourseById,
  getCoursesByBootcampId,
  createCourse,
} = require("../controllers/courses");

router.get("/", getAllCourses);

router.get("/:id", getCourseById);

router
  .route("/bootcamp/:bootcampId")
  .get(getCoursesByBootcampId)
  .post(createCourse);

module.exports = router;
