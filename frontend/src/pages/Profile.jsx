// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { updateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { 
  Eye, 
  EyeOff, 
  Calendar, 
  Heart, 
  MessageCircle, 
  Trash2, 
  Edit3, 
  Bookmark,
  Bell,
  Settings,
  FileText,
  BookOpen,
  LogOut,
  Plus
} from "lucide-react";
import { getPostsByUser, getDraftsByUser, deletePost, deleteDraft, publishDraft } from "../utils/posts";
import PostCard from "../components/PostCard";

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
  const [drafts, setDrafts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("blogs");
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        setDisplayName(u.displayName || "");
        await loadUserData(u.uid);
        checkNewNotifications(u.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserData = async (userId) => {
    try {
      setLoading(true);
      const userPosts = getPostsByUser(userId);
      const userDrafts = getDraftsByUser(userId);
      const userBookmarks = getBookmarks();
      
      setPosts(userPosts);
      setDrafts(userDrafts);
      setBookmarks(userBookmarks);
    } catch (error) {
      console.error("Error loading user data:", error);
      setMessage("Error loading your data");
    } finally {
      setLoading(false);
    }
  };

  const getBookmarks = () => {
    try {
      const allPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      const bookmarkedPosts = allPosts.filter(post => {
        const postData = JSON.parse(localStorage.getItem(`post-${post.id}`) || '{}');
        return postData.bookmarked;
      });
      return bookmarkedPosts;
    } catch (error) {
      return [];
    }
  };

  const checkNewNotifications = (userId) => {
    const lastLogin = localStorage.getItem('lastLogin');
    const now = new Date().toISOString();
    
    if (!lastLogin) {
      addNotification('Welcome to your blog! Start by writing your first post.', 'welcome');
    } else {
      const posts = getPostsByUser(userId);
      let newInteractions = 0;
      
      posts.forEach(post => {
        const postData = JSON.parse(localStorage.getItem(`post-${post.id}`) || '{}');
        if (postData.lastInteraction && new Date(postData.lastInteraction) > new Date(lastLogin)) {
          newInteractions++;
        }
      });
      
      if (newInteractions > 0) {
        addNotification(`You have ${newInteractions} new interactions on your posts!`, 'interaction');
      }
    }
    
    localStorage.setItem('lastLogin', now);
  };

  const addNotification = (message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const markNotificationAsRead = (id) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.setItem('notifications', '[]');
  };

  const handleNameUpdate = async () => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName });
      setEditingName(false);
      setMessage("Display name updated successfully!");
      if (onUserUpdate) onUserUpdate({ ...user, displayName });
      
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

  const handleDeleteDraft = async (draftId) => {
    if (!window.confirm("Are you sure you want to delete this draft?")) return;
    
    try {
      await deleteDraft(draftId);
      setDrafts(prevDrafts => prevDrafts.filter(draft => draft.id !== draftId));
      setMessage("Draft deleted successfully!");
    } catch (error) {
      setMessage("Error deleting draft");
    }
  };

  const handlePublishDraft = async (draftId) => {
    try {
      await publishDraft(draftId);
      await loadUserData(user.uid);
      setMessage("Draft published successfully!");
    } catch (error) {
      setMessage("Error publishing draft");
    }
  };

  const handleEditDraft = (draft) => {
    localStorage.setItem('editingPost', JSON.stringify(draft));
    navigate('/write?edit=true');
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      setMessage("Error signing out");
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 relative"
              >
                <Bell size={24} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-semibold">Notifications</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-sm text-rose-500 hover:text-rose-600"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No notifications
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 dark:border-gray-700 ${
                            !notification.read ? 'bg-rose-50 dark:bg-rose-900/20' : ''
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(notification.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/write"
              className="flex items-center space-x-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold transition-colors"
            >
              <Plus size={20} />
              <span>New Post</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400"
              title="Sign Out"
            >
              <LogOut size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-r from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  {displayName?.charAt(0) || 'U'}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {displayName || "User"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Posts</span>
                  <span className="font-semibold">{posts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Drafts</span>
                  <span className="font-semibold">{drafts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Bookmarks</span>
                  <span className="font-semibold">{bookmarks.length}</span>
                </div>
              </div>

              <button
                onClick={() => setEditingName(true)}
                className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>

            {/* Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("blogs")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "blogs"
                      ? "bg-rose-500 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <BookOpen size={20} />
                  <span>My Blogs</span>
                </button>
                <button
                  onClick={() => setActiveTab("drafts")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "drafts"
                      ? "bg-rose-500 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <FileText size={20} />
                  <span>Drafts</span>
                </button>
                <button
                  onClick={() => setActiveTab("bookmarks")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "bookmarks"
                      ? "bg-rose-500 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Bookmark size={20} />
                  <span>Bookmarks</span>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === "settings"
                      ? "bg-rose-500 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Edit Name Modal */}
            {editingName && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Edit Display Name</h3>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your display name"
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingName(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleNameUpdate}
                      className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('Error') || message.includes('Failed') 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
              }`}>
                {message}
              </div>
            )}

            {/* Content Sections */}
            {activeTab === "settings" ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Account Settings</h3>
                
                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrent ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white"
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
              </div>
            ) : (
              <div className="space-y-6">
                {/* Blogs Tab */}
                {activeTab === "blogs" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-semibold">My Blogs ({posts.length})</h3>
                    </div>

                    {loading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading posts...</p>
                      </div>
                    ) : posts.length === 0 ? (
                      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                        <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                        <h4 className="text-lg font-semibold mb-2">No posts yet</h4>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Start sharing your stories with the world!</p>
                        <Link
                          to="/write"
                          className="inline-flex items-center px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold transition-colors"
                        >
                          <Plus size={20} className="mr-2" />
                          Write Your First Post
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {posts.map((post) => (
                          <PostCard
                            key={post.id}
                            post={post}
                            onDelete={handleDeletePost}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Drafts Tab */}
                {activeTab === "drafts" && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">Drafts ({drafts.length})</h3>

                    {drafts.length === 0 ? (
                      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                        <h4 className="text-lg font-semibold mb-2">No drafts</h4>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Start writing and save as draft to see them here.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {drafts.map((draft) => (
                          <PostCard
                            key={draft.id}
                            post={draft}
                            isDraft={true}
                            onEdit={handleEditDraft}
                            onDelete={handleDeleteDraft}
                            onPublish={handlePublishDraft}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Bookmarks Tab */}
                {activeTab === "bookmarks" && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">Bookmarks ({bookmarks.length})</h3>

                    {bookmarks.length === 0 ? (
                      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                        <Bookmark size={48} className="mx-auto text-gray-400 mb-4" />
                        <h4 className="text-lg font-semibold mb-2">No bookmarks yet</h4>
                        <p className="text-gray-500 dark:text-gray-400">Bookmark posts you love to find them easily later.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {bookmarks.map((post) => (
                          <PostCard
                            key={post.id}
                            post={post}
                            showActions={true}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}