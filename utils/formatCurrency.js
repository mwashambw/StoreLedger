exports.formatCurrency = (value) => {
  const formatedCurrency = new Intl.NumberFormat('en', {
    style: 'decimal',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);

  return formatedCurrency;
};
