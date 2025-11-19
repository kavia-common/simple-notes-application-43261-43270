import React, { useState, useEffect, useRef } from "react";

// Ocean Professional theme variables
const THEME = {
  primary: "#2563EB",
  secondary: "#F59E0B",
  success: "#F59E0B",
  error: "#EF4444",
  background: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",
};

function getTimeString(d) {
  return d.toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getInitialNotes() {
  try {
    const value = window.localStorage.getItem("notes_v1");
    if (value) return JSON.parse(value);
  } catch (_e) {}
  return [];
}

function saveNotes(notes) {
  window.localStorage.setItem("notes_v1", JSON.stringify(notes));
}

// PUBLIC_INTERFACE
function App() {
  // Notes: [{id, title, content, createdAt}] sorted newest first
  const [notes, setNotes] = useState(getInitialNotes());
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [confirmingClear, setConfirmingClear] = useState(false);
  const titleRef = useRef(null);

  // Effect: Save notes to localStorage whenever they change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // Effect: Focus title field on mount
  useEffect(() => {
    if (titleRef.current) titleRef.current.focus();
  }, []);

  // Filter notes by search term
  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  // Validate inputs
  function validateInputs() {
    let errs = {};
    if (!title.trim()) errs.title = "Title is required";
    else if (title.length > 100)
      errs.title = "Title may not exceed 100 characters";
    if (!content.trim()) errs.content = "Content is required";
    else if (content.length > 2000)
      errs.content = "Content may not exceed 2000 characters";
    return errs;
  }

  // Add a new note
  function onSubmit(e) {
    e.preventDefault();
    const errs = validateInputs();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const newNote = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
    setErrors({});
    if (titleRef.current) titleRef.current.focus();
  }

  // Delete individual note
  function onDeleteNote(id) {
    setNotes(notes.filter((n) => n.id !== id));
  }

  // Clear all notes (with confirm)
  function onClearAll() {
    setConfirmingClear(true);
  }
  function onCancelClear() {
    setConfirmingClear(false);
  }
  function onConfirmClearAll() {
    setNotes([]);
    setConfirmingClear(false);
  }

  // Input handlers with ARIA and accessibility
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(120deg, #2563EB0F 0%, #f9fafb 100%)`,
        color: THEME.text,
        fontFamily: "'Segoe UI', 'Samsung Sharp Sans', Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: THEME.primary,
          color: "#fff",
          padding: "2rem 0.5rem 1.2rem 0.5rem",
          textAlign: "center",
          boxShadow: "0 5px 17px 0 #2563eb22",
        }}
      >
        <h1
          style={{
            fontWeight: 700,
            fontSize: "3rem",
            letterSpacing: "-1px",
            margin: 0,
          }}
          id="main-header"
        >
          Notes
        </h1>
        <p
          style={{
            margin: "0.5rem auto 0",
            maxWidth: 820,
            fontSize: "1.125rem",
            color: "#e3eefa",
            letterSpacing: "0.5px",
          }}
        >
          Take, view, search, and manage your notes. Your data is stored in your browser.
        </p>
      </header>

      {/* Main Content Area */}
      <main
        style={{
          maxWidth: 560,
          margin: "2rem auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.7rem",
        }}
        aria-labelledby="main-header"
      >
        {/* Note Input Form */}
        <section
          aria-label="Add a new note"
          style={{
            background: THEME.surface,
            borderRadius: 18,
            padding: "1.25rem 1.5rem 1.5rem",
            boxShadow: "0 2px 12px 3px #2563eb1c",
            transition: "box-shadow 0.25s",
          }}
        >
          <form onSubmit={onSubmit} autoComplete="off">
            <div style={{ marginBottom: "0.7rem" }}>
              <label
                htmlFor="note-title"
                style={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  marginRight: 8,
                  color: THEME.text,
                }}
              >
                Title
              </label>
              <input
                ref={titleRef}
                id="note-title"
                aria-required="true"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "error-title" : undefined}
                type="text"
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  border: `1.5px solid ${
                    errors.title ? THEME.error : "#b9cbf6"
                  }`,
                  outline: errors.title
                    ? `2px solid ${THEME.error}`
                    : "none",
                  background: THEME.background,
                  fontSize: "1rem",
                  padding: "0.45rem 0.9rem",
                  borderRadius: 10,
                  width: "98%",
                  marginTop: 3,
                  boxShadow: errors.title
                    ? `0 0 4px ${THEME.error}55`
                    : "0 1px 2px #d7e7ff29",
                  transition: "border 0.3s, box-shadow 0.2s",
                }}
                placeholder="Enter note title"
                required
              />
              {errors.title && (
                <span
                  id="error-title"
                  style={{
                    color: THEME.error,
                    fontSize: "0.97rem",
                    marginTop: 2,
                    display: "block",
                  }}
                  role="alert"
                >
                  {errors.title}
                </span>
              )}
            </div>
            <div style={{ marginBottom: "0.77rem" }}>
              <label
                htmlFor="note-content"
                style={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  marginRight: 8,
                  color: THEME.text,
                }}
              >
                Content
              </label>
              <textarea
                id="note-content"
                aria-required="true"
                aria-invalid={!!errors.content}
                aria-describedby={errors.content ? "error-content" : undefined}
                value={content}
                maxLength={2000}
                onChange={(e) => setContent(e.target.value)}
                style={{
                  border: `1.5px solid ${
                    errors.content ? THEME.error : "#b9cbf6"
                  }`,
                  background: THEME.background,
                  fontSize: "1rem",
                  borderRadius: 10,
                  padding: "0.65rem 0.95rem",
                  minHeight: 64,
                  width: "98%",
                  marginTop: 3,
                  boxShadow: errors.content
                    ? `0 0 4px ${THEME.error}55`
                    : "0 1px 2px #fffded22",
                  transition: "border 0.3s, box-shadow 0.2s",
                }}
                placeholder="Write your note here (max 2000 chars)"
                required
              />
              {errors.content && (
                <span
                  id="error-content"
                  style={{
                    color: THEME.error,
                    fontSize: "0.97rem",
                    marginTop: 2,
                    display: "block",
                  }}
                  role="alert"
                >
                  {errors.content}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
              <button
                type="submit"
                style={{
                  background: `linear-gradient(92deg, ${THEME.primary} 68%, #4888fa 110%)`,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  border: "none",
                  borderRadius: 12,
                  padding: "0.8rem 2.2rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px #2563eb28",
                  transition: "box-shadow 0.21s, background 0.29s",
                }}
                aria-label="Save note"
              >
                Add Note
              </button>
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setContent("");
                  setErrors({});
                  if (titleRef.current) titleRef.current.focus();
                }}
                style={{
                  background: "#eaf3fe",
                  color: THEME.primary,
                  fontWeight: 500,
                  fontSize: "1.02rem",
                  border: `1px solid #b9cbf6`,
                  borderRadius: 12,
                  padding: "0.8rem 1.6rem",
                  cursor: "pointer",
                  marginLeft: "auto",
                  transition: "background 0.2s",
                }}
                aria-label="Clear form"
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        <section aria-label="Search and actions" style={{display:"flex", gap:"1rem", alignItems:"center"}}>
          {/* Search Box */}
          <input
            type="search"
            aria-label="Search for notes"
            placeholder="Search notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              fontSize: "1rem",
              lineHeight: "1.1",
              padding: "0.62rem 1.1rem",
              borderRadius: 10,
              border: "1.5px solid #b9cbf6",
              background: THEME.surface,
              color: THEME.text,
              boxShadow: "0 1px 3px 0 #d7e7ff11",
              marginRight: "auto",
            }}
          />
          {/* Clear All Button */}
          <button
            onClick={onClearAll}
            style={{
              background: THEME.error,
              color: "#fff",
              fontWeight: 600,
              border: "none",
              borderRadius: 12,
              padding: "0.65rem 1.3rem",
              fontSize: "1.02rem",
              cursor: "pointer",
              boxShadow: "0 2px 7px #ef444422",
              transition: "background 0.19s",
              marginLeft: 0,
            }}
            aria-label={
              notes.length === 0
                ? "No notes to clear"
                : "Clear all notes (will ask you to confirm)"
            }
            disabled={notes.length === 0}
          >
            Clear All
          </button>
        </section>

        {/* Confirm Clear Modal */}
        {confirmingClear && (
          <div
            role="alertdialog"
            aria-modal="true"
            style={{
              position: "fixed",
              inset: 0,
              background: "#111827cc",
              zIndex: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: THEME.surface,
                padding: "2.3rem 2.1rem 2.1rem",
                borderRadius: 18,
                boxShadow: "0 5px 24px #1e3c72aa",
                textAlign: "center",
                maxWidth: 350,
                width: "98vw",
              }}
            >
              <h2 style={{ color: THEME.error, marginBottom: "0.7rem" }}>
                Clear all notes?
              </h2>
              <div style={{ color: THEME.text, marginBottom: "1.3rem" }}>
                This will delete <b>all</b> notes. This action is not reversible.
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 17 }}>
                <button
                  onClick={onConfirmClearAll}
                  style={{
                    background: THEME.error,
                    color: "#fff",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: 12,
                    padding: "0.7rem 1.7rem",
                    fontSize: "1rem",
                    boxShadow: "0 2px 7px #ef444455",
                  }}
                  autoFocus
                  aria-label="Confirm clear all notes"
                >
                  Yes, clear all
                </button>
                <button
                  onClick={onCancelClear}
                  style={{
                    background: "#eaf3fe",
                    color: THEME.primary,
                    fontWeight: 500,
                    border: `1px solid #b9cbf6`,
                    borderRadius: 12,
                    padding: "0.7rem 1.7rem",
                    fontSize: "1rem",
                  }}
                  aria-label="Cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes List */}
        <section
          aria-label="Notes list"
          style={{
            background: THEME.surface,
            borderRadius: 18,
            boxShadow: "0 1px 12px 2px #2563eb12",
            minHeight: 140,
            maxHeight: "42vh",
            padding: 0,
            overflowY: "auto",
            transition: "box-shadow 0.32s",
          }}
          tabIndex={0}
        >
          {filteredNotes.length === 0 ? (
            <div
              style={{
                color: "#888",
                padding: "2.5rem",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              {notes.length === 0
                ? "No notes yet. Add your first note above!"
                : `No notes found matching "${search}".`}
            </div>
          ) : (
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {filteredNotes.map((note) => (
                <li
                  key={note.id}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    padding: "1.1rem 1.4rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    position: "relative",
                    background: "transparent",
                    transition: "background 0.2s",
                  }}
                  tabIndex={0}
                  aria-labelledby={`note-title-${note.id}`}
                  aria-describedby={`note-content-${note.id}`}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      id={`note-title-${note.id}`}
                      style={{
                        margin: "0 0 0.15em 0",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: THEME.primary,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        lineHeight: 1.3,
                      }}
                    >
                      {note.title}
                    </h3>
                    <div
                      id={`note-content-${note.id}`}
                      style={{
                        color: THEME.text,
                        fontSize: "1rem",
                        margin: "0.25em 0 0.22em 0",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {note.content}
                    </div>
                    <div
                      style={{
                        color: "#89aff5",
                        fontSize: "0.93rem",
                        marginTop: 2,
                        fontStyle: "italic",
                        userSelect: "none",
                      }}
                      aria-label={`Created at ${getTimeString(
                        new Date(note.createdAt)
                      )}`}
                    >
                      {getTimeString(new Date(note.createdAt))}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    style={{
                      background: THEME.error,
                      border: "none",
                      color: "#fff",
                      borderRadius: 9,
                      padding: "0.39rem 0.95rem",
                      fontSize: "1.035rem",
                      fontWeight: 600,
                      marginLeft: "auto",
                      alignSelf: "flex-start",
                      marginTop: 1,
                      cursor: "pointer",
                      boxShadow: "0 1px 6px 1px #ef44441e",
                      transition: "background 0.19s, box-shadow 0.18s",
                    }}
                    aria-label={`Delete note "${note.title}"`}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          margin: "2.8rem auto 0.8rem",
          color: "#9ca3af",
          fontSize: "1.08rem",
          letterSpacing: "0.2px",
        }}
      >
        Ocean Professional Theme &mdash; Tizen Note Taking App
      </footer>
    </div>
  );
}

export default App;
