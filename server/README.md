# CopyTradePrime — Backend API

> Node.js + Express REST API powering the CopyTradePrime copy trading platform.

---

## Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Runtime      | Node.js v18+                      |
| Framework    | Express.js                        |
| Database     | MySQL 8 (via `mysql2`)            |
| Auth         | JWT (JSON Web Tokens)             |
| Email        | Resend API                        |
| Security     | bcrypt, helmet, express-rate-limit|

---

## Features

- **JWT Authentication** — Secure register, login, and protected routes
- **Email Verification** — 5-digit OTP via Resend with 10-minute expiry
- **Role-Based Access** — Separate client and admin middleware guards
- **Client Dashboard API** — Balance, earnings, active trades, trader info
- **Copy Trader System** — List and activate expert traders per user
- **Deposit System** — 10 crypto wallet addresses with submission tracking
- **Withdrawal System** — Request processing with admin approval flow
- **Admin Panel API** — Full CRUD for users, balances, trades, earnings, wallets, and traders
- **Live Balance Editing** — Admin can update client balances in real time
- **Rate Limiting** — Auth endpoints limited to 20 requests per 15 minutes

---

## Project Structure

```
server/
├── app.js                    # Entry point — Express app setup
├── config/
│   └── db.js                 # MySQL connection pool
├── controllers/
│   ├── authController.js     # Register, login, JWT
│   ├── verificationController.js # OTP send, verify, resend
│   ├── dashboardController.js
│   ├── traderController.js
│   ├── depositController.js
│   ├── withdrawalController.js
│   └── adminController.js    # Full admin CRUD
├── middleware/
│   ├── authMiddleware.js     # JWT verification
│   ├── adminMiddleware.js    # Admin role guard
│   └── errorHandler.js      # Global error handler
├── routes/
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── traderRoutes.js
│   ├── depositRoutes.js
│   ├── withdrawalRoutes.js
│   └── adminRoutes.js
├── utils/
│   └── jwt.js
├── .env.example
└── package.json
```

---

## API Endpoints

### Auth
| Method | Endpoint                        | Access | Description                    |
|--------|---------------------------------|--------|--------------------------------|
| POST   | `/api/auth/register`            | Public | Register new client            |
| POST   | `/api/auth/login`               | Public | Login, returns JWT             |
| GET    | `/api/auth/me`                  | Auth   | Get current user profile       |
| POST   | `/api/auth/send-verification`   | Public | Send OTP to email              |
| POST   | `/api/auth/verify-code`         | Public | Verify submitted OTP           |
| POST   | `/api/auth/resend-code`         | Public | Resend a fresh OTP             |

### Client Dashboard
| Method | Endpoint                        | Access | Description                    |
|--------|---------------------------------|--------|--------------------------------|
| GET    | `/api/dashboard`                | Auth   | Balance, trades, earnings      |
| GET    | `/api/traders`                  | Auth   | List available traders         |
| POST   | `/api/traders/activate`         | Auth   | Activate a trader              |
| GET    | `/api/deposits/wallets`         | Auth   | Get crypto wallet addresses    |
| POST   | `/api/deposits`                 | Auth   | Submit deposit confirmation    |
| GET    | `/api/deposits/history`         | Auth   | Client deposit history         |
| GET    | `/api/withdrawals`              | Auth   | Client withdrawal history      |
| POST   | `/api/withdrawals`              | Auth   | Request withdrawal             |

### Admin
| Method | Endpoint                        | Access | Description                    |
|--------|---------------------------------|--------|--------------------------------|
| GET    | `/api/admin/stats`              | Admin  | Platform overview stats        |
| GET    | `/api/admin/users`              | Admin  | All registered clients         |
| PATCH  | `/api/admin/users/:id/balance`  | Admin  | Update client balance live     |
| PATCH  | `/api/admin/users/:id/status`   | Admin  | Suspend or activate account    |
| POST   | `/api/admin/earnings`           | Admin  | Credit earnings to client      |
| POST   | `/api/admin/trades`             | Admin  | Add active trade to client     |
| PATCH  | `/api/admin/trades/:id`         | Admin  | Update trade P&L / status      |
| GET    | `/api/admin/deposits`           | Admin  | All deposit submissions        |
| PATCH  | `/api/admin/deposits/:id`       | Admin  | Confirm or reject deposit      |
| GET    | `/api/admin/withdrawals`        | Admin  | All withdrawal requests        |
| PATCH  | `/api/admin/withdrawals/:id`    | Admin  | Approve or reject withdrawal   |
| GET    | `/api/admin/wallets`            | Admin  | List crypto wallets            |
| POST   | `/api/admin/wallets`            | Admin  | Add new wallet address         |
| PATCH  | `/api/admin/wallets/:id`        | Admin  | Update wallet address          |
| DELETE | `/api/admin/wallets/:id`        | Admin  | Remove wallet                  |
| GET    | `/api/admin/traders`            | Admin  | List all traders               |
| POST   | `/api/admin/traders`            | Admin  | Add new expert trader          |
| PATCH  | `/api/admin/traders/:id`        | Admin  | Update trader info             |

---

## Local Setup

### 1. Clone and install
```bash
git clone https://github.com/yourusername/copytradeprime.git
cd copytradeprime/server
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=copytradeprime

JWT_SECRET=your_minimum_32_character_secret_key
JWT_EXPIRES=7d

RESEND_API_KEY=re_your_resend_api_key
```

### 3. Set up the database
Run the schema file in MySQL Workbench or terminal:
```bash
mysql -u root -p < ../database/schema.sql
```

### 4. Start the server
```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

## Environment Variables

| Variable         | Required | Description                              |
|------------------|----------|------------------------------------------|
| `PORT`           | No       | Server port (default: 5000)              |
| `CLIENT_URL`     | Yes      | Frontend URL for CORS                    |
| `DB_HOST`        | Yes      | MySQL host                               |
| `DB_PORT`        | No       | MySQL port (default: 3306)               |
| `DB_USER`        | Yes      | MySQL username                           |
| `DB_PASS`        | Yes      | MySQL password                           |
| `DB_NAME`        | Yes      | MySQL database name                      |
| `JWT_SECRET`     | Yes      | Secret key for signing JWTs (min 32 chars)|
| `JWT_EXPIRES`    | No       | Token expiry (default: 7d)               |
| `RESEND_API_KEY` | Yes      | API key from resend.com                  |

---

## Deployment (Render)

1. Push this repository to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repository
4. Set the **Root Directory** to `server`
5. Set **Build Command** to `npm install`
6. Set **Start Command** to `npm start`
7. Add all environment variables from the table above
8. Set `CLIENT_URL` to your live Hostinger frontend URL

---

## Built by

Developed as a full-stack copy trading platform demonstrating production-ready patterns including JWT auth, email OTP verification, role-based access control, real-time admin balance management, and a fully branded transactional email system.
