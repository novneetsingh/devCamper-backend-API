const Course = require("../models/Course");
const ErrorResponse = require("../utils/errorResponse");

// get all courses
exports.getAllCourses = async (req, res) => {
  const courses = await Course.find();

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
};

// get all courses by bootcamp id
exports.getCoursesByBootcampId = async (req, res) => {
  const courses = await Course.find({ bootcamp: req.params.bootcampId });

  if (!courses) {
    return new ErrorResponse(
      `No courses found with the bootcamp id of ${req.params.bootcampId}`,
      404
    );
  }

  return res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
};

// get a single course by id
exports.getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return new ErrorResponse(
      `No course found with the id of ${req.params.id}`,
      404
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
};

