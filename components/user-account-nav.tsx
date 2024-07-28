'use client'

import React from 'react';
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';

const UserAccountNav = () => {
  return (
    <div>
      <Button onClick={() => signOut({
        redirect: true,
        callbackUrl: `${window.location.origin}/signin`
      })} variant='destructive'>
        Sign Out
      </Button>
    </div>
  );
};

export default UserAccountNav;
