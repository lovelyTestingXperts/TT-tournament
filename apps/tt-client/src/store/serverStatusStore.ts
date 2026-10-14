import { create } from 'zustand';

interface ServerStatusState {
  isServerDown: boolean;
  message: string;
  isChecking: boolean;
  dismissed: boolean;
  setServerDown: (isDown: boolean, message?: string) => void;
  checkServerHealth: () => Promise<boolean>;
  dismiss: () => void;
  reset: () => void;
}

export const useServerStatusStore = create<ServerStatusState>((set) => ({
  isServerDown: false,
  message: 'Server is down. Our sports gateway is currently unreachable.',
  isChecking: false,
  dismissed: false,

  setServerDown: (isDown: boolean, message?: string) =>
    set({
      isServerDown: isDown,
      message: message || 'Server is down. Our sports gateway is currently unreachable.',
      dismissed: false,
    }),

  dismiss: () => set({ dismissed: true }),

  reset: () =>
    set({
      isServerDown: false,
      dismissed: false,
    }),

  checkServerHealth: async () => {
    set({ isChecking: true });
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ __typename }' }),
      });

      if (response.ok) {
        set({ isServerDown: false, isChecking: false, dismissed: false });
        return true;
      } else {
        set({
          isServerDown: true,
          isChecking: false,
          message: 'Server is down. Gateway responded with an error.',
        });
        return false;
      }
    } catch {
      set({
        isServerDown: true,
        isChecking: false,
        message: 'Server is down. Gateway connection refused or network offline.',
      });
      return false;
    }
  },
}));
