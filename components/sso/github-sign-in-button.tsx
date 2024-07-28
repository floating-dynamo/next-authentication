import { FC, ReactNode } from 'react';
import { Button } from '../ui/button';
import { signIn } from 'next-auth/react';
import { authOptions } from '@/lib/auth';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

interface GithubSignInButtonProps {
  children: ReactNode;
}
const GithubSignInButton: FC<GithubSignInButtonProps> = ({ children }) => {
  const router = useRouter();

  const loginWithGithub = async () => {
    console.log('login with github');
    const signInData = await signIn('github', {
      redirect: false,
    });
    console.log(signInData);
    if (signInData?.error) {
      console.error(signInData.error);
      toast({
        title: 'Oops, we encountered an error!',
        description: 'Invalid Login Credentials',
        variant: 'destructive',
      });
    } else {
      router.refresh();
      router.push('/admin');
    }
  };

  return (
    <Button onClick={loginWithGithub} className='w-full'>
      {children}
    </Button>
  );
};

export default GithubSignInButton;
