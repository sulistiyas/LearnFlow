import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any>;
  }
}

window.Pusher = Pusher;

export const createEchoClient = (): Echo<'reverb'> => {
  const defaultHost = typeof window !== 'undefined' && window.location.hostname
    ? window.location.hostname
    : 'localhost';
  const defaultApiBase = typeof window !== 'undefined' && window.location.origin
    ? `${window.location.origin}/api/v1`
    : 'http://localhost:8000/api/v1';

  return new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY ?? 'learnflow_key',
    wsHost: import.meta.env.VITE_REVERB_HOST ?? defaultHost,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${import.meta.env.VITE_API_BASE_URL ?? defaultApiBase}/broadcasting/auth`,
    auth: {
      headers: {
        Accept: 'application/json',
      },
    },
  });
};
