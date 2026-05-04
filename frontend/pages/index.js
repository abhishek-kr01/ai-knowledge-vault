import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";

export default function HomePage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotes() {
    try {
      setLoading(true);
      setError("");
      const data = await api.listNotes();
      setNotes(data);
    } catch (err) {
      setError(err.message || "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(noteId) {
    try {
      await api.deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (err) {
      alert(err.message || "Failed to delete note.");
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <Layout>
      <section className="card">
        <h1>All Notes</h1>
        <p className="muted">Create notes, let AI process them, then query insights.</p>
        <button className="button button-secondary" onClick={loadNotes} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </section>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p>No notes yet. Create your first note.</p>
      ) : (
        <div className="grid">
          {notes.map((note) => (
            <article key={note._id} className="card">
              <div className="row">
                <h3>{note.title}</h3>
                <StatusBadge status={note.status} />
              </div>
              <p>{note.summary || "AI summary will appear after processing."}</p>
              <div className="row">
                <Link href={`/notes/${note._id}`} className="button button-primary">
                  View
                </Link>
                <button className="button button-danger" onClick={() => onDelete(note._id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </Layout>
  );
}
