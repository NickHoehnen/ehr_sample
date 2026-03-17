"use client";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { ReactElement } from "react";
import Link from "next/link";
import { Box, Typography, alpha } from "@mui/material";
import { usePathname } from "next/navigation";

// Restricting type to exact strings prevents accidental typos
type CardProps = {
  type: "Clients" | "Profile" | "Schedule" | "Dashboard";
  href: string;
};

export default function NavCard({ type, href }: CardProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const icons: Record<string, ReactElement> = {
    Clients: <PeopleAltIcon fontSize="large" />,
    Profile: <AccountBoxIcon fontSize="large" />,
    Schedule: <CalendarMonthIcon fontSize="large" />,
    Dashboard: <DashboardIcon fontSize="large" />,
  };

  return (
    <Box
      component={Link}
      href={href}
      className="pressable"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 0.5, sm: 1.5 },
        p: { xs: 1, sm: 1.5 },
        textDecoration: "none",
        borderRadius: { xs: "1rem", sm: 0 },
        transition: "all 0.2s ease-in-out",
        userSelect: "none",
        bgcolor: isActive ? "primary.main" : "transparent",
        color: isActive ? "primary.contrastText" : "text.secondary",
        
        "&:hover": {
          bgcolor: isActive ? "primary.dark" : "action.hover",
          color: { sm: isActive ? "primary.contrastText" : "primary.main", xs: "primary.main" },
          
          "& .nav-icon": {
            transform: "translateY(-2px)",
          },
        },
      }}
    >
      <Box 
        className="nav-icon" 
        sx={{ 
          display: "flex", 
          transition: "transform 0.2s ease-out",
          color: "inherit" 
        }}
      >
        {icons[type]}
      </Box>

      <Typography
        variant="subtitle2"
        sx={{ 
          fontWeight: 600, 
          color: "inherit",
          display: { xs: "none", sm: "block" } 
        }}
      >
        {type}
      </Typography>
    </Box>
  );
}