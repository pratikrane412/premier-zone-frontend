import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Teams from './pages/Teams';
import Players from './pages/Players';
import Positions from './pages/Positions';
import Nations from './pages/Nations';
import SquadBuilder from './pages/SquadBuilder';
import Compare from './pages/Compare';
import Fixtures from './pages/Fixtures';
import Standings from './pages/Standings';
import MatchCenter from './pages/MatchCenter';
import Login from './pages/Login';
import Register from './pages/Register';
import SharedSquad from './pages/SharedSquad';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/match/:id" element={<MatchCenter />} />
            <Route path="/squad-builder" element={<SquadBuilder />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/players" element={<Players />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/nations" element={<Nations />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/squad/shared/:shareCode" element={<SharedSquad />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}


