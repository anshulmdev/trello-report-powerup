import React, { useEffect } from 'react';
import PowerUp from './components/PowerUp';

function App() {
  useEffect(() => {
    window.TrelloPowerUp.initialize({
      'board-buttons': function(t, options) {
        return [{
          icon: {
            dark: 'https://glistening-choux-190890.netlify.app/logo512.png',
            light: 'https://glistening-choux-190890.netlify.app/logo512.png'
          },
          text: 'Generate AI Report',
          callback: function(t) {
            return t.modal({
              url: './index.html',
              fullscreen: true,
              title: 'AI Powered Reports - by API Labz'
            });
          }
        }];
      }
    });
  }, []);

  return (
    <div className="App">
      <PowerUp />
    </div>
  );
}

export default App;