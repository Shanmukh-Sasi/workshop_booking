import React, { useState } from 'react';

const Filters = ({ onFilter, filterOptions }) => {
  const [filters, setFilters] = useState({
    from_date: '',
    to_date: '',
    workshop_type: '',
    state: '',
    sort_by: 'oldest'
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleClear = () => {
    const emptyFilters = {
      from_date: '',
      to_date: '',
      workshop_type: '',
      state: '',
      sort_by: 'oldest'
    };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  const handleDownload = () => {
    const queryParams = new URLSearchParams({ ...filters, download: 'download' }).toString();
    window.location.href = `/statistics/public?${queryParams}`;
  };

  return (
    <form className="card p-4 shadow-sm border-0" style={{ borderRadius: '16px', backgroundColor: '#ffffff' }} onSubmit={handleApply}>
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-bold" style={{ color: '#2c3e50', letterSpacing: '-0.5px' }}>
          Filters
        </h4>
        <button 
          type="button" 
          className="btn btn-sm btn-light text-primary d-flex align-items-center" 
          style={{ borderRadius: '8px', fontWeight: '500' }}
          onClick={handleClear}
        >
          <span className="material-icons me-1" style={{ fontSize: '18px' }}>close</span> Clear
        </button>
      </div>
      
      {/* Date Range */}
      <div className="row g-2 mb-3">
        <div className="col-12">
          <label className="form-label text-muted small fw-semibold mb-1">Date Range</label>
        </div>
        <div className="col-6">
          <input 
            type="date" 
            className="form-control form-control-sm bg-light border-0" 
            style={{ borderRadius: '8px', padding: '10px' }}
            name="from_date" 
            value={filters.from_date} 
            onChange={handleChange} 
            title="From Date"
          />
        </div>
        <div className="col-6">
          <input 
            type="date" 
            className="form-control form-control-sm bg-light border-0" 
            style={{ borderRadius: '8px', padding: '10px' }}
            name="to_date" 
            value={filters.to_date} 
            onChange={handleChange} 
            title="To Date"
          />
        </div>
      </div>

      {/* Selects */}
      <div className="mb-3">
        <label className="form-label text-muted small fw-semibold mb-1">Workshop Type</label>
        <div className="position-relative">
          <select 
            className="form-select form-select-sm bg-light border-0 shadow-none appearance-none" 
            style={{ borderRadius: '8px', padding: '10px 14px' }}
            name="workshop_type" 
            value={filters.workshop_type} 
            onChange={handleChange}
          >
            <option value="">All Workshops</option>
            {filterOptions && filterOptions.workshop_types && filterOptions.workshop_types.map(wt => (
              <option key={wt.id} value={wt.id}>{wt.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label text-muted small fw-semibold mb-1">Location State</label>
        <select 
          className="form-select form-select-sm bg-light border-0 shadow-none" 
          style={{ borderRadius: '8px', padding: '10px 14px' }}
          name="state" 
          value={filters.state} 
          onChange={handleChange}
        >
          <option value="">All States</option>
          {filterOptions && filterOptions.states && filterOptions.states.map(st => (
            <option key={st.id} value={st.id}>{st.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="form-label text-muted small fw-semibold mb-1">Sort By</label>
        <select 
          className="form-select form-select-sm bg-light border-0 shadow-none" 
          style={{ borderRadius: '8px', padding: '10px 14px' }}
          name="sort_by" 
          value={filters.sort_by} 
          onChange={handleChange}
        >
          <option value="oldest">Date (Oldest First)</option>
          <option value="-date">Date (Newest First)</option>
        </select>
      </div>

      <hr className="text-muted opacity-25 mb-4" />

      {/* Action Buttons */}
      <div className="d-flex flex-column gap-2 mt-2">
        <button type="submit" className="btn btn-primary w-100 d-flex justify-content-center align-items-center" style={{ borderRadius: '10px', padding: '10px', fontWeight: '500' }}>
          <span className="material-icons me-2" style={{ fontSize: '20px' }}>search</span> Apply Filters
        </button>
        <button type="button" onClick={handleDownload} className="btn w-100 d-flex justify-content-center align-items-center" style={{ borderRadius: '10px', padding: '10px', fontWeight: '500', backgroundColor: '#e2e8f0', color: '#475569', border: 'none' }}>
          <span className="material-icons me-2" style={{ fontSize: '20px' }}>download</span> Download CSV
        </button>
      </div>

    </form>
  );
};

export default Filters;
