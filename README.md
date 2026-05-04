# 🧠 AI Knowledge Vault

A full-stack AI-powered knowledge management system where users can create long-form notes, automatically generate insights using AI, and query their notes through a chat-like interface.

Built as an interview assignment to demonstrate:

* Async system design
* AI integration & prompt handling
* Clean backend architecture
* Frontend state & UX handling

---

## 🚀 Tech Stack

* **Frontend:** Next.js
* **Backend:** Node.js + Express
* **Database:** MongoDB
* **AI:** OpenRouter API

---

## 📂 Folder Structure

```
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── models
│   │   ├── repositories
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend
│   ├── components
│   ├── lib
│   ├── pages
│   ├── styles
│   ├── .env.local.example
│   └── package.json
└── README.md
```

---

## ✨ Features

### 📝 Notes CRUD

* Create, list, view, and delete notes
* Each note contains:

  * `title`, `content`
  * `status` → `processing | ready | failed`
  * `summary`, `keyPoints`, `tags`
  * `createdAt`

---

### ⚙️ Async AI Processing

When a note is created:

1. Save note with `status = processing`
2. Return API response immediately
3. Trigger background AI processing (non-blocking)
4. Generate:

   * Summary
   * 3–5 Key Points
   * 3–5 Tags
5. Update note → `ready`

#### 🔁 Failure Handling

* Retry AI call once on failure
* If still fails → mark as `failed`
* Prevent notes from getting stuck in `processing`

---

### 💬 Smart Query System

* Endpoint: `POST /notes/:id/query`
* Allows users to ask questions about a note

#### ⚡ Optimization Strategy

Instead of sending full note content:

* Use **summary (high signal)**
* Use **key points (structured context)**
* Use **trimmed content (for grounding)**

👉 This reduces token usage and improves response quality.

---

### 🎯 Frontend UX

Routes:

* `/` → Notes list (status indicators)
* `/new` → Create note
* `/notes/[id]` → Detail + Query UI

#### UX Handling:

* Clear loading states
* Error messages (no silent failures)
* Query disabled while loading
* Query disabled if note is not ready

---

## 🧠 AI Prompt Strategy

### 1. Insights Generation (Summary, Tags, Key Points)

* Enforces **strict JSON output**
* Defines exact schema
* Limits output size
* Ensures consistent structure

```json
{
  "summary": "Short summary",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "tags": ["tag1", "tag2", "tag3"]
}
```

---

### 2. Query Prompt

* Combines:

  * summary
  * keyPoints
  * partial content
* Generates concise, context-aware answers

---

## 🛡️ AI Response Validation

Implemented in:

* `services/noteAiService.js`
* `utils/safeJson.js`

### Key Handling:

* Safe JSON parsing
* Extract JSON from noisy responses
* Schema validation
* Controlled error handling

👉 Ensures unreliable AI output does not break the system.

---

## ⚖️ Key Trade-offs

### Why no queue system?

For this assignment, I used a simple in-process async approach to keep the implementation lightweight and focused within the given time.

In a production setup, this could be improved by:

* Using a job queue for better reliability
* Handling retries more robustly
* Scaling background processing independently

---

## ▶️ Run Locally

### 🔧 Prerequisites

* Node.js 18+
* MongoDB (local or Atlas)
* OpenRouter API key

---

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Add MONGODB_URI & OPENROUTER_API_KEY
npm run dev
```

Runs on: **http://localhost:8000**

---

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Runs on: **http://localhost:3000**

---

## 🚀 Future Improvements

* Background job queue
* Streaming AI responses
* Tag-based filtering
* AI response caching
* Rate limiting

---

## 📌 Conclusion

This project focuses on building a **real-world AI-powered system** with:

* Reliable async processing
* Defensive AI handling
* Clean architecture
* Thoughtful frontend UX

Designed to reflect practical engineering decisions within a limited time constraint.
