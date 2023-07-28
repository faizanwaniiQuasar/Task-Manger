const express = require("express");
const router = express.Router();
const { protect } = require("../Controllers/auth.controller");

const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require("../Controllers/task.controller");

router.route("/").get(protect, getAllTasks).post(protect, createTask);
router
  .route("/:id")
  .get(protect, getTask)
  .patch(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
