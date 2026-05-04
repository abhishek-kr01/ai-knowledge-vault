import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";

export default function NoteDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [question, setQuestion] = useState("");
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState("");
  const [answer, setAnswer] = useState("");

  async function loadNote() {
    if (!id) return;
    try {
      setLoading(true);
      setError("");
      const data = await api.getNote(id);
      setNote(data);
    } catch (err) {
      setError(err.message || "Failed to load note.");
    } finally {
      setLoading(false);
    }
  }

  async function onQuery(e) {
    e.preventDefault();
    setQueryError("");
    setAnswer("");
    if (!question.trim()) {
      setQueryError("Please enter a question.");
      return;
    }
    if (!note || note.status !== "ready") {
      setQueryError("Note must be ready before querying.");
      return;
    }

    try {
      setQueryLoading(true);
      const response = await api.queryNote(note._id, question.trim());
      setAnswer(response.answer);
    } catch (err) {
      setQueryError(err.message || "Failed to query note.");
    } finally {
      setQueryLoading(false);
    }
  }

  useEffect(() => {
    loadNote();
  }, [id]);

  const queryDisabled = queryLoading || !note || note.status !== "ready";

  return (
    <Layout>
      <section className="card">
        <button className="button button-secondary" onClick={() => router.push("/")}>
          Back
        </button>

        {loading ? (
          <p>Loading note...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <div className="row">
              <h1>{note.title}</h1>
              <StatusBadge status={note.status} />
            </div>
            <p className="muted">{new Date(note.createdAt).toLocaleString()}</p>
            <h3>Original Content</h3>
            <p className="preserve">{note.content}</p>

            <h3>Summary</h3>
            <p>{note.summary || "Not available yet."}</p>

            <h3>Key Points</h3>
            {note.keyPoints?.length ? (
              <ul>
                {note.keyPoints.map((point, idx) => (
                  <li key={`${point}-${idx}`}>{point}</li>
                ))}
              </ul>
            ) : (
              <p>Not available yet.</p>
            )}

            <h3>Tags</h3>
            {note.tags?.length ? (
              <div className="tag-row">
                {note.tags.map((tag, idx) => (
                  <span key={`${tag}-${idx}`} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p>Not available yet.</p>
            )}
          </>
        )}
      </section>

      {!loading && !error && (
        <section className="card">
          <h2>Ask This Note</h2>
          {note.status !== "ready" && (
            <p className="muted">
              Note status is <strong>{note.status}</strong>. Query is enabled only when ready.
            </p>
          )}
          <form onSubmit={onQuery} className="form">
            <label>
              Your question
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What are the main decisions?"
                disabled={queryDisabled}
              />
            </label>
            <button className="button button-primary" disabled={queryDisabled}>
              {queryLoading ? "Asking..." : "Ask"}
            </button>
          </form>
          {queryError && <p className="error">{queryError}</p>}
          {answer && (
            <div className="answer-box">
              <strong>Answer</strong>
              <p>{answer}</p>
            </div>
          )}
        </section>
      )}
    </Layout>
  );
}
