import React, { useState } from "react";
import { FaWheelchair } from "react-icons/fa";

/**
 * ReviewForm component allows users to submit a review with a rating and comment.
 * Uses wheelchair icons as a visual metaphor for accessibility rating.
 */
export default function ReviewForm({ locationId, onSubmit }) {
  const [comment, setComment] = useState(""); 
  const [rating, setRating] = useState(0); 
  const [hover, setHover] = useState(0); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/locations/${locationId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({
          comment,
          accessibilityRating: rating,
        }),
      });

      const newReview = await res.json();
      onSubmit(newReview); // Notify parent component with new review
      setComment(""); // Reset comment input
      setRating(0); // Reset rating
    } catch (err) {
      console.error("Review submission error:", err); // Log submission error
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Rating selection using wheelchair icons */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((wheelchair) => (
          <button
            type="button"
            key={wheelchair}
            onClick={() => setRating(wheelchair)} // Set selected rating
            onMouseEnter={() => setHover(wheelchair)} // Highlight on hover
            onMouseLeave={() => setHover(0)} // Clear hover on leave
            className="text-2xl"
          >
            <FaWheelchair
              className={`
                ${
                  wheelchair <= (hover || rating)
                    ? "text-blue-600" // Highlighted icon
                    : "text-gray-300" // Default icon
                }
                transition-colors
              `}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? `${rating}/5` : "Rate accessibility"}
        </span>
      </div>

      {/* Comment input field */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)} // Update comment state
        placeholder="Write your review..."
        className="w-full border rounded p-2"
        required // Ensure input is not empty
      />

      {/* Submit button with loading and validation states */}
      <button
        type="submit"
        disabled={!comment.trim() || rating === 0 || isSubmitting} // Disable if incomplete or submitting
        className={`
          bg-[#216a78] text-white px-4 py-2 rounded
          hover:bg-[#1b5a65]
          ${
            !comment.trim() || rating === 0
              ? "opacity-50 cursor-not-allowed" // Visual cue for disabled state
              : ""
          }
          ${isSubmitting ? "animate-pulse" : ""} // Loading animation
        `}
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}