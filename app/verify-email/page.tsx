'use client'

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LoadingButton } from "@mui/lab";
import { Typography, Stack } from "@mui/material";

export default function VerifyEmail() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [resending, setResending] = useState(false);

  // 🔁 Auto-check every 3 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      await user.reload();

      if (user.emailVerified) {
        router.replace("/dashboard");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user, router]);

  async function handleResend() {
    if (!user) return;

    try {
      setResending(true);
      await sendEmailVerification(user);
    } finally {
      setResending(false);
    }
  }

  if (loading) return null;

  return (
    <Stack spacing={2} alignItems="center">
      <Typography variant="h4">
        Please verify your email
      </Typography>

      <Typography>
        We've sent you a verification link.
      </Typography>

      <LoadingButton
        loading={resending}
        onClick={handleResend}
        variant="outlined"
      >
        Resend Email
      </LoadingButton>
    </Stack>
  );
}