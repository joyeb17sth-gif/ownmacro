import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import FoodLibrary from './pages/FoodLibrary';
import MealBuilder from './pages/MealBuilder';
import DailyTracker from './pages/DailyTracker';
import Goals from './pages/Goals';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/foods" element={<FoodLibrary />} />
              <Route path="/meal-builder" element={<MealBuilder />} />
              <Route path="/tracker" element={<DailyTracker />} />
              <Route path="/daily-tracker" element={<Navigate to="/tracker" replace />} />
              <Route path="/goals" element={<Goals />} />
            </Routes>
          </main>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
