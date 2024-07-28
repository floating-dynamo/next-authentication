import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';

const page = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (session?.user) {
    const {
      user: { username },
    } = session;

    return <h2>Admin Page - Welcome back {username}</h2>;
  }

  return <div>Please login to view the Admin Page</div>;
};

export default page;
