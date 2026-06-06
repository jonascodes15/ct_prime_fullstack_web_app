const db = require('../config/db');

// GET /api/deposits/wallets
exports.getWallets = async (req, res, next) => {
  try {
    const [wallets] = await db.execute(
      'SELECT * FROM crypto_wallets WHERE is_active = 1 ORDER BY id ASC'
    );
    res.json(wallets);
  } catch (err) {
    next(err);
  }
};

// POST /api/deposits
exports.submitDeposit = async (req, res, next) => {
  try {
    const { wallet_id, amount, tx_hash } = req.body;
    const uid = req.user.id;

    if (!wallet_id) return res.status(400).json({ message: 'wallet_id is required.' });
    if (!amount || parseFloat(amount) <= 0)
      return res.status(400).json({ message: 'A valid amount is required.' });

    await db.execute(
      'INSERT INTO deposits (user_id, wallet_id, amount, tx_hash) VALUES (?, ?, ?, ?)',
      [uid, wallet_id, amount, tx_hash || null]
    );

    res.status(201).json({ message: 'Deposit submitted. Awaiting confirmation.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/deposits/history
exports.getHistory = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      `SELECT d.*, cw.coin_name, cw.coin_symbol
       FROM deposits d
       LEFT JOIN crypto_wallets cw ON cw.id = d.wallet_id
       WHERE d.user_id = ?
       ORDER BY d.submitted_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
