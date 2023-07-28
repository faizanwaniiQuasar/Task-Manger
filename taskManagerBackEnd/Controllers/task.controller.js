const Task = require("../Models/tasks.model");
const User = require("../Models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
// to get all the tasks
const getAllTasks = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  // console.log(id);
  const user = await User.findById(id);
  res.status(200).json({
    status: "success",
    message: "successfully fetched all the tasks",
    data: {
      tasks: user.tasks,
      // user,
    },
  });
});

// to get a unique task by its id
const getTask = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    // return res.status(404).json({ msg: `No task with this id ${id}` });
    return next(new AppError(`No User found with this id `, 404));
  }
  const task = await user.tasks.id(req.params.id);
  if (!task) {
    // return res.status(404).json({ msg: `No task with this id ${id}` });
    return next(new AppError(`No task found with this id`, 404));
  }
  res.status(200).json({
    status: "success",
    message: "Task successfully fetched",
    data: {
      task,
    },
  });
});
// to create a task
const createTask = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, {
    //push the task
    $push: {
      tasks: {
        name: req.body.name,
        description: req.body.description,
        completed: req.body.completed,
      },
    },
  });
  res.status(201).json({
    status: "success",
    message: "Task created successfully",
    data: user.tasks,
  });
});

// to update the task
const updateTask = catchAsync(async (req, res, next) => {
  const updatedTask = await User.findOneAndUpdate(
    { _id: req.user.id, "tasks._id": req.params.id },
    {
      $set: {
        "tasks.$.name": req.body.name,
        "tasks.$.description": req.body.description,
        "tasks.$.completed": req.body.completed,
      },
    },
    { new: true }
  );
  if (!updateTask) {
    // res.status(404).send(`we cannot find the product bering id ${id}`);
    return next(new AppError(`No task found with this id`, 404));
  }
  // const updatedTask = await Task.findById(id);
  res.status(202).json({
    status: "success",
    message: "Task updated successfully",
    task: {
      task: updatedTask,
    },
  });
});

// to delete a task
const deleteTask = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    {
      _id: req.user.id,
    },
    { $pull: { tasks: { _id: req.params.id } } },
    { new: true }
  );

  // const task = await Task.findByIdAndDelete(id, req.body);
  if (!user) {
    // res.status(404).send(`we cannot find the product bering id ${id}`);
    return next(new AppError(`No task found with this id ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    message: "Task deleted successfully",
  });
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
