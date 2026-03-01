// (list_views) layout


export default function listsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex  justify-center w-full">
      <div className="py-2 px-4 w-xl border rounded-xl bg-gray-300 min-h-50">
        {children}
      </div>
    </div>
  )
}