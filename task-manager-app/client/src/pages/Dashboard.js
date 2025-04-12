import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Layout/Navbar';
import BoardList from '../components/Boards/BoardList';

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/boards')
      .then(res => setBoards(res.data))
      .catch(err => console.error(err));
  }, []);

  const createBoard = async () => {
    if (!newBoardName.trim()) return;

    try {
      const res = await API.post('/boards', { name: newBoardName });
      setBoards([...boards, res.data]);
      setNewBoardName('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Your Boards</h2>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="New board name"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
          />
          <button onClick={createBoard}>+ Create Board</button>
        </div>

        <BoardList boards={boards} />
      </div>
    </>
  );
};

export default Dashboard;
