// src/pages/Profile.jsx (updated)
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { updateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Calendar, Heart, MessageCircle, Trash2, Edit3 } from "lucide-react";
import { getPostsByUser, deletePost } from "../utils/posts";

export default function Profile({ onUserUpdate }) {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("blogs");
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        setDisplayName(u.displayName || "");
        await loadUserPosts(u.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserPosts = async (userId) => {
    try {
      setLoading(true);
      const userPosts = getPostsByUser(userId);
      setPosts(userPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
      setMessage("Error loading your posts");
    } finally {
      setLoading(false);
    }
  };

  const handleNameUpdate = async () => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName });
      setEditingName(false);
      setMessage("Display name updated!");
      if (onUserUpdate) onUserUpdate({ ...user, displayName });
      
      // Update posts with new display name
      updatePostsWithNewName(displayName);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const updatePostsWithNewName = (newName) => {
    const allPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const updatedPosts = allPosts.map(post => {
      if (post.authorId === user.uid) {
        return { ...post, authorName: newName };
      }
      return post;
    });
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    setPosts(getPostsByUser(user.uid));
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

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      setMessage("Post deleted successfully!");
    } catch (error) {
      setMessage("Error deleting post");
    }
  };

  const handleEditPost = (post) => {
    // Navigate to write page with post data for editing
    localStorage.setItem('editingPost', JSON.stringify(post));
    window.location.href = '/write?edit=true';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
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
    <div className="min-h-screen bg-gradient-to-r from-rose-100 to-rose-300 dark:from-gray-900 dark:to-gray-800 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-900/80 backdrop-blur-md p-8 rounded-xl shadow-lg mb-6">
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
          <form onSubmit={handlePasswordUpdate} className="space-y-4 mb-6">
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
                  {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
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
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
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

          {message && (
            <div className={`p-3 rounded-lg mb-4 ${
              message.includes('Error') || message.includes('Failed') 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
            }`}>
              {message}
            </div>
          )}

          {/* User Info */}
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Total Posts:</strong> {posts.length}</p>
            <p><strong>Member since:</strong> {new Date(user.metadata.creationTime).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-lg">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("blogs")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "blogs"
                    ? "border-rose-500 text-rose-600 dark:text-rose-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                My Blogs ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab("drafts")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "drafts"
                    ? "border-rose-500 text-rose-600 dark:text-rose-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Drafts (0)
              </button>
            </nav>
          </div>

          {/* Posts Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading posts...</p>
              </div>
            ) : activeTab === "blogs" ? (
              posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <Edit3 size={48} className="mx-auto mb-3" />
                    <p className="text-lg mb-2">No posts yet</p>
                    <p className="text-sm">Start sharing your stories with the world!</p>
                  </div>
                  <Link
                    to="/write"
                    className="inline-flex items-center px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition font-semibold"
                  >
                    Write Your First Post
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {post.title}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                            title="Edit post"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete post"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                        {post.content.length > 200 
                          ? `${post.content.substring(0, 200)}...` 
                          : post.content
                        }
                      </p>

                      {post.images && post.images.length > 0 && (
                        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                          {post.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Post image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart size={16} />
                            <span>{post.likes || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle size={16} />
                            <span>{post.comments || 0}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs px-2 py-1 bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 rounded-full">
                            {post.images?.length || 0} images
                          </span>
                          <button className="text-rose-500 hover:text-rose-600 font-medium">
                            Read more →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500">
                  <Edit3 size={48} className="mx-auto mb-3" />
                  <p className="text-lg">No drafts yet</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}