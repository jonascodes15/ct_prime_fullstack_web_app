const db = require('../config/db');

// GET /api/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const uid = req.user.id;

    const [[balance]] = await db.execute(
      'SELECT * FROM account_balances WHERE user_id = ?', [uid]
    );

    const [trades] = await db.execute(
      "SELECT * FROM active_trades WHERE user_id = ? AND status = 'open' ORDER BY opened_at DESC",
      [uid]
    );

    const [earnings] = await db.execute(
      'SELECT * FROM earnings WHERE user_id = ? ORDER BY created_at DESC LIMIT 14',
      [uid]
    );

    const [[notificationCount]] = await db.execute(
      'SELECT COUNT(*) AS unread_notifications FROM notifications WHERE user_id = ? AND is_read = 0',
      [uid]
    );

    const [[trader]] = await db.execute(
      `SELECT t.id, t.name, t.strategy, t.win_rate, t.monthly_return, t.total_followers, t.avatar_url
       FROM traders t
       JOIN user_traders ut ON ut.trader_id = t.id
       WHERE ut.user_id = ? AND ut.is_current = 1
       LIMIT 1`,
      [uid]
    );

    res.json({ balance: balance || {}, trades, earnings, trader: trader || null, unread_notifications: notificationCount?.unread_notifications || 0 });
  } catch (err) {
    next(err);
  }
};
