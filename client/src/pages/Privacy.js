import React from "react";

const Privacy = () => {
  return (
    // Container for the privacy policy page 
    <div className="min-h-screen bg-darkbg text-light px-6 py-16 max-w-3xl mx-auto font-slab">
      <h1 className="text-primary text-5xl mb-8 border-b-4 border-primary pb-2">
        Privacy Policy
      </h1>

      <p className="text-xl leading-relaxed mb-6">
        Your privacy is very important to us. We are committed to protecting
        your personal information and being transparent about how we use it.
      </p>

      <p className="text-xl leading-relaxed mb-6">
        We collect minimal data to improve your experience and never share it
        with third parties without your consent.
      </p>

      <p className="text-xl leading-relaxed">
        If you have any questions about how we handle your data, please contact
        us.
      </p>
    </div>
  );
};

export default Privacy;