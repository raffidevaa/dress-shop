const formatPrice = (price: number): string => {
  return `P${new Intl.NumberFormat('en-US').format(price)}`;
};

export default formatPrice;
