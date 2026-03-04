'use client'

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { ReactElement, useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';

// Restricting type to exact strings prevents accidental typos when using the component
type CardProps = {
  type: 'Clients' | 'Profile' | 'Schedule' | 'Dashboard';
  href: string;
  active: boolean;
};

export default function NavCard({ type, href }: CardProps) {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  
  // State handles both mouse hover and keyboard focus
  const [isActive, setIsActive] = useState(false);

  // Dynamic colors ensuring perfect contrast
  const bgColor = isActive ? primaryColor : theme.palette.background.paper;
  const contentColor = isActive ? '#ffffff' : primaryColor;
  const textColor = isActive ? '#ffffff' : theme.palette.text.primary;

  // Icon styles dynamically adjust based on state
  const iconStyle = { 
    fontSize: 44, 
    color: contentColor, 
    transition: 'color 0.3s ease' 
  };

  const icons: Record<string, ReactElement> = { 
    'Clients': <PeopleAltIcon sx={iconStyle} />,
    'Profile': <AccountBoxIcon sx={iconStyle} />,
    'Schedule': <CalendarMonthIcon sx={iconStyle} />,
    'Dashboard': <DashboardIcon sx={iconStyle} />,
  };

  return (
    <Link href={href} className="block outline-none">
      <div 
        className="group relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl cursor-pointer border border-gray-100 dark:border-gray-800 transition-all duration-300 ease-out active:scale-95 hover:shadow-xl hover:shadow-primary/20"
        style={{ backgroundColor: bgColor }}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
      >
        {/* The icon lifts slightly independently of the card background */}
        <div className="transition-transform duration-300 ease-out group-hover:-translate-y-1">
          {icons[type]}
        </div>
        
        <Typography 
          variant="subtitle1" 
          fontWeight="600"
          style={{ color: textColor, transition: 'color 0.3s ease' }}
        >
          {type}
        </Typography>
      </div>
    </Link>
  );
}