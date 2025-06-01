import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function ReviewForm({ locationId, setReviews }) {
  const [newReviewText, setNewReviewText] = useState("");
  const [accessibilityRating, setAccessibilityRating] = useState(0);

  const handleSubmit = async () => {
    if (!newReviewText.trim()) return;

    try {
      const res = await fetch(`/locations/${locationId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          comment: newReviewText,
          accessibilityRating,
          locationId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add review");

      setReviews((prev) => [...prev, data.review || data]);
      setNewReviewText("");
      setAccessibilityRating(0);
    } catch (err) {
      console.error("Submit review failed:", err);
    }
  };

  return (
    <div className="mb-4 space-y-2">
      <textarea
        className="w-full border border-gray-300 rounded-lg p-3 text-sm"
        placeholder="Write your review..."
        value={newReviewText}
        onChange={(e) => setNewReviewText(e.target.value)}
      />
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => setAccessibilityRating(num)}
            className={
              num <= accessibilityRating ? "text-yellow-500" : "text-gray-300"
            }
          >
            <FaStar />
          </button>
        ))}
        <span className="text-xs text-gray-600 ml-2">Accessibility Rating</span>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-[#216a78] text-white px-5 py-2 rounded-md hover:bg-[#1b5a65]"
      >
        Post Review
      </button>
    </div>
  );
}