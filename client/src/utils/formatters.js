export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount || 0);

export const formatCrypto = (amount, decimals = 8) =>
  parseFloat(amount || 0).toFixed(decimals);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const formatPercent = (val) => `${val >= 0 ? '+' : ''}${parseFloat(val || 0).toFixed(2)}%`;
