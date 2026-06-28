const express = require('express');
const router = express.Router();
const multer = require('multer');
const ctrl = require('../controllers/accountController');
const protect = require('../middleware/authMiddleware');

// Store file in memory (max 200KB enforced here too)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only JPG, PNG or PDF allowed.'));
  },
});

const ticketUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only JPG or PNG screenshots below 100KB are allowed.'));
  },
});

router.get('/profile', protect, ctrl.getProfile);
router.patch('/profile', protect, ctrl.updateProfile);
router.patch('/password', protect, ctrl.changePassword);
router.get('/kyc', protect, ctrl.getKYC);
router.post('/kyc', protect, upload.single('id_document'), ctrl.submitKYC);
router.get('/notifications', protect, ctrl.getNotifications);
router.patch('/notifications/:id/read', protect, ctrl.markNotificationRead);
router.get('/referral', protect, ctrl.getReferral);
router.get('/tickets', protect, ctrl.getTickets);
router.post('/tickets', protect, ticketUpload.single('screenshot'), ctrl.createTicket);

module.exports = router;
