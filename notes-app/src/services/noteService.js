const API_URL = "http://localhost:3001/notes";

export const getNotes = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch notes from the backend.");
    }
    return await response.json();
};

export const createNote = async (note) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });

    if (!response.ok) {
        throw new Error("Failed to create a new note.");
    }
    return await response.json();
};

export const deleteNote = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete the note.");
    }
}