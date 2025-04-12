import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <h1>
        Welcome to Task Manager <span style={{ color: '#88cc44' }}>🧩</span>
      </h1>
      <p>Your lightweight Trello-style task management app</p>

      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={() => navigate('/login')}
          style={{
            marginRight: '1rem',
            padding: '0.5rem 1.5rem',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>

        <button
          onClick={() => navigate('/register')}
          style={{
            padding: '0.5rem 1.5rem',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Home;
