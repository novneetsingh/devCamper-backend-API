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

const { auth, isAuthorized } = require("../middlewares/auth");

router.get("/", getAllCourses);

router
  .route("/:id")
  .get(getCourseById)
  .put(auth, isAuthorized, updateCourse)
  .delete(auth, isAuthorized, deleteCourse);

router
  .route("/bootcamp/:bootcampId")
  .get(getCoursesByBootcampId)
  .post(auth, isAuthorized, createCourse);

module.exports = router;
