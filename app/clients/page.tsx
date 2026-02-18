'use client'

import { List, ListItem, ListItemAvatar, ListItemText, ListItemButton } from "@mui/material"
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext";

type Client = {
  firstName: string;
  lastName: string;
  age: number;
  phone: string;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const { user, loading } = useAuth()


  if(loading) return <div>Loading...</div>
  if(!user) return <div>Not logged in!</div>
  
  return (
    <div>Clients</div>
  )
}