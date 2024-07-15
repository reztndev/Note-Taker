const notes = require('express').Router();

// Importe uuid for the generation of notes' ids
const { v4: uuidv4 } = require('uuid');

// Set up the structure for filesystem operations
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
 
  readFromFile('./db/db.json').then(
    (data) => 
      { res.json(JSON.parse(data))

        // Debug
        //console.log("note.get('/'): readFromFile(db.json).then(data): ", JSON.parse(data) );
      }
  );
});


// GET Route for retrieving a specific note using its id
notes.get('/:id', (req, res) => {
  const noteId = req.params.id;

  //debug
  //console.log("note.get('/:id'): req.params.id: ", req.params.id );

  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});


// DELETE Route for a specific note using its id
notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);

      console.log("  noteId: ", noteId, " has been deleted\n");
    });
});


// POST Route for a new UX/UI note
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4(), // Generate and assign the unique id to the new note
    };

    // Append the new note to the file
    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
});

module.exports = notes;
