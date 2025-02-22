import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiCheck,
  FiCopy,
  FiX,
  FiEdit,
} from "react-icons/fi";

export default function Popup() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ text: "", link: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("chromeNotes")) || [];
    setNotes(storedNotes);
  }, []);

  const saveNotes = (updatedNotes) => {
    localStorage.setItem("chromeNotes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleAddNote = () => {
    if (newNote.text.trim() && newNote.link.trim()) {
      if (isEditing) {
        const updatedNotes = [...notes];
        updatedNotes[editIndex] = newNote;
        saveNotes(updatedNotes);
        setIsEditing(false);
        setEditIndex(null);
      } else {
        saveNotes([...notes, newNote]);
      }
      setNewNote({ text: "", link: "" });
      setIsAdding(false);
    }
  };

  const handleDelete = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    saveNotes(updatedNotes);
  };

  const handleCopy = (note, index) => {
    navigator.clipboard.writeText(`${note.link}`);
    setCopiedIndex(index); // Set the index of the copied note to show "Copied"

    setTimeout(() => {
      setCopiedIndex(null); // Reset after 2 seconds
    }, 1000);
  };

  const handleEdit = (note, index) => {
    setNewNote(note);
    setIsEditing(true);
    setEditIndex(index);
    setIsAdding(true);
  };

  return (

      <div className="p-4 w-lg">
        <div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setNewNote({ text: "", link: "" });
                setIsAdding(true);
                setIsEditing(false);
              }}
              className="text-black border  hover:bg-slate-100  font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center ps-auto"
            >
              <FiPlus /> Add New Note
            </button>
          </div>

          {(isAdding || isEditing) && (
            <div className="mt-3 flex flex-col">
              <input
                type="text"
                placeholder="Note text"
                value={newNote.text}
                onChange={(e) =>
                  setNewNote({ ...newNote, text: e.target.value })
                }
                className="w-full border rounded-md p-2 mb-2"
              />
              <input
                type="text"
                placeholder="Note link"
                value={newNote.link}
                onChange={(e) =>
                  setNewNote({ ...newNote, link: e.target.value })
                }
                className="w-full border  rounded-md p-2 mb-2"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setIsEditing(false);
                  }}
                  className="text-black border    bg-white hover:bg-slate-50  font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center me-2"
                >
                  <FiX /> Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="text-white    bg-black hover:bg-black/80 hover:text-white  border font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center"
                >
                  <FiCheck /> {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </div>
          )}
        </div>

        <h1 className="text-xl mt-2 font-bold">Notes</h1>
        {notes.length === 0 ? (
          <p>No notes available.</p>
        ) : (
          <ul>
            {notes.map((note, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b py-4"
              >
                <a href={note.link} className="text-blue-400 truncate max-w-64 w-72">
                  {note.text}
                </a>
                <div className="space-x-4">
                {copiedIndex === index ? (
                    <span className="text-xs">Copied</span>
                  ) : (
                    <button
                      onClick={() => handleCopy(note, index)}
                      className="relative group"
                    >
                      <FiCopy className="size-5"/>
                      <div className="absolute left-1/2 bottom-5 transform -translate-x-1/2 mt-1 text-center p-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Copy
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => handleEdit(note, index)}
                    className="relative group"
                  >
                    <FiEdit  className="size-5"/>
                    <div className="absolute left-1/2 bottom-5 transform -translate-x-1/2 mt-1 text-center p-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit
                    </div>
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="relative group"
                  >
                    <FiTrash2  className="size-5"/>
                    <div className="absolute left-1/2 bottom-5 transform -translate-x-1/2 mt-1 text-center p-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Delete
                    </div>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
  );
}
