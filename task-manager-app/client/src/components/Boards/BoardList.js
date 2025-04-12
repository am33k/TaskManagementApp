// src/components/Boards/BoardList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BoardList = ({ boards }) => {
  const navigate = useNavigate();

  if (!boards.length) return <p>No boards found. Create one!</p>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {boards.map((board) => (
        <li
          key={board._id}
          onClick={() => navigate(`/board/${board._id}`)}
          style={{
            background: '#f5f5f5',
            padding: '1rem',
            marginBottom: '0.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          🗂️ {board.name}
        </li>
      ))}
    </ul>
  );
};

export default BoardList;
