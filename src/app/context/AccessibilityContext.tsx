import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FontSize = 'normal' | 'large' | 'xlarge';

interface AccessibilityContextType {
  highContrast: boolean;
  fontSize: FontSize;
  toggleHighContrast: () => void;
  setFontSize: (size: FontSize) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('a11y_contrast') === 'true';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('a11y_fontsize') as FontSize) ?? 'normal';
  });

  useEffect(() => {
    const html = document.documentElement;
    if (highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
    localStorage.setItem('a11y_contrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('fs-large', 'fs-xlarge');
    if (fontSize === 'large') html.classList.add('fs-large');
    if (fontSize === 'xlarge') html.classList.add('fs-xlarge');
    localStorage.setItem('a11y_fontsize', fontSize);
  }, [fontSize]);

  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const setFontSize = (size: FontSize) => setFontSizeState(size);

  return (
    <AccessibilityContext.Provider value={{ highContrast, fontSize, toggleHighContrast, setFontSize }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
