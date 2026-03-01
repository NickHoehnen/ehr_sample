'use client'

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { 
  Button, Dialog, DialogActions, DialogContent, DialogTitle, 
  Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Stack, TextField, CircularProgress, Typography, 
  useTheme, useMediaQuery 
} from "@mui/material";
import { collection, deleteDoc, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { ClientFields } from "../../types/client";
import { clientConverter } from "@/lib/converters";
import { useRouter } from "next/navigation";
import { Add, Delete, Person } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import Link from "next/link";

type FormErrors = {
  [key: string]: string;
}

// Simplified state: 'closed' | 'add' | 'delete'
type DialogState = 'closed' | 'add' | 'delete';

export default function Clients() {
  const [clients, setClients] = useState<ClientFields[] | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientFields | null>(null);
  const [dialogState, setDialogState] = useState<DialogState>('closed');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Mobile optimization: makes the dialog full-screen on small devices
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/');
      return;
    }

    const q = query(collection(db, "users", user.uid, "clients").withConverter(clientConverter));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const items: ClientFields[] = [];
      querySnapshot.forEach(doc => {
        items.push({ ...doc.data() });
      });
      setClients(items);
    });

    return unsub;
  }, [loading, user, router]);

  async function handleDeleteClient() {
    if (!selectedClient || !user) return;
    
    setIsSubmitting(true);
    try {
      const docRef = doc(db, "users", user.uid, "clients", selectedClient.id);
      await deleteDoc(docRef);
      handleCloseDialog();
    } catch (error) {
      console.error("Error deleting client:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAddClient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    setErrors({});
    const formData = new FormData(e.currentTarget);
    const firstName = (formData.get("fNameInp") as string).trim() || "";
    const lastName = (formData.get("lNameInp") as string).trim() || "";
    const ageStr = (formData.get("age") as string).trim() || "";
    const phone = (formData.get("phone") as string).trim() || "";
    const streetAddress = (formData.get("streetAddress") as string).trim() || "";
    const city = (formData.get("city") as string).trim() || "";
    const state = (formData.get("state") as string).trim() || "";
    const zip = formData.get("zip")?.toString() || "";

    const newErrors: Record<string, string> = {};

    if (!firstName) newErrors.fNameInp = "First name is required";
    if (!lastName) newErrors.lNameInp = "Last name is required";

    const age = Number(ageStr);
    if (!ageStr || isNaN(age) || age <= 0) {
      newErrors.age = "Please enter a valid age";
    }
    if (!phone || phone.length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop submission, but keep the dialog open so they can fix errors
    }

    setIsSubmitting(true);
    try {
      const clientsCollectionRef = collection(db, "users", user.uid, "clients");
      const newClientRef = doc(clientsCollectionRef);
      const newClientData: ClientFields = {
        id: newClientRef.id,
        firstName, lastName, age, phone,
        streetAddress, city, state, zip,
        trainerId: user.uid,
      };

      await setDoc(newClientRef, newClientData);
      handleCloseDialog();
    } catch (error) {
      console.error("Error adding client", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Safe close handler that ignores backdrop clicks while submitting
  function handleCloseDialog(event?: any, reason?: string) {
    if (reason === 'backdropClick' && isSubmitting) return;
    setDialogState('closed');
    setSelectedClient(null);
    setErrors({});
  }

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center p-8">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4 px-2">
        <Typography variant="h4" component="h1">Clients</Typography>
        <Button 
          size="medium" 
          onClick={() => setDialogState('add')} 
          variant="contained" 
          disableElevation
          startIcon={<Add />}
        >
          Add Client
        </Button>
      </div>

      {clients && clients.length === 0 ? (
        <Typography variant="body1" color="text.secondary" className="text-center p-8 border rounded-xl border-dashed">
          No clients found. Click "Add Client" to get started!
        </Typography>
      ) : (
        <List>
          <Stack spacing={1.5}>
            {clients?.map(client => (
              <ListItem
                disablePadding
                key={client.id}
                className="border rounded-xl shadow-sm bg-blue-100"
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    aria-label={`Delete ${client.firstName} ${client.lastName}`}
                    onClick={() => { 
                      setSelectedClient(client); 
                      setDialogState('delete'); 
                    }}
                  >
                    <Delete color="error" />
                  </IconButton>
                }
              >
                {/* Use Next.js Link for SPA navigation without full page reloads */}
                <ListItemButton component={Link} href={`/clients/${client.id}`} sx={{ borderRadius: '0.75rem' }}>
                  <ListItemIcon><Person color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary={`${client.firstName} ${client.lastName}`} 
                    secondary={client.phone}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </Stack>
        </List>
      )}

      {/* Unified Dialog Manager */}
      <Dialog 
        open={dialogState !== 'closed'} 
        onClose={handleCloseDialog}
        fullScreen={fullScreen && dialogState === 'add'} // Full screen on mobile for forms
        maxWidth="sm"
        fullWidth
      >
        {dialogState === 'add' && (
          <form onSubmit={handleAddClient} noValidate>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <TextField name="fNameInp" label="First Name" variant="outlined" error={!!errors.fNameInp} helperText={errors?.fNameInp} fullWidth disabled={isSubmitting} />
                </Grid>
                <Grid size={6}>
                  <TextField name="lNameInp" label="Last Name" variant="outlined" error={!!errors.lNameInp} helperText={errors?.lNameInp} fullWidth disabled={isSubmitting} />
                </Grid>
                <Grid size={6}>
                  <TextField name="phone" label="Phone" variant="outlined" error={!!errors.phone} helperText={errors?.phone} fullWidth disabled={isSubmitting} />
                </Grid>
                <Grid size={6}>
                  <TextField name="age" label="Age" type="number" variant="outlined" error={!!errors.age} helperText={errors?.age} fullWidth disabled={isSubmitting} />
                </Grid>
                <Grid size={6}>
                  <TextField name="streetAddress" label="Street Address" variant="outlined" fullWidth disabled={isSubmitting} />
                </Grid>
                <Grid size={6}>
                  <TextField name="city" label="City" variant="outlined" fullWidth disabled={isSubmitting} />
                </Grid>
                <Grid size={6}>
                  <TextField name="state" label="State" variant="outlined" fullWidth disabled={isSubmitting} />
                </Grid>
                <Grid size={6}>
                  <TextField name="zip" label="Zip Code" variant="outlined" fullWidth disabled={isSubmitting} />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleCloseDialog} disabled={isSubmitting} color="inherit">Cancel</Button>
              <LoadingButton loading={isSubmitting} variant="contained" type="submit" disableElevation>
                Save Client
              </LoadingButton>
            </DialogActions>
          </form>
        )}

        {dialogState === 'delete' && (
          <>
            <DialogTitle>Delete Client?</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete <strong>{selectedClient?.firstName} {selectedClient?.lastName}</strong>? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleCloseDialog} disabled={isSubmitting} color="inherit">Cancel</Button>
              <LoadingButton loading={isSubmitting} variant="contained" color="error" disableElevation onClick={handleDeleteClient}>
                Delete
              </LoadingButton>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  )
}