// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Post from './pages/Post';
import Write from './pages/Write';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import { auth } from './firebase';
import { Toaster } from 'react-hot-toast';
import Stories from './pages/Stories';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <Router>
      <Navbar user={user} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/stories" element={<Stories />} />

        {/* Write page only accessible to logged-in users */}
        <Route
          path="/write"
          element={
            <PrivateRoute>
              <Write user={user} />
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/profile"
          element={<Profile onUserUpdate={handleUserUpdate} />}
        />
      </Routes>

      <Footer />

      {/* Toaster for notifications */}
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
}

export default App;
