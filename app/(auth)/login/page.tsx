"use client";

import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { TextField, Button, Alert, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getFirebaseAuthMessage } from "@/lib/firebaseErrors";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //setError(null)
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password,
      );

      // if (!userCredential.user.emailVerified) {
      //   await sendEmailVerification(userCredential.user);
      //   setError('Please verify your email. A verification link was sent.')
      //   return
      // }

      router.push("/dashboard");
    } catch (err) {
      setError(getFirebaseAuthMessage(err));
      setLoading(false);
    } finally {
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-2xl mb-1">Login</h1>

      <TextField
        name="email"
        label="Email"
        variant="filled"
        value={formData.email}
        onChange={handleChange}
        disabled={loading}
        required
      />

      <TextField
        name="password"
        label="Password"
        type="password"
        variant="filled"
        value={formData.password}
        onChange={handleChange}
        disabled={loading}
        required
      />

      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>

      <div className="flex items-center gap-2">
        <Typography variant="body1">Don't have an account?</Typography>
        <Link href="/signup" className="text-center">
          <Button size="small">Create new account</Button>
        </Link>
      </div>

      {error && (
        <Alert severity="warning">
          <span className="font-medium">{error}</span>
        </Alert>
      )}
    </form>
  );
}
