'use client'

import { useAuth } from "@/context/AuthContext";
import AuthGuard from "../components/AuthGuard";
import NavCard from "../components/NavCard";
import { CircularProgress, Container, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, userDoc, logout } = useAuth(); // Assuming logout is in context
  const router = useRouter();
  const pathname = usePathname();
  
  // User pill menu
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null);
  const userMenuOpen = Boolean(userMenuAnchor);

  const firstName = userDoc?.firstName ?? "";
  const lastName = userDoc?.lastName ?? "";
  const fullName = `${firstName} ${lastName}`.trim();
  const displayName = fullName || user?.email || "Loading...";

  // 2. Set the currentTarget as the anchor
  const handleShowUserMenu = (e: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(e.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  return (
    <AuthGuard>
      <Container maxWidth="lg" className="py-8 min-h-screen flex flex-col gap-8">
        
        <header className="flex flex-row sm:items-center justify-between gap-4 mb-1 px-2">
          <Typography variant="h4">EHR Sample</Typography>

          {/* Status Pill */}
          <div 
            onClick={handleShowUserMenu} 
            className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-600 rounded-full cursor-pointer shadow-sm transition-all hover:shadow-md active:scale-95 select-none"
          >
            {user ? (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
            ) : (
              <span className="h-2.5 w-2.5 rounded-full bg-gray-400"></span>
            )}
            <span className="text-sm font-medium text-green-800 dark:text-green-700">
              {displayName}
            </span>
          </div>

          <Menu
            id="user-menu"
            anchorEl={userMenuAnchor}
            open={userMenuOpen} // Fixed: use your state variable
            onClose={handleCloseUserMenu} // Fixed: use your handler
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleCloseUserMenu}>Profile</MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>My Account</MenuItem>
            {/* Logic: Handle logout if applicable */}
            <MenuItem onClick={() => { handleCloseUserMenu(); logout?.(); }}>
              Logout
            </MenuItem>
          </Menu>
        </header>

        <nav className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 w-full">
          <NavCard type="Dashboard" href="/dashboard" />
          <NavCard type="Clients" href="/clients" />
          <NavCard type="Schedule" href="/schedule" />
          <NavCard type="Profile" href="/profile" />
        </nav>

        {/* Page content container */}
        <main className="grow bg-white dark:bg-gray-900 dark:text-gray-100 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
          {loading ? (
            <div className="flex justify-center p-12"><CircularProgress /></div>
          ) : (
            <div className="animate-in fade-in duration-300">{children}</div>
          )}
        </main>

      </Container>
    </AuthGuard>
  );
}