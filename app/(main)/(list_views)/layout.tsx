export default function ListsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full animate-in fade-in duration-300">
      {children}
    </div>
  )
}