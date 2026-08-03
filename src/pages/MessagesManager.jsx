import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { api } from "../api/client";

const STATUS_TABS = ["all", "new", "read", "replied", "archived"];

export default function MessagesManager() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

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

  const counts = useMemo(() => {
    const c = { all: items.length, new: 0, read: 0, replied: 0, archived: 0 };
    for (const m of items) c[m.status] = (c[m.status] || 0) + 1;
    return c;
  }, [items]);

  const visible = filter === "all" ? items : items.filter((m) => m.status === filter);

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <h2>Messages</h2>
      </div>

      <div className="admin-filter-tabs">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            className={filter === tab ? "is-active" : ""}
            onClick={() => setFilter(tab)}
          >
            {tab[0].toUpperCase() + tab.slice(1)}
            <span className="admin-filter-tabs__count">{counts[tab] || 0}</span>
          </button>
        ))}
      </div>

      {error && <p className="admin-auth__error">{error}</p>}

      {loading ? (
        <p>Loading…</p>
      ) : visible.length === 0 ? (
        <p>No messages here.</p>
      ) : (
        <div className="admin-table">
          {visible.map((msg) => (
            <div className="admin-message" key={msg._id}>
              <div className="admin-message__head">
                <div>
                  <strong>{msg.name}</strong>
                  <span className="admin-message__date">
                    {new Date(msg.createdAt).toLocaleString()} · {msg.language?.toUpperCase()}
                  </span>
                </div>
                <span className={`admin-status admin-status--${msg.status}`}>{msg.status}</span>
              </div>

              <div className="admin-message__details">
                <div className="admin-message__detail">
                  <span className="admin-message__detail-label">Email</span>
                  <a href={`mailto:${msg.email}`}>{msg.email}</a>
                </div>
                {msg.whatsapp && (
                  <div className="admin-message__detail">
                    <span className="admin-message__detail-label">WhatsApp</span>
                    <a
                      href={`https://wa.me/${msg.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {msg.whatsapp}
                    </a>
                  </div>
                )}
                {msg.websiteUrl && (
                  <div className="admin-message__detail">
                    <span className="admin-message__detail-label">Website</span>
                    <a href={msg.websiteUrl} target="_blank" rel="noreferrer">
                      {msg.websiteUrl}
                    </a>
                  </div>
                )}
              </div>

              {msg.message && (
                <div className="admin-message__detail admin-message__detail--block">
                  <span className="admin-message__detail-label">Message</span>
                  <p className="admin-message__body">{msg.message}</p>
                </div>
              )}

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
