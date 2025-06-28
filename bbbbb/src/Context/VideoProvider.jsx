
import React, { createContext, useState } from 'react';

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videoData, setVideoData] = useState({
    videoUrl: null,
    subtitleBlobUrl: null,
    parsedSubtitles: [],
  });

  return (
    <VideoContext.Provider value={{ videoData, setVideoData }}>
      {children}
    </VideoContext.Provider>
  );
};
