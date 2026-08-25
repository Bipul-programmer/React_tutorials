import { useState } from "react";
import "./App.css";

import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";

function App() {
  const [notes, setNotes] = useState([]);

  const addNote = (title, content) => {
    if (title.trim() === "" || content.trim() === "") {
      return;
    }

    const newNote = {
      id: Date.now(), 
      title: title,
      content: content,
    };

    setNotes([newNote, ...notes]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="app">
      <h1>📝 My Notes</h1>

      <NoteForm onAddNote={addNote} />

      <NoteList notes={notes} onDeleteNote={deleteNote} />
    </div>
  );
}

export default App;
