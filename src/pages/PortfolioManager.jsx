import { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { api, BASE_URL } from "../api/client";

const emptyItem = {
  title: "",
  category: { en: "", ar: "", es: "", ru: "" },
  description: { en: "", ar: "", es: "", ru: "" },
  image: "",
  projectUrl: "",
  order: 0,
  published: true,
};

function resolveImage(src) {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("/assets")) return src;
  return `${BASE_URL}${src}`;
}

export default function PortfolioManager() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // item being edited, or null
  const [form, setForm] = useState(emptyItem);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api
      .getPortfolioAdmin(token)
      .then((data) => setItems(data.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const startNew = () => {
    setEditing("new");
    setForm(emptyItem);
    setError("");
  };

  const startEdit = (item) => {
    setEditing(item._id);
    setForm({
      title: item.title,
      category: item.category,
      description: item.description,
      image: item.image,
      projectUrl: item.projectUrl || "",
      order: item.order || 0,
      published: item.published,
    });
    setError("");
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(emptyItem);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await api.uploadPortfolioImage(token, file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing === "new") {
        await api.createPortfolio(token, form);
      } else {
        await api.updatePortfolio(token, editing, form);
      }
      cancelEdit();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this portfolio item?")) return;
    try {
      await api.deletePortfolio(token, id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <h2>Portfolio</h2>
        {!editing && (
          <button className="btn btn-primary admin-btn-sm" onClick={startNew}>
            + Add project
          </button>
        )}
      </div>

      {error && <p className="admin-auth__error">{error}</p>}

      {editing && (
        <form className="admin-card admin-form" onSubmit={handleSave}>
          <h3>{editing === "new" ? "New project" : "Edit project"}</h3>

          <label className="admin-field">
            <span>Title</span>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </label>

          <div className="admin-locale-grid">
            {["en", "ar", "es", "ru"].map((lc) => (
              <label className="admin-field" key={lc}>
                <span>Category ({lc.toUpperCase()})</span>
                <input
                  required
                  value={form.category[lc]}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      category: { ...f.category, [lc]: e.target.value },
                    }))
                  }
                />
              </label>
            ))}
          </div>

          <div className="admin-locale-grid">
            {["en", "ar", "es", "ru"].map((lc) => (
              <label className="admin-field" key={lc}>
                <span>Description ({lc.toUpperCase()})</span>
                <textarea
                  required
                  rows={3}
                  value={form.description[lc]}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      description: { ...f.description, [lc]: e.target.value },
                    }))
                  }
                />
              </label>
            ))}
          </div>

          <label className="admin-field">
            <span>Image</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} />
            {uploading && <small>Uploading…</small>}
            {form.image && (
              <img className="admin-form__preview" src={resolveImage(form.image)} alt="" />
            )}
          </label>

          <label className="admin-field">
            <span>Project URL (optional)</span>
            <input
              type="url"
              value={form.projectUrl}
              onChange={(e) => setForm((f) => ({ ...f, projectUrl: e.target.value }))}
            />
          </label>

          <div className="admin-field-row">
            <label className="admin-field admin-field--inline">
              <span>Order</span>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
              />
            </label>
            <label className="admin-field admin-field--checkbox">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              />
              <span>Published</span>
            </label>
          </div>

          <div className="admin-form__actions">
            <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" className="btn btn-outline" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="admin-table">
          {items.length === 0 && <p>No portfolio items yet.</p>}
          {items.map((item) => (
            <div className="admin-row" key={item._id}>
              <img className="admin-row__thumb" src={resolveImage(item.image)} alt="" />
              <div className="admin-row__body">
                <strong>{item.title}</strong>
                <span>{item.category?.en}</span>
                {!item.published && <em className="admin-row__badge">Hidden</em>}
              </div>
              <div className="admin-row__actions">
                <button className="btn btn-outline admin-btn-sm" onClick={() => startEdit(item)}>
                  Edit
                </button>
                <button
                  className="btn btn-outline admin-btn-sm admin-btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
