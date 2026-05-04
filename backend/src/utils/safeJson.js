function extractJsonObject(text) {
  const trimmed = String(text || "").trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in AI response.");
  }

  return trimmed.slice(start, end + 1);
}

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch (firstError) {
    const extracted = extractJsonObject(text);
    return JSON.parse(extracted);
  }
}

module.exports = { safeParseJson };
