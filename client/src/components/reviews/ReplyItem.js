import React, { useState } from "react";
import { FaHeart, FaEllipsisV, FaReply } from "react-icons/fa";

/**
 * Component for displaying and managing a single reply.
 * Supports editing, deleting, liking, and nested replies.
 */
export default function ReplyItem({
  reply,
  user,
  index,
  onEdit,
  onDelete,
  onToggleLike,
  onReply,
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(reply.text);
  const [openMenu, setOpenMenu] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const liked = reply.likedBy?.includes(user?.username);

  // Save edited text
  const handleSave = () => {
    onEdit(reply._id, text, index);
    setEditing(false);
  };

  return (
    <div className="ml-4 mt-2 border-l-2 pl-3 text-sm text-gray-700 relative">
      <div className="flex justify-between items-start">
        <div className="w-full">
          <p className="font-semibold">{reply.username || "User"}</p>

          {/* Editable or static text view */}
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
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                {/* Display reply date */}
                <span>
                  {reply.createdAt
                    ? new Date(reply.createdAt).toLocaleDateString()
                    : ""}
                </span>

                {/* Like button */}
                <button
                  onClick={() => onToggleLike(reply._id, index)}
                  className={`flex items-center gap-1 ${
                    liked ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  <FaHeart />
                  <span>{reply.likedBy?.length || 0}</span>
                </button>

                {/* Toggle nested reply input */}
                <button
                  onClick={() => setShowReplyBox(!showReplyBox)}
                  className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-blue-600"
                  title="Reply"
                >
                  <FaReply />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Nested reply input box */}
        {showReplyBox && (
          <div className="mt-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              placeholder={`Replying to @${reply.username || "user"}`}
            />
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => {
                  onReply(reply._id, replyText); // Trigger reply callback
                  setReplyText(`@${reply.username} `);
                  setShowReplyBox(true);
                }}
                className="bg-[#216a78] text-white text-white px-2 py-1 rounded text-xs hover:bg-[#1b5a65]"
              >
                Reply
              </button>
              <button
                onClick={() => setShowReplyBox(false)}
                className="bg-gray-300 px-2 py-1 rounded text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Action menu (edit/delete) only visible to author */}
        {user?.username === reply.username && (
          <div className="relative">
            <button
              onClick={() => setOpenMenu((prev) => !prev)}
              className="p-2 text-gray-500 hover:text-black"
            >
              <FaEllipsisV />
            </button>

            {/* Dropdown menu for edit/delete actions */}
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
