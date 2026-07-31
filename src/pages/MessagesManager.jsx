import { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { api } from "../api/client";

export default function MessagesManager() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api
      .getContactSubmissions(token)
      .then((data) => setItems(data.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const setStatus = async (id, status) => {
    try {
      await api.updateContactStatus(token, id, status);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.deleteContactSubmission(token, id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <h2>Messages</h2>
      </div>

      {error && <p className="admin-auth__error">{error}</p>}

      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <div className="admin-table">
          {items.map((msg) => (
            <div className="admin-message" key={msg._id}>
              <div className="admin-message__head">
                <div>
                  <strong>{msg.name}</strong>
                  <span className="admin-message__email"> — {msg.email}</span>
                </div>
                <span className={`admin-status admin-status--${msg.status}`}>{msg.status}</span>
              </div>
              <p className="admin-message__body">{msg.message}</p>
              <div className="admin-message__meta">
                <span>{new Date(msg.createdAt).toLocaleString()}</span>
                <span>· {msg.language?.toUpperCase()}</span>
              </div>
              <div className="admin-row__actions">
                <select value={msg.status} onChange={(e) => setStatus(msg._id, e.target.value)}>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
                <button
                  className="btn btn-outline admin-btn-sm admin-btn-danger"
                  onClick={() => remove(msg._id)}
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
