const express = require("express");
const router = express.Router();

const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

const { auth, isUserOrAdmin } = require("../middlewares/auth");

router.get("/", getAllReviews);

router.post("/bootcamp/:bootcampId", auth, isUserOrAdmin, createReview);

router
  .route("/:id")
  .get(getReview)
  .put(auth, isUserOrAdmin, updateReview)
  .delete(auth, isUserOrAdmin, deleteReview);

module.exports = router;
