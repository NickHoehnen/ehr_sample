'use client'

import { useAuth } from "@/context/AuthContext"
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(loading) return;

    if(!user) {
      router.replace('/login');
      return;
    }
    if(!user.emailVerified) {
      router.replace('/verify-email');
      return;
    }
  }, [ loading, user, router])

  if(loading || !user || !user.emailVerified) {
    return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>
  }

  return (
    <>{children}</>
  )
}