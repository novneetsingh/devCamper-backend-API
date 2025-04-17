const mongoose = require("mongoose");
const Bootcamp = require("./Bootcamp");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
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

// calculate average cost when a new course is created
CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// calculate average cost when a course is removed
CourseSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  try {
    const courses = await this.find({ bootcamp: bootcampId }).select("tuition");

    const total = courses.reduce((acc, course) => acc + course.tuition, 0);

    const avg = total / courses.length;

    await Bootcamp.findByIdAndUpdate(bootcampId, {
      averageCost: Math.round(avg),
    });
  } catch (err) {
    console.error("Error calculating average cost:", err);
  }
};

module.exports = mongoose.model("Course", CourseSchema);
