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

router.route("/").get(getBootcamps).post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.put("/:id/photo", uploadBootcampPhoto);

router.get("/radius/:zipcode/:distance", getBootcampsInRadius);

module.exports = router;
