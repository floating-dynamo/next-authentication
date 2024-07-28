import { buttonVariants } from '@/components/ui/button';
import User from '@/components/user';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link className={buttonVariants()} href={'/admin'}>
        Open My Admin
      </Link>
      <div>
        <h2>Client Session</h2>
        <User />
      </div>
    </main>
  );
}
