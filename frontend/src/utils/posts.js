// src/utils/posts.js

// Get all posts from localStorage
export const getPosts = () => {
  try {
    const posts = localStorage.getItem('blogPosts');
    return posts ? JSON.parse(posts) : [];
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
};

// Get all drafts from localStorage
export const getDrafts = () => {
  try {
    const drafts = localStorage.getItem('blogDrafts');
    return drafts ? JSON.parse(drafts) : [];
  } catch (error) {
    console.error('Error getting drafts:', error);
    return [];
  }
};

// Save a new post
export const savePost = (postData) => {
  try {
    const posts = getPosts();
    const newPost = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published',
      likes: postData.likes || 0,
      comments: postData.comments || [],
      views: postData.views || 0
    };
    
    const updatedPosts = [newPost, ...posts];
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    return newPost.id;
  } catch (error) {
    console.error('Error saving post:', error);
    throw new Error('Failed to save post');
  }
};

// Save a new draft
export const saveDraft = (postData) => {
  try {
    const drafts = getDrafts();
    const newDraft = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      likes: 0,
      comments: [],
      views: 0
    };
    
    const updatedDrafts = [newDraft, ...drafts];
    localStorage.setItem('blogDrafts', JSON.stringify(updatedDrafts));
    return newDraft.id;
  } catch (error) {
    console.error('Error saving draft:', error);
    throw new Error('Failed to save draft');
  }
};

// Update an existing post
export const updatePost = (postId, updatedData) => {
  try {
    const posts = getPosts();
    const updatedPosts = posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            ...updatedData, 
            updatedAt: new Date().toISOString(),
            id: postId // Ensure ID doesn't change
          }
        : post
    );
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    return true;
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post');
  }
};

// Update an existing draft
export const updateDraft = (draftId, updatedData) => {
  try {
    const drafts = getDrafts();
    const updatedDrafts = drafts.map(draft => 
      draft.id === draftId 
        ? { 
            ...draft, 
            ...updatedData, 
            updatedAt: new Date().toISOString(),
            id: draftId // Ensure ID doesn't change
          }
        : draft
    );
    localStorage.setItem('blogDrafts', JSON.stringify(updatedDrafts));
    return true;
  } catch (error) {
    console.error('Error updating draft:', error);
    throw new Error('Failed to update draft');
  }
};

// Get posts by specific user
export const getPostsByUser = (userId) => {
  try {
    const posts = getPosts();
    return posts
      .filter(post => post.authorId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting user posts:', error);
    return [];
  }
};

// Get drafts by specific user
export const getDraftsByUser = (userId) => {
  try {
    const drafts = getDrafts();
    return drafts
      .filter(draft => draft.authorId === userId)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  } catch (error) {
    console.error('Error getting user drafts:', error);
    return [];
  }
};

// Delete a post
export const deletePost = (postId) => {
  try {
    const posts = getPosts();
    const updatedPosts = posts.filter(post => post.id !== postId);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    
    // Also remove any interactions for this post
    localStorage.removeItem(`post-${postId}`);
    
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
};

// Delete a draft
export const deleteDraft = (draftId) => {
  try {
    const drafts = getDrafts();
    const updatedDrafts = drafts.filter(draft => draft.id !== draftId);
    localStorage.setItem('blogDrafts', JSON.stringify(updatedDrafts));
    return true;
  } catch (error) {
    console.error('Error deleting draft:', error);
    throw new Error('Failed to delete draft');
  }
};

// Publish a draft (convert draft to post)
export const publishDraft = (draftId) => {
  try {
    const drafts = getDrafts();
    const draft = drafts.find(d => d.id === draftId);
    
    if (!draft) {
      throw new Error('Draft not found');
    }
    
    // Create post data from draft
    const postData = {
      title: draft.title,
      content: draft.content,
      images: draft.images || [],
      authorId: draft.authorId,
      authorName: draft.authorName,
      authorEmail: draft.authorEmail,
      likes: 0,
      comments: [],
      views: 0,
      status: 'published'
    };
    
    // Save to posts
    const postId = savePost(postData);
    
    // Remove from drafts
    deleteDraft(draftId);
    
    return postId;
  } catch (error) {
    console.error('Error publishing draft:', error);
    throw new Error('Failed to publish draft');
  }
};

// Get bookmarked posts
export const getBookmarks = () => {
  try {
    const allPosts = getPosts();
    const bookmarkedPosts = allPosts.filter(post => {
      const postData = JSON.parse(localStorage.getItem(`post-${post.id}`) || '{}');
      return postData.bookmarked === true;
    });
    return bookmarkedPosts;
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
};

// Get a single post by ID
export const getPostById = (postId) => {
  try {
    const posts = getPosts();
    return posts.find(post => post.id === postId);
  } catch (error) {
    console.error('Error getting post by ID:', error);
    return null;
  }
};

// Get a single draft by ID
export const getDraftById = (draftId) => {
  try {
    const drafts = getDrafts();
    return drafts.find(draft => draft.id === draftId);
  } catch (error) {
    console.error('Error getting draft by ID:', error);
    return null;
  }
};

// Get all posts (published) for homepage
export const getAllPosts = () => {
  try {
    const posts = getPosts();
    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
};

// Get popular posts (by likes)
export const getPopularPosts = (limit = 5) => {
  try {
    const posts = getPosts();
    return posts
      .sort((a, b) => {
        const aLikes = JSON.parse(localStorage.getItem(`post-${a.id}`) || '{}').likes || a.likes || 0;
        const bLikes = JSON.parse(localStorage.getItem(`post-${b.id}`) || '{}').likes || b.likes || 0;
        return bLikes - aLikes;
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting popular posts:', error);
    return [];
  }
};

// Get recent posts
export const getRecentPosts = (limit = 5) => {
  try {
    const posts = getPosts();
    return posts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting recent posts:', error);
    return [];
  }
};

// Search posts by title or content
export const searchPosts = (query) => {
  try {
    const posts = getPosts();
    const lowercaseQuery = query.toLowerCase();
    
    return posts.filter(post => 
      post.title?.toLowerCase().includes(lowercaseQuery) ||
      post.content?.toLowerCase().includes(lowercaseQuery) ||
      post.authorName?.toLowerCase().includes(lowercaseQuery)
    );
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
};

// Get posts by category (if you add categories later)
export const getPostsByCategory = (category) => {
  try {
    const posts = getPosts();
    return posts.filter(post => post.category === category);
  } catch (error) {
    console.error('Error getting posts by category:', error);
    return [];
  }
};

// Get post statistics
export const getPostStats = (postId) => {
  try {
    const postData = JSON.parse(localStorage.getItem(`post-${postId}`) || '{}');
    return {
      likes: postData.likes || 0,
      comments: postData.comments || [],
      bookmarked: postData.bookmarked || false,
      views: postData.views || 0
    };
  } catch (error) {
    console.error('Error getting post stats:', error);
    return {
      likes: 0,
      comments: [],
      bookmarked: false,
      views: 0
    };
  }
};

// Update post interactions (likes, comments, views)
export const updatePostInteractions = (postId, interactionData) => {
  try {
    const currentData = JSON.parse(localStorage.getItem(`post-${postId}`) || '{}');
    const updatedData = {
      ...currentData,
      ...interactionData,
      lastInteraction: new Date().toISOString()
    };
    
    localStorage.setItem(`post-${postId}`, JSON.stringify(updatedData));
    return updatedData;
  } catch (error) {
    console.error('Error updating post interactions:', error);
    throw new Error('Failed to update post interactions');
  }
};

// Like a post
export const likePost = (postId) => {
  try {
    const currentData = JSON.parse(localStorage.getItem(`post-${postId}`) || '{}');
    const currentLikes = currentData.likes || 0;
    const isLiked = currentData.liked || false;
    
    const updatedData = {
      ...currentData,
      likes: isLiked ? currentLikes - 1 : currentLikes + 1,
      liked: !isLiked,
      lastInteraction: new Date().toISOString()
    };
    
    localStorage.setItem(`post-${postId}`, JSON.stringify(updatedData));
    return updatedData;
  } catch (error) {
    console.error('Error liking post:', error);
    throw new Error('Failed to like post');
  }
};

// Bookmark a post
export const bookmarkPost = (postId) => {
  try {
    const currentData = JSON.parse(localStorage.getItem(`post-${postId}`) || '{}');
    const isBookmarked = currentData.bookmarked || false;
    
    const updatedData = {
      ...currentData,
      bookmarked: !isBookmarked,
      lastInteraction: new Date().toISOString()
    };
    
    localStorage.setItem(`post-${postId}`, JSON.stringify(updatedData));
    return updatedData;
  } catch (error) {
    console.error('Error bookmarking post:', error);
    throw new Error('Failed to bookmark post');
  }
};

// Add comment to post
export const addComment = (postId, commentText) => {
  try {
    const currentData = JSON.parse(localStorage.getItem(`post-${postId}`) || '{}');
    const currentComments = currentData.comments || [];
    
    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      timestamp: new Date().toISOString(),
      author: 'You' // Since we're using localStorage, we'll just show "You"
    };
    
    const updatedData = {
      ...currentData,
      comments: [newComment, ...currentComments],
      lastInteraction: new Date().toISOString()
    };
    
    localStorage.setItem(`post-${postId}`, JSON.stringify(updatedData));
    return updatedData;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment');
  }
};

// Increment post views
export const incrementViews = (postId) => {
  try {
    const currentData = JSON.parse(localStorage.getItem(`post-${postId}`) || '{}');
    const currentViews = currentData.views || 0;
    
    const updatedData = {
      ...currentData,
      views: currentViews + 1,
      lastInteraction: new Date().toISOString()
    };
    
    localStorage.setItem(`post-${postId}`, JSON.stringify(updatedData));
    return updatedData;
  } catch (error) {
    console.error('Error incrementing views:', error);
    throw new Error('Failed to increment views');
  }
};

// Get user statistics
export const getUserStats = (userId) => {
  try {
    const userPosts = getPostsByUser(userId);
    const userDrafts = getDraftsByUser(userId);
    const bookmarks = getBookmarks();
    
    let totalLikes = 0;
    let totalComments = 0;
    let totalViews = 0;
    
    userPosts.forEach(post => {
      const postData = JSON.parse(localStorage.getItem(`post-${post.id}`) || '{}');
      totalLikes += postData.likes || 0;
      totalComments += (postData.comments || []).length;
      totalViews += postData.views || 0;
    });
    
    return {
      totalPosts: userPosts.length,
      totalDrafts: userDrafts.length,
      totalBookmarks: bookmarks.length,
      totalLikes,
      totalComments,
      totalViews
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return {
      totalPosts: 0,
      totalDrafts: 0,
      totalBookmarks: 0,
      totalLikes: 0,
      totalComments: 0,
      totalViews: 0
    };
  }
};

// Export all data (for backup)
export const exportData = () => {
  try {
    const posts = getPosts();
    const drafts = getDrafts();
    const interactions = {};
    
    // Get all interaction data
    posts.forEach(post => {
      const postData = localStorage.getItem(`post-${post.id}`);
      if (postData) {
        interactions[post.id] = JSON.parse(postData);
      }
    });
    
    return {
      posts,
      drafts,
      interactions,
      exportDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
};

// Import data (for restore)
export const importData = (data) => {
  try {
    if (data.posts) {
      localStorage.setItem('blogPosts', JSON.stringify(data.posts));
    }
    
    if (data.drafts) {
      localStorage.setItem('blogDrafts', JSON.stringify(data.drafts));
    }
    
    if (data.interactions) {
      Object.keys(data.interactions).forEach(postId => {
        localStorage.setItem(`post-${postId}`, JSON.stringify(data.interactions[postId]));
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Failed to import data');
  }
};

// Clear all data (reset)
export const clearAllData = () => {
  try {
    localStorage.removeItem('blogPosts');
    localStorage.removeItem('blogDrafts');
    
    // Clear all interaction data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('post-')) {
        localStorage.removeItem(key);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    throw new Error('Failed to clear data');
  }
};

// File to Base64 conversion for images
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Validate post data
export const validatePostData = (postData) => {
  const errors = [];
  
  if (!postData.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!postData.content?.trim()) {
    errors.push('Content is required');
  }
  
  if (postData.title && postData.title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }
  
  if (postData.content && postData.content.length > 5000) {
    errors.push('Content must be less than 5000 characters');
  }
  
  if (postData.images && postData.images.length > 4) {
    errors.push('Maximum 4 images allowed');
  }
  
  return errors;
};

// Generate excerpt from content
export const generateExcerpt = (content, wordLimit = 50) => {
  if (!content) return '';
  const words = content.split(' ');
  if (words.length <= wordLimit) return content;
  return words.slice(0, wordLimit).join(' ') + '...';
};

// Format date for display
export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (options.relative) {
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}w ago`;
  }
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    ...options
  });
};

// Initialize sample data (for first-time users)
export const initializeSampleData = () => {
  try {
    const existingPosts = getPosts();
    const existingDrafts = getDrafts();
    
    if (existingPosts.length === 0 && existingDrafts.length === 0) {
      const samplePosts = [
        {
          id: 'sample-1',
          title: 'Welcome to Your Blog!',
          content: 'This is your first post. You can edit it or delete it and start writing your own stories. The blogging platform allows you to create beautiful posts with images, manage drafts, and interact with your readers through likes and comments.',
          images: [],
          authorId: 'system',
          authorName: 'System',
          authorEmail: 'system@blog.com',
          likes: 5,
          comments: [
            { id: '1', text: 'Great platform!', timestamp: new Date().toISOString(), author: 'Reader' }
          ],
          views: 10,
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      localStorage.setItem('blogPosts', JSON.stringify(samplePosts));
      
      // Initialize interactions for sample post
      localStorage.setItem('post-sample-1', JSON.stringify({
        likes: 5,
        liked: false,
        comments: samplePosts[0].comments,
        bookmarked: false,
        views: 10,
        lastInteraction: new Date().toISOString()
      }));
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};

// Call initialize on import
initializeSampleData();