const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Define your routes here
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

router.post('/contacts', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = await Contact.create({ name, email, message });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

module.exports = router;