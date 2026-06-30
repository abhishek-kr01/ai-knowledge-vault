# 🧠 AI Knowledge Vault

A full-stack AI-powered knowledge management system where users can create long-form notes, automatically generate insights using AI, and query their notes through a chat-like interface.

---

## 🔗 Live Links

* 🚀 **Live Application:** https://ai-knowledge-vault-theta.vercel.app/
* 💻 **GitHub Repository:** https://github.com/abhishek-kr01/ai-knowledge-vault

---

## 🎯 Purpose

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

Each note includes:

* `title`, `content`
* `status` → `processing | ready | failed`
* `summary`, `keyPoints`, `tags`
* `createdAt`

---

### ⚙️ Async AI Processing

When a note is created:

1. Save note with `status = processing`
2. Return response immediately
3. Trigger background AI processing (non-blocking)
4. Generate:

   * Summary
   * 3–5 Key Points
   * 3–5 Tags
5. Update note → `ready`

#### 🔁 Failure Handling

* Retry AI call once on failure
* If still fails → mark as `failed`
* Ensures no note remains stuck in `processing`

---

### 💬 Smart Query System

* Endpoint: `POST /notes/:id/query`
* Allows users to ask questions about a note

#### ⚡ Optimization Strategy

Instead of sending full content:

* Use **summary (high signal)**
* Use **key points (structured context)**
* Use **trimmed content (for grounding)**

👉 Improves response quality and reduces token usage

---

### 🎯 Frontend UX

Routes:

* `/` → Notes list with status indicators
* `/new` → Create note
* `/notes/[id]` → Detail + Query UI

#### UX Handling:

* Clear loading states
* Explicit error messages
* Query disabled while loading
* Query disabled if note is not ready
* Auto-refresh (polling) while processing

---

## 🧠 AI Prompt Strategy

### 1. Insights Generation

* Enforces strict JSON output
* Defines exact schema
* Limits output size

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
* Produces concise, context-aware answers

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

👉 Prevents invalid AI output from breaking the system

---

## ⚖️ Key Trade-offs

### Why no queue system?

For this assignment, a simple in-process async approach was used to keep the implementation lightweight and focused within the given timeline.

In a production setup, this could be improved by:

* Using a job queue (BullMQ, etc.)
* More robust retry mechanisms
* Independent worker scaling

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

Runs on: **http://localhost:4000**

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

This project demonstrates a **real-world AI-powered system** with:

* Reliable async processing
* Defensive AI handling
* Clean architecture
* Thoughtful frontend UX

Designed to balance simplicity with practical engineering decisions under time constraints.
