const { callOpenRouter } = require("./openRouterClient");
const { safeParseJson } = require("../utils/safeJson");

function trimContent(content, maxChars = 4000) {
  return String(content || "").slice(0, maxChars);
}

function validateInsightsPayload(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("AI payload is not an object.");
  }

  const summary = String(payload.summary || "").trim();
  const keyPoints = Array.isArray(payload.keyPoints)
    ? payload.keyPoints.map((p) => String(p).trim()).filter(Boolean)
    : [];
  const tags = Array.isArray(payload.tags)
    ? payload.tags.map((t) => String(t).trim()).filter(Boolean)
    : [];

  if (!summary) {
    throw new Error("AI payload missing summary.");
  }
  if (keyPoints.length < 3 || keyPoints.length > 5) {
    throw new Error("AI payload keyPoints must be 3 to 5 items.");
  }
  if (tags.length < 3 || tags.length > 5) {
    throw new Error("AI payload tags must be 3 to 5 items.");
  }

  return { summary, keyPoints, tags };
}

function buildInsightsPrompt(note) {
  const content = trimContent(note.content, 6000);
  return [
    {
      role: "system",
      content:
        "You are a precise assistant. Return ONLY valid JSON with no markdown, no extra text."
    },
    {
      role: "user",
      content: [
        "Analyze the note and return insights in this exact JSON format:",
        '{ "summary": "max 80 words", "keyPoints": ["3 to 5 concise points"], "tags": ["3 to 5 short tags"] }',
        "Rules:",
        "- summary max 80 words",
        "- each key point max 18 words",
        "- each tag max 3 words",
        "- keyPoints length between 3 and 5",
        "- tags length between 3 and 5",
        "",
        `Title: ${note.title}`,
        `Content: ${content}`
      ].join("\n")
    }
  ];
}

async function generateNoteInsights(note) {
  const messages = buildInsightsPrompt(note);
  const raw = await callOpenRouter(messages, { maxTokens: 350, temperature: 0.2 });
  const parsed = safeParseJson(raw);
  return validateInsightsPayload(parsed);
}

function buildQueryPrompt(note, question) {
  const trimmed = trimContent(note.content, 3000);

  return [
    {
      role: "system",
      content:
        "Answer questions using only provided note context. Be concise and practical. If unsure, state what is missing."
    },
    {
      role: "user",
      content: [
        `Question: ${question}`,
        "",
        "Note context:",
        `Summary: ${note.summary || "Not available"}`,
        `Key Points: ${(note.keyPoints || []).join("; ") || "Not available"}`,
        `Content Snippet: ${trimmed}`
      ].join("\n")
    }
  ];
}

async function answerNoteQuestion(note, question) {
  const messages = buildQueryPrompt(note, question);
  const answer = await callOpenRouter(messages, { maxTokens: 250, temperature: 0.3 });
  return String(answer).trim();
}

module.exports = { generateNoteInsights, answerNoteQuestion };
