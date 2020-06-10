const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    email: String,
    country: String,
    car_model_year: Number,
    car_color: String,
    gender: String,
    job_title: String,
    bio: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
