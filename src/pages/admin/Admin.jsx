import { useCallback, useEffect, useState } from "react";
import { servicePages } from "../../config";
import { useLang } from "../../i18n";
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
  const { lang, t, toggleLang } = useLang();
  
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

  if (auth.loading) {
    return (
      <div className="admin-page">
        <div className="admin-wrap">
          <p className="muted">{t("Checking session…")}</p>
        </div>
      </div>
    );
  }

  if (!auth.authenticated) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <div className="admin-lang" role="group" aria-label={t("Switch language")}>
            <button type="button" className={lang === "en" ? "on" : ""} onClick={() => lang !== "en" && toggleLang()}>
              EN
            </button>
            <button type="button" className={lang === "es" ? "on" : ""} onClick={() => lang !== "es" && toggleLang()}>
              ES
            </button>
          </div>
          <h1>{t("Admin login")}</h1>
          <p>{t("Name + access code + authenticator code")}</p>
          {error && <div className="admin-error">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="admin-field">
              <label htmlFor="name">{t("Name")}</label>
              <input
                id="name"
                autoComplete="username"
                value={login.name}
                onChange={(e) => setLogin({ ...login, name: e.target.value })}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="code">{t("Access code")}</label>
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
              <label htmlFor="totp">{t("Authenticator code (6 digits)")}</label>
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
              {busy ? t("Signing in…") : t("Sign in")}
            </button>
          </form>
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
