const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/dashboardController');
const protect = require('../middleware/authMiddleware');

router.get('/', protect, ctrl.getDashboard);

module.exports = router;
