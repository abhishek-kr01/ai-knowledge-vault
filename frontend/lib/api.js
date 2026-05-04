const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || "Request failed.");
  }
  return data;
}

export const api = {
  listNotes() {
    return request("/notes");
  },
  getNote(id) {
    return request(`/notes/${id}`);
  },
  createNote(payload) {
    return request("/notes", { method: "POST", body: JSON.stringify(payload) });
  },
  deleteNote(id) {
    return request(`/notes/${id}`, { method: "DELETE" });
  },
  queryNote(id, question) {
    return request(`/notes/${id}/query`, {
      method: "POST",
      body: JSON.stringify({ question })
    });
  }
};
