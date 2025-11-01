import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Check,
  Copy,
  X,
  Edit,
  CopyPlus,
  GripVertical,
} from "lucide-react";
import React from "react"; // Explicit React import for type usage

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

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // useEffect(() => {
  //   // Note: localStorage returns string or null. We check and parse.
  //   const storedNotes = localStorage.getItem("chromeNotes");
  //   const initialNotes: Note[] = storedNotes ? JSON.parse(storedNotes) : [];
  //   setNotes(initialNotes);
  // }, []);

  // // Type the function argument
  // const saveNotes = (updatedNotes: Note[]) => {
  //   localStorage.setItem("chromeNotes", JSON.stringify(updatedNotes));
  //   setNotes(updatedNotejs);
  // };

  useEffect(() => {
    chrome.storage.local.get(["chromeNotes"], (result) => {
      setNotes(result.chromeNotes || []);
    });
  }, []);

  const saveNotes = (updatedNotes: Note[]) => {
    chrome.storage.local.set({ chromeNotes: updatedNotes });
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
  const handleDuplicate = (note: Note, index: number) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index + 1, 0, { ...note }); // Insert duplicate right after original
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
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Note
  ) => {
    setNewNote({ ...newNote, [field]: e.target.value });
  };
  //draggable and reorder functionality
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (
      draggedIndex !== null &&
      dragOverIndex !== null &&
      draggedIndex !== dragOverIndex
    ) {
      const updatedNotes = [...notes];
      const [draggedItem] = updatedNotes.splice(draggedIndex, 1);
      updatedNotes.splice(dragOverIndex, 0, draggedItem);
      saveNotes(updatedNotes);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault(); // Required to allow drop
    if (draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
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
              onChange={(e) => handleInputChange(e, "text")}
              className="w-full border rounded-md p-2 mb-2 focus:ring-black focus:border-black"
            />
            <input
              type="text"
              placeholder="Note link"
              value={newNote.link}
              // Use the dedicated typed change handler
              onChange={(e) => handleInputChange(e, "link")}
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
                <Check className="me-1 size-4" />{" "}
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>

      <h1 className="text-xl mt-4 mb-2 font-bold border-b pb-2">Saved Notes</h1>
      {notes.length === 0 ? (
        <p className="text-gray-500">
          No notes available. Click 'Add New Note' to start organizing!
        </p>
      ) : (
        <ul className="border border-slate-100 rounded-xl p-4 space-y-2 mt-4">
          {notes.map((note, index) => (
            <li key={index} className="relative">
              {/* Drop indicator line */}
              {dragOverIndex === index && draggedIndex !== index && (
                <div className="absolute -top-1 left-0 right-0 h-0.5 bg-black z-20" />
              )}
              
              <div
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                className={`
                  flex justify-between items-center py-4 pl-4
                  transition-all duration-150 bg-white rounded-lg border border-transparent
                  ${
                    draggedIndex === index
                      ? "opacity-50 scale-[0.98] cursor-grabbing"
                      : "opacity-100 scale-100"
                  }
                  ${
                    draggedIndex !== null && draggedIndex !== index
                      ? "opacity-60"
                      : ""
                  }
                `}
              >
                <div className="flex justify-center items-center gap-4">
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    className="relative group cursor-grab active:cursor-grabbing p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Drag to reorder"
                  >
                    <GripVertical className="size-4 text-gray-400 group-hover:text-gray-600" />
                    <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Drag to reorder
                    </div>
                  </button>

                  <div className="flex-1 min-w-0 ml-2">
                    <a
                      href={note.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-black hover:text-blue-600 transition-colors duration-200 truncate text-sm font-medium"
                    >
                      {note.text}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleDuplicate(note, index)}
                      className="relative group cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Duplicate Link"
                    >
                      <CopyPlus className="size-4 text-gray-600 group-hover:text-black" />
                      <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 p-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Duplicate Link
                      </div>
                    </button>

                    {copiedIndex === index ? (
                      <span className="text-xs font-semibold text-green-600 w-12 text-center">
                        Copied
                      </span>
                    ) : (
                      <button
                        onClick={() => handleCopy(note, index)}
                        className="relative group cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Copy Link"
                      >
                        <Copy className="size-4 text-gray-600 group-hover:text-black" />
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
                      <Edit className="size-4 text-gray-600 group-hover:text-black" />
                      <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 p-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Edit
                      </div>
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="relative group cursor-pointer p-1 rounded-full hover:bg-red-100 transition-colors"
                      aria-label="Delete Note"
                    >
                      <Trash2 className="size-4 text-red-600 group-hover:text-red-800" />
                      <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 p-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Delete
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}