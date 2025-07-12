import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import SubmitPage from "./pages/SubmitPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import EditUser from "./pages/EditUser";
import TermsPage from "./pages/TermsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ContactPage from "./pages/ContactPage";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import { LoggedInUserProvider } from "./contexts/LoggedInUserContext";

function App() {
  return (
    <LoggedInUserProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<HomePage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/termspage" element={<TermsPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit-profile" element={<EditUser />} />{" "}
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </LoggedInUserProvider>
  );
}

export default App;
