const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/traderController');
const protect = require('../middleware/authMiddleware');

router.get('/',          protect, ctrl.listTraders);
router.get('/my',        protect, ctrl.myTrader);
router.post('/activate', protect, ctrl.activateTrader);

module.exports = router;
