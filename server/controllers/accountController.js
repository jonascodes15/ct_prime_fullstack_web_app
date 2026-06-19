const bcrypt = require('bcrypt');
const db     = require('../config/db');
const crypto = require('crypto');

/* ── helpers ── */
const generateReferralCode = (userId) =>
  'CPT' + userId.toString(36).toUpperCase().padStart(4,'0') +
  crypto.randomBytes(3).toString('hex').toUpperCase();

/* ────────────────────────────────────
   GET /api/account/profile
──────────────────────────────────── */
exports.getProfile = async (req, res, next) => {
  try {
    const [[user]] = await db.execute(
      'SELECT id, full_name, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) { next(err); }
};

/* ────────────────────────────────────
   PATCH /api/account/profile
──────────────────────────────────── */
exports.updateProfile = async (req, res, next) => {
  try {
    const { full_name, email } = req.body;
    const uid = req.user.id;

    if (!full_name || !email)
      return res.status(400).json({ message: 'Name and email are required.' });

    // Check email not taken by another user
    const [[existing]] = await db.execute(
      'SELECT id FROM users WHERE email = ? AND id != ?', [email, uid]
    );
    if (existing)
      return res.status(409).json({ message: 'Email is already in use.' });

    await db.execute(
      'UPDATE users SET full_name = ?, email = ? WHERE id = ?',
      [full_name, email, uid]
    );
    res.json({ message: 'Profile updated successfully.' });
  } catch (err) { next(err); }
};

/* ────────────────────────────────────
   PATCH /api/account/password
──────────────────────────────────── */
exports.changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    const uid = req.user.id;

    if (!current_password || !new_password)
      return res.status(400).json({ message: 'Both current and new password are required.' });

    if (new_password.length < 8)
      return res.status(400).json({ message: 'New password must be at least 8 characters.' });

    const [[user]] = await db.execute(
      'SELECT password_hash FROM users WHERE id = ?', [uid]
    );
    const match = await bcrypt.compare(current_password, user.password_hash);
    if (!match)
      return res.status(401).json({ message: 'Current password is incorrect.' });

    const hash = await bcrypt.hash(new_password, 12);
    await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, uid]);
    res.json({ message: 'Password changed successfully.' });
  } catch (err) { next(err); }
};

/* ────────────────────────────────────
   GET /api/account/kyc
──────────────────────────────────── */
exports.getKYC = async (req, res, next) => {
  try {
    const [[kyc]] = await db.execute(
      'SELECT * FROM kyc_submissions WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 1',
      [req.user.id]
    );
    res.json(kyc || null);
  } catch (err) { next(err); }
};

/* ────────────────────────────────────
   POST /api/account/kyc
──────────────────────────────────── */
exports.submitKYC = async (req, res, next) => {
  try {
    const uid = req.user.id;
    const {
      first_name, last_name, date_of_birth, nationality,
      country_of_residence, address, city, postal_code,
      id_type, id_number,
    } = req.body;

    // Check existing pending/approved
    const [[existing]] = await db.execute(
      "SELECT status FROM kyc_submissions WHERE user_id = ? AND status IN ('pending','approved')",
      [uid]
    );
    if (existing)
      return res.status(400).json({
        message: existing.status === 'approved'
          ? 'Your KYC is already approved.'
          : 'You already have a pending KYC submission.'
      });

    const formData = JSON.stringify({
      first_name, last_name, date_of_birth, nationality,
      country_of_residence, address, city, postal_code,
      id_type, id_number,
    });

    // File stored as base64 in DB (small files <200KB)
    let documentData = null;
    let documentName = null;
    if (req.file) {
      documentData = req.file.buffer.toString('base64');
      documentName = req.file.originalname;
    }

    await db.execute(
      `INSERT INTO kyc_submissions
       (user_id, form_data, document_data, document_name, status)
       VALUES (?,?,?,?,'pending')`,
      [uid, formData, documentData, documentName]
    );

    res.status(201).json({ message: 'KYC submitted successfully.' });
  } catch (err) { next(err); }
};

/* ────────────────────────────────────
   GET /api/account/referral
──────────────────────────────────── */
exports.getReferral = async (req, res, next) => {
  try {
    const uid = req.user.id;

    let [[ref]] = await db.execute(
      'SELECT * FROM referrals WHERE user_id = ?', [uid]
    );

    // Auto-create referral record if none exists
    if (!ref) {
      const code = generateReferralCode(uid);
      await db.execute(
        'INSERT INTO referrals (user_id, referral_code) VALUES (?,?)',
        [uid, code]
      );
      [[ref]] = await db.execute(
        'SELECT * FROM referrals WHERE user_id = ?', [uid]
      );
    }

    // Count stats
    const [[stats]] = await db.execute(
      `SELECT
         COUNT(*)                                               AS total_referrals,
         SUM(CASE WHEN rb.trader_activated = 1 THEN 1 ELSE 0 END) AS active_referrals,
         COALESCE(SUM(rb.bonus_amount),0)                      AS total_earned
       FROM referral_bookings rb
       WHERE rb.referrer_id = ?`,
      [uid]
    );

    res.json({
      referral_code:    ref.referral_code,
      total_referrals:  stats?.total_referrals  || 0,
      active_referrals: stats?.active_referrals || 0,
      total_earned:     parseFloat(stats?.total_earned || 0).toFixed(2),
    });
  } catch (err) { next(err); }
};
