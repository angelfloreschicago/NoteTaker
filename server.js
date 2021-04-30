//Dependencies
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const fs = require('fs');

//GET routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
	res.sendFile(path.join(__dirname, 'db/db.json'));
});

app.get('/api/notes/:id', (req, res) => {
	let savedNotes = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
	res.json(savedNotes[Number(req.params.id)]);
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

//POST routes
app.post('/api/notes', (req, res) => {
	let savedNotes = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
	let newNote = req.body;
	let noteId = (savedNotes.length).toString();

	newNote.id = noteId;
	savedNotes.push(newNote);

	fs.writeFileSync('db/db.json', JSON.stringify(savedNotes));
	res.json(savedNotes);
});

//DELETE routes
app.delete('/api/notes/:id', (req, res) => {
	let savedNotes = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
	let noteId = req.params.id;
	let newId = 0;

	savedNotes = savedNotes.filter(note => {
		return note.id != noteId;
	});

	for (note of savedNotes) {
		note.id = newId.toString();
		newId++;
	}

	fs.writeFileSync('db/db.json', JSON.stringify(savedNotes));
	res.json(savedNotes);
});

//LISTENER
//The below code effectively "starts" our server
app.listen(PORT, () => {
  console.log('App listening on PORT ' + PORT);
});
