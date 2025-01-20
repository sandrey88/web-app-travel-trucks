export const formatPrice = (price) => {
  // Converting the number into a string with two decimal places
  const formattedNumber = price.toFixed(2).replace('.', ',');

  return `€${formattedNumber}`;
};
