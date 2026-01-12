const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// In-memory storage for contact form submissions
let contactSubmissions = [];

// Route to handle contact form submissions
app.post('/api/contact', (req, res) => {
  const submission = { ...req.body, status: 'New', date: new Date() };
  contactSubmissions.push(submission);
  console.log('New contact form submission:', submission);
  res.status(200).json({ message: 'Form submitted successfully!' });
});

// Route to get all contact form submissions (for admin area)
app.get('/api/contact', (req, res) => {
  res.status(200).json(contactSubmissions);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});