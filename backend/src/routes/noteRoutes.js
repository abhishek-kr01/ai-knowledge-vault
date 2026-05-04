const express = require("express");
const noteController = require("../controllers/noteController");

const router = express.Router();

router.get("/", noteController.listNotes);
router.post("/", noteController.createNote);
router.get("/:id", noteController.getNote);
router.delete("/:id", noteController.deleteNote);
router.post("/:id/query", noteController.queryNote);

module.exports = router;
