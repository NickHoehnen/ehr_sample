'use client'
import { Box, Paper } from "@mui/material";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100dvh",
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Paper 
        elevation={12} 
        sx={{ 
          p: 3, 
          borderRadius: 3, 
          width: '100%', 
          maxWidth: '450px',
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}