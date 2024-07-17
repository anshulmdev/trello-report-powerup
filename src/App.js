import React, { useEffect, useState } from 'react';
import PowerUp from './components/PowerUp';

function App() {
  const [t, setT] = useState(null);

  useEffect(() => {
    const initialize = () => {
      return window.TrelloPowerUp.initialize({
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
                height: 600,
                width: 800,
                title: 'AI Powered Reports - by API Labz'
              });
            }
          }];
        }
      }, {
        appKey: 'your-app-key-here', // Replace with your actual Trello app key
        appName: 'AI Powered Reports'
      });
    };

    window.Trello.authorize({
      type: 'popup',
      name: 'AI Powered Reports',
      scope: {
        read: 'true',
        write: 'true'
      },
      expiration: 'never',
      success: () => {
        const trelloT = initialize();
        setT(trelloT);
      },
      error: () => console.log('Failed to authorize with Trello')
    });

  }, []);

  return (
    <div className="App">
      {t && <PowerUp t={t} />}
    </div>
  );
}

export default App;