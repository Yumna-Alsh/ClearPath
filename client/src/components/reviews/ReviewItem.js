import React, { useState } from "react";
import { FaHeart, FaStar, FaEllipsisV } from "react-icons/fa";
import ReplyItem from "./ReplyItem.js";

export default function ReviewItem({
  review,
  user,
  showSignInMessageFor,
  setShowSignInMessageFor,
  setReviews,
}) {
  const [replyingTo, setReplyingTo] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editingReview, setEditingReview] = useState(false);
  const [editingText, setEditingText] = useState(review.comment);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = async () => {
    if (!user) return;
    const hasLiked = review.likedBy.includes(user.username);

    try {
      const endpoint = hasLiked
        ? `/reviews/${review._id}/unlike`
        : `/reviews/${review._id}/like`;

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setReviews((prev) =>
        prev.map((r) =>
          r._id === review._id
            ? { ...r, likes: data.likes, likedBy: data.likedBy }
            : r
        )
      );
    } catch (err) {
      console.error("Error liking review:", err);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    try {
      const res = await fetch(`/reviews/${review._id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: replyText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setReviews((prev) =>
        prev.map((r) =>
          r._id === review._id
            ? { ...r, replies: [...(r.replies || []), data] }
            : r
        )
      );

      setReplyText("");
      setReplyingTo(false);
    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  const handleEditReview = async () => {
    if (!editingText.trim()) return;

    try {
      const res = await fetch(`/reviews/${review._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ comment: editingText }),
      });

      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error);

      setReviews((prev) =>
        prev.map((r) => (r._id === review._id ? updated : r))
      );
      setEditingReview(false);
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/reviews/${review._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setReviews((prev) => prev.filter((r) => r._id !== review._id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEditReply = async (replyId, newText, replyIndex) => {
    try {
      const res = await fetch(`/reviews/${review._id}/replies/${replyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: newText }),
      });

      const updatedReply = await res.json();
      if (!res.ok) throw new Error(updatedReply.error);

      setReviews((prev) =>
        prev.map((r) => {
          if (r._id !== review._id) return r;

          const updatedReplies = [...(r.replies || [])];
          updatedReplies[replyIndex] = {
            ...updatedReplies[replyIndex],
            ...updatedReply, 
          };

          return { ...r, replies: updatedReplies };
        })
      );
    } catch (err) {
      console.error("Edit reply error:", err);
    }
  };

  const handleDeleteReply = async (replyId, replyIndex) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;

    try {
      const res = await fetch(`/reviews/${review._id}/replies/${replyId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setReviews((prev) =>
        prev.map((r) => {
          if (r._id === review._id) {
            const updatedReplies = [...(r.replies || [])];
            updatedReplies.splice(replyIndex, 1);
            return { ...r, replies: updatedReplies };
          }
          return r;
        })
      );
    } catch (err) {
      console.error("Delete reply error:", err);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm space-y-2 bg-white relative">
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">{review.user}</p>
          <p className="text-xs text-gray-400">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>

        {user?.username === review.user && (
          <div className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-2 text-gray-600 hover:text-black"
            >
              <FaEllipsisV />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                <button
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                  onClick={() => {
                    setEditingReview(true);
                    setShowMenu(false);
                  }}
                >
                  Edit
                </button>
                <button
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 text-red-600"
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {editingReview ? (
        <>
          <textarea
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            className="w-full border rounded p-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleEditReview}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditingReview(false);
                setEditingText(review.comment);
              }}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p>{review.comment}</p>
      )}

      {review.accessibilityRating > 0 && (
        <div className="flex items-center text-yellow-500">
          {Array.from({ length: review.accessibilityRating }).map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>
      )}

      <div className="flex gap-4 text-sm">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 ${
            review.likedBy.includes(user?.username)
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          <FaHeart />
          <span>{review.likes}</span>
        </button>
        <button
          className="text-blue-500 hover:underline"
          onClick={() => {
            if (!user) {
              setShowSignInMessageFor(review._id);
              setTimeout(() => setShowSignInMessageFor(null), 3000);
            } else {
              setReplyingTo((prev) => !prev);
            }
          }}
        >
          Reply
        </button>
      </div>

      {showSignInMessageFor === review._id && (
        <p className="text-red-600 text-sm">Please sign in to comment.</p>
      )}

      {replyingTo && (
        <div className="mt-2 space-y-2">
          <textarea
            className="w-full border rounded p-2 text-sm"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button
            onClick={handleReplySubmit}
            className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
          >
            Post Reply
          </button>
        </div>
      )}
      {review.replies?.map((reply, i) => (
        <ReplyItem
          key={reply._id || i}
          reply={reply}
          user={user}
          reviewId={review._id}
          index={i}
          onEdit={handleEditReply}
          onDelete={handleDeleteReply}
        />
      ))}
    </div>
  );
}
