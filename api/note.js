const express = require('express');
const router = express.Router();

// List notes
router.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Get note
router.get('/:id', (req, res) => {
  res.json({ status: 'ok' });
});

// New note
router.post('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Update note
router.patch('/:id', (req, res) => {
  res.json({ status: 'ok' });
});

// Delete note
router.delete('/:id', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;