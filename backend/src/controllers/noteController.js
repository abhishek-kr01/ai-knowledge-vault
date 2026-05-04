const noteService = require("../services/noteService");

async function createNote(req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "title and content are required." });
    }

    const note = await noteService.createNoteAndQueueProcessing({ title, content });
    return res.status(201).json(note);
  } catch (error) {
    console.error("createNote error:", error);
    return res.status(500).json({ error: "Failed to create note." });
  }
}

async function listNotes(req, res) {
  try {
    const notes = await noteService.listNotes();
    return res.json(notes);
  } catch (error) {
    console.error("listNotes error:", error);
    return res.status(500).json({ error: "Failed to list notes." });
  }
}

async function getNote(req, res) {
  try {
    const note = await noteService.getNoteById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found." });
    }
    return res.json(note);
  } catch (error) {
    console.error("getNote error:", error);
    return res.status(500).json({ error: "Failed to fetch note." });
  }
}

async function deleteNote(req, res) {
  try {
    const deleted = await noteService.deleteNoteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Note not found." });
    }
    return res.status(204).send();
  } catch (error) {
    console.error("deleteNote error:", error);
    return res.status(500).json({ error: "Failed to delete note." });
  }
}

async function queryNote(req, res) {
  try {
    const result = await noteService.queryNote(req.params.id, req.body.question);
    if (result.error) {
      return res.status(result.statusCode || 400).json({ error: result.error });
    }
    return res.json({ answer: result.answer });
  } catch (error) {
    console.error("queryNote error:", error);
    return res.status(500).json({ error: "Failed to query note." });
  }
}

module.exports = { createNote, listNotes, getNote, deleteNote, queryNote };
