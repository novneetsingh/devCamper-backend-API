const mongoose = require("mongoose");
const Bootcamp = require("./Bootcamp");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for the review"],
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  text: {
    type: String,
    required: [true, "Please add some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating between 1 and 10"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Call getAverageCost after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageCost before remove
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

// claculate average rating for each bootcamp
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  try {
    // find all reviews for the bootcamp
    const reviews = await this.find({ bootcamp: bootcampId }).select("rating");

    // calculate the total rating
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);

    // calculate the average rating
    const avg = total / reviews.length;

    // update the bootcamp with the average rating
    await Bootcamp.findByIdAndUpdate(bootcampId, {
      averageRating: Math.round(avg),
    });
  } catch (err) {
    console.error("Error calculating average rating:", err);
  }
};

module.exports = mongoose.model("Review", ReviewSchema);
