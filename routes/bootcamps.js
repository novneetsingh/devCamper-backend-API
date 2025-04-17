const express = require("express");
const router = express.Router();

const {
  getBootcamps,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  uploadBootcampPhoto,
} = require("../controllers/bootcamps");

const { auth } = require("../middlewares/auth");

router.route("/").get(getBootcamps).post(auth, createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(auth, updateBootcamp)
  .delete(auth, deleteBootcamp);

router.put("/:id/photo", auth, uploadBootcampPhoto);

router.get("/radius/:zipcode/:distance", getBootcampsInRadius);

module.exports = router;
