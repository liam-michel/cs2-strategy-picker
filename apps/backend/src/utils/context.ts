import type { Logger } from 'pino';

export type AuthContext = {
  userId: string;
};

export type AppContext = {
  logger: Logger;
  auth: AuthContext;
};
