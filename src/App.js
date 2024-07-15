import React, { useEffect } from 'react';
import PowerUp from './components/PowerUp';

function App() {
  useEffect(() => {
    window.TrelloPowerUp.initialize({
      'board-buttons': function(t, options) {
        return [{
          icon: {
            dark: 'https://img.icons8.com/ios-filled/50/000000/report-card.png',
            light: 'https://img.icons8.com/ios/50/000000/report-card.png'
          },
          text: 'Generate Report',
          callback: function(t) {
            return t.modal({
              url: './index.html',
              height: 600,
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