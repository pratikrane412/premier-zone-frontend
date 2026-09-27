# ⚽ PremierZone Pro — Frontend Scouting & Tactical Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.2-38B2AC.svg)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.3-black.svg)](https://www.framer.com/motion/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

A modern, high-performance football scouting and tactics application built with React 19, Tailwind CSS, and Framer Motion. Features a drag-and-drop tactical pitch builder, head-to-head SVG radar comparison charts, live Premier League fixtures with AI outcome predictions, and zero-download official Premier League CDN photos.

---

## 🚀 Key Features

- **11-a-side Tactical Pitch Builder (`/squad-builder`)**:
  - Interactive pitch with multiple formation presets (4-3-3, 4-2-3-1, 3-5-2, 4-4-2)
  - Real-time budget tracker enforcing a strict £100.0M salary cap
  - Chemistry and club constraint validation (maximum 3 players per Premier League club)
  - Instant aggregate squad statistics (Total Goals, Average Scout Rating, Total Market Value)
  - Lineup persistence & shareable public links (`/squad/shared/:shareCode`)
- **Head-to-Head Radar Comparison (`/compare`)**:
  - Dual SVG spider radar chart comparing 5 scouting dimensions: Shooting, Creation, Work Rate, Discipline, and Efficiency
  - Side-by-side metric comparison table with winning badges and league percentiles
- **Live Matchday Center & AI Predictor (`/fixtures`)**:
  - Gameweek-by-gameweek fixture calendar with live scores
  - AI outcome simulator displaying win/draw/loss probability distributions and key talisman matchups
- **Zero-Download CDN Media**:
  - Automatically loads official transparent cutout player face photos (`250x250 PNG`) and high-res club badges directly from the official Premier League CDN via API responses.
- **JWT Authentication (`/login`, `/register`)**:
  - Seamless account creation, session management, and bearer token interceptors.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS v4 (Glassmorphism & Sports Analytics theme)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Client**: Axios with centralized Request/Response interceptors and JWT token injection
- **State Management**: React Context (`AuthContext`, `ThemeContext`)
- **Containerization**: Multi-stage Docker build with Nginx reverse proxy

---

## 🏃 Getting Started

### 1. Local Setup

```bash
# Clone and enter frontend
cd premier-zone-frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### 2. Environment Configuration

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:8000
```

### 3. Build & Production Preview

```bash
npm run build
npm run preview
```

### 4. Docker Deployment

```bash
docker build -t premierzone-frontend .
docker run -p 80:80 premierzone-frontend
```
