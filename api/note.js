const express = require('express');
const router = express.Router();
const db = require('./../db').getDb();

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
  // to-do: validate input
  db.notes.insert(req.body, (err, newDocs) => {
    if (err) console.error(err);
    console.log(newDocs);
    // to-do: Follow JSON API convention?
    res.sendStatus(200);
  });
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