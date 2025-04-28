import React from 'react';
import Dashboard from './components/Dashboard';
import './styles.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>📈 Adventoria Metrics</h1>
        <p>Track your server's growth and activity live!</p>
      </header>
      <main>
        <Dashboard />
      </main>
      <footer>
        <p>Adventoria Metrics © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;