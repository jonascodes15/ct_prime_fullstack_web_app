# CopyTradePrime

Full-stack copy trading platform — React + Node.js + MySQL.

---

## 📁 Project Structure

```
copytradeprime/
├── client/          # React frontend (Vite)
├── server/          # Node.js backend (Express)
└── database/
    └── schema.sql   # MySQL schema + seed data
```

---

## ⚙️ Setup Instructions

### 1. Database

Open MySQL Workbench or your terminal:

```bash
mysql -u root -p < database/schema.sql
```

This creates the `copytradeprime` database, all tables, and seed traders.

---

### 2. Backend (Node.js)

```bash
cd server
cp .env.example .env
# Edit .env with your DB credentials and a strong JWT_SECRET
npm install
npm run dev
```

Server runs on **http://localhost:5000**

---

### 3. Frontend (React)

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

App runs on **http://localhost:5173**

---

## 🔑 Admin Account

After running schema.sql, log in with:
- **Email:** admin@copytradeprime.com
- **Password:** Admin@123456

⚠️ **Change this immediately** after first login by updating the hash:
```bash
node -e "const b=require('bcrypt'); b.hash('YourNewPassword',12).then(console.log)"
```
Then update the users table:
```sql
UPDATE users SET password_hash='<new_hash>' WHERE email='admin@copytradeprime.com';
```

---

## 🌐 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | ✅ | Get profile |
| GET | `/api/dashboard` | ✅ | Dashboard data |
| GET | `/api/traders` | ✅ | List traders |
| POST | `/api/traders/activate` | ✅ | Activate trader |
| GET | `/api/deposits/wallets` | ✅ | Crypto wallets |
| POST | `/api/deposits` | ✅ | Submit deposit |
| GET | `/api/withdrawals` | ✅ | Withdrawal history |
| POST | `/api/withdrawals` | ✅ | Request withdrawal |
| GET | `/api/admin/stats` | 🔒 Admin | Platform stats |
| GET | `/api/admin/users` | 🔒 Admin | All users |
| PATCH | `/api/admin/users/:id/balance` | 🔒 Admin | Update balance |
| POST | `/api/admin/earnings` | 🔒 Admin | Add earnings |
| POST | `/api/admin/trades` | 🔒 Admin | Add trade |
| GET | `/api/admin/deposits` | 🔒 Admin | All deposits |
| PATCH | `/api/admin/deposits/:id` | 🔒 Admin | Confirm/reject deposit |
| GET | `/api/admin/withdrawals` | 🔒 Admin | All withdrawals |
| PATCH | `/api/admin/withdrawals/:id` | 🔒 Admin | Approve/reject withdrawal |
| GET | `/api/admin/wallets` | 🔒 Admin | Manage wallets |
| POST | `/api/admin/wallets` | 🔒 Admin | Add wallet |

---

## 📦 Adding Crypto Wallets

Use the admin API to insert wallet addresses:

```bash
curl -X POST http://localhost:5000/api/admin/wallets \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "coin_name": "Bitcoin",
    "coin_symbol": "BTC",
    "network": "Bitcoin Network",
    "wallet_address": "YOUR_BTC_ADDRESS_HERE"
  }'
```

Or insert directly in MySQL:
```sql
INSERT INTO crypto_wallets (coin_name, coin_symbol, network, wallet_address) VALUES
  ('Bitcoin',  'BTC',  'Bitcoin Network', 'YOUR_BTC_ADDRESS'),
  ('Ethereum', 'ETH',  'ERC-20',          'YOUR_ETH_ADDRESS'),
  ('Tether',   'USDT', 'TRC-20',          'YOUR_USDT_TRC20_ADDRESS'),
  ('Tether',   'USDT', 'ERC-20',          'YOUR_USDT_ERC20_ADDRESS');
-- Add all 10 wallets here
```
