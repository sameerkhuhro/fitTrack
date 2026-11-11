const MembershipPlan = require('../models/MembershipPlan');

// @desc    Get all active plans (Public / Member)
// @route   GET /api/v1/plans
// @access  Public
const getAllPlans = async (req, res, next) => {
  try {
    const filter = req.user && req.user.role === 'admin' ? {} : { isActive: true };
    const plans = await MembershipPlan.find(filter).sort({ price: 1 });
    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single plan by ID
// @route   GET /api/v1/plans/:id
// @access  Public
const getPlanById = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found',
      });
    }
    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new membership plan
// @route   POST /api/v1/plans
// @access  Admin
const createPlan = async (req, res, next) => {
  try {
    const { name, description, price, durationMonths, features, isActive } = req.body;

    const existingPlan = await MembershipPlan.findOne({ name });
    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: `Plan with name '${name}' already exists.`,
      });
    }

    const plan = await MembershipPlan.create({
      name,
      description,
      price,
      durationMonths,
      features: Array.isArray(features) ? features : [],
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Membership plan created successfully.',
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a membership plan
// @route   PUT /api/v1/plans/:id
// @access  Admin
const updatePlan = async (req, res, next) => {
  try {
    const { name, description, price, durationMonths, features, isActive } = req.body;

    let plan = await MembershipPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found',
      });
    }

    if (name) plan.name = name;
    if (description !== undefined) plan.description = description;
    if (price !== undefined) plan.price = price;
    if (durationMonths !== undefined) plan.durationMonths = durationMonths;
    if (features !== undefined) plan.features = Array.isArray(features) ? features : plan.features;
    if (isActive !== undefined) plan.isActive = isActive;

    await plan.save();

    res.status(200).json({
      success: true,
      message: 'Membership plan updated successfully.',
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate/Delete a membership plan
// @route   DELETE /api/v1/plans/:id
// @access  Admin
const deletePlan = async (req, res, next) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found',
      });
    }

    // Soft delete / deactivate to preserve historical integrity
    plan.isActive = false;
    await plan.save();

    res.status(200).json({
      success: true,
      message: 'Membership plan deactivated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
};
