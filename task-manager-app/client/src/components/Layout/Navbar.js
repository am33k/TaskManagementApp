import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
        🧩 Task Manager
      </h2>

      <div style={styles.navRight}>
        <button style={styles.button} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: '#333',
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navRight: {
    display: 'flex',
    gap: '1rem',
  },
  button: {
    background: '#555',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Navbar;
