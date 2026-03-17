"use client";

import { Container, Button, Typography, Box } from "@mui/material";
import Link from "next/link";

export default function AuthHome() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "95vh",
      }}
    >
      <Box className="p-8 border border-gray-400 rounded-2xl shadow-2xl w-lg flex flex-col gap-5">
        <h1 className="text-2xl mb-1">EHR System</h1>

        <Typography variant="body1">
          Welcome. Please login or create an account to continue.
        </Typography>

        <Link href="/login" className="w-full">
          <Button variant="contained" fullWidth size="large">
            Login
          </Button>
        </Link>

        <Link href="/signup" className="w-full">
          <Button variant="outlined" fullWidth size="large">
            Create an Account
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
