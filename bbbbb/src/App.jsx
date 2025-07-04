import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import AllWords from './Pages/AllWords';
import Message from './Pages/Message';
import Profile from './Pages/Profile';
import SearcFriends from './Pages/SearcFriends';
import VideoLists from './Pages/VideoLists';
import NoPage from './Pages/NoPage';
import Animasya from './Animasya';
import Layout from './MainLayout/Layout';
import Playlists from './Pages/Playlists';
import VideoInputPage from './Pages/VideoInputPage';
import MainContent from './MainContent';
import { SignupForm } from './Forum/SignupForm';
import LoginForm from './Forum/LoginForm';
import Home from './Pages/Home';
import AdminPanel from './Admin/AdminPanel';

function App() {
  // sadece sekme boyunca animasyon gösterilsin
  const [showAnimation, setShowAnimation] = useState(() => {
    const hasShown = sessionStorage.getItem('englangAnimationShown');
    return !hasShown;
  });

  const handleAnimationComplete = () => {
    console.log("Animasyon tamamlandı, içerik yükleniyor.");
    sessionStorage.setItem('englangAnimationShown', 'true');
    setShowAnimation(false);
  };

  return (
    <div className="App">
      {showAnimation ? (
        <Animasya onAnimationComplete={handleAnimationComplete} />
      ) : (
        <Routes>
          <Route path="/" element={<Layout />}>
           <Route index element={<Home />} />
            <Route path="youtubevideoURL" element={<VideoInputPage />} />
            <Route path="AllWords" element={<AllWords />} />
            <Route path="messages" element={<Message />} />
            <Route path="profile" element={<Profile />} />
             <Route path="admin" element={<AdminPanel />} />
            <Route path="searchFriends" element={<SearcFriends />} />
            <Route path="videolists" element={<VideoLists />} />
            <Route path="playlists" element={<Playlists />} />
            <Route path="signUp" element={<SignupForm />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="watch" element={<MainContent />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      )}
    </div>
  );
}

export default App;
