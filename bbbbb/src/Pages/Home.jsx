import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/video.css";
import VideoCard from "../Components/VideoCard";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null); // 👈 kliklənən videonun ID-si
  const [selectedVideoLink, setSelectedVideoLink] = useState(""); // 👈 kliklənən link

  useEffect(() => {
    axios
      .get("http://localhost:8082/videolist")
      .then((res) => setVideos(res.data))
      .catch(() => alert("Videoları yükləmək mümkün olmadı."));
  }, []);

  const handleLike = async (videoId) => {
    const likedVideos = JSON.parse(localStorage.getItem("likedVideos")) || [];

    if (likedVideos.includes(videoId)) {
      alert("Bu videonu artıq bəyənmisiniz!");
      return;
    }

    try {
      await axios.put(`http://localhost:8082/videolist/${videoId}/like`);
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId ? { ...v, likes: (v.likes || 0) + 1 } : v
        )
      );
      likedVideos.push(videoId);
      localStorage.setItem("likedVideos", JSON.stringify(likedVideos));
    } catch {
      alert("Bəyənmə zamanı xəta baş verdi.");
    }
  };

  // 🔻 Sadəcə linki state-ə yazır
  const handleLoadVideo = (videoId, link) => {
    setSelectedVideoId(videoId);
    setSelectedVideoLink(link);
  };

  return (
    <div className="video-list">
      {videos.length === 0 && <p>Heç bir video tapılmadı.</p>}
      {videos.map((video) => (
        <div key={video.id}>
          <VideoCard
            video={video}
            likes={video.likes || 0}
            liked={
              JSON.parse(localStorage.getItem("likedVideos"))?.includes(video.id) ||
              false
            }
            onLike={() => handleLike(video.id)}
            onVideoClick={() => handleLoadVideo(video.id, video.link)}
          />

          {/* 🔽 Əgər bu video klikləndisə, linkini göstər */}
          {selectedVideoId === video.id && (
            <div style={{ marginTop: "10px", color: "blue" }}>
              Video linki: <a href={selectedVideoLink} target="_blank" rel="noreferrer">{selectedVideoLink}</a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;

