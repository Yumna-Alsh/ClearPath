import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("submissions");
  const [submissions, setSubmissions] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/profile", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = await res.json();
        if (data.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    fetch("/my-submissions", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.submissions) setSubmissions(data.submissions);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/my-reviews", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 font-['Alfa_Slab_One'], sans-serif bg-white text-[#202254] min-h-screen">
      {!user ? (
        <p className="text-center text-[#216a78] italic">Loading profile...</p>
      ) : (
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-full bg-[#216a78] flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-lg"
            aria-label="User avatar"
          >
            {user.username[0]?.toUpperCase()}
          </div>
          <h2 className="text-3xl mt-4">{user.firstName}</h2>
          <p className="text-[#216a78] text-lg">@{user.username}</p>
        </div>
      )}

      <div className="flex justify-center mb-6">
        <Link
          to="/edit-profile"
          className="px-6 py-2 bg-[#202254] text-white rounded-full shadow-md hover:bg-[#216a78] transition"
        >
          Edit Profile
        </Link>
      </div>

      <div className="flex justify-center space-x-8 border-b-2 border-[#216a78] pb-2 mb-6">
        {["submissions", "reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-semibold text-lg pb-1 ${
              activeTab === tab
                ? "border-b-4 border-[#202254] text-[#202254]"
                : "text-[#216a78] hover:text-[#202254]"
            } transition`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "submissions" ? (
          submissions.length === 0 ? (
            <p className="text-center text-[#216a78] italic">
              You have no submissions.
            </p>
          ) : (
            submissions.map((submission) => (
              <div
                key={submission._id}
                className="border border-[#216a78] rounded-lg p-4 mb-4 shadow-sm"
              >
                <p className="mb-1 font-semibold text-[#202254]">
                  {submission.description}
                </p>
                <p className="text-[#216a78] mb-1">
                  <strong>Location Name:</strong> {submission.name}
                </p>
                <p className="text-[#216a78] mb-1">
                  <strong>Address:</strong>{" "}
                  {[
                    submission.address,
                    submission.city,
                    submission.province,
                    submission.postalCode,
                    submission.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="text-[#202254] mb-1">
                  <strong>Comment:</strong> {submission.accessibility}
                </p>
                <p className="text-sm text-[#202254]/70">
                  {new Date(submission.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )
        ) : reviews.length === 0 ? (
          <p className="text-center text-[#216a78] italic">
            You have no reviews.
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="border border-[#216a78] rounded-lg p-4 mb-4 shadow-sm"
            >
              <p className="text-[#202254] mb-1">
                <strong>Username:</strong> {review.user}
              </p>
              <p className="text-[#216a78] mb-1">
                <strong>Rating:</strong> {review.accessibilityRating}
              </p>
              <p className="text-[#202254] mb-1">
                <strong>Comment:</strong> {review.comment}
              </p>
              <p className="text-sm text-[#202254]/70">
                {new Date(review.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
