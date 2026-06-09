const { Resend } = require('resend');
const db = require('../config/db');

const resend = new Resend(process.env.RESEND_API_KEY);

/* ── Helpers ── */
const generateCode = () =>
  String(Math.floor(10000 + Math.random() * 90000)); // 5-digit code

const expiresAt = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 10);
  return d;
};

/* ── Branded HTML email template ── */
const buildEmailHtml = (code, fullName) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Your Verification Code</title>
</head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Government-style top banner -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a2a4a;border-bottom:3px solid #c9a227;">
    <tr>
      <td align="center" style="padding:10px 24px;">
        <p style="margin:0;color:#c9a227;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">
          Official Communication — CopyTradePrime Secure Verification System
        </p>
      </td>
    </tr>
  </table>

  <!-- Main card -->
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#0d1625;border-radius:16px;border:1px solid rgba(201,162,39,0.25);overflow:hidden;max-width:100%;">

          <!-- Header with logo -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#0d1a35 0%,#112e51 100%);padding:40px 40px 32px;border-bottom:1px solid rgba(201,162,39,0.2);">
              <!-- Logo mark -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;">
                      <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 32 L16 8 L24 20 L32 8" stroke="#1565ff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M4 26 L12 14" stroke="#1565ff" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
                      </svg>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:10px;">
                    <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:700;color:#c9a227;letter-spacing:0.18em;text-transform:uppercase;">COPY TRADE</span><br/>
                    <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:0.06em;">PRIME</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px 32px;">

              <!-- Greeting -->
              <p style="margin:0 0 8px;color:#8a9bc4;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;">Secure Verification</p>
              <h1 style="margin:0 0 20px;color:#e8f0ff;font-size:22px;font-weight:700;line-height:1.3;">
                Hello ${fullName ? fullName.split(' ')[0] : 'Trader'},
              </h1>
              <p style="margin:0 0 32px;color:#8a9bc4;font-size:15px;line-height:1.7;">
                You requested a verification code for your <strong style="color:#e8f0ff;">CopyTradePrime</strong> account.
                Enter the code below to complete your verification.
              </p>

              <!-- Code box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;background:linear-gradient(135deg,#0a1628,#111c30);border:2px solid #c9a227;border-radius:12px;padding:28px 48px;box-shadow:0 0 40px rgba(201,162,39,0.12);">
                      <!-- Individual digit boxes -->
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          ${code.split('').map(digit => `
                          <td style="padding:0 5px;">
                            <div style="width:48px;height:60px;background:#0d1525;border:1.5px solid rgba(201,162,39,0.4);border-radius:8px;display:inline-flex;align-items:center;justify-content:center;text-align:center;line-height:60px;">
                              <span style="font-family:'Courier New',monospace;font-size:28px;font-weight:800;color:#c9a227;display:block;width:48px;text-align:center;">${digit}</span>
                            </div>
                          </td>`).join('')}
                        </tr>
                      </table>
                      <p style="margin:16px 0 0;color:#8a9bc4;font-size:12px;text-align:center;letter-spacing:0.06em;">
                        ⏱ Expires in <strong style="color:#c9a227;">10 minutes</strong>
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Info box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:rgba(21,101,255,0.08);border:1px solid rgba(21,101,255,0.2);border-left:3px solid #1565ff;border-radius:8px;padding:16px 20px;">
                    <p style="margin:0;color:#8a9bc4;font-size:13px;line-height:1.65;">
                      <strong style="color:#e8f0ff;">Security notice:</strong> This code is valid for 10 minutes only.
                      If you did not request this code, please ignore this email and your account will remain secure.
                      Never share this code with anyone.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:0 0 28px;"/>

              <!-- Program info -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right:12px;">
                    <p style="margin:0 0 4px;color:#4a5a7a;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Platform</p>
                    <p style="margin:0;color:#8a9bc4;font-size:13px;font-weight:600;">CopyTradePrime</p>
                  </td>
                  <td width="50%" style="padding-left:12px;">
                    <p style="margin:0 0 4px;color:#4a5a7a;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Code Valid For</p>
                    <p style="margin:0;color:#8a9bc4;font-size:13px;font-weight:600;">10 Minutes</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:16px;">
                    <p style="margin:0 0 4px;color:#4a5a7a;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Service</p>
                    <p style="margin:0;color:#8a9bc4;font-size:13px;font-weight:600;">Smart Investments & Copy Trading Platform</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#080e1c;border-top:1px solid rgba(255,255,255,0.05);padding:24px 48px;">
              <p style="margin:0 0 8px;color:#4a5a7a;font-size:11px;line-height:1.6;text-align:center;">
                This is an automated message from CopyTradePrime. Please do not reply to this email.
              </p>
              <p style="margin:0;color:#4a5a7a;font-size:11px;text-align:center;">
                © ${new Date().getFullYear()} CopyTradePrime. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

/* ─────────────────────────────────────────────
   POST /api/auth/send-verification
───────────────────────────────────────────── */
exports.sendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const [[user]] = await db.execute(
      'SELECT id, full_name, is_verified FROM users WHERE email = ?', [email]
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.is_verified) return res.status(400).json({ message: 'Account already verified.' });

    const code = generateCode();
    const expires = expiresAt();

    await db.execute(
      'UPDATE users SET verification_code = ?, code_expires_at = ? WHERE id = ?',
      [code, expires, user.id]
    );

    await resend.emails.send({
      from: `CopyTradePrime <noreply@copytradeprime.com>`,
      to: [email],
      subject: `Your Verification Code: ${code}`,
      html: buildEmailHtml(code, user.full_name),
    });

    res.json({ message: 'Verification code sent.' });
  } catch (err) {
    next(err);
  }
};

/* ─────────────────────────────────────────────
   POST /api/auth/verify-code
───────────────────────────────────────────── */
exports.verifyCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: 'Email and code are required.' });

    const [[user]] = await db.execute(
      'SELECT id, verification_code, code_expires_at, is_verified FROM users WHERE email = ?',
      [email]
    );

    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.is_verified) return res.status(400).json({ message: 'Account already verified.' });
    if (!user.verification_code)
      return res.status(400).json({ message: 'No verification code found. Please request a new one.' });

    if (new Date() > new Date(user.code_expires_at))
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });

    if (user.verification_code !== String(code).trim())
      return res.status(400).json({ message: 'Incorrect code. Please try again.' });

    // Mark verified and clear code
    await db.execute(
      'UPDATE users SET is_verified = 1, verification_code = NULL, code_expires_at = NULL WHERE id = ?',
      [user.id]
    );

    res.json({ message: 'Email verified successfully.' });
  } catch (err) {
    next(err);
  }
};

/* ─────────────────────────────────────────────
   POST /api/auth/resend-code
───────────────────────────────────────────── */
exports.resendCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const [[user]] = await db.execute(
      'SELECT id, full_name, is_verified FROM users WHERE email = ?', [email]
    );

    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.is_verified) return res.status(400).json({ message: 'Account already verified.' });

    const code = generateCode();
    const expires = expiresAt();

    await db.execute(
      'UPDATE users SET verification_code = ?, code_expires_at = ? WHERE id = ?',
      [code, expires, user.id]
    );

    await resend.emails.send({
      from: `CopyTradePrime <onboarding@resend.dev>`,
      to: [email],
      subject: `Your Verification Code: ${code}`,
      html: buildEmailHtml(code, user.full_name),
    });

    res.json({ message: 'A new verification code has been sent.' });
  } catch (err) {
    next(err);
  }
};
