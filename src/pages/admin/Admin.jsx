import { useCallback, useEffect, useState } from "react";
import { servicePages } from "../../config";
import { fileToWebpDataUrl } from "./imageUtil";
import "./Admin.css";

const SERVICES = servicePages.map((s) => ({ slug: s.slug, title: s.title }));

async function api(path, opts = {}) {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export default function Admin() {
  const [auth, setAuth] = useState({ loading: true, authenticated: false, name: "" });
  const [login, setLogin] = useState({ name: "", accessCode: "", totp: "" });
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const [service, setService] = useState(SERVICES[0].slug);
  const [items, setItems] = useState([]);
  const [uploadRole, setUploadRole] = useState("after");
  const [caption, setCaption] = useState("");
  const [captionEs, setCaptionEs] = useState("");
  const [pairWithId, setPairWithId] = useState("");
  const [progress, setProgress] = useState("");
  const [dragId, setDragId] = useState(null);

  const refreshAuth = useCallback(async () => {
    try {
      const data = await api("/api/auth/me");
      setAuth({ loading: false, authenticated: !!data.authenticated, name: data.name || "" });
    } catch {
      setAuth({ loading: false, authenticated: false, name: "" });
    }
  }, []);

  const loadPhotos = useCallback(async (svc) => {
    try {
      const data = await api(`/api/photos/list?service=${encodeURIComponent(svc)}`);
      setItems(data.items || []);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    document.title = "Admin | SL Cleaning Services";
    // noindex
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";
    refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    if (auth.authenticated) loadPhotos(service);
  }, [auth.authenticated, service, loadPhotos]);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(login),
      });
      setAuth({ loading: false, authenticated: true, name: data.name });
      setLogin({ name: login.name, accessCode: "", totp: "" });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    try {
      await api("/api/auth/logout", { method: "POST", body: "{}" });
    } catch {
      /* ignore */
    }
    setAuth({ loading: false, authenticated: false, name: "" });
  }

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    setError("");
    setOkMsg("");
    setBusy(true);
    let done = 0;
    try {
      for (const file of files) {
        setProgress(`Compressing ${file.name}…`);
        const dataUrl = await fileToWebpDataUrl(file);
        setProgress(`Uploading ${file.name} (${++done}/${files.length})…`);
        await api("/api/photos/upload", {
          method: "POST",
          body: JSON.stringify({
            service,
            role: uploadRole,
            caption: caption || undefined,
            captionEs: captionEs || undefined,
            pairWithId: pairWithId || undefined,
            dataUrl,
          }),
        });
      }
      setOkMsg(`Uploaded ${files.length} photo(s).`);
      setCaption("");
      setCaptionEs("");
      setPairWithId("");
      await loadPhotos(service);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  async function handleDelete(id, side = "all") {
    if (!confirm(side === "all" ? "Delete this photo entry?" : `Remove ${side} image?`)) return;
    setBusy(true);
    setError("");
    try {
      await api("/api/photos/delete", {
        method: "POST",
        body: JSON.stringify({ service, id, side }),
      });
      await loadPhotos(service);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveCaption(id, cap, capEs) {
    setBusy(true);
    try {
      await api("/api/photos/update", {
        method: "POST",
        body: JSON.stringify({ service, id, caption: cap, captionEs: capEs }),
      });
      await loadPhotos(service);
      setOkMsg("Caption saved.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handlePair(targetId, sourceId) {
    if (!sourceId || sourceId === targetId) return;
    setBusy(true);
    try {
      await api("/api/photos/update", {
        method: "POST",
        body: JSON.stringify({ service, id: targetId, pairBeforeFromId: sourceId }),
      });
      await loadPhotos(service);
      setOkMsg("Paired before/after.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function persistOrder(nextItems) {
    setItems(nextItems);
    try {
      await api("/api/photos/reorder", {
        method: "POST",
        body: JSON.stringify({ service, order: nextItems.map((i) => i.id) }),
      });
    } catch (err) {
      setError(err.message);
      loadPhotos(service);
    }
  }

  function onDragStart(id) {
    setDragId(id);
  }

  function onDragOver(e, overId) {
    e.preventDefault();
    if (!dragId || dragId === overId) return;
    const from = items.findIndex((i) => i.id === dragId);
    const to = items.findIndex((i) => i.id === overId);
    if (from < 0 || to < 0) return;
    const next = items.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
  }

  function onDragEnd() {
    if (dragId) persistOrder(items);
    setDragId(null);
  }

  if (auth.loading) {
    return (
      <div className="admin-page">
        <div className="admin-wrap">
          <p className="muted">Checking session…</p>
        </div>
      </div>
    );
  }

  if (!auth.authenticated) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <h1>Admin login</h1>
          <p>Name + access code + authenticator code</p>
          {error && <div className="admin-error">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="admin-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                autoComplete="username"
                value={login.name}
                onChange={(e) => setLogin({ ...login, name: e.target.value })}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="code">Access code</label>
              <input
                id="code"
                type="password"
                autoComplete="current-password"
                value={login.accessCode}
                onChange={(e) => setLogin({ ...login, accessCode: e.target.value })}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="totp">Authenticator code (6 digits)</label>
              <input
                id="totp"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={login.totp}
                onChange={(e) => setLogin({ ...login, totp: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                required
              />
            </div>
            <button className="admin-btn" type="submit" disabled={busy} style={{ width: "100%" }}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-wrap">
        <header className="admin-header">
          <div>
            <h1>Photo admin</h1>
            <div className="muted">Signed in as {auth.name}</div>
          </div>
          <button className="admin-btn secondary" type="button" onClick={handleLogout}>
            Sign out
          </button>
        </header>

        {error && <div className="admin-error">{error}</div>}
        {okMsg && <div className="admin-ok">{okMsg}</div>}

        <div className="admin-tabs">
          {SERVICES.map((s) => (
            <button
              key={s.slug}
              type="button"
              className={`admin-tab${service === s.slug ? " active" : ""}`}
              onClick={() => setService(s.slug)}
            >
              {s.title}
            </button>
          ))}
        </div>

        <section className="admin-upload-box">
          <h2>Upload photos</h2>
          <div className="admin-row">
            <div className="admin-field">
              <label>Before or After?</label>
              <select value={uploadRole} onChange={(e) => setUploadRole(e.target.value)}>
                <option value="after">After</option>
                <option value="before">Before</option>
              </select>
            </div>
            <div className="admin-field">
              <label>Pair with existing (optional)</label>
              <select value={pairWithId} onChange={(e) => setPairWithId(e.target.value)}>
                <option value="">— New entry —</option>
                {items.map((it) => (
                  <option key={it.id} value={it.id}>
                    {(it.caption || it.id).slice(0, 40)}
                    {!it.before ? " (needs before)" : ""}
                    {!it.after ? " (needs after)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>Caption (English)</label>
              <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Optional" />
            </div>
            <div className="admin-field">
              <label>Caption (Spanish)</label>
              <input value={captionEs} onChange={(e) => setCaptionEs(e.target.value)} placeholder="Optional" />
            </div>
          </div>
          <div className="admin-field" style={{ marginTop: "0.9rem" }}>
            <label>Photos (resized to WebP in browser)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={busy}
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
          {progress && <div className="admin-progress">{progress}</div>}
        </section>

        <p className="admin-drag-hint">Drag cards to reorder. Changes save automatically.</p>

        <div className="admin-grid">
          {items.map((it) => (
            <article
              key={it.id}
              className={`admin-card${dragId === it.id ? " dragging" : ""}`}
              draggable
              onDragStart={() => onDragStart(it.id)}
              onDragOver={(e) => onDragOver(e, it.id)}
              onDragEnd={onDragEnd}
            >
              <div className="admin-card-imgs">
                {it.before ? (
                  <img src={it.before} alt="Before" />
                ) : (
                  <div className="empty-slot">No before</div>
                )}
                {it.after ? (
                  <img src={it.after} alt="After" className={!it.before ? "solo" : undefined} />
                ) : (
                  <div className="empty-slot">No after</div>
                )}
              </div>
              <div className="admin-card-body">
                <CaptionEditor
                  caption={it.caption || ""}
                  captionEs={it.captionEs || ""}
                  onSave={(c, ce) => handleSaveCaption(it.id, c, ce)}
                  disabled={busy}
                />
                <div className="admin-field">
                  <label>Pair before from…</label>
                  <select
                    defaultValue=""
                    disabled={busy}
                    onChange={(e) => {
                      if (e.target.value) handlePair(it.id, e.target.value);
                      e.target.value = "";
                    }}
                  >
                    <option value="">— Select source —</option>
                    {items
                      .filter((o) => o.id !== it.id && (o.before || o.after))
                      .map((o) => (
                        <option key={o.id} value={o.id}>
                          {(o.caption || o.id).slice(0, 40)}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="admin-card-actions">
                  {it.before && (
                    <button className="admin-btn secondary small" type="button" onClick={() => handleDelete(it.id, "before")} disabled={busy}>
                      Remove before
                    </button>
                  )}
                  {it.after && (
                    <button className="admin-btn secondary small" type="button" onClick={() => handleDelete(it.id, "after")} disabled={busy}>
                      Remove after
                    </button>
                  )}
                  <button className="admin-btn danger small" type="button" onClick={() => handleDelete(it.id, "all")} disabled={busy}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!items.length && <p className="muted">No photos for this service yet. Upload some above.</p>}
      </div>
    </div>
  );
}

function CaptionEditor({ caption, captionEs, onSave, disabled }) {
  const [en, setEn] = useState(caption);
  const [es, setEs] = useState(captionEs);
  useEffect(() => {
    setEn(caption);
    setEs(captionEs);
  }, [caption, captionEs]);
  const dirty = en !== caption || es !== captionEs;
  return (
    <div>
      <div className="admin-field">
        <label>Caption EN</label>
        <input value={en} onChange={(e) => setEn(e.target.value)} disabled={disabled} />
      </div>
      <div className="admin-field">
        <label>Caption ES</label>
        <input value={es} onChange={(e) => setEs(e.target.value)} disabled={disabled} />
      </div>
      {dirty && (
        <button className="admin-btn small" type="button" disabled={disabled} onClick={() => onSave(en, es)}>
          Save caption
        </button>
      )}
    </div>
  );
}
