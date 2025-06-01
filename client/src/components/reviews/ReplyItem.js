import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";

export default function ReplyItem({
  reply,
  user,
  index,
  onEdit,
  onDelete,
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(reply.text);
  const [openMenu, setOpenMenu] = useState(false);

  const handleSave = () => {
    onEdit(reply._id, text, index);
    setEditing(false);
  };

  return (
    <div className="ml-4 mt-2 border-l-2 pl-3 text-sm text-gray-700 relative">
      <div className="flex justify-between items-start">
        <div className="w-full">
          <p className="font-semibold">{reply.username || "User"}</p>
          {editing ? (
            <>
              <textarea
                className="w-full border rounded p-2 text-sm"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex gap-2 mt-1">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setText(reply.text);
                  }}
                  className="bg-gray-300 px-2 py-1 rounded text-xs"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p>{reply.text}</p>
              <p className="text-xs text-gray-400">
                {reply.createdAt
                  ? new Date(reply.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </>
          )}
        </div>
        {user?.username === reply.username && (
          <div className="relative">
            <button
              onClick={() => setOpenMenu((prev) => !prev)}
              className="p-2 text-gray-500 hover:text-black"
            >
              <FaEllipsisV />
            </button>
            {openMenu && (
              <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow z-10">
                <button
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                  onClick={() => {
                    setEditing(true);
                    setOpenMenu(false);
                  }}
                >
                  Edit
                </button>
                <button
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 text-red-600"
                  onClick={() => {
                    onDelete(reply._id, index);
                    setOpenMenu(false);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
