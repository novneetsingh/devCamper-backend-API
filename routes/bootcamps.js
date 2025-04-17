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

const { auth, isAuthorized } = require("../middlewares/auth");

router.route("/").get(getBootcamps).post(auth, isAuthorized, createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(auth, isAuthorized, updateBootcamp)
  .delete(auth, isAuthorized, deleteBootcamp);

router.put("/:id/photo", auth, isAuthorized, uploadBootcampPhoto);

router.get("/radius/:zipcode/:distance", getBootcampsInRadius);

module.exports = router;
