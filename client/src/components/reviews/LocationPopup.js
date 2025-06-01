import React, { useEffect, useState } from "react";
import ReviewItem from "./ReviewItem.js";
import ReviewForm from "./ReviewForm.js";

export default function LocationPopup({ locationId, user }) {
  const [reviews, setReviews] = useState([]);
  const [showSignInMessageFor, setShowSignInMessageFor] = useState(null);

  useEffect(() => {
    if (!locationId) return;

    fetch(`/locations/${locationId}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        const normalized = data.map((r) => ({
          ...r,
          likes: Number(r.likes?.$numberInt || r.likes || 0),
          likedBy: r.likedBy || [],
          replies: r.replies || [],
          createdAt: r.createdAt?.$date?.$numberLong
            ? Number(r.createdAt.$date.$numberLong)
            : Date.now(),
        }));
        setReviews(normalized);
      })
      .catch((err) => console.error("Failed to fetch reviews", err));
  }, [locationId]);

  return (
    <div className="mt-6 space-y-6 text-[#202254]">
      <h3 className="text-xl font-display tracking-wide text-[#216a78]">
        Reviews
      </h3>

      {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}

      {reviews.map((review) => (
        <ReviewItem
          key={review._id}
          review={review}
          user={user}
          showSignInMessageFor={showSignInMessageFor}
          setShowSignInMessageFor={setShowSignInMessageFor}
          setReviews={setReviews}
          reviews={reviews}
        />
      ))}

      {user ? (
        <ReviewForm locationId={locationId} setReviews={setReviews} />
      ) : (
        <p className="text-sm text-gray-600">Sign in to leave a review.</p>
      )}
    </div>
  );
}
