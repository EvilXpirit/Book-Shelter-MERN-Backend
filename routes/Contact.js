const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

router.post('/', async (req, res) => {
  try {
    const contact = req.body;
    await Contact.insertMany(contact);
    res.status(201).send("Contact Details Sent Successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
    try {
      const contact = await Contact.find();
      res.json(contact);
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;