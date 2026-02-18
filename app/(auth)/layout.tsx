

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center pb-30">
      <div className="p-10 w-xl bg-gray-300 border border-gray-400 rounded-2xl shadow-2xl">
        {children}
        </div>
    </div>
  )
}