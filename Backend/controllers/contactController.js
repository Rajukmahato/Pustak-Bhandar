const ContactForm = require('../models/Contact');

exports.submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await ContactForm.create({ name, email, message });
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ message: 'Error submitting form', error });
  }
};