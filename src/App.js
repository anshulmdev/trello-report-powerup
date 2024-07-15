import React, { useEffect } from 'react';
import PowerUp from './components/PowerUp';
import logo from './logo512.png';

function App() {
  useEffect(() => {
    window.TrelloPowerUp.initialize({
      'board-buttons': function(t, options) {
        return [{
          icon: {
            dark: logo,
            light: logo
          },
          text: 'Generate AI Report',
          callback: function(t) {
            return t.modal({
              url: './index.html',
              title: 'AI Powered Reports - by API Labz',
              height: 680,
              fullscreen: false,
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