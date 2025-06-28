// import React, { useState, useRef, useEffect, useContext } from 'react';
// import axios from 'axios';

// import { WordContext } from './Context/WordProvider';

// const VideoPlayer = () => {
//     const { setword } = useContext(WordContext);
//     const [videoUrl, setVideoUrl] = useState(null);
//     const [subtitleBlobUrl, setSubtitleBlobUrl] = useState(null); // Changed name for clarity: this is the URL for the <track> element
//     const [loading, setLoading] = useState(false);
//     const [videoInputUrl, setVideoInputUrl] = useState('');
//     const [parsedSubtitles, setParsedSubtitles] = useState([]); // Renamed for clarity: these are your parsed objects
//     const [currentDisplayedSubtitle, setCurrentDisplayedSubtitle] = useState(''); // Renamed for clarity: this is the subtitle text currently shown on screen
//     const videoRef = useRef(null);
//     const trackRef = useRef(null); // Ref for the track element

//     // Helper function: Converts time string (e.g., "00:00:05.123") to seconds
//     const toSeconds = (timeString) => {
//         if (!timeString) return 0;
//         const parts = timeString.split(':');
//         const hours = parseInt(parts[0] || '0', 10);
//         const minutes = parseInt(parts[1] || '0', 10);
//         const [sec, ms] = (parts[2] || '0.0').split('.');
//         const seconds = parseInt(sec, 10);
//         const milliseconds = parseFloat(`0.${ms || '0'}`);
//         return hours * 3600 + minutes * 60 + seconds + milliseconds;
//     };

//     // Parses VTT content into an array of subtitle objects
//     const parseVTT = (text) => {
//         const entries = [];
//         // Split VTT content into blocks, handling both \n\n and \r\n\r\n
//         const blocks = text.split(/(?:\r?\n){2,}/); // Matches two or more newlines

//         for (let block of blocks) {
//             block = block.trim(); // Trim leading/trailing whitespace from the block
//             // Skip comments and WEBVTT header, or empty blocks
//             if (!block || block.startsWith('WEBVTT') || block.startsWith('NOTE') || /^\d+$/.test(block)) {
//                 continue;
//             }

//             const lines = block.split(/\r?\n/);

//             let timeLine = '';
//             let contentLines = [];
//             let idLine = ''; // To capture optional cue identifiers

//             // Iterate lines to find ID, time, and content
//             for (const line of lines) {
//                 if (line.includes('-->')) {
//                     timeLine = line;
//                 } else if (!timeLine && /^\d+$/.test(line)) { // Potential cue identifier before timeLine
//                     idLine = line; // Capture ID but don't strictly use it for content
//                 } else if (timeLine) { // All lines after timeline are content
//                     contentLines.push(line);
//                 }
//             }

//             if (!timeLine) continue; // Skip blocks without a time line

//             const [startStr, endStr] = timeLine.split('-->').map(t => t.trim());
//             const start = toSeconds(startStr);
//             const end = toSeconds(endStr);

//             let content = contentLines.join(' '); // Join content lines

//             // Clean the content: remove VTT tags and time stamps
//             content = content
//                 .replace(/<c[^>]*>/g, '') // Remove <c.classname> tags
//                 .replace(/<\/[^>]*>/g, '') // Remove </c> closing tags
//                 .replace(/<\d{2}:\d{2}:\d{2}\.\d{3}>/g, '') // Remove <00:00:05.123> timestamps
//                 .replace(/<v[^>]*>/g, '') // Remove speaker tags like <v John>
//                 .replace(/<\/[^>]*>/g, '') // Remove corresponding closing tags
//                 .replace(/\s+/g, ' ') // Normalize multiple spaces to a single space
//                 .trim(); // Trim leading/trailing whitespace

//             if (content) { // Add only if content is not empty after cleaning
//                 entries.push({ start, end, content });
//             }
//         }
//         return entries;
//     };


//     // Effect to update the current subtitle based on video time
//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (!videoRef.current || parsedSubtitles.length === 0) {
//                 setCurrentDisplayedSubtitle(''); // Clear if no video or subtitles
//                 return;
//             }
//             const time = videoRef.current.currentTime;
//             const current = parsedSubtitles.find(s => time >= s.start && time < s.end);
//             if (current && current.content !== currentDisplayedSubtitle) {
//                 setCurrentDisplayedSubtitle(current.content);
//             } else if (!current && currentDisplayedSubtitle !== '') {
//                 // If no current subtitle and one was previously displayed, clear it
//                 setCurrentDisplayedSubtitle('');
//             }
//         }, 100); // Reduced interval for smoother updates

//         return () => clearInterval(interval);
//     }, [parsedSubtitles, currentDisplayedSubtitle]);

//     async function TranslateText(word) {
//         setword(word);
//     }

//     // Loads video and subtitles with a single request
//     const handleLoadVideo = async () => {
//         if (!videoInputUrl) {
//             alert("Video URL daxil edin.");
//             return;
//         }

//         setLoading(true);
//         // Clear previous states
//         setVideoUrl(null);
//         setSubtitleBlobUrl(null);
//         setParsedSubtitles([]);
//         setCurrentDisplayedSubtitle('');

//         try {
//             // Update the endpoint to video-subtitle as agreed
//             const response = await axios.get(
//                 `http://localhost:8082/v1/EngLang/video-subtitle?url=${encodeURIComponent(videoInputUrl)}`
//             );
//             const data = response.data;

//             if (!data.videoUrl) {
//                 throw new Error(data.error || "Video yüklənmədi.");
//             }
//             setVideoUrl(data.videoUrl);

//             // Access the 'subtitle' field, as confirmed by your backend response
//             const subtitleText = data.subtitle;

//             if (subtitleText) {
//                 console.log("Fetched Subtitle Text (first 500 chars):", subtitleText.substring(0, 500));
//                 const parsed = parseVTT(subtitleText);
//                 console.log("Parsed Subtitles (first 5 entries):", parsed.slice(0, 5));
//                 setParsedSubtitles(parsed);

//                 if (parsed.length === 0) {
//                     console.warn("Parsed subtitles array is empty. Check VTT content and parsing logic.");
//                 }

//                 // Create a Blob URL for the <track> element (optional, but good for browser's native captions)
//                 const blob = new Blob([subtitleText], { type: 'text/vtt' });
//                 const blobUrl = URL.createObjectURL(blob);
//                 setSubtitleBlobUrl(blobUrl);

//             } else {
//                 console.warn("Serverdən altyazı məzmunu gəlmədi.");
//                 setSubtitleBlobUrl(null);
//                 setParsedSubtitles([]);
//             }

//         } catch (err) {
//             console.error("Video və ya altyazı yükləmə zamanı xəta:", err);
//             let errorMessage = "Xəta baş verdi.";
//             if (axios.isAxiosError(err)) {
//                 if (err.response) {
//                     // Backend can send data.error for custom messages
//                     errorMessage = `Server xətası: ${err.response.status} - ${err.response.data?.error || err.response.statusText}`;
//                 } else if (err.request) {
//                     errorMessage = "Şəbəkə xətası: Serverə qoşulmaq mümkün olmadı. Backend işləyirmi?";
//                 } else {
//                     errorMessage = `İstək qurularkən xəta: ${err.message}`;
//                 }
//             } else {
//                 errorMessage = `Bilinməyən xəta: ${err.message}`;
//             }
//             alert(errorMessage);

//             setVideoUrl(null);
//             setSubtitleBlobUrl(null);
//             setParsedSubtitles([]);
//             setCurrentDisplayedSubtitle('');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Clean up Blob URL when component unmounts or subtitleBlobUrl changes
//     useEffect(() => {
//         return () => {
//             if (subtitleBlobUrl) {
//                 URL.revokeObjectURL(subtitleBlobUrl);
//                 console.log('Revoked Blob URL:', subtitleBlobUrl);
//             }
//         };
//     }, [subtitleBlobUrl]);

//     return (
//         <div className="p-4">
         

//             <input
//                 type="text"
//                 placeholder="Video URL daxil edin (məs: https://www.youtube.com/watch?v=5MuIMqhT8DM)"
//                 value={videoInputUrl}
//                 onChange={(e) => setVideoInputUrl(e.target.value)}
//                 className="border p-2 mb-2 w-full"
//             />

//             <button
//                 onClick={handleLoadVideo}
//                 disabled={loading}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//                 {loading ? 'Yüklənir...' : 'Videonu Göstər'}
//             </button>

//             {videoUrl && (
//                 <div className="mt-6">
//                     <video ref={videoRef} controls width="720">
//                         <source src={videoUrl} type="video/mp4" />
//                         {subtitleBlobUrl && (
//                             <track
//                                 ref={trackRef}
//                                 label="English Subtitles" // Comment removed from here
//                                 kind="subtitles"
//                                 srcLang="en" // Comment removed from here
//                                 src={subtitleBlobUrl}
//                                 default // This tries to enable it by default, but your custom div takes precedence
//                             />
//                         )}
//                         Sizin brauzer video etiketini dəstəkləmir.
//                     </video>

//                     {/* Debugging section for track element status (optional) */}
//                     {/* {trackRef.current && (
//                         <div className="mt-2 text-sm text-gray-600">
//                             Track Status: Mode - {trackRef.current.mode}, ReadyState - {trackRef.current.readyState}
//                         </div>
//                     )} */}


//                     <div className="mt-4 p-2 bg-gray-100 rounded text-lg min-h-[3rem]">
//                         {currentDisplayedSubtitle ? (
//                             currentDisplayedSubtitle.split(' ').map((word, i) => (
//                                 <React.Fragment key={i}>
//                                     <span
//                                         onClick={() => TranslateText(word.replace(/[.,!?;]$/, ''))} // Clean punctuation
//                                         className="cursor-pointer hover:text-blue-600 whitespace-pre-wrap"
//                                     >
//                                         {word}
//                                     </span>
//                                     {' '}
//                                 </React.Fragment>
//                             ))
//                         ) : (
//                             <span></span>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default VideoPlayer;