const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const { advancedQuery } = require("../utils/advancedQuery");
const path = require("path");

// create a new bootcamp
exports.createBootcamp = async (req, res) => {
  // add user id to req.body
  req.body.user = req.user.id;

  // check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // if the user is not an admin, they can only create one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    throw new ErrorResponse(
      `The user with ID ${req.user.id} has already published a bootcamp`,
      400
    );
  }

  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
};

// get all bootcamps
exports.getBootcamps = async (req, res) => {
  const { filter, select, sort, skip, limit } = advancedQuery(req.query);

  const bootcamps = await Bootcamp.find(filter)
    .select(select || "")
    .sort(sort || "-createdAt")
    .skip(skip)
    .limit(limit)
    .populate("courses");

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
};

// get a single bootcamp by id
exports.getBootcamp = async (req, res) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate("courses");

  if (!bootcamp) {
    throw new ErrorResponse("Bootcamp not found", 404);
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
};

// update a bootcamp by id
exports.updateBootcamp = async (req, res) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    throw new ErrorResponse("Bootcamp not found", 404);
  }

  // check if user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    throw new ErrorResponse(
      "You are not authorized to update this bootcamp",
      403
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
};

// delete a bootcamp
exports.deleteBootcamp = async (req, res) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    throw new ErrorResponse("Bootcamp not found", 404);
  }

  // check if user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    throw new ErrorResponse(
      "You are not authorized to delete this bootcamp",
      403
    );
  }

  // delete all courses associated with the bootcamp
  await bootcamp.remove();

  res.status(200).json({
    success: true,
    message: "Bootcamp deleted successfully",
    data: bootcamp,
  });
};

// get bootcamps within a radius
exports.getBootcampsInRadius = async (req, res) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Radius in radians
  const radius = distance / 3963; // use 6378 for km

  // Geospatial query
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
};

// upload photo for bootcamp
exports.uploadBootcampPhoto = async (req, res) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    throw new ErrorResponse("Bootcamp not found", 404);
  }

  // check if user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    throw new ErrorResponse(
      "You are not authorized to upload a photo for this bootcamp",
      403
    );
  }

  if (!req.files) {
    throw new ErrorResponse("Please upload a file", 400);
  }

  const file = req.files.image;

  // check if the file is an image
  if (!file.mimetype.startsWith("image")) {
    throw new ErrorResponse("Please upload an image file", 400);
  }

  // check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    throw new ErrorResponse(
      `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
      400
    );
  }

  // create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  // move the file to the uploads folder
  await file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`);

  // update bootcamp
  await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

  res.status(200).json({
    success: true,
    message: "Photo uploaded successfully",
    data: file.name,
  });
};
