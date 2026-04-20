'use client';

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { TerminalBootEffect } from './TerminalBootEffect';

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

export function TerminalBootManager() {
  const { isTerminalBooting } = useTerminalBoot();
  return <TerminalBootEffect isActive={isTerminalBooting} />;
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
      {children}
    </TerminalBootContext.Provider>
  );
}

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  /**
   * The hook below is a failsafe for the 'terminal' theme class persistence issue.
   * While next-themes 0.4.x handles third themes correctly when listed in the 'themes' array,
   * this explicit cleanup ensures the .terminal class is purged from the <html> element
   * immediately when switching back to light or dark modes.
   */
  return (
    <NextThemesProvider 
      {...props} 
      themes={['light', 'dark', 'terminal']}
      value={{
        light: 'light',
        dark: 'dark',
        terminal: 'terminal'
      }}
    >
      <ThemeSyncWrapper>
        <TerminalBootProviderInternal>
          {children}
        </TerminalBootProviderInternal>
      </ThemeSyncWrapper>
    </NextThemesProvider>
  );
}

/**
 * Internal component to handle theme-dependent class management
 */
function ThemeSyncWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      
      // Forcefully remove terminal class if we are not in terminal mode
      if (theme !== 'terminal' && html.classList.contains('terminal')) {
        html.classList.remove('terminal');
      }
      
      // Ensure current theme class is present
      if (theme) {
        html.classList.add(theme);
      }
    }
  }, [theme]);

  return <>{children}</>;
}
