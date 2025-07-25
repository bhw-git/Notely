import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.static("static"));
app.use(express.json());

const notesFile = path.join("static", "notes.json");

// Fetch notes
app.get("/api/notes", (req, res) => {
    fs.readFile(notesFile, (err, data) => {
        if (err) return res.json([]);
        res.json(JSON.parse(data));
    });
});
    // Add note
app.post("/api/notes", (req, res) => {
    const newNote = req.body;

    fs.readFile(notesFile, (err, data) => {
        let notes = [];
        if (!err && data.length > 0) {
            notes = JSON.parse(data);
        }
        const newId = notes.length > 0 ? (parseInt(notes[notes.length - 1].id) + 1).toString() : "1";   
        newNote.id = newId;
        notes.push(newNote);
        fs.writeFile(notesFile, JSON.stringify(notes, null, 2), err => {
            if (err) return res.status(500).send("Error saving note");
            res.json({ success: true });
        });
    });
});

//Delete note
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("static/notes.json", (err, data) => {
    if (err) return res.status(500).json({ error: "Unable to read file" });

    let notes = JSON.parse(data);
    const filteredNotes = notes.filter((note) => note.id !== id);

    fs.writeFile("static/notes.json", JSON.stringify(filteredNotes, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Unable to write file" });

      res.status(200).json({ message: "Note deleted" });
    });
  });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});