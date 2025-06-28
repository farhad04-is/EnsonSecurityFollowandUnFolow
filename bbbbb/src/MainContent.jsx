// src/MainContent.jsx
import React from 'react';

import HandleTranslate from './HandleTranslate';
import { useContext } from 'react';

import VideoWatchPage from './Pages/VideoWatch';


function MainContent() { 

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: '20px',
        padding: '20px',
        fontFamily: 'Arial',
      }}
    >
      {/* Kullanıcı bilgisi ve Çıkış Yap butonu */}
      {/* <div style={{ position: 'absolute', top: '10px', right: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {user && <span>Hoş Geldiniz, {user.username}</span>}
        <button onClick={handleLogout} className="logout-button">Çıkış Yap</button>
      </div> */}

      {/* Sol taraf: VideoPlayer */}
      <div style={{ flex: 1 }}>
        <VideoWatchPage />
      </div>

      {/* Sağ taraf: HandleTranslate */}
      <div style={{ flex: 1, maxWidth: '600px' }}>
        <HandleTranslate />
      </div>
    </div>
  );
}

// Burası önemli: Bileşeni varsayılan (default) olarak dışa aktar
export default MainContent;