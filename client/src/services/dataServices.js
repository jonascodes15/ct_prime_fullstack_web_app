import api from './api';

export const dashboardService = {
  getData: () => api.get('/dashboard'),
};

export const traderService = {
  list:     ()           => api.get('/traders'),
  activate: (trader_id)  => api.post('/traders/activate', { trader_id }),
};

export const depositService = {
  getWallets: ()     => api.get('/deposits/wallets'),
  submit:     (data) => api.post('/deposits', data),
};

export const withdrawalService = {
  request:    (data) => api.post('/withdrawals', data),
  getHistory: ()     => api.get('/withdrawals'),
};
