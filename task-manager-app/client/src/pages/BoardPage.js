import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Layout/Navbar';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import '../styles/BoardPage.css';

const BoardPage = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newColumnName, setNewColumnName] = useState('');
  const [taskInput, setTaskInput] = useState({});
  const [editingTask, setEditingTask] = useState({});
  const [editingColumn, setEditingColumn] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await API.get(`/boards/${id}`);
        setBoard(res.data.board);
        setColumns(res.data.columns);
        setTasks(res.data.tasks);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchBoard();
  }, [id]);

  const createColumn = async () => {
    if (!newColumnName) return;
    try {
      const res = await API.post('/columns', {
        name: newColumnName,
        boardId: id,
        order: columns.length,
      });
      setColumns([...columns, res.data]);
      setNewColumnName('');
    } catch (err) {
      console.error(err);
    }
  };

  const createTask = async (columnId) => {
    const title = taskInput[columnId];
    if (!title) return;

    try {
      const res = await API.post('/tasks', {
        title,
        columnId,
        order: tasks.filter((t) => t.columnId === columnId).length,
      });
      setTasks([...tasks, res.data]);
      setTaskInput({ ...taskInput, [columnId]: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteColumn = async (columnId) => {
    try {
      await API.delete(`/columns/${columnId}`);
      setColumns(columns.filter((c) => c._id !== columnId));
      setTasks(tasks.filter((t) => t.columnId !== columnId));
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskTitle = async (taskId, title) => {
    try {
      await API.patch(`/tasks/${taskId}`, { title });
      setTasks(tasks.map((t) => (t._id === taskId ? { ...t, title } : t)));
      setEditingTask({ ...editingTask, [taskId]: false });
    } catch (err) {
      console.error(err);
    }
  };

  const updateColumnName = async (columnId, name) => {
    try {
      await API.patch(`/columns/${columnId}`, { name });
      setColumns(columns.map((c) => (c._id === columnId ? { ...c, name } : c)));
      setEditingColumn({ ...editingColumn, [columnId]: false });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find(t => t._id === active.id);
    const newColumnId = over.data.current?.columnId;

    if (activeTask && newColumnId && activeTask.columnId !== newColumnId) {
      const updatedTasks = tasks.map(t =>
        t._id === active.id ? { ...t, columnId: newColumnId } : t
      );
      setTasks(updatedTasks);

      try {
        await API.patch(`/tasks/${active.id}`, {
          columnId: newColumnId,
        });
      } catch (err) {
        console.error('Failed to update task on backend', err);
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="board-page">
        <button onClick={() => setDarkMode(!darkMode)} style={{ marginBottom: '1rem' }}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>

        <h2>{board.name}</h2>

        <div>
          <input
            type="text"
            placeholder="New column name"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
          />
          <button onClick={createColumn}>+ Add Column</button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="columns-container">
            {columns.map((column) => (
              <div key={column._id} className="column">
                {editingColumn[column._id] ? (
                  <>
                    <input
                      value={column.name}
                      onChange={(e) =>
                        setColumns(columns.map((c) =>
                          c._id === column._id ? { ...c, name: e.target.value } : c
                        ))
                      }
                    />
                    <button onClick={() => updateColumnName(column._id, column.name)}>Save</button>
                  </>
                ) : (
                  <h3 onDoubleClick={() =>
                    setEditingColumn({ ...editingColumn, [column._id]: true })
                  }>
                    {column.name}
                  </h3>
                )}

                <button onClick={() => deleteColumn(column._id)} style={{ marginBottom: '8px' }}>
                  🗑️ Delete Column
                </button>

                <DroppableColumn column={column}>
                  <SortableContext
                    items={tasks.filter((t) => t.columnId === column._id).map((t) => t._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {tasks
                      .filter((task) => task.columnId === column._id)
                      .map((task) => (
                        <SortableTask
                          key={task._id}
                          task={task}
                          editing={editingTask[task._id]}
                          setEditing={setEditingTask}
                          updateTaskTitle={updateTaskTitle}
                          deleteTask={deleteTask}
                          setTasks={setTasks}
                        />
                      ))}
                  </SortableContext>

                  <input
                    type="text"
                    placeholder="New task"
                    value={taskInput[column._id] || ''}
                    onChange={(e) =>
                      setTaskInput({ ...taskInput, [column._id]: e.target.value })
                    }
                  />
                  <button onClick={() => createTask(column._id)}>+ Add Task</button>
                </DroppableColumn>
              </div>
            ))}
          </div>
        </DndContext>
      </div>
    </>
  );
};

const SortableTask = ({ task, editing, setEditing, updateTaskTitle, deleteTask }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="task-card"
      {...attributes}
      {...listeners}
    >
      {editing ? (
        <>
          <input
            value={task.title}
            onChange={(e) => task.title = e.target.value}
          />
          <button onClick={() => updateTaskTitle(task._id, task.title)}>Save</button>
        </>
      ) : (
        <div onDoubleClick={() => setEditing((prev) => ({ ...prev, [task._id]: true }))}>
          {task.title}
        </div>
      )}
      <button onClick={() => deleteTask(task._id)}>🗑️</button>
    </div>
  );
};

const DroppableColumn = ({ column, children }) => {
  const { setNodeRef } = useDroppable({
    id: column._id,
    data: { columnId: column._id },
  });

  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  );
};

export default BoardPage;
