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

const { auth } = require("../middlewares/auth");

router.get("/", getAllCourses);

router
  .route("/:id")
  .get(getCourseById)
  .put(auth, updateCourse)
  .delete(auth, deleteCourse);

router
  .route("/bootcamp/:bootcampId")
  .get(getCoursesByBootcampId)
  .post(auth, createCourse);

module.exports = router;
