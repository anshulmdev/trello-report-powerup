import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    window.TrelloPowerUp.initialize({
      'board-buttons': function(t, options) {
        return [{
          icon: {
            dark: 'https://glistening-choux-190890.netlify.app/logo192.png',
            light: 'https://glistening-choux-190890.netlify.app/logo192.png'
          },
          text: 'AI Report',
          callback: function(t) {
            return t.modal({
              url: 'https://glistening-choux-190890.netlify.app/report',
              height: 600,
              width: 800,
              title: 'AI Powered Report'
            });
          }
        }];
      }
    });
  }, []);

  return (
    <div className="App">
      <h1>AI Powered Reports</h1>
      <p>This is the main page of the Power-Up.</p>
    </div>
  );
}

export default App;