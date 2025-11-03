// Utility untuk Google OAuth
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Load Google Identity Services script
export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    // Check if script is already in the DOM
    const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (existingScript) {
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Wait a bit for Google to initialize
      setTimeout(() => {
        if (window.google?.accounts?.id) {
          resolve();
        } else {
          reject(new Error('Google Identity Services gagal dimuat'));
        }
      }, 100);
    };
    script.onerror = () => {
      reject(new Error('Gagal memuat Google Identity Services'));
    };
    document.head.appendChild(script);
  });
};

// Initialize Google Sign-In
export const initializeGoogleSignIn = async (callback: (credential: string) => void) => {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID tidak ditemukan di environment variables');
  }

  await loadGoogleScript();

  if (!window.google?.accounts?.id) {
    throw new Error('Google Identity Services tidak tersedia');
  }

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response: any) => {
      if (response.credential) {
        callback(response.credential);
      }
    },
  });
};

// Trigger Google Sign-In popup
export const triggerGoogleSignIn = () => {
  if (window.google?.accounts?.id) {
    window.google.accounts.id.prompt();
  }
};

// Render Google Sign-In button
export const renderGoogleButton = async (
  element: HTMLElement,
  onSuccess: (credential: string) => void
) => {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID tidak ditemukan di environment variables');
  }

  await loadGoogleScript();

  if (!window.google?.accounts?.id) {
    throw new Error('Google Identity Services tidak tersedia');
  }

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response: any) => {
      if (response.credential) {
        onSuccess(response.credential);
      }
    },
  });

  window.google.accounts.id.renderButton(element, {
    type: 'standard',
    theme: 'outline',
    size: 'large',
    text: 'signin_with',
    width: element.offsetWidth || 250,
  });
};

