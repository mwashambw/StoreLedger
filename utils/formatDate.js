exports.formatDate = (date) => {
  const dateTimeStamps = new Date(date);
  const formatedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateTimeStamps);

  return formatedDate;
};
