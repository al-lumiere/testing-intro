function addToCart(cart, product, quantity = 1) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new RangeError('Количество должно быть положительным целым числом');
  }

  const item = cart.find((item) => item.id === product.id);
  const totalQ = (item?.quantity ?? 0) + quantity;

  if (totalQ > product.stock) {
    throw new RangeError('Недостаточно товара на складе');
  }

  if (item) {
    return cart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: totalQ }
        : item
    );
  }

  return [...cart, { ...product, quantity }];
}

function changeQuantity(cart, productId, quantity) {
  const item = cart.find((item) => item.id === productId);

  if (!item) {
    return [...cart];
  }

  if (
    !Number.isInteger(quantity) ||
    quantity <= 0 ||
    quantity > item.stock
  ) {
    throw new RangeError('Недопустимое количество товара');
  }

  return cart.map((item) =>
    item.id === productId ? { ...item, quantity } : item
  );
}

function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateOrderTotal(cart, promoCode = '') {
  const subtotal = calculateCartSubtotal(cart);

  const discount =
    promoCode === 'SAVE10' && subtotal >= 20000
      ? Math.round(subtotal * 0.1)
      : 0;

  const delivery = subtotal < 50000 ? 30000 : 0;
  const total = subtotal - discount + delivery;
  return { subtotal, discount, delivery, total };
}

const cartApi = {
  addToCart,
  changeQuantity,
  removeFromCart,
  calculateCartSubtotal,
  calculateOrderTotal,
};

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;