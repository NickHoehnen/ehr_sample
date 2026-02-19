'use client'

import { useState } from "react";
import { TextField, Button, Stack, Alert, Box } from "@mui/material";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Ensure this matches your path
import { LoadingButton } from "@mui/lab"; // Standard MUI Lab component for buttons with loading state
import { useAuth } from "@/context/AuthContext";

interface QuickFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function QuickForm({ onSuccess, onCancel }: QuickFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic Validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("First Name, Last Name, and Email are required.");
      setLoading(false);
      return;
    }

    try {
      // Add a new document with a generated id.
      await addDoc(collection(db, "users"), {
        ...formData,
        createdAt: serverTimestamp(),
        role: "client", // defaulting new entries to client
        isActive: true,
        trainerId: user?.uid,
      });

      // Clear form and notify parent
      setFormData({ firstName: "", lastName: "", email: "", phone: "" });
      onSuccess();

    } catch (err: any) {
      console.error("Error adding client:", err);
      setError("Failed to add client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}

        <Stack direction="row" spacing={2}>
          <TextField
            autoFocus
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            variant="filled"
          />
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            variant="filled"
          />
        </Stack>

        <TextField
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
            variant="filled"
        />

        <TextField
          fullWidth
          id="phone"
          label="Phone Number (Optional)"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
            variant="filled"
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={onCancel} 
            disabled={loading}
          >
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
          >
            Add Client
          </LoadingButton>
        </Stack>
      </Stack>
    </Box>
  );
}