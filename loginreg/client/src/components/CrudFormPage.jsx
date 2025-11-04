import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CrudFormPage.css";

export default function CrudFormPage() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Active",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  const API_URL = "http://localhost:3001/api/items";

  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("status", form.status);
    if (form.image) data.append("image", form.image);

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data);
        alert("✅ Item updated successfully!");
      } else {
        await axios.post(API_URL, data);
        alert("✅ Item created successfully!");
      }
      setForm({ name: "", description: "", status: "Active", image: null });
      setPreview(null);
      setEditingId(null);
      fetchItems();
    } catch (err) {
      console.error("Error saving item:", err);
      alert("❌ Error saving item.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      description: item.description,
      status: item.status,
      image: null,
    });
    setPreview(item.image ? `http://localhost:3001/${item.image}` : null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    await axios.delete(`${API_URL}/${id}`);
    fetchItems();
  };

  return (
    <div className="crud-page">
      <div className="crud-container">
        <h2 className="crud-title"> CRUD FORM</h2>
        <form onSubmit={handleSubmit} className="crud-form">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter Name"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter Description"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <input type="file" name="image" accept="image/*" onChange={handleChange} />

          {preview && <img src={preview} alt="Preview" className="preview-img" />}

          <div className="button-group">
            <button type="submit" className="btn btn-create">
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", description: "", status: "Active", image: null });
                  setPreview(null);
                }}
                className="btn btn-cancel"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h3 className="list-title"> Items List</h3>
      <div className="item-list">
        {items.length === 0 ? (
          <p className="no-items">No items found.</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="item-card">
              {item.image && (
                <img
                  src={`http://localhost:3001/${item.image}`}
                  alt={item.name}
                  className="item-img"
                />
              )}
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <div className="item-meta">
                <p><b>Status:</b> {item.status}</p>
                <p><b>Created:</b> {new Date(item.createdAt).toLocaleString()}</p>
                <p><b>Updated:</b> {new Date(item.updatedAt).toLocaleString()}</p>
              </div>
              <div className="item-buttons">
                <button onClick={() => handleEdit(item)} className="btn btn-edit">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="btn btn-delete">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
