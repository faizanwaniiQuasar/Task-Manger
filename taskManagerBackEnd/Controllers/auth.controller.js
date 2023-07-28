const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const User = require("../Models/user.model");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const signToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);

  //here only specific info is required to create a simple user without making a user adim
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = signToken(newUser._id, newUser.name);
  res.status(201).json({
    status: "succes",
    token,
    data: {
      user: newUser,
    },
  });
});
const login = catchAsync(async (req, res, next) => {
  //destructure variables from req body
  const { email, password } = req.body;

  // check if email and password exist
  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }

  //check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  // console.log(user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  ///if everything is ok send token
  const token = signToken(user._id, user.name);

  res.status(200).json({
    status: "success",
    token,
  });
});

// middleware for protected routes
const protect = catchAsync(async (req, res, next) => {
  // 1)Getting token and check if it exists there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }
  // 2)  here we are verifying token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("User belonging to the token does not exist", 401)
    );
  }
  // 4)check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User changed password after the token was issued", 401)
    );
  }

  //GRANT access to the protected route
  req.user = freshUser;
  next();
});

module.exports = { signup, login, protect };
