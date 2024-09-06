import { useEffect, useState } from 'react';

function useIsFullScreenCheck() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const checkWindowState = () => {
      // @ts-ignore
      window.ipc.send('window:getState');
    };

    const handleWindowState = (isFullScreen: boolean) => {
      setIsFullScreen(isFullScreen);
    };

    checkWindowState();

    const unsubscribe = window.ipc.on('window:state', handleWindowState);

    window.addEventListener('resize', checkWindowState);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', checkWindowState);
    };
  }, []);

  return isFullScreen;
}

export default useIsFullScreenCheck
