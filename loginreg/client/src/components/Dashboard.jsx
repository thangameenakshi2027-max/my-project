import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import CrudFormPage from "./CrudFormPage";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: "", password: "" });
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
  const [showForm, setShowForm] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

 
  const [viewingUser, setViewingUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();
  const API_URL = "http://localhost:3001/api/users";
  const ITEM_API_URL = "http://localhost:3001/api/items";

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must log in first!");
      navigate("/login");
      return;
    }
    fetchUsers(token);
  }, []);

  const fetchUsers = async (token) => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching users. Your session might have expired.");
      handleLogout();
    }
  };

  const fetchItems = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(ITEM_API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching items");
    }
  };

  
  const handleAddUser = async () => {
    const token = localStorage.getItem("token");
    if (!newUser.name || !newUser.email || !newUser.password)
      return alert("Please fill all fields");
    try {
      await axios.post(API_URL, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewUser({ name: "", email: "", password: "" });
      fetchUsers(token);
    } catch (err) {
      console.error(err);
      alert("Error adding user");
    }
  };

  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure to delete this user?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(token);
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setForm({ name: user.name, password: "" });
  };

  const handleUpdateUser = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${API_URL}/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingUser(null);
      fetchUsers(token);
    } catch (err) {
      console.error(err);
      alert("Error updating user");
    }
  };

  
  const handleViewUser = async (user) => {
    const token = localStorage.getItem("token");
    try {
     
      const res = await axios.get(`${API_URL}/${user._id}/qrcode`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setViewingUser({ ...user, qrCode: res.data.qrCode });
      setOpenDialog(true);
    } catch (err) {
      console.error("Error fetching QR code:", err);
      alert("Could not fetch QR code. Please try again later.");
    }
  };

 
  const handleItemEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
    setActivePage("form");
  };

  const handleItemDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`${ITEM_API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((item) => item._id !== id));
      alert("Item deleted successfully!");
    } catch (err) {
      console.error("Item delete failed:", err);
      alert("Error deleting item.");
    }
  };

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

 
  return (
    <div className="dashboard">
     
      <aside className="sidebar">
        <ul>
          <Button
            className={activePage === "dashboard" ? "active" : ""}
            onClick={() => {
              setActivePage("dashboard");
              setShowForm(false);
            }}
          >
            Dashboard
          </Button>

          <Button
            className={activePage === "form" ? "active" : ""}
            onClick={() => {
              setActivePage("form");
              setShowForm(true);
              setEditingItem(null);
            }}
          >
            Add Form
          </Button>

          <Button
            className={activePage === "items" ? "active" : ""}
            onClick={() => {
              setActivePage("items");
              setShowForm(false);
              fetchItems();
            }}
          >
            Item List
          </Button>

          <Button onClick={handleLogout}>Logout</Button>
        </ul>
      </aside>

     
      <main className="main-content">
        {activePage === "dashboard" && (
          <>
            <h1>User Management</h1>
            <div className="card">
              <table className="crud-table">
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
                      <td colSpan="4" className="empty">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id}>
                        <td>
                          {editingUser === u._id ? (
                            <input
                              value={form.name}
                              onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                              }
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
                              onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                              }
                            />
                          ) : (
                            "••••••"
                          )}
                        </td>
                        <td>
                          {editingUser === u._id ? (
                            <>
                              <button
                                className="btn save"
                                onClick={() => handleUpdateUser(u._id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn cancel"
                                onClick={() => setEditingUser(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                             
                              <button
                                className="btn view"
                                onClick={() => handleViewUser(u)}
                                
                              >
                                View
                              </button>

                              <button
                                className="btn edit"
                                onClick={() => handleEditUser(u)}
                              >
                                Edit
                              </button>

                              <button
                                className="btn delete"
                                onClick={() => handleDeleteUser(u._id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {showForm && activePage === "form" && (
          <div className="crud-form-container" style={{ margin: "20px 0" }}>
            <CrudFormPage editingItem={editingItem} />
          </div>
        )}

        {activePage === "items" && (
          <div className="items-container">
            <h2>Items List</h2>
            {items.length === 0 ? (
              <p>No items found</p>
            ) : (
              <div className="item-grid">
                {items.map((item) => (
                  <div key={item._id} className="item-card">
                    <img
                      src={`http://localhost:3001/${item.image}`}
                      alt={item.name}
                      className="item-image"
                    />
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>

                    <div className="item-meta">
                      <p>
                        <b>Status:</b> {item.status}
                      </p>
                      <p>
                        <b>Created:</b>{" "}
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <b>Updated:</b>{" "}
                        {new Date(item.updatedAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="item-buttons">
                      <button
                        onClick={() => handleItemEdit(item)}
                        className="btn btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleItemDelete(item._id)}
                        className="btn btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

     
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>User QR Code</DialogTitle>
        <DialogContent sx={{ textAlign: "center", padding: "20px" }}>
          {viewingUser ? (
            <>
              <Typography variant="h6">{viewingUser.name}</Typography>
              <Typography variant="body2">{viewingUser.email}</Typography>
              {viewingUser.qrCode ? (
                <img
                  src={viewingUser.qrCode}
                  alt="User QR Code"
                  width="200"
                  style={{ marginTop: "15px", borderRadius: "10px" }}
                />
              ) : (
                <Typography sx={{ mt: 2 }} color="text.secondary">
                  QR Code not available
                </Typography>
              )}
            </>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
