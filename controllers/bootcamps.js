const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");

// create a new bootcamp
exports.createBootcamp = async (req, res) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
};

// get all bootcamps
exports.getBootcamps = async (req, res) => {
  const bootcamps = await Bootcamp.find();

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
};

// get a single bootcamp by id
exports.getBootcamp = async (req, res) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

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

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
};

// delete a bootcamp
exports.deleteBootcamp = async (req, res) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    throw new ErrorResponse("Bootcamp not found", 404);
  }

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

