const express = require('express');
const router = express.Router();

// Endpoint simple de notificaciones (placeholder)
router.get('/', (req, res) => {
  res.json([
    { id: 1, text: '¡Bienvenido a MPT!', date: new Date().toISOString() },
    { id: 2, text: 'Explora álbumes y deja tu primera review.', date: new Date().toISOString() }
  ]);
});

module.exports = router;
