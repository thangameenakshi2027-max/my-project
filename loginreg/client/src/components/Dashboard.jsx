import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: "", password: "" });
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });

  const navigate = useNavigate();
  const API_URL = "http://localhost:3001/api/users"; 

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching users");
    }
  };

 
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password)
      return alert("Please fill all fields");
    try {
      await axios.post(API_URL, newUser);
      setNewUser({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error adding user");
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setForm({ name: user.name, password: "" });
  };


  const handleUpdate = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`, form);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error updating user");
    }
  };

 
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="dashboard">
    
      <aside className="sidebar">
        <h2>Barbie Admin</h2>
        <ul>
          <li className="active">Dashboard</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

     
      <main className="main-content">
        <h1>User Management</h1>

     
        <div className="add-user">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <button className="btn add" onClick={handleAddUser}>
            Add User
          </button>
        </div>

      
        <div className="card">
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty">No users found</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      {editingUser === u._id ? (
                        <input
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      ) : (
                        u.name
                      )}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      {editingUser === u._id ? (
                        <input
                          type="password"
                          placeholder="New password"
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                      ) : (
                        "••••••"
                      )}
                    </td>
                    <td>
                      {editingUser === u._id ? (
                        <>
                          <button className="btn save" onClick={() => handleUpdate(u._id)}>Save</button>
                          <button className="btn cancel" onClick={() => setEditingUser(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn edit" onClick={() => handleEdit(u)}>Edit</button>
                          <button className="btn delete" onClick={() => handleDelete(u._id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
