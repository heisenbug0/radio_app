import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

interface PiPContextValue {
  isSupported: boolean;
  pipWindow: Window | null;
  requestPipWindow: (width?: number, height?: number) => Promise<void>;
  closePipWindow: () => void;
}

const PiPContext = createContext<PiPContextValue | undefined>(undefined);

export const PiPProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const api = (window as any).documentPictureInPicture;
  const isSupported = !!api;
  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  const requestPipWindow = useCallback(
    async (width?: number, height?: number) => {
      if (!isSupported) return;
      try {
        const win: Window = await api.requestWindow({ width, height });
        // copy all <link rel="stylesheet"> and <style> into PiP
        document
          .querySelectorAll('link[rel="stylesheet"], style')
          .forEach((node) => {
            win.document.head.appendChild(node.cloneNode(true));
          });
        setPipWindow(win);
        // auto-cleanup when user closes PiP
        win.addEventListener(
          'pagehide',
          () => setPipWindow(null),
          { once: true },
        );
      } catch (err) {
        console.error('Failed to open PiP window', err);
      }
    },
    [isSupported],
  );

  const closePipWindow = useCallback(() => {
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
    }
  }, [pipWindow]);

  return (
    <PiPContext.Provider
      value={{ isSupported, pipWindow, requestPipWindow, closePipWindow }}
    >
      {children}
    </PiPContext.Provider>
  );
};

export function usePiPContext(): PiPContextValue {
  const ctx = useContext(PiPContext);
  if (!ctx) throw new Error('usePiPContext must be inside a PiPProvider');
  return ctx;
}
