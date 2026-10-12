export interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'PLAYER' | 'ADMIN' | 'REFEREE' | 'MEMBER';
}

export const TEST_USERS: Record<string, TestUser> = {
  admin: {
    email: 'admin@ttsports.com',
    password: 'password123',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'ADMIN',
  },
  player: {
    email: 'player@ttsports.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Player',
    role: 'PLAYER',
  },
  inactivePlayer: {
    email: 'inactive@ttsports.com',
    password: 'password123',
    firstName: 'Pending',
    lastName: 'User',
    role: 'PLAYER',
  },
};
