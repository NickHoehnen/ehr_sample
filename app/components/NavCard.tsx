'use client' 

import { Avatar } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
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
  
  const icons: Record<string, ReactElement> = { 
    'Clients': <PeopleAltIcon sx={{ fontSize: 50 }} />,
    'Profile': <AccountBoxIcon sx={{ fontSize: 50 }} />,
    'Schedule': <CalendarMonthIcon sx={{ fontSize: 50 }} />,
  }

  return (
    <Link href={href}>
      <div className=' bg-gray-200 rounded-3xl hover:bg-amber-50'>
        <div className='flex flex-col items-center gap-1 hover:gap-3 transition-all justify-between w-20'>
          {icons[type]}
          <p className=''>{type}</p>
        </div>
      </div>
    </Link>
  )
}