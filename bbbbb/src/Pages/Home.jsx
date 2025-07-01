import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/video.css';
import VideoCard from '../Components/VideoCard';

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8082/videolist')
      .then(res => {
        console.log("Backenddən gələn videolar:", res.data);
        setVideos(res.data);
      })
      .catch(err => {
        console.error("Videolar alınmadı:", err);
        alert("Videoları yükləmək mümkün olmadı.");
      });
  }, []);

  return (
    <div className="video-list">
      {videos.length === 0 && <p>Heç bir video tapılmadı.</p>}
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default Home;
