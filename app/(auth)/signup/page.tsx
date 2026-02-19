'use client'

import { createUserWithEmailAndPassword, updateProfile, User } from "firebase/auth"
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { TextField, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import {Alert} from "@mui/material";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserFields } from "@/app/types/user";



async function addUserDoc(userFields: UserFields, userId: string) {
  try {
    const docRef = await setDoc(doc(db, "users", userId), {
      ...userFields
    })
  }
  catch(e) {
    console.log("Error adding user doc: ", e)
  }
}

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const birthdate = formData.get('birthdate') as string;
    const phone = formData.get('phone') as string;

    if (!email || !password || !confirmPassword || !firstName || !lastName || !birthdate) {
      alert('Please fill in all fields');
      return;
    }

    if(password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userUid = userCredential.user.uid;
      addUserDoc({ id: userUid, email, firstName, lastName, birthdate, phone, dateCreated: new Date()}, userUid);
      router.push('/dashboard');
      setLoading(false)
    } catch (error) {
      if(error instanceof Error) {
        setError(error)
        alert('Error creating user: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  return (
      <div>
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <h1 className="text-2xl mb-3">Sign Up</h1>
          <TextField name="email" label="Email" variant="filled"></TextField>
          <TextField name="password" label="Password" type="password" variant="filled"></TextField>
          <TextField name="confirmPassword" label="Confirm Password" type="password" variant="filled"></TextField>
          <TextField name="firstName" label="First Name" variant="filled"></TextField>
          <TextField name="lastName" label="Last Name" variant="filled"></TextField>
          <TextField name="phone" label="Phone" variant="filled"></TextField>
          <DatePicker name="birthdate" label="Birthdate" className="bg-[#c5c8cf]"></DatePicker>
          <Button type="submit" variant="contained" disabled={loading}>{loading ? "Signing up..." : "Done"}</Button>
        </form>
          {(error && error instanceof Error) ?
            <Alert severity="warning">
              <span className="font-medium">Test</span>
            </Alert>
            : ""}
      </div>
    
  )
}