const Exercise = require('../models/Exercise');

// @desc    Get all exercises with optional category filter
// @route   GET /api/v1/exercises
// @access  Authenticated
const getAllExercises = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const exercises = await Exercise.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new exercise
// @route   POST /api/v1/exercises
// @access  Admin, Trainer
const createExercise = async (req, res, next) => {
  try {
    const { name, category, description, targetMuscles, equipment, difficulty } = req.body;

    const existing = await Exercise.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An exercise with this name already exists.',
      });
    }

    const exercise = await Exercise.create({
      name,
      category,
      description,
      targetMuscles: Array.isArray(targetMuscles) ? targetMuscles : [],
      equipment: equipment || 'None',
      difficulty: difficulty || 'beginner',
    });

    res.status(201).json({
      success: true,
      message: 'Exercise added to gym library.',
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update exercise
// @route   PUT /api/v1/exercises/:id
// @access  Admin, Trainer
const updateExercise = async (req, res, next) => {
  try {
    const { name, category, description, targetMuscles, equipment, difficulty } = req.body;

    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found.',
      });
    }

    if (name) exercise.name = name;
    if (category) exercise.category = category;
    if (description !== undefined) exercise.description = description;
    if (targetMuscles !== undefined) exercise.targetMuscles = targetMuscles;
    if (equipment !== undefined) exercise.equipment = equipment;
    if (difficulty) exercise.difficulty = difficulty;

    await exercise.save();

    res.status(200).json({
      success: true,
      message: 'Exercise updated successfully.',
      data: exercise,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete exercise
// @route   DELETE /api/v1/exercises/:id
// @access  Admin
const deleteExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Exercise removed from library.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllExercises,
  createExercise,
  updateExercise,
  deleteExercise,
};
