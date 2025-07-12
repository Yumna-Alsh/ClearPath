import React from "react";
import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-[#202254] font-sans">
      <h1 className="text-3xl font-bold mb-6 text-[#216a78]">Terms of Use</h1>
      
      <p className="mb-4">
        Welcome to ClearPath. By accessing or using our platform, you agree to
        be bound by these Terms of Use.
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Acceptance of Terms
      </h2>
      <p className="mb-4">
        You must agree to these terms in order to use our services. If you don’t
        agree, please do not use ClearPath.
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. Use of the Platform
      </h2>
      <p className="mb-4">
        You agree to use ClearPath lawfully and responsibly. Do not submit false
        or misleading accessibility information.
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">3. Privacy</h2>
      <p className="mb-4">
        We respect your privacy. Information you provide will be used in
        accordance with our privacy policy.
      </p>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">4. Changes to Terms</h2>
      <p className="mb-4">
        We may update these terms occasionally. Continued use of ClearPath means
        you accept the new terms.
      </p>
      
      <p className="mt-8">
        If you have any questions about these Terms, feel free to{" "}
        <Link
          to="/contact"
          className="text-[#216a78] font-semibold hover:underline"
        >
          contact us
        </Link>
        .
      </p>
    </div>
  );
};

export default TermsPage;

