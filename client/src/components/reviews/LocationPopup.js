import React, { useEffect, useState } from "react";
import ReviewItem from "./ReviewItem.js";
import ReviewForm from "./ReviewForm.js";
import emailjs from "@emailjs/browser";
import {
  FaHeart,
  FaRegHeart,
  FaFlag,
  FaWheelchair,
  FaSpinner,
} from "react-icons/fa";

// Component that displays reviews and allows interactions (reviewing, favoriting, reporting)
export default function LocationPopup({ locationId, user }) {
  const [reviews, setReviews] = useState([]);
  const [showSignInMessageFor, setShowSignInMessageFor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  // Fetch reviews when locationId changes
  useEffect(() => {
    if (!locationId) return;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/locations/${locationId}/reviews`);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Reviews not found"
              : "Failed to fetch reviews"
          );
        }

        const data = await response.json();
        const normalized = Array.isArray(data) ? data.map(normalizeReview) : [];
        setReviews(normalized);
      } catch (err) {
        console.error("Fetch reviews error:", err);
        setError(err.message);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [locationId]);

  // Normalize review structure to ensure consistent fields
  const normalizeReview = (r) => ({
    ...r,
    accessibilityRating: r.accessibilityRating || 0,
    likes: Number(r.likes?.$numberInt || r.likes || 0),
    likedBy: r.likedBy || [],
    replies: r.replies || [],
    createdAt: r.createdAt?.$date?.$numberLong
      ? Number(r.createdAt.$date.$numberLong)
      : Date.now(),
  });

  // Compute average accessibility rating
  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, r) => sum + (r.accessibilityRating || 0), 0) /
        reviews.length
      ).toFixed(1)
    : null;

  // Handlers to manage review state
  const handleNewReview = (newReview) => {
    setReviews((prev) => [normalizeReview(newReview), ...prev]);
  };

  const handleReviewUpdate = (updatedReview) => {
    setReviews((prev) =>
      prev.map((r) =>
        r._id === updatedReview._id ? normalizeReview(updatedReview) : r
      )
    );
  };

  const handleReviewDelete = (deletedId) => {
    setReviews((prev) => prev.filter((r) => r._id !== deletedId));
  };

  const handleReplyAdded = (updatedReview) => {
    setReviews((prev) =>
      prev.map((r) =>
        r._id === updatedReview._id ? normalizeReview(updatedReview) : r
      )
    );
  };

  const handleReplyDelete = ({ reviewId, replyId }) => {
    setReviews((prev) =>
      prev.map((review) => {
        if (review._id !== reviewId) return review;

        return {
          ...review,
          replies: review.replies.filter((reply) => reply._id !== replyId),
        };
      })
    );
  };

  // Toggle favorite status for a location
  const handleToggleFav = async () => {
    if (!user) {
      alert("Please sign in to favorite locations");
      return;
    }
    try {
      const res = await fetch(`/locations/${locationId}/toggle-favorite`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setIsFavorited(data.favorited);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Send report email via EmailJS
  const handleReport = async () => {
    if (!user) {
      alert("Please sign in to report locations");
      return;
    }

    const reason = prompt("Why do you want to report this location?");
    if (reason === null) return; // Cancelled

    const templateParams = {
      user_email: user.email,
      location_id: locationId,
      reason,
    };

    try {
      // Send report to admin
      await emailjs.send(
        "service_12gtljw",
        "template_6nq57q6",
        templateParams,
        "CuY-EiEipmtc1KoVn"
      );

      // Send confirmation to user
      await emailjs.send(
        "service_12gtljw",
        "template_icpl714",
        templateParams,
        "CuY-EiEipmtc1KoVn"
      );

      alert("Location reported. A confirmation email has been sent to you.");
    } catch (error) {
      console.error("Email error:", error);
      alert("Failed to report location. Try again later.");
    }
  };

  return (
    <div className="relative mt-6 space-y-6 text-[#202254]">
      {/* Favorite and Report buttons */}
      <div className="absolute top-2 right-2 flex gap-3 z-10">
        <button
          onClick={handleToggleFav}
          className="text-[#216a78] hover:text-red-500 transition"
          title={isFavorited ? "Unfavorite" : "Add to favorites"}
        >
          {isFavorited ? (
            <FaHeart className="h-5 w-5" />
          ) : (
            <FaRegHeart className="h-5 w-5" />
          )}
        </button>

        <button
          onClick={handleReport}
          className="text-[#216a78] hover:text-red-600 transition"
          title="Report this location"
        >
          <FaFlag className="h-5 w-5" />
        </button>
      </div>

      {/* Reviews header */}
      <div className="flex items-center gap-4 pt-4">
        <h3 className="text-xl font-display tracking-wide text-[#216a78]">
          Reviews
        </h3>
        {averageRating && (
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
            <span className="font-medium">{averageRating}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <FaWheelchair
                  key={rating}
                  className={`h-4 w-4 ${
                    rating <= Math.round(averageRating)
                      ? "text-blue-600"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-8">
          <FaSpinner className="animate-spin h-8 w-8 text-[#216a78]" />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md">
          Error: {error}
        </div>
      )}

      {/* No reviews */}
      {!loading && !error && reviews.length === 0 && (
        <p className="text-gray-500 py-4">
          No reviews yet. Be the first to review!
        </p>
      )}

      {/* Review list */}
      {!loading && !error && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              user={user}
              showSignInMessageFor={showSignInMessageFor}
              setShowSignInMessageFor={setShowSignInMessageFor}
              onUpdate={handleReviewUpdate}
              onDelete={handleReviewDelete}
              onReplyAdded={handleReplyAdded}
              onReplyDelete={handleReplyDelete}
            />
          ))}
        </div>
      )}

      {/* Review form or sign-in prompt */}
      {user ? (
        <ReviewForm locationId={locationId} onSubmit={handleNewReview} />
      ) : (
        <p className="text-sm text-gray-600 py-2">
          Sign in to leave a review and rate accessibility
        </p>
      )}
    </div>
  );
}
