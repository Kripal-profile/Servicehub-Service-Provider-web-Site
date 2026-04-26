import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getServices } from '../utils/api';
import ServiceCard from '../components/services/ServiceCard';
import './Services.css';

const CATEGORIES = ['All', 'Electrical', 'Plumbing', 'Cleaning', 'Carpentry', 'Painting', 'Gardening', 'Moving', 'AC Repair', 'Other'];

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    search: searchParams.get('search') || '',
    minPrice: '', maxPrice: '',
    page: 1,
  });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.location) params.location = filters.location;
      if (filters.search) params.search = filters.search;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      params.page = filters.page;
      params.limit = 12;
      const { data } = await getServices(params);
      setServices(data.services);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }));

  return (
    <div className="page">
      <div className="container">
        <div className="services-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <h3 className="filters-title">Filters</h3>
            <div className="form-group">
              <label className="form-label">Search</label>
              <input type="text" className="form-input" placeholder="e.g. pipe repair..."
                value={filters.search} onChange={e => setFilter('search', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <div className="category-list">
                {CATEGORIES.map(c => (
                  <button key={c} className={`cat-filter-btn ${(filters.category || 'All') === c ? 'active' : ''}`}
                    onClick={() => setFilter('category', c === 'All' ? '' : c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" className="form-input" placeholder="City or area..."
                value={filters.location} onChange={e => setFilter('location', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Price Range (₹)</label>
              <div className="price-range">
                <input type="number" className="form-input" placeholder="Min"
                  value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)} />
                <span>to</span>
                <input type="number" className="form-input" placeholder="Max"
                  value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)} />
              </div>
            </div>
            <button className="btn btn-secondary" style={{width:'100%'}}
              onClick={() => setFilters({ category: '', location: '', search: '', minPrice: '', maxPrice: '', page: 1 })}>
              Clear Filters
            </button>
          </aside>

          {/* Main Grid */}
          <main className="services-main">
            <div className="services-header">
              <h2>{total} Service{total !== 1 ? 's' : ''} Found</h2>
            </div>
            {loading ? (
              <div className="spinner-page" />
            ) : services.length === 0 ? (
              <div className="empty-state">
                <h3>No services found</h3>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="services-grid">
                {services.map(s => <ServiceCard key={s._id} service={s} />)}
              </div>
            )}
            {pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`page-btn ${filters.page === p ? 'active' : ''}`}
                    onClick={() => setFilters(f => ({ ...f, page: p }))}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
