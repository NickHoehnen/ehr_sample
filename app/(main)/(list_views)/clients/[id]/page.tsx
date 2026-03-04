'use client'

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { ClientFields } from "@/app/types/client";
import { useParams } from "next/navigation";
import { Skeleton } from "@mui/material";

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

  if (loading || !client) return (
    <div className="space-y-4">
      <Skeleton variant="text" width="40%" height={40} />
      <div className="space-y-3 pt-4">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="55%" />
      </div>
    </div>
  );

  if (!user) return <div className="text-center text-red-500">Not authorized</div>;

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {client.firstName} {client.lastName}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Age</p>
          <p className="text-lg text-gray-900 dark:text-white mt-1">{client.age}</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Phone</p>
          <p className="text-lg text-gray-900 dark:text-white mt-1">{client.phone}</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Address</p>
          <p className="text-lg text-gray-900 dark:text-white mt-1">{client.streetAddress}</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">City</p>
          <p className="text-lg text-gray-900 dark:text-white mt-1">{client.city}</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">State</p>
          <p className="text-lg text-gray-900 dark:text-white mt-1">{client.state}</p>
        </div>
      </div>
    </div>
  );
}