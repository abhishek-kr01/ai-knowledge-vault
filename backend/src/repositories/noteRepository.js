const Note = require("../models/Note");

async function createNote(data) {
  return Note.create(data);
}

async function listNotes() {
  return Note.find({})
    .sort({ createdAt: -1 })
    .select("title status summary tags keyPoints createdAt");
}

async function getNoteById(id) {
  return Note.findById(id);
}

async function deleteNoteById(id) {
  return Note.findByIdAndDelete(id);
}

async function updateNoteById(id, data) {
  return Note.findByIdAndUpdate(id, data, { new: true });
}

module.exports = {
  createNote,
  listNotes,
  getNoteById,
  deleteNoteById,
  updateNoteById
};
