import React, { useState } from "react";
import { FaHeart, FaEllipsisV, FaReply, FaWheelchair } from "react-icons/fa";
import ReplyItem from "./ReplyItem";

/**
 * ReviewItem displays a single review, its replies, and allows users to interact
 * via liking, editing, replying, and deleting both the review and its replies.
 */
export default function ReviewItem({
  review,
  user,
  showSignInMessageFor,
  setShowSignInMessageFor,
  onReviewUpdate,
  onReviewDelete,
  onReplyAdded,
  onReplyUpdated,
  onReplyDelete,
}) {
  // Local state management
  const [replyingTo, setReplyingTo] = useState(false); 
  const [replyText, setReplyText] = useState(""); 
  const [editingReview, setEditingReview] = useState(false); 
  const [editingText, setEditingText] = useState(review.comment); 
  const [showMenu, setShowMenu] = useState(false); 

  // Toggle like on the review
  const handleLike = async () => {
    try {
      const res = await fetch(`/reviews/${review._id}/toggle-like`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      onReviewUpdate({
        ...review,
        likes: data.likes,
        likedBy: data.likedBy,
      });
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  // Submit reply to a review
  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    try {
      const res = await fetch(`/reviews/${review._id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: replyText }),
      });

      const updatedReview = await res.json();
      if (!res.ok) throw new Error(updatedReview.error);

      onReplyAdded(updatedReview); // Notify parent
      setReplyText("");
      setReplyingTo(false);
    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  // Submit edited review comment
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

      onReviewUpdate(updated);
      setEditingReview(false);
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  // Delete the review
  const handleDelete = async () => {
    try {
      await fetch(`/reviews/${review._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      onReviewDelete(review._id);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Edit a reply to the review
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

      onReplyUpdated({
        reviewId: review._id,
        replyId,
        updatedReply,
        replyIndex,
      });
    } catch (err) {
      console.error("Edit reply error:", err);
    }
  };

  // Delete a reply after confirmation
  const handleDeleteReply = async (replyId, replyIndex) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;

    try {
      const res = await fetch(`/reviews/${review._id}/replies/${replyId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onReplyDelete({
        reviewId: review._id,
        replyId,
        replyIndex,
      });
    } catch (err) {
      console.error("Delete reply error:", err);
    }
  };

  // Toggle like on a reply
  const handleToggleLikeReply = async (replyId, replyIndex) => {
    try {
      const res = await fetch(
        `/reviews/${review._id}/replies/${replyId}/like`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const updatedReply = await res.json();
      if (!res.ok) throw new Error(updatedReply.error);

      onReplyUpdated({
        reviewId: review._id,
        replyId,
        updatedReply,
        replyIndex,
      });
    } catch (err) {
      console.error("Error toggling reply like:", err);
    }
  };

  // Reply to a reply (nested)
  const handleReplyToReply = async (parentReplyId, text) => {
    if (!text.trim()) return;

    try {
      const res = await fetch(`/reviews/${review._id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text, parentReplyId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onReplyAdded(data);
    } catch (err) {
      console.error("Reply to reply error:", err);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm space-y-2 bg-white relative">
      {/* Review header: username, date, and rating */}
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">{review.user}</p>
          <p className="text-xs text-gray-400">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Accessibility rating display using wheelchair icons */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((wheelchair) => (
            <FaWheelchair
              key={wheelchair}
              className={`h-5 w-5 ${
                wheelchair <= review.accessibilityRating
                  ? "text-blue-600"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Review action menu (visible to review author) */}
        {user?.username === review.user && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-600 hover:text-black"
            >
              <FaEllipsisV />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                <button
                  onClick={() => {
                    setEditingReview(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 text-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Editable or static comment text */}
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

      {/* Review interaction buttons (like and reply) */}
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
          className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-blue-600"
          onClick={() => {
            if (!user) {
              setShowSignInMessageFor(review._id);
              setTimeout(() => setShowSignInMessageFor(null), 3000);
            } else {
              setReplyingTo(!replyingTo);
            }
          }}
        >
          <FaReply />
        </button>
      </div>

      {/* Sign-in message if unauthenticated user tries to reply */}
      {showSignInMessageFor === review._id && (
        <p className="text-red-600 text-sm">Please sign in to comment.</p>
      )}

      {/* Reply input section */}
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
            className="bg-[#216a78] text-white px-5 py-2 rounded-md hover:bg-[#1b5a65]"
          >
            Post Reply
          </button>
        </div>
      )}

      {/* Render replies */}
      {review.replies?.map((reply, i) => (
        <ReplyItem
          key={reply._id || i}
          reply={reply}
          user={user}
          reviewId={review._id}
          index={i}
          onEdit={handleEditReply}
          onDelete={handleDeleteReply}
          onToggleLike={handleToggleLikeReply}
          onReply={handleReplyToReply}
        />
      ))}
    </div>
  );
}
