const express = require("express");
const router = express.Router();
const Submission = require("../models/submission");
const Quiz = require("../models/quiz");
const auth = require("../middleware/auth");

// Submit quiz
router.post("/:quizId", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can submit quizzes" });
    }

    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Calculate score of submitted quiz
    let score = 0;
    req.body.answers.forEach((answer) => {
      const question = quiz.questions.id(answer.questionId);
      if (question && question.correctOption === answer.selectedOption) {
        score++;
      }
    });

    const submission = new Submission({
      quiz: req.params.quizId,
      student: req.user.userId,
      answers: req.body.answers,
      score,
    });
    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student's submissions
router.get("/my-submissions", auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.userId })
      .populate("quiz", "title")
      .sort("-submittedAt");
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all submissions for a particular quiz (teacher only)
router.get("/:id", auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (quiz.creator.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view these submissions" });
    }

    const submissions = await Submission.find({ quiz: req.params.id })
      .populate("student", "name email")
      .sort("-submittedAt");

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
