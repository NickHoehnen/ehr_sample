'use client'

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { ClientFields } from "@/app/types/client";
import { useParams } from "next/navigation";
import { CircularProgress } from "@mui/material";

export default function ClientView() {
  const params = useParams();
  const id = params.id as string;
  const { user, loading } = useAuth();
  const [client, setClient] = useState<ClientFields | null>(null);

  useEffect(() => {
    if (!loading && user) {
      const fetchClient = async () => {
        const docRef = doc(db, "users", user.uid, "clients", id);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          setClient(snapshot.data() as ClientFields);
        } else {
          setClient(null);
        }
      };

      fetchClient();
    }
  }, [user, loading, id]);

  if (loading || !client) return <div className="text-center"><CircularProgress size="1rem" /></div>;
  if (!user) return <div className="text-center">Not authorized</div>;

  return (
    <div>
      <h1>{client.firstName} {client.lastName}</h1>
      <p>Age: {client.age}</p>
      <p>Phone: {client.phone}</p>
      <p>Address: {client.streetAddress}</p>
      <p>City: {client.city}</p>
      <p>State: {client.state}</p>
    </div>
  );
}