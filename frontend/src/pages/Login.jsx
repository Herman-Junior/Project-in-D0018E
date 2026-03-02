import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      if (currentState === 'Sign Up') {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage('Account created successfully! You can now log in.');
          setCurrentState('Login');
        } else {
          setErrorMessage(data.error || 'Registration failed');
        }

      } else {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user_id', data.user.user_id);
          navigate('/');
        } else {
          setErrorMessage(data.error || 'Wrong email or password');
        }
      }
    } catch (error) {
      setErrorMessage('Could not connect to server');
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-(--main-text-color)'>

       {/* HEADER */}
      <div className='inline-flex items-center gap-2 mb-10 mt-10'>
        <hr className='border-none h-[1.5px] w-8' style={{ backgroundColor: '#6f1811' }} />
        <p className='text-3xl uppercase font-semibold tracking-tighter' style={{ color: '#6f1811' }}>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8' style={{ backgroundColor: '#6f1811' }} />
      </div>


      {currentState === 'Sign Up' && (
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='w-full px-4 py-3 border border-black bg-transparent outline-none placeholder:uppercase placeholder:text-xs placeholder:tracking-widest'
          placeholder='Username'
          required
        />
      )}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='w-full px-4 py-3 border border-black bg-transparent outline-none placeholder:uppercase placeholder:text-xs placeholder:tracking-widest'
        placeholder='Email'
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='w-full px-4 py-3 border border-black bg-transparent outline-none placeholder:uppercase placeholder:text-xs placeholder:tracking-widest'
        placeholder='Password'
        required
      />

      {/* HELP TEXT */}
      <div className='w-full flex justify-end text-xs -mt-2 uppercase tracking-tighter opacity-70'>
        {currentState === 'Login'
          ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer font-bold' style={{ color: '#6f1811' }}>Create account</p>
          : <p onClick={() => setCurrentState('Login')} className='cursor-pointer font-bold' style={{ color: '#6f1811' }}>Login</p>
        }
      </div>


      {errorMessage && (
        <p className="text-red-500 text-sm uppercase tracking-widest text-center">{errorMessage}</p>
      )}

      {successMessage && (
        <p className="text-green-500 text-sm uppercase tracking-widest text-center">{successMessage}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{ backgroundColor: '#6f1811' }}
        className={`text-white font-bold uppercase px-10 py-3 mt-4 w-full transition-all active:scale-[0.98]
        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
      >
        {loading ? 'Please wait...' : currentState === 'Login' ? 'Sign In' : 'Create Account'}
      </button>

    </form>
  );
}

export default Login;