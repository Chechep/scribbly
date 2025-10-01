import { FaInstagram, FaTwitter, FaFacebook, FaEnvelope } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-gradient-to-l from-rose-100 to-rose-300 dark:from-black dark:to-black text-white p-8 transition-colors duration-500">
    <div className="container mx-auto text-center space-y-4">
      {/* Social Icons */}
      <div className="flex justify-center gap-6 text-rose-500">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition">
          <FaInstagram size={24} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition">
          <FaTwitter size={24} />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition">
          <FaFacebook size={24} />
        </a>
        <a href="mailto:contact@scribbly.com" className="hover:text-rose-600 transition">
          <FaEnvelope size={24} />
        </a>
      </div>

      {/* Spacing */}
      <div className="h-2"></div>

      {/* Copyright Text */}
      <p className="text-gray-900 dark:text-gray-200">&copy; 2025 Scribbly. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
