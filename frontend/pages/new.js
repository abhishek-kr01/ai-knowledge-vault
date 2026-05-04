import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { api } from "@/lib/api";

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    try {
      setLoading(true);
      const note = await api.createNote({ title: title.trim(), content: content.trim() });
      router.push(`/notes/${note._id}`);
    } catch (err) {
      setError(err.message || "Failed to create note.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <section className="card">
        <h1>Create Note</h1>
        <form onSubmit={onSubmit} className="form">
          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q2 product strategy"
              maxLength={180}
            />
          </label>
          <label>
            Content
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your long-form note..."
              rows={12}
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Note"}
          </button>
        </form>
      </section>
    </Layout>
  );
}
