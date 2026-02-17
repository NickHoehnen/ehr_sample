'use client' 

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { ReactElement, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type CardProps = {
  type: string;
  href: string;
}
export default function NavCard({ type, href }: CardProps) {
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        setCurrentUser(user);
        setLoading(false);
      }
      else {
        router.push('/')
      }
    })
  }, []);

  const icons: Record<string, ReactElement> = { 
    'Clients': <PeopleAltIcon sx={{ fontSize: 60 }} />,
    'Profile': <AccountBoxIcon sx={{ fontSize: 60 }} />,
  }

  if( loading ) return <div>Loading...</div>
  return (
    <Link href={href}>
      <div className='h-xl p-10 bg-gray-200 rounded-4xl'>
        <div className='flex flex-col items-center'>
          {icons[type]}
          {type}
        </div>
      </div>
    </Link>
  )
}