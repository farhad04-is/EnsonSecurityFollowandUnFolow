import React, { useState, useEffect, useContext } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { VideoContext } from '../Context/VideoProvider'; // ' ' boşluğu kaldırıldı

// parseVTT fonksiyonunu import ediyoruz
import { parseVTT } from '../utils/subtitleParser'; // <-- Bu satırı ekleyin (yola dikkat edin!)
import { getToken, removeToken } from '../Forum/api';


const VideoInputPage = () => {
  const [videoInputUrl, setVideoInputUrl] = useState('');
  const { setVideoData } = useContext(VideoContext);
  const navigate = useNavigate();

  // ✅ Token yoxlaması
  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert('Bu səhifəyə daxil olmaq üçün əvvəlcə giriş etməlisiniz.');
      navigate('/login');
    }
  }, [navigate]);

  const handleLoadVideo = async () => {
    if (!videoInputUrl) return alert('Video URL girin.');

    const token = getToken();
    if (!token) {
      alert('Token yoxdur. Lütfən, yenidən giriş edin.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8082/v1/EngLang/video-subtitle?url=${encodeURIComponent(videoInputUrl)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const subtitleText = response.data.subtitle;
      const blob = new Blob([subtitleText], { type: 'text/vtt' });
      const blobUrl = URL.createObjectURL(blob);
      const parsed = parseVTT(subtitleText);

      setVideoData({
        videoUrl: response.data.videoUrl,
        subtitleBlobUrl: blobUrl,
        parsedSubtitles: parsed,
      });

      navigate('/watch');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert('Yetkisiz giriş. Lütfən, hesabınıza yenidən daxil olun.');
        removeToken();
        navigate('/login');
      } else {
        alert('Video yüklənə bilmədi.');
      }
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={videoInputUrl}
        onChange={(e) => setVideoInputUrl(e.target.value)}
        placeholder="Video URL girin"
        className="border p-2 mb-2 w-full"
      />
      <button onClick={handleLoadVideo} className="bg-blue-600 text-white px-4 py-2 rounded">
        Videonu Aç
      </button>
    </div>
  );
};

export default VideoInputPage;