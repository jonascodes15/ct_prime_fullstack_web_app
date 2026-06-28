const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const admin = require('../middleware/adminMiddleware');

// Stats
router.get('/stats', admin, ctrl.getStats);

// Users
router.get('/users', admin, ctrl.getAllUsers);
router.get('/users/:id', admin, ctrl.getUserById);
router.patch('/users/:id/balance', admin, ctrl.updateBalance);
router.patch('/users/:id/status', admin, ctrl.toggleUserStatus);

// KYC Submissions
router.get('/kyc-submissions', admin, ctrl.getKYCSubmissions);
router.patch('/kyc-submissions/:id', admin, ctrl.updateKYCSubmission);

// Notifications
router.post('/notifications/broadcast', admin, ctrl.broadcastNotification);

// Support tickets
router.get('/tickets', admin, ctrl.getSupportTickets);

// Earnings
router.post('/earnings', admin, ctrl.addEarning);

// Trades
router.post('/trades', admin, ctrl.addTrade);
router.patch('/trades/:id', admin, ctrl.updateTrade);
router.delete('/trades/:id', admin, ctrl.deleteTrade);

// Deposits
router.get('/deposits', admin, ctrl.getAllDeposits);
router.patch('/deposits/:id', admin, ctrl.updateDeposit);

// Withdrawals
router.get('/withdrawals', admin, ctrl.getAllWithdrawals);
router.patch('/withdrawals/:id', admin, ctrl.updateWithdrawal);

// Wallets
router.get('/wallets', admin, ctrl.getWallets);
router.post('/wallets', admin, ctrl.addWallet);
router.patch('/wallets/:id', admin, ctrl.updateWallet);
router.delete('/wallets/:id', admin, ctrl.deleteWallet);

// Traders
router.get('/traders', admin, ctrl.getAllTraders);
router.post('/traders', admin, ctrl.addTrader);
router.patch('/traders/:id', admin, ctrl.updateTrader);

module.exports = router;
