const bcrypt = require('bcrypt');
const db = require('../config/db');
const { sign } = require('../utils/jwt');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const generateCode = () => String(Math.floor(10000 + Math.random() * 90000));
const expiresAt = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 10);
  return d;
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password)
      return res.status(400).json({ message: 'All fields are required.' });

    if (password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });

    const [[existing]] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) return res.status(409).json({ message: 'Email already registered.' });

    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.execute(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [full_name, email, hash]
    );

    const userId = result.insertId;
    await db.execute('INSERT INTO account_balances (user_id) VALUES (?)', [userId]);

    // Generate and store verification code
    const code = generateCode();
    const expires = expiresAt();
    await db.execute(
      'UPDATE users SET verification_code = ?, code_expires_at = ? WHERE id = ?',
      [code, expires, userId]
    );

    // Send verification email (non-blocking)
    resend.emails.send({
      from: 'CopyTradePrime <noreply@copytradeprime.com>',
      to: [email],
      subject: `Your Verification Code: ${code}`,
      html: buildVerificationEmail(code, full_name),
    }).catch((e) => console.error('Verification email failed:', e.message));

    const token = sign({ id: userId, role: 'client' });
    res.status(201).json({ token, full_name, email, needsVerification: true });
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

    // Block unverified users — send a fresh code
    if (!user.is_verified) {
      const code = generateCode();
      const expires = expiresAt();
      await db.execute(
        'UPDATE users SET verification_code = ?, code_expires_at = ? WHERE id = ?',
        [code, expires, user.id]
      );
      resend.emails.send({
        from: 'CopyTradePrime <onboarding@resend.dev>',
        to: [email],
        subject: `Your Verification Code: ${code}`,
        html: buildVerificationEmail(code, user.full_name),
      }).catch((e) => console.error('Verification email failed:', e.message));

      return res.status(403).json({
        message: 'Please verify your email before signing in.',
        needsVerification: true,
        email: user.email,
        full_name: user.full_name,
      });
    }

    const [[trader]] = await db.execute(
      'SELECT id FROM user_traders WHERE user_id = ? AND is_current = 1', [user.id]
    );

    const token = sign({ id: user.id, role: user.role });
    res.json({
      token,
      full_name: user.full_name,
      email: user.email,
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

/* ── Email template ── */
function buildVerificationEmail(code, fullName) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a2a4a;border-bottom:3px solid #c9a227;">
    <tr><td align="center" style="padding:10px 24px;">
      <p style="margin:0;color:#c9a227;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">
        Official Communication — CopyTradePrime Secure Verification System
      </p>
    </td></tr>
  </table>
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#0d1625;border-radius:16px;border:1px solid rgba(201,162,39,0.25);overflow:hidden;max-width:100%;">
        <tr>
          <td align="center" style="background:linear-gradient(135deg,#0d1a35 0%,#112e51 100%);padding:36px 40px;border-bottom:1px solid rgba(201,162,39,0.2);">
            <p style="margin:0;font-size:10px;font-weight:700;color:#c9a227;letter-spacing:0.2em;text-transform:uppercase;">COPY TRADE</p>
            <p style="margin:4px 0 0;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:0.08em;">PRIME</p>
            <p style="margin:8px 0 0;font-size:11px;color:rgba(201,162,39,0.65);letter-spacing:0.12em;">SECURE VERIFICATION SYSTEM</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 48px 32px;">
            <p style="margin:0 0 6px;color:#8a9bc4;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Email Verification</p>
            <h1 style="margin:0 0 16px;color:#e8f0ff;font-size:21px;font-weight:700;line-height:1.3;">Hello ${fullName ? fullName.split(' ')[0] : 'Trader'},</h1>
            <p style="margin:0 0 32px;color:#8a9bc4;font-size:15px;line-height:1.72;">
              Use the verification code below to complete your <strong style="color:#e8f0ff;">CopyTradePrime</strong> account setup.
            </p>
            <!-- Code box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr><td align="center">
                <table cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0a1628,#111c30);border:2px solid #c9a227;border-radius:12px;padding:28px 40px;">
                  <tr>
                    ${code.split('').map(d => `
                    <td style="padding:0 5px;">
                      <table cellpadding="0" cellspacing="0"><tr><td style="width:48px;height:62px;background:#0d1525;border:1.5px solid rgba(201,162,39,0.35);border-radius:8px;text-align:center;vertical-align:middle;">
                        <span style="font-family:'Courier New',monospace;font-size:30px;font-weight:800;color:#c9a227;">${d}</span>
                      </td></tr></table>
                    </td>`).join('')}
                  </tr>
                  <tr><td colspan="5" align="center" style="padding-top:16px;">
                    <span style="color:#8a9bc4;font-size:12px;letter-spacing:0.06em;">
                      ⏱ This code expires in <strong style="color:#c9a227;">10 minutes</strong>
                    </span>
                  </td></tr>
                </table>
              </td></tr>
            </table>
            <!-- Security notice -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr><td style="background:rgba(21,101,255,0.07);border:1px solid rgba(21,101,255,0.18);border-left:3px solid #1565ff;border-radius:8px;padding:16px 20px;">
                <p style="margin:0;color:#8a9bc4;font-size:13px;line-height:1.65;">
                  <strong style="color:#e8f0ff;">Security notice:</strong> Never share this code with anyone.
                  CopyTradePrime staff will never ask for your code. If you did not request this, ignore this email safely.
                </p>
              </td></tr>
            </table>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:0 0 24px;"/>
            <!-- Info grid -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="33%" style="padding-right:8px;">
                  <p style="margin:0 0 3px;color:#4a5a7a;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;">Platform</p>
                  <p style="margin:0;color:#8a9bc4;font-size:13px;font-weight:600;">CopyTradePrime</p>
                </td>
                <td width="33%" style="padding:0 8px;">
                  <p style="margin:0 0 3px;color:#4a5a7a;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;">Valid For</p>
                  <p style="margin:0;color:#8a9bc4;font-size:13px;font-weight:600;">10 Minutes</p>
                </td>
                <td width="33%" style="padding-left:8px;">
                  <p style="margin:0 0 3px;color:#4a5a7a;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;">Service</p>
                  <p style="margin:0;color:#8a9bc4;font-size:13px;font-weight:600;">Copy Trading</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#080e1c;border-top:1px solid rgba(255,255,255,0.05);padding:20px 48px;text-align:center;">
            <p style="margin:0 0 6px;color:#4a5a7a;font-size:11px;">This is an automated message. Please do not reply to this email.</p>
            <p style="margin:0;color:#4a5a7a;font-size:11px;">© ${new Date().getFullYear()} CopyTradePrime. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
