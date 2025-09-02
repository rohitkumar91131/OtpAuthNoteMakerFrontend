import React, { useEffect, useState } from "react";

interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

const AllNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/note/all`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setNotes(data.allNotes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/note/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newNote.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNewNote("");
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditNote = async (noteId: string) => {
    if (!editContent.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/note/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ note_id: noteId, content: editContent.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setEditNoteId(null);
        setEditContent("");
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/note/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ note_id: noteId }),
      });
      const data = await res.json();
      if (data.success) fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="!p-4 w-[100dvw]">
      <h1 className="text-2xl font-bold mb-4">Your Notes</h1>

      <form className="flex mb-4" onSubmit={handleAddNote}>
        <textarea
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note"
          className="border p-2 flex-1 mr-2 rounded"
        ></textarea>
        <button  className="bg-blue-500 text-white px-4 rounded h-fit !p-2">
          Add
        </button>
      </form>

      {notes.length === 0 && <p>No notes yet</p>}
      <div className="grid grid-cols-1 sm:grid-colos-2 md:grid-cols-3">
      {notes.map((note) => (
        <div key={note._id} className="border p-3 rounded mb-2 flex flex-col w-full">
          {editNoteId === note._id ? (
            <>
              <textarea
                type="text"
                value={editContent}
                rows={3}
                onChange={(e) => setEditContent(e.target.value)}
                className="border p-1 flex-1 mr-2 rounded"
              ></textarea>
              <button onClick={() => handleEditNote(note._id)} className="bg-green-500 text-white px-2 rounded mr-1 h-fit w-fit ">
                Save
              </button>
              <button onClick={() => setEditNoteId(null)} className="bg-gray-500 text-white px-2 rounded h-fit w-fit">
                Cancel
              </button>
            </>
          ) : (
            <>
           <span className="h-fit flex flex-col whitespace-pre-wrap break-words w-full max-w-[80%]">
             {note.content}
           </span>
              <div>
                <button
                  onClick={() => {
                    setEditNoteId(note._id);
                    setEditContent(note.content);
                  }}
                  className="bg-yellow-500 text-white px-2 rounded mr-1"
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteNote(note._id)} className="bg-red-500 text-white px-2 rounded">
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
      </div>
    </div>
  );
};

export default AllNotes;
