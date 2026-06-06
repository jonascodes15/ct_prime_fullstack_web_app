-- ═══════════════════════════════════════════════════════
--  CopyTradePrime — Full MySQL Database Schema
--  Run this file once to set up all tables
-- ═══════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS copytradeprime CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE copytradeprime;

-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(120)              NOT NULL,
  email         VARCHAR(191)              NOT NULL UNIQUE,
  password_hash VARCHAR(255)              NOT NULL,
  role          ENUM('client','admin')    NOT NULL DEFAULT 'client',
  is_active     TINYINT(1)               NOT NULL DEFAULT 1,
  created_at    TIMESTAMP                NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- TRADERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS traders (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(120)   NOT NULL,
  avatar_url      VARCHAR(255)   DEFAULT NULL,
  strategy        VARCHAR(255)   DEFAULT NULL,
  win_rate        DECIMAL(5,2)   NOT NULL DEFAULT 0.00,
  monthly_return  DECIMAL(5,2)   NOT NULL DEFAULT 0.00,
  total_followers INT            NOT NULL DEFAULT 0,
  is_active       TINYINT(1)    NOT NULL DEFAULT 1,
  created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- USER ↔ TRADER LINK
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_traders (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT          NOT NULL,
  trader_id    INT          NOT NULL,
  is_current   TINYINT(1)   NOT NULL DEFAULT 1,
  activated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (trader_id) REFERENCES traders(id) ON DELETE CASCADE,
  INDEX idx_user_current (user_id, is_current)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- ACCOUNT BALANCES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS account_balances (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT            NOT NULL UNIQUE,
  balance         DECIMAL(18,8)  NOT NULL DEFAULT 0.00000000,
  total_profit    DECIMAL(18,8)  NOT NULL DEFAULT 0.00000000,
  total_deposited DECIMAL(18,8)  NOT NULL DEFAULT 0.00000000,
  last_updated    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- EARNINGS LOG
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS earnings (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT            NOT NULL,
  amount      DECIMAL(18,8)  NOT NULL,
  period_type ENUM('daily','weekly') NOT NULL,
  note        VARCHAR(255)   DEFAULT NULL,
  created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_earnings (user_id, created_at)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- ACTIVE TRADES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS active_trades (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT            NOT NULL,
  asset       VARCHAR(50)    NOT NULL,
  direction   ENUM('BUY','SELL') NOT NULL,
  entry_price DECIMAL(18,8)  NOT NULL,
  quantity    DECIMAL(18,8)  NOT NULL,
  profit_loss DECIMAL(18,8)  NOT NULL DEFAULT 0.00000000,
  status      ENUM('open','closed') NOT NULL DEFAULT 'open',
  opened_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_trades (user_id, status)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- CRYPTO WALLETS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS crypto_wallets (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  coin_name      VARCHAR(60)   NOT NULL,
  coin_symbol    VARCHAR(10)   NOT NULL,
  network        VARCHAR(60)   DEFAULT NULL,
  wallet_address VARCHAR(255)  NOT NULL,
  qr_code_url    VARCHAR(255)  DEFAULT NULL,
  is_active      TINYINT(1)   NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- DEPOSITS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deposits (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT            NOT NULL,
  wallet_id    INT            DEFAULT NULL,
  amount       DECIMAL(18,8)  DEFAULT NULL,
  tx_hash      VARCHAR(255)   DEFAULT NULL,
  status       ENUM('pending','confirmed','rejected') NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP      DEFAULT NULL,
  FOREIGN KEY (user_id)   REFERENCES users(id)          ON DELETE CASCADE,
  FOREIGN KEY (wallet_id) REFERENCES crypto_wallets(id) ON DELETE SET NULL,
  INDEX idx_user_deposits (user_id, status)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
-- WITHDRAWALS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS withdrawals (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT            NOT NULL,
  amount         DECIMAL(18,8)  NOT NULL,
  wallet_address VARCHAR(255)   NOT NULL,
  coin_symbol    VARCHAR(10)    NOT NULL,
  status         ENUM('pending','approved','rejected','processing') NOT NULL DEFAULT 'pending',
  admin_note     VARCHAR(255)   DEFAULT NULL,
  requested_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at   TIMESTAMP      DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_withdrawals (user_id, status)
) ENGINE=InnoDB;

-- ═══════════════════════════════════════════════════════
--  SEED DATA — Sample traders (edit as needed)
-- ═══════════════════════════════════════════════════════
INSERT INTO traders (name, strategy, win_rate, monthly_return, total_followers) VALUES
  ('Alex Rivera',   'Trend Following — Forex & Indices',  78.40, 12.50, 4821),
  ('Priya Sharma',  'Scalping — Crypto & Commodities',    72.10,  9.80, 2934),
  ('Marcus Chen',   'Swing Trading — Stocks & ETFs',      81.20, 15.30, 7102),
  ('Sophia Okafor', 'News Trading — Forex Majors',        69.50,  8.20, 1876),
  ('Liam Dupont',   'Algorithmic — Multi-Asset',          85.70, 18.90, 9540),
  ('Yara Al-Farsi', 'Price Action — Crypto Pairs',        74.30, 11.40, 3217);

-- ═══════════════════════════════════════════════════════
--  SEED — Default admin user (change password after setup!)
--  Password: Admin@123456  (bcrypt hash below)
-- ═══════════════════════════════════════════════════════
INSERT INTO users (full_name, email, password_hash, role) VALUES
  ('Admin', 'admin@copytradeprime.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8v3qM1e8A5Ow9R7rK9W', 'admin');
-- ⚠ Replace the hash above — generate with: node -e "const b=require('bcrypt');b.hash('YourPassword',12).then(console.log)"

USE copytradeprime;

INSERT INTO crypto_wallets (coin_name, coin_symbol, network, wallet_address) VALUES
('Bitcoin',  'BTC',  'Bitcoin Network',  '1CRUkzeMHtDYqC1XxTwNYms5E4NArjFnYV'),
('Ethereum', 'ETH',  'ERC-20',           '0xbf5ad1c3189359e1a131e74427b29724507d8cc1'),
('BNB',      'BNB',  'BEP-20',           '0xbf5ad1c3189359e1a131e74427b29724507d8cc1'),
('Solana',   'SOL',  'Solana Network',   'JBU9MGoRw9FDrVVvSXA6Vw2wTPuY6Q8pY3Nb49pEftv6'),
('Tether',   'USDT', 'TRC-20',           'TPP6M7e6XFTMUsBty4ZaYJdgMT7GRvwMkN'),
('USD Coin', 'USDC', 'ERC-20',           '0xbf5ad1c3189359e1a131e74427b29724507d8cc1'),
('TRON',     'TRX',  'TRC-20',           'TPP6M7e6XFTMUsBty4ZaYJdgMT7GRvwMkN'),
('Polygon',  'POL',  'Polygon PoS',      '0xbf5ad1c3189359e1a131e74427b29724507d8cc1'),
('Toncoin',  'TON',  'TON Network',      'UQCp6nC-T_iIWifbp58fDcpd9OT4hz_3etWNw9REta64Znd3'),
('Sui',      'SUI',  'SUI Network',      '0xf216ffb6cd2b7ee7e950d0a4d00a0a4c00a401715b2f68953c2b8d2f58050943');