
import NavCard from "../components/NavCard"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="flex gap-5 justify-center">
      <NavCard type="Profile" href="/profile" />
      <NavCard type="Clients" href="/clients" />
    </div>
  )
}

