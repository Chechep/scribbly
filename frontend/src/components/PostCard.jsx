// src/components/PostCard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Eye, 
  Calendar, 
  User,
  Edit3,
  Trash2,
  Send
} from "lucide-react";

const PostCard = ({ 
  post, 
  onLike, 
  onComment, 
  onDelete, 
  onEdit, 
  onPublish,
  showActions = true,
  isDraft = false 
}) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [bookmarked, setBookmarked] = useState(false);
  const [views, setViews] = useState(post.views || 0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Load interactions from localStorage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(`post-${post.id}`) || '{}');
    setLikes(savedData.likes || post.likes || 0);
    setLiked(savedData.liked || false);
    setComments(savedData.comments || post.comments || []);
    setBookmarked(savedData.bookmarked || false);
    setViews(savedData.views || post.views || 0);
  }, [post.id, post.likes, post.comments, post.views]);

  // Save interactions to localStorage
  useEffect(() => {
    localStorage.setItem(`post-${post.id}`, JSON.stringify({
      likes,
      liked,
      comments,
      bookmarked,
      views
    }));
  }, [likes, liked, comments, bookmarked, views, post.id]);

  const handleLike = () => {
    const newLiked = !liked;
    const newLikes = newLiked ? likes + 1 : likes - 1;
    
    setLiked(newLiked);
    setLikes(newLikes);
    
    // Update last interaction
    const savedData = JSON.parse(localStorage.getItem(`post-${post.id}`) || '{}');
    localStorage.setItem(`post-${post.id}`, JSON.stringify({
      ...savedData,
      likes: newLikes,
      liked: newLiked,
      lastInteraction: new Date().toISOString()
    }));
    
    if (onLike) {
      onLike(post.id, newLikes, newLiked);
    }
  };

  const handleBookmark = () => {
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    
    const savedData = JSON.parse(localStorage.getItem(`post-${post.id}`) || '{}');
    localStorage.setItem(`post-${post.id}`, JSON.stringify({
      ...savedData,
      bookmarked: newBookmarked
    }));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const newComments = [...comments, { 
      id: Date.now(), 
      text: newComment, 
      timestamp: new Date().toISOString()
    }];
    
    setComments(newComments);
    setNewComment("");
    setShowCommentInput(false);
    
    // Update last interaction
    const savedData = JSON.parse(localStorage.getItem(`post-${post.id}`) || '{}');
    localStorage.setItem(`post-${post.id}`, JSON.stringify({
      ...savedData,
      comments: newComments,
      lastInteraction: new Date().toISOString()
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const generateExcerpt = (text, wordLimit = 50) => {
    if (!text) return 'No content yet...';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const excerpt = generateExcerpt(post.content);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-rose-600 rounded-full flex items-center justify-center text-white font-semibold">
              {post.authorName?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {post.authorName || 'Anonymous'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isDraft ? (
              <>
                <button
                  onClick={() => onEdit?.(post)}
                  className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                  title="Edit draft"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => onDelete?.(post.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete draft"
                >
                  <Trash2 size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={handleBookmark}
                className={`p-2 transition-colors ${
                  bookmarked 
                    ? 'text-rose-500' 
                    : 'text-gray-400 hover:text-rose-500'
                }`}
              >
                <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>
        </div>

        {/* Date and Status */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          {isDraft && (
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full">
              Draft
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link to={isDraft ? `/write?edit=${post.id}` : `/post/${post.id}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-rose-500 transition-colors line-clamp-2">
            {post.title || 'Untitled'}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
          {excerpt}
        </p>

        {/* Images Grid */}
        {post.images && post.images.length > 0 && (
          <div className={`mb-4 grid gap-2 ${
            post.images.length === 1 ? 'grid-cols-1' :
            post.images.length === 2 ? 'grid-cols-2' :
            'grid-cols-2'
          }`}>
            {post.images.slice(0, 4).map((image, index) => (
              <div key={index} className={`relative ${
                post.images.length === 3 && index === 0 ? 'col-span-2' : ''
              }`}>
                <img
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                {index === 3 && post.images.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">
                      +{post.images.length - 4} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && !isDraft && (
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  liked 
                    ? 'text-rose-500' 
                    : 'text-gray-500 hover:text-rose-500'
                }`}
              >
                <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                <span className="text-sm font-medium">{likes}</span>
              </button>

              <button
                onClick={() => setShowCommentInput(!showCommentInput)}
                className="flex items-center space-x-2 text-gray-500 hover:text-rose-500 transition-colors"
              >
                <MessageCircle size={20} />
                <span className="text-sm font-medium">{comments.length}</span>
              </button>

              <div className="flex items-center space-x-2 text-gray-500">
                <Eye size={20} />
                <span className="text-sm font-medium">{views}</span>
              </div>
            </div>

            <Link
              to={`/post/${post.id}`}
              className="text-rose-500 hover:text-rose-600 font-semibold text-sm flex items-center space-x-1"
            >
              <span>Read more</span>
            </Link>
          </div>

          {/* Comment Input */}
          {showCommentInput && (
            <div className="mt-4 flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium flex items-center space-x-1"
              >
                <Send size={14} />
                <span>Post</span>
              </button>
            </div>
          )}
        </div>
      )}

      {isDraft && (
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-amber-50 dark:bg-amber-900/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-amber-700 dark:text-amber-300">
              Last updated: {formatDate(post.updatedAt)}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit?.(post)}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm rounded-lg font-medium transition-colors"
              >
                Continue Writing
              </button>
              {onPublish && (
                <button
                  onClick={() => onPublish?.(post.id)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg font-medium transition-colors"
                >
                  Publish
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;