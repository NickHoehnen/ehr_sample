'use client' 

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { ReactElement } from 'react';
import Link from 'next/link';
import {useTheme} from '@mui/material';

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

  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;

  return (
    <Link href={href}>
      <div 
        className={`group rounded-3xl border-2`}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = primaryColor}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
      >
        <div className='flex flex-col items-center gap-1 hover:gap-3 p-5 transition-all duration-200 justify-between w-20'>
          {icons[type]}
          <p className='group-hover:text-gray-300'>{type}</p>
        </div>
      </div>
    </Link>
  )
}