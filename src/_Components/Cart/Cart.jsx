import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiCreditCard,
  FiArrowLeft,
  FiAlertCircle,
  FiCheck,
  FiTruck,
} from 'react-icons/fi';
import './Cart.css';

function getProductImage(item) {
  if (item.imageUrl) return item.imageUrl;
  const cat = (item.category || '').toLowerCase();
  const name = (item.productName || '').toLowerCase();
  if (cat.includes('seat') || name.includes('seat')) {
    return 'https://images.unsplash.com/photo-1603513470760-49666dd9d560?auto=format&fit=crop&w=400&q=80';
  }
  if (cat.includes('wheel') || cat.includes('tire')) {
    return 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=400&q=80';
  }
  return 'https://images.unsplash.com/photo-1503376760359-f2e152d192f1?auto=format&fit=crop&w=400&q=80';
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutStatus, setCheckoutStatus] = useState('');
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setError('');
      const data = await api.get('/cart');
      setCart(data);
    } catch (e) {
      setError(e.message || 'Could not load your cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [navigate]);

  const updateQuantity = async (productId, quantity, maxStock) => {
    if (quantity < 1) return;
    if (maxStock != null && quantity > maxStock) {
      setError(`Only ${maxStock} units available in stock.`);
      return;
    }
    try {
      setUpdatingProductId(productId);
      setError('');
      await api.put(`/cart/items/${productId}`, { quantity });
      await fetchCart();
    } catch (e) {
      setError(e.message || 'Failed to update quantity.');
    } finally {
      setUpdatingProductId(null);
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdatingProductId(productId);
      setError('');
      await api.delete(`/cart/items/${productId}`);
      await fetchCart();
    } catch (e) {
      setError(e.message || 'Failed to remove item.');
    } finally {
      setUpdatingProductId(null);
    }
  };

  const checkout = async () => {
    try {
      setCheckoutStatus('loading');
      setError('');
      const order = await api.post('/orders/checkout');
      setCheckoutStatus('success');
      setTimeout(() => {
        navigate('/orders', {
          state: {
            orderPlaced: true,
            orderId: order?.id,
          },
        });
      }, 1200);
    } catch (e) {
      setError(e.message || 'Checkout failed. Please try again.');
      setCheckoutStatus('');
    }
  };

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  const { itemCount, cartTotal } = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce(
      (sum, item) => sum + (item.unitPrice || 0) * item.quantity,
      0
    );
    return { itemCount: count, cartTotal: total };
  }, [items]);

  if (loading) {
    return (
      <div className="cart-page animate-fade-in">
        <div className="cart-page__inner">
          <div className="cart-loading">
            <div className="cart-loading__spinner" />
            <p>Loading your cart…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page animate-fade-in">
      <div className="cart-page__glow cart-page__glow--tl" aria-hidden="true" />
      <div className="cart-page__glow cart-page__glow--br" aria-hidden="true" />

      <div className="cart-page__inner">
        <header className="cart-header">
          <div className="cart-header__left">
            <div className="cart-header__icon" aria-hidden="true">
              <FiShoppingBag />
            </div>
            <div>
              <h1 className="cart-header__title">Your cart</h1>
              <p className="cart-header__subtitle">
                {isEmpty
                  ? 'Add parts from the catalog to get started.'
                  : `${itemCount} item${itemCount !== 1 ? 's' : ''} ready for checkout`}
              </p>
            </div>
          </div>
          {!isEmpty && (
            <span className="cart-header__badge">{itemCount} in cart</span>
          )}
          <Link to="/products" className="cart-back-link">
            <FiArrowLeft aria-hidden="true" />
            Continue shopping
          </Link>
        </header>

        {error && (
          <div className="cart-alert cart-alert--error" role="alert">
            <FiAlertCircle aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {checkoutStatus === 'success' && (
          <div className="cart-alert cart-alert--success" role="status">
            <FiCheck aria-hidden="true" />
            <span>Order placed! Redirecting to your orders…</span>
          </div>
        )}

        {isEmpty ? (
          <div className="cart-empty glass-card">
            <div className="cart-empty__icon" aria-hidden="true">
              <FiShoppingBag />
            </div>
            <h2 className="cart-empty__title">Your cart is empty</h2>
            <p className="cart-empty__text">
              Browse the catalog and add automotive parts. Your selections will appear here.
            </p>
            <Link to="/products" className="cart-empty__btn">
              <FiArrowLeft aria-hidden="true" />
              Browse products
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item) => {
                const busy = updatingProductId === item.productId;
                const maxStock = item.stockQuantity ?? 99;
                const atMax = item.quantity >= maxStock;

                return (
                  <article
                    key={item.productId}
                    className={`cart-item glass-card ${busy ? 'cart-item--updating' : ''}`}
                  >
                    <div className="cart-item__image-wrap">
                      <img
                        src={getProductImage(item)}
                        alt=""
                        className="cart-item__image"
                        loading="lazy"
                      />
                    </div>

                    <div className="cart-item__info">
                      <h3 className="cart-item__name">{item.productName}</h3>
                      {item.category && (
                        <span className="cart-item__category">{item.category}</span>
                      )}
                      <p className="cart-item__unit">
                        E£ {formatMoney(item.unitPrice)} each
                      </p>
                      {atMax && (
                        <p className="cart-item__stock-warn">
                          Max stock: {maxStock} available
                        </p>
                      )}

                      <div className="cart-item__actions">
                        <div className="cart-qty">
                          <button
                            type="button"
                            className="cart-qty__btn"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1, maxStock)
                            }
                            disabled={busy || item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <FiMinus />
                          </button>
                          <span className="cart-qty__value">{item.quantity}</span>
                          <button
                            type="button"
                            className="cart-qty__btn"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1, maxStock)
                            }
                            disabled={busy || atMax}
                            aria-label="Increase quantity"
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="cart-item__side">
                      <span className="cart-item__line-total">
                        E£ {formatMoney(item.unitPrice * item.quantity)}
                      </span>
                      <button
                        type="button"
                        className="cart-item__remove"
                        onClick={() => removeItem(item.productId)}
                        disabled={busy}
                        aria-label={`Remove ${item.productName}`}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="cart-summary glass-card">
              <h2 className="cart-summary__title">Order summary</h2>

              <div className="cart-summary__row">
                <span>Subtotal ({itemCount} items)</span>
                <span>E£ {formatMoney(cartTotal)}</span>
              </div>
              <div className="cart-summary__row cart-summary__row--free">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="cart-summary__row">
                <span>Taxes</span>
                <span>E£ 0.00</span>
              </div>

              <div className="cart-summary__total">
                <span className="cart-summary__total-label">Total</span>
                <span className="cart-summary__total-value">E£ {formatMoney(cartTotal)}</span>
              </div>

              <p className="cart-summary__cod">
                <FiTruck aria-hidden="true" />
                Cash on delivery (COD) — pay when your order arrives
              </p>

              <button
                type="button"
                onClick={checkout}
                disabled={checkoutStatus === 'loading' || checkoutStatus === 'success'}
                className={`cart-checkout ${
                  checkoutStatus === 'success'
                    ? 'cart-checkout--success'
                    : 'cart-checkout--primary'
                }`}
              >
                {checkoutStatus === 'loading' ? (
                  'Placing order…'
                ) : checkoutStatus === 'success' ? (
                  <>
                    <FiCheck aria-hidden="true" />
                    Order placed!
                  </>
                ) : (
                  <>
                    <FiCreditCard aria-hidden="true" />
                    Place order (COD)
                  </>
                )}
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
