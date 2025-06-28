import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { VideoProvider } from './Context/VideoProvider.jsx'
import WordProvider from './Context/WordProvider.jsx';

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
createRoot(document.getElementById('root')).render(
 <React.StrictMode>
<BrowserRouter>
   
        <WordProvider>
          <VideoProvider> {/* <-- Wrap your App with VideoProvider here */}
            <App />
          </VideoProvider>
        </WordProvider>
     
    </BrowserRouter>
  </React.StrictMode>

);