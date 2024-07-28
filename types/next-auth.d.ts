import NextAuth from 'next-auth/next';

declare module 'next-auth' {
  interface User {
    username: string;
  }
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider`
   */
  interface Session {
    user: User & {
      username: string;
    };
    token: {
      username: string;
    };
  }
}
