import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../utils/api';
import {
  FiBox,
  FiCalendar,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiSearch,
  FiRefreshCw,
  FiChevronDown,
  FiTruck,
  FiXCircle,
  FiPackage,
  FiInbox,
} from 'react-icons/fi';
import './Orders.css';

const STATUS_META = {
  PENDING: { label: 'Pending', icon: FiClock, className: 'orders-status--pending' },
  ACCEPTED: { label: 'Accepted', icon: FiCheck, className: 'orders-status--accepted' },
  PROCESSING: { label: 'Processing', icon: FiPackage, className: 'orders-status--processing' },
  DELIVERED: { label: 'Delivered', icon: FiCheckCircle, className: 'orders-status--delivered' },
  DENIED: { label: 'Denied', icon: FiXCircle, className: 'orders-status--denied' },
};

const TRADER_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'active', label: 'In progress' },
  { id: 'DELIVERED', label: 'Delivered' },
  { id: 'DENIED', label: 'Denied' },
];

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getCustomerKey(order) {
  if (!order.customer) return 'unknown';
  return order.customer.email || order.customer.name || 'unknown';
}

function getCustomerLabel(order) {
  if (!order.customer) return { name: 'Unknown customer', email: '' };
  return {
    name: order.customer.username || order.customer.name || 'Customer',
    email: order.customer.email || '',
  };
}

function getLineItemsForActor(order, traderId) {
  const items = order.items || [];
  if (!traderId) return items;
  return items.filter(
    (item) => Number(item.product?.trader?.id) === Number(traderId)
  );
}

function traderSubtotal(order, traderId) {
  return getLineItemsForActor(order, traderId).reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );
}

function orderMatchesSearch(order, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const idMatch = String(order.id).includes(q);
  const customer = order.customer || {};
  const customerMatch =
    (customer.name || '').toLowerCase().includes(q) ||
    (customer.email || '').toLowerCase().includes(q) ||
    (customer.username || '').toLowerCase().includes(q);
  const itemsMatch = (order.items || []).some((item) =>
    (item.product?.name || '').toLowerCase().includes(q)
  );
  return idMatch || customerMatch || itemsMatch;
}

function orderMatchesFilter(order, filterId) {
  if (filterId === 'all') return true;
  if (filterId === 'active') {
    return order.status === 'ACCEPTED' || order.status === 'PROCESSING';
  }
  return order.status === filterId;
}

function getTraderActions(status) {
  switch (status) {
    case 'PENDING':
      return [
        { status: 'ACCEPTED', label: 'Accept', variant: 'success', icon: FiCheck },
        { status: 'DENIED', label: 'Decline', variant: 'danger', icon: FiXCircle },
      ];
    case 'ACCEPTED':
      return [{ status: 'PROCESSING', label: 'Start processing', variant: 'primary', icon: FiPackage }];
    case 'PROCESSING':
      return [{ status: 'DELIVERED', label: 'Mark delivered', variant: 'success', icon: FiTruck }];
    default:
      return [];
  }
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || {
    label: status || 'Unknown',
    icon: FiAlertTriangle,
    className: 'orders-status--pending',
  };
  const Icon = meta.icon;
  return (
    <span className={`orders-status ${meta.className}`}>
      <Icon aria-hidden="true" size={14} />
      {meta.label}
    </span>
  );
}

function OrderCard({ order, isTraderOrAdmin, traderId, onUpdateStatus, updatingId }) {
  const actions = isTraderOrAdmin ? getTraderActions(order.status) : [];
  const isPending = order.status === 'PENDING';
  const lineItems = getLineItemsForActor(order, isTraderOrAdmin ? traderId : null);
  const displayTotal = isTraderOrAdmin && traderId
    ? traderSubtotal(order, traderId)
    : order.totalAmount;

  return (
    <article
      className={`orders-card glass-card ${isPending && isTraderOrAdmin ? 'orders-card--pending' : ''}`}
    >
      <header className="orders-card__head">
        <div>
          <h3 className="orders-card__id">Order #{order.id}</h3>
          <p className="orders-card__date">
            <FiCalendar aria-hidden="true" />
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="orders-card__status-wrap">
          <StatusBadge status={order.status} />
        </div>
      </header>

      <div className="orders-card__body">
        <p className="orders-card__section-label">Line items</p>
        <ul className="orders-line-items">
          {lineItems.map((item) => (
            <li key={item.id} className="orders-line-item">
              <div className="orders-line-item__left">
                <span className="orders-line-item__qty">{item.quantity}×</span>
                <span className="orders-line-item__name">
                  {item.product?.name || 'Product'}
                </span>
              </div>
              <span className="orders-line-item__price">
                E£ {formatMoney((item.price || 0) * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <footer className="orders-card__footer">
          <div>
            <p className="orders-card__total-label">Order total</p>
            <p className="orders-card__total">
              E£ {formatMoney(displayTotal)}
              {isTraderOrAdmin && traderId && lineItems.length < (order.items?.length || 0) && (
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 500, color: '#6b7280', marginTop: '0.2rem' }}>
                  Your items in this order
                </span>
              )}
            </p>
            {order.paymentMethod && (
              <p className="orders-card__payment">Payment: {order.paymentMethod}</p>
            )}
          </div>

          {actions.length > 0 && (
            <div className="orders-actions">
              {actions.map((action) => {
                const Icon = action.icon;
                const busy = updatingId === order.id;
                return (
                  <button
                    key={action.status}
                    type="button"
                    className={`orders-action-btn orders-action-btn--${action.variant}`}
                    disabled={busy}
                    onClick={() => onUpdateStatus(order.id, action.status)}
                  >
                    <Icon aria-hidden="true" />
                    {busy ? 'Updating…' : action.label}
                  </button>
                );
              })}
            </div>
          )}
        </footer>
      </div>
    </article>
  );
}

export default function Orders() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isTraderOrAdmin = user.role === 'TRADER' || user.role === 'ADMIN';
  const traderId = user.role === 'TRADER' ? user.id : null;

  const fetchOrders = async ({ silent = false } = {}) => {
    try {
      if (silent) setRefreshing(true);
      else setLoading(true);
      setError('');
      const data = await api.get('/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Failed to load orders. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (location.state?.orderPlaced) {
      const id = location.state.orderId;
      setSuccess(
        id
          ? `Order #${id} placed successfully. ${isTraderOrAdmin ? 'It will appear here when it includes your products.' : 'Track its status below.'}`
          : 'Order placed successfully.'
      );
      window.history.replaceState({}, document.title);
    }
  }, [location.state, isTraderOrAdmin]);

  useEffect(() => {
    if (!isTraderOrAdmin) return undefined;
    const interval = setInterval(() => fetchOrders({ silent: true }), 30000);
    return () => clearInterval(interval);
  }, [isTraderOrAdmin]);

  useEffect(() => {
    if (!success) return undefined;
    const t = setTimeout(() => setSuccess(''), 5000);
    return () => clearTimeout(t);
  }, [success]);

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      setError('');
      await api.put(`/orders/${id}/status`, { status: newStatus });
      const label = STATUS_META[newStatus]?.label || newStatus;
      setSuccess(`Order #${id} updated to ${label}.`);
      await fetchOrders({ silent: true });
    } catch (e) {
      setError(e.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === 'PENDING').length;
    const active = orders.filter(
      (o) => o.status === 'ACCEPTED' || o.status === 'PROCESSING'
    ).length;
    const delivered = orders.filter((o) => o.status === 'DELIVERED').length;
    const revenue = orders
      .filter((o) => o.status !== 'DENIED')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return { total: orders.length, pending, active, delivered, revenue };
  }, [orders]);

  const filterCounts = useMemo(() => {
    const counts = { all: orders.length, PENDING: 0, active: 0, DELIVERED: 0, DENIED: 0 };
    orders.forEach((o) => {
      if (o.status === 'PENDING') counts.PENDING += 1;
      if (o.status === 'ACCEPTED' || o.status === 'PROCESSING') counts.active += 1;
      if (o.status === 'DELIVERED') counts.DELIVERED += 1;
      if (o.status === 'DENIED') counts.DENIED += 1;
    });
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) => orderMatchesFilter(o, statusFilter) && orderMatchesSearch(o, searchQuery)
    );
  }, [orders, statusFilter, searchQuery]);

  const groupedOrders = useMemo(() => {
    if (!isTraderOrAdmin) return null;
    const groups = filteredOrders.reduce((acc, order) => {
      const key = getCustomerKey(order);
      if (!acc[key]) {
        acc[key] = { label: getCustomerLabel(order), orders: [] };
      }
      acc[key].orders.push(order);
      return acc;
    }, {});

    Object.values(groups).forEach((g) => {
      g.orders.sort((a, b) => (b.id || 0) - (a.id || 0));
    });

    return Object.fromEntries(
      Object.entries(groups).sort(([, a], [, b]) => {
        const latestA = a.orders[0]?.id || 0;
        const latestB = b.orders[0]?.id || 0;
        return latestB - latestA;
      })
    );
  }, [filteredOrders, isTraderOrAdmin]);

  const toggleGroup = (key) => {
    setCollapsedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const pageClass = isTraderOrAdmin ? 'orders-page orders-page--trader animate-fade-in' : 'orders-page animate-fade-in';

  return (
    <div className={pageClass}>
      <div className="orders-page__glow orders-page__glow--tl" aria-hidden="true" />
      <div className="orders-page__glow orders-page__glow--br" aria-hidden="true" />

      <div className="orders-page__inner">
        <header className="orders-header">
          <div
            className={`orders-header__icon ${isTraderOrAdmin ? 'orders-header__icon--trader' : ''}`}
            aria-hidden="true"
          >
            {isTraderOrAdmin ? <FiInbox /> : <FiBox />}
          </div>
          <div>
            <h1 className="orders-header__title">
              {isTraderOrAdmin ? 'Order fulfillment' : 'My orders'}
            </h1>
            <p className="orders-header__subtitle">
              {isTraderOrAdmin
                ? 'Review customer purchases, update status, and track fulfillment from one place.'
                : 'Track your purchase history and delivery status.'}
            </p>
          </div>
        </header>

        {isTraderOrAdmin && !loading && stats.pending > 0 && (
          <div className="orders-alert orders-alert--success" style={{ borderColor: 'rgba(245, 158, 11, 0.35)', background: 'rgba(245, 158, 11, 0.1)', color: '#fcd34d' }} role="status">
            <FiClock aria-hidden="true" />
            <span>
              You have {stats.pending} pending order{stats.pending !== 1 ? 's' : ''} waiting for your response — accept or decline below.
            </span>
          </div>
        )}

        {isTraderOrAdmin && !loading && orders.length > 0 && (
          <section className="orders-stats" aria-label="Order overview">
            <button
              type="button"
              className={`orders-stat orders-stat--clickable ${statusFilter === 'all' ? 'orders-stat--active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              <p className="orders-stat__label">Total</p>
              <p className="orders-stat__value">{stats.total}</p>
              <p className="orders-stat__hint">All orders</p>
            </button>
            <button
              type="button"
              className={`orders-stat orders-stat--clickable orders-stat--amber ${statusFilter === 'PENDING' ? 'orders-stat--active' : ''}`}
              onClick={() => setStatusFilter('PENDING')}
            >
              <p className="orders-stat__label">Pending</p>
              <p className="orders-stat__value">{stats.pending}</p>
              <p className="orders-stat__hint">Needs action</p>
            </button>
            <button
              type="button"
              className={`orders-stat orders-stat--clickable orders-stat--blue ${statusFilter === 'active' ? 'orders-stat--active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              <p className="orders-stat__label">In progress</p>
              <p className="orders-stat__value">{stats.active}</p>
              <p className="orders-stat__hint">Accepted & processing</p>
            </button>
            <div className="orders-stat orders-stat--green">
              <p className="orders-stat__label">Revenue</p>
              <p className="orders-stat__value">E£ {formatMoney(stats.revenue)}</p>
              <p className="orders-stat__hint">{stats.delivered} delivered</p>
            </div>
          </section>
        )}

        {error && (
          <div className="orders-alert orders-alert--error" role="alert">
            <FiAlertTriangle aria-hidden="true" />
            <span>{error}</span>
            <button
              type="button"
              className="orders-alert__close"
              onClick={() => setError('')}
              aria-label="Dismiss error"
            >
              <FiX />
            </button>
          </div>
        )}

        {success && (
          <div className="orders-alert orders-alert--success" role="status">
            <FiCheck aria-hidden="true" />
            <span>{success}</span>
            <button
              type="button"
              className="orders-alert__close"
              onClick={() => setSuccess('')}
              aria-label="Dismiss message"
            >
              <FiX />
            </button>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <>
            <div className="orders-toolbar">
              <label className="orders-search">
                <FiSearch aria-hidden="true" />
                <input
                  type="search"
                  placeholder={
                    isTraderOrAdmin
                      ? 'Search order #, customer, or product…'
                      : 'Search order # or product…'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search orders"
                />
              </label>
              <button
                type="button"
                className={`orders-refresh ${refreshing ? 'orders-refresh--spin' : ''}`}
                onClick={() => fetchOrders({ silent: true })}
                disabled={refreshing || loading}
                aria-label="Refresh orders"
              >
                <FiRefreshCw aria-hidden="true" />
                Refresh
              </button>
            </div>

            {isTraderOrAdmin && (
              <div className="orders-filters" role="tablist" aria-label="Filter by status">
                {TRADER_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={statusFilter === f.id}
                    className={`orders-filter-chip ${statusFilter === f.id ? 'orders-filter-chip--active' : ''}`}
                    onClick={() => setStatusFilter(f.id)}
                  >
                    {f.label}
                    <span className="orders-filter-chip__count">({filterCounts[f.id] ?? 0})</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {loading ? (
          <div className="orders-list" aria-busy="true" aria-label="Loading orders">
            {[1, 2, 3].map((i) => (
              <div key={i} className="orders-skeleton" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty glass-card">
            <div className="orders-empty__icon" aria-hidden="true">
              <FiBox />
            </div>
            <h2 className="orders-empty__title">
              {isTraderOrAdmin ? 'No customer orders yet' : 'No orders yet'}
            </h2>
            <p className="orders-empty__text">
              {isTraderOrAdmin
                ? 'When customers purchase your listed parts, their orders will appear here for fulfillment.'
                : "You haven't placed any orders. Browse products and checkout when you're ready."}
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <p className="orders-no-results">
            No orders match your search or filter. Try clearing filters or adjusting your search.
          </p>
        ) : isTraderOrAdmin ? (
          <div className="orders-list">
            {Object.entries(groupedOrders).map(([key, group]) => {
              const isOpen = !collapsedGroups[key];
              const pendingInGroup = group.orders.filter((o) => o.status === 'PENDING').length;
              const initial = (group.label.name || '?').charAt(0).toUpperCase();

              return (
                <section key={key} className="orders-customer-group">
                  <button
                    type="button"
                    className="orders-customer-group__head"
                    onClick={() => toggleGroup(key)}
                    aria-expanded={isOpen}
                  >
                    <div className="orders-customer-group__user">
                      <span className="orders-customer-group__avatar" aria-hidden="true">
                        {initial}
                      </span>
                      <div>
                        <p className="orders-customer-group__name">{group.label.name}</p>
                        {group.label.email && (
                          <p className="orders-customer-group__email">{group.label.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="orders-customer-group__meta">
                      <span className="orders-customer-group__badge">
                        {group.orders.length} order{group.orders.length !== 1 ? 's' : ''}
                      </span>
                      {pendingInGroup > 0 && (
                        <span className="orders-customer-group__badge" style={{ color: '#fbbf24' }}>
                          {pendingInGroup} pending
                        </span>
                      )}
                      <FiChevronDown
                        className={`orders-customer-group__chevron ${isOpen ? 'orders-customer-group__chevron--open' : ''}`}
                        aria-hidden="true"
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="orders-customer-group__list">
                      {group.orders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          isTraderOrAdmin={isTraderOrAdmin}
                          traderId={traderId}
                          onUpdateStatus={updateStatus}
                          updatingId={updatingId}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isTraderOrAdmin={false}
                traderId={null}
                onUpdateStatus={updateStatus}
                updatingId={updatingId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
