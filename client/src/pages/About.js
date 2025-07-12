import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-darkbg text-light px-6 py-16 max-w-4xl mx-auto font-slab">
      <h1 className="text-primary text-5xl mb-8 border-b-4 border-primary pb-3">
        About ClearPath
      </h1>

      <p className="text-xl leading-relaxed mb-6">
        ClearPath is a map-based web application designed to empower wheelchair
        users by helping them easily find accessible public places such as
        restaurants, parks, and restrooms. The platform not only displays
        accessible locations on a map but also allows users to submit new
        locations and share their own accessibility ratings.
      </p>

      <p className="text-xl leading-relaxed mb-6">
        This project is close to my heart because I have a family members who
        uses a wheelchair. Often, when planning outings, we find ourselves
        searching extensively to determine if a destination is wheelchair
        accessible. ClearPath aims to simplify this experience and build a
        community-driven resource for accessibility information.
      </p>
    </div>
  );
};

export default About;
