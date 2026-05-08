import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Teams from './pages/Teams';
import Players from './pages/Players';
import Positions from './pages/Positions';
import Nations from './pages/Nations';
import { ThemeProvider } from './context/ThemeContext';
import './index.css'

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/players" element={<Players />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/nations" element={<Nations />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
