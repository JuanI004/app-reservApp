import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand text-white">
      <div className="max-w-[1160px] mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-display font-[700]">
            Reserv<span className="text-[#9FE1CB]">App</span>
          </h2>
          <p className="mt-3 text-sm text-white/70 max-w-[320px]">
            Conectamos negocios uruguayos con sus clientes. Gestioná turnos,
            empleados y horarios desde un solo lugar.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#9FE1CB]">
            Producto
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li>
              <Link href="/Home" className="hover:text-white transition-colors">
                Explorar negocios
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-white transition-colors">
                Empezar gratis
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#9FE1CB]">
            Cuenta
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                Iniciar sesión
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-white transition-colors">
                Crear cuenta
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="max-w-[1160px] mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {new Date().getFullYear()} ReservApp. Todos los derechos reservados.</p>
          <p>Hecho en Uruguay 🇺🇾</p>
        </div>
      </div>
    </footer>
  );
}
