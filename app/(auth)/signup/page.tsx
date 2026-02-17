'use client'

import { createUserWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { TextField, Button } from "@mui/material";

export default function Signup() {
  const router = useRouter();

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error) {
      alert('Error creating user: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div>
      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <h1 className="text-2xl mb-3">Sign Up</h1>
        <TextField name="email" label="Email" variant="filled"></TextField>
        <TextField name="password" label="Password" type="password" variant="filled"></TextField>
        <Button type="submit">Done</Button>
      </form>
    </div>
  )
}