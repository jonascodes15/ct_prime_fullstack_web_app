const db = require('../config/db');

// POST /api/withdrawals
exports.requestWithdrawal = async (req, res, next) => {
  try {
    const { amount, wallet_address, coin_symbol } = req.body;
    const uid = req.user.id;

    if (!amount || parseFloat(amount) <= 0)
      return res.status(400).json({ message: 'A valid amount is required.' });
    if (!wallet_address?.trim())
      return res.status(400).json({ message: 'Wallet address is required.' });
    if (!coin_symbol)
      return res.status(400).json({ message: 'Coin symbol is required.' });

    // Check balance
    const [[bal]] = await db.execute(
      'SELECT balance FROM account_balances WHERE user_id = ?', [uid]
    );

    if (!bal || parseFloat(bal.balance) < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient account balance.' });
    }

    await db.execute(
      'INSERT INTO withdrawals (user_id, amount, wallet_address, coin_symbol) VALUES (?, ?, ?, ?)',
      [uid, amount, wallet_address.trim(), coin_symbol]
    );

    res.status(201).json({ message: 'Withdrawal request submitted successfully.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/withdrawals
exports.getHistory = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM withdrawals WHERE user_id = ? ORDER BY requested_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
