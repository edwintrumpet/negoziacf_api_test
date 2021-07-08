const nextYear = () => {
  const YEAR_IN_MILLISECONDS = 365 * 24 * 60 * 60 * 1000;
  const date = new Date();
  date.setTime(date.getTime() + YEAR_IN_MILLISECONDS);
  return date;
};

module.exports = { nextYear };
