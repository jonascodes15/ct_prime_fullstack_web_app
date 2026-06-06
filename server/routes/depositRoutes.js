const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/depositController');
const protect = require('../middleware/authMiddleware');

router.get('/wallets', protect, ctrl.getWallets);
router.get('/history', protect, ctrl.getHistory);
router.post('/',       protect, ctrl.submitDeposit);

module.exports = router;
