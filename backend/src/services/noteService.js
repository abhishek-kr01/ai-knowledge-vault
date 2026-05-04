const mongoose = require("mongoose");
const noteRepository = require("../repositories/noteRepository");
const { generateNoteInsights, answerNoteQuestion } = require("./noteAiService");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function createNoteAndQueueProcessing(payload) {
  const note = await noteRepository.createNote({
    title: payload.title,
    content: payload.content,
    status: "processing"
  });

  processNoteInBackground(note._id.toString()).catch((error) => {
    console.error("Background processing failed unexpectedly:", error);
  });

  return note;
}

async function processNoteInBackground(noteId) {
  let attempt = 0;
  const maxAttempts = 2; // one retry after initial failure

  while (attempt < maxAttempts) {
    try {
      const note = await noteRepository.getNoteById(noteId);
      if (!note) {
        return;
      }

      const insights = await generateNoteInsights(note);
      await noteRepository.updateNoteById(noteId, {
        status: "ready",
        summary: insights.summary,
        keyPoints: insights.keyPoints,
        tags: insights.tags
      });
      return;
    } catch (error) {
      attempt += 1;
      console.error(`AI processing attempt ${attempt} failed for note ${noteId}:`, error.message);
      if (attempt >= maxAttempts) {
        await noteRepository.updateNoteById(noteId, { status: "failed" });
      }
    }
  }
}

async function listNotes() {
  return noteRepository.listNotes();
}

async function getNoteById(id) {
  if (!isValidObjectId(id)) return null;
  return noteRepository.getNoteById(id);
}

async function deleteNoteById(id) {
  if (!isValidObjectId(id)) return null;
  return noteRepository.deleteNoteById(id);
}

async function queryNote(id, question) {
  if (!isValidObjectId(id)) {
    return { error: "Invalid note id.", statusCode: 400 };
  }
  if (!question || !String(question).trim()) {
    return { error: "Question is required.", statusCode: 400 };
  }

  const note = await noteRepository.getNoteById(id);
  if (!note) {
    return { error: "Note not found.", statusCode: 404 };
  }

  if (note.status !== "ready") {
    return {
      error: `Note is ${note.status}. Query is available only when status is ready.`,
      statusCode: 409
    };
  }

  const answer = await answerNoteQuestion(note, question.trim());
  return { answer };
}

module.exports = {
  createNoteAndQueueProcessing,
  listNotes,
  getNoteById,
  deleteNoteById,
  queryNote
};
