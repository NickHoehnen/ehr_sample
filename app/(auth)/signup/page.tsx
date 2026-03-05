"use client";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { TextField, Button, Alert, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { UserFields } from "@/app/types/user";
import { getFirebaseAuthMessage } from "@/lib/firebaseErrors";
import dayjs, { Dayjs } from "dayjs";
import Link from "next/link";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthdate: Dayjs | null;
};

async function addUserDoc(userFields: UserFields, userId: string) {
  await setDoc(doc(db, "users", userId), userFields);
}

export default function Signup() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    birthdate: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBirthdateChange = (date: Dayjs | null) => {
    setError(null);
    setFormData((prev) => ({
      ...prev,
      birthdate: date,
    }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
      birthdate,
    } = formData;

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName ||
      !birthdate
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      await sendEmailVerification(userCredential.user);

      const userUid = userCredential.user.uid;

      await addUserDoc(
        {
          id: userUid,
          email,
          firstName,
          lastName,
          birthdate: birthdate.toISOString(),
          phone,
          dateCreated: new Date(),
          role: "client",
        },
        userUid,
      );

      router.push("/dashboard");
    } catch (err) {
      setError(getFirebaseAuthMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <h1 className="text-2xl mb-1">Sign Up</h1>

        <TextField
          name="email"
          label="Email"
          variant="filled"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <TextField
          name="password"
          label="Password"
          type="password"
          variant="filled"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          variant="filled"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <TextField
          name="firstName"
          label="First Name"
          variant="filled"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <TextField
          name="lastName"
          label="Last Name"
          variant="filled"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <TextField
          name="phone"
          label="Phone"
          variant="filled"
          value={formData.phone}
          onChange={handleChange}
        />

        <DatePicker
          label="Birthdate"
          value={formData.birthdate}
          onChange={handleBirthdateChange}
          className="bg-[rgb(195,195,195)]"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
        <Link href="/login" className="text-center">
          <Button size="small">Login to existing account</Button>
        </Link>

        {error && (
          <Alert sx={{ scale: 1.05 }} severity="warning">
            <span className="font-medium">{error}</span>
          </Alert>
        )}
      </form>
    </div>
  );
}
