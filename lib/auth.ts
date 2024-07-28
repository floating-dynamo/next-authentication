import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './db';
import { compare } from 'bcrypt';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { type: 'text', label: 'Email', placeholder: 'Enter your email' },
        password: { type: 'password', label: 'Password', placeholder: 'Enter your password' },
      },
      async authorize(credentials, req) {
        // add logic to lookup user
        if (!credentials?.password || !credentials?.email) {
          return null;
        }

        const existingUser = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!existingUser) return null;
        const isPasswordMatched = await compare(credentials.password, existingUser?.password);
        if (!isPasswordMatched) return null;

        const { id, username, email } = existingUser;

        return {
          id: `${id}`,
          username,
          email,
        };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENTID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, username: user.username };
      }
      return token;
    },
    async session({ session, user, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
        },
      };
    },
  },
};
