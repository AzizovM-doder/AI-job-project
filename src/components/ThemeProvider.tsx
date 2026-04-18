'use client';

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { TerminalBootEffect } from './TerminalBootEffect';

// Workaround for React 19 / Next 15+ emitting console warnings due to next-themes 
// injecting an inline script to prevent FOUC.
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag while rendering React component')) {
      return;
    }
    originalError(...args);
  };
}

interface TerminalBootContextType {
  isTerminalBooting: boolean;
  triggerTerminalBoot: () => void;
}

const TerminalBootContext = createContext<TerminalBootContextType | undefined>(undefined);

export function useTerminalBoot() {
  const context = useContext(TerminalBootContext);
  if (context === undefined) {
    throw new Error('useTerminalBoot must be used within a TerminalBootProvider');
  }
  return context;
}

function TerminalBootProviderInternal({ children }: { children: React.ReactNode }) {
  const [isTerminalBooting, setIsTerminalBooting] = useState(false);
  const { setTheme } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const triggerTerminalBoot = useCallback(() => {
    setIsTerminalBooting(true);

    // Audio Logic
    if (typeof window !== 'undefined') {
      console.log("Triggering terminal boot audio...");
      const audio = new Audio('/sounds/terminal-boot.mp3');
      audio.volume = 0.5; // Set a reasonable volume
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playback started successfully");
          })
          .catch(error => {
            console.error("Audio playback failed:", error);
            // Fallback: try to play after a short delay or ignore
          });
      }
    }

    // Delay theme switch
    setTimeout(() => {
      setTheme('terminal');
      
      // Keep overlay for a bit longer to feel "booted"
      setTimeout(() => {
        setIsTerminalBooting(false);
      }, 500);
    }, 2000);
  }, [setTheme]);

  return (
    <TerminalBootContext.Provider value={{ isTerminalBooting, triggerTerminalBoot }}>
      <TerminalBootEffect isActive={isTerminalBooting} />
      {children}
    </TerminalBootContext.Provider>
  );
}

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <TerminalBootProviderInternal>
        {children}
      </TerminalBootProviderInternal>
    </NextThemesProvider>
  );
}
