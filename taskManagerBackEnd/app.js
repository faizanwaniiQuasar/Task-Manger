const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const tasks = require("./Routes/task.routes");
const users = require("./Routes/user.route");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./Controllers/error.controller");
const app = express();
app.use(cors());
dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 3000;
app.use(express.json());
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);

// mongoose
//   .connect(DB)
//   .then(() => {
//     console.log("database connected");
//     app.listen(port, () => {
//       console.log(`app is running on port ${port} `);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });

const start = async () => {
  try {
    await mongoose.connect(DB).then(() => {
      console.log("database connected");
      app.listen(port, () => {
        console.log(`app is running on port ${port} `);
      });
    });
  } catch (err) {
    console.log(err);
  }
};
start();

app.use("/api/v1/tasks", tasks);
app.use("/api/v1/auth", users);
app.all("*", (req, res, next) => {
  // res
  //   .status(404)
  //   .json({
  //     status: "fail",
  //     message: `Can't find ${req.originalUrl} on this server`,
  //   });

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
