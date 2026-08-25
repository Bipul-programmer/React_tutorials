import NoteCard from './NoteCard';

function NoteList({ notes, onDeleteNote }) {
  if (!notes || notes.length === 0) {
    return <p className="empty-notes">No notes yet. Create your first note above!</p>;
  }

  return (
    <div className="notes-container">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onDeleteNote={onDeleteNote} />
      ))}
    </div>
  );
}

export default NoteList;