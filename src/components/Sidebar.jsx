import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, ChefHat, CalendarDays, Target, Download, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useRef } from 'react';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/foods', icon: UtensilsCrossed, label: 'Food Library' },
  { path: '/meal-builder', icon: ChefHat, label: 'Meal Builder' },
  { path: '/tracker', icon: CalendarDays, label: 'Daily Tracker' },
  { path: '/goals', icon: Target, label: 'Goals' },
];

const Sidebar = () => {
  const location = useLocation();
  const { exportData, importData } = useApp();
  const fileInputRef = useRef(null);

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const success = importData(event.target.result);
      if (success) {
        alert('Data imported successfully!');
      } else {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar" id="sidebar-desktop">
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <span className="sidebar__logo-icon">🍽️</span>
            <div className="sidebar__logo-text">
              <span className="sidebar__brand">OwnMacro</span>
              <span className="sidebar__tagline">Nutrition Tracker</span>
            </div>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
              id={`nav-${label.toLowerCase().replace(/\s/g, '-')}`}
            >
              <Icon size={20} />
              <span>{label}</span>
              {location.pathname === path && <div className="sidebar__link-glow" />}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <button className="sidebar__action" onClick={exportData} id="btn-export">
            <Download size={16} />
            <span>Export Data</span>
          </button>
          <button className="sidebar__action" onClick={() => fileInputRef.current?.click()} id="btn-import">
            <Upload size={16} />
            <span>Import Data</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav" id="bottom-nav-mobile">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `bottom-nav__link ${isActive ? 'bottom-nav__link--active' : ''}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
