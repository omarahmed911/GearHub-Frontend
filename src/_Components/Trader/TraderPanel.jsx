import React, { useState, useEffect, useMemo } from 'react';
import api from '../../utils/api';
import {
  FiPackage,
  FiDollarSign,
  FiTag,
  FiLayers,
  FiList,
  FiTrash2,
  FiPlusCircle,
  FiTrendingUp,
  FiBox,
  FiShoppingBag,
  FiAlertCircle,
  FiCheck,
  FiSearch,
  FiRefreshCw,
  FiX,
  FiArrowDown,
} from 'react-icons/fi';
import './TraderPanel.css';

const CATEGORIES = [
  { group: 'Seats & Upholstery', items: ['Front Seats', 'Rear Seats', 'Seat Covers', 'Foam & Cushioning', 'Headrests'] },
  { group: 'Dashboard & Controls', items: ['Dashboard Panels', 'Instrument Cluster', 'Steering Wheel', 'Gear Shift Knob', 'Center Console'] },
  { group: 'HVAC System', items: ['Air Conditioning Vents', 'Blower Motor', 'AC Controls', 'Cabin Filter'] },
  { group: 'Electrical Interior', items: ['Interior Lights', 'Switches', 'Wiring Harness', 'Sensors'] },
  { group: 'Doors & Interior Panels', items: ['Door Panels', 'Door Handles', 'Window Mechanism', 'Lock System'] },
  { group: 'Storage & Comfort', items: ['Glove Box', 'Armrest', 'Cup Holders', 'Interior Trim'] },
  { group: 'Body Panels', items: ['Front Bumper', 'Rear Bumper', 'Hood / Bonnet', 'Fenders', 'Doors', 'Roof Panels'] },
  { group: 'Lighting System', items: ['Headlights', 'Taillights', 'Fog Lights', 'Turn Signals', 'DRL'] },
  { group: 'Mirrors & Glass', items: ['Side Mirrors', 'Rear View Mirror', 'Windshield', 'Side Windows', 'Rear Glass'] },
  { group: 'Wheels & Tires', items: ['Alloy Wheels', 'Steel Wheels', 'Tires', 'Wheel Caps', 'Lug Nuts'] },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'stock-asc', label: 'Stock: low to high' },
];

const LOW_STOCK_THRESHOLD = 5;
const DESC_MAX = 500;

function getCategoryImage(category, name) {
  const cat = (category || '').toLowerCase();
  const n = (name || '').toLowerCase();
  if (cat.includes('seat') || n.includes('seat')) {
    return 'https://images.unsplash.com/photo-1603513470760-49666dd9d560?auto=format&fit=crop&w=600&q=80';
  }
  if (cat.includes('wheel') || cat.includes('tire') || n.includes('wheel')) {
    return 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80';
  }
  if (cat.includes('light') || n.includes('light')) {
    return 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80';
  }
  if (cat.includes('mirror') || n.includes('mirror')) {
    return 'https://images.unsplash.com/photo-1550346049-74d4df0ee8e6?auto=format&fit=crop&w=600&q=80';
  }
  if (cat.includes('dashboard') || cat.includes('interior') || n.includes('interior')) {
    return 'https://images.unsplash.com/photo-1629897048514-3dd74142fbce?auto=format&fit=crop&w=600&q=80';
  }
  return 'https://images.unsplash.com/photo-1503376760359-f2e152d192f1?auto=format&fit=crop&w=600&q=80';
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function TraderPanel() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stockQuantity, setStockQuantity] = useState(10);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.get('/products/mine');
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Failed to load your inventory. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!success) return undefined;
    const t = setTimeout(() => setSuccess(''), 4000);
    return () => clearTimeout(t);
  }, [success]);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!name.trim() || !price || !category) {
      setError('Please fill in product name, price, and category.');
      return;
    }

    if (parseFloat(price) <= 0) {
      setError('Price must be greater than zero.');
      return;
    }

    if (parseInt(stockQuantity, 10) < 0) {
      setError('Stock cannot be negative.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await api.post('/products', {
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        stockQuantity: parseInt(stockQuantity, 10),
        category,
      });
      setSuccess('Product published successfully.');
      setName('');
      setPrice('');
      setDescription('');
      setCategory('');
      setStockQuantity(10);
      loadProducts();
    } catch (err) {
      setError(err.message || 'Failed to publish product.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, productName) => {
    if (!window.confirm(`Remove "${productName}" from your catalog? This cannot be undone.`)) return;
    try {
      setError('');
      await api.delete(`/products/${id}`);
      setSuccess('Product removed from your catalog.');
      loadProducts();
    } catch {
      setError('Failed to delete product. Please try again.');
    }
  };

  const scrollToForm = () => {
    document.getElementById('trader-add-product')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0);
  const inventoryValue = products.reduce((acc, p) => acc + (p.price || 0) * (p.stockQuantity || 0), 0);
  const avgProductPrice =
    totalProducts > 0
      ? (products.reduce((acc, p) => acc + (p.price || 0), 0) / totalProducts).toFixed(2)
      : '0.00';
  const lowStockCount = products.filter((p) => (p.stockQuantity || 0) < LOW_STOCK_THRESHOLD).length;

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = [...products];

    if (q) {
      list = list.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'name':
        list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'price-asc':
        list.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        list.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'stock-asc':
        list.sort((a, b) => (a.stockQuantity || 0) - (b.stockQuantity || 0));
        break;
      case 'newest':
      default:
        list.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
    }

    return list;
  }, [products, searchQuery, sortBy]);

  return (
    <div className="trader-page animate-fade-in">
      <div className="trader-page__glow trader-page__glow--tl" aria-hidden="true" />
      <div className="trader-page__glow trader-page__glow--br" aria-hidden="true" />

      <div className="trader-page__inner">
        <header className="trader-header">
          <div className="trader-header__icon" aria-hidden="true">
            <FiTrendingUp />
          </div>
          <div>
            <h1 className="trader-header__title">Trader Dashboard</h1>
            <p className="trader-header__subtitle">
              Publish parts, track stock, and manage your GearHub catalog in one place.
            </p>
          </div>
        </header>

        <section className="trader-stats" aria-label="Inventory overview">
          <article className="trader-stat-card trader-stat-card--blue">
            <div className="trader-stat-card__top" />
            <div className="trader-stat-card__row">
              <div>
                <p className="trader-stat-card__label">Total listings</p>
                <p className="trader-stat-card__value">{totalProducts}</p>
                <p className="trader-stat-card__hint">Active products</p>
              </div>
              <div className="trader-stat-card__badge trader-stat-card__badge--blue">
                <FiBox />
              </div>
            </div>
          </article>

          <article className="trader-stat-card trader-stat-card--green">
            <div className="trader-stat-card__top" />
            <div className="trader-stat-card__row">
              <div>
                <p className="trader-stat-card__label">Total stock</p>
                <p className="trader-stat-card__value">{totalStock}</p>
                <p className="trader-stat-card__hint">Units on hand</p>
              </div>
              <div className="trader-stat-card__badge trader-stat-card__badge--green">
                <FiLayers />
              </div>
            </div>
          </article>

          <article className="trader-stat-card trader-stat-card--purple">
            <div className="trader-stat-card__top" />
            <div className="trader-stat-card__row">
              <div>
                <p className="trader-stat-card__label">Average price</p>
                <p className="trader-stat-card__value">E£ {avgProductPrice}</p>
                <p className="trader-stat-card__hint">Per listing</p>
              </div>
              <div className="trader-stat-card__badge trader-stat-card__badge--purple">
                <FiDollarSign />
              </div>
            </div>
          </article>

          <article className="trader-stat-card trader-stat-card--amber">
            <div className="trader-stat-card__top" />
            <div className="trader-stat-card__row">
              <div>
                <p className="trader-stat-card__label">Inventory value</p>
                <p className="trader-stat-card__value">E£ {inventoryValue.toLocaleString()}</p>
                <p className="trader-stat-card__hint">Price × stock</p>
              </div>
              <div className="trader-stat-card__badge trader-stat-card__badge--amber">
                <FiTrendingUp />
              </div>
            </div>
          </article>
        </section>

        {error && (
          <div className="trader-alert trader-alert--error" role="alert">
            <FiAlertCircle aria-hidden="true" />
            <span>{error}</span>
            <button type="button" className="trader-alert__close" onClick={() => setError('')} aria-label="Dismiss error">
              <FiX />
            </button>
          </div>
        )}

        {success && (
          <div className="trader-alert trader-alert--success" role="status">
            <FiCheck aria-hidden="true" />
            <span>{success}</span>
            <button type="button" className="trader-alert__close" onClick={() => setSuccess('')} aria-label="Dismiss message">
              <FiX />
            </button>
          </div>
        )}

        <section id="trader-add-product" className="trader-form-panel glass-card">
          <div className="trader-form-panel__head">
            <div className="trader-form-panel__head-icon" aria-hidden="true">
              <FiPlusCircle />
            </div>
            <div>
              <h2 className="trader-form-panel__title">Add new product</h2>
              <p className="trader-form-panel__desc">List a part buyers can find in the marketplace</p>
            </div>
          </div>

          <form onSubmit={handleAddProduct} className="trader-form">
            <div className="trader-form__grid">
              <div className="trader-field">
                <label className="trader-field__label" htmlFor="trader-name">
                  <FiPackage aria-hidden="true" /> Product name
                </label>
                <input
                  id="trader-name"
                  type="text"
                  placeholder="e.g. Leather front seat cover"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="trader-field__input"
                  required
                />
              </div>

              <div className="trader-field">
                <label className="trader-field__label" htmlFor="trader-price">
                  <FiDollarSign aria-hidden="true" /> Price
                </label>
                <div className="trader-price-wrap">
                  <span className="trader-price-wrap__prefix">E£</span>
                  <input
                    id="trader-price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="trader-field__input"
                    required
                  />
                </div>
              </div>

              <div className="trader-field">
                <label className="trader-field__label" htmlFor="trader-stock">
                  <FiLayers aria-hidden="true" /> Stock
                </label>
                <input
                  id="trader-stock"
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="trader-field__input"
                  required
                />
              </div>

              <div className="trader-field">
                <label className="trader-field__label" htmlFor="trader-category">
                  <FiTag aria-hidden="true" /> Category
                </label>
                <select
                  id="trader-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="trader-field__select"
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((group) => (
                    <optgroup key={group.group} label={group.group}>
                      {group.items.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            <div className="trader-field">
              <label className="trader-field__label" htmlFor="trader-description">
                <FiList aria-hidden="true" /> Description <span style={{ fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                id="trader-description"
                rows={3}
                maxLength={DESC_MAX}
                placeholder="Material, fitment, condition, compatibility…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="trader-field__textarea"
              />
              <span className="trader-field__hint">
                {description.length}/{DESC_MAX}
              </span>
            </div>

            <button type="submit" disabled={submitting} className="trader-submit">
              {submitting ? 'Publishing…' : 'Publish product'}
            </button>
          </form>
        </section>

        <section aria-labelledby="trader-listings-heading">
          <div className="trader-listings__head">
            <h2 id="trader-listings-heading" className="trader-listings__title">
              Your listings
            </h2>
            <div className="trader-listings__meta">
              <span className="trader-pill">{totalProducts} products</span>
              {lowStockCount > 0 && (
                <span className="trader-pill trader-pill--warn">
                  {lowStockCount} low stock
                </span>
              )}
            </div>
          </div>

          {!loading && totalProducts > 0 && (
            <div className="trader-toolbar">
              <label className="trader-search">
                <FiSearch aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search by name, category, or description…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search listings"
                />
              </label>

              <label className="trader-sort">
                <FiArrowDown aria-hidden="true" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort listings">
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                className={`trader-refresh ${loading ? 'trader-refresh--spin' : ''}`}
                onClick={loadProducts}
                disabled={loading}
                aria-label="Refresh inventory"
              >
                <FiRefreshCw aria-hidden="true" />
                Refresh
              </button>
            </div>
          )}

          {loading ? (
            <div className="trader-skeleton-grid" aria-busy="true" aria-label="Loading inventory">
              {[1, 2, 3].map((i) => (
                <div key={i} className="trader-skeleton-card" />
              ))}
            </div>
          ) : totalProducts === 0 ? (
            <div className="trader-empty glass-card">
              <div className="trader-empty__icon" aria-hidden="true">
                <FiBox />
              </div>
              <h3 className="trader-empty__title">No products yet</h3>
              <p className="trader-empty__text">
                Your catalog is empty. Add your first part using the form above.
              </p>
              <button type="button" className="trader-empty__cta" onClick={scrollToForm}>
                <FiPlusCircle aria-hidden="true" />
                Add your first product
              </button>
            </div>
          ) : (
            <div className="trader-grid">
              {filteredProducts.length === 0 ? (
                <p className="trader-no-results">
                  No listings match &ldquo;{searchQuery}&rdquo;. Try a different search or clear the filter.
                </p>
              ) : (
                filteredProducts.map((p) => {
                  const isLowStock = (p.stockQuantity || 0) < LOW_STOCK_THRESHOLD;
                  return (
                    <article key={p.id} className="trader-product-card glass-card">
                      <div className="trader-product-card__image-wrap">
                        <img
                          src={getCategoryImage(p.category, p.name)}
                          alt=""
                          className="trader-product-card__image"
                          loading="lazy"
                        />
                        <div className="trader-product-card__image-overlay" aria-hidden="true" />
                        <button
                          type="button"
                          className="trader-product-card__delete"
                          onClick={() => handleDelete(p.id, p.name)}
                          aria-label={`Delete ${p.name}`}
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      <div className="trader-product-card__body">
                        <div className="trader-product-card__tags">
                          {p.category && <span className="trader-tag">{p.category}</span>}
                          {isLowStock && <span className="trader-tag trader-tag--low">Low stock</span>}
                        </div>

                        <h3 className="trader-product-card__name">{p.name}</h3>

                        {p.description && (
                          <p className="trader-product-card__desc">{p.description}</p>
                        )}

                        <p className="trader-product-card__price">E£ {formatPrice(p.price)}</p>

                        <footer className="trader-product-card__footer">
                          <span className="trader-product-card__stock">
                            <FiShoppingBag aria-hidden="true" />
                            {p.stockQuantity ?? 0} in stock
                          </span>
                          <span>#{p.id}</span>
                        </footer>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
