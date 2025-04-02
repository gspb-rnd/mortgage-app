import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MortgageApplicationPage from './pages/MortgageApplicationPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-indigo-600">Mortgage Application System</h1>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/application/new" element={<MortgageApplicationPage />} />
            <Route path="/application/:id" element={<MortgageApplicationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t mt-12 py-6">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Mortgage Application System. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
