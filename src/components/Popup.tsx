import { useState, useEffect } from "react";
// 1. Swapped 'react-icons/fi' for 'lucide-react' to resolve module compilation error
import {
  Plus,
  Trash2, 
  Check,
  Copy,
  X,
  Edit,
} from "lucide-react";
import React from 'react'; // Explicit React import for type usage

// Define the Note type
type Note = {
  text: string;
  link: string;
};

export default function Popup() {
  // Type the state variables explicitly
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<Note>({ text: "", link: "" });
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Note: localStorage returns string or null. We check and parse.
    const storedNotes = localStorage.getItem("chromeNotes");
    const initialNotes: Note[] = storedNotes ? JSON.parse(storedNotes) : [];
    setNotes(initialNotes);
  }, []);

  // Type the function argument
  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem("chromeNotes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleAddNote = () => {
    if (newNote.text.trim() && newNote.link.trim()) {
      if (isEditing && editIndex !== null) {
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

  // Type the function argument
  const handleDelete = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    saveNotes(updatedNotes);
  };

  // Type the function arguments
  const handleCopy = (note: Note, index: number) => {
    // Since this is a Chrome extension, navigator.clipboard should work fine.
    navigator.clipboard.writeText(`${note.link}`);
    setCopiedIndex(index); 

    setTimeout(() => {
      setCopiedIndex(null); // Reset after 1 second
    }, 1000);
  };

  // Type the function arguments
  const handleEdit = (note: Note, index: number) => {
    setNewNote(note);
    setIsEditing(true);
    setEditIndex(index);
    setIsAdding(true);
  };

  // Type the event handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Note) => {
    setNewNote({ ...newNote, [field]: e.target.value });
  };


  return (
    <div className="p-4 w-lg min-w-80">
      <div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              setNewNote({ text: "", link: "" });
              setIsAdding(true);
              setIsEditing(false);
            }}
            className="text-black border cursor-pointer hover:bg-slate-100  font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center ps-auto"
          >
            {/* 2. Replaced FiPlus with Lucide Plus */}
            <Plus className="me-1 size-4" /> Add New Note
          </button>
        </div>

        {(isAdding || isEditing) && (
          <div className="mt-3 flex flex-col">
            <input
              type="text"
              placeholder="Note text"
              value={newNote.text}
              // Use the dedicated typed change handler
              onChange={(e) => handleInputChange(e, 'text')}
              className="w-full border rounded-md p-2 mb-2 focus:ring-black focus:border-black"
            />
            <input
              type="text"
              placeholder="Note link"
              value={newNote.link}
              // Use the dedicated typed change handler
              onChange={(e) => handleInputChange(e, 'link')}
              className="w-full border rounded-md p-2 mb-2 focus:ring-black focus:border-black"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setIsEditing(false);
                  setNewNote({ text: "", link: "" }); // Reset form on cancel
                }}
                className="text-black border cursor-pointer bg-white hover:bg-slate-50 font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center me-2"
              >
                {/* 3. Replaced FiX with Lucide X */}
                <X className="me-1 size-4" /> Cancel
              </button>
              <button
                type="button"
                onClick={handleAddNote}
                className="text-white cursor-pointer bg-black hover:bg-black/80 hover:text-white border font-medium rounded-lg text-sm px-3 py-2.5 text-center inline-flex items-center"
              >
                {/* 4. Replaced FiCheck with Lucide Check */}
                <Check className="me-1 size-4" /> {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>

      <h1 className="text-xl mt-4 mb-2 font-bold border-b pb-2">Saved Notes</h1>
      {notes.length === 0 ? (
        <p className="text-gray-500">No notes available. Click 'Add New Note' to start organizing!</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {notes.map((note, index) => (
            <li
              key={index}
              className="flex justify-between items-center py-4"
            >
              {/* Added target="_blank" and rel="noopener noreferrer" for safe link opening */}
              <a 
                href={note.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-black hover:text-blue-600 transition-colors duration-200 truncate max-w-[calc(100%-120px)] text-sm"
              >
                {note.text}
              </a>
              <div className="flex items-center space-x-3">
                {copiedIndex === index ? (
                  <span className="text-xs font-semibold text-green-600 w-12 text-center">Copied</span>
                ) : (
                  <button
                    onClick={() => handleCopy(note, index)}
                    className="relative group cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Copy Link"
                  >
                    {/* 5. Replaced FiCopy with Lucide Copy */}
                    <Copy className="size-4 text-gray-600 group-hover:text-black"/>
                    <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 p-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Copy Link
                    </div>
                  </button>
                )}

                <button
                  onClick={() => handleEdit(note, index)}
                  className="relative group cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Edit Note"
                >
                  {/* 6. Replaced FiEdit with Lucide Edit */}
                  <Edit  className="size-4 text-gray-600 group-hover:text-black"/>
                  <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 p-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Edit
                  </div>
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="relative group cursor-pointer p-1 rounded-full hover:bg-red-100 transition-colors"
                  aria-label="Delete Note"
                >
                  {/* 7. Replaced FiTrash2 with Lucide Trash2 */}
                  <Trash2  className="size-4 text-red-600 group-hover:text-red-800"/>
                  <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 p-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
