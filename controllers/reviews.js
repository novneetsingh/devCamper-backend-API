const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const { advancedQuery } = require("../utils/advancedQuery");

// get all reviews
exports.getAllReviews = async (req, res) => {
  const { filter, select, sort, skip, limit } = advancedQuery(req.query);

  const reviews = await Review.find(filter)
    .select(select || "")
    .sort(sort || "-createdAt")
    .skip(skip)
    .limit(limit)
    .populate("bootcamp");

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
};

// get review by id
exports.getReview = async (req, res) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!review) {
    throw new ErrorResponse("Review not found", 404);
  }

  res.status(200).json({
    success: true,
    data: review,
  });
};

// create a review
exports.createReview = async (req, res) => {
  req.body.user = req.user.id;
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.body.bootcamp);

  if (!bootcamp) {
    throw new ErrorResponse("Bootcamp not found", 404);
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
};

// update a review
exports.updateReview = async (req, res) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    throw new ErrorResponse("Review not found", 404);
  }

  // check if the user is the owner of the review or admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    throw new ErrorResponse("Not authorized to update this review", 403);
  }

  // Update fields manually
  review.title = req.body.title || review.title;
  review.text = req.body.text || review.text;
  review.rating = req.body.rating || review.rating;

  await review.save(); // triggers post('save') hook

  res.status(200).json({
    success: true,
    data: review,
  });
};

// delete a review
exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new ErrorResponse("Review not found", 404);
  }

  // check if the user is the owner of the review or admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    throw new ErrorResponse("Not authorized to delete this review", 403);
  }

  await review.remove();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
};
