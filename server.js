//you need express to interact with the front end.
const express = require("express");

//you need path for filename paths.
const path = require("path");

// you need fs to read and write to files.
const fs = require("fs");

//creating an “express server”.
const app = express();

const PORT = process.env.PORT || 3000;

const {v4: uuidv4} = require('uuid');

//initialize notesData.
let notesData = [];


//set up body parsing, static and route middleware.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


//routes
app.get("/api/notes", function(req, res) {
  res.sendFile(__dirname + '/db/db.json');
});


app.get('/notes', function (req, res) {
  res.sendFile(__dirname + '/public/notes.html');
});



app.post('/api/notes', function (req, res) {
  // read db.json and convert it to an array of notes
  const notes = JSON.parse(fs.readFileSync(__dirname + '/db/db.json'));
  const newNote = req.body;
  newNote.id = uuidv4();
  notes.push(newNote);
  // rewrite to notes file
  fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(notes));
  // sending our notes as JSON data back to the client
  res.json(notes);
});



  app.delete('/api/notes/:id', function (req, res) {
    var id = req.params.id;
    // read db.json and convert it to an array of notes
    const deleteNotes = JSON.parse(fs.readFileSync(__dirname + '/db/db.json'));
    // remove the note by its id
    let newData = deleteNotes.filter(function(notes){
      return notes.id != req.params.id;
    });
    console.log(newData);
    // rewrite to the notes files, send notes as JSON data back to the client
    fs.writeFileSync('./db/db.json', JSON.stringify(newData));
    // sending our notes as JSON data back to the client
    res.json(newData);
  });



app.listen(PORT, function() {
  console.log('Express server listening on port ' + PORT);
});

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
