import { useState } from "react";

function NoteForm({ onAddNote }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (title.trim() === "" || content.trim() === "") {
            return;
        }

        onAddNote(title, content);
        setTitle("");
        setContent("");
    };

    return (
        <form className="note-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button type="submit">Add Note</button>
        </form>
    );
}

export default NoteForm;