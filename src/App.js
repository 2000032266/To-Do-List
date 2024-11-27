// App.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks${filter !== 'all' ? `?filter=${filter}` : ''}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await axios.put(`${API_URL}/tasks/${editingTask.id}`, {
          title,
          description,
          status: editingTask.status
        });
        setEditingTask(null);
      } else {
        await axios.post(`${API_URL}/tasks`, { title, description });
      }
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const toggleStatus = async (task) => {
    try {
      await axios.put(`${API_URL}/tasks/${task.id}`, {
        ...task,
        status: task.status === 'completed' ? 'pending' : 'completed'
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Task Manager</h1>
      
      {/* Task Form */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
            {editingTask && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditingTask(null);
                  setTitle('');
                  setDescription('');
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="btn-group mb-4">
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Task List */}
      <div className="list-group">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="list-group-item list-group-item-action"
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="flex-grow-1">
                <h5
                  className={`mb-1 ${
                    task.status === 'completed' ? 'text-decoration-line-through' : ''
                  }`}
                >
                  {task.title}
                </h5>
                <p className="mb-1">{task.description}</p>
              </div>
              <div className="btn-group">
                <button
                  className={`btn btn-sm ${
                    task.status === 'completed' ? 'btn-success' : 'btn-outline-success'
                  }`}
                  onClick={() => toggleStatus(task)}
                >
                  ✓
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => startEditing(task)}
                >
                  ✎
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteTask(task.id)}
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;