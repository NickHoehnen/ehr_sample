'use client'

import { List, ListItem, ListItemAvatar, ListItemText, ListItemButton, Button, IconButton, Container, Avatar, Dialog, DialogTitle, DialogContent } from "@mui/material"
import { auth, db } from "@/lib/firebase";
import { getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore"; // Added deleteDoc, doc
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext";
import { ClientFields } from "../types/client";
import { useRouter } from "next/navigation";
import QuickForm from "../components/QuickForm";
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import { Delete } from "@mui/icons-material";

export default function Clients() {
  const [clients, setClients] = useState<ClientFields[]>([])
  const [addingClient, setAddingClient] = useState(false);
  const { user, loading } = useAuth();

  const router = useRouter();

  // 1. Refactored Fetch Logic
  // It is best practice to keep this reusable so we can call it after adding/deleting
  const fetchClients = async () => {
    if (!user) return;
    
    // TODO: Ideally, you should filter this by the logged-in user (e.g., trainerId)
    const q = query(collection(db, "users"), where("trainerId", "==", user.uid));
    
    try {
        const snapshot = await getDocs(q)
        const clientsList = snapshot.docs.map(doc => ({
            ...doc.data(),
            userId: doc.id // Ensure we grab the actual Firestore ID if it's not in the data
        })) as ClientFields[]
        setClients(clientsList);
    } catch (error) {
        console.error("Error fetching clients:", error);
    }
  }

  useEffect(() => {
    fetchClients();
  }, [user])

  // 2. Delete Handler
  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this client?")) return;

    try {
        await deleteDoc(doc(db, "users", id));
        // Optimistically update UI (remove from list immediately)
        setClients(prev => prev.filter(c => c.userId !== id));
    } catch (error) {
        console.error("Error deleting client:", error);
        alert("Failed to delete client");
    }
  }

  // 3. Close Handler for the Form
  const handleCloseForm = (refresh?: boolean) => {
      setAddingClient(false);
      if(refresh) fetchClients(); // Re-fetch if a new user was added
  }

  if(loading) return <div>Loading...</div>
  if(!user) return <div>Not logged in!</div>

  return (
    <div className="w-full px-4 md:px-40 py-10"> {/* Added responsive padding */}
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button 
            variant="contained" 
            startIcon={<AddIcon />} // Cleaner UI than just the icon
            onClick={() => setAddingClient(true)}
        >
            Add Client
        </Button>
      </div>

      <List>
        {clients.length > 0 ? 
          clients.map(client => (
              <ListItem 
                key={client.userId}
                className="border rounded-xl mb-3 shadow-sm hover:shadow-md transition-shadow bg-white"
                disablePadding // needed because we use ListItemButton inside
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    aria-label="delete" 
                    onClick={() => handleDelete(client.userId)}
                    color="error" // Make the trash can red
                  >
                    <Delete />
                  </IconButton>
                }
              >
                {/* 4. Make the item clickable using ListItemButton */}
                <ListItemButton onClick={() => router.push(`/clients/${client.userId}`)}>
                    <ListItemAvatar>
                        <Avatar className="bg-blue-500">
                            <PersonIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${client.firstName} ${client.lastName}`}
                      secondary={client.userId} // Email is usually better than ID for secondary text
                    />
                </ListItemButton>
              </ListItem>
          ))
          : <div className="text-center text-gray-500 mt-10">No clients found. Add one to get started!</div>
      }
      </List>

      {/* 5. The Add Client Dialog */}
      {/* I replaced Popper with Dialog. Poppers are for tooltips; Dialogs are for forms. */}
      <Dialog 
        open={addingClient} 
        onClose={() => handleCloseForm()}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
            {/* Pass the close handler to QuickForm so it can close the modal on success */}
            <QuickForm onSuccess={() => handleCloseForm(true)} onCancel={() => handleCloseForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}