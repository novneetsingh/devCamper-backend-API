const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

// get all courses
exports.getAllCourses = async (req, res) => {
  const courses = await Course.find().populate({
    path: "bootcamp",
    select: "name description",
  });

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
};

// get all courses by bootcamp id
exports.getCoursesByBootcampId = async (req, res) => {
  const courses = await Course.find({
    bootcamp: req.params.bootcampId,
  }).populate({
    path: "bootcamp",
    select: "name description",
  });

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
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

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

// create a course by bootcamp id
exports.createCourse = async (req, res) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return new ErrorResponse(
      `No bootcamp found with the id of ${req.params.bootcampId}`,
      404
    );
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course,
  });
};
