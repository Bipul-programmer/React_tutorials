function NoteCard({ note, onDeleteNote }) {
  return (
    <div className="note-card">
      <h2>{note.title}</h2>
      <p>{note.content}</p>

      <div className="note-actions">
        <button className="delete-button" onClick={() => onDeleteNote && onDeleteNote(note.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteCard;
