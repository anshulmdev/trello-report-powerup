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
            return t.popup({
              title: 'AI Powered Reports - by API Labz',
              url: './index.html',
              height: 600,
              args: { rand: Math.random() }, // To force iframe reload
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