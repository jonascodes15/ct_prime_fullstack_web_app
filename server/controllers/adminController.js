const db = require('../config/db');

// ── USERS ─────────────────────────────────────────

// GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const [users] = await db.execute(
      `SELECT u.id, u.full_name, u.email, u.role, u.is_active, u.created_at,
              ab.balance, ab.total_profit, ab.total_deposited
       FROM users u
       LEFT JOIN account_balances ab ON ab.user_id = u.id
       ORDER BY u.created_at DESC`
    );
    res.json(users);
  } catch (err) { next(err); }
};

// GET /api/admin/users/:id
exports.getUserById = async (req, res, next) => {
  try {
    const [[user]] = await db.execute(
      `SELECT u.*, ab.balance, ab.total_profit, ab.total_deposited
       FROM users u
       LEFT JOIN account_balances ab ON ab.user_id = u.id
       WHERE u.id = ?`,
      [req.params.id]
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) { next(err); }
};

// PATCH /api/admin/users/:id/balance
exports.updateBalance = async (req, res, next) => {
  try {
    const { balance, total_profit, total_deposited } = req.body;
    const uid = req.params.id;

    const fields = [];
    const vals = [];
    if (balance !== undefined) { fields.push('balance = ?'); vals.push(balance); }
    if (total_profit !== undefined) { fields.push('total_profit = ?'); vals.push(total_profit); }
    if (total_deposited !== undefined) { fields.push('total_deposited = ?'); vals.push(total_deposited); }

    if (!fields.length) return res.status(400).json({ message: 'No fields to update.' });

    vals.push(uid);
    await db.execute(`UPDATE account_balances SET ${fields.join(', ')} WHERE user_id = ?`, vals);
    res.json({ message: 'Balance updated.' });
  } catch (err) { next(err); }
};

// PATCH /api/admin/users/:id/status
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { is_active } = req.body;
    await db.execute('UPDATE users SET is_active = ? WHERE id = ?', [is_active, req.params.id]);
    res.json({ message: `User ${is_active ? 'activated' : 'suspended'}.` });
  } catch (err) { next(err); }
};

// ── EARNINGS ──────────────────────────────────────

// POST /api/admin/earnings
exports.addEarning = async (req, res, next) => {
  try {
    const { user_id, amount, period_type, note } = req.body;
    if (!user_id || !amount || !period_type)
      return res.status(400).json({ message: 'user_id, amount, and period_type are required.' });

    await db.execute(
      'INSERT INTO earnings (user_id, amount, period_type, note) VALUES (?, ?, ?, ?)',
      [user_id, amount, period_type, note || null]
    );

    // Also increment total_profit in balance
    await db.execute(
      'UPDATE account_balances SET total_profit = total_profit + ?, balance = balance + ? WHERE user_id = ?',
      [amount, amount, user_id]
    );

    res.status(201).json({ message: 'Earning added and balance updated.' });
  } catch (err) { next(err); }
};

// ── TRADES ────────────────────────────────────────

// POST /api/admin/trades
exports.addTrade = async (req, res, next) => {
  try {
    const { user_id, asset, direction, entry_price, quantity, profit_loss } = req.body;
    if (!user_id || !asset || !direction || !entry_price || !quantity)
      return res.status(400).json({ message: 'Required: user_id, asset, direction, entry_price, quantity.' });

    await db.execute(
      'INSERT INTO active_trades (user_id, asset, direction, entry_price, quantity, profit_loss) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, asset, direction, entry_price, quantity, profit_loss || 0]
    );
    res.status(201).json({ message: 'Trade added.' });
  } catch (err) { next(err); }
};

// PATCH /api/admin/trades/:id
exports.updateTrade = async (req, res, next) => {
  try {
    const { profit_loss, status } = req.body;
    await db.execute(
      'UPDATE active_trades SET profit_loss = ?, status = ? WHERE id = ?',
      [profit_loss, status, req.params.id]
    );
    res.json({ message: 'Trade updated.' });
  } catch (err) { next(err); }
};

// DELETE /api/admin/trades/:id
exports.deleteTrade = async (req, res, next) => {
  try {
    await db.execute('DELETE FROM active_trades WHERE id = ?', [req.params.id]);
    res.json({ message: 'Trade deleted.' });
  } catch (err) { next(err); }
};

// ── DEPOSITS ──────────────────────────────────────

// GET /api/admin/deposits
exports.getAllDeposits = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      `SELECT d.*, u.full_name, u.email, cw.coin_name, cw.coin_symbol
       FROM deposits d
       JOIN users u ON u.id = d.user_id
       LEFT JOIN crypto_wallets cw ON cw.id = d.wallet_id
       ORDER BY d.submitted_at DESC`
    );
    res.json(rows);
  } catch (err) { next(err); }
};

// PATCH /api/admin/deposits/:id
exports.updateDeposit = async (req, res, next) => {
  try {
    const { status } = req.body; // 'confirmed' | 'rejected'
    const dep_id = req.params.id;

    const [[dep]] = await db.execute('SELECT * FROM deposits WHERE id = ?', [dep_id]);
    if (!dep) return res.status(404).json({ message: 'Deposit not found.' });

    await db.execute(
      "UPDATE deposits SET status = ?, confirmed_at = ? WHERE id = ?",
      [status, status === 'confirmed' ? new Date() : null, dep_id]
    );

    // If confirmed, add amount to user's balance
    if (status === 'confirmed' && dep.status !== 'confirmed') {
      await db.execute(
        'UPDATE account_balances SET balance = balance + ?, total_deposited = total_deposited + ? WHERE user_id = ?',
        [dep.amount, dep.amount, dep.user_id]
      );
    }

    res.json({ message: `Deposit ${status}.` });
  } catch (err) { next(err); }
};

// ── WITHDRAWALS ───────────────────────────────────

// GET /api/admin/withdrawals
exports.getAllWithdrawals = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      `SELECT w.*, u.full_name, u.email
       FROM withdrawals w
       JOIN users u ON u.id = w.user_id
       ORDER BY w.requested_at DESC`
    );
    res.json(rows);
  } catch (err) { next(err); }
};

// PATCH /api/admin/withdrawals/:id
exports.updateWithdrawal = async (req, res, next) => {
  try {
    const { status, admin_note } = req.body;
    const wid = req.params.id;

    const [[w]] = await db.execute('SELECT * FROM withdrawals WHERE id = ?', [wid]);
    if (!w) return res.status(404).json({ message: 'Withdrawal not found.' });

    await db.execute(
      'UPDATE withdrawals SET status = ?, admin_note = ?, processed_at = ? WHERE id = ?',
      [status, admin_note || null, new Date(), wid]
    );

    // If approved, deduct from balance
    if (status === 'approved' && w.status !== 'approved') {
      await db.execute(
        'UPDATE account_balances SET balance = GREATEST(balance - ?, 0) WHERE user_id = ?',
        [w.amount, w.user_id]
      );
    }

    res.json({ message: `Withdrawal ${status}.` });
  } catch (err) { next(err); }
};

// ── WALLETS ───────────────────────────────────────

// GET /api/admin/wallets
exports.getWallets = async (req, res, next) => {
  try {
    const [wallets] = await db.execute('SELECT * FROM crypto_wallets ORDER BY id ASC');
    res.json(wallets);
  } catch (err) { next(err); }
};

// POST /api/admin/wallets
exports.addWallet = async (req, res, next) => {
  try {
    const { coin_name, coin_symbol, network, wallet_address, qr_code_url } = req.body;
    if (!coin_name || !coin_symbol || !wallet_address)
      return res.status(400).json({ message: 'coin_name, coin_symbol, wallet_address are required.' });

    await db.execute(
      'INSERT INTO crypto_wallets (coin_name, coin_symbol, network, wallet_address, qr_code_url) VALUES (?,?,?,?,?)',
      [coin_name, coin_symbol, network || null, wallet_address, qr_code_url || null]
    );
    res.status(201).json({ message: 'Wallet added.' });
  } catch (err) { next(err); }
};

// PATCH /api/admin/wallets/:id
exports.updateWallet = async (req, res, next) => {
  try {
    const { coin_name, coin_symbol, network, wallet_address, qr_code_url, is_active } = req.body;
    await db.execute(
      'UPDATE crypto_wallets SET coin_name=?, coin_symbol=?, network=?, wallet_address=?, qr_code_url=?, is_active=? WHERE id=?',
      [coin_name, coin_symbol, network, wallet_address, qr_code_url, is_active, req.params.id]
    );
    res.json({ message: 'Wallet updated.' });
  } catch (err) { next(err); }
};

// DELETE /api/admin/wallets/:id
exports.deleteWallet = async (req, res, next) => {
  try {
    await db.execute('DELETE FROM crypto_wallets WHERE id = ?', [req.params.id]);
    res.json({ message: 'Wallet deleted.' });
  } catch (err) { next(err); }
};

// ── TRADERS ───────────────────────────────────────

// GET /api/admin/traders
exports.getAllTraders = async (req, res, next) => {
  try {
    const [traders] = await db.execute('SELECT * FROM traders ORDER BY id DESC');
    res.json(traders);
  } catch (err) { next(err); }
};

// POST /api/admin/traders
exports.addTrader = async (req, res, next) => {
  try {
    const { name, strategy, win_rate, monthly_return, avatar_url } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required.' });

    await db.execute(
      'INSERT INTO traders (name, strategy, win_rate, monthly_return, avatar_url) VALUES (?,?,?,?,?)',
      [name, strategy || null, win_rate || 0, monthly_return || 0, avatar_url || null]
    );
    res.status(201).json({ message: 'Trader added.' });
  } catch (err) { next(err); }
};

// PATCH /api/admin/traders/:id
exports.updateTrader = async (req, res, next) => {
  try {
    const { name, strategy, win_rate, monthly_return, avatar_url, is_active } = req.body;
    await db.execute(
      'UPDATE traders SET name=?, strategy=?, win_rate=?, monthly_return=?, avatar_url=?, is_active=? WHERE id=?',
      [name, strategy, win_rate, monthly_return, avatar_url, is_active, req.params.id]
    );
    res.json({ message: 'Trader updated.' });
  } catch (err) { next(err); }
};

// ── STATS ─────────────────────────────────────────

// GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const [[{ total_users }]] = await db.execute("SELECT COUNT(*) AS total_users FROM users WHERE role='client'");
    const [[{ total_deposited }]] = await db.execute("SELECT SUM(total_deposited) AS total_deposited FROM account_balances");
    const [[{ pending_deposits }]] = await db.execute("SELECT COUNT(*) AS pending_deposits FROM deposits WHERE status='pending'");
    const [[{ pending_withdrawals }]] = await db.execute("SELECT COUNT(*) AS pending_withdrawals FROM withdrawals WHERE status='pending'");
    const [[{ total_balance }]] = await db.execute("SELECT SUM(balance) AS total_balance FROM account_balances");

    res.json({ total_users, total_deposited, pending_deposits, pending_withdrawals, total_balance });
  } catch (err) { next(err); }
};
