import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed flex justify-between items-center top-0 w-screen bg-[#2563EB] text-white px-4 py-6">
      <h1 className="text-xl font-bold">ReservApp</h1>
      <ul className="flex gap-6">
        <li>
          <Link href="/login">Iniciar Sesion</Link>
        </li>
        <li>
          <Link href="/signup">Registrarse</Link>
        </li>
      </ul>
    </header>
  );
}
