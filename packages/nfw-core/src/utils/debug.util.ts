/* eslint-disable no-console */
export const DEBUG = process.env.NFW_CORE_DEBUG;

export const debug : undefined | ((level: 'error' | 'warn' | 'info', ...message: string[]) => void) = DEBUG
  ? (level, ...message) => {
      if (DEBUG === level || DEBUG === 'all') {
        console[level](new Date().toISOString(), level, ...message);
      }
    }
  : undefined;
