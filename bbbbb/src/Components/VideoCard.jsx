import React from "react";
import "../styles/video.css";

const extractYouTubeId = (url) => {
  if (!url || typeof url !== "string") return null;
  const regex = /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/watch\?v=|\/watch\?.+&v=))([^?&"'>]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const VideoCard = ({ video, likes, liked, onLike, onVideoClick }) => {
  const youTubeId = extractYouTubeId(video.link);
  const isYouTube = !!youTubeId;

  const handleClick = (e) => {
    if (e.target.closest(".like-button-bottom")) return;
    onVideoClick();
  };

  return (
    <div className="video-card" onClick={handleClick} style={{ cursor: "pointer" }}>
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
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className="like-button-bottom"
          disabled={liked}
        >
          🔥 Bəyən ({likes})
        </button>
        {liked && <p className="liked-note">✔️ Bəyənildi</p>}
      </div>
    </div>
  );
};

export default VideoCard;
