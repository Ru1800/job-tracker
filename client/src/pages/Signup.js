import { useState } from 'react';
import axios from 'axios';

function Signup({ onSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/api/auth/signup', {
        email,
        password
      });
      setMessage('Account created! Please login.');
      setTimeout(() => onSignup(), 1500);
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <div>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignup} style={{ width: '100%', marginTop: '8px', background: '#8a9e7a', color: '#fff' }}>Sign Up</button>
      <p style={{ fontSize: '13px', marginTop: '8px', color: message.includes('created') ? '#8a9e7a' : '#c0392b' }}>{message}</p>
    </div>
  );
}

export default Signup;