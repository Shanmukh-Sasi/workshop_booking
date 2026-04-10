import React, { useState, useEffect } from 'react';
import Filters from './components/Filters';
import StatisticsTable from './components/StatisticsTable';
import { StateChart, TypeChart } from './components/Charts';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState({ workshops: [], charts: {} });
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState(null); // 'state' or 'type'

  const fetchStats = async (filters = {}) => {
    setLoading(true);
    const queryParams = new URLSearchParams(filters).toString();
    try {
      const response = await axios.get(`/statistics/api/public/?${queryParams}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <>
      <div className="container-fluid" style={{ marginTop: '30px', padding: '0 2rem' }}>
        
        {/* Page Header (with the Buttons exactly like the old UI) */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div className="d-flex align-items-center">
            <span className="material-icons me-2 rounded bg-primary text-white p-2" style={{ fontSize: '24px' }}>bar_chart</span>
            <div>
              <h2 className="mb-0 font-weight-bold" style={{ color: '#2c3e50', fontSize: '1.5rem' }}>Workshop Statistics</h2>
              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Browse and filter all completed workshops</p>
            </div>
          </div>
          <div className="d-flex gap-3">
            <button 
              className={`btn ${activeChart === 'state' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center rounded-pill px-4`}
              onClick={() => setActiveChart(activeChart === 'state' ? null : 'state')}
            >
              <span className="material-icons me-2" style={{ fontSize: '18px' }}>map</span>
              State Chart
            </button>
            <button 
              className={`btn ${activeChart === 'type' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center rounded-pill px-4`}
              onClick={() => setActiveChart(activeChart === 'type' ? null : 'type')}
            >
              <span className="material-icons me-2" style={{ fontSize: '18px' }}>donut_large</span>
              Type Chart
            </button>
          </div>
        </div>

        {/* Dynamic Chart Overlay Area */}
        {activeChart && (
          <div className="row mb-5 fade-in">
            <div className="col-12">
              <div className="card p-0 shadow-lg border-0 rounded-lg overflow-hidden">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center p-3">
                   <h5 className="mb-0">
                     <span className="material-icons align-middle me-2">
                       {activeChart === 'state' ? 'map' : 'donut_large'}
                     </span> 
                     {activeChart === 'state' ? 'State-wise Distribution' : 'Workshop Types'}
                   </h5>
                   <button 
                     className="btn btn-sm btn-light rounded-circle p-1 d-flex"
                     onClick={() => setActiveChart(null)}
                   >
                     <span className="material-icons" style={{ fontSize: '16px' }}>close</span>
                   </button>
                </div>
                <div className="card-body" style={{ height: '400px' }}>
                  {activeChart === 'state' && data.charts.state_labels && (
                    <StateChart labels={data.charts.state_labels} data={data.charts.state_data} />
                  )}
                  {activeChart === 'type' && data.charts.type_labels && (
                    <TypeChart labels={data.charts.type_labels} data={data.charts.type_data} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Table Section */}
        <div className="row">
          <div className="col-md-3 mb-4">
            <Filters onFilter={fetchStats} filterOptions={data.filter_options} />
          </div>
          <div className="col-md-9">
            {loading ? (
               <div className="d-flex justify-content-center mt-5">
                 <div className="spinner-border text-primary" role="status">
                   <span className="visually-hidden">Loading...</span>
                 </div>
               </div>
            ) : (
              <StatisticsTable workshops={data.workshops} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;