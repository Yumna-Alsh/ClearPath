import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#f0f4f5] text-center text-sm text-[#202254] py-6 mt-12 border-t border-gray-200">
      <div className="space-x-4 mb-2">
        <Link to="/about" className="hover:underline">
          About
        </Link>
        <Link to="/contact" className="hover:underline">
          Contact
        </Link>
        <Link to="/privacy" className="hover:underline">
          Privacy
        </Link>
      </div>
      <p className="text-xs text-gray-500">
        © 2025{" "}
        <span style={{ fontFamily: "AlfaSlabOne-Regular, serif" }}>
          ClearPath
        </span>
        . All rights reserved.
      </p>
    </footer>
  );
}
