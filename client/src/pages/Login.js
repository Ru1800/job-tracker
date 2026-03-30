import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      onLogin();
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <div>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin} style={{ width: '100%', marginTop: '8px', background: '#8a9e7a', color: '#fff' }}>Login</button>
      <p style={{ color: '#c0392b', fontSize: '13px', marginTop: '8px' }}>{message}</p>
    </div>
  );
}

export default Login;