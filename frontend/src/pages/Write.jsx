// src/pages/Write.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { 
  X, 
  Image, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Upload,
  Edit3,
  Save,
  Send
} from "lucide-react";
import { savePost, saveDraft, updateDraft, updatePost, fileToBase64 } from "../utils/posts";

export default function Write({ user }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editMode, setEditMode] = useState('');

  const steps = [
    { id: 1, name: "Title" },
    { id: 2, name: "Content" },
    { id: 3, name: "Images" },
    { id: 4, name: "Review" }
  ];

  useEffect(() => {
    // Check if we're editing an existing post or draft
    const editingPost = localStorage.getItem('editingPost');
    const isEditParam = searchParams.get('edit');
    
    if (editingPost || isEditParam) {
      const post = JSON.parse(editingPost);
      setTitle(post.title || "");
      setContent(post.content || "");
      setImages(post.images?.map((img, index) => ({
        id: `img-${index}-${Date.now()}`,
        url: img,
        file: null
      })) || []);
      setEditingPostId(post.id);
      setIsEditing(true);
      setEditMode(post.status || 'draft');
      
      if (editingPost) {
        localStorage.removeItem('editingPost');
      }
    }

    // Check authentication
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        toast.error("Please log in to write a post");
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate, searchParams]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 4) {
      toast.error("You can only upload up to 4 images");
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload only image files");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          file: file
        }]);
      };
      reader.onerror = () => {
        toast.error("Failed to load image");
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const nextStep = () => {
    if (currentStep === 1 && !title.trim()) {
      toast.error("Please enter a title before continuing");
      return;
    }
    if (currentStep === 2 && !content.trim()) {
      toast.error("Please write some content before continuing");
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = async () => {
    if (!title && !content) {
      toast.error("Please add some content before saving as draft");
      return;
    }

    setIsSavingDraft(true);
    
    try {
      const imageBase64s = [];
      for (const image of images) {
        if (image.file) {
          const base64 = await fileToBase64(image.file);
          imageBase64s.push(base64);
        } else {
          imageBase64s.push(image.url);
        }
      }

      const draftData = {
        title: title.trim(),
        content: content.trim(),
        images: imageBase64s,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorEmail: user.email,
      };

      if (isEditing && editingPostId) {
        if (editMode === 'draft') {
          await updateDraft(editingPostId, draftData);
        } else {
          await updatePost(editingPostId, draftData);
        }
        toast.success("Draft updated successfully!");
      } else {
        await saveDraft(draftData);
        toast.success("Draft saved successfully!");
      }

      navigate("/profile");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePublish = async () => {
    if (!title || !content) {
      toast.error("Please complete all required fields");
      return;
    }

    if (!user) {
      toast.error("Please log in to publish a post");
      navigate("/login");
      return;
    }

    setIsPublishing(true);
    
    try {
      const imageBase64s = [];
      for (const image of images) {
        if (image.file) {
          const base64 = await fileToBase64(image.file);
          imageBase64s.push(base64);
        } else {
          imageBase64s.push(image.url);
        }
      }

      const postData = {
        title: title.trim(),
        content: content.trim(),
        images: imageBase64s,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorEmail: user.email,
        likes: 0,
        comments: 0,
        views: 0
      };

      if (isEditing && editingPostId) {
        if (editMode === 'draft') {
          // Convert draft to published post
          await savePost(postData);
          await deleteDraft(editingPostId);
        } else {
          await updatePost(editingPostId, postData);
        }
        toast.success(`"${title}" updated successfully!`);
      } else {
        await savePost(postData);
        toast.success(`"${title}" published successfully!`);
      }
      
      resetForm();
      
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
      
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImages([]);
    setCurrentStep(1);
    setIsEditing(false);
    setEditingPostId(null);
    setEditMode('');
  };

  const handleCancel = () => {
    if (title || content || images.length > 0) {
      if (window.confirm("Are you sure you want to cancel? Your changes will be lost.")) {
        resetForm();
        navigate("/profile");
      }
    } else {
      navigate("/profile");
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Post Title *
            </label>
            <input
              type="text"
              placeholder="What's your story about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-lg border rounded-lg text-gray-900 dark:text-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
              maxLength={100}
              autoFocus
            />
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>This will be the headline of your story</span>
              <span>{title.length}/100</span>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Story *
            </label>
            <textarea
              placeholder="Start writing your amazing story... Share your thoughts, experiences, or knowledge with the world."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border rounded-lg text-gray-900 dark:text-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              maxLength={5000}
              autoFocus
            />
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Write from your heart 💖</span>
              <span>{content.length}/5000</span>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Add Images (Optional)
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg shadow-md"
                    />
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                
                {images.length < 4 && (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-rose-500 transition-colors duration-200 group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="text-center">
                      <Upload size={24} className="mx-auto text-gray-400 group-hover:text-rose-500 mb-2" />
                      <span className="text-sm text-gray-500 group-hover:text-rose-500">Add Image</span>
                      <p className="text-xs text-gray-400 mt-1">Up to {4 - images.length} more</p>
                    </div>
                  </label>
                )}
              </div>

              {images.length < 4 && (
                <div className="md:hidden">
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-rose-500 transition-colors duration-200">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Plus size={20} className="text-gray-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">Upload Images</span>
                  </label>
                </div>
              )}
            </div>

            <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Image size={18} className="text-rose-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-rose-700 dark:text-rose-300">
                  <p className="font-medium">Image Tips</p>
                  <ul className="mt-1 space-y-1">
                    <li>• You can add up to 4 images</li>
                    <li>• Supported formats: JPG, PNG, GIF</li>
                    <li>• Maximum file size: 5MB per image</li>
                    <li>• Images make your story more engaging!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-xl mb-3 text-gray-900 dark:text-gray-100">
                {title || "Untitled"}
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {content}
                </p>
              </div>
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {images.map((image, index) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg shadow-sm"
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">💫</span>
                  </div>
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium">Ready to share your story with the world?</p>
                  <p className="mt-1">Your post will be visible on your profile and can be viewed by others.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-l from-rose-100 to-rose-300 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-l from-rose-100 to-rose-300 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Cancel"
                >
                  <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {isEditing ? "Edit Your Story" : "Write Your Story"}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isEditing ? "Update your existing post" : "Share your thoughts with the world"}
                  </p>
                </div>
              </div>
              
              {isEditing && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <Edit3 size={16} className="text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    {editMode === 'draft' ? 'Editing Draft' : 'Editing Post'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      currentStep >= step.id
                        ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-all duration-300 ${
                        currentStep > step.id 
                          ? "bg-rose-500" 
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              {steps.map(step => (
                <span 
                  key={step.id}
                  className={currentStep === step.id ? "text-rose-500 font-medium" : ""}
                >
                  {step.name}
                </span>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6">
            {getStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
              >
                <ArrowLeft size={18} className="mr-2" />
                Previous
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                  className="flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <Save size={18} className="mr-2" />
                  {isSavingDraft ? "Saving..." : "Save Draft"}
                </button>

                {currentStep < steps.length ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40"
                  >
                    Next Step
                    <ArrowRight size={18} className="ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="flex items-center px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 disabled:cursor-not-allowed"
                  >
                    {isPublishing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isEditing ? "Updating..." : "Publishing..."}
                      </>
                    ) : (
                      <>
                        {isEditing ? "Update Story" : "Publish Story"}
                        <Send size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-rose-500">{title.length}/100</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Title Length</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-rose-500">{content.length}/5000</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Content Length</div>
          </div>
          <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-rose-500">{images.length}/4</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Images Added</div>
          </div>
        </div>
      </div>
    </div>
  );
}