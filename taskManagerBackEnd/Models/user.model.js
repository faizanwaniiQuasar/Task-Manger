const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide user name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: [validator.isEmail, "Please enter a valid email"],
    unique: true,
    lowwercase: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, "Please Enter your password"],
    select: false,
  },
  confirmPassword: {
    type: String,
    minlength: 8,
    required: [true, "Please ReEnter your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "passwords are not same",
    },
  },
  tasks: [
    {
      name: String,
      description: String,
      completed: Boolean,
    },
  ],
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  // if password is modified then only this function will run
  if (!this.isModified("password")) return next();

  // hashing password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //removing password confirm field
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  //false mean not changed
  return false;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
