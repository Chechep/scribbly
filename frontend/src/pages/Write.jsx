import { useState } from "react";
import toast from "react-hot-toast";
import { X, Image, Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";

export default function Write({ user }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);

  const steps = [
    { id: 1, name: "Title" },
    { id: 2, name: "Content" },
    { id: 3, name: "Images" },
    { id: 4, name: "Review" }
  ];

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

      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          file: file
        }]);
      };
      reader.readAsDataURL(file);
    });
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

  const handlePublish = async () => {
    if (!title || !content) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsPublishing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would normally save the post to your backend/database
      // including uploading images to your storage service
      
      toast.success(`"${title}" published successfully!`);
      
      // Reset form
      setTitle("");
      setContent("");
      setImages([]);
      setCurrentStep(1);
    } catch (error) {
      toast.error("Failed to publish post. Please try again.");
    } finally {
      setIsPublishing(false);
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
            />
            <div className="text-right text-sm text-gray-500">
              {title.length}/100
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
              placeholder="Start writing your amazing story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border rounded-lg text-gray-900 dark:text-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              maxLength={5000}
            />
            <div className="text-right text-sm text-gray-500">
              {content.length}/5000
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Add Images (Optional)
            </label>
            <div className="grid grid-cols-2 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              {images.length < 4 && (
                <label className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-rose-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Plus size={24} className="mx-auto text-gray-400" />
                    <span className="text-sm text-gray-500">Add Image</span>
                  </div>
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500 text-center">
              You can add up to 4 images
            </p>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {content}
              </p>
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {images.map((image) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              <p>Ready to share your story with the world?</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-l from-rose-100 to-rose-300 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-lg shadow-lg p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step.id
                      ? "bg-rose-500 text-white"
                      : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      currentStep > step.id ? "bg-rose-500" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            {steps.map(step => (
              <span key={step.id}>{step.name}</span>
            ))}
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
          {currentStep === 4 ? "Review Your Story" : "Write Your Story"}
        </h1>

        {/* Step Content */}
        <div className="mb-6">
          {getStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} className="mr-2" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="flex items-center px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold transition"
            >
              Next
              <ArrowRight size={16} className="ml-2" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex items-center px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition disabled:opacity-50"
            >
              {isPublishing ? "Publishing..." : "Publish Story"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}