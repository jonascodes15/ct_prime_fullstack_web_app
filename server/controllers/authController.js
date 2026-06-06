const bcrypt = require('bcrypt');
const db     = require('../config/db');
const { sign } = require('../utils/jwt');

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password)
      return res.status(400).json({ message: 'All fields are required.' });

    if (password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });

    // Check email exists
    const [[existing]] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) return res.status(409).json({ message: 'Email already registered.' });

    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.execute(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [full_name, email, hash]
    );

    const userId = result.insertId;

    // Seed empty balance row
    await db.execute('INSERT INTO account_balances (user_id) VALUES (?)', [userId]);

    const token = sign({ id: userId, role: 'client' });
    res.status(201).json({ token, full_name, requiresTraderActivation: true });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const [[user]] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    if (!user.is_active)
      return res.status(403).json({ message: 'Account suspended. Contact support.' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid email or password.' });

    // Check if user has an active trader
    const [[trader]] = await db.execute(
      'SELECT id FROM user_traders WHERE user_id = ? AND is_current = 1', [user.id]
    );

    const token = sign({ id: user.id, role: user.role });
    res.json({
      token,
      full_name: user.full_name,
      role: user.role,
      requiresTraderActivation: !trader,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
exports.me = async (req, res, next) => {
  try {
    const [[user]] = await db.execute(
      'SELECT id, full_name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
