'use client'

import { Container } from "@mui/material";
import Link from "next/link";

export default function Login() {

  const buttonStyles = "w-100 h-20 text-black bg-blue-200 text-4xl p-2 mb-5 m-auto";

  return (
    <Container className="flex flex-col p-50">
      <Link href={"/login"} className={buttonStyles}><button>Login</button></Link>
      <Link href={"/signup"} className={buttonStyles}><button>Sign Up</button></Link>
    </Container>
  );
}
