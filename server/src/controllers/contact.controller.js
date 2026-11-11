const ContactMessage = require('../models/ContactMessage');

// @desc    Visitor submits contact inquiry
// @route   POST /api/v1/public/contact
// @access  Public
const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.',
      });
    }

    const contact = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! A gym representative will contact you soon.',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin views contact messages
// @route   GET /api/v1/contact
// @access  Admin
const getAllContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin updates contact message status
// @route   PATCH /api/v1/contact/:id
// @access  Admin
const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactMessage,
  getAllContactMessages,
  updateContactStatus,
};

