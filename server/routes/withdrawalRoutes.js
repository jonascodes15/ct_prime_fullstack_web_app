const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/withdrawalController');
const protect = require('../middleware/authMiddleware');

router.get('/',  protect, ctrl.getHistory);
router.post('/', protect, ctrl.requestWithdrawal);

module.exports = router;
