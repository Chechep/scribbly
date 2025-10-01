// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { updateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Profile({ onUserUpdate }) {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        setDisplayName(u.displayName || "");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleNameUpdate = async () => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName });
      setEditingName(false);
      setMessage("Display name updated!");
      if (onUserUpdate) onUserUpdate({ ...user, displayName }); // Update navbar
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setMessage("Please fill both password fields.");
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Password updated successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>
          Please <Link to="/login" className="text-rose-500 hover:underline">login</Link> to view profile.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-rose-100 to-rose-300 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900/80 backdrop-blur-md p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-handwritten text-rose-700 dark:text-rose-300 mb-6">
          Profile
        </h1>

        {/* Inline Editable Display Name */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Display Name</label>
          <div className="flex items-center gap-2">
            {editingName ? (
              <>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-800 dark:text-gray-200"
                />
                <button
                  onClick={handleNameUpdate}
                  className="px-3 py-1 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingName(false)}
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-700 dark:text-gray-200">{displayName || "User"}</span>
                <button
                  onClick={() => setEditingName(true)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>

        {/* Password Update */}
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-800 dark:text-gray-200"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                {showCurrent ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-800 dark:text-gray-200"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                {showNew ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition font-semibold"
          >
            Update Password
          </button>
        </form>

        {message && <p className="mt-2 text-center text-gray-700 dark:text-gray-200">{message}</p>}

        {/* User Info */}
        <div className="mt-6">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>UID:</strong> {user.uid}</p>
        </div>

        {/* Link to Drafts & Blogs */}
        <div className="mt-6 space-y-2">
          <Link to="/profile#blogs" className="block text-rose-500 hover:underline">My Blogs</Link>
          <Link to="/profile#drafts" className="block text-rose-500 hover:underline">Drafts</Link>
        </div>
      </div>
    </div>
  );
}
