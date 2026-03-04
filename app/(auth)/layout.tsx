import { Container } from "@mui/material";


export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Container className="flex justify-center items-center pt-30">
      <div className="p-8 w-xl bg-gray-300 border border-gray-400 rounded-2xl shadow-2xl">
        {children}
      </div>
    </Container>
  )
}