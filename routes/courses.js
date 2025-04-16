const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getAllCourses,
  getCourseById,
  getCoursesByBootcampId,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

router.get("/", getAllCourses);

router.route("/:id").get(getCourseById).put(updateCourse).delete(deleteCourse);

router
  .route("/bootcamp/:bootcampId")
  .get(getCoursesByBootcampId)
  .post(createCourse);

module.exports = router;
