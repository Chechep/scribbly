// src/utils/posts.js
export const savePost = (postData) => {
    try {
      const posts = getPosts();
      const newPost = {
        ...postData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      const updatedPosts = [newPost, ...posts];
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      return newPost.id;
    } catch (error) {
      throw new Error('Failed to save post');
    }
  };
  
  export const getPosts = () => {
    try {
      const posts = localStorage.getItem('blogPosts');
      return posts ? JSON.parse(posts) : [];
    } catch (error) {
      return [];
    }
  };
  
  export const getPostsByUser = (userId) => {
    try {
      const posts = getPosts();
      return posts.filter(post => post.authorId === userId)
                 .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      return [];
    }
  };
  
  export const deletePost = (postId) => {
    try {
      const posts = getPosts();
      const updatedPosts = posts.filter(post => post.id !== postId);
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      return true;
    } catch (error) {
      throw new Error('Failed to delete post');
    }
  };
  
  // Convert File object to base64 for storage
  export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };