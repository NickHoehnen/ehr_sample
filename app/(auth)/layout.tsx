// (auth) Layout

import { Container } from "@mui/material";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <div className="p-5 bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl w-lg">
        {children}
      </div>
    </Container>
  );
}
