import React from 'react';

const StatisticsTable = ({ workshops }) => {
  return (
    <div className="table-responsive shadow-sm rounded bg-white">
      <table className="table table-hover align-middle mb-0 text-start">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Coordinator</th>
            <th>Institute</th>
            <th>Instructor</th>
            <th>Workshop</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {workshops && workshops.map((w, index) => (
            <tr key={w.id}>
              <td>{index + 1}</td>
              <td>{w.coordinator}</td>
              <td>{w.institute}</td>
              <td>{w.instructor}</td>
              <td><span className="badge bg-primary text-white p-2 rounded">{w.type}</span></td>
              <td>{w.date}</td>
            </tr>
          ))}
          {(!workshops || workshops.length === 0) && (
            <tr><td colSpan="6" className="text-center py-4">No workshops found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StatisticsTable;
