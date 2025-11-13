import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CrudFormPage.css";
import { useNavigate } from "react-router-dom";

export default function CrudFormPage({ editingItem, onSaved }) {
  const ITEM_API_URL = "http://localhost:3001/api/items";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Active",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (editingItem) {
      setForm({
        name: editingItem.name || "",
        description: editingItem.description || "",
        status: editingItem.status || "Active",
        image: null,
      });
      setPreview(`http://localhost:3001/${editingItem.image}`);
    }
  }, [editingItem]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    for (const key in form) {
      if (form[key]) formData.append(key, form[key]);
    }

    try {
      if (editingItem) {
        await axios.put(`${ITEM_API_URL}/${editingItem._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Item updated successfully!");
      } else {
        await axios.post(ITEM_API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Item added successfully!");
      }
      onSaved();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <div className="crud-form-container">
      <form className="crud-form" onSubmit={handleSubmit}>
        <h2>{editingItem ? "Edit Item" : "Add New Item"}</h2>

        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter item name"
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            placeholder="Enter description"
          ></textarea>
        </div>
                            
        <div>
          <label>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="file-input">
          <label>Upload Image</label>
          <input type="file" name="image" onChange={handleChange} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="image-preview"
            />
          )}
        </div>

        <div className="form-buttons">
          <button type="submit">Save</button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
