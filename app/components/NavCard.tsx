"use client";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { ReactElement } from "react";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { usePathname } from "next/navigation";

// Restricting type to exact strings prevents accidental typos when using the component
type CardProps = {
  type: "Clients" | "Profile" | "Schedule" | "Dashboard";
  href: string;
};

export default function NavCard({ type, href }: CardProps) {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const pathname = usePathname();
  const isActive = pathname === href;

  const bgColor = isActive ? primaryColor : theme.palette.background.paper;
  const contentColor = isActive ? "#ffffff" : primaryColor;
  const textColor = isActive ? "#ffffff" : theme.palette.text.primary;

  const iconStyle = {
    fontSize: 30,
    color: contentColor,
    transition: "color 0.3s ease",
  };

  const icons: Record<string, ReactElement> = {
    Clients: <PeopleAltIcon sx={iconStyle} />,
    Profile: <AccountBoxIcon sx={iconStyle} />,
    Schedule: <CalendarMonthIcon sx={iconStyle} />,
    Dashboard: <DashboardIcon sx={iconStyle} />,
  };

  return (
    <Link href={href} className="block outline-none sm:bg-white">
      <div
        className="group relative p-3 sm:p-2 flex-1 flex-col sm:flex-row items-center justify-center gap-3 rounded-2xl sm:rounded-none cursor-pointer border border-gray-100 dark:border-gray-800 sm:border-none transition-all duration-300 ease-out pressable hover:shadow-xl hover:shadow-primary/20"
        style={{
          backgroundColor: bgColor,
          transition: "background-color 0.3s ease",
        }}
      >
        <div className="transition-transform duration-300 ease-out group-hover:-translate-y-1">
          {icons[type]}
        </div>

        <Typography
          variant="subtitle1"
          fontWeight="600"
          style={{ color: textColor, transition: "color 0.3s ease" }}
        >
          {type}
        </Typography>
      </div>
    </Link>
  );
}
