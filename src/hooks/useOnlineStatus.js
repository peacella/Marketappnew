import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';

// Shared online/offline status: native Network plugin in the app,
// navigator.onLine + online/offline events on web.
export const useOnlineStatus = () => {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    let removeListener = null;
    (async () => {
      if (Capacitor.isNativePlatform()) {
        const status = await Network.getStatus().catch(() => ({ connected: true }));
        setOnline(status.connected);
        const listener = await Network.addListener('networkStatusChange', (s) =>
          setOnline(s.connected)
        );
        removeListener = () => listener.remove();
      } else {
        const goOnline = () => setOnline(true);
        const goOffline = () => setOnline(false);
        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);
        removeListener = () => {
          window.removeEventListener('online', goOnline);
          window.removeEventListener('offline', goOffline);
        };
      }
    })();
    return () => {
      if (removeListener) {
        try {
          removeListener();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  return online;
};
