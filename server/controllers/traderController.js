const db = require('../config/db');

// GET /api/traders
exports.listTraders = async (req, res, next) => {
  try {
    const [traders] = await db.execute(
      'SELECT * FROM traders WHERE is_active = 1 ORDER BY monthly_return DESC'
    );
    res.json(traders);
  } catch (err) {
    next(err);
  }
};

// POST /api/traders/activate
exports.activateTrader = async (req, res, next) => {
  try {
    const uid       = req.user.id;
    const { trader_id } = req.body;

    if (!trader_id) return res.status(400).json({ message: 'trader_id is required.' });

    // Verify trader exists and is active
    const [[trader]] = await db.execute(
      'SELECT id FROM traders WHERE id = ? AND is_active = 1', [trader_id]
    );
    if (!trader) return res.status(404).json({ message: 'Trader not found or inactive.' });

    // Deactivate any existing active trader
    await db.execute(
      'UPDATE user_traders SET is_current = 0 WHERE user_id = ?', [uid]
    );

    // Activate new trader
    await db.execute(
      'INSERT INTO user_traders (user_id, trader_id, is_current) VALUES (?, ?, 1)',
      [uid, trader_id]
    );

    // Increment follower count
    await db.execute(
      'UPDATE traders SET total_followers = total_followers + 1 WHERE id = ?', [trader_id]
    );

    res.json({ message: 'Trader activated successfully.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/traders/my
exports.myTrader = async (req, res, next) => {
  try {
    const [[trader]] = await db.execute(
      `SELECT t.*, ut.activated_at
       FROM traders t
       JOIN user_traders ut ON ut.trader_id = t.id
       WHERE ut.user_id = ? AND ut.is_current = 1
       LIMIT 1`,
      [req.user.id]
    );
    res.json(trader || null);
  } catch (err) {
    next(err);
  }
};
