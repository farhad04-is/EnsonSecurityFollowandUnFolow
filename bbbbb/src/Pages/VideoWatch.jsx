import React, { useContext, useRef, useEffect, useState } from 'react';
import { WordContext } from '../Context/WordProvider';
import { VideoContext } from '../Context/VideoProvider';

const VideoWatchPage = () => {
  const { videoData } = useContext(VideoContext);
  const { videoUrl, subtitleBlobUrl, parsedSubtitles = [] } = videoData || {};

  const [currentDisplayedSubtitle, setCurrentDisplayedSubtitle] = useState('');
  const { setword } = useContext(WordContext);
  const videoRef = useRef(null);

  useEffect(() => {
    let intervalId;

    if (videoRef.current && parsedSubtitles.length > 0) {
      intervalId = setInterval(() => {
        const time = videoRef.current.currentTime;
        const current = parsedSubtitles.find((s) => time >= s.start && time < s.end);

        if (current && current.content !== currentDisplayedSubtitle) {
          setCurrentDisplayedSubtitle(current.content);
        } else if (!current && currentDisplayedSubtitle !== '') {
          setCurrentDisplayedSubtitle('');
        }
      }, 100);
    } else {
      setCurrentDisplayedSubtitle('');
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (subtitleBlobUrl) URL.revokeObjectURL(subtitleBlobUrl);
    };
  }, [parsedSubtitles, currentDisplayedSubtitle, videoUrl, subtitleBlobUrl]);

  // Sözü kliklədikdə təmizləyib WordProvider-ə göndər
  const handleWordClick = (word) => {
    const cleanedWord = word.replace(/[.,!?;:"()]/g, '').trim();
    setword(cleanedWord);
    console.log("Seçilmiş söz:", cleanedWord);
  };

  return (
    <div className="p-4 flex flex-col items-center">
      {!videoUrl && (
        <p className="text-center text-gray-600 text-lg mt-8">
          Lütfen bir video URL'si girerek izlemeye başlayın.
        </p>
      )}

      {videoUrl && (
        <>
          <video
            ref={videoRef}
            controls
            width="720"
            className="w-full max-w-2xl mx-auto block rounded-lg shadow-lg mb-4"
          >
            <source src={videoUrl} type="video/mp4" />
            {subtitleBlobUrl && (
              <track
                label="English"
                kind="subtitles"
                srcLang="en"
                src={subtitleBlobUrl}
                default
              />
            )}
            Tarayıcınız video etiketini desteklemiyor.
          </video>

                    <div className="mt-4 p-2 bg-gray-100 rounded text-lg min-h-[3rem]">
                        {currentDisplayedSubtitle ? (
                            currentDisplayedSubtitle.split(' ').map((word, i) => (
                                <React.Fragment key={i}>
                                    <span
                                        onClick={() => handleWordClick(word.replace(/[.,!?;]$/, ''))} // Clean punctuation
                                        className="cursor-pointer hover:text-blue-600 whitespace-pre-wrap"
                                    >
                                        {word}
                                    </span>
                                    {' '}
                                </React.Fragment>
                            ))
                        ) : (
                            <span></span>
                        )}
                    </div>
        </>
      )}
    </div>
  );
};

export default VideoWatchPage;
