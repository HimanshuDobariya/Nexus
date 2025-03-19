import Comment from "../models/comments.model.js";
import Task from "../models/task.model.js";

export const createComment = async (req, res) => {
  try {
    const { userId } = req;
    const { taskId } = req.params;
    const { content } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    const newComment = new Comment({
      content,
      author: userId,
      task: taskId,
    });

    await newComment.save();

    res.status(201).json({ comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }

    const comments = await Comment.find({
      task: taskId,
    })
      .populate("author", "name email")
      .sort({
        updatedAt: -1,
        createdAt: -1,
      });

    res.json({ comments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const { userId } = req;

    const comment = await Comment.findOne({
      _id: commentId,
      author: userId,
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req;

    const comment = await Comment.findOne({ _id: commentId, author: userId });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    await Comment.deleteOne({ _id: commentId });
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
