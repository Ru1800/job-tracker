import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  const [page, setPage] = useState('login');
  const token = localStorage.getItem('token');

  if (token) return <Dashboard onLogout={() => {
    localStorage.removeItem('token');
    window.location.reload();
  }} />;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fdf8f0', border: '1px solid #c8b89a', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '8px', color: '#3d3426' }}>🌿 Job Tracker</h1>
        <p style={{ textAlign: 'center', color: '#8a7968', fontSize: '14px', marginBottom: '32px' }}>Track your journey, stay grounded.</p>

        <div style={{ display: 'flex', marginBottom: '24px', borderBottom: '1px solid #c8b89a' }}>
          <button onClick={() => setPage('login')} style={{ flex: 1, background: 'none', borderRadius: 0, padding: '10px', color: page === 'login' ? '#8a9e7a' : '#8a7968', borderBottom: page === 'login' ? '2px solid #8a9e7a' : 'none' }}>Login</button>
          <button onClick={() => setPage('signup')} style={{ flex: 1, background: 'none', borderRadius: 0, padding: '10px', color: page === 'signup' ? '#8a9e7a' : '#8a7968', borderBottom: page === 'signup' ? '2px solid #8a9e7a' : 'none' }}>Sign Up</button>
        </div>

        {page === 'login' ? <Login onLogin={() => window.location.reload()} /> : <Signup onSignup={() => setPage('login')} />}
      </div>
    </div>
  );
}

export default App;