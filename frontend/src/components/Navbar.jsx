import React from 'react';

const Navbar = ({ user }) => {
  return (
    <nav className="navbar navbar-expand-lg fixed-top modern-navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <span className="material-icons">school</span> FOSSEE Workshops
        </a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link" href="/"><span className="material-icons">home</span> Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/statistics/public"><span className="material-icons">bar_chart</span> Statistics</a>
            </li>
          </ul>
          {user && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#">
                  <span className="material-icons">account_circle</span> {user}
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
