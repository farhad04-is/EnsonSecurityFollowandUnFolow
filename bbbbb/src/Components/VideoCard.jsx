import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/video.css';

const extractYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regex = /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/watch\?v=|\/watch\?.+&v=))([^?&"'>]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const VideoCard = ({ video }) => {
  if (!video) return null;

  const [likes, setLikes] = useState(video.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (!video.id) return;

    const likedVideos = JSON.parse(localStorage.getItem("likedVideos")) || [];
    if (likedVideos.includes(video.id)) {
      setHasLiked(true);
    }
  }, [video.id]);

  const handleLike = async () => {
    if (!video.id) {
      alert("Bu videonun identifikatoru yoxdur!");
      return;
    }

    const likedVideos = JSON.parse(localStorage.getItem("likedVideos")) || [];
    if (likedVideos.includes(video.id)) {
      alert("Bu videonu artıq bəyənmisiniz!");
      return;
    }

    try {
      await axios.put(`http://localhost:8082/videolist/${video.id}/like`);
      setLikes(prev => prev + 1);
      setHasLiked(true);

      likedVideos.push(video.id);
      localStorage.setItem("likedVideos", JSON.stringify(likedVideos));
    } catch (err) {
      console.error("Bəyənmə xətası:", err);
      alert("Bəyənmə əməliyyatında xəta baş verdi.");
    }
  };

  const youTubeId = extractYouTubeId(video.link);
  const isYouTube = !!youTubeId;

  return (
    <div className="video-card">
      <h3 className="video-title">{video.videoname}</h3>

      {isYouTube ? (
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${youTubeId}`}
          title={video.videoname}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video controls src={video.link} className="video-player" />
      )}

      <div className="video-actions-bottom">
        <button
          onClick={handleLike}
          className="like-button-bottom"
          disabled={hasLiked}
        >
          🔥 Bəyən ({likes})
        </button>
        {hasLiked && <p className="liked-note">✔️ Bəyənildi</p>}
      </div>
    </div>
  );
};

export default VideoCard;
